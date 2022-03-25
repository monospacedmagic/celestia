import { Element, SkillSlot, WeaponType } from '@prisma/client';
import { SoloEncounter } from '../models';
import { Skill } from '../models/skill';
import { LoadedAlly, LoadedEnemy, LoadedPlayer } from '../models/solo_encounter';

export const vacuumPull: Skill = new Skill('Vakuumsog', SkillSlot.SECONDARY, {
  description: 'Entfernt Pyro/Cryo/Electro/Hydro, gibt 3 Elementarenergie bei Erfolg',
  element: Element.ANEMO,
  weaponType: WeaponType.CATALYST,
  accuracy: 100,
  energyReward: 3
}).addEffect(
  (
    encounter: SoloEncounter,
    usedBy: LoadedPlayer | LoadedEnemy | LoadedAlly,
    ...targets: (LoadedEnemy | LoadedAlly)[]
  ) => {
    var target: LoadedAlly | LoadedEnemy = targets[0];
    var foundStatusEffect: string;
    for (const element of ['Pyro', 'Cryo', 'Electro', 'Hydro']) {
      if (element in Object.getOwnPropertyNames(target.statusEffects)) {
        foundStatusEffect = element;
        delete target.statusEffects[foundStatusEffect];
      }
    }
    return { text: `**${foundStatusEffect}** wurde von **${target.character.name}** entfernt.` };
  }
);
