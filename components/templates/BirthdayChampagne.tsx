'use client'

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { bodoniDisplay } from './kit/fonts/bodoniDisplay'
import { italiana } from './kit/fonts/italiana'
import { cormorant } from './kit/fonts/cormorant'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, grain, mapsHref, parseLines, parseSchedule, timeLabel, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords, ordinalWords, timeWords } from './kit/words'
import { ChannelIcon, ageOf, partyName, useRsvp } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Champagne — a milestone birthday dinner.
 * Ivory card, black ink and gold foil. The age is set huge in Bodoni and the
 * numerals are glass: champagne rises inside them and the bubbles keep coming,
 * while flakes of gold leaf drift down past. The wording is formal and spelled
 * out. Further down, a coupe tower fills glass by glass as it comes into view,
 * and the reply card offers "joyfully accepts" or "regretfully declines".
 */

const P = {
  ivory: '#F7F1E6',
  paper: '#EFE6D5',
  ink: '#1D1A16',
  soft: 'rgba(29,26,22,0.74)',
  faint: 'rgba(29,26,22,0.52)',
  rule: 'rgba(29,26,22,0.14)',
  gold: '#B08A3E',
  goldDeep: '#8A6A2F',
  wine: 'rgba(233,206,132,0.92)',
}

const numerals = bodoniDisplay.style.fontFamily
const caps = italiana.style.fontFamily
const serif = cormorant.style.fontFamily
const sans = jost.style.fontFamily

const FOIL = 'linear-gradient(115deg, #8A6A2F 0%, #D9B566 22%, #F7E8B4 38%, #B48B3E 55%, #E9CC86 74%, #9C7733 100%)'
/** The same foil, deep enough that a Bodoni hairline still shows on ivory. */
const FOIL_ON_IVORY = 'linear-gradient(115deg, #7C5D24 0%, #B8913F 28%, #D9B868 42%, #9E7A33 58%, #C9A256 76%, #84652B 100%)'

const WISHES_THEME: InviteTheme = {
  bg: P.paper,
  surface: P.ivory,
  ink: P.ink,
  muted: P.soft,
  line: 'rgba(29,26,22,0.12)',
  accent: P.ink,
  onAccent: P.ivory,
  heading: serif,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, 10cqi, 44px)' },
}

const SAMPLE_WISHES = [
  { name: 'Margaret & Ian', message: 'Fifty years of you is the best reason we know to put on the good shoes. Happy birthday, Caro.' },
  { name: 'The Wellings', message: 'Counting down to the speeches. We have stories, and we are not afraid to use them.' },
]

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const round = (n: number) => Math.round(n * 10) / 10

const foilText = (extra?: CSSProperties, foil = FOIL_ON_IVORY): CSSProperties => ({
  backgroundImage: foil,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

/* ── The numerals, filled with champagne ────────────────────────────── */

function Bubbles({ count, seed, x0, x1, y0, y1 }: { count: number; seed: number; x0: number; x1: number; y0: number; y1: number }) {
  const bubbles = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, () => ({
      x: round(x0 + r() * (x1 - x0)),
      r: round(1.2 + r() * r() * 4.2),
      dur: round(2.6 + r() * 3.8),
      delay: round(-r() * 6),
      drift: round((r() - 0.5) * 10),
    }))
  }, [count, seed, x0, x1])
  return (
    <g>
      {bubbles.map((b, i) => (
        <circle
          key={i}
          className="ch-bubble"
          cx={b.x}
          cy={y1}
          r={b.r}
          fill="rgba(255,255,255,0.75)"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth={0.5}
          style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, ['--rise' as string]: `${round(y0 - y1)}px`, ['--drift' as string]: `${b.drift}px` }}
        />
      ))}
    </g>
  )
}

