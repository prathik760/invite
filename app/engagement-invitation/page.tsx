import type { Metadata } from 'next'
import Link from 'next/link'
import { RingIcon, CalendarIcon, ClockIcon, CameraIcon, MusicIcon, MessageIcon, ClipboardIcon, ShareIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Digital Engagement Invitation Online Free | Mangni E-Invite India | ShareInvite',
  description:
    'Create a beautiful digital engagement invitation website for your Mangni or Roka ceremony in minutes. WhatsApp-ready link, live countdown, Google Maps, photo gallery & guest wishes. Free to start.',
  keywords: [
    'digital engagement invitation India',
    'online engagement invitation free',
    'mangni invitation digital',
    'roka ceremony invitation online',
    'engagement e-invite India',
    'digital engagement card India',
    'WhatsApp engagement invitation link',
    'engagement invitation website India',
    'mangni ceremony invitation website',
    'sagai invitation digital',
    'engagement invite online maker India',
    'ring ceremony invitation digital',
  ],
  alternates: { canonical: `${APP_URL}/engagement-invitation` },
  openGraph: {
    title: 'Free Digital Engagement Invitation | Mangni & Roka E-Invite India | ShareInvite',
    description: 'Create a stunning digital engagement invitation for your Mangni or Roka ceremony. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Engagement Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital engagement invitation for free in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the couple\'s names, engagement date, venue, and a personal message, then click Create. Your engagement invitation website is live in under 5 minutes — share the link directly on WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Mangni, Roka, and Sagai invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mangni, Roka, and Sagai are all regional names for the engagement ceremony in India. Roka is common in North India (Punjab, Delhi) and marks the formal alliance between families. Mangni typically refers to the ring ceremony. Sagai is widely used in Rajasthan and Gujarat. ShareInvite lets you label your ceremony any way you choose.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I include a ring ceremony schedule on the engagement invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ShareInvite supports a full ceremony schedule with multiple events — you can list the Roka/Sagai, ring exchange, family functions, and dinner in a clear timeline. Guests can see the full programme from a single WhatsApp link.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital engagement invitation better than a printed card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A digital engagement invitation is faster, cheaper, and more interactive. Guests get live countdown, one-tap Google Maps, a photo gallery, and a wishes section — all from one link shared on WhatsApp. No printing costs, no delays, and guests can share it instantly with their own contacts.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <RingIcon />, title: 'Couple Names & Families', desc: 'Display both families\' names in the traditional Indian format — with beautiful typography.' },
  { icon: <CalendarIcon />, title: 'Ceremony Date & Time', desc: 'Exact date, time, and venue with full address and one-tap Google Maps directions.' },
  { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A live ticking countdown builds excitement as the big day approaches.' },
  { icon: <CameraIcon />, title: 'Pre-Engagement Gallery', desc: 'Upload couple photos to make the invite personal and memorable.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set a romantic song to play softly as guests view the invitation.' },
  { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect blessings and congratulations from guests directly on the page.' },
  { icon: <ClipboardIcon />, title: 'Event Schedule', desc: 'List Roka, ring ceremony, family functions, and dinner in a clear timeline.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'One tap to send the invite to hundreds of guests across family groups.' },
]

const CEREMONIES = [
  { name: 'Mangni', region: 'North India', desc: 'The ring exchange ceremony marking the formal engagement' },
  { name: 'Roka', region: 'Punjab & Delhi', desc: 'Family alliance ceremony before the formal engagement' },
  { name: 'Sagai', region: 'Rajasthan & Gujarat', desc: 'Ring ceremony and formal engagement celebration' },
  { name: 'Nishchayam', region: 'South India', desc: 'Formal betrothal ceremony common in Tamil & Telugu families' },
  { name: 'Misri', region: 'Uttar Pradesh', desc: 'Sweet exchange ritual between the two families' },
  { name: 'Ring Ceremony', region: 'Pan-India', desc: 'Modern engagement celebration with ring exchange' },
]

export default function EngagementInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /></Link>
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
            Digital Engagement Invitation<br />
            <span className="gradient-accent italic">Mangni · Roka · Sagai</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital engagement invitation website for your Mangni, Roka, or Sagai ceremony.
            Share a WhatsApp link with the full schedule, Google Maps, photos, and a guest wishes section.
            Ready in 5 minutes. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Free Engagement Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Live in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Ceremony types */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            Works for every Indian engagement ceremony
          </h2>
          <p className="text-center text-sm text-muted mb-10 max-w-xl mx-auto">
            Different names, same celebration — create the perfect digital invite for your regional engagement tradition
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CEREMONIES.map(c => (
              <div key={c.name} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-heading text-lg text-ink">{c.name}</p>
                  <span className="shrink-0 rounded-full bg-[#7A3E4A]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-strong">
                    {c.region}
                  </span>
                </div>
                <p className="text-sm text-muted leading-6">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            Everything your engagement invitation needs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Create your engagement invite in 3 steps
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Enter ceremony details', desc: 'Add both families\' names, date, venue, schedule, and a personal message.' },
              { step: '02', title: 'Preview your invite', desc: 'See your invitation come to life instantly as you fill in each detail.' },
              { step: '03', title: 'Share on WhatsApp', desc: 'Copy your unique link and forward it to all family WhatsApp groups.' },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border border-border bg-background p-7 shadow-sm">
                <p className="font-heading text-5xl text-accent/60">{s.step}</p>
                <h3 className="mt-5 font-heading text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6">
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
            Ready to create your engagement invite?
          </h2>
          <p className="text-muted text-sm mb-7">
            Free to start. WhatsApp-ready in 5 minutes. Loved by Indian families.
          </p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Engagement Invite Free →
          </Link>
        </div>
      </section>

      {/* City links */}
      <section className="border-t border-border bg-white px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Engagement invitations by city</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['bengaluru','mumbai','delhi','hyderabad','chennai','pune','kolkata','ahmedabad'].map(city => (
              <Link
                key={city}
                href={`/engagement-invitation/${city}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground capitalize hover:border-[#D9A441]/50 transition-colors"
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
          <Link href="/griha-pravesh-invitation" className="hover:text-foreground transition-colors">Griha Pravesh</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
