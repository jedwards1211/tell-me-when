import { SyntaxNode } from '@lezer/common'
import { parser } from './parser'

export type ParseResult = Operation[]

type Operation =
  | ['setYear', number]
  | ['setMonth', number]
  | ['setDate', number]
  | ['addYears', number]
  | ['addMonths', number]
  | ['addDays', number]
  | ['startOfYear']
  | ['startOfMonth']
  | ['startOfDay']
  | ['makeInterval', ...Operation[]]

export function parse(input: string): ParseResult {
  const tree = parser.parse(input)
  return convertNode(input, tree.topNode)
}

function convertNode(input: string, node: SyntaxNode | null): ParseResult {
  if (!node) return []
  switch (node.type.name) {
    case 'YearMonthDay': {
      const year = parseYear(input, node.getChild('Year'))
      const month = parseMonth(input, node.getChild('Month'))
      const day = parseDay(input, node.getChild('Day'))
      return [
        ...(year != null ? ([['setYear', year]] as Operation[]) : []),
        ...(month != null ? ([['setMonth', month]] as Operation[]) : []),
        ...(day != null ? ([['setDate', day]] as Operation[]) : []),
        [
          day != null
            ? 'startOfDay'
            : month != null
            ? 'startOfMonth'
            : 'startOfYear',
        ],
        [
          'makeInterval',
          [
            day != null ? 'addDays' : month != null ? 'addMonths' : 'addYears',
            1,
          ],
        ],
      ]
    }
    case 'MonthDayYear': {
      const month = parseMonth(input, node.getChild('Month'))
      const day = parseDay(input, node.getChild('Day'))
      const year = parseYear(input, node.getChild('Year'))
      return [
        ...(year != null ? ([['setYear', year]] as Operation[]) : []),
        ...(month != null ? ([['setMonth', month]] as Operation[]) : []),
        ...(day != null ? ([['setDate', day]] as Operation[]) : []),
        [day != null ? 'startOfDay' : 'startOfMonth'],
        ['makeInterval', [day != null ? 'addDays' : 'addMonths', 1]],
      ]
    }
    case 'DayMonthYear':
    case 'DayOfMonthYear': {
      const day = parseDay(input, node.getChild('Day'))
      const month = parseMonth(input, node.getChild('Month'))
      const year = parseYear(input, node.getChild('Year'))
      return [
        ...(year != null ? ([['setYear', year]] as Operation[]) : []),
        ...(month != null ? ([['setMonth', month]] as Operation[]) : []),
        ...(day != null ? ([['setDate', day]] as Operation[]) : []),
        ['startOfDay'],
        ['makeInterval', ['addDays', 1]],
      ]
    }
    default:
      return convertNode(input, node.firstChild)
  }
  return []
}

function parseYear(input: string, node: SyntaxNode | null): number | undefined {
  if (!node) return undefined
  switch (node.type.name) {
    case 'FullYear':
      return parseInt(input.substring(node.from, node.to))
    case 'TwoDigitYear': {
      const digits = parseInt(
        input.substring(node.from, node.to).replace(/^'/, '')
      )
      return digits >= 70 ? 1900 + digits : 2000 + digits
    }
    default:
      return parseYear(input, node.firstChild)
  }
  return undefined
}

function parseMonth(
  input: string,
  node: SyntaxNode | null
): number | undefined {
  if (!node) return undefined
  switch (node.type.name) {
    case 'MonthName':
    case 'MonthNameAbbrev':
    case 'MonthNameFullExceptMay': {
      switch (input.substring(node.from, node.from + 3).toLowerCase()) {
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
      break
    }
    case 'MonthNumber':
      return parseInt(input.substring(node.from, node.to)) - 1
    default:
      return parseMonth(input, node.firstChild)
  }
  return undefined
}

function parseDay(input: string, node: SyntaxNode | null): number | undefined {
  if (!node) return undefined
  switch (node.type.name) {
    case 'NumericDayOfMonth':
      return parseInt(input.substring(node.from, node.to))
    case 'DayOfMonthOrdinal': {
      const value = input.substring(node.from, node.to)
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
      break
    }
    default:
      return parseDay(input, node.firstChild)
  }
  return undefined
}
