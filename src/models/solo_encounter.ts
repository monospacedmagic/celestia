import assert from 'assert';
import { ComponentActionRow, MessageEmbed, MessageInteractionContext } from 'slash-create';
import {
  Ally,
  Character,
  CharacterLearnedSkill,
  Element,
  Encounter,
  Enemy,
  Party,
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
import { SkillSlot } from './skill';

export class SoloEncounter {
  private constructor(
    state: SoloEncounterState,
    allies: (Ally & { character: Character & { learnedSkills: CharacterLearnedSkill[] } })[],
    enemies: (Enemy & { character: Character & { learnedSkills: CharacterLearnedSkill[] } })[],
    encounter: Encounter
  ) {
    this.state = state;
    this.allies = allies;
    this.enemies = enemies;
    this.encounter = encounter;
    this.logEntries = [];
  }

  private state: SoloEncounterState;
  public allies: (Ally & { character: Character & { learnedSkills: CharacterLearnedSkill[] } })[];
  public enemies: (Enemy & { character: Character & { learnedSkills: CharacterLearnedSkill[] } })[];
  private encounter: Encounter;
  private logEntries: string[];

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
    let turnOrder = this.turnOrder;
    return turnOrder
      .map((allyOrEnemy) => {
        return SoloEncounter.formatCharacter(allyOrEnemy);
      })
      .join('\n');
  }

  public get turnOrder(): ((Ally | Enemy) & { character: Character & { learnedSkills: CharacterLearnedSkill[] } })[] {
    // TODO Calculate turn order properly
    return this.allies.concat(this.enemies);
  }

  public get logAsEmbed(): MessageEmbed {
    return {
      type: 'rich',
      title: 'Log',
      description: this.logEntries.join('\n'),
      color: CELESTIA_COLOR
    };
  }

  public get components(): ComponentActionRow[] {
    // TODO
    return [];
  }

  public static async create(userId: number, encounterName: string) {
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

    var state = await prisma.soloEncounterState.create({
      data: {
        encounterName: encounterName,
        playerId: userId,
        allies: {
          create: allyCharacters.map(({ id, maxHp, energy, defaultStatusEffects }) => ({
            characterId: id,
            hp: maxHp,
            energy,
            statusEffects: defaultStatusEffects
          }))
        },
        enemies: {
          create: enemyCharacters.map(({ id, maxHp, energy, defaultStatusEffects }) => ({
            characterId: id,
            hp: maxHp,
            energy,
            statusEffects: defaultStatusEffects
          }))
        }
      },
      include: {
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
    });

    return new SoloEncounter(state, state.allies, state.enemies, encounter);
  }

  public static formatCharacter(
    allyOrEnemy: (Ally | Enemy) & { character: Character & { learnedSkills: CharacterLearnedSkill[] } }
  ) {
    let character: Character & { learnedSkills: CharacterLearnedSkill[] } = allyOrEnemy.character;
    let element: Element = character.element;
    let elementEmoji: ElementEmoji = ELEMENT_EMOJI_MAP[element];
    let weaponType: WeaponType = character.weaponType;
    let weaponTypeEmoji: WeaponTypeEmoji = WEAPONTYPE_EMOJI_MAP[weaponType];
    var hpColumns: number;
    if (allyOrEnemy.hp == character.maxHp) {
      hpColumns = 10;
    } else {
      hpColumns = Math.ceil((allyOrEnemy.hp * 9) / character.maxHp);
    }
    let hpBar: string = '`' + '█'.repeat(hpColumns) + ' '.repeat(10 - hpColumns) + '`';
    var party: PartialEmoji;
    if (allyOrEnemy.party == Party.ALLY) {
      party = Parties.ALLY;
    } else {
      party = Parties.ENEMY;
    }
    let energy: number = allyOrEnemy.energy;
    let skills: Skill[] = character.learnedSkills
      .filter((skill) => Boolean(skill.equippedIn))
      .map((skill) => Skill.skills[skill.skillName]);
    var energyText: string;
    var specialSkill: Skill | undefined = skills.find(({ slot }) => slot == SkillSlot.SPECIAL);
    if (specialSkill) {
      let maxEnergy: number = specialSkill.energyCost;
      energyText = ` (${energy}/${maxEnergy})`;
    } else {
      energyText = '';
    }
    var statusText: string;
    if (allyOrEnemy.statusEffects) {
      let statusEffects: StatusEffect[] = allyOrEnemy.statusEffects.map(
        (statusEffect) => StatusEffect.statusEffects[statusEffect]
      );
      statusText = ` [${statusEffects.join('')}]`;
    } else {
      statusText = '';
    }

    return `${elementEmoji}${weaponTypeEmoji}┊${hpBar}┊${party} **${character.name}**${energyText}${statusText}`;
  }

  async startEncounter(ctx: MessageInteractionContext) {
    await ctx.defer();
    await ctx.send(this.text, { embeds: [this.logAsEmbed], components: this.components });
  }
}
