import { GrammarNode } from './util/GrammarNode'
import type { SupportedLocale } from './locales'
import { getGrammar } from './util/getGrammar'
import { DateFn } from './util/DateFn'
import * as base from './util/parse'

export { applyDateFns } from './util/applyDateFns'
export type { DateFn } from './util/DateFn'
export type { SupportedLocale } from './locales'
export { ParseError } from './util/ParseError'

export function tellMeWhen(
  when: string,
  {
    locales,
    grammar = getGrammar({ locales }),
    ...options
  }: { now?: Date; grammar?: GrammarNode; locales?: SupportedLocale[] } = {}
): Date | [Date, Date] {
  return base.tellMeWhen(when, { ...options, grammar })
}

export function parse(
  input: string,
  {
    locales,
    grammar = getGrammar({ locales }),
  }: { grammar?: GrammarNode; locales?: SupportedLocale[] } = {}
): DateFn[] {
  return base.parse(input, { grammar })
}
