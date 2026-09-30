'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { gloock } from './kit/fonts/gloock'
import { jost } from './kit/fonts/jost'
import { rozha } from './kit/fonts/rozha'
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
 * Diwali Milan — the doorstep on Diwali night.
 * An indigo sky with paper akash kandils hung from the top of the page; a
 * row of painted clay diyas along a threshold drawn in rangoli powder. On
 * arrival someone writes across the sky with a phuljhadi — the trails are
 * drawn in like a long-exposure photograph and end in a burst of sparks —
 * and after that only the diya flames move.
 */

const C = {
  sky: '#17113A',
  skyLow: '#2A1447',
  plum: '#2B1440',
  plumDeep: '#1D0E30',
  gold: '#F4C65C',
  goldSoft: 'rgba(244,198,92,0.8)',
  marigold: '#F08A1C',
  pink: '#E0508C',
  cream: '#FCEFDA',
  creamSoft: 'rgba(252,239,218,0.76)',
  creamFaint: 'rgba(252,239,218,0.5)',
  line: 'rgba(244,198,92,0.26)',
  clay: '#B4532A',
  clayDark: '#7A3219',
  clayLight: '#D8784A',
}

const display = gloock.style.fontFamily
const sans = jost.style.fontFamily
const deva = rozha.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.plumDeep,
  surface: C.plum,
  ink: C.cream,
  muted: C.creamSoft,
  line: 'rgba(244,198,92,0.24)',
  accent: C.marigold,
  onAccent: '#241033',
  heading: display,
  body: sans,
  headingStyle: { fontWeight: 400, fontSize: 38, color: C.gold, lineHeight: 1.05 },
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const f1 = (n: number) => n.toFixed(1)

// ─── Diya ────────────────────────────────────────────────────────────────────

