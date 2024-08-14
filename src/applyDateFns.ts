import { DateFn } from './DateFn'

export function applyDateFns(
  dateFns: DateFn[],
  { now = new Date() }: { now?: Date } = {}
): Date | [Date, Date] {
  function applyDateFn(
    d: Date | [Date, Date],
    next: DateFn
  ): Date | [Date, Date] {
    if (Array.isArray(d)) {
      throw new Error(`can't apply a DateFn after makeInterval`)
    }
    d = new Date(d)
    switch (next[0]) {
      case 'now':
        return now
      case 'setYear':
        d.setFullYear(next[1])
        return d
      case 'setMonth':
        d.setMonth(next[1])
        return d
      case 'setDate':
        d.setDate(next[1])
        return d
      case 'setDay':
        d.setDate(d.getDate() + (next[1] - d.getDay()))
        return d
      case 'setHours':
        d.setHours(next[1])
        return d
      case 'setMinutes':
        d.setMinutes(next[1])
        return d
      case 'setSeconds':
        d.setSeconds(next[1])
        return d
      case 'setMilliseconds':
        d = new Date(d)
        d.setMilliseconds(next[1])
        return d
      case 'startOfYear':
        d.setMonth(0)
      // eslint-disable-next-line no-fallthrough
      case 'startOfMonth':
        d.setDate(1)
      // eslint-disable-next-line no-fallthrough
      case 'startOfDay':
        d.setHours(0)
      // eslint-disable-next-line no-fallthrough
      case 'startOfHour':
        d.setMinutes(0)
      // eslint-disable-next-line no-fallthrough
      case 'startOfMinute':
        d.setSeconds(0)
      // eslint-disable-next-line no-fallthrough
      case 'startOfSecond':
        d.setMilliseconds(0)
        return d
      case 'if':
        return d.getTime() < now.getTime()
          ? next[1].beforeNow?.reduce(applyDateFn, d) || d
          : d.getTime() > now.getTime()
          ? next[1].afterNow?.reduce(applyDateFn, d) || d
          : d
      case 'closestToNow': {
        const a = next[1].reduce(applyDateFn, d)
        const b = next[2].reduce(applyDateFn, d)
        if (Array.isArray(a) || Array.isArray(b)) {
          throw new Error(`can't use makeInteval inside closestToNow`)
        }
        return Math.abs(a.getTime() - d.getTime()) <
          Math.abs(b.getTime() - d.getTime())
          ? a
          : b
      }
      case 'addYears':
        d.setFullYear(d.getFullYear() + next[1])
        return d
      case 'addMonths':
        d.setMonth(d.getMonth() + next[1])
        return d
      case 'addWeeks':
        d.setDate(d.getDate() + next[1] * 7)
        return d
      case 'addDays':
        d.setDate(d.getDate() + next[1])
        return d
      case 'addHours':
        d.setHours(d.getHours() + next[1])
        return d
      case 'addMinutes':
        d.setMinutes(d.getMinutes() + next[1])
        return d
      case 'addSeconds':
        d.setSeconds(d.getSeconds() + next[1])
        return d
      case 'addMilliseconds':
        d.setMilliseconds(d.getMilliseconds() + next[1])
        return d
      case 'makeInterval': {
        const end = (next.slice(1) as DateFn[]).reduce(applyDateFn, d)
        if (Array.isArray(end)) {
          throw new Error(`can't use makeInterval inside makeInterval`)
        }
        if (end < d) {
          throw new Error(
            'expression seems invalid, produced an end date before the start date'
          )
        }
        return [d, end]
      }
    }
    return d
  }

  return dateFns.reduce(applyDateFn, now)
}
