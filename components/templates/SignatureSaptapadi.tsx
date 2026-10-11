'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { yeseva } from './kit/fonts/yeseva'
import { laila } from './kit/fonts/laila'
import { tiro } from './kit/fonts/tiro'
import { mukta } from './kit/fonts/mukta'
import { marcellus } from './kit/fonts/marcellus'
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
import { Butti, Diya, FloralMark, Footprint, HavanFire, Kalash, Motif, NightSky, S, Toran, bandhani, motifFor } from './saptapadi/art'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './rajwada/parts'

/*
 * Saptapadi — a Hindu wedding in lal joda red and zari gold.
 * The guest finds the invitation behind an antarpat: a red bandhani cloth with
 * a gold border and an embroidered kalash, held up on a brass rod, as it is
 * held between bride and groom before they first see each other. A tap lowers
 * it; marigold petals and akshata burst out, and the couple's names rise in
 * gold beneath a swaying toran. Further down, the seven steps are taken around
 * the sacred fire, one vow at a time, and the evening ends under Dhruva and
 * Arundhati.
 */

const display = `${yeseva.style.fontFamily}, Georgia, serif`
const engraved = `${marcellus.style.fontFamily}, Georgia, serif`
const deva = `${laila.style.fontFamily}, ${tiro.style.fontFamily}, serif`
const shloka = `${tiro.style.fontFamily}, serif`
const text = `${mukta.style.fontFamily}, system-ui, sans-serif`

const WISHES_THEME: InviteTheme = {
  bg: S.cream,
  surface: S.card,
  ink: S.ink,
  muted: S.soft,
  line: S.rule,
  accent: S.red,
  onAccent: S.ivory,
  heading: display,
  body: text,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 38px)', color: S.red },
}

/** The seven steps, with the line of the Saptapadi mantra each is taken to. */
const VOWS = [
  { sa: 'इषे एकपदी भव', title: 'For nourishment', text: 'May we never want for food — and always share it with others.' },
  { sa: 'ऊर्जे द्विपदी भव', title: 'For strength', text: 'May we grow strong in body, mind and spirit, together.' },
  { sa: 'रायस्पोषाय त्रिपदी भव', title: 'For prosperity', text: 'May we earn honestly, spend wisely and prosper side by side.' },
  { sa: 'मायोभव्याय चतुष्पदी भव', title: 'For happiness', text: 'May we find joy and harmony in each other, every day.' },
  { sa: 'प्रजाभ्यः पञ्चपदी भव', title: 'For family', text: 'May we raise a loving family and care for those who came before us.' },
  { sa: 'ऋतुभ्यः षट्पदी भव', title: 'For every season', text: 'May we walk through every season of life, and grow old together.' },
  { sa: 'सखा सप्तपदी भव', title: 'For friendship', text: 'May we be lifelong friends and true companions.' },
]

/** The wedding day, ritual by ritual — for guests seeing a Hindu wedding for the first time. */
const RITUALS = [
  { hi: 'गणेश पूजा', en: 'Ganesh Puja', text: 'Every Hindu ceremony begins with Lord Ganesha, the remover of obstacles, who is asked to bless the day ahead.' },
  { hi: 'बारात', en: 'Baraat & Dwar Puja', text: 'The groom arrives in a procession of music and dancing, and is welcomed at the entrance by the bride’s family.' },
  { hi: 'जयमाला', en: 'Jaimala', text: 'Bride and groom exchange garlands of flowers — their first act together, a sign of acceptance and respect.' },
  { hi: 'कन्यादान', en: 'Kanyadaan', text: 'The bride’s father places her hand in the groom’s and pours sacred water over their joined hands — called the greatest of all gifts.' },
  { hi: 'विवाह होम', en: 'Vivah Homa', text: 'The sacred fire is lit. Agni is the witness to the marriage as the couple offer ghee and samagri while the priest chants the Vedic mantras.' },
  { hi: 'मंगलसूत्र और सिंदूर', en: 'Mangalsutra & Sindoor', text: 'The groom ties the mangalsutra of black and gold beads, and places sindoor in the parting of the bride’s hair.' },
  { hi: 'सप्तपदी', en: 'Saptapadi', text: 'Seven steps around the fire, a vow with each. After the seventh, the marriage is complete.' },
  { hi: 'आशीर्वाद', en: 'Ashirvad', text: 'The elders bless the couple, showering them with flower petals and akshata — rice, for abundance.' },
]

/* Falling petals in the hero, and the burst when the antarpat is lowered.
   Fixed lists, not Math.random, so the server and the browser draw the same. */
