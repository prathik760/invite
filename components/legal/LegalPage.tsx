import Image from 'next/image'
import Link from 'next/link'
import SiteFooter from '@/components/landing/SiteFooter'

// ─── Reusable content atoms (keep the three legal pages visually consistent) ───

export function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-8 text-muted">{children}</p>
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-lg text-ink mt-7 mb-2">{children}</h3>
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-7 text-muted">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A441]" />
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
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width={120} height={32} />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            {eyebrow}
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-5xl mt-4">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{subtitle}</p>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Body: sticky table of contents + content */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24" aria-label="On this page">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">On this page</p>
              <ul className="space-y-2 border-l border-border">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l-2 border-transparent pl-4 text-[13px] leading-6 text-muted transition-colors hover:border-[#D9A441] hover:text-foreground"
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
              <div className="mb-10 rounded-2xl border border-[#E8DCCD] bg-[#FFF9F2] p-6 text-[15px] leading-8 text-muted">
                {intro}
              </div>
            )}

            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="font-display text-2xl text-ink sm:text-[26px] mb-4">
                    <span className="text-accent">{i + 1}.</span> {s.title}
                  </h2>
                  <div className="space-y-4">{s.body}</div>
                </section>
              ))}
            </div>

            {/* Related policies */}
            <div className="mt-14 border-t border-border pt-8">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Related policies</p>
              <div className="flex flex-wrap gap-3">
                {RELATED.filter(r => r.label !== title).map(r => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground transition-colors hover:border-[#D9A441] hover:text-accent-strong"
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
