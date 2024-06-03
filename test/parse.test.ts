import { describe, it } from 'mocha'
import { expect } from 'chai'
import { parseTestcases } from './parseTestcases'
import { parse } from '../src/parse'
import { parser } from '../src/parser'
import { stringifySyntaxNode } from './stringifySyntaxNode'

describe(`parse`, function () {
  for (const [input, expected] of parseTestcases) {
    it(input, function () {
      try {
        expect(parse(input)).to.deep.equal(expected)
      } catch (error) {
        if (error instanceof Error) {
          const tree = parser.parse(input)
          error.message += `\nParse tree: ${stringifySyntaxNode(
            input,
            tree.topNode
          )}`
        }
        throw error
      }
    })
  }
})
