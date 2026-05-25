'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#templates', label: 'Templates' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#custom-template', label: 'Custom →', accent: true },
  { href: '/dashboard', label: 'Dashboard', isLink: true },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close menu on resize to sm+
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Hamburger / Close button — only on mobile */}
      <button
        className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-border/30"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel — slides in from header bottom */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={close}
            aria-hidden
          />

          {/* Menu panel */}
          <div
            className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background/98 px-4 py-3 shadow-card-md sm:hidden"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(item =>
                item.isLink ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-border/30 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-border/30"
                    style={item.accent ? { color: '#B87924' } : { color: 'var(--color-muted)' }}
                  >
                    {item.label}
                  </a>
                ),
              )}

              {/* CTA */}
              <div className="mt-2 border-t border-border pt-3 pb-1">
                <Link
                  href="/create"
                  onClick={close}
                  className="gold-button flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
                >
                  Start Free →
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
