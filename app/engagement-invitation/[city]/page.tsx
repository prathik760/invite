import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RingIcon, MapPinIcon, ClipboardIcon, ClockIcon, MessageIcon, ShareIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'
import { ENGAGEMENT_CITIES, type CitySlug } from '@/lib/cityContent'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export async function generateStaticParams() {
  return Object.keys(ENGAGEMENT_CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = ENGAGEMENT_CITIES[city as CitySlug]
  if (!info) return {}

  const ogTitle = `Digital Engagement Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital engagement invitation for your ${info.display} ${info.localCeremonyName} — WhatsApp link, Google Maps & ceremony schedule. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    robots: { index: true, follow: true },
    keywords: [
      `digital engagement invitation ${info.display}`,
      `online engagement invitation ${info.display}`,
      `engagement e-invite ${info.display}`,
      `sagai invitation ${info.display}`,
      `ring ceremony invitation ${info.display}`,
      `engagement ceremony invite ${info.state}`,
      `roka invitation ${info.display}`,
      `digital engagement card ${info.display} free`,
    ],
    alternates: { canonical: `${APP_URL}/engagement-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Engagement Invitation ${info.display}` }],
    },
  }
}

export default async function CityEngagementPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = ENGAGEMENT_CITIES[city as CitySlug]
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Free · WhatsApp ready · No app download
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Digital Engagement Invitation<br />
            <span className="gradient-accent italic">in {info.display}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {info.heroIntro}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create {info.display} Engagement Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-border px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink mb-4 sm:text-3xl">
            Built for {info.display} engagement ceremonies
          </h2>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.builtForPara}</p>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Popular {info.display} engagement venues</p>
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

      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            Everything your {info.display} engagement invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <RingIcon />, title: 'Couple Names & Photos', desc: 'Showcase the couple beautifully with names, photos, and a heartfelt introduction.' },
              { icon: <MapPinIcon />, title: `${info.display} Venue Map`, desc: `Add the ${info.display} venue address with a Google Maps link — guests get one-tap directions.` },
              { icon: <ClipboardIcon />, title: 'Ceremony Schedule', desc: 'List the ring exchange, family blessings, dinner, and entertainment times in a clear programme.' },
              { icon: <ClockIcon />, title: 'Live Countdown', desc: 'A countdown to the ceremony builds excitement for the couple and all guests.' },
              { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Let family and friends leave congratulations and blessings on the invitation itself.' },
              { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'Forward the invite link to all family groups in one tap — no app download for guests.' },
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

      <section className="px-5 py-16 bg-white border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            {info.display} engagement invitation — FAQs
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
            <Link href="/engagement-invitation" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Engagement Invitations →
            </Link>
            <Link href={`/wedding-invitation/${city}`} className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Wedding Invitations in {info.display} →
            </Link>
            <Link href={`/birthday-invitation/${city}`} className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              Birthday Invitations in {info.display} →
            </Link>
            <Link href="/templates" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:text-accent-strong transition-colors">
              All Templates →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Create your {info.display} engagement invitation
          </h2>
          <p className="text-muted text-sm mb-1">{info.ctaTagline}</p>
          <p className="text-muted text-xs mb-7">Free to start · WhatsApp-ready in 5 minutes</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create {info.display} Engagement Invite →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
