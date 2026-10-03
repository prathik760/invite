'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isUntrackedPath } from '@/lib/activityEvents'
import { stripLocale } from '@/lib/i18n'

/**
 * Asks visitors from the UK, the EU/EEA and Switzerland whether analytics and
 * ad cookies may run (lib/consent.ts explains what waits for the answer), and
 * reopens from "Cookie settings" in the footer for anyone who wants to change
 * their mind.
 *
 * Accept and Reject look the same and sit side by side: saying no has to be as
 * easy as saying yes. Never shown on the invitations guests open, in admin, or
 * inside the builder's preview frame.
 */

export const OPEN_COOKIE_SETTINGS = 'si:cookie-settings'

const COPY = {
  en: { text: 'We use cookies to see how people use ShareInvite and to measure our ads. Is that OK?', yes: 'Accept', no: 'Reject', more: 'Learn more', close: 'Close' },
  fr: { text: 'Nous utilisons des cookies pour comprendre comment ShareInvite est utilisé et pour mesurer nos publicités. Êtes-vous d’accord ?', yes: 'Accepter', no: 'Refuser', more: 'En savoir plus', close: 'Fermer' },
  es: { text: 'Usamos cookies para ver cómo se usa ShareInvite y para medir nuestros anuncios. ¿Te parece bien?', yes: 'Aceptar', no: 'Rechazar', more: 'Más información', close: 'Cerrar' },
  pt: { text: 'Usamos cookies para ver como o ShareInvite é usado e para medir os nossos anúncios. Tudo bem?', yes: 'Aceitar', no: 'Recusar', more: 'Saber mais', close: 'Fechar' },
} as const

/** Cookies the trackers set on this site, cleared when a visitor withdraws a yes. */
const TRACKER_COOKIE = /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc|_clck|_clsk)/

function clearTrackerCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host.replace(/^www\./, '')}`]
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (!TRACKER_COOKIE.test(name)) continue
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; max-age=0${domain ? `; domain=${domain}` : ''}`
    }
  }
  try {
    localStorage.removeItem('si_journal')
  } catch {}
}

export default function CookieConsent() {
  const pathname = usePathname() || '/'
  // 'ask': first visit in a consent country. 'settings': opened from the footer.
  const [mode, setMode] = useState<'ask' | 'settings' | null>(null)

  useEffect(() => {
    const s = window.siConsent
    if (!s || window.top !== window) return
    if (s.region && !s.choice && !isUntrackedPath(pathname)) setMode('ask')
  }, [pathname])

  useEffect(() => {
    const open = () => setMode('settings')
    window.addEventListener(OPEN_COOKIE_SETTINGS, open)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open)
  }, [])

  if (!mode) return null
  const copy = COPY[stripLocale(pathname).locale as keyof typeof COPY] ?? COPY.en

  const decide = (yes: boolean) => {
    setMode(null)
    const s = window.siConsent
    if (!s) return
    // Withdrawing a yes: what is already running cannot be stopped in place.
    if (s.decide(yes)) {
      clearTrackerCookies()
      location.reload()
    }
  }

  return (
    <div
      className="fixed inset-x-3 mx-auto max-w-md rounded-2xl border border-border bg-[#FFF9F2] px-4 py-3.5 text-sm shadow-lift"
      style={{
        zIndex: 'var(--z-consent)' as unknown as number,
        bottom: 'calc(max(var(--bottom-dock-h, 0px), env(safe-area-inset-bottom, 0px)) + 0.75rem)',
      }}
      role="region"
      aria-label="Cookie choice"
      data-journal-private
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 leading-6 text-charcoal">
          {copy.text}{' '}
          <Link href="/privacy#cookies" className="font-semibold underline underline-offset-2">
            {copy.more}
          </Link>
        </p>
        {mode === 'settings' && (
          <button
            type="button"
            onClick={() => setMode(null)}
            aria-label={copy.close}
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal/60 hover:bg-charcoal/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => decide(false)} className="btn-primary rounded-full py-2.5 text-[0.9rem] font-semibold">
          {copy.no}
        </button>
        <button type="button" onClick={() => decide(true)} className="btn-primary rounded-full py-2.5 text-[0.9rem] font-semibold">
          {copy.yes}
        </button>
      </div>
    </div>
  )
}

/** "Cookie settings", for the footer: reopens the choice above. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))} className={className}>
      Cookie settings
    </button>
  )
}
