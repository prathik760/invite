'use client'

import { useMemo } from 'react'
import WishesSection from './WishesSection'
import { cormorant } from './kit/fonts/cormorant'
import { jost } from './kit/fonts/jost'
import { Laurel, Sprig } from './kit/botanical'
import {
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { ordinalWords, timeWords, yearWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Elegant Wedding — a letterpress card on cotton paper.
 * Ink, sage and one soft rule colour; spelled-out date and time as formal
 * stationery does; an olive sprig drawn in on arrival and nothing else moving.
 */

const C = {
  paper: '#F5F0E6',
  card: '#FBF8F1',
  ink: '#2F2A25',
  soft: 'rgba(47,42,37,0.64)',
  faint: 'rgba(47,42,37,0.42)',
  rule: '#D8CDBB',
  sage: '#6E7B5F',
  sageFill: 'rgba(110,123,95,0.10)',
}

const serif = cormorant.style.fontFamily
const sans = jost.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: C.rule,
  accent: C.sage,
  onAccent: '#FFFFFF',
  heading: serif,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 34 },
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase" style={{ fontFamily: sans, letterSpacing: '0.24em', color: C.faint }}>
      {children}
    </p>
  )
}

function Rule({ width = 56 }: { width?: number }) {
  return <span aria-hidden className="mx-auto block h-px" style={{ width, background: C.rule }} />
}

