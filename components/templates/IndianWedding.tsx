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
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Shaadi — a printed Indian wedding card (kankotri), set with restraint.
 * Cream stock, maroon ink, sindoor and marigold. A marigold-and-mango-leaf
 * toran hangs across the top and settles as if just tied up; below it a
 * mehrab-arched card opens with the Ganesh invocation and family wording.
 */

const C = {
  paper: '#F2E4CC',
  card: '#FBF4E6',
  maroon: '#5A1320',
  soft: 'rgba(90,19,32,0.74)',
  faint: 'rgba(90,19,32,0.52)',
  rule: 'rgba(90,19,32,0.2)',
  sindoor: '#A52A1E',
  marigold: '#DA8A22',
  mgLight: '#E8AA3C',
  mgDeep: '#B5621A',
  mgPale: '#F2C766',
  mgCore: '#8E3F12',
  leaf: '#4E6B2C',
  leafVein: '#7C9449',
  band: '#5A1320',
  bandInk: '#F6E8D0',
}

const display = tiro.style.fontFamily
const text = mukta.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.maroon,
  muted: C.soft,
  line: 'rgba(90,19,32,0.18)',
  accent: C.sindoor,
  onAccent: '#FFF6EA',
  heading: display,
  body: text,
  headingStyle: { fontSize: 32, fontWeight: 400 },
}

/* ── Seeded irregularity, so no two flowers or leaves are stamped alike ── */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A scalloped disc — the ruffled outline of a marigold head. */
function scallop(r: number, n: number) {
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([r * Math.cos(a), r * Math.sin(a)])
  }
  const br = (2 * r * Math.sin(Math.PI / n) * 0.62).toFixed(2)
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n]
    d += ` A${br} ${br} 0 0 1 ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
  }
  return `${d}Z`
}

const MG_RIM = scallop(7, 13)
const MG_MID = scallop(5.9, 11)
const MG_IN = scallop(3.6, 8)

/** A mango leaf hanging from its stalk at the origin, tip pointing down. */
function leafDown(len: number, w: number, bend: number) {
  const h = w / 2
  return `M0 0 C${h * 1.3} ${len * 0.22} ${h + bend} ${len * 0.7} ${bend} ${len} C${-h + bend} ${len * 0.7} ${-h * 1.3} ${len * 0.22} 0 0Z`
}

interface Flower { x: number; y: number; s: number; rot: number; v: 'a' | 'b' }
interface Leaf { x: number; y: number; len: number; w: number; rot: number; bend: number }

/* The toran is drawn 1:1 in px, centred, and cropped by the screen. */
const BAY = 92
const TORAN = (() => {
  const r = rng(23)
  const swags: Flower[] = []
  const leaves: Leaf[] = []
  const strands: { x: number; flowers: Flower[]; end: Leaf }[] = []
  for (let k = -8; k < 8; k++) {
    const x0 = k * BAY
    const x1 = x0 + BAY
    const mid = x0 + BAY / 2
    const sag = 19 + r() * 4
    for (const f of [0.2, 0.5, 0.8]) {
      leaves.push({
        x: x0 + BAY * f + (r() - 0.5) * 5,
        y: 7,
        len: (f === 0.5 ? 42 : 36) + r() * 7,
        w: 12 + r() * 3,
        rot: (r() - 0.5) * 16,
        bend: (r() - 0.5) * 3,
      })
    }
    const n = 11
    for (let i = 1; i < n; i++) {
      const t = i / n
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mid + t * t * x1
      const y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * (8 + 2 * sag) + t * t * 8
      swags.push({ x: x + (r() - 0.5) * 1.4, y: y + (r() - 0.5) * 1.4, s: 0.84 + r() * 0.2, rot: r() * 360, v: r() < 0.55 ? 'a' : 'b' })
    }
  }
  for (let k = -8; k <= 8; k++) {
    const count = k === 0 ? 5 : Math.abs(k) % 2 === 1 ? 3 : 4
    const flowers: Flower[] = []
    for (let i = 0; i < count; i++) {
      flowers.push({ x: k * BAY + (r() - 0.5) * 1.2, y: 14 + i * 10.4, s: 0.86 + r() * 0.14, rot: r() * 360, v: i % 2 === 0 ? 'a' : 'b' })
    }
    strands.push({
      x: k * BAY,
      flowers,
      end: { x: k * BAY, y: 14 + (count - 1) * 10.4 + 5, len: 20 + r() * 5, w: 8 + r() * 2, rot: (r() - 0.5) * 10, bend: (r() - 0.5) * 2 },
    })
  }
  return { swags, leaves, strands }
})()

function MarigoldDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <g id="iw-mg-a">
          <path d={MG_RIM} fill={C.mgDeep} />
          <path d={MG_MID} fill={C.marigold} transform="rotate(17)" />
          <path d={MG_IN} fill={C.mgLight} transform="rotate(8)" />
          <circle r={1.2} fill={C.mgCore} />
        </g>
        <g id="iw-mg-b">
          <path d={MG_RIM} fill={C.marigold} />
          <path d={MG_MID} fill={C.mgLight} transform="rotate(12)" />
          <path d={MG_IN} fill={C.mgPale} transform="rotate(30)" />
          <circle r={1.1} fill={C.mgDeep} />
        </g>
        {/* The mehrab (pointed arch) as a clip for photographs. */}
        <clipPath id="iw-mehrab" clipPathUnits="objectBoundingBox">
          <path d="M0 1 L0 0.34 C0 0.2 0.22 0.13 0.36 0.09 C0.44 0.066 0.48 0.045 0.5 0 C0.52 0.045 0.56 0.066 0.64 0.09 C0.78 0.13 1 0.2 1 0.34 L1 1 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}

function Bloom({ f }: { f: Flower }) {
  return <use href={`#iw-mg-${f.v}`} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)}) scale(${f.s.toFixed(2)})`} />
}

