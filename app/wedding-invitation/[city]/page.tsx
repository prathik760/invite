import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, ClipboardIcon, ClockIcon, CameraIcon, MusicIcon, MessageIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'
import { WEDDING_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(WEDDING_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = WEDDING_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Wedding Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital wedding invitation for your ${info.display} wedding — WhatsApp link with countdown, Google Maps & gallery. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    keywords: [
      `digital wedding invitation ${info.display}`,
      `online wedding invitation ${info.display}`,
      `wedding e-invite ${info.display}`,
      `wedding invitation website ${info.display}`,
      `${info.display} wedding invitation WhatsApp`,
      `digital shaadi card ${info.display}`,
      `wedding invitation ${info.state}`,
      `online wedding card ${info.display} free`,
      `free digital invitation ${info.display}`,
      `online invitation maker ${info.display}`,
    ],
    alternates: { canonical: `${APP_URL}/wedding-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Wedding Invitation ${info.display}` }],
    },
  }
}

export default async function CityWeddingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = WEDDING_CITIES[city as CitySlug]
  if (!info) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: info.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `ShareInvite — Digital Wedding Invitation ${info.display}`,
    description: `Create digital wedding invitations for ${info.display} weddings. WhatsApp-ready link with venue map, countdown, gallery, and RSVP. Free to start.`,
    url: `${APP_URL}/wedding-invitation/${city}`,
    image: `${APP_URL}/opengraph-image`,
    areaServed: {
      '@type': 'City',
      name: info.display,
    },
    serviceType: 'Digital Wedding Invitation',
    priceRange: '₹0 – ₹1499',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: info.state,
      addressLocality: info.display,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [`${APP_URL}`],
    potentialAction: {
      '@type': 'OrderAction',
      target: `${APP_URL}/create`,
    },
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Free · WhatsApp ready · No app download
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Digital Wedding Invitation<br />
            <span className="gradient-accent italic">in {info.display}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {info.localDetail}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create {info.display} Wedding Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Local context — unique per city */}
      <section className="bg-white border-y border-border px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink mb-4 sm:text-3xl">
            Built for {info.display} weddings
          </h2>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.localDetail}</p>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto mt-4">{info.localDetail2}</p>

          {/* Wedding traditions */}
          <div className="mt-8 mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-3">
              {info.weddingStyle} — ceremonies we support
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {info.traditions.map((t: string) => (
                <span key={t} className="rounded-full border border-[#D9A441]/30 bg-[#FFF9F2] px-4 py-1.5 text-sm text-accent-strong font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Popular {info.display} venues our couples use</p>
            <div className="flex flex-wrap justify-center gap-3">
              {info.venues.map((venue: string) => (
                <span key={venue} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                  {venue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            Everything your {info.display} wedding invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <MapPinIcon />, title: `${info.display} Venue Map`, desc: `Add your ${info.display} venue address with a clickable Google Maps link so guests get one-tap directions — no more confused calls on wedding day.` },
              { icon: <ClipboardIcon />, title: 'Full Ceremony Schedule', desc: `List all your ${info.display} wedding ceremonies — Mehendi, Haldi, Sangeet, Wedding, Reception — with separate dates, times, and venues.` },
              { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A ticking countdown to the Muhurtham builds excitement and keeps guests looking forward to the big day.' },
              { icon: <CameraIcon />, title: 'Pre-Wedding Gallery', desc: 'Upload pre-wedding shoot photos for a personal, emotional touch guests will love opening.' },
              { icon: <MusicIcon />, title: 'Background Music', desc: 'Set your favourite wedding song to play as guests open the invite — a premium touch at no extra cost.' },
              { icon: <MessageIcon />, title: 'Guest Wishes & RSVP', desc: 'Collect heartfelt blessings and RSVPs from family and friends right on the invitation page.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing nudge */}
      <section className="border-t border-border bg-[#FFFBF5] px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-6">Simple, transparent pricing</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Basic', price: '₹0', badge: 'Free', desc: 'Elegant Wedding template, Google Maps, WhatsApp link' },
              { name: 'Standard', price: '₹499', badge: 'Most popular', desc: '4 templates, background music, event schedule' },
              { name: 'Premium', price: '₹999', badge: 'Best value', desc: '7 templates — Indian Wedding, Engagement & more' },
              { name: 'Gold', price: '₹1,499', badge: 'Luxury', desc: 'All 11 templates, KGF Royal Empire + Anniversary' },
            ].map(p => (
              <div key={p.name} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-heading text-base text-ink">{p.name}</p>
                  <span className="shrink-0 rounded-full bg-[#D9A441]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-strong">{p.badge}</span>
                </div>
                <p className="font-display text-2xl text-ink mb-2">{p.price}</p>
                <p className="text-xs text-muted leading-5">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">One-time payment · No subscription · Invitation stays live for 1 year</p>
          <div className="mt-6 text-center">
            <Link href="/create" className="gold-button inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
              Start Free — No Credit Card →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 bg-white border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            {info.display} wedding invitation — FAQs
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-heading text-base text-ink mb-2">{faq.name}</h3>
                <p className="text-sm text-muted leading-7">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 bg-background border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-lg text-ink mb-5 text-center">More invitation guides</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/wedding-invitation" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Wedding Invitations →
            </Link>
            <Link href={`/engagement-invitation/${city}`} className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Engagement Invitations in {info.display} →
            </Link>
            <Link href={`/griha-pravesh-invitation/${city}`} className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Griha Pravesh Invitations in {info.display} →
            </Link>
            <Link href="/templates" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              All Templates →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Create your {info.display} wedding invitation
          </h2>
          <p className="text-muted text-sm mb-1">{info.ctaTagline}</p>
          <p className="text-muted text-xs mb-7">Free to start · WhatsApp-ready in 5 minutes</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create {info.display} Wedding Invite →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
