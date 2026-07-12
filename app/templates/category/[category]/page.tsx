import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { TEMPLATES } from '@/modules/templates/data'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME, templateCategorySlug, templateSeoSlug } from '@/lib/seo'

type Props = { params: { category: string } }

const categories = Array.from(new Set(TEMPLATES.map((template) => template.category || 'digital')))

function findCategory(slug: string) {
  return categories.find((category) => templateCategorySlug(category) === slug)
}

export function generateStaticParams() {
  return categories.map((category) => ({ category: templateCategorySlug(category) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const category = findCategory(params.category)
  if (!category) return {}
  const url = absoluteUrl(`/templates/category/${params.category}`)
  const cat = category.charAt(0).toUpperCase() + category.slice(1)
  const title = `${cat} Invitation Templates | ShareInvite`
  const description = `Browse ${cat.toLowerCase()} digital invitation templates for Indian events — WhatsApp-ready links, venue details, photo gallery, live countdown, and RSVP guest flow.`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
  }
}

export default function TemplateCategoryPage({ params }: Props) {
  const category = findCategory(params.category)
  if (!category) notFound()
  const templates = TEMPLATES.filter((template) => (template.category || 'digital') === category)
  const url = absoluteUrl(`/templates/category/${params.category}`)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd id="template-category-jsonld" data={collectionPageJsonLd(`${category} Invitation Templates`, `Digital ${category} invitation templates by ShareInvite.`, url)} />
      <JsonLd
        id="template-category-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
          { name: category, url },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/"><Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /></Link>
          <Link href="/templates" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted">All Templates</Link>
        </div>
      </header>
      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-4xl font-normal text-ink sm:text-5xl">{category} Invitation Templates</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Browse {category} invitation templates and return to ShareInvite home within one click. Each template links to the creation flow and relevant category pages.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link key={template.id} href={`/templates/${templateSeoSlug(template.id)}`} className="rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-card">
                <h2 className="font-heading text-xl text-ink">{template.name}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{template.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/" className="text-sm font-semibold text-accent-strong">Back to homepage</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