function ChampagneNumerals({ value, uid }: { value: string; uid: string }) {
  // Each character is about 0.6 of the font size wide in Bodoni's lining figures.
  const size = 300
  const w = Math.max(2, value.length) * size * 0.62 + 40
  const h = 330
  const baseline = 290
  const text = (props: Record<string, unknown>) => (
    <text x={w / 2} y={baseline} textAnchor="middle" fontFamily={numerals} fontSize={size} fontWeight={400} letterSpacing={-6} {...props}>
      {value}
    </text>
  )
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" style={{ overflow: 'visible' }} role="img" aria-label={value}>
      <defs>
        <clipPath id={`${uid}-glyphs`}>{text({})}</clipPath>
        <linearGradient id={`${uid}-foil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A6A2F" />
          <stop offset="0.24" stopColor="#D9B566" />
          <stop offset="0.4" stopColor="#E3C57C" />
          <stop offset="0.56" stopColor="#A9823A" />
          <stop offset="0.76" stopColor="#E9CC86" />
          <stop offset="1" stopColor="#9C7733" />
        </linearGradient>
        <linearGradient id={`${uid}-wine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DE9E" />
          <stop offset="1" stopColor="#D8B460" />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${uid}-glyphs)`}>
        {/* the empty glass above the line */}
        <rect width={w} height={h} fill="rgba(176,138,62,0.1)" />
        <g className="ch-fill">
          <path
            className="ch-surface"
            d={`M${-120} 110 ${'q15 -6 30 0 q15 6 30 0 '.repeat(Math.ceil((w + 240) / 60))} V${h + 40} H-120Z`}
            fill={`url(#${uid}-wine)`}
          />
          <Bubbles count={Math.round(w / 9)} seed={value.length * 31 + 7} x0={10} x1={w - 10} y0={110} y1={h} />
        </g>
        <rect className="ch-glint" x={-140} y={0} width={110} height={h} fill={`url(#${uid}-sheen)`} transform="skewX(-18)" />
      </g>
      {/* the foil edge of each numeral */}
      {text({ fill: 'none', stroke: `url(#${uid}-foil)`, strokeWidth: 3.2 })}
    </svg>
  )
}

/* ── Gold leaf ──────────────────────────────────────────────────────── */

