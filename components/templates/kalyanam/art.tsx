/*
 * Kalyanam — the drawn temple. A gopuram against the dawn, banana plants tied
 * at the entrance, a mango-leaf thoranam, brass kuthuvilakku lamps, jasmine
 * strands, and kolams generated from their dot grids the way they are drawn
 * on a threshold: one line looping round every dot. Flat fills and one warm
 * outline colour, like a festival print.
 */

import type { CSSProperties } from 'react'

export type Pt = [number, number]

export const K = {
  cream: '#FBF4E3',
  paper: '#FFFAF0',
  stone: '#EFE3CB',
  stoneDeep: '#D9C6A2',
  stoneLine: '#B59D74',
  red: '#9E2218',
  redDeep: '#741810',
  kumkum: '#C0302A',
  kaavi: '#B4452B',
  turmeric: '#D89A1C',
  turmericLight: '#EDBE4E',
  turmericPale: '#F6DFA0',
  leaf: '#3F6B2A',
  leafLight: '#6E9A3C',
  leafPale: '#A9C173',
  brass: '#C4912F',
  brassLight: '#E8C170',
  brassDark: '#8A6320',
  floor: '#8E3320',
  floorDeep: '#6E2415',
  ink: '#2E1A10',
  soft: 'rgba(46,26,16,0.76)',
  faint: 'rgba(46,26,16,0.56)',
  rule: 'rgba(158,34,24,0.28)',
  hair: 'rgba(158,34,24,0.16)',
  gold: '#B07F22',
  onRed: '#FBEFD6',
  onRedSoft: 'rgba(251,239,214,0.8)',
}

const r1 = (v: number) => Math.round(v * 10) / 10

export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Red-ochre and lime stripes, as on a temple's compound wall. */
export function kaavi(width = 12, horizontal = false): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(${horizontal ? '180deg' : '90deg'}, ${K.kaavi} 0 ${width}px, #F6E9CF ${width}px ${width * 2}px)`,
  }
}

/** A Kanchipuram-style temple border: a row of gold triangles on red. */
export function templeBorder(size = 14, fg = K.turmericLight, bg = K.red): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 14 14'><rect width='14' height='14' fill='${bg}'/><path d='M0 14L7 3L14 14Z' fill='${fg}'/><path d='M4.2 14L7 9.2L9.8 14Z' fill='${bg}'/></svg>`
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `${size}px ${size}px`,
  }
}

/* ── Kolam ─────────────────────────────────────────────────────────── */

export interface Kolam {
  paths: string[]
  dots: Pt[]
  w: number
  h: number
}

/**
 * A sikku kolam on an m × n grid of dots: the line runs diagonally between
 * the dots and turns back round the outer ones, as a mirror curve does. Each
 * closed loop is its own path. `diamond` turns the grid 45° as the pulli
 * kolams on a threshold are drawn.
 */
