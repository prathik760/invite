'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { poiret } from './kit/fonts/poiret'
import { josefin } from './kit/fonts/josefin'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { ordinalWords, timeWords, yearWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * Royal Deco — a 1920s palace invitation.
 * Midnight navy, antique gold and cream stock; everything on the centre axis.
 * Stepped-corner frames, a sunburst fan that opens on arrival, arch windows
 * for photographs, and a short proclamation in the families' names.
 */

const R = {
  navy: '#0F1B2E',
  deep: '#0A1322',
  gold: '#C9A961',
  goldSoft: 'rgba(201,169,97,0.6)',
  line: 'rgba(201,169,97,0.34)',
  cream: '#F1E7D0',
  creamSoft: 'rgba(241,231,208,0.76)',
  creamFaint: 'rgba(241,231,208,0.5)',
  stock: '#F3EAD6',
  ink: '#18233A',
  inkSoft: 'rgba(24,35,58,0.7)',
  brass: '#9C7A3C',
  brassLine: 'rgba(156,122,60,0.45)',
}

const display = poiret.style.fontFamily
const sans = josefin.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: 'transparent',
  surface: 'rgba(241,231,208,0.05)',
  ink: R.cream,
  muted: R.creamSoft,
  line: R.line,
  accent: R.gold,
  onAccent: R.deep,
  heading: display,
  body: sans,
  headingStyle: { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 'clamp(23px, 7.6cqi, 30px)' },
}

/** Caps for Poiret: size from the longest word so long names step down. */
function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(3, ...names.map((s) => Math.max(...s.split(/\s+/).map((w) => w.length), s.length * 0.62)))
  return `clamp(${min}px, ${(span / (n * k)).toFixed(2)}cqi, ${max}px)`
}

/* ── Ornament ─────────────────────────────────────────────────────── */

/** One stepped corner, 30×30, drawn for the top-left; mirrored for the rest. */
function Corner({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 30" width={30} height={30} fill="none" stroke={color} strokeWidth={1} className="absolute" style={style} aria-hidden>
      <path d="M0.5 30V16.5h8v-8h8v-8H30" />
      <path d="M5.5 30V21.5h8v-8h8v-8H30" strokeOpacity={0.55} />
      <path d="M3 3h3v3H3z" fill={color} stroke="none" />
    </svg>
  )
}

/** A stepped-corner double frame that fills its (relative) parent. */
function DecoFrame({ color, inset = 0 }: { color: string; inset?: number }) {
  const edge = (s: CSSProperties) => <span className="absolute" style={{ background: color, ...s }} />
  return (
    <div aria-hidden className="pointer-events-none absolute" style={{ inset }}>
      {edge({ left: 30, right: 30, top: 0, height: 1 })}
      {edge({ left: 30, right: 30, bottom: 0, height: 1 })}
      {edge({ top: 30, bottom: 30, left: 0, width: 1 })}
      {edge({ top: 30, bottom: 30, right: 0, width: 1 })}
      <Corner color={color} style={{ left: 0, top: 0 }} />
      <Corner color={color} style={{ right: 0, top: 0, transform: 'scaleX(-1)' }} />
      <Corner color={color} style={{ left: 0, bottom: 0, transform: 'scaleY(-1)' }} />
      <Corner color={color} style={{ right: 0, bottom: 0, transform: 'scale(-1)' }} />
      <span className="absolute" style={{ inset: 5, border: `1px solid ${color}`, opacity: 0.35, clipPath: 'inset(20px 0 20px 0)' }} />
      <span className="absolute" style={{ inset: 5, border: `1px solid ${color}`, opacity: 0.35, clipPath: 'inset(0 20px 0 20px)' }} />
    </div>
  )
}

/** The sunburst fan: rays from a half-disc, alternating long and short. */
function Fan({ color, className, draw = false, rays = 19 }: { color: string; className?: string; draw?: boolean; rays?: number }) {
  const cx = 120, cy = 118
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = Math.PI + (i / (rays - 1)) * Math.PI
    const long = i % 2 === 0
    const r0 = 30, r1 = long ? 112 : 88
    return {
      d: `M${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy + r0 * Math.sin(a)).toFixed(1)}L${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}`,
      long,
      order: Math.abs(i - (rays - 1) / 2),
    }
  })
  return (
    <svg viewBox="0 0 240 122" className={className} fill="none" stroke={color} aria-hidden>
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          strokeWidth={l.long ? 1.1 : 0.8}
          strokeOpacity={l.long ? 1 : 0.7}
          pathLength={1}
          className={draw ? 'rd-ray' : undefined}
          style={draw ? { animationDelay: `${150 + l.order * 55}ms` } : undefined}
        />
      ))}
      <path d={`M${cx - 22} ${cy}A22 22 0 0 1 ${cx + 22} ${cy}`} strokeWidth={1.1} />
      <path d={`M${cx - 14} ${cy}A14 14 0 0 1 ${cx + 14} ${cy}Z`} fill={color} stroke="none" />
      <path d={`M${cx - 118} ${cy + 0.5}H${cx + 118}`} strokeWidth={1} />
    </svg>
  )
}

