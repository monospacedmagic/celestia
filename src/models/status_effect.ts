import { Element } from '@prisma/client';
import { LoadedAlly, LoadedEnemy, LoadedPlayer, RawInteraction, SoloEncounter } from '.';
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
  (encounter: SoloEncounter, affected: LoadedAlly | LoadedEnemy): StatusEffectResult | void;
}

interface StatusEffectPreAttackHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attacked: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPreAttackedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attackedBy: LoadedPlayer | LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPreAidHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aided: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPreAidedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aidedBy: LoadedPlayer | LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPreActHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    target: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectAttackHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attacked: LoadedAlly | LoadedEnemy,
    interaction: RawInteraction
  ): StatusEffectResult | void;
}

interface StatusEffectAttackedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attackedBy: LoadedPlayer | LoadedAlly | LoadedEnemy,
    interaction: RawInteraction
  ): StatusEffectResult | void;
}

interface StatusEffectAidHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aided: LoadedAlly | LoadedEnemy,
    interaction: RawInteraction
  ): StatusEffectResult | void;
}

interface StatusEffectAidedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aidedBy: LoadedPlayer | LoadedAlly | LoadedEnemy,
    interaction: RawInteraction
  ): StatusEffectResult | void;
}

interface StatusEffectActHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    target: LoadedAlly | LoadedEnemy,
    interaction: RawInteraction
  ): StatusEffectResult | void;
}

interface StatusEffectPostAttackHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attacked: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPostAttackedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    attackedBy: LoadedPlayer | LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPostAidHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aided: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPostAidedHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    aidedBy: LoadedPlayer | LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectPostActHook {
  (
    encounter: SoloEncounter,
    affected: LoadedAlly | LoadedEnemy,
    target: LoadedAlly | LoadedEnemy
  ): StatusEffectResult | void;
}

interface StatusEffectEndTurnHook {
  (encounter: SoloEncounter, affected: LoadedAlly | LoadedEnemy): StatusEffectResult | void;
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
  emoji?: PartialEmoji; // default: undefined (infer from element or weaponType if NONE) (null means no emoji should be shown)
  maxLevel?: number;
  hooks: StatusEffectHooks;
}

export class StatusEffect {
  public static statusEffects: Map<string, StatusEffect> = new Map<string, StatusEffect>();
  private static levelNumbers: { [x: number]: string } = {
    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹'
  };
  private static turnsLeftNumbers: { [x: number]: string } = {
    0: '₀',
    1: '₁',
    2: '₂',
    3: '₃',
    4: '₄',
    5: '₅',
    6: '₆',
    7: '₇',
    8: '₈',
    9: '₉'
  };

  public name: string;
  public emoji?: PartialEmoji;
  public maxLevel?: number = null;
  public hooks: StatusEffectHooks;

  constructor(name: string, attributes: StatusEffectAttributes) {
    this.name = name;
    Object.assign(this, attributes);
    StatusEffect.statusEffects[name] = this;
  }

  public static render(ase: ActiveStatusEffect): string {
    if (ase.statusEffect.emoji == null) return '';
    const turnsLeft: string = ase.turnsLeft && ase.turnsLeft > 0 ? String(ase.turnsLeft) : '';
    const level: string = ase.level > 1 ? StatusEffect.levelNumbers[ase.level] : '';
    return `${turnsLeft}${ase.statusEffect.emoji}${level}`;
  }
}

export interface ActiveStatusEffect {
  name: string;
  statusEffect: StatusEffect;
  level?: number;
  turnsLeft?: number;
}
