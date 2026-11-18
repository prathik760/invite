'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { inOrder } from '@/lib/nameOrder'
import WishesSection from './WishesSection'
import { gloock } from './kit/fonts/gloock'
import { hindMadurai } from './kit/fonts/hindMadurai'
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
import type { InviteTheme } from './kit/theme'
import { BananaPlant, Gopuram, K, KMotifArt, KolamArt, Kuthuvilakku, Thoranam, kMotifFor, kaavi, kolam, rng, strand, templeBorder } from './kalyanam/art'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './kalyanam/parts'
import { Akshata, Bell, KolamClock, Parrots, Shower, Words } from './kalyanam/motion'

/*
 * Kalyanam: a South Indian temple wedding at dawn.
 * The guest stands at a temple entrance as the sun comes up behind the
 * gopuram, its kalasams catching the light one by one; parrots cross the sky,
 * the banana plants and the mango-leaf thoranam stir in the breeze, brass
 * bells hang in the doorway and the kuthuvilakku flames flicker on the step.
 * A kolam draws itself on the threshold and jasmine drifts down over a red
 * silk thirai hung with jasmine strands. A tap rings the bells, parts the
 * strands and the silk, and showers akshata (turmeric rice, jasmine and
 * petals) over the Muhurtham revealed behind them. Below, the invitation
 * unfolds: both families on turning kumkum rings with the mangalyam swinging
 * between them, a kolam clock lighting its dots with the seconds, every
 * function sliding in on its own card, the years of the story filling with
 * turmeric, the photographs wiping into view, and the reply under swaying
 * jasmine with akshata for every guest who sends one.
 *
 * Reveals are CSS, driven by one IntersectionObserver that sets data-in on
 * every [data-rv]. Hidden states only apply under .kl[data-anim], which is set
 * after hydration and never in the builder preview.
 */

const display = `${gloock.style.fontFamily}, Georgia, serif`
const text = `${hindMadurai.style.fontFamily}, 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Nirmala UI', system-ui, sans-serif`

const WISHES_THEME: InviteTheme = {
  bg: K.cream,
  surface: K.paper,
  ink: K.ink,
  muted: K.soft,
  line: K.rule,
  accent: K.red,
  onAccent: K.onRed,
  heading: display,
  body: text,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 38px)', color: K.red },
}

const THRESHOLD = kolam(6, 6, 14, false)
const CHAIN = kolam(1, 5, 9, false)
const FOOT = kolam(4, 4, 12, false)
const HALO = kolam(5, 5, 14, true)

const q = (n: number) => Math.round(n * 100) / 100

function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(4, ...names.flatMap((s) => s.split(/\s+/).map((w) => w.length)))
  return `clamp(${min}px, ${(span / (n * k)).toFixed(2)}cqi, ${max}px)`
}

const first = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** A ring of kumkum dots (viewBox 0 0 size size). */
function DotRing({ size, r, n, dot, color, className }: { size: number; r: number; n: number; dot: number; color: string; className?: string }) {
  const c = size / 2
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        return <circle key={i} cx={q(c + r * Math.cos(a))} cy={q(c + r * Math.sin(a))} r={dot} fill={color} />
      })}
    </svg>
  )
}

/** A little chain kolam laid sideways: the mark over every heading. It draws itself in. */
function ChainMark({ color = K.red, className }: { color?: string; className?: string }) {
  return <KolamArt k={CHAIN} color={color} dot={color} stroke={1.5} className={`kl-drawrv ${className ?? ''}`} style={{ transform: 'rotate(90deg)' }} />
}

function Heading({ children, sub, light }: { children: string; sub?: ReactNode; light?: boolean }) {
  return (
    <div className="text-center" data-rv="">
      <div className="mx-auto flex h-[26px] items-center justify-center">
        <ChainMark color={light ? K.turmericLight : K.kumkum} className="h-[92px] w-[26px]" />
      </div>
      <Words as="h2" text={children} className="mt-3 text-balance leading-[1.08]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 40px)', color: light ? K.onRed : K.red }} />
      {sub && (
        <p className="mx-auto mt-3 max-w-[22rem] text-balance leading-[1.5]" style={{ fontFamily: text, fontSize: 16, color: light ? K.onRedSoft : K.soft }}>
          {sub}
        </p>
      )}
    </div>
  )
}

const btn = 'kl-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold'

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

const MAIN_FN = /muhur|muhurat|kalyanam|thirumanam|wedding|vivah|marriage|mangalya|thaali|thali/i

/** A function on its own card; it slides in from alternate sides, its medallion turning. */
function FunctionCard({ fn, i, couple, data, mainDirections, isPreview }: { fn: Fn; i: number; couple: string; data: Record<string, string>; mainDirections: string | null; isPreview: boolean }) {
  const main = MAIN_FN.test(fn.name)
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const venue = fn.venue || data.venue || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const cal = calendarHref(`${fn.name} · ${couple}`, fn.date, fn.time, place || undefined, main ? 4 : 3)
  const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : mainDirections
  const ink = main ? K.onRed : K.ink
  const soft = main ? K.onRedSoft : K.soft
  const accent = main ? K.turmericLight : K.red
  return (
    <article
      className={`kl-fn relative grid grid-cols-[14px_1fr] overflow-hidden ${main ? 'kl-fn-main' : ''} ${i % 2 ? 'kl-from-r' : 'kl-from-l'}`}
      data-rv=""
      style={{ background: main ? K.red : K.paper, boxShadow: '0 16px 30px -26px rgba(116,24,16,0.8)', border: `1px solid ${main ? K.redDeep : K.rule}` }}
    >
      <span aria-hidden className="kl-stripe" style={kaavi(7, true)} />
      <div className="relative px-5 pb-6 pt-5">
        <div className="flex items-center gap-3">
          <span className="kl-medal relative flex h-[clamp(52px,17cqi,68px)] w-[clamp(52px,17cqi,68px)] shrink-0 items-center justify-center rounded-full" style={{ background: main ? K.paper : K.turmericPale }}>
            {main && <span className="kl-medal-rays" aria-hidden />}
            <DotRing size={68} r={31} n={20} dot={1.3} color={main ? K.turmericLight : K.kumkum} className="kl-spin absolute inset-0 h-full w-full" />
            <KMotifArt kind={kMotifFor(fn.name)} className="kl-motif relative h-[68%] w-[68%]" />
          </span>
          <div className="min-w-0">
            {main && (
              <p className="kl-glowtext text-[13px] font-semibold uppercase" style={{ fontFamily: text, letterSpacing: '0.16em', color: K.turmericLight }}>
                The auspicious hour
              </p>
            )}
            <h3 lang="en" className="leading-[1.1] [hyphens:auto] [overflow-wrap:break-word]" style={{ fontFamily: display, fontSize: fit([fn.name], 38, 0.5, 18, 30), color: main ? K.onRed : K.red }}>
              {fn.name}
            </h3>
          </div>
        </div>
        <div className="mt-4 border-t pt-4" style={{ borderColor: main ? 'rgba(251,239,214,0.25)' : K.hair }}>
          <p className="leading-[1.4]" style={{ fontFamily: text, fontSize: 17, fontWeight: 600, color: ink }}>
            {d ? `${d.weekday}, ${d.day} ${d.month} ${d.year}` : 'Date to follow'}
          </p>
          {t && <p style={{ fontFamily: display, fontSize: 24, color: accent }}>{t}</p>}
          {venue && (
            <p className="mt-1 leading-[1.4]" style={{ fontFamily: text, fontSize: 16, color: ink }}>
              {venue}
            </p>
          )}
          {fn.dress && (
            <p className="mt-2 leading-[1.45]" style={{ fontFamily: text, fontSize: 15, color: soft }}>
              Dress: {fn.dress}
            </p>
          )}
          {(cal || dir) && (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Act href={cal} isPreview={isPreview} className="kl-link inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold" style={{ fontFamily: text, color: accent }}>
                {Icon.calendar}
                Add to calendar
              </Act>
              <Act href={dir} isPreview={isPreview} className="kl-link inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold" style={{ fontFamily: text, color: accent }}>
                {Icon.pin}
                Directions
              </Act>
            </div>
          )}
        </div>
      </div>
      {main && <span className="kl-sheen" aria-hidden />}
    </article>
  )
}

