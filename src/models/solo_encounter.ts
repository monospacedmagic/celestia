/* eslint-disable prettier/prettier */
import assert from 'assert';
import { ComponentActionRow, ComponentSelectOption, ComponentType, Message, MessageEmbed, MessageInteractionContext } from 'slash-create';
import {
  Ally,
  Character,
  CharacterLearnedSkill,
  Element,
  Encounter,
  Enemy,
  Party,
  Player,
  PlayerLearnedSkill,
  Prisma,
  PrismaPromise,
  SoloEncounterState,
  WeaponType
} from '@prisma/client';
import { prisma } from '../db';
import { CELESTIA_COLOR, CELESTIA_EMOJI, PartialEmoji } from '../util';
import {
  ElementEmoji,
  ELEMENT_EMOJI_MAP,
  Parties,
  Skill,
  StatusEffect,
  WeaponTypeEmoji,
  WEAPONTYPE_EMOJI_MAP
} from '.';
import { SkillSlot, SkillTarget } from './skill';
import { ActiveStatusEffect } from './status_effect';
import { randomInt } from 'crypto';
import { SkillEffectResult } from './skill_effect';

export declare type LoadedPlayer = Player & { learnedSkills: PlayerLearnedSkill[]; }

export declare type LoadedAlly = Ally & {
  character: Character & {
    learnedSkills: CharacterLearnedSkill[];
  };
};

export declare type LoadedEnemy = Enemy & {
  character: Character & {
    learnedSkills: CharacterLearnedSkill[];
  };
};

export declare type LoadedState = SoloEncounterState & {
  player: Player & {
    learnedSkills: PlayerLearnedSkill[];
  };
  encounter: Encounter;
  allies: LoadedAlly[];
  enemies: LoadedEnemy[];
};

export interface RawInteraction {
  power: number;
  accuracy: number;
  element: Element;
  weaponType: WeaponType;
}

export class SoloEncounter {
  private constructor(state: LoadedState, allies: LoadedAlly[], enemies: LoadedEnemy[], encounter: Encounter) {
    this.state = state;
    this.allies = allies;
    this.enemies = enemies;
    this.encounter = encounter;
  }

  private state: LoadedState;
  public allies: LoadedAlly[];
  public enemies: LoadedEnemy[];
  private encounter: Encounter;
  private logEntries: string[] = [];
  private transactionQueue: PrismaPromise<any>[]

  public get title(): string {
    return this.encounter.title;
  }

  public get text(): string {
    return (
      `${CELESTIA_EMOJI} ***${this.title}*** ${CELESTIA_EMOJI}` +
      `\n\n` +
      `**Zugreihenfolge**\n` +
      `${this.turnOrderAsText}`
    );
  }

  public get turnOrderAsText(): string {
    const turnOrder = this.turnOrder;
    return turnOrder
      .map((allyOrEnemy) => {
        return SoloEncounter.formatCharacter(allyOrEnemy);
      })
      .join('\n');
  }

  public get turnOrder(): (LoadedAlly | LoadedEnemy)[] {
    // TODO Calculate turn order properly
    return this.allies.concat(this.enemies);
  }

  public get logAsEmbed(): MessageEmbed {
    return {
      type: 'rich',
      title: 'Log',
      description: this.logEntries.join('\n\n'),
      color: CELESTIA_COLOR
    };
  }

