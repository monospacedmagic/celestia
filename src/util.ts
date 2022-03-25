import { PartialEmoji as IPartialEmoji } from "slash-create";

export class PartialEmoji implements IPartialEmoji {
  constructor(public name: string, public id: string, public animated: boolean = false) {}

  toString() {
    const anim: string = this.animated ? 'a' : '';
    return `<${anim}:${this.name}:${this.id}>`;
  }
}

export const partial = (func, ...args) => (...rest) => func(...args, ...rest);
export const asyncpartial = (func, ...args) => async (...rest) => await func(...args, ...rest);

export const CELESTIA_EMOJI = new PartialEmoji('celestia', '945101835763580998');
export const CELESTIA_COLOR = 0xffdb81;
