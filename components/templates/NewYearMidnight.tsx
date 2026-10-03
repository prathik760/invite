'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { bodoniDisplay } from './kit/fonts/bodoniDisplay'
import { italiana } from './kit/fonts/italiana'
import { pinyon } from './kit/fonts/pinyon'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, mapsHref, pad2, parseLines, parseSchedule, timeLabel, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import { ChannelIcon, rsvpChannels } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Midnight — New Year's Eve.
 * Black and gold, Art Deco. It opens on a gilded clock at 11:59 and a line:
 * it's almost midnight. The guest taps "Count us in", the room counts down
 * from ten while the second hand sweeps, and at twelve the screen flashes,
 * confetti falls and real fireworks go up — the last of them bursting into
 * sparks that gather in the sky to spell the new year, then turn to gold.
 * Inside: a split-flap countdown to midnight, the night as gold tickets, a
 * letter from the hosts, a little ritual — write what you're leaving in the
 * old year and watch it burn away, then send a wish up to become a star —
 * the year in photos on a film strip, what to wear, how to get home, and an
 * RSVP with a song for midnight.
 */

const P = {
  black: '#07070C',
  ink: '#0C0D18',
  midnight: '#0B1030',
  navy: '#141C44',
  gold: '#D8B25A',
  goldLight: '#F5E2A6',
  goldDeep: '#9E7A2E',
  champagne: '#EAD9B5',
  paper: '#F7F1E3',
  silver: '#C9CDD6',
  blush: '#E9B7C2',
  text: '#F4EEDF',
  soft: 'rgba(244,238,223,0.78)',
  faint: 'rgba(244,238,223,0.54)',
  rule: 'rgba(216,178,90,0.28)',
  paperInk: '#1B1A22',
  paperSoft: 'rgba(27,26,34,0.72)',
  paperRule: 'rgba(27,26,34,0.14)',
}

const display = bodoniDisplay.style.fontFamily
const deco = italiana.style.fontFamily
const script = pinyon.style.fontFamily
const sans = jost.style.fontFamily

/** The opening fills a phone's screen in the builder's preview: about 19.5 : 9, whatever width the phone is drawn at. */
const PREVIEW_H = 'max(520px, 210cqi)'

const FOIL = 'linear-gradient(115deg, #8E6A24 0%, #E2C06E 20%, #FFF2C4 38%, #C99B3E 55%, #F4DC94 74%, #9E7A2E 100%)'

const WISHES_THEME: InviteTheme = {
  bg: P.ink,
  surface: '#16172A',
  ink: P.text,
  muted: P.soft,
  line: 'rgba(244,238,223,0.14)',
  accent: P.gold,
  onAccent: P.black,
  heading: display,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(32px, 9.4cqi, 44px)', color: P.goldLight },
}

const SAMPLE_WISHES = [
  { name: 'Jules & Sam', message: 'To the best roof in the city and the people on it. Here’s to more of all of it next year.' },
  { name: 'Theo', message: 'Bringing the sparklers. And the bad dancing. Happy New Year, you two.' },
]

/* ── Helpers ───────────────────────────────────────────────────────── */

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

