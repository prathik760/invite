import SiteHeader from '@/components/layout/SiteHeader'
import Link from 'next/link'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'

// ─── Reusable content atoms (keep the three legal pages visually consistent) ───

export function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[1rem] leading-8 text-charcoal/75">{children}</p>
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-editorial font-semibold text-lg text-charcoal mt-7 mb-2">{children}</h3>
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-7 text-muted">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#A47945]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export interface LegalSection {
  id: string
  title: string
  body: React.ReactNode
}

interface LegalPageProps {
  eyebrow: string
  title: string
  subtitle: string
  lastUpdated: string
  intro?: React.ReactNode
  sections: LegalSection[]
}

const RELATED = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund & Cancellation Policy' },
]

export default function LegalPage({ eyebrow, title, subtitle, lastUpdated, intro, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      {/* Header */}
      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: title }]}
        eyebrow={eyebrow}
        title={title}
        lede={subtitle}
        footnote={<span className="text-[0.78rem] font-semibold uppercase tracking-[0.14em]">Last updated: {lastUpdated}</span>}
      />

      {/* Body: sticky table of contents + content */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[calc(6rem_+_var(--promo-bar-h,0px))]" aria-label="On this page">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">On this page</p>
              <ul className="space-y-2 border-l border-line">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l-2 border-transparent pl-4 text-[13px] leading-6 text-muted transition-colors hover:border-[#A47945] hover:text-foreground"
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 max-w-3xl">
            {intro && (
              <div className="mb-10 rounded-2xl border border-[#EADFD2] bg-[#FFFAF4] p-6 text-[15px] leading-8 text-muted">
                {intro}
              </div>
            )}

            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="t-h3 mb-4">
                    <span className="text-accent">{i + 1}.</span> {s.title}
                  </h2>
                  <div className="space-y-4">{s.body}</div>
                </section>
              ))}
            </div>

            {/* Related policies */}
            <div className="mt-14 border-t border-line pt-8">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Related policies</p>
              <div className="flex flex-wrap gap-3">
                {RELATED.filter(r => r.label !== title).map(r => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-foreground transition-colors hover:border-[#A47945] hover:text-accent-strong"
                  >
                    {r.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
