import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, ClipboardIcon, ClockIcon, CameraIcon, MusicIcon, MessageIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'
import { GRIHA_PRAVESH_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(GRIHA_PRAVESH_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = GRIHA_PRAVESH_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Griha Pravesh Invitation in ${info.display} | ShareInvite`
  const description = `Digital Griha Pravesh invitation for ${info.display} — muhurat time, pooja schedule, Google Maps & WhatsApp-ready link. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    keywords: [
      `digital griha pravesh invitation ${info.display}`,
      `online housewarming invitation ${info.display}`,
      `griha pravesh e-invite ${info.display}`,
      `gruhapravesham invitation ${info.display}`,
      `${info.display} griha pravesh invitation WhatsApp`,
      `digital ghar pravesh card ${info.display}`,
      `housewarming invitation ${info.state}`,
      `online griha pravesh card ${info.display} free`,
      `free digital housewarming invitation ${info.display}`,
      `online invitation maker ${info.display}`,
    ],
    alternates: { canonical: `${APP_URL}/griha-pravesh-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Griha Pravesh Invitation ${info.display}` }],
    },
  }
}

export default async function CityGrihaPraveshPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = GRIHA_PRAVESH_CITIES[city as CitySlug]
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
    name: 'ShareInvite',
    url: 'https://shareinvite.in',
    areaServed: { '@type': 'City', name: info.display },
    description: `Digital Griha Pravesh invitation maker for families in ${info.display}`,
  }

  const features = [
    { icon: <ClockIcon />, title: 'Muhurat Time Display', desc: `Show the auspicious muhurat time prominently so every guest in ${info.display} arrives prepared and on schedule for the pooja.` },
    { icon: <ClipboardIcon />, title: 'Pooja Schedule', desc: 'List the complete ceremony programme — Ganesh Puja, Vastu Shanti, Griha Pravesh entry, and lunch — so guests know exactly when each ritual happens.' },
    { icon: <MapPinIcon />, title: 'New Address + Google Maps', desc: `Add the full new home address with a one-tap Google Maps link — essential for guests navigating new localities and apartment complexes in ${info.display}.` },
    { icon: <ClipboardIcon />, title: 'Parking & Entry Notes', desc: 'Include building entry instructions, gate numbers, and parking details that guests need for new construction areas and gated communities.' },
    { icon: <CameraIcon />, title: 'Photo Gallery', desc: 'Share photos of the new home or family to make the invitation personal and meaningful for guests who will be blessing your new beginning.' },
    { icon: <MessageIcon />, title: 'Guest Blessings', desc: 'Collect heartfelt blessings and best wishes from family and friends — including those who cannot attend in person — right on the invitation page.' },
    { icon: <MusicIcon />, title: 'Background Music', desc: 'Set an auspicious or devotional track to play as guests open the invite — a warm, welcoming touch for the occasion.' },
    { icon: <MapPinIcon />, title: 'WhatsApp Sharing', desc: 'Share a single WhatsApp link that works on any phone without an app download — perfect for reaching all family members at once.' },
  ]

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
            Digital Griha Pravesh Invitation<br />
            <span className="gradient-accent italic">in {info.display}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {info.localDetail}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create {info.display} Griha Pravesh Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Local context — unique per city */}
      <section className="bg-white border-y border-border px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink mb-4 sm:text-3xl">
            Built for {info.display} Griha Pravesh ceremonies
          </h2>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.localDetail}</p>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto mt-4">{info.localDetail2}</p>

          {/* Traditions */}
          <div className="mt-8 mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-3">
              Ceremonies and rituals we support
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {info.traditions.map((t: string) => (
                <span key={t} className="rounded-full border border-[#D9A441]/30 bg-[#FFF9F2] px-4 py-1.5 text-sm text-accent-strong font-medium">
                  {t}
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
            Everything your {info.display} Griha Pravesh invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 bg-white border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            {info.display} Griha Pravesh invitation — FAQs
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

      {/* Internal links */}
      <section className="px-5 py-10 bg-background border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-lg text-ink mb-5 text-center">Related guides</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/griha-pravesh-invitation" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Griha Pravesh Invitations →
            </Link>
            <Link href="/griha-pravesh-invitation-wording" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Griha Pravesh Wording Guide →
            </Link>
            <Link href={`/wedding-invitation/${city}`} className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Wedding Invitations in {info.display} →
            </Link>
            <Link href="/digital-invitation" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              All Event Types →
            </Link>
            <Link href="/create" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Create Invitation →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Create your {info.display} Griha Pravesh invitation
          </h2>
          <p className="text-muted text-sm mb-1">{info.ctaTagline}</p>
          <p className="text-muted text-xs mb-7">Free to start · WhatsApp-ready in 5 minutes</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create {info.display} Griha Pravesh Invite →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
