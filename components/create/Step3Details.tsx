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

/** The step's heading: a love letter has no date or venue, and a design without either says so. */
function heading(t: TemplateData): { title: string; sub: string } {
  if (t.id.startsWith('confession-')) return { title: 'What do you want to say?', sub: 'Your letter, the question, and what they see when they say yes.' }
  const keys = new Set(t.config.fields.map((f) => f.key))
  if (!keys.has('date') && !keys.has('venue')) return { title: 'A few more details', sub: 'Everything else your design shows.' }
  return { title: 'When & where?', sub: 'Date, time and venue: the essentials your guests need.' }
}

export default function Step3Details({ selectedTemplate, data, onChange, onBack, onContinue }: Step3DetailsProps) {
  const { title, sub } = heading(selectedTemplate)
  return (
    <StepShell
      step={3}
      title={title}
      sub={sub}
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
