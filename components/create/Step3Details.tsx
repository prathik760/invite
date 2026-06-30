'use client'

import FormEditor from '@/components/editor/FormEditor'
import type { TemplateData } from '@/modules/templates/data'

interface Step3DetailsProps {
  selectedTemplate: TemplateData
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
}

export default function Step3Details({ selectedTemplate, data, onChange, onBack, onContinue }: Step3DetailsProps) {
  return (
    <div>
      {/* Step header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] mb-1" style={{ color: '#B87924' }}>
          Step 3 of 5
        </p>
        <p className="text-base font-bold text-ink">When &amp; where?</p>
        <p className="text-xs text-muted mt-0.5">Date, time, venue — the essentials your guests need.</p>
      </div>

      {/* Form — when/where + schedule fields */}
      <FormEditor
        key={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['details']}
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
          Continue →
        </button>
      </div>

      {/* Mobile spacer */}
      <div className="h-24 md:h-0" />
    </div>
  )
}
