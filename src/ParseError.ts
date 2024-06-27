export class ParseError extends Error {
  name = 'ParseError'
  from: number
  to: number

  constructor(message: string, from: number, to = from) {
    super(message)
    this.from = from
    this.to = to
  }
}
