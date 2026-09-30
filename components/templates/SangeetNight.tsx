'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { abril } from './kit/fonts/abril'
import { josefin } from './kit/fonts/josefin'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Sangeet Night — the marquee over the theatre door.
 * A mirror ball throws its beams across a midnight poster; under it the
 * couple's names are spelled in channel letters studded with bulbs (a real
 * single-stroke alphabet, so any name lights up), a chase of bulbs running
 * round the board. The line-up is set on a backlit changeable-letter board,
 * the countdown in bulbs, the photographs in a dressing-room mirror. On
 * arrival the sign flickers on, the way old marquees warm up.
 */

const C = {
  night: '#130A1F',
  plum: '#221030',
  plumDeep: '#1A0C26',
  magenta: '#D92E7C',
  magentaDeep: '#9E1557',
  gold: '#F1C14F',
  goldDeep: '#C8912A',
  bulb: '#FFF3C8',
  cream: '#FBEFD8',
  creamSoft: 'rgba(251,239,216,0.74)',
  creamFaint: 'rgba(251,239,216,0.5)',
  line: 'rgba(241,193,79,0.28)',
  board: '#FFF6DF',
  boardInk: '#1B1022',
}

const display = abril.style.fontFamily
const sans = josefin.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.night,
  surface: C.plum,
  ink: C.cream,
  muted: C.creamSoft,
  line: 'rgba(241,193,79,0.24)',
  accent: C.magenta,
  onAccent: '#FFFFFF',
  heading: display,
  body: sans,
  headingStyle: { fontWeight: 400, fontSize: 38, color: C.gold, lineHeight: 1.05 },
}

const f2 = (n: number) => n.toFixed(2)

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ─── A single-stroke marquee alphabet ────────────────────────────────────────
// Cap height 10 units. 'l' = line x1 y1 x2 y2; 'e' = elliptical arc cx cy rx ry
// from→to degrees (y down, so increasing angle runs clockwise); 'p' = one bulb.

type Seg = ['l', number, number, number, number] | ['e', number, number, number, number, number, number] | ['p', number, number]
type Glyph = { w: number; s: Seg[] }

