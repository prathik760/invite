import type { Metadata } from 'next'
import TemplateGallery from '@/components/TemplateGallery'

export const metadata: Metadata = {
  title: { absolute: 'Birthday Invitation Templates India | ShareInvite' },
  description:
    'Browse free birthday invitation templates for kids, adults, and milestone birthdays. Pick a design and share on WhatsApp in 5 minutes. Online RSVP included.',
  keywords: [
    'birthday invitation templates India',
    'digital birthday invitation templates',
    'free birthday invitation designs',
    'WhatsApp birthday invitation',
    'first birthday invitation template',
  ],
  alternates: { canonical: 'https://shareinvite.in/birthday-invitations' },
  openGraph: {
    title: 'Birthday Invitation Templates – Free Designs for Every Age',
    description: 'Browse free birthday invitation templates for kids, adults, and milestone birthdays. Pick a design and share on WhatsApp in 5 minutes.',
    url: 'https://shareinvite.in/birthday-invitations',
    type: 'website',
  },
}

const templates = [
  {
    name: 'Janamdin — Birthday',
    slug: 'janamdin-birthday-invitation-template',
    templateId: 'indian-birthday',
    theme: 'Festive',
    category: 'Kids',
    previewImage: '/templates/janamdin-preview.jpg',
  },
]

const faq = [
  {
    question: 'Which birthday invitation template works best for a kids birthday party?',
    answer:
      'The Janamdin template is vibrant and festive — well suited for children\'s parties with its warm colour palette. You can customise the theme colours, add party activity timings, and upload photos of the birthday child.',
  },
  {
    question: 'Can I use a birthday invitation template for a first birthday?',
    answer:
      'Yes. The Janamdin template works well for 1st birthdays. Add milestone stats (birth weight, first word, first steps date), upload a professional or candid baby photo, and enable the guest wishes section — guests who cannot attend can still leave a birthday blessing.',
  },
  {
    question: 'How do I share the birthday invitation on WhatsApp?',
    answer:
      'After creating your invitation on ShareInvite, copy the shareable link and paste it into any WhatsApp group or individual chat. WhatsApp automatically generates a preview card showing the invitation image, title, and details — guests tap to open the full page.',
  },
  {
    question: 'Can guests RSVP through the birthday invitation?',
    answer:
      'Yes. ShareInvite includes a guest wishes and response section on every invitation page. Guests open the link and leave a message or RSVP confirmation directly on the page. You can see all responses in your host dashboard.',
  },
]

export default function BirthdayInvitationsPage() {
  return (
    <TemplateGallery
      title="Birthday Invitation Templates"
      subtitle="Browse free birthday invitation designs for every age and celebration style. Pick any template, add your details, and share on WhatsApp in under 5 minutes."
      filters={['All', 'Kids', '1st Birthday', 'Milestone', 'Adults']}
      templates={templates}
      singularPageHref="/birthday-invitation"
      singularPageLabel="Learn how birthday invitations work on ShareInvite"
      faq={faq}
    />
  )
}