/** A painted clay diya, flame at the spout. `flicker` picks one of two rhythms. */
function Diya({ className, style, flicker, seed = 1 }: { className?: string; style?: CSSProperties; flicker?: 0 | 1; seed?: number }) {
  const r = rng(seed)
  const lean = f1((r() - 0.5) * 8)
  const band = seed % 3 === 0 ? C.pink : seed % 3 === 1 ? C.gold : C.cream
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <g className={flicker === undefined ? undefined : flicker ? 'dp-flame dp-flame-b' : 'dp-flame'} style={{ transformOrigin: '47px 33px' }}>
        <g transform={`rotate(${lean} 47 33)`}>
          <path d="M47 8 C 53 18, 55 24, 52 29 C 50 33, 44 33, 42 29 C 39 24, 42 18, 47 8Z" fill="#F5A623" />
          <path d="M47 16 C 50 22, 51 26, 49.5 29 C 48.5 31, 45.5 31, 44.5 29 C 43.4 26, 44.5 22, 47 16Z" fill="#FFE7A3" />
          <path d="M47 24 C 48.2 27, 48.3 29, 47.4 30.4 C 46.9 31, 46.2 30.8, 46 30 C 45.8 28.6, 46.2 26.6, 47 24Z" fill="#FFFFFF" />
        </g>
      </g>
      <path d="M47 31 L47.8 35" stroke="#3A1A0C" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 37 C 14 33, 36 32, 50 34 L 60 31 C 59 37, 55 41, 50 43 C 38 54, 16 54, 8 45 C 5 42, 4 40, 4 37Z" fill={C.clay} />
      <path d="M8 45 C 16 54, 38 54, 50 43 C 44 46, 20 49, 8 45Z" fill={C.clayDark} opacity="0.6" />
      <path d="M4 37 C 14 33, 36 32, 50 34 L 60 31 C 50 37, 40 39.5, 26 39.5 C 16 39.5, 8 38.6, 4 37Z" fill={C.clayDark} />
      <path d="M7 37.6 C 16 35, 34 34.5, 48 35.8" stroke="#E0A33A" strokeWidth="1.3" fill="none" opacity="0.8" />
      <path d="M9 44 C 18 48.6, 36 48.6, 47 43.6" stroke={band} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {[13, 20, 27, 34, 41].map((x, i) => (
        <circle key={x} cx={x} cy={i === 0 || i === 4 ? 41.6 : 42.4} r="1.1" fill={C.cream} />
      ))}
      <path d="M13 40 C 12 42, 13 43.6, 15 44.4" stroke={C.clayLight} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

// ─── Akash kandil ────────────────────────────────────────────────────────────

/** A paper sky lantern: pyramid cap, windowed drum, pyramid base and long tails. */
function Kandil({
  body,
  shade,
  trim,
  tails,
  className,
  style,
}: {
  body: string
  shade: string
  trim: string
  tails: string[]
  className?: string
  style?: CSSProperties
}) {
  const zig = (y: number, dir: 1 | -1) =>
    `M14 ${y} ${Array.from({ length: 9 }, (_, i) => `L${f1(14 + (i + 0.5) * 8)} ${y + dir * 4} L${f1(14 + (i + 1) * 8)} ${y}`).join(' ')}`
  const tailX = [20, 34, 50, 66, 80]
  return (
    <svg viewBox="0 -120 100 320" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <path d="M50 -120 L50 8" stroke="rgba(252,239,218,0.4)" strokeWidth="0.9" />
      {tails.map((c, i) => {
        const x = tailX[i % tailX.length]
        const len = 82 + ((i * 37) % 30)
        const sway = (i - 2) * 2.2
        return (
          <path
            key={i}
            d={`M${x - 3} 100 C ${x - 3 + sway} ${100 + len * 0.5}, ${x - 3 + sway * 1.6} ${100 + len * 0.8}, ${x - 3 + sway * 2} ${100 + len} L${x + sway * 2} ${96 + len} L${x + 3 + sway * 2} ${100 + len} C ${x + 3 + sway * 1.6} ${100 + len * 0.8}, ${x + 3 + sway} ${100 + len * 0.5}, ${x + 3} 100Z`}
            fill={c}
          />
        )
      })}
      <path d="M50 6 L14 40 L50 40Z" fill={body} />
      <path d="M50 6 L86 40 L50 40Z" fill={shade} />
      <rect x="14" y="40" width="16" height="34" fill={shade} />
      <rect x="30" y="40" width="40" height="34" fill={body} />
      <rect x="70" y="40" width="16" height="34" fill={shade} />
      {/* Lamplight through the cut-outs */}
      <path d="M50 46 L57 57 L50 68 L43 57Z" fill="#FFE9A8" />
      <circle cx="37" cy="57" r="3.2" fill="#FFD77A" />
      <circle cx="63" cy="57" r="3.2" fill="#FFD77A" />
      <path d="M22 50 L22 64 M78 50 L78 64" stroke="#FFD77A" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      <path d="M14 74 L50 104 L50 74Z" fill={body} />
      <path d="M86 74 L50 104 L50 74Z" fill={shade} />
      <path d="M50 20 L50 36" stroke="#FFD77A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d={zig(40, 1)} fill="none" stroke={trim} strokeWidth="1.6" strokeLinejoin="round" />
      <path d={zig(74, -1)} fill="none" stroke={trim} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="50" cy="6" r="2.6" fill={trim} />
      <circle cx="50" cy="104" r="2.6" fill={trim} />
    </svg>
  )
}

// ─── Phuljhadi trails ────────────────────────────────────────────────────────

/** A looping light trail between two points (a prolate trochoid, tapered). */
function trailPath(x0: number, y0: number, x1: number, y1: number, loops: number, amp: number) {
  const L = Math.hypot(x1 - x0, y1 - y0)
  const ux = (x1 - x0) / L
  const uy = (y1 - y0) / L
  const rr = L / (Math.PI * 2 * loops)
  const N = loops * 26
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const th = t * loops * Math.PI * 2
    const dd = amp * (0.45 + 0.75 * Math.sin(Math.PI * Math.min(1, t * 1.15)))
    const along = rr * th - dd * Math.sin(th)
    const across = dd * (1 - Math.cos(th)) * -1
    const x = x0 + ux * along - uy * across
    const y = y0 + uy * along + ux * across
    d += `${i ? 'L' : 'M'}${f1(x)} ${f1(y)} `
  }
  return d
}