const GLYPHS: Record<string, Glyph> = {
  A: { w: 7, s: [['l', 0, 10, 3.5, 0], ['l', 3.5, 0, 7, 10], ['l', 1.5, 6.2, 5.5, 6.2]] },
  B: { w: 6, s: [['l', 0, 10, 0, 0], ['l', 0, 0, 3, 0], ['e', 3, 2.4, 2.6, 2.4, -90, 90], ['l', 3, 4.8, 0, 4.8], ['l', 0, 4.8, 3.2, 4.8], ['e', 3.2, 7.4, 2.8, 2.6, -90, 90], ['l', 3.2, 10, 0, 10]] },
  C: { w: 7.6, s: [['e', 4.8, 5, 4.8, 5, -42, -318]] },
  D: { w: 7, s: [['l', 0, 0, 0, 10], ['l', 0, 0, 2, 0], ['e', 2, 5, 5, 5, -90, 90], ['l', 2, 10, 0, 10]] },
  E: { w: 5.6, s: [['l', 5.6, 0, 0, 0], ['l', 0, 0, 0, 10], ['l', 0, 10, 5.6, 10], ['l', 0, 5, 4.6, 5]] },
  F: { w: 5.6, s: [['l', 5.6, 0, 0, 0], ['l', 0, 0, 0, 10], ['l', 0, 5, 4.6, 5]] },
  G: { w: 8.6, s: [['e', 4.8, 5, 4.8, 5, -42, -330], ['l', 8.96, 7.5, 8.96, 5.3], ['l', 8.96, 5.3, 5.6, 5.3]] },
  H: { w: 6.6, s: [['l', 0, 0, 0, 10], ['l', 6.6, 0, 6.6, 10], ['l', 0, 5, 6.6, 5]] },
  I: { w: 0, s: [['l', 0, 0, 0, 10]] },
  J: { w: 5, s: [['l', 5, 0, 5, 7.3], ['e', 2.5, 7.3, 2.5, 2.7, 0, 180]] },
  K: { w: 6, s: [['l', 0, 0, 0, 10], ['l', 6, 0, 0, 6.2], ['l', 2.1, 4.4, 6, 10]] },
  L: { w: 5.2, s: [['l', 0, 0, 0, 10], ['l', 0, 10, 5.2, 10]] },
  M: { w: 8.4, s: [['l', 0, 10, 0, 0], ['l', 0, 0, 4.2, 7], ['l', 4.2, 7, 8.4, 0], ['l', 8.4, 0, 8.4, 10]] },
  N: { w: 6.8, s: [['l', 0, 10, 0, 0], ['l', 0, 0, 6.8, 10], ['l', 6.8, 10, 6.8, 0]] },
  O: { w: 9, s: [['e', 4.5, 5, 4.5, 5, -90, 270]] },
  P: { w: 6, s: [['l', 0, 10, 0, 0], ['l', 0, 0, 3.2, 0], ['e', 3.2, 2.7, 2.8, 2.7, -90, 90], ['l', 3.2, 5.4, 0, 5.4]] },
  Q: { w: 9, s: [['e', 4.5, 5, 4.5, 5, -90, 270], ['l', 5.8, 7, 9, 10.2]] },
  R: { w: 6.3, s: [['l', 0, 10, 0, 0], ['l', 0, 0, 3.2, 0], ['e', 3.2, 2.7, 2.8, 2.7, -90, 90], ['l', 3.2, 5.4, 0, 5.4], ['l', 3.2, 5.4, 6.3, 10]] },
  S: { w: 6, s: [['e', 3, 2.5, 2.9, 2.5, -25, -270], ['e', 3, 7.5, 3.1, 2.5, -90, 155]] },
  T: { w: 6.6, s: [['l', 0, 0, 6.6, 0], ['l', 3.3, 0, 3.3, 10]] },
  U: { w: 6.6, s: [['l', 0, 0, 0, 6.7], ['e', 3.3, 6.7, 3.3, 3.3, 180, 0], ['l', 6.6, 6.7, 6.6, 0]] },
  V: { w: 7, s: [['l', 0, 0, 3.5, 10], ['l', 3.5, 10, 7, 0]] },
  W: { w: 10, s: [['l', 0, 0, 2.5, 10], ['l', 2.5, 10, 5, 2.6], ['l', 5, 2.6, 7.5, 10], ['l', 7.5, 10, 10, 0]] },
  X: { w: 6.6, s: [['l', 0, 0, 6.6, 10], ['l', 6.6, 0, 0, 10]] },
  Y: { w: 7, s: [['l', 0, 0, 3.5, 5.2], ['l', 7, 0, 3.5, 5.2], ['l', 3.5, 5.2, 3.5, 10]] },
  Z: { w: 6.2, s: [['l', 0, 0, 6.2, 0], ['l', 6.2, 0, 0, 10], ['l', 0, 10, 6.2, 10]] },
  '0': { w: 6.4, s: [['e', 3.2, 5, 3.2, 5, -90, 270]] },
  '1': { w: 2.6, s: [['l', 0, 2.2, 2.6, 0], ['l', 2.6, 0, 2.6, 10]] },
  '2': { w: 6, s: [['e', 3, 3, 3, 3, -165, 25], ['l', 5.72, 4.27, 0, 10], ['l', 0, 10, 6, 10]] },
  '3': { w: 6, s: [['e', 3, 2.5, 2.8, 2.5, -160, 90], ['e', 3, 7.5, 3.1, 2.5, -90, 160]] },
  '4': { w: 6.4, s: [['l', 4.6, 10, 4.6, 0], ['l', 4.6, 0, 0, 7], ['l', 0, 7, 6.4, 7]] },
  '5': { w: 6, s: [['l', 5.6, 0, 1.2, 0], ['l', 1.2, 0, 1.0, 4.4], ['e', 2.9, 6.9, 3, 3.1, -125, 145]] },
  '6': { w: 6.2, s: [['l', 4.8, 0, 0.5, 5.8], ['e', 3.1, 6.9, 3.1, 3.1, -180, 180]] },
  '7': { w: 6, s: [['l', 0, 0, 6, 0], ['l', 6, 0, 2, 10]] },
  '8': { w: 6.2, s: [['e', 3.1, 2.5, 2.7, 2.5, -90, 270], ['e', 3.1, 7.5, 3.1, 2.5, -90, 270]] },
  '9': { w: 6.2, s: [['e', 3.1, 3.1, 3.1, 3.1, 0, 360], ['l', 6.2, 3.1, 1.6, 10]] },
  '-': { w: 3.6, s: [['l', 0, 5.6, 3.6, 5.6]] },
  '.': { w: 0, s: [['p', 0, 10]] },
  "'": { w: 0, s: [['l', 0, 0, 0, 2.6]] },
}

const TRACK = 3.3
const SPACE = 4.4

function segPoint(s: Seg, t: number): [number, number] {
  if (s[0] === 'l') return [s[1] + (s[3] - s[1]) * t, s[2] + (s[4] - s[2]) * t]
  if (s[0] === 'e') {
    const a = ((s[5] + (s[6] - s[5]) * t) * Math.PI) / 180
    return [s[1] + s[3] * Math.cos(a), s[2] + s[4] * Math.sin(a)]
  }
  return [s[1], s[2]]
}

