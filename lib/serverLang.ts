import { cache } from 'react'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import { dictionary } from '@/lib/dictionaries'
import { translator, type T } from '@/lib/translate'

/**
 * The language of the page being rendered, for server components, which cannot read React
 * context. A localised page (app/l/[lang]/…) sets it first thing; English pages never do, so it
 * stays English. `cache` gives each render its own store.
 */
const store = cache(() => ({ lang: DEFAULT_LOCALE as string }))

export function setServerLang(lang: string) {
  store().lang = lang
}

export function serverLang(): string {
  return store().lang
}

/** The translate function for the page being rendered. */
export function serverT(): T {
  return translator(dictionary(store().lang))
}

/** A translate function for one language, where no page is being rendered (generateMetadata). */
export function tFor(lang: string): T {
  return translator(dictionary(lang))
}
