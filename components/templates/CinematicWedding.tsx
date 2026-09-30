'use client'

import { useMemo, type CSSProperties } from 'react'
import WishesSection from './WishesSection'
import { bodoni } from './kit/fonts/bodoni'
import { oswald } from './kit/fonts/oswald'
import {
  calendarHref,
  dateParts,
  galleryImages,
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
 * Cinematic Night — the opening title card of a film.
 * Letterboxed black, warm projector white and one tungsten amber. The names
 * fade up from black like a title; the programme runs as end credits; the
 * venue is a ticket stub; photographs sit in a strip of film.
 */

const C = {
  black: '#0B0B0C',
  bar: '#000000',
  film: '#050505',
  ink: '#EFE8DC',
  soft: 'rgba(239,232,220,0.72)',
  faint: 'rgba(239,232,220,0.46)',
  rule: 'rgba(239,232,220,0.16)',
  amber: '#E0A458',
  amberFill: 'rgba(224,164,88,0.16)',
  paper: '#ECE4D3',
  paperInk: '#1C1914',
  paperSoft: 'rgba(28,25,20,0.64)',
  paperRule: 'rgba(28,25,20,0.24)',
}

const serif = bodoni.style.fontFamily
const sans = oswald.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: 'transparent',
  surface: 'rgba(239,232,220,0.035)',
  ink: C.ink,
  muted: C.soft,
  line: 'rgba(239,232,220,0.14)',
  accent: C.amber,
  onAccent: '#14110C',
  heading: serif,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 34 },
}

/** Light film grain — the kit's grain is dark ink, which vanishes on black. */
function filmGrain(opacity: number, size = 160): CSSProperties {
  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${opacity} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: `${size}px ${size}px`,
  }
}

/** Sprocket holes for one edge of the film strip, as a repeating tile. */
const SPROCKETS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='22'%3E%3Crect x='1.5' y='7' width='11' height='8' rx='1.6' fill='%23141414'/%3E%3C/svg%3E")`

/** Fit the title to the names: short names run large, long ones step down. */
function titleSize(...names: string[]) {
  const n = Math.max(...names.map((s) => Math.max(...s.split(/\s+/).map((w) => w.length), s.length * 0.7)))
  const cqi = n <= 6 ? 18 : n <= 8 ? 15.5 : n <= 10 ? 13 : n <= 13 ? 10.5 : 9
  return `clamp(34px, ${cqi}cqi, ${Math.round(cqi * 5.4)}px)`
}

function Caps({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.32em', color: C.faint, ...style }}>
      {children}
    </p>
  )
}

