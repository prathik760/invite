import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { templatePrice } from '@/lib/plans'
import { ClockIcon, MapPinIcon, ClipboardIcon, CameraIcon, MessageIcon, ParkingIcon, MusicIcon, ShareIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: `Digital Griha Pravesh Invitation — ₹${templatePrice('griha-pravesh')} | ShareInvite` },
  description:
    `Digital Griha Pravesh invitation with muhurat time, pooja schedule & Google Maps on one WhatsApp link. Preview before you pay; ₹${templatePrice('griha-pravesh')} once to publish.`,
  keywords: [
    'digital Griha Pravesh invitation',
    'Griha Pravesh invitation WhatsApp',
    'housewarming ceremony invitation digital',
    'Griha Pravesh e-invite India',
    'housewarming invitation website India',
    'digital house warming invitation',
    'ghar pravesh invitation online',
    'pooja ceremony invitation digital',
    'new home blessing invitation India',
    'housewarming muhurat invitation',
  ],
  alternates: { canonical: `${APP_URL}/griha-pravesh-invitation` },
  openGraph: {
    title: 'Digital Griha Pravesh Invitation | Housewarming E-Invite India | ShareInvite',
    description: `Digital Griha Pravesh invitation with muhurat time, pooja schedule & Google Maps on one WhatsApp link. Preview before you pay; ₹${templatePrice('griha-pravesh')} once to publish.`,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Griha Pravesh Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital Griha Pravesh invitation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the muhurat time, new address, pooja schedule, and a family blessing message. Your Griha Pravesh invitation is live in under 5 minutes — share the link directly on WhatsApp with all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a Griha Pravesh invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A complete Griha Pravesh invitation should include: the auspicious muhurat time, full address with Google Maps pin, pooja schedule (Ganesh Pooja, Grah Shanti, Vastu Pooja, lunch), host family name, a personal blessing message, and any parking or entry instructions for guests.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Griha Pravesh and Ghar Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Griha Pravesh (or Gruhapravesham in South India, Ghar Pravesh in common usage) all refer to the same ceremony — the auspicious entry into a new home. The name varies by region and language. ShareInvite lets you customise the invitation heading to match your regional tradition.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I send a Griha Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send the Griha Pravesh invitation at least 10–14 days before the ceremony. Share a reminder on WhatsApp 2 days before. With a digital invitation, reminders are as simple as re-forwarding the same link — no new design or printing needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital Griha Pravesh invitation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Griha Pravesh template is ₹399 as a one-time payment — no subscription, and no charge per guest. You can fill in every detail and preview the finished invitation before paying; payment is only requested at the final publish step.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <ClockIcon />, title: 'Muhurat Time Display', desc: 'Show the auspicious ceremony time prominently — the most critical detail guests need for Griha Pravesh.' },
  { icon: <MapPinIcon />, title: 'New Address + Google Maps', desc: 'Provide the full new address with a one-tap Google Maps pin so guests navigate easily, even in new localities.' },
  { icon: <ClipboardIcon />, title: 'Pooja Schedule', desc: 'List the full programme — Ganesh Pooja, Grah Shanti, Vastu Pooja, lunch — so guests plan their day.' },
  { icon: <CameraIcon />, title: 'Photo Gallery', desc: 'Share photos of the new home to make the invitation personal and memorable for family.' },
  { icon: <MessageIcon />, title: 'Family Blessings', desc: 'Collect blessings and well-wishes from relatives who cannot attend in person.' },
  { icon: <ParkingIcon />, title: 'Parking & Entry Notes', desc: 'Add notes for parking, apartment building entry, or nearby landmarks to help guests arrive without confusion.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set an auspicious or devotional track to play softly as guests view the invitation.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'One tap to send the invite across all family and neighbourhood WhatsApp groups instantly.' },
]

const CEREMONY_NAMES = [
  { name: 'Griha Pravesh', region: 'North India / Pan-India', desc: 'The most widely used Sanskrit term for the housewarming ceremony' },
  { name: 'Gruhapravesham', region: 'South India', desc: 'Tamil and Telugu families use this name for the auspicious home entry' },
  { name: 'Ghar Pravesh', region: 'Hindi belt', desc: 'Common colloquial name used across UP, Bihar, MP, and Rajasthan' },
  { name: 'Griha Pravesha', region: 'Karnataka', desc: 'Kannada variant widely used for housewarming ceremonies in Karnataka' },
  { name: 'Vastu Pooja', region: 'Gujarat & Maharashtra', desc: 'The Vastu Shanti ceremony often coincides with the housewarming entry' },
  { name: 'Satyanarayan Pooja', region: 'Pan-India', desc: 'Many families combine the housewarming with a Satyanarayan Pooja celebration' },
]

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="home"
        templateId="griha-pravesh"
        pageKey="griha_pravesh_landing"
        crumb="Griha Pravesh invitations"
        eyebrow="Digital housewarming invitations"
        title={<>Digital Griha Pravesh Invitation <em className="font-medium text-burnished">Housewarming · Ghar Pravesh</em></>}
        lede={`Share the muhurat, the full pooja schedule, your new address with Google Maps and family blessings — all from one beautiful WhatsApp link. Build and preview before you pay — publish for ₹${templatePrice('griha-pravesh')} one-time.`}
        ctaLabel="Start my Griha Pravesh invite"
        types={{
          eyebrow: 'Every tradition',
          title: 'Griha Pravesh invitations for every regional tradition',
          sub: 'Griha Pravesh, Ghar Pravesh, Gruhapravesham, Vastu Puja — one digital invitation works for all regional traditions.',
          items: CEREMONY_NAMES.map((t) => ({ name: t.name, tag: t.region, desc: t.desc })),
        }}
        features={{ title: "What's included in your Griha Pravesh invitation", items: FEATURES }}
        steps={[
          { title: 'Enter ceremony details', copy: 'Muhurat time, new address, pooja schedule, host names and a blessing message.' },
          { title: 'Preview instantly', copy: 'See the address, schedule and map link come together as you type.' },
          { title: 'Pay once & share', copy: 'Publish for a one-time price and send it to family groups, neighbours and friends.' },
        ]}
        faqTitle="Griha Pravesh invitation questions"
        faqs={faqs}
        cities={{ base: '/griha-pravesh-invitation', title: 'Griha Pravesh invitations by city', list: ['bengaluru','mumbai','delhi','hyderabad','chennai','pune','kolkata','ahmedabad'] }}
        related={[
          { href: '/griha-pravesh-invitation-wording', label: 'Griha Pravesh wording' },
          { href: '/templates', label: 'All invitation designs' },
          { href: '/blog/category/housewarming', label: 'Housewarming ideas' },
        ]}
        closing={{ title: 'Create your Griha Pravesh invitation' }}
      />
    </>
  )
}
