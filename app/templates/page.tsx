import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import SiteFooter from '@/components/landing/SiteFooter'
import { TEMPLATES } from '@/modules/templates/data'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME, templateCategorySlug, templateSeoSlug } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Digital Invitation Templates | Wedding, Birthday & Event Invites',
  description:
    'Browse ShareInvite digital invitation templates for weddings, engagements, birthdays, Griha Pravesh, naming ceremonies, anniversaries, and WhatsApp RSVP pages.',
  alternates: { canonical: absoluteUrl('/templates') },
  openGraph: {
    title: 'Digital Invitation Templates | ShareInvite',
    description: 'Browse WhatsApp-ready invitation templates for Indian weddings and events.',
    type: 'website',
    siteName: SITE_NAME,
    url: absoluteUrl('/templates'),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'ShareInvite templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Invitation Templates | ShareInvite',
    description: 'WhatsApp-ready invitation templates for Indian events.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function TemplatesIndexPage() {
  const categories = Array.from(new Set(TEMPLATES.map((template) => template.category || 'digital')))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd id="templates-jsonld" data={collectionPageJsonLd('Digital Invitation Templates', metadata.description as string, absoluteUrl('/templates'))} />
      <JsonLd
        id="templates-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /></Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
        </div>
      </header>
      <section className="px-5 py-14 text-center">
        <h1 className="font-display text-4xl font-normal text-ink sm:text-6xl">Digital Invitation Templates</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
          SEO-friendly templates for digital wedding invitations, birthday invitations, engagement cards, housewarming invites, naming ceremonies, and RSVP pages.
        </p>
      </section>
      <section className="border-y border-border bg-white px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-xl text-ink">Template categories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category} href={`/templates/category/${templateCategorySlug(category)}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-muted hover:text-foreground">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <Link key={template.id} href={`/templates/${templateSeoSlug(template.id)}`} className="rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">{template.category}</p>
              <h2 className="mt-3 font-heading text-xl text-ink">{template.name}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{template.description}</p>
              <p className="mt-5 text-xs font-semibold text-muted">Create with this template</p>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
