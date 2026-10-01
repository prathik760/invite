import type { Metadata } from 'next'
import CityLanding from '@/components/landing/CityLanding'
import { notFound } from 'next/navigation'
import { GRIHA_PRAVESH_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(GRIHA_PRAVESH_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = GRIHA_PRAVESH_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Griha Pravesh Invitation in ${info.display} | ShareInvite`
  const description = `Digital Griha Pravesh invitation for ${info.display} — muhurat time, pooja schedule, Google Maps & WhatsApp-ready link. Preview before you pay.`

  return {
    title: { absolute: ogTitle },
    description,
    keywords: [
      `digital griha pravesh invitation ${info.display}`,
      `online housewarming invitation ${info.display}`,
      `griha pravesh e-invite ${info.display}`,
      `gruhapravesham invitation ${info.display}`,
      `${info.display} griha pravesh invitation WhatsApp`,
      `digital ghar pravesh card ${info.display}`,
      `housewarming invitation ${info.state}`,
      `online griha pravesh card ${info.display}`,
      `digital housewarming invitation ${info.display}`,
      `online invitation maker ${info.display}`,
    ],
    alternates: { canonical: `${APP_URL}/griha-pravesh-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Griha Pravesh Invitation ${info.display}` }],
    },
  }
}

export default async function CityGrihaPraveshPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = GRIHA_PRAVESH_CITIES[city as CitySlug]
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
    name: 'ShareInvite',
    url: 'https://shareinvite.in',
    areaServed: { '@type': 'City', name: info.display },
    description: `Digital Griha Pravesh invitation maker for families in ${info.display}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <CityLanding
        occasion="home"
        templateId="griha-pravesh"
        pageKey="griha_pravesh_city"
        city={info.display}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Griha Pravesh invitations', href: '/griha-pravesh-invitation' }, { name: info.display }]}
        eyebrow={`${info.display} · ${info.state}`}
        title={<>Digital Griha Pravesh Invitation <em className="font-medium text-burnished">in {info.display}</em></>}
        lede={info.localDetail}
        local={{ title: `Built for ${info.display} Griha Pravesh ceremonies`, paras: [info.localDetail, info.localDetail2], chips: [{ label: 'Ceremonies we support', items: info.traditions }] }}
        faqTitle={`${info.display} Griha Pravesh invitation — FAQs`}
        faqs={info.faqs}
        links={[{ href: '/griha-pravesh-invitation', label: 'Griha Pravesh invitations' }, { href: '/griha-pravesh-invitation-wording', label: 'Griha Pravesh wording' }, { href: `/wedding-invitation/${city}`, label: `Wedding invitations in ${info.display}` }, { href: '/digital-invitation', label: 'All digital invitations' }]}
        closing={{ title: `Create your ${info.display} Griha Pravesh invitation`, sub: info.ctaTagline }}
      />
    </>
  )
}
