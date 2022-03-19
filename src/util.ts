export class PartialEmoji {
  constructor(public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}

export const CELESTIA_EMOJI = new PartialEmoji('celestia', '945101835763580998');
export const CELESTIA_COLOR = 0xffdb81;
