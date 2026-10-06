'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { playfair } from './kit/fonts/playfair'
import { pinyon } from './kit/fonts/pinyon'
import { baloo } from './kit/fonts/baloo'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, grain, mapsHref, pad2, parseLines, parseRows, telHref, timeLabel, useCountdown, whatsappHref, type DateParts, type InviteProps, fitCqi } from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import { numberWords, ordinalWords } from './kit/words'
import { ChannelIcon, ageOf, canReply, partyName, rsvpChannels } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Gala — a birthday weekend, for the big ones.
 * Emerald velvet, champagne gold, ivory card and a blush liner. The invitation
 * arrives as an envelope addressed to the guest (a link ending ?to=Sarah+Tom
 * writes "For Sarah & Tom" on it), sealed in burgundy wax with the celebrant's
 * initial. A tap breaks the seal, the flap lifts on its liner, the card slides
 * out in a burst of gold, and foil balloons of the age float up behind it —
 * real-looking, lit like Mylar. Inside: every part of the weekend on its own
 * card, the dress-code colours, their life in years, where to stay, answers,
 * people to call, a gift link, a birthday book, and an RSVP that collects who
 * is coming, to which parts, how many, what they can't eat and the song they
 * want — then sends it all to the host in one message.
 */

const P = {
  velvet: '#0B2A23',
  velvetDeep: '#061C17',
  ivory: '#FBF6EC',
  paper: '#F3E9D6',
  ink: '#1C2924',
  soft: 'rgba(28,41,36,0.72)',
  faint: 'rgba(28,41,36,0.5)',
  rule: 'rgba(28,41,36,0.13)',
  cream: '#F4ECD8',
  creamSoft: 'rgba(244,236,216,0.74)',
  creamFaint: 'rgba(244,236,216,0.5)',
  creamRule: 'rgba(244,236,216,0.14)',
  gold: '#C9A04E',
  goldDeep: '#9C7733',
  goldLight: '#F1DB9C',
  blush: '#E8B9AE',
  wax: '#7A1C2A',
}

const display = playfair.style.fontFamily
const script = pinyon.style.fontFamily
const round = baloo.style.fontFamily
const sans = jost.style.fontFamily

const FOIL = 'linear-gradient(110deg, #9C7733 0%, #D9B566 22%, #F6E3A8 40%, #B58A3A 58%, #E8CB82 78%, #A37C34 100%)'

const WISHES_THEME: InviteTheme = {
  bg: P.velvet,
  surface: P.ivory,
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.goldDeep,
  onAccent: P.ivory,
  heading: display,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, 10cqi, 46px)', color: P.cream },
}

const SAMPLE_WISHES = [
  { name: 'Hattie & Jo', message: 'Forty looks magnificent on you. We are bringing the dancing shoes and the embarrassing photos.' },
  { name: 'Uncle Rob', message: 'From the little girl who ran the school play to this. So proud. Happy birthday, Alex.' },
]

/* ── Helpers ───────────────────────────────────────────────────────── */

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

const foilText = (extra?: CSSProperties): CSSProperties => ({
  backgroundImage: FOIL,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

const shortDay = (d: DateParts) => `${d.weekday.slice(0, 3)} ${d.day} ${d.monthShort}`

/** "12 – 14 June 2026", "30 May – 1 June 2026", or one day in full. */
function rangeLabel(dates: string[]): string {
  const sorted = Array.from(new Set(dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))).sort()
  const a = dateParts(sorted[0])
  const b = dateParts(sorted[sorted.length - 1])
  if (!a || !b) return ''
  if (sorted.length === 1) return `${a.weekday} ${a.day} ${a.month} ${a.year}`
  if (a.month === b.month && a.year === b.year) return `${a.day} – ${b.day} ${a.month} ${a.year}`
  if (a.year === b.year) return `${a.day} ${a.month} – ${b.day} ${b.month} ${a.year}`
  return `${a.day} ${a.month} ${a.year} – ${b.day} ${b.month} ${b.year}`
}

const SWATCHES: Record<string, string> = {
  emerald: '#0E4D3C', green: '#2F6B3A', sage: '#9CAF88', olive: '#6B7A2E', mint: '#BFE3CF', teal: '#1F6F6B', turquoise: '#3FB3B0',
  gold: '#C9A04E', champagne: '#E9D7B0', ivory: '#F6F0E3', cream: '#F3E8D2', white: '#FFFFFF', black: '#141414',
  navy: '#1C2A4A', blue: '#2B5BA8', 'royal blue': '#2747A0', sky: '#9CC3E6', 'sky blue': '#9CC3E6', 'powder blue': '#B8D0E8',
  burgundy: '#6E1A26', wine: '#5A1A2B', claret: '#6B1A2C', red: '#B3261E', scarlet: '#C62A22', coral: '#F27A62', peach: '#F6B99A',
  blush: '#E8B9AE', pink: '#E9A3B8', 'hot pink': '#E0457B', fuchsia: '#C2306D', rose: '#D98A9A', 'rose gold': '#C9907A', dusty: '#C9A3A0',
  lilac: '#C4B0D9', lavender: '#B9A9D9', purple: '#6B3FA0', plum: '#5B2A4E', silver: '#C0C3C7', grey: '#8D8F93', gray: '#8D8F93',
  charcoal: '#3A3B3E', brown: '#6B4A35', chocolate: '#4A2E22', tan: '#C9A27E', beige: '#E2D3BC', camel: '#B98B5A',
  terracotta: '#C8643B', rust: '#B5532A', orange: '#E8702A', yellow: '#F2C230', mustard: '#D9A520', lemon: '#F5DC5B',
}

/** "Emerald, gold & champagne" → named swatches; hex codes are accepted too. */
function swatches(value?: string): { name: string; hex: string }[] {
  return (value || '')
    .split(/,|&|\band\b|\//i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => {
      const key = name.toLowerCase().replace(/\s+/g, ' ')
      const hex = /^#[0-9a-f]{3,8}$/i.test(key) ? key : SWATCHES[key] ?? SWATCHES[key.split(' ').pop() as string]
      return hex ? { name: name.replace(/^./, (c) => c.toUpperCase()), hex } : null
    })
    .filter((s): s is { name: string; hex: string } => Boolean(s))
    .slice(0, 6)
}

interface Part { name: string; date: string; time: string; venue: string; address: string; dress: string }

/* ── Gold dust ─────────────────────────────────────────────────────── */

