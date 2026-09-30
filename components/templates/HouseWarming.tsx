'use client'

import { useMemo } from 'react'
import WishesSection from './WishesSection'
import { yeseva } from './kit/fonts/yeseva'
import { mukta } from './kit/fonts/mukta'
import { kalam } from './kit/fonts/kalam'
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
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Griha Pravesh — a screen-printed housewarming card.
 * Terracotta roof, turmeric door, mango-leaf toran and a brass kalash, drawn
 * in one ink line with the colour spots printed slightly off-register. Hindi
 * and English side by side, as family cards are set; a kolam dot border for
 * rules. On arrival the house draws itself and then the toran is hung.
 */

const C = {
  paper: '#F5ECD9',
  card: '#FBF6EB',
  ink: '#3A2417',
  soft: 'rgba(58,36,23,0.74)',
  faint: 'rgba(58,36,23,0.52)',
  terra: '#A5462A',
  terraDeep: '#823519',
  roof: '#B9573A',
  terraFill: 'rgba(165,70,42,0.14)',
  turmeric: '#E2A42C',
  marigold: '#DE8420',
  leaf: '#56733A',
  rule: '#DFCBAA',
}

const display = yeseva.style.fontFamily
const text = mukta.style.fontFamily
const hand = kalam.style.fontFamily

const WISHES_THEME: InviteTheme = {
  // Transparent so the page's paper grain runs on under the wishes.
  bg: 'transparent',
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: C.rule,
  accent: C.terra,
  onAccent: '#FFF8EC',
  heading: display,
  body: text,
  headingStyle: { fontSize: 30, color: C.ink },
}

// ── Seeded irregularity, so every leaf and loop differs a little ────────────
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const f1 = (n: number) => n.toFixed(1)

/** Lens-shaped leaf pointing along +x from the origin. */
function leafPath(len: number, width: number, bend = 0) {
  const w = width / 2
  return `M0 0 C${f1(len * 0.3)} ${f1(-w * 1.2 + bend)} ${f1(len * 0.72)} ${f1(-w + bend)} ${f1(len)} ${f1(bend * 0.6)} C${f1(len * 0.7)} ${f1(w + bend * 0.4)} ${f1(len * 0.28)} ${f1(w * 1.1)} 0 0Z`
}

interface Leaf { x: number; y: number; a: number; len: number; w: number; bend: number }

// Toran strung over the door: a sagging cord, mango leaves hanging from it,
// a marigold between each pair.
const TORAN = (() => {
  const r = rng(19)
  const p0 = [101, 116], p1 = [140, 125], p2 = [179, 116]
  const at = (t: number) => {
    const u = 1 - t
    return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]
  }
  const n = 9
  const leaves: Leaf[] = []
  const flowers: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < n; i++) {
    const [x, y] = at((i + 0.5) / n)
    leaves.push({ x, y, a: 90 + (r() - 0.5) * 16, len: 12.5 + r() * 3, w: 6 + r() * 1.2, bend: (r() - 0.5) * 2 })
    if (i < n - 1) {
      const [fx, fy] = at((i + 1) / n)
      flowers.push({ x: fx, y: fy, r: 2.6 + r() * 0.6 })
    }
  }
  return { cord: `M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`, leaves, flowers }
})()

// Mango leaves fanned in the kalash mouth.
const KALASH_LEAVES: Leaf[] = (() => {
  const r = rng(7)
  return [-162, -128, -52, -18].map((a) => ({ x: 197, y: 181, a: a + (r() - 0.5) * 8, len: 12 + r() * 2.5, w: 5.6, bend: (r() - 0.5) * 2 }))
})()

// Mangalore-tile scallops across the roof.
const TILES = (() => {
  let d = ''
  for (const y of [62, 76, 90, 103]) {
    const half = (y - 40) * (106 / 70)
    for (let x = 140 - half + 6; x < 140 + half - 12; x += 9) d += `M${f1(x)} ${y} q4.5 4 9 0`
  }
  return d
})()

