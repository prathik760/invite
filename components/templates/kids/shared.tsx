'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from '../WishesSection'
import { calendarHref, dateParts, galleryImages, mapsHref, musicSrc, parseSchedule, timeLabel, useCountdown, type DateParts, type ScheduleItem } from '../kit/core'
import { Credit, DirectionsLink, Reveal, useOpenWhileEditing } from '../kit/ui'
import { ChannelIcon, ordinal, rsvpChannels } from '../kit/party'
import { numberWords, ordinalWords } from '../kit/words'
import type { InviteTheme } from '../kit/theme'

/*
 * The kids' party designs (KidsParty.tsx): what all six share.
 *
 *   useParty      the invitation's details, worked out once
 *   useOpening    gate → play → open: the tap-to-start scene that plays like a short video
 *   useSound      the birthday tune: a music box played in the browser (Happy Birthday, a tune in
 *                 the public domain), or the host's own song when they add one
 *   PartyBody     every section below the opening, drawn in each theme's own skin (skins.tsx)
 */

export type Kind = 'dinosaur' | 'space' | 'superhero' | 'unicorn' | 'jungle' | 'cars'

/** A theme's colours for the page around its pictures. */
export interface Tokens {
  page: string
  card: string
  ink: string
  soft: string
  faint: string
  line: string
  a: string
  onA: string
  b: string
  onB: string
  c: string
  /** Small accent text on the page; dark enough to read. */
  accentText: string
  dark: boolean
}

// ─── The details ────────────────────────────────────────────────────────────

const AGE_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']

/** "5", "5th", "five", "fifth" -> 5. */
function ageOf(value?: string): number | null {
  const s = (value || '').trim().toLowerCase()
  if (!s) return null
  const m = s.match(/\d{1,3}/)
  if (m) return Number(m[0]) || null
  const w = AGE_WORDS.findIndex((word) => new RegExp(`\\b${word}\\b`).test(s))
  if (w > 0) return w
  const o = ORDINALS.findIndex((word) => word && new RegExp(`\\b${word}\\b`).test(s))
  return o > 0 ? o : null
}

