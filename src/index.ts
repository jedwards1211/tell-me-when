import { SyntaxNode } from '@lezer/common'
import { parser } from './parser'

function getChildren(node: SyntaxNode): SyntaxNode[] {
  const children: SyntaxNode[] = []
  let child: SyntaxNode | null = node.firstChild
  while (child) {
    children.push(child)
    child = child.nextSibling
  }
  return children
}

function stringifySyntaxNode(input: string, node: SyntaxNode): string {
  const children = getChildren(node).map((c) =>
    indent(stringifySyntaxNode(input, c))
  )
  return children.length
    ? `${node.type.name} {\n${children.join('\n')}\n}`
    : `${node.type.name} { ${input.substring(node.from, node.to)} }`
}

function indent(s: string) {
  return s.replace(/^/gm, '  ')
}

for (const input of [
  'aug 20',
  'aug.20',
  '20 aug',
  '20.aug',
  '20th aug',
  'aug',
  'aug 02',
  'aug 31',
  'aug 32',
  'aug first',
  'aug 1st',
  'aug 31st',
  'aug 22nd',
  '10th august',
  '2012',
  '2012aug',
  '2012aug06',
  '2012aug3rd',
  '2012/12/03',
  '2012 12 03',
  'aug 3 2026',
  'aug 3, 2026',
  'aug 3rd 2026',
  'aug 3rd 26',
  'aug3rd26',
  'aug 03 26',
  "aug 3 '26",
  'aug032026',
  '5/3/2026',
  '5/03/2026',
  '2012 aug',
  '2012/03',
  '2012/3',
  '2012/13',
  '12th of march',
  '8/3/01',
  '8.3.01',
  '20 of aug.2023',
  '20 of aug.,2023',
  '2012-aug/3',
  '2012/aug/3',
  '2012/aug-3',
  '2012-aug-3',
]) {
  const tree = parser.parse(input)
  // @ts-expect-error no type defs
  console.log(input, stringifySyntaxNode(input, tree.topNode))
}
