'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// GaneshChaturthi — a premium Ganesh Chaturthi / Ganeshotsav invitation.
//
// Saffron + vermilion + gold on warm cream, a temple-arch mandap hero, the
// Vakratunda shloka, a countdown to sthapana, the utsav schedule, darshan
// details with the visarjan day called out separately, a gallery and a live
// wishes wall.
//
// Same contract as every other ShareInvite template:
//   props { data, eventId?, isPreview? }, `data` is a flat Record<string,string>,
//   guest interaction goes through the existing /api/wishes endpoint.
// ─────────────────────────────────────────────────────────────────────────────

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  cream: '#FFF7EC',          // warm saffron cream (page bg)
  creamDeep: '#FBEAD0',
  paper: '#FFFDF8',
  ink: '#5E3A1E',            // deep sandal brown text
  inkSoft: 'rgba(94,58,30,0.72)',
  inkFaint: 'rgba(94,58,30,0.45)',
  gold: '#C89331',
  goldSoft: '#E8BE63',
  goldBorder: 'rgba(200,147,49,0.30)',
  saffron: '#E4761B',
  saffronSoft: '#F5B968',
  saffronBg: '#FDEBD3',
  saffronBgSoft: '#FEF4E6',
  vermilion: '#B4232A',      // sindoor red — headings
  vermilionDeep: '#8E1A20',  // buttons
  vermilionBorder: 'rgba(180,35,42,0.20)',
  leaf: '#4E7A3A',           // mango-leaf green for the toran
  white: '#FFFFFF',
}

// Saffron → vermilion gradient for the hero title
const TITLE_GRADIENT = 'linear-gradient(130deg, #F0A32A 0%, #E4761B 48%, #B4232A 100%)'

// ── Decorative: floating marigold petals ─────────────────────────────────────
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 53) % 100,
  delay: (i % 9) * 1.3,
  dur: 11 + (i % 5) * 2.4,
  drift: (i % 2 === 0 ? 1 : -1) * (22 + (i % 4) * 15),
  size: 7 + (i % 4) * 4,
  color: i % 3 === 0 ? '#F0A32A' : i % 3 === 1 ? '#E4761B' : '#EFCB63',
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
          style={{ left: `${p.x}%`, top: -24, width: p.size, height: p.size, background: p.color, borderRadius: '50% 0 50% 0', opacity: 0.55 }}
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

// ── Decorative: toran (mango leaves + marigold) strung across the top ────────
const TORAN_ITEMS = Array.from({ length: 14 }, (_, i) => i)

