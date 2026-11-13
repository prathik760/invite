/**
 * Internationalisation configuration.
 *
 * ── URL strategy ─────────────────────────────────────────────────────────────
 * English lives at the root (`/pricing`), every other language under a locale
 * prefix (`/es/pricing`). English is deliberately NOT moved to `/en/`: the site
 * has 168 indexed URLs with existing rankings, and relocating them would reset
 * that for no gain. Root doubles as `x-default`.
 *
 * ── Why there is no geo-redirect ─────────────────────────────────────────────
 * Automatically redirecting visitors to a language based on IP is the standard
 * way to break multilingual SEO. Googlebot crawls almost entirely from US IP
 * addresses, so a geo-redirect means it only ever reaches one version and the
 * remaining languages are never crawled or indexed — you build ten languages
 * and rank in one.
 *
 * Instead `LocaleSuggestion` reads the browser's Accept-Language preference and
 * offers a dismissible banner. Every locale keeps its own crawlable URL, and
 * `hreflang` tells Google how they relate. Location is also a poor proxy for
 * language: an Indian family in Dubai wants English or Hindi, not Arabic.
 */

export interface Locale {
  /** URL segment and hreflang code. */
  code: string
  /** Name shown in the switcher, in that language. */
  label: string
  /** BCP-47 tag for the html lang attribute and og:locale. */
  htmlLang: string
  dir: 'ltr' | 'rtl'
}

export const DEFAULT_LOCALE = 'en'

