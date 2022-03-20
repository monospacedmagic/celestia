import { Element, SkillSlot, WeaponType } from '@prisma/client';
import { Skill } from '../models/skill';

export const vacuumWave: Skill = new Skill('Vakuumwelle', SkillSlot.PRIMARY, {
  description: 'Anemo-Angriff, gibt 2 Elementarenergie bei Treffer',
  element: Element.ANEMO,
  weaponType: WeaponType.CATALYST,
  power: 30,
  accuracy: 100,
  energyReward: 2
});
