import { WeaponType } from '@prisma/client';
export { WeaponType };

export class WeaponTypeEmoji {
  constructor(public item: WeaponType, public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

/**
 * object version of WeaponType enum whose members can be
 * stringified into pretty emojis for Discord
 */
export const WeaponTypes = {
  SWORD: new WeaponTypeEmoji(WeaponType.SWORD, 'sword', '946495728019206174'),
  CLAYMORE: new WeaponTypeEmoji(WeaponType.CLAYMORE, 'claymore', '946495848278261760'),
  POLEARM: new WeaponTypeEmoji(WeaponType.POLEARM, 'polearm', '946495989706027078'),
  BOW: new WeaponTypeEmoji(WeaponType.BOW, 'bow', '946496187580694558'),
  CATALYST: new WeaponTypeEmoji(WeaponType.CATALYST, 'catalyst', '946496465524641793'),
  NONE: new WeaponTypeEmoji(null, 'none', '946841412169785386')
} as const;