function segLength(s: Seg): number {
  if (s[0] === 'p') return 0
  let len = 0
  let prev = segPoint(s, 0)
  for (let i = 1; i <= 40; i++) {
    const p = segPoint(s, i / 40)
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1])
    prev = p
  }
  return len
}

function segPath(s: Seg, dx: number, dy: number): string {
  const P = (p: [number, number]) => `${f2(p[0] + dx)} ${f2(p[1] + dy)}`
  if (s[0] === 'l') return `M${P([s[1], s[2]])} L${P([s[3], s[4]])}`
  if (s[0] === 'p') return `M${P([s[1], s[2]])} l0 0`
  const delta = s[6] - s[5]
  if (Math.abs(delta) >= 360) return `M${P(segPoint(s, 0))} A${s[3]} ${s[4]} 0 1 1 ${P(segPoint(s, 0.5))} A${s[3]} ${s[4]} 0 1 1 ${P(segPoint(s, 1))}`
  return `M${P(segPoint(s, 0))} A${s[3]} ${s[4]} 0 ${Math.abs(delta) > 180 ? 1 : 0} ${delta > 0 ? 1 : 0} ${P(segPoint(s, 1))}`
}

/** Bulb positions along a glyph's strokes, evenly spaced, joints shared. */
function glyphBulbs(g: Glyph, step: number): [number, number][] {
  const out: [number, number][] = []
  const add = (p: [number, number]) => {
    if (!out.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < step * 0.55)) out.push(p)
  }
  for (const s of g.s) {
    if (s[0] === 'p') {
      add([s[1], s[2]])
      continue
    }
    const n = Math.max(1, Math.round(segLength(s) / step))
    for (let i = 0; i <= n; i++) add(segPoint(s, i / n))
  }
  return out
}

interface Laid {
  width: number
  glyphs: { g: Glyph; x: number }[]
}

/** Lay a word out in the marquee alphabet; null when a character can't be drawn. */
function layWord(text: string): Laid | null {
  const chars = text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[’‘]/g, "'").trim()
  if (!chars) return null
  const glyphs: Laid['glyphs'] = []
  let x = 0
  for (const ch of chars) {
    if (ch === ' ') {
      x += SPACE
      continue
    }
    const g = GLYPHS[ch]
    if (!g) return null
    glyphs.push({ g, x })
    x += g.w + TRACK
  }
  return { width: x - TRACK, glyphs }
}

type BulbSets = { steady: string[]; twA: string[]; twB: string[] }

/** Paths and bulbs for one laid-out word at (dx, dy). */
function wordArt(laid: Laid, dx: number, dy: number, step = 1.62) {
  const d = laid.glyphs.map(({ g, x }) => g.s.map((s) => segPath(s, dx + x, dy)).join(' ')).join(' ')
  const bulbs: BulbSets = { steady: [], twA: [], twB: [] }
  let k = 0
  for (const { g, x } of laid.glyphs) {
    for (const [bx, by] of glyphBulbs(g, step)) {
      const key = `${f2(bx + dx + x)},${f2(by + dy)}`
      if (k % 7 === 2) bulbs.twA.push(key)
      else if (k % 7 === 5) bulbs.twB.push(key)
      else bulbs.steady.push(key)
      k++
    }
  }
  return { d, bulbs }
}

function Bulbs({ list, r, className, style }: { list: string[]; r: number; className?: string; style?: CSSProperties }) {
  return (
    <g className={className} style={style}>
      {list.map((p) => {
        const [x, y] = p.split(',')
        return (
          <g key={p}>
            <circle cx={x} cy={y} r={f2(r * 1.9)} fill="rgba(255,206,110,0.22)" />
            <circle cx={x} cy={y} r={f2(r)} fill={C.bulb} />
          </g>
        )
      })}
    </g>
  )
}

/** Channel letters: a shadowed depth, a gold rim, a magenta face, then bulbs. */
function Letters({ d, bulbs, on, lit = true }: { d: string; bulbs: BulbSets; on: boolean; lit?: boolean }) {
  const all = [...bulbs.steady, ...bulbs.twA, ...bulbs.twB]
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#4A0A2A" strokeWidth="2.7" transform="translate(0.32 0.42)" />
      <path d={d} stroke={C.goldDeep} strokeWidth="2.75" />
      <path d={d} stroke="#C4246C" strokeWidth="2.15" />
      {/* Unlit sockets, visible before the sign comes on. */}
      <g fill="#5C2A40" stroke="none">
        {all.map((p) => {
          const [x, y] = p.split(',')
          return <circle key={p} cx={x} cy={y} r="0.5" />
        })}
      </g>
      {lit && (
        <g className={on ? 'sn-on' : undefined}>
          <Bulbs list={bulbs.steady} r={0.46} />
          <Bulbs list={bulbs.twA} r={0.46} className="sn-tw" />
          <Bulbs list={bulbs.twB} r={0.46} className="sn-tw" style={{ animationDelay: '1.1s' }} />
        </g>
      )}
    </g>
  )
}

