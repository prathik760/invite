'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { gloock } from './kit/fonts/gloock'
import { hindMadurai } from './kit/fonts/hindMadurai'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseLines,
  parseRows,
  telHref,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
} from './kit/core'
import { Credit, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'
import {
  BananaPlant,
  Gopuram,
  K,
  KMotifArt,
  KolamArt,
  Kuthuvilakku,
  Thoranam,
  kMotifFor,
  kaavi,
  kolam,
  rng,
  strand,
  templeBorder,
} from './kalyanam/art'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './kalyanam/parts'

/*
 * Kalyanam — a South Indian temple wedding at dawn.
 * The guest stands at a temple entrance: the gopuram against a saffron sky,
 * banana plants tied either side, a mango-leaf thoranam over the door and
 * brass kuthuvilakkus lit on the step. A kolam draws itself on the threshold;
 * the doorway is hung with strands of jasmine over a red silk thirai. A tap
 * parts them — the jasmine swings aside, the silk gathers to the posts — and
 * the Muhurtham is revealed where the deity would be. Below, the invitation
 * reads like a family's printed card: invocation, both families, every
 * function on its own card, and all a travelling guest needs.
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

function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(4, ...names.flatMap((s) => s.split(/\s+/).map((w) => w.length)))
  return `clamp(${min}px, ${(span / (n * k)).toFixed(2)}cqi, ${max}px)`
}

const first = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** A little chain kolam laid sideways: the mark over every heading. */
function ChainMark({ color = K.red, className }: { color?: string; className?: string }) {
  return <KolamArt k={CHAIN} color={color} dot={color} stroke={1.5} className={className} style={{ transform: 'rotate(90deg)' }} />
}

function Heading({ children, sub, light }: { children: ReactNode; sub?: ReactNode; light?: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-[26px] items-center justify-center">
        <ChainMark color={light ? K.turmericLight : K.kumkum} className="h-[92px] w-[26px]" />
      </div>
      <h2 className="mt-3 text-balance leading-[1.08]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 40px)', color: light ? K.onRed : K.red }}>
        {children}
      </h2>
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

function FunctionCard({
  fn,
  couple,
  data,
  mainDirections,
  isPreview,
}: {
  fn: Fn
  couple: string
  data: Record<string, string>
  mainDirections: string | null
  isPreview: boolean
}) {
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
      className="relative grid grid-cols-[14px_1fr] overflow-hidden"
      style={{ background: main ? K.red : K.paper, boxShadow: '0 16px 30px -26px rgba(116,24,16,0.8)', border: `1px solid ${main ? K.redDeep : K.rule}` }}
    >
      <span aria-hidden style={kaavi(7, true)} />
      <div className="relative px-5 pb-6 pt-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-[clamp(52px,17cqi,68px)] w-[clamp(52px,17cqi,68px)] shrink-0 items-center justify-center rounded-full" style={{ background: main ? K.paper : K.turmericPale }}>
            <svg viewBox="0 0 68 68" className="absolute inset-0 h-full w-full" aria-hidden>
              {Array.from({ length: 20 }, (_, i) => {
                const a = (i / 20) * Math.PI * 2
                return <circle key={i} cx={34 + 31 * Math.cos(a)} cy={34 + 31 * Math.sin(a)} r={1.3} fill={main ? K.turmericLight : K.kumkum} />
              })}
            </svg>
            <KMotifArt kind={kMotifFor(fn.name)} className="relative h-[68%] w-[68%]" />
          </span>
          <div className="min-w-0">
            {main && (
              <p className="text-[13px] font-semibold uppercase" style={{ fontFamily: text, letterSpacing: '0.16em', color: K.turmericLight }}>
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
          {t && (
            <p style={{ fontFamily: display, fontSize: 24, color: accent }}>
              {t}
            </p>
          )}
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
    </article>
  )
}

function Countdown({ date, time, enabled }: { date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  return (
    <section className="relative mt-16" style={{ background: K.red, color: K.onRed }}>
      <div aria-hidden className="h-[14px]" style={templeBorder(14, K.turmericLight, K.red)} />
      <div className="mx-auto flex max-w-[30rem] items-center justify-center gap-5 px-6 py-10" style={grain(0.08)}>
        <p className="leading-none" style={{ fontFamily: display, fontSize: 'clamp(72px, 24cqi, 104px)', color: K.turmericLight }}>
          {c.days}
        </p>
        <div className="text-left">
          <p style={{ fontFamily: display, fontSize: 24 }}>{c.days === 1 ? 'day' : 'days'} to the Muhurtham</p>
          <p className="mt-1 tabular-nums" style={{ fontFamily: text, fontSize: 15, color: K.onRedSoft }}>
            {c.hours} h · {String(c.minutes).padStart(2, '0')} m · {String(c.seconds).padStart(2, '0')} s
          </p>
        </div>
      </div>
      <div aria-hidden className="h-[14px] rotate-180" style={templeBorder(14, K.turmericLight, K.red)} />
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
  const couple = `${bride} & ${groom}`
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

  /* The thirai: sealed (kolam draws itself) → part (jasmine swings aside, silk gathers) → done. */
  const [phase, setPhase] = useState<Phase>('sealed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const part = useCallback(() => {
    if (phase !== 'sealed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('part')
    timers.current.push(window.setTimeout(() => setPhase('done'), 2000))
  }, [phase])

  const lb = useLightbox(photos.length)
  // 0.62: Gloock's widest letters; a low floor so a long surname fits a narrow phone.
  const nameSize = fit([bride, groom], 58, 0.62, 20, 58)
  const music = Boolean(data.musicUrl && /^https?:\/\//i.test(data.musicUrl))

  return (
    <div
      className="kl relative"
      data-ph={phase}
      style={{ background: K.cream, color: K.ink, fontFamily: text, containerType: 'inline-size', overflowX: 'clip' }}
    >
      <style>{`
        .kl .kl-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: kl-draw 2.6s cubic-bezier(.45,.1,.35,1) forwards; }
        @keyframes kl-draw { to { stroke-dashoffset: 0; } }
        .kl .kl-strand { transition: transform 1.35s cubic-bezier(.5,.05,.25,1) var(--lag), opacity .6s ease calc(var(--lag) + .9s); transform-origin: 50% 0; }
        .kl .kl-thirai { transition: transform 1.3s cubic-bezier(.55,.05,.25,1) .15s, opacity .5s ease 1.2s; }
        .kl .kl-thirai-l { transform-origin: 0 50%; }
        .kl .kl-thirai-r { transform-origin: 100% 50%; }
        .kl .kl-curtain.is-part .kl-thirai { transform: scaleX(.12); opacity: 0; }
        .kl .kl-curtain.is-part .kl-strand { transform: translateX(var(--tx)) rotate(var(--rot)); opacity: 0; }
        .kl .kl-curtain.is-part .kl-seal { opacity: 0; }
        .kl .kl-seal { transition: opacity .35s ease; }
        .kl .kl-rise { transition: opacity .9s ease var(--d, 0ms), transform 1.1s cubic-bezier(.2,.7,.2,1) var(--d, 0ms); }
        .kl[data-ph="sealed"] .kl-rise { opacity: 0; transform: translateY(12px); }
        .kl .kl-hint { animation: kl-breathe 2.6s ease-in-out infinite 2.6s; }
        @keyframes kl-breathe { 0%, 100% { opacity: .8 } 50% { opacity: 1 } }
        .kl .kl-link { text-decoration: underline; text-decoration-color: currentColor; text-decoration-thickness: 1px; text-underline-offset: 5px; }
        .kl .kl-btn { transition: background-color .2s ease, color .2s ease; }
        .kl details > summary { list-style: none; cursor: pointer; }
        .kl details > summary::-webkit-details-marker { display: none; }
        .kl details .kl-plus { transition: transform .25s ease; }
        .kl details[open] .kl-plus { transform: rotate(45deg); }
        .kl .kl-fam { grid-template-columns: 1fr; }
        @container (min-width: 340px) { .kl .kl-fam { grid-template-columns: 1fr 1fr; } }
        @container (min-width: 640px) { .kl .kl-fns { grid-template-columns: 1fr 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .kl .kl-draw { animation: none; stroke-dashoffset: 0; }
          .kl .kl-strand, .kl .kl-thirai, .kl .kl-rise, .kl .kl-seal { transition: none; }
          .kl .kl-hint { animation: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={K.red} background="rgba(251,244,227,0.92)" border={K.rule} />

      {/* ── The temple entrance ─────────────────────────────────────── */}
      <section
        id="kl-top"
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: isPreview ? 560 : '100svh', background: 'linear-gradient(180deg, #F6D49A 0%, #F9E4BD 26%, #FBEFD8 40%)' }}
      >
        <span aria-hidden className="absolute left-1/2 top-[6cqi] h-[50cqi] max-h-[260px] w-[50cqi] max-w-[260px] -translate-x-1/2 rounded-full" style={{ background: '#F7C978', opacity: 0.55 }} />
        <Gopuram className="relative z-[1] mx-auto mt-[3cqi] block w-[min(46cqi,240px)]" />
        <div aria-hidden className="relative z-[2] h-[4.6cqi] max-h-[24px] w-full border-y" style={{ ...kaavi(11), borderColor: K.redDeep }} />

        <div className="relative z-[2] flex flex-1 flex-col" style={{ background: K.stone, ...grain(0.05) }}>
          <BananaPlant className="pointer-events-none absolute -left-[13cqi] -top-[34cqi] z-[3] h-[86%] max-h-[640px]" />
          <BananaPlant flip className="pointer-events-none absolute -right-[13cqi] -top-[34cqi] z-[3] h-[86%] max-h-[640px]" />

          {/* the doorway */}
          <div
            className="relative z-[4] mx-auto mt-[3cqi] flex w-[min(84cqi,30rem)] flex-1 flex-col"
            style={{ border: `3.4cqi solid ${K.stoneDeep}`, borderBottom: 0, boxShadow: `inset 0 0 0 1px ${K.stoneLine}, 0 0 0 1px ${K.stoneLine}` }}
          >
            <div className="relative flex flex-1 flex-col" style={{ background: K.paper, containerType: 'inline-size' }}>
              <Thoranam className="pointer-events-none absolute inset-x-0 top-0 z-[6] block h-[13cqi] w-full" />

              <div className="relative flex flex-1 flex-col items-center justify-center px-[8cqi] pb-[8cqi] pt-[15cqi] text-center">
                {invocation.length > 0 && (
                  <div className="kl-rise" style={{ ['--d' as string]: '350ms' }}>
                    {invocation.map((l, i) => (
                      <p key={i} className="leading-[1.45]" style={{ fontFamily: text, fontSize: i === 0 ? 17 : 15, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? K.kumkum : K.soft }}>
                        {l}
                      </p>
                    ))}
                  </div>
                )}

                <h1 className="mt-[5cqi]" style={{ fontFamily: display, fontWeight: 400, color: K.red }}>
                  <span className="kl-rise block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '500ms' }}>
                    {bride}
                  </span>
                  <span className="kl-rise my-[1.5cqi] block leading-none" style={{ fontSize: 'clamp(26px, 8cqi, 34px)', color: K.turmeric, ['--d' as string]: '620ms' }}>
                    &amp;
                  </span>
                  <span className="kl-rise block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '740ms' }}>
                    {groom}
                  </span>
                </h1>

                {/* the Muhurtham, as the hero */}
                <div className="kl-rise mt-[5.5cqi] w-full max-w-[20rem]" style={{ ['--d' as string]: '900ms' }}>
                  <div className="relative border-y py-3.5" style={{ borderColor: K.rule }}>
                    <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.3em', color: K.kumkum }}>
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
                  <p className="kl-rise mx-auto mt-4 max-w-[18rem] text-balance leading-[1.35]" style={{ fontSize: 17, fontWeight: 600, color: K.ink, ['--d' as string]: '1000ms' }}>
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
                      className={`kl-thirai kl-thirai-${s} absolute bottom-0 top-0 flex flex-col justify-end`}
                      style={{
                        [s === 'l' ? 'left' : 'right']: 0,
                        width: '50.5%',
                        backgroundColor: K.red,
                        backgroundImage: `repeating-linear-gradient(90deg, rgba(60,4,0,0.26) 0 4px, rgba(255,214,170,0.07) 9px, rgba(60,4,0,0.08) 15px, rgba(60,4,0,0.26) 22px)`,
                        [s === 'l' ? 'borderRight' : 'borderLeft']: `2px solid ${K.turmericLight}`,
                      }}
                    >
                      <span aria-hidden className="block h-[3px]" style={{ background: K.turmericLight }} />
                      <span aria-hidden className="block h-[18px]" style={templeBorder(18, K.turmericLight, K.redDeep)} />
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
                          ...strand(st.off),
                          ['--lag' as string]: `${Math.round(st.lag * 380)}ms`,
                          ['--tx' as string]: left ? `${(-st.p * 96 - 6).toFixed(1)}cqi` : `${((1 - st.p) * 96 + 6).toFixed(1)}cqi`,
                          ['--rot' as string]: `${left ? 7 : -7}deg`,
                        }}
                      />
                    )
                  })}
                  <div className="kl-seal pointer-events-none absolute inset-x-0 top-[42%] z-[2] px-6 text-center" style={{ color: K.onRed }}>
                    <p className="inline-block px-5 py-3" style={{ background: 'rgba(116,24,16,0.9)', boxShadow: `0 0 0 1px ${K.turmericLight}` }}>
                      <span className="block leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(24px, 8cqi, 32px)' }}>
                        {couple}
                      </span>
                      {date && (
                        <span className="mt-1 block" style={{ fontSize: 15, color: K.onRedSoft }}>
                          {date.day} {date.month} {date.year}
                        </span>
                      )}
                      <span aria-hidden className="mx-auto my-2.5 block h-px w-12" style={{ background: K.turmericLight }} />
                      <span className="kl-hint block font-semibold" style={{ fontSize: 15, color: K.turmericPale }}>
                        Tap to part the curtain
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={part}
                    disabled={phase !== 'sealed'}
                    aria-label={`Open ${couple}'s wedding invitation`}
                    className="absolute inset-0 z-[3] cursor-pointer disabled:cursor-default"
                  />
                </div>
              )}
            </div>
          </div>

          <Kuthuvilakku className="pointer-events-none absolute bottom-[-2cqi] left-[3cqi] z-[6] w-[9cqi] max-w-[52px]" />
          <Kuthuvilakku className="pointer-events-none absolute bottom-[-2cqi] right-[3cqi] z-[6] w-[9cqi] max-w-[52px]" />
        </div>

        {/* the threshold, and the kolam drawn on it */}
        <div className="relative z-[5] h-[24cqi] max-h-[140px] border-t" style={{ background: `linear-gradient(180deg, ${K.floor}, ${K.floorDeep})`, borderColor: '#5A1C10' }}>
          <div className="absolute left-1/2 top-[-13cqi] w-[56cqi] max-w-[300px]" style={{ transform: 'translateX(-50%) perspective(480px) rotateX(58deg)', transformOrigin: '50% 50%' }}>
            <KolamArt k={THRESHOLD} draw={!isPreview} stroke={2.6} className="block h-auto w-full" />
          </div>
        </div>
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
                <Reveal disabled={isPreview}>
                  <p className="mx-auto max-w-[25rem] text-balance leading-[1.55]" style={{ fontSize: 'clamp(18px, 5.4cqi, 21px)', color: K.ink }}>
                    {data.message}
                  </p>
                </Reveal>
              )}
              {couplePhoto && (
                <Reveal disabled={isPreview} className="mx-auto mt-10 max-w-[24rem] p-[8px]" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}, 0 18px 36px -28px rgba(116,24,16,0.7)` }}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={couplePhoto} alt={couple} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div aria-hidden className="mt-[8px] h-[12px]" style={templeBorder(12, K.turmericLight, K.red)} />
                </Reveal>
              )}
              {(data.brideParents?.trim() || data.groomParents?.trim() || portraits.bride || portraits.groom) && (
                <Reveal disabled={isPreview} className="kl-fam mt-12 grid items-start gap-x-4 gap-y-10">
                  {[
                    { name: bride, parents: data.brideParents?.trim(), photo: portraits.bride },
                    { name: groom, parents: data.groomParents?.trim(), photo: portraits.groom },
                  ].map((p) => (
                    <div key={p.name}>
                      <span className="relative mx-auto block h-[132px] w-[132px]">
                        <svg viewBox="0 0 132 132" className="absolute inset-0" aria-hidden>
                          {Array.from({ length: 28 }, (_, i) => {
                            const a = (i / 28) * Math.PI * 2
                            return <circle key={i} cx={66 + 62 * Math.cos(a)} cy={66 + 62 * Math.sin(a)} r={1.8} fill={K.kumkum} />
                          })}
                        </svg>
                        <span className="absolute inset-[10px] flex items-center justify-center overflow-hidden rounded-full" style={{ background: K.turmericPale, boxShadow: `0 0 0 1px ${K.turmeric}` }}>
                          {p.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <span style={{ fontFamily: display, fontSize: 50, color: K.red }}>{first(p.name)}</span>
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
                </Reveal>
              )}
              {blessings.length > 0 && (
                <Reveal disabled={isPreview} className="relative mx-auto mt-12 max-w-[24rem] px-5 py-7" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }}>
                  <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.22em', color: K.kumkum }}>
                    With the blessings of
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {blessings.map((b, i) => (
                      <li key={`${b}-${i}`} className="text-balance leading-[1.4]" style={{ fontFamily: display, fontSize: 19, color: K.ink }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </section>
          )}

          <Countdown date={data.date} time={data.time} enabled={!isPreview} />

          {/* ── The functions ─────────────────────────────────────────── */}
          {functions.length > 0 && (
            <section id="kl-functions" className="mx-auto max-w-[32rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading sub="Your presence is requested at each of the functions">The Functions</Heading>
              </Reveal>
              <div className="kl-fns mt-9 grid gap-4">
                {functions.map((fn, i) => (
                  <Reveal key={`${fn.name}-${i}`} disabled={isPreview} delay={(i % 2) * 70}>
                    <FunctionCard fn={fn} couple={couple} data={data} mainDirections={directions} isPreview={isPreview} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* ── Our story ─────────────────────────────────────────────── */}
          {story.length > 0 && (
            <section id="kl-story" className="mx-auto max-w-[30rem] px-6 pt-16 text-center" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>Our Story</Heading>
              </Reveal>
              <ol className="mt-8">
                {story.map((s, i) => (
                  <Reveal as="li" key={`${s.title}-${i}`} disabled={isPreview}>
                    {i > 0 && (
                      <span aria-hidden className="mx-auto my-6 flex w-[40px] justify-between">
                        {[0, 1, 2].map((j) => (
                          <span key={j} className="h-[5px] w-[5px] rounded-full" style={{ background: K.turmeric }} />
                        ))}
                      </span>
                    )}
                    {s.when && (
                      <p className="leading-none" style={{ fontFamily: display, fontSize: 44, color: 'transparent', WebkitTextStroke: `1.2px ${K.turmeric}` }}>
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
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {/* ── Photographs ──────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section id="kl-photos" className="mx-auto max-w-[34rem] px-5 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>Moments</Heading>
              </Reveal>
              <div className="mt-9 grid grid-cols-6 gap-2.5">
                {photos.map((src, i) => {
                  const last = i === photos.length - 1
                  // the last photo takes the whole row when it would otherwise sit alone
                  const shape = last && (i % 5 === 1 || i % 5 === 3) ? 'col-span-6 aspect-[3/2]' : ['col-span-6 aspect-[3/2]', 'col-span-3 aspect-[3/4]', 'col-span-3 aspect-[3/4]', 'col-span-4 aspect-square', 'col-span-2 aspect-[1/2]'][i % 5]
                  return (
                    <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 70} className={shape.split(' ')[0]}>
                      <button
                        type="button"
                        onClick={() => !isPreview && lb.setOpen(i)}
                        aria-label={`Open photo ${i + 1} of ${photos.length}`}
                        className={`block w-full overflow-hidden ${shape.split(' ')[1]}`}
                        style={{ boxShadow: `0 0 0 1px ${K.rule}`, cursor: isPreview ? 'default' : 'zoom-in' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </button>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Venue, travel and stay ───────────────────────────────── */}
          <section id="kl-venue" className="mx-auto max-w-[32rem] px-6 pt-16 text-center" style={{ scrollMarginTop: 56 }}>
            <Reveal disabled={isPreview}>
              <Heading>The Mandapam</Heading>
              <div className="relative mx-auto mt-8 max-w-[24rem] overflow-hidden px-6 pb-8 pt-7" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }}>
                <Gopuram className="mx-auto block w-[120px]" />
                <div aria-hidden className="mx-auto h-[8px] w-[150px]" style={kaavi(5)} />
                <h3 className="mx-auto mt-5 max-w-[20rem] text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(27px, 8cqi, 34px)', color: K.red }}>
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
                  <Act href={directions} isPreview={isPreview} className={`${btn} hover:bg-[#861C13]`} style={{ background: K.red, color: K.onRed }}>
                    {Icon.pin}
                    Get directions
                  </Act>
                  <Act href={weddingCal} isPreview={isPreview} className={`${btn} hover:bg-[rgba(158,34,24,0.05)]`} style={{ boxShadow: `inset 0 0 0 1px ${K.red}`, color: K.red }}>
                    {Icon.calendar}
                    Add to calendar
                  </Act>
                </div>
              </div>
            </Reveal>
            {travel.length > 0 && (
              <Reveal disabled={isPreview} className="mx-auto mt-8 max-w-[24rem] overflow-hidden text-left" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }}>
                <div className="px-6 py-3" style={{ background: K.leaf, color: '#F4F1DC' }}>
                  <h3 style={{ fontFamily: display, fontSize: 22 }}>Travel &amp; stay</h3>
                </div>
                <div className="space-y-3 px-6 py-5">
                  {travel.map((p, i) => (
                    <p key={i} className="leading-[1.65]" style={{ fontSize: 16, color: K.ink }}>
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}
          </section>

          {/* ── For our guests ────────────────────────────────────────── */}
          {hasGuests && (
            <section id="kl-guests" className="mx-auto max-w-[32rem] px-6 pt-16" style={{ scrollMarginTop: 56 }}>
              <Reveal disabled={isPreview}>
                <Heading>For Our Guests</Heading>
              </Reveal>
              {contacts.length > 0 && (
                <Reveal disabled={isPreview} className="mt-8 space-y-3">
                  {contacts.map((c, i) => {
                    const [who, ...role] = c.name.split(/\s+[—–-]\s+/)
                    const tel = telHref(c.phone)
                    const wa = whatsappHref(c.phone, `Vanakkam ${who.split(' ')[0]}, I'm a guest at ${couple}'s wedding — `)
                    return (
                      <div key={`${c.name}-${i}`} className="grid grid-cols-[6px_1fr] overflow-hidden" style={{ background: K.paper, boxShadow: `0 0 0 1px ${K.rule}` }}>
                        <span aria-hidden style={{ background: K.turmeric }} />
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5">
                          <div className="min-w-0">
                            <p style={{ fontFamily: display, fontSize: 19, color: K.ink }}>{who}</p>
                            {role.length > 0 && <p style={{ fontSize: 15, color: K.soft }}>{cap(role.join(' — '))}</p>}
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
                </Reveal>
              )}
              {faq.length > 0 && (
                <Reveal disabled={isPreview} className="mt-10">
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
                          <p className="pb-5 pr-8 leading-[1.6]" style={{ fontSize: 16, color: K.soft }}>
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
          <section id="kl-rsvp" className="relative mt-20 text-center" style={{ background: K.red, color: K.onRed, scrollMarginTop: 56 }}>
            <div aria-hidden className="h-[16px]" style={templeBorder(16, K.turmericLight, K.redDeep)} />
            <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-14" style={grain(0.08)}>
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
              <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                <Act href={reply} isPreview={isPreview} className={`${btn} hover:bg-[#F2CB66]`} style={{ background: K.turmericLight, color: K.redDeep }}>
                  {Icon.whatsapp}
                  Reply on WhatsApp
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} hover:bg-[rgba(251,239,214,0.08)]`} style={{ boxShadow: 'inset 0 0 0 1px rgba(237,190,78,0.7)', color: K.onRed }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
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
                  <p className="mt-1 break-words" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)', color: K.turmericLight }}>
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                  </p>
                </div>
              )}
            </Reveal>
            <div aria-hidden className="h-[16px] rotate-180" style={templeBorder(16, K.turmericLight, K.redDeep)} />
          </section>

          {eventId && (
            <div id="kl-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection
                eventId={eventId}
                theme={WISHES_THEME}
                title="Blessings"
                intro={`Leave a few words for ${bride} and ${groom}. Your blessing appears here for every guest.`}
                noun="blessing"
              />
            </div>
          )}

          <footer className="px-6 pb-10 pt-12 text-center">
            <KolamArt k={FOOT} color={K.red} dot={K.red} stroke={1.6} className="mx-auto block w-[88px]" />
            <p className="mt-4" style={{ fontFamily: display, fontSize: 22, color: K.red }}>
              {couple}
            </p>
            {date && (
              <p className="mt-1 text-[13px] font-semibold uppercase tabular-nums" style={{ letterSpacing: '0.26em', color: K.turmeric }}>
                {date.day} · {date.monthShort} · {date.year}
              </p>
            )}
            <div className="mt-8">
              <Credit isPreview={isPreview} color={K.faint} linkColor={K.soft} />
            </div>
          </footer>

          {lb.open !== null && (
            <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(34,10,6,0.96)" color={K.onRed} font={text} />
          )}
        </>
      )}
    </div>
  )
}