export const LOCALES: Locale[] = [
  { code: 'en', label: 'English',     htmlLang: 'en',    dir: 'ltr' },
  // Indian languages (4 Nov 2026): the pages that sell are fully translated (INDIAN_PATHS).
  { code: 'hi', label: 'हिन्दी',        htmlLang: 'hi-IN', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்',        htmlLang: 'ta-IN', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు',       htmlLang: 'te-IN', dir: 'ltr' },
  { code: 'kn', label: 'ಕನ್ನಡ',        htmlLang: 'kn-IN', dir: 'ltr' },
  { code: 'ml', label: 'മലയാളം',      htmlLang: 'ml-IN', dir: 'ltr' },
  { code: 'mr', label: 'मराठी',        htmlLang: 'mr-IN', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা',        htmlLang: 'bn-IN', dir: 'ltr' },
  { code: 'gu', label: 'ગુજરાતી',       htmlLang: 'gu-IN', dir: 'ltr' },
  { code: 'es', label: 'Español',     htmlLang: 'es',    dir: 'ltr' },
  { code: 'pt', label: 'Português',   htmlLang: 'pt',    dir: 'ltr' },
  { code: 'fr', label: 'Français',    htmlLang: 'fr',    dir: 'ltr' },
  { code: 'id', label: 'Bahasa Indonesia', htmlLang: 'id', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt',  htmlLang: 'vi',    dir: 'ltr' },
  { code: 'ar', label: 'العربية',       htmlLang: 'ar',    dir: 'rtl' },
]

export const LOCALE_CODES = LOCALES.map((l) => l.code)

export function isLocale(value: string): boolean {
  return LOCALE_CODES.includes(value)
}

export function getLocale(code: string): Locale {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0]
}

/** Non-default locales only — the ones that take a URL prefix. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE)

/**
 * Path for a page in a given locale.
 * `localePath('/pricing', 'es')` → `/es/pricing`
 * `localePath('/pricing', 'en')` → `/pricing`
 */
export function localePath(path: string, locale: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

/**
 * Paths that exist under every locale prefix: the homepage. The other languages (es, pt, fr,
 * id, vi, ar) have only that (app/es/page.tsx, …).
 */
export const LOCALISED_PATHS = ['/']

/** The Indian languages, whose selling pages are fully translated (app/l/[lang], via middleware.ts). */
export const INDIAN_LOCALES = ['hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu'] as const
export type IndianLocale = (typeof INDIAN_LOCALES)[number]
export function isIndianLocale(code: string | null | undefined): code is IndianLocale {
  return !!code && (INDIAN_LOCALES as readonly string[]).includes(code)
}

/** Pages translated into the Indian languages; each design's page (/templates/<slug>) too. */
export const INDIAN_PATHS = ['/', '/templates', '/pricing', '/how-it-works', '/faq', '/contact', '/auth/login', '/auth/signup', '/auth/forgot', '/auth/reset']

/** Whether `path` (no query or hash) exists in `locale`. */
export function hasLocalePath(path: string, locale: string): boolean {
  if (locale === DEFAULT_LOCALE) return true
  if (isIndianLocale(locale)) return INDIAN_PATHS.includes(path) || /^\/templates\/(?!category\/)[a-z0-9-]+$/.test(path)
  return LOCALISED_PATHS.includes(path)
}

/**
 * Where a language link should go from `path`: the same page in that language
 * when it has been translated, otherwise that language's homepage. Using
 * `localePath` directly sent a Spanish visitor on /pricing to /es/pricing (a
 * 404) from both the switcher and the language suggestion banner.
 */
export function localeHref(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return localePath(path, locale)
  return localePath(hasLocalePath(path, locale) ? path : '/', locale)
}

/**
 * An internal link as it should be in `locale`: kept in the language when that page is
 * translated (`/pricing#faq` → `/ta/pricing#faq`), left as it is otherwise (the blog, legal pages).
 * A way into the builder carries the language, so sign-in (middleware.ts) speaks it.
 */
export function localiseHref(href: string, locale: string): string {
  if (!isIndianLocale(locale) || !href.startsWith('/') || href.startsWith('//')) return href
  const cut = href.search(/[?#]/)
  const path = cut === -1 ? href : href.slice(0, cut)
  const rest = cut === -1 ? '' : href.slice(cut)
  if (stripLocale(path).locale !== DEFAULT_LOCALE) return href
  if (path === '/create') return rest.startsWith('?') ? `/create${rest.replace('?', `?lang=${locale}&`)}` : `/create?lang=${locale}${rest}`
  if (!hasLocalePath(path, locale)) return href
  return `${localePath(path, locale)}${rest}`
}

/** Strips any locale prefix, returning the canonical English path. */
export function stripLocale(pathname: string): { locale: string; path: string } {
  // The translated tree's internal address (/l/ta/…, seen while a page is built) counts as /ta/….
  let parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'l' && parts[1] && isLocale(parts[1])) parts = parts.slice(1)
  if (parts.length > 0 && isLocale(parts[0]) && parts[0] !== DEFAULT_LOCALE) {
    return { locale: parts[0], path: `/${parts.slice(1).join('/')}` }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || '/' }
}

/**
 * hreflang map for Next's `alternates.languages`.
 *
 * Every locale must list every other locale, including itself, and the set must
 * be reciprocal — Google ignores one-directional hreflang. `x-default` points at
 * the English root, which is where an unmatched visitor should land.
 */
export function hreflangAlternates(path: string, siteUrl: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const l of LOCALES) {
    // Only languages the page exists in (Google ignores, and Search Console flags, links to 404s).
    if (hasLocalePath(path, l.code)) out[l.htmlLang] = `${siteUrl}${localePath(path, l.code)}`
  }
  out['x-default'] = `${siteUrl}${localePath(path, DEFAULT_LOCALE)}`
  return out
}

/**
 * Templates that travel.
 *
 * The ten animated greetings and the non-ceremony wedding designs are
 * culturally universal — love, an apology, congratulations and a wedding exist
 * everywhere. The rest of the catalogue (Griha Pravesh, Namakaran, Mangni,
 * Raksha Bandhan, Ganesh Chaturthi, Shaadi, KGF) is specific to Indian
 * ceremonies and is intentionally excluded from localised pages: a Namakaran
 * template shown to a Vietnamese visitor is noise, and a page targeting
 * "Namakaran" in Spanish targets a keyword with no search volume.
 */
export const GLOBAL_TEMPLATE_IDS = [
  'elegant-wedding',
  'cinematic-night',
  'luxury-wedding',
  'royal-deco',
  'surprise-journey',
  'greeting-love',
  'greeting-valentine',
  'greeting-anniversary',
  'greeting-propose',
  'greeting-promise',
  'greeting-sorry',
  'greeting-congratulations',
  'greeting-festival',
  'greeting-family',
  'greeting-friendship',
]
