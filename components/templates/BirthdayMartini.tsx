'use client'

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { gloock } from './kit/fonts/gloock'
import { italianno } from './kit/fonts/italianno'
import { jost } from './kit/fonts/jost'
import { caveat } from './kit/fonts/caveat'
import { calendarHref, dateParts, galleryImages, grain, mapsHref, parseLines, parseSchedule, timeLabel, useCountdown, type InviteProps } from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords } from './kit/words'
import { ChannelIcon, ageOf, partyName, useRsvp } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Dirty Martini — a cocktail-hour birthday.
 * Olive-green velvet, and on it a cream cocktail napkin with a scalloped edge,
 * printed in olive ink and pimento red. A martini is drawn on the napkin: the
 * olive pick drops in, the gin splashes and rings out, then settles and sways.
 * Below, the evening as the bar's menu, the venue on a red matchbook, a note
 * written on a second napkin, and an RSVP that sends itself.
 */

const P = {
  velvet: '#27310F',
  velvetDeep: '#1D250A',
  card: '#F4EDDD',
  ink: '#2F3815',
  soft: 'rgba(47,56,21,0.74)',
  faint: 'rgba(47,56,21,0.52)',
  rule: 'rgba(47,56,21,0.18)',
  olive: '#6E7D2C',
  oliveLight: '#97A645',
  pimento: '#C8372D',
  cream: '#F4EDDD',
  creamSoft: 'rgba(244,237,221,0.76)',
  creamFaint: 'rgba(244,237,221,0.5)',
  creamRule: 'rgba(244,237,221,0.16)',
  gin: 'rgba(214,214,160,0.5)',
}

const serif = gloock.style.fontFamily
const script = italianno.style.fontFamily
const sans = jost.style.fontFamily
const hand = caveat.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: P.velvet,
  surface: P.card,
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.pimento,
  onAccent: '#FFF6EC',
  heading: serif,
  body: sans,
  headingStyle: { fontSize: 'clamp(30px, 9cqi, 40px)', fontWeight: 400, color: P.cream, letterSpacing: '-0.01em' },
}

const SAMPLE_WISHES = [
  { name: 'Theo', message: 'Saving you the corner booth. Thirty-five looks very good on you.' },
  { name: 'Rosa & Kit', message: 'We’ll bring the olives. You bring the stories.' },
]

/* ── Paper ──────────────────────────────────────────────────────────── */

/** The outline of a napkin with a scalloped edge, every bump the same size, in a w×h box. */
function scallopPath(w: number, h: number, step: number): string {
  const nx = Math.max(2, Math.round(w / step))
  const ny = Math.max(2, Math.round(h / step))
  const sx = w / nx
  const sy = h / ny
  let d = 'M0 0'
  for (let i = 1; i <= nx; i++) d += `A${sx / 2} ${sx / 2.2} 0 0 1 ${(i * sx).toFixed(2)} 0`
  for (let i = 1; i <= ny; i++) d += `A${sy / 2.2} ${sy / 2} 0 0 1 ${w} ${(i * sy).toFixed(2)}`
  for (let i = nx - 1; i >= 0; i--) d += `A${sx / 2} ${sx / 2.2} 0 0 1 ${(i * sx).toFixed(2)} ${h}`
  for (let i = ny - 1; i >= 0; i--) d += `A${sy / 2.2} ${sy / 2} 0 0 1 0 ${(i * sy).toFixed(2)}`
  return `${d}Z`
}

