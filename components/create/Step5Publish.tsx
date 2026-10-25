'use client'

import dynamic from 'next/dynamic'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import type { Session } from 'next-auth'
import type { TemplateData } from '@/modules/templates/data'
import { canAccess, getRequiredPlan, type PlanId } from '@/lib/plans'
import { supportWhatsAppUrl } from '@/lib/support'
import { OFFER_EDIT, OFFER_INCLUDES } from '@/lib/offer'
import { displayName } from '@/lib/catalog'
import { ArrowRightIcon, CheckIcon, PenIcon, ShieldIcon } from '@/components/ui/Icons'
import { TEMPLATE_VISUALS, DARK_TEMPLATES, is3DTemplate } from './templateVisuals'
import { useLocalPrice } from '@/components/price/Price'
import { discountedPrice, paymentMethods } from '@/lib/pricing'
import { useCoupon } from '@/lib/useCoupon'
import CouponField from './CouponField'
import PaymentProblem, { type PayError } from './PaymentProblem'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

interface Step5PublishProps {
  selectedTemplate: TemplateData
  data: Record<string, string>
  userPlan: PlanId
  session: Session | null
  loading: boolean
  error: string
  onBack: () => void
  onPublish: () => void
  /** Required fields still empty, and the step each is on. Checked before payment. */
  missing?: { label: string; step: number; key: string }[]
  /** Takes the host to that field on its step. */
  onFix?: (step: number, key: string) => void
  /** Razorpay is opening (the button here opens it directly; there is no second window). */
  paying?: boolean
  payError?: PayError | null
  onRetry?: () => void
  /** Changing a published invitation: nothing to pay, and the button saves to the same link. */
  editing?: boolean
}

