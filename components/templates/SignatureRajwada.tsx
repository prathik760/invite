'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { inOrder } from '@/lib/nameOrder'
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
  musicSrc,
} from './kit/core'
import { Credit, MusicToggle, useOpenWhileEditing } from './kit/ui'
import { numberWords, ordinalWords } from './kit/words'
import type { InviteTheme } from './kit/theme'
import { Balustrade, Boss, CROWN, CourtyardCrown, DoorFrame, DoorLeaf, FRAME, LakeView, LotusMark, Motif, R, WindowArch, kanguraEdge, motifFor } from './rajwada/art'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './rajwada/parts'
import { Birds, DiyaIcon, Fireworks, GateDressing, LakeLamps, Mandala, PetalBurst, Petals, Stars, Words, type Burst } from './rajwada/motion'

/*
 * Rajwada: a palace wedding in Udaipur, at dusk.
 * The guest arrives at the palace gate as the sky turns violet: fireworks go
 * up over the battlements, petals drift down, diyas flicker on the threshold
 * and a toran of mango leaves and marigolds sways over the carved doors
 * (lacquered leaves, brass studs, a peacock in each arch, the couple's
 * monogram glowing on the boss where they meet). A tap lifts the ring
 * knocker; the doors swing inward in 3D, light pours out with a burst of
 * petals, and we walk through into the marble courtyard. Through its cusped
 * arch, hung with swaying lanterns and marigolds, the Lake Palace is lit
 * against the dusk, lamps float on the water and the fireworks go on.
 * Inside: every function behind its own window, whose shutters open as it
 * comes into view; the story lit diya by diya; photographs behind curtains
 * that part; a mandala clock counting the seconds; and the reply on a royal
 * scroll that unrolls.
 *
 * Reveals are CSS, driven by one IntersectionObserver that sets data-in on
 * every [data-rv]. Hidden states only apply under .rw[data-anim], set after
 * hydration and never in the builder preview, so content is never stuck
 * invisible.
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

// Fireworks over the gate, over the courtyard, and over the reply.
const GATE_FW: Burst[] = [
  { x: 18, y: 7, c: '#FFD36E', d: 0.4, s: 46 },
  { x: 78, y: 5, c: '#FF7BA6', d: 1.7, s: 54 },
  { x: 50, y: 3, c: '#9FE3FF', d: 3.1, s: 40 },
  { x: 34, y: 10, c: '#FFB45C', d: 2.4, s: 36 },
]
const SKY_FW: Burst[] = [
  { x: 24, y: 24, c: '#FFD36E', d: 1.2, s: 50 },
  { x: 76, y: 20, c: '#FF8FB4', d: 2.6, s: 58 },
  { x: 52, y: 14, c: '#FFE9A8', d: 3.9, s: 44 },
]
const REPLY_FW: Burst[] = [
  { x: 14, y: 16, c: '#FFD36E', d: 0.2, s: 44 },
  { x: 86, y: 12, c: '#FF9DBE', d: 1.5, s: 50 },
  { x: 70, y: 30, c: '#FFE9A8', d: 2.8, s: 36 },
]

/** Size a display line from its longest word, so long names step down instead of overflowing. */
function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(4, ...names.flatMap((s) => s.split(/\s+/).map((w) => w.length)))
  return `clamp(${min}px, ${(span / (n * k)).toFixed(2)}cqi, ${max}px)`
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const first = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''

