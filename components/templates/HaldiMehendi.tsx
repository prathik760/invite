'use client'

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { shrikhand } from './kit/fonts/shrikhand'
import { cormorant } from './kit/fonts/cormorant'
import { mukta } from './kit/fonts/mukta'
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
  type DateParts,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Haldi & Mehendi — two functions, two moods, one card.
 * The top of the page is the Haldi: turmeric ground, thrown marigolds, a
 * brass urli of paste and fat, happy splashes, set in a juicy Shrikhand. It
 * spills over a soft edge into the Mehendi: henna green, and everything drawn
 * in one fine cream line the way a mehendi cone draws — paisley, mandala and
 * a hennaed palm with the couple's initials hidden in it. On arrival the
 * splashes land and the henna lines trace themselves in.
 */

const C = {
  haldi: '#F2B226',
  haldiDeep: '#E6980F',
  paste: '#EC9412',
  marigold: '#E4700D',
  ink: '#3A2511',
  inkSoft: 'rgba(58,37,17,0.72)',
  paper: '#FBF2DC',
  card: '#FFF9EA',
  cream: '#FFF4DA',
  creamSoft: 'rgba(255,244,218,0.78)',
  creamLine: 'rgba(255,244,218,0.55)',
  henna: '#3E5A28',
  hennaDeep: '#2F4620',
  leaf: '#5E7F2A',
  rule: '#EAD6A8',
}

const display = shrikhand.style.fontFamily
const serif = cormorant.style.fontFamily
const sans = mukta.style.fontFamily

const WISHES_THEME: InviteTheme = {
  bg: C.paper,
  surface: C.card,
  ink: C.ink,
  muted: C.inkSoft,
  line: C.rule,
  accent: C.henna,
  onAccent: C.cream,
  heading: serif,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 500, fontSize: 40, lineHeight: 1.05 },
}

// ─── Drawing helpers ─────────────────────────────────────────────────────────

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const f1 = (n: number) => n.toFixed(1)
const polar = (r: number, a: number, cx = 0, cy = 0): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)]

/** A closed Catmull-Rom curve through the points, as cubic Béziers. */
function smoothClosed(pts: [number, number][]): string {
  const n = pts.length
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return `${d}Z`
}

/** Add hours to "HH:mm" (for a calendar end/start guess). */
function addHours(time: string | undefined, h: number): string | undefined {
  if (!time || !/^\d{1,2}:\d{2}/.test(time)) return undefined
  const [hh, mm] = time.split(':').map(Number)
  return `${pad2(Math.min(23, hh + h))}:${pad2(mm)}`
}

// ─── Haldi: flat gouache shapes, no outlines ─────────────────────────────────

/**
 * A splat of turmeric paste: a round body, a few flung fingers that end in a
 * bead, and droplets thrown on past them.
 */
function Splash({ seed, color, className, style, fingers = 6 }: { seed: number; color: string; className?: string; style?: CSSProperties; fingers?: number }) {
  const r = rng(seed)
  const n = 20
  const flung = new Set<number>()
  while (flung.size < fingers) flung.add(Math.floor(r() * n))
  const pts: [number, number][] = []
  const tips: { x: number; y: number; r: number }[] = []
  const drops: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.12
    const body = 25 + r() * 4
    if (flung.has(i)) {
      const len = 34 + r() * 12
      pts.push(polar(body + 1, a - 0.075, 50, 50), polar(len, a, 50, 50), polar(body + 1, a + 0.075, 50, 50))
      const [tx, ty] = polar(len - 0.5, a, 50, 50)
      tips.push({ x: tx, y: ty, r: 2.2 + r() * 1.4 })
      const [dx, dy] = polar(len + 5 + r() * 6, a + (r() - 0.5) * 0.1, 50, 50)
      drops.push({ x: dx, y: dy, r: 0.9 + r() * 1.6 })
    } else {
      pts.push(polar(body, a, 50, 50))
    }
  }
  for (let i = 0; i < 4; i++) {
    const [x, y] = polar(36 + r() * 12, r() * Math.PI * 2, 50, 50)
    drops.push({ x, y, r: 0.8 + r() * 1.4 })
  }
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <path d={smoothClosed(pts)} fill={color} />
      {[...tips, ...drops].map((d, i) => (
        <circle key={i} cx={f1(d.x)} cy={f1(d.y)} r={f1(d.r)} fill={color} />
      ))}
    </svg>
  )
}

const MARIGOLD = ['#D35608', '#E46E0E', '#EF8818', '#F6A228', '#8F3A06']

/** A marigold head seen from above: four ruffled rings of petals. */
function Marigold({ seed, className, style }: { seed: number; className?: string; style?: CSSProperties }) {
  const r = rng(seed)
  const rings = [
    { R: 48, n: 17, c: MARIGOLD[0] },
    { R: 38, n: 15, c: MARIGOLD[1] },
    { R: 27, n: 12, c: MARIGOLD[2] },
    { R: 16, n: 9, c: MARIGOLD[3] },
  ]
  return (
    <svg viewBox="-50 -50 100 100" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      {rings.map((ring, k) => {
        const rot = r() * Math.PI * 2
        const span = (Math.PI * 2) / ring.n
        const valleys = Array.from({ length: ring.n }, () => ring.R * (0.74 + r() * 0.08))
        const peaks = Array.from({ length: ring.n }, () => ring.R * (0.94 + r() * 0.12))
        let d = ''
        for (let i = 0; i < ring.n; i++) {
          const a0 = rot + i * span
          const a1 = a0 + span
          const [x0, y0] = polar(valleys[i], a0)
          const [x1, y1] = polar(valleys[(i + 1) % ring.n], a1)
          const [c1x, c1y] = polar(peaks[i] * 1.06, a0 + span * 0.12)
          const [c2x, c2y] = polar(peaks[i] * 1.06, a1 - span * 0.12)
          d += `${i === 0 ? `M${f1(x0)} ${f1(y0)}` : ''} C${f1(c1x)} ${f1(c1y)} ${f1(c2x)} ${f1(c2y)} ${f1(x1)} ${f1(y1)}`
        }
        return (
          <g key={k}>
            <path d={`${d}Z`} fill={ring.c} />
            {k < 3 &&
              Array.from({ length: ring.n }, (_, i) => {
                const a = rot + (i + 0.5) * span
                const [ax, ay] = polar(ring.R * 0.5, a)
                const [bx, by] = polar(ring.R * (0.8 + r() * 0.1), a)
                return <path key={i} d={`M${f1(ax)} ${f1(ay)} L${f1(bx)} ${f1(by)}`} stroke={MARIGOLD[4]} strokeWidth="0.9" opacity="0.28" strokeLinecap="round" />
              })}
          </g>
        )
      })}
      <circle r="6.5" fill={MARIGOLD[4]} opacity="0.85" />
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = polar(3.2, i + r())
        return <circle key={i} cx={f1(x)} cy={f1(y)} r="1.1" fill={MARIGOLD[3]} />
      })}
    </svg>
  )
}

