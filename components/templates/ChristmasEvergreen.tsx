'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { playfair } from './kit/fonts/playfair'
import { greatVibes } from './kit/fonts/greatVibes'
import { caveat } from './kit/fonts/caveat'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, mapsHref, parseLines, parseRows, parseSchedule, timeLabel, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import { ChannelIcon, rsvpChannels } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Evergreen — Christmas at home.
 * It begins on the doorstep on a snowy night: a green front door under a
 * glowing fanlight, lanterns either side, and a fat wreath with a kraft gift
 * tag written out to the guest (a link ending ?to=The+Thompsons). They knock —
 * the brass knocker raps twice — the door swings in on golden light and we go
 * through it, into the living room: a fire crackling under a mantel hung with
 * a stocking for everyone in the family, and a tree that twinkles. Then: how
 * many sleeps until Christmas, a stamped letter in the family's hand, the
 * evening as baubles on a ribbon, the table and who is bringing what, a Secret
 * Santa present to unwrap, the year's photos hanging as baubles, a knitted
 * dress code, and an RSVP that asks what you'll bring.
 */

const P = {
  night: '#0B1626',
  nightLift: '#1A2B45',
  pine: '#0F3324',
  pineDeep: '#08200F',
  needle: '#1F5A3C',
  holly: '#B3122E',
  berry: '#D7263D',
  cranberry: '#5E0E1C',
  cranberryDeep: '#3A0811',
  gold: '#D9A441',
  goldLight: '#F3D58A',
  goldDeep: '#A6772A',
  cream: '#FBF3E4',
  paper: '#F6EAD3',
  kraft: '#D7B686',
  ink: '#2A1D14',
  soft: 'rgba(42,29,20,0.74)',
  faint: 'rgba(42,29,20,0.52)',
  rule: 'rgba(42,29,20,0.14)',
  creamSoft: 'rgba(251,243,228,0.8)',
  creamFaint: 'rgba(251,243,228,0.56)',
  creamRule: 'rgba(251,243,228,0.2)',
  ember: '#FF9A3C',
}

const display = playfair.style.fontFamily
const script = greatVibes.style.fontFamily
const hand = caveat.style.fontFamily
const sans = jost.style.fontFamily

/** The opening fills a phone's screen in the builder's preview: about 19.5 : 9, whatever width the phone is drawn at. */
const PREVIEW_H = 'max(520px, 210cqi)'

const GOLD = 'linear-gradient(180deg, #FFF0C2 0%, #F0CC72 45%, #C99335 72%, #F6DB98 100%)'

const WISHES_THEME: InviteTheme = {
  bg: P.cream,
  surface: '#FFFFFF',
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.holly,
  onAccent: P.cream,
  heading: display,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(32px, 9.4cqi, 44px)', color: P.pine },
}

const SAMPLE_WISHES = [
  { name: 'The Thompsons', message: 'We wouldn’t miss it. Freddie has already written his list — and he says Biscuit needs a stocking too.' },
  { name: 'Granny Pat', message: 'Sprouts are sorted. Save me the seat by the fire.' },
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

const goldText = (extra?: CSSProperties): CSSProperties => ({
  backgroundImage: GOLD,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

const isoToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Whole days between two yyyy-mm-dd dates: the number of nights to sleep. */
function nightsBetween(from: string, to: string): number {
  const [a, b] = [from, to].map((iso) => {
    const [y, m, d] = iso.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  })
  return Math.round((b - a) / 86400000)
}

/* ── Snow ──────────────────────────────────────────────────────────── */

function Snow({ count, seed }: { count: number; seed: number }) {
  const flakes = useMemo(() => {
    const rand = rng(seed)
    return Array.from({ length: count }, () => ({
      left: r1(rand() * 100),
      size: r1(2 + rand() * 4.5),
      dur: r1(7 + rand() * 9),
      delay: r1(-rand() * 16),
      drift: r1(-26 + rand() * 52),
      o: r1(0.45 + rand() * 0.5),
    }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="xm-flake absolute -top-3 block rounded-full bg-white"
          style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, '--x': `${f.drift}px` } as CSSProperties}
        />
      ))}
    </div>
  )
}

/* ── The front door ────────────────────────────────────────────────── */

const WREATH = (() => {
  const rand = rng(5)
  const greens = ['#1F5136', '#2A6A44', '#174530', '#33784C', '#245E3D']
  const needles = Array.from({ length: 150 }, () => {
    const a = rand() * Math.PI * 2
    const rr = 34 + rand() * 20
    return {
      x: r1(90 + Math.cos(a) * rr),
      y: r1(112 + Math.sin(a) * rr),
      rot: Math.round((a * 180) / Math.PI + 90 + (rand() * 70 - 35)),
      len: r1(8 + rand() * 7),
      c: greens[Math.floor(rand() * greens.length)],
    }
  })
  const berries = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + rand() * 0.3
    const rr = 40 + rand() * 9
    return { x: r1(90 + Math.cos(a) * rr), y: r1(112 + Math.sin(a) * rr) }
  })
  const cones = [0.4, 1.9, 3.3, 4.6].map((a) => ({ x: r1(90 + Math.cos(a) * 44), y: r1(112 + Math.sin(a) * 44), rot: Math.round((a * 180) / Math.PI) }))
  const lights = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    const rr = 46 + (i % 2 ? 6 : -4)
    return { x: r1(90 + Math.cos(a) * rr), y: r1(112 + Math.sin(a) * rr), d: r1(rand() * 2.4) }
  })
  return { needles, berries, cones, lights }
})()

function Door({ uid }: { uid: string }) {
  const brass = `${uid}-brass`
  return (
    <svg viewBox="0 0 180 340" className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={brass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCE7A6" />
          <stop offset="50%" stopColor="#C8952F" />
          <stop offset="100%" stopColor="#7E5714" />
        </linearGradient>
        <linearGradient id={`${uid}-paint`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0F3B29" />
          <stop offset="55%" stopColor="#14492F" />
          <stop offset="100%" stopColor="#0B2F21" />
        </linearGradient>
      </defs>
      <rect width="180" height="340" fill={`url(#${uid}-paint)`} />
      {[
        [18, 18, 64, 74], [98, 18, 64, 74],
        [18, 112, 64, 92], [98, 112, 64, 92],
        [18, 240, 64, 82], [98, 240, 64, 82],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#123F2C" />
          <path d={`M${x} ${y + h}V${y}H${x + w}`} stroke="#062217" strokeWidth={2.4} fill="none" />
          <path d={`M${x + w} ${y}V${y + h}H${x}`} stroke="#2C6A4C" strokeWidth={2} fill="none" />
          <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} fill="none" stroke="#0A2C1E" strokeWidth={1} />
        </g>
      ))}
      {/* letterbox and knob */}
      <rect x="62" y="216" width="56" height="12" rx="2" fill={`url(#${brass})`} />
      <rect x="66" y="220" width="48" height="3" rx="1" fill="#5A3E10" />
      <circle cx="160" cy="186" r="6.4" fill={`url(#${brass})`} />
      <circle cx="158.4" cy="184.4" r="2" fill="#FFF3C8" opacity={0.7} />

      {/* the wreath */}
      <g>
        <circle cx="90" cy="112" r="44" fill="none" stroke="#123A26" strokeWidth={22} />
        {WREATH.needles.map((n, i) => (
          <ellipse key={i} cx={n.x} cy={n.y} rx={n.len / 2} ry={1.7} fill={n.c} transform={`rotate(${n.rot} ${n.x} ${n.y})`} />
        ))}
        {WREATH.cones.map((c, i) => (
          <g key={i} transform={`rotate(${c.rot} ${c.x} ${c.y})`}>
            <ellipse cx={c.x} cy={c.y} rx={6.4} ry={4.2} fill="#7A4A22" />
            <path d={`M${c.x - 4} ${c.y - 2}h8M${c.x - 5} ${c.y}h10M${c.x - 4} ${c.y + 2}h8`} stroke="#4E2E12" strokeWidth={0.8} />
          </g>
        ))}
        {WREATH.berries.map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r={2.6} fill="#C41630" />
            <circle cx={r1(b.x + 3.4)} cy={r1(b.y + 1.6)} r={2.3} fill="#D7263D" />
            <circle cx={r1(b.x + 0.8)} cy={r1(b.y + 3.8)} r={2.2} fill="#A8102A" />
            <circle cx={r1(b.x - 0.6)} cy={r1(b.y - 0.8)} r={0.8} fill="#FFD6D6" />
          </g>
        ))}
        {WREATH.lights.map((l, i) => (
          <circle key={i} className="xm-twinkle" cx={l.x} cy={l.y} r={1.6} fill="#FFE3A0" style={{ animationDelay: `${l.d}s` }} />
        ))}
        {/* velvet bow */}
        <path d="M90 156C78 146 64 146 62 156C60 166 76 168 90 160Z" fill="#B3122E" />
        <path d="M90 156C102 146 116 146 118 156C120 166 104 168 90 160Z" fill="#9C0F27" />
        <path d="M86 160L76 192L84 188L88 196L90 162Z" fill="#B3122E" />
        <path d="M94 160L104 192L96 188L92 196L90 162Z" fill="#8C0D22" />
        <ellipse cx="90" cy="158" rx="6" ry="5" fill="#C8193A" />
      </g>

      {/* the knocker */}
      <rect x="84" y="82" width="12" height="9" rx="2" fill={`url(#${brass})`} />
      <g className="xm-knocker" style={{ transformOrigin: '90px 88px' }}>
        <circle cx="90" cy="102" r="11" fill="none" stroke={`url(#${brass})`} strokeWidth={3.4} />
      </g>
    </svg>
  )
}

