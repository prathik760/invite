import type { Metadata } from 'next'
import TemplateGallery from '@/components/TemplateGallery'

export const metadata: Metadata = {
  title: 'Engagement Invitation Templates – Mangni, Roka & Sagai Designs | ShareInvite',
  description:
    'Browse digital engagement invitation templates for Mangni, Roka, Sagai, Nishchayathartham, and ring ceremonies. Romantic Indian designs to customise and share on WhatsApp.',
  keywords: [
    'engagement invitation templates India',
    'digital engagement invitation',
    'Mangni invitation template',
    'Roka invitation design',
    'Sagai invitation WhatsApp',
  ],
  alternates: { canonical: 'https://shareinvite.in/engagement-invitations' },
  openGraph: {
    title: 'Engagement Invitation Templates – Mangni, Roka & Sagai Designs',
    description: 'Browse digital engagement invitation templates for Mangni, Roka, Sagai, and ring ceremonies. Romantic Indian designs to share on WhatsApp.',
    url: 'https://shareinvite.in/engagement-invitations',
    type: 'website',
  },
}

const templates = [
  {
    name: 'Mangni — Engagement',
    slug: 'mangni-engagement-invitation-template',
    templateId: 'indian-engagement',
    theme: 'Romantic',
    category: 'Mangni',
    previewImage: '/templates/mangni-preview.jpg',
  },
]

const faq = [
  {
    question: 'Which template works for a Roka or Sagai ceremony?',
    answer:
      'The Mangni template is designed for all Indian engagement ceremonies. You can change the ceremony label to Roka, Sagai, Mangni, Misri, or Nishchayathartham to match your community\'s tradition. Both families\' names appear with equal prominence.',
  },
  {
    question: 'Can I add both families\' names to the engagement invitation?',
    answer:
      'Yes. All ShareInvite engagement templates support the traditional Indian format with both families\' names, the couple\'s names, ceremony type, date, venue, and a personal message. You can list the host family first or show both families jointly.',
  },
  {
    question: 'Is there a template for a combined Roka and ring ceremony?',
    answer:
      'Yes. The event schedule section lets you list multiple events (Roka, ring exchange, dinner) with their individual timings — all visible from one WhatsApp link. Guests can see the full programme without calling to ask for details.',
  },
  {
    question: 'How early should I send engagement invitations?',
    answer:
      'Send engagement invitations 10–14 days before the ceremony for local guests. If family is travelling from another city, send 3 weeks in advance so they can plan travel. A digital invitation lets you reshare the same link as a reminder 2 days before without any extra effort.',
  },
]

export default function EngagementInvitationsPage() {
  return (
    <TemplateGallery
      title="Engagement Invitation Templates"
      subtitle="Browse romantic invitation templates for Mangni, Roka, Sagai, Nishchayathartham, and ring ceremonies across India. Personalise any design and share on WhatsApp in minutes."
      filters={['All', 'Mangni', 'Roka', 'Sagai', 'Modern']}
      templates={templates}
      singularPageHref="/engagement-invitation"
      singularPageLabel="Learn how to create a digital engagement invitation"
      faq={faq}
    />
  )
}
