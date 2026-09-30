/*
 * Rajwada — the drawn palace. Everything here is generated in code: cusped
 * (multifoil) arches, the carved doors with their brass studs, peacocks and
 * ring knockers, the courtyard arch with its marigold swags and lanterns, the
 * Lake Palace at dusk and the jaali balustrade, and one small motif per
 * function. One stroke colour and flat fills throughout, like a miniature.
 */

import { useId } from 'react'

export type Pt = [number, number]

export const R = {
  marble: '#F6EFE3',
  marbleDeep: '#EDE2CE',
  card: '#FCF8F0',
  sand: '#D8BA89',
  sandLight: '#E7D0A6',
  sandDeep: '#BE9860',
  sandShadow: '#8A673A',
  maroon: '#6B1A1E',
  maroonDeep: '#4A0F13',
  lacquer: '#7A2025',
  lacquerDeep: '#58141A',
  vermilion: '#A8322A',
  gold: '#A8812F',
  goldLight: '#D9B96C',
  goldPale: '#EEDDAE',
  goldDark: '#7A5A1E',
  teal: '#1D5956',
  tealLight: '#2F766F',
  ink: '#3B1D16',
  soft: 'rgba(59,29,22,0.76)',
  faint: 'rgba(59,29,22,0.56)',
  rule: 'rgba(168,129,47,0.42)',
  hair: 'rgba(168,129,47,0.26)',
  onMaroon: '#F5E7CD',
  onMaroonSoft: 'rgba(245,231,205,0.8)',
}

const r1 = (v: number) => Math.round(v * 10) / 10

export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export interface Arch {
  /** Open outline from the left springing point, over the crown, to the right one. */
  d: string
  /** Arc commands from the left springing point up to the crown (no leading M). */
  left: string
  /** Arc commands from the crown down to the right springing point. */
  right: string
  cusps: Pt[]
  top: Pt
}

/**
 * A cusped (multifoil) arch `w` wide, springing `spring` below its crown, with
 * 2k+1 lobes: k up each side and one over the crown. The lobes sit on a
 * semi-ellipse, spaced evenly along it, each a circular arc bulging outwards,
 * so the cusps point into the opening as carved ones do.
 */
export function cuspedArch(w: number, spring: number, k = 3, x0 = 0, y0 = 0, bulge = 0.6): Arch {
  const hw = w / 2
  const n = 2 * k + 1
  const build = (H: number) => {
    const N = 180
    const s: Pt[] = []
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI
      s.push([hw - hw * Math.cos(t), spring - H * Math.sin(t)])
    }
    const cum = [0]
    for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]))
    const pts: Pt[] = []
    let j = 0
    for (let m = 0; m <= n; m++) {
      const target = (m / n) * cum[N]
      while (j < N - 1 && cum[j + 1] < target) j++
      const u = Math.min(1, Math.max(0, (target - cum[j]) / (cum[j + 1] - cum[j])))
      pts.push([s[j][0] + (s[j + 1][0] - s[j][0]) * u, s[j][1] + (s[j + 1][1] - s[j][1]) * u])
    }
    pts[0] = [0, spring]
    pts[n] = [w, spring]
    return pts
  }
  const sag = (a: Pt, b: Pt) => {
    const c = Math.hypot(b[0] - a[0], b[1] - a[1])
    const r = c * bulge
    return { r, s: r - Math.sqrt(Math.max(0, r * r - (c / 2) ** 2)) }
  }
  // The crown lobe rises above the ellipse by its sagitta: size the ellipse so the arch tops out at y = 0.
  let pts = build(spring)
  pts = build(spring - sag(pts[k], pts[k + 1]).s)
  const crown = sag(pts[k], pts[k + 1])
  const topY = pts[k][1] - crown.s
  const P = (p: Pt) => `${r1(x0 + p[0])} ${r1(y0 + p[1])}`
  const arc = (a: Pt, b: Pt, r?: number) => {
    const rr = r ?? Math.hypot(b[0] - a[0], b[1] - a[1]) * bulge
    return `A${r1(rr)} ${r1(rr)} 0 0 1 ${P(b)}`
  }
  const top: Pt = [hw, topY]
  let left = ''
  for (let m = 0; m < k; m++) left += arc(pts[m], pts[m + 1])
  left += arc(pts[k], top, crown.r)
  let right = arc(top, pts[k + 1], crown.r)
  for (let m = k + 1; m < n; m++) right += arc(pts[m], pts[m + 1])
  return {
    d: `M${P(pts[0])}${left}${right}`,
    left,
    right,
    cusps: pts.slice(1, n).map((p) => [x0 + p[0], y0 + p[1]] as Pt),
    top: [x0 + hw, y0 + topY],
  }
}

/** A ruffled marigold head: a wandering circle smoothed through midpoints. */
function ruffle(cx: number, cy: number, r: number, seed: number, n = 13) {
  const rand = rng(seed)
  const pts: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand() * 0.2
    const rad = r * (0.84 + rand() * 0.2)
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)])
  }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const f = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`
  let d = `M${f(mid(pts[0], pts[1]))}`
  for (let i = 1; i <= n; i++) d += `Q${f(pts[i % n])} ${f(mid(pts[i % n], pts[(i + 1) % n]))}`
  return `${d}Z`
}

const MARIGOLD = ['#E48A1C', '#EFAE27', '#DE7418']

function Marigold({ x, y, r, seed }: { x: number; y: number; r: number; seed: number }) {
  const c = MARIGOLD[seed % 3]
  return (
    <g>
      <path d={ruffle(x, y, r, seed)} fill={c} stroke="rgba(110,50,10,0.5)" strokeWidth={0.5} />
      <path d={ruffle(x, y, r * 0.58, seed + 7, 9)} fill="rgba(170,70,10,0.28)" />
      <circle cx={x} cy={y} r={r * 0.18} fill="#9A4A10" opacity={0.55} />
    </g>
  )
}

function Leaf({ x, y, len, angle, fill = '#5B7A2E' }: { x: number; y: number; len: number; angle: number; fill?: string }) {
  const w = len * 0.34
  return (
    <path
      d={`M0 0C${r1(len * 0.3)} ${r1(-w)} ${r1(len * 0.75)} ${r1(-w * 0.8)} ${r1(len)} 0C${r1(len * 0.75)} ${r1(w * 0.8)} ${r1(len * 0.3)} ${r1(w)} 0 0Z`}
      transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})`}
      fill={fill}
      stroke="rgba(30,40,10,0.35)"
      strokeWidth={0.5}
    />
  )
}

/** Marigold heads strung along a sagging quadratic from a to b. */
function Swag({ a, b, sag, r, seed }: { a: Pt; b: Pt; sag: number; r: number; seed: number }) {
  const c: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * 2]
  const at = (t: number): Pt => {
    const u = 1 - t
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]
  }
  let len = 0
  let prev = a
  for (let i = 1; i <= 40; i++) {
    const p = at(i / 40)
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1])
    prev = p
  }
  const count = Math.max(3, Math.round(len / (r * 1.55)))
  const heads = Array.from({ length: count + 1 }, (_, i) => at(i / count))
  return (
    <g>
      {heads.map((p, i) =>
        i % 4 === 2 ? (
          <g key={`l${i}`}>
            <Leaf x={p[0]} y={p[1]} len={r * 2.4} angle={100 + (i % 8 === 2 ? -30 : 30)} />
          </g>
        ) : null,
      )}
      {heads.map((p, i) => (
        <Marigold key={i} x={p[0]} y={p[1]} r={r} seed={seed + i * 3} />
      ))}
    </g>
  )
}

