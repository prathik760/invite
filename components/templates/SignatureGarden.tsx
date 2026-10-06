'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { gilda } from './kit/fonts/gilda'
import { jost } from './kit/fonts/jost'
import { italianno } from './kit/fonts/italianno'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  parseRows,
  telHref,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
  fitCqi,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Garden Vows — Signature. A postcard from the destination.
 * It lies face down on a linen table cloth beside a spray of eucalyptus: airmail
 * edge, a painted peony stamp, a postmark with the wedding date. A tap turns
 * it over ("Greetings from Lake Como"), and the invitation unfolds from its
 * lower edge. Inside, the weekend reads as an itinerary, day by day, with the
 * travel notes a flying guest needs. Every flower is painted in code: soft
 * translucent petals glazed over each other, a seeded wobble in every leaf.
 */

const G = {
  linen: '#ECE6DA',
  paper: '#FBF8F1',
  card: '#FFFDF8',
  ink: '#2E3531',
  soft: 'rgba(46,53,49,0.76)',
  faint: 'rgba(46,53,49,0.56)',
  rule: 'rgba(46,53,49,0.16)',
  sage: '#8C9C80',
  sageDeep: '#56684F',
  sageWash: '#E5E9DD',
  blush: '#E9BDB2',
  blushWash: '#F5E4DD',
  terra: '#B25E3E',
  terraSoft: 'rgba(178,94,62,0.78)',
  postInk: '#3A4856',
}

const display = gilda.style.fontFamily
const text = jost.style.fontFamily
const script = italianno.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: G.paper,
  surface: G.card,
  ink: G.ink,
  muted: G.soft,
  line: 'rgba(46,53,49,0.14)',
  accent: G.sageDeep,
  onAccent: '#FFFDF8',
  heading: display,
  body: text,
  headingStyle: { fontSize: 34 },
}

/* ── Paint ───────────────────────────────────────────────────────────── */

type Pt = [number, number]
const f = (n: number) => String(Math.round(n * 100) / 100)

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** An irregular closed wash: a circle whose edge wanders, smoothed through midpoints. */
function blob(cx: number, cy: number, r: number, seed: number, wobble = 0.14, n = 11) {
  const rand = rng(seed)
  const pts: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rad = r * (1 + (rand() - 0.5) * wobble * 2)
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a) * 0.92])
  }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const p = (q: Pt) => `${f(q[0])} ${f(q[1])}`
  let d = `M${p(mid(pts[0], pts[1]))}`
  for (let i = 1; i <= n; i++) d += ` Q${p(pts[i % n])} ${p(mid(pts[i % n], pts[(i + 1) % n]))}`
  return `${d}Z`
}

/** A ruffled petal pointing up from the origin, with a soft notch at its lip. */
function petal(L: number, w: number, r: () => number) {
  const l1 = L * (0.88 + r() * 0.12)
  const l2 = L * (0.88 + r() * 0.12)
  const notch = L * (0.8 + r() * 0.1)
  const a = w * (0.95 + r() * 0.2)
  const b = w * (0.95 + r() * 0.2)
  return (
    `M0 0 C${f(-a)} ${f(-L * 0.22)} ${f(-a * 1.18)} ${f(-L * 0.78)} ${f(-a * 0.52)} ${f(-l1)}` +
    ` Q${f(-w * 0.2)} ${f(-L * 1.05)} 0 ${f(-notch)} Q${f(w * 0.2)} ${f(-L * 1.05)} ${f(b * 0.52)} ${f(-l2)}` +
    ` C${f(b * 1.18)} ${f(-L * 0.78)} ${f(b)} ${f(-L * 0.22)} 0 0Z`
  )
}

/** A lens leaf along +x. */
function leaf(len: number, w: number, bend: number) {
  const h = w / 2
  return `M0 0 C${f(len * 0.3)} ${f(-h * 1.2 + bend)} ${f(len * 0.72)} ${f(-h + bend)} ${f(len)} ${f(bend * 0.6)} C${f(len * 0.7)} ${f(h + bend * 0.4)} ${f(len * 0.28)} ${f(h * 1.1)} 0 0Z`
}

const PEONY = ['#F7DDD4', '#F0C4B8', '#E5A698', '#D2867B']
const ROSE = ['#F6D8C6', '#EFBDA4', '#E09E80', '#C98063']

function Peony({ x, y, s, seed, rot = 0, tones = PEONY }: { x: number; y: number; s: number; seed: number; rot?: number; tones?: string[] }) {
  const r = rng(seed)
  const rings = [
    { n: 7, L: 1, w: 0.46, t: 0, o: 0.62 },
    { n: 6, L: 0.8, w: 0.42, t: 1, o: 0.55 },
    { n: 6, L: 0.6, w: 0.34, t: 1, o: 0.6 },
    { n: 5, L: 0.4, w: 0.28, t: 2, o: 0.66 },
  ]
  const petals: ReactNode[] = []
  rings.forEach((ring, ri) => {
    const off = r() * 360
    for (let i = 0; i < ring.n; i++) {
      const ang = off + (i * 360) / ring.n + (r() - 0.5) * 18
      const L = s * ring.L * (0.86 + r() * 0.22)
      petals.push(
        <path
          key={`${ri}-${i}`}
          d={petal(L, s * ring.w, r)}
          transform={`rotate(${f(ang)})`}
          fill={tones[ring.t]}
          fillOpacity={ring.o}
          stroke={tones[3]}
          strokeOpacity={0.26}
          strokeWidth={0.6}
        />,
      )
    }
  })
  const dots: ReactNode[] = []
  for (let i = 0; i < 7; i++) {
    const a = r() * Math.PI * 2
    const d = s * (0.05 + r() * 0.12)
    dots.push(<circle key={i} cx={f(d * Math.cos(a))} cy={f(d * Math.sin(a))} r={f(s * 0.035)} fill="#D6A350" opacity={0.8} />)
  }
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${rot})`}>
      <path d={blob(s * 0.06, s * 0.05, s * 1.04, seed + 3, 0.12)} fill={tones[0]} opacity={0.5} />
      {petals}
      <path d={`M${f(-s * 0.18)} ${f(s * 0.02)} C${f(-s * 0.1)} ${f(-s * 0.14)} ${f(s * 0.12)} ${f(-s * 0.14)} ${f(s * 0.18)} ${f(0)}`} fill="none" stroke={tones[3]} strokeOpacity={0.55} strokeWidth={0.9} />
      {dots}
    </g>
  )
}

function Rose({ x, y, s, seed, rot = 0, tones = ROSE }: { x: number; y: number; s: number; seed: number; rot?: number; tones?: string[] }) {
  const r = rng(seed)
  const petals: ReactNode[] = []
  ;[
    { n: 5, L: 1, w: 0.62, t: 0, o: 0.66 },
    { n: 5, L: 0.72, w: 0.56, t: 1, o: 0.58 },
  ].forEach((ring, ri) => {
    const off = r() * 360
    for (let i = 0; i < ring.n; i++) {
      const ang = off + (i * 360) / ring.n + (r() - 0.5) * 14
      petals.push(<path key={`${ri}-${i}`} d={petal(s * ring.L * (0.9 + r() * 0.16), s * ring.w, r)} transform={`rotate(${f(ang)})`} fill={tones[ring.t]} fillOpacity={ring.o} stroke={tones[3]} strokeOpacity={0.24} strokeWidth={0.6} />)
    }
  })
  const arcs: ReactNode[] = []
  for (let k = 0; k < 4; k++) {
    const rr = s * (0.36 - k * 0.075)
    const a0 = (k * 105 + r() * 30) * (Math.PI / 180)
    const a1 = a0 + (220 * Math.PI) / 180
    arcs.push(
      <path
        key={k}
        d={`M${f(rr * Math.cos(a0))} ${f(rr * Math.sin(a0))} A${f(rr)} ${f(rr * 0.9)} 0 1 1 ${f(rr * Math.cos(a1))} ${f(rr * Math.sin(a1))}`}
        fill="none"
        stroke={tones[3]}
        strokeOpacity={0.62}
        strokeWidth={Math.max(0.7, s * 0.04)}
        strokeLinecap="round"
      />,
    )
  }
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${rot})`}>
      <path d={blob(0, 0, s * 1.02, seed + 5, 0.14)} fill={tones[0]} opacity={0.45} />
      {petals}
      <circle r={s * 0.38} fill={tones[2]} opacity={0.5} />
      {arcs}
    </g>
  )
}

