# tell-me-when

human relative date and time parser

[![CircleCI](https://circleci.com/gh/jedwards1211/tell-me-when.svg?style=svg)](https://circleci.com/gh/jcoreio/tell-me-when)
[![Coverage Status](https://codecov.io/gh/jedwards1211/tell-me-when/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/tell-me-when)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/tell-me-when.svg)](https://badge.fury.io/js/tell-me-when)

# Table of Contents

<!-- tocstart -->

- [tell-me-when](#tell-me-when)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [Install](#install)
  - [CLI Example](#cli-example)
  - [API Example](#api-example)
- [API](#api)
  - [`tellMeWhen(expr: string, options?: { now?: Date }): Date | [Date, Date]`](#tellmewhenexpr-string-options--now-date--date--date-date)
  - [`parse(expr: string): DateFn[]`](#parseexpr-string-datefn)
  - [`type DateFn`](#type-datefn)
  - [`class ParseError extends Error`](#class-parseerror-extends-error)
    - [`from: number`](#from-number)
    - [`to: number`](#to-number)
- [Example Supported Expressions](#example-supported-expressions)

<!-- tocstop -->

# Usage

## Install

```sh
npm i tell-me-when
# or
pnpm i tell-me-when
```

## CLI Example

```
> tell-me-when 1 hour ago
8/14/2024, 11:09:27 AM
> tell-me-when --iso 1 hour ago
2024-08-14T16:09:27.000Z
```

## API Example

```ts
import { tellMeWhen } from "tell-me-when";

console.log(
  tellMeWhen("1 hour ago", {
    now: new Date("Aug 14, 2024 12:09:27 AM"),
  }).toLocaleString("en-US")
);
// 8/14/2024, 11:09:27 AM
```

# API

## `tellMeWhen(expr: string, options?: { now?: Date }): Date | [Date, Date]`

Parses `expr` as a date or date range or throws a [`ParseError`](#class-parseerror-extends-error).

## `parse(expr: string): DateFn[]`

Parses the given expression into the raw [`DateFn`](#type-datefn) operations to perform to resolve the date or date range.

## `type DateFn`

A `DateFn` describes an operation to apply to an input date. [`parse`](#parseexpr-string-datefn) returns a series of `DateFn`
operations to apply, starting with the current date/time. This way, you can write a custom function to operate on dates from third
party libraries like `moment` or `luxon`.

Most operations output a date for the next operation in the series, but the series can end with a `makeInterval` operation, which
takes an input date and another list of operations, computes the result of applying those operations to the input date, and outputs
a range from the input date to the result of the operations, as a 2-element array.

```ts
export type DateFn =
  /**
   * Set Date to now
   */
  | ["now"]
  /**
   * Set year of date to the given value
   */
  | ["setYear", number]
  /**
   * Set month of date to the given value (0-11)
   */
  | ["setMonth", number]
  /**
   * Set day of month of date to the given value (1-31)
   */
  | ["setDate", number]
  /**
   * Set day of week of date to the given value
   */
  | ["setDay", number]
  /**
   * Set hour of date to the given value
   */
  | ["setHours", number]
  /**
   * Set minutes of date to the given value
   */
  | ["setMinutes", number]
  /**
   * Set seconds of date to the given value
   */
  | ["setSeconds", number]
  /**
   * Set milliseconds of date to the given value
   */
  | ["setMilliseconds", number]
  | AddFn
  /**
   * Set date to the start of its current year
   */
  | ["startOfYear"]
  /**
   * Set date to the start of its current month
   */
  | ["startOfMonth"]
  /**
   * Set date to the start of its current week
   */
  | ["startOfWeek"]
  /**
   * Set date to the start of its current day
   */
  | ["startOfDay"]
  /**
   * Set date to the start of its current hour
   */
  | ["startOfHour"]
  /**
   * Set date to the start of its current minute
   */
  | ["startOfMinute"]
  /**
   * Set date to the start of its current second
   */
  | ["startOfSecond"]
  /**
   * Make an interval from the current date to the result of
   * applying the given DateFns to it
   */
  | ["makeInterval", ...DateFn[]]
  /**
   * If the current date is before now, apply beforeNow DateFns;
   * if it is after now, apply afterNow DateFns
   */
  | ["if", { beforeNow?: DateFn[]; afterNow?: DateFn[] }]
  /**
   * Select whichever is closer to now: the result of applying
   * `a` DateFns to the current date, or the result of applying
   * `b` DateFns to the current date
   */
  | ["closestToNow", a: DateFn[], b: DateFn[]];

export type AddFn =
  /**
   * Add the given number of years to the date
   */
  | ["addYears", number]
  /**
   * Add the given number of months to the date
   */
  | ["addMonths", number]
  /**
   * Add the given number of weeks to the date
   */
  | ["addWeeks", number]
  /**
   * Add the given number of days to the date
   */
  | ["addDays", number]
  /**
   * Add the given number of hours to the date
   */
  | ["addHours", number]
  /**
   * Add the given number of minutes to the date
   */
  | ["addMinutes", number]
  /**
   * Add the given number of seconds to the date
   */
  | ["addSeconds", number]
  /**
   * Add the given number of milliseconds to the date
   */
  | ["addMilliseconds", number];
```

## `class ParseError extends Error`

### `from: number`

The start of the range in the input expression where the parse error occured

### `to: number`

The end of the range in the input expression where the parse error occured

# Example Supported Expressions

This is list is compiled from testcases:

<!-- examplestart -->

| Expression                                        | Interpretation for now = Jan 01, 2024, 12:00:00.000 AM          |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `	2021`                                            | `Jan 01, 2021, 12:00:00.000 AM - Jan 01, 2022, 12:00:00.000 AM` |
| `01 aug`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01 aug '20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01 aug 20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01 aug 2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01-aug`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01-aug-20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01-aug-2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01.aug`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01.aug.20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01.aug.2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01/aug`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01/aug/20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01/aug/2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01:23`                                           | `Jan 01, 2024, 01:23:00.000 AM`                                 |
| `01:23:45`                                        | `Jan 01, 2024, 01:23:45.000 AM`                                 |
| `01:23:45.7`                                      | `Jan 01, 2024, 01:23:45.700 AM`                                 |
| `01:23:45.72`                                     | `Jan 01, 2024, 01:23:45.720 AM`                                 |
| `01:23:45.729`                                    | `Jan 01, 2024, 01:23:45.729 AM`                                 |
| `01:23:45.729am`                                  | `Jan 01, 2024, 01:23:45.729 AM`                                 |
| `01:23:45.72am`                                   | `Jan 01, 2024, 01:23:45.720 AM`                                 |
| `01:23:45.7am`                                    | `Jan 01, 2024, 01:23:45.700 AM`                                 |
| `01:23:45am`                                      | `Jan 01, 2024, 01:23:45.000 AM`                                 |
| `01:23am`                                         | `Jan 01, 2024, 01:23:00.000 AM`                                 |
| `01:59`                                           | `Jan 01, 2024, 01:59:00.000 AM`                                 |
| `01_aug`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01_aug_20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01_aug_2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01am`                                            | `Jan 01, 2024, 01:00:00.000 AM`                                 |
| `01aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `01aug20`                                         | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `01aug2020`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1 aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1 aug '20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1 aug 20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1 aug 2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1 day ago`                                       | `Dec 31, 2023, 12:00:00.000 AM`                                 |
| `1 month ago`                                     | `Dec 01, 2023, 12:00:00.000 AM`                                 |
| `1 month from now`                                | `Feb 01, 2024, 12:00:00.000 AM`                                 |
| `1 month in the future`                           | `Feb 01, 2024, 12:00:00.000 AM`                                 |
| `1 on aug 6`                                      | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `1 on aug 6 2020`                                 | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `1-aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1-aug-20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1-aug-2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1.aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1.aug.20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1.aug.2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1/aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1/aug/20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1/aug/2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `10-13-2023 12am to now`                          | `Oct 13, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/13/2023 11am - now`                           | `Oct 13, 2023, 11:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/13/2023 12am - now`                           | `Oct 13, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/13/2023 12am to now`                          | `Oct 13, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/13/2023 12pm - now`                           | `Oct 13, 2023, 12:00:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/3/2023 9:00:00 AM to now`                     | `Oct 03, 2023, 09:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/3/2023, 9:00:00 AM to now`                    | `Oct 03, 2023, 09:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10/3/2023,9:00:00 AM to now`                     | `Oct 03, 2023, 09:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `10pm last Friday to 8am Saturday`                | `Dec 29, 2023, 10:00:00.000 PM - Dec 30, 2023, 08:00:00.000 AM` |
| `10pm last Friday to 8am last Saturday`           | `Dec 29, 2023, 10:00:00.000 PM - Dec 30, 2023, 08:00:00.000 AM` |
| `10pm last Friday to 8am next Saturday`           | `Dec 29, 2023, 10:00:00.000 PM - Jan 06, 2024, 08:00:00.000 AM` |
| `10pm last fri to 10h later`                      | `Dec 29, 2023, 10:00:00.000 PM - Dec 30, 2023, 08:00:00.000 AM` |
| `12 am aug 6`                                     | `Aug 06, 2024, 12:00:00.000 AM`                                 |
| `12am aug 6`                                      | `Aug 06, 2024, 12:00:00.000 AM`                                 |
| `1:23 aug 6`                                      | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `1:23 aug 6 2020`                                 | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `1:23 on aug 6`                                   | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `1:23 on aug 6 2020`                              | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `1:23:45.729am`                                   | `Jan 01, 2024, 01:23:45.729 AM`                                 |
| `1:23:45.72am`                                    | `Jan 01, 2024, 01:23:45.720 AM`                                 |
| `1:23:45.7am`                                     | `Jan 01, 2024, 01:23:45.700 AM`                                 |
| `1:23:45am`                                       | `Jan 01, 2024, 01:23:45.000 AM`                                 |
| `1:23am`                                          | `Jan 01, 2024, 01:23:00.000 AM`                                 |
| `1:23am ON aug 6`                                 | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `1:23am aug 6`                                    | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `1:23am aug 6 2020`                               | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `1:23am on aug 6`                                 | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `1:23am on aug 6 2020`                            | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `1ST OF AUG`                                      | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1_aug`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1_aug_20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1_aug_2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1am`                                             | `Jan 01, 2024, 01:00:00.000 AM`                                 |
| `1am aug 6`                                       | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `1am aug 6 2020`                                  | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `1am on aug 6`                                    | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `1am on aug 6 2020`                               | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `1am, aug 6`                                      | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `1am,aug 6`                                       | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `1aug`                                            | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1aug20`                                          | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1aug2020`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st`                                             | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `1st aug`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st aug '20`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st aug 20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st aug 2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug`                                  | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st day of aug '20`                              | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug 20`                               | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug 2020`                             | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug, '20`                             | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug, 20`                              | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st day of aug, 2020`                            | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug`                                      | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st of aug '20`                                  | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug 20`                                   | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug 2020`                                 | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug, '20`                                 | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug, 20`                                  | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug, 2020`                                | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug.`                                     | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st of aug. '20`                                 | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug. 20`                                  | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug. 2020`                                | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug., '20`                                | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug., 20`                                 | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of aug., 2020`                               | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august`                                   | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st of august '20`                               | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august 20`                                | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august 2020`                              | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august, '20`                              | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august, 20`                               | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st of august, 2020`                             | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st-aug`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st-aug-20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st-aug-2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st.aug`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st.aug.20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st.aug.2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st/aug`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st/aug/20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st/aug/2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st_aug`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `1st_aug_20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `1st_aug_2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `2 months ago`                                    | `Nov 01, 2023, 12:00:00.000 AM`                                 |
| `2 months from now`                               | `Mar 01, 2024, 12:00:00.000 AM`                                 |
| `2000/1/1 21:00`                                  | `Jan 01, 2000, 09:00:00.000 PM`                                 |
| `2001/10/10`                                      | `Oct 10, 2001, 12:00:00.000 AM - Oct 11, 2001, 12:00:00.000 AM` |
| `2021`                                            | `Jan 01, 2021, 12:00:00.000 AM - Jan 01, 2022, 12:00:00.000 AM` |
| `2021  AUG.`                                      | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 08`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 08 06`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 8`                                          | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 8 6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 AUG.`                                       | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 aug`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 aug 06`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 aug 6`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 aug 6th`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 aug.`                                       | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021 aug. 06`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 aug. 6`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021 aug. 6th`                                   | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021-08`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021-08-06`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021-8`                                          | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021-8-6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021-aug`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021-aug-06`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021-aug-6`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021-aug-6th`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021.08`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021.08.06`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021.8`                                          | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021.8.6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021.aug`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021.aug.06`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021.aug.6`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021.aug.6th`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021/08`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021/08/06`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021/8`                                          | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021/8/6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021/aug`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021/aug/06`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021/aug/6`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021/aug/6th`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021AUG`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021Aug`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021_08`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021_08_06`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021_8`                                          | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021_8_6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021_aug`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021_aug_06`                                     | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021_aug_6`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021_aug_6th`                                    | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021aug`                                         | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2021aug06`                                       | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021aug6`                                        | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021aug6th`                                      | `Aug 06, 2021, 12:00:00.000 AM - Aug 07, 2021, 12:00:00.000 AM` |
| `2021august`                                      | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `2023/10/13 12am - now`                           | `Oct 13, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `2023/10/13 12am to now`                          | `Oct 13, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `2nd`                                             | `Jan 02, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `3 day 2 hr 1 min ago`                            | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min before now`                     | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min before present`                 | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min before present time`            | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min before the present`             | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min before the present time`        | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 day 2 hr 1 min in the past`                    | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 days ago`                                      | `Dec 29, 2023, 12:00:00.000 AM`                                 |
| `3 days, two hours and 1 minute ago`              | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3 months ago`                                    | `Oct 01, 2023, 12:00:00.000 AM`                                 |
| `3 months from now`                               | `Apr 01, 2024, 12:00:00.000 AM`                                 |
| `3d 2h 1m ago`                                    | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3d2h1m ago`                                      | `Dec 28, 2023, 09:59:00.000 PM`                                 |
| `3d2h1m from now`                                 | `Jan 04, 2024, 02:01:00.000 AM`                                 |
| `3d2h1m in the future`                            | `Jan 04, 2024, 02:01:00.000 AM`                                 |
| `3pm may 26 next year`                            | `May 26, 2025, 03:00:00.000 PM`                                 |
| `3pm on may 26 next year`                         | `May 26, 2025, 03:00:00.000 PM`                                 |
| `3rd`                                             | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `6 aug 12 am`                                     | `Aug 06, 2024, 12:00:00.000 AM`                                 |
| `AUG 6 2020 AT 1AM`                               | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `a month ago`                                     | `Dec 01, 2023, 12:00:00.000 AM`                                 |
| `a week ago`                                      | `Dec 25, 2023, 12:00:00.000 AM`                                 |
| `an hour ago`                                     | `Dec 31, 2023, 11:00:00.000 PM`                                 |
| `aug`                                             | `Aug 01, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `aug 01`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug 01 '20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 01 20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 01 2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug 1 '20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1 20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1 2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1, '20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1, 20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1, 2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug 1st '20`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st 20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st 2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st, '20`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st, 20`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 1st, 2020`                                   | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug 2021`                                        | `Aug 01, 2021, 12:00:00.000 AM - Sep 01, 2021, 12:00:00.000 AM` |
| `aug 2nd`                                         | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug 3rd`                                         | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug 4th`                                         | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug 6 '12 12am`                                  | `Aug 06, 2012, 12:00:00.000 AM`                                 |
| `aug 6 12 am`                                     | `Aug 06, 2024, 12:00:00.000 AM`                                 |
| `aug 6 12am`                                      | `Aug 06, 2024, 12:00:00.000 AM`                                 |
| `aug 6 13:00`                                     | `Aug 06, 2024, 01:00:00.000 PM`                                 |
| `aug 6 1:23`                                      | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `aug 6 1:23am`                                    | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `aug 6 1am`                                       | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `aug 6 2020 1:23`                                 | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `aug 6 2020 1:23am`                               | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `aug 6 2020 1am`                                  | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `aug 6 2020 at 1`                                 | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `aug 6 2020 at 1:23`                              | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `aug 6 2020 at 1:23am`                            | `Aug 06, 2020, 01:23:00.000 AM`                                 |
| `aug 6 2020 at 1am`                               | `Aug 06, 2020, 01:00:00.000 AM`                                 |
| `aug 6 AT 1:23`                                   | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `aug 6 at 1`                                      | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `aug 6 at 1:23`                                   | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `aug 6 at 1:23am`                                 | `Aug 06, 2024, 01:23:00.000 AM`                                 |
| `aug 6 at 1am`                                    | `Aug 06, 2024, 01:00:00.000 AM`                                 |
| `aug 9 - sep`                                     | `Aug 09, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `aug 9 - sep 8`                                   | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `aug 9 3pm to sep 13 at 8:25`                     | `Aug 09, 2024, 03:00:00.000 PM - Sep 13, 2024, 08:25:00.000 AM` |
| `aug 9 through sep`                               | `Aug 09, 2024, 12:00:00.000 AM - Oct 01, 2024, 12:00:00.000 AM` |
| `aug 9 through sep 8`                             | `Aug 09, 2024, 12:00:00.000 AM - Sep 09, 2024, 12:00:00.000 AM` |
| `aug 9 to sep`                                    | `Aug 09, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `aug 9 to sep 13 at 8:25`                         | `Aug 09, 2024, 12:00:00.000 AM - Sep 13, 2024, 08:25:00.000 AM` |
| `aug 9 to sep 8`                                  | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `aug 9 until sep`                                 | `Aug 09, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `aug 9 until sep 8`                               | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `aug-01`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug-01-20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug-01-2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug-1`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug-1-2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug-1st`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug-1st-20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug-1st-2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug-2nd`                                         | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug-3rd`                                         | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug-4th`                                         | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug.`                                            | `Aug 01, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `aug. 1 '20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1 20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1 2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1, '20`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1, 20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1, 2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st '20`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st 20`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st 2020`                                   | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st, '20`                                   | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st, 20`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug. 1st, 2020`                                  | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.01`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug.01.20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.01.2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.1`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug.1.20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.1.2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.1st`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug.1st.20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.1st.2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug.2nd`                                         | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug.3rd`                                         | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug.4th`                                         | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug/01`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug/01/20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/01/2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/1`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug/1/20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/1/2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/1st`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug/1st/20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/1st/2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug/2nd`                                         | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug/3rd`                                         | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug/4th`                                         | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug01`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug1`                                            | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug1st`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug1st'20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug1st20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug1st2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug2`                                            | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug2nd`                                          | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug3`                                            | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug3rd`                                          | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug4`                                            | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug4th`                                          | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `aug_01`                                          | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug_01_20`                                       | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_01_2020`                                     | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_1`                                           | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug_1_20`                                        | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_1_2020`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_1st`                                         | `Aug 01, 2024, 12:00:00.000 AM - Aug 02, 2024, 12:00:00.000 AM` |
| `aug_1st_20`                                      | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_1st_2020`                                    | `Aug 01, 2020, 12:00:00.000 AM - Aug 02, 2020, 12:00:00.000 AM` |
| `aug_2nd`                                         | `Aug 02, 2024, 12:00:00.000 AM - Aug 03, 2024, 12:00:00.000 AM` |
| `aug_3rd`                                         | `Aug 03, 2024, 12:00:00.000 AM - Aug 04, 2024, 12:00:00.000 AM` |
| `aug_4th`                                         | `Aug 04, 2024, 12:00:00.000 AM - Aug 05, 2024, 12:00:00.000 AM` |
| `august`                                          | `Aug 01, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `day after tomorrow`                              | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `day after tomorrow at 3pm`                       | `Jan 03, 2024, 03:00:00.000 PM`                                 |
| `day before yesterday`                            | `Dec 30, 2023, 12:00:00.000 AM - Dec 31, 2023, 12:00:00.000 AM` |
| `day before yesterday at 3pm`                     | `Dec 30, 2023, 03:00:00.000 PM`                                 |
| `first`                                           | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `from aug 9 - sep`                                | `Aug 09, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `from aug 9 - sep 8`                              | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `from aug 9 through sep`                          | `Aug 09, 2024, 12:00:00.000 AM - Oct 01, 2024, 12:00:00.000 AM` |
| `from aug 9 through sep 8`                        | `Aug 09, 2024, 12:00:00.000 AM - Sep 09, 2024, 12:00:00.000 AM` |
| `from aug 9 to sep 8`                             | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `from aug 9 until sep`                            | `Aug 09, 2024, 12:00:00.000 AM - Sep 01, 2024, 12:00:00.000 AM` |
| `from aug 9 until sep 8`                          | `Aug 09, 2024, 12:00:00.000 AM - Sep 08, 2024, 12:00:00.000 AM` |
| `jun 1-aug 3 last year`                           | `Jun 01, 2023, 12:00:00.000 AM - Aug 03, 2023, 12:00:00.000 AM` |
| `jun-aug 2021`                                    | `Jun 01, 2021, 12:00:00.000 AM - Aug 01, 2021, 12:00:00.000 AM` |
| `jun-aug last year`                               | `Jun 01, 2023, 12:00:00.000 AM - Aug 01, 2023, 12:00:00.000 AM` |
| `june after next`                                 | `Jun 01, 2025, 12:00:00.000 AM - Jul 01, 2025, 12:00:00.000 AM` |
| `june before last`                                | `Jun 01, 2022, 12:00:00.000 AM - Jul 01, 2022, 12:00:00.000 AM` |
| `last 3 months`                                   | `Oct 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last 5 mins`                                     | `Dec 31, 2023, 11:55:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `last five minutes`                               | `Dec 31, 2023, 11:55:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `last hour`                                       | `Dec 31, 2023, 11:00:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `last jun`                                        | `Jun 01, 2023, 12:00:00.000 AM - Jul 01, 2023, 12:00:00.000 AM` |
| `last june`                                       | `Jun 01, 2023, 12:00:00.000 AM - Jul 01, 2023, 12:00:00.000 AM` |
| `last month`                                      | `Dec 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last sun`                                        | `Dec 31, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last sunday`                                     | `Dec 31, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last three months`                               | `Oct 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last week`                                       | `Dec 25, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last week through next month`                    | `Dec 25, 2023, 12:00:00.000 AM - Mar 01, 2024, 12:00:00.000 AM` |
| `last week through next week`                     | `Dec 25, 2023, 12:00:00.000 AM - Jan 15, 2024, 12:00:00.000 AM` |
| `last week to next month`                         | `Dec 25, 2023, 12:00:00.000 AM - Feb 01, 2024, 12:00:00.000 AM` |
| `last year`                                       | `Jan 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `last year may 26`                                | `May 26, 2023, 12:00:00.000 AM - May 27, 2023, 12:00:00.000 AM` |
| `may 26 last year`                                | `May 26, 2023, 12:00:00.000 AM - May 27, 2023, 12:00:00.000 AM` |
| `may 26 next year`                                | `May 26, 2025, 12:00:00.000 AM - May 27, 2025, 12:00:00.000 AM` |
| `may 26 next year at 3pm`                         | `May 26, 2025, 03:00:00.000 PM`                                 |
| `may 26 the year after next`                      | `May 26, 2026, 12:00:00.000 AM - May 27, 2026, 12:00:00.000 AM` |
| `may 26 this year`                                | `May 26, 2024, 12:00:00.000 AM - May 27, 2024, 12:00:00.000 AM` |
| `month after next`                                | `Mar 01, 2024, 12:00:00.000 AM - Apr 01, 2024, 12:00:00.000 AM` |
| `month before last`                               | `Nov 01, 2023, 12:00:00.000 AM - Dec 01, 2023, 12:00:00.000 AM` |
| `next 3 months`                                   | `Jan 01, 2024, 12:00:00.000 AM - Apr 01, 2024, 12:00:00.000 AM` |
| `next jun`                                        | `Jun 01, 2024, 12:00:00.000 AM - Jul 01, 2024, 12:00:00.000 AM` |
| `next jun 1`                                      | `Jun 01, 2024, 12:00:00.000 AM - Jun 02, 2024, 12:00:00.000 AM` |
| `next jun 1st`                                    | `Jun 01, 2024, 12:00:00.000 AM - Jun 02, 2024, 12:00:00.000 AM` |
| `next jun 1st at 8pm`                             | `Jun 01, 2024, 08:00:00.000 PM`                                 |
| `next june`                                       | `Jun 01, 2024, 12:00:00.000 AM - Jul 01, 2024, 12:00:00.000 AM` |
| `next month`                                      | `Feb 01, 2024, 12:00:00.000 AM - Mar 01, 2024, 12:00:00.000 AM` |
| `next sunday`                                     | `Jan 07, 2024, 12:00:00.000 AM - Jan 08, 2024, 12:00:00.000 AM` |
| `next sunday at 3pm`                              | `Jan 07, 2024, 03:00:00.000 PM`                                 |
| `next week`                                       | `Jan 08, 2024, 12:00:00.000 AM - Jan 15, 2024, 12:00:00.000 AM` |
| `next year`                                       | `Jan 01, 2025, 12:00:00.000 AM - Jan 01, 2026, 12:00:00.000 AM` |
| `now until tomorrow`                              | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `one day ago`                                     | `Dec 31, 2023, 12:00:00.000 AM`                                 |
| `one month ago`                                   | `Dec 01, 2023, 12:00:00.000 AM`                                 |
| `one month from now`                              | `Feb 01, 2024, 12:00:00.000 AM`                                 |
| `one month in the future`                         | `Feb 01, 2024, 12:00:00.000 AM`                                 |
| `past 3 months`                                   | `Oct 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `past 5 mins`                                     | `Dec 31, 2023, 11:55:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `second`                                          | `Jan 02, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `sun`                                             | `Dec 31, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `sunday`                                          | `Dec 31, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `sunday after next`                               | `Jan 14, 2024, 12:00:00.000 AM - Jan 15, 2024, 12:00:00.000 AM` |
| `sunday before last`                              | `Dec 24, 2023, 12:00:00.000 AM - Dec 25, 2023, 12:00:00.000 AM` |
| `the 1st`                                         | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `the 2nd`                                         | `Jan 02, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `the 3rd`                                         | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `the coming three months`                         | `Jan 01, 2024, 12:00:00.000 AM - Apr 01, 2024, 12:00:00.000 AM` |
| `the day after tomorrow`                          | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `the day after tomorrow at 3pm`                   | `Jan 03, 2024, 03:00:00.000 PM`                                 |
| `the day before yesterday`                        | `Dec 30, 2023, 12:00:00.000 AM - Dec 31, 2023, 12:00:00.000 AM` |
| `the day before yesterday at 2am until now`       | `Dec 30, 2023, 02:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `the day before yesterday at 3pm`                 | `Dec 30, 2023, 03:00:00.000 PM`                                 |
| `the first`                                       | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `the last five minutes`                           | `Dec 31, 2023, 11:55:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `the last three months`                           | `Oct 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `the month after next`                            | `Mar 01, 2024, 12:00:00.000 AM - Apr 01, 2024, 12:00:00.000 AM` |
| `the month before last`                           | `Nov 01, 2023, 12:00:00.000 AM - Dec 01, 2023, 12:00:00.000 AM` |
| `the next 3 months`                               | `Jan 01, 2024, 12:00:00.000 AM - Apr 01, 2024, 12:00:00.000 AM` |
| `the next 3 months and 2 days`                    | `Jan 01, 2024, 12:00:00.000 AM - Apr 03, 2024, 12:00:00.000 AM` |
| `the past 3 months`                               | `Oct 01, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `the past 3 months and 2 days`                    | `Sep 29, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `the past 5 mins`                                 | `Dec 31, 2023, 11:55:00.000 PM - Jan 01, 2024, 12:00:00.000 AM` |
| `the past week through next month`                | `Dec 25, 2023, 12:00:00.000 AM - Mar 01, 2024, 12:00:00.000 AM` |
| `the second`                                      | `Jan 02, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `the third`                                       | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `the week before last`                            | `Dec 18, 2023, 12:00:00.000 AM - Dec 25, 2023, 12:00:00.000 AM` |
| `third`                                           | `Jan 03, 2024, 12:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `this month`                                      | `Jan 01, 2024, 12:00:00.000 AM - Feb 01, 2024, 12:00:00.000 AM` |
| `three days ago`                                  | `Dec 29, 2023, 12:00:00.000 AM`                                 |
| `three days from now`                             | `Jan 04, 2024, 12:00:00.000 AM`                                 |
| `three days from now at 3pm`                      | `Jan 04, 2024, 03:00:00.000 PM`                                 |
| `three days in the future`                        | `Jan 04, 2024, 12:00:00.000 AM`                                 |
| `three months ago`                                | `Oct 01, 2023, 12:00:00.000 AM`                                 |
| `three months from now`                           | `Apr 01, 2024, 12:00:00.000 AM`                                 |
| `today`                                           | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `today at 3pm`                                    | `Jan 01, 2024, 03:00:00.000 PM`                                 |
| `today through tomorrow`                          | `Jan 01, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `today until tomorrow`                            | `Jan 01, 2024, 12:00:00.000 AM - Jan 02, 2024, 12:00:00.000 AM` |
| `tomorrow`                                        | `Jan 02, 2024, 12:00:00.000 AM - Jan 03, 2024, 12:00:00.000 AM` |
| `tomorrow at 3pm`                                 | `Jan 02, 2024, 03:00:00.000 PM`                                 |
| `two months ago`                                  | `Nov 01, 2023, 12:00:00.000 AM`                                 |
| `two months from now`                             | `Mar 01, 2024, 12:00:00.000 AM`                                 |
| `week before last`                                | `Dec 18, 2023, 12:00:00.000 AM - Dec 25, 2023, 12:00:00.000 AM` |
| `yesterday`                                       | `Dec 31, 2023, 12:00:00.000 AM - Jan 01, 2024, 12:00:00.000 AM` |
| `yesterday 3pm through 5pm`                       | `Dec 31, 2023, 03:00:00.000 PM - Dec 31, 2023, 05:00:00.000 PM` |
| `yesterday 3pm to 5pm`                            | `Dec 31, 2023, 03:00:00.000 PM - Dec 31, 2023, 05:00:00.000 PM` |
| `yesterday 4pm to 2h later`                       | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |
| `yesterday at 3pm`                                | `Dec 31, 2023, 03:00:00.000 PM`                                 |
| `yesterday at 4am through the day after tomorrow` | `Dec 31, 2023, 04:00:00.000 AM - Jan 04, 2024, 12:00:00.000 AM` |
| `yesterday at 4pm to two hours after now`         | `Dec 31, 2023, 04:00:00.000 PM - Jan 01, 2024, 02:00:00.000 AM` |
| `yesterday at 4pm to two hours after that`        | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |
| `yesterday at 4pm to two hours after then`        | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |
| `yesterday at 4pm to two hours later`             | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |
| `yesterday at 4pm to two hours thereafter`        | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |
| `yesterday through two months from now`           | `Dec 31, 2023, 12:00:00.000 AM - Mar 01, 2024, 12:00:00.000 AM` |
| `yesterday to two months from now`                | `Dec 31, 2023, 12:00:00.000 AM - Mar 01, 2024, 12:00:00.000 AM` |
| `yesterday, 4pm to 2h later`                      | `Dec 31, 2023, 04:00:00.000 PM - Dec 31, 2023, 06:00:00.000 PM` |

<!-- exampleend -->
