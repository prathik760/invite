'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/modules/templates/data'
import { getRequiredPlan } from '@/lib/plans'
import { TEMPLATE_VISUALS, DARK_TEMPLATES } from './templateVisuals'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const CATEGORY_TAB_MAP: Record<string, string> = {
  wedding: 'wedding',
  movie: 'wedding',
  retro: 'wedding',
  engagement: 'engagement',
  birthday: 'birthday',
  housewarming: 'housewarming',
  naming: 'naming',
  anniversary: 'anniversary',
}

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Mangni' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'housewarming', label: 'Griha Pravesh' },
  { value: 'naming', label: 'Namakaran' },
  { value: 'anniversary', label: 'Anniversary' },
]

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

// ─── Preview modal ─────────────────────────────────────────────────────────────
function TemplatePreviewModal({
  templateId,
  onClose,
  onUse,
}: {
  templateId: string
  onClose: () => void
  onUse: () => void
}) {
  const tpl = TEMPLATES.find(t => t.id === templateId)
  if (!tpl) return null
  const isDark = DARK_TEMPLATES.has(templateId)
  const tv = TEMPLATE_VISUALS[templateId] ?? TEMPLATE_VISUALS['elegant-wedding']
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0

  return (
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
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: tv.gradient }}>
              <div className="text-white/85 scale-75">{tv.icon}</div>
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
              style={{
                background: `radial-gradient(ellipse, rgba(${tv.rgb},${isDark ? '0.55' : '0.22'}), transparent 65%)`,
              }} />

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
                style={{
                  borderRadius: 'clamp(20px, 10%, 34px)',
                  height: 'min(520px, max(340px, calc(100dvh - 280px)))',
                }}>
                <div className="h-full overflow-y-auto scrollbar-hide"
                  style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                  <PreviewPane templateId={templateId} data={tpl.config.defaultData} />
                </div>
                {/* Scroll hint fade */}
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
          <button
            onClick={onUse}
            className="gold-button w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold"
            style={{ fontSize: '14px' }}
          >
            Use this template
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
interface Step1TemplatesProps {
  selectedId: string
  onSelect: (id: string) => void
  onContinue: () => void
}

export default function Step1Templates({ selectedId, onSelect, onContinue }: Step1TemplatesProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [previewId, setPreviewId] = useState<string | null>(null)

  const filtered = TEMPLATES.filter(tpl => {
    if (activeTab === 'all') return true
    return (CATEGORY_TAB_MAP[tpl.category ?? ''] ?? tpl.category) === activeTab
  })

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">

        {/* Page heading */}
        <div className="pt-8 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] mb-2" style={{ color: '#B87924' }}>
            Step 1 of 5
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl text-ink">
            Choose your invitation style
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Tap <strong className="font-semibold text-foreground">Preview</strong> on any design to see how it looks — then select the one you love.
          </p>
        </div>

        {/* Category tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 mb-6">
          <div className="flex gap-2 px-4 sm:px-0" style={{ width: 'max-content' }}>
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                style={
                  activeTab === tab.value
                    ? { background: '#B87924', color: '#fff' }
                    : { background: '#fff', color: '#706861', border: '1px solid #E1D8CC' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map(tpl => {
            const v = TEMPLATE_VISUALS[tpl.id] ?? TEMPLATE_VISUALS['elegant-wedding']
            const isActive = tpl.id === selectedId

            return (
              // outer div avoids nested <button> (invalid HTML); role="button" keeps a11y
              <div
                key={tpl.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(tpl.id)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(tpl.id)}
                className="relative overflow-hidden rounded-2xl text-left cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B87924] focus-visible:ring-offset-2 select-none"
                style={{
                  border: `2px solid ${isActive ? v.color : '#E1D8CC'}`,
                  boxShadow: isActive
                    ? `0 0 0 3px rgba(${v.rgb},0.15), 0 8px 24px rgba(0,0,0,0.12)`
                    : '0 1px 4px rgba(0,0,0,0.06)',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
                aria-pressed={isActive}
              >
                {/* Swatch */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: '96px' }}
                >
                  <Image
                    src={v.image}
                    alt={tpl.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                  {/* Preview pill — always visible */}
                  <button
                    onClick={e => { e.stopPropagation(); setPreviewId(tpl.id) }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#2C201C', backdropFilter: 'blur(6px)' }}
                    aria-label={`Preview ${tpl.name}`}
                  >
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preview
                  </button>

                  {/* Selected checkmark */}
                  {isActive && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-white"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                    >
                      <svg viewBox="0 0 10 10" fill="none" style={{ width: '10px', height: '10px', color: v.color }}>
                        <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div
                  className="px-3 py-2.5"
                  style={{ background: isActive ? '#fff' : '#F9F7F4' }}
                >
                  <p
                    className="font-semibold text-[12px] leading-snug truncate mb-1.5"
                    style={{ color: isActive ? '#221B17' : '#4A3B35' }}
                  >
                    {tpl.name.split('—')[0].trim()}
                  </p>
                  <PlanBadge templateId={tpl.id} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected template summary + CTA */}
        <div
          className="fixed bottom-0 inset-x-0 z-30 px-4 py-4"
          style={{
            background: 'rgba(248,245,240,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(44,32,28,0.09)',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
            {(() => {
              const tpl = TEMPLATES.find(t => t.id === selectedId)
              const v = TEMPLATE_VISUALS[selectedId] ?? TEMPLATE_VISUALS['elegant-wedding']
              return tpl ? (
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-border/40">
                    <Image src={v.image} alt={tpl.name} width={36} height={36} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-ink truncate">
                      {tpl.name.split('—')[0].trim()}
                    </p>
                    <PlanBadge templateId={tpl.id} />
                  </div>
                </div>
              ) : null
            })()}
            <button
              onClick={onContinue}
              className="gold-button shrink-0 rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2"
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewId && (
          <TemplatePreviewModal
            templateId={previewId}
            onClose={() => setPreviewId(null)}
            onUse={() => {
              onSelect(previewId)
              setPreviewId(null)
              onContinue()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
