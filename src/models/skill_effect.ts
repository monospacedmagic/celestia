import { Ally, Enemy, Player } from '@prisma/client';
import { SoloEncounter } from '.';
import { LoadedAlly, LoadedEnemy, LoadedPlayer } from './solo_encounter';

export interface SkillEffectResult {
  /** silent if null, no special text if undefined */
  text?: string;
  /** if true, using the skill failed; this will override other effects of the skill */
  failed?: boolean;
}

export interface SkillEffect {
  (encounter: SoloEncounter, usedBy: LoadedPlayer | LoadedAlly | LoadedEnemy, ...targets: (LoadedAlly | LoadedEnemy)[]): SkillEffectResult;
}
