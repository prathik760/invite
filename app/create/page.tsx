'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/modules/templates/data'
import { PLANS, canAccess, getRequiredPlan, type PlanId } from '@/lib/plans'
import FormEditor from '@/components/editor/FormEditor'
import ShareBar from '@/components/ui/ShareBar'
import { seoEvents, trackEvent } from '@/lib/analytics'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const DRAFT_KEY = 'invitely-draft'

const TEMPLATE_VISUALS: Record<string, { icon: React.ReactNode; gradient: string; color: string; rgb: string }> = {
  'elegant-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 15c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #D9A441 0%, #B87924 100%)',
    color: '#B87924', rgb: '184,121,36',
  },
  'cinematic-night': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="2" y="5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 5V15M14 5V15M2 8h2M2 12h2M16 8h2M16 12h2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #0E0E17 100%)',
    color: '#C9A84C', rgb: '201,168,76',
  },
  'indian-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2C10 2 6 5 6 8.5C6 10.4 7.8 12 10 12C12.2 12 14 10.4 14 8.5C14 5 10 2 10 2Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 17C4 14.2 6.7 12.5 10 12.5C13.3 12.5 16 14.2 16 17" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C41E3A 0%, #8B0030 100%)',
    color: '#C41E3A', rgb: '196,30,58',
  },
  'indian-engagement': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth={1.3} /><circle cx="10" cy="8" r="1.2" fill="currentColor" opacity="0.6" /></svg>,
    gradient: 'linear-gradient(135deg, #C2185B 0%, #880E4F 100%)',
    color: '#C2185B', rgb: '194,24,91',
  },
  'indian-birthday': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="3" y="10" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 10V8M10 10V7M14 10V8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #E65100 100%)',
    color: '#FF8C00', rgb: '255,140,0',
  },
  'griha-pravesh': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10V17H15V10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
    color: '#FF8F00', rgb: '255,143,0',
  },
  'namakaran': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth={1.5} /><path d="M6 16C6 13.8 7.8 12 10 12C12.2 12 14 13.8 14 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
    color: '#0288D1', rgb: '2,136,209',
  },
  'anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #5C0020 100%)',
    color: '#8B0030', rgb: '139,0,48',
  },
  'kgf-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 17C10 17 3 12.5 3 8C3 5.8 4.8 4 7 4C8.5 4 9.8 4.9 10 6C10.2 4.9 11.5 4 13 4C15.2 4 17 5.8 17 8C17 12.5 10 17 10 17Z" fill="currentColor" opacity="0.85" /><path d="M10 13C10 13 6 10 6 7.5C6 6.4 7.1 5.5 8.2 5.5C9 5.5 9.7 5.9 10 6.5C10.3 5.9 11 5.5 11.8 5.5C12.9 5.5 14 6.4 14 7.5C14 10 10 13 10 13Z" fill="currentColor" opacity="0.5" /></svg>,
    gradient: 'linear-gradient(135deg, #FF5500 0%, #D4A017 45%, #040200 100%)',
    color: '#D4A017', rgb: '212,160,23',
  },
  'royal-deco': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.5 4.5H16l-3.7 2.7 1.4 4.3L10 11l-3.7 2.5 1.4-4.3L4 6.5h4.5L10 2z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1540 0%, #C8902A 55%, #07050F 100%)',
    color: '#C8902A', rgb: '200,144,42',
  },
  'luxury-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M5 15.5c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F9F4EA 0%, #C9A44D 60%, #B07878 100%)',
    color: '#C9A44D', rgb: '201,164,77',
  },
}

