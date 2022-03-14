export class PartialEmoji {
  constructor(public name: string, public id: string) {}

  toString() {
    return `<:${this.name}:${this.id}>`;
  }
}
