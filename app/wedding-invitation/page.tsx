import type { Metadata } from 'next'
import { RingIcon, CalendarIcon, ClockIcon, MusicIcon, CameraIcon, MessageIcon, ClipboardIcon, ShirtIcon, ShareIcon } from '@/components/ui/Icons'
import OccasionPage, { faqPageJsonLd } from '@/components/landing/OccasionPage'
import { LOWEST_PAID_PRICE, templatePrice } from '@/lib/plans'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Wedding Invitation India | ShareInvite' },
  description:
    'Free digital wedding invitation for India — share on WhatsApp with countdown, Google Maps, photo gallery & RSVP. Ready in 5 minutes.',
  keywords: [
    'digital wedding invitation India free',
    'online wedding invitation website India',
    'Indian wedding e-invite',
    'free wedding invitation website India',
    'wedding invitation WhatsApp link',
    'digital wedding card India',
    'shaadi invitation website',
    'wedding website builder India free',
    'wedding invitation Bangalore',
    'wedding invitation Mumbai',
    'wedding invitation Delhi',
  ],
  alternates: { canonical: `${APP_URL}/wedding-invitation` },
  openGraph: {
    title: 'Free Digital Wedding Invitation Website India | ShareInvite',
    description: 'Create a stunning digital wedding invitation website for your Indian wedding. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Wedding Invitation Website India' }],
  },
}

// Visible FAQ and JSON-LD share this list. "ShareInvite includes all of these"
// overstated it — features vary by design — and was reworded.
const FAQS = [
  {
    question: 'How do I create a free digital wedding invitation website in India?',
    answer: `Choose a wedding design, enter names, date, venue and a personal message, and preview it as you type. Building and previewing is free; publishing a wedding design is a one-time payment from ₹${templatePrice('elegant-wedding')} (designs for other occasions start at ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}). You get your unique link the moment you publish — ready to share on WhatsApp.`,
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
          { href: '/wedding-invitations', label: 'Wedding designs gallery' },
          { href: '/engagement-invitation', label: 'Engagement invitations' },
          { href: '/blog/category/wedding', label: 'Wedding ideas' },
        ]}
        closing={{ title: 'Create your digital wedding invitation' }}
      />
    </>
  )
}
