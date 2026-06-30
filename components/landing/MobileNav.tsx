'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#templates', label: 'Templates' },
  { href: '#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing', isLink: true },
  { href: '/blog', label: 'Blog', isLink: true },
  { href: '#custom-template', label: 'Custom', accent: true },
  { href: '/dashboard', label: 'Dashboard', isLink: true },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close menu on resize to sm+
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
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
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-border/30 lg:hidden"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span
          className="flex h-5 w-5 flex-col items-center justify-center gap-[5px] transition-all"
          aria-hidden
        >
          <span
            className="block h-[1.8px] w-5 rounded-full bg-ink transition-all duration-200 origin-center"
            style={open ? { transform: 'translateY(6.8px) rotate(45deg)' } : {}}
          />
          <span
            className="block h-[1.8px] w-5 rounded-full bg-ink transition-all duration-200"
            style={open ? { opacity: 0, transform: 'scaleX(0)' } : {}}
          />
          <span
            className="block h-[1.8px] w-5 rounded-full bg-ink transition-all duration-200 origin-center"
            style={open ? { transform: 'translateY(-6.8px) rotate(-45deg)' } : {}}
          />
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop — fixed so it covers full screen below header */}
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden"
            style={{ top: '64px' }}
            onClick={close}
            aria-hidden
          />

          {/* Menu panel — fixed so overflow-x-hidden on parent can't clip it */}
          <div
            className="fixed inset-x-0 z-50 border-b border-border shadow-card-md lg:hidden"
            style={{
              top: '64px',
              background: 'rgba(248,245,240,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              animation: 'mobileNavSlide 0.18s ease',
            }}
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3" aria-label="Mobile navigation">
              {NAV_LINKS.map(item =>
                item.isLink ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-border/40 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-border/40"
                    style={item.accent ? { color: '#7A3E4A' } : { color: 'var(--muted)' }}
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

      <style>{`
        @keyframes mobileNavSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
