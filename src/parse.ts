import { ParseNode } from './ParseNode'
import { ParseState } from './ParseState'
import { Root } from './tellMeWhenGrammar'

export type ParseResult = Operation[]

type Operation =
  | ['setYear', number]
  | ['setMonth', number]
  | ['setDate', number]
  | ['setHours', number]
  | ['setMinutes', number]
  | ['setSeconds', number]
  | ['setMilliseconds', number]
  | ['addYears', number]
  | ['addMonths', number]
  | ['addDays', number]
  | ['addHours', number]
  | ['addMinutes', number]
  | ['addSeconds', number]
  | ['addMilliseconds', number]
  | ['startOfYear']
  | ['startOfMonth']
  | ['startOfDay']
  | ['startOfHour']
  | ['startOfMinute']
  | ['startOfSecond']
  | ['makeInterval', ...Operation[]]

export function parse(input: string): ParseResult {
  const state = new ParseState(input, { flags: 'gi' })
  const tree = Root.parse(state)
  if (state.index !== input.length) {
    throw new Error(`syntax error at ${state.index}`)
  }
  return convertNode(input, tree)
}

function convertNode(input: string, node: ParseNode | undefined): ParseResult {
  if (!node) return []
  const Time = parseTime(input, node)
  const Date = parseDate(input, node)
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

function parseDate(
  input: string,
  node: ParseNode | undefined
): ParseResult | undefined {
  const Date = node?.find('Date') || node?.find('DayDate')
  if (!Date) return []
  const year = parseYear(input, Date)
  const month = parseMonth(input, Date)
  const day = parseDay(input, Date)
  return [
    ...(year != undefined ? ([['setYear', year]] as Operation[]) : []),
    ...(month != undefined ? ([['setMonth', month]] as Operation[]) : []),
    ...(day != undefined ? ([['setDate', day]] as Operation[]) : []),
    [
      day != undefined
        ? 'startOfDay'
        : month != undefined
        ? 'startOfMonth'
        : 'startOfYear',
    ],
    [
      'makeInterval',
      [
        day != undefined
          ? 'addDays'
          : month != undefined
          ? 'addMonths'
          : 'addYears',
        1,
      ],
    ],
  ]
}
function parseYear(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  if (!node) return undefined
  const FullYear = node.find('FullYear')
  if (FullYear) return parseInt(input.substring(FullYear.from, FullYear.to))
  const TwoDigitYear = node.find('TwoDigitYear')
  if (TwoDigitYear) {
    const digits = parseInt(
      input.substring(TwoDigitYear.from, TwoDigitYear.to).replace(/^'/, '')
    )
    return digits >= 70 ? 1900 + digits : 2000 + digits
  }
  return undefined
}

function parseMonth(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  if (!node) return undefined
  const MonthNum = node.find('MonthNum')
  if (MonthNum) return parseInt(input.substring(MonthNum.from, MonthNum.to)) - 1
  const MonthName = node.find('MonthName') || node.find('MonthNameNoDot')
  if (MonthName) {
    switch (input.substring(MonthName.from, MonthName.from + 3).toLowerCase()) {
      case 'jan':
        return 0
      case 'feb':
        return 1
      case 'mar':
        return 2
      case 'apr':
        return 3
      case 'may':
        return 4
      case 'jun':
        return 5
      case 'jul':
        return 6
      case 'aug':
        return 7
      case 'sep':
        return 8
      case 'oct':
        return 9
      case 'nov':
        return 10
      case 'dec':
        return 11
    }
  }
  return undefined
}

function parseDay(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  if (!node) return undefined
  const DayOfMonthNum = node.find('DayOfMonthNum')
  if (DayOfMonthNum)
    return parseInt(input.substring(DayOfMonthNum.from, DayOfMonthNum.to))
  const NthDayOfMonth = node.find('NthDayOfMonth')
  if (NthDayOfMonth) {
    const value = input
      .substring(NthDayOfMonth.from, NthDayOfMonth.to)
      .toLowerCase()
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
  return undefined
}

function parseTime(
  input: string,
  node: ParseNode | undefined
): ParseResult | undefined {
  const Time = node?.find('Time') || node?.find('AtTime')
  if (!Time) return undefined
  const hours = parseHours(input, Time)
  const minutes = parseMinutes(input, Time)
  const seconds = parseSeconds(input, Time)
  const milliseconds = parseMilliseconds(input, Time)
  return [
    ...(hours != undefined ? ([['setHours', hours]] as Operation[]) : []),
    ...(minutes != undefined ? ([['setMinutes', minutes]] as Operation[]) : []),
    ...(seconds != undefined ? ([['setSeconds', seconds]] as Operation[]) : []),
    ...(milliseconds != undefined
      ? ([['setMilliseconds', milliseconds]] as Operation[])
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
        ] as Operation[])),
  ]
}

function parseHours(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  const Hours = node?.find('Hours')
  if (Hours) return parseInt(input.substring(Hours.from, Hours.to))
  return undefined
}

function parseMinutes(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  const Minutes = node?.find('Minutes')
  if (Minutes) return parseInt(input.substring(Minutes.from, Minutes.to))
  return undefined
}

function parseSeconds(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  const Seconds = node?.find('Seconds')
  if (Seconds) return parseInt(input.substring(Seconds.from, Seconds.to))
  return undefined
}

function parseMilliseconds(
  input: string,
  node: ParseNode | undefined
): number | undefined {
  const Milliseconds = node?.find('Milliseconds')
  if (Milliseconds)
    return parseInt(
      input.substring(Milliseconds.from, Milliseconds.to).padEnd(3, '0')
    )
  return undefined
}
