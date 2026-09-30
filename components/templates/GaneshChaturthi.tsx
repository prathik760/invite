'use client'

import { useMemo } from 'react'
import WishesSection from './WishesSection'
import { tiro } from './kit/fonts/tiro'
import { mukta } from './kit/fonts/mukta'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Ganesh Chaturthi — the household mandap.
 * A painted mandap frames Bappa: a vermilion canopy with its saffron jhalar,
 * a cusped arch, marigold ladis down the pillars and a mango-leaf toran; a
 * plate of modaks at his feet. Below it the invitation is set like a family
 * festival card, the shloka on its own card, and the visarjan kept apart as
 * the farewell it is. The ladis unfurl and the arch is traced on arrival.
 */

const C = {
  paper: '#F9EFDD',
  card: '#FFF8EB',
  ink: '#46190F',
  soft: 'rgba(70,25,15,0.74)',
  faint: 'rgba(70,25,15,0.52)',
  saffron: '#E1791C',
  saffronLight: '#FBE2BD',
  vermilion: '#B3261D',
  vermDeep: '#8C1B14',
  marigold: '#F1A526',
  marigoldDeep: '#DC7F19',
  durva: '#5C7C2C',
  leaf: '#50712F',
  rule: '#E8CDA3',
}

const serif = tiro.style.fontFamily
const sans = mukta.style.fontFamily

const WISHES_THEME: InviteTheme = {
  // Transparent so the paper grain carries on under the wishes.
  bg: 'transparent',
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: C.rule,
  accent: C.vermilion,
  onAccent: '#FFF6E8',
  heading: serif,
  body: sans,
  headingStyle: { fontSize: 32, color: C.ink },
}

// ── Seeded irregularity ─────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const f1 = (n: number) => n.toFixed(1)

function leafPath(len: number, width: number, bend = 0) {
  const w = width / 2
  return `M0 0 C${f1(len * 0.3)} ${f1(-w * 1.2 + bend)} ${f1(len * 0.72)} ${f1(-w + bend)} ${f1(len)} ${f1(bend * 0.6)} C${f1(len * 0.7)} ${f1(w + bend * 0.4)} ${f1(len * 0.28)} ${f1(w * 1.1)} 0 0Z`
}

/** A ruffled marigold head centred on the origin. */
function marigoldPath(r: number, seed: number) {
  const rand = rng(seed)
  const n = 22
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = r * (0.9 + 0.1 * Math.cos(a * 11) + (rand() - 0.5) * 0.08)
    d += `${i === 0 ? 'M' : 'L'}${f1(rr * Math.cos(a))} ${f1(rr * Math.sin(a))}`
  }
  return `${d}Z`
}

// ── The mandap, drawn in a 320×400 box ─────────────────────────────────────
const VB = { w: 320, h: 400 }
const OPEN = { x0: 46, x1: 274, spring: 196, apex: 72, bottom: 368, top: 58 }

type Pt = [number, number]

