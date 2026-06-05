import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
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
          <Link href="/" className="font-display text-2xl text-ink">ShareInvite</Link>
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
          <h2 className="font-display text-3xl font-normal text-ink">Template SEO details</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-muted">
            <p>
              This template has a clean SEO URL, canonical metadata, Product schema, and internal links to its category, homepage, and creation flow. It is designed for hosts who want a premium digital invitation card that can be sent on WhatsApp instead of a PDF or printed card.
            </p>
            <p>
              The page supports important invitation information such as names, date, time, venue, Google Maps, schedule, gallery, music, and personal message. Guests can open the invite on mobile, read the event details, and share the same link with family members.
            </p>
          </div>
        </div>
      </section>
      <StickyCTA />
    </main>
  )
}
