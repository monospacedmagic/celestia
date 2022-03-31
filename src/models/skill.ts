import { SkillSlot } from '@prisma/client';
import { ComponentSelectOption } from 'slash-create';
export { SkillSlot };
import { SkillEffect, Element, WeaponType, ElementEmoji, WeaponTypeEmoji, ELEMENT_EMOJI_MAP, WEAPONTYPE_EMOJI_MAP } from '.';
import { PartialEmoji } from '../util';

export enum SkillTarget {
  /** target a single enemy or ally */
  SINGLE = 'SINGLE',
  /** target all enemies or all allies */
  ALL = 'ALL',
  /** random target for each hit */
  RANDOM = 'RANDOM',
  /** target all allies and enemies */
  EVERYONE = 'EVERYONE',
  /** random target amongst allies and enemies for each hit */
  RANDOM_EVERYONE = 'RANDOM_EVERYONE'
}

interface SkillAttributes {
  description?: string;
  passive?: boolean; // default: false
  element?: Element; // default: Element.NONE
  weaponType?: WeaponType; // default: WeaponType.NONE
  emoji?: PartialEmoji; // default: undefined (infer from element or weaponType if NONE) (null means no emoji should be shown)
  target?: SkillTarget; // default: SkillTarget.SINGLE
  canTargetAllies?: boolean; // default: false
  numberOfHits?: number; // default: 1
  power?: number; // default: 0
  accuracy?: number; // default: null
  cooldown?: number; // default: 0
  energyReward?: number; // default: 0
  energyCost?: number; // default: 0
}

export class Skill {
  public static skills: Map<string, Skill> = new Map<string, Skill>();

  public name: string;
  public slot: SkillSlot;
  public description?: string = '';
  public passive: boolean = false;
  public element: Element = Element.NONE;
  public weaponType: WeaponType = WeaponType.NONE;
  public emoji?: PartialEmoji;
  public target: SkillTarget = SkillTarget.SINGLE;
  public canTargetAllies: boolean = false;
  public numberOfHits: number = 1;
  public power: number = 0;
  public accuracy?: number = null;
  public cooldown: number = 0;
  public energyReward: number = 0;
  public energyCost: number = 0;

  public effects?: SkillEffect[] = [];

  constructor(name: string, slot: SkillSlot, attributes: SkillAttributes) {
    this.name = name;
    this.slot = slot;
    Object.assign(this, attributes);
    Skill.skills[name] = this;
  }

  addEffect(effect: SkillEffect): Skill {
    this.effects.push(effect);
    return this;
  }

  public static render(equippedSkill: EquippedSkill): ComponentSelectOption {
    const skill: Skill = equippedSkill.skill;
    const emoji: PartialEmoji | undefined = skill.emoji
      ? skill.emoji
      : skill.element
      ? ELEMENT_EMOJI_MAP.get(skill.element)
      : skill.weaponType
      ? WEAPONTYPE_EMOJI_MAP.get(skill.weaponType)
      : undefined;
    const label: string = equippedSkill.cooldown ? `${skill.name} (Cooldown: ${equippedSkill.cooldown})` : skill.name;
    return {
      emoji,
      label,
      value: skill.name,
      description: skill.description
    };
  }
}

export interface EquippedSkill {
  skill: Skill;
  slot: SkillSlot;
  cooldown: number;
}
