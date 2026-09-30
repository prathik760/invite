'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { playfair } from './kit/fonts/playfair'
import { cormorant } from './kit/fonts/cormorant'
import { jost } from './kit/fonts/jost'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseSchedule,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords, ordinalWords, timeWords, yearWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Saalgirah — wine and champagne gold, led by the number of years.
 * The years are set as one enormous Playfair italic numeral on a wine field;
 * everything else is quiet Cormorant on cream paper. The couple's photograph
 * sits in an album mount with gold photo corners, lapping over the fold.
 * Two rings draw themselves in on arrival — the only movement in the hero.
 */

const C = {
  wine: '#541327',
  wineDeep: '#420E1E',
  gold: '#CFAE72',
  goldSoft: 'rgba(207,174,114,0.78)',
  goldLine: 'rgba(207,174,114,0.38)',
  cream: '#F5ECDC',
  creamSoft: 'rgba(245,236,220,0.78)',
  creamFaint: 'rgba(245,236,220,0.56)',
  paper: '#F4EBDB',
  card: '#FBF6EC',
  ink: '#3B1220',
  inkSoft: 'rgba(59,18,32,0.68)',
  inkFaint: 'rgba(59,18,32,0.5)',
  rule: '#D9C5A1',
  goldInk: '#9C7A3C',
}

const numeralFace = playfair.style.fontFamily
const serif = cormorant.style.fontFamily
const sans = jost.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.ink,
  muted: C.inkSoft,
  line: C.rule,
  accent: C.wine,
  onAccent: C.cream,
  heading: numeralFace,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 34 },
}

/** Traditional names for the milestone years. */
const MILESTONES: Record<number, string> = {
  1: 'paper', 5: 'wooden', 10: 'tin', 15: 'crystal', 20: 'china', 25: 'silver', 30: 'pearl', 35: 'coral',
  40: 'ruby', 45: 'sapphire', 50: 'golden', 55: 'emerald', 60: 'diamond', 70: 'platinum',
}

const suffix = (n: number) => {
  const t = n % 100
  if (t >= 11 && t <= 13) return 'th'
  return ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'
}

// ─── Ornaments ──────────────────────────────────────────────────────────────

/**
 * Two wedding bands, interlinked: the right ring passes over the left at the
 * bottom crossing. Drawn in on arrival when `draw` is set.
 */
function Rings({ draw, color, gap, className }: { draw?: boolean; color: string; gap: string; className?: string }) {
  return (
    <svg viewBox="0 0 96 64" className={className} fill="none" aria-hidden>
      {/* left ring, a touch out of round, with a small set stone */}
      <ellipse cx="37" cy="36" rx="20.4" ry="19.6" transform="rotate(-8 37 36)" stroke={color} strokeWidth="1.3" className={draw ? 'sa-draw' : undefined} />
      <path d="M33.5 13.2 37 8.6l3.6 4.5-3.6 3.2Z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" className={draw ? 'sa-late' : undefined} />
      <ellipse cx="60" cy="36" rx="19.8" ry="20.3" transform="rotate(6 60 36)" stroke={color} strokeWidth="1.3" className={draw ? 'sa-draw sa-draw-2' : undefined} />
      {/* over-crossing: the right ring's arc redrawn on top of the left */}
      <g className={draw ? 'sa-late' : undefined}>
        <path d="M53.6 55 A 20 20 0 0 1 43.4 47.3" stroke={gap} strokeWidth="4.2" />
        <path d="M53.6 55 A 20 20 0 0 1 43.4 47.3" stroke={color} strokeWidth="1.3" />
      </g>
    </svg>
  )
}

/** A short gold rule with a lozenge at its centre. */
function Flourish({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 12" className={className} fill="none" aria-hidden>
      <path d="M4 6h62M94 6h62" stroke={color} strokeWidth="0.9" />
      <path d="M80 1.5 85 6l-5 4.5L75 6Z" stroke={color} strokeWidth="0.9" />
      <circle cx="69" cy="6" r="1.1" fill={color} />
      <circle cx="91" cy="6" r="1.1" fill={color} />
    </svg>
  )
}

