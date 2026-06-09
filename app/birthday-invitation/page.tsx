import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Digital Birthday Invitation Website Free | Online Birthday E-Invite India | ShareInvite',
  description:
    'Create a stunning digital birthday invitation website in minutes. Bollywood-themed templates, live countdown, WhatsApp-ready link, photo gallery & more. Free to create. No app needed.',
  keywords: [
    'digital birthday invitation India free',
    'online birthday invitation India',
    'birthday e-invite India',
    'WhatsApp birthday invitation link',
    'digital birthday card India',
    'birthday invitation website free',
    'Bollywood birthday invitation',
    'birthday invitation online maker',
    'birthday invitation website India',
  ],
  alternates: { canonical: `${APP_URL}/birthday-invitation` },
  openGraph: {
    title: 'Free Digital Birthday Invitation Website India | ShareInvite',
    description: 'Create a beautiful digital birthday invitation in 5 minutes. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Birthday Invitation India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a digital birthday invitation for free in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit shareinvite.in/create, pick the Janamdin Birthday template, enter the celebrant\'s name, age, date, venue and message, then click Create. Your birthday invitation is live with a WhatsApp-shareable link in under 5 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add photos to a digital birthday invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ShareInvite lets you upload photos that appear in a beautiful gallery on the invitation page. Guests can swipe through photos of the birthday person while viewing the invite details.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes ShareInvite birthday invitations different from WhatsApp image invites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike a static image, ShareInvite creates a live website with a countdown timer, Google Maps directions, photo gallery, background music, and a guest wishes section — all accessible from a single WhatsApp link. It\'s a premium experience at zero cost.',
      },
    },
  ],
}

export default function BirthdayInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" /></Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,0,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Free · WhatsApp ready · No app required
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Digital Birthday Invitation<br />
            <span className="gradient-accent italic">Website for India</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a festive digital birthday invitation website in 5 minutes.
            Bollywood-inspired Janamdin template with countdown, gallery, music & WhatsApp sharing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Birthday Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 border-y border-border bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            What your birthday invitation includes
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🎂', title: 'Celebrant Name & Age', desc: "Display the birthday person's name and milestone age beautifully." },
              { icon: '⏱', title: 'Live Countdown', desc: 'A ticking timer to the party — guests check it to stay excited.' },
              { icon: '📍', title: 'Venue + Google Maps', desc: 'Venue name, address, and a one-tap directions button.' },
              { icon: '📸', title: 'Photo Gallery', desc: "Upload the birthday person's photos for a personal, warm invite." },
              { icon: '🎵', title: 'Favourite Song', desc: 'Play their favourite party track when guests open the invite.' },
              { icon: '🎉', title: 'Party Schedule', desc: 'Cocktails, cake cutting, games — a clear timeline for guests.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
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
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Make the birthday unforgettable</h2>
          <p className="text-muted text-sm mb-7">Free to create · No credit card · WhatsApp-ready in 5 minutes</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Birthday Invite Free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" /></Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">Digital Invites</Link>
        </div>
      </footer>
    </main>
  )
}
