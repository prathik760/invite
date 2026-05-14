import type { Metadata } from 'next'
import Link from 'next/link'
import PricingSection from '@/components/landing/PricingSection'
import FAQAccordion from '@/components/landing/FAQAccordion'
import RunningTimer from '@/components/landing/RunningTimer'
import { PLANS } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Digital Invitation Website Builder for Indian Weddings & Events | Invitely',
  description:
    'Create a beautiful digital invitation website for your Indian wedding, birthday, house warming, naming ceremony, or engagement. Add gallery, music, live countdown, Google Maps, and WhatsApp sharing in 5 minutes. Free to start.',
  keywords: [
    'digital invitation website India',
    'wedding invitation website builder',
    'online wedding invitation maker India',
    'Indian wedding e-invite',
    'WhatsApp invitation link India',
    'birthday invitation website',
    'house warming invitation website',
    'naming ceremony digital invite',
    'engagement invitation website',
    'digital wedding card India',
    'free invitation website maker',
    'mobile invitation website',
  ],
  openGraph: {
    title: 'Invitely — Digital Invitation Websites for Indian Weddings & Events',
    description:
      'Create beautiful mobile-first invitation websites with gallery, music, live countdown, Google Maps, guest wishes, and WhatsApp sharing. Free to start. Ready in 5 minutes.',
    type: 'website',
  },
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H6V15.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Mobile-first event website',
    description: 'A polished one-page experience designed for guests opening your invitation from WhatsApp on a phone.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Venue, maps & schedule',
    description: 'Show the address, ceremony flow, date, time, dress code, and a direct Google Maps button.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Gallery, music & countdown',
    description: 'Give the invitation a premium emotional feel with photos, optional music, and a live countdown.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Guest wishes dashboard',
    description: 'Collect guest messages, approve the best ones, and display them beautifully on the invite.',
  },
]

const testimonials = [
  {
    quote: 'We shared the link on our wedding WhatsApp group and everyone loved it. The countdown and venue map made things so effortless for out-of-town guests.',
    name: 'Meera Krishnamurthy',
    event: 'Wedding · Bengaluru',
    date: 'March 2025',
    avatar: 'https://i.pravatar.cc/96?img=47',
  },
  {
    quote: "Made our daughter's naming ceremony invite in under 10 minutes. No app downloads, no printing — just a beautiful link we forwarded to the whole family.",
    name: 'Suresh Iyer',
    event: 'Naming Ceremony · Chennai',
    date: 'February 2025',
    avatar: 'https://i.pravatar.cc/96?img=57',
  },
  {
    quote: 'The gold design matched our theme perfectly. Guests kept asking how we made it — it felt so premium compared to the usual card images shared on WhatsApp.',
    name: 'Pooja Mehta',
    event: 'Birthday · Mumbai',
    date: 'January 2025',
    avatar: 'https://i.pravatar.cc/96?img=44',
  },
]

const eventTypes = ['Wedding', 'Engagement', 'Birthday', 'House Warming', 'Naming Ceremony', 'Anniversary']

