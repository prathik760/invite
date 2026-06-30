import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CameraIcon, ClockIcon, MapPinIcon, MusicIcon, MessageIcon, ClipboardIcon, ShareIcon, SparklesIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Anniversary Invitation India | ShareInvite' },
  description:
    'Free digital anniversary invitation for India. Silver, golden & milestone e-invites. WhatsApp-ready with photos & countdown. Ready in 5 minutes.',
  keywords: [
    'anniversary invitation',
    'digital anniversary invitation India',
    'anniversary invitation digital',
    '25th anniversary invitation',
    'silver anniversary invitation',
    'golden anniversary invitation',
    'anniversary e-invite India',
    'anniversary invitation WhatsApp',
    'free anniversary invitation online India',
  ],
  alternates: { canonical: `${APP_URL}/anniversary-invitation` },
  openGraph: {
    title: 'Free Digital Anniversary Invitation India | ShareInvite',
    description: 'Free digital anniversary invitation for India. Silver, golden & milestone anniversary e-invites. WhatsApp-ready with photos & countdown.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Anniversary Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital anniversary invitation for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose an anniversary template, enter the couple\'s names, anniversary year, celebration date, venue, and a personal message. Upload milestone photos from across the years, and your invitation is live in under 5 minutes — with a WhatsApp-shareable link for all family groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What details should a 25th anniversary invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A 25th (Silver) anniversary invitation should include: the couple\'s names, the milestone year prominently (25 Years Together), the celebration date and time, venue with address and Google Maps link, programme schedule (pooja, cake cutting, dinner), dress code if any, and a heartfelt message from the family. Adding a photo gallery of the couple across 25 years makes the digital invitation particularly meaningful.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it appropriate to send an anniversary invitation on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. WhatsApp is the most practical and inclusive channel for Indian families — it reaches both younger family members and elders who may not check email. Send a short celebratory message alongside your digital invitation link so guests get all the details at a tap. No app download is needed for guests to view the invitation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I include a photo album in the anniversary invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. ShareInvite's anniversary invitation includes a photo gallery section where you can upload the couple's photos from across the years — wedding photos, family milestones, travel memories, and recent pictures. Guests can swipe through the gallery while viewing the invitation, which makes the digital invite feel like a celebration in itself.",
      },
    },
  ],
}

