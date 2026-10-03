'use client'

import type { Session } from 'next-auth'
import Link from 'next/link'
import FormEditor from '@/components/editor/FormEditor'
import StepShell from '@/components/create/StepShell'
import type { TemplateData } from '@/modules/templates/data'

interface Step2NamesProps {
  selectedTemplate: TemplateData
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  session: Session | null
  onBack: () => void
  onContinue: () => void
}

export default function Step2Names({ selectedTemplate, data, onChange, session, onBack, onContinue }: Step2NamesProps) {
  return (
    <StepShell
      step={2}
      title="Who's it for?"
      sub="Add names and photos — the preview updates as you type."
      onBack={onBack}
      onContinue={onContinue}
    >
      {/* Soft sign-in nudge (only for guests). Progress is autosaved in this
          browser either way; an account keeps the invitation and its wishes. */}
      {!session && (
        <p className="mx-4 mt-3 text-[0.8rem] leading-5 text-charcoal/70 sm:mx-5">
          <span className="font-semibold text-charcoal">No account needed</span> — your progress is saved on this device.{' '}
          <Link href="/auth/login?callbackUrl=/create" className="link">Sign in</Link> if you have one.
        </p>
      )}

      {/* Form — people fields only */}
      <FormEditor
        key={selectedTemplate.id}
        templateId={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['people']}
      />
    </StepShell>
  )
}
