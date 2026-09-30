'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { fraunces } from './kit/fonts/fraunces'
import { jost } from './kit/fonts/jost'
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
 * Janamdin — a screen-printed party poster.
 * Flat blocks of indigo, saffron and rani pink; a soft, heavy Fraunces for the
 * celebrant's age, printed slightly off-register; paper bunting and hand-cut
 * confetti that stay put. The numeral drops onto the poster once, and that is
 * the only thing in the hero that moves.
 */

const C = {
  indigo: '#1F2462',
  indigoSoft: 'rgba(31,36,98,0.72)',
  indigoFaint: 'rgba(31,36,98,0.18)',
  saffron: '#F4A21C',
  pink: '#E0337A',
  pinkDeep: '#C92468',
  cream: '#FFF4E0',
  creamSoft: 'rgba(255,244,224,0.74)',
  creamFaint: 'rgba(255,244,224,0.22)',
  paper: '#FBEEDA',
  card: '#FFF9EF',
}

const serif = fraunces.style.fontFamily
const sans = jost.style.fontFamily
const SOFT = '"SOFT" 100, "WONK" 1'

/** Fraunces at its softest and chunkiest — the poster face. */
const display = (weight = 800, extra?: CSSProperties): CSSProperties => ({
  fontFamily: serif,
  fontWeight: weight,
  fontVariationSettings: SOFT,
  ...extra,
})

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.indigo,
  muted: C.indigoSoft,
  line: '#EAD7B6',
  accent: C.pinkDeep,
  onAccent: '#FFFFFF',
  heading: serif,
  body: sans,
  headingStyle: { fontWeight: 800, fontVariationSettings: SOFT, fontSize: 36, letterSpacing: '-0.01em' },
}

// ─── Paper-cut shapes ────────────────────────────────────────────────────────

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const f1 = (n: number) => n.toFixed(1)

/**
 * Hand-cut confetti at fixed spots (percentages of the parent). Shape, colour,
 * size and angle come from a seed, and every cut corner is nudged a little so
 * no two pieces match.
 */