/** A short string of marigolds ending in a brass bell. */
function Drop({ x, y, n, r, seed }: { x: number; y: number; n: number; r: number; seed: number }) {
  const step = r * 1.6
  const end = y + n * step
  return (
    <g>
      <path d={`M${x} ${y}V${r1(end)}`} stroke="#8A6526" strokeWidth={0.7} />
      {Array.from({ length: n }, (_, i) => (
        <Marigold key={i} x={x} y={y + i * step} r={r * (1 - i * 0.06)} seed={seed + i * 5} />
      ))}
      <path
        d={`M${r1(x - r * 0.55)} ${r1(end + r * 0.2)}Q${x} ${r1(end - r * 0.9)} ${r1(x + r * 0.55)} ${r1(end + r * 0.2)}L${r1(x + r * 0.8)} ${r1(end + r * 1.1)}H${r1(x - r * 0.8)}Z`}
        fill={R.goldLight}
        stroke={R.goldDark}
        strokeWidth={0.6}
      />
      <circle cx={x} cy={r1(end + r * 1.35)} r={r * 0.28} fill={R.goldDark} />
    </g>
  )
}

/** A Rajasthani brass lantern on a chain, lit. */
function Lantern({ x, y, chain, s = 1 }: { x: number; y: number; chain: number; s?: number }) {
  const t = `translate(${r1(x)} ${r1(y + chain)}) scale(${s})`
  return (
    <g>
      <path d={`M${r1(x)} ${r1(y)}V${r1(y + chain)}`} stroke={R.goldDark} strokeWidth={1.1} strokeDasharray="2.2 1.6" />
      <g transform={t}>
        <circle cx={0} cy={-1} r={1.8} fill="none" stroke={R.goldDark} strokeWidth={0.9} />
        <path d="M-8 7C-8 2-4 1 0 0C4 1 8 2 8 7Z" fill={R.gold} stroke={R.goldDark} strokeWidth={0.7} />
        <path d="M-7 7H7L9 27H-9Z" fill="#F4C860" stroke={R.goldDark} strokeWidth={0.8} />
        <path d="M-3.4 7V27M3.4 7V27M-8 17H8" stroke={R.goldDark} strokeWidth={0.8} />
        <path d="M-5.2 25V14Q-5.2 11-3.8 11Q-2.4 11-2.4 14V25ZM2.4 25V14Q2.4 11 3.8 11Q5.2 11 5.2 14V25Z" fill="#FBE3A0" opacity={0.9} />
        <path d="M-9.5 27H9.5L6 32H-6Z" fill={R.gold} stroke={R.goldDark} strokeWidth={0.7} />
        <path d="M-2.4 32L0 40L2.4 32Z" fill={R.goldDark} />
      </g>
    </g>
  )
}

/* ── The courtyard arch (hero crown) ─────────────────────────────── */

/** Crown viewBox: x -14..374, y -14..150. The arch spans 0..360 and springs at y = 150. */
export const CROWN = { x: -14, y: -14, w: 388, h: 164, span: 360, spring: 150 }
const CROWN_ARCH = cuspedArch(360, 150, 3, 0, 0, 0.6)

function Inlay({ flip = false }: { flip?: boolean }) {
  // A small pietra-dura sprig for the spandrel.
  return (
    <g transform={flip ? 'translate(360 0) scale(-1 1)' : undefined}>
      <path d="M-4 40C6 26 14 16 30 8" fill="none" stroke={R.gold} strokeWidth={0.9} />
      <path d="M6 26C2 20 3 14 8 12C10 18 9 22 6 26Z" fill={R.tealLight} />
      <path d="M16 16C16 9 20 5 25 5C24 11 21 14 16 16Z" fill={R.teal} />
      <path d="M13 22C19 22 23 25 24 30C18 30 15 27 13 22Z" fill={R.tealLight} />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={34} cy={4} rx={2.2} ry={4.6} transform={`rotate(${a} 34 8)`} fill={R.vermilion} />
      ))}
      <circle cx={34} cy={8} r={2} fill={R.goldLight} />
    </g>
  )
}

