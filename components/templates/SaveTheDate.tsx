'use client'

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { bodoniDisplay } from './kit/fonts/bodoniDisplay'
import { jost } from './kit/fonts/jost'
import { caveat } from './kit/fonts/caveat'
import { calendarDayHref, dateParts, grain, mapsHref, parseLines, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Save the Date — a letterpress card on cotton paper.
 * Two inks, terracotta and a green so dark it reads black, pressed into a
 * deckle-edged cotton card that lies on a sage linen table. A small month
 * calendar is printed on the card. When the page opens the card slides onto
 * the table, a deckle-cut snapshot of the couple is taped to its corner, the
 * day gets a loop of red pencil round it, and the pencil is put down.
 * Below it, the letter that came in the same envelope: days to go, the
 * couple's note, add-to-calendar, the map and the wedding website.
 */

const P = {
  linen: '#C7CBBA',
  linenDeep: '#B5BAA7',
  card: '#F8F3E8',
  ink: '#27302A',
  soft: 'rgba(39,48,42,0.76)',
  faint: 'rgba(39,48,42,0.54)',
  rule: 'rgba(39,48,42,0.16)',
  clay: '#A8472A',
  claySoft: 'rgba(168,71,42,0.62)',
  print: '#FBF8F1',
}

const serif = bodoniDisplay.style.fontFamily
const sans = jost.style.fontFamily
const hand = caveat.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: 'transparent',
  surface: P.card,
  ink: P.ink,
  muted: P.soft,
  line: 'rgba(39,48,42,0.14)',
  accent: P.ink,
  onAccent: P.card,
  heading: serif,
  body: sans,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 38px)', fontWeight: 400, textWrap: 'balance' },
}

const SAMPLE_WISHES = [
  { name: 'Aunt Ros', message: 'Time off booked already. There had better be dancing.' },
  { name: 'Maggie & Tom', message: 'It’s on the fridge. We wouldn’t miss it for anything.' },
]

/* ── Drawing ─────────────────────────────────────────────────────────── */

type Pt = [number, number]
const n1 = (n: number) => String(Math.round(n * 10) / 10)

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A closed path through the points, smoothed with quadratic curves at their midpoints. */
function closedPath(pts: Pt[]): string {
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const start = mid(pts[pts.length - 1], pts[0])
  let d = `M${n1(start[0])} ${n1(start[1])}`
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % pts.length])
    d += `Q${n1(p[0])} ${n1(p[1])} ${n1(m[0])} ${n1(m[1])}`
  })
  return `${d}Z`
}

/**
 * Outline of a deckle-edged sheet in a w×h box. Each edge wanders inward by up
 * to `amp` in short correlated runs, with the odd deeper bite where the pulp
 * was thin — the way the edge of handmade cotton paper feathers.
 */
function deckle(w: number, h: number, seed: number, amp: number, step = 4.5): string {
  const r = rng(seed)
  const pts: Pt[] = []
  let drift = 0
  const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
    const n = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) / step))
    for (let i = 0; i < n; i++) {
      const t = i / n
      drift = drift * 0.8 + (r() - 0.5) * amp * 0.5
      let d = amp * 0.45 + drift + (r() - 0.5) * amp * 0.18
      if (r() < 0.035) d += amp * (0.5 + r() * 0.9)
      d = Math.max(0.2, d)
      pts.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d])
    }
  }
  edge(0, 0, w, 0, 0, 1)
  edge(w, 0, w, h, -1, 0)
  edge(w, h, 0, h, 0, -1)
  edge(0, h, 0, 0, 1, 0)
  return closedPath(pts)
}

/** The wavy cut of a deckle-edged photo print: a regular scallop, slightly uneven. */
function scallop(w: number, h: number, seed: number, period = 8, amp = 1.8): string {
  const r = rng(seed)
  const pts: Pt[] = []
  const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0)
    const n = Math.round(len / 2)
    for (let i = 0; i < n; i++) {
      const t = i / n
      const d = amp * (0.5 + 0.5 * Math.sin((t * len * Math.PI * 2) / period)) + (r() - 0.5) * 0.5
      pts.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d])
    }
  }
  edge(0, 0, w, 0, 0, 1)
  edge(w, 0, w, h, -1, 0)
  edge(w, h, 0, h, 0, -1)
  edge(0, h, 0, 0, 1, 0)
  return closedPath(pts)
}

