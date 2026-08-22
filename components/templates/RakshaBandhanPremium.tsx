'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// RakshaBandhanPremium — a premium, festive Raksha Bandhan invitation template.
// Cream + gold + rose palette, marble-stage hero, scrapbook story, purple
// countdown, event timeline, gallery, wishes carousel, RSVP + gift sections.
// Follows the same architecture as the other ShareInvite templates:
//   props { data, eventId?, isPreview? }, data is a flat Record<string,string>,
//   guest interaction goes through the existing /api/wishes endpoint.
// ─────────────────────────────────────────────────────────────────────────────

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  cream: '#FCF4EB',        // warm blush cream (page bg)
  creamDeep: '#F6E7D6',
  paper: '#FFFDF9',
  ink: '#6B4A38',          // warm brown text
  inkSoft: 'rgba(107,74,56,0.72)',
  inkFaint: 'rgba(107,74,56,0.45)',
  gold: '#C79A3E',
  goldSoft: '#E3BC66',
  goldBorder: 'rgba(199,154,62,0.30)',
  rose: '#C35E77',         // rose headings
  roseDeep: '#AF4A64',     // rose buttons
  roseSoft: '#EBAAB9',
  roseBorder: 'rgba(195,94,119,0.22)',
  pinkBg: '#FBDBE3',       // soft pink sections
  pinkBgSoft: '#FCE7EC',
  purpleA: '#9C84BC',      // countdown gradient (lavender → pink)
  purpleB: '#CE8FA8',
  purpleC: '#E5AAA1',
  white: '#FFFFFF',
}

// Warm gold → bronze gradient used for the hero title (matches the design)
const TITLE_GRADIENT = 'linear-gradient(130deg, #E3BC66 0%, #C79A3E 45%, #A96A2B 100%)'

// ── Decorative: floating marigold petals ─────────────────────────────────────
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (i * 61) % 100,
  delay: (i % 8) * 1.4,
  dur: 12 + (i % 5) * 2.5,
  drift: ((i % 2 === 0 ? 1 : -1) * (24 + (i % 4) * 14)),
  size: 8 + (i % 4) * 4,
  color: i % 3 === 0 ? '#E39A4B' : i % 3 === 1 ? '#E7A9B8' : '#D4A24C',
}))

const FloatingPetals = memo(function FloatingPetals() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PETALS.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{ left: `${p.x}%`, top: -24, width: p.size, height: p.size, background: p.color, borderRadius: '50% 0 50% 0', opacity: 0.5 }}
          animate={{
            y: ['0vh', '112vh'],
            x: [0, p.drift, p.drift * 0.3, -p.drift * 0.4, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
})

// ── Decorative: hanging rakhi + lights string ────────────────────────────────
const HangingRakhis = memo(function HangingRakhis({ side }: { side: 'left' | 'right' }) {
  const reduced = useReducedMotion()
  const items = [0, 1, 2]
  return (
    <div
      className={`pointer-events-none absolute top-0 z-[3] hidden select-none sm:block ${side === 'left' ? 'left-2 md:left-6' : 'right-2 md:right-6'}`}
      aria-hidden
    >
      <div className="flex gap-3 md:gap-5">
        {items.map((i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            style={{ transformOrigin: 'top center' }}
            animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <div style={{ width: 1.5, height: 40 + i * 14, background: `linear-gradient(${C.gold},transparent)` }} />
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 34, height: 34,
                background: `radial-gradient(circle at 35% 30%, ${C.goldSoft}, ${C.roseDeep})`,
                boxShadow: `0 4px 14px rgba(158,43,78,0.35), 0 0 0 2px ${C.goldSoft}`,
              }}
            >
              <IconRakhi className="h-4 w-4" style={{ color: C.white }} />
            </div>
            <div style={{ width: 2, height: 18 + i * 6, background: `linear-gradient(${C.roseDeep},transparent)` }} />
          </motion.div>
        ))}
      </div>
    </div>
  )
})

// ── Utilities ────────────────────────────────────────────────────────────────
function parseList(v?: string): string[] {
  if (!v) return []
  return v.split(/\n/).map((s) => s.trim()).filter(Boolean)
}

interface TimelineItem { title: string; time: string; desc: string }
function parseTimeline(v?: string): TimelineItem[] {
  return parseList(v).map((line) => {
    const [title = '', time = '', desc = ''] = line.split('|').map((s) => s.trim())
    return { title, time, desc }
  }).filter((t) => t.title)
}

