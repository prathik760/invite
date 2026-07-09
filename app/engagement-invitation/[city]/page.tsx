import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RingIcon, MapPinIcon, ClipboardIcon, ClockIcon, MessageIcon, ShareIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

const CITIES: Record<string, {
  display: string
  state: string
  localVenues: string[]
  localDetail: string
  localCeremonyName: string
}> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localVenues: ['The Leela Palace', 'Taj West End', 'Shangri-La Bengaluru', 'ITC Windsor', 'JW Marriott Bengaluru'],
    localDetail: 'Bengaluru engagement ceremonies blend South Indian traditions with the city\'s cosmopolitan culture — from intimate Nishchayathartham ceremonies in traditional homes to upscale Roka events at Koramangala venues. A digital invite with Google Maps navigates guests through Bengaluru\'s traffic.',
    localCeremonyName: 'Nishchayathartham / Mangni',
  },
  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localVenues: ['Taj Lands End', 'The St. Regis Mumbai', 'JW Marriott Juhu', 'Trident Nariman Point', 'Four Seasons Mumbai'],
    localDetail: 'Mumbai engagements happen across the city\'s diverse neighbourhoods — from South Mumbai heritage venues to modern banquet halls in Bandra and Powai. A WhatsApp-ready digital invite is the perfect fit for Mumbai\'s fast-paced, mobile-first lifestyle.',
    localCeremonyName: 'Mangni / Sagai',
  },
  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localVenues: ['The Leela Palace New Delhi', 'Taj Palace', 'ITC Maurya', 'The Oberoi New Delhi', 'Hyatt Regency Delhi'],
    localDetail: 'Delhi engagement ceremonies are grand affairs — from Roka rituals at family homes in Defence Colony to lavish Sagai events at five-star hotels across South Delhi and Gurgaon. A digital invite coordinates NCR-wide guest lists effortlessly.',
    localCeremonyName: 'Roka / Sagai / Mangni',
  },
  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localVenues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Park Hyatt Hyderabad', 'The Westin Hyderabad', 'Novotel Hyderabad Convention Centre'],
    localDetail: 'Hyderabad engagement ceremonies carry the city\'s warmth and grandeur — from intimate Nischitartham ceremonies in traditional homes to lavish Misri events at Banjara Hills venues. WhatsApp sharing reaches guests across both the old and new cities instantly.',
    localCeremonyName: 'Nischitartham / Nishchayam',
  },
  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localVenues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Hyatt Regency Chennai', 'Radisson Blu Chennai'],
    localDetail: 'Chennai Nichayathartham ceremonies are significant family events — held at home or at banquet halls across Mylapore, T Nagar, and Anna Nagar with detailed rituals and large family gatherings. A digital invite helps coordinate the large guest lists typical of Chennai family events.',
    localCeremonyName: 'Nichayathartham',
  },
  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localVenues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'The Westin Pune Koregaon Park'],
    localDetail: 'Pune engagements blend Maharashtrian tradition with cosmopolitan flair — intimate Ring Ceremony events in Koregaon Park, family Sagai celebrations in Kothrud and Pimple Saudagar. A WhatsApp digital invite works perfectly for Pune\'s young, connected families.',
    localCeremonyName: 'Ring Ceremony / Sagai',
  },
  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localVenues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Swissotel Kolkata', 'Hyatt Regency Kolkata'],
    localDetail: 'Kolkata engagement ceremonies carry the city\'s warmth and cultural richness — from traditional Adda-style family celebrations to grand banquet events across South Kolkata\'s famous party venues. Bengali families spread across the city and suburbs are connected in one WhatsApp forward.',
    localCeremonyName: 'Ashirbad / Ring Ceremony',
  },
  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localVenues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'Novotel Ahmedabad'],
    localDetail: 'Ahmedabad Gujarati engagement ceremonies are lively, colourful affairs — Gol Dhana celebrations with family and community spread across the city\'s growing suburbs. A digital invite keeps all guests — from Satellite to Prahladnagar — coordinated.',
    localCeremonyName: 'Gol Dhana / Sagai',
  },
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = CITIES[city]
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
  const info = CITIES[city]
  if (!info) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I create a digital engagement invitation for a ${info.display} ceremony?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Go to shareinvite.in/create, choose an engagement template, enter the couple's names, ceremony date, ${info.display} venue address, and programme. Your engagement invitation is live with a WhatsApp-ready link in under 5 minutes.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I add a ${info.display} venue map to my engagement invitation?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ShareInvite lets you add the venue address with a clickable Google Maps link. Guests get one-tap directions to any engagement venue in ${info.display} directly from the invitation.`,
        },
      },
      {
        '@type': 'Question',
        name: `What ceremony name is used for ${info.display} engagement invitations?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In ${info.display} and ${info.state}, the engagement ceremony is commonly referred to as ${info.localCeremonyName}. ShareInvite lets you use whichever regional name matches your family tradition.`,
        },
      },
    ],
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
            Create a beautiful digital engagement invitation for your {info.display} {info.localCeremonyName} in under 5 minutes. Share ceremony details, venue map, ring exchange schedule, and couple photos — all from one WhatsApp link.
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
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.localDetail}</p>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Popular {info.display} engagement venues</p>
            <div className="flex flex-wrap justify-center gap-3">
              {info.localVenues.map(venue => (
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

      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Create your {info.display} engagement invitation
          </h2>
          <p className="text-muted text-sm mb-7">Free to start. WhatsApp-ready in 5 minutes.</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create {info.display} Engagement Invite →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/engagement-invitation" className="hover:text-foreground transition-colors">Engagement Invitations</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
        </div>
      </footer>
    </main>
  )
}
