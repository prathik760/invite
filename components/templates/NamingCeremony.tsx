'use client'

import { useMemo, type CSSProperties } from 'react'
import WishesSection from './WishesSection'
import { youngSerif } from './kit/fonts/youngSerif'
import { caveat } from './kit/fonts/caveat'
import { jost } from './kit/fonts/jost'
import { Sprig } from './kit/botanical'
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
import type { InviteTheme } from './kit/theme'

/*
 * Namakaran — a soft nursery print.
 * Cream paper, flat peach and sage shapes and fine line art: a cot mobile of
 * a crescent moon and stars that swings gently once when the page opens and
 * then settles. The baby's gender (as the host types it) tints the line work —
 * blue-sage for a boy, rose for a girl, sage otherwise.
 */

const BASE = {
  paper: '#F7F0E4',
  card: '#FCF8F1',
  ink: '#3D3932',
  inkSoft: 'rgba(61,57,50,0.7)',
  inkFaint: 'rgba(61,57,50,0.5)',
  rule: '#E3D6C1',
  peach: '#F2D3BE',
  peachLine: '#D99C79',
  peachDeep: '#B9704C',
}

const ACCENTS = {
  boy: { line: '#7D99A4', deep: '#4F6F7B', wash: 'rgba(125,153,164,0.14)' },
  girl: { line: '#CF9291', deep: '#9E5654', wash: 'rgba(207,146,145,0.15)' },
  neutral: { line: '#8B9D80', deep: '#5B6F53', wash: 'rgba(139,157,128,0.15)' },
}

const display = youngSerif.style.fontFamily
const hand = caveat.style.fontFamily
const sans = jost.style.fontFamily

function genderOf(value?: string): 'boy' | 'girl' | 'neutral' {
  const g = (value || '').trim().toLowerCase()
  if (/\b(girl|female|daughter|f)\b/.test(g)) return 'girl'
  if (/\b(boy|male|son|m)\b/.test(g)) return 'boy'
  return 'neutral'
}

// ─── Line art ───────────────────────────────────────────────────────────────

const f1 = (n: number) => n.toFixed(1)

/** A five-point star with softened, slightly uneven points. */
function starPath(r: number, wobble: number[]) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = (i % 2 === 0 ? r : r * 0.48) * (1 + (wobble[i % wobble.length] ?? 0))
    pts.push(`${f1(Math.cos(a) * rr)} ${f1(Math.sin(a) * rr)}`)
  }
  return `M${pts.join(' L')}Z`
}

/** Crescent opening to the right, centred on the origin. */
function moonPath(r: number) {
  return `M0 ${-r} A${r} ${r} 0 1 0 0 ${r} A${f1(r * 1.25)} ${f1(r * 1.25)} 0 0 1 0 ${-r}Z`
}

interface Hanging {
  t: number
  drop: number
  kind: 'star' | 'moon'
  r: number
  tilt: number
  dur: number
}

const MOBILE: Hanging[] = [
  { t: 0.06, drop: 54, kind: 'star', r: 10, tilt: 8, dur: 2.9 },
  { t: 0.27, drop: 88, kind: 'star', r: 14, tilt: -6, dur: 3.3 },
  { t: 0.5, drop: 62, kind: 'moon', r: 30, tilt: -24, dur: 3.8 },
  { t: 0.73, drop: 100, kind: 'star', r: 12, tilt: 12, dur: 3.1 },
  { t: 0.94, drop: 46, kind: 'star', r: 9, tilt: -10, dur: 2.7 },
]

