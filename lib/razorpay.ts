import Razorpay from 'razorpay'
import crypto from 'crypto'
import type { NextRequest } from 'next/server'
import { PLANS, PlanId } from './plans'
import { COUNTRY_COOKIE, intlPricingEnabled, localPrice, normaliseCountry, priceInList, type LocalPrice, type PriceListId } from './pricing'

let _client: Razorpay | null = null

export function getRazorpayClient(): Razorpay {
  if (!_client) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }
    _client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return _client
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET is not configured')
  const text = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex')
  return expected === signature
}

function paidPlanInr(planId: PlanId): number {
  const plan = PLANS.find(p => p.id === planId)
  if (!plan || plan.price === 0) throw new Error(`Invalid paid plan: ${planId}`)
  return plan.price
}

/**
 * The country a checkout is priced for (lib/pricing.ts). Only Vercel's header
 * counts in production, so a visitor cannot pick a cheaper country by editing
 * the cookie. Locally there is no header, so the `?cc=` preview cookie stands
 * in for it.
 */
export function checkoutCountry(req: NextRequest): string | null {
  if (!intlPricingEnabled()) return null
  const header = normaliseCountry(req.headers.get('x-vercel-ip-country'))
  if (header || process.env.NODE_ENV === 'production') return header
  return normaliseCountry(req.cookies.get(COUNTRY_COOKIE)?.value)
}

/** What a plan costs a checkout from `country`. */
export function planPriceFor(planId: PlanId, country: string | null): LocalPrice {
  return localPrice(paidPlanInr(planId), country)
}

/** What a plan costs in a given price list — used to verify an order made earlier. */
export function planPriceIn(planId: PlanId, list: PriceListId): LocalPrice {
  return priceInList(paidPlanInr(planId), list)
}
