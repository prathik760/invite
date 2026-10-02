'use client'

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { fraunces } from './kit/fonts/fraunces'
import { caveat } from './kit/fonts/caveat'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, grain, mapsHref, parseLines, parseSchedule, timeLabel, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords } from './kit/words'
import { ChannelIcon, ageOf, partyName, useRsvp } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Long Lunch — a birthday in the sun.
 * A striped awning drops into place over a terrace and lifts a little in the
 * breeze; light comes through the vine overhead and moves over everything.
 * Lemons hang off a branch in the corner, painted rather than drawn. The type
 * is a soft, slightly wonky serif with a hand-written line under it. Below, a
 * blue-and-white tile band, the afternoon's plan, a spritz that counts the days
 * and an RSVP that saves the guest a seat.
 */

const P = {
  plaster: '#FBF4E6',
  linen: '#F4E9D3',
  ink: '#233047',
  soft: 'rgba(35,48,71,0.74)',
  faint: 'rgba(35,48,71,0.52)',
  rule: 'rgba(35,48,71,0.15)',
  aperol: '#E8602C',
  aperolDeep: '#C94C1E',
  cream: '#FFF4E2',
  cobalt: '#1F4E9C',
  lemon: '#F2C230',
  leaf: '#5E7F3A',
  terracotta: '#C8643B',
}

const serif = fraunces.style.fontFamily
const hand = caveat.style.fontFamily
const sans = jost.style.fontFamily
const SOFT: CSSProperties = { fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144" }

const WISHES_THEME: InviteTheme = {
  bg: P.linen,
  surface: P.plaster,
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.aperol,
  onAccent: '#FFF8EE',
  heading: serif,
  body: sans,
  headingStyle: { ...SOFT, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(32px, 9.6cqi, 42px)' },
}

const SAMPLE_WISHES = [
  { name: 'Nina', message: 'Sunglasses packed, appetite ready, nowhere to be. Happy fortieth, Sof.' },
  { name: 'Marco & Bea', message: 'We’re bringing the good olive oil and our loudest toast.' },
]

/* ── The awning ─────────────────────────────────────────────────────── */

function Awning({ uid }: { uid: string }) {
  const stripes = 14
  const sw = 400 / stripes
  let edge = `M0 0 H400 V62`
  for (let i = stripes - 1; i >= 0; i--) edge += ` A${sw / 2} ${sw / 2.4} 0 0 1 ${(i * sw).toFixed(2)} 62`
  edge += ' Z'
  return (
    <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <clipPath id={`${uid}-awn`}>
          <path d={edge} />
        </clipPath>
        <linearGradient id={`${uid}-fold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(60,20,5,0.35)" />
          <stop offset="0.45" stopColor="rgba(60,20,5,0)" />
          <stop offset="0.85" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="1" stopColor="rgba(60,20,5,0.18)" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${uid}-awn)`}>
        {Array.from({ length: stripes }, (_, i) => (
          <rect key={i} x={i * sw} y={0} width={sw + 0.4} height={90} fill={i % 2 ? P.cream : P.aperol} />
        ))}
        <rect width={400} height={90} fill={`url(#${uid}-fold)`} />
        <path d="M0 10 H400" stroke="rgba(60,20,5,0.18)" strokeWidth={1} />
      </g>
      {/* shadow it throws on the wall */}
      <path d={edge} fill="none" stroke="rgba(60,20,5,0.12)" strokeWidth={6} transform="translate(0 5)" style={{ filter: 'blur(3px)' }} />
    </svg>
  )
}

/* ── Painted lemons ─────────────────────────────────────────────────── */

/** A gouache lemon: uneven edge, a darker belly, one stroke of highlight. */
function Lemon({ uid, x, y, r = 0, s = 1, className, style }: { uid: string; x: number; y: number; r?: number; s?: number; className?: string; style?: CSSProperties }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className={className} style={style}>
        <g filter={`url(#${uid}-paint)`}>
          <path d="M-33 1C-31-2-28-4-26-7-21-17-10-22 0-22 11-22 22-17 27-8 29-5 32-3 34 0 32 3 29 5 27 8 21 18 10 22 0 22-11 22-21 18-26 8-28 5-31 3-33 1Z" fill={P.lemon} />
          <path d="M-20 14C-8 21 10 21 22 12 18 18 8 22 0 22-8 22-15 19-20 14Z" fill="#D99A16" opacity={0.75} />
          <path d="M-14-13C-6-17 6-17 13-14" fill="none" stroke="#FFF2A6" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
        </g>
        {[[-14, 2], [-4, -6], [8, 4], [15, -6], [2, 12]].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={0.9} fill="#C88D12" opacity={0.5} />
        ))}
      </g>
    </g>
  )
}

