'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/modules/templates/data'
import { getRequiredPlan } from '@/lib/plans'
import { TEMPLATE_VISUALS, DARK_TEMPLATES } from './templateVisuals'
import LiveDemoScreen from './LiveDemoScreen'
import ShareDesignButton from '@/components/catalog/ShareDesignButton'
import { useBackToClose } from '@/lib/useBackToClose'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

function PlanBadge({ templateId }: { templateId: string }) {
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.1em] shrink-0"
      style={
        isFree
          ? { background: 'rgba(11,74,52,0.12)', color: '#0B4A34', border: '1px solid rgba(11,74,52,0.22)' }
          : plan.id === 'standard'
          ? { background: 'rgba(164,121,69,0.12)', color: '#0B4A34', border: '1px solid rgba(164,121,69,0.25)' }
          : plan.id === 'premium'
          ? { background: 'rgba(11,74,52,0.1)', color: '#0B4A34', border: '1px solid rgba(11,74,52,0.2)' }
          : { background: 'rgba(164,121,69,0.14)', color: '#A47945', border: '1px solid rgba(164,121,69,0.3)' }
      }
    >
      {isFree ? 'Free' : `₹${plan.price.toLocaleString('en-IN')} one-time`}
    </span>
  )
}

interface Props {
  templateId: string
  open: boolean
  onClose: () => void
  /** In the builder: choose this design instead of linking to /create. */
  onUse?: () => void
}

/** Phones get the preview full-screen — the invitation at their own width, exactly as a guest sees it. */
function useIsPhone() {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 639px)')
    const on = () => setPhone(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return phone
}

export default function TemplatePreviewModal({ templateId, open, onClose, onUse }: Props) {
  const isPhone = useIsPhone()
  // The phone's Back button closes the preview instead of leaving the site.
  const releaseBack = useBackToClose(open, onClose)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const tpl = TEMPLATES.find(t => t.id === templateId)
  if (!tpl) return null

  const isDark = DARK_TEMPLATES.has(templateId)
  const tv = TEMPLATE_VISUALS[templateId] ?? TEMPLATE_VISUALS['elegant-wedding']
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0
  const name = tpl.name.split('—')[0].trim()
  const barBg = isDark ? '#111118' : '#FFFCF8'
  const barLine = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(44,32,28,0.09)'

  const topBar = (
    <div
      className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:rounded-t-3xl"
      style={{ background: barBg, borderBottom: barLine, paddingTop: isPhone ? 'max(12px, env(safe-area-inset-top, 0px))' : undefined }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xl">
          <Image src={tv.image} alt="" width={32} height={32} className="h-full w-full object-cover object-top" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#1E2726' }}>
            {name}
          </p>
          <PlanBadge templateId={templateId} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ShareDesignButton
          templateId={templateId}
          name={name}
          source="preview_modal"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,32,28,0.07)', color: isDark ? 'rgba(255,255,255,0.85)' : '#1E2726' }}
        />
        <button
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,32,28,0.07)', color: isDark ? 'rgba(255,255,255,0.7)' : '#706861' }}
          aria-label="Close preview"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )

  const cta = (
    <div
      className="flex shrink-0 flex-col gap-2 px-5 py-4 sm:rounded-b-3xl"
      style={{ background: barBg, borderTop: barLine, paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
    >
      {!isFree && (
        <p className="text-center text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(44,32,28,0.5)' }}>
          One-time ₹{plan.price.toLocaleString('en-IN')} · No subscription · Preview before you pay
        </p>
      )}
      {onUse ? (
        <button type="button" onClick={onUse} className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-bold" style={{ fontSize: '14px' }}>
          Use this design
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      ) : (
        <Link
          href={`/create?template=${templateId}`}
          // Replaces the preview's history entry, so Back from the builder returns to this page.
          replace
          onClick={() => {
            releaseBack()
            onClose()
          }}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-bold"
          style={{ fontSize: '14px' }}
        >
          Use this design
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — live preview`}
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 'var(--z-overlay)' as unknown as number, background: 'rgba(22,16,13,0.76)', backdropFilter: isPhone ? undefined : 'blur(18px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          {isPhone ? (
            /* Phone: the invitation fills the screen, as it will for a guest. */
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ duration: 0.28, ease: BEZIER }}
              className="flex h-[100dvh] w-full flex-col"
              style={{ background: barBg }}
            >
              {topBar}
              <div className="relative min-h-0 flex-1 bg-paper">
                <LiveDemoScreen templateId={templateId} title={name} poster={tv.image} phoneWidth={0} />
              </div>
              {cta}
            </motion.div>
          ) : (
            /* Larger screens: a phone, laid out at a real phone width. */
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.32, ease: BEZIER }}
              className="flex w-[25rem] flex-col"
              style={{ maxHeight: '96dvh' }}
            >
              {topBar}
              <div
                className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-6 py-6 scrollbar-hide"
                style={{
                  background: isDark
                    ? `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(${tv.rgb},0.38) 0%, transparent 55%), #07070F`
                    : `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${tv.rgb},0.18) 0%, transparent 55%), #F7F1E9`,
                }}
              >
                <div className="relative" style={{ width: 318 }}>
                  <div
                    className="pointer-events-none absolute -inset-8 rounded-full blur-3xl"
                    style={{ background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.55' : '0.22'}), transparent 65%)` }}
                  />
                  {/* Phone shell */}
                  <div
                    className="relative"
                    style={{
                      borderRadius: 44,
                      background: '#1C1C1E',
                      padding: 9,
                      boxShadow: isDark
                        ? '0 48px 100px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.07)'
                        : '0 40px 80px rgba(0,0,0,0.26), 0 0 0 1px rgba(0,0,0,0.10)',
                    }}
                  >
                    <div className="relative z-10 flex justify-center" style={{ height: 26, marginBottom: -26 }}>
                      <div style={{ marginTop: 7, width: 84, height: 21, background: '#1C1C1E', borderRadius: 11 }} />
                    </div>
                    <div className="relative overflow-hidden bg-paper" style={{ borderRadius: 35, height: 'min(620px, max(380px, calc(100dvh - 270px)))' }}>
                      <LiveDemoScreen templateId={templateId} title={name} poster={tv.image} />
                    </div>
                    <div className="flex justify-center" style={{ paddingTop: 7, paddingBottom: 2 }}>
                      <div style={{ width: 72, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)' }} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', left: -3, top: 96, width: 3, height: 26, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div style={{ position: 'absolute', left: -3, top: 134, width: 3, height: 44, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div style={{ position: 'absolute', left: -3, top: 188, width: 3, height: 44, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                  <div style={{ position: 'absolute', right: -3, top: 150, width: 3, height: 60, background: '#2C2C2E', borderRadius: '0 2px 2px 0' }} />
                </div>
              </div>
              {cta}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
