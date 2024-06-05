import { ParseNode } from '../src/ParseNode'

export function stringifyParseNode(input: string, node: ParseNode): string {
  const children = node.children?.map((c) =>
    indent(stringifyParseNode(input, c))
  )
  return children?.length
    ? `${node.name} {\n${children.join('\n')}\n}`
    : `${node.name} { ${input.substring(node.from, node.to)} }`
}

function indent(s: string) {
  return s.replace(/^/gm, '  ')
}
