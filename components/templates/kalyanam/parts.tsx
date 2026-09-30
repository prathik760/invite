'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
 * Kalyanam's working parts (a copy of the Rajwada set, kept separate so each design owns its code): links that go inert in the builder preview, the
 * sticky section nav, and the photo lightbox.
 */

/** An outbound link; inert (no href) in the builder preview. Renders nothing without a target. */
export function Act({
  href,
  isPreview,
  className,
  style,
  children,
  external = true,
  label,
}: {
  href: string | null | undefined
  isPreview?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
  external?: boolean
  label?: string
}) {
  if (!href) return null
  return (
    <a
      href={isPreview ? undefined : href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-disabled={isPreview || undefined}
      aria-label={label}
      className={className}
      style={style}
    >
      {children}
    </a>
  )
}

/** Scroll the nearest scrolling ancestor (the builder frame) or the window so `el` sits under the nav. */
export function scrollToSection(el: HTMLElement, offset: number) {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let p: HTMLElement | null = el.parentElement
  while (p && p !== document.body && p !== document.documentElement) {
    const s = getComputedStyle(p)
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) break
    p = p.parentElement
  }
  if (p && p !== document.body && p !== document.documentElement) {
    const top = el.getBoundingClientRect().top - p.getBoundingClientRect().top + p.scrollTop - offset
    p.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: smooth ? 'smooth' : 'auto' })
  }
}

export interface NavItem {
  id: string
  label: string
}

/**
 * A quiet, sticky row of section links that sits just under the hero.
 * The current section is underlined; the row scrolls sideways if it must.
 */
export function SectionNav({
  items,
  className,
  style,
  linkStyle,
  activeColor,
  underline,
  padRight = 20,
}: {
  items: NavItem[]
  className?: string
  style?: CSSProperties
  linkStyle?: CSSProperties
  activeColor: string
  underline: string
  padRight?: number
}) {
  const navRef = useRef<HTMLElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState<string>('')
  const ids = items.map((i) => i.id).join(' ')

  useEffect(() => {
    const els = ids
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const seen = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
        const first = els.find((el) => seen.get(el.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  // keep the current link in view when the row scrolls sideways
  useEffect(() => {
    const row = rowRef.current
    const link = row?.querySelector<HTMLElement>(`[data-nav="${active}"]`)
    if (!row || !link) return
    const left = link.offsetLeft - row.clientWidth / 2 + link.offsetWidth / 2
    row.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const go = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    scrollToSection(el, (navRef.current?.offsetHeight ?? 0) + 6)
  }, [])

  if (items.length < 2) return null
  return (
    <nav ref={navRef} aria-label="Sections of the invitation" className={className} style={style}>
      <div ref={rowRef} className="flex gap-6 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingRight: padRight }}>
        {items.map((i) => {
          const on = active === i.id
          return (
            <a
              key={i.id}
              href={`#${i.id}`}
              data-nav={i.id}
              aria-current={on ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(i.id)
              }}
              className="relative shrink-0 whitespace-nowrap py-3"
              style={{ ...linkStyle, color: on ? activeColor : linkStyle?.color }}
            >
              {i.label}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[7px] h-px transition-opacity duration-300"
                style={{ background: underline, opacity: on ? 1 : 0 }}
              />
            </a>
          )
        })}
      </div>
    </nav>
  )
}

/** Full-screen photo viewer: tap, swipe or arrow keys to move, Escape or the close button to leave. */
export function Lightbox({
  photos,
  index,
  onClose,
  onStep,
  background,
  color,
  font,
}: {
  photos: string[]
  index: number
  onClose: () => void
  onStep: (d: number) => void
  background: string
  color: string
  font?: string
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus?.()
    }
  }, [onClose, onStep])

  const many = photos.length > 1
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full'
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background, color, fontFamily: font }}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return
        const dx = e.changedTouches[0].clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 44 && many) onStep(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-[15px] tabular-nums" aria-live="polite">
          {index + 1} / {photos.length}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo" className={btn} style={{ border: `1px solid ${color}55` }}>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            <path d="M4 4l12 12M16 4 4 16" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4" onClick={onClose}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photos[index]}
          src={photos[index]}
          alt=""
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {many && (
        <div className="flex items-center justify-center gap-6 pb-6">
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={btn} style={{ border: `1px solid ${color}55` }}>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path d="M12.5 4 6.5 10l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={btn} style={{ border: `1px solid ${color}55` }}>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path d="m7.5 4 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

/** Lightbox state for a list of photos. */
export function useLightbox(count: number) {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count)), [count])
  return { open, setOpen, close, step }
}

export const Icon = {
  calendar: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" strokeLinejoin="round" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.870 9.870 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.880 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.830 9.830 0 0 1 2.89 7c0 5.45-4.43 9.880-9.88 9.88m8.41-18.3A11.820 11.820 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.880 11.880 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  ),
}
