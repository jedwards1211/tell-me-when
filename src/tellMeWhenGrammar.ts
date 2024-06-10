import { AddFn, DateFn } from './DateFn'
import { GrammarNode } from './GrammarNode'
import { ParseNode } from './ParseNode'
const { token, group, named, oneOf, longestOf } = GrammarNode

const space = token(/\s+/)

export class FullYearNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('FullYear', wrapped.from, wrapped.to)
  }

  year(input: string) {
    return parseInt(this.substringOf(input))
  }
}
const FullYear = token(/\d{4}/).parseAs(FullYearNode)

export class TwoDigitYearNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('TwoDigitYear', wrapped.from, wrapped.to)
  }

  year(input: string) {
    const digits = parseInt(this.substringOf(input).replace(/^'/, ''))
    return digits >= 70 ? 1900 + digits : 2000 + digits
  }
}
const TwoDigitYear = token(/'?\d\d/).parseAs(TwoDigitYearNode)

const Year = FullYear.or(TwoDigitYear)

export class MonthNumNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('MonthNum', wrapped.from, wrapped.to)
  }

  month(input: string) {
    return parseInt(this.substringOf(input)) - 1
  }
}
const MonthNum = token(/0?[1-9]|1[0-2]/).parseAs(MonthNumNode)

export class MonthNameNode extends ParseNode {
  static months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  }

  month(input: string) {
    return MonthNameNode.months[
      input
        .substring(this.from, this.from + 3)
        .toLowerCase() as keyof (typeof MonthNameNode)['months']
    ]
  }
}
const MonthNameFull = named(
  'MonthNameFull',
  /(january|february|march|may|april|june|july|august|september|october|november|december)(?![a-z])/i
).parseAs(MonthNameNode)

const MonthNameAbbrev = named(
  'MonthNameAbbrev',
  /(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)(?![a-z])/i
).parseAs(MonthNameNode)

const MonthName = MonthNameFull.or(group(MonthNameAbbrev, group('.').maybe()))

const MonthNameNoDot = MonthNameFull.or(MonthNameAbbrev)

const Month = MonthName.or(MonthNum)
const MonthNoDot = MonthNameNoDot.or(MonthNum)

export class DayOfMonthNumNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('DayOfMonthNum', wrapped.from, wrapped.to)
  }

  dayOfMonth(input: string) {
    return parseInt(this.substringOf(input))
  }
}
const DayOfMonthNum = token(/[0-2]?[1-9]|3[01]/).parseAs(DayOfMonthNumNode)

export class NthDayOfMonthNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('NthDayOfMonth', wrapped.from, wrapped.to)
  }

  dayOfMonth(input: string) {
    const value = this.substringOf(input).toLowerCase()
    switch (value) {
      case '1st':
      case 'first':
        return 1
      case '2nd':
      case 'second':
        return 2
      case '3rd':
      case 'third':
        return 3
      case '4th':
      case 'fourth':
        return 4
      case '5th':
      case 'fifth':
        return 5
      case '6th':
      case 'sixth':
        return 6
      case '7th':
      case 'seventh':
        return 7
      case '8th':
      case 'eighth':
        return 8
      case '9th':
      case 'ninth':
        return 9
      case '10th':
      case 'tenth':
        return 10
      case '11th':
      case 'eleventh':
        return 11
      case '12th':
      case 'twelfth':
        return 12
      case '13th':
      case 'thirteenth':
        return 13
      case '14th':
      case 'fourteenth':
        return 14
      case '15th':
      case 'fifteenth':
        return 15
      case '16th':
      case 'sixteenth':
        return 16
      case '17th':
      case 'seventeenth':
        return 17
      case '18th':
      case 'eighteenth':
        return 18
      case '19th':
      case 'ninteenth':
        return 19
      case '20th':
      case 'twentieth':
        return 20
      case '21st':
      case 'twenty-first':
        return 21
      case '22nd':
      case 'twenty-second':
        return 22
      case '23rd':
      case 'twenty-third':
        return 23
      case '24th':
      case 'twenty-fourth':
        return 24
      case '25th':
      case 'twenty-fifth':
        return 25
      case '26th':
      case 'twenty-sixth':
        return 26
      case '27th':
      case 'twenty-seventh':
        return 27
      case '28th':
      case 'twenty-eighth':
        return 28
      case '29th':
      case 'twenty-ninthy':
        return 29
      case '30th':
      case 'thirtieth':
        return 30
      case '31st':
      case 'thirty-first':
        return 31
    }
  }
}
const NthDayOfMonth = token(
  /(1st|first|2nd|second|3rd|third|4th|fourth|5th|fifth|6th|sixth|7th|seventh|8th|eighth|9th|ninth|10th|tenth|11th|eleventh|12th|twelfth|13th|thirteenth|14th|fourteenth|15th|fifteenth|16th|sixteenth|17th|seventeenth|18th|eighteenth|19th|ninteenth|20th|twentieth|21st|twenty-first|22nd|twenty-second|23rd|twenty-third|24th|twenty-fourth|25th|twenty-fifth|26th|twenty-sixth|27th|twenty-seventh|28th|twenty-eighth|29th|twenty-ninthy|30th|thirtieth|31st|thirty-first)(?![a-z])/i
).parseAs(NthDayOfMonthNode)