/** A cusped (multifoil) arch: seven lobes along a pointed arch, sides dropping to `bottom`. */
function cuspedArch(x0: number, x1: number, spring: number, apex: number, bottom: number, depth: number): string {
  const cx = (x0 + x1) / 2
  const bez = (t: number): Pt => {
    const p0: Pt = [x0, spring], p1: Pt = [x0, spring - (spring - apex) * 0.6]
    const p2: Pt = [x0 + (cx - x0) * 0.42, apex + (spring - apex) * 0.08], p3: Pt = [cx, apex]
    const u = 1 - t
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]
  }
  const left = [0, 0.3, 0.57, 0.82].map(bez)
  const right = left.map(([x, y]) => [2 * cx - x, y] as Pt).reverse()
  const pts = [...left, ...right]
  const centre: Pt = [cx, spring + 40]
  let d = `M${x0} ${bottom}L${f1(pts[0][0])} ${f1(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
    const mx = (ax + bx) / 2, my = (ay + by) / 2
    if (i === 3) {
      // The crown: two half-lobes rising to a soft point.
      const tip: Pt = [cx, apex - depth * 0.9]
      d += `Q${f1(ax + (cx - ax) * 0.25)} ${f1(tip[1] - 2)} ${f1(tip[0])} ${f1(tip[1])}`
      d += `Q${f1(bx - (bx - cx) * 0.25)} ${f1(tip[1] - 2)} ${f1(bx)} ${f1(by)}`
      continue
    }
    let nx = -(by - ay), ny = bx - ax
    const len = Math.hypot(nx, ny)
    nx /= len
    ny /= len
    if (nx * (mx - centre[0]) + ny * (my - centre[1]) < 0) {
      nx = -nx
      ny = -ny
    }
    d += `Q${f1(mx + nx * depth)} ${f1(my + ny * depth)} ${f1(bx)} ${f1(by)}`
  }
  return `${d}L${x1} ${bottom}Z`
}

const INNER_ARCH = cuspedArch(OPEN.x0, OPEN.x1, OPEN.spring, OPEN.apex, OPEN.bottom, 9)
const OUTER_ARCH = cuspedArch(OPEN.x0 - 11, OPEN.x1 + 11, OPEN.spring, OPEN.apex - 13, OPEN.bottom, 9)

/** The inner arch re-expressed in the opening's own 0–1 box, for clipping the photo. */
const ARCH_CLIP = INNER_ARCH.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => {
  const w = OPEN.x1 - OPEN.x0, h = OPEN.bottom - OPEN.top
  return `${((Number(x) - OPEN.x0) / w).toFixed(4)} ${((Number(y) - OPEN.top) / h).toFixed(4)}`
})

const JHALAR = (() => {
  let d = ''
  for (let x = 0; x < VB.w; x += 12) d += `M${x} 30a6 6 0 0 0 12 0Z`
  return d
})()

// Marigold ladis hanging down the pillars.
const LADI = Array.from({ length: 13 }, (_, i) => ({ y: 44 + i * 17.5, r: 7.4 - i * 0.12, tone: i % 2 }))

// Toran strung under the canopy.
const TORAN = (() => {
  const r = rng(29)
  const p0: Pt = [14, 42], p1: Pt = [160, 60], p2: Pt = [306, 42]
  const at = (t: number): Pt => {
    const u = 1 - t
    return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]
  }
  const n = 15
  return {
    cord: `M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`,
    leaves: Array.from({ length: n }, (_, i) => {
      const [x, y] = at((i + 0.5) / n)
      return { x, y, a: 90 + (r() - 0.5) * 18, len: 17 + r() * 4, w: 7.5 + r() * 1.5, bend: (r() - 0.5) * 3 }
    }),
    flowers: Array.from({ length: n + 1 }, (_, i) => {
      const [x, y] = at(i / n)
      return { x, y, r: 4.6 + r() * 0.8, tone: i % 2 }
    }),
  }
})()

const MARIGOLD = [marigoldPath(10, 3), marigoldPath(10, 8), marigoldPath(10, 13)]

function Marigold({ x, y, r, tone, seed = 0 }: { x: number; y: number; r: number; tone: number; seed?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${(r / 10).toFixed(3)})`}>
      <path d={MARIGOLD[seed % 3]} fill={tone ? C.marigold : C.marigoldDeep} stroke={C.ink} strokeWidth={0.9} />
      <circle r={4.2} fill={tone ? C.marigoldDeep : '#C8651A'} opacity={0.75} />
    </g>
  )
}

function Modak({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 26" className={className} style={style} aria-hidden>
      <path d="M12 1.5C13.6 5.4 21 11 21 17.6 21 22 17 24.6 12 24.6S3 22 3 17.6C3 11 10.4 5.4 12 1.5Z" fill="#FFF3DD" stroke={C.vermDeep} strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M12 1.5C10.2 9 7.6 15 7.8 24M12 1.5C11.4 10 10.9 17 11.1 24.6M12 1.5C13 10 14 17 14.6 24.4M12 1.5C14.6 9 17 15 17.4 23.4" fill="none" stroke={C.vermDeep} strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
    </svg>
  )
}

