import { ParseNode } from './ParseNode'
import { ParseState } from './ParseState'

export abstract class GrammarNode {
  abstract parse(state: ParseState): ParseNode

  parseAs(parseAs: new (node: ParseNode) => ParseNode) {
    return new ParseAsNode(this, parseAs)
  }

  /**
   * Matches this node once or zero times
   */
  maybe() {
    return new MaybeNode(this)
  }

  /**
   * Matches this node or the alternate node
   */
  or(alternate: GrammarNode) {
    return new OrNode(this, alternate)
  }

  /**
   * Matches one of the given nodes.  The first option to parse successfully wins
   */
  static oneOf(
    ...options: (string | RegExp | GrammarNode | (() => GrammarNode))[]
  ) {
    return new OrNode(...options.map(GrammarNode.toGrammarNode))
  }

  /**
   * Matches one of the given nodes.  Tries all of the options, and the one that
   * successfully parses the farthest in the input wins
   */
  static longestOf(
    ...options: (string | RegExp | GrammarNode | (() => GrammarNode))[]
  ) {
    return new LongestOfNode(...options.map(GrammarNode.toGrammarNode))
  }

  /**
   * Matches this node repeated the given number of times
   */
  repeat(count: number): RepeatNode
  /**
   * Matches this node repeated between min and max (inclusive) times
   */
  repeat(min: number, max: number): RepeatNode
  repeat(countOrMin: number, max?: number): RepeatNode {
    return new RepeatNode(this, max != null ? [countOrMin, max] : countOrMin)
  }

  static toGrammarNode(
    factor: string | RegExp | GrammarNode | (() => GrammarNode)
  ) {
    return typeof factor === 'function'
      ? new GrammarNodeRef(factor)
      : factor instanceof GrammarNode
      ? factor
      : new TokenNode(factor)
  }

  /**
   * Matches the given string or regular expression
   */
  static token(token: string | RegExp) {
    return new TokenNode(token)
  }

  /**
   * Matches the given nodes in sequence
   */
  static group(
    ...sequence: (string | RegExp | GrammarNode | (() => GrammarNode))[]
  ) {
    return new GroupNode(undefined, ...sequence.map(GrammarNode.toGrammarNode))
  }

  /**
   * Creates a named group that matches the given nodes in sequence.
   * Same as {@link group} but the {@link ParseNode} returned by {@link parse}
   * will have the given name.
   */
  static named(
    name: string,
    ...sequence: (string | RegExp | GrammarNode | (() => GrammarNode))[]
  ) {
    return new GroupNode(name, ...sequence.map(GrammarNode.toGrammarNode))
  }

  static negativeLookahead(
    ...sequence: (string | RegExp | GrammarNode | (() => GrammarNode))[]
  ) {
    return new NegativeLookaheadNode(
      sequence.length === 1
        ? GrammarNode.toGrammarNode(sequence[0])
        : GrammarNode.group(...sequence)
    )
  }
}

export class GrammarNodeRef extends GrammarNode {
  constructor(public ref: () => GrammarNode) {
    super()
  }

  parse(state: ParseState): ParseNode {
    return this.ref().parse(state)
  }
}

export class TokenNode extends GrammarNode {
  constructor(public token: string | RegExp) {
    super()
  }

  parse(state: ParseState): ParseNode {
    const match = state.match(this.token)
    if (match) {
      state.index = match.index + match[0].length
      return new ParseNode(undefined, match.index, state.index)
    }
    return ParseNode.error(state.index)
  }
}

export class MaybeNode extends GrammarNode {
  constructor(public node: GrammarNode) {
    super()
  }

  parse(state: ParseState): ParseNode {
    const parsed = this.node.parse(state)
    return parsed.isError ? ParseNode.empty(state.index) : parsed
  }
}

export class RepeatNode extends GrammarNode {
  constructor(
    public node: GrammarNode,
    public count: number | [number, number]
  ) {
    super()
  }

  parse(state: ParseState): ParseNode {
    const startIndex = state.index
    const children: ParseNode[] = []
    for (
      let i = 0;
      i < (Array.isArray(this.count) ? this.count[1] : this.count);
      i++
    ) {
      const parsed = this.node.parse(state)
      if (parsed.isError) {
        if (i < (Array.isArray(this.count) ? this.count[0] : this.count)) {
          state.index = startIndex
          return parsed
        }
        break
      }
      if (!parsed.isEmpty) children.push(parsed)
    }
    return new ParseNode(undefined, startIndex, state.index, children)
  }
}

export class OrNode extends GrammarNode {
  public options: GrammarNode[]
  constructor(...options: GrammarNode[]) {
    super()
    this.options = options
  }

  parse(state: ParseState): ParseNode {
    const startIndex = state.index
    for (const option of this.options) {
      const parsed = option.parse(state)
      if (!parsed.isError) return parsed
    }
    state.index = startIndex
    return ParseNode.error(startIndex)
  }
}

export class LongestOfNode extends GrammarNode {
  public options: GrammarNode[]
  constructor(...options: GrammarNode[]) {
    super()
    this.options = options
  }

  parse(state: ParseState): ParseNode {
    const startIndex = state.index
    let best: ParseNode = ParseNode.error(startIndex)
    for (const option of this.options) {
      state.index = startIndex
      const parsed = option.parse(state)
      if (!parsed.isError && (best.isError || parsed.to > best.to)) {
        best = parsed
        if (parsed.to === state.end) break
      }
    }
    state.index = best.isError ? startIndex : best.to
    return best as any
  }
}

export class GroupNode extends GrammarNode {
  public factors: GrammarNode[]

  constructor(public name: string | undefined, ...factors: GrammarNode[]) {
    super()
    this.factors = factors
  }

  parse(state: ParseState): ParseNode {
    const startIndex = state.index
    const children: ParseNode[] = []
    for (const factor of this.factors) {
      const parsed = factor.parse(state)
      if (parsed.isError) {
        state.index = startIndex
        return parsed
      }
      if (!parsed.isEmpty) children.push(parsed)
    }
    return new ParseNode(this.name, startIndex, state.index, children)
  }
}

export class NegativeLookaheadNode extends GrammarNode {
  constructor(public node: GrammarNode) {
    super()
  }

  parse(state: ParseState): ParseNode {
    const { index } = state
    const parsed = this.node.parse(state)
    if (!parsed.isError) return ParseNode.error(index)
    state.index = index
    return ParseNode.empty(index)
  }
}

export class ParseAsNode extends GrammarNode {
  constructor(
    public node: { parse: (state: ParseState) => ParseNode },
    private parseAsClass: new (node: ParseNode) => ParseNode
  ) {
    super()
  }

  parse(state: ParseState): ParseNode {
    const parsed = this.node.parse(state)
    if (parsed.isError) return parsed
    return new this.parseAsClass(parsed)
  }
}
