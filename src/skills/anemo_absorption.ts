import { Ally, Enemy, Player, SkillSlot } from '@prisma/client';
import { Skill } from '../models/skill';
import { SoloEncounter } from '../models/solo_encounter';

export const anemoAbsorption: Skill = new Skill('Anemo-Absorbtion', SkillSlot.TERTIARY, {
  description: 'Anemo-Angriffe werden absorbiert und heilen dich, anstatt Schaden zuzufügen',
  passive: true
}).addEffect((encounter: SoloEncounter, usedBy: Player | Ally | Enemy) => {
  if (!('party' in usedBy)) {
    // is solo Player
    return {};
  }
  usedBy.statusEffects['Anemo-Absorbtion'] = -1;
  return {};
});
