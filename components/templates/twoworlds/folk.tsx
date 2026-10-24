import type { CSSProperties } from 'react'

/*
 * Two Worlds — the folk-art kit, in full colour.
 *
 * India: genda-phool marigolds strung into ladis, mango leaves, brass bells,
 * a paisley in saffron and rani pink, a peacock's eye, a diya, and the
 * jharokha arch that frames a face. Ukraine: Petrykivka painting (flowers and
 * feather-leaves laid down in single brush strokes, the way the painters of
 * Petrykivka do it), glossy kalyna berries, sunflowers, poppies, cornflowers,
 * and the ribbons of a bride's vinok. Every shape is drawn here, in code; the
 * jitter that makes them look painted is seeded, so the server and the browser
 * paint the same flowers.
 */

export const C = {
  night: '#140D22',
  night2: '#1F1436',
  plum: '#2E1744',
  ivory: '#FCF4E6',
  paper: '#F7ECD8',
  cream: '#FFF9EE',
  saffron: '#EE7A12',
  marigold: '#F7A817',
  marigoldDeep: '#DB5E07',
  sunflower: '#FFCB2B',
  wheat: '#E2B65A',
  rani: '#C2185B',
  rose: '#E8507E',
  kalyna: '#D01F2F',
  poppy: '#E5412B',
  berry: '#9A0E25',
  leaf: '#2E8A3E',
  leafDark: '#1C5C2A',
  emerald: '#0E7A5B',
  peacock: '#0C6F80',
  teal: '#1FA3AF',
  blue: '#2A5AA6',
  cornflower: '#4F82D6',
  gold: '#D6A846',
  goldLight: '#F4D88E',
  goldDeep: '#A47720',
  ink: '#26192E',
  soft: '#6B5D66',
} as const

/**
 * Rounded to hundredths. Node and the browser can disagree in the last bits
 * of Math.sin, and any difference in an attribute breaks hydration.
 */
export const q = (n: number) => Math.round(n * 100) / 100

/** Seeded noise in [-0.5, 0.5). */
const rnd = (seed: number) => {
  const n = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return n - Math.floor(n) - 0.5
}

/*
 * Merged shapes. A flower stamped a thousand times on a page costs the browser
 * one draw per shape inside it, every time something near it moves; drawing a
 * marigold's 38 petals as 38 ellipses made the design crawl on a phone. So the
 * petals of one colour are written as subpaths of a single path: the same
 * flower, a handful of shapes.
 */
type Mat = [number, number, number, number, number, number]
const mul = (m: Mat, n: Mat): Mat => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]
const T = (x: number, y: number): Mat => [1, 0, 0, 1, x, y]
const R = (deg: number): Mat => {
  const a = (deg * Math.PI) / 180
  return [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]
}
const at = (m: Mat, x: number, y: number) => `${q(m[0] * x + m[2] * y + m[4])} ${q(m[1] * x + m[3] * y + m[5])}`

/** An ellipse turned by `deg` about its centre, as one subpath of two arcs. */
function ellipseD(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const a = (deg * Math.PI) / 180
  const dx = Math.cos(a) * rx
  const dy = Math.sin(a) * rx
  const arc = `A${q(rx)} ${q(ry)} ${q(deg)} 1 0`
  return `M${q(cx + dx)} ${q(cy + dy)}${arc} ${q(cx - dx)} ${q(cy - dy)}${arc} ${q(cx + dx)} ${q(cy + dy)}Z`
}

/** A circle as one subpath. */
const circleD = (cx: number, cy: number, r: number) => `M${q(cx - r)} ${q(cy)}a${q(r)} ${q(r)} 0 1 0 ${q(2 * r)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-2 * r)} 0Z`

/** A brush-stroke petal (see `stroke`), length s, placed by the matrix m. */
function petalD(s: number, m: Mat) {
  return `M${at(m, 0, 0)}C${at(m, s * 0.36, -s * 0.26)} ${at(m, s * 0.32, -s * 0.82)} ${at(m, 0, -s)}C${at(m, -s * 0.32, -s * 0.82)} ${at(m, -s * 0.36, -s * 0.26)} ${at(m, 0, 0)}Z`
}

/* ─── India ─────────────────────────────────────────────────────────────────── */

/** A genda (marigold): three rings of ruffled petals round a deeper heart. */
export function Marigold({ x, y, r, tone = 0, seed = 1 }: { x: number; y: number; r: number; tone?: 0 | 1; seed?: number }) {
  const shades = tone === 0 ? ['#C9500A', '#EB7413', '#F99A27', '#B84A08'] : ['#E08E0C', '#F5AE19', '#FFD040', '#C9800A']
  const ring = (n: number, rad: number, rx: number, ry: number, k: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = q((360 / n) * i + rnd(seed * 31 + i + k) * 14)
      return ellipseD(x + Math.cos((a * Math.PI) / 180) * rad, y + Math.sin((a * Math.PI) / 180) * rad, rx, ry, a)
    }).join('')
  return (
    <g stroke="rgba(110,35,0,0.18)" strokeWidth={q(r * 0.035)}>
      <path d={ring(16, r * 0.64, r * 0.36, r * 0.25, 1)} fill={shades[0]} />
      <path d={ring(13, r * 0.43, r * 0.31, r * 0.23, 2)} fill={shades[1]} />
      <path d={ring(9, r * 0.22, r * 0.25, r * 0.19, 3)} fill={shades[2]} />
      <circle cx={x} cy={y} r={r * 0.15} fill={shades[3]} stroke="none" />
    </g>
  )
}

