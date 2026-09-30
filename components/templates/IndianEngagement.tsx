'use client'

import { useMemo } from 'react'
import WishesSection from './WishesSection'
import { italiana } from './kit/fonts/italiana'
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
 * Mangni — a modern engagement card. Blush stock, plum ink, rose-gold line.
 * An arched window holds the couple (or their initials); two interlocking
 * rings are drawn in fine line on arrival, and that is the only flourish.
 */

const C = {
  paper: '#F5E7E1',
  card: '#FBF3EF',
  plum: '#3D1B38',
  soft: 'rgba(61,27,56,0.74)',
  faint: 'rgba(61,27,56,0.52)',
  line: 'rgba(61,27,56,0.16)',
  rose: '#B0705F',
  roseLight: '#DDAE9F',
  blush: '#F5E7E1',
}

const display = italiana.style.fontFamily
const sans = jost.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.plum,
  muted: C.soft,
  line: C.line,
  accent: C.plum,
  onAccent: C.blush,
  heading: display,
  body: sans,
  headingStyle: { fontSize: 36, fontWeight: 400 },
}

/* ── Rings ──────────────────────────────────────────────────────────── */
const RA = { x: 47, y: 52 }
const RB = { x: 73, y: 52 }
const R_OUT = 25
const R_IN = 21.6
const R_MID = (R_OUT + R_IN) / 2

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(2)} ${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(2)}`
  return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`
}

/** Angle, from ring A's centre, of the upper point where the two bands cross. */
const HALF = (RB.x - RA.x) / 2
const LIFT = Math.sqrt(R_MID ** 2 - HALF ** 2)
const CROSS_A = (Math.atan2(-LIFT, HALF) * 180) / Math.PI
/** …and, from ring B's centre, of the lower crossing. */
const CROSS_B = (Math.atan2(LIFT, -HALF) * 180) / Math.PI

/**
 * Two bands, linked: A passes over B at the top crossing, B over A at the
 * bottom. The crossing is made by knocking B out under a short arc of A in
 * the backing colour. The solitaire sits on A.
 */