const foil = (extra?: CSSProperties): CSSProperties => ({
  backgroundImage: FOIL,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

function nextDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(y, m - 1, d + 1, 12)
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`
}

/** The year being welcomed: a party on 31 December welcomes the next one. */
function yearWelcomed(date?: string): number {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m] = date.split('-').map(Number)
    return m === 12 ? y + 1 : y
  }
  // No date yet: the next New Year's Eve welcomes next year.
  return new Date().getFullYear() + 1
}

/** Swatches for the colours a dress code names: "black tie, gold" → black, gold. */
const DRESS: [RegExp, string][] = [
  [/black/i, '#0B0B10'], [/gold|sparkl|sequin|glitter/i, FOIL], [/silver|metallic/i, '#C9CDD6'], [/white|ivory|cream/i, '#F7F1E3'],
  [/champagne/i, '#EAD9B5'], [/red/i, '#A3122E'], [/navy|midnight/i, '#141C44'], [/emerald|green/i, '#0F5B45'], [/pink|blush/i, '#E9B7C2'],
]
function dressSwatches(value?: string): string[] {
  const v = value || ''
  return DRESS.filter(([re]) => re.test(v)).map(([, c]) => c).filter((c, i, all) => all.indexOf(c) === i).slice(0, 5)
}

/* ── Fireworks ─────────────────────────────────────────────────────── */

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: string; size: number; tx?: number; ty?: number; hold?: number }
interface Rocket { x: number; y: number; vy: number; top: number; hue: string; text: boolean }

const HUES = ['#FFE7A3', '#F5D27A', '#FFFFFF', '#FFC9D6', '#BFD8FF', '#FFD9A0']

/**
 * A small fireworks engine on a canvas. `show` starts the midnight display
 * (the last rocket spells `text`); after that, a firework now and then while
 * the canvas is on screen.
 */
function Fireworks({ show, text, font, reduced }: { show: boolean; text: string; font: string; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = canvas.current
    if (!el || !show || started.current || reduced) return
    started.current = true
    const ctx = el.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const size = () => {
      w = el.clientWidth
      h = el.clientHeight
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const sparks: Spark[] = []
    const rockets: Rocket[] = []
    const rand = Math.random
    // The year is drawn in the display face: make sure the canvas has it.
    document.fonts?.load(`600 120px ${font}`).catch(() => {})

    /** Points that draw `text` across the upper sky. */
    const textPoints = () => {
      const off = document.createElement('canvas')
      // The same size as the gold year that settles in its place (30cqi of a 30rem column).
      const fs = Math.min(Math.min(w, 480) * 0.3, h * 0.24, 170)
      off.width = Math.ceil(w)
      off.height = Math.ceil(fs * 1.3)
      const o = off.getContext('2d')
      if (!o) return []
      o.fillStyle = '#fff'
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.font = `600 ${fs}px ${font}, Georgia, serif`
      o.fillText(text, off.width / 2, off.height / 2)
      const data = o.getImageData(0, 0, off.width, off.height).data
      const step = Math.max(3, Math.round(fs / 30))
      const pts: [number, number][] = []
      const top = h * 0.27 - off.height / 2
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) if (data[(y * off.width + x) * 4 + 3] > 140) pts.push([x, y + top])
      }
      return pts
    }

    const burst = (x: number, y: number, hue: string, n: number, speed: number) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand() * 0.2
        const v = speed * (0.55 + rand() * 0.45)
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 60 + rand() * 40, hue: rand() < 0.2 ? '#FFFFFF' : hue, size: 1.2 + rand() * 1.3 })
      }
    }
    const spell = (x: number, y: number) => {
      for (const [tx, ty] of textPoints()) {
        const a = rand() * Math.PI * 2
        const v = 2 + rand() * 4
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 175 + rand() * 25, hue: rand() < 0.25 ? '#FFFFFF' : '#FFE29A', size: 1.1 + rand() * 0.6, tx, ty, hold: 0 })
      }
      burst(x, y, '#FFE7A3', 50, 5)
    }
    const launch = (text = false) => {
      rockets.push({ x: text ? w / 2 : w * (0.15 + rand() * 0.7), y: h + 4, vy: -(h / 62 + rand() * 2), top: text ? h * 0.27 : h * (0.12 + rand() * 0.3), hue: HUES[Math.floor(rand() * HUES.length)], text })
    }

    // The midnight display, then one now and then.
    const timers: number[] = []
    ;[0, 260, 520, 900, 1250].forEach((t) => timers.push(window.setTimeout(() => launch(), t)))
    // The year goes up alone, so it can be read; the sky fills again once it falls.
    timers.push(window.setTimeout(() => launch(true), 1200))
    ;[4600, 5000, 5700].forEach((t) => timers.push(window.setTimeout(() => launch(), t)))
    let next = performance.now() + 7000

    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      if (now > next) {
        launch()
        if (rand() < 0.4) launch()
        next = now + 2600 + rand() * 2600
      }
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy
        r.vy *= 0.985
        ctx.fillStyle = '#FFE9B8'
        ctx.beginPath()
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
        if (r.y <= r.top || r.vy > -1.2) {
          if (r.text) spell(r.x, r.y)
          else burst(r.x, r.y, r.hue, 70, 4.6)
          rockets.splice(i, 1)
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        if (s.tx !== undefined && s.ty !== undefined && s.life > 14 && s.life < s.max - 80) {
          // Gather into the letters, then hold there, glittering.
          s.x += (s.tx - s.x) * 0.13
          s.y += (s.ty - s.y) * 0.13
          s.vx = (rand() - 0.5) * 0.6
          s.vy = rand() * 0.4
        } else {
          s.vx *= 0.975
          s.vy = s.vy * 0.975 + 0.045
          s.x += s.vx
          s.y += s.vy
        }
        const fade = 1 - s.life / s.max
        if (fade <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const twinkle = s.tx !== undefined ? 0.65 + Math.random() * 0.35 : 1
        ctx.globalAlpha = Math.min(1, fade * 1.6) * twinkle
        ctx.fillStyle = s.hue
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((t) => window.clearTimeout(t))
      ro.disconnect()
      io.disconnect()
    }
  }, [show, text, font, reduced])

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
}

/* ── The clock ─────────────────────────────────────────────────────── */

function Clock({ uid }: { uid: string }) {
  const g = `${uid}-gold`
  return (
    <svg viewBox="0 0 240 240" className="block w-full" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF2C4" />
          <stop offset="35%" stopColor="#D8B25A" />
          <stop offset="65%" stopColor="#8E6A24" />
          <stop offset="100%" stopColor="#F4DC94" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1C2350" />
          <stop offset="100%" stopColor="#070A1E" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="116" fill={`url(#${g})`} />
      <circle cx="120" cy="120" r="108" fill={`url(#${uid}-face)`} />
      <circle cx="120" cy="120" r="101" fill="none" stroke={`url(#${g})`} strokeWidth={0.8} />
      {/* sunburst */}
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2
        return <path key={i} d={`M${r1(120 + Math.cos(a) * 26)} ${r1(120 + Math.sin(a) * 26)}L${r1(120 + Math.cos(a) * 80)} ${r1(120 + Math.sin(a) * 80)}`} stroke="#D8B25A" strokeOpacity={i % 2 ? 0.08 : 0.16} strokeWidth={i % 2 ? 0.6 : 1} />
      })}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2
        const long = i % 5 === 0
        return <path key={i} d={`M${r1(120 + Math.cos(a) * (long ? 88 : 94))} ${r1(120 + Math.sin(a) * (long ? 88 : 94))}L${r1(120 + Math.cos(a) * 99)} ${r1(120 + Math.sin(a) * 99)}`} stroke="#D8B25A" strokeWidth={long ? 2.4 : 0.9} />
      })}
      {(['XII', 'III', 'VI', 'IX'] as const).map((n, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2
        return (
          <text key={n} x={r1(120 + Math.cos(a) * 70)} y={r1(120 + Math.sin(a) * 70 + 6)} textAnchor="middle" fontFamily={display} fontSize="17" fill="#F5E2A6">{n}</text>
        )
      })}
      {/* hour, minute, second: a minute to midnight */}
      <g className="ny-hour" style={{ transformOrigin: '120px 120px' }}>
        <path d="M120 122L116 74L120 62L124 74Z" fill={`url(#${g})`} />
      </g>
      <g className="ny-minute" style={{ transformOrigin: '120px 120px' }}>
        <path d="M120 124L117 46L120 30L123 46Z" fill={`url(#${g})`} />
      </g>
      <g className="ny-second" style={{ transformOrigin: '120px 120px' }}>
        <path d="M120 140V26" stroke="#E9B7C2" strokeWidth={1.2} />
        <circle cx="120" cy="36" r="2.6" fill="#E9B7C2" />
      </g>
      <circle cx="120" cy="120" r="5" fill={`url(#${g})`} />
    </svg>
  )
}