export function CourtyardCrown({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const a = CROWN_ARCH
  const closed = `${a.d}L360 160L0 160Z`
  const [c1, c2, c3] = a.cusps
  const m1: Pt = [360 - c1[0], c1[1]]
  const m2: Pt = [360 - c2[0], c2[1]]
  return (
    <svg viewBox={`${CROWN.x} ${CROWN.y} ${CROWN.w} ${CROWN.h}`} className={className} style={style} aria-hidden>
      {/* The marble wall around the arch: its spandrels. */}
      <path d={`M-14 -14H374V150H-14Z${closed}`} fillRule="evenodd" fill={R.marble} />
      <Inlay />
      <Inlay flip />
      <path d="M-12 -12H372" stroke={R.rule} strokeWidth={0.8} />
      {/* The painted band that runs round the arch and down the jambs. */}
      <path d={a.d} fill="none" stroke={R.goldDark} strokeWidth={19} />
      <path d={a.d} fill="none" stroke={R.maroon} strokeWidth={17} />
      <path d={a.d} fill="none" stroke={R.gold} strokeWidth={3} />
      <path d={a.d} fill="none" stroke={R.goldPale} strokeWidth={0.8} />
      {a.cusps.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${r1(x)} ${r1(y + 6)}l-2.2 4.4 2.2 4.6 2.2-4.6Z`} fill={R.goldLight} stroke={R.goldDark} strokeWidth={0.5} />
        </g>
      ))}
      {/* Lanterns from the second cusps, a swag between, a drop from the crown. */}
      <Lantern x={c2[0]} y={c2[1] + 12} chain={40} s={1.05} />
      <Lantern x={m2[0]} y={m2[1] + 12} chain={40} s={1.05} />
      <Swag a={[c1[0] + 4, c1[1] + 8]} b={[c2[0], c2[1] + 10]} sag={7} r={4.4} seed={11} />
      <Swag a={[m2[0], m2[1] + 10]} b={[m1[0] - 4, m1[1] + 8]} sag={7} r={4.4} seed={41} />
      <Swag a={[c2[0] + 2, c2[1] + 10]} b={[360 - c2[0] - 2, c2[1] + 10]} sag={20} r={5} seed={3} />
      <Drop x={c3[0]} y={c3[1] + 12} n={3} r={3.8} seed={70} />
      <Drop x={360 - c3[0]} y={c3[1] + 12} n={3} r={3.8} seed={90} />
      <Drop x={180} y={12} n={4} r={4.2} seed={20} />
    </svg>
  )
}

/* ── The view: Lake Pichola at dusk ─────────────────────────────── */

function Chhatri({ x, y, w, fill, line }: { x: number; y: number; w: number; fill: string; line: string }) {
  const h = w * 0.62
  return (
    <g>
      <path d={`M${r1(x - w / 2)} ${y}H${r1(x + w / 2)}V${r1(y - 1.4)}H${r1(x - w / 2)}Z`} fill={fill} stroke={line} strokeWidth={0.4} />
      <path d={`M${r1(x - w * 0.4)} ${r1(y - 1.4)}V${r1(y - h * 0.55)}M${r1(x + w * 0.4)} ${r1(y - 1.4)}V${r1(y - h * 0.55)}M${x} ${r1(y - 1.4)}V${r1(y - h * 0.55)}`} stroke={line} strokeWidth={0.6} />
      <path d={`M${r1(x - w / 2)} ${r1(y - h * 0.55)}H${r1(x + w / 2)}L${r1(x + w * 0.44)} ${r1(y - h * 0.62)}H${r1(x - w * 0.44)}Z`} fill={fill} stroke={line} strokeWidth={0.4} />
      <path d={`M${r1(x - w * 0.4)} ${r1(y - h * 0.62)}Q${r1(x - w * 0.4)} ${r1(y - h * 1.08)} ${x} ${r1(y - h * 1.12)}Q${r1(x + w * 0.4)} ${r1(y - h * 1.08)} ${r1(x + w * 0.4)} ${r1(y - h * 0.62)}Z`} fill={fill} stroke={line} strokeWidth={0.4} />
      <path d={`M${x} ${r1(y - h * 1.12)}V${r1(y - h * 1.34)}`} stroke={line} strokeWidth={0.6} />
    </g>
  )
}

function Palace({ fill, line, window: win }: { fill: string; line: string; window: string }) {
  return (
    <g>
      {/* ghats and the long lower storey */}
      <path d="M96 78H264V74H96Z" fill={line} opacity={0.35} />
      <rect x={104} y={58} width={152} height={16} fill={fill} stroke={line} strokeWidth={0.5} />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${109 + i * 11.4} 71V65.5Q${111.4 + i * 11.4} 62.5 ${113.8 + i * 11.4} 65.5V71Z`} fill={win} />
      ))}
      {/* upper storey and the jharokha balconies */}
      <rect x={122} y={47} width={116} height={11} fill={fill} stroke={line} strokeWidth={0.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${127 + i * 12.6} 56V51.4Q${129 + i * 12.6} 49.2 ${131 + i * 12.6} 51.4V56Z`} fill={win} />
      ))}
      <path d="M120 58H240M102 74H258" stroke={line} strokeWidth={0.6} />
      {/* the central pavilion and dome */}
      <rect x={166} y={36} width={28} height={11} fill={fill} stroke={line} strokeWidth={0.5} />
      <path d="M170 45V40Q172 38 174 40V45ZM178 45V40Q180 38 182 40V45ZM186 45V40Q188 38 190 40V45Z" fill={win} />
      <path d="M168 36Q168 24 180 22Q192 24 192 36Z" fill={fill} stroke={line} strokeWidth={0.5} />
      <path d="M180 22V17" stroke={line} strokeWidth={0.7} />
      <Chhatri x={130} y={47} w={11} fill={fill} line={line} />
      <Chhatri x={150} y={47} w={9} fill={fill} line={line} />
      <Chhatri x={210} y={47} w={9} fill={fill} line={line} />
      <Chhatri x={230} y={47} w={11} fill={fill} line={line} />
      <Chhatri x={108} y={58} w={9} fill={fill} line={line} />
      <Chhatri x={252} y={58} w={9} fill={fill} line={line} />
      {/* a shaded side for depth */}
      <path d="M238 47H256V74H238Z" fill={line} opacity={0.12} />
    </g>
  )
}

/** viewBox 0 0 360 120: hills, the Lake Palace on the water, its reflection. */
export function LakeView({ uid, className, style }: { uid: string; className?: string; style?: React.CSSProperties }) {
  const rand = rng(17)
  const ripples = Array.from({ length: 22 }, () => {
    const y = 82 + rand() * 36
    const x = rand() * 340
    const w = 10 + rand() * 38
    return `M${r1(x)} ${r1(y)}h${r1(w)}`
  }).join('')
  return (
    <svg viewBox="0 0 360 120" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1D2AE" stopOpacity={0} />
          <stop offset="1" stopColor="#EAB98E" />
        </linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B6C4B6" />
          <stop offset="1" stopColor="#7C9C94" />
        </linearGradient>
      </defs>
      <rect x={0} y={20} width={360} height={58} fill={`url(#${uid}-glow)`} />
      <path d="M0 62C24 50 50 44 78 54C98 40 128 34 156 50C186 38 220 40 248 52C274 40 318 38 360 54V78H0Z" fill="#C99C8F" opacity={0.5} />
      <path d="M0 70C34 60 66 60 96 68C130 58 168 60 196 68C232 58 280 58 360 66V78H0Z" fill="#B7897D" opacity={0.5} />
      <rect x={0} y={77} width={360} height={43} fill={`url(#${uid}-water)`} />
      <g transform="translate(0 155) scale(1 -1)" opacity={0.26}>
        <Palace fill="#FFF8EC" line="#6F5A45" window="#8A6E52" />
      </g>
      <path d={ripples} stroke="#EEF2EA" strokeWidth={0.8} strokeLinecap="round" opacity={0.55} />
      <Palace fill="#FBF3E6" line="#A88B68" window="#C29C72" />
      <path d="M58 94q6 3 14 0l-1.6 2.4h-10.8Z" fill="#5E4636" opacity={0.7} />
      <path d="M65 94V88" stroke="#5E4636" strokeWidth={0.6} opacity={0.7} />
    </svg>
  )
}

/** viewBox 0 0 360 60: a marble railing with pierced jaali panels between posts. */
export function Balustrade({ uid, className, style }: { uid: string; className?: string; style?: React.CSSProperties }) {
  const posts = [0, 70, 145, 205, 280, 350]
  return (
    <svg viewBox="0 0 360 60" className={className} style={style} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={`${uid}-jaali`} width={12} height={12} patternUnits="userSpaceOnUse">
          <rect width={12} height={12} fill="#EFE5D3" />
          <path d="M6 1.4L7.3 4.7 10.6 6 7.3 7.3 6 10.6 4.7 7.3 1.4 6 4.7 4.7Z" fill="#7F5E3E" opacity={0.62} />
          <path d="M0 0l1.3 1.3L0 2.6ZM12 0l-1.3 1.3L12 2.6ZM0 12l1.3-1.3L0 9.4ZM12 12l-1.3-1.3L12 9.4Z" fill="#7F5E3E" opacity={0.5} />
        </pattern>
      </defs>
      <rect x={0} y={9} width={360} height={42} fill={`url(#${uid}-jaali)`} />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x} y={9} width={10} height={42} fill="#F3EBDD" stroke="#CDB795" strokeWidth={0.6} />
          <path d={`M${x + 2} 14H${x + 8}M${x + 2} 46H${x + 8}`} stroke="#CDB795" strokeWidth={0.6} />
        </g>
      ))}
      <rect x={0} y={0} width={360} height={9} fill="#F4ECDF" />
      <path d="M0 1.6H360" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={1} />
      <path d="M0 9H360" stroke="#BFA47C" strokeWidth={0.9} />
      <rect x={0} y={51} width={360} height={9} fill="#E7DAC4" />
      <path d="M0 51H360" stroke="#BFA47C" strokeWidth={0.9} />
    </svg>
  )
}

/* ── The palace doors ─────────────────────────────────────────────── */

/** Doorway geometry, shared by the leaves and the carved frame: 400 × 640, springing 170 below the crown. */
const DOOR = cuspedArch(400, 170, 4, 0, 0, 0.58)
const LEAF = `M0 640L0 170${DOOR.left}L200 640Z`

/** Frame viewBox 520 × 800; the doorway sits at (60, 120). */
export const FRAME = { w: 520, h: 800, x: 60, y: 120, dw: 400, dh: 640 }
const DW = cuspedArch(400, 170, 4, 60, 120, 0.58)
const FO = cuspedArch(450, 195, 4, 35, 95, 0.58)
const FM = cuspedArch(426, 183, 4, 47, 107, 0.58)