  public get components(): ComponentActionRow[] {
    const skillOptions: ComponentSelectOption[] = this.state.player.learnedSkills
      .filter((learnedSkill) => {
        return (
          learnedSkill.equippedIn &&
          learnedSkill.equippedIn != SkillSlot.SPECIAL &&
          !Skill.skills[learnedSkill.skillName].passive
        );
      })
      .map((learnedSkill) => {
        return Skill.render({
          skill: Skill.skills[learnedSkill.skillName],
          slot: learnedSkill.equippedIn,
          cooldown: this.state.playerSkillCooldowns[learnedSkill.skillName]
        });
      });
    const specialSkillOptions: ComponentSelectOption[] = this.state.player.learnedSkills
      .filter((learnedSkill) => {
        return (
          learnedSkill.equippedIn &&
          learnedSkill.equippedIn == SkillSlot.SPECIAL &&
          !Skill.skills[learnedSkill.skillName].passive
        );
      })
      .map((learnedSkill) => {
        return Skill.render({
          skill: Skill.skills[learnedSkill.skillName],
          slot: learnedSkill.equippedIn,
          cooldown: this.state.playerSkillCooldowns[learnedSkill.skillName]
        });
      });
    var _components: ComponentActionRow[] = this.enemies.map((enemy, index) => {
      const custom_id: string = `attack_${index}_select`;

      var _component: ComponentActionRow = {
        type: ComponentType.ACTION_ROW,
        components: [
          {
            type: ComponentType.SELECT,
            custom_id,
            placeholder: `Angriff: ${enemy.character.name}`,
            min_values: 1,
            max_values: 1,
            options: skillOptions ? skillOptions : [{label: 'Disabled', value: 'disabled'}],
            disabled: !skillOptions || !enemy.hp
          }
        ]
      };
      return _component;
    });
    if (specialSkillOptions) {
      _components.push({
        type: ComponentType.ACTION_ROW,
        components: [
          {
            type: ComponentType.SELECT,
            custom_id: 'special_move_select',
            placeholder: `Spezialangriff / Manöver`,
            min_values: 1,
            max_values: 1,
            options: specialSkillOptions ? specialSkillOptions : [{label: 'Disabled', value: 'disabled'}],
            disabled: !specialSkillOptions && !this.state.player.learnedSkills.filter((learnedSkill) => {
              Skill.skills[learnedSkill.skillName].canTargetAllies
            })
          }
        ]
      });
    }
    return _components;
  }

  public static async fetch(userId: bigint, messageId: bigint): Promise<SoloEncounter | null> {
    var state: LoadedState = await prisma.soloEncounterState.findUnique({
      where: {
        messageId
      },
      include: {
        player: {
          include: {
            learnedSkills: true
          }
        },
        encounter: true,
        allies: {
          include: {
            character: {
              include: {
                learnedSkills: true
              }
            }
          }
        },
        enemies: {
          include: {
            character: {
              include: {
                learnedSkills: true
              }
            }
          }
        }
      }
    }) as LoadedState | null;

    if (!state) return null;
    return new SoloEncounter(state, state.allies, state.enemies, state.encounter);
  }

  public static async create(userId: bigint, encounterName: string) {
    var encounter = await prisma.encounter.findUnique({
      where: {
        name: encounterName
      },
      include: {
        enemies: true
      }
    });
    assert(encounter, 'No encounter with this name.');

    var allyCharacters: Character[] = await prisma.character.findMany({
      where: {
        ownerId: userId,
        isDeployed: true
      }
    });
    var enemyCharacters: Character[] = encounter.enemies;

    var state: LoadedState = (await prisma.soloEncounterState.create({
      data: {
        encounter: { connect: { name: encounterName } },
        player: { connect: { userId: userId } },
        allies: {
          create: allyCharacters.map(({ id, maxHp, energy, defaultStatusEffects }) => ({
            character: { connect: { id } },
            hp: maxHp,
            energy,
            statusEffects: defaultStatusEffects,
            skillCooldowns: {}
          }))
        },
        enemies: {
          create: enemyCharacters.map(({ id, maxHp, energy, defaultStatusEffects }) => ({
            character: { connect: { id } },
            hp: maxHp,
            energy,
            statusEffects: defaultStatusEffects,
            skillCooldowns: {}
          }))
        },
        playerSkillCooldowns: {}
      },
      include: {
        player: {
          include: {
            learnedSkills: true
          }
        },
        encounter: true,
        allies: {
          include: {
            character: {
              include: {
                learnedSkills: true
              }
            }
          }
        },
        enemies: {
          include: {
            character: {
              include: {
                learnedSkills: true
              }
            }
          }
        }
      }
    })) as LoadedState;

    return new SoloEncounter(state, state.allies, state.enemies, state.encounter);
  }