/** Album photo corners — paper triangles holding a print at each corner. */
function Corners({ color, edge, size = 26 }: { color: string; edge: string; size?: number }) {
  const place = [
    { left: -3, top: -3, rotate: 0 },
    { right: -3, top: -3, rotate: 90 },
    { right: -3, bottom: -3, rotate: 180 },
    { left: -3, bottom: -3, rotate: 270 },
  ]
  return (
    <>
      {place.map(({ rotate, ...pos }, i) => (
        <svg
          key={i}
          viewBox="0 0 26 26"
          width={size}
          height={size}
          className="pointer-events-none absolute"
          style={{ ...pos, transform: `rotate(${rotate}deg)` }}
          aria-hidden
        >
          <path d="M0 0h26L0 26Z" fill={color} />
          <path d="M26 0 0 26" stroke={edge} strokeWidth="1" />
          <path d="M3.5 3.5h13.4M3.5 3.5v13.4" stroke={edge} strokeWidth="0.6" opacity="0.6" />
        </svg>
      ))}
    </>
  )
}

function Mounted({ children, tilt = 0, className, style }: { children: ReactNode; tilt?: number; className?: string; style?: CSSProperties }) {
  return (
    <figure
      className={`relative ${className ?? ''}`}
      style={{
        background: C.card,
        padding: 12,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        boxShadow: '0 1px 0 rgba(59,18,32,0.05), 0 22px 40px -24px rgba(30,6,14,0.55)',
        ...style,
      }}
    >
      <div className="relative h-full w-full">
        {children}
        <Corners color={C.gold} edge={C.goldInk} />
      </div>
    </figure>
  )
}

// ─── Template ───────────────────────────────────────────────────────────────