/** The peacock's train, fanned inside the arch panel of the left leaf. */
const FAN = (() => {
  const cx = 150
  const cy = 184
  const inside = (x: number, y: number) =>
    x > 22 && x < 182 && y < 188 && ((x - 200) / 172) ** 2 + ((y - 170) / 146) ** 2 < 1 && y > 20
  const rays: { a: number; R: number }[] = []
  const n = 9
  for (let i = 0; i < n; i++) {
    const a = ((188 + (i / (n - 1)) * 92) * Math.PI) / 180
    let R0 = 0
    while (R0 < 220 && inside(cx + (R0 + 1) * Math.cos(a), cy + (R0 + 1) * Math.sin(a))) R0++
    rays.push({ a, R: R0 - 6 })
  }
  const outline: string[] = []
  const edge: Pt[] = rays.map(({ a, R: rr }) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  outline.push(`M${cx} ${cy}`)
  edge.forEach((p, i) => {
    if (i === 0) outline.push(`L${r1(p[0])} ${r1(p[1])}`)
    else {
      const prev = edge[i - 1]
      const mx = (prev[0] + p[0]) / 2
      const my = (prev[1] + p[1]) / 2
      // push the scallop outwards a touch between feathers
      const dx = mx - cx
      const dy = my - cy
      const l = Math.hypot(dx, dy)
      outline.push(`Q${r1(mx + (dx / l) * 7)} ${r1(my + (dy / l) * 7)} ${r1(p[0])} ${r1(p[1])}`)
    }
  })
  outline.push('Z')
  const eyes = rays.map(({ a, R: rr }) => ({ x: cx + rr * 0.86 * Math.cos(a), y: cy + rr * 0.86 * Math.sin(a), deg: (a * 180) / Math.PI }))
  const inner = rays.slice(0, -1).map(({ a, R: rr }, i) => {
    const b = (a + rays[i + 1].a) / 2
    const rr2 = Math.min(rr, rays[i + 1].R) * 0.58
    return { x: cx + rr2 * Math.cos(b), y: cy + rr2 * Math.sin(b), deg: (b * 180) / Math.PI }
  })
  const quills = rays.map(({ a, R: rr }) => `M${cx} ${cy}L${r1(cx + rr * 0.8 * Math.cos(a))} ${r1(cy + rr * 0.8 * Math.sin(a))}`).join('')
  return { outline: outline.join(''), eyes, inner, quills, cx, cy }
})()

function Eye({ x, y, deg, s = 1 }: { x: number; y: number; deg: number; s?: number }) {
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)}) scale(${s})`}>
      <ellipse rx={8} ry={5.4} fill={R.goldLight} />
      <ellipse rx={5.6} ry={3.8} cx={0.6} fill={R.tealLight} />
      <ellipse rx={3} ry={2.2} cx={1} fill="#123B3A" />
      <circle cx={1.6} cy={-0.4} r={0.8} fill={R.goldPale} />
    </g>
  )
}

function Rosette({ x, y, r, petals = 8, fill, line, core }: { x: number; y: number; r: number; petals?: number; fill: string; line: string; core: string }) {
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={`o${i}`}
          d={`M0 0C${r1(r * 0.34)} ${r1(-r * 0.3)} ${r1(r * 0.3)} ${r1(-r * 0.8)} 0 ${r1(-r)}C${r1(-r * 0.3)} ${r1(-r * 0.8)} ${r1(-r * 0.34)} ${r1(-r * 0.3)} 0 0Z`}
          transform={`rotate(${(360 / petals) * i + 180 / petals})`}
          fill={fill}
          stroke={line}
          strokeWidth={0.8}
          opacity={0.7}
        />
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={`i${i}`}
          d={`M0 0C${r1(r * 0.3)} ${r1(-r * 0.26)} ${r1(r * 0.26)} ${r1(-r * 0.66)} 0 ${r1(-r * 0.82)}C${r1(-r * 0.26)} ${r1(-r * 0.66)} ${r1(-r * 0.3)} ${r1(-r * 0.26)} 0 0Z`}
          transform={`rotate(${(360 / petals) * i})`}
          fill={fill}
          stroke={line}
          strokeWidth={0.8}
        />
      ))}
      <circle r={r * 0.24} fill={core} stroke={line} strokeWidth={0.8} />
    </g>
  )
}

function Paisley({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={R.goldLight} strokeWidth={1.1}>
      <path d="M0 14C-12 14-16 2-10-6C-5-13 6-14 10-20C12-12 12-4 8 4C5 10 3 14 0 14Z" />
      <path d="M-1 8C-7 8-9 1-6-3C-3-7 3-8 5-11C6-6 5-1 3 3C2 6 1 8-1 8Z" strokeWidth={0.8} />
      <circle cx={-3} cy={2} r={1.6} fill={R.goldLight} stroke="none" />
      {[-22, -9, 4, 16].map((a, i) => (
        <circle key={i} cx={r1(14 * Math.cos((a * Math.PI) / 180))} cy={r1(-2 + 18 * Math.sin((a * Math.PI) / 180))} r={1} fill={R.goldLight} stroke="none" />
      ))}
    </g>
  )
}

function stud(id: string, x: number, y: number, r = 4.2, key?: string) {
  return (
    <g key={key ?? `${x}-${y}`}>
      <circle cx={x + 0.9} cy={y + 1.3} r={r} fill="rgba(25,4,6,0.5)" />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-stud)`} />
    </g>
  )
}

/**
 * One leaf of the palace door (left-hand; the right leaf is its mirror).
 * viewBox 0 0 200 640, hinge on the left, meeting edge on the right.
 */
