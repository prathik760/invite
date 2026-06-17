import type { Metadata } from 'next'
import TemplateGallery from '@/components/TemplateGallery'

export const metadata: Metadata = {
  title: 'Anniversary Invitation Templates – Silver, Golden & Milestone Designs | ShareInvite',
  description:
    'Browse anniversary invitation templates for silver, golden, and milestone anniversaries. Elegant designs with photo gallery, RSVP, and WhatsApp sharing. Free to start.',
  keywords: [
    'anniversary invitation templates India',
    'digital anniversary invitation',
    'silver anniversary invitation',
    'golden anniversary e-invite',
    '25th anniversary invitation WhatsApp',
  ],
  alternates: { canonical: 'https://shareinvite.in/anniversary-invitations' },
  openGraph: {
    title: 'Anniversary Invitation Templates – Silver, Golden & Milestone Designs',
    description: 'Browse anniversary invitation templates for silver, golden, and milestone anniversaries. Elegant designs with RSVP and WhatsApp sharing.',
    url: 'https://shareinvite.in/anniversary-invitations',
    type: 'website',
  },
}

const templates = [
  {
    name: 'Saalgirah — Anniversary',
    slug: 'saalgirah-anniversary-invitation-template',
    templateId: 'anniversary',
    theme: 'Elegant',
    category: 'Milestone',
    previewImage: '/templates/saalgirah-preview.jpg',
  },
]

const faq = [
  {
    question: 'Is there a template specifically for a 25th silver anniversary?',
    answer:
      'The Saalgirah template works beautifully for silver anniversaries. Add a photo gallery with couple photos from across the years, set the colour palette to silver and white, and include a personal message from the family. The countdown timer adds excitement in the days before the celebration.',
  },
  {
    question: 'Can I include old photos in the anniversary invitation?',
    answer:
      'Yes. The photo gallery section supports multiple images — perfect for adding couple photos from different decades. A "then and now" photo gallery is one of the most appreciated touches in anniversary invitations on ShareInvite.',
  },
  {
    question: 'How far in advance should I send a milestone anniversary invitation?',
    answer:
      'For milestone anniversaries (25th, 50th), send the digital invitation 2–3 weeks in advance. If family is travelling from other cities, send 4 weeks ahead. For smaller gatherings, 1 week is usually enough. Digital invitations make reminder-sharing effortless — just reshare the same link.',
  },
  {
    question: 'Can children organise an anniversary invitation for their parents?',
    answer:
      'Yes, and this is a common use case on ShareInvite. Adult children hosting their parents\' anniversary can list the parents as the celebrants and organise the event as hosts. Include a personal note from the children alongside the formal invitation for a warm, memorable touch.',
  },
]

export default function AnniversaryInvitationsPage() {
  return (
    <TemplateGallery
      title="Anniversary Invitation Templates"
      subtitle="Browse elegant anniversary invitation templates for silver, golden, and milestone celebrations. Add your story, couple photos, and share on WhatsApp in minutes."
      filters={['All', 'Milestone', '25th Silver', '50th Golden', 'Modern']}
      templates={templates}
      singularPageHref="/anniversary-invitation"
      singularPageLabel="Learn how to create a digital anniversary invitation"
      faq={faq}
    />
  )
}
