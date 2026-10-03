'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { rozha } from './kit/fonts/rozha'
import { kalam } from './kit/fonts/kalam'
import { mukta } from './kit/fonts/mukta'
import { balooTamma } from './kit/fonts/balooTamma'
import { calendarHref, dateParts, galleryImages, mapsHref, parseLines, parseRows, timeLabel, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import { ChannelIcon, rsvpChannels } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Ambari — Mysuru Dasara.
 * It opens at dusk, the way Dasara evenings do in Mysuru: the palace dark
 * against a violet sky, a crowd waiting with their phones up. The guest taps
 * "Light the palace" and its bulbs come on in a wave from the golden dome down,
 * then an elephant in a red-and-gold jhool walks in carrying the Ambari and
 * raises its trunk. Inside: a letter from the family in their own hand, every
 * day of the festival on a card in that day's Navaratri colour (today's colour
 * is picked out), the Bombe Habba steps with Channapatna-style dolls that
 * wiggle when tapped, an RSVP that asks which days you'll come, and at the end
 * a sprig of banni that turns to gold when you take it.
 */

const P = {
  night: '#0B0730',
  dusk: '#26114F',
  plum: '#5A1D5C',
  ember: '#E06A2C',
  gold: '#E9B949',
  goldDeep: '#A87A22',
  goldLight: '#FFE7A3',
  marigold: '#F7931E',
  marigoldLight: '#FFC23D',
  kumkum: '#C8102E',
  maroon: '#6B0E24',
  maroonDeep: '#4A0818',
  silk: '#B3175C',
  leaf: '#3E7C2A',
  leafLight: '#6FAE3B',
  peacock: '#0E6E78',
  ivory: '#FFF7E8',
  paper: '#FBEBCB',
  ink: '#2A1610',
  soft: 'rgba(42,22,16,0.76)',
  faint: 'rgba(42,22,16,0.54)',
  rule: 'rgba(42,22,16,0.14)',
  cream: '#FFF1D6',
  creamSoft: 'rgba(255,241,214,0.8)',
  creamFaint: 'rgba(255,241,214,0.56)',
  creamRule: 'rgba(255,241,214,0.2)',
}

const display = rozha.style.fontFamily
const hand = kalam.style.fontFamily
const sans = mukta.style.fontFamily

/** The opening fills a phone's screen in the builder's preview: about 19.5 : 9, whatever width the phone is drawn at. */
const PREVIEW_H = 'max(520px, 210cqi)'
const kannada = balooTamma.style.fontFamily

const GOLD_TEXT = 'linear-gradient(180deg, #FFF3C2 0%, #F8CB5A 42%, #D9982A 68%, #FFE49A 100%)'
const ZARI = 'repeating-linear-gradient(90deg, #A87A22 0 7px, #6B0E24 7px 10px, #E9B949 10px 14px, #6B0E24 14px 17px)'
const KOLAM_DOTS = 'radial-gradient(circle at 1.5px 1.5px, rgba(107,14,36,0.13) 1.3px, transparent 1.9px)'

const WISHES_THEME: InviteTheme = {
  bg: P.ivory,
  surface: '#FFFFFF',
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.maroon,
  onAccent: P.cream,
  heading: display,
  body: sans,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 42px)', color: P.maroon, fontWeight: 400 },
}

const SAMPLE_WISHES = [
  { name: 'Shalini & family', message: 'We’ll come on Saturday for the dolls — Meera’s cricket team is all the children have talked about. Happy Dasara to all of you!' },
  { name: 'Prakash mama', message: 'Banni for Ajji first, as always. See you on Vijayadashami.' },
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
  backgroundImage: GOLD_TEXT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

const isIso = (v?: string) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(y, m - 1, d + n, 12)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

const shortDay = (iso?: string) => {
  const d = dateParts(iso)
  return d ? `${d.weekday.slice(0, 3)} ${d.day} ${d.monthShort}` : ''
}

/** The Navaratri colours, and any others a family might name. */
const COLOURS: Record<string, string> = {
  orange: '#F26F21', white: '#FFFFFF', red: '#D0192B', 'royal blue': '#2443B0', blue: '#2563EB', 'sky blue': '#4FB0E5',
  yellow: '#F7C516', green: '#2E8B3E', grey: '#8D8B93', gray: '#8D8B93', purple: '#6A2B9E', 'peacock green': '#00857A',
  'peacock blue': '#0B6E8A', pink: '#E8478B', 'rani pink': '#D61F7A', magenta: '#C2187A', maroon: '#7A1F2B',
  gold: '#D4A72C', cream: '#F3E6C8', 'parrot green': '#4CAF3B', black: '#1C1A1A', silver: '#BFC3C9', turquoise: '#18A79B',
}

function colourHex(name: string): string {
  const key = name.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/i.test(key)) return key
  return COLOURS[key] ?? '#C9B48F'
}

/** Dark text on light colours, cream on dark ones. */
function onColour(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  // 0.2 is about where dark and light text give the same contrast.
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.2 ? P.ink : '#FFF8EC'
}

/* ── The palace, outlined in bulbs ─────────────────────────────────── */

type Pt = readonly [number, number]
type Seg = (t: number) => Pt

const L = (a: Pt, b: Pt): Seg => (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const C = (p0: Pt, p1: Pt, p2: Pt, p3: Pt): Seg => (t) => {
  const u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [k[0] * p0[0] + k[1] * p1[0] + k[2] * p2[0] + k[3] * p3[0], k[0] * p0[1] + k[1] * p1[1] + k[2] * p2[1] + k[3] * p3[1]]
}
/** The top half of a circle, left to right. */
const A = (cx: number, cy: number, r: number): Seg => (t) => [cx - r * Math.cos(Math.PI * t), cy - r * Math.sin(Math.PI * t)]
const mirror = (s: Seg): Seg => (t) => {
  const [x, y] = s(t)
  return [400 - x, y]
}

interface Arch { x0: number; x1: number; spring: number; base: number }

/* The front of the palace, as an architect's elevation 400 wide. */
const ARCHES: Arch[] = (() => {
  const left: Arch[] = []
  for (let i = 0; i < 4; i++) left.push({ x0: r1(29 + i * 30.5), x1: r1(29 + i * 30.5 + 24.5), spring: 194, base: 214 })
  for (const c of [62, 80, 98, 116, 134]) left.push({ x0: c - 5, x1: c + 5, spring: 158, base: 166 })
  const right = left.map((a) => ({ ...a, x0: r1(400 - a.x1), x1: r1(400 - a.x0) }))
  const centre: Arch[] = [{ x0: 174, x1: 226, spring: 162, base: 214 }, ...[168, 200, 232].map((c) => ({ x0: c - 6, x1: c + 6, spring: 116, base: 128 }))]
  return [...left, ...right, ...centre]
})()

const archSegs = (a: Arch): Seg[] => [L([a.x0, a.base], [a.x0, a.spring]), A((a.x0 + a.x1) / 2, a.spring, (a.x1 - a.x0) / 2), L([a.x1, a.spring], [a.x1, a.base])]

const SEGMENTS: Seg[] = (() => {
  const half: Seg[] = [
    L([10, 214], [200, 214]),
    L([24, 170], [150, 170]),
    L([40, 140], [150, 140]),
    L([150, 214], [150, 96]),
    L([150, 96], [184, 96]),
    L([184, 96], [184, 56]),
    L([182, 84], [200, 84]),
    L([182, 70], [200, 70]),
    L([182, 56], [200, 56]),
    C([184, 56], [160, 48], [176, 24], [200, 14]),
    L([152, 96], [152, 76]),
    L([166, 96], [166, 76]),
    C([150, 76], [144, 70], [152, 64], [159, 60]),
    C([159, 60], [166, 64], [174, 70], [168, 76]),
    L([26, 170], [26, 116]),
    L([54, 170], [54, 116]),
    C([28, 116], [16, 110], [26, 98], [40, 92]),
    C([40, 92], [54, 98], [64, 110], [52, 116]),
    L([40, 92], [40, 84]),
    L([88, 140], [88, 130]),
    L([102, 140], [102, 130]),
    C([86, 130], [84, 125], [90, 121], [95, 118]),
    C([95, 118], [100, 121], [106, 125], [104, 130]),
  ]
  return [...half, ...half.map(mirror), L([200, 14], [200, 4]), ...ARCHES.flatMap(archSegs)]
})()

const WAVES = 18

/** Bulbs every `gap` units along the outlines, grouped into waves that light from the dome down. */
const BULBS: { waves: string[]; glow: string; count: number } = (() => {
  const gap = 4.4
  const grid = new Map<string, Pt[]>()
  const pts: Pt[] = []
  const near = (x: number, y: number) => {
    const gx = Math.round(x / gap)
    const gy = Math.round(y / gap)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const p of grid.get(`${gx + dx},${gy + dy}`) ?? []) if (Math.hypot(p[0] - x, p[1] - y) < gap * 0.7) return true
      }
    }
    return false
  }
  for (const s of SEGMENTS) {
    const acc: { t: number; d: number }[] = [{ t: 0, d: 0 }]
    let prev = s(0)
    let len = 0
    for (let i = 1; i <= 64; i++) {
      const p = s(i / 64)
      len += Math.hypot(p[0] - prev[0], p[1] - prev[1])
      acc.push({ t: i / 64, d: len })
      prev = p
    }
    const n = Math.max(1, Math.round(len / gap))
    for (let k = 0; k <= n; k++) {
      const target = (k / n) * len
      let j = 1
      while (j < acc.length - 1 && acc[j].d < target) j++
      const a = acc[j - 1]
      const b = acc[j]
      const t = a.t + (b.t - a.t) * ((target - a.d) / Math.max(1e-6, b.d - a.d))
      const [x, y] = s(t)
      if (near(x, y)) continue
      const p: Pt = [r1(x), r1(y)]
      pts.push(p)
      const key = `${Math.round(x / gap)},${Math.round(y / gap)}`
      grid.set(key, [...(grid.get(key) ?? []), p])
    }
  }
  const dot = (p: Pt, r: number) => `M${r1(p[0] - r)} ${p[1]}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`
  const far = Math.max(...pts.map((p) => Math.hypot(p[0] - 200, p[1] - 6)))
  const waves: string[] = Array.from({ length: WAVES }, () => '')
  for (const p of pts) {
    const w = Math.min(WAVES - 1, Math.floor((Math.hypot(p[0] - 200, p[1] - 6) / far) * WAVES))
    waves[w] += dot(p, 1.15)
  }
  return { waves, glow: pts.map((p) => dot(p, 2.6)).join(''), count: pts.length }
})()