function MangoLeaf({ l, className, delay }: { l: Leaf; className?: string; delay?: number }) {
  return (
    <g transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)})`}>
      <g className={className} style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}>
        <g transform={`rotate(${l.rot.toFixed(1)})`}>
          <path d={leafDown(l.len, l.w, l.bend)} fill={C.leaf} />
          <path d={`M0 1.5 Q${(l.bend * 0.4).toFixed(1)} ${(l.len * 0.5).toFixed(1)} ${l.bend.toFixed(1)} ${(l.len * 0.93).toFixed(1)}`} stroke={C.leafVein} strokeWidth={0.7} fill="none" />
        </g>
      </g>
    </g>
  )
}

/** Bandhanwar across the top: mango leaves behind, marigold swags and strings in front. */
function Toran({ animate }: { animate: boolean }) {
  return (
    <svg
      viewBox="-760 0 1520 104"
      preserveAspectRatio="xMidYMin slice"
      className={`block h-[104px] w-full ${animate ? 'iw-toran' : ''}`}
      aria-hidden
    >
      {TORAN.leaves.map((l, i) => (
        <MangoLeaf key={`l${i}`} l={l} className={animate ? 'iw-sway' : undefined} delay={animate ? 500 + (i % 7) * 70 : undefined} />
      ))}
      {/* mauli — red cord with a marigold-yellow twist */}
      <line x1={-760} y1={7} x2={760} y2={7} stroke={C.sindoor} strokeWidth={2.6} />
      <line x1={-760} y1={7} x2={760} y2={7} stroke={C.mgLight} strokeWidth={1.1} strokeDasharray="2.5 3.5" />
      {TORAN.swags.map((f, i) => <Bloom key={`s${i}`} f={f} />)}
      {TORAN.strands.map((s, i) => (
        <g key={`t${i}`} transform={`translate(${s.x} 7)`}>
          <g className={animate ? 'iw-swing' : undefined} style={animate ? { animationDelay: `${420 + Math.abs(i - 8) * 60}ms` } : undefined}>
            <g transform={`translate(${-s.x} -7)`}>
              <line x1={s.x} y1={7} x2={s.x} y2={s.end.y} stroke={C.mgDeep} strokeWidth={0.8} />
              {s.flowers.map((f, j) => <Bloom key={j} f={f} />)}
              <MangoLeaf l={s.end} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}

/** Kalash with coconut and five mango leaves — sits under the arch's apex. */
function Kalash({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = (a: number, len: number) => (
    <path
      key={a}
      d={`M0 0 C${len * 0.3} -3.6 ${len * 0.7} -3.4 ${len} 0 C${len * 0.7} 3.4 ${len * 0.3} 3.6 0 0Z`}
      transform={`rotate(${a})`}
      fill={C.leaf}
    />
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="translate(0 13)">{[-168, -140, -40, -12].map((a, i) => leaf(a, i % 3 === 0 ? 15 : 13))}</g>
      <ellipse cx={0} cy={4} rx={7.2} ry={8.6} fill={C.mgDeep} />
      <path d="M-3 -3.6 C-1.5 -6.5 1.5 -6.5 3 -3.6" stroke={C.leaf} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <path d="M-2.5 5 Q0 8 2.5 5" stroke={C.mgCore} strokeWidth={0.6} fill="none" opacity={0.6} />
      <rect x={-10} y={12} width={20} height={3.4} rx={1.4} fill={C.maroon} />
      <path d="M-7 15.4 C-9 19 -16 21 -16 30 C-16 39 -8 43 -5 44 L-7 47 L7 47 L5 44 C8 43 16 39 16 30 C16 21 9 19 7 15.4Z" fill={C.sindoor} />
      <path d="M-15.3 27 H15.3" stroke={C.mgLight} strokeWidth={1.2} />
      <path d="M-15.8 31.5 H15.8" stroke={C.mgLight} strokeWidth={0.6} />
      {[-9, -3, 3, 9].map((cx) => <circle key={cx} cx={cx} cy={37} r={0.9} fill={C.mgLight} />)}
    </g>
  )
}

/** The arched card: fill, a maroon line and a sindoor inner line. */
function MehrabFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col">
      <svg viewBox="0 0 320 150" className="block w-full shrink-0" style={{ overflow: 'visible' }}>
        <path
          d="M1 150 L1 128 C1 76 64 56 112 44 C138 37 154 33 160 22 C166 33 182 37 208 44 C256 56 319 76 319 128 L319 150Z"
          fill={C.card}
        />
        <path
          d="M1 150 L1 128 C1 76 64 56 112 44 C138 37 154 33 160 22 C166 33 182 37 208 44 C256 56 319 76 319 128 L319 150"
          fill="none"
          stroke={C.maroon}
          strokeWidth={1.3}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M9.5 150 L9.5 130 C9.5 82 70 64 115 52.5 C139 46.5 153 42.5 160 33 C167 42.5 181 46.5 205 52.5 C250 64 310.5 82 310.5 130 L310.5 150"
          fill="none"
          stroke={C.sindoor}
          strokeWidth={0.8}
          vectorEffect="non-scaling-stroke"
        />
        {/* finial: a lotus bud on the apex */}
        <path d="M160 3 C164.5 9 164.5 15 160 20 C155.5 15 155.5 9 160 3Z" fill={C.sindoor} />
        <circle cx={160} cy={21.5} r={1.8} fill={C.maroon} />
        <Kalash x={160} y={62} s={0.78} />
      </svg>
      <div className="relative -mt-px flex-1">
        <span className="absolute inset-y-0" style={{ left: '0.3125%', right: '0.3125%', background: C.card }} />
        {/* Sides drawn by the same rasteriser as the arch, so the lines meet cleanly. */}
        <svg viewBox="0 0 320 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M1 0 V10 M319 0 V10" stroke={C.maroon} strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
        </svg>
        <svg viewBox="0 0 320 10" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full" style={{ height: 'calc(100% - 10px)' }}>
          <path d="M9.5 0 V10 M310.5 0 V10" stroke={C.sindoor} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute bottom-0 h-[1.3px]" style={{ left: '0.3125%', right: '0.3125%', background: C.maroon }} />
        <span className="absolute h-[0.8px]" style={{ left: '2.96875%', right: '2.96875%', bottom: 10, background: C.sindoor }} />
      </div>
    </div>
  )
}

/** A garland laid along an edge — the toran's marigolds, in a row. */
function MarigoldEdge({ className }: { className?: string }) {
  return (
    <svg className={`block h-[16px] w-full ${className ?? ''}`} aria-hidden>
      <defs>
        <pattern id="iw-edge" width="26" height="16" patternUnits="userSpaceOnUse">
          <use href="#iw-mg-a" transform="translate(6.5 8) rotate(20) scale(0.95)" />
          <use href="#iw-mg-b" transform="translate(19.5 8) rotate(-35) scale(0.95)" />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill="url(#iw-edge)" />
    </svg>
  )
}

function Paisley({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className={className} style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      <path d="M22 62 C8 62 2 50 4 40 C6 28 18 22 26 16 C32 11 34 5 30 1 C40 4 46 14 45 26 C44 46 36 62 22 62Z" fill="none" stroke={C.sindoor} strokeWidth={1} />
      <path d="M22 55.5 C13.5 55.5 9.5 48 11 40.5 C12.5 33 21 29 27.5 24.5 C33 21 38.5 25 38.5 32 C38.5 45 32 55.5 22 55.5Z" fill="rgba(218,138,34,0.16)" stroke={C.marigold} strokeWidth={0.8} />
      <circle cx={24} cy={41} r={4.2} fill="none" stroke={C.maroon} strokeWidth={0.8} />
      <circle cx={24} cy={41} r={1.4} fill={C.maroon} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (-110 + i * 40) * (Math.PI / 180)
        return <circle key={i} cx={24 + Math.cos(a) * 8.5} cy={41 + Math.sin(a) * 8.5} r={0.9} fill={C.sindoor} />
      })}
      <path d="M30.5 1 C28 6 30 9 33 9" fill="none" stroke={C.sindoor} strokeWidth={0.8} />
    </svg>
  )
}

function Lotus({ className, color = C.sindoor }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <g fill="rgba(218,138,34,0.14)" stroke={color} strokeWidth={0.9} strokeLinejoin="round">
        <path d="M30 26.5 C20 26.5 8 22.5 2 16.5 C12 14.5 22 18.5 30 26.5Z" />
        <path d="M30 26.5 C40 26.5 52 22.5 58 16.5 C48 14.5 38 18.5 30 26.5Z" />
        <path d="M30 26.5 C22 22.5 14.5 16 12.5 7.5 C20.5 9 27 15 30 26.5Z" />
        <path d="M30 26.5 C38 22.5 45.5 16 47.5 7.5 C39.5 9 33 15 30 26.5Z" />
        <path d="M30 1.5 C36.5 8.5 37.5 18 30 26.5 C22.5 18 23.5 8.5 30 1.5Z" />
      </g>
      <path d="M17 28.5 H43" stroke={color} strokeWidth={0.9} />
    </svg>
  )
}

function Divider({ width = 240 }: { width?: number }) {
  return (
    <div className="mx-auto flex items-center justify-center gap-3" style={{ maxWidth: width }} aria-hidden>
      <span className="h-px flex-1" style={{ background: C.rule }} />
      <Lotus className="h-[18px] w-[36px]" />
      <span className="h-px flex-1" style={{ background: C.rule }} />
    </div>
  )
}

function Heading({ hi, en }: { hi: string; en: string }) {
  return (
    <div className="text-center">
      <h2 lang="hi" className="leading-[1.2]" style={{ fontFamily: display, fontSize: 34, color: C.sindoor }}>{hi}</h2>
      <p className="mt-1 italic" style={{ fontFamily: display, fontSize: 18, color: C.soft }}>{en}</p>
    </div>
  )
}

function MehrabPhoto({ src, alt, className, lazy }: { src: string; alt: string; className?: string; lazy?: boolean }) {
  return (
    <div className={className} style={{ clipPath: 'url(#iw-mehrab)', background: C.maroon, padding: 2 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={lazy ? 'lazy' : undefined} className="h-full w-full object-cover" style={{ clipPath: 'url(#iw-mehrab)' }} />
    </div>
  )
}

export default function IndianWedding({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Priya'
  const groom = data.groomName?.trim() || 'Arjun'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`Wedding of ${bride} & ${groom}`, data.date, data.time, place || undefined, 5)
  const portraits = [
    { src: data.bridePhoto, alt: bride },
    { src: data.groomPhoto, alt: groom },
  ].filter((p) => p.src && /^(https?:)?\//.test(p.src)) as { src: string; alt: string }[]
  const venue = data.venue?.trim() || 'The venue'

  return (
    <div
      className="iw relative overflow-x-hidden"
      style={{ background: C.paper, color: C.maroon, fontFamily: text, containerType: 'inline-size', ...grain(0.07) }}
    >
      <style>{`
        .iw .iw-toran { animation: iw-drop 1100ms cubic-bezier(.2,.8,.25,1.05) both; }
        .iw .iw-swing { transform-box: fill-box; transform-origin: 50% 0; animation: iw-swing 2200ms ease-out both; }
        .iw .iw-sway { transform-box: fill-box; transform-origin: 50% 0; animation: iw-sway 2000ms ease-out both; }
        .iw .iw-in { opacity: 0; transform: translateY(8px); animation: iw-in 900ms cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes iw-drop { from { transform: translateY(-46px); opacity: 0; } 35% { opacity: 1; } to { transform: none; opacity: 1; } }
        @keyframes iw-swing { 0% { transform: rotate(7deg); } 30% { transform: rotate(-4.5deg); } 55% { transform: rotate(2.4deg); } 78% { transform: rotate(-1deg); } 100% { transform: rotate(0); } }
        @keyframes iw-sway { 0% { transform: rotate(-5deg); } 40% { transform: rotate(3deg); } 70% { transform: rotate(-1.2deg); } 100% { transform: rotate(0); } }
        @keyframes iw-in { to { opacity: 1; transform: none; } }
        .iw .iw-btn { transition: background-color .2s ease, color .2s ease; }
        .iw .iw-btn-solid:hover { background: ${C.maroon}; }
        .iw .iw-btn-line:hover { background: rgba(90,19,32,0.06); }
        @media (prefers-reduced-motion: reduce) {
          .iw .iw-toran, .iw .iw-swing, .iw .iw-sway, .iw .iw-in { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <MarigoldDefs />
      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.maroon} background="rgba(251,244,230,0.9)" border={C.rule} />

      {/* ── The card ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <div className="absolute inset-x-0 top-0 z-10">
          <Toran animate={!isPreview} />
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] flex-1 px-4 pb-8 pt-[88px]">
          <div className="relative text-center">
            <MehrabFrame />

            <div className="relative px-7 pb-[92px]" style={{ paddingTop: '37%' }}>
              <p lang="hi" className="iw-in leading-[1.3]" style={{ fontFamily: display, fontSize: 'clamp(19px, 5.6cqi, 24px)', color: C.sindoor, animationDelay: '500ms' }}>
                ॥ श्री गणेशाय नमः ॥
              </p>
              <p
                lang="hi"
                className="iw-in mx-auto mt-3 max-w-[18rem] leading-[1.65]"
                style={{ fontFamily: display, fontSize: 14, color: C.faint, animationDelay: '650ms' }}
              >
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>

              <div className="iw-in mt-6" style={{ animationDelay: '800ms' }}>
                <Divider width={200} />
              </div>

              <p
                className="iw-in mx-auto mt-6 max-w-[17rem] italic leading-[1.5]"
                style={{ fontFamily: display, fontSize: 18, color: C.soft, animationDelay: '950ms' }}
              >
                With the blessings of our elders, our families cordially invite you to the wedding of
              </p>

              {portraits.length > 0 && (
                <div className="iw-in mt-7 flex justify-center gap-3" style={{ animationDelay: '1050ms' }}>
                  {portraits.map((p) => (
                    <MehrabPhoto key={p.alt} src={p.src} alt={p.alt} className="h-[128px] w-[96px]" />
                  ))}
                </div>
              )}

              <h1 className="mt-6" style={{ fontFamily: display, fontWeight: 400 }}>
                <span className="iw-in block leading-[1.05]" style={{ fontSize: 'clamp(42px, 13.5cqi, 66px)', color: C.maroon, animationDelay: '1150ms' }}>
                  {bride}
                </span>
                <span className="iw-in my-1.5 block italic" style={{ fontSize: 'clamp(18px, 5cqi, 22px)', color: C.sindoor, animationDelay: '1250ms' }}>
                  with
                </span>
                <span className="iw-in block leading-[1.05]" style={{ fontSize: 'clamp(42px, 13.5cqi, 66px)', color: C.maroon, animationDelay: '1350ms' }}>
                  {groom}
                </span>
              </h1>

              <div className="iw-in mx-auto mt-8 max-w-[20rem] border-y py-4" style={{ borderColor: C.rule, animationDelay: '1500ms' }}>
                {date ? (
                  <>
                    <p className="text-[15px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: C.soft }}>{date.weekday}</p>
                    <p className="mt-1 whitespace-nowrap leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(23px, 7.4cqi, 31px)', color: C.maroon }}>
                      {date.day} {date.month} {date.year}
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: display, fontSize: 24, color: C.maroon }}>Date to be announced</p>
                )}
                {time && (
                  <p className="mt-2 text-[16px]" style={{ color: C.sindoor }}>
                    <span className="italic" style={{ fontFamily: display }}>Shubh muhurat</span>
                    <span className="mx-2" style={{ color: C.faint }}>·</span>
                    <span className="font-semibold">{time}</span>
                  </p>
                )}
              </div>

              <div className="iw-in mt-7" style={{ animationDelay: '1650ms' }}>
                <p className="italic" style={{ fontFamily: display, fontSize: 17, color: C.faint }}>at</p>
                <p className="mt-1 leading-[1.2]" style={{ fontFamily: display, fontSize: 25, color: C.maroon }}>{venue}</p>
                {data.venueAddress && (
                  <p className="mx-auto mt-1.5 max-w-[17rem] text-[15px] leading-[1.5]" style={{ color: C.soft }}>{data.venueAddress}</p>
                )}
              </div>

              {data.dressCode && (
                <p className="iw-in mt-6 text-[15px]" style={{ color: C.soft, animationDelay: '1750ms' }}>
                  <span className="italic" style={{ fontFamily: display, color: C.sindoor }}>Attire</span>
                  <span className="mx-2" style={{ color: C.faint }}>·</span>
                  {data.dressCode}
                </p>
              )}
            </div>

            <Paisley className="pointer-events-none absolute bottom-[20px] left-[20px] w-[38px]" />
            <Paisley flip className="pointer-events-none absolute bottom-[20px] right-[20px] w-[38px]" />
          </div>
        </div>
      </section>

      {/* ── Countdown, as a line of type on the maroon band ───────── */}
      {countdown && (
        <section className="relative px-6 pb-11 pt-12 text-center" style={{ background: C.band, color: C.bandInk }}>
          <MarigoldEdge className="absolute inset-x-0 -top-[8px]" />
          <p className="italic" style={{ fontFamily: display, fontSize: 19, color: 'rgba(246,232,208,0.82)' }}>The wedding is</p>
          <p className="mt-2 leading-none tabular-nums" style={{ fontFamily: display, fontSize: 'clamp(66px, 21cqi, 96px)', color: C.mgLight }}>
            {countdown.days}
          </p>
          <p className="mt-1 italic" style={{ fontFamily: display, fontSize: 21 }}>{countdown.days === 1 ? 'day away' : 'days away'}</p>
          <p className="mt-4 text-[15px] tabular-nums" style={{ color: 'rgba(246,232,208,0.7)', letterSpacing: '0.04em' }}>
            {countdown.hours} hr · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
          </p>
          <MarigoldEdge className="absolute inset-x-0 -bottom-[8px]" />
        </section>
      )}

      <div className="mx-auto max-w-[30rem] px-6">
        {/* ── A note from the family ─────────────────────────────── */}
        {data.message && (
          <Reveal disabled={isPreview} as="section" className="pt-16 text-center">
            <Lotus className="mx-auto h-[26px] w-[52px]" />
            <p className="mx-auto mt-5 max-w-[24rem] leading-[1.55]" style={{ fontFamily: display, fontSize: 21, color: C.maroon }}>
              {data.message}
            </p>
            <p className="mt-4 text-[15px]" style={{ color: C.soft }}>— {bride} &amp; {groom}</p>
          </Reveal>
        )}

        {/* ── Order of ceremonies ───────────────────────────────── */}
        {schedule.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="pt-16">
            <Heading hi="कार्यक्रम" en="The ceremonies" />
            <ol className="relative mx-auto mt-8 max-w-[24rem]">
              <span aria-hidden className="absolute bottom-5 top-5 w-px" style={{ left: 99.5, background: C.mgDeep, opacity: 0.55 }} />
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`} className="relative grid grid-cols-[80px_24px_1fr] items-center gap-x-2 py-3.5">
                  <span className="text-right text-[15px] font-semibold tabular-nums" style={{ color: C.sindoor }}>
                    {item.time || ''}
                  </span>
                  <svg viewBox="-8 -8 16 16" className="relative mx-auto h-[22px] w-[22px]" aria-hidden>
                    <use href={i % 2 ? '#iw-mg-b' : '#iw-mg-a'} transform={`rotate(${i * 37}) scale(1.15)`} />
                  </svg>
                  <span className="leading-[1.25]" style={{ fontFamily: display, fontSize: 21, color: C.maroon }}>
                    {item.title}
                    {item.note && <span className="mt-0.5 block text-[15px]" style={{ fontFamily: text, color: C.soft }}>{item.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>

      {/* ── Photographs in mehrab frames ───────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 pt-16">
          <Reveal disabled={isPreview}>
            <Heading hi="झलकियाँ" en="A few glimpses" />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = i === 0 || (photos.length % 2 === 0 && i === photos.length - 1)
              return (
                <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className={wide ? 'col-span-2' : ''}>
                  <MehrabPhoto src={src} alt="" lazy className={wide ? 'aspect-[4/5] w-full' : 'aspect-[3/4] w-full'} />
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Venue ─────────────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pt-16 text-center">
        <Heading hi="विवाह स्थल" en="The venue" />
        <p className="mt-6 leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 40px)', color: C.maroon }}>{venue}</p>
        {data.venueAddress && (
          <p className="mx-auto mt-2 max-w-[20rem] text-[16px] leading-[1.55]" style={{ color: C.soft }}>{data.venueAddress}</p>
        )}
        <p className="mt-3 text-[16px]" style={{ color: C.maroon }}>
          {date ? date.long : 'Date to be announced'}
          {time && <span style={{ color: C.sindoor }}> · {time}</span>}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <DirectionsLink
            href={directions}
            isPreview={isPreview}
            className="iw-btn iw-btn-solid inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
            style={{ background: C.sindoor, color: '#FFF6EA' }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
              <path strokeLinejoin="round" d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Directions
          </DirectionsLink>
          <DirectionsLink
            href={calendar}
            isPreview={isPreview}
            className="iw-btn iw-btn-line inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-medium"
            style={{ borderColor: C.maroon, color: C.maroon }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
              <rect x="3.5" y="5" width="17" height="15" rx="2" />
              <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
            Add to calendar
          </DirectionsLink>
        </div>
      </Reveal>

      {eventId && (
        <div className="mt-16">
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Blessings for the couple"
            intro={`Leave a few words for ${bride} and ${groom}. Your blessing appears here for every guest.`}
            noun="blessing"
          />
        </div>
      )}

      {/* ── Foot of the card ─────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: C.paper }}>
        <Lotus className="mx-auto h-[24px] w-[48px]" />
        <p lang="hi" className="mt-3" style={{ fontFamily: display, fontSize: 20, color: C.sindoor }}>शुभ विवाह</p>
        <p className="mt-1" style={{ fontFamily: display, fontSize: 26, color: C.maroon }}>
          {bride} <span className="italic" style={{ fontSize: 20, color: C.sindoor }}>&amp;</span> {groom}
        </p>
        {date && <p className="mt-1.5 text-[14px]" style={{ color: C.faint }}>{date.day} {date.month} {date.year}</p>}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.soft} />
        </div>
      </footer>
    </div>
  )
}
