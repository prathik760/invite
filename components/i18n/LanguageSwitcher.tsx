'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LOCALES, getLocale, localeHref, stripLocale } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { ChevronDownIcon, GlobeIcon } from '@/components/ui/Icons'

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
  const root = useRef<HTMLDivElement>(null)
  const { locale: current, path } = stripLocale(pathname)
  const active = getLocale(current)

  // The header now carries this on every page, so an open list must close when
  // the visitor clicks anywhere else rather than hanging over the content.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Language: ${active.label}`}
        className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-2 text-[0.85rem] font-medium text-charcoal transition-colors hover:border-burnished"
      >
        <GlobeIcon className="h-3.5 w-3.5 text-burnished" />
        {active.label}
        <ChevronDownIcon className="h-3 w-3 text-muted" />
      </button>

      {open && (
        <ul
          className="absolute right-0 z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-2xl border border-line bg-paper p-1.5 shadow-lift"
          role="menu"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="none">
              <Link
                href={localeHref(path, l.code)}
                hrefLang={l.htmlLang}
                role="menuitem"
                onClick={() => {
                  trackEvent('language_switch', { from: current, to: l.code, page_path: path })
                  setOpen(false)
                }}
                className={`block rounded-xl px-3.5 py-2 text-[0.9rem] transition-colors hover:bg-peach ${
                  l.code === current ? 'font-semibold text-emerald-soft' : 'text-charcoal'
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
