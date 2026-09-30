'use client'

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { arefRuqaa } from './kit/fonts/arefRuqaa'
import { gilda } from './kit/fonts/gilda'
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
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Eid Milan — lanterns strung up for the evening.
 * Ivory paper under an emerald frieze of eight-pointed stars. Three brass
 * fanoos hang from it on their chains, glass lit teal and amber, throwing a
 * scatter of star-shaped light around them; a gold crescent sits between.
 * "عيد مبارك" is written large in Ruqaa beside its English. On arrival the
 * lanterns are let down on their chains and swing to rest, then light up.
 */

const C = {
  ivory: '#FBF6EA',
  paper: '#F3EBD8',
  card: '#FFFCF4',
  emerald: '#0F5B4A',
  emeraldDeep: '#0A4538',
  teal: '#5FA79E',
  tealWash: '#E3EFE8',
  gold: '#C29A45',
  goldLight: '#E4C57A',
  amber: '#FFDD97',
  ink: '#1D3A33',
  inkSoft: 'rgba(29,58,51,0.72)',
  inkFaint: 'rgba(29,58,51,0.5)',
  line: '#E2D5B6',
}

const arabic = arefRuqaa.style.fontFamily
const display = gilda.style.fontFamily
const sans = jost.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.ivory,
  surface: C.card,
  ink: C.ink,
  muted: C.inkSoft,
  line: C.line,
  accent: C.emerald,
  onAccent: C.ivory,
  heading: display,
  body: sans,
  headingStyle: { fontWeight: 400, fontSize: 36, color: C.emerald, lineHeight: 1.1 },
}

const f1 = (n: number) => n.toFixed(1)

/** An eight-pointed star (khatam) as polygon points. */
function starPoints(cx: number, cy: number, R: number, inner = 0.66, rot = 0) {
  return Array.from({ length: 16 }, (_, i) => {
    const a = rot + (i * Math.PI) / 8 - Math.PI / 2
    const r = i % 2 ? R * inner : R
    return `${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}`
  }).join(' ')
}

// ─── Lattice ─────────────────────────────────────────────────────────────────

/** A frieze of interlaced eight-pointed stars and crosses. */
function Frieze({ ground = C.emerald, ink = C.goldLight, height = 44, className }: { ground?: string; ink?: string; height?: number; className?: string }) {
  const id = `em-frieze-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg viewBox="0 0 400 44" preserveAspectRatio="xMidYMid slice" className={`block w-full ${className ?? ''}`} style={{ height }} aria-hidden>
      <defs>
        <pattern id={id} width="36" height="44" patternUnits="userSpaceOnUse" x="2">
          <rect width="36" height="44" fill={ground} />
          <polygon points={starPoints(18, 22, 16.5, 0.7)} fill="none" stroke={ink} strokeWidth="1.1" strokeLinejoin="round" />
          <polygon points={starPoints(18, 22, 9, 0.62, Math.PI / 8)} fill={ink} opacity="0.85" />
          <path d="M0 22 L1.5 22 M34.5 22 L36 22" stroke={ink} strokeWidth="1.1" />
          <circle cx="18" cy="22" r="2.2" fill={ground} />
        </pattern>
      </defs>
      <rect width="400" height="44" fill={`url(#${id})`} />
      <path d="M0 1.5 H400 M0 42.5 H400" stroke={ink} strokeWidth="1.2" />
    </svg>
  )
}

/** A short lattice rule: a centred star between two gold lines. */
function StarRule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 20" className={className} aria-hidden>
      <path d="M4 10 H62 M98 10 H156" stroke={C.gold} strokeWidth="1" />
      <polygon points={starPoints(80, 10, 9, 0.66)} fill="none" stroke={C.gold} strokeWidth="1.1" />
      <polygon points={starPoints(80, 10, 4, 0.6, Math.PI / 8)} fill={C.gold} />
      <circle cx="66" cy="10" r="1.6" fill={C.gold} />
      <circle cx="94" cy="10" r="1.6" fill={C.gold} />
    </svg>
  )
}

// ─── Fanoos ──────────────────────────────────────────────────────────────────

