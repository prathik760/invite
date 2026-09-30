import Link from 'next/link'
import type { ReactNode } from 'react'
import TrackedLink from '@/components/ui/TrackedLink'
import { LogoMark } from '@/components/brand/Logo'
import { ArrowRightIcon } from '@/components/ui/Icons'

/**
 * The closing statement on a page: emerald band, the brand mark, one headline
 * and one primary action. Every page ends here before the footer, so the last
 * thing a visitor sees is always the same clear next step.
 */
export default function CtaBand({
  eyebrow = 'Your story starts here',
  title = 'Ready to create your invitation?',
  sub = 'Choose a design, make it yours and share the celebration — free until you publish.',
  primary = { href: '/create', label: 'Create your invitation' },
  secondary = { href: '/templates', label: 'Browse designs' },
  location = 'cta_band',
}: {
  eyebrow?: string
  title?: ReactNode
  sub?: ReactNode
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string } | null
  /** Analytics placement id. */
  location?: string
}) {
  return (
    <section className="relative overflow-hidden bg-emerald text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(232,200,102,0.16),transparent_70%)]"
      />
      <div className="shell relative py-16 text-center sm:py-24" data-reveal>
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="mt-6 text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft">{eyebrow}</p>
        <h2 className="t-h2 mx-auto mt-3 max-w-3xl">{title}</h2>
        {sub && <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-7 text-paper/70">{sub}</p>}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={primary.href}
            location={location}
            className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
          >
            {primary.label}
            <ArrowRightIcon />
          </TrackedLink>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center rounded-full border border-paper/25 px-8 py-4 text-[1rem] font-semibold text-paper/90 transition-colors hover:bg-paper/10"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