// A slightly wobbly sun disk, printed as a flat turmeric spot.
const SUN = (() => {
  const r = rng(3)
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    const rad = 58 + (r() - 0.5) * 1.2
    return [140 + rad * Math.cos(a), 70 + rad * Math.sin(a)]
  })
  // Closed Catmull-Rom through the points.
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length], p3 = pts[(i + 2) % pts.length]
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return `${d}Z`
})()

/** The signature drawing: a home with a toran over the door and a kalash at the step. */
function Home({ animate, className }: { animate: boolean; className?: string }) {
  const line = (delay: number) => (animate ? { className: 'hw-line', style: { animationDelay: `${delay}ms` } } : {})
  const fill = (delay: number) => (animate ? { className: 'hw-fill', style: { animationDelay: `${delay}ms` } } : {})
  const stroke = { fill: 'none', stroke: C.ink, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 280 222" className={className} aria-hidden style={{ overflow: 'visible' }}>
      {/* colour spots, printed a touch off-register */}
      <path d={SUN} fill={C.turmeric} opacity={0.9} {...fill(200)} />
      <path d="M58 110V192H222V110Z" fill={C.card} />
      <g transform="translate(1.8 1.4)">
        <path d="M34 110L140 40L246 110Z" fill={C.roof} {...fill(500)} />
        <path d="M120 192V149A20 20 0 0 1 160 149V192Z" fill={C.turmeric} {...fill(700)} />
        <path d="M70 170V144A13 13 0 0 1 96 144V170ZM184 170V144A13 13 0 0 1 210 144V170Z" fill={C.terraFill} {...fill(800)} />
        <path d="M50 192H230V198H50Z" fill={C.rule} {...fill(800)} />
      </g>
      <path d={TILES} fill="none" stroke={C.paper} strokeWidth={0.9} strokeLinecap="round" opacity={0.75} {...fill(900)} />
      <circle cx="140" cy="77" r="7.5" fill={C.card} {...fill(900)} />

      {/* the ink line */}
      <g {...stroke}>
        <path pathLength={1} d="M30 110L140 38L250 110ZM52 110L140 52L228 110" {...line(0)} />
        <path pathLength={1} d="M140 69.5A7.5 7.5 0 1 1 139.9 69.5M140 69.5V84.5M132.5 77H147.5" {...line(500)} />
        <path pathLength={1} d="M58 110V192M222 110V192M48 192H232V198H48ZM110 198H170V203H110ZM104 203H176V208H104Z" {...line(250)} />
        <path pathLength={1} d="M114 192V148A26 26 0 0 1 166 148V192M120 192V149A20 20 0 0 1 160 149V192M140 129V192" {...line(650)} />
        <path pathLength={1} d="M126 160h9v24h-9zM145 160h9v24h-9z" strokeWidth={1.1} {...line(900)} />
        <path pathLength={1} d="M70 170V144A13 13 0 0 1 96 144V170ZM79 132.6V170M87 132.6V170M70 154H96M65 173H101" strokeWidth={1.3} {...line(750)} />
        <path pathLength={1} d="M184 170V144A13 13 0 0 1 210 144V170ZM193 132.6V170M201 132.6V170M184 154H210M179 173H215" strokeWidth={1.3} {...line(800)} />
        <path pathLength={1} d="M10 208.5C70 207.4 200 209.4 270 208" {...line(100)} />
      </g>
      <circle cx="136.6" cy="157" r="1.3" fill={C.ink} {...fill(1200)} />
      <circle cx="143.4" cy="157" r="1.3" fill={C.ink} {...fill(1200)} />

      {/* the toran, hung last */}
      <path d={TORAN.cord} fill="none" stroke={C.ink} strokeWidth={1.1} {...fill(950)} />
      {TORAN.leaves.map((l, i) => (
        <g key={i} transform={`translate(${f1(l.x)} ${f1(l.y)}) rotate(${f1(l.a)})`}>
          <g className={animate ? 'hw-leaf' : undefined} style={animate ? { animationDelay: `${1050 + i * 60}ms` } : undefined}>
            <path d={leafPath(l.len, l.w, l.bend)} fill={C.leaf} stroke={C.ink} strokeWidth={0.8} strokeLinejoin="round" />
            <path d={`M1 0L${f1(l.len * 0.8)} ${f1(l.bend * 0.4)}`} stroke={C.card} strokeWidth={0.6} opacity={0.8} />
          </g>
        </g>
      ))}
      {TORAN.flowers.map((m, i) => (
        <circle key={i} cx={f1(m.x)} cy={f1(m.y)} r={m.r} fill={C.marigold} stroke={C.ink} strokeWidth={0.7} {...fill(1100 + i * 60)} />
      ))}

      {/* kalash with coconut and mango leaves */}
      <g {...fill(1500)}>
        {KALASH_LEAVES.map((l, i) => (
          <g key={i} transform={`translate(${f1(l.x)} ${f1(l.y)}) rotate(${f1(l.a)})`}>
            <path d={leafPath(l.len, l.w, l.bend)} fill={C.leaf} stroke={C.ink} strokeWidth={0.8} strokeLinejoin="round" />
          </g>
        ))}
        <ellipse cx="197" cy="175" rx="6.2" ry="7.4" fill={C.terraDeep} stroke={C.ink} strokeWidth={0.9} />
        <path d="M188 207.5C179 201 180 191 189 186.5V183H205V186.5C214 191 215 201 206 207.5Z" fill={C.turmeric} stroke={C.ink} strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M186 183H208M183.6 196.5C192 199 202 199 210.4 196.5" fill="none" stroke={C.ink} strokeWidth={1} strokeLinecap="round" />
      </g>

      {/* a diya on the other side of the step */}
      <g {...fill(1600)}>
        <path d="M81 199.6C78.4 196 79.6 192.6 81.6 189.6C83.4 192.6 84.8 196 81 199.6Z" fill={C.marigold} stroke={C.ink} strokeWidth={0.8} />
        <path d="M70.5 201.5C74 208.6 89 208.6 92.5 201.5Z" fill={C.terra} stroke={C.ink} strokeWidth={1.1} strokeLinejoin="round" />
      </g>

      {/* kolam dots on the threshold */}
      <g fill={C.terra} {...fill(1700)}>
        {[122, 131, 140, 149, 158].map((x, i) => (
          <circle key={x} cx={x} cy={215 + (i % 2) * 2.5} r={1.35} />
        ))}
      </g>
    </svg>
  )
}