function minutesOf(t?: string): number | null {
  const m = (t || '').match(/^(\d{1,2}):(\d{2})/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

export interface Party {
  name: string
  first: string
  age: number | null
  /** "5", or the child's initial when no age is given: what the pictures show. */
  mark: string
  ageWord: string
  ordinalWord: string
  /** "Aarav’s 5th birthday" */
  what: string
  parents: string
  theme: string
  date: DateParts | null
  time: string
  end: string
  countdown: ReturnType<typeof useCountdown>
  schedule: ScheduleItem[]
  photos: string[]
  photo: string | null
  directions: string | null
  calendar: string | null
  dress: string
  notes: string[]
  message: string
  venue: string
  address: string
}

export function useParty(data: Record<string, string>, isPreview: boolean, fallbackName: string): Party {
  const name = data.celebrantName?.trim() || fallbackName
  const first = name.split(/\s+/)[0]
  const age = ageOf(data.age)
  const startMin = minutesOf(data.time)
  const endMin = minutesOf(data.endTime)
  const ends = endMin !== null && startMin !== null && endMin > startMin
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const ordinalWord = age !== null ? (age <= 10 ? ORDINALS[age] : ordinalWords(age)) : ''
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  return {
    name,
    first,
    age,
    mark: age !== null ? String(age) : Array.from(first)[0]?.toUpperCase() || '',
    ageWord: age !== null ? (age <= 12 ? AGE_WORDS[age] : numberWords(age)) : '',
    ordinalWord,
    what: age !== null ? `${first}’s ${ordinal(age)} birthday` : `${first}’s birthday`,
    parents: data.parentNames?.trim() || '',
    theme: data.theme?.trim() || '',
    date: dateParts(data.date),
    time: timeLabel(data.time),
    end: ends ? timeLabel(data.endTime) : '',
    countdown,
    schedule,
    photos,
    photo: data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? data.celebrantPhoto : null,
    directions: mapsHref(data.mapsUrl, data.venue, data.venueAddress),
    calendar: calendarHref(age !== null ? `${first}’s ${ordinalWord} birthday party` : `${first}’s birthday party`, data.date, data.time, place, ends ? (endMin! - startMin!) / 60 : 3),
    dress: data.dressCode?.trim() || '',
    notes: [data.guestNote?.trim(), data.giftNote?.trim()].filter(Boolean) as string[],
    message: data.message?.trim() || '',
    venue: data.venue?.trim() || '',
    address: data.venueAddress?.trim() || '',
  }
}

// ─── The birthday tune ──────────────────────────────────────────────────────

/** Happy Birthday (Mildred and Patty Hill, 1893: public domain), as [note, beats]. */
const TUNE: [string, number][] = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
]
/** A soft bass note at the start of each bar: [beat, note]. */
const BASS: [number, string][] = [[1, 'C3'], [4, 'G2'], [7, 'G2'], [10, 'C3'], [13, 'C3'], [16, 'F2'], [19, 'C3'], [22, 'G2'], [25, 'C3']]
const BEAT = 0.42
const SEMI: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const freq = (n: string) => 440 * 2 ** ((SEMI[n[0]] + 12 * (Number(n[n.length - 1]) + 1) - 69) / 12)
/** How long the tune plays, in ms. */
export const TUNE_MS = Math.round((26 + 1.5) * BEAT * 1000)

type AudioCtx = typeof AudioContext

/** Plays the tune once as a music box. Returns a stop function, or null where audio is unavailable. */
function playTune(): (() => void) | null {
  const Ctx: AudioCtx | undefined = typeof window === 'undefined' ? undefined : window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtx }).webkitAudioContext
  if (!Ctx) return null
  let ctx: AudioContext
  try {
    ctx = new Ctx()
  } catch {
    return null
  }
  const master = ctx.createGain()
  master.gain.value = 0.32
  master.connect(ctx.destination)
  const t0 = ctx.currentTime + 0.06
  const pluck = (f: number, at: number, len: number, gain: number, type: OscillatorType) => {
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(gain, at + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, at + len)
    g.connect(master)
    for (const [mult, share] of [[1, 1], [2, 0.28], [3, 0.08]] as const) {
      const o = ctx.createOscillator()
      o.type = type
      o.frequency.value = f * mult
      const s = ctx.createGain()
      s.gain.value = share
      o.connect(s)
      s.connect(g)
      o.start(at)
      o.stop(at + len + 0.05)
    }
  }
  let beat = 0
  for (const [n, b] of TUNE) {
    pluck(freq(n), t0 + beat * BEAT, Math.max(0.5, b * BEAT * 1.6), 0.5, 'sine')
    beat += b
  }
  for (const [b, n] of BASS) pluck(freq(n), t0 + b * BEAT, 1.1, 0.22, 'triangle')
  return () => {
    try {
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05)
      window.setTimeout(() => ctx.close().catch(() => {}), 200)
    } catch {
      /* already closed */
    }
  }
}

/**
 * The opening's sound: the host's own song when they gave one (looping, like every design's), or
 * the music-box tune. Both start only from a tap, which browsers require.
 */
export function useSound(musicUrl?: string) {
  const song = musicSrc(musicUrl)
  const audio = useRef<HTMLAudioElement | null>(null)
  const stopTune = useRef<(() => void) | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const [playing, setPlaying] = useState(false)

  const stop = useCallback(() => {
    if (song) audio.current?.pause()
    stopTune.current?.()
    stopTune.current = null
    window.clearTimeout(timer.current)
    setPlaying(false)
  }, [song])

  const start = useCallback(() => {
    if (song) {
      audio.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
      return
    }
    stopTune.current?.()
    stopTune.current = playTune()
    if (!stopTune.current) return
    setPlaying(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      stopTune.current = null
      setPlaying(false)
    }, TUNE_MS)
  }, [song])

  useEffect(() => () => {
    stopTune.current?.()
    window.clearTimeout(timer.current)
  }, [])

  const element = song ? <audio ref={audio} src={song} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /> : null
  return { start, stop, toggle: () => (playing ? stop() : start()), playing, element, hasSong: Boolean(song) }
}

