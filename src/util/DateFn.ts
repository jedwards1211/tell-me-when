export type DateFn =
  /**
   * Set Date to now
   */
  | ['now']
  /**
   * Set year of date to the given value
   */
  | ['setYear', number]
  /**
   * Set month of date to the given value (0-11)
   */
  | ['setMonth', number]
  /**
   * Set day of month of date to the given value (1-31)
   */
  | ['setDate', number]
  /**
   * Set day of week of date to the given value
   */
  | ['setDay', number]
  /**
   * Set hour of date to the given value
   */
  | ['setHours', number]
  /**
   * Set minutes of date to the given value
   */
  | ['setMinutes', number]
  /**
   * Set seconds of date to the given value
   */
  | ['setSeconds', number]
  /**
   * Set milliseconds of date to the given value
   */
  | ['setMilliseconds', number]
  | AddFn
  /**
   * Set date to the start of its current year
   */
  | ['startOfYear']
  /**
   * Set date to the start of its current month
   */
  | ['startOfMonth']
  /**
   * Set date to the start of its current week
   */
  | ['startOfWeek']
  /**
   * Set date to the start of its current day
   */
  | ['startOfDay']
  /**
   * Set date to the start of its current hour
   */
  | ['startOfHour']
  /**
   * Set date to the start of its current minute
   */
  | ['startOfMinute']
  /**
   * Set date to the start of its current second
   */
  | ['startOfSecond']
  /**
   * Make an interval from the current date to the result of
   * applying the given DateFns to it
   */
  | ['makeInterval', ...DateFn[]]
  /**
   * If the current date is before now, apply beforeNow DateFns;
   * if it is after now, apply afterNow DateFns
   */
  | ['if', { beforeNow?: DateFn[]; afterNow?: DateFn[] }]
  /**
   * Select whichever is closer to now: the result of applying
   * `a` DateFns to the current date, or the result of applying
   * `b` DateFns to the current date
   */
  | ['closestToNow', a: DateFn[], b: DateFn[]]

export type AddFn =
  /**
   * Add the given number of years to the date
   */
  | ['addYears', number]
  /**
   * Add the given number of months to the date
   */
  | ['addMonths', number]
  /**
   * Add the given number of weeks to the date
   */
  | ['addWeeks', number]
  /**
   * Add the given number of days to the date
   */
  | ['addDays', number]
  /**
   * Add the given number of hours to the date
   */
  | ['addHours', number]
  /**
   * Add the given number of minutes to the date
   */
  | ['addMinutes', number]
  /**
   * Add the given number of seconds to the date
   */
  | ['addSeconds', number]
  /**
   * Add the given number of milliseconds to the date
   */
  | ['addMilliseconds', number]