/** A mango leaf, as hung on a toran. */
function MangoLeaf({ x, y, len, rot, color = C.leaf }: { x: number; y: number; len: number; rot: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0C${-len * 0.22} ${len * 0.3} ${-len * 0.18} ${len * 0.75} 0 ${len}C${len * 0.18} ${len * 0.75} ${len * 0.22} ${len * 0.3} 0 0Z`} fill={color} />
      <path d={`M0 ${len * 0.06}V${len * 0.92}`} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
    </g>
  )
}

/** A small brass bell, the end of a marigold string. */
function Bell({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-s * 0.5} ${s * 0.9}C${-s * 0.5} ${s * 0.2} ${-s * 0.3} 0 0 0C${s * 0.3} 0 ${s * 0.5} ${s * 0.2} ${s * 0.5} ${s * 0.9}Z`} fill={C.gold} stroke={C.goldDeep} strokeWidth={1.2} />
      <circle cy={s * 1.02} r={s * 0.16} fill={C.goldDeep} />
      <path d={`M${-s * 0.18} ${s * 0.3}C${-s * 0.2} ${s * 0.5} ${-s * 0.2} ${s * 0.7} ${-s * 0.24} ${s * 0.8}`} stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} fill="none" />
    </g>
  )
}

/**
 * A ladi: marigolds strung on a thread with mango leaves between, a bell at
 * the end. Drawn top-down in a 40-wide box; `length` is in the same units.
 */
export function MarigoldStrand({ length, seed = 1, className, style }: { length: number; seed?: number; className?: string; style?: CSSProperties }) {
  const step = 30
  const n = Math.max(2, Math.floor((length - 26) / step))
  return (
    <svg aria-hidden viewBox={`0 0 40 ${length}`} className={className} style={style} overflow="visible">
      <path d={`M20 0V${n * step}`} stroke="#E8D3A2" strokeWidth={1.2} />
      {Array.from({ length: n }, (_, i) => {
        const y = 14 + i * step
        return (
          <g key={i}>
            {i % 4 === 2 && (
              <>
                <MangoLeaf x={20} y={y - 14} len={18} rot={38} />
                <MangoLeaf x={20} y={y - 14} len={18} rot={-38} color={C.leafDark} />
              </>
            )}
            <Stamp id={(i + seed) % 3 === 0 ? 'tw-mg1' : 'tw-mg0'} x={20 + rnd(seed * 7 + i) * 2} y={y} r={15} rot={rnd(seed * 13 + i) * 90} />
          </g>
        )
      })}
      <Bell x={20} y={n * step + 4} s={11} />
    </svg>
  )
}

