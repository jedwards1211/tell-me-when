import { GrammarNode } from './GrammarNode'
const { token, group, named, oneOf, longestOf } = GrammarNode

const space = token(/\s+/)

const FullYear = named('FullYear', token(/\d{4}/))
const TwoDigitYear = named('TwoDigitYear', token(/'?\d\d/))

const Year = FullYear.or(TwoDigitYear)

const MonthNum = named('MonthNum', /0?[1-9]|1[0-2]/)

const MonthNameFull = named(
  'MonthNameFull',
  /(january|february|march|may|april|june|july|august|september|october|november|december)(?![a-z])/i
)

const MonthNameAbbrev = named(
  'MonthNameAbbrev',
  /(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)(?![a-z])/i
)

const MonthName = named(
  'MonthName',
  MonthNameFull.or(group(MonthNameAbbrev, group('.').maybe()))
)

const MonthNameNoDot = named(
  'MonthNameNoDot',
  MonthNameFull.or(MonthNameAbbrev)
)

const Month = MonthName.or(MonthNum)
const MonthNoDot = MonthNameNoDot.or(MonthNum)

const DayOfMonthNum = named('DayOfMonthNum', /[0-2]?[1-9]|3[01]/)
const NthDayOfMonth = named(
  'NthDayOfMonth',
  /(1st|first|2nd|second|3rd|third|4th|fourth|5th|fifth|6th|sixth|7th|seventh|8th|eighth|9th|ninth|10th|tenth|11th|eleventh|12th|twelfth|13th|thirteenth|14th|fourteenth|15th|fifteenth|16th|sixteenth|17th|seventeenth|18th|eighteenth|19th|ninteenth|20th|twentieth|21st|twenty-first|22nd|twenty-second|23rd|twenty-third|24th|twenty-fourth|25th|twenty-fifth|26th|twenty-sixth|27th|twenty-seventh|28th|twenty-eighth|29th|twenty-ninthy|30th|thirtieth|31st|thirty-first)(?![a-z])/i
)

const DayOfMonth = NthDayOfMonth.or(DayOfMonthNum)

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
)

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
)
const Hours = named('Hours', /[01]?[0-9]|2[0-3]/)
const Minutes = named('Minutes', /[0-5][0-9]/)
const Seconds = named('Seconds', /[0-5][0-9]/)
const Milliseconds = named('Milliseconds', /\d{1,3}/)
const AmPm = named('AmPm', /[ap]m?(?!\w)/i)

const AtTime = named(
  'AtTime',
  Hours,
  group(
    ':',
    Minutes,
    group(':', Seconds, group('.', Milliseconds).maybe()).maybe()
  ).maybe(),
  group(space.maybe(), AmPm).maybe()
)

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
)

export const DateTimeExpression = named(
  'DateTimeExpression',
  longestOf(
    Date,
    group(DayDate, group(space, group('at', space).maybe(), AtTime).maybe()),
    group(Time, group(space, group('on', space).maybe(), DayDate).maybe()),
    group(AtTime, group(space, group('on', space), DayDate))
  )
)

export const RangeExpression = named(
  'RangeExpression',
  group(
    group('from', space).maybe(),
    DateTimeExpression,
    space,
    oneOf('to', 'through', 'until', '-'),
    space,
    DateTimeExpression
  )
)

export const Root = group(
  space.maybe(),
  oneOf(RangeExpression, DateTimeExpression),
  space.maybe()
)
