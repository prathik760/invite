'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Session } from 'next-auth'
import type { TemplateData } from '@/modules/templates/data'
import { canAccess, getRequiredPlan, type PlanId } from '@/lib/plans'
import { supportWhatsAppUrl } from '@/lib/support'
import { TEMPLATE_VISUALS, DARK_TEMPLATES, is3DTemplate } from './templateVisuals'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
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
}

export default function Step5Publish({
  selectedTemplate, data, userPlan, session, loading, error, onBack, onPublish,
}: Step5PublishProps) {
  const isDark = DARK_TEMPLATES.has(selectedTemplate.id)
  const tv = TEMPLATE_VISUALS[selectedTemplate.id] ?? TEMPLATE_VISUALS['elegant-wedding']
  const requiredPlan = getRequiredPlan(selectedTemplate.id)
  const userHasAccess = canAccess(selectedTemplate.id, userPlan)
  const mustPay = !userHasAccess

  return (
    <div
      className="flex-1 flex flex-col"
      style={{
        background: isDark
          ? `radial-gradient(ellipse 90% 65% at 50% -5%, rgba(${tv.rgb},0.40) 0%, transparent 55%), #06060E`
          : `radial-gradient(ellipse 90% 60% at 50% -5%, rgba(${tv.rgb},0.20) 0%, transparent 60%), linear-gradient(175deg,#FFF9F2 0%,#F5EDE2 100%)`,
      }}
    >
      {/* Preview top bar */}
      <div
        className="sticky top-0 z-10 px-5 py-3 flex items-center justify-between backdrop-blur-xl shrink-0"
        style={{
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(44,32,28,0.07)',
          background: isDark ? 'rgba(6,6,14,0.86)' : 'rgba(255,249,242,0.86)',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: tv.color }} />
          <p className="text-xs font-semibold truncate" style={{ color: isDark ? 'rgba(255,255,255,0.80)' : '#221B17' }}>
            {selectedTemplate.name.split('—')[0].trim()}
          </p>
          <span
            className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(44,32,28,0.05)',
              color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(44,32,28,0.38)',
            }}
          >
            Step 5 of 5
          </span>
        </div>
        <button
          onClick={onBack}
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,32,28,0.06)',
            color: isDark ? 'rgba(255,255,255,0.65)' : '#706861',
          }}
        >
          ← Edit
        </button>
      </div>

      {/* Phone mockup + CTA */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-8 px-4">
        <div className="relative">
          {/* Ambient glow */}
          <div
            className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.60' : '0.28'}), transparent 65%)`,
              opacity: isDark ? 0.75 : 0.65,
            }}
          />

          {/* iPhone shell */}
          <div className="relative" style={{ width: 'min(288px, calc(100vw - 3rem))' }}>
            <div style={{
              borderRadius: 'clamp(30px, 12%, 44px)',
              background: '#1C1C1E',
              padding: '10px',
              boxShadow: isDark
                ? '0 60px 120px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.09)'
                : '0 48px 96px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.10)',
            }}>
              {/* Dynamic island */}
              <div className="flex justify-center" style={{ height: '28px', marginBottom: '-28px', position: 'relative', zIndex: 10 }}>
                <div style={{ marginTop: '8px', width: '88px', height: '22px', background: '#1C1C1E', borderRadius: '11px' }} />
              </div>

              {/* Screen */}
              <div
                className="overflow-hidden relative bg-white"
                style={{ borderRadius: 'clamp(22px, 10%, 36px)', height: 'min(590px, max(360px, calc(100dvh - 300px)))' }}
              >
                <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                  <PreviewPane templateId={selectedTemplate.id} data={data} />
                </div>
                {/* Scroll hint — only for scrollable (2D) templates */}
                {!is3DTemplate(selectedTemplate.id) && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
                    style={{ background: isDark ? 'linear-gradient(to top, rgba(6,6,14,0.90), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.92), transparent)' }}
                  >
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <span className="flex items-center gap-1 text-[8px] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(44,32,28,0.38)' }}>
                        <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        scroll to explore
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Home indicator */}
              <div className="flex justify-center" style={{ paddingTop: '8px', paddingBottom: '2px' }}>
                <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.22)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Plan badge + CTA. The bottom padding on mobile clears the docked
            CTA bar, whose real height is published as --bottom-dock-h. */}
        <div
          className="w-full max-w-xs mt-8 flex flex-col items-center gap-3"
          style={{ paddingBottom: 'calc(var(--bottom-dock-h, 0px) + 1rem)' }}
        >

          {/* No plan badge. Pricing is per template, not per tier, so there is
              no "plan" to report and nothing to upgrade to — the price of the
              design they picked is already on the button. */}

          {/* No branding warning: every template is a paid publish, so no new
              invitation carries the "Made with ShareInvite" banner. */}

          {/* Error */}
          {error && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Primary CTA — desktop only. On mobile the identical action is
              docked to the bottom of the viewport by the create page, and
              rendering both produced two buttons for one action with the
              off-screen one carrying the price. */}
          <button
            onClick={onPublish}
            disabled={loading}
            className="gold-button hidden w-full md:flex items-center justify-center gap-2.5 rounded-2xl py-4 font-bold disabled:opacity-50"
            style={{ fontSize: '15px', letterSpacing: '0.01em' }}
          >
            {loading ? (
              <><Spinner />Creating your invitation…</>
            ) : (
              <>
                {mustPay ? `Continue to payment — ₹${requiredPlan.price.toLocaleString('en-IN')}` : 'Get my invitation link'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>

          {/* Tell the user exactly what the next tap does. The old copy said
              "No account needed" while the button in fact opened a sign-in
              modal — the single most common reason to abandon at step 5.
              A logged-out user on a paid template meets the sign-in step first,
              so say so rather than promising the payment sheet. */}
          <p className="hidden md:block text-center text-[11px] leading-4" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(44,32,28,0.42)' }}>
            {!session
              ? 'You’ll sign in first, so your invitation and payment stay linked to your account'
              : mustPay
                ? 'Secure one-time payment via Razorpay · Your invitation publishes right after'
                : 'Publishes instantly · Share the link on WhatsApp'}
          </p>

          {/* Reassurance at the point of payment. All of this existed on the
              marketing pages and none of it was reachable from the one screen
              where the customer actually parts with money — /create does not
              even render the site footer. */}
          {mustPay && (
            <div className="hidden md:block w-full pt-1">
              <div
                className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px]"
                style={{ color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(44,32,28,0.48)' }}
              >
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3 w-3" style={{ color: '#2F766D' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  UPI · Card · Net banking
                </span>
                <span aria-hidden>·</span>
                <span>No subscription</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px]">
                <Link href="/refund-policy" target="_blank" className="font-semibold underline-offset-2 hover:underline" style={{ color: '#B87924' }}>
                  7-day refund policy
                </Link>
                <span aria-hidden style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(44,32,28,0.3)' }}>·</span>
                <a
                  href={supportWhatsAppUrl(`Hi, I have a question about the ${selectedTemplate.name} template (₹${requiredPlan.price}) before I pay.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'rgb(22,163,74)' }}
                >
                  Talk to a human first
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