function Leaf({ uid, x, y, r, s = 1 }: { uid: string; x: number; y: number; r: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} filter={`url(#${uid}-paint)`}>
      <path d="M0 0C10-9 30-11 46-2 30 7 12 8 0 0Z" fill={P.leaf} />
      <path d="M0 0C14-3 30-3 46-2 30 2 14 3 0 0Z" fill="#7FA052" opacity={0.85} />
      <path d="M2 0C16-1 30-1.5 44-2" fill="none" stroke="#3F5A25" strokeWidth={0.9} />
    </g>
  )
}

function LemonBranch({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 200 190" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <filter id={`${uid}-paint`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g className="ll-branch" style={{ transformOrigin: '196px 6px' }}>
        <path d="M200 4C170 14 140 30 118 58 104 76 92 100 86 122" fill="none" stroke="#6B4F2F" strokeWidth={4.2} strokeLinecap="round" filter={`url(#${uid}-paint)`} />
        <path d="M150 24C150 40 146 52 140 66M108 74C96 84 90 98 88 110" fill="none" stroke="#6B4F2F" strokeWidth={2.2} strokeLinecap="round" />
        <Leaf uid={uid} x={168} y={14} r={160} s={1.05} />
        <Leaf uid={uid} x={150} y={24} r={60} s={0.9} />
        <Leaf uid={uid} x={124} y={52} r={190} s={1.1} />
        <Leaf uid={uid} x={112} y={66} r={80} s={0.85} />
        <Leaf uid={uid} x={92} y={104} r={210} s={0.95} />
        <Lemon uid={uid} x={138} y={92} r={74} s={1.15} className="ll-swing" style={{ transformOrigin: '0 -26px' }} />
        <Lemon uid={uid} x={84} y={146} r={96} s={1.25} className="ll-swing ll-swing-2" style={{ transformOrigin: '0 -26px' }} />
      </g>
    </svg>
  )
}

