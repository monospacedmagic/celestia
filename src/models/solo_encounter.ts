import { Ally, Character, Encounter, Enemy, SoloEncounterState } from '@prisma/client';
import assert from 'assert';
import { prisma } from '../db';

export class SoloEncounter {
  private constructor(state: SoloEncounterState, allies: Ally[], enemies: Enemy[], encounter: Encounter) {}

  public static async create(userId: number, encounterName: string) {
    var encounter = await prisma.encounter.findUnique({
      where: {
        name: encounterName
      },
      include: {
        enemies: true
      }
    });
    assert(encounter, 'No encounter with this name.');

    var allyCharacters: Character[] = await prisma.character.findMany({
      where: {
        ownerId: userId,
        isDeployed: true
      }
    });
    var enemyCharacters: Character[] = encounter.enemies;

    var state = await prisma.soloEncounterState.create({
      data: {
        encounterName: encounterName,
        playerId: userId,
        allies: {
          create: allyCharacters.map(({ id, maxHp, energy, defaultAfflictions }) => ({
            characterId: id,
            hp: maxHp,
            energy,
            afflictions: defaultAfflictions
          }))
        },
        enemies: {
          create: enemyCharacters.map(({ id, maxHp, energy, defaultAfflictions }) => ({
            characterId: id,
            hp: maxHp,
            energy,
            afflictions: defaultAfflictions
          }))
        }
      },
      include: {
        allies: true,
        enemies: true
      }
    });

    return new SoloEncounter(state, state.allies, state.enemies, encounter);
  }
}
