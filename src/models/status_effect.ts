import { Ally, Enemy, Element } from '@prisma/client';
import { SoloEncounter } from '.';
import { PartialEmoji } from '../util';

interface StatusEffectResult {
  /** silent if null, no special text if undefined */
  text?: string;
  /** negative number will heal */
  damage?: number;
  /** element of the damage taken, if any */
  damageElement?: Element;
}

interface StatusEffectStartTurnHook {
  (encounter: SoloEncounter, affected: Ally | Enemy): StatusEffectResult;
}

interface StatusEffectPreAttackHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attacked: Enemy): StatusEffectResult;
}

interface StatusEffectPreAttackedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attackedBy: Enemy): StatusEffectResult;
}

interface StatusEffectPreAidHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aided: Ally[]): StatusEffectResult;
}

interface StatusEffectPreAidedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aidedBy: Ally): StatusEffectResult;
}

interface StatusEffectPreActHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, targets: Ally[] | Enemy[]): StatusEffectResult;
}

interface StatusEffectAttackHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attacked: Enemy[]): StatusEffectResult;
}

interface StatusEffectAttackedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attackedBy: Enemy): StatusEffectResult;
}

interface StatusEffectAidHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aided: Ally[]): StatusEffectResult;
}

interface StatusEffectAidedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aidedBy: Ally): StatusEffectResult;
}

interface StatusEffectActHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, targets: Ally[] | Enemy[]): StatusEffectResult;
}

interface StatusEffectPostAttackHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attacked: Enemy[]): StatusEffectResult;
}

interface StatusEffectPostAttackedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, attackedBy: Enemy): StatusEffectResult;
}

interface StatusEffectPostAidHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aided: Ally[]): StatusEffectResult;
}

interface StatusEffectPostAidedHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, aidedBy: Ally): StatusEffectResult;
}

interface StatusEffectPostActHook {
  (encounter: SoloEncounter, affected: Ally | Enemy, targets: Ally[] | Enemy[]): StatusEffectResult;
}

interface StatusEffectEndTurnHook {
  (encounter: SoloEncounter, affected: Ally | Enemy): StatusEffectResult;
}

interface StatusEffectHooks {
  /** Called once at the start of each turn */
  startTurn?: StatusEffectStartTurnHook;
  /** Called before character with status effect attacks */
  preAttack?: StatusEffectPreAttackHook;
  /** Called before character with status effect is attacked */
  preAttacked?: StatusEffectPreAttackedHook;
  /** Called before character with status effect aids an ally */
  preAid?: StatusEffectPreAidHook;
  /** Called before character with status effect is aided by an ally */
  preAided?: StatusEffectPreAidedHook;
  /** Called before character with status effect attacks or aids an ally */
  preAct?: StatusEffectPreActHook;
  /** Called when character with status effect attacks, during damage calculation */
  attack?: StatusEffectAttackHook;
  /** Called when character with status effect is attacked, during damage calculation */
  attacked?: StatusEffectAttackedHook;
  /** Called when character aids an ally, during aid calculations (such as healing) */
  aid?: StatusEffectAidHook;
  /** Called when character is aided by an ally, during aid calculations (such as healing) */
  aided?: StatusEffectAidedHook;
  /** Called when character attacks or aids an ally, during calculations (DO NOT USE) */
  act?: StatusEffectActHook;
  /** Called after character with status effect has attacked */
  postAttack?: StatusEffectPostAttackHook;
  /** Called after character with status effect was attacked if character is still conscious */
  postAttacked?: StatusEffectPostAttackedHook;
  /** Called after character with status effect has aided an ally */
  postAid?: StatusEffectPostAidHook;
  /** Called after character with status effect was aided by an ally */
  postAided?: StatusEffectPostAidedHook;
  /** Called after character with status effect attacked or aided an ally */
  postAct?: StatusEffectPostActHook;
  /** Called once at the end of each turn */
  endTurn?: StatusEffectEndTurnHook;
}

interface StatusEffectAttributes {
  maxLevel?: number;
  hooks: StatusEffectHooks;
}

export class StatusEffect {
  public static statusEffects: Map<string, StatusEffect> = new Map<string, StatusEffect>();

  public name: string;
  public emoji: PartialEmoji;
  public maxLevel?: number = null;
  public hooks: StatusEffectHooks;

  constructor(name: string, emoji: PartialEmoji, attributes: StatusEffectAttributes) {
    this.name = name;
    this.emoji = emoji;
    Object.assign(this, attributes);
    StatusEffect.statusEffects[name] = this;
  }
}
