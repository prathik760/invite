import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { templatePrice } from '@/lib/plans'
import { PersonIcon, ClockIcon, MapPinIcon, CameraIcon, ClipboardIcon, MessageIcon, MusicIcon, ShareIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Digital Namakaran Invitation India — Build Free, Publish ₹299 | ShareInvite' },
  description:
    'Namakaran invitation for India — WhatsApp link with ceremony schedule, Google Maps & blessings section. Share baby photos. Build and preview free; publish for ₹299 one-time. Ready in 5 minutes.',
  keywords: [
    'digital namakaran invitation',
    'namakaran e-invite India',
    'baby naming ceremony invitation digital',
    'naamkaran invitation WhatsApp',
    'cradle ceremony invitation online',
    'annaprashan invitation digital',
    'naming ceremony card online India',
    'baby shower naming invitation',
    'rice ceremony invitation digital India',
  ],
  alternates: { canonical: `${APP_URL}/namakaran-invitation` },
  openGraph: {
    title: 'Digital Namakaran Invitation | Naming Ceremony E-Invite India | ShareInvite',
    description: 'Create a beautiful digital Namakaran invitation for your baby\'s naming ceremony. WhatsApp-ready. Build and preview free — publish for ₹299 one-time.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Namakaran Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital Namakaran invitation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the baby\'s name, parents\' names, ceremony date, venue, and a personal message. Your Namakaran invitation is live in under 5 minutes — share the link directly on WhatsApp with all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a Namakaran invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Namakaran invitation should include: parents\' names, baby\'s name being revealed (or kept as a surprise), ceremony date and auspicious muhurat time, venue with Google Maps link, schedule of events, and a warm family blessing message. The baby\'s photo gallery adds a personal, emotional touch.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Namakaran, Naamkaran, and Cradle ceremony?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Namakaran (or Namakarana) is the Sanskrit term for the baby naming ceremony. Naamkaran is the common Hindi spelling. Cradle ceremony is the English term used widely in South India. All refer to the same event — the formal naming of the newborn. ShareInvite lets you use whichever term suits your tradition.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the Namakaran ceremony typically held?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Namakaran ceremony is traditionally held on the 11th or 12th day after birth, or on an auspicious muhurat chosen by the family. Some families hold it on the 28th day. The exact timing varies by region and community. Send digital invitations at least 7–10 days before the ceremony date.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital Namakaran invitation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Namakaran template is ₹299 as a one-time payment — no subscription, and no charge per guest. You can fill in every detail and preview the finished invitation before paying; payment is only requested at the final publish step.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <PersonIcon />, title: 'Baby & Parents Names', desc: 'Display the baby\'s name reveal and parents\' names in beautiful display typography.' },
  { icon: <ClockIcon />, title: 'Muhurat Time', desc: 'Show the auspicious naming ceremony time prominently — the most important detail for family.' },
  { icon: <MapPinIcon />, title: 'Venue + Google Maps', desc: 'Full venue address with one-tap Google Maps so family navigates to the right place.' },
  { icon: <CameraIcon />, title: 'Baby Photo Gallery', desc: 'Share the baby\'s first photos to make the invitation warm and personal for everyone.' },
  { icon: <ClipboardIcon />, title: 'Ceremony Schedule', desc: 'List the full programme — pooja, name reveal, blessings, lunch — in a clear timeline.' },
  { icon: <MessageIcon />, title: 'Family Blessings', desc: 'Collect blessings and wishes from relatives attending and those joining remotely.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set a gentle, celebratory track to play as guests open the invitation.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'Send the invite to all family groups with one tap — no app download for guests.' },
]

const CEREMONY_NAMES = [
  { name: 'Namakaran', region: 'Pan-India (Sanskrit)', desc: 'The traditional Sanskrit term used across all Hindu communities' },
  { name: 'Naamkaran', region: 'North India', desc: 'Common Hindi spelling used widely in UP, Bihar, Delhi, Rajasthan' },
  { name: 'Cradle Ceremony', region: 'South India', desc: 'English term widely used in Tamil Nadu, Karnataka, and Andhra families' },
  { name: 'Namakarana', region: 'Karnataka / Telugu', desc: 'Kannada and Telugu variant of the naming ceremony' },
  { name: 'Thodayal / Nichayathartham', region: 'Tamil Nadu', desc: 'Tamil naming ceremony with specific regional rituals and timing' },
  { name: 'Annaprashan', region: 'Bengal / East India', desc: 'Bengali rice ceremony often combined with the naming ritual' },
]

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="baby"
        templateId="namakaran"
        pageKey="namakaran_landing"
        crumb="Namakaran invitations"
        eyebrow="Digital naming ceremony invitations"
        title={<>Digital Namakaran Invitation <em className="font-medium text-burnished">Naming · Cradle Ceremony</em></>}
        lede={`Share the muhurat, ceremony schedule, venue map and your baby's first photos — a beautiful naming ceremony invitation on one WhatsApp link. Build and preview free — publish for ₹${templatePrice('namakaran')} one-time.`}
        ctaLabel="Start my Namakaran invite"
        types={{
          eyebrow: 'Every tradition',
          title: 'Namakaran invitations for every naming tradition',
          sub: 'Namakaran, Naamkaran, Cradle Ceremony, Namakarana — one digital invitation works for every regional tradition.',
          items: CEREMONY_NAMES.map((t) => ({ name: t.name, tag: t.region, desc: t.desc })),
        }}
        features={{ title: "What's included in your Namakaran invitation", items: FEATURES }}
        steps={[
          { title: 'Enter ceremony details', copy: 'Baby\'s name, parents\' names, muhurat, venue, schedule and a blessing message.' },
          { title: 'Upload baby photos', copy: 'The baby\'s first photos make the invitation personal and unforgettable.' },
          { title: 'Pay once & share', copy: 'Publish for a one-time price and send it to every family group in one tap.' },
        ]}
        faqTitle="Namakaran invitation questions"
        faqs={faqs}
        related={[
          { href: '/namakaran-invitation-wording', label: 'Namakaran invitation wording' },
          { href: '/baby-shower-invitation-wording', label: 'Baby shower wording' },
          { href: '/digital-invitation', label: 'All digital invitations' },
        ]}
        closing={{ title: 'Create your digital Namakaran invitation' }}
      />
    </>
  )
}
