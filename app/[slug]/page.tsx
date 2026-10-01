import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion from '@/components/landing/FAQAccordion'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import TrackedLink from '@/components/ui/TrackedLink'
import TemplateCard from '@/components/catalog/TemplateCard'
import PageHero from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, GlobeIcon, LinkIcon, PhoneIcon } from '@/components/ui/Icons'
import { OCCASIONS } from '@/lib/catalog'
import { buildCatalogItems } from '@/lib/catalogItems'
import {
  findLocationPage,
  findSeoPage,
  landingPages,
  locationPages,
  pageKeywords,
  type LocationPage,
  type SeoPage,
} from '@/content/seo-pages'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  DEFAULT_OG_IMAGE,
  faqJsonLd,
  SITE_NAME,
} from '@/lib/seo'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return [...landingPages, ...locationPages].map((page) => ({ slug: page.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const page = findSeoPage(params.slug)
  const locationPage = findLocationPage(params.slug)

  if (!page && !locationPage) return {}

  const title = page?.title ?? locationPage!.title
  const description = page?.description ?? locationPage!.description
  const url = absoluteUrl(`/${params.slug}`)

  return {
    title,
    description,
    robots: { index: true, follow: true },
    keywords: page ? pageKeywords(page) : ['digital invitations', `digital invitations ${locationPage!.city}`, 'online invitation maker', 'whatsapp invitation card'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

// Shared value props for these pages. The old copy promised an "online RSVP
// workflow" on every invitation (RSVP exists on one design), a "loads under
// 2 seconds" figure nobody measured, and that pages could be updated after
// sharing — none of which is true today.
const VALUES = [
  { Icon: LinkIcon, title: 'One link, shared anywhere', desc: 'A rich preview in WhatsApp chats shows your names and design before guests even open it.' },
  { Icon: PhoneIcon, title: 'Made for phones', desc: 'Maps, countdown, gallery and schedule are laid out for the screen guests actually use.' },
  { Icon: GlobeIcon, title: 'Guests anywhere', desc: 'Opens in any browser, in any country — no app, no account, no sign-up.' },
]

function LandingPage({ page }: { page: SeoPage }) {
  const url = absoluteUrl(`/${page.slug}`)
  const schemas = [
    faqJsonLd(page.faqs),
    collectionPageJsonLd(page.h1, page.description, url),
    breadcrumbJsonLd([
      { name: 'Home', url: absoluteUrl('/') },
      { name: page.h1, url },
    ]),
  ]
  const items = buildCatalogItems(page.templateLinks, { keepOrder: true }).filter((i) => page.templateLinks.includes(i.id))

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      {schemas.map((schema, index) => (
        <JsonLd key={index} id={`landing-jsonld-${index}`} data={schema} />
      ))}
      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: page.h1 }]}
        eyebrow={page.primaryKeyword}
        title={page.h1}
        lede={`${page.description} Choose a design, add your details, preview it before you pay and share one link.`}
        actions={
          <>
            <TrackedLink
              href="/create?src=seo_landing"
              location="seo_landing_hero"
              meta={{ page_type: 'seo_landing', landing_slug: page.slug, event_type: page.occasion }}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
            >
              Create your invitation <ArrowRightIcon />
            </TrackedLink>
            <TrackedLink
              href="/templates"
              location="seo_landing_hero_secondary"
              meta={{ page_type: 'seo_landing', landing_slug: page.slug }}
              className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold"
            >
              See the designs
            </TrackedLink>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta="Create your invitation" location="seo_landing_offer" />}
      />

      <Section tone="paper" aria-label="Why a digital invitation">
        <ul className="grid gap-4 md:grid-cols-3" data-reveal-group>
          {VALUES.map(({ Icon, title, desc }) => (
            <li key={title} className="card-quiet p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald text-gold-soft"><Icon className="h-5 w-5" /></span>
              <h2 className="t-h3 mt-5">{title}</h2>
              <p className="mt-2 text-[0.93rem] leading-7 text-charcoal/75">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-label={`About ${page.occasion} invitations`}>
        <div className="mx-auto max-w-3xl" data-reveal>
          <p className="eyebrow">Why it works</p>
          <h2 className="t-h2 mt-3">A better {page.occasion} invitation</h2>
          <div className="prose-brand mt-6">
            <p>
              A good {page.occasion} invitation needs more than attractive colours. Guests need the date, time, venue, a
              direction link, a note from the family and the schedule. ShareInvite turns those details into one polished
              page that feels natural when it is opened from WhatsApp.
            </p>
            <p>
              For {page.audience}, the hard part is coordination. Printed cards and static images are easy to forward but
              hide details inside a compressed picture. One invitation page keeps the map link, timings, photos and
              message together — readable, tappable and easy to reopen before the event.
            </p>
            <p>
              The experience is calm for guests: one link opens the invitation, one tap opens Google Maps, and on event
              designs they can leave you a wish right on the page.
            </p>
          </div>
        </div>
      </Section>

      {items.length > 0 && (
        <Section tone="paper" aria-label="Recommended designs">
          <SectionHeading eyebrow="Recommended" title="Designs for this invitation" action={{ href: '/templates', label: 'Every design' }} />
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
            {items.map((item) => <TemplateCard key={item.id} item={item} source="seo_landing_gallery" />)}
          </div>
          <p className="mt-8 text-[0.92rem] text-charcoal/70">
            Planning something we don&apos;t have a design for yet? <Link href="/#custom-template" className="link">Request a custom design</Link>.
          </p>
        </Section>
      )}

      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title="Three steps to your invitation" />
        <div className="mt-12"><HowItWorks /></div>
      </Section>

      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-10"><FAQAccordion faqs={page.faqs} /></div>
      </Section>

      <Section size="sm" aria-label="Related pages">
        <p className="eyebrow">Explore more invitation types</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {page.relatedLinks.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link href={link.href} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">{link.label}</Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Start your invitation in minutes" location="seo_landing_footer" />
      <SiteFooter />
      <StickyCTA pageType="seo_landing" />
    </main>
  )
}

function LocationLandingPage({ page }: { page: LocationPage }) {
  const url = absoluteUrl(`/${page.slug}`)
  const schemas = [
    faqJsonLd(page.faqs),
    collectionPageJsonLd(page.title, page.description, url),
    breadcrumbJsonLd([
      { name: 'Home', url: absoluteUrl('/') },
      { name: page.title, url },
    ]),
  ]
  const items = buildCatalogItems(['luxury-wedding', 'indian-birthday', 'indian-engagement', 'griha-pravesh'], { keepOrder: true }).slice(0, 4)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      {schemas.map((schema, index) => (
        <JsonLd key={index} id={`location-jsonld-${index}`} data={schema} />
      ))}
      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: `Digital invitations in ${page.city}` }]}
        eyebrow={`Digital invitations in ${page.city}`}
        title={<>Digital Invitations <em className="font-medium text-burnished">in {page.city}</em></>}
        lede={`${page.description} One beautiful invitation page for guests across ${page.city}, other cities and family anywhere in the world.`}
        actions={
          <>
            <Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Create your invitation <ArrowRightIcon />
            </Link>
            <Link href="/templates" className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the designs
            </Link>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta="Create your invitation" location="city_landing_offer" />}
      />

      <Section tone="paper" aria-label={`Why ${page.city} hosts choose digital invitations`}>
        <div className="mx-auto max-w-3xl" data-reveal>
          <p className="eyebrow">Made for {page.city}</p>
          <h2 className="t-h2 mt-3">Why {page.city} hosts choose digital invitations</h2>
          <div className="prose-brand mt-6">
            <p>
              Events in {page.city} move fast. Families coordinate on WhatsApp, guests travel from different
              neighbourhoods, and the venue details get checked more than once. One invitation link holds the date,
              time, address, map, schedule, message and photos.
            </p>
            <p>
              Guests open it straight from a chat, tap the map, read the schedule and come back to the same link before
              they leave for the venue. There is no printing, courier or round of image edits to wait for.
            </p>
            <p>
              The designs carry the details Indian celebrations need — muhurat, pooja timing, ceremony schedule, dress
              code, reception and family notes — for local guests, relatives in other cities and family abroad alike.
            </p>
          </div>
        </div>
      </Section>

      <Section aria-label={`Invitations in ${page.city}`}>
        <SectionHeading eyebrow="By occasion" title={`Popular invitations in ${page.city}`} />
        <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
          {OCCASIONS.map((o) => (
            <li key={o.key}>
              <Link href={o.href} className="pill px-4 py-2 text-[0.9rem] hover:border-burnished">{o.label}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4" data-reveal-group>
          {items.map((item) => <TemplateCard key={item.id} item={item} source="city_landing_gallery" />)}
        </div>
      </Section>

      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title="Three steps to your invitation" />
        <div className="mt-12"><HowItWorks /></div>
      </Section>

      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-10"><FAQAccordion faqs={page.faqs} /></div>
      </Section>

      <CtaBand title={`Create a ${page.city} invitation today`} location="city_landing_footer" />
      <SiteFooter />
      <StickyCTA pageType="city_landing" />
    </main>
  )
}

export default function SeoRoutePage({ params }: Props) {
  const page = findSeoPage(params.slug)
  if (page) return <LandingPage page={page} />

  const locationPage = findLocationPage(params.slug)
  if (locationPage) return <LocationLandingPage page={locationPage} />

  notFound()
}
