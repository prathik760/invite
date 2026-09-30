import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { CakeIcon, ClockIcon, MapPinIcon, CameraIcon, MusicIcon, SparklesIcon } from '@/components/ui/Icons'
import { templatePrice } from '@/lib/plans'


const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Digital Birthday Invitation India — Build Free, Publish ₹299 | ShareInvite' },
  description:
    'Create a digital birthday invitation for India in 5 minutes — live countdown, photo gallery, Google Maps and a one-tap WhatsApp link. Build and preview free; publish for ₹299 one-time. No app needed for guests.',
  keywords: [
    'digital birthday invitation India',
    'online birthday invitation India',
    'birthday e-invite India',
    'WhatsApp birthday invitation link',
    'digital birthday card India',
    'birthday invitation website India price',
    'Bollywood birthday invitation',
    'birthday invitation online maker',
    'birthday invitation website India',
  ],
  alternates: { canonical: `${APP_URL}/birthday-invitation` },
  openGraph: {
    title: 'Digital Birthday Invitation Website India | ShareInvite',
    description: 'Create a beautiful digital birthday invitation in 5 minutes. WhatsApp-ready. Build and preview free — publish for ₹299 one-time.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Birthday Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a digital birthday invitation cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Janamdin birthday template is ₹299 as a one-time payment — there is no subscription and no per-guest charge. You can build the entire invitation and preview exactly how it will look before paying; payment is only requested at the final publish step.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add photos to a digital birthday invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ShareInvite lets you upload photos that appear in a beautiful gallery on the invitation page. Guests can swipe through photos of the birthday person while viewing the invite details.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes ShareInvite birthday invitations different from WhatsApp image invites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike a static image, ShareInvite creates a live invitation page with a countdown timer, Google Maps directions, photo gallery, background music, and a guest wishes section — all from a single WhatsApp link. You send it once, and guests never need to install an app.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I create a digital birthday invitation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, pick the Janamdin Birthday template, enter the celebrant\'s name, age, date, venue and message, then preview and publish. Your birthday invitation is live with a WhatsApp-shareable link in under 5 minutes.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <CakeIcon />, title: 'Celebrant name & age', desc: "The birthday person's name and milestone age, beautifully set." },
  { icon: <ClockIcon />, title: 'Live countdown', desc: 'A ticking timer to the party that keeps guests excited.' },
  { icon: <MapPinIcon />, title: 'Venue & Google Maps', desc: 'Venue name, address and a one-tap directions button.' },
  { icon: <CameraIcon />, title: 'Photo gallery', desc: "The birthday person's photos for a warm, personal invite." },
  { icon: <MusicIcon />, title: 'Favourite song', desc: 'Their favourite track plays when guests open the invite.' },
  { icon: <SparklesIcon />, title: 'Party schedule', desc: 'Cocktails, cake cutting, games — a clear timeline for guests.' },
]

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="birthday"
        templateId="indian-birthday"
        pageKey="birthday_landing"
        crumb="Birthday invitations"
        eyebrow="Digital birthday invitations"
        title={<>Digital Birthday Invitation <em className="font-medium text-burnished">for every age</em></>}
        lede={`Create a beautiful birthday invitation with photos, a countdown, the venue on Google Maps and the party schedule — then share one WhatsApp link your guests open instantly. Build and preview free — publish for ₹${templatePrice('indian-birthday')} one-time.`}
        ctaLabel="Start my birthday invite"
        features={{ title: "What's included in your digital birthday invitation", items: FEATURES }}
        steps={[
          { title: 'Choose a birthday design', copy: 'A festive party invite or an interactive 3D surprise — preview each one live.' },
          { title: 'Add the celebrant\'s details', copy: 'Name, milestone age, date, venue, schedule and photos. The preview updates as you type.' },
          { title: 'Pay once & share', copy: 'Publish for a one-time price and send the link to every family and friends group.' },
        ]}
        faqTitle="Digital birthday invitation questions"
        faqs={faqs}
        cities={{ base: '/birthday-invitation', title: 'Birthday invitations by city', list: ['bengaluru','mumbai','delhi','hyderabad','chennai','pune','kolkata','ahmedabad'] }}
        related={[
          { href: '/birthday-invitation-wording', label: 'Birthday invitation wording' },
          { href: '/birthday-invitations', label: 'Birthday designs gallery' },
          { href: '/blog/category/birthday', label: 'Birthday ideas' },
        ]}
        closing={{ title: 'Create a memorable birthday invitation' }}
      />
    </>
  )
}