const SILHOUETTE = [
  'M10 214h380v18H10z',
  'M24 170h126v44H24zM250 170h126v44H250z',
  'M40 140h110v30H40zM250 140h110v30H250z',
  'M150 96h100v118H150z',
  'M26 116h28v54H26zM346 116h28v54h-28z',
  'M28 116C16 110 26 98 40 92C54 98 64 110 52 116zM348 116C336 110 346 98 360 92C374 98 384 110 372 116z',
  'M184 56h32v40h-32z',
  'M184 56C160 48 176 24 200 14C224 24 240 48 216 56z',
  'M152 76h14v20h-14zM234 76h14v20h-14z',
  'M150 76C144 70 152 64 159 60C166 64 174 70 168 76zM232 76C226 70 234 64 241 60C248 64 256 70 250 76z',
  'M88 130h14v10H88zM298 130h14v10h-14z',
  'M86 130C84 125 90 121 95 118C100 121 106 125 104 130zM296 130C294 125 300 121 305 118C310 121 316 125 314 130z',
].join('')

const OPENINGS = ARCHES.map((a) => `M${a.x0} ${a.base}V${a.spring}A${r1((a.x1 - a.x0) / 2)} ${r1((a.x1 - a.x0) / 2)} 0 0 1 ${a.x1} ${a.spring}V${a.base}Z`).join('')

function Palace({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 400 240" className="block w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="62%" r="50%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#FF8A2B" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FF8A2B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="60%" stopColor="#D9822F" />
          <stop offset="100%" stopColor="#8A3B1C" />
        </linearGradient>
        <filter id={`${uid}-bloom`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <ellipse className="am-glow" cx="200" cy="150" rx="230" ry="150" fill={`url(#${uid}-halo)`} />
      <path d={SILHOUETTE} fill="#140C36" />
      <path className="am-warm" d={SILHOUETTE} fill={`url(#${uid}-stone)`} />
      <path d={OPENINGS} fill="#07041A" />
      <path className="am-warm" d={OPENINGS} fill="#FF9F43" opacity={0.85} />
      <path d="M200 4v-1" stroke="#140C36" />
      <circle cx="200" cy="3.4" r="1.7" fill="#E9B949" />
      <path className="am-bloom" d={BULBS.glow} fill="#FFC861" filter={`url(#${uid}-bloom)`} />
      <g fill="#FFE6A6">
        {BULBS.waves.map((d, i) => (
          <path key={i} className="am-w" d={d} style={{ '--d': `${i * 95}ms` } as CSSProperties} />
        ))}
      </g>
    </svg>
  )
}

/* ── The crowd, phones up ──────────────────────────────────────────── */

const CROWD = (() => {
  const rand = rng(37)
  const heads: { x: number; y: number; r: number }[] = []
  const phones: { x: number; y: number; arm: string }[] = []
  let x = -6
  while (x < 410) {
    const r = r1(5 + rand() * 2.4)
    const y = r1(34 + rand() * 6)
    heads.push({ x: r1(x), y, r })
    if (rand() < 0.12) heads.push({ x: r1(x + 1), y: r1(y - 13), r: r1(r * 0.72) })
    else if (rand() < 0.26) {
      const px = r1(x + (rand() < 0.5 ? -7 : 7))
      const py = r1(10 + rand() * 9)
      phones.push({ x: px, y: py, arm: `M${r1(x)} ${r1(y + r + 2)}L${px} ${r1(py + 7)}` })
    }
    x += 10 + rand() * 6
  }
  return { heads, phones }
})()

function Crowd() {
  return (
    <svg viewBox="0 0 400 64" preserveAspectRatio="xMidYMax slice" className="block w-full" aria-hidden>
      <g fill="#05031A" stroke="#05031A">
        {CROWD.phones.map((p, i) => <path key={`a${i}`} d={p.arm} strokeWidth={3.2} strokeLinecap="round" fill="none" />)}
        {CROWD.heads.map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={h.y} r={h.r} stroke="none" />
            <ellipse cx={h.x} cy={r1(h.y + h.r + 9)} rx={r1(h.r * 1.9)} ry={10} stroke="none" />
          </g>
        ))}
        <rect x="-10" y="54" width="420" height="12" stroke="none" />
      </g>
      {CROWD.phones.map((p, i) => (
        <g key={`p${i}`}>
          <rect x={r1(p.x - 2.6)} y={p.y} width="5.2" height="8" rx="1" fill="#05031A" />
          <rect className="am-screen" x={r1(p.x - 1.9)} y={r1(p.y + 0.8)} width="3.8" height="6.4" rx="0.6" fill="#FFE2A8" style={{ animationDelay: `${(i % 5) * 0.7}s` }} />
        </g>
      ))}
    </svg>
  )
}

/* ── The elephant and the golden Ambari ────────────────────────────── */

