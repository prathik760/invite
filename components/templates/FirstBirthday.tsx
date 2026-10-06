'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { baloo } from './kit/fonts/baloo'
import { kalam } from './kit/fonts/kalam'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
  fitCqi,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords, ordinalWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * First birthday — a picture-book page.
 * Sky, clouds and crayon: the child's age is the big hot-air balloon, striped
 * like the real thing, with a small elephant in a party hat riding in the
 * basket. It rises into the sky once when the page opens. Below the clouds the
 * page turns to cream paper and the details are written in a rounded, friendly
 * hand. Crayon texture is a hatch pattern, not a filter over the whole page.
 */

const C = {
  sky: '#BFE3F4',
  skyDeep: '#86C3E3',
  skyWash: '#E4F3FA',
  sun: '#FFD45C',
  sunDeep: '#F2B227',
  coral: '#F37F68',
  coralDeep: '#C8543F',
  grass: '#86C66F',
  grassDeep: '#4D9443',
  cream: '#FFF6E6',
  card: '#FFFCF4',
  wicker: '#E3B57C',
  elephant: '#B3BFD2',
  ink: '#2E3558',
  inkSoft: 'rgba(46,53,88,0.76)',
  inkFaint: 'rgba(46,53,88,0.5)',
  rule: 'rgba(46,53,88,0.16)',
}

const round = baloo.style.fontFamily
const hand = kalam.style.fontFamily
const INK = C.ink

const f1 = (n: number) => n.toFixed(1)

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const AGE_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']

/** "1", "1st", "one", "first" -> 1. */
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

// ─── Crayon kit ─────────────────────────────────────────────────────────────

/** A hatch of short waxy strokes over a flat colour — crayon on paper. */
function Crayon({ id, base, streak, seed, angle = -28 }: { id: string; base: string; streak: string; seed: number; angle?: number }) {
  const r = rng(seed)
  const d = Array.from({ length: 9 }, () => {
    const x = r() * 16
    const y = r() * 16
    const l = 3 + r() * 6
    return `M${f1(x)} ${f1(y)}l${f1(l)} ${f1(-l * 0.18)}`
  }).join('')
  return (
    <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <rect width="16" height="16" fill={base} />
      <path d={d} stroke={streak} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
    </pattern>
  )
}

/** Shared defs: crayon fills and a slight wobble for outlines. */
function Defs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <Crayon id="fb-coral" base={C.coral} streak="#FFB7A5" seed={3} />
        <Crayon id="fb-sun" base={C.sun} streak="#FFF1B8" seed={5} angle={-34} />
        <Crayon id="fb-grass" base={C.grass} streak="#B9E3A5" seed={7} angle={-20} />
        <Crayon id="fb-skydeep" base={C.skyDeep} streak="#CDEAF7" seed={9} />
        <Crayon id="fb-cloud" base="#FFFDF6" streak="#E7EEF2" seed={11} angle={-12} />
        <Crayon id="fb-wicker" base={C.wicker} streak="#F5D6A6" seed={13} angle={-60} />
        <Crayon id="fb-elephant" base={C.elephant} streak="#DCE3ED" seed={15} />
        <Crayon id="fb-cream" base={C.cream} streak="#F4E5C8" seed={17} />
        <filter id="fb-rough" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2.6" />
        </filter>
      </defs>
    </svg>
  )
}

/** A puffy cloud with a flat-ish base, `w` wide, sitting on y = 0. */
function cloudPath(w: number, h: number, seed: number) {
  const r = rng(seed)
  const n = 4 + Math.floor(r() * 2)
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const y = i === 0 || i === n ? 0 : -h * (0.45 + 0.55 * Math.sin(Math.PI * t)) * (0.82 + r() * 0.28)
    pts.push([w * t + (i && i < n ? (r() - 0.5) * w * 0.06 : 0), y])
  }
  let d = `M0 0`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const rad = Math.hypot(x1 - x0, y1 - y0) * (0.56 + r() * 0.1)
    d += `A${f1(rad)} ${f1(rad)} 0 0 1 ${f1(x1)} ${f1(y1)}`
  }
  return `${d}Q${f1(w / 2)} ${f1(h * 0.1)} 0 0Z`
}

