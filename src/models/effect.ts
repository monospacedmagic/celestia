import { SoloEncounter } from '.';

export interface Effect {
  (encounter: SoloEncounter): string;
}
