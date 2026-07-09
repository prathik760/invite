import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { RingIcon, CalendarIcon, ClockIcon, MusicIcon, CameraIcon, MessageIcon, ClipboardIcon, ShirtIcon, ShareIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Wedding Invitation India | ShareInvite' },
  description:
    'Free digital wedding invitation for India — share on WhatsApp with countdown, Google Maps, photo gallery & RSVP. Ready in 5 minutes.',
  keywords: [
    'digital wedding invitation India free',
    'online wedding invitation website India',
    'Indian wedding e-invite',
    'free wedding invitation website India',
    'wedding invitation WhatsApp link',
    'digital wedding card India',
    'shaadi invitation website',
    'wedding website builder India free',
    'wedding invitation Bangalore',
    'wedding invitation Mumbai',
    'wedding invitation Delhi',
  ],
  alternates: { canonical: `${APP_URL}/wedding-invitation` },
  openGraph: {
    title: 'Free Digital Wedding Invitation Website India | ShareInvite',
    description: 'Create a stunning digital wedding invitation website for your Indian wedding. WhatsApp-ready. Free to start.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Digital Wedding Invitation Website India' }],
  },
}

const weddingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a free digital wedding invitation website in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to shareinvite.in/create, choose a wedding template (Elegant Wedding is free), enter names, date, venue, and personal message, then click Create. You get a unique URL instantly — share it on WhatsApp in under 5 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a digital wedding invitation include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A complete digital wedding invitation should include: bride and groom names, wedding date and time, ceremony venue with Google Maps link, event schedule (baraat, varmala, pheras, dinner), dress code, a personal message, photo gallery, and background music. ShareInvite includes all of these.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share a digital wedding invitation on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ShareInvite creates a shareable URL like shareinvite.in/e/your-names that opens instantly in WhatsApp without any app download. Guests can see the full invitation, get directions, and leave wishes directly from the link.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital wedding invitation better than a PDF card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — a digital invitation website is far more useful. It loads faster than a PDF, includes live countdown, clickable Google Maps, a photo gallery, background music, and a guest wishes section. Guests can revisit it anytime before the wedding.',
      },
    },
  ],
}

const TEMPLATES = [
  { name: 'Elegant Wedding', desc: 'Warm ivory & gold — timeless romance', badge: 'Free', badgeColor: '#2F766D' },
  { name: 'Cinematic Night', desc: 'Dark & dramatic — bold film-noir style', badge: 'Standard', badgeColor: '#B87924' },
  { name: 'Shaadi — Indian Wedding', desc: 'Vibrant crimson & gold — grand Indian ceremony', badge: 'Premium', badgeColor: '#B87924' },
  { name: 'KGF — Royal Empire', desc: 'Dark gold cinematic luxury — KGF inspired', badge: 'Gold', badgeColor: '#C9A84C' },
  { name: 'Royal Deco — Palace Edition', desc: 'Midnight navy & antique gold Art Deco', badge: 'Gold', badgeColor: '#C9A84C' },
]

const CITIES: { slug: string; label: string }[] = [
  { slug: 'bengaluru', label: 'Bengaluru' },
  { slug: 'mumbai', label: 'Mumbai' },
  { slug: 'delhi', label: 'Delhi' },
  { slug: 'hyderabad', label: 'Hyderabad' },
  { slug: 'chennai', label: 'Chennai' },
  { slug: 'pune', label: 'Pune' },
  { slug: 'kolkata', label: 'Kolkata' },
  { slug: 'ahmedabad', label: 'Ahmedabad' },
]

