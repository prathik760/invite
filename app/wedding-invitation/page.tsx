import type { Metadata } from 'next'
import { RingIcon, CalendarIcon, ClockIcon, MusicIcon, CameraIcon, MessageIcon, ClipboardIcon, ShirtIcon, ShareIcon } from '@/components/ui/Icons'
import OccasionPage, { faqPageJsonLd } from '@/components/landing/OccasionPage'
import { LOWEST_PAID_PRICE, templatePrice } from '@/lib/plans'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: `Digital Wedding Invitation Online — from ₹${templatePrice('elegant-wedding')} | ShareInvite` },
  description:
    `Create a digital wedding invitation and share one WhatsApp link — countdown, Google Maps, photos & music. Preview before you pay, from ₹${templatePrice('elegant-wedding')} once.`,
  keywords: [
    'digital wedding invitation India',
    'online wedding invitation website India',
    'Indian wedding e-invite',
    'wedding invitation website India',
    'wedding invitation WhatsApp link',
    'digital wedding card India',
    'shaadi invitation website',
    'wedding website builder India',
    'wedding invitation Bangalore',
    'wedding invitation Mumbai',
    'wedding invitation Delhi',
  ],
  alternates: { canonical: `${APP_URL}/wedding-invitation` },
  openGraph: {
    title: `Digital Wedding Invitation Online — from ₹${templatePrice('elegant-wedding')} | ShareInvite`,
    description: `Create a digital wedding invitation and share one WhatsApp link — countdown, Google Maps, photos & music. Preview before you pay, from ₹${templatePrice('elegant-wedding')} once.`,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Wedding Invitation Website India' }],
  },
}

// Visible FAQ and JSON-LD share this list. "ShareInvite includes all of these"
// overstated it — features vary by design — and was reworded.
const FAQS = [
  {
    question: 'How do I create a digital wedding invitation in India?',
    answer: `Choose a wedding design, enter names, date, venue and a personal message, and preview it as you type. There is no payment until you publish; publishing a wedding design is a one-time payment from ₹${templatePrice('elegant-wedding')} (designs for other occasions start at ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}). You get your unique link the moment you publish — ready to share on WhatsApp.`,
  },
  {
    question: 'What should a digital wedding invitation include?',
    answer: "A complete digital wedding invitation should include: bride and groom names, wedding date and time, ceremony venue with a Google Maps link, the event schedule (baraat, varmala, pheras, dinner), dress code, a personal message, a photo gallery and background music. ShareInvite's wedding designs are built around exactly these — the live preview shows what each design contains.",
  },
  {
    question: 'Can I share a digital wedding invitation on WhatsApp?',
    answer: 'Yes. ShareInvite creates a shareable link like shareinvite.in/e/your-names that opens instantly from WhatsApp without any app download. Guests can see the full invitation, get directions, and leave wishes directly from the link.',
  },
  {
    question: 'Is a digital wedding invitation better than a PDF card?',
    answer: 'For most families, yes. It loads faster than a PDF and adds a live countdown, one-tap Google Maps, a photo gallery, background music and a guest wishes section. Guests can reopen it any time before the wedding.',
  },
  {
    question: 'Can I make separate invitations for the Mehendi, Sangeet and Reception?',
    answer: 'Yes. Each function can have its own invitation — the Haldi & Mehendi and Sangeet Night designs are made for those evenings, and once you have paid for a design you can publish it again for another function, such as the reception, without paying twice. The Signature wedding suites put every function on one page instead.',
  },
  {
    question: 'Which design suits a South Indian wedding?',
    answer: 'Kalyanam is a Signature suite made for South Indian weddings, with the Nichayathartham, Muhurtham and Reception, both families and a WhatsApp RSVP on one page. For a simpler invitation, any wedding design works — write the ceremony name your family uses into the message.',
  },
  {
    question: 'How long does it take to create a digital wedding invitation?',
    answer: 'Most couples finish in 15–20 minutes: choose a design, add your names, the date, the venue with a Google Maps link, the schedule and a photo, and preview it. The link is ready the moment you publish.',
  },
]

const CITIES = ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

export default function WeddingInvitationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }} />
      <OccasionPage
        occasion="wedding"
        templateId="elegant-wedding"
        pageKey="wedding_landing"
        crumb="Wedding invitations"
        eyebrow="Digital wedding invitations"
        title={<>Digital Wedding Invitation <em className="font-medium text-burnished">Website for India</em></>}
        lede="Create a beautiful digital wedding invitation in minutes and share one WhatsApp link — no PDF, no printing, no app for guests. Everyone gets directions, the ceremony schedule, your photos and more."
        ctaLabel="Start my wedding invite"
        features={{
          title: "What's included in a digital wedding invitation",
          items: [
            { icon: <RingIcon />, title: 'Bride & groom names', desc: 'Beautiful typography designed for your names, with a script "&".' },
            { icon: <CalendarIcon />, title: 'Date, time & venue', desc: 'Ceremony details with the full address and one-tap Google Maps directions.' },
            { icon: <ClockIcon />, title: 'Live countdown', desc: 'A ticking countdown to the wedding moment that builds excitement.' },
            { icon: <MusicIcon />, title: 'Background music', desc: 'Your favourite song plays softly as guests view the invitation.' },
            { icon: <CameraIcon />, title: 'Photo gallery', desc: 'Pre-wedding photos for a personal, emotional touch.' },
            { icon: <MessageIcon />, title: 'Guest wishes', desc: 'Heartfelt messages from guests, right on the invitation page.' },
            { icon: <ClipboardIcon />, title: 'Ceremony schedule', desc: 'Baraat, varmala, saat pheras, reception — one clear timeline.' },
            { icon: <ShirtIcon />, title: 'Dress code', desc: 'So guests arrive dressed for the occasion.' },
            { icon: <ShareIcon />, title: 'Share on WhatsApp', desc: 'One tap to forward the invite to every family and friends group.' },
          ],
        }}
        steps={[
          { title: 'Choose a wedding design', copy: 'Classic ivory, cinematic, royal Art Deco or grand traditional — preview each one live.' },
          { title: 'Add your details', copy: 'Names, muhurat, venues, schedule and photos. Switch designs any time and keep your details.' },
          { title: 'Pay once & share', copy: 'Publish your design for a one-time price and send the link to every guest.' },
        ]}
        faqTitle="Digital wedding invitation questions"
        faqs={FAQS}
        cities={{ base: '/wedding-invitation', title: 'Wedding invitations by city', list: CITIES }}
        related={[
          { href: '/wedding-invitation-wording', label: 'Wedding invitation wording' },
          { href: '/templates/category/wedding', label: 'Wedding designs' },
          { href: '/engagement-invitation', label: 'Engagement invitations' },
          { href: '/blog/category/wedding', label: 'Wedding ideas' },
        ]}
        closing={{ title: 'Create your digital wedding invitation' }}
      />
    </>
  )
}