function Bud({ x, y, s, rot = 0, tone = PEONY[2] }: { x: number; y: number; s: number; rot?: number; tone?: string }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${rot})`}>
      <path d={`M0 ${f(s)} C${f(-s * 0.7)} ${f(s * 0.4)} ${f(-s * 0.5)} ${f(-s * 0.6)} 0 ${f(-s)} C${f(s * 0.5)} ${f(-s * 0.6)} ${f(s * 0.7)} ${f(s * 0.4)} 0 ${f(s)}Z`} fill={tone} fillOpacity={0.62} />
      <path d={`M0 ${f(s)} C${f(-s * 0.9)} ${f(s * 0.6)} ${f(-s * 0.7)} ${f(-s * 0.1)} ${f(-s * 0.2)} ${f(-s * 0.3)} M0 ${f(s)} C${f(s * 0.9)} ${f(s * 0.6)} ${f(s * 0.7)} ${f(-s * 0.1)} ${f(s * 0.2)} ${f(-s * 0.3)}`} fill="#9CAE93" fillOpacity={0.55} />
      <path d={`M0 ${f(s)} L0 ${f(s * 1.9)}`} stroke="#6E8566" strokeWidth={0.9} strokeOpacity={0.7} />
    </g>
  )
}

type StemKind = 'euc' | 'olive'

function Stem({ x, y, len, angle, bend = 0.12, seed, kind, leaves = 8 }: { x: number; y: number; len: number; angle: number; bend?: number; seed: number; kind: StemKind; leaves?: number }) {
  const r = rng(seed)
  const a = (angle * Math.PI) / 180
  const P0: Pt = [x, y]
  const P2: Pt = [x + len * Math.cos(a), y + len * Math.sin(a)]
  const nx = -Math.sin(a)
  const ny = Math.cos(a)
  const P1: Pt = [(P0[0] + P2[0]) / 2 + nx * len * bend, (P0[1] + P2[1]) / 2 + ny * len * bend]
  const at = (t: number): [number, number, number] => {
    const u = 1 - t
    const px = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0]
    const py = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]
    const dx = 2 * u * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])
    const dy = 2 * u * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])
    return [px, py, Math.atan2(dy, dx)]
  }
  const stemColor = kind === 'euc' ? '#6F887B' : '#66744F'
  const out: ReactNode[] = []
  for (let i = 0; i < leaves; i++) {
    const t = 0.1 + (i / Math.max(1, leaves - 1)) * 0.86
    const [px, py, tan] = at(t)
    const size = 1 - t * 0.42
    if (kind === 'euc') {
      for (const side of [-1, 1]) {
        const rad = len * 0.075 * size * (0.9 + r() * 0.25)
        const cx = px + Math.cos(tan + (side * Math.PI) / 2) * rad * 0.82
        const cy = py + Math.sin(tan + (side * Math.PI) / 2) * rad * 0.82
        out.push(
          <ellipse
            key={`${i}${side}`}
            cx={f(cx)}
            cy={f(cy)}
            rx={f(rad)}
            ry={f(rad * (0.8 + r() * 0.12))}
            transform={`rotate(${f((tan * 180) / Math.PI + r() * 30)} ${f(cx)} ${f(cy)})`}
            fill={r() > 0.4 ? '#A9BBB0' : '#98AEA2'}
            fillOpacity={0.64}
            stroke="#6F887B"
            strokeOpacity={0.32}
            strokeWidth={0.6}
          />,
        )
      }
    } else {
      const side = i % 2 === 0 ? -1 : 1
      const ang = (tan * 180) / Math.PI + side * (30 + r() * 16)
      const L = len * 0.2 * size * (0.9 + r() * 0.25)
      out.push(
        <g key={i} transform={`translate(${f(px)} ${f(py)}) rotate(${f(ang)})`}>
          <path d={leaf(L, L * 0.26, side * (0.6 + r() * 1.2))} fill={i % 3 === 0 ? '#7F8F64' : '#9AA883'} fillOpacity={0.64} />
          <path d={`M1 0 L${f(L * 0.8)} ${f(side * 0.3)}`} stroke="#5E6C48" strokeOpacity={0.45} strokeWidth={0.6} />
        </g>,
      )
    }
  }
  return (
    <g>
      <path d={`M${f(P0[0])} ${f(P0[1])} Q${f(P1[0])} ${f(P1[1])} ${f(P2[0])} ${f(P2[1])}`} fill="none" stroke={stemColor} strokeWidth={1} strokeOpacity={0.75} strokeLinecap="round" />
      {out}
    </g>
  )
}

/** The corner spray used on the postcard front (drawn for the top-left corner). */
function CornerSpray({ seed = 1 }: { seed?: number }) {
  return (
    <g>
      <Stem x={6} y={64} len={150} angle={-12} bend={-0.1} seed={seed + 1} kind="euc" leaves={8} />
      <Stem x={22} y={8} len={118} angle={78} bend={0.14} seed={seed + 2} kind="olive" leaves={9} />
      <Stem x={40} y={30} len={96} angle={20} bend={0.2} seed={seed + 3} kind="olive" leaves={7} />
      <Stem x={-4} y={24} len={84} angle={44} bend={-0.12} seed={seed + 4} kind="euc" leaves={6} />
      <Peony x={36} y={34} s={31} seed={seed + 11} rot={10} />
      <Rose x={80} y={20} s={19} seed={seed + 12} />
      <Rose x={16} y={82} s={15} seed={seed + 13} rot={40} tones={PEONY} />
      <Bud x={112} y={12} s={6} rot={70} />
      <Bud x={60} y={62} s={5} rot={140} tone={ROSE[2]} />
    </g>
  )
}

/** An open wreath: olive up the left, eucalyptus up the right, flowers where they meet. */
function Wreath({ className }: { className?: string }) {
  const r = rng(107)
  const cx = 100
  const cy = 100
  const R = 72
  const out: ReactNode[] = []
  const rad = (d: number) => (d * Math.PI) / 180
  const n = 13
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const size = 1 - t * 0.35
    // left: olive, from the foot (112°) round to the crown (262°)
    const a = rad(112 + 150 * t)
    const px = cx + R * Math.cos(a)
    const py = cy + R * Math.sin(a)
    const travel = (a * 180) / Math.PI + 90
    const side = i % 2 ? 1 : -1
    const L = 20 * size * (0.9 + r() * 0.2)
    out.push(
      <g key={`o${i}`} transform={`translate(${f(px)} ${f(py)}) rotate(${f(travel + side * (30 + r() * 12))})`}>
        <path d={leaf(L, L * 0.27, side * (0.6 + r()))} fill={i % 3 === 0 ? '#7F8F64' : '#9AA883'} fillOpacity={0.66} />
        <path d={`M1 0 L${f(L * 0.8)} 0`} stroke="#5E6C48" strokeOpacity={0.45} strokeWidth={0.6} />
      </g>,
    )
    // right: eucalyptus, from the foot (68°) round to the crown (-82°)
    const b = rad(68 - 150 * t)
    const qx = cx + R * Math.cos(b)
    const qy = cy + R * Math.sin(b)
    for (const k of [-1, 1]) {
      const rr = 7.6 * size * (0.85 + r() * 0.3)
      const ox = qx + Math.cos(b) * rr * 0.8 * k
      const oy = qy + Math.sin(b) * rr * 0.8 * k
      out.push(<ellipse key={`e${i}${k}`} cx={f(ox)} cy={f(oy)} rx={f(rr)} ry={f(rr * 0.84)} transform={`rotate(${f((b * 180) / Math.PI + r() * 40)} ${f(ox)} ${f(oy)})`} fill={r() > 0.4 ? '#A9BBB0' : '#98AEA2'} fillOpacity={0.62} stroke="#6F887B" strokeOpacity={0.3} strokeWidth={0.6} />)
    }
  }
  const arc = (a0: number, a1: number, sweep: 0 | 1) =>
    `M${f(cx + R * Math.cos(rad(a0)))} ${f(cy + R * Math.sin(rad(a0)))} A${R} ${R} 0 0 ${sweep} ${f(cx + R * Math.cos(rad(a1)))} ${f(cy + R * Math.sin(rad(a1)))}`
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden style={{ overflow: 'visible' }}>
      <path d={arc(110, 262, 1)} fill="none" stroke="#66744F" strokeOpacity={0.7} strokeWidth={1} />
      <path d={arc(70, -82, 0)} fill="none" stroke="#6F887B" strokeOpacity={0.7} strokeWidth={1} />
      {out}
      <Rose x={76} y={166} s={12} seed={104} />
      <Rose x={126} y={167} s={11} seed={105} tones={PEONY} />
      <Peony x={100} y={172} s={19} seed={103} />
      <Bud x={100} y={30} s={4.5} rot={0} tone={ROSE[2]} />
    </svg>
  )
}

/* ── Postal things ───────────────────────────────────────────────────── */

function Stamp({ place, year, className, style }: { place: string; year?: number; className?: string; style?: CSSProperties }) {
  const bites: ReactNode[] = []
  for (let x = 3; x <= 61; x += 5.8) bites.push(<circle key={`t${x}`} cx={f(x)} cy={0} r={2.1} />, <circle key={`b${x}`} cx={f(x)} cy={78} r={2.1} />)
  for (let y = 4; y <= 75; y += 5.9) bites.push(<circle key={`l${y}`} cx={0} cy={f(y)} r={2.1} />, <circle key={`r${y}`} cx={64} cy={f(y)} r={2.1} />)
  return (
    <svg viewBox="0 0 64 78" className={className} style={style} aria-hidden>
      <rect width={64} height={78} fill="#FFFEFA" />
      <g fill={G.paper}>{bites}</g>
      <rect x={5.5} y={5.5} width={53} height={67} fill="#F4E2D9" />
      <path d={blob(32, 34, 20, 9, 0.2)} fill="#E6ECDD" opacity={0.9} />
      <Stem x={14} y={58} len={30} angle={-58} bend={0.2} seed={4} kind="olive" leaves={6} />
      <Peony x={33} y={31} s={13.5} seed={21} />
      <text x={32} y={67.5} textAnchor="middle" fontFamily={text} fontSize={5.4} letterSpacing={0.9} fill={G.ink} opacity={0.8}>
        {place.toUpperCase().slice(0, 18)}
      </text>
      {year && (
        <text x={9} y={14} fontFamily={display} fontSize={7.5} fill={G.terra}>
          {year}
        </text>
      )}
      <rect x={5.5} y={5.5} width={53} height={67} fill="none" stroke={G.ink} strokeOpacity={0.25} strokeWidth={0.5} />
    </svg>
  )
}

function Postmark({ ring, day, year, uid, className, style }: { ring: string; day: string; year: string; uid: string; className?: string; style?: CSSProperties }) {
  const id = `${uid}-pm`
  const waves: ReactNode[] = []
  for (let i = 0; i < 5; i++) {
    const y = 16 + i * 8
    waves.push(<path key={i} d={`M0 ${y} C6 ${y - 3} 12 ${y - 3} 18 ${y} S30 ${y + 3} 36 ${y} S48 ${y - 3} 54 ${y}`} fill="none" stroke={G.postInk} strokeWidth={1} />)
  }
  return (
    <svg viewBox="0 0 120 64" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <g opacity={0.62}>
        {waves}
        <circle cx={86} cy={32} r={28} fill="none" stroke={G.postInk} strokeWidth={1.3} />
        <circle cx={86} cy={32} r={19} fill="none" stroke={G.postInk} strokeWidth={0.9} />
        <path id={id} d="M62 32 A24 24 0 0 1 110 32" fill="none" />
        <text fontFamily={text} fontSize={6.6} letterSpacing={1.3} fill={G.postInk}>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{ring.toUpperCase().slice(0, 26)}</textPath>
        </text>
        <text x={86} y={31} textAnchor="middle" fontFamily={text} fontSize={8.4} fontWeight={500} letterSpacing={0.8} fill={G.postInk}>{day}</text>
        <text x={86} y={41} textAnchor="middle" fontFamily={text} fontSize={7.2} letterSpacing={1} fill={G.postInk}>{year}</text>
        <path d="M60 52 L112 52" stroke={G.postInk} strokeWidth={0.9} strokeDasharray="2 2.5" />
      </g>
    </svg>
  )
}

const AIRMAIL = `repeating-linear-gradient(135deg, ${G.terra} 0 9px, ${G.paper} 9px 15px, ${G.sageDeep} 15px 24px, ${G.paper} 24px 30px)`

/* ── Function motifs: an ink drawing over a slightly misregistered wash ─ */

type MotifKind = 'drinks' | 'ceremony' | 'reception' | 'brunch' | 'rings' | 'mehendi' | 'music' | 'bloom'

function motifFor(name: string): MotifKind {
  const n = name.toLowerCase()
  if (/welcome|drink|cocktail|aperitiv|apéritif|mixer|sundowner|toast/.test(n)) return 'drinks'
  if (/ceremony|vows|wedding|nikah|pheras|church|chapel|muhurtham/.test(n)) return 'ceremony'
  if (/reception|party|dinner|dance|celebration|banquet|rehearsal|supper/.test(n)) return 'reception'
  if (/brunch|breakfast|farewell|lunch|coffee|picnic/.test(n)) return 'brunch'
  if (/engagement|ring/.test(n)) return 'rings'
  if (/mehendi|mehndi|henna|haldi|pithi/.test(n)) return 'mehendi'
  if (/sangeet|music|garba|dandiya/.test(n)) return 'music'
  return 'bloom'
}

function Motif({ kind, className }: { kind: MotifKind; className?: string }) {
  const ink = { fill: 'none', stroke: G.ink, strokeOpacity: 0.82, strokeWidth: 1.15, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  let wash: ReactNode = null
  let lines: ReactNode = null
  switch (kind) {
    case 'drinks':
      wash = (
        <>
          <path d={blob(22, 27, 11, 3, 0.2)} fill="#F2D6A2" opacity={0.75} />
          <path d={blob(43, 27, 11, 5, 0.2)} fill={PEONY[1]} opacity={0.7} />
        </>
      )
      lines = (
        <>
          <g transform="rotate(-12 22 30)">
            <path d="M9 22 C10 31 16 34 22 34 C28 34 34 31 35 22 Z" {...ink} />
            <path d="M22 34 V50 M15 51 C19 49.4 25 49.4 29 51" {...ink} />
          </g>
          <g transform="rotate(12 42 30)">
            <path d="M29 22 C30 31 36 34 42 34 C48 34 54 31 55 22 Z" {...ink} />
            <path d="M42 34 V50 M35 51 C39 49.4 45 49.4 49 51" {...ink} />
          </g>
          <path d="M31 12 L32 16 M27 13.5 L29.4 16.8 M35.4 13.4 L33.8 16.8" {...ink} strokeWidth={1} />
          <circle cx={46} cy={20} r={1} fill={G.ink} />
          <circle cx={19} cy={19} r={0.9} fill={G.ink} />
        </>
      )
      break
    case 'ceremony':
      wash = (
        <>
          <path d={blob(32, 16, 17, 7, 0.24)} fill={PEONY[1]} opacity={0.6} />
          <path d={blob(14, 38, 8, 8, 0.3)} fill="#B9C6AD" opacity={0.7} />
          <path d={blob(50, 36, 8, 9, 0.3)} fill="#B9C6AD" opacity={0.7} />
        </>
      )
      lines = (
        <>
          <path d="M14 58 V28 C14 14 22 8 32 8 C42 8 50 14 50 28 V58" {...ink} />
          <path d="M19 58 V29 C19 18 25 13 32 13 C39 13 45 18 45 29 V58" {...ink} strokeWidth={0.9} />
          <path d="M8 58 H56" {...ink} />
          {[[17, 18], [24, 10.5], [32, 9], [40, 10.5], [47, 18], [13, 34], [51, 32]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.3} fill="#FFFDF8" stroke={G.ink} strokeOpacity={0.8} strokeWidth={0.9} />
          ))}
          <path d="M12 44 C9 42 9 39 11.5 37 M52 42 C55 40 55 37 52.5 35" {...ink} strokeWidth={0.9} />
        </>
      )
      break
    case 'reception':
      wash = (
        <>
          {[12, 22, 32, 42, 52].map((x, i) => (
            <path key={i} d={blob(x + 1, [26, 32, 34, 32, 26][i] + 2, 5.4, 10 + i, 0.25)} fill="#F2D190" opacity={0.75} />
          ))}
        </>
      )
      lines = (
        <>
          <path d="M3 14 C18 36 46 36 61 14" {...ink} />
          {[12, 22, 32, 42, 52].map((x, i) => {
            const y = [21, 27, 29, 27, 21][i]
            return (
              <g key={i}>
                <path d={`M${x} ${y} v3`} {...ink} strokeWidth={1} />
                <path d={`M${x} ${y + 3} c-3.2 2 -3.4 7.4 0 8.6 c3.4 -1.2 3.2 -6.6 0 -8.6Z`} {...ink} strokeWidth={1} />
              </g>
            )
          })}
          <path d="M20 52 H44 M24 52 V47 M40 52 V47 M22 47 H42" {...ink} strokeWidth={1} opacity={0.7} />
        </>
      )
      break
    case 'brunch':
      wash = (
        <>
          <path d={blob(30, 38, 14, 12, 0.18)} fill="#E7C3A6" opacity={0.75} />
          <path d={blob(30, 50, 18, 13, 0.12)} fill="#DCE3D2" opacity={0.8} />
        </>
      )
      lines = (
        <>
          <path d="M15 30 H45 C45 42 40 48 30 48 C20 48 15 42 15 30 Z" {...ink} />
          <path d="M45 33 C52 33 52 42 44 42" {...ink} />
          <path d="M9 51 C16 55 44 55 51 51" {...ink} />
          <path d="M22 24 C19 21 25 19 22 15 M30 23 C27 20 33 18 30 14 M38 24 C35 21 41 19 38 15" {...ink} strokeWidth={0.95} opacity={0.75} />
        </>
      )
      break
    case 'rings':
      wash = <path d={blob(32, 36, 16, 14, 0.2)} fill="#F2D6A2" opacity={0.7} />
      lines = (
        <>
          <circle cx={26} cy={37} r={11} {...ink} strokeWidth={1.6} />
          <circle cx={38} cy={37} r={11} {...ink} strokeWidth={1.6} />
          <path d="M22 26 L26 21 L30 26 L26 28.5 Z" {...ink} strokeWidth={1} />
        </>
      )
      break
    case 'mehendi':
      wash = (
        <>
          <path d={blob(32, 44, 16, 15, 0.16)} fill="#C9A77A" opacity={0.55} />
          <path d={blob(44, 20, 8, 16, 0.3)} fill="#EBAF62" opacity={0.7} />
        </>
      )
      lines = (
        <>
          <path d="M12 38 C14 52 50 52 52 38 Z" {...ink} />
          <path d="M11 38 H53" {...ink} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = (i / 7) * Math.PI * 2
            return <circle key={i} cx={f(44 + 5 * Math.cos(a))} cy={f(20 + 5 * Math.sin(a))} r={2.8} {...ink} strokeWidth={0.8} />
          })}
          <path d="M40 26 C36 30 30 30 26 27" {...ink} strokeWidth={0.9} />
        </>
      )
      break
    case 'music':
      wash = <path d={blob(30, 36, 16, 17, 0.2)} fill={PEONY[1]} opacity={0.65} />
      lines = (
        <>
          <path d="M24 46 V18 L46 13 V41" {...ink} strokeWidth={1.3} />
          <path d="M24 22 L46 17" {...ink} />
          <ellipse cx={19.5} cy={46.5} rx={5} ry={3.8} transform="rotate(-18 19.5 46.5)" {...ink} />
          <ellipse cx={41.5} cy={41.5} rx={5} ry={3.8} transform="rotate(-18 41.5 41.5)" {...ink} />
        </>
      )
      break
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden>
          <Stem x={10} y={56} len={40} angle={-62} bend={0.16} seed={31} kind="olive" leaves={6} />
          <Rose x={36} y={24} s={15} seed={33} tones={PEONY} />
        </svg>
      )
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g transform="translate(1.6 1.4)">{wash}</g>
      {lines}
    </svg>
  )
}

/* ── Lightbox ────────────────────────────────────────────────────────── */

function Lightbox({ photos, index, onClose, onStep }: { photos: string[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const touchX = useRef<number | null>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus?.()
    }
  }, [onClose, onStep])
  const btn = 'absolute flex h-11 w-11 items-center justify-center rounded-full'
  const btnStyle: CSSProperties = { color: G.ink, background: 'rgba(251,248,241,0.92)', border: `1px solid ${G.rule}` }
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: 'rgba(36,40,37,0.94)' }}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1)
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[index]} alt="" className="max-h-[82svh] max-w-[92vw] object-contain" style={{ border: '8px solid #FFFDF8' }} onClick={(e) => e.stopPropagation()} />
      <button ref={closeRef} type="button" aria-label="Close" className={`${btn} right-4 top-4`} style={btnStyle} onClick={onClose}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" className={`${btn} left-3 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); onStep(-1) }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next photo" className={`${btn} right-3 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); onStep(1) }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="absolute bottom-5 left-0 right-0 text-center tabular-nums" style={{ fontFamily: text, fontSize: 14, letterSpacing: '0.12em', color: 'rgba(255,253,248,0.8)' }}>
            {index + 1} / {photos.length}
          </p>
        </>
      )}
    </div>
  )
}