export default function WeddingInvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(weddingFaqSchema) }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=elegant-wedding" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Free · No app download · WhatsApp ready
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Digital Wedding Invitation<br />
            <span className="gradient-accent italic">Website for India</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Create a beautiful digital wedding invitation website in under 5 minutes.
            Share a WhatsApp link — no PDF, no printing, no app required.
            Your guests get directions, event schedule, photos, and more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=elegant-wedding" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Free Wedding Invite →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-5 py-16 border-y border-border bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            What&apos;s Included in a Free Digital Wedding Invitation
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <RingIcon />, title: 'Bride & Groom Names', desc: 'Beautiful typography designed for Indian names with script "&" connector.' },
              { icon: <CalendarIcon />, title: 'Date, Time & Venue', desc: 'Ceremony details with full address and one-tap Google Maps directions.' },
              { icon: <ClockIcon />, title: 'Live Countdown Timer', desc: 'A ticking countdown to the wedding moment — creates excitement for guests.' },
              { icon: <MusicIcon />, title: 'Background Music', desc: 'Upload your favourite song to play softly as guests view the invite.' },
              { icon: <CameraIcon />, title: 'Photo Gallery', desc: 'Upload pre-wedding photos for a personal, emotional touch.' },
              { icon: <MessageIcon />, title: 'Guest Wishes', desc: 'Collect heartfelt messages from guests directly on the invitation page.' },
              { icon: <ClipboardIcon />, title: 'Ceremony Schedule', desc: 'Baraat, Varmala, Saat Pheras, Reception — everything in a clear timeline.' },
              { icon: <ShirtIcon />, title: 'Dress Code', desc: 'Display attire expectations so guests come dressed right.' },
              { icon: <ShareIcon />, title: 'WhatsApp Share Button', desc: 'One tap to forward the invite to your entire family and friend groups.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            5 Free Digital Wedding Invitation Templates
          </h2>
          <p className="text-center text-muted text-sm mb-10 max-w-xl mx-auto">
            From timeless ivory weddings to grand Indian ceremonies — every digital wedding invitation template is mobile-first, WhatsApp-ready, and free to start.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map(t => (
              <div key={t.name} className="rounded-2xl border border-border bg-white p-6 shadow-sm flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink mb-1">{t.name}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ background: `${t.badgeColor}18`, color: t.badgeColor, border: `1px solid ${t.badgeColor}40` }}>
                  {t.badge}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/create?template=elegant-wedding" className="gold-button inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
              Choose a template & start free →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Loved by Indian Families
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name: 'Priya & Arjun', city: 'Bengaluru', text: 'We shared our invitation on WhatsApp and got over 200 guest wishes. The Google Maps integration saved us so many calls from relatives asking for directions.' },
              { name: 'Sneha & Rahul', city: 'Mumbai', text: 'Our guests loved the countdown timer. We could update the Sangeet venue last minute and everyone had the right address instantly — no reprinting, no panic.' },
              { name: 'Kavya & Karthik', city: 'Hyderabad', text: 'The Indian Wedding template was exactly what we wanted for our Telugu ceremony. Our Muhurtham time, Pellikoduku schedule, and venue were all beautifully laid out.' },
            ].map(t => (
              <div key={t.name} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-[#D9A441]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-muted leading-7 mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-sm text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing nudge */}
      <section className="border-t border-border bg-[#FFFBF5] px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-6">Simple, transparent pricing</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Basic', price: '₹0', badge: 'Free', desc: 'Elegant Wedding template, Google Maps, WhatsApp link' },
              { name: 'Standard', price: '₹499', badge: 'Most popular', desc: '4 templates, background music, event schedule' },
              { name: 'Premium', price: '₹999', badge: 'Best value', desc: 'Indian Wedding, Engagement, Griha Pravesh & more' },
              { name: 'Gold', price: '₹1,499', badge: 'Luxury', desc: 'All 11 templates — KGF Royal Empire + Anniversary' },
            ].map(p => (
              <div key={p.name} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-heading text-base text-ink">{p.name}</p>
                  <span className="shrink-0 rounded-full bg-[#D9A441]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-strong">{p.badge}</span>
                </div>
                <p className="font-display text-2xl text-ink mb-2">{p.price}</p>
                <p className="text-xs text-muted leading-5">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">One-time payment · No subscription · Invitation stays live for 1 year</p>
          <div className="mt-6 text-center">
            <Link href="/create?template=elegant-wedding" className="gold-button inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
              Start Free — Upgrade Anytime →
            </Link>
          </div>
        </div>
      </section>

      {/* City section — for local SEO */}
      <section className="bg-white px-5 py-12 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-2xl text-ink text-center mb-2">
            Digital Wedding Invitations for Families Across India
          </h2>
          <p className="text-center text-sm text-muted mb-8">
            Indian families in 8+ cities use ShareInvite to create and share their free digital wedding invitation on WhatsApp
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/wedding-invitation/${c.slug}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[#D9A441]/60 hover:bg-white">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Free Digital Wedding Invitation — FAQ
          </h2>
          <div className="space-y-4">
            {weddingFaqSchema.mainEntity.map((faq, i) => (
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
            Create Your Free Digital Wedding Invitation
          </h2>
          <p className="text-muted text-sm mb-7">Free to start. WhatsApp-ready in 5 minutes.</p>
          <Link href="/create?template=elegant-wedding" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Wedding Invite Free →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
