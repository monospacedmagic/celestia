import { Element, SkillSlot, WeaponType } from '@prisma/client';
import { Skill, SkillTarget } from '../models/skill';

export const windCut: Skill = new Skill('Windschnitt', SkillSlot.SPECIAL, {
  description: 'Starker Anemo-Angriff auf alle Gegner',
  element: Element.ANEMO,
  weaponType: WeaponType.CATALYST,
  target: SkillTarget.ALL,
  power: 120,
  accuracy: 100,
  energyCost: 30
});