export default function Step5Publish({
  selectedTemplate, data, userPlan, session, loading, error, onBack, onPublish, missing = [], onFix, editing = false,
  paying = false, payError = null, onRetry,
}: Step5PublishProps) {
  const isDark = DARK_TEMPLATES.has(selectedTemplate.id)
  const tv = TEMPLATE_VISUALS[selectedTemplate.id] ?? TEMPLATE_VISUALS['elegant-wedding']
  const requiredPlan = getRequiredPlan(selectedTemplate.id)
  const userHasAccess = canAccess(selectedTemplate.id, userPlan)
  const mustPay = !editing && !userHasAccess
  const name = displayName(selectedTemplate.name)
  const listPrice = useLocalPrice(requiredPlan.price)
  // After the visitor's discount code, when it covers this design (lib/coupons.ts).
  const coupon = useCoupon(requiredPlan.id, selectedTemplate.id).applied
  const local = coupon ? discountedPrice(listPrice, coupon.percentOff) : listPrice
  const price = local.label

  return (
    // overflow-x-clip: the preview's glow (-inset-12) reaches ~48px past a
    // phone-width screen and made the whole step scroll sideways. `clip`, not
    // `hidden`, so the summary card's md:sticky keeps working.
    <div className="flex-1 overflow-x-clip bg-champagne">
      <div
        className="shell grid grid-cols-1 gap-10 pb-10 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-start md:gap-12 md:pt-12"
        style={{ paddingBottom: 'calc(var(--bottom-dock-h, 0px) + 2.5rem)' }}
      >
        {/* ── Live preview ── */}
        <div className="relative flex flex-col items-center">
          <div className="mb-5 flex w-full max-w-sm items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Step 5 of 5</p>
              <h1 className="t-h3 mt-1">{editing ? 'Check your changes' : 'Your invitation is ready'}</h1>
            </div>
            <button type="button" onClick={onBack} className="btn-outline shrink-0 rounded-full px-4 py-2 text-[0.85rem] font-semibold">
              Edit details
            </button>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-12 rounded-full blur-3xl"
              style={{ background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.45' : '0.25'}), transparent 65%)` }}
            />
            <div className="relative" style={{ width: 'min(290px, calc(100vw - 3rem))' }}>
              <div className="rounded-[2.6rem] bg-charcoal p-[9px] shadow-[0_50px_90px_-30px_rgba(3,25,15,0.65)]">
                <div className="relative z-10 flex h-6 justify-center" style={{ marginBottom: '-24px' }}>
                  <div className="mt-2 h-5 w-20 rounded-full bg-charcoal" />
                </div>
                <div
                  className="relative overflow-hidden rounded-[2.1rem] bg-white"
                  style={{ height: 'min(590px, max(360px, calc(100dvh - 300px)))' }}
                >
                  <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                    <PreviewPane templateId={selectedTemplate.id} data={data} />
                  </div>
                  {/* Scroll hint — only for scrollable (2D) templates */}
                  {!is3DTemplate(selectedTemplate.id) && (
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
                      style={{ background: isDark ? 'linear-gradient(to top, rgba(6,6,14,0.9), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.92), transparent)' }}
                    >
                      <span
                        className="absolute inset-x-0 bottom-2 flex justify-center text-[8px] font-semibold"
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(30,39,38,0.45)' }}
                      >
                        scroll to explore
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center pb-0.5 pt-2">
                  <div className="h-1 w-20 rounded-full bg-paper/25" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-[0.85rem] text-muted">This is exactly what your guests will see.</p>
        </div>

        {/* ── Summary ── */}
        <aside className="card overflow-hidden md:sticky md:top-24" aria-label="Your design">
          <div className="flex items-center gap-4 border-b border-line p-6">
            <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-peach">
              <Image src={tv.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Your design</p>
              <p className="mt-0.5 truncate font-editorial text-[1.5rem] font-semibold leading-tight">{name}</p>
            </div>
            <div className="text-right">
              <p className="font-editorial text-[2rem] font-semibold leading-none">{editing ? 'Live' : mustPay ? price : 'Owned'}</p>
              <p className="mt-1 text-[0.72rem] text-muted">
                {editing ? 'same link' : !mustPay ? 'already yours' : coupon ? <><s>{listPrice.label}</s> · {coupon.code}</> : 'one-time'}
              </p>
            </div>
          </div>

          {mustPay && (
            <div className="border-b border-line px-6 py-3.5">
              <CouponField planId={requiredPlan.id} templateId={selectedTemplate.id} />
            </div>
          )}

          <div className="p-6">
            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-muted">Everything included</p>
            <ul className="mt-3 space-y-2.5">
              {/* The edit line sits beside the Pay button instead, with the refund and the human. */}
              {OFFER_INCLUDES.filter((line) => line !== OFFER_EDIT).map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[0.9rem] text-charcoal/85">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-soft" />
                  {line}
                </li>
              ))}
            </ul>

            {/* No plan badge. Pricing is per design, not per tier, so there is
                no "plan" to report and nothing to upgrade to — the price of the
                design they picked is already on the button. */}

            {missing.length > 0 && (
              <div className="mt-5 rounded-xl border border-burnished/30 bg-peach/70 px-4 py-3.5">
                <p className="text-[0.88rem] font-semibold text-charcoal">{editing ? 'Before you save, add:' : 'Before you publish, add:'}</p>
                <ul className="mt-2 space-y-1.5">
                  {missing.map((m) => (
                    <li key={m.label} className="flex items-center justify-between gap-3 text-[0.86rem] text-charcoal/85">
                      <span>{m.label.replace(/\s*\*$/, '')}</span>
                      {onFix && (
                        <button type="button" onClick={() => onFix(m.step, m.key)} className="link shrink-0 text-[0.82rem]">
                          Add it
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {payError && missing.length === 0 && (
              <div className="mt-5">
                <PaymentProblem
                  error={payError}
                  price={requiredPlan.price}
                  percentOff={coupon?.percentOff}
                  templateName={selectedTemplate.name}
                  onRetry={() => onRetry?.()}
                  retrying={paying}
                />
              </div>
            )}
            {error && missing.length === 0 && (
              <div role="alert" className="mt-5 rounded-xl border border-[#A33A3A]/20 bg-[#A33A3A]/[0.06] px-4 py-2.5 text-center text-[0.85rem] font-medium text-[#A33A3A]">
                {error}
              </div>
            )}

            {/* Primary CTA — desktop only. On mobile the identical action is
                docked to the bottom of the viewport by the create page, and
                rendering both produced two buttons for one action with the
                off-screen one carrying the price. */}
            {/* With details missing the button says so and takes the host to the first one; it used
                to stay "Pay & publish" and do nothing visible on a computer, so people pressed it again
                and again. */}
            <button
              type="button"
              onClick={missing.length > 0 && onFix ? () => onFix(missing[0].step, missing[0].key) : onPublish}
              disabled={loading || paying}
              className="btn-primary mt-6 hidden w-full items-center justify-center gap-2.5 rounded-full py-4 text-[1rem] font-semibold disabled:opacity-50 md:flex"
            >
              {loading || paying ? (
                <><Spinner />{paying ? 'Opening secure payment…' : editing ? 'Saving your changes…' : 'Creating your invitation…'}</>
              ) : missing.length > 0 ? (
                <>Add {missing.length} missing detail{missing.length === 1 ? '' : 's'}<ArrowRightIcon /></>
              ) : (
                <>
                  {editing ? 'Save changes' : mustPay ? `Pay ${price} & publish` : 'Publish & get my link'}
                  <ArrowRightIcon />
                </>
              )}
            </button>

            {/* Tell the user exactly what the next tap does: it opens the payment
                window, signed in or not (a signed-out buyer's purchase is kept on
                the account for the email they give Razorpay). This used to say
                "You'll sign in first" after sign-in stopped being needed, right
                above the payment window's own "No account needed". */}
            <p className="mt-3 text-center text-[0.8rem] leading-5 text-muted">
              {editing
                ? 'Your link stays the same. Guests see the changes the next time they open it.'
                : mustPay
                ? !session
                  ? 'No account needed: pay securely with Razorpay and your invitation publishes right after.'
                  : 'Secure one-time payment via Razorpay. Your invitation publishes right after.'
                : 'Publishes instantly. Share the link on WhatsApp.'}
            </p>

            {mustPay && (
              <ul className="mt-4 space-y-2 rounded-2xl border border-line bg-champagne/70 px-4 py-3.5 text-[0.84rem] text-charcoal/85">
                <li className="flex items-start gap-2.5">
                  <PenIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-soft" />
                  <span>{OFFER_EDIT}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-soft" />
                  <span>
                    <Link href="/refund-policy" target="_blank" className="link">7-day refund policy</Link>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[#128C4B]" fill="currentColor">
                    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z" />
                  </svg>
                  <a
                    href={supportWhatsAppUrl(`Hi, I have a question about the ${displayName(selectedTemplate.name)} design (${price}) before I pay.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#128C4B] underline-offset-4 hover:underline"
                  >
                    Talk to a human first
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Reassurance at the point of payment. All of this existed on the
              marketing pages and none of it was reachable from the one screen
              where the customer actually parts with money — /create does not
              even render the site footer. */}
          {mustPay && (
            <div className="border-t border-line bg-peach/50 px-6 py-4">
              <p className="flex items-center justify-center gap-1.5 text-[0.8rem] text-charcoal/75">
                <ShieldIcon className="h-4 w-4 text-emerald-soft" />
                Secured by Razorpay · {paymentMethods(local.currency)} · No subscription
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