/* ── Small pieces ────────────────────────────────────────────────────── */

const WA_PATH =
  'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z'

type GlyphKind = 'cal' | 'map' | 'wa' | 'tel' | 'live' | 'gift'

function Glyph({ kind }: { kind: GlyphKind }) {
  if (kind === 'wa') return <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="currentColor" aria-hidden><path d={WA_PATH} /></svg>
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {kind === 'cal' && <><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>}
      {kind === 'map' && <><path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>}
      {kind === 'tel' && <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />}
      {kind === 'live' && <><rect x="3" y="6" width="13" height="12" rx="1.5" /><path d="m16 10 5-3v10l-5-3" /></>}
      {kind === 'gift' && <><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M4 13h16M12 9v11M12 9c-2.5 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2.5 3-5 3" /></>}
    </svg>
  )
}

/** Button: solid ink, or a hairline outline. */
function Btn({ href, isPreview, kind, children, solid, block }: { href: string | null; isPreview: boolean; kind: GlyphKind; children: ReactNode; solid?: boolean; block?: boolean }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className={`sg-btn inline-flex items-center justify-center gap-2 px-5 py-3 uppercase ${block ? 'w-full' : ''} ${solid ? 'hover:bg-[#434C47]' : 'hover:bg-[rgba(46,53,49,0.05)]'}`}
      style={{ fontFamily: text, fontSize: 13, fontWeight: 500, letterSpacing: '0.14em', ...(solid ? { background: G.ink, color: G.card } : { border: `1px solid rgba(46,53,49,0.45)`, color: G.ink }) }}
    >
      <Glyph kind={kind} />
      {children}
    </DirectionsLink>
  )
}