/**
 * A brass fanoos on its chain, drawn in a 100-wide box: onion cap, three
 * tapered glass panels behind pierced brass (a pointed arch and a star on the
 * front, slats on the sides), a drop base and a tassel.
 */
function Fanoos({ chain, glass, className, style }: { chain: number; glass: [string, string]; className?: string; style?: CSSProperties }) {
  const y = chain
  const brass = C.gold
  const brassDark = '#9C7A31'
  const brassLight = C.goldLight
  const links = Math.max(1, Math.floor((chain - 6) / 7))
  return (
    <svg viewBox={`0 0 100 ${y + 176}`} className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      {Array.from({ length: links }, (_, i) =>
        i % 2 ? (
          <rect key={i} x="48.8" y={f1(i * 7)} width="2.4" height="7.6" rx="1.2" fill={brassDark} />
        ) : (
          <rect key={i} x="47.4" y={f1(i * 7)} width="5.2" height="7.6" rx="2.6" fill="none" stroke={brassDark} strokeWidth="1.3" />
        ),
      )}
      <circle cx="50" cy={y + 2} r="4.5" fill="none" stroke={brass} strokeWidth="2" />
      <path d={`M50 ${y + 6} C 54 ${y + 14}, 70 ${y + 20}, 74 ${y + 34} L26 ${y + 34} C 30 ${y + 20}, 46 ${y + 14}, 50 ${y + 6}Z`} fill={brass} />
      <path d={`M50 ${y + 6} C 54 ${y + 14}, 70 ${y + 20}, 74 ${y + 34} L50 ${y + 34}Z`} fill={brassDark} opacity="0.45" />
      <rect x="20" y={y + 34} width="60" height="7" rx="1.5" fill={brassDark} />
      {/* Glass */}
      <path d={`M22 ${y + 41} L36 ${y + 41} L38 ${y + 118} L28 ${y + 118}Z`} fill={glass[1]} />
      <path d={`M64 ${y + 41} L78 ${y + 41} L72 ${y + 118} L62 ${y + 118}Z`} fill={glass[1]} />
      <path d={`M36 ${y + 41} L64 ${y + 41} L62 ${y + 118} L38 ${y + 118}Z`} fill={glass[0]} />
      {/* Brass fretwork */}
      <g fill="none" stroke={brassDark} strokeWidth="2" strokeLinejoin="round">
        <path d={`M22 ${y + 41} L28 ${y + 118} M36 ${y + 41} L38 ${y + 118} M64 ${y + 41} L62 ${y + 118} M78 ${y + 41} L72 ${y + 118}`} />
        <path d={`M40 ${y + 112} L40 ${y + 70} C 40 ${y + 58}, 50 ${y + 52}, 50 ${y + 48} C 50 ${y + 52}, 60 ${y + 58}, 60 ${y + 70} L60 ${y + 112}`} strokeWidth="1.6" />
        <path d={`M28.5 ${y + 60} L37 ${y + 60} M29.5 ${y + 80} L37.4 ${y + 80} M30.5 ${y + 100} L37.8 ${y + 100} M63 ${y + 60} L71.5 ${y + 60} M62.6 ${y + 80} L70.5 ${y + 80} M62.2 ${y + 100} L69.5 ${y + 100}`} strokeWidth="1.4" />
      </g>
      <polygon points={starPoints(50, y + 84, 7.5, 0.62)} fill={brassDark} />
      <polygon points={starPoints(50, y + 84, 3.2, 0.6, Math.PI / 8)} fill={C.amber} />
      <rect x="26" y={y + 118} width="48" height="7" rx="1.5" fill={brassDark} />
      <path d={`M28 ${y + 125} L72 ${y + 125} C 70 ${y + 136}, 58 ${y + 142}, 50 ${y + 150} C 42 ${y + 142}, 30 ${y + 136}, 28 ${y + 125}Z`} fill={brass} />
      <path d={`M50 ${y + 125} L72 ${y + 125} C 70 ${y + 136}, 58 ${y + 142}, 50 ${y + 150}Z`} fill={brassDark} opacity="0.45" />
      <path d={`M34 ${y + 128} C 38 ${y + 134}, 44 ${y + 138}, 48 ${y + 141}`} stroke={brassLight} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="50" cy={y + 154} r="3" fill={brass} />
      <path d={`M50 ${y + 157} L50 ${y + 174} M47 ${y + 160} L46 ${y + 174} M53 ${y + 160} L54 ${y + 174}`} stroke={C.emerald} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/** Light thrown through the pierced brass: rings of small stars around a point. */
function CastLight({ cx, cy, size, className, style }: { cx: string; cy: string; size: string; className?: string; style?: CSSProperties }) {
  const rings: [number, number, number, number][] = [
    [64, 10, 6.5, 0.5],
    [92, 14, 4.6, 0.26],
  ]
  return (
    <svg
      viewBox="-120 -120 240 240"
      className={`pointer-events-none absolute ${className ?? ''}`}
      style={{ left: cx, top: cy, width: size, transform: 'translate(-50%, -50%)', ...style }}
      aria-hidden
    >
      <circle r="100" fill={C.goldLight} opacity="0.13" />
      <circle r="58" fill={C.goldLight} opacity="0.12" />
      {rings.map(([r, n, size, o], k) =>
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 + k * 0.2
          return <polygon key={`${k}-${i}`} points={starPoints(Math.cos(a) * r, Math.sin(a) * r * 1.08, size, 0.6)} fill={C.gold} opacity={o} />
        }),
      )}
    </svg>
  )
}

