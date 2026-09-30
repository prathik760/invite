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
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-line bg-peach/60 px-4 py-3.5 sm:mx-5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald text-paper">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.88rem] font-semibold text-charcoal">Your progress is saved on this device</p>
            <p className="mt-0.5 text-[0.8rem] leading-5 text-charcoal/70">Sign in to keep your invitation and guest wishes in your account.</p>
            <Link href="/auth/login?callbackUrl=/create" className="link mt-1.5 inline-flex text-[0.82rem]">
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Form — people fields only */}
      <FormEditor
        key={selectedTemplate.id}
        config={selectedTemplate.config}
        data={data}
        onChange={onChange}
        compact
        sections={['people']}
      />
    </StepShell>
  )
}
