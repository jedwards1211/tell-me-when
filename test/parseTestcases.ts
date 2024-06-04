import { ParseResult } from '../src/parse'

export const parseTestcases: [string, ParseResult][] = [
  [
    '2021',
    [['setYear', 2021], ['startOfYear'], ['makeInterval', ['addYears', 1]]],
  ],
  ...['', '.', '-', '_', '/', ' '].flatMap((sep): [string, ParseResult][] =>
    ['aug', 'august', ...(sep === ' ' ? ['aug.'] : [])].flatMap((month) => [
      [
        `2021${sep}${month}`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['startOfMonth'],
          ['makeInterval', ['addMonths', 1]],
        ],
      ],
      [
        `2021${sep}${month}${sep}06`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', 6],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      [
        `2021${sep}${month}${sep}6`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', 6],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
    ])
  ),
  ...['.', '-', '_', '/', ' '].flatMap((sep): [string, ParseResult][] => [
    [
      `2021${sep}8`,
      [
        ['setYear', 2021],
        ['setMonth', 7],
        ['startOfMonth'],
        ['makeInterval', ['addMonths', 1]],
      ],
    ],
    [
      `2021${sep}08`,
      [
        ['setYear', 2021],
        ['setMonth', 7],
        ['startOfMonth'],
        ['makeInterval', ['addMonths', 1]],
      ],
    ],
    [
      `2021${sep}08${sep}06`,
      [
        ['setYear', 2021],
        ['setMonth', 7],
        ['setDate', 6],
        ['startOfDay'],
        ['makeInterval', ['addDays', 1]],
      ],
    ],
    [
      `2021${sep}8${sep}6`,
      [
        ['setYear', 2021],
        ['setMonth', 7],
        ['setDate', 6],
        ['startOfDay'],
        ['makeInterval', ['addDays', 1]],
      ],
    ],
  ]),
  ...['aug', 'aug.', 'august'].flatMap((month): [string, ParseResult][] => [
    [
      month,
      [['setMonth', 7], ['startOfMonth'], ['makeInterval', ['addMonths', 1]]],
    ],
    ...[
      '01',
      '1',
      '1st',
      '2',
      '2nd',
      '3',
      '3rd',
      '4',
      '4th',
      '5',
      '5th',
    ].flatMap((day): [string, ParseResult][] => [
      [
        `${month} ${day}`,
        [
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      ...(/\D/.test(day)
        ? ([
            [
              `${day} of ${month}`,
              [
                ['setMonth', 7],
                ['setDate', parseInt(day)],
                ['startOfDay'],
                ['makeInterval', ['addDays', 1]],
              ],
            ],
            [
              `${day} of ${month}, 2021`,
              [
                ['setYear', 2021],
                ['setMonth', 7],
                ['setDate', parseInt(day)],
                ['startOfDay'],
                ['makeInterval', ['addDays', 1]],
              ],
            ],
          ] as [string, ParseResult][])
        : []),
      [
        `${day} ${month}`,
        [
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      [
        `${day} ${month} 2021`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      [
        `${day} ${month} 21`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      [
        `${month} ${day}, 2021`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      [
        `${month} ${day}, '21`,
        [
          ['setYear', 2021],
          ['setMonth', 7],
          ['setDate', parseInt(day)],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
    ]),
    ...[
      '',
      ...(month.endsWith('.') ? [' '] : ['.', '-', '_', '/', ' ']),
    ].flatMap((sep): [string, ParseResult][] => [
      [
        `${month}${sep}6`,
        [
          ['setMonth', 7],
          ['setDate', 6],
          ['startOfDay'],
          ['makeInterval', ['addDays', 1]],
        ],
      ],
      ...(sep === ''
        ? []
        : ([
            [
              `${month}${sep}6${sep}2021`,
              [
                ['setYear', 2021],
                ['setMonth', 7],
                ['setDate', 6],
                ['startOfDay'],
                ['makeInterval', ['addDays', 1]],
              ],
            ],
          ] as [string, ParseResult][])),
    ]),
  ]),
]
