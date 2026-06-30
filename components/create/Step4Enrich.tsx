'use client'

import Link from 'next/link'
import FormEditor from '@/components/editor/FormEditor'
import type { TemplateData } from '@/modules/templates/data'
import { type PlanId, planLevel } from '@/lib/plans'

interface Step4EnrichProps {
  selectedTemplate: TemplateData
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  userPlan: PlanId
  onBack: () => void
  onContinue: () => void
}

export default function Step4Enrich({
  selectedTemplate, data, onChange, userPlan, onBack, onContinue,
}: Step4EnrichProps) {
  const level = planLevel(userPlan)
  const needsMusicUpgrade = level < 1
  const needsGalleryUpgrade = level < 2

  return (
    <div>
      {/* Step header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.24em] mb-1" style={{ color: '#B87924' }}>
            Step 4 of 5
          </p>
          <p className="text-base font-bold text-ink">Make it beautiful</p>
          <p className="text-xs text-muted mt-0.5">Add photos, music, and a personal note — all optional.</p>
        </div>
        <span
          className="shrink-0 mt-1 text-[9px] font-bold uppercase tracking-[.16em] px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(47,118,109,0.1)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.2)' }}
        >
          Optional
        </span>
      </div>

      {/* Upgrade nudge for free plan users */}
      {(needsGalleryUpgrade || needsMusicUpgrade) && userPlan !== 'gold' && (
        <div
          className="mx-4 mt-4 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(184,138,68,0.2)', background: 'rgba(184,138,68,0.04)' }}
        >
          <div className="px-4 py-3.5 flex items-start gap-3">
            <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink">
                {needsGalleryUpgrade && needsMusicUpgrade
                  ? 'Gallery and music require an upgrade'
                  : 'Photo gallery requires an upgrade'}
              </p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                {needsGalleryUpgrade && needsMusicUpgrade
                  ? 'Fill in the fields below — your invite publishes now and unlocks when you upgrade.'
                  : 'Music is included in your plan. Gallery unlocks from Premium (₹999).'}
              </p>
              <Link
                href="/pricing"
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold"
                style={{ color: '#B87924' }}
              >
                See all plans →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Form — gallery, music, personal note */}
      <FormEditor
        key={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['enrich']}
      />

      {/* Desktop nav buttons */}
      <div className="hidden md:flex gap-3 px-5 pt-2 pb-6 border-t border-border/40">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border text-muted hover:text-foreground hover:border-[rgba(184,138,68,0.4)] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          className="gold-button flex-[2] py-3 rounded-xl text-sm font-semibold"
        >
          Preview &amp; Publish →
        </button>
      </div>

      {/* Mobile spacer */}
      <div className="h-24 md:h-0" />
    </div>
  )
}