function Facade({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 400 560" className="block h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-lamp`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD48A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD48A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-fan`} cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor="#FFF0C4" />
          <stop offset="60%" stopColor="#FFC768" />
          <stop offset="100%" stopColor="#D9822F" />
        </radialGradient>
        <pattern id={`${uid}-brick`} width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#2E3A52" />
          <path d="M0 0.5H40M0 10.5H40M10 0.5V10.5M30 10.5V20.5" stroke="#26314A" strokeWidth={1.4} />
        </pattern>
      </defs>
      <rect width="400" height="560" fill={`url(#${uid}-brick)`} />
      {/* lantern light washing the wall */}
      <circle cx="44" cy="250" r="90" fill={`url(#${uid}-lamp)`} className="xm-lampglow" />
      <circle cx="356" cy="250" r="90" fill={`url(#${uid}-lamp)`} className="xm-lampglow" />

      {/* the doorcase: pilasters, fanlight, cornice */}
      <rect x="88" y="160" width="22" height="342" fill="#E8E1D5" />
      <rect x="290" y="160" width="22" height="342" fill="#E8E1D5" />
      <rect x="94" y="168" width="10" height="326" fill="#D7CFC1" />
      <rect x="296" y="168" width="10" height="326" fill="#D7CFC1" />
      <path d="M110 160A90 90 0 0 1 290 160Z" fill={`url(#${uid}-fan)`} />
      {[-70, -45, -20, 0, 20, 45, 70].map((a) => {
        const rad = ((a - 90) * Math.PI) / 180
        return <path key={a} d={`M200 160L${r1(200 + Math.cos(rad) * 88)} ${r1(160 + Math.sin(rad) * 88)}`} stroke="#E8E1D5" strokeWidth={2.2} />
      })}
      <path d="M150 160A50 50 0 0 1 250 160" stroke="#E8E1D5" strokeWidth={2.2} fill="none" />
      <path d="M110 160A90 90 0 0 1 290 160" stroke="#E8E1D5" strokeWidth={8} fill="none" />
      <rect x="80" y="156" width="240" height="8" fill="#F2ECE2" />
      {/* garland over the door */}
      <path d="M86 70Q200 40 314 70" stroke="#1F5A3C" strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d="M86 70Q200 40 314 70" stroke="#2F7A52" strokeWidth={5} fill="none" strokeDasharray="3 5" strokeLinecap="round" />
      {[110, 150, 200, 250, 290].map((x, i) => {
        const y = r1(70 - 30 * (1 - ((x - 200) / 114) ** 2) * 0.95)
        return <circle key={x} className="xm-twinkle" cx={x} cy={y + 4} r={2.4} fill={['#FFD36B', '#FF6B6B', '#FFF1C9', '#7BD389', '#FFD36B'][i]} style={{ animationDelay: `${i * 0.4}s` }} />
      })}
      {[86, 314].map((x) => (
        <g key={x}>
          <path d={`M${x} 70l-9 22 9-5 9 5Z`} fill="#B3122E" />
          <circle cx={x} cy={70} r={6} fill="#C8193A" />
        </g>
      ))}

      {/* the doorway, behind the door */}
      <rect x="110" y="160" width="180" height="340" fill="#0A0605" />

      {/* lanterns */}
      {[44, 356].map((x) => (
        <g key={x}>
          <path d={`M${x} 196v14`} stroke="#141414" strokeWidth={3} />
          <path d={`M${x - 14} 214h28l-4 -6h-20Z`} fill="#141414" />
          <rect x={x - 12} y={214} width={24} height={40} fill="#FFD27A" className="xm-flicker" />
          <path d={`M${x - 12} 214h24v40h-24ZM${x} 214v40M${x - 12} 234h24`} stroke="#141414" strokeWidth={2.2} fill="none" />
          <path d={`M${x - 15} 254h30l-4 6h-22Z`} fill="#141414" />
          <path d={`M${x - 15} 206q15 -8 30 0`} stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.9} />
        </g>
      ))}

      {/* little firs in pots, lit */}
      {[40, 360].map((x, k) => (
        <g key={x}>
          <path d={`M${x} 382l30 70h-60Z`} fill="#174A33" />
          <path d={`M${x} 410l36 74h-72Z`} fill="#1F5A3C" />
          <path d={`M${x - 20} 484h40l-6 30h-28Z`} fill="#7A3B22" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={i} className="xm-twinkle" cx={r1(x - 22 + ((i * 37 + k * 11) % 44))} cy={r1(408 + ((i * 23) % 70))} r={1.9} fill={['#FFE3A0', '#FF8A8A', '#FFE3A0', '#9BE3A8'][i % 4]} style={{ animationDelay: `${(i * 0.37 + k * 0.2) % 2.4}s` }} />
          ))}
          <path d={`M${x - 14} 384q14 -8 28 0`} stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      ))}

      {/* steps, under snow */}
      <rect x="78" y="500" width="244" height="22" fill="#6B6F7A" />
      <rect x="60" y="522" width="280" height="38" fill="#5B5F6A" />
      <path d="M76 502q6-9 18-6q10-6 22 0q12-6 24 0q14-7 26 0q12-6 26 0q12-6 24 0q14-6 26 0q12-6 24 0q14-7 26 0q10-4 32 4v-6H76Z" fill="#F4F7FB" />
      <path d="M58 524q8-8 20-4q12-7 26 0q14-7 26 0q14-6 28 0q12-7 26 0q14-6 26 0q14-7 28 0q12-6 26 0q14-7 26 0q14-6 26 0q8-2 4 4v-6H58Z" fill="#EEF2F8" />
      <path d="M78 156q20-10 40-4q30-8 60-2q30-8 60 0q30-8 50 0q10-2 34 6v-6H78Z" fill="#F4F7FB" />
    </svg>
  )
}

/* ── The living room ───────────────────────────────────────────────── */

const TREE = (() => {
  const rand = rng(23)
  const tiers = [
    { apex: 40, base: 100, hw: 34 },
    { apex: 72, base: 150, hw: 52 },
    { apex: 110, base: 206, hw: 70 },
    { apex: 150, base: 262, hw: 86 },
  ]
  const cx = 307
  const inside = (x: number, y: number) => tiers.some((t) => y > t.apex + 10 && y < t.base - 4 && Math.abs(x - cx) < ((y - t.apex) / (t.base - t.apex)) * t.hw - 6)
  const bulbs: { x: number; y: number; c: string; d: number }[] = []
  const colours = ['#FFE08A', '#FF6B6B', '#8FD3FF', '#9BE3A8', '#FFB86B', '#FFF4D6']
  while (bulbs.length < 34) {
    const x = cx - 86 + rand() * 172
    const y = 52 + rand() * 206
    if (inside(x, y)) bulbs.push({ x: r1(x), y: r1(y), c: colours[bulbs.length % colours.length], d: r1(rand() * 3) })
  }
  const baubles: { x: number; y: number; r: number; c: string }[] = []
  const bc = ['#B3122E', '#D9A441', '#C9CED6', '#B3122E', '#D9A441']
  while (baubles.length < 11) {
    const x = cx - 80 + rand() * 160
    const y = 80 + rand() * 176
    if (inside(x, y) && bulbs.every((b) => Math.hypot(b.x - x, b.y - y) > 7)) baubles.push({ x: r1(x), y: r1(y), r: r1(4.4 + rand() * 2.6), c: bc[baubles.length % bc.length] })
  }
  const tierPath = (t: (typeof tiers)[number]) => {
    const n = 5
    let d = `M${cx} ${t.apex}L${cx + t.hw} ${t.base}`
    for (let i = n; i > 0; i--) {
      const x0 = cx - t.hw + ((i - 1) * 2 * t.hw) / n
      const x1 = cx - t.hw + (i * 2 * t.hw) / n
      d += `Q${r1((x0 + x1) / 2)} ${t.base + 9} ${r1(x0)} ${t.base}`
    }
    return `${d}Z`
  }
  const garlands = tiers.map((t, i) => {
    const y0 = r1(t.apex + (t.base - t.apex) * 0.55)
    const w = r1(((y0 - t.apex) / (t.base - t.apex)) * t.hw)
    return `M${r1(cx - w)} ${y0}Q${cx} ${r1(y0 + 16 + i * 2)} ${r1(cx + w + 6)} ${r1(y0 - 6)}`
  })
  return { tiers: tiers.map(tierPath), bulbs, baubles, garlands, cx }
})()

