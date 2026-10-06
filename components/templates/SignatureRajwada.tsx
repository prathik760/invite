'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { rozha } from './kit/fonts/rozha'
import { tiro } from './kit/fonts/tiro'
import { gilda } from './kit/fonts/gilda'
import { mukta } from './kit/fonts/mukta'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  parseRows,
  telHref,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
} from './kit/core'
import { Credit, MusicToggle, Reveal } from './kit/ui'
import { numberWords, ordinalWords } from './kit/words'
import type { InviteTheme } from './kit/theme'
import {
  Balustrade,
  Boss,
  CROWN,
  CourtyardCrown,
  DoorFrame,
  DoorLeaf,
  FRAME,
  LakeView,
  LotusMark,
  Motif,
  R,
  WindowArch,
  kanguraEdge,
  motifFor,
} from './rajwada/art'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './rajwada/parts'

/*
 * Rajwada — a palace wedding in Udaipur.
 * The guest arrives at a pair of carved palace doors in a sandstone wall:
 * lacquered maroon leaves, brass studs and strap hinges, a peacock fanned in
 * each arch, the couple's monogram split across the boss where they meet.
 * A tap lifts the ring knocker, the doors swing inward in 3D and we walk
 * through into a marble courtyard: a cusped arch hung with marigold swags and
 * lanterns, framing the Lake Palace at dusk. The invitation begins there —
 * the invocation, the names, both families, every function in its own
 * arched niche, the story, and everything a travelling guest needs.
 */

const display = `${gilda.style.fontFamily}, ${tiro.style.fontFamily}, Georgia, serif`
const deva = `${rozha.style.fontFamily}, ${tiro.style.fontFamily}, serif`
const shloka = `${tiro.style.fontFamily}, serif`
const text = `${mukta.style.fontFamily}, system-ui, sans-serif`

const WISHES_THEME: InviteTheme = {
  bg: R.marble,
  surface: R.card,
  ink: R.ink,
  muted: R.soft,
  line: R.rule,
  accent: R.maroon,
  onAccent: R.onMaroon,
  heading: display,
  body: text,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 38px)', color: R.maroon },
}

/** Size a display line from its longest word, so long names step down instead of overflowing. */
function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(4, ...names.flatMap((s) => s.split(/\s+/).map((w) => w.length)))
  return `clamp(${min}px, ${(span / (n * k)).toFixed(2)}cqi, ${max}px)`
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const first = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''

function Heading({ children, sub, light, id }: { children: ReactNode; sub?: ReactNode; light?: boolean; id?: string }) {
  return (
    <div className="text-center">
      <LotusMark color={light ? R.goldLight : R.gold} className="mx-auto block w-[112px]" />
      <h2 id={id} className="mt-3 text-balance leading-[1.08]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 40px)', color: light ? R.onMaroon : R.maroon }}>
        {children}
      </h2>
      {sub && (
        <p className="mx-auto mt-3 max-w-[22rem] text-balance leading-[1.5]" style={{ fontFamily: text, fontSize: 16, color: light ? R.onMaroonSoft : R.soft }}>
          {sub}
        </p>
      )}
    </div>
  )
}

const btn = 'rw-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-medium'

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

function FunctionCard({
  fn,
  day,
  couple,
  data,
  mainDirections,
  isPreview,
}: {
  fn: Fn
  day?: string
  couple: string
  data: Record<string, string>
  mainDirections: string | null
  isPreview: boolean
}) {
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const venue = fn.venue || data.venue || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const cal = calendarHref(`${fn.name} · ${couple}`, fn.date, fn.time, place || undefined, 3)
  const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : mainDirections
  return (
    <article className="relative" style={{ background: R.card, boxShadow: '0 18px 34px -30px rgba(74,15,19,0.7)' }}>
      <div className="relative" style={{ background: '#F4E6CF' }}>
        <WindowArch bg={R.marble} className="block w-full" />
        <Motif kind={motifFor(fn.name)} className="absolute left-1/2 top-[22%] w-[26%] -translate-x-1/2" />
      </div>
      <div className="relative border-x border-b px-6 pb-7 pt-5 text-center" style={{ borderColor: R.rule }}>
        <span aria-hidden className="pointer-events-none absolute inset-x-[6px] bottom-[6px] top-0 border-x border-b" style={{ borderColor: R.hair }} />
        {day && (
          <p className="relative text-[13px] uppercase" style={{ fontFamily: text, letterSpacing: '0.2em', color: R.gold }}>
            {day}
          </p>
        )}
        <h3 className="relative mt-1 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 34px)', color: R.maroon }}>
          {fn.name}
        </h3>
        <p className="relative mt-2 leading-[1.4]" style={{ fontFamily: text, fontSize: 17, color: R.ink }}>
          {d ? `${d.weekday}, ${d.day} ${d.month}` : 'Date to follow'}
          {t && (
            <>
              <span aria-hidden style={{ color: R.gold }}> · </span>
              <span className="whitespace-nowrap font-semibold">{t}</span>
            </>
          )}
        </p>
        {venue && (
          <p className="relative mt-1 leading-[1.35]" style={{ fontFamily: display, fontSize: 19, color: R.ink }}>
            {venue}
          </p>
        )}
        {fn.dress && (
          <p className="relative mx-auto mt-3 max-w-[20rem] leading-[1.45]" style={{ fontFamily: text, fontSize: 15, color: R.soft }}>
            <span style={{ color: R.gold }}>Dress · </span>
            {fn.dress}
          </p>
        )}
        {(cal || dir) && (
          <div className="relative mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Act href={cal} isPreview={isPreview} className="rw-link inline-flex items-center gap-1.5 py-1 text-[15px] font-medium" style={{ fontFamily: text, color: R.maroon }}>
              {Icon.calendar}
              Add to calendar
            </Act>
            <Act href={dir} isPreview={isPreview} className="rw-link inline-flex items-center gap-1.5 py-1 text-[15px] font-medium" style={{ fontFamily: text, color: R.maroon }}>
              {Icon.pin}
              Directions
            </Act>
          </div>
        )}
      </div>
    </article>
  )
}