/** A lemon slice on the table: rind, pith, eight segments. */
function LemonSlice({ uid }: { uid: string }) {
  return (
    <svg viewBox="-40 -40 80 80" className="block h-full w-full" aria-hidden>
      <defs>
        <filter id={`${uid}-slice`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${uid}-slice)`}>
        <circle r={36} fill={P.lemon} />
        <circle r={32} fill="#FFF7D6" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 -3 L-8 -27 Q0 -30.5 8 -27 Z" fill="#F7DB6A" transform={`rotate(${i * 45})`} />
        ))}
        <circle r={3} fill="#FFF7D6" />
      </g>
    </svg>
  )
}

/** The edge of the table: white linen with a cobalt stripe, a lemon left lying on it. */
function Table({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible', filter: 'drop-shadow(0 -6px 10px rgba(35,48,71,0.08))' }} aria-hidden>
      <path d="M0 16 Q100 8 200 14 T400 12 V120 H0Z" fill="#FFFDF8" />
      <path d="M0 30 Q100 22 200 28 T400 26" fill="none" stroke={P.cobalt} strokeWidth={4} vectorEffect="non-scaling-stroke" />
      <path d="M0 39 Q100 31 200 37 T400 35" fill="none" stroke={P.cobalt} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
      <g filter={`url(#${uid}-paint)`} opacity={0.5}>
        <path d="M0 70 Q140 60 400 66" fill="none" stroke="rgba(35,48,71,0.08)" strokeWidth={10} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/* ── Light through the vine ─────────────────────────────────────────── */

function Dapple({ uid, seed, className, style }: { uid: string; seed: number; className?: string; style?: CSSProperties }) {
  const blobs = useMemo(() => {
    let s = seed
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
    return Array.from({ length: 34 }, () => {
      // denser under the vine (top and right), thinning out towards the table
      const x = Math.round(400 - Math.pow(r(), 1.5) * 430)
      const y = Math.round(Math.pow(r(), 1.35) * 720 - 20)
      const s = 0.7 + r() * 1.3
      return { x, y, s: Math.round(s * 100) / 100, rot: Math.round(r() * 360) }
    })
  }, [seed])
  return (
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`} style={{ mixBlendMode: 'multiply', ...style }} aria-hidden>
      <defs>
        <filter id={`${uid}-blur${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>
      </defs>
      <g filter={`url(#${uid}-blur${seed})`} fill="#61744A">
        {blobs.map((b, i) => (
          <path key={i} d="M0 0C9-10 27-12 42-2 27 8 10 9 0 0Z" transform={`translate(${b.x} ${b.y}) rotate(${b.rot}) scale(${b.s})`} />
        ))}
      </g>
    </svg>
  )
}

/* ── Tiles ──────────────────────────────────────────────────────────── */

/** A band of hand-painted blue-and-white tiles. */
function TileBand({ uid, height = 44 }: { uid: string; height?: number }) {
  return (
    <svg className="block w-full" style={{ height }} aria-hidden>
      <defs>
        <pattern id={`${uid}-tile`} width={height} height={height} patternUnits="userSpaceOnUse">
          <rect width={height} height={height} fill="#F6F1E6" />
          <g fill="none" stroke={P.cobalt} strokeLinecap="round" transform={`scale(${height / 44})`}>
            <path d="M22 3C26 12 32 18 41 22 32 26 26 32 22 41 18 32 12 26 3 22 12 18 18 12 22 3Z" fill={P.cobalt} fillOpacity={0.9} stroke="none" />
            <circle cx={22} cy={22} r={4.6} fill="#F6F1E6" stroke="none" />
            <circle cx={22} cy={22} r={2} fill={P.lemon} stroke="none" />
            <path d="M0 0Q6 1 8 8M44 0Q38 1 36 8M0 44Q6 43 8 36M44 44Q38 43 36 36" strokeWidth={1.6} />
            <path d="M0.5 0.5H43.5V43.5H0.5Z" strokeWidth={0.6} opacity={0.35} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-tile)`} />
    </svg>
  )
}

/* ── The spritz ─────────────────────────────────────────────────────── */

function Spritz({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 140 220" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <clipPath id={`${uid}-glass`}>
          <path d="M26 24C22 70 34 106 70 110 106 106 118 70 114 24Z" />
        </clipPath>
        <linearGradient id={`${uid}-drink`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F39A4A" />
          <stop offset="1" stopColor="#E25A1F" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${uid}-glass)`}>
        <g className="ll-slosh" style={{ transformOrigin: '70px 110px' }}>
          <path className="ll-wave" d="M-60 44 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V130 H-60Z" fill={`url(#${uid}-drink)`} />
        </g>
        {/* ice */}
        <rect x={40} y={46} width={22} height={20} rx={3} fill="rgba(255,255,255,0.45)" transform="rotate(-12 51 56)" className="ll-ice" />
        <rect x={70} y={52} width={20} height={19} rx={3} fill="rgba(255,255,255,0.38)" transform="rotate(16 80 61)" className="ll-ice ll-ice-2" />
        {[44, 58, 72, 86, 98].map((x, i) => (
          <circle key={i} className="ll-bubble" cx={x} cy={104} r={1.3} fill="rgba(255,255,255,0.85)" style={{ animationDelay: `${-i * 0.55}s` }} />
        ))}
      </g>
      {/* orange slice on the rim */}
      <g transform="translate(110 30) rotate(18)">
        <circle r={17} fill="#F08A2E" />
        <circle r={14.5} fill="#FFC77A" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0-1.5L-3.6-12.5Q0-14 3.6-12.5Z" fill="#F7A54B" transform={`rotate(${i * 45})`} />
        ))}
      </g>
      <g fill="none" stroke={P.ink} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 24C22 70 34 106 70 110 106 106 118 70 114 24" />
        <ellipse cx={70} cy={24} rx={44} ry={4.4} />
        <path d="M70 110V196M44 200Q70 190 96 200Q70 206 44 200Z" />
      </g>
      <path d="M34 34C32 62 38 84 52 96" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}