/** A loose marigold petal. */
function Petal({ x, y, rot, s = 1, color = MARIGOLD[1] }: { x: string; y: string; rot: number; s?: number; color?: string }) {
  return (
    <svg viewBox="0 0 20 14" className="absolute" style={{ left: x, top: y, width: 18 * s, transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M2 8 C 3 2, 13 0, 18 4 C 17 6, 18 8, 16 10 C 12 13, 4 13, 2 8Z" fill={color} />
    </svg>
  )
}

/** A brass urli heaped with haldi paste, two betel leaves tucked behind it. */
function Urli({ className, style, shadow = '#8A5406' }: { className?: string; style?: CSSProperties; shadow?: string }) {
  const scallops = Array.from({ length: 15 }, (_, i) => {
    const t0 = i / 15
    const t1 = (i + 1) / 15
    const at = (t: number): [number, number] => [34 + 152 * t, 72 + 16 * (1 - (2 * t - 1) ** 2)]
    const [x0, y0] = at(t0)
    const [x1, y1] = at(t1)
    return `M${f1(x0)} ${f1(y0)} Q${f1((x0 + x1) / 2)} ${f1((y0 + y1) / 2 + 6)} ${f1(x1)} ${f1(y1)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 220 130" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <ellipse cx="110" cy="119" rx="78" ry="6" fill={shadow} opacity="0.3" />
      {/* Betel leaves, behind the rim */}
      <g transform="translate(176 50) rotate(38)">
        <path d="M0 0 C -15 -8, -20 -32, 0 -50 C 20 -32, 15 -8, 0 0Z" fill={C.henna} />
        <path d="M0 -2 L0 -44 M0 -14 L-9 -26 M0 -14 L9 -26 M0 -28 L-6 -38 M0 -28 L6 -38" stroke="#7E9C45" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(186 56) rotate(70)">
        <path d="M0 0 C -13 -7, -17 -28, 0 -43 C 17 -28, 13 -7, 0 0Z" fill={C.leaf} />
        <path d="M0 -2 L0 -38 M0 -12 L-8 -22 M0 -12 L8 -22" stroke="#93B055" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
      <path d="M88 106 L132 106 L139 117 L81 117Z" fill="#9E620D" />
      <path d="M18 52 C 24 92, 64 110, 110 110 C 156 110, 196 92, 202 52 Z" fill="#C8861B" />
      <path d="M22 64 C 40 98, 76 110, 110 110 C 144 110, 180 98, 198 64 C 168 90, 52 90, 22 64Z" fill="#9E620D" opacity="0.55" />
      <path d={scallops} stroke="#8E5608" strokeWidth="1.3" fill="none" opacity="0.7" />
      <path d="M40 72 C 48 84, 58 92, 74 98" stroke="#F3CE78" strokeWidth="3.6" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="110" cy="52" rx="92" ry="15" fill="#E4AA3C" />
      <ellipse cx="110" cy="53.5" rx="82" ry="10.5" fill="#94590C" />
      <path d="M32 54 C 44 38, 74 34, 96 39 C 118 30, 152 35, 170 43 C 182 47, 188 52, 188 54 C 160 63, 60 63, 32 54Z" fill={C.paste} />
      <path d="M66 47 C 82 38, 112 40, 121 45 C 129 50, 113 54, 100 50" stroke="#FFCF63" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M140 44 C 150 42, 160 44, 164 47" stroke="#FFCF63" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="82" cy="51" rx="4" ry="2.2" fill={MARIGOLD[0]} transform="rotate(-20 82 51)" />
      <ellipse cx="148" cy="50" rx="3.6" ry="2" fill={MARIGOLD[1]} transform="rotate(25 148 50)" />
      <ellipse cx="120" cy="55" rx="3.2" ry="1.8" fill={MARIGOLD[0]} transform="rotate(5 120 55)" />
    </svg>
  )
}

// ─── Mehendi: one fine cream line, as a cone draws ───────────────────────────

const PAISLEY =
  'M48 142 C 22 142, 6 122, 6 98 C 6 70, 26 54, 44 42 C 60 31, 70 20, 66 7 C 86 17, 95 41, 93 69 C 92 100, 90 122, 76 134 C 68 140, 58 142, 48 142 Z'

/** A paisley (keri) with an inner paisley, ribs, a dotted outline and a curled tip. */
function Paisley({ color, draw, className, style, delay = 0 }: { color: string; draw?: boolean; className?: string; style?: CSSProperties; delay?: number }) {
  const cls = draw ? 'hm-draw' : undefined
  const at = (ms: number): CSSProperties | undefined => (draw ? { animationDelay: `${delay + ms}ms` } : undefined)
  const ribs = Array.from({ length: 13 }, (_, i) => {
    const a = (Math.PI * (i + 0.5)) / 13 - 0.1
    const [x0, y0] = polar(30, a, 48, 100)
    const [x1, y1] = polar(38.5, a, 48, 100)
    return `M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`
  }).join(' ')
  return (
    <svg viewBox="-8 -6 116 160" className={className} style={{ overflow: 'visible', ...style }} aria-hidden fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d={PAISLEY} strokeWidth="1.5" pathLength={1} className={cls} style={at(0)} />
      <path d="M66 7 C 58 2, 50 8, 54 14 C 57 18, 63 15, 61 11" strokeWidth="1.3" pathLength={1} className={cls} style={at(500)} />
      <path d={PAISLEY} strokeWidth="1.2" transform="translate(48 100) scale(0.72) translate(-48 -100)" pathLength={1} className={cls} style={at(250)} />
      <path d={ribs} strokeWidth="1" className={draw ? 'hm-fade' : undefined} style={at(900)} />
      <path d={PAISLEY} strokeWidth="1" transform="translate(48 102) scale(0.42) translate(-48 -102)" pathLength={1} className={cls} style={at(450)} />
      <circle cx="48" cy="106" r="5" fill={color} stroke="none" className={draw ? 'hm-fade' : undefined} style={at(1100)} />
      <path d={PAISLEY} strokeWidth="2.2" strokeDasharray="0 5.2" transform="translate(48 96) scale(1.12) translate(-48 -96)" className={draw ? 'hm-fade' : undefined} style={at(1200)} />
    </svg>
  )
}

/** Rings of petals, dots and scallops — the round motif at the heart of a palm. */
function mandalaParts(R: number) {
  const petals = (n: number, r0: number, r1: number, w: number, rot = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = rot + (i / n) * Math.PI * 2
      const [x0, y0] = polar(r0, a)
      const [x1, y1] = polar(r1, a)
      const [lx, ly] = polar((r0 + r1) / 2, a - w)
      const [rx, ry] = polar((r0 + r1) / 2, a + w)
      return `M${f1(x0)} ${f1(y0)} Q${f1(lx)} ${f1(ly)} ${f1(x1)} ${f1(y1)} Q${f1(rx)} ${f1(ry)} ${f1(x0)} ${f1(y0)}`
    }).join(' ')
  const scallops = (n: number, r0: number, depth: number) =>
    Array.from({ length: n }, (_, i) => {
      const a0 = (i / n) * Math.PI * 2
      const a1 = ((i + 1) / n) * Math.PI * 2
      const [x0, y0] = polar(r0, a0)
      const [x1, y1] = polar(r0, a1)
      const [cx, cy] = polar(r0 + depth, (a0 + a1) / 2)
      return `${i === 0 ? `M${f1(x0)} ${f1(y0)}` : ''} Q${f1(cx)} ${f1(cy)} ${f1(x1)} ${f1(y1)}`
    }).join(' ')
  const dots = (n: number, r0: number) => Array.from({ length: n }, (_, i) => polar(r0, (i / n) * Math.PI * 2 + 0.1))
  const k = R / 100
  return { petals, scallops, dots, k }
}

/** A full mandala in a -100..100 box, drawn as strokes so it can trace in. */
function Mandala({ color, draw, className, style, delay = 0 }: { color: string; draw?: boolean; className?: string; style?: CSSProperties; delay?: number }) {
  const { petals, scallops, dots } = mandalaParts(100)
  const cls = draw ? 'hm-draw' : undefined
  const at = (ms: number): CSSProperties | undefined => (draw ? { animationDelay: `${delay + ms}ms` } : undefined)
  const fade = draw ? 'hm-fade' : undefined
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={{ overflow: 'visible', ...style }} aria-hidden fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle r="9" fill={color} stroke="none" className={fade} style={at(1300)} />
      <circle r="14" strokeWidth="1.2" pathLength={1} className={cls} style={at(0)} />
      <path d={petals(8, 16, 34, 0.32)} strokeWidth="1.3" pathLength={1} className={cls} style={at(150)} />
      <circle r="37" strokeWidth="1.2" pathLength={1} className={cls} style={at(300)} />
      <g fill={color} stroke="none" className={fade} style={at(1400)}>
        {dots(28, 42).map(([x, y], i) => (
          <circle key={i} cx={f1(x)} cy={f1(y)} r="1.5" />
        ))}
      </g>
      <path d={petals(16, 47, 66, 0.1, Math.PI / 16)} strokeWidth="1.3" pathLength={1} className={cls} style={at(450)} />
      <circle r="69" strokeWidth="1.2" pathLength={1} className={cls} style={at(600)} />
      <circle r="73" strokeWidth="0.9" pathLength={1} className={cls} style={at(700)} />
      <path d={scallops(30, 73, 11)} strokeWidth="1.3" pathLength={1} className={cls} style={at(800)} />
      <g fill={color} stroke="none" className={fade} style={at(1500)}>
        {dots(30, 90).map(([x, y], i) => (
          <circle key={i} cx={f1(x)} cy={f1(y)} r="1.7" />
        ))}
      </g>
    </svg>
  )
}

/** A curling henna vine with little tear leaves, left to right in 300×60. */
function Vine({ color, draw, className, style, delay = 0 }: { color: string; draw?: boolean; className?: string; style?: CSSProperties; delay?: number }) {
  const stem = 'M4 40 C 40 10, 70 56, 108 32 C 130 18, 150 20, 160 32 C 170 44, 158 54, 150 46 C 144 40, 152 32, 160 34 M160 32 C 190 12, 230 50, 262 26 C 276 16, 290 22, 296 30'
  const leaves: [number, number, number][] = [
    [30, 22, -40], [56, 36, 30], [86, 40, -20], [124, 22, -60], [196, 22, -30], [222, 38, 40], [250, 30, -50], [280, 20, 20],
  ]
  return (
    <svg viewBox="0 0 300 60" className={className} style={{ overflow: 'visible', ...style }} aria-hidden fill="none" stroke={color} strokeLinecap="round">
      <path d={stem} strokeWidth="1.3" pathLength={1} className={draw ? 'hm-draw' : undefined} style={draw ? { animationDelay: `${delay}ms` } : undefined} />
      <g className={draw ? 'hm-fade' : undefined} style={draw ? { animationDelay: `${delay + 1200}ms` } : undefined}>
        {leaves.map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <path d="M0 0 C 3 -5, 9 -6, 13 -2 C 9 2, 3 3, 0 0Z" strokeWidth="1.1" />
            <circle cx={i % 2 ? 17 : -4} cy="-1" r="1.1" fill={color} stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** One finger of the palm outline: base centre, lean (deg), length, base and tip width. */
type Finger = { x: number; y: number; lean: number; len: number; wb: number; wt: number }

const FINGERS: Finger[] = [
  { x: 80, y: 146, lean: -8, len: 92, wb: 25, wt: 20 },
  { x: 106, y: 140, lean: -1, len: 106, wb: 26, wt: 21 },
  { x: 131, y: 146, lean: 7, len: 96, wb: 25, wt: 20 },
  { x: 153, y: 160, lean: 17, len: 72, wb: 21, wt: 17 },
]
const THUMB: Finger = { x: 62, y: 204, lean: -44, len: 70, wb: 30, wt: 23 }

function fingerFrame(f: Finger) {
  const t = (f.lean * Math.PI) / 180
  const u: [number, number] = [Math.sin(t), -Math.cos(t)]
  const nx: [number, number] = [Math.cos(t), Math.sin(t)]
  const at = (along: number, across: number): [number, number] => [f.x + u[0] * along + nx[0] * across, f.y + u[1] * along + nx[1] * across]
  return at
}

/** Outline points for one finger, left side up, round the tip, right side down. */
function fingerPoints(f: Finger): [number, number][] {
  const at = fingerFrame(f)
  const rt = f.wt / 2
  const mid = (f.wb + f.wt) / 4 + 0.6
  const tip = f.len - rt
  const arc = [30, 62, 90, 118, 150].map((deg) => {
    const p = (deg * Math.PI) / 180
    return at(tip + Math.sin(p) * rt, -Math.cos(p) * rt)
  })
  return [at(0, -f.wb / 2), at(f.len * 0.46, -mid), at(tip - 2, -rt), ...arc, at(tip - 2, rt), at(f.len * 0.46, mid), at(0, f.wb / 2)]
}

const PALM_OUTLINE = (() => {
  const pts: [number, number][] = [[74, 330], [72, 282], [64, 250]]
  pts.push(...fingerPoints(THUMB).slice(0, -1), [71, 178])
  FINGERS.forEach((f, i) => {
    const p = fingerPoints(f)
    pts.push(...(i === 0 ? p.slice(1) : p))
    const next = FINGERS[i + 1]
    if (next) pts.push([(f.x + f.wb / 2 + next.x - next.wb / 2) / 2, Math.max(f.y, next.y) + 5])
  })
  pts.push([168, 196], [164, 240], [146, 280], [144, 330])
  return smoothClosed(pts)
})()

/**
 * A hennaed palm: capped fingertips, banded fingers, a mandala in the palm
 * with the couple's initials hidden at its heart (as brides hide the groom's
 * name), and bangles of scallop and dot at the wrist.
 */
function Palm({ color, ground, initials, line = 1.4, className, style }: { color: string; ground: string; initials?: string; line?: number; className?: string; style?: CSSProperties }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const clip = `hm-palm-${raw}`
  const { petals, scallops, dots } = mandalaParts(100)
  const across = (y: number) => `M20 ${y} L190 ${y}`
  const w = line * 0.8
  return (
    <svg viewBox="16 26 172 290" className={className} style={style} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d={PALM_OUTLINE} />
        </clipPath>
      </defs>
      <path d={PALM_OUTLINE} fill={ground} stroke={color} strokeWidth={line} strokeLinejoin="round" />
      <g clipPath={`url(#${clip})`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round">
        {[...FINGERS, THUMB].map((f, i) => {
          const at = fingerFrame(f)
          const cap = f.len - f.wt * 0.95
          const seg = (along: number, bow = 0) => {
            const [x0, y0] = at(along, -f.wb)
            const [x1, y1] = at(along, f.wb)
            const [cx, cy] = at(along - bow, 0)
            return bow ? `M${f1(x0)} ${f1(y0)} Q${f1(cx)} ${f1(cy)} ${f1(x1)} ${f1(y1)}` : `M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`
          }
          const [c0x, c0y] = at(cap, -f.wb)
          const [c1x, c1y] = at(cap, f.wb)
          const [c2x, c2y] = at(f.len + 10, f.wb)
          const [c3x, c3y] = at(f.len + 10, -f.wb)
          const beads = [-0.3, 0, 0.3].map((k) => at(cap - 20, k * f.wt))
          const [s0x, s0y] = at(cap - 27, 0)
          const [s1x, s1y] = at(f.len * 0.2, 0)
          return (
            <g key={i}>
              <path d={`M${f1(c0x)} ${f1(c0y)} L${f1(c1x)} ${f1(c1y)} L${f1(c2x)} ${f1(c2y)} L${f1(c3x)} ${f1(c3y)}Z`} fill={color} stroke="none" />
              <path d={`${seg(cap - 6)} ${seg(cap - 9)} ${seg(cap - 13, -5)}`} />
              {beads.map(([bx, by], k) => (
                <circle key={k} cx={f1(bx)} cy={f1(by)} r={line * 0.8} fill={color} stroke="none" />
              ))}
              {f.len > 80 && (
                <path d={`M${f1(s0x)} ${f1(s0y)} L${f1(s1x)} ${f1(s1y)}`} strokeDasharray={`0 ${f1(line * 3.6)}`} strokeWidth={line * 1.4} />
              )}
            </g>
          )
        })}
        <g transform="translate(112 214)">
          <circle r="15" />
          <path d={petals(10, 16, 29, 0.3)} />
          <circle r="32" />
          <g fill={color} stroke="none">
            {dots(22, 36).map(([x, y], i) => (
              <circle key={i} cx={f1(x)} cy={f1(y)} r={line * 0.7} />
            ))}
          </g>
          <path d={scallops(18, 40, 8)} />
          <path d={petals(20, 49, 55, 0.06)} />
          <g fill={color} stroke="none">
            {[62, 70, 77].map((y, i) => (
              <circle key={y} cx="0" cy={y} r={line * (1 - i * 0.2)} />
            ))}
          </g>
        </g>
        <path d={`${across(284)} ${across(288)}`} />
        <path d={Array.from({ length: 10 }, (_, i) => `M${64 + i * 9} 289 q4.5 8 9 0`).join(' ')} />
        <g fill={color} stroke="none">
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={68.5 + i * 9} cy="303" r={line * 0.75} />
          ))}
        </g>
        <path d={`${across(311)} ${across(315)}`} />
      </g>
      {initials && (
        <text x="112" y="221" textAnchor="middle" fill={color} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 19, fontWeight: 500 }}>
          {initials}
        </text>
      )}
    </svg>
  )
}