/** The sound button, top right, once the invitation is open. Not called "music": the live demos press that one. */
export function SoundButton({ playing, onToggle, isPreview, t }: { playing: boolean; onToggle: () => void; isPreview: boolean; t: Tokens }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Turn the sound off' : 'Play the birthday tune'}
      aria-pressed={playing}
      className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-[calc(var(--invite-top,0px)+0.75rem)] z-40 flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] font-bold backdrop-blur`}
      style={{ color: t.ink, background: t.dark ? 'rgba(10,12,40,0.72)' : 'rgba(255,255,255,0.9)', border: `1px solid ${t.line}` }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        {playing ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6h4l5 4V5L8 9H4Zm12.5-.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        )}
      </svg>
      {playing ? 'Sound on' : 'Tune'}
    </button>
  )
}

// ─── The opening ────────────────────────────────────────────────────────────

export type Phase = 'gate' | 'play' | 'open'

/**
 * gate (tap to start) → play (the scene runs, `playMs` long) → open (the invitation).
 * Passed at once while the builder is editing (kit/ui useOpenWhileEditing), and for visitors who
 * turn animation off.
 */
export function useOpening(playMs: number, onStart: () => void) {
  const [phase, setPhase] = useState<Phase>('gate')
  useOpenWhileEditing(phase, setPhase, 'gate', 'open')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const start = useCallback(() => {
    if (phase !== 'gate') return
    onStart()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('play')
    timer.current = window.setTimeout(() => setPhase('open'), playMs)
  }, [phase, playMs, onStart])
  const skip = useCallback(() => {
    window.clearTimeout(timer.current)
    setPhase('open')
  }, [])
  return { phase, start, skip }
}

/** A burst of the theme's confetti when the invitation opens. */
export function Confetti({ shapes, colors, count = 26, seed = 3 }: { shapes: string[]; colors: string[]; count?: number; seed?: number }) {
  const bits = useMemo(() => {
    let s = seed
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: count }, (_, i) => ({
      left: `${(r() * 100).toFixed(1)}%`,
      delay: `${Math.round(r() * 700)}ms`,
      dur: `${Math.round(2200 + r() * 1600)}ms`,
      x: `${Math.round((r() - 0.5) * 120)}px`,
      rot: `${Math.round((r() - 0.5) * 720)}deg`,
      size: Math.round(10 + r() * 12),
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
    }))
  }, [shapes, colors, count, seed])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[100svh] overflow-hidden">
      {bits.map((b, i) => (
        <svg key={i} viewBox="-10 -10 20 20" className="kx-confetti absolute -top-6" style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.dur, ['--x' as string]: b.x, ['--r' as string]: b.rot } as CSSProperties}>
          <path d={b.shape} fill={b.color} />
        </svg>
      ))}
    </div>
  )
}

// ─── RSVP: who's coming, sent to the host ───────────────────────────────────

function Stepper({ label, value, set, t }: { label: string; value: number; set: (n: number) => void; t: Tokens }) {
  const btn: CSSProperties = { width: 40, height: 40, borderRadius: 999, border: `2px solid ${t.dark ? 'rgba(255,255,255,0.45)' : t.ink}`, color: t.ink, background: 'transparent', fontSize: 22, fontWeight: 700, lineHeight: 1 }
  return (
    <div className="flex items-center justify-between gap-3">
      <span style={{ fontSize: 17, fontWeight: 700 }}>{label}</span>
      <span className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer: ${label}`} disabled={value <= 0} onClick={() => set(Math.max(0, value - 1))} className="kx-press disabled:opacity-35" style={btn}>−</button>
        <span className="w-6 text-center tabular-nums" style={{ fontSize: 22, fontWeight: 800 }} aria-live="polite">{value}</span>
        <button type="button" aria-label={`More: ${label}`} disabled={value >= 9} onClick={() => set(Math.min(9, value + 1))} className="kx-press disabled:opacity-35" style={btn}>+</button>
      </span>
    </div>
  )
}