function GoldLeaf({ count, seed }: { count: number; seed: number }) {
  const flakes = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, () => {
      const s = 2.6 + r() * 4.4
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 + r() * 0.8
        const d = s * (0.55 + r() * 0.5)
        return `${round(Math.cos(a) * d)},${round(Math.sin(a) * d)}`
      }).join(' ')
      return { x: round(r() * 100), s: round(s), pts, dur: round(9 + r() * 9), delay: round(-r() * 18), sway: round(10 + r() * 26), spin: round(160 + r() * 260) }
    })
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="ch-leaf absolute top-0 block"
          style={{ left: `${f.x}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, ['--sway' as string]: `${f.sway}px`, ['--spin' as string]: `${f.spin}deg` }}
        >
          <svg viewBox={`${-f.s * 1.2} ${-f.s * 1.2} ${f.s * 2.4} ${f.s * 2.4}`} width={f.s * 2.4} height={f.s * 2.4} className="ch-flake block">
            <polygon points={f.pts} fill={i % 3 ? '#D9B566' : '#C59B48'} opacity={0.9} />
          </svg>
        </span>
      ))}
    </div>
  )
}

/* ── The coupe tower ────────────────────────────────────────────────── */

/** Starts once, the first time the element is mostly on screen. */
function useOnScreen<T extends Element>(enabled: boolean) {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])
  return { ref, seen }
}

const BOWL = 'M-30 0 C-29 15 -16 21 0 21 C16 21 29 15 30 0 Z'

function Tower({ uid, pour }: { uid: string; pour: 'idle' | 'pour' | 'full' }) {
  // Rows from the top: 1, 2, 3, 4 coupes; each sits on the rims of the two below.
  const glasses: { x: number; y: number; row: number }[] = []
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i <= row; i++) glasses.push({ x: 160 + (i - row / 2) * 66, y: 62 + row * 52, row })
  }
  return (
    <svg viewBox="0 -78 320 378" className={`ch-tower block h-auto w-full ch-${pour}`} style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <clipPath id={`${uid}-bowl`}>
          <path d={BOWL} />
        </clipPath>
      </defs>

      {/* the bottle, pouring */}
      <g transform="translate(226 -6) rotate(118)">
        <path d="M-9 0 H9 V46 C9 58 16 62 16 74 V130 H-16 V74 C-16 62 -9 58 -9 46 Z" fill="#1F2A20" />
        <path d="M-9 0 H9 V14 H-9 Z" fill={`url(#${uid}-neck)`} />
        <rect x={-14} y={86} width={28} height={30} rx={2} fill="#EFE3C4" />
        <path d="M-10 92 H10 M-7 99 H7" stroke={P.gold} strokeWidth={1.3} />
        <path d="M-12 76 V126" stroke="rgba(255,255,255,0.18)" strokeWidth={3} strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient id={`${uid}-neck`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A6A2F" />
          <stop offset="0.5" stopColor="#F2DFA6" />
          <stop offset="1" stopColor="#9C7733" />
        </linearGradient>
      </defs>
      <path className="ch-stream" d="M219 2 C 200 12 172 26 162 52" fill="none" stroke="#E9CE84" strokeWidth={2.4} strokeLinecap="round" pathLength={1} />

      {/* overflow running down from each rim */}
      {glasses.filter((g) => g.row < 3).map((g, i) => (
        <g key={`o${i}`}>
          {[-1, 1].map((side) => (
            <path
              key={side}
              className="ch-spill"
              d={`M${g.x + side * 29} ${g.y + 1} q${side * 6} 8 ${side * 4} 38`}
              fill="none"
              stroke="#E9CE84"
              strokeWidth={1.4}
              strokeLinecap="round"
              pathLength={1}
              style={{ animationDelay: `${0.9 + g.row * 0.9}s` }}
            />
          ))}
        </g>
      ))}

      {glasses.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y})`}>
          <g clipPath={`url(#${uid}-bowl)`}>
            <rect className="ch-glass" x={-32} y={-2} width={64} height={26} fill={P.wine} style={{ animationDelay: `${0.3 + g.row * 0.9}s` }} />
            {[-14, -4, 8, 17].map((bx, j) => (
              <circle key={j} className="ch-tbubble" cx={bx} cy={19} r={1.1} fill="rgba(255,255,255,0.85)" style={{ animationDelay: `${-(i * 0.37 + j * 0.61)}s` }} />
            ))}
          </g>
          <path d={BOWL} fill="none" stroke={P.goldDeep} strokeWidth={1.2} />
          <ellipse cx={0} cy={0} rx={30} ry={3.4} fill="none" stroke={P.goldDeep} strokeWidth={1.1} />
          <path d="M0 21 V44 M-14 47 Q0 42 14 47" fill="none" stroke={P.goldDeep} strokeWidth={1.2} strokeLinecap="round" />
          <path d="M-22 6 C-18 12 -12 15 -6 16" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}

/* ── Small parts ────────────────────────────────────────────────────── */

function Caps({ children, color = P.faint, className = '', size = 12 }: { children: ReactNode; color?: string; className?: string; size?: number }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: size, fontWeight: 500, letterSpacing: '0.32em', color }}>
      {children}
    </p>
  )
}

function Diamond({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 10" className={`mx-auto block h-[10px] w-[120px] ${className}`} aria-hidden>
      <path d="M2 5H50M70 5H118" stroke={P.gold} strokeWidth={0.8} />
      <path d="M60 0.8 64.2 5 60 9.2 55.8 5Z" fill={P.gold} />
    </svg>
  )
}

function Btn({ href, isPreview, solid, children }: { href: string | null; isPreview: boolean; solid?: boolean; children: ReactNode }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="ch-btn inline-flex min-h-[48px] items-center justify-center gap-2 px-5 text-center uppercase"
      style={{
        fontFamily: sans,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: '0.22em',
        ...(solid ? { background: P.ink, color: P.ivory } : { border: `1px solid rgba(29,26,22,0.35)`, color: P.ink }),
      }}
    >
      {children}
    </DirectionsLink>
  )
}

