import { Element } from '@prisma/client';
import { StatusEffect } from '../models/status_effect';
import { SoloEncounter, LoadedAlly, LoadedEnemy, RawInteraction, LoadedPlayer } from '../models';

export const anemoAbsorption: StatusEffect = new StatusEffect('Anemo-Absorbtion', {
  emoji: null,
  hooks: {
    attacked: (
      encounter: SoloEncounter,
      affected: LoadedAlly | LoadedEnemy,
      attackedBy: LoadedPlayer | LoadedAlly | LoadedEnemy,
      interaction: RawInteraction
    ) => {
      if (interaction.element == Element.ANEMO && interaction.power > 0) {
        interaction.power *= -1;
      }
    }
  }
});
