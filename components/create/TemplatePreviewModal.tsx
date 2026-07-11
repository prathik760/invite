'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/modules/templates/data'
import { getRequiredPlan } from '@/lib/plans'
import { TEMPLATE_VISUALS, DARK_TEMPLATES } from './templateVisuals'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

function PlanBadge({ templateId }: { templateId: string }) {
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.1em] shrink-0"
      style={
        isFree
          ? { background: 'rgba(47,118,109,0.12)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.22)' }
          : plan.id === 'standard'
          ? { background: 'rgba(184,138,68,0.12)', color: '#B87924', border: '1px solid rgba(184,138,68,0.25)' }
          : plan.id === 'premium'
          ? { background: 'rgba(47,118,109,0.1)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.2)' }
          : { background: 'rgba(201,168,76,0.14)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }
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
}

export default function TemplatePreviewModal({ templateId, open, onClose }: Props) {
  const tpl = TEMPLATES.find(t => t.id === templateId)
  if (!tpl) return null

  const isDark = DARK_TEMPLATES.has(templateId)
  const tv = TEMPLATE_VISUALS[templateId] ?? TEMPLATE_VISUALS['elegant-wedding']
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(22,16,13,0.76)', backdropFilter: 'blur(18px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.32, ease: BEZIER }}
            className="w-full sm:w-auto flex flex-col"
            style={{ maxHeight: '96dvh' }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-t-3xl sm:rounded-3xl sm:rounded-b-none"
              style={{
                background: isDark ? '#111118' : '#FFFCF8',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(44,32,28,0.09)',
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0">
                  <Image src={tv.image} alt={tpl.name} width={28} height={28} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate"
                    style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#221B17' }}>
                    {tpl.name.split('—')[0].trim()}
                  </p>
                  <PlanBadge templateId={templateId} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,32,28,0.07)',
                  color: isDark ? 'rgba(255,255,255,0.6)' : '#706861',
                }}
                aria-label="Close preview"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Phone shell */}
            <div
              className="flex-1 flex flex-col items-center justify-start overflow-y-auto py-5 px-6 scrollbar-hide"
              style={{
                background: isDark
                  ? `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(${tv.rgb},0.38) 0%, transparent 55%), #07070F`
                  : `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${tv.rgb},0.18) 0%, transparent 55%), #F7F1E9`,
              }}
            >
              <div className="relative" style={{ width: 'min(268px, calc(100vw - 3rem))' }}>
                {/* Ambient glow */}
                <div className="absolute -inset-8 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.55' : '0.22'}), transparent 65%)` }} />

                {/* iPhone shell */}
                <div className="relative" style={{
                  borderRadius: 'clamp(28px, 12%, 42px)',
                  background: '#1C1C1E',
                  padding: '9px',
                  boxShadow: isDark
                    ? '0 48px 100px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.07)'
                    : '0 40px 80px rgba(0,0,0,0.26), 0 0 0 1px rgba(0,0,0,0.10)',
                }}>
                  {/* Dynamic island */}
                  <div className="flex justify-center" style={{ height: '26px', marginBottom: '-26px', position: 'relative', zIndex: 10 }}>
                    <div style={{ marginTop: '7px', width: '80px', height: '20px', background: '#1C1C1E', borderRadius: '10px' }} />
                  </div>
                  {/* Screen */}
                  <div className="overflow-hidden relative bg-white"
                    style={{ borderRadius: 'clamp(20px, 10%, 34px)', height: 'min(520px, max(340px, calc(100dvh - 280px)))' }}>
                    <div className="h-full overflow-y-auto scrollbar-hide"
                      style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                      <PreviewPane templateId={templateId} data={tpl.config.defaultData} />
                    </div>
                    {/* Scroll hint */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10"
                      style={{ background: isDark ? 'linear-gradient(to top,rgba(7,7,15,0.88),transparent)' : 'linear-gradient(to top,rgba(255,255,255,0.90),transparent)' }}>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="flex items-center gap-1 text-[8px] font-semibold"
                          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,32,28,0.35)' }}>
                          <svg className="w-2.5 h-2.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          scroll to explore
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Home indicator */}
                  <div className="flex justify-center" style={{ paddingTop: '7px', paddingBottom: '2px' }}>
                    <div style={{ width: '72px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.22)' }} />
                  </div>
                </div>

                {/* Side buttons */}
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-3px', top: '88px', width: '3px', height: '24px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-3px', top: '122px', width: '3px', height: '40px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', left: '-3px', top: '172px', width: '3px', height: '40px', background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
                <div className="hidden sm:block" style={{ position: 'absolute', right: '-3px', top: '138px', width: '3px', height: '56px', background: '#2C2C2E', borderRadius: '0 2px 2px 0' }} />
              </div>
            </div>

            {/* Bottom CTA */}
            <div
              className="px-5 py-4 rounded-b-3xl flex flex-col gap-2"
              style={{
                background: isDark ? '#111118' : '#FFFCF8',
                borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(44,32,28,0.09)',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
              }}
            >
              {!isFree && (
                <p className="text-center text-[11px]"
                  style={{ color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(44,32,28,0.42)' }}>
                  One-time ₹{plan.price.toLocaleString('en-IN')} · No subscription
                </p>
              )}
              <Link
                href={`/create?template=${templateId}`}
                onClick={onClose}
                className="gold-button w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold"
                style={{ fontSize: '14px' }}
              >
                Use this template
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
