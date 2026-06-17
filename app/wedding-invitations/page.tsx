import type { Metadata } from 'next'
import TemplateGallery from '@/components/TemplateGallery'

export const metadata: Metadata = {
  title: 'Wedding Invitation Templates – Browse All Indian Designs | ShareInvite',
  description:
    'Browse free digital wedding invitation templates for Indian weddings. Traditional, modern, South Indian, and royal designs. Customise and share on WhatsApp instantly.',
  keywords: [
    'wedding invitation templates India',
    'digital wedding invitation templates',
    'Indian wedding invitation designs',
    'free wedding invitation templates',
    'WhatsApp wedding invitation',
  ],
  alternates: { canonical: 'https://shareinvite.in/wedding-invitations' },
  openGraph: {
    title: 'Wedding Invitation Templates – Browse All Indian Designs',
    description: 'Browse free digital wedding invitation templates for Indian weddings. Traditional, modern, South Indian, and royal designs. Share on WhatsApp.',
    url: 'https://shareinvite.in/wedding-invitations',
    type: 'website',
  },
}

const templates = [
  {
    name: 'Elegant Wedding',
    slug: 'elegant-wedding-invitation-template',
    templateId: 'elegant-wedding',
    theme: 'Traditional',
    category: 'Traditional',
    previewImage: '/templates/elegant-preview.jpg',
  },
  {
    name: 'Shaadi — Indian Wedding',
    slug: 'shaadi-indian-wedding-invitation-template',
    templateId: 'indian-wedding',
    theme: 'South Indian',
    category: 'South Indian',
    previewImage: '/templates/shaadi-preview.jpg',
  },
  {
    name: 'KGF Royal Empire',
    slug: 'kgf-royal-empire-wedding-invitation-template',
    templateId: 'kgf-wedding',
    theme: 'Royal',
    category: 'Royal',
    previewImage: '/templates/kgf-preview.jpg',
  },
  {
    name: 'Royal Deco Palace',
    slug: 'royal-deco-palace-edition-invitation-template',
    templateId: 'royal-deco',
    theme: 'Royal',
    category: 'Royal',
    previewImage: '/templates/royal-deco-preview.jpg',
  },
  {
    name: 'Luxury Wedding',
    slug: 'luxury-wedding-invitation-template',
    templateId: 'luxury-wedding',
    theme: 'Modern',
    category: 'Modern',
    previewImage: '/templates/luxury-preview.jpg',
  },
  {
    name: 'Cinematic Night',
    slug: 'cinematic-night-invitation-template',
    templateId: 'cinematic-night',
    theme: 'Modern',
    category: 'Modern',
    previewImage: '/templates/cinematic-preview.jpg',
  },
]

const faq = [
  {
    question: 'Which wedding invitation template works best for a South Indian wedding?',
    answer:
      'The Shaadi — Indian Wedding template is designed for South Indian ceremonies. You can customise the ceremony name to Kalyanam, Vivah, or your community\'s tradition, along with the schedule, venue, and both family names.',
  },
  {
    question: 'Can I use the same template for Mehendi, Sangeet, and Reception?',
    answer:
      'Yes. You can create a separate ShareInvite page for each event and customise the title, schedule, and details independently. All events share from the same WhatsApp link format so guests can navigate between them easily.',
  },
  {
    question: 'Are the wedding invitation templates free?',
    answer:
      'The Elegant Wedding template is free. Premium templates — including Cinematic Night, KGF Royal Empire, and Royal Deco — are available as one-time purchases starting at ₹499. All templates include maps, gallery, music, RSVP, and WhatsApp sharing.',
  },
  {
    question: 'How long does it take to create a digital wedding invitation?',
    answer:
      'Most couples complete their invitation in 15–20 minutes. Choose a template, fill in the couple\'s names, wedding date, venue with Google Maps link, ceremony schedule, and upload a couple photo. The shareable WhatsApp link is ready immediately.',
  },
]

export default function WeddingInvitationsPage() {
  return (
    <TemplateGallery
      title="Wedding Invitation Templates"
      subtitle="Browse all digital wedding invitation templates for Indian ceremonies — traditional ivory, cinematic dark, royal gold, and modern minimal. Pick any design and go live in minutes."
      filters={['All', 'Traditional', 'South Indian', 'Royal', 'Modern']}
      templates={templates}
      singularPageHref="/wedding-invitation"
      singularPageLabel="Learn how to create a digital wedding invitation on ShareInvite"
      faq={faq}
    />
  )
}