const PETAL_COLORS = [S.marigold, S.yellow, '#E2324A', S.marigoldDeep, '#F7C6CF']
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 9) % 100,
  size: 7 + ((i * 5) % 6),
  dur: 9 + ((i * 7) % 7),
  delay: -((i * 13) % 14),
  dx: ((i % 2 ? 1 : -1) * (20 + ((i * 11) % 40))),
  spin: 2.4 + ((i * 3) % 4) * 0.6,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
}))
const BURST = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2 + (i % 2) * 0.2
  const d = 110 + ((i * 29) % 90)
  return {
    bx: Math.round(Math.cos(a) * d),
    by: Math.round(Math.sin(a) * d * 0.8 + 40),
    br: (i * 67) % 360,
    size: i % 3 === 0 ? 5 : 9 + (i % 4),
    color: i % 3 === 0 ? '#FFF6E2' : PETAL_COLORS[i % PETAL_COLORS.length],
    delay: (i % 5) * 0.03,
  }
})

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
      <FloralMark light={light} className="mx-auto block w-[150px]" />
      <h2 id={id} className="mt-3 text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 40px)', color: light ? S.goldLight : S.red }}>
        {children}
      </h2>
      {sub && (
        <p className="mx-auto mt-3 max-w-[22rem] text-balance leading-[1.5]" style={{ fontFamily: text, fontSize: 16, color: light ? S.ivorySoft : S.soft }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/** A strip of zari border between sections. */
const Zari = ({ className = '' }: { className?: string }) => <div aria-hidden className={`sp-zari ${className}`} />

const btn = 'sp-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-medium'

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

function FunctionCard({ fn, day, couple, data, mainDirections, isPreview }: { fn: Fn; day?: string; couple: string; data: Record<string, string>; mainDirections: string | null; isPreview: boolean }) {
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const venue = fn.venue || data.venue || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const cal = calendarHref(`${fn.name} · ${couple}`, fn.date, fn.time, place || undefined, 3)
  const dir = fn.venue ? mapsHref(undefined, fn.venue, data.venueAddress) : mainDirections
  return (
    <article className="overflow-hidden" style={{ background: S.card, boxShadow: '0 22px 40px -32px rgba(67,6,14,0.75)', borderRadius: 6 }}>
      <div className="relative flex h-[92px] items-center justify-center" style={{ background: S.red, ...bandhani('rgba(255,214,140,0.22)', 14) }}>
        <Motif kind={motifFor(fn.name)} className="h-14 w-14" />
      </div>
      <Zari />
      <div className="px-6 pb-7 pt-5 text-center">
        {day && (
          <p className="text-[13px] uppercase" style={{ fontFamily: engraved, letterSpacing: '0.22em', color: S.goldDeep }}>
            {day}
          </p>
        )}
        <h3 className="mt-1 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(27px, 8cqi, 32px)', color: S.red }}>
          {fn.name}
        </h3>
        <p className="mt-2 leading-[1.4]" style={{ fontFamily: text, fontSize: 17, color: S.ink }}>
          {d ? `${d.weekday}, ${d.day} ${d.month}` : 'Date to follow'}
          {t && (
            <>
              <span aria-hidden style={{ color: S.gold }}> · </span>
              <span className="whitespace-nowrap font-semibold">{t}</span>
            </>
          )}
        </p>
        {venue && (
          <p className="mt-1 leading-[1.35]" style={{ fontFamily: engraved, fontSize: 18, color: S.ink }}>
            {venue}
          </p>
        )}
        {fn.dress && (
          <p className="mx-auto mt-3 max-w-[20rem] leading-[1.45]" style={{ fontFamily: text, fontSize: 15, color: S.soft }}>
            <span style={{ color: S.goldDeep }}>Dress · </span>
            {fn.dress}
          </p>
        )}
        {(cal || dir) && (
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Act href={cal} isPreview={isPreview} className="sp-link inline-flex items-center gap-1.5 py-1 text-[15px] font-medium" style={{ fontFamily: text, color: S.red }}>
              {Icon.calendar}
              Add to calendar
            </Act>
            <Act href={dir} isPreview={isPreview} className="sp-link inline-flex items-center gap-1.5 py-1 text-[15px] font-medium" style={{ fontFamily: text, color: S.red }}>
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
    <section className="relative text-center" style={{ background: S.red, color: S.ivory, ...bandhani() }}>
      <Zari />
      <div className="relative mx-auto flex max-w-[30rem] items-center justify-center gap-[3cqi] px-4 py-12">
        <Diya className="w-[16cqi] max-w-[74px] shrink-0" delay={0.2} />
        <div>
          <p style={{ fontFamily: deva, fontSize: 18, color: S.goldLight }}>शुभ मुहूर्त</p>
          <p className="sp-foil mt-1 leading-none" style={{ fontFamily: display, fontSize: 'clamp(72px, 24cqi, 104px)' }}>
            {c.days}
          </p>
          <p className="mt-1" style={{ fontFamily: engraved, fontSize: 22 }}>
            {c.days === 1 ? 'day' : 'days'} to go
          </p>
          <p className="mt-3 tabular-nums" style={{ fontFamily: text, fontSize: 15, color: S.ivorySoft, letterSpacing: '0.04em' }}>
            {c.hours} hrs · {pad2(c.minutes)} min · {pad2(c.seconds)} sec
          </p>
        </div>
        <Diya className="w-[16cqi] max-w-[74px] shrink-0" delay={0.7} />
      </div>
      <Zari />
    </section>
  )
}

/**
 * The seven steps around the fire. Once the section is in view the steps are
 * taken one by one, each lighting a footprint and showing its vow; a guest can
 * tap any step, or walk them again. The builder shows all seven taken.
 */
function Saptapadi({ isPreview }: { isPreview: boolean }) {
  const [step, setStep] = useState(isPreview ? 7 : 0)
  const [auto, setAuto] = useState(!isPreview)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isPreview) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setSeen(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [isPreview])

  useEffect(() => {
    if (!auto || !seen || step >= 7) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(7)
    const t = window.setTimeout(() => setStep((s) => Math.min(7, s + 1)), step === 0 ? 900 : 2600)
    return () => window.clearTimeout(t)
  }, [auto, seen, step])

  const choose = (n: number) => {
    setAuto(false)
    setStep(n)
  }
  const again = () => {
    setStep(0)
    setAuto(true)
  }

  const C = 2 * Math.PI * 118
  const vow = step > 0 ? VOWS[step - 1] : null

  return (
    <div ref={ref}>
      <div className="relative mx-auto aspect-square w-[min(88cqi,360px)]">
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx={150} cy={150} r={118} fill="none" stroke={S.ruleOnRed} strokeWidth={1.4} strokeDasharray="2 6" />
          <circle
            className="sp-ring"
            cx={150}
            cy={150}
            r={118}
            fill="none"
            stroke={S.goldLight}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeDasharray={C.toFixed(1)}
            strokeDashoffset={(C * (1 - step / 7)).toFixed(1)}
            transform="rotate(-90 150 150)"
          />
        </svg>
        <HavanFire className="absolute left-1/2 top-1/2 w-[56%] -translate-x-1/2 -translate-y-[54%]" />
        {VOWS.map((v, i) => {
          const a = -90 + (i * 360) / 7
          const r = (a * Math.PI) / 180
          return (
            <button
              key={v.sa}
              type="button"
              onClick={() => choose(i + 1)}
              aria-label={`Step ${i + 1}: ${v.title}`}
              aria-pressed={step === i + 1}
              className="absolute w-[10%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + 39.3 * Math.cos(r)}%`, top: `${50 + 39.3 * Math.sin(r)}%` }}
            >
              <span className={`block ${step === i + 1 && step < 7 ? 'sp-pulse' : ''}`} style={{ transform: `rotate(${a + 180}deg)` }}>
                <Footprint taken={i < step} flip={i % 2 === 1} current={step === i + 1} />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-6 min-h-[178px] max-w-[24rem] px-4 text-center" aria-live="polite">
        {vow ? (
          <div key={step} className="sp-vow">
            <p className="uppercase" style={{ fontFamily: engraved, fontSize: 13, letterSpacing: '0.24em', color: S.gold }}>
              Step {cap(numberWords(step))} of Seven
            </p>
            <p className="mt-2 leading-[1.3]" style={{ fontFamily: shloka, fontSize: 'clamp(21px, 6.4cqi, 26px)', color: S.goldLight }}>
              {vow.sa}
            </p>
            <p className="mt-2" style={{ fontFamily: display, fontSize: 24, color: S.ivory }}>
              {vow.title}
            </p>
            <p className="mt-1.5 text-balance leading-[1.55]" style={{ fontFamily: text, fontSize: 16, color: S.ivorySoft }}>
              {vow.text}
            </p>
          </div>
        ) : (
          <p className="text-balance leading-[1.55]" style={{ fontFamily: text, fontSize: 16, color: S.ivorySoft }}>
            Seven steps around the sacred fire, with Agni as witness — a vow with every step.
          </p>
        )}
      </div>

      <div className="mt-2 text-center">
        {step >= 7 ? (
          <div className="sp-vow">
            <p className="leading-[1.35]" style={{ fontFamily: shloka, fontSize: 'clamp(22px, 6.8cqi, 28px)', color: S.goldLight }}>
              सखा सप्तपदी भव
            </p>
            <p className="mt-1" style={{ fontFamily: engraved, fontSize: 17, color: S.ivory }}>
              With these seven steps, become my friend.
            </p>
            {!isPreview && (
              <button type="button" onClick={again} className={`${btn} mt-5 border hover:bg-[rgba(247,219,142,0.08)]`} style={{ borderColor: S.ruleOnRed, color: S.goldLight, fontFamily: text }}>
                Walk the seven steps again
              </button>
            )}
          </div>
        ) : (
          <button type="button" onClick={() => choose(step + 1)} className={`${btn} border hover:bg-[rgba(247,219,142,0.08)]`} style={{ borderColor: S.ruleOnRed, color: S.goldLight, fontFamily: text }}>
            {step === 0 ? 'Take the first step' : 'Take the next step'}
          </button>
        )}
      </div>
    </div>
  )
}

type Phase = 'veiled' | 'lowering' | 'done'

export default function SignatureSaptapadi({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Gauri'
  const groom = data.groomName?.trim() || 'Siddharth'
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
    functions.length ? { id: 'sp-functions', label: 'Functions' } : null,
    { id: 'sp-vows', label: 'Saptapadi' },
    story.length ? { id: 'sp-story', label: 'Our story' } : null,
    photos.length ? { id: 'sp-photos', label: 'Photos' } : null,
    { id: 'sp-venue', label: 'Venue' },
    hasGuests ? { id: 'sp-guests', label: 'Guests' } : null,
    { id: 'sp-rsvp', label: 'RSVP' },
    eventId ? { id: 'sp-wishes', label: 'Ashirvad' } : null,
  ].filter(Boolean) as NavItem[]

  // The guest a personal link was made for: ?to=Sharma+family
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])

  /* The antarpat: veiled → lowering (the cloth drops, petals burst) → done. */
  const [phase, setPhase] = useState<Phase>('veiled')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const lower = useCallback(() => {
    if (phase !== 'veiled') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    setPhase('lowering')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done')
        if (!isPreview) window.scrollTo(0, 0)
      }, 1750),
    )
  }, [phase, isPreview])

  const lb = useLightbox(photos.length)
  const nameSize = fit([bride, groom], 70, 0.64, 30, 74)
  const music = Boolean(data.musicUrl && /^https?:\/\//i.test(data.musicUrl))
  const heroH = isPreview ? 'max(560px, 210cqi)' : '100svh'
  const cream: CSSProperties = { background: S.cream, ...grain(0.05) }

  return (
    <div
      className="sp relative"
      data-ph={phase}
      style={{ background: S.cream, color: S.ink, fontFamily: text, containerType: 'inline-size', overflowX: 'clip', ['--fall' as string]: isPreview ? '620px' : 'calc(100svh + 60px)' }}
    >
      {/* Raw CSS, not a text child: React escapes > and " in text on the server (see SignatureRajwada). */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sp .sp-sway { transform-box: fill-box; transform-origin: 50% 0; animation: sp-sway 4.6s ease-in-out infinite alternate; }
        .sp .sp-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: sp-flicker 1.5s ease-in-out infinite; }
        .sp .sp-glow { animation: sp-glow 2.6s ease-in-out infinite; }
        .sp .sp-spark { opacity: 0; animation: sp-spark 2.6s ease-in infinite; }
        .sp .sp-twinkle { animation: sp-twinkle 3.2s ease-in-out infinite alternate; }
        .sp .sp-foil { background: linear-gradient(100deg, #B8862E 0%, #F7DB8E 20%, #E2B04A 38%, #FFF3C4 50%, #E2B04A 62%, #B8862E 100%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: #E2B04A; animation: sp-shine 7s linear infinite; }
        .sp .sp-petal { position: absolute; top: -6%; animation: sp-fall var(--dur) linear var(--delay) infinite; will-change: transform; }
        .sp .sp-petal i { display: block; width: var(--s); height: calc(var(--s) * 1.35); border-radius: 60% 0 60% 0; background: var(--c); animation: sp-spin var(--spin) ease-in-out infinite alternate; }
        .sp .sp-burst { position: absolute; left: 50%; top: 46%; width: var(--s); height: calc(var(--s) * 1.3); border-radius: 60% 0 60% 0; background: var(--c); opacity: 0; animation: sp-burst 1.6s cubic-bezier(.15,.6,.35,1) var(--delay) forwards; }
        .sp .sp-rise { transition: opacity .9s ease var(--d, 0ms), transform 1.2s cubic-bezier(.2,.7,.2,1) var(--d, 0ms); }
        .sp[data-ph="veiled"] .sp-rise { opacity: 0; transform: translateY(16px); }
        .sp .sp-cloth { transform-origin: 50% 0; transition: transform 1.55s cubic-bezier(.6,.02,.3,1), opacity .5s ease 1.1s; }
        .sp .sp-stage.is-lowering .sp-cloth { transform: translateY(112%) rotateX(24deg); opacity: 0; }
        .sp .sp-rod { transition: transform .9s cubic-bezier(.5,0,.5,1), opacity .6s ease .25s; }
        .sp .sp-stage.is-lowering .sp-rod { transform: translateY(-160%); opacity: 0; }
        .sp .sp-stage { transition: background-color .35s ease; }
        .sp .sp-stage .sp-fade { transition: opacity .35s ease; }
        .sp .sp-stage.is-lowering .sp-fade { opacity: 0; }
        .sp .sp-stage.is-lowering { background-color: transparent !important; pointer-events: none; }
        .sp .sp-hint { animation: sp-breathe 2.6s ease-in-out infinite; }
        .sp .sp-zari { height: 14px; background: radial-gradient(circle, #F7DB8E 0 2px, transparent 2.6px) 0 50% / 14px 14px repeat-x, linear-gradient(#A8741A, #A8741A) 0 2px / 100% 1.5px no-repeat, linear-gradient(#A8741A, #A8741A) 0 calc(100% - 2px) / 100% 1.5px no-repeat, #6A0712; }
        .sp .sp-foot { display: block; width: 100%; height: auto; overflow: visible; }
        .sp .sp-pulse { animation: sp-pulse 1.2s ease-in-out infinite; }
        .sp .sp-ring { transition: stroke-dashoffset 1.1s cubic-bezier(.3,.7,.3,1); }
        .sp .sp-vow { animation: sp-vowin .6s ease both; }
        .sp .sp-link { text-decoration: underline; text-decoration-color: rgba(168,116,26,0.45); text-underline-offset: 5px; }
        .sp .sp-link:hover { text-decoration-color: currentColor; }
        .sp .sp-btn { transition: background-color .2s ease, color .2s ease; border-radius: 4px; }
        .sp details > summary { list-style: none; cursor: pointer; }
        .sp details > summary::-webkit-details-marker { display: none; }
        .sp details .sp-plus { transition: transform .25s ease; }
        .sp details[open] .sp-plus { transform: rotate(45deg); }
        .sp .sp-fam { grid-template-columns: 1fr; }
        @container (min-width: 340px) { .sp .sp-fam { grid-template-columns: 1fr 1fr; } }
        @container (min-width: 640px) { .sp .sp-fns { grid-template-columns: 1fr 1fr; } }
        @keyframes sp-sway { from { transform: rotate(-2.6deg) } to { transform: rotate(2.6deg) } }
        @keyframes sp-flicker { 0%, 100% { transform: scale(1, 1) skewX(0) } 25% { transform: scale(.94, 1.07) skewX(2.5deg) } 50% { transform: scale(1.04, .95) skewX(-2deg) } 75% { transform: scale(.97, 1.04) skewX(1deg) } }
        @keyframes sp-glow { 0%, 100% { opacity: .6 } 50% { opacity: 1 } }
        @keyframes sp-spark { 0% { transform: translateY(0); opacity: 0 } 15% { opacity: 1 } 100% { transform: translate(4px, -62px); opacity: 0 } }
        @keyframes sp-twinkle { from { opacity: .3 } to { opacity: 1 } }
        @keyframes sp-shine { from { background-position: 120% 0 } to { background-position: -140% 0 } }
        @keyframes sp-fall { from { transform: translate3d(0, 0, 0) } to { transform: translate3d(var(--dx), var(--fall), 0) } }
        @keyframes sp-spin { from { transform: rotate(-30deg) rotateY(0deg) } to { transform: rotate(160deg) rotateY(160deg) } }
        @keyframes sp-burst { 0% { opacity: 1; transform: translate(-50%, -50%) scale(.3) rotate(0deg) } 100% { opacity: 0; transform: translate(calc(-50% + var(--bx)), calc(-50% + var(--by))) scale(1) rotate(var(--br)) } }
        @keyframes sp-breathe { 0%, 100% { opacity: .72 } 50% { opacity: 1 } }
        @keyframes sp-pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.2) } }
        @keyframes sp-vowin { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          .sp .sp-sway, .sp .sp-flame, .sp .sp-glow, .sp .sp-spark, .sp .sp-twinkle, .sp .sp-foil, .sp .sp-petal i, .sp .sp-hint, .sp .sp-pulse, .sp .sp-vow { animation: none; }
          .sp .sp-petal { display: none; }
          .sp .sp-rise, .sp .sp-cloth, .sp .sp-rod, .sp .sp-stage, .sp .sp-ring { transition: none; }
        }
      ` }} />

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={S.goldLight} background="rgba(106,7,18,0.9)" border={S.ruleOnRed} />

      {/* ── The hero: names under the toran ─────────────────────────────── */}
      <section
        id="sp-top"
        className="relative overflow-hidden"
        style={{ minHeight: heroH, background: `radial-gradient(120% 70% at 50% 38%, #B3162A 0%, ${S.red} 45%, ${S.redDeep} 100%)` }}
      >
        <div aria-hidden className="absolute inset-0" style={bandhani('rgba(255,214,140,0.2)', 20)} />
        {!isPreview && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
            {PETALS.map((p, i) => (
              <span
                key={i}
                className="sp-petal"
                style={{ left: `${p.left}%`, ['--dur' as string]: `${p.dur}s`, ['--delay' as string]: `${p.delay}s`, ['--dx' as string]: `${p.dx}px` }}
              >
                <i style={{ ['--s' as string]: `${p.size}px`, ['--c' as string]: p.color, ['--spin' as string]: `${p.spin}s` }} />
              </span>
            ))}
          </div>
        )}

        <Toran className="absolute inset-x-0 top-0 z-[2] block w-full" />

        <div className="relative z-[3] mx-auto flex w-full max-w-[30rem] flex-col items-center px-[8cqi] pb-[4cqi] text-center" style={{ minHeight: heroH, paddingTop: 'min(30cqi, 150px)' }}>
          {invocation.length > 0 && (
            <div className="sp-rise" style={{ ['--d' as string]: '250ms' }}>
              <p className="leading-[1.35]" style={{ fontFamily: deva, fontWeight: 600, fontSize: 'clamp(19px, 5.6cqi, 24px)', color: S.goldLight }}>
                {invocation[0]}
              </p>
              {invocation.slice(1).map((l, i) => (
                <p key={i} className="mt-0.5 leading-[1.5]" style={{ fontFamily: shloka, fontSize: 'clamp(14px, 4cqi, 16px)', color: S.ivoryFaint }}>
                  {l}
                </p>
              ))}
            </div>
          )}

          <div className="flex w-full flex-1 flex-col items-center justify-center py-[4cqi]">
            <p className="sp-rise" style={{ color: S.ivorySoft, ['--d' as string]: '380ms' }}>
              <span style={{ fontFamily: deva, fontSize: 'clamp(15px, 4.4cqi, 18px)' }}>शुभ विवाह</span>
              <span className="uppercase" style={{ fontFamily: engraved, fontSize: 'clamp(12px, 3.6cqi, 14px)', letterSpacing: '0.3em' }}> · The wedding of</span>
            </p>
            <h1 className="mt-[3cqi]" style={{ fontFamily: display, fontWeight: 400 }}>
              <span className="sp-rise sp-foil block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '480ms' }}>
                {bride}
              </span>
              <span className="sp-rise my-[2cqi] flex items-center justify-center gap-3" style={{ ['--d' as string]: '620ms' }}>
                <span aria-hidden className="h-px w-[12cqi]" style={{ background: S.ruleOnRed }} />
                <span style={{ fontFamily: deva, fontSize: 'clamp(18px, 5.4cqi, 22px)', color: S.goldLight }}>संग</span>
                <span aria-hidden className="h-px w-[12cqi]" style={{ background: S.ruleOnRed }} />
              </span>
              <span className="sp-rise sp-foil block text-balance leading-[1.02]" style={{ fontSize: nameSize, ['--d' as string]: '760ms' }}>
                {groom}
              </span>
            </h1>

            <div className="sp-rise mt-[6cqi]" style={{ ['--d' as string]: '920ms' }}>
              {date ? (
                <>
                  <p className="text-balance leading-[1.3]" style={{ fontFamily: engraved, fontSize: 'clamp(19px, 5.6cqi, 23px)', color: S.ivory }}>
                    <span className="block">{date.weekday},</span>
                    the {ordinalWords(date.day)} of {date.month}
                  </p>
                  <p className="mt-1" style={{ fontFamily: text, fontSize: 17, fontWeight: 500, color: S.ivorySoft }}>
                    {date.year}
                    {time && ` · ${time}`}
                  </p>
                </>
              ) : (
                <p style={{ fontFamily: engraved, fontSize: 21, color: S.ivory }}>
                  Date to be announced{time && <span style={{ fontFamily: text, fontSize: 17, color: S.ivorySoft }}> · {time}</span>}
                </p>
              )}
              {venue && (
                <p className="mx-auto mt-4 max-w-[17rem] text-balance uppercase leading-[1.4]" style={{ fontFamily: engraved, fontSize: 15, letterSpacing: '0.16em', color: S.goldLight }}>
                  {venue}
                </p>
              )}
            </div>
          </div>
          <div className="sp-rise flex w-full items-end justify-between" style={{ ['--d' as string]: '1050ms' }}>
            <Diya className="w-[19cqi] max-w-[92px]" />
            <Kalash className="w-[24cqi] max-w-[118px]" />
            <Diya className="w-[19cqi] max-w-[92px]" delay={0.6} />
          </div>
        </div>

        {phase === 'lowering' && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[40]">
            {BURST.map((b, i) => (
              <span
                key={i}
                className="sp-burst"
                style={{ ['--bx' as string]: `${b.bx}px`, ['--by' as string]: `${b.by}px`, ['--br' as string]: `${b.br}deg`, ['--s' as string]: `${b.size}px`, ['--c' as string]: b.color, ['--delay' as string]: `${b.delay}s` }}
              />
            ))}
          </div>
        )}

        {/* ── The antarpat ───────────────────────────────────────────── */}
        {phase !== 'done' && (
          <div className={`sp-stage absolute inset-0 z-30 ${phase === 'lowering' ? 'is-lowering' : ''}`} style={{ backgroundColor: S.redDark }}>
            <div aria-hidden className="sp-fade absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 50% 40%, rgba(255,170,90,0.16), transparent 70%)' }} />
            <div className="absolute left-1/2 top-[5%] z-[2] w-[min(98cqi,34rem)] -translate-x-1/2">
              <div className="sp-rod relative h-[12px] rounded-full" style={{ background: `linear-gradient(180deg, ${S.goldLight}, ${S.gold} 45%, ${S.goldDeep})`, boxShadow: '0 6px 14px -6px rgba(0,0,0,0.6)' }}>
                <span aria-hidden className="absolute -left-1 top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${S.goldLight}, ${S.goldDeep})` }} />
                <span aria-hidden className="absolute -right-1 top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${S.goldLight}, ${S.goldDeep})` }} />
              </div>
            </div>
            <div className="absolute bottom-[6%] left-1/2 top-[calc(5%+8px)] w-[min(90cqi,31rem)] -translate-x-1/2" style={{ perspective: 1000 }}>
              <div
                className="sp-cloth relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-[7cqi] text-center"
                style={{
                  background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 9%), linear-gradient(180deg, #C2142C 0%, ${S.red} 60%, #84101F 100%)`,
                  boxShadow: '0 30px 60px -20px rgba(0,0,0,0.65)',
                }}
              >
                <div aria-hidden className="absolute inset-0" style={bandhani('rgba(255,220,150,0.38)', 16)} />
                <div aria-hidden className="absolute inset-[10px] border-[3px]" style={{ borderColor: S.gold }} />
                <div aria-hidden className="absolute inset-[17px] border border-dashed" style={{ borderColor: 'rgba(247,219,142,0.55)' }} />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[10px]" style={{ background: `radial-gradient(circle at 50% 0, ${S.gold} 0 4px, transparent 4.5px) 0 0 / 16px 10px repeat-x` }} />
                {(['left-[26px] top-[26px]', 'right-[26px] top-[26px]', 'bottom-[26px] left-[26px]', 'bottom-[26px] right-[26px]'] as const).map((pos) => (
                  <Butti key={pos} className={`absolute ${pos} w-[min(9cqi,40px)]`} />
                ))}
                {invocation[0] && (
                  <p className="absolute inset-x-0 top-[7%] px-12" style={{ fontFamily: deva, fontWeight: 600, fontSize: 'clamp(15px, 4.4cqi, 18px)', color: S.goldLight }}>
                    {invocation[0]}
                  </p>
                )}
                <div className="relative z-[1] flex flex-col items-center">
                  <Kalash className="w-[min(26cqi,120px)]" style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))' }} />
                  <p className="mt-[3cqi]" style={{ fontFamily: deva, fontWeight: 600, fontSize: 'clamp(19px, 5.8cqi, 24px)', color: S.goldLight }}>
                    ॥ शुभ विवाह ॥
                  </p>
                  {guest && (
                    <p className="mt-[3cqi] text-balance" style={{ fontFamily: engraved, fontSize: 'clamp(16px, 4.6cqi, 19px)', color: S.ivory }}>
                      Dear {guest},
                    </p>
                  )}
                  <p className="sp-foil mt-[2.5cqi] text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 9cqi, 40px)' }}>
                    {couple}
                  </p>
                  {date && (
                    <p className="mt-1.5" style={{ fontFamily: engraved, fontSize: 15, letterSpacing: '0.14em', color: S.ivorySoft }}>
                      {date.day} {date.month} {date.year}
                    </p>
                  )}
                </div>
                <p className="sp-hint absolute bottom-[7%] left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2" style={{ fontFamily: text, fontSize: 15, fontWeight: 500, color: S.redDeep, background: S.goldLight }}>
                  Tap to lower the antarpat
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={lower}
              disabled={phase !== 'veiled'}
              aria-label={`Lower the antarpat and open ${couple}'s wedding invitation`}
              className="absolute inset-0 z-[5] cursor-pointer disabled:cursor-default"
            />
          </div>
        )}
      </section>

      {phase === 'done' && (
        <>
          <SectionNav
            items={nav}
            padRight={music && !isPreview ? 104 : 20}
            className="sticky top-0 z-30 border-b"
            style={{ background: 'rgba(106,7,18,0.97)', borderColor: S.ruleOnRed }}
            linkStyle={{ fontFamily: engraved, fontSize: 15, color: S.ivorySoft }}
            activeColor={S.goldLight}
            underline={S.gold}
          />

          {/* ── The invitation proper: families and blessings ──────────── */}
          {hasFamilies && (
            <section id="sp-invite" className="px-6 pb-16 pt-14 text-center" style={{ ...cream, scrollMarginTop: 56 }}>
              <div className="mx-auto max-w-[32rem]">
                {data.message?.trim() && (
                  <Reveal disabled={isPreview}>
                    <FloralMark className="mx-auto block w-[150px]" />
                    <p className="mx-auto mt-5 max-w-[24rem] text-balance leading-[1.45]" style={{ fontFamily: engraved, fontSize: 'clamp(21px, 6.2cqi, 25px)', color: S.ink }}>
                      {data.message}
                    </p>
                  </Reveal>
                )}

                {couplePhoto && (
                  <Reveal disabled={isPreview} className="mx-auto mt-10 max-w-[22rem] p-[6px]" style={{ background: `linear-gradient(135deg, ${S.goldLight}, ${S.goldDeep})`, borderRadius: '999px 999px 8px 8px' }}>
                    <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ borderRadius: '999px 999px 4px 4px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={couplePhoto} alt={couple} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </Reveal>
                )}

                {(data.brideParents?.trim() || data.groomParents?.trim() || portraits.bride || portraits.groom) && (
                  <Reveal disabled={isPreview} className="sp-fam mt-12 grid items-start gap-x-4 gap-y-10">
                    {[
                      { name: bride, parents: data.brideParents?.trim(), photo: portraits.bride, letter: letters[0] },
                      { name: groom, parents: data.groomParents?.trim(), photo: portraits.groom, letter: letters[1] },
                    ].map((p) => (
                      <div key={p.name} className="text-center">
                        <div className="mx-auto w-[min(100%,148px)] p-[4px]" style={{ background: `linear-gradient(135deg, ${S.goldLight}, ${S.goldDeep})`, borderRadius: '999px 999px 6px 6px' }}>
                          <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ borderRadius: '999px 999px 3px 3px', background: S.red, ...bandhani('rgba(255,214,140,0.25)', 12) }}>
                            {p.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center pt-[16%]" style={{ fontFamily: display, fontSize: 52, color: S.goldLight }}>
                                {p.letter}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-4 leading-[1.1]" style={{ fontFamily: display, fontSize: 27, color: S.red }}>
                          {p.name}
                        </p>
                        {p.parents && (
                          <p className="mx-auto mt-2 max-w-[15rem] text-balance leading-[1.45]" style={{ fontFamily: text, fontSize: 15.5, color: S.soft }}>
                            {p.parents}
                          </p>
                        )}
                      </div>
                    ))}
                  </Reveal>
                )}

                {blessings.length > 0 && (
                  <Reveal disabled={isPreview} className="mx-auto mt-12 max-w-[24rem] border-t pt-8" style={{ borderColor: S.rule }}>
                    <p style={{ fontFamily: engraved, fontSize: 18, color: S.goldDeep }}>With the blessings of</p>
                    <ul className="mt-3 space-y-1.5">
                      {blessings.map((b, i) => (
                        <li key={`${b}-${i}`} className="text-balance leading-[1.35]" style={{ fontFamily: engraved, fontSize: 19, color: S.ink }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          <Countdown date={data.date} time={data.time} enabled={!isPreview} />

          {/* ── Every function ─────────────────────────────────────────── */}
          {functions.length > 0 && (
            <section id="sp-functions" className="px-5 pb-16 pt-16" style={{ ...cream, scrollMarginTop: 56 }}>
              <div className="mx-auto max-w-[34rem]">
                <Reveal disabled={isPreview}>
                  <Heading sub="We request the pleasure of your company at each of the celebrations">The Celebrations</Heading>
                </Reveal>
                <div className="sp-fns mt-9 grid gap-6">
                  {functions.map(({ fn, day }, i) => (
                    <Reveal key={`${fn.name}-${i}`} disabled={isPreview} delay={(i % 2) * 70}>
                      <FunctionCard fn={fn} day={day} couple={couple} data={data} mainDirections={directions} isPreview={isPreview} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── The seven steps, and the rituals of the day ─────────────── */}
          <section id="sp-vows" className="relative" style={{ background: `radial-gradient(90% 55% at 50% 30%, #3A0610 0%, ${S.redDark} 55%, #250207 100%)`, color: S.ivory, scrollMarginTop: 56 }}>
            <Zari />
            <div className="mx-auto max-w-[32rem] px-5 pb-14 pt-14">
              <Reveal disabled={isPreview}>
                <Heading light sub="The heart of the wedding: seven steps around the sacred fire, a vow with each.">Saptapadi</Heading>
              </Reveal>
              <div className="mt-8">
                <Saptapadi isPreview={isPreview} />
              </div>
            </div>
            <Zari />
          </section>

          <section className="px-6 pb-16 pt-14" style={cream}>
            <div className="mx-auto max-w-[32rem]">
              <Reveal disabled={isPreview}>
                <Heading sub="For guests who are new to a Hindu wedding — what happens, and why.">The Rituals of the Day</Heading>
              </Reveal>
              <Reveal disabled={isPreview} className="mt-8 border-t" style={{ borderColor: S.rule }}>
                {RITUALS.map((r, i) => (
                  <details key={r.en} className="border-b" style={{ borderColor: S.rule }}>
                    <summary className="flex items-center justify-between gap-4 py-4">
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="w-6 shrink-0 text-right tabular-nums" style={{ fontFamily: engraved, fontSize: 15, color: S.goldDeep }}>
                          {i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block leading-[1.2]" style={{ fontFamily: display, fontSize: 21, color: S.red }}>
                            {r.en}
                          </span>
                          <span className="block" style={{ fontFamily: deva, fontSize: 15, color: S.soft }}>
                            {r.hi}
                          </span>
                        </span>
                      </span>
                      <svg viewBox="0 0 20 20" className="sp-plus h-4 w-4 shrink-0" fill="none" stroke={S.goldDeep} strokeWidth={1.6} aria-hidden>
                        <path d="M10 3v14M3 10h14" strokeLinecap="round" />
                      </svg>
                    </summary>
                    <p className="pb-5 pl-9 pr-6 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: S.soft }}>
                      {r.text}
                    </p>
                  </details>
                ))}
              </Reveal>
            </div>
          </section>

          {/* ── Our story ─────────────────────────────────────────────────── */}
          {story.length > 0 && (
            <section id="sp-story" className="px-6 pb-16 pt-14" style={{ ...cream, scrollMarginTop: 56 }}>
              <div className="mx-auto max-w-[32rem]">
                <Reveal disabled={isPreview}>
                  <Heading>Our Story</Heading>
                </Reveal>
                <ol className="relative mt-9">
                  <span aria-hidden className="absolute bottom-3 left-[13px] top-3 w-px" style={{ background: S.rule }} />
                  {story.map((s, i) => (
                    <Reveal as="li" key={`${s.title}-${i}`} disabled={isPreview} className="relative pb-9 pl-12 last:pb-0">
                      <svg viewBox="0 0 28 28" className="absolute left-0 top-1 h-7 w-7" aria-hidden>
                        <circle cx={14} cy={14} r={12} fill={S.cream} stroke={S.gold} strokeWidth={1} />
                        <circle cx={14} cy={14} r={6.5} fill={S.marigold} />
                        <circle cx={14} cy={14} r={5} fill="none" stroke={S.marigoldDeep} strokeWidth={2.6} strokeDasharray="1.6 1.3" />
                        <circle cx={14} cy={14} r={2} fill={S.marigoldDeep} />
                      </svg>
                      {s.when && (
                        <p className="leading-none" style={{ fontFamily: display, fontSize: 28, color: S.sindoor }}>
                          {s.when}
                        </p>
                      )}
                      <h3 className="mt-2 leading-[1.2]" style={{ fontFamily: engraved, fontSize: 22, color: S.red }}>
                        {s.title}
                      </h3>
                      {s.text && (
                        <p className="mt-1.5 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: S.soft }}>
                          {s.text}
                        </p>
                      )}
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* ── Photographs ──────────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section id="sp-photos" className="px-5 pb-16 pt-14" style={{ background: S.red, ...bandhani(), scrollMarginTop: 56 }}>
              <div className="mx-auto max-w-[34rem]">
                <Reveal disabled={isPreview}>
                  <Heading light>From Our Album</Heading>
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
                          className="block w-full p-[4px] text-left"
                          style={{ background: `linear-gradient(135deg, ${S.goldLight}, ${S.goldDeep})`, borderRadius: big ? '999px 999px 6px 6px' : 6, cursor: isPreview ? 'default' : 'zoom-in' }}
                        >
                          <span className={`relative block w-full overflow-hidden ${big ? 'aspect-[4/5]' : 'aspect-[3/4]'}`} style={{ borderRadius: big ? '999px 999px 3px 3px' : 3 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                          </span>
                        </button>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── The venue, travel and stay ───────────────────────────────── */}
          <section id="sp-venue" className="px-6 pb-16 pt-14 text-center" style={{ ...cream, scrollMarginTop: 56 }}>
            <div className="mx-auto max-w-[32rem]">
              <Reveal disabled={isPreview}>
                <Heading>The Venue</Heading>
                <h3 className="mx-auto mt-7 max-w-[22rem] text-balance leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 36px)', color: S.red }}>
                  {venue || 'Venue to be announced'}
                </h3>
                {data.venueAddress && (
                  <p className="mx-auto mt-2 max-w-[20rem] text-balance leading-[1.5]" style={{ fontFamily: text, fontSize: 16, color: S.soft }}>
                    {data.venueAddress}
                  </p>
                )}
                <p className="mt-3" style={{ fontFamily: text, fontSize: 16, fontWeight: 500, color: S.ink }}>
                  {date ? date.long : 'Date to be announced'}
                  {time && ` · ${time}`}
                </p>
                {data.dressCode?.trim() && (
                  <p className="mx-auto mt-4 max-w-[20rem] text-balance leading-[1.45]" style={{ fontFamily: engraved, fontSize: 18, color: S.ink }}>
                    <span className="block text-[13px] uppercase" style={{ fontFamily: text, letterSpacing: '0.2em', color: S.goldDeep }}>
                      Dress code
                    </span>
                    {data.dressCode}
                  </p>
                )}
                <div className="mx-auto mt-7 flex max-w-[20rem] flex-col gap-3">
                  <Act href={directions} isPreview={isPreview} className={`${btn} hover:bg-[#7E0C18]`} style={{ background: S.red, color: S.ivory }}>
                    {Icon.pin}
                    Get directions
                  </Act>
                  <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(155,15,30,0.05)]`} style={{ borderColor: S.red, color: S.red }}>
                    {Icon.calendar}
                    Add to calendar
                  </Act>
                </div>
              </Reveal>

              {travel.length > 0 && (
                <Reveal disabled={isPreview} className="relative mt-12 border px-6 py-8 text-left" style={{ borderColor: S.rule, background: S.card }}>
                  <span aria-hidden className="pointer-events-none absolute inset-[5px] border" style={{ borderColor: 'rgba(168,116,26,0.18)' }} />
                  <h3 className="relative text-center" style={{ fontFamily: display, fontSize: 26, color: S.red }}>
                    Travel &amp; stay
                  </h3>
                  <div className="relative mt-4 space-y-3">
                    {travel.map((p, i) => (
                      <p key={i} className="leading-[1.65]" style={{ fontFamily: text, fontSize: 16, color: S.ink }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>

          {/* ── For our guests: people to call, questions ─────────────────── */}
          {hasGuests && (
            <section id="sp-guests" className="px-6 pb-16" style={{ ...cream, scrollMarginTop: 56 }}>
              <div className="mx-auto max-w-[32rem]">
                <Reveal disabled={isPreview}>
                  <Heading>For Our Guests</Heading>
                </Reveal>
                {contacts.length > 0 && (
                  <Reveal disabled={isPreview} className="mt-8">
                    <h3 className="text-center" style={{ fontFamily: engraved, fontSize: 21, color: S.red }}>
                      If you need anything, call
                    </h3>
                    <ul className="mt-4 border-t" style={{ borderColor: S.rule }}>
                      {contacts.map((c, i) => {
                        const [who, ...role] = c.name.split(/\s+[—–-]\s+/)
                        const tel = telHref(c.phone)
                        const wa = whatsappHref(c.phone, `Namaste ${who.split(' ')[0]}, I'm a guest at ${couple}'s wedding — `)
                        return (
                          <li key={`${c.name}-${i}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b py-4" style={{ borderColor: S.rule }}>
                            <div className="min-w-0">
                              <p style={{ fontFamily: engraved, fontSize: 20, color: S.ink }}>{who}</p>
                              {role.length > 0 && <p style={{ fontFamily: text, fontSize: 15, color: S.soft }}>{cap(role.join(' — '))}</p>}
                            </div>
                            {(tel || wa) && (
                              <div className="flex gap-2">
                                <Act href={tel} external={false} isPreview={isPreview} label={`Call ${who}`} className={`${btn} border !px-4 !py-2.5 hover:bg-[rgba(155,15,30,0.05)]`} style={{ borderColor: S.rule, color: S.red }}>
                                  {Icon.phone}
                                  Call
                                </Act>
                                <Act href={wa} isPreview={isPreview} label={`WhatsApp ${who}`} className={`${btn} border !px-4 !py-2.5 hover:bg-[rgba(155,15,30,0.05)]`} style={{ borderColor: S.rule, color: S.red }}>
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
                    <h3 className="text-center" style={{ fontFamily: engraved, fontSize: 21, color: S.red }}>
                      Questions you may have
                    </h3>
                    <div className="mt-4 border-t" style={{ borderColor: S.rule }}>
                      {faq.map((f, i) => (
                        <details key={`${f.q}-${i}`} className="border-b" style={{ borderColor: S.rule }}>
                          <summary className="flex items-start justify-between gap-4 py-4">
                            <span style={{ fontFamily: engraved, fontSize: 19, lineHeight: 1.35, color: S.ink }}>{f.q}</span>
                            <svg viewBox="0 0 20 20" className="sp-plus mt-1 h-4 w-4 shrink-0" fill="none" stroke={S.goldDeep} strokeWidth={1.6} aria-hidden>
                              <path d="M10 3v14M3 10h14" strokeLinecap="round" />
                            </svg>
                          </summary>
                          {f.a && (
                            <p className="pb-5 pr-8 leading-[1.6]" style={{ fontFamily: text, fontSize: 16, color: S.soft }}>
                              {f.a}
                            </p>
                          )}
                        </details>
                      ))}
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── Reply ────────────────────────────────────────────────────── */}
          <section id="sp-rsvp" className="relative text-center" style={{ background: S.red, color: S.ivory, scrollMarginTop: 56, ...bandhani() }}>
            <Zari />
            <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-16">
              {reply ? (
                <Heading light sub={rsvpBy ? `Kindly reply by ${rsvpBy.weekday}, the ${ordinalWords(rsvpBy.day)} of ${rsvpBy.month}` : 'The favour of a reply is requested'}>
                  Kindly Reply
                </Heading>
              ) : (
                <Heading light>Save the Date</Heading>
              )}
              <p className="mt-6" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)', color: S.goldLight }}>
                {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
              </p>
              <p className="mt-1 text-balance" style={{ fontFamily: text, fontSize: 16, color: S.ivorySoft }}>
                {[venue, time].filter(Boolean).join(' · ')}
              </p>
              {!reply && rsvpBy && (
                <p className="mt-3" style={{ fontFamily: text, fontSize: 16, color: S.ivorySoft }}>
                  Kindly reply by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}
                </p>
              )}
              <div className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3">
                <Act href={reply} isPreview={isPreview} className={`${btn} hover:bg-[#EFCB72]`} style={{ background: S.goldLight, color: S.redDeep }}>
                  {Icon.whatsapp}
                  Reply on WhatsApp
                </Act>
                <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(247,219,142,0.08)]`} style={{ borderColor: S.ruleOnRed, color: S.ivory }}>
                  {Icon.calendar}
                  Add to calendar
                </Act>
              </div>
              {live && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: S.ruleOnRed }}>
                  <p style={{ fontFamily: engraved, fontSize: 21 }}>Can&rsquo;t be with us in person?</p>
                  <p className="mt-1" style={{ fontFamily: text, fontSize: 15, color: S.ivorySoft }}>
                    The ceremony will be streamed for family and friends far away.
                  </p>
                  <Act href={live} isPreview={isPreview} className={`${btn} mt-4 border hover:bg-[rgba(247,219,142,0.08)]`} style={{ borderColor: S.ruleOnRed, color: S.ivory }}>
                    {Icon.play}
                    Watch live
                  </Act>
                </div>
              )}
              {hashtag && (
                <div className="mt-10 border-t pt-8" style={{ borderColor: S.ruleOnRed }}>
                  <p style={{ fontFamily: text, fontSize: 15, color: S.ivorySoft }}>Share your pictures with</p>
                  <p className="mt-1 break-words" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)', color: S.goldLight }}>
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                  </p>
                </div>
              )}
            </Reveal>
            <Zari />
          </section>

          {eventId && (
            <div id="sp-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection
                eventId={eventId}
                theme={WISHES_THEME}
                title="Ashirvad"
                intro={`Leave a blessing for ${bride} and ${groom}. It appears here for every guest.`}
                noun="blessing"
              />
            </div>
          )}

          {/* ── Foot: under Dhruva and Arundhati ────────────────────────── */}
          <footer className="relative text-center" style={{ background: S.night, color: S.ivory }}>
            <NightSky className="block h-auto w-full" />
            <div className="relative -mt-[6cqi] px-6 pb-10">
              <p className="sp-foil" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 34px)' }}>
                {couple}
              </p>
              {date && (
                <p className="mt-1 text-[13px] uppercase tabular-nums" style={{ fontFamily: engraved, letterSpacing: '0.28em', color: S.goldLight }}>
                  {date.day} · {date.monthShort} · {date.year}
                </p>
              )}
              <p className="mx-auto mt-4 max-w-[22rem] text-balance leading-[1.55]" style={{ fontFamily: text, fontSize: 15, color: S.ivoryFaint }}>
                Steadfast as Dhruva, devoted as Arundhati beside Vasishtha — the stars a new couple is shown on their wedding night.
              </p>
              <div className="mt-8">
                <Credit isPreview={isPreview} color="rgba(255,244,223,0.45)" linkColor={S.ivorySoft} />
              </div>
            </div>
          </footer>

          {lb.open !== null && (
            <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(30,3,8,0.96)" color={S.ivory} font={text} />
          )}
        </>
      )}
    </div>
  )
}