export function DoorLeaf({ side, letter }: { side: 'l' | 'r'; letter: string }) {
  // Per-instance ids: the builder mounts two previews, and a url(#id) that
  // resolves into the hidden one paints nothing.
  const id = `rw-door-${side}-${useId().replace(/:/g, '')}`
  const rails = [200, 380, 478]
  const railStuds = rails.flatMap((y) => Array.from({ length: 8 }, (_, i) => [28 + i * 21.5, y] as Pt))
  const stileStuds = Array.from({ length: 21 }, (_, i) => 34 + i * 28.6)
    .filter((y) => (y < 232 || y > 348) && (y < 392 || y > 462))
    .map((y) => [192, y] as Pt)
  const spikes = [506, 538, 570, 602].flatMap((y) => [48, 80, 112, 144].map((x) => [x, y] as Pt))
  const art = (
    <g clipPath={`url(#${id}-clip)`}>
      <rect x={-16} width={216} height={640} fill={`url(#${id}-lac)`} />
      {/* recessed panels */}
      {[
        [16, 207, 168, 166],
        [16, 386, 168, 86],
        [16, 484, 168, 140],
      ].map(([x, y, w, h]) => (
        <g key={y}>
          <rect x={x} y={y} width={w} height={h} fill={R.lacquerDeep} />
          <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} fill="none" stroke={R.gold} strokeWidth={1} />
          <path d={`M${x} ${y + h}H${x + w}V${y}`} fill="none" stroke="rgba(255,220,160,0.14)" strokeWidth={1.4} />
        </g>
      ))}
      {/* the arch panel: a peacock with its train fanned */}
      <path d={LEAF} fill="none" stroke={R.goldDark} strokeWidth={50} />
      <path d={LEAF} fill="none" stroke={`url(#${id}-lac)`} strokeWidth={47} />
      <path d={FAN.outline} fill="#16423F" stroke={R.gold} strokeWidth={1} />
      <path d={FAN.quills} stroke={R.gold} strokeWidth={0.6} opacity={0.8} />
      {FAN.inner.map((e, i) => (
        <Eye key={`in${i}`} {...e} s={0.72} />
      ))}
      {FAN.eyes.map((e, i) => (
        <Eye key={`e${i}`} {...e} />
      ))}
      <g stroke={R.goldDark} strokeWidth={0.8}>
        <path d="M143 188V178M151 188V179" stroke={R.goldLight} strokeWidth={1.4} />
        <path d="M134 176C132 164 142 154 156 156C166 157 170 166 166 174C160 182 142 184 134 176Z" fill="#1F6A63" />
        <path d="M156 160C166 150 160 128 166 112L175 113C171 130 176 150 166 164Z" fill="#2A8077" />
        <path d="M158 158C164 150 162 136 165 124" fill="none" stroke={R.goldLight} strokeWidth={0.7} />
        <circle cx={171} cy={108} r={6.4} fill="#2A8077" />
        <path d="M176 106L186 109L176 111Z" fill={R.goldLight} />
        <circle cx={172.6} cy={107} r={1.6} fill="#FFF6E0" stroke="none" />
        <circle cx={173} cy={107} r={0.8} fill="#0F2A28" stroke="none" />
        <path d="M169 102L163 90M171 101.5L171 88M173 102L179 90" stroke={R.goldLight} strokeWidth={0.8} />
        <circle cx={163} cy={89} r={1.7} fill={R.goldLight} stroke="none" />
        <circle cx={171} cy={87} r={1.7} fill={R.goldLight} stroke="none" />
        <circle cx={179} cy={89} r={1.7} fill={R.goldLight} stroke="none" />
        <path d="M140 170C146 166 154 166 160 170M142 176C148 173 154 173 160 175" fill="none" stroke={R.goldLight} strokeWidth={0.6} />
      </g>
      {/* rails, meeting stile */}
      {rails.map((y) => (
        <rect key={y} x={0} y={y - 6.5} width={200} height={13} fill={`url(#${id}-brass)`} stroke={R.goldDark} strokeWidth={0.8} />
      ))}
      <rect x={184} y={0} width={16} height={640} fill={`url(#${id}-brassV)`} stroke={R.goldDark} strokeWidth={0.8} />
      {/* the brass strap round the edge */}
      <path d={LEAF} fill="none" stroke="#380B0E" strokeWidth={31} />
      <path d={LEAF} fill="none" stroke={R.goldDark} strokeWidth={27} />
      <path d={LEAF} fill="none" stroke={`url(#${id}-brass)`} strokeWidth={21} />
      <path d={LEAF} fill="none" stroke="#2A0709" strokeWidth={2} />
      {/* lotus in the upper panel, a paisley in the middle one */}
      <Rosette x={94} y={290} r={36} fill={R.goldLight} line={R.goldDark} core={R.vermilion} petals={8} />
      <circle cx={94} cy={290} r={46} fill="none" stroke={R.gold} strokeWidth={0.8} strokeDasharray="0.1 5" strokeLinecap="round" />
      <Paisley x={82} y={432} s={1.05} />
      {/* strap hinges */}
      {[200, 478].map((y) => (
        <g key={`h${y}`}>
          <path d={`M0 ${y - 8}H66C76 ${y - 8} 84 ${y - 4} 90 ${y}C84 ${y + 4} 76 ${y + 8} 66 ${y + 8}H0Z`} fill={`url(#${id}-brass)`} stroke={R.goldDark} strokeWidth={0.9} />
          <path d={`M90 ${y}C94 ${y - 8} 102 ${y - 8} 104 ${y}C102 ${y + 8} 94 ${y + 8} 90 ${y}Z`} fill={R.goldLight} stroke={R.goldDark} strokeWidth={0.8} />
          {stud(id, 16, y, 3.6, `hs1${y}`)}
          {stud(id, 38, y, 3.6, `hs2${y}`)}
          {stud(id, 60, y, 3.6, `hs3${y}`)}
        </g>
      ))}
      {railStuds.filter(([x, y]) => !(x < 70 && (y === 200 || y === 478))).map(([x, y]) => stud(id, x, y, 3.6))}
      {stileStuds.map(([x, y]) => stud(id, x, y, 3.8))}
      {spikes.map(([x, y]) => (
        <g key={`s${x}-${y}`}>
          <circle cx={x} cy={y} r={9} fill="none" stroke={R.gold} strokeWidth={0.8} />
          {stud(id, x, y, 6.2, `sp${x}${y}`)}
        </g>
      ))}
      {/* the monogram boss, half on each leaf */}
      <circle cx={201.5} cy={292} r={48} fill="rgba(25,4,6,0.45)" />
      <circle cx={200} cy={290} r={48} fill={`url(#${id}-boss)`} stroke={R.goldDark} strokeWidth={1} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return stud(id, 200 + 41.5 * Math.cos(a), 290 + 41.5 * Math.sin(a), 2.6, `b${i}`)
      })}
      <circle cx={200} cy={290} r={34} fill={R.maroonDeep} stroke={R.goldLight} strokeWidth={1.6} />
      <circle cx={200} cy={290} r={29.5} fill="none" stroke={R.gold} strokeWidth={0.6} />
      {/* the ring knocker */}
      <g>
        <Rosette x={158} y={402} r={13} fill={R.goldLight} line={R.goldDark} core={R.goldDark} petals={8} />
        <g className="rw-ring">
          <circle cx={158} cy={428} r={19} fill="none" stroke="rgba(25,4,6,0.5)" strokeWidth={6.5} transform="translate(1.2 2)" />
          <circle cx={158} cy={428} r={19} fill="none" stroke={`url(#${id}-brass)`} strokeWidth={6.5} />
          <circle cx={158} cy={428} r={19} fill="none" stroke={R.goldDark} strokeWidth={0.8} />
          <path d="M142 422A17 17 0 0 1 152 411" fill="none" stroke={R.goldPale} strokeWidth={1.3} strokeLinecap="round" />
          <circle cx={158} cy={409} r={3.4} fill={R.goldLight} stroke={R.goldDark} strokeWidth={0.8} />
        </g>
      </g>
      <path d="M199.3 0V640" stroke="#1E0508" strokeWidth={1.4} />
      <rect className="rw-shade" x={-16} width={216} height={640} fill={`url(#${id}-shade)`} />
    </g>
  )
  return (
    <svg viewBox="0 0 200 640" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <clipPath id={`${id}-clip`}>
          {/* in the art's own (unmirrored) space: the clip is referenced from inside the mirror */}
          <path d={LEAF} />
        </clipPath>
        <linearGradient id={`${id}-lac`} x1="0" y1="0" x2="0" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#84262A" />
          <stop offset="0.55" stopColor={R.lacquer} />
          <stop offset="1" stopColor="#5A161B" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EACD85" />
          <stop offset="0.5" stopColor="#C49A45" />
          <stop offset="1" stopColor="#8E6A27" />
        </linearGradient>
        <linearGradient id={`${id}-brassV`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E6A27" />
          <stop offset="0.45" stopColor="#E3C27A" />
          <stop offset="1" stopColor="#9A7430" />
        </linearGradient>
        <radialGradient id={`${id}-stud`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#FFF1C4" />
          <stop offset="0.35" stopColor="#D9B462" />
          <stop offset="1" stopColor="#7C5A1E" />
        </radialGradient>
        <radialGradient id={`${id}-boss`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#EFD48E" />
          <stop offset="0.6" stopColor="#C29844" />
          <stop offset="1" stopColor="#8A6424" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#12030A" stopOpacity={0.85} />
          <stop offset="1" stopColor="#12030A" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      {side === 'l' ? art : <g transform="translate(200 0) scale(-1 1)">{art}</g>}
      <text
        x={side === 'l' ? 181 : 19}
        y={303}
        textAnchor="middle"
        fontSize={34}
        fill={R.goldLight}
        style={{ fontFamily: 'var(--rw-display)' }}
      >
        {letter}
      </text>
    </svg>
  )
}

/** The carved sandstone surround, and the wall around it: one path with the doorway cut out. */
export function DoorFrame({ className }: { className?: string }) {
  const ashlar = `rw-ashlar-${useId().replace(/:/g, '')}`
  const doorway = `M60 760L60 290${DW.left}${DW.right}L460 760Z`
  const outer = `M35 760L35 290${FO.left}${FO.right}L485 760Z`
  const merlons = Array.from({ length: 11 }, (_, i) => 10 + i * 46.4)
  const rays = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2)
  return (
    <svg viewBox="0 0 520 800" className={className} style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <pattern id={ashlar} width={120} height={56} patternUnits="userSpaceOnUse">
          <rect width={120} height={56} fill={R.sand} />
          <rect x={0} y={0} width={60} height={28} fill="#DBBE8E" />
          <rect x={60} y={0} width={60} height={28} fill="#D4B584" />
          <rect x={30} y={28} width={60} height={28} fill="#D9BB8A" />
          <rect x={90} y={28} width={30} height={28} fill="#D2B281" />
          <rect x={0} y={28} width={30} height={28} fill="#D2B281" />
          <path d="M0 0.5H120M0 28.5H120M0.5 0V28M60.5 0V28M30.5 28V56M90.5 28V56" stroke="#B7955F" strokeWidth={1} opacity={0.7} />
          <path d="M0 1.5H120M0 29.5H120" stroke="#EBD6AE" strokeWidth={0.8} opacity={0.6} />
        </pattern>
      </defs>
      {/* The wall, with the doorway cut out of it. */}
      <path d={`M-2600 -2600H3120V3400H-2600Z${doorway}`} fillRule="evenodd" fill={`url(#${ashlar})`} />
      {/* Kangura battlements and the eave. */}
      {merlons.map((x) => (
        <path key={x} d={`M${x} 34V20Q${x} 17 ${x + 3} 17H${x + 8}Q${x + 8} 8 ${x + 16} 5Q${x + 24} 8 ${x + 24} 17H${x + 29}Q${x + 32} 17 ${x + 32} 20V34Z`} fill={R.sandLight} stroke={R.sandShadow} strokeWidth={1} />
      ))}
      <path d="M-6 34H526V46H-6Z" fill={R.sandLight} stroke={R.sandShadow} strokeWidth={1} />
      <path d="M-6 46H526L516 56H4Z" fill={R.sandDeep} stroke={R.sandShadow} strokeWidth={1} />
      {Array.from({ length: 13 }, (_, i) => 18 + i * 40.3).map((x) => (
        <path key={x} d={`M${x} 56h8v6q-4 6-8 0Z`} fill={R.sandDeep} stroke={R.sandShadow} strokeWidth={0.8} />
      ))}
      {/* Alfiz frame and spandrels. */}
      <path d={`M10 64H510V290H10ZM35 290${FO.left}${FO.right}Z`} fillRule="evenodd" fill="#D3B27F" stroke={R.sandShadow} strokeWidth={1.2} />
      <path d="M16 70H504V290" fill="none" stroke={R.sandShadow} strokeWidth={0.8} opacity={0.6} />
      <path d="M16 290V70" fill="none" stroke={R.sandShadow} strokeWidth={0.8} opacity={0.6} />
      <Rosette x={60} y={118} r={20} fill={R.sandLight} line={R.sandShadow} core={R.vermilion} />
      <Rosette x={460} y={118} r={20} fill={R.sandLight} line={R.sandShadow} core={R.vermilion} />
      {/* The sun of Mewar over the crown. */}
      <g transform="translate(260 76)">
        {rays.map((a, i) => (
          <path
            key={i}
            d={i % 2 ? `M${r1(13 * Math.cos(a))} ${r1(13 * Math.sin(a))}L${r1(19 * Math.cos(a))} ${r1(19 * Math.sin(a))}` : `M${r1(13 * Math.cos(a - 0.12))} ${r1(13 * Math.sin(a - 0.12))}L${r1(22 * Math.cos(a))} ${r1(22 * Math.sin(a))}L${r1(13 * Math.cos(a + 0.12))} ${r1(13 * Math.sin(a + 0.12))}Z`}
            fill={R.goldLight}
            stroke={R.goldDark}
            strokeWidth={0.8}
          />
        ))}
        <circle r={12} fill={R.goldLight} stroke={R.goldDark} strokeWidth={1} />
        <circle r={8} fill="none" stroke={R.goldDark} strokeWidth={0.8} />
      </g>
      {/* The architrave: a carved band with a row of beads. */}
      <path d={`${outer}${doorway}`} fillRule="evenodd" fill={R.sandLight} />
      <path d={outer} fill="none" stroke={R.sandShadow} strokeWidth={1.6} />
      <path d={`M47 760L47 290${FM.left}${FM.right}L473 760`} fill="none" stroke={R.sandShadow} strokeWidth={4.2} strokeDasharray="0.1 8" strokeLinecap="round" />
      <path d={doorway} fill="none" stroke="#3E2713" strokeWidth={3} />
      {DW.cusps.map(([x, y], i) => (
        <path key={i} d={`M${r1(x)} ${r1(y + 3)}l-2.4 5 2.4 5 2.4-5Z`} fill={R.goldLight} stroke={R.goldDark} strokeWidth={0.6} />
      ))}
      {/* Pilasters. */}
      {[10, 485].map((x) => (
        <g key={x}>
          <rect x={x} y={296} width={25} height={436} fill="#DDC191" stroke={R.sandShadow} strokeWidth={1} />
          <path d={`M${x + 7} 304V724M${x + 12.5} 304V724M${x + 18} 304V724`} stroke={R.sandShadow} strokeWidth={0.8} opacity={0.7} />
          <path d={`M${x - 4} 290H${x + 29}V296H${x - 4}Z`} fill={R.sandLight} stroke={R.sandShadow} strokeWidth={1} />
          <path d={`M${x - 3} 732H${x + 28}V744H${x - 3}Z`} fill={R.sandLight} stroke={R.sandShadow} strokeWidth={1} />
        </g>
      ))}
      {/* The marble threshold. */}
      <path d="M-4 760H524V770H-4Z" fill="#F3EADA" stroke="#CDB795" strokeWidth={0.8} />
      <path d="M-4 770H524V800H-4Z" fill="#E6D8BF" stroke="#CDB795" strokeWidth={0.8} />
      <path d="M8 785H512" stroke={R.gold} strokeWidth={0.9} />
      {Array.from({ length: 9 }, (_, i) => 40 + i * 55).map((x) => (
        <path key={x} d={`M${x} 781l4 4-4 4-4-4Z`} fill={R.vermilion} opacity={0.75} />
      ))}
    </svg>
  )
}

/* ── Ornaments ─────────────────────────────────────────────────────── */

/** Small lotus bud between two gold rules, for headings. */
export function LotusMark({ color = R.gold, className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 22" className={className} fill="none" aria-hidden>
      <path d="M4 14H42M78 14H116" stroke={color} strokeWidth={1} />
      <circle cx={4} cy={14} r={1.6} fill={color} />
      <circle cx={116} cy={14} r={1.6} fill={color} />
      <path d="M60 2C65 7 66 12 60 18C54 12 55 7 60 2Z" fill={color} />
      <path d="M58 18C50 17 46 12 46 7C53 8 57 12 58 18ZM62 18C70 17 74 12 74 7C67 8 63 12 62 18Z" fill={color} opacity={0.75} />
      <path d="M48 20H72" stroke={color} strokeWidth={1} />
    </svg>
  )
}

/** A row of kangura battlements, used as the top edge of maroon bands. */
export function kanguraEdge(color: string): React.CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='16' viewBox='0 0 30 16'><path d='M3 16V8Q3 6 5 6H9Q9 1.5 15 0Q21 1.5 21 6H25Q27 6 27 8V16Z' fill='${color}'/></svg>`
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'center bottom',
    backgroundSize: '30px 16px',
  }
}

/** The brass boss with the monogram, for the foot of the page. */
export function Boss({ letters, className }: { letters: [string, string]; className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id={`rw-foot-boss-${uid}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#EFD48E" />
          <stop offset="0.6" stopColor="#C29844" />
          <stop offset="1" stopColor="#8A6424" />
        </radialGradient>
        <radialGradient id={`rw-foot-stud-${uid}`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#FFF1C4" />
          <stop offset="0.35" stopColor="#D9B462" />
          <stop offset="1" stopColor="#7C5A1E" />
        </radialGradient>
      </defs>
      <circle cx={61.5} cy={62} r={52} fill="rgba(59,29,22,0.22)" />
      <circle cx={60} cy={60} r={52} fill={`url(#rw-foot-boss-${uid})`} stroke={R.goldDark} strokeWidth={1} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <circle key={i} cx={r1(60 + 45 * Math.cos(a))} cy={r1(60 + 45 * Math.sin(a))} r={2.8} fill={`url(#rw-foot-stud-${uid})`} stroke="rgba(80,50,10,0.5)" strokeWidth={0.4} />
      })}
      <circle cx={60} cy={60} r={37} fill={R.maroonDeep} stroke={R.goldLight} strokeWidth={1.6} />
      <circle cx={60} cy={60} r={32.5} fill="none" stroke={R.gold} strokeWidth={0.6} />
      <text x={41} y={72} textAnchor="middle" fontSize={32} fill={R.goldLight} style={{ fontFamily: 'var(--rw-display)' }}>
        {letters[0]}
      </text>
      <path d="M60 44V76" stroke={R.gold} strokeWidth={0.8} />
      <text x={79} y={72} textAnchor="middle" fontSize={32} fill={R.goldLight} style={{ fontFamily: 'var(--rw-display)' }}>
        {letters[1]}
      </text>
    </svg>
  )
}