/** A buta in colour: saffron into rani pink, outlined in gold, with mehndi dots inside. */
export function ColourPaisley({ className, style, id }: { className?: string; style?: CSSProperties; id: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 130" className={className} style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0" stopColor={C.rani} />
          <stop offset="1" stopColor={C.saffron} />
        </linearGradient>
      </defs>
      <path d="M50 124C24 124 10 106 12 84 14 62 34 52 48 42 60 33 66 22 63 10 C61 4 55 4 53 9 C77 16 88 38 88 60 88 86 78 108 66 118 61 122 56 124 50 124Z" fill={`url(#${id})`} stroke={C.gold} strokeWidth={3} />
      <path d="M52 108C34 108 26 96 27 82 28 68 40 60 50 53 58 47 63 40 64 32 C74 42 78 56 77 72 76 92 66 108 52 108Z" fill="none" stroke={C.goldLight} strokeWidth={1.6} strokeDasharray="3 3" />
      {[[50, 94], [60, 84], [44, 80], [62, 70], [53, 66], [58, 56]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.6} fill={C.goldLight} />)}
      <path d="M44 100C40 92 42 86 48 84" stroke={C.cream} strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** The eye of a peacock feather, with its fine barbs. */
export function PeacockEye({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 80 150" className={className} style={style}>
      <path d="M40 150V60" stroke={C.goldDeep} strokeWidth={1.6} />
      {Array.from({ length: 22 }, (_, i) => {
        const t = i / 21
        const y = q(140 - t * 100)
        const w = q(10 + Math.sin(t * Math.PI) * 22)
        return <path key={i} d={`M40 ${y}Q${40 - w * 0.6} ${y - 8} ${40 - w} ${y - 18}M40 ${y}Q${40 + w * 0.6} ${y - 8} ${40 + w} ${y - 18}`} stroke={i % 2 ? C.emerald : C.teal} strokeWidth={1} fill="none" opacity={0.75} />
      })}
      <ellipse cx={40} cy={42} rx={24} ry={30} fill={C.emerald} />
      <ellipse cx={40} cy={44} rx={18} ry={23} fill={C.gold} />
      <ellipse cx={40} cy={46} rx={13} ry={17} fill={C.teal} />
      <ellipse cx={40} cy={48} rx={8} ry={11} fill="#16306B" />
      <ellipse cx={37} cy={44} rx={2.4} ry={3.4} fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

/** A clay diya with its flame. The flame flickers through the `tw-flame` class. */
export function Diya({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 80 64" className={className} style={style} overflow="visible">
      <ellipse cx={40} cy={30} rx={18} ry={14} fill="rgba(255,190,80,0.25)" className="tw-glow" />
      <path className="tw-flame" d="M40 8C44 16 47 21 45 27 43 31 37 31 35 27 33 21 36 16 40 8Z" fill={C.sunflower} />
      <path className="tw-flame" d="M40 16C42 21 43 24 42 27 41 29 39 29 38 27 37 24 38 21 40 16Z" fill="#FFF4C2" />
      <path d="M10 34C14 52 28 58 40 58 52 58 66 52 70 34 58 40 22 40 10 34Z" fill="#B5531E" />
      <path d="M10 34C22 40 58 40 70 34 66 31 14 31 10 34Z" fill="#D67A3A" />
      <path d="M22 46C30 50 50 50 58 46" stroke={C.goldLight} strokeWidth={1.4} strokeDasharray="2 3" fill="none" />
    </svg>
  )
}

/** The ogee arch of a jharokha window, as a mask: frames a photograph in an arch at any size. */
export const ARCH_MASK = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" preserveAspectRatio="none"><path d="M0 130V50Q0 30 16 20Q32 12 42 4Q46 0 50 0Q54 0 58 4Q68 12 84 20Q100 30 100 50V130Z"/></svg>')}")`

/** The gilded outline of the jharokha, with a pietra-dura flower at its peak. */
export function ArchFrame({ className, style, color = C.gold }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 130" preserveAspectRatio="none" className={className} style={style} overflow="visible">
      <path d="M0 130V50Q0 30 16 20Q32 12 42 4Q46 0 50 0Q54 0 58 4Q68 12 84 20Q100 30 100 50V130Z" fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      <path d="M3 130V51Q3 33 18 23Q33 15 43 7Q46.5 3.5 50 3.5Q53.5 3.5 57 7Q67 15 82 23Q97 33 97 51V130" fill="none" stroke={color} strokeWidth={0.8} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ─── Ukraine ───────────────────────────────────────────────────────────────── */

/** One Petrykivka brush stroke: pressed down at the base, lifted to a fine point. */
const stroke = (s: number) => `M0 0C${s * 0.36} ${-s * 0.26} ${s * 0.32} ${-s * 0.82} 0 ${-s}C${-s * 0.32} ${-s * 0.82} ${-s * 0.36} ${-s * 0.26} 0 0Z`

/** A Petrykivka flower: a fan of brush-stroke petals, red with a lighter tip, round a seeded heart. */
export function PetrykivkaFlower({ x, y, s, rot = 0, tone = 'red' }: { x: number; y: number; s: number; rot?: number; tone?: 'red' | 'blue' | 'yellow' }) {
  const pal = tone === 'blue' ? [C.blue, C.cornflower, '#BFD3F5'] : tone === 'yellow' ? ['#E39A0F', C.sunflower, '#FFF0A8'] : [C.berry, C.kalyna, '#FF8A6E']
  const petals = [-64, -40, -18, 0, 18, 40, 64]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {petals.map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <path d={stroke(s * (i === 3 ? 1.05 : 0.92 - Math.abs(a) / 260))} fill={i % 2 ? pal[0] : pal[1]} />
          <path d={stroke(s * 0.42)} transform={`translate(0 ${-s * 0.45})`} fill={pal[2]} opacity={0.75} />
        </g>
      ))}
      <circle r={s * 0.2} fill={C.sunflower} />
      {[[-0.08, -0.05], [0.07, -0.06], [0, 0.07]].map(([dx, dy], i) => <circle key={i} cx={dx * s} cy={dy * s} r={s * 0.04} fill={C.berry} />)}
    </g>
  )
}

/** A Petrykivka "feather" leaf: a curved stem with brush strokes pulled off it. */
export function FeatherLeaf({ x, y, s, rot = 0, color = C.leaf }: { x: number; y: number; s: number; rot?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0Q${s * 0.15} ${-s * 0.5} 0 ${-s}`} stroke={color} strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
      {[0, 1].map((odd) => (
        <path
          key={odd}
          fill={odd ? color : C.leafDark}
          d={[0, 1, 2, 3, 4, 5].filter((i) => i % 2 === odd).map((i) => petalD(s * (0.34 - i * 0.03), mul(T(s * 0.06, -s * (0.15 + i * 0.14)), R((i % 2 ? 1 : -1) * 58)))).join('')}
        />
      ))}
    </g>
  )
}

