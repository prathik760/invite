import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import TemplateCard from '@/components/catalog/TemplateCard'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import { Section } from '@/components/brand/Section'
import { buildCatalogItems } from '@/lib/catalogItems'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { TEMPLATES } from '@/modules/templates/data'
import { DEFAULT_OG_IMAGE, MIN_TEMPLATES_TO_INDEX, SITE_NAME, absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, templateCategoryLabel, templateCategorySlug, templateCountFor } from '@/lib/seo'
import { TEMPLATE_CATEGORY_INTRO } from '@/content/category-intros'

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
  const cat = templateCategoryLabel(category)
  const title = `${cat} Invitation Templates | ShareInvite`
  const description = `Browse ${cat} digital invitation designs — each one shared as a single WhatsApp-ready link you can preview before you pay, with one price per design.`

  return {
    title: { absolute: title },
    description,
    robots:
      templateCountFor(category) >= MIN_TEMPLATES_TO_INDEX
        ? { index: true, follow: true }
        : { index: false, follow: true },
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
  const items = buildCatalogItems(templates.map((t) => t.id))
  const url = absoluteUrl(`/templates/category/${params.category}`)
  const label = templateCategoryLabel(category)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <JsonLd id="template-category-jsonld" data={collectionPageJsonLd(`${label} Invitation Templates`, `Digital ${label} invitation designs by ShareInvite.`, url)} />
      <JsonLd
        id="template-category-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
          { name: label, url },
        ])}
      />
      <SiteHeader />
      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Templates', href: '/templates' }, { name: label }]}
        eyebrow="Design collection"
        title={<>{label} <em className="font-medium text-burnished">Invitation Templates</em></>}
        lede={
          TEMPLATE_CATEGORY_INTRO[category] ??
          `Browse every ${label} invitation design on ShareInvite. Each design publishes to one shareable link with venue details, a photo gallery and WhatsApp sharing built in.`
        }
      />
      <Section aria-label={`${label} designs`}>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
          {items.map((item, i) => <TemplateCard key={item.id} item={item} source="template_category" priority={i < 2} />)}
        </div>
        <p className="mt-10 text-center">
          <Link href="/templates" className="link">Browse every design</Link>
        </p>
      </Section>
      <CtaBand location="template_category_footer" />
      <SiteFooter />
    </main>
  )
}