/** A paper cocktail napkin with an embossed border, behind whatever sits on it. */
function Napkin({ w, h, className, style, children }: { w: number; h: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const edge = useMemo(() => scallopPath(w, h, 13), [w, h])
  const tooth = grain(0.05, 140)
  // At least w:h, taller when the words need it — the paper stretches with them.
  return (
    <div className={className} style={{ containerType: 'inline-size', ...style }}>
    <div className="relative flex flex-col" style={{ minHeight: `${((h / w) * 100).toFixed(2)}cqi` }}>
      <svg viewBox={`-7 -7 ${w + 14} ${h + 14}`} preserveAspectRatio="none" className="absolute h-full w-full" style={{ inset: 0, overflow: 'visible', filter: 'drop-shadow(0 2px 1px rgba(10,14,3,0.3)) drop-shadow(0 26px 30px rgba(10,14,3,0.45))' }} aria-hidden>
        <path d={edge} fill={P.card} />
        <rect x={12} y={12} width={w - 24} height={h - 24} fill="none" stroke="rgba(47,56,21,0.13)" strokeWidth={1} strokeDasharray="1.2 3.4" strokeLinecap="round" />
        <rect x={17} y={17} width={w - 34} height={h - 34} fill="none" stroke="rgba(47,56,21,0.08)" strokeWidth={0.8} />
      </svg>
      <div className="pointer-events-none absolute inset-0" style={{ ...tooth, opacity: 0.9, mixBlendMode: 'multiply' }} aria-hidden />
      <div className="relative flex w-full flex-1 flex-col">{children}</div>
    </div>
    </div>
  )
}

/* ── The martini ────────────────────────────────────────────────────── */

const WAVE = (() => {
  let d = 'M-120 80'
  for (let x = -120; x <= 360; x += 20) d += `Q${x + 10} ${x % 40 === 0 ? 77.6 : 82.4} ${x + 20} 80`
  return `${d}V170H-120Z`
})()

function Martini({ uid }: { uid: string }) {
  const bowl = 'M30 60 L170 60 L100 150 Z'
  return (
    <svg viewBox="0 0 200 250" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <clipPath id={`${uid}-bowl`}>
          <path d="M31.5 61.2 L168.5 61.2 L100 149 Z" />
        </clipPath>
      </defs>

      {/* shadow on the napkin */}
      <ellipse cx={100} cy={236} rx={48} ry={5.5} fill="rgba(47,56,21,0.12)" />

      {/* the drink */}
      <g clipPath={`url(#${uid}-bowl)`}>
        <g className="dm-slosh" style={{ transformOrigin: '100px 150px' }}>
          <path className="dm-wave" d={WAVE} fill={P.gin} />
          <path d="M60 104 L96 140" stroke="rgba(255,255,255,0.55)" strokeWidth={3} strokeLinecap="round" />
        </g>
        <ellipse className="dm-ripple" cx={118} cy={80} rx={26} ry={2.6} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.2} />
      </g>

      {/* the pick and its olives */}
      <g className="dm-pick">
        <g transform="rotate(-24 120 92)">
          <line x1={120} y1={18} x2={120} y2={136} stroke={P.pimento} strokeWidth={2.2} strokeLinecap="round" />
          <circle cx={120} cy={16} r={3.4} fill={P.pimento} />
          {[106, 124].map((cy, i) => (
            <g key={cy} transform={`rotate(${i ? 8 : -6} 120 ${cy})`}>
              <ellipse cx={120} cy={cy} rx={9.6} ry={8.2} fill={P.olive} />
              <ellipse cx={116.4} cy={cy - 3} rx={3.4} ry={2.2} fill="rgba(255,255,255,0.32)" />
              <circle cx={120} cy={cy} r={3} fill={P.pimento} />
            </g>
          ))}
        </g>
      </g>

      {/* the glass, drawn in olive ink */}
      <g fill="none" stroke={P.ink} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d={bowl} />
        <ellipse cx={100} cy={60} rx={70} ry={5.2} />
        <path d="M100 150 V228" />
        <path d="M58 233 Q100 222 142 233 Q100 241 58 233 Z" />
      </g>
      <path d="M44 66 L92 128" stroke="rgba(255,255,255,0.85)" strokeWidth={2} strokeLinecap="round" />

      {/* the splash */}
      <g className="dm-splash" fill={P.gin} stroke="rgba(47,56,21,0.45)" strokeWidth={0.6}>
        {[[-1, 14], [-0.4, 22], [0.5, 19], [1, 12], [0.1, 26]].map(([dx, up], i) => (
          <circle key={i} cx={118} cy={78} r={i % 2 ? 2.2 : 1.6} style={{ ['--dx' as string]: `${dx * 22}px`, ['--up' as string]: `${-up}px`, animationDelay: `${1.05 + i * 0.02}s` }} />
        ))}
      </g>
    </svg>
  )
}

/* ── The matchbook ──────────────────────────────────────────────────── */

