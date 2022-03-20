import { Ally, Character, Element, Enemy, Player, SkillSlot, WeaponType } from '@prisma/client';
import { SoloEncounter } from '../models';
import { Skill } from '../models/skill';

export const vacuumPull: Skill = new Skill('Vakuumsog', SkillSlot.PRIMARY, {
  element: Element.ANEMO,
  weaponType: WeaponType.CATALYST,
  accuracy: 100,
  energyReward: 3
}).addEffect(
  (encounter: SoloEncounter, usedBy: Player | Enemy | Ally, target: (Enemy | Ally) & { character: Character }) => {
    var foundStatusEffect = target.statusEffects.find((effect) =>
      ['Pyro', 'Cryo', 'Electro', 'Hydro'].includes(effect)
    );
    if (!foundStatusEffect) {
      return { failed: true };
    }
    target.statusEffects.splice(target.statusEffects.indexOf(foundStatusEffect), 1);
    return { text: `**${foundStatusEffect}** wurde von **${target.character.name}** entfernt.` };
  }
);