// ─── Page pieces ─────────────────────────────────────────────────────────────

const pill =
  'hm-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors'

function CalendarLink({ href, isPreview, className, style }: { href: string | null; isPreview?: boolean; className?: string; style?: CSSProperties }) {
  if (!href) return null
  return (
    <a href={isPreview ? undefined : href} target="_blank" rel="noopener noreferrer" aria-disabled={isPreview || undefined} className={className} style={style}>
      <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <rect x="2" y="3" width="12" height="11" rx="2" />
        <path d="M2 7h12M5.5 1.5v3M10.5 1.5v3" strokeLinecap="round" />
      </svg>
      Add to calendar
    </a>
  )
}

function Pin() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  )
}

function dayLine(d: DateParts | null) {
  return d ? `${d.weekday}, ${d.day} ${d.month} ${d.year}` : ''
}

/** "14 & 15 November 2026", "30 November & 1 December 2026" … */
function spanLine(a: DateParts | null, b: DateParts | null) {
  if (!a && !b) return ''
  if (!a || !b) return dayLine(a || b)
  if (a.day === b.day && a.month === b.month && a.year === b.year) return dayLine(a)
  if (a.month === b.month && a.year === b.year) return `${a.day} & ${b.day} ${a.month} ${a.year}`
  if (a.year === b.year) return `${a.day} ${a.month} & ${b.day} ${b.month} ${a.year}`
  return `${a.day} ${a.month} ${a.year} & ${b.day} ${b.month} ${b.year}`
}

