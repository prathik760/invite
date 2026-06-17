import type { Metadata } from 'next'
import Link from 'next/link'
import { CakeIcon, ClockIcon, MapPinIcon, CameraIcon, MusicIcon, SparklesIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Free Digital Birthday Invitation India | ShareInvite',
  description:
    'Free digital birthday invitation for India. Festive templates with live countdown, WhatsApp link, photo gallery & favourite song. No app needed. Ready in 5 minutes.',
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
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=indian-birthday" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
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
            Create a festive digital birthday invitation in 5 minutes. Indian birthday templates with live countdown, photo gallery, favourite song &amp; one-tap WhatsApp sharing. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=indian-birthday" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Birthday Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 border-y border-border bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            What&apos;s Included in Your Digital Birthday Invitation
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <CakeIcon />, title: 'Celebrant Name & Age', desc: "Display the birthday person's name and milestone age beautifully." },
              { icon: <ClockIcon />, title: 'Live Countdown', desc: 'A ticking timer to the party — guests check it to stay excited.' },
              { icon: <MapPinIcon />, title: 'Venue + Google Maps', desc: 'Venue name, address, and a one-tap directions button.' },
              { icon: <CameraIcon />, title: 'Photo Gallery', desc: "Upload the birthday person's photos for a personal, warm invite." },
              { icon: <MusicIcon />, title: 'Favourite Song', desc: 'Play their favourite party track when guests open the invite.' },
              { icon: <SparklesIcon />, title: 'Party Schedule', desc: 'Cocktails, cake cutting, games — a clear timeline for guests.' },
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

      {/* Testimonials */}
      <section className="border-t border-border px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            Loved by Indian Families
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name: 'Meera', city: 'Hyderabad', text: "My daughter's 1st birthday invitation had her photos in a gallery, a countdown timer, and the venue map all in one link. Guests kept complimenting how beautiful it looked on WhatsApp." },
              { name: 'Rajesh', city: 'Pune', text: "I created my father's 60th birthday invite in 15 minutes and shared it to 5 family groups. The schedule with arrival, cake cutting, and dinner timings meant nobody called asking what time to come." },
              { name: 'Sunita', city: 'Chennai', text: "The background music feature was magical. I set my son's favourite song and every guest who opened the invite said it felt like a real celebration before they even arrived." },
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
              { name: 'Standard', price: '₹499', badge: 'Most popular', desc: 'Birthday & 3 more templates, background music' },
              { name: 'Premium', price: '₹999', badge: 'Best value', desc: '7 templates — Indian Wedding, Engagement & more' },
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
            <Link href="/create?template=indian-birthday" className="gold-button inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
              Start Free — Upgrade Anytime →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Digital Birthday Invitation — FAQ</h2>
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
      <section className="border-t border-border bg-white px-5 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-4">Birthday invitations by city</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['bengaluru','mumbai','delhi','hyderabad','chennai','pune','kolkata','ahmedabad'].map(city => (
              <Link
                key={city}
                href={`/birthday-invitation/${city}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground capitalize hover:border-[#D9A441]/50 transition-colors"
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Create a Memorable Digital Birthday Invitation</h2>
          <p className="text-muted text-sm mb-7">Free to create · No credit card · WhatsApp-ready in 5 minutes</p>
          <Link href="/create?template=indian-birthday" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Birthday Invite Free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
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
