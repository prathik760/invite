import type { Metadata } from 'next'
import Link from 'next/link'
import PricingSection from '@/components/landing/PricingSection'
import FAQAccordion from '@/components/landing/FAQAccordion'
import CustomRequestSection from '@/components/landing/CustomRequestSection'
import MobileNav from '@/components/landing/MobileNav'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import { PLANS } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
  description:
    'Create stunning digital wedding invitations, birthday invitations, engagement invitations, and event invites. Share instantly on WhatsApp with RSVP tracking.',
  keywords: [
    'digital invitation website India',
    'free wedding invitation website India',
    'online wedding invitation maker India',
    'Indian wedding e-invite',
    'WhatsApp wedding invitation link',
    'digital birthday invitation India',
    'house warming invitation website India',
    'namakaran invitation online',
    'engagement invitation website India',
    'digital wedding card India',
    'free online invitation maker India',
    'mobile invitation website India',
    'wedding invitation website free',
    'digital invitation card WhatsApp share',
    'anniversary invitation website India',
    'griha pravesh invitation online',
    'Indian wedding website builder',
    'Bangalore wedding invitation online',
    'Mumbai wedding invitation website',
    'Delhi wedding invitation website',
    'Chennai wedding invitation website',
    'Hyderabad wedding invitation online',
  ],
  openGraph: {
    title: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
    description:
      'Create stunning digital wedding invitations, birthday invitations, engagement invitations, and event invites. Share instantly on WhatsApp with RSVP tracking.',
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in',
    images: [{ url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'}/opengraph-image`, width: 1200, height: 630, alt: 'ShareInvite digital invitation maker' }],
  },
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, ''),
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
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(122,62,74,0.32), transparent 68%)' }}
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
          className="relative flex flex-col overflow-hidden"
          style={{ borderRadius: '2rem', height: '520px', background: '#180A10' }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2"
            style={{
              top: '11px', width: '90px', height: '27px',
              background: '#000', borderRadius: '50px',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a1a1a', boxShadow: 'inset 0 0 0 2px #0a0a0a' }}
            />
          </div>

          {/* Status bar */}
          <div
            className="relative flex flex-shrink-0 items-center justify-between px-5"
            style={{ height: '48px' }}
          >
            <span className="text-[10px] font-semibold text-white/70" style={{ letterSpacing: '-0.02em' }}>9:41</span>
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="0.8" fill="white" opacity="0.3" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill="white" opacity="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.8" fill="white" opacity="0.75" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="white" />
              </svg>
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path d="M7.5 2.2C9.6 2.2 11.5 3.1 12.9 4.5L14 3.4C12.2 1.6 9.97 0.5 7.5 0.5C5.03 0.5 2.8 1.6 1 3.4L2.1 4.5C3.5 3.1 5.4 2.2 7.5 2.2Z" fill="white" opacity="0.35" />
                <path d="M7.5 5.1C8.9 5.1 10.2 5.7 11.1 6.6L12.2 5.5C11 4.3 9.34 3.5 7.5 3.5C5.66 3.5 4 4.3 2.8 5.5L3.9 6.6C4.8 5.7 6.1 5.1 7.5 5.1Z" fill="white" opacity="0.65" />
                <circle cx="7.5" cy="10.5" r="1.6" fill="white" />
              </svg>
              <div className="flex items-center">
                <div style={{ width: '23px', height: '11px', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '3.5px', padding: '1.5px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '76%', height: '100%', background: 'white', borderRadius: '1.5px' }} />
                </div>
                <div style={{ width: '2px', height: '5px', background: 'rgba(255,255,255,0.35)', borderRadius: '0 1.5px 1.5px 0', marginLeft: '0.5px' }} />
              </div>
            </div>
          </div>

          {/* ── Luxury invite content ── */}
          <div
            className="relative flex min-h-0 flex-1 flex-col text-center"
            style={{ background: 'linear-gradient(180deg,#280B18 0%,#160810 50%,#0D0508 100%)' }}
          >
            {/* ── TOP SECTION: Names + date ── */}
            <div className="px-5 pt-3">
              {/* Ornament */}
              <div className="flex items-center justify-center">
                <svg width="130" height="16" viewBox="0 0 130 16" fill="none">
                  <line x1="0" y1="8" x2="44" y2="8" stroke="url(#pp-gl)" strokeWidth="0.7" />
                  <rect x="61" y="4" width="8" height="8" rx="1" stroke="#C9993C" strokeWidth="0.8" opacity="0.55" transform="rotate(45 65 8)" />
                  <circle cx="65" cy="8" r="1.8" fill="#C9993C" opacity="0.5" />
                  <line x1="86" y1="8" x2="130" y2="8" stroke="url(#pp-gr)" strokeWidth="0.7" />
                  <defs>
                    <linearGradient id="pp-gl" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                      <stop offset="0%" stopColor="#C9993C" stopOpacity="0" />
                      <stop offset="100%" stopColor="#C9993C" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="pp-gr" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                      <stop offset="0%" stopColor="#C9993C" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#C9993C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-[0.6em]" style={{ color: '#C9993C', opacity: 0.65 }}>
                Wedding Invitation
              </p>

              {/* Couple names — large and commanding */}
              <p className="mt-2 font-display font-normal" style={{ fontSize: '2.35rem', lineHeight: 0.87, color: '#FAF3EB', textShadow: '0 2px 32px rgba(201,153,60,0.22), 0 0 64px rgba(201,153,60,0.1)' }}>
                Ananya
              </p>
              <p className="font-script" style={{ fontSize: '1.7rem', color: '#C9993C', lineHeight: 1.05, filter: 'drop-shadow(0 0 8px rgba(201,153,60,0.4))' }}>&amp;</p>
              <p className="font-display font-normal" style={{ fontSize: '2.35rem', lineHeight: 0.87, color: '#FAF3EB', textShadow: '0 2px 32px rgba(201,153,60,0.22), 0 0 64px rgba(201,153,60,0.1)' }}>
                Vihaan
              </p>

              <p className="mt-2 text-[7px] italic" style={{ color: 'rgba(250,243,235,0.3)', letterSpacing: '0.03em' }}>
                Together with their families
              </p>

              {/* Date pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5" style={{ background: 'rgba(201,153,60,0.1)', border: '1px solid rgba(201,153,60,0.32)' }}>
                <svg className="h-2.5 w-2.5 shrink-0" fill="none" stroke="#C9993C" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-[7.5px] font-semibold tracking-[0.14em]" style={{ color: '#C9993C' }}>12 APR 2025 · 7:00 PM</span>
              </div>
            </div>

            {/* ── MIDDLE SECTION: Venue + Schedule ── */}
            <div className="mt-3 px-4">
              {/* Section separator */}
              <div className="mb-2.5 flex items-center gap-2">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,153,60,0.3))' }} />
                <div className="h-1 w-1 rounded-full" style={{ background: '#C9993C', opacity: 0.4 }} />
                <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,transparent,rgba(201,153,60,0.3))' }} />
              </div>

              {/* Venue */}
              <div className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left" style={{ background: 'rgba(201,153,60,0.07)', border: '1px solid rgba(201,153,60,0.2)' }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(201,153,60,0.14)', border: '1px solid rgba(201,153,60,0.25)' }}>
                  <svg width="12" height="12" fill="none" stroke="#C9993C" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold leading-tight" style={{ color: '#FAF3EB' }}>The Royal Orchid</p>
                  <p className="text-[7.5px] leading-tight" style={{ color: 'rgba(250,243,235,0.4)' }}>Bengaluru, Karnataka</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="mt-2 rounded-2xl px-3 py-2.5 text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,153,60,0.14)' }}>
                <p className="text-[5.5px] font-semibold uppercase tracking-[0.45em]" style={{ color: 'rgba(201,153,60,0.55)' }}>Ceremony Schedule</p>
                <div className="mt-2 space-y-2">
                  {[
                    ['6:00 PM', 'Baraat & Varmala'],
                    ['7:30 PM', 'Saat Pheras'],
                    ['9:00 PM', 'Reception & Dinner'],
                  ].map(([time, event], i) => (
                    <div key={time} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? '#C9993C' : 'rgba(201,153,60,0.4)' }} />
                      </div>
                      <span className="text-[7.5px] font-bold tabular-nums" style={{ color: i === 0 ? '#C9993C' : 'rgba(201,153,60,0.65)', minWidth: '40px' }}>{time}</span>
                      <span className="text-[7.5px]" style={{ color: i === 0 ? 'rgba(250,243,235,0.85)' : 'rgba(250,243,235,0.5)' }}>{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flex spacer */}
            <div className="flex-1 min-h-[6px]" />

            {/* ── BOTTOM SECTION: Features + Buttons ── */}
            <div className="px-4 pb-3">
              {/* Features separator */}
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,153,60,0.22))' }} />
                <p className="text-[5px] font-semibold uppercase tracking-[0.4em]" style={{ color: 'rgba(201,153,60,0.4)' }}>Includes</p>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,transparent,rgba(201,153,60,0.22))' }} />
              </div>

              {/* Features grid — ABOVE buttons */}
              <div className="grid grid-cols-4 gap-1 mb-2.5">
                {[
                  { label: 'Gallery', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.7}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg> },
                  { label: 'Music', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg> },
                  { label: 'RSVP', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                  { label: 'Wishes', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex flex-col items-center rounded-xl py-2" style={{ background: 'rgba(201,153,60,0.07)', border: '1px solid rgba(201,153,60,0.2)' }}>
                    {icon}
                    <p className="mt-1 text-[6px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(201,153,60,0.65)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Maps button — BOTTOM */}
              <div
                className="rounded-2xl py-3 text-[9.5px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #7A3E4A 0%, #B88A44 100%)', boxShadow: '0 6px 24px rgba(122,62,74,0.45), inset 0 1px 0 rgba(255,255,255,0.12)' }}
              >
                Open Google Maps ↗
              </div>

              {/* WhatsApp button — BOTTOM */}
              <div
                className="mt-1.5 flex items-center justify-center gap-2 rounded-2xl py-2.5"
                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.22)' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#25a244">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <p className="text-[8.5px] font-semibold" style={{ color: '#2da14e' }}>Share on WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ height: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '88px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Physical buttons — mute, vol+, vol- on left; power on right */}
      <div style={{ position: 'absolute', left: '-3px', top: '78px', width: '3px', height: '24px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: '-3px', top: '114px', width: '3px', height: '40px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: '-3px', top: '164px', width: '3px', height: '40px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 1px rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', right: '-3px', top: '120px', width: '3px', height: '60px', background: 'linear-gradient(180deg,#48484A,#2C2C2E)', borderRadius: '0 2px 2px 0', boxShadow: '1px 0 1px rgba(255,255,255,0.06)' }} />
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ShareInvite',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    url: APP_URL,
    description:
      'Create a beautiful digital invitation website for Indian weddings, birthdays, house warming ceremonies, naming ceremonies, engagements, and anniversaries. Features gallery, music, live countdown, Google Maps, WhatsApp sharing, and guest wishes.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
      bestRating: '5',
    },
    offers: PLANS.map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} Digital Invitation Plan`,
      price: String(plan.price),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${APP_URL}/create`,
    })),
    featureList: [
      'Mobile-first invitation website',
      'Live countdown timer',
      'Photo gallery up to 20 images',
      'Background music player',
      'Google Maps integration',
      'WhatsApp sharing link',
      'Guest wishes collection',
      '10 beautiful Indian event templates',
      'Custom URL support',
    ],
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Meera Krishnamurthy' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'We shared the link on our wedding WhatsApp group and everyone loved it. The countdown and venue map made things so effortless for out-of-town guests.',
        datePublished: '2025-03-01',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Suresh Iyer' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Made our daughter\'s naming ceremony invite in under 10 minutes. No app downloads, no printing — just a beautiful link we forwarded to the whole family.',
        datePublished: '2025-02-01',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Pooja Mehta' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'The gold design matched our theme perfectly. Guests kept asking how we made it — it felt so premium compared to the usual card images shared on WhatsApp.',
        datePublished: '2025-01-01',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a digital invitation website?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A digital invitation website is a mobile-friendly event page guests open from a link — no app download needed. It includes event details, photos, live countdown, music, Google Maps directions, and guest wishes in one beautifully designed page they can save and revisit.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can guests open the invitation on WhatsApp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. ShareInvite creates a shareable link that works instantly on WhatsApp, Instagram DMs, email, and any mobile browser. Guests do not need to install any app — the invite opens in their phone browser in seconds.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is ShareInvite designed for Indian weddings and family events?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — 100%. Every template is designed for Indian event workflows: WhatsApp sharing, date/time/venue display, ceremony schedule, Google Maps link, dress code, and a personal message. We cover weddings, engagements, birthdays, Griha Pravesh, Namakaran, and anniversaries.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it free to create a digital wedding invitation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — creating and sharing the Elegant Wedding template is completely free forever. No credit card required. Premium templates with gallery, music, countdown, and more start at ₹499 as a one-time payment.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take to create a digital invitation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most invitations are ready to share in under 5 minutes. Choose a template, fill in names, date, venue, and message, then click Create. You get a unique link instantly — no design skills or app download needed.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use this for Indian weddings in Bangalore, Mumbai, Delhi or Chennai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. ShareInvite is used for weddings and family events across India — Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, and all other cities. The link works for guests anywhere in the world.',
        },
      },
    ],
  }

  const jsonLd = softwareSchema

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl relative">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            aria-label="ShareInvite home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="ShareInvite" className="h-9 w-auto" />
            <span className="font-display text-xl sm:text-2xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm text-muted sm:flex"
            aria-label="Main navigation"
          >
            <a href="#templates" className="transition-colors hover:text-foreground">Templates</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
            <a href="#custom-template" className="transition-colors hover:text-foreground">
              Custom
            </a>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/create" className="gold-button rounded-xl px-4 py-2.5 text-xs font-semibold sm:px-5 sm:py-2.5 sm:text-sm">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        aria-labelledby="hero-headline"
        className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#FCF7F1] px-5 pt-12 pb-6 sm:pt-20 sm:pb-10 lg:min-h-[calc(100dvh-4rem)]"
      >
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(250,232,202,0.35),transparent_22%),radial-gradient(circle_at_88%_16%,rgba(217,164,65,0.16),transparent_26%),radial-gradient(circle_at_50%_108%,rgba(255,255,255,0.96),transparent_40%)]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between py-8 lg:py-14">
          {/* ── Two-column grid: copy left, phone right ── */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">

            {/* ── Left column: all copy ── */}
            <div className="flex flex-col items-start">

              {/* Trust badge */}
              <div className="hero-anim-3 mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#D9A441]/35 bg-white/80 px-4 py-2 shadow-card">
                <StarRating />
                <span className="text-xs font-semibold text-accent-strong">
                  4.2 · 247+ families · Trusted across India
                </span>
              </div>

              {/* ── HEADLINE ── */}
              <h1 id="hero-headline" className="hero-anim-0 font-display font-normal leading-[1.08] text-ink">
                <span
                  className="block"
                  style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.4rem)' }}
                >
                  Beautiful digital invitations,
                </span>
                <span
                  className="block gradient-accent font-normal italic mt-1"
                  style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.4rem)' }}
                >
                  crafted for India.
                </span>
              </h1>

              {/* Sub-copy — keyword-rich, natural sentence */}
              <p className="hero-anim-1 mt-4 max-w-[480px] text-sm leading-[1.85] text-muted sm:text-base">
                Create beautiful digital invitations, crafted for Indian weddings, birthdays,
                engagements, house warming and naming ceremonies. Share a WhatsApp link with
                gallery, music, live countdown, Google Maps, and online RSVP. Ready in 5 minutes.
              </p>

              {/* CTA row */}
              <div className="hero-anim-2 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/create"
                  className="gold-button inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label="Create your free digital invitation website"
                >
                  Create Free Invitation
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border px-8 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
                  style={{ borderColor: 'rgba(122,62,74,0.4)', color: '#7A3E4A', background: 'rgba(122,62,74,0.05)' }}
                >
                  See pricing
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
              <p className="mt-2 text-[11px] text-muted">No credit card required · Free forever plan available</p>

              {/* ── Stats row ── */}
              <div className="mt-7 flex items-stretch gap-3">
                {/* Free to start */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white/95 px-3 py-3.5 text-center shadow-sm sm:px-5 sm:py-4">
                  <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#D9A441,transparent)' }} />
                  <div className="mb-2 flex justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-[#B87924]" style={{ background: 'rgba(184,121,36,0.10)' }}>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="font-heading text-lg font-bold text-ink sm:text-xl lg:text-2xl">₹0</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">Free to start</p>
                </div>

                {/* Quick setup */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white/95 px-3 py-3.5 text-center shadow-sm sm:px-5 sm:py-4">
                  <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#D9A441,transparent)' }} />
                  <div className="mb-2 flex justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-[#B87924]" style={{ background: 'rgba(184,121,36,0.10)' }}>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="font-heading text-lg font-bold text-ink sm:text-xl lg:text-2xl">5 min</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">Quick setup</p>
                </div>

                {/* WhatsApp ready */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white/95 px-3 py-3.5 text-center shadow-sm sm:px-5 sm:py-4">
                  <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#25D366,transparent)' }} />
                  <div className="mb-2 flex justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: 'rgba(37,211,102,0.10)', color: '#25a244' }}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                    </span>
                  </div>
                  <p className="font-heading text-lg font-bold text-ink sm:text-xl lg:text-2xl">10k+</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">Invites created</p>
                </div>
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

            {/* ── Mobile invitation preview card — shown only below lg ── */}
            <div className="hero-anim-4 lg:hidden mt-2">
              <div
                className="relative mx-auto overflow-hidden rounded-3xl max-w-sm"
                style={{ background: 'linear-gradient(180deg,#2C0D1A 0%,#180A10 60%,#0F0608 100%)', border: '1px solid rgba(201,153,60,0.22)', boxShadow: '0 20px 60px rgba(122,62,74,0.25)' }}
              >
                {/* Gold top accent line */}
                <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,#C9993C 40%,#C9993C 60%,transparent)' }} />

                <div className="relative overflow-hidden px-6 py-7 text-center">
                  {/* Radial glow */}
                  <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 50% at 50% 0%,rgba(122,62,74,0.35),transparent 65%)' }} />

                  <div className="relative">
                    {/* Top ornament */}
                    <div className="flex items-center justify-center">
                      <svg width="130" height="18" viewBox="0 0 130 18" fill="none">
                        <line x1="0" y1="9" x2="46" y2="9" stroke="url(#mc-gl)" strokeWidth="0.6" />
                        <circle cx="65" cy="9" r="4" stroke="#C9993C" strokeWidth="0.8" opacity="0.65" />
                        <circle cx="65" cy="9" r="1.8" fill="#C9993C" opacity="0.5" />
                        <circle cx="54" cy="9" r="1.8" stroke="#C9993C" strokeWidth="0.6" opacity="0.38" />
                        <circle cx="76" cy="9" r="1.8" stroke="#C9993C" strokeWidth="0.6" opacity="0.38" />
                        <line x1="84" y1="9" x2="130" y2="9" stroke="url(#mc-gr)" strokeWidth="0.6" />
                        <defs>
                          <linearGradient id="mc-gl" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                            <stop offset="0%" stopColor="#C9993C" stopOpacity="0" />
                            <stop offset="100%" stopColor="#C9993C" stopOpacity="0.6" />
                          </linearGradient>
                          <linearGradient id="mc-gr" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                            <stop offset="0%" stopColor="#C9993C" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#C9993C" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Label */}
                    <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.48em]" style={{ color: '#C9993C', opacity: 0.8 }}>Wedding Invitation</p>

                    {/* Couple names */}
                    <p className="mt-2.5 font-display font-normal leading-[0.9]" style={{ color: '#F5EEE6', fontSize: 'clamp(1.9rem,7vw,2.6rem)', textShadow: '0 0 32px rgba(201,153,60,0.28)' }}>Ananya</p>
                    <p className="font-script" style={{ fontSize: '2.1rem', color: '#C9993C', lineHeight: 0.95 }}>&amp;</p>
                    <p className="font-display font-normal leading-[0.9]" style={{ color: '#F5EEE6', fontSize: 'clamp(1.9rem,7vw,2.6rem)', textShadow: '0 0 32px rgba(201,153,60,0.28)' }}>Vihaan</p>

                    {/* Date & time pill */}
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: 'rgba(201,153,60,0.1)', border: '1px solid rgba(201,153,60,0.28)' }}>
                      <svg className="h-3 w-3 shrink-0" fill="none" stroke="#C9993C" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-[9px] font-semibold tracking-widest" style={{ color: '#C9993C' }}>Saturday, 12 April 2025 · 7:00 PM</span>
                    </div>

                    {/* Venue chip */}
                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,153,60,0.18)' }}>
                      <svg className="h-3 w-3 shrink-0" fill="none" stroke="#C9993C" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="text-[9.5px] font-medium" style={{ color: 'rgba(245,238,230,0.75)' }}>The Royal Orchid · Bengaluru</span>
                    </div>

                    {/* Ceremony schedule */}
                    <div className="mt-4 rounded-xl px-4 py-3 text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,153,60,0.14)' }}>
                      <p className="text-[7px] font-semibold uppercase tracking-[0.32em]" style={{ color: 'rgba(201,153,60,0.65)' }}>Ceremony Schedule</p>
                      <div className="mt-2 space-y-2">
                        {([
                          ['6:00 PM', 'Baraat & Varmala'],
                          ['7:30 PM', 'Saat Pheras'],
                          ['9:00 PM', 'Reception & Dinner'],
                        ] as [string, string][]).map(([time, event]) => (
                          <div key={time} className="flex items-center gap-2.5">
                            <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#C9993C', opacity: 0.6 }} />
                            <span className="text-[9.5px] font-semibold tabular-nums" style={{ color: '#C9993C', minWidth: '46px' }}>{time}</span>
                            <span className="text-[9.5px]" style={{ color: 'rgba(245,238,230,0.65)' }}>{event}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Google Maps button */}
                    <div
                      className="mt-3 rounded-xl py-3 text-[10.5px] font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #7A3E4A 0%, #B88A44 100%)', boxShadow: '0 6px 20px rgba(122,62,74,0.35)' }}
                    >
                      Open Google Maps ↗
                    </div>

                    {/* WhatsApp share row */}
                    <div
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5"
                      style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.18)' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#25a244">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <p className="text-[9.5px] font-semibold" style={{ color: '#2da14e' }}>Share on WhatsApp</p>
                    </div>

                    {/* Template features grid */}
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {['Gallery', 'Music', 'RSVP', 'Wishes'].map((label) => (
                        <div key={label} className="flex flex-col items-center rounded-xl py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,153,60,0.14)' }}>
                          {label === 'Gallery' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>}
                          {label === 'Music' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>}
                          {label === 'RSVP' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {label === 'Wishes' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9993C" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                          <p className="mt-1.5 text-[7px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'rgba(245,238,230,0.45)' }}>{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom ornament */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="h-px w-12" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,153,60,0.45))' }} />
                      <span style={{ color: 'rgba(201,153,60,0.4)', fontSize: '8px' }}>✦</span>
                      <div className="h-px w-12" style={{ background: 'linear-gradient(270deg,transparent,rgba(201,153,60,0.45))' }} />
                    </div>

                    {/* Footer badges */}
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                      <span className="rounded-full px-2.5 py-0.5 text-[8px] font-semibold" style={{ background: 'rgba(201,153,60,0.12)', color: '#C9993C', border: '1px solid rgba(201,153,60,0.25)' }}>Elegant Wedding</span>
                      <span className="rounded-full px-2.5 py-0.5 text-[8px] font-semibold" style={{ background: 'rgba(46,111,100,0.15)', color: '#4fa898', border: '1px solid rgba(46,111,100,0.3)' }}>Free</span>
                      <span className="rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em]" style={{ background: 'rgba(122,62,74,0.15)', color: '#C9993C', border: '1px solid rgba(122,62,74,0.28)' }}>Most Popular</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2.5 text-center text-xs text-muted">Your invitation will look like this ↑</p>
            </div>

            {/* ── Right column: phone mockup — desktop only (2-column layout) ── */}
            <div className="hero-anim-4 hidden lg:flex items-center justify-center">
              <PhonePreview />
            </div>
          </div>

          {/* ── Scroll nudge — pinned to hero bottom on all screen sizes ── */}
          <div className="mt-6 flex flex-col items-center gap-3">
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
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted" data-animate="fade">
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
          <div className="mb-16 text-center" data-animate>
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D9A441]/45" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-accent-strong">
                8 stunning templates
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D9A441]/45" />
            </div>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl">
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
                <div className="relative">
                  <p className="mb-4 text-[8.5px] uppercase tracking-[0.44em]" style={{ color: '#B87924' }}>
                    Wedding Invitation
                  </p>
                  <p className="font-display font-normal text-4xl sm:text-5xl leading-tight" style={{ color: '#221B17' }}>
                    Ananya
                  </p>
                  <p className="font-script text-4xl my-1" style={{ color: '#D9A441' }}>&amp;</p>
                  <p className="font-display font-normal text-4xl sm:text-5xl leading-tight" style={{ color: '#221B17' }}>
                    Vihaan
                  </p>
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
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <p className="font-heading text-[1.1rem] font-semibold text-ink">Elegant Wedding</p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: 'rgba(47,118,109,0.1)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.25)' }}
                    >
                      Free
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: 'rgba(122,62,74,0.08)', color: '#7A3E4A', border: '1px solid rgba(122,62,74,0.22)' }}
                    >
                      Most Popular
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
                  <p className="font-display font-normal text-4xl sm:text-5xl leading-tight" style={{ color: '#F2EEE6' }}>Ananya</p>
                  <p className="font-script text-4xl my-1" style={{ color: '#C9A84C' }}>&amp;</p>
                  <p className="font-display font-normal text-4xl sm:text-5xl leading-tight" style={{ color: '#F2EEE6' }}>Vihaan</p>
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
                    <p
                      className="font-display font-normal text-[1.7rem] italic leading-tight"
                      style={{ color: tpl.nameColor }}
                    >
                      {tpl.sampleName}
                    </p>
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
          <div className="mb-14 text-center" data-animate>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              What&apos;s included
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl">
              Everything guests need on one beautiful page.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted text-balance">
              A premium invite should do more than show date and venue. It should guide guests,
              create excitement, and make sharing effortless.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className="group luxury-panel hover-lift rounded-2xl p-6"
                data-animate
                data-delay={String(i + 1)}
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
          <div className="mb-14 text-center" data-animate>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              What families say
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl">
              Loved by families across India.
            </h2>
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#D9A441]/25 bg-white px-5 py-2.5 shadow-sm">
              <StarRating />
              <span className="text-sm font-semibold text-ink">4.2 out of 5</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-sm text-muted">247+ verified reviews</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <article
                key={t.name}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-card hover-lift"
                data-animate
                data-delay={String(i + 1)}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
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
          <div className="mb-14 lg:flex lg:items-end lg:justify-between" data-animate>
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
                Simple 3-step setup
              </p>
              <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl">
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
            ].map(([step, title, copy], i) => (
              <article
                key={step}
                className="relative rounded-2xl border border-border bg-white p-7 shadow-card hover-lift"
                data-animate
                data-delay={String(i + 1)}
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

      <CustomRequestSection />

      {/* ─── DARK CTA BAND ─── */}
      <section className="bg-[#221B17] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div data-animate="slide-left">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Organic growth built in
            </p>
            <h2 className="font-display font-normal text-3xl text-white sm:text-4xl lg:text-5xl">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7" data-animate="slide-right">
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
          <div className="mb-12 text-center" data-animate>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
              FAQ
            </p>
            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl">
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
          data-animate="scale"
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
          <h2 className="relative mx-auto max-w-2xl font-display font-normal text-3xl sm:text-4xl lg:text-5xl">
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
              className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-8 py-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.12] sm:w-auto"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      <StickyMobileCTA />

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-[#EFE5D8] px-5 py-14 pb-28 sm:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo1.png" alt="ShareInvite" className="h-9 w-auto" />
                <p className="font-display text-2xl text-ink tracking-wide">ShareInvite</p>
              </div>
              <p className="text-sm leading-6" style={{ color: '#4A3B35' }}>
                Beautiful digital invitation websites for Indian weddings, birthdays, and family events.
              </p>
              {/* Social icons */}
              <div className="mt-4 flex items-center gap-4">
                <a href="https://www.instagram.com/shareinvite.in" target="_blank" rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70" aria-label="Instagram" style={{ color: '#6B4E47' }}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/shareinvite.in" target="_blank" rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70" aria-label="Facebook" style={{ color: '#6B4E47' }}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://x.com/shareinvite" target="_blank" rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70" aria-label="X (Twitter)" style={{ color: '#6B4E47' }}>
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/@shareinvite" target="_blank" rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70" aria-label="YouTube" style={{ color: '#6B4E47' }}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex flex-col gap-2.5" aria-label="Footer quick links">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-1" style={{ color: '#B87924' }}>Quick Links</p>
              {[
                { href: '#features', label: 'Features', internal: false },
                { href: '#pricing', label: 'Pricing', internal: false },
                { href: '/templates', label: 'All Templates', internal: true },
                { href: '/create', label: 'Create Invite', internal: true },
                { href: '/dashboard', label: 'Dashboard', internal: true },
              ].map(link => (
                link.internal
                  ? <Link key={link.label} href={link.href} className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>{link.label}</Link>
                  : <a key={link.label} href={link.href} className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>{link.label}</a>
              ))}
            </nav>

            {/* Invitations */}
            <nav className="flex flex-col gap-2.5" aria-label="Footer invitations links">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-1" style={{ color: '#B87924' }}>Invitations</p>
              {[
                { href: '/wedding-invitation', label: 'Wedding Invitation' },
                { href: '/birthday-invitation', label: 'Birthday Invitation' },
                { href: '/digital-invitation', label: 'Digital Invitation' },
              ].map(link => (
                <Link key={link.label} href={link.href} className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>{link.label}</Link>
              ))}
            </nav>

            {/* Blog */}
            <nav className="flex flex-col gap-2.5" aria-label="Footer blog links">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-1" style={{ color: '#B87924' }}>Blog</p>
              <Link href="/blog" className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>All Articles</Link>
              <Link href="/blog/category/wedding" className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>Wedding Ideas</Link>
              <Link href="/blog/category/birthday" className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>Birthday Guides</Link>
              <Link href="/blog/category/digital-invitations" className="text-sm transition-colors hover:text-ink" style={{ color: '#5A4540' }}>Digital Invites</Link>
            </nav>
          </div>

          <div className="mt-10 border-t pt-6" style={{ borderColor: '#D4C4B4' }}>
            <p className="text-center text-xs" style={{ color: '#7A5A52' }}>
              © {new Date().getFullYear()} ShareInvite · Free digital invitation website builder for India
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
