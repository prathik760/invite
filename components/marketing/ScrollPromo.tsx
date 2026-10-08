'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { seoEvents, trackEvent } from '@/lib/analytics'
import {
  PROMO,
  discountPercent,
  hasRealDiscount,
  isLowestPricedPaid,
  promoCoupon,
  promoPrice,
  snoozePromo,
} from '@/lib/promo'
import { templateImage } from '@/lib/templateMedia'
import { Price } from '@/components/price/Price'
import ConfettiBurst from '@/components/marketing/ConfettiBurst'

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
      // Weeks away, a date reads better than "61 days left".
      if (d > 14) return setLabel(`Offer ends ${new Date(endsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })}`)
      setLabel(d > 0 ? `${d} day${d === 1 ? '' : 's'} left` : `${h} hour${h === 1 ? '' : 's'} left`)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [endsAt])
  return label
}

/**
 * Rendered only once ScrollPromoMount has fired: on arrival for a first-time
 * visitor, otherwise on scroll.
 */
export default function ScrollPromo({ trigger = 'scroll', designHref }: { trigger?: 'arrival' | 'scroll'; designHref: string }) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<Element | null>(null)

  const price = promoPrice()
  const countdown = useCountdown(PROMO.endsAt)
  const percent = discountPercent()
  const coupon = promoCoupon()
  const hasDiscount = hasRealDiscount() || coupon !== null
  const copy = PROMO.copy
  // The design's own page, where the live preview opens the gates, rather than
  // the builder: straight into an empty form, most people left at the names.
  // The layout's CouponCapture keeps ?code= for checkout from there.
  const href = `${designHref}${coupon ? `?code=${coupon.code}` : ''}`

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    lastFocused.current = document.activeElement
    trackEvent(seoEvents.promoView, {
      template_id: PROMO.templateId,
      price,
      has_discount: hasDiscount,
      coupon: coupon?.code,
      trigger: trigger === 'arrival' ? 'first_visit' : 'scroll_depth',
      scroll_depth: trigger === 'scroll' ? PROMO.triggerAtScroll : undefined,
    })
  }, [price, hasDiscount, coupon?.code, trigger])

  const copyCode = () => {
    if (!coupon) return
    navigator.clipboard?.writeText(coupon.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }

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

  const anim = reducedMotion ? 'none' : 'si-promo-in 0.5s cubic-bezier(0.22,1,0.36,1)'
  // The palace palette: gold foil on deep maroon, matching the offer bar.
  const gold = '#E8C866'
  const goldLight = '#F6E3A8'
  const goldDeep = copy.accentSoft
  const deep = copy.accentDeep ?? '#1F060C'
  const cream = '#FBF3E4'

  return (
    <>
      <style>{`
        @keyframes si-promo-in { from { opacity:0; transform:translateY(36px) scale(.96) } to { opacity:1; transform:none } }
        @keyframes si-promo-fade { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Backdrop — click to dismiss. Scroll is intentionally not locked. */}
      <div
        onClick={() => close('backdrop')}
        aria-hidden
        className="fixed inset-0 z-[60]"
        style={{
          background: 'rgba(20,4,8,0.62)',
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
        className="si-gilt fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-md sm:inset-0 sm:my-auto sm:h-fit sm:px-4"
        style={{ animation: anim }}
      >
        <div
          className="relative max-h-[92svh] overflow-y-auto overflow-x-hidden rounded-t-[1.75rem] shadow-[0_-24px_60px_-12px_rgba(0,0,0,0.55)] sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
          style={{
            color: cream,
            background: `radial-gradient(120% 70% at 50% 0%, ${copy.accent} 0%, #5A1622 48%, ${deep} 100%)`,
            border: `1px solid ${gold}55`,
          }}
        >
          {/* A jaali lattice, barely there, and a foil frame inside the edge. */}
          <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: JAALI, backgroundSize: '28px 28px' }} />
          <span aria-hidden className="pointer-events-none absolute inset-[10px] rounded-[1.25rem] border" style={{ borderColor: `${gold}33` }} />
          <span aria-hidden className="si-shine" />

          <button
            ref={closeRef}
            onClick={() => close('close_button')}
            aria-label="Close offer"
            className="absolute right-4 top-4 z-[3] flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${gold}40`, color: cream }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="relative px-6 pb-3.5 pt-6 text-center sm:px-8">
            {/* The design itself, framed in a palace arch of gold. */}
            <div
              className="mx-auto w-[62px] rounded-t-full p-[3px]"
              style={{ background: `linear-gradient(180deg, ${goldLight}, ${goldDeep})`, boxShadow: `0 12px 30px -10px ${gold}88` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={templateImage(PROMO.templateId)}
                alt={copy.imageAlt}
                width={56}
                height={74}
                className="block h-[74px] w-full rounded-t-full object-cover object-top"
              />
            </div>

            <p className="mt-3 text-[10.5px] font-bold uppercase tracking-[0.32em]" style={{ color: gold }}>
              ✦ {copy.eyebrow} ✦
            </p>
            <p id="si-promo-title" className="mx-auto mt-1.5 max-w-[17ch] font-editorial text-[1.75rem] font-semibold leading-[1.08] text-[#FFF7EA]">
              {copy.headline}
            </p>

            <div aria-hidden className="mx-auto mt-3 flex w-40 items-center gap-2">
              <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${gold})` }} />
              <span className="h-1.5 w-1.5 rotate-45" style={{ background: gold }} />
              <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${gold}, transparent)` }} />
            </div>

            <p id="si-promo-desc" className="mx-auto mt-3 max-w-[36ch] text-[0.86rem] leading-[1.45rem]" style={{ color: `${cream}c0` }}>
              {copy.body}
            </p>

            {/* Price. Strike-through appears only for a real discount: a
                discount code that is live, or a real prior price configured in
                lib/promo.ts — never invented for urgency. */}
            {coupon ? (
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="font-editorial text-[2.5rem] font-semibold leading-none" style={{ color: goldLight }}>
                  <Price inr={price} percentOff={coupon.percentOff} />
                </span>
                <span className="flex flex-col items-start gap-1">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.12em]"
                    style={{ background: `linear-gradient(135deg, ${goldLight}, ${gold})`, color: '#3E0B15' }}
                  >
                    {coupon.percentOff}% off
                  </span>
                  <s className="text-[0.85rem]" style={{ color: `${cream}80` }}><Price inr={price} /></s>
                </span>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap items-baseline justify-center gap-2">
                <span className="font-editorial text-[2.4rem] font-semibold leading-none" style={{ color: goldLight }}><Price inr={price} /></span>
                {hasRealDiscount() && (
                  <>
                    <span className="text-base line-through" style={{ color: `${cream}80` }}><Price inr={PROMO.originalPrice as number} /></span>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: gold, color: '#3E0B15' }}>{percent}% off</span>
                  </>
                )}
                <span className="text-xs" style={{ color: `${cream}99` }}>one-time · no subscription</span>
              </div>
            )}

            {coupon && (
              // The code as a ticket: tap to copy for later, though the
              // button below already carries it into the builder.
              <button
                type="button"
                onClick={copyCode}
                aria-label={`Copy the code ${coupon.code}`}
                className="mx-auto mt-3.5 flex items-center gap-3 rounded-xl border border-dashed px-4 py-1.5 transition-transform active:scale-[0.97]"
                style={{ borderColor: `${gold}b0`, background: 'rgba(255,255,255,0.05)' }}
              >
                <span className="font-editorial text-[1.3rem] font-bold leading-none tracking-[0.2em]" style={{ color: goldLight }}>{coupon.code}</span>
                <span aria-hidden className="h-6 w-px" style={{ background: `${gold}60` }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: `${cream}b0` }}>
                  {copied ? 'Copied ✓' : 'Tap to copy'}
                </span>
              </button>
            )}

            {isLowestPricedPaid() && !coupon && (
              <p className="mt-2 text-xs font-medium" style={{ color: gold }}>Our lowest-priced premium template</p>
            )}
            {countdown && (
              <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: gold }}>{countdown}</p>
            )}

            <ul className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-x-4 gap-y-1.5 text-left text-[0.8rem]" style={{ color: `${cream}cc` }}>
              {copy.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <span aria-hidden style={{ color: gold }}>✦</span>{f}
                </li>
              ))}
            </ul>

            <Link
              href={href}
              onClick={() => {
                trackEvent(seoEvents.promoClick, {
                  template_id: PROMO.templateId,
                  price,
                  has_discount: hasDiscount,
                  coupon: coupon?.code,
                  cta_location: 'scroll_promo_primary',
                })
                setOpen(false)
                snoozePromo()
              }}
              className="relative mt-5 flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-bold transition-transform active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${goldLight} 0%, ${gold} 45%, ${goldDeep} 100%)`,
                color: '#3E0B15',
                boxShadow: `0 14px 32px -12px ${gold}aa, inset 0 1px 0 rgba(255,255,255,0.6)`,
              }}
            >
              <span aria-hidden className="si-shine" />
              <span className="relative">{copy.cta}</span>
            </Link>

            <p className="mt-2.5 text-[11px]" style={{ color: `${cream}8c` }}>
              Build it and preview the whole thing · Pay only to publish
            </p>
            <button
              onClick={() => close('maybe_later')}
              className="mt-0.5 w-full py-1.5 text-xs transition-colors hover:text-white"
              style={{ color: `${cream}8c` }}
            >
              Maybe later
            </button>
          </div>
        </div>
        {/* Bursts from around the arch and stays on screen: on a phone the
            card fills most of it, so a full-height pop would fly off the top. */}
        {coupon && <ConfettiBurst x="50%" y="15%" count={70} spread={1.35} reach={0.75} delay={280} />}
      </div>
    </>
  )
}

/** A four-point star lattice, like a palace jaali screen, drawn in gold. */
const JAALI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M14 1l3.2 9.8L27 14l-9.8 3.2L14 27l-3.2-9.8L1 14l9.8-3.2z' fill='none' stroke='%23E8C866' stroke-width='0.9'/%3E%3C/svg%3E\")"