/** The countdown lives in its own component so only it re-renders every second. */
function Countdown({ date, time, enabled }: { date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  return (
    <section className="relative mt-16 text-center" style={{ background: R.maroon, color: R.onMaroon }}>
      <div aria-hidden className="absolute inset-x-0 -top-[15px] h-4" style={kanguraEdge(R.maroon)} />
      <div className="mx-auto max-w-[30rem] px-6 py-12" style={grain(0.08)}>
        <p className="leading-none" style={{ fontFamily: deva, fontSize: 'clamp(76px, 26cqi, 110px)', color: R.goldLight }}>
          {c.days}
        </p>
        <p className="mt-1" style={{ fontFamily: display, fontSize: 26 }}>
          {c.days === 1 ? 'day' : 'days'} to go
        </p>
        <p className="mt-3 tabular-nums" style={{ fontFamily: text, fontSize: 15, color: R.onMaroonSoft, letterSpacing: '0.04em' }}>
          {c.hours} hours · {pad2(c.minutes)} minutes · {pad2(c.seconds)} seconds
        </p>
      </div>
      <div aria-hidden className="absolute inset-x-0 -bottom-[15px] h-4 rotate-180" style={kanguraEdge(R.maroon)} />
    </section>
  )
}

type Phase = 'sealed' | 'knock' | 'open' | 'through' | 'done'

export default function SignatureRajwada({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Aditi'
  const groom = data.groomName?.trim() || 'Kabir'
  const couple = `${bride} & ${groom}`
  const letters: [string, string] = [first(bride), first(groom)]
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const weddingCal = calendarHref(`Wedding of ${couple}`, data.date, data.time, place || undefined, 5)
  const invocation = useMemo(() => parseLines(data.invocation), [data.invocation])
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const story = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const photos = useMemo(() => galleryImages(data.galleryImages, 9), [data.galleryImages])
  const img = (u?: string) => (u && /^(https?:)?\//.test(u) ? u : '')
  const couplePhoto = img(data.couplePhoto)
  const portraits = { bride: img(data.bridePhoto), groom: img(data.groomPhoto) }
  const reply = whatsappHref(data.whatsappNumber, `Namaste! This is our reply to the invitation for ${couple}'s wedding: `)
  const rsvpBy = dateParts(data.rsvpBy)
  const hashtag = data.hashtag?.trim()
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null

  const functions = useMemo(() => {
    const list = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'] as const) as Fn[]
    const dated = list.length > 0 && list.every((f) => dateParts(f.date))
    if (dated) list.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    const days = dated ? Array.from(new Set(list.map((f) => f.date))) : []
    return list.map((fn) => ({ fn, day: days.length > 1 ? `Day ${cap(numberWords(days.indexOf(fn.date) + 1))}` : undefined }))
  }, [data.events])

  const hasFamilies = Boolean(data.brideParents?.trim() || data.groomParents?.trim() || blessings.length || data.message?.trim() || couplePhoto || portraits.bride || portraits.groom)
  const hasGuests = contacts.length > 0 || faq.length > 0

  const nav: NavItem[] = [
    functions.length ? { id: 'rw-functions', label: 'Functions' } : null,
    story.length ? { id: 'rw-story', label: 'Our story' } : null,
    photos.length ? { id: 'rw-photos', label: 'Photos' } : null,
    { id: 'rw-venue', label: 'Venue' },
    hasGuests ? { id: 'rw-guests', label: 'Guests' } : null,
    { id: 'rw-rsvp', label: 'RSVP' },
    eventId ? { id: 'rw-wishes', label: 'Blessings' } : null,
  ].filter(Boolean) as NavItem[]

  /* The doors: sealed → knock (ring lifts) → open (leaves swing in) → through (we walk in) → done. */
  const [phase, setPhase] = useState<Phase>('sealed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const openDoors = useCallback(() => {
    if (phase !== 'sealed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('knock')
    const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), ms))
    at(420, 'open')
    at(1900, 'through')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done')
        if (!isPreview) window.scrollTo(0, 0)
      }, 2950),
    )
  }, [phase, isPreview])

  const lb = useLightbox(photos.length)
  // 0.6: Gilda's widest letters; a low floor so a long surname fits a narrow phone.
  const nameSize = fit([bride, groom], 64, 0.6, 20, 70)
  const music = Boolean(data.musicUrl && /^https?:\/\//i.test(data.musicUrl))
  const u = (n: number) => `${((n / CROWN.span) * 100).toFixed(3)}cqi`

  return (
    <div
      className="rw relative"
      data-ph={phase}
      style={{
        background: R.marble,
        color: R.ink,
        fontFamily: text,
        containerType: 'inline-size',
        overflowX: 'clip',
        ['--rw-display' as string]: display,
      }}
    >
      <style>{`
        .rw .rw-leaf { transition: transform 1.85s cubic-bezier(.6,.02,.28,1); will-change: transform; transform-style: preserve-3d; }
        .rw .rw-stage.is-open .rw-leaf-l { transform: rotateY(84deg); }
        .rw .rw-stage.is-open .rw-leaf-r { transform: rotateY(-84deg); }
        .rw .rw-shade { opacity: 0; transition: opacity 1.5s ease .25s; }
        .rw .rw-stage.is-open .rw-shade { opacity: .7; }
        .rw .rw-ring { transform-box: fill-box; transform-origin: 50% 0; }
        .rw .rw-stage.is-knock .rw-ring { animation: rw-knock .42s cubic-bezier(.3,.6,.3,1); }
        .rw .rw-stage.is-knock .rw-doors { animation: rw-thud .42s ease; }
        .rw .rw-frame { transform-origin: 50% 56%; transition: transform 1.05s cubic-bezier(.55,0,.75,.3), opacity .7s ease .3s; }
        .rw .rw-stage.is-through .rw-frame { transform: scale(2.8); opacity: 0; }
        .rw .rw-fade { transition: opacity .45s ease; }
        .rw .rw-stage.is-open .rw-fade { opacity: 0; }
        .rw .rw-stage { transition: opacity .3s ease .8s; }
        .rw .rw-stage.is-through { opacity: 0; }
        .rw .rw-scene { transition: transform 2.8s cubic-bezier(.2,.7,.2,1); }
        .rw[data-ph="sealed"] .rw-scene, .rw[data-ph="knock"] .rw-scene { transform: scale(1.1); }
        .rw .rw-rise { transition: opacity .9s ease var(--d, 0ms), transform 1.2s cubic-bezier(.2,.7,.2,1) var(--d, 0ms); }
        .rw[data-ph="sealed"] .rw-rise, .rw[data-ph="knock"] .rw-rise { opacity: 0; transform: translateY(14px); }
        .rw .rw-hint { animation: rw-breathe 2.6s ease-in-out infinite; }
        .rw .rw-link { text-decoration: underline; text-decoration-color: ${R.rule}; text-underline-offset: 5px; }
        .rw .rw-link:hover { text-decoration-color: currentColor; }
        .rw .rw-btn { transition: background-color .2s ease, color .2s ease; }
        .rw details > summary { list-style: none; cursor: pointer; }
        .rw details > summary::-webkit-details-marker { display: none; }
        .rw details .rw-plus { transition: transform .25s ease; }
        .rw details[open] .rw-plus { transform: rotate(45deg); }
        @keyframes rw-knock { 0% { transform: none } 40% { transform: scaleY(.5) } 70% { transform: scaleY(1.05) } 100% { transform: none } }
        @keyframes rw-thud { 0%, 55% { transform: none } 70% { transform: translateY(1px) } 100% { transform: none } }
        @keyframes rw-breathe { 0%, 100% { opacity: .75 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .rw .rw-leaf, .rw .rw-frame, .rw .rw-scene, .rw .rw-rise, .rw .rw-stage, .rw .rw-fade { transition: none; }
          .rw .rw-hint, .rw .rw-ring, .rw .rw-doors { animation: none; }
          .rw[data-ph] .rw-scene { transform: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={R.maroon} background="rgba(246,239,227,0.9)" border={R.rule} />

      {/* ── The courtyard: the hero, behind the doors ─────────────────── */}
      <section id="rw-top" className="relative overflow-hidden" style={{ minHeight: isPreview ? 560 : '100svh', background: R.marble }}>
        <div className="rw-scene relative mx-auto flex min-h-[inherit] w-full flex-col px-[5cqi] pt-[5cqi]" style={{ minHeight: isPreview ? 560 : '100svh', ...grain(0.05) }}>
          <div
            className="relative mx-auto flex w-full max-w-[30rem] flex-1 flex-col"
            style={{ containerType: 'inline-size', background: 'linear-gradient(180deg, #F9F0E1 0%, #F6E7CF 55%, #F2DABA 100%)' }}
          >
            <CourtyardCrown className="pointer-events-none absolute top-0 z-[1]" style={{ left: u(CROWN.x), width: u(CROWN.w) }} />
            {/* the jambs continue the arch band down to the railing */}
            {[0, 1].map((i) => (
              <span
                key={i}
                aria-hidden
                className="absolute bottom-0 z-[2]"
                style={{
                  top: u(CROWN.spring - CROWN.y - 1),
                  [i ? 'right' : 'left']: u(-9.5),
                  width: u(19),
                  background: `linear-gradient(90deg, ${R.goldDark} 0 5.3%, ${R.maroon} 5.3% 42%, ${R.gold} 42% 58%, ${R.maroon} 58% 94.7%, ${R.goldDark} 94.7%)`,
                }}
              />
            ))}

            <div className="relative z-[3] flex flex-1 flex-col items-center px-[11cqi] text-center" style={{ paddingTop: u(112) }}>
              {invocation.length > 0 && (
                <div className="rw-rise" style={{ ['--d' as string]: '250ms' }}>
                  <p className="leading-[1.35]" style={{ fontFamily: deva, fontSize: 'clamp(19px, 5.6cqi, 23px)', color: R.vermilion }}>
                    {invocation[0]}
                  </p>
                  {invocation.slice(1).map((l, i) => (
                    <p key={i} className="mt-0.5 leading-[1.5]" style={{ fontFamily: shloka, fontSize: 'clamp(14px, 4cqi, 16px)', color: R.soft }}>
                      {l}
                    </p>
                  ))}
                </div>
              )}

              <h1 className="mt-[7cqi]" style={{ fontFamily: display, fontWeight: 400, color: R.maroon }}>
                <span className="rw-rise block text-balance leading-[1]" style={{ fontSize: nameSize, ['--d' as string]: '380ms' }}>
                  {bride}
                </span>
                <span className="rw-rise my-[2.5cqi] flex items-center justify-center gap-3" style={{ ['--d' as string]: '500ms' }}>
                  <span aria-hidden className="h-px w-[12cqi]" style={{ background: R.rule }} />
                  <span className="italic" style={{ fontFamily: shloka, fontSize: 'clamp(19px, 5.6cqi, 23px)', color: R.gold }}>
                    weds
                  </span>
                  <span aria-hidden className="h-px w-[12cqi]" style={{ background: R.rule }} />
                </span>
                <span className="rw-rise block text-balance leading-[1]" style={{ fontSize: nameSize, ['--d' as string]: '620ms' }}>
                  {groom}
                </span>
              </h1>

              <div className="rw-rise mt-[7cqi]" style={{ ['--d' as string]: '800ms' }}>
                {date ? (
                  <>
                    <p className="text-balance leading-[1.3]" style={{ fontFamily: display, fontSize: 'clamp(19px, 5.8cqi, 23px)', color: R.ink }}>
                      <span className="block">{date.weekday},</span>
                      the {ordinalWords(date.day)} of {date.month}
                    </p>
                    <p className="mt-1" style={{ fontFamily: text, fontSize: 17, fontWeight: 500, color: R.soft }}>
                      {date.year}
                      {time && ` · ${time}`}
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: display, fontSize: 21, color: R.ink }}>
                    Date to be announced{time && <span style={{ fontFamily: text, fontSize: 17, color: R.soft }}> · {time}</span>}
                  </p>
                )}
                {venue && (
                  <p className="mx-auto mt-4 max-w-[17rem] text-balance uppercase leading-[1.35]" style={{ fontFamily: display, fontSize: 16, letterSpacing: '0.14em', color: R.maroon }}>
                    {venue}
                  </p>
                )}
              </div>
              <div className="min-h-[6cqi] flex-1" />
            </div>

            <LakeView uid="rw-hero-lake" className="relative z-[1] block w-full" />
            <Balustrade uid="rw-hero-rail" className="relative z-[1] block h-[15cqi] w-full" />
          </div>
        </div>

        {/* ── The doors ────────────────────────────────────────────── */}
        {phase !== 'done' && (
          <div
            className={`rw-stage absolute inset-0 z-30 ${phase === 'knock' ? 'is-knock' : ''} ${phase === 'open' || phase === 'through' ? 'is-open' : ''} ${phase === 'through' ? 'is-through' : ''}`}
          >
            <div className="relative flex h-full min-h-[560px] flex-col items-center justify-center overflow-hidden px-3">
              {invocation[0] && (
                <p className="rw-fade relative z-[2] mb-[1.6svh] text-center" style={{ fontFamily: deva, fontSize: 17, color: R.sandShadow, textShadow: '0 1px 0 rgba(255,245,225,0.45)' }}>
                  {invocation[0]}
                </p>
              )}
              <div
                className="rw-frame relative z-[1]"
                style={{ width: `min(96cqi, calc((${isPreview ? '560px' : '100svh'} - ${invocation[0] ? 210 : 180}px) * ${(FRAME.w / FRAME.h).toFixed(4)}), 470px)`, aspectRatio: `${FRAME.w} / ${FRAME.h}` }}
              >
                <DoorFrame className="absolute inset-0 h-full w-full" />
                <div
                  className="rw-doors absolute"
                  style={{
                    left: `${(FRAME.x / FRAME.w) * 100}%`,
                    top: `${(FRAME.y / FRAME.h) * 100}%`,
                    width: `${(FRAME.dw / FRAME.w) * 100}%`,
                    height: `${(FRAME.dh / FRAME.h) * 100}%`,
                    perspective: 1100,
                  }}
                >
                  <div className="rw-leaf rw-leaf-l absolute left-0 top-0 h-full w-1/2" style={{ transformOrigin: '0 50%' }}>
                    <DoorLeaf side="l" letter={letters[0]} />
                  </div>
                  <div className="rw-leaf rw-leaf-r absolute right-0 top-0 h-full w-1/2" style={{ transformOrigin: '100% 50%' }}>
                    <DoorLeaf side="r" letter={letters[1]} />
                  </div>
                </div>
              </div>
              <div className="rw-fade relative z-[2] mt-[2.2svh] text-center">
                <p style={{ fontFamily: display, fontSize: 'clamp(24px, 7cqi, 30px)', color: R.maroonDeep }}>{couple}</p>
                {date && (
                  <p className="mt-0.5" style={{ fontFamily: text, fontSize: 15, letterSpacing: '0.08em', color: R.sandShadow }}>
                    {date.day} {date.month} {date.year}
                  </p>
                )}
                <p className="rw-hint mt-3 inline-flex items-center gap-2" style={{ fontFamily: text, fontSize: 15, fontWeight: 500, color: R.maroon }}>
                  Tap the doors to enter
                </p>
              </div>
              <button
                type="button"
                onClick={openDoors}
                disabled={phase !== 'sealed'}
                aria-label={`Open the doors to ${couple}'s wedding invitation`}
                className="absolute inset-0 z-[5] cursor-pointer disabled:cursor-default"
              />
            </div>
          </div>
        )}
      </section>

      {phase === 'done' && (
        <>
          <SectionNav
            items={nav}
            padRight={music && !isPreview ? 104 : 20}
            className="sticky top-0 z-30 border-b"
            style={{ background: 'rgba(246,239,227,0.97)', borderColor: R.rule }}
            linkStyle={{ fontFamily: display, fontSize: 16, color: R.soft }}
            activeColor={R.maroon}
            underline={R.gold}
          />

          {/* ── The invitation proper: families and blessings ──────── */}
          {hasFamilies && (
            <section id="rw-invite" className="mx-auto max-w-[32rem] px-6 pt-14 text-center" style={{ scrollMarginTop: 56 }}>
              {data.message?.trim() && (
                <Reveal disabled={isPreview}>
                  <LotusMark className="mx-auto block w-[112px]" />
                  <p className="mx-auto mt-5 max-w-[24rem] text-balance leading-[1.45]" style={{ fontFamily: display, fontSize: 'clamp(21px, 6.2cqi, 25px)', color: R.ink }}>
                    {data.message}
                  </p>
                </Reveal>
              )}

              {couplePhoto && (
                <Reveal disabled={isPreview} className="mx-auto mt-10 max-w-[24rem] border p-[7px]" style={{ borderColor: R.rule, background: R.card }}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={couplePhoto} alt={couple} loading="lazy" className="h-full w-full object-cover" />
                    <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />
                  </div>
                </Reveal>
              )}

              {(data.brideParents?.trim() || data.groomParents?.trim() || portraits.bride || portraits.groom) && (
                <Reveal disabled={isPreview} className="rw-fam mt-12 grid items-start gap-x-4 gap-y-10">
                  {[
                    { name: bride, parents: data.brideParents?.trim(), photo: portraits.bride, letter: letters[0] },
                    { name: groom, parents: data.groomParents?.trim(), photo: portraits.groom, letter: letters[1] },
                  ].map((p) => (
                    <div key={p.name} className="text-center">
                      <div className="relative mx-auto aspect-[3/4] w-[min(100%,150px)] overflow-hidden border p-[5px]" style={{ borderColor: R.rule, background: R.card }}>
                        <div className="relative h-full w-full overflow-hidden" style={{ background: R.teal }}>
                          {p.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center pt-[18%]" style={{ fontFamily: display, fontSize: 54, color: R.goldLight }}>
                              {p.letter}
                            </span>
                          )}
                          <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />
                        </div>
                      </div>
                      <p className="mt-4 leading-[1.1]" style={{ fontFamily: display, fontSize: 28, color: R.maroon }}>
                        {p.name}
                      </p>
                      {p.parents && (
                        <p className="mx-auto mt-2 max-w-[15rem] text-balance leading-[1.45]" style={{ fontFamily: text, fontSize: 15.5, color: R.soft }}>
                          {p.parents}
                        </p>
                      )}
                    </div>
                  ))}
                </Reveal>
              )}

              {blessings.length > 0 && (
                <Reveal disabled={isPreview} className="mx-auto mt-12 max-w-[24rem] border-t pt-8" style={{ borderColor: R.rule }}>
                  <p className="italic" style={{ fontFamily: shloka, fontSize: 19, color: R.gold }}>
                    With the blessings of
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {blessings.map((b, i) => (
                      <li key={`${b}-${i}`} className="text-balance leading-[1.35]" style={{ fontFamily: display, fontSize: 19, color: R.ink }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </section>
          )}

          <Countdown date={data.date} time={data.time} enabled={!isPreview} />

          {/* ── Every function, each in its own niche ─────────────────── */}
          {functions.length > 0 && (
            <section id="rw-functions" className="mx-auto max-w-[32rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading sub="We request the pleasure of your company at each of the celebrations">The Celebrations</Heading>
              </Reveal>
              <div className="rw-fns mt-9 grid gap-6">
                {functions.map(({ fn, day }, i) => (
                  <Reveal key={`${fn.name}-${i}`} disabled={isPreview} delay={(i % 2) * 70}>
                    <FunctionCard fn={fn} day={day} couple={couple} data={data} mainDirections={directions} isPreview={isPreview} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* ── Our story ─────────────────────────────────────────────── */}
          {story.length > 0 && (
            <section id="rw-story" className="mx-auto max-w-[32rem] px-6 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>Our Story</Heading>
              </Reveal>
              <ol className="relative mt-9">
                <span aria-hidden className="absolute bottom-3 left-[13px] top-3 w-px" style={{ background: R.rule }} />
                {story.map((s, i) => (
                  <Reveal as="li" key={`${s.title}-${i}`} disabled={isPreview} className="relative pb-9 pl-12 last:pb-0">
                    <svg viewBox="0 0 28 28" className="absolute left-0 top-1 h-7 w-7" aria-hidden>
                      <circle cx={14} cy={14} r={12} fill={R.marble} stroke={R.gold} strokeWidth={1} />
                      <path d="M14 6C17 9 18 12 14 18C10 12 11 9 14 6Z" fill={R.vermilion} />
                      <path d="M13 18C9 17.5 7 15 7 12C10 12.6 12.4 15 13 18ZM15 18C19 17.5 21 15 21 12C18 12.6 15.6 15 15 18Z" fill={R.gold} />
                    </svg>
                    {s.when && (
                      <p className="leading-none" style={{ fontFamily: deva, fontSize: 30, color: R.vermilion }}>
                        {s.when}
                      </p>
                    )}
                    <h3 className="mt-2 leading-[1.2]" style={{ fontFamily: display, fontSize: 23, color: R.maroon }}>
                      {s.title}
                    </h3>
                    {s.text && (
                      <p className="mt-1.5 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                        {s.text}
                      </p>
                    )}
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {/* ── Photographs ──────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section id="rw-photos" className="mx-auto max-w-[34rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>From Our Album</Heading>
              </Reveal>
              <div className="mt-9 grid grid-cols-2 gap-3">
                {photos.map((src, i) => {
                  const big = i === 0 || (i > 0 && i % 5 === 0)
                  return (
                    <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 70} className={big ? 'col-span-2' : ''}>
                      <button
                        type="button"
                        onClick={() => !isPreview && lb.setOpen(i)}
                        aria-label={`Open photo ${i + 1} of ${photos.length}`}
                        className="block w-full border p-[5px] text-left"
                        style={{ borderColor: R.rule, background: R.card, cursor: isPreview ? 'default' : 'zoom-in' }}
                      >
                        <span className={`relative block w-full overflow-hidden ${big ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                          {big && <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />}
                        </span>
                      </button>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── The venue, travel and stay ───────────────────────────── */}
          <section id="rw-venue" className="mx-auto max-w-[32rem] px-6 pt-16 text-center" style={{ scrollMarginTop: 56 }}>
            <Reveal disabled={isPreview}>
              <Heading>The Venue</Heading>
              <div className="relative mx-auto mt-8 max-w-[22rem] overflow-hidden border p-[6px]" style={{ borderColor: R.rule, background: R.card }}>
                <div className="relative" style={{ background: 'linear-gradient(180deg, #F9F0E1, #F2DABA)' }}>
                  <div className="pt-[24%]" />
                  <LakeView uid="rw-venue-lake" className="block w-full" />
                  <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />
                </div>
              </div>
              <h3 className="mx-auto mt-7 max-w-[22rem] text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 36px)', color: R.maroon }}>
                {venue || 'Venue to be announced'}
              </h3>
              {data.venueAddress && (
                <p className="mx-auto mt-2 max-w-[20rem] text-balance leading-[1.5]" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                  {data.venueAddress}
                </p>
              )}
              <p className="mt-3" style={{ fontFamily: text, fontSize: 16, fontWeight: 500, color: R.ink }}>
                {date ? date.long : 'Date to be announced'}
                {time && ` · ${time}`}
              </p>
              {data.dressCode?.trim() && (
                <p className="mx-auto mt-4 max-w-[20rem] text-balance leading-[1.45]" style={{ fontFamily: display, fontSize: 18, color: R.ink }}>
                  <span className="block text-[13px] uppercase" style={{ fontFamily: text, letterSpacing: '0.2em', color: R.gold }}>
                    Dress code
                  </span>
                  {data.dressCode}
                </p>
              )}
              <div className="mx-auto mt-7 flex max-w-[20rem] flex-col gap-3">
                <Act href={directions} isPreview={isPreview} className={`${btn} hover:bg-[#581317]`} style={{ background: R.maroon, color: R.onMaroon }}>
                  {Icon.pin}
                  Get directions
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.maroon, color: R.maroon }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
              </div>
            </Reveal>

            {travel.length > 0 && (
              <Reveal disabled={isPreview} className="relative mt-12 border px-6 py-8 text-left" style={{ borderColor: R.rule, background: R.card }}>
                <span aria-hidden className="pointer-events-none absolute inset-[5px] border" style={{ borderColor: R.hair }} />
                <h3 className="relative text-center" style={{ fontFamily: display, fontSize: 26, color: R.maroon }}>
                  Travel &amp; stay
                </h3>
                <div className="relative mt-4 space-y-3">
                  {travel.map((p, i) => (
                    <p key={i} className="leading-[1.65]" style={{ fontFamily: text, fontSize: 16, color: R.ink }}>
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}
          </section>

          {/* ── For our guests: people to call, questions ─────────────── */}
          {hasGuests && (
            <section id="rw-guests" className="mx-auto max-w-[32rem] px-6 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>For Our Guests</Heading>
              </Reveal>
              {contacts.length > 0 && (
                <Reveal disabled={isPreview} className="mt-8">
                  <h3 className="text-center" style={{ fontFamily: display, fontSize: 22, color: R.maroon }}>
                    If you need anything, call
                  </h3>
                  <ul className="mt-4 border-t" style={{ borderColor: R.rule }}>
                    {contacts.map((c, i) => {
                      const [who, ...role] = c.name.split(/\s+[—–-]\s+/)
                      const tel = telHref(c.phone)
                      const wa = whatsappHref(c.phone, `Namaste ${who.split(' ')[0]}, I'm a guest at ${couple}'s wedding — `)
                      return (
                        <li key={`${c.name}-${i}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b py-4" style={{ borderColor: R.rule }}>
                          <div className="min-w-0">
                            <p style={{ fontFamily: display, fontSize: 20, color: R.ink }}>{who}</p>
                            {role.length > 0 && (
                              <p style={{ fontFamily: text, fontSize: 15, color: R.soft }}>{cap(role.join(' — '))}</p>
                            )}
                          </div>
                          {(tel || wa) && (
                            <div className="flex gap-2">
                              <Act href={tel} external={false} isPreview={isPreview} label={`Call ${who}`} className={`${btn} border !px-4 !py-2.5 hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.rule, color: R.maroon }}>
                                {Icon.phone}
                                Call
                              </Act>
                              <Act href={wa} isPreview={isPreview} label={`WhatsApp ${who}`} className={`${btn} border !px-4 !py-2.5 hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.rule, color: R.maroon }}>
                                {Icon.whatsapp}
                                WhatsApp
                              </Act>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </Reveal>
              )}
              {faq.length > 0 && (
                <Reveal disabled={isPreview} className="mt-10">
                  <h3 className="text-center" style={{ fontFamily: display, fontSize: 22, color: R.maroon }}>
                    Questions you may have
                  </h3>
                  <div className="mt-4 border-t" style={{ borderColor: R.rule }}>
                    {faq.map((f, i) => (
                      <details key={`${f.q}-${i}`} className="border-b" style={{ borderColor: R.rule }}>
                        <summary className="flex items-start justify-between gap-4 py-4">
                          <span style={{ fontFamily: display, fontSize: 19, lineHeight: 1.35, color: R.ink }}>{f.q}</span>
                          <svg viewBox="0 0 20 20" className="rw-plus mt-1 h-4 w-4 shrink-0" fill="none" stroke={R.gold} strokeWidth={1.6} aria-hidden>
                            <path d="M10 3v14M3 10h14" strokeLinecap="round" />
                          </svg>
                        </summary>
                        {f.a && (
                          <p className="pb-5 pr-8 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                            {f.a}
                          </p>
                        )}
                      </details>
                    ))}
                  </div>
                </Reveal>
              )}
            </section>
          )}

          {/* ── Reply ─────────────────────────────────────────────────── */}
          <section id="rw-rsvp" className="relative mt-20 text-center" style={{ background: R.maroon, color: R.onMaroon, scrollMarginTop: 56 }}>
            <div aria-hidden className="absolute inset-x-0 -top-[15px] h-4" style={kanguraEdge(R.maroon)} />
            <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-16" style={grain(0.08)}>
              {reply ? (
                <Heading light sub={rsvpBy ? `Kindly reply by ${rsvpBy.weekday}, the ${ordinalWords(rsvpBy.day)} of ${rsvpBy.month}` : 'The favour of a reply is requested'}>
                  Kindly Reply
                </Heading>
              ) : (
                <Heading light>Save the Date</Heading>
              )}
              <p className="mt-6" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>
                {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              <p className="mt-1 text-balance" style={{ fontFamily: text, fontSize: 16, color: R.onMaroonSoft }}>
                {[venue, time].filter(Boolean).join(' · ')}
              </p>
              {!reply && rsvpBy && (
                <p className="mt-3" style={{ fontFamily: text, fontSize: 16, color: R.onMaroonSoft }}>
                  Kindly reply by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}
                </p>
              )}
              <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                <Act href={reply} isPreview={isPreview} className={`${btn} hover:bg-[#E6CB8C]`} style={{ background: R.goldLight, color: R.maroonDeep }}>
                  {Icon.whatsapp}
                  Reply on WhatsApp
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(245,231,205,0.08)]`} style={{ borderColor: 'rgba(217,185,108,0.6)', color: R.onMaroon }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
              </div>
              {live && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: 'rgba(217,185,108,0.3)' }}>
                  <p style={{ fontFamily: display, fontSize: 21 }}>Can&rsquo;t be with us in person?</p>
                  <p className="mt-1" style={{ fontFamily: text, fontSize: 15, color: R.onMaroonSoft }}>
                    The ceremony will be streamed for family and friends far away.
                  </p>
                  <Act href={live} isPreview={isPreview} className={`${btn} mt-4 border hover:bg-[rgba(245,231,205,0.08)]`} style={{ borderColor: 'rgba(217,185,108,0.6)', color: R.onMaroon }}>
                    {Icon.play}
                    Watch live
                  </Act>
                </div>
              )}
              {hashtag && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: 'rgba(217,185,108,0.3)' }}>
                  <p style={{ fontFamily: text, fontSize: 15, color: R.onMaroonSoft }}>Share your pictures with</p>
                  <p className="mt-1 break-words" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)', color: R.goldLight }}>
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                  </p>
                </div>
              )}
            </Reveal>
          </section>

          {eventId && (
            <div id="rw-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection
                eventId={eventId}
                theme={WISHES_THEME}
                title="Blessings"
                intro={`Leave a few words for ${bride} and ${groom}. Your blessing appears here for every guest.`}
                noun="blessing"
              />
            </div>
          )}

          {/* ── Foot ─────────────────────────────────────────────────── */}
          <footer className="px-6 pb-10 pt-12 text-center">
            <Boss letters={letters} className="mx-auto block w-[84px]" />
            <p className="mt-4" style={{ fontFamily: display, fontSize: 22, color: R.maroon }}>
              {couple}
            </p>
            {date && (
              <p className="mt-1 text-[13px] uppercase tabular-nums" style={{ fontFamily: text, letterSpacing: '0.28em', color: R.gold }}>
                {date.day} · {date.monthShort} · {date.year}
              </p>
            )}
            <div className="mt-8">
              <Credit isPreview={isPreview} color={R.faint} linkColor={R.soft} />
            </div>
          </footer>

          {lb.open !== null && (
            <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(28,8,8,0.96)" color={R.onMaroon} font={text} />
          )}
        </>
      )}

      <style>{`
        .rw .rw-fam { grid-template-columns: 1fr; }
        @container (min-width: 340px) { .rw .rw-fam { grid-template-columns: 1fr 1fr; } }
        @container (min-width: 640px) { .rw .rw-fns { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  )
}

