'use client'

import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/ui/Icons'

/**
 * The frame shared by builder steps 2–4: step label, title and subtitle, the
 * form, and (desktop only — mobile uses the docked bar in app/create) the
 * Back / Continue buttons.
 */
export default function StepShell({
  step,
  title,
  sub,
  badge,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  children,
}: {
  step: number
  title: string
  sub: string
  badge?: string
  onBack: () => void
  onContinue: () => void
  continueLabel?: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 pb-5 pt-6">
        <div>
          <p className="eyebrow">Step {step} of 5</p>
          <h2 className="t-h3 mt-1.5">{title}</h2>
          <p className="mt-1 text-[0.88rem] leading-6 text-charcoal/70">{sub}</p>
        </div>
        {badge && (
          <span className="mt-1 shrink-0 rounded-full border border-line bg-peach px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-burnished-deep">
            {badge}
          </span>
        )}
      </div>

      {children}

      <div className="hidden gap-3 border-t border-line px-5 pb-6 pt-4 md:flex">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline flex-1 rounded-full py-3 text-[0.9rem] font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary flex flex-[2] items-center justify-center gap-2 rounded-full py-3 text-[0.9rem] font-semibold"
        >
          {continueLabel}
          <ArrowRightIcon />
        </button>
      </div>

      {/* Mobile spacer (behind the docked Back/Continue bar) */}
      <div className="h-24 md:h-0" />
    </div>
  )
}