export function kolam(m: number, n: number, unit = 14, diamond = true, loop = 0.62): Kolam {
  const W = 2 * m
  const H = 2 * n
  const seen = new Set<string>()
  const key = (a: Pt, b: Pt) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`)
  const onEdge = (p: Pt) => p[0] === 0 || p[0] === W || p[1] === 0 || p[1] === H
  const loops: Pt[][] = []
  const starts: [Pt, Pt][] = []
  for (let x = 1; x < W; x += 2) starts.push([[x, 0], [1, 1]])
  for (let y = 1; y < H; y += 2) starts.push([[0, y], [1, 1]])
  for (let x = 1; x < W; x += 2) for (let y = 2; y < H; y += 2) starts.push([[x, y], [1, 1]])
  for (const [s0, d0] of starts) {
    const probe: Pt = [s0[0] + d0[0], s0[1] + d0[1]]
    if (probe[0] < 0 || probe[0] > W || probe[1] < 0 || probe[1] > H || seen.has(key(s0, probe))) continue
    const pts: Pt[] = []
    let p: Pt = s0
    let d: Pt = d0
    for (let guard = 0; guard < 4000; guard++) {
      let nx = p[0] + d[0]
      let ny = p[1] + d[1]
      if (nx < 0 || nx > W) d = [-d[0], d[1]]
      if (ny < 0 || ny > H) d = [d[0], -d[1]]
      nx = p[0] + d[0]
      ny = p[1] + d[1]
      const q: Pt = [nx, ny]
      const k = key(p, q)
      if (seen.has(k)) break
      seen.add(k)
      pts.push(p)
      p = q
      // reflect off the frame
      if (p[0] === 0 || p[0] === W) d = [-d[0], d[1]]
      if (p[1] === 0 || p[1] === H) d = [d[0], -d[1]]
    }
    if (pts.length > 2) loops.push(pts)
  }
  const cx = W / 2
  const cy = H / 2
  const tf = (p: Pt): Pt => {
    const x = p[0] - cx
    const y = p[1] - cy
    return diamond ? [((x - y) / Math.SQRT2) * unit, ((x + y) / Math.SQRT2) * unit] : [x * unit, y * unit]
  }
  const half = diamond ? ((W + H) / 2 / Math.SQRT2) * unit + unit : 0
  const offX = diamond ? half : cx * unit + unit
  const offY = diamond ? half : cy * unit + unit
  const f = (p: Pt) => `${r1(p[0] + offX)} ${r1(p[1] + offY)}`
  const paths = loops.map((pts) => {
    const n2 = pts.length
    const ctrl = pts.map((p) => {
      if (!onEdge(p)) return tf(p)
      // push the turn outwards so it loops round its dot
      const out: Pt = [p[0] === 0 ? -loop : p[0] === W ? loop : 0, p[1] === 0 ? -loop : p[1] === H ? loop : 0]
      return tf([p[0] + out[0], p[1] + out[1]])
    })
    const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const tp = pts.map(tf)
    let d = `M${f(mid(tp[n2 - 1], tp[0]))}`
    for (let i = 0; i < n2; i++) d += `Q${f(ctrl[i])} ${f(mid(tp[i], tp[(i + 1) % n2]))}`
    return `${d}Z`
  })
  const dots: Pt[] = []
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    const t = tf([2 * i + 1, 2 * j + 1])
    dots.push([r1(t[0] + offX), r1(t[1] + offY)])
  }
  const w = diamond ? half * 2 : W * unit + 2 * unit
  const h = diamond ? half * 2 : H * unit + 2 * unit
  return { paths, dots, w, h }
}

export function KolamArt({
  k,
  color = '#FFFDF6',
  dot = '#FFFDF6',
  stroke = 2.2,
  draw = false,
  className,
  style,
}: {
  k: Kolam
  color?: string
  dot?: string
  stroke?: number
  draw?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg viewBox={`0 0 ${r1(k.w)} ${r1(k.h)}`} className={className} style={style} fill="none" aria-hidden>
      {k.dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={stroke * 1.05} fill={dot} />
      ))}
      {k.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className={draw ? 'kl-draw' : undefined}
          style={draw ? { animationDelay: `${200 + i * 160}ms` } : undefined}
        />
      ))}
    </svg>
  )
}

/* ── The temple ────────────────────────────────────────────────────── */

/** viewBox 0 0 240 176: a seven-tier gopuram with its barrel-vaulted crown and kalasams. */
export function Gopuram({ className, style }: { className?: string; style?: CSSProperties }) {
  const tiers = Array.from({ length: 7 }, (_, i) => {
    const y = 138 - i * 13.5
    const w0 = 196 - i * 17
    const w1 = w0 - 12
    return { y, w0, w1 }
  })
  return (
    <svg viewBox="0 0 240 176" className={className} style={style} aria-hidden>
      {/* the entrance storey */}
      <path d="M22 176V138H218V176Z" fill="#C4623E" stroke={K.redDeep} strokeWidth={0.8} />
      <path d="M104 176V156Q120 142 136 156V176Z" fill={K.redDeep} />
      {[36, 60, 170, 194].map((x) => (
        <path key={x} d={`M${x} 168V152h10v16Z`} fill="#8F3522" />
      ))}
      <path d="M18 138H222V141H18Z" fill="#F3E2C2" />
      {tiers.map(({ y, w0, w1 }, i) => {
        const x0 = 120 - w0 / 2
        const x1 = 120 - w1 / 2
        const h = 13.5
        const niches = Math.max(3, 9 - i)
        return (
          <g key={i}>
            <path d={`M${x0} ${y}L${x1} ${r1(y - h + 2)}H${r1(x1 + w1)}L${r1(x0 + w0)} ${y}Z`} fill={i % 2 ? '#B9573A' : '#C4623E'} stroke={K.redDeep} strokeWidth={0.6} />
            <path d={`M${r1(x1 - 3)} ${r1(y - h + 2)}H${r1(x1 + w1 + 3)}V${r1(y - h)}H${r1(x1 - 3)}Z`} fill="#F3E2C2" stroke={K.redDeep} strokeWidth={0.4} />
            {Array.from({ length: niches }, (_, j) => {
              const nx = x1 + 4 + (j + 0.5) * ((w1 - 8) / niches)
              return <path key={j} d={`M${r1(nx - 2.2)} ${r1(y - 1.5)}V${r1(y - 6.5)}Q${r1(nx)} ${r1(y - 9.5)} ${r1(nx + 2.2)} ${r1(y - 6.5)}V${r1(y - 1.5)}Z`} fill="#7E2C1A" opacity={0.85} />
            })}
            <path d={`M${r1(x0 + w0 - 10)} ${y}L${r1(x1 + w1 - 7)} ${r1(y - h + 2)}H${r1(x1 + w1)}L${r1(x0 + w0)} ${y}Z`} fill="#000" opacity={0.1} />
          </g>
        )
      })}
      {/* the shala: a barrel vault with horned ends */}
      <path d="M78 44C78 30 92 24 120 24C148 24 162 30 162 44Z" fill="#C4623E" stroke={K.redDeep} strokeWidth={0.8} />
      <path d="M78 44C72 40 70 34 74 30C78 34 80 38 84 40ZM162 44C168 40 170 34 166 30C162 34 160 38 156 40Z" fill="#C4623E" stroke={K.redDeep} strokeWidth={0.7} />
      <path d="M112 44V36Q120 30 128 36V44Z" fill="#7E2C1A" />
      <path d="M76 44H164V47H76Z" fill="#F3E2C2" />
      {[92, 106, 120, 134, 148].map((x) => (
        <g key={x}>
          <path d={`M${x - 3.4} 25C${x - 4} 21 ${x - 2} 18.5 ${x} 18.5C${x + 2} 18.5 ${x + 4} 21 ${x + 3.4} 25Z`} fill={K.brassLight} stroke={K.brassDark} strokeWidth={0.5} />
          <path d={`M${x - 1.6} 18.5Q${x} 15 ${x + 1.6} 18.5`} fill={K.brass} stroke={K.brassDark} strokeWidth={0.4} />
          <path d={`M${x} 16V9`} stroke={K.brassDark} strokeWidth={0.9} />
          <circle cx={x} cy={8.6} r={1.1} fill={K.brassLight} />
        </g>
      ))}
    </svg>
  )
}

/** viewBox 0 0 110 420: a banana plant as tied at a wedding entrance, with its bunch and flower. */
export function BananaPlant({ flip = false, className, style }: { flip?: boolean; className?: string; style?: CSSProperties }) {
  const leaves: { a: number; len: number; w: number; bend: number }[] = [
    { a: -100, len: 150, w: 34, bend: 18 },
    { a: -64, len: 140, w: 30, bend: 26 },
    { a: -132, len: 135, w: 30, bend: -24 },
    { a: -30, len: 118, w: 26, bend: 34 },
    { a: -160, len: 110, w: 24, bend: -30 },
  ]
  const top: Pt = [52, 170]
  const leafPath = (len: number, w: number, bend: number) =>
    `M0 0C${r1(len * 0.3)} ${r1(-w + bend * 0.2)} ${r1(len * 0.8)} ${r1(-w * 0.7 + bend)} ${len} ${r1(bend * 1.2)}C${r1(len * 0.75)} ${r1(w * 0.55 + bend)} ${r1(len * 0.3)} ${r1(w * 0.8 + bend * 0.2)} 0 0Z`
  return (
    <svg viewBox="0 0 110 420" className={className} style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      {/* pseudo-stem */}
      <path d="M44 420C45 330 47 250 49 176H57C58 250 60 330 62 420Z" fill="#6E8F3A" stroke="#3E5A22" strokeWidth={0.9} />
      <path d="M50 410C50 330 51 260 52 182M56 410C56 330 55 260 55 182" fill="none" stroke="#9CB860" strokeWidth={1} opacity={0.7} />
      <path d="M44 420C46 350 47 300 48 260C40 300 38 360 36 420Z" fill="#587A2E" stroke="#3E5A22" strokeWidth={0.7} />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${top[0]} ${top[1]}) rotate(${l.a})`}>
          <path d={leafPath(l.len, l.w, l.bend)} fill={i % 2 ? K.leafLight : K.leaf} stroke="#2F4D1C" strokeWidth={0.8} />
          <path d={`M0 0Q${r1(l.len * 0.55)} ${r1(l.bend * 0.55)} ${l.len} ${r1(l.bend * 1.2)}`} fill="none" stroke={K.leafPale} strokeWidth={1.1} />
          {Array.from({ length: 6 }, (_, j) => {
            const t = 0.2 + j * 0.13
            const x = l.len * t
            const y = l.bend * t * 1.05
            return <path key={j} d={`M${r1(x)} ${r1(y)}l${r1(l.w * 0.28)} ${r1(-l.w * 0.5)}`} stroke="#2F4D1C" strokeWidth={0.6} opacity={0.45} />
          })}
        </g>
      ))}
      {/* the bunch, and the flower on its drooping stalk */}
      <path d="M56 184C68 196 76 214 78 238" fill="none" stroke="#586F2A" strokeWidth={2.4} />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 3 }, (_, j) => {
          const x = 64 + j * 5 + row * 2
          const y = 196 + row * 10
          return <path key={`${row}${j}`} d={`M${x} ${y}c-2 5 0 10 5 12c-1-4-1-8 1-11Z`} fill={K.turmericLight} stroke="#8A6A18" strokeWidth={0.6} />
        }),
      )}
      <path d="M78 238C84 246 84 258 78 264C72 258 72 246 78 238Z" fill="#7A2F4A" stroke="#4E1B30" strokeWidth={0.7} />
    </svg>
  )
}