/** A photograph (or anything) inside a cusped window; the spandrels are painted in `bg`. */
const WIN = cuspedArch(300, 104, 3, 0, 2, 0.6)
export function WindowArch({ bg, line = R.gold, className }: { bg: string; line?: string; className?: string }) {
  return (
    <svg viewBox="0 0 300 108" preserveAspectRatio="xMidYMin meet" className={className} aria-hidden>
      <path d={`M-2 -2H302V108H-2Z${WIN.d}L300 110L0 110Z`} fillRule="evenodd" fill={bg} />
      <path d={WIN.d} fill="none" stroke={line} strokeWidth={1.4} />
    </svg>
  )
}

/* ── One motif per function ───────────────────────────────────────── */

const M = {
  line: '#4A1C15',
  brass: '#D2A84E',
  brassLight: '#EBCB82',
  brassDark: '#9E7428',
  turmeric: '#E6AE1C',
  leaf: '#5E7A32',
  leafLight: '#7A9442',
  skin: '#EFD2AE',
  henna: '#8E3B1D',
  vermilion: '#C0432F',
  maroon: '#7A2025',
  flame: '#EE8A23',
  flameCore: '#F6C640',
  brick: '#B8573B',
  brickLight: '#CF7454',
  crystal: '#FBF6EA',
  teal: '#2E6F69',
  petal: '#E3927E',
  petalDeep: '#C9604F',
}

