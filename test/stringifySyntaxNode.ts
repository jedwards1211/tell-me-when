import { SyntaxNode } from '@lezer/common'

export function stringifySyntaxNode(input: string, node: SyntaxNode): string {
  const children = getChildren(node).map((c) =>
    indent(stringifySyntaxNode(input, c))
  )
  return children.length
    ? `${node.type.name} {\n${children.join('\n')}\n}`
    : `${node.type.name} { ${input.substring(node.from, node.to)} }`
}

function getChildren(node: SyntaxNode): SyntaxNode[] {
  const children: SyntaxNode[] = []
  let child: SyntaxNode | null = node.firstChild
  while (child) {
    children.push(child)
    child = child.nextSibling
  }
  return children
}

function indent(s: string) {
  return s.replace(/^/gm, '  ')
}