/** viewBox 0 0 44 140: a brass kuthuvilakku with the annam bird on top and three flames lit. */
export function Kuthuvilakku({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 44 140" className={className} style={style} aria-hidden>
      <g stroke={K.brassDark} strokeWidth={0.8}>
        <path d="M22 16C18 14 17 9 20 7C21 5 24 5 25 7L28 6L26 9C27 12 26 15 22 16Z" fill={K.brassLight} />
        <path d="M22 16V22" />
        <path d="M18 22H26L25 27H19Z" fill={K.brass} />
        <path d="M4 34C8 40 36 40 40 34L37 31H7Z" fill={K.brass} />
        <path d="M6 31H38" />
        <path d="M22 27V31" />
        <path d="M20 40V60H24V40Z" fill={K.brass} />
        <ellipse cx={22} cy={62} rx={5} ry={3.4} fill={K.brassLight} />
        <path d="M20.5 65V96H23.5V65Z" fill={K.brass} />
        <ellipse cx={22} cy={98} rx={4.4} ry={3} fill={K.brassLight} />
        <path d="M20 101C18 108 12 114 6 118H38C32 114 26 108 24 101Z" fill={K.brass} />
        <path d="M4 118H40V124C36 128 8 128 4 124Z" fill={K.brassLight} />
        <path d="M12 106C14 104 16 102 19 101" fill="none" stroke={K.brassLight} strokeWidth={1} />
      </g>
      {[7, 22, 37].map((x) => (
        <g key={x}>
          <path d={`M${x} 32C${x + 3} 28 ${x + 2.4} 23 ${x} 19C${x - 2.4} 23 ${x - 3} 28 ${x} 32Z`} fill="#F08A24" />
          <path d={`M${x} 31C${x + 1.4} 29 ${x + 1.2} 26 ${x} 24C${x - 1.2} 26 ${x - 1.4} 29 ${x} 31Z`} fill="#FBD35A" />
        </g>
      ))}
    </svg>
  )
}