function Elephant({ uid }: { uid: string }) {
  const g = `${uid}-gold`
  const s = `${uid}-skin`
  return (
    <svg viewBox="0 -16 220 216" className="block w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF0B0" />
          <stop offset="45%" stopColor="#E9B949" />
          <stop offset="100%" stopColor="#9C6B16" />
        </linearGradient>
        <linearGradient id={s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E86A0" />
          <stop offset="100%" stopColor="#5D566E" />
        </linearGradient>
        <radialGradient id={`${uid}-shrine`} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FFF6D8" />
          <stop offset="60%" stopColor="#FFC24A" />
          <stop offset="100%" stopColor="#C46A12" />
        </radialGradient>
      </defs>

      <g className="am-bob">
        {/* far legs */}
        <g className="am-leg-b" style={{ transformOrigin: '94px 146px' }}><rect x="86" y="146" width="17" height="40" rx="7" fill="#4C4659" /></g>
        <g className="am-leg-a" style={{ transformOrigin: '158px 146px' }}><rect x="150" y="146" width="17" height="40" rx="7" fill="#4C4659" /></g>

        {/* tail */}
        <path d="M187 124C195 134 196 148 192 158" stroke="#5D566E" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M190 156l4 8-6-2z" fill="#3B3546" />

        {/* body and head */}
        <ellipse cx="130" cy="130" rx="60" ry="41" fill={`url(#${s})`} />
        <circle cx="72" cy="111" r="31" fill={`url(#${s})`} />
        <path d="M80 95C97 90 108 104 106 122C104 137 93 141 84 135Z" fill="#9C93AE" />
        <path d="M86 102C96 101 101 111 99 122C97 130 91 132 87 128Z" fill="#E6A6B8" opacity={0.55} />

        {/* the jhool: red velvet, gold zari, tassels */}
        <path d="M95 93C112 85 152 85 178 98L183 150Q172 158 161 150Q149 160 137 150Q125 160 113 150Q102 158 96 150Z" fill="#A3123A" stroke={`url(#${g})`} strokeWidth={3.2} strokeLinejoin="round" />
        <path d="M103 100C118 93 150 93 172 104L175 143Q166 148 160 143Q149 151 138 143Q126 151 115 143Q106 148 103 143Z" fill="none" stroke="#E9B949" strokeWidth={1} strokeDasharray="2 2.4" />
        <circle cx="139" cy="122" r="11" fill="none" stroke={`url(#${g})`} strokeWidth={2.4} />
        <circle cx="139" cy="122" r="5" fill="#E9B949" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * Math.PI) / 4
          return <circle key={i} cx={r1(139 + Math.cos(a) * 15.5)} cy={r1(122 + Math.sin(a) * 15.5)} r={1.8} fill="#FFE08A" />
        })}
        {[96, 113, 137, 161, 183].map((x, i) => (
          <g key={i}>
            <path d={`M${x} ${i % 2 ? 151 : 150}v6`} stroke="#E9B949" strokeWidth={1.2} />
            <circle cx={x} cy={i % 2 ? 159 : 158} r={2.4} fill="#E9B949" />
          </g>
        ))}

        {/* near legs, anklets with bells */}
        <g className="am-leg-a" style={{ transformOrigin: '79px 148px' }}>
          <rect x="70" y="148" width="19" height="42" rx="7" fill={`url(#${s})`} />
          <rect x="69" y="174" width="21" height="5" rx="2" fill={`url(#${g})`} />
          {[73, 79, 85].map((x) => <circle key={x} cx={x} cy={181.5} r={1.7} fill="#E9B949" />)}
          <path d="M73 189.5h4M80 189.5h4" stroke="#EDE6F2" strokeWidth={1.4} strokeLinecap="round" />
        </g>
        <g className="am-leg-b" style={{ transformOrigin: '145px 148px' }}>
          <rect x="136" y="148" width="19" height="42" rx="7" fill={`url(#${s})`} />
          <rect x="135" y="174" width="21" height="5" rx="2" fill={`url(#${g})`} />
          {[139, 145, 151].map((x) => <circle key={x} cx={x} cy={181.5} r={1.7} fill="#E9B949" />)}
          <path d="M139 189.5h4M146 189.5h4" stroke="#EDE6F2" strokeWidth={1.4} strokeLinecap="round" />
        </g>

        {/* trunk, painted, raised in greeting once it arrives */}
        <g className="am-trunk" style={{ transformOrigin: '52px 122px' }}>
          <path d="M52 120C42 140 39 160 44 176C47 185 39 191 33 186" stroke={`url(#${s})`} strokeWidth={14} fill="none" strokeLinecap="round" />
          {[134, 146, 158, 170].map((y, i) => <path key={y} d={`M${r1(46 - i * 1.6)} ${y}h9`} stroke="#4C4659" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />)}
          {[[48, 128, '#FFC23D'], [44, 141, '#F7931E'], [42, 154, '#E8478B'], [43, 167, '#FFC23D']].map(([x, y, c]) => (
            <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r={2.1} fill={c as string} />
          ))}
        </g>
        <path d="M58 132C51 140 43 143 36 141" stroke="#FFF6E2" strokeWidth={4.2} fill="none" strokeLinecap="round" />

        {/* forehead plate */}
        <path d="M47 92C56 81 80 79 89 88L77 117L65 146L55 117Z" fill={`url(#${g})`} stroke="#9C6B16" strokeWidth={1} />
        <circle cx="68" cy="97" r="3.6" fill="#C8102E" />
        <circle cx="67" cy="110" r="3" fill="#1F9D55" />
        <circle cx="66" cy="122" r="2.6" fill="#C8102E" />
        <circle cx="55" cy="96" r="1.6" fill="#FFF6D8" />
        <circle cx="80" cy="95" r="1.6" fill="#FFF6D8" />
        <circle cx="60" cy="104" r="2.6" fill="#2A2233" />
        <path d="M56 101.5q3-2 7-.5" stroke="#2A2233" strokeWidth={0.9} fill="none" />

        {/* the Ambari */}
        <rect x="98" y="77" width="68" height="11" rx="2" fill={`url(#${g})`} stroke="#9C6B16" strokeWidth={0.8} />
        {[104, 112, 120, 128, 136, 144, 152, 160].map((x) => <circle key={x} cx={x} cy={82.5} r={1.5} fill="#C8102E" />)}
        <path d="M108 77V46h48v31Z" fill={`url(#${uid}-shrine)`} className="am-shrine" />
        <path d="M128 76l4-16 4 16Z" fill="#B7801E" />
        <circle cx="132" cy="57" r="3" fill="#B7801E" />
        <path d="M128.5 54.5l1.2-3 1.1 2 1.2-3 1.2 3 1.1-2 1.2 3" stroke="#B7801E" strokeWidth={0.9} fill="none" />
        {[102, 117, 147, 162].map((x) => <rect key={x} x={x - 2.4} y={44} width={4.8} height={34} rx={1.6} fill={`url(#${g})`} />)}
        <path d="M106 50q6.5 6 13 0q6.5 6 13 0q6.5 6 13 0q6.5 6 13 0" stroke="#F7931E" strokeWidth={2.6} fill="none" strokeDasharray="0.1 3.2" strokeLinecap="round" />
        <rect x="94" y="38" width="76" height="8" rx="2" fill={`url(#${g})`} stroke="#9C6B16" strokeWidth={0.8} />
        <path d="M100 38C100 20 118 7 132 3C146 7 164 20 164 38Z" fill={`url(#${g})`} stroke="#9C6B16" strokeWidth={0.8} />
        <path d="M110 34C112 22 122 13 132 9" stroke="#FFF6D0" strokeWidth={1.6} fill="none" opacity={0.7} strokeLinecap="round" />
        <path d="M132 3V-8" stroke="#B7801E" strokeWidth={1.6} />
        <circle cx="132" cy="-9.5" r="2.6" fill={`url(#${g})`} />
        {[96, 168].map((x) => <path key={x} d={`M${x} 38c-3-5-1-9 2-11c3 2 5 6 2 11Z`} fill={`url(#${g})`} />)}
      </g>
    </svg>
  )
}

/* ── Marigold petals and stars ─────────────────────────────────────── */

