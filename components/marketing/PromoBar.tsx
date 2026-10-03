'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { promoBarAllowedOn, snoozePromoBar, type PromoBarCopy } from '@/lib/promo'
import { Price } from '@/components/price/Price'
import ConfettiBurst from '@/components/marketing/ConfettiBurst'

/**
 * The slim offer bar above the header on every page while a campaign code is
 * live (lib/promo.ts `bar`, lib/coupons.ts).
 *
 * Rendered with the page, not after it, so it never pushes the layout down,
 * and sticky, so it stays in view while the visitor scrolls.
 * Hiding it is done before the first paint by the root layout's script (closed
 * recently, or the offer has ended), which is why nothing here depends on the
 * date or on storage while rendering. The confetti bursts once per visit.
 */
export default function PromoBar({
  href, code, percentOff, inr, ends, templateId, copy,
}: {
  href: string
  code: string
  percentOff: number
  /** The design's normal INR price, shown in the visitor's currency. */
  inr: number
  /** "31 December" */
  ends: string
  templateId: string
  copy: PromoBarCopy
}) {
  const pathname = usePathname()
  const allowed = promoBarAllowedOn(pathname)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!allowed || document.documentElement.getAttribute('data-promo-bar') === 'off') return
    try {
      if (sessionStorage.getItem('si-promo-bar-seen')) return
      sessionStorage.setItem('si-promo-bar-seen', '1')
    } catch { /* storage blocked: burst anyway, once per page */ }
    setBurst(true)
    trackEvent(seoEvents.promoView, { template_id: templateId, coupon: code, trigger: 'bar' })
  }, [allowed, code, templateId])

  if (!allowed) return null

  return (
    // Sticky: it stays in view on scroll, and sticky headers sit just below
    // it through --promo-bar-h (globals.css).
    <div className="si-promo-bar si-gilt sticky top-0 z-[35] text-paper" role="region" aria-label="Offer">
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #3E0B15 0%, #6E1C2A 30%, #8A2E35 50%, #6E1C2A 70%, #3E0B15 100%)' }}
      >
        <span aria-hidden className="si-promo-bar__shine" />
        {/* Hairlines of gold top and bottom, like a foil-edged card. */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C866]/70 to-transparent" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E8C866]/50 to-transparent" />

        <Link
          href={href}
          onClick={() => trackEvent(seoEvents.promoClick, { template_id: templateId, coupon: code, cta_location: 'promo_bar' })}
          className="shell relative flex h-11 items-center justify-center gap-2.5 pr-10 text-[0.8rem] sm:gap-3 sm:text-[0.88rem]"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="si-twinkle h-3.5 w-3.5 shrink-0 text-[#E8C866]">
            <path fill="currentColor" d="M12 0c.6 5.8 3.2 9.6 12 12-8.8 2.4-11.4 6.2-12 12-.6-5.8-3.2-9.6-12-12C8.8 9.6 11.4 5.8 12 0Z" />
          </svg>
          <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#E8C866] md:inline">{copy.eyebrow}</span>
          <span className="hidden h-3.5 w-px bg-[#E8C866]/40 md:inline-block" aria-hidden />
          <span className="min-w-0 truncate">
            <span className="sm:hidden">{copy.short}</span>
            <span className="hidden sm:inline">{copy.long}</span>{' '}
            <strong className="font-semibold text-[#F6E3A8]">{percentOff}% off</strong>
            <span className="hidden lg:inline">
              {' '}· now <Price inr={inr} percentOff={percentOff} className="font-semibold text-[#F6E3A8]" />{' '}
              <s className="text-paper/55"><Price inr={inr} /></s>
            </span>
          </span>
          <span className="relative shrink-0 rounded-md border border-dashed border-[#E8C866]/80 bg-white/[0.06] px-2 py-0.5 text-[0.78rem] font-bold tracking-[0.16em] text-[#F6E3A8] sm:text-[0.82rem]">
            {code}
          </span>
          <span className="hidden text-paper/65 md:inline">ends {ends}</span>
          <span className="shrink-0 font-semibold underline decoration-[#E8C866]/70 underline-offset-4">
            {copy.cta}<span aria-hidden> →</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            snoozePromoBar()
            trackEvent(seoEvents.promoDismiss, { template_id: templateId, coupon: code, reason: 'bar_close' })
          }}
          aria-label="Hide this offer"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-white/10 hover:text-paper"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      {/* Outside the clipped strip, so the burst can fall over the page. */}
      {burst && <ConfettiBurst x="50%" y="70%" direction="down" count={50} spread={1.2} delay={500} />}
    </div>
  )
}
