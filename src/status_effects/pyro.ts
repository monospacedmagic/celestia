import { Element } from '@prisma/client';
import { StatusEffect } from '../models/status_effect';
import { Elements, SoloEncounter } from '../models';
import { LoadedAlly, LoadedEnemy } from '../models/solo_encounter';

export const pyro: StatusEffect = new StatusEffect('Pyro', {
  emoji: Elements.PYRO,
  hooks: {
    endTurn: (encounter: SoloEncounter, affected: LoadedAlly | LoadedEnemy) => {
      var damage = Math.floor(affected.character.maxHp / 16);
      return { damage, damageElement: Element.PYRO };
    }
  }
});