  public static formatCharacter(allyOrEnemy: LoadedAlly | LoadedEnemy) {
    const character: Character & { learnedSkills: CharacterLearnedSkill[] } = allyOrEnemy.character;
    const element: Element = character.element;
    const elementEmoji: ElementEmoji = ELEMENT_EMOJI_MAP[element];
    const weaponType: WeaponType = character.weaponType;
    const weaponTypeEmoji: WeaponTypeEmoji = WEAPONTYPE_EMOJI_MAP[weaponType];
    var hpColumns: number;
    if (allyOrEnemy.hp == character.maxHp) {
      hpColumns = 10;
    } else {
      hpColumns = Math.ceil((allyOrEnemy.hp * 9) / character.maxHp);
    }
    const hpBar: string = '`' + '█'.repeat(hpColumns) + ' '.repeat(10 - hpColumns) + '`';
    var party: PartialEmoji;
    if (allyOrEnemy.party == Party.ALLY) {
      party = Parties.ALLY;
    } else {
      party = Parties.ENEMY;
    }
    const energy: number = allyOrEnemy.energy;
    const skills: Skill[] = character.learnedSkills
      .filter((skill) => Boolean(skill.equippedIn))
      .map((skill) => Skill.skills[skill.skillName]);
    var energyText: string;
    var specialSkill: Skill | undefined = skills.find(({ slot }) => slot == SkillSlot.SPECIAL);
    if (specialSkill) {
      const maxEnergy: number = specialSkill.energyCost;
      energyText = ` (${energy}/${maxEnergy})`;
    } else {
      energyText = '';
    }
    var statusText: string;
    if (allyOrEnemy.statusEffects) {
      const statusEffectsObj = allyOrEnemy.statusEffects as Prisma.JsonObject;
      const statusEffects: ActiveStatusEffect[] = Object.getOwnPropertyNames(statusEffectsObj).map(
        (statusEffectName: string) => {
          const { 0: name, 1: level } = statusEffectName.split('_');
          return {
            name,
            level: level ? Number(level) : undefined,
            statusEffect: StatusEffect.statusEffects[name],
            turnsLeft: statusEffectsObj[statusEffectName] as number
          };
        }
      ).filter((ase: ActiveStatusEffect) => ase.statusEffect.emoji != null);
      statusText = ` [${statusEffects
        .map((statusEffect: ActiveStatusEffect) => StatusEffect.render(statusEffect))
        .join('|')}]`;
    } else {
      statusText = '';
    }

    return `${elementEmoji}${weaponTypeEmoji}┊${hpBar}┊${party} **${character.name}**${energyText}${statusText}`;
  }

  async startEncounter(ctx: MessageInteractionContext) {
    await ctx.defer();
    this.logEntries.push('Wähle einen Gegner und dann eine Fähigkeit aus der Liste.');
    var message: Message = await ctx.editOriginal(this.text, { embeds: [this.logAsEmbed], components: this.components });
    this.logEntries.splice(0);
    await prisma.soloEncounterState.update({
      where: {id: this.state.id},
      data: {messageId: BigInt(message.id)}
    })
  }

  async updateEncounter(ctx: MessageInteractionContext) {
    await ctx.editOriginal(this.text, { embeds: [this.logAsEmbed], components: this.components });
    this.logEntries.splice(0);
  }

  async handlePlayerInput(selectNum: number, skillName: string) {
    const skill: Skill = Skill.skills[skillName];
    if (skill.target == SkillTarget.SINGLE) {
      await this.handleSkillUsage(this.state.player, skill, this.state.enemies[selectNum])
    }
    await prisma.$transaction(this.transactionQueue);
    this.transactionQueue.splice(0);
  }

