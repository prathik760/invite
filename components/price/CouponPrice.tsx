'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { couponEndLabel } from '@/lib/coupons'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { rememberCouponFromUrl, useCoupon } from '@/lib/useCoupon'
import { Price } from '@/components/price/Price'

/**
 * Keeps a discount code from a campaign link (`?code=ROYAL20` on any page) so
 * it is waiting at checkout. Mounted once in the root layout; renders nothing.
 *
 * Runs on every navigation, not only the first load: the offer bar and popup
 * link to `?code=` inside the site, and a client-side move never remounts the
 * layout — so those codes were never saved. The layout wraps this in Suspense,
 * so reading the query string keeps the rest of the page static.
 */
export function CouponCapture() {
  const code = useSearchParams()?.get('code') ?? null
  useEffect(() => {
    if (!code) return
    const saved = rememberCouponFromUrl()
    if (saved) trackEvent(seoEvents.couponApplied, { coupon: saved, source: 'link' })
  }, [code])
  return null
}

/** A design's price, after the visitor's discount code when it covers this design. */
export function CouponPrice({ inr, plan, templateId, className }: { inr: number; plan: string; templateId: string; className?: string }) {
  const { applied } = useCoupon(plan, templateId)
  return <Price inr={inr} percentOff={applied?.percentOff} className={className} />
}

/** "₹1,999 · ROYAL20 · 20% off until 31 December", only while a code applies. */
export function CouponNote({ inr, plan, templateId, className = '' }: { inr: number; plan: string; templateId: string; className?: string }) {
  const { applied } = useCoupon(plan, templateId)
  if (!applied) return null
  return (
    <p className={`text-[0.9rem] text-muted ${className}`}>
      <s><Price inr={inr} /></s>
      {' · '}
      <span className="font-semibold text-emerald-soft">{applied.code}</span>
      {` · ${applied.percentOff}% off until ${couponEndLabel(applied)}`}
    </p>
  )
}
