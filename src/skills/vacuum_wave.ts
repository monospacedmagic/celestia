import { Element, SkillSlot, WeaponType } from '@prisma/client';
import { Skill } from '.';

export const vacuumWave: Skill = new Skill('Vakuumwelle', SkillSlot.PRIMARY, {
  element: Element.ANEMO,
  weaponType: WeaponType.CATALYST,
  power: 30,
  accuracy: 100,
  energyReward: 2
});