// ─── Every section below the opening, in the theme's skin ───────────────────

export interface Skin {
  kind: Kind
  t: Tokens
  /** The page behind the sections: a background, and the class that lays the sections out. */
  bodyStyle: CSSProperties
  bodyClass: string
  /** Drawn behind the sections (a trail, a road, an orbit…). */
  decor?: ReactNode
  /** One section's frame. `i` alternates the look down the page. */
  Card: (p: { children: ReactNode; i: number; label?: string; wide?: boolean }) => JSX.Element
  Title: (p: { children: ReactNode }) => JSX.Element
  /** The small mark on each line of the plan. */
  marker: (i: number) => ReactNode
  photo: (src: string, i: number) => ReactNode
  countdown: (days: number, rest: string, label: string) => ReactNode
  button: (kind: 'a' | 'b' | 'ghost') => CSSProperties
  display: string
  displayStyle: CSSProperties
  /** The display face's widest letter in ems, for fitting the name on one line. */
  em: number
  body: string
  hand: string
  words: {
    when: string
    where: string
    plan: string
    dress: string
    notes: string
    photos: string
    rsvp: string
    yes: string
    no: string
    kids: string
    grownups: string
    days: [string, string]
    wishes: string
    wishIntro: string
  }
}

export function PartyBody({ skin, p, data, eventId, isPreview }: { skin: Skin; p: Party; data: Record<string, string>; eventId?: string; isPreview: boolean }) {
  const { t, Card, Title, words } = skin
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [kids, setKids] = useState(1)
  const [grownups, setGrownups] = useState(1)
  const on = p.date ? ` on ${p.date.weekday} ${p.date.day} ${p.date.month}` : ''
  const who = [kids ? `${kids} ${kids === 1 ? 'child' : 'children'}` : '', grownups ? `${grownups} ${grownups === 1 ? 'grown-up' : 'grown-ups'}` : ''].filter(Boolean).join(' and ')
  const text = answer === 'no'
    ? `So sorry, we can’t make ${p.what}${on}. Happy birthday to ${p.first}, have the best time!`
    : `Yes! We’ll be at ${p.what}${on}${who ? `: ${who}` : ''}. See you there!`
  const channels = rsvpChannels({ phone: data.rsvpPhone, email: data.rsvpEmail, text, subject: answer === 'no' ? `Can’t make ${p.what}` : `RSVP: ${p.what}` })
  const by = dateParts(data.rsvpBy)
  const btn = 'kx-press inline-flex min-h-[48px] items-center justify-center gap-2 px-6'
  let i = 0
  const next = () => i++

  const WISHES_THEME: InviteTheme = {
    bg: t.page,
    surface: t.dark ? 'rgba(255,255,255,0.07)' : t.card,
    ink: t.ink,
    muted: t.soft,
    line: t.dark ? 'rgba(255,255,255,0.2)' : t.line,
    accent: t.a,
    onAccent: t.onA,
    heading: skin.display,
    body: skin.body,
    headingStyle: { ...skin.displayStyle, fontSize: 'clamp(26px, 8cqi, 36px)' },
  }

  return (
    <div className={`relative ${skin.bodyClass}`} style={skin.bodyStyle}>
      {skin.decor}
      <div className="relative mx-auto max-w-[32rem] px-5 pb-6 pt-10">
        {/* When and where */}
        <Reveal disabled={isPreview} className="kx-sec">
          <Card i={next()} label={words.when}>
            {p.date ? (
              <div className="text-center">
                <p style={{ fontSize: 17, fontWeight: 700, color: t.soft }}>{p.date.weekday}</p>
                {skin.em > 0.85 ? (
                  // Wide capitals (Blast Off, Race Day): the day above the month, each as big as fits.
                  <>
                    <p style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: 'clamp(40px, 13cqi, 56px)', lineHeight: 1 }}>{p.date.day}</p>
                    <p style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: `clamp(18px, ${Math.min(9, 62 / (p.date.month.length * skin.em)).toFixed(2)}cqi, 40px)`, lineHeight: 1.1 }}>{p.date.month}</p>
                  </>
                ) : (
                  <p style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: `clamp(22px, ${Math.min(10, 64 / ((String(p.date.day).length + 1 + p.date.month.length) * skin.em)).toFixed(2)}cqi, 44px)`, lineHeight: 1.05 }}>{p.date.day} {p.date.month}</p>
                )}
                <p style={{ fontSize: 16, color: t.soft }}>{p.date.year}</p>
              </div>
            ) : (
              <p className="text-center" style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: 26 }}>Date coming soon</p>
            )}
            {p.time && (
              <p className="mx-auto mt-3 w-fit rounded-full px-4 py-1 text-center" style={{ fontSize: 17, fontWeight: 800, background: t.c, color: '#1A1A1A' }}>
                {p.end ? `${p.time} to ${p.end}` : `${p.time} onwards`}
              </p>
            )}
          </Card>
        </Reveal>

        <Reveal disabled={isPreview} className="kx-sec">
          <Card i={next()} label={words.where}>
            <p className="text-center leading-[1.2]" style={{ fontSize: 'clamp(21px, 6.6cqi, 25px)', fontWeight: 800 }}>{p.venue || 'Venue coming soon'}</p>
            {p.address && <p className="mx-auto mt-1 max-w-[19rem] text-center leading-[1.5]" style={{ fontSize: 16, color: t.soft }}>{p.address}</p>}
            {(p.directions || p.calendar) && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <DirectionsLink href={p.directions} isPreview={isPreview} className={btn} style={skin.button('a')}>Directions</DirectionsLink>
                {p.calendar && (
                  <a href={isPreview ? undefined : p.calendar} target="_blank" rel="noopener noreferrer" aria-disabled={isPreview || undefined} className={btn} style={skin.button('b')}>
                    Add to calendar
                  </a>
                )}
              </div>
            )}
          </Card>
        </Reveal>

        {p.message && (
          <Reveal disabled={isPreview} className="kx-sec">
            <Card i={next()}>
              <p className="text-center leading-[1.55]" style={{ fontSize: 'clamp(18px, 5.6cqi, 21px)', fontWeight: 600, textWrap: 'pretty' }}>{p.message}</p>
              {p.parents && <p className="mt-2 text-center" style={{ fontFamily: skin.hand, fontWeight: 700, fontSize: 23, color: t.accentText }}>{p.parents}</p>}
            </Card>
          </Reveal>
        )}

        {p.countdown && (
          <Reveal disabled={isPreview} className="kx-sec">
            {skin.countdown(
              p.countdown.days,
              `${p.countdown.hours} h · ${String(p.countdown.minutes).padStart(2, '0')} m · ${String(p.countdown.seconds).padStart(2, '0')} s`,
              p.countdown.days === 1 ? words.days[0] : words.days[1],
            )}
          </Reveal>
        )}

        {p.schedule.length > 0 && (
          <Reveal disabled={isPreview} className="kx-sec">
            <Card i={next()} wide>
              <Title>{words.plan}</Title>
              <ol className="mt-5 space-y-4">
                {p.schedule.map((item, k) => (
                  <li key={`${item.title}-${k}`} className="flex items-start gap-3.5">
                    <span className="shrink-0">{skin.marker(k)}</span>
                    <div className="min-w-0 pt-0.5">
                      {item.time && <p className="tabular-nums" style={{ fontSize: 15.5, fontWeight: 800, color: t.accentText }}>{item.time}</p>}
                      <p className="leading-[1.25]" style={{ fontSize: 19, fontWeight: 700 }}>{item.title}</p>
                      {item.note && <p style={{ fontSize: 15, color: t.soft }}>{item.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        )}

        {p.dress && (
          <Reveal disabled={isPreview} className="kx-sec">
            <Card i={next()} label={words.dress}>
              <p className="text-center leading-[1.35]" style={{ fontSize: 'clamp(19px, 6cqi, 23px)', fontWeight: 800 }}>{p.dress}</p>
            </Card>
          </Reveal>
        )}

        {p.notes.length > 0 && (
          <Reveal disabled={isPreview} className="kx-sec">
            <Card i={next()} label={words.notes}>
              <ul className="space-y-2">
                {p.notes.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 leading-[1.45]" style={{ fontSize: 16.5 }}>
                    <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ background: t.a }} />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        )}

        {p.photos.length > 0 && (
          <section className="kx-sec">
            <Reveal disabled={isPreview}>
              <Title>{words.photos.replace('{first}', p.first)}</Title>
            </Reveal>
            <div className={`mt-6 grid gap-5 ${p.photos.length === 1 ? 'mx-auto w-[72%] grid-cols-1' : 'grid-cols-2'}`}>
              {p.photos.map((src, k) => (
                <Reveal key={`${src}-${k}`} disabled={isPreview} delay={(k % 2) * 90} style={{ marginTop: p.photos.length > 1 && k % 2 ? 24 : 0 }}>
                  {skin.photo(src, k)}
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {channels.length > 0 && (
          <Reveal disabled={isPreview} className="kx-sec">
            <Card i={next()} wide>
              <Title>{words.rsvp}</Title>
              {by && <p className="mt-1 text-center" style={{ fontSize: 16, color: t.soft }}>Please reply by {by.weekday} {by.day} {by.month}</p>}
              <div className="mt-5 grid grid-cols-2 gap-3" role="group" aria-label="Your answer">
                {(['yes', 'no'] as const).map((a) => {
                  const picked = answer === a
                  const style = picked ? skin.button(a === 'yes' ? 'a' : 'b') : skin.button('ghost')
                  return (
                    <button key={a} type="button" aria-pressed={picked} onClick={() => setAnswer(a)} className="kx-press min-h-[52px] px-3" style={{ ...style, fontSize: 16 }}>
                      {a === 'yes' ? words.yes : words.no}
                    </button>
                  )
                })}
              </div>
              {answer === 'yes' && (
                <div className="mx-auto mt-5 grid max-w-[18rem] gap-3">
                  <Stepper label={words.kids} value={kids} set={setKids} t={t} />
                  <Stepper label={words.grownups} value={grownups} set={setGrownups} t={t} />
                </div>
              )}
              {answer && (
                <div className="mt-5">
                  <p className="text-center" style={{ fontFamily: skin.hand, fontWeight: 700, fontSize: 21, color: t.accentText }}>
                    {answer === 'yes' ? 'Yay! Now tell the family on…' : 'We’ll miss you! Let the family know on…'}
                  </p>
                  <div className="mt-3 grid gap-2.5">
                    {channels.map((c) => (
                      <a
                        key={c.kind}
                        href={isPreview ? undefined : c.href}
                        target={c.kind === 'whatsapp' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        aria-disabled={isPreview || undefined}
                        className="kx-press flex min-h-[50px] items-center justify-center gap-2.5"
                        style={skin.button(c.kind === 'whatsapp' ? 'a' : 'ghost')}
                      >
                        <ChannelIcon kind={c.kind} />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Reveal>
        )}
      </div>

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title={words.wishes.replace('{first}', p.first)}
          intro={words.wishIntro.replace('{first}', p.first)}
          noun="wish"
          namePlaceholder="e.g. Dadi & Dada"
          previewWishes={[
            { name: 'Dadi & Dada', message: `Happy birthday, our little star! Lots of love and blessings, ${p.first}.` },
            { name: 'Riya’s family', message: 'Can’t wait for the party! See you there with the kids.' },
          ]}
        />
      )}

      <footer className="relative px-6 pb-10 pt-10 text-center">
        <p style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: 'clamp(22px, 7cqi, 32px)' }}>{p.name}</p>
        {p.date && <p className="mt-1" style={{ fontSize: 16, color: t.soft }}>{p.date.day} {p.date.month} {p.date.year}</p>}
        <div className="mt-7">
          <Credit isPreview={isPreview} color={t.faint} linkColor={t.accentText} />
        </div>
      </footer>
    </div>
  )
}

/** The child's name, age and who is inviting: the same words under every theme's hero. */
export function HeroWords({ p, skin, ink, soft, accent }: { p: Party; skin: Skin; ink: string; soft: string; accent: string }) {
  const em = skin.em
  const longest = Math.max(3, ...p.name.split(/\s+/).map((w) => Array.from(w).length))
  const cqi = Math.min(19, 94 / (longest * em)).toFixed(2)
  return (
    <div className="relative px-6 pb-12 pt-6 text-center" style={{ color: ink }}>
      {p.theme && <p className="kx-up mx-auto max-w-[21rem] leading-[1.15]" style={{ fontFamily: skin.hand, fontWeight: 700, fontSize: 'clamp(20px, 6.4cqi, 26px)', color: accent }}>{p.theme}</p>}
      <div style={{ containerType: 'inline-size' }}>
        <h1 className="kx-up mt-1 break-words" style={{ fontFamily: skin.display, ...skin.displayStyle, fontSize: `clamp(16px, ${cqi}cqi, 78px)`, lineHeight: 0.98, animationDelay: '120ms' }}>{p.name}</h1>
      </div>
      {p.age !== null && (
        <p className="kx-up mt-2" style={{ fontSize: 'clamp(21px, 6.6cqi, 27px)', fontWeight: 800, color: accent, animationDelay: '240ms' }}>is turning {p.ageWord}!</p>
      )}
      <p className="kx-up mx-auto mt-3 max-w-[20rem] leading-[1.45]" style={{ fontSize: 17, color: soft, textWrap: 'balance', animationDelay: '360ms' }}>
        {p.parents ? (
          <>
            <span style={{ color: ink, fontWeight: 700 }}>{p.parents}</span> invite you to {p.age !== null ? `the ${p.ordinalWord} birthday party` : 'the birthday party'}
          </>
        ) : (
          <>You’re invited to {p.age !== null ? `the ${p.ordinalWord} birthday party` : 'the birthday party'}</>
        )}
      </p>
    </div>
  )
}

/** "Tap …" under each opening, with who it's for. */
export function GateWords({ p, call, color, soft, display, displayStyle, em }: { p: Party; call: string; color: string; soft: string; display: string; displayStyle: CSSProperties; em: number }) {
  const longest = Math.max(4, ...p.what.split(/\s+/).map((w) => Array.from(w).length))
  const cqi = Math.min(9.4, 80 / (longest * em)).toFixed(2)
  return (
    <div className="pointer-events-none relative px-6 text-center" style={{ color }}>
      <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: soft }}>You’re invited</p>
      <p className="mt-1" style={{ fontFamily: display, ...displayStyle, fontSize: `clamp(18px, ${cqi}cqi, 38px)`, lineHeight: 1.05, textWrap: 'balance' }}>{p.what}</p>
      <p className="kx-hint mx-auto mt-4 w-fit rounded-full px-5 py-2.5" style={{ fontSize: 16, fontWeight: 800, background: 'rgba(255,255,255,0.92)', color: '#1A1A1A', boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}>
        {call}
      </p>
    </div>
  )
}
