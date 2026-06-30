import type { Metadata } from 'next'
import Link from 'next/link'
import PricingSection from '@/components/landing/PricingSection'
import FAQAccordion from '@/components/landing/FAQAccordion'
import { PLANS } from '@/lib/plans'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Pricing — Digital Invitation Plans | ShareInvite',
  description:
    'One-time pricing for digital invitation websites. Free plan available. Starter ₹299, Pro ₹599, All Access ₹999 — no monthly subscription, no hidden charges. Built for Indian weddings, birthdays, and family events.',
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
      'Create beautiful digital invitations for Indian weddings, birthdays, and family events. Free plan available. Paid plans from ₹299 one-time — no subscription.',
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/pricing`,
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'ShareInvite pricing plans for digital invitations',
      },
    ],
  },
  alternates: { canonical: `${APP_URL}/pricing` },
  robots: { index: true, follow: true },
}

// ─── Structured Data ──────────────────────────────────────────────────────────

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ShareInvite Pricing',
  description: 'Digital invitation pricing plans for Indian weddings, birthdays, and family events',
  url: `${APP_URL}/pricing`,
  mainEntity: {
    '@type': 'ItemList',
    name: 'ShareInvite Pricing Plans',
    itemListElement: PLANS.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `ShareInvite ${plan.name} Plan`,
        description: plan.description,
        offers: {
          '@type': 'Offer',
          price: String(plan.price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${APP_URL}/create`,
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
        text: 'ShareInvite offers a completely free plan forever with the Elegant Wedding template. Paid plans start at ₹299 one-time for Starter (4 templates + music), ₹599 for Pro (7 templates + gallery + countdown), and ₹999 for All Access (all 11 templates + custom URL + 1-year hosting). There are no monthly fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it a one-time payment or a monthly subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All paid plans are a one-time payment. You pay once for your event — there are no monthly subscriptions, no recurring charges, and no hidden fees. This makes ShareInvite significantly more affordable than subscription-based platforms.',
      },
    },
    {
      '@type': 'Question',
      name: 'What plan should I choose for a wedding invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a wedding, most couples choose the Starter plan (₹299) for its music player and no-branding features, or Pro (₹599) for the photo gallery, live countdown, and bride & groom portrait photos. All Access (₹999) is best if you want a custom URL like shareinvite.in/ananya-vihaan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I upgrade my plan after paying?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can start with a free or lower plan and upgrade anytime from your dashboard. You only pay the difference in price when upgrading.',
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

// ─── Feature Comparison Data ──────────────────────────────────────────────────

type CellValue = boolean | string

interface ComparisonRow {
  feature: string
  category?: string
  free: CellValue
  standard: CellValue
  premium: CellValue
  gold: CellValue
}

const COMPARISON: ComparisonRow[] = [
  // Core
  { feature: 'Digital invitation website', free: true, standard: true, premium: true, gold: true },
  { feature: 'WhatsApp shareable link', free: true, standard: true, premium: true, gold: true },
  { feature: 'Date, time & venue', free: true, standard: true, premium: true, gold: true },
  { feature: 'Google Maps integration', free: true, standard: true, premium: true, gold: true },
  { feature: 'Guest Wishes & Blessing Wall', free: true, standard: true, premium: true, gold: true },
  { feature: 'No app download for guests', free: true, standard: true, premium: true, gold: true },
  // Templates & Design
  { feature: 'Number of templates', free: '1', standard: '4', premium: '7', gold: 'All 11' },
  { feature: 'Ceremony schedule timeline', free: false, standard: true, premium: true, gold: true },
  { feature: 'Background music player', free: false, standard: true, premium: true, gold: true },
  { feature: 'No ShareInvite branding', free: false, standard: true, premium: true, gold: true },
  // Premium Features
  { feature: 'Photo gallery (up to 20 images)', free: false, standard: false, premium: true, gold: true },
  { feature: 'Live countdown timer', free: false, standard: false, premium: true, gold: true },
  { feature: 'Bride & groom portrait photos', free: false, standard: false, premium: true, gold: true },
  { feature: 'Priority support', free: false, standard: false, premium: true, gold: true },
  // Gold Exclusive
  { feature: 'Custom URL slug', free: false, standard: false, premium: false, gold: true },
  { feature: 'KGF & Anniversary templates', free: false, standard: false, premium: false, gold: true },
  { feature: '1-year page hosting', free: false, standard: false, premium: false, gold: true },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function CheckCell() {
  return (
    <svg className="mx-auto h-4.5 w-4.5" fill="none" stroke="#2F766D" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function CrossCell() {
  return (
    <svg className="mx-auto" fill="none" stroke="#D4C7B8" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) return <CheckCell />
  if (value === false) return <CrossCell />
  return (
    <span className="text-[11px] font-semibold text-ink">{value}</span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const planHeaders = [
    { id: 'free', label: 'Free', price: '₹0', sub: 'Free forever', highlighted: false },
    { id: 'standard', label: 'Starter', price: '₹299', sub: 'One-time', highlighted: true },
    { id: 'premium', label: 'Pro', price: '₹599', sub: 'One-time', highlighted: false },
    { id: 'gold', label: 'All Access', price: '₹999', sub: 'One-time', highlighted: false },
  ]

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
            One-time pricing for<br />
            <span className="gradient-accent italic">a one-time celebration.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted">
            No monthly subscription for an event that happens once.
            Pay only for what you need — or start completely free.
          </p>
          {/* Trust chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {[
              {
                icon: (
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                text: 'Razorpay secured',
              },
              {
                icon: (
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                ),
                text: 'UPI · Card · Net banking',
              },
              {
                icon: (
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                ),
                text: 'No subscription',
              },
              {
                icon: (
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                text: 'Free plan always available',
              },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm"
              >
                {icon}
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <PricingSection />

      {/* ─── FEATURE COMPARISON TABLE ─── */}
      <section className="px-5 py-20 sm:py-28" style={{ background: '#FCF7F1' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              Compare plans
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl">
              Everything included at a glance
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted w-[40%]">
                    Feature
                  </th>
                  {planHeaders.map((p) => (
                    <th
                      key={p.id}
                      className="px-4 py-4 text-center"
                      style={p.highlighted ? { background: 'rgba(184,121,36,0.06)' } : {}}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-[0.12em]"
                        style={{ color: p.highlighted ? '#B87924' : '#2C201C' }}
                      >
                        {p.label}
                      </p>
                      <p
                        className="mt-0.5 font-display text-xl font-normal"
                        style={{ color: p.highlighted ? '#B87924' : '#1F1A17' }}
                      >
                        {p.price}
                      </p>
                      <p className="text-[10px] text-muted">{p.sub}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="border-b border-border last:border-0"
                    style={{ background: i % 2 === 0 ? '#ffffff' : '#FDFAF6' }}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                      {row.feature}
                    </td>
                    {(['free', 'standard', 'premium', 'gold'] as const).map((planKey) => (
                      <td
                        key={planKey}
                        className="px-4 py-3.5 text-center"
                        style={planKey === 'standard' ? { background: 'rgba(184,121,36,0.04)' } : {}}
                      >
                        <Cell value={row[planKey]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="px-5 py-5" />
                  {planHeaders.map((p) => (
                    <td key={p.id} className="px-4 py-5 text-center" style={p.highlighted ? { background: 'rgba(184,121,36,0.06)' } : {}}>
                      <Link
                        href="/create"
                        className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
                          p.highlighted ? 'gold-button' : 'border border-border text-ink hover:border-[#D9A441]/60 bg-white'
                        }`}
                      >
                        {p.id === 'free' ? 'Start Free' : `Get ${p.label}`}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* ─── PAYMENT TRUST STRIP ─── */}
      <section className="border-y border-border bg-white px-5 py-10">
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
      <section className="px-5 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
            See before you buy
          </p>
          <h2 className="font-display font-normal text-2xl text-ink sm:text-3xl">
            Not sure which plan is right?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
            Start free with the Elegant Wedding template — no credit card needed.
            See the full invitation experience before upgrading.
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
      <section className="px-5 py-20 sm:py-28" style={{ background: '#FCF7F1' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              FAQ
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl">
              Pricing — Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">
              Everything you need to know about plans, payment, and upgrading.
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
              href="/#pricing"
              className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-8 py-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.12] sm:w-auto"
            >
              Compare on homepage
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
