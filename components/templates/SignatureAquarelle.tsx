'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { pinyon } from './kit/fonts/pinyon'
import { cinzel } from './kit/fonts/cinzel'
import { ebGaramond } from './kit/fonts/ebGaramond'
import { calendarHref, dateParts, fitCqi, galleryImages, mapsHref, parseLines, parseRows, telHref, timeLabel, useCountdown, whatsappHref, type InviteProps } from './kit/core'
import { Credit, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Aquarelle — Signature. A hand-painted wedding suite, laid out like real
 * stationery on midnight linen.
 *
 * It arrives as a folded card of deckle-edged cotton paper, tied with a blush
 * silk ribbon and closed with a wax seal pressed with the couple's initials;
 * the guest's name is written on the front (a link ending ?to=Shalini+and+family).
 * Breaking the seal slips the ribbon off and opens the card: the invitation
 * itself, worded and set the way an engraved card is, with the date hidden
 * under a panel of gold foil to scratch away. Then the rest of the suite, each
 * on its own card: a letter with a stamp and a postmark, both families, their
 * story in an album, the order of celebrations, a hand-drawn route, a swatch
 * card for what to wear, a details card, and a reply card.
 *
 * The flowers are Pierre-Joseph Redouté's — roses from Les Roses (1817–1824),
 * irises and an amaryllis from Les Liliacées (1802–1816) — in the public
 * domain, laid together into bouquets. Each card of the suite is its own tint
 * of cotton paper. The paper, linen and wax are drawn from code. Sources in
 * public/templates/aquarelle/CREDITS.md. Everything typed is the host's.
 */

const P = {
  table: '#1B2537',
  paper: '#FBF7EF',
  ink: '#1E2738',
  soft: 'rgba(30,39,56,0.78)',
  faint: 'rgba(30,39,56,0.56)',
  rule: 'rgba(30,39,56,0.16)',
  gold: '#A88647',
  goldText: '#8E6E30',
  goldLight: '#D8BF86',
  ivory: '#F6EEDD',
  ivorySoft: 'rgba(246,238,221,0.78)',
  ivoryFaint: 'rgba(246,238,221,0.52)',
  wax: '#86384C',
  waxDeep: '#5E2235',
}

const FOIL = 'linear-gradient(110deg, #8E6A2C 0%, #CFAF68 26%, #F3E2AE 44%, #B68C3E 60%, #E4C784 80%, #9A7533 100%)'
const ART = '/templates/aquarelle'
const script = pinyon.style.fontFamily
const caps = cinzel.style.fontFamily
const serif = ebGaramond.style.fontFamily
/** The opening fills a phone's screen in the builder's preview: about 19.5 : 9, whatever width the phone is drawn at. */
const PREVIEW_H = 'max(560px, 210cqi)'
const LINEN: CSSProperties = { backgroundColor: P.table, backgroundImage: `url(${ART}/linen.webp)`, backgroundSize: '320px 320px' }

const WISHES_THEME: InviteTheme = {
  bg: 'transparent',
  surface: 'rgba(246,238,221,0.07)',
  ink: P.ivory,
  muted: P.ivorySoft,
  line: 'rgba(216,191,134,0.32)',
  accent: P.goldLight,
  onAccent: P.table,
  heading: script,
  body: serif,
  headingStyle: { fontWeight: 400, fontSize: 'clamp(40px, 12cqi, 54px)', lineHeight: 1.1, color: P.ivory },
}

const SAMPLE_WISHES = [
  { name: 'Meera & Arjun', message: 'Two of our favourite people by a lake — we would not miss it for anything. Save us a seat near the dance floor!' },
  { name: 'Nani', message: 'May your home always be full of music and good food. All my blessings, my darlings.' },
]

/* ── Words, the way an engraved card sets them ─────────────────────── */

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const words = (n: number): string => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ''}`)

/** 2026 → "two thousand and twenty-six". */
function yearWords(y: number): string {
  if (y < 2000 || y > 2099) return String(y)
  return y === 2000 ? 'two thousand' : `two thousand and ${words(y - 2000)}`
}

/** "10:30" → "at half past ten in the morning"; "19:00" → "at seven o’clock in the evening". */
function timeWords(value?: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(value || '')
  if (!m) return ''
  const h = Number(m[1])
  const min = Number(m[2])
  if (h === 12 && min === 0) return 'at twelve noon'
  if (h === 0 && min === 0) return 'at midnight'
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening'
  const h12 = (x: number) => words(((x + 11) % 12) + 1)
  if (min === 0) return `at ${h12(h)} o’clock ${part}`
  if (min === 30) return `at half past ${h12(h)} ${part}`
  if (min === 15) return `at a quarter past ${h12(h)} ${part}`
  if (min === 45) return `at a quarter to ${h12(h + 1)} ${h + 1 < 12 ? 'in the morning' : h + 1 < 17 ? 'in the afternoon' : 'in the evening'}`
  return `at ${h12(h)} ${min < 10 ? `o’ ${words(min)}` : words(min)} ${part}`
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/* ── Helpers ───────────────────────────────────────────────────────── */

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

const foil = (extra?: CSSProperties): CSSProperties => ({
  backgroundImage: FOIL,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

const isImg = (u?: string) => Boolean(u && /^(https?:)?\//.test(u))

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
}

/** Colour names a dress code mentions, as fabric swatches ("pastels" is a palette of its own; "black tie" is not a colour). */
const SWATCH: [RegExp, string[]][] = [
  [/pastel(?!\s*blue)/i, ['#EBC2C0', '#C4D5EA', '#BFD0BE', '#C9BEDD']],
  [/ivory|cream|off.?white/i, ['#F4EEDF']], [/\bwhite\b/i, ['#FFFFFF']], [/champagne|beige|nude/i, ['#E8D8BC']], [/gold/i, ['#D3B26A']],
  [/silver|grey|gray/i, ['#C7CBD2']], [/blush|rose|pink/i, ['#EBC2C0']], [/peach|coral/i, ['#F2C6A8']], [/lavender|lilac|purple/i, ['#C9BEDD']],
  [/sky|powder|baby blue|pastel blue/i, ['#C4D5EA']], [/navy|midnight/i, ['#253456']], [/\bblues?\b/i, ['#8FA7C9']], [/sage|mint|pistachio/i, ['#BFD0BE']],
  [/emerald|bottle green|\bgreens?\b/i, ['#3F6E5A']], [/yellows?\b|mustard|haldi/i, ['#EDD07A']], [/\breds?\b|maroon|wine|burgundy/i, ['#8E2F3C']], [/black(?!\s*tie)/i, ['#1E1E22']],
]
function swatches(text: string): string[] {
  return SWATCH.filter(([re]) => re.test(text)).flatMap(([, c]) => c).filter((c, i, all) => all.indexOf(c) === i).slice(0, 6)
}

/* ── Materials ─────────────────────────────────────────────────────── */

/**
 * A card of deckle-edged cotton paper. The paper (a 9-slice border-image) and
 * its shadow sit on their own layer, so the shadow follows the torn edge and
 * never falls on the words.
 */
type Tint = 'ivory' | 'blush' | 'sage' | 'sky' | 'butter' | 'lilac'
/** The tint of each paper, for anything printed to match it. */
const TINT: Record<Tint, string> = { ivory: '#FBF7EF', blush: '#F3D8D3', sage: '#DBE6D3', sky: '#D6E2F0', butter: '#F6E8C1', lilac: '#E4DAF0' }

function Paper({ children, className = '', style, edge = 20, tilt = 0, shadow = 'lift', tint = 'ivory' }: { children: ReactNode; className?: string; style?: CSSProperties; edge?: number; tilt?: number; shadow?: 'lift' | 'flat'; tint?: Tint }) {
  return (
    <div className={`relative ${className}`} style={{ ...(tilt ? { transform: `rotate(${tilt}deg)` } : {}), ...style }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderStyle: 'solid',
          borderWidth: edge,
          borderImage: `url(${ART}/${tint === 'ivory' ? 'paper' : `paper-${tint}`}.webp) 70 fill / ${edge}px round`,
          filter: shadow === 'lift' ? 'drop-shadow(0 24px 22px rgba(4,8,18,0.42)) drop-shadow(0 2px 2px rgba(4,8,18,0.32))' : 'drop-shadow(0 3px 4px rgba(4,8,18,0.28))',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

type FlowerName = 'rose-centifolia' | 'rose-regalis' | 'rose-violacea' | 'rose-sulfurea' | 'iris-blue' | 'iris-yellow' | 'iris-violet' | 'amaryllis'

/** A Redouté painting, cut from its plate, lying on the table with its shadow (or printed flat on a card). */
function Flower({ name, className = '', style, eager, flat }: { name: FlowerName; className?: string; style?: CSSProperties; eager?: boolean; flat?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ART}/${name}.webp`}
      alt=""
      aria-hidden
      draggable={false}
      loading={eager ? undefined : 'lazy'}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ ...(flat ? {} : { filter: 'drop-shadow(0 14px 14px rgba(4,8,18,0.38)) drop-shadow(0 2px 2px rgba(4,8,18,0.3))' }), ...style }}
    />
  )
}

/**
 * Paintings laid together into a bouquet. Each stem is placed in percent of
 * the bouquet's box (left, top, width) with a turn, so a bouquet scales with
 * the card it lies on.
 */
