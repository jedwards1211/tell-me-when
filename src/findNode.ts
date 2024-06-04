import { SyntaxNode } from '@lezer/common'

export function findNode(
  root: SyntaxNode | null,
  predicate: string | ((node: SyntaxNode) => boolean)
): SyntaxNode | null {
  return root
    ? findNodeHelper(
        root,
        typeof predicate === 'string'
          ? (node) => node.type?.name === predicate
          : predicate
      )
    : null
}

function findNodeHelper(
  root: SyntaxNode,
  predicate: (node: SyntaxNode) => boolean
): SyntaxNode | null {
  if (predicate(root)) return root
  let child = root.firstChild
  while (child) {
    const found = findNodeHelper(child, predicate)
    if (found) return found
    child = child.nextSibling
  }
  return null
}