const DARK_TEMPLATES = new Set(['cinematic-night', 'indian-wedding', 'indian-engagement', 'indian-birthday', 'griha-pravesh', 'namakaran', 'anniversary', 'kgf-wedding', 'royal-deco'])

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── Template card — reused in both mobile strip and desktop grid ──────────────
function TemplateCard({
  tpl, isActive, locked, req, v, size, onClick,
}: {
  tpl: typeof TEMPLATES[number]
  isActive: boolean
  locked: boolean
  req: ReturnType<typeof getRequiredPlan> | null
  v: { icon: React.ReactNode; gradient: string; color: string; rgb: string }
  size: 'sm' | 'md'
  onClick: () => void
}) {
  const swatchH = size === 'sm' ? '40px' : '56px'
  const cardW = size === 'sm' ? '72px' : '96px'
  const radius = size === 'sm' ? '10px' : '13px'
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden shrink-0 text-left transition-all duration-200"
      style={{
        width: cardW,
        borderRadius: radius,
        border: `2px solid ${isActive ? v.color : 'rgba(44,32,28,0.09)'}`,
        boxShadow: isActive
          ? `0 0 0 3px rgba(${v.rgb},0.14), 0 6px 18px rgba(0,0,0,0.12)`
          : '0 1px 4px rgba(0,0,0,0.06)',
        transform: isActive ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="flex items-center justify-center relative" style={{ height: swatchH, background: v.gradient }}>
        <div className="text-white/85">{v.icon}</div>
        {isActive && (
          <div className="absolute top-1 right-1 rounded-full bg-white flex items-center justify-center"
            style={{ width: size === 'sm' ? '14px' : '18px', height: size === 'sm' ? '14px' : '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }}>
            <svg viewBox="0 0 10 10" fill="none" style={{ width: size === 'sm' ? '8px' : '10px', height: size === 'sm' ? '8px' : '10px', color: v.color }}>
              <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {locked ? (
          <div className="absolute top-1 left-1">
            <span className="font-bold text-white px-1 py-0.5 rounded-full" style={{ fontSize: '6px', background: 'rgba(0,0,0,0.50)' }}>{req?.name}</span>
          </div>
        ) : tpl.id === 'elegant-wedding' ? (
          <div className="absolute top-1 left-1">
            <span className="font-bold text-white px-1 py-0.5 rounded-full" style={{ fontSize: '6px', background: '#2F766D' }}>Free</span>
          </div>
        ) : null}
      </div>
      <div className="px-2 py-1.5" style={{ background: isActive ? '#fff' : '#F9F7F4' }}>
        <p className="font-semibold leading-tight truncate" style={{ fontSize: size === 'sm' ? '8.5px' : '10px', color: isActive ? '#221B17' : '#4A3B35' }}>
          {tpl.name.split('—')[0].trim()}
        </p>
        {size === 'md' && tpl.name.includes('—') && (
          <p className="mt-0.5 leading-tight truncate" style={{ fontSize: '8px', color: 'rgba(44,32,28,0.36)' }}>
            {tpl.name.split('—')[1]?.trim()}
          </p>
        )}
      </div>
    </button>
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
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id)
  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) ?? TEMPLATES[0]
  const [data, setData] = useState<Record<string, string>>(selectedTemplate.config.defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form')
  const [userPlan, setUserPlan] = useState<PlanId>('gold')
  const [upgradeTarget, setUpgradeTarget] = useState<{ templateId: string; templateName: string } | null>(null)
  const [paying, setPaying] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/user/subscription')
      .then(r => r.json())
      .then((body: { plan: PlanId }) => { if (body.plan) setUserPlan(body.plan) })
      .catch(() => { })
  }, [session])

  useEffect(() => {
    if (!session) return
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as { templateId: string; data: Record<string, string> }
      sessionStorage.removeItem(DRAFT_KEY)
      const tpl = TEMPLATES.find(t => t.id === draft.templateId)
      if (tpl) { setSelectedId(draft.templateId); setData(draft.data) }
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

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">

      {/* Gold accent bar */}
      <div className="sticky top-0 z-50 h-[3px] shrink-0 bg-gradient-to-r from-[#B87924] via-[#D9A441] to-[#B96B70]" />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-[3px] z-40 h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
          </Link>
          {/* Step progress — shown at sm+ */}
          <div className="hidden sm:flex items-center gap-0 ml-2">
            {[
              { label: 'Choose style', done: true, active: false },
              { label: 'Fill details', done: false, active: !createdSlug },
              { label: 'Share', done: !!createdSlug, active: !!createdSlug },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-all"
                  style={{ background: step.active ? 'rgba(184,121,36,0.09)' : 'transparent' }}>
                  <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shrink-0"
                    style={{
                      fontSize: '8px',
                      background: step.done ? '#2F766D' : step.active ? '#B87924' : 'rgba(44,32,28,0.08)',
                      color: step.done || step.active ? '#fff' : 'rgba(44,32,28,0.22)',
                    }}>
                    {step.done && !step.active ? '✓' : i + 1}
                  </span>
                  <span className="text-[11px] font-semibold hidden md:inline"
                    style={{ color: step.active ? '#B87924' : step.done ? '#2F766D' : 'rgba(44,32,28,0.28)' }}>
                    {step.label}
                  </span>
                </div>
                {i < 2 && <div className="w-4 h-px mx-0.5" style={{ background: 'rgba(44,32,28,0.12)' }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {error && (
            <p className="hidden sm:block max-w-[200px] truncate rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] text-red-600">
              {error}
            </p>
          )}
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
          <button onClick={handleCreate} disabled={loading}
            className="gold-button hidden md:flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
            {loading && <Spinner />}
            {loading ? 'Creating…' : 'Create Invite'}
          </button>
        </div>
      </header>

      {/* ─── Mobile: Template strip + Tab bar (single sticky block) ──────────── */}
      <div className="md:hidden sticky top-[59px] sm:top-[67px] z-30 shrink-0 border-b border-border"
        style={{ background: 'rgba(253,251,248,0.98)', backdropFilter: 'blur(20px)' }}>

        {/* Template cards strip */}
        <div className="overflow-x-auto scrollbar-hide px-4 pt-3 pb-2.5">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {TEMPLATES.map(tpl => {
              const isActive = tpl.id === selectedId
              const locked = !canAccess(tpl.id, userPlan)
              const req = locked ? getRequiredPlan(tpl.id) : null
              const v = TEMPLATE_VISUALS[tpl.id] ?? TEMPLATE_VISUALS['elegant-wedding']
              return (
                <TemplateCard
                  key={tpl.id}
                  tpl={tpl} isActive={isActive} locked={locked} req={req} v={v}
                  size="sm"
                  onClick={() => handleTemplateChange(tpl.id)}
                />
              )
            })}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex" style={{ borderTop: '1px solid rgba(44,32,28,0.08)' }}>
          {[
            {
              id: 'form' as const,
              label: 'Fill Details',
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              ),
            },
            {
              id: 'preview' as const,
              label: 'Preview',
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMobileTab(tab.id)}
              className="flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all border-b-2"
              style={{
                borderColor: mobileTab === tab.id ? '#B87924' : 'transparent',
                color: mobileTab === tab.id ? '#B87924' : '#7E716B',
                background: mobileTab === tab.id ? 'rgba(217,164,65,0.04)' : 'transparent',
              }}>
              {tab.icon}
              {tab.label}
              {tab.id === 'preview' && mobileTab === 'form' && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#2F766D' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main layout ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* ── LEFT: Form panel ───────────────────────────────────────────────── */}
        <aside
          className={`${mobileTab !== 'form' ? 'hidden md:flex md:flex-col' : 'flex flex-col'} w-full md:w-[360px] lg:w-[420px] xl:w-[460px] shrink-0 md:border-r border-border md:max-h-[calc(100vh-67px)] overflow-hidden`}
          style={{ background: '#FDFBF8' }}>

          {/* Desktop: Template selector */}
          <div className="hidden md:flex md:flex-col shrink-0 border-b border-border/60">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-sm font-bold text-ink">Choose your design</p>
                <p className="text-[11px] text-muted mt-0.5">Pick a style for your occasion</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(47,118,109,0.10)', color: '#2F766D' }}>
                {TEMPLATES.length} styles
              </span>
            </div>

            {/* Cards */}
            <div className="overflow-x-auto scrollbar-hide px-5 pb-4">
              <div className="flex gap-2.5" style={{ width: 'max-content' }}>
                {TEMPLATES.map(tpl => {
                  const isActive = tpl.id === selectedId
                  const locked = !canAccess(tpl.id, userPlan)
                  const req = locked ? getRequiredPlan(tpl.id) : null
                  const v = TEMPLATE_VISUALS[tpl.id] ?? TEMPLATE_VISUALS['elegant-wedding']
                  return (
                    <TemplateCard
                      key={tpl.id}
                      tpl={tpl} isActive={isActive} locked={locked} req={req} v={v}
                      size="md"
                      onClick={() => handleTemplateChange(tpl.id)}
                    />
                  )
                })}
              </div>
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-4 px-5 pb-4 flex-wrap">
              {['Free to create', 'No card needed', 'WhatsApp ready'].map(t => (
                <span key={t} className="flex items-center gap-1 text-[10px] font-medium" style={{ color: 'rgba(44,32,28,0.42)' }}>
                  <span style={{ color: '#2F766D', fontSize: '10px' }}>✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop: "Now editing" accent strip */}
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
              <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: tv.color }}>Now editing</p>
              <p className="text-[13px] font-semibold text-ink truncate leading-tight">{selectedTemplate.name}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
              style={{ background: 'rgba(47,118,109,0.10)' }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
              <span className="text-[9px] font-bold" style={{ color: '#2F766D' }}>Live</span>
            </div>
          </div>

          {/* Form — fills remaining height, scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ paddingBottom: 'max(96px, env(safe-area-inset-bottom, 0px) + 88px)' }}>

            {/* Mobile: error */}
            {error && (
              <div className="md:hidden mx-4 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Mobile: selected template label */}
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
                <p className="text-xs font-semibold text-ink truncate">{selectedTemplate.name}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'rgba(47,118,109,0.10)' }}>
                <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
                <span className="text-[8px] font-bold" style={{ color: '#2F766D' }}>Live</span>
              </div>
            </div>

            {/* ── How it works guide ── */}
            <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(184,121,36,0.16)', background: 'rgba(184,121,36,0.04)' }}>
              <div className="px-4 pt-4 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: '#B87924' }}>
                  How it works — 4 simple steps
                </p>
                <div className="space-y-3 pb-3">
                  {([
                    { n: 1, label: 'Choose a design above', sub: 'Pick the template that fits your occasion', active: !createdSlug },
                    { n: 2, label: 'Scroll down & fill all details', sub: 'Names, date, venue, message and more below ↓', active: !createdSlug },
                    { n: 3, label: 'Tap "Create Invite"', sub: 'Free plans are instant; premium plans unlock after payment', active: !createdSlug },
                    { n: 4, label: 'Share the link on WhatsApp', sub: 'Your guests click it — no app download needed', active: false },
                  ] as { n: number; label: string; sub: string; active: boolean }[]).map(step => (
                    <div key={step.n} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold text-white"
                        style={{ fontSize: '9px', background: step.active ? '#B87924' : 'rgba(44,32,28,0.15)' }}>
                        {step.n}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug" style={{ color: step.active ? '#221B17' : 'rgba(44,32,28,0.42)' }}>
                          {step.label}
                        </p>
                        <p className="text-[10px] leading-snug mt-0.5" style={{ color: 'rgba(44,32,28,0.38)' }}>
                          {step.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Scroll nudge strip */}
              <div className="flex items-center justify-center gap-1.5 py-2" style={{ background: 'rgba(184,121,36,0.08)', borderTop: '1px solid rgba(184,121,36,0.10)' }}>
                <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#B87924' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <p className="text-[10px] font-semibold" style={{ color: '#B87924' }}>
                  Scroll down in the form to fill all event details
                </p>
              </div>
            </div>

            {/* Upgrade nudge */}
            {userPlan === 'free' && (
              <div className="mx-4 mt-4 px-4 py-3 rounded-2xl flex items-center gap-2.5"
                style={{ background: 'rgba(184,121,36,0.06)', border: '1px solid rgba(184,121,36,0.14)' }}>
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(44,32,28,0.58)' }}>
                  <Link href="/#pricing" className="font-bold" style={{ color: '#B87924' }}>Upgrade to unlock all 8 premium templates →</Link>
                </p>
              </div>
            )}

            <FormEditor key={selectedId} config={selectedTemplate.config} data={data} onChange={setData} compact />
          </div>
        </aside>

        {/* ── RIGHT: Live preview ─────────────────────────────────────────────── */}
        <section
          className={`${mobileTab !== 'preview' ? 'hidden md:flex md:flex-col' : 'flex flex-col'} flex-1 overflow-y-auto scrollbar-hide md:max-h-[calc(100vh-67px)]`}
          style={{
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
                {selectedTemplate.name}
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
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(47,118,109,0.10)',
              }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#2F766D' }} />
              <span className="text-[10px] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#2F766D' }}>
                Updates live
              </span>
            </div>
          </div>

          {/* Phone mockup + CTA */}
          <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">

            <div className="relative">
              {/* Ambient glow */}
              <div className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.60' : '0.28'}), transparent 65%)`,
                  opacity: isDark ? 0.75 : 0.65,
                }} />

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
                  <div className="overflow-hidden relative bg-white"
                    style={{ borderRadius: 'clamp(22px, 10%, 36px)', height: 'min(590px, max(360px, calc(100dvh - 290px)))' }}>
                    <div className="h-full overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                      <PreviewPane templateId={selectedId} data={data} />
                    </div>
                    {/* Scroll hint */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                      style={{
                        background: isDark
                          ? 'linear-gradient(to top, rgba(6,6,14,0.90) 0%, transparent 100%)'
                          : 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)',
                      }}>
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

                  {/* Home indicator */}
                  <div className="flex justify-center" style={{ paddingTop: '8px', paddingBottom: '2px' }}>
                    <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.22)' }} />
                  </div>
                </div>

                {/* Side buttons — only on wider shells */}
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '96px', width: '4px', height: '28px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '136px', width: '4px', height: '44px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-4px', top: '190px', width: '4px', height: '44px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', right: '-4px', top: '148px', width: '4px', height: '60px', background: '#2C2C2E', borderRadius: '0 2px 2px 0' }} />
              </div>
            </div>



            {/* Desktop CTA */}
            {!createdSlug && (
              <div className="hidden md:flex flex-col items-center mt-9 gap-2.5">
                <button onClick={handleCreate} disabled={loading}
                  className="gold-button flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold disabled:opacity-50"
                  style={{ fontSize: '15px', letterSpacing: '0.01em' }}>
                  {loading ? (
                    <><Spinner />Creating your invitation…</>
                  ) : (
                    <>
                      Create &amp; Share Invite
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(44,32,28,0.32)' }}>
                  Free to create · No credit card needed
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ─── Modals ───────────────────────────────────────────────────────────── */}
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

      {/* ─── Mobile: Sticky bottom CTA ─────────────────────────────────────────── */}
      {!createdSlug && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30"
          style={{
            background: 'rgba(253,251,248,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(44,32,28,0.09)',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '12px',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
          }}>
          {error ? (
            <p className="mb-2 text-xs text-red-500 text-center font-medium">{error}</p>
          ) : (
            <div className="flex items-center justify-center gap-4 mb-3">
              {[
                { icon: '✓', label: 'Free' },
                { icon: '⚡', label: 'Ready in 2 mins' },
                { icon: '↗', label: 'Share on WhatsApp' },
              ].map(t => (
                <span key={t.label} className="flex items-center gap-1 font-medium"
                  style={{ fontSize: '10px', color: 'rgba(44,32,28,0.38)' }}>
                  <span style={{ color: '#2F766D', fontSize: '10px' }}>{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>
          )}
          <button onClick={handleCreate} disabled={loading}
            className="gold-button flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold disabled:opacity-50"
            style={{ fontSize: '15px' }}>
            {loading && <Spinner />}
            {loading ? 'Creating your invitation…' : (
              <>
                Create Invite
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── Success overlay ──────────────────────────────────────────────────── */}
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
