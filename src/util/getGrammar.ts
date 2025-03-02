import { GrammarNode } from './GrammarNode'
import { locales, SupportedLocale } from '../locales'

const grammarCache: Map<string, GrammarNode> = new Map()

export function getGrammar({
  locales: localeNames = getDefaultLocaleNames(),
}: { locales?: SupportedLocale[] } = {}) {
  const key = JSON.stringify(localeNames)
  let grammar = grammarCache.get(key)
  if (grammar) return grammar
  grammarCache.set(key, (grammar = getGrammarHelper({ localeNames })))
  return grammar
}

function getGrammarHelper({ localeNames }: { localeNames: SupportedLocale[] }) {
  if (localeNames.length === 1) {
    return locales[localeNames[0]]
  }
  return GrammarNode.longestOf(...localeNames.map((name) => locales[name]))
}

let defaultLocaleNames: SupportedLocale[] | undefined

function getDefaultLocaleNames(): SupportedLocale[] {
  if (defaultLocaleNames) return defaultLocaleNames

  const { locale: primaryLocale } = new Intl.DateTimeFormat().resolvedOptions()
  const localeKeys = Object.keys(locales) as SupportedLocale[]
  const primary = localeKeys.find((k) => primaryLocale.startsWith(k))
  return (defaultLocaleNames = [
    ...(primary ? [primary] : []),
    ...Intl.DateTimeFormat.supportedLocalesOf(localeKeys, {
      localeMatcher: 'lookup',
    }).flatMap((key) => {
      if (key === primary) return []
      const found = localeKeys.find((k) => key.startsWith(k))
      return found ? [found] : []
    }),
  ])
}
