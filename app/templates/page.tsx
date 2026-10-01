import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import TemplateBrowser from '@/components/catalog/TemplateBrowser'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import TrustList from '@/components/brand/TrustList'
import { Section } from '@/components/brand/Section'
import { TEMPLATES } from '@/modules/templates/data'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { OCCASIONS } from '@/lib/catalog'
import { buildCatalogItems, occasionChips } from '@/lib/catalogItems'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME, templateCategorySlug, templateCategoryLabel } from '@/lib/seo'

// The count was hard-coded as "11" while the catalogue held 24 designs.
const COUNT = TEMPLATES.length
const TITLE = 'Digital Invitation Templates for Every Occasion | ShareInvite'
const DESCRIPTION = `${COUNT} digital invitation templates for weddings, birthdays, engagements, anniversaries, festivals, housewarmings and naming ceremonies — plus animated 3D greetings. Preview before you pay, share on WhatsApp.`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/templates') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    url: absoluteUrl('/templates'),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'ShareInvite templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function TemplatesIndexPage() {
  const items = buildCatalogItems()
  const chips = occasionChips(items)
  const categories = Array.from(new Set(TEMPLATES.map((template) => template.category || 'digital')))

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <JsonLd id="templates-jsonld" data={collectionPageJsonLd('Digital Invitation Templates', DESCRIPTION, absoluteUrl('/templates'))} />
      <JsonLd
        id="templates-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
        ])}
      />

      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Templates' }]}
        eyebrow="The collection"
        title={<>Digital invitation <em className="font-medium text-burnished">templates</em></>}
        lede="Animated invitations and 3D greetings for weddings, birthdays, festivals and every celebration. Open any design in a live preview, try it with your own details before you pay, and pay once for the one you publish."
        footnote={<TrustList items={['Preview before you pay', `One price per design, from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}`, 'Switch designs any time — details carry over', 'One link guests open on any phone']} />}
      />

      <Section aria-label="All designs">
        <TemplateBrowser items={items} chips={chips} source="templates_page" syncUrl />
      </Section>

      <Section tone="paper" aria-label="Browse by occasion">
          <h2 className="t-h3">Browse by occasion</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {OCCASIONS.filter((o) => !o.href.startsWith('/templates')).map((o) => (
              <li key={o.key}>
                <Link href={o.href} className="inline-flex rounded-full border border-line bg-champagne px-4 py-2 text-[0.9rem] font-semibold hover:border-burnished">
                  {o.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="t-h3 mt-10">Template categories</h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/templates/category/${templateCategorySlug(category)}`}
                  className="inline-flex rounded-full border border-line bg-champagne px-4 py-2 text-[0.85rem] text-charcoal/80 hover:border-burnished"
                >
                  {templateCategoryLabel(category)}
                </Link>
              </li>
            ))}
          </ul>
      </Section>

      <CtaBand
        eyebrow="Something else in mind?"
        title="Can't find the right design? We'll create it."
        sub="Baby showers, corporate events, reunions and more — tell us about your event and our designers will make one for you."
        primary={{ href: '/#custom-template', label: 'Request a custom design' }}
        secondary={{ href: '/create', label: 'Start with a design' }}
        location="templates_closing"
      />

      <SiteFooter />
    </main>
  )
}
