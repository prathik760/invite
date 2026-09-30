'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { marcellus } from './kit/fonts/marcellus'
import { cormorant } from './kit/fonts/cormorant'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { timeWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Luxury Wedding — a boxed multi-function suite. The guest is handed a
 * champagne envelope on emerald, closed with a monogrammed wax seal; a tap
 * breaks it, the flap lifts on a lattice liner and the card slides out.
 * Inside: the main card, a place card for each function, the family's
 * compliments, and a reply card.
 */

const C = {
  ivory: '#F2EBDC',
  card: '#FCF9F1',
  emerald: '#123B31',
  ink: '#163A30',
  soft: 'rgba(22,58,48,0.76)',
  faint: 'rgba(22,58,48,0.54)',
  gold: '#9C7A3A',
  goldLight: '#D3B77C',
  goldLine: 'rgba(156,122,58,0.5)',
  goldHair: 'rgba(156,122,58,0.28)',
  champagne: '#E8DAC0',
  champagneLight: '#EFE4CF',
  champagneDeep: '#D8C5A2',
  onDark: '#F0E7D4',
  onDarkSoft: 'rgba(240,231,212,0.74)',
  wax: '#1F5545',
  waxDark: '#123429',
  waxLight: '#347360',
}

const caps = marcellus.style.fontFamily
const serif = cormorant.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.ivory,
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: C.goldHair,
  accent: C.emerald,
  onAccent: C.onDark,
  heading: caps,
  body: serif,
  headingStyle: { fontSize: 26, letterSpacing: '0.08em', textTransform: 'uppercase' },
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** The wax spill: a circle whose edge wanders, smoothed through midpoints. */
const SEAL_BLOB = (() => {
  const r = rng(41)
  const n = 22
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rad = 45 + (r() - 0.5) * 4.6 + (i % 6 === 0 ? 1.8 : 0)
    pts.push([50 + rad * Math.cos(a), 50 + rad * Math.sin(a)])
  }
  const f = (p: [number, number]) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`
  const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  let d = `M${f(mid(pts[0], pts[1]))}`
  for (let i = 1; i <= n; i++) d += ` Q${f(pts[i % n])} ${f(mid(pts[i % n], pts[(i + 1) % n]))}`
  return `${d}Z`
})()

function Seal({ letters, className }: { letters: [string, string]; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden style={{ overflow: 'visible' }}>
      <path d={SEAL_BLOB} fill="rgba(0,0,0,0.28)" transform="translate(1 2.4)" />
      <path d={SEAL_BLOB} fill={C.wax} />
      <circle cx={50} cy={50} r={32.5} fill={C.waxDark} opacity={0.5} />
      <circle cx={50} cy={50} r={32.5} fill="none" stroke={C.waxLight} strokeWidth={1.3} transform="translate(-0.7 -0.7)" />
      <circle cx={50} cy={50} r={32.5} fill="none" stroke={C.waxDark} strokeWidth={1} transform="translate(0.6 0.6)" />
      <circle cx={50} cy={50} r={28.6} fill="none" stroke={C.goldLight} strokeWidth={0.9} strokeDasharray="0.1 2.6" strokeLinecap="round" />
      <text x={50} y={58.5} textAnchor="middle" fontFamily={caps} fontSize={23} fill={C.goldLight}>
        {letters[0]}
        <tspan fontFamily={serif} fontStyle="italic" fontSize={15} dx={1.5} dy={-3}>&amp;</tspan>
        <tspan dx={1.5} dy={3}>{letters[1]}</tspan>
      </text>
      <path d="M22 36 C28 22 42 14 56 14" fill="none" stroke="#FFFFFF" strokeOpacity={0.14} strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

/** A gold corner fleuron for the card's inner rule. */
function Corner({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={style} aria-hidden>
      <path d="M1 29 V9 A8 8 0 0 1 9 1 H29" fill="none" stroke={C.gold} strokeWidth={0.8} />
      <path d="M5 29 V12 A7 7 0 0 1 12 5 H29" fill="none" stroke={C.goldLine} strokeWidth={0.6} />
      <circle cx={9} cy={9} r={1.6} fill={C.gold} />
    </svg>
  )
}

function Rule({ width = 64 }: { width?: number }) {
  return (
    <span aria-hidden className="mx-auto flex items-center justify-center gap-2" style={{ width }}>
      <span className="h-px flex-1" style={{ background: C.goldLine }} />
      <span className="h-[5px] w-[5px] rotate-45" style={{ background: C.gold }} />
      <span className="h-px flex-1" style={{ background: C.goldLine }} />
    </span>
  )
}

function Heading({ children, sub, dark }: { children: ReactNode; sub?: string; dark?: boolean }) {
  return (
    <div className="text-center">
      <h2 className="uppercase leading-[1.2]" style={{ fontFamily: caps, fontSize: 'clamp(24px, 7cqi, 30px)', letterSpacing: '0.1em', color: dark ? C.onDark : C.ink }}>
        {children}
      </h2>
      <div className="mt-3"><Rule /></div>
      {sub && (
        <p className="mx-auto mt-3 max-w-[20rem] text-balance italic leading-[1.4]" style={{ fontFamily: serif, fontSize: 19, color: dark ? C.onDarkSoft : C.soft }}>
          {sub}
        </p>
      )}
    </div>
  )
}

const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
function roman(n: number) {
  let out = ''
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v }
  return out
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  )
}

/* ── The envelope ──────────────────────────────────────────────────── */

const LINER: React.CSSProperties = {
  backgroundColor: C.emerald,
  backgroundImage: `repeating-linear-gradient(45deg, rgba(211,183,124,0.42) 0 1px, transparent 1px 11px), repeating-linear-gradient(-45deg, rgba(211,183,124,0.42) 0 1px, transparent 1px 11px)`,
}

function EnvelopeStage({
  phase,
  onOpen,
  letters,
  names,
  dateLine,
  isPreview,
}: {
  phase: 'sealed' | 'opening' | 'leaving'
  onOpen: () => void
  isPreview?: boolean
  letters: [string, string]
  names: string
  dateLine: string
}) {
  const opening = phase !== 'sealed'
  return (
    <section
      className={`lw-stage ${opening ? 'is-opening' : ''} ${phase === 'leaving' ? 'is-leaving' : ''} relative flex ${isPreview ? 'h-[560px]' : 'h-[100svh] min-h-[620px]'} flex-col items-center justify-center overflow-hidden px-6 text-center`}
      style={{ background: C.emerald, color: C.onDark, ...grain(0.09) }}
    >
      <span aria-hidden className="lw-leave pointer-events-none absolute inset-[14px] border" style={{ borderColor: 'rgba(211,183,124,0.28)' }} />

      <p className="lw-hint italic" style={{ fontFamily: serif, fontSize: 20, color: C.onDarkSoft }}>
        An invitation for you &amp; your family
      </p>

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label="Open the invitation"
        className="lw-env lw-leave relative mt-12 block w-[min(84cqi,380px)] cursor-pointer disabled:cursor-default"
        style={{ aspectRatio: '1.45' }}
      >
        {/* inside of the envelope — the lattice liner */}
        <span className="absolute inset-x-[2px] bottom-[45%] top-[2px]" style={LINER} />

        {/* the card, waiting inside */}
        <span className="lw-card absolute left-[5%] right-[5%] top-[4%] h-[92%] px-4 pt-[9%]" style={{ background: C.card, boxShadow: '0 -1px 6px rgba(0,0,0,0.12)' }}>
          <span aria-hidden className="absolute inset-[7px] border" style={{ borderColor: C.goldLine }} />
          <span className="relative block text-[11px] uppercase" style={{ fontFamily: caps, letterSpacing: '0.28em', color: C.gold }}>The wedding of</span>
          <span className="relative mt-2 block uppercase leading-[1.25]" style={{ fontFamily: caps, fontSize: 'clamp(17px, 5.4cqi, 22px)', letterSpacing: '0.1em', color: C.ink }}>
            {names}
          </span>
        </span>

        {/* the pocket — side and bottom flaps */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 4 }} aria-hidden>
          <polygon points="0,0 50,55 100,0 100,100 0,100" fill={C.champagne} />
          <polygon points="0,100 50,61 100,100" fill={C.champagneDeep} opacity={0.4} />
          <path d="M0 0 L50 55 L100 0 M0 100 L50 61 L100 100" fill="none" stroke="rgba(120,92,48,0.28)" strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* the top flap — hinged at the top edge */}
        <span className="lw-flap absolute inset-x-0 top-0 h-[60%]" style={{ perspective: 900 }}>
          <span className="lw-flap-inner absolute inset-0" style={{ transformOrigin: '50% 0', transformStyle: 'preserve-3d' }}>
            <span
              className="absolute inset-x-0 top-0 h-[106%]"
              style={{ background: 'rgba(60,40,10,0.16)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            />
            <span
              className="absolute inset-0"
              style={{ background: C.champagneLight, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            />
            <span
              className="absolute inset-0"
              style={{ ...LINER, clipPath: 'polygon(0 100%, 100% 100%, 50% 0)', transform: 'rotateX(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            />
          </span>
        </span>

        {/* the seal, on the point of the flap */}
        <span className="absolute left-1/2 top-[60%]" style={{ zIndex: 6 }}>
          <span className="lw-seal block w-[84px] -translate-x-1/2 -translate-y-1/2">
            <Seal letters={letters} className="block w-full" />
          </span>
        </span>
      </button>

      <div className="lw-hint mt-10">
        <p className="uppercase" style={{ fontFamily: caps, fontSize: 15, letterSpacing: '0.22em' }}>{names}</p>
        {dateLine && <p className="mt-1.5" style={{ fontFamily: serif, fontSize: 18, color: C.onDarkSoft }}>{dateLine}</p>}
        <p className="mt-6 italic" style={{ fontFamily: serif, fontSize: 18, color: C.goldLight }}>Tap the seal to open</p>
      </div>
    </section>
  )
}

/* ── Functions ─────────────────────────────────────────────────────── */

interface Fn {
  key: string
  name: string
  date?: string
  time?: string
  venue?: string
  address?: string
  main?: boolean
}

function PlaceCard({ fn, calendarTitle, directions, isPreview }: { fn: Fn; calendarTitle: string; directions: string | null; isPreview: boolean }) {
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const cal = calendarHref(calendarTitle, fn.date, fn.time, [fn.venue, fn.address].filter(Boolean).join(', ') || undefined, fn.main ? 5 : 3)
  return (
    <article
      className="relative grid grid-cols-[clamp(62px,19cqi,76px)_1fr] overflow-hidden"
      style={{ background: C.card, boxShadow: '0 1px 0 rgba(22,58,48,0.05), 0 14px 30px -24px rgba(22,58,48,0.55)' }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-[6px] border" style={{ borderColor: fn.main ? C.goldLine : C.goldHair }} />
      <div className="relative flex flex-col items-center justify-center border-r border-dashed py-6 text-center" style={{ borderColor: C.goldLine }}>
        {d ? (
          <>
            <span className="italic" style={{ fontFamily: serif, fontSize: 16, color: C.soft }}>{d.weekday.slice(0, 3)}</span>
            <span className="leading-none" style={{ fontFamily: caps, fontSize: 36, color: C.ink }}>{d.day}</span>
            <span className="mt-1 uppercase" style={{ fontFamily: caps, fontSize: 13, letterSpacing: '0.16em', color: C.gold }}>{d.monthShort}</span>
          </>
        ) : (
          <span className="h-[7px] w-[7px] rotate-45" style={{ background: C.gold }} aria-hidden />
        )}
      </div>
      <div className="relative py-5 pl-4 pr-4">
        <h3 className="uppercase leading-[1.2]" style={{ fontFamily: caps, fontSize: 'clamp(18px, 5.6cqi, 21px)', letterSpacing: '0.1em', color: C.ink }}>{fn.name}</h3>
        {(!d || t) && (
          <p className="mt-1.5 leading-[1.35]" style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, color: C.ink }}>
            {!d && 'Date to follow'}
            {!d && t && ' · '}
            {t && <span className="whitespace-nowrap">{d ? `at ${t}` : t}</span>}
          </p>
        )}
        {fn.venue && <p className="leading-[1.35]" style={{ fontFamily: serif, fontSize: 18, fontStyle: 'italic', color: C.soft }}>{fn.venue}</p>}
        {fn.address && <p className="leading-[1.35]" style={{ fontFamily: serif, fontSize: 17, color: C.faint }}>{fn.address}</p>}
        {(cal || directions) && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            <DirectionsLink
              href={cal}
              isPreview={isPreview}
              className="lw-link inline-flex items-center gap-1.5 py-1"
              style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.gold }}
            >
              <CalendarGlyph />
              Add to calendar
            </DirectionsLink>
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className="lw-link inline-flex items-center gap-1.5 py-1"
              style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.gold }}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
              Directions
            </DirectionsLink>
          </div>
        )}
      </div>
    </article>
  )
}

type Phase = 'sealed' | 'opening' | 'leaving' | 'done'

export default function LuxuryWedding({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Priya'
  const groom = data.groomName?.trim() || 'Arjun'
  const letters: [string, string] = [bride.charAt(0).toUpperCase(), groom.charAt(0).toUpperCase()]
  const date = dateParts(data.date)
  const spelledTime = timeWords(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const venue = data.venue?.trim() || 'The venue'
  const portraits = [
    { src: data.bridePhoto, alt: bride },
    { src: data.groomPhoto, alt: groom },
  ].filter((p) => p.src && /^(https?:)?\//.test(p.src)) as { src: string; alt: string }[]

  const functions = useMemo(() => {
    const list: Fn[] = [
      { key: 'haldi', name: 'Haldi', date: data.haldiDate, time: data.haldiTime, venue: data.haldiVenue },
      { key: 'mehendi', name: 'Mehendi', date: data.mehendiDate, time: data.mehendiTime, venue: data.mehendiVenue },
      { key: 'sangeet', name: 'Sangeet', date: data.sangeetDate, time: data.sangeetTime, venue: data.sangeetVenue },
      { key: 'wedding', name: 'The Wedding', date: data.date, time: data.time, venue: data.venue, address: data.venueAddress, main: true },
      { key: 'reception', name: 'Reception', date: data.receptionDate, time: data.receptionTime, venue: data.receptionVenue },
    ].filter((f) => f.main || f.date?.trim() || f.venue?.trim())
    // Chronological when every function has a date; otherwise the customary order.
    if (list.every((f) => f.date)) {
      list.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    }
    return list
  }, [data])
  const hasFunctions = functions.some((f) => !f.main)

  const families = [
    { title: data.brideFamilyTitle?.trim() || `${bride}'s family`, names: parseLines(data.brideFamily) },
    { title: data.groomFamilyTitle?.trim() || `${groom}'s family`, names: parseLines(data.groomFamily) },
  ].filter((f) => f.names.length > 0)

  /** Anything between the main card and the reply card? If not, the two emerald bands join. */
  const hasMiddle = Boolean(data.message?.trim()) || hasFunctions || photos.length > 0 || families.length > 0
  const reply = whatsappHref(data.whatsappNumber, `Hi! I'm confirming my attendance for ${bride} & ${groom}'s wedding.`)
  const weddingPlace = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const weddingCal = calendarHref(`Wedding of ${bride} & ${groom}`, data.date, data.time, weddingPlace || undefined, 5)

  /* The envelope: sealed → opening (seal lifts, flap turns, card rises) → leaving (it fades off the emerald) → done (the suite rises in on the same emerald). */
  const [phase, setPhase] = useState<Phase>('sealed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])
  const openEnvelope = useCallback(() => {
    if (phase !== 'sealed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('opening')
    timers.current.push(window.setTimeout(() => setPhase('leaving'), 2250))
    timers.current.push(window.setTimeout(() => {
      setPhase('done')
      if (!isPreview) window.scrollTo(0, 0)
    }, 2750))
  }, [phase, isPreview])
  const showSuite = phase === 'done'

  return (
    <div
      className="lw relative overflow-x-hidden"
      style={{ background: C.ivory, color: C.ink, fontFamily: serif, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .lw .lw-flap { z-index: 5; transition: z-index 0s linear .66s; }
        .lw .is-opening .lw-flap { z-index: 2; }
        .lw .lw-flap-inner { transition: transform .95s cubic-bezier(.55,.08,.3,1) .18s; }
        .lw .is-opening .lw-flap-inner { transform: rotateX(180deg); }
        .lw .lw-card { z-index: 3; transition: transform 1.05s cubic-bezier(.22,.7,.2,1) 1.02s; }
        .lw .is-opening .lw-card { transform: translateY(-60%); }
        .lw .lw-seal { transition: transform .5s cubic-bezier(.3,.6,.3,1), opacity .45s ease; }
        .lw .lw-env:not(:disabled):hover .lw-seal { transform: translate(-50%, -50%) scale(1.05); }
        .lw .is-opening .lw-seal { transform: translate(-50%, -62%) scale(1.14); opacity: 0; }
        .lw .lw-hint { transition: opacity .5s ease; }
        .lw .is-opening .lw-hint { opacity: 0; }
        .lw .lw-leave { transition: opacity .45s ease, transform .5s ease; }
        .lw .is-leaving .lw-leave { opacity: 0; }
        .lw .is-leaving .lw-env { transform: translateY(18px); }
        .lw .lw-rise { opacity: 0; transform: translateY(26px); animation: lw-rise 1.1s cubic-bezier(.2,.7,.2,1) forwards .1s; }
        .lw .lw-link:hover { text-decoration: underline; text-underline-offset: 4px; }
        .lw .lw-btn { transition: background-color .2s ease, color .2s ease; }
        @keyframes lw-rise { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .lw .lw-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.onDark} background="rgba(18,59,49,0.82)" border="rgba(211,183,124,0.45)" />

      {phase !== 'done' && (
        <EnvelopeStage
          phase={phase}
          onOpen={openEnvelope}
          letters={letters}
          names={`${bride} & ${groom}`}
          dateLine={date ? `${date.day} ${date.month} ${date.year}` : ''}
          isPreview={isPreview}
        />
      )}

      {!showSuite ? (
        <div className="sr-only">
          <h1>{bride} &amp; {groom} — wedding invitation</h1>
          {date && <p>{date.long}{data.time ? `, ${timeLabel(data.time)}` : ''}</p>}
          <p>{venue}{data.venueAddress ? `, ${data.venueAddress}` : ''}</p>
          {data.message && <p>{data.message}</p>}
        </div>
      ) : (
        <>
          {/* ── The main card ─────────────────────────────────────── */}
          <section
            className="relative flex flex-col items-center justify-center px-4 pb-12 pt-10"
            style={{ minHeight: isPreview ? 560 : '100svh', background: C.emerald, ...grain(0.09) }}
          >
            <div className={`${isPreview ? '' : 'lw-rise'} relative w-full max-w-[30rem] px-7 pb-12 pt-9 text-center`} style={{ background: C.card, boxShadow: '0 30px 60px -30px rgba(0,0,0,0.6)' }}>
              <span aria-hidden className="pointer-events-none absolute inset-[9px] border" style={{ borderColor: C.goldLine }} />
              <Corner className="pointer-events-none absolute left-[14px] top-[14px] w-[26px]" />
              <Corner className="pointer-events-none absolute right-[14px] top-[14px] w-[26px]" style={{ transform: 'scaleX(-1)' }} />
              <Corner className="pointer-events-none absolute bottom-[14px] left-[14px] w-[26px]" style={{ transform: 'scaleY(-1)' }} />
              <Corner className="pointer-events-none absolute bottom-[14px] right-[14px] w-[26px]" style={{ transform: 'scale(-1)' }} />

              <div className="relative">
                <Seal letters={letters} className="mx-auto block w-[74px]" />

                <p className="mt-6 italic" style={{ fontSize: 20, color: C.soft }}>Together with their families</p>

                {portraits.length > 0 && (
                  <div className="mt-6 flex justify-center gap-4">
                    {portraits.map((p) => (
                      <span key={p.alt} className="block rounded-[50%] border p-[4px]" style={{ borderColor: C.goldLine }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt={p.alt} className="block h-[112px] w-[86px] rounded-[50%] object-cover" />
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="mt-6 uppercase" style={{ fontFamily: caps, fontWeight: 400, color: C.ink }}>
                  <span className="block leading-[1.05]" style={{ fontSize: 'clamp(34px, 11cqi, 54px)', letterSpacing: '0.08em' }}>{bride}</span>
                  <span className="my-1 block normal-case italic leading-none" style={{ fontFamily: serif, fontSize: 'clamp(28px, 8cqi, 36px)', color: C.gold }}>&amp;</span>
                  <span className="block leading-[1.05]" style={{ fontSize: 'clamp(34px, 11cqi, 54px)', letterSpacing: '0.08em' }}>{groom}</span>
                </h1>

                <p className="mx-auto mt-6 max-w-[17rem] text-balance italic leading-[1.4]" style={{ fontSize: 20, color: C.soft }}>
                  request the honour of your presence at the celebration of their marriage
                </p>

                <div className="mt-7">
                  {date ? (
                    <>
                      <p className="italic" style={{ fontSize: 19, color: C.soft }}>on {date.weekday}</p>
                      <p className="mt-1 uppercase" style={{ fontFamily: caps, fontSize: 'clamp(19px, 5.8cqi, 25px)', letterSpacing: '0.14em' }}>
                        {date.day} {date.month} {date.year}
                      </p>
                    </>
                  ) : (
                    <p className="uppercase" style={{ fontFamily: caps, fontSize: 19, letterSpacing: '0.12em' }}>Date to be announced</p>
                  )}
                  {spelledTime && <p className="mt-1 italic" style={{ fontSize: 19, color: C.soft }}>at {spelledTime}</p>}
                </div>

                <div className="mx-auto mt-6 max-w-[16rem]"><Rule width={120} /></div>

                <p className="mt-6 uppercase leading-[1.35]" style={{ fontFamily: caps, fontSize: 17, letterSpacing: '0.14em' }}>{venue}</p>
                {data.venueAddress && (
                  <p className="mx-auto mt-1 max-w-[17rem] text-balance leading-[1.4]" style={{ fontSize: 18, color: C.soft }}>{data.venueAddress}</p>
                )}
              </div>
            </div>

            {countdown && (
              <div className="mt-10 text-center" style={{ color: C.onDark }}>
                <p className="italic" style={{ fontSize: 19, color: C.onDarkSoft }}>The celebrations begin in</p>
                <p className="mt-2 flex items-baseline justify-center gap-x-4 tabular-nums">
                  {[
                    { v: String(countdown.days), l: countdown.days === 1 ? 'day' : 'days' },
                    { v: pad2(countdown.hours), l: 'hrs' },
                    { v: pad2(countdown.minutes), l: 'min' },
                  ].map((u) => (
                    <span key={u.l} className="whitespace-nowrap">
                      <span style={{ fontFamily: caps, fontSize: 32, color: C.goldLight }}>{u.v}</span>
                      <span className="ml-1.5 italic" style={{ fontSize: 18, color: C.onDarkSoft }}>{u.l}</span>
                    </span>
                  ))}
                </p>
              </div>
            )}
          </section>

          {/* ── A note ─────────────────────────────────────────────── */}
          {data.message && (
            <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pt-16 text-center">
              <Rule />
              <p className="mx-auto mt-6 max-w-[24rem] text-balance italic leading-[1.45]" style={{ fontSize: 23, color: C.ink }}>
                {data.message}
              </p>
            </Reveal>
          )}

          {/* ── The functions, a place card each ───────────────────── */}
          {hasFunctions && (
            <section className="mx-auto max-w-[30rem] px-5 pt-16">
              <Reveal disabled={isPreview}>
                <Heading sub="We request the pleasure of your company at each of the following">The Celebrations</Heading>
              </Reveal>
              <div className="mt-8 space-y-4">
                {functions.map((fn, i) => (
                  <Reveal key={fn.key} disabled={isPreview} delay={i * 60}>
                    <PlaceCard
                      fn={fn}
                      calendarTitle={fn.main ? `Wedding of ${bride} & ${groom}` : `${fn.name} — ${bride} & ${groom}`}
                      directions={fn.main ? directions : null}
                      isPreview={isPreview}
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* ── With best compliments from ─────────────────────────── */}
          {families.length > 0 && (
            <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pt-16 text-center">
              <p className="italic" style={{ fontSize: 24, color: C.ink }}>With best compliments from</p>
              <div className="mt-6 space-y-8">
                {families.map((f, i) => (
                  <div key={f.title}>
                    {i > 0 && <div className="mb-8"><Rule width={48} /></div>}
                    <p className="uppercase" style={{ fontFamily: caps, fontSize: 14, letterSpacing: '0.2em', color: C.gold }}>{f.title}</p>
                    <ul className="mt-3 space-y-1">
                      {f.names.map((n, j) => (
                        <li key={`${n}-${j}`} style={{ fontSize: 20, lineHeight: 1.35 }}>{n}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ── Photographs, matted ────────────────────────────────── */}
          {photos.length > 0 && (
            <section className="mx-auto max-w-[34rem] px-5 pt-16">
              <Reveal disabled={isPreview}>
                <Heading>Glimpses</Heading>
              </Reveal>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {photos.map((src, i) => {
                  const shape = ['col-span-2 aspect-[4/5]', 'aspect-square', 'aspect-square', 'col-span-2 aspect-[3/2]'][i % 4]
                  return (
                    <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={shape.includes('col-span-2') ? 'col-span-2' : ''}>
                      <figure className="p-[7px]" style={{ background: C.card, boxShadow: '0 12px 26px -20px rgba(22,58,48,0.6)' }}>
                        <div className={`${shape.replace('col-span-2 ', '')} w-full border p-[3px]`} style={{ borderColor: C.goldHair }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      </figure>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── The reply card ─────────────────────────────────────── */}
          <Reveal
            disabled={isPreview}
            as="section"
            className={`${hasMiddle ? 'mt-16 py-16' : 'pb-16'} px-5 text-center`}
            style={{ background: C.emerald, color: C.onDark, ...grain(0.09) }}
          >
            <div className="mx-auto max-w-[26rem]">
              {!hasMiddle && <span aria-hidden className="mx-auto mb-12 block h-px max-w-[16rem]" style={{ background: 'rgba(211,183,124,0.35)' }} />}
              {reply ? (
                <Heading dark sub="The favour of a reply is requested">Kindly Respond</Heading>
              ) : (
                <Heading dark>Save the Date</Heading>
              )}
              <p className="mt-6 uppercase" style={{ fontFamily: caps, fontSize: 18, letterSpacing: '0.14em' }}>
                {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              <p className="mt-1" style={{ fontSize: 19, color: C.onDarkSoft }}>
                {venue}{data.time ? ` · ${timeLabel(data.time)}` : ''}
              </p>
              <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                {reply && (
                  <DirectionsLink
                    href={reply}
                    isPreview={isPreview}
                    className="lw-btn inline-flex items-center justify-center gap-2.5 px-6 py-3.5 hover:bg-[#E2CB96]"
                    style={{ background: C.goldLight, color: C.emerald, fontFamily: caps, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z" />
                    </svg>
                    Reply on WhatsApp
                  </DirectionsLink>
                )}
                <DirectionsLink
                  href={weddingCal}
                  isPreview={isPreview}
                  className="lw-btn inline-flex items-center justify-center gap-2.5 border px-6 py-3.5 hover:bg-[rgba(240,231,212,0.08)]"
                  style={{ borderColor: 'rgba(211,183,124,0.6)', color: C.onDark, fontFamily: caps, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase' }}
                >
                  <CalendarGlyph />
                  Add to calendar
                </DirectionsLink>
              </div>
            </div>
          </Reveal>

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Blessings"
              intro={`Leave a few words for ${bride} and ${groom}. Your blessing appears here for every guest.`}
              noun="blessing"
            />
          )}

          {/* ── Foot ───────────────────────────────────────────────── */}
          <footer className="px-6 pb-10 pt-12 text-center">
            <Seal letters={letters} className="mx-auto block w-[60px]" />
            <p className="mt-4 uppercase" style={{ fontFamily: caps, fontSize: 17, letterSpacing: '0.18em' }}>
              {bride} <span className="normal-case italic" style={{ fontFamily: serif, color: C.gold }}>&amp;</span> {groom}
            </p>
            {date && (
              <p className="mt-2 uppercase" style={{ fontFamily: caps, fontSize: 13, letterSpacing: '0.3em', color: C.gold }}>
                {roman(date.day)} · {roman(Number(data.date.slice(5, 7)))} · {roman(date.year)}
              </p>
            )}
            <div className="mt-8">
              <Credit isPreview={isPreview} color={C.faint} linkColor={C.soft} />
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