function Detail({ label, children, color }: { label: string; children: ReactNode; color: string }) {
  return (
    <div className="grid grid-cols-[4.6rem_1fr] items-baseline gap-3 py-2.5">
      <dt className="text-[13px] font-medium uppercase" style={{ letterSpacing: '0.14em', color }}>
        {label}
      </dt>
      <dd className="text-[17px] leading-[1.35]" style={{ fontWeight: 600 }}>
        {children}
      </dd>
    </div>
  )
}

export default function HaldiMehendi({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Sana'
  const groom = data.groomName?.trim() || 'Rahul'
  const couple = `${bride} & ${groom}`
  const animate = !isPreview

  const hDate = dateParts(data.date)
  const mDateValue = data.mehendiDate?.trim() || data.date
  const mDate = dateParts(mDateValue)
  const sameDay = !!hDate && mDateValue === data.date
  const hTime = timeLabel(data.time)
  const mTime = timeLabel(data.mehendiTime)

  const hVenue = data.venue?.trim() || ''
  const ownMehendiVenue = data.mehendiVenue?.trim() && data.mehendiVenue.trim() !== hVenue ? data.mehendiVenue.trim() : ''
  const mVenue = ownMehendiVenue || hVenue
  // Show the address under the Mehendi too when it is plainly the same place ("… Lawns").
  const mAddress =
    !ownMehendiVenue || (hVenue && ownMehendiVenue.toLowerCase().includes(hVenue.toLowerCase())) ? data.venueAddress : ''

  const hDirections = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const mDirections = ownMehendiVenue ? mapsHref(undefined, ownMehendiVenue, data.venueAddress) : hDirections
  const hPlace = [hVenue, data.venueAddress].filter(Boolean).join(', ')
  const mPlace = [mVenue, data.venueAddress].filter(Boolean).join(', ')
  const hCalendar = calendarHref(`Haldi — ${couple}`, data.date, data.time, hPlace || undefined, 3)
  const mCalendar = calendarHref(
    `Mehendi — ${couple}`,
    mDateValue,
    data.mehendiTime || (sameDay ? addHours(data.time, 4) : undefined),
    mPlace || undefined,
    4,
  )

  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  // The programme turns green from the first Mehendi item on.
  const turn = schedule.findIndex((s) => /mehe?n?di|mehndi|henna/i.test(s.title))
  const initials = `${bride.charAt(0)}${groom.charAt(0)}`

  const mTimeText = mTime || (sameDay ? 'After the Haldi' : 'Time to follow')

  return (
    <div
      className="hm relative overflow-x-hidden"
      style={{ background: C.paper, color: C.ink, fontFamily: sans, containerType: 'inline-size' }}
    >
      <style>{`
        .hm .hm-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hm-draw 2.2s cubic-bezier(.5,.1,.3,1) forwards 500ms; }
        .hm .hm-fade { opacity: 0; animation: hm-fade .9s ease forwards 1500ms; }
        .hm .hm-splat { opacity: 0; transform: scale(.25); animation: hm-splat .6s cubic-bezier(.2,1.5,.4,1) forwards; }
        .hm .hm-drop { opacity: 0; transform: translateY(-26px) rotate(-18deg); animation: hm-drop .8s cubic-bezier(.2,.9,.3,1.15) forwards; }
        .hm .hm-btn:hover { filter: brightness(1.06); }
        @keyframes hm-draw { to { stroke-dashoffset: 0; } }
        @keyframes hm-fade { to { opacity: 1; } }
        @keyframes hm-splat { 40% { opacity: 1; } to { opacity: 1; transform: none; } }
        @keyframes hm-drop { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hm .hm-draw, .hm .hm-fade, .hm .hm-splat, .hm .hm-drop { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.ink} background="rgba(255,249,234,0.9)" border="rgba(58,37,17,0.25)" />

      {/* ── Hero: Haldi above, Mehendi below ─────────────────────── */}
      <header className="relative flex flex-col" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        {/* Haldi */}
        <div className="relative flex flex-[1.1] flex-col items-center justify-center overflow-hidden px-5 pb-[22cqi] pt-[76px] text-center" style={{ background: C.haldi, ...grain(0.07) }}>
          <Splash seed={7} color={C.haldiDeep} className={`absolute right-[-12%] top-[22%] w-[48%] ${animate ? 'hm-splat' : ''}`} style={{ animationDelay: '250ms' }} />
          <Splash seed={23} color={C.haldiDeep} fingers={5} className={`absolute left-[-7%] top-[58%] w-[30%] ${animate ? 'hm-splat' : ''}`} style={{ animationDelay: '420ms' }} />
          <Splash seed={41} color="#F7C54F" fingers={4} className={`absolute left-[5%] top-[31%] w-[14%] ${animate ? 'hm-splat' : ''}`} style={{ animationDelay: '560ms' }} />

          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Marigold seed={3} className={`absolute left-[-10%] top-[-7%] w-[27%] ${animate ? 'hm-drop' : ''}`} style={{ animationDelay: '0ms' }} />
            <Marigold seed={8} className={`absolute left-[13%] top-[-2.5%] w-[12%] ${animate ? 'hm-drop' : ''}`} style={{ animationDelay: '120ms' }} />
            <Marigold seed={12} className={`absolute right-[-7%] top-[8%] w-[19%] ${animate ? 'hm-drop' : ''}`} style={{ animationDelay: '200ms' }} />
            <Marigold seed={19} className={`absolute right-[7%] top-[62%] w-[10%] ${animate ? 'hm-drop' : ''}`} style={{ animationDelay: '320ms' }} />
            <Petal x="31%" y="5%" rot={-30} />
            <Petal x="66%" y="9%" rot={40} s={0.8} color={MARIGOLD[0]} />
            <Petal x="9%" y="24%" rot={110} s={0.9} />
            <Petal x="88%" y="40%" rot={-70} s={0.7} color={MARIGOLD[2]} />
            <Petal x="21%" y="80%" rot={20} s={0.8} color={MARIGOLD[0]} />
            <Petal x="74%" y="78%" rot={150} s={0.7} />
          </div>

          <div className="relative">
            <p className="leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(28px, 9cqi, 42px)', color: C.ink }}>
              {couple}
            </p>
            <p className="mt-2 italic" style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: C.ink }}>
              invite you to their
            </p>
            <h1
              className="mt-1 leading-[1.02]"
              style={{
                fontFamily: display,
                fontSize: 'clamp(76px, 27cqi, 132px)',
                color: C.cream,
                textShadow: `0.035em 0.04em 0 ${C.marigold}`,
                letterSpacing: '-0.01em',
              }}
            >
              Haldi
            </h1>
          </div>
        </div>

        {/* The paste spills over into the henna */}
        <div className="relative flex flex-1 flex-col items-center px-5 pb-10 text-center" style={{ background: C.henna, ...grain(0.08) }}>
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute left-0 top-[-40px] h-[42px] w-full" aria-hidden>
            <path d="M0 34 C 44 8, 92 46, 150 30 C 196 18, 214 44, 262 38 C 312 32, 344 6, 400 26 V60 H0Z" fill={C.henna} />
          </svg>
          <Urli shadow="#16240C" className={`relative -mt-[27cqi] w-[62cqi] max-w-[250px] ${animate ? 'hm-drop' : ''}`} style={{ animationDelay: '150ms' }} />

          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <Mandala color={C.creamLine} draw={animate} className="absolute bottom-[-24%] left-[-30%] w-[62%]" />
            <Paisley color={C.creamLine} draw={animate} delay={300} className="absolute right-[-3%] top-[26%] w-[19%]" style={{ transform: 'rotate(24deg)' }} />
            <Paisley color={C.creamLine} draw={animate} delay={500} className="absolute left-[4%] top-[18%] w-[12%]" style={{ transform: 'rotate(-150deg)' }} />
          </div>

          <p className="relative mt-1 italic leading-none" style={{ fontFamily: serif, fontSize: 'clamp(26px, 8cqi, 38px)', fontWeight: 400, color: C.haldi }}>
            and
          </p>
          <p
            className="relative italic leading-[0.95]"
            style={{ fontFamily: serif, fontSize: 'clamp(64px, 21cqi, 104px)', fontWeight: 300, color: C.cream }}
          >
            Mehendi
          </p>
          <Vine color={C.creamLine} draw={animate} delay={700} className="relative mt-3 w-[62%] max-w-[240px]" />

          <div className="relative mt-5 w-full max-w-[22rem]" style={{ color: C.cream }}>
            {hDate || mDate ? (
              <p className="text-[18px] font-semibold">{sameDay ? dayLine(hDate) : spanLine(hDate, mDate)}</p>
            ) : (
              <p className="text-[18px] font-semibold">Dates to be announced</p>
            )}
            <div className="mt-3 grid grid-cols-2 border-t pt-3" style={{ borderColor: 'rgba(255,244,218,0.3)' }}>
              <div className="border-r px-2" style={{ borderColor: 'rgba(255,244,218,0.3)' }}>
                <p style={{ fontFamily: display, fontSize: 18, color: C.haldi }}>Haldi</p>
                <p className="text-[17px] font-semibold">{hTime || 'Time to follow'}</p>
                {!sameDay && hDate && <p className="text-[15px]" style={{ color: C.creamSoft }}>{hDate.weekday.slice(0, 3)}, {hDate.day} {hDate.monthShort}</p>}
              </div>
              <div className="px-2">
                <p className="italic" style={{ fontFamily: serif, fontSize: 22, lineHeight: '27px', fontWeight: 500, color: C.cream }}>Mehendi</p>
                <p className="text-[17px] font-semibold">{mTimeText}</p>
                {!sameDay && mDate && <p className="text-[15px]" style={{ color: C.creamSoft }}>{mDate.weekday.slice(0, 3)}, {mDate.day} {mDate.monthShort}</p>}
              </div>
            </div>
            {hVenue && (
              <p className="mt-4 text-[16px]" style={{ color: C.creamSoft }}>
                at <span className="font-semibold" style={{ color: C.cream }}>{hVenue}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── The couple's note ────────────────────────────────────── */}
      {data.message && (
        <Reveal disabled={isPreview} as="section" className="relative mx-auto max-w-[30rem] px-7 pb-4 pt-14 text-center">
          <Splash seed={61} color={C.haldi} fingers={5} className="mx-auto mb-5 w-[46px]" />
          <p className="relative italic leading-[1.4]" style={{ fontFamily: serif, fontSize: 'clamp(22px, 6.6cqi, 27px)', fontWeight: 500 }}>
            {data.message}
          </p>
          <p className="relative mt-4 text-[15px]" style={{ color: C.inkSoft }}>
            — {couple}
          </p>
        </Reveal>
      )}

      {/* ── Two cards, laid down one over the other ──────────────── */}
      <section className="mx-auto max-w-[30rem] px-5 pb-6 pt-10">
        <Reveal disabled={isPreview}>
          <article
            className="relative overflow-hidden rounded-[26px] px-6 pb-10 pt-6"
            style={{ background: C.haldi, color: C.ink, transform: 'rotate(-1.2deg)', boxShadow: '0 18px 34px -24px rgba(90,55,5,0.55)', ...grain(0.07) }}
          >
            <Splash seed={77} color={C.haldiDeep} className="absolute right-[-18%] top-[-22%] w-[62%]" />
            <Marigold seed={31} className="absolute right-[6%] top-[5%] w-[15%]" />
            <Urli className="relative -ml-1 w-[118px]" />
            <h2 className="relative mt-2 leading-none" style={{ fontFamily: display, fontSize: 44 }}>
              Haldi
            </h2>
            <dl className="relative mt-4 divide-y divide-[rgba(58,37,17,0.2)]">
              <Detail label="Day" color={C.inkSoft}>{hDate ? dayLine(hDate) : 'Date to follow'}</Detail>
              <Detail label="Time" color={C.inkSoft}>{hTime || 'Time to follow'}</Detail>
              <Detail label="Venue" color={C.inkSoft}>
                {hVenue || 'Venue to follow'}
                {data.venueAddress && <span className="mt-0.5 block text-[15px] font-normal" style={{ color: C.inkSoft }}>{data.venueAddress}</span>}
              </Detail>
            </dl>
            <div className="relative mt-5 flex flex-wrap gap-2.5">
              <CalendarLink href={hCalendar} isPreview={isPreview} className={pill} style={{ background: C.ink, color: C.cream }} />
              <DirectionsLink href={hDirections} isPreview={isPreview} className={pill} style={{ border: `1.5px solid ${C.ink}`, color: C.ink }}>
                <Pin />
                Directions
              </DirectionsLink>
            </div>
          </article>
        </Reveal>

        <Reveal disabled={isPreview} delay={80} className="relative -mt-3">
          <article
            className="relative overflow-hidden rounded-[26px] px-6 pb-7 pt-6"
            style={{ background: C.henna, color: C.cream, transform: 'rotate(0.9deg)', boxShadow: '0 18px 34px -22px rgba(20,35,10,0.6)', ...grain(0.08) }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-[9px] rounded-[19px] border" style={{ borderColor: 'rgba(255,244,218,0.32)' }} />
            <Paisley color={C.creamLine} className="absolute right-[5%] top-[-4%] w-[16%]" style={{ transform: 'rotate(200deg)' }} />
            <Mandala color="rgba(255,244,218,0.18)" className="absolute bottom-[-28%] right-[-26%] w-[64%]" />
            <Palm color={C.cream} ground={C.henna} line={2.4} className="relative w-[58px]" />
            <h2 className="relative mt-1 italic leading-none" style={{ fontFamily: serif, fontSize: 52, fontWeight: 400 }}>
              Mehendi
            </h2>
            <dl className="relative mt-4 divide-y divide-[rgba(255,244,218,0.22)]">
              <Detail label="Day" color={C.creamSoft}>
                {mDate ? dayLine(mDate) : 'Date to follow'}
                {sameDay && <span className="mt-0.5 block text-[15px] font-normal" style={{ color: C.creamSoft }}>The same day as the Haldi</span>}
              </Detail>
              <Detail label="Time" color={C.creamSoft}>{mTimeText}</Detail>
              <Detail label="Venue" color={C.creamSoft}>
                {mVenue || 'Venue to follow'}
                {mAddress && <span className="mt-0.5 block text-[15px] font-normal" style={{ color: C.creamSoft }}>{mAddress}</span>}
              </Detail>
            </dl>
            <div className="relative mt-5 flex flex-wrap gap-2.5">
              <CalendarLink href={mCalendar} isPreview={isPreview} className={pill} style={{ background: C.cream, color: C.hennaDeep }} />
              <DirectionsLink href={mDirections} isPreview={isPreview} className={pill} style={{ border: `1.5px solid ${C.cream}`, color: C.cream }}>
                <Pin />
                Directions
              </DirectionsLink>
            </div>
          </article>
        </Reveal>

        {data.dressCode && (
          <Reveal disabled={isPreview} className="mt-10 flex items-center justify-center gap-4 text-center">
            <Marigold seed={90} className="w-[32px] shrink-0" />
            <div>
              <p className="italic" style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: C.inkSoft }}>Dress code</p>
              <p className="text-[18px] font-semibold leading-[1.35]">{data.dressCode}</p>
            </div>
            <svg viewBox="0 0 30 30" className="w-[30px] shrink-0" aria-hidden>
              <path d="M15 28 C 3 20, 4 7, 15 2 C 26 7, 27 20, 15 28Z" fill={C.leaf} />
              <path d="M15 26 L15 6 M15 13 L10 9 M15 13 L20 9 M15 19 L9 14 M15 19 L21 14" stroke="#9CB65E" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </Reveal>
        )}
      </section>

      {/* ── Countdown ────────────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="relative mx-auto max-w-[30rem] px-6 py-12 text-center">
          <div className="relative mx-auto flex h-[170px] w-[210px] items-center justify-center">
            <Splash seed={104} color={C.haldi} className="absolute inset-0 m-auto w-[190px]" />
            <p className="relative leading-none" style={{ fontFamily: display, fontSize: 76, color: C.ink }}>
              {countdown.days}
            </p>
          </div>
          <p className="mt-1 italic" style={{ fontFamily: serif, fontSize: 24, fontWeight: 500 }}>
            {countdown.days === 1 ? 'day' : 'days'} until the Haldi
          </p>
          <p className="mt-2 text-[15px] tabular-nums" style={{ color: C.inkSoft }}>
            {countdown.hours} hr · {pad2(countdown.minutes)} min · {pad2(countdown.seconds)} sec
          </p>
        </Reveal>
      )}

      {/* ── Programme: turmeric turning to henna ─────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-14 pt-10">
          <h2 className="text-center italic leading-none" style={{ fontFamily: serif, fontSize: 42, fontWeight: 500 }}>
            The programme
          </h2>
          <ol className="relative mt-9">
            <span
              aria-hidden
              className="absolute bottom-6 left-[15px] top-6 w-[3px] rounded-full"
              style={{
                background:
                  turn > 0
                    ? `linear-gradient(${C.haldiDeep} 0%, ${C.haldiDeep} ${((turn - 0.6) / Math.max(1, schedule.length - 1)) * 100}%, ${C.henna} ${((turn - 0.1) / Math.max(1, schedule.length - 1)) * 100}%, ${C.henna} 100%)`
                    : turn === 0
                      ? C.henna
                      : `linear-gradient(${C.haldiDeep}, ${C.henna})`,
              }}
            />
            {schedule.map((item, i) => {
              const green = turn === -1 ? i / Math.max(1, schedule.length - 1) > 0.5 : i >= turn
              return (
                <li key={`${item.title}-${i}`} className="relative grid grid-cols-[34px_1fr] items-center gap-4 py-3.5">
                  <span className="relative flex h-[34px] w-[34px] items-center justify-center">
                    {green ? (
                      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full" style={{ background: C.henna }}>
                        <Mandala color={C.cream} className="w-[26px]" />
                      </span>
                    ) : (
                      <Marigold seed={50 + i} className="w-[34px]" />
                    )}
                  </span>
                  <div>
                    {item.time && (
                      <p className="text-[15px] font-semibold tabular-nums" style={{ color: green ? C.henna : '#B96A06' }}>
                        {item.time}
                      </p>
                    )}
                    <p className="leading-[1.2]" style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>
                      {item.title}
                    </p>
                    {item.note && <p className="mt-0.5 text-[15px]" style={{ color: C.inkSoft }}>{item.note}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
      )}

      {/* ── Photographs ──────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[34rem] px-5 pb-14 pt-4">
          <Reveal disabled={isPreview}>
            <h2 className="text-center italic leading-none" style={{ fontFamily: serif, fontSize: 42, fontWeight: 500 }}>
              Glimpses
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {photos.map((src, i) => {
              const wide = i === 0 || (i === photos.length - 1 && photos.length % 2 === 0)
              return (
                <Reveal
                  key={`${src}-${i}`}
                  disabled={isPreview}
                  delay={(i % 2) * 90}
                  className={`relative ${wide ? 'col-span-2 aspect-[3/2]' : 'aspect-[4/5]'} ${!wide && i % 2 === 0 ? 'mt-5' : ''}`}
                >
                  <figure
                    className="h-full w-full overflow-hidden rounded-[18px] p-[5px]"
                    style={{ background: i % 2 ? C.henna : C.haldi }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full rounded-[14px] object-cover" />
                  </figure>
                  <Marigold seed={70 + i} className="absolute -right-2 -top-2 w-[30px]" />
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {eventId && (
        <div className="border-t" style={{ borderColor: C.rule }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Blessings for the couple"
            intro={`Leave a few words for ${bride} and ${groom}. Your blessing appears here for every guest.`}
            noun="blessing"
          />
        </div>
      )}

      {/* ── Footer: the palm with their initials hidden in it ────── */}
      <footer className="relative overflow-hidden px-6 pb-10 pt-14 text-center" style={{ background: C.henna, color: C.cream, ...grain(0.08) }}>
        <Palm color={C.cream} ground={C.henna} initials={initials} className="mx-auto w-[128px]" />
        <p className="mt-5 italic" style={{ fontFamily: serif, fontSize: 24, fontWeight: 500 }}>
          {couple}
        </p>
        {hDate && (
          <p className="mt-1 text-[14px] tabular-nums" style={{ color: C.creamSoft, letterSpacing: '0.12em' }}>
            {hDate.dayPadded} · {data.date.slice(5, 7)} · {hDate.year}
          </p>
        )}
        <div className="mt-9">
          <Credit isPreview={isPreview} color="rgba(255,244,218,0.55)" linkColor={C.cream} />
        </div>
      </footer>
    </div>
  )
}