/* ── Small parts ────────────────────────────────────────────────────── */

function Label({ children, color = P.faint, className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.3em', color }}>
      {children}
    </p>
  )
}

function Btn({ href, isPreview, solid, children }: { href: string | null; isPreview: boolean; solid?: boolean; children: ReactNode }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="ll-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 text-center"
      style={{ fontFamily: sans, fontSize: 15, fontWeight: 500, ...(solid ? { background: P.aperol, color: '#FFF8EE' } : { border: `1.5px solid ${P.ink}`, color: P.ink }) }}
    >
      {children}
    </DirectionsLink>
  )
}

function Countdown({ uid, date, time, enabled }: { uid: string; date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  const days = c.days + (c.hours || c.minutes || c.seconds ? 1 : 0)
  return (
    <Reveal disabled={!enabled} className="mx-auto flex w-[min(100%,26rem)] items-center gap-4 px-6 pb-6 pt-14">
      <div className="h-[44cqi] max-h-[200px] w-[28cqi] max-w-[128px] shrink-0">
        <Spritz uid={uid} />
      </div>
      <div>
        <p style={{ ...SOFT, fontFamily: serif, fontSize: 'clamp(80px, 26cqi, 118px)', lineHeight: 0.9, color: P.aperol }}>{days}</p>
        <p className="mt-1" style={{ fontFamily: hand, fontSize: 'clamp(26px, 8cqi, 34px)', lineHeight: 1, color: P.ink }}>
          {days === 1 ? 'day till the first spritz' : 'days till the first spritz'}
        </p>
      </div>
    </Reveal>
  )
}

function Rsvp({ uid, phone, email, what, date, rsvpBy, isPreview }: { uid: string; phone?: string; email?: string; what: string; date?: string; rsvpBy?: string; isPreview: boolean }) {
  const r = useRsvp({ phone, email, what, date })
  if (!r.available) return null
  const by = dateParts(rsvpBy)
  return (
    <section className="px-5 pb-20 pt-8">
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] overflow-hidden rounded-[22px] text-center" style={{ background: P.plaster, boxShadow: '0 24px 44px rgba(35,48,71,0.14)', border: `1px solid ${P.rule}` }}>
        <TileBand uid={`${uid}r`} height={30} />
        <div className="px-7 pb-8 pt-7">
          <Label color={P.aperolDeep}>RSVP</Label>
          <h2 className="mt-2" style={{ ...SOFT, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(34px, 10.5cqi, 44px)', lineHeight: 1, color: P.ink }}>
            Save you a seat?
          </h2>
          {by && <p className="mt-3" style={{ fontSize: 15.5, color: P.soft }}>Let me know by {by.weekday} {by.day} {by.month}</p>}
          <div className="mt-6 grid grid-cols-2 gap-2.5" role="group" aria-label="Your answer">
            {(['yes', 'no'] as const).map((a) => {
              const on = r.answer === a
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => r.setAnswer(a)}
                  aria-pressed={on}
                  className="ll-btn min-h-[50px] rounded-full px-3"
                  style={{ fontFamily: sans, fontSize: 16, fontWeight: 500, background: on ? (a === 'yes' ? P.aperol : P.ink) : 'transparent', color: on ? '#FFF8EE' : P.ink, border: `1.5px solid ${on ? 'transparent' : P.ink}` }}
                >
                  {a === 'yes' ? 'Save me one' : 'Can’t make it'}
                </button>
              )
            })}
          </div>
          {r.answer && (
            <div className="ll-pop mt-5">
              <p style={{ fontFamily: hand, fontSize: 25, lineHeight: 1.1, color: P.aperolDeep }}>{r.answer === 'yes' ? 'Lovely! Tell me on…' : 'We’ll miss you. Tell me on…'}</p>
              <div className="mt-3 grid gap-2">
                {r.channels.map((c) => (
                  <a
                    key={c.kind}
                    href={isPreview ? undefined : c.href}
                    target={c.kind === 'whatsapp' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-disabled={isPreview || undefined}
                    className="ll-btn flex min-h-[48px] items-center justify-center gap-2.5 rounded-full"
                    style={{ fontFamily: sans, fontSize: 15.5, fontWeight: 500, color: P.ink, background: P.linen }}
                  >
                    <ChannelIcon kind={c.kind} />
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}

/* ── The invitation ─────────────────────────────────────────────────── */

export default function BirthdayLongLunch({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const name = data.celebrantName?.trim() || 'Sofia'
  const age = ageOf(data.age)
  const what = partyName(name, age)
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const theme = data.theme?.trim() || 'A long lunch in the sun'
  const plan = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const photos = useMemo(() => {
    const own = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? [data.celebrantPhoto] : []
    return [...own, ...galleryImages(data.galleryImages, 6)].slice(0, 6)
  }, [data.celebrantPhoto, data.galleryImages])
  const map = mapsHref(data.mapsUrl, venue, address)
  const calendar = calendarHref(what, data.date, data.time, [venue, address].filter(Boolean).join(', ') || undefined, 5)
  const signer = data.invitedBy?.trim() || name
  const animate = !isPreview

  const nameCqi = Math.min(34, 92 / (Math.max(name.length, 4) * 0.52))

  return (
    <div className={`ll relative ${animate ? 'll-in' : ''}`} style={{ backgroundColor: P.plaster, color: P.ink, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .ll .ll-valance { animation: ll-breeze 6s ease-in-out infinite; transform-origin: 50% 0; }
        @keyframes ll-breeze { 0%, 100% { transform: scaleY(1) skewX(0deg); } 40% { transform: scaleY(1.06) skewX(-1.2deg); } 70% { transform: scaleY(.98) skewX(.8deg); } }
        .ll.ll-in .ll-awning { animation: ll-drop 1s cubic-bezier(.3,1.4,.55,1) .1s both; transform-origin: 50% 0; }
        @keyframes ll-drop { from { transform: scaleY(0); } }
        .ll .ll-dapple { animation: ll-dapple 11s ease-in-out infinite alternate; }
        .ll .ll-dapple-2 { animation: ll-dapple-2 14s ease-in-out infinite alternate; }
        @keyframes ll-dapple { from { transform: translate(-14px, -6px) rotate(-1.5deg) scale(1.04); } to { transform: translate(16px, 10px) rotate(1.5deg) scale(1.08); } }
        @keyframes ll-dapple-2 { from { transform: translate(18px, 8px) scale(1.1); } to { transform: translate(-12px, -10px) scale(1.04); } }
        .ll .ll-branch { animation: ll-branch 7s ease-in-out infinite; }
        @keyframes ll-branch { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2.4deg); } }
        .ll .ll-swing { animation: ll-swing 4.6s ease-in-out infinite; transform-box: fill-box; }
        .ll .ll-swing-2 { animation-duration: 5.4s; animation-delay: -1.8s; }
        @keyframes ll-swing { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        .ll.ll-in .ll-hang { animation: ll-hang 1.3s cubic-bezier(.3,1.25,.5,1) .7s both; }
        @keyframes ll-hang { from { transform: translate(40%, -60%) rotate(18deg); opacity: 0; } 40% { opacity: 1; } }
        .ll.ll-in .ll-roll { animation: ll-roll 1.2s cubic-bezier(.25,.9,.35,1) 1.2s both; }
        @keyframes ll-roll { from { transform: translateX(-160%) rotate(-300deg); } }
        .ll.ll-in .ll-rise { animation: ll-rise 1s cubic-bezier(.2,.75,.25,1) both; }
        @keyframes ll-rise { from { opacity: 0; transform: translateY(18px); } }
        .ll.ll-in .ll-write { animation: ll-write 1.2s steps(20) 1.5s both; }
        @keyframes ll-write { from { clip-path: inset(-40% 100% -40% -5%); } to { clip-path: inset(-40% -5% -40% -5%); } }
        .ll .ll-wave { animation: ll-wave 3s linear infinite; }
        @keyframes ll-wave { to { transform: translateX(40px); } }
        .ll .ll-slosh { animation: ll-slosh 5s ease-in-out infinite; }
        @keyframes ll-slosh { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        .ll .ll-ice { animation: ll-ice 5s ease-in-out infinite; transform-box: fill-box; }
        .ll .ll-ice-2 { animation-delay: -2.4s; }
        @keyframes ll-ice { 0%, 100% { translate: 0 0; } 50% { translate: 2px 2.5px; } }
        .ll .ll-bubble { animation: ll-bubble 2.8s linear infinite; }
        @keyframes ll-bubble { from { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } to { transform: translateY(-58px); opacity: 0; } }
        .ll .ll-btn { transition: transform .18s ease, opacity .18s ease, background-color .18s ease; }
        .ll .ll-btn:active { transform: scale(.97); }
        .ll .ll-pop { animation: ll-pop .38s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes ll-pop { from { opacity: 0; transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) {
          .ll .ll-valance, .ll.ll-in .ll-awning, .ll .ll-dapple, .ll .ll-dapple-2, .ll .ll-branch, .ll .ll-swing, .ll.ll-in .ll-hang, .ll.ll-in .ll-roll,
          .ll.ll-in .ll-rise, .ll.ll-in .ll-write, .ll .ll-wave, .ll .ll-slosh, .ll .ll-ice, .ll .ll-bubble { animation: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={P.ink} background="rgba(251,244,230,0.9)" border={P.rule} />

      {/* ── The terrace ──────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: isPreview ? 700 : '100svh', backgroundColor: P.plaster, backgroundImage: `radial-gradient(90% 60% at 30% 30%, rgba(255,214,140,0.35), transparent 70%), ${grain(0.05).backgroundImage}`, backgroundSize: `auto, ${grain(0.05).backgroundSize}` }}
      >
        <Dapple uid={uid} seed={3} className="ll-dapple" style={{ opacity: 0.13 }} />
        <Dapple uid={uid} seed={8} className="ll-dapple-2" style={{ opacity: 0.08 }} />

        <div className="ll-awning relative z-[2] h-[clamp(64px,19cqi,96px)] w-full">
          <div className="ll-valance h-full w-full">
            <Awning uid={uid} />
          </div>
        </div>

        <div className="ll-hang pointer-events-none absolute top-[clamp(30px,10cqi,60px)] z-[3] h-[54cqi] max-h-[260px] w-[56cqi] max-w-[270px]" style={{ right: 'max(-6cqi, -22px)' }}>
          <LemonBranch uid={uid} />
        </div>

        {/* the words and the table's still life are measured against a phone-width column, so a laptop shows the same composition */}
        <div className="relative z-[2] mx-auto flex w-full max-w-[30rem] flex-1 flex-col" style={{ containerType: 'inline-size' }}>
        <div className="flex flex-1 flex-col justify-center px-7 pb-[8cqi] pt-[30cqi]">
          <div className="ll-rise" style={{ animationDelay: '.6s' }}>
            <Label color={P.aperolDeep}>{theme}</Label>
          </div>
          <h1 className="mt-[4cqi]" style={{ fontWeight: 400 }}>
            <span className="ll-rise block break-words" style={{ ...SOFT, fontFamily: serif, fontStyle: 'italic', fontSize: `clamp(56px, ${nameCqi.toFixed(1)}cqi, 168px)`, lineHeight: 0.9, letterSpacing: '-0.02em', color: P.ink, animationDelay: '.8s' }}>
              {name}
            </span>
            <span className="ll-write mt-[2cqi] block" style={{ fontFamily: hand, fontSize: 'clamp(38px, 14cqi, 64px)', lineHeight: 1, color: P.aperol, transform: 'rotate(-3deg)', transformOrigin: 'left' }}>
              {age ? `is turning ${numberWords(age)}` : 'is having a birthday'}
            </span>
          </h1>
          <div className="ll-rise mt-[8cqi] space-y-1" style={{ animationDelay: '1.3s' }}>
            {date && <p style={{ ...SOFT, fontFamily: serif, fontSize: 'clamp(24px, 8cqi, 36px)', lineHeight: 1.15 }}>{date.weekday} {date.day} {date.month}</p>}
            <p style={{ fontSize: 'clamp(15px, 4.6cqi, 19px)', color: P.soft }}>{[time && `Lunch from ${time}`, venue].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
        </div>

        {/* the table, with the first spritz already poured */}
        <div className="pointer-events-none relative z-[2] h-[30cqi] max-h-[150px] w-full">
          <Table uid={uid} />
          <div className="relative mx-auto h-full w-full max-w-[30rem]" style={{ containerType: 'inline-size' }}>
          <div className="absolute bottom-[9cqi] right-[9cqi] h-[40cqi] max-h-[190px] w-[25cqi] max-w-[120px]" style={{ filter: 'drop-shadow(0 8px 8px rgba(35,48,71,0.16))' }}>
            <Spritz uid={`${uid}h`} />
          </div>
          <svg viewBox="-40 -28 80 56" className="ll-roll absolute bottom-[11cqi] left-[30cqi] h-[13cqi] w-[18cqi]" style={{ overflow: 'visible', filter: 'drop-shadow(0 5px 4px rgba(35,48,71,0.2))' }} aria-hidden>
            <Lemon uid={uid} x={0} y={0} r={-8} />
          </svg>
          <div className="ll-roll absolute bottom-[12cqi] left-[8cqi] h-[17cqi] w-[17cqi] max-h-[84px] max-w-[84px]" style={{ filter: 'drop-shadow(0 6px 6px rgba(35,48,71,0.18))', animationDelay: '1.35s' }}>
            <LemonSlice uid={uid} />
          </div>
          </div>
        </div>
      </section>

      <TileBand uid={uid} />

      {/* ── The afternoon ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-6 pt-14" style={{ backgroundColor: P.linen }}>
        <Dapple uid={uid} seed={12} className="ll-dapple" style={{ opacity: 0.08 }} />
        <Reveal disabled={isPreview} className="relative mx-auto w-[min(100%,27rem)]">
          <Label color={P.aperolDeep}>Where & when</Label>
          <div className="mt-4 space-y-6">
            <div>
              <p style={{ ...SOFT, fontFamily: serif, fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.05 }}>{date ? date.long : 'Date to come'}</p>
              {time && <p className="mt-1" style={{ fontSize: 16.5, color: P.soft }}>From {time}, until the sun goes down</p>}
            </div>
            {(venue || address) && (
              <div>
                <p style={{ ...SOFT, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.05 }}>{venue}</p>
                {address && <p className="mt-1" style={{ fontSize: 16.5, lineHeight: 1.45, color: P.soft }}>{address}</p>}
              </div>
            )}
          </div>
          {(map || calendar) && (
            <div className="mt-7 grid grid-cols-2 gap-2.5">
              {map && <Btn href={map} isPreview={isPreview} solid>Directions</Btn>}
              {calendar && <Btn href={calendar} isPreview={isPreview}>Add to calendar</Btn>}
            </div>
          )}
          {data.dressCode?.trim() && (
            <p className="mt-8" style={{ fontSize: 16.5, lineHeight: 1.45 }}>
              <span className="uppercase" style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.28em', color: P.faint }}>Wear · </span>
              {data.dressCode.trim()}
            </p>
          )}
          {data.guestNote?.trim() && (
            <p className="mt-6" style={{ fontFamily: hand, fontSize: 26, lineHeight: 1.15, color: P.aperolDeep, transform: 'rotate(-1.5deg)' }}>
              {data.guestNote.trim()}
            </p>
          )}

          {plan.length > 0 && (
            <div className="mt-12">
              <Label color={P.aperolDeep}>The afternoon</Label>
              <ol className="mt-4">
                {plan.map((it, i) => (
                  <li key={i} className="grid grid-cols-[6.4rem_1fr] items-baseline gap-3 py-3" style={{ borderTop: i ? `1px dashed ${P.rule}` : undefined }}>
                    <span className="whitespace-nowrap" style={{ fontFamily: hand, fontSize: 24, lineHeight: 1, color: P.aperol }}>{it.time || ''}</span>
                    <span style={{ ...SOFT, fontFamily: serif, fontSize: 22, lineHeight: 1.2 }}>{it.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Reveal>
        <Countdown uid={uid} date={data.date} time={data.time} enabled={!isPreview} />
      </section>

      {/* ── A note ───────────────────────────────────────────────────── */}
      {note.length > 0 && (
        <section className="px-7 pb-14 pt-14">
          <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
            {note.map((line, i) => (
              <p key={i} className="mt-4" style={{ ...SOFT, fontFamily: serif, fontSize: 'clamp(24px, 7.4cqi, 31px)', lineHeight: 1.25, textWrap: 'pretty' }}>
                {line}
              </p>
            ))}
            <p className="mt-5" style={{ fontFamily: hand, fontSize: 32, color: P.aperol }}>— {signer}</p>
            {data.giftNote?.trim() && <p className="mt-8 pt-5" style={{ borderTop: `1px solid ${P.rule}`, fontSize: 15.5, color: P.soft }}>{data.giftNote.trim()}</p>}
          </Reveal>
        </section>
      )}

      {/* ── Photos ───────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="px-5 pb-14 pt-2">
          <div className="mx-auto grid w-[min(100%,28rem)] grid-cols-2 gap-5">
            {photos.map((src, i) => (
              <Reveal key={i} disabled={isPreview} delay={(i % 2) * 90}>
                <figure className="relative m-0 bg-white p-2 pb-7" style={{ transform: `rotate(${[-2, 2.4, 1.4, -1.8, -1.2, 2][i % 6]}deg)`, boxShadow: '0 14px 26px rgba(35,48,71,0.16)' }}>
                  <span aria-hidden className="absolute left-1/2 top-[-9px] block h-[18px] w-[58px] -translate-x-1/2" style={{ background: i % 2 ? 'rgba(31,78,156,0.55)' : 'rgba(232,96,44,0.6)', transform: `translateX(-50%) rotate(${i % 2 ? 4 : -5}deg)` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-[4/5] w-full object-cover" style={{ filter: 'saturate(1.04) contrast(1.02)' }} />
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Rsvp uid={uid} phone={data.rsvpPhone} email={data.rsvpEmail} what={what} date={data.date} rsvpBy={data.rsvpBy} isPreview={isPreview} />

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title={`Notes for ${name}`}
          intro={`A birthday wish, a memory, a toast for later — leave ${name} a few words. Everyone who opens this page can read them.`}
          noun="note"
          previewWishes={SAMPLE_WISHES}
          namePlaceholder="e.g. Marco & Bea"
        />
      )}

      {/* ── Foot ───────────────────────────────────────────────────── */}
      <footer className="text-center" style={{ background: P.cobalt, color: P.cream }}>
        <TileBand uid={`${uid}f`} height={36} />
        <div className="px-6 pb-10 pt-12">
          <p style={{ ...SOFT, fontFamily: serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1 }}>{name}{age ? ` at ${age}` : ''}</p>
          <p className="mt-3 uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', color: 'rgba(255,244,226,0.65)' }}>
            {[date ? `${date.day} ${date.month} ${date.year}` : '', venue].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-9">
            <Credit isPreview={isPreview} color="rgba(255,244,226,0.65)" linkColor={P.cream} />
          </div>
        </div>
      </footer>
    </div>
  )
}