const FEATURES = [
  { icon: <CameraIcon />, title: 'Couple Photos & Story', desc: 'Upload your favourite photos across the years in a beautifully arranged gallery.' },
  { icon: <SparklesIcon />, title: 'Milestone Year Display', desc: 'Show your anniversary milestone (25th, 50th) in beautiful display typography.' },
  { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A ticking countdown to the celebration — guests feel the anticipation.' },
  { icon: <MapPinIcon />, title: 'Venue + Google Maps', desc: 'Full venue address with one-tap Google Maps directions for guests.' },
  { icon: <ClipboardIcon />, title: 'Anniversary Timeline', desc: 'List your journey — where you met, got married, milestones — as a celebration schedule.' },
  { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect warm messages, blessings, and congratulations from attending and distant guests.' },
  { icon: <MusicIcon />, title: 'Background Music', desc: 'Play a meaningful song — your wedding song or a favourite — as guests view the invite.' },
  { icon: <ShareIcon />, title: 'WhatsApp Sharing', desc: 'Share across all family groups in one tap — no app download needed for guests.' },
]

const MILESTONES = [
  { year: '1st', name: 'Paper Anniversary', theme: 'New Beginnings', desc: 'The first year is the foundation. A paper anniversary celebration marks one full year of building a life together — a milestone worth sharing with those who witnessed the beginning.' },
  { year: '5th', name: 'Wood Anniversary', theme: 'Half Decade Together', desc: 'Five years of strength and growth. A wooden anniversary celebration shows that the relationship has roots — and deserves to be celebrated with family and close friends.' },
  { year: '10th', name: 'Tin Anniversary', theme: 'A Decade of Love', desc: 'Ten years is a significant milestone. A decade-anniversary celebration with a digital invitation, photos from across the years, and a family gathering marks this accomplishment beautifully.' },
  { year: '25th', name: 'Silver Jubilee', theme: 'Silver Anniversary', desc: 'Twenty-five years together is a rare and beautiful achievement. The Silver Jubilee is one of the most celebrated anniversary milestones in Indian families — often with a large ceremony, renewal of vows, and a celebration that rivals a wedding.' },
  { year: '50th', name: 'Golden Jubilee', theme: 'Golden Anniversary', desc: 'Fifty years of togetherness is extraordinary. A Golden Jubilee celebration is a family legacy event — often bringing children, grandchildren, and lifelong friends together for a ceremony full of gratitude, stories, and blessings.' },
  { year: '60th', name: 'Diamond Anniversary', theme: 'Diamond Anniversary', desc: 'Sixty years together represents a love as enduring and rare as a diamond. A Diamond Anniversary celebration is a deeply emotional, once-in-a-lifetime event that the entire family will treasure forever.' },
]

const CITIES = ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

export default function AnniversaryInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=anniversary" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
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
            Digital Anniversary Invitation<br />
            <span className="gradient-accent italic">Silver · Golden · Milestone</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital anniversary invitation in minutes. Mark 25, 50, or any milestone year with a shareable WhatsApp link — complete with couple photos, story, countdown, and guest wishes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=anniversary" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Anniversary Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            What&apos;s Included in Your Digital Anniversary Invitation
          </h2>
          <p className="text-center text-sm text-muted mb-10 max-w-xl mx-auto">
            Every feature is designed to make your milestone celebration feel as special as it truly is.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9A441]/10 text-[#D9A441]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            Anniversary Milestones Worth Celebrating
          </h2>
          <p className="text-center text-sm text-muted mb-10 max-w-xl mx-auto">
            Every year together is worth celebrating — and some milestones deserve a proper invitation.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MILESTONES.map(m => (
              <div key={m.year} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-heading text-3xl text-accent-strong">{m.year}</p>
                    <p className="font-heading text-lg text-ink mt-0.5">{m.name}</p>
                  </div>
                  <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong shrink-0">{m.theme}</span>
                </div>
                <p className="text-sm text-muted leading-7">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-border px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            How to Create a Free Digital Anniversary Invitation
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Add couple details',
                desc: 'Enter both names, anniversary year/date, venue, story highlights, and a celebration message.',
              },
              {
                step: '02',
                title: 'Upload milestone photos',
                desc: 'Add couple photos from across the years — wedding, milestones, family. The gallery brings the celebration to life.',
              },
              {
                step: '03',
                title: 'Share on WhatsApp',
                desc: 'Send the invite to all family, friends, and children\'s groups in one tap. No app needed for guests to view it.',
              },
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
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Anniversary Invitation — Frequently Asked Questions
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

      {/* City links */}
      <section className="border-b border-border bg-white px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Anniversary invitations by city</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/anniversary-invitation/${city}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground capitalize hover:border-[#D9A441]/50 transition-colors"
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="border-b border-border px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-6 text-center">Explore more invitation types</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/wedding-invitation', label: 'Digital Wedding Invitation' },
              { href: '/engagement-invitation', label: 'Digital Engagement Invitation' },
              { href: '/digital-invitation', label: 'All Digital Invitations' },
              { href: '/templates', label: 'Browse All Templates' },
              { href: '/create', label: 'Create Your Anniversary Invitation Free' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Create Your Free Anniversary Invitation Today</h2>
          <p className="text-muted text-sm mb-7">Free to create · No credit card · WhatsApp-ready in 5 minutes</p>
          <Link href="/create?template=anniversary" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Anniversary Invite Free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink tracking-wide">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/engagement-invitation" className="hover:text-foreground transition-colors">Engagement</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