/** A pulli-kolam border: two waves crossing, a dot sitting in every eye. */
function Kolam({ loops = 7, color = C.terra, seed = 5, className }: { loops?: number; color?: string; seed?: number; className?: string }) {
  const r = rng(seed)
  const step = 28, mid = 14, x0 = 8
  const W = x0 * 2 + loops * step
  const wave = (dir: 1 | -1) => {
    let d = `M${x0} ${mid}`
    for (let k = 0; k < loops; k++) {
      const a = (k % 2 === 0 ? -1 : 1) * dir * (10 + (r() - 0.5) * 2)
      const xa = x0 + k * step
      d += ` C${xa + 7} ${f1(mid + a)} ${xa + step - 7} ${f1(mid + a)} ${xa + step} ${mid}`
    }
    return d
  }
  return (
    <svg viewBox={`0 0 ${W} 28`} className={className} aria-hidden style={{ overflow: 'visible' }}>
      <path d={`${wave(1)} ${wave(-1)}`} fill="none" stroke={color} strokeWidth={1.1} strokeLinecap="round" />
      {Array.from({ length: loops }, (_, k) => (
        <circle key={`e${k}`} cx={x0 + k * step + step / 2} cy={mid} r={1.7} fill={color} />
      ))}
      {Array.from({ length: loops + 1 }, (_, k) => (
        <g key={`c${k}`} fill={color}>
          <circle cx={x0 + k * step} cy={mid - 9.5} r={1.15} />
          <circle cx={x0 + k * step} cy={mid + 9.5} r={1.15} />
        </g>
      ))}
      <circle cx={x0 - 5} cy={mid} r={1.3} fill={color} />
      <circle cx={W - x0 + 5} cy={mid} r={1.3} fill={color} />
    </svg>
  )
}