function Cloud({ x, y, w, h, seed }: { x: number; y: number; w: number; h: number; seed: number }) {
  return <path d={cloudPath(w, h, seed)} transform={`translate(${x} ${y})`} fill="url(#fb-cloud)" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
}

/** A small striped hot-air balloon for the distance. */
function FarBalloon({ x, y, s, a, b }: { x: number; y: number; s: number; a: string; b: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 -60C26 -60 38 -40 34 -20C31 -6 16 6 10 16H-10C-16 6 -31 -6 -34 -20C-38 -40 -26 -60 0 -60Z" fill={a} stroke={INK} strokeWidth={3} />
      <path d="M0 -60C-12 -44 -12 -2 -4 16H4C12 -2 12 -44 0 -60Z" fill={b} stroke={INK} strokeWidth={2.6} />
      <path d="M-9 16L-8 30M9 16L8 30" stroke={INK} strokeWidth={2.4} />
      <rect x="-9" y="30" width="18" height="13" rx="3" fill="url(#fb-wicker)" stroke={INK} strokeWidth={2.6} />
    </g>
  )
}

/** Envelope for when no age is given: a classic balloon silhouette. */
const ENVELOPE = 'M180 58C246 58 272 118 252 166C240 196 214 214 200 238H160C146 214 120 196 108 166C88 118 114 58 180 58Z'

/**
 * The main balloon: the age itself as the envelope, cut into gores of coral
 * and sunshine, with a skirt, ropes, and a basket carrying a small elephant.
 */