function Countdown({ date, time, enabled }: { date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  const days = c.days + (c.hours || c.minutes || c.seconds ? 1 : 0)
  return (
    <Reveal disabled={!enabled} className="py-14 text-center">
      <Caps>In</Caps>
      <p className="mt-2" style={foilText({ fontFamily: numerals, fontSize: 'clamp(84px, 28cqi, 124px)', lineHeight: 0.95 })}>{days}</p>
      <p className="mt-1" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(24px, 7.5cqi, 30px)', color: P.ink }}>
        {days === 1 ? 'day, we pour' : 'days, we pour'}
      </p>
    </Reveal>
  )
}

function Rsvp({ phone, email, what, date, rsvpBy, isPreview }: { phone?: string; email?: string; what: string; date?: string; rsvpBy?: string; isPreview: boolean }) {
  const r = useRsvp({ phone, email, what, date, formal: true })
  if (!r.available) return null
  const by = dateParts(rsvpBy)
  return (
    <section className="px-5 pb-20 pt-6">
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)] px-7 pb-9 pt-10 text-center" style={{ background: P.ivory, boxShadow: '0 1px 1px rgba(29,26,22,0.08), 0 24px 40px rgba(29,26,22,0.12)', outline: `1px solid ${P.gold}`, outlineOffset: -10 }}>
        <Caps color={P.gold}>Kindly reply</Caps>
        {by && (
          <p className="mt-3" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 21, color: P.ink }}>
            by {by.weekday}, the {ordinalWords(by.day)} of {by.month}
          </p>
        )}
        <div className="mt-6 grid gap-2.5" role="group" aria-label="Your answer">
          {(['yes', 'no'] as const).map((a) => {
            const on = r.answer === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => r.setAnswer(a)}
                aria-pressed={on}
                className="ch-btn min-h-[52px] px-4"
                style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 22, background: on ? P.ink : 'transparent', color: on ? P.ivory : P.ink, border: `1px solid ${on ? P.ink : 'rgba(29,26,22,0.3)'}` }}
              >
                {a === 'yes' ? 'Joyfully accepts' : 'Regretfully declines'}
              </button>
            )
          })}
        </div>
        {r.answer && (
          <div className="ch-pop mt-6">
            <Caps size={11}>Send your reply by</Caps>
            <div className="mt-3 grid gap-2">
              {r.channels.map((c) => (
                <a
                  key={c.kind}
                  href={isPreview ? undefined : c.href}
                  target={c.kind === 'whatsapp' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className="ch-btn flex min-h-[48px] items-center justify-center gap-2.5"
                  style={{ fontFamily: sans, fontSize: 15.5, color: P.ink, border: `1px solid ${P.rule}`, background: P.paper }}
                >
                  <ChannelIcon kind={c.kind} />
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ── The invitation ─────────────────────────────────────────────────── */

export default function BirthdayChampagne({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const name = data.celebrantName?.trim() || 'Caroline'
  const age = ageOf(data.age)
  const what = partyName(name, age)
  const date = dateParts(data.date)
  const spelledTime = timeWords(data.time)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const hosts = data.invitedBy?.trim() || ''
  const occasion = data.theme?.trim() || ''
  const plan = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const photos = useMemo(() => {
    const own = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? [data.celebrantPhoto] : []
    return [...own, ...galleryImages(data.galleryImages, 6)].slice(0, 6)
  }, [data.celebrantPhoto, data.galleryImages])
  const map = mapsHref(data.mapsUrl, venue, address)
  const calendar = calendarHref(what, data.date, data.time, [venue, address].filter(Boolean).join(', ') || undefined, 4)
  const animate = !isPreview
  const tower = useOnScreen<HTMLDivElement>(animate)

  // Sized by its longest word, so "Anastasia-Josephine" sets on two full lines rather than tiny on one.
  const longestWord = Math.max(4, ...name.split(/[\s-]+/).map((w) => w.length + 1))
  const nameCqi = Math.min(13, 84 / (longestWord * 0.82))
  const ageWords = age ? ordinalWords(age) : ''

  return (
    <div className={`ch relative ${animate ? 'ch-in' : ''}`} style={{ backgroundColor: P.paper, ...grain(0.05), color: P.ink, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .ch .ch-bubble { animation-name: ch-bubble; animation-iteration-count: infinite; animation-timing-function: cubic-bezier(.4,0,.7,1); }
        @keyframes ch-bubble { from { transform: translate(0, 0); opacity: 0; } 12% { opacity: 1; } 85% { opacity: .9; } to { transform: translate(var(--drift), var(--rise)); opacity: 0; } }
        .ch .ch-surface { animation: ch-surface 4s linear infinite; }
        @keyframes ch-surface { to { transform: translateX(60px); } }
        .ch.ch-in .ch-fill { animation: ch-fill 2.6s cubic-bezier(.3,.1,.25,1) .5s both; }
        @keyframes ch-fill { from { transform: translateY(240px); } }
        .ch .ch-glint { animation: ch-glint 7s ease-in-out 3s infinite; }
        @keyframes ch-glint { 0%, 70% { transform: translateX(0) skewX(-18deg); } 100% { transform: translateX(1100px) skewX(-18deg); } }
        .ch .ch-leaf { animation-name: ch-fall; animation-iteration-count: infinite; animation-timing-function: linear; }
        @keyframes ch-fall { from { transform: translate(0, -40px); } 25% { transform: translate(var(--sway), 25vh); } 50% { transform: translate(0, 50vh); } 75% { transform: translate(calc(var(--sway) * -1), 75vh); } to { transform: translate(0, 105vh); } }
        .ch .ch-flake { animation: ch-flip 3.2s linear infinite; }
        @keyframes ch-flip { from { transform: rotateY(0) rotate(0); } to { transform: rotateY(360deg) rotate(var(--spin, 200deg)); } }
        .ch.ch-in .ch-frame { animation: ch-frame 1.8s cubic-bezier(.5,.1,.25,1) .15s both; }
        @keyframes ch-frame { from { clip-path: inset(50% 50% 50% 50%); opacity: 0; } 30% { opacity: 1; } to { clip-path: inset(0 0 0 0); } }
        .ch.ch-in .ch-rise { animation: ch-rise 1.1s cubic-bezier(.2,.75,.25,1) both; }
        @keyframes ch-rise { from { opacity: 0; transform: translateY(16px); } }
        /* the tower: empty until it pours, then full; previews start full */
        .ch .ch-glass { transform-box: fill-box; transform-origin: 50% 100%; }
        .ch .ch-stream, .ch .ch-spill { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .ch .ch-idle .ch-glass { transform: scaleY(0); }
        .ch .ch-pour .ch-glass { animation: ch-glass 1.1s ease-in both; }
        @keyframes ch-glass { from { transform: scaleY(0); } }
        .ch .ch-pour .ch-stream { animation: ch-stream 3.9s ease both; }
        @keyframes ch-stream { 0% { stroke-dashoffset: 1; } 12% { stroke-dashoffset: 0; } 88% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        .ch .ch-pour .ch-spill { animation: ch-spill 1.2s ease both; }
        @keyframes ch-spill { 0% { stroke-dashoffset: 1; opacity: .9; } 50% { stroke-dashoffset: 0; opacity: .9; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        .ch .ch-tbubble { animation: ch-tbubble 2.4s linear infinite; }
        @keyframes ch-tbubble { from { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateY(-17px); opacity: 0; } }
        .ch .ch-btn { transition: opacity .18s ease, background-color .18s ease, color .18s ease; }
        .ch .ch-btn:hover { opacity: .88; }
        .ch .ch-pop { animation: ch-pop .4s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes ch-pop { from { opacity: 0; transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) {
          .ch .ch-bubble, .ch .ch-surface, .ch.ch-in .ch-fill, .ch .ch-glint, .ch .ch-leaf, .ch .ch-flake, .ch.ch-in .ch-frame, .ch.ch-in .ch-rise,
          .ch .ch-pour .ch-glass, .ch .ch-pour .ch-stream, .ch .ch-pour .ch-spill, .ch .ch-tbubble { animation: none; }
          .ch .ch-leaf { display: none; }
          .ch .ch-idle .ch-glass { transform: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={P.ink} background="rgba(247,241,230,0.9)" border={P.rule} />

      {/* ── The card ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-[3.5cqi] py-[3.5cqi]" style={{ minHeight: isPreview ? 700 : '100svh' }}>
        <div className="relative flex h-full flex-col items-center justify-center px-[7cqi] text-center" style={{ minHeight: isPreview ? 'calc(700px - 7cqi)' : 'calc(100svh - 7cqi)', background: P.ivory, boxShadow: '0 1px 2px rgba(29,26,22,0.08), 0 30px 60px rgba(29,26,22,0.1)' }}>
          <GoldLeaf count={13} seed={9} />
          {/* the gold frame, drawn on as the card opens */}
          <span aria-hidden className="ch-frame pointer-events-none absolute inset-[2.6cqi] block" style={{ border: `1.2px solid ${P.gold}` }} />
          <span aria-hidden className="ch-frame pointer-events-none absolute inset-[3.8cqi] block" style={{ border: `0.6px solid ${P.gold}`, opacity: 0.65 }} />

          <div className="relative w-full py-[12cqi]">
            <div className="ch-rise" style={{ animationDelay: '.3s' }}>
              <Caps color={P.gold}>{hosts ? `${hosts} invite you` : 'You are invited'}</Caps>
              <p className="mt-[2.4cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(19px, 5.8cqi, 25px)', color: P.soft }}>
                {age ? `to celebrate the ${ageWords} birthday of` : 'to celebrate the birthday of'}
              </p>
            </div>
            <h1 className="ch-rise mt-[3cqi] break-words uppercase" style={{ fontFamily: caps, fontWeight: 400, fontSize: `clamp(24px, ${nameCqi.toFixed(1)}cqi, 76px)`, letterSpacing: '0.14em', lineHeight: 1.05, color: P.ink, animationDelay: '.5s', marginRight: '-0.14em' }}>
              {/* a double-barrelled name breaks after its hyphen, never before it */}
              {name.replace(/-/g, '-\u200B')}
            </h1>

            {age ? (
              <div className="mx-auto mt-[2cqi] w-[min(78cqi,360px)]" style={{ maxWidth: `${String(age).length > 2 ? 92 : 78}cqi` }}>
                <ChampagneNumerals value={String(age)} uid={uid} />
              </div>
            ) : (
              <p className="mt-[5cqi]" style={foilText({ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(54px, 18cqi, 90px)', lineHeight: 1 })}>Cheers</p>
            )}

            <div className="ch-rise mt-[5cqi]" style={{ animationDelay: '1.4s' }}>
              <Diamond />
              {date ? (
                <p className="mt-[4cqi]" style={{ fontFamily: serif, fontSize: 'clamp(21px, 6.4cqi, 27px)', lineHeight: 1.25, color: P.ink, textWrap: 'balance' }}>
                  {date.weekday}, the {ordinalWords(date.day)} of {date.month}
                  {spelledTime && <span className="block" style={{ fontStyle: 'italic', color: P.soft }}>at {spelledTime}</span>}
                </p>
              ) : (
                <p className="mt-[4cqi]" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(21px, 6.4cqi, 27px)' }}>Date to follow</p>
              )}
              {venue && <Caps className="mt-[4cqi]" color={P.ink} size={12.5}>{venue}</Caps>}
            </div>
          </div>
        </div>
      </section>

      {/* ── Particulars ──────────────────────────────────────────────── */}
      <section className="px-6 pb-4 pt-12 text-center">
        <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)]">
          {occasion && <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(26px, 8cqi, 34px)', lineHeight: 1.15 }}>{occasion}</p>}
          <dl className="mt-8 space-y-8">
            <div>
              <dt><Caps>When</Caps></dt>
              <dd className="mt-2" style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.3 }}>
                {date ? date.long : 'Date to follow'}
                {time && <span className="block" style={{ fontSize: 20, color: P.soft }}>{time}</span>}
              </dd>
            </div>
            {(venue || address) && (
              <div>
                <dt><Caps>Where</Caps></dt>
                <dd className="mt-2" style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.3 }}>
                  {venue}
                  {address && <span className="block" style={{ fontSize: 19, color: P.soft }}>{address}</span>}
                </dd>
              </div>
            )}
            {data.dressCode?.trim() && (
              <div>
                <dt><Caps>Dress</Caps></dt>
                <dd className="mt-2" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 24, lineHeight: 1.3 }}>{data.dressCode.trim()}</dd>
              </div>
            )}
          </dl>
          {(map || calendar) && (
            <div className="mt-9 grid grid-cols-2 gap-2.5">
              {map && <Btn href={map} isPreview={isPreview} solid>Directions</Btn>}
              {calendar && <Btn href={calendar} isPreview={isPreview}>Calendar</Btn>}
            </div>
          )}
          {data.guestNote?.trim() && (
            <p className="mt-9 px-2" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 21, lineHeight: 1.35, color: P.goldDeep }}>
              {data.guestNote.trim()}
            </p>
          )}
        </Reveal>
        <Countdown date={data.date} time={data.time} enabled={!isPreview} />
      </section>

      {/* ── The evening, and the tower ───────────────────────────────── */}
      {plan.length > 0 && (
        <section className="px-6 pb-10 pt-4 text-center">
          <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)]">
            <Caps color={P.gold}>The evening</Caps>
            <ol className="mt-7 space-y-6">
              {plan.map((it, i) => (
                <li key={i}>
                  {it.time && <p className="tabular-nums" style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 500, letterSpacing: '0.24em', color: P.faint }}>{it.time}</p>}
                  <p className="mt-1" style={{ fontFamily: serif, fontSize: 27, lineHeight: 1.15 }}>{it.title}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      )}
      <div ref={tower.ref} className="mx-auto w-[min(84cqi,360px)] pb-6 pt-4">
        <Tower uid={uid} pour={!animate ? 'full' : tower.seen ? 'pour' : 'idle'} />
      </div>

      {/* ── A word ───────────────────────────────────────────────────── */}
      {note.length > 0 && (
        <section className="px-7 pb-12 pt-8 text-center">
          <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)]">
            <Diamond className="mb-8" />
            {note.map((line, i) => (
              <p key={i} className="mt-4" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(23px, 7cqi, 28px)', lineHeight: 1.35, textWrap: 'pretty' }}>
                {line}
              </p>
            ))}
            {hosts && <Caps className="mt-6" color={P.gold}>{hosts}</Caps>}
            {data.giftNote?.trim() && <p className="mt-8" style={{ fontSize: 15.5, color: P.soft }}>{data.giftNote.trim()}</p>}
          </Reveal>
        </section>
      )}

      {/* ── Through the years ────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="px-6 pb-14 pt-4">
          <Caps className="text-center" color={P.gold}>{age ? `${numberWords(age)} years of ${name}` : `Of ${name}`}</Caps>
          <div className="mx-auto mt-8 grid w-[min(100%,26rem)] grid-cols-2 gap-5">
            {photos.map((src, i) => (
              <Reveal key={i} disabled={isPreview} delay={(i % 2) * 100}>
                <figure className="m-0 p-[6px]" style={{ background: P.ivory, borderRadius: '999px 999px 4px 4px', outline: `1px solid ${P.gold}`, outlineOffset: -3 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-[3/4] w-full object-cover" style={{ borderRadius: '999px 999px 2px 2px', filter: 'sepia(0.12) contrast(1.02)' }} />
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Rsvp phone={data.rsvpPhone} email={data.rsvpEmail} what={what} date={data.date} rsvpBy={data.rsvpBy} isPreview={isPreview} />

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title="Raise a glass"
          intro={`A toast, a memory, a wish for the next ${age ? numberWords(age) : ''} years — leave a few words for ${name}. Everyone who opens this page can read them.`.replace('  ', ' ')}
          noun="toast"
          previewWishes={SAMPLE_WISHES}
          namePlaceholder="e.g. Margaret & Ian"
        />
      )}

      {/* ── Foot ───────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: P.ink, color: P.ivory }}>
        <p className="uppercase" style={{ fontFamily: caps, fontSize: 30, letterSpacing: '0.2em', marginRight: '-0.2em' }}>{name}</p>
        {age && <p className="mt-1" style={foilText({ fontFamily: numerals, fontSize: 58, lineHeight: 1 }, FOIL)}>{age}</p>}
        <p className="mt-3 uppercase" style={{ fontSize: 11, letterSpacing: '0.32em', color: 'rgba(247,241,230,0.55)' }}>
          {[date ? `${date.day} ${date.month} ${date.year}` : '', venue].filter(Boolean).join(' · ')}
        </p>
        <div className="mt-9">
          <Credit isPreview={isPreview} color="rgba(247,241,230,0.55)" linkColor={P.ivory} />
        </div>
      </footer>
    </div>
  )
}
