import { AddFn, DateFn } from './DateFn'
import { GrammarNode } from './GrammarNode'
import { ParseNode } from './ParseNode'
const { token, group, named, oneOf, longestOf, negativeLookahead } = GrammarNode

const space = token(/\s+/)

export class FullYearNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('FullYear', wrapped.from, wrapped.to)
  }

  year(input: string) {
    return parseInt(this.substringOf(input))
  }

  dateFns(input: string): DateFn[] {
    return [['setYear', this.year(input)]]
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

  dateFns(input: string): DateFn[] {
    return [['setYear', this.year(input)]]
  }
}
const TwoDigitYear = token(/'?\d\d/).parseAs(TwoDigitYearNode)

const YearNum = FullYear.or(TwoDigitYear)

const YearNumNotHour = oneOf(
  FullYear,
  token(/'\d\d/).parseAs(TwoDigitYearNode),
  group(
    token(/\d\d/).parseAs(TwoDigitYearNode),
    negativeLookahead(/:|\s*[ap](m|\s)/i)
  )
)

export class MonthNumNode extends ParseNode {
  constructor(public wrapped: ParseNode) {
    super('MonthNum', wrapped.from, wrapped.to)
  }

  month(input: string) {
    return parseInt(this.substringOf(input)) - 1
  }

  dateFns(input: string): DateFn[] {
    return [
      ['setMonth', this.month(input)],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
      ['startOfMonth'],
      ['makeInterval', ['addMonths', 1]],
    ]
  }
}
const MonthNum = token(/1[0-2]|0?[1-9]/).parseAs(MonthNumNode)

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

  dateFns(input: string): DateFn[] {
    const month = this.month(input)
    return [
      ['setMonth', month],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
      ['startOfMonth'],
      ['makeInterval', ['addMonths', 1]],
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

export class RelativeMonthNameNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const month = this.find(MonthNameNode)?.month(input)
    if (month == null) throw new Error(`failed to find month name node`)

    if (this.find('Next')) {
      return [
        ['setMonth', month],
        ['startOfMonth'],
        ['if', { beforeNow: [['addYears', 1]] }],
        ['makeInterval', ['addMonths', 1]],
      ]
    }
    if (this.find('AfterNext')) {
      return [
        ['setMonth', month],
        ['startOfMonth'],
        ['if', { beforeNow: [['addYears', 1]] }],
        ['addYears', 1],
        ['makeInterval', ['addMonths', 1]],
      ]
    }
    if (this.find('Last')) {
      return [
        ['setMonth', month],
        ['startOfMonth'],
        ['addMonths', 1],
        ['if', { afterNow: [['addYears', -1]] }],
        ['addMonths', -1],
        ['makeInterval', ['addMonths', 1]],
      ]
    }
    if (this.find('BeforeLast')) {
      return [
        ['setMonth', month],
        ['startOfMonth'],
        ['addMonths', 1],
        ['if', { afterNow: [['addYears', -1]] }],
        ['addMonths', -1],
        ['addYears', -1],
        ['makeInterval', ['addMonths', 1]],
      ]
    }
    return []
  }
}

export const RelativeMonthName = named(
  'RelativeMonthName',
  oneOf(
    group(named('Last', /last/i), space, MonthName),
    group(named('Next', /next/i), space, MonthName),
    group(MonthName, space, named('BeforeLast', /before\s+last/i)),
    group(MonthName, space, named('AfterNext', /after\s+next/i))
  )
).parseAs(RelativeMonthNameNode)

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

type RelativeIntervalType =
  | 'Second'
  | 'Minute'
  | 'Day'
  | 'Hour'
  | 'Week'
  | 'Month'
  | 'Year'

export abstract class RelativeIntervalNode extends ParseNode {
  abstract get intervalName(): RelativeIntervalType

  dateFns(): DateFn[] {
    const { intervalName } = this

    const offset = this.find(`Next${intervalName}`)
      ? 1
      : this.find(`Last${intervalName}`)
      ? -1
      : this.find(`${intervalName}BeforeLast`)
      ? -2
      : this.find(`${intervalName}AfterNext`)
      ? 2
      : 0

    return [
      ...(offset ? ([[`add${intervalName}s`, offset]] as DateFn[]) : []),
      [`startOf${intervalName}`],
      [`makeInterval`, [`add${intervalName}s`, 1]],
    ]
  }
}

export class RelativeSecondNode extends RelativeIntervalNode {
  get intervalName(): 'Second' {
    return 'Second'
  }
}
export class RelativeMinuteNode extends RelativeIntervalNode {
  get intervalName(): 'Minute' {
    return 'Minute'
  }
}
export class RelativeHourNode extends RelativeIntervalNode {
  get intervalName(): 'Hour' {
    return 'Hour'
  }
}
export class RelativeWeekNode extends RelativeIntervalNode {
  get intervalName(): 'Week' {
    return 'Week'
  }
}
export class RelativeMonthNode extends RelativeIntervalNode {
  get intervalName(): 'Month' {
    return 'Month'
  }
}
export class RelativeYearNode extends RelativeIntervalNode {
  get intervalName(): 'Year' {
    return 'Year'
  }
}

const RelativeIntervalNodes = {
  Second: RelativeSecondNode,
  Minute: RelativeMinuteNode,
  Hour: RelativeHourNode,
  Week: RelativeWeekNode,
  Month: RelativeMonthNode,
  Year: RelativeYearNode,
}

const RelativeIntervalBase = (intervalName: RelativeIntervalType) =>
  oneOf(
    named(`This${intervalName}`, new RegExp(`this\\s+${intervalName}`, 'i')),
    named(`Last${intervalName}`, new RegExp(`last\\s+${intervalName}`, 'i')),
    named(`Next${intervalName}`, new RegExp(`next\\s+${intervalName}`, 'i')),
    named(
      `${intervalName}BeforeLast`,
      new RegExp(`(the\\s+)?${intervalName}\\s+before\\s+last`, 'i')
    ),
    named(
      `${intervalName}AfterNext`,
      new RegExp(`(the\\s+)?${intervalName}\\s+after\\s+next`, 'i')
    )
  )

const RelativeInterval = (intervalName: Exclude<RelativeIntervalType, 'Day'>) =>
  named(`Relative${intervalName}`, RelativeIntervalBase(intervalName)).parseAs(
    RelativeIntervalNodes[intervalName]
  )

export const RelativeSecond = RelativeInterval('Second')
export const RelativeMinute = RelativeInterval('Minute')
export const RelativeHour = RelativeInterval('Hour')
export const RelativeWeek = RelativeInterval('Week')
export const RelativeMonth = RelativeInterval('Month')
export const RelativeYear = RelativeInterval('Year')

export class DateNode extends ParseNode {
  yearFns(input: string): DateFn[] | undefined {
    return (
      (this.find(FullYearNode) || this.find(TwoDigitYearNode))?.dateFns(
        input
      ) ||
      this.find(RelativeYearNode)
        ?.dateFns()
        .filter((fn) => fn[0] === 'addYears')
    )
  }
  monthFns(input: string): DateFn[] | undefined {
    const month = (
      this?.find(MonthNumNode) || this?.find(MonthNameNode)
    )?.month(input)
    return month ? [['setMonth', month]] : undefined
  }
  relativeMonthFns(input: string): DateFn[] | undefined {
    return this.find(RelativeMonthNameNode)
      ?.dateFns(input)
      .filter((fn) => fn[0] !== 'makeInterval')
  }
  day(input: string) {
    return (
      this?.find(DayOfMonthNumNode) || this?.find(NthDayOfMonthNode)
    )?.dayOfMonth(input)
  }

  dateFns(input: string): DateFn[] {
    const year = this.yearFns(input)
    const relativeMonth = this.relativeMonthFns(input)
    const month = relativeMonth || this.monthFns(input)
    const day = this.day(input)

    if (year == null) {
      return [
        ...(month || []),
        ...(day != null ? ([['setDate', day]] satisfies DateFn[]) : []),
        ...((relativeMonth
          ? day != null
            ? [['startOfDay']]
            : []
          : [
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
                    {
                      afterNow: [
                        [month != null ? 'addYears' : 'addMonths', -1],
                      ],
                    },
                  ],
                ],
                [
                  [
                    'if',
                    {
                      beforeNow: [
                        [month != null ? 'addYears' : 'addMonths', 1],
                      ],
                    },
                  ],
                ],
              ],
            ]) satisfies DateFn[]),
        ['makeInterval', [day != null ? 'addDays' : 'addMonths', 1]],
      ]
    }

    return [
      ...(year || []),
      ...(month || []),
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
      RelativeYear,
      group(space, Month, group(space, DayOfMonth).maybe()).maybe()
    ),
    group(
      MonthName,
      longestOf(
        group(
          space,
          DayOfMonth,
          group(
            space.or(group(space.maybe(), ',', space.maybe())),
            oneOf(YearNumNotHour, RelativeYear)
          ).maybe()
        ),
        group(
          space.or(group(space.maybe(), ',', space.maybe())),
          oneOf(YearNum, RelativeYear)
        )
      ).maybe()
    ),
    group(RelativeMonthName, group(space, DayOfMonth).maybe()),
    group(
      MonthNameNoDot,
      oneOf(
        group('.', DayOfMonth, group('.', YearNum).maybe()),
        group(NthDayOfMonth, YearNumNotHour.maybe()),
        DayOfMonth,
        group('-', DayOfMonth, group('-', YearNum).maybe()),
        group('_', DayOfMonth, group('_', YearNum).maybe()),
        group('/', DayOfMonth, group('/', YearNum).maybe())
      ).maybe()
    ),
    group(
      MonthNum,
      longestOf(
        group(/[- ._/]/, FullYear),
        group(NthDayOfMonth, YearNumNotHour.maybe()),
        group('.', DayOfMonth, group('.', YearNum).maybe()),
        group('-', DayOfMonth, group('-', YearNum).maybe()),
        group('_', DayOfMonth, group('_', YearNum).maybe()),
        group('/', DayOfMonth, group('/', YearNum).maybe()),
        group(space, DayOfMonth, group(space, YearNumNotHour).maybe())
      )
    ),
    group(
      group('the', space).maybe(),
      NthDayOfMonth,
      oneOf(
        group(MonthNameNoDot, YearNumNotHour.maybe()),
        group('.', MonthNoDot, group('.', YearNum).maybe()),
        group('-', MonthNoDot, group('-', YearNum).maybe()),
        group('_', MonthNoDot, group('_', YearNum).maybe()),
        group('/', MonthNoDot, group('/', YearNum).maybe()),
        group(
          space,
          group(group('day', space).maybe(), 'of', space).maybe(),
          MonthName,
          group(
            space.or(group(space.maybe(), ',', space.maybe())),
            oneOf(YearNumNotHour, RelativeYear)
          ).maybe()
        )
      ).maybe()
    ),
    group(
      DayOfMonthNum,
      oneOf(
        group(MonthNameNoDot, YearNumNotHour.maybe()),
        group('.', MonthNoDot, group('.', YearNum).maybe()),
        group('-', MonthNoDot, group('-', YearNum).maybe()),
        group('_', MonthNoDot, group('_', YearNum).maybe()),
        group('/', MonthNoDot, group('/', YearNum).maybe()),
        group(space, MonthName, group(space, RelativeYear).maybe()),
        group(space, Month, group(space, YearNumNotHour).maybe())
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
    group(RelativeYear, space, Month, group(space, DayOfMonth)),
    group(
      MonthName,
      group(
        space,
        DayOfMonth,
        group(
          space.or(group(space.maybe(), ',', space.maybe())),
          oneOf(YearNumNotHour, RelativeYear)
        ).maybe()
      )
    ),
    group(RelativeMonthName, group(space, DayOfMonth)),
    group(
      MonthNameNoDot,
      oneOf(
        group('.', DayOfMonth, group('.', YearNum).maybe()),
        group(NthDayOfMonth, YearNumNotHour.maybe()),
        DayOfMonth,
        group('-', DayOfMonth, group('-', YearNum).maybe()),
        group('_', DayOfMonth, group('_', YearNum).maybe()),
        group('/', DayOfMonth, group('/', YearNum).maybe())
      )
    ),
    group(
      MonthNum,
      oneOf(
        group(NthDayOfMonth, YearNumNotHour.maybe()),
        group('.', DayOfMonth, group('.', YearNum).maybe()),
        group('-', DayOfMonth, group('-', YearNum).maybe()),
        group('_', DayOfMonth, group('_', YearNum).maybe()),
        group('/', DayOfMonth, group('/', YearNum).maybe()),
        group(
          space,
          DayOfMonth,
          group(space, oneOf(YearNumNotHour, RelativeYear)).maybe()
        )
      )
    ),
    group(
      group('the', space).maybe(),
      NthDayOfMonth,
      oneOf(
        group(MonthNameNoDot, YearNumNotHour.maybe()),
        group('.', MonthNoDot, group('.', YearNum).maybe()),
        group('-', MonthNoDot, group('-', YearNum).maybe()),
        group('_', MonthNoDot, group('_', YearNum).maybe()),
        group('/', MonthNoDot, group('/', YearNum).maybe()),
        group(
          space,
          group(group('day', space).maybe(), 'of', space).maybe(),
          MonthName,
          group(
            space.or(group(space.maybe(), ',', space.maybe())),
            oneOf(YearNumNotHour, RelativeYear)
          ).maybe()
        )
      ).maybe()
    ),
    group(
      DayOfMonthNum,
      oneOf(
        group(MonthNameNoDot, YearNumNotHour.maybe()),
        group('.', MonthNoDot, group('.', YearNum).maybe()),
        group('-', MonthNoDot, group('-', YearNum).maybe()),
        group('_', MonthNoDot, group('_', YearNum).maybe()),
        group('/', MonthNoDot, group('/', YearNum).maybe()),
        group(
          space,
          Month,
          group(space, oneOf(YearNumNotHour, RelativeYear)).maybe()
        )
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

    if (hours != null && amPm != null) {
      if (hours < 0 || hours > 12) {
        throw new Error('hour out of range')
      }
      if (amPm === AmPmValue.PM && hours !== 12) hours += 12
      else if (amPm === AmPmValue.AM && hours === 12) hours = 0
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

export const BeforeNow = named(
  'BeforeNow',
  oneOf('ago', /in\s+the\s+past/i, group('before', space, Now))
)

export const AfterNow = named(
  'AfterNow',
  oneOf(group(/after|from/i, space, Now), /in\s+the\s+future/i)
)

export const DateTimeOffset = named(
  'DateTimeOffset',
  DateTimeInterval,
  space.maybe(),
  oneOf(BeforeNow, AfterNow)
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
    BeforeNow,
    AfterNow,
    named('Later', /after\s+(then|that)|thereafter|later/)
  )
).parseAs(RangeEndDateTimeOffsetNode)

export class RelativeDayNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const quantity = this.find(QuantityNode)?.quantity(input)
    if (quantity != null) {
      return [
        ['addDays', this.find('BeforeNow') ? -quantity : quantity],
      ] as DateFn[]
    }

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
  dateFns(input: string): DateFn[] {
    return [['now'], ...super.dateFns(input)]
  }
}

export const RangeEndRelativeDay = named(
  'RangeEndRelativeDay',
  RelativeDayBase
).parseAs(RangeEndRelativeDayNode)

export class DayOfWeekNode extends ParseNode {
  dayOfWeek(input: string): number {
    switch (this.substringOf(input).toLowerCase()) {
      case 'sunday':
      case 'sun':
        return 0
      case 'monday':
      case 'mon':
        return 1
      case 'tuesday':
      case 'tues':
      case 'tue':
        return 2
      case 'wednesday':
      case 'wed':
        return 3
      case 'thursday':
      case 'thurs':
      case 'thur':
      case 'thu':
        return 4
      case 'friday':
      case 'fri':
        return 5
      case 'saturday':
      case 'sat':
        return 6
    }
    throw new Error(`invalid day of week: ${this.substringOf(input)}`)
  }

  dateFns(input: string): DateFn[] {
    const dayOfWeek = this.dayOfWeek(input)

    return [
      ['setDay', dayOfWeek],
      [
        'closestToNow',
        [['if', { afterNow: [['addWeeks', -1]] }]],
        [['if', { beforeNow: [['addWeeks', 1]] }]],
      ],
      ['startOfDay'],
      ['makeInterval', ['addDays', 1]],
    ]
  }
}

export const DayOfWeek = named(
  'DayOfWeek',
  /sun(day)?|tue(s(day)?)?|wed(nesday)?|thu(r(s(day)?)?)?|fri(day)?|sat(urday)?/i
).parseAs(DayOfWeekNode)

export class RelativeDayOfWeekNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const dayOfWeek = this.find(DayOfWeekNode)?.dayOfWeek(input)
    if (dayOfWeek == null) throw new Error(`failed to find DayOfWeekNode`)
    if (this.find('Next')) {
      return [
        ['setDay', dayOfWeek],
        ['startOfDay'],
        ['if', { beforeNow: [['addWeeks', 1]] }],
        ['makeInterval', ['addDays', 1]],
      ]
    }
    if (this.find('AfterNext')) {
      return [
        ['setDay', dayOfWeek],
        ['startOfDay'],
        ['if', { beforeNow: [['addWeeks', 1]] }],
        ['addWeeks', 1],
        ['makeInterval', ['addDays', 1]],
      ]
    }
    if (this.find('Last')) {
      return [
        ['setDay', dayOfWeek],
        ['startOfDay'],
        ['addDays', 1],
        ['if', { afterNow: [['addWeeks', -1]] }],
        ['addDays', -1],
        ['makeInterval', ['addDays', 1]],
      ]
    }
    if (this.find('BeforeLast')) {
      return [
        ['setDay', dayOfWeek],
        ['startOfDay'],
        ['addDays', 1],
        ['if', { afterNow: [['addWeeks', -1]] }],
        ['addDays', -1],
        ['addWeeks', -1],
        ['makeInterval', ['addDays', 1]],
      ]
    }
    return []
  }
}

export const RelativeDayOfWeek = named(
  'RelativeDayOfWeek',
  oneOf(
    group(named('Last', 'last'), space, DayOfWeek),
    group(named('Next', 'next'), space, DayOfWeek),
    group(DayOfWeek, space, named('BeforeLast', /before\s+last/i)),
    group(DayOfWeek, space, named('AfterNext', /after\s+next/i))
  )
).parseAs(RelativeDayOfWeekNode)

const SpecificDay = oneOf(RelativeDay, DayDate, RelativeDayOfWeek, DayOfWeek)
const RangeEndSpecificDay = oneOf(RangeEndRelativeDay, DayDate)

export abstract class RangeEndRelativeIntervalNode extends RelativeIntervalNode {
  dateFns(): DateFn[] {
    return [['now'], ...super.dateFns()]
  }
}

export class RangeEndRelativeSecondNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Second' {
    return 'Second'
  }
}
export class RangeEndRelativeMinuteNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Minute' {
    return 'Minute'
  }
}
export class RangeEndRelativeHourNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Hour' {
    return 'Hour'
  }
}
export class RangeEndRelativeWeekNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Week' {
    return 'Week'
  }
}
export class RangeEndRelativeMonthNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Month' {
    return 'Month'
  }
}
export class RangeEndRelativeYearNode extends RangeEndRelativeIntervalNode {
  get intervalName(): 'Year' {
    return 'Year'
  }
}