const COMPACT_TEMPLATES = [
  {
    id: 'indian-birthday',
    name: 'Janamdin — Birthday',
    tagline: 'Festive cinematic',
    plan: { label: 'Standard', color: '#B87924', bg: 'rgba(184,121,36,0.14)', border: '1px solid rgba(184,121,36,0.3)' },
    eventType: 'Birthday Invitation',
    sampleName: 'Arjun',
    sampleSub: 'Turns 25',
    sampleVenue: 'Grand Hyatt · Mumbai',
    bg: 'linear-gradient(180deg,#1A0500,#2D0D00)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(255,140,0,0.2),transparent)',
    border: 'rgba(255,140,0,0.22)',
    accent: '#FF8C00',
    nameColor: '#FFF5E0',
    labelColor: 'rgba(255,140,0,0.65)',
    footerBg: '#110400',
    titleColor: '#F5DDBF',
    subColor: 'rgba(245,221,191,0.42)',
  },
  {
    id: 'namakaran',
    name: 'Namakaran Ceremony',
    tagline: 'Celestial naming ritual',
    plan: { label: 'Standard', color: '#B87924', bg: 'rgba(184,121,36,0.14)', border: '1px solid rgba(184,121,36,0.3)' },
    eventType: 'Naming Ceremony',
    sampleName: 'Aarav',
    sampleSub: "Baby's First Name",
    sampleVenue: 'The Family Home · Pune',
    bg: 'linear-gradient(180deg,#040F22,#07173A)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(79,195,247,0.15),transparent)',
    border: 'rgba(79,195,247,0.2)',
    accent: '#4FC3F7',
    nameColor: '#E8F4FF',
    labelColor: 'rgba(79,195,247,0.6)',
    footerBg: '#030D1C',
    titleColor: '#BED9EC',
    subColor: 'rgba(190,217,236,0.42)',
  },
  {
    id: 'indian-wedding',
    name: 'Shaadi — Indian Wedding',
    tagline: 'Rich traditional ceremony',
    plan: { label: 'Premium', color: '#2F766D', bg: 'rgba(47,118,109,0.12)', border: '1px solid rgba(47,118,109,0.3)' },
    eventType: 'Indian Wedding',
    sampleName: 'Priya & Rahul',
    sampleSub: 'Sacred Union',
    sampleVenue: 'Rajmahal Palace · Jaipur',
    bg: 'linear-gradient(180deg,#1A0000,#300505)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(196,30,58,0.2),transparent)',
    border: 'rgba(196,30,58,0.22)',
    accent: '#E2A735',
    nameColor: '#FFF3E0',
    labelColor: 'rgba(226,167,53,0.7)',
    footerBg: '#110000',
    titleColor: '#FFCFA0',
    subColor: 'rgba(255,207,160,0.42)',
  },
  {
    id: 'indian-engagement',
    name: 'Mangni — Engagement',
    tagline: 'Romantic rose ceremony',
    plan: { label: 'Premium', color: '#2F766D', bg: 'rgba(47,118,109,0.12)', border: '1px solid rgba(47,118,109,0.3)' },
    eventType: 'Engagement Ceremony',
    sampleName: 'Isha & Dev',
    sampleSub: 'The Beginning',
    sampleVenue: 'The Lalit · Delhi',
    bg: 'linear-gradient(180deg,#1A0013,#2D001F)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(194,24,91,0.2),transparent)',
    border: 'rgba(194,24,91,0.22)',
    accent: '#F48FB1',
    nameColor: '#FEE2F8',
    labelColor: 'rgba(244,143,177,0.65)',
    footerBg: '#120010',
    titleColor: '#F4C2E8',
    subColor: 'rgba(244,194,232,0.42)',
  },
  {
    id: 'griha-pravesh',
    name: 'Griha Pravesh',
    tagline: 'Auspicious housewarming',
    plan: { label: 'Premium', color: '#2F766D', bg: 'rgba(47,118,109,0.12)', border: '1px solid rgba(47,118,109,0.3)' },
    eventType: 'House Warming',
    sampleName: 'The Mehta Family',
    sampleSub: 'New Beginnings',
    sampleVenue: 'Our New Home · Bengaluru',
    bg: 'linear-gradient(180deg,#0F0500,#1C0B00)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(255,143,0,0.2),transparent)',
    border: 'rgba(255,143,0,0.22)',
    accent: '#FFB300',
    nameColor: '#FFF8E1',
    labelColor: 'rgba(255,179,0,0.65)',
    footerBg: '#0D0400',
    titleColor: '#FFE0A0',
    subColor: 'rgba(255,224,160,0.42)',
  },
  {
    id: 'anniversary',
    name: 'Saalgirah — Anniversary',
    tagline: 'Cinematic love story',
    plan: { label: 'Gold', color: '#C9A84C', bg: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.3)' },
    eventType: 'Anniversary',
    sampleName: 'Meera & Vivek',
    sampleSub: '25 Years Together',
    sampleVenue: 'The Oberoi · Mumbai',
    bg: 'linear-gradient(180deg,#0A0008,#150010)',
    glow: 'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(139,0,48,0.2),transparent)',
    border: 'rgba(139,0,48,0.22)',
    accent: '#CE93D8',
    nameColor: '#F3E5F5',
    labelColor: 'rgba(206,147,216,0.65)',
    footerBg: '#080006',
    titleColor: '#E8CBF5',
    subColor: 'rgba(232,203,245,0.42)',
  },
]

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#B87924">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function PhonePreview() {
  return (
    <div
      className="relative mx-auto"
      style={{ width: 'min(270px, 100%)', maxWidth: '270px' }}
      aria-label="Digital invitation website preview"
    >
      {/* Ambient glow */}
      <div
        className="absolute -inset-10 rounded-[3rem]"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(217,164,65,0.28), transparent 68%)' }}
      />

      {/* Floating badge — right */}
      <div className="absolute -right-32 top-12 hidden rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-card-md lg:block">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D] animate-pulse" />
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">Live Link</p>
        </div>
        <p className="font-heading text-sm text-ink">Ready to share</p>
      </div>

      {/* Floating badge — left */}
      <div className="absolute -left-32 bottom-24 hidden rounded-2xl border border-[#D9A441]/30 bg-[#221B17] px-3.5 py-2.5 shadow-card lg:block">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">WhatsApp</p>
        <p className="mt-0.5 text-sm font-semibold text-white">Tap to share ↗</p>
      </div>

      {/* ── iPhone 15 shell ── */}
      <div
        className="relative rounded-[2.6rem]"
        style={{
          background: 'linear-gradient(160deg, #48484A 0%, #1C1C1E 50%, #2C2C2E 100%)',
          padding: '9px',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.12), 0 0 0 2px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5), 0 40px 90px rgba(0,0,0,0.40), 0 15px 35px rgba(0,0,0,0.25)',
        }}
      >
        {/* Screen bezel top-highlight */}
        <div
          className="pointer-events-none absolute left-[9px] right-[9px] top-[9px] h-8 rounded-t-[2rem] z-10"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07), transparent)' }}
        />

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-[#FFF8F1]"
          style={{ borderRadius: '2rem', height: '520px' }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2"
            style={{
              top: '11px',
              width: '90px',
              height: '27px',
              background: '#000',
              borderRadius: '50px',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.06)',
            }}
          >
            {/* Front camera dot inside island */}
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a1a1a', boxShadow: 'inset 0 0 0 2px #0a0a0a' }}
            />
          </div>

          {/* Status bar — time left, icons right, island in between */}
          <div
            className="relative flex items-end justify-between px-5 pb-1"
            style={{ height: '48px', background: '#FFF8F1' }}
          >
            <span className="text-[10px] font-semibold text-[#221B17]" style={{ letterSpacing: '-0.02em' }}>
              9:41
            </span>
            <div className="flex items-center gap-[5px]">
              {/* Signal bars */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="0.8" fill="#221B17" opacity="0.25" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill="#221B17" opacity="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.8" fill="#221B17" opacity="0.75" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="#221B17" />
              </svg>
              {/* Wi-Fi */}
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path d="M7.5 2.2C9.6 2.2 11.5 3.1 12.9 4.5L14 3.4C12.2 1.6 9.97 0.5 7.5 0.5C5.03 0.5 2.8 1.6 1 3.4L2.1 4.5C3.5 3.1 5.4 2.2 7.5 2.2Z" fill="#221B17" opacity="0.3"/>
                <path d="M7.5 5.1C8.9 5.1 10.2 5.7 11.1 6.6L12.2 5.5C11 4.3 9.34 3.5 7.5 3.5C5.66 3.5 4 4.3 2.8 5.5L3.9 6.6C4.8 5.7 6.1 5.1 7.5 5.1Z" fill="#221B17" opacity="0.65"/>
                <circle cx="7.5" cy="10.5" r="1.6" fill="#221B17"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center">
                <div
                  style={{
                    width: '23px', height: '11px',
                    border: '1.5px solid rgba(34,27,23,0.35)',
                    borderRadius: '3.5px', padding: '1.5px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <div style={{ width: '76%', height: '100%', background: '#221B17', borderRadius: '1.5px' }} />
                </div>
                <div style={{ width: '2px', height: '5px', background: 'rgba(34,27,23,0.35)', borderRadius: '0 1.5px 1.5px 0', marginLeft: '0.5px' }} />
              </div>
            </div>
          </div>

          {/* ── Invite content ── */}
          <div
            className="relative px-4 pb-4 text-center"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(217,164,65,0.2), transparent 55%), #FFF8F1',
            }}
          >
            <p className="pt-1 text-[7.5px] font-semibold uppercase tracking-[0.4em] text-[#B87924]">
              Wedding Invitation
            </p>

            <div className="flex items-center justify-center gap-2 mt-1.5 mb-1.5">
              <div className="h-px w-7" style={{ background: 'linear-gradient(90deg,transparent,rgba(184,121,36,0.4))' }} />
              <span style={{ color: 'rgba(184,121,36,0.55)', fontSize: '7px' }}>✦</span>
              <div className="h-px w-7" style={{ background: 'linear-gradient(270deg,transparent,rgba(184,121,36,0.4))' }} />
            </div>

            <h2 className="font-display font-light leading-[0.9] text-[#221B17]" style={{ fontSize: '2.1rem' }}>
              Ananya
            </h2>
            <p className="font-script" style={{ fontSize: '1.55rem', color: '#D9A441', lineHeight: 1.05 }}>
              &amp;
            </p>
            <h2 className="font-display font-light leading-[0.9] text-[#221B17]" style={{ fontSize: '2.1rem' }}>
              Vihaan
            </h2>

            <p className="mx-auto mt-2 max-w-[185px] text-[9px] leading-[1.55] text-[#7E716B]">
              Together with our families, we invite you to celebrate our new beginning.
            </p>

            <RunningTimer />

            <div className="mt-2 rounded-xl border border-[#D9A441]/20 bg-white/80 p-2.5 text-left">
              <p className="text-[7px] font-semibold uppercase tracking-[0.24em] text-[#B87924]">Venue</p>
              <p className="mt-0.5 font-heading text-[11px] font-semibold text-[#221B17]">The Royal Orchid</p>
              <p className="text-[8.5px] leading-[1.4] text-[#7E716B]">Bengaluru, Karnataka</p>
            </div>

            <div
              className="mt-2 rounded-xl py-2 text-[9.5px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)' }}
            >
              Open Google Maps ↗
            </div>

            <p className="mt-2 text-[6.5px] font-semibold uppercase tracking-[0.24em] text-[#B87924]/45">
              Gallery · Music · Wishes
            </p>
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ height: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '88px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Physical buttons — mute, vol+, vol- on left; power on right */}
      <div style={{ position: 'absolute', left: '-3px', top: '78px',  width: '3px', height: '24px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: '-3px', top: '114px', width: '3px', height: '40px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: '-3px', top: '164px', width: '3px', height: '40px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', right: '-3px', top: '120px', width: '3px', height: '60px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '0 2px 2px 0', boxShadow: '1px 0 1px rgba(255,255,255,0.06)' }} />
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Invitely',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    url: 'https://invitely.in',
    description:
      'Create a beautiful digital invitation website for Indian weddings, birthdays, house warming ceremonies, naming ceremonies, engagements, and anniversaries. Features gallery, music, live countdown, Google Maps, WhatsApp sharing, and guest wishes.',
    keywords:
      'digital invitation website India, wedding invitation website, birthday e-invite, house warming invitation, naming ceremony invite, WhatsApp invitation link',
    featureList: [
      'Mobile-first invitation website',
      'Live countdown timer',
      'Photo gallery',
      'Background music',
      'Google Maps integration',
      'WhatsApp sharing',
      'Guest wishes',
      'RSVP',
    ],
    offers: PLANS.map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} Digital Invitation Plan`,
      price: String(plan.price),
      priceCurrency: 'INR',
    })),
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link
            href="/"
            className="font-display text-2xl text-ink tracking-wide"
            aria-label="Invitely home"
          >
            Invitely
          </Link>
          <nav
            className="hidden items-center gap-8 text-sm text-muted sm:flex"
            aria-label="Main navigation"
          >
            <a href="#templates" className="transition-colors hover:text-foreground">
              Templates
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">
            Start Free
          </Link>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        aria-labelledby="hero-headline"
        className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-12 pb-10 sm:pt-20 sm:pb-14 lg:min-h-[calc(100dvh-4rem)] lg:flex lg:flex-col"
      >
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(250,232,202,0.35),transparent_22%),radial-gradient(circle_at_88%_16%,rgba(217,164,65,0.16),transparent_26%),radial-gradient(circle_at_50%_108%,rgba(255,255,255,0.96),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl w-full lg:flex-1 lg:flex lg:flex-col lg:justify-between lg:py-14">
          {/* ── Two-column grid: copy left, phone right ── */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">

            {/* ── Left column: all copy ── */}
            <div className="flex flex-col items-start">

              {/* Trust badge */}
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#D9A441]/35 bg-white/80 px-4 py-2 shadow-card">
                <StarRating />
                <span className="text-xs font-semibold text-accent-strong">
                  Trusted for Indian Weddings &amp; Events
                </span>
              </div>

              {/* ── HEADLINE ── */}
              <h1 id="hero-headline" className="font-display font-light leading-[1.08] text-ink">
                <span
                  className="block whitespace-nowrap"
                  style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}
                >
                  Beautiful digital invites,
                </span>
                <span
                  className="block gradient-accent font-normal italic whitespace-nowrap mt-1"
                  style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}
                >
                  crafted for India.
                </span>
              </h1>

              {/* Sub-copy — keyword-rich, natural sentence */}
              <p className="mt-4 max-w-[480px] text-sm leading-[1.85] text-muted sm:text-base">
                Create a stunning digital invitation website for your Indian wedding, birthday,
                house warming, naming ceremony, or engagement — with gallery, music, live
                countdown, Google Maps, and WhatsApp sharing. Ready in 5 minutes.
              </p>

              {/* CTA row */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#B87924] to-[#D9A441] px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(184,121,36,0.22)] transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2"
                  aria-label="Create your free digital invitation website"
                >
                  Create Free Invitation
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full border border-[#D9A441]/25 bg-white px-8 py-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-[#D9A441]/50"
                >
                  View Pricing →
                </a>
              </div>

              {/* ── Stats row ── */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                {[
                  { value: '₹0', label: 'to start' },
                  { value: '5 min', label: 'setup' },
                  { value: 'WhatsApp', label: 'ready' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex-1 rounded-3xl border border-[#D9A441]/20 bg-white/95 px-5 py-4 text-center shadow-sm"
                  >
                    <p className="font-heading text-[1.55rem] font-bold text-ink tabular-nums sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Proof chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  'No app required',
                  '8 event templates',
                  'Free to start',
                  'Built for India',
                ].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right column: phone mockup ── */}
            <div className="flex items-center justify-center lg:justify-end">
              <PhonePreview />
            </div>
          </div>

          {/* ── Scroll nudge — always visible at hero bottom on desktop ── */}
          <div className="mt-10 lg:mt-0 flex flex-col items-center gap-3">
            <div className="h-px w-20 bg-[#D9A441]/25" />
            <div className="flex items-center gap-2 rounded-full border border-[#D9A441]/15 bg-white px-5 py-3 text-[#B87924] shadow-card">
              <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                Scroll to explore
              </span>
              <svg
                className="h-4 w-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EVENT TYPES STRIP ─── */}
      <section className="border-y border-border bg-white px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
            Works for every family occasion
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {eventTypes.map((event) => (
              <div
                key={event}
                className="rounded-2xl border border-border bg-background px-4 py-4 text-center text-sm font-semibold text-foreground shadow-sm transition-shadow hover:shadow-card"
              >
                {event}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section id="templates" className="relative overflow-hidden px-5 py-20 sm:py-28">
        {/* Subtle warm section tint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF5EE]/70 via-transparent to-[#FAF5EE]/50" />

        <div className="relative mx-auto max-w-7xl">

          {/* ── Section header ── */}
          <div className="mb-16 text-center">
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D9A441]/45" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-accent-strong">
                8 stunning templates
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D9A441]/45" />
            </div>
            <h2 className="font-display font-normal text-4xl text-ink sm:text-5xl">
              Choose your invitation style.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted text-balance">
              From timeless ivory weddings to vibrant Indian ceremonies — every template is
              fully customisable with your photos, music, and personal message.
            </p>
          </div>

          {/* ── Featured 2 showcase cards ── */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">

            {/* Elegant Wedding */}
            <article className="group overflow-hidden rounded-3xl border border-[#E8DCCD] bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-md">
              {/* Top accent line */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D9A441, transparent)' }} />

              <div
                className="relative overflow-hidden px-8 py-14 text-center"
                style={{ background: 'linear-gradient(180deg,#FFF8F1 0%,#FBF5EE 100%)' }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%,rgba(217,164,65,0.22),transparent 65%)' }}
                />
                {/* Most Popular badge */}
                <div className="absolute right-5 top-5">
                  <span
                    className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                    style={{ background: 'rgba(47,118,109,0.1)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.22)' }}
                  >
                    Most Popular
                  </span>
                </div>
                <div className="relative">
                  <p className="mb-4 text-[8.5px] uppercase tracking-[0.44em]" style={{ color: '#B87924' }}>
                    Wedding Invitation
                  </p>
                  <h3 className="font-display font-light text-5xl leading-tight" style={{ color: '#221B17' }}>
                    Ananya
                  </h3>
                  <p className="font-script text-4xl my-1" style={{ color: '#D9A441' }}>&amp;</p>
                  <h3 className="font-display font-light text-5xl leading-tight" style={{ color: '#221B17' }}>
                    Vihaan
                  </h3>
                  <div className="my-5 flex items-center justify-center gap-3">
                    <div className="h-px w-14" style={{ background: 'linear-gradient(90deg,transparent,rgba(184,121,36,0.45))' }} />
                    <span style={{ color: 'rgba(184,121,36,0.65)', fontSize: '10px' }}>✦</span>
                    <div className="h-px w-14" style={{ background: 'linear-gradient(270deg,transparent,rgba(184,121,36,0.45))' }} />
                  </div>
                  <p className="text-xs tracking-widest" style={{ color: '#7E716B' }}>Saturday, 12 April 2025</p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium"
                    style={{ background: 'rgba(217,164,65,0.12)', border: '1px solid rgba(184,121,36,0.25)', color: '#B87924' }}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    The Royal Orchid · Bengaluru
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#EDE0CE] bg-white px-7 py-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <p className="font-heading text-[1.1rem] font-semibold text-ink">Elegant Wedding</p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: 'rgba(47,118,109,0.1)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.25)' }}
                    >
                      Free
                    </span>
                  </div>
                  <p className="text-sm text-muted">Warm ivory &amp; gold — timeless romance</p>
                </div>
                <Link
                  href="/create"
                  className="gold-button shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  Use this →
                </Link>
              </div>
            </article>

            {/* Cinematic Night */}
            <article
              className="group overflow-hidden rounded-3xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-md"
              style={{ border: '1px solid rgba(201,168,76,0.25)', background: '#0A0A12' }}
            >
              {/* Top accent line */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)' }} />

              <div className="relative overflow-hidden px-8 py-14 text-center" style={{ background: '#08080F' }}>
                {[...Array(26)].map((_, i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute rounded-full bg-white"
                    style={{
                      opacity: 0.25 + (i % 4) * 0.15,
                      width: i % 5 === 0 ? 2 : 1,
                      height: i % 5 === 0 ? 2 : 1,
                      left: `${(i * 17 + 7) % 90 + 5}%`,
                      top: `${(i * 23 + 8) % 82 + 9}%`,
                    }}
                  />
                ))}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 35%,rgba(201,168,76,0.09),transparent)' }}
                />
                <div className="relative">
                  <p className="mb-4 text-[8.5px] uppercase tracking-[0.5em]" style={{ color: 'rgba(201,168,76,0.65)' }}>
                    Wedding Invitation
                  </p>
                  <h3 className="font-display font-light text-5xl leading-tight" style={{ color: '#F2EEE6' }}>Ananya</h3>
                  <p className="font-script text-4xl my-1" style={{ color: '#C9A84C' }}>&amp;</p>
                  <h3 className="font-display font-light text-5xl leading-tight" style={{ color: '#F2EEE6' }}>Vihaan</h3>
                  <div className="my-5 flex items-center justify-center gap-3">
                    <div className="h-px w-14" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.55))' }} />
                    <span style={{ color: '#C9A84C', fontSize: '10px' }}>✦</span>
                    <div className="h-px w-14" style={{ background: 'linear-gradient(270deg,transparent,rgba(201,168,76,0.55))' }} />
                  </div>
                  <p className="text-xs tracking-widest" style={{ color: 'rgba(242,238,230,0.4)' }}>Saturday, 12 April 2025</p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.22)', color: '#C9A84C' }}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    The Imperial Ballroom · Mumbai
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between gap-4 border-t px-7 py-5"
                style={{ background: '#0E0E17', borderColor: 'rgba(201,168,76,0.18)' }}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <p className="font-heading text-[1.1rem] font-semibold" style={{ color: '#F2EEE6' }}>Cinematic Night</p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: 'rgba(184,121,36,0.14)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
                    >
                      Standard
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(242,238,230,0.42)' }}>Dark &amp; dramatic — bold film-noir</p>
                </div>
                <Link
                  href="/create"
                  className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.35)', color: '#C9A84C' }}
                >
                  Use this →
                </Link>
              </div>
            </article>
          </div>

          {/* ── Decorative divider ── */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #E8DCCD)' }} />
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-white px-5 py-2.5 shadow-sm">
              <span className="text-[#D9A441]/70 text-[10px]">✦</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                6 more event templates
              </p>
              <span className="text-[#D9A441]/70 text-[10px]">✦</span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, #E8DCCD)' }} />
          </div>

          {/* ── 6 compact templates ── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPACT_TEMPLATES.map((tpl) => (
              <article
                key={tpl.id}
                className="group overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-md"
                style={{ border: `1px solid ${tpl.border}` }}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${tpl.accent}80, transparent)` }} />

                {/* Preview */}
                <div
                  className="relative overflow-hidden px-6 py-10 text-center"
                  style={{ background: tpl.bg }}
                >
                  <div className="pointer-events-none absolute inset-0" style={{ background: tpl.glow }} />
                  <div className="relative">
                    <p className="mb-2 text-[7.5px] uppercase tracking-[0.44em]" style={{ color: tpl.labelColor }}>
                      {tpl.eventType}
                    </p>
                    <h3
                      className="font-display font-light text-[1.7rem] italic leading-tight"
                      style={{ color: tpl.nameColor }}
                    >
                      {tpl.sampleName}
                    </h3>
                    <p className="font-script text-xl mt-1" style={{ color: tpl.accent }}>
                      {tpl.sampleSub}
                    </p>
                    <div
                      className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[8.5px] font-medium"
                      style={{ background: `${tpl.accent}18`, border: `1px solid ${tpl.accent}35`, color: tpl.accent }}
                    >
                      <svg className="h-2.5 w-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {tpl.sampleVenue}
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div
                  className="px-5 py-4"
                  style={{ background: tpl.footerBg, borderTop: `1px solid ${tpl.border}` }}
                >
                  {/* Name row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-display text-[1.05rem] italic leading-snug truncate"
                        style={{ color: tpl.titleColor }}
                      >
                        {tpl.name}
                      </p>
                      <p className="mt-0.5 text-[11px] truncate" style={{ color: tpl.subColor }}>
                        {tpl.tagline}
                      </p>
                    </div>
                    <span
                      className="shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em]"
                      style={{ background: tpl.plan.bg, color: tpl.plan.color, border: tpl.plan.border }}
                    >
                      {tpl.plan.label}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/create"
                    className="mt-3.5 flex w-full items-center justify-center rounded-xl py-2.5 text-[11.5px] font-semibold transition-all hover:opacity-85"
                    style={{
                      background: `${tpl.accent}20`,
                      border: `1px solid ${tpl.accent}40`,
                      color: tpl.accent,
                    }}
                  >
                    Use this template →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-12 text-center">
            <Link
              href="/create"
              className="gold-button inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
            >
              Start with any template — free
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="mt-3 text-xs text-muted">No credit card required · Live in 5 minutes</p>
          </div>

        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              What&apos;s included
            </p>
            <h2 className="font-display font-normal text-4xl text-ink sm:text-5xl">
              Everything guests need on one beautiful page.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted text-balance">
              A premium invite should do more than show date and venue. It should guide guests,
              create excitement, and make sharing effortless.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group luxury-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-md"
              >
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-accent-strong"
                  style={{ background: 'rgba(217,164,65,0.12)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-y border-border bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              What families say
            </p>
            <h2 className="font-display font-normal text-4xl text-ink sm:text-5xl">
              Loved by families across India.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-card"
              >
                {/* Decorative background quote mark */}
                <div
                  className="pointer-events-none absolute right-5 top-4 select-none font-display text-[7rem] leading-none text-[#D9A441]/10"
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Stars + date */}
                <div className="flex items-center justify-between mb-5">
                  <StarRating />
                  <span className="text-[11px] text-muted">{t.date}</span>
                </div>

                {/* Quote */}
                <p className="relative flex-1 text-sm leading-[1.9] text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Divider */}
                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-[#D9A441]/30 ring-offset-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-ink truncate">{t.name}</p>
                        {/* Verified badge */}
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-[#2F766D]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-label="Verified"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.498 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-muted">{t.event}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
                Simple 3-step setup
              </p>
              <h2 className="font-display font-normal text-4xl text-ink sm:text-5xl">
                Live invite in under 5 minutes.
              </h2>
            </div>
            <Link
              href="/create"
              className="gold-button mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold lg:mt-0"
            >
              Try it now →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ['01', 'Add event details', 'Enter names, date, venue, ceremony schedule, map link, and a personal message.'],
              ['02', 'Preview instantly', 'See your invitation website come to life in real time as you fill in each field.'],
              ['03', 'Share on WhatsApp', 'Get a unique link and send it directly to guests. No app download needed.'],
            ].map(([step, title, copy]) => (
              <article
                key={step}
                className="relative rounded-2xl border border-border bg-white p-7 shadow-card"
              >
                <p className="font-heading text-5xl text-accent/60">{step}</p>
                <h3 className="mt-5 font-heading text-xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* ─── DARK CTA BAND ─── */}
      <section className="bg-[#221B17] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Organic growth built in
            </p>
            <h2 className="font-display font-normal text-4xl text-white sm:text-5xl">
              Every invite brings your next customer.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/65">
              Each invitation carries a subtle footer CTA for guests to create their own.
              One wedding invite seen by 500 guests can generate future birthday, engagement,
              and house warming customers — automatically.
            </p>
            <Link
              href="/create"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-ink"
            >
              Start building for free
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              Example
            </p>
            <p className="mt-5 font-display font-normal text-3xl text-white">
              500 guests see your invite
            </p>
            <div className="mt-6 space-y-3">
              {[
                ['~50 guests', 'click "Get Directions"'],
                ['~20 guests', 'leave a wish on the page'],
                ['~5–10 guests', 'explore creating their own'],
              ].map(([num, action]) => (
                <div key={num} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#D9A441]">{num}</span>
                  <span className="text-sm text-white/60">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              FAQ
            </p>
            <h2 className="font-display font-normal text-4xl text-ink sm:text-5xl">
              Questions before you start.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">
              Everything you need to know about creating your first digital invitation.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-5 pb-20">
        <div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-card-md sm:px-16 sm:py-20"
          style={{
            background: 'linear-gradient(135deg, #221B17 0%, #3D2A1A 50%, #221B17 100%)',
          }}
        >
          {/* Decorative rings */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
            aria-hidden
          >
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9A441]/25" />
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9A441]/20" />
            <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9A441]/15" />
          </div>
          <p className="relative mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Start today
          </p>
          <h2 className="relative mx-auto max-w-2xl font-display font-light text-4xl sm:text-5xl">
            Build your first premium invitation website in minutes.
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60">
            Free to create. Beautiful to share. Loved by guests.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="gold-button w-full rounded-xl px-8 py-4 text-sm font-semibold sm:w-auto"
            >
              Create Digital Invitation
            </Link>
            <a
              href="#pricing"
              className="w-full rounded-xl border border-white/20 bg-white/8 px-8 py-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/12 sm:w-auto"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-display text-2xl text-ink tracking-wide">Invitely</p>
            <p className="mt-1 text-sm text-muted">
              Digital invitation websites for Indian weddings and events.
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-muted" aria-label="Footer navigation">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link href="/create" className="hover:text-foreground transition-colors">
              Create
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Invitely · Free digital invitation website builder for India
        </div>
      </footer>
    </main>
  )
}