/** The kolam clock: days in the middle, the seconds lighting its ring of dots. Its own component, so only it re-renders each second. */
function Countdown({ date, time }: { date?: string; time?: string }) {
  const c = useCountdown(date, time, true)
  if (!c) return null
  return (
    <section className="kl-count relative mt-16 overflow-hidden" style={{ background: K.red, color: K.onRed }}>
      <div aria-hidden className="kl-border h-[14px]" style={templeBorder(14, K.turmericLight, K.red)} />
      <div className="relative mx-auto max-w-[30rem] px-6 pb-12 pt-10 text-center" style={grain(0.08)}>
        <p className="text-[13px] font-semibold uppercase" style={{ letterSpacing: '0.28em', color: K.turmericLight }} data-rv="">
          Counting down to the Muhurtham
        </p>
        <div className="kl-clock relative mx-auto mt-6" data-rv="">
          <KolamClock lit={c.seconds === 0 ? 60 : c.seconds} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p key={c.days} className="kl-days leading-none" style={{ fontFamily: display, color: K.turmericLight }}>
              {c.days}
            </p>
            <p className="mt-1" style={{ fontFamily: display, fontSize: 'clamp(16px, 4.6cqi, 20px)' }}>
              {c.days === 1 ? 'day' : 'days'} to go
            </p>
          </div>
        </div>
        <div className="mt-7 flex justify-center gap-3" data-rv="">
          {(
            [
              [c.hours, 'Hours'],
              [c.minutes, 'Minutes'],
              [c.seconds, 'Seconds'],
            ] as [number, string][]
          ).map(([n, label]) => (
            <div key={label} className="kl-unit">
              <span key={n} className="kl-unit-n">
                {pad2(n)}
              </span>
              <span className="kl-unit-l">{label}</span>
            </div>
          ))}
        </div>
        <Kuthuvilakku className="kl-count-lamp left-[3%]" />
        <Kuthuvilakku className="kl-count-lamp right-[3%]" />
      </div>
      <div aria-hidden className="kl-border kl-border-rev h-[14px] rotate-180" style={templeBorder(14, K.turmericLight, K.red)} />
    </section>
  )
}

/** The jasmine curtain: strands with their own lengths and bud offsets. */
const STRANDS = (() => {
  const rand = rng(23)
  const n = 17
  return Array.from({ length: n }, (_, i) => {
    const p = (i + 0.5) / n
    return { p, len: 84 + rand() * 14, off: Math.round(rand() * 90), lag: Math.abs(p - 0.5) }
  })
})()

type Phase = 'sealed' | 'part' | 'done'

