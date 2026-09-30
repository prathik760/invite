'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface Testimonial {
  quote: string
  name: string
  event: string
  date: string
  avatar: string
  /** BCP-47 tag for the quote, e.g. 'kn', 'ta'. Defaults to English. */
  lang?: string
}

function Stars() {
  return (
    <div className="flex gap-0.5" role="img" aria-label="Rated 5 out of 5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#0B4A34" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function VerifiedBadge() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-[#0B4A34]" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.498 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ArrowButton({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'left' ? 'Previous testimonials' : 'Next testimonials'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-charcoal shadow-sm transition-all hover:border-[#A47945] hover:text-accent-strong active:scale-95"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
        {dir === 'left'
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  )
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const cards = Array.from(el.children) as HTMLElement[]
    const idx = Math.max(0, Math.min(i, cards.length - 1))
    const card = cards[idx]
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - (cards[0]?.offsetLeft ?? 0), behavior: 'smooth' })
  }, [])

  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = Array.from(el.children) as HTMLElement[]
    const base = cards[0]?.offsetLeft ?? 0
    let best = 0
    let bestDist = Infinity
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - base - el.scrollLeft)
      if (d < bestDist) { bestDist = d; best = i }
    })
    setActive(best)
  }, [])

  const next = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    scrollToIndex(atEnd ? 0 : active + 1)
  }, [active, scrollToIndex])

  const prev = useCallback(() => scrollToIndex(active - 1), [active, scrollToIndex])

  // Auto-advance; pauses on hover / focus / touch.
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(next, 4500)
    return () => window.clearInterval(id)
  }, [paused, next])

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Slideable track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="relative flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 shadow-soft sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            {/* Decorative quote mark */}
            <div
              className="pointer-events-none absolute right-5 top-4 select-none font-editorial font-semibold text-[7rem] leading-none text-[#A47945]/10"
              aria-hidden
            >
              &ldquo;
            </div>

            <div className="mb-5 flex items-center justify-between">
              <Stars />
              <span className="text-[11px] text-muted">{t.date}</span>
            </div>

            {/* `lang` is set so screen readers switch pronunciation and search
                engines index the script correctly — without it an Indic or
                Cyrillic quote is read out as if it were English. It renders
                nothing visible. */}
            <p lang={t.lang ?? 'en'} className="relative flex-1 text-sm leading-[1.9] text-foreground/90">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#A47945]/30 ring-offset-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-charcoal">{t.name}</p>
                    <VerifiedBadge />
                  </div>
                  <p className="text-xs text-muted">{t.event}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Controls: arrows flanking dot indicators */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <ArrowButton dir="left" onClick={prev} />
        <div className="flex items-center gap-2">
          {/* Visible pill stays 8px; the button is 24px tall with padding so the
              tap target meets the minimum size guideline. */}
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === active}
              className="flex h-6 items-center justify-center px-1"
            >
              <span
                className="block h-2 rounded-full transition-all"
                style={{
                  width: i === active ? 22 : 8,
                  background: i === active ? '#0B4A34' : 'rgba(11,74,52,0.28)',
                }}
              />
            </button>
          ))}
        </div>
        <ArrowButton dir="right" onClick={next} />
      </div>
    </div>
  )
}
