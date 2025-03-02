import { applyDateFns } from './applyDateFns'
import { DateFn } from './DateFn'
import { GrammarNode } from './GrammarNode'
import { ParseError } from './ParseError'
import { ParseRootNode } from './ParseRootNode'
import { ParseState } from './ParseState'

export function tellMeWhen(
  when: string,
  options: { now?: Date; grammar: GrammarNode }
): Date | [Date, Date] {
  return applyDateFns(parse(when, options), options)
}

export function parse(
  input: string,
  { grammar }: { grammar: GrammarNode }
): DateFn[] {
  const state = new ParseState(input, { flags: 'gi' })
  const tree = grammar.parse(state)
  if (state.index !== input.length) {
    throw new ParseError(`syntax error at ${state.index}`, state.index)
  }
  return tree.find(ParseRootNode)?.dateFns(input) || []
}
