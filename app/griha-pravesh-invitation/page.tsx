import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ClockIcon, MapPinIcon, ClipboardIcon, CameraIcon, MessageIcon, ParkingIcon, MusicIcon, ShareIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Griha Pravesh Invitation India | ShareInvite' },
  description:
    'Free digital Griha Pravesh invitation for India. Share muhurat time, pooja schedule & Google Maps on WhatsApp. No app needed. Ready in 5 minutes.',
  keywords: [
    'digital Griha Pravesh invitation',
    'online housewarming invitation India free',
    'Griha Pravesh invitation WhatsApp',
    'housewarming ceremony invitation digital',
    'Griha Pravesh e-invite India',
    'griha pravesh card online free',
    'housewarming invitation website India',
    'digital house warming invitation',
    'ghar pravesh invitation online',
    'pooja ceremony invitation digital',
    'new home blessing invitation India',
    'housewarming muhurat invitation',
  ],
  alternates: { canonical: `${APP_URL}/griha-pravesh-invitation` },
  openGraph: {
    title: 'Free Digital Griha Pravesh Invitation | Housewarming E-Invite India | ShareInvite',
    description: 'Create a stunning digital Griha Pravesh invitation with muhurat time, pooja schedule, and Google Maps. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Griha Pravesh Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital Griha Pravesh invitation for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a template, enter the muhurat time, new address, pooja schedule, and a family blessing message. Your Griha Pravesh invitation is live in under 5 minutes — share the link directly on WhatsApp with all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a Griha Pravesh invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A complete Griha Pravesh invitation should include: the auspicious muhurat time, full address with Google Maps pin, pooja schedule (Ganesh Pooja, Grah Shanti, Vastu Pooja, lunch), host family name, a personal blessing message, and any parking or entry instructions for guests.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Griha Pravesh and Ghar Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Griha Pravesh (or Gruhapravesham in South India, Ghar Pravesh in common usage) all refer to the same ceremony — the auspicious entry into a new home. The name varies by region and language. ShareInvite lets you customise the invitation heading to match your regional tradition.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I send a Griha Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send the Griha Pravesh invitation at least 10–14 days before the ceremony. Share a reminder on WhatsApp 2 days before. With a digital invitation, reminders are as simple as re-forwarding the same link — no new design or printing needed.',
      },
    },
  ],
}

const FEATURES = [
  { icon: <ClockIcon />, title: 'Muhurat Time Display', desc: 'Show the auspicious ceremony time prominently — the most critical detail guests need for Griha Pravesh.' },
  { icon: <MapPinIcon />, title: 'New Address + Google Maps', desc: 'Provide the full new address with a one-tap Google Maps pin so guests navigate easily, even in new localities.' },
  { icon: <ClipboardIcon />, title: 'Pooja Schedule', desc: 'List the full programme — Ganesh Pooja, Grah Shanti, Vastu Pooja, lunch — so guests plan their day.' },
  { icon: <CameraIcon />, title: 'Photo Gallery', desc: 'Share photos of the new home to make the invitation personal and memorable for family.' },
  { icon: <MessageIcon />, title: 'Family Blessings', desc: 'Collect blessings and well-wishes from relatives who cannot attend in person.' },
  { icon: <ParkingIcon />, title: 'Parking & Entry Notes', desc: 'Add notes for parking, apartment building entry, or nearby landmarks to help guests arrive without confusion.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Set an auspicious or devotional track to play softly as guests view the invitation.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'One tap to send the invite across all family and neighbourhood WhatsApp groups instantly.' },
]

const CEREMONY_NAMES = [
  { name: 'Griha Pravesh', region: 'North India / Pan-India', desc: 'The most widely used Sanskrit term for the housewarming ceremony' },
  { name: 'Gruhapravesham', region: 'South India', desc: 'Tamil and Telugu families use this name for the auspicious home entry' },
  { name: 'Ghar Pravesh', region: 'Hindi belt', desc: 'Common colloquial name used across UP, Bihar, MP, and Rajasthan' },
  { name: 'Griha Pravesha', region: 'Karnataka', desc: 'Kannada variant widely used for housewarming ceremonies in Karnataka' },
  { name: 'Vastu Pooja', region: 'Gujarat & Maharashtra', desc: 'The Vastu Shanti ceremony often coincides with the housewarming entry' },
  { name: 'Satyanarayan Pooja', region: 'Pan-India', desc: 'Many families combine the housewarming with a Satyanarayan Pooja celebration' },
]

export default function GrihaPraveshInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=griha-pravesh" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
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
            <span className="gradient-accent italic">Housewarming · Ghar Pravesh</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital Griha Pravesh invitation in minutes. Share the muhurat time, full pooja schedule, new address with Google Maps, and family blessings — all from one WhatsApp link. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=griha-pravesh" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Free Griha Pravesh Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Regional names */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            Griha Pravesh Invitations for Every Regional Housewarming Tradition
          </h2>
          <p className="text-center text-sm text-muted mb-10 max-w-xl mx-auto">
            Griha Pravesh, Ghar Pravesh, Gruhapravesham, Vastu Puja — one free digital invitation works for all regional traditions
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

      {/* What to include */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            What&apos;s Included in Your Digital Griha Pravesh Invitation
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
            How to Create a Free Griha Pravesh Digital Invitation
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Enter ceremony details', desc: 'Add muhurat time, new address, pooja schedule, host names, and a personal blessing message.' },
              { step: '02', title: 'Preview instantly', desc: 'See your Griha Pravesh invitation come to life with the address, schedule, and map link.' },
              { step: '03', title: 'Share on WhatsApp', desc: 'Copy your unique link and forward it to family groups, neighbours, and friends.' },
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
            Griha Pravesh Digital Invitation — FAQ
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
            Create Your Free Griha Pravesh Invitation
          </h2>
          <p className="text-muted text-sm mb-7">Free to start. WhatsApp-ready in 5 minutes. Loved by Indian families.</p>
          <Link href="/create?template=griha-pravesh" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Griha Pravesh Invite Free →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