function Confetti({ seed, spots, colors, size = 18 }: { seed: number; spots: [number, number][]; colors: string[]; size?: number }) {
  const r = rng(seed)
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {spots.map(([x, y], i) => {
        const kind = Math.floor(r() * 5)
        const color = colors[i % colors.length]
        const rot = Math.round(r() * 360)
        const s = Math.round(size * (0.75 + r() * 0.6))
        const j = () => f1((r() - 0.5) * 3.4)
        let shape: ReactNode
        if (kind === 0) {
          shape = <polygon points={`${2 + +j()},${17 + +j()} ${10 + +j()},${2 + +j()} ${18 + +j()},${16 + +j()}`} fill={color} />
        } else if (kind === 1) {
          shape = <circle cx="10" cy="10" r={f1(4 + r() * 1.5)} fill={color} />
        } else if (kind === 2) {
          shape = <polygon points={`${7 + +j()},1 ${13 + +j()},${1.5 + +j() / 2} ${12.5 + +j()},19 ${6.5 + +j()},${18.5 + +j() / 2}`} fill={color} />
        } else if (kind === 3) {
          shape = <polyline points="1.5,13.5 5.5,6.5 9.5,13.5 13.5,6.5 18.5,13" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        } else {
          shape = <path d="M3 17 C 2 7, 14 3, 15 10 S 8 16, 8 11" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        }
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            width={s}
            height={s}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${rot}deg)`, overflow: 'visible' }}
          >
            {shape}
          </svg>
        )
      })}
    </div>
  )
}

/** A string of paper pennants sagging across the top of the poster. */
function Bunting({ seed, colors, flags = 9, className }: { seed: number; colors: string[]; flags?: number; className?: string }) {
  const r = rng(seed)
  const sag = 54
  const point = (t: number) => [-6 + 412 * t, 6 + 4 * sag * t * (1 - t)]
  const pennants = Array.from({ length: flags }, (_, i) => {
    const t = (i + 0.5) / flags
    const [x, y] = point(t)
    const angle = (Math.atan2(4 * sag * (1 - 2 * t), 412) * 180) / Math.PI
    const w = 30 + r() * 5
    const h = 38 + r() * 8
    const tip = (r() - 0.5) * 6
    const pts = `${f1(-w / 2 + (r() - 0.5) * 2)},0 ${f1(w / 2 + (r() - 0.5) * 2)},0 ${f1(tip)},${f1(h)}`
    return { x, y, angle, pts, color: colors[i % colors.length] }
  })
  return (
    <svg viewBox="0 0 400 112" className={className} aria-hidden style={{ overflow: 'visible' }}>
      <path d={`M-6 6 Q 200 ${8 + sag * 2 - 2} 406 6`} fill="none" stroke={C.cream} strokeWidth="1.4" opacity="0.8" />
      {pennants.map((p, i) => (
        <g key={i} transform={`translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(p.angle)})`}>
          <polygon points={p.pts} fill={p.color} />
        </g>
      ))}
    </svg>
  )
}

/** Pinking-shear edge along the top of a colour block. */
const pinked = (color: string): CSSProperties => ({
  height: 9,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Cpath d='M0 9.5 L8 0 L16 9.5Z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat-x',
  backgroundSize: '16px 9px',
  backgroundPosition: 'center bottom',
})

/** A die-cut sticker: cream outline, hard offset shadow, a slight tilt. */
function Sticker({
  children,
  bg,
  color,
  tilt = -4,
  size = 18,
  className = '',
}: {
  children: ReactNode
  bg: string
  color: string
  tilt?: number
  size?: number
  className?: string
}) {
  return (
    <span
      className={`inline-block rounded-[12px] px-3.5 pb-[7px] pt-[5px] leading-none ${className}`}
      style={{
        ...display(800),
        fontSize: size,
        background: bg,
        color,
        transform: `rotate(${tilt}deg)`,
        boxShadow: `0 0 0 3px ${C.cream}, 3px 4px 0 3px rgba(23,27,77,0.28)`,
      }}
    >
      {children}
    </span>
  )
}

/** A paper-cut cake: two tiers, dripping icing, three candles. */
function Cake({ className }: { className?: string }) {
  const drips = (x0: number, x1: number, y: number, depth: number[]) => {
    const n = depth.length
    const w = (x1 - x0) / n
    let d = `M${x0} ${y - 4}`
    depth.forEach((dp, i) => {
      const a = x0 + i * w
      d += ` L${f1(a + w * 0.1)} ${y} L${f1(a + w * 0.18)} ${f1(y + dp)} Q${f1(a + w * 0.5)} ${f1(y + dp + 7)} ${f1(a + w * 0.82)} ${f1(y + dp)} L${f1(a + w * 0.9)} ${y}`
    })
    return `${d} L${x1} ${y - 4} Z`
  }
  return (
    <svg viewBox="0 0 200 186" className={className} aria-hidden style={{ overflow: 'visible', transform: 'rotate(4deg)' }}>
      {[72, 98, 124].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${58 - (i % 2) * 4}V${24 + (i % 2) * 2}h9V${58 - (i % 2) * 4}Z`} fill={C.cream} />
          <path d={`M${x + 4.5} ${6 + (i % 2) * 2}c5 6 6.5 10.5 0 15.5c-6.5-5-5-9.5 0-15.5Z`} fill={C.saffron} />
        </g>
      ))}
      <path d="M49 60 Q49 55 55 55 H146 Q151.5 55 151.5 61 L152.5 104 H48Z" fill={C.pink} />
      <path d={drips(49, 152, 58, [10, 16, 7, 13, 18, 9])} fill={C.cream} />
      <path d="M23 106 Q23 100 30 100 H171 Q178 100.5 178 107 L179 158 H22Z" fill={C.saffron} />
      <path d={drips(23, 178, 103, [12, 20, 9, 16, 22, 11, 17])} fill={C.pink} />
      <path d="M6 158 H194 Q199 158 197 163 L192 170 H9 L3.5 163 Q2 158 6 158Z" fill={C.cream} />
    </svg>
  )
}