function Dust({ count, seed }: { count: number; seed: number }) {
  const motes = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, () => ({
      x: r1(r() * 100),
      y: r1(r() * 100),
      s: r1(1.2 + r() * 2.6),
      dur: r1(7 + r() * 9),
      delay: r1(-r() * 14),
      tw: r1(1.8 + r() * 2.6),
    }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m, i) => (
        <span key={i} className="gl-mote absolute block" style={{ left: `${m.x}%`, top: `${m.y}%`, animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }}>
          <span className="gl-twinkle block rounded-full" style={{ width: m.s, height: m.s, background: P.goldLight, boxShadow: `0 0 ${r1(m.s * 3)}px ${P.gold}`, animationDuration: `${m.tw}s` }} />
        </span>
      ))}
    </div>
  )
}

/* ── Foil balloons ─────────────────────────────────────────────────── */

/**
 * One Mylar balloon in the shape of a digit. The glyph is fattened, blurred
 * into a height map and lit twice — a soft key light for the body, a hard
 * point light for the shine — so it reads as inflated foil, not flat type.
 */
function BalloonDigit({ ch, uid, i }: { ch: string; uid: string; i: number }) {
  const id = `${uid}-b${i}`
  return (
    <svg viewBox="0 0 200 300" className="block h-auto w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8893A" />
          <stop offset="0.35" stopColor="#F3D88E" />
          <stop offset="0.55" stopColor="#C99A45" />
          <stop offset="0.8" stopColor="#FBE7B0" />
          <stop offset="1" stopColor="#A97B33" />
        </linearGradient>
        <filter id={`${id}-f`} x="-20%" y="-15%" width="140%" height="130%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceGraphic" operator="dilate" radius="8" result="fatColour" />
          <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="fat" />
          <feGaussianBlur in="fat" stdDeviation="11" result="height" />
          <feDiffuseLighting in="height" surfaceScale="7" diffuseConstant="1.18" lightingColor="#FFFFFF" result="shade">
            <feDistantLight azimuth="235" elevation="52" />
          </feDiffuseLighting>
          <feComposite in="fatColour" in2="shade" operator="arithmetic" k1="1.12" k2="0" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="fat" operator="in" result="body" />
          <feSpecularLighting in="height" surfaceScale="8" specularConstant="1.3" specularExponent="26" lightingColor="#FFF4D6" result="spec">
            <fePointLight x="46" y="-40" z="230" />
          </feSpecularLighting>
          <feComposite in="spec" in2="fat" operator="in" result="shine" />
          <feComposite in="body" in2="shine" operator="arithmetic" k1="0" k2="1" k3="0.95" k4="0" />
        </filter>
      </defs>
      <text x={100} y={250} textAnchor="middle" fontFamily={round} fontWeight={800} fontSize={300} fill={`url(#${id}-g)`} filter={`url(#${id}-f)`}>
        {ch}
      </text>
    </svg>
  )
}

