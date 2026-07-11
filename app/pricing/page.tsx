import type { Metadata } from 'next'
import Link from 'next/link'
import PricingSection from '@/components/landing/PricingSection'
import FAQAccordion from '@/components/landing/FAQAccordion'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { absolute: 'Pricing — Digital Invitation Templates | ShareInvite' },
  description:
    'Simple one-time pricing for digital invitation templates. Free Elegant Wedding template. Paid templates from ₹299 — no subscription, no hidden charges. Built for Indian weddings, birthdays, and family events.',
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
    title: 'ShareInvite Pricing — One-Time Payment for Digital Invitations',
    description:
      'Create beautiful digital invitations for Indian weddings, birthdays, and family events. Free template available. Paid templates from ₹299 one-time — no subscription.',
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

const TEMPLATE_PRICES = [
  { id: 'elegant-wedding', name: 'Elegant Wedding', price: 0 },
  { id: 'cinematic-night', name: 'Cinematic Night', price: 299 },
  { id: 'indian-birthday', name: 'Janamdin', price: 299 },
  { id: 'namakaran', name: 'Namakaran', price: 299 },
  { id: 'indian-wedding', name: 'Shaadi', price: 599 },
  { id: 'indian-engagement', name: 'Mangni', price: 599 },
  { id: 'griha-pravesh', name: 'Griha Pravesh', price: 599 },
  { id: 'anniversary', name: 'Saalgirah', price: 999 },
  { id: 'kgf-wedding', name: 'KGF Royal Empire', price: 999 },
  { id: 'royal-deco', name: 'Royal Deco', price: 999 },
  { id: 'luxury-wedding', name: 'Luxury Wedding', price: 999 },
]

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
        offers: {
          '@type': 'Offer',
          price: String(tpl.price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${APP_URL}/create?template=${tpl.id}`,
          priceValidUntil: '2027-12-31',
        },
      },
    })),
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a digital wedding invitation cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ShareInvite offers a completely free Elegant Wedding template — no credit card needed. Paid templates are a one-time payment: ₹299 for Cinematic Night, Janamdin, and Namakaran; ₹599 for Shaadi, Mangni, and Griha Pravesh; ₹999 for Saalgirah, KGF Royal Empire, Royal Deco, and Luxury Wedding. There are no monthly fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it a one-time payment or a monthly subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All paid templates are a one-time payment. You pay once for your template — there are no monthly subscriptions, no recurring charges, and no hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do different templates have different prices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The price reflects the uniqueness, craftsmanship, animations, and visual design of each template. Every template includes the same premium features — music, gallery, countdown, maps, RSVP. You simply choose the design that best matches your celebration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I upgrade my template after paying?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can start free and upgrade to any paid template anytime from your dashboard by paying the one-time price for that template.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the payment secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All payments are processed through Razorpay — India\'s most trusted payment gateway. ShareInvite never stores your card details. You can pay via UPI, credit card, debit card, or net banking.',
      },
    },
  ],
}

// ─── Everything Included features ────────────────────────────────────────────

const ALL_FEATURES = [
  'Digital invitation website',
  'WhatsApp share link',
  'Google Maps integration',
  'Background music player',
  'Live countdown timer',
  'Photo gallery (up to 20 images)',
  'Guest wishes & blessings wall',
  'Event schedule timeline',
  'Mobile responsive design',
  'Edit anytime',
  '1-year page hosting',
  'Secure & fast loading',
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ─── BREADCRUMB NAV ─── */}
      <div className="border-b border-border bg-white px-5 py-3">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-ink">Pricing</span>
          </nav>
        </div>
      </div>

      {/* ─── PAGE HEADER ─── */}
      <section className="px-5 pt-16 pb-6 text-center" style={{ background: '#FCF7F1' }}>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
            Transparent pricing
          </p>
          <h1 className="font-display font-normal text-4xl text-ink sm:text-5xl lg:text-6xl">
            Simple one-time pricing.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted">
            Choose the invitation template you love and pay only for that design. Every template includes all premium features — no subscriptions, no hidden charges.
          </p>
          {/* Trust chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { text: 'One-time payment' },
              { text: 'No monthly subscription' },
              { text: '1-year hosting included' },
              { text: 'Edit anytime' },
              { text: 'Razorpay secured' },
            ].map(({ text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm"
              >
                <svg className="h-3 w-3 shrink-0 text-accent-strong" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE PRICING CARDS ─── */}
      <PricingSection />

      {/* ─── EVERYTHING INCLUDED ─── */}
      <section className="px-5 py-20 sm:py-28" style={{ background: '#FCF7F1' }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              No feature gating
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl">
              Everything Included With Every Template
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">
              Whether you choose the free template or a paid one, you get the same premium features. The price reflects the design, not the features.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ALL_FEATURES.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2.5 rounded-2xl border border-border bg-white px-4 py-3.5 shadow-sm"
              >
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY DIFFERENT PRICES ─── */}
      <section className="border-y border-border bg-white px-5 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink sm:text-3xl mb-5">
            Why do templates have different prices?
          </h2>
          <p className="text-base leading-8 text-muted">
            The price reflects the uniqueness, craftsmanship, animations, and visual design of each template. Every template includes the same premium features — you simply choose the design that best matches your celebration.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="gold-button inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold">
              Browse all templates
            </Link>
            <Link href="/templates" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-8 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:border-[#D9A441]/60">
              See template gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PAYMENT TRUST STRIP ─── */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Secure payment',
                desc: 'Razorpay — UPI, cards & net banking',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                  </svg>
                ),
                title: 'No app needed',
                desc: 'Guests open the link in any browser',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                ),
                title: 'Edit any time',
                desc: 'Update details before or after sharing',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
                title: 'One-time payment',
                desc: 'No subscription, no monthly charges',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-accent-strong"
                  style={{ background: 'rgba(217,164,65,0.12)' }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO CTA ─── */}
      <section className="px-5 py-14 text-center" style={{ background: '#FCF7F1' }}>
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
            See before you buy
          </p>
          <h2 className="font-display font-normal text-2xl text-ink sm:text-3xl">
            Not sure which template to pick?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
            Start free with the Elegant Wedding template — no credit card needed. See the full invitation experience before choosing a paid design.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="gold-button inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
            >
              Create your invitation — free
            </Link>
            <Link
              href="/demo/elegant-wedding"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-8 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:border-[#D9A441]/60"
            >
              View a live example
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-5 py-20 sm:py-28" style={{ background: '#fff' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              FAQ
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl">
              Pricing — Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">
              Everything you need to know about templates, pricing, and payment.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-5 py-20">
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-card-md sm:px-16"
          style={{ background: 'linear-gradient(135deg, #221B17 0%, #3D2A1A 50%, #221B17 100%)' }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9A441]/20" />
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9A441]/15" />
          </div>
          <p className="relative mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Ready to start?
          </p>
          <h2 className="relative mx-auto max-w-xl font-display font-normal text-3xl sm:text-4xl">
            Your invitation is 5 minutes away.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-sm leading-7 text-white/60">
            Free to create. One-time payment to unlock premium templates.
            No monthly fees. No hidden charges.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="gold-button w-full rounded-xl px-8 py-4 text-sm font-semibold sm:w-auto">
              Create Free Invitation
            </Link>
            <Link
              href="/templates"
              className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-8 py-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.12] sm:w-auto"
            >
              Browse templates
            </Link>
          </div>
          <p className="relative mt-4 text-xs text-white/40">
            Start free — no credit card required
          </p>
        </div>
      </section>
    </main>
  )
}