export default function CinematicWedding({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Emily'
  const groom = data.groomName?.trim() || 'James'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const stills = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`${bride} & ${groom} — Wedding`, data.date, data.time, place)
  const cast = [
    { src: data.bridePhoto, name: bride },
    { src: data.groomPhoto, name: groom },
  ].filter((p) => p.src && /^(https?:)?\//.test(p.src)) as { src: string; name: string }[]

  const hour = Number((data.time || '').split(':')[0])
  const billing = !Number.isNaN(hour) && hour >= 17 ? 'One night only' : 'The premiere'
  const serial = date ? `${date.dayPadded}${pad2(new Date(`${data.date}T00:00:00`).getMonth() + 1)}${String(date.year).slice(2)}` : '0001'
  const titleFont = titleSize(bride, groom)
  const venue = data.venue?.trim() || 'The venue'

  return (
    <div
      className="cn relative overflow-x-hidden"
      style={{ background: C.black, color: C.ink, fontFamily: sans, containerType: 'inline-size', ...filmGrain(0.06) }}
    >
      <style>{`
        .cn .cn-black { animation: cn-black 1.7s ease-out 150ms forwards; }
        .cn .cn-in { opacity: 0; animation: cn-up 1.3s ease forwards; }
        @keyframes cn-black { to { opacity: 0; visibility: hidden; } }
        .cn .cn-rule { transform: scaleX(0); animation: cn-rule 1.1s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes cn-up { to { opacity: 1; } }
        @keyframes cn-rule { to { transform: none; } }
        .cn .cn-link { transition: background-color .2s ease; }
        .cn .cn-link:hover { background-color: rgba(28,25,20,0.06); }
        @media (prefers-reduced-motion: reduce) {
          .cn .cn-in, .cn .cn-rule { animation: none; opacity: 1; transform: none; }
          .cn .cn-black { display: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.ink} background="rgba(0,0,0,0.6)" border={C.rule} />

      {/* ── Title card, letterboxed ───────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <div aria-hidden className="shrink-0" style={{ height: 'clamp(44px, 14cqi, 72px)', background: C.bar }} />

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          {/* The frame fades up from black before the title appears. */}
          {!isPreview && <div aria-hidden className="cn-black pointer-events-none absolute inset-0" style={{ background: C.bar }} />}
          <Caps className="cn-in" style={{ color: C.soft, animationDelay: '300ms' }}>
            Together with their families
          </Caps>

          <h1 className="mt-8" style={{ fontFamily: serif, fontWeight: 400, overflowWrap: 'break-word' }}>
            <span className="cn-in block italic" style={{ fontSize: titleFont, lineHeight: 0.98, animationDelay: '800ms' }}>
              {bride}
            </span>
            <span
              className="cn-in block italic"
              style={{ fontSize: 'clamp(26px, 9cqi, 46px)', lineHeight: 1.25, color: C.amber, animationDelay: '1100ms' }}
            >
              &amp;
            </span>
            <span className="cn-in block italic" style={{ fontSize: titleFont, lineHeight: 0.98, animationDelay: '1300ms' }}>
              {groom}
            </span>
          </h1>

          <p
            className="cn-in mx-auto mt-8 max-w-[17rem] italic leading-[1.45]"
            style={{ fontFamily: serif, fontSize: 18, color: C.soft, animationDelay: '1800ms' }}
          >
            request the pleasure of your company at their wedding
          </p>

          <div className="mt-10 w-full max-w-[28rem]">
            <span aria-hidden className="cn-rule mx-auto block h-px w-12" style={{ background: C.amber, animationDelay: '2100ms' }} />
            <div className="cn-in" style={{ animationDelay: '2200ms' }}>
              <Caps className="mt-5" style={{ color: C.amber, letterSpacing: '0.36em' }}>{billing}</Caps>
              <p className="mt-3 text-balance uppercase" style={{ fontSize: 'clamp(17px, 5.4cqi, 22px)', letterSpacing: '0.14em', fontWeight: 400 }}>
                {date ? `${date.weekday} · ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              <p className="mt-2 text-balance uppercase leading-[1.5]" style={{ fontSize: 15, letterSpacing: '0.12em', color: C.soft, fontWeight: 300 }}>
                {[time, venue].filter(Boolean).join('  ·  ')}
              </p>
            </div>
          </div>
        </div>

        <div aria-hidden className="shrink-0" style={{ height: 'clamp(44px, 14cqi, 72px)', background: C.bar }} />
      </section>

      {/* ── Epigraph: the couple's own words ──────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 py-20 text-center">
          <p className="italic leading-[1.45]" style={{ fontFamily: serif, fontSize: 'clamp(21px, 6.2cqi, 27px)' }}>
            {data.message}
          </p>
          <Caps className="mt-6" style={{ color: C.amber }}>
            {bride} &amp; {groom}
          </Caps>
        </Reveal>
      )}

      {/* ── Starring ─────────────────────────────────────────────── */}
      {cast.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-16 pt-4 text-center">
          <Caps>Starring</Caps>
          <div className={`mx-auto mt-6 grid gap-3 ${cast.length === 2 ? 'grid-cols-2' : 'w-3/5 grid-cols-1'}`}>
            {cast.map((p) => (
              <figure key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                />
                <figcaption className="mt-3 uppercase leading-[1.3]" style={{ fontSize: 'clamp(13px, 4.2cqi, 16px)', letterSpacing: '0.16em', overflowWrap: 'anywhere' }}>
                  {p.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      )}

      {/* ── Countdown on an Academy leader ──────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="px-6 py-16 text-center">
          <Caps>Opening in</Caps>
          <div className="relative mx-auto mt-7 h-[208px] w-[208px]">
            <div
              aria-hidden
              className="absolute inset-[14px] rounded-full"
              style={{ background: `conic-gradient(rgba(224,164,88,0.09) ${countdown.seconds * 6}deg, transparent 0)` }}
            />
            <svg viewBox="0 0 208 208" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
              <rect x="0.5" y="0.5" width="207" height="207" stroke={C.rule} />
              <circle cx="104" cy="104" r="90" stroke={C.rule} />
              <circle cx="104" cy="104" r="74" stroke="rgba(239,232,220,0.1)" />
              <path d="M104 0v40M104 168v40M0 104h40M168 104h40" stroke="rgba(239,232,220,0.14)" />
              <path d="M104 46V14" stroke={C.amber} strokeOpacity={0.8} transform={`rotate(${countdown.seconds * 6} 104 104)`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular-nums leading-none" style={{ fontSize: 76, fontWeight: 300 }}>
                {countdown.days}
              </span>
              <span className="mt-2 uppercase" style={{ fontSize: 13, letterSpacing: '0.3em', color: C.soft }}>
                {countdown.days === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
          <p className="mt-6 italic" style={{ fontFamily: serif, fontSize: 18, color: C.soft }}>
            {countdown.hours} {countdown.hours === 1 ? 'hour' : 'hours'}, {countdown.minutes} min and{' '}
            <span className="tabular-nums">{pad2(countdown.seconds)}</span> sec
          </p>
        </Reveal>
      )}

      {/* ── The ticket ───────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="px-5 py-14">
        <div className="mx-auto max-w-[24rem]" style={{ color: C.paperInk }}>
          <div className="relative rounded-t-[6px] px-6 pb-7 pt-5" style={{ background: C.paper }}>
            <div className="flex items-baseline justify-between border-b pb-3 uppercase" style={{ borderColor: C.paperRule, fontSize: 12, letterSpacing: '0.26em', color: C.paperSoft }}>
              <span>The wedding of</span>
              <span className="tabular-nums" style={{ letterSpacing: '0.14em' }}>Nº {serial}</span>
            </div>

            <p className="mt-5 italic leading-[1.05]" style={{ fontFamily: serif, fontSize: 'clamp(26px, 8.4cqi, 31px)', overflowWrap: 'break-word' }}>
              {bride} <span style={{ color: '#A8672A' }}>&amp;</span> {groom}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
              <div className="col-span-2">
                <TicketLabel>Date</TicketLabel>
                <dd className="mt-1 uppercase" style={{ fontSize: 19, letterSpacing: '0.06em' }}>
                  {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'To be announced'}
                </dd>
              </div>
              {time && (
                <div className={data.dressCode ? '' : 'col-span-2'}>
                  <TicketLabel>Time</TicketLabel>
                  <dd className="mt-1 uppercase tabular-nums" style={{ fontSize: 18, letterSpacing: '0.06em' }}>{time}</dd>
                </div>
              )}
              {data.dressCode && (
                <div className={time ? '' : 'col-span-2'}>
                  <TicketLabel>Dress</TicketLabel>
                  <dd className="mt-1 uppercase leading-[1.3]" style={{ fontSize: 18, letterSpacing: '0.06em' }}>{data.dressCode}</dd>
                </div>
              )}
              <div className="col-span-2 border-t pt-5" style={{ borderColor: C.paperRule }}>
                <TicketLabel>Venue</TicketLabel>
                <dd className="mt-1.5 leading-[1.15]" style={{ fontFamily: serif, fontSize: 25, fontWeight: 500 }}>{venue}</dd>
                {data.venueAddress && (
                  <dd className="mt-1.5 leading-[1.45]" style={{ fontSize: 16, fontWeight: 300, color: C.paperSoft }}>
                    {data.venueAddress}
                  </dd>
                )}
              </div>
            </dl>
          </div>

          {/* Perforation: notched both sides, a row of punched dots between. */}
          <div
            aria-hidden
            className="relative h-[22px]"
            style={{
              background: `radial-gradient(circle at 0 50%, transparent 10px, ${C.paper} 10.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 10px, ${C.paper} 10.5px) right / 51% 100% no-repeat`,
            }}
          >
            <span
              className="absolute left-[18px] right-[18px] top-1/2 h-[3px] -translate-y-1/2"
              style={{ backgroundImage: `radial-gradient(circle, ${C.paperRule} 1.3px, transparent 1.6px)`, backgroundSize: '9px 3px' }}
            />
          </div>

          <div className="flex rounded-b-[6px]" style={{ background: C.paper }}>
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className="cn-link flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-bl-[6px] uppercase"
              style={{ fontSize: 'clamp(12.5px, 3.9cqi, 14px)', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}
            >
              Directions
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </DirectionsLink>
            {directions && calendar && <span aria-hidden className="my-3 w-px" style={{ background: C.paperRule }} />}
            <DirectionsLink
              href={calendar}
              isPreview={isPreview}
              className="cn-link flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-br-[6px] uppercase"
              style={{ fontSize: 'clamp(12.5px, 3.9cqi, 14px)', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}
            >
              Add to calendar
            </DirectionsLink>
          </div>
        </div>
      </Reveal>

      {/* ── The programme, as end credits ───────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-14 text-center">
          <h2 className="italic" style={{ fontFamily: serif, fontSize: 32, fontWeight: 400 }}>In order of appearance</h2>
          <ol className="mt-9 space-y-6">
            {schedule.map((item, i) =>
              item.time ? (
                <li key={`${item.title}-${i}`} className="grid grid-cols-2 items-baseline gap-x-5">
                  <span className="text-right uppercase tabular-nums" style={{ fontSize: 15, letterSpacing: '0.14em', color: C.amber, fontWeight: 300 }}>
                    {item.time}
                  </span>
                  <span className="text-left uppercase leading-[1.3]" style={{ fontSize: 17, letterSpacing: '0.12em' }}>
                    {item.title}
                    {item.note && (
                      <span className="mt-1 block normal-case italic" style={{ fontFamily: serif, fontSize: 15, letterSpacing: 0, color: C.soft }}>
                        {item.note}
                      </span>
                    )}
                  </span>
                </li>
              ) : (
                <li key={`${item.title}-${i}`} className="uppercase" style={{ fontSize: 17, letterSpacing: '0.12em' }}>
                  {item.title}
                  {item.note && (
                    <span className="mt-1 block normal-case italic" style={{ fontFamily: serif, fontSize: 15, letterSpacing: 0, color: C.soft }}>
                      {item.note}
                    </span>
                  )}
                </li>
              ),
            )}
          </ol>
        </Reveal>
      )}

      {/* ── Stills, on a strip of film ──────────────────────────── */}
      {stills.length > 0 && (
        <section className="py-14">
          <Reveal disabled={isPreview}>
            <h2 className="text-center italic" style={{ fontFamily: serif, fontSize: 32, fontWeight: 400 }}>Stills</h2>
          </Reveal>
          <Reveal disabled={isPreview} className="mx-auto mt-8 max-w-[26rem] px-4">
            <div
              className="relative px-[30px] py-[10px]"
              style={{
                background: `${SPROCKETS} left 4px top 0 / 14px 22px repeat-y, ${SPROCKETS} right 4px top 0 / 14px 22px repeat-y, ${C.film}`,
              }}
            >
              <div className="space-y-[10px]">
                {stills.map((src, i) => (
                  <figure key={`${src}-${i}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="block aspect-[4/3] w-full object-cover" />
                    <span
                      aria-hidden
                      className="absolute -right-[27px] top-1 tabular-nums"
                      style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(224,164,88,0.7)', writingMode: 'vertical-rl' }}
                    >
                      {i + 1} ▸ {i + 1}A
                    </span>
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: C.rule }}>
          <WishesSection eventId={eventId} theme={WISHES_THEME} title="Wishes for the couple" />
        </div>
      )}

      {/* ── Closing card, letterboxed like the opening ──────────── */}
      <footer className="text-center">
        <div className="px-6 pb-14 pt-16">
          <span aria-hidden className="mx-auto block h-px w-10" style={{ background: C.amber }} />
          <p className="mt-6 italic leading-[1.1]" style={{ fontFamily: serif, fontSize: 30 }}>
            {bride} <span style={{ color: C.amber }}>&amp;</span> {groom}
          </p>
          {date && (
            <Caps className="mt-3 tabular-nums" style={{ letterSpacing: '0.3em' }}>
              {date.dayPadded} · {date.monthShort} · {date.year}
            </Caps>
          )}
        </div>
        <div className="py-5" style={{ background: C.bar }}>
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.soft} />
        </div>
      </footer>
    </div>
  )
}

function TicketLabel({ children }: { children: React.ReactNode }) {
  return (
    <dt className="uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', color: C.paperSoft }}>
      {children}
    </dt>
  )
}