/** Chase bulbs round a rectangle, in three alternating circuits. */
function chase(x: number, y: number, w: number, h: number, gap: number) {
  const per = 2 * (w + h)
  const n = Math.round(per / gap)
  const sets: string[][] = [[], [], []]
  for (let i = 0; i < n; i++) {
    let t = (i / n) * per
    let px: number
    let py: number
    if (t < w) [px, py] = [x + t, y]
    else if ((t -= w) < h) [px, py] = [x + w, y + t]
    else if ((t -= h) < w) [px, py] = [x + w - t, y + h]
    else [px, py] = [x, y + h - (t - w)]
    sets[i % 3].push(`${f2(px)},${f2(py)}`)
  }
  return sets
}

/** The marquee: names in bulb letters on a plum board with a running chase. */
function MarqueeBoard({ top, bottom, animate }: { top: string; bottom: string; animate: boolean }) {
  const a = layWord(top)
  const b = layWord(bottom)
  if (!a || !b) return <FallbackBoard top={top} bottom={bottom} />
  const PX = 6.4
  const PY = 6.6
  const W = Math.max(a.width, b.width, 22) + PX * 2
  const ampY = PY + 10 + 4.6
  const y2 = PY + 10 + 9.2
  const H = y2 + 10 + PY
  const artA = wordArt(a, (W - a.width) / 2, PY)
  const artB = wordArt(b, (W - b.width) / 2, y2)
  const rail = chase(2, 2, W - 4, H - 4, 2.35)
  return (
    <svg viewBox={`-0.5 -0.5 ${f2(W + 1)} ${f2(H + 1)}`} className="block w-full" role="img" aria-label={`${top} and ${bottom}`}>
      <rect x="0" y="0" width={f2(W)} height={f2(H)} rx="3.2" fill={C.plumDeep} stroke={C.goldDeep} strokeWidth="0.5" />
      <rect x="3.8" y="3.8" width={f2(W - 7.6)} height={f2(H - 7.6)} rx="1.6" fill={C.plum} stroke={C.gold} strokeWidth="0.22" opacity="0.9" />
      <g fill="#5C2A40">
        {rail.flat().map((p) => {
          const [x, y] = p.split(',')
          return <circle key={p} cx={x} cy={y} r="0.5" />
        })}
      </g>
      {rail.map((set, i) => (
        <Bulbs key={i} list={set} r={0.5} className="sn-chase" style={{ animationDelay: `${-i * 0.4}s` }} />
      ))}
      <Letters d={artA.d} bulbs={artA.bulbs} on={animate} />
      <text x={f2(W / 2)} y={f2(ampY + 2.6)} textAnchor="middle" fill={C.gold} style={{ fontFamily: sans, fontSize: 7.6, fontWeight: 700, fontStyle: 'italic' }}>
        &amp;
      </text>
      <Letters d={artB.d} bulbs={artB.bulbs} on={animate} />
    </svg>
  )
}

/** For names the alphabet can't spell (other scripts): a bulb-dotted board. */
function FallbackBoard({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="rounded-[14px] p-[7px]" style={{ background: C.plumDeep, border: `2px solid ${C.goldDeep}` }}>
      <div className="rounded-[9px] px-5 py-7 text-center" style={{ background: C.plum, border: `5px dotted ${C.bulb}` }}>
        <p className="leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(40px, 13cqi, 64px)', color: C.bulb }}>{top}</p>
        <p style={{ fontFamily: display, fontSize: 30, color: C.gold }}>&amp;</p>
        <p className="leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(40px, 13cqi, 64px)', color: C.bulb }}>{bottom}</p>
      </div>
    </div>
  )
}

/** Digits (or any short word) in bulbs, without a board — for the countdown. */
function BulbWord({ text, className }: { text: string; className?: string }) {
  const laid = layWord(text)
  if (!laid) return null
  const art = wordArt(laid, 1.6, 1.6, 1.55)
  return (
    <svg viewBox={`0 0 ${f2(laid.width + 3.2)} 13.2`} className={className} aria-hidden>
      <Letters d={art.d} bulbs={art.bulbs} on={false} />
    </svg>
  )
}

