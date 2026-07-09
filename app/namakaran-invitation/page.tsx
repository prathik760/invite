import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PersonIcon, ClockIcon, MapPinIcon, CameraIcon, ClipboardIcon, MessageIcon, MusicIcon, ShareIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Namakaran Invitation India | ShareInvite' },
  description:
    'Free Namakaran invitation for India — WhatsApp link with ceremony schedule, Google Maps & blessings section. Share baby photos. Ready in 5 minutes.',
  keywords: [
    'digital namakaran invitation',
    'naming ceremony invitation online free',
    'namakaran e-invite India',
    'baby naming ceremony invitation digital',
    'naamkaran invitation WhatsApp',
    'cradle ceremony invitation online',
    'annaprashan invitation digital',
    'naming ceremony card online India',
    'namkaran invitation website free',
    'baby shower naming invitation',
    'rice ceremony invitation digital India',
    'namakarana invitation free',
  ],
  alternates: { canonical: `${APP_URL}/namakaran-invitation` },
  openGraph: {
    title: 'Free Digital Namakaran Invitation | Naming Ceremony E-Invite India | ShareInvite',
    description: 'Create a beautiful digital Namakaran invitation for your baby\'s naming ceremony. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Namakaran Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital Namakaran invitation for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the baby\'s name, parents\' names, ceremony date, venue, and a personal message. Your Namakaran invitation is live in under 5 minutes — share the link directly on WhatsApp with all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a Namakaran invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Namakaran invitation should include: parents\' names, baby\'s name being revealed (or kept as a surprise), ceremony date and auspicious muhurat time, venue with Google Maps link, schedule of events, and a warm family blessing message. The baby\'s photo gallery adds a personal, emotional touch.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Namakaran, Naamkaran, and Cradle ceremony?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Namakaran (or Namakarana) is the Sanskrit term for the baby naming ceremony. Naamkaran is the common Hindi spelling. Cradle ceremony is the English term used widely in South India. All refer to the same event — the formal naming of the newborn. ShareInvite lets you use whichever term suits your tradition.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the Namakaran ceremony typically held?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Namakaran ceremony is traditionally held on the 11th or 12th day after birth, or on an auspicious muhurat chosen by the family. Some families hold it on the 28th day. The exact timing varies by region and community. Send digital invitations at least 7–10 days before the ceremony date.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <PersonIcon />, title: 'Baby & Parents Names', desc: 'Display the baby\'s name reveal and parents\' names in beautiful display typography.' },
  { icon: <ClockIcon />, title: 'Muhurat Time', desc: 'Show the auspicious naming ceremony time prominently — the most important detail for family.' },
  { icon: <MapPinIcon />, title: 'Venue + Google Maps', desc: 'Full venue address with one-tap Google Maps so family navigates to the right place.' },
  { icon: <CameraIcon />, title: 'Baby Photo Gallery', desc: 'Share the baby\'s first photos to make the invitation warm and personal for everyone.' },
  { icon: <ClipboardIcon />, title: 'Ceremony Schedule', desc: 'List the full programme — pooja, name reveal, blessings, lunch — in a clear timeline.' },
  { icon: <MessageIcon />, title: 'Family Blessings', desc: 'Collect blessings and wishes from relatives attending and those joining remotely.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set a gentle, celebratory track to play as guests open the invitation.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'Send the invite to all family groups with one tap — no app download for guests.' },
]

const CEREMONY_NAMES = [
  { name: 'Namakaran', region: 'Pan-India (Sanskrit)', desc: 'The traditional Sanskrit term used across all Hindu communities' },
  { name: 'Naamkaran', region: 'North India', desc: 'Common Hindi spelling used widely in UP, Bihar, Delhi, Rajasthan' },
  { name: 'Cradle Ceremony', region: 'South India', desc: 'English term widely used in Tamil Nadu, Karnataka, and Andhra families' },
  { name: 'Namakarana', region: 'Karnataka / Telugu', desc: 'Kannada and Telugu variant of the naming ceremony' },
  { name: 'Thodayal / Nichayathartham', region: 'Tamil Nadu', desc: 'Tamil naming ceremony with specific regional rituals and timing' },
  { name: 'Annaprashan', region: 'Bengal / East India', desc: 'Bengali rice ceremony often combined with the naming ritual' },
]

export default function NamakaranInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=namakaran" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
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
            Digital Namakaran Invitation<br />
            <span className="gradient-accent italic">Naming Ceremony · Cradle Ceremony</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital Namakaran invitation for your baby&apos;s naming ceremony in minutes. Share the muhurat time, ceremony schedule, venue map, and the baby&apos;s first photos — all from one WhatsApp link. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=namakaran" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Free Namakaran Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Regional names */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            Namakaran Invitations for Every Indian Baby Naming Tradition
          </h2>
          <p className="text-center text-sm text-muted mb-10 max-w-xl mx-auto">
            Namakaran, Naamkaran, Cradle Ceremony, Namakarana — one free digital invitation works for every regional baby naming tradition
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CEREMONY_NAMES.map(c => (
              <div key={c.name} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-heading text-lg text-ink">{c.name}</p>
                  <span className="shrink-0 rounded-full bg-[#7A3E4A]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-strong whitespace-nowrap">
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
            What&apos;s Included in Your Digital Namakaran Invitation
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
            How to Create a Free Digital Namakaran Invitation
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Enter ceremony details', desc: 'Add baby\'s name, parents\' names, muhurat time, venue, ceremony schedule, and a blessing message.' },
              { step: '02', title: 'Upload baby photos', desc: 'Add the baby\'s first photos to the gallery — makes the invite personal and unforgettable.' },
              { step: '03', title: 'Share on WhatsApp', desc: 'Forward the link to all family groups and friends in one tap. No app needed.' },
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
            Namakaran Invitation — Frequently Asked Questions
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
            Create Your Free Digital Namakaran Invitation
          </h2>
          <p className="text-muted text-sm mb-7">Free to start. WhatsApp-ready in 5 minutes.</p>
          <Link href="/create?template=namakaran" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Namakaran Invite Free →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