function Matchbook({ venue, address }: { venue: string; address: string }) {
  return (
    <div className="relative mx-auto w-[min(78cqi,320px)]" style={{ transform: 'rotate(-3deg)' }}>
      {/* cover */}
      <div className="relative overflow-hidden rounded-[6px] px-6 pb-14 pt-7 text-center" style={{ background: `linear-gradient(160deg, #D24433, ${P.pimento} 55%, #A92A22)`, boxShadow: '0 24px 40px rgba(8,10,2,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
        <div className="pointer-events-none absolute inset-0" style={{ ...grain(0.08, 120), mixBlendMode: 'multiply' }} aria-hidden />
        <p className="relative uppercase" style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.34em', color: 'rgba(255,240,226,0.8)' }}>
          Cocktails at
        </p>
        <p className="relative mt-1 break-words" style={{ fontFamily: script, fontSize: 'clamp(46px, 15cqi, 62px)', lineHeight: 0.95, color: '#FFF1E2' }}>
          {venue}
        </p>
        {address && (
          <p className="relative mt-3" style={{ fontFamily: sans, fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,240,226,0.86)' }}>
            {address}
          </p>
        )}
        {/* the fold and the striker */}
        <span aria-hidden className="absolute inset-x-0 bottom-[34px] block h-px" style={{ background: 'rgba(60,8,4,0.35)' }} />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 block h-[34px]"
          style={{ background: 'repeating-linear-gradient(90deg, #3B2A20 0 2px, #5A4535 2px 3px, #2E2018 3px 5px)', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.35)' }}
        />
      </div>
    </div>
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
      className="dm-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 text-center"
      style={{
        fontFamily: sans,
        fontSize: 15,
        fontWeight: 500,
        ...(solid ? { background: P.cream, color: P.ink } : { border: `1px solid ${P.creamRule}`, color: P.cream }),
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
    <Reveal disabled={!enabled} className="px-6 pb-4 pt-16 text-center">
      <p style={{ fontFamily: serif, fontSize: 'clamp(92px, 32cqi, 140px)', lineHeight: 0.9, color: P.cream }}>{days}</p>
      <p className="mt-1" style={{ fontFamily: script, fontSize: 'clamp(38px, 12cqi, 52px)', lineHeight: 1, color: '#E9A79B' }}>
        {days === 1 ? 'day until the first round' : 'days until the first round'}
      </p>
    </Reveal>
  )
}

function Rsvp({ phone, email, what, date, rsvpBy, isPreview }: { phone?: string; email?: string; what: string; date?: string; rsvpBy?: string; isPreview: boolean }) {
  const r = useRsvp({ phone, email, what, date })
  if (!r.available) return null
  const by = dateParts(rsvpBy)
  return (
    <section className="px-5 pb-20 pt-10">
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] rounded-[4px] px-7 pb-8 pt-9 text-center" style={{ background: P.card, color: P.ink, boxShadow: '0 30px 50px rgba(8,10,2,0.45)', outline: `1px solid ${P.rule}`, outlineOffset: -9 }}>
        <Label color={P.pimento}>RSVP</Label>
        <h2 className="mt-2" style={{ fontFamily: serif, fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.05 }}>
          Can I pour you one?
        </h2>
        {by && <p className="mt-2.5" style={{ fontSize: 15.5, color: P.soft }}>Kindly reply by {by.weekday} {by.day} {by.month}</p>}
        <div className="mt-6 grid grid-cols-2 gap-2.5" role="group" aria-label="Your answer">
          {(['yes', 'no'] as const).map((a) => {
            const on = r.answer === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => r.setAnswer(a)}
                aria-pressed={on}
                className="dm-btn min-h-[50px] rounded-full px-3"
                style={{
                  fontFamily: sans,
                  fontSize: 16,
                  fontWeight: 500,
                  background: on ? (a === 'yes' ? P.pimento : P.ink) : 'transparent',
                  color: on ? '#FFF6EC' : P.ink,
                  border: `1px solid ${on ? 'transparent' : 'rgba(47,56,21,0.3)'}`,
                }}
              >
                {a === 'yes' ? 'Make it a double' : 'Can’t make it'}
              </button>
            )
          })}
        </div>
        {r.answer && (
          <div className="dm-pop mt-5">
            <p style={{ fontFamily: hand, fontSize: 24, lineHeight: 1.1, color: P.olive }}>{r.answer === 'yes' ? 'Cheers! Send it to me on…' : 'Next round’s on you. Tell me on…'}</p>
            <div className="mt-3 grid gap-2">
              {r.channels.map((c) => (
                <a
                  key={c.kind}
                  href={isPreview ? undefined : c.href}
                  target={c.kind === 'whatsapp' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className="dm-btn flex min-h-[48px] items-center justify-center gap-2.5 rounded-full"
                  style={{ fontFamily: sans, fontSize: 15.5, fontWeight: 500, color: P.ink, border: `1px solid rgba(47,56,21,0.26)` }}
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

export default function BirthdayMartini({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const name = data.celebrantName?.trim() || 'Jules'
  const age = ageOf(data.age)
  const what = partyName(name, age)
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const theme = data.theme?.trim() || 'Cocktails for a birthday'
  const plan = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const photos = useMemo(() => {
    const own = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? [data.celebrantPhoto] : []
    return [...own, ...galleryImages(data.galleryImages, 6)].slice(0, 6)
  }, [data.celebrantPhoto, data.galleryImages])
  const map = mapsHref(data.mapsUrl, venue, address)
  const calendar = calendarHref(what, data.date, data.time, [venue, address].filter(Boolean).join(', ') || undefined, 4)
  const signer = data.invitedBy?.trim() || name
  const animate = !isPreview

  const turns = age ? `turns ${numberWords(age)}` : 'has a birthday'
  const longestWord = Math.max(4, ...name.split(/[\s-]+/).map((w) => w.length + 1))
  const nameCqi = Math.min(21, 74 / (longestWord * 0.56))
  const top = [date ? `${date.weekday} ${date.day} ${date.month}` : '', time].filter(Boolean).join(' · ')

  // Velvet: a soft pool of light on the cloth, a nap you can almost feel.
  const velvet: CSSProperties = {
    backgroundColor: P.velvet,
    backgroundImage: [
      'radial-gradient(70% 40% at 50% 24%, rgba(170,190,90,0.2), rgba(170,190,90,0) 70%)',
      'radial-gradient(120% 60% at 50% 110%, rgba(0,0,0,0.35), rgba(0,0,0,0) 60%)',
      grain(0.09, 160).backgroundImage as string,
    ].join(', '),
    backgroundSize: `auto, auto, ${grain(0.09, 160).backgroundSize}`,
  }

  return (
    <div className={`dm relative ${animate ? 'dm-in' : ''}`} style={{ ...velvet, color: P.cream, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .dm .dm-wave { animation: dm-wave 3.4s linear infinite; }
        @keyframes dm-wave { to { transform: translateX(40px); } }
        .dm .dm-slosh { animation: dm-slosh 5.5s ease-in-out infinite; }
        @keyframes dm-slosh { 0%, 100% { transform: rotate(-2.2deg); } 50% { transform: rotate(2.2deg); } }
        .dm .dm-pick { animation: dm-bob 5.5s ease-in-out infinite; }
        @keyframes dm-bob { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(1.4px) rotate(1.2deg); } }
        .dm .dm-ripple, .dm .dm-splash circle { opacity: 0; }
        .dm.dm-in .dm-pick { animation: dm-drop .78s cubic-bezier(.55,0,.85,.36) .3s both, dm-settle .9s cubic-bezier(.2,.8,.3,1) 1.08s both, dm-bob 5.5s ease-in-out 2s infinite; }
        @keyframes dm-drop { from { transform: translateY(-190px) rotate(-8deg); } to { transform: translateY(6px) rotate(0); } }
        @keyframes dm-settle { from { transform: translateY(6px); } 40% { transform: translateY(-3px); } to { transform: translateY(0); } }
        .dm.dm-in .dm-ripple { transform-box: fill-box; transform-origin: center; animation: dm-ripple 1.3s ease-out 1.08s both; }
        @keyframes dm-ripple { from { opacity: .9; transform: scale(.15); } to { opacity: 0; transform: scale(1.7); } }
        .dm.dm-in .dm-splash circle { animation: dm-splash .75s cubic-bezier(.2,.6,.4,1) both; }
        @keyframes dm-splash { 0% { opacity: 1; transform: translate(0, 0); } 55% { opacity: 1; transform: translate(calc(var(--dx) * .7), var(--up)); } 100% { opacity: 0; transform: translate(var(--dx), calc(var(--up) * .2 + 8px)); } }
        .dm.dm-in .dm-card { animation: dm-card 1s cubic-bezier(.2,.75,.25,1) both; }
        @keyframes dm-card { from { opacity: 0; transform: translateY(36px) rotate(2deg); } }
        .dm.dm-in .dm-script { animation: dm-write 1.1s steps(18) 1.4s both; }
        @keyframes dm-write { from { clip-path: inset(-30% 100% -30% -5%); } to { clip-path: inset(-30% -5% -30% -5%); } }
        .dm .dm-btn { transition: transform .18s ease, opacity .18s ease, background-color .18s ease; }
        .dm .dm-btn:active { transform: scale(.97); }
        .dm .dm-pop { animation: dm-pop .38s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes dm-pop { from { opacity: 0; transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) {
          .dm .dm-wave, .dm .dm-slosh, .dm .dm-pick, .dm.dm-in .dm-pick, .dm.dm-in .dm-card, .dm.dm-in .dm-script { animation: none; }
          .dm.dm-in .dm-ripple, .dm.dm-in .dm-splash circle { animation: none; opacity: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={P.cream} background="rgba(29,37,10,0.7)" border={P.creamRule} />

      {/* ── The napkin ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-4" style={{ minHeight: isPreview ? 700 : '100svh', paddingTop: 'clamp(40px, 9cqi, 64px)', paddingBottom: 'clamp(40px, 9cqi, 64px)' }}>
        <p className="mb-[6cqi] text-center uppercase" style={{ fontFamily: sans, fontSize: 'clamp(10.5px, 3cqi, 12.5px)', fontWeight: 600, letterSpacing: '0.36em', color: P.creamFaint }}>
          {theme}
        </p>
        <div className="dm-card w-[min(88cqi,400px)]" style={{ transform: 'rotate(-1.4deg)', containerType: 'inline-size' }}>
          <Napkin w={340} h={450}>
            <div className="flex flex-1 flex-col items-center px-[9cqi] pb-[11cqi] pt-[10cqi] text-center" style={{ color: P.ink }}>
              <p className="uppercase" style={{ fontFamily: sans, fontSize: 'clamp(9.5px, 3cqi, 12px)', fontWeight: 600, letterSpacing: '0.3em', color: P.pimento }}>
                {top || 'Cocktails'}
              </p>
              <div className="mt-[2cqi] h-[60cqi] w-[50cqi]">
                <Martini uid={uid} />
              </div>
              <h1 className="mt-[1cqi]" style={{ fontWeight: 400 }}>
                <span className="block" style={{ overflowWrap: 'break-word', fontFamily: serif, fontSize: `clamp(30px, ${nameCqi.toFixed(1)}cqi, 92px)`, lineHeight: 0.92, letterSpacing: '-0.02em', color: P.ink }}>
                  {name}
                </span>
                <span className="dm-script -mt-[1.5cqi] block" style={{ fontFamily: script, fontSize: 'clamp(40px, 15cqi, 66px)', lineHeight: 1, color: P.pimento }}>
                  {turns}
                </span>
              </h1>
              {venue && (
                <p className="mt-auto pt-[3cqi]" style={{ fontFamily: sans, fontSize: 'clamp(12px, 3.8cqi, 15px)', letterSpacing: '0.06em', color: P.soft }}>
                  {venue}
                </p>
              )}
            </div>
          </Napkin>
        </div>
      </section>

      {/* ── The menu ─────────────────────────────────────────────────── */}
      <section className="px-5 pb-14 pt-4">
        <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
          <div className="rounded-[3px] px-7 pb-8 pt-9" style={{ background: P.card, color: P.ink, boxShadow: '0 30px 50px rgba(8,10,2,0.45)', outline: `1px solid ${P.rule}`, outlineOffset: -9 }}>
            <p className="text-center" style={{ fontFamily: script, fontSize: 'clamp(44px, 14cqi, 58px)', lineHeight: 0.9, color: P.pimento }}>
              The evening
            </p>
            <p className="mt-2 text-center uppercase" style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', color: P.faint }}>
              {date ? `${date.weekday} ${date.day} ${date.month} ${date.year}` : 'Date to come'}
            </p>
            <svg viewBox="0 0 120 8" className="mx-auto my-5 block h-2 w-28" aria-hidden>
              <path d="M2 4H48M72 4H118" stroke={P.rule} strokeWidth={1} />
              <ellipse cx={60} cy={4} rx={6} ry={4.8} fill={P.olive} />
              <circle cx={60} cy={4} r={1.8} fill={P.pimento} />
            </svg>

            {plan.length > 0 && (
              <ol className="space-y-3.5">
                {plan.map((it, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span style={{ fontFamily: serif, fontSize: 19, lineHeight: 1.25 }}>{it.title}</span>
                    {it.time && (
                      <>
                        <span aria-hidden className="min-w-[16px] flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: 'rgba(47,56,21,0.35)' }} />
                        <span className="shrink-0 tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: P.pimento }}>{it.time}</span>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            )}

            {data.dressCode?.trim() && (
              <div className="mt-7 text-center">
                <Label>Dress</Label>
                <p className="mt-1.5" style={{ fontFamily: serif, fontSize: 19, lineHeight: 1.3 }}>{data.dressCode.trim()}</p>
              </div>
            )}
            {data.guestNote?.trim() && (
              <p className="mt-7 border-t pt-5 text-center" style={{ borderColor: P.rule, fontFamily: hand, fontSize: 24, lineHeight: 1.15, color: P.pimento }}>
                {data.guestNote.trim()}
              </p>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Where ────────────────────────────────────────────────────── */}
      {(venue || address) && (
        <section className="px-5 pb-6 pt-6">
          <Reveal disabled={isPreview}>
            <Matchbook venue={venue || 'The bar'} address={address} />
            {(map || calendar) && (
              <div className="mx-auto mt-10 grid w-[min(100%,24rem)] grid-cols-2 gap-2.5">
                {map && <Btn href={map} isPreview={isPreview} solid>Find the bar</Btn>}
                {calendar && <Btn href={calendar} isPreview={isPreview}>Add to calendar</Btn>}
              </div>
            )}
          </Reveal>
        </section>
      )}

      <Countdown date={data.date} time={data.time} enabled={!isPreview} />

      {/* ── A note, on a napkin ──────────────────────────────────────── */}
      {note.length > 0 && (
        <section className="px-5 pb-10 pt-14">
          <Reveal disabled={isPreview} className="mx-auto w-[min(84cqi,350px)]" style={{ transform: 'rotate(1.8deg)' }}>
            <Napkin w={320} h={Math.max(320, 200 + note.join(' ').length * 1.25)}>
              <div className="flex flex-1 flex-col justify-center px-[12%] py-[12%]" style={{ color: P.ink }}>
                {note.map((line, i) => (
                  <p key={i} className={i ? 'mt-3' : ''} style={{ fontFamily: hand, fontSize: 'clamp(22px, 7cqi, 27px)', lineHeight: 1.2, color: '#2C3C6B' }}>
                    {line}
                  </p>
                ))}
                <p className="mt-4" style={{ fontFamily: hand, fontSize: 28, color: '#2C3C6B' }}>— {signer} x</p>
              </div>
            </Napkin>
          </Reveal>
          {data.giftNote?.trim() && (
            <p className="mx-auto mt-10 w-[min(100%,24rem)] text-center" style={{ fontSize: 15.5, color: P.creamSoft }}>
              <span className="uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.28em', color: P.creamFaint }}>Gifts</span>
              <span className="mt-1.5 block">{data.giftNote.trim()}</span>
            </p>
          )}
        </section>
      )}

      {/* ── Photos ───────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="px-5 pb-12 pt-8">
          <div className="mx-auto grid w-[min(100%,28rem)] grid-cols-2 gap-4">
            {photos.map((src, i) => (
              <Reveal key={i} disabled={isPreview} delay={(i % 2) * 90}>
                <figure className="m-0 bg-[#FBF7EE] p-2 pb-6" style={{ transform: `rotate(${[-2.4, 1.8, 1.2, -1.6, -1, 2.2][i % 6]}deg)`, boxShadow: '0 16px 30px rgba(8,10,2,0.45)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-square w-full object-cover" style={{ filter: 'saturate(0.88) contrast(1.04)' }} />
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
          title={`A toast to ${name}`}
          intro={`Raise a glass from wherever you are — leave ${name} a birthday message. Everyone who opens this page can read them.`}
          noun="toast"
          previewWishes={SAMPLE_WISHES}
          namePlaceholder="e.g. Rosa & Kit"
        />
      )}

      {/* ── Foot ───────────────────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: P.velvetDeep }}>
        <p style={{ fontFamily: script, fontSize: 56, lineHeight: 1, color: '#E9A79B' }}>Cheers to {name}</p>
        <p className="mt-3 uppercase" style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', color: P.creamFaint }}>
          {[date ? `${date.day} ${date.month} ${date.year}` : '', venue].filter(Boolean).join(' · ')}
        </p>
        <div className="mt-9">
          <Credit isPreview={isPreview} color={P.creamFaint} linkColor={P.cream} />
        </div>
      </footer>
    </div>
  )
}