const DayOfMonth = NthDayOfMonth.or(DayOfMonthNum)

export class DateNode extends ParseNode {
  year(input: string) {
    return (this?.find(FullYearNode) || this?.find(TwoDigitYearNode))?.year(
      input
    )
  }
  month(input: string) {
    return (this?.find(MonthNumNode) || this?.find(MonthNameNode))?.month(input)
  }
  day(input: string) {
    return (
      this?.find(DayOfMonthNumNode) || this?.find(NthDayOfMonthNode)
    )?.dayOfMonth(input)
  }

  dateFns(input: string): DateFn[] {
    const year = this.year(input)
    const month = this.month(input)
    const day = this.day(input)

    if (year == null) {
      return [
        ...(month != null ? ([['setMonth', month]] as DateFn[]) : []),
        ...(day != null ? ([['setDate', day]] as DateFn[]) : []),
        [
          day != null
            ? 'startOfDay'
            : month != null
            ? 'startOfMonth'
            : 'startOfYear',
        ],
        [
          'closestToNow',
          [
            [
              'if',
              { afterNow: [[month != null ? 'addYears' : 'addMonths', -1]] },
            ],
          ],
          [
            [
              'if',
              { beforeNow: [[month != null ? 'addYears' : 'addMonths', 1]] },
            ],
          ],
        ],
        ['makeInterval', [day != null ? 'addDays' : 'addMonths', 1]],
      ]
    }

    return [
      ['setYear', year],
      ...(month != null ? ([['setMonth', month]] as DateFn[]) : []),
      ...(day != null ? ([['setDate', day]] as DateFn[]) : []),
      [
        day != null
          ? 'startOfDay'
          : month != null
          ? 'startOfMonth'
          : 'startOfYear',
      ],
      [
        'makeInterval',
        [day != null ? 'addDays' : month != null ? 'addMonths' : 'addYears', 1],
      ],
    ]
  }
}

