'use client'

import FormEditor from '@/components/editor/FormEditor'
import type { TemplateData } from '@/modules/templates/data'

interface Step4EnrichProps {
  selectedTemplate: TemplateData
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
}

export default function Step4Enrich({
  selectedTemplate, data, onChange, onBack, onContinue,
}: Step4EnrichProps) {
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

      {/* No upgrade nudge here. Every template is bought on its own, so there
          is no tier to climb — telling someone mid-form that a field they are
          filling in is locked only makes them doubt the purchase. */}

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