/** An open stroke through points. */
function openPath(pts: Pt[]): string {
  return `M${pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join('L')}`
}

/** A line ruled by hand: straight-ish, never quite. */
function handRule(len: number, seed: number, wobble = 0.7): string {
  const r = rng(seed)
  const pts: Pt[] = []
  let y = 2
  for (let x = 0; x <= len; x += 6) {
    y += (r() - 0.5) * wobble
    y = Math.min(3.4, Math.max(0.6, y))
    pts.push([x, y])
  }
  return openPath(pts)
}

/** One quick loop of pencil round a number: it opens out a little and overshoots its start. */
function loopPath(seed: number): string {
  const r = rng(seed)
  const pts: Pt[] = []
  const a0 = -2.3 + r() * 0.3
  const tilt = -0.16
  const N = 60
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const a = a0 + t * Math.PI * 2 * 1.18
    // flatter on the way round, wider where the hand swings back past the start
    const rx = 19 + t * 3.4 + Math.sin(a * 2 + 0.6) * 1.1
    const ry = 12.6 + t * 2.2 + Math.cos(a * 3) * 0.5
    const x = Math.cos(a) * rx + t * 2.2
    const yy = Math.sin(a) * ry - t * 1.8
    pts.push([x * Math.cos(tilt) - yy * Math.sin(tilt), x * Math.sin(tilt) + yy * Math.cos(tilt)])
  }
  return openPath(pts)
}

/* ── Paper things ────────────────────────────────────────────────────── */

const SHEET_SHADOW = 'drop-shadow(0 1px 0.6px rgba(37,44,34,0.2)) drop-shadow(0 14px 16px rgba(37,44,34,0.2))'

/**
 * A deckle-edged sheet of cotton paper, filling its parent: a translucent
 * fringe where the fibres thin out, the sheet itself with a faint grain, and a
 * few flecks of cotton. Drawn in a fixed box and stretched to the card; the
 * wobble is too small for the stretch to show.
 */
function CottonSheet({ uid, seed, w = 340, h = 560 }: { uid: string; seed: number; w?: number; h?: number }) {
  const { fringe, body, flecks } = useMemo(() => {
    const r = rng(seed * 7 + 3)
    const bits: { d: string; o: number; dot: boolean }[] = []
    for (let i = 0; i < Math.round((w * h) / 7000); i++) {
      const x = 12 + r() * (w - 24)
      const y = 12 + r() * (h - 24)
      if (r() < 0.45) {
        bits.push({ d: `M${n1(x)} ${n1(y)}h0.01`, o: 0.18 + r() * 0.14, dot: true })
      } else {
        const a = r() * Math.PI
        const l = 3 + r() * 6
        const bx = x + Math.cos(a) * l * 0.5 + (r() - 0.5) * 3
        const by = y + Math.sin(a) * l * 0.5 + (r() - 0.5) * 3
        bits.push({ d: `M${n1(x)} ${n1(y)}Q${n1(bx)} ${n1(by)} ${n1(x + Math.cos(a) * l)} ${n1(y + Math.sin(a) * l)}`, o: 0.12 + r() * 0.12, dot: false })
      }
    }
    return { fringe: deckle(w, h, seed, 3.6, 2.6), body: deckle(w, h, seed + 11, 2.8), flecks: bits }
  }, [seed, w, h])
  const id = `${uid}-cotton-${seed}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: 'visible', filter: SHEET_SHADOW }} aria-hidden>
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.33  0 0 0 0 0.29  0 0 0 0 0.22  0 0 0 0.11 0" result="tone" />
          <feComposite in="tone" in2="SourceGraphic" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      <path d={fringe} fill={P.card} opacity={0.6} />
      <path d={body} fill={P.card} filter={`url(#${id})`} />
      <g fill="none" stroke="#8E7B62" strokeLinecap="round">
        {flecks.map((b, i) => (
          <path key={i} d={b.d} strokeWidth={b.dot ? 1.1 : 0.45} opacity={b.o} />
        ))}
      </g>
    </svg>
  )
}

