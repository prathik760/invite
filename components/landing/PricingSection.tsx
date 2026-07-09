'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/plans'
import { TEMPLATES } from '@/modules/templates/data'

// Incremental template names per plan (new ones added at each tier)
const PLAN_NEW_TEMPLATE_NAMES: Record<string, string[]> = {}
PLANS.forEach((plan, i) => {
  const prevIds = i > 0 ? PLANS[i - 1].templateIds : []
  const newIds = plan.templateIds.filter(id => !prevIds.includes(id))
  PLAN_NEW_TEMPLATE_NAMES[plan.id] = newIds
    .map(id => TEMPLATES.find(t => t.id === id)?.name.split('—')[0].trim() ?? id)
})

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function PricingSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handlePlanCTA(planId: string) {
    setError('')
    if (planId === 'free') {
      router.push('/create')
      return
    }

    if (!session?.user?.id) {
      signIn(undefined, { callbackUrl: '/#pricing' })
      return
    }

    setLoading(planId)
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok) {
        setError(order.error || 'Failed to create order. Please try again.')
        return
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'ShareInvite',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: order.orderId,
        prefill: {
          email: session.user.email || '',
          name: session.user.name || '',
        },
        theme: { color: '#B87924' },
        modal: {
          ondismiss: () => setLoading(null),
        },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, plan: planId }),
          })
          if (verifyRes.ok) {
            router.push('/create')
          } else {
            const err = await verifyRes.json()
            setError(err.error || 'Payment verification failed. Contact support.')
            setLoading(null)
          }
        },
      })
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="border-t border-border bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
            Transparent pricing
          </p>
          <h2 className="font-heading text-4xl text-ink sm:text-5xl">
            One-time pricing for a one-time celebration.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted">
            No monthly subscription for an event that happens once. Pay only for what you need.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => {
            const isFeatured = plan.highlighted
            const isLoading = loading === plan.id
            const isFree = plan.price === 0
            const ctaLabel = isFree
              ? 'Start for Free'
              : !session
              ? 'Sign in to Upgrade'
              : `Get ${plan.name}`

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  isFeatured
                    ? 'border-[#B87924] bg-[#221B17] text-white shadow-card-md'
                    : 'border-border bg-white text-foreground shadow-card'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)', color: '#fff' }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}
                {!isFeatured && (
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-strong">
                    {plan.badge}
                  </p>
                )}

                <h3 className={`font-heading text-2xl ${isFeatured ? 'text-white' : 'text-ink'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 font-heading text-4xl ${isFeatured ? 'text-white' : 'text-ink'}`}>
                  {plan.price === 0 ? '₹0' : `₹${plan.price.toLocaleString('en-IN')}`}
                </p>
                <p className={`mt-1 text-xs ${isFeatured ? 'text-white/55' : 'text-muted'}`}>
                  {isFree ? 'always free' : 'one-time payment'}
                </p>

                <p className={`mt-4 text-sm leading-6 ${isFeatured ? 'text-white/65' : 'text-muted'}`}>
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 ${isFeatured ? 'text-[#D9A441]' : 'text-accent-strong'}`}>
                        <CheckIcon />
                      </span>
                      <span className={`text-sm ${isFeatured ? 'text-white/80' : 'text-foreground'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Templates included in this tier */}
                <div className={`mt-5 flex-1 border-t pt-4 ${isFeatured ? 'border-white/10' : 'border-border'}`}>
                  <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${isFeatured ? 'text-white/40' : 'text-muted/70'}`}>
                    {isFree ? 'Template' : 'Templates unlocked'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PLAN_NEW_TEMPLATE_NAMES[plan.id]?.map(name => (
                      <span
                        key={name}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          isFeatured ? 'bg-white/10 text-white/70' : 'bg-[#F5EFE6] text-[#6B5344]'
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                    {!isFree && (
                      <span className={`text-[11px] ${isFeatured ? 'text-white/30' : 'text-muted/50'}`}>
                        + all lower plan templates
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handlePlanCTA(plan.id)}
                  disabled={isLoading}
                  className={`mt-8 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all disabled:opacity-60 ${
                    isFeatured
                      ? 'bg-white text-ink hover:bg-white/90'
                      : 'gold-button'
                  }`}
                >
                  {isLoading && <Spinner />}
                  {ctaLabel}
                </button>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Start free · Upgrade anytime · No hidden charges
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            {
              icon: (
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ),
              text: 'Razorpay secured',
            },
            {
              icon: (
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              ),
              text: 'UPI · Card · Net banking',
            },
            {
              icon: (
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ),
              text: 'No subscription',
            },
            {
              icon: (
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              text: 'Free plan always available',
            },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[12px] text-muted shadow-sm"
            >
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
