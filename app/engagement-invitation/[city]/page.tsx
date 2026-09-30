import type { Metadata } from 'next'
import CityLanding from '@/components/landing/CityLanding'
import { notFound } from 'next/navigation'
import { ENGAGEMENT_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(ENGAGEMENT_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = ENGAGEMENT_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Engagement Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital engagement invitation for your ${info.display} ${info.localCeremonyName} — WhatsApp link, Google Maps & ceremony schedule. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    robots: { index: true, follow: true },
    keywords: [
      `digital engagement invitation ${info.display}`,
      `online engagement invitation ${info.display}`,
      `engagement e-invite ${info.display}`,
      `sagai invitation ${info.display}`,
      `ring ceremony invitation ${info.display}`,
      `engagement ceremony invite ${info.state}`,
      `roka invitation ${info.display}`,
      `digital engagement card ${info.display} free`,
    ],
    alternates: { canonical: `${APP_URL}/engagement-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Engagement Invitation ${info.display}` }],
    },
  }
}

export default async function CityEngagementPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = ENGAGEMENT_CITIES[city as CitySlug]
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CityLanding
        occasion="engagement"
        templateId="indian-engagement"
        pageKey="engagement_city"
        city={info.display}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Engagement invitations', href: '/engagement-invitation' }, { name: info.display }]}
        eyebrow={`${info.display} · ${info.state}`}
        title={<>Digital Engagement Invitation <em className="font-medium text-burnished">in {info.display}</em></>}
        lede={info.heroIntro}
        local={{ title: `Built for ${info.display} engagement ceremonies`, paras: [info.builtForPara], chips: [{ label: `Popular ${info.display} venues`, items: info.venues }] }}
        faqTitle={`${info.display} engagement invitation — FAQs`}
        faqs={info.faqs}
        links={[{ href: '/engagement-invitation', label: 'Engagement invitations' }, { href: `/wedding-invitation/${city}`, label: `Wedding invitations in ${info.display}` }, { href: `/birthday-invitation/${city}`, label: `Birthday invitations in ${info.display}` }, { href: '/engagement-invitation-wording', label: 'Engagement invitation wording' }, { href: '/templates', label: 'All designs' }]}
        closing={{ title: `Create your ${info.display} engagement invitation`, sub: info.ctaTagline }}
      />
    </>
  )
}
