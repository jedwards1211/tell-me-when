export class ParseNode {
  name: string | undefined
  from: number
  to: number
  children?: ParseNode[]

  constructor(wrapped: ParseNode)
  constructor(
    name: string | undefined,
    from: number,
    to: number,
    children?: ParseNode[]
  )
  constructor(
    arg0: ParseNode | string | undefined,
    from?: number,
    to?: number,
    children?: ParseNode[]
  ) {
    if (arg0 instanceof ParseNode) {
      this.name = arg0.name
      this.from = arg0.from
      this.to = arg0.to
      this.children = arg0.children
    } else {
      if (from == null || to == null) {
        throw new Error(
          `from and to are required if first arg isn't a ParseNode`
        )
      }
      this.name = arg0
      this.from = from
      this.to = to
      this.children = children
    }
  }

  static error(from: number, to: number = from) {
    return new ParseNode('⚠', from, to)
  }

  static empty(index: number) {
    return new ParseNode(undefined, index, index)
  }

  substringOf(input: string) {
    return input.substring(this.from, this.to)
  }

  get isError() {
    return this.name === '⚠'
  }

  get isEmpty() {
    return this.from === this.to
  }

  find<N extends ParseNode>(
    predicate: (new (...args: any[]) => N) | ((node: ParseNode) => node is N)
  ): N | undefined
  find(
    predicate:
      | string
      | (new (...args: any[]) => ParseNode)
      | ((node: ParseNode) => boolean)
  ): ParseNode | undefined
  find(
    predicate:
      | string
      | (new (...args: any[]) => ParseNode)
      | ((node: ParseNode) => boolean)
  ): ParseNode | undefined {
    for (const node of this.findAll(predicate)) {
      return node
    }
    return undefined
  }

  findAll<N extends ParseNode>(
    predicate: (new (...args: any[]) => N) | ((node: ParseNode) => node is N)
  ): Iterable<N>
  findAll(
    predicate:
      | string
      | (new (...args: any[]) => ParseNode)
      | ((node: ParseNode) => boolean)
  ): Iterable<ParseNode>
  *findAll(
    predicate:
      | string
      | (new (...args: any[]) => ParseNode)
      | ((node: ParseNode) => boolean)
  ): Iterable<ParseNode> {
    if (typeof predicate === 'string') {
      yield* this.findAll((node) => node.name === predicate)
      return
    }
    if (
      predicate.prototype instanceof ParseNode
        ? this instanceof predicate
        : (predicate as any)(this)
    ) {
      yield this
    }
    if (this.children) {
      for (const child of this.children) {
        yield* child.findAll(predicate)
      }
    }
  }
}