const Date = named(
  'Date',
  longestOf(
    group(
      FullYear,
      oneOf(
        group(MonthNameNoDot, DayOfMonth.maybe()),
        group('.', MonthNoDot, group('.', DayOfMonth).maybe()),
        group('-', MonthNoDot, group('-', DayOfMonth).maybe()),
        group('_', MonthNoDot, group('_', DayOfMonth).maybe()),
        group('/', MonthNoDot, group('/', DayOfMonth).maybe()),
        group(space, Month, group(space, DayOfMonth).maybe())
      ).maybe()
    ),
    group(
      MonthName,
      group(
        space,
        DayOfMonth,
        group(space.or(group(space.maybe(), ',', space.maybe())), Year).maybe()
      ).maybe()
    ),
    group(
      MonthNameNoDot,
      oneOf(
        group('.', DayOfMonth, group('.', Year).maybe()),
        group(NthDayOfMonth, Year.maybe()),
        DayOfMonth,
        group('-', DayOfMonth, group('-', Year).maybe()),
        group('_', DayOfMonth, group('_', Year).maybe()),
        group('/', DayOfMonth, group('/', Year).maybe())
      ).maybe()
    ),
    group(
      MonthNum,
      oneOf(
        group(NthDayOfMonth, Year.maybe()),
        group('.', DayOfMonth, group('.', Year).maybe()),
        group('-', DayOfMonth, group('-', Year).maybe()),
        group('_', DayOfMonth, group('_', Year).maybe()),
        group('/', DayOfMonth, group('/', Year).maybe()),
        group(space, DayOfMonth, group(space, Year).maybe())
      )
    ),
    group(
      group('the', space).maybe(),
      NthDayOfMonth,
      oneOf(
        group(MonthNameNoDot, Year.maybe()),
        group('.', MonthNoDot, group('.', Year).maybe()),
        group('-', MonthNoDot, group('-', Year).maybe()),
        group('_', MonthNoDot, group('_', Year).maybe()),
        group('/', MonthNoDot, group('/', Year).maybe()),
        group(
          space,
          group(group('day', space).maybe(), 'of', space).maybe(),
          MonthName,
          group(
            space.or(group(space.maybe(), ',', space.maybe())),
            Year
          ).maybe()
        )
      ).maybe()
    ),
    group(
      DayOfMonthNum,
      oneOf(
        group(MonthNameNoDot, Year.maybe()),
        group('.', MonthNoDot, group('.', Year).maybe()),
        group('-', MonthNoDot, group('-', Year).maybe()),
        group('_', MonthNoDot, group('_', Year).maybe()),
        group('/', MonthNoDot, group('/', Year).maybe()),
        group(space, Month, group(space, Year).maybe())
      )
    )
  )
).parseAs(DateNode)

const DayDate = named(
  'DayDate',
  longestOf(
    group(
      FullYear,
      oneOf(
        group(MonthNameNoDot, DayOfMonth),
        group('.', MonthNoDot, group('.', DayOfMonth)),
        group('-', MonthNoDot, group('-', DayOfMonth)),
        group('_', MonthNoDot, group('_', DayOfMonth)),
        group('/', MonthNoDot, group('/', DayOfMonth)),
        group(space, Month, group(space, DayOfMonth))
      ).maybe()
    ),
    group(
      MonthName,
      group(
        space,
        DayOfMonth,
        group(space.or(group(space.maybe(), ',', space.maybe())), Year).maybe()
      )
    ),
    group(
      MonthNameNoDot,
      oneOf(
        group('.', DayOfMonth, group('.', Year).maybe()),
        group(NthDayOfMonth, Year.maybe()),
        DayOfMonth,
        group('-', DayOfMonth, group('-', Year).maybe()),
        group('_', DayOfMonth, group('_', Year).maybe()),
        group('/', DayOfMonth, group('/', Year).maybe())
      )
    ),
    group(
      MonthNum,
      oneOf(
        group(NthDayOfMonth, Year.maybe()),
        group('.', DayOfMonth, group('.', Year).maybe()),
        group('-', DayOfMonth, group('-', Year).maybe()),
        group('_', DayOfMonth, group('_', Year).maybe()),
        group('/', DayOfMonth, group('/', Year).maybe()),
        group(space, DayOfMonth, group(space, Year).maybe())
      )
    ),
    group(
      group('the', space).maybe(),
      NthDayOfMonth,
      oneOf(
        group(MonthNameNoDot, Year.maybe()),
        group('.', MonthNoDot, group('.', Year).maybe()),
        group('-', MonthNoDot, group('-', Year).maybe()),
        group('_', MonthNoDot, group('_', Year).maybe()),
        group('/', MonthNoDot, group('/', Year).maybe()),
        group(
          space,
          group(group('day', space).maybe(), 'of', space).maybe(),
          MonthName,
          group(
            space.or(group(space.maybe(), ',', space.maybe())),
            Year
          ).maybe()
        )
      ).maybe()
    ),
    group(
      DayOfMonthNum,
      oneOf(
        group(MonthNameNoDot, Year.maybe()),
        group('.', MonthNoDot, group('.', Year).maybe()),
        group('-', MonthNoDot, group('-', Year).maybe()),
        group('_', MonthNoDot, group('_', Year).maybe()),
        group('/', MonthNoDot, group('/', Year).maybe()),
        group(space, Month, group(space, Year).maybe())
      )
    )
  )
).parseAs(DateNode)