export type MotifKind = 'haldi' | 'mehendi' | 'sangeet' | 'pheras' | 'reception' | 'baraat' | 'rings' | 'lotus'

export function motifFor(name: string): MotifKind {
  const n = name.toLowerCase()
  if (/haldi|pithi|ubtan|mayra|mangala snanam/.test(n)) return 'haldi'
  if (/mehendi|mehndi|henna/.test(n)) return 'mehendi'
  if (/sangeet|sangit|garba|dandiya|music|mehfil|dance/.test(n)) return 'sangeet'
  if (/reception|dinner|party|cocktail|gala|banquet|lunch/.test(n)) return 'reception'
  if (/baraat|barat|ghudchadi|nikasi|sehra|groom'?s? procession/.test(n)) return 'baraat'
  if (/engage|sagai|roka|ring|tilak|mangni|misri|sagan|shagun/.test(n)) return 'rings'
  if (/phera|vivah|wedding|shaadi|shadi|lagna|lagan|ceremony|saat|varmala|jaimala|kanyadaan|mandap|marriage/.test(n)) return 'pheras'
  return 'lotus'
}

const S = { stroke: M.line, strokeWidth: 1.3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

export function Motif({ kind, className }: { kind: MotifKind; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {kind === 'haldi' && (
        <g {...S}>
          <path d="M30 25C22 14 12 11 5 13C10 20 19 25 30 27Z" fill={M.leaf} />
          <path d="M34 25C43 13 53 11 59 13C54 20 45 25 34 27Z" fill={M.leafLight} />
          <path d="M9 32H55C54 43 45 50 32 50C19 50 10 43 9 32Z" fill={M.brass} />
          <path d="M15 38C18 44 25 47 32 47" fill="none" stroke={M.brassLight} strokeWidth={1.6} />
          <ellipse cx={32} cy={32} rx={23} ry={3.4} fill={M.brassLight} />
          <path d="M15 32C18 24 25 20 32 20C40 20 46 24 49 32Z" fill={M.turmeric} />
          <path d="M22 27C26 24 30 23 34 23" fill="none" stroke="#F6D36A" strokeWidth={1.2} />
          <path d="M24 50L22 55H42L40 50" fill={M.brassDark} />
          <circle cx={10} cy={56} r={2} fill={M.flame} strokeWidth={0.8} />
          <circle cx={53} cy={57} r={1.8} fill={M.vermilion} strokeWidth={0.8} />
          <circle cx={57} cy={51} r={1.5} fill={M.flame} strokeWidth={0.8} />
        </g>
      )}
      {kind === 'mehendi' && (
        <g>
          {/* outline pass, then fill pass: the union reads as one hand */}
          <g fill={M.line} stroke={M.line} strokeWidth={2.6} strokeLinejoin="round">
            <HandShapes />
          </g>
          <g fill={M.skin}>
            <HandShapes />
          </g>
          <g fill={M.henna} stroke="none">
            <circle cx={23.4} cy={12.6} r={2.8} />
            <circle cx={30.5} cy={8.6} r={2.8} />
            <circle cx={37.2} cy={10.2} r={2.8} />
            <circle cx={43.6} cy={16.4} r={2.6} />
            <circle cx={13.2} cy={34} r={2.6} />
          </g>
          <g fill="none" stroke={M.henna} strokeWidth={0.9} strokeLinecap="round">
            <circle cx={33} cy={41} r={6.2} />
            <circle cx={33} cy={41} r={2.4} fill={M.henna} />
            <path d="M24 20h4M30.5 18h4M37 19h4M43 24h3.4M24 25h4M30.5 24h4M37 25h4" />
            <path d="M24 55h18M24 58.5h18" />
          </g>
          <g fill={M.henna}>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2
              return <circle key={i} cx={r1(33 + 9 * Math.cos(a))} cy={r1(41 + 9 * Math.sin(a))} r={0.9} />
            })}
            <circle cx={17.6} cy={38.6} r={0.9} />
            <circle cx={20} cy={41.4} r={0.9} />
          </g>
        </g>
      )}
      {kind === 'sangeet' && (
        <g {...S} transform="rotate(-10 32 34)">
          <path d="M13 23C22 19 42 19 51 23V45C42 49 22 49 13 45Z" fill={M.vermilion} />
          <path d="M16 27C26 24 38 24 48 27" fill="none" stroke="#DB6A52" strokeWidth={1.6} />
          <path d="M16 24.5L22 46L28 23L34 46.5L40 23L46 46" fill="none" stroke={M.brassLight} strokeWidth={1.2} />
          {[22, 34, 46].map((x) => (
            <circle key={x} cx={x} cy={43.5} r={1.4} fill={M.brass} strokeWidth={0.7} />
          ))}
          <ellipse cx={13} cy={34} rx={4.6} ry={11.4} fill={M.crystal} />
          <ellipse cx={51} cy={34} rx={4.6} ry={11.4} fill={M.crystal} />
          <ellipse cx={51} cy={34} rx={2.2} ry={6} fill="none" strokeWidth={0.8} />
          <path d="M9 38C4 42 4 49 7 54M7 54l-2 4M7 54l2.6 3.4" fill="none" stroke={M.brassDark} strokeWidth={1.1} />
        </g>
      )}
      {kind === 'pheras' && (
        <g {...S}>
          <path d="M32 6C39 15 43 22 39 31C37 35 27 35 25 31C21 22 26 15 32 6Z" fill={M.flame} />
          <path d="M32 16C35 21 36 25 34 30C33 32 31 32 30 30C28 25 29 21 32 16Z" fill={M.flameCore} strokeWidth={0.9} />
          <path d="M22 18C26 23 27 28 25 33C23 35 19 34 18 31C17 26 19 22 22 18Z" fill={M.flameCore} />
          <path d="M42 18C45 22 47 27 46 31C45 34 41 35 39 33C38 28 39 23 42 18Z" fill={M.flameCore} />
          <path d="M20 33L44 28M20 28L44 33" stroke="#6B3A1C" strokeWidth={2} />
          <path d="M8 34H56L52 41H12Z" fill={M.brickLight} />
          <path d="M12 41H52L49 47H15Z" fill={M.brick} />
          <path d="M15 47H49L46 53H18Z" fill={M.brickLight} />
          <path d="M6 56H58" />
          {[17, 27, 37, 47].map((x) => (
            <circle key={x} cx={x} cy={37.5} r={1.2} fill={M.flameCore} strokeWidth={0.6} />
          ))}
        </g>
      )}
      {kind === 'reception' && (
        <g {...S}>
          <path d="M32 2V10" strokeDasharray="1.6 1.4" />
          <path d="M27 12Q32 8 37 12V14H27Z" fill={M.brass} />
          <path d="M32 14V22" />
          <path d="M26 30C26 24 29 21 32 21C35 21 38 24 38 30C38 36 35 38 32 38C29 38 26 36 26 30Z" fill={M.brass} />
          <path d="M26 30C20 30 14 28 10 23M38 30C44 30 50 28 54 23M28 36C24 40 19 41 15 39M36 36C40 40 45 41 49 39" fill="none" stroke={M.brassDark} strokeWidth={1.5} />
          {[
            [10, 23],
            [54, 23],
            [15, 39],
            [49, 39],
          ].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <path d={`M${x - 3} ${y}H${x + 3}L${x + 2} ${y + 2}H${x - 2}Z`} fill={M.brass} strokeWidth={0.8} />
              <rect x={x - 1.3} y={y - 5} width={2.6} height={5} fill={M.crystal} strokeWidth={0.7} />
              <path d={`M${x} ${y - 5}C${x + 1.6} ${y - 7} ${x + 1} ${y - 9} ${x} ${y - 10}C${x - 1} ${y - 9} ${x - 1.6} ${y - 7} ${x} ${y - 5}Z`} fill={M.flameCore} strokeWidth={0.6} />
              <path d={`M${x} ${y + 2}V${y + 5}`} strokeWidth={0.7} />
              <path d={`M${x} ${y + 5}C${x + 1.8} ${y + 7} ${x + 1.4} ${y + 9} ${x} ${y + 10}C${x - 1.4} ${y + 9} ${x - 1.8} ${y + 7} ${x} ${y + 5}Z`} fill={M.crystal} strokeWidth={0.7} />
            </g>
          ))}
          {[20, 26, 32, 38, 44].map((x, i) => (
            <path key={x} d={`M${x} ${31 + (i % 2) * 3}C${x + 1.6} ${34 + (i % 2) * 3} ${x + 1.2} ${36 + (i % 2) * 3} ${x} ${37 + (i % 2) * 3}C${x - 1.2} ${36 + (i % 2) * 3} ${x - 1.6} ${34 + (i % 2) * 3} ${x} ${31 + (i % 2) * 3}Z`} fill={M.crystal} strokeWidth={0.7} />
          ))}
          <path d="M32 38V46" />
          <path d="M32 46C35 50 35 55 32 60C29 55 29 50 32 46Z" fill={M.crystal} />
        </g>
      )}
      {kind === 'baraat' && (
        <g {...S}>
          <path d="M11 42C8 27 19 14 33 14C47 14 57 26 53 42C43 46 21 46 11 42Z" fill={M.vermilion} />
          <path d="M13 34C24 26 40 22 53 28M12 28C22 20 36 17 49 19M20 42C27 33 38 26 52 36" fill="none" stroke={M.maroon} strokeWidth={1} opacity={0.7} />
          {Array.from({ length: 18 }, (_, i) => {
            const rand = rng(90 + i)
            return <circle key={i} cx={r1(16 + rand() * 32)} cy={r1(20 + rand() * 20)} r={0.8} fill={M.crystal} stroke="none" />
          })}
          <path d="M11 42C21 47 43 47 53 42L53 46C43 51 21 51 11 46Z" fill={M.brass} />
          <path d="M52 34C59 40 59 50 55 58L52 57C55 50 55 43 50 38Z" fill={M.vermilion} />
          <path d="M33 30C29 20 33 10 42 5C40 12 38 20 35 30Z" fill={M.teal} />
          <path d="M34 28C33 20 36 12 42 5" fill="none" stroke={M.brassLight} strokeWidth={0.8} />
          <ellipse cx={33.5} cy={32} rx={4} ry={5} fill={M.brassLight} />
          <circle cx={33.5} cy={32} r={2} fill={M.teal} strokeWidth={0.8} />
          <path d="M31 37C31 41 36 41 36 37" fill="none" strokeWidth={0.9} />
        </g>
      )}
      {kind === 'rings' && (
        <g strokeLinecap="round">
          <circle cx={25} cy={39} r={13} fill="none" stroke={M.line} strokeWidth={5.6} />
          <circle cx={25} cy={39} r={13} fill="none" stroke={M.brass} strokeWidth={3.4} />
          <circle cx={39} cy={35} r={13} fill="none" stroke={M.line} strokeWidth={5.6} />
          <circle cx={39} cy={35} r={13} fill="none" stroke={M.brassLight} strokeWidth={3.4} />
          <path d="M34.6 26.8A13 13 0 0 1 37.2 29" fill="none" stroke={M.line} strokeWidth={5.6} />
          <path d="M31.4 27.6A13 13 0 0 1 36.8 30.6" fill="none" stroke={M.brass} strokeWidth={3.4} />
          <path d="M39 22L34 17L37 13H41L44 17Z" fill={M.teal} stroke={M.line} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M34 17H44M39 22L37.4 17L39 13L40.6 17Z" fill="none" stroke={M.crystal} strokeWidth={0.6} />
        </g>
      )}
      {kind === 'lotus' && (
        <g {...S}>
          <path d="M32 44C18 44 8 38 6 30C16 30 26 36 32 44Z" fill={M.petal} />
          <path d="M32 44C46 44 56 38 58 30C48 30 38 36 32 44Z" fill={M.petal} />
          <path d="M32 44C22 40 15 30 16 18C25 22 31 32 32 44Z" fill={M.petalDeep} />
          <path d="M32 44C42 40 49 30 48 18C39 22 33 32 32 44Z" fill={M.petalDeep} />
          <path d="M32 44C25 34 25 20 32 10C39 20 39 34 32 44Z" fill={M.petal} />
          <path d="M32 16V40" fill="none" stroke="#F4C2B2" strokeWidth={1} />
          <path d="M12 46C22 52 42 52 52 46C46 56 18 56 12 46Z" fill={M.teal} />
          <path d="M6 58H58" strokeWidth={1} />
        </g>
      )}
    </svg>
  )
}

function HandShapes() {
  return (
    <>
      <rect x={21} y={29} width={24} height={25} rx={9} />
      <rect x={20.4} y={10} width={6} height={26} rx={3} transform="rotate(-6 23.4 34)" />
      <rect x={27.5} y={6} width={6} height={28} rx={3} />
      <rect x={34.2} y={7.6} width={6} height={26} rx={3} transform="rotate(4 37.2 32)" />
      <rect x={40.6} y={14} width={5.6} height={21} rx={2.8} transform="rotate(10 43.4 34)" />
      <rect x={18.8} y={27} width={6.4} height={20} rx={3.2} transform="rotate(-40 22 46)" />
      <rect x={24} y={46} width={18} height={16} />
    </>
  )
}
