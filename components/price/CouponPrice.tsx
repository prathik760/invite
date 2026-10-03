'use client'

import { useEffect } from 'react'
import { couponEndLabel } from '@/lib/coupons'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { rememberCouponFromUrl, useCoupon } from '@/lib/useCoupon'
import { Price } from '@/components/price/Price'

/**
 * Keeps a discount code from a campaign link (`?code=ROYAL20` on any page) so
 * it is waiting at checkout. Mounted once in the root layout; renders nothing.
 */
export function CouponCapture() {
  useEffect(() => {
    const code = rememberCouponFromUrl()
    if (code) trackEvent(seoEvents.couponApplied, { coupon: code, source: 'link' })
  }, [])
  return null
}

/** A design's price, after the visitor's discount code when it covers `plan`. */
export function CouponPrice({ inr, plan, className }: { inr: number; plan: string; className?: string }) {
  const { applied } = useCoupon(plan)
  return <Price inr={inr} percentOff={applied?.percentOff} className={className} />
}

/** "₹1,999 · ROYAL20 · 20% off until 31 December", only while a code applies. */
export function CouponNote({ inr, plan, className = '' }: { inr: number; plan: string; className?: string }) {
  const { applied } = useCoupon(plan)
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
