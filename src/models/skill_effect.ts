import { Ally, Enemy, Player } from '@prisma/client';
import { SoloEncounter } from '.';

export interface SkillEffectResult {
  /** silent if null, no special text if undefined */
  text?: string;
  /** if true, using the skill failed; this will override other effects of the skill */
  failed?: boolean;
}

export interface SkillEffect {
  (encounter: SoloEncounter, usedBy: Player | Ally | Enemy, target?: Ally | Enemy): SkillEffectResult;
}