function Sparks({ x, y, seed, className, style }: { x: number; y: number; seed: number; className?: string; style?: CSSProperties }) {
  const r = rng(seed)
  const rays = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 + r() * 0.4
    const r0 = 3 + r() * 2
    const r1 = 9 + r() * 12
    return `M${f1(x + Math.cos(a) * r0)} ${f1(y + Math.sin(a) * r0)} L${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)}`
  }).join(' ')
  return (
    <g className={className} style={style}>
      <path d={rays} stroke="#FFE9A8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={x} cy={y} r="3" fill="#FFFFFF" />
    </g>
  )
}

function Trails({ draw }: { draw: boolean }) {
  const a = trailPath(-10, 222, 206, 118, 3, 30)
  const b = trailPath(292, 252, 412, 196, 2, 17)
  const cls = draw ? 'dp-draw' : undefined
  const r = rng(31)
  // Loose sparks spat off along the way.
  const spits = Array.from({ length: 16 }, () => {
    const t = r()
    const x = -10 + 216 * t + (r() - 0.5) * 60
    const y = 222 - 104 * t + (r() - 0.5) * 70
    return { x, y, s: 0.8 + r() * 1.2, delay: 300 + t * 1900 }
  })
  const later = (ms: number) => (draw ? { animationDelay: `${ms}ms` } : undefined)
  return (
    <svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMin slice" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] w-full" aria-hidden>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={a} stroke={C.gold} strokeWidth="6" opacity="0.2" pathLength={1} className={cls} />
        <path d={a} stroke="#FFD980" strokeWidth="2.2" pathLength={1} className={cls} />
        <path d={a} stroke="#FFFBEA" strokeWidth="0.9" pathLength={1} className={cls} />
        <path d={b} stroke="#F7A8C6" strokeWidth="5" opacity="0.22" pathLength={1} className={cls} style={later(900)} />
        <path d={b} stroke="#FFD1E2" strokeWidth="1.6" pathLength={1} className={cls} style={later(900)} />
      </g>
      <g fill="#FFE9A8">
        {spits.map((p, i) => (
          <circle key={i} cx={f1(p.x)} cy={f1(p.y)} r={f1(p.s)} className={draw ? 'dp-spit' : undefined} style={later(p.delay)} />
        ))}
      </g>
      <Sparks x={206} y={118} seed={4} className={draw ? 'dp-spark' : undefined} style={later(2100)} />
      <Sparks x={412} y={196} seed={9} className={draw ? 'dp-spark' : undefined} style={later(2500)} />
    </svg>
  )
}

// ─── Rangoli ─────────────────────────────────────────────────────────────────

/** The threshold: a band of rangoli — petals, lotus fans and dots in powder colours. */
function Threshold({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="xMidYMid slice" className="block h-[40px] w-full" aria-hidden>
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#3A1650" />
          <path d="M0 3 H40 M0 37 H40" stroke={C.gold} strokeWidth="1.4" />
          <path d="M20 8 C 26 14, 26 22, 20 32 C 14 22, 14 14, 20 8Z" fill={C.pink} />
          <path d="M20 14 C 23 18, 23 23, 20 28 C 17 23, 17 18, 20 14Z" fill={C.cream} />
          <path d="M6 32 C 6 22, 14 20, 14 20 C 12 26, 10 30, 6 32Z" fill={C.marigold} />
          <path d="M34 32 C 34 22, 26 20, 26 20 C 28 26, 30 30, 34 32Z" fill={C.marigold} />
          <circle cx="0" cy="20" r="3.4" fill={C.gold} />
          <circle cx="40" cy="20" r="3.4" fill={C.gold} />
          <circle cx="8" cy="10" r="1.3" fill={C.cream} />
          <circle cx="32" cy="10" r="1.3" fill={C.cream} />
        </pattern>
      </defs>
      <rect width="400" height="40" fill={`url(#${id})`} />
    </svg>
  )
}