const STOCKING_COLOURS = [
  { body: '#B3122E', cuff: '#FBF3E4' },
  { body: '#1F5A3C', cuff: '#FBF3E4' },
  { body: '#F2EADB', cuff: '#B3122E' },
  { body: '#8C1027', cuff: '#FBF3E4' },
  { body: '#2E6B4E', cuff: '#F3D58A' },
]

function LivingRoom({ uid, stockings, photo }: { uid: string; stockings: string[]; photo: string }) {
  const n = Math.min(5, stockings.length)
  const span = 150
  return (
    <svg viewBox="0 0 400 300" className="block w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-needle`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2A7A4F" />
          <stop offset="55%" stopColor="#1C5A3A" />
          <stop offset="100%" stopColor="#0F3D27" />
        </linearGradient>
        <radialGradient id={`${uid}-fire`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB45C" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#FF8A3C" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FF7A2C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE6A8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFE6A8" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <clipPath id={`${uid}-frame`}>
          <rect x="99" y="112" width="28" height="34" rx="1" />
        </clipPath>
      </defs>

      {/* floor and rug */}
      <rect x="0" y="282" width="400" height="18" fill="#3E2416" />
      <path d="M0 288H400M0 295H400" stroke="#2C180D" strokeWidth={0.8} />
      <ellipse cx="112" cy="294" rx="104" ry="9" fill="#7E0F22" />
      <ellipse cx="112" cy="294" rx="96" ry="6.4" fill="none" stroke="#D9A441" strokeWidth={0.8} strokeDasharray="2 2" />

      {/* fireplace */}
      <ellipse cx="112" cy="262" rx="150" ry="80" fill={`url(#${uid}-fire)`} className="xm-fireglow" />
      <rect x="30" y="160" width="164" height="124" fill="#E6DCCB" />
      <rect x="30" y="160" width="12" height="124" fill="#D6CAB6" />
      <rect x="182" y="160" width="12" height="124" fill="#D6CAB6" />
      <rect x="18" y="148" width="188" height="13" rx="2" fill="#F3ECDF" />
      <rect x="18" y="158" width="188" height="3" fill="#CDBFA8" />
      <path d="M66 284V214Q66 196 84 196H140Q158 196 158 214V284Z" fill="#1B0E0A" />
      <rect x="74" y="268" width="76" height="6" rx="3" fill="#5A3520" />
      <rect x="80" y="262" width="64" height="7" rx="3.5" fill="#7A4A2A" transform="rotate(-4 112 265)" />
      <g style={{ transformOrigin: '112px 266px' }}>
        <path className="xm-flame" d="M92 266C88 250 98 242 96 228C106 238 110 250 108 266Z" fill="#FF7A2C" style={{ animationDelay: '0s' }} />
        <path className="xm-flame" d="M104 266C98 244 112 236 112 216C124 232 128 250 122 266Z" fill="#FFB347" style={{ animationDelay: '-.3s' }} />
        <path className="xm-flame" d="M116 266C114 252 124 246 124 234C132 244 134 256 130 266Z" fill="#FF8A3C" style={{ animationDelay: '-.6s' }} />
        <path className="xm-flame" d="M106 266C104 256 112 250 112 240C118 250 120 258 116 266Z" fill="#FFE29A" style={{ animationDelay: '-.15s' }} />
      </g>

      {/* the mantel: candles, a frame, a garland */}
      {[40, 186].map((x) => (
        <g key={x}>
          <rect x={x - 4} y={124} width={8} height={24} rx={1} fill="#FBF3E4" />
          <path className="xm-candle" d={`M${x} 112c-3 4-3 8 0 11c3-3 3-7 0-11Z`} fill="#FFC768" style={{ transformOrigin: `${x}px 123px` }} />
          <circle cx={x} cy={117} r={10} fill={`url(#${uid}-halo)`} />
        </g>
      ))}
      <rect x="95" y="108" width="36" height="42" rx="1.4" fill="#C99335" />
      <rect x="99" y="112" width="28" height="34" fill="#20324A" />
      {photo ? (
        <image href={photo} x="99" y="112" width="28" height="34" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-frame)`} />
      ) : (
        <g clipPath={`url(#${uid}-frame)`}>
          <circle cx="119" cy="120" r="3.4" fill="#FFF4D0" />
          <path d="M99 140q8-8 14-3t14-4v13H99Z" fill="#EAF0F6" />
        </g>
      )}
      <path d="M22 150Q66 166 112 152Q158 166 202 150" stroke="#1F5A3C" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M22 150Q66 166 112 152Q158 166 202 150" stroke="#2F7A52" strokeWidth={3} fill="none" strokeDasharray="2 4" strokeLinecap="round" />
      {[34, 58, 84, 112, 140, 166, 190].map((x, i) => (
        <circle key={x} className="xm-twinkle" cx={x} cy={i % 2 ? 158 : 155} r={1.9} fill={['#FFE08A', '#FF6B6B', '#FFF4D6', '#9BE3A8'][i % 4]} style={{ animationDelay: `${i * 0.33}s` }} />
      ))}

      {/* a stocking for everyone */}
      {stockings.slice(0, n).map((name, i) => {
        const x = r1(46 + (n === 1 ? span / 2 : (i * span) / Math.max(1, n - 1)) - 8)
        const c = STOCKING_COLOURS[i % STOCKING_COLOURS.length]
        const size = Math.min(6.2, 30 / Math.max(3, name.length))
        return (
          <g key={i} className="xm-stocking" style={{ transformOrigin: `${x + 8}px 162px`, animationDelay: `${i * 0.5}s` }}>
            <path d={`M${x} 166H${x + 16}V194Q${x + 16} 198 ${x + 20} 200L${x + 28} 204Q${x + 32} 207 ${x + 29} 211Q${x + 26} 214 ${x + 21} 212L${x + 6} 206Q${x} 204 ${x} 198Z`} fill={c.body} />
            {c.body === '#F2EADB' && <path d={`M${x} 180H${x + 16}M${x} 188H${x + 16}`} stroke="#B3122E" strokeWidth={2} />}
            <rect x={x - 1.5} y={162} width={19} height={10} rx={3} fill={c.cuff} />
            <text x={x + 8} y={169.3} textAnchor="middle" fontSize={size} fontFamily={hand} fontWeight={700} fill={c.cuff === '#FBF3E4' ? '#7E0F22' : '#FBF3E4'}>{name}</text>
          </g>
        )
      })}

      {/* the tree */}
      <rect x="300" y="258" width="14" height="26" fill="#5A3520" />
      {TREE.tiers
        .slice()
        .reverse()
        .map((d, i) => (
          <path key={i} d={d} fill={`url(#${uid}-needle)`} />
        ))}
      {TREE.garlands.map((d, i) => (
        <path key={i} d={d} stroke="#F0CC72" strokeWidth={1.8} fill="none" strokeDasharray="0.1 3.4" strokeLinecap="round" />
      ))}
      {TREE.baubles.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} />
          <circle cx={r1(b.x - b.r * 0.35)} cy={r1(b.y - b.r * 0.35)} r={r1(b.r * 0.32)} fill="#FFFFFF" opacity={0.55} />
          <rect x={r1(b.x - 1.6)} y={r1(b.y - b.r - 2.2)} width={3.2} height={2.6} fill="#C9A24A" />
        </g>
      ))}
      <g filter={`url(#${uid}-glow)`}>
        {TREE.bulbs.map((b, i) => (
          <circle key={i} className="xm-twinkle" cx={b.x} cy={b.y} r={3.6} fill={b.c} style={{ animationDelay: `${b.d}s` }} />
        ))}
      </g>
      {TREE.bulbs.map((b, i) => (
        <circle key={i} className="xm-twinkle" cx={b.x} cy={b.y} r={1.7} fill={b.c} style={{ animationDelay: `${b.d}s` }} />
      ))}
      <g className="xm-star" style={{ transformOrigin: '307px 36px' }}>
        <circle cx="307" cy="36" r="20" fill={`url(#${uid}-halo)`} />
        <path d="M307 22l3.6 9.2 9.8.6-7.6 6.2 2.6 9.6-8.4-5.4-8.4 5.4 2.6-9.6-7.6-6.2 9.8-.6Z" fill="#F3D58A" stroke="#C99335" strokeWidth={0.8} />
      </g>

      {/* presents */}
      <rect x="236" y="254" width="34" height="30" fill="#B3122E" />
      <rect x="250" y="254" width="6" height="30" fill="#F0CC72" />
      <rect x="236" y="264" width="34" height="5" fill="#F0CC72" />
      <path d="M253 254c-8-8-14-4-10 0zM253 254c8-8 14-4 10 0z" fill="#F0CC72" />
      <rect x="340" y="262" width="40" height="22" fill="#1F5A3C" />
      <rect x="356" y="262" width="7" height="22" fill="#D7263D" />
      <path d="M359 262c-9-9-15-4-11 0zM359 262c9-9 15-4 11 0z" fill="#D7263D" />
      <rect x="276" y="268" width="26" height="16" fill="#F2EADB" />
      <rect x="286" y="268" width="5" height="16" fill="#1F5A3C" />
    </svg>
  )
}