function Quote({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-hidden>
      {[0, 24].map((dx) => (
        <path
          key={dx}
          transform={`translate(${dx} 0)`}
          d="M17 2.5C9.5 4.4 3.2 9.8 2.4 18.6a8.1 8.1 0 1 0 9.4-6.4c-1-.1-1.8 0-2.6.3C10 9 13 6.4 18 5.3Z"
          fill={color}
        />
      ))}
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const suffix = (n: number) => {
  const t = n % 100
  if (t >= 11 && t <= 13) return 'th'
  return ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'
}

/** Splits "7:00 PM" so the meridiem can sit smaller beside the figures. */
function splitTime(value?: string): [string, string] | null {
  if (!value) return null
  const m = value.trim().match(/^(\d{1,2}(?::\d{2})?)\s*([AaPp]\.?[Mm]\.?)$/)
  return m ? [m[1], m[2].replace(/\./g, '').toUpperCase()] : null
}

/** A cqi size for the longest word so heavy display type never overflows. */
function fitSize(text: string, max: number, per = 0.6, room = 88) {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1)
  const cqi = Math.min(max, room / (longest * per))
  return `clamp(${room < 60 ? 24 : 30}px, ${cqi.toFixed(1)}cqi, ${Math.round(cqi * 4.6)}px)`
}

function Time({ value, big, small }: { value: string; big: CSSProperties; small: CSSProperties }) {
  const parts = splitTime(value)
  if (!parts) return <span style={big}>{value}</span>
  return (
    <span style={big}>
      {parts[0]}
      <span style={small}> {parts[1]}</span>
    </span>
  )
}

const HERO_SPOTS: [number, number][] = [
  [46, 21], [88, 23], [72, 31], [95, 49], [4, 70], [10, 82], [84, 90], [94, 76], [62, 97], [30, 98], [18, 18],
]
const FOOT_SPOTS: [number, number][] = [[8, 18], [86, 14], [18, 70], [78, 64], [50, 8], [94, 48], [4, 44], [62, 84]]

// ─── Template ───────────────────────────────────────────────────────────────

export default function IndianBirthday({ data, eventId, isPreview = false }: InviteProps) {
  const name = data.celebrantName?.trim() || 'Kavya'
  const ageText = data.age?.trim() || ''
  const ageMatch = ageText.match(/^(\d{1,3})(?:\s*(?:st|nd|rd|th))?$/i)
  const age = ageMatch ? Number(ageMatch[1]) : null
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const portrait = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? data.celebrantPhoto : null
  const theme = data.theme?.trim()
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const possessive = `${name}’s`
  const partyTitle = age ? `${possessive} ${age}${suffix(age)} birthday` : `${possessive} birthday party`
  const calendar = calendarHref(partyTitle, data.date, data.time, [data.venue, data.venueAddress].filter(Boolean).join(', '), 4)
  const numeral = age !== null ? String(age) : ''
  const numeralCqi = numeral.length > 2 ? 50 : numeral.length === 1 ? 84 : 70

  const strips = photos.length > 1 ? [photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)] : [photos]

  const label: CSSProperties = { fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }

  return (
    <div
      className="jd relative overflow-x-hidden"
      style={{ backgroundColor: C.paper, color: C.indigo, fontFamily: sans, containerType: 'inline-size', ...grain(0.045) }}
    >
      <style>{`
        .jd .jd-land { animation: jd-land 950ms cubic-bezier(.3,.9,.35,1.25) 250ms both; transform-origin: 40% 90%; }
        @keyframes jd-land {
          0% { opacity: 0; transform: translateY(-70%) rotate(-16deg) scale(1.08); }
          55% { opacity: 1; transform: translateY(3%) rotate(-2deg) scale(1.02, .94); }
          78% { transform: translateY(-2%) rotate(-5deg) scale(.99, 1.02); }
          100% { opacity: 1; transform: rotate(-4deg); }
        }
        .jd .jd-btn { transition: transform 160ms ease, box-shadow 160ms ease; }
        .jd .jd-btn:active { transform: translate(2px, 2px); box-shadow: none; }
        @media (prefers-reduced-motion: reduce) {
          .jd .jd-land { animation: none; transform: rotate(-4deg); }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.indigo} background="rgba(255,244,224,0.92)" border={C.cream} />

      {/* ── The poster ────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ background: C.indigo, color: C.cream, minHeight: isPreview ? 560 : '100svh' }}
      >
        <div className="relative mx-auto flex w-full max-w-[34rem] flex-1 flex-col">
          <Bunting seed={3} colors={[C.pink, C.saffron, C.cream]} className="relative z-[1] -mt-1 block w-full" />
          <Confetti seed={11} spots={HERO_SPOTS} colors={[C.saffron, C.pink, C.cream]} />

          <div className="relative z-[2] flex flex-1 flex-col justify-center px-5 pb-10 pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Sticker bg={C.pink} color={C.cream} tilt={-5} size={17}>
                  You&rsquo;re invited
                </Sticker>
                {age !== null && (
                  <p
                    className="mt-6 break-words leading-[0.95]"
                    style={{ ...display(800), fontSize: fitSize(name, portrait ? 15 : 17, 0.6, portrait ? 54 : 88), letterSpacing: '-0.01em' }}
                  >
                    {name}
                  </p>
                )}
                {age === null && (
                  <p className="mt-6 italic" style={{ ...display(500), fontSize: 'clamp(22px, 7cqi, 32px)', color: C.creamSoft }}>
                    Come celebrate
                  </p>
                )}
              </div>
              {portrait && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portrait}
                  alt={name}
                  className="mt-3 shrink-0 rounded-full object-cover"
                  style={{
                    width: 'clamp(96px, 31cqi, 144px)',
                    height: 'clamp(96px, 31cqi, 144px)',
                    transform: 'rotate(6deg)',
                    boxShadow: `0 0 0 5px ${C.cream}, 5px 7px 0 5px ${C.pink}`,
                  }}
                />
              )}
            </div>

            {age !== null ? (
              <h1 className="mt-2">
                <span className="sr-only">{name} is turning {age}</span>
                <span aria-hidden className="block" style={{ ...label, fontSize: 15, color: C.saffron, letterSpacing: '0.24em' }}>
                  is turning
                </span>
                <span aria-hidden className="relative mt-1 block text-right">
                  <svg viewBox="0 0 400 120" className="absolute left-[-6%] top-[44%] w-[112%]" aria-hidden style={{ overflow: 'visible' }}>
                    <path
                      d="M-14 70 C 10 66, 30 34, 58 42 C 86 50, 80 96, 54 90 C 30 84, 44 40, 100 44 C 170 50, 250 104, 330 84 C 370 74, 392 58, 414 52"
                      fill="none"
                      stroke={C.saffron}
                      strokeWidth="7"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                  <span
                    className="jd-land relative inline-block tabular-nums"
                    style={{
                      ...display(900),
                      fontSize: `clamp(150px, ${numeralCqi}cqi, ${numeralCqi * 4.4}px)`,
                      lineHeight: 0.8,
                      letterSpacing: '-0.045em',
                      color: C.pink,
                      textShadow: `0.035em 0.035em 0 ${C.saffron}`,
                      paddingRight: '0.06em',
                    }}
                  >
                    {numeral}
                  </span>
                </span>
              </h1>
            ) : (
              <h1 className="mt-1">
                <span
                  className="jd-land block break-words"
                  style={{
                    ...display(900),
                    fontSize: fitSize(possessive, 26, 0.62),
                    lineHeight: 0.9,
                    letterSpacing: '-0.03em',
                    color: C.pink,
                    textShadow: `0.04em 0.04em 0 ${C.saffron}`,
                  }}
                >
                  {possessive}
                </span>
                <span className="mt-1 block" style={{ ...display(800), fontSize: 'clamp(36px, 13.5cqi, 62px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  birthday
                </span>
                {ageText && (
                  <span className="mt-3 block" style={{ ...label, fontSize: 15, color: C.saffron }}>
                    turning {ageText}
                  </span>
                )}
                <Cake className="-mt-6 ml-auto mr-1 block w-[46%] max-w-[210px]" />
              </h1>
            )}

            {theme && (
              <div className="mt-8">
                <Sticker bg={C.saffron} color={C.indigo} tilt={3} size={16}>
                  <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', marginRight: 8, verticalAlign: '2px' }}>
                    Theme
                  </span>
                  {theme}
                </Sticker>
              </div>
            )}
          </div>
        </div>

        {/* Saffron band: the facts, printed large. */}
        <div className="relative z-[2]" style={{ color: C.indigo }}>
          <div aria-hidden style={pinked(C.saffron)} />
          <div style={{ background: C.saffron }}>
            <div className="mx-auto max-w-[34rem] px-5 pb-7 pt-4">
              {date ? (
                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
                  <div className="min-w-0">
                    <p style={{ ...label, fontSize: 13, color: C.indigoSoft }}>{date.weekday}</p>
                    <p className="mt-1 whitespace-nowrap leading-none" style={{ ...display(800), fontSize: 'clamp(21px, 7.8cqi, 38px)' }}>
                      {date.day} {date.month}
                    </p>
                  </div>
                  {time && (
                    <div className="shrink-0 text-right">
                      <p style={{ ...label, fontSize: 13, color: C.indigoSoft }}>Starts at</p>
                      <p className="mt-1 whitespace-nowrap leading-none">
                        <Time
                          value={time}
                          big={{ ...display(800), fontSize: 'clamp(21px, 7.8cqi, 38px)' }}
                          small={{ fontSize: '0.5em', letterSpacing: '0.04em' }}
                        />
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="leading-tight" style={{ ...display(800), fontSize: 26 }}>
                  Date to be announced{time && <span style={{ fontWeight: 600 }}> · {time}</span>}
                </p>
              )}
              <p className="mt-4 border-t-2 pt-3" style={{ ...display(700), fontSize: 19, borderColor: C.indigo, lineHeight: 1.25 }}>
                {data.venue || 'The venue'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── A note from the celebrant ─────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[32rem] px-6 pb-2 pt-16">
          <Quote color={C.pink} className="h-8 w-[52px]" />
          <p className="mt-4 italic" style={{ ...display(500), fontSize: 'clamp(22px, 6.6cqi, 28px)', lineHeight: 1.32 }}>
            {data.message}
          </p>
          <p className="mt-5" style={{ ...display(800), fontSize: 19, color: C.pinkDeep }}>
            &mdash; {name}
          </p>
        </Reveal>
      )}

      {/* ── The party pass ────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[32rem] px-5 pb-16 pt-12">
        <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
          <div className="rounded-t-[18px] px-6 pb-7 pt-6" style={{ background: C.saffron, color: C.indigo }}>
            <div className="flex items-baseline justify-between">
              <p style={{ ...label, color: C.indigoSoft }}>Party pass</p>
              {age !== null && <p style={{ ...label, color: C.indigoSoft }}>No. {pad2(age)}</p>}
            </div>
            <h2 className="mt-2 leading-[1.02]" style={{ ...display(800), fontSize: 'clamp(28px, 8.4cqi, 36px)' }}>
              {partyTitle}
            </h2>

            <div className="mt-6 border-t-2 pt-5" style={{ borderColor: C.indigo }}>
              <p style={{ ...label, color: C.indigoSoft }}>When</p>
              <p className="mt-1.5" style={{ ...display(700), fontSize: 23, lineHeight: 1.15 }}>
                {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              {time && <p className="mt-1" style={{ fontSize: 17, fontWeight: 500 }}>{time} onwards</p>}
            </div>

            <div className="mt-5 border-t-2 pt-5" style={{ borderColor: C.indigo }}>
              <p style={{ ...label, color: C.indigoSoft }}>Where</p>
              <p className="mt-1.5" style={{ ...display(700), fontSize: 23, lineHeight: 1.15 }}>{data.venue || 'The venue'}</p>
              {data.venueAddress && <p className="mt-1" style={{ fontSize: 16, lineHeight: 1.5 }}>{data.venueAddress}</p>}
            </div>

            {theme && (
              <div className="mt-5 border-t-2 pt-5" style={{ borderColor: C.indigo }}>
                <p style={{ ...label, color: C.indigoSoft }}>Dress to the theme</p>
                <p className="mt-1.5 italic" style={{ ...display(700), fontSize: 23, lineHeight: 1.15 }}>{theme}</p>
              </div>
            )}

            {(directions || calendar) && (
              <div className="mt-7 flex flex-wrap gap-3">
                <DirectionsLink
                  href={directions}
                  isPreview={isPreview}
                  className="jd-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 text-[15px] font-semibold"
                  style={{ background: C.indigo, color: C.cream, boxShadow: `3px 3px 0 ${C.pinkDeep}` }}
                >
                  Directions <Arrow />
                </DirectionsLink>
                {calendar && (
                  <a
                    href={isPreview ? undefined : calendar}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={isPreview || undefined}
                    className="jd-btn inline-flex min-h-[46px] items-center gap-2 rounded-full border-2 px-5 text-[15px] font-semibold"
                    style={{ borderColor: C.indigo, color: C.indigo }}
                  >
                    Add to calendar
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tear-off stub */}
          <div className="relative rounded-b-[18px] px-6 pb-6 pt-7" style={{ background: C.pink, color: C.cream }}>
            <span aria-hidden className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: C.paper }} />
            <span aria-hidden className="absolute right-0 top-0 h-7 w-7 -translate-y-1/2 translate-x-1/2 rounded-full" style={{ background: C.paper }} />
            <span aria-hidden className="absolute left-6 right-6 top-0 border-t-[3px] border-dotted" style={{ borderColor: C.paper }} />
            {countdown ? (
              <div className="flex items-end justify-between gap-4">
                <p className="leading-none">
                  <span className="tabular-nums" style={{ ...display(900), fontSize: 54 }}>{countdown.days}</span>
                  <span className="ml-2" style={{ ...display(700), fontSize: 20 }}>{countdown.days === 1 ? 'day' : 'days'} to go</span>
                </p>
                <p className="pb-1 text-right tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: C.cream }}>
                  {countdown.hours}h {pad2(countdown.minutes)}m {pad2(countdown.seconds)}s
                </p>
              </div>
            ) : (
              <div className="flex items-baseline justify-between gap-4">
                <p className="whitespace-nowrap" style={{ ...display(800), fontSize: 'clamp(19px, 6.4cqi, 24px)' }}>Save the date</p>
                {date && (
                  <p className="whitespace-nowrap tabular-nums" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.06em' }}>
                    {date.dayPadded}.{pad2(Number(data.date.slice(5, 7)))}.{date.year}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── The plan ──────────────────────────────────────────────── */}
      {schedule.length > 0 && (
        <section style={{ background: C.indigo, color: C.cream }}>
          <div aria-hidden style={{ ...pinked(C.indigo), backgroundColor: C.paper }} />
          <Reveal disabled={isPreview} className="mx-auto max-w-[32rem] px-6 pb-16 pt-12">
            <Sticker bg={C.saffron} color={C.indigo} tilt={-3} size={22}>
              The plan
            </Sticker>
            <ol className="mt-8">
              {schedule.map((item, i) => (
                <li
                  key={`${item.title}-${i}`}
                  className="grid grid-cols-[7.8rem_1fr] items-baseline gap-3 border-b-2 border-dashed py-4"
                  style={{ borderColor: C.creamFaint }}
                >
                  <span className="whitespace-nowrap leading-none" style={{ color: C.saffron }}>
                    {item.time ? (
                      <Time value={item.time} big={{ ...display(800), fontSize: 25 }} small={{ fontSize: 13, fontFamily: sans, fontWeight: 600, letterSpacing: '0.06em' }} />
                    ) : (
                      <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: C.pink }} />
                    )}
                  </span>
                  <span>
                    <span className="block" style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.3 }}>{item.title}</span>
                    {item.note && <span className="mt-1 block" style={{ fontSize: 15, color: C.creamSoft }}>{item.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      )}

      {/* ── Photo-booth strips ────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="overflow-hidden" style={{ background: C.pink }}>
          <div className="mx-auto max-w-[32rem] px-5 pb-16 pt-12">
            <Reveal disabled={isPreview}>
              <Sticker bg={C.cream} color={C.pinkDeep} tilt={2} size={22}>
                Snapshots
              </Sticker>
            </Reveal>
            <div className={`mt-9 flex items-start justify-center ${strips.length > 1 ? 'gap-4' : ''}`}>
              {strips.map((strip, s) => (
                <Reveal
                  key={s}
                  disabled={isPreview}
                  delay={s * 120}
                  className={strips.length > 1 ? 'w-1/2' : 'w-[62%]'}
                  style={{ marginTop: s === 1 ? 36 : 0 }}
                >
                  <figure
                    className="p-2 pb-0"
                    style={{ background: C.card, transform: `rotate(${s === 0 ? -2.5 : 2}deg)`, boxShadow: `4px 5px 0 ${C.pinkDeep}` }}
                  >
                    <div className="flex flex-col gap-2">
                      {strip.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={`${src}-${i}`} src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                      ))}
                    </div>
                    <figcaption className="py-2.5 text-center" style={{ ...display(800), fontSize: 15, color: C.indigo }}>
                      {name}{age !== null ? ` · ${age}` : ''}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title="Birthday wishes"
          intro={`Leave a few words for ${name}. Your message appears here for every guest.`}
        />
      )}

      {/* ── Foot of the poster ────────────────────────────────────── */}
      <footer className="relative overflow-hidden" style={{ background: C.indigo, color: C.cream }}>
        <div aria-hidden style={{ ...pinked(C.indigo), backgroundColor: C.paper }} />
        <div className="relative mx-auto max-w-[32rem] px-6 pb-9 pt-12 text-center">
          <Confetti seed={29} spots={FOOT_SPOTS} colors={[C.pink, C.saffron, C.cream]} size={15} />
          <p className="relative" style={{ ...display(900), fontSize: 'clamp(32px, 10.6cqi, 42px)', lineHeight: 1, color: C.saffron }}>
            See you there!
          </p>
          <p className="relative mt-3" style={{ fontSize: 16, color: C.creamSoft }}>
            {partyTitle}
            {date ? ` · ${date.day} ${date.monthShort} ${date.year}` : ''}
          </p>
          <div className="relative mt-10">
            <Credit isPreview={isPreview} color={C.creamSoft} linkColor={C.saffron} />
          </div>
        </div>
      </footer>
    </div>
  )
}
