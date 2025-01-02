import { GrammarNode } from './GrammarNode'
import { ParseNode } from './ParseNode'
import * as EnglishGrammar from './i18n/englishGrammar'
import * as JapaneseGrammar from './i18n/japaneseGrammar'
import type { DateFn } from './DateFn'
const { group, named, oneOf } = GrammarNode
const { space } = EnglishGrammar

class DateTimeNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    return (
      (
        this.find(JapaneseGrammar.DateTimeNode) ||
        this.find(EnglishGrammar.DateTimeNode)
      )?.dateFns(input) || []
    )
  }
}

const DateTime = named(
  'DateTime',
  oneOf(JapaneseGrammar.DateTime, EnglishGrammar.DateTime)
).parseAs(DateTimeNode)

class RangeNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    return this.find(EnglishGrammar.RangeNode)?.dateFns(input) || []
  }
}

const Range = named('Range', oneOf(EnglishGrammar.Range)).parseAs(RangeNode)

export class RootNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    return (
      (this.find(RangeNode) || this.find(DateTimeNode))?.dateFns(input) || []
    )
  }
}

export const Root = group(
  space.maybe(),
  oneOf(Range, DateTime),
  space.maybe()
).parseAs(RootNode)
