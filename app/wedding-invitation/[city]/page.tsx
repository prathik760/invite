import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, ClipboardIcon, ClockIcon, CameraIcon, MusicIcon, MessageIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

const CITIES: Record<string, {
  display: string
  state: string
  localVenues: string[]
  localDetail: string
  localDetail2: string
  traditions: string[]
  weddingStyle: string
}> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localVenues: ['Palace Grounds', 'ITC Windsor', 'Taj West End', 'Leela Palace', 'NIMHANS Convention Centre'],
    localDetail: 'Bengaluru weddings blend South Indian tradition with cosmopolitan style — from grand Kalyana Mantapams in Jayanagar to luxury hotel banquets in MG Road.',
    localDetail2: 'Whether your wedding follows Kannada, Tamil, or Telugu traditions, ShareInvite makes it simple to share your venue, ceremony schedule, and Muhurtham time with every guest. A WhatsApp-ready digital invitation is perfect for Bengaluru\'s tech-savvy families spread across the city and beyond.',
    traditions: ['Nalungu', 'Naandi ceremony', 'Kalyana Mantapam', 'Muhurtham'],
    weddingStyle: 'South Indian traditional or modern luxury',
  },
  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localVenues: ['Grand Hyatt Kalina', 'Taj Lands End', 'The Leela Mumbai', 'ITC Maratha', 'Turf Club'],
    localDetail: 'Mumbai weddings are grand affairs — from beachside ceremonies in Juhu to high-rise rooftop celebrations and traditional Gujarati and Marathi mandaps.',
    localDetail2: 'In a city where guests travel from Andheri to Navi Mumbai, a digital invitation with a live Google Maps link is not a luxury — it\'s essential. ShareInvite helps Mumbai families share venue details, parking information, and the full Vidhi schedule all in one WhatsApp link.',
    traditions: ['Haldi', 'Mehendi', 'Antarpat ceremony', 'Saptapadi'],
    weddingStyle: 'Gujarati, Marathi, or Punjabi grand celebration',
  },
  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localVenues: ['Taj Palace', 'ITC Maurya', 'The Oberoi', 'Leela Palace New Delhi', 'Radisson Blu Paschim Vihar'],
    localDetail: 'Delhi weddings are legendary for grandeur — from massive farmhouse celebrations in Chattarpur to heritage lawns and premium hotel banquets across the capital.',
    localDetail2: 'Delhi NCR weddings often span multiple venues across Gurgaon, Noida, and the capital — making a digital invitation with separate event pages for each ceremony invaluable. Guests in Dwarka needn\'t call to confirm the Sangeet venue when the full schedule is one WhatsApp tap away.',
    traditions: ['Roka', 'Sangeet', 'Baraat', 'Vidaai'],
    weddingStyle: 'North Indian grand multi-day celebration',
  },
  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localVenues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Novotel HICC', 'HICC Novotel', 'Park Hyatt Hyderabad'],
    localDetail: 'Hyderabad weddings reflect the city\'s royal Nizami heritage — stunning palace venues, traditional Telugu ceremonies, and lavish reception banquets.',
    localDetail2: 'From Nischitartham to the grand Pellikoduku ceremonies, Hyderabad weddings have rich rituals your guests deserve a premium digital invite for. ShareInvite lets you display the full Telugu wedding programme, Muhurtham time, and venue address — all shareable via WhatsApp in minutes.',
    traditions: ['Nischitartham', 'Pellikoduku', 'Mangalasnanam', 'Saptapadi'],
    weddingStyle: 'Telugu traditional or royal Nizami grandeur',
  },
  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localVenues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Feathers Hotel', 'Radisson Blu Chennai'],
    localDetail: 'Chennai weddings are rooted in Tamil tradition — vibrant Kolam decorations, Nalangu ceremonies, and beautiful Brahmana Kalyanam celebrations in the city\'s finest venues.',
    localDetail2: 'Tamil weddings follow precise Muhurtham timings and multi-day rituals — Nichayathartham, Nalangu, and the main Kalyanam. A digital invitation lets you share the exact schedule for each ceremony, making it easy for out-of-station relatives and NRI guests to plan their arrival in Chennai.',
    traditions: ['Nichayathartham', 'Nalangu', 'Brahmana Kalyanam', 'Seer Varisai'],
    weddingStyle: 'Tamil Brahmin or Mudaliar traditional ceremony',
  },
  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localVenues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'Le Méridien Pune'],
    localDetail: 'Pune weddings combine Marathi tradition with modern flair — from traditional Ganesh puja ceremonies to grand receptions in the city\'s premium hotel venues.',
    localDetail2: 'Pune\'s growing corporate population means many wedding guests travel from Mumbai, Nashik, and beyond. A ShareInvite digital invitation with your Koregaon Park or Baner venue address, parking details, and ceremony timings saves dozens of WhatsApp messages to guests.',
    traditions: ['Ganesh puja', 'Kelvan ceremony', 'Antarpat', 'Mangalashtaka'],
    weddingStyle: 'Marathi traditional with modern reception',
  },
  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localVenues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Vedic Village', 'Science City Ground'],
    localDetail: 'Kolkata weddings are rich in Bengali culture — vibrant Aashirbaad ceremonies, traditional Sindoor Khela, and grand reception celebrations at iconic venues.',
    localDetail2: 'Bengali weddings are celebrated across multiple days — Aiburobhaat, Gaye Holud, and the Biye — each deserving its own listing in your digital invitation. ShareInvite lets Kolkata families create a single WhatsApp-shareable link with all ceremony details, venue addresses, and a countdown to the Saat Paak.',
    traditions: ['Aiburobhaat', 'Gaye Holud', 'Saat Paak', 'Sindoor Khela'],
    weddingStyle: 'Bengali traditional multi-day celebration',
  },
  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localVenues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'The House of MG'],
    localDetail: 'Ahmedabad weddings celebrate vibrant Gujarati tradition — colourful Garba nights, Mameru ceremonies, and grand multi-day celebrations at the city\'s finest venues.',
    localDetail2: 'Gujarati weddings are joyful, community-driven affairs where every detail — from the Mandap location to the Garba night venue — needs to be communicated clearly. A ShareInvite digital invitation lets Ahmedabad families share everything in one link: Janampatri details, Haldi venue, Garba night address, and the main wedding Muhurtham.',
    traditions: ['Garba night', 'Mameru', 'Haldi', 'Saptapadi'],
    weddingStyle: 'Gujarati traditional with vibrant Garba celebration',
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
  const description = `Create a beautiful digital wedding invitation for your ${info.display} wedding in 5 minutes. WhatsApp-ready link, live countdown, Google Maps, gallery & guest wishes. Free to start.`

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
      `free digital invitation ${info.display}`,
      `online invitation maker ${info.display}`,
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
      {
        '@type': 'Question',
        name: `Can I include multiple ceremonies like Mehendi and Sangeet for my ${info.display} wedding?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ShareInvite lets you add separate dates, times, and venues for each ceremony — Mehendi, Haldi, Sangeet, Wedding, and Reception. Each event is displayed clearly so ${info.display} guests know exactly where and when to be.`,
        },
      },
    ],
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
    priceRange: '₹0 – ₹999',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: info.state,
      addressLocality: info.display,
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
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
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
            Create a beautiful digital wedding invitation for your {info.display} wedding in under 5 minutes.
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
              {info.traditions.map(t => (
                <span key={t} className="rounded-full border border-[#D9A441]/30 bg-[#FFF9F2] px-4 py-1.5 text-sm text-accent-strong font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
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
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto mx-auto" width="100" height="28" />
        </Link>
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