function Durva({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 26" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden>
      <g fill="none" stroke={C.durva} strokeWidth={1.4} strokeLinecap="round">
        <path d="M12 25C11 17 8.2 9.6 3.6 3.4" />
        <path d="M12 25C12.1 16 12.6 8.4 13.4 1.2" />
        <path d="M12 25C13.2 18 16 12.2 20.6 7" />
        <path d="M12 25C10.6 20.4 8.4 17.4 5.4 15.2" />
      </g>
    </svg>
  )
}

/** Durva, modak, durva — the section mark. */
function Offering({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-1.5 ${className}`} aria-hidden>
      <Durva className="h-[22px] w-[20px]" />
      <Modak className="h-[28px] w-[26px]" />
      <Durva className="h-[22px] w-[20px]" flip />
    </div>
  )
}

function Mandap({ photo, alt, animate }: { photo: string; alt: string; animate: boolean }) {
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`
  const drop = (i: number) => (animate ? { className: 'gc-drop', style: { animationDelay: `${300 + i * 55}ms` } } : {})
  return (
    <div className="relative mx-auto w-[min(86%,330px)]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id="gc-arch" clipPathUnits="objectBoundingBox">
          <path d={ARCH_CLIP} />
        </clipPath>
      </svg>

      {/* What sits inside the arch: Bappa's photo, or a painted ॐ on a lotus. */}
      <div
        className={`absolute overflow-hidden ${animate ? 'gc-fade' : ''}`}
        style={{
          left: pct(OPEN.x0, VB.w),
          width: pct(OPEN.x1 - OPEN.x0, VB.w),
          top: pct(OPEN.top, VB.h),
          height: pct(OPEN.bottom - OPEN.top, VB.h),
          clipPath: 'url(#gc-arch)',
          background: C.saffronLight,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 228 310" className="h-full w-full" aria-hidden>
            <text x="114" y="176" textAnchor="middle" fontSize="118" fill={C.vermilion} style={{ fontFamily: serif }}>
              ॐ
            </text>
            <g transform="translate(114 236)" fill="none" stroke={C.vermDeep} strokeWidth={1.3} strokeLinejoin="round">
              <path d="M0 -22C9 -12 9 2 0 10C-9 2 -9 -12 0 -22Z" fill={C.marigold} />
              <path d="M-4 8C-14 4 -22 -6 -24 -16C-12 -14 -4 -8 -1 2" fill={C.saffron} />
              <path d="M4 8C14 4 22 -6 24 -16C12 -14 4 -8 1 2" fill={C.saffron} />
              <path d="M-6 10C-20 12 -34 6 -42 -2C-28 -6 -14 -2 -4 6" fill={C.marigoldDeep} />
              <path d="M6 10C20 12 34 6 42 -2C28 -6 14 -2 4 6" fill={C.marigoldDeep} />
              <path d="M-40 14C-20 20 20 20 40 14" />
            </g>
            <g transform="translate(40 256)" fill="none" stroke={C.durva} strokeWidth={1.4} strokeLinecap="round">
              <path d="M12 25C11 17 8.2 9.6 3.6 3.4M12 25C12.1 16 12.6 8.4 13.4 1.2M12 25C13.2 18 16 12.2 20.6 7M12 25C10.6 20.4 8.4 17.4 5.4 15.2" />
            </g>
            <g transform="translate(188 256) scale(-1 1)" fill="none" stroke={C.durva} strokeWidth={1.4} strokeLinecap="round">
              <path d="M12 25C11 17 8.2 9.6 3.6 3.4M12 25C12.1 16 12.6 8.4 13.4 1.2M12 25C13.2 18 16 12.2 20.6 7M12 25C10.6 20.4 8.4 17.4 5.4 15.2" />
            </g>
          </svg>
        )}
      </div>

      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
        {/* spandrels and pillars, painted cream */}
        <path d={`M8 30H312V${OPEN.bottom}H8Z ${OUTER_ARCH}`} fillRule="evenodd" fill={C.card} />
        {/* the arch band */}
        <path d={`${OUTER_ARCH} ${INNER_ARCH}`} fillRule="evenodd" fill={C.vermilion} />
        <path d={INNER_ARCH} fill="none" stroke={C.marigold} strokeWidth={2} pathLength={1} className={animate ? 'gc-draw' : undefined} />
        <path d={OUTER_ARCH} fill="none" stroke={C.ink} strokeWidth={1} />
        {/* spandrel dots */}
        <g fill={C.saffron}>
          {[
            [56, 86], [70, 74], [48, 104], [264, 86], [250, 74], [272, 104],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} />
          ))}
        </g>
        {/* pillars */}
        <g fill="none" stroke={C.ink} strokeWidth={1}>
          <path d={`M8 30V${OPEN.bottom}M34 60V${OPEN.bottom}M286 60V${OPEN.bottom}M312 30V${OPEN.bottom}`} />
          <path d={`M4 ${OPEN.bottom - 18}H38V${OPEN.bottom}H4ZM282 ${OPEN.bottom - 18}H316V${OPEN.bottom}H282Z`} fill={C.saffronLight} />
          <path d={`M21 ${OPEN.bottom - 18}V60M299 ${OPEN.bottom - 18}V60`} opacity={0.35} />
        </g>
        {/* canopy with its jhalar */}
        <path d="M0 0H320V30H0Z" fill={C.vermilion} />
        <path d="M0 7H320M0 23H320" stroke={C.marigold} strokeWidth={1.2} strokeDasharray="1 5" strokeLinecap="round" />
        <path d={JHALAR} fill={C.saffron} stroke={C.ink} strokeWidth={0.8} />
        {/* ladis */}
        {[21, 299].map((x, side) => (
          <g key={x}>
            <path d={`M${x} 30V${LADI[LADI.length - 1].y}`} stroke={C.ink} strokeWidth={0.8} />
            {LADI.map((m, i) => (
              <g key={i} {...drop(i)}>
                <Marigold x={x} y={m.y} r={m.r} tone={(m.tone + side) % 2} seed={i + side} />
              </g>
            ))}
            <g {...drop(LADI.length)}>
              <path d={leafPath(18, 8)} transform={`translate(${x} ${LADI[LADI.length - 1].y + 5}) rotate(90)`} fill={C.leaf} stroke={C.ink} strokeWidth={0.8} />
            </g>
          </g>
        ))}
        {/* toran */}
        <path d={TORAN.cord} fill="none" stroke={C.ink} strokeWidth={1} />
        {TORAN.leaves.map((l, i) => (
          <g key={i} transform={`translate(${f1(l.x)} ${f1(l.y)}) rotate(${f1(l.a)})`}>
            <g {...(animate ? { className: 'gc-leaf', style: { animationDelay: `${900 + Math.abs(i - 7) * 60}ms` } } : {})}>
              <path d={leafPath(l.len, l.w, l.bend)} fill={C.leaf} stroke={C.ink} strokeWidth={0.8} strokeLinejoin="round" />
              <path d={`M1 0L${f1(l.len * 0.8)} ${f1(l.bend * 0.4)}`} stroke={C.card} strokeWidth={0.6} opacity={0.7} />
            </g>
          </g>
        ))}
        {TORAN.flowers.map((m, i) => (
          <Marigold key={i} x={m.x} y={m.y} r={m.r} tone={m.tone} seed={i} />
        ))}
        {/* plinth */}
        <path d={`M0 ${OPEN.bottom}H320V${OPEN.bottom + 14}H0Z`} fill={C.saffronLight} stroke={C.ink} strokeWidth={1} />
        <path d={`M-6 ${OPEN.bottom + 14}H326V${OPEN.bottom + 26}H-6Z`} fill={C.rule} stroke={C.ink} strokeWidth={1} />
        {/* a plate of modaks at Bappa's feet */}
        <g transform={`translate(160 ${OPEN.bottom + 2})`}>
          <path d="M-36 0C-30 9 30 9 36 0Z" fill={C.marigold} stroke={C.ink} strokeWidth={1} />
          {[-19, 0, 19].map((x, i) => (
            <g key={x} transform={`translate(${x - 9} ${i === 1 ? -25 : -21}) scale(0.76)`}>
              <path d="M12 1.5C13.6 5.4 21 11 21 17.6 21 22 17 24.6 12 24.6S3 22 3 17.6C3 11 10.4 5.4 12 1.5Z" fill="#FFF3DD" stroke={C.vermDeep} strokeWidth={1.3} />
              <path d="M12 1.5C10.2 9 7.6 15 7.8 24M12 1.5C11.4 10 10.9 17 11.1 24.6M12 1.5C13 10 14 17 14.6 24.4M12 1.5C14.6 9 17 15 17.4 23.4" fill="none" stroke={C.vermDeep} strokeWidth={0.9} opacity={0.7} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center leading-[1.1]" style={{ fontFamily: serif, fontSize: 'clamp(30px, 9cqi, 38px)', color: C.ink }}>
      {children}
    </h2>
  )
}

const hasDevanagari = (s: string) => /[ऀ-ॿ]/.test(s)

export default function GaneshChaturthi({ data, eventId, isPreview = false }: InviteProps) {
  const hosts = data.hostNames?.trim() || 'The Joshi Family'
  const tagline = data.tagline?.trim()
  const title = data.title?.trim() || 'Ganesh Chaturthi'
  const subtitle = data.subtitle?.trim()
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const visarjan = dateParts(data.visarjanDate)
  const visarjanTime = timeLabel(data.visarjanTime)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const shloka = useMemo(() => parseLines(data.invocation), [data.invocation])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const featured = useMemo(
    () =>
      parseLines(data.sampleWishes)
        .map((line) => {
          const [name = '', ...rest] = line.split('|')
          return { name: name.trim(), message: rest.join('|').trim() }
        })
        .filter((w) => w.name && w.message),
    [data.sampleWishes],
  )
  const idol = data.idolImage && /^(https?:)?\//.test(data.idolImage) ? data.idolImage : ''
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(`${title} — ${hosts}`, data.date, data.time, place || undefined)
  const animate = !isPreview

  const button = 'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors'

  return (
    <div
      className="gc relative overflow-x-hidden"
      style={{ background: C.paper, color: C.ink, fontFamily: sans, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .gc .gc-drop { opacity: 0; transform: translateY(-14px); animation: gc-drop 620ms cubic-bezier(.2,.8,.3,1.2) forwards; }
        .gc .gc-leaf { opacity: 0; transform: translateX(-5px); animation: gc-drop 520ms cubic-bezier(.2,.7,.2,1) forwards; }
        .gc .gc-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: gc-draw 1.6s cubic-bezier(.45,.1,.3,1) forwards 200ms; }
        .gc .gc-fade { opacity: 0; animation: gc-fade 900ms ease forwards 500ms; }
        .gc .gc-in { opacity: 0; transform: translateY(8px); animation: gc-drop 900ms cubic-bezier(.2,.7,.2,1) forwards; }
        .gc .gc-btn:hover { background: ${C.vermDeep}; }
        .gc .gc-btn-line:hover { background: rgba(179,38,29,0.06); }
        @keyframes gc-drop { to { opacity: 1; transform: none; } }
        @keyframes gc-draw { to { stroke-dashoffset: 0; } }
        @keyframes gc-fade { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .gc .gc-drop, .gc .gc-leaf, .gc .gc-draw, .gc .gc-fade, .gc .gc-in { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.vermDeep} background="rgba(255,248,235,0.9)" border={C.rule} />

      {/* ── The mandap ────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[32rem] pb-12 text-center" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <Mandap photo={idol} alt={`Ganpati Bappa at ${hosts}`} animate={animate} />

        <div className="px-6">
          {tagline && (
            <p className="gc-in mt-8 italic" style={{ fontFamily: serif, fontSize: 20, color: C.vermilion, animationDelay: '600ms' }}>
              {tagline}
            </p>
          )}
          <h1
            className={`gc-in leading-[1.02] ${tagline ? 'mt-2' : 'mt-8'}`}
            style={{ fontFamily: serif, fontSize: 'clamp(36px, 10.4cqi, 56px)', color: C.ink, animationDelay: '700ms' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="gc-in mx-auto mt-3 max-w-[21rem] text-balance leading-[1.5]" style={{ fontSize: 17, color: C.soft, animationDelay: '800ms' }}>
              {subtitle}
            </p>
          )}

          <div className="gc-in mt-7" style={{ animationDelay: '850ms' }}>
            <Offering />
          </div>

          <div className="gc-in mt-6" style={{ animationDelay: '900ms' }}>
            <p className="leading-[1.15]" style={{ fontFamily: serif, fontSize: 'clamp(24px, 7cqi, 29px)', color: C.vermDeep }}>
              {hosts}
            </p>
            <p className="mx-auto mt-1.5 max-w-[20rem] text-balance leading-[1.5]" style={{ fontSize: 17, color: C.soft }}>
              invite you and your family home for Bappa&rsquo;s sthapana
            </p>
          </div>

          <div className="gc-in mx-auto mt-7 max-w-[22rem] border-y py-5" style={{ borderColor: C.rule, animationDelay: '1000ms' }}>
            <p className="leading-[1.15]" style={{ fontFamily: serif, fontSize: 'clamp(24px, 7.4cqi, 30px)' }}>
              {date ? (
                <>
                  {date.weekday},
                  <br />
                  {date.day} {date.month} {date.year}
                </>
              ) : (
                'Date to be announced'
              )}
            </p>
            {time && (
              <p className="mt-2" style={{ fontSize: 17, color: C.soft }}>
                Sthapana muhurat <span style={{ fontWeight: 600, color: C.vermilion }}>{time}</span>
              </p>
            )}
          </div>

          <div className="gc-in mt-6" style={{ animationDelay: '1100ms' }}>
            <p className="italic" style={{ fontFamily: serif, fontSize: 17, color: C.faint }}>at</p>
            <p className="leading-[1.2]" style={{ fontFamily: serif, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>
              {data.venue || 'our home'}
            </p>
            {data.venueAddress && (
              <p className="mx-auto mt-1.5 max-w-[20rem] text-balance leading-[1.45]" style={{ fontSize: 16, color: C.soft }}>
                {data.venueAddress}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[32rem] px-6">
        {/* ── The shloka card ────────────────────────────────────── */}
        {shloka.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="pb-14 pt-4">
            <div className="relative px-5 pb-9 pt-10 text-center" style={{ background: C.card, boxShadow: '0 18px 40px -30px rgba(70,25,15,0.5)' }}>
              <span aria-hidden className="pointer-events-none absolute inset-[7px] border" style={{ borderColor: C.vermilion }} />
              <span aria-hidden className="pointer-events-none absolute inset-[11px] border" style={{ borderColor: 'rgba(179,38,29,0.35)' }} />
              <div className="absolute left-1/2 top-[9px] -translate-x-1/2 -translate-y-1/2 px-2" style={{ background: C.card }}>
                <Modak className="block h-[28px] w-[26px]" />
              </div>
              <div className="relative space-y-3">
                {shloka.map((line, i) =>
                  hasDevanagari(line) ? (
                    <p key={i} lang="sa" className="leading-[1.5]" style={{ fontFamily: serif, fontSize: 'clamp(21px, 6cqi, 25px)', color: C.vermilion }}>
                      {line}
                    </p>
                  ) : (
                    <p key={i} className="text-balance italic leading-[1.45]" style={{ fontFamily: serif, fontSize: 'clamp(18px, 5.4cqi, 21px)' }}>
                      {line}
                    </p>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* ── A word from the family ─────────────────────────────── */}
        {data.message && (
          <Reveal disabled={isPreview} as="section" className="pb-14 pt-2 text-center">
            <p className="mx-auto max-w-[25rem] text-balance leading-[1.6]" style={{ fontSize: 19 }}>
              {data.message}
            </p>
            <p className="mt-4 italic" style={{ fontFamily: serif, fontSize: 19, color: C.vermilion }}>
              — {hosts}
            </p>
          </Reveal>
        )}

        {/* ── Countdown ──────────────────────────────────────────── */}
        {countdown && (
          <Reveal disabled={isPreview} as="section" className="border-t py-12 text-center" style={{ borderColor: C.rule }}>
            <div className="flex items-end justify-center gap-4">
              <Durva className="mb-2 h-[30px] w-[26px]" />
              <span className="leading-[0.8]" style={{ fontFamily: serif, fontSize: 84, color: C.vermilion }}>
                {countdown.days}
              </span>
              <Durva className="mb-2 h-[30px] w-[26px]" flip />
            </div>
            <p className="mt-4 italic" style={{ fontFamily: serif, fontSize: 21 }}>
              {countdown.days === 1 ? 'day' : 'days'} until Bappa comes home
            </p>
            <p className="mt-1.5 tabular-nums" style={{ fontSize: 14, color: C.faint, letterSpacing: '0.04em' }}>
              {countdown.hours} h · {pad2(countdown.minutes)} m · {pad2(countdown.seconds)} s
            </p>
          </Reveal>
        )}

        {/* ── Utsav schedule, strung like a ladi ─────────────────── */}
        {schedule.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="border-t py-14" style={{ borderColor: C.rule }}>
            <Heading>Utsav schedule</Heading>
            <ol className="relative mx-auto mt-9 w-fit max-w-full pr-2">
              <span aria-hidden className="absolute bottom-4 left-[11px] top-4 w-px" style={{ background: C.saffron, opacity: 0.6 }} />
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`} className="relative grid grid-cols-[23px_1fr] gap-4 py-3">
                  <svg viewBox="-12 -12 24 24" className="relative mt-[3px] h-[23px] w-[23px]" aria-hidden>
                    <Marigold x={0} y={0} r={10.5} tone={i % 2} seed={i} />
                  </svg>
                  <div>
                    {item.time && (
                      <p className="tabular-nums" style={{ fontSize: 15, fontWeight: 600, color: C.vermilion }}>
                        {item.time}
                      </p>
                    )}
                    <p className="leading-[1.3]" style={{ fontFamily: serif, fontSize: 21 }}>
                      {item.title}
                    </p>
                    {item.note && (
                      <p className="mt-1 leading-[1.45]" style={{ fontSize: 15, color: C.soft }}>
                        {item.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* ── Darshan ───────────────────────────────────────────── */}
        <Reveal disabled={isPreview} as="section" className="border-t py-14 text-center" style={{ borderColor: C.rule }}>
          <Heading>Darshan</Heading>
          <p className="mt-6 leading-[1.2]" style={{ fontFamily: serif, fontSize: 'clamp(24px, 7cqi, 29px)', color: C.vermDeep }}>
            {data.venue || 'At our home'}
          </p>
          {data.venueAddress && (
            <p className="mx-auto mt-2 max-w-[20rem] text-balance leading-[1.5]" style={{ fontSize: 16, color: C.soft }}>
              {data.venueAddress}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className={`gc-btn ${button}`}
              style={{ background: C.vermilion, color: '#FFF6E8' }}
            >
              Get directions
            </DirectionsLink>
            {calendar && (
              <a
                href={isPreview ? undefined : calendar}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={isPreview || undefined}
                className={`gc-btn-line ${button} border`}
                style={{ borderColor: C.vermilion, color: C.vermilion }}
              >
                Add to calendar
              </a>
            )}
          </div>

          {(data.pooja || data.dressCode) && (
            <dl className="mx-auto mt-10 max-w-[24rem] space-y-6">
              {data.pooja && (
                <div>
                  <dt className="italic" style={{ fontFamily: serif, fontSize: 18, color: C.vermilion }}>Pooja &amp; aarti</dt>
                  <dd className="mt-1 text-balance leading-[1.5]" style={{ fontSize: 17 }}>{data.pooja}</dd>
                </div>
              )}
              {data.dressCode && (
                <div>
                  <dt className="italic" style={{ fontFamily: serif, fontSize: 18, color: C.vermilion }}>What to wear</dt>
                  <dd className="mt-1 text-balance leading-[1.5]" style={{ fontSize: 17 }}>{data.dressCode}</dd>
                </div>
              )}
            </dl>
          )}
        </Reveal>
      </div>

      {/* ── Visarjan, kept apart ───────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="relative overflow-hidden px-6 pb-20 pt-14 text-center" style={{ background: C.saffronLight }}>
        <div className="mx-auto max-w-[30rem]">
          <Heading>Visarjan</Heading>
          <p className="mt-5 leading-[1.2]" style={{ fontFamily: serif, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>
            {visarjan ? `${visarjan.weekday}, ${visarjan.day} ${visarjan.month}` : 'Date to be announced'}
          </p>
          {visarjanTime && (
            <p className="mt-2" style={{ fontSize: 17, color: C.soft }}>
              The procession leaves at <span style={{ fontWeight: 600, color: C.vermilion }}>{visarjanTime}</span>
            </p>
          )}
          <p className="mx-auto mt-5 max-w-[20rem] text-balance italic leading-[1.5]" style={{ fontFamily: serif, fontSize: 18, color: C.vermDeep }}>
            Ganpati Bappa Morya, pudhchya varshi lavkar ya.
          </p>
        </div>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[34px] w-full" aria-hidden>
          <path d="M0 14C25 6 50 6 75 14S125 22 150 14 200 6 225 14 275 22 300 14 350 6 400 14" fill="none" stroke={C.saffron} strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
          <path d="M0 26C25 18 50 18 75 26S125 34 150 26 200 18 225 26 275 34 300 26 350 18 400 26" fill="none" stroke={C.vermilion} strokeWidth={1.3} vectorEffect="non-scaling-stroke" opacity={0.6} />
        </svg>
      </Reveal>

      {/* ── Photographs ───────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 py-14">
          <Reveal disabled={isPreview}>
            <Offering className="mb-5" />
            <Heading>From our mandap</Heading>
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-2.5">
            {photos.map((src, i) => (
              <Reveal
                key={`${src}-${i}`}
                disabled={isPreview}
                delay={(i % 2) * 80}
                className={i === 0 || (i === photos.length - 1 && photos.length % 2 === 0) ? 'col-span-2' : ''}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className={`w-full object-cover ${i === 0 ? 'aspect-[4/5]' : i === photos.length - 1 && photos.length % 2 === 0 ? 'aspect-[3/2]' : 'aspect-square'}`}
                  style={i === 0 ? { clipPath: 'url(#gc-arch)' } : { borderRadius: 3 }}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Blessings the family chose to share ─────────────────────── */}
      {featured.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] border-t px-6 py-14 text-center" style={{ borderColor: C.rule }}>
          <Heading>From family &amp; friends</Heading>
          <ul className="mt-8 space-y-8">
            {featured.map((w, i) => (
              <li key={`${w.name}-${i}`}>
                <p className="text-balance italic leading-[1.5]" style={{ fontFamily: serif, fontSize: 19 }}>
                  &ldquo;{w.message}&rdquo;
                </p>
                <p className="mt-2" style={{ fontSize: 15, fontWeight: 600, color: C.vermilion }}>
                  {w.name}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: C.rule }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Wishes for the family"
            intro="Leave a few words for the family. Every guest who opens this invitation will see them."
          />
        </div>
      )}

      <footer className="px-6 pb-10 pt-12 text-center">
        <Offering />
        <p className="mt-5 leading-[1.2]" style={{ fontFamily: serif, fontSize: 24 }}>
          {hosts}
        </p>
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.vermilion} />
        </div>
      </footer>
    </div>
  )
}