// ─── Mirror ball ─────────────────────────────────────────────────────────────

const BALL_TONES = ['#241A33', '#3E3150', '#6B5E80', '#A89DB8', '#DCD5E6', '#FFFFFF']

function MirrorBall({ className, style }: { className?: string; style?: CSSProperties }) {
  const r = rng(17)
  const R = 44
  const rad = Math.PI / 180
  const L = [-0.52, -0.6, 0.6]
  const facets: { pts: string; fill: string }[] = []
  for (let lat = -84; lat < 84; lat += 12) {
    for (let lon = -90; lon < 90; lon += 12) {
      const corners = [
        [lat, lon],
        [lat, lon + 12],
        [lat + 12, lon + 12],
        [lat + 12, lon],
      ].map(([la, lo]) => [R * Math.cos(la * rad) * Math.sin(lo * rad), R * Math.sin(la * rad)])
      const cx = corners.reduce((s, p) => s + p[0], 0) / 4
      const cy = corners.reduce((s, p) => s + p[1], 0) / 4
      const pts = corners.map(([x, y]) => `${f2(cx + (x - cx) * 0.86)},${f2(cy + (y - cy) * 0.86)}`).join(' ')
      const la = (lat + 6) * rad
      const lo = (lon + 6) * rad
      const b = Math.cos(la) * Math.sin(lo) * L[0] + Math.sin(la) * L[1] + Math.cos(la) * Math.cos(lo) * L[2]
      const roll = r()
      let fill = BALL_TONES[Math.max(0, Math.min(5, Math.floor((b + (r() - 0.5) * 0.5 + 0.45) * 3.4)))]
      if (roll < 0.06) fill = C.magenta
      else if (roll < 0.11) fill = C.gold
      facets.push({ pts, fill })
    }
  }
  const star = 'M0 -9 L1.1 -1.1 L9 0 L1.1 1.1 L0 9 L-1.1 1.1 L-9 0 L-1.1 -1.1Z'
  return (
    <svg viewBox="-52 -100 104 152" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <path d="M0 -100 L0 -50" stroke={C.goldDeep} strokeWidth="1" />
      <rect x="-5" y="-51" width="10" height="7" rx="1.5" fill={C.goldDeep} />
      <circle r={R} fill="#140E1E" />
      {facets.map((f, i) => (
        <polygon key={i} points={f.pts} fill={f.fill} />
      ))}
      <path d={star} fill="#FFFFFF" transform="translate(-18 -20) scale(1.2)" />
      <path d={star} fill="#FFFFFF" transform="translate(12 -30) scale(0.6)" opacity="0.9" />
      <path d={star} fill="#FFF3C8" transform="translate(-30 6) scale(0.5)" opacity="0.8" />
    </svg>
  )
}

/** Hard-edged beams off the ball, printed a shade lighter than the night. */
function Beams({ className }: { className?: string }) {
  const wedges = Array.from({ length: 18 }, (_, i) => {
    const a0 = ((i * 20 - 4) * Math.PI) / 180
    const a1 = ((i * 20 + 4 + (i % 3)) * Math.PI) / 180
    const R = 1400
    return {
      d: `M200 96 L${f2(200 + R * Math.cos(a0))} ${f2(96 + R * Math.sin(a0))} L${f2(200 + R * Math.cos(a1))} ${f2(96 + R * Math.sin(a1))}Z`,
      fill: i % 4 === 1 ? 'rgba(217,46,124,0.07)' : 'rgba(241,193,79,0.05)',
    }
  })
  return (
    <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden>
      {wedges.map((w, i) => (
        <path key={i} d={w.d} fill={w.fill} />
      ))}
    </svg>
  )
}

// ─── Letterboard ─────────────────────────────────────────────────────────────