type Stem = [FlowerName, number, number, number, number]
const BOUQUETS: Record<'crown' | 'corner' | 'spray' | 'foot', Stem[]> = {
  // peeking over the top of the invitation, from behind it
  crown: [
    ['iris-violet', 0, 6, 25, -16],
    ['rose-sulfurea', 13, 4, 32, -14],
    ['amaryllis', 35, 4, 34, 6],
    ['iris-blue', 66, -6, 28, 14],
    ['rose-centifolia', 64, 16, 44, 16],
  ],
  // laid across the invitation's lower corner
  corner: [
    ['rose-violacea', 30, 8, 52, -152],
    ['rose-regalis', 0, 0, 62, -128],
  ],
  // slipped under the ribbon on the folded card
  spray: [
    ['iris-blue', 2, 0, 42, -30],
    ['rose-sulfurea', 26, 52, 46, 16],
    ['rose-centifolia', 6, 22, 70, -40],
  ],
  // the foot of the page, round the seal
  foot: [
    ['iris-blue', 2, 0, 30, -24],
    ['iris-yellow', 76, -4, 20, 20],
    ['amaryllis', 30, -6, 42, 2],
    ['rose-centifolia', -4, 20, 48, -26],
    ['rose-regalis', 54, 16, 48, 28],
    ['rose-violacea', 26, 30, 44, 4],
    ['rose-sulfurea', 64, 46, 32, 34],
  ],
}

function Bouquet({ kind, className = '', style, eager }: { kind: keyof typeof BOUQUETS; className?: string; style?: CSSProperties; eager?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={style}>
      {BOUQUETS[kind].map(([name, left, top, width, turn], i) => (
        <Flower key={i} name={name} eager={eager} style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, rotate: `${turn}deg` }} />
      ))}
    </div>
  )
}

/** The bloom of a painting, cropped as a vignette and printed flat on a card. */
function Vignette({ name, className = '', height = '17cqi' }: { name: FlowerName; className?: string; height?: string }) {
  return (
    <div aria-hidden className={`relative mx-auto overflow-hidden ${className}`} style={{ width: `calc(${height} * 1.5)`, height, WebkitMaskImage: 'linear-gradient(180deg, #000 62%, transparent)', maskImage: 'linear-gradient(180deg, #000 62%, transparent)' }}>
      <Flower name={name} flat style={{ left: '50%', top: 0, width: '78%', transform: 'translateX(-50%)' }} />
    </div>
  )
}

/** The order the itinerary's vignettes come in, one per celebration. */
const SEQUENCE: FlowerName[] = ['rose-sulfurea', 'iris-blue', 'rose-centifolia', 'amaryllis', 'iris-violet', 'rose-violacea', 'rose-regalis', 'iris-yellow']

/** A pale rose printed into the paper itself (the plate's paper balanced to white, multiplied onto the card). */
function Printed({ name, className = '', style }: { name: 'alba' | 'fragrans'; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${ART}/rose-${name}.webp`} alt="" aria-hidden draggable={false} loading="lazy" className={`pointer-events-none absolute select-none ${className}`} style={{ mixBlendMode: 'multiply', ...style }} />
  )
}

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#9A7838" />
      <stop offset="0.5" stopColor="#D9BB76" />
      <stop offset="1" stopColor="#9A7838" />
    </linearGradient>
  )
}

/** A calligraphic flourish, drawn as a penman would: a loop either side of a small rosette. */
function Flourish({ uid, className = '', width = 'min(46cqi, 190px)' }: { uid: string; className?: string; width?: string }) {
  const g = `${uid}-fl`
  const half = 'M88 12C76 12 70 5.5 61 7.2C54 8.6 53.6 16.6 59.6 16.8C64.6 17 64.8 10.4 58.4 10.4C47 10.4 38 14.6 24 12.6C16 11.4 10 9.8 2 11.6'
  return (
    <svg viewBox="0 0 200 24" className={`block ${className}`} style={{ width, height: 'auto' }} aria-hidden>
      <defs><GoldGradient id={g} /></defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="0.9" strokeLinecap="round">
        <path d={half} transform="translate(0 0)" />
        <path d={half} transform="translate(200 0) scale(-1 1)" />
      </g>
      <g fill={`url(#${g})`}>
        <path d="M100 6.5C102.6 9.4 102.6 14.6 100 17.5C97.4 14.6 97.4 9.4 100 6.5Z" />
        <circle cx="92" cy="12" r="1.3" />
        <circle cx="108" cy="12" r="1.3" />
      </g>
    </svg>
  )
}

/** A small printer's ornament between the celebrations. */
function Fleuron({ uid }: { uid: string }) {
  const g = `${uid}-fr`
  return (
    <svg viewBox="0 0 60 16" className="mx-auto block h-4 w-[60px]" aria-hidden>
      <defs><GoldGradient id={g} /></defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="0.9" strokeLinecap="round">
        <path d="M2 8H22M38 8H58" />
        <path d="M30 2.5C33 5 33 11 30 13.5C27 11 27 5 30 2.5Z" fill={`url(#${g})`} />
        <path d="M24.5 8C26.5 6 27.5 5.5 28.5 6.2M35.5 8C33.5 6 32.5 5.5 31.5 6.2M24.5 8C26.5 10 27.5 10.5 28.5 9.8M35.5 8C33.5 10 32.5 10.5 31.5 9.8" />
      </g>
    </svg>
  )
}

/** The couple's initials in gold foil inside a double oval, as on a die-stamped card. */
function Monogram({ a, b, uid, size = 'clamp(70px, 22cqi, 96px)' }: { a: string; b: string; uid: string; size?: string }) {
  const g = `${uid}-mg`
  return (
    <span className="relative inline-block" style={{ width: size, height: `calc(${size} * 1.22)` }} aria-hidden>
      <svg viewBox="0 0 100 122" className="absolute inset-0 h-full w-full">
        <defs><GoldGradient id={g} /></defs>
        <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
          <ellipse cx="50" cy="61" rx="46" ry="57" strokeWidth="1.1" />
          <ellipse cx="50" cy="61" rx="41.5" ry="52.5" strokeWidth="0.6" />
        </g>
        <g fill={`url(#${g})`}>
          <path d="M50 1.5L52.4 4L50 6.5L47.6 4Z" />
          <path d="M50 115.5L52.4 118L50 120.5L47.6 118Z" />
        </g>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center" style={{ ...foil({ fontFamily: script, fontSize: `calc(${size} * 0.4)`, lineHeight: 1 }), paddingTop: `calc(${size} * 0.08)` }}>
        {a}
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: `calc(${size} * 0.2)`, margin: `0 calc(${size} * 0.02)` }}>&amp;</span>
        {b}
      </span>
    </span>
  )
}

