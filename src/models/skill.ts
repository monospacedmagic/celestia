import { SkillSlot } from '@prisma/client';
export { SkillSlot };
import { SkillEffect, Element, WeaponType } from '.';
import { PartialEmoji } from '../util';

interface SkillAttributes {
  passive?: boolean; // default: false
  element?: Element; // default: Element.NONE
  weaponType?: WeaponType; // default: WeaponType.NONE
  emoji?: PartialEmoji; // default: null
  canTargetAllies?: boolean; // default: false
  numberOfHits?: number; // default: 1
  power?: number; // default: 0
  accuracy?: number; // default: null
  cooldown?: number; // default: 0
  energyReward?: number; // default: 0
  energyCost?: number; // default: 0
}

export class Skill {
  public static skills: Map<string, Skill>;

  public name: string;
  public slot: SkillSlot;
  public passive: boolean = false;
  public element: Element = Element.NONE;
  public weaponType: WeaponType = WeaponType.NONE;
  public emoji?: PartialEmoji = null;
  public canTargetAllies: boolean = false;
  public numberOfHits: number = 1;
  public power: number = 0;
  public accuracy?: number = null;
  public cooldown: number = 0;
  public energyReward: number = 0;
  public energyCost: number = 0;

  public effects?: SkillEffect[];

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
}

import '../skills';
