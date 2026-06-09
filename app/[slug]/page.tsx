import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import { TEMPLATES } from '@/modules/templates/data'
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
  templateSeoSlug,
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

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="font-display text-2xl tracking-wide text-ink">
          ShareInvite
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/templates" className="transition-colors hover:text-foreground">Templates</Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
          <Link href="/online-rsvp" className="transition-colors hover:text-foreground">RSVP</Link>
        </nav>
        <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">
          Create Invitation
        </Link>
      </div>
    </header>
  )
}

function TemplateLinks({ ids }: { ids: string[] }) {
  const templates = ids
    .map((id) => TEMPLATES.find((template) => template.id === id))
    .filter(Boolean) as typeof TEMPLATES

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Link
          key={template.id}
          href={`/templates/${templateSeoSlug(template.id)}`}
          className="rounded-lg border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {template.category || 'template'}
          </p>
          <h3 className="mt-2 font-heading text-lg text-ink">{template.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{template.description}</p>
        </Link>
      ))}
    </div>
  )
}

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

  const useCases = [
    `A strong ${page.occasion} invitation needs more than attractive colors. Guests need the date, time, venue, direction link, family note, ceremony schedule, and a clear way to respond. ShareInvite turns those details into a polished mobile page that feels natural when opened from WhatsApp.`,
    `For ${page.audience}, the biggest problem is coordination. Printed cards, PDFs, and static image invitations are easy to forward but hard to update. A ShareInvite page can hold the latest venue note, map link, timings, photos, and RSVP context in one place.`,
    `Every ${page.primaryKeyword} page is built to load quickly on mobile networks in India. The design avoids unnecessary steps for guests: one link opens the invitation, one tap opens Google Maps, and one action lets them share or send wishes.`,
  ]

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      {schemas.map((schema, index) => (
        <JsonLd key={index} id={`landing-jsonld-${index}`} data={schema} />
      ))}
      <Header />

      <section className="bg-[#FCF7F1] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong">
            {page.primaryKeyword} India
          </p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-6xl">
            {page.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
            {page.description} Built for WhatsApp sharing, RSVP tracking, Indian event details, fast mobile loading, and beautiful invitation templates that are ready to publish in minutes.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="gold-button rounded-full px-9 py-4 text-base font-semibold">
              Create Invitation
            </Link>
            <Link href="/templates" className="rounded-full border border-border bg-white px-9 py-4 text-base font-semibold text-ink">
              View Templates
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {['WhatsApp-ready link', 'Online RSVP workflow', 'Mobile-first invite pages'].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-background p-5">
              <h2 className="font-heading text-xl text-ink">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                ShareInvite keeps the guest journey simple: open the invitation, read the details, get directions, and respond without downloading anything.
              </p>
            </div>
          ))}
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-3xl font-normal text-ink">Why this page works for {page.occasion} invitations</h2>
        <div className="mt-7 space-y-6 text-base leading-8 text-muted">
          {useCases.map((copy) => (
            <p key={copy}>{copy}</p>
          ))}
          <p>
            The best invitation experience is calm, complete, and easy to forward. ShareInvite combines the emotional parts of an invitation, such as photos, story, music, colors, and personal message, with practical event details like schedule, venue address, Google Maps, and RSVP-ready interactions. This is especially useful for Indian celebrations where guests may travel across cities, coordinate with family groups, and check timings multiple times before the event.
          </p>
          <p>
            A traditional card is beautiful, but it cannot adapt after printing. A static WhatsApp image is convenient, but it often hides important details inside a compressed graphic. A digital invitation page solves both problems. Hosts get a premium invitation that can be shared instantly, while guests get readable information, clear calls to action, and a page they can revisit whenever they need.
          </p>
          <p>
            ShareInvite pages are also structured for search engines with clean canonical URLs, descriptive metadata, internal links, FAQ schema, and event-focused content. For hosts and planners, that means the platform is not just a design tool. It is a growth-ready invitation system for digital invitations, wedding cards, RSVP pages, and WhatsApp invitation campaigns.
          </p>
        </div>
      </article>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong">Templates</p>
              <h2 className="mt-2 font-display text-3xl font-normal text-ink">Recommended invitation templates</h2>
            </div>
            <Link href="/templates" className="text-sm font-semibold text-accent-strong">Browse all templates</Link>
          </div>
          <TemplateLinks ids={page.templateLinks} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-normal text-ink">Internal links for faster discovery</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {page.relatedLinks.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href} className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink transition-colors hover:text-accent-strong">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-normal text-ink">Frequently asked questions</h2>
          <div className="mt-7 space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-border bg-background p-6">
                <h3 className="font-heading text-lg text-ink">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-normal text-ink">Start your invitation in minutes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted">
            Choose a template, add your event details, preview the page, and publish a WhatsApp-ready invitation link with RSVP tracking.
          </p>
          <Link href="/create" className="gold-button mt-8 inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Start Free
          </Link>
        </div>
      </section>
      <SiteFooter />
      <StickyCTA />
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

  const events = ['weddings', 'engagements', 'birthdays', 'Griha Pravesh', 'baby showers', 'naming ceremonies', 'anniversaries', 'corporate events']

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      {schemas.map((schema, index) => (
        <JsonLd key={index} id={`location-jsonld-${index}`} data={schema} />
      ))}
      <Header />

      <section className="bg-[#FCF7F1] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong">
            Digital invitations in {page.city}
          </p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-6xl">
            Digital Invitations in {page.city}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
            {page.description} Build a beautiful invitation page for guests across {page.city}, nearby cities, and family groups anywhere in the world.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="gold-button rounded-full px-9 py-4 text-base font-semibold">
              Create Invitation
            </Link>
            <Link href="/wedding-invitations" className="rounded-full border border-border bg-white px-9 py-4 text-base font-semibold text-ink">
              Wedding Invites
            </Link>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-3xl font-normal text-ink">Why {page.city} hosts choose digital invitations</h2>
        <div className="mt-7 space-y-6 text-base leading-8 text-muted">
          <p>
            Events in {page.city} move fast. Families coordinate through WhatsApp, guests travel from different neighborhoods, and venue details often need to be checked more than once. A ShareInvite page gives hosts one reliable invitation link that contains the date, time, address, map, schedule, message, photos, and RSVP-ready actions.
          </p>
          <p>
            For {events.join(', ')}, a digital invitation is easier to manage than printed cards or static images. Guests can open the invite from WhatsApp, tap the map button, read the schedule, and revisit the same URL before leaving for the venue. Hosts can publish without waiting for printing, courier delivery, or multiple rounds of image edits.
          </p>
          <p>
            ShareInvite is built for Indian celebrations, so the page can carry details such as muhurat, pooja timing, ceremony schedule, dress code, reception, lunch, dinner, and family notes. This matters in {page.city}, where many events combine traditional rituals with modern venues and mobile-first guest communication.
          </p>
          <p>
            Search-friendly structure is included by default. Each page has a clean URL, canonical metadata, Open Graph previews for social sharing, FAQ schema, and internal links to templates, categories, blog guides, RSVP pages, and the homepage. That makes the platform easier for guests to navigate and easier for search engines to understand.
          </p>
          <p>
            If you are planning an event in {page.city}, start with a template, add your event details, preview the invite on mobile, and publish the link. From there, you can share on WhatsApp groups, individual chats, email, or social media. The experience remains consistent for local guests, relatives in other Indian cities, and international family members.
          </p>
        </div>
      </article>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-normal text-ink">Popular invitation types in {page.city}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <Link key={event} href={event === 'weddings' ? '/wedding-invitations' : '/templates'} className="rounded-lg border border-border bg-background p-5 text-sm font-semibold text-ink hover:text-accent-strong">
                {event}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-3xl font-normal text-ink">Frequently asked questions</h2>
        <div className="mt-7 space-y-4">
          {page.faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-heading text-lg text-ink">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-normal text-ink">Create a {page.city} invitation today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted">
            Publish a beautiful mobile invitation page and share it instantly with guests on WhatsApp.
          </p>
          <Link href="/create" className="gold-button mt-8 inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Start Free
          </Link>
        </div>
      </section>
      <SiteFooter />
      <StickyCTA />
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