export default function ElegantWedding({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Emily'
  const groom = data.groomName?.trim() || 'James'
  const date = dateParts(data.date)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const portraits = [data.bridePhoto, data.groomPhoto].filter((u) => u && /^(https?:)?\//.test(u)) as string[]

  const spelledTime = timeWords(data.time)
  const monogram = `${bride.charAt(0)}${groom.charAt(0)}`

  return (
    <div
      className="ew relative overflow-x-hidden"
      style={{ background: C.paper, color: C.ink, fontFamily: serif, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .ew .botanical-stroke { stroke-dasharray: 260; stroke-dashoffset: 260; animation: ew-draw 1.8s ease forwards 200ms; }
        .ew .botanical-leaf { opacity: 0; animation: ew-leaf 700ms ease forwards; }
        .ew .ew-in { opacity: 0; transform: translateY(10px); animation: ew-in 1s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes ew-draw { to { stroke-dashoffset: 0; } }
        @keyframes ew-leaf { to { opacity: 1; } }
        @keyframes ew-in { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .ew .botanical-stroke, .ew .botanical-leaf, .ew .ew-in { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.ink} background="rgba(251,248,241,0.85)" border={C.rule} />

      {/* ── The card ─────────────────────────────────────────────── */}
      <section
        className="flex items-center justify-center px-4 py-6"
        style={{ minHeight: isPreview ? 560 : '100svh' }}
      >
        <div
          className="relative w-full max-w-[30rem] px-6 pb-12 pt-10 text-center"
          style={{
            background: C.card,
            boxShadow: '0 1px 0 rgba(47,42,37,0.04), 0 22px 48px -30px rgba(47,42,37,0.35)',
          }}
        >
          {/* Double rule, inset — the letterpress border. */}
          <span aria-hidden className="pointer-events-none absolute inset-[10px] border" style={{ borderColor: C.rule }} />
          <span aria-hidden className="pointer-events-none absolute inset-[14px] border" style={{ borderColor: 'rgba(216,205,187,0.55)' }} />

          <div className="relative">
            <Sprig draw={!isPreview} color={C.sage} fill={C.sageFill} seed={5} className="mx-auto w-[128px]" />

            {portraits.length > 0 && (
              <div className="ew-in mt-6 flex justify-center gap-3" style={{ animationDelay: '300ms' }}>
                {portraits.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={i === 0 ? bride : groom}
                    className="h-[92px] w-[72px] object-cover"
                    style={{ borderRadius: '50%', border: `1px solid ${C.rule}`, padding: 3, background: C.card }}
                  />
                ))}
              </div>
            )}

            <div className="ew-in mt-7" style={{ animationDelay: '350ms' }}>
              <Label>Together with their families</Label>
            </div>

            <h1 className="mt-6" style={{ fontWeight: 300 }}>
              <span
                className="ew-in block italic leading-[0.95]"
                style={{ fontSize: 'clamp(46px, 15cqi, 78px)', animationDelay: '500ms' }}
              >
                {bride}
              </span>
              <span
                className="ew-in my-2 block italic"
                style={{ fontSize: 'clamp(18px, 5cqi, 24px)', color: C.sage, animationDelay: '650ms' }}
              >
                and
              </span>
              <span
                className="ew-in block italic leading-[0.95]"
                style={{ fontSize: 'clamp(46px, 15cqi, 78px)', animationDelay: '800ms' }}
              >
                {groom}
              </span>
            </h1>

            <p
              className="ew-in mx-auto mt-7 max-w-[19rem] leading-[1.45]"
              style={{ fontSize: 19, color: C.soft, animationDelay: '950ms' }}
            >
              request the pleasure of your company at the celebration of their marriage
            </p>

            <div className="ew-in mt-8" style={{ animationDelay: '1100ms' }}>
              {date ? (
                <>
                  <div className="mx-auto flex max-w-[20rem] items-center justify-center gap-4">
                    <span className="flex-1 border-y py-1.5 text-[11px] uppercase" style={{ fontFamily: sans, letterSpacing: '0.22em', borderColor: C.rule }}>
                      {date.weekday}
                    </span>
                    <span className="leading-none" style={{ fontSize: 52, fontWeight: 400, fontVariantNumeric: 'lining-nums' }}>{date.day}</span>
                    <span className="flex-1 border-y py-1.5 text-[11px] uppercase" style={{ fontFamily: sans, letterSpacing: '0.22em', borderColor: C.rule }}>
                      {date.month}
                    </span>
                  </div>
                  <p className="mt-3 italic" style={{ fontSize: 17, color: C.soft }}>
                    {yearWords(date.year)}
                    {spelledTime && <><br />at {spelledTime}</>}
                  </p>
                </>
              ) : (
                <p className="italic" style={{ fontSize: 18, color: C.soft }}>
                  Date to be announced{spelledTime && <><br />at {spelledTime}</>}
                </p>
              )}
            </div>

            <div className="ew-in mt-8" style={{ animationDelay: '1250ms' }}>
              <p className="text-[15px] uppercase" style={{ letterSpacing: '0.16em', fontWeight: 600 }}>
                {data.venue || 'The venue'}
              </p>
              {data.venueAddress && (
                <p className="mt-1.5 text-[13px] leading-[1.5]" style={{ fontFamily: sans, color: C.soft }}>
                  {data.venueAddress}
                </p>
              )}
            </div>

            {data.dressCode && (
              <p className="ew-in mt-7 italic" style={{ fontSize: 16, color: C.soft, animationDelay: '1350ms' }}>
                {data.dressCode}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[30rem] px-6 pb-4">
        {/* ── A note from the couple ─────────────────────────────── */}
        {data.message && (
          <Reveal disabled={isPreview} as="section" className="py-12 text-center">
            <Sprig color={C.sage} fill={C.sageFill} seed={21} leaves={5} className="mx-auto w-[72px] opacity-80" />
            <p className="mx-auto mt-5 max-w-[24rem] italic leading-[1.5]" style={{ fontSize: 22 }}>
              {data.message}
            </p>
          </Reveal>
        )}

        {/* ── Countdown, typeset rather than boxed ──────────────── */}
        {countdown && (
          <Reveal disabled={isPreview} as="section" className="border-y py-9 text-center" style={{ borderColor: C.rule }}>
            <Label>Counting the days</Label>
            <p className="mt-3 leading-none" style={{ fontSize: 64, fontWeight: 300 }}>
              {countdown.days}
              <span className="ml-2 italic" style={{ fontSize: 24, color: C.soft }}>{countdown.days === 1 ? 'day' : 'days'}</span>
            </p>
            <p className="mt-3 tabular-nums" style={{ fontFamily: sans, fontSize: 13, color: C.soft, letterSpacing: '0.06em' }}>
              {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
            </p>
          </Reveal>
        )}

        {/* ── Order of the day ───────────────────────────────────── */}
        {schedule.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="py-14">
            <h2 className="text-center italic" style={{ fontSize: 34, fontWeight: 400 }}>The order of the day</h2>
            <div className="mt-2"><Rule /></div>
            <ol className="mt-8">
              {schedule.map((item, i) => (
                <li
                  key={`${item.title}-${i}`}
                  className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b py-4"
                  style={{ borderColor: C.rule }}
                >
                  <span className="text-right text-[12px] uppercase tabular-nums" style={{ fontFamily: sans, letterSpacing: '0.12em', color: C.sage }}>
                    {item.time || '—'}
                  </span>
                  <span style={{ fontSize: 21 }}>{item.title}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>

      {/* ── Photographs, laid out like a spread ─────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[36rem] px-4 py-10">
          <Reveal disabled={isPreview}>
            <h2 className="text-center italic" style={{ fontSize: 34, fontWeight: 400 }}>A few of our favourites</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-6 gap-2.5">
            {photos.map((src, i) => {
              const span = [
                'col-span-6 aspect-[4/5]',
                'col-span-3 aspect-[3/4]',
                'col-span-3 aspect-[3/4] mt-8',
                'col-span-6 aspect-[3/2]',
              ][i % 4]
              return (
                <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className={span}>
                  <figure className="h-full w-full p-[6px]" style={{ background: C.card, boxShadow: '0 10px 24px -18px rgba(47,42,37,0.5)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </figure>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Venue ───────────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-14 text-center">
        <Label>The celebration will be held at</Label>
        <h2 className="mt-4 leading-[1.05]" style={{ fontSize: 'clamp(34px, 10cqi, 46px)', fontWeight: 400 }}>
          {data.venue || 'The venue'}
        </h2>
        {data.venueAddress && (
          <p className="mx-auto mt-3 max-w-[20rem] text-[14px] leading-[1.6]" style={{ fontFamily: sans, color: C.soft }}>
            {data.venueAddress}
          </p>
        )}
        {(date || data.time) && (
          <p className="mt-3 italic" style={{ fontSize: 17, color: C.soft }}>
            {date ? `${date.weekday}, the ${ordinalWords(date.day)} of ${date.month}` : ''}
            {date && data.time ? ' · ' : ''}
            {timeLabel(data.time)}
          </p>
        )}
        <DirectionsLink
          href={directions}
          isPreview={isPreview}
          className="mt-7 inline-flex items-center gap-2 border px-6 py-3 text-[12px] uppercase transition-colors hover:bg-[rgba(47,42,37,0.04)]"
          style={{ fontFamily: sans, letterSpacing: '0.2em', borderColor: C.ink, color: C.ink }}
        >
          Directions
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
            <path d="M4 12 12 4M6 4h6v6" />
          </svg>
        </DirectionsLink>
      </Reveal>

      {eventId && (
        <div className="border-t" style={{ borderColor: C.rule }}>
          <WishesSection eventId={eventId} theme={WISHES_THEME} />
        </div>
      )}

      {/* ── Monogram ────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: C.paper }}>
        <div className="relative mx-auto h-[132px] w-[132px]">
          <Laurel color={C.sage} fill={C.sageFill} className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-0 flex items-center justify-center italic" style={{ fontSize: 40, fontWeight: 300 }}>
            {monogram.charAt(0)}
            <span className="mx-0.5" style={{ fontSize: 22, color: C.sage }}>&amp;</span>
            {monogram.charAt(1)}
          </span>
        </div>
        {date && (
          <p className="mt-4 text-[12px] uppercase tabular-nums" style={{ fontFamily: sans, letterSpacing: '0.3em', color: C.faint }}>
            {date.dayPadded} · {date.monthShort} · {date.year}
          </p>
        )}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.soft} />
        </div>
      </footer>
    </div>
  )
}
