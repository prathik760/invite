'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { amiri } from './kit/fonts/amiri'
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
import { ordinalWords, timeWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Nikah — Signature. An evening hall of zellige and carved screens.
 * The guest arrives at two lacquered mashrabiya panels, lit from behind; a tap
 * slides them apart on an ogee-arched window: Bismillah over a night sky, the
 * crescent in the arch's point, two brass fanoos lanterns set swinging by the
 * moving screens. Every star on the page is the same eight-point khatam, drawn
 * in code: the wall's girih, the lattice, the countdown medallion, the nav.
 */

const C = {
  wall: '#0F3B35',
  wallDeep: '#0A2B27',
  night: '#061D1A',
  nightLow: '#0D3530',
  teal: '#2B7A72',
  gold: '#B98F48',
  goldLight: '#E2C68C',
  goldHair: 'rgba(185,143,72,0.45)',
  goldFaint: 'rgba(185,143,72,0.24)',
  stone: '#EDE2C9',
  paper: '#F5EEDF',
  card: '#FCF8EE',
  ink: '#123A33',
  soft: 'rgba(18,58,51,0.78)',
  faint: 'rgba(18,58,51,0.58)',
  onDark: '#F4EBD7',
  onDarkSoft: 'rgba(244,235,215,0.8)',
  onDarkFaint: 'rgba(244,235,215,0.58)',
  brass: '#B68C47',
  brassDark: '#6C4F22',
  brassLight: '#E8CD8E',
  lacquer: '#12433A',
  lacquerDark: '#0A2824',
  tealWash: 'rgba(43,122,114,0.2)',
  goldWash: 'rgba(185,143,72,0.18)',
}

const serif = amiri.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: 'rgba(185,143,72,0.34)',
  accent: C.wall,
  onAccent: C.onDark,
  heading: serif,
  body: serif,
  headingStyle: { fontSize: 34, fontWeight: 400 },
}

/* ── Geometry ─────────────────────────────────────────────────────────── */

type Pt = [number, number]
const f = (n: number) => String(Math.round(n * 100) / 100)
const pt = (p: Pt) => `${f(p[0])} ${f(p[1])}`
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFC]/

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** The khatam: an eight-point star made of two squares, points at every 45°. */
function starPath(cx: number, cy: number, R: number, rot = 0) {
  const r = R * 0.7654
  let d = ''
  for (let k = 0; k < 16; k++) {
    const a = ((rot + k * 22.5) * Math.PI) / 180
    const rad = k % 2 === 0 ? R : r
    d += `${k ? 'L' : 'M'}${f(cx + rad * Math.cos(a))} ${f(cy + rad * Math.sin(a))}`
  }
  return `${d}Z`
}

/**
 * An ogee arch: springs straight up, bellies outward, then flicks into a
 * point at the apex. Four cubic segments from the left springing to the right.
 */
function archSegments(x: number, y: number, w: number, head: number): [Pt, Pt, Pt, Pt][] {
  const s = y + head
  const cx = x + w / 2
  const A: Pt = [x, s]
  const B: Pt = [x + w * 0.35, y + head * 0.16]
  const T: Pt = [cx, y]
  const D: Pt = [x + w * 0.65, y + head * 0.16]
  const E: Pt = [x + w, s]
  return [
    [A, [x, s - head * 0.5], [x + w * 0.14, y + head * 0.31], B],
    [B, [x + w * 0.43, y + head * 0.1], [cx - w * 0.022, y + head * 0.075], T],
    [T, [cx + w * 0.022, y + head * 0.075], [x + w * 0.57, y + head * 0.1], D],
    [D, [x + w * 0.86, y + head * 0.31], [x + w, s - head * 0.5], E],
  ]
}

function archCurve(x: number, y: number, w: number, head: number) {
  const segs = archSegments(x, y, w, head)
  return `M${pt(segs[0][0])}` + segs.map(([, c1, c2, e]) => ` C${pt(c1)} ${pt(c2)} ${pt(e)}`).join('')
}

function archShape(x: number, y: number, w: number, h: number, head: number) {
  return `M${f(x)} ${f(y + h)} L${archCurve(x, y, w, head).slice(1)} L${f(x + w)} ${f(y + h)}Z`
}

function bez([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ]
}

/** The same arch as a CSS clip-path for photographs of a given aspect (w/h). */
function archClip(aspect: number) {
  const head = Math.min(62, 50 * aspect)
  const pts: Pt[] = []
  for (const seg of archSegments(0, 0, 100, head)) for (let i = 0; i < 8; i++) pts.push(bez(seg, i / 8))
  pts.push([100, head], [100, 100], [0, 100])
  return `polygon(${pts.map(([a, b]) => `${f(a)}% ${f(b)}%`).join(', ')})`
}

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

/** Girih wall tile: star-and-cross, drawn as a gilt strap with a dark core. */
function wallTile(P: number, o: number, ground: string) {
  const c = P / 2
  const s = starPath(c, c, c)
  const dots = ([[0, 0], [P, 0], [0, P], [P, P]] as Pt[])
    .map(([x, y]) => `<circle cx='${x}' cy='${y}' r='${f(P * 0.05)}' fill='rgba(185,143,72,${o})'/>`)
    .join('')
  return svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${P}' height='${P}' viewBox='0 0 ${P} ${P}'>` +
      `<path d='${s}' fill='rgba(43,122,114,${f(o * 0.55)})' stroke='rgba(185,143,72,${o})' stroke-width='2.3'/>` +
      `<path d='${s}' fill='none' stroke='${ground}' stroke-width='0.8'/>` +
      `<path d='${starPath(c, c, P * 0.15, 22.5)}' fill='rgba(185,143,72,${f(o * 0.6)})'/>${dots}</svg>`,
  )
}

const WALL = wallTile(48, 0.5, C.wall)
const WALL_SOFT = wallTile(48, 0.26, C.wall)
const FRIEZE = wallTile(22, 0.75, C.wallDeep)
const BORDER = wallTile(15, 0.85, C.wallDeep)

/** Mashrabiya lattice: a thick lacquered strap over light, turned bosses at the nodes. */
const LATTICE = (() => {
  const Q = 40
  const c = Q / 2
  const s = starPath(c, c, c)
  const boss = (x: number, y: number, r: number) =>
    `<circle cx='${x}' cy='${y}' r='${r}' fill='${C.lacquer}' stroke='rgba(226,198,140,0.55)' stroke-width='0.6'/>`
  return svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${Q}' height='${Q}' viewBox='0 0 ${Q} ${Q}'>` +
      `<path d='${s}' transform='translate(0.9 1.4)' fill='none' stroke='#041512' stroke-opacity='0.75' stroke-width='6.6'/>` +
      `<path d='${s}' fill='none' stroke='${C.lacquer}' stroke-width='5.4'/>` +
      `<path d='${s}' fill='none' stroke='rgba(226,198,140,0.5)' stroke-width='0.7'/>` +
      `${boss(c, c, 3.6)}${boss(0, 0, 3)}${boss(Q, 0, 3)}${boss(0, Q, 3)}${boss(Q, Q, 3)}</svg>`,
  )
})()

const BACKLIGHT = 'linear-gradient(180deg, #F6E4B6 0%, #EDC77F 34%, #E2AD60 58%, #EBC784 82%, #F4DDA8 100%)'