export default function SignatureKalyanam({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Lakshmi'
  const groom = data.groomName?.trim() || 'Karthik'
  // The couple in the invitation's order: the host's choice, else this design's own (lib/nameOrder.ts).
  const [nameA, nameB] = inOrder(data, 'signature-kalyanam', bride, groom)
  const couple = `${nameA} & ${nameB}`
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const weddingCal = calendarHref(`Muhurtham · ${couple}`, data.date, data.time, place || undefined, 4)
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
  const reply = whatsappHref(data.whatsappNumber, `Vanakkam! This is our reply to the invitation for ${couple}'s wedding: `)
  const rsvpBy = dateParts(data.rsvpBy)
  const hashtag = data.hashtag?.trim()
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null

  const functions = useMemo(() => {
    const list = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'] as const) as Fn[]
    if (list.length > 0 && list.every((f) => dateParts(f.date))) {
      list.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    }
    return list
  }, [data.events])

  const hasFamilies = Boolean(data.brideParents?.trim() || data.groomParents?.trim() || blessings.length || data.message?.trim() || couplePhoto || portraits.bride || portraits.groom)
  const hasGuests = contacts.length > 0 || faq.length > 0
  const nav: NavItem[] = [
    functions.length ? { id: 'kl-functions', label: 'Functions' } : null,
    story.length ? { id: 'kl-story', label: 'Our story' } : null,
    photos.length ? { id: 'kl-photos', label: 'Photos' } : null,
    { id: 'kl-venue', label: 'Venue' },
    hasGuests ? { id: 'kl-guests', label: 'Guests' } : null,
    { id: 'kl-rsvp', label: 'RSVP' },
    eventId ? { id: 'kl-wishes', label: 'Blessings' } : null,
  ].filter(Boolean) as NavItem[]

  /* The thirai: sealed (the sun rises, the kolam draws itself) → part (bells ring, jasmine swings aside, silk gathers, akshata) → done. */
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
  const part = useCallback(() => {
    if (phase !== 'sealed') return
    rootRef.current?.querySelector('audio')?.play().catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('part')
    timers.current.push(window.setTimeout(() => setPhase('done'), 2100))
  }, [phase])

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

  // Akshata for a guest who replies; the key restarts the throw for every tap.
  const [blessed, setBlessed] = useState(0)
  const [showered, setShowered] = useState(false)
  useEffect(() => {
    if (phase !== 'part') return
    setShowered(true)
    const t = window.setTimeout(() => setShowered(false), 3200)
    return () => window.clearTimeout(t)
  }, [phase])

  const lb = useLightbox(photos.length)
  // 0.62: Gloock's widest letters; a low floor so a long surname fits a narrow phone.
  const nameSize = fit([bride, groom], 58, 0.62, 20, 58)
  const music = Boolean(musicSrc(data.musicUrl))

  return (
    <div
      ref={rootRef}
      className="kl relative"
      data-ph={phase}
      data-anim={anim ? '' : undefined}
      style={{ background: K.cream, color: K.ink, fontFamily: text, containerType: 'inline-size', overflowX: 'clip', ['--kl-display' as string]: display }}
    >
      {/* Raw CSS, not a text child: React escapes > and " in text on the server, which
          breaks those rules until hydration and fails hydration on Safari (React #425). */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={K.red} background="rgba(251,244,227,0.92)" border={K.rule} />

      {/* ── The temple entrance at dawn ─────────────────────────────── */}
      <section id="kl-top" className="kl-hero relative flex flex-col overflow-hidden" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <span aria-hidden className="kl-rays" />
        <span aria-hidden className="kl-sun" />
        <Parrots className="kl-parrots-hero" />
        <Gopuram className="relative z-[1] mx-auto mt-[3cqi] block w-[min(46cqi,240px)]" />
        <div aria-hidden className="kl-wall relative z-[2] h-[4.6cqi] max-h-[24px] w-full border-y" style={{ ...kaavi(11), borderColor: K.redDeep }} />

        <div className="relative z-[2] flex flex-1 flex-col" style={{ background: K.stone, ...grain(0.05) }}>
          <BananaPlant className="pointer-events-none absolute -left-[13cqi] -top-[34cqi] z-[3] h-[86%] max-h-[640px]" />
          <BananaPlant flip className="pointer-events-none absolute -right-[13cqi] -top-[34cqi] z-[3] h-[86%] max-h-[640px]" />

          {/* the doorway */}
          <div
            className="relative z-[4] mx-auto mt-[3cqi] flex w-[min(84cqi,30rem)] flex-1 flex-col"
            style={{ border: `3.4cqi solid ${K.stoneDeep}`, borderBottom: 0, boxShadow: `inset 0 0 0 1px ${K.stoneLine}, 0 0 0 1px ${K.stoneLine}` }}
          >
            <div className="relative flex flex-1 flex-col overflow-hidden" style={{ background: K.paper, containerType: 'inline-size' }}>
              <Thoranam className="pointer-events-none absolute inset-x-0 top-0 z-[6] block h-[13cqi] w-full" />
              <Bell className="pointer-events-none absolute left-[5%] top-[7cqi] z-[6] h-[26cqi] w-auto" />
              <Bell className="pointer-events-none absolute right-[5%] top-[7cqi] z-[6] h-[22cqi] w-auto" style={{ animationDelay: '-1.3s' }} />
              <span aria-hidden className="kl-glow" />

              <div className="relative flex flex-1 flex-col items-center justify-center px-[8cqi] pb-[8cqi] pt-[15cqi] text-center">
                <KolamArt k={HALO} color={K.turmeric} dot={K.kumkum} stroke={1.4} className="kl-halo pointer-events-none absolute left-1/2 top-1/2 w-[86%]" />
                {invocation.length > 0 && (
                  <div className="kl-rise relative" style={{ ['--d' as string]: '350ms' }}>
                    {invocation.map((l, i) => (
                      <p key={i} className="leading-[1.45]" style={{ fontFamily: text, fontSize: i === 0 ? 17 : 15, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? K.kumkum : K.soft }}>
                        {l}
                      </p>
                    ))}
                  </div>
                )}

                <h1 className="relative mt-[5cqi]" style={{ fontFamily: display, fontWeight: 400 }}>
                  <span className="kl-rise kl-name block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '500ms' }}>
                    {nameA}
                  </span>
                  <span className="kl-rise kl-amp my-[1.5cqi] block leading-none" style={{ fontSize: 'clamp(26px, 8cqi, 34px)', color: K.turmeric, ['--d' as string]: '620ms' }}>
                    &amp;
                  </span>
                  <span className="kl-rise kl-name block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '740ms' }}>
                    {nameB}
                  </span>
                </h1>

                {/* the Muhurtham, as the hero */}
                <div className="kl-rise relative mt-[5.5cqi] w-full max-w-[20rem]" style={{ ['--d' as string]: '900ms' }}>
                  <div className="kl-muhurtham relative py-3.5">
                    <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.3em', color: K.kumkum }}>
                      <span className="kl-sunmark" aria-hidden />
                      Muhurtham
                    </p>
                    <p className="mt-1.5 leading-[1.25]" style={{ fontFamily: display, fontSize: 'clamp(20px, 6.2cqi, 25px)', color: K.ink }}>
                      {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
                    </p>
                    {time && (
                      <p className="mt-1 leading-none" style={{ fontFamily: display, fontSize: 'clamp(30px, 10cqi, 40px)', color: K.red }}>
                        {time}
                      </p>
                    )}
                  </div>
                </div>
                {venue && (
                  <p className="kl-rise relative mx-auto mt-4 max-w-[18rem] text-balance leading-[1.35]" style={{ fontSize: 17, fontWeight: 600, color: K.ink, ['--d' as string]: '1000ms' }}>
                    {venue}
                    {data.venueAddress && (
                      <span className="mt-0.5 block" style={{ fontSize: 15, fontWeight: 400, color: K.soft }}>
                        {data.venueAddress}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* the thirai and the jasmine, until the guest parts them */}
              {phase !== 'done' && (
                <div className={`kl-curtain absolute inset-0 z-[5] overflow-hidden ${phase === 'part' ? 'is-part' : ''}`} style={{ containerType: 'inline-size' }}>
                  {(['l', 'r'] as const).map((s) => (
                    <div
                      key={s}
                      className={`kl-thirai kl-thirai-${s} absolute bottom-0 top-0 flex flex-col justify-end overflow-hidden`}
                      style={{
                        [s === 'l' ? 'left' : 'right']: 0,
                        width: '50.5%',
                        backgroundColor: K.red,
                        backgroundImage: `repeating-linear-gradient(90deg, rgba(60,4,0,0.26) 0 4px, rgba(255,214,170,0.07) 9px, rgba(60,4,0,0.08) 15px, rgba(60,4,0,0.26) 22px)`,
                        [s === 'l' ? 'borderRight' : 'borderLeft']: `2px solid ${K.turmericLight}`,
                      }}
                    >
                      <span aria-hidden className="kl-silk" />
                      <span aria-hidden className="block h-[3px]" style={{ background: K.turmericLight }} />
                      <span aria-hidden className="kl-border block h-[18px]" style={templeBorder(18, K.turmericLight, K.redDeep)} />
                      <span aria-hidden className="block h-[10px]" style={{ background: K.turmeric }} />
                    </div>
                  ))}
                  {STRANDS.map((st, i) => {
                    const left = st.p < 0.5
                    return (
                      <span
                        key={i}
                        aria-hidden
                        className="kl-strand absolute top-[5cqi] w-[14px]"
                        style={{
                          left: `calc(${(st.p * 100).toFixed(2)}% - 7px)`,
                          height: `${st.len.toFixed(1)}%`,
                          ['--lag' as string]: `${Math.round(st.lag * 380)}ms`,
                          ['--tx' as string]: left ? `${(-st.p * 96 - 6).toFixed(1)}cqi` : `${((1 - st.p) * 96 + 6).toFixed(1)}cqi`,
                          ['--rot' as string]: `${left ? 7 : -7}deg`,
                        }}
                      >
                        <span className="kl-strand-in block h-full w-full" style={{ ...strand(st.off), animationDelay: `-${(i * 0.41).toFixed(2)}s` }} />
                      </span>
                    )
                  })}
                  <div className="kl-seal pointer-events-none absolute inset-x-0 top-[42%] z-[2] px-6 text-center" style={{ color: K.onRed }}>
                    <p className="kl-seal-card inline-block px-5 py-3" style={{ background: 'rgba(116,24,16,0.9)', boxShadow: `0 0 0 1px ${K.turmericLight}` }}>
                      <span className="block leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(24px, 8cqi, 32px)' }}>
                        {couple}
                      </span>
                      {date && (
                        <span className="mt-1 block" style={{ fontSize: 15, color: K.onRedSoft }}>
                          {date.day} {date.month} {date.year}
                        </span>
                      )}
                      <span aria-hidden className="mx-auto my-2.5 block h-px w-12" style={{ background: K.turmericLight }} />
                      <span className="kl-hint inline-flex items-center justify-center gap-2 font-semibold" style={{ fontSize: 15, color: K.turmericPale }}>
                        <span className="kl-tap" aria-hidden />
                        Tap to part the curtain
                      </span>
                    </p>
                  </div>
                  <button type="button" onClick={part} disabled={phase !== 'sealed'} aria-label={`Open ${couple}'s wedding invitation`} className="absolute inset-0 z-[3] cursor-pointer disabled:cursor-default" />
                </div>
              )}
              {showered && <Akshata top="22%" />}
            </div>
          </div>

          <Kuthuvilakku className="pointer-events-none absolute bottom-[-2cqi] left-[3cqi] z-[6] w-[9cqi] max-w-[52px]" />
          <Kuthuvilakku className="pointer-events-none absolute bottom-[-2cqi] right-[3cqi] z-[6] w-[9cqi] max-w-[52px]" />
        </div>

        {/* the threshold, and the kolam drawn on it */}
        <div className="relative z-[5] h-[24cqi] max-h-[140px] border-t" style={{ background: `linear-gradient(180deg, ${K.floor}, ${K.floorDeep})`, borderColor: '#5A1C10' }}>
          <div className="absolute left-1/2 top-[-13cqi] w-[56cqi] max-w-[300px]" style={{ transform: 'translateX(-50%) perspective(480px) rotateX(58deg)', transformOrigin: '50% 50%' }}>
            <KolamArt k={THRESHOLD} draw={!isPreview} stroke={2.6} className="kl-floor block h-auto w-full" />
          </div>
        </div>
        <Shower count={14} seed={5} className="z-[7]" />
      </section>

      {phase === 'done' && (
        <>
          <SectionNav
            items={nav}
            padRight={music && !isPreview ? 104 : 20}
            className="sticky top-0 z-30"
            style={{ background: 'rgba(251,244,227,0.97)', boxShadow: `0 1px 0 ${K.rule}` }}
            linkStyle={{ fontFamily: text, fontSize: 15, fontWeight: 600, color: K.soft }}
            activeColor={K.red}
            underline={K.kumkum}
          />

          {/* ── The invitation: families and blessings ───────────────── */}
          {hasFamilies && (
            <section id="kl-invite" className="mx-auto max-w-[32rem] px-6 pt-14 text-center" style={{ scrollMarginTop: 56 }}>
              {data.message?.trim() && (
                <div data-rv="">
                  <Words as="p" text={data.message} className="mx-auto max-w-[25rem] text-balance leading-[1.55]" style={{ fontSize: 'clamp(18px, 5.4cqi, 21px)', color: K.ink }} />
                </div>
              )}
              {couplePhoto && (
                <figure className="kl-photo mx-auto mt-10 max-w-[24rem] p-[8px]" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}, 0 18px 36px -28px rgba(116,24,16,0.7)` }} data-rv="">
                  <div className="kl-iris relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={couplePhoto} alt={couple} loading="lazy" className="kl-kb h-full w-full object-cover" />
                  </div>
                  <div aria-hidden className="kl-border mt-[8px] h-[12px]" style={templeBorder(12, K.turmericLight, K.red)} />
                </figure>
              )}
              {(data.brideParents?.trim() || data.groomParents?.trim() || portraits.bride || portraits.groom) && (
                <div className="kl-fam relative mt-12 grid items-start gap-x-4 gap-y-10" data-rv="">
                  <svg viewBox="0 0 120 70" className="kl-thali pointer-events-none absolute left-1/2 top-[18px] z-[2] w-[24%] -translate-x-1/2" aria-hidden>
                    <path d="M4 8C34 46 86 46 116 8" fill="none" stroke={K.turmeric} strokeWidth={1.8} strokeLinecap="round" pathLength={1} />
                    <g className="kl-pendant">
                      <path d="M60 41V47" stroke={K.brassDark} strokeWidth={1} />
                      <path d="M60 47C66 47 69 52 66 58C64 62 62 64 60 66C58 64 56 62 54 58C51 52 54 47 60 47Z" fill={K.brassLight} stroke={K.brassDark} strokeWidth={0.8} />
                      <circle cx={60} cy={55} r={2.6} fill={K.kumkum} />
                    </g>
                  </svg>
                  {inOrder(
                    data,
                    'signature-kalyanam',
                    { name: bride, parents: data.brideParents?.trim(), photo: portraits.bride },
                    { name: groom, parents: data.groomParents?.trim(), photo: portraits.groom },
                  ).map((p, i) => ({ ...p, side: i ? 'r' : 'l' })).map((p) => (
                    <div key={p.name} className={`kl-fam-${p.side}`}>
                      <span className="relative mx-auto block h-[132px] w-[132px]">
                        <DotRing size={132} r={62} n={28} dot={1.8} color={K.kumkum} className="kl-spin absolute inset-0" />
                        <span className="absolute inset-[10px] flex items-center justify-center overflow-hidden rounded-full" style={{ background: K.turmericPale, boxShadow: `0 0 0 1px ${K.turmeric}` }}>
                          {p.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.photo} alt={p.name} loading="lazy" className="kl-kb h-full w-full object-cover" />
                          ) : (
                            <span className="kl-initial" style={{ fontFamily: display, fontSize: 50, color: K.red }}>
                              {first(p.name)}
                            </span>
                          )}
                        </span>
                      </span>
                      <p className="mt-4 leading-[1.1]" style={{ fontFamily: display, fontSize: 28, color: K.red }}>
                        {p.name}
                      </p>
                      {p.parents && (
                        <p className="mx-auto mt-2 max-w-[15rem] text-balance leading-[1.5]" style={{ fontSize: 15.5, color: K.soft }}>
                          {p.parents}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {blessings.length > 0 && (
                <div className="relative mx-auto mt-12 max-w-[24rem] px-5 py-7" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }} data-rv="">
                  <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.22em', color: K.kumkum }}>
                    With the blessings of
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {blessings.map((b, i) => (
                      <li key={`${b}-${i}`} className="kl-bless text-balance leading-[1.4]" style={{ fontFamily: display, fontSize: 19, color: K.ink, '--k': i } as CSSProperties}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <Countdown date={data.date} time={data.time} />

          {/* ── The functions ─────────────────────────────────────────── */}
          {functions.length > 0 && (
            <section id="kl-functions" className="mx-auto max-w-[32rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Heading sub="Your presence is requested at each of the functions">The Functions</Heading>
              <div className="kl-fns mt-9 grid gap-4">
                {functions.map((fn, i) => (
                  <FunctionCard key={`${fn.name}-${i}`} fn={fn} i={i} couple={couple} data={data} mainDirections={directions} isPreview={isPreview} />
                ))}
              </div>
            </section>
          )}

          {/* ── Our story ─────────────────────────────────────────────── */}
          {story.length > 0 && (
            <section id="kl-story" className="mx-auto max-w-[30rem] px-6 pt-16 text-center" style={{ scrollMarginTop: 56 }}>
              <Heading>Our Story</Heading>
              <ol className="mt-8">
                {story.map((s, i) => (
                  <li key={`${s.title}-${i}`} data-rv="">
                    {i > 0 && (
                      <span aria-hidden className="mx-auto my-6 flex w-[40px] justify-between">
                        {[0, 1, 2].map((j) => (
                          <span key={j} className="kl-pip h-[5px] w-[5px] rounded-full" style={{ background: K.turmeric, '--k': j } as CSSProperties} />
                        ))}
                      </span>
                    )}
                    {s.when && (
                      <p className="kl-year leading-none" style={{ fontFamily: display, fontSize: 44 }}>
                        {s.when}
                      </p>
                    )}
                    <h3 className="mt-2 text-balance leading-[1.2]" style={{ fontFamily: display, fontSize: 23, color: K.red }}>
                      {s.title}
                    </h3>
                    {s.text && (
                      <p className="mx-auto mt-2 max-w-[22rem] text-balance leading-[1.6]" style={{ fontSize: 16, color: K.soft }}>
                        {s.text}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* ── Photographs ──────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section id="kl-photos" className="mx-auto max-w-[34rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Heading>Moments</Heading>
              <div className="mt-9 grid grid-cols-6 gap-2.5">
                {photos.map((src, i) => {
                  const last = i === photos.length - 1
                  // the last photo takes the whole row when it would otherwise sit alone
                  const shape = last && (i % 5 === 1 || i % 5 === 3) ? 'col-span-6 aspect-[3/2]' : ['col-span-6 aspect-[3/2]', 'col-span-3 aspect-[3/4]', 'col-span-3 aspect-[3/4]', 'col-span-4 aspect-square', 'col-span-2 aspect-[1/2]'][i % 5]
                  return (
                    <div key={`${src}-${i}`} className={`kl-shot kl-wipe-${i % 4} ${shape.split(' ')[0]}`} data-rv="" style={{ '--k': i % 2 } as CSSProperties}>
                      <button
                        type="button"
                        onClick={() => !isPreview && lb.setOpen(i)}
                        aria-label={`View photo ${i + 1} of ${photos.length}`}
                        className={`block w-full overflow-hidden ${shape.split(' ')[1]}`}
                        style={{ boxShadow: `0 0 0 1px ${K.rule}`, cursor: isPreview ? 'default' : 'zoom-in', background: K.stone }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className="kl-kb h-full w-full object-cover" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Venue, travel and stay ───────────────────────────────── */}
          <section id="kl-venue" className="mx-auto max-w-[32rem] px-6 pt-16 text-center" style={{ scrollMarginTop: 56 }}>
            <Heading>The Mandapam</Heading>
            <div className="relative mx-auto mt-8 max-w-[24rem] overflow-hidden px-6 pb-8 pt-7" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }} data-rv="">
              <span aria-hidden className="kl-venue-sun" />
              <Parrots className="kl-parrots-venue" />
              <Gopuram className="relative mx-auto block w-[120px]" />
              <div aria-hidden className="relative mx-auto h-[8px] w-[150px]" style={kaavi(5)} />
              <h3 className="relative mx-auto mt-5 max-w-[20rem] text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(27px, 8cqi, 34px)', color: K.red }}>
                {venue || 'Venue to be announced'}
              </h3>
              {data.venueAddress && (
                <p className="mx-auto mt-2 max-w-[18rem] text-balance leading-[1.5]" style={{ fontSize: 16, color: K.soft }}>
                  {data.venueAddress}
                </p>
              )}
              <p className="mt-3" style={{ fontSize: 16, fontWeight: 600, color: K.ink }}>
                {date ? date.long : 'Date to be announced'}
                {time && ` · ${time}`}
              </p>
              {data.dressCode?.trim() && (
                <p className="mt-3" style={{ fontSize: 16, color: K.soft }}>
                  Dress: <span style={{ color: K.ink, fontWeight: 600 }}>{data.dressCode}</span>
                </p>
              )}
              <div className="mx-auto mt-6 flex max-w-[18rem] flex-col gap-3">
                <Act href={directions} isPreview={isPreview} className={`${btn} kl-shine hover:bg-[#861C13]`} style={{ background: K.red, color: K.onRed }}>
                  {Icon.pin}
                  Get directions
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} hover:bg-[rgba(158,34,24,0.05)]`} style={{ boxShadow: `inset 0 0 0 1px ${K.red}`, color: K.red }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
              </div>
            </div>
            {travel.length > 0 && (
              <div className="kl-travel mx-auto mt-8 max-w-[24rem] overflow-hidden text-left" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }} data-rv="">
                <div className="kl-leafbar relative overflow-hidden px-6 py-3" style={{ background: K.leaf, color: '#F4F1DC' }}>
                  <h3 className="relative" style={{ fontFamily: display, fontSize: 22 }}>
                    Travel &amp; stay
                  </h3>
                </div>
                <div className="space-y-3 px-6 py-5">
                  {travel.map((p, i) => (
                    <p key={i} className="leading-[1.65]" style={{ fontSize: 16, color: K.ink }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── For our guests ────────────────────────────────────────── */}
          {hasGuests && (
            <section id="kl-guests" className="mx-auto max-w-[32rem] px-6 pt-16" style={{ scrollMarginTop: 56 }}>
              <Heading>For Our Guests</Heading>
              {contacts.length > 0 && (
                <div className="mt-8 space-y-3">
                  {contacts.map((c, i) => {
                    const [who, ...role] = c.name.split(/\s+[—–-]\s+|\s*,\s+/)
                    const tel = telHref(c.phone)
                    const wa = whatsappHref(c.phone, `Vanakkam ${who.split(' ')[0]}, I'm a guest at ${couple}'s wedding. `)
                    return (
                      <div key={`${c.name}-${i}`} className="kl-contact grid grid-cols-[6px_1fr] overflow-hidden" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}`, '--k': i } as CSSProperties} data-rv="">
                        <span aria-hidden className="kl-stripe" style={{ background: K.turmeric }} />
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5">
                          <div className="min-w-0">
                            <p style={{ fontFamily: display, fontSize: 19, color: K.ink }}>{who}</p>
                            {role.length > 0 && <p style={{ fontSize: 15, color: K.soft }}>{cap(role.join(', '))}</p>}
                          </div>
                          {(tel || wa) && (
                            <div className="flex gap-2">
                              <Act href={tel} external={false} isPreview={isPreview} label={`Call ${who}`} className={`${btn} !px-4 !py-2.5 hover:bg-[rgba(158,34,24,0.05)]`} style={{ boxShadow: `inset 0 0 0 1px ${K.rule}`, color: K.red }}>
                                {Icon.phone}
                                Call
                              </Act>
                              <Act href={wa} isPreview={isPreview} label={`WhatsApp ${who}`} className={`${btn} !px-4 !py-2.5 hover:bg-[rgba(158,34,24,0.05)]`} style={{ boxShadow: `inset 0 0 0 1px ${K.rule}`, color: K.red }}>
                                {Icon.whatsapp}
                                WhatsApp
                              </Act>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {faq.length > 0 && (
                <div className="mt-10" data-rv="">
                  <h3 className="text-center" style={{ fontFamily: display, fontSize: 22, color: K.red }}>
                    You may be wondering
                  </h3>
                  <div className="mt-4">
                    {faq.map((f, i) => (
                      <details key={`${f.q}-${i}`} className="border-b" style={{ borderColor: K.rule }}>
                        <summary className="flex items-start justify-between gap-4 py-4">
                          <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, color: K.ink }}>{f.q}</span>
                          <svg viewBox="0 0 20 20" className="kl-plus mt-1 h-4 w-4 shrink-0" fill="none" stroke={K.kumkum} strokeWidth={1.8} aria-hidden>
                            <path d="M10 3v14M3 10h14" strokeLinecap="round" />
                          </svg>
                        </summary>
                        {f.a && (
                          <p className="kl-answer pb-5 pr-8 leading-[1.6]" style={{ fontSize: 16, color: K.soft }}>
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

          {/* ── Reply, under jasmine ─────────────────────────────────── */}
          <section id="kl-rsvp" className="kl-reply relative mt-20 overflow-hidden text-center" style={{ background: K.red, color: K.onRed, scrollMarginTop: 56 }}>
            <div aria-hidden className="kl-border h-[16px]" style={templeBorder(16, K.turmericLight, K.redDeep)} />
            <div aria-hidden className="kl-garland">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="kl-garland-strand" style={{ left: `${4 + i * 11.5}%`, height: `${[46, 70, 54, 84, 60, 84, 54, 70, 46][i]}px`, animationDelay: `-${(i * 0.53).toFixed(2)}s` }}>
                  <span className="block h-full w-full" style={strand((i * 37) % 90)} />
                </span>
              ))}
            </div>
            <Shower count={10} seed={31} />
            <div className="relative mx-auto max-w-[30rem] px-6 pb-16 pt-24" style={grain(0.08)} data-rv="">
              {reply ? (
                <Heading light sub={rsvpBy ? `Kindly reply by ${rsvpBy.weekday}, ${rsvpBy.day} ${rsvpBy.month}` : 'Kindly let the family know if you can come'}>
                  Will you be there?
                </Heading>
              ) : (
                <Heading light>Save the Date</Heading>
              )}
              <p className="mt-6 text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.3em', color: K.turmericLight }}>
                Muhurtham
              </p>
              <p className="mt-1" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)' }}>
                {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
                {time && ` · ${time}`}
              </p>
              {venue && (
                <p className="mt-1 text-balance" style={{ fontSize: 16, color: K.onRedSoft }}>
                  {venue}
                </p>
              )}
              {!reply && rsvpBy && (
                <p className="mt-3" style={{ fontSize: 16, color: K.onRedSoft }}>
                  Kindly reply by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}
                </p>
              )}
              <div className="relative mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                <Act href={reply} isPreview={isPreview} className={`${btn} kl-shine kl-reply-btn hover:bg-[#F2CB66]`} style={{ background: K.turmericLight, color: K.redDeep }}>
                  <span className="contents" onClick={() => setBlessed((n) => n + 1)}>
                    {Icon.whatsapp}
                    Reply on WhatsApp
                  </span>
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} hover:bg-[rgba(251,239,214,0.08)]`} style={{ boxShadow: 'inset 0 0 0 1px rgba(237,190,78,0.7)', color: K.onRed }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
                {blessed > 0 && <Akshata key={blessed} count={34} seed={blessed + 40} top="0" />}
              </div>
              {live && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: 'rgba(237,190,78,0.3)' }}>
                  <p style={{ fontFamily: display, fontSize: 21 }}>Watching from far away?</p>
                  <p className="mt-1" style={{ fontSize: 15, color: K.onRedSoft }}>
                    The Muhurtham will be streamed live for family abroad.
                  </p>
                  <Act href={live} isPreview={isPreview} className={`${btn} mt-4 hover:bg-[rgba(251,239,214,0.08)]`} style={{ boxShadow: 'inset 0 0 0 1px rgba(237,190,78,0.7)', color: K.onRed }}>
                    {Icon.play}
                    Watch live
                  </Act>
                </div>
              )}
              {hashtag && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: 'rgba(237,190,78,0.3)' }}>
                  <p style={{ fontSize: 15, color: K.onRedSoft }}>Share your photos with</p>
                  <p className="kl-foil mt-1 break-words" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)' }}>
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                  </p>
                </div>
              )}
              <Kuthuvilakku className="kl-reply-lamp left-[2%]" />
              <Kuthuvilakku className="kl-reply-lamp right-[2%]" />
            </div>
            <div aria-hidden className="kl-border kl-border-rev h-[16px] rotate-180" style={templeBorder(16, K.turmericLight, K.redDeep)} />
          </section>

          {eventId && (
            <div id="kl-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection eventId={eventId} theme={WISHES_THEME} title="Blessings" intro={`Leave a few words for ${nameA} and ${nameB}. Your blessing appears here for every guest.`} noun="blessing" />
            </div>
          )}

          <footer className="relative overflow-hidden px-6 pb-10 pt-12 text-center">
            <Shower count={7} seed={47} />
            <div className="relative" data-rv="">
              <KolamArt k={FOOT} color={K.red} dot={K.red} stroke={1.6} className="kl-drawrv mx-auto block w-[88px]" />
              <p className="mt-4" style={{ fontFamily: display, fontSize: 22, color: K.red }}>
                {couple}
              </p>
              {date && (
                <p className="mt-1 text-[13px] font-semibold uppercase tabular-nums" style={{ letterSpacing: '0.26em', color: K.turmeric }}>
                  {date.day} · {date.monthShort} · {date.year}
                </p>
              )}
            </div>
            <div className="relative mt-8">
              <Credit isPreview={isPreview} color={K.faint} linkColor={K.soft} />
            </div>
          </footer>

          {lb.open !== null && <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(34,10,6,0.96)" color={K.onRed} font={text} />}
        </>
      )}
    </div>
  )
}

/* Scoped to .kl. Colours are the palette's constants: no user data reaches this string. */
const CSS = `
.kl .kl-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: kl-draw 2.6s cubic-bezier(.45,.1,.35,1) forwards; }
.kl .kl-link { text-decoration: underline; text-decoration-color: currentColor; text-decoration-thickness: 1px; text-underline-offset: 5px; }
.kl .kl-btn { position: relative; overflow: hidden; transition: background-color .2s ease, color .2s ease, transform .2s ease; }
.kl .kl-btn:active { transform: scale(.98); }
.kl .kl-shine::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%; transform: skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,246,214,.5), transparent); animation: kl-shine 3.6s ease-in-out infinite; pointer-events: none; }
.kl .kl-glowtext { animation: kl-glow 3s ease-in-out infinite; }
.kl .kl-foil { background: linear-gradient(100deg, ${K.turmeric}, ${K.turmericPale} 45%, #FFFFFF 52%, ${K.turmericLight} 62%, ${K.turmeric}); background-size: 240% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${K.turmericLight}; animation: kl-foil 5s linear infinite; }
.kl details > summary { list-style: none; cursor: pointer; }
.kl details > summary::-webkit-details-marker { display: none; }
.kl details .kl-plus { transition: transform .3s ease; }
.kl details[open] .kl-plus { transform: rotate(135deg); }
.kl details[open] .kl-answer { animation: kl-up .45s ease both; }
.kl .kl-fam { grid-template-columns: 1fr; }
@container (min-width: 340px) { .kl .kl-fam { grid-template-columns: 1fr 1fr; } }
@container (max-width: 339px) { .kl .kl-thali { display: none; } }
@container (min-width: 640px) { .kl .kl-fns { grid-template-columns: 1fr 1fr; } }

/* ── Dawn over the temple ── */
.kl .kl-hero { background: linear-gradient(180deg, #F3B57A 0%, #F6D49A 18%, #F9E4BD 34%, #FBEFD8 46%); }
.kl .kl-sun { position: absolute; left: 50%; top: 6cqi; width: 50cqi; max-width: 260px; aspect-ratio: 1; translate: -50% 0; border-radius: 50%; background: radial-gradient(circle at 50% 45%, #FFE6A3, #F7C978 55%, #F2B45E); box-shadow: 0 0 60px 20px rgba(255,200,110,.45); opacity: .9; animation: kl-sunrise 3.4s cubic-bezier(.2,.7,.2,1) both, kl-sunpulse 4.5s ease-in-out 3.4s infinite alternate; }
.kl .kl-rays { position: absolute; left: 50%; top: calc(6cqi + min(25cqi, 130px)); width: 170cqi; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255,226,150,.38) 0deg 6deg, transparent 6deg 18deg); -webkit-mask-image: radial-gradient(circle, #000 12%, transparent 46%); mask-image: radial-gradient(circle, #000 12%, transparent 46%); animation: kl-spin 40s linear infinite, kl-fade 2.6s ease 1s both; pointer-events: none; }
.kl .kl-glint { opacity: 0; animation: kl-glint 4s ease-in-out infinite; }
.kl .kl-crown { animation: kl-crown 5s ease-in-out infinite alternate; }
.kl .kl-sway { animation: kl-sway 3.2s ease-in-out infinite alternate; }
.kl .kl-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: kl-flicker 1.2s ease-in-out infinite alternate; }
.kl .kl-lglow { transform-box: fill-box; transform-origin: center; animation: kl-lglow 2s ease-in-out infinite alternate; }
.kl .kl-parrots { position: absolute; left: 0; z-index: 1; width: 80px; height: 60px; animation: kl-fly 22s linear infinite; pointer-events: none; }
.kl .kl-parrots svg { position: absolute; height: auto; overflow: visible; }
.kl .kl-wing { transform-box: fill-box; transform-origin: 30% 100%; animation: kl-flap .28s ease-in-out infinite alternate; }
.kl .kl-parrots-hero { top: 4cqi; animation-delay: -3s; }
.kl .kl-parrots-venue { top: 10px; animation-duration: 16s; }
.kl .kl-bell { transform-origin: 50% 0; animation: kl-bellsway 3s ease-in-out infinite alternate; }
.kl .kl-clapper { transform-box: fill-box; transform-origin: 50% 0; animation: kl-bellsway 1.5s ease-in-out infinite alternate-reverse; }
.kl[data-ph="part"] .kl-bell { animation: kl-ring .3s ease-in-out 6 alternate; }
.kl .kl-glow { position: absolute; inset: 0; z-index: 4; pointer-events: none; background: radial-gradient(60% 50% at 50% 45%, rgba(255,240,200,.9), rgba(255,214,140,.4) 45%, transparent 75%); opacity: 0; }
.kl[data-ph="part"] .kl-glow { animation: kl-flash 2s ease both; }
.kl .kl-strand { transition: transform 1.35s cubic-bezier(.5,.05,.25,1) var(--lag), opacity .6s ease calc(var(--lag) + .9s); transform-origin: 50% 0; }
.kl .kl-strand-in { transform-origin: 50% 0; animation: kl-strand 3.4s ease-in-out infinite alternate; }
.kl .kl-thirai { transition: transform 1.3s cubic-bezier(.55,.05,.25,1) .15s, opacity .5s ease 1.2s; }
.kl .kl-thirai-l { transform-origin: 0 50%; }
.kl .kl-thirai-r { transform-origin: 100% 50%; }
.kl .kl-silk { position: absolute; top: 0; bottom: 0; width: 45%; left: -60%; transform: skewX(-12deg); background: linear-gradient(90deg, transparent, rgba(255,214,170,.22), transparent); animation: kl-silk 5s ease-in-out infinite; }
.kl .kl-thirai-r .kl-silk { animation-delay: -2.5s; }
.kl .kl-curtain.is-part .kl-thirai { transform: scaleX(.12); opacity: 0; }
.kl .kl-curtain.is-part .kl-strand { transform: translateX(var(--tx)) rotate(var(--rot)); opacity: 0; }
.kl .kl-curtain.is-part .kl-seal { opacity: 0; transform: scale(.9); }
.kl .kl-seal { transition: opacity .35s ease, transform .35s ease; }
.kl .kl-seal-card { animation: kl-float 4s ease-in-out infinite alternate; }
.kl .kl-hint { animation: kl-breathe 2.6s ease-in-out infinite 2.6s; }
.kl .kl-tap { position: relative; width: 9px; height: 9px; border-radius: 50%; background: ${K.turmericPale}; }
.kl .kl-tap::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1.5px solid ${K.turmericPale}; animation: kl-ripple 1.8s ease-out infinite; }
.kl .kl-rise { transition: opacity .9s ease var(--d, 0ms), transform 1.1s cubic-bezier(.2,.7,.2,1) var(--d, 0ms), filter 1.1s ease var(--d, 0ms); }
.kl[data-ph="sealed"] .kl-rise { opacity: 0; transform: translateY(14px); filter: blur(5px); }
.kl .kl-name { background: linear-gradient(100deg, ${K.red} 0%, ${K.red} 40%, ${K.turmeric} 50%, ${K.red} 60%, ${K.red} 100%); background-size: 280% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${K.red}; animation: kl-foil 6s linear infinite; }
.kl .kl-amp { display: inline-block; animation: kl-pulse 2.8s ease-in-out infinite; }
.kl .kl-halo { translate: -50% -50%; opacity: .1; animation: kl-spin 90s linear infinite; }
.kl .kl-muhurtham { border-top: 1px solid ${K.rule}; border-bottom: 1px solid ${K.rule}; }
.kl .kl-muhurtham::before, .kl .kl-muhurtham::after { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${K.turmeric}, transparent); background-size: 50% 100%; background-repeat: no-repeat; animation: kl-run 3.4s ease-in-out infinite; }
.kl .kl-muhurtham::before { top: -1px; }
.kl .kl-muhurtham::after { bottom: -1px; animation-delay: -1.7s; }
.kl .kl-sunmark { display: inline-block; width: 11px; height: 11px; margin-right: 8px; border-radius: 50%; background: ${K.turmericLight}; box-shadow: 0 0 0 3px rgba(237,190,78,.3); vertical-align: -1px; animation: kl-pulse 2.4s ease-in-out infinite; }
.kl .kl-floor { filter: drop-shadow(0 0 4px rgba(255,250,235,.4)); }

/* ── Falling jasmine and petals; the akshata ── */
.kl .kl-shower { position: absolute; inset: 0; pointer-events: none; overflow: hidden; container-type: size; }
.kl .kl-bit { position: absolute; top: -4%; opacity: .92; animation-name: kl-fall; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
.kl .kl-bit-0 { border-radius: 50% 50% 45% 45% / 65% 65% 35% 35%; background: radial-gradient(circle at 40% 30%, #FFFFFF, #F1EAD4 70%); box-shadow: 0 0 0 .5px rgba(160,140,100,.4); }
.kl .kl-bit-1 { border-radius: 85% 0 85% 0; background: radial-gradient(circle at 30% 30%, #FFC24D, #E2720F 70%); }
.kl .kl-bit-2 { border-radius: 85% 0 85% 0; background: radial-gradient(circle at 30% 30%, #F27C93, #C0284B 70%); }
.kl .kl-akshata { position: absolute; left: 50%; z-index: 9; pointer-events: none; }
.kl .kl-ak { position: absolute; opacity: 0; animation-name: kl-throw; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-fill-mode: both; }
.kl .kl-ak-0, .kl .kl-ak-1 { width: 3.4px; height: 7px; border-radius: 50%; background: linear-gradient(${K.turmericLight}, ${K.turmeric}); }
.kl .kl-ak-2 { width: 7px; height: 11px; border-radius: 50% 50% 45% 45% / 65% 65% 35% 35%; background: #FFFDF4; box-shadow: 0 0 0 .5px rgba(160,140,100,.5); }
.kl .kl-ak-3 { width: 10px; height: 12px; border-radius: 85% 0 85% 0; background: radial-gradient(circle at 30% 30%, #F27C93, #C0284B 70%); }

/* ── The invitation ── */
.kl .kl-kb { animation: kl-kb 18s ease-in-out infinite alternate; }
.kl .kl-iris { clip-path: circle(75% at 50% 50%); transition: clip-path 1.6s cubic-bezier(.65,0,.25,1) .1s; }
.kl .kl-spin { animation: kl-spin 30s linear infinite; }
.kl .kl-pendant { transform-box: fill-box; transform-origin: 50% 0; animation: kl-pendant 2.6s ease-in-out infinite alternate; }
.kl .kl-thali path:first-child { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 1.6s ease .5s; }
.kl .kl-fam-l, .kl .kl-fam-r { transition: transform 1.1s cubic-bezier(.2,.7,.2,1), opacity .9s ease; }
.kl .kl-initial { animation: kl-pulse 3s ease-in-out infinite; display: inline-block; }
.kl .kl-bless { transition: opacity .8s ease calc(.3s + var(--k) * 140ms), transform .8s ease calc(.3s + var(--k) * 140ms); }
.kl .kl-border { animation: kl-border 40s linear infinite; }
.kl .kl-border-rev { animation-direction: reverse; }

/* ── The kolam clock ── */
.kl .kl-clock { width: min(76cqi, 290px); aspect-ratio: 1; }
.kl .kl-dot { fill: rgba(255,246,226,.25); transition: fill .3s ease; }
.kl .kl-dot-on { fill: #FFF6E2; filter: drop-shadow(0 0 3px rgba(255,236,190,.9)); }
.kl .kl-loops { animation: kl-spin 70s linear infinite; }
.kl .kl-loops.kl-rev { animation-direction: reverse; animation-duration: 45s; }
.kl .kl-days { font-size: clamp(60px, 19cqi, 88px); animation: kl-pop .6s cubic-bezier(.3,1.5,.5,1) both; }
.kl .kl-unit { min-width: 76px; padding: 10px 8px; border: 1px solid rgba(237,190,78,.45); background: rgba(60,8,4,.22); }
.kl .kl-unit-n { display: block; font-family: var(--kl-display); font-size: 28px; line-height: 1; color: ${K.turmericPale}; font-variant-numeric: tabular-nums; animation: kl-tick .5s ease both; }
.kl .kl-unit-l { display: block; margin-top: 6px; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: ${K.onRedSoft}; }
.kl .kl-count-lamp { position: absolute; bottom: 14px; width: 30px; height: auto; }

/* ── The functions ── */
.kl .kl-stripe { transform-origin: top; transition: transform 1.2s cubic-bezier(.2,.7,.2,1) .2s; }
.kl .kl-motif { animation: kl-bob 2.6s ease-in-out infinite alternate; }
.kl .kl-medal-rays { position: absolute; inset: -40%; border-radius: 50%; background: repeating-conic-gradient(rgba(255,226,150,.35) 0deg 8deg, transparent 8deg 20deg); -webkit-mask-image: radial-gradient(circle, #000 30%, transparent 70%); mask-image: radial-gradient(circle, #000 30%, transparent 70%); animation: kl-spin 18s linear infinite; }
.kl .kl-sheen { position: absolute; top: 0; bottom: 0; width: 35%; left: -50%; transform: skewX(-18deg); background: linear-gradient(90deg, transparent, rgba(255,226,170,.18), transparent); animation: kl-shine 5s ease-in-out infinite; pointer-events: none; }

/* ── Story, photographs, venue ── */
.kl .kl-year { -webkit-text-stroke: 1.2px ${K.turmeric}; color: transparent; background: linear-gradient(${K.turmericLight}, ${K.turmeric}) no-repeat; background-size: 100% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; transition: background-size 1.6s cubic-bezier(.45,.1,.3,1) .3s; }
.kl .kl-pip { transition: transform .5s cubic-bezier(.3,1.6,.5,1) calc(var(--k) * 150ms); }
.kl .kl-shot { transition: clip-path 1.2s cubic-bezier(.65,0,.25,1) calc(var(--k) * 120ms) !important; clip-path: inset(0 0 0 0); }
.kl .kl-shot button { transition: transform .4s ease, box-shadow .4s ease; }
.kl .kl-shot button:hover { transform: translateY(-3px); }
.kl .kl-venue-sun { position: absolute; left: 50%; top: 18px; width: 110px; aspect-ratio: 1; translate: -50% 0; border-radius: 50%; background: radial-gradient(circle, #FFE3A0, #F7C978 60%, rgba(247,201,120,0) 72%); animation: kl-sunpulse 4.5s ease-in-out infinite alternate; }
.kl .kl-leafbar::after { content: ''; position: absolute; top: 0; bottom: 0; width: 30%; left: -40%; transform: skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(220,240,180,.25), transparent); animation: kl-shine 4.4s ease-in-out infinite; }

/* ── Reply ── */
.kl .kl-garland { position: absolute; left: 0; right: 0; top: 16px; height: 90px; pointer-events: none; }
.kl .kl-garland-strand { position: absolute; top: 0; width: 14px; transform-origin: 50% 0; animation: kl-strand 3s ease-in-out infinite alternate; }
.kl .kl-reply-btn { box-shadow: 0 12px 28px -14px rgba(237,190,78,.9); }
.kl .kl-reply .kl-akshata { left: 50%; }
.kl .kl-reply-lamp { position: absolute; bottom: 22px; width: 34px; height: auto; display: none; }
@container (min-width: 520px) { .kl .kl-reply-lamp { display: block; } }

/* ── Reveals: hidden states only while animating, and only until data-in ── */
.kl[data-anim] [data-rv] { transition: opacity .9s ease calc(var(--k, 0) * 110ms), transform 1.1s cubic-bezier(.2,.7,.2,1) calc(var(--k, 0) * 110ms); }
.kl[data-anim] [data-rv]:not([data-in]) { opacity: 0; transform: translateY(24px); }
.kl .kl-w { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 .05em .12em; margin: 0 -.05em -.12em; }
.kl .kl-w > span { display: inline-block; transition: transform 1s cubic-bezier(.2,.75,.15,1) calc(var(--i) * 70ms + .1s); }
.kl[data-anim] [data-rv]:not([data-in]) .kl-w > span { transform: translateY(110%); }
.kl .kl-drawrv path { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 2.2s cubic-bezier(.45,.1,.35,1) .2s; }
.kl[data-anim] [data-rv]:not([data-in]) .kl-drawrv path { stroke-dashoffset: 1; }
.kl[data-anim] .kl-fn.kl-from-l:not([data-in]) { transform: translateX(-46px); }
.kl[data-anim] .kl-fn.kl-from-r:not([data-in]) { transform: translateX(46px); }
.kl[data-anim] .kl-fn:not([data-in]) .kl-stripe { transform: scaleY(0); }
.kl[data-anim] .kl-photo:not([data-in]) .kl-iris { clip-path: circle(0% at 50% 50%); }
.kl[data-anim] .kl-fam:not([data-in]) { opacity: 1; transform: none; }
.kl[data-anim] .kl-fam:not([data-in]) .kl-fam-l { transform: translateX(-40px); opacity: 0; }
.kl[data-anim] .kl-fam:not([data-in]) .kl-fam-r { transform: translateX(40px); opacity: 0; }
.kl[data-anim] .kl-fam:not([data-in]) .kl-thali path:first-child { stroke-dashoffset: 1; }
.kl[data-anim] [data-rv]:not([data-in]) .kl-bless { opacity: 0; transform: translateY(10px); }
.kl[data-anim] .kl-clock:not([data-in]) { transform: scale(.7) rotate(-40deg); }
.kl[data-anim] [data-rv]:not([data-in]) .kl-year { background-size: 0% 100%; }
.kl[data-anim] [data-rv]:not([data-in]) .kl-pip { transform: scale(0); }
.kl[data-anim] .kl-shot:not([data-in]) { opacity: 1; transform: none; }
.kl[data-anim] .kl-wipe-0:not([data-in]) { clip-path: inset(0 100% 0 0); }
.kl[data-anim] .kl-wipe-1:not([data-in]) { clip-path: inset(100% 0 0 0); }
.kl[data-anim] .kl-wipe-2:not([data-in]) { clip-path: inset(0 0 0 100%); }
.kl[data-anim] .kl-wipe-3:not([data-in]) { clip-path: inset(0 0 100% 0); }
.kl[data-anim] .kl-contact:not([data-in]) { transform: translateX(-30px); }
.kl[data-anim] .kl-contact:not([data-in]) .kl-stripe { transform: scaleY(0); }

@keyframes kl-draw { to { stroke-dashoffset: 0; } }
@keyframes kl-breathe { 0%, 100% { opacity: .8 } 50% { opacity: 1 } }
@keyframes kl-ripple { from { transform: scale(.6); opacity: .9 } to { transform: scale(2.2); opacity: 0 } }
@keyframes kl-sunrise { from { transform: translateY(42%) scale(.86); opacity: .2 } to { transform: none; opacity: .9 } }
@keyframes kl-sunpulse { from { box-shadow: 0 0 50px 16px rgba(255,200,110,.38) } to { box-shadow: 0 0 80px 30px rgba(255,200,110,.6) } }
@keyframes kl-spin { to { transform: rotate(360deg) } }
@keyframes kl-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes kl-glint { 0%, 70%, 100% { opacity: 0; transform: scale(.4) } 80% { opacity: .95; transform: scale(1.3) } }
@keyframes kl-crown { from { transform: rotate(-1.6deg) } to { transform: rotate(1.6deg) } }
@keyframes kl-sway { from { transform: rotate(-5deg) } to { transform: rotate(5deg) } }
@keyframes kl-flicker { 0% { transform: scale(1, 1) skewX(0) } 35% { transform: scale(.9, 1.12) skewX(4deg) } 70% { transform: scale(1.06, .93) skewX(-4deg) } 100% { transform: scale(.95, 1.07) skewX(2deg) } }
@keyframes kl-lglow { from { opacity: .18; transform: scale(.85) } to { opacity: .42; transform: scale(1.15) } }
@keyframes kl-fly { from { transform: translateX(-100px) } to { transform: translateX(calc(100cqi + 100px)) } }
@keyframes kl-flap { from { transform: scaleY(1) } to { transform: scaleY(-.5) } }
@keyframes kl-bellsway { from { transform: rotate(-4deg) } to { transform: rotate(4deg) } }
@keyframes kl-ring { from { transform: rotate(-16deg) } to { transform: rotate(16deg) } }
@keyframes kl-flash { 0% { opacity: 0 } 30% { opacity: 1 } 100% { opacity: 0 } }
@keyframes kl-strand { from { transform: rotate(-1.4deg) } to { transform: rotate(1.4deg) } }
@keyframes kl-silk { 0% { left: -60% } 60%, 100% { left: 130% } }
@keyframes kl-float { from { transform: translateY(-3px) } to { transform: translateY(3px) } }
@keyframes kl-pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.12) } }
@keyframes kl-run { 0% { background-position: -100% 0 } 100% { background-position: 200% 0 } }
@keyframes kl-fall { from { transform: translate(0, -20px) rotate(0) } to { transform: translate(var(--dx), 108cqh) rotate(var(--rot)) } }
@keyframes kl-throw { 0% { opacity: 0; transform: translate(0, 0) rotate(0) } 8% { opacity: 1 } 35% { transform: translate(calc(var(--x) * .6), var(--up)) rotate(calc(var(--rot) * .4)) } 85% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--x), var(--down)) rotate(var(--rot)) } }
@keyframes kl-kb { from { transform: scale(1.02) } to { transform: scale(1.12) translate(-1.5%, -1%) } }
@keyframes kl-pendant { from { transform: rotate(-9deg) } to { transform: rotate(9deg) } }
@keyframes kl-border { from { background-position: 0 0 } to { background-position: 1008px 0 } }
@keyframes kl-pop { 0% { opacity: 0; transform: scale(.6) } 100% { opacity: 1; transform: none } }
@keyframes kl-tick { from { opacity: .3; transform: translateY(-6px) } to { opacity: 1; transform: none } }
@keyframes kl-bob { from { transform: translateY(-2px) rotate(-3deg) } to { transform: translateY(2px) rotate(3deg) } }
@keyframes kl-shine { 0% { left: -60% } 55%, 100% { left: 130% } }
@keyframes kl-glow { 0%, 100% { opacity: .75 } 50% { opacity: 1 } }
@keyframes kl-foil { from { background-position: 240% 0 } to { background-position: -40% 0 } }
@keyframes kl-up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }

@media (prefers-reduced-motion: reduce) {
  .kl *, .kl *::before, .kl *::after { animation: none !important; transition: none !important; }
  .kl .kl-draw { stroke-dashoffset: 0; }
}
`
