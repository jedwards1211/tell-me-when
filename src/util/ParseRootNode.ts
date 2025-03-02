import { DateFn } from './DateFn'
import { ParseNode } from './ParseNode'

export abstract class ParseRootNode extends ParseNode {
  abstract dateFns(input: string): DateFn[]
}
