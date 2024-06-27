import { ParseError } from './ParseError'
import { tellMeWhen } from './index'

const expr = process.argv.slice(2).join(' ')
let result: Date | [Date, Date]
try {
  result = tellMeWhen(expr)
} catch (error) {
  if (error instanceof ParseError) {
    // eslint-disable-next-line no-console
    console.error(expr)
    // eslint-disable-next-line no-console
    console.error(
      `${' '.repeat(error.from)}${'^'.repeat(
        Math.max(1, error.to - error.from)
      )} parse error`
    )
  }
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log(
  Array.isArray(result)
    ? result.map((d) => d.toLocaleString()).join(' to ')
    : result.toLocaleString()
)
