import { GrammarNode } from '../GrammarNode'
import * as EnglishGrammar from './englishGrammar'
import { ParseNode } from '../ParseNode'
import type { DateFn } from '../DateFn'
const { group, named, oneOf, longestOf } = GrammarNode
const { space, AmPmValue } = EnglishGrammar

const kanjiNumberMap = new Map([
  ['〇', '0'],
  ['一', '1'],
  ['二', '2'],
  ['三', '3'],
  ['四', '4'],
  ['五', '5'],
  ['六', '6'],
  ['七', '7'],
  ['八', '8'],
  ['九', '9'],
])

class YearNode extends EnglishGrammar.FullYearNode {
  constructor(public wrapped: ParseNode) {
    super(wrapped)
  }

  year(input: string) {
    const yearText = input
      .substring(this.from, this.to - 1)
      .split('')
      .map((char) => kanjiNumberMap.get(char) ?? char)
      .join('')
    return parseInt(yearText)
  }
}

const JapaneseYear = named(
  'JapaneseFullYear',
  /([0-9〇一二三四五六七八九]{1,4})年/
).parseAs(YearNode)

class MonthNameNode extends EnglishGrammar.MonthNameNode {
  static monthMap = new Map([
    ['一月', 0],
    ['二月', 1],
    ['三月', 2],
    ['四月', 3],
    ['五月', 4],
    ['六月', 5],
    ['七月', 6],
    ['八月', 7],
    ['九月', 8],
    ['十月', 9],
    ['十一月', 10],
    ['十二月', 11],
    ['睦月', 0],
    ['如月', 1],
    ['弥生', 2],
    ['卯月', 3],
    ['皐月', 4],
    ['水無月', 5],
    ['文月', 6],
    ['葉月', 7],
    ['長月', 8],
    ['神無月', 9],
    ['神在月', 9],
    ['霜月', 10],
    ['師走', 11],
  ])

  month(input: string) {
    const monthText = this.substringOf(input).replace('〇', '')
    return MonthNameNode.monthMap.get(monthText)!
  }
}

const Month = named('JapaneseMonth', /(1[0-2]|0?[1-9])月/).parseAs(
  EnglishGrammar.MonthNumNode
)

const MonthName = named(
  'JapaneseMonthName',
  /((?:〇?[一二三四五六七八九]|十[一二]?)月|睦月|如月|弥生|卯月|皐月|水無月|文月|葉月|長月|神[無在]月|霜月|師走)/
).parseAs(MonthNameNode)

class DayOfMonthNode extends EnglishGrammar.DayOfMonthNumNode {
  constructor(public wrapped: ParseNode) {
    super(wrapped)
  }

  dayOfMonth(input: string) {
    const dayText = input.substring(this.from, this.to - 1)
    switch (dayText) {
      case '十':
        return 10
      default:
        return parseInt(
          dayText
            .replace(/^十/, '一')
            .replace(/十$/, '〇')
            .replace('十', '')
            .split('')
            .map((char) => kanjiNumberMap.get(char) ?? char)
            .join('')
        )
    }
  }
}

const DayOfMonth = named(
  'JapaneseDayOfMonth',
  /([12][0-9]|3[01]|0?[1-9]|[一二][〇一二三四五六七八九]|三[〇一]|[二三]?十[一二三四五六七八九]?|〇?[一二三四五六七八九])日/
).parseAs(DayOfMonthNode)

class DateNode extends EnglishGrammar.DateNode {
  yearFns(input: string): DateFn[] | undefined {
    return this.find(YearNode)?.dateFns(input)
  }
  monthFns(input: string): DateFn[] | undefined {
    const month = (
      this.find(MonthNameNode) || this.find(EnglishGrammar.MonthNumNode)
    )?.month(input)
    return month != null ? [['setMonth', month]] : undefined
  }
  day(input: string) {
    return this.find(DayOfMonthNode)?.dayOfMonth(input)
  }
}

const Date = named(
  'JapaneseDate',
  longestOf(
    group(
      JapaneseYear,
      group(oneOf(Month, MonthName), DayOfMonth.maybe()).maybe()
    ),
    group(oneOf(Month, MonthName), DayOfMonth.maybe()),
    DayOfMonth
  )
).parseAs(DateNode)

