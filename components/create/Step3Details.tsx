'use client'

import FormEditor from '@/components/editor/FormEditor'
import StepShell from '@/components/create/StepShell'
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
    <StepShell
      step={3}
      title="When & where?"
      sub="Date, time and venue — the essentials your guests need."
      onBack={onBack}
      onContinue={onContinue}
    >
      <FormEditor
        key={selectedTemplate.id}
        templateId={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['details']}
      />
    </StepShell>
  )
}