/** A deckle-cut snapshot, the kind that came back from the chemist in the fifties. */
function Snapshot({ src, alt }: { src: string; alt: string }) {
  const edge = useMemo(() => scallop(200, 244, 5), [])
  return (
    <div className="relative" style={{ aspectRatio: '200 / 244' }}>
      <svg viewBox="0 0 200 244" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible', filter: 'drop-shadow(0 1px 0.5px rgba(37,44,34,0.25)) drop-shadow(0 8px 9px rgba(37,44,34,0.22))' }} aria-hidden>
        <path d={edge} fill={P.print} />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute object-cover"
        style={{ left: '7.5%', top: '6.2%', width: '85%', height: '76%', filter: 'sepia(0.2) saturate(0.88) contrast(1.04)' }}
      />
      <span aria-hidden className="absolute" style={{ left: '7.5%', top: '6.2%', width: '85%', height: '76%', boxShadow: 'inset 0 0 0 0.5px rgba(39,48,42,0.25)' }} />
    </div>
  )
}

/** A strip of paper tape with torn ends. */
function Tape({ style }: { style?: CSSProperties }) {
  return (
    <span aria-hidden className="sd-tape absolute block" style={style}>
      <svg viewBox="0 0 120 26" preserveAspectRatio="none" className="block h-full w-full">
        <path
          d="M3 1.5 L117 0.5 L115.2 4 L118.4 7.6 L115.8 11.2 L119 15 L116.4 18.6 L118.8 22.4 L116 25.5 L2 25 L4.6 21.6 L1.2 18 L4.2 14.4 L0.8 10.8 L3.8 7.2 L1 3.8Z"
          fill="rgba(234,226,206,0.8)"
        />
        <path d="M6 8H112M6 16H113" stroke="rgba(255,255,255,0.35)" strokeWidth={0.6} />
      </svg>
    </span>
  )
}

/** A red editing pencil, sharpened, lying on the table. Point at the left. */
function Pencil({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 30" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <path d="M24 24.5 L314 26 L314 28.6 L30 27.6Z" fill="rgba(37,44,34,0.1)" />
      <path d="M24 23 L314 23.6 L314 25 L28 24.6Z" fill="rgba(37,44,34,0.12)" />
      {/* the shaved wood, with the scalloped line where the lacquer was cut */}
      <path d="M44 6 C41 8 42.5 10 41 12.5 C42.5 15 41 17 44 20 L14 14.2 L14 11.8Z" fill="#E4C7A0" />
      <path d="M44 6 C41 8 42.5 10 41 12.5 C42.5 15 41 17 44 20" fill="none" stroke="#8C3A22" strokeWidth={0.8} />
      <path d="M22 12.1 L6 13 L22 13.9Z" fill={P.clay} />
      <path d="M14 11.8 L22 12.1 L22 13.9 L14 14.2Z" fill="#C9AA80" />
      {/* lacquered hexagonal body: three faces in the light */}
      <path d="M44 6 H310 V10.6 H42.4Z" fill="#B9502F" />
      <path d="M42.4 10.6 H310 V15.6 H42.4Z" fill="#A4422A" />
      <path d="M42.4 15.6 H310 V20 H44Z" fill="#8A3622" />
      <path d="M48 7.6 H306" stroke="rgba(255,255,255,0.28)" strokeWidth={0.9} />
      {/* the unpainted end */}
      <path d="M310 6 H314 V20 H310Z" fill="#D8BC94" />
      <circle cx="312" cy="13" r="1.7" fill={P.clay} />
      <text x="120" y="14.4" fontFamily={sans} fontSize="5.2" letterSpacing="1.4" fill="rgba(240,224,190,0.72)">
        RED · SOFT
      </text>
    </svg>
  )
}

/* ── The calendar ────────────────────────────────────────────────────── */

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/**
 * The month, set small, Sunday first like a printed wall calendar. Decorative —
 * the date is spelled out in words under it — so it is hidden from screen readers.
 */
