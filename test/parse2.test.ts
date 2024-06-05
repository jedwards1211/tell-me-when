import { describe, it } from 'mocha'
import { expect } from 'chai'
import { parseTestcases } from './parseTestcases'
import { parse } from '../src/parse2'
import { ParseState } from '../src/ParseState'
import { Root } from '../src/tellMeWhenGrammar'
import { stringifyParseNode } from './stringifyParseNode'

describe(`parse2`, function () {
  for (const [input, expected] of parseTestcases) {
    it(input, function () {
      try {
        const state = new ParseState(input)
        const error = Root.parse(state).find((n) => n.isError)
        if (error) throw new Error(`syntax error`)
        const parsed = parse(input)
        expect(parsed).to.deep.equal(expected)
      } catch (error) {
        if (error instanceof Error) {
          const state = new ParseState(input)
          const tree = Root.parse(state)
          error.message += `\nParse tree: ${stringifyParseNode(input, tree)}`
        }
        throw error
      }
    })
  }
})
