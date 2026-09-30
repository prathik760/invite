import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/ui/Icons'

/**
 * Page building blocks. Every marketing page is a stack of <Section>s so that
 * rhythm, width and colour bands are identical site-wide.
 *
 *   champagne — default page background
 *   paper     — lifted band, hairline borders top and bottom
 *   peach     — warm tint for "how it works" / reassurance bands
 *   emerald   — brand band for global / closing statements (light text)
 *   charcoal  — reserved for the footer and rare dark moments (light text)
 */
export type Tone = 'champagne' | 'paper' | 'peach' | 'emerald' | 'charcoal'

const TONES: Record<Tone, string> = {
  champagne: 'bg-champagne text-charcoal',
  paper: 'border-y border-line bg-paper text-charcoal',
  peach: 'bg-peach/60 text-charcoal',
  emerald: 'bg-emerald text-paper',
  charcoal: 'bg-charcoal text-paper',
}

export const isDark = (tone: Tone) => tone === 'emerald' || tone === 'charcoal'

export function Section({
  tone = 'champagne',
  id,
  className = '',
  innerClassName = '',
  size = 'md',
  children,
  ...aria
}: {
  tone?: Tone
  id?: string
  className?: string
  innerClassName?: string
  /** Vertical rhythm: sm for bands and strips, md for normal sections. */
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const pad = size === 'sm' ? 'py-10 sm:py-12' : size === 'lg' ? 'py-20 sm:py-28' : 'py-16 sm:py-24'
  return (
    <section id={id} className={`${TONES[tone]} ${className}`} {...aria}>
      <div className={`shell ${pad} ${innerClassName}`}>{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  align = 'left',
  tone = 'champagne',
  as: Tag = 'h2',
  id,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  action?: { href: string; label: string }
  align?: 'left' | 'center'
  /** The section's tone, so text colours invert on dark bands. */
  tone?: Tone
  as?: 'h1' | 'h2' | 'h3'
  id?: string
}) {
  const dark = isDark(tone)
  const centered = align === 'center'
  return (
    <div
      data-reveal
      className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}
    >
      <div className={centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className={dark ? 'text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft' : 'eyebrow'}>{eyebrow}</p>
        )}
        <Tag id={id} className={`t-h2 ${eyebrow ? 'mt-3' : ''}`}>{title}</Tag>
        {sub && <p className={`mt-4 text-[1.05rem] leading-8 ${dark ? 'text-paper/75' : 'text-charcoal/75'}`}>{sub}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`inline-flex shrink-0 items-center gap-1.5 text-[0.95rem] font-semibold underline-offset-4 hover:underline ${
            dark ? 'text-gold-soft' : 'text-emerald-soft'
          }`}
        >
          {action.label}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  )
}
