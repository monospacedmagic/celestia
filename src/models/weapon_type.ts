import { WeaponType } from '@prisma/client';
import { PartialEmoji } from 'slash-create';
export { WeaponType };

export class WeaponTypeEmoji implements PartialEmoji {
  constructor(
    public weaponType: WeaponType,
    public name: string,
    public id: string,
    public animated: boolean = false
  ) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

/**
 * object version of WeaponType enum whose members can be
 * stringified into pretty emojis for Discord
 */
export const WeaponTypes = {
  NONE: new WeaponTypeEmoji(WeaponType.NONE, 'none', '946841412169785386'),
  SWORD: new WeaponTypeEmoji(WeaponType.SWORD, 'sword', '946495728019206174'),
  CLAYMORE: new WeaponTypeEmoji(WeaponType.CLAYMORE, 'claymore', '946495848278261760'),
  POLEARM: new WeaponTypeEmoji(WeaponType.POLEARM, 'polearm', '946495989706027078'),
  BOW: new WeaponTypeEmoji(WeaponType.BOW, 'bow', '946496187580694558'),
  CATALYST: new WeaponTypeEmoji(WeaponType.CATALYST, 'catalyst', '946496465524641793')
} as const;

export const WEAPONTYPE_EMOJI_MAP: Map<WeaponType, WeaponTypeEmoji> = new Map<WeaponType, WeaponTypeEmoji>(
  Object.values(WeaponType).map((_weaponType) => [
    _weaponType,
    Object.values(WeaponTypes).find(({ weaponType }) => _weaponType == weaponType)
  ])
);
