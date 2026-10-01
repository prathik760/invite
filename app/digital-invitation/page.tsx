import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion from '@/components/landing/FAQAccordion'
import TemplateBrowser from '@/components/catalog/TemplateBrowser'
import PageHero from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { OCCASIONS } from '@/lib/catalog'
import { buildCatalogItems, occasionChips } from '@/lib/catalogItems'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { priceRangeSentence } from '@/lib/priceCopy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: `Digital Invitation Maker India — from ₹${LOWEST_PAID_PRICE} | ShareInvite` },
  description:
    `Make a digital invitation for a wedding, birthday, Griha Pravesh, Namakaran & more — one WhatsApp link. Preview before you pay; from ₹${LOWEST_PAID_PRICE} one-time.`,
  keywords: [
    'digital invitation website India',
    'digital invitation card India',
    'e-invite India',
    'digital invitation WhatsApp India',
    'online invitation maker India',
    'digital invite card maker',
    'house warming invitation online India',
    'namakaran invitation digital',
    'engagement invitation website India',
    'griha pravesh invitation online',
  ],
  alternates: { canonical: `${APP_URL}/digital-invitation` },
  openGraph: {
    title: `Digital Invitation Maker India — from ₹${LOWEST_PAID_PRICE} | ShareInvite`,
    description: `Make a digital invitation for a wedding, birthday, Griha Pravesh, Namakaran & more — one WhatsApp link. Preview before you pay; from ₹${LOWEST_PAID_PRICE} one-time.`,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Invitation Website India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a digital invitation website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A digital invitation website is a mobile-optimised web page containing all event details — date, time, venue, schedule, photos, music, and countdown — accessible from a single shareable link. Guests open it from WhatsApp without installing any app.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital invitation better than a PDF or image invite on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A digital invitation website is interactive — it has a live countdown, one-tap Google Maps, a photo gallery, background music, and a guest wishes section. It opens faster than a PDF and works on all phones without any downloads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which occasions can I create digital invitations for on ShareInvite?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ShareInvite supports 10 Indian event types: weddings, engagements (Mangni), birthdays (Janamdin), house warmings (Griha Pravesh), naming ceremonies (Namakaran), anniversaries, festivals such as Ganesh Chaturthi and Raksha Bandhan, and animated 3D greetings. For anything else, you can request a custom design.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital invitation cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `There is no payment until you publish — you can build and preview any design first. Publishing is a one-time payment for the design you choose, and each design has its own price: ${priceRangeSentence()} No monthly fees, no hidden charges.`,
      },
    },
  ],
}

export default function DigitalInvitationPage() {
  const items = buildCatalogItems(['luxury-wedding', 'indian-birthday', 'indian-engagement', 'griha-pravesh', 'namakaran', 'anniversary', 'greeting-love', 'ganesh-chaturthi'], { keepOrder: true })
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Digital invitations' }]}
        eyebrow="Online invitation maker"
        title={<>Digital Invitation Website <em className="font-medium text-burnished">for Every Occasion</em></>}
        lede="A beautiful invitation page for your wedding, birthday, housewarming, naming ceremony or festival — shared as one WhatsApp link that opens on any phone, anywhere."
        actions={
          <>
            <Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Create your invitation <ArrowRightIcon />
            </Link>
            <a href="#occasions" className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold">
              Find your occasion
            </a>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta="Create your invitation" location="digital_invitation_offer" />}
      />

      <Section id="occasions" aria-label="Occasions">
        <SectionHeading eyebrow="Every occasion" title="Digital invitation templates for every occasion" />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5" data-reveal-group>
          {OCCASIONS.map((o) => (
            <li key={o.key}>
              <Link href={o.href} className="lift group block overflow-hidden rounded-3xl border border-line bg-paper">
                <span className="relative block aspect-[384/300] overflow-hidden bg-peach">
                  <Image src={o.image} alt="" fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                </span>
                <span className="block px-4 py-3.5">
                  <span className="block font-editorial text-[1.3rem] font-semibold leading-tight">{o.label}</span>
                  <span className="mt-0.5 block truncate text-[0.8rem] text-muted">{o.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" aria-label="Designs">
        <SectionHeading
          eyebrow="The designs"
          title="Choose a design you love"
          sub="Open any design in a live preview. Each has one price, paid once when you publish."
          action={{ href: '/templates', label: 'Every design' }}
        />
        <div className="mt-9">
          <TemplateBrowser items={items} chips={occasionChips(items)} source="digital_invitation_gallery" limit={8} showCount={false} />
        </div>
      </Section>

      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title="Three steps to your invitation" />
        <div className="mt-12"><HowItWorks /></div>
      </Section>

      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title="Digital invitation maker — questions" />
        <div className="mt-10"><FAQAccordion faqs={faqs} /></div>
      </Section>

      <CtaBand title="Create your digital invitation today" location="digital_invitation_footer" />
      <SiteFooter />
    </main>
  )
}
