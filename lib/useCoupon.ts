'use client'

import { useSyncExternalStore } from 'react'
import { checkCoupon, findCoupon, normaliseCode, type CouponCheck } from '@/lib/coupons'

/**
 * The discount code this visitor holds (lib/coupons.ts), shared by every
 * component that shows a price, so applying or removing it in the payment
 * window updates the publish button and the summary card at the same time.
 *
 * Kept in localStorage so a code from a campaign link survives the walk from
 * the design page into the builder, a reload and a sign-in. Private windows
 * that block storage keep it in memory for the visit.
 */

const KEY = 'si_coupon'
const listeners = new Set<() => void>()
let memory: string | null = null

function read(): string | null {
  try {
    return normaliseCode(window.localStorage.getItem(KEY)) || null
  } catch {
    return memory
  }
}

function write(code: string | null) {
  memory = code
  try {
    if (code) window.localStorage.setItem(KEY, code)
    else window.localStorage.removeItem(KEY)
  } catch { /* storage blocked: memory holds it */ }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) listener() }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Saves `?code=` from a campaign link. Returns the code when it is a real one. */
export function rememberCouponFromUrl(): string | null {
  const coupon = findCoupon(new URLSearchParams(window.location.search).get('code'))
  if (!coupon || !checkCoupon(coupon.code).ok) return null
  if (read() !== coupon.code) write(coupon.code)
  return coupon.code
}

/** The saved code, if it is live and discounts `plan` — what the checkout should send. */
export function couponForCheckout(plan: string): string | undefined {
  const check = checkCoupon(read(), plan)
  return check.ok ? check.coupon.code : undefined
}

export function useCoupon(plan?: string) {
  const code = useSyncExternalStore(subscribe, read, () => null)
  const check = code ? checkCoupon(code, plan) : null
  return {
    code,
    /** The coupon, when the saved code is live and discounts this plan. */
    applied: check?.ok ? check.coupon : null,
    /** Checks a typed code for this plan and keeps it when it works. */
    apply(input: string): CouponCheck {
      const result = checkCoupon(input, plan)
      if (result.ok) write(result.coupon.code)
      return result
    },
    remove() {
      write(null)
    },
  }
}
