import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

const CITIES: Record<string, {
  display: string
  state: string
  localVenues: string[]
  localDetail: string
}> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localVenues: ['Palace Grounds', 'ITC Windsor', 'Taj West End', 'Leela Palace', 'NIMHANS Convention Centre'],
    localDetail: 'Bengaluru weddings blend South Indian tradition with cosmopolitan style — from grand Kalyana Mantapams in Jayanagar to luxury hotel banquets in MG Road.',
  },
  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localVenues: ['Grand Hyatt Kalina', 'Taj Lands End', 'The Leela Mumbai', 'ITC Maratha', 'Turf Club'],
    localDetail: 'Mumbai weddings are grand affairs — from beachside ceremonies in Juhu to high-rise rooftop celebrations and traditional Gujarati and Marathi mandaps.',
  },
  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localVenues: ['Taj Palace', 'ITC Maurya', 'The Oberoi', 'Leela Palace New Delhi', 'Radisson Blu Paschim Vihar'],
    localDetail: 'Delhi weddings are legendary for grandeur — from massive farmhouse celebrations in Chattarpur to heritage lawns and premium hotel banquets across the capital.',
  },
  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localVenues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Novotel HICC', 'HICC Novotel', 'Park Hyatt Hyderabad'],
    localDetail: 'Hyderabad weddings reflect the city\'s royal Nizami heritage — stunning palace venues, traditional Telugu ceremonies, and lavish reception banquets.',
  },
  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localVenues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Feathers Hotel', 'Radisson Blu Chennai'],
    localDetail: 'Chennai weddings are rooted in Tamil tradition — vibrant Kolam decorations, Nalangu ceremonies, and beautiful Brahmana Kalyanam celebrations in the city\'s finest venues.',
  },
  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localVenues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'Le Méridien Pune'],
    localDetail: 'Pune weddings combine Marathi tradition with modern flair — from traditional Ganesh puja ceremonies to grand receptions in the city\'s premium hotel venues.',
  },
  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localVenues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Vedic Village', 'Science City Ground'],
    localDetail: 'Kolkata weddings are rich in Bengali culture — vibrant Aashirbaad ceremonies, traditional Sindoor Khela, and grand reception celebrations at iconic venues.',
  },
  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localVenues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'The House of MG'],
    localDetail: 'Ahmedabad weddings celebrate vibrant Gujarati tradition — colourful Garba nights, Mameru ceremonies, and grand multi-day celebrations at the city\'s finest venues.',
  },
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = CITIES[city]
  if (!info) return {}

  const title = `Digital Wedding Invitation in ${info.display} | Free Online Wedding E-Invite | ShareInvite`
  const description = `Create a beautiful digital wedding invitation website for your ${info.display} wedding in 5 minutes. WhatsApp-ready link, live countdown, Google Maps, gallery & guest wishes. Free to start.`

  return {
    title,
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
    ],
    alternates: { canonical: `${APP_URL}/wedding-invitation/${city}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Wedding Invitation ${info.display}` }],
    },
  }
}

export default async function CityWeddingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = CITIES[city]
  if (!info) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I create a digital wedding invitation for a ${info.display} wedding?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Go to shareinvite.in/create, choose a wedding template, enter your names, wedding date, ${info.display} venue address, and message. Your digital invitation is live with a shareable WhatsApp link in under 5 minutes.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I add a ${info.display} venue location to my digital invitation?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ShareInvite lets you add the full venue address with an embedded Google Maps link. Guests get one-tap directions to any venue in ${info.display} — from banquet halls to hotel lawns — directly from the invitation.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How do I share the wedding invitation with guests in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ShareInvite creates a short link like shareinvite.in/e/your-names that you can share directly on WhatsApp, Instagram, or email. Guests open it in their phone browser — no app download needed.',
        },
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" /></Link>
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
            Create a beautiful digital wedding invitation website for your {info.display} wedding in under 5 minutes.
            Share a WhatsApp link with your venue location, ceremony schedule, photos, and a live countdown.
            Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create {info.display} Wedding Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Local context */}
      <section className="bg-white border-y border-border px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink mb-4 sm:text-3xl">
            Built for {info.display} weddings
          </h2>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.localDetail}</p>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Popular {info.display} venues our couples use</p>
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

      {/* Features */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            Everything your {info.display} wedding invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '📍', title: `${info.display} Venue Map`, desc: `Add your ${info.display} venue address with a clickable Google Maps link so guests get one-tap directions.` },
              { icon: '📋', title: 'Ceremony Schedule', desc: 'Baraat, Varmala, Pheras, Reception — display the full programme in a clear timeline.' },
              { icon: '⏱', title: 'Live Countdown', desc: 'A ticking countdown builds excitement for your big day.' },
              { icon: '📸', title: 'Photo Gallery', desc: 'Upload pre-wedding photos for a personal, emotional touch guests will love.' },
              { icon: '🎵', title: 'Background Music', desc: 'Set your favourite wedding song to play as guests open the invite.' },
              { icon: '💬', title: 'Guest Wishes', desc: 'Collect heartfelt blessings from family and friends right on the invitation page.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
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

      {/* CTA */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Create your {info.display} wedding invitation
          </h2>
          <p className="text-muted text-sm mb-7">Free to start. WhatsApp-ready in 5 minutes.</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create {info.display} Wedding Invite →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto mx-auto" /></Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding Invitations</Link>
          <Link href="/engagement-invitation" className="hover:text-foreground transition-colors">Engagement</Link>
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
        </div>
      </footer>
    </main>
  )
}