class HoursNode extends EnglishGrammar.HoursNode {
  hours(input: string): number {
    const hoursText = input.substring(this.from, this.to - 1)
    switch (hoursText) {
      case '零':
        return 0
      case '十':
        return 10
      default:
        return parseInt(
          hoursText
            .replace(/^十/, '一')
            .replace(/十$/, '〇')
            .replace('十', '')
            .split('')
            .map((char) => kanjiNumberMap.get(char) ?? char)
            .join('')
        )
    }
  }
}
const Hours = named(
  'JapaneseHours',
  /(2[0-3]|[01]?[0-9]|二?十[一二三]?|十?[一二三四五六七八九]|零)時/
).parseAs(HoursNode)

class MinutesNode extends EnglishGrammar.MinutesNode {
  minutes(input: string) {
    const minutesText = input.substring(this.from, this.to - 1)
    switch (minutesText) {
      case '零':
        return 0
      case '十':
        return 10
      default:
        return parseInt(
          minutesText
            .replace(/^十/, '一')
            .replace(/十$/, '〇')
            .replace('十', '')
            .split('')
            .map((char) => kanjiNumberMap.get(char) ?? char)
            .join('')
        )
    }
  }
}
const Minutes = named(
  'JapaneseMinutes',
  /([0-5]?[0-9]|[二三四五]?十[一二三四五六七八九]?|[一二三四五六七八九]|零)分/
).parseAs(MinutesNode)

class SecondsNode extends EnglishGrammar.SecondsNode {
  seconds(input: string): number {
    const secondsText = input.substring(this.from, this.to - 1)
    switch (secondsText) {
      case '零':
        return 0
      case '十':
        return 10
      default:
        return parseInt(
          secondsText
            .replace(/^十/, '一')
            .replace(/十$/, '〇')
            .replace('十', '')
            .split('')
            .map((char) => kanjiNumberMap.get(char) ?? char)
            .join('')
        )
    }
  }
}
const Seconds = named(
  'JapaneseSeconds',
  /([0-5]?[0-9]|[二三四五]?十[一二三四五六七八九]?|[一二三四五六七八九]|零)秒/
).parseAs(SecondsNode)

class TimeNode extends EnglishGrammar.TimeNode {
  hours(input: string) {
    return this.find(HoursNode)?.hours(input)
  }
  minutes(input: string) {
    return this.find(MinutesNode)?.minutes(input)
  }
  seconds(input: string) {
    return this.find(SecondsNode)?.seconds(input)
  }
  amPm(input: string) {
    return this.find(AmPmNode)?.amPm(input)
  }
}

class AmPmNode extends EnglishGrammar.AmPmNode {
  amPm(input: string) {
    switch (this.substringOf(input)) {
      case '午前':
        return AmPmValue.AM
      case '午後':
        return AmPmValue.PM
      default:
        throw new Error(`unexpected`)
    }
  }
}
const AmPm = named('JapaneseAmPm', /午[前後]/).parseAs(AmPmNode)

const Time = named(
  'Time',
  longestOf(
    group(AmPm.maybe(), Hours, group(Minutes, Seconds.maybe())),
    group(AmPm.maybe(), Hours, group(Minutes, Seconds.maybe()).maybe())
  )
).parseAs(TimeNode)

export class DateTimeNode extends EnglishGrammar.DateTimeNode {
  date(input: string): DateFn[] | undefined {
    return this.find(DateNode)?.dateFns(input)
  }
  time(input: string): DateFn[] | undefined {
    return this.find(TimeNode)?.dateFns(input)
  }
}

export const DateTime = named(
  'JapaneseDateTime',
  longestOf(Date, Time, group(Date, group(space.maybe(), Time)))
).parseAs(DateTimeNode)

export const Range = named(
  'Range',
  group(
    named('RangeStart', DateTime),
    group(
      space.maybe(),
      oneOf('から', '～', '－', 'ー', '~', '-'),
      space.maybe()
    ),
    named('RangeEnd', DateTime),
    group(space.maybe(), 'まで').maybe()
  )
).parseAs(EnglishGrammar.RangeNode)