export class HoursNode extends ParseNode {
  hours(input: string) {
    return parseInt(this.substringOf(input))
  }
}
const Hours = named('Hours', /[01]?[0-9]|2[0-3]/).parseAs(HoursNode)
export class MinutesNode extends ParseNode {
  minutes(input: string) {
    return parseInt(this.substringOf(input))
  }
}
const Minutes = named('Minutes', /[0-5][0-9]/).parseAs(MinutesNode)
export class SecondsNode extends ParseNode {
  seconds(input: string) {
    return parseInt(this.substringOf(input))
  }
}
const Seconds = named('Seconds', /[0-5][0-9]/).parseAs(SecondsNode)
export class MillisecondsNode extends ParseNode {
  milliseconds(input: string) {
    return parseInt(this.substringOf(input).padEnd(3, '0'))
  }
}
const Milliseconds = named('Milliseconds', /\d{1,3}/).parseAs(MillisecondsNode)

export enum AmPmValue {
  AM,
  PM,
}
export class AmPmNode extends ParseNode {
  amPm(input: string) {
    switch (input.substring(this.from, this.from + 1)) {
      case 'a':
      case 'A':
        return AmPmValue.AM
      case 'p':
      case 'P':
        return AmPmValue.PM
      default:
        throw new Error(`unexpected`)
    }
  }
}
const AmPm = named('AmPm', /[ap]m?(?!\w)/i).parseAs(AmPmNode)

export class TimeNode extends ParseNode {
  hours(input: string) {
    return this.find(HoursNode)?.hours(input)
  }
  minutes(input: string) {
    return this.find(MinutesNode)?.minutes(input)
  }
  seconds(input: string) {
    return this.find(SecondsNode)?.seconds(input)
  }
  milliseconds(input: string) {
    return this.find(MillisecondsNode)?.milliseconds(input)
  }
  amPm(input: string) {
    return this.find(AmPmNode)?.amPm(input)
  }

  dateFns(input: string): DateFn[] {
    let hours = this.hours(input)
    const minutes = this.minutes(input)
    const seconds = this.seconds(input)
    const milliseconds = this.milliseconds(input)
    const amPm = this.amPm(input)

    if (hours != null && amPm) {
      if (hours < 0 || hours > 12) {
        throw new Error('hour out of range')
      }
      if (amPm === AmPmValue.PM && hours !== 12) hours += 12
    }

    return [
      ...(hours != undefined ? ([['setHours', hours]] as DateFn[]) : []),
      ...(minutes != undefined ? ([['setMinutes', minutes]] as DateFn[]) : []),
      ...(seconds != undefined ? ([['setSeconds', seconds]] as DateFn[]) : []),
      ...(milliseconds != undefined
        ? ([['setMilliseconds', milliseconds]] as DateFn[])
        : ([
            [
              seconds != undefined
                ? 'startOfSecond'
                : minutes != undefined
                ? 'startOfMinute'
                : 'startOfHour',
            ],
            [
              'makeInterval',
              [
                seconds != undefined
                  ? 'addSeconds'
                  : minutes != undefined
                  ? 'addMinutes'
                  : 'addHours',
                1,
              ],
            ],
          ] as DateFn[])),
    ]
  }
}

const AtTime = named(
  'AtTime',
  Hours,
  group(
    ':',
    Minutes,
    group(':', Seconds, group('.', Milliseconds).maybe()).maybe()
  ).maybe(),
  group(space.maybe(), AmPm).maybe()
).parseAs(TimeNode)