function Petals({ count, seed }: { count: number; seed: number }) {
  const items = useMemo(() => {
    const rand = rng(seed)
    return Array.from({ length: count }, () => ({
      left: r1(rand() * 100),
      w: r1(5 + rand() * 6),
      dur: r1(6 + rand() * 6),
      delay: r1(rand() * 5),
      drift: r1(-30 + rand() * 60),
      spin: Math.round(180 + rand() * 360),
      c: rand() < 0.55 ? P.marigold : rand() < 0.5 ? P.marigoldLight : '#E8478B',
    }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          className="am-petal absolute -top-6 block rounded-[60%_40%_60%_40%]"
          style={{ left: `${p.left}%`, width: p.w, height: r1(p.w * 0.62), background: p.c, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--x': `${p.drift}px`, '--r': `${p.spin}deg` } as CSSProperties}
        />
      ))}
    </div>
  )
}

function Stars({ count, seed }: { count: number; seed: number }) {
  const items = useMemo(() => {
    const rand = rng(seed)
    return Array.from({ length: count }, () => ({ x: r1(rand() * 100), y: r1(rand() * 52), s: r1(1 + rand() * 1.6), d: r1(2 + rand() * 4), o: r1(rand() * 3) }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {items.map((s, i) => (
        <span key={i} className="am-star absolute block rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDuration: `${s.d}s`, animationDelay: `${s.o}s` }} />
      ))}
    </div>
  )
}

/* ── Ornament ──────────────────────────────────────────────────────── */

/** A string of mango leaves and marigolds, as hung over every doorway at Dasara. */
function Toran({ uid }: { uid: string }) {
  const id = `${uid}-toran`
  return (
    <svg className="block h-[50px] w-full" aria-hidden>
      <defs>
        <pattern id={id} width="56" height="50" patternUnits="userSpaceOnUse">
          <path d="M0 5.5Q28 9 56 5.5" stroke="#7A4A12" strokeWidth={1.4} fill="none" />
          {[9, 47].map((x) => (
            <g key={x} transform={`translate(${x} 7)`}>
              <path d="M0 0C7 11 7 26 0 38C-7 26-7 11 0 0Z" fill={x === 9 ? '#2F7A2A' : '#4E9A32'} />
              <path d="M0 2V35" stroke="#1E5A1C" strokeWidth={0.8} />
            </g>
          ))}
          {[[28, 13, '#F7931E'], [28, 23, '#FFC23D'], [28, 33, '#F7931E']].map(([x, y, c]) => (
            <g key={`${y}`}>
              <circle cx={x as number} cy={y as number} r={5.6} fill={c as string} />
              <circle cx={x as number} cy={y as number} r={5.6} fill="none" stroke="#C2410C" strokeWidth={0.8} strokeDasharray="1.4 1.6" />
              <circle cx={x as number} cy={y as number} r={1.6} fill="#9A3412" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="50" fill={`url(#${id})`} />
    </svg>
  )
}

function Caps({ children, color = P.goldDeep, size = 12, className = '' }: { children: ReactNode; color?: string; size?: number; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontWeight: 600, fontSize: size, letterSpacing: '0.24em', color }}>
      {children}
    </p>
  )
}

function Heading({ kicker, children, color = P.maroon, kickerColor = P.goldDeep }: { kicker?: string; children: ReactNode; color?: string; kickerColor?: string }) {
  return (
    <div className="text-center">
      {kicker && <Caps color={kickerColor}>{kicker}</Caps>}
      <h2 className="mt-2" style={{ fontFamily: display, fontWeight: 400, fontSize: 'clamp(32px, 10cqi, 46px)', lineHeight: 1.05, color }}>{children}</h2>
    </div>
  )
}

function Btn({ href, isPreview, children, tone = 'light' }: { href: string | null; isPreview: boolean; children: ReactNode; tone?: 'light' | 'dark' | 'gold' }) {
  if (!href) return null
  const look: CSSProperties =
    tone === 'gold'
      ? { background: 'linear-gradient(180deg, #F8D372, #D9982A)', color: P.maroonDeep, border: '1px solid #B7801E' }
      : tone === 'dark'
        ? { background: 'transparent', color: P.cream, border: `1px solid ${P.creamRule}` }
        : { background: '#FFFFFF', color: P.maroon, border: `1px solid ${P.rule}` }
  return (
    <DirectionsLink href={href} isPreview={isPreview} className="am-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold" style={{ fontFamily: sans, ...look }}>
      {children}
    </DirectionsLink>
  )
}

/* ── Bombe Habba: the dolls on their steps ─────────────────────────── */

const CLOTHS = ['#B3175C', '#2F8A3E', '#C8102E', '#0E6E78', '#E07A12']

function Doll({ x, y, body, trim, crown, h = 30 }: { x: number; y: number; body: string; trim: string; crown?: boolean; h?: number }) {
  const top = y - h
  return (
    <g>
      <path d={`M${x - 8} ${y}Q${x - 9} ${top + 12} ${x - 5} ${top + 8}H${x + 5}Q${x + 9} ${top + 12} ${x + 8} ${y}Z`} fill={body} />
      <path d={`M${x - 8.4} ${y - 5}H${x + 8.4}`} stroke={trim} strokeWidth={2.2} />
      <path d={`M${x - 6} ${top + 14}H${x + 6}`} stroke={trim} strokeWidth={1.4} />
      <circle cx={x} cy={top + 2} r={6.4} fill="#F3C99B" />
      <circle cx={x - 2.2} cy={top + 1.6} r={0.9} fill="#2A1610" />
      <circle cx={x + 2.2} cy={top + 1.6} r={0.9} fill="#2A1610" />
      <circle cx={x} cy={top - 1.4} r={0.9} fill="#C8102E" />
      {crown ? (
        <path d={`M${x - 6} ${top - 3}l2-6 2 3.2 2-5 2 5 2-3.2 2 6Z`} fill="#E9B949" stroke="#A87A22" strokeWidth={0.6} />
      ) : (
        <path d={`M${x - 6.4} ${top + 1}Q${x} ${top - 8} ${x + 6.4} ${top + 1}`} fill="#2A1610" />
      )}
    </g>
  )
}

function BombeSteps() {
  const [wiggle, setWiggle] = useState<Record<number, number>>({})
  const tap = (i: number) => setWiggle((w) => ({ ...w, [i]: (w[i] ?? 0) + 1 }))
  const steps = [0, 1, 2, 3, 4].map((i) => ({ y: 46 + i * 30, w: 150 + i * 38 }))
  const toy = (i: number, children: ReactNode) => (
    <g
      key={`${i}-${wiggle[i] ?? 0}`}
      className={`am-doll${wiggle[i] ? ' am-wig' : ''}`}
      style={{ animationDelay: `${(i % 4) * 0.45}s` }}
      onClick={() => tap(i)}
      role="button"
      aria-label="Tap the doll"
      tabIndex={-1}
    >
      {children}
    </g>
  )
  return (
    <svg viewBox="0 0 320 200" className="block w-full" style={{ cursor: 'pointer' }}>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={160 - s.w / 2} y={s.y} width={s.w} height={30} fill={CLOTHS[i]} />
          <rect x={160 - s.w / 2} y={s.y} width={s.w} height={3.2} fill="#E9B949" />
          <rect x={160 - s.w / 2} y={s.y + 24} width={s.w} height={2} fill="#E9B949" opacity={0.7} />
          {Array.from({ length: Math.floor(s.w / 12) }, (_, k) => (
            <circle key={k} cx={160 - s.w / 2 + 6 + k * 12} cy={s.y + 14} r={1.3} fill="#FFE08A" opacity={0.75} />
          ))}
        </g>
      ))}
      {/* top step: the pattada gombe, the king and queen */}
      {toy(0, <Doll x={146} y={46} body="#7A1F2B" trim="#E9B949" crown h={34} />)}
      {toy(1, <Doll x={174} y={46} body="#D61F7A" trim="#E9B949" crown h={32} />)}
      {/* second: two little elephants and a kalasha */}
      {toy(2, (
        <g>
          <ellipse cx="116" cy="68" rx="13" ry="9" fill="#8E86A0" />
          <circle cx="104" cy="65" r="6.5" fill="#8E86A0" />
          <path d="M100 68q-4 6 0 8" stroke="#8E86A0" strokeWidth={3.4} fill="none" strokeLinecap="round" />
          <rect x="108" y="61" width="15" height="9" rx="2" fill="#C8102E" />
          <rect x="108" y="74" width="4" height="2" fill="#5D566E" /><rect x="121" y="74" width="4" height="2" fill="#5D566E" />
        </g>
      ))}
      {toy(3, (
        <g>
          <path d="M152 76c-6 0-8-6-6-11 2-4 4-5 4-8h12c0 3 2 4 4 8 2 5 0 11-6 11Z" fill="#E9B949" stroke="#A87A22" strokeWidth={0.8} />
          <path d="M150 57c2-4 8-6 10-1 2-5 8-3 10 1" fill="#3E7C2A" />
          <circle cx="160" cy="52" r="4.5" fill="#B5651D" />
        </g>
      ))}
      {toy(4, (
        <g>
          <ellipse cx="204" cy="68" rx="13" ry="9" fill="#8E86A0" />
          <circle cx="216" cy="65" r="6.5" fill="#8E86A0" />
          <path d="M220 68q4 6 0 8" stroke="#8E86A0" strokeWidth={3.4} fill="none" strokeLinecap="round" />
          <rect x="197" y="61" width="15" height="9" rx="2" fill="#2F8A3E" />
          <rect x="195" y="74" width="4" height="2" fill="#5D566E" /><rect x="208" y="74" width="4" height="2" fill="#5D566E" />
        </g>
      ))}
      {/* third: a Channapatna train */}
      {toy(5, (
        <g>
          <rect x="94" y="88" width="34" height="14" rx="3" fill="#C8102E" />
          <rect x="114" y="80" width="12" height="10" rx="2" fill="#F7C516" />
          <rect x="98" y="83" width="6" height="7" rx="1" fill="#2F8A3E" />
          <rect x="132" y="90" width="28" height="12" rx="3" fill="#F7C516" />
          <rect x="164" y="90" width="28" height="12" rx="3" fill="#2F8A3E" />
          <rect x="196" y="90" width="28" height="12" rx="3" fill="#0E6E78" />
          {[100, 120, 138, 154, 170, 186, 202, 218].map((cx) => <circle key={cx} cx={cx} cy={104} r={3.6} fill="#2A1610" />)}
          {[100, 120, 138, 154, 170, 186, 202, 218].map((cx) => <circle key={`h${cx}`} cx={cx} cy={104} r={1.2} fill="#F7C516" />)}
        </g>
      ))}
      {/* fourth: the dancers */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) =>
        toy(6 + k, <Doll x={94 + k * 22} y={136} body={['#E8478B', '#2443B0', '#F26F21', '#00857A', '#6A2B9E', '#D0192B', '#2E8B3E'][k]} trim="#FFE08A" h={24} />),
      )}
      {/* bottom: spinning tops and a little village */}
      {[0, 1, 2].map((k) =>
        toy(13 + k, (
          <g>
            <path d={`M${70 + k * 26} 152c-9 0-11 7-6 12l6 8 6-8c5-5 3-12-6-12Z`} fill={['#D0192B', '#F7C516', '#2443B0'][k]} />
            <path d={`M${64 + k * 26} 158h12`} stroke="#FFF" strokeWidth={1.4} />
            <path d={`M${70 + k * 26} 152v-4`} stroke="#7A4A12" strokeWidth={2} strokeLinecap="round" />
          </g>
        )),
      )}
      {toy(16, (
        <g>
          <path d="M182 172v-14l12-9 12 9v14Z" fill="#F3E6C8" />
          <path d="M180 159l14-11 14 11" stroke="#C8102E" strokeWidth={3} fill="none" strokeLinejoin="round" />
          <rect x="190" y="163" width="7" height="9" fill="#7A4A12" />
          <path d="M216 172v-12l10-8 10 8v12Z" fill="#FBE3B0" />
          <path d="M214 161l12-10 12 10" stroke="#2F8A3E" strokeWidth={3} fill="none" strokeLinejoin="round" />
          <circle cx="250" cy="164" r="8" fill="#2E8B3E" />
          <rect x="248.6" y="166" width="2.8" height="7" fill="#7A4A12" />
        </g>
      ))}
    </svg>
  )
}

/* ── Banni: the leaves you give as gold ────────────────────────────── */

const BANNI = (() => {
  const rand = rng(91)
  const twigs = [
    { x: 80, y: 168, dx: -38, dy: -30 },
    { x: 81, y: 146, dx: 40, dy: -26 },
    { x: 82, y: 122, dx: -36, dy: -28 },
    { x: 83, y: 98, dx: 38, dy: -26 },
    { x: 84, y: 74, dx: -32, dy: -24 },
    { x: 84, y: 52, dx: 30, dy: -22 },
  ]
  const leaves: { x: number; y: number; a: number; d: number }[] = []
  twigs.forEach((t, ti) => {
    const ang = Math.atan2(t.dy, t.dx)
    for (let k = 1; k <= 7; k++) {
      const f = k / 7.6
      const px = t.x + t.dx * f
      const py = t.y + t.dy * f
      for (const side of [-1, 1]) {
        const a = ang + side * 1.05
        leaves.push({ x: r1(px + Math.cos(a) * 4.6), y: r1(py + Math.sin(a) * 4.6), a: Math.round(((ang + side * 0.9) * 180) / Math.PI), d: Math.round(ti * 120 + k * 45 + rand() * 60) })
      }
    }
  })
  // the tip of the stem
  for (let k = 0; k < 6; k++) {
    for (const side of [-1, 1]) leaves.push({ x: r1(85 + side * 4.4), y: r1(44 - k * 4.6), a: Math.round(-90 + side * 52), d: 760 + k * 40 })
  }
  return { twigs, leaves }
})()

function Banni({ taken }: { taken: boolean }) {
  return (
    <svg viewBox="0 0 170 220" className={`block w-full ${taken ? 'am-banni-taken' : ''}`} aria-hidden>
      <path d="M80 214C82 170 82 110 86 22" stroke="#6B4A1E" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {BANNI.twigs.map((t, i) => (
        <path key={i} d={`M${t.x} ${t.y}q${r1(t.dx * 0.5)} ${r1(t.dy * 0.2)} ${t.dx} ${t.dy}`} stroke="#6B4A1E" strokeWidth={1.3} fill="none" strokeLinecap="round" />
      ))}
      {BANNI.leaves.map((l, i) => (
        <ellipse key={i} className="am-leaf" cx={l.x} cy={l.y} rx={4.6} ry={1.9} transform={`rotate(${l.a} ${l.x} ${l.y})`} style={{ transitionDelay: taken ? `${l.d}ms` : '0ms' }} />
      ))}
      {taken &&
        [[40, 40], [130, 70], [30, 120], [140, 150], [110, 24], [56, 180]].map(([x, y], i) => (
          <path key={i} className="am-spark" d={`M${x} ${y - 6}l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6Z`} fill="#FFE7A3" style={{ animationDelay: `${0.9 + i * 0.18}s` }} />
        ))}
    </svg>
  )
}

/* ── RSVP: which days you'll come ──────────────────────────────────── */

interface Day { name: string; date: string; time: string; note: string }

function DasaraRsvp({ anchor, days, hosts, phone, email, guest, isPreview }: { anchor: string; days: Day[]; hosts: string; phone?: string; email?: string; guest: string; isPreview: boolean }) {
  const [who, setWho] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [picked, setPicked] = useState<Record<number, boolean>>({})
  const [count, setCount] = useState(2)
  useEffect(() => {
    if (guest) setWho((w) => w || guest)
  }, [guest])

  const chosen = days.filter((_, i) => picked[i]).map((d) => (d.date ? `${d.name} (${shortDay(d.date)})` : d.name))
  const joined = chosen.length <= 1 ? chosen.join('') : `${chosen.slice(0, -1).join(', ')} and ${chosen[chosen.length - 1]}`
  const name = who.trim()
  const text =
    answer === 'no'
      ? `Dear ${hosts || 'all'}, ${name ? `${name} here — ` : ''}we can’t make it this Dasara, and we’ll miss seeing the dolls. Wishing your family a very happy Vijayadashami!`
      : `Namaskara${hosts ? ` ${hosts}` : ''}! ${name ? `${name} here — ` : ''}we’ll come${joined ? ` for ${joined}` : ''}. ${count === 1 ? 'Just me.' : `${count} of us.`} Happy Dasara!`
  const channels = rsvpChannels({ phone, email, text, subject: answer === 'no' ? 'Can’t make it this Dasara' : `Dasara — ${name || 'we’re coming'}` })
  if (!rsvpChannels({ phone, email, text: '', subject: '' }).length) return null

  const chip = (on: boolean): CSSProperties => ({
    background: on ? P.gold : 'transparent',
    color: on ? P.maroonDeep : P.cream,
    border: `1px solid ${on ? P.gold : P.creamRule}`,
  })

  return (
    <section id={anchor} className="relative px-5 py-16" style={{ background: `radial-gradient(120% 70% at 50% 0%, #8A1631, ${P.maroon} 55%, ${P.maroonDeep})`, color: P.cream }}>
      <div className="absolute inset-x-0 top-0 h-[10px]" style={{ background: ZARI }} />
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
        <Heading kicker="Will you come?" color={P.cream} kickerColor={P.gold}>Tell us which days</Heading>
        <div className="mt-8 grid grid-cols-2 gap-2.5">
          {(['yes', 'no'] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAnswer(a)} className="am-btn min-h-[48px] rounded-full text-[15px] font-semibold" style={{ fontFamily: sans, ...chip(answer === a) }} aria-pressed={answer === a}>
              {a === 'yes' ? 'Yes, we’ll come' : 'We can’t this year'}
            </button>
          ))}
        </div>
        {answer === 'yes' && days.length > 0 && (
          <div className="am-pop mt-7">
            <Caps color={P.creamSoft} size={11}>Which days?</Caps>
            <div className="mt-3 flex flex-wrap gap-2">
              {days.map((d, i) => (
                <button key={i} type="button" onClick={() => setPicked((p) => ({ ...p, [i]: !p[i] }))} aria-pressed={!!picked[i]} className="am-btn min-h-[42px] rounded-full px-4 text-left text-[14px]" style={{ fontFamily: sans, ...chip(!!picked[i]) }}>
                  {d.name}
                  {d.date && <span className="opacity-70"> · {shortDay(d.date)}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        {answer && (
          <div className="am-pop mt-7 space-y-5">
            <label className="block">
              <Caps color={P.creamSoft} size={11}>Your name</Caps>
              <input
                value={who}
                onChange={(e) => setWho(e.target.value.slice(0, 60))}
                placeholder="Shalini & family"
                className="mt-2 w-full rounded-xl px-4 py-3 text-[16px] outline-none"
                style={{ fontFamily: sans, background: 'rgba(255,241,214,0.08)', border: `1px solid ${P.creamRule}`, color: P.cream }}
              />
            </label>
            {answer === 'yes' && (
              <div className="flex items-center justify-between">
                <Caps color={P.creamSoft} size={11}>How many of you</Caps>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="am-btn h-10 w-10 rounded-full text-[20px]" style={chip(false)} aria-label="One fewer">−</button>
                  <span className="w-6 text-center text-[20px]" style={{ fontFamily: display }}>{count}</span>
                  <button type="button" onClick={() => setCount((c) => Math.min(20, c + 1))} className="am-btn h-10 w-10 rounded-full text-[20px]" style={chip(false)} aria-label="One more">+</button>
                </div>
              </div>
            )}
            <div className="grid gap-2.5">
              {channels.map((c) => (
                <a
                  key={c.kind}
                  href={isPreview ? undefined : c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className="am-btn flex min-h-[50px] items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold"
                  style={{ fontFamily: sans, background: 'linear-gradient(180deg, #F8D372, #D9982A)', color: P.maroonDeep }}
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

type Phase = 'dark' | 'lighting' | 'procession' | 'open'

export default function DasaraAmbari({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const hosts = data.hostNames?.trim() || ''
  const title = data.title?.trim() || 'Dasara at home'
  const greeting = data.greeting?.trim() || ''
  const main = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const where = [venue, address].filter(Boolean).join(', ')
  const note = useMemo(() => parseLines(data.message), [data.message])
  const story = useMemo(() => parseLines(data.bombeStory), [data.bombeStory])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const familyPhoto = data.familyPhoto && /^(https?:)?\//.test(data.familyPhoto) ? data.familyPhoto : ''
  const music = /^https?:\/\//i.test(data.musicUrl || '') ? data.musicUrl : ''
  const banni = data.banniWish?.trim() || ''

  const days: Day[] = useMemo(() => {
    const rows = parseRows(data.days, ['name', 'date', 'time', 'note'] as const).map((r) => ({
      ...r,
      date: isIso(r.date) ? r.date : '',
      time: /^\d{1,2}:\d{2}/.test(r.time) ? r.time : '',
    }))
    if (rows.length > 1 && rows.every((r) => r.date)) rows.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    return rows
  }, [data.days])

  const colours = useMemo(() => {
    const names = (data.colours || '').split(/,|\n/).map((s) => s.trim()).filter(Boolean).slice(0, 9)
    if (!isIso(data.navratriStart) || !names.length) return []
    return names.map((name, i) => ({ name, hex: colourHex(name), date: addDays(data.navratriStart, i), day: i + 1 }))
  }, [data.colours, data.navratriStart])
  const colourOf = (date: string): string | null => {
    if (!date) return null
    const hit = colours.find((c) => c.date === date)
    if (hit) return hit.hex
    if (isIso(data.navratriStart) && date === addDays(data.navratriStart, colours.length || 9)) return P.marigold
    return null
  }

  const mainName = days.find((d) => d.date && d.date === data.date)?.name || 'Dasara'

  // The guest a personal link was made for: ?to=Shalini+and+family
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])
  const dear = guest || data.guestLine?.trim() || ''

  // Today, for picking out the colour of the day. Set after mount, so the
  // server and the first client render agree.
  const [today, setToday] = useState('')
  useEffect(() => {
    const d = new Date()
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }, [])

  /* dark → the bulbs come on → the elephant walks in → open */
  const [phase, setPhase] = useState<Phase>('dark')
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
  const light = useCallback(() => {
    if (phase !== 'dark') return
    if (music && !isPreview && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('lighting')
    timers.current.push(window.setTimeout(() => setPhase('procession'), 2300))
    timers.current.push(window.setTimeout(() => setPhase('open'), 5000))
  }, [phase, music, isPreview])

  const countdown = useCountdown(data.date, data.time, !isPreview && phase === 'open')
  const ids = { days: `${uid}-days`, rsvp: `${uid}-rsvp` }
  const longest = Math.max(4, ...title.split(/\s+/).map((w) => w.length + 1))
  const titleCqi = Math.min(14.5, 84 / (longest * 0.56))
  const lit = phase !== 'dark'
  const inside = phase === 'procession' || phase === 'open'
  const hasRsvp = rsvpChannels({ phone: data.rsvpPhone, email: data.rsvpEmail, text: '', subject: '' }).length > 0

  const sky: CSSProperties = {
    background: `linear-gradient(180deg, ${P.night} 0%, ${P.dusk} 38%, ${P.plum} 66%, #A13F4F 84%, ${P.ember} 100%)`,
  }

  return (
    <div className={`am relative ph-${phase}`} style={{ background: P.night, color: P.cream, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .am .am-star { animation: am-twinkle ease-in-out infinite; opacity: .2; }
        @keyframes am-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: .95; } }
        .am .am-w { opacity: .09; }
        .am:not(.ph-dark) .am-w { animation: am-on .55s ease-out var(--d) forwards; }
        @keyframes am-on { 0% { opacity: .09; } 35% { opacity: 1; } 50% { opacity: .45; } 100% { opacity: 1; } }
        .am .am-bloom, .am .am-warm, .am .am-glow { opacity: 0; transition: opacity 2.2s ease .5s; }
        .am:not(.ph-dark) .am-bloom { opacity: .9; }
        .am:not(.ph-dark) .am-warm { opacity: .5; }
        .am:not(.ph-dark) .am-glow { opacity: 1; }
        .am .am-skywarm { opacity: 0; transition: opacity 3s ease .4s; }
        .am:not(.ph-dark) .am-skywarm { opacity: 1; }
        .am .am-screen { animation: am-screen 3.4s ease-in-out infinite; }
        @keyframes am-screen { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
        .am .am-el { transform: translateX(290%); }
        .am.ph-procession .am-el { transform: translateX(0); transition: transform 2.7s cubic-bezier(.3,.55,.35,1); }
        .am.ph-open .am-el { transform: translateX(0); }
        .am.ph-procession .am-leg-a { animation: am-step .68s ease-in-out infinite; }
        .am.ph-procession .am-leg-b { animation: am-step .68s ease-in-out -.34s infinite; }
        @keyframes am-step { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
        .am.ph-procession .am-bob { animation: am-bob .68s ease-in-out infinite; }
        @keyframes am-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .am.ph-open .am-trunk { animation: am-salute 2.2s cubic-bezier(.4,.1,.3,1) .1s both, am-sway 5s ease-in-out 2.4s infinite; }
        @keyframes am-salute { 0% { transform: rotate(0); } 40%, 62% { transform: rotate(104deg); } 100% { transform: rotate(0); } }
        @keyframes am-sway { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(6deg); } }
        .am .am-shrine { animation: am-shrine 2.6s ease-in-out infinite; }
        @keyframes am-shrine { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
        .am .am-petal { animation: am-fall linear infinite; }
        @keyframes am-fall { from { transform: translate(0, 0) rotate(0); } to { transform: translate(var(--x), 110vh) rotate(var(--r)); } }
        .am .am-intro { transition: opacity .6s ease, transform .6s ease; }
        .am:not(.ph-dark) .am-intro { opacity: 0; transform: translateY(-10px); pointer-events: none; }
        .am .am-hint { animation: am-hint 2.4s ease-in-out infinite; }
        @keyframes am-hint { 0%, 100% { box-shadow: 0 0 0 0 rgba(233,185,73,.55); } 60% { box-shadow: 0 0 0 14px rgba(233,185,73,0); } }
        .am .am-rise { animation: am-rise 1.1s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes am-rise { from { opacity: 0; transform: translateY(18px); } }
        .am .am-btn { transition: opacity .18s ease, transform .18s ease; }
        .am .am-btn:hover { opacity: .9; }
        .am .am-btn:active { transform: scale(.98); }
        .am .am-pop { animation: am-pop .4s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes am-pop { from { opacity: 0; transform: translateY(8px); } }
        .am .am-doll { animation: am-idle 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
        @keyframes am-idle { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(1.4deg); } }
        .am .am-doll.am-wig { animation: am-wig .9s cubic-bezier(.3,.6,.3,1) both; }
        @keyframes am-wig { 0% { transform: rotate(0); } 20% { transform: rotate(-14deg) translateY(-4px); } 45% { transform: rotate(11deg); } 70% { transform: rotate(-6deg); } 100% { transform: rotate(0); } }
        .am .am-leaf { fill: #5E8C31; transition: fill .6s ease; }
        .am .am-banni-taken .am-leaf { fill: #E9B949; }
        .am .am-banni-taken { animation: am-give 1.4s cubic-bezier(.3,.6,.3,1) both; transform-origin: 50% 100%; }
        @keyframes am-give { 0% { transform: rotate(0) scale(1); } 40% { transform: rotate(-6deg) scale(1.04); } 100% { transform: rotate(0) scale(1); } }
        .am .am-spark { animation: am-spark 1.6s ease both; transform-box: fill-box; transform-origin: center; }
        @keyframes am-spark { 0% { opacity: 0; transform: scale(.2) rotate(0); } 40% { opacity: 1; transform: scale(1.2) rotate(45deg); } 100% { opacity: 0; transform: scale(.6) rotate(90deg); } }
        .am .am-today { animation: am-today 2.2s ease-in-out infinite; }
        @keyframes am-today { 0%, 100% { box-shadow: 0 0 0 3px #FFF7E8, 0 0 0 5px #A87A22; } 50% { box-shadow: 0 0 0 3px #FFF7E8, 0 0 0 9px rgba(168,122,34,.35); } }
        @media (prefers-reduced-motion: reduce) {
          .am .am-star, .am .am-petal, .am .am-screen, .am .am-shrine, .am .am-doll, .am .am-hint, .am .am-today, .am .am-rise { animation: none; }
          .am:not(.ph-dark) .am-w { animation: none; opacity: 1; }
          .am .am-el { transform: none; }
          .am.ph-open .am-trunk { animation: none; }
        }
      `}</style>

      {music && <audio ref={audio} src={music} loop preload="none" />}
      {music && phase === 'open' && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-3 z-40 flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] backdrop-blur`}
          style={{ color: P.cream, background: 'rgba(11,7,48,0.6)', border: `1px solid ${P.creamRule}` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            {playing ? <path strokeLinecap="round" d="M9 6v12M15 6v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
          </svg>
          {playing ? 'Pause' : 'Music'}
        </button>
      )}

      {/* ── Dusk in Mysuru ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ ...sky, height: isPreview ? PREVIEW_H : '100svh', minHeight: isPreview ? undefined : 600, containerType: 'size' }}>
        <div className="am-skywarm pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 55% at 50% 78%, rgba(255,170,70,0.35), rgba(255,170,70,0) 70%)' }} />
        <Stars count={46} seed={7} />
        {lit && <Petals count={26} seed={19} />}

        {/* the palace and the elephant; the crowd runs the full width in front */}
        {/* On short screens the scene shrinks so the words above keep their room. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto" style={{ width: 'min(100%, 40rem, max(17rem, calc((100cqh - 420px) * 1.66)))' }}>
          <div className="relative">
            <Palace uid={uid} />
            <div className="am-el absolute bottom-[11%] left-[1%] w-[42%]">
              <Elephant uid={`${uid}e`} />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-px flex justify-center overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[min(100%,40rem)] shrink-0">
              <Crowd />
            </div>
          ))}
        </div>

        {/* before: the waiting */}
        {phase === 'dark' && (
          <div className="am-intro absolute inset-x-0 top-0 mx-auto flex w-[min(100%,30rem)] flex-col items-center px-6 pt-[16cqi] text-center" style={{ containerType: 'inline-size' }}>
            {dear && <Caps color={P.gold} className="mb-5">For {dear}</Caps>}
            <p style={{ fontFamily: display, fontSize: 'clamp(28px, 9cqi, 40px)', lineHeight: 1.15, color: P.cream, textWrap: 'balance' }}>
              Every Dasara evening at seven, the palace lights up.
            </p>
            <p className="mt-4" style={{ fontFamily: hand, fontSize: 'clamp(17px, 5.2cqi, 21px)', color: P.creamSoft, textWrap: 'balance' }}>
              {hosts ? `${hosts} have saved you a place.` : 'We have saved you a place.'}
            </p>
            <button
              type="button"
              onClick={light}
              aria-label="Light the palace and open the invitation"
              className="am-hint am-btn mt-9 inline-flex min-h-[54px] items-center gap-3 rounded-full px-7 text-[16px] font-semibold"
              style={{ fontFamily: sans, background: 'linear-gradient(180deg, #FFE08A, #E9A93A)', color: P.maroonDeep }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
              </svg>
              Light the palace
            </button>
          </div>
        )}

        {/* after: the invitation, as the elephant arrives */}
        {inside && (
          <div className="absolute inset-x-0 top-0 mx-auto w-[min(100%,30rem)] px-6 pt-[10cqi] text-center" style={{ containerType: 'inline-size' }}>
            {greeting && (
              <p className="am-rise" style={{ fontFamily: kannada, fontWeight: 700, fontSize: 'clamp(17px, 5.4cqi, 23px)', color: P.goldLight, animationDelay: '0ms' }}>{greeting}</p>
            )}
            <div className="am-rise mt-3" style={{ animationDelay: '120ms' }}>
              <Caps color={P.creamSoft} size={11.5}>{guest ? `${guest} — ` : ''}{hosts ? `${hosts} invite you to` : 'You are invited to'}</Caps>
            </div>
            <h1 className="am-rise mt-3" style={{ ...goldText({ fontFamily: display, fontWeight: 400, fontSize: `clamp(34px, ${titleCqi.toFixed(1)}cqi, 76px)`, lineHeight: 1.02, textWrap: 'balance', filter: 'drop-shadow(0 2px 12px rgba(255,170,60,0.35))' }), animationDelay: '220ms' }}>
              {title}
            </h1>
            {main && (
              <p className="am-rise mt-4" style={{ fontFamily: display, fontSize: 'clamp(19px, 6cqi, 26px)', color: P.cream, animationDelay: '380ms' }}>
                {main.weekday} {main.day} {main.month}
                {time && <span style={{ color: P.creamSoft }}> · {time}</span>}
              </p>
            )}
            {venue && <p className="am-rise mt-1" style={{ fontFamily: hand, fontSize: 'clamp(16px, 5cqi, 20px)', color: P.creamSoft, animationDelay: '460ms' }}>{venue}</p>}
            <div className="am-rise mt-6 flex justify-center gap-2.5" style={{ animationDelay: '600ms' }}>
              {days.length > 0 && (
                <a href={`#${ids.days}`} className="am-btn inline-flex min-h-[44px] items-center rounded-full px-5 text-[14px] font-semibold" style={{ border: `1px solid ${P.creamRule}`, color: P.cream, background: 'rgba(11,7,48,0.35)' }}>
                  The days
                </a>
              )}
              {hasRsvp && (
                <a href={`#${ids.rsvp}`} className="am-btn inline-flex min-h-[44px] items-center rounded-full px-5 text-[14px] font-semibold" style={{ background: 'linear-gradient(180deg, #FFE08A, #E9A93A)', color: P.maroonDeep }}>
                  We’ll come
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {inside && (
        <>
          {/* ── A letter from the family ─────────────────────────────── */}
          {(note.length > 0 || familyPhoto) && (
            <section className="relative pb-16" style={{ backgroundColor: P.ivory, backgroundImage: KOLAM_DOTS, backgroundSize: '18px 18px', color: P.ink }}>
              <Toran uid={`${uid}t1`} />
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,28rem)] px-6 pt-8" style={{ containerType: 'inline-size' }}>
                {familyPhoto && (
                  <div className="mx-auto mb-8 w-[66%]">
                    <div className="overflow-hidden rounded-t-full border-[5px]" style={{ borderColor: P.gold, boxShadow: '0 18px 40px -20px rgba(107,14,36,0.6)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={familyPhoto} alt={hosts || 'The family'} className="aspect-[4/5] w-full object-cover" />
                    </div>
                  </div>
                )}
                {note.length > 0 && (
                  <div style={{ fontFamily: hand, fontSize: 'clamp(18px, 5.4cqi, 21px)', lineHeight: 1.6, color: P.soft }}>
                    <p style={{ color: P.maroon }}>{guest ? `Dear ${guest},` : 'Dear all,'}</p>
                    {note.map((line, i) => (
                      <p key={i} className="mt-3">{line}</p>
                    ))}
                    {hosts && <p className="mt-5 text-right" style={{ color: P.maroon }}>— {hosts}</p>}
                  </div>
                )}
              </Reveal>
            </section>
          )}

          {/* ── Counting the days ────────────────────────────────────── */}
          {countdown && (
            <section className="px-5 py-12 text-center" style={{ background: `linear-gradient(180deg, ${P.kumkum}, #9E0C24)`, color: P.cream }}>
              <Caps color={P.goldLight}>Until {mainName}</Caps>
              <div className="mx-auto mt-5 grid w-[min(100%,24rem)] grid-cols-4 gap-2">
                {([['days', countdown.days], ['hours', countdown.hours], ['mins', countdown.minutes], ['secs', countdown.seconds]] as const).map(([k, v]) => (
                  <div key={k} className="rounded-2xl py-3" style={{ background: 'rgba(74,8,24,0.45)', border: '1px solid rgba(255,224,138,0.3)' }}>
                    <p style={{ ...goldText({ fontFamily: display, fontSize: 34, lineHeight: 1 }) }}>{v}</p>
                    <p className="mt-1 uppercase" style={{ fontSize: 10.5, letterSpacing: '0.2em', color: P.creamSoft }}>{k}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── The days ─────────────────────────────────────────────── */}
          {days.length > 0 && (
            <section id={ids.days} className="px-5 pb-16 pt-14" style={{ background: P.paper, color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview}>
                <Heading kicker="Navaratri to Dasara">The days</Heading>
                <p className="mt-2 text-center" style={{ fontFamily: hand, fontSize: 18, color: P.soft }}>Come to one, come to all.</p>
              </Reveal>
              <div className="mx-auto mt-9 grid w-[min(100%,28rem)] gap-4">
                {days.map((d, i) => {
                  const bg = colourOf(d.date) ?? [P.maroon, P.peacock, P.silk][i % 3]
                  const fg = onColour(bg)
                  const dp = dateParts(d.date)
                  const cal = calendarHref(`${d.name}${hosts ? ` — ${hosts}` : ''}`, d.date, d.time || data.time, where || undefined, 3)
                  return (
                    <Reveal key={i} disabled={isPreview} delay={i * 70}>
                      <article className="relative overflow-hidden rounded-[22px] p-5" style={{ background: bg, color: fg, boxShadow: '0 16px 34px -22px rgba(42,22,16,0.7)', border: bg === '#FFFFFF' ? `1px solid ${P.rule}` : 'none' }}>
                        <div className="absolute inset-x-0 bottom-0 h-[7px]" style={{ background: ZARI, opacity: 0.9 }} />
                        <div className="flex items-start gap-4">
                          {dp && (
                            <div className="shrink-0 text-center" style={{ minWidth: 54 }}>
                              <p style={{ fontFamily: display, fontSize: 40, lineHeight: 0.95 }}>{dp.day}</p>
                              <p className="mt-1 uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.8 }}>{dp.monthShort}</p>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 style={{ fontFamily: display, fontSize: 23, lineHeight: 1.1 }}>{d.name}</h3>
                            <p className="mt-1 text-[14px]" style={{ opacity: 0.85 }}>{[dp?.weekday, timeLabel(d.time)].filter(Boolean).join(' · ')}</p>
                            {d.note && <p className="mt-2.5 text-[15px] leading-6" style={{ opacity: 0.92 }}>{d.note}</p>}
                            {cal && (
                              <a href={isPreview ? undefined : cal} target="_blank" rel="noopener noreferrer" aria-disabled={isPreview || undefined} className="am-btn mt-3.5 inline-flex min-h-[38px] items-center rounded-full px-4 text-[13px] font-semibold" style={{ border: `1px solid ${fg === P.ink ? 'rgba(42,22,16,0.25)' : 'rgba(255,248,236,0.4)'}` }}>
                                Add to calendar
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Colours of the nine nights ───────────────────────────── */}
          {colours.length > 0 && (
            <section className="px-5 py-16" style={{ background: '#FFFFFF', color: P.ink, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview}>
                <Heading kicker="Navaratri">Colour of the day</Heading>
                <p className="mx-auto mt-3 max-w-[22rem] text-center text-[15px] leading-6" style={{ color: P.soft }}>
                  {data.dressCode?.trim() || 'Wear the colour of the day when you visit — the dolls notice.'}
                </p>
              </Reveal>
              <div className="mx-auto mt-8 grid w-[min(100%,26rem)] grid-cols-3 gap-2.5">
                {colours.map((c) => {
                  const isToday = c.date === today
                  const fg = onColour(c.hex)
                  return (
                    <div key={c.day} className={`relative rounded-2xl px-2 pb-3 pt-4 text-center ${isToday ? 'am-today' : ''}`} style={{ background: c.hex, color: fg, border: c.hex === '#ffffff' || c.hex === '#FFFFFF' ? `1px solid ${P.rule}` : 'none' }}>
                      {isToday && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ background: P.maroon, color: P.cream }}>Today</span>
                      )}
                      <p className="uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', opacity: 0.8 }}>Day {c.day}</p>
                      <p className="mt-1" style={{ fontFamily: display, fontSize: 18, lineHeight: 1.1 }}>{c.name}</p>
                      <p className="mt-1 text-[12px]" style={{ opacity: 0.85 }}>{shortDay(c.date)}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Bombe Habba ──────────────────────────────────────────── */}
          {story.length > 0 && (
            <section className="relative overflow-hidden px-5 pb-16 pt-14" style={{ background: `radial-gradient(110% 60% at 50% 0%, #C21D66, ${P.silk} 45%, #7E0E40)`, color: P.cream, containerType: 'inline-size' }}>
              <Reveal disabled={isPreview}>
                <Heading kicker="Bombe Habba" color={P.cream} kickerColor={P.goldLight}>The dolls are up</Heading>
              </Reveal>
              <Reveal disabled={isPreview} className="mx-auto mt-8 w-[min(100%,26rem)]">
                <BombeSteps />
                <p className="mt-2 text-center text-[12px] uppercase tracking-[0.2em]" style={{ color: P.creamFaint }}>Tap a doll</p>
              </Reveal>
              <Reveal disabled={isPreview} className="mx-auto mt-8 w-[min(100%,26rem)]" style={{ fontFamily: hand, fontSize: 'clamp(18px, 5.2cqi, 20px)', lineHeight: 1.6, color: P.creamSoft }}>
                {story.map((line, i) => (
                  <p key={i} className={i ? 'mt-3' : ''}>{line}</p>
                ))}
              </Reveal>
              {photos.length > 0 && (
                <div className="mx-auto mt-10 grid w-[min(100%,26rem)] grid-cols-2 gap-3">
                  {photos.map((src, i) => (
                    <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={i === 0 && photos.length % 2 === 1 ? 'col-span-2' : ''}>
                      <div className="overflow-hidden rounded-t-full border-[4px]" style={{ borderColor: P.gold }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className={`${i === 0 && photos.length % 2 === 1 ? 'aspect-[4/3]' : 'aspect-[3/4]'} w-full object-cover`} />
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* photos, when there is no Bombe story to hang them on */}
          {story.length === 0 && photos.length > 0 && (
            <section className="px-5 py-16" style={{ background: P.ivory, color: P.ink }}>
              <Heading kicker="Last Dasara">Moments</Heading>
              <div className="mx-auto mt-8 grid w-[min(100%,26rem)] grid-cols-2 gap-3">
                {photos.map((src, i) => (
                  <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={i === 0 && photos.length % 2 === 1 ? 'col-span-2' : ''}>
                    <div className="overflow-hidden rounded-t-full border-[4px]" style={{ borderColor: P.gold }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className={`${i === 0 && photos.length % 2 === 1 ? 'aspect-[4/3]' : 'aspect-[3/4]'} w-full object-cover`} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* ── Where ────────────────────────────────────────────────── */}
          {where && (
            <section className="relative px-5 pb-16" style={{ backgroundColor: P.ivory, backgroundImage: KOLAM_DOTS, backgroundSize: '18px 18px', color: P.ink, containerType: 'inline-size' }}>
              <Toran uid={`${uid}t2`} />
              <Reveal disabled={isPreview} className="mx-auto mt-6 w-[min(100%,27rem)] overflow-hidden rounded-[26px] bg-white text-center" style={{ boxShadow: '0 22px 48px -30px rgba(107,14,36,0.55)', border: `1px solid ${P.rule}` }}>
                <div className="h-[10px]" style={{ background: ZARI }} />
                <div className="px-6 pb-8 pt-8">
                  <Caps>Where</Caps>
                  <p className="mt-3" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)', lineHeight: 1.1, color: P.maroon }}>{venue || address}</p>
                  {venue && address && <p className="mt-2 text-[15px] leading-6" style={{ color: P.soft }}>{address}</p>}
                  {main && (
                    <p className="mt-4 text-[15px]" style={{ color: P.ink }}>
                      {main.long}
                      {time && ` · ${time}`}
                    </p>
                  )}
                  {data.dressCode?.trim() && colours.length === 0 && <p className="mt-3 text-[15px]" style={{ fontFamily: hand, color: P.soft }}>Wear: {data.dressCode.trim()}</p>}
                  <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                    <Btn href={mapsHref(data.mapsUrl, venue, address)} isPreview={isPreview} tone="gold">Directions</Btn>
                    <Btn href={calendarHref(`${title}${hosts ? ` — ${hosts}` : ''}`, data.date, data.time, where, 4)} isPreview={isPreview}>Add to calendar</Btn>
                  </div>
                </div>
              </Reveal>
            </section>
          )}

          <DasaraRsvp anchor={ids.rsvp} days={days} hosts={hosts} phone={data.rsvpPhone} email={data.rsvpEmail} guest={guest} isPreview={isPreview} />

          {/* ── Banni ────────────────────────────────────────────────── */}
          {banni && <BanniMoment wish={banni} hosts={hosts} isPreview={isPreview} />}

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Dasara wishes"
              intro={`Leave a few words for ${hosts || 'the family'} — everyone who opens this invitation can read them.`}
              noun="wish"
              previewWishes={SAMPLE_WISHES}
              namePlaceholder="e.g. Shalini & family"
            />
          )}

          {/* ── Foot ─────────────────────────────────────────────────── */}
          <footer className="relative overflow-hidden px-6 pb-10 pt-14 text-center" style={{ background: P.night }}>
            <div className="mx-auto w-[min(70%,15rem)]">
              <Elephant uid={`${uid}f`} />
            </div>
            {hosts && <p className="mt-4" style={{ ...goldText({ fontFamily: display, fontSize: 30, lineHeight: 1.1 }) }}>{hosts}</p>}
            <p className="mt-2" style={{ fontFamily: kannada, fontSize: 15, color: P.creamFaint }}>{greeting || 'Happy Dasara'}</p>
            <div className="mt-9">
              <Credit isPreview={isPreview} color={P.creamFaint} linkColor={P.cream} />
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

function BanniMoment({ wish, hosts, isPreview }: { wish: string; hosts: string; isPreview: boolean }) {
  const [taken, setTaken] = useState(false)
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-14 text-center" style={{ background: `radial-gradient(90% 60% at 50% 30%, #2A1660, ${P.night} 70%)`, color: P.cream, containerType: 'inline-size' }}>
      <Reveal disabled={isPreview}>
        <Heading kicker="Vijayadashami" color={P.cream} kickerColor={P.gold}>A little gold for you</Heading>
        <p className="mx-auto mt-3 max-w-[21rem] text-[15px] leading-6" style={{ color: P.creamSoft }}>
          On Vijayadashami we give banni — leaves of the shami tree — to the people we love, as gold.
        </p>
      </Reveal>
      <div className="mx-auto mt-6 w-[min(56%,14rem)]">
        <Banni taken={taken} />
      </div>
      {!taken ? (
        <button
          type="button"
          onClick={() => setTaken(true)}
          className="am-btn am-hint mt-4 inline-flex min-h-[50px] items-center rounded-full px-7 text-[15px] font-semibold"
          style={{ fontFamily: sans, background: 'linear-gradient(180deg, #FFE08A, #E9A93A)', color: P.maroonDeep }}
        >
          Take the banni
        </button>
      ) : (
        <div className="am-pop mx-auto mt-4 max-w-[23rem]">
          <p style={{ ...goldText({ fontFamily: display, fontSize: 'clamp(24px, 7.6cqi, 32px)', lineHeight: 1.2 }) }}>{wish}</p>
          {hosts && <p className="mt-3" style={{ fontFamily: hand, fontSize: 18, color: P.creamSoft }}>— {hosts}</p>}
        </div>
      )}
    </section>
  )
}