const RangeEndRelativeIntervalNodes = {
  Second: RangeEndRelativeSecondNode,
  Minute: RangeEndRelativeMinuteNode,
  Hour: RangeEndRelativeHourNode,
  Week: RangeEndRelativeWeekNode,
  Month: RangeEndRelativeMonthNode,
  Year: RangeEndRelativeYearNode,
}

export const RangeEndRelativeInterval = (
  intervalName: Exclude<RelativeIntervalType, 'Day'>
) =>
  named(
    `RangeEndRelative${intervalName}`,
    RelativeIntervalBase(intervalName)
  ).parseAs(RangeEndRelativeIntervalNodes[intervalName])

export const RangeEndRelativeSecond = RangeEndRelativeInterval('Second')
export const RangeEndRelativeMinute = RangeEndRelativeInterval('Minute')
export const RangeEndRelativeHour = RangeEndRelativeInterval('Hour')
export const RangeEndRelativeWeek = RangeEndRelativeInterval('Week')
export const RangeEndRelativeMonth = RangeEndRelativeInterval('Month')
export const RangeEndRelativeYear = RangeEndRelativeInterval('Year')

function negateDateFns(dateFns: DateFn[]): DateFn[] {
  return dateFns.map((fn) => {
    switch (fn[0]) {
      case 'addDays':
      case 'addHours':
      case 'addMilliseconds':
      case 'addMinutes':
      case 'addMonths':
      case 'addSeconds':
      case 'addWeeks':
      case 'addYears':
        return [fn[0], -fn[1]]
    }
    return fn
  })
}

class DateTimeOffsetIntervalUnitNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    switch (this.substringOf(input).toLowerCase()) {
      case 'year':
      case 'yr':
        return [['addYears', 1]]
      case 'month':
      case 'mon':
        return [['addMonths', 1]]
      case 'week':
      case 'wk':
        return [['addWeeks', 1]]
      case 'day':
        return [['addDays', 1]]
      case 'hour':
      case 'hr':
        return [['addHours', 1]]
      case 'minute':
      case 'min':
        return [['addMinutes', 1]]
      case 'second':
      case 'sec':
        return [['addSeconds', 1]]
    }
    throw new Error(`invalid input`)
  }
}

const DateTimeOffsetIntervalUnit = named(
  'DateTimeOffsetIntervalUnit',
  /year|yr|month|mon|week|wk|day|hour|hr|minute|min|second|sec/i
).parseAs(DateTimeOffsetIntervalUnitNode)

export class DateTimeOffsetIntervalNode extends ParseNode {
  dateFns(input: string): DateFn[] {
    const fns =
      this.find(DateTimeIntervalNode)?.dateFns(input) ??
      this.find(DateTimeOffsetIntervalUnitNode)?.dateFns(input)
    if (!fns) throw new Error(`expected to find a DateTimeIntervalNode`)
    return this.find('Past')
      ? [...negateDateFns(fns), ['makeInterval', ['now']]]
      : [['makeInterval', ...fns]]
  }
}

