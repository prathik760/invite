import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Digital Invitation Website Free India | Online E-Invite Maker | ShareInvite',
  description:
    'Create beautiful digital invitation websites for any Indian occasion — wedding, birthday, house warming, naming ceremony, engagement, anniversary. WhatsApp-ready link in 5 minutes. Free to start.',
  keywords: [
    'digital invitation website India',
    'online invitation maker India free',
    'digital invitation card India',
    'e-invite India free',
    'digital invitation WhatsApp India',
    'online invitation maker India',
    'digital invite card maker',
    'house warming invitation online India',
    'namakaran invitation digital',
    'engagement invitation website India',
    'griha pravesh invitation online',
  ],
  alternates: { canonical: `${APP_URL}/digital-invitation` },
  openGraph: {
    title: 'Free Digital Invitation Website Maker India | ShareInvite',
    description: 'Create digital invitation websites for any Indian event. WhatsApp-ready. 10 templates. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Invitation Website India' }],
  },
}

const OCCASIONS = [
  { name: 'Wedding', href: '/wedding-invitation', desc: '5 templates · Free to Gold', emoji: '💍' },
  { name: 'Engagement', href: '/create', desc: 'Mangni ceremony invite', emoji: '💝' },
  { name: 'Birthday', href: '/birthday-invitation', desc: 'Bollywood-style party invite', emoji: '🎂' },
  { name: 'House Warming', href: '/create', desc: 'Griha Pravesh ceremony', emoji: '🏡' },
  { name: 'Naming Ceremony', href: '/create', desc: 'Namakaran celebration', emoji: '🌸' },
  { name: 'Anniversary', href: '/create', desc: 'Milestone celebration invite', emoji: '❤️' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a digital invitation website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A digital invitation website is a mobile-optimised web page containing all event details — date, time, venue, schedule, photos, music, and countdown — accessible from a single shareable link. Guests open it from WhatsApp without installing any app.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital invitation better than a PDF or image invite on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A digital invitation website is interactive — it has a live countdown, one-tap Google Maps, a photo gallery, background music, and a guest wishes section. It opens faster than a PDF and works on all phones without any downloads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which occasions can I create digital invitations for on ShareInvite?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ShareInvite supports 10 Indian event types: weddings, engagements (Mangni), birthdays (Janamdin), house warmings (Griha Pravesh), naming ceremonies (Namakaran), anniversaries, and more. New templates are added regularly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a digital invitation cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Elegant Wedding template is completely free forever. Premium templates with gallery, music, and countdown start at ₹499 as a one-time payment — no monthly fees, no hidden charges.',
      },
    },
  ],
}

export default function DigitalInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="font-display text-2xl text-ink tracking-wide">ShareInvite</Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            10 templates · Free to start · WhatsApp ready
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Digital Invitation Website<br />
            <span className="gradient-accent italic">for Every Indian Occasion</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Wedding, birthday, house warming, naming ceremony, engagement, anniversary —
            create a beautiful digital invitation website for any family occasion in 5 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Free Digital Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · No app download</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 border-y border-border bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            One platform for every Indian celebration
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map(o => (
              <Link key={o.name} href={o.href}
                className="group rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                <span className="text-4xl shrink-0">{o.emoji}</span>
                <div>
                  <h3 className="font-heading text-lg text-ink group-hover:text-accent-strong transition-colors">{o.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{o.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Frequently asked questions</h2>
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

      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Start creating your digital invitation</h2>
          <p className="text-muted text-sm mb-7">Free to start · WhatsApp-ready · No credit card needed</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Digital Invitation →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="font-display text-xl text-ink">ShareInvite</Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
        </div>
      </footer>
    </main>
  )
}