function Rings({ draw, backing, className }: { draw: boolean; backing: string; className?: string }) {
  const stroke = { fill: 'none', stroke: C.rose, strokeWidth: 1.3, strokeLinecap: 'round' as const }
  const d = (i: number) => (draw ? { className: 'ie-draw', style: { animationDelay: `${250 + i * 260}ms` } } : {})
  return (
    <svg viewBox="12 10 96 76" className={className} aria-hidden style={{ overflow: 'visible' }}>
      <circle cx={RA.x} cy={RA.y} r={R_OUT} pathLength={1} {...stroke} {...d(0)} />
      <circle cx={RA.x} cy={RA.y} r={R_IN} pathLength={1} {...stroke} strokeWidth={0.9} {...d(0.4)} />
      <circle cx={RB.x} cy={RB.y} r={R_OUT} pathLength={1} {...stroke} {...d(1.2)} transform={`rotate(180 ${RB.x} ${RB.y})`} />
      <circle cx={RB.x} cy={RB.y} r={R_IN} pathLength={1} {...stroke} strokeWidth={0.9} {...d(1.6)} transform={`rotate(180 ${RB.x} ${RB.y})`} />
      {/* A over B at the top */}
      <g className={draw ? 'ie-fade' : undefined} style={draw ? { animationDelay: '1500ms' } : undefined}>
        <path d={arc(RA.x, RA.y, R_MID, CROSS_A - 20, CROSS_A + 20)} fill="none" stroke={backing} strokeWidth={R_OUT - R_IN + 3.2} />
        <path d={arc(RA.x, RA.y, R_OUT, CROSS_A - 22, CROSS_A + 22)} {...stroke} />
        <path d={arc(RA.x, RA.y, R_IN, CROSS_A - 22, CROSS_A + 22)} {...stroke} strokeWidth={0.9} />
      </g>
      {/* B over A at the bottom */}
      <g className={draw ? 'ie-fade' : undefined} style={draw ? { animationDelay: '1500ms' } : undefined}>
        <path d={arc(RB.x, RB.y, R_MID, CROSS_B - 20, CROSS_B + 20)} fill="none" stroke={backing} strokeWidth={R_OUT - R_IN + 3.2} />
        <path d={arc(RB.x, RB.y, R_OUT, CROSS_B - 22, CROSS_B + 22)} {...stroke} />
        <path d={arc(RB.x, RB.y, R_IN, CROSS_B - 22, CROSS_B + 22)} {...stroke} strokeWidth={0.9} />
      </g>
      {/* the solitaire, set on ring A */}
      <g
        transform={`translate(${RA.x - 9} ${RA.y - R_OUT - 1.5}) rotate(-20)`}
        className={draw ? 'ie-fade' : undefined}
        style={draw ? { animationDelay: '1750ms' } : undefined}
      >
        <path d="M-2.6 1.4 L-1.2 -1 M2.6 1.4 L1.2 -1" stroke={C.rose} strokeWidth={0.9} fill="none" />
        <path d="M-6 -1 L-3.6 -5 L3.6 -5 L6 -1 L0 7Z" fill={backing} stroke={C.rose} strokeWidth={1} strokeLinejoin="round" />
        <path d="M-6 -1 H6 M-3.6 -5 L-1.8 -1 L0 -5 L1.8 -1 L3.6 -5 M-1.8 -1 L0 7 L1.8 -1" stroke={C.rose} strokeWidth={0.6} fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function Diamond({ size = 7, color = C.rose }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className="inline-block rotate-45"
      style={{ width: size, height: size, border: `1px solid ${color}` }}
    />
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(34px, 10cqi, 44px)', color: C.plum }}>
      {children}
    </h2>
  )
}

/** The arched window: photographs if the couple added them, their initials if not. */
function ArchWindow({ photos, initials }: { photos: { src: string; alt: string }[]; initials: [string, string] }) {
  return (
    <div className="relative mx-auto aspect-[5/6] w-[min(74cqi,300px)] overflow-hidden rounded-t-full" style={{ background: C.plum }}>
      {photos.length > 0 ? (
        <div className={`grid h-full ${photos.length > 1 ? 'grid-cols-2 gap-[3px]' : ''}`} style={{ background: C.blush }}>
          {photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.alt} src={p.src} alt={p.alt} className="h-full w-full object-cover" />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-6 text-center">
          <span className="leading-none" style={{ fontFamily: display, fontSize: 'clamp(76px, 25cqi, 110px)', color: C.blush }}>{initials[0]}</span>
          <span className="my-1 leading-none" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)', color: C.roseLight }}>&amp;</span>
          <span className="leading-none" style={{ fontFamily: display, fontSize: 'clamp(76px, 25cqi, 110px)', color: C.blush }}>{initials[1]}</span>
        </div>
      )}
      <span aria-hidden className="pointer-events-none absolute inset-[9px] rounded-t-full border" style={{ borderColor: photos.length ? 'rgba(245,231,225,0.7)' : 'rgba(221,174,159,0.55)' }} />
    </div>
  )
}