function useSize<T extends HTMLElement>(fallback: { w: number; h: number }) {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setSize((s) => (Math.abs(s.w - w) < 0.5 && Math.abs(s.h - h) < 0.5 ? s : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

/* ── Ornaments ────────────────────────────────────────────────────────── */

function Crescent({ cx, cy, R, fill }: { cx: number; cy: number; R: number; fill: string }) {
  const T: Pt = [cx + R * 0.36, cy - R * 0.93]
  const B: Pt = [cx + R * 0.36, cy + R * 0.93]
  return (
    <g transform={`rotate(-24 ${f(cx)} ${f(cy)})`}>
      <path d={`M${pt(T)} A${f(R)} ${f(R)} 0 1 0 ${pt(B)} A${f(R * 1.02)} ${f(R * 1.02)} 0 0 1 ${pt(T)}Z`} fill={fill} />
    </g>
  )
}

/** A brass fanoos: onion cap, lit faceted body with pierced stars, drop and teal tassel. */
function Lantern({ chain, variant = 0, className, style }: { chain: number; variant?: number; className?: string; style?: CSSProperties }) {
  const y = chain
  const bw = variant === 1 ? 17 : 15
  const bh = variant === 1 ? 40 : 46
  const links = []
  for (let i = 0; i * 6 < chain - 2; i++) {
    links.push(<ellipse key={i} cx={20} cy={i * 6 + 3} rx={i % 2 ? 1 : 1.5} ry={2.7} fill="none" stroke={C.brass} strokeWidth={0.9} />)
  }
  const top = y + 20
  const bot = top + bh
  const mid = top + bh * 0.45
  return (
    <svg viewBox={`0 0 40 ${chain + bh + 36}`} className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      {links}
      <circle cx={20} cy={y + 2.5} r={2.6} fill="none" stroke={C.brassLight} strokeWidth={1.1} />
      {/* cap */}
      <path d={`M${20 - 8} ${y + 17} C${20 - 8} ${y + 11} ${20 - 3} ${y + 9} 20 ${y + 5} C${20 + 3} ${y + 9} ${20 + 8} ${y + 11} ${20 + 8} ${y + 17}Z`} fill={C.brass} stroke={C.brassDark} strokeWidth={0.6} />
      <path d={`M${20 - 4} ${y + 15} C${20 - 4} ${y + 12} ${20 - 1.5} ${y + 10} 20 ${y + 8}`} fill="none" stroke={C.brassLight} strokeWidth={0.8} opacity={0.8} />
      <rect x={20 - 11} y={y + 17} width={22} height={3} rx={1} fill={C.brassDark} />
      {/* lit body */}
      <path
        d={`M${20 - 10} ${top} C${20 - bw - 3} ${mid - 8} ${20 - bw - 2} ${mid + 8} ${20 - 9} ${bot} L${20 + 9} ${bot} C${20 + bw + 2} ${mid + 8} ${20 + bw + 3} ${mid - 8} ${20 + 10} ${top}Z`}
        fill="#EDB85E"
      />
      <path
        d={`M${20 - 6} ${top + 2} C${20 - bw + 2} ${mid - 6} ${20 - bw + 3} ${mid + 7} ${20 - 5} ${bot - 2} L${20 + 5} ${bot - 2} C${20 + bw - 3} ${mid + 7} ${20 + bw - 2} ${mid - 6} ${20 + 6} ${top + 2}Z`}
        fill="#FBE6AE"
        opacity={0.9}
      />
      <g fill="none" stroke={C.brassDark} strokeWidth={0.9}>
        <path d={`M20 ${top} V${bot}`} />
        <path d={`M${20 - 5} ${top} C${20 - 10} ${mid - 6} ${20 - 10} ${mid + 6} ${20 - 4.5} ${bot}`} />
        <path d={`M${20 + 5} ${top} C${20 + 10} ${mid - 6} ${20 + 10} ${mid + 6} ${20 + 4.5} ${bot}`} />
        <path d={`M${20 - 10} ${top} C${20 - bw - 3} ${mid - 8} ${20 - bw - 2} ${mid + 8} ${20 - 9} ${bot} L${20 + 9} ${bot} C${20 + bw + 2} ${mid + 8} ${20 + bw + 3} ${mid - 8} ${20 + 10} ${top}Z`} strokeWidth={1.2} />
        <path d={`M${20 - bw - 1} ${mid} H${20 + bw + 1}`} strokeWidth={0.7} opacity={0.7} />
      </g>
      <g fill={C.brassDark} opacity={0.75}>
        <path d={starPath(20 - 7.5, mid - 8, 2.2)} />
        <path d={starPath(20 + 7.5, mid - 8, 2.2)} />
        <path d={starPath(20, mid + 7, 2.6)} />
        <path d={starPath(20 - 7, mid + 12, 1.8)} />
        <path d={starPath(20 + 7, mid + 12, 1.8)} />
      </g>
      <rect x={20 - 10} y={bot} width={20} height={3} rx={1} fill={C.brassDark} />
      <path d={`M${20 - 8} ${bot + 3} L${20 + 8} ${bot + 3} L20 ${bot + 14}Z`} fill={C.brass} stroke={C.brassDark} strokeWidth={0.6} />
      <circle cx={20} cy={bot + 16.5} r={2.2} fill={C.brassLight} />
      <path d={`M20 ${bot + 18.5} L17.6 ${bot + 32} M20 ${bot + 18.5} L20 ${bot + 33} M20 ${bot + 18.5} L22.4 ${bot + 32}`} stroke="#3E9A8F" strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={20} cy={bot + 19} r={1.5} fill="#3E9A8F" />
    </svg>
  )
}

function Rosette({ size = 36, color = C.gold, fill = 'none', className }: { size?: number; color?: string; fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden>
      <path d={starPath(20, 20, 18)} fill={fill} stroke={color} strokeWidth={1} />
      <path d={starPath(20, 20, 13.5, 22.5)} fill="none" stroke={color} strokeWidth={0.8} />
      <circle cx={20} cy={20} r={3.2} fill={color} />
    </svg>
  )
}

function Divider({ color = C.gold, width = 150, className }: { color?: string; width?: number; className?: string }) {
  return (
    <svg viewBox="0 0 150 16" width={width} height={(width / 150) * 16} className={className} aria-hidden>
      <path d="M2 8 H56 M94 8 H148" stroke={color} strokeWidth={0.8} />
      <circle cx={60} cy={8} r={1.3} fill={color} />
      <circle cx={90} cy={8} r={1.3} fill={color} />
      <path d={starPath(75, 8, 7)} fill="none" stroke={color} strokeWidth={0.9} />
      <circle cx={75} cy={8} r={1.8} fill={color} />
    </svg>
  )
}

function Frieze({ flip }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="h-[22px] w-full"
      style={{
        background: C.wallDeep,
        backgroundImage: FRIEZE,
        backgroundSize: '22px 22px',
        backgroundPosition: 'center',
        borderTop: `1px solid ${flip ? 'transparent' : C.goldHair}`,
        borderBottom: `1px solid ${flip ? C.goldHair : 'transparent'}`,
      }}
    />
  )
}

/* ── Function motifs: gold line, teal and gold washes ────────────────── */

type MotifKind = 'mehndi' | 'nikah' | 'walima' | 'sangeet' | 'haldi' | 'rings' | 'lantern' | 'star'

function motifFor(name: string): MotifKind {
  const n = name.toLowerCase()
  if (/mehndi|mehendi|mehandi|henna/.test(n)) return 'mehndi'
  if (/nikah|nikaah|aqd|shaadi|wedding|ceremony/.test(n)) return 'nikah'
  if (/walima|valima|dawat|dinner|feast|lunch/.test(n)) return 'walima'
  if (/sangeet|qawwali|dholki|music|mushaira/.test(n)) return 'sangeet'
  if (/haldi|manjha|ubtan|mayun|mayoun/.test(n)) return 'haldi'
  if (/mangni|engagement|ring|baat pakki/.test(n)) return 'rings'
  if (/reception|chauthi|barat|baraat|rukhsati/.test(n)) return 'lantern'
  return 'star'
}

function Motif({ kind, className }: { kind: MotifKind; className?: string }) {
  const s = { stroke: C.gold, strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const n = { ...s, fill: 'none' }
  let body: ReactNode
  switch (kind) {
    case 'mehndi':
      body = (
        <>
          <path d="M17 49 L40.2 12.4 L51.6 22.2Z" fill={C.goldWash} {...s} />
          <path d="M40.2 12.4 C42.5 7.6 49.5 7.2 52.6 10.6 C55 13.4 54 18.6 51.6 22.2" fill={C.tealWash} {...s} />
          <path d="M29.6 30.6 L37.4 37.4 M24 39.6 L29.8 44.6" {...n} strokeWidth={1} />
          <circle cx={36} cy={27} r={1} fill={C.gold} />
          <circle cx={32.6} cy={33.4} r={1} fill={C.gold} />
          <path d="M17 49 C13 53 9.5 57.5 13 59.6 C16.6 61.8 21 57.6 18 54.8 C16.4 53.4 14.6 55 15.6 56.4" {...n} strokeWidth={1.1} />
          <circle cx={10} cy={48} r={1.1} fill={C.gold} />
          <circle cx={8.4} cy={43.4} r={0.9} fill={C.gold} />
          <circle cx={8.8} cy={39.2} r={0.7} fill={C.gold} />
        </>
      )
      break
    case 'nikah':
      body = (
        <>
          <rect x={18} y={15} width={28} height={35} fill={C.goldWash} {...s} strokeWidth={1.1} />
          <rect x={14} y={11} width={36} height={6.5} rx={3.25} fill={C.card} {...s} />
          <rect x={14} y={47.5} width={36} height={6.5} rx={3.25} fill={C.card} {...s} />
          <path d="M23 24 H41 M23 28.5 H41 M23 33 H35" {...n} strokeWidth={0.9} />
          <path d="M34.5 44 L32.2 56 L35 53.8 L36.6 57 L37.8 44.6" fill={C.tealWash} stroke={C.teal} strokeWidth={1} strokeLinejoin="round" />
          <path d="M40.5 44 L42.8 56 L40 53.8 L38.4 57 L37.2 44.6" fill={C.tealWash} stroke={C.teal} strokeWidth={1} strokeLinejoin="round" />
          <circle cx={37.5} cy={41.5} r={5} fill={C.card} stroke={C.teal} strokeWidth={1.2} />
          <path d={starPath(37.5, 41.5, 2.8)} fill={C.teal} />
        </>
      )
      break
    case 'walima':
      body = (
        <>
          <path d="M6 55 H58" {...n} strokeWidth={1.1} />
          <path d="M10 55 v3.5 M15 55 v3.5 M20 55 v3.5 M25 55 v3.5 M30 55 v3.5 M35 55 v3.5 M40 55 v3.5 M45 55 v3.5 M50 55 v3.5 M55 55 v3.5" {...n} strokeWidth={0.8} />
          <path d="M15 34 C11 45 19 53 32 53 C45 53 53 45 49 34Z" fill={C.goldWash} {...s} />
          <rect x={14} y={31} width={36} height={3.6} rx={1.8} fill={C.card} {...s} strokeWidth={1.1} />
          <path d="M20 31 C21.5 24 42.5 24 44 31" fill={C.tealWash} {...s} />
          <circle cx={32} cy={23.4} r={2.2} fill={C.gold} />
          <path d="M14.6 38 C10.4 38 10.4 44 14.8 43.6 M49.4 38 C53.6 38 53.6 44 49.2 43.6" {...n} strokeWidth={1.1} />
          <path d="M25 44 C28 46 36 46 39 44" {...n} strokeWidth={0.8} opacity={0.7} />
          <path d="M26 18 C23.5 15.5 28.5 13.5 26 10 M32 16.5 C29.5 14 34.5 12 32 8.5 M38 18 C35.5 15.5 40.5 13.5 38 10" {...n} strokeWidth={1} opacity={0.75} />
        </>
      )
      break
    case 'sangeet':
      body = (
        <>
          <path d="M13 23 C11 31 11 37 13 45 H51 C53 37 53 31 51 23Z" fill={C.goldWash} {...s} />
          <ellipse cx={13} cy={34} rx={3.4} ry={11} fill={C.card} {...s} />
          <ellipse cx={51} cy={34} rx={3.4} ry={11} fill={C.tealWash} {...s} />
          <path d="M16 24.5 L21.5 43.5 L27 24.5 L32.5 43.5 L38 24.5 L43.5 43.5 L48.5 25" {...n} strokeWidth={0.9} />
          <path d="M26 16 C24 13 28 12 29 9 M36 16 C34 13 38 12 39 9" stroke={C.teal} strokeWidth={1} fill="none" strokeLinecap="round" />
          <circle cx={25.2} cy={17.4} r={1.6} fill={C.teal} />
          <circle cx={35.2} cy={17.4} r={1.6} fill={C.teal} />
        </>
      )
      break
    case 'haldi':
      body = (
        <>
          <path d="M11 34 C13 50 51 50 53 34Z" fill={C.goldWash} {...s} />
          <ellipse cx={32} cy={34} rx={21} ry={4.2} fill={C.card} {...s} />
          <path d="M18 34 C20 29 28 28 32 31 C36 28 44 29 46 34" fill="rgba(222,170,60,0.45)" stroke={C.gold} strokeWidth={1} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2
            return <circle key={i} cx={f(44 + 4.2 * Math.cos(a))} cy={f(20 + 4.2 * Math.sin(a))} r={2.8} fill="rgba(222,150,50,0.5)" stroke={C.gold} strokeWidth={0.7} />
          })}
          <circle cx={44} cy={20} r={2.4} fill={C.gold} />
          <path d="M40 25 C36 28 33 27 30 25" stroke={C.teal} strokeWidth={1.1} fill="none" />
        </>
      )
      break
    case 'rings':
      body = (
        <>
          <circle cx={26} cy={37} r={11.5} fill="none" stroke={C.gold} strokeWidth={2.2} />
          <circle cx={38.5} cy={37} r={11.5} fill="none" stroke={C.gold} strokeWidth={2.2} />
          <path d="M22 25.8 L26 20.6 L30 25.8 L26 28.2Z" fill={C.tealWash} stroke={C.teal} strokeWidth={1} strokeLinejoin="round" />
          <path d={starPath(47, 18, 3.2)} fill={C.gold} opacity={0.8} />
        </>
      )
      break
    case 'lantern':
      return <Lantern chain={4} className={className} />
    default:
      body = (
        <>
          <path d={starPath(32, 32, 22)} fill={C.goldWash} {...s} />
          <path d={starPath(32, 32, 15.5, 22.5)} fill={C.tealWash} {...s} strokeWidth={1} />
          <circle cx={32} cy={32} r={4} fill={C.gold} />
        </>
      )
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {body}
    </svg>
  )
}