/* ── Confetti and streamers at midnight ────────────────────────────── */

function Confetti({ seed }: { seed: number }) {
  const bits = useMemo(() => {
    const rand = rng(seed)
    const colours = ['#D8B25A', '#F5E2A6', '#C9CDD6', '#FFFFFF', '#E9B7C2', '#9E7A2E']
    return Array.from({ length: 70 }, () => ({
      left: r1(rand() * 100),
      w: r1(4 + rand() * 6),
      h: r1(6 + rand() * 12),
      c: colours[Math.floor(rand() * colours.length)],
      dur: r1(2.6 + rand() * 2.4),
      delay: r1(rand() * 0.9),
      x: r1(-60 + rand() * 120),
      r: Math.round(240 + rand() * 720),
      round: rand() < 0.3,
    }))
  }, [seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="ny-confetti absolute -top-6 block"
          style={{ left: `${b.left}%`, width: b.w, height: b.round ? b.w : b.h, background: b.c, borderRadius: b.round ? '50%' : 1, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, '--x': `${b.x}px`, '--r': `${b.r}deg` } as CSSProperties}
        />
      ))}
    </div>
  )
}

function Stars({ count, seed }: { count: number; seed: number }) {
  const items = useMemo(() => {
    const rand = rng(seed)
    return Array.from({ length: count }, () => ({ x: r1(rand() * 100), y: r1(rand() * 100), s: r1(0.8 + rand() * 1.6), d: r1(2 + rand() * 4), o: r1(rand() * 3) }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {items.map((s, i) => (
        <span key={i} className="ny-star absolute block rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDuration: `${s.d}s`, animationDelay: `${s.o}s` }} />
      ))}
    </div>
  )
}

/* ── Ornament ──────────────────────────────────────────────────────── */

function Caps({ children, color = P.gold, size = 12, className = '' }: { children: ReactNode; color?: string; size?: number; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontWeight: 400, fontSize: size, letterSpacing: '0.34em', color, textWrap: 'balance' }}>
      {children}
    </p>
  )
}

/** A stepped Art Deco fan, used to crown headings. */
function Fan({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 34" className={className} aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = Math.PI + (i / 6) * Math.PI
        return <path key={i} d={`M60 32L${r1(60 + Math.cos(a) * 30)} ${r1(32 + Math.sin(a) * 30)}`} stroke="#D8B25A" strokeWidth={1} />
      })}
      <path d="M30 32A30 30 0 0 1 90 32" stroke="#D8B25A" strokeWidth={1} fill="none" />
      <path d="M44 32A16 16 0 0 1 76 32" stroke="#D8B25A" strokeWidth={1} fill="none" />
      <path d="M0 32H24M96 32H120" stroke="#D8B25A" strokeWidth={1} />
      <path d="M8 28H22M98 28H112" stroke="#D8B25A" strokeWidth={0.6} />
    </svg>
  )
}

function Heading({ kicker, children, onPaper = false }: { kicker?: string; children: ReactNode; onPaper?: boolean }) {
  return (
    <div className="text-center">
      <Fan className="mx-auto mb-3 h-[22px] w-[90px]" />
      {kicker && <Caps color={onPaper ? P.goldDeep : P.gold} size={11.5}>{kicker}</Caps>}
      <h2 className="mt-2" style={{ fontFamily: deco, fontWeight: 400, fontSize: 'clamp(34px, 10.4cqi, 50px)', lineHeight: 1.05, color: onPaper ? P.paperInk : P.goldLight, letterSpacing: '0.02em' }}>{children}</h2>
    </div>
  )
}

function Btn({ href, isPreview, children, solid }: { href: string | null; isPreview: boolean; children: ReactNode; solid?: boolean }) {
  if (!href) return null
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="ny-btn inline-flex min-h-[46px] items-center justify-center px-6 text-[12px] uppercase tracking-[0.24em]"
      style={{ fontFamily: sans, ...(solid ? { background: FOIL, color: P.black } : { border: `1px solid ${P.rule}`, color: P.goldLight }) }}
    >
      {children}
    </DirectionsLink>
  )
}

/* ── Split-flap countdown ──────────────────────────────────────────── */

