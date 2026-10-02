'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { TEMPLATES } from '@/modules/templates/data'
import { getRequiredPlan } from '@/lib/plans'
import { OCCASIONS, displayName, is3D, styleTag } from '@/lib/catalog'
import BottomDock from '@/components/ui/BottomDock'
import { ArrowRightIcon, CheckIcon, EyeIcon, SwapIcon } from '@/components/ui/Icons'
import { TEMPLATE_VISUALS } from './templateVisuals'
import { useLocalPrice } from '@/components/price/Price'

const TemplatePreviewModal = dynamic(() => import('./TemplatePreviewModal'), { ssr: false })

// Same occasions as the public gallery, so a visitor who filtered "Festival"
// on /templates finds the same set here. Occasions with no designs are omitted.
const TABS = [
  { value: 'all', label: 'All designs' },
  ...OCCASIONS.filter((o) => o.templateIds.some((id) => TEMPLATES.some((t) => t.id === id)))
    .map((o) => ({ value: o.key, label: o.short })),
]

function PlanBadge({ templateId }: { templateId: string }) {
  const plan = getRequiredPlan(templateId)
  const isFree = plan.price === 0
  const price = useLocalPrice(plan.price)
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-champagne px-2 py-0.5 text-[10px] font-bold tabular-nums text-charcoal">
      {isFree ? 'Free' : `${price.label} one-time`}
    </span>
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

  const occasion = OCCASIONS.find((o) => o.key === activeTab)
  const filtered = occasion ? TEMPLATES.filter((tpl) => occasion.templateIds.includes(tpl.id)) : TEMPLATES
  const selected = TEMPLATES.find((t) => t.id === selectedId)
  const selectedVisual = TEMPLATE_VISUALS[selectedId] ?? TEMPLATE_VISUALS['elegant-wedding']

  return (
    <div className="flex-1 bg-champagne">
      <div className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">

        {/* Page heading */}
        <div className="pb-6 pt-8">
          <p className="eyebrow">Step 1 of 5</p>
          <h1 className="mt-2 font-editorial text-[2.3rem] font-semibold leading-tight text-charcoal sm:text-[2.9rem]">
            Choose a design you love
          </h1>
          <p className="mt-2 max-w-2xl text-[0.98rem] leading-7 text-charcoal/75">
            Tap <strong className="font-semibold text-charcoal">Live preview</strong> to see any design exactly as your
            guests will. Nothing is final — you can come back and switch at any time.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-peach px-3 py-1.5 text-[0.8rem] font-medium text-charcoal">
            <SwapIcon className="h-3.5 w-3.5 text-emerald-soft" />
            Switching designs keeps the names, date and venue you&apos;ve already typed
          </p>
        </div>

        {/* Occasion tabs */}
        <div className="scrollbar-hide -mx-4 mb-6 overflow-x-auto sm:mx-0">
          <div className="flex gap-2 px-4 sm:flex-wrap sm:px-0" style={{ width: 'max-content', maxWidth: '100%' }}>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-[12px] font-semibold transition-colors ${
                  activeTab === tab.value
                    ? 'border-emerald bg-emerald text-paper'
                    : 'border-line bg-paper text-charcoal hover:border-burnished'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((tpl) => {
            const v = TEMPLATE_VISUALS[tpl.id] ?? TEMPLATE_VISUALS['elegant-wedding']
            const isActive = tpl.id === selectedId

            return (
              // outer div avoids nested <button> (invalid HTML); role="button" keeps a11y
              <div
                key={tpl.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(tpl.id)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(tpl.id) }
                }}
                className={`relative cursor-pointer select-none overflow-hidden rounded-2xl border-2 bg-paper text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 ${
                  isActive ? 'border-emerald shadow-lift' : 'border-line hover:border-burnished/60'
                }`}
                aria-pressed={isActive}
                aria-label={`${displayName(tpl.name)} — ${isActive ? 'selected' : 'select this design'}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-peach">
                  <Image
                    src={v.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />

                  {is3D(tpl.id) && (
                    <span className="absolute left-2 top-2 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-bold text-paper">3D</span>
                  )}

                  {/* Preview pill — always visible */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreviewId(tpl.id) }}
                    className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-paper/95 px-3.5 py-2 text-[11px] font-bold text-charcoal shadow-sm backdrop-blur transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={`Live preview of ${tpl.name}`}
                  >
                    <EyeIcon className="h-3 w-3" />
                    Live preview
                  </button>

                  {isActive && (
                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-paper shadow">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="px-3 py-2.5">
                  <p className="truncate font-editorial text-[1.15rem] font-semibold leading-tight text-charcoal">
                    {displayName(tpl.name)}
                  </p>
                  {/* Wraps the price under the style when both do not fit — on a 2-up
                      phone grid the style was truncated to "Ivory …". */}
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="truncate text-[11px] text-muted">{styleTag(tpl.id)}</span>
                    <PlanBadge templateId={tpl.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected template summary + CTA */}
        <BottomDock
          className="px-4 pt-3"
          style={{
            background: 'rgba(255,250,244,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #EADFD2',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
            {selected && (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-lg border border-line">
                  <Image src={selectedVisual.image} alt="" fill sizes="36px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Selected</p>
                  <p className="truncate text-[13px] font-semibold text-charcoal">{displayName(selected.name)}</p>
                </div>
                <span className="hidden sm:inline-flex"><PlanBadge templateId={selected.id} /></span>
              </div>
            )}
            <button
              type="button"
              onClick={onContinue}
              className="btn-primary flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Continue
              <ArrowRightIcon />
            </button>
          </div>
        </BottomDock>
      </div>

      {/* Preview modal */}
      {previewId && (
          <TemplatePreviewModal
            templateId={previewId}
            open
            onClose={() => setPreviewId(null)}
            onUse={() => {
              onSelect(previewId)
              setPreviewId(null)
              onContinue()
            }}
          />
        )}
    </div>
  )
}
