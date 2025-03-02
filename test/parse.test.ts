import { describe, it } from 'mocha'
import { expect } from 'chai'
import { parseTestcases } from './parseTestcases'
import { parse } from '../src/index'
import { ParseState } from '../src/util/ParseState'
import { stringifyParseNode } from './stringifyParseNode'
import { getGrammar } from '../src/util/getGrammar'
import { locales, SupportedLocale } from '../src/locales'

describe(`parse`, function () {
  const Root = getGrammar({
    locales: Object.keys(locales) as SupportedLocale[],
  })
  for (const input of Object.keys(parseTestcases)) {
    const value = parseTestcases[input]
    const expected =
      value instanceof Object && 'ref' in value
        ? parseTestcases[value.ref]
        : value
    it(`${input}${expected === 'error' ? ' (error)' : ''}`, function () {
      const state = new ParseState(input, { flags: 'gi' })
      const tree = Root.parse(state)
      const error = tree.find((n) => n.isError)
      if (error) {
        if (expected === 'error') return
        throw new Error(
          `syntax error\nParse tree: ${stringifyParseNode(input, tree)}`
        )
      }

      try {
        if (expected === 'error') {
          expect(() => parse(input, { grammar: Root })).to.throw()
        } else {
          const parsed = parse(input, { grammar: Root })
          expect(parsed).to.deep.equal(expected)
        }
      } catch (error) {
        if (error instanceof Error) {
          const state = new ParseState(input, { flags: 'gi' })
          const tree = Root.parse(state)
          error.message += `\nParse tree: ${stringifyParseNode(input, tree)}`
        }
        throw error
      }
    })
  }
})
