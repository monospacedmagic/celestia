import { Ally, Character, Element, Enemy } from '@prisma/client';
import { StatusEffect } from '.';
import { Elements, SoloEncounter } from '../models';

export const pyro: StatusEffect = new StatusEffect('Pyro', Elements.PYRO, {
  hooks: {
    endTurn: (encounter: SoloEncounter, affected: (Ally | Enemy) & { character: Character }) => {
      var damage = Math.floor(affected.character.maxHp / 16);
      return { damage, damageElement: Element.PYRO };
    }
  }
});