/* The village under snow, for the foot of the page. */
const VILLAGE = (() => {
  const rand = rng(41)
  const out: { x: number; w: number; top: number; roof: number; chimney: boolean; windows: [number, number][] }[] = []
  let x = -6
  while (x < 400) {
    const w = Math.round(34 + rand() * 26)
    const top = Math.round(48 + rand() * 22)
    const roof = Math.round(14 + rand() * 10)
    const windows: [number, number][] = []
    const cols = w > 46 ? 2 : 1
    for (let c = 0; c < cols; c++) if (rand() < 0.8) windows.push([Math.round(x + (cols === 1 ? w / 2 - 3 : w * (c ? 0.62 : 0.24))), Math.round(top + 10 + rand() * 12)])
    out.push({ x, w, top, roof, chimney: rand() < 0.4, windows })
    x += w - 2
  }
  return out
})()

/** How wide the living room is drawn: full width, unless the screen is too short for it and the words above. */
const ROOM_WIDTH = 'min(100%, 36rem, max(18rem, calc((100cqh - 340px) * 1.33)))'

/* ── Ornament ──────────────────────────────────────────────────────── */

function Caps({ children, color = P.goldDeep, size = 12, className = '' }: { children: ReactNode; color?: string; size?: number; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontWeight: 500, fontSize: size, letterSpacing: '0.28em', color }}>
      {children}
    </p>
  )
}

function Heading({ kicker, children, color = P.pine, kickerColor = P.holly }: { kicker?: string; children: ReactNode; color?: string; kickerColor?: string }) {
  return (
    <div className="text-center">
      {kicker && <Caps color={kickerColor}>{kicker}</Caps>}
      <h2 className="mt-2" style={{ fontFamily: display, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, 10cqi, 48px)', lineHeight: 1.05, color }}>{children}</h2>
    </div>
  )
}

function Holly({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <path d="M30 16C24 6 12 4 4 8c4 2 4 6 2 8 4 0 6 4 4 7 6-2 14-2 20-7Z" fill="#1F5A3C" />
      <path d="M30 16c6-10 18-12 26-8-4 2-4 6-2 8-4 0-6 4-4 7-6-2-14-2-20-7Z" fill="#2A6A44" />
      <circle cx="27" cy="17" r="3.4" fill="#C41630" />
      <circle cx="33" cy="17.4" r="3.2" fill="#D7263D" />
      <circle cx="30" cy="21.6" r="3.2" fill="#B3122E" />
    </svg>
  )
}

/** A Fair Isle band, as knitted on a Christmas jumper. */
function FairIsle({ uid }: { uid: string }) {
  const id = `${uid}-knit`
  const px = (x: number, y: number, c: string) => <rect key={`${x}-${y}`} x={x * 3} y={y * 3} width={3} height={3} fill={c} />
  const star = [[3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [1, 3], [2, 3], [4, 3], [5, 3], [2, 2], [4, 2], [2, 4], [4, 4]]
  return (
    <svg className="block h-[54px] w-full" aria-hidden>
      <defs>
        <pattern id={id} width="24" height="54" patternUnits="userSpaceOnUse">
          <rect width="24" height="54" fill="#B3122E" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => px(x, x % 4 < 2 ? 0 : 1, '#FBF3E4'))}
          {star.map(([x, y]) => px(x + 1, y + 4, '#FBF3E4'))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => px(x, x % 4 < 2 ? 17 : 16, '#FBF3E4'))}
          {[1, 5].map((x) => px(x, 11, '#F3D58A'))}
        </pattern>
      </defs>
      <rect width="100%" height="54" fill={`url(#${id})`} />
    </svg>
  )
}

function Btn({ href, isPreview, children, tone = 'light' }: { href: string | null; isPreview: boolean; children: ReactNode; tone?: 'light' | 'red' }) {
  if (!href) return null
  const look: CSSProperties = tone === 'red' ? { background: P.holly, color: P.cream } : { background: '#FFFFFF', color: P.pine, border: `1px solid ${P.rule}` }
  return (
    <DirectionsLink href={href} isPreview={isPreview} className="xm-btn inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-[14px] font-medium tracking-wide" style={{ fontFamily: sans, ...look }}>
      {children}
    </DirectionsLink>
  )
}

/* ── Secret Santa ──────────────────────────────────────────────────── */

function SecretSanta({ budget, note, isPreview }: { budget: string; note: string; isPreview: boolean }) {
  const [open, setOpen] = useState(false)
  const shade = `${useId().replace(/[^a-zA-Z0-9]/g, '')}-shade`
  return (
    <section className="relative overflow-hidden px-5 py-16 text-center" style={{ background: `radial-gradient(100% 70% at 50% 20%, #7A1427, ${P.cranberry} 60%, ${P.cranberryDeep})`, color: P.cream, containerType: 'inline-size' }}>
      <Reveal disabled={isPreview}>
        <Heading kicker="Shh…" color={P.cream} kickerColor={P.goldLight}>Secret Santa</Heading>
      </Reveal>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`xm-gift relative mx-auto mt-6 block w-[min(52%,13rem)] ${open ? 'xm-gift-open' : 'xm-gift-shake'}`}
        aria-label="Unwrap the Secret Santa present"
        aria-expanded={open}
      >
        <svg viewBox="0 0 200 180" className="block w-full overflow-visible" aria-hidden>
          <rect x="44" y="76" width="112" height="96" rx="3" fill="#C41630" />
          <rect x="44" y="76" width="112" height="96" rx="3" fill={`url(#${shade})`} opacity={0.3} />
          <rect x="92" y="76" width="16" height="96" fill="#F0CC72" />
          <g className="xm-lid">
            <rect x="36" y="56" width="128" height="24" rx="3" fill="#D7263D" />
            <rect x="92" y="56" width="16" height="24" fill="#F6DB98" />
            <path d="M100 56C84 30 60 34 70 50C76 58 92 58 100 56Z" fill="#F0CC72" />
            <path d="M100 56C116 30 140 34 130 50C124 58 108 58 100 56Z" fill="#E2B85A" />
            <circle cx="100" cy="55" r="7" fill="#F6DB98" />
          </g>
          {open &&
            [[60, 40], [140, 30], [100, 10], [40, 70], [164, 66], [120, 0]].map(([x, y], i) => (
              <path key={i} className="xm-spark" d={`M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z`} fill="#FFE7A3" style={{ animationDelay: `${0.25 + i * 0.12}s` }} />
            ))}
        </svg>
      </button>
      {!open ? (
        <p className="mt-4 text-[13px] uppercase tracking-[0.24em]" style={{ color: P.creamFaint }}>Tap to unwrap</p>
      ) : (
        <div className="xm-pop mx-auto mt-5 w-[min(100%,22rem)] rounded-[18px] px-6 py-6" style={{ background: P.paper, color: P.ink, boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6)' }}>
          {budget && (
            <>
              <Caps color={P.holly} size={11}>Spend no more than</Caps>
              <p className="mt-1" style={{ fontFamily: display, fontSize: 44, lineHeight: 1, color: P.pine }}>{budget}</p>
            </>
          )}
          {note && <p className="mt-3 text-[19px] leading-snug" style={{ fontFamily: hand, color: P.soft }}>{note}</p>}
        </div>
      )}
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id={shade} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  )
}

/* ── Photos, hung on the tree as baubles ───────────────────────────── */

