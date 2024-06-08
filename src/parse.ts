import { DateFn } from './DateFn'
import { ParseState } from './ParseState'
import { Root, RootNode } from './tellMeWhenGrammar'

export function parse(input: string): DateFn[] {
  const state = new ParseState(input, { flags: 'gi' })
  const tree = Root.parse(state)
  if (state.index !== input.length) {
    throw new Error(`syntax error at ${state.index}`)
  }
  return tree.find(RootNode)?.dateFns(input) || []
}
