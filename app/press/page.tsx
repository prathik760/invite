import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import SiteFooter from '@/components/landing/SiteFooter'
import Logo from '@/components/brand/Logo'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Press & Media | ShareInvite — Digital Invitation Platform' },
  description:
    'Press kit, logos, and company facts for ShareInvite — India\'s digital invitation platform. Contact our media team for interviews and coverage requests.',
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
    <main className="min-h-screen bg-champagne text-foreground">
      <SiteHeader />

      {/* Hero */}
      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Press & media' }]} eyebrow="Press & Media"
        title={<>ShareInvite<br />
            <span className="text-burnished italic">Press & Media Kit</span></>}
        lede={<>Resources for journalists, bloggers, and media professionals covering Indian weddings, event technology, and digital transformation for Indian families.</>}
        footnote={<TrustList />}
      />

      {/* About */}
      <section className="bg-paper border-y border-line px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">About ShareInvite</h2>
          <div className="space-y-5 text-base leading-8 text-muted">
            <p>
              ShareInvite was founded in 2026 by <strong className="text-charcoal font-semibold">Prathik Thelkar</strong> with one straightforward observation: Indian families were spending thousands on printed wedding cards while the link they actually shared with guests was a blurry WhatsApp image. There had to be a better way.
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
          <h2 className="t-h2 mb-8">Company facts</h2>
          <div className="divide-y divide-border rounded-2xl border border-line bg-paper overflow-hidden">
            {facts.map(f => (
              // Label above value on phones: side by side, the fixed 10rem
              // label left ~130px for values like the invitation-types list.
              <div key={f.label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6 sm:px-6">
                <span className="shrink-0 text-xs sm:w-40 font-semibold uppercase tracking-[0.18em] text-muted pt-0.5">{f.label}</span>
                <span className="text-sm text-foreground leading-6">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage angles */}
      <section className="bg-paper border-y border-line px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Story angles</h2>
          <p className="text-sm text-muted mb-8">Topics our team is happy to comment on and provide data for</p>
          <ul className="space-y-3">
            {coverageTopics.map((topic, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A47945]" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Logo download */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Logos & brand assets</h2>
          <p className="text-sm text-muted mb-8">
            Use ShareInvite brand assets only to refer to our products and services. Do not modify colours, proportions, or apply effects to the logo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex flex-col items-center gap-5 p-8">
              <div className="flex h-24 items-center"><Logo /></div>
              <p className="text-center text-[0.9rem] text-muted">Logo on light backgrounds</p>
              <a href="/brand/mark-512.png" download="shareinvite-mark.png" className="link text-[0.85rem]">
                Download the mark (PNG, 512px)
              </a>
            </div>
            <div className="flex flex-col items-center gap-5 rounded-3xl bg-emerald p-8 shadow-soft">
              <div className="flex h-24 items-center"><Logo tone="light" /></div>
              <p className="text-center text-[0.9rem] text-paper/65">Logo on emerald or dark backgrounds</p>
              <a href="/brand/mark-512.png" download="shareinvite-mark.png" className="text-[0.85rem] font-semibold text-gold-soft underline-offset-4 hover:underline">
                Download the mark (PNG, 512px)
              </a>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              ['Emerald', '#052E20'],
              ['Burnished gold', '#A47945'],
              ['Soft gold', '#E8C866'],
              ['Champagne', '#FFFAF4'],
            ].map(([name, hex]) => (
              <div key={hex} className="overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="h-16" style={{ background: hex }} />
                <p className="px-4 pt-3 text-[0.85rem] font-semibold">{name}</p>
                <p className="px-4 pb-3 font-mono text-[0.78rem] text-muted">{hex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <CtaBand
        eyebrow="Press & media"
        title="Media enquiries"
        sub="For press enquiries, interview requests or brand assets, email shareinvite123@gmail.com. We typically respond within 24 hours."
        primary={{ href: 'mailto:shareinvite123@gmail.com', label: 'Email the media team' }}
        secondary={{ href: '/', label: 'Visit ShareInvite' }}
        location="press_footer"
      />

      <SiteFooter />
    </main>
  )
}
