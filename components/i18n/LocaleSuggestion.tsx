'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LOCALE_CODES, getLocale, localePath, stripLocale } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'

const DISMISS_KEY = 'si-locale-suggestion'

/**
 * Never interrupt inside the product or on a customer's own page.
 *
 * /e/ matters most: those are published invitations belonging to customers.
 * A ShareInvite language banner across the top of someone's wedding invitation
 * is advertising aimed at their guests, on a page they paid for.
 */
const EXCLUDED_PREFIXES = ['/create', '/e/', '/dashboard', '/auth', '/admin', '/demo']

/**
 * Offers a different language — it never redirects.
 *
 * Automatically sending visitors to a language by IP is the standard way to
 * break multilingual SEO: Googlebot crawls almost entirely from US addresses,
 * so it would only ever see one version and the rest would never be indexed.
 *
 * This reads `navigator.language`, which is the visitor's declared preference
 * rather than a guess from their location — an Indian family in Dubai wants
 * English or Hindi, not Arabic. The choice is remembered, so the banner appears
 * once and not on every page.
 */
export default function LocaleSuggestion() {
  const pathname = usePathname() || '/'
  const [suggest, setSuggest] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* private mode — fall through and show it */
    }
    if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return
    const { locale: current } = stripLocale(pathname)
    const browser = (navigator.language || '').slice(0, 2).toLowerCase()
    if (!browser || browser === current) return
    if (!LOCALE_CODES.includes(browser)) return
    setSuggest(browser)
    trackEvent('locale_suggestion_view', { suggested: browser, current })
  }, [pathname])

  if (!suggest) return null

  const target = getLocale(suggest)
  const { path } = stripLocale(pathname)

  const remember = (action: string) => {
    try { window.localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
    trackEvent('locale_suggestion_action', { suggested: suggest, action })
    setSuggest(null)
  }

  return (
    // Fixed rather than in normal flow. Rendered with ssr:false, it appears
    // after hydration — as a block element at the top of the document that
    // would push every page down and register as layout shift on each one.
    // Fixed positioning keeps Cumulative Layout Shift at zero.
    <div
      className="fixed inset-x-0 top-0 z-[70] border-b border-border bg-[#FFF9F2] px-4 py-2.5 text-sm shadow-sm"
      role="region"
      aria-label="Language suggestion"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="text-muted" dir={target.dir}>
          {/* Shown in the language being offered, so it is legible to the
              person it is aimed at. */}
          {target.code === 'en' ? 'View this page in English?' : `${target.label} →`}
        </span>
        <Link
          href={localePath(path, suggest)}
          hrefLang={target.htmlLang}
          onClick={() => remember('switch')}
          className="rounded-full bg-[#B87924] px-4 py-1.5 text-xs font-semibold text-white"
        >
          {target.label}
        </Link>
        <button
          type="button"
          onClick={() => remember('dismiss')}
          className="text-xs text-muted underline-offset-2 hover:underline"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
