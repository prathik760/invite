import type { Metadata } from 'next'
import CityLanding from '@/components/landing/CityLanding'
import { notFound } from 'next/navigation'
import { WEDDING_CITIES, type CitySlug } from '@/lib/cityContent'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(WEDDING_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = WEDDING_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Wedding Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital wedding invitation for your ${info.display} wedding — WhatsApp link with countdown, Google Maps & gallery. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    keywords: [
      `digital wedding invitation ${info.display}`,
      `online wedding invitation ${info.display}`,
      `wedding e-invite ${info.display}`,
      `wedding invitation website ${info.display}`,
      `${info.display} wedding invitation WhatsApp`,
      `digital shaadi card ${info.display}`,
      `wedding invitation ${info.state}`,
      `online wedding card ${info.display} free`,
      `free digital invitation ${info.display}`,
      `online invitation maker ${info.display}`,
    ],
    alternates: { canonical: `${APP_URL}/wedding-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Wedding Invitation ${info.display}` }],
    },
  }
}

export default async function CityWeddingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = WEDDING_CITIES[city as CitySlug]
  if (!info) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: info.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `ShareInvite — Digital Wedding Invitation ${info.display}`,
    description: `Create digital wedding invitations for ${info.display} weddings. WhatsApp-ready link with venue map, countdown, gallery, and RSVP. Free to start.`,
    url: `${APP_URL}/wedding-invitation/${city}`,
    image: `${APP_URL}/opengraph-image`,
    areaServed: {
      '@type': 'City',
      name: info.display,
    },
    serviceType: 'Digital Wedding Invitation',
    // Derived from lib/plans.ts so it can never drift from what is charged.
    // Was "₹0 – ₹1499" — neither of those price points exists on the site.
    priceRange: `₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} – ₹${HIGHEST_PAID_PRICE.toLocaleString('en-IN')}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: info.state,
      addressLocality: info.display,
    },
    // No aggregateRating here. The previous 4.9/247 figure was not backed by a
    // review system in this codebase, and self-serving ratings on your own
    // business/product markup are against Google's structured-data policy —
    // they are ignored at best and are a manual-action risk at worst.
    // Re-add only when real, collected reviews exist to compute it from.
    sameAs: [`${APP_URL}`],
    potentialAction: {
      '@type': 'OrderAction',
      target: `${APP_URL}/create`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <CityLanding
        occasion="wedding"
        templateId="elegant-wedding"
        pageKey="wedding_city"
        city={info.display}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Wedding invitations', href: '/wedding-invitation' }, { name: info.display }]}
        eyebrow={`${info.display} · ${info.state}`}
        title={<>Digital Wedding Invitation <em className="font-medium text-burnished">in {info.display}</em></>}
        lede={info.localDetail}
        local={{ title: `Built for ${info.display} weddings`, paras: [info.localDetail, info.localDetail2], chips: [{ label: `${info.weddingStyle} — ceremonies we support`, items: info.traditions }, { label: `Popular ${info.display} venues`, items: info.venues }] }}
        faqTitle={`${info.display} wedding invitation — FAQs`}
        faqs={info.faqs}
        links={[{ href: '/wedding-invitation', label: 'Wedding invitations' }, { href: `/engagement-invitation/${city}`, label: `Engagement invitations in ${info.display}` }, { href: `/griha-pravesh-invitation/${city}`, label: `Griha Pravesh invitations in ${info.display}` }, { href: '/wedding-invitation-wording', label: 'Wedding invitation wording' }, { href: '/templates', label: 'All designs' }]}
        closing={{ title: `Create your ${info.display} wedding invitation`, sub: info.ctaTagline }}
      />
    </>
  )
}