/** A bunch of kalyna berries: glossy red, each with its highlight, on a short stem. */
export function Kalyna({ x, y, s, rot = 0 }: { x: number; y: number; s: number; rot?: number }) {
  const pts: [number, number][] = [[0, 0], [-0.24, 0.1], [0.24, 0.1], [-0.12, 0.3], [0.12, 0.3], [0, 0.5], [-0.34, 0.34], [0.34, 0.34]]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 ${-s * 0.36}V${s * 0.02}M0 ${-s * 0.2}L${-s * 0.24} ${s * 0.08}M0 ${-s * 0.2}L${s * 0.24} ${s * 0.08}`} stroke={C.leafDark} strokeWidth={s * 0.035} />
      <path d={pts.filter((_, i) => i % 3 === 0).map(([dx, dy]) => circleD(dx * s, dy * s, s * 0.135)).join('')} fill={C.berry} />
      <path d={pts.filter((_, i) => i % 3 !== 0).map(([dx, dy]) => circleD(dx * s, dy * s, s * 0.135)).join('')} fill={C.kalyna} />
      <path d={pts.map(([dx, dy]) => circleD(dx * s - s * 0.04, dy * s - s * 0.045, s * 0.035)).join('')} fill="rgba(255,255,255,0.75)" />
    </g>
  )
}

/** A sunflower: two rings of petals round a seed head laid in the golden spiral. */
export function Sunflower({ x, y, r, seed = 1 }: { x: number; y: number; r: number; seed?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={Array.from({ length: 22 }, (_, i) => petalD(r, R(q((360 / 22) * i + rnd(seed + i) * 6)))).join('')} fill="#E89B08" />
      <path d={Array.from({ length: 18 }, (_, i) => petalD(r * 0.9, R(q((360 / 18) * i + 10 + rnd(seed * 3 + i) * 6)))).join('')} fill={C.sunflower} />
      <circle r={r * 0.44} fill="#4A2A12" />
      {[0, 1].map((odd) => (
        <path
          key={odd}
          fill={odd ? '#7A4A1C' : '#2E1A0A'}
          d={Array.from({ length: 34 }, (_, i) => i)
            .filter((i) => i % 2 === odd)
            .map((i) => circleD(Math.cos(i * 2.39996) * Math.sqrt(i / 34) * r * 0.38, Math.sin(i * 2.39996) * Math.sqrt(i / 34) * r * 0.38, r * 0.035))
            .join('')}
        />
      ))}
    </g>
  )
}

/** A cornflower: a star of blue florets. */
function Cornflower({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 1].map((odd) => (
        <path
          key={odd}
          fill={odd ? C.cornflower : C.blue}
          d={Array.from({ length: 9 }, (_, i) => i)
            .filter((i) => i % 2 === odd)
            .map((i) => {
              const m = R(i * 40)
              return `M${at(m, 0, 0)}L${at(m, -r * 0.22, -r * 0.8)}L${at(m, 0, -r)}L${at(m, r * 0.22, -r * 0.8)}Z`
            })
            .join('')}
        />
      ))}
      <circle r={r * 0.22} fill="#1C2F66" />
    </g>
  )
}

/** Barvinok, the periwinkle: the flower of a Ukrainian wedding, woven into the vinok and onto the korovai for lasting love. */
function Periwinkle() {
  return (
    <g>
      <path d={[0, 72, 144, 216, 288].map((a) => { const m = R(a); return `M${at(m, 0, 0)}C${at(m, 0.24, -0.28)} ${at(m, 0.62, -0.7)} ${at(m, 0.3, -1)}C${at(m, 0.02, -1.06)} ${at(m, -0.3, -0.88)} ${at(m, -0.2, -0.52)}Z` }).join('')} fill="#6A5FD0" />
      <path d="M0 -0.26L0.08 -0.08 0.26 0 0.08 0.08 0 0.26 -0.08 0.08 -0.26 0 -0.08 -0.08Z" fill="#F3EEFF" />
    </g>
  )
}

/** A rose for a garland strand: an open cup of five petals round a tight heart. */
function Rose({ tone }: { tone: 'pink' | 'white' | 'red' }) {
  const [outer, mid, heart] = tone === 'white' ? ['#FFF4F1', '#FBDCE1', '#F2B3C2'] : tone === 'red' ? ['#C8102E', '#E2324A', '#8E0A20'] : ['#E8507E', '#F47FA2', '#C2185B']
  return (
    <g>
      <circle r={1} fill={outer} />
      <path d={[0, 72, 144, 216, 288].map((a) => ellipseD(Math.sin((a * Math.PI) / 180) * 0.52, -Math.cos((a * Math.PI) / 180) * 0.52, 0.42, 0.34, a)).join('')} fill={mid} />
      <circle r={0.4} fill={heart} />
      <path d="M-0.2 0a0.2 0.2 0 1 1 0.2 0.2" stroke={outer} strokeWidth={0.09} fill="none" />
    </g>
  )
}

/** A poppy, as worn in a vinok: four red petals and a black heart. */
function Poppy({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[[0, 180], [90, 270]].map((pair, k) => (
        <path key={k} fill={k ? C.poppy : C.kalyna} d={pair.map((a) => { const t = ((a + 20) * Math.PI) / 180; return ellipseD(Math.sin(t) * r * 0.48, -Math.cos(t) * r * 0.48, r * 0.52, r * 0.55, a + 20) }).join('')} />
      ))}
      <circle r={r * 0.24} fill="#1A1014" />
      <path d={Array.from({ length: 8 }, (_, i) => circleD(Math.cos(i * 0.785) * r * 0.32, Math.sin(i * 0.785) * r * 0.32, r * 0.05)).join('')} fill="#1A1014" />
    </g>
  )
}

/**
 * A strand from Ukraine to hang beside the marigolds: kalyna and small
 * sunflowers on a red thread, ending in a ribbon.
 */
export function KalynaStrand({ length, seed = 1, className, style }: { length: number; seed?: number; className?: string; style?: CSSProperties }) {
  const step = 34
  const n = Math.max(2, Math.floor((length - 30) / step))
  return (
    <svg aria-hidden viewBox={`0 0 40 ${length}`} className={className} style={style} overflow="visible">
      <path d={`M20 0V${n * step}`} stroke={C.kalyna} strokeWidth={1.3} />
      {Array.from({ length: n }, (_, i) => {
        const y = 16 + i * step
        return (i + seed) % 3 === 1 ? (
          <Stamp key={i} id="tw-sf" x={20} y={y} r={13} rot={i * 17} />
        ) : (
          <g key={i}>
            <Stamp id={i % 2 ? 'tw-lf0' : 'tw-lf1'} x={20 + (i % 2 ? 8 : -8)} y={y - 4} r={11} rot={i % 2 ? 50 : -50} />
            <Stamp id="tw-kl" x={20} y={y + 4} r={14} />
          </g>
        )
      })}
      <path d={`M20 ${n * step}c-6 12 4 22-4 36M20 ${n * step}c6 12-4 22 4 36`} stroke={(seed % 2) ? C.blue : C.sunflower} strokeWidth={4} fill="none" strokeLinecap="round" />
    </svg>
  )
}

/**
 * A Petrykivka spray for a corner: a sweeping stem with two flowers, a
 * sunflower, kalyna and feather-leaves, painted on whatever ground it lies on.
 */
export function PetrykivkaSpray({ className, style, flip = false }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 300 300" className={className} style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M20 290C70 230 100 160 170 120S260 60 286 20" stroke={C.leafDark} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M118 176C96 150 92 120 104 96" stroke={C.leafDark} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <FeatherLeaf x={60} y={246} s={70} rot={-20} />
      <FeatherLeaf x={150} y={134} s={64} rot={60} color={C.leafDark} />
      <FeatherLeaf x={236} y={64} s={54} rot={-30} />
      <PetrykivkaFlower x={104} y={98} s={52} rot={-14} />
      <PetrykivkaFlower x={268} y={34} s={36} rot={30} tone="blue" />
      <Sunflower x={190} y={110} r={30} seed={4} />
      <Kalyna x={86} y={210} s={56} rot={14} />
      <Kalyna x={220} y={168} s={40} rot={-20} />
      {[[40, 200], [130, 220], [210, 210], [250, 120], [160, 60]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={4 + (i % 2) * 2} fill={i % 2 ? C.sunflower : C.kalyna} />)}
    </svg>
  )
}


/* ─── Symbols: each flower drawn once, stamped wherever it is needed ─────────── */

/**
 * The flowers as SVG symbols. Render once per page (the design does); every
 * strand, wreath and garland then stamps them with <use>, so a curtain of a
 * hundred marigolds is a hundred elements, not four thousand.
 */
export function FolkDefs() {
  return (
    <svg aria-hidden width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        <symbol id="tw-mg0" viewBox="-1.15 -1.15 2.3 2.3"><Marigold x={0} y={0} r={1} tone={0} seed={3} /></symbol>
        <symbol id="tw-mg1" viewBox="-1.15 -1.15 2.3 2.3"><Marigold x={0} y={0} r={1} tone={1} seed={7} /></symbol>
        <symbol id="tw-sf" viewBox="-1.05 -1.05 2.1 2.1"><Sunflower x={0} y={0} r={1} seed={2} /></symbol>
        <symbol id="tw-kl" viewBox="-0.6 -0.55 1.2 1.25"><Kalyna x={0} y={0} s={1} /></symbol>
        <symbol id="tw-pp" viewBox="-1.1 -1.1 2.2 2.2"><Poppy x={0} y={0} r={1} /></symbol>
        <symbol id="tw-cf" viewBox="-1.05 -1.05 2.1 2.1"><Cornflower x={0} y={0} r={1} /></symbol>
        <symbol id="tw-lf0" viewBox="-0.45 -1.05 0.9 1.1"><FeatherLeaf x={0} y={0} s={1} /></symbol>
        <symbol id="tw-lf1" viewBox="-0.45 -1.05 0.9 1.1"><FeatherLeaf x={0} y={0} s={1} color={C.leafDark} /></symbol>
        <symbol id="tw-rs" viewBox="-1.05 -1.05 2.1 2.1"><Rose tone="pink" /></symbol>
        <symbol id="tw-rw" viewBox="-1.05 -1.05 2.1 2.1"><Rose tone="white" /></symbol>
        <symbol id="tw-rr" viewBox="-1.05 -1.05 2.1 2.1"><Rose tone="red" /></symbol>
        <symbol id="tw-bv" viewBox="-1.1 -1.1 2.2 2.2"><Periwinkle /></symbol>
      </defs>
    </svg>
  )
}

/** Stamp a symbol centred on (x, y) at radius r, turned by rot degrees. */
export function Stamp({ id, x, y, r, rot = 0, className, style }: { id: string; x: number; y: number; r: number; rot?: number; className?: string; style?: CSSProperties }) {
  const [cx, cy, rr, a] = [q(x), q(y), q(r), q(rot)]
  return <use href={`#${id}`} x={q(cx - rr)} y={q(cy - rr)} width={q(rr * 2)} height={q(rr * 2)} transform={a ? `rotate(${a} ${cx} ${cy})` : undefined} className={className} style={style} />
}

