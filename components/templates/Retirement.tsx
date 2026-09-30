'use client'

import { useMemo, type CSSProperties } from 'react'
import WishesSection from './WishesSection'
import { libreCaslon } from './kit/fonts/libreCaslon'
import { jost } from './kit/fonts/jost'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import { numberWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Retirement — a lifetime of work.
 * Navy, cream and old gold with one warm rust. A gold pocket watch hangs from
 * its chain at the top of the card; when the page opens its hands sweep round
 * a few times and settle on the hour of the party. Below, the years of
 * service are set large and a road runs past milestone stones — the first year,
 * the decades, this one — to a sun on the horizon.
 */

const C = {
  navy: '#1C2A45',
  navyDeep: '#152036',
  paper: '#F6F0E5',
  card: '#FBF7F0',
  cream: '#F3EBDD',
  creamSoft: 'rgba(243,235,221,0.8)',
  creamFaint: 'rgba(243,235,221,0.52)',
  gold: '#C9A55E',
  goldDeep: '#A8843F',
  goldLine: 'rgba(201,165,94,0.55)',
  rust: '#AD5530',
  ink: '#1C2A45',
  inkSoft: 'rgba(28,42,69,0.74)',
  inkFaint: 'rgba(28,42,69,0.5)',
  rule: 'rgba(28,42,69,0.16)',
}

const serif = libreCaslon.style.fontFamily
const sans = jost.style.fontFamily

const f1 = (n: number) => n.toFixed(1)

/** "Mr. Suresh Nair" -> "Suresh". */
function firstName(name: string): string {
  const bare = name.replace(/^((mr|mrs|ms|miss|dr|prof|shri|sri|smt|shrimati|col|capt|maj|gen|lt|justice|er)\.?\s+)+/i, '').trim()
  return bare.split(/\s+/)[0] || name
}

const TENS: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60 }
const UNITS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 }
const TEENS: Record<string, number> = { ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 }

/**
 * Years of service from the host's milestone line: "After 34 years…",
 * "thirty-four years", "since 1992". Returns the span and its first year.
 */