function Heading({ hi, en }: { hi?: string; en: string }) {
  return (
    <div className="text-center">
      {hi && (
        <p lang="hi" style={{ fontFamily: text, fontSize: 18, fontWeight: 500, color: C.terra }}>
          {hi}
        </p>
      )}
      <h2 className="mt-0.5 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 36px)', color: C.ink }}>
        {en}
      </h2>
    </div>
  )
}

export default function HouseWarming({ data, eventId, isPreview = false }: InviteProps) {
  const host = data.hostNames?.trim() || 'The Sharma Family'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 5), [data.galleryImages])
  const hostPhoto = data.hostPhoto && /^(https?:)?\//.test(data.hostPhoto) ? data.hostPhoto : ''
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(`Griha Pravesh — ${host}`, data.date, data.time, place || undefined)
  const animate = !isPreview

  const button =
    'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[3px] px-5 text-[15px] font-semibold transition-colors'

  return (
    <div
      className="hw relative overflow-x-hidden"
      style={{ background: C.paper, color: C.ink, fontFamily: text, containerType: 'inline-size', ...grain(0.055) }}
    >
      <style>{`
        .hw .hw-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hw-draw 1.3s cubic-bezier(.45,.1,.3,1) forwards; }
        .hw .hw-fill { opacity: 0; animation: hw-fade 600ms ease forwards; }
        .hw .hw-leaf { opacity: 0; transform: translateX(-4px); animation: hw-hang 520ms cubic-bezier(.2,.7,.2,1) forwards; }
        .hw .hw-in { opacity: 0; transform: translateY(8px); animation: hw-rise 900ms cubic-bezier(.2,.7,.2,1) forwards; }
        .hw .hw-btn:hover { background: ${C.terraDeep}; }
        .hw .hw-btn-line:hover { background: ${C.terraFill}; }
        @keyframes hw-draw { to { stroke-dashoffset: 0; } }
        @keyframes hw-fade { to { opacity: 1; } }
        @keyframes hw-hang { to { opacity: 1; transform: none; } }
        @keyframes hw-rise { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hw .hw-line, .hw .hw-fill, .hw .hw-leaf, .hw .hw-in { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── The card ──────────────────────────────────────────────── */}
      <header
        className="relative mx-auto flex max-w-[32rem] flex-col items-center px-6 pb-12 pt-9 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh' }}
      >
        <p lang="hi" className="hw-in" style={{ fontSize: 15, color: C.terra, letterSpacing: '0.04em' }}>
          ॥ श्री गणेशाय नमः ॥
        </p>

        <Home animate={animate} className="mt-5 w-[min(84%,300px)]" />

        <p lang="hi" className="hw-in mt-6 leading-none" style={{ fontSize: 'clamp(22px, 6.6cqi, 28px)', fontWeight: 600, color: C.terra, animationDelay: '750ms' }}>
          शुभ गृह प्रवेश
        </p>
        <h1
          className="hw-in mt-2 leading-[0.98]"
          style={{ fontFamily: display, fontSize: 'clamp(40px, 12.4cqi, 60px)', color: C.ink, animationDelay: '850ms' }}
        >
          Shubh Griha Pravesh
        </h1>

        <div className="hw-in mt-7" style={{ animationDelay: '1000ms' }}>
          <p className="leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 28px)', color: C.terraDeep }}>
            {host}
          </p>
          <p className="mx-auto mt-2 max-w-[19rem] text-balance leading-[1.5]" style={{ fontSize: 17, color: C.soft }}>
            invite you to bless their new home on the day they first step in
          </p>
        </div>

        <div className="hw-in mt-7" style={{ animationDelay: '1100ms' }}>
          <Kolam loops={6} className="block w-[168px]" />
        </div>

        <div className="hw-in mt-5" style={{ animationDelay: '1150ms' }}>
          {date ? (
            <>
              <p className="uppercase" style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.2em', color: C.terra }}>
                {date.weekday}
              </p>
              <p className="mt-1 leading-none" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)' }}>
                {date.day} {date.month} {date.year}
              </p>
            </>
          ) : (
            <p style={{ fontFamily: display, fontSize: 24 }}>Date to be announced</p>
          )}
          {time && (
            <p className="mt-2.5" style={{ fontSize: 17, color: C.soft }}>
              Shubh muhurat <span style={{ fontWeight: 600, color: C.ink }}>{time}</span>
            </p>
          )}
        </div>

        {/* The nameplate by the door */}
        <div className="hw-in mt-8 w-full" style={{ animationDelay: '1250ms' }}>
          <div
            className="relative mx-auto inline-block max-w-full px-7 py-3.5"
            style={{ background: C.terra, color: '#FBF1E0', boxShadow: '0 2px 0 rgba(58,36,23,0.18), 0 12px 22px -14px rgba(58,36,23,0.55)' }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-[4px] border" style={{ borderColor: 'rgba(251,241,224,0.45)' }} />
            {[
              'left-[9px] top-[9px]',
              'right-[9px] top-[9px]',
              'left-[9px] bottom-[9px]',
              'right-[9px] bottom-[9px]',
            ].map((pos) => (
              <span key={pos} aria-hidden className={`absolute h-[3px] w-[3px] rounded-full ${pos}`} style={{ background: 'rgba(251,241,224,0.7)' }} />
            ))}
            <p className="relative leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(19px, 5.6cqi, 23px)' }}>
              {data.venue || 'Our new home'}
            </p>
          </div>
          {data.venueAddress && (
            <p className="mx-auto mt-3 max-w-[20rem] leading-[1.45]" style={{ fontSize: 16, color: C.soft }}>
              {data.venueAddress}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[32rem] px-6">
        {/* ── A word from the family ─────────────────────────────── */}
        {(data.message || hostPhoto) && (
          <Reveal disabled={isPreview} as="section" className="pb-14 pt-4 text-center">
            {hostPhoto && (
              <div className="mx-auto w-[min(62%,220px)] p-[5px]" style={{ border: `1px solid ${C.terra}`, borderRadius: '9999px 9999px 0 0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hostPhoto}
                  alt={host}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                  style={{ borderRadius: '9999px 9999px 0 0' }}
                />
              </div>
            )}
            {data.message && (
              <p className="mx-auto mt-7 max-w-[25rem] text-balance leading-[1.6]" style={{ fontSize: 19 }}>
                {data.message}
              </p>
            )}
            <p className="mt-4" style={{ fontFamily: hand, fontSize: 24, color: C.terra }}>
              — {host}
            </p>
          </Reveal>
        )}
      </div>

      {/* ── Countdown, on a terracotta band ────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="px-6 py-10 text-center" style={{ background: C.terra, color: '#FBF1E0' }}>
          <Kolam loops={8} color="rgba(251,241,224,0.55)" seed={11} className="mx-auto w-[220px]" />
          <p className="mt-5 leading-none" style={{ fontFamily: display, fontSize: 64, color: '#F4C45A' }}>
            {countdown.days}
          </p>
          <p className="mt-2" style={{ fontSize: 18 }}>
            {countdown.days === 1 ? 'day' : 'days'} until we step in
          </p>
          <p className="mt-1.5 tabular-nums" style={{ fontSize: 14, opacity: 0.72, letterSpacing: '0.04em' }}>
            {countdown.hours} h · {pad2(countdown.minutes)} m · {pad2(countdown.seconds)} s
          </p>
        </Reveal>
      )}

      <div className="mx-auto max-w-[32rem] px-6">
        {/* ── Programme ──────────────────────────────────────────── */}
        {(schedule.length > 0 || data.pooja) && (
          <Reveal disabled={isPreview} as="section" className="py-14">
            <Heading hi="कार्यक्रम" en="The programme" />
            {data.pooja && (
              <p className="mx-auto mt-4 max-w-[22rem] text-balance text-center leading-[1.5]" style={{ fontSize: 17, color: C.soft }}>
                {data.pooja}
              </p>
            )}
            {schedule.length > 0 && (
              <ol className="mt-8">
                {schedule.map((item, i) => (
                  <li key={`${item.title}-${i}`} className="border-b py-3.5 last:border-b-0" style={{ borderColor: C.rule }}>
                    <div className="flex items-end gap-2.5">
                      <span className="min-w-0 leading-[1.3]" style={{ fontSize: 18 }}>
                        {item.title}
                      </span>
                      {item.time && (
                        <>
                          <span
                            aria-hidden
                            className="mb-[6px] min-w-[1.25rem] flex-1 border-b-2 border-dotted"
                            style={{ borderColor: 'rgba(165,70,42,0.38)' }}
                          />
                          <span className="whitespace-nowrap tabular-nums" style={{ fontSize: 16, fontWeight: 600, color: C.terra }}>
                            {item.time}
                          </span>
                        </>
                      )}
                    </div>
                    {item.note && (
                      <p className="mt-1 leading-[1.45]" style={{ fontSize: 15, color: C.soft }}>
                        {item.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Reveal>
        )}
      </div>

      {/* ── The house, in photographs ─────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 pb-14 pt-2">
          <Reveal disabled={isPreview}>
            <Kolam loops={5} className="mx-auto mb-10 w-[140px]" seed={23} />
            <Heading hi="हमारा नया घर" en="Our new home" />
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = photos.length % 2 === 0 && i === photos.length - 1
              // Tall frames get a round window arch; the wide closing one a shallow segmental arch.
              const arch = wide ? '50% 50% 0 0 / 26% 26% 0 0' : '9999px 9999px 0 0'
              return (
                <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={i === 0 || wide ? 'col-span-2' : ''}>
                  <div className="p-[4px]" style={{ border: `1px solid ${C.terra}`, borderRadius: arch }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className={`w-full object-cover ${i === 0 ? 'aspect-[4/5]' : wide ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}
                      style={{ borderRadius: arch }}
                    />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ── How to reach us ───────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="px-6 pb-14 pt-12 text-center">
        <div className="mx-auto max-w-[30rem]">
          <Kolam loops={5} className="mx-auto mb-9 block w-[140px]" seed={41} />
          <Heading hi="पता" en="How to reach us" />
          <p className="mt-6 leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.8cqi, 28px)', color: C.terraDeep }}>
            {data.venue || 'Our new home'}
          </p>
          {data.venueAddress && (
            <p className="mx-auto mt-2 max-w-[20rem] leading-[1.5]" style={{ fontSize: 16, color: C.soft }}>
              {data.venueAddress}
            </p>
          )}
          <p className="mt-4" style={{ fontSize: 16 }}>
            {date ? `${date.weekday}, ${date.day} ${date.month}` : 'Date to be announced'}
            {time && <span style={{ color: C.soft }}> · {time}</span>}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className={`hw-btn ${button}`}
              style={{ background: C.terra, color: '#FFF8EC' }}
            >
              Get directions
            </DirectionsLink>
            {calendar && (
              <a
                href={isPreview ? undefined : calendar}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={isPreview || undefined}
                className={`hw-btn-line ${button} border`}
                style={{ borderColor: C.terra, color: C.terra }}
              >
                Add to calendar
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {eventId && (
        <div className="border-t" style={{ borderColor: C.rule }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Bless our new home"
            intro="Leave a few words for the family. Every guest who opens this invitation will see them."
            noun="blessing"
          />
        </div>
      )}

      {/* ── Sign-off, as family cards close ──────────────────────── */}
      <footer className="px-6 pb-10 pt-12 text-center">
        <Kolam loops={4} className="mx-auto w-[112px]" seed={31} />
        <p lang="hi" className="mt-6" style={{ fontSize: 17, color: C.terra }}>
          स्वागतोत्सुक
        </p>
        <p className="mt-1 leading-[1.2]" style={{ fontFamily: display, fontSize: 24 }}>
          {host}
        </p>
        <div className="mt-9">
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.terra} />
        </div>
      </footer>
    </div>
  )
}