  async handleSkillUsage(user: LoadedPlayer | LoadedAlly | LoadedEnemy, skill: Skill, ...targets: (LoadedAlly | LoadedEnemy)[]) {
    const userIsPlayer: boolean = ('userId' in user);
    var userStr: string;
    var failed: boolean = false;
    var learnedSkills: (PlayerLearnedSkill | CharacterLearnedSkill)[]
    if (userIsPlayer) {
      userStr = 'Du verwendest';
      learnedSkills = (user as LoadedPlayer).learnedSkills;
    } else {
      const character: Character & { learnedSkills: CharacterLearnedSkill[] } = (user as LoadedAlly | LoadedEnemy).character;
      userStr = `${character.name} verwendet`
      learnedSkills = character.learnedSkills;
    }
    var effectText: string = '';
    for (const effect of skill.effects) {
      const effectResult: SkillEffectResult = effect(this, user, ...targets);
      if (effectResult.text) effectText = ` ${effectResult.text}`;
      if (effectResult.failed) failed = true;
    }
    for (const target of targets) {
      var interaction: RawInteraction = {
        power: skill.power * ((100 - 8 + randomInt(0, 16)) / 100),
        accuracy: skill.accuracy,
        element: skill.element,
        weaponType: skill.weaponType
      }
      const statusEffectsObj = target.statusEffects as Prisma.JsonObject;
      const statusEffects: ActiveStatusEffect[] = Object.getOwnPropertyNames(statusEffectsObj).map(
        (statusEffectName: string) => {
          const { 0: name, 1: level } = statusEffectName.split('_');
          return {
            name,
            level: level ? Number(level) : undefined,
            statusEffect: StatusEffect.statusEffects[name],
            turnsLeft: statusEffectsObj[statusEffectName] as number
          };
        }
      )
      for (const statusEffect of statusEffects) {
        if ('attacked' in statusEffect.statusEffect.hooks) {
          statusEffect.statusEffect.hooks.attacked(this, target, user, interaction)
        }
      }
      interaction.power = Math.round(interaction.power);
      let logEntry: string = `${userStr} **${skill.name}** auf ${target.character.name}; `
      logEntry += interaction.power == 0
      ? ''
      : interaction.power > 0
      ? `${target.character.name} nimmt ${interaction.power} Schaden.`
      : `${target.character.name} heilt ${interaction.power} HP.`;
      if (effectText) logEntry += effectText;
      this.logEntries.push(logEntry);
      if (interaction.power) {
        target.hp = Math.min(Math.max(0, target.hp - interaction.power), target.character.maxHp);
      }
      if (target.party == Party.ALLY) {
        this.transactionQueue.push(prisma.ally.update({
          where: {
            id: target.id
          },
          data: {
            hp: target.hp,
            energy: target.energy,
            statusEffects: target.statusEffects
          }
        }))
      }
    }
    if (!failed) {
      let maxEnergy: number = 0;
      const skills: Skill[] = learnedSkills
        .filter((_skill) => Boolean(_skill.equippedIn))
        .map((_skill) => Skill.skills[_skill.skillName]);

      var specialSkill: Skill | undefined = skills.find(({ slot }) => slot == SkillSlot.SPECIAL);
      if (specialSkill) maxEnergy = specialSkill.energyCost;
      user.energy = Math.max(0, Math.min(user.energy + skill.energyReward, maxEnergy));
      if (userIsPlayer) {
        this.state.playerSkillCooldowns[skill.name] = skill.cooldown;
      } else {
        (user as (LoadedAlly | LoadedEnemy)).skillCooldowns[skill.name] = skill.cooldown;
      }
    }
    if (userIsPlayer) {
      const player: LoadedPlayer = (user as LoadedPlayer);
      this.transactionQueue.push(
        prisma.player.update({
          where: {
            userId: player.userId
          },
          data: {
            energy: player.energy
          }
        }),
        prisma.soloEncounterState.update({
          where: {
            id: this.state.id
          },
          data: {
            playerSkillCooldowns: this.state.playerSkillCooldowns
          }
        })
      )
    } else {
      const allyOrEnemy: (LoadedAlly | LoadedEnemy) = (user as (LoadedAlly | LoadedEnemy));
      const updateArgs = {
        where: {
          id: allyOrEnemy.id
        },
        data: {
          hp: Math.min(Math.max(0, allyOrEnemy.hp), allyOrEnemy.character.maxHp),
          energy: Math.max(0, allyOrEnemy.energy),
          statusEffects: allyOrEnemy.statusEffects,
          skillCooldowns: allyOrEnemy.skillCooldowns
        }
      };
      if (allyOrEnemy.party == Party.ALLY) {
        this.transactionQueue.push(prisma.ally.update(updateArgs));
      } else {
        this.transactionQueue.push(prisma.enemy.update(updateArgs));
      };
    }
  }
}