export class RangeEndDateTimeOffsetIntervalNode extends DateTimeOffsetIntervalNode {
  dateFns(input: string): DateFn[] {
    return [['now'], ...super.dateFns(input)]
  }
}

export const DateTimeOffsetIntervalBase = group(
  oneOf(
    named('Past', /(the\s+)?(past|last)/i),
    named('Future', /(the\s+)?(next|coming)/i)
  ),
  space,
  oneOf(DateTimeInterval, DateTimeOffsetIntervalUnit)
)

export const DateTimeOffsetInterval = named(
  'DateTimeOffsetInterval',
  DateTimeOffsetIntervalBase
).parseAs(DateTimeOffsetIntervalNode)

export const RangeEndDateTimeOffsetInterval = named(
  'RangeEndDateTimeOffsetInterval',
  DateTimeOffsetIntervalBase
).parseAs(RangeEndDateTimeOffsetIntervalNode)

export class DateTimeNode extends ParseNode {
  date(input: string): DateFn[] | undefined {
    return (
      this.find(DateNode) ||
      this.find(RelativeDayNode) ||
      this.find(RelativeDayOfWeekNode) ||
      this.find(DayOfWeekNode) ||
      this.find(RelativeIntervalNode) ||
      this.find(RelativeMonthNameNode) ||
      this.find(MonthNameNode) ||
      this.find(DateTimeOffsetNode) ||
      this.find(DateTimeOffsetIntervalNode) ||
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
      const lastIfIndex = Date.findIndex((op) => op[0] === 'if')
      return [
        ...Date.filter(
          (op, index) =>
            op[0] !== 'makeInterval' &&
            (index < lastIfIndex || !op[0].startsWith('startOf'))
        ),
        ...Time,
      ]
    }
    return Date || Time || []
  }
}

