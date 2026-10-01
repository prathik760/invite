import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { templatePrice } from '@/lib/plans'
import { RingIcon, CalendarIcon, ClockIcon, CameraIcon, MusicIcon, MessageIcon, ClipboardIcon, ShareIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: `Digital Engagement Invitation Online — ₹${templatePrice('indian-engagement')} | ShareInvite` },
  description:
    `Digital engagement invitation for Mangni, Roka & Sagai — one WhatsApp link with countdown, Google Maps & photos. Preview before you pay; ₹${templatePrice('indian-engagement')} once.`,
  keywords: [
    'digital engagement invitation India',
    'mangni invitation digital',
    'roka ceremony invitation online',
    'engagement e-invite India',
    'digital engagement card India',
    'WhatsApp engagement invitation link',
    'engagement invitation website India',
    'mangni ceremony invitation website',
    'sagai invitation digital',
    'engagement invite online maker India',
    'ring ceremony invitation digital',
  ],
  alternates: { canonical: `${APP_URL}/engagement-invitation` },
  openGraph: {
    title: 'Digital Engagement Invitation | Mangni & Roka E-Invite India | ShareInvite',
    description: `Digital engagement invitation for Mangni, Roka & Sagai — one WhatsApp link with countdown, Google Maps & photos. Preview before you pay; ₹${templatePrice('indian-engagement')} once.`,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Engagement Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital engagement invitation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the couple\'s names, engagement date, venue, and a personal message, then click Create. Your engagement invitation website is live in under 5 minutes — share the link directly on WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Mangni, Roka, and Sagai invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mangni, Roka, and Sagai are all regional names for the engagement ceremony in India. Roka is common in North India (Punjab, Delhi) and marks the formal alliance between families. Mangni typically refers to the ring ceremony. Sagai is widely used in Rajasthan and Gujarat. ShareInvite lets you label your ceremony any way you choose.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I include a ring ceremony schedule on the engagement invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ShareInvite supports a full ceremony schedule with multiple events — you can list the Roka/Sagai, ring exchange, family functions, and dinner in a clear timeline. Guests can see the full programme from a single WhatsApp link.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital engagement invitation better than a printed card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A digital engagement invitation is faster, cheaper, and more interactive. Guests get live countdown, one-tap Google Maps, a photo gallery, and a wishes section — all from one link shared on WhatsApp. No printing costs, no delays, and guests can share it instantly with their own contacts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital engagement invitation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Engagement template is ₹399 as a one-time payment — no subscription, and no charge per guest. You can fill in every detail and preview the finished invitation before paying; payment is only requested at the final publish step.',
      },
    },
    {
      '@type': 'Question',
      name: 'How early should I send engagement invitations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send them 10–14 days before the ceremony for local guests. If family is travelling from another city, send three weeks ahead so they can plan travel, and reshare the same link as a reminder two days before.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <RingIcon />, title: 'Couple Names & Families', desc: 'Display both families\' names in the traditional Indian format — with beautiful typography.' },
  { icon: <CalendarIcon />, title: 'Ceremony Date & Time', desc: 'Exact date, time, and venue with full address and one-tap Google Maps directions.' },
  { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A live ticking countdown builds excitement as the big day approaches.' },
  { icon: <CameraIcon />, title: 'Pre-Engagement Gallery', desc: 'Upload couple photos to make the invite personal and memorable.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set a romantic song to play softly as guests view the invitation.' },
  { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect blessings and congratulations from guests directly on the page.' },
  { icon: <ClipboardIcon />, title: 'Event Schedule', desc: 'List Roka, ring ceremony, family functions, and dinner in a clear timeline.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'One tap to send the invite to hundreds of guests across family groups.' },
]

const CEREMONIES = [
  { name: 'Mangni', region: 'North India', desc: 'The ring exchange ceremony marking the formal engagement' },
  { name: 'Roka', region: 'Punjab & Delhi', desc: 'Family alliance ceremony before the formal engagement' },
  { name: 'Sagai', region: 'Rajasthan & Gujarat', desc: 'Ring ceremony and formal engagement celebration' },
  { name: 'Nishchayam', region: 'South India', desc: 'Formal betrothal ceremony common in Tamil & Telugu families' },
  { name: 'Misri', region: 'Uttar Pradesh', desc: 'Sweet exchange ritual between the two families' },
  { name: 'Ring Ceremony', region: 'Pan-India', desc: 'Modern engagement celebration with ring exchange' },
]

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="engagement"
        templateId="indian-engagement"
        pageKey="engagement_landing"
        crumb="Engagement invitations"
        eyebrow="Digital engagement invitations"
        title={<>Digital Engagement Invitation <em className="font-medium text-burnished">Mangni · Roka · Sagai</em></>}
        lede={`Create a beautiful digital engagement invitation for your Mangni, Roka or Sagai. Share one WhatsApp link with the full schedule, Google Maps, photos and a guest wishes section. Build and preview before you pay — publish for ₹${templatePrice('indian-engagement')} one-time.`}
        ctaLabel="Start my engagement invite"
        types={{
          eyebrow: 'Every tradition',
          title: 'Invitations for Mangni, Roka & Sagai ceremonies',
          sub: 'Mangni, Roka, Sagai, Nishchayathartham — one digital engagement invitation works for every Indian tradition.',
          items: CEREMONIES.map((t) => ({ name: t.name, tag: t.region, desc: t.desc })),
        }}
        features={{ title: "What's included in your digital engagement invitation", items: FEATURES }}
        steps={[
          { title: 'Enter ceremony details', copy: 'Add both families\' names, date, venue, schedule and a personal message.' },
          { title: 'Preview your invite', copy: 'See your invitation come to life instantly as you fill in each detail.' },
          { title: 'Pay once & share', copy: 'Publish for a one-time price and forward your link to every family group.' },
        ]}
        faqTitle="Digital engagement invitation questions"
        faqs={faqs}
        cities={{ base: '/engagement-invitation', title: 'Engagement invitations by city', list: ['bengaluru','mumbai','delhi','hyderabad','chennai','pune','kolkata','ahmedabad'] }}
        related={[
          { href: '/engagement-invitation-wording', label: 'Engagement invitation wording' },
          { href: '/templates', label: 'All invitation designs' },
          { href: '/wedding-invitation', label: 'Wedding invitations' },
        ]}
        closing={{ title: 'Create your digital engagement invitation' }}
      />
    </>
  )
}
