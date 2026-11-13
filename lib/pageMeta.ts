import type { Metadata } from 'next'
import { DEFAULT_LOCALE, getLocale, hreflangAlternates, localePath } from '@/lib/i18n'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * Canonical, hreflang and Open Graph for a page that exists in several languages: each language
 * version is its own canonical page, and every version lists all the others (and x-default).
 */
export function localeMeta(lang: string, path: string, base: Metadata & { title: string; description: string }): Metadata {
  const url = `${APP_URL}${localePath(path, lang)}`
  const locale = getLocale(lang)
  const { title, description, openGraph, ...rest } = base
  return {
    ...rest,
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: hreflangAlternates(path, APP_URL) },
    openGraph: {
      ...(openGraph ?? {}),
      title,
      description,
      url,
      type: 'website',
      siteName: 'ShareInvite',
      locale: lang === DEFAULT_LOCALE ? 'en_IN' : locale.htmlLang.replace('-', '_'),
    },
    robots: { index: true, follow: true },
  }
}
