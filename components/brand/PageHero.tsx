import Link from 'next/link'
import type { ReactNode } from 'react'

export interface Crumb {
  name: string
  href?: string
}

/** Visual breadcrumb. Pages keep emitting their own BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[0.85rem] text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={`${c.name}-${i}`} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-burnished/60">/</span>}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-charcoal">{c.name}</Link>
            ) : (
              <span className="text-charcoal" aria-current={i === items.length - 1 ? 'page' : undefined}>{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * The opening of every inner page: breadcrumb, eyebrow, one H1, a lede, the
 * page's primary actions, and an optional visual on the right.
 *
 * Entrance motion is transform-only (`enter-*`), because the H1 is usually the
 * LCP element and Chrome ignores elements whose opacity is 0.
 */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  actions,
  aside,
  footnote,
  align = 'left',
}: {
  crumbs?: Crumb[]
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  /** Buttons — use .btn-primary / .btn-outline links. */
  actions?: ReactNode
  /** Right-hand visual (image, cards, offer summary). */
  aside?: ReactNode
  /** Small line under the actions, e.g. "Free to build · Pay once". */
  footnote?: ReactNode
  align?: 'left' | 'center'
}) {
  const centered = align === 'center' && !aside
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_88%_8%,rgba(232,200,102,0.2),transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(251,239,227,0.9),transparent_70%)]"
      />
      <div className="shell relative pb-14 pt-8 sm:pb-20 sm:pt-10">
        {crumbs && <Breadcrumbs items={crumbs} className={centered ? '[&_ol]:justify-center' : ''} />}
        <div className={`mt-8 grid grid-cols-1 items-center gap-10 ${aside ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
          <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            {eyebrow && <p className="eyebrow enter-0">{eyebrow}</p>}
            <h1 className={`t-h1 enter-0 ${eyebrow ? 'mt-4' : ''}`}>{title}</h1>
            {lede && <p className={`t-lede enter-1 mt-5 ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{lede}</p>}
            {actions && (
              <div className={`enter-2 mt-8 flex flex-col gap-3 sm:flex-row ${centered ? 'sm:justify-center' : ''}`}>{actions}</div>
            )}
            {footnote && <div className={`enter-2 mt-5 text-[0.88rem] text-muted ${centered ? '[&_ul]:justify-center' : ''}`}>{footnote}</div>}
          </div>
          {aside && <div className="enter-4">{aside}</div>}
        </div>
      </div>
    </section>
  )
}
