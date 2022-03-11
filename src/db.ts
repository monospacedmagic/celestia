import { PrismaClient } from '@prisma/client';
import { Element, WeaponType } from '@prisma/client';
export { Element, WeaponType };

export const prisma = new PrismaClient();

export class ElementEmoji {
  constructor(public item: Element, public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

export const Elements = {
  PYRO: new ElementEmoji(Element.PYRO, 'pyro', '945442540457431080'),
  GEO: new ElementEmoji(Element.GEO, 'geo', '945441987857895515'),
  DENDRO: new ElementEmoji(Element.DENDRO, 'dendro', '945441593060630559'),
  CRYO: new ElementEmoji(Element.CRYO, 'cryo', '945441256278999060'),
  ELECTRO: new ElementEmoji(Element.ELECTRO, 'electro', '945441845457068092'),
  ANEMO: new ElementEmoji(Element.ANEMO, 'anemo', '945441005094719508'),
  HYDRO: new ElementEmoji(Element.HYDRO, 'hydro', '945442188924452894'),
  NONE: new ElementEmoji(null, 'none', '946841412169785386')
} as const;

export class WeaponTypeEmoji {
  constructor(public item: WeaponType, public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

export const WeaponTypes = {
  SWORD: new WeaponTypeEmoji(WeaponType.SWORD, 'sword', '946495728019206174'),
  CLAYMORE: new WeaponTypeEmoji(WeaponType.CLAYMORE, 'claymore', '946495848278261760'),
  POLEARM: new WeaponTypeEmoji(WeaponType.POLEARM, 'polearm', '946495989706027078'),
  BOW: new WeaponTypeEmoji(WeaponType.BOW, 'bow', '946496187580694558'),
  CATALYST: new WeaponTypeEmoji(WeaponType.CATALYST, 'catalyst', '946496465524641793'),
  NONE: new WeaponTypeEmoji(null, 'none', '946841412169785386')
} as const;

export class PartialEmoji {
  constructor(public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

// <:ally:946814425065742417> <:enemy:946814494234005515>

export const Parties = {
  ALLY: new PartialEmoji('ally2', '946860813019398235'),
  ENEMY: new PartialEmoji('enemy2', '946860813346570260')
};

// <:ally2:946860813019398235> <:enemy2:946860813346570260>
