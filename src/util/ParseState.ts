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

  testLowerCase(pattern: string): boolean {
    if (
      this.input
        .substring(this.index, this.index + pattern.length)
        .toLowerCase() === pattern
    ) {
      this.index += pattern.length
      return true
    }
    return false
  }

  testRegex(pattern: RegExp): boolean {
    pattern.lastIndex = this.index
    if (pattern.test(this.input)) {
      this.index = pattern.lastIndex
      return true
    }
    return false
  }
}

export function toRegExp(s: string, flags = ''): RegExp {
  return new RegExp(s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), flags)
}