/** A rangoli medallion, flat powder colours in rings; drawn in a -100..100 box. */
function Medallion({ className, style }: { className?: string; style?: CSSProperties }) {
  const ring = (n: number, r0: number, r1: number, w: number, fill: string, rot = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = rot + (i / n) * Math.PI * 2
      const p = (r: number, da: number) => `${f1(Math.cos(a + da) * r)} ${f1(Math.sin(a + da) * r)}`
      return <path key={i} d={`M${p(r0, 0)} Q${p((r0 + r1) / 2, -w)} ${p(r1, 0)} Q${p((r0 + r1) / 2, w)} ${p(r0, 0)}Z`} fill={fill} />
    })
  const dots = (n: number, r: number, size: number, fill: string) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      return <circle key={i} cx={f1(Math.cos(a) * r)} cy={f1(Math.sin(a) * r)} r={size} fill={fill} />
    })
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      <circle r="98" fill="#3A1650" />
      {ring(24, 70, 97, 0.1, C.pink)}
      {ring(24, 74, 90, 0.06, C.cream, 0)}
      {dots(24, 66, 2.6, C.gold)}
      <circle r="62" fill={C.marigold} />
      {ring(12, 26, 60, 0.22, C.pink, Math.PI / 12)}
      {ring(12, 30, 52, 0.14, C.cream, Math.PI / 12)}
      {ring(12, 24, 48, 0.12, C.gold)}
      <circle r="24" fill="#3A1650" />
      {dots(12, 17, 2.2, C.cream)}
      <circle r="10" fill={C.gold} />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const button =
  'dp-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors'