/* ─── Where the two meet ────────────────────────────────────────────────────── */

/**
 * The vinok and the varmala in one ring: marigolds and sunflowers, poppies and
 * cornflowers, with the vinok's ribbons streaming from one side and a marigold
 * string falling from the other. The couple's initials go in the middle.
 */
export function WreathMedallion({ className, style }: { className?: string; style?: CSSProperties }) {
  const R = 92
  const items = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2
    return { x: 150 + Math.cos(a) * R, y: 140 + Math.sin(a) * R, a, i }
  })
  return (
    <svg aria-hidden viewBox="0 0 300 330" className={className} style={style} overflow="visible">
      {/* Ribbons of the vinok */}
      {[C.kalyna, C.sunflower, C.blue, C.leaf, C.rani].map((col, i) => (
        <path key={col} className="tw-ribbon" style={{ animationDelay: `${i * 0.35}s` }} d={`M${206 + i * 6} 214c${8 + i * 3} 30 ${-12 + i * 2} 56 ${10 + i * 4} ${86 + i * 6}`} stroke={col} strokeWidth={7} fill="none" strokeLinecap="round" />
      ))}
      {/* A marigold string falling from the varmala */}
      {[0, 1, 2, 3].map((i) => <Stamp key={`d${i}`} id={i % 2 ? 'tw-mg1' : 'tw-mg0'} x={86 - i * 2} y={226 + i * 22} r={12} rot={i * 40} />)}
      <circle cx={150} cy={140} r={R} fill="none" stroke={C.leafDark} strokeWidth={6} />
      {items.map(({ x, y, a, i }) => (
        <Stamp key={`l${i}`} id={i % 2 ? 'tw-lf0' : 'tw-lf1'} x={x} y={y} r={20} rot={(a * 180) / Math.PI + (i % 2 ? 150 : 30)} />
      ))}
      {items.map(({ x, y, i }) => (
        <Stamp key={`f${i}`} id={['tw-mg0', 'tw-pp', 'tw-sf', 'tw-cf'][i % 4]} x={x} y={y} r={i % 4 === 0 ? 22 : i % 4 === 2 ? 18 : 16} rot={i * 23} />
      ))}
    </svg>
  )
}