/** viewBox 0 0 300 40: the mango-leaf thoranam, leaves hanging point-down from a string. */
export function Thoranam({ className, style, count = 17 }: { className?: string; style?: CSSProperties; count?: number }) {
  const rand = rng(8)
  return (
    <svg viewBox="0 0 300 40" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path d="M0 4Q150 9 300 4" fill="none" stroke="#6B4A1E" strokeWidth={1.2} />
      {Array.from({ length: count }, (_, i) => {
        const x = 8 + (i * 284) / (count - 1)
        const y = 4 + Math.sin((i / (count - 1)) * Math.PI) * 5
        const len = 26 + rand() * 6
        const tilt = (rand() - 0.5) * 12
        const fill = i % 2 ? K.leaf : K.leafLight
        return (
          <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(tilt)})`}>
            <path d={`M0 0C6 ${r1(len * 0.3)} 5 ${r1(len * 0.75)} 0 ${r1(len)}C-5 ${r1(len * 0.75)} -6 ${r1(len * 0.3)} 0 0Z`} fill={fill} stroke="#2F4D1C" strokeWidth={0.6} />
            <path d={`M0 1V${r1(len - 2)}`} stroke={K.leafPale} strokeWidth={0.6} />
          </g>
        )
      })}
      {Array.from({ length: count - 1 }, (_, i) => {
        const x = 8 + ((i + 0.5) * 284) / (count - 1)
        const y = 5 + Math.sin(((i + 0.5) / (count - 1)) * Math.PI) * 5
        return <circle key={`f${i}`} cx={r1(x)} cy={r1(y + 1)} r={2.4} fill={i % 3 === 1 ? '#E0692A' : '#F4E9D2'} stroke="rgba(90,50,20,0.4)" strokeWidth={0.4} />
      })}
    </svg>
  )
}

/** One jasmine strand as a CSS background: white buds on a thread, a kanakambaram flower now and then. */
export function strand(offset: number): CSSProperties {
  const buds = `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='16' viewBox='0 0 14 16'><path d='M7 0V16' stroke='%23C9BB94' stroke-width='0.8'/><ellipse cx='4.6' cy='5' rx='2.6' ry='3.6' fill='%23FFFDF4' stroke='%23D8CCAA' stroke-width='0.5' transform='rotate(-18 4.6 5)'/><ellipse cx='9.4' cy='11.5' rx='2.6' ry='3.6' fill='%23FBF7EA' stroke='%23D8CCAA' stroke-width='0.5' transform='rotate(18 9.4 11.5)'/></svg>`
  const flower = `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='96' viewBox='0 0 14 96'><g transform='translate(7 48)'><circle r='3.4' cx='-2.6' fill='%23E86A1F'/><circle r='3.4' cx='2.6' fill='%23EF7E2A'/><circle r='3.4' cy='-2.6' fill='%23F08C35'/><circle r='3.4' cy='2.6' fill='%23E36119'/><circle r='1.4' fill='%23F9D26A'/></g></svg>`
  return {
    backgroundImage: `url("data:image/svg+xml,${flower}"), url("data:image/svg+xml,${buds}")`,
    backgroundRepeat: 'repeat-y, repeat-y',
    backgroundSize: '14px 96px, 14px 16px',
    backgroundPosition: `0 ${offset}px, 0 ${Math.round(offset / 3)}px`,
  }
}

/* ── One motif per function ─────────────────────────────────────────── */

const L = { stroke: '#3A2210', strokeWidth: 1.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

export type KMotif = 'thamboolam' | 'thaali' | 'feast' | 'turmeric' | 'mehendi' | 'mridangam' | 'umbrella' | 'lamp' | 'kalash'

export function kMotifFor(name: string): KMotif {
  const n = name.toLowerCase()
  if (/nichay|nischay|nishchay|engage|sagai|nischitartham|nischitartham|ring|lagna patrika|lagnapatrika|pooparippu/.test(n)) return 'thamboolam'
  if (/reception|dinner|lunch|feast|virundhu|party|sadya|banquet/.test(n)) return 'feast'
  if (/haldi|nalangu|mangala snanam|snanam|pellikuthuru|pasupu/.test(n)) return 'turmeric'
  if (/mehendi|mehndi|henna|maruthani|mylanchi/.test(n)) return 'mehendi'
  if (/sangeet|music|kutcheri|concert|dance/.test(n)) return 'mridangam'
  if (/kashi|yatra|yathra|janavasam|maapillai azhaippu|mappillai/.test(n)) return 'umbrella'
  if (/vratham|pooja|puja|homam|vratam|samaradhana|sumangali|pandakal|nandi/.test(n)) return 'lamp'
  if (/muhur|muhurat|kalyanam|thirumanam|wedding|vivah|marriage|mangalya|thaali|thali|dhaarai|kanyadan/.test(n)) return 'thaali'
  return 'kalash'
}

export function KMotifArt({ kind, className }: { kind: KMotif; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {kind === 'thamboolam' && (
        <g {...L}>
          <ellipse cx={32} cy={42} rx={27} ry={10} fill={K.brass} />
          <ellipse cx={32} cy={40} rx={23} ry={7.4} fill={K.brassLight} />
          <path d="M14 38C12 30 16 24 22 24C24 30 21 35 14 38Z" fill={K.leaf} />
          <path d="M20 40C20 32 25 27 31 28C31 34 27 38 20 40Z" fill={K.leafLight} />
          <circle cx={40} cy={31} r={8} fill="#7A4A26" />
          <path d="M35 27C37 25 41 25 43 27M34 31C37 29 42 29 46 31" fill="none" stroke="#A36B3C" strokeWidth={0.9} />
          <circle cx={37.4} cy={24.6} r={1.1} fill="#3A2210" stroke="none" />
          <path d="M44 40C48 34 54 32 58 34C55 37 50 40 44 40Z" fill={K.turmericLight} />
          <path d="M42 42C47 37 53 36 57 38C53 41 48 43 42 42Z" fill={K.turmeric} />
          <circle cx={26} cy={42} r={2.2} fill={K.kumkum} />
          <circle cx={31} cy={44} r={1.8} fill="#FFFDF4" />
        </g>
      )}
      {kind === 'thaali' && (
        <g {...L}>
          <path d="M8 8C10 30 20 40 32 42C44 40 54 30 56 8" fill="none" stroke={K.turmeric} strokeWidth={2.4} />
          <path d="M8 8C10 30 20 40 32 42C44 40 54 30 56 8" fill="none" stroke={K.turmericPale} strokeWidth={0.7} />
          <circle cx={20} cy={34} r={3.2} fill={K.brassLight} />
          <circle cx={44} cy={34} r={3.2} fill={K.brassLight} />
          <path d="M32 41C24 42 22 50 26 55C28 58 36 58 38 55C42 50 40 42 32 41Z" fill={K.brassLight} />
          <path d="M32 44C28 45 27 50 29 53C31 55 33 55 35 53C37 50 36 45 32 44Z" fill="none" stroke={K.brassDark} strokeWidth={0.8} />
          <circle cx={32} cy={49} r={1.9} fill={K.kumkum} stroke="none" />
          <path d="M26 57L32 61L38 57" fill="none" strokeWidth={0.9} />
        </g>
      )}
      {kind === 'feast' && (
        <g {...L}>
          <path d="M4 40C10 24 34 14 60 16C58 30 40 50 8 50Z" fill={K.leafLight} />
          <path d="M6 46C20 36 38 26 58 18" fill="none" stroke={K.leafPale} strokeWidth={1.1} />
          <path d="M20 44C20 36 26 32 32 32C38 32 42 36 42 42Z" fill="#FFFDF4" />
          <circle cx={46} cy={28} r={3.6} fill={K.turmericLight} />
          <circle cx={38} cy={24} r={3.2} fill="#D9652C" />
          <circle cx={29} cy={24} r={3} fill="#7C9A3A" />
          <circle cx={52} cy={20.5} r={2.6} fill="#F4E4B8" />
          <path d="M14 38C15 35 18 34 20 35C20 38 17 40 14 38Z" fill="#C88B3A" />
          <path d="M44 42C46 38 50 37 52 39C50 42 47 43 44 42Z" fill={K.turmeric} />
        </g>
      )}
      {kind === 'turmeric' && (
        <g {...L}>
          <path d="M10 34H54C53 45 44 52 32 52C20 52 11 45 10 34Z" fill={K.brass} />
          <ellipse cx={32} cy={34} rx={22} ry={4} fill={K.brassLight} />
          <path d="M16 34C19 27 26 24 32 24C39 24 45 27 48 34Z" fill={K.turmericLight} />
          <path d="M24 52L22 56H42L40 52" fill={K.brassDark} />
          <path d="M40 22C44 14 50 12 56 14C54 18 52 20 48 21C50 24 48 26 45 25C44 23 42 23 40 22Z" fill="#C98A2A" />
          <path d="M46 16L49 13M50 18L54 17" strokeWidth={0.8} />
          <circle cx={24} cy={29} r={1.4} fill={K.kumkum} stroke="none" />
        </g>
      )}
      {kind === 'mehendi' && (
        <g>
          <g fill="#3A2210" stroke="#3A2210" strokeWidth={2.4} strokeLinejoin="round">
            <KHand />
          </g>
          <g fill="#F1D6B4">
            <KHand />
          </g>
          <g fill="#8A3A1A">
            <circle cx={23.4} cy={12.6} r={2.8} />
            <circle cx={30.5} cy={8.6} r={2.8} />
            <circle cx={37.2} cy={10.2} r={2.8} />
            <circle cx={43.6} cy={16.4} r={2.6} />
            <circle cx={13.2} cy={34} r={2.6} />
            <circle cx={33} cy={41} r={3.6} />
          </g>
          <g fill="none" stroke="#8A3A1A" strokeWidth={0.9} strokeLinecap="round">
            <circle cx={33} cy={41} r={7} />
            <path d="M24 55h18M24 58.5h18" />
          </g>
        </g>
      )}
      {kind === 'mridangam' && (
        <g {...L}>
          <path d="M10 22C22 17 42 17 54 22V42C42 47 22 47 10 42Z" fill="#8A4A24" />
          <path d="M14 26C26 22 38 22 50 26" fill="none" stroke="#B5703C" strokeWidth={1.4} />
          <path d="M12 23L20 44L28 21L36 44.5L44 21L52 43" fill="none" stroke={K.turmericPale} strokeWidth={1} />
          <ellipse cx={10} cy={32} rx={4.4} ry={10.4} fill="#F4E4C2" />
          <ellipse cx={54} cy={32} rx={4.4} ry={10.4} fill="#F4E4C2" />
          <ellipse cx={54} cy={32} rx={2.2} ry={5} fill="#3A2210" stroke="none" />
        </g>
      )}
      {kind === 'umbrella' && (
        <g {...L}>
          <path d="M6 30C8 16 20 8 32 8C44 8 56 16 58 30Q52 26 45 30Q38 26 32 30Q26 26 19 30Q12 26 6 30Z" fill={K.kumkum} />
          <path d="M32 8L19 30M32 8L32 30M32 8L45 30" fill="none" stroke={K.turmericPale} strokeWidth={0.8} />
          <path d="M32 30V54C32 58 26 58 26 54" fill="none" strokeWidth={1.6} />
          <circle cx={32} cy={7} r={1.8} fill={K.turmeric} />
          <path d="M44 58L50 34" stroke="#7A4A26" strokeWidth={2.2} />
          <path d="M6 30L4 33M58 30L60 33" strokeWidth={0.8} />
        </g>
      )}
      {kind === 'lamp' && (
        <g {...L} transform="translate(10 0) scale(0.95)">
          <path d="M22 18C25 14 24.4 9 22 5C19.6 9 19 14 22 18Z" fill="#F08A24" />
          <path d="M5 22C9 28 35 28 39 22L36 19H8Z" fill={K.brass} />
          <path d="M20 26V44H24V26Z" fill={K.brass} />
          <ellipse cx={22} cy={46} rx={5} ry={3.2} fill={K.brassLight} />
          <path d="M20 49C18 54 12 58 6 60H38C32 58 26 54 24 49Z" fill={K.brass} />
          <path d="M4 60H40V63H4Z" fill={K.brassLight} />
        </g>
      )}
      {kind === 'kalash' && (
        <g {...L}>
          <path d="M20 16C14 8 8 8 4 10C8 14 14 18 22 18ZM44 16C50 8 56 8 60 10C56 14 50 18 42 18ZM26 14C22 6 22 2 24 0C28 4 30 10 29 16ZM38 14C42 6 42 2 40 0C36 4 34 10 35 16Z" fill={K.leaf} />
          <path d="M22 18C22 10 42 10 42 18Z" fill="#7A4A26" />
          <path d="M22 18H42L40 23H24Z" fill={K.brassLight} />
          <path d="M24 23C12 28 10 44 18 52C24 58 40 58 46 52C54 44 52 28 40 23Z" fill={K.brass} />
          <path d="M16 36H48" stroke={K.kumkum} strokeWidth={2.2} />
          <circle cx={32} cy={44} r={2.2} fill={K.kumkum} stroke="none" />
          <path d="M20 30C18 36 19 44 24 49" fill="none" stroke={K.brassLight} strokeWidth={1.4} />
          <path d="M22 56L20 60H44L42 56" fill={K.brassDark} />
        </g>
      )}
    </svg>
  )
}

function KHand() {
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
