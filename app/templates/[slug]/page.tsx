import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import { TEMPLATES } from '@/modules/templates/data'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_NAME, templateCategorySlug, templateSeoSlug } from '@/lib/seo'

type Props = { params: { slug: string } }

function findTemplateBySlug(slug: string) {
  return TEMPLATES.find((template) => templateSeoSlug(template.id) === slug)
}

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: templateSeoSlug(template.id) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const template = findTemplateBySlug(params.slug)
  if (!template) return {}
  const url = absoluteUrl(`/templates/${params.slug}`)
  const title = `${template.name} Template | ShareInvite`
  const description =
    template.id === 'royal-deco'
      ? 'Create beautiful royal wedding invitations and share instantly on WhatsApp.'
      : `Create beautiful ${template.name.toLowerCase()} digital invitations and share instantly on WhatsApp with RSVP tracking.`

  return {
    title,
    description,
    keywords: [template.name, `${template.category} invitation template`, 'digital invitation template', 'whatsapp invitation card', 'online RSVP'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
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

function productJsonLd(template: NonNullable<ReturnType<typeof findTemplateBySlug>>, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${template.name} Template`,
    description: template.description,
    image: DEFAULT_OG_IMAGE,
    brand: {
      '@type': 'Brand',
      name: 'ShareInvite',
    },
    category: `${template.category} invitation template`,
    url,
    offers: {
      '@type': 'Offer',
      price: template.id === 'elegant-wedding' ? '0' : '499',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/create'),
    },
  }
}

export default function TemplateSeoPage({ params }: Props) {
  const template = findTemplateBySlug(params.slug)
  if (!template) notFound()
  const url = absoluteUrl(`/templates/${params.slug}`)
  const categoryHref = `/templates/category/${templateCategorySlug(template.category)}`
  const fields = template.config.fields.slice(0, 8)

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <JsonLd id="template-product-jsonld" data={productJsonLd(template, url)} />
      <JsonLd
        id="template-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
          { name: template.name, url },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /></Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Use Template</Link>
        </div>
      </header>
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Link href={categoryHref} className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              {template.category} templates
            </Link>
            <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-6xl">{template.name} Template</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{template.description} Create it as a mobile-first digital invitation page with WhatsApp sharing, venue details, gallery, schedule, and RSVP-ready guest flow.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className="gold-button rounded-full px-9 py-4 text-center text-base font-semibold">Create Invitation</Link>
              <Link href="/templates" className="rounded-full border border-border bg-white px-9 py-4 text-center text-base font-semibold text-ink">All Templates</Link>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">Included fields</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className="rounded-lg border border-border bg-background p-3 text-sm font-semibold text-ink">
                  {field.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-white px-5 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-normal text-ink">About this template</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-muted">
            <p>
              {template.description} This template is built as a mobile-first digital invitation page designed for WhatsApp sharing across Indian family and social networks. Guests open the link in their browser without installing any app — and find all event details, venue, schedule, gallery, and a RSVP-ready interaction in one place.
            </p>
            <p>
              The {template.name} template supports all core invitation fields: event names, date and time, venue with full address, Google Maps link, ceremony schedule, dress code, photo gallery, background music, and a personal host message. Every field is optimised to display clearly on mobile screens even on slower connections.
            </p>
            <p>
              Each published invite gets a unique shareable URL, proper Open Graph metadata for WhatsApp previews, a live countdown to the event date, and a guest wishes section where recipients can leave messages the host can approve before display. The same link can be forwarded to family groups, shared on Instagram, or embedded in email — no reprinting or resending required if details change.
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-normal text-ink mb-6">Other templates to explore</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/wedding-invitations" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">Digital wedding invitations →</Link>
            <Link href="/whatsapp-invitation-maker" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">WhatsApp invitation maker →</Link>
            <Link href="/templates" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">Browse all templates →</Link>
            <Link href="/online-rsvp" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">Online RSVP platform →</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
      <StickyCTA />
    </main>
  )
}