/* ─── Dressed pictures ──────────────────────────────────────────────────────── */

/** A mogra (jasmine) bud cluster: three white petals, strung between the marigolds. */
function Mogra({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      {[0, 1, 2].map((j) => {
        const a = (j / 3) * Math.PI * 2 + 0.5
        const cx = q(x + Math.cos(a) * 1.5 * s)
        const cy = q(y + Math.sin(a) * 1.5 * s)
        return <ellipse key={j} cx={cx} cy={cy} rx={q(1.9 * s)} ry={q(1.4 * s)} transform={`rotate(${q((a * 180) / Math.PI)} ${cx} ${cy})`} fill="#FFFDF2" stroke="rgba(120,96,50,0.35)" strokeWidth={0.25} />
      })}
      <circle cx={q(x)} cy={q(y)} r={q(0.8 * s)} fill="#F1DE9C" />
    </g>
  )
}

/**
 * A genda mala round a medallion, as one is hung on a picture of Ganesha:
 * marigolds with a white mogra bud every few flowers, knotted at the bottom
 * with a short tassel. The medallion is 100 across and centred at (0, 0):
 * place the SVG at left -12%, top -12%, width 124% of it.
 */
export function MalaRing({ className, style }: { className?: string; style?: CSSProperties }) {
  const R = 55
  const n = 34
  const items = Array.from({ length: n - 1 }, (_, k) => {
    const i = k + 1
    const a = (i / n) * Math.PI * 2 + Math.PI / 2
    return { x: Math.cos(a) * R, y: Math.sin(a) * R, i }
  })
  return (
    <svg aria-hidden viewBox="-62 -62 124 146" className={className} style={style} overflow="visible">
      {items.map(({ x, y, i }) => (i % 5 === 0 ? <Mogra key={i} x={x} y={y} s={1.25} /> : <Stamp key={i} id={i % 3 === 1 ? 'tw-mg1' : 'tw-mg0'} x={x} y={y} r={5.7} rot={i * 37} />))}
      {/* The knot, and the tassel falling from it */}
      <Stamp id="tw-mg0" x={0} y={R} r={7.2} rot={24} />
      <circle cx={0} cy={63.4} r={3.4} fill={C.rani} />
      <path d="M-1.4 63.4a1.5 1.5 0 1 1 1.6 1.4" stroke={C.rose} strokeWidth={0.7} fill="none" />
      <Stamp id="tw-mg1" x={0} y={69.6} r={4.4} rot={60} />
      <Mogra x={0} y={75.2} />
      <path d="M0 77.2l-2.4 5.6h4.8Z" fill={C.gold} stroke={C.goldDeep} strokeWidth={0.4} />
      {[-1.6, -0.5, 0.6, 1.7].map((dx) => <path key={dx} d={`M${dx} 83.2v4.4`} stroke={C.goldLight} strokeWidth={0.55} strokeLinecap="round" />)}
    </svg>
  )
}