const Time = named(
  'Time',
  longestOf(
    group(
      Hours,
      group(
        ':',
        Minutes,
        group(':', Seconds, group('.', Milliseconds).maybe()).maybe()
      ),
      group(space.maybe(), AmPm).maybe()
    ),
    group(
      Hours,
      group(
        ':',
        Minutes,
        group(':', Seconds, group('.', Milliseconds).maybe()).maybe()
      ).maybe(),
      group(space.maybe(), AmPm)
    )
  )
).parseAs(TimeNode)

export class NowNode extends ParseNode {
  dateFns(): DateFn[] {
    return [['now']]
  }
}

const Now = named('Now', /now|(the\s+)?present(\s+time)?/).parseAs(NowNode)

export class DateTimeNode extends ParseNode {
  date(input: string): DateFn[] | undefined {
    return (
      this.find(DateNode) ||
      this.find(RelativeDayNode) ||
      this.find(RelativeMonthNode) ||
      this.find(DateTimeOffsetNode) ||
      this.find(NowNode)
    )?.dateFns(input)
  }
  time(input: string): DateFn[] | undefined {
    return this.find(TimeNode)?.dateFns(input)
  }

  dateFns(input: string): DateFn[] {
    const Time = this.time(input)
    const Date = this.date(input)
    if (Date && Time) {
      return [
        ...Date.filter(
          (op) => op[0] !== 'makeInterval' && !op[0].startsWith('startOf')
        ),
        ...Time,
      ]
    }
    return Date || Time || []
  }
}

export class QuantityNumNode extends ParseNode {
  quantity(input: string) {
    return parseInt(this.substringOf(input))
  }
}

export const QuantityNum = named('QuantityNum', /\d+/).parseAs(QuantityNumNode)

export class QuantityWordNode extends ParseNode {
  static quantities = {
    zero: 0,
    an: 1,
    a: 1,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
  }
  quantity(input: string) {
    return QuantityWordNode.quantities[
      this.substringOf(
        input
      ).toLowerCase() as keyof typeof QuantityWordNode.quantities
    ]
  }
}

export const QuantityWord = named(
  'QuantityWord',
  new RegExp(Object.keys(QuantityWordNode.quantities).join('|'), 'i')
).parseAs(QuantityWordNode)

export class QuantityNode extends ParseNode {
  quantity(input: string) {
    return (
      this.find(QuantityNumNode) || this.find(QuantityWordNode)
    )?.quantity(input)
  }
}

export const Quantity = named(
  'Quantity',
  oneOf(QuantityNum, QuantityWord)
).parseAs(QuantityNode)

type DateTimeUnit =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds'

export class DateTimeUnitNode extends ParseNode {
  unit(input: string): DateTimeUnit {
    switch (this.substringOf(input).toLowerCase()) {
      case 'y':
      case 'yr':
      case 'year':
      case 'years':
        return 'years'
      case 'mo':
      case 'mos':
      case 'month':
      case 'months':
        return 'months'
      case 'w':
      case 'wk':
      case 'wks':
      case 'week':
      case 'weeks':
        return 'weeks'
      case 'd':
      case 'day':
      case 'days':
        return 'days'
      case 'h':
      case 'hr':
      case 'hrs':
      case 'hour':
      case 'hours':
        return 'hours'
      case 'm':
      case 'min':
      case 'mins':
      case 'minute':
      case 'minutes':
        return 'minutes'
      case 's':
      case 'sec':
      case 'secs':
      case 'second':
      case 'seconds':
        return 'seconds'
      case 'ms':
      case 'milli':
      case 'millis':
      case 'millisecond':
      case 'milliseconds':
        return 'milliseconds'
      default:
        throw new Error('unexpected')
    }
  }
  dateFnName(input: string): DateFn[0] {
    switch (this.unit(input)) {
      case 'years':
        return 'addYears'
      case 'months':
        return 'addMonths'
      case 'weeks':
        return 'addWeeks'
      case 'days':
        return 'addDays'
      case 'hours':
        return 'addHours'
      case 'minutes':
        return 'addMinutes'
      case 'seconds':
        return 'addSeconds'
      case 'milliseconds':
        return 'addMilliseconds'
      default:
        throw new Error('unexpected')
    }
  }
}
export const DateTimeUnit = named(
  'DateTimeUnit',
  /years?|yrs?|y|months?|mos?|weeks?|wks?|w|days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s|milliseconds?|millis?|ms/i
).parseAs(DateTimeUnitNode)

