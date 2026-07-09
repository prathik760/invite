import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, ClockIcon, CameraIcon, MusicIcon, ClipboardIcon, MessageIcon } from '@/components/ui/Icons'

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
    localVenues: ['The Leela Palace', 'ITC Windsor', 'Taj West End', 'Shangri-La Bengaluru', 'Sheraton Grand Bengaluru'],
    localDetail: 'Bengaluru birthday parties range from rooftop celebrations in Koramangala to grand banquet halls in Indiranagar and private farmhouses on the Mysore Road — a digital invite with Google Maps makes navigation seamless in the city\'s traffic.',
  },
  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localVenues: ['Taj Lands End', 'The St. Regis Mumbai', 'JW Marriott Juhu', 'Grand Hyatt Mumbai', 'Trident Nariman Point'],
    localDetail: 'Mumbai birthday celebrations happen across the city — sea-facing venues in Bandra, rooftop parties in Lower Parel, and family gatherings in the suburbs. A WhatsApp-ready invite link works perfectly for Mumbai\'s fast-paced, phone-first lifestyle.',
  },
  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localVenues: ['The Leela Palace New Delhi', 'ITC Maurya', 'Taj Palace', 'The Oberoi New Delhi', 'Hyatt Regency Delhi'],
    localDetail: 'Delhi birthday parties span farmhouse celebrations in Chattarpur, rooftop venues in CP, and luxury hotel banquets across South Delhi and Gurgaon. A digital invite that works across NCR makes coordination far simpler.',
  },
  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localVenues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Park Hyatt Hyderabad', 'The Westin Hyderabad', 'Marriott Hyderabad'],
    localDetail: 'Hyderabad birthday celebrations reflect the city\'s warmth — from palace venue celebrations in Banjara Hills to family gatherings in Jubilee Hills. A WhatsApp-shared digital invite reaches all guests instantly across the twin cities.',
  },
  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localVenues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Feathers Hotel', 'Radisson Blu Chennai'],
    localDetail: 'Chennai birthday parties are warm, family-centred events — from beachside venues in ECR to private halls in Anna Nagar and T Nagar. A digital invite with Google Maps helps guests navigate the city\'s busy neighbourhoods.',
  },
  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localVenues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'The Westin Pune'],
    localDetail: 'Pune birthday celebrations blend the city\'s cosmopolitan energy with Maharashtrian warmth — from terrace parties in Koregaon Park to family celebrations in Kothrud. A digital invite works perfectly for Pune\'s young, WhatsApp-native crowd.',
  },
  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localVenues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Vedic Village Spa Resort', 'Hyatt Regency Kolkata'],
    localDetail: 'Kolkata birthday parties carry the city\'s legendary warmth and cultural richness — from heritage venue celebrations in Park Street to family gatherings across the city\'s many cultural neighbourhoods.',
  },
  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localVenues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'Novotel Ahmedabad'],
    localDetail: 'Ahmedabad birthday celebrations reflect Gujarati warmth and hospitality — from family gatherings across the city to themed parties in Prahlad Nagar and SG Highway\'s modern venues.',
  },
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const info = CITIES[city]
  if (!info) return {}

  const ogTitle = `Digital Birthday Invitation in ${info.display} | ShareInvite`
  const description = `Create a digital birthday invitation for your ${info.display} party — WhatsApp link with countdown, Google Maps & photo gallery. Free to start.`

  return {
    title: { absolute: ogTitle },
    description,
    robots: { index: true, follow: true },
    keywords: [
      `digital birthday invitation ${info.display}`,
      `online birthday invitation ${info.display}`,
      `birthday e-invite ${info.display}`,
      `birthday invitation website ${info.display}`,
      `birthday party invite WhatsApp ${info.display}`,
      `digital birthday card ${info.display}`,
      `birthday invitation ${info.state}`,
      `online birthday card ${info.display} free`,
    ],
    alternates: { canonical: `${APP_URL}/birthday-invitation/${city}` },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: `Digital Birthday Invitation ${info.display}` }],
    },
  }
}

export default async function CityBirthdayPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const info = CITIES[city]
  if (!info) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I create a digital birthday invitation for a ${info.display} party?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Go to shareinvite.in/create, choose a birthday template, enter the celebrant's name, party date, ${info.display} venue address, and message. Your digital birthday invitation is live with a shareable WhatsApp link in under 5 minutes.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I add a ${info.display} venue map to my birthday invitation?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ShareInvite lets you add the full venue address with a clickable Google Maps link. Guests get one-tap directions to any venue in ${info.display} directly from the birthday invitation.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How do I share the birthday invitation with guests in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ShareInvite creates a short link like shareinvite.in/e/your-name that you forward directly on WhatsApp. Guests open it in their phone browser — no app download needed.',
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
            Digital Birthday Invitation<br />
            <span className="gradient-accent italic">in {info.display}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital birthday invitation for your {info.display} party in under 5 minutes. Share a WhatsApp link with your venue location, party schedule, photos, and a live countdown. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create {info.display} Birthday Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-border px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-8">Create your invite in 3 simple steps</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Pick a birthday template', desc: 'Choose a design that matches the party mood — festive, elegant, or Bollywood-inspired.' },
              { n: '2', title: 'Add your party details', desc: 'Enter the name, age, date, venue address, and a personal message. Upload a photo too.' },
              { n: '3', title: 'Share on WhatsApp', desc: 'Your invite goes live instantly. Copy the link and forward it to all your WhatsApp groups.' },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#D9A441] text-white font-bold text-lg shrink-0">{s.n}</div>
                <h3 className="font-heading text-base text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-6">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/create" className="gold-button inline-flex rounded-full px-8 py-3 text-sm font-semibold">
              Create Free Birthday Invite →
            </Link>
            <p className="mt-3 text-xs text-muted">No credit card required · Premium plans from ₹299</p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-border px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-normal text-2xl text-ink mb-4 sm:text-3xl">
            Built for {info.display} birthday parties
          </h2>
          <p className="text-muted text-base leading-8 max-w-2xl mx-auto">{info.localDetail}</p>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Popular {info.display} venues our customers use</p>
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
            Everything your {info.display} birthday invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <MapPinIcon />, title: `${info.display} Venue Map`, desc: `Add your ${info.display} venue address with a clickable Google Maps link so guests get one-tap directions.` },
              { icon: <ClockIcon />, title: 'Live Countdown', desc: 'A ticking countdown builds anticipation as the birthday approaches.' },
              { icon: <CameraIcon />, title: 'Photo Gallery', desc: 'Upload photos of the birthday person to make the invite personal and memorable.' },
              { icon: <MusicIcon />, title: 'Background Music', desc: 'Set a party track or favourite song to play as guests open the invitation.' },
              { icon: <ClipboardIcon />, title: 'Party Schedule', desc: 'List arrival time, cake cutting, dinner, and other party events in a clear timeline.' },
              { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect birthday greetings from family and friends right on the invitation page.' },
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
            {info.display} birthday invitation — FAQs
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
          <h2 className="font-display font-normal text-3xl text-ink mb-3">
            Ready to create your {info.display} birthday invitation?
          </h2>
          <p className="text-muted text-sm mb-1">Starts free · Premium plans from ₹299 · No credit card to begin</p>
          <p className="text-muted text-xs mb-7">Loved by families across India · Invites shared on WhatsApp daily</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Your Free Birthday Invite →
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
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday Invitations</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/engagement-invitation" className="hover:text-foreground transition-colors">Engagement</Link>
        </div>
      </footer>
    </main>
  )
}