/** A quiet text link row — "ADD TO CALENDAR  ·  DIRECTIONS". */
function TextLink({ href, isPreview, kind, children }: { href: string | null; isPreview: boolean; kind: GlyphKind; children: ReactNode }) {
  return (
    <DirectionsLink href={href} isPreview={isPreview} className="sg-link inline-flex items-center gap-1.5 py-1.5 uppercase" style={{ fontFamily: text, fontSize: 12.5, fontWeight: 500, letterSpacing: '0.14em', color: G.terra }}>
      <Glyph kind={kind} />
      {children}
    </DirectionsLink>
  )
}

function Label({ children, color = G.faint }: { children: ReactNode; color?: string }) {
  return (
    <p className="uppercase" style={{ fontFamily: text, fontSize: 12, fontWeight: 500, letterSpacing: '0.26em', color }}>
      {children}
    </p>
  )
}

/** Editorial heading: set left, a painted sprig tucked after it. */
function Heading({ children, seed = 1 }: { children: ReactNode; seed?: number }) {
  return (
    <div className="flex items-end gap-3">
      <h2 className="leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(32px, 10.5cqi, 44px)', color: G.ink }}>
        {children}
      </h2>
      <svg viewBox="0 0 120 50" className="mb-1 w-[clamp(40px,15cqi,92px)] shrink-0" aria-hidden style={{ overflow: 'visible' }}>
        <Stem x={4} y={40} len={100} angle={-14} bend={-0.12} seed={seed * 7} kind={seed % 2 ? 'olive' : 'euc'} leaves={seed % 2 ? 8 : 6} />
        <Bud x={104} y={16} s={5} rot={66} tone={seed % 2 ? ROSE[2] : PEONY[2]} />
      </svg>
    </div>
  )
}

