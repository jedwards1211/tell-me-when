import { Root as enUsGrammar } from './en-US'
import { Root as jaJpGrammar } from './ja-JP'

export const locales = {
  'en-US': enUsGrammar,
  'ja-JP': jaJpGrammar,
}

export type SupportedLocale = keyof typeof locales
