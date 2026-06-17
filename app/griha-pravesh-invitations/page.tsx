import type { Metadata } from 'next'
import TemplateGallery from '@/components/TemplateGallery'

export const metadata: Metadata = {
  title: 'Griha Pravesh Invitation Templates – Housewarming Designs | ShareInvite',
  description:
    'Browse free Griha Pravesh and housewarming invitation templates with pooja schedule, venue map, and WhatsApp sharing. Traditional and modern designs. Ready in 5 minutes.',
  keywords: [
    'Griha Pravesh invitation templates',
    'digital housewarming invitation India',
    'Gruhapravesham invitation design',
    'Griha Pravesh e-invite WhatsApp',
    'housewarming invitation template free',
  ],
  alternates: { canonical: 'https://shareinvite.in/griha-pravesh-invitations' },
  openGraph: {
    title: 'Griha Pravesh Invitation Templates – Housewarming Designs',
    description: 'Browse Griha Pravesh and housewarming invitation templates with pooja schedule, Google Maps, and WhatsApp sharing. Traditional and modern designs.',
    url: 'https://shareinvite.in/griha-pravesh-invitations',
    type: 'website',
  },
}

const templates = [
  {
    name: 'Griha Pravesh — House Warming',
    slug: 'griha-pravesh-house-warming-invitation-template',
    templateId: 'griha-pravesh',
    theme: 'Traditional',
    category: 'Traditional',
    previewImage: '/templates/griha-pravesh-preview.jpg',
  },
]

const faq = [
  {
    question: 'Can I include the pooja schedule in a Griha Pravesh invitation?',
    answer:
      'Yes. The event schedule section supports multiple ceremony timings — Ganesh pooja, Vastu pooja, Griha Pravesh muhurat entry, havan, lunch. Guests can see the full programme from one WhatsApp link and arrive on time for the muhurat without calling you on the morning.',
  },
  {
    question: 'Can I add Google Maps to the Griha Pravesh invitation?',
    answer:
      'Yes. Every ShareInvite page includes a Google Maps integration pinned to your exact location — including the correct apartment gate or building entrance for new residential complexes. Guests tap once to open navigation directly, removing the most common source of confusion on the ceremony morning.',
  },
  {
    question: 'What is the difference between Griha Pravesh and Gruhapravesham?',
    answer:
      'Both refer to the same ceremony — the auspicious first entry into a new home with prayers and family blessings. Griha Pravesh is the Sanskrit and North Indian term. Gruhapravesham is the South Indian (Telugu, Tamil, Kannada) equivalent. Use whichever term your family tradition follows in the invitation.',
  },
  {
    question: 'Is the Griha Pravesh invitation template free?',
    answer:
      'The Griha Pravesh template is available starting at ₹499 — a one-time cost covering all features including muhurat time display, pooja schedule, Google Maps, photo gallery, background music, guest wishes, and the WhatsApp-shareable link. The free plan is also available with the Elegant Wedding template.',
  },
]

export default function GrihaPraveshInvitationsPage() {
  return (
    <TemplateGallery
      title="Griha Pravesh Invitation Templates"
      subtitle="Browse digital invitation templates for Griha Pravesh and housewarming ceremonies. Add the muhurat time, pooja schedule, venue, and Google Maps — share on WhatsApp instantly."
      filters={['All', 'Traditional', 'Modern', 'Pooja-focused']}
      templates={templates}
      singularPageHref="/griha-pravesh-invitation"
      singularPageLabel="Learn how to create a digital Griha Pravesh invitation"
      faq={faq}
    />
  )
}