function MainBalloon({ age }: { age: number | null }) {
  const label = age !== null ? String(age) : ''
  const size = label.length > 2 ? 150 : label.length === 2 ? 200 : 268
  const base = 250
  const top = age !== null ? base - size * 0.74 : 58
  const bottom = base + 26
  const gores = Array.from({ length: 12 }, (_, i) => i - 6)
  const spread = label.length > 1 ? 52 : 40
  const skirtY = age !== null ? base + 2 : 238

  const clip = age !== null ? (
    <text x="180" y={base} textAnchor="middle" fontFamily={round} fontWeight={800} fontSize={size} letterSpacing={label.length > 1 ? -8 : 0}>
      {label}
    </text>
  ) : (
    <path d={ENVELOPE} />
  )

  return (
    <svg viewBox="0 0 360 380" className="block h-full w-full" aria-hidden style={{ overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id="fb-envelope">{clip}</clipPath>
      </defs>
      <g filter="url(#fb-rough)">
        {/* ropes and basket */}
        <path d={`M170 ${skirtY + 18}L151 ${bottom + 53}M190 ${skirtY + 18}L209 ${bottom + 53}M176 ${skirtY + 18}L170 ${bottom + 53}M184 ${skirtY + 18}L190 ${bottom + 53}`} stroke={INK} strokeWidth={1.8} />
        <g transform={`translate(180 ${bottom + 58}) scale(1.24)`}>
          {/* the elephant, peeking over the rim */}
          <path d="M-6 -24L3 -47L12 -25Z" fill="url(#fb-sun)" stroke={INK} strokeWidth={1.6} />
          <circle cx="2" cy="-39" r="1.6" fill={C.coral} />
          <circle cx="7" cy="-31" r="1.6" fill={C.coral} />
          <circle cx="3.2" cy="-48" r="3.4" fill={C.coral} stroke={INK} strokeWidth={1.4} />
          <ellipse cx="-11" cy="-10" rx="9.5" ry="11.5" fill="url(#fb-elephant)" stroke={INK} strokeWidth={1.6} transform="rotate(-12 -11 -10)" />
          <ellipse cx="-10.5" cy="-9.5" rx="5" ry="6.8" fill="#F6B9AA" opacity={0.8} transform="rotate(-12 -10.5 -9.5)" />
          <ellipse cx="4" cy="-12" rx="14" ry="12.5" fill="url(#fb-elephant)" stroke={INK} strokeWidth={1.6} />
          <path d="M15 -9C23 -8 27 -15 26 -24C25.5 -28 22 -29.5 20 -27" fill="none" stroke={INK} strokeWidth={8.6} />
          <path d="M15 -9C23 -8 27 -15 26 -24C25.5 -28 22 -29.5 20 -27" fill="none" stroke={C.elephant} strokeWidth={5.6} />
          <circle cx="8.5" cy="-15" r="1.7" fill={INK} />
          <circle cx="11" cy="-8.5" r="2.6" fill={C.coral} opacity={0.45} />
          {/* basket */}
          <path d="M-22 0H22L19 27Q0 31 -19 27Z" fill="url(#fb-wicker)" stroke={INK} strokeWidth={1.8} />
          <path d="M-21 9H21M-20 18H20M-11 0.5L-10 29M0 0.5V30M11 0.5L10 29" stroke={INK} strokeWidth={0.9} opacity={0.55} fill="none" />
          <rect x="-25" y="-4" width="50" height="7" rx="3" fill="url(#fb-wicker)" stroke={INK} strokeWidth={1.8} />
        </g>

        {/* skirt */}
        <path d={`M166 ${skirtY}H194L190 ${skirtY + 18}H170Z`} fill="url(#fb-sun)" stroke={INK} strokeWidth={1.8} />

        {/* the envelope: outline first, so glyph overlaps never show */}
        {age !== null ? (
          <text
            x="180"
            y={base}
            textAnchor="middle"
            fontFamily={round}
            fontWeight={800}
            fontSize={size}
            letterSpacing={label.length > 1 ? -8 : 0}
            fill="none"
            stroke={INK}
            strokeWidth={5.4}
          >
            {label}
          </text>
        ) : (
          <path d={ENVELOPE} fill="none" stroke={INK} strokeWidth={5} />
        )}
        <g clipPath="url(#fb-envelope)">
          <rect x="0" y="0" width="360" height="300" fill="url(#fb-coral)" />
          {gores.map((k) =>
            k % 2 === 0 ? (
              <path
                key={k}
                d={`M180 ${f1(top - 110)}Q${f1(180 + k * spread)} ${f1((top + base) / 2)} 180 ${bottom + 80}Q${f1(180 + (k + 1) * spread)} ${f1((top + base) / 2)} 180 ${f1(top - 110)}Z`}
                fill="url(#fb-sun)"
              />
            ) : null,
          )}
          {gores.map((k) => (
            <path key={`l${k}`} d={`M180 ${f1(top - 110)}Q${f1(180 + k * spread)} ${f1((top + base) / 2)} 180 ${bottom + 80}`} fill="none" stroke={INK} strokeWidth={1} opacity={0.35} />
          ))}
          <path d={`M${f1(180 - spread * 2.6)} ${f1(top + 40)}C${f1(180 - spread * 2.4)} ${f1(top + 10)} ${f1(180 - spread)} ${f1(top - 6)} 180 ${f1(top - 4)}`} fill="none" stroke="#FFFFFF" strokeWidth={7} opacity={0.4} />
        </g>
      </g>
    </svg>
  )
}

/** One piece of sky, placed by percentages so it spreads with the sky's size. */
function Piece({ box, className, children }: { box: string; className: string; children: ReactNode }) {
  return (
    <svg viewBox={box} className={`absolute ${className}`} aria-hidden style={{ overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <g filter="url(#fb-rough)">{children}</g>
    </svg>
  )
}

/** The sky behind the balloon: sun, far balloons, clouds, two birds. */
function Sky() {
  const rays = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2 + 0.2)
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Piece box="-50 -50 100 100" className="right-[5%] top-[4%] w-[92px]">
        {rays.map((a, i) => (
          <path
            key={i}
            d={`M${f1(Math.cos(a) * 34)} ${f1(Math.sin(a) * 34)}L${f1(Math.cos(a) * (i % 2 ? 44 : 48))} ${f1(Math.sin(a) * (i % 2 ? 44 : 48))}`}
            stroke={C.sunDeep}
            strokeWidth={3.2}
          />
        ))}
        <circle r="27" fill="url(#fb-sun)" stroke={INK} strokeWidth={1.6} />
      </Piece>
      <Piece box="-40 -64 80 110" className="left-[9%] top-[17%] w-[40px]">
        <FarBalloon x={0} y={0} s={1} a="url(#fb-grass)" b="url(#fb-sun)" />
      </Piece>
      <Piece box="-40 -64 80 110" className="right-[12%] top-[46%] w-[30px]">
        <FarBalloon x={0} y={0} s={1} a="url(#fb-skydeep)" b="url(#fb-coral)" />
      </Piece>
      <Piece box="0 -36 100 40" className="right-[24%] top-[13%] w-[84px]">
        <Cloud x={2} y={0} w={96} h={32} seed={4} />
      </Piece>
      <Piece box="0 -36 100 40" className="left-[3%] top-[40%] w-[104px]">
        <Cloud x={2} y={0} w={96} h={32} seed={8} />
      </Piece>
      <Piece box="0 -36 100 40" className="right-[3%] top-[64%] w-[96px]">
        <Cloud x={2} y={0} w={96} h={32} seed={12} />
      </Piece>
      <Piece box="0 0 50 24" className="left-[30%] top-[8%] w-[48px]">
        <path d="M2 8q6 -6 12 0q6 -6 12 0M28 22q4 -4 8 0q4 -4 8 0" fill="none" stroke={INK} strokeWidth={1.6} />
      </Piece>
    </div>
  )
}

/** A seamless strip of cloud tops, tiled across the width, into cream paper. */
const CLOUD_BANK = (() => {
  const top = 'M0 30A26 26 0 0 1 46 20A34 34 0 0 1 108 14A26 26 0 0 1 152 24A36 36 0 0 1 218 16A28 28 0 0 1 268 22A28 28 0 0 1 320 30'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='56' viewBox='0 0 320 56'><path d='${top}V56H0Z' fill='${C.cream}'/><path d='${top}' fill='none' stroke='${C.ink}' stroke-width='1.6' stroke-linejoin='round'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

/** A small balloon on a string, for the plan and the countdown. */
function LittleBalloon({ fill, className, children }: { fill: string; className?: string; children?: ReactNode }) {
  return (
    <svg viewBox="0 0 60 92" className={className} aria-hidden style={{ overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <g filter="url(#fb-rough)">
        <path d="M30 60C31 68 26 74 30 80C33 85 29 89 30 92" fill="none" stroke={INK} strokeWidth={1.4} />
        <path d="M30 2C46 2 57 14 57 30C57 46 44 58 30 60C16 58 3 46 3 30C3 14 14 2 30 2Z" fill={fill} stroke={INK} strokeWidth={1.8} />
        <path d="M26 60L30 55L34 60L30 63Z" fill={fill} stroke={INK} strokeWidth={1.4} />
        <path d="M12 22C14 14 20 9 27 8" fill="none" stroke="#FFFFFF" strokeWidth={3.4} opacity={0.55} />
      </g>
      {children}
    </svg>
  )
}

/** A hand-drawn rectangle border that stretches to its box. */
function CrayonBox({ color = INK, seed = 1 }: { color?: string; seed?: number }) {
  const r = rng(seed)
  const j = () => f1((r() - 0.5) * 1.2)
  const d = `M${1 + r()} ${1.5 + r()}C30 ${j()} 70 ${1 + r()} ${99 - r()} ${1.2 + r()}C${100 + Number(j())} 30 ${99 + Number(j())} 70 ${98.6 + r()} ${98.5 - r()}C70 ${99 + Number(j())} 30 ${99.4 - r()} ${1.4 + r()} ${98.6 - r()}C${Number(j()) + 0.6} 70 ${1 + Number(j())} 30 ${1.2 + r()} ${2.4 + r()}`
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2.4} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Squiggle({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={className} aria-hidden fill="none">
      <path d="M2 6C10 1 16 1 22 6S34 11 42 6 56 1 62 6 74 11 82 6 96 1 102 6 112 11 118 6" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}

// ─── Template ───────────────────────────────────────────────────────────────

const PLAN_FILLS = ['url(#fb-coral)', 'url(#fb-sun)', 'url(#fb-grass)', 'url(#fb-skydeep)']
const FRAME_COLORS = [C.coral, C.grassDeep, C.skyDeep, C.sunDeep]

export default function FirstBirthday({ data, eventId, isPreview = false }: InviteProps) {
  const name = data.celebrantName?.trim() || 'Vihaan'
  const first = name.split(/\s+/)[0]
  const age = ageOf(data.age)
  const parents = data.parentNames?.trim() || ''
  const theme = data.theme?.trim() || ''
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const photo = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? data.celebrantPhoto : null
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const ordinal = age !== null ? (age <= 10 ? ORDINALS[age] : ordinalWords(age)) : ''
  const calendar = calendarHref(ordinal ? `${first}’s ${ordinal} birthday` : `${first}’s birthday`, data.date, data.time, place, 3)

  const longest = Math.max(...name.split(/\s+/).map((w) => w.length), 1)
  const nameCqi = Math.min(22, 90 / (longest * 0.6))
  const nameSize = `clamp(20px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.2)}px)`

  const WISHES_THEME: InviteTheme = {
    bg: C.skyWash,
    surface: '#FFFFFF',
    ink: C.ink,
    muted: C.inkSoft,
    line: '#CFE3EE',
    accent: C.coralDeep,
    onAccent: '#FFFFFF',
    heading: round,
    body: round,
    headingStyle: { fontWeight: 800, fontSize: 'clamp(28px, 9cqi, 36px)', letterSpacing: '-0.01em' },
  }

  const button = 'fb-btn relative inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] border-2 px-6 text-[16px] font-bold'
  const buttonStyle = (bg: string): CSSProperties => ({ background: bg, color: C.ink, borderColor: C.ink, fontFamily: round, boxShadow: `0 3px 0 ${C.ink}` })

  return (
    <div
      className="fb relative overflow-x-hidden"
      style={{ backgroundColor: C.cream, color: C.ink, fontFamily: round, containerType: 'inline-size' }}
    >
      <style>{`
        .fb .fb-rise { animation: fb-rise 2600ms cubic-bezier(.22,.8,.3,1) 200ms both; will-change: transform; }
        @keyframes fb-rise {
          0% { transform: translateY(58%) rotate(-3deg); }
          62% { transform: translateY(-2.5%) rotate(1.2deg); }
          82% { transform: translateY(1%) rotate(-0.4deg); }
          100% { transform: none; }
        }
        .fb .fb-btn { transition: transform 140ms ease, box-shadow 140ms ease; }
        .fb .fb-btn:hover { transform: translateY(-1px); }
        .fb .fb-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 ${C.ink} !important; }
        @media (prefers-reduced-motion: reduce) { .fb .fb-rise { animation: none; } }
      `}</style>
      <Defs />

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.ink} background="rgba(255,252,244,0.92)" border={C.rule} />

      {/* ── The sky ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <div className="relative flex flex-1 flex-col" style={{ backgroundColor: C.sky, ...grain(0.05) }}>
          <Sky />
          <div className="relative mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center px-2 pt-6">
            <div className="relative w-full" style={{ aspectRatio: '360 / 372' }}>
              <div className={`absolute inset-0 ${isPreview ? '' : 'fb-rise'}`} style={{ transformOrigin: '50% 30%' }}>
                <MainBalloon age={age} />
              </div>
            </div>
          </div>
          <div aria-hidden className="relative -mt-6 h-[56px]" style={{ backgroundImage: CLOUD_BANK, backgroundRepeat: 'repeat-x', backgroundSize: '320px 56px', backgroundPosition: 'center bottom' }} />
        </div>

        <div className="relative px-6 pb-12 text-center" style={{ backgroundColor: C.cream }}>
          {photo && (
            <div className="relative mx-auto -mt-16 mb-4 h-[132px] w-[132px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={name} className="h-full w-full rounded-full object-cover" style={{ border: `6px solid ${C.card}` }} />
              <svg viewBox="0 0 100 100" className="absolute inset-[-6px] h-[calc(100%+12px)] w-[calc(100%+12px)]" aria-hidden fill="none">
                <circle cx="50" cy="50" r="47" stroke={C.coral} strokeWidth={2.6} strokeDasharray="10 3 18 4" filter="url(#fb-rough)" />
              </svg>
            </div>
          )}
          {theme && (
            <p className="mx-auto inline-block max-w-[20rem] leading-[1.1]" style={{ fontFamily: hand, fontWeight: 700, fontSize: 'clamp(22px, 7cqi, 28px)', color: C.coralDeep, transform: 'rotate(-3deg)' }}>
              {theme}
            </p>
          )}
          <h1 className={`${theme ? 'mt-2' : 'mt-1'} break-words leading-[0.95]`} style={{ fontSize: nameSize, fontWeight: 800, letterSpacing: '-0.015em' }}>
            {name}
          </h1>
          {age !== null && (
            <p className="mt-1" style={{ fontSize: 'clamp(22px, 7cqi, 28px)', fontWeight: 700, color: C.coralDeep }}>
              is turning {age <= 12 ? AGE_WORDS[age] : numberWords(age)}!
            </p>
          )}
          <p className="mx-auto mt-3 max-w-[19rem] leading-[1.45]" style={{ fontSize: 17, color: C.inkSoft, textWrap: 'balance' }}>
            {parents ? (
              <>
                <span style={{ color: C.ink, fontWeight: 700 }}>{parents}</span> invite you to {age !== null ? `the ${ordinal} birthday party` : 'the birthday party'}
              </>
            ) : (
              <>You’re invited to {age !== null ? `the ${ordinal} birthday party` : 'the birthday party'}</>
            )}
          </p>
        </div>
      </section>

      {/* ── When & where, on a crayon-ruled card ──────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-5 pb-6">
        <div className="relative px-6 pb-8 pt-8 text-center" style={{ background: C.card, transform: 'rotate(-0.6deg)' }}>
          <CrayonBox seed={3} />
          {date ? (
            <>
              <p style={{ fontSize: 17, fontWeight: 600, color: C.inkSoft }}>{date.weekday}</p>
              <p className="leading-[1.05]" style={{ fontSize: 'clamp(32px, 10cqi, 40px)', fontWeight: 800 }}>
                {date.day} {date.month}
              </p>
              <p style={{ fontSize: 17, fontWeight: 600, color: C.inkSoft }}>{date.year}</p>
            </>
          ) : (
            <p className="leading-[1.1]" style={{ fontSize: 28, fontWeight: 800 }}>Date to be announced</p>
          )}
          {time && (
            <p className="mt-2 inline-block rounded-full px-4 py-1" style={{ fontSize: 18, fontWeight: 700, background: C.sun }}>
              {time} onwards
            </p>
          )}

          <Squiggle color={C.skyDeep} className="mx-auto my-6 h-3 w-28" />

          <p className="leading-[1.2]" style={{ fontSize: 'clamp(22px, 7cqi, 26px)', fontWeight: 800 }}>{data.venue || 'Venue to be announced'}</p>
          {data.venueAddress && (
            <p className="mx-auto mt-1 max-w-[18rem] leading-[1.5]" style={{ fontSize: 16, color: C.inkSoft }}>
              {data.venueAddress}
            </p>
          )}

          {(directions || calendar) && (
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={buttonStyle(C.coral)}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={button}
                  style={buttonStyle(C.sun)}
                >
                  Add to calendar
                </a>
              )}
            </div>
          )}
        </div>
      </Reveal>

      {/* ── A note from the parents ───────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[28rem] px-7 pb-6 pt-14 text-center">
          <p className="leading-[1.5]" style={{ fontSize: 'clamp(19px, 5.8cqi, 22px)', fontWeight: 600, textWrap: 'pretty' }}>
            {data.message}
          </p>
          {parents && (
            <p className="mt-3" style={{ fontFamily: hand, fontWeight: 700, fontSize: 24, color: C.coralDeep }}>
              — {parents}
            </p>
          )}
        </Reveal>
      )}

      {/* ── Sleeps to go ──────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto flex max-w-[26rem] items-center justify-center gap-5 px-6 py-12">
          <div className="relative w-[118px] shrink-0">
            <LittleBalloon fill="url(#fb-coral)" className="block w-full" />
            <span className="absolute left-0 right-0 top-[22%] text-center leading-none tabular-nums" style={{ fontSize: countdown.days > 99 ? 38 : 50, fontWeight: 800, color: C.card }}>
              {countdown.days}
            </span>
          </div>
          <div className="min-w-0">
            <p className="leading-[1.1]" style={{ fontSize: 'clamp(24px, 7.4cqi, 30px)', fontWeight: 800 }}>
              {countdown.days === 1 ? 'more sleep' : 'more sleeps'}
            </p>
            <p style={{ fontSize: 17, fontWeight: 600, color: C.inkSoft }}>until the party</p>
            <p className="mt-2 tabular-nums" style={{ fontSize: 15, color: C.inkSoft }}>
              {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
            </p>
          </div>
        </Reveal>
      )}

      {/* ── The party plan, balloon by balloon ────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-10 pt-10">
          <h2 className="text-center" style={{ fontSize: 'clamp(30px, 9.4cqi, 38px)', fontWeight: 800, letterSpacing: '-0.01em' }}>The party plan</h2>
          <Squiggle color={C.coral} className="mx-auto mt-1 h-3 w-24" />
          <ol className="relative mt-8">
            <span aria-hidden className="absolute bottom-8 left-[21px] top-8 border-l-2 border-dashed" style={{ borderColor: C.inkFaint }} />
            {schedule.map((item, i) => (
              <li key={`${item.title}-${i}`} className="relative flex items-start gap-4 pb-6 last:pb-0">
                <LittleBalloon fill={PLAN_FILLS[i % PLAN_FILLS.length]} className="relative h-[60px] w-[44px] shrink-0" />
                <div className="min-w-0 pt-2">
                  {item.time && <p className="tabular-nums" style={{ fontSize: 16, fontWeight: 700, color: C.coralDeep }}>{item.time}</p>}
                  <p className="leading-[1.25]" style={{ fontSize: 21, fontWeight: 700 }}>{item.title}</p>
                  {item.note && <p className="mt-0.5" style={{ fontSize: 15.5, color: C.inkSoft }}>{item.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Photographs in crayon frames ──────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-6 pb-14 pt-8">
          <Reveal disabled={isPreview}>
            <h2 className="text-center" style={{ fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 800 }}>
              {age !== null && age <= 2 ? `${first}, so far` : `A few of ${first}`}
            </h2>
          </Reveal>
          <div className={`mt-8 grid gap-5 ${photos.length === 1 ? 'mx-auto w-[72%] grid-cols-1' : 'grid-cols-2'}`}>
            {photos.map((src, i) => (
              <Reveal
                key={`${src}-${i}`}
                disabled={isPreview}
                delay={(i % 2) * 90}
                style={{ marginTop: photos.length > 1 && i % 2 ? 30 : 0 }}
              >
                <div className="relative p-2" style={{ background: C.card, transform: `rotate(${i % 2 ? 1.6 : -1.4}deg)` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-square w-full rounded-[4px] object-cover" />
                  <CrayonBox color={FRAME_COLORS[i % FRAME_COLORS.length]} seed={20 + i} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {eventId && (
        <WishesSection
          eventId={eventId}
          theme={WISHES_THEME}
          title={`Wishes for ${first}`}
          intro={`Write a birthday wish for ${first} — the family will keep them all for later.`}
          noun="wish"
        />
      )}

      {/* ── Foot: back down on the grass ──────────────────────────── */}
      <footer className="relative text-center" style={{ backgroundColor: C.cream }}>
        <div className="px-6 pb-8 pt-14">
          <LittleBalloon fill="url(#fb-sun)" className="mx-auto h-[62px] w-[42px]" />
          <div style={{ containerType: 'inline-size', width: '100%' }}>
            <p className="mt-3" style={{ fontSize: `clamp(18px, ${fitCqi(name, { em: 0.6, max: 30 })}cqi, 30px)`, fontWeight: 800 }}>{name}</p>
          </div>
          {date && <p style={{ fontSize: 16, color: C.inkSoft }}>{date.day} {date.month} {date.year}</p>}
          <div className="mt-8">
            <Credit isPreview={isPreview} color={C.inkFaint} linkColor={C.coralDeep} />
          </div>
        </div>
        <svg viewBox="0 0 400 44" preserveAspectRatio="none" className="block h-[44px] w-full" aria-hidden>
          <path d="M0 22C60 6 120 4 190 16C250 26 320 8 400 18V44H0Z" fill="url(#fb-grass)" stroke={C.ink} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        </svg>
      </footer>
    </div>
  )
}
