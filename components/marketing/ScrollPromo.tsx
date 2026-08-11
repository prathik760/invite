'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { seoEvents, trackEvent } from '@/lib/analytics'
import {
  PROMO,
  discountPercent,
  hasRealDiscount,
  isLowestPricedPaid,
  promoPrice,
  snoozePromo,
} from '@/lib/promo'
import { templateImage } from '@/lib/templateMedia'

/**
 * Scroll-triggered seasonal promotion.
 *
 * Deliberate choices, in order of how much they affect conversion:
 *
 * 1. Fires on scroll depth (see PROMO.triggerAtScroll) or on reaching the
 *    footer — engagement, not arrival. Someone who has read nothing has given
 *    no signal worth interrupting.
 * 2. Never appears inside the funnel (/create, /e/, dashboard, auth, checkout).
 *    Interrupting someone who is already converting costs more than it earns,
 *    and on a published invitation it would be advertising at the host's guests.
 * 3. Dismissal is remembered for `snoozeDays`. A popup that returns on every
 *    page view trains people to close it without reading.
 * 4. Bottom sheet on mobile so the close button and CTA are thumb-reachable;
 *    centred dialog on desktop. Most traffic here arrives from WhatsApp.
 * 5. Page scroll is never locked — this is a promotion, not a blocker.
 * 6. This module is fetched only once ScrollPromoMount's trigger fires, so a
 *    visitor who never scrolls far enough never downloads it. Rendering it from the
 *    root layout instead put ~12 KB into the layout chunk, paid on every page.
 *
 * The scroll trigger and dismissal memory live in ScrollPromoMount and
 * lib/promo.ts respectively, so the always-loaded part stays tiny.
 */

function useCountdown(endsAt: string | null) {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    if (!endsAt) return
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now()
      if (!Number.isFinite(ms) || ms <= 0) return setLabel(null)
      const d = Math.floor(ms / 86400000)
      const h = Math.floor((ms % 86400000) / 3600000)
      setLabel(d > 0 ? `${d} day${d === 1 ? '' : 's'} left` : `${h} hour${h === 1 ? '' : 's'} left`)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [endsAt])
  return label
}

/** Rendered only once ScrollPromoMount's scroll trigger has fired. */
export default function ScrollPromo() {
  const [open, setOpen] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<Element | null>(null)

  const price = promoPrice()
  const countdown = useCountdown(PROMO.endsAt)
  const percent = discountPercent()

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    lastFocused.current = document.activeElement
    trackEvent(seoEvents.promoView, {
      template_id: PROMO.templateId,
      price,
      has_discount: hasRealDiscount(),
      trigger: 'scroll_depth',
      scroll_depth: PROMO.triggerAtScroll,
    })
  }, [price])

  const close = useCallback(
    (reason: string) => {
      setOpen(false)
      snoozePromo()
      trackEvent(seoEvents.promoDismiss, { template_id: PROMO.templateId, reason })
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
    },
    [],
  )

  // Escape to close, and move focus into the dialog when it opens.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close('escape') }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  const anim = reducedMotion ? 'none' : 'si-promo-in 0.42s cubic-bezier(0.22,1,0.36,1)'

  return (
    <>
      <style>{`
        @keyframes si-promo-in { from { opacity:0; transform:translateY(28px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes si-promo-fade { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Backdrop — click to dismiss. Scroll is intentionally not locked. */}
      <div
        onClick={() => close('backdrop')}
        aria-hidden
        className="fixed inset-0 z-[60]"
        style={{
          background: 'rgba(34,27,23,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: reducedMotion ? 'none' : 'si-promo-fade 0.3s ease',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="si-promo-title"
        aria-describedby="si-promo-desc"
        className="fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-md sm:inset-0 sm:my-auto sm:h-fit sm:px-4"
        style={{ animation: anim }}
      >
        <div
          className="overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          style={{ border: '1px solid #E8DCCD' }}
        >
          {/* Banner: the template's own colours, so the popup looks like the
              product rather than a generic interstitial. */}
          <div className="relative" style={{ background: 'linear-gradient(135deg,#E0B65A 0%,#C24E68 100%)' }}>
            <div className="flex items-center gap-3 px-5 pb-4 pt-5 sm:px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={templateImage(PROMO.templateId)}
                alt="Raksha Bandhan Premium invitation template"
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                style={{ border: '2px solid rgba(255,255,255,0.55)' }}
              />
              <div className="min-w-0 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Raksha Bandhan
                </p>
                <p id="si-promo-title" className="mt-0.5 font-display text-xl leading-tight">
                  Rakhi is about the distance
                </p>
              </div>
            </div>

            <button
              ref={closeRef}
              onClick={() => close('close_button')}
              aria-label="Close offer"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.22)' }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="px-5 pb-6 pt-5 sm:px-6">
            <p id="si-promo-desc" className="text-sm leading-6 text-muted">
              Your brother or sister is probably in another city this year. Send them a
              Raksha Bandhan page they actually open — your photos together, your message,
              a countdown to the day, and a wishes wall the whole family can sign.
            </p>

            {/* Price. Strike-through appears only when a real prior price is
                configured in lib/promo.ts — never invented for urgency. */}
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-3xl text-ink">₹{price}</span>
              {hasRealDiscount() && (
                <>
                  <span className="text-base text-muted line-through">₹{PROMO.originalPrice}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                    style={{ background: '#C24E68' }}
                  >
                    {percent}% off
                  </span>
                </>
              )}
              <span className="text-xs text-muted">one-time · no subscription</span>
            </div>

            {isLowestPricedPaid() && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#C24E68' }}>
                Our lowest-priced premium template
              </p>
            )}
            {countdown && (
              <p className="mt-1.5 text-xs font-semibold" style={{ color: '#C24E68' }}>
                {countdown}
              </p>
            )}

            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted">
              {['Photo memories', 'Event timeline', 'Wishes & RSVP', 'Optional shagun link'].map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <span style={{ color: '#2F766D' }}>✓</span>{f}
                </li>
              ))}
            </ul>

            <Link
              href={`/create?template=${PROMO.templateId}&src=scroll_promo`}
              onClick={() => {
                trackEvent(seoEvents.promoClick, {
                  template_id: PROMO.templateId,
                  price,
                  has_discount: hasRealDiscount(),
                  cta_location: 'scroll_promo_primary',
                })
                setOpen(false)
                snoozePromo()
              }}
              className="mt-5 flex w-full items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#C24E68,#E0B65A)' }}
            >
              Make our Rakhi page →
            </Link>

            <p className="mt-2.5 text-center text-[11px] text-muted">
              Build it and preview the whole thing free · Pay only to publish
            </p>

            <button
              onClick={() => close('maybe_later')}
              className="mt-1 w-full py-2 text-xs text-muted transition-colors hover:text-foreground"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
