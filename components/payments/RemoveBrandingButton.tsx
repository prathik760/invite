'use client'

import { useState } from 'react'
import { getRequiredPlan } from '@/lib/plans'
import { useLocalPrice } from '@/components/price/Price'
import { couponForCheckout } from '@/lib/useCoupon'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { supportWhatsAppUrl } from '@/lib/support'

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

/** The Razorpay checkout script, loaded once, on the first tap (the dashboard does not load it). */
function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SRC}"]`)
    const s = existing ?? document.createElement('script')
    s.addEventListener('load', () => resolve(true), { once: true })
    s.addEventListener('error', () => resolve(false), { once: true })
    if (!existing) {
      s.src = RAZORPAY_SRC
      s.async = true
      document.head.appendChild(s)
    }
  })
}

/**
 * "Remove branding" on an invitation published free (lib/freeInvites.ts): buys the design, the same
 * one-time purchase as publishing it paid. The server then takes the branding off every free
 * invitation of this account with this design, on the same links (unbrandDesign). An account that
 * already owns the design is never charged: the order is refused as ALREADY_OWNED and the branding
 * comes off all the same.
 */
export default function RemoveBrandingButton({
  templateId,
  designName,
  onDone,
  className = 'btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.9rem] font-semibold disabled:opacity-60',
}: {
  templateId: string
  designName: string
  onDone?: () => void
  className?: string
}) {
  const plan = getRequiredPlan(templateId)
  const price = useLocalPrice(plan.price).label
  const [state, setState] = useState<'idle' | 'paying' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [paymentId, setPaymentId] = useState('')

  async function start() {
    if (state === 'paying') return
    setState('paying')
    setMessage('')
    const code = couponForCheckout(plan.id, templateId)
    const ctx = { plan: plan.id, price: plan.price, currency: 'INR', coupon: code, template_id: templateId, template_name: designName, source: 'remove_branding' }
    trackEvent(seoEvents.checkoutStart, ctx)
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id, code, templateId }),
      })
      const order = (await res.json().catch(() => ({}))) as { orderId?: string; amount?: number; currency?: string; price?: number; keyId?: string; error?: string; code?: string; test?: boolean }
      if (res.status === 401) {
        window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        return
      }
      if (res.status === 409 && order.code === 'ALREADY_OWNED') {
        setState('done')
        onDone?.()
        return
      }
      if (!res.ok || !order.orderId) throw new Error(order.error ?? 'Could not start the payment. Please try again.')
      if (!(await loadRazorpay())) throw new Error('The payment window could not load. Check your connection and try again.')
      const rzp = new window.Razorpay({
        key: (order.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) as string,
        amount: order.amount as number,
        currency: order.currency ?? 'INR',
        name: 'ShareInvite',
        description: `${designName} (one-time): no branding`,
        order_id: order.orderId,
        theme: { color: '#123D2E' },
        handler: async (response: RazorpayResponse) => {
          try {
            const v = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, plan: plan.id }),
            })
            const body = (await v.json().catch(() => ({}))) as { success?: boolean; error?: string }
            if (v.ok && body.success) {
              // A test purchase at a token price is kept out of revenue reports, as in the builder.
              if (!order.test) trackEvent(seoEvents.purchase, { ...ctx, transaction_id: response.razorpay_payment_id, price: order.price ?? plan.price, value: order.price ?? plan.price, currency: order.currency ?? 'INR' })
              setState('done')
              onDone?.()
            } else {
              trackEvent(seoEvents.paymentFailed, { ...ctx, transaction_id: response.razorpay_payment_id })
              setPaymentId(response.razorpay_payment_id)
              setMessage(body.error ?? 'We could not confirm your payment with our server.')
              setState('error')
            }
          } catch {
            trackEvent(seoEvents.paymentFailed, { ...ctx, transaction_id: response.razorpay_payment_id })
            setPaymentId(response.razorpay_payment_id)
            setMessage('We could not reach our server to confirm your payment.')
            setState('error')
          }
        },
        modal: {
          ondismiss: () => {
            trackEvent(seoEvents.checkoutAbandon, ctx)
            setState('idle')
            setMessage('Payment cancelled. You have not been charged.')
          },
        },
      })
      rzp.open()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="rounded-2xl border border-emerald-soft/30 bg-emerald/[0.06] px-4 py-3 text-[0.86rem] font-semibold text-emerald">
        ✓ Branding removed. Guests see the clean invitation, on the same link.
      </p>
    )
  }
  return (
    <div>
      <button type="button" onClick={start} disabled={state === 'paying'} className={className}>
        {state === 'paying' ? 'Opening secure payment…' : `Remove branding · ${price}`}
      </button>
      {message && (
        <p role="alert" className="mt-2 text-[0.8rem] leading-5 text-[#A33A3A]">
          {message}
          {paymentId && (
            <>
              {' '}Payment ID {paymentId}.{' '}
              <a href={supportWhatsAppUrl(`Hi, I paid to remove branding (${designName}) and it did not go through. Payment ID ${paymentId}.`)} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                WhatsApp us
              </a>
            </>
          )}
        </p>
      )}
    </div>
  )
}
