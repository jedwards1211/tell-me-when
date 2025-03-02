import { describe, it } from 'mocha'
import { expect } from 'chai'
import { parseTestcases } from './parseTestcases'
import { parse } from '../src/index'
import { ParseState } from '../src/util/ParseState'
import { stringifyParseNode } from './stringifyParseNode'
import { getGrammar } from '../src/util/getGrammar'

describe(`parse`, function () {
  const Root = getGrammar()
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
          expect(() => parse(input)).to.throw()
        } else {
          const parsed = parse(input)
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