export default function IndianEngagement({ data, eventId, isPreview = false }: InviteProps) {
  const p1 = data.partner1Name?.trim() || 'Meera'
  const p2 = data.partner2Name?.trim() || 'Rohan'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`${p1} & ${p2} — Engagement`, data.date, data.time, place || undefined, 4)
  const portraits = [
    { src: data.partner1Photo, alt: p1 },
    { src: data.partner2Photo, alt: p2 },
  ].filter((p) => p.src && /^(https?:)?\//.test(p.src)) as { src: string; alt: string }[]
  const venue = data.venue?.trim() || 'The venue'

  return (
    <div
      className="ie relative overflow-x-hidden"
      style={{ background: C.paper, color: C.plum, fontFamily: sans, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .ie .ie-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ie-draw 1.5s cubic-bezier(.45,.05,.3,1) forwards; }
        .ie .ie-fade { opacity: 0; animation: ie-fade 600ms ease forwards; }
        .ie .ie-in { opacity: 0; transform: translateY(10px); animation: ie-in 1s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes ie-draw { to { stroke-dashoffset: 0; } }
        @keyframes ie-fade { to { opacity: 1; } }
        @keyframes ie-in { to { opacity: 1; transform: none; } }
        .ie .ie-btn { transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
        .ie .ie-btn-solid:hover { background: ${C.blush}; }
        .ie .ie-btn-line:hover { background: rgba(245,231,225,0.1); }
        @media (prefers-reduced-motion: reduce) {
          .ie .ie-draw, .ie .ie-fade, .ie .ie-in { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── The card ─────────────────────────────────────────────── */}
      <section
        className="mx-auto flex max-w-[32rem] flex-col items-center justify-center px-6 pb-14 pt-10 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh' }}
      >
        <p className="ie-in text-[12px] uppercase" style={{ letterSpacing: '0.3em', color: C.rose, animationDelay: '100ms' }}>
          Mangni <span className="mx-1.5" style={{ color: C.faint }}>·</span> Ring ceremony
        </p>

        <div className="ie-in relative mt-6 w-full" style={{ animationDelay: '150ms' }}>
          <ArchWindow photos={portraits} initials={[p1.charAt(0).toUpperCase(), p2.charAt(0).toUpperCase()]} />
          <div
            className="absolute left-1/2 top-full flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-[46%] items-center justify-center rounded-full"
            style={{ background: C.paper }}
          >
            <Rings draw={!isPreview} backing={C.paper} className="w-[82px]" />
          </div>
        </div>

        <p className="ie-in mt-[72px] text-[15px]" style={{ color: C.soft, animationDelay: '500ms' }}>
          Together with their families
        </p>

        <h1 className="mt-3" style={{ fontFamily: display, fontWeight: 400 }}>
          <span className="ie-in block leading-[1]" style={{ fontSize: 'clamp(46px, 15cqi, 72px)', animationDelay: '650ms' }}>{p1}</span>
          <span className="ie-in my-1 block leading-none" style={{ fontSize: 'clamp(26px, 8cqi, 36px)', color: C.rose, animationDelay: '750ms' }}>&amp;</span>
          <span className="ie-in block leading-[1]" style={{ fontSize: 'clamp(46px, 15cqi, 72px)', animationDelay: '850ms' }}>{p2}</span>
        </h1>

        <p className="ie-in mx-auto mt-5 max-w-[16rem] text-balance text-[17px] leading-[1.5]" style={{ color: C.soft, animationDelay: '1000ms' }}>
          invite you to celebrate their engagement
        </p>

        <div className="ie-in mt-8" style={{ animationDelay: '1150ms' }}>
          {date ? (
            <div className="flex items-center justify-center gap-4">
              <span className="leading-none tabular-nums" style={{ fontWeight: 300, fontSize: 'clamp(54px, 16cqi, 68px)', letterSpacing: '-0.02em' }}>{date.day}</span>
              <span aria-hidden className="h-[58px] w-px" style={{ background: C.rose }} />
              <span className="text-left leading-[1.45]">
                <span className="block text-[16px] uppercase" style={{ letterSpacing: '0.16em' }}>{date.month} {date.year}</span>
                <span className="block text-[16px]" style={{ color: C.soft }}>
                  {date.weekday}{time && <> · {time}</>}
                </span>
              </span>
            </div>
          ) : (
            <p className="text-[17px]" style={{ color: C.soft }}>
              Date to be announced{time && <> · {time}</>}
            </p>
          )}
        </div>

        <div className="ie-in mt-7" style={{ animationDelay: '1250ms' }}>
          <p className="text-[15px] font-medium uppercase" style={{ letterSpacing: '0.14em' }}>{venue}</p>
          {data.venueAddress && (
            <p className="mx-auto mt-1 max-w-[18rem] text-[15px] leading-[1.5]" style={{ color: C.soft }}>{data.venueAddress}</p>
          )}
        </div>

        {data.dressCode && (
          <p className="ie-in mt-5 text-[15px]" style={{ color: C.soft, animationDelay: '1350ms' }}>
            Dress code <span className="mx-1" style={{ color: C.rose }}>—</span> {data.dressCode}
          </p>
        )}
      </section>

      <div className="mx-auto max-w-[30rem] px-6">
        {/* ── Countdown ───────────────────────────────────────────── */}
        {countdown && (
          <section className="border-y py-9 text-center" style={{ borderColor: C.line }}>
            <p className="text-[12px] uppercase" style={{ letterSpacing: '0.3em', color: C.rose }}>Counting the days</p>
            <div className="mt-4 flex items-start justify-center">
              {[
                { v: String(countdown.days), l: countdown.days === 1 ? 'day' : 'days' },
                { v: pad2(countdown.hours), l: 'hours' },
                { v: pad2(countdown.minutes), l: 'minutes' },
              ].map((u, i) => (
                <div key={u.l} className="flex items-start">
                  {i > 0 && <span aria-hidden className="mx-5 mt-5"><Diamond size={6} /></span>}
                  <div className="min-w-[3.2rem]">
                    <p className="leading-none tabular-nums" style={{ fontWeight: 300, fontSize: 'clamp(40px, 11.5cqi, 50px)' }}>{u.v}</p>
                    <p className="mt-2 text-[14px]" style={{ color: C.soft }}>{u.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── A note from the couple ─────────────────────────────── */}
        {data.message && (
          <Reveal disabled={isPreview} as="section" className="pt-16 text-center">
            <Diamond size={8} />
            <p className="mx-auto mt-5 max-w-[23rem] text-balance leading-[1.4]" style={{ fontFamily: display, fontSize: 'clamp(24px, 7cqi, 28px)' }}>
              {data.message}
            </p>
            <p className="mt-4 text-[15px]" style={{ color: C.soft }}>{p1} &amp; {p2}</p>
          </Reveal>
        )}

        {/* ── The evening ───────────────────────────────────────── */}
        {schedule.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="pt-16 text-center">
            <Heading>The evening</Heading>
            <ol className="mt-7">
              {schedule.map((item, i) => (
                <li key={`${item.title}-${i}`} className="flex flex-col items-center">
                  {i > 0 && <span aria-hidden className="my-5 block h-7 w-px" style={{ background: C.roseLight }} />}
                  {item.time && (
                    <span className="text-[15px] font-medium uppercase tabular-nums" style={{ letterSpacing: '0.14em', color: C.rose }}>{item.time}</span>
                  )}
                  <span className="mt-1 leading-[1.15]" style={{ fontFamily: display, fontSize: 28 }}>{item.title}</span>
                  {item.note && <span className="mt-1 text-[15px]" style={{ color: C.soft }}>{item.note}</span>}
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>

      {/* ── Photographs ───────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 pt-16">
          <Reveal disabled={isPreview}>
            <Heading>Moments</Heading>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = i === 0 || (photos.length % 2 === 0 && i === photos.length - 1)
              return (
                <Reveal
                  key={`${src}-${i}`}
                  disabled={isPreview}
                  delay={(i % 2) * 90}
                  className={wide ? 'col-span-2' : i % 2 === 0 ? 'mt-10' : ''}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className={`w-full object-cover ${wide ? 'aspect-[4/5]' : 'aspect-[3/4]'} ${i % 3 === 0 ? 'rounded-t-full' : ''}`}
                  />
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Venue, on plum ────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mt-16 px-6 py-16 text-center" style={{ background: C.plum, color: C.blush }}>
        <div className="mx-auto max-w-[28rem]">
          <p className="text-[12px] uppercase" style={{ letterSpacing: '0.3em', color: C.roseLight }}>The venue</p>
          <p className="mt-4 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(34px, 10.5cqi, 46px)' }}>{venue}</p>
          {data.venueAddress && (
            <p className="mx-auto mt-3 max-w-[20rem] text-[16px] leading-[1.55]" style={{ color: 'rgba(245,231,225,0.78)' }}>{data.venueAddress}</p>
          )}
          <p className="mt-4 text-[16px]" style={{ color: 'rgba(245,231,225,0.9)' }}>
            {date ? date.long : 'Date to be announced'}
            {time && <> · {time}</>}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className="ie-btn ie-btn-solid inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
              style={{ background: C.roseLight, color: C.plum }}
            >
              Directions
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </DirectionsLink>
            <DirectionsLink
              href={calendar}
              isPreview={isPreview}
              className="ie-btn ie-btn-line inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-medium"
              style={{ borderColor: 'rgba(245,231,225,0.5)', color: C.blush }}
            >
              Add to calendar
            </DirectionsLink>
          </div>
        </div>
      </Reveal>

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title="Wishes for the couple"
          intro={`Leave a few words for ${p1} and ${p2}. Your wish appears here for every guest.`}
        />
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-12 text-center">
        <Rings draw={false} backing={C.paper} className="mx-auto w-[54px]" />
        <p className="mt-4 leading-none" style={{ fontFamily: display, fontSize: 30 }}>
          {p1} <span style={{ color: C.rose }}>&amp;</span> {p2}
        </p>
        {date && (
          <p className="mt-3 text-[13px] uppercase tabular-nums" style={{ letterSpacing: '0.24em', color: C.faint }}>
            {pad2(date.day)} · {date.monthShort} · {date.year}
          </p>
        )}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.faint} linkColor={C.soft} />
        </div>
      </footer>
    </div>
  )
}