const Toran = memo(function Toran() {
  const reduced = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] hidden select-none sm:block" aria-hidden>
      <div className="flex justify-between px-2 md:px-6">
        {TORAN_ITEMS.map((i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            style={{ transformOrigin: 'top center' }}
            animate={reduced ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
            transition={{ duration: 4.5 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: (i % 5) * 0.3 }}
          >
            {/* marigold bead */}
            <span
              className="block rounded-full"
              style={{ width: 9, height: 9, background: i % 2 === 0 ? C.saffron : C.goldSoft, boxShadow: `0 0 0 2px rgba(255,255,255,0.5)` }}
            />
            {/* mango leaf */}
            <span
              className="block"
              style={{
                width: 13,
                height: 26 + (i % 3) * 7,
                marginTop: 2,
                background: `linear-gradient(180deg, ${C.leaf}, #35561F)`,
                borderRadius: '0 100% 0 100%',
                opacity: 0.9,
              }}
            />
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

interface ScheduleItem { title: string; time: string }

/**
 * The builder's schedule editor serialises rows as "Name - Time", so parsing
 * on the last " - " keeps names that contain a hyphen intact.
 */
function parseSchedule(v?: string): ScheduleItem[] {
  return parseList(v)
    .map((line) => {
      const idx = line.lastIndexOf(' - ')
      return idx === -1
        ? { title: line, time: '' }
        : { title: line.slice(0, idx).trim(), time: line.slice(idx + 3).trim() }
    })
    .filter((s) => s.title)
}

interface SampleWish { name: string; message: string }
function parseWishes(v?: string): SampleWish[] {
  return parseList(v)
    .map((line) => {
      const [name = '', message = ''] = line.split('|').map((s) => s.trim())
      return { name, message }
    })
    .filter((w) => w.name && w.message)
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

// Mount-based reveal for the hero, so it shows even inside the editor's preview
// frame where whileInView may never fire.
function heroIn(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: BEZIER },
  } as const
}

// ── Inline SVG icons (no emoji — coloured via currentColor) ──────────────────
type IconProps = { className?: string; style?: React.CSSProperties }
const svgBase = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

// ॐ is a Devanagari glyph rather than an emoji, and every stroke-path
// approximation of it reads as an abstract swirl. Setting the real character in
// SVG text keeps it unmistakable while still scaling with h-*/w-* and taking
// its colour from currentColor like the other icons.
const IconOm = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <text x="12" y="19.5" textAnchor="middle" fontSize="22" fill="currentColor">ॐ</text>
  </svg>
)
const IconModak = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 3.5c2.6 3.2 5.5 7.4 5.5 10.3 0 3-2.5 5.2-5.5 5.2s-5.5-2.2-5.5-5.2C6.5 10.9 9.4 6.7 12 3.5Z" /><path d="M6.8 15.5h10.4" /></svg>
)
const IconDiya = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3.5 14.5c2 1.4 5 2.2 8.5 2.2s6.5-.8 8.5-2.2c-1.1-1.5-4.3-2.5-8.5-2.5s-7.4 1-8.5 2.5Z" /><path d="M12 12c1.1-1 1.4-2.3.6-3.6-.9 1-1.6 1.8-1.6 3" /></svg>
)
const IconLotus = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 5.5c1.9 2 2.6 4.3 2.6 6.6M12 5.5c-1.9 2-2.6 4.3-2.6 6.6" /><path d="M3.5 12.6c1.6 3.4 4.8 5.6 8.5 5.6s6.9-2.2 8.5-5.6" /><path d="M6.2 8.8c.4 1.5 1.2 2.8 2.2 3.8M17.8 8.8c-.4 1.5-1.2 2.8-2.2 3.8" /></svg>
)
const IconDhol = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="4" y="8" width="16" height="8" rx="2.6" /><path d="M4 10.6h16M4 13.4h16M7 8V6.4M17 8V6.4M7 16v1.6M17 16v1.6" /></svg>
)
const IconVisarjan = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3 15c1.6 0 1.6 1.4 3.2 1.4S7.8 15 9.4 15s1.6 1.4 3.2 1.4S14.2 15 15.8 15s1.6 1.4 3.2 1.4S20.6 15 21 15" /><path d="M3 19c1.6 0 1.6 1.4 3.2 1.4S7.8 19 9.4 19s1.6 1.4 3.2 1.4S14.2 19 15.8 19s1.6 1.4 3.2 1.4" /><path d="M12 3.5c1.8 2.2 3.4 4.6 3.4 6.4 0 2-1.5 3.4-3.4 3.4S8.6 11.9 8.6 9.9c0-1.8 1.6-4.2 3.4-6.4Z" /></svg>
)
const IconCalendar = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4m8-4v4" /></svg>
)
const IconPin = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 21s6.5-6.1 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 14.9 12 21 12 21Z" /><circle cx="12" cy="10.4" r="2.4" /></svg>
)
const IconClock = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></svg>
)
const IconPhotos = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m4 17 5-4 4 3 3-2 4 3" /></svg>
)
const IconHeart = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 21s-7-4.35-9.5-8.5C.6 9.3 2.2 5.6 5.6 5.6c2 0 3.2 1.2 4.4 2.8 1.2-1.6 2.4-2.8 4.4-2.8 3.4 0 5 3.7 3.1 6.9C19 16.65 12 21 12 21Z" /></svg>
)
const IconSend = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M21.5 2.5 10.8 13.2M21.5 2.5 14.7 21.5l-3.9-8.3-8.3-3.9z" /></svg>
)
const IconCheck = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="9" /><path d="m8.3 12 2.6 2.6L15.7 9" /></svg>
)