interface SampleWish { name: string; message: string }
function parseWishes(v?: string): SampleWish[] {
  return parseList(v).map((line) => {
    const [name = '', message = ''] = line.split('|').map((s) => s.trim())
    return { name, message }
  }).filter((w) => w.name && w.message)
}

function useCountdown(dateStr?: string, timeStr?: string) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    if (!dateStr) return
    const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`)
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dateStr, timeStr])
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    active: diff > 0,
  }
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.85, delay, ease: BEZIER },
  } as const
}

// Mount-based reveal (fires immediately) — used for the hero so it always shows,
// including inside the editor preview frame where whileInView may not trigger.
function heroIn(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: BEZIER },
  } as const
}

// ── Inline SVG icons (no emoji — clean, theme-coloured via currentColor) ──────
type IconProps = { className?: string; style?: React.CSSProperties }
const svgBase = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const IconRakhi = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="9" r="4" /><circle cx="12" cy="9" r="1.3" fill="currentColor" stroke="none" /><path d="M9.3 12.2 6.5 20M14.7 12.2 17.5 20" /></svg>
)
const IconSweet = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="4" /><path d="M8 12 3.5 9v6L8 12m8 0 4.5-3v6L16 12" /></svg>
)
const IconMeal = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M6 3v6a1.8 1.8 0 0 0 3.6 0V3M7.8 9v12" /><path d="M16.2 3c-1.4 0-2.4 1.6-2.4 4s1 4 2.4 4 2.4-1.6 2.4-4-1-4-2.4-4Zm0 8v10" /></svg>
)
const IconGiftBox = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M4.5 11h15v8.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" /><path d="M3.5 7.5h17V11h-17zM12 7.5v13" /><path d="M12 7.5S10.8 3.5 8.6 3.5 6.4 6.8 8.4 7.5h3.6Zm0 0s1.2-4 3.4-4 2.2 3.3.2 4H12Z" /></svg>
)
const IconCamera = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h1.8L8 5h8l1.2 2H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5z" /><circle cx="12" cy="12.5" r="3.2" /></svg>
)
const IconCalendar = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4m8-4v4" /></svg>
)
const IconPhotos = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m4 17 5-4 4 3 3-2 4 3" /></svg>
)
const IconDiya = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3.5 14.5c2 1.4 5 2.2 8.5 2.2s6.5-.8 8.5-2.2c-1.1-1.5-4.3-2.5-8.5-2.5s-7.4 1-8.5 2.5Z" /><path d="M12 12c1.1-1 1.4-2.3.6-3.6-.9 1-1.6 1.8-1.6 3" /></svg>
)
const IconHeart = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 21s-7-4.35-9.5-8.5C.6 9.3 2.2 5.6 5.6 5.6c2 0 3.2 1.2 4.4 2.8 1.2-1.6 2.4-2.8 4.4-2.8 3.4 0 5 3.7 3.1 6.9C19 16.65 12 21 12 21Z" /></svg>
)
/* Used only by the currently-disabled RSVP + gift section (see below):
const IconCoin = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="8" /><path d="M9.5 8h5M9.5 10.4h5M13.2 8c1.4 0 1.4 2.4 0 2.4h-2l3.3 3.6" /></svg>
)
const IconCopy = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>
)
const IconCheck = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="9" /><path d="m8.3 12 2.6 2.6L15.7 9" /></svg>
)
const IconSend = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M21.5 2.5 10.8 13.2M21.5 2.5 14.7 21.5l-3.9-8.3-8.3-3.9z" /></svg>
)
*/

const TIMELINE_ICONS = [IconRakhi, IconSweet, IconMeal, IconGiftBox, IconCamera]

const SHAREINVITE_URL = 'https://shareinvite.in'
const SHAREINVITE_LINKEDIN = 'https://www.linkedin.com/company/share-invite'
const SHAREINVITE_INSTAGRAM = 'https://www.instagram.com/shareinvite.in'

const SOCIAL_ICONS: { label: string; href: string; path: React.ReactNode }[] = [
  { label: 'Instagram', href: SHAREINVITE_INSTAGRAM, path: <path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.28.07 1.66.07 4.86s-.01 3.58-.07 4.86c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.68.07-4.9.07s-3.6-.01-4.9-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.12 15.6 2.11 15.2 2.11 12s.01-3.58.07-4.86C2.33 3.9 3.84 2.36 7.1 2.21 8.4 2.15 8.8 2.14 12 2.14zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zM12 16a4 4 0 114-4 4 4 0 01-4 4zm6.4-11.85a1.44 1.44 0 101.44 1.44 1.44 1.44 0 00-1.44-1.44z" /> },
  { label: 'LinkedIn', href: SHAREINVITE_LINKEDIN, path: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" /> },
]

/* Placeholder QR — used only by the currently-disabled gift section (see below):
const TINY_QR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23fff'/%3E%3Cg fill='%23161616'%3E%3Crect x='8' y='8' width='34' height='34'/%3E%3Crect x='16' y='16' width='18' height='18' fill='%23fff'/%3E%3Crect x='21' y='21' width='8' height='8' fill='%23161616'/%3E%3Crect x='78' y='8' width='34' height='34'/%3E%3Crect x='86' y='16' width='18' height='18' fill='%23fff'/%3E%3Crect x='91' y='21' width='8' height='8' fill='%23161616'/%3E%3Crect x='8' y='78' width='34' height='34'/%3E%3Crect x='16' y='86' width='18' height='18' fill='%23fff'/%3E%3Crect x='21' y='91' width='8' height='8' fill='%23161616'/%3E%3Crect x='52' y='10' width='8' height='8'/%3E%3Crect x='52' y='26' width='8' height='8'/%3E%3Crect x='52' y='42' width='8' height='8'/%3E%3Crect x='68' y='52' width='8' height='8'/%3E%3Crect x='52' y='60' width='8' height='8'/%3E%3Crect x='84' y='52' width='8' height='8'/%3E%3Crect x='100' y='60' width='8' height='8'/%3E%3Crect x='60' y='78' width='8' height='8'/%3E%3Crect x='76' y='84' width='8' height='8'/%3E%3Crect x='92' y='78' width='8' height='8'/%3E%3Crect x='60' y='100' width='8' height='8'/%3E%3Crect x='84' y='100' width='8' height='8'/%3E%3C/g%3E%3C/svg%3E"
*/

// ── Music button (floating) ──────────────────────────────────────────────────
const MusicButton = memo(function MusicButton({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    if (!src) return
    audioRef.current = new Audio(src)
    audioRef.current.loop = true
    return () => { audioRef.current?.pause(); audioRef.current = null }
  }, [src])
  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else a.play().then(() => setPlaying(true)).catch(() => { })
  }, [playing])
  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      style={{ background: C.white, border: `1px solid ${C.goldBorder}`, boxShadow: '0 6px 18px rgba(158,43,78,0.18)', color: C.rose }}
    >
      {playing
        ? <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        : <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>}
    </button>
  )
})

// ── Section eyebrow + heading ────────────────────────────────────────────────
function SectionHead({ title, className = '' }: { title: string; className?: string }) {
  return (
    <motion.div {...fadeUp()} className={`text-center ${className}`}>
      <div className="mb-3 flex items-center justify-center gap-3" aria-hidden>
        <span className="h-px w-10" style={{ background: `linear-gradient(90deg,transparent,${C.goldBorder})` }} />
        <span style={{ color: C.gold }}>✦</span>
        <span className="h-px w-10" style={{ background: `linear-gradient(270deg,transparent,${C.goldBorder})` }} />
      </div>
      <h2 className="font-heading" style={{ color: C.roseDeep, fontSize: 'clamp(1.5rem, 5vw, 2.4rem)' }}>{title}</h2>
    </motion.div>
  )
}

interface Props { data: Record<string, string>; eventId?: string; isPreview?: boolean }

export default function RakshaBandhanPremium({ data, eventId, isPreview = false }: Props) {
  const brother = data.brotherName || 'Rahul'
  const sister = data.sisterName || 'Priya'
  const tagline = data.tagline || 'Together Forever'
  const title = data.title || 'Raksha Bandhan'
  const subtitle = data.subtitle || 'Celebrating the Beautiful Bond of Love'

  const gallery = useMemo(() => parseList(data.galleryImages), [data.galleryImages])
  const timeline = useMemo(() => parseTimeline(data.timeline), [data.timeline])
  const sampleWishes = useMemo(() => parseWishes(data.sampleWishes), [data.sampleWishes])
  const storyLines = useMemo(() => parseList(data.story), [data.story])
  const { days, hours, minutes, seconds } = useCountdown(data.date, data.time)

  // The gift section is opt-in — it only appears if the host chooses to add
  // payment details, so bank/UPI info is never shown by default (privacy).
  const hasGift = Boolean(data.upiId || data.qrImage || data.bankAccountName || data.bankAccountNumber)

  const [lightbox, setLightbox] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Story', href: '#story' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Wishes', href: '#wishes' },
    { label: 'RSVP', href: '#rsvp' },
    ...(hasGift ? [{ label: 'Gift', href: '#gift' }] : []),
  ]

  return (
    <div
      id="home"
      className="relative overflow-x-hidden font-body"
      style={{ background: C.cream, color: C.ink }}
    >
      {/* ══════════════════════ NAVIGATION ══════════════════════ */}
      <nav
        className={`${isPreview ? 'relative' : 'sticky top-0'} z-40 flex items-center justify-between gap-3 px-4 py-2.5 sm:px-8`}
        style={{ background: 'rgba(252,244,235,0.88)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.goldBorder}` }}
      >
        <div className="flex items-center gap-2.5">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            style={{ color: C.rose, background: C.white, border: `1px solid ${C.roseBorder}` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <span className="font-heading text-lg italic sm:text-xl" style={{ color: C.rose }}>ShareInvite</span>
        </div>
        {/* Links — tablet & desktop (hidden in the compact editor preview) */}
        <div className={`${isPreview ? 'hidden' : 'hidden md:flex'} items-center gap-4 lg:gap-5`}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] font-medium transition-colors hover:opacity-70" style={{ color: C.ink }}>
              {l.label}
            </a>
          ))}
        </div>
        {data.musicUrl ? <MusicButton src={data.musicUrl} /> : <span className="h-9 w-9" />}

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="absolute inset-x-0 top-full grid grid-cols-2 gap-1 p-3 md:hidden"
              style={{ background: 'rgba(252,244,235,0.98)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.goldBorder}` }}
            >
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium"
                  style={{ color: C.ink, background: C.white, border: `1px solid ${C.roseBorder}` }}>
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        className={`relative overflow-hidden px-4 sm:px-8 ${isPreview ? 'py-10' : 'py-16 sm:py-20'}`}
        style={{ background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${C.creamDeep}, ${C.cream})` }}
      >
        {/* film-grain / paper texture */}
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }} />
        {!isPreview && <FloatingPetals />}
        {!isPreview && <HangingRakhis side="left" />}
        {!isPreview && <HangingRakhis side="right" />}

        <div className={`relative z-[5] mx-auto grid max-w-5xl items-center gap-8 ${isPreview ? '' : 'md:grid-cols-2'}`}>
          {/* Left — copy */}
          <div className="text-center md:text-left">
            <motion.p {...heroIn(0)} className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
              ✦ {tagline} ✦
            </motion.p>
            <motion.h1
              {...heroIn(0.08)}
              className="font-heading leading-[1.02]"
              style={{
                fontSize: isPreview ? '1.9rem' : 'clamp(2.3rem, 8.5vw, 4.6rem)',
                background: TITLE_GRADIENT,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}
            >
              {title}
            </motion.h1>
            <motion.p {...heroIn(0.16)} className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed md:mx-0" style={{ color: C.inkSoft }}>
              {subtitle}
            </motion.p>
            <motion.p {...heroIn(0.22)} className="mt-4 font-heading text-lg italic" style={{ color: C.rose }}>
              {sister} <span style={{ color: C.gold }}>&amp;</span> {brother}
            </motion.p>
            {data.date && (
              <motion.div {...heroIn(0.28)} className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2"
                style={{ background: C.white, border: `1px solid ${C.roseBorder}`, color: C.roseDeep }}>
                <IconCalendar className="h-4 w-4" style={{ color: C.gold }} />
                <span className="text-sm font-medium">{formatDate(data.date)}</span>
              </motion.div>
            )}
          </div>

          {/* Right — marble stage + sibling illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: BEZIER }}
            className="relative mx-auto w-full max-w-sm"
          >
            {/* royal arch */}
            <div className="relative overflow-hidden" style={{
              aspectRatio: '4/5',
              borderRadius: '48% 48% 12px 12px / 42% 42% 12px 12px',
              background: `linear-gradient(180deg, ${C.pinkBgSoft}, ${C.creamDeep})`,
              border: `2px solid ${C.goldBorder}`,
              boxShadow: `inset 0 0 40px rgba(194,150,46,0.16), 0 20px 50px rgba(158,43,78,0.14)`,
            }}>
              {/* soft glow */}
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 35%, rgba(224,182,90,0.28), transparent 60%)` }} />
              {data.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.heroImage} alt={`${sister} & ${brother}`} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
              ) : (
                // Placeholder festive scene (drop the real 3D illustration into data.heroImage)
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <IconPhotos className="h-12 w-12" style={{ color: C.roseSoft }} />
                  <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: C.inkFaint }}>Add your photo</p>
                </div>
              )}
            </div>
            {/* marble stage base */}
            <div className="mx-auto -mt-3 h-4 w-4/5 rounded-full" style={{ background: `linear-gradient(180deg, ${C.creamDeep}, #E4D2B8)`, boxShadow: '0 10px 20px rgba(158,43,78,0.12)' }} />
          </motion.div>
        </div>

        {!isPreview && (
          <motion.div animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="relative z-[5] mx-auto mt-8 flex w-8 justify-center" aria-hidden>
            <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 pt-1.5" style={{ borderColor: C.goldBorder }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.gold }} />
            </div>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════ OUR BOND (scrapbook) ══════════════════════ */}
      {(storyLines.length > 0 || gallery.length > 0) && (
        <section id="story" className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'}>
          <div className={`mx-auto grid max-w-5xl items-center gap-8 ${isPreview ? '' : 'md:grid-cols-2'}`}>
            <motion.div {...fadeUp()} className={`rounded-3xl ${isPreview ? 'p-5' : 'p-7 sm:p-9'}`} style={{ background: C.paper, border: `1px solid ${C.roseBorder}`, boxShadow: '0 16px 44px rgba(158,43,78,0.08)' }}>
              <h2 className="font-heading text-2xl sm:text-3xl" style={{ color: C.roseDeep }}>Our Bond</h2>
              <div className="mt-4 space-y-3">
                {(storyLines.length ? storyLines : ['A bond that ties our hearts together.']).map((line, i) => (
                  <p key={i} className="text-[14.5px] italic leading-relaxed" style={{ color: C.inkSoft }}>{line}</p>
                ))}
              </div>
              <a href="#gallery" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.roseDeep})`, boxShadow: '0 8px 22px rgba(158,43,78,0.28)' }}>
                Our Story →
              </a>
            </motion.div>

            {/* scrapbook collage */}
            <motion.div {...fadeUp(0.12)} className="relative rounded-3xl p-5" style={{ background: `linear-gradient(160deg, #FFFBF2, ${C.creamDeep})`, border: `1px solid ${C.goldBorder}`, boxShadow: '0 16px 44px rgba(158,43,78,0.10)' }}>
              <div className="grid grid-cols-2 gap-3">
                {(gallery.length ? gallery : ['', '', '', '']).slice(0, 4).map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-lg bg-white p-1.5 shadow-md" style={{ transform: `rotate(${[-3, 2, 2, -2][i]}deg)`, border: '1px solid rgba(0,0,0,0.05)' }}>
                    {src
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={src} alt={`Memory ${i + 1}`} className="h-28 w-full rounded object-cover sm:h-32" loading="lazy" />
                      : <div className="flex h-28 w-full items-center justify-center rounded bg-gradient-to-br from-rose-100 to-amber-100 sm:h-32"><IconPhotos className="h-7 w-7" style={{ color: C.roseSoft }} /></div>}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center font-heading text-lg italic" style={{ color: C.rose }}>Memories that last a lifetime</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════ COUNTDOWN ══════════════════════ */}
      {data.date && (
        <section className="px-4 py-6 sm:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-4xl overflow-hidden rounded-3xl px-5 py-9 text-center sm:py-11"
            style={{ background: `linear-gradient(130deg, ${C.purpleA} 0%, ${C.purpleB} 55%, ${C.purpleC} 100%)`, boxShadow: '0 20px 50px rgba(155,127,184,0.3)' }}>
            <p className="mb-6 font-heading text-xl text-white sm:text-2xl">Celebration Starts In</p>
            <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4">
              {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: minutes, l: 'Minutes' }, { v: seconds, l: 'Seconds' }].map(({ v, l }) => (
                <div key={l} className="rounded-2xl px-1 py-4 sm:py-5" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}>
                  <div className="font-heading tabular-nums text-white" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.6rem)' }}>{String(v).padStart(2, '0')}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ══════════════════════ TIMELINE ══════════════════════ */}
      {timeline.length > 0 && (
        <section id="schedule" className="px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionHead title="Event Timeline" className="mb-10" />
            <div className="relative">
              {/* golden connector (desktop) */}
              <div className={`absolute left-0 right-0 top-7 h-px ${isPreview ? 'hidden' : 'hidden lg:block'}`} style={{ background: `linear-gradient(90deg, transparent, ${C.goldSoft}, transparent)` }} aria-hidden />
              <div className={`grid items-stretch gap-5 ${isPreview ? '' : 'grid-cols-2 lg:grid-cols-5 lg:gap-3'}`}>
                {timeline.map((t, i) => {
                  const TlIcon = TIMELINE_ICONS[i % TIMELINE_ICONS.length]
                  return (
                    <motion.div key={i} {...fadeUp(i * 0.08)} className="flex h-full flex-col items-center text-center">
                      <div className="relative z-[2] mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                        style={{ background: C.white, border: `2px solid ${C.goldBorder}`, boxShadow: '0 6px 16px rgba(194,150,46,0.2)', color: C.rose }}>
                        <TlIcon className="h-6 w-6" />
                      </div>
                      <div className="flex w-full flex-1 flex-col rounded-2xl px-4 py-4 transition-transform hover:-translate-y-1"
                        style={{ background: C.paper, border: `1px solid ${C.roseBorder}`, boxShadow: '0 10px 28px rgba(158,43,78,0.07)' }}>
                        <p className="font-heading text-[15px]" style={{ color: C.roseDeep }}>{t.title}</p>
                        {t.time && <p className="mt-1 text-xs font-semibold" style={{ color: C.gold }}>{t.time}</p>}
                        {t.desc && <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: C.inkSoft }}>{t.desc}</p>}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ GALLERY ══════════════════════ */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-14 sm:py-20" style={{ background: C.paper }}>
          <SectionHead title="Moments to Cherish" className="mb-10 px-4" />
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8" style={{ scrollbarWidth: 'none' }}>
            {gallery.slice(0, 8).map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: BEZIER }}
                onClick={() => setLightbox(i)}
                className="group relative h-40 w-56 shrink-0 overflow-hidden rounded-2xl transition-transform hover:-translate-y-1.5"
                style={{ border: `1px solid ${C.goldBorder}`, boxShadow: '0 10px 26px rgba(158,43,78,0.1)' }}
                aria-label={`View photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Moment ${i + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </motion.button>
            ))}
            {/* View all card */}
            <button
              onClick={() => setLightbox(0)}
              className="flex h-40 w-56 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl text-white transition-transform hover:-translate-y-1.5"
              style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.roseDeep})`, boxShadow: '0 10px 26px rgba(158,43,78,0.2)' }}
            >
              <IconPhotos className="h-6 w-6" />
              <span className="text-sm font-semibold">View All Photos</span>
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════ WISHES ══════════════════════ */}
      <WishesSection eventId={eventId} sampleWishes={sampleWishes} isPreview={isPreview} />

      {/* ══════════════════════ RSVP + GIFT ══════════════════════ */}
      {/* <section className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'}>
        <div className={`mx-auto grid gap-6 ${hasGift ? 'max-w-5xl' : 'max-w-xl'} ${isPreview || !hasGift ? '' : 'md:grid-cols-2'}`}>
          <RsvpForm eventId={eventId} isPreview={isPreview} />
          {hasGift && <GiftSection data={data} isPreview={isPreview} />}
        </div>
      </section> */}

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className={isPreview ? 'px-4 py-8' : 'px-4 py-12 sm:px-8'} style={{ background: C.creamDeep, borderTop: `1px solid ${C.goldBorder}` }}>
        <div className={`mx-auto grid max-w-5xl gap-8 ${isPreview ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          <div>
            <a href={SHAREINVITE_URL} target="_blank" rel="noopener noreferrer"
              className="font-heading text-xl italic transition-opacity hover:opacity-80" style={{ color: C.rose }}>
              ShareInvite
            </a>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft }}>Creating beautiful memories for your special moments.</p>
          </div>
          <FooterCol title="Quick Links" links={[['Home', '#home'], ['Our Story', '#story'], ['Gallery', '#gallery']]} />
          <FooterCol title="Explore" links={[['Schedule', '#schedule'], ['Wishes', '#wishes'], ['RSVP', '#rsvp'], ...(hasGift ? [['Gift', '#gift'] as [string, string]] : [])]} />
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.gold }}>Follow Us</p>
            <div className="flex gap-2.5">
              {SOCIAL_ICONS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                  style={{ background: C.rose, color: C.white }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">{s.path}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6" style={{ borderColor: C.goldBorder }}>
          <IconDiya className="h-5 w-5 shrink-0" style={{ color: C.gold }} />
          <p className="flex items-center justify-center gap-1.5 text-center text-xs" style={{ color: C.inkFaint }}>
            Made with <IconHeart className="h-3.5 w-3.5" style={{ color: C.rose }} /> by ShareInvite
          </p>
          <IconDiya className="h-5 w-5 shrink-0" style={{ color: C.gold }} />
        </div>
      </footer>

      {/* ══════════════════════ LIGHTBOX ══════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && gallery[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(40,20,25,0.86)', backdropFilter: 'blur(6px)' }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white" style={{ background: 'rgba(255,255,255,0.16)' }}>✕</button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v! - 1 + gallery.length) % gallery.length) }} aria-label="Previous" className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white sm:left-6" style={{ background: 'rgba(255,255,255,0.16)' }}>‹</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={lightbox} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={gallery[lightbox]} alt={`Photo ${lightbox + 1}`} className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
            <button onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v! + 1) % gallery.length) }} aria-label="Next" className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white sm:right-6" style={{ background: 'rgba(255,255,255,0.16)' }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.gold }}>{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}><a href={href} className="text-sm transition-opacity hover:opacity-70" style={{ color: C.inkSoft }}>{label}</a></li>
        ))}
      </ul>
    </div>
  )
}

// ── WISHES carousel (displays live wishes / sample wishes) ────────────────────
function WishesSection({ eventId, sampleWishes, isPreview }: { eventId?: string; sampleWishes: SampleWish[]; isPreview?: boolean }) {
  const [wishes, setWishes] = useState<SampleWish[]>([])
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!eventId || eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) ? setWishes(d.map((w: { name: string; message: string }) => ({ name: w.name, message: w.message }))) : undefined)
      .catch(() => { })
  }, [eventId])

  const list = wishes.length ? wishes : sampleWishes
  if (list.length === 0) return null

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  return (
    <section id="wishes" className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'} style={{ background: `linear-gradient(180deg, ${C.pinkBgSoft}, ${C.pinkBg})` }}>
      <div className="mx-auto max-w-5xl">
        <SectionHead title="Wishes from Loved Ones" className="mb-10" />
        <div className="relative">
          <button onClick={() => scrollBy(-1)} aria-label="Previous wishes" className="absolute -left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg text-white sm:flex" style={{ background: C.rose }}>‹</button>
          <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {list.map((w, i) => (
              <motion.div
                key={`${w.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className={`w-[85%] shrink-0 snap-center rounded-2xl p-6 ${isPreview ? '' : 'sm:w-[calc(33.333%-11px)]'}`}
                style={{ background: C.paper, border: `1px solid ${C.roseBorder}`, boxShadow: '0 10px 26px rgba(158,43,78,0.08)' }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${C.roseSoft}, ${C.rose})` }}>{w.name.charAt(0).toUpperCase()}</div>
                  <p className="text-sm font-semibold" style={{ color: C.roseDeep }}>{w.name}</p>
                </div>
                <p className="text-[13.5px] leading-relaxed" style={{ color: C.inkSoft }}>{w.message}</p>
                <IconHeart className="mt-3 h-4 w-4" style={{ color: C.rose }} />
              </motion.div>
            ))}
          </div>
          <button onClick={() => scrollBy(1)} aria-label="Next wishes" className="absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg text-white sm:flex" style={{ background: C.rose }}>›</button>
        </div>
      </div>
    </section>
  )
}

// ── RSVP form (submits through the existing /api/wishes endpoint) ─────────────
// Currently disabled along with the RSVP + Gift section above. Re-enable both together.
/*
function RsvpForm({ eventId, isPreview }: { eventId?: string; isPreview?: boolean }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setStatus('error'); return }
    if (eventId === '__preview__') { setStatus('success'); return }
    if (!eventId) { setStatus('success'); return }
    setStatus('loading')
    const composed = [
      guests ? `Attending with ${guests} guest(s).` : 'Attending.',
      phone ? `Phone: ${phone}.` : '',
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join(' ')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: composed }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch { setStatus('error') }
  }

  const inputStyle = { background: C.white, border: `1px solid ${C.roseBorder}`, color: C.ink }

  return (
    <motion.div id="rsvp" {...fadeUp()} className={`rounded-3xl ${isPreview ? 'p-5' : 'p-7 sm:p-9'}`} style={{ background: C.paper, border: `1px solid ${C.roseBorder}`, boxShadow: '0 16px 44px rgba(158,43,78,0.08)' }}>
      <h2 className="text-center font-heading text-2xl sm:text-3xl" style={{ color: C.roseDeep }}>RSVP</h2>
      <div className="mx-auto my-3 h-px w-16" style={{ background: C.goldBorder }} />
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
            <div className="mb-3 flex justify-center"><IconCheck className="h-10 w-10" style={{ color: C.rose }} /></div>
            <p className="font-heading text-xl" style={{ color: C.roseDeep }}>Thank you!</p>
            <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>Your RSVP has been received.</p>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="mt-5 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone Number" className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} />
            <div className="flex gap-3">
              <input value={guests} onChange={(e) => setGuests(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="No. of Guests" className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} />
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} rows={3} placeholder="Your Message (Optional)" className="w-full resize-none rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} />
            {status === 'error' && <p className="text-xs" style={{ color: C.roseDeep }}>Please enter your name and try again.</p>}
            <button type="submit" disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.roseDeep})`, boxShadow: '0 8px 22px rgba(158,43,78,0.28)' }}>
              {status === 'loading' ? 'Sending…' : <>Send RSVP <IconSend className="h-4 w-4" /></>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
*/

// ── GIFT section (UPI / payment apps / QR / bank details) ─────────────────────
// function GiftSection({ data, isPreview }: { data: Record<string, string>; isPreview?: boolean }) {
//   const [copied, setCopied] = useState<string | null>(null)
//   const upi = data.upiId
//   const copy = (label: string, value: string) => {
//     navigator.clipboard?.writeText(value).then(() => { setCopied(label); setTimeout(() => setCopied(null), 1500) }).catch(() => {})
//   }
//   const bank = [
//     ['Name', data.bankAccountName],
//     ['A/C No', data.bankAccountNumber],
//     ['IFSC', data.bankIfsc],
//     ['Bank', data.bankName],
//   ].filter(([, v]) => v) as [string, string][]

//   return (
//     <motion.div id="gift" {...fadeUp(0.1)} className={`relative overflow-hidden rounded-3xl ${isPreview ? 'p-5' : 'p-7 sm:p-9'}`} style={{ background: `linear-gradient(160deg, ${C.pinkBgSoft}, ${C.pinkBg})`, border: `1px solid ${C.roseBorder}`, boxShadow: '0 16px 44px rgba(158,43,78,0.08)' }}>
//       {/* animated coins */}
//       <motion.span className="absolute right-6 top-4" aria-hidden style={{ color: C.gold }} animate={{ y: [0, -6, 0], rotate: [0, 12, 0] }} transition={{ duration: 2.4, repeat: Infinity }}><IconCoin className="h-5 w-5" /></motion.span>
//       <motion.span className="absolute right-16 top-10" aria-hidden style={{ color: C.goldSoft }} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}><IconCoin className="h-4 w-4" /></motion.span>

//       <h2 className="flex items-center justify-center gap-2 text-center font-heading text-2xl sm:text-3xl" style={{ color: C.roseDeep }}>Send a Gift <IconGiftBox className="h-6 w-6" style={{ color: C.rose }} /></h2>
//       <p className="mx-auto mt-2 max-w-xs text-center text-sm" style={{ color: C.inkSoft }}>Bless your loved ones with your warm wishes and support.</p>

//       {/* payment app pills */}
//       <div className="mt-5 flex flex-wrap justify-center gap-2">
//         {['UPI', 'GPay', 'PhonePe', 'Paytm'].map((p) => (
//           <a
//             key={p}
//             href={upi ? `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(data.bankAccountName || 'ShareInvite')}&cu=INR` : undefined}
//             className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold shadow-sm transition-transform hover:scale-105"
//             style={{ color: C.roseDeep, border: `1px solid ${C.roseBorder}` }}
//           >
//             {p}
//           </a>
//         ))}
//       </div>

//       <div className={`mt-5 flex flex-col items-center gap-4 ${isPreview ? '' : 'sm:flex-row sm:items-start sm:justify-center'}`}>
//         {/* QR */}
//         <div className="flex flex-col items-center">
//           <div className="rounded-2xl bg-white p-3 shadow-md">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img src={data.qrImage || TINY_QR} alt="Scan to pay" className="h-28 w-28" />
//           </div>
//           <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.inkSoft }}>Scan to Pay</p>
//           {upi && (
//             <button onClick={() => copy('UPI', upi)} className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.rose }}>
//               <IconCopy className="h-3.5 w-3.5" />
//               {copied === 'UPI' ? 'Copied' : 'Copy UPI ID'}
//             </button>
//           )}
//         </div>

//         {/* bank details */}
//         {bank.length > 0 && (
//           <div className="w-full max-w-[240px] rounded-2xl bg-white p-4 shadow-sm" style={{ border: `1px solid ${C.roseBorder}` }}>
//             <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: C.gold }}>Bank Details</p>
//             {bank.map(([k, v]) => (
//               <p key={k} className="text-[12.5px]" style={{ color: C.inkSoft }}>
//                 <span className="font-semibold" style={{ color: C.ink }}>{k}:</span> {v}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   )
// }
