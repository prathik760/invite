import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Press & Media | ShareInvite — Digital Invitation Platform India',
  description:
    'Press resources for ShareInvite — India\'s digital invitation platform. Download logos, read company facts, and contact our media team for interviews and coverage.',
  keywords: [
    'ShareInvite press',
    'ShareInvite media kit',
    'digital invitation startup India',
    'ShareInvite company information',
    'Indian wedding tech startup press',
  ],
  alternates: { canonical: `${APP_URL}/press` },
  openGraph: {
    title: 'Press & Media Kit | ShareInvite',
    description: 'Press resources, company facts, and media contact for ShareInvite — India\'s digital invitation platform.',
    type: 'website',
    locale: 'en_IN',
  },
}

const facts = [
  { label: 'Founded', value: '2026' },
  { label: 'Founder', value: 'Prathik Thelkar' },
  { label: 'Headquarters', value: 'India' },
  { label: 'Focus market', value: 'Indian weddings & events' },
  { label: 'Invitation types', value: 'Wedding, Engagement, Birthday, Griha Pravesh, Namakaran & more' },
  { label: 'Sharing channel', value: 'WhatsApp-native link sharing' },
  { label: 'Pricing', value: 'Free to start' },
]

const coverageTopics = [
  'How digital invitations are replacing printed wedding cards in India',
  'WhatsApp as the primary event communication channel for Indian families',
  'The environmental case for eco-friendly digital invitations',
  'How Indian wedding tech is catching up with global event platforms',
  'The rise of the Indian wedding economy and digital-first tools',
  'Regional diversity in Indian weddings — how one platform serves all traditions',
]

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Press & Media
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            ShareInvite<br />
            <span className="gradient-accent italic">Press & Media Kit</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Resources for journalists, bloggers, and media professionals covering Indian weddings, event technology, and digital transformation for Indian families.
          </p>
          <div className="mt-6">
            <a
              href="mailto:press@shareinvite.in"
              className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold"
            >
              Contact Press Team →
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6">About ShareInvite</h2>
          <div className="space-y-5 text-base leading-8 text-muted">
            <p>
              ShareInvite was founded in 2026 by <strong className="text-ink font-semibold">Prathik Thelkar</strong> with one straightforward observation: Indian families were spending thousands on printed wedding cards while the link they actually shared with guests was a blurry WhatsApp image. There had to be a better way.
            </p>
            <p>
              ShareInvite is an Indian digital invitation platform that lets families create beautiful invitation websites for weddings, engagements, birthdays, Griha Pravesh, Namakaran, and all life events — and share them instantly on WhatsApp. One link. Everything guests need: venue map, ceremony schedule, photo gallery, background music, countdown, and a wishes section where family can leave blessings.
            </p>
            <p>
              The platform is built specifically for the Indian market: WhatsApp-first sharing, regional ceremony name support (Roka, Mangni, Nishchayathartham, Griha Pravesh, Gruhapravesham, Godh Bharai, Namakaran, and more), and mobile-optimised pages that load quickly across Indian network conditions. Prathik built ShareInvite after watching families navigate the gap between how much care went into planning a celebration and how little that showed in the way invitations were shared.
            </p>
          </div>
        </div>
      </section>

      {/* Company facts */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-8">Company facts</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-white overflow-hidden">
            {facts.map(f => (
              <div key={f.label} className="flex items-start gap-6 px-6 py-4">
                <span className="w-40 shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted pt-0.5">{f.label}</span>
                <span className="text-sm text-foreground leading-6">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage angles */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3">Story angles</h2>
          <p className="text-sm text-muted mb-8">Topics our team is happy to comment on and provide data for</p>
          <ul className="space-y-3">
            {coverageTopics.map((topic, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A441]" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Logo download */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3">Logos & brand assets</h2>
          <p className="text-sm text-muted mb-8">
            Use ShareInvite brand assets only to refer to our products and services. Do not modify colours, proportions, or apply effects to the logo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-8 flex flex-col items-center gap-4 shadow-sm">
              <div className="rounded-xl bg-white border border-border p-4">
                <img src="/logo1.png" alt="ShareInvite logo" className="h-12 w-auto" width="160" height="48" />
              </div>
              <p className="text-sm text-muted text-center">Primary logo (dark)</p>
              <a
                href="/logo1.png"
                download="shareinvite-logo.png"
                className="text-xs font-semibold text-accent-strong hover:underline"
              >
                Download PNG →
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-ink p-8 flex flex-col items-center gap-4 shadow-sm">
              <div className="rounded-xl bg-ink p-4">
                <img src="/logo1.png" alt="ShareInvite logo on dark" className="h-12 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-white/60 text-center">Logo on dark background</p>
              <a
                href="/logo1.png"
                download="shareinvite-logo-white.png"
                className="text-xs font-semibold text-[#D9A441] hover:underline"
              >
                Download PNG →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Media enquiries
          </h2>
          <p className="text-muted text-sm mb-7 max-w-md mx-auto">
            For press enquiries, interview requests, data, or brand assets, contact our media team at{' '}
            <a href="mailto:press@shareinvite.in" className="text-accent-strong hover:underline">
              press@shareinvite.in
            </a>
            . We typically respond within 24 hours.
          </p>
          <a
            href="mailto:press@shareinvite.in?subject=Press Enquiry"
            className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold"
          >
            Email Press Team →
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/partners" className="hover:text-foreground transition-colors">Partners</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create Invite</Link>
        </div>
      </footer>
    </main>
  )
}
