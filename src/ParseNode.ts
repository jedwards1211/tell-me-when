export class ParseNode {
  constructor(
    public name: string | undefined,
    public from: number,
    public to: number,
    public children?: ParseNode[]
  ) {}

  static error(from: number, to: number = from) {
    return new ParseNode('⚠', from, to)
  }

  static empty(index: number) {
    return new ParseNode(undefined, index, index)
  }

  get isError() {
    return this.name === '⚠'
  }

  get isEmpty() {
    return this.from === this.to
  }

  find(
    predicate: string | ((node: ParseNode) => boolean)
  ): ParseNode | undefined {
    if (typeof predicate === 'string')
      return this.find((node) => node.name === predicate)
    if (predicate(this)) return this
    if (this.children) {
      for (const child of this.children) {
        const found = child.find(predicate)
        if (found) return found
      }
    }
    return undefined
  }
}