function serviceOf(milestone: string, endYear: number): { years: number; from: number } | null {
  const t = milestone.toLowerCase()
  const since = t.match(/\b(19[4-9]\d|20[0-4]\d)\b/)
  if (since) {
    const from = Number(since[1])
    return from < endYear ? { years: endYear - from, from } : null
  }
  let n: number | null = null
  const digits = t.match(/\b(\d{1,2})\s*\+?\s*(years?|yrs?)\b/) || t.match(/\b(\d{1,2})\b/)
  if (digits) n = Number(digits[1])
  if (n === null) {
    const w = t.match(/\b(twenty|thirty|forty|fifty|sixty)(?:[\s-](one|two|three|four|five|six|seven|eight|nine))?\s+years?\b/)
    if (w) n = TENS[w[1]] + (w[2] ? UNITS[w[2]] : 0)
    const teen = !w && t.match(/\b(ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\s+years?\b/)
    if (teen) n = TEENS[teen[1]]
  }
  return n && n > 0 && n < 70 ? { years: n, from: endYear - n } : null
}

/** First year and up to three round decades after it; this year is the horizon. */
function milestoneYears(from: number, to: number): number[] {
  const decades: number[] = []
  for (let y = Math.ceil((from + 3) / 10) * 10; y <= to - 3; y += 10) decades.push(y)
  const pick = decades.length <= 3 ? decades : [0, Math.floor(decades.length / 2), decades.length - 1].map((i) => decades[i])
  return [from, ...pick]
}

// ─── The pocket watch ───────────────────────────────────────────────────────

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

function handAngles(time?: string) {
  const m = time?.match(/^(\d{1,2}):(\d{2})/)
  const h = m ? Number(m[1]) : 10
  const min = m ? Number(m[2]) : 10
  return { hour: (h % 12) * 30 + min * 0.5, minute: min * 6 }
}

/** Links of a watch chain along a quadratic curve. */
function Chain({ from, via, to, links = 16 }: { from: [number, number]; via: [number, number]; to: [number, number]; links?: number }) {
  return (
    <g fill="none" stroke={C.gold} strokeWidth={1.5}>
      {Array.from({ length: links }, (_, i) => {
        const t = (i + 0.5) / links
        const u = 1 - t
        const x = u * u * from[0] + 2 * u * t * via[0] + t * t * to[0]
        const y = u * u * from[1] + 2 * u * t * via[1] + t * t * to[1]
        const dx = 2 * u * (via[0] - from[0]) + 2 * t * (to[0] - via[0])
        const dy = 2 * u * (via[1] - from[1]) + 2 * t * (to[1] - via[1])
        const a = (Math.atan2(dy, dx) * 180) / Math.PI
        return i % 2 ? (
          <ellipse key={i} cx={f1(x)} cy={f1(y)} rx="5.2" ry="2.8" transform={`rotate(${f1(a)} ${f1(x)} ${f1(y)})`} />
        ) : (
          <ellipse key={i} cx={f1(x)} cy={f1(y)} rx="4.6" ry="1.2" transform={`rotate(${f1(a)} ${f1(x)} ${f1(y)})`} strokeWidth={2.2} />
        )
      })}
    </g>
  )
}

/** The dial and hands of a watch centred at (cx, cy). */
function Dial({ cx, cy, r, time, spin }: { cx: number; cy: number; r: number; time?: string; spin: boolean }) {
  const { hour, minute } = handAngles(time)
  const ticks = Array.from({ length: 60 }, (_, i) => i)
  const hand = (angle: number, from: number): CSSProperties => ({
    transform: `rotate(${angle}deg)`,
    transformOrigin: `${cx}px ${cy}px`,
    transformBox: 'view-box',
    ...(spin ? ({ ['--from' as string]: `${angle - from}deg` } as CSSProperties) : {}),
  })
  return (
    <g>
      {/* case, bezel, face */}
      <circle cx={cx} cy={cy} r={r + 12} fill={C.goldDeep} />
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={C.gold} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke={C.gold} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke="#E4CC93" strokeWidth={0.8} strokeDasharray="1.2 3.4" />
      <circle cx={cx} cy={cy} r={r + 2} fill={C.card} stroke={C.goldDeep} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={r - 13} fill="none" stroke={C.rule} strokeWidth={0.7} />
      {ticks.map((i) => {
        const a = (i / 60) * Math.PI * 2
        const long = i % 5 === 0
        const r0 = r - (long ? 7 : 4)
        return (
          <path
            key={i}
            d={`M${f1(cx + Math.sin(a) * r0)} ${f1(cy - Math.cos(a) * r0)}L${f1(cx + Math.sin(a) * (r - 1))} ${f1(cy - Math.cos(a) * (r - 1))}`}
            stroke={C.ink}
            strokeWidth={long ? 1.4 : 0.6}
          />
        )
      })}
      {ROMAN.map((n, i) => {
        const a = (i / 12) * Math.PI * 2
        const rr = r - 21
        return (
          <text
            key={n}
            x={f1(cx + Math.sin(a) * rr)}
            y={f1(cy - Math.cos(a) * rr + 4.2)}
            textAnchor="middle"
            fontFamily={serif}
            fontSize={i % 3 === 0 ? 14 : 11.5}
            fill={C.ink}
          >
            {n}
          </text>
        )
      })}
      {/* small seconds */}
      <circle cx={cx} cy={cy + r * 0.44} r={r * 0.17} fill="none" stroke={C.inkFaint} strokeWidth={0.7} />
      <path d={`M${cx} ${f1(cy + r * 0.44)}L${f1(cx + r * 0.09)} ${f1(cy + r * 0.34)}`} stroke={C.rust} strokeWidth={0.9} />
      {/* hour hand: a spade */}
      <g className={spin ? 'rt-hour' : undefined} style={hand(hour, 120)}>
        <path
          d={`M${cx - 1.6} ${cy + 8}L${cx - 1.4} ${f1(cy - r * 0.34)}C${cx - 7} ${f1(cy - r * 0.38)} ${cx - 5} ${f1(cy - r * 0.5)} ${cx} ${f1(cy - r * 0.56)}C${cx + 5} ${f1(cy - r * 0.5)} ${cx + 7} ${f1(cy - r * 0.38)} ${cx + 1.4} ${f1(cy - r * 0.34)}L${cx + 1.6} ${cy + 8}Z`}
          fill={C.navy}
        />
      </g>
      {/* minute hand */}
      <g className={spin ? 'rt-minute' : undefined} style={hand(minute, 1080)}>
        <path d={`M${cx - 1.2} ${cy + 12}L${cx - 0.6} ${f1(cy - r * 0.84)}L${cx} ${f1(cy - r * 0.9)}L${cx + 0.6} ${f1(cy - r * 0.84)}L${cx + 1.2} ${cy + 12}Z`} fill={C.navy} />
      </g>
      <circle cx={cx} cy={cy} r={4.2} fill={C.rust} />
      <circle cx={cx} cy={cy} r={1.4} fill={C.gold} />
    </g>
  )
}

/**
 * The watch on its chain. With a photograph it is drawn open, like a hunter
 * case: the lid holds the photo (an <img> laid over it) and the dial sits
 * beside it.
 */
function PocketWatch({ time, spin, open }: { time?: string; spin: boolean; open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 360 262" className="block w-full" aria-hidden style={{ overflow: 'visible' }}>
        <Chain from={[262, 56]} via={[250, 8]} to={[196, -30]} links={14} />
        <circle cx="262" cy="62" r="8" fill="none" stroke={C.gold} strokeWidth={3} />
        <rect x="255" y="68" width="14" height="10" rx="2" fill={C.gold} />
        <path d="M256 71H268M256 74H268" stroke={C.goldDeep} strokeWidth={0.8} />
        {/* lid */}
        <circle cx="92" cy="160" r="84" fill={C.goldDeep} />
        <circle cx="92" cy="160" r="84" fill="none" stroke={C.gold} strokeWidth={1.2} />
        <circle cx="92" cy="160" r="78" fill="none" stroke={C.gold} strokeWidth={4} />
        <circle cx="92" cy="160" r="71" fill={C.navyDeep} />
        {/* hinge */}
        <rect x="170" y="150" width="14" height="20" rx="3" fill={C.gold} stroke={C.goldDeep} strokeWidth={1} />
        <path d="M170 156H184M170 164H184" stroke={C.goldDeep} strokeWidth={0.9} />
        <Dial cx={262} cy={160} r={70} time={time} spin={spin} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 240 300" className="block w-full" aria-hidden style={{ overflow: 'visible' }}>
      <Chain from={[120, 52]} via={[132, 10]} to={[118, -40]} links={14} />
      <circle cx="120" cy="60" r="9" fill="none" stroke={C.gold} strokeWidth={3.2} />
      <rect x="112" y="67" width="16" height="12" rx="2.4" fill={C.gold} />
      <path d="M113 70.5H127M113 74H127" stroke={C.goldDeep} strokeWidth={0.8} />
      <Dial cx={120} cy={182} r={90} time={time} spin={spin} />
    </svg>
  )
}

// ─── The road ───────────────────────────────────────────────────────────────

/** Centre of the road at depth t (0 = at your feet, 1 = the horizon). */
function roadAt(t: number) {
  const x = 238 - 118 * (1 - t) + 64 * Math.sin(Math.PI * 1.7 * t) * Math.pow(1 - t, 0.8)
  const y = 100 + 240 * Math.pow(1 - t, 1.6)
  const depth = (y - 100) / 240
  return { x, y, w: 2 + 40 * depth, depth }
}

/** A road in perspective past milestone stones to a sun on the horizon. */
function Road({ years }: { years: number[] }) {
  const N = 60
  const pts = Array.from({ length: N + 5 }, (_, i) => {
    const t = (i - 4) / N
    const p = roadAt(t)
    const q = roadAt(Math.min(1, t + 0.002))
    const a = Math.atan2(q.y - p.y, q.x - p.x)
    return { ...p, t, nx: -Math.sin(a), ny: Math.cos(a) }
  })
  const edge = (side: 1 | -1) => pts.map((p) => `${f1(p.x + side * p.nx * p.w)} ${f1(p.y + side * p.ny * p.w)}`)
  const road = `M${edge(1).join('L')}L${edge(-1).reverse().join('L')}Z`
  const stones = years.map((y, i) => ({ y, t: 0.04 + (years.length > 1 ? i / (years.length - 1) : 0) * 0.62, i }))
  const rays = Array.from({ length: 9 }, (_, i) => Math.PI + (i + 0.5) * (Math.PI / 9))

  return (
    <svg viewBox="0 30 360 312" className="block w-full" aria-hidden strokeLinejoin="round">
      {rays.map((a, i) => (
        <path
          key={i}
          d={`M${f1(238 + Math.cos(a) * 36)} ${f1(100 + Math.sin(a) * 36)}L${f1(238 + Math.cos(a) * (i % 2 ? 48 : 56))} ${f1(100 + Math.sin(a) * (i % 2 ? 48 : 56))}`}
          stroke={C.gold}
          strokeWidth={1.6}
        />
      ))}
      <path d="M208 100A30 30 0 0 1 268 100Z" fill={C.gold} />
      <path d="M0 100H360" stroke={C.ink} strokeWidth={1} />
      <path d="M0 100C40 92 70 91 104 96C130 99 150 94 190 97" fill="none" stroke={C.inkFaint} strokeWidth={0.9} />
      <path d="M288 100C312 95 334 93 360 96" fill="none" stroke={C.inkFaint} strokeWidth={0.9} />

      <path d={road} fill={C.navy} />
      {pts.slice(0, -1).map((p, i) =>
        i % 3 === 0 ? (
          <path key={i} d={`M${f1(p.x)} ${f1(p.y)}L${f1(pts[i + 1].x)} ${f1(pts[i + 1].y)}`} stroke={C.gold} strokeWidth={f1(0.5 + 2.6 * Math.min(1, p.depth))} />
        ) : null,
      )}

      {/* milestones, first year nearest; farther ones drawn first */}
      {[...stones].reverse().map(({ y: year, t, i }) => {
        const p = roadAt(t)
        const s = 0.4 + 0.8 * p.depth
        const side = i % 2 ? 1 : -1
        const x = p.x + side * (p.w + 22 * s)
        return (
          <g key={i} transform={`translate(${f1(x)} ${f1(p.y + 4 * s)}) scale(${f1(s)})`}>
            <ellipse cx="0" cy="1" rx="19" ry="3.4" fill={C.ink} opacity={0.14} />
            <path d="M-15 0V-30A15 15 0 0 1 15 -30V0Z" fill={C.card} stroke={C.ink} strokeWidth={1.3} />
            <path d="M-15 -26V-30A15 15 0 0 1 15 -30V-26Z" fill={C.rust} stroke={C.ink} strokeWidth={1.3} />
            <text x="0" y="-9" textAnchor="middle" fontFamily={sans} fontWeight={600} fontSize="11.5" fill={C.ink}>
              {year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Template ───────────────────────────────────────────────────────────────

export default function Retirement({ data, eventId, isPreview = false }: InviteProps) {
  const name = data.honoreeName?.trim() || 'Mr. Suresh Nair'
  const first = firstName(name)
  const milestone = data.milestone?.trim() || ''
  const hosts = data.hostNames?.trim() || ''
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const photo = data.honoreePhoto && /^(https?:)?\//.test(data.honoreePhoto) ? data.honoreePhoto : null
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(`Retirement celebration — ${name}`, data.date, data.time, place, 4)

  const endYear = date?.year ?? new Date().getFullYear()
  const service = milestone ? serviceOf(milestone, endYear) : null
  const years = service ? milestoneYears(service.from, endYear) : []

  const hour = Number(data.time?.split(':')[0])
  const occasion = Number.isNaN(hour) || !data.time ? 'a celebration' : hour < 12 ? 'a morning' : hour < 17 ? 'an afternoon' : 'an evening'

  const longest = Math.max(...name.split(/\s+/).map((w) => w.length), 1)
  const nameCqi = Math.min(14, 88 / (longest * 0.62))
  const nameSize = `clamp(38px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.4)}px)`

  const WISHES_THEME: InviteTheme = {
    bg: C.paper,
    surface: C.card,
    ink: C.ink,
    muted: C.inkSoft,
    line: '#E2D7C4',
    accent: C.navy,
    onAccent: C.cream,
    heading: serif,
    body: sans,
    headingStyle: { fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 400 },
  }

  const label: CSSProperties = { fontFamily: sans, fontSize: 13, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase' }
  const button = 'rt-btn inline-flex min-h-[48px] items-center justify-center gap-2 px-6 text-[15px] font-medium tracking-[0.04em]'

  return (
    <div className="rt relative overflow-x-hidden" style={{ backgroundColor: C.paper, color: C.ink, fontFamily: sans, containerType: 'inline-size' }}>
      <style>{`
        .rt .rt-minute { animation: rt-spin 3000ms cubic-bezier(.16,.72,.18,1) 250ms backwards; }
        .rt .rt-hour { animation: rt-spin 3000ms cubic-bezier(.16,.72,.18,1) 250ms backwards; }
        @keyframes rt-spin { from { transform: rotate(var(--from)); } }
        .rt .rt-btn { transition: opacity 160ms ease; }
        .rt .rt-btn:hover { opacity: .88; }
        @media (prefers-reduced-motion: reduce) { .rt .rt-minute, .rt .rt-hour { animation: none; } }
      `}</style>

      {/* ── The watch, and whom the evening is for ────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 pb-14 pt-6 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh', backgroundColor: C.navy, color: C.cream, ...grain(0.07) }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-3 border" style={{ borderColor: C.goldLine }} />
        <div className="relative w-full max-w-[27rem]">
          <div className={`relative mx-auto ${photo ? 'w-[94%] max-w-[360px]' : 'w-[58%] max-w-[230px]'}`}>
            <PocketWatch time={data.time} spin={!isPreview} open={!!photo} />
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={name}
                className="absolute rounded-full object-cover"
                style={{ left: `${((92 - 68) / 360) * 100}%`, top: `${((160 - 68) / 262) * 100}%`, width: `${(136 / 360) * 100}%`, aspectRatio: '1 / 1' }}
              />
            )}
          </div>

          <p className="mx-auto mt-9 max-w-[19rem] leading-[1.5]" style={{ fontSize: 16.5, color: C.creamSoft, textWrap: 'balance' }}>
            {hosts ? (
              <>
                <span style={{ color: C.cream, fontWeight: 500 }}>{hosts}</span> invite you to {occasion} in honour of
              </>
            ) : (
              <>You are invited to {occasion} in honour of</>
            )}
          </p>
          <h1 className="mt-4 break-words leading-[1.05]" style={{ fontFamily: serif, fontSize: nameSize, fontWeight: 400, textWrap: 'balance' }}>
            {name}
          </h1>
          {milestone && (
            <p className="mx-auto mt-4 max-w-[20rem] leading-[1.35]" style={{ fontFamily: serif, fontSize: 'clamp(18px, 5.4cqi, 21px)', color: C.gold, textWrap: 'balance' }}>
              {milestone}
            </p>
          )}

          <div className="mx-auto my-8 flex w-[9rem] items-center gap-3" aria-hidden>
            <span className="h-px flex-1" style={{ background: C.goldLine }} />
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: C.gold }} />
            <span className="h-px flex-1" style={{ background: C.goldLine }} />
          </div>

          <p style={{ fontFamily: serif, fontSize: 'clamp(21px, 6.4cqi, 25px)' }}>
            {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
          </p>
          <p className="mt-1.5" style={{ fontSize: 16.5, color: C.creamSoft }}>
            {[time, data.venue].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      {/* ── The years, and the road to today ──────────────────────── */}
      {milestone && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-6 pt-16 text-center">
          {service ? (
            <>
              <p style={{ ...label, color: C.rust }}>A journey of</p>
              <p className="mt-2 leading-[0.9]" style={{ fontFamily: serif, fontSize: 'clamp(110px, 38cqi, 160px)', color: C.navy, fontVariantNumeric: 'lining-nums' }}>
                {service.years}
              </p>
              <p className="mt-2" style={{ fontFamily: serif, fontSize: 22, color: C.inkSoft }}>
                {numberWords(service.years)} years
              </p>
            </>
          ) : (
            <p className="mx-auto max-w-[22rem] leading-[1.3]" style={{ fontFamily: serif, fontSize: 'clamp(26px, 8cqi, 32px)' }}>
              {milestone}
            </p>
          )}
          <div className="-mx-2 mt-4">
            <Road years={years} />
          </div>
          {service && (
            <p className="mt-3" style={{ fontFamily: serif, fontSize: 20, color: C.inkSoft }}>
              {service.from} <span style={{ color: C.gold }}>—</span> {endYear}
            </p>
          )}
        </Reveal>
      )}

      {/* ── A few words from the family ───────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 py-14">
          <span aria-hidden className="block h-px w-14" style={{ background: C.rust }} />
          <p className="mt-6 leading-[1.45]" style={{ fontFamily: serif, fontSize: 'clamp(22px, 6.6cqi, 26px)', textWrap: 'pretty' }}>
            {data.message}
          </p>
          {hosts && <p className="mt-5" style={{ fontSize: 16, fontWeight: 500, color: C.rust }}>— {hosts}</p>}
        </Reveal>
      )}

      {/* ── Counting down ─────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-14 text-center">
          <div className="border-y py-8" style={{ borderColor: C.rule }}>
            <p style={{ ...label, color: C.inkFaint }}>{occasion === 'an evening' ? 'The evening is' : 'The celebration is'}</p>
            <p className="mt-3 leading-none" style={{ fontFamily: serif }}>
              <span style={{ fontSize: 60, color: C.navy }}>{countdown.days}</span>
              <span className="ml-2" style={{ fontSize: 24, color: C.inkSoft }}>{countdown.days === 1 ? 'day away' : 'days away'}</span>
            </p>
            <p className="mt-3 tabular-nums" style={{ fontSize: 15, color: C.inkSoft, letterSpacing: '0.06em' }}>
              {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
            </p>
          </div>
        </Reveal>
      )}

      {/* ── The evening, as a timetable ───────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-16 pt-2">
          <h2 className="text-center" style={{ fontFamily: serif, fontSize: 'clamp(30px, 9cqi, 36px)', fontWeight: 400 }}>
            {occasion === 'an evening' ? 'The evening' : 'The programme'}
          </h2>
          <div className="mt-7 border-t-2" style={{ borderColor: C.navy }}>
            <ol>
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`} className="grid grid-cols-[5.6rem_1fr] items-baseline gap-4 border-b py-4" style={{ borderColor: C.rule }}>
                  <span className="tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: C.rust }}>{item.time || '—'}</span>
                  <span>
                    <span className="block leading-[1.3]" style={{ fontFamily: serif, fontSize: 20 }}>{item.title}</span>
                    {item.note && <span className="mt-0.5 block" style={{ fontSize: 15, color: C.inkSoft }}>{item.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      {/* ── Where ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.navy, color: C.cream, ...grain(0.07) }}>
        <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-16 text-center">
          <p style={{ ...label, color: C.gold }}>Where</p>
          <h2 className="mt-4 leading-[1.1]" style={{ fontFamily: serif, fontSize: 'clamp(30px, 9.4cqi, 40px)', fontWeight: 400, textWrap: 'balance' }}>
            {data.venue || 'Venue to be announced'}
          </h2>
          {data.venueAddress && (
            <p className="mx-auto mt-3 max-w-[20rem] leading-[1.55]" style={{ fontSize: 16, color: C.creamSoft }}>
              {data.venueAddress}
            </p>
          )}
          <p className="mt-4" style={{ fontSize: 16.5, color: C.cream }}>
            {date ? `${date.weekday}, ${date.day} ${date.month}` : 'Date to be announced'}
            {time && ` · ${time}`}
          </p>
          {(directions || calendar) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: C.gold, color: C.navyDeep }}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={`${button} border`}
                  style={{ borderColor: C.goldLine, color: C.cream }}
                >
                  Add to calendar
                </a>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {/* ── Photographs, mounted in an album ──────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-6 pb-12 pt-16">
          <Reveal disabled={isPreview}>
            <h2 className="text-center" style={{ fontFamily: serif, fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 400 }}>Through the years</h2>
          </Reveal>
          <div className={`mt-8 grid gap-5 ${photos.length === 1 ? 'mx-auto w-[72%] grid-cols-1' : 'grid-cols-2'}`}>
            {photos.map((src, i) => (
              <Reveal
                key={`${src}-${i}`}
                disabled={isPreview}
                delay={(i % 2) * 90}
                className={photos.length > 1 && photos.length % 2 === 1 && i === 0 ? 'col-span-2' : undefined}
              >
                <figure className="relative p-2.5" style={{ background: C.card, boxShadow: '0 12px 22px -18px rgba(28,42,69,0.55)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className={`block w-full object-cover ${photos.length > 1 && photos.length % 2 === 1 && i === 0 ? 'aspect-[3/2]' : 'aspect-[4/5]'}`}
                    style={{ filter: 'saturate(0.9)' }}
                  />
                  {[
                    'left-0.5 top-0.5',
                    'right-0.5 top-0.5 rotate-90',
                    'bottom-0.5 right-0.5 rotate-180',
                    'bottom-0.5 left-0.5 -rotate-90',
                  ].map((pos) => (
                    <svg key={pos} viewBox="0 0 20 20" className={`absolute h-5 w-5 ${pos}`} aria-hidden>
                      <path d="M0 0H20L0 20Z" fill={C.navy} />
                    </svg>
                  ))}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {eventId && (
        <div style={{ borderTop: `1px solid ${C.rule}` }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title={`Messages for ${first}`}
            intro={`A memory, a thank-you, a wish for what comes next — write a few words for ${first}. Every guest can read them here.`}
            noun="message"
          />
        </div>
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ backgroundColor: C.navy, color: C.cream }}>
        <svg viewBox="0 0 40 52" className="mx-auto h-12 w-10" aria-hidden fill="none">
          <circle cx="20" cy="6" r="3.6" stroke={C.gold} strokeWidth={1.4} />
          <rect x="16.5" y="9.5" width="7" height="5" rx="1" fill={C.gold} />
          <circle cx="20" cy="32" r="17" stroke={C.gold} strokeWidth={2} />
          <circle cx="20" cy="32" r="13" stroke={C.gold} strokeWidth={0.8} />
          <path d="M20 32V22M20 32L26 35" stroke={C.gold} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
        <p className="mt-3" style={{ fontFamily: serif, fontSize: 26 }}>{name}</p>
        {date && <p className="mt-1" style={{ fontSize: 15, color: C.creamSoft }}>{date.day} {date.month} {date.year}</p>}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.creamFaint} linkColor={C.gold} />
        </div>
      </footer>
    </div>
  )
}