/** A cot mobile: a bowed rod on a single thread, with a moon and stars on strings. */
function Mobile({ line, className, compact }: { line: string; className?: string; compact?: boolean }) {
  const shorten = compact ? 0.62 : 1
  const barY = (t: number) => 44 - 52 * t * (1 - t)
  const height = compact ? 150 : 180
  return (
    <svg viewBox={`0 0 320 ${height}`} className={className} fill="none" aria-hidden style={{ overflow: 'visible' }}>
      <circle cx="160" cy={compact ? 78 : 104} r={compact ? 52 : 62} fill={BASE.peach} />
      <g className="nc-rock" style={{ transformOrigin: '160px 0px', transformBox: 'view-box' }}>
        <path d="M160 -4V31" stroke={line} strokeWidth="1" />
        <path d="M44 44Q160 18 276 44" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="44" cy="44" r="2.4" fill={line} />
        <circle cx="276" cy="44" r="2.4" fill={line} />
        {MOBILE.map((h, i) => {
          const x = 44 + 232 * h.t
          const y = barY(h.t)
          const drop = h.drop * shorten
          const cy = y + drop + h.r
          return (
            <g
              key={i}
              className="nc-swing"
              style={{ transformOrigin: `${f1(x)}px ${f1(y)}px`, transformBox: 'view-box', animationDuration: `${h.dur}s`, animationDelay: `${150 + i * 60}ms` }}
            >
              <path d={`M${f1(x)} ${f1(y)}V${f1(cy - h.r * (h.kind === 'moon' ? 1 : 0.9))}`} stroke={line} strokeWidth="0.9" />
              <g transform={`translate(${f1(x)} ${f1(cy)}) rotate(${h.tilt})`}>
                {h.kind === 'moon' ? (
                  <path d={moonPath(h.r)} fill={BASE.card} stroke={line} strokeWidth="1.4" strokeLinejoin="round" />
                ) : (
                  <path
                    d={starPath(h.r, [0.04, -0.03, -0.06, 0.02, 0.05, -0.04, 0, 0.03, -0.05, 0.02])}
                    fill={i % 2 ? BASE.peach : BASE.card}
                    stroke={i % 2 ? BASE.peachLine : line}
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** A few tiny sparkle stars for margins. */
function Twinkle({ color, className, style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden fill="none">
      <path d="M10 2.5c.6 4.3 2.8 6.6 7.3 7.5-4.5.9-6.7 3.2-7.3 7.5-.6-4.3-2.8-6.6-7.3-7.5 4.5-.9 6.7-3.2 7.3-7.5Z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  )
}

/** A single leaf on a short stalk, for the programme's vine. */
function Leaf({ color, fill, flip }: { color: string; fill: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 28 16" className="h-[18px] w-8" style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden fill="none">
      <path d="M1 8h5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M6 8c4-6.2 13-7.4 20-3.2C20.5 12 11 13.8 6 8Z" fill={fill} stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M7.5 8c5-1.6 10-2.4 15.5-2.8" stroke={color} strokeWidth="0.7" opacity="0.7" />
    </svg>
  )
}

// ─── Template ───────────────────────────────────────────────────────────────

export default function NamingCeremony({ data, eventId, isPreview = false }: InviteProps) {
  const baby = data.babyName?.trim() || 'Aarav'
  const parents = data.parentNames?.trim() || 'Anjali & Suresh'
  const gender = genderOf(data.babyGender)
  const A = ACCENTS[gender]
  const child = gender === 'boy' ? 'son' : gender === 'girl' ? 'daughter' : 'little one'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const columns = photos.length > 1 ? [photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)] : [photos]
  const photo = data.babyPhoto && /^(https?:)?\//.test(data.babyPhoto) ? data.babyPhoto : null
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(`Naming ceremony of ${baby}`, data.date, data.time, [data.venue, data.venueAddress].filter(Boolean).join(', '), 3)

  const longest = Math.max(...baby.split(/\s+/).map((w) => w.length), 1)
  const nameCqi = Math.min(21, 86 / (longest * 0.7))
  const nameSize = `clamp(20px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.4)}px)`

  const label: CSSProperties = { fontFamily: sans, fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: A.deep }

  const WISHES_THEME: InviteTheme = {
    bg: BASE.paper,
    surface: BASE.card,
    ink: BASE.ink,
    muted: BASE.inkSoft,
    line: BASE.rule,
    accent: A.deep,
    onAccent: '#FFFFFF',
    heading: display,
    body: sans,
    headingStyle: { fontSize: 'clamp(26px, 8.4cqi, 32px)', fontWeight: 400 },
  }

  const button = 'nc-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 text-[15px] font-medium'

  return (
    <div
      className="nc relative overflow-x-hidden"
      style={{ backgroundColor: BASE.paper, color: BASE.ink, fontFamily: sans, containerType: 'inline-size', ...grain(0.045) }}
    >
      <style>{`
        .nc .nc-swing { animation-name: nc-swing; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .nc .nc-rock { animation: nc-rock 4.2s ease-in-out 100ms both; }
        @keyframes nc-swing {
          0% { transform: rotate(9deg); } 20% { transform: rotate(-6deg); } 40% { transform: rotate(3.6deg); }
          60% { transform: rotate(-2deg); } 80% { transform: rotate(.8deg); } 100% { transform: rotate(0deg); }
        }
        @keyframes nc-rock {
          0% { transform: rotate(-2.4deg); } 30% { transform: rotate(1.6deg); } 60% { transform: rotate(-.7deg); } 100% { transform: rotate(0deg); }
        }
        .nc .nc-btn { transition: opacity 160ms ease, background-color 160ms ease; }
        .nc .nc-btn:hover { opacity: .88; }
        @media (prefers-reduced-motion: reduce) {
          .nc .nc-swing, .nc .nc-rock { animation: none; }
        }
      `}</style>

      {/* ── The print ─────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 pb-14 pt-10 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh' }}
      >
        <Twinkle color={A.line} className="absolute left-[9%] top-[14%] h-4 w-4" />
        <Twinkle color={BASE.peachLine} className="absolute right-[10%] top-[9%] h-3 w-3" />

        <div className="relative w-full max-w-[26rem]">
          <Mobile line={A.line} compact={!!photo} className="mx-auto w-[84%] max-w-[320px]" />

          {photo && (
            <div className="relative mx-auto -mt-2 w-[46%] max-w-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={baby}
                className="block aspect-[4/5] w-full object-cover"
                style={{ borderRadius: '999px 999px 16px 16px', boxShadow: `0 0 0 6px ${BASE.paper}, 0 0 0 7px ${A.line}` }}
              />
            </div>
          )}

          <p
            className="mt-6 inline-block"
            style={{ fontFamily: hand, fontSize: 'clamp(30px, 9cqi, 40px)', fontWeight: 500, color: BASE.peachDeep, transform: 'rotate(-4deg)', lineHeight: 1 }}
          >
            Namakaran
          </p>

          <p className="mx-auto mt-5 max-w-[22rem] leading-[1.3]" style={{ fontFamily: display, fontSize: 'clamp(19px, 5.6cqi, 23px)', textWrap: 'balance' }}>
            {parents}
          </p>
          <p className="mx-auto mt-2 max-w-[18rem] leading-[1.5]" style={{ fontSize: 16, color: BASE.inkSoft, textWrap: 'balance' }}>
            invite you to the naming ceremony of their {child}
          </p>

          <h1 className="mt-4 break-words leading-[1]" style={{ fontFamily: display, fontSize: nameSize, color: A.deep, letterSpacing: '-0.01em' }}>
            {baby}
          </h1>

          <div className="mx-auto mt-7 flex max-w-[20rem] items-center gap-3" aria-hidden>
            <span className="h-px flex-1" style={{ background: BASE.rule }} />
            <Twinkle color={BASE.peachLine} className="h-3.5 w-3.5" />
            <span className="h-px flex-1" style={{ background: BASE.rule }} />
          </div>

          <p className="mt-5" style={{ fontSize: 17, fontWeight: 500 }}>
            {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
          </p>
          <p className="mt-1" style={{ fontSize: 16, color: BASE.inkSoft }}>
            {[time, data.venue].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      {/* ── When & where ──────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-6 pt-2">
        <div
          className="relative px-6 pb-10 pt-16 text-center"
          style={{ background: BASE.card, borderRadius: '999px 999px 28px 28px', boxShadow: `0 0 0 1px ${A.line}, 0 0 0 7px ${BASE.card}, 0 0 0 8px ${BASE.rule}` }}
        >
          <Sprig color={A.line} fill={A.wash} seed={14} leaves={7} className="mx-auto w-[112px]" />
          <p className="mt-6" style={label}>The ceremony</p>
          {date ? (
            <>
              <p className="mt-3 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 36px)' }}>
                {date.weekday}
                <br />
                {date.day} {date.month} {date.year}
              </p>
            </>
          ) : (
            <p className="mt-3" style={{ fontFamily: display, fontSize: 28 }}>Date to be announced</p>
          )}
          {time && <p className="mt-2" style={{ fontSize: 18, fontWeight: 500 }}>{time}</p>}

          <div className="mx-auto my-7 h-px w-16" style={{ background: A.line, opacity: 0.6 }} />

          <p className="leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>{data.venue || 'The venue'}</p>
          {data.venueAddress && (
            <p className="mx-auto mt-2 max-w-[20rem] leading-[1.55]" style={{ fontSize: 16, color: BASE.inkSoft }}>
              {data.venueAddress}
            </p>
          )}

          {(directions || calendar) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: A.deep, color: '#FFFFFF' }}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={`${button} border`}
                  style={{ borderColor: A.deep, color: A.deep, background: BASE.card }}
                >
                  Add to calendar
                </a>
              )}
            </div>
          )}
        </div>
      </Reveal>

      {/* ── Counting the days ─────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="px-6 py-12 text-center">
          <p className="leading-none" style={{ fontFamily: display }}>
            <span style={{ fontSize: 64, color: A.deep }}>{countdown.days}</span>
            <span className="ml-2" style={{ fontSize: 24 }}>{countdown.days === 1 ? 'day' : 'days'} to go</span>
          </p>
          <p className="mt-3 tabular-nums" style={{ fontSize: 15, color: BASE.inkSoft, letterSpacing: '0.04em' }}>
            {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
          </p>
        </Reveal>
      )}

      {/* ── A note from the family ────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[28rem] px-7 py-12 text-center">
          <svg viewBox="0 0 60 40" className="mx-auto h-9 w-14" fill="none" aria-hidden>
            <path d={moonPath(15)} transform="translate(24 20) rotate(-24)" fill={BASE.peach} stroke={BASE.peachLine} strokeWidth="1.2" strokeLinejoin="round" />
            <path d={starPath(5, [0])} transform="translate(46 9)" stroke={A.line} strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <p className="mt-5 leading-[1.55]" style={{ fontFamily: display, fontSize: 'clamp(18px, 5.2cqi, 21px)', textWrap: 'pretty' }}>
            {data.message}
          </p>
          <p className="mt-5" style={{ ...label, color: BASE.inkFaint }}>{parents}</p>
        </Reveal>
      )}

      {/* ── The programme, along a vine ───────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-14 pt-8">
          <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(26px, 8.4cqi, 30px)' }}>The programme</h2>
          <ol className="relative mt-9">
            <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px" style={{ background: A.line }} />
            {schedule.map((item, i) => (
              <li key={`${item.title}-${i}`} className="relative flex items-start gap-3 pb-7 last:pb-0">
                <span className="relative mt-[3px] shrink-0">
                  <Leaf color={A.line} fill={i % 2 ? BASE.peach : A.wash} flip={i % 2 === 1} />
                </span>
                <div className="min-w-0">
                  {item.time && <p className="tabular-nums" style={{ ...label, fontSize: 13, letterSpacing: '0.14em' }}>{item.time}</p>}
                  <p className="mt-0.5 leading-[1.3]" style={{ fontFamily: display, fontSize: 21 }}>{item.title}</p>
                  {item.note && <p className="mt-1" style={{ fontSize: 15, color: BASE.inkSoft }}>{item.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Photographs, in arched frames ─────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-5 pb-14 pt-6">
          <Reveal disabled={isPreview}>
            <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(24px, 7.8cqi, 30px)' }}>A few photographs</h2>
          </Reveal>
          <div className="mt-9 flex items-start justify-center gap-4">
            {columns.map((col, c) => (
              <div key={c} className={`flex flex-col gap-5 ${columns.length > 1 ? 'w-1/2' : 'w-[64%]'}`} style={{ marginTop: c === 1 ? 40 : 0 }}>
                {col.map((src, i) => (
                  <Reveal key={`${src}-${i}`} disabled={isPreview} delay={c * 100}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="block aspect-[3/4] w-full object-cover"
                      style={{ borderRadius: '999px 999px 14px 14px', boxShadow: `0 0 0 5px ${BASE.paper}, 0 0 0 6px ${(i + c) % 2 ? BASE.peachLine : A.line}` }}
                    />
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: BASE.rule }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title={`Blessings for ${baby}`}
            intro={`Leave a blessing for ${baby}. It appears here for every guest.`}
            noun="blessing"
          />
        </div>
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center">
        <svg viewBox="0 0 80 44" className="mx-auto h-11 w-20" fill="none" aria-hidden>
          <path d={moonPath(17)} transform="translate(38 23) rotate(-24)" fill={BASE.card} stroke={A.line} strokeWidth="1.2" strokeLinejoin="round" />
          <path d={starPath(5, [0.05, 0, -0.04])} transform="translate(64 10)" fill={BASE.peach} stroke={BASE.peachLine} strokeWidth="1" strokeLinejoin="round" />
          <path d={starPath(3.5, [0])} transform="translate(12 12)" stroke={A.line} strokeWidth="0.9" strokeLinejoin="round" />
        </svg>
        <p className="mt-3" style={{ fontFamily: display, fontSize: 28, color: A.deep }}>{baby}</p>
        {date && <p className="mt-1" style={{ fontSize: 15, color: BASE.inkSoft }}>{date.day} {date.month} {date.year}</p>}
        <div className="mt-9">
          <Credit isPreview={isPreview} color={BASE.inkFaint} linkColor={A.deep} />
        </div>
      </footer>
    </div>
  )
}
