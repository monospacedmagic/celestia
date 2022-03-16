import { Element } from '@prisma/client';
export { Element };

export class ElementEmoji {
  constructor(public item: Element, public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

/**
 * object version of Element enum whose members can be stringified
 * into pretty emojis for Discord
 */
export const Elements = {
  NONE: new ElementEmoji(Element.NONE, 'none', '946841412169785386'),
  PYRO: new ElementEmoji(Element.PYRO, 'pyro', '945442540457431080'),
  GEO: new ElementEmoji(Element.GEO, 'geo', '945441987857895515'),
  DENDRO: new ElementEmoji(Element.DENDRO, 'dendro', '945441593060630559'),
  CRYO: new ElementEmoji(Element.CRYO, 'cryo', '945441256278999060'),
  ELECTRO: new ElementEmoji(Element.ELECTRO, 'electro', '945441845457068092'),
  ANEMO: new ElementEmoji(Element.ANEMO, 'anemo', '945441005094719508'),
  HYDRO: new ElementEmoji(Element.HYDRO, 'hydro', '945442188924452894')
} as const;
