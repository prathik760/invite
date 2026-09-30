'use client'

import FormEditor from '@/components/editor/FormEditor'
import StepShell from '@/components/create/StepShell'
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
    <StepShell
      step={4}
      title="Make it beautiful"
      sub="Photos, music and a personal note — all optional."
      badge="Optional"
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Preview & publish"
    >
      {/* No upgrade nudge here. Every design is bought on its own, so there is
          no tier to climb — telling someone mid-form that a field they are
          filling in is locked only makes them doubt the purchase. */}
      <FormEditor
        key={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['enrich']}
      />
    </StepShell>
  )
}
