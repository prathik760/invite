'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LOCALE_CODES, LOCALISED_PATHS, getLocale, localeHref, stripLocale } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { CONSENT_EVENT, consentState } from '@/lib/consent'

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
  // Waits while the cookie choice (CookieConsent) is open: both sit in the same
  // spot, and that question comes first.
  const [consentOpen, setConsentOpen] = useState(false)

  useEffect(() => {
    if (consentState() !== 'pending') return
    setConsentOpen(true)
    const done = () => setConsentOpen(false)
    window.addEventListener(CONSENT_EVENT, done)
    return () => window.removeEventListener(CONSENT_EVENT, done)
  }, [])

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* private mode — fall through and show it */
    }
    if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return
    const { locale: current, path: basePath } = stripLocale(pathname)
    // "View this page in Español?" is only a true offer where a Spanish
    // version of this page exists. Elsewhere it would drop the visitor on a
    // different page (or, before localeHref, a 404).
    if (!LOCALISED_PATHS.includes(basePath)) return
    const browser = (navigator.language || '').slice(0, 2).toLowerCase()
    if (!browser || browser === current) return
    if (!LOCALE_CODES.includes(browser)) return
    setSuggest(browser)
    trackEvent('locale_suggestion_view', { suggested: browser, current })
  }, [pathname])

  if (!suggest || consentOpen) return null

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
    //
    // A bottom card, not a top strip: pinned over the top of the page at
    // z-[70] it sat on the sticky header, hiding the CTA and menu button on
    // phones, and even covered the open mobile menu's close button (the menu
    // is z-overlay, 60). As a toast it clears any docked bar and stays under
    // overlays.
    <div
      className="fixed inset-x-3 mx-auto max-w-md rounded-2xl border border-border bg-[#FFF9F2] px-4 py-2.5 text-sm shadow-lift"
      style={{
        zIndex: 'var(--z-toast)' as unknown as number,
        bottom: 'calc(max(var(--bottom-dock-h, 0px), env(safe-area-inset-bottom, 0px)) + 0.75rem)',
      }}
      role="region"
      aria-label="Language suggestion"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="text-muted" dir={target.dir}>
          {/* Shown in the language being offered, so it is legible to the
              person it is aimed at. */}
          {target.code === 'en' ? 'View this page in English?' : `${target.label} →`}
        </span>
        <Link
          href={localeHref(path, suggest)}
          hrefLang={target.htmlLang}
          onClick={() => remember('switch')}
          className="inline-flex min-h-[40px] items-center rounded-full bg-emerald px-4 text-xs font-semibold text-paper"
        >
          {target.label}
        </Link>
        <button
          type="button"
          onClick={() => remember('dismiss')}
          className="min-h-[40px] px-2 text-xs text-muted underline-offset-2 hover:underline"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