function Balloons({ digits, uid }: { digits: string; uid: string }) {
  const chars = digits.split('')
  const w = chars.length === 1 ? 42 : chars.length === 2 ? 36 : 24
  return (
    <div className="relative flex items-end justify-center" style={{ height: `${w * 1.5 + 22}cqi` }}>
      {chars.map((ch, i) => (
        <div key={i} className="gl-rise relative" style={{ width: `${w}cqi`, marginLeft: i ? `-${w * 0.14}cqi` : 0, animationDelay: `${0.15 + i * 0.18}s`, zIndex: chars.length - i }}>
          <div className="gl-bob" style={{ animationDuration: `${4.4 + i * 0.9}s`, animationDelay: `${-i * 1.7}s`, willChange: 'transform' }}>
            <BalloonDigit ch={ch} uid={uid} i={i} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── The envelope ──────────────────────────────────────────────────── */

type Phase = 'closed' | 'unseal' | 'flap' | 'rise' | 'leaving' | 'open'

/** Art-deco fans in blush and gold on emerald: the envelope's liner. */
function LinerPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={24} height={12} patternUnits="userSpaceOnUse">
      <rect width={24} height={12} fill="#0F3D31" />
      {[0, 12, 24].map((x) => (
        <g key={x} transform={`translate(${x - 12} 0)`}>
          <path d="M0 12A12 12 0 0 1 24 12" fill={P.blush} opacity={0.42} />
          <path d="M0 12A12 12 0 0 1 24 12M4 12A8 8 0 0 1 20 12M8 12A4 4 0 0 1 16 12" fill="none" stroke={P.gold} strokeWidth={0.7} />
        </g>
      ))}
      {[6, 18].map((x) => (
        <g key={x} transform={`translate(${x - 12} -6)`}>
          <path d="M0 12A12 12 0 0 1 24 12M4 12A8 8 0 0 1 20 12M8 12A4 4 0 0 1 16 12" fill="none" stroke={P.gold} strokeWidth={0.7} opacity={0.75} />
        </g>
      ))}
    </pattern>
  )
}

/** A disc of sealing wax, never quite round, pressed with the initial. */
function Seal({ initial, uid }: { initial: string; uid: string }) {
  const edge = useMemo(() => {
    const r = rng(23)
    const pts: string[] = []
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      const d = 46 + (r() - 0.5) * 6 + (i % 7 === 0 ? 3 : 0)
      pts.push(`${r1(50 + Math.cos(a) * d)},${r1(50 + Math.sin(a) * d)}`)
    }
    return `M${pts.join('L')}Z`
  }, [])
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <radialGradient id={`${uid}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#A8324A" />
          <stop offset="0.55" stopColor={P.wax} />
          <stop offset="1" stopColor="#4E0F19" />
        </radialGradient>
      </defs>
      <path d={edge} fill={`url(#${uid}-wax)`} strokeLinejoin="round" />
      <circle cx={50} cy={50} r={32} fill="none" stroke="rgba(30,4,8,0.45)" strokeWidth={2.2} />
      <circle cx={50} cy={50} r={30} fill="none" stroke="rgba(255,190,190,0.18)" strokeWidth={1} />
      <text x={50} y={62} textAnchor="middle" fontFamily={display} fontStyle="italic" fontSize={38} fill={P.goldLight} style={{ paintOrder: 'stroke' }} stroke="rgba(40,6,10,0.4)" strokeWidth={0.8}>
        {initial}
      </text>
    </svg>
  )
}

function Confetti({ seed }: { seed: number }) {
  const bits = useMemo(() => {
    const r = rng(seed)
    const colours = [P.goldLight, P.gold, '#F6E3A8', P.blush, P.ivory, '#D9B566']
    return Array.from({ length: 44 }, (_, i) => ({
      x: r1((r() - 0.5) * 340),
      y: r1(-120 - r() * 260),
      rot: r1((r() - 0.5) * 900),
      w: r1(4 + r() * 6),
      h: r1(6 + r() * 9),
      c: colours[i % colours.length],
      round: r() < 0.3,
      dur: r1(1.3 + r() * 1.1),
      delay: r1(r() * 0.15),
    }))
  }, [seed])
  return (
    <div className="pointer-events-none absolute left-1/2 top-[8%] z-[6] h-0 w-0" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="gl-confetti absolute block"
          style={{
            width: b.w,
            height: b.round ? b.w : b.h,
            borderRadius: b.round ? '50%' : 1.5,
            background: b.c,
            ['--x' as string]: `${b.x}px`,
            ['--y' as string]: `${b.y}px`,
            ['--r' as string]: `${b.rot}deg`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Envelope({ uid, phase, guest, initial, name, age, onOpen }: { uid: string; phase: Phase; guest: string; initial: string; name: string; age: number | null; onOpen: () => void }) {
  const liner = `${uid}-liner`
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={phase !== 'closed'}
      aria-label={`Open the invitation${guest ? ` for ${guest}` : ''}`}
      className="gl-env relative block w-[min(84cqi,380px)] cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
      style={{ aspectRatio: '1.4 / 1' }}
    >
      {/* the inside back wall, lined */}
      <span className="absolute inset-0 overflow-hidden rounded-[4px]" style={{ background: '#E6D9C1' }}>
        <svg className="absolute inset-x-[3%] top-0 h-[62%] w-[94%]" preserveAspectRatio="none" viewBox="0 0 100 60" aria-hidden>
          <defs><LinerPattern id={`${liner}-in`} /></defs>
          <rect width={100} height={60} fill={`url(#${liner}-in)`} />
        </svg>
      </span>

      {/* the card, waiting inside */}
      <span className="gl-card-in absolute left-[6%] right-[6%] top-[7%] z-[2] block h-[84%]" style={{ background: P.ivory, boxShadow: '0 2px 10px rgba(20,30,25,0.18)', outline: `1px solid ${P.gold}`, outlineOffset: -6 }}>
        <span className="flex h-full flex-col items-center justify-center text-center">
          <span className="block uppercase" style={{ fontFamily: sans, fontSize: 'clamp(8px, 2.2cqi, 10px)', letterSpacing: '0.3em', color: P.goldDeep }}>You’re invited</span>
          <span className="mt-[1.4cqi] block" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(22px, 7.4cqi, 34px)', lineHeight: 1, color: P.ink }}>{name}</span>
          {age && <span className="mt-[0.8cqi] block" style={foilText({ fontFamily: display, fontSize: 'clamp(24px, 8cqi, 36px)', lineHeight: 1 })}>{age}</span>}
        </span>
      </span>

      {/* the pocket: side and bottom flaps, with the guest's name on it */}
      <span className="absolute inset-0 z-[3] block" style={{ clipPath: 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)', filter: 'drop-shadow(0 -1px 0 rgba(0,0,0,0.04))' }}>
        <span className="absolute inset-0 block rounded-[4px]" style={{ background: `linear-gradient(180deg, #F6EEDD, ${P.paper})`, boxShadow: 'inset 0 -14px 24px rgba(120,90,40,0.08)' }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 140 100" preserveAspectRatio="none" aria-hidden>
          <path d="M0 100 L60 50 M140 100 L80 50" stroke="rgba(110,80,40,0.14)" strokeWidth={0.6} fill="none" />
          <path d="M0 0 L70 54 L140 0" stroke="rgba(110,80,40,0.22)" strokeWidth={0.8} fill="none" />
        </svg>
        <span className="absolute inset-x-0 bottom-[7%] block text-center">
          <span className="block uppercase" style={{ fontFamily: sans, fontSize: 'clamp(8px, 2.3cqi, 10.5px)', letterSpacing: '0.34em', color: P.goldDeep }}>For</span>
          <span className="mt-[0.5cqi] block px-[8%]" style={foilText({ fontFamily: script, fontSize: guest.length > 18 ? 'clamp(20px, 6cqi, 28px)' : 'clamp(24px, 8cqi, 38px)', lineHeight: 1.15, backgroundImage: 'linear-gradient(110deg, #8A6A2C, #C9A04E 40%, #8A6A2C 75%, #B58A3A)' })}>
            {guest}
          </span>
        </span>
      </span>

      {/* the top flap: paper outside, liner inside */}
      <span className="gl-flap absolute inset-x-0 top-0 z-[4] block h-[58%]" style={{ transformOrigin: '50% 0', transformStyle: 'preserve-3d' }}>
        <span className="absolute inset-0 block" style={{ backfaceVisibility: 'hidden', filter: 'drop-shadow(0 3px 3px rgba(80,55,20,0.18))' }}>
          <svg className="block h-full w-full" viewBox="0 0 140 58" preserveAspectRatio="none" aria-hidden>
            <path d="M0 0H140L76 54Q70 59 64 54Z" fill="#F1E6D1" />
            <path d="M0 0L64 54Q70 59 76 54L140 0" fill="none" stroke="rgba(110,80,40,0.18)" strokeWidth={0.6} />
          </svg>
        </span>
        <span className="absolute inset-0 block" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
          <svg className="block h-full w-full" viewBox="0 0 140 58" preserveAspectRatio="none" aria-hidden>
            <defs><LinerPattern id={`${liner}-flap`} /></defs>
            <path d="M0 0H140L76 54Q70 59 64 54Z" fill="#E6D9C1" />
            <path d="M5 0H135L75 50Q70 54 65 50Z" fill={`url(#${liner}-flap)`} />
          </svg>
        </span>
      </span>

      {/* the seal, in two halves that part when it breaks */}
      <span className="absolute left-1/2 top-[58%] z-[5] block h-[24%] w-[17%] -translate-x-1/2 -translate-y-[62%]" style={{ filter: 'drop-shadow(0 4px 5px rgba(30,4,8,0.45))' }}>
        {phase === 'closed' ? (
          <Seal initial={initial} uid={`${uid}s`} />
        ) : (
          <>
            <span className="gl-seal-l absolute inset-0 block" style={{ clipPath: 'polygon(0 0, 52% 0, 46% 40%, 54% 62%, 48% 100%, 0 100%)' }}>
              <Seal initial={initial} uid={`${uid}l`} />
            </span>
            <span className="gl-seal-r absolute inset-0 block" style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 48% 100%, 54% 62%, 46% 40%)' }}>
              <Seal initial={initial} uid={`${uid}r`} />
            </span>
          </>
        )}
      </span>

      {phase === 'rise' && <Confetti seed={5} />}
    </button>
  )
}

/* ── Small parts ───────────────────────────────────────────────────── */

function Caps({ children, color = P.goldDeep, size = 11.5, className = '' }: { children: ReactNode; color?: string; size?: number; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: size, fontWeight: 500, letterSpacing: '0.32em', color }}>
      {children}
    </p>
  )
}

function Ornament({ className = '', color = P.gold }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 160 14" className={`mx-auto block h-[14px] w-[160px] ${className}`} aria-hidden>
      <path d="M4 7H62M98 7H156" stroke={color} strokeWidth={0.8} />
      <path d="M80 1 86 7 80 13 74 7Z" fill={color} />
      <circle cx={68} cy={7} r={1.6} fill={color} />
      <circle cx={92} cy={7} r={1.6} fill={color} />
    </svg>
  )
}

/** The gilded edge every ivory card carries. */
const gilded = (extra?: CSSProperties): CSSProperties => ({
  background: P.ivory,
  color: P.ink,
  boxShadow: `0 0 0 1px ${P.goldDeep}, 0 0 0 3px ${P.ivory}, 0 0 0 4px ${P.gold}, 0 28px 50px rgba(2,14,10,0.45)`,
  ...extra,
})

function Btn({ href, isPreview, solid, children, onDark }: { href: string | null; isPreview: boolean; solid?: boolean; children: ReactNode; onDark?: boolean }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="gl-btn inline-flex min-h-[46px] items-center justify-center gap-2 px-4 text-center uppercase"
      style={{
        fontFamily: sans,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.2em',
        ...(solid
          ? { backgroundImage: FOIL, color: P.velvetDeep }
          : { border: `1px solid ${onDark ? P.creamRule : 'rgba(28,41,36,0.28)'}`, color: onDark ? P.cream : P.ink }),
      }}
    >
      {children}
    </DirectionsLink>
  )
}

function Countdown({ date, time, enabled }: { date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  const cells: [number, string][] = [[c.days, c.days === 1 ? 'Day' : 'Days'], [c.hours, 'Hours'], [c.minutes, 'Mins'], [c.seconds, 'Secs']]
  return (
    <Reveal disabled={!enabled} className="mx-auto w-[min(100%,26rem)] px-5 pb-6 pt-14 text-center">
      <Caps color={P.gold}>The countdown</Caps>
      <div className="mt-5 grid grid-cols-4 gap-2.5">
        {cells.map(([n, l]) => (
          <div key={l} className="relative overflow-hidden py-3.5" style={{ background: 'linear-gradient(180deg, rgba(244,236,216,0.08), rgba(244,236,216,0.02))', border: `1px solid rgba(201,160,78,0.4)` }}>
            <span aria-hidden className="absolute inset-x-0 top-1/2 block h-px" style={{ background: 'rgba(6,28,23,0.6)' }} />
            <p className="tabular-nums leading-none" style={foilText({ fontFamily: display, fontSize: 'clamp(30px, 10cqi, 42px)' })}>{l.startsWith('Day') ? n : pad2(n)}</p>
            <p className="mt-2 uppercase" style={{ fontFamily: sans, fontSize: 9.5, letterSpacing: '0.24em', color: P.creamFaint }}>{l}</p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

/* ── RSVP ──────────────────────────────────────────────────────────── */

function GalaRsvp({ anchor, parts, phone, email, what, rsvpBy, guest, isPreview }: { anchor: string; parts: Part[]; phone?: string; email?: string; what: string; rsvpBy?: string; guest: string; isPreview: boolean }) {
  const [who, setWho] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [going, setGoing] = useState<Record<number, boolean>>({})
  const [count, setCount] = useState(1)
  const [diet, setDiet] = useState('')
  const [song, setSong] = useState('')
  useEffect(() => {
    if (guest) setWho((w) => w || guest)
  }, [guest])
  if (!canReply(phone, email)) return null

  const by = dateParts(rsvpBy)
  const isGoing = (i: number) => going[i] !== false
  const label = (p: Part) => {
    const d = dateParts(p.date)
    return d ? `${p.name} (${shortDay(d)})` : p.name
  }
  const chosen = parts.filter((_, i) => isGoing(i))

  const lines = [`RSVP — ${what}`, who.trim() ? `From: ${who.trim()}` : '']
  if (answer === 'yes') {
    lines.push(`Joyfully coming${count > 1 ? ` — ${count} of us` : ''}`)
    if (parts.length > 1) lines.push(chosen.length === parts.length ? 'For all of it' : `For: ${chosen.map(label).join(', ')}`)
    if (diet.trim()) lines.push(`Dietary needs: ${diet.trim()}`)
    if (song.trim()) lines.push(`Song request: ${song.trim()}`)
  } else if (answer === 'no') {
    lines.push('Sadly can’t make it — wishing you the most wonderful celebration.')
  }
  const text = lines.filter(Boolean).join('\n')
  const ready = answer === 'no' || (answer === 'yes' && (parts.length < 2 || chosen.length > 0))
  const channels = rsvpChannels({ phone, email, text, subject: `RSVP — ${what}${who.trim() ? ` — ${who.trim()}` : ''}` })

  const field: CSSProperties = { fontFamily: sans, fontSize: 16, color: P.ink, background: 'transparent', borderBottom: `1px solid rgba(28,41,36,0.3)` }

  return (
    <section id={anchor} className="scroll-mt-6 px-5 pb-20 pt-10">
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] px-6 pb-9 pt-10" style={gilded()}>
        <div className="text-center">
          <Caps>RSVP</Caps>
          <h2 className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, 10cqi, 44px)', lineHeight: 1 }}>Will you join us?</h2>
          {by && <p className="mt-3" style={{ fontSize: 15, color: P.soft }}>Kindly reply by {by.weekday}, the {ordinalWords(by.day)} of {by.month}</p>}
        </div>

        <label className="mt-7 block">
          <span className="block uppercase" style={{ fontFamily: sans, fontSize: 10.5, letterSpacing: '0.26em', color: P.faint }}>Your name(s)</span>
          <input value={who} onChange={(e) => setWho(e.target.value.slice(0, 80))} placeholder="e.g. Sarah & Tom" className="mt-1.5 w-full py-2 outline-none" style={field} />
        </label>

        <div className="mt-6 grid grid-cols-2 gap-2.5" role="group" aria-label="Your answer">
          {(['yes', 'no'] as const).map((a) => {
            const on = answer === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAnswer(a)}
                aria-pressed={on}
                className="gl-btn min-h-[52px] px-3"
                style={{ fontFamily: display, fontStyle: 'italic', fontSize: 19, ...(on ? (a === 'yes' ? { backgroundImage: FOIL, color: P.velvetDeep } : { background: P.ink, color: P.ivory }) : { border: '1px solid rgba(28,41,36,0.28)', color: P.ink }) }}
              >
                {a === 'yes' ? 'Joyfully, yes' : 'Sadly, no'}
              </button>
            )
          })}
        </div>

        {answer === 'yes' && (
          <div className="gl-pop mt-7 space-y-6">
            {parts.length > 1 && (
              <fieldset>
                <legend className="uppercase" style={{ fontFamily: sans, fontSize: 10.5, letterSpacing: '0.26em', color: P.faint }}>I’ll be there for</legend>
                <div className="mt-2.5 space-y-2">
                  {parts.map((p, i) => (
                    <label key={i} className="flex cursor-pointer items-center gap-3 py-1.5" style={{ fontSize: 16 }}>
                      <input type="checkbox" checked={isGoing(i)} onChange={(e) => setGoing((g) => ({ ...g, [i]: e.target.checked }))} className="h-[18px] w-[18px]" style={{ accentColor: P.goldDeep }} />
                      <span>{label(p)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="uppercase" style={{ fontFamily: sans, fontSize: 10.5, letterSpacing: '0.26em', color: P.faint }}>How many of you?</span>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="One fewer" onClick={() => setCount((c) => Math.max(1, c - 1))} className="gl-btn h-10 w-10 rounded-full" style={{ border: '1px solid rgba(28,41,36,0.28)', fontSize: 20 }}>−</button>
                <span className="w-6 text-center tabular-nums" style={{ fontFamily: display, fontSize: 24 }} aria-live="polite">{count}</span>
                <button type="button" aria-label="One more" onClick={() => setCount((c) => Math.min(12, c + 1))} className="gl-btn h-10 w-10 rounded-full" style={{ border: '1px solid rgba(28,41,36,0.28)', fontSize: 20 }}>+</button>
              </div>
            </div>
            <label className="block">
              <span className="block uppercase" style={{ fontFamily: sans, fontSize: 10.5, letterSpacing: '0.26em', color: P.faint }}>Anything you can’t eat?</span>
              <input value={diet} onChange={(e) => setDiet(e.target.value.slice(0, 120))} placeholder="e.g. one vegetarian, no nuts" className="mt-1.5 w-full py-2 outline-none" style={field} />
            </label>
            <label className="block">
              <span className="block uppercase" style={{ fontFamily: sans, fontSize: 10.5, letterSpacing: '0.26em', color: P.faint }}>A song for the dance floor</span>
              <input value={song} onChange={(e) => setSong(e.target.value.slice(0, 120))} placeholder="e.g. September — Earth, Wind & Fire" className="mt-1.5 w-full py-2 outline-none" style={field} />
            </label>
          </div>
        )}

        {answer && (
          <div className="gl-pop mt-8">
            {ready ? (
              <>
                <p className="text-center" style={{ fontFamily: script, fontSize: 30, lineHeight: 1.1, color: P.goldDeep }}>{answer === 'yes' ? 'Wonderful — send it on' : 'We’ll miss you — send it on'}</p>
                <div className="mt-3 grid gap-2">
                  {channels.map((c) => (
                    <a
                      key={c.kind}
                      href={isPreview ? undefined : c.href}
                      target={c.kind === 'whatsapp' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      aria-disabled={isPreview || undefined}
                      className="gl-btn flex min-h-[48px] items-center justify-center gap-2.5"
                      style={{ fontFamily: sans, fontSize: 15, color: P.ink, background: P.paper, border: `1px solid ${P.rule}` }}
                    >
                      <ChannelIcon kind={c.kind} />
                      {c.label}
                    </a>
                  ))}
                </div>
                <p className="mt-3 text-center" style={{ fontSize: 12.5, color: P.faint }}>Your reply opens ready to send — nothing is sent until you press send.</p>
              </>
            ) : (
              <p className="text-center" style={{ fontSize: 14.5, color: P.soft }}>Tick at least one part of the celebration.</p>
            )}
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ── The invitation ────────────────────────────────────────────────── */

export default function BirthdayGala({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const name = data.celebrantName?.trim() || 'Alexandra'
  const age = ageOf(data.age)
  const what = partyName(name, age)
  const hosts = data.invitedBy?.trim() || ''
  const place = data.city?.trim() || ''
  const theme = data.theme?.trim() || 'A weekend of celebration'
  const initial = name.charAt(0).toUpperCase()

  const parts: Part[] = useMemo(() => {
    const rows = parseRows(data.events, ['name', 'date', 'time', 'venue', 'address', 'dress'] as const).map((r) => ({
      ...r,
      date: /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? r.date : '',
      time: /^\d{1,2}:\d{2}/.test(r.time) ? r.time : '',
    }))
    if (rows.length > 1 && rows.every((r) => r.date)) rows.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    if (rows.length) return rows
    return [{ name: 'The celebration', date: data.date || '', time: data.time || '', venue: data.venue || '', address: data.venueAddress || '', dress: data.dressCode || '' }]
  }, [data.events, data.date, data.time, data.venue, data.venueAddress, data.dressCode])

  const range = rangeLabel([data.date || '', ...parts.map((p) => p.date)])
  const first = parts.find((p) => p.date) ?? { date: data.date, time: data.time }
  const story = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const palette = useMemo(() => swatches(data.palette), [data.palette])
  const photos = useMemo(() => {
    const own = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? [data.celebrantPhoto] : []
    return [...own, ...galleryImages(data.galleryImages, 8)].slice(0, 9)
  }, [data.celebrantPhoto, data.galleryImages])
  const registry = /^https?:\/\//i.test(data.registryUrl || '') ? data.registryUrl : ''
  const music = /^https?:\/\//i.test(data.musicUrl || '') ? data.musicUrl : ''

  // The guest a personal link was made for: ?to=Sarah+Tom
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])
  const envelopeName = guest || data.envelopeLine?.trim() || 'Our favourite people'

  /* closed → seal breaks → flap lifts → card rises → the stage fades → open */
  const [phase, setPhase] = useState<Phase>('closed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const toggleMusic = useCallback(async () => {
    const a = audio.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
      return
    }
    try {
      await a.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [playing])
  const openEnvelope = useCallback(() => {
    if (phase !== 'closed') return
    // The tap is the gesture browsers ask for before sound: the song starts with the envelope.
    if (music && !isPreview && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), ms))
    setPhase('unseal')
    at(420, 'flap')
    at(1050, 'rise')
    at(2500, 'leaving')
    at(2950, 'open')
  }, [phase, music, isPreview])

  const ids = { weekend: `${uid}-weekend`, rsvp: `${uid}-rsvp` }
  const nameCqi = Math.min(19, 80 / (Math.max(4, ...name.split(/\s+|(?<=-)/).map((w) => w.length + 1)) * 0.58))
  const open = phase === 'open'

  const velvet: CSSProperties = {
    backgroundColor: P.velvet,
    backgroundImage: [
      'radial-gradient(80% 50% at 50% 20%, rgba(80,160,130,0.18), rgba(80,160,130,0) 70%)',
      'radial-gradient(120% 60% at 50% 110%, rgba(0,0,0,0.4), rgba(0,0,0,0) 60%)',
      grain(0.09, 160).backgroundImage as string,
    ].join(', '),
    backgroundSize: `auto, auto, ${grain(0.09, 160).backgroundSize}`,
  }

  return (
    <div className={`gl relative ph-${phase}`} style={{ ...velvet, color: P.cream, fontFamily: sans, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .gl .gl-mote { animation: gl-drift linear infinite; }
        @keyframes gl-drift { from { transform: translateY(30px); } to { transform: translateY(-60px); } }
        .gl .gl-twinkle { animation: gl-twinkle ease-in-out infinite; }
        @keyframes gl-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
        .gl .gl-env { animation: gl-env-in 1.1s cubic-bezier(.2,.75,.25,1) both, gl-float 6s ease-in-out 1.1s infinite; }
        @keyframes gl-env-in { from { opacity: 0; transform: translateY(40px) rotate(-4deg) scale(.96); } }
        @keyframes gl-float { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-6px) rotate(-0.4deg); } }
        .gl:not(.ph-closed) .gl-env { animation: none; transform: rotate(-1deg); }
        .gl .gl-hint { animation: gl-hint 2.4s ease-in-out infinite; }
        .gl .gl-from { transition: opacity .4s ease; }
        .gl:not(.ph-closed) .gl-from, .gl:not(.ph-closed) .gl-hint { opacity: 0; animation: none; transition: opacity .4s ease; }
        @keyframes gl-hint { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
        .gl .gl-seal-l { animation: gl-seal-l .6s cubic-bezier(.5,0,.75,.4) both; }
        .gl .gl-seal-r { animation: gl-seal-r .6s cubic-bezier(.5,0,.75,.4) both; }
        @keyframes gl-seal-l { to { transform: translate(-46%, 70%) rotate(-32deg); opacity: 0; } }
        @keyframes gl-seal-r { to { transform: translate(46%, 76%) rotate(28deg); opacity: 0; } }
        .gl .gl-flap { transform: perspective(1100px) rotateX(0deg); transition: transform .75s cubic-bezier(.4,.1,.3,1), z-index 0s linear .36s; }
        .gl.ph-flap .gl-flap, .gl.ph-rise .gl-flap, .gl.ph-leaving .gl-flap { transform: perspective(1100px) rotateX(180deg); z-index: 1; }
        .gl .gl-card-in { transition: transform 1.25s cubic-bezier(.25,.7,.25,1); }
        .gl.ph-rise .gl-card-in, .gl.ph-leaving .gl-card-in { transform: translateY(-72%); }
        .gl .gl-confetti { animation: gl-confetti cubic-bezier(.15,.65,.35,1) both; }
        @keyframes gl-confetti { 0% { transform: translate(0, 0) rotate(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; } }
        .gl .gl-stage { transition: opacity .45s ease, transform .45s ease; }
        .gl.ph-leaving .gl-stage { opacity: 0; transform: scale(1.04); }
        .gl.ph-open .gl-rise { animation: gl-rise 1.9s cubic-bezier(.16,.7,.3,1) both; }
        @keyframes gl-rise { from { transform: translateY(75vh) scale(.9); } }
        .gl .gl-bob { animation: gl-bob ease-in-out infinite; }
        @keyframes gl-bob { 0%, 100% { transform: translateY(0) rotate(-2.5deg); } 50% { transform: translateY(-10px) rotate(2.5deg); } }
        .gl.ph-open .gl-card { animation: gl-card 1.1s cubic-bezier(.2,.75,.25,1) .1s both; }
        @keyframes gl-card { from { opacity: 0; transform: translateY(30px) scale(.94); } }
        .gl.ph-open .gl-fade { animation: gl-fade 1s ease .9s both; }
        @keyframes gl-fade { from { opacity: 0; } }
        .gl .gl-btn { transition: opacity .18s ease, transform .18s ease; }
        .gl .gl-btn:hover { opacity: .9; }
        .gl .gl-btn:active { transform: scale(.98); }
        .gl .gl-pop { animation: gl-pop .4s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes gl-pop { from { opacity: 0; transform: translateY(8px); } }
        .gl summary { list-style: none; cursor: pointer; }
        .gl summary::-webkit-details-marker { display: none; }
        .gl details[open] .gl-plus { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce) {
          .gl .gl-mote, .gl .gl-twinkle, .gl .gl-env, .gl .gl-hint, .gl.ph-open .gl-rise, .gl .gl-bob, .gl.ph-open .gl-card, .gl.ph-open .gl-fade, .gl .gl-confetti { animation: none; }
        }
      `}</style>

      {music && <audio ref={audio} src={music} loop preload="none" />}
      {music && open && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-3 z-40 flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] backdrop-blur`}
          style={{ color: P.cream, background: 'rgba(6,28,23,0.7)', border: `1px solid ${P.creamRule}` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            {playing ? <path strokeLinecap="round" d="M9 6v12M15 6v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
          </svg>
          {playing ? 'Pause' : 'Music'}
        </button>
      )}

      {!open ? (
        /* ── The envelope ──────────────────────────────────────────── */
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-4" style={{ height: isPreview ? 700 : '100svh' }}>
          <Dust count={34} seed={4} />
          <div className="gl-stage relative flex flex-col items-center" style={{ containerType: 'inline-size', width: 'min(100%, 30rem)' }}>
            <Caps color={P.gold} className="gl-from mb-[9cqi] text-center">{hosts ? `From ${hosts}` : 'You have an invitation'}</Caps>
            <Envelope uid={uid} phase={phase} guest={envelopeName} initial={initial} name={name} age={age} onOpen={openEnvelope} />
            <p className="gl-hint mt-[10cqi] text-center uppercase" style={{ fontFamily: sans, fontSize: 11.5, letterSpacing: '0.32em', color: P.creamSoft }}>
              Tap the seal to open
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* ── The card, and the balloons ─────────────────────────── */}
          <section className="relative overflow-hidden px-4 pb-14" style={{ minHeight: isPreview ? 700 : '100svh' }}>
            <Dust count={38} seed={11} />
            <div className="relative mx-auto w-full max-w-[30rem]" style={{ containerType: 'inline-size' }}>
              <div className="relative z-[2] pt-[6cqi]">
                {age ? <Balloons digits={String(age)} uid={uid} /> : <div className="h-[30cqi]" />}
              </div>
              <div className={`gl-card relative z-[1] mx-auto -mt-[10cqi] w-[min(90cqi,430px)] px-[7cqi] pb-[10cqi] text-center ${age && String(age).length > 2 ? 'pt-[19cqi]' : 'pt-[15cqi]'}`} style={gilded()}>
                <Caps>{hosts ? `${hosts} invite you to celebrate` : 'You’re invited to celebrate'}</Caps>
                <h1 className="mt-[4cqi]" style={{ fontWeight: 400 }}>
                  <span className="block" style={{ fontFamily: display, fontStyle: 'italic', fontSize: `clamp(18px, ${nameCqi.toFixed(1)}cqi, 92px)`, lineHeight: 1, letterSpacing: '-0.01em', overflowWrap: 'break-word' }}>
                    {name.replace(/-/g, '-​')}
                  </span>
                  <span className="mt-[2.4cqi] block" style={{ fontFamily: script, fontSize: 'clamp(30px, 10.5cqi, 48px)', lineHeight: 1.1, color: P.goldDeep }}>
                    {age ? `turning ${numberWords(age)}` : 'on their birthday'}
                  </span>
                </h1>
                <Ornament className="my-[6cqi]" />
                <Caps color={P.soft} size={11}>{theme}</Caps>
                {range && <p className="mt-[3cqi]" style={{ fontFamily: display, fontSize: 'clamp(24px, 7.6cqi, 34px)', lineHeight: 1.1, textWrap: 'balance' }}>{range}</p>}
                {place && <p className="mt-[1.6cqi]" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(18px, 5.6cqi, 24px)', color: P.soft }}>{place}</p>}
              </div>
              <div className="gl-fade mt-8 grid grid-cols-2 gap-2.5 px-[5cqi]">
                <a href={`#${ids.weekend}`} className="gl-btn inline-flex min-h-[46px] items-center justify-center uppercase" style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.2em', border: `1px solid ${P.creamRule}`, color: P.cream }}>
                  The details
                </a>
                <a href={`#${ids.rsvp}`} className="gl-btn inline-flex min-h-[46px] items-center justify-center uppercase" style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.2em', backgroundImage: FOIL, color: P.velvetDeep }}>
                  RSVP
                </a>
              </div>
            </div>
          </section>

          <Countdown date={first.date} time={first.time} enabled={!isPreview} />

          {/* ── The weekend ────────────────────────────────────────── */}
          <section id={ids.weekend} className="scroll-mt-6 px-5 pb-6 pt-14">
            <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] text-center">
              <Caps color={P.gold}>{parts.length > 1 ? 'The celebrations' : 'The celebration'}</Caps>
              <h2 className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(36px, 11cqi, 48px)', lineHeight: 1, color: P.cream }}>
                {parts.length > 2 ? 'The weekend' : parts.length === 2 ? 'Two celebrations' : 'The evening'}
              </h2>
            </Reveal>
            <ol className="relative mx-auto mt-10 w-[min(100%,27rem)]">
              <span aria-hidden className="absolute bottom-6 left-1/2 top-6 block w-px -translate-x-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(201,160,78,0.55) 12%, rgba(201,160,78,0.55) 88%, transparent)' }} />
              {parts.map((p, i) => {
                const d = dateParts(p.date)
                const t = timeLabel(p.time)
                const where = [p.venue, p.address].filter(Boolean).join(', ')
                return (
                  <li key={i} className="relative pb-8 last:pb-0">
                    <Reveal disabled={isPreview} delay={i * 60}>
                      <div className="px-6 pb-7 pt-8 text-center" style={gilded()}>
                        <Caps size={10.5}>{d ? `${d.weekday} · ${d.day} ${d.month}` : `Part ${i + 1}`}</Caps>
                        <p className="mt-2.5" style={{ fontFamily: display, fontSize: 'clamp(26px, 8cqi, 32px)', lineHeight: 1.1 }}>{p.name}</p>
                        {t && <p className="mt-1.5" style={foilText({ fontFamily: display, fontStyle: 'italic', fontSize: 22, display: 'inline-block' })}>{t}</p>}
                        {p.venue && <p className="mt-3" style={{ fontSize: 16.5, fontWeight: 500 }}>{p.venue}</p>}
                        {p.address && <p className="mt-0.5" style={{ fontSize: 15, lineHeight: 1.45, color: P.soft }}>{p.address}</p>}
                        {p.dress && <p className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 17, color: P.goldDeep }}>Dress: {p.dress}</p>}
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <Btn href={mapsHref(undefined, p.venue, p.address)} isPreview={isPreview}>Map</Btn>
                          <Btn href={calendarHref(`${p.name} — ${what}`, p.date, p.time, where || undefined, 4)} isPreview={isPreview}>Calendar</Btn>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                )
              })}
            </ol>
          </section>

          {/* ── What to wear ───────────────────────────────────────── */}
          {(data.dressCode?.trim() || palette.length > 0) && (
            <section className="px-5 pb-4 pt-14">
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)] text-center">
                <Caps color={P.gold}>What to wear</Caps>
                {data.dressCode?.trim() && <p className="mt-3" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(24px, 7.4cqi, 30px)', lineHeight: 1.2, color: P.cream, textWrap: 'balance' }}>{data.dressCode.trim()}</p>}
                {palette.length > 0 && (
                  <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-4">
                    {palette.map((s) => (
                      <li key={s.name} className="flex flex-col items-center gap-2">
                        <span className="block h-12 w-12 rounded-full" style={{ background: s.hex, boxShadow: `0 0 0 2px ${P.velvet}, 0 0 0 3px rgba(201,160,78,0.7), 0 8px 16px rgba(0,0,0,0.35)` }} />
                        <span className="uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: P.creamSoft }}>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </section>
          )}

          {/* ── A note from the hosts ──────────────────────────────── */}
          {note.length > 0 && (
            <section className="px-6 pb-6 pt-16">
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,26rem)] text-center">
                <Ornament className="mb-8" />
                {note.map((line, i) => (
                  <p key={i} className="mt-4" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(22px, 6.8cqi, 28px)', lineHeight: 1.38, color: P.cream, textWrap: 'pretty' }}>
                    {line}
                  </p>
                ))}
                <p className="mt-6" style={{ fontFamily: script, fontSize: 38, lineHeight: 1, color: P.goldLight }}>{hosts || name}</p>
              </Reveal>
            </section>
          )}

          {/* ── Their story ────────────────────────────────────────── */}
          {(story.length > 0 || photos.length > 0) && (
            <section className="px-5 pb-6 pt-16">
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] text-center">
                <Caps color={P.gold}>{age ? `${numberWords(age)} years of ${name}` : `The story of ${name}`}</Caps>
              </Reveal>
              {story.length > 0 && (
                <ol className="mx-auto mt-9 w-[min(100%,27rem)]">
                  {story.map((s, i) => (
                    <Reveal as="li" key={i} disabled={isPreview} delay={i * 50} className="grid grid-cols-[5.2rem_1fr] gap-4 pb-8 last:pb-0">
                      <p className="text-right" style={foilText({ fontFamily: display, fontSize: 30, lineHeight: 1 })}>{s.when}</p>
                      <div className="border-l pl-4" style={{ borderColor: 'rgba(201,160,78,0.4)' }}>
                        <p style={{ fontFamily: display, fontSize: 21, lineHeight: 1.2, color: P.cream }}>{s.title}</p>
                        {s.text && <p className="mt-1.5" style={{ fontSize: 15.5, lineHeight: 1.55, color: P.creamSoft }}>{s.text}</p>}
                      </div>
                    </Reveal>
                  ))}
                </ol>
              )}
              {photos.length > 0 && (
                <div className="mx-auto mt-12 grid w-[min(100%,28rem)] grid-cols-2 gap-4">
                  {photos.map((src, i) => (
                    <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={i === 0 && photos.length % 2 === 1 ? 'col-span-2' : ''}>
                      <figure className="m-0 p-[7px]" style={gilded({ boxShadow: `0 0 0 1px ${P.goldDeep}, 0 18px 34px rgba(2,14,10,0.45)` })}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className={`block w-full object-cover ${i === 0 && photos.length % 2 === 1 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`} />
                      </figure>
                    </Reveal>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── For our guests ─────────────────────────────────────── */}
          {(travel.length > 0 || faq.length > 0 || contacts.length > 0) && (
            <section className="px-5 pb-6 pt-16">
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)] px-6 pb-8 pt-9" style={gilded()}>
                {travel.length > 0 && (
                  <div>
                    <Caps>Getting there & staying</Caps>
                    <ul className="mt-4 space-y-3">
                      {travel.map((t, i) => (
                        <li key={i} className="flex gap-3" style={{ fontSize: 15.5, lineHeight: 1.55 }}>
                          <span aria-hidden className="mt-[9px] block h-[5px] w-[5px] shrink-0 rotate-45" style={{ background: P.gold }} />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {faq.length > 0 && (
                  <div className={travel.length ? 'mt-9' : ''}>
                    <Caps>Good to know</Caps>
                    <div className="mt-3">
                      {faq.map((f, i) => (
                        <details key={i} className="border-b py-3.5" style={{ borderColor: P.rule }}>
                          <summary className="flex items-center justify-between gap-4" style={{ fontFamily: display, fontSize: 18.5, lineHeight: 1.3 }}>
                            {f.q}
                            <span aria-hidden className="gl-plus shrink-0 transition-transform" style={{ color: P.goldDeep, fontSize: 22, lineHeight: 1 }}>+</span>
                          </summary>
                          {f.a && <p className="mt-2" style={{ fontSize: 15.5, lineHeight: 1.55, color: P.soft }}>{f.a}</p>}
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {contacts.length > 0 && (
                  <div className={travel.length || faq.length ? 'mt-9' : ''}>
                    <Caps>Who to call</Caps>
                    <ul className="mt-3 space-y-3">
                      {contacts.map((c, i) => {
                        const tel = telHref(c.phone)
                        const wa = whatsappHref(c.phone)
                        return (
                          <li key={i} className="flex items-center justify-between gap-3 border-b pb-3" style={{ borderColor: P.rule }}>
                            <div className="min-w-0">
                              <p style={{ fontSize: 16, fontWeight: 500 }}>{c.name}</p>
                              {c.phone && <p style={{ fontSize: 14, color: P.soft }}>{c.phone}</p>}
                            </div>
                            <div className="flex shrink-0 gap-2">
                              {tel && <Btn href={tel} isPreview={isPreview}>Call</Btn>}
                              {wa && <Btn href={wa} isPreview={isPreview}><ChannelIcon kind="whatsapp" /></Btn>}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </Reveal>
            </section>
          )}

          {/* ── Gifts ──────────────────────────────────────────────── */}
          {(data.giftNote?.trim() || registry) && (
            <section className="px-6 pb-4 pt-14">
              <Reveal disabled={isPreview} className="mx-auto w-[min(100%,25rem)] text-center">
                <Caps color={P.gold}>Gifts</Caps>
                {data.giftNote?.trim() && <p className="mt-3" style={{ fontSize: 16.5, lineHeight: 1.55, color: P.creamSoft }}>{data.giftNote.trim()}</p>}
                {registry && (
                  <div className="mt-5">
                    <Btn href={registry} isPreview={isPreview} solid>See the wish list</Btn>
                  </div>
                )}
              </Reveal>
            </section>
          )}

          <GalaRsvp anchor={ids.rsvp} parts={parts} phone={data.rsvpPhone} email={data.rsvpEmail} what={what} rsvpBy={data.rsvpBy} guest={guest} isPreview={isPreview} />

          {eventId && (
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="The birthday book"
              intro={`A memory, a toast, a wish for the next ${age ? numberWords(age) : 'many'} years — write a page in ${name}’s birthday book. Everyone who opens this invitation can read it.`}
              noun="page"
              previewWishes={SAMPLE_WISHES}
              namePlaceholder="e.g. Hattie & Jo"
            />
          )}

          {/* ── Foot ───────────────────────────────────────────────── */}
          <footer className="px-6 pb-10 pt-16 text-center" style={{ background: P.velvetDeep }}>
            <div className="mx-auto h-16 w-16"><Seal initial={initial} uid={`${uid}f`} /></div>
            {/* its own container, so a long name is sized to the footer instead of running off it */}
            <div style={{ containerType: 'inline-size', width: '100%' }}>
              <p className="mt-5" style={{ fontFamily: display, fontStyle: 'italic', fontSize: `clamp(20px, ${fitCqi(name, { em: 0.6, max: 34 })}cqi, 34px)`, lineHeight: 1.1, color: P.cream }}>{name}{age ? ` at ${age}` : ''}</p>
            </div>
            <p className="mt-3 uppercase" style={{ fontSize: 11, letterSpacing: '0.32em', color: P.creamFaint }}>{[range, place].filter(Boolean).join(' · ')}</p>
            <div className="mt-9">
              <Credit isPreview={isPreview} color={P.creamFaint} linkColor={P.cream} />
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
