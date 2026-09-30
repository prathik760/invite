import Link from 'next/link'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion, { type Faq } from '@/components/landing/FAQAccordion'
import TemplateCard from '@/components/catalog/TemplateCard'
import PageHero from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon, EyeIcon, LinkIcon, PenIcon } from '@/components/ui/Icons'
import { OCCASION_MAP } from '@/lib/catalog'
import { buildCatalogItems } from '@/lib/catalogItems'
import { templatePrice } from '@/lib/plans'

/**
 * One layout for every occasion landing page (wedding, birthday, engagement…).
 *
 * Pages keep their own metadata, FAQ data and JSON-LD; this renders the body so
 * all occasions read as one product: hero with the single-design offer, the
 * real designs for the occasion, the page's own content, how it works, FAQ,
 * local links and the closing band.
 *
 * Deliberately absent: testimonials and review stars (none are verified), and
 * any tiered price ladder — each design has one price, shown on its card.
 */
export interface OccasionPageProps {
  /** Key in lib/catalog OCCASIONS — selects the design cards. */
  occasion: string
  /** Template the primary CTAs open with. */
  templateId: string
  /** Analytics placement prefix, e.g. "wedding_landing". */
  pageKey: string
  crumb: string
  eyebrow: string
  title: ReactNode
  lede: string
  ctaLabel: string
  /** Optional "types of ceremony" / "milestones" grid. */
  types?: { eyebrow?: string; title: string; sub?: string; items: { name: string; tag?: string; desc: string }[] }
  features: { title: string; sub?: string; items: { icon: ReactNode; title: string; desc: string }[] }
  steps?: { title: string; copy: string }[]
  stepsTitle?: string
  faqTitle: string
  faqs: Faq[]
  cities?: { base: string; title: string; list: string[] }
  related?: { href: string; label: string }[]
  closing: { title: string; sub?: string }
  /** Extra page-specific sections, rendered before the FAQ. */
  children?: ReactNode
}

const STEP_ICONS = [EyeIcon, PenIcon, LinkIcon]

export default function OccasionPage(p: OccasionPageProps) {
  const createHref = `/create?template=${p.templateId}&src=${p.pageKey}`
  const occasion = OCCASION_MAP[p.occasion]
  const items = buildCatalogItems(occasion?.templateIds)
  const price = templatePrice(p.templateId)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <SiteHeader createHref={`/create?template=${p.templateId}`} />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: p.crumb }]}
        eyebrow={p.eyebrow}
        title={p.title}
        lede={p.lede}
        actions={
          <>
            <TrackedLink
              href={createHref}
              location={`${p.pageKey}_hero`}
              meta={{ template_id: p.templateId, price, page_type: 'event_landing' }}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
            >
              {p.ctaLabel}
              <ArrowRightIcon />
            </TrackedLink>
            <a href="#designs" className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the designs
            </a>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta={p.ctaLabel} href={createHref} location={`${p.pageKey}_offer`} />}
      />

      {items.length > 0 && (
        <Section id="designs" aria-label={`${occasion?.short ?? 'Invitation'} designs`}>
          <SectionHeading
            eyebrow="The designs"
            title={`${occasion?.short ?? 'Invitation'} designs`}
            sub="Tap any design for a live preview. Each has one price, paid once when you publish."
            action={{ href: '/templates', label: 'Every design' }}
          />
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
            {items.map((item) => (
              <TemplateCard key={item.id} item={item} source={`${p.pageKey}_gallery`} />
            ))}
          </div>
        </Section>
      )}

      {p.types && (
        <Section tone="paper" aria-label={p.types.title}>
          <SectionHeading eyebrow={p.types.eyebrow ?? 'Every tradition'} title={p.types.title} sub={p.types.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            {p.types.items.map((t) => (
              <li key={t.name} className="card-quiet p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="t-h3">{t.name}</p>
                  {t.tag && <span className="pill shrink-0 border-transparent bg-peach text-burnished-deep">{t.tag}</span>}
                </div>
                <p className="mt-2 text-[0.93rem] leading-7 text-charcoal/75">{t.desc}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section aria-label={p.features.title}>
        <SectionHeading eyebrow="What's included" title={p.features.title} sub={p.features.sub} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {p.features.items.map((f) => (
            <li key={f.title} className="flex items-start gap-4 rounded-3xl border border-line bg-paper p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-soft [&>svg]:h-5 [&>svg]:w-5">
                {f.icon}
              </span>
              <span>
                <span className="block font-editorial text-[1.3rem] font-semibold leading-tight">{f.title}</span>
                <span className="mt-1 block text-[0.9rem] leading-6 text-charcoal/70">{f.desc}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.85rem] text-muted">Features vary by design — the live preview shows exactly what each one includes.</p>
      </Section>

      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title={p.stepsTitle ?? 'Three steps to your invitation'} />
        <div className="mt-12">
          <HowItWorks steps={p.steps?.map((s, i) => ({ ...s, Icon: STEP_ICONS[i % 3] }))} />
        </div>
      </Section>

      {p.children}

      <Section tone="paper" id="faq" aria-label={p.faqTitle}>
        <SectionHeading align="center" eyebrow="Questions" title={p.faqTitle} />
        <div className="mt-10">
          <FAQAccordion faqs={p.faqs} />
        </div>
      </Section>

      {(p.cities || p.related) && (
        <Section size="sm" aria-label="Related pages">
          <div className="grid gap-8 md:grid-cols-2">
            {p.cities && (
              <div>
                <p className="eyebrow">{p.cities.title}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.cities.list.map((city) => (
                    <li key={city}>
                      <Link href={`${p.cities!.base}/${city}`} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.related && (
              <div>
                <p className="eyebrow">Explore more</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.related.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      <CtaBand
        title={p.closing.title}
        sub={p.closing.sub ?? `Free to build & preview · ₹${price.toLocaleString('en-IN')} one-time to publish · Ready to share in minutes`}
        primary={{ href: `/create?template=${p.templateId}&src=${p.pageKey}_footer`, label: p.ctaLabel }}
        secondary={{ href: '/templates', label: 'Browse every design' }}
        location={`${p.pageKey}_footer`}
      />
      <SiteFooter />
    </main>
  )
}

/** Visible FAQ and FAQPage JSON-LD from one list, so they can never diverge. */
export function faqPageJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}