function Crescent({ className, style, color = C.gold }: { className?: string; style?: CSSProperties; color?: string }) {
  const id = `em-moon-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden>
      <defs>
        <mask id={id}>
          <rect width="60" height="60" fill="#fff" />
          <circle cx="37" cy="23" r="19" fill="#000" />
        </mask>
      </defs>
      <circle cx="28" cy="31" r="22" fill={color} mask={`url(#${id})`} />
      <polygon points={starPoints(46, 40, 6, 0.45)} fill={color} />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const button =
  'em-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors'

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(32px, 10cqi, 42px)', color: C.emerald }}>
      {children}
    </h2>
  )
}

export default function EidMilan({ data, eventId, isPreview = false }: InviteProps) {
  const hosts = data.hostNames?.trim() || 'The Qureshi Family'
  const title = data.title?.trim() || 'Eid Milan'
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

  // Glass centre of each lantern, in the lantern layer's own container units:
  // x = left + width / 2, y = (chain + 80) × width / 100.
  const lanterns: { left: number; width: number; chain: number; glass: [string, string]; delay: number; light: number }[] = [
    { left: 4, width: 21, chain: 136, glass: ['#FFE2A0', '#8CC7BD'], delay: 150, light: 56 },
    { left: 70, width: 25, chain: 70, glass: ['#9ED3C8', '#5FA79E'], delay: 0, light: 64 },
    { left: 46, width: 14, chain: 226, glass: ['#FFD891', '#E9B764'], delay: 300, light: 38 },
  ]

  return (
    <div
      className="em relative overflow-x-hidden"
      style={{ background: C.ivory, color: C.ink, fontFamily: sans, containerType: 'inline-size' }}
    >
      <style>{`
        .em .em-hang { transform-origin: 50% 0; transform: translateY(-38%); animation: em-hang 2.2s cubic-bezier(.3,.8,.3,1) forwards; }
        .em .em-lit { opacity: 0; animation: em-lit 1.2s ease forwards 1.5s; }
        .em .em-btn:hover { filter: brightness(1.06); }
        @keyframes em-hang {
          0% { transform: translateY(-38%) rotate(0); }
          38% { transform: translateY(0) rotate(5deg); }
          58% { transform: rotate(-3deg); }
          76% { transform: rotate(1.4deg); }
          90% { transform: rotate(-0.5deg); }
          100% { transform: none; }
        }
        @keyframes em-lit { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .em .em-hang, .em .em-lit { animation: none; transform: none; opacity: 1; }
        }
      `}</style>

      {/* ── Lanterns ─────────────────────────────────────────────── */}
      <header className="relative flex flex-col overflow-hidden" style={{ minHeight: isPreview ? 560 : '100svh', ...grain(0.05) }}>
        <Frieze />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[44px] w-full max-w-[30rem] -translate-x-1/2"
          style={{ containerType: 'inline-size', height: 400 }}
        >
          {lanterns.map((l, i) => (
            <CastLight
              key={`l${i}`}
              cx={`${l.left + l.width / 2}%`}
              cy={`${((l.chain + 80) * l.width) / 100}cqi`}
              size={`${l.light}cqi`}
              className={animate ? 'em-lit' : undefined}
              style={animate ? { animationDelay: `${1500 + l.delay}ms` } : undefined}
            />
          ))}
          {lanterns.map((l, i) => (
            <div key={i} className={`absolute top-0 ${animate ? 'em-hang' : ''}`} style={{ left: `${l.left}%`, width: `${l.width}%`, animationDelay: `${l.delay}ms` }}>
              <Fanoos chain={l.chain} glass={l.glass} className="w-full" />
            </div>
          ))}
          <Crescent className="absolute left-[28%] top-[11cqi] w-[14%]" />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-[min(318px,82cqi)] text-center">
          <p dir="rtl" lang="ar" className="leading-[1.05]" style={{ fontFamily: arabic, fontSize: 'clamp(58px, 19cqi, 92px)', color: C.emerald, fontWeight: 700 }}>
            عيد مبارك
          </p>
          <p className="mt-4 text-[15px] font-medium uppercase" style={{ letterSpacing: '0.34em', color: C.gold }}>
            Eid Mubarak
          </p>
          <StarRule className="mx-auto mt-5 w-[150px]" />
          <p className="mt-5 text-[19px] font-medium">{hosts}</p>
          <p className="mt-0.5 text-[16px] italic" style={{ color: C.inkSoft }}>
            {plural ? 'invite' : 'invites'} you to
          </p>
          <h1 className="mt-1 leading-[1.02]" style={{ fontFamily: display, fontSize: 'clamp(46px, 14.5cqi, 72px)', color: C.ink }}>
            {title}
          </h1>
          <p className="mt-4 font-medium" style={{ fontSize: 'clamp(15px, 4.7cqi, 18px)', color: C.emerald }}>
            <span className="whitespace-nowrap">{date ? `${date.weekday}, ${date.day} ${date.month}` : 'Date to be announced'}</span>
            {time && <span className="whitespace-nowrap"> · {time}</span>}
          </p>
          {data.venue && <p className="mt-1 text-[16px]" style={{ color: C.inkSoft }}>{data.venue}</p>}
        </div>
        <Frieze ground={C.tealWash} ink={C.teal} height={30} />
      </header>

      {/* ── The note ─────────────────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pb-6 pt-12 text-center">
          <Crescent className="mx-auto w-[40px]" />
          <p className="mt-4 leading-[1.4]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>
            {data.message}
          </p>
          <p className="mt-4 text-[15px]" style={{ color: C.inkSoft }}>— {hosts}</p>
        </Reveal>
      )}

      {/* ── When & where, in a lattice frame ─────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-5 py-10">
        <div className="overflow-hidden rounded-[18px]" style={{ background: C.emerald, padding: 12 }}>
          <div className="relative rounded-[10px] px-6 pb-8 pt-8 text-center" style={{ background: C.card }}>
            {date ? (
              <>
                <p className="text-[15px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: C.gold }}>{date.weekday}</p>
                <p className="mt-1 leading-none" style={{ fontFamily: display, fontSize: 80, color: C.emerald }}>{date.day}</p>
                <p className="mt-2 text-[21px]" style={{ fontFamily: display }}>{date.month} {date.year}</p>
              </>
            ) : (
              <p className="text-[21px]" style={{ fontFamily: display }}>Date to be announced</p>
            )}
            {time && <p className="mt-3 text-[18px] font-medium" style={{ color: C.emerald }}>{time}</p>}
            <StarRule className="mx-auto my-6 w-[120px]" />
            <p className="leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 32px)' }}>{data.venue || 'The venue'}</p>
            {data.venueAddress && (
              <p className="mx-auto mt-2 max-w-[18rem] text-[16px] leading-[1.5]" style={{ color: C.inkSoft }}>{data.venueAddress}</p>
            )}
            {data.dressCode && (
              <p className="mt-5 text-[16px]" style={{ color: C.inkSoft }}>
                Dress code · <span className="font-medium" style={{ color: C.ink }}>{data.dressCode}</span>
              </p>
            )}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: C.emerald, color: C.ivory }}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={button}
                  style={{ border: `1.5px solid ${C.emerald}`, color: C.emerald }}
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
        <section style={{ background: C.tealWash }}>
          <Frieze ground={C.tealWash} ink={C.teal} height={24} />
          <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-12">
            <Title>The evening</Title>
            <ol className="mt-7">
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`} className="grid grid-cols-[28px_1fr] items-start gap-4 border-b py-4 last:border-b-0" style={{ borderColor: 'rgba(95,167,158,0.35)' }}>
                  <svg viewBox="0 0 28 28" className="mt-1 w-[26px]" aria-hidden>
                    <polygon points={starPoints(14, 14, 12.5, 0.68)} fill="none" stroke={C.emerald} strokeWidth="1.3" />
                    <polygon points={starPoints(14, 14, 5, 0.6, Math.PI / 8)} fill={C.gold} />
                  </svg>
                  <div>
                    {item.time && <p className="text-[15px] font-medium tabular-nums" style={{ color: C.emerald }}>{item.time}</p>}
                    <p className="leading-[1.2]" style={{ fontFamily: display, fontSize: 23 }}>{item.title}</p>
                    {item.note && <p className="mt-0.5 text-[15px]" style={{ color: C.inkSoft }}>{item.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Frieze ground={C.tealWash} ink={C.teal} height={24} />
        </section>
      )}

      {/* ── Countdown ────────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto flex max-w-[30rem] items-center justify-center gap-5 px-6 py-12">
          <Crescent className="w-[64px] shrink-0" />
          <div>
            <p className="leading-none" style={{ fontFamily: display, fontSize: 68, color: C.emerald }}>
              {countdown.days}
              <span className="ml-2 text-[22px]" style={{ color: C.ink }}>{countdown.days === 1 ? 'day' : 'days'} to go</span>
            </p>
            <p className="mt-2 text-[15px] tabular-nums" style={{ color: C.inkSoft }}>
              {countdown.hours} hr · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
            </p>
          </div>
        </Reveal>
      )}

      {/* ── Photographs ──────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-5 pb-12 pt-4">
          <Reveal disabled={isPreview}>
            <Title>From the family album</Title>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = i === 0 || (photos.length % 2 === 0 && i === photos.length - 1)
              return (
                <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className={wide ? 'col-span-2 aspect-[3/2]' : 'aspect-[4/5]'}>
                  <figure className="h-full w-full rounded-[12px] p-[5px]" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full rounded-[8px] object-cover" />
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
            title="Eid wishes & duas"
            intro={`Leave a few words for ${hosts}. Your wish appears here for every guest.`}
          />
        </div>
      )}

      <footer className="text-center" style={{ background: C.emerald, color: C.ivory }}>
        <Frieze />
        <div className="px-6 pb-10 pt-10">
          <Crescent className="mx-auto w-[48px]" color={C.goldLight} />
          <p dir="rtl" lang="ar" className="mt-2 leading-[1.3]" style={{ fontFamily: arabic, fontSize: 34, color: C.goldLight }}>
            عيد مبارك
          </p>
          <p className="mt-2 text-[20px]" style={{ fontFamily: display }}>{hosts}</p>
          {date && (
            <p className="mt-1 text-[13px] uppercase tabular-nums" style={{ letterSpacing: '0.3em', color: 'rgba(251,246,234,0.6)' }}>
              {date.dayPadded} · {date.monthShort} · {date.year}
            </p>
          )}
          <div className="mt-8">
            <Credit isPreview={isPreview} color="rgba(251,246,234,0.55)" linkColor={C.ivory} />
          </div>
        </div>
      </footer>
    </div>
  )
}