function FlipDigit({ value }: { value: string }) {
  return (
    <span className="ny-flipcard relative inline-flex h-[1.36em] w-[0.92em] items-center justify-center overflow-hidden rounded-[6px]" style={{ background: 'linear-gradient(180deg, #1D1F33 50%, #15172A 50%)', boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06), 0 8px 16px -8px rgba(0,0,0,0.8)' }}>
      <span key={value} className="ny-flipin block" style={foil()}>{value}</span>
      <span className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(0,0,0,0.55)' }} />
    </span>
  )
}

function MidnightCountdown({ date, time, enabled }: { date: string; time?: string; enabled: boolean }) {
  const midnight = date.endsWith('-12-31')
  const target = midnight ? `${nextDay(date)}T00:00:00` : `${date}T${time || '20:00'}:00`
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    if (!enabled) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [enabled])
  if (!enabled || now === null) return null
  const diff = new Date(target).getTime() - now
  if (!(diff > 0)) return null
  const parts = [
    ['days', Math.floor(diff / 86400000)],
    ['hours', Math.floor((diff % 86400000) / 3600000)],
    ['mins', Math.floor((diff % 3600000) / 60000)],
    ['secs', Math.floor((diff % 60000) / 1000)],
  ] as const
  return (
    <section className="relative px-4 py-14 text-center" style={{ background: P.black }}>
      <Caps size={11.5}>{midnight ? 'Until midnight' : 'Until we begin'}</Caps>
      <div className="mt-6 flex items-start justify-center gap-3" style={{ fontFamily: display, fontSize: 'clamp(30px, 10.5cqi, 50px)', lineHeight: 1 }}>
        {parts.map(([k, v]) => (
          <div key={k} className="flex flex-col items-center">
            <div className="flex gap-1">
              {String(v).padStart(2, '0').split('').map((d, i) => <FlipDigit key={i} value={d} />)}
            </div>
            <p className="mt-2 uppercase" style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.28em', color: P.faint }}>{k}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Leave it in the old year; send a wish up ──────────────────────── */

function Ritual({ oldYear, newYear, isPreview }: { oldYear: number; newYear: number; isPreview: boolean }) {
  const [text, setText] = useState('')
  const [burnt, setBurnt] = useState<string | null>(null)
  const [wish, setWish] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  const letters = useMemo(() => {
    if (!burnt) return []
    const rand = rng(burnt.length * 31 + 7)
    return burnt.split('').map((ch) => ({ ch, x: r1(-40 + rand() * 80), y: r1(-60 - rand() * 120), r: Math.round(-90 + rand() * 180), d: Math.round(rand() * 500) }))
  }, [burnt])
  const field: CSSProperties = { fontFamily: sans, background: 'rgba(244,238,223,0.06)', border: `1px solid ${P.rule}`, color: P.text }

  return (
    <section className="relative overflow-hidden px-5 py-16" style={{ background: `radial-gradient(100% 60% at 50% 0%, ${P.navy}, ${P.midnight} 70%)`, color: P.text, containerType: 'inline-size' }}>
      <Stars count={50} seed={33} />
      <Reveal disabled={isPreview} className="relative">
        <Heading kicker="Before midnight">Leave it in {oldYear}</Heading>
        <p className="mx-auto mt-3 max-w-[22rem] text-center text-[15px] leading-6" style={{ color: P.soft }}>
          Write one thing you’re not taking with you. Nobody else sees it — not even us.
        </p>
      </Reveal>
      <div className="relative mx-auto mt-7 w-[min(100%,24rem)]">
        {!burnt ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (text.trim()) setBurnt(text.trim().slice(0, 60))
            }}
            className="flex gap-2"
          >
            <input value={text} onChange={(e) => setText(e.target.value.slice(0, 60))} placeholder="the doom-scrolling" className="min-w-0 flex-1 rounded-none px-4 py-3 text-[16px] outline-none" style={field} aria-label={`Something to leave in ${oldYear}`} />
            <button type="submit" className="ny-btn shrink-0 px-4 text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: sans, background: FOIL, color: P.black }}>Let it go</button>
          </form>
        ) : (
          <div className="relative flex min-h-[86px] flex-col items-center justify-center text-center">
            <p className="relative text-[22px]" style={{ fontFamily: display, fontStyle: 'italic' }} aria-label={`${burnt} — gone`}>
              {letters.map((l, i) => (
                <span key={i} className="ny-burn inline-block whitespace-pre" style={{ '--x': `${l.x}px`, '--y': `${l.y}px`, '--r': `${l.r}deg`, animationDelay: `${l.d}ms` } as CSSProperties}>{l.ch}</span>
              ))}
            </p>
            <p className="ny-after absolute text-[16px]" style={{ color: P.soft }}>Gone. {oldYear} can keep it.</p>
          </div>
        )}
      </div>

      <div className="relative mx-auto mt-12 w-[min(100%,24rem)] text-center">
        <Caps size={11}>And for {newYear}</Caps>
        {!sent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (wish.trim()) setSent(wish.trim().slice(0, 70))
            }}
            className="mt-4 flex gap-2"
          >
            <input value={wish} onChange={(e) => setWish(e.target.value.slice(0, 70))} placeholder="more long dinners with friends" className="min-w-0 flex-1 rounded-none px-4 py-3 text-[16px] outline-none" style={field} aria-label={`A wish for ${newYear}`} />
            <button type="submit" className="ny-btn shrink-0 px-4 text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: sans, border: `1px solid ${P.gold}`, color: P.goldLight }}>Send it up</button>
          </form>
        ) : (
          <div className="relative mt-4 h-[150px]">
            <div className="ny-wishup absolute inset-x-0 bottom-0 flex flex-col items-center">
              <span className="ny-wishstar block h-3 w-3 rounded-full" style={{ background: '#FFF4D0', boxShadow: '0 0 12px 4px rgba(255,226,154,0.85), 0 0 34px 10px rgba(255,226,154,0.35)' }} />
              <span className="ny-wishtext mt-3 px-2 text-[17px]" style={{ fontFamily: display, fontStyle: 'italic', color: P.goldLight }}>{sent}</span>
            </div>
            <p className="ny-after absolute inset-x-0 bottom-0 text-[14px]" style={{ color: P.faint, animationDelay: '2.2s' }}>It’s up there now, with the others.</p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── RSVP ──────────────────────────────────────────────────────────── */

function NewYearRsvp({ anchor, hosts, what, phone, email, rsvpBy, guest, isPreview }: { anchor: string; hosts: string; what: string; phone?: string; email?: string; rsvpBy?: string; guest: string; isPreview: boolean }) {
  const [who, setWho] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [count, setCount] = useState(2)
  const [song, setSong] = useState('')
  useEffect(() => {
    if (guest) setWho((w) => w || guest)
  }, [guest])
  if (!rsvpChannels({ phone, email, text: '', subject: '' }).length) return null

  const name = who.trim()
  const text =
    answer === 'no'
      ? `${hosts ? `${hosts} — ` : ''}${name ? `it’s ${name}. ` : ''}We can’t make ${what}, and we’re gutted. Have the best night — happy New Year!`
      : `${hosts ? `${hosts}! ` : ''}${name ? `It’s ${name} — ` : ''}count us in for ${what}. ${count === 1 ? 'Just me.' : `${count} of us.`}${song.trim() ? ` Our song for midnight: ${song.trim()}.` : ''} See you on the other side!`
  const channels = rsvpChannels({ phone, email, text, subject: answer === 'no' ? `Can’t make ${what}` : `RSVP — ${what}` })
  const by = dateParts(rsvpBy)
  const field: CSSProperties = { fontFamily: sans, background: 'rgba(244,238,223,0.06)', border: `1px solid ${P.rule}`, color: P.text }
  const chip = (on: boolean): CSSProperties => (on ? { background: FOIL, color: P.black, border: '1px solid transparent' } : { color: P.goldLight, border: `1px solid ${P.rule}` })

  return (
    <section id={anchor} className="relative px-5 py-16" style={{ background: P.black, color: P.text, containerType: 'inline-size' }}>
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
        <Heading kicker={by ? `Kindly reply by ${by.day} ${by.month}` : 'Kindly reply'}>Are you in?</Heading>
        <div className="mt-8 grid grid-cols-2 gap-2.5">
          {(['yes', 'no'] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAnswer(a)} aria-pressed={answer === a} className="ny-btn min-h-[48px] text-[12px] uppercase tracking-[0.22em]" style={{ fontFamily: sans, ...chip(answer === a) }}>
              {a === 'yes' ? 'Count me in' : 'Sadly not'}
            </button>
          ))}
        </div>
        {answer && (
          <div className="ny-pop mt-7 space-y-5">
            <label className="block">
              <Caps color={P.faint} size={10.5}>Your name</Caps>
              <input value={who} onChange={(e) => setWho(e.target.value.slice(0, 60))} placeholder="Jules & Sam" className="mt-2 w-full px-4 py-3 text-[16px] outline-none" style={field} />
            </label>
            {answer === 'yes' && (
              <>
                <div className="flex items-center justify-between">
                  <Caps color={P.faint} size={10.5}>How many of you</Caps>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="ny-btn h-10 w-10 text-[20px]" style={chip(false)} aria-label="One fewer">−</button>
                    <span className="w-6 text-center text-[22px]" style={{ fontFamily: display }}>{count}</span>
                    <button type="button" onClick={() => setCount((c) => Math.min(20, c + 1))} className="ny-btn h-10 w-10 text-[20px]" style={chip(false)} aria-label="One more">+</button>
                  </div>
                </div>
                <label className="block">
                  <Caps color={P.faint} size={10.5}>A song for midnight (optional)</Caps>
                  <input value={song} onChange={(e) => setSong(e.target.value.slice(0, 80))} placeholder="Dancing Queen, obviously" className="mt-2 w-full px-4 py-3 text-[16px] outline-none" style={field} />
                </label>
              </>
            )}
            <div className="grid gap-2.5">
              {channels.map((c) => (
                <a
                  key={c.kind}
                  href={isPreview ? undefined : c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className="ny-btn flex min-h-[50px] items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: sans, background: FOIL, color: P.black }}
                >
                  <ChannelIcon kind={c.kind} /> Send by {c.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ── The invitation ────────────────────────────────────────────────── */

type Phase = 'waiting' | 'count' | 'midnight' | 'open'

export default function NewYearMidnight({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const hosts = data.hostNames?.trim() || ''
  const year = yearWelcomed(data.date)
  const title = data.title?.trim() || 'New Year’s Eve'
  const main = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const where = [venue, address].filter(Boolean).join(', ')
  const note = useMemo(() => parseLines(data.message), [data.message])
  const night = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 8), [data.galleryImages])
  const music = /^https?:\/\//i.test(data.musicUrl || '') ? data.musicUrl : ''
  const homeNote = data.afterNote?.trim() || ''
  const what = /new year/i.test(title) ? title : `${title} — New Year’s Eve`

  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])
  const dear = guest || data.guestLine?.trim() || ''

  /* waiting → ten to one → midnight → open */
  const [phase, setPhase] = useState<Phase>('waiting')
  const [count, setCount] = useState(10)
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const toggleMusic = useCallback(async () => {
    const a = audio.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
      return
    }
    try {
      await a.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [playing])
  const begin = useCallback(() => {
    if (phase !== 'waiting') return
    if (reduced) {
      setPhase('open')
      return
    }
    setPhase('count')
    const step = 300
    for (let i = 1; i <= 10; i++) timers.current.push(window.setTimeout(() => setCount(10 - i), i * step))
    timers.current.push(
      window.setTimeout(() => {
        setPhase('midnight')
        // The song starts on the stroke of twelve.
        if (music && !isPreview && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
      }, 10 * step + 60),
    )
    // The gold year blooms as the sparks that spelled it let go (lib: Fireworks).
    timers.current.push(window.setTimeout(() => setPhase('open'), 10 * step + 4150))
  }, [phase, reduced, music, isPreview])

  const ids = { night: `${uid}-night`, rsvp: `${uid}-rsvp` }
  const after = phase === 'midnight' || phase === 'open'
  const hasRsvp = rsvpChannels({ phone: data.rsvpPhone, email: data.rsvpEmail, text: '', subject: '' }).length > 0
  const longest = Math.max(4, ...title.split(/\s+/).map((w) => w.length + 1))
  const titleCqi = Math.min(12, 80 / (longest * 0.46))

  return (
    <div className={`ny relative ph-${phase}`} style={{ background: P.black, color: P.text, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .ny .ny-star { animation: ny-twinkle ease-in-out infinite; opacity: .3; }
        @keyframes ny-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: .9; } }
        .ny .ny-second { animation: ny-tick 60s steps(60) infinite; }
        @keyframes ny-tick { to { transform: rotate(360deg); } }
        .ny .ny-minute { transform: rotate(-6deg); }
        .ny .ny-hour { transform: rotate(-0.5deg); }
        .ny.ph-count .ny-second { animation: ny-sweep 3.3s linear forwards; }
        @keyframes ny-sweep { from { transform: rotate(-60deg); } to { transform: rotate(0deg); } }
        .ny.ph-count .ny-minute, .ny.ph-midnight .ny-minute { transform: rotate(0); transition: transform 3.2s cubic-bezier(.6,0,.4,1); }
        .ny.ph-count .ny-hour, .ny.ph-midnight .ny-hour { transform: rotate(0); transition: transform 3.2s ease; }
        .ny .ny-clockwrap { transition: transform 1.2s cubic-bezier(.5,0,.3,1), opacity 1s ease; }
        .ny.ph-midnight .ny-clockwrap { transform: scale(1.9); opacity: 0; }
        .ny .ny-intro { transition: opacity .5s ease; }
        .ny:not(.ph-waiting) .ny-intro { opacity: 0; pointer-events: none; }
        .ny .ny-num { animation: ny-num .33s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes ny-num { from { opacity: 0; transform: scale(1.5); } }
        .ny .ny-flash { opacity: 0; }
        .ny.ph-midnight .ny-flash { animation: ny-flash 1.1s ease-out both; }
        @keyframes ny-flash { 0% { opacity: 0; } 12% { opacity: .85; } 100% { opacity: 0; } }
        .ny .ny-confetti { animation: ny-fall cubic-bezier(.3,.4,.5,1) both; }
        @keyframes ny-fall { from { transform: translate(0, 0) rotate(0); opacity: 1; } 85% { opacity: 1; } to { transform: translate(var(--x), 105vh) rotate(var(--r)); opacity: 0; } }
        .ny .ny-hint { animation: ny-hint 2.4s ease-in-out infinite; }
        @keyframes ny-hint { 0%, 100% { box-shadow: 0 0 0 0 rgba(216,178,90,.45); } 60% { box-shadow: 0 0 0 14px rgba(216,178,90,0); } }
        .ny .ny-rise { animation: ny-rise 1.1s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes ny-rise { from { opacity: 0; transform: translateY(16px); } }
        .ny .ny-year { animation: ny-year 1.6s ease both; }
        @keyframes ny-year { from { opacity: 0; filter: blur(8px); letter-spacing: .3em; } }
        .ny .ny-shine { background-size: 220% 100%; animation: ny-shine 6s ease-in-out infinite; }
        @keyframes ny-shine { 0%, 100% { background-position: 0% 0; } 50% { background-position: 100% 0; } }
        .ny .ny-btn { transition: opacity .18s ease, transform .18s ease; }
        .ny .ny-btn:hover { opacity: .9; }
        .ny .ny-btn:active { transform: scale(.98); }
        .ny .ny-pop { animation: ny-pop .45s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes ny-pop { from { opacity: 0; transform: translateY(10px); } }
        .ny .ny-flipin { animation: ny-flip .45s cubic-bezier(.3,.7,.3,1) both; transform-origin: 50% 50%; }
        @keyframes ny-flip { from { transform: perspective(240px) rotateX(-85deg); opacity: .25; } }
        .ny .ny-burn { animation: ny-burn 1.5s cubic-bezier(.3,.4,.4,1) both; }
        @keyframes ny-burn { 0% { color: #F4EEDF; } 25% { color: #FFB45C; text-shadow: 0 0 10px #FF8A3C; } 100% { color: #FFE29A; opacity: 0; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(.4); filter: blur(3px); } }
        .ny .ny-after { opacity: 0; animation: ny-after .8s ease 1.6s both; }
        @keyframes ny-after { to { opacity: 1; } }
        .ny .ny-wishup { animation: ny-wishup 2.2s cubic-bezier(.3,.6,.3,1) both; }
        @keyframes ny-wishup { from { transform: translateY(0); } to { transform: translateY(-104px); } }
        .ny .ny-wishtext { animation: ny-wishtext 2.2s ease both; }
        @keyframes ny-wishtext { 0%, 40% { opacity: 1; } 100% { opacity: 0; transform: scale(.6); } }
        .ny .ny-wishstar { animation: ny-glow 2.4s ease-in-out 2.2s infinite; }
        @keyframes ny-glow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .75; transform: scale(.82); } }
        .ny .ny-strip { scrollbar-width: none; }
        .ny .ny-strip::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .ny .ny-star, .ny .ny-second, .ny .ny-hint, .ny .ny-shine, .ny .ny-rise, .ny .ny-year { animation: none; }
        }
      `}</style>

      {music && <audio ref={audio} src={music} loop preload="none" />}
      {music && phase === 'open' && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-3 z-40 flex h-10 items-center gap-2 px-3.5 text-[11px] uppercase tracking-[0.2em] backdrop-blur`}
          style={{ color: P.goldLight, background: 'rgba(7,7,12,0.6)', border: `1px solid ${P.rule}` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            {playing ? <path strokeLinecap="round" d="M9 6v12M15 6v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
          </svg>
          {playing ? 'Pause' : 'Music'}
        </button>
      )}

      {/* ── A minute to midnight ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: isPreview ? PREVIEW_H : '100svh', minHeight: isPreview ? undefined : 600, background: `radial-gradient(110% 70% at 50% 35%, ${P.navy}, ${P.midnight} 45%, ${P.black} 100%)` }}>
        <Stars count={70} seed={5} />
        <Fireworks show={after} text={String(year)} font={display} reduced={reduced} />
        {after && <Confetti seed={13} />}
        <div className="ny-flash pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 40%, #FFF6DA, rgba(255,246,218,0.2))' }} />

        {phase !== 'open' && (
          <div className="absolute inset-0 mx-auto flex w-[min(100%,30rem)] flex-col items-center justify-center px-6 text-center" style={{ containerType: 'inline-size' }}>
            <div className="ny-intro">
              {dear && <Caps className="mb-4" size={11}>For {dear}</Caps>}
              <p style={{ fontFamily: deco, fontSize: 'clamp(30px, 10cqi, 44px)', lineHeight: 1.1, color: P.goldLight }}>It’s almost midnight.</p>
              <p className="mt-2" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(16px, 5cqi, 20px)', color: P.soft }}>
                {hosts ? `${hosts} saved you a glass.` : 'We saved you a glass.'}
              </p>
            </div>
            <div className="ny-clockwrap relative mt-8 w-[min(70%,17rem)]">
              <Clock uid={`${uid}c`} />
              {phase === 'count' && count > 0 && (
                <span key={count} className="ny-num absolute inset-0 flex items-center justify-center" style={{ ...foil({ fontFamily: display, fontSize: 'clamp(70px, 26cqi, 120px)', lineHeight: 1, textShadow: 'none' }) }}>
                  {count}
                </span>
              )}
            </div>
            <div className="ny-intro mt-9">
              <button
                type="button"
                onClick={begin}
                aria-label="Count down to midnight and open the invitation"
                className="ny-hint ny-btn inline-flex min-h-[52px] items-center px-8 text-[12.5px] uppercase tracking-[0.3em]"
                style={{ fontFamily: sans, background: FOIL, color: P.black }}
              >
                Count us in
              </button>
            </div>
          </div>
        )}

        {phase === 'open' && (
          <div className="absolute inset-0 mx-auto w-[min(100%,30rem)] px-6 text-center" style={{ containerType: 'inline-size' }}>
            {/* where the fireworks spelled it */}
            <p className="ny-year ny-shine absolute inset-x-0" style={{ top: '27%', transform: 'translateY(-50%)', ...foil({ fontFamily: display, fontWeight: 600, fontSize: 'clamp(84px, min(30cqi, 24svh), 170px)', lineHeight: 0.9, letterSpacing: '0.02em' }), backgroundSize: '220% 100%' }}>
              {year}
            </p>
            <div className="absolute inset-x-6" style={{ top: 'calc(27% + clamp(46px, 15cqi, 86px))' }}>
              <div className="ny-rise" style={{ animationDelay: '500ms' }}>
                <Caps size={11}>{guest ? `${guest} — ` : ''}{hosts ? `${hosts} invite you to` : 'You’re invited to'}</Caps>
              </div>
              <h1 className="ny-rise mt-3" style={{ fontFamily: deco, fontWeight: 400, fontSize: `clamp(34px, ${titleCqi.toFixed(1)}cqi, 64px)`, lineHeight: 1.05, color: P.text, textWrap: 'balance', animationDelay: '650ms' }}>
                {title}
              </h1>
              {main && (
                <p className="ny-rise mt-4" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(18px, 5.6cqi, 24px)', color: P.goldLight, animationDelay: '800ms' }}>
                  {main.weekday} {main.day} {main.month}
                  {time && ` · from ${time}`}
                </p>
              )}
              {venue && <p className="ny-rise mt-1 text-[15px]" style={{ color: P.soft, animationDelay: '880ms' }}>{venue}</p>}
              <div className="ny-rise mt-7 flex justify-center gap-2.5" style={{ animationDelay: '1000ms' }}>
                {night.length > 0 && (
                  <a href={`#${ids.night}`} className="ny-btn inline-flex min-h-[46px] items-center px-5 text-[12px] uppercase tracking-[0.22em]" style={{ border: `1px solid ${P.rule}`, color: P.goldLight }}>
                    The night
                  </a>
                )}
                {hasRsvp && (
                  <a href={`#${ids.rsvp}`} className="ny-btn inline-flex min-h-[46px] items-center px-5 text-[12px] uppercase tracking-[0.22em]" style={{ background: FOIL, color: P.black }}>
                    I’m in
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {phase === 'open' && (
        <>
          {data.date && <MidnightCountdown date={data.date} time={data.time} enabled={!isPreview} />}

          {/* ── A note from the hosts ─────────────────────────────────── */}
          {note.length > 0 && (
            <section className="relative px-5 py-16" style={{ background: P.ink, color: P.text, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] px-7 pb-10 pt-9 text-center" style={{ background: P.paper, color: P.paperInk, outline: `1px solid ${P.gold}`, outlineOffset: -10 }}>
                <Fan className="mx-auto h-[22px] w-[90px]" />
                <p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(30px, 9cqi, 40px)', lineHeight: 1.1, color: P.goldDeep }}>{guest ? `Dear ${guest},` : 'Dear friends,'}</p>
                <div className="mt-4 space-y-3 text-[16.5px] leading-7" style={{ fontFamily: display, color: P.paperSoft }}>
                  {note.map((line, i) => <p key={i}>{line}</p>)}
                </div>
                {hosts && <p className="mt-6" style={{ fontFamily: script, fontSize: 32, color: P.paperInk }}>{hosts}</p>}
              </Reveal>
            </section>
          )}

          {/* ── The night, as tickets ──────────────────────────────────── */}
          {night.length > 0 && (
            <section id={ids.night} className="relative px-5 pb-16 pt-14" style={{ background: P.black, color: P.text, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview}>
                <Heading kicker={main ? `${main.weekday} ${main.day} ${main.month}` : 'On the night'}>The night</Heading>
              </Reveal>
              <div className="mx-auto mt-9 grid w-[min(100%,26rem)] gap-3">
                {night.map((item, i) => {
                  const twelve = /^(11:5\d|12:00)\s*(pm)?/i.test(item.time || '') || /midnight|countdown/i.test(item.title)
                  return (
                    <Reveal key={i} disabled={isPreview} delay={i * 70}>
                      <div className="relative flex items-stretch overflow-hidden" style={{ background: twelve ? FOIL : '#131425', color: twelve ? P.black : P.text, border: twelve ? 'none' : `1px solid ${P.rule}` }}>
                        <div className="flex w-[34%] shrink-0 items-center justify-center px-2 py-5 text-center" style={{ borderRight: `1px dashed ${twelve ? 'rgba(7,7,12,0.35)' : P.rule}` }}>
                          <p style={{ fontFamily: display, fontSize: 21, lineHeight: 1.1 }}>{item.time || '·'}</p>
                        </div>
                        <div className="flex flex-1 items-center px-5 py-5">
                          <p className="text-[16px] leading-snug">{item.title}</p>
                        </div>
                        <span className="absolute left-[34%] top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: P.black }} />
                        <span className="absolute bottom-0 left-[34%] h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full" style={{ background: P.black }} />
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )}

          <Ritual oldYear={year - 1} newYear={year} isPreview={isPreview} />

          {/* ── The year in photos ─────────────────────────────────────── */}
          {photos.length > 0 && (
            <section className="relative py-16" style={{ background: P.ink, color: P.text, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="px-5">
                <Heading kicker={`${year - 1}, in pictures`}>The year we had</Heading>
              </Reveal>
              <div className="ny-strip mt-8 flex snap-x snap-mandatory gap-0 overflow-x-auto px-[8%]" style={{ background: '#111' }}>
                {photos.map((src, i) => (
                  <figure key={`${src}-${i}`} className="relative shrink-0 snap-center px-2 py-7" style={{ width: 'min(64cqi, 17rem)', backgroundImage: 'radial-gradient(circle at 50% 50%, #2A2A2A 3px, transparent 3.6px)', backgroundSize: '18px 14px', backgroundRepeat: 'repeat-x', backgroundPosition: '0 6px, 0 calc(100% - 6px)' }}>
                    <div className="absolute inset-x-0 bottom-[6px] h-[10px]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2A2A2A 3px, transparent 3.6px)', backgroundSize: '18px 10px', backgroundRepeat: 'repeat-x' }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" style={{ filter: 'saturate(0.92) contrast(1.04)' }} />
                    <figcaption className="mt-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: '#D8B25A', fontFamily: sans }}>{String(i + 1).padStart(2, '0')} · {year - 1}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em]" style={{ color: P.faint }}>Swipe</p>
            </section>
          )}

          {/* ── What to wear ──────────────────────────────────────────── */}
          {data.dressCode?.trim() && (
            <section className="relative px-5 py-16 text-center" style={{ background: `radial-gradient(90% 70% at 50% 50%, #191A30, ${P.black})`, color: P.text, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)]">
                <Heading kicker="Dress">What to wear</Heading>
                <p className="mt-5" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(24px, 7.6cqi, 32px)', lineHeight: 1.25, color: P.text, textWrap: 'balance' }}>{data.dressCode.trim()}</p>
                {dressSwatches(data.dressCode).length > 0 && (
                  <div className="mt-7 flex justify-center gap-3" aria-hidden>
                    {dressSwatches(data.dressCode).map((c, i) => (
                      <span key={i} className="block h-11 w-11 rounded-full" style={{ background: c, boxShadow: '0 0 0 1px rgba(216,178,90,0.5)' }} />
                    ))}
                  </div>
                )}
              </Reveal>
            </section>
          )}

          {/* ── Where, and getting home ───────────────────────────────── */}
          {where && (
            <section className="relative px-5 py-16" style={{ background: P.black, color: P.text, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="relative mx-auto w-[min(100%,27rem)] px-6 pb-9 pt-10 text-center" style={{ border: `1px solid ${P.rule}` }}>
                <span className="absolute left-2 top-2 h-4 w-4 border-l border-t" style={{ borderColor: P.gold }} />
                <span className="absolute right-2 top-2 h-4 w-4 border-r border-t" style={{ borderColor: P.gold }} />
                <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l" style={{ borderColor: P.gold }} />
                <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r" style={{ borderColor: P.gold }} />
                <Caps size={11}>Where</Caps>
                <p className="mt-3" style={{ fontFamily: deco, fontSize: 'clamp(30px, 9cqi, 42px)', lineHeight: 1.1, color: P.goldLight }}>{venue || address}</p>
                {venue && address && <p className="mt-2 text-[15px] leading-6" style={{ color: P.soft }}>{address}</p>}
                {main && (
                  <p className="mt-4 text-[15px]" style={{ color: P.text }}>
                    {main.long}
                    {time && ` · from ${time}`}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  <Btn href={mapsHref(data.mapsUrl, venue, address)} isPreview={isPreview} solid>Directions</Btn>
                  <Btn href={calendarHref(`${title}${hosts ? ` — ${hosts}` : ''}`, data.date, data.time, where, 6)} isPreview={isPreview}>Calendar</Btn>
                </div>
                {homeNote && (
                  <div className="mt-8 border-t pt-6" style={{ borderColor: P.rule }}>
                    <Caps size={10.5} color={P.faint}>Getting home</Caps>
                    <p className="mt-2 text-[15px] leading-6" style={{ color: P.soft }}>{homeNote}</p>
                  </div>
                )}
              </Reveal>
            </section>
          )}

          <NewYearRsvp anchor={ids.rsvp} hosts={hosts} what={what} phone={data.rsvpPhone} email={data.rsvpEmail} rsvpBy={data.rsvpBy} guest={guest} isPreview={isPreview} />

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title={`Toasts for ${year}`}
              intro={`Raise a glass early — leave a toast for ${hosts || 'the hosts'}. Everyone who opens this invitation can read it.`}
              noun="toast"
              previewWishes={SAMPLE_WISHES}
              namePlaceholder="e.g. Jules & Sam"
            />
          )}

          {/* ── Foot ──────────────────────────────────────────────────── */}
          <footer className="relative overflow-hidden px-6 pb-10 pt-16 text-center" style={{ background: `linear-gradient(180deg, ${P.black}, ${P.midnight})` }}>
            <Stars count={40} seed={88} />
            <Fan className="relative mx-auto h-[26px] w-[110px]" />
            <p className="relative mt-4" style={{ fontFamily: script, fontSize: 40, lineHeight: 1.1, color: P.goldLight }}>See you on the other side</p>
            <p className="relative mt-3" style={{ ...foil({ fontFamily: display, fontSize: 54, lineHeight: 1, fontWeight: 600 }) }}>{year}</p>
            {hosts && <p className="relative mt-3 text-[12px] uppercase tracking-[0.34em]" style={{ color: P.faint }}>{hosts}</p>}
            <div className="relative mt-9">
              <Credit isPreview={isPreview} color={P.faint} linkColor={P.text} />
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
