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
import { seoEvents, trackEvent } from '@/lib/analytics'

import StepProgress from '@/components/create/StepProgress'
import Step1Templates from '@/components/create/Step1Templates'
import Step2Names from '@/components/create/Step2Names'
import Step3Details from '@/components/create/Step3Details'
import Step4Enrich from '@/components/create/Step4Enrich'
import Step5Publish from '@/components/create/Step5Publish'
import MobilePreviewStrip from '@/components/create/MobilePreviewStrip'
import { TEMPLATE_VISUALS, DARK_TEMPLATES } from '@/components/create/templateVisuals'

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

// ─── Login prompt modal ────────────────────────────────────────────────────────
function LoginPromptModal({ onClose, onContinueAsGuest }: { onClose: () => void; onContinueAsGuest: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(34,27,23,0.65)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ scale: 0.96, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }} transition={{ duration: 0.3, ease: BEZIER }}
        className="w-full max-w-sm rounded-3xl p-7"
        style={{ background: '#FFF', border: '1px solid #E8DCCD', boxShadow: '0 32px 80px rgba(34,27,23,0.28)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, rgba(217,164,65,0.15), rgba(184,121,36,0.10))' }}>
          <svg className="w-7 h-7" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-ink text-center mb-1">Almost there!</h2>
        <p className="text-sm text-muted text-center mb-6 leading-6">
          Sign in to save your invite, track guest wishes, and access your dashboard.
        </p>
        <div className="space-y-2.5">
          <Link href="/auth/login?callbackUrl=/create"
            className="gold-button flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold">
            Sign in to my account
          </Link>
          <Link href="/auth/signup?callbackUrl=/create"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border border-border hover:border-[#D9A441]/40 transition-colors"
            style={{ color: '#2C201C' }}>
            Create free account →
          </Link>
        </div>
        <div className="mt-4 pt-4 border-t border-border/40 text-center">
          <button onClick={onContinueAsGuest} className="text-xs text-muted hover:text-foreground transition-colors">
            Continue without account — invite won&apos;t be saved to dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Upgrade modal ─────────────────────────────────────────────────────────────
function UpgradeModal({
  templateName, requiredPlan, isLoggedIn, onClose, onPay, paying,
}: {
  templateName: string
  requiredPlan: typeof PLANS[number]
  isLoggedIn: boolean
  onClose: () => void
  onPay: (planId: PlanId) => void
  paying: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(34,27,23,0.65)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ scale: 0.96, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }} transition={{ duration: 0.3, ease: BEZIER }}
        className="w-full max-w-sm rounded-3xl p-7"
        style={{ background: '#FFF', border: '1px solid #E8DCCD', boxShadow: '0 32px 80px rgba(34,27,23,0.28)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(217,164,65,0.12)' }}>
          <svg className="w-6 h-6" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-ink text-center mb-1">{requiredPlan.name} Template</h2>
        <p className="text-sm text-muted text-center mb-6">
          <strong className="text-foreground">{templateName}</strong> is included in the {requiredPlan.name} plan.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-4 mb-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-lg font-bold text-ink">{requiredPlan.name}</p>
            <p className="text-2xl font-bold text-ink">₹{requiredPlan.price.toLocaleString()}</p>
          </div>
          <p className="text-xs text-muted mb-3">{requiredPlan.description}</p>
          <ul className="space-y-1.5">
            {requiredPlan.features.map(f => (
              <li key={f} className="flex items-start gap-2 text-xs text-muted">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#2F766D' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
        {!isLoggedIn ? (
          <div className="space-y-2">
            <Link href="/auth/login?callbackUrl=/create"
              className="gold-button flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-semibold">
              Sign in to unlock
            </Link>
            <p className="text-center text-xs text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup?callbackUrl=/create" className="font-semibold" style={{ color: '#B87924' }}>Sign up free →</Link>
            </p>
          </div>
        ) : (
          <button onClick={() => onPay(requiredPlan.id)} disabled={paying}
            className="gold-button flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60">
            {paying && <Spinner />}
            {paying ? 'Opening payment…' : `Pay ₹${requiredPlan.price.toLocaleString()} — One Time`}
          </button>
        )}
        <button onClick={onClose} className="mt-3 w-full py-2.5 text-sm text-muted hover:text-foreground transition-colors">
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CreatePage() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id)
  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) ?? TEMPLATES[0]
  const [data, setData] = useState<Record<string, string>>(selectedTemplate.config.defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<PlanId>('gold')
  const [upgradeTarget, setUpgradeTarget] = useState<{ templateId: string; templateName: string } | null>(null)
  const [paying, setPaying] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  // Pre-select template from URL param, skip straight to Step 2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tplParam = params.get('template')
    if (tplParam) {
      const tpl = TEMPLATES.find(t => t.id === tplParam)
      if (tpl) {
        setSelectedId(tpl.id)
        setData(tpl.config.defaultData)
        setCurrentStep(2)
      }
    }
  }, [])

  // Fetch real user plan once signed in
  useEffect(() => {
    if (!session) return
    fetch('/api/user/subscription')
      .then(r => r.json())
      .then((body: { plan: PlanId }) => { if (body.plan) setUserPlan(body.plan) })
      .catch(() => { })
  }, [session])

  // Restore draft after sign-in
  useEffect(() => {
    if (!session) return
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as { templateId: string; data: Record<string, string> }
      sessionStorage.removeItem(DRAFT_KEY)
      const tpl = TEMPLATES.find(t => t.id === draft.templateId)
      if (tpl) { setSelectedId(draft.templateId); setData(draft.data); setCurrentStep(2) }
    } catch { }
  }, [session])

  const handleTemplateChange = useCallback((id: string) => {
    const tpl = TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
    setSelectedId(id)
    setData(tpl.config.defaultData)
    setError('')
    trackEvent(seoEvents.templateView, {
      template_id: tpl.id,
      template_name: tpl.name,
      template_category: tpl.category,
    })
  }, [])

  const goToStep = (step: number) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'instant' })
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
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || 'Failed to create invitation')
      }
      const { slug } = await res.json() as { slug: string }
      setCreatedSlug(slug)
      trackEvent(seoEvents.inviteCreation, {
        template_id: selectedTemplate.id,
        template_name: selectedTemplate.name,
        template_category: selectedTemplate.category,
        invite_slug: slug,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally { setLoading(false) }
  }

  const handleCreate = () => {
    if (!session) {
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ templateId: selectedId, data })) } catch { }
      setShowLoginPrompt(true)
      return
    }
    if (!canAccess(selectedId, userPlan)) {
      setUpgradeTarget({ templateId: selectedId, templateName: selectedTemplate.name })
      return
    }
    doCreate()
  }

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false)
    doCreate()
  }

  const payRef = useRef<boolean>(false)
  const handleUpgradePayment = useCallback(async (planId: PlanId) => {
    if (payRef.current) return
    payRef.current = true; setPaying(true)
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const order = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string }
      if (!orderRes.ok || !order.orderId) throw new Error(order.error ?? 'Could not create order')
      const options: RazorpayOptions = {
        key: (order.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) as string,
        amount: order.amount as number,
        currency: order.currency ?? 'INR',
        name: 'ShareInvite',
        description: `${PLANS.find(p => p.id === planId)?.name} Plan — One Time`,
        order_id: order.orderId as string,
        prefill: { email: session?.user?.email ?? undefined, name: session?.user?.name ?? undefined },
        theme: { color: '#B87924' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verRes = await fetch('/api/payments/verify', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, plan: planId }),
            })
            const verBody = await verRes.json() as { success?: boolean; error?: string }
            if (verRes.ok && verBody.success) {
              setUserPlan(planId)
              setUpgradeTarget(null)
              const tpl = TEMPLATES.find(t => t.id === upgradeTarget?.templateId)
              if (tpl) { setSelectedId(tpl.id); setData(tpl.config.defaultData) }
              setTimeout(() => doCreate(), 300)
            } else { alert(verBody.error ?? 'Payment verification failed.') }
          } finally { setPaying(false); payRef.current = false }
        },
        modal: { ondismiss: () => { setPaying(false); payRef.current = false } },
      }
      if (typeof window !== 'undefined' && window.Razorpay) {
        new window.Razorpay(options).open()
      } else {
        alert('Payment system is loading. Please try again.')
        setPaying(false); payRef.current = false
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Payment failed. Please try again.')
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
    <div className="min-h-screen bg-background flex flex-col text-foreground">

      {/* Gold accent bar */}
      <div className="sticky top-0 z-50 h-[3px] shrink-0 bg-gradient-to-r from-[#B87924] via-[#D9A441] to-[#B96B70]" />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-[3px] z-40 h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted border border-border hover:border-[#D9A441]/40 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted border border-border hover:border-[#D9A441]/40 transition-colors">
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

          {/* LEFT: Form panel */}
          <aside
            className="w-full md:w-[360px] lg:w-[420px] xl:w-[460px] shrink-0 md:border-r border-border overflow-y-auto scrollbar-hide"
            style={{ background: '#FDFBF8', maxHeight: 'calc(100vh - 67px)' }}
          >
            {/* "Now editing" accent strip — desktop only */}
            <div className="hidden md:flex items-center gap-3 px-5 py-3 shrink-0"
              style={{
                borderBottom: `1px solid rgba(${tv.rgb},0.12)`,
                background: `linear-gradient(90deg, rgba(${tv.rgb},0.07) 0%, rgba(${tv.rgb},0.02) 55%, transparent 100%)`,
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: tv.gradient }}>
                <div className="text-white/90 scale-90">{tv.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: tv.color }}>Editing</p>
                <p className="text-[13px] font-semibold text-ink truncate leading-tight">{selectedTemplate.name.split('—')[0].trim()}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
                style={{ background: 'rgba(47,118,109,0.10)' }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
                <span className="text-[9px] font-bold" style={{ color: '#2F766D' }}>Live</span>
              </div>
            </div>

            {/* Mobile: template label strip */}
            <div className="md:hidden flex items-center gap-2.5 mx-4 mt-4 px-3 py-2.5 rounded-2xl"
              style={{
                background: `linear-gradient(90deg, rgba(${tv.rgb},0.08) 0%, rgba(${tv.rgb},0.03) 100%)`,
                border: `1px solid rgba(${tv.rgb},0.15)`,
              }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: tv.gradient }}>
                <div className="text-white/90 scale-75">{tv.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: tv.color }}>Editing</p>
                <p className="text-xs font-semibold text-ink truncate">{selectedTemplate.name.split('—')[0].trim()}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'rgba(47,118,109,0.10)' }}>
                <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
                <span className="text-[8px] font-bold" style={{ color: '#2F766D' }}>Live</span>
              </div>
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
                userPlan={userPlan}
                onBack={() => goToStep(3)}
                onContinue={() => goToStep(5)}
              />
            )}

            {/* Mobile: inline mini-preview */}
            <div className="md:hidden">
              <MobilePreviewStrip
                templateId={selectedId}
                data={data}
                isDark={isDark}
                color={tv.color}
              />
            </div>
          </aside>

          {/* RIGHT: Live preview — desktop only */}
          <section
            className="hidden md:flex md:flex-col flex-1 overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: 'calc(100vh - 67px)',
              background: isDark
                ? `radial-gradient(ellipse 90% 65% at 50% -5%, rgba(${tv.rgb},0.40) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 90%, rgba(${tv.rgb},0.14) 0%, transparent 55%), #06060E`
                : `radial-gradient(ellipse 90% 60% at 50% -5%, rgba(${tv.rgb},0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 88% 85%, rgba(217,164,65,0.13) 0%, transparent 55%), linear-gradient(175deg,#FFF9F2 0%,#F5EDE2 100%)`,
            }}>

            {/* Preview top bar */}
            <div className="sticky top-0 z-10 px-5 py-3 flex items-center justify-between backdrop-blur-xl shrink-0"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(44,32,28,0.07)',
                background: isDark ? 'rgba(6,6,14,0.86)' : 'rgba(255,249,242,0.86)',
              }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: tv.color }} />
                <p className="text-xs font-semibold truncate" style={{ color: isDark ? 'rgba(255,255,255,0.80)' : '#221B17' }}>
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
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(47,118,109,0.10)' }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
                <span className="text-[10px] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#2F766D' }}>
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

                    <div className="overflow-hidden relative bg-white"
                      style={{ borderRadius: 'clamp(22px, 10%, 36px)', height: 'min(590px, max(360px, calc(100dvh - 290px)))' }}>
                      <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                        <PreviewPane templateId={selectedId} data={data} />
                      </div>
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
        <div
          className="md:hidden fixed bottom-0 inset-x-0 z-30"
          style={{
            background: 'rgba(253,251,248,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(44,32,28,0.09)',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '10px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold border border-border text-muted"
            >
              ← Back
            </button>
            <button
              onClick={() => goToStep(currentStep + 1)}
              className="gold-button flex-[2] py-3.5 rounded-xl text-sm font-semibold"
            >
              {currentStep === 4 ? 'Preview & Publish →' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* ─── Mobile sticky CTA (step 5) ─────────────────────────────────── */}
      {!createdSlug && currentStep === 5 && (
        <div
          className="md:hidden fixed bottom-0 inset-x-0 z-30"
          style={{
            background: 'rgba(253,251,248,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(44,32,28,0.09)',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '10px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          {error && <p className="mb-2 text-xs text-red-500 text-center font-medium">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="gold-button flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold disabled:opacity-50"
            style={{ fontSize: '15px' }}
          >
            {loading && <Spinner />}
            {loading ? 'Creating your invitation…' : (
              <>
                Get my invitation link
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── "Progress saved" toast ─────────────────────────────────────── */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: BEZIER }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
            style={{ background: '#221B17', color: '#fff' }}
          >
            <span className="text-[10px]" style={{ color: '#2F766D' }}>✓</span>
            <span className="text-xs font-semibold whitespace-nowrap">Progress saved automatically</span>
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
            templateName={upgradeTarget.templateName}
            requiredPlan={upgradeRequiredPlan}
            isLoggedIn={!!session}
            onClose={() => setUpgradeTarget(null)}
            onPay={handleUpgradePayment}
            paying={paying}
          />
        )}
      </AnimatePresence>

      {/* ─── Success overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {createdSlug && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
            style={{ background: 'rgba(34,27,23,0.65)', backdropFilter: 'blur(16px)' }}>
            <motion.div initial={{ y: 40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.45, ease: BEZIER }}
              className="w-full max-w-md rounded-t-3xl p-7 pb-10 sm:rounded-3xl sm:p-8"
              style={{ background: '#FFFFFF', border: '1px solid #E8DCCD', boxShadow: '0 -8px 80px rgba(34,27,23,0.24)' }}>

              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.2, ease: BEZIER }}
                className="text-4xl text-center mb-4 select-none" style={{ color: '#B87924' }} aria-hidden>♥</motion.div>

              <h2 className="text-2xl font-bold text-center text-foreground mb-1">Your invitation is live!</h2>
              {names && <p className="text-center mb-5 text-sm text-muted">{names}</p>}

              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 overflow-hidden"
                style={{ background: 'rgba(44,32,28,0.04)', border: '1px solid rgba(44,32,28,0.08)' }}>
                <span className="text-xs truncate flex-1" style={{ color: 'rgba(44,32,28,0.42)' }}>{shareUrl}</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors"
                  style={{ background: 'rgba(217,164,65,0.12)', color: '#B87924' }}>
                  Copy
                </button>
              </div>

              <ShareBar url={shareUrl} names={names} />

              <div className="mt-4 space-y-2">
                <Link href={`/e/${createdSlug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(217,164,65,0.12)', border: '1px solid rgba(184,121,36,0.28)', color: '#2C201C' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View Invitation
                </Link>

                {session ? (
                  <Link href="/dashboard"
                    className="gold-button flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="rounded-xl px-4 py-3 flex items-start gap-3"
                    style={{ background: 'rgba(217,164,65,0.06)', border: '1px solid rgba(184,121,36,0.20)' }}>
                    <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">Sign in to track guest wishes</p>
                      <p className="text-xs text-muted mt-0.5">Get notified when guests send wishes and manage your invites.</p>
                      <Link href="/auth/signup" className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#B87924' }}>
                        Create free account →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
