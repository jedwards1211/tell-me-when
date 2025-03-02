import { ParseNode } from '../src/util/ParseNode'

export function stringifyParseNode(input: string, node: ParseNode): string {
  const children = node.children?.map((c) =>
    indent(stringifyParseNode(input, c))
  )
  return children?.length
    ? `${node.name}${
        node.constructor === ParseNode ? '' : ` [${node.constructor.name}]`
      } {\n${children.join('\n')}\n}`
    : `${node.name}${
        node.constructor === ParseNode ? '' : ` [${node.constructor.name}]`
      } { ${input.substring(node.from, node.to)} }`
}

function indent(s: string) {
  return s.replace(/^/gm, '  ')
}