export class DateTimeIntervalPartNode extends ParseNode {
  dateFns(input: string): AddFn[] {
    const quantity = this.find(QuantityNode)?.quantity(input)
    const dateFnName = this.find(DateTimeUnitNode)?.dateFnName(input)
    if (quantity == null || dateFnName == null) throw new Error(`unexpected`)
    return [[dateFnName, quantity]] as any
  }
}
export const DateTimeIntervalPart = named(
  'DateTimeIntervalPart',
  Quantity,
  space.maybe(),
  DateTimeUnit
).parseAs(DateTimeIntervalPartNode)

type DateTimeInterval = { [U in DateTimeUnit]?: number }

export class DateTimeIntervalNode extends ParseNode {
  dateFns(input: string): AddFn[] {
    const fns: AddFn[] = []
    for (const node of this.findAll(DateTimeIntervalPartNode)) {
      fns.push(...node.dateFns(input))
    }
    return fns
  }
}

const DateTimeInterval = named(
  'DateTimeInterval',
  DateTimeIntervalPart,
  group(
    space.maybe(),
    group(',', space.maybe()).maybe(),
    group('and', space).maybe(),
    DateTimeIntervalPart
  ).repeat(0, Infinity)
).parseAs(DateTimeIntervalNode)

export class DateTimeOffsetNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const fns: AddFn[] = this.find(DateTimeIntervalNode)?.dateFns(input) || []
    if (this.find('BeforeNow')) {
      for (const fn of fns) fn[1] = -fn[1]
    }
    return fns
  }
}

export const DateTimeOffset = named(
  'DateTimeOffset',
  DateTimeInterval,
  space.maybe(),
  oneOf(
    named(
      'BeforeNow',
      oneOf('ago', /in\s+the\s+past/i, group('before', space, Now))
    ),
    named(
      'AfterNow',
      oneOf(group(/after|from/i, space, Now), /in\s+the\s+future/i)
    )
  )
).parseAs(DateTimeOffsetNode)

export class RangeEndDateTimeOffsetNode extends DateTimeOffsetNode {
  dateFns(input: string): DateFn[] {
    const fns: DateFn[] = super.dateFns(input)
    if (this.find('Later')) return fns
    return [['now'], ...fns]
  }
}
export const RangeEndDateTimeOffset = named(
  'RangeEndDateTimeOffset',
  DateTimeInterval,
  space.maybe(),
  oneOf(
    named(
      'BeforeNow',
      oneOf('ago', /in\s+the\s+past/i, group('before', space, Now))
    ),
    named(
      'AfterNow',
      oneOf(group(/after|from/i, space, Now), /in\s+the\s+future/i)
    ),
    named('Later', /after\s+(then|that)|thereafter|later/)
  )
).parseAs(RangeEndDateTimeOffsetNode)

export class RelativeDayNode extends ParseNode {
  dateFns(): DateFn[] {
    const offset = this.find('Tomorrow')
      ? 1
      : this.find('Yesterday')
      ? -1
      : this.find('DayBeforeYesterday')
      ? -2
      : this.find('DayAfterTomorrow')
      ? 2
      : 0

    return [
      ...(offset ? ([['addDays', offset]] as DateFn[]) : []),
      ['startOfDay'],
      ['makeInterval', ['addDays', 1]],
    ]
  }
}

const RelativeDayBase = oneOf(
  named('Today', group('today')),
  named('Yesterday', group('yesterday')),
  named('Tomorrow', group('tomorrow')),
  group(
    group('the', space).maybe(),
    group('day', space),
    oneOf(
      named('DayBeforeYesterday', group('before', space, /yesterday|last/)),
      named('DayAfterTomorrow', group('after', space, /tomorrow|next/))
    )
  )
)

export const RelativeDay = named('RelativeDay', RelativeDayBase).parseAs(
  RelativeDayNode
)