function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-center leading-[1.05] ${className}`} style={{ fontFamily: display, fontSize: 'clamp(34px, 10.5cqi, 44px)', color: C.gold }}>
      {children}
    </h2>
  )
}

export default function DiwaliParty({ data, eventId, isPreview = false }: InviteProps) {
  const hosts = data.hostNames?.trim() || 'Priya & Sameer'
  const title = data.title?.trim() || 'Diwali Milan'
  const animate = !isPreview
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`${title} — ${hosts}`, data.date, data.time, place || undefined, 4)
  const plural = /&| and |,/i.test(hosts) || /^the /i.test(hosts)

  return (
    <div
      className="dp relative overflow-x-hidden"
      style={{ background: C.plumDeep, color: C.cream, fontFamily: sans, containerType: 'inline-size' }}
    >
      <style>{`
        .dp .dp-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: dp-draw 1.9s cubic-bezier(.4,.1,.4,1) forwards 300ms; }
        .dp .dp-spit { opacity: 0; animation: dp-fade .5s ease-out forwards; }
        .dp .dp-spark { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(.3); animation: dp-spark 1.2s ease-out forwards; }
        .dp .dp-flame { animation: dp-flick 2.6s ease-in-out infinite; }
        .dp .dp-flame-b { animation-duration: 3.3s; animation-delay: -1.2s; }
        .dp .dp-btn:hover { filter: brightness(1.08); }
        @keyframes dp-draw { to { stroke-dashoffset: 0; } }
        @keyframes dp-fade { to { opacity: .8; } }
        @keyframes dp-spark { 15% { opacity: 1; transform: scale(1.15); } 60% { opacity: 1; } to { opacity: .75; transform: none; } }
        @keyframes dp-flick { 0%, 100% { transform: scale(1, 1); } 30% { transform: scale(.94, 1.06) rotate(-2deg); } 55% { transform: scale(1.03, .96); } 80% { transform: scale(.97, 1.04) rotate(1.5deg); } }
        @media (prefers-reduced-motion: reduce) {
          .dp .dp-draw, .dp .dp-spark, .dp .dp-spit, .dp .dp-flame { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.cream} background="rgba(29,14,48,0.85)" border={C.line} />

      {/* ── Diwali night ─────────────────────────────────────────── */}
      <header
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: isPreview ? 560 : '100svh', background: `linear-gradient(180deg, ${C.sky} 0%, #1E1240 55%, ${C.skyLow} 100%)` }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={grain(0.07)} />
        <Trails draw={animate} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
          <Kandil body="#E0508C" shade="#B8356E" trim={C.gold} tails={[C.gold, C.pink, C.marigold, C.gold, C.pink]} className="absolute left-[5%] top-[-44px] w-[19%] max-w-[92px]" />
          <Kandil body="#F29A2E" shade="#D0741A" trim="#FFF0C2" tails={[C.pink, C.gold, C.marigold, C.gold, C.pink]} className="absolute right-[6%] top-[-78px] w-[23%] max-w-[110px]" />
          <Kandil body="#F4C65C" shade="#D39F37" trim={C.pink} tails={[C.marigold, C.pink, C.gold]} className="absolute left-[60%] top-[-30px] w-[11%] max-w-[54px]" />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-[200px] text-center">
          <p lang="hi" className="leading-none" style={{ fontFamily: deva, fontSize: 24, color: C.gold }}>
            शुभ दीपावली
          </p>
          <p className="mt-6 text-[20px] font-medium">{hosts}</p>
          <p className="mt-1 text-[16px] italic" style={{ color: C.creamSoft }}>
            {plural ? 'invite' : 'invites'} you to
          </p>
          <h1 className="mt-2 leading-[0.98]" style={{ fontFamily: display, fontSize: 'clamp(52px, 17cqi, 86px)', color: C.cream }}>
            {title}
          </h1>
          <p className="mt-5 font-medium" style={{ color: C.gold, fontSize: 'clamp(15px, 4.7cqi, 18px)' }}>
            <span className="whitespace-nowrap">{date ? `${date.weekday}, ${date.day} ${date.month}` : 'Date to be announced'}</span>
            {time && <span className="whitespace-nowrap" style={{ color: C.cream }}> · {time}</span>}
          </p>
          {data.venue && <p className="mt-1 text-[16px]" style={{ color: C.creamSoft }}>{data.venue}</p>}
        </div>

        {/* The doorstep */}
        <div className="relative">
          <div className="relative mx-auto flex max-w-[34rem] items-end justify-between px-[3%]">
            {Array.from({ length: 5 }, (_, i) => (
              <Diya key={i} seed={i + 1} flicker={animate ? ((i % 2) as 0 | 1) : undefined} className="w-[18%] max-w-[92px]" style={{ marginBottom: -6 }} />
            ))}
          </div>
          <Threshold id="dp-threshold-hero" />
          <div className="relative h-[92px] overflow-hidden" style={{ background: C.plumDeep }}>
            <Medallion className="absolute left-1/2 top-[12px] w-[240px] -translate-x-1/2" />
          </div>
        </div>
      </header>

      {/* ── The note ─────────────────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pb-6 pt-12 text-center">
          <p className="leading-[1.35]" style={{ fontFamily: display, fontSize: 'clamp(23px, 6.8cqi, 28px)' }}>
            {data.message}
          </p>
          <p className="mt-4 text-[15px]" style={{ color: C.goldSoft }}>— {hosts}</p>
        </Reveal>
      )}

      {/* ── When & where ─────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-5 py-10">
        <div className="relative overflow-hidden rounded-[22px] px-6 pb-8 pt-9 text-center" style={{ background: C.plum, border: `1px solid ${C.line}` }}>
          <Medallion className="absolute -left-[70px] -top-[70px] w-[140px] opacity-60" />
          <Medallion className="absolute -bottom-[70px] -right-[70px] w-[140px] opacity-60" />
          <div className="relative">
            {date ? (
              <>
                <p className="text-[15px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: C.gold }}>{date.weekday}</p>
                <p className="mt-1 leading-none" style={{ fontFamily: display, fontSize: 84, color: C.cream }}>{date.day}</p>
                <p className="mt-2 text-[20px]" style={{ fontFamily: display }}>{date.month} {date.year}</p>
              </>
            ) : (
              <p className="text-[20px]" style={{ fontFamily: display }}>Date to be announced</p>
            )}
            {time && (
              <p className="mt-3 text-[18px] font-medium" style={{ color: C.gold }}>
                from {time}
              </p>
            )}
            <span aria-hidden className="mx-auto my-6 block h-px w-16" style={{ background: C.line }} />
            <p className="leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 32px)' }}>{data.venue || 'The venue'}</p>
            {data.venueAddress && (
              <p className="mx-auto mt-2 max-w-[18rem] text-[16px] leading-[1.5]" style={{ color: C.creamSoft }}>
                {data.venueAddress}
              </p>
            )}
            {data.dressCode && (
              <p className="mt-5 text-[16px]" style={{ color: C.creamSoft }}>
                Dress code · <span className="font-medium" style={{ color: C.cream }}>{data.dressCode}</span>
              </p>
            )}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: C.gold, color: '#241033' }}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={button}
                  style={{ border: `1.5px solid ${C.gold}`, color: C.gold }}
                >
                  Add to calendar
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── The evening ──────────────────────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-10">
          <Title>The evening</Title>
          <ol className="relative mt-8">
            <span aria-hidden className="absolute bottom-8 left-[27px] top-8 border-l-2 border-dotted" style={{ borderColor: 'rgba(244,198,92,0.45)' }} />
            {schedule.map((item, i) => (
              <li key={`${item.title}-${i}`} className="relative grid grid-cols-[56px_1fr] items-center gap-4 py-3">
                <span className="flex h-[56px] items-end justify-center" style={{ background: C.plumDeep }}>
                  <Diya seed={i + 3} className="w-[50px]" />
                </span>
                <div>
                  {item.time && <p className="text-[15px] font-medium tabular-nums" style={{ color: C.marigold }}>{item.time}</p>}
                  <p className="leading-[1.2]" style={{ fontFamily: display, fontSize: 22 }}>{item.title}</p>
                  {item.note && <p className="mt-0.5 text-[15px]" style={{ color: C.creamSoft }}>{item.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Countdown ────────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-10 text-center">
          <Diya seed={5} className="mx-auto w-[64px]" />
          <p className="mt-2 leading-none" style={{ fontFamily: display, fontSize: 72, color: C.gold }}>
            {countdown.days}
          </p>
          <p className="mt-2 text-[18px]">{countdown.days === 1 ? 'day' : 'days'} to go</p>
          <p className="mt-1.5 text-[15px] tabular-nums" style={{ color: C.creamSoft }}>
            {countdown.hours} hr · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
          </p>
        </Reveal>
      )}

      {/* ── Photographs ──────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-5 py-10">
          <Reveal disabled={isPreview}>
            <Title>From our album</Title>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = i === 0 || (photos.length % 2 === 0 && i === photos.length - 1)
              return (
                <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className={wide ? 'col-span-2 aspect-[3/2]' : 'aspect-[4/5]'}>
                  <figure className="h-full w-full rounded-[14px] p-[4px]" style={{ background: i % 3 === 1 ? C.pink : i % 3 === 2 ? C.marigold : C.gold }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full rounded-[11px] object-cover" />
                  </figure>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: C.line }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Diwali wishes"
            intro={`Leave a few words for ${hosts}. Your wish appears here for every guest.`}
          />
        </div>
      )}

      <footer className="pb-10 pt-4 text-center">
        <div className="mx-auto flex w-[180px] items-end justify-between">
          {[2, 4, 6].map((s) => (
            <Diya key={s} seed={s} className="w-[52px]" />
          ))}
        </div>
        <Threshold id="dp-threshold-foot" />
        <p className="mt-8 text-[24px]" style={{ fontFamily: display, color: C.gold }}>
          {hosts}
        </p>
        {date && (
          <p className="mt-1 text-[13px] uppercase tabular-nums" style={{ letterSpacing: '0.3em', color: C.creamFaint }}>
            {date.dayPadded} · {date.monthShort} · {date.year}
          </p>
        )}
        <div className="mt-8 px-6">
          <Credit isPreview={isPreview} color={C.creamFaint} linkColor={C.cream} />
        </div>
      </footer>
    </div>
  )
}
