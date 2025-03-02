export class ParseState {
  index = 0
  readonly start: number
  readonly end: number
  readonly flags: string

  constructor(
    public input: string,
    {
      start = 0,
      end = input.length,
      flags = 'g',
    }: {
      /**
       * The starting index (defaults to 0)
       */
      start?: number
      /**
       * The ending index (defaults to input.length)
       */
      end?: number
      /**
       * Flags to add to all regexes
       */
      flags?: string
    } = {}
  ) {
    this.start = start
    this.end = end
    this.flags = flags
  }

  get done() {
    return this.index >= this.end
  }

  /**
   * If pattern matches the input at the current index, returns the match,
   * but doesn't advance the index.
   */
  peek(pattern: string | RegExp): RegExpExecArray | undefined {
    if (typeof pattern === 'string') pattern = toRegExp(pattern)
    pattern = new RegExp(
      pattern.source,
      `${this.flags}${pattern.flags.replace(
        new RegExp(`[${this.flags}]`, 'g'),
        ''
      )}`
    )
    pattern.lastIndex = this.index
    const match = pattern.exec(this.input)
    return match?.index === this.index &&
      match.index + match[0].length <= this.end
      ? match
      : undefined
  }

  /**
   * If pattern matches the input at the current index, returns the match,
   * and advances the index to the end of the match.
   */
  match(pattern: string | RegExp): RegExpExecArray | undefined {
    const match = this.peek(pattern)
    if (match) {
      this.index += match[0].length
    }
    return match
  }
}

export function toRegExp(s: string, flags = ''): RegExp {
  return new RegExp(s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), flags)
}
