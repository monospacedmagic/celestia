import { Element, WeaponType } from '.';
import { PartialEmoji } from '../util';

export enum SkillSlot {
  PRIMARY,
  SECONDARY,
  TERTIARY,
  EXTRA,
  SPECIAL
}

export class Skill {
  constructor(
    name: string,
    slot: SkillSlot,
    passive: boolean = false,
    element: Element = Element.NONE,
    weaponType: WeaponType = WeaponType.NONE,
    emoji: PartialEmoji = null,
    canTargetAllies: boolean = false,
    power: number = 0,
    accuracy: number = null,
    cooldown: number = 0,
    energyReward: number = 0,
    energyCost: number = 0
  ) {}
}