/** Hand-placed changeable letters: each sits a hair off true. */
function BoardText({ text, seed }: { text: string; seed: number }) {
  const r = rng(seed)
  return (
    <>
      {text
        .toUpperCase()
        .split(/\s+/)
        .filter(Boolean)
        .map((word, wi) => (
          <span key={wi}>
            {wi > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span
                  key={ci}
                  className="inline-block"
                  style={{ transform: `translateY(${f2((r() - 0.5) * 1.6)}px) rotate(${f2((r() - 0.5) * 3)}deg)` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
    </>
  )
}

// ─── Small pieces ────────────────────────────────────────────────────────────

function Note({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 34" className={className} style={style} aria-hidden>
      <path d="M9 26 V6 L27 2 V22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M9 10 L27 6" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="5.4" cy="26.5" rx="5" ry="3.8" transform="rotate(-18 5.4 26.5)" fill="currentColor" />
      <ellipse cx="23.4" cy="22.5" rx="5" ry="3.8" transform="rotate(-18 23.4 22.5)" fill="currentColor" />
    </svg>
  )
}

/** A bulb-edged arrow sign pointing the way. */
function ArrowSign({ children }: { children: ReactNode }) {
  const outline: [number, number][] = [
    [6, 10], [196, 10], [196, 2], [234, 36], [196, 70], [196, 62], [6, 62],
  ]
  const bulbs: string[] = []
  outline.forEach((p, i) => {
    const q = outline[(i + 1) % outline.length]
    const len = Math.hypot(q[0] - p[0], q[1] - p[1])
    const n = Math.max(1, Math.round(len / 11))
    for (let k = 0; k < n; k++) bulbs.push(`${f2(p[0] + ((q[0] - p[0]) * k) / n)},${f2(p[1] + ((q[1] - p[1]) * k) / n)}`)
  })
  return (
    <span className="relative inline-block w-[240px] max-w-full">
      <svg viewBox="0 0 240 72" className="block w-full" aria-hidden>
        <path d={`M${outline.map((p) => p.join(' ')).join(' L')}Z`} fill={C.magenta} stroke={C.gold} strokeWidth="1.5" strokeLinejoin="round" />
        {[0, 1, 2].map((g) => (
          <Bulbs key={g} list={bulbs.filter((_, i) => i % 3 === g)} r={2.3} className="sn-chase" style={{ animationDelay: `${-g * 0.4}s` }} />
        ))}
      </svg>
      <span className="absolute inset-0 flex items-center pl-7 pr-12" style={{ fontFamily: display, fontSize: 24, color: '#FFFFFF' }}>
        {children}
      </span>
    </span>
  )
}

function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-center leading-[1.02] ${className}`} style={{ fontFamily: display, fontSize: 'clamp(36px, 11cqi, 48px)', color: C.gold }}>
      {children}
    </h2>
  )
}

export default function SangeetNight({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Isha'
  const groom = data.groomName?.trim() || 'Dev'
  const couple = `${bride} & ${groom}`
  const animate = !isPreview
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 7), [data.galleryImages])
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`Sangeet — ${couple}`, data.date, data.time, place || undefined, 5)
  const hashtag = data.hashtag?.trim() ? (data.hashtag.trim().startsWith('#') ? data.hashtag.trim() : `#${data.hashtag.trim()}`) : ''

  const [lead, ...rest] = photos

  return (
    <div
      className="sn relative overflow-x-hidden"
      style={{ background: C.night, color: C.cream, fontFamily: sans, containerType: 'inline-size' }}
    >
      <style>{`
        .sn .sn-on { opacity: 0; animation: sn-on 1.5s linear forwards 450ms; }
        .sn .sn-tw { animation: sn-tw 3.2s steps(2, jump-none) infinite 2s; }
        .sn .sn-chase { animation: sn-chase 1.2s steps(1, end) infinite; }
        .sn .sn-drop { transform: translateY(-40%); animation: sn-drop 1.4s cubic-bezier(.3,1.35,.5,1) forwards 100ms; }
        .sn .sn-btn:hover { filter: brightness(1.08); }
        @keyframes sn-on { 0% { opacity: 0 } 7% { opacity: .85 } 11% { opacity: .1 } 19% { opacity: 1 } 24% { opacity: .35 } 31% { opacity: 1 } 100% { opacity: 1 } }
        @keyframes sn-tw { 0%, 100% { opacity: 1 } 50% { opacity: .55 } }
        @keyframes sn-chase { 0% { opacity: 1 } 33.3% { opacity: .18 } 66.6% { opacity: .18 } }
        @keyframes sn-drop { to { transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .sn .sn-on, .sn .sn-tw, .sn .sn-chase, .sn .sn-drop { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.cream} background="rgba(26,12,38,0.85)" border={C.line} />

      {/* ── The poster ───────────────────────────────────────────── */}
      <header
        className="relative flex flex-col items-center overflow-hidden px-5 pb-10 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh', background: `linear-gradient(180deg, ${C.night} 0%, #1C0D2A 70%, ${C.night} 100%)` }}
      >
        <Beams className="pointer-events-none absolute inset-0 h-full w-full" />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={grain(0.08)} />

        <MirrorBall className={`relative -mt-[2px] w-[96px] ${animate ? 'sn-drop' : ''}`} />

        <p className="relative mt-3 text-[13px] font-semibold uppercase" style={{ letterSpacing: '0.3em', color: C.gold }}>
          The families present
        </p>

        <div className="relative mt-5 w-full max-w-[25rem]">
          <MarqueeBoard top={bride} bottom={groom} animate={animate} />
        </div>

        <h1
          className="relative mt-7 leading-[0.9]"
          style={{
            fontFamily: display,
            fontSize: 'clamp(58px, 19cqi, 92px)',
            color: C.gold,
            textShadow: `1px 1px 0 ${C.magentaDeep}, 2px 2px 0 ${C.magentaDeep}, 3px 3px 0 ${C.magentaDeep}, 4px 4px 0 ${C.magentaDeep}, 5px 5px 0 #6A0E3B`,
          }}
        >
          Sangeet
        </h1>
        <p className="relative mt-3 text-[17px] italic" style={{ color: C.creamSoft }}>
          an evening of music &amp; dance
        </p>

        <div className="relative mt-7 w-full max-w-[22rem] border-y py-4" style={{ borderColor: C.line }}>
          <p className="font-semibold uppercase" style={{ letterSpacing: '0.07em', fontSize: 'clamp(15px, 4.7cqi, 18px)' }}>
            {date ? `${date.weekday} · ${date.day} ${date.month}` : 'Date to be announced'}
          </p>
          {time && (
            <p className="mt-1 text-[17px] font-semibold uppercase" style={{ letterSpacing: '0.1em', color: C.gold }}>
              {time} onwards
            </p>
          )}
          {data.venue && (
            <p className="mt-2 text-[21px] leading-[1.2]" style={{ fontFamily: display }}>
              {data.venue}
            </p>
          )}
        </div>
      </header>

      {/* ── The tagline ──────────────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pb-6 pt-14 text-center">
          <p className="leading-none" style={{ fontFamily: display, fontSize: 64, color: C.magenta, height: 34 }} aria-hidden>
            &ldquo;
          </p>
          <p className="text-[22px] italic leading-[1.45]" style={{ fontWeight: 300 }}>
            {data.message}
          </p>
          <p className="mt-4 text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.2em', color: C.gold }}>
            {couple}
          </p>
        </Reveal>
      )}

      {/* ── The line-up, on a letterboard ────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-5 py-12">
          <Heading>The line-up</Heading>
          <div
            className="mt-7 rounded-[12px] px-[9px] py-[24px]"
            style={{
              background: '#0B0612',
              backgroundImage: `radial-gradient(circle, ${C.bulb} 0 3.6px, rgba(255,206,110,0.22) 4.6px 6.4px, transparent 7px), radial-gradient(circle, ${C.bulb} 0 3.6px, rgba(255,206,110,0.22) 4.6px 6.4px, transparent 7px)`,
              backgroundSize: '22px 22px, 22px 22px',
              backgroundRepeat: 'space no-repeat, space no-repeat',
              backgroundPosition: '0 1px, 0 calc(100% - 1px)',
              border: `1px solid ${C.goldDeep}`,
              boxShadow: '0 20px 40px -24px rgba(0,0,0,0.8)',
            }}
          >
            <div
              className="rounded-[5px] px-4 py-[14px]"
              style={{
                background: C.board,
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%, rgba(120,80,30,0.08)), repeating-linear-gradient(180deg, transparent 0 29px, rgba(70,40,20,0.2) 29px 30.5px, rgba(255,255,255,0.8) 30.5px 31.5px, transparent 31.5px 36px)',
                backgroundPosition: '0 14px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 10px 22px -12px rgba(120,70,20,0.35)',
                color: C.boardInk,
              }}
            >
              <ol className="text-[19px] font-bold" style={{ lineHeight: '36px', letterSpacing: '0.06em' }}>
                {schedule.map((item, i) => (
                  <li key={`${item.title}-${i}`}>
                    {item.time && (
                      <p style={{ color: C.magentaDeep }}>
                        <BoardText text={item.time} seed={i * 13 + 1} />
                      </p>
                    )}
                    <p>
                      <BoardText text={item.title} seed={i * 13 + 7} />
                    </p>
                    {item.note && (
                      <p className="text-[15px]" style={{ color: 'rgba(27,16,34,0.7)' }}>
                        <BoardText text={item.note} seed={i * 13 + 9} />
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {data.dressCode && (
            <div className="mt-9 text-center">
              <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.24em', color: C.creamSoft }}>
                Dress code
              </p>
              <p className="mt-1.5 leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 36px)', color: C.magenta }}>
                {data.dressCode}
              </p>
            </div>
          )}
        </Reveal>
      )}

      {/* When there is no line-up, the dress code still gets its moment. */}
      {schedule.length === 0 && data.dressCode && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-10 text-center">
          <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.24em', color: C.creamSoft }}>Dress code</p>
          <p className="mt-1.5 leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 36px)', color: C.magenta }}>{data.dressCode}</p>
        </Reveal>
      )}

      {/* ── Countdown, in bulbs ──────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-12 text-center">
          <p className="text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.26em', color: C.gold }}>
            Curtain up in
          </p>
          <BulbWord text={String(countdown.days)} className="mx-auto mt-4 h-[104px] max-w-full" />
          <p className="mt-3 text-[22px]" style={{ fontFamily: display }}>
            {countdown.days === 1 ? 'day' : 'days'}
          </p>
          <p className="mt-2 text-[15px] tabular-nums" style={{ color: C.creamSoft, letterSpacing: '0.06em' }}>
            {countdown.hours} hr · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
          </p>
        </Reveal>
      )}

      {/* ── Backstage: photographs ───────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-5 py-12">
          <Reveal disabled={isPreview}>
            <Heading>Backstage</Heading>
          </Reveal>
          {lead && (
            <Reveal disabled={isPreview} className="mt-7">
              <figure
                className="rounded-[16px] p-[24px]"
                style={{
                  background: C.plumDeep,
                  backgroundImage: `radial-gradient(circle, ${C.bulb} 0 4.2px, rgba(255,206,110,0.25) 5.2px 7px, transparent 7.5px)`,
                  backgroundSize: '24px 24px',
                  backgroundRepeat: 'space',
                  border: `1.5px solid ${C.goldDeep}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lead} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-[6px] object-cover" style={{ boxShadow: `0 0 0 3px ${C.plum}, 0 0 0 4px ${C.gold}` }} />
              </figure>
            </Reveal>
          )}
          {rest.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {rest.map((src, i) => (
                <Reveal
                  key={`${src}-${i}`}
                  disabled={isPreview}
                  delay={(i % 2) * 90}
                  className={rest.length % 2 === 1 && i === rest.length - 1 ? 'col-span-2 aspect-[3/2]' : 'aspect-square'}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full rounded-[6px] object-cover" style={{ border: `1px solid ${C.goldDeep}` }} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Where ────────────────────────────────────────────────── */}
      <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 py-12 text-center">
        <Note className="mx-auto w-[26px]" style={{ color: C.magenta }} />
        <p className="mt-4 text-[14px] font-semibold uppercase" style={{ letterSpacing: '0.24em', color: C.creamSoft }}>
          Live at
        </p>
        <h2 className="mt-2 leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(34px, 10.5cqi, 46px)', color: C.cream }}>
          {data.venue || 'The venue'}
        </h2>
        {data.venueAddress && (
          <p className="mx-auto mt-3 max-w-[20rem] text-[16px] leading-[1.5]" style={{ color: C.creamSoft }}>
            {data.venueAddress}
          </p>
        )}
        <p className="mt-3 text-[16px] font-semibold" style={{ color: C.gold }}>
          {date ? date.long : 'Date to be announced'}
          {time && ` · ${time}`}
        </p>
        <div className="mt-7 flex flex-col items-center gap-4">
          <DirectionsLink href={directions} isPreview={isPreview} className="sn-btn inline-block">
            <ArrowSign>Directions</ArrowSign>
          </DirectionsLink>
          {calendar && (
            <a
              href={isPreview ? undefined : calendar}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={isPreview || undefined}
              className="sn-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 text-[15px] font-semibold uppercase"
              style={{ border: `1.5px solid ${C.gold}`, color: C.gold, letterSpacing: '0.1em' }}
            >
              Add to calendar
            </a>
          )}
        </div>
      </Reveal>

      {hashtag && (
        <Reveal disabled={isPreview} as="section" className="px-6 pb-12 text-center">
          <p className="text-[16px] italic" style={{ color: C.creamSoft }}>
            Tag every step you post
          </p>
          <p className="mt-2 break-words leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 38px)', color: C.magenta }}>
            {hashtag}
          </p>
        </Reveal>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: C.line }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Cheers for the couple"
            intro={`Leave a few words for ${bride} and ${groom}. Your wish appears here for every guest.`}
          />
        </div>
      )}

      <footer className="px-6 pb-10 pt-12 text-center">
        <MirrorBall className="mx-auto w-[46px]" />
        <p className="mt-4 text-[26px]" style={{ fontFamily: display, color: C.gold }}>
          {couple}
        </p>
        {date && (
          <p className="mt-1 text-[13px] font-semibold uppercase tabular-nums" style={{ letterSpacing: '0.3em', color: C.creamFaint }}>
            {date.dayPadded} · {date.monthShort} · {date.year}
          </p>
        )}
        <div className="mt-8">
          <Credit isPreview={isPreview} color={C.creamFaint} linkColor={C.cream} />
        </div>
      </footer>
    </div>
  )
}
