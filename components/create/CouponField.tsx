'use client'

import { useState } from 'react'
import { CheckIcon } from '@/components/ui/Icons'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { couponEndLabel, couponMessage, normaliseCode } from '@/lib/coupons'
import { useCoupon } from '@/lib/useCoupon'
import type { PlanId } from '@/lib/plans'

/**
 * A discount code on the review page (lib/coupons.ts): the code in force with a
 * way to remove it, or a small "Have a discount code?" link. The box stays behind
 * that link: an open, empty field sends people without a code off to search for one.
 */
export default function CouponField({ planId, templateId }: { planId: PlanId; templateId: string }) {
  const coupon = useCoupon(planId, templateId)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const apply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!normaliseCode(input)) return
    const result = coupon.apply(input)
    if (result.ok) {
      setOpen(false); setError(null); setInput('')
      trackEvent(seoEvents.couponApplied, { coupon: result.coupon.code, source: 'typed', template_id: templateId })
    } else {
      setError(couponMessage(result.reason))
      trackEvent(seoEvents.couponRejected, { coupon: normaliseCode(input), reason: result.reason, template_id: templateId })
    }
  }

  if (coupon.applied) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-emerald-soft/30 bg-emerald-soft/5 px-3.5 py-2.5 text-[0.85rem] text-charcoal/85">
        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-soft" />
        <span className="min-w-0 flex-1">
          <span className="font-semibold">{coupon.applied.code}</span> · {coupon.applied.percentOff}% off until {couponEndLabel(coupon.applied)}
        </span>
        <button type="button" onClick={coupon.remove} className="shrink-0 text-[0.8rem] text-muted underline-offset-2 hover:text-charcoal hover:underline">
          Remove
        </button>
      </p>
    )
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-[0.82rem] text-muted underline underline-offset-4 hover:text-charcoal">
        Have a discount code?
      </button>
    )
  }
  return (
    <form onSubmit={apply} noValidate>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null) }}
          placeholder="Discount code"
          aria-label="Discount code"
          aria-invalid={!!error}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[0.95rem] uppercase tracking-wide text-charcoal outline-none focus:border-emerald-soft"
        />
        <button type="submit" className="btn-outline shrink-0 rounded-xl px-4 text-[0.88rem] font-semibold">Apply</button>
      </div>
      {error && <p role="alert" className="mt-1.5 text-[0.8rem] text-[#A33A3A]">{error}</p>}
    </form>
  )
}