/** A wax seal pressed with the initials. */
function Seal({ a, b, size }: { a: string; b?: string; size: string }) {
  return (
    <span className="relative block" style={{ width: size, height: size }} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ART}/seal.webp`} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 6px 7px rgba(4,8,18,0.45))' }} />
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontFamily: script, fontSize: `calc(${size} * 0.3)`, lineHeight: 1, color: '#6A2638', textShadow: '-1px -1px 0 rgba(255,214,224,0.35), 1px 1.5px 1px rgba(36,4,14,0.65)', paddingTop: `calc(${size} * 0.04)` }}
      >
        {a}
        {b && (
          <>
            <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: `calc(${size} * 0.13)`, margin: `0 calc(${size} * 0.02)` }}>&amp;</span>
            {b}
          </>
        )}
      </span>
    </span>
  )
}

/** Gold photo corners holding a print to the page. */
function Corners() {
  const c: CSSProperties = { position: 'absolute', width: 18, height: 18, backgroundImage: FOIL, boxShadow: '0 1px 1px rgba(4,8,18,0.3)' }
  return (
    <>
      <span aria-hidden style={{ ...c, left: -5, top: -5, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <span aria-hidden style={{ ...c, right: -5, top: -5, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
      <span aria-hidden style={{ ...c, left: -5, bottom: -5, clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
      <span aria-hidden style={{ ...c, right: -5, bottom: -5, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
    </>
  )
}

/* ── Type and links ────────────────────────────────────────────────── */

function Caps({ children, color = P.goldText, size = 11, className = '', track = '0.3em' }: { children: ReactNode; color?: string; size?: number | string; className?: string; track?: string }) {
  return (
    <p className={className} style={{ fontFamily: caps, fontWeight: 500, fontSize: size, letterSpacing: track, lineHeight: 1.7, color, textWrap: 'balance' }}>
      {children}
    </p>
  )
}

/** A quiet engraved link: small capitals over a hairline of gold. */
function TextLink({ href, isPreview, children, light }: { href: string | null; isPreview: boolean; children: ReactNode; light?: boolean }) {
  if (!href) return null
  return (
    <a
      href={isPreview ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={isPreview || undefined}
      className="aq-btn inline-flex min-h-[40px] items-center"
      style={{ fontFamily: caps, fontWeight: 500, fontSize: 11.5, letterSpacing: '0.22em', color: light ? P.ivory : P.ink, textDecoration: 'underline', textDecorationColor: P.gold, textDecorationThickness: 1, textUnderlineOffset: 6 }}
    >
      {children}
    </a>
  )
}

/** The one solid button style: midnight, with a gold rule inside, like a ribbon-bound box. */
function Solid({ href, isPreview, children, onClick, label }: { href?: string | null; isPreview?: boolean; children: ReactNode; onClick?: () => void; label?: string }) {
  const style: CSSProperties = { fontFamily: caps, fontWeight: 500, fontSize: 12, letterSpacing: '0.24em', background: P.table, color: P.ivory, outline: `1px solid ${P.goldLight}`, outlineOffset: -5, boxShadow: '0 12px 22px -14px rgba(4,8,18,0.8)' }
  const cls = 'aq-btn inline-flex min-h-[52px] w-full items-center justify-center gap-2 px-6'
  if (onClick) return <button type="button" onClick={onClick} aria-label={label} className={cls} style={style}>{children}</button>
  if (!href) return null
  return (
    <a href={isPreview ? undefined : href} target="_blank" rel="noopener noreferrer" aria-disabled={isPreview || undefined} className={cls} style={style}>
      {children}
    </a>
  )
}

/** A section title on the linen: a line of capitals and a word in gold script. */
function TableTitle({ kicker, children, uid }: { kicker: string; children: ReactNode; uid: string }) {
  return (
    <div className="text-center">
      <Caps color={P.ivorySoft} size={11}>{kicker}</Caps>
      <p className="mt-1" style={{ ...foil({ fontFamily: script, fontSize: 'clamp(42px, 13cqi, 58px)', lineHeight: 1.15 }), paddingBottom: 4 }}>{children}</p>
      <Flourish uid={uid} className="mx-auto mt-1" width="min(40cqi, 160px)" />
    </div>
  )
}

/* ── The date, under gold foil ─────────────────────────────────────── */

function ScratchDate({ date, onReveal, revealed }: { date: NonNullable<ReturnType<typeof dateParts>>; onReveal: () => void; revealed: boolean }) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const scratched = useRef(0)
  const last = useRef<[number, number] | null>(null)
  const [gone, setGone] = useState(revealed)

  // Paint the foil: a burnished gradient, a fine grain, an engraved line.
  useEffect(() => {
    if (gone) return
    const el = canvas.current
    if (!el) return
    let cancelled = false
    const paint = () => {
      if (cancelled) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      const ctx = el.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const bg = ctx.createLinearGradient(0, 0, w, h)
      ;[['#8E6A2C', 0], ['#C9A85F', 0.22], ['#F1DFA8', 0.42], ['#B88E40', 0.6], ['#E2C47F', 0.8], ['#9A7533', 1]].forEach(([c, o]) => bg.addColorStop(o as number, c as string))
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      // the grain of hot foil
      const rand = rng(17)
      for (let i = 0; i < w * h * 0.06; i++) {
        ctx.fillStyle = rand() < 0.5 ? `rgba(255,246,214,${(0.08 + rand() * 0.2).toFixed(2)})` : `rgba(90,62,18,${(0.06 + rand() * 0.14).toFixed(2)})`
        ctx.fillRect(rand() * w, rand() * h, 1, 1)
      }
      // an engraved oval border
      ctx.strokeStyle = 'rgba(110,80,28,0.55)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(w / 2, h / 2, w / 2 - 9, h / 2 - 9, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(255,240,200,0.5)'
      ctx.beginPath()
      ctx.ellipse(w / 2, h / 2 + 1, w / 2 - 9, h / 2 - 9, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const engrave = (text: string, font: string, y: number, spacing = 0) => {
        ctx.font = font
        const t = spacing ? text.split('').join(String.fromCharCode(8202).repeat(spacing)) : text
        ctx.fillStyle = 'rgba(255,240,200,0.55)'
        ctx.fillText(t, w / 2, y + 1)
        ctx.fillStyle = 'rgba(96,66,20,0.85)'
        ctx.fillText(t, w / 2, y)
      }
      engrave('SCRATCH TO REVEAL', `500 ${Math.round(Math.min(11.5, w * 0.036))}px ${caps}`, h * 0.4, 3)
      engrave('the date', `${Math.round(Math.min(34, w * 0.11))}px ${script}`, h * 0.62)
    }
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(paint)
    else paint()
    const ro = new ResizeObserver(() => {
      if (scratched.current === 0) paint()
    })
    ro.observe(el)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [gone])

  const finish = useCallback(() => {
    if (gone) return
    setGone(true)
    onReveal()
  }, [gone, onReveal])

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const el = canvas.current
    if (!el || gone) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const r = Math.max(15, rect.width * 0.06)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineWidth = r * 2
    ctx.beginPath()
    if (last.current) ctx.moveTo(last.current[0], last.current[1])
    else ctx.moveTo(x - 0.1, y)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
    last.current = [x, y]
    scratched.current++
    // Every few strokes, measure how much is clear.
    if (scratched.current % 6 === 0) {
      const { data } = ctx.getImageData(0, 0, el.width, el.height)
      let clear = 0
      let total = 0
      const step = Math.max(4, Math.round(8 * (el.width / rect.width))) * 4
      for (let i = 3; i < data.length; i += step) {
        total++
        if (data[i] < 40) clear++
      }
      if (clear / total > 0.45) finish()
    }
  }

  return (
    <div className="mx-auto" style={{ width: 'min(70cqi, 300px)' }}>
      <div className="relative">
      <div className="relative overflow-hidden" style={{ aspectRatio: '1.5 / 1', borderRadius: '50%' }}>
        {/* the date, set as an engraved card sets it */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Caps color={P.faint} size="clamp(9.5px, 2.9cqi, 11px)" track="0.34em">{date.weekday}</Caps>
          <p className="flex items-center gap-[3cqi]" style={{ color: P.ink }}>
            <span className="block h-px w-[7cqi]" style={{ background: P.gold }} aria-hidden />
            <span style={{ ...foil({ fontFamily: caps, fontWeight: 500, fontSize: 'clamp(40px, 13cqi, 56px)', lineHeight: 1.05 }) }}>{date.day}</span>
            <span className="block h-px w-[7cqi]" style={{ background: P.gold }} aria-hidden />
          </p>
          <Caps color={P.ink} size="clamp(11px, 3.4cqi, 13px)" track="0.32em">{date.month}</Caps>
          <p className="mt-0.5 italic" style={{ fontFamily: serif, fontSize: 'clamp(13px, 3.9cqi, 15.5px)', color: P.soft }}>{yearWords(date.year)}</p>
        </div>
        {!gone && (
          <canvas
            ref={canvas}
            className="absolute inset-0 h-full w-full cursor-pointer"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              last.current = null
              e.currentTarget.setPointerCapture(e.pointerId)
              scratch(e)
            }}
            onPointerMove={(e) => {
              if (e.buttons || e.pointerType === 'touch') scratch(e)
            }}
            onPointerUp={() => {
              last.current = null
            }}
            aria-hidden
          />
        )}
        {gone && <Petals />}
      </div>
      {/* the oval stays as a gilt frame once the foil is gone */}
      <svg viewBox="0 0 300 200" className="pointer-events-none absolute inset-[-3%] h-[106%] w-[106%]" aria-hidden preserveAspectRatio="none">
        <ellipse cx="150" cy="100" rx="148" ry="98" fill="none" stroke={P.gold} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      </div>
      {!gone && (
        <button type="button" onClick={finish} className="aq-btn mx-auto mt-3 block" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: P.faint, textDecoration: 'underline', textUnderlineOffset: 4, textDecorationColor: P.rule }}>
          or tap here to reveal it
        </button>
      )}
    </div>
  )
}

/** Rose petals and gold leaf thrown up when the date is revealed. */
function Petals() {
  const bits = useMemo(() => {
    const rand = rng(29)
    return Array.from({ length: 30 }, () => ({
      left: r1(10 + rand() * 80),
      top: r1(30 + rand() * 40),
      x: r1(-90 + rand() * 180),
      y: r1(-70 - rand() * 100),
      r: Math.round(rand() * 540 - 270),
      w: r1(6 + rand() * 8),
      c: ['#E9B9BE', '#F4D3D3', '#D98E99', '#F3E2AE', '#D9BB76'][Math.floor(rand() * 5)],
      d: Math.round(rand() * 250),
    }))
  }, [])
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="aq-petal absolute block"
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.w, height: r1(b.w * 0.7), borderRadius: '70% 30% 70% 30%', background: b.c, animationDelay: `${b.d}ms`, '--x': `${b.x}px`, '--y': `${b.y}px`, '--r': `${b.r}deg` } as CSSProperties}
        />
      ))}
    </span>
  )
}

/* ── A stamp and a postmark ────────────────────────────────────────── */

function Stamp({ place, year, uid }: { place: string; year?: number; uid: string }) {
  const arc = `${uid}-pm`
  return (
    <div className="pointer-events-none relative z-10" style={{ float: 'right', width: 'min(31cqi, 136px)', margin: '0 -1cqi 3cqi 3cqi', paddingBottom: '6cqi' }} aria-hidden>
      <div
        style={{
          width: '74%',
          marginLeft: 'auto',
          transform: 'rotate(5deg)',
          background: '#FFFDF8',
          padding: 5,
          WebkitMaskImage: 'linear-gradient(#000 0 0), radial-gradient(circle, transparent 2.3px, #000 2.6px)',
          maskImage: 'linear-gradient(#000 0 0), radial-gradient(circle, transparent 2.3px, #000 2.6px)',
          WebkitMaskClip: 'content-box, border-box',
          maskClip: 'content-box, border-box',
          WebkitMaskSize: '100% 100%, 7px 7px',
          maskSize: '100% 100%, 7px 7px',
          WebkitMaskPosition: '0 0, -3.5px -3.5px',
          maskPosition: '0 0, -3.5px -3.5px',
          filter: 'drop-shadow(0 2px 2px rgba(4,8,18,0.25))',
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', background: TINT.sky, outline: '1px solid rgba(134,56,76,0.45)', outlineOffset: -3 }}>
          <Flower name="amaryllis" flat style={{ left: '-14%', top: '6%', width: '128%' }} />
          <span className="absolute bottom-[5%] right-[7%]" style={{ fontFamily: caps, fontSize: 9, letterSpacing: '0.08em', color: P.wax }}>₹25</span>
          <span className="absolute left-[7%] top-[5%]" style={{ fontFamily: caps, fontSize: 6.5, letterSpacing: '0.18em', color: P.wax }}>INDIA</span>
        </div>
      </div>
      {/* the postmark, struck half over the stamp */}
      <svg viewBox="0 0 150 120" className="absolute bottom-0 left-0 w-[78%]" style={{ opacity: 0.6, transform: 'rotate(-12deg)' }}>
        <defs>
          <path id={arc} d="M20 60A40 40 0 0 1 100 60" />
        </defs>
        <g fill="none" stroke={P.ink} strokeWidth="1.3">
          <circle cx="60" cy="60" r="44" />
          <circle cx="60" cy="60" r="30" />
          <path d="M104 46q8-6 16 0t16 0M104 60q8-6 16 0t16 0M104 74q8-6 16 0t16 0" />
        </g>
        <text fill={P.ink} style={{ fontFamily: caps, fontSize: 9.5, letterSpacing: '0.16em' }}>
          <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">{place.toUpperCase().slice(0, 18)}</textPath>
        </text>
        {year && <text x="60" y="64" textAnchor="middle" fill={P.ink} style={{ fontFamily: caps, fontSize: 11, letterSpacing: '0.1em' }}>{year}</text>}
        <text x="60" y="86" textAnchor="middle" fill={P.ink} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 9 }}>with love</text>
      </svg>
    </div>
  )
}

/* ── Their story, in an album ──────────────────────────────────────── */

function Story({ photos, moments, isPreview, uid }: { photos: string[]; moments: { when: string; title: string; text: string }[]; isPreview: boolean; uid: string }) {
  const n = Math.min(8, Math.max(photos.length, moments.length))
  const track = useRef<HTMLDivElement | null>(null)
  const [at, setAt] = useState(0)
  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const next = Math.max(0, Math.min(n - 1, i))
    const child = el.children[next] as HTMLElement | undefined
    if (child) el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2, behavior: 'smooth' })
  }
  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let dist = Infinity
      Array.from(el.children).forEach((c, i) => {
        const h = c as HTMLElement
        const dd = Math.abs(h.offsetLeft + h.clientWidth / 2 - mid)
        if (dd < dist) {
          dist = dd
          best = i
        }
      })
      setAt(best)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
    // The track first exists once there is a moment to show.
  }, [n])
  if (!n) return null
  return (
    <section className="relative py-16" style={LINEN}>
      <Reveal disabled={isPreview} className="px-6">
        <TableTitle kicker="Our story" uid={`${uid}s`}>how it began</TableTitle>
      </Reveal>
      <div ref={track} className="aq-track mt-9 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[15cqi] pb-8 pt-4">
        {Array.from({ length: n }, (_, i) => {
          const photo = photos[i]
          const m = moments[i]
          return (
            <figure key={i} className="relative m-0 shrink-0 snap-center" style={{ width: 'min(70cqi, 300px)' }}>
              <Paper edge={14} tilt={i % 2 ? 1.6 : -1.4} className="px-4 pb-5 pt-4">
                <div className="relative">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={m?.title || ''} loading="lazy" className="block aspect-[4/5] w-full object-cover" draggable={false} />
                  ) : (
                    <div className="relative block aspect-[4/5] w-full overflow-hidden" style={{ background: '#F1E7E2' }}>
                      <Printed name={i % 2 ? 'alba' : 'fragrans'} className="left-[-10%] top-[-2%] w-[120%]" />
                    </div>
                  )}
                  <Corners />
                </div>
                {m && (
                  <figcaption className="mt-4 text-center">
                    {m.when && <Caps color={P.goldText} size={10.5}>{m.when}</Caps>}
                    <p style={{ fontFamily: script, fontSize: 'clamp(26px, 8cqi, 32px)', lineHeight: 1.15, color: P.ink }}>{m.title}</p>
                    {m.text && <p className="mt-1.5 leading-snug" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: P.soft }}>{m.text}</p>}
                  </figcaption>
                )}
              </Paper>
            </figure>
          )
        })}
      </div>
      {n > 1 && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(at - 1)} aria-label="Previous moment" className="aq-btn flex h-10 w-10 items-center justify-center rounded-full" style={{ border: `1px solid ${P.goldLight}`, color: P.ivory }} disabled={at === 0}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" /></svg>
          </button>
          <span className="flex gap-1.5" aria-hidden>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className="block h-1.5 w-1.5 rotate-45" style={{ background: i === at ? P.goldLight : 'rgba(246,238,221,0.25)' }} />
            ))}
          </span>
          <button type="button" onClick={() => go(at + 1)} aria-label="Next moment" className="aq-btn flex h-10 w-10 items-center justify-center rounded-full" style={{ border: `1px solid ${P.goldLight}`, color: P.ivory }} disabled={at === n - 1}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </section>
  )
}

/* ── The route between the venues, drawn in ink ────────────────────── */

function Route({ stops, isPreview, hrefFor }: { stops: { venue: string; names: string[] }[]; isPreview: boolean; hrefFor: (venue: string) => string | null }) {
  const n = stops.length
  // A winding line across the paper, low enough that every pin's head clears the top edge.
  const pts = stops.map((_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    return { x: 42 + t * 236, y: 96 + 22 * Math.sin(t * Math.PI * 1.7 + 0.4) }
  })
  let d = `M${r1(pts[0].x - 26)} ${r1(pts[0].y + 10)}`
  pts.forEach((p, i) => {
    if (i === 0) d += `Q${r1(pts[0].x - 10)} ${r1(pts[0].y + 2)} ${r1(p.x)} ${r1(p.y)}`
    else {
      const prev = pts[i - 1]
      d += `C${r1(prev.x + 40)} ${r1(prev.y)} ${r1(p.x - 40)} ${r1(p.y)} ${r1(p.x)} ${r1(p.y)}`
    }
  })
  const lastPt = pts[pts.length - 1]
  d += `Q${r1(lastPt.x + 12)} ${r1(lastPt.y - 6)} ${r1(lastPt.x + 26)} ${r1(lastPt.y - 12)}`
  return (
    <Paper tint="sage" className="mx-auto mt-8 w-[min(90cqi,440px)] px-4 pb-6 pt-6" tilt={-0.8}>
      <p className="text-center" style={{ fontFamily: script, fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.1, color: P.ink }}>from one to the next</p>
      <div className="relative" style={{ aspectRatio: '320 / 140' }}>
        <svg viewBox="0 0 320 140" className="absolute inset-0 h-full w-full" aria-hidden>
          {/* a hint of shoreline, pencilled */}
          <path d="M0 128C40 120 70 132 110 124S190 116 230 126S300 132 320 122" fill="none" stroke={P.rule} strokeWidth="1" />
          <path d="M0 136C46 130 76 138 120 132S196 126 240 134S300 138 320 132" fill="none" stroke={P.rule} strokeWidth="0.8" />
          <path d={d} fill="none" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.3" strokeDasharray="0.5 5" strokeLinecap="round" style={{ vectorEffect: 'non-scaling-stroke' } as CSSProperties} />
          {pts.map((p, i) => (
            <g key={i} transform={`translate(${r1(p.x)} ${r1(p.y)})`}>
              <ellipse cx="0" cy="1.5" rx="5" ry="1.6" fill="rgba(4,8,18,0.18)" />
              <path d="M0 0C-6.5 -8.5 -8.5 -12.5 -8.5 -16.5A8.5 8.5 0 0 1 8.5 -16.5C8.5 -12.5 6.5 -8.5 0 0Z" fill={P.wax} />
              <text x="0" y="-13" textAnchor="middle" fontSize="9" fill={P.ivory} style={{ fontFamily: caps }}>{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      {/* Four venues read as two pairs; otherwise up to three to a row. */}
      <ol className="relative grid gap-x-3 gap-y-4 px-1 pt-1" style={{ gridTemplateColumns: `repeat(${n === 4 ? 2 : Math.min(n, 3)}, minmax(0, 1fr))` }}>
        {stops.map((s, i) => (
          <li key={i} className="min-w-0 text-center">
            <a href={isPreview ? undefined : hrefFor(s.venue) ?? undefined} target="_blank" rel="noopener noreferrer" aria-disabled={isPreview || undefined} className="block">
              <span className="block" style={{ fontFamily: caps, fontSize: 10.5, letterSpacing: '0.2em', color: P.wax }}>{ROMAN[i] ?? i + 1}</span>
              <span className="mt-0.5 block leading-tight" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: P.ink, overflowWrap: 'anywhere' }}>{s.venue}</span>
              <span className="mt-0.5 block leading-tight" style={{ fontFamily: serif, fontSize: 13, color: P.faint }}>{s.names.join(', ')}</span>
            </a>
          </li>
        ))}
      </ol>
    </Paper>
  )
}

/* ── The reply card ────────────────────────────────────────────────── */

function Check({ on }: { on: boolean }) {
  return (
    <span aria-hidden className="relative inline-block h-[18px] w-[18px] shrink-0" style={{ border: `1px solid ${P.ink}`, background: on ? 'rgba(168,134,71,0.08)' : 'transparent' }}>
      {on && (
        <svg viewBox="0 0 20 20" className="absolute left-[-1px] top-[-5px] h-[22px] w-[22px]" fill="none" stroke={P.wax} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5C5 12 6.5 14 7.5 16C10 10 13.5 5.5 18 2" />
        </svg>
      )}
    </span>
  )
}

function Rsvp({ anchor, couple, fns, phone, rsvpBy, guest, isPreview, initials }: { anchor: string; couple: string; fns: Fn[]; phone?: string; rsvpBy?: string; guest: string; isPreview: boolean; initials: [string, string] }) {
  const [who, setWho] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [going, setGoing] = useState<Record<number, boolean>>({})
  const [count, setCount] = useState(2)
  const [note, setNote] = useState('')
  useEffect(() => {
    if (guest) setWho((w) => w || guest)
  }, [guest])
  if (!whatsappHref(phone)) return null

  const name = who.trim()
  const picked = fns.filter((_, i) => going[i]).map((f) => f.name)
  const list = picked.length <= 1 ? picked.join('') : `${picked.slice(0, -1).join(', ')} and ${picked[picked.length - 1]}`
  const text =
    answer === 'no'
      ? `Dear ${couple}, ${name ? `it’s ${name} — ` : ''}with love and regret, we won’t be able to join you. Wishing you both a beautiful wedding.${note.trim() ? ` ${note.trim()}` : ''}`
      : `Dear ${couple}, ${name ? `it’s ${name} — ` : ''}we joyfully accept!${list ? ` We’ll be there for ${list}.` : ''} ${count === 1 ? 'Just me.' : `${count} of us.`}${note.trim() ? ` ${note.trim()}` : ''}`
  const href = whatsappHref(phone, text)
  const by = dateParts(rsvpBy)
  const line: CSSProperties = { fontFamily: script, fontSize: 26, lineHeight: 1.2, background: 'transparent', borderBottom: `1px solid ${P.ink}`, color: P.ink }
  const option = 'aq-btn flex min-h-[40px] w-full items-center gap-3 text-left'

  return (
    <section id={anchor} className="relative px-5 pb-16 pt-20" style={LINEN}>
      <Reveal disabled={isPreview} className="relative mx-auto w-[min(100%,27rem)]">
        {/* the seal sits on the card's top edge */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <Seal a={initials[0]} b={initials[1]} size="clamp(70px, 21cqi, 92px)" />
        </div>
        <Flower name="iris-yellow" className="right-[-8cqi] top-[-24cqi] z-0 w-[24cqi]" style={{ rotate: '18deg' }} />
        <Paper tint="blush" className="relative z-10 px-7 pb-9 pt-[14cqi]" tilt={0.6}>
          <p className="text-center italic" style={{ fontFamily: serif, fontSize: 'clamp(17px, 5cqi, 19px)', lineHeight: 1.45, color: P.soft, textWrap: 'balance' }}>
            The favour of a reply is requested
            {by ? <> by the {by.day}{['th', 'st', 'nd', 'rd'][by.day % 10 > 3 || Math.floor(by.day / 10) === 1 ? 0 : by.day % 10]} of {by.month}</> : null}
          </p>
          <Flourish uid="rsvp" className="mx-auto mt-3" width="min(40cqi, 150px)" />

          <label className="mt-7 flex items-end gap-2">
            <span style={{ fontFamily: script, fontSize: 30, lineHeight: 1, color: P.ink }}>M</span>
            <input value={who} onChange={(e) => setWho(e.target.value.slice(0, 60))} placeholder="rs. & Mr. Shah" aria-label="Your name" className="min-w-0 flex-1 px-1 pb-0.5 outline-none" style={line} />
          </label>

          <div className="mt-6 space-y-1.5">
            <button type="button" onClick={() => setAnswer('yes')} aria-pressed={answer === 'yes'} className={option}>
              <Check on={answer === 'yes'} />
              <span style={{ fontFamily: caps, fontSize: 12.5, letterSpacing: '0.2em', color: P.ink }}>Joyfully accepts</span>
            </button>
            <button type="button" onClick={() => setAnswer('no')} aria-pressed={answer === 'no'} className={option}>
              <Check on={answer === 'no'} />
              <span style={{ fontFamily: caps, fontSize: 12.5, letterSpacing: '0.2em', color: P.ink }}>Regretfully declines</span>
            </button>
          </div>

          {answer && (
            <div className="aq-pop mt-6 space-y-6">
              {answer === 'yes' && fns.length > 1 && (
                <div>
                  <Caps color={P.faint} size={10}>Will attend</Caps>
                  <div className="mt-1">
                    {fns.map((f, i) => (
                      <button key={i} type="button" onClick={() => setGoing((s) => ({ ...s, [i]: !s[i] }))} aria-pressed={!!going[i]} className={option}>
                        <Check on={!!going[i]} />
                        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 18, color: P.ink }}>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {answer === 'yes' && (
                <div className="flex items-center justify-between gap-3">
                  <Caps color={P.faint} size={10}>Number of guests</Caps>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="aq-btn h-10 w-10 rounded-full text-[20px]" style={{ border: `1px solid ${P.rule}`, color: P.ink }} aria-label="One fewer">−</button>
                    <span className="w-7 text-center" style={{ fontFamily: script, fontSize: 30, lineHeight: 1, color: P.ink }}>{count}</span>
                    <button type="button" onClick={() => setCount((c) => Math.min(20, c + 1))} className="aq-btn h-10 w-10 rounded-full text-[20px]" style={{ border: `1px solid ${P.rule}`, color: P.ink }} aria-label="One more">+</button>
                  </div>
                </div>
              )}
              <label className="block">
                <Caps color={P.faint} size={10}>A note for the couple</Caps>
                <input value={note} onChange={(e) => setNote(e.target.value.slice(0, 140))} placeholder="One vegetarian, and we can’t wait!" className="mt-1 w-full px-1 pb-1 outline-none" style={{ ...line, fontFamily: serif, fontStyle: 'italic', fontSize: 18 }} />
              </label>
              <Solid href={href} isPreview={isPreview}>
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinejoin="round" d="M4.6 19.4 5.7 16A8 8 0 1 1 8.4 18.6Z" />
                </svg>
                Send by WhatsApp
              </Solid>
            </div>
          )}
        </Paper>
      </Reveal>
    </section>
  )
}

/* ── The invitation ────────────────────────────────────────────────── */

type Phase = 'closed' | 'opening' | 'open'

export default function SignatureAquarelle({ data, eventId, isPreview = false }: InviteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bride = data.brideName?.trim() || 'Anaya'
  const groom = data.groomName?.trim() || 'Vihaan'
  const couple = `${bride} & ${groom}`
  const initials: [string, string] = [bride.charAt(0).toUpperCase(), groom.charAt(0).toUpperCase()]
  const date = dateParts(data.date)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const fullPlace = [venue, address].filter(Boolean).join(', ')
  const destination = data.destination?.trim() || ''
  const invocation = useMemo(() => parseLines(data.invocation), [data.invocation])
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const story = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const photos = useMemo(() => galleryImages(data.galleryImages, 8), [data.galleryImages])
  const portraits = [
    { src: data.bridePhoto, alt: bride, name: bride, parents: data.brideParents?.trim() || '' },
    { src: data.groomPhoto, alt: groom, name: groom, parents: data.groomParents?.trim() || '' },
  ]
  const cover = isImg(data.couplePhoto) ? data.couplePhoto : ''
  const music = /^https?:\/\//i.test(data.musicUrl || '') ? data.musicUrl : ''
  const live = /^https?:\/\//i.test(data.livestreamUrl || '') ? data.livestreamUrl : ''
  const registry = /^https?:\/\//i.test(data.registryUrl || '') ? data.registryUrl : ''
  const hashtag = data.hashtag?.trim() ? (data.hashtag.trim().startsWith('#') ? data.hashtag.trim() : `#${data.hashtag.trim()}`) : ''
  const weddingCal = calendarHref(`Wedding of ${couple}`, data.date, data.time, fullPlace || undefined, 6)
  const directions = mapsHref(data.mapsUrl, venue, address)
  // Another function's venue is looked up with the town (or the wedding's
  // address), so "The Boat Club" finds the one down the road, not one abroad.
  const near = destination || address
  const placeLabel = (v: string) =>
    !v || v.toLowerCase() === venue.toLowerCase() ? fullPlace : near && !v.toLowerCase().includes(near.toLowerCase()) ? `${v}, ${near}` : v
  const placeHref = (v: string) => (!v || v.toLowerCase() === venue.toLowerCase() ? directions : mapsHref(undefined, placeLabel(v)))
  // The town under the venue, unless the address already says it.
  const town = destination && !address.toLowerCase().includes(destination.toLowerCase()) ? destination : ''

  const fns: Fn[] = useMemo(() => {
    const rows = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'] as const).map((r) => ({
      ...r,
      date: /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? r.date : '',
      time: /^\d{1,2}:\d{2}/.test(r.time) ? r.time : '',
    }))
    if (rows.length > 1 && rows.every((r) => r.date)) rows.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    if (rows.length) return rows
    return [{ name: 'The wedding', date: data.date || '', time: data.time || '', venue, dress: data.dressCode || '' }]
  }, [data.events, data.date, data.time, venue, data.dressCode])
  // The route: each venue once, in the order guests reach it.
  const stops = useMemo(() => {
    const out: { venue: string; names: string[] }[] = []
    for (const f of fns) {
      const v = f.venue.trim()
      if (!v) continue
      const hit = out.find((s) => s.venue.toLowerCase() === v.toLowerCase())
      if (hit) hit.names.push(f.name)
      else out.push({ venue: v, names: [f.name] })
    }
    return out.slice(0, 6)
  }, [fns])
  const wear = swatches(data.dressCode || '')

  // The guest a personal link was made for: ?to=Shalini+and+family
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])
  // On the folded card: the guest's name, or the host's line for everyone.
  const dear = guest || data.guestLine?.trim() || ''

  /* closed → the seal breaks, the ribbon slips off and the card opens → open */
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
  const openUp = useCallback(() => {
    if (phase !== 'closed') return
    // The tap is the gesture browsers ask for before sound: the music starts with the seal.
    if (music && !isPreview && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('opening')
    timers.current.push(window.setTimeout(() => setPhase('open'), 2000))
  }, [phase, music, isPreview])

  const [revealed, setRevealed] = useState(false)
  const countdown = useCountdown(data.date, data.time, !isPreview && revealed)
  const ids = { days: `${uid}-days`, rsvp: `${uid}-rsvp` }
  const closed = phase === 'closed'
  const screenH = isPreview ? PREVIEW_H : '100svh'
  const hasRsvp = Boolean(whatsappHref(data.whatsappNumber))
  const hasFamilies = Boolean(portraits.some((p) => p.parents || isImg(p.src)) || blessings.length)
  const when = timeWords(data.time)

  return (
    <div className={`aq relative ph-${phase}`} style={{ ...LINEN, color: P.ink, fontFamily: serif, overflowX: 'clip', containerType: 'inline-size' }}>
      <style>{`
        .aq .aq-in { opacity: 0; transform: translateY(18px) scale(.985); }
        .aq.ph-opening .aq-in { opacity: 1; transform: none; transition: opacity 1s ease .7s, transform 1.5s cubic-bezier(.2,.7,.2,1) .6s; }
        .aq.ph-open .aq-in { opacity: 1; transform: none; }
        .aq .aq-in-rose { opacity: 0; }
        .aq.ph-opening .aq-in-rose { animation: aq-lay 1.6s cubic-bezier(.2,.7,.2,1) .9s both; }
        .aq.ph-open .aq-in-rose { opacity: 1; }
        @keyframes aq-lay { from { opacity: 0; translate: 0 -26px; } to { opacity: 1; translate: 0 0; } }
        .aq .aq-cover { transition: opacity .7s ease 1.2s; }
        .aq.ph-opening .aq-cover { opacity: 0; }
        .aq .aq-folio { transform-origin: 0% 50%; transition: transform 1.2s cubic-bezier(.6,.05,.3,1) .5s, opacity .6s ease 1s; }
        .aq.ph-opening .aq-folio { transform: perspective(1600px) rotateY(-82deg); opacity: 0; }
        .aq .aq-rib-l, .aq .aq-rib-r { transition: transform .9s cubic-bezier(.6,.05,.3,1) .2s, opacity .5s ease .55s; }
        .aq.ph-opening .aq-rib-l { transform: translateX(-115%) rotate(-5deg); opacity: 0; }
        .aq.ph-opening .aq-rib-r { transform: translateX(115%) rotate(5deg); opacity: 0; }
        .aq .aq-tails { transition: transform .8s cubic-bezier(.6,.05,.3,1) .15s, opacity .5s ease .3s; }
        .aq.ph-opening .aq-tails { transform: translateY(40px) rotate(8deg); opacity: 0; }
        .aq.ph-opening .aq-seal { animation: aq-seal .65s cubic-bezier(.5,0,.6,1) both; }
        @keyframes aq-seal { 0% { transform: scale(1); } 35% { transform: scale(1.12) rotate(-8deg); } 100% { transform: scale(.3) rotate(24deg); opacity: 0; } }
        .aq .aq-cover-rose { transition: transform 1s cubic-bezier(.6,.05,.3,1) .35s, opacity .6s ease .6s; }
        .aq.ph-opening .aq-cover-rose { transform: translate(-40%, -18%) rotate(-48deg); opacity: 0; }
        .aq .aq-ring { animation: aq-ring 2.4s ease-out infinite; }
        @keyframes aq-ring { 0% { transform: scale(.85); opacity: .7; } 100% { transform: scale(1.5); opacity: 0; } }
        .aq .aq-btn { transition: opacity .18s ease, transform .18s ease; }
        .aq .aq-btn:hover { opacity: .86; }
        .aq .aq-btn:active { transform: scale(.98); }
        .aq .aq-btn:disabled { opacity: .3; }
        .aq .aq-pop { animation: aq-pop .45s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes aq-pop { from { opacity: 0; transform: translateY(8px); } }
        .aq .aq-petal { animation: aq-petal 1.7s cubic-bezier(.2,.6,.3,1) both; }
        @keyframes aq-petal { 0% { opacity: 0; transform: translate(0, 0) rotate(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--x), var(--y)) rotate(var(--r)); } }
        .aq .aq-track { scrollbar-width: none; }
        .aq .aq-track::-webkit-scrollbar { display: none; }
        .aq summary { list-style: none; cursor: pointer; }
        .aq summary::-webkit-details-marker { display: none; }
        .aq details[open] .aq-plus { transform: rotate(45deg); }
        .aq input::placeholder { color: rgba(30,39,56,0.32); }
        @media (prefers-reduced-motion: reduce) {
          .aq .aq-in, .aq .aq-in-rose { opacity: 1; transform: none; animation: none; }
          .aq .aq-ring, .aq .aq-petal { animation: none; }
        }
      `}</style>

      {music && <audio ref={audio} src={music} loop preload="none" />}
      {music && !closed && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`${isPreview ? 'absolute' : 'fixed'} bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full`}
          style={{ background: P.table, color: P.ivory, border: `1px solid ${P.goldLight}`, boxShadow: '0 10px 22px -10px rgba(4,8,18,0.8)' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            {playing ? <path strokeLinecap="round" d="M9 6v12M15 6v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
          </svg>
        </button>
      )}

      <div className="relative mx-auto w-full max-w-[30rem]" style={{ containerType: 'inline-size' }}>
        {/* ── The invitation, and the folded card it arrives in ───────── */}
        {/* While the card is closed, the section is one screen tall: nothing under it to scroll to. */}
        <section className={`relative ${phase === 'open' ? 'z-10' : 'overflow-hidden'}`} style={{ minHeight: screenH, ...(closed ? { height: screenH } : {}) }}>
          <div className="aq-in relative px-[6cqi] pb-[22cqi] pt-[28cqi]">
            {/* one rose tucked behind the card, one laid across its corner */}
            <Bouquet kind="crown" eager className="aq-in-rose left-[-4cqi] right-[-10cqi] top-[-6cqi] z-0" style={{ height: '46cqi' }} />
            <Paper className="relative z-10 px-[8cqi] pb-[16cqi] pt-[11cqi] text-center">
              {invocation.length > 0 && (
                <div className="mb-[4cqi]">
                  {invocation.map((line, i) => (
                    <p key={i} className="italic leading-snug" style={{ fontSize: 15, color: P.soft }}>{line}</p>
                  ))}
                </div>
              )}
              <Monogram a={initials[0]} b={initials[1]} uid={uid} size="clamp(52px, 15cqi, 68px)" />
              <Caps className="mt-[5cqi]" color={P.soft} size="clamp(9.5px, 2.9cqi, 11px)" track="0.32em">Together with their families</Caps>
              {/* Its own container, so each name is sized by its longest word and a long surname shrinks instead of overflowing. */}
              <h1 className="mt-[2cqi]" style={{ fontWeight: 400, containerType: 'inline-size', width: '100%' }}>
                <span className="block" style={{ fontFamily: script, fontSize: `clamp(36px, ${fitCqi(bride, { em: 0.44, max: 19 })}cqi, 88px)`, lineHeight: 1.15, color: P.ink }}>{bride}</span>
                <span className="block" style={{ ...foil({ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(24px, 8cqi, 38px)', lineHeight: 0.9 }) }}>&amp;</span>
                <span className="block" style={{ fontFamily: script, fontSize: `clamp(36px, ${fitCqi(groom, { em: 0.44, max: 19 })}cqi, 88px)`, lineHeight: 1.15, color: P.ink }}>{groom}</span>
              </h1>
              <p className="mx-auto mt-[4cqi] max-w-[24ch] italic" style={{ fontSize: 'clamp(17px, 5.2cqi, 20px)', lineHeight: 1.45, color: P.soft, textWrap: 'balance' }}>
                request the pleasure of your company at the celebration of their marriage
              </p>
              <div className="mt-[6cqi]">
                {date ? (
                  <Reveal disabled={isPreview}>
                    <ScratchDate date={date} revealed={revealed} onReveal={() => setRevealed(true)} />
                  </Reveal>
                ) : (
                  <p className="italic" style={{ fontSize: 19, color: P.soft }}>The date is to follow.</p>
                )}
              </div>
              {when && <p className="mt-[5cqi] italic" style={{ fontSize: 'clamp(17px, 5.2cqi, 20px)', color: P.soft }}>{when}</p>}
              {venue && <Caps className="mt-[2cqi]" color={P.ink} size="clamp(12px, 3.8cqi, 14.5px)" track="0.24em">{venue}</Caps>}
              {(address || town) && <p className="mx-auto max-w-[28ch] italic leading-snug" style={{ fontSize: 'clamp(15px, 4.4cqi, 17px)', color: P.faint }}>{[address, town].filter(Boolean).join(', ')}</p>}
              <Flourish uid={`${uid}h`} className="mx-auto mt-[6cqi]" />
            </Paper>
            <Bouquet kind="corner" className="aq-in-rose bottom-[7cqi] left-[-20cqi] z-20 w-[62cqi]" style={{ height: '36cqi', animationDelay: '1.2s' }} />
          </div>

          {/* the folded card it comes in, tied with ribbon, until the guest breaks the seal */}
          {phase !== 'open' && (
            <div className="aq-cover absolute inset-x-0 top-0 z-30 overflow-hidden" style={{ ...LINEN, height: screenH }}>
              <Flower name="amaryllis" eager className="aq-cover-rose right-[-6cqi] top-[1%] w-[46cqi]" style={{ rotate: '24deg' }} />
              <div className="aq-folio absolute inset-x-[9%] inset-y-[7%]">
                <Paper className="h-full" style={{ height: '100%' }}>
                  {/* The ribbon is part of the card's own layout, so it always runs between the names and the guest's name, whatever the screen's shape. */}
                  <div className="flex flex-col items-center px-[7cqi] py-[8cqi] text-center" style={{ minHeight: `calc(${screenH} * 0.86 - 40px)` }}>
                    <Caps color={P.soft} size="clamp(9.5px, 2.8cqi, 11px)" track="0.36em">The wedding of</Caps>
                    <div className="mt-[4cqi]">
                      <Monogram a={initials[0]} b={initials[1]} uid={`${uid}c`} size="clamp(62px, 19cqi, 84px)" />
                    </div>
                    <p className="mt-[3cqi]" style={{ fontFamily: caps, fontSize: 'clamp(11px, 3.3cqi, 13px)', letterSpacing: '0.24em', color: P.ink }}>{bride} &amp; {groom}</p>
                    <div className="min-h-[6cqi] flex-1" />
                    <div className="relative w-full" style={{ height: 'clamp(92px, 28cqi, 124px)' }}>
                      {/* a rose slipped under the ribbon */}
                      <Bouquet kind="spray" eager className="aq-cover-rose z-[1]" style={{ left: '-24cqi', top: '-48cqi', width: '56cqi', height: '90cqi' }} />
                      {/* the ribbon, in two halves that slip apart, running off both edges of the card */}
                      <div className="pointer-events-none absolute z-[2]" style={{ left: '-14cqi', right: '-14cqi', top: '50%', height: 'clamp(30px, 9cqi, 40px)', transform: 'translateY(-50%)' }} aria-hidden>
                        {(['l', 'r'] as const).map((side) => (
                          <span
                            key={side}
                            className={`aq-rib-${side} absolute inset-y-0 block`}
                            style={{
                              [side === 'l' ? 'left' : 'right']: 0,
                              width: '50%',
                              background: 'linear-gradient(180deg, #D8ABA4 0%, #F2D5CF 16%, #E7BDB6 38%, #F7E0DB 58%, #E2B3AC 80%, #C9958E 100%)',
                              boxShadow: '0 3px 5px rgba(4,8,18,0.32)',
                            }}
                          />
                        ))}
                      </div>
                      {/* its two tails under the knot */}
                      <div className="aq-tails pointer-events-none absolute left-1/2 top-1/2 z-[2]" style={{ width: 0 }} aria-hidden>
                        <span className="absolute block" style={{ width: 'clamp(24px, 7.5cqi, 32px)', height: 'clamp(62px, 19cqi, 84px)', left: '-2px', transform: 'rotate(24deg)', transformOrigin: '50% 0', background: 'linear-gradient(90deg, #D8ABA4, #F2D5CF 40%, #E2B3AC)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)' }} />
                        <span className="absolute block" style={{ width: 'clamp(24px, 7.5cqi, 32px)', height: 'clamp(56px, 17cqi, 76px)', right: '-2px', transform: 'rotate(-20deg)', transformOrigin: '50% 0', background: 'linear-gradient(90deg, #E2B3AC, #F2D5CF 60%, #D8ABA4)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)' }} />
                      </div>
                      {/* the seal is the button */}
                      <div className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2">
                        <span aria-hidden className="aq-ring pointer-events-none absolute inset-[-6%] rounded-full" style={{ border: `1.5px solid ${P.goldLight}` }} />
                        <button type="button" onClick={openUp} aria-label="Break the seal and open the invitation" className="aq-seal relative block rounded-full">
                          <Seal a={initials[0]} b={initials[1]} size="clamp(92px, 28cqi, 124px)" />
                        </button>
                      </div>
                    </div>
                    <div className="min-h-[10cqi] flex-1" />
                    {dear && (
                      <>
                        <p className="italic" style={{ fontSize: 'clamp(15px, 4.4cqi, 17px)', color: P.faint }}>for</p>
                        <p className="max-w-full" style={{ fontFamily: script, fontSize: 'clamp(30px, 10cqi, 44px)', lineHeight: 1.2, color: P.ink, overflowWrap: 'anywhere', textWrap: 'balance' }}>{dear}</p>
                      </>
                    )}
                    <Caps className="mt-[4cqi]" color={P.goldText} size="clamp(9px, 2.6cqi, 10.5px)" track="0.32em">Break the seal to open</Caps>
                  </div>
                </Paper>
              </div>
            </div>
          )}
        </section>

        {!closed && (
          <>
            {/* ── Counting down, once the date is found ─────────────────── */}
            {revealed && date && (
              <section className="aq-pop relative px-6 pb-14 pt-[10cqi] text-center">
                {countdown && (
                  <div className="mx-auto flex w-[min(90cqi,420px)] items-start justify-center gap-[5cqi]">
                    {([['days', countdown.days], ['hours', countdown.hours], ['minutes', countdown.minutes], ['seconds', countdown.seconds]] as const).map(([k, v], i) => (
                      <div key={k} className="flex items-start gap-[5cqi]">
                        {i > 0 && <span className="mt-[3.2cqi] block h-1 w-1 rotate-45" style={{ background: P.goldLight }} aria-hidden />}
                        <div>
                          <p style={{ fontFamily: caps, fontSize: 'clamp(28px, 9cqi, 38px)', lineHeight: 1.1, color: P.ivory }}>{String(v).padStart(2, '0')}</p>
                          <p className="mt-1" style={{ fontFamily: caps, fontSize: 9.5, letterSpacing: '0.26em', color: P.ivoryFaint }}>{k}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-4" style={{ ...foil({ fontFamily: script, fontSize: 'clamp(32px, 10cqi, 42px)', lineHeight: 1.2 }) }}>until we say I do</p>
                <div className="mt-4 flex flex-wrap justify-center gap-x-7 gap-y-1">
                  <TextLink href={weddingCal} isPreview={isPreview} light>Add to calendar</TextLink>
                  <TextLink href={directions} isPreview={isPreview} light>Directions</TextLink>
                </div>
              </section>
            )}

            {/* ── A letter ───────────────────────────────────────────── */}
            {(note.length > 0 || cover) && (
              <section className="relative px-5 pb-16 pt-10">
                <Reveal disabled={isPreview}>
                  <Paper tint="blush" className="relative mx-auto w-[min(100%,27rem)] px-[8cqi] pb-[10cqi] pt-[12cqi]" tilt={-0.7}>
                    {/* laid paper: the faint lines of the mould */}
                    <div aria-hidden className="pointer-events-none absolute inset-[18px]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 9px, rgba(120,100,70,0.05) 9px 10px)' }} />
                    {cover && (
                      <div className="relative mx-auto mb-8 w-[74%]" style={{ transform: 'rotate(-2.5deg)' }}>
                        <Paper edge={12} shadow="flat" className="p-2.5">
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cover} alt={couple} className="block aspect-[4/5] w-full object-cover" loading="lazy" />
                            <Corners />
                          </div>
                        </Paper>
                      </div>
                    )}
                    {note.length > 0 && (
                      <div className="relative" style={{ fontSize: 'clamp(18px, 5.4cqi, 20.5px)', lineHeight: 1.62, color: P.soft }}>
                        <Stamp place={destination || venue || 'With love'} year={date?.year} uid={uid} />
                        <p style={{ fontFamily: script, fontSize: 'clamp(30px, 8.8cqi, 37px)', lineHeight: 1.15, color: P.ink }}>{guest ? `Dear ${guest},` : 'Dear family & friends,'}</p>
                        {note.map((line, i) => (
                          <p key={i} className="mt-3 italic">{line}</p>
                        ))}
                        <p className="mt-6 text-right italic" style={{ fontSize: 17, clear: 'both' }}>with all our love,</p>
                        <p className="text-right" style={{ fontFamily: script, fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.2, color: P.ink }}>{bride} &amp; {groom}</p>
                      </div>
                    )}
                  </Paper>
                </Reveal>
              </section>
            )}

            {/* ── The families ───────────────────────────────────────── */}
            {hasFamilies && (
              <section className="relative px-5 pb-16 pt-6">
                <Reveal disabled={isPreview}>
                  <TableTitle kicker="Two families" uid={`${uid}f`}>one celebration</TableTitle>
                </Reveal>
                <div className="mx-auto mt-10 grid w-[min(100%,28rem)] grid-cols-2 gap-x-3">
                  {portraits.map((p, i) => (
                    <Reveal key={i} disabled={isPreview} delay={i * 90} className="min-w-0">
                      <Paper tint={i ? 'sky' : 'sage'} tilt={i ? 1.6 : -1.6} edge={16} className="px-[4cqi] pb-[6cqi] pt-[6cqi] text-center">
                        <div className="relative mx-auto w-[78%]" style={{ aspectRatio: '3 / 4' }}>
                          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '50%', background: i ? '#EDF2F8' : '#FBEDEA' }}>
                            {isImg(p.src) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.src} alt={p.alt} className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <Flower name={i ? 'iris-blue' : 'rose-centifolia'} flat style={i ? { left: '-2%', top: '4%', width: '104%' } : { left: '-14%', top: '2%', width: '128%' }} />
                            )}
                          </div>
                          <svg viewBox="0 0 100 133" className="pointer-events-none absolute inset-[-5%] h-[110%] w-[110%]" preserveAspectRatio="none" aria-hidden>
                            <ellipse cx="50" cy="66.5" rx="48.5" ry="65" fill="none" stroke={P.gold} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                          </svg>
                          <div className="absolute bottom-[-9%] left-1/2 -translate-x-1/2">
                            <Seal a={p.name.charAt(0).toUpperCase()} size="clamp(44px, 13cqi, 58px)" />
                          </div>
                        </div>
                        <div style={{ containerType: 'inline-size', width: '100%' }}>
                          <p className="mt-7" style={{ fontFamily: script, fontSize: `clamp(26px, ${fitCqi(p.name, { em: 0.46, max: 22 })}cqi, 40px)`, lineHeight: 1.15, color: P.ink }}>{p.name}</p>
                        </div>
                        {p.parents && <p className="mt-1 italic leading-snug" style={{ fontSize: 'clamp(14px, 3.9cqi, 16px)', color: P.soft }}>{p.parents}</p>}
                      </Paper>
                    </Reveal>
                  ))}
                </div>
                {blessings.length > 0 && (
                  <Reveal disabled={isPreview} className="mx-auto mt-12 w-[min(100%,24rem)] text-center">
                    <Caps color={P.goldLight}>With the blessings of</Caps>
                    {blessings.map((b, i) => (
                      <p key={i} className="mt-1.5 italic" style={{ fontSize: 19, color: P.ivory }}>{b}</p>
                    ))}
                  </Reveal>
                )}
              </section>
            )}

            <Story photos={photos} moments={story} isPreview={isPreview} uid={uid} />

            {/* ── The order of celebrations ──────────────────────────── */}
            <section id={ids.days} className="relative px-5 pb-16 pt-10">
              <Reveal disabled={isPreview} className="relative">
                <Flower name="iris-violet" className="left-[-10cqi] top-[-20cqi] z-0 w-[28cqi]" style={{ rotate: '-22deg' }} />
                <Flower name="rose-regalis" className="right-[-14cqi] top-[-16cqi] z-0 w-[40cqi]" style={{ rotate: '28deg' }} />
                <Paper tint="butter" className="relative z-10 mx-auto w-[min(100%,28rem)] px-[8cqi] pb-[10cqi] pt-[11cqi] text-center" tilt={0.5}>
                  <div className="relative">
                    <Caps color={P.soft} size={11}>The order of the days</Caps>
                    <p style={{ fontFamily: script, fontSize: 'clamp(44px, 13cqi, 56px)', lineHeight: 1.2, color: P.ink }}>{fns.length > 1 ? 'Celebrations' : 'The celebration'}</p>
                    <Flourish uid={`${uid}o`} className="mx-auto mt-1" width="min(40cqi, 160px)" />
                    <ol className="mt-8">
                      {fns.map((f, i) => {
                        const dp = dateParts(f.date)
                        const cal = calendarHref(`${f.name} — ${couple}`, f.date || data.date, f.time || data.time, placeLabel(f.venue) || undefined, 3)
                        const map = placeHref(f.venue)
                        const tones = f.dress ? swatches(f.dress).slice(0, 4) : []
                        return (
                          <li key={i}>
                            {i > 0 && <div className="my-7"><Fleuron uid={`${uid}r${i}`} /></div>}
                            <Vignette name={SEQUENCE[i % SEQUENCE.length]} className="mb-1" />
                            <Caps color={P.wax} size={10.5} track="0.34em">{ROMAN[i] ?? i + 1}</Caps>
                            <h3 style={{ fontFamily: script, fontWeight: 400, fontSize: 'clamp(34px, 10.5cqi, 46px)', lineHeight: 1.15, color: P.ink, overflowWrap: 'anywhere' }}>{f.name}</h3>
                            {dp && <Caps className="mt-1" color={P.goldText} size={11}>{dp.weekday} · {dp.day} {dp.month}</Caps>}
                            <p className="mt-1 italic leading-snug" style={{ fontSize: 'clamp(17px, 5cqi, 19px)', color: P.soft }}>
                              {[timeLabel(f.time), f.venue].filter(Boolean).join(' · ')}
                            </p>
                            {f.dress && (
                              <p className="mt-1.5 flex items-center justify-center gap-2 italic" style={{ fontSize: 15.5, color: P.faint }}>
                                {tones.length > 0 && (
                                  <span className="flex -space-x-1" aria-hidden>
                                    {tones.map((c) => (
                                      <span key={c} className="inline-block h-3.5 w-3.5 rounded-full" style={{ background: c, boxShadow: `0 0 0 1.5px ${P.paper}, 0 0 0 2px ${P.rule}` }} />
                                    ))}
                                  </span>
                                )}
                                <span>{f.dress}</span>
                              </p>
                            )}
                            <div className="mt-1 flex flex-wrap justify-center gap-x-6">
                              <TextLink href={map} isPreview={isPreview}>Map</TextLink>
                              <TextLink href={cal} isPreview={isPreview}>Add to calendar</TextLink>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </Paper>
              </Reveal>
              {stops.length > 1 && (
                <Reveal disabled={isPreview}>
                  <Route stops={stops} isPreview={isPreview} hrefFor={placeHref} />
                </Reveal>
              )}
            </section>

            {/* ── What to wear: a swatch card ────────────────────────── */}
            {data.dressCode?.trim() && (
              <section className="relative px-5 pb-16 pt-4 text-center">
                <Reveal disabled={isPreview}>
                  <Paper tint="lilac" className="mx-auto w-[min(92%,24rem)] px-[8cqi] pb-[9cqi] pt-[9cqi]" tilt={-1}>
                    <Caps color={P.soft} size={11}>What to wear</Caps>
                    <p className="mt-3 italic" style={{ fontSize: 'clamp(19px, 5.8cqi, 22px)', lineHeight: 1.45, color: P.ink, textWrap: 'balance' }}>{data.dressCode.trim()}</p>
                    {wear.length > 0 && (
                      <div className="mt-6 flex justify-center gap-[2.5cqi]" aria-hidden>
                        {wear.map((c, i) => (
                          <span
                            key={c}
                            className="block"
                            style={{
                              width: 'clamp(38px, 12cqi, 52px)',
                              aspectRatio: '3 / 4',
                              background: c,
                              backgroundImage: `url(${ART}/linen.webp)`,
                              backgroundBlendMode: 'soft-light',
                              backgroundSize: '160px 160px',
                              transform: `rotate(${[-4, 3, -2, 4, -3, 2][i % 6]}deg)`,
                              // pinked edges, as a tailor cuts a swatch
                              WebkitMaskImage: 'conic-gradient(from -45deg at bottom, transparent, #000 1deg 89deg, transparent 90deg)',
                              maskImage: 'conic-gradient(from -45deg at bottom, transparent, #000 1deg 89deg, transparent 90deg)',
                              WebkitMaskSize: '8px 100%',
                              maskSize: '8px 100%',
                              filter: 'drop-shadow(0 2px 2px rgba(4,8,18,0.25))',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </Paper>
                </Reveal>
              </section>
            )}

            {/* ── Travel, answers, people to call ────────────────────── */}
            {(travel.length > 0 || faq.length > 0 || contacts.length > 0 || registry || hashtag || live) && (
              <section className="relative px-5 pb-16 pt-6">
                <Reveal disabled={isPreview}>
                  <TableTitle kicker="For our guests" uid={`${uid}g`}>good to know</TableTitle>
                </Reveal>
                <Reveal disabled={isPreview}>
                  <Paper tint="sky" className="mx-auto mt-9 w-[min(100%,28rem)] px-[8cqi] pb-[9cqi] pt-[9cqi]" tilt={0.4}>
                    <div className="grid gap-9">
                      {travel.length > 0 && (
                        <div>
                          <Caps color={P.goldText}>Travel &amp; stay</Caps>
                          <ul className="mt-3 space-y-3">
                            {travel.map((t, i) => (
                              <li key={i} className="flex gap-3 leading-snug" style={{ fontSize: 17.5, color: P.soft }}>
                                <span className="shrink-0" style={{ fontFamily: caps, fontSize: 11, lineHeight: '24px', color: P.wax }}>{ROMAN[i] ?? i + 1}</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {faq.length > 0 && (
                        <div>
                          <Caps color={P.goldText}>Questions</Caps>
                          <div className="mt-1">
                            {faq.map((q, i) => (
                              <details key={i} className="py-3" style={{ borderBottom: `1px solid ${P.rule}` }}>
                                <summary className="flex items-start justify-between gap-4">
                                  <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 19, color: P.ink }}>{q.q}</span>
                                  <span className="aq-plus shrink-0 transition-transform" style={{ fontFamily: serif, fontSize: 24, lineHeight: 1, color: P.gold }} aria-hidden>+</span>
                                </summary>
                                {q.a && <p className="mt-2 leading-snug" style={{ fontSize: 17, color: P.soft }}>{q.a}</p>}
                              </details>
                            ))}
                          </div>
                        </div>
                      )}
                      {contacts.length > 0 && (
                        <div>
                          <Caps color={P.goldText}>People to call</Caps>
                          <ul className="mt-2 space-y-1">
                            {contacts.map((c, i) => {
                              const tel = telHref(c.phone)
                              const wa = whatsappHref(c.phone, `Hello! A question about ${couple}'s wedding — `)
                              return (
                                <li key={i} className="flex flex-wrap items-center justify-between gap-x-3">
                                  <span className="min-w-0 italic" style={{ fontSize: 18, color: P.ink }}>{c.name}</span>
                                  <span className="flex shrink-0 gap-5">
                                    <TextLink href={tel} isPreview={isPreview}>Call</TextLink>
                                    <TextLink href={wa} isPreview={isPreview}>WhatsApp</TextLink>
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                      {(registry || hashtag || live) && (
                        <div className="text-center">
                          {hashtag && <p style={{ fontFamily: script, fontSize: 'clamp(30px, 9cqi, 38px)', lineHeight: 1.2, color: P.ink, overflowWrap: 'anywhere' }}>{hashtag}</p>}
                          <div className="mt-1 flex flex-wrap justify-center gap-x-6">
                            <TextLink href={registry || null} isPreview={isPreview}>Gift registry</TextLink>
                            <TextLink href={live || null} isPreview={isPreview}>Watch live</TextLink>
                          </div>
                        </div>
                      )}
                    </div>
                  </Paper>
                </Reveal>
              </section>
            )}

            {hasRsvp && <Rsvp anchor={ids.rsvp} couple={couple} fns={fns} phone={data.whatsappNumber} rsvpBy={data.rsvpBy} guest={guest} isPreview={isPreview} initials={initials} />}

            {eventId && (
              <WishesSection
                eventId={eventId}
                theme={WISHES_THEME}
                title="Wishes for the couple"
                intro={`Leave a blessing, a memory or a wish for ${bride} and ${groom}. Everyone who opens this invitation can read it.`}
                noun="wish"
                previewWishes={SAMPLE_WISHES}
                namePlaceholder="e.g. Meera & Arjun"
              />
            )}

            {/* ── Foot: two roses crossed under the seal ─────────────── */}
            <footer className="relative overflow-hidden px-6 pb-12 pt-10 text-center">
              <div className="relative mx-auto h-[94cqi] w-full max-w-[26rem]" aria-hidden>
                <Bouquet kind="foot" className="inset-x-[-4cqi] top-0" style={{ height: '62cqi' }} />
                <div className="absolute left-1/2 top-[42cqi] -translate-x-1/2">
                  <Seal a={initials[0]} b={initials[1]} size="clamp(78px, 24cqi, 104px)" />
                </div>
              </div>
              <div style={{ containerType: 'inline-size', width: '100%' }}>
                <p className="mt-6" style={{ fontFamily: script, fontSize: `clamp(38px, ${fitCqi(couple, { em: 0.36, max: 14 })}cqi, 60px)`, lineHeight: 1.2, color: P.ivory }}>
                  {bride} <span style={foil({ fontFamily: serif, fontStyle: 'italic', fontSize: '0.55em' })}>&amp;</span> {groom}
                </p>
              </div>
              {date && <Caps className="mt-2" color={P.ivorySoft}>{date.day} {date.month} {date.year}{destination ? ` · ${destination}` : ''}</Caps>}
              <p className="mt-4 italic" style={{ fontSize: 18, color: P.ivorySoft }}>Celebrate this new chapter with us.</p>
              <div className="mt-10">
                <Credit isPreview={isPreview} color={P.ivoryFaint} linkColor={P.ivory} />
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