export default function Anniversary({ data, eventId, isPreview = false }: InviteProps) {
  const couple = data.coupleNames?.trim() || 'Sunita & Rajesh'
  const yearsText = data.years?.trim() || ''
  const yearsMatch = yearsText.match(/^(\d{1,2})(?:\s*(?:st|nd|rd|th|years?|yrs?))?$/i)
  const years = yearsMatch ? Number(yearsMatch[1]) : null
  const date = dateParts(data.date)
  const spelledTime = timeWords(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const photo = data.couplePhoto && /^(https?:)?\//.test(data.couplePhoto) ? data.couplePhoto : null
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const milestone = years ? MILESTONES[years] : undefined
  const since = years && date ? date.year - years : null

  const calendar = calendarHref(
    `${couple} — ${years ? `${years}${suffix(years)} ` : ''}wedding anniversary`,
    data.date,
    data.time,
    [data.venue, data.venueAddress].filter(Boolean).join(', '),
    4,
  )

  // "Sunita & Rajesh" → set the ampersand in the italic display face.
  const parts = couple.split(/\s+(?:&|and)\s+/i)
  const names =
    parts.length === 2 ? (
      <>
        {parts[0]}{' '}
        <span style={{ fontFamily: numeralFace, fontStyle: 'italic', color: C.gold, fontSize: '0.86em' }}>&amp;</span>{' '}
        {parts[1]}
      </>
    ) : (
      couple
    )

  const label: CSSProperties = { fontFamily: sans, fontSize: 12, fontWeight: 500, letterSpacing: '0.26em', textTransform: 'uppercase' }
  const numeralSize = years !== null && years >= 10 ? 'clamp(190px, 72cqi, 330px)' : 'clamp(200px, 80cqi, 360px)'

  return (
    <div
      className="sa relative overflow-x-hidden"
      style={{ backgroundColor: C.paper, color: C.ink, fontFamily: serif, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .sa .sa-draw { stroke-dasharray: 130; stroke-dashoffset: 130; animation: sa-draw 1.9s cubic-bezier(.45,.1,.3,1) 300ms forwards; }
        .sa .sa-draw-2 { animation-delay: 750ms; }
        .sa .sa-late { opacity: 0; animation: sa-fade 600ms ease 2.1s forwards; }
        @keyframes sa-draw { to { stroke-dashoffset: 0; } }
        @keyframes sa-fade { to { opacity: 1; } }
        .sa .sa-btn { transition: background-color 180ms ease, color 180ms ease; }
        @media (prefers-reduced-motion: reduce) {
          .sa .sa-draw, .sa .sa-late { animation: none; stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.cream} background="rgba(66,14,30,0.82)" border={C.goldLine} />

      {/* ── The years ─────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: C.wine,
          color: C.cream,
          minHeight: isPreview ? 560 : '100svh',
          paddingTop: 56,
          paddingBottom: photo ? 'clamp(176px, 52cqi, 236px)' : 64,
          ...grain(0.07),
        }}
      >
        <div className="w-full max-w-[30rem]">
          {milestone && (
            <p style={{ ...label, color: C.goldSoft }}>The {milestone} anniversary</p>
          )}

          {years !== null ? (
            <h1 className="mt-2">
              <span className="sr-only">
                {couple} — celebrating {numberWords(years)} {years === 1 ? 'year' : 'years'} of marriage
              </span>
              <span
                aria-hidden
                className="block"
                style={{
                  fontFamily: numeralFace,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: numeralSize,
                  lineHeight: 0.86,
                  letterSpacing: '-0.03em',
                  color: C.gold,
                  fontVariantNumeric: 'lining-nums',
                  marginLeft: '-0.06em',
                }}
              >
                {years}
              </span>
              <span aria-hidden className="mx-auto mt-4 block max-w-[17rem] italic leading-[1.3]" style={{ fontSize: 'clamp(21px, 6.4cqi, 26px)', color: C.creamSoft, textWrap: 'balance' }}>
                Celebrating {numberWords(years)} {years === 1 ? 'year' : 'years'} of marriage
              </span>
            </h1>
          ) : (
            <h1>
              <Rings draw={!isPreview} color={C.gold} gap={C.wine} className="mx-auto mb-9 w-[112px]" />
              <span
                className="block italic leading-[1.05]"
                style={{ fontFamily: numeralFace, fontWeight: 400, fontSize: 'clamp(40px, 12.4cqi, 64px)', color: C.cream, textWrap: 'balance' }}
              >
                {names}
              </span>
              <span className="mx-auto mt-5 block max-w-[18rem] italic leading-[1.3]" style={{ fontSize: 'clamp(21px, 6.4cqi, 26px)', color: C.creamSoft, textWrap: 'balance' }}>
                {yearsText ? `Celebrating ${yearsText}` : 'Celebrating their wedding anniversary'}
              </span>
              {date && (
                <span className="mt-8 block" style={{ ...label, fontSize: 13, color: C.goldSoft }}>
                  {date.day} {date.month} {date.year}
                </span>
              )}
            </h1>
          )}

          {years !== null && (
            <>
              <Rings draw={!isPreview} color={C.gold} gap={C.wine} className="mx-auto mt-8 w-[84px]" />
              <p className="mt-5 leading-[1.1]" style={{ fontSize: 'clamp(32px, 10cqi, 46px)', fontWeight: 500, textWrap: 'balance' }}>
                {names}
              </p>
            </>
          )}

          {since !== null && since > 1900 && (
            <p className="mt-4 tabular-nums" style={{ ...label, fontSize: 13, letterSpacing: '0.34em', color: C.goldSoft }}>
              {since} &nbsp;&mdash;&nbsp; {date?.year}
            </p>
          )}
        </div>
      </section>

      {/* ── The photograph, lapping over the fold ────────────────── */}
      {photo && (
        <div className="relative z-10 px-6" style={{ marginTop: 'clamp(-190px, -42cqi, -130px)' }}>
          <Mounted tilt={-1.5} className="mx-auto w-[76%] max-w-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={couple} className="block aspect-[4/5] w-full object-cover" />
          </Mounted>
        </div>
      )}

      {/* ── The invitation ─────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-14 pt-14 text-center">
        <p className="mx-auto max-w-[20rem] italic leading-[1.4]" style={{ fontSize: 22, color: C.inkSoft, textWrap: 'balance' }}>
          The pleasure of your company is requested to celebrate the {years ? <span className="whitespace-nowrap">{ordinalWords(years)}</span> : null} wedding anniversary&nbsp;of
        </p>
        <p className="mt-3 leading-[1.1]" style={{ fontFamily: numeralFace, fontStyle: 'italic', fontSize: 'clamp(30px, 9cqi, 40px)', color: C.wine }}>
          {couple}
        </p>

        <Flourish color={C.gold} className="mx-auto mt-8 w-[150px]" />

        <div className="mt-8">
          {date ? (
            <>
              <p style={{ ...label, fontSize: 13, color: C.goldInk }}>{date.weekday}</p>
              <p className="mt-2 leading-none" style={{ fontFamily: numeralFace, fontSize: 'clamp(34px, 10.5cqi, 46px)', color: C.ink, fontVariantNumeric: 'lining-nums' }}>
                {date.day} {date.month}
              </p>
              <p className="mt-3 italic" style={{ fontSize: 19, color: C.inkSoft }}>
                {yearWords(date.year)}
                {spelledTime && <><br />at {spelledTime}</>}
              </p>
            </>
          ) : (
            <p className="italic" style={{ fontSize: 22, color: C.inkSoft }}>
              Date to be announced{spelledTime && <><br />at {spelledTime}</>}
            </p>
          )}
        </div>

        <div className="mt-9 border-t pt-8" style={{ borderColor: C.rule }}>
          <p className="leading-[1.15]" style={{ fontFamily: numeralFace, fontSize: 'clamp(24px, 7.4cqi, 30px)', color: C.ink }}>
            {data.venue || 'The venue'}
          </p>
          {data.venueAddress && (
            <p className="mx-auto mt-2 max-w-[20rem] leading-[1.55]" style={{ fontFamily: sans, fontSize: 15, color: C.inkSoft }}>
              {data.venueAddress}
            </p>
          )}
          {data.dressCode && (
            <p className="mt-4 italic" style={{ fontSize: 19, color: C.inkSoft }}>
              Dress: {data.dressCode}
            </p>
          )}
        </div>

        {(directions || calendar) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className="sa-btn inline-flex min-h-[46px] items-center gap-2 px-6 text-[13px] uppercase hover:bg-[#420E1E]"
              style={{ fontFamily: sans, letterSpacing: '0.18em', background: C.wine, color: C.cream }}
            >
              Directions
            </DirectionsLink>
            {calendar && (
              <a
                href={isPreview ? undefined : calendar}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={isPreview || undefined}
                className="sa-btn inline-flex min-h-[46px] items-center gap-2 border px-6 text-[13px] uppercase hover:bg-[rgba(84,19,39,0.06)]"
                style={{ fontFamily: sans, letterSpacing: '0.18em', borderColor: C.wine, color: C.wine }}
              >
                Add to calendar
              </a>
            )}
          </div>
        )}
      </Reveal>

      {/* ── Counting down, in words ───────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="px-6 py-10 text-center" style={{ backgroundColor: C.wine, color: C.cream, ...grain(0.07) }}>
          <p className="italic leading-[1.15]" style={{ fontFamily: numeralFace, fontSize: 'clamp(26px, 8cqi, 34px)' }}>
            {countdown.days > 0 ? (
              <>
                {numberWords(countdown.days).replace(/^./, (c) => c.toUpperCase())} {countdown.days === 1 ? 'day' : 'days'} to go
              </>
            ) : (
              'Tonight'
            )}
          </p>
          <p className="mt-3 tabular-nums" style={{ fontFamily: sans, fontSize: 14, letterSpacing: '0.12em', color: C.goldSoft }}>
            {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
          </p>
        </Reveal>
      )}

      {/* ── A note from the couple ────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pt-16 text-center">
          <span aria-hidden className="block leading-[0.6]" style={{ fontFamily: numeralFace, fontStyle: 'italic', fontSize: 84, color: C.gold }}>
            &ldquo;
          </span>
          <p className="mt-2 italic leading-[1.45]" style={{ fontSize: 'clamp(22px, 6.6cqi, 26px)', color: C.ink }}>
            {data.message}
          </p>
          <p className="mt-5" style={{ ...label, color: C.goldInk }}>{couple}</p>
        </Reveal>
      )}

      {/* ── The evening, set like a menu card ─────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-16">
          <div className="px-5 pb-8 pt-9" style={{ background: C.card, border: `1px solid ${C.rule}`, outline: `1px solid ${C.rule}`, outlineOffset: -7 }}>
            <h2 className="text-center italic" style={{ fontFamily: numeralFace, fontSize: 32, fontWeight: 400, color: C.wine }}>
              The evening
            </h2>
            <Flourish color={C.gold} className="mx-auto mt-3 w-[120px]" />
            <ol className="mt-7 space-y-5">
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`}>
                  <div className="flex items-baseline">
                    <span className="leading-[1.25]" style={{ fontSize: 'clamp(18px, 5.6cqi, 21px)', fontWeight: 500 }}>{item.title}</span>
                    {item.time && (
                      <>
                        <span aria-hidden className="mx-2 min-w-[1.5rem] flex-1 border-b border-dotted" style={{ borderColor: C.goldInk, transform: 'translateY(-5px)' }} />
                        <span className="shrink-0 tabular-nums" style={{ fontFamily: sans, fontSize: 15, color: C.wine }}>{item.time}</span>
                      </>
                    )}
                  </div>
                  {item.note && <p className="mt-0.5 italic" style={{ fontSize: 17, color: C.inkSoft }}>{item.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      {/* ── From the album ────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="px-5 pb-16 pt-14" style={{ backgroundColor: C.wine, color: C.cream, ...grain(0.07) }}>
          <div className="mx-auto max-w-[34rem]">
            <Reveal disabled={isPreview}>
              <h2 className="text-center italic" style={{ fontFamily: numeralFace, fontSize: 32, fontWeight: 400 }}>
                From the album
              </h2>
              <Flourish color={C.gold} className="mx-auto mt-3 w-[120px]" />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6">
              {photos.map((src, i) => {
                const wide = i % 3 === 0
                const tilt = [-1.2, 1.4, -0.8, 1, -1.5, 0.9, -1][i % 7]
                return (
                  <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 100} className={wide ? 'col-span-2 mx-auto w-[88%]' : ''}>
                    <Mounted tilt={tilt} style={{ padding: 8 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className={`block w-full object-cover ${wide ? 'aspect-[3/2]' : 'aspect-[4/5]'}`} />
                    </Mounted>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title="Wishes for the couple"
          intro={`Leave a few words for ${couple}. Your message appears here for every guest.`}
        />
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ backgroundColor: C.wine, color: C.cream, ...grain(0.07) }}>
        <Rings color={C.gold} gap={C.wine} className="mx-auto w-[64px]" />
        <p className="mt-4 leading-[1.15]" style={{ fontSize: 28, fontWeight: 500 }}>{names}</p>
        <p className="mt-2 italic" style={{ fontSize: 18, color: C.creamFaint }}>
          {years !== null
            ? `${ordinalWords(years).replace(/^./, (c) => c.toUpperCase())} anniversary${date ? ` · ${date.day} ${date.month} ${date.year}` : ''}`
            : date
              ? `${date.day} ${date.month} ${date.year}`
              : 'With love'}
        </p>
        <div className="mt-10">
          <Credit isPreview={isPreview} color={C.creamFaint} linkColor={C.gold} />
        </div>
      </footer>
    </div>
  )
}