function PhotoBaubles({ photos, isPreview }: { photos: string[]; isPreview: boolean }) {
  const [big, setBig] = useState<number | null>(null)
  const caps = ['#D9A441', '#C9CED6', '#D9A441', '#B87333', '#D9A441', '#C9CED6']
  const strings = [30, 62, 40, 74, 36, 56]
  // One garland for up to four; two garlands, about evenly split, for more.
  const half = photos.length <= 4 ? photos.length : Math.ceil(photos.length / 2)
  const rows = [photos.slice(0, half), photos.slice(half)].filter((r) => r.length)
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14" style={{ background: `linear-gradient(180deg, ${P.pineDeep}, ${P.pine})`, color: P.cream, containerType: 'inline-size' }}>
      <Snow count={22} seed={61} />
      <Reveal disabled={isPreview} className="relative">
        <Heading kicker="Our year" color={P.cream} kickerColor={P.goldLight}>Hung on the tree</Heading>
      </Reveal>
      {rows.map((row, r) => (
        <div key={r} className="relative mx-auto mt-8 w-[min(100%,28rem)]">
          <svg viewBox="0 0 300 30" className="block w-full" preserveAspectRatio="none" aria-hidden>
            <path d={r % 2 ? 'M0 10Q75 0 150 14T300 6' : 'M0 6Q75 30 150 12T300 8'} stroke="#1F5A3C" strokeWidth={9} fill="none" strokeLinecap="round" />
            <path d={r % 2 ? 'M0 10Q75 0 150 14T300 6' : 'M0 6Q75 30 150 12T300 8'} stroke="#2F7A52" strokeWidth={3} fill="none" strokeDasharray="2 4" strokeLinecap="round" />
          </svg>
          <div className="-mt-2 grid gap-x-3" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
            {row.map((src, k) => {
              const i = r * half + k
              const size = row.length >= 4 ? 'min(19cqi,6rem)' : row.length === 3 ? 'min(25cqi,7.4rem)' : 'min(32cqi,9rem)'
              return (
                <div key={`${src}-${i}`} className="flex justify-center" style={{ zIndex: big === i ? 10 : 1 }}>
                  <button
                    type="button"
                    onClick={() => setBig(big === i ? null : i)}
                    className={`xm-bauble relative flex flex-col items-center ${big === i ? 'xm-bauble-big' : ''}`}
                    style={{ animationDelay: `${(i % 3) * 0.6}s` }}
                    aria-label={big === i ? 'Make the photo smaller' : 'See the photo larger'}
                  >
                    <span className="block w-px" style={{ height: strings[i % strings.length], background: 'rgba(243,213,138,0.7)' }} />
                    <span className="block h-[12px] w-[16px] rounded-t-[3px]" style={{ background: caps[i % caps.length] }} />
                    <span className="relative block aspect-square overflow-hidden rounded-full" style={{ width: size, boxShadow: `0 0 0 3px ${caps[i % caps.length]}, 0 14px 30px -12px rgba(0,0,0,0.7)` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(60% 50% at 32% 28%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)' }} />
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <p className="relative mt-6 text-center text-[13px] uppercase tracking-[0.24em]" style={{ color: P.creamFaint }}>Tap a bauble</p>
    </section>
  )
}

/* ── RSVP ──────────────────────────────────────────────────────────── */

function ChristmasRsvp({ anchor, hosts, what, phone, email, rsvpBy, guest, isPreview }: { anchor: string; hosts: string; what: string; phone?: string; email?: string; rsvpBy?: string; guest: string; isPreview: boolean }) {
  const [who, setWho] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [count, setCount] = useState(2)
  const [bring, setBring] = useState('')
  const [diet, setDiet] = useState('')
  useEffect(() => {
    if (guest) setWho((w) => w || guest)
  }, [guest])
  if (!rsvpChannels({ phone, email, text: '', subject: '' }).length) return null

  const name = who.trim()
  const text =
    answer === 'no'
      ? `Dear ${hosts || 'all'}, ${name ? `it’s ${name} — ` : ''}we can’t make ${what} this year, and we’re so sorry to miss it. Have the loveliest Christmas — save us a cracker!`
      : `Hello ${hosts || 'there'}! ${name ? `It’s ${name} — ` : ''}we’ll be there for ${what}. ${count === 1 ? 'Just me.' : `${count} of us.`}${bring.trim() ? ` I’ll bring ${bring.trim()}.` : ''}${diet.trim() ? ` A note for the kitchen: ${diet.trim()}.` : ''} Merry Christmas!`
  const channels = rsvpChannels({ phone, email, text, subject: answer === 'no' ? `Can’t make ${what}` : `RSVP — ${what}` })
  const by = dateParts(rsvpBy)
  const field: CSSProperties = { fontFamily: sans, background: 'rgba(251,243,228,0.08)', border: `1px solid ${P.creamRule}`, color: P.cream }
  const chip = (on: boolean): CSSProperties => ({ background: on ? P.cream : 'transparent', color: on ? P.holly : P.cream, border: `1px solid ${on ? P.cream : P.creamRule}` })

  return (
    <section id={anchor} className="relative px-5 py-16" style={{ background: `linear-gradient(180deg, ${P.holly}, #8E0E24)`, color: P.cream, containerType: 'inline-size' }}>
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
        <Heading kicker={by ? `Please reply by ${by.day} ${by.month}` : 'Please reply'} color={P.cream} kickerColor={P.goldLight}>Will you come?</Heading>
        <div className="mt-8 grid grid-cols-2 gap-2.5">
          {(['yes', 'no'] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAnswer(a)} aria-pressed={answer === a} className="xm-btn min-h-[48px] rounded-full text-[15px] font-medium" style={{ fontFamily: sans, ...chip(answer === a) }}>
              {a === 'yes' ? 'Wouldn’t miss it' : 'Sadly not'}
            </button>
          ))}
        </div>
        {answer && (
          <div className="xm-pop mt-7 space-y-5">
            <label className="block">
              <Caps color={P.creamSoft} size={11}>Your name</Caps>
              <input value={who} onChange={(e) => setWho(e.target.value.slice(0, 60))} placeholder="The Thompsons" className="mt-2 w-full rounded-xl px-4 py-3 text-[16px] outline-none" style={field} />
            </label>
            {answer === 'yes' && (
              <>
                <div className="flex items-center justify-between">
                  <Caps color={P.creamSoft} size={11}>How many of you</Caps>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="xm-btn h-10 w-10 rounded-full text-[20px]" style={chip(false)} aria-label="One fewer">−</button>
                    <span className="w-6 text-center text-[22px]" style={{ fontFamily: display }}>{count}</span>
                    <button type="button" onClick={() => setCount((c) => Math.min(20, c + 1))} className="xm-btn h-10 w-10 rounded-full text-[20px]" style={chip(false)} aria-label="One more">+</button>
                  </div>
                </div>
                <label className="block">
                  <Caps color={P.creamSoft} size={11}>I’ll bring (optional)</Caps>
                  <input value={bring} onChange={(e) => setBring(e.target.value.slice(0, 80))} placeholder="a trifle, and the board games" className="mt-2 w-full rounded-xl px-4 py-3 text-[16px] outline-none" style={field} />
                </label>
                <label className="block">
                  <Caps color={P.creamSoft} size={11}>Anything we should know for the kitchen?</Caps>
                  <input value={diet} onChange={(e) => setDiet(e.target.value.slice(0, 80))} placeholder="one vegetarian, no nuts" className="mt-2 w-full rounded-xl px-4 py-3 text-[16px] outline-none" style={field} />
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
                  className="xm-btn flex min-h-[50px] items-center justify-center gap-2.5 rounded-full text-[15px] font-medium"
                  style={{ fontFamily: sans, background: P.cream, color: P.holly }}
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

type Phase = 'closed' | 'knock' | 'opening' | 'entering' | 'open'

export default function ChristmasEvergreen({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const hosts = data.hostNames?.trim() || ''
  const title = data.title?.trim() || 'Christmas at ours'
  const tagline = data.tagline?.trim() || ''
  const main = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const where = [venue, address].filter(Boolean).join(', ')
  const note = useMemo(() => parseLines(data.message), [data.message])
  const evening = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const menu = useMemo(() => parseRows(data.menu, ['dish', 'who'] as const), [data.menu])
  const stockings = useMemo(() => (data.stockings || '').split(/,|\n|&/).map((s) => s.trim()).filter(Boolean).slice(0, 5), [data.stockings])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const familyPhoto = data.familyPhoto && /^(https?:)?\//.test(data.familyPhoto) ? data.familyPhoto : ''
  const music = /^https?:\/\//i.test(data.musicUrl || '') ? data.musicUrl : ''
  const budget = data.santaBudget?.trim() || ''
  const santaNote = data.santaNote?.trim() || ''
  const what = title.replace(/^christmas\b/i, 'Christmas')

  // The guest a personal link was made for: ?to=The+Thompsons
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 40))
  }, [])
  const tagName = guest || data.guestLine?.trim() || 'You'

  const [today, setToday] = useState('')
  useEffect(() => setToday(isoToday()), [])
  const sleeps = today && main && /^\d{4}-\d{2}-\d{2}$/.test(data.date) ? nightsBetween(today, data.date) : null

  /* closed → a knock → the door swings in → through it → the living room */
  const [phase, setPhase] = useState<Phase>('closed')
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
  const knock = useCallback(() => {
    if (phase !== 'closed') return
    if (music && !isPreview && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), ms))
    setPhase('knock')
    at(1150, 'opening')
    at(2700, 'entering')
    at(3550, 'open')
  }, [phase, music, isPreview])

  const countdown = useCountdown(data.date, data.time, !isPreview && phase === 'open')
  const ids = { evening: `${uid}-evening`, rsvp: `${uid}-rsvp` }
  const open = phase === 'open'
  const longest = Math.max(4, ...title.split(/\s+/).map((w) => w.length + 1))
  const titleCqi = Math.min(15, 86 / (longest * 0.5))
  const hasRsvp = rsvpChannels({ phone: data.rsvpPhone, email: data.rsvpEmail, text: '', subject: '' }).length > 0
  const town = address.split(',').map((s) => s.trim()).filter(Boolean).slice(-1)[0] || venue

  return (
    <div className={`xm relative ph-${phase}`} style={{ background: P.night, color: P.cream, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .xm .xm-flake { animation: xm-snow linear infinite; }
        @keyframes xm-snow { from { transform: translate(0, -10px); } to { transform: translate(var(--x), 105vh); } }
        .xm .xm-twinkle { animation: xm-twinkle 2.4s ease-in-out infinite; }
        @keyframes xm-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
        .xm .xm-flicker { animation: xm-flicker 3.2s ease-in-out infinite; }
        @keyframes xm-flicker { 0%, 100% { opacity: 1; } 40% { opacity: .82; } 60% { opacity: .95; } }
        .xm .xm-lampglow { animation: xm-flicker 3.2s ease-in-out infinite; }
        .xm.ph-knock .xm-knocker { animation: xm-knock .5s ease-in-out 2; }
        @keyframes xm-knock { 0%, 100% { transform: rotateX(0); } 35% { transform: translateY(-3px) scaleY(.82); } 60% { transform: translateY(1px); } }
        .xm .xm-knocktext { opacity: 0; }
        .xm.ph-knock .xm-knocktext { animation: xm-knocktext 1.1s ease both; }
        @keyframes xm-knocktext { 0% { opacity: 0; transform: translateY(6px) rotate(-6deg); } 25%, 80% { opacity: 1; transform: translateY(0) rotate(-6deg); } 100% { opacity: 0; } }
        .xm .xm-door { transform-origin: 0% 50%; transform: perspective(900px) rotateY(0); transition: transform 1.7s cubic-bezier(.55,.05,.3,1); }
        .xm.ph-opening .xm-door, .xm.ph-entering .xm-door { transform: perspective(900px) rotateY(98deg); }
        .xm .xm-inside { opacity: .2; transition: opacity 1.2s ease; }
        .xm.ph-opening .xm-inside, .xm.ph-entering .xm-inside { opacity: 1; }
        .xm .xm-spill { opacity: 0; transition: opacity 1.2s ease .3s; }
        .xm.ph-opening .xm-spill, .xm.ph-entering .xm-spill { opacity: 1; }
        .xm .xm-stage { transition: transform 1s cubic-bezier(.6,0,.4,1); transform-origin: 50% 62%; }
        .xm.ph-entering .xm-stage { transform: scale(3.2); }
        .xm .xm-warm { opacity: 0; transition: opacity .8s ease .15s; }
        .xm.ph-entering .xm-warm { opacity: 1; }
        .xm .xm-coverui { transition: opacity .5s ease; }
        .xm:not(.ph-closed) .xm-coverui { opacity: 0; pointer-events: none; }
        .xm .xm-tag { animation: xm-swing 4s ease-in-out infinite; transform-origin: 50% 0; }
        @keyframes xm-swing { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(-2deg); } }
        .xm .xm-hint { animation: xm-hint 2.4s ease-in-out infinite; }
        @keyframes xm-hint { 0%, 100% { box-shadow: 0 0 0 0 rgba(243,213,138,.5); } 60% { box-shadow: 0 0 0 14px rgba(243,213,138,0); } }
        .xm.ph-open .xm-in { animation: xm-in 1.2s ease both; }
        @keyframes xm-in { from { opacity: 0; filter: brightness(1.8); } }
        .xm .xm-rise { animation: xm-rise 1s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes xm-rise { from { opacity: 0; transform: translateY(16px); } }
        .xm .xm-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: xm-flame 1.1s ease-in-out infinite alternate; }
        @keyframes xm-flame { 0% { transform: scaleY(1) skewX(0); } 50% { transform: scaleY(1.12) skewX(3deg); } 100% { transform: scaleY(.9) skewX(-3deg); } }
        .xm .xm-fireglow { animation: xm-flicker 1.6s ease-in-out infinite; }
        .xm .xm-candle { animation: xm-flame .9s ease-in-out infinite alternate; transform-box: fill-box; }
        .xm .xm-stocking { animation: xm-sway 5s ease-in-out infinite; }
        @keyframes xm-sway { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(1.6deg); } }
        .xm .xm-star { animation: xm-star 4s ease-in-out infinite; }
        @keyframes xm-star { 0%, 100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.08) rotate(8deg); } }
        .xm .xm-btn { transition: opacity .18s ease, transform .18s ease; }
        .xm .xm-btn:hover { opacity: .9; }
        .xm .xm-btn:active { transform: scale(.98); }
        .xm .xm-pop { animation: xm-pop .45s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes xm-pop { from { opacity: 0; transform: translateY(10px) scale(.97); } }
        .xm .xm-gift-shake { animation: xm-shake 3.2s ease-in-out infinite; }
        @keyframes xm-shake { 0%, 78%, 100% { transform: rotate(0); } 82% { transform: rotate(-5deg); } 88% { transform: rotate(5deg); } 94% { transform: rotate(-3deg); } }
        .xm .xm-lid { transition: transform .9s cubic-bezier(.3,.7,.3,1); transform-box: fill-box; transform-origin: 0% 100%; }
        .xm .xm-gift-open .xm-lid { transform: translate(-8px, -44px) rotate(-22deg); }
        .xm .xm-spark { animation: xm-spark 1.4s ease both; transform-box: fill-box; transform-origin: center; }
        @keyframes xm-spark { 0% { opacity: 0; transform: scale(.2); } 40% { opacity: 1; transform: scale(1.3) rotate(45deg); } 100% { opacity: 0; transform: scale(.6) rotate(90deg); } }
        .xm .xm-bauble { transform-origin: 50% 0; animation: xm-bauble 4.6s ease-in-out infinite; transition: transform .5s cubic-bezier(.3,.7,.3,1); }
        @keyframes xm-bauble { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        .xm .xm-bauble-big { animation: none; transform: scale(1.7) translateY(6px); }
        @media (prefers-reduced-motion: reduce) {
          .xm .xm-flake, .xm .xm-twinkle, .xm .xm-flicker, .xm .xm-lampglow, .xm .xm-tag, .xm .xm-hint, .xm .xm-flame, .xm .xm-fireglow, .xm .xm-candle, .xm .xm-stocking, .xm .xm-star, .xm .xm-gift-shake, .xm .xm-bauble, .xm .xm-rise { animation: none; }
        }
      `}</style>

      {music && <audio ref={audio} src={music} loop preload="none" />}
      {music && open && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-3 z-40 flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] backdrop-blur`}
          style={{ color: P.cream, background: 'rgba(58,8,17,0.6)', border: `1px solid ${P.creamRule}` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            {playing ? <path strokeLinecap="round" d="M9 6v12M15 6v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
          </svg>
          {playing ? 'Pause' : 'Carols'}
        </button>
      )}

      {!open ? (
        /* ── The doorstep ──────────────────────────────────────────── */
        <section className="relative overflow-hidden" style={{ height: isPreview ? PREVIEW_H : '100svh', minHeight: isPreview ? undefined : 600, background: `radial-gradient(90% 60% at 50% 30%, ${P.nightLift}, ${P.night} 75%)` }}>
          <div className="xm-stage absolute inset-0 flex flex-col items-center justify-end">
            <div className="relative w-[min(88%,25rem)]" style={{ aspectRatio: '400 / 560', marginBottom: '-1px' }}>
              <Facade uid={`${uid}f`} />
              {/* light from the open door, on the snow */}
              <div className="xm-spill pointer-events-none absolute" style={{ left: '20%', right: '20%', top: '89%', bottom: 0, background: 'linear-gradient(180deg, rgba(255,214,140,0.7), rgba(255,214,140,0))', clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)' }} />
              {/* the doorway */}
              <div className="absolute" style={{ left: '27.5%', top: '28.57%', width: '45%', height: '60.71%' }}>
                <div className="xm-inside absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 50% 60%, #FFF1C9, #FFC768 45%, #C9652A 85%, #5A2410)' }} />
                <div className="xm-door absolute inset-0" style={{ backfaceVisibility: 'visible' }}>
                  <Door uid={`${uid}d`} />
                  {/* the gift tag, written to the guest */}
                  <div className="absolute left-1/2 top-[57%] w-[56%] -translate-x-1/2">
                    <div className="mx-auto h-[14px] w-px" style={{ background: '#8C6A3A' }} />
                    <div className="xm-tag relative mx-auto px-[9%] pb-[10%] pt-[16%] text-center" style={{ background: P.kraft, clipPath: 'polygon(16% 0, 84% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)', boxShadow: '0 6px 14px rgba(0,0,0,0.35)' }}>
                      <span className="absolute left-1/2 top-[6%] block h-[7px] w-[7px] -translate-x-1/2 rounded-full" style={{ background: '#5A3E1E' }} />
                      <p style={{ fontFamily: hand, fontSize: 'clamp(9px, 3.4cqi, 15px)', lineHeight: 1, color: '#5A3E1E' }}>For</p>
                      <p style={{ fontFamily: hand, fontWeight: 700, fontSize: `clamp(10px, ${Math.min(5.6, 40 / Math.max(6, tagName.length)).toFixed(1)}cqi, 22px)`, lineHeight: 1.05, color: '#3A2412', overflowWrap: 'break-word' }}>{tagName}</p>
                    </div>
                  </div>
                </div>
                <p className="xm-knocktext pointer-events-none absolute -right-[38%] top-[20%]" style={{ fontFamily: hand, fontSize: 'clamp(16px, 5cqi, 22px)', color: P.goldLight }}>knock, knock</p>
              </div>
            </div>
          </div>
          <Snow count={60} seed={9} />
          <div className="xm-warm pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 60%, #FFF4DA, #FFD48A)' }} />

          <div className="xm-coverui absolute inset-x-0 top-0 mx-auto flex w-[min(100%,30rem)] flex-col items-center px-6 pt-[9cqi] text-center" style={{ containerType: 'inline-size' }}>
            <Caps color={P.goldLight} size={11.5}>{hosts ? `${hosts} · Christmas` : 'Christmas'}</Caps>
            <p className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(28px, 9cqi, 40px)', lineHeight: 1.1, color: P.cream, textWrap: 'balance' }}>
              There’s a light on for you.
            </p>
            <button
              type="button"
              onClick={knock}
              aria-label="Knock on the door and open the invitation"
              className="xm-hint xm-btn mt-5 inline-flex min-h-[50px] items-center gap-2.5 rounded-full px-6 text-[15px] font-medium tracking-wide"
              style={{ fontFamily: sans, background: P.cream, color: P.holly }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
                <circle cx="12" cy="13" r="5.5" />
                <path strokeLinecap="round" d="M9.5 4.5h5v3h-5z" />
              </svg>
              Knock on the door
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* ── Inside ──────────────────────────────────────────────── */}
          <section className="xm-in relative overflow-hidden" style={{ height: isPreview ? PREVIEW_H : '100svh', minHeight: isPreview ? undefined : 600, containerType: 'size', background: `radial-gradient(120% 70% at 30% 85%, #6E2414, ${P.cranberry} 45%, ${P.cranberryDeep} 100%)` }}>
            <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 26px)' }} />
            <div className="relative mx-auto w-[min(100%,30rem)] px-6 pt-[9cqi] text-center" style={{ containerType: 'inline-size' }}>
              <div className="xm-rise" style={{ animationDelay: '300ms' }}>
                <Caps color={P.goldLight} size={11.5}>{guest ? `${guest} — ` : ''}{hosts ? `${hosts} invite you to` : 'You’re invited to'}</Caps>
              </div>
              <h1 className="xm-rise mt-3" style={{ ...goldText({ fontFamily: display, fontStyle: 'italic', fontWeight: 400, fontSize: `clamp(36px, ${titleCqi.toFixed(1)}cqi, 78px)`, lineHeight: 1.02, textWrap: 'balance', filter: 'drop-shadow(0 2px 14px rgba(255,190,90,0.3))' }), animationDelay: '450ms' }}>
                {title}
              </h1>
              {tagline && <p className="xm-rise mt-2" style={{ fontFamily: script, fontSize: 'clamp(28px, 9cqi, 40px)', lineHeight: 1.1, color: P.cream, animationDelay: '600ms' }}>{tagline}</p>}
              {main && (
                <p className="xm-rise mt-4" style={{ fontFamily: display, fontSize: 'clamp(18px, 5.6cqi, 24px)', color: P.cream, animationDelay: '750ms' }}>
                  {main.weekday} {main.day} {main.month}
                  {time && <span style={{ color: P.creamSoft }}> · {time}</span>}
                </p>
              )}
              {venue && <p className="xm-rise mt-1" style={{ fontFamily: hand, fontSize: 'clamp(19px, 5.8cqi, 24px)', color: P.creamSoft, animationDelay: '820ms' }}>{venue}</p>}
              <div className="xm-rise mt-5 flex justify-center gap-2.5" style={{ animationDelay: '900ms' }}>
                {evening.length > 0 && (
                  <a href={`#${ids.evening}`} className="xm-btn inline-flex min-h-[44px] items-center rounded-full px-5 text-[14px] tracking-wide" style={{ border: `1px solid ${P.creamRule}`, color: P.cream }}>
                    The evening
                  </a>
                )}
                {hasRsvp && (
                  <a href={`#${ids.rsvp}`} className="xm-btn inline-flex min-h-[44px] items-center rounded-full px-5 text-[14px] font-medium tracking-wide" style={{ background: P.cream, color: P.holly }}>
                    RSVP
                  </a>
                )}
              </div>
            </div>
            {/* On short screens the room shrinks so the words above keep their room;
                the floorboards still run wall to wall. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: `calc(${ROOM_WIDTH} * 0.06)`, background: '#3E2416' }} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto" style={{ width: ROOM_WIDTH }}>
              <LivingRoom uid={`${uid}r`} stockings={stockings} photo={familyPhoto} />
            </div>
          </section>

          {/* ── How many sleeps ─────────────────────────────────────── */}
          {countdown && sleeps !== null && sleeps >= 0 && (
            <section className="relative px-5 py-14 text-center" style={{ background: P.pine, color: P.cream }}>
              <div className="mx-auto w-[min(70%,15rem)]">
                <div className="mx-auto h-[26px] w-px" style={{ background: P.goldLight }} />
                <div className="relative mx-auto px-6 pb-6 pt-8" style={{ background: P.paper, color: P.ink, clipPath: 'polygon(18% 0, 82% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)' }}>
                  <span className="absolute left-1/2 top-3 block h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ background: P.pine }} />
                  <p style={{ fontFamily: display, fontSize: 64, lineHeight: 1, color: P.holly }}>{sleeps === 0 ? '0' : sleeps}</p>
                  <p className="mt-1" style={{ fontFamily: hand, fontSize: 24, lineHeight: 1.1 }}>{sleeps === 1 ? 'more sleep' : sleeps === 0 ? 'sleeps — it’s today!' : 'more sleeps'}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px]" style={{ color: P.creamSoft }}>
                until {what} · {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </p>
            </section>
          )}

          {/* ── A letter ───────────────────────────────────────────── */}
          {note.length > 0 && (
            <section className="relative px-5 py-16" style={{ background: P.cream, color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="relative mx-auto w-[min(100%,27rem)] rounded-[6px] px-7 pb-9 pt-10" style={{ background: '#FFFDF7', boxShadow: '0 24px 50px -30px rgba(42,29,20,0.55), 0 0 0 1px rgba(42,29,20,0.06)' }}>
                {/* stamp and postmark */}
                <div className="absolute right-5 top-5 h-[64px] w-[52px] p-[4px]" style={{ background: 'radial-gradient(circle at 4px 4px, transparent 2.4px, #FFFDF7 2.6px) -4px -4px / 8px 8px', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))' }} aria-hidden>
                  <div className="flex h-full w-full items-end justify-center" style={{ background: P.pine }}>
                    <svg viewBox="0 0 40 50" className="h-full w-full">
                      <path d="M20 8l12 26H8Z" fill="#2A7A4F" />
                      <path d="M20 18l14 24H6Z" fill="#1F5A3C" />
                      <path d="M20 6l1.4 3 3.2.3-2.4 2 .8 3.2-3-1.8-3 1.8.8-3.2-2.4-2 3.2-.3Z" fill="#F3D58A" />
                      <circle cx="14" cy="28" r="1.6" fill="#D7263D" /><circle cx="25" cy="34" r="1.6" fill="#F3D58A" /><circle cx="19" cy="22" r="1.4" fill="#D7263D" />
                    </svg>
                  </div>
                </div>
                <div className="absolute right-[64px] top-[30px] flex h-[58px] w-[58px] items-center justify-center rounded-full text-center" style={{ border: '1.5px solid rgba(179,18,46,0.45)', color: 'rgba(179,18,46,0.6)', transform: 'rotate(-14deg)', fontFamily: sans, fontSize: 7.5, letterSpacing: '0.12em', lineHeight: 1.3 }} aria-hidden>
                  <span className="uppercase">{(town || 'With love').slice(0, 14)}<br />{main ? `${main.day} ${main.monthShort.toUpperCase()}` : 'XMAS'}</span>
                </div>
                <Holly className="mb-4 h-7 w-14" />
                <div style={{ fontFamily: hand, fontSize: 'clamp(21px, 6.2cqi, 24px)', lineHeight: 1.45, color: P.soft }}>
                  <p style={{ color: P.holly }}>{guest ? `Dear ${guest},` : 'Dear friends,'}</p>
                  {note.map((line, i) => (
                    <p key={i} className="mt-3">{line}</p>
                  ))}
                  {hosts && <p className="mt-6" style={{ color: P.pine }}>With love,<br />{hosts}</p>}
                </div>
              </Reveal>
            </section>
          )}

          {/* ── The evening ─────────────────────────────────────────── */}
          {evening.length > 0 && (
            <section id={ids.evening} className="relative px-5 pb-16 pt-14" style={{ background: P.paper, color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview}>
                <Heading kicker={main ? `${main.weekday} ${main.day} ${main.month}` : 'On the night'}>The evening</Heading>
              </Reveal>
              <ol className="relative mx-auto mt-10 w-[min(100%,24rem)]">
                <span className="absolute bottom-3 left-[23px] top-3 w-[6px] rounded-full" style={{ background: `repeating-linear-gradient(180deg, ${P.holly} 0 10px, #D7263D 10px 20px)` }} aria-hidden />
                {evening.map((item, i) => (
                  <Reveal as="li" key={i} disabled={isPreview} delay={i * 70} className="relative flex items-start gap-5 pb-8 last:pb-0">
                    <span className="relative z-[1] mt-0.5 flex h-[52px] w-[52px] shrink-0 flex-col items-center" aria-hidden>
                      <span className="block h-[8px] w-[14px] rounded-t-[2px]" style={{ background: P.gold }} />
                      <span className="block h-[42px] w-[42px] rounded-full" style={{ background: [P.holly, P.gold, P.needle, '#C9CED6'][i % 4], boxShadow: 'inset -6px -8px 0 rgba(0,0,0,0.18), inset 6px 6px 0 rgba(255,255,255,0.25)' }} />
                    </span>
                    <div className="min-w-0 pt-1">
                      {item.time && <p style={{ fontFamily: display, fontStyle: 'italic', fontSize: 22, lineHeight: 1.1, color: P.holly }}>{item.time}</p>}
                      <p className="mt-0.5 text-[17px] leading-snug" style={{ color: P.ink }}>{item.title}</p>
                      {item.note && <p className="mt-1 text-[14px]" style={{ color: P.soft }}>{item.note}</p>}
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {/* ── The table ───────────────────────────────────────────── */}
          {menu.length > 0 && (
            <section className="relative px-5 py-16" style={{ background: P.cream, color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,25rem)] px-7 pb-9 pt-9 text-center" style={{ background: '#FFFDF7', border: `1px solid ${P.gold}`, outline: `4px double ${P.gold}`, outlineOffset: 6 }}>
                <Holly className="mx-auto h-7 w-14" />
                <h2 className="mt-2" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(30px, 9cqi, 40px)', lineHeight: 1.05, color: P.pine }}>At the table</h2>
                <ul className="mt-6 space-y-3 text-left">
                  {menu.map((m, i) => {
                    const you = /^you\b/i.test(m.who)
                    return (
                      <li key={i} className="flex items-baseline gap-2">
                        <span className="text-[16px] leading-snug" style={{ color: P.ink }}>{m.dish}</span>
                        {m.who && (
                          <>
                            <span className="min-w-[1.5rem] flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: P.faint }} />
                            <span className={you ? 'rounded-full px-2.5 py-0.5' : ''} style={{ fontFamily: hand, fontSize: 20, color: you ? P.cream : P.holly, background: you ? P.holly : 'transparent', whiteSpace: 'nowrap' }}>{m.who}</span>
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
                {menu.some((m) => /^you\b/i.test(m.who)) && hasRsvp && <p className="mt-6 text-[14px]" style={{ color: P.soft }}>Tell us what you’ll bring when you reply.</p>}
              </Reveal>
            </section>
          )}

          {(budget || santaNote) && <SecretSanta budget={budget} note={santaNote} isPreview={isPreview} />}

          {photos.length > 0 && <PhotoBaubles photos={photos} isPreview={isPreview} />}

          {/* ── What to wear ────────────────────────────────────────── */}
          {data.dressCode?.trim() && (
            <section className="relative pb-14" style={{ background: P.pine, color: P.cream, containerType: 'inline-size' }}>
              <FairIsle uid={`${uid}k`} />
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)] px-6 pt-10 text-center">
                <Caps color={P.goldLight}>What to wear</Caps>
                <p className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(26px, 8cqi, 34px)', lineHeight: 1.2, textWrap: 'balance' }}>{data.dressCode.trim()}</p>
              </Reveal>
            </section>
          )}

          {/* ── Where ───────────────────────────────────────────────── */}
          {where && (
            <section className="relative px-5 py-16" style={{ background: P.cream, color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] text-center">
                <Caps color={P.holly}>Find us</Caps>
                <p className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(30px, 9cqi, 40px)', lineHeight: 1.1, color: P.pine }}>{venue || address}</p>
                {venue && address && <p className="mt-2 text-[16px] leading-6" style={{ color: P.soft }}>{address}</p>}
                {main && (
                  <p className="mt-4 text-[16px]" style={{ color: P.ink }}>
                    {main.long}
                    {time && ` · ${time}`}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  <Btn href={mapsHref(data.mapsUrl, venue, address)} isPreview={isPreview} tone="red">Directions</Btn>
                  <Btn href={calendarHref(`${title}${hosts ? ` — ${hosts}` : ''}`, data.date, data.time, where, 5)} isPreview={isPreview}>Add to calendar</Btn>
                </div>
              </Reveal>
            </section>
          )}

          <ChristmasRsvp anchor={ids.rsvp} hosts={hosts} what={what} phone={data.rsvpPhone} email={data.rsvpEmail} rsvpBy={data.rsvpBy} guest={guest} isPreview={isPreview} />

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Christmas cards"
              intro={`Leave a Christmas card for ${hosts || 'the family'} — everyone who opens this invitation can read it.`}
              noun="card"
              previewWishes={SAMPLE_WISHES}
              namePlaceholder="e.g. The Thompsons"
            />
          )}

          {/* ── Foot: the village under snow ─────────────────────────── */}
          <footer className="relative overflow-hidden px-6 pb-10 pt-16 text-center" style={{ background: 'linear-gradient(180deg, #24395E 0%, #172A48 34%, #0B1626 70%)' }}>
            <Snow count={30} seed={77} />
            <svg viewBox="0 0 400 96" className="relative mx-auto block w-[min(100%,28rem)]" aria-hidden>
              <circle cx="334" cy="16" r="11" fill="#F6F0DC" />
              {VILLAGE.map((h, i) => (
                <g key={i}>
                  <path d={`M${h.x} 96V${h.top}L${h.x + h.w / 2} ${h.top - h.roof}L${h.x + h.w} ${h.top}V96Z`} fill={i % 2 ? '#070D18' : '#0B1322'} />
                  {h.chimney && <rect x={h.x + h.w * 0.68} y={h.top - h.roof * 0.75} width={5} height={h.roof * 0.55} fill={i % 2 ? '#070D18' : '#0B1322'} />}
                  <path d={`M${h.x - 1.5} ${h.top + 1}L${h.x + h.w / 2} ${h.top - h.roof}L${h.x + h.w + 1.5} ${h.top + 1}`} stroke="#F4F7FB" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {h.windows.map(([wx, wy], k) => (
                    <rect key={k} className="xm-flicker" x={wx} y={wy} width="6" height="7" fill="#FFD27A" style={{ animationDelay: `${(i * 0.37 + k * 0.5) % 3}s` }} />
                  ))}
                </g>
              ))}
              <rect x="0" y="92" width="400" height="4" fill="#F4F7FB" />
            </svg>
            <p className="relative mt-6" style={{ fontFamily: script, fontSize: 44, lineHeight: 1, ...goldText() }}>Merry Christmas</p>
            {hosts && <p className="relative mt-2" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 20, color: P.creamSoft }}>from {hosts}</p>}
            <div className="relative mt-9">
              <Credit isPreview={isPreview} color={P.creamFaint} linkColor={P.cream} />
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
