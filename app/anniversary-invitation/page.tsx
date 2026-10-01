import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { templatePrice } from '@/lib/plans'
import { CameraIcon, ClockIcon, MapPinIcon, MusicIcon, MessageIcon, ClipboardIcon, ShareIcon, SparklesIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: `Digital Anniversary Invitation Online — ₹${templatePrice('anniversary')} | ShareInvite` },
  description:
    `Anniversary invitation for silver, golden & milestone years — photos, countdown & guest wishes on one WhatsApp link. Preview before you pay; ₹${templatePrice('anniversary')} once.`,
  keywords: [
    'anniversary invitation',
    'digital anniversary invitation India',
    'anniversary invitation digital',
    '25th anniversary invitation',
    'silver anniversary invitation',
    'golden anniversary invitation',
    'anniversary e-invite India',
    'anniversary invitation WhatsApp',
  ],
  alternates: { canonical: `${APP_URL}/anniversary-invitation` },
  openGraph: {
    title: `Digital Anniversary Invitation Online — ₹${templatePrice('anniversary')} | ShareInvite`,
    description: 'Digital anniversary invitation for India. Silver, golden & milestone anniversary e-invites. WhatsApp-ready with photos & countdown.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Anniversary Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital anniversary invitation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose an anniversary template, enter the couple\'s names, anniversary year, celebration date, venue, and a personal message. Upload milestone photos from across the years, and your invitation is live in under 5 minutes — with a WhatsApp-shareable link for all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a 25th anniversary invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A 25th (Silver) anniversary invitation should include: the couple\'s names, the milestone year prominently (25 Years Together), the celebration date and time, venue with address and Google Maps link, programme schedule (pooja, cake cutting, dinner), dress code if any, and a heartfelt message from the family. Adding a photo gallery of the couple across 25 years makes the digital invitation particularly meaningful.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it appropriate to send an anniversary invitation on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. WhatsApp is the most practical and inclusive channel for Indian families — it reaches both younger family members and elders who may not check email. Send a short celebratory message alongside your digital invitation link so guests get all the details at a tap. No app download is needed for guests to view the invitation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I include a photo album in the anniversary invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. ShareInvite's anniversary invitation includes a photo gallery section where you can upload the couple's photos from across the years — wedding photos, family milestones, travel memories, and recent pictures. Guests can swipe through the gallery while viewing the invitation, which makes the digital invite feel like a celebration in itself.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital anniversary invitation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Anniversary template is ₹499 as a one-time payment — no subscription, and no charge per guest. You can fill in every detail and preview the finished invitation before paying; payment is only requested at the final publish step.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I send a milestone anniversary invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a 25th or 50th anniversary, send the invitation two to three weeks ahead — four if family is travelling from other cities. For a small dinner, a week is usually enough. A reminder is just the same link shared again.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can children make the anniversary invitation for their parents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, and it is one of the most common reasons people use it. Name your parents as the couple, host the celebration in your own names, and add a few lines from the children to the personal message.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <CameraIcon />, title: 'Couple Photos & Story', desc: 'Upload your favourite photos across the years in a beautifully arranged gallery.' },
  { icon: <SparklesIcon />, title: 'Milestone Year Display', desc: 'Show your anniversary milestone (25th, 50th) in beautiful display typography.' },
  { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A ticking countdown to the celebration — guests feel the anticipation.' },
  { icon: <MapPinIcon />, title: 'Venue + Google Maps', desc: 'Full venue address with one-tap Google Maps directions for guests.' },
  { icon: <ClipboardIcon />, title: 'Anniversary Timeline', desc: 'List your journey — where you met, got married, milestones — as a celebration schedule.' },
  { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect warm messages, blessings, and congratulations from attending and distant guests.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Play a meaningful song — your wedding song or a favourite — as guests view the invite.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'Share across all family groups in one tap — no app download needed for guests.' },
]

const MILESTONES = [
  { year: '1st', name: 'Paper Anniversary', theme: 'New Beginnings', desc: 'The first year is the foundation. A paper anniversary celebration marks one full year of building a life together — a milestone worth sharing with those who witnessed the beginning.' },
  { year: '5th', name: 'Wood Anniversary', theme: 'Half Decade Together', desc: 'Five years of strength and growth. A wooden anniversary celebration shows that the relationship has roots — and deserves to be celebrated with family and close friends.' },
  { year: '10th', name: 'Tin Anniversary', theme: 'A Decade of Love', desc: 'Ten years is a significant milestone. A decade-anniversary celebration with a digital invitation, photos from across the years, and a family gathering marks this accomplishment beautifully.' },
  { year: '25th', name: 'Silver Jubilee', theme: 'Silver Anniversary', desc: 'Twenty-five years together is a rare and beautiful achievement. The Silver Jubilee is one of the most celebrated anniversary milestones in Indian families — often with a large ceremony, renewal of vows, and a celebration that rivals a wedding.' },
  { year: '50th', name: 'Golden Jubilee', theme: 'Golden Anniversary', desc: 'Fifty years of togetherness is extraordinary. A Golden Jubilee celebration is a family legacy event — often bringing children, grandchildren, and lifelong friends together for a ceremony full of gratitude, stories, and blessings.' },
  { year: '60th', name: 'Diamond Anniversary', theme: 'Diamond Anniversary', desc: 'Sixty years together represents a love as enduring and rare as a diamond. A Diamond Anniversary celebration is a deeply emotional, once-in-a-lifetime event that the entire family will treasure forever.' },
]

const CITIES = ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="anniversary"
        templateId="anniversary"
        pageKey="anniversary_landing"
        crumb="Anniversary invitations"
        eyebrow="Digital anniversary invitations"
        title={<>Digital Anniversary Invitation <em className="font-medium text-burnished">Silver · Golden · Milestone</em></>}
        lede={`Mark 25, 50 or any milestone year with a beautiful invitation — couple photos, your story, a countdown and guest wishes, all on one WhatsApp link. Build and preview before you pay — publish for ₹${templatePrice('anniversary')} one-time.`}
        ctaLabel="Start my anniversary invite"
        types={{
          eyebrow: 'Milestones',
          title: 'Anniversary milestones worth celebrating',
          sub: 'Every year together is worth celebrating — and some milestones deserve a proper invitation.',
          items: MILESTONES.map((m) => ({ name: `${m.year} · ${m.name}`, tag: m.theme !== m.name ? m.theme : undefined, desc: m.desc })),
        }}
        features={{ title: "What's included in your digital anniversary invitation", items: FEATURES }}
        steps={[
          { title: 'Add couple details', copy: 'Both names, the anniversary year and date, venue, story highlights and a message.' },
          { title: 'Upload milestone photos', copy: 'Photos from across the years — wedding, milestones, family — bring the celebration to life.' },
          { title: 'Pay once & share', copy: 'Publish for a one-time price and send it to every family and friends group.' },
        ]}
        faqTitle="Digital anniversary invitation questions"
        faqs={faqs}
        cities={{ base: '/anniversary-invitation', title: 'Anniversary invitations by city', list: CITIES }}
        related={[
          { href: '/wedding-invitation', label: 'Wedding invitations' },
          { href: '/engagement-invitation', label: 'Engagement invitations' },
          { href: '/digital-invitation', label: 'All digital invitations' },
          { href: '/templates', label: 'Browse every design' },
        ]}
        closing={{ title: 'Create your anniversary invitation today' }}
      />
    </>
  )
}