/** Geometric divider: stepped rules into a double diamond. */
function Divider({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 220 14" className={`mx-auto block w-[176px] ${className}`} fill="none" stroke={color} aria-hidden>
      <path d="M0 7h72M16 3.5h56M148 7h72M148 3.5h56M16 10.5h56M148 10.5h56" strokeWidth={0.9} />
      <path d="M110 1l6 6-6 6-6-6z" strokeWidth={1} />
      <path d="M110 4.5l2.5 2.5-2.5 2.5-2.5-2.5z" fill={color} stroke="none" />
      <path d="M86 7l4-4 4 4-4 4zM126 7l4-4 4 4-4 4z" strokeWidth={0.9} />
    </svg>
  )
}

/** A tall stepped medallion, the frame for the date and the monogram. */
function Medallion({ color, className, children }: { color: string; className?: string; children: ReactNode }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <svg viewBox="0 0 150 180" className="absolute inset-0 h-full w-full" fill="none" stroke={color} aria-hidden>
        <path d="M75 1 131 26v10h8v108h-8v10L75 179 19 154v-10h-8V36h8V26z" strokeWidth={1.1} />
        <path d="M75 9 124 31v10h7v98h-7v10L75 171 26 149v-10h-7V41h7V31z" strokeWidth={0.8} strokeOpacity={0.55} />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

function Caps({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.32em', color: R.gold, paddingLeft: '0.32em', ...style }}>
      {children}
    </p>
  )
}

/** Arch-topped window for a photograph, with an inner hairline. */
function Arch({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <div className={`relative p-[5px] ${className}`} style={{ border: `1px solid ${R.goldSoft}`, borderRadius: '999px 999px 0 0' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? undefined : 'lazy'}
        className="h-full w-full object-cover"
        style={{ borderRadius: '999px 999px 0 0' }}
      />
    </div>
  )
}

export default function RoyalDeco({ data, eventId, isPreview = false }: InviteProps) {
  const groom = data.groomName?.trim() || 'Arjun'
  const bride = data.brideName?.trim() || 'Ananya'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const story = useMemo(() => parseLines(data.coupleStory), [data.coupleStory])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`Wedding of ${groom} & ${bride}`, data.date, data.time, place)
  const venue = data.venue?.trim() || 'The venue'
  const isPhoto = (u?: string) => !!u && /^(https?:)?\//.test(u)

  const houses = [
    { name: groom, family: data.groomFamilyDetails?.trim(), photo: isPhoto(data.groomPhoto) ? data.groomPhoto : undefined },
    { name: bride, family: data.brideFamilyDetails?.trim(), photo: isPhoto(data.bridePhoto) ? data.bridePhoto : undefined },
  ]
  const portraits = houses.filter((h) => h.photo)
  const hasProclamation = houses.some((h) => h.family || h.photo)
  const spelledTime = timeWords(data.time)
  const nameFont = fit([groom, bride], 70, 0.8, 26, 86)
  // Odd counts lead with one wide arch so the pairs below stay symmetrical.
  const lead = photos.length % 2 === 1 ? photos[0] : null
  const pairs = lead ? photos.slice(1) : photos

  return (
    <div
      className="rd relative overflow-x-hidden"
      style={{ background: R.navy, color: R.cream, fontFamily: sans, containerType: 'inline-size', ...grain(0.07) }}
    >
      <style>{`
        .rd .rd-ray { stroke-dasharray: 1; stroke-dashoffset: 1; animation: rd-draw .9s cubic-bezier(.3,.6,.2,1) forwards; }
        .rd .rd-in { opacity: 0; animation: rd-in 1.1s ease forwards; }
        .rd .rd-frame { opacity: 0; animation: rd-in 1.4s ease forwards 200ms; }
        @keyframes rd-draw { to { stroke-dashoffset: 0; } }
        @keyframes rd-in { to { opacity: 1; } }
        .rd .rd-solid, .rd .rd-fill { transition: background-color .2s ease; }
        .rd .rd-solid { background-color: ${R.ink}; }
        .rd .rd-solid:hover { background-color: #26365A; }
        .rd .rd-fill { background-color: ${R.stock}; }
        .rd a:hover > .rd-fill { background-color: #E9DDC2; }
        @media (prefers-reduced-motion: reduce) {
          .rd .rd-ray { animation: none; stroke-dashoffset: 0; }
          .rd .rd-in, .rd .rd-frame { animation: none; opacity: 1; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={R.cream} background="rgba(10,19,34,0.75)" border={R.line} />

      {/* ── The card ─────────────────────────────────────────────── */}
      <section className="flex p-3" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <div className="relative mx-auto flex w-full max-w-[34rem] flex-col items-center justify-center px-8 pb-12 pt-10 text-center">
          <div className="rd-frame absolute inset-0">
            <DecoFrame color={R.goldSoft} />
          </div>

          <Fan color={R.gold} draw className="w-[min(58cqi,230px)]" />

          <Caps className="rd-in mt-6 text-balance" style={{ animationDelay: '900ms' }}>Together with their families</Caps>

          <h1 className="mt-7 uppercase" style={{ fontFamily: display, fontWeight: 400, letterSpacing: '0.08em', lineHeight: 1.02, overflowWrap: 'break-word' }}>
            <span className="rd-in block" style={{ fontSize: nameFont, animationDelay: '1100ms', paddingLeft: '0.08em' }}>{groom}</span>
            <span className="rd-in my-3 block" style={{ animationDelay: '1300ms' }}>
              <span className="flex items-center justify-center gap-3">
                <span aria-hidden className="h-px w-10" style={{ background: R.goldSoft }} />
                <span style={{ fontSize: 'clamp(26px, 8cqi, 38px)', color: R.gold, lineHeight: 1 }}>&amp;</span>
                <span aria-hidden className="h-px w-10" style={{ background: R.goldSoft }} />
              </span>
            </span>
            <span className="rd-in block" style={{ fontSize: nameFont, animationDelay: '1450ms', paddingLeft: '0.08em' }}>{bride}</span>
          </h1>

          <p className="rd-in mx-auto mt-7 max-w-[18rem] leading-[1.55]" style={{ fontSize: 16, fontWeight: 300, color: R.creamSoft, animationDelay: '1650ms' }}>
            request the honour of your presence at the celebration of their marriage
          </p>

          <div className="rd-in mt-8 flex flex-col items-center" style={{ animationDelay: '1850ms' }}>
            {date ? (
              <Medallion color={R.gold} className="h-[150px] w-[125px]">
                <span className="uppercase" style={{ fontSize: 12, letterSpacing: '0.24em', paddingLeft: '0.24em', color: R.gold }}>{date.monthShort}</span>
                <span className="my-1 leading-none" style={{ fontFamily: display, fontSize: 58 }}>{date.day}</span>
                <span className="uppercase" style={{ fontSize: 12, letterSpacing: '0.24em', paddingLeft: '0.24em', color: R.gold }}>{date.year}</span>
              </Medallion>
            ) : (
              <p className="uppercase" style={{ fontFamily: display, fontSize: 24, letterSpacing: '0.08em' }}>Date to be announced</p>
            )}
            <p className="mt-5 uppercase" style={{ fontSize: 15, letterSpacing: '0.2em', paddingLeft: '0.2em' }}>
              {[date?.weekday, time].filter(Boolean).join('  ·  ')}
            </p>
            <p className="mt-2 text-balance uppercase leading-[1.5]" style={{ fontSize: 15, letterSpacing: '0.2em', paddingLeft: '0.2em', color: R.gold }}>
              {venue}
            </p>
          </div>
        </div>
      </section>

      {/* ── The proclamation ─────────────────────────────────────── */}
      {hasProclamation && (
        <Reveal disabled={isPreview} as="section" className="px-3 py-10">
          <div className="relative mx-auto max-w-[34rem] px-8 py-12 text-center" style={{ background: R.stock, color: R.ink, ...grain(0.05) }}>
            <DecoFrame color={R.brassLine} inset={8} />
            <Caps style={{ color: R.brass }}>Be it known</Caps>

            {portraits.length > 0 && (
              <div className={`mx-auto mt-7 grid gap-4 ${portraits.length === 2 ? 'max-w-[18rem] grid-cols-2' : 'max-w-[9rem] grid-cols-1'}`}>
                {portraits.map((h) => (
                  <Arch key={h.name} src={h.photo as string} alt={h.name} className="aspect-[3/4]" />
                ))}
              </div>
            )}

            <p className="mt-6 italic" style={{ fontSize: 17, fontWeight: 300, color: R.inkSoft }}>that the marriage of</p>
            {houses.map((h, i) => (
              <div key={h.name}>
                {i === 1 && (
                  <p className="my-4" style={{ fontFamily: display, fontSize: 28, color: R.brass }}>&amp;</p>
                )}
                <p className={`${i === 0 ? 'mt-4' : ''} uppercase leading-[1.1]`} style={{ fontFamily: display, fontSize: fit([h.name], 72, 0.8, 22, 38), letterSpacing: '0.08em' }}>
                  {h.name}
                </p>
                {h.family && (
                  <p className="mx-auto mt-2 max-w-[20rem] leading-[1.5]" style={{ fontSize: 15, color: R.inkSoft }}>
                    {h.family}
                  </p>
                )}
              </div>
            ))}
            <p className="mx-auto mt-7 max-w-[20rem] italic leading-[1.6]" style={{ fontSize: 17, fontWeight: 300, color: R.inkSoft }}>
              {date
                ? `shall be solemnised on the ${ordinalWords(date.day)} of ${date.month}, ${yearWords(date.year)}${spelledTime ? `, at ${spelledTime}` : ''}.`
                : 'shall be solemnised on a date to be announced.'}
            </p>
            <Divider color={R.brass} className="mt-8" />
          </div>
        </Reveal>
      )}

      {/* ── A note from the couple ─────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-8 py-14 text-center">
          <Divider color={R.gold} />
          <p className="mt-7 italic leading-[1.55]" style={{ fontSize: 'clamp(18px, 5.2cqi, 21px)', fontWeight: 300 }}>
            {data.message}
          </p>
          <Divider color={R.gold} className="mt-7" />
        </Reveal>
      )}

      {/* ── Our story, in an arched window ─────────────────────── */}
      {story.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="px-5 py-8">
          <div className="relative mx-auto max-w-[26rem] px-8 pb-12 pt-[min(20cqi,86px)] text-center" style={{ border: `1px solid ${R.goldSoft}`, borderRadius: '999px 999px 0 0' }}>
            <span aria-hidden className="pointer-events-none absolute inset-[6px]" style={{ border: `1px solid ${R.line}`, borderRadius: '999px 999px 0 0' }} />
            <Fan color={R.gold} rays={13} className="mx-auto w-[112px]" />
            <h2 className="mt-5 uppercase" style={{ fontFamily: display, fontSize: 30, letterSpacing: '0.1em', paddingLeft: '0.1em' }}>Our story</h2>
            <div className="mt-5 space-y-4">
              {story.map((p, i) => (
                <p key={i} className="leading-[1.65]" style={{ fontSize: 17, fontWeight: 300, color: R.creamSoft }}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ── Countdown ─────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="px-6 py-14 text-center">
          <div className="flex items-center justify-center gap-5">
            <span aria-hidden className="h-[7px] w-12 border-y" style={{ borderColor: R.goldSoft }} />
            <span className="leading-none" style={{ fontFamily: display, fontSize: 76 }}>{countdown.days}</span>
            <span aria-hidden className="h-[7px] w-12 border-y" style={{ borderColor: R.goldSoft }} />
          </div>
          <Caps className="mt-3">{countdown.days === 1 ? 'day' : 'days'} to the wedding</Caps>
          <p className="mt-4 tabular-nums" style={{ fontSize: 15, letterSpacing: '0.08em', color: R.creamSoft }}>
            {countdown.hours} hrs · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
          </p>
        </Reveal>
      )}

      {/* ── The programme ─────────────────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-12 text-center">
          <h2 className="uppercase" style={{ fontFamily: display, fontSize: 'clamp(25px, 8.2cqi, 32px)', letterSpacing: '0.1em', paddingLeft: '0.1em' }}>The programme</h2>
          <Divider color={R.gold} className="mt-4" />
          <ol className="mt-8">
            {schedule.map((item, i) => (
              <li key={`${item.title}-${i}`}>
                {i > 0 && (
                  <svg viewBox="0 0 10 10" className="mx-auto my-5 block h-2 w-2" aria-hidden>
                    <path d="M5 0l5 5-5 5-5-5z" fill={R.goldSoft} />
                  </svg>
                )}
                {item.time && (
                  <p className="leading-none" style={{ fontFamily: display, fontSize: 24, color: R.gold }}>{item.time}</p>
                )}
                <p className="mt-2 uppercase leading-[1.4]" style={{ fontSize: 16, letterSpacing: '0.16em', paddingLeft: '0.16em' }}>{item.title}</p>
                {item.note && <p className="mt-1 italic" style={{ fontSize: 15, fontWeight: 300, color: R.creamSoft }}>{item.note}</p>}
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Venue ─────────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="px-3 py-10">
        <div className="relative mx-auto max-w-[34rem] px-8 py-12 text-center" style={{ background: R.stock, color: R.ink, ...grain(0.05) }}>
          <DecoFrame color={R.brassLine} inset={8} />
          <Caps style={{ color: R.brass }}>Kindly join us at</Caps>
          <h2 className="mt-5 text-balance uppercase leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 36px)', letterSpacing: '0.06em' }}>
            {venue}
          </h2>
          {data.venueAddress && (
            <p className="mx-auto mt-3 max-w-[20rem] leading-[1.55]" style={{ fontSize: 15, color: R.inkSoft }}>{data.venueAddress}</p>
          )}
          <p className="mt-5 uppercase leading-[1.6]" style={{ fontSize: 15, letterSpacing: '0.14em' }}>
            {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
            {time && <><br />{time}</>}
          </p>
          {data.dressCode && (
            <p className="mt-5 italic" style={{ fontSize: 16, color: R.inkSoft }}>
              Dress · {data.dressCode}
            </p>
          )}
          <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-2.5">
            <DirectionsLink
              href={directions}
              isPreview={isPreview}
              className="rd-solid flex min-h-[50px] items-center justify-center uppercase"
              style={{ color: R.cream, fontSize: 14, letterSpacing: '0.2em', clipPath: CHAMFER }}
            >
              Directions
            </DirectionsLink>
            <DirectionsLink
              href={calendar}
              isPreview={isPreview}
              className="relative flex min-h-[50px] items-center justify-center uppercase"
              style={{ background: R.ink, color: R.ink, fontSize: 14, letterSpacing: '0.2em', clipPath: CHAMFER }}
            >
              {/* Outline drawn as two chamfered layers so the cut corners keep their edge. */}
              <span aria-hidden className="rd-fill absolute inset-px" style={{ clipPath: CHAMFER_IN }} />
              <span className="relative">Add to calendar</span>
            </DirectionsLink>
          </div>
        </div>
      </Reveal>

      {/* ── The album ─────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 py-12">
          <Reveal disabled={isPreview}>
            <h2 className="text-center uppercase" style={{ fontFamily: display, fontSize: 32, letterSpacing: '0.1em', paddingLeft: '0.1em' }}>The album</h2>
            <Divider color={R.gold} className="mt-4" />
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3">
            {lead && (
              <Reveal disabled={isPreview} className="col-span-2 mx-auto w-[78%]">
                <Arch src={lead} alt="" className="aspect-[4/5]" />
              </Reveal>
            )}
            {pairs.map((src, i) => (
              <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90}>
                <Arch src={src} alt="" className="aspect-[3/4]" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: R.line }}>
          <WishesSection eventId={eventId} theme={WISHES_THEME} />
        </div>
      )}

      {/* ── Monogram ─────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: R.deep }}>
        <Fan color={R.goldSoft} rays={13} className="mx-auto -mb-px w-[118px]" />
        <Medallion color={R.gold} className="mx-auto mt-2 h-[112px] w-[94px]">
          <span className="uppercase" style={{ fontFamily: display, fontSize: 30, letterSpacing: '0.04em' }}>
            {groom.charAt(0)}
            <span className="mx-1" style={{ fontSize: 18, color: R.gold }}>&amp;</span>
            {bride.charAt(0)}
          </span>
        </Medallion>
        {date && (
          <p className="mt-5 uppercase tabular-nums" style={{ fontSize: 12, letterSpacing: '0.34em', paddingLeft: '0.34em', color: R.creamFaint }}>
            {date.dayPadded} · {date.monthShort} · {date.year}
          </p>
        )}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={R.creamFaint} linkColor={R.creamSoft} />
        </div>
      </footer>
    </div>
  )
}

const chamfer = (c: number) =>
  `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`
const CHAMFER = chamfer(10)
const CHAMFER_IN = chamfer(9.6)
