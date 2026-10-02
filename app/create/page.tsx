'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/modules/templates/data'
import { PLANS, canAccess, getRequiredPlan, type PlanId } from '@/lib/plans'
import ShareBar from '@/components/ui/ShareBar'
import { CREATE_STEPS, seoEvents, trackEvent } from '@/lib/analytics'
import BottomDock from '@/components/ui/BottomDock'
import PaymentProblem, { type PayError } from '@/components/create/PaymentProblem'
import { supportWhatsAppUrl } from '@/lib/support'
import { carryOverDetails } from '@/lib/carryOver'

import StepProgress from '@/components/create/StepProgress'
import Step1Templates from '@/components/create/Step1Templates'
import Step2Names from '@/components/create/Step2Names'
import Step3Details from '@/components/create/Step3Details'
import Step4Enrich from '@/components/create/Step4Enrich'
import Step5Publish from '@/components/create/Step5Publish'
import MobilePreviewStrip from '@/components/create/MobilePreviewStrip'
import { TEMPLATE_VISUALS, DARK_TEMPLATES, is3DTemplate } from '@/components/create/templateVisuals'
import Logo, { LogoMark } from '@/components/brand/Logo'
import { CheckIcon, ShieldIcon } from '@/components/ui/Icons'
import { OFFER_INCLUDES } from '@/lib/offer'
import { useBackToClose } from '@/lib/useBackToClose'
import { useLocalPrice } from '@/components/price/Price'
import { paymentMethods } from '@/lib/pricing'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const DRAFT_KEY = 'invitely-draft'

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── Shared modal frame ────────────────────────────────────────────────────────
function ModalFrame({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-end justify-center px-3 sm:items-center sm:px-4"
      style={{ background: 'rgba(3,25,15,0.62)', backdropFilter: 'blur(14px)', zIndex: 'var(--z-overlay)' as unknown as number }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog" aria-modal="true" aria-label={label}>
      <motion.div initial={{ y: 28, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 28, opacity: 0, scale: 0.98 }} transition={{ duration: 0.35, ease: BEZIER }}
        className="card relative w-full max-w-md overflow-y-auto rounded-b-none p-6 sm:rounded-3xl sm:p-8"
        style={{
          // Without a cap the card overflows the viewport on short screens
          // (landscape phones, small laptops) and the pay button is unreachable.
          maxHeight: 'calc(100dvh - 1rem)',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
        }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-peach hover:text-charcoal"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Login prompt modal ────────────────────────────────────────────────────────
function LoginPromptModal({ onClose, onContinueAsGuest }: { onClose: () => void; onContinueAsGuest: () => void }) {
  return (
    <ModalFrame onClose={onClose} label="Sign in to publish">
      <LogoMark className="h-12 w-12" />
      <p className="eyebrow mt-5">Almost there</p>
      <h2 className="t-h2 mt-2">Sign in to publish</h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-charcoal/70">
        Your design and details are saved. An account keeps your invitation, your purchase and your guests&apos; wishes together.
      </p>
      <div className="mt-7 space-y-2.5">
        <Link href="/auth/login?callbackUrl=/create"
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.95rem] font-semibold">
          Sign in to my account
        </Link>
        <Link href="/auth/signup?callbackUrl=/create"
          className="btn-outline flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.95rem] font-semibold">
          Create an account
        </Link>
      </div>
      <div className="mt-5 border-t border-line pt-4 text-center">
        <button type="button" onClick={onContinueAsGuest} className="text-[0.82rem] text-muted underline-offset-4 transition-colors hover:text-charcoal hover:underline">
          Continue without an account — the invitation won&apos;t be saved to a dashboard
        </button>
      </div>
    </ModalFrame>
  )
}

// ─── Checkout modal ─────────────────────────────────────────────────────────────
// Named UpgradeModal historically; it sells exactly one design. No plan, tier or
// upgrade language reaches the customer.
function UpgradeModal({
  templateId, templateName, requiredPlan, isLoggedIn, onClose, onPay, paying, payError,
}: {
  templateId: string
  templateName: string
  requiredPlan: typeof PLANS[number]
  isLoggedIn: boolean
  onClose: () => void
  onPay: (planId: PlanId) => void
  paying: boolean
  payError: PayError | null
}) {
  const visual = TEMPLATE_VISUALS[templateId] ?? TEMPLATE_VISUALS['elegant-wedding']
  const local = useLocalPrice(requiredPlan.price)
  const price = local.label
  return (
    <ModalFrame onClose={onClose} label={`Get the ${templateName} design`}>
      <p className="eyebrow">One design · one price</p>
      <div className="mt-4 flex items-center gap-4">
        <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-peach shadow-soft">
          <Image src={visual.image} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="t-h3 truncate">{templateName.split('—')[0].trim()}</h2>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-editorial text-[2.2rem] font-semibold leading-none">{price}</span>
            <span className="text-[0.85rem] text-muted">one-time</span>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-champagne p-4">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-muted">Everything included</p>
        <ul className="mt-3 space-y-2">
          {OFFER_INCLUDES.map(f => (
            <li key={f} className="flex items-start gap-2 text-[0.86rem] text-charcoal/85">
              <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-soft" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {payError && (
        <div className="mt-5">
          <PaymentProblem
            error={payError}
            price={requiredPlan.price}
            templateName={templateName}
            onRetry={() => onPay(requiredPlan.id)}
            retrying={paying}
          />
        </div>
      )}

      <div className="mt-6">
        {!isLoggedIn ? (
          <div className="space-y-2">
            <Link href="/auth/login?callbackUrl=/create"
              className="btn-primary flex w-full items-center justify-center rounded-full py-4 text-[0.95rem] font-semibold">
              Sign in to get this design
            </Link>
            <p className="text-center text-[0.82rem] text-muted">
              New here?{' '}
              <Link href="/auth/signup?callbackUrl=/create" className="link">Create an account</Link>
            </p>
          </div>
        ) : (
          <button type="button" onClick={() => onPay(requiredPlan.id)} disabled={paying}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-[1rem] font-semibold disabled:opacity-60">
            {paying && <Spinner />}
            {paying ? 'Opening secure payment…' : `Pay ${price} — one time`}
          </button>
        )}
      </div>

      {/* Trust row. This modal is the moment of decision and until now it
          offered no refund policy, no support route and no payment marks —
          all of which exist elsewhere on the site but not where they count. */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.78rem] text-muted">
          <ShieldIcon className="h-3.5 w-3.5 text-emerald-soft" />
          Secured by Razorpay
          <span aria-hidden>·</span> {paymentMethods(local.currency)}
          <span aria-hidden>·</span> No subscription
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.8rem]">
          <Link href="/refund-policy" target="_blank" className="link">7-day refund policy</Link>
          <span className="text-muted" aria-hidden>·</span>
          <a
            href={supportWhatsAppUrl(`Hi, I have a question about the ${templateName} design (${price}) before I pay.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#128C4B] underline-offset-4 hover:underline"
          >
            Question? Chat with us
          </a>
        </p>
      </div>

      <button type="button" onClick={onClose} className="mt-3 w-full py-2.5 text-[0.88rem] text-muted transition-colors hover:text-charcoal">
        Maybe later
      </button>
    </ModalFrame>
  )
}

// ─── Success link with copy feedback ───────────────────────────────────────────
function SuccessLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-champagne p-2 pl-4">
      <span className="min-w-0 flex-1 truncate text-[0.85rem] text-charcoal/75">{url}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }).catch(() => {})
        }}
        className="btn-primary shrink-0 rounded-full px-4 py-2 text-[0.8rem] font-semibold"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CreatePage() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [previewOpen, setPreviewOpen] = useState(false)  // mobile full-screen live preview
  // Which preview is on screen. Each layout's preview used to stay mounted but
  // hidden at the other size, so phones rendered the design two or three times
  // while the host typed, and designs whose SVG art uses ids resolved them into
  // the hidden copy and lost their gradients. Only the visible one is mounted.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)')
    const on = () => setIsDesktop(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id)
  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) ?? TEMPLATES[0]
  const [data, setData] = useState<Record<string, string>>(selectedTemplate.config.defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<PlanId>('free')
  const [upgradeTarget, setUpgradeTarget] = useState<{ templateId: string; templateName: string } | null>(null)
  const [paying, setPaying] = useState(false)
  // Payment problems used to surface as browser alert() dialogs — including
  // after the customer's money had already left their account. This holds a
  // structured error so the UI can show the payment reference, a retry and a
  // route to a human instead.
  const [payError, setPayError] = useState<PayError | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [savedToast, setSavedToast] = useState(false)
  // Blocks the autosave effect until the stored draft has been read back, so
  // the default form values cannot clobber it on first paint.
  const [draftLoaded, setDraftLoaded] = useState(false)

  // Pre-select template from URL param, skip straight to Step 2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tplParam = params.get('template')
    const tpl = tplParam ? TEMPLATES.find(t => t.id === tplParam) : undefined
    if (tpl) {
      setSelectedId(tpl.id)
      // `message` arrives from the wording pages ("send these words as an
      // invitation"): the copied words become the design's personal message.
      const message = (params.get('message') ?? '').trim().slice(0, 600)
      const hasMessageField = tpl.config.fields.some((f) => f.key === 'message')
      setData(message && hasMessageField ? { ...tpl.config.defaultData, message } : tpl.config.defaultData)
      setCurrentStep(2)
    }
    // Fires once per arrival at the builder. Previously nothing was recorded
    // until the user *changed* template, so every visitor who landed on /create
    // with a pre-selected template was invisible in the funnel.
    const entry = tpl ?? TEMPLATES[0]
    trackEvent(seoEvents.createStart, {
      template_id: entry.id,
      template_name: entry.name,
      template_category: entry.category,
      price: getRequiredPlan(entry.id).price,
      entry_point: tpl ? 'deep_link' : 'gallery',
      source: params.get('src') ?? undefined,
    })
  }, [])

  // Fetch real user plan once signed in
  useEffect(() => {
    if (!session) return
    fetch('/api/user/subscription')
      .then(r => r.json())
      .then((body: { plan: PlanId }) => { if (body.plan) setUserPlan(body.plan) })
      .catch(() => { })
  }, [session])

  /**
   * Restore a draft on arrival — from any earlier visit, not just a sign-in.
   *
   * The builder used to write the draft in exactly one place (the publish click
   * of a signed-out user) into sessionStorage, which dies with the tab. So the
   * "Sign in to save your progress" prompt at step 2 lost everything the moment
   * it was obeyed, and the "Progress saved automatically" toast on every step
   * was simply false. Both now describe what actually happens.
   */
  useEffect(() => {
    // A ?template= deep link is an explicit request for that design, so it wins
    // over whatever was left in storage.
    if (new URLSearchParams(window.location.search).get('template')) { setDraftLoaded(true); return }
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const draft = JSON.parse(raw) as { templateId: string; data: Record<string, string>; step?: number }
        const tpl = TEMPLATES.find(t => t.id === draft.templateId)
        if (tpl && draft.data) {
          setSelectedId(draft.templateId)
          setData(draft.data)
          setCurrentStep(Math.min(Math.max(draft.step ?? 2, 1), 4))
        }
      }
    } catch { /* private mode or corrupt payload — start clean */ }
    setDraftLoaded(true)
  }, [])

  /**
   * Persist on every edit. Guarded by `draftLoaded` so the initial render's
   * default data cannot overwrite a stored draft before it has been read back.
   */
  useEffect(() => {
    if (!draftLoaded || createdSlug) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ templateId: selectedId, data, step: currentStep }))
    } catch { /* quota or private mode — autosave is best-effort */ }
  }, [draftLoaded, selectedId, data, currentStep, createdSlug])

  const handleTemplateChange = useCallback((id: string) => {
    // Re-selecting the current design used to reset it to sample data, wiping
    // everything typed so far on a single stray tap.
    if (id === selectedId) return
    const tpl = TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
    const prev = TEMPLATES.find(t => t.id === selectedId)
    setSelectedId(id)
    // Keep what the user typed (names, date, venue…) wherever the new design
    // has the same kind of field, so designs can be compared with real details.
    setData(carryOverDetails(prev, data, tpl))
    setError('')
    trackEvent(seoEvents.templateView, {
      template_id: tpl.id,
      template_name: tpl.name,
      template_category: tpl.category,
    })
  }, [selectedId, data])

  /**
   * Put the user at the top of the step they just moved to.
   *
   * Both surfaces have to be reset: the window (steps 1 and 5 scroll the page)
   * and the form panel (steps 2-4 scroll inside an aside). Deferred to the next
   * frame so the incoming step has rendered before we scroll it — resetting the
   * old step's scroll position is what made this look like it did nothing.
   */
  const scrollToStepTop = () => {
    requestAnimationFrame(() => {
      formPanelRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  // ── Phone Back moves through the steps ─────────────────────────────────
  // Each forward step pushes a history entry for the same URL (a copy of the
  // router's state), so Back returns to the previous step instead of leaving
  // the builder. `stepStack` mirrors the entries this visit pushed; `baseStep`
  // is the step shown on the entry beneath them.
  const stepStack = useRef<number[]>([])
  const baseStep = useRef(1)
  const pendingStep = useRef<number | null>(null)
  const currentStepRef = useRef(currentStep)
  currentStepRef.current = currentStep
  useEffect(() => {
    const onPop = () => {
      const state = window.history.state
      if (state?.__siOverlay) return
      let target: number
      if (pendingStep.current !== null) {
        target = pendingStep.current
        pendingStep.current = null
        baseStep.current = target
      } else if (typeof state?.__siStep === 'number') {
        target = state.__siStep
      } else {
        target = stepStack.current.length ? baseStep.current : currentStepRef.current
      }
      while (stepStack.current.length && stepStack.current[stepStack.current.length - 1] > target) stepStack.current.pop()
      if (target === currentStepRef.current) return
      setCurrentStep(target)
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // The full-screen phone preview closes on Back, too.
  useBackToClose(previewOpen, () => setPreviewOpen(false))

  const goToStep = (step: number) => {
    // Only a forward move completes the step you were on. Going Back must not
    // record a completion, or the funnel inflates every time someone edits.
    if (step < currentStep) {
      // Unwind the entries for the steps being left, so Back and the on-page
      // Back button stay in step; the popstate handler shows the step.
      const above = stepStack.current.filter((s) => s > step).length
      if (above > 0) {
        if (step < baseStep.current || stepStack.current.length === above) pendingStep.current = step
        window.history.go(-above)
        return
      }
    }
    if (step > currentStep) {
      if (stepStack.current.length === 0) baseStep.current = currentStep
      stepStack.current.push(step)
      window.history.pushState({ ...window.history.state, __siStep: step }, '')

      trackEvent(seoEvents.createStepComplete, {
        step: currentStep,
        step_name: CREATE_STEPS[currentStep],
        template_id: selectedId,
        template_name: selectedTemplate.name,
        price: getRequiredPlan(selectedId).price,
      })
    }
    setCurrentStep(step)
    scrollToStepTop()
    if (step > 1) {
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 2200)
    }
  }

  const doCreate = async () => {
    const required = selectedTemplate.config.fields.filter(f => f.required)
    const missing = required.filter(f => !data[f.key]?.trim())
    if (missing.length > 0) { setError(`Please fill in: ${missing.map(f => f.label).join(', ')}`); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplate.id, data }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string; code?: string }
        // Server-side entitlement check rejected this — open the paywall rather
        // than showing a dead-end error message.
        if (res.status === 402 || body.code === 'PAYMENT_REQUIRED') {
          setLoading(false)
          openPaywall()
          return
        }
        throw new Error(body.error || 'Failed to create invitation')
      }
      const { slug } = await res.json() as { slug: string }
      // Published — drop the draft so the next visit starts clean instead of
      // reopening an invitation that already exists.
      try { localStorage.removeItem(DRAFT_KEY) } catch { }
      setCreatedSlug(slug)
      trackEvent(seoEvents.inviteCreation, {
        template_id: selectedTemplate.id,
        template_name: selectedTemplate.name,
        template_category: selectedTemplate.category,
        price: getRequiredPlan(selectedTemplate.id).price,
        signed_in: !!session,
        invite_slug: slug,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally { setLoading(false) }
  }

  const openMobilePreview = () => {
    trackEvent(seoEvents.previewOpen, {
      template_id: selectedId,
      template_name: selectedTemplate.name,
      step: currentStep,
      step_name: CREATE_STEPS[currentStep],
    })
    setPreviewOpen(true)
  }

  const requiredPlanForSelected = getRequiredPlan(selectedId)
  const selectedPrice = useLocalPrice(requiredPlanForSelected.price)
  const needsPayment = !canAccess(selectedId, userPlan)

  const openPaywall = () => {
    trackEvent(seoEvents.paywallView, {
      template_id: selectedId,
      template_name: selectedTemplate.name,
      plan: requiredPlanForSelected.id,
      price: requiredPlanForSelected.price,
    })
    setPayError(null)
    setUpgradeTarget({ templateId: selectedId, templateName: selectedTemplate.name })
  }

  const handleCreate = () => {
    trackEvent(seoEvents.publishClick, {
      template_id: selectedId,
      template_name: selectedTemplate.name,
      price: requiredPlanForSelected.price,
      requires_payment: needsPayment,
      signed_in: !!session,
    })

    if (!session) {
      // No explicit save needed — the autosave effect above has already stored
      // this draft, and it survives the round trip through sign-in.
      trackEvent(seoEvents.signupStart, { trigger: 'publish', template_id: selectedId })
      setShowLoginPrompt(true)
      return
    }
    // Was `getRequiredPlan(selectedId).price > 0`, which ignored what the user
    // had already bought — a paying customer was shown the upgrade modal again
    // on every publish and could never use the template they owned.
    if (needsPayment) {
      openPaywall()
      return
    }
    doCreate()
  }

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false)
    // Every template is a purchase now, so a guest can never publish: the
    // account is what the purchase attaches to, and the API rejects the request
    // regardless. Send them to the paywall rather than into a failed create.
    openPaywall()
  }

  // The steps 2-4 form lives in its own `overflow-y-auto` panel, so
  // `window.scrollTo` never moved it: pressing Continue after scrolling down
  // swapped the fields but left the panel where it was, dropping the user into
  // the middle of the next step with no idea which step they were on.
  const formPanelRef = useRef<HTMLElement>(null)

  const payRef = useRef<boolean>(false)
  const handleUpgradePayment = useCallback(async (planId: PlanId) => {
    if (payRef.current) return
    payRef.current = true; setPaying(true); setPayError(null)
    const plan = PLANS.find(p => p.id === planId)
    const ctx = {
      plan: planId,
      plan_name: plan?.name,
      price: plan?.price,
      currency: 'INR',
      template_id: upgradeTarget?.templateId,
      template_name: upgradeTarget?.templateName,
    }
    trackEvent(seoEvents.checkoutStart, ctx)
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      // `price` is in whole units of `currency` — the visitor's own price (lib/pricing.ts).
      const order = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; price?: number; keyId?: string; error?: string }
      if (!orderRes.ok || !order.orderId) throw new Error(order.error ?? 'Could not start the payment. Please try again.')
      const options: RazorpayOptions = {
        key: (order.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) as string,
        amount: order.amount as number,
        currency: order.currency ?? 'INR',
        name: 'ShareInvite',
        // Shown inside the Razorpay sheet. Naming the template the customer
        // actually chose beats a tier name they never asked for and would not
        // recognise on their bank statement.
        description: `${upgradeTarget?.templateName ?? 'Invitation template'} — one-time`,
        order_id: order.orderId as string,
        prefill: { email: session?.user?.email ?? undefined, name: session?.user?.name ?? undefined },
        theme: { color: '#0B4A34' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verRes = await fetch('/api/payments/verify', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, plan: planId }),
            })
            const verBody = await verRes.json() as { success?: boolean; error?: string; plan?: PlanId }
            if (verRes.ok && verBody.success) {
              // Fires only after the server verified the Razorpay signature and
              // amount — never on opening or dismissing the checkout sheet.
              // `currency` is required: GA4 drops `value` from revenue reports
              // without it, and a Meta Pixel Purchase needs it to optimise ads.
              // `value` must be in the order's currency: a US$9 sale is 9, not 299.
              trackEvent(seoEvents.purchase, { ...ctx, transaction_id: response.razorpay_payment_id, price: order.price ?? plan?.price, value: order.price ?? plan?.price, currency: order.currency ?? 'INR' })
              // Reflect the new entitlement immediately so the publish path does
              // not bounce the user back to the paywall they just paid at.
              setUserPlan(verBody.plan ?? planId)
              setUpgradeTarget(null)
              setTimeout(() => doCreate(), 300)
            } else {
              // The worst case in the whole flow: Razorpay may have taken the
              // money but we could not confirm it. Never a bare alert here —
              // the customer needs the payment reference and a way to reach us.
              trackEvent(seoEvents.paymentFailed, { ...ctx, transaction_id: response.razorpay_payment_id })
              setPayError({
                kind: 'verification',
                message: verBody.error ?? 'We could not confirm your payment with our server.',
                paymentId: response.razorpay_payment_id,
              })
            }
          } catch {
            trackEvent(seoEvents.paymentFailed, { ...ctx, transaction_id: response.razorpay_payment_id })
            setPayError({
              kind: 'verification',
              message: 'We could not reach our server to confirm your payment.',
              paymentId: response.razorpay_payment_id,
            })
          } finally { setPaying(false); payRef.current = false }
        },
        modal: {
          ondismiss: () => {
            // Closing the sheet is not an error — no scary message, just an
            // honest note that nothing was charged, plus a way back in.
            trackEvent(seoEvents.checkoutAbandon, ctx)
            setPayError({ kind: 'cancelled', message: 'Payment was cancelled — you have not been charged.' })
            setPaying(false); payRef.current = false
          },
        },
      }
      if (typeof window !== 'undefined' && window.Razorpay) {
        new window.Razorpay(options).open()
      } else {
        trackEvent(seoEvents.checkoutError, { ...ctx, reason: 'script_not_loaded' })
        setPayError({ kind: 'setup', message: 'The secure payment window is still loading. Please try again in a moment.' })
        setPaying(false); payRef.current = false
      }
    } catch (e) {
      trackEvent(seoEvents.checkoutError, { ...ctx, reason: 'order_failed' })
      setPayError({ kind: 'setup', message: e instanceof Error ? e.message : 'We could not start the payment. Please try again.' })
      setPaying(false); payRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, upgradeTarget])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
  const shareUrl = createdSlug ? `${appUrl}/e/${createdSlug}` : ''
  const d = data
  const names =
    d.brideName && d.groomName ? `${d.brideName} & ${d.groomName}` :
      d.partner1Name && d.partner2Name ? `${d.partner1Name} & ${d.partner2Name}` :
        d.coupleNames || d.celebrantName || d.hostNames || d.babyName || undefined

  const isDark = DARK_TEMPLATES.has(selectedId)
  const tv = TEMPLATE_VISUALS[selectedId] ?? TEMPLATE_VISUALS['elegant-wedding']
  const upgradeRequiredPlan = upgradeTarget ? getRequiredPlan(upgradeTarget.templateId) : null

  const isSplitStep = currentStep === 2 || currentStep === 3 || currentStep === 4

  return (
    <div className="min-h-screen bg-champagne flex flex-col text-foreground">

      {/* Gold accent bar */}
      <div
        className="sticky top-0 h-[3px] shrink-0 bg-gradient-to-r from-emerald via-burnished to-gold-soft"
        style={{ zIndex: 'var(--z-sticky-header)' as unknown as number }}
      />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-[3px] z-40 h-14 sm:h-16 border-b border-line bg-champagne/95 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Logo markClassName="h-8 w-8" className="[&>span:last-child]:text-[1.35rem] sm:[&>span:last-child]:text-[1.55rem]" />
          </Link>
          {!createdSlug && (
            <div className="hidden sm:block">
              <StepProgress currentStep={currentStep} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {session ? (
            <Link href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted border border-line hover:border-[#A47945]/40 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted border border-line hover:border-[#A47945]/40 transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ─── Step 1: Full-width template gallery ─────────────────────────── */}
      {currentStep === 1 && (
        <Step1Templates
          selectedId={selectedId}
          onSelect={handleTemplateChange}
          onContinue={() => goToStep(2)}
        />
      )}

      {/* ─── Steps 2-4: Split-panel (form left, preview right) ──────────── */}
      {isSplitStep && (
        <div className="flex-1 flex flex-col md:flex-row min-h-0">

          {/* LEFT: Form panel — extra bottom padding on mobile so its last content
              (the "See the full design" button) clears the fixed bottom nav bar. */}
          <aside
            ref={formPanelRef}
            className="w-full md:w-[380px] lg:w-[440px] xl:w-[480px] shrink-0 md:border-r border-line overflow-y-auto scrollbar-hide md:pb-0"
            style={{
              background: '#FFFAF4',
              // dvh, not vh: on mobile Safari `100vh` is the *expanded* viewport,
              // so the panel ran taller than the visible area and its last field
              // sat under the browser chrome.
              maxHeight: 'calc(100dvh - 67px)',
              // Clears the docked nav bar, whose real height is published by it.
              paddingBottom: 'calc(var(--bottom-dock-h, 0px) + 1.5rem)',
            }}
          >
            {/* Now editing — with one-tap access back to the design picker, so
                trying another design (details carry over) is always one step away. */}
            <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2.5 shadow-soft sm:mx-5 md:mx-0 md:mt-0 md:rounded-none md:border-x-0 md:border-t-0 md:px-5 md:py-3 md:shadow-none">
              <span className="relative h-11 w-9 shrink-0 overflow-hidden rounded-lg border border-line bg-peach">
                <Image src={tv.image} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-soft">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-soft" /> Editing live
                </p>
                <p className="truncate font-editorial text-[1.15rem] font-semibold leading-tight text-charcoal">{selectedTemplate.name.split('—')[0].trim()}</p>
              </div>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="btn-outline shrink-0 rounded-full px-3.5 py-2 text-[0.78rem] font-semibold"
              >
                Change design
              </button>
            </div>

            {/* Step content */}
            {currentStep === 2 && (
              <Step2Names
                selectedTemplate={selectedTemplate}
                data={data}
                onChange={setData}
                session={session}
                onBack={() => goToStep(1)}
                onContinue={() => goToStep(3)}
              />
            )}
            {currentStep === 3 && (
              <Step3Details
                selectedTemplate={selectedTemplate}
                data={data}
                onChange={setData}
                onBack={() => goToStep(2)}
                onContinue={() => goToStep(4)}
              />
            )}
            {currentStep === 4 && (
              <Step4Enrich
                selectedTemplate={selectedTemplate}
                data={data}
                onChange={setData}
                onBack={() => goToStep(3)}
                onContinue={() => goToStep(5)}
              />
            )}

            {/* Mobile: inline mini-preview — tap to open the full live preview.
                (role="button", not <button>, because the mini-preview contains its
                own buttons — nested <button> is invalid HTML.) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => openMobilePreview()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMobilePreview() } }}
              className="block w-full cursor-pointer md:hidden"
              aria-label="Open full-screen preview of your invitation"
            >
              {isDesktop === false && !previewOpen && (
                <MobilePreviewStrip
                  templateId={selectedId}
                  data={data}
                  isDark={isDark}
                  color={tv.color}
                />
              )}
              <span className="btn-primary mx-4 mb-6 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                See the full design
              </span>
            </div>
          </aside>

          {/* RIGHT: Live preview — desktop only */}
          <section
            className="hidden md:flex md:flex-col flex-1 overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: 'calc(100dvh - 67px)',
              background: isDark
                ? `radial-gradient(ellipse 90% 65% at 50% -5%, rgba(${tv.rgb},0.40) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 90%, rgba(${tv.rgb},0.14) 0%, transparent 55%), #06060E`
                : `radial-gradient(ellipse 90% 60% at 50% -5%, rgba(${tv.rgb},0.20) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 88% 85%, rgba(232,200,102,0.16) 0%, transparent 55%), linear-gradient(175deg,#FFFAF4 0%,#FBEFE3 100%)`,
            }}>

            {/* Preview top bar */}
            <div className="sticky top-0 z-10 px-5 py-3 flex items-center justify-between backdrop-blur-xl shrink-0"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(44,32,28,0.07)',
                background: isDark ? 'rgba(6,6,14,0.86)' : 'rgba(255,250,244,0.86)',
              }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: tv.color }} />
                <p className="text-xs font-semibold truncate" style={{ color: isDark ? 'rgba(255,255,255,0.80)' : '#1E2726' }}>
                  {selectedTemplate.name.split('—')[0].trim()}
                </p>
                <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(44,32,28,0.05)',
                    color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(44,32,28,0.38)',
                  }}>
                  Live preview
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(11,74,52,0.08)' }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#0B4A34' }} />
                <span className="text-[10px] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#0B4A34' }}>
                  Updates live
                </span>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">
              <div className="relative">
                <div className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.60' : '0.28'}), transparent 65%)`,
                    opacity: isDark ? 0.75 : 0.65,
                  }} />

                <div className="relative" style={{ width: 'min(288px, calc(100vw - 3rem))' }}>
                  <div style={{
                    borderRadius: 'clamp(30px, 12%, 44px)',
                    background: '#1C1C1E',
                    padding: '10px',
                    boxShadow: isDark
                      ? '0 60px 120px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.09)'
                      : '0 48px 96px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.10)',
                  }}>
                    <div className="flex justify-center" style={{ height: '28px', marginBottom: '-28px', position: 'relative', zIndex: 10 }}>
                      <div style={{ marginTop: '8px', width: '88px', height: '22px', background: '#1C1C1E', borderRadius: '11px' }} />
                    </div>

                    <div className="overflow-hidden relative bg-paper"
                      style={{ borderRadius: 'clamp(22px, 10%, 36px)', height: 'min(590px, max(360px, calc(100dvh - 290px)))' }}>
                      <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                        {isDesktop === true && <PreviewPane templateId={selectedId} data={data} />}
                      </div>
                      {!is3DTemplate(selectedId) && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                          style={{ background: isDark ? 'linear-gradient(to top, rgba(6,6,14,0.90), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)' }}>
                          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
                            <span className="flex items-center gap-1 text-[8.5px] font-semibold"
                              style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(44,32,28,0.42)' }}>
                              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                              scroll to explore
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center" style={{ paddingTop: '8px', paddingBottom: '2px' }}>
                      <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.22)' }} />
                    </div>
                  </div>

                  <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '96px', width: '4px', height: '28px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '136px', width: '4px', height: '44px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '190px', width: '4px', height: '44px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div className="hidden sm:block" style={{ position: 'absolute', right: '-4px', top: '148px', width: '4px', height: '60px', background: '#2C2C2E', borderRadius: '0 2px 2px 0' }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ─── Mobile: full-screen live preview overlay ──────────────────── */}
      {isSplitStep && previewOpen && (
        <div className="fixed inset-0 flex flex-col md:hidden" style={{ zIndex: 'var(--z-overlay)' as unknown as number }}>
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
            style={{ background: 'rgba(255,250,244,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #EADFD2' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 shrink-0 rounded-full animate-pulse" style={{ background: '#0B4A34' }} />
              <p className="truncate text-sm font-semibold text-charcoal">
                Preview · {selectedTemplate.name.split('—')[0].trim()}
              </p>
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="btn-primary flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Keep editing
            </button>
          </div>
          {/* Scrollable phone preview */}
          <div
            className="scrollbar-hide flex flex-1 justify-center overflow-y-auto px-4 pb-8 pt-6"
            style={{
              background: isDark
                ? `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${tv.rgb},0.38), transparent 60%), #06060E`
                : `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${tv.rgb},0.20), transparent 60%), linear-gradient(175deg,#FFFAF4,#FBEFE3)`,
            }}
          >
            <div className="relative h-fit" style={{ width: 'min(320px, calc(100vw - 2rem))' }}>
              <div style={{ borderRadius: 'clamp(28px, 11%, 40px)', background: '#1C1C1E', padding: '9px', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}>
                <div className="flex justify-center" style={{ height: '24px', marginBottom: '-24px', position: 'relative', zIndex: 10 }}>
                  <div style={{ marginTop: '7px', width: '82px', height: '20px', background: '#1C1C1E', borderRadius: '10px' }} />
                </div>
                <div className="overflow-hidden bg-paper" style={{ borderRadius: 'clamp(20px, 9%, 32px)', height: 'calc(100dvh - 210px)' }}>
                  <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                    {isDesktop === false && <PreviewPane templateId={selectedId} data={data} />}
                  </div>
                </div>
                <div className="flex justify-center" style={{ paddingTop: '7px', paddingBottom: '2px' }}>
                  <div style={{ width: '74px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.22)' }} />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-muted">This is exactly what your guests will see. Scroll to explore.</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 5: Publish ─────────────────────────────────────────────── */}
      {currentStep === 5 && (
        <Step5Publish
          selectedTemplate={selectedTemplate}
          data={data}
          userPlan={userPlan}
          session={session}
          loading={loading}
          error={error}
          onBack={() => goToStep(4)}
          onPublish={handleCreate}
        />
      )}

      {/* ─── Mobile sticky navigation (steps 2–4) ──────────────────────── */}
      {!createdSlug && isSplitStep && (
        <BottomDock
          className="md:hidden"
          style={{
            background: 'rgba(255,250,244,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #EADFD2',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '10px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="btn-outline flex-1 rounded-full py-3.5 text-sm font-semibold"
            >
              ← Back
            </button>
            <button
              onClick={() => goToStep(currentStep + 1)}
              className="btn-primary flex-[2] rounded-full py-3.5 text-sm font-semibold"
            >
              {currentStep === 4 ? 'Preview & Publish →' : 'Continue →'}
            </button>
          </div>
        </BottomDock>
      )}

      {/* ─── Mobile sticky CTA (step 5) ─────────────────────────────────── */}
      {/* On a phone the phone-mockup preview fills the viewport, so the pay
          button inside Step5Publish sits well below the fold — customers had to
          scroll to find out how to pay. This docks it. It previously always read
          "Get my invitation link" even when ₹399 was due, so the one button
          people could actually see never mentioned payment at all. */}
      {!createdSlug && currentStep === 5 && (
        <BottomDock
          className="md:hidden"
          style={{
            background: 'rgba(255,250,244,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #EADFD2',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '10px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          {error && <p role="alert" className="mb-2 text-center text-xs font-medium text-[#A33A3A]">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? 'Creating your invitation…' : (
              <>
                {needsPayment
                  ? `Pay ${selectedPrice.label} & publish`
                  : 'Get my invitation link'}
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
          {needsPayment && (
            <p className="mt-1.5 text-center text-[10px] leading-4 text-muted">
              {!session ? 'Sign in first · ' : ''}Razorpay secured · {paymentMethods(selectedPrice.currency)} ·{' '}
              <Link href="/refund-policy" target="_blank" className="font-semibold underline-offset-2 hover:underline text-emerald-soft">
                7-day refunds
              </Link>
            </p>
          )}
        </BottomDock>
      )}

      {/* ─── "Progress saved" toast ─────────────────────────────────────── */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            // x is animated rather than applied via `-translate-x-1/2`: Framer
            // writes the whole `transform` property, so a Tailwind translate
            // class on the same element is silently overwritten by the y
            // animation — which is why the toast sat half its width off-centre.
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 16, x: '-50%' }}
            transition={{ duration: 0.25, ease: BEZIER }}
            className="fixed left-1/2 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full px-4 py-2.5 shadow-lg"
            style={{
              background: '#052E20',
              color: '#fff',
              zIndex: 'var(--z-toast)' as unknown as number,
              bottom: 'calc(var(--bottom-dock-h, 0px) + 1.25rem)',
            }}
          >
            <span className="text-[10px]" style={{ color: '#0B4A34' }}>✓</span>
            <span className="text-xs font-semibold whitespace-nowrap">Progress saved</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLoginPrompt && (
          <LoginPromptModal
            onClose={() => setShowLoginPrompt(false)}
            onContinueAsGuest={handleContinueAsGuest}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {upgradeTarget && upgradeRequiredPlan && (
          <UpgradeModal
            templateId={upgradeTarget.templateId}
            templateName={upgradeTarget.templateName}
            requiredPlan={upgradeRequiredPlan}
            isLoggedIn={!!session}
            onClose={() => { setUpgradeTarget(null); setPayError(null) }}
            onPay={handleUpgradePayment}
            paying={paying}
            payError={payError}
          />
        )}
      </AnimatePresence>

      {/* ─── Success overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {createdSlug && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-end justify-center px-3 sm:items-center sm:px-4"
            style={{ background: 'rgba(3,25,15,0.66)', backdropFilter: 'blur(16px)', zIndex: 'var(--z-overlay)' as unknown as number }}
            role="dialog" aria-modal="true" aria-label="Your invitation is live">
            <motion.div initial={{ y: 40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: BEZIER }}
              className="card w-full max-w-md overflow-hidden rounded-b-none sm:rounded-3xl"
              style={{ maxHeight: 'calc(100dvh - 1rem)', overflowY: 'auto' }}>

              {/* Celebration header: the seal, with a burst of gold sparks. */}
              <div className="relative overflow-hidden bg-emerald px-7 pb-8 pt-9 text-center text-paper">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(232,200,102,0.22),transparent_70%)]" />
                <div className="relative mx-auto h-16 w-16">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const angle = (i / 10) * Math.PI * 2
                    return (
                      <motion.span
                        key={i}
                        aria-hidden
                        className="absolute left-1/2 top-1/2 text-[0.8rem] text-gold-soft"
                        initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.4 }}
                        animate={{ x: `calc(-50% + ${Math.cos(angle) * 62}px)`, y: `calc(-50% + ${Math.sin(angle) * 46}px)`, opacity: [0, 1, 0], scale: [0.4, 1.1, 0.8] }}
                        transition={{ duration: 1.4, delay: 0.25 + i * 0.03, ease: BEZIER }}
                      >
                        ✦
                      </motion.span>
                    )
                  })}
                  <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: [0, 1.15, 1], rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: BEZIER }}>
                    <LogoMark className="h-16 w-16 drop-shadow-[0_10px_20px_rgba(3,25,15,0.5)]" />
                  </motion.div>
                </div>
                <p className="relative mt-5 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-gold-soft">It&apos;s live</p>
                <h2 className="t-h2 relative mt-2">Your invitation is ready to share</h2>
                {names && <p className="relative mt-2 font-editorial text-[1.3rem] italic text-paper/80">{names}</p>}
              </div>

              <div className="p-6 sm:p-7">
                <SuccessLink url={shareUrl} />

                <div className="mt-4">
                  <ShareBar url={shareUrl} names={names} templateId={selectedId} source="create_success" />
                </div>

                {/* No branding notice: every design is a paid publish, so no
                    newly created invitation carries the free-plan banner. */}

                <div className="mt-4 space-y-2.5">
                  <Link href={`/e/${createdSlug}`}
                    className="btn-outline flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.95rem] font-semibold">
                    View your invitation
                  </Link>

                  {session ? (
                    <Link href="/dashboard"
                      className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.95rem] font-semibold">
                      Go to my invitations
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 rounded-2xl border border-line bg-peach/60 px-4 py-3.5">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald text-paper">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <p className="text-[0.88rem] font-semibold text-charcoal">Keep track of guest wishes</p>
                        <p className="mt-0.5 text-[0.8rem] leading-5 text-charcoal/70">Create an account to manage your invitations in one place.</p>
                        <Link href="/auth/signup" className="link mt-1.5 inline-flex text-[0.82rem]">
                          Create an account
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