export class RangeEndRelativeDayNode extends RelativeDayNode {
  dateFns(): DateFn[] {
    return [['now'], ...super.dateFns()]
  }
}

export const RangeEndRelativeDay = named(
  'RangeEndRelativeDay',
  RelativeDayBase
).parseAs(RangeEndRelativeDayNode)

const SpecificDay = oneOf(RelativeDay, DayDate)
const RangeEndSpecificDay = oneOf(RangeEndRelativeDay, DayDate)

export class RelativeMonthNode extends ParseNode {
  dateFns(): DateFn[] {
    const offset = this.find('NextMonth')
      ? 1
      : this.find('LastMonth')
      ? -1
      : this.find('MonthBeforeLast')
      ? -2
      : this.find('MonthAfterNext')
      ? 2
      : 0

    return [
      ...(offset ? ([['addMonths', offset]] as DateFn[]) : []),
      ['startOfMonth'],
      ['makeInterval', ['addMonths', 1]],
    ]
  }
}

const RelativeMonthBase = oneOf(
  named('ThisMonth', /this\s+month/i),
  named('LastMonth', /last\s+month/i),
  named('NextMonth', /next\s+month/i),
  group(
    group('the', space).maybe(),
    group('month', space),
    oneOf(
      named('MonthBeforeLast', group('before', space, 'last')),
      named('MonthAfterNext', group('after', space, 'next'))
    )
  )
)

export const RelativeMonth = named('RelativeMonth', RelativeMonthBase).parseAs(
  RelativeMonthNode
)

export class RangeEndRelativeMonthNode extends RelativeMonthNode {
  dateFns(): DateFn[] {
    return [['now'], ...super.dateFns()]
  }
}

export const RangeEndRelativeMonth = named(
  'RangeEndRelativeMonth',
  RelativeMonthBase
).parseAs(RangeEndRelativeMonthNode)

export const DateTime = named(
  'DateTime',
  longestOf(
    Date,
    RelativeMonth,
    group(
      oneOf(DateTimeOffset, SpecificDay),
      group(space, group('at', space).maybe(), AtTime).maybe()
    ),
    group(Time, group(space, group('on', space).maybe(), SpecificDay).maybe()),
    group(AtTime, group(space, group('on', space), SpecificDay)),
    Now
  )
).parseAs(DateTimeNode)

export const RangeEndDateTime = named(
  'RangeEndDateTime',
  longestOf(
    Date,
    RangeEndRelativeMonth,
    group(
      oneOf(RangeEndDateTimeOffset, RangeEndSpecificDay),
      group(space, group('at', space).maybe(), AtTime).maybe()
    ),
    group(
      Time,
      group(space, group('on', space).maybe(), RangeEndSpecificDay).maybe()
    ),
    group(AtTime, group(space, group('on', space), RangeEndSpecificDay)),
    Now
  )
).parseAs(DateTimeNode)

export class RangeNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const start = this.find('RangeStart')?.find(DateTimeNode)?.dateFns(input)
    if (!start) throw new Error('unexpected')
    const RangeEnd = this.find('RangeEnd')?.find(DateTimeNode)
    if (!RangeEnd) throw new Error('unexpected')
    const end = RangeEnd.dateFns(input)

    const through = this.find('Through') != null

    const endFns = end.flatMap((fn) =>
      fn[0] === 'makeInterval' ? (fn.slice(1) as DateFn[]) : [fn]
    )
    if (
      !through &&
      end.find((fn) => fn[0] === 'makeInterval') &&
      endFns[endFns.length - 1]?.[0]?.startsWith('add')
    ) {
      endFns.pop()
    }

    return [
      ...start.filter((fn) => fn[0] !== 'makeInterval'),
      ['makeInterval', ...endFns],
    ]
  }
}

export const Range = named(
  'Range',
  group(
    group('from', space).maybe(),
    named('RangeStart', DateTime),
    space,
    oneOf('to', named('Through', 'through'), 'until', '-'),
    space,
    named('RangeEnd', RangeEndDateTime)
  )
).parseAs(RangeNode)

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