/**
 * A rushnyk laid over a framed photograph, as Ukrainian homes dress the
 * pictures they treasure: the linen across the top edge, its two embroidered
 * ends hanging down the sides to a fringe. Units are the frame's width (100)
 * with its top edge at y = 0: place the SVG at left -9%, width 118%, and 5% of
 * the frame's width above its top edge.
 */
export function RushnykDrape({ className, style }: { className?: string; style?: CSSProperties }) {
  const linen = '#F8F2E4'
  const fold = 'rgba(120,96,64,0.16)'
  // The embroidered end of each tail: a black rule, a red diamond with a black heart and four crosses, a rule, a zigzag, the fringe.
  const end = (cx: number) => {
    const l = q(cx - 5.6)
    const r = q(cx + 5.6)
    return (
      <g key={cx}>
        <path d={`M${l} 58.4H${r}M${l} 69.4H${r}`} stroke={C.ink} strokeWidth={0.55} />
        <path d={`M${cx} 59.8L${q(cx + 4.2)} 63.9 ${cx} 68 ${q(cx - 4.2)} 63.9Z`} fill={C.kalyna} />
        <path d={`M${cx} 61.7L${q(cx + 2.2)} 63.9 ${cx} 66.1 ${q(cx - 2.2)} 63.9Z`} fill={C.ink} />
        <path
          d={[[-4.6, 60.6], [4.6, 60.6], [-4.6, 67.2], [4.6, 67.2]].map(([dx, dy]) => `M${q(cx + dx - 0.8)} ${q(dy - 0.8)}l1.6 1.6m0 -1.6l-1.6 1.6`).join('')}
          stroke={C.kalyna}
          strokeWidth={0.5}
        />
        <path d={`M${l} 71.8${Array.from({ length: 8 }, (_, k) => `l1.4 ${k % 2 ? 1.1 : -1.1}`).join('')}`} stroke={C.kalyna} strokeWidth={0.55} fill="none" />
        {Array.from({ length: 10 }, (_, k) => <path key={k} d={`M${q(cx - 5.2 + k * 1.15)} 75.2v${q(3 + (k % 3) * 0.5)}`} stroke="#EFE5CF" strokeWidth={0.5} strokeLinecap="round" />)}
      </g>
    )
  }
  return (
    <svg aria-hidden viewBox="-9 -5 118 86" className={className} style={{ filter: 'drop-shadow(0 1.4px 1.2px rgba(0,0,0,0.35))', ...style }} overflow="visible">
      <path d="M-6.6 -1C-7.6 22 -5.8 48 -7.2 75.4L5.2 75.4C4.4 50 6.2 22 5.6 3Z" fill={linen} />
      <path d="M106.6 -1C107.6 22 105.8 48 107.2 75.4L94.8 75.4C95.6 50 93.8 22 94.4 3Z" fill={linen} />
      <path d="M3.6 6C4.4 26 3 50 3.6 75M96.4 6C95.6 26 97 50 96.4 75" stroke={fold} strokeWidth={1.8} fill="none" />
      <path d="M-6.6 -3C25 0 75 0 106.6 -3L106.6 5C75 9 25 9 -6.6 5Z" fill={linen} />
      <path d="M-6.6 -1.4C25 1.6 75 1.6 106.6 -1.4M-6.6 3.4C25 7.4 75 7.4 106.6 3.4" stroke={C.kalyna} strokeWidth={0.5} strokeDasharray="1.2 0.8" fill="none" />
      <path d="M50 1.2L52.2 3.4 50 5.6 47.8 3.4Z" fill={C.kalyna} />
      {end(-0.8)}
      {end(100.8)}
    </svg>
  )
}

/** One corner of a black lacquer frame, painted the Petrykivka way: a flower between two feather leaves. */
export function PaintedCorner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className} style={style}>
      <FeatherLeaf x={9} y={9} s={22} rot={172} />
      <FeatherLeaf x={9} y={9} s={22} rot={98} color={C.leafDark} />
      <PetrykivkaFlower x={9} y={9} s={15} rot={135} />
      <circle cx={27} cy={7} r={1.6} fill={C.sunflower} />
      <circle cx={7} cy={27} r={1.6} fill={C.sunflower} />
    </svg>
  )
}