/* ── An arched niche: head drawn in SVG, sides continued in CSS ──────── */

function Niche({
  children,
  fill,
  line,
  head = 0.34,
  className,
  style,
  crown,
}: {
  children: ReactNode
  fill: string
  line: string
  head?: number
  className?: string
  style?: CSSProperties
  crown?: ReactNode
}) {
  const H = 300 * head
  const inset = 9
  return (
    <div className={className} style={{ containerType: 'inline-size', ...style }}>
      <div className="relative">
        <svg viewBox={`0 0 300 ${f(H)}`} className="block w-full" style={{ overflow: 'visible' }} aria-hidden>
          <path d={archShape(0, 0, 300, H + 1.5, H)} fill={fill} />
          <path d={archCurve(inset, inset * 1.7, 300 - inset * 2, H - inset * 1.7)} fill="none" stroke={line} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>
        {crown && <div className="absolute inset-x-0 bottom-0 flex justify-center">{crown}</div>}
      </div>
      <div className="relative" style={{ background: fill }}>
        <span aria-hidden className="pointer-events-none absolute" style={{ left: '3cqi', right: '3cqi', top: 0, bottom: '3cqi', border: `1px solid ${line}`, borderTop: 'none' }} />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

/* ── The hero window ─────────────────────────────────────────────────── */

function ArchWindow({ w, h, uid }: { w: number; h: number; uid: string }) {
  const m = 10
  const band = Math.max(11, Math.min(15, w * 0.04))
  const ow = w - m * 2
  const head = ow * 0.52
  const outer = archShape(m, m, ow, h - m * 2, head)
  const ix = m + band
  const iy = m + band * 1.55
  const iw = ow - band * 2
  const ih = h - m * 2 - band * 1.55 - band
  const ihead = head - band * 0.9
  const inner = archShape(ix, iy, iw, ih, ihead)
  const bead = archCurve(m + band / 2, m + band * 0.78, ow - band, head - band * 0.45)
  const sky = `${uid}-sky`
  const cx = w / 2
  const r = rng(29)
  const stars: { x: number; y: number; s: number }[] = []
  for (let i = 0; i < 14; i++) {
    const t = r()
    const yy = iy + ihead * (0.18 + r() * 0.52)
    const spread = (iw / 2) * (0.25 + 0.6 * ((yy - iy) / ihead))
    const xx = cx + (t < 0.5 ? -1 : 1) * (18 + r() * spread)
    stars.push({ x: xx, y: yy, s: 1.2 + r() * 1.8 })
  }
  const base = iy + ih
  const sk = (dx: number) => cx + dx
  // A far skyline — a dome between two small domes and two minarets — at the sill.
  const skyline =
    `M${f(ix)} ${f(base)} V${f(base - 16)} H${f(sk(-118))} V${f(base - 58)} l3 -7 l3 7 V${f(base - 16)}` +
    ` H${f(sk(-72))} V${f(base - 26)} C${f(sk(-72))} ${f(base - 40)} ${f(sk(-52))} ${f(base - 42)} ${f(sk(-52))} ${f(base - 50)} C${f(sk(-52))} ${f(base - 42)} ${f(sk(-32))} ${f(base - 40)} ${f(sk(-32))} ${f(base - 26)}` +
    ` H${f(sk(-26))} V${f(base - 34)} C${f(sk(-26))} ${f(base - 58)} ${f(sk(-4))} ${f(base - 62)} ${f(sk(0))} ${f(base - 78)} C${f(sk(4))} ${f(base - 62)} ${f(sk(26))} ${f(base - 58)} ${f(sk(26))} ${f(base - 34)}` +
    ` H${f(sk(32))} V${f(base - 26)} C${f(sk(32))} ${f(base - 40)} ${f(sk(52))} ${f(base - 42)} ${f(sk(52))} ${f(base - 50)} C${f(sk(52))} ${f(base - 42)} ${f(sk(72))} ${f(base - 40)} ${f(sk(72))} ${f(base - 26)}` +
    ` H${f(sk(112))} V${f(base - 58)} l3 -7 l3 7 V${f(base - 16)} H${f(ix + iw)} V${f(base)}Z`
  return (
    <svg viewBox={`0 0 ${f(w)} ${f(h)}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.night} />
          <stop offset="0.55" stopColor="#0A2C28" />
          <stop offset="1" stopColor={C.nightLow} />
        </linearGradient>
      </defs>
      {/* alfiz — the rectangular frame that holds the arch */}
      <rect x={0.5} y={0.5} width={w - 1} height={h - 1} fill="none" stroke={C.goldHair} />
      <rect x={4.5} y={4.5} width={w - 9} height={h - 9} fill="none" stroke={C.goldFaint} />
      {/* stone band, beaded */}
      <path d={outer} fill={C.stone} />
      <path d={outer} fill="none" stroke={C.gold} strokeWidth={1} />
      <path d={bead} fill="none" stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.1 8" opacity={0.9} />
      <path d={`M${f(m + band / 2)} ${f(m + head)} V${f(h - m - band / 2)} M${f(w - m - band / 2)} ${f(m + head)} V${f(h - m - band / 2)}`} fill="none" stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.1 8" opacity={0.9} />
      {/* the window */}
      <path d={inner} fill={`url(#${sky})`} />
      <path d={skyline} fill="#041614" opacity={0.55} />
      {stars.map((s, i) => (
        <path key={i} d={starPath(s.x, s.y, s.s)} fill={C.goldLight} opacity={0.55 + (i % 3) * 0.15} />
      ))}
      <Crescent cx={cx} cy={iy + ihead * 0.3} R={Math.min(17, w * 0.047)} fill="#F2E3BC" />
      <path d={starPath(cx + Math.min(17, w * 0.047) * 1.35, iy + ihead * 0.2, 2.6)} fill="#F2E3BC" />
      <path d={inner} fill="none" stroke={C.gold} strokeWidth={1.2} />
      <path d={archShape(ix + 5, iy + 7, iw - 10, ih - 12, ihead - 4)} fill="none" stroke={C.goldFaint} strokeWidth={0.8} />
    </svg>
  )
}

/* ── The mashrabiya screens ──────────────────────────────────────────── */

function ScreenPanel({ side, w, h, uid }: { side: 'l' | 'r'; w: number; h: number; uid: string }) {
  const pw = w / 2
  const fr = Math.min(18, Math.max(12, pw * 0.08))
  const seam = fr * 0.55
  const x1 = fr
  const x2 = pw - seam
  const ow = x2 - x1
  const top = fr + 8
  const archH = h * 0.5
  const head = ow * 0.62
  const railY = top + archH
  const rail = Math.max(46, h * 0.075)
  const lowTop = railY + rail
  const lowBot = h - fr - 10
  const upper = archShape(x1, top, ow, archH, head)
  const lower = `M${f(x1)} ${f(lowTop)}H${f(x2)}V${f(lowBot)}H${f(x1)}Z`
  const frame = `M0 0H${f(pw)}V${f(h)}H0Z ${upper} ${lower}`
  const lac = `${uid}-lac-${side}`
  const ry = railY + rail / 2
  return (
    <div
      className={`sn-panel sn-panel-${side} absolute top-0 h-full`}
      style={{ width: '50%', [side === 'l' ? 'left' : 'right']: 0, backgroundImage: `${LATTICE}, ${BACKLIGHT}`, backgroundSize: '40px 40px, 100% 100%', backgroundPosition: side === 'l' ? 'right top, 0 0' : 'left top, 0 0' }}
    >
      <svg viewBox={`0 0 ${f(pw)} ${f(h)}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ transform: side === 'r' ? 'scaleX(-1)' : undefined }} aria-hidden>
        <defs>
          <linearGradient id={lac} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.lacquerDark} />
            <stop offset="0.5" stopColor={C.lacquer} />
            <stop offset="1" stopColor="#154A40" />
          </linearGradient>
        </defs>
        <path d={frame} fill={`url(#${lac})`} fillRule="evenodd" />
        {/* bevel: a dark lip inside each opening, a gilt bead outside it */}
        <path d={upper} fill="none" stroke="#041512" strokeOpacity={0.6} strokeWidth={3} />
        <path d={lower} fill="none" stroke="#041512" strokeOpacity={0.6} strokeWidth={3} />
        <path d={archShape(x1 - 4, top - 5, ow + 8, archH + 9, head + 3)} fill="none" stroke={C.gold} strokeWidth={1.1} />
        <path d={`M${f(x1 - 4)} ${f(lowTop - 4)}H${f(x2 + 4)}V${f(lowBot + 4)}H${f(x1 - 4)}Z`} fill="none" stroke={C.gold} strokeWidth={1.1} />
        <rect x={5} y={5} width={pw - 5} height={h - 10} fill="none" stroke={C.goldFaint} strokeWidth={1} />
        <path d={starPath(x1 + ow * 0.12, top + head * 0.2, 5.5)} fill="none" stroke={C.gold} strokeWidth={0.9} />
        <circle cx={x1 + ow * 0.12} cy={top + head * 0.2} r={1.4} fill={C.gold} />
        {/* the rail: brass studs and, at the seam, the ring pull */}
        {[0.16, 0.44].map((t) => (
          <g key={t}>
            <circle cx={x1 + ow * t} cy={ry} r={3.4} fill={C.brass} stroke={C.brassDark} strokeWidth={0.6} />
            <circle cx={x1 + ow * t - 1} cy={ry - 1} r={1.1} fill={C.brassLight} />
          </g>
        ))}
        <path d={starPath(x2 - 17, ry - 7, 9)} fill={C.brass} stroke={C.brassDark} strokeWidth={0.7} />
        <circle cx={x2 - 17} cy={ry - 7} r={2.2} fill={C.brassLight} />
        <circle cx={x2 - 17} cy={ry + 5.5} r={9.5} fill="none" stroke={C.brassDark} strokeWidth={3.6} />
        <circle cx={x2 - 17} cy={ry + 5.5} r={9.5} fill="none" stroke={C.brass} strokeWidth={2.4} />
        <path d={`M${f(x2 - 24)} ${f(ry + 1)} A9.5 9.5 0 0 1 ${f(x2 - 12)} ${f(ry - 3)}`} fill="none" stroke={C.brassLight} strokeWidth={1} />
        {/* the meeting stile */}
        <path d={`M${f(pw - 1.2)} 0 V${f(h)}`} stroke={C.gold} strokeWidth={1} opacity={0.8} />
        <path d={`M${f(pw - 0.3)} 0 V${f(h)}`} stroke="#041512" strokeWidth={0.8} />
      </svg>
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...grain(0.08, 160), mixBlendMode: 'multiply' }} />
      {/* the shadow each panel throws across the room as it slides */}
      <span aria-hidden className="sn-cast pointer-events-none absolute top-0 h-full w-[28px]" style={{ [side === 'l' ? 'left' : 'right']: '100%', background: `linear-gradient(to ${side === 'l' ? 'right' : 'left'}, rgba(0,0,0,0.38), rgba(0,0,0,0))` }} />
    </div>
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
  const btnStyle: CSSProperties = { color: C.onDark, border: `1px solid ${C.goldHair}`, background: 'rgba(6,29,26,0.6)' }
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: 'rgba(5,22,20,0.96)' }}
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
      <img
        src={photos[index]}
        alt=""
        className="max-h-[84svh] max-w-[94vw] object-contain"
        style={{ boxShadow: `0 0 0 1px ${C.goldHair}` }}
        onClick={(e) => e.stopPropagation()}
      />
      <button ref={closeRef} type="button" aria-label="Close" className={`${btn} right-4 top-4`} style={btnStyle} onClick={onClose}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" className={`${btn} left-3 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); onStep(-1) }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next photo" className={`${btn} right-3 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); onStep(1) }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="absolute bottom-5 left-0 right-0 text-center tabular-nums" style={{ fontFamily: serif, fontSize: 16, color: C.onDarkSoft }}>
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

function Glyph({ kind }: { kind: 'cal' | 'map' | 'wa' | 'tel' | 'live' | 'gift' }) {
  if (kind === 'wa') return <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="currentColor" aria-hidden><path d={WA_PATH} /></svg>
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {kind === 'cal' && <><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>}
      {kind === 'map' && <><path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>}
      {kind === 'tel' && <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />}
      {kind === 'live' && <><rect x="3" y="6" width="13" height="12" rx="1.5" /><path d="m16 10 5-3v10l-5-3" /></>}
      {kind === 'gift' && <><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M4 13h16M12 9v11M12 9c-2.5 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2.5 3-5 3" /></>}
    </svg>
  )
}

function SectionTitle({ children, dark, sub, size }: { children: ReactNode; dark?: boolean; sub?: ReactNode; size?: string }) {
  return (
    <div className="text-center">
      <Rosette size={30} color={dark ? C.goldLight : C.gold} className="mx-auto" />
      <h2 className="mt-3 text-balance leading-[1.15]" style={{ fontFamily: serif, fontSize: size || 'clamp(30px, 9cqi, 38px)', fontWeight: 400, color: dark ? C.onDark : C.ink }}>
        {children}
      </h2>
      {sub && (
        <p className="mx-auto mt-2 max-w-[21rem] text-balance italic leading-[1.45]" style={{ fontSize: 18, color: dark ? C.onDarkSoft : C.soft }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const key = items.map((i) => i.id).join('|')
  useEffect(() => {
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  return (
    <nav aria-label="Sections" className="sticky top-0 z-30" style={{ background: 'rgba(10,43,39,0.97)', borderBottom: `1px solid ${C.goldHair}` }}>
      <div className="sn-nav overflow-x-auto">
        <ul className="mx-auto flex w-max items-center gap-x-[clamp(12px,4cqi,24px)] whitespace-nowrap px-3">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={go(it.id)}
                aria-current={active === it.id ? 'true' : undefined}
                className="block py-3"
                style={{ fontFamily: serif, fontSize: 'clamp(15px, 4.2cqi, 17px)', color: active === it.id ? C.goldLight : C.onDarkSoft, borderBottom: `1px solid ${active === it.id ? C.goldLight : 'transparent'}` }}
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

function Pill({ href, isPreview, kind, children, solid, dark }: { href: string | null; isPreview: boolean; kind: Parameters<typeof Glyph>[0]['kind']; children: ReactNode; solid?: boolean; dark?: boolean }) {
  const style: CSSProperties = solid
    ? { background: C.goldLight, color: C.wallDeep, fontFamily: serif, fontSize: 17, fontWeight: 700 }
    : { border: `1px solid ${dark ? 'rgba(226,198,140,0.55)' : C.goldHair}`, color: dark ? C.onDark : C.ink, fontFamily: serif, fontSize: 16 }
  return (
    <DirectionsLink href={href} isPreview={isPreview} className="sn-btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5" style={style}>
      <Glyph kind={kind} />
      {children}
    </DirectionsLink>
  )
}

/* ── The invitation ──────────────────────────────────────────────────── */

type Phase = 'closed' | 'opening' | 'open'

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

export default function SignatureNikah({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bride = data.brideName?.trim() || 'Ayesha'
  const groom = data.groomName?.trim() || 'Imran'
  const couple = `${bride} & ${groom}`
  const date = dateParts(data.date)
  const venue = data.venue?.trim() || ''
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const nikahCal = calendarHref(`Nikah of ${couple}`, data.date, data.time, place || undefined, 4)
  const invocation = useMemo(() => parseLines(data.invocation), [data.invocation])
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const story = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const photos = useMemo(() => galleryImages(data.galleryImages, 8), [data.galleryImages])
  const isImg = (u?: string) => Boolean(u && /^(https?:)?\//.test(u))
  const coverPhoto = isImg(data.couplePhoto) ? data.couplePhoto : ''

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
    return [{ name: 'Nikah', date: data.date || '', time: data.time || '', venue: data.venue || '', dress: data.dressCode || '' }]
  }, [data.events, data.date, data.time, data.venue, data.dressCode])
  const fnTitle: ReactNode =
    functions.length > 1 && functions.length <= 4
      ? functions.map((fn, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            {i > 0 && (
              <svg viewBox="0 0 10 10" className="mx-[0.28em] inline-block h-[0.3em] w-[0.3em] align-middle" aria-hidden>
                <path d={starPath(5, 5, 5)} fill={C.goldLight} />
              </svg>
            )}
            {fn.name}
          </span>
        ))
      : functions.length === 1
        ? 'The celebration'
        : 'The functions'

  const reply = whatsappHref(data.whatsappNumber, `Assalamu alaikum! I'd like to confirm my attendance at the Nikah of ${couple}.`)
  const rsvpBy = dateParts(data.rsvpBy)
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null
  const hashtag = data.hashtag?.trim() ? (data.hashtag.trim().startsWith('#') ? data.hashtag.trim() : `#${data.hashtag.trim()}`) : ''

  const hasFamilyText = Boolean(data.message?.trim() || data.brideParents?.trim() || data.groomParents?.trim() || blessings.length)
  const hasFamilies = hasFamilyText || Boolean(coverPhoto)
  const hasGuests = Boolean(data.dressCode?.trim() || travel.length || contacts.length || faq.length)
  const ids = {
    families: `${uid}-families`,
    functions: `${uid}-functions`,
    story: `${uid}-story`,
    guests: `${uid}-guests`,
    rsvp: `${uid}-rsvp`,
  }
  const navItems = [
    hasFamilies && { id: ids.families, label: 'Families' },
    { id: ids.functions, label: 'Functions' },
    story.length > 0 && { id: ids.story, label: 'Story' },
    hasGuests && { id: ids.guests, label: 'Guests' },
    { id: ids.rsvp, label: 'RSVP' },
  ].filter(Boolean) as { id: string; label: string }[]

  /* The screens: closed → opening (panels slide, lanterns swing) → open. */
  const [phase, setPhase] = useState<Phase>('closed')
  const [swing, setSwing] = useState(false)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const openScreens = useCallback(() => {
    if (phase !== 'closed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('opening')
    setSwing(true)
    timers.current.push(window.setTimeout(() => setPhase('open'), 2300))
  }, [phase])

  const [heroRef, hero] = useSize<HTMLElement>({ w: 390, h: 844 })
  const [archRef, arch] = useSize<HTMLDivElement>({ w: 358, h: 800 })

  const [shown, setShown] = useState<number | null>(null)
  const closeBox = useCallback(() => setShown(null), [])
  const stepBox = useCallback((d: number) => setShown((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length])

  const heroH = isPreview ? 560 : '100svh'
  const open = phase === 'open'

  const archBtnTop = Math.min(18, Math.max(12, hero.w / 2 * 0.08)) + 8

  return (
    <div
      className="sn relative"
      style={{ background: C.paper, color: C.ink, fontFamily: serif, containerType: 'inline-size', overflowX: 'clip' }}
    >
      <style>{`
        .sn .sn-panel { transition: transform 1.75s cubic-bezier(.66,0,.22,1) .32s; will-change: transform; }
        .sn .is-opening .sn-panel-l { transform: translateX(-101%); }
        .sn .is-opening .sn-panel-r { transform: translateX(101%); }
        .sn .sn-cast { opacity: 0; transition: opacity .5s ease .3s; }
        .sn .is-opening .sn-cast { opacity: 1; }
        .sn .sn-plaque { transition: opacity .45s ease, transform .6s cubic-bezier(.3,.6,.3,1); }
        .sn .is-opening .sn-plaque { opacity: 0; transform: translate(-50%, -14px) scale(.97); }
        .sn .sn-screen-btn:focus-visible .sn-plaque { outline: 2px solid ${C.goldLight}; outline-offset: 4px; }
        .sn .sn-dolly { transition: transform 2.3s cubic-bezier(.2,.6,.2,1); }
        .sn .is-closed .sn-dolly { transform: scale(1.045); }
        .sn .sn-veil { transition: opacity 1.8s ease .4s; }
        .sn .is-opening .sn-veil { opacity: 0; }
        .sn .sn-swing .sn-lantern { animation: sn-swing 3.8s cubic-bezier(.4,0,.3,1) .55s 1 both; }
        .sn .sn-swing .sn-lantern.b { animation-name: sn-swing-b; animation-delay: .75s; }
        .sn .sn-lantern { transform-origin: 50% 0; }
        @keyframes sn-swing { 0% { transform: rotate(0) } 18% { transform: rotate(4.2deg) } 40% { transform: rotate(-3deg) } 62% { transform: rotate(1.7deg) } 82% { transform: rotate(-.7deg) } 100% { transform: rotate(0) } }
        @keyframes sn-swing-b { 0% { transform: rotate(0) } 18% { transform: rotate(-3.4deg) } 40% { transform: rotate(2.5deg) } 62% { transform: rotate(-1.4deg) } 82% { transform: rotate(.6deg) } 100% { transform: rotate(0) } }
        .sn .sn-rise { opacity: 0; transform: translateY(12px); animation: sn-rise 1s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes sn-rise { to { opacity: 1; transform: none; } }
        .sn .sn-nav { scrollbar-width: none; }
        .sn .sn-nav::-webkit-scrollbar { display: none; }
        .sn .sn-btn { transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
        .sn .sn-link:hover { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; }
        .sn details > summary { list-style: none; cursor: pointer; }
        .sn details > summary::-webkit-details-marker { display: none; }
        .sn details .sn-q { transition: transform .35s ease; }
        .sn details[open] .sn-q { transform: rotate(22.5deg); }
        .sn details[open] .sn-q path { fill: ${C.gold}; }
        .sn .sn-photo { transition: transform .5s cubic-bezier(.2,.7,.2,1); }
        .sn .sn-photo:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) {
          .sn .sn-panel, .sn .sn-dolly, .sn .sn-veil, .sn .sn-plaque { transition: none; }
          .sn .sn-swing .sn-lantern, .sn .sn-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.onDark} background="rgba(10,43,39,0.85)" border={C.goldHair} />

      {/* ── Hero: the arch window in a tiled wall ─────────────────────── */}
      <section
        ref={heroRef}
        className={`relative overflow-hidden ${phase === 'closed' ? 'is-closed' : ''} ${phase === 'opening' ? 'is-opening' : ''}`}
        style={{ minHeight: heroH, background: C.wall }}
      >
        <div
          className={`sn-dolly flex flex-col ${swing ? 'sn-swing' : ''}`}
          style={{ minHeight: heroH, padding: '22px clamp(12px, 4.4cqi, 20px) clamp(14px, 4.4cqi, 20px)', backgroundImage: WALL, backgroundSize: '48px 48px', backgroundPosition: 'center top' }}
        >
          <div ref={archRef} className="relative mx-auto flex w-full max-w-[27rem] flex-1 flex-col">
            <ArchWindow w={arch.w} h={arch.h} uid={uid} />
            <Lantern chain={30} className="sn-lantern pointer-events-none absolute" style={{ left: '6.5%', top: -22, width: 'clamp(26px, 9.6cqi, 40px)' }} />
            <Lantern chain={64} variant={1} className="sn-lantern b pointer-events-none absolute" style={{ right: '6.5%', top: -22, width: 'clamp(24px, 8.8cqi, 37px)' }} />

            <div className="relative flex flex-1 flex-col items-center justify-center px-[12%] text-center" style={{ paddingTop: '43%', paddingBottom: 'clamp(40px, 12cqi, 56px)' }}>
              {invocation.length > 0 && (
                <div className="mb-5 space-y-1.5">
                  {invocation.map((line, i) =>
                    ARABIC.test(line) ? (
                      <p key={i} dir="rtl" lang="ar" className="text-balance" style={{ fontFamily: serif, fontWeight: 700, fontSize: 'clamp(22px, 7.4cqi, 32px)', lineHeight: 1.85, color: C.goldLight }}>
                        {line}
                      </p>
                    ) : (
                      <p key={i} className="mx-auto max-w-[17rem] text-balance italic" style={{ fontSize: 16, lineHeight: 1.45, color: C.onDarkSoft }}>
                        {line}
                      </p>
                    ),
                  )}
                </div>
              )}
              <Divider color={C.gold} width={128} />
              <p className="mt-4 italic" style={{ fontSize: 19, color: C.onDarkSoft }}>the Nikah of</p>
              {/* Its own container: each name is sized by its longest word, so a long surname shrinks instead of overflowing. */}
              <h1 className="mt-2" style={{ fontWeight: 400, color: C.onDark, containerType: 'inline-size', width: '100%' }}>
                <span className="block text-balance leading-[1.08]" style={{ fontSize: `clamp(20px, ${fitCqi(bride, { em: 0.52, max: 20 })}cqi, 60px)` }}>{bride}</span>
                <span className="my-1 block italic leading-none" style={{ fontSize: 'clamp(24px, 7cqi, 30px)', color: C.goldLight }}>&amp;</span>
                <span className="block text-balance leading-[1.08]" style={{ fontSize: `clamp(20px, ${fitCqi(groom, { em: 0.52, max: 20 })}cqi, 60px)` }}>{groom}</span>
              </h1>
              <Divider color={C.gold} width={128} className="mt-6" />
              <div className="mt-5">
                {date ? (
                  <>
                    <p className="italic" style={{ fontSize: 17, color: C.onDarkSoft }}>Insha&rsquo;Allah, on {date.weekday}</p>
                    <p className="mt-0.5" style={{ fontSize: 'clamp(22px, 6.6cqi, 27px)', fontWeight: 700, letterSpacing: '0.02em', color: C.onDark }}>
                      {date.day} {date.month} {date.year}
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: 22, color: C.onDark }}>Date to be announced</p>
                )}
                {data.time && <p className="mt-0.5 italic" style={{ fontSize: 17, color: C.onDarkSoft }}>at {timeWords(data.time) || timeLabel(data.time)}</p>}
              </div>
              {venue && (
                <div className="mt-5">
                  <p className="text-balance leading-[1.25]" style={{ fontSize: 21, color: C.goldLight }}>{venue}</p>
                  {data.venueAddress && <p className="mx-auto mt-1 max-w-[19rem] text-balance leading-[1.4]" style={{ fontSize: 15.5, color: C.onDarkSoft }}>{data.venueAddress}</p>}
                </div>
              )}
              {(nikahCal || directions) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                  <DirectionsLink href={nikahCal} isPreview={isPreview} className="sn-link inline-flex items-center gap-1.5 py-1" style={{ fontSize: 16, color: C.goldLight }}>
                    <Glyph kind="cal" />
                    Add to calendar
                  </DirectionsLink>
                  <DirectionsLink href={directions} isPreview={isPreview} className="sn-link inline-flex items-center gap-1.5 py-1" style={{ fontSize: 16, color: C.goldLight }}>
                    <Glyph kind="map" />
                    Directions
                  </DirectionsLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {phase !== 'open' && (
          <div className="absolute inset-0 z-20">
            <span aria-hidden className="sn-veil pointer-events-none absolute inset-0" style={{ background: 'rgba(3,14,12,0.45)' }} />
            <ScreenPanel side="l" w={hero.w} h={hero.h} uid={uid} />
            <ScreenPanel side="r" w={hero.w} h={hero.h} uid={uid} />
            <button
              type="button"
              onClick={openScreens}
              disabled={phase !== 'closed'}
              aria-label={`Open the invitation to the Nikah of ${couple}`}
              className="sn-screen-btn absolute inset-0 cursor-pointer disabled:cursor-default"
            >
              <Niche
                fill={C.card}
                line={C.gold}
                head={0.3}
                className="sn-plaque absolute left-1/2 w-[min(64cqi,250px)] -translate-x-1/2"
                style={{ top: archBtnTop + hero.h * 0.5 * 0.3, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.35))' }}
                crown={<svg viewBox="0 0 40 40" className="mb-[-6px] w-[26px]" aria-hidden><Crescent cx={20} cy={20} R={11} fill={C.gold} /></svg>}
              >
                <div className="px-6 pb-7 pt-3 text-center">
                  <p className="italic" style={{ fontSize: 16, color: C.soft }}>the Nikah of</p>
                  <p className="mt-1 text-balance leading-[1.15]" style={{ fontSize: `clamp(16px, ${fitCqi(`${bride} & ${groom}`, { em: 0.52, room: 78, max: 7.6 })}cqi, 30px)`, color: C.ink }}>
                    {bride} <span className="italic" style={{ color: C.gold }}>&amp;</span> {groom}
                  </p>
                  {date && <p className="mt-2 tabular-nums" style={{ fontSize: 16, letterSpacing: '0.12em', color: C.gold }}>{date.dayPadded} · {pad2(Number(data.date.slice(5, 7)))} · {date.year}</p>}
                  <p className="mt-4 italic" style={{ fontSize: 16, color: C.ink }}>Tap to open the doors</p>
                </div>
              </Niche>
            </button>
          </div>
        )}
      </section>

      {open && (
        <>
          <SectionNav items={navItems} />

          {/* ── The families, on a tile-bordered panel ──────────────── */}
          {hasFamilies && (
            <section id={ids.families} className="px-4 pb-14 pt-12 text-center" style={{ scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[30rem]">
                {coverPhoto && (
                  <Reveal disabled={isPreview} className="mx-auto mb-10 w-[min(78cqi,330px)]">
                    <div className="p-[1.5px]" style={{ background: C.gold, clipPath: archClip(0.8) }}>
                      <div className="p-[6px]" style={{ background: C.paper, clipPath: archClip(0.8) }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverPhoto} alt={couple} className="block aspect-[4/5] w-full object-cover" style={{ clipPath: archClip(0.8) }} />
                      </div>
                    </div>
                  </Reveal>
                )}
                {hasFamilyText && (
                <div className="p-[15px]" style={{ background: C.wallDeep, backgroundImage: BORDER, backgroundSize: '15px 15px', backgroundRepeat: 'round' }}>
                  <div className="relative px-[7cqi] pb-12 pt-11" style={{ background: C.paper, boxShadow: `inset 0 0 0 1px ${C.gold}, inset 0 0 0 5px ${C.paper}, inset 0 0 0 6px ${C.goldHair}` }}>
                    {(['left-[10px] top-[10px]', 'right-[10px] top-[10px]', 'bottom-[10px] left-[10px]', 'bottom-[10px] right-[10px]'] as const).map((pos) => (
                      <svg key={pos} viewBox="0 0 20 20" className={`absolute ${pos} h-[16px] w-[16px]`} aria-hidden>
                        <path d={starPath(10, 10, 9)} fill={C.paper} stroke={C.gold} strokeWidth={1} />
                        <circle cx={10} cy={10} r={2} fill={C.gold} />
                      </svg>
                    ))}
                    {data.message?.trim() && (
                      <Reveal disabled={isPreview}>
                        <Rosette size={34} className="mx-auto" />
                        <p className="mx-auto mt-5 max-w-[24rem] text-balance italic leading-[1.5]" style={{ fontSize: 'clamp(20px, 6cqi, 23px)', color: C.ink }}>
                          {data.message}
                        </p>
                      </Reveal>
                    )}
                    {(data.brideParents?.trim() || data.groomParents?.trim()) && (
                      <Reveal disabled={isPreview} className={data.message?.trim() ? 'mt-9' : ''}>
                        {[
                          { name: bride, parents: data.brideParents, photo: data.bridePhoto },
                          { name: groom, parents: data.groomParents, photo: data.groomPhoto },
                        ].map((p, i) => (
                          <div key={i}>
                            {i === 1 && <p className="my-4 italic" style={{ fontSize: 20, color: C.gold }}>with</p>}
                            {isImg(p.photo) && (
                              <div className="mx-auto mb-4 w-[96px] p-[1.5px]" style={{ background: C.gold, clipPath: archClip(0.75) }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.photo} alt={p.name} loading="lazy" className="block aspect-[3/4] w-full object-cover" style={{ clipPath: archClip(0.75) }} />
                              </div>
                            )}
                            <p className="leading-[1.1]" style={{ fontSize: 'clamp(30px, 9cqi, 36px)', color: C.ink }}>{p.name}</p>
                            {p.parents?.trim() && <p className="mx-auto mt-1.5 max-w-[20rem] text-balance leading-[1.45]" style={{ fontSize: 17, color: C.soft }}>{p.parents}</p>}
                          </div>
                        ))}
                      </Reveal>
                    )}
                    {blessings.length > 0 && (
                      <Reveal disabled={isPreview} className="mt-10">
                        <Divider width={120} className="mx-auto" />
                        <p className="mt-4 italic" style={{ fontSize: 19, color: C.gold }}>With the blessings of</p>
                        <ul className="mt-3 space-y-1.5">
                          {blessings.map((b, i) => (
                            <li key={i} className="text-balance leading-[1.4]" style={{ fontSize: 19, color: C.ink }} dir={ARABIC.test(b) ? 'rtl' : undefined}>{b}</li>
                          ))}
                        </ul>
                      </Reveal>
                    )}
                  </div>
                </div>
                )}
              </div>
            </section>
          )}

          {/* ── Countdown, in a khatam medallion ────────────────────── */}
          {countdown && (
            <Reveal disabled={isPreview} as="section" className="px-6 pb-16 text-center" style={hasFamilies ? undefined : { paddingTop: 56 }}>
              <div className="relative mx-auto aspect-square w-[min(62cqi,250px)]">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
                  <path d={starPath(100, 100, 96)} fill={C.card} stroke={C.gold} strokeWidth={1.2} />
                  <path d={starPath(100, 100, 88)} fill="none" stroke={C.goldHair} strokeWidth={0.8} />
                  <path d={starPath(100, 100, 64, 22.5)} fill="none" stroke={C.goldFaint} strokeWidth={0.8} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="tabular-nums leading-none" style={{ fontSize: 'clamp(48px, 16cqi, 64px)', color: C.ink }}>{countdown.days}</span>
                  <span className="mt-1 italic" style={{ fontSize: 18, color: C.soft }}>{countdown.days === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
              <p className="mt-5 tabular-nums" style={{ fontSize: 17, color: C.soft }}>
                {countdown.hours} {countdown.hours === 1 ? 'hour' : 'hours'} · {pad2(countdown.minutes)} {countdown.minutes === 1 ? 'minute' : 'minutes'} · {pad2(countdown.seconds)} seconds
              </p>
              <p className="mt-1 italic" style={{ fontSize: 17, color: C.faint }}>until the Nikah</p>
            </Reveal>
          )}

          {/* ── The functions, a niche each ─────────────────────────── */}
          <Frieze />
          <section id={ids.functions} className="px-5 pb-16 pt-14" style={{ background: C.wall, backgroundImage: WALL_SOFT, backgroundSize: '48px 48px', scrollMarginTop: 52 }}>
            <div className="mx-auto max-w-[27rem]">
              <Reveal disabled={isPreview}>
                <SectionTitle dark size={functions.length > 2 ? 'clamp(24px, 7.6cqi, 34px)' : undefined}>{fnTitle}</SectionTitle>
              </Reveal>
              <div className="mt-10 space-y-6">
                {functions.map((fn, i) => {
                  const d = dateParts(fn.date)
                  const t = timeLabel(fn.time)
                  const main = /nikah|nikaah|aqd/i.test(fn.name)
                  const fnPlace = [fn.venue || data.venue, data.venueAddress].filter(Boolean).join(', ')
                  const cal = calendarHref(`${fn.name} — ${couple}`, fn.date, fn.time, fnPlace || undefined, 3)
                  const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : directions
                  return (
                    <Reveal key={`${fn.name}-${i}`} disabled={isPreview} delay={i * 60}>
                      <Niche
                        fill={C.card}
                        line={main ? C.gold : C.goldHair}
                        head={0.36}
                        crown={<Motif kind={motifFor(fn.name)} className="mb-[-4px] h-[clamp(60px,19cqi,76px)] w-[clamp(60px,19cqi,76px)]" />}
                      >
                        <div className="px-[8cqi] pb-[9cqi] pt-3 text-center">
                          <h3 className="text-balance leading-[1.15]" style={{ fontSize: 'clamp(26px, 8cqi, 32px)', color: C.ink }}>{fn.name}</h3>
                          <p className="mt-2 leading-[1.35]" style={{ fontSize: 19, color: C.ink }}>
                            {d ? `${d.weekday}, ${d.day} ${d.month}` : 'Date to follow'}
                          </p>
                          {t && <p className="leading-[1.35]" style={{ fontSize: 19, fontWeight: 700, color: C.ink }}>{t}</p>}
                          {fn.venue && <p className="mt-2 text-balance italic leading-[1.35]" style={{ fontSize: 18, color: C.soft }}>{fn.venue}</p>}
                          {fn.dress && (
                            <p className="mt-2 text-balance leading-[1.35]" style={{ fontSize: 16, color: C.faint }}>
                              Dress · <span style={{ color: C.soft }}>{fn.dress}</span>
                            </p>
                          )}
                          {(cal || dir) && (
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                              {cal && <Pill href={cal} isPreview={isPreview} kind="cal">Add to calendar</Pill>}
                              {dir && <Pill href={dir} isPreview={isPreview} kind="map">Directions</Pill>}
                            </div>
                          )}
                        </div>
                      </Niche>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </section>
          <Frieze flip />

          {/* ── Our story ───────────────────────────────────────────── */}
          {story.length > 0 && (
            <section id={ids.story} className="px-6 pb-8 pt-16" style={{ scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[28rem]">
                <Reveal disabled={isPreview}>
                  <SectionTitle>Our story</SectionTitle>
                </Reveal>
                <ol className="relative mt-10">
                  <span aria-hidden className="absolute bottom-3 top-3 w-[5px]" style={{ left: 17, borderLeft: `1px solid ${C.goldHair}`, borderRight: `1px solid ${C.goldHair}` }} />
                  {story.map((m, i) => (
                    <Reveal as="li" key={i} disabled={isPreview} delay={i * 50} className="relative pb-9 pl-[54px] last:pb-0">
                      <svg viewBox="0 0 40 40" className="absolute left-0 top-0 h-[40px] w-[40px]" aria-hidden>
                        <path d={starPath(20, 20, 17)} fill={C.paper} stroke={C.gold} strokeWidth={1.1} />
                        <path d={starPath(20, 20, 9, 22.5)} fill={i === story.length - 1 ? C.gold : C.tealWash} stroke={C.gold} strokeWidth={0.8} />
                      </svg>
                      {m.when && <p className="leading-none tabular-nums" style={{ fontSize: 26, color: C.gold, paddingTop: 7 }}>{m.when}</p>}
                      <h3 className="mt-2 text-balance leading-[1.25]" style={{ fontSize: 22, color: C.ink }}>{m.title}</h3>
                      {m.text && <p className="mt-1.5 leading-[1.5]" style={{ fontSize: 17.5, color: C.soft }}>{m.text}</p>}
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* ── Photographs, as windows ─────────────────────────────── */}
          {photos.length > 0 && (
            <section className="px-5 pb-8 pt-16">
              <div className="mx-auto max-w-[30rem]">
                <Reveal disabled={isPreview}>
                  <SectionTitle>Moments</SectionTitle>
                </Reveal>
                <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-4">
                  {photos.map((src, i) => {
                    const big = i % 3 === 0
                    const aspect = big ? 0.8 : 0.72
                    const clip = archClip(aspect)
                    const inner = (
                      <div className="p-[1.5px]" style={{ background: C.gold, clipPath: clip }}>
                        <div className="p-[5px]" style={{ background: C.paper, clipPath: clip }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" loading="lazy" className="block w-full object-cover" style={{ aspectRatio: String(aspect), clipPath: clip }} />
                        </div>
                      </div>
                    )
                    return (
                      <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 70} className={big ? 'col-span-2 mx-auto w-[88%]' : ''}>
                        {isPreview ? (
                          inner
                        ) : (
                          <button type="button" className="sn-photo block w-full" aria-label={`Open photo ${i + 1}`} onClick={() => setShown(i)}>
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

          {/* ── For our guests ──────────────────────────────────────── */}
          {hasGuests && (
            <section id={ids.guests} className="px-6 pb-16 pt-16" style={{ scrollMarginTop: 52 }}>
              <div className="mx-auto max-w-[28rem]">
                <Reveal disabled={isPreview}>
                  <SectionTitle>For our guests</SectionTitle>
                </Reveal>
                <div className="mt-10 space-y-10">
                  {data.dressCode?.trim() && (
                    <Reveal disabled={isPreview}>
                      <GuestHead>What to wear</GuestHead>
                      <p className="mt-2 leading-[1.5]" style={{ fontSize: 18, color: C.soft }}>{data.dressCode}</p>
                    </Reveal>
                  )}
                  {travel.length > 0 && (
                    <Reveal disabled={isPreview}>
                      <GuestHead>Travel &amp; stay</GuestHead>
                      <div className="mt-2 space-y-3">
                        {travel.map((p, i) => (
                          <p key={i} className="leading-[1.55]" style={{ fontSize: 18, color: C.soft }}>{p}</p>
                        ))}
                      </div>
                    </Reveal>
                  )}
                  {contacts.length > 0 && (
                    <Reveal disabled={isPreview}>
                      <GuestHead>Who to call</GuestHead>
                      <ul className="mt-3 divide-y" style={{ borderColor: C.goldFaint }}>
                        {contacts.map((c, i) => {
                          const tel = telHref(c.phone)
                          const wa = whatsappHref(c.phone, `Assalamu alaikum, I'm writing about the Nikah of ${couple}.`)
                          return (
                            <li key={i} className="py-3" style={{ borderColor: C.goldFaint }}>
                              <p className="leading-[1.35]" style={{ fontSize: 19, color: C.ink }}>{c.name}</p>
                              {c.phone && <p className="tabular-nums" style={{ fontSize: 16, color: C.faint }}>{c.phone}</p>}
                              {(tel || wa) && (
                                <div className="mt-2.5 flex flex-wrap gap-2.5">
                                  {tel && <Pill href={tel} isPreview={isPreview} kind="tel">Call</Pill>}
                                  {wa && <Pill href={wa} isPreview={isPreview} kind="wa">WhatsApp</Pill>}
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </Reveal>
                  )}
                  {faq.length > 0 && (
                    <Reveal disabled={isPreview}>
                      <GuestHead>Questions</GuestHead>
                      <div className="mt-3" style={{ borderTop: `1px solid ${C.goldFaint}` }}>
                        {faq.map((q, i) => (
                          <details key={i} style={{ borderBottom: `1px solid ${C.goldFaint}` }}>
                            <summary className="flex items-start gap-3 py-3.5">
                              <svg viewBox="0 0 20 20" className="sn-q mt-[5px] h-[16px] w-[16px] shrink-0" aria-hidden>
                                <path d={starPath(10, 10, 9)} fill="none" stroke={C.gold} strokeWidth={1.2} />
                              </svg>
                              <span className="leading-[1.35]" style={{ fontSize: 19, color: C.ink }}>{q.q}</span>
                            </summary>
                            {q.a && <p className="pb-4 pl-7 leading-[1.55]" style={{ fontSize: 17.5, color: C.soft }}>{q.a}</p>}
                          </details>
                        ))}
                      </div>
                    </Reveal>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── RSVP ────────────────────────────────────────────────── */}
          <Frieze />
          <section id={ids.rsvp} className="px-6 py-16 text-center" style={{ background: C.wall, backgroundImage: WALL_SOFT, backgroundSize: '48px 48px', color: C.onDark, scrollMarginTop: 52 }}>
            <Reveal disabled={isPreview} className="mx-auto max-w-[26rem]">
              <SectionTitle dark sub={reply ? (rsvpBy ? `by ${rsvpBy.weekday}, the ${ordinalWords(rsvpBy.day)} of ${rsvpBy.month}` : undefined) : undefined}>
                {reply ? 'Kindly reply' : 'Save the date'}
              </SectionTitle>
              <p className="mt-6" style={{ fontSize: 'clamp(22px, 6.6cqi, 26px)', fontWeight: 700 }}>
                {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              <p className="mt-1 text-balance" style={{ fontSize: 18, color: C.onDarkSoft }}>
                {[venue, timeLabel(data.time)].filter(Boolean).join(' · ')}
              </p>
              <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                {reply && (
                  <DirectionsLink href={reply} isPreview={isPreview} className="sn-btn inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 hover:bg-[#EDD7A6]" style={{ background: C.goldLight, color: C.wallDeep, fontSize: 18, fontWeight: 700 }}>
                    <Glyph kind="wa" />
                    Reply on WhatsApp
                  </DirectionsLink>
                )}
                <DirectionsLink href={nikahCal} isPreview={isPreview} className="sn-btn inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 hover:bg-[rgba(244,235,215,0.08)]" style={{ border: '1px solid rgba(226,198,140,0.6)', color: C.onDark, fontSize: 17 }}>
                  <Glyph kind="cal" />
                  Add to calendar
                </DirectionsLink>
                {live && (
                  <DirectionsLink href={live} isPreview={isPreview} className="sn-btn inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 hover:bg-[rgba(244,235,215,0.08)]" style={{ border: '1px solid rgba(226,198,140,0.6)', color: C.onDark, fontSize: 17 }}>
                    <Glyph kind="live" />
                    Watch the Nikah live
                  </DirectionsLink>
                )}
              </div>
              {hashtag && (
                <div className="mt-10">
                  <Divider color={C.gold} width={110} className="mx-auto" />
                  <p className="mt-3 italic" style={{ fontSize: 17, color: C.onDarkFaint }}>Share your photographs with</p>
                  <p className="mt-1 break-words italic" style={{ fontSize: 'clamp(24px, 7.4cqi, 30px)', color: C.goldLight }}>{hashtag}</p>
                </div>
              )}
            </Reveal>
          </section>
          <Frieze flip />

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Duas for the couple"
              intro={`Leave a dua for ${bride} and ${groom}. It will appear here for every guest.`}
              noun="dua"
            />
          )}

          {/* ── Foot ────────────────────────────────────────────────── */}
          <footer className="relative overflow-hidden px-6 pb-10 pt-24 text-center" style={{ background: C.wallDeep, color: C.onDark }}>
            <Lantern chain={18} className="pointer-events-none absolute top-0 w-[30px]" style={{ left: 'calc(50% - 86px)' }} />
            <Lantern chain={34} variant={1} className="pointer-events-none absolute top-0 w-[27px]" style={{ left: 'calc(50% + 58px)' }} />
            <svg viewBox="0 0 40 40" className="mx-auto w-[34px]" aria-hidden><Crescent cx={20} cy={20} R={13} fill={C.goldLight} /></svg>
            <p className="mt-4" style={{ fontSize: 26 }}>
              {bride} <span className="italic" style={{ color: C.goldLight }}>&amp;</span> {groom}
            </p>
            {date && <p className="mt-1 tabular-nums" style={{ fontSize: 16, letterSpacing: '0.14em', color: C.onDarkFaint }}>{date.dayPadded} · {pad2(Number(data.date.slice(5, 7)))} · {date.year}</p>}
            <div className="mt-10">
              <Credit isPreview={isPreview} color={C.onDarkFaint} linkColor={C.onDarkSoft} />
            </div>
          </footer>
        </>
      )}

      {shown !== null && photos[shown] && <Lightbox photos={photos} index={shown} onClose={closeBox} onStep={stepBox} />}
    </div>
  )
}

function GuestHead({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 leading-[1.2]" style={{ fontFamily: serif, fontSize: 24, color: C.ink }}>
      <svg viewBox="0 0 20 20" className="h-[14px] w-[14px] shrink-0" aria-hidden>
        <path d={starPath(10, 10, 9.5)} fill={C.gold} />
      </svg>
      {children}
    </h3>
  )
}
