import Script from 'next/script'
import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion from '@/components/landing/FAQAccordion'
import PageHero from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import CtaBand from '@/components/brand/CtaBand'
import TrustList from '@/components/brand/TrustList'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, CheckIcon, EyeIcon, GlobeIcon, LinkIcon, ShieldIcon } from '@/components/ui/Icons'
import { TEMPLATES } from '@/modules/templates/data'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE, formatTemplatePrice, templatePrice } from '@/lib/plans'
import { digitalOffer, templateSeoSlug } from '@/lib/seo'
import { templateImage, templateImageUrl } from '@/lib/templateMedia'
import { OCCASIONS, displayName, primaryOccasion } from '@/lib/catalog'
import { OFFER } from '@/lib/offer'
import { priceByDesignSentence, priceRangeSentence } from '@/lib/priceCopy'
import SignatureShowcase from '@/components/brand/SignatureShowcase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { absolute: 'Pricing — One Design, One Price | ShareInvite' },
  description:
    `Simple one-time pricing for digital invitation designs. Build and preview any design free, then pay once for the one you publish. ${priceRangeSentence()} No subscription, no hidden charges.`,
  keywords: [
    'digital invitation price india',
    'wedding invitation cost online india',
    'shareinvite pricing',
    'digital invite one-time payment india',
    'online wedding invitation price',
    'e-invitation cost india',
    'digital invitation maker price',
  ],
  openGraph: {
    title: 'ShareInvite Pricing — One Design, One Price, Everything Included',
    description:
      `Free to build and preview. Pay once for the design you publish. ${priceRangeSentence()} No plans, bundles or subscription.`,
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/pricing`,
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'ShareInvite pricing for digital invitations',
      },
    ],
  },
  alternates: { canonical: `${APP_URL}/pricing` },
  robots: { index: true, follow: true },
}

// ─── Structured Data ──────────────────────────────────────────────────────────

// Derived from lib/plans.ts rather than hand-maintained. The previous
// hard-coded list had already drifted: it omitted the ₹199 Raksha Bandhan
// template entirely, so the pricing page and the checkout disagreed.
const TEMPLATE_PRICES = TEMPLATES.map((tpl) => ({
  id: tpl.id,
  name: tpl.name,
  description: tpl.description,
  price: templatePrice(tpl.id),
  slug: templateSeoSlug(tpl.id),
}))

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ShareInvite Pricing',
  description: 'Digital invitation template pricing for Indian weddings, birthdays, and family events',
  url: `${APP_URL}/pricing`,
  mainEntity: {
    '@type': 'ItemList',
    name: 'ShareInvite Digital Invitation Templates',
    itemListElement: TEMPLATE_PRICES.map((tpl, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${tpl.name} Digital Invitation Template`,
        description: tpl.description,
        sku: tpl.id,
        // Was missing entirely — the cause of all 22 "Missing field image"
        // Merchant Listing warnings. These are the real preview images the
        // site renders for each template, not the ShareInvite logo.
        image: [templateImageUrl(tpl.id)],
        brand: { '@type': 'Brand', name: 'ShareInvite' },
        // Point at the template's own page, which is the canonical, indexable
        // URL for this product. /create?template= is a query-parameter view of
        // the builder and should not be advertised as the product URL.
        url: `${APP_URL}/templates/${tpl.slug}`,
        offers: digitalOffer(tpl.price, `${APP_URL}/templates/${tpl.slug}`),
      },
    })),
  },
}