// Cycled across the utsav schedule so each day reads at a glance.
const SCHEDULE_ICONS = [IconOm, IconDiya, IconModak, IconDhol, IconLotus, IconVisarjan]

const SHAREINVITE_URL = 'https://shareinvite.in'
const SHAREINVITE_LINKEDIN = 'https://www.linkedin.com/company/share-invite'
const SHAREINVITE_INSTAGRAM = 'https://www.instagram.com/shareinvite.in'

const SOCIAL_ICONS: { label: string; href: string; path: React.ReactNode }[] = [
  { label: 'Instagram', href: SHAREINVITE_INSTAGRAM, path: <path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.28.07 1.66.07 4.86s-.01 3.58-.07 4.86c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.68.07-4.9.07s-3.6-.01-4.9-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.12 15.6 2.11 15.2 2.11 12s.01-3.58.07-4.86C2.33 3.9 3.84 2.36 7.1 2.21 8.4 2.15 8.8 2.14 12 2.14zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zM12 16a4 4 0 114-4 4 4 0 01-4 4zm6.4-11.85a1.44 1.44 0 101.44 1.44 1.44 1.44 0 00-1.44-1.44z" /> },
  { label: 'LinkedIn', href: SHAREINVITE_LINKEDIN, path: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" /> },
]

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
      aria-label={playing ? 'Pause background aarti' : 'Play background aarti'}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      style={{ background: C.white, border: `1px solid ${C.goldBorder}`, boxShadow: '0 6px 18px rgba(180,35,42,0.18)', color: C.vermilion }}
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
        <IconOm className="h-4 w-4" style={{ color: C.gold }} />
        <span className="h-px w-10" style={{ background: `linear-gradient(270deg,transparent,${C.goldBorder})` }} />
      </div>
      <h2 className="font-heading" style={{ color: C.vermilion, fontSize: 'clamp(1.5rem, 5vw, 2.4rem)' }}>{title}</h2>
    </motion.div>
  )
}

interface Props { data: Record<string, string>; eventId?: string; isPreview?: boolean }