function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const key = items.map((i) => i.id).join('|')
  useEffect(() => {
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-35% 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  return (
    <nav aria-label="Sections" className="sticky top-0 z-30" style={{ background: 'rgba(251,248,241,0.97)', borderBottom: `1px solid ${G.rule}` }}>
      <div className="sg-nav overflow-x-auto">
        <ul className="mx-auto flex w-max items-center gap-x-[clamp(10px,3.6cqi,28px)] whitespace-nowrap px-3">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={go(it.id)}
                aria-current={active === it.id ? 'true' : undefined}
                className="block py-3.5 uppercase"
                style={{ fontFamily: text, fontSize: 12, fontWeight: 500, letterSpacing: 'clamp(1.2px, 0.5cqi, 2.2px)', color: active === it.id ? G.terra : G.soft, borderBottom: `1.5px solid ${active === it.id ? G.terra : 'transparent'}` }}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/* ── Data helpers ────────────────────────────────────────────────────── */

/** "Via Regina 46, Cernobbio, Lake Como, Italy" -> { place: "Lake Como", region: "Italy" }. */
function placeFrom(address?: string, venue?: string) {
  const parts = (address || '')
    .split(',')
    .map((p) => p.replace(/\b\d{4,}\b/g, '').replace(/\s{2,}/g, ' ').trim())
    .filter((p) => p && !/^\d/.test(p))
  if (parts.length >= 3) return { place: parts[parts.length - 2], region: parts[parts.length - 1] }
  if (parts.length === 2) return { place: parts[1], region: '' }
  if (parts.length === 1) return { place: parts[0], region: '' }
  return { place: venue?.trim() || '', region: '' }
}

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

type Phase = 'closed' | 'opening' | 'open'

/* ── The invitation ──────────────────────────────────────────────────── */

export default function SignatureGarden({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bride = data.brideName?.trim() || 'Maya'
  const groom = data.groomName?.trim() || 'Daniel'
  const couple = `${bride} & ${groom}`
  const date = dateParts(data.date)
  const venue = data.venue?.trim() || ''
  const guessed = placeFrom(data.venueAddress, venue)
  const place = data.destination?.trim() || guessed.place
  const region = data.destination?.trim() ? '' : guessed.region
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const fullPlace = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const weddingCal = calendarHref(`Wedding of ${couple}`, data.date, data.time, fullPlace || undefined, 6)
  const invocation = useMemo(() => parseLines(data.invocation), [data.invocation])
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const story = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const photos = useMemo(() => galleryImages(data.galleryImages, 8), [data.galleryImages])
  const isImg = (u?: string) => Boolean(u && /^(https?:)?\//.test(u))
  const cover = isImg(data.couplePhoto) ? data.couplePhoto : ''
  const portraits = [
    { src: data.bridePhoto, alt: bride },
    { src: data.groomPhoto, alt: groom },
  ].filter((p) => isImg(p.src)) as { src: string; alt: string }[]

  const functions: Fn[] = useMemo(() => {
    const rows = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'] as const).map((r) => ({
      ...r,
      date: /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? r.date : '',
      time: /^\d{1,2}:\d{2}/.test(r.time) ? r.time : '',
    }))
    if (rows.length > 1 && rows.every((r) => r.date)) {
      rows.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    }
    if (rows.length) return rows
    return [{ name: 'The wedding', date: data.date || '', time: data.time || '', venue: data.venue || '', dress: data.dressCode || '' }]
  }, [data.events, data.date, data.time, data.venue, data.dressCode])
  /** Consecutive functions on the same day form one day of the itinerary. */
  const days = useMemo(() => {
    const out: { date: string; items: Fn[] }[] = []
    for (const fn of functions) {
      const last = out[out.length - 1]
      if (last && last.date === fn.date) last.items.push(fn)
      else out.push({ date: fn.date, items: [fn] })
    }
    return out
  }, [functions])

  const reply = whatsappHref(data.whatsappNumber, `Hello! Replying to ${couple}'s wedding invitation — `)
  const rsvpBy = dateParts(data.rsvpBy)
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null
  const registry = data.registryUrl && /^https?:\/\//i.test(data.registryUrl) ? data.registryUrl : null
  const hashtag = data.hashtag?.trim() ? (data.hashtag.trim().startsWith('#') ? data.hashtag.trim() : `#${data.hashtag.trim()}`) : ''

  const hasNote = Boolean(data.message?.trim() || blessings.length)
  const hasTravel = Boolean(travel.length || venue)
  const hasKnow = Boolean(faq.length || contacts.length || registry)
  const ids = {
    weekend: `${uid}-weekend`,
    travel: `${uid}-travel`,
    story: `${uid}-story`,
    know: `${uid}-know`,
    rsvp: `${uid}-rsvp`,
  }
  const navItems = [
    { id: ids.weekend, label: 'Weekend' },
    hasTravel && { id: ids.travel, label: 'Travel' },
    story.length > 0 && { id: ids.story, label: 'Story' },
    hasKnow && { id: ids.know, label: 'FAQ' },
    { id: ids.rsvp, label: 'RSVP' },
  ].filter(Boolean) as { id: string; label: string }[]

  /* The postcard: closed (face down) → opening (turns over, lifts, unfolds) → open. */
  const [phase, setPhase] = useState<Phase>('closed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const turnOver = useCallback(() => {
    if (phase !== 'closed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('opening')
    timers.current.push(window.setTimeout(() => setPhase('open'), 2450))
  }, [phase])
  const closed = phase === 'closed'
  const open = phase === 'open'

  const [shown, setShown] = useState<number | null>(null)
  const closeBox = useCallback(() => setShown(null), [])
  const stepBox = useCallback((d: number) => setShown((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length])

  const dayMonth = date ? `${date.day} ${date.monthShort.toUpperCase()}` : 'SAVE THE'
  const postYear = date ? String(date.year) : 'DATE'
  const placeLine = [place, region].filter(Boolean).join(', ')

  return (
    <div className="sg relative" style={{ background: G.paper, color: G.ink, fontFamily: text, containerType: 'inline-size', overflowX: 'clip' }}>
      <style>{`
        .sg .sg-move { transition: transform 1.25s cubic-bezier(.5,0,.22,1) .05s; }
        .sg .sg-card { transform-style: preserve-3d; transition: transform 1.3s cubic-bezier(.45,.05,.22,1) .08s; }
        .sg .sg-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .sg .is-opening .sg-lift { animation: sg-lift 1.35s cubic-bezier(.4,0,.3,1) both; }
        @keyframes sg-lift { 0% { transform: none } 45% { transform: scale(1.07) } 100% { transform: none } }
        .sg .sg-flap { transform-origin: 50% 0; transition: transform 1.05s cubic-bezier(.2,.8,.25,1) 1.28s, opacity .01s linear 1.28s; }
        .sg .is-closed .sg-flap { transform: rotateX(-90deg); opacity: 0; }
        .sg .is-opening .sg-flap { transform: rotateX(0); opacity: 1; }
        .sg .sg-hint { transition: opacity .4s ease; }
        .sg .is-opening .sg-hint { opacity: 0; }
        .sg .sg-card-btn:focus-visible { outline: 2px solid ${G.terra}; outline-offset: 6px; }
        .sg .sg-nav { scrollbar-width: none; }
        .sg .sg-nav::-webkit-scrollbar { display: none; }
        .sg .sg-btn, .sg .sg-link { transition: background-color .2s ease, color .2s ease, opacity .2s ease; }
        .sg .sg-link:hover { opacity: .75; }
        .sg details > summary { list-style: none; cursor: pointer; }
        .sg details > summary::-webkit-details-marker { display: none; }
        .sg details .sg-plus { transition: transform .3s ease; }
        .sg details[open] .sg-plus { transform: rotate(45deg); }
        .sg .sg-snap { transition: transform .45s cubic-bezier(.2,.7,.2,1); }
        .sg .sg-snap:hover { transform: rotate(0deg) translateY(-3px) !important; }
        @media (prefers-reduced-motion: reduce) {
          .sg .sg-move, .sg .sg-card, .sg .sg-flap { transition: none; }
          .sg .is-opening .sg-lift { animation: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={G.ink} background="rgba(251,248,241,0.9)" border={G.rule} />

      {/* ── Hero: the postcard on the table ───────────────────────────── */}
      <section
        className={`relative ${closed ? 'is-closed' : ''} ${phase === 'opening' ? 'is-opening' : ''}`}
        style={{
          minHeight: isPreview ? 560 : '100svh',
          height: phase === 'open' ? undefined : isPreview ? 560 : '100svh',
          overflow: phase === 'open' ? undefined : 'hidden',
          background: G.linen,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(46,53,49,0.022) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(46,53,49,0.02) 0 1px, transparent 1px 3px)`,
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0" style={grain(0.07)} />
        {/* on the table: a eucalyptus branch and a fallen peony */}
        <svg viewBox="0 0 200 220" className="pointer-events-none absolute right-[-18px] top-[-10px] w-[clamp(150px,48cqi,230px)]" aria-hidden style={{ overflow: 'visible' }}>
          <Stem x={196} y={6} len={210} angle={128} bend={0.1} seed={61} kind="euc" leaves={10} />
          <Stem x={200} y={60} len={120} angle={150} bend={-0.16} seed={62} kind="olive" leaves={8} />
          <Bud x={70} y={170} s={6} rot={210} />
        </svg>
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute bottom-[-24px] left-[-30px] w-[clamp(150px,50cqi,240px)]" aria-hidden style={{ overflow: 'visible' }}>
          <Stem x={10} y={190} len={170} angle={-52} bend={0.14} seed={71} kind="olive" leaves={10} />
          <Stem x={0} y={150} len={130} angle={-20} bend={-0.1} seed={72} kind="euc" leaves={7} />
          <Peony x={62} y={134} s={40} seed={73} rot={20} />
          <Rose x={112} y={160} s={22} seed={74} />
        </svg>

        <div className="relative z-10 mx-auto w-[min(92cqi,420px)]" style={{ paddingTop: isPreview ? 20 : 26, paddingBottom: 44 }}>
          <div
            className="sg-move relative"
            style={{
              perspective: 1400,
              transformOrigin: '50% calc(min(92cqi, 420px) / 2.96)',
              transform: closed ? `translateY(calc(${isPreview ? '280px' : '50svh'} - 26px - min(92cqi, 420px) / 2.96 - ${isPreview ? '22px' : '4svh'})) rotate(-3deg)` : 'none',
            }}
          >
            <div className="sg-lift" style={{ perspective: 1600 }}>
              <div
                role={closed ? 'button' : undefined}
                tabIndex={closed ? 0 : undefined}
                aria-label={closed ? `A postcard from ${couple}. Turn it over to open the invitation` : undefined}
                onClick={closed ? turnOver : undefined}
                onKeyDown={closed ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turnOver() } } : undefined}
                className={`sg-card sg-card-btn relative block w-full ${closed ? 'cursor-pointer' : ''}`}
                style={{ aspectRatio: '1.48', transform: closed ? 'rotateY(180deg)' : 'none' }}
              >
                {/* the picture side */}
                <div className="sg-face absolute inset-0 overflow-hidden" style={{ background: G.card, boxShadow: '0 1px 1px rgba(46,53,49,0.08), 0 22px 34px -24px rgba(46,53,49,0.55)' }}>
                  {cover ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt={couple} className="absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)] object-cover" />
                      <span aria-hidden className="absolute inset-x-[7px] bottom-[7px] h-[55%]" style={{ background: 'linear-gradient(to top, rgba(28,32,30,0.62), rgba(28,32,30,0))' }} />
                      <svg viewBox="0 0 360 243" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden style={{ overflow: 'visible' }}>
                        <g transform="translate(360 243) rotate(180) scale(0.78)"><CornerSpray seed={40} /></g>
                      </svg>
                      <div className="absolute bottom-[7%] left-0 right-[26%] pl-[8%]">
                        <p className="leading-none" style={{ fontFamily: script, fontSize: 'clamp(30px, 10cqi, 44px)', color: '#FBEBDD' }}>Greetings from</p>
                        <p className="text-balance uppercase leading-[1.05]" style={{ fontFamily: display, fontSize: place.length > 14 ? 'clamp(20px, 6.4cqi, 30px)' : 'clamp(26px, 8.6cqi, 38px)', letterSpacing: '0.06em', color: '#FFFDF8' }}>{place || venue}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 360 243" className="absolute inset-0 h-full w-full" aria-hidden>
                        <path d={blob(0, 0, 62, 17, 0.26, 9)} transform="translate(190 118) scale(1.75 0.95) rotate(-6)" fill={G.blushWash} opacity={0.9} />
                        <path d={blob(0, 0, 40, 18, 0.3, 8)} transform="translate(128 150) scale(1.9 0.7) rotate(8)" fill={G.sageWash} opacity={0.75} />
                        <path d={blob(0, 0, 30, 19, 0.3, 8)} transform="translate(238 96) scale(1.6 0.6) rotate(-12)" fill="#F1D9CF" opacity={0.55} />
                        <rect x={7} y={7} width={346} height={229} fill="none" stroke={G.ink} strokeOpacity={0.14} strokeWidth={0.8} />
                        <CornerSpray seed={1} />
                        <g transform="translate(360 243) rotate(180)"><CornerSpray seed={20} /></g>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center">
                        <p className="leading-none" style={{ fontFamily: script, fontSize: 'clamp(32px, 10.4cqi, 46px)', color: G.terra }}>Greetings from</p>
                        <p className="mt-1 text-balance uppercase leading-[1.05]" style={{ fontFamily: display, fontSize: place.length > 14 ? 'clamp(20px, 6.2cqi, 28px)' : 'clamp(26px, 8.4cqi, 36px)', letterSpacing: '0.07em', color: G.ink }}>
                          {place || venue || 'the garden'}
                        </p>
                        <p className="mt-2.5 uppercase" style={{ fontSize: 'clamp(10.5px, 3cqi, 12.5px)', letterSpacing: '0.24em', color: G.soft }}>
                          {couple}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* the address side */}
                <div className="sg-face absolute inset-0 p-[6px]" style={{ transform: 'rotateY(180deg)', background: AIRMAIL, boxShadow: '0 1px 1px rgba(46,53,49,0.08), 0 22px 34px -24px rgba(46,53,49,0.55)' }}>
                  <div className="relative h-full w-full overflow-hidden" style={{ background: G.card, ...grain(0.05, 140) }}>
                    <span aria-hidden className="absolute bottom-[10%] top-[10%] w-px" style={{ left: '54%', background: G.rule }} />
                    <div className="absolute bottom-[9%] left-[6%] top-[9%] flex w-[44%] flex-col justify-between text-left">
                      <p className="uppercase" style={{ fontSize: 'clamp(9px, 2.7cqi, 11px)', letterSpacing: '0.34em', color: G.faint }}>Post card</p>
                      <div>
                        <p className="text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: `clamp(11px, ${fitCqi(couple, { em: 0.62, room: 36, max: 6 })}cqi, 25px)`, color: G.ink }}>{couple}</p>
                        <p className="mt-1.5 leading-[1.35]" style={{ fontSize: 'clamp(11px, 3.4cqi, 14px)', color: G.soft }}>are getting married</p>
                        <p className="leading-[1.35]" style={{ fontSize: 'clamp(11px, 3.4cqi, 14px)', color: G.soft }}>{date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}</p>
                      </div>
                      <span className="inline-block self-start border px-1.5 py-[3px] uppercase leading-[1.2]" style={{ fontSize: 'clamp(7px, 2.1cqi, 8.5px)', letterSpacing: '0.18em', color: G.terra, borderColor: G.terraSoft }}>
                        Par avion<br />By air mail
                      </span>
                    </div>
                    <Stamp place={place || venue} year={date?.year} className="absolute right-[5%] top-[8%] w-[17%]" style={{ transform: 'rotate(3deg)' }} />
                    <Postmark ring={place || venue} day={dayMonth} year={postYear} uid={uid} className="absolute right-[17%] top-[30%] w-[33%]" style={{ transform: 'rotate(-8deg)' }} />
                    <div className="absolute bottom-[11%] left-[59%] right-[6%] space-y-[6px] text-left">
                      {['For you & your family', venue, placeLine].filter(Boolean).map((l, i) => (
                        <p key={i} className="truncate border-b pb-[2px] leading-[1.25]" style={{ borderColor: G.rule, fontFamily: i === 1 ? display : text, fontSize: i === 1 ? 'clamp(12px, 3.6cqi, 15px)' : 'clamp(9.5px, 2.8cqi, 12px)', color: G.ink }}>
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {phase !== 'open' && (
              <p className="sg-hint absolute left-0 right-0 text-center uppercase" style={{ top: 'calc(min(92cqi, 420px) / 1.48 + 34px)', fontSize: 12, letterSpacing: '0.26em', color: G.soft }}>
                Tap the postcard to turn it over
              </p>
            )}

            {/* ── The invitation, unfolding from the card's lower edge ── */}
            <div className="sg-flap relative" style={{ background: G.card, boxShadow: '0 26px 40px -30px rgba(46,53,49,0.6)' }}>
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26px]" style={{ background: 'linear-gradient(to bottom, rgba(46,53,49,0.09), rgba(46,53,49,0))' }} />
              <span aria-hidden className="pointer-events-none absolute inset-[9px] border" style={{ borderColor: G.rule }} />
              <div className="relative px-[9%] pb-11 pt-10 text-center">
                {invocation.length > 0 && (
                  <div className="mb-6 space-y-1">
                    {invocation.map((l, i) => (
                      <p key={i} className="text-balance leading-[1.5]" style={{ fontFamily: display, fontSize: 17, color: G.soft }} dir={/[\u0590-\u08FF]/.test(l) ? 'rtl' : undefined}>
                        {l}
                      </p>
                    ))}
                  </div>
                )}
                <Label>Together with their families</Label>
                {/* Its own container: each name is sized by its longest word, so a long surname shrinks instead of overflowing the card. */}
                <h1 className="mt-5" style={{ fontFamily: display, fontWeight: 400, color: G.ink, containerType: 'inline-size', width: '100%' }}>
                  <span className="block text-balance leading-[1.02]" style={{ fontSize: `clamp(20px, ${fitCqi(bride, { em: 0.62, max: 20 })}cqi, 58px)` }}>{bride}</span>
                  {data.brideParents?.trim() && <span className="mt-1.5 block text-balance leading-[1.4]" style={{ fontFamily: text, fontSize: 15, color: G.soft }}>{data.brideParents}</span>}
                  <span className="my-2 block leading-none" style={{ fontSize: 'clamp(26px, 8cqi, 34px)', color: G.terra }}>&amp;</span>
                  <span className="block text-balance leading-[1.02]" style={{ fontSize: `clamp(20px, ${fitCqi(groom, { em: 0.62, max: 20 })}cqi, 58px)` }}>{groom}</span>
                  {data.groomParents?.trim() && <span className="mt-1.5 block text-balance leading-[1.4]" style={{ fontFamily: text, fontSize: 15, color: G.soft }}>{data.groomParents}</span>}
                </h1>
                <p className="mx-auto mt-6 max-w-[17rem] text-balance leading-[1.5]" style={{ fontSize: 17, fontWeight: 300, color: G.ink }}>
                  invite you to celebrate their marriage
                </p>
                <svg viewBox="0 0 160 40" className="mx-auto mt-4 w-[128px]" aria-hidden style={{ overflow: 'visible' }}>
                  <Stem x={80} y={26} len={72} angle={184} bend={0.12} seed={81} kind="olive" leaves={7} />
                  <Stem x={80} y={26} len={72} angle={-4} bend={-0.12} seed={82} kind="olive" leaves={7} />
                  <Rose x={80} y={24} s={10} seed={83} tones={PEONY} />
                </svg>
                <div className="mt-4">
                  {date ? (
                    <>
                      <Label color={G.terra}>{date.weekday}</Label>
                      <p className="mt-2 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 36px)' }}>
                        {date.day} {date.month} {date.year}
                      </p>
                    </>
                  ) : (
                    <p style={{ fontFamily: display, fontSize: 26 }}>Date to be announced</p>
                  )}
                  {data.time && <p className="mt-1.5" style={{ fontSize: 17, color: G.soft }}>{timeLabel(data.time)}</p>}
                </div>
                {venue && (
                  <div className="mt-5">
                    <p className="text-balance leading-[1.2]" style={{ fontFamily: display, fontSize: 23 }}>{venue}</p>
                    {data.venueAddress && <p className="mx-auto mt-1 max-w-[18rem] text-balance leading-[1.45]" style={{ fontSize: 15, color: G.soft }}>{data.venueAddress}</p>}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5">
                  <TextLink href={weddingCal} isPreview={isPreview} kind="cal">Add to calendar</TextLink>
                  <TextLink href={directions} isPreview={isPreview} kind="map">Directions</TextLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <>
          <SectionNav items={navItems} />

          {/* ── A note from the couple ──────────────────────────────── */}
          {(hasNote || portraits.length > 0) && (
            <Reveal disabled={isPreview} as="section" className="px-6 pb-4 pt-16">
              <div className="mx-auto max-w-[28rem] text-center">
                {portraits.length > 0 && (
                  <div className="mb-8 flex justify-center gap-4">
                    {portraits.map((p, i) => (
                      <figure key={p.alt} className="bg-white p-[6px] pb-[22px]" style={{ transform: `rotate(${i ? 2.5 : -2.5}deg)`, boxShadow: '0 12px 22px -16px rgba(46,53,49,0.55)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt={p.alt} className="block h-[138px] w-[108px] object-cover" />
                        <figcaption className="mt-1.5 text-center" style={{ fontFamily: display, fontSize: 14 }}>{p.alt}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {data.message?.trim() && (
                  <p className="mx-auto max-w-[24rem] text-balance leading-[1.45]" style={{ fontFamily: display, fontSize: 'clamp(21px, 6.2cqi, 25px)', color: G.ink }}>
                    {data.message}
                  </p>
                )}
                {blessings.length > 0 && (
                  <div className="mt-9">
                    <Label>With the blessings of</Label>
                    <ul className="mt-3 space-y-1">
                      {blessings.map((b, i) => (
                        <li key={i} className="text-balance" style={{ fontFamily: display, fontSize: 19 }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* ── Countdown, on a luggage tag ─────────────────────────── */}
          {countdown && (
            <Reveal disabled={isPreview} as="section" className="px-6 pt-14">
              <div className="relative mx-auto w-[min(84cqi,340px)]" style={{ transform: 'rotate(-2.5deg)' }}>
                <svg viewBox="0 0 100 80" className="pointer-events-none absolute left-[-52px] top-1/2 z-[1] w-[88px] -translate-y-1/2" aria-hidden style={{ overflow: 'visible' }}>
                  <path d="M98 40 C86 29 68 31 56 40 C68 49 86 51 98 40" fill="none" stroke={G.terra} strokeWidth={1.5} strokeLinejoin="round" />
                  <path d="M56 40 C40 46 26 30 -8 38" fill="none" stroke={G.terra} strokeWidth={1.5} strokeLinecap="round" />
                  <circle cx={56} cy={40} r={2.2} fill={G.terra} />
                </svg>
                <div
                  className="relative flex items-center py-6 pl-[64px] pr-6"
                  style={{ background: '#F1E4CF', clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 72%, 0 28%)', ...grain(0.06, 120) }}
                >
                  <span aria-hidden className="absolute left-[26px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 rounded-full" style={{ background: G.paper, boxShadow: `0 0 0 3px #E3D2B6, inset 0 1px 2px rgba(0,0,0,0.2)` }} />
                  <div>
                    <Label color={G.terra}>Until we say I do</Label>
                    <p className="mt-1.5 leading-none tabular-nums" style={{ fontFamily: display, fontSize: 'clamp(40px, 13cqi, 54px)' }}>
                      {countdown.days}
                      <span className="ml-2" style={{ fontSize: 22 }}>{countdown.days === 1 ? 'day' : 'days'}</span>
                    </p>
                    <p className="mt-2 tabular-nums" style={{ fontSize: 15, color: G.soft }}>
                      {countdown.hours} h · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} s
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── The weekend: an itinerary, day by day ───────────────── */}
          <section id={ids.weekend} className="px-5 pb-6 pt-16" style={{ scrollMarginTop: 52 }}>
            <div className="mx-auto max-w-[30rem]">
              <Reveal disabled={isPreview}>
                <Heading seed={1}>{functions.length > 1 ? 'The weekend' : 'The day'}</Heading>
                {data.dressCode?.trim() && (
                  <div className="mt-5 border-l-2 pl-4" style={{ borderColor: G.blush }}>
                    <Label>Dress code</Label>
                    <p className="mt-1 leading-[1.5]" style={{ fontSize: 16.5, color: G.soft }}>{data.dressCode}</p>
                  </div>
                )}
              </Reveal>
              <div className="mt-10 space-y-11">
                {days.map((day, di) => {
                  const d = dateParts(day.date)
                  return (
                    <div key={di}>
                      <Reveal disabled={isPreview} className="flex items-end gap-3 border-b pb-3" style={{ borderColor: G.rule }}>
                        {d ? (
                          <>
                            <span className="leading-[0.85] tabular-nums" style={{ fontFamily: display, fontSize: 52, color: G.terra }}>{d.day}</span>
                            <span className="pb-0.5">
                              <span className="block leading-none" style={{ fontFamily: display, fontSize: 24 }}>{d.weekday}</span>
                              <span className="mt-1.5 block uppercase" style={{ fontSize: 12.5, letterSpacing: '0.22em', color: G.faint }}>{d.month} {d.year}</span>
                            </span>
                          </>
                        ) : (
                          <span className="leading-none" style={{ fontFamily: display, fontSize: 26 }}>Date to follow</span>
                        )}
                      </Reveal>
                      <div className="mt-4 space-y-3.5">
                        {day.items.map((fn, i) => {
                          const t = timeLabel(fn.time)
                          const fnPlace = [fn.venue || data.venue, data.venueAddress].filter(Boolean).join(', ')
                          const cal = calendarHref(`${fn.name} — ${couple}`, fn.date, fn.time, fnPlace || undefined, 3)
                          const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : directions
                          return (
                            <Reveal key={`${fn.name}-${i}`} disabled={isPreview} delay={i * 60}>
                              <article className="relative py-5 pl-[clamp(78px,23cqi,96px)] pr-5" style={{ background: G.card, boxShadow: '0 1px 0 rgba(46,53,49,0.05), 0 14px 26px -22px rgba(46,53,49,0.5)' }}>
                                <Motif kind={motifFor(fn.name)} className="absolute left-[clamp(12px,3.6cqi,18px)] top-5 w-[clamp(54px,16cqi,68px)]" />
                                <p className="uppercase tabular-nums" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.16em', color: G.terra }}>
                                  {t || (d ? 'Time to follow' : 'Date & time to follow')}
                                </p>
                                <h3 className="mt-1 text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(23px, 7cqi, 27px)' }}>{fn.name}</h3>
                                {fn.venue && <p className="mt-1.5 leading-[1.4]" style={{ fontSize: 16.5, color: G.ink }}>{fn.venue}</p>}
                                {fn.dress && (
                                  <p className="mt-1 leading-[1.4]" style={{ fontSize: 15, color: G.soft }}>
                                    <span style={{ color: G.faint }}>Wear · </span>
                                    {fn.dress}
                                  </p>
                                )}
                                {(cal || dir) && (
                                  <div className="mt-2.5 flex flex-wrap gap-x-4">
                                    <TextLink href={cal} isPreview={isPreview} kind="cal">Calendar</TextLink>
                                    <TextLink href={dir} isPreview={isPreview} kind="map">Directions</TextLink>
                                  </div>
                                )}
                              </article>
                            </Reveal>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── Getting there ───────────────────────────────────────── */}
          {hasTravel && (
            <section id={ids.travel} className="mt-14 px-5 pb-16 pt-14" style={{ background: G.sageWash, scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[30rem]">
                <Reveal disabled={isPreview}>
                  <svg viewBox="0 0 320 76" className="mb-6 w-full max-w-[22rem]" aria-hidden style={{ overflow: 'visible' }}>
                    <circle cx={14} cy={62} r={4} fill="none" stroke={G.ink} strokeOpacity={0.7} strokeWidth={1.2} />
                    <path d="M18 60 C90 -4 220 -8 292 46" fill="none" stroke={G.ink} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="1 6" strokeLinecap="round" />
                    <g transform="translate(236 16) rotate(20)">
                      <path d="M-12 0 L12 0 M4 0 L-4 -9 M4 0 L-4 9 M-10 0 L-13 -4 M-10 0 L-13 4" fill="none" stroke={G.ink} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <Peony x={298} y={52} s={16} seed={91} />
                    <Stem x={286} y={66} len={34} angle={-160} bend={0.2} seed={92} kind="olive" leaves={5} />
                  </svg>
                  <Heading seed={2}>Getting there</Heading>
                </Reveal>
                {travel.length > 0 && (
                  <Reveal disabled={isPreview} className="mt-6 space-y-4">
                    {travel.map((p, i) => (
                      <p key={i} className="leading-[1.65]" style={{ fontSize: 16.5, color: G.soft }}>{p}</p>
                    ))}
                  </Reveal>
                )}
                {venue && (
                  <Reveal disabled={isPreview} className="mt-8 p-6" style={{ background: G.card }}>
                    <Label>The venue</Label>
                    <p className="mt-2 leading-[1.15]" style={{ fontFamily: display, fontSize: 26 }}>{venue}</p>
                    {data.venueAddress && <p className="mt-1 leading-[1.5]" style={{ fontSize: 15.5, color: G.soft }}>{data.venueAddress}</p>}
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Btn href={directions} isPreview={isPreview} kind="map" solid>Directions</Btn>
                      <Btn href={weddingCal} isPreview={isPreview} kind="cal">Calendar</Btn>
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── Our story: a route, each moment postmarked ──────────── */}
          {story.length > 0 && (
            <section id={ids.story} className="px-5 pb-6 pt-16" style={{ scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[30rem]">
                <Reveal disabled={isPreview}>
                  <Heading seed={3}>Our story</Heading>
                </Reveal>
                <ol className="relative mt-10">
                  <span aria-hidden className="absolute bottom-6 top-6 w-0" style={{ left: 29, borderLeft: `1.5px dashed ${G.sage}` }} />
                  {story.map((m, i) => (
                    <Reveal as="li" key={i} disabled={isPreview} delay={i * 50} className="relative flex gap-5 pb-9 last:pb-0">
                      <span className="relative z-[1] flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full" style={{ background: G.paper, border: `1.3px solid ${G.postInk}`, boxShadow: `inset 0 0 0 4px ${G.paper}, inset 0 0 0 5px rgba(58,72,86,0.55)`, transform: `rotate(${i % 2 ? 8 : -8}deg)` }}>
                        <span className="tabular-nums" style={{ fontSize: m.when.length > 5 ? 11 : 14, fontWeight: 500, letterSpacing: '0.08em', color: G.postInk }}>{m.when || '·'}</span>
                      </span>
                      <div className="pt-1.5">
                        <h3 className="text-balance leading-[1.2]" style={{ fontFamily: display, fontSize: 22 }}>{m.title}</h3>
                        {m.text && <p className="mt-1.5 leading-[1.55]" style={{ fontSize: 16.5, color: G.soft }}>{m.text}</p>}
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* ── Snapshots ───────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section className="px-5 pb-6 pt-16">
              <div className="mx-auto max-w-[32rem]">
                <Reveal disabled={isPreview}>
                  <Heading seed={4}>Snapshots</Heading>
                </Reveal>
                <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-5">
                  {photos.map((src, i) => {
                    const wide = i % 3 === 0 || (i === photos.length - 1 && i % 3 === 1)
                    const tilt = [-1.6, 2, -2.2, 1.4, -1][i % 5]
                    const inner = (
                      <span className="block bg-white p-[6px]" style={{ boxShadow: '0 14px 24px -18px rgba(46,53,49,0.6)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className={`block w-full object-cover ${wide ? 'aspect-[3/2]' : 'aspect-[4/5]'}`} />
                      </span>
                    )
                    return (
                      <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 70} className={wide ? 'col-span-2' : ''}>
                        {isPreview ? (
                          <span className="block" style={{ transform: `rotate(${tilt}deg)` }}>{inner}</span>
                        ) : (
                          <button type="button" className="sg-snap block w-full" style={{ transform: `rotate(${tilt}deg)` }} aria-label={`Open photo ${i + 1}`} onClick={() => setShown(i)}>
                            {inner}
                          </button>
                        )}
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── Good to know ────────────────────────────────────────── */}
          {hasKnow && (
            <section id={ids.know} className="px-5 pb-6 pt-16" style={{ scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[30rem]">
                <Reveal disabled={isPreview}>
                  <Heading seed={5}>Good to know</Heading>
                </Reveal>
                {faq.length > 0 && (
                  <Reveal disabled={isPreview} className="mt-8" style={{ borderTop: `1px solid ${G.rule}` }}>
                    {faq.map((q, i) => (
                      <details key={i} style={{ borderBottom: `1px solid ${G.rule}` }}>
                        <summary className="flex items-start justify-between gap-4 py-4">
                          <span className="leading-[1.3]" style={{ fontFamily: display, fontSize: 19.5 }}>{q.q}</span>
                          <svg viewBox="0 0 20 20" className="sg-plus mt-1 h-[16px] w-[16px] shrink-0" aria-hidden>
                            <path d="M10 3v14M3 10h14" stroke={G.terra} strokeWidth={1.4} strokeLinecap="round" />
                          </svg>
                        </summary>
                        {q.a && <p className="pb-5 pr-8 leading-[1.6]" style={{ fontSize: 16.5, color: G.soft }}>{q.a}</p>}
                      </details>
                    ))}
                  </Reveal>
                )}
                {contacts.length > 0 && (
                  <Reveal disabled={isPreview} className="mt-10">
                    <Label>Who to call</Label>
                    <ul className="mt-3 space-y-3">
                      {contacts.map((c, i) => {
                        const tel = telHref(c.phone)
                        const wa = whatsappHref(c.phone, `Hi! A question about ${couple}'s wedding — `)
                        return (
                          <li key={i} className="p-4" style={{ background: G.card, border: `1px solid ${G.rule}` }}>
                            <p className="leading-[1.3]" style={{ fontFamily: display, fontSize: 20 }}>{c.name}</p>
                            {c.phone && <p className="mt-0.5 tabular-nums" style={{ fontSize: 15, color: G.soft }}>{c.phone}</p>}
                            {(tel || wa) && (
                              <div className="mt-3 flex flex-wrap gap-2.5">
                                {tel && <Btn href={tel} isPreview={isPreview} kind="tel">Call</Btn>}
                                {wa && <Btn href={wa} isPreview={isPreview} kind="wa">WhatsApp</Btn>}
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </Reveal>
                )}
                {registry && (
                  <Reveal disabled={isPreview} className="mt-10">
                    <Label>Gifts</Label>
                    <p className="mt-2 leading-[1.5]" style={{ fontSize: 16.5, color: G.soft }}>For those who have asked, our registry is here.</p>
                    <div className="mt-4">
                      <Btn href={registry} isPreview={isPreview} kind="gift">Gift registry</Btn>
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── RSVP: a reply card ──────────────────────────────────── */}
          <section id={ids.rsvp} className="mt-16 px-5 py-16" style={{ background: G.blushWash, scrollMarginTop: 52 }}>
            <Reveal disabled={isPreview} className="mx-auto max-w-[26rem]">
              <div className="p-[6px]" style={{ background: AIRMAIL, boxShadow: '0 20px 34px -26px rgba(46,53,49,0.6)' }}>
                <div className="relative px-6 pb-9 pt-10 text-center" style={{ background: G.card }}>
                  <Stamp place={place || venue} year={date?.year} className="absolute right-4 top-4 w-[44px]" style={{ transform: 'rotate(4deg)' }} />
                  <Label color={G.terra}>{reply ? 'RSVP' : 'Save the date'}</Label>
                  <h2 className="mt-3 leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(32px, 10cqi, 40px)' }}>
                    {reply ? 'Kindly reply' : `${bride} & ${groom}`}
                  </h2>
                  {reply && rsvpBy && <p className="mt-2" style={{ fontSize: 16.5, color: G.soft }}>by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}</p>}
                  <p className="mt-5 leading-[1.3]" style={{ fontFamily: display, fontSize: 22 }}>
                    {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
                  </p>
                  <p className="mt-1 text-balance" style={{ fontSize: 15.5, color: G.soft }}>{[venue, placeLine && placeLine !== venue ? placeLine : ''].filter(Boolean).join(' · ')}</p>
                  <div className="mx-auto mt-7 flex max-w-[18rem] flex-col gap-2.5">
                    {reply && <Btn href={reply} isPreview={isPreview} kind="wa" solid block>Reply on WhatsApp</Btn>}
                    <Btn href={weddingCal} isPreview={isPreview} kind="cal" block>Add to calendar</Btn>
                    {live && <Btn href={live} isPreview={isPreview} kind="live" block>Watch live</Btn>}
                  </div>
                </div>
              </div>
              {hashtag && (
                <div className="mt-10 text-center">
                  <Label>Share your photos</Label>
                  <p className="relative mx-auto mt-2 inline-block break-all px-2" style={{ fontFamily: display, fontSize: 'clamp(21px, 6.6cqi, 28px)' }}>
                    <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute bottom-[-2px] left-0 h-[12px] w-full" aria-hidden>
                      <path d="M3 12 C40 5 90 15 130 8 C160 3 185 9 197 7 L197 13 C170 16 150 11 120 15 C80 20 40 12 3 17Z" fill={G.blush} opacity={0.75} />
                    </svg>
                    <span className="relative">{hashtag}</span>
                  </p>
                </div>
              )}
            </Reveal>
          </section>

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Notes for the couple"
              intro={`Leave a few words for ${bride} and ${groom} — they will appear here for every guest.`}
              noun="note"
            />
          )}

          {/* ── Foot: a painted wreath and the monogram ─────────────── */}
          <footer className="px-6 pb-10 pt-14 text-center" style={{ background: G.paper }}>
            <div className="relative mx-auto h-[150px] w-[150px]">
              <Wreath className="absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: display, fontSize: 38 }}>
                {bride.charAt(0)}
                <span className="mx-1" style={{ fontSize: 22, color: G.terra }}>&amp;</span>
                {groom.charAt(0)}
              </span>
            </div>
            {date && (
              <p className="mt-6 uppercase tabular-nums" style={{ fontSize: 12.5, letterSpacing: '0.3em', color: G.faint }}>
                {date.dayPadded} · {date.monthShort} · {date.year}
                {place ? ` · ${place}` : ''}
              </p>
            )}
            <div className="mt-8">
              <Credit isPreview={isPreview} color={G.faint} linkColor={G.soft} />
            </div>
          </footer>
        </>
      )}

      {shown !== null && photos[shown] && <Lightbox photos={photos} index={shown} onClose={closeBox} onStep={stepBox} />}
    </div>
  )
}