function MonthGrid({ y, m, d, seed }: { y: number; m: number; d: number; seed: number }) {
  const first = new Date(y, m - 1, 1).getDay()
  const total = new Date(y, m, 0).getDate()
  const cells: (number | null)[] = [...Array<null>(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  const loop = useMemo(() => loopPath(seed), [seed])
  return (
    <div aria-hidden>
      <div className="grid grid-cols-7 text-center" style={{ fontSize: 'clamp(10px, 2.9cqi, 12px)', fontWeight: 500, letterSpacing: '0.1em', color: P.faint }}>
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="mt-[2.4cqi] grid grid-cols-7 text-center tabular-nums" style={{ fontSize: 'clamp(12.5px, 3.9cqi, 15px)', color: P.soft }}>
        {cells.map((n, i) =>
          n === d ? (
            <span key={i} className="relative flex items-center justify-center" style={{ height: 'max(7.5cqi, 21px)', color: P.clay, fontWeight: 600 }}>
              <span className="relative z-[1]">{n}</span>
              <svg viewBox="-27 -19 54 38" className="absolute left-1/2 top-1/2 h-[10.6cqi] w-[15cqi] -translate-x-1/2 -translate-y-1/2" style={{ overflow: 'visible' }}>
                <path className="sd-loop" d={loop} pathLength={1} fill="none" stroke={P.clay} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
                <path className="sd-loop" d={loop} pathLength={1} fill="none" stroke={P.clay} strokeWidth={0.8} strokeLinecap="round" opacity={0.4} transform="translate(0.7 0.5)" />
              </svg>
            </span>
          ) : (
            <span key={i} className="flex items-center justify-center" style={{ height: 'max(7.5cqi, 21px)' }}>
              {n ?? ''}
            </span>
          ),
        )}
      </div>
    </div>
  )
}

/* ── Days to go ──────────────────────────────────────────────────────── */

/** Its own component so the once-a-second tick re-renders only this. */
function DaysToGo({ date, enabled }: { date?: string; enabled: boolean }) {
  const c = useCountdown(date, undefined, enabled)
  const scribble = useMemo(() => {
    const r = rng(41)
    const pts: Pt[] = []
    for (let x = 1; x <= 97; x += 4) pts.push([x, 7.2 - Math.pow(x / 97, 1.6) * 4.4 + (r() - 0.5) * 0.7])
    // the hand turns at the end and comes back fast and low, trailing off early
    pts.push([99.5, 2.6], [98.5, 4.8])
    for (let x = 94; x >= 30; x -= 8) pts.push([x, 6.4 + (94 - x) * 0.05 + (r() - 0.5) * 0.9])
    return openPath(pts)
  }, [])
  if (!c) return null
  const days = c.days + (c.hours || c.minutes || c.seconds ? 1 : 0)
  return (
    <div className="mb-[10cqi]">
      <p className="relative inline-block leading-[0.86]" style={{ fontFamily: serif, fontSize: 'clamp(84px, 30cqi, 124px)', color: P.clay, fontVariantNumeric: 'lining-nums' }}>
        {days}
        <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="absolute left-0 top-full mt-[1cqi] block h-[4.4cqi] w-[104%]" style={{ overflow: 'visible' }} aria-hidden>
          <path d={scribble} fill="none" stroke={P.clay} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={0.86} />
        </svg>
      </p>
      <p className="mt-[7cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(25px, 8.4cqi, 32px)', color: P.ink }}>
        {days === 1 ? 'day to go' : 'days to go'}
      </p>
    </div>
  )
}

/* ── Small parts ─────────────────────────────────────────────────────── */

function Label({ children, color = P.faint }: { children: ReactNode; color?: string }) {
  return (
    <p className="uppercase" style={{ fontFamily: sans, fontSize: 12, fontWeight: 500, letterSpacing: '0.26em', color }}>
      {children}
    </p>
  )
}

/** Ink button (solid) or a hairline one. */
function Btn({ href, isPreview, solid, children }: { href: string | null; isPreview: boolean; solid?: boolean; children: ReactNode }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="sd-btn inline-flex min-h-[48px] items-center justify-center gap-2 px-5 text-center"
      style={{
        fontFamily: sans,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: '0.02em',
        borderRadius: 2,
        ...(solid ? { background: P.ink, color: P.card } : { border: `1px solid rgba(39,48,42,0.42)`, color: P.ink }),
      }}
    >
      {children}
    </DirectionsLink>
  )
}

/** "hattieandsam.com" or "https://…" — returns a usable link and a tidy label. */
function website(value?: string): { href: string; label: string } | null {
  const v = (value || '').trim()
  if (!v || /\s/.test(v)) return null
  const href = /^https?:\/\//i.test(v) ? v : /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(v) ? `https://${v}` : null
  if (!href) return null
  const label = href.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')
  return { href, label }
}

/* ── The invitation ──────────────────────────────────────────────────── */

export default function SaveTheDate({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const a = data.brideName?.trim() || 'Hattie'
  const b = data.groomName?.trim() || 'Sam'
  const date = dateParts(data.date)
  const [y, m, d] = (data.date || '').split('-').map(Number)
  const city = data.city?.trim() || ''
  const venue = data.venue?.trim() || ''
  const place = [venue, city].filter(Boolean).join(', ')
  const follow = data.followNote?.trim() || 'Formal invitation to follow'
  const photo = data.couplePhoto && /^(https?:)?\//.test(data.couplePhoto) ? data.couplePhoto : ''
  const note = useMemo(() => parseLines(data.message), [data.message])
  const site = website(data.websiteUrl)
  const calendar = calendarDayHref(`${a} & ${b}’s wedding`, data.date, place || undefined, [`${follow}.`, site?.href].filter(Boolean).join('\n'))
  const map = mapsHref(undefined, venue, city)
  const animate = !isPreview

  // Names are sized by their longest line, and the column is narrower when the snapshot sits beside them.
  const longest = Math.max(a.length, b.length + 2, 4)
  const column = photo ? 52 : 82
  const nameCqi = Math.min(15.5, column / (longest * 0.56))
  const nameSize = `clamp(26px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.1)}px)`

  const rules = useMemo(() => ({ month: handRule(300, 7), letter: handRule(300, 19, 0.9) }), [])

  // The table runs the length of the page: grain, then a loose weave.
  const tooth = grain(0.06)
  const linen: CSSProperties = {
    backgroundColor: P.linen,
    backgroundSize: `${tooth.backgroundSize}, auto, auto`,
    backgroundImage: [
      tooth.backgroundImage,
      'repeating-linear-gradient(0deg, rgba(39,48,42,0.022) 0 1px, transparent 1px 3px, rgba(255,255,255,0.03) 3px 4px, transparent 4px 7px)',
      'repeating-linear-gradient(90deg, rgba(39,48,42,0.018) 0 1px, transparent 1px 4px, rgba(39,48,42,0.012) 4px 5px, transparent 5px 9px)',
    ].join(', '),
  }

  return (
    <div className={`sd relative ${animate ? 'sd-in' : ''}`} style={{ ...linen, color: P.ink, fontFamily: sans, containerType: 'inline-size', overflowX: 'clip' }}>
      <style>{`
        .sd .sd-loop { stroke-dasharray: 1; stroke-dashoffset: 0; }
        .sd.sd-in .sd-card { animation: sd-card 1.15s cubic-bezier(.16,.7,.22,1) .15s both; }
        @keyframes sd-card { from { transform: translateY(72vh) rotate(-7deg); } to { transform: rotate(-1.2deg); } }
        .sd.sd-in .sd-photo { animation: sd-photo .7s cubic-bezier(.3,.62,.25,1) 1.1s both; }
        @keyframes sd-photo { from { transform: translate(34px, -52px) rotate(13deg) scale(1.1); opacity: 0; } 30% { opacity: 1; } to { transform: rotate(4.5deg); } }
        .sd.sd-in .sd-tape { animation: sd-tape .32s ease-out 1.75s both; }
        @keyframes sd-tape { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        .sd.sd-in .sd-loop { animation: sd-draw .85s cubic-bezier(.45,.1,.35,1) 2s both; }
        @keyframes sd-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        .sd.sd-in .sd-hand { animation: sd-hand .6s steps(12) 2.75s both; }
        @keyframes sd-hand { from { clip-path: inset(-60% 100% -160% -10%); } to { clip-path: inset(-60% -60% -160% -10%); } }
        .sd.sd-in .sd-pencil { animation: sd-pencil .75s cubic-bezier(.2,.7,.25,1) 3.1s both; }
        @keyframes sd-pencil { from { transform: translate(46vw, 14vh) rotate(-8deg); } to { transform: rotate(-27deg); } }
        .sd .sd-btn { transition: opacity .18s ease, background-color .18s ease; }
        .sd .sd-btn:hover { opacity: .86; }
        .sd .sd-link { text-decoration-thickness: 1px; text-underline-offset: 5px; }
        @media (prefers-reduced-motion: reduce) {
          .sd.sd-in .sd-card, .sd.sd-in .sd-photo, .sd.sd-in .sd-tape, .sd.sd-in .sd-loop, .sd.sd-in .sd-hand, .sd.sd-in .sd-pencil { animation: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={P.ink} background="rgba(248,243,232,0.9)" border={P.rule} />

      {/* ── On the table: the card ──────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center overflow-hidden px-4"
        style={{ minHeight: isPreview ? 560 : '100svh', paddingTop: photo ? 'clamp(64px, 15cqi, 96px)' : 'clamp(44px, 9cqi, 72px)', paddingBottom: 'clamp(64px, 15cqi, 96px)', backgroundImage: 'radial-gradient(120% 70% at 28% 0%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)' }}
      >
        <div className="relative w-[min(86cqi,380px)]">
          <div className="sd-card relative" style={{ transform: 'rotate(-1.2deg)', containerType: 'inline-size' }}>
            <CottonSheet uid={uid} seed={3} />

            {photo && (
              <figure className="sd-photo absolute z-[2] m-0" style={{ right: '-6cqi', top: '-11cqi', width: '41cqi', transform: 'rotate(4.5deg)' }}>
                <Snapshot src={photo} alt={`${a} and ${b}`} />
                <Tape style={{ left: '24%', top: '-5%', width: '54%', height: '11%', transform: 'rotate(-7deg)' }} />
              </figure>
            )}

            <div className="relative" style={{ padding: '10cqi 8cqi 9cqi', textShadow: '0 1px 0 rgba(255,255,255,0.55)' }}>
              {photo && <span aria-hidden className="float-right" style={{ width: '31cqi', height: '36cqi', marginLeft: '3cqi' }} />}
              <p className="uppercase" style={{ fontSize: 'clamp(10.5px, 3.3cqi, 13px)', fontWeight: 500, letterSpacing: '0.3em', color: P.clay }}>
                Save the date
              </p>
              <h1 className="mt-[5cqi]" style={{ fontFamily: serif, fontWeight: 400, fontSize: nameSize, lineHeight: 0.98, letterSpacing: '-0.01em', color: P.ink }}>
                <span className="block break-words">{a}</span>
                <span className="block break-words">
                  <span style={{ fontStyle: 'italic', color: P.clay }}>&amp;</span>{'\u00A0'}{b}
                </span>
              </h1>
              <p className="mt-[3.4cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(16px, 5.2cqi, 20px)', color: P.soft }}>
                are getting married
              </p>

              <div className="clear-both" />

              {date ? (
                <div className="mt-[7cqi]">
                  <div className="relative flex items-end justify-between">
                    <p style={{ fontFamily: serif, fontSize: 'clamp(21px, 7cqi, 27px)', lineHeight: 1, color: P.ink }}>
                      <span style={{ fontStyle: 'italic' }}>{date.month}</span> <span style={{ color: P.clay }}>{date.year}</span>
                    </p>
                    <span className="sd-hand relative mb-[0.4cqi] mr-[6cqi] block" style={{ transform: 'rotate(-4deg)', textShadow: 'none' }} aria-hidden>
                      <span style={{ fontFamily: hand, fontSize: 'clamp(19px, 6.4cqi, 25px)', lineHeight: 1, color: P.clay }}>pencil us in</span>
                      <svg viewBox="0 0 24 34" className="absolute right-[-7cqi] top-[1.6cqi] h-[10cqi] w-[7cqi]" style={{ overflow: 'visible' }}>
                        <path d="M2 4 C12 2.5 19 8 18.2 29.5" fill="none" stroke={P.clay} strokeWidth={1.4} strokeLinecap="round" />
                        <path d="M13.4 24.6 L18.3 30.2 L22.4 24" fill="none" stroke={P.clay} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <svg viewBox="0 0 300 4" preserveAspectRatio="none" className="mb-[3cqi] mt-[2.4cqi] block h-[4px] w-full" aria-hidden>
                    <path d={rules.month} fill="none" stroke={P.claySoft} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  </svg>
                  <MonthGrid y={y} m={m} d={d} seed={y * 400 + m * 31 + d} />
                </div>
              ) : (
                <p className="mt-[9cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(19px, 6cqi, 24px)', color: P.ink }}>
                  Date to be announced
                </p>
              )}

              <div className="mt-[6cqi] space-y-[1cqi]">
                {date && (
                  <p style={{ fontSize: 'clamp(15px, 4.7cqi, 18px)', fontWeight: 500, color: P.ink }}>
                    {date.long}
                  </p>
                )}
                {venue && <p style={{ fontSize: 'clamp(15px, 4.5cqi, 17px)', color: P.soft }}>{venue}</p>}
                {city && <p style={{ fontSize: 'clamp(15px, 4.5cqi, 17px)', color: P.soft }}>{city}</p>}
              </div>

              <p className="mt-[7cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(15px, 4.6cqi, 18px)', color: P.clay }}>
                {follow}
              </p>
            </div>
          </div>

          <Pencil className="sd-pencil pointer-events-none absolute z-[3] w-[86cqi] max-w-[400px]" style={{ left: '62%', bottom: '-9%', transform: 'rotate(-27deg)', transformOrigin: '4% 50%' }} />
        </div>
      </section>

      {/* ── The letter that came with it ────────────────────────────── */}
      <section className="px-4 pb-14">
        <Reveal disabled={isPreview} className="relative mx-auto w-[min(92cqi,30rem)]">
          <div className="relative" style={{ transform: 'rotate(0.6deg)', containerType: 'inline-size' }}>
            <CottonSheet uid={uid} seed={8} w={340} h={760} />
            <div className="relative px-[8%] pb-[11%] pt-[12%]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>
              <DaysToGo date={data.date} enabled={!isPreview} />

              {note.length > 0 && (
                <div className="mb-[10%]">
                  <div className="space-y-4">
                    {note.map((line, i) => (
                      <p key={i} className="leading-[1.5]" style={{ fontFamily: serif, fontSize: 'clamp(18.5px, 5.9cqi, 21px)', color: P.ink, textWrap: 'pretty' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="mt-5" style={{ fontFamily: hand, fontSize: 'clamp(28px, 9cqi, 34px)', lineHeight: 1, color: P.clay, transform: 'rotate(-2deg)', transformOrigin: 'left', textShadow: 'none' }}>
                    — {a} &amp; {b}
                  </p>
                </div>
              )}

              <svg viewBox="0 0 300 4" preserveAspectRatio="none" className="block h-[4px] w-full" aria-hidden>
                <path d={rules.letter} fill="none" stroke={P.rule} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              </svg>

              <dl className="mt-6 grid grid-cols-[4.6rem_1fr] gap-x-3 gap-y-4">
                <dt className="pt-[3px]"><Label>When</Label></dt>
                <dd style={{ fontSize: 16.5, lineHeight: 1.45 }}>{date ? date.long : 'Date to be announced'}</dd>
                {place && (
                  <>
                    <dt className="pt-[3px]"><Label>Where</Label></dt>
                    <dd style={{ fontSize: 16.5, lineHeight: 1.45 }}>
                      {venue && <span className="block">{venue}</span>}
                      {city && <span className="block" style={{ color: venue ? P.soft : P.ink }}>{city}</span>}
                    </dd>
                  </>
                )}
              </dl>

              {(calendar || map) && (
                <div className="mt-7 grid gap-2.5">
                  {calendar && <Btn href={calendar} isPreview={isPreview} solid>Add to your calendar</Btn>}
                  {map && <Btn href={map} isPreview={isPreview}>See it on a map</Btn>}
                </div>
              )}

              {site && (
                <div className="mt-9">
                  <Label>The details, as they firm up</Label>
                  <DirectionsLink
                    href={site.href}
                    isPreview={isPreview}
                    className="sd-link mt-2 inline-block break-all underline"
                    style={{ fontFamily: serif, fontSize: 'clamp(20px, 6.8cqi, 25px)', color: P.clay, textDecorationColor: P.claySoft }}
                  >
                    {site.label}
                  </DirectionsLink>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title={`Notes for ${a} & ${b}`}
          intro={`Congratulations, a memory, a promise to dance — leave a few words for ${a} and ${b}. Everyone who opens this page can read them.`}
          noun="note"
          previewWishes={SAMPLE_WISHES}
          namePlaceholder="e.g. Maggie & Tom"
        />
      )}

      {/* ── Foot ───────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ backgroundColor: P.linenDeep, ...grain(0.06) }}>
        <p style={{ fontFamily: serif, fontSize: 40, lineHeight: 1, color: P.ink }}>
          {a.charAt(0)}
          <span className="mx-1" style={{ fontStyle: 'italic', fontSize: 30, color: P.clay }}>&amp;</span>
          {b.charAt(0)}
        </p>
        {(date || city) && (
          <p className="mx-auto mt-4 max-w-[22rem]" style={{ fontSize: 14.5, letterSpacing: '0.04em', color: P.soft, textWrap: 'balance' }}>
            {[date ? `${date.day} ${date.month} ${date.year}` : '', city].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={P.faint} linkColor={P.ink} />
        </div>
      </footer>
    </div>
  )
}
