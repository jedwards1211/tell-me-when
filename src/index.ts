import { applyDateFns } from './applyDateFns'
import { parse } from './parse'

export { parse } from './parse'
export { applyDateFns } from './applyDateFns'

export function tellMeWhen(
  when: string,
  options?: { now?: Date }
): Date | [Date, Date] {
  return applyDateFns(parse(when), options)
}