/* ─── Night sky ─────────────────────────────────────────────────────────────── */

/** Stars, scattered the same way on the server and in the browser; some of them twinkle. */
export function Stars({ count = 70, seed = 3, className }: { count?: number; seed?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      {Array.from({ length: count }, (_, i) => {
        const x = q((rnd(seed * 91 + i) + 0.5) * 100)
        const y = q((rnd(seed * 37 + i * 3) + 0.5) * 100)
        const r = q(0.12 + (rnd(seed + i * 7) + 0.5) * 0.28)
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFF6DA" className={i % 3 === 0 ? 'tw-twinkle' : undefined} style={{ animationDelay: `${(i % 7) * 0.45}s` }} opacity={q(0.5 + (rnd(i * 5) + 0.5) * 0.5)} vectorEffect="non-scaling-stroke" />
      })}
    </svg>
  )
}

/** A tall candle with its glow; the flame flickers through `tw-flame`. */
export function Candle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 60 170" className={className} style={style} overflow="visible">
      <ellipse cx={30} cy={36} rx={30} ry={34} fill="rgba(255,190,90,0.18)" className="tw-glow" />
      <path className="tw-flame" d="M30 6C35 16 38 23 35 30 33 35 27 35 25 30 22 23 25 16 30 6Z" fill={C.sunflower} />
      <path className="tw-flame" d="M30 16C32 21 33 25 32 29 31 31 29 31 28 29 27 25 28 21 30 16Z" fill="#FFF6CF" />
      <path d="M30 34V42" stroke="#3B2A1E" strokeWidth={1.4} />
      <path d="M16 44C16 40 44 40 44 44V164H16Z" fill="#FBF1DE" />
      <path d="M16 44C20 50 26 47 30 52 34 47 40 50 44 44" fill="#F3E3C4" />
      <path d="M22 60V156" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
    </svg>
  )
}

/** Dubai at night with its windows lit: the gold-thread skyline, and lights that come on one by one. */
export function NightCity({ className, style }: { className?: string; style?: CSSProperties }) {
  const towers: [number, number, number][] = [[118, 118, 52], [184, 150, 12], [206, 104, 14], [338, 124, 18], [364, 146, 28], [402, 112, 26], [438, 160, 24]]
  return (
    <svg viewBox="0 0 640 260" className={className} style={style} role="img" aria-label="Dubai at night, its windows lit">
      <g fill="none" stroke={C.goldLight} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}>
        <path d="M118 210V118H170V210M128 210V128H160V210M118 124H170" />
        <path d="M184 210V150L196 142V210M206 210V104C206 100 220 100 220 104V210" />
        <path d="M228 210C230 180 236 160 232 132 236 124 246 124 246 132 244 160 250 180 252 210" />
        <path d="M268 210L272 170H278L280 128H286L288 92H292L294 60H296L298 18L300 60H302L304 92H308L310 128H316L318 170H324L328 210" />
        <path d="M338 210V124H356V210M364 210V146L378 138L392 146V210M402 210V112C410 104 420 104 428 112V210M438 210V160H462V210" />
        <path d="M498 210V104C540 120 560 170 562 210M494 210V98M494 120H504M494 150H520M494 180H540" />
        <path d="M20 210H620" strokeWidth={1.4} />
        <path d="M44 226C60 236 92 236 108 226H44ZM76 226V190L58 222M76 196L100 222" strokeWidth={1.4} />
      </g>
      {/* Lit windows: a few hundred small lights, some of them twinkling. */}
      <g fill={C.sunflower}>
        {towers.flatMap(([x, top, w], t) =>
          Array.from({ length: Math.floor(w / 6) * Math.floor((210 - top - 12) / 9) }, (_, k) => {
            const cols = Math.floor(w / 6)
            const cx = x + 4 + (k % cols) * 6
            const cy = top + 10 + Math.floor(k / cols) * 9
            const on = rnd(t * 101 + k) > -0.1
            return on ? <rect key={`${t}-${k}`} x={cx} y={cy} width={2.2} height={3} rx={0.6} opacity={q(0.55 + (rnd(k * 3 + t) + 0.5) * 0.45)} className={k % 9 === 0 ? 'tw-twinkle' : undefined} style={{ animationDelay: `${(k % 11) * 0.3}s` }} /> : null
          }),
        )}
      </g>
      {/* Reflections */}
      <g stroke={C.sunflower} strokeLinecap="round" strokeOpacity={0.45}>
        {[130, 210, 300, 380, 420, 520].map((x, i) => <path key={x} d={`M${x} ${220 + (i % 3) * 7}h${10 + (i % 2) * 8}`} strokeWidth={2} />)}
      </g>
      <path d="M560 40a16 16 0 1 0 12 26 13 13 0 1 1-12-26Z" fill={C.goldLight} />
    </svg>
  )
}
