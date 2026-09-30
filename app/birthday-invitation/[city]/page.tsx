import type { Metadata } from 'next'
import CityLanding from '@/components/landing/CityLanding'
import { notFound } from 'next/navigation'
import { BIRTHDAY_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(BIRTHDAY_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = BIRTHDAY_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Birthday Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital birthday invitation for your ${info.display} party — WhatsApp link with countdown, Google Maps & photo gallery. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    robots: { index: true, follow: true },
    keywords: [
      `digital birthday invitation ${info.display}`,
      `online birthday invitation ${info.display}`,
      `birthday e-invite ${info.display}`,
      `birthday invitation website ${info.display}`,
      `birthday party invite WhatsApp ${info.display}`,
      `digital birthday card ${info.display}`,
      `birthday invitation ${info.state}`,
      `online birthday card ${info.display} free`,
    ],
    alternates: { canonical: `${APP_URL}/birthday-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Birthday Invitation ${info.display}` }],
    },
  }
}

export default async function CityBirthdayPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = BIRTHDAY_CITIES[city as CitySlug]
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
        occasion="birthday"
        templateId="indian-birthday"
        pageKey="birthday_city"
        city={info.display}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Birthday invitations', href: '/birthday-invitation' }, { name: info.display }]}
        eyebrow={`${info.display} · ${info.state}`}
        title={<>Digital Birthday Invitation <em className="font-medium text-burnished">in {info.display}</em></>}
        lede={info.heroIntro}
        local={{ title: `Built for ${info.display} birthday parties`, paras: [info.builtForPara], chips: [{ label: `Popular ${info.display} party venues`, items: info.venues }] }}
        faqTitle={`${info.display} birthday invitation — FAQs`}
        faqs={info.faqs}
        links={[{ href: '/birthday-invitation', label: 'Birthday invitations' }, { href: `/wedding-invitation/${city}`, label: `Wedding invitations in ${info.display}` }, { href: `/engagement-invitation/${city}`, label: `Engagement invitations in ${info.display}` }, { href: '/birthday-invitation-wording', label: 'Birthday invitation wording' }, { href: '/templates', label: 'All designs' }]}
        closing={{ title: `Create your ${info.display} birthday invitation`, sub: info.ctaTagline }}
      />
    </>
  )
}