const PRICING_FAQS = [
  {
    question: 'How much does a digital invitation cost?',
    answer: `Each design has its own one-time price, shown on the design: ${priceByDesignSentence()}. You can build and preview any design in full before deciding to pay.`,
  },
  {
    question: 'What does "one design, one price" mean?',
    answer: 'You pay for the single design you publish — nothing else. That one payment covers everything in that design: your invitation on its own link, every feature the design has, and sharing with as many guests as you like. There are no plans, bundles, add-ons or upgrades to choose between.',
  },
  {
    question: 'Is it a one-time payment or a subscription?',
    answer: 'A one-time payment. You pay once for your design — there are no monthly subscriptions, renewals or recurring charges.',
  },
  {
    question: 'Is anything free?',
    answer: 'Building and previewing is completely free: pick any design, fill in every detail, add photos, and see the finished invitation on your own phone without paying or entering card details. Payment is only requested at the final publish step, when you get your shareable link.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, in genuine cases. Refund requests can be raised within 7 days of the transaction at no cost to you — for example if you were charged twice or the design did not work as described. Approved refunds are returned to your original payment method via Razorpay. Full details are on our Refund & Cancellation Policy page.',
  },
  {
    question: 'Is the payment secure?',
    answer: 'Yes. All payments are processed through Razorpay, and ShareInvite never sees or stores your card details. You can pay via UPI, credit card, debit card, or net banking. Prices are charged in Indian rupees.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRICING_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

// "What's included" is split in two because features genuinely vary by design:
// the 3D greetings have no venue, schedule or guest wishes wall, and RSVP is on
// one design only. A published invitation also cannot currently be edited.
const BY_DESIGN = [
  'Live countdown',
  'Venue & Google Maps',
  'Event schedule',
  'Photo gallery',
  'Background music',
  'Guest wishes wall',
  'RSVP via WhatsApp',
  '3D animation & interactive reveals',
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  // Price list by occasion — every design once, under its primary occasion.
  const byOccasion = OCCASIONS.map((o) => ({
    occasion: o,
    designs: TEMPLATES.filter((t) => primaryOccasion(t.id)?.key === o.key),
  })).filter((g) => g.designs.length > 0)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Pricing' }]}
        eyebrow="Pricing"
        title={<>One design. One price.<br /><em className="font-medium text-burnished">Everything included.</em></>}
        lede={`Build and preview any design for free. When it's ready, pay once for that design — from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} to ₹${HIGHEST_PAID_PRICE.toLocaleString('en-IN')} — and it's yours. No plans, no bundles, no subscription.`}
        actions={
          <>
            <Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Start building — free
              <ArrowRightIcon />
            </Link>
            <Link href="/templates" className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the designs
            </Link>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta="Start building — free" location="pricing_hero_offer" />}
      />

      {/* ─── HOW PAYING WORKS ─── */}
      <Section aria-label="How paying works">
        <SectionHeading align="center" eyebrow="How it works" title="Pay only when you love it" />
        <ol className="mt-12 grid gap-4 md:grid-cols-3" data-reveal-group>
          {[
            { Icon: EyeIcon, title: 'Build & preview free', copy: 'Choose any design, add your real details and photos, and see the finished invitation. No card needed.' },
            { Icon: ShieldIcon, title: 'Pay once for your design', copy: 'The price is on the design. One secure payment by UPI, card or net banking — no renewal, ever.' },
            { Icon: LinkIcon, title: 'Your invitation, handed over', copy: 'Get your link and share it on WhatsApp, Instagram, email or text with as many guests as you like.' },
          ].map(({ Icon, title, copy }, i) => (
            <li key={title} className="card p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald text-paper">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-editorial text-[3rem] font-semibold leading-none text-burnished/25">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="t-h3 mt-6">{title}</h3>
              <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/75">{copy}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── PRICE BY DESIGN ─── */}
      <Section tone="paper" id="prices" aria-label="Price of each design">
        <SectionHeading
          eyebrow="Transparent prices"
          title="Every design, with its price"
          sub="What you see is what you pay — once. Tap a design to preview it live."
          action={{ href: '/templates', label: 'Browse with previews' }}
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2" data-reveal-group>
          {byOccasion.map(({ occasion, designs }) => (
            <div key={occasion.key} className="card-quiet p-5 sm:p-6">
              <p className="eyebrow">{occasion.label}</p>
              <ul className="mt-3 divide-y divide-line">
                {designs.map((t) => (
                  <li key={t.id}>
                    <Link href={`/templates/${templateSeoSlug(t.id)}`} className="group flex items-center gap-3.5 py-3">
                      <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-peach">
                        <Image src={templateImage(t.id)} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-editorial text-[1.2rem] font-semibold group-hover:text-emerald-soft">
                        {displayName(t.name)}
                      </span>
                      <span className="shrink-0 font-editorial text-[1.35rem] font-semibold">{formatTemplatePrice(t.id)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[0.85rem] text-muted">All prices in Indian rupees, one-time, per design.</p>
      </Section>

      <SignatureShowcase />

      {/* ─── WHAT'S INCLUDED ─── */}
      <Section aria-label="What's included">
        <SectionHeading
          align="center"
          eyebrow="What you get"
          title="What's included"
          sub="The price reflects the design — its artwork, animation and craft. Here is what comes with it."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2" data-reveal-group>
          <div className="card p-7 sm:p-9">
            <h3 className="t-h3">With every design</h3>
            <ul className="mt-6 space-y-3">
              {['A private link you can share anywhere', 'Every feature in the design — nothing locked', 'Opens on any phone — no app for guests', 'Rich preview card in WhatsApp chats', 'No ShareInvite banner or ads', 'Live through your event, and three days after', 'Secure one-time checkout'].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[0.98rem]">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-soft" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-peach/60 p-7 sm:p-9">
            <h3 className="t-h3">Depending on the design</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {BY_DESIGN.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[0.98rem]">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-burnished" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[0.9rem] leading-7 text-charcoal/70">
              Open any design&apos;s live preview to see exactly which of these it includes before you decide.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── PAYMENT & GLOBAL ─── */}
      <Section tone="peach" size="sm" aria-label="Payment">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {[
            { Icon: ShieldIcon, t: 'Secure by Razorpay', c: 'UPI, cards and net banking' },
            { Icon: CheckIcon, t: '7-day refund policy', c: 'For genuine problems', href: '/refund-policy' },
            { Icon: GlobeIcon, t: 'Guests anywhere', c: 'Charged in INR, opens worldwide' },
            { Icon: LinkIcon, t: 'Help when you need it', c: 'Chat with us on WhatsApp' },
          ].map(({ Icon, t, c, href }) => (
            <li key={t} className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-burnished/40 bg-paper text-burnished">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold">{href ? <Link href={href} className="hover:underline">{t}</Link> : t}</span>
                <span className="block text-[0.85rem] text-charcoal/70">{c}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── FAQ ─── */}
      <Section tone="paper" id="faq" aria-label="Pricing questions">
        <SectionHeading align="center" eyebrow="FAQ" title="Pricing questions" />
        <div className="mt-10">
          <FAQAccordion faqs={PRICING_FAQS} />
        </div>
      </Section>

      <CtaBand
        eyebrow="See before you buy"
        title={OFFER.headline}
        sub={`Free to build and preview. Pay once, from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}, when you publish.`}
        primary={{ href: '/create', label: 'Build your invitation free' }}
        secondary={{ href: '/demo/elegant-wedding', label: 'View a live example' }}
        location="pricing_closing"
      />

      <SiteFooter />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </main>
  )
}