export const DateTime = named(
  'DateTime',
  longestOf(
    Date,
    RelativeSecond,
    RelativeMinute,
    RelativeHour,
    RelativeWeek,
    RelativeMonthName,
    MonthName,
    RelativeMonth,
    DateTimeOffsetInterval,
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
    RangeEndRelativeSecond,
    RangeEndRelativeMinute,
    RangeEndRelativeHour,
    RangeEndRelativeWeek,
    RangeEndRelativeMonth,
    RangeEndDateTimeOffsetInterval,
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
    const RangeStart = this.find('RangeStart')?.find(DateTimeNode)
    if (!RangeStart) throw new Error('unexpected')
    let start = RangeStart.dateFns(input)
    const RangeEnd = this.find('RangeEnd')?.find(DateTimeNode)
    if (!RangeEnd) throw new Error('unexpected')
    let end = RangeEnd.dateFns(input)

    if (
      !start.some((f) => f[0] === 'setYear' || f[0] === 'addYears') &&
      end.some((f) => f[0] === 'setYear' || f[0] === 'addYears')
    ) {
      start = [
        ...end.filter(
          (f) =>
            f[0] === 'setYear' || f[0] === 'addYears' || f[0] === 'startOfYear'
        ),
        ...start.filter((f) => f[0] !== 'closestToNow'),
      ]
      end = end.filter(
        (f) =>
          f[0] !== 'setYear' && f[0] !== 'addYears' && f[0] !== 'startOfYear'
      )
    }

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
    oneOf(
      group(space, oneOf('to', named('Through', 'through'), 'until'), space),
      /\s*-\s*/
    ),
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