export default function GaneshChaturthi({ data, eventId, isPreview = false }: Props) {
  const hosts = data.hostNames || 'The Joshi Family'
  const tagline = data.tagline || 'Ganpati Bappa Morya'
  const title = data.title || 'Ganesh Chaturthi'
  const subtitle = data.subtitle || 'Welcoming Bappa home — join us for darshan, aarti and prasad'

  const gallery = useMemo(() => parseList(data.galleryImages), [data.galleryImages])
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const sampleWishes = useMemo(() => parseWishes(data.sampleWishes), [data.sampleWishes])
  const invocationLines = useMemo(() => parseList(data.invocation), [data.invocation])
  const { days, hours, minutes, seconds } = useCountdown(data.date, data.time)

  const hasVisarjan = Boolean(data.visarjanDate || data.visarjanTime)

  const [lightbox, setLightbox] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Aarti', href: '#invocation' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Darshan', href: '#darshan' },
    ...(gallery.length ? [{ label: 'Gallery', href: '#gallery' }] : []),
    { label: 'Wishes', href: '#wishes' },
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
        style={{ background: 'rgba(255,247,236,0.88)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.goldBorder}` }}
      >
        <div className="flex items-center gap-2.5">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            style={{ color: C.vermilion, background: C.white, border: `1px solid ${C.vermilionBorder}` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <span className="font-heading text-lg italic sm:text-xl" style={{ color: C.vermilion }}>ShareInvite</span>
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
              style={{ background: 'rgba(255,247,236,0.98)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.goldBorder}` }}
            >
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium"
                  style={{ color: C.ink, background: C.white, border: `1px solid ${C.vermilionBorder}` }}>
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
        style={{ background: `radial-gradient(ellipse 90% 70% at 50% 18%, ${C.creamDeep}, ${C.cream})` }}
      >
        {/* paper texture */}
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }} />
        {!isPreview && <FloatingPetals />}
        {!isPreview && <Toran />}

        <div className={`relative z-[5] mx-auto grid max-w-5xl items-center gap-8 ${isPreview ? '' : 'md:grid-cols-2'}`}>
          {/* Left — copy */}
          <div className="text-center md:text-left">
            <motion.p {...heroIn(0)} className="mb-2 text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.saffron }}>
              ॐ {tagline} ॐ
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
            <motion.p {...heroIn(0.22)} className="mt-4 font-heading text-lg italic" style={{ color: C.vermilion }}>
              {hosts}
            </motion.p>
            <motion.div {...heroIn(0.28)} className="mt-5 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
              {data.date && (
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2"
                  style={{ background: C.white, border: `1px solid ${C.vermilionBorder}`, color: C.vermilionDeep }}>
                  <IconCalendar className="h-4 w-4" style={{ color: C.gold }} />
                  <span className="text-sm font-medium">{formatDate(data.date)}</span>
                </span>
              )}
              {data.time && (
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2"
                  style={{ background: C.white, border: `1px solid ${C.vermilionBorder}`, color: C.vermilionDeep }}>
                  <IconClock className="h-4 w-4" style={{ color: C.gold }} />
                  <span className="text-sm font-medium">{formatTime(data.time)}</span>
                </span>
              )}
            </motion.div>
          </div>

          {/* Right — temple-arch mandap + idol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: BEZIER }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="relative overflow-hidden" style={{
              aspectRatio: '4/5',
              borderRadius: '50% 50% 12px 12px / 44% 44% 12px 12px',
              background: `linear-gradient(180deg, ${C.saffronBgSoft}, ${C.creamDeep})`,
              border: `2px solid ${C.goldBorder}`,
              boxShadow: `inset 0 0 40px rgba(200,147,49,0.18), 0 20px 50px rgba(180,35,42,0.14)`,
            }}>
              {/* aarti glow behind the idol */}
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 34%, rgba(240,163,42,0.32), transparent 62%)` }} />
              {data.idolImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.idolImage} alt={`Ganpati Bappa at ${hosts}`} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <IconOm className="h-14 w-14" style={{ color: C.saffronSoft }} />
                  <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: C.inkFaint }}>Add your Bappa photo</p>
                </div>
              )}
            </div>
            {/* mandap plinth */}
            <div className="mx-auto -mt-3 h-4 w-4/5 rounded-full" style={{ background: `linear-gradient(180deg, ${C.creamDeep}, #E9D2AC)`, boxShadow: '0 10px 20px rgba(180,35,42,0.12)' }} />
            {/* two diyas at the foot of the mandap */}
            {!isPreview && (
              <div className="mt-4 flex items-center justify-center gap-10" aria-hidden>
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    style={{ color: C.saffron }}
                  >
                    <IconDiya className="h-6 w-6" />
                  </motion.span>
                ))}
              </div>
            )}
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

      {/* ══════════════════════ INVOCATION (shloka) ══════════════════════ */}
      {(invocationLines.length > 0 || data.message) && (
        <section id="invocation" className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'}>
          <div className="mx-auto max-w-3xl">
            <motion.div
              {...fadeUp()}
              className={`relative overflow-hidden rounded-3xl text-center ${isPreview ? 'p-6' : 'p-8 sm:p-12'}`}
              style={{ background: C.paper, border: `1px solid ${C.goldBorder}`, boxShadow: '0 16px 44px rgba(180,35,42,0.08)' }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden
                style={{ background: `radial-gradient(circle at 50% 0%, ${C.saffron}, transparent 65%)` }} />
              <IconOm className="mx-auto h-8 w-8" style={{ color: C.gold }} />
              <div className="mt-5 space-y-2.5">
                {invocationLines.map((line, i) => (
                  <p key={i} className="font-heading text-[17px] leading-relaxed sm:text-xl" style={{ color: C.vermilion }}>{line}</p>
                ))}
              </div>
              {data.message && (
                <>
                  <div className="mx-auto my-6 h-px w-20" style={{ background: C.goldBorder }} />
                  <p className="mx-auto max-w-xl text-[14.5px] italic leading-relaxed" style={{ color: C.inkSoft }}>{data.message}</p>
                </>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════ COUNTDOWN ══════════════════════ */}
      {data.date && (
        <section className="px-4 py-6 sm:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-4xl overflow-hidden rounded-3xl px-5 py-9 text-center sm:py-11"
            style={{ background: `linear-gradient(130deg, ${C.saffron} 0%, #D4501F 52%, ${C.vermilion} 100%)`, boxShadow: '0 20px 50px rgba(212,80,31,0.30)' }}>
            <p className="mb-6 font-heading text-xl text-white sm:text-2xl">Bappa Arrives In</p>
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

      {/* ══════════════════════ UTSAV SCHEDULE ══════════════════════ */}
      {schedule.length > 0 && (
        <section id="schedule" className="px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionHead title="Utsav Schedule" className="mb-10" />
            <div className="relative">
              {/* golden connector (desktop) */}
              <div className={`absolute left-0 right-0 top-7 h-px ${isPreview ? 'hidden' : 'hidden lg:block'}`} style={{ background: `linear-gradient(90deg, transparent, ${C.goldSoft}, transparent)` }} aria-hidden />
              <div className={`grid items-stretch gap-5 ${isPreview ? '' : 'grid-cols-2 lg:grid-cols-5 lg:gap-3'}`}>
                {schedule.slice(0, 10).map((s, i) => {
                  const StepIcon = SCHEDULE_ICONS[i % SCHEDULE_ICONS.length]
                  return (
                    <motion.div key={`${s.title}-${i}`} {...fadeUp(i * 0.08)} className="flex h-full flex-col items-center text-center">
                      <div className="relative z-[2] mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                        style={{ background: C.white, border: `2px solid ${C.goldBorder}`, boxShadow: '0 6px 16px rgba(200,147,49,0.22)', color: C.vermilion }}>
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <div className="flex w-full flex-1 flex-col rounded-2xl px-4 py-4 transition-transform hover:-translate-y-1"
                        style={{ background: C.paper, border: `1px solid ${C.vermilionBorder}`, boxShadow: '0 10px 28px rgba(180,35,42,0.07)' }}>
                        <p className="font-heading text-[15px]" style={{ color: C.vermilionDeep }}>{s.title}</p>
                        {s.time && <p className="mt-1 text-xs font-semibold" style={{ color: C.gold }}>{s.time}</p>}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ DARSHAN DETAILS ══════════════════════ */}
      {(data.venue || data.pooja || hasVisarjan) && (
        <section id="darshan" className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'} style={{ background: C.paper }}>
          <SectionHead title="Darshan Details" className="mb-10" />
          <div className={`mx-auto grid max-w-5xl gap-5 ${isPreview ? '' : 'sm:grid-cols-2'}`}>
            {data.venue && (
              <DetailCard icon={<IconPin className="h-5 w-5" />} title="Mandap / Venue">
                <p className="font-heading text-lg" style={{ color: C.vermilionDeep }}>{data.venue}</p>
                {data.venueAddress && <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: C.inkSoft }}>{data.venueAddress}</p>}
                {data.mapsUrl && (
                  <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                    style={{ background: `linear-gradient(135deg, ${C.saffron}, ${C.vermilion})`, boxShadow: '0 8px 22px rgba(180,35,42,0.26)' }}>
                    Open in Maps →
                  </a>
                )}
              </DetailCard>
            )}
            {data.pooja && (
              <DetailCard icon={<IconOm className="h-5 w-5" />} title="Pooja & Muhurat">
                <p className="text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>{data.pooja}</p>
              </DetailCard>
            )}
            {hasVisarjan && (
              <DetailCard icon={<IconVisarjan className="h-5 w-5" />} title="Visarjan">
                <p className="font-heading text-lg" style={{ color: C.vermilionDeep }}>
                  {data.visarjanDate ? formatDate(data.visarjanDate) : 'Date to be announced'}
                </p>
                {data.visarjanTime && (
                  <p className="mt-1.5 text-[13.5px]" style={{ color: C.inkSoft }}>
                    Procession begins at {formatTime(data.visarjanTime)}
                  </p>
                )}
                <p className="mt-3 text-[13px] italic leading-relaxed" style={{ color: C.inkFaint }}>
                  Join us as we send Bappa off with dhol, colour and one last aarti.
                </p>
              </DetailCard>
            )}
            {data.dressCode && (
              <DetailCard icon={<IconLotus className="h-5 w-5" />} title="What to Wear">
                <p className="text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>{data.dressCode}</p>
              </DetailCard>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════ GALLERY ══════════════════════ */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-14 sm:py-20" style={{ background: `linear-gradient(180deg, ${C.saffronBgSoft}, ${C.saffronBg})` }}>
          <SectionHead title="Moments of Devotion" className="mb-10 px-4" />
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8" style={{ scrollbarWidth: 'none' }}>
            {gallery.slice(0, 8).map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: BEZIER }}
                onClick={() => setLightbox(i)}
                className="group relative h-40 w-56 shrink-0 overflow-hidden rounded-2xl transition-transform hover:-translate-y-1.5"
                style={{ border: `1px solid ${C.goldBorder}`, boxShadow: '0 10px 26px rgba(180,35,42,0.1)' }}
                aria-label={`View photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Ganesh Utsav moment ${i + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </motion.button>
            ))}
            <button
              onClick={() => setLightbox(0)}
              className="flex h-40 w-56 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl text-white transition-transform hover:-translate-y-1.5"
              style={{ background: `linear-gradient(135deg, ${C.saffron}, ${C.vermilion})`, boxShadow: '0 10px 26px rgba(180,35,42,0.2)' }}
            >
              <IconPhotos className="h-6 w-6" />
              <span className="text-sm font-semibold">View All Photos</span>
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════ WISHES ══════════════════════ */}
      <WishesWall eventId={eventId} sampleWishes={sampleWishes} isPreview={isPreview} />

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className={isPreview ? 'px-4 py-8' : 'px-4 py-12 sm:px-8'} style={{ background: C.creamDeep, borderTop: `1px solid ${C.goldBorder}` }}>
        <div className={`mx-auto grid max-w-5xl gap-8 ${isPreview ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          <div>
            <a href={SHAREINVITE_URL} target="_blank" rel="noopener noreferrer"
              className="font-heading text-xl italic transition-opacity hover:opacity-80" style={{ color: C.vermilion }}>
              ShareInvite
            </a>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft }}>Creating beautiful memories for your special moments.</p>
          </div>
          <FooterCol title="Quick Links" links={[['Home', '#home'], ['Aarti', '#invocation'], ['Schedule', '#schedule']]} />
          <FooterCol title="Explore" links={[['Darshan', '#darshan'], ...(gallery.length ? [['Gallery', '#gallery'] as [string, string]] : []), ['Wishes', '#wishes']]} />
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.gold }}>Follow Us</p>
            <div className="flex gap-2.5">
              {SOCIAL_ICONS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                  style={{ background: C.vermilion, color: C.white }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">{s.path}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6" style={{ borderColor: C.goldBorder }}>
          <IconDiya className="h-5 w-5 shrink-0" style={{ color: C.gold }} />
          <p className="flex items-center justify-center gap-1.5 text-center text-xs" style={{ color: C.inkFaint }}>
            Made with <IconHeart className="h-3.5 w-3.5" style={{ color: C.vermilion }} /> by ShareInvite
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
            style={{ background: 'rgba(46,22,12,0.86)', backdropFilter: 'blur(6px)' }}
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

// ── Detail card ──────────────────────────────────────────────────────────────
function DetailCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div {...fadeUp(0.06)} className="rounded-3xl p-6 sm:p-7"
      style={{ background: C.cream, border: `1px solid ${C.goldBorder}`, boxShadow: '0 12px 34px rgba(180,35,42,0.07)' }}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: C.white, border: `1px solid ${C.vermilionBorder}`, color: C.vermilion }}>
          {icon}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.gold }}>{title}</p>
      </div>
      {children}
    </motion.div>
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

// ── WISHES wall (live wishes + guest submission) ─────────────────────────────
//
// Live wishes replace the host's sample wishes as soon as the first guest
// writes one, so a freshly published invitation is never an empty section and a
// busy one is never padded with placeholder copy.
function WishesWall({ eventId, sampleWishes, isPreview }: { eventId?: string; sampleWishes: SampleWish[]; isPreview?: boolean }) {
  const isLive = Boolean(eventId) && eventId !== '__preview__'
  const [wishes, setWishes] = useState<SampleWish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLive) return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setWishes(d.map((w: { name: string; message: string }) => ({ name: w.name, message: w.message })))
      })
      .catch(() => { })
  }, [eventId, isLive])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) { setStatus('error'); return }
    if (!isLive) { setStatus('success'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      setWishes((prev) => [{ name: name.trim(), message: message.trim() }, ...prev])
      setName(''); setMessage('')
      setStatus('success')
    } catch { setStatus('error') }
  }

  const list = wishes.length ? wishes : sampleWishes
  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  const inputStyle = { background: C.white, border: `1px solid ${C.vermilionBorder}`, color: C.ink }

  return (
    <section id="wishes" className={isPreview ? 'px-3 py-8' : 'px-4 py-14 sm:px-8 sm:py-20'} style={{ background: C.cream }}>
      <div className="mx-auto max-w-5xl">
        <SectionHead title="Wishes & Blessings" className="mb-10" />

        {list.length > 0 && (
          <div className="relative mb-10">
            <button onClick={() => scrollBy(-1)} aria-label="Previous wishes" className="absolute -left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg text-white sm:flex" style={{ background: C.vermilion }}>‹</button>
            <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {list.map((w, i) => (
                <motion.div
                  key={`${w.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className={`w-[85%] shrink-0 snap-center rounded-2xl p-6 ${isPreview ? '' : 'sm:w-[calc(33.333%-11px)]'}`}
                  style={{ background: C.paper, border: `1px solid ${C.goldBorder}`, boxShadow: '0 10px 26px rgba(180,35,42,0.08)' }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${C.saffronSoft}, ${C.vermilion})` }}>
                      {w.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: C.vermilionDeep }}>{w.name}</p>
                  </div>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: C.inkSoft }}>{w.message}</p>
                  <IconLotus className="mt-3 h-4 w-4" style={{ color: C.saffron }} />
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollBy(1)} aria-label="Next wishes" className="absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg text-white sm:flex" style={{ background: C.vermilion }}>›</button>
          </div>
        )}

        {/* Guest wish form */}
        <motion.div {...fadeUp(0.08)} className={`mx-auto max-w-xl rounded-3xl ${isPreview ? 'p-5' : 'p-7 sm:p-9'}`}
          style={{ background: C.paper, border: `1px solid ${C.vermilionBorder}`, boxShadow: '0 16px 44px rgba(180,35,42,0.08)' }}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="mb-3 flex justify-center"><IconCheck className="h-10 w-10" style={{ color: C.saffron }} /></div>
                <p className="font-heading text-xl" style={{ color: C.vermilionDeep }}>Ganpati Bappa Morya!</p>
                <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>Your blessing is now on this invitation for everyone to see.</p>
                <button onClick={() => setStatus('idle')} className="mt-5 text-sm font-semibold" style={{ color: C.vermilion }}>
                  Send another wish →
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="space-y-3">
                <p className="mb-4 text-center text-sm" style={{ color: C.inkSoft }}>Leave a blessing for the family and Bappa.</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 100))}
                  required
                  placeholder="Your Name"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={inputStyle}
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 320))}
                  required
                  rows={3}
                  placeholder="Your wish or blessing…"
                  className="w-full resize-none rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={inputStyle}
                />
                {status === 'error' && <p className="text-xs" style={{ color: C.vermilionDeep }}>Please add your name and a message, then try again.</p>}
                <button type="submit" disabled={status === 'loading'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${C.saffron}, ${C.vermilion})`, boxShadow: '0 8px 22px rgba(180,35,42,0.26)' }}>
                  {status === 'loading' ? 'Sending…' : <>Send Wish <IconSend className="h-4 w-4" /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
