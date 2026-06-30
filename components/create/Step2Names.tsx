'use client'

import type { Session } from 'next-auth'
import Link from 'next/link'
import FormEditor from '@/components/editor/FormEditor'
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
    <div>
      {/* Step header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] mb-1" style={{ color: '#B87924' }}>
          Step 2 of 5
        </p>
        <p className="text-base font-bold text-ink">Who&apos;s the event for?</p>
        <p className="text-xs text-muted mt-0.5">Add names and photos — the invite updates live as you type.</p>
      </div>

      {/* Soft sign-in nudge (only for guests) */}
      {!session && (
        <div
          className="mx-4 mt-4 px-4 py-3 rounded-2xl flex items-start gap-3"
          style={{ background: 'rgba(184,138,68,0.05)', border: '1px solid rgba(184,138,68,0.18)' }}
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink">Sign in to save your progress</p>
            <p className="text-xs text-muted mt-0.5">Your invite link and guest wishes will be saved to your account.</p>
            <Link
              href="/auth/login?callbackUrl=/create"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: '#B87924' }}
            >
              Sign in →
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

      {/* Mobile spacer (behind sticky CTA) */}
      <div className="h-24 md:h-0" />
    </div>
  )
}
