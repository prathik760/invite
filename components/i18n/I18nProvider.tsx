'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, isIndianLocale, localiseHref } from '@/lib/i18n'
import { CLIENT_MARK, translator, type Dict, type T } from '@/lib/translate'
// The few sentences of the parts outside any provider (offer bar, offer popup, WhatsApp bubble,
// language banner), per language; generated with the dictionaries (scripts/i18n.mjs).
import CHROME from '@/content/i18n/chrome.json'

/**
 * The page's language for client components. Localised pages (app/l/[lang]/layout.tsx) wrap their
 * content in it with that language's dictionary; everywhere else there is no provider and the
 * defaults (English, no dictionary) apply.
 */
const EMPTY: Dict = {}

const Ctx = createContext<{ lang: string; dict: Dict | null }>({ lang: DEFAULT_LOCALE, dict: null })

export default function I18nProvider({ lang, dict, children }: { lang: string; dict: Dict | null; children: ReactNode }) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/**
 * The current language: the provider's, or, for parts of the page outside it (the offer bar and
 * floating buttons in the root layout), the one in the address (/ta/… or, while rendering, /l/ta/…).
 */
export function useLang(): string {
  const ctx = useContext(Ctx)
  const path = usePathname() || '/'
  if (ctx.lang !== DEFAULT_LOCALE) return ctx.lang
  const m = path.match(/^\/(?:l\/)?([a-z]{2})(?:\/|$)/)
  return m && isIndianLocale(m[1]) ? m[1] : DEFAULT_LOCALE
}

export function useT(): T {
  const { dict } = useContext(Ctx)
  const lang = useLang()
  // Outside a provider: the chrome dictionary, or an empty one (English) on a translated page.
  const d = dict ?? (CHROME as Record<string, Dict>)[lang] ?? (lang !== DEFAULT_LOCALE ? EMPTY : null)
  return useMemo(() => translator(d, CLIENT_MARK), [d])
}

/** Internal links kept in the current language (lib/i18n localiseHref). */
export function useLocalHref(): (href: string) => string {
  const lang = useLang()
  return (href) => localiseHref(href, lang)
}
