import type { PlanId } from './plans'

/**
 * Discount codes for marketing campaigns.
 *
 * A code takes a percentage off the designs in `plans`, in every currency
 * (lib/pricing.ts `discountedPrice`), until `endsAt`. Visitors get one from a
 * campaign link — any page with `?code=ROYAL20` remembers it — or type it in
 * the payment window.
 *
 * The checkout re-checks the code on the server and records it on the
 * Razorpay order, so nothing a browser does can lower the amount charged. The
 * codes themselves do ship to the browser (the builder checks them as they are
 * typed), so never list one here that has to stay secret.
 *
 * To run another campaign, add a line. For a partner or channel you want to
 * measure separately, give it its own code with the same discount.
 */
export interface Coupon {
  code: string
  percentOff: number
  /** Plans the code discounts: 'couture' is the Rajwada suite. */
  plans: PlanId[]
  /** Last moment the code works, with its time zone. */
  endsAt: string
}

export const COUPONS: Coupon[] = [
  // Wedding-season launch offer for Rajwada (₹1,999 → ₹1,599).
  { code: 'ROYAL20', percentOff: 20, plans: ['couture'], endsAt: '2026-12-31T23:59:59+05:30' },
]

export type CouponCheck =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: 'unknown' | 'expired' | 'not_for_design' }

/** "royal 20" → "ROYAL20". Codes are letters and digits only. */
export function normaliseCode(value: unknown): string {
  return typeof value === 'string' ? value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 32) : ''
}

export function findCoupon(value: unknown): Coupon | null {
  const code = normaliseCode(value)
  return (code && COUPONS.find((c) => c.code === code)) || null
}

/** Whether `value` is a live code for `plan` (any plan when omitted). */
export function checkCoupon(value: unknown, plan?: string, now = Date.now()): CouponCheck {
  const coupon = findCoupon(value)
  if (!coupon) return { ok: false, reason: 'unknown' }
  if (now > new Date(coupon.endsAt).getTime()) return { ok: false, reason: 'expired' }
  if (plan && !coupon.plans.includes(plan as PlanId)) return { ok: false, reason: 'not_for_design' }
  return { ok: true, coupon }
}

export function couponMessage(reason: Exclude<CouponCheck, { ok: true }>['reason']): string {
  if (reason === 'expired') return 'That code has ended.'
  if (reason === 'not_for_design') return 'That code is for a different design.'
  return 'That code isn’t valid.'
}

/** "31 December" — the code's last day, in India's time zone where the campaign is set. */
export function couponEndLabel(coupon: Coupon): string {
  return new Date(coupon.endsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })
}
