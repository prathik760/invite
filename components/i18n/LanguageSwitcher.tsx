'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LOCALES, getLocale, localePath, stripLocale } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'

/**
 * Language switcher.
 *
 * Renders real <a> links to each locale's URL rather than switching client-side,
 * so every language is a crawlable destination that Google can follow. A
 * JavaScript-only switcher would leave the other languages undiscoverable.
 */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const { locale: current, path } = stripLocale(pathname)
  const active = getLocale(current)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
        {active.label}
      </button>

      {open && (
        <ul
          className="absolute right-0 z-50 mt-2 max-h-80 w-48 overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg"
          role="menu"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="none">
              <Link
                href={localePath(path, l.code)}
                hrefLang={l.htmlLang}
                role="menuitem"
                onClick={() => {
                  trackEvent('language_switch', { from: current, to: l.code, page_path: path })
                  setOpen(false)
                }}
                className={`block px-4 py-2 text-sm transition-colors hover:bg-background ${
                  l.code === current ? 'font-semibold text-ink' : 'text-muted'
                }`}
                dir={l.dir}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