function Heading({ children, sub, light }: { children: string; sub?: ReactNode; light?: boolean }) {
  return (
    <div className="text-center" data-rv="">
      <LotusMark color={light ? R.goldLight : R.gold} className="rw-lotus mx-auto block w-[112px]" />
      <Words as="h2" text={children} className="rw-h2 mt-3 text-balance" style={{ color: light ? R.onMaroon : R.maroon }} />
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

/** A function behind its own palace window; the shutters open as it comes into view. */
function FunctionCard({ fn, day, i, couple, data, mainDirections, isPreview }: { fn: Fn; day?: string; i: number; couple: string; data: Record<string, string>; mainDirections: string | null; isPreview: boolean }) {
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const venue = fn.venue || data.venue || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const cal = calendarHref(`${fn.name} · ${couple}`, fn.date, fn.time, place || undefined, 3)
  const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : mainDirections
  const kind = motifFor(fn.name)
  return (
    <article className="rw-fn relative" data-rv="" style={{ '--k': i % 2 } as CSSProperties}>
      <div className="rw-fn-win relative">
        <span className="rw-fn-glow" aria-hidden />
        <Motif kind={kind} className={`rw-motif rw-m-${kind} absolute left-1/2 top-[20%] w-[28%] -translate-x-1/2`} />
        <span className="rw-shut" aria-hidden>
          <i />
          <i />
        </span>
        <WindowArch bg={R.marble} className="relative block w-full" />
      </div>
      <div className="relative border-x border-b px-6 pb-7 pt-5 text-center" style={{ borderColor: R.rule, background: R.card }}>
        <span aria-hidden className="pointer-events-none absolute inset-x-[6px] bottom-[6px] top-0 border-x border-b" style={{ borderColor: R.hair }} />
        {day && (
          <p className="rw-day relative mx-auto inline-block px-3 py-0.5 text-[12px] uppercase" style={{ fontFamily: text, letterSpacing: '0.22em' }}>
            {day}
          </p>
        )}
        <h3 className="relative mt-2 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 34px)', color: R.maroon }}>
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

/** The mandala clock: days in the middle, the seconds lighting its outer ring. Its own component, so only it re-renders each second. */
function Countdown({ date, time }: { date?: string; time?: string }) {
  const c = useCountdown(date, time, true)
  if (!c) return null
  return (
    <section className="rw-count relative mt-20 text-center" style={{ background: R.maroon, color: R.onMaroon }}>
      <div aria-hidden className="absolute inset-x-0 -top-[15px] h-4" style={kanguraEdge(R.maroon)} />
      <div className="relative mx-auto max-w-[30rem] overflow-hidden px-6 pb-14 pt-12" style={grain(0.08)}>
        <p className="rw-count-k" data-rv="">
          The auspicious hour approaches
        </p>
        <div className="rw-clock relative mx-auto mt-6" data-rv="">
          <Mandala lit={c.seconds === 0 ? 60 : c.seconds} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p key={c.days} className="rw-days leading-none" style={{ fontFamily: deva, color: R.goldLight }}>
              {c.days}
            </p>
            <p className="mt-1" style={{ fontFamily: display, fontSize: 'clamp(17px, 5cqi, 21px)' }}>
              {c.days === 1 ? 'day' : 'days'} to go
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3" data-rv="">
          {(
            [
              [c.hours, 'Hours'],
              [c.minutes, 'Minutes'],
              [c.seconds, 'Seconds'],
            ] as [number, string][]
          ).map(([n, label]) => (
            <div key={label} className="rw-unit">
              <span key={n} className="rw-unit-n">
                {pad2(n)}
              </span>
              <span className="rw-unit-l">{label}</span>
            </div>
          ))}
        </div>
        <DiyaIcon className="rw-count-diya left-[4%]" />
        <DiyaIcon className="rw-count-diya right-[4%]" i={3} />
      </div>
      <div aria-hidden className="absolute inset-x-0 -bottom-[15px] h-4 rotate-180" style={kanguraEdge(R.maroon)} />
    </section>
  )
}

type Phase = 'sealed' | 'knock' | 'open' | 'through' | 'done'

export default function SignatureRajwada({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Aditi'
  const groom = data.groomName?.trim() || 'Kabir'
  // The couple in the invitation's order: the host's choice, else this design's own (lib/nameOrder.ts).
  const [nameA, nameB] = inOrder(data, 'signature-rajwada', bride, groom)
  const couple = `${nameA} & ${nameB}`
  const letters: [string, string] = [first(nameA), first(nameB)]
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

  /* The doors: sealed → knock (ring lifts) → open (leaves swing in, light pours out) → through (we walk in) → done. */
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState<Phase>('sealed')
  // In the builder, while its details are edited, the opening is passed (kit/ui useOpenWhileEditing).
  useOpenWhileEditing(phase, setPhase, 'sealed', 'done')
  const [anim, setAnim] = useState(false)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  useEffect(() => {
    if (!isPreview && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAnim(true)
  }, [isPreview])
  const openDoors = useCallback(() => {
    if (phase !== 'sealed') return
    rootRef.current?.querySelector('audio')?.play().catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('knock')
    const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), ms))
    at(420, 'open')
    at(2000, 'through')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done')
        if (!isPreview) window.scrollTo(0, 0)
      }, 3050),
    )
  }, [phase, isPreview])

  // Reveal on scroll: one observer for every [data-rv], including ones mounted later.
  const ready = phase === 'done'
  useEffect(() => {
    const root = rootRef.current
    if (!root || !anim || !ready) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    const watch = () => root.querySelectorAll('[data-rv]:not([data-in])').forEach((el) => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [anim, ready])

  // The story's thread fills, and its diyas light, as the guest reads down it.
  const thread = useRef<HTMLOListElement | null>(null)
  useEffect(() => {
    const el = thread.current
    if (!el || !anim || !ready) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const p = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - r.top) / Math.max(1, r.height)))
        el.style.setProperty('--p', p.toFixed(3))
        el.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => s.toggleAttribute('data-lit', s.getBoundingClientRect().top < window.innerHeight * 0.62))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [anim, ready, story.length])

  const [cheer, setCheer] = useState(0)
  const lb = useLightbox(photos.length)
  // 0.6: Gilda's widest letters; a low floor so a long surname fits a narrow phone.
  const nameSize = fit([bride, groom], 64, 0.6, 20, 70)
  const music = Boolean(musicSrc(data.musicUrl))
  const u = (n: number) => `${((n / CROWN.span) * 100).toFixed(3)}cqi`
  const heroMin = isPreview ? 560 : '100svh'
  const stageH = isPreview ? '560px' : '100svh'
  const opening = phase === 'open' || phase === 'through'

  return (
    <div
      ref={rootRef}
      className="rw relative"
      data-ph={phase}
      data-anim={anim ? '' : undefined}
      style={{
        background: R.marble,
        color: R.ink,
        fontFamily: text,
        containerType: 'inline-size',
        overflowX: 'clip',
        ['--rw-display' as string]: display,
        ['--rw-deva' as string]: deva,
        ['--rw-text' as string]: text,
      }}
    >
      {/* Raw CSS, not a text child: React escapes > and " in text on the server, which
          breaks those rules until hydration and fails hydration on Safari (React #425). */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={R.goldPale} background="rgba(42,14,30,0.75)" border="rgba(217,185,108,0.5)" />

      {/* ── The courtyard at dusk: the hero, behind the doors ──────────── */}
      <section id="rw-top" className="relative overflow-hidden" style={{ minHeight: heroMin, background: R.marble }}>
        <div className="rw-scene relative mx-auto flex w-full flex-col px-[5cqi] pt-[5cqi]" style={{ minHeight: heroMin, ...grain(0.05) }}>
          <div className="relative mx-auto flex w-full max-w-[30rem] flex-1 flex-col" style={{ containerType: 'inline-size' }}>
            <div className="rw-sky absolute inset-0" aria-hidden>
              <Stars count={26} seed={7} />
              <span className="rw-moon" />
              <Fireworks bursts={SKY_FW} className="rw-sky-fw" />
              <Birds className="rw-birds-hero" />
            </div>
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
                  <p className="rw-glowtext leading-[1.35]" style={{ fontFamily: deva, fontSize: 'clamp(19px, 5.6cqi, 23px)', color: R.goldPale }}>
                    {invocation[0]}
                  </p>
                  {invocation.slice(1).map((l, i) => (
                    <p key={i} className="mt-0.5 leading-[1.5]" style={{ fontFamily: shloka, fontSize: 'clamp(14px, 4cqi, 16px)', color: 'rgba(250,228,196,0.82)' }}>
                      {l}
                    </p>
                  ))}
                </div>
              )}

              <h1 className="mt-[7cqi]" style={{ fontFamily: display, fontWeight: 400 }}>
                <span className="rw-rise rw-name block text-balance leading-[1]" style={{ fontSize: nameSize, ['--d' as string]: '380ms' }}>
                  {nameA}
                </span>
                <span className="rw-rise my-[2.5cqi] flex items-center justify-center gap-3" style={{ ['--d' as string]: '520ms' }}>
                  <span aria-hidden className="rw-wedsline h-px w-[12cqi]" />
                  <span className="italic" style={{ fontFamily: shloka, fontSize: 'clamp(19px, 5.6cqi, 23px)', color: R.goldLight }}>
                    weds
                  </span>
                  <span aria-hidden className="rw-wedsline h-px w-[12cqi]" />
                </span>
                <span className="rw-rise rw-name block text-balance leading-[1]" style={{ fontSize: nameSize, ['--d' as string]: '660ms' }}>
                  {nameB}
                </span>
              </h1>

              <div className="rw-rise mt-[7cqi]" style={{ ['--d' as string]: '860ms' }}>
                {date ? (
                  <>
                    <p className="text-balance leading-[1.3]" style={{ fontFamily: display, fontSize: 'clamp(19px, 5.8cqi, 23px)', color: '#FBEBD2' }}>
                      <span className="block">{date.weekday},</span>
                      the {ordinalWords(date.day)} of {date.month}
                    </p>
                    <p className="mt-1" style={{ fontFamily: text, fontSize: 17, fontWeight: 500, color: 'rgba(251,235,210,0.82)' }}>
                      {date.year}
                      {time && ` · ${time}`}
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: display, fontSize: 21, color: '#FBEBD2' }}>
                    Date to be announced{time && <span style={{ fontFamily: text, fontSize: 17, color: 'rgba(251,235,210,0.82)' }}> · {time}</span>}
                  </p>
                )}
                {venue && (
                  <p className="mx-auto mt-4 max-w-[17rem] text-balance uppercase leading-[1.35]" style={{ fontFamily: display, fontSize: 16, letterSpacing: '0.14em', color: '#FFE7B0', textShadow: '0 1px 10px rgba(60,10,40,.55)' }}>
                    {venue}
                  </p>
                )}
              </div>
              <div className="min-h-[6cqi] flex-1" />
            </div>

            <LakeView uid="rw-hero-lake" tone="dusk" className="relative z-[1] block w-full">
              <LakeLamps />
            </LakeView>
            <Balustrade uid="rw-hero-rail" className="relative z-[1] block h-[15cqi] w-full" />
            <Petals count={12} seed={3} className="z-[4]" />
          </div>
        </div>
        {phase === 'done' && !isPreview && (
          <a href="#rw-invite" className="rw-cue absolute bottom-[3.5cqi] left-1/2 z-[5] -translate-x-1/2" aria-label="Scroll to the invitation" onClick={(e) => {
            e.preventDefault()
            document.getElementById(hasFamilies ? 'rw-invite' : nav[0]?.id ?? 'rw-venue')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}

        {/* ── The palace gate at dusk ─────────────────────────────────── */}
        {phase !== 'done' && (
          <div className={`rw-stage absolute inset-0 z-30 ${phase === 'knock' ? 'is-knock' : ''} ${opening ? 'is-open' : ''} ${phase === 'through' ? 'is-through' : ''}`}>
            <div className="rw-dusk absolute inset-0" aria-hidden>
              <Stars count={30} seed={11} />
              <span className="rw-moon rw-moon-gate" />
              <Fireworks bursts={GATE_FW} />
              <Birds className="rw-birds-gate" />
            </div>
            <div className="relative flex h-full min-h-[560px] flex-col items-center justify-center overflow-hidden px-3">
              {invocation[0] && (
                <p className="rw-fade rw-glowtext relative z-[2] mb-[1.4svh] text-center" style={{ fontFamily: deva, fontSize: 18, color: R.goldPale }}>
                  {invocation[0]}
                </p>
              )}
              <div className="rw-frame relative z-[1]" style={{ width: `min(90cqi, calc((${stageH} - ${invocation[0] ? 250 : 220}px) * ${(FRAME.w / FRAME.h).toFixed(4)}), 450px)`, aspectRatio: `${FRAME.w} / ${FRAME.h}` }}>
                <span className="rw-light" aria-hidden style={{ left: `${(FRAME.x / FRAME.w) * 100}%`, top: `${(FRAME.y / FRAME.h) * 100}%`, width: `${(FRAME.dw / FRAME.w) * 100}%`, height: `${(FRAME.dh / FRAME.h) * 100}%` }} />
                <DoorFrame sky className="absolute inset-0 h-full w-full" />
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
                <span className="rw-dusk-veil" aria-hidden />
                <span className="rw-boss-glow" aria-hidden />
                <GateDressing className="pointer-events-none absolute inset-0 h-full w-full" />
              </div>
              <div className="rw-fade rw-gate-text relative z-[2] mt-[2svh] text-center">
                <p className="rw-gate-names" style={{ fontFamily: display, fontSize: 'clamp(24px, 7cqi, 30px)' }}>
                  {couple}
                </p>
                {date && (
                  <p className="mt-0.5" style={{ fontFamily: text, fontSize: 15, letterSpacing: '0.08em', color: R.maroonDeep }}>
                    {date.day} {date.month} {date.year}
                  </p>
                )}
                <p className="rw-hint mt-3 inline-flex items-center gap-2" style={{ fontFamily: text, fontSize: 15, fontWeight: 500, color: R.maroon }}>
                  <span className="rw-tap" aria-hidden />
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
            <span className="rw-rays" aria-hidden />
            {opening && <PetalBurst />}
            <Petals count={14} seed={21} className="z-[3]" />
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
            <section id="rw-invite" className="relative mx-auto max-w-[32rem] px-6 pt-14 text-center" style={{ scrollMarginTop: 56 }}>
              {data.message?.trim() && (
                <div data-rv="">
                  <LotusMark className="rw-lotus mx-auto block w-[112px]" />
                  <Words as="p" text={data.message} className="rw-lead mx-auto mt-5 max-w-[24rem] text-balance" />
                </div>
              )}

              {couplePhoto && (
                <figure className="rw-photo mx-auto mt-10 max-w-[24rem] border p-[7px]" style={{ borderColor: R.rule, background: R.card }} data-rv="">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={couplePhoto} alt={couple} loading="lazy" className="rw-kb h-full w-full object-cover" />
                    <span className="rw-parda" aria-hidden>
                      <i />
                      <i />
                    </span>
                    <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />
                  </div>
                </figure>
              )}

              {(data.brideParents?.trim() || data.groomParents?.trim() || portraits.bride || portraits.groom) && (
                <div className="rw-fam relative mt-12 grid items-start gap-x-4 gap-y-10" data-rv="">
                  <svg viewBox="0 0 200 40" className="rw-knot pointer-events-none absolute left-1/2 top-[34%] z-[2] w-[34%] -translate-x-1/2" aria-hidden>
                    <path d="M6 20C40 2 70 38 100 20C130 2 160 38 194 20" fill="none" stroke={R.gold} strokeWidth={1.4} strokeDasharray="1 5" strokeLinecap="round" pathLength={1} />
                    <path className="rw-knot-heart" d="M100 27C93 21 92 16 96 14C98 13 100 15 100 17C100 15 102 13 104 14C108 16 107 21 100 27Z" fill={R.vermilion} />
                  </svg>
                  {inOrder(
                    data,
                    'signature-rajwada',
                    { name: bride, parents: data.brideParents?.trim(), photo: portraits.bride, letter: first(bride) },
                    { name: groom, parents: data.groomParents?.trim(), photo: portraits.groom, letter: first(groom) },
                  ).map((p, i) => ({ ...p, side: i ? 'r' : 'l' })).map((p) => (
                    <div key={p.name} className={`rw-fam-${p.side} text-center`}>
                      <div className="relative mx-auto aspect-[3/4] w-[min(100%,150px)] overflow-hidden border p-[5px]" style={{ borderColor: R.rule, background: R.card }}>
                        <div className="relative h-full w-full overflow-hidden" style={{ background: R.teal }}>
                          {p.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.photo} alt={p.name} loading="lazy" className="rw-kb h-full w-full object-cover" />
                          ) : (
                            <span className="rw-initial absolute inset-0 flex items-center justify-center pt-[18%]" style={{ fontFamily: display, fontSize: 54, color: R.goldLight }}>
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
                </div>
              )}

              {blessings.length > 0 && (
                <div className="mx-auto mt-12 max-w-[24rem] border-t pt-8" style={{ borderColor: R.rule }} data-rv="">
                  <p className="italic" style={{ fontFamily: shloka, fontSize: 19, color: R.gold }}>
                    With the blessings of
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {blessings.map((b, i) => (
                      <li key={`${b}-${i}`} className="rw-bless text-balance leading-[1.35]" style={{ fontFamily: display, fontSize: 19, color: R.ink, '--k': i } as CSSProperties}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <Countdown date={data.date} time={data.time} />

          {/* ── Every function, each behind its own window ────────────── */}
          {functions.length > 0 && (
            <section id="rw-functions" className="mx-auto max-w-[32rem] px-5 pt-20" style={{ scrollMarginTop: 56 }}>
              <Heading sub="We request the pleasure of your company at each of the celebrations">The Celebrations</Heading>
              <div className="rw-fns mt-9 grid gap-7">
                {functions.map(({ fn, day }, i) => (
                  <FunctionCard key={`${fn.name}-${i}`} fn={fn} day={day} i={i} couple={couple} data={data} mainDirections={directions} isPreview={isPreview} />
                ))}
              </div>
            </section>
          )}

          {/* ── Our story, lit diya by diya ───────────────────────────── */}
          {story.length > 0 && (
            <section id="rw-story" className="mx-auto max-w-[32rem] px-6 pt-20" style={{ scrollMarginTop: 56 }}>
              <Heading>Our Story</Heading>
              <ol ref={thread} className="rw-thread relative mt-9">
                <span aria-hidden className="rw-thread-line" />
                <span aria-hidden className="rw-thread-fill" />
                {story.map((s, i) => (
                  <li key={`${s.title}-${i}`} className="rw-step relative pb-10 pl-14 last:pb-0" data-step="" data-rv="">
                    <span className="rw-step-diya" aria-hidden>
                      <DiyaIcon i={i} className="h-full w-full" />
                    </span>
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
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* ── Photographs, behind curtains that part ───────────────── */}
          {photos.length > 0 && (
            <section id="rw-photos" className="mx-auto max-w-[34rem] px-5 pt-20" style={{ scrollMarginTop: 56 }}>
              <Heading>From Our Album</Heading>
              <div className="mt-9 grid grid-cols-2 gap-3">
                {photos.map((src, i) => {
                  const big = i === 0 || (i > 0 && i % 5 === 0)
                  return (
                    <div key={`${src}-${i}`} className={`rw-shot ${big ? 'col-span-2' : ''}`} data-rv="" style={{ '--k': i % 2 } as CSSProperties}>
                      <button
                        type="button"
                        onClick={() => !isPreview && lb.setOpen(i)}
                        aria-label={`View photo ${i + 1} of ${photos.length}`}
                        className="block w-full border p-[5px] text-left"
                        style={{ borderColor: R.rule, background: R.card, cursor: isPreview ? 'default' : 'zoom-in' }}
                      >
                        <span className={`relative block w-full overflow-hidden ${big ? 'aspect-[4/5]' : 'aspect-[3/4]'}`} style={{ background: R.marbleDeep }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" loading="lazy" className="rw-kb h-full w-full object-cover" />
                          <span className="rw-parda" aria-hidden>
                            <i />
                            <i />
                          </span>
                          {big && <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── The venue, travel and stay ───────────────────────────── */}
          <section id="rw-venue" className="mx-auto max-w-[32rem] px-6 pt-20 text-center" style={{ scrollMarginTop: 56 }}>
            <Heading>The Venue</Heading>
            <div className="relative mx-auto mt-8 max-w-[22rem] overflow-hidden border p-[6px]" style={{ borderColor: R.rule, background: R.card }} data-rv="">
              <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F9F0E1, #F2DABA)' }}>
                <Birds className="rw-birds-venue" />
                <div className="pt-[24%]" />
                <LakeView uid="rw-venue-lake" className="block w-full" />
                <WindowArch bg={R.card} className="pointer-events-none absolute inset-x-0 top-0 block w-full" />
              </div>
            </div>
            <div data-rv="">
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
                <Act href={directions} isPreview={isPreview} className={`${btn} rw-shine hover:bg-[#581317]`} style={{ background: R.maroon, color: R.onMaroon }}>
                  {Icon.pin}
                  Get directions
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.maroon, color: R.maroon }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
              </div>
            </div>

            {travel.length > 0 && (
              <div className="rw-travel relative mt-12 border px-6 py-8 text-left" style={{ borderColor: R.rule, background: R.card }} data-rv="">
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
              </div>
            )}
          </section>

          {/* ── For our guests: people to call, questions ─────────────── */}
          {hasGuests && (
            <section id="rw-guests" className="mx-auto max-w-[32rem] px-6 pt-20" style={{ scrollMarginTop: 56 }}>
              <Heading>For Our Guests</Heading>
              {contacts.length > 0 && (
                <div className="mt-8" data-rv="">
                  <h3 className="text-center" style={{ fontFamily: display, fontSize: 22, color: R.maroon }}>
                    If you need anything, call
                  </h3>
                  <ul className="mt-4 border-t" style={{ borderColor: R.rule }}>
                    {contacts.map((c, i) => {
                      const [who, ...role] = c.name.split(/\s+[—–-]\s+|\s*,\s+/)
                      const tel = telHref(c.phone)
                      const wa = whatsappHref(c.phone, `Namaste ${who.split(' ')[0]}, I'm a guest at ${couple}'s wedding. `)
                      return (
                        <li key={`${c.name}-${i}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b py-4" style={{ borderColor: R.rule }}>
                          <div className="min-w-0">
                            <p style={{ fontFamily: display, fontSize: 20, color: R.ink }}>{who}</p>
                            {role.length > 0 && <p style={{ fontFamily: text, fontSize: 15, color: R.soft }}>{cap(role.join(', '))}</p>}
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
                </div>
              )}
              {faq.length > 0 && (
                <div className="mt-10" data-rv="">
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
                          <p className="rw-answer pb-5 pr-8 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                            {f.a}
                          </p>
                        )}
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Reply, on a royal scroll ─────────────────────────────── */}
          <section id="rw-rsvp" className="rw-reply relative mt-24 overflow-hidden text-center" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${R.lacquer}, ${R.maroonDeep} 75%)`, color: R.onMaroon, scrollMarginTop: 56 }}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-4" style={kanguraEdge(R.marble)} />
            <Fireworks bursts={REPLY_FW} className="rw-reply-fw" />
            <div className="relative mx-auto max-w-[30rem] px-5 pb-16 pt-16">
              <div className="rw-scroll" data-rv="">
                <span className="rw-rod rw-rod-top" aria-hidden />
                <div className="rw-scroll-paper">
                  {reply ? (
                    <Heading sub={rsvpBy ? `Kindly reply by ${rsvpBy.weekday}, the ${ordinalWords(rsvpBy.day)} of ${rsvpBy.month}` : 'The favour of a reply is requested'}>Kindly Reply</Heading>
                  ) : (
                    <Heading>Save the Date</Heading>
                  )}
                  <p className="mt-6" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)', color: R.maroon }}>
                    {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
                  </p>
                  <p className="mt-1 text-balance" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                    {[venue, time].filter(Boolean).join(' · ')}
                  </p>
                  {!reply && rsvpBy && (
                    <p className="mt-3" style={{ fontFamily: text, fontSize: 16, color: R.soft }}>
                      Kindly reply by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}
                    </p>
                  )}
                  <div className="relative mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                    <Act href={reply} isPreview={isPreview} className={`${btn} rw-shine rw-reply-btn`} style={{ background: R.maroon, color: R.onMaroon }}>
                      <span className="contents" onClick={() => setCheer((n) => n + 1)}>
                        {Icon.whatsapp}
                        Reply on WhatsApp
                      </span>
                    </Act>
                    <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.maroon, color: R.maroon }}>
                      {Icon.calendar}
                      Add to calendar
                    </Act>
                    {cheer > 0 && <PetalBurst key={cheer} count={24} seed={cheer + 30} />}
                  </div>
                  {live && (
                    <div className="mt-10 border-t pt-8" style={{ borderColor: R.rule }}>
                      <p style={{ fontFamily: display, fontSize: 21, color: R.maroon }}>Can&rsquo;t be with us in person?</p>
                      <p className="mt-1" style={{ fontFamily: text, fontSize: 15, color: R.soft }}>
                        The ceremony will be streamed for family and friends far away.
                      </p>
                      <Act href={live} isPreview={isPreview} className={`${btn} mt-4 border hover:bg-[rgba(107,26,30,0.05)]`} style={{ borderColor: R.maroon, color: R.maroon }}>
                        {Icon.play}
                        Watch live
                      </Act>
                    </div>
                  )}
                  {hashtag && (
                    <div className="mt-10 border-t pt-8" style={{ borderColor: R.rule }}>
                      <p style={{ fontFamily: text, fontSize: 15, color: R.soft }}>Share your pictures with</p>
                      <p className="rw-foil mt-1 break-words" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)' }}>
                        {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                      </p>
                    </div>
                  )}
                </div>
                <span className="rw-rod rw-rod-bottom" aria-hidden />
              </div>
            </div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-4 rotate-180" style={kanguraEdge(R.marble)} />
          </section>

          {eventId && (
            <div id="rw-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection eventId={eventId} theme={WISHES_THEME} title="Blessings" intro={`Leave a few words for ${nameA} and ${nameB}. Your blessing appears here for every guest.`} noun="blessing" />
            </div>
          )}

          {/* ── Foot ─────────────────────────────────────────────────── */}
          <footer className="relative overflow-hidden px-6 pb-10 pt-14 text-center">
            <Petals count={8} seed={41} />
            <div className="relative" data-rv="">
              <div className="rw-boss mx-auto w-[96px]">
                <Boss letters={letters} className="block w-full" />
              </div>
              <p className="rw-glowtext mt-5" style={{ fontFamily: deva, fontSize: 24, color: R.vermilion }}>
                ॥ शुभ विवाह ॥
              </p>
              <p className="mt-2" style={{ fontFamily: display, fontSize: 24, color: R.maroon }}>
                {couple}
              </p>
              {date && (
                <p className="mt-1 text-[13px] uppercase tabular-nums" style={{ fontFamily: text, letterSpacing: '0.28em', color: R.gold }}>
                  {date.day} · {date.monthShort} · {date.year}
                </p>
              )}
            </div>
            <div className="relative mt-8">
              <Credit isPreview={isPreview} color={R.faint} linkColor={R.soft} />
            </div>
          </footer>

          {lb.open !== null && <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(28,8,8,0.96)" color={R.onMaroon} font={text} />}
        </>
      )}
    </div>
  )
}

/* Scoped to .rw. Colours are the palette's constants: no user data reaches this string. */
const CSS = `
.rw .rw-h2 { font-family: var(--rw-display); font-size: clamp(30px, 9cqi, 40px); line-height: 1.08; }
.rw .rw-lead { font-family: var(--rw-display); font-size: clamp(21px, 6.2cqi, 25px); line-height: 1.45; color: ${R.ink}; }
.rw .rw-link { text-decoration: underline; text-decoration-color: ${R.rule}; text-underline-offset: 5px; }
.rw .rw-link:hover { text-decoration-color: currentColor; }
.rw .rw-btn { position: relative; overflow: hidden; transition: background-color .2s ease, color .2s ease, transform .2s ease; }
.rw .rw-btn:active { transform: scale(.98); }
.rw .rw-shine::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%; transform: skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,240,200,.45), transparent); animation: rw-shine 3.6s ease-in-out infinite; pointer-events: none; }
.rw .rw-foil { background: linear-gradient(100deg, ${R.goldDark}, ${R.goldLight} 40%, ${R.goldPale} 50%, ${R.gold} 65%, ${R.goldDark}); background-size: 240% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${R.gold}; animation: rw-foil 5s linear infinite; }
.rw .rw-glowtext { text-shadow: 0 0 18px rgba(255,200,110,.55); animation: rw-glow 3.2s ease-in-out infinite; }
.rw details > summary { list-style: none; cursor: pointer; }
.rw details > summary::-webkit-details-marker { display: none; }
.rw details .rw-plus { transition: transform .3s ease; }
.rw details[open] .rw-plus { transform: rotate(135deg); }
.rw details[open] .rw-answer { animation: rw-up .45s ease both; }
.rw .rw-fam { grid-template-columns: 1fr; }
@container (min-width: 340px) { .rw .rw-fam { grid-template-columns: 1fr 1fr; } }
@container (min-width: 640px) { .rw .rw-fns { grid-template-columns: 1fr 1fr; } }
@container (max-width: 339px) { .rw .rw-knot { display: none; } }

/* ── Sky: dusk, stars, the moon, birds, fireworks ── */
.rw .rw-sky { background: linear-gradient(180deg, #2B0F35 0%, #4E1A47 26%, #8C3555 50%, #D06A5C 70%, #F2A766 86%, #F7C88C 100%); }
.rw .rw-dusk { background: linear-gradient(180deg, #1F0A2C 0%, #3D1442 22%, #7A2B50 42%, #B9564F 58%, #D98455 70%); }
.rw .rw-stars i { position: absolute; width: var(--s); height: var(--s); border-radius: 50%; background: #FFF6DC; box-shadow: 0 0 4px #FFE9B0; animation: rw-twinkle 3s ease-in-out infinite; }
.rw .rw-moon { position: absolute; left: 13%; top: 7%; width: 7cqi; height: 7cqi; max-width: 34px; max-height: 34px; border-radius: 50%; box-shadow: inset -2.4cqi 0.6cqi 0 0 #FCE9BE; filter: drop-shadow(0 0 8px rgba(255,226,160,.7)); transform: rotate(-20deg); }
.rw .rw-moon-gate { left: 82%; top: 4%; }
.rw .rw-birds { position: absolute; left: 0; width: 70px; height: 40px; color: rgba(40,12,30,.75); animation: rw-fly 26s linear infinite; }
.rw .rw-birds svg { position: absolute; height: auto; overflow: visible; }
.rw .rw-birds path { transform-origin: 50% 60%; transform-box: fill-box; animation: rw-flap .55s ease-in-out infinite alternate; }
.rw .rw-birds-hero { top: 30%; animation-delay: -6s; }
.rw .rw-birds-gate { top: 12%; color: rgba(30,8,24,.8); animation-duration: 30s; }
.rw .rw-birds-venue { top: 18%; color: rgba(90,50,40,.55); animation-duration: 22s; z-index: 1; }
.rw .rw-fireworks { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.rw .rw-sky-fw { opacity: .9; }
.rw .rw-fw { position: absolute; width: 0; height: 0; }
.rw .rw-fw i { position: absolute; left: -1.2px; top: 0; width: 2.4px; height: calc(var(--s) * .3); border-radius: 2px; background: linear-gradient(to top, var(--c), transparent); transform-origin: 50% 0; opacity: 0; animation: rw-spark 4.6s cubic-bezier(.15,.7,.3,1) var(--d) infinite; }
.rw .rw-fw-trail { position: absolute; left: -1px; top: 0; width: 2px; height: 34px; border-radius: 2px; background: linear-gradient(to bottom, #FFF6D8, transparent); opacity: 0; animation: rw-rocket 4.6s ease-out var(--d) infinite; }
.rw .rw-fw-core { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border-radius: 50%; background: radial-gradient(circle, #FFFFFF, var(--c) 35%, transparent 70%); opacity: 0; animation: rw-core 4.6s ease-out var(--d) infinite; }

/* ── Petals ── */
.rw .rw-petals { position: absolute; inset: 0; pointer-events: none; overflow: hidden; container-type: size; }
.rw .rw-petal { position: absolute; top: -4%; border-radius: 85% 0 85% 0; opacity: .9; animation-name: rw-fall; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
.rw .rw-petal-0 { background: radial-gradient(circle at 30% 30%, #F27C93, #C0284B 70%); }
.rw .rw-petal-1 { background: radial-gradient(circle at 30% 30%, #FFC24D, #E2720F 70%); }
.rw .rw-petal-2 { background: radial-gradient(circle at 30% 30%, #FFD9E0, #E58BA2 70%); }
.rw .rw-burst { position: absolute; left: 50%; top: 48%; z-index: 6; pointer-events: none; }
.rw .rw-burst i { position: absolute; width: 11px; height: 14px; border-radius: 85% 0 85% 0; opacity: 0; animation: rw-throw 1.9s cubic-bezier(.15,.75,.35,1) both; }
.rw .rw-reply .rw-burst { top: 0; }

/* ── The gate ── */
.rw .rw-leaf { transition: transform 1.9s cubic-bezier(.6,.02,.28,1); will-change: transform; transform-style: preserve-3d; }
.rw .rw-stage.is-open .rw-leaf-l { transform: rotateY(86deg); }
.rw .rw-stage.is-open .rw-leaf-r { transform: rotateY(-86deg); }
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
.rw .rw-stage.is-through .rw-dusk { opacity: 0; transition: opacity .8s ease; }
.rw .rw-dusk-veil { position: absolute; left: -300%; right: -300%; top: 3.75%; bottom: -300%; background: rgba(80,28,48,.2); mix-blend-mode: multiply; pointer-events: none; transition: opacity 1s ease; }
.rw .rw-stage.is-open .rw-dusk-veil { opacity: 0; }
.rw .rw-boss-glow { position: absolute; left: 50%; top: 51.25%; width: 21%; aspect-ratio: 1; border-radius: 50%; translate: -50% -50%; box-shadow: 0 0 0 0 rgba(255,214,120,.7); animation: rw-ping 2.4s ease-out 1.4s infinite; pointer-events: none; }
.rw .rw-stage:not(.is-knock):not(.is-open) .rw-boss-glow { background: radial-gradient(circle, rgba(255,220,140,.32), transparent 70%); }
.rw .rw-stage.is-knock .rw-boss-glow, .rw .rw-stage.is-open .rw-boss-glow { animation: none; opacity: 0; }
.rw .rw-light { position: absolute; background: radial-gradient(60% 55% at 50% 55%, rgba(255,246,214,.95), rgba(255,206,120,.55) 45%, rgba(255,170,90,0) 75%); opacity: 0; transition: opacity 1s ease .2s; z-index: 0; }
.rw .rw-stage.is-open .rw-light { opacity: 1; }
.rw .rw-rays { position: absolute; left: 50%; top: 52%; width: 160vmax; height: 160vmax; translate: -50% -50%; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255,232,170,.22) 0deg 5deg, transparent 5deg 15deg); -webkit-mask-image: radial-gradient(circle, #000 4%, transparent 32%); mask-image: radial-gradient(circle, #000 4%, transparent 32%); mix-blend-mode: screen; opacity: 0; pointer-events: none; z-index: 4; transition: opacity .9s ease .3s; }
.rw .rw-stage.is-open .rw-rays { opacity: 1; animation: rw-spin 14s linear infinite; }
.rw .rw-stage.is-through .rw-rays { opacity: 0; transition-delay: 0s; }
.rw .rw-gate-names { color: ${R.maroonDeep}; }
.rw .rw-hint { animation: rw-breathe 2.6s ease-in-out infinite; }
.rw .rw-tap { position: relative; width: 10px; height: 10px; border-radius: 50%; background: ${R.maroon}; }
.rw .rw-tap::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1.5px solid ${R.maroon}; animation: rw-ripple 1.8s ease-out infinite; }
.rw .rw-sway { animation: rw-sway 3.4s ease-in-out infinite alternate; }
.rw .rw-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: rw-flicker 1.3s ease-in-out infinite alternate; }
.rw .rw-dglow { transform-box: fill-box; transform-origin: center; animation: rw-dglow 2.2s ease-in-out infinite alternate; }

/* ── The courtyard ── */
.rw .rw-scene { transition: transform 2.8s cubic-bezier(.2,.7,.2,1); }
.rw[data-ph="sealed"] .rw-scene, .rw[data-ph="knock"] .rw-scene { transform: scale(1.1); }
.rw .rw-rise { transition: opacity .9s ease var(--d, 0ms), transform 1.2s cubic-bezier(.2,.7,.2,1) var(--d, 0ms), filter 1.2s ease var(--d, 0ms); }
.rw[data-ph="sealed"] .rw-rise, .rw[data-ph="knock"] .rw-rise { opacity: 0; transform: translateY(16px); filter: blur(6px); }
.rw .rw-name { background: linear-gradient(100deg, #F6DFA8 0%, #FFF6DE 42%, #FFFFFF 50%, #F3D592 58%, #E9C47A 100%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: #F6DFA8; animation: rw-foil 6s linear infinite; }
.rw .rw-wedsline { background: ${R.goldLight}; transform-origin: center; transition: transform 1.2s cubic-bezier(.2,.7,.2,1) .9s; }
.rw[data-ph="sealed"] .rw-wedsline, .rw[data-ph="knock"] .rw-wedsline { transform: scaleX(0); }
.rw .rw-lantern { animation: rw-swing 3.6s ease-in-out infinite alternate; }
.rw .rw-drop { animation: rw-swing 2.8s ease-in-out infinite alternate; animation-delay: -.7s; }
.rw .rw-swag { animation: rw-lift 4.2s ease-in-out infinite alternate; }
.rw .rw-ripples { stroke-dasharray: 14 10; animation: rw-ripple-run 6s linear infinite; }
.rw .rw-boat { animation: rw-row 24s ease-in-out infinite alternate; }
.rw .rw-float { animation: rw-bob 3.8s ease-in-out infinite alternate; }
.rw .rw-cue { color: ${R.goldPale}; animation: rw-cue 1.8s ease-in-out infinite; }

/* ── The invitation ── */
.rw .rw-lotus { transition: transform 1.2s cubic-bezier(.3,1.4,.5,1); }
.rw .rw-kb { animation: rw-kb 18s ease-in-out infinite alternate; }
.rw .rw-parda { position: absolute; inset: 0; display: flex; pointer-events: none; z-index: 1; }
.rw .rw-parda i { flex: 1; background: repeating-linear-gradient(90deg, ${R.lacquerDeep} 0 6px, ${R.lacquer} 6px 14px, ${R.maroonDeep} 14px 18px); box-shadow: inset 0 -10px 0 -4px ${R.goldLight}; transition: transform 1.5s cubic-bezier(.7,0,.25,1) .15s; transform: translateX(-102%) scaleX(.3); transform-origin: left; }
.rw .rw-parda i + i { transform: translateX(102%) scaleX(.3); transform-origin: right; }
.rw .rw-initial { animation: rw-glow 3.2s ease-in-out infinite; }
.rw .rw-knot path:first-child { stroke-dashoffset: 0; transition: stroke-dashoffset 1.6s ease .5s; }
.rw .rw-knot-heart { transform-box: fill-box; transform-origin: center; animation: rw-beat 1.6s ease-in-out infinite; }
.rw .rw-fam-l, .rw .rw-fam-r { transition: transform 1.1s cubic-bezier(.2,.7,.2,1), opacity .9s ease; }

/* ── The mandala clock ── */
.rw .rw-count-k { font-family: var(--rw-text); font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: ${R.goldLight}; }
.rw .rw-clock { width: min(78cqi, 300px); aspect-ratio: 1; }
.rw .rw-sec { fill: rgba(217,185,108,.22); transition: fill .3s ease; }
.rw .rw-sec-on { fill: ${R.goldLight}; filter: drop-shadow(0 0 3px rgba(255,214,130,.8)); }
.rw .rw-lotus-spin { animation: rw-spin 60s linear infinite; }
.rw .rw-lotus-spin.rw-rev { animation-direction: reverse; animation-duration: 40s; }
.rw .rw-days { font-size: clamp(64px, 20cqi, 92px); animation: rw-pop .6s cubic-bezier(.3,1.5,.5,1) both; }
.rw .rw-unit { min-width: 76px; padding: 10px 8px; border: 1px solid rgba(217,185,108,.4); background: rgba(40,6,10,.25); }
.rw .rw-unit-n { display: block; font-family: var(--rw-display); font-size: 28px; line-height: 1; color: ${R.goldPale}; font-variant-numeric: tabular-nums; animation: rw-tick .5s ease both; }
.rw .rw-unit-l { display: block; margin-top: 6px; font-family: var(--rw-text); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: ${R.onMaroonSoft}; }
.rw .rw-count-diya { position: absolute; bottom: 18px; width: 44px; height: auto; }

/* ── The celebrations: windows whose shutters open ── */
.rw .rw-fn-win { background: radial-gradient(70% 80% at 50% 70%, #FCE6B8, #F1D6A8 70%); overflow: hidden; }
.rw .rw-fn-glow { position: absolute; left: 50%; top: 52%; width: 70%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; background: radial-gradient(circle, rgba(255,214,130,.55), transparent 65%); animation: rw-dglow 2.6s ease-in-out infinite alternate; }
.rw .rw-shut { position: absolute; inset: 0; display: flex; perspective: 600px; }
.rw .rw-shut i { flex: 1; background: radial-gradient(circle at 50% 50%, ${R.goldLight} 1.4px, transparent 1.8px) 0 0 / 14px 14px, linear-gradient(180deg, ${R.lacquer}, ${R.lacquerDeep}); box-shadow: inset 0 0 0 4px ${R.lacquerDeep}, inset 0 0 0 5.5px ${R.goldLight}; transition: transform 1.4s cubic-bezier(.55,.05,.25,1) .25s; transform-origin: left; transform: rotateY(-108deg); }
.rw .rw-shut i + i { transform-origin: right; transform: rotateY(108deg); }
.rw .rw-day { color: ${R.onMaroon}; background: ${R.maroon}; border-radius: 2px; }
.rw .rw-m-haldi { animation: rw-bob-s 2.6s ease-in-out infinite alternate; }
.rw .rw-m-mehendi, .rw .rw-m-lotus { animation: rw-breathe-s 3s ease-in-out infinite alternate; }
.rw .rw-m-sangeet { animation: rw-drum .9s ease-in-out infinite alternate; }
.rw .rw-m-pheras { animation: rw-flicker-s 1.4s ease-in-out infinite alternate; transform-origin: 50% 100%; }
.rw .rw-m-reception { animation: rw-swing-s 3s ease-in-out infinite alternate; transform-origin: 50% 0; }
.rw .rw-m-baraat { animation: rw-trot 1.2s ease-in-out infinite alternate; }
.rw .rw-m-rings { animation: rw-tilt 2.4s ease-in-out infinite alternate; }

/* ── Our story ── */
.rw .rw-thread { --p: 1; }
.rw .rw-thread-line, .rw .rw-thread-fill { position: absolute; left: 21px; top: 12px; bottom: 12px; width: 2px; }
.rw .rw-thread-line { background: ${R.rule}; }
.rw .rw-thread-fill { background: linear-gradient(${R.goldLight}, ${R.vermilion}); transform-origin: top; transform: scaleY(var(--p)); box-shadow: 0 0 8px rgba(255,190,100,.6); }
.rw .rw-step-diya { position: absolute; left: 2px; top: -10px; width: 40px; height: 36px; transition: filter .6s ease, opacity .6s ease; }
.rw[data-anim] .rw-step:not([data-lit]) .rw-step-diya { filter: grayscale(1) brightness(.85); opacity: .55; }
.rw[data-anim] .rw-step:not([data-lit]) .rw-flame, .rw[data-anim] .rw-step:not([data-lit]) .rw-dglow { opacity: 0; }

/* ── Photographs ── */
.rw .rw-shot button { transition: transform .4s ease, box-shadow .4s ease; }
.rw .rw-shot button:hover { transform: translateY(-3px); box-shadow: 0 18px 30px -22px rgba(74,15,19,.7); }

/* ── The reply scroll ── */
.rw .rw-reply-fw { opacity: .85; }
.rw .rw-scroll { position: relative; padding: 18px 0; }
.rw .rw-scroll-paper { position: relative; padding: 34px 22px 38px; background: linear-gradient(90deg, #E9D3A8, #F8EBCF 12%, #FBF2DE 50%, #F8EBCF 88%, #E9D3A8); box-shadow: 0 30px 50px -30px rgba(0,0,0,.7); clip-path: inset(0 0 0 0); transition: clip-path 1.8s cubic-bezier(.6,.05,.3,1) .2s; }
.rw .rw-rod { position: absolute; left: -10px; right: -10px; height: 18px; border-radius: 9px; background: linear-gradient(180deg, #E8C27A, #A8812F 45%, #6E4E16); box-shadow: 0 6px 12px -6px rgba(0,0,0,.6); z-index: 2; }
.rw .rw-rod::before, .rw .rw-rod::after { content: ''; position: absolute; top: -4px; width: 14px; height: 26px; border-radius: 7px; background: radial-gradient(circle at 40% 35%, #FFE6A6, #B8862E 60%, #6E4E16); }
.rw .rw-rod::before { left: -6px; }
.rw .rw-rod::after { right: -6px; }
.rw .rw-rod-top { top: 0; }
.rw .rw-rod-bottom { top: calc(100% - 18px); transition: top 1.8s cubic-bezier(.6,.05,.3,1) .2s; }
.rw .rw-reply-btn { box-shadow: 0 10px 26px -12px rgba(107,26,30,.9); }

/* ── Foot ── */
.rw .rw-boss { transition: transform 1.4s cubic-bezier(.3,1.3,.5,1); }

/* ── Reveals: hidden states only while animating, and only until data-in ── */
.rw[data-anim] [data-rv] { transition: opacity .9s ease calc(var(--k, 0) * 110ms), transform 1.1s cubic-bezier(.2,.7,.2,1) calc(var(--k, 0) * 110ms); }
.rw[data-anim] [data-rv]:not([data-in]) { opacity: 0; transform: translateY(26px); }
.rw .rw-w { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 .05em .12em; margin: 0 -.05em -.12em; }
.rw .rw-w > span { display: inline-block; transition: transform 1s cubic-bezier(.2,.75,.15,1) calc(var(--i) * 70ms + .1s); }
.rw[data-anim] [data-rv]:not([data-in]) .rw-w > span { transform: translateY(110%); }
.rw[data-anim] [data-rv]:not([data-in]) .rw-lotus { transform: scale(.3) rotate(-20deg); }
.rw[data-anim] [data-rv]:not([data-in]) .rw-parda i, .rw[data-anim] .rw-shot:not([data-in]) .rw-parda i { transform: none; }
.rw[data-anim] [data-rv]:not([data-in]) .rw-shut i { transform: none; }
.rw[data-anim] .rw-fam:not([data-in]) { opacity: 1; transform: none; }
.rw[data-anim] .rw-fam:not([data-in]) .rw-fam-l { transform: translateX(-40px); opacity: 0; }
.rw[data-anim] .rw-fam:not([data-in]) .rw-fam-r { transform: translateX(40px); opacity: 0; }
.rw[data-anim] .rw-fam:not([data-in]) .rw-knot path:first-child { stroke-dashoffset: 1; }
.rw[data-anim] [data-rv]:not([data-in]) .rw-bless { opacity: 0; transform: translateY(10px); }
.rw .rw-bless { transition: opacity .8s ease calc(.3s + var(--k) * 140ms), transform .8s ease calc(.3s + var(--k) * 140ms); }
.rw[data-anim] .rw-scroll:not([data-in]) { opacity: 1; transform: none; }
.rw[data-anim] .rw-scroll:not([data-in]) .rw-scroll-paper { clip-path: inset(0 0 100% 0); }
.rw[data-anim] .rw-scroll:not([data-in]) .rw-rod-bottom { top: 18px; }
.rw[data-anim] [data-rv]:not([data-in]) .rw-boss { transform: rotateY(180deg) scale(.6); }
.rw[data-anim] .rw-clock:not([data-in]) { transform: scale(.7) rotate(-30deg); }

@keyframes rw-knock { 0% { transform: none } 40% { transform: scaleY(.5) } 70% { transform: scaleY(1.05) } 100% { transform: none } }
@keyframes rw-thud { 0%, 55% { transform: none } 70% { transform: translateY(1px) } 100% { transform: none } }
@keyframes rw-breathe { 0%, 100% { opacity: .75 } 50% { opacity: 1 } }
@keyframes rw-ripple { from { transform: scale(.6); opacity: .9 } to { transform: scale(2.2); opacity: 0 } }
@keyframes rw-ping { 0% { box-shadow: 0 0 0 0 rgba(255,214,120,.75) } 100% { box-shadow: 0 0 0 26px rgba(255,214,120,0) } }
@keyframes rw-twinkle { 0%, 100% { opacity: .25; transform: scale(.7) } 50% { opacity: 1; transform: scale(1.1) } }
@keyframes rw-fly { from { transform: translateX(-90px) } to { transform: translateX(calc(100cqi + 90px)) } }
@keyframes rw-flap { from { transform: scaleY(1) } to { transform: scaleY(-.4) } }
@keyframes rw-spark { 0%, 15% { opacity: 0; transform: rotate(var(--a)) translateY(0) scaleY(.3) } 17% { opacity: 1 } 42% { opacity: .9; transform: rotate(var(--a)) translateY(var(--s)) scaleY(1) } 60%, 100% { opacity: 0; transform: rotate(var(--a)) translateY(calc(var(--s) * 1.2)) scaleY(.5) } }
@keyframes rw-rocket { 0% { opacity: 0; transform: translateY(150px) } 3% { opacity: .9 } 15% { opacity: .9; transform: translateY(0) } 17%, 100% { opacity: 0; transform: translateY(0) } }
@keyframes rw-core { 0%, 15% { opacity: 0; transform: scale(.2) } 18% { opacity: 1; transform: scale(1) } 34%, 100% { opacity: 0; transform: scale(1.5) } }
@keyframes rw-fall { from { transform: translate(0, -20px) rotate(0) } to { transform: translate(var(--dx), 108cqh) rotate(var(--rot)) } }
@keyframes rw-throw { 0% { opacity: 0; transform: rotate(var(--a)) translateY(0) rotate(0) } 10% { opacity: 1 } 70% { opacity: 1 } 100% { opacity: 0; transform: rotate(var(--a)) translateY(var(--r)) rotate(var(--rot)) } }
@keyframes rw-sway { from { transform: rotate(-4deg) } to { transform: rotate(4deg) } }
@keyframes rw-swing { from { transform: rotate(-3deg) } to { transform: rotate(3deg) } }
@keyframes rw-lift { from { transform: translateY(0) } to { transform: translateY(-1.5px) } }
@keyframes rw-flicker { 0% { transform: scale(1, 1) skewX(0) } 35% { transform: scale(.92, 1.1) skewX(3deg) } 70% { transform: scale(1.05, .94) skewX(-3deg) } 100% { transform: scale(.96, 1.06) skewX(2deg) } }
@keyframes rw-dglow { from { opacity: .7; transform: scale(.92) } to { opacity: 1; transform: scale(1.08) } }
@keyframes rw-ripple-run { to { stroke-dashoffset: -48 } }
@keyframes rw-row { from { transform: translateX(-30px) } to { transform: translateX(230px) } }
@keyframes rw-bob { from { transform: translateY(-1.2px) } to { transform: translateY(1.2px) } }
@keyframes rw-cue { 0%, 100% { transform: translate(-50%, 0); opacity: .6 } 50% { transform: translate(-50%, 6px); opacity: 1 } }
@keyframes rw-glow { 0%, 100% { text-shadow: 0 0 10px rgba(255,200,110,.35) } 50% { text-shadow: 0 0 22px rgba(255,200,110,.85) } }
@keyframes rw-foil { from { background-position: 240% 0 } to { background-position: -40% 0 } }
@keyframes rw-shine { 0% { left: -60% } 55%, 100% { left: 130% } }
@keyframes rw-spin { to { transform: rotate(360deg) } }
@keyframes rw-pop { 0% { opacity: 0; transform: scale(.6) } 100% { opacity: 1; transform: none } }
@keyframes rw-tick { from { opacity: .3; transform: translateY(-6px) } to { opacity: 1; transform: none } }
@keyframes rw-up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
@keyframes rw-kb { from { transform: scale(1.02) } to { transform: scale(1.12) translate(-1.5%, -1%) } }
@keyframes rw-beat { 0%, 100% { transform: scale(1) } 30% { transform: scale(1.25) } 60% { transform: scale(.95) } }
@keyframes rw-bob-s { from { transform: translate(-50%, -3px) } to { transform: translate(-50%, 3px) } }
@keyframes rw-breathe-s { from { transform: translateX(-50%) scale(.96) } to { transform: translateX(-50%) scale(1.06) } }
@keyframes rw-drum { from { transform: translateX(-50%) translateY(0) rotate(-3deg) } to { transform: translateX(-50%) translateY(-4px) rotate(3deg) } }
@keyframes rw-flicker-s { from { transform: translateX(-50%) scale(1, 1) } to { transform: translateX(-50%) scale(.95, 1.07) } }
@keyframes rw-swing-s { from { transform: translateX(-50%) rotate(-5deg) } to { transform: translateX(-50%) rotate(5deg) } }
@keyframes rw-trot { from { transform: translateX(-56%) translateY(0) } to { transform: translateX(-44%) translateY(-3px) } }
@keyframes rw-tilt { from { transform: translateX(-50%) rotate(-8deg) } to { transform: translateX(-50%) rotate(8deg) } }

@media (prefers-reduced-motion: reduce) {
  .rw *, .rw *::before, .rw *::after { animation: none !important; transition: none !important; }
  .rw[data-ph] .rw-scene { transform: none; }
}
`
