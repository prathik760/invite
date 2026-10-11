import { useId, type CSSProperties } from 'react'

/** Lal joda red, zari gold, marigold and the cream of a wedding card. */
export const S = {
  red: '#9B0F1E',
  redDeep: '#6A0712',
  redDark: '#3F030A',
  sindoor: '#D0122F',
  gold: '#E2B04A',
  goldLight: '#F7DB8E',
  goldDeep: '#A8741A',
  ivory: '#FFF4DF',
  ivorySoft: 'rgba(255,244,223,0.82)',
  ivoryFaint: 'rgba(255,244,223,0.6)',
  cream: '#FBEBD2',
  card: '#FFF8EC',
  ink: '#43060E',
  soft: '#7A3B35',
  rule: 'rgba(168,116,26,0.38)',
  ruleOnRed: 'rgba(247,219,142,0.34)',
  marigold: '#F59E1B',
  marigoldDeep: '#D2690A',
  yellow: '#FFC531',
  leaf: '#3E7B2F',
  leafDeep: '#2A5A20',
  night: '#16050D',
}

/** Bandhani: the tie-dye dots of a bridal chunri, as a repeating background. */
export function bandhani(dot = 'rgba(255,214,140,0.34)', size = 18): CSSProperties {
  return {
    backgroundImage: `radial-gradient(circle, ${dot} 1.3px, transparent 1.9px), radial-gradient(circle, ${dot} 1.3px, transparent 1.9px)`,
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `0 0, ${size / 2}px ${size / 2}px`,
  }
}

/** One marigold: a dashed ring reads as petals at any size. */
function Marigold({ x, y, r, c = S.marigold, dark = S.marigoldDeep }: { x: number; y: number; r: number; c?: string; dark?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={c} />
      <circle r={r * 0.78} fill="none" stroke={dark} strokeWidth={r * 0.42} strokeDasharray={`${(r * 0.3).toFixed(2)} ${(r * 0.24).toFixed(2)}`} opacity={0.75} />
      <circle r={r * 0.32} fill={dark} />
    </g>
  )
}

function MangoLeaf({ x, y, rot, len = 22, c = S.leaf }: { x: number; y: number; rot: number; len?: number; c?: string }) {
  const w = len * 0.26
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${w} ${-len * 0.25} ${w} ${-len * 0.7} 0 ${-len} C ${-w} ${-len * 0.7} ${-w} ${-len * 0.25} 0 0 Z`} fill={c} />
      <path d={`M0 -1 L0 ${-len + 2}`} stroke={S.leafDeep} strokeWidth={0.8} />
    </g>
  )
}

/** Points along a quadratic swag, so the flowers sit on the curve. */
function swag(x0: number, x1: number, top: number, sag: number, n: number) {
  const cx = (x0 + x1) / 2
  const cy = top + sag * 2
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1
    const y = (1 - t) * (1 - t) * top + 2 * (1 - t) * t * cy + t * t * top
    return { x, y }
  })
}

/**
 * The toran: marigold swags with hanging strands, each ending in a brass bell.
 * The strands sway (`sp-sway`), each with its own delay.
 */
export function Toran({ className, style }: { className?: string; style?: CSSProperties }) {
  const W = 400
  const swags = [0, 1, 2, 3].map((i) => swag(i * 100, i * 100 + 100, 8, 17, 12))
  const strands = [0, 100, 200, 300, 400]
  return (
    <svg viewBox={`0 0 ${W} 112`} className={className} style={style} aria-hidden>
      <rect x={0} y={0} width={W} height={7} fill={S.goldDeep} />
      <rect x={0} y={6} width={W} height={2} fill={S.goldLight} opacity={0.6} />
      {swags.map((pts, si) => (
        <g key={si}>
          {pts.map((p, i) => (
            <Marigold key={i} x={p.x} y={p.y} r={5.4} c={i % 2 ? S.yellow : S.marigold} dark={i % 2 ? '#E39A12' : S.marigoldDeep} />
          ))}
        </g>
      ))}
      {strands.map((x, si) => (
        <g key={x} className="sp-sway" style={{ animationDelay: `${-si * 0.7}s` }}>
          <MangoLeaf x={x - 3} y={12} rot={-28} len={20} />
          <MangoLeaf x={x + 3} y={12} rot={28} len={20} />
          <line x1={x} y1={8} x2={x} y2={84} stroke={S.goldDeep} strokeWidth={0.8} />
          {[16, 27, 38, 49, 60, 71].map((y, i) => (
            <Marigold key={y} x={x} y={y} r={5.2} c={i % 2 ? S.marigold : S.yellow} dark={i % 2 ? S.marigoldDeep : '#E39A12'} />
          ))}
          <path d={`M${x - 4.5} 86 Q${x} 76 ${x + 4.5} 86 Z`} fill={S.gold} />
          <circle cx={x} cy={87.5} r={1.4} fill={S.goldDeep} />
        </g>
      ))}
    </svg>
  )
}

/** The kalash: brass pot, mauli thread, mango leaves and a coconut. */
export function Kalash({ className, style, swastik = true }: { className?: string; style?: CSSProperties; swastik?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="0 0 120 150" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={S.goldDeep} />
          <stop offset="0.38" stopColor={S.goldLight} />
          <stop offset="0.62" stopColor={S.gold} />
          <stop offset="1" stopColor={S.goldDeep} />
        </linearGradient>
        <radialGradient id={`${id}c`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#B07A46" />
          <stop offset="1" stopColor="#6B4120" />
        </radialGradient>
      </defs>
      {[-62, -32, 0, 32, 62].map((r, i) => (
        <MangoLeaf key={r} x={60 + r * 0.12} y={52} rot={r} len={i === 2 ? 40 : 34} />
      ))}
      <ellipse cx={60} cy={36} rx={14} ry={16} fill={`url(#${id}c)`} />
      <path d="M53 22 Q60 12 67 22" stroke="#5A3418" strokeWidth={2} fill="none" />
      <path d="M46.5 38 Q60 44 73.5 38" stroke={S.sindoor} strokeWidth={2.4} fill="none" />
      <path d="M47 42 Q60 48 73 42" stroke={S.yellow} strokeWidth={1.6} fill="none" />
      <path
        d="M38 52 h44 v5 c0 5 -5 7 -5 11 c16 6 27 20 27 35 c0 19 -19 31 -44 31 c-25 0 -44 -12 -44 -31 c0 -15 11 -29 27 -35 c0 -4 -5 -6 -5 -11 Z"
        fill={`url(#${id}b)`}
      />
      <ellipse cx={60} cy={52} rx={22} ry={4} fill={S.goldLight} />
      {[64, 68, 72].map((y, i) => (
        <path key={y} d={`M${42 + i} ${y} Q60 ${y + 4} ${78 - i} ${y}`} stroke={i === 1 ? S.yellow : S.sindoor} strokeWidth={2} fill="none" />
      ))}
      {swastik && (
        <g transform="translate(60 103)" stroke={S.sindoor} strokeWidth={2.6} strokeLinecap="round" fill="none">
          <path d="M0 -10 V10 M-10 0 H10 M0 -10 H8 M10 0 V8 M0 10 H-8 M-10 0 V-8" />
          {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.1} fill={S.sindoor} stroke="none" />
          ))}
        </g>
      )}
      <ellipse cx={60} cy={136} rx={30} ry={5} fill={S.goldDeep} />
    </svg>
  )
}

/** A clay diya whose flame flickers (`sp-flame`) inside a soft glow (`sp-glow`). */
export function Diya({ className, style, delay = 0 }: { className?: string; style?: CSSProperties; delay?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#FFB23E" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FF8A00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF7A00" />
          <stop offset="0.45" stopColor="#FFC53D" />
          <stop offset="1" stopColor="#FFF6D5" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2602F" />
          <stop offset="1" stopColor="#7C3416" />
        </linearGradient>
      </defs>
      <circle className="sp-glow" cx={40} cy={30} r={30} fill={`url(#${id}g)`} style={{ animationDelay: `${delay}s` }} />
      <path className="sp-flame" d="M40 8 C47 19 50 27 40 38 C30 27 33 19 40 8 Z" fill={`url(#${id}f)`} style={{ animationDelay: `${delay}s` }} />
      <path d="M40 22 C43 28 43 32 40 37 C37 32 37 28 40 22 Z" fill="#FFFBEA" opacity={0.85} />
      <path d="M6 44 Q40 76 74 44 Q57 52 40 52 Q23 52 6 44 Z" fill={`url(#${id}c)`} />
      <path d="M6 44 Q23 52 40 52 Q57 52 74 44" stroke={S.gold} strokeWidth={1.6} fill="none" />
      {[16, 28, 40, 52, 64].map((x) => (
        <circle key={x} cx={x} cy={x === 40 ? 60 : x === 28 || x === 52 ? 58 : 54} r={1.4} fill={S.goldLight} />
      ))}
    </svg>
  )
}

/** The havan kund: a stepped brass kund with live flames and rising sparks. */
export function HavanFire({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const flames = [
    { d: 'M100 18 C116 44 124 64 100 96 C76 64 84 44 100 18 Z', delay: 0, o: 1 },
    { d: 'M78 46 C88 62 92 76 80 98 C66 78 70 62 78 46 Z', delay: 0.3, o: 0.92 },
    { d: 'M122 46 C134 62 132 78 120 98 C108 76 112 62 122 46 Z', delay: 0.55, o: 0.92 },
    { d: 'M100 44 C108 60 110 72 100 96 C90 72 92 60 100 44 Z', delay: 0.2, o: 1, core: true },
  ]
  const sparks = [
    { x: 92, d: 0 }, { x: 108, d: 0.7 }, { x: 84, d: 1.3 }, { x: 116, d: 1.8 }, { x: 100, d: 1 }, { x: 96, d: 2.2 },
  ]
  return (
    <svg viewBox="0 0 200 170" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#FFD36B" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#FF7A1A" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FF4D00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#E8380D" />
          <stop offset="0.5" stopColor="#FF9A1F" />
          <stop offset="1" stopColor="#FFE07A" />
        </linearGradient>
        <linearGradient id={`${id}k`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={S.goldDeep} />
          <stop offset="0.45" stopColor={S.goldLight} />
          <stop offset="1" stopColor={S.goldDeep} />
        </linearGradient>
      </defs>
      <circle className="sp-glow" cx={100} cy={78} r={80} fill={`url(#${id}g)`} />
      {sparks.map((s, i) => (
        <circle key={i} className="sp-spark" cx={s.x} cy={70} r={1.6} fill="#FFE07A" style={{ animationDelay: `${s.d}s` }} />
      ))}
      {flames.map((f, i) => (
        <path key={i} className="sp-flame" d={f.d} fill={f.core ? '#FFF1B8' : `url(#${id}f)`} opacity={f.o} style={{ animationDelay: `${f.delay}s` }} />
      ))}
      <path d="M58 96 H142 L134 110 H66 Z" fill={`url(#${id}k)`} />
      <path d="M50 110 H150 L142 126 H58 Z" fill={S.goldDeep} />
      <path d="M42 126 H158 L150 144 H50 Z" fill={`url(#${id}k)`} />
      <path d="M58 96 H142 M50 110 H150 M42 126 H158" stroke={S.redDeep} strokeWidth={1} opacity={0.5} />
      {[70, 100, 130].map((x) => (
        <g key={x} transform={`translate(${x} 135)`}>
          <circle r={3.2} fill={S.sindoor} />
          <circle r={1.3} fill={S.yellow} />
        </g>
      ))}
    </svg>
  )
}

/** A footprint painted in alta — outlined in gold until the step is taken. */
export function Footprint({ taken, flip, current }: { taken: boolean; flip?: boolean; current?: boolean }) {
  const fill = taken ? S.sindoor : 'transparent'
  const stroke = taken ? S.goldLight : S.gold
  return (
    <svg viewBox="0 0 24 34" className={`sp-foot ${current ? 'is-current' : ''}`} style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      <path d="M12 33 C5 33 4 26 5 20 C6 14 8 11 12 11 C17 11 19 15 19 21 C19 27 18 33 12 33 Z" fill={fill} stroke={stroke} strokeWidth={1.3} />
      {[
        [7.2, 7.4, 2.6],
        [11.4, 5.4, 2.3],
        [15.1, 5.8, 2],
        [18, 7.6, 1.7],
        [20.2, 10.4, 1.4],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={1.1} />
      ))}
      {taken && <circle cx={12} cy={23} r={2.2} fill={S.goldLight} opacity={0.8} />}
    </svg>
  )
}

/** A butti: the small gold flower embroidered into the antarpat's corners. */
export function Butti({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={0} cy={-6.2} rx={2.2} ry={4.8} fill={i % 2 ? S.goldLight : S.gold} transform={`rotate(${i * 45})`} />
      ))}
      <circle r={3} fill={S.goldLight} />
      <circle r={1.3} fill={S.sindoor} />
    </svg>
  )
}

/** A small marigold-and-leaf mark that sits over section headings. */
export function FloralMark({ className, light }: { className?: string; light?: boolean }) {
  const line = light ? S.goldLight : S.goldDeep
  return (
    <svg viewBox="0 0 160 28" className={className} aria-hidden>
      <path d="M4 14 H58 M102 14 H156" stroke={line} strokeWidth={1} opacity={0.7} />
      <circle cx={58} cy={14} r={1.6} fill={line} />
      <circle cx={102} cy={14} r={1.6} fill={line} />
      <MangoLeaf x={68} y={16} rot={-62} len={13} />
      <MangoLeaf x={92} y={16} rot={62} len={13} />
      <Marigold x={70} y={15} r={5.2} c={S.yellow} dark="#E39A12" />
      <Marigold x={90} y={15} r={5.2} c={S.yellow} dark="#E39A12" />
      <Marigold x={80} y={13} r={7.4} />
    </svg>
  )
}

/* ─── Function motifs: line drawings in zari gold ──────────────────────── */

export type MotifKind = 'haldi' | 'mehendi' | 'sangeet' | 'baraat' | 'pheras' | 'varmala' | 'tilak' | 'kalash'

export function motifFor(name: string): MotifKind {
  const n = name.toLowerCase()
  if (/haldi|turmeric|pithi|ubtan/.test(n)) return 'haldi'
  if (/mehe?ndi|henna/.test(n)) return 'mehendi'
  if (/sangeet|garba|dandiya|cocktail|music/.test(n)) return 'sangeet'
  if (/baraat|barat|procession|ghudchadi/.test(n)) return 'baraat'
  if (/phera|vivah|wedding|muhurat|saptapadi|lagna|ceremony/.test(n)) return 'pheras'
  if (/reception|jaimala|varmala|vidaai|bidaai/.test(n)) return 'varmala'
  if (/tilak|roka|sagai|engagement|mangni|puja|pooja/.test(n)) return 'tilak'
  return 'kalash'
}

export function Motif({ kind, className, color = S.goldLight }: { kind: MotifKind; className?: string; color?: string }) {
  const p = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {kind === 'haldi' && (
        <g {...p}>
          <path d="M8 26 H40 C39 35 33 41 24 41 C15 41 9 35 8 26 Z" />
          <path d="M13 26 C15 21 19 19 24 20 C29 19 33 21 35 26" />
          <path d="M30 18 C34 12 39 10 42 9 C41 14 37 18 30 18 Z" />
          <path d="M18 33 H30" opacity={0.6} />
        </g>
      )}
      {kind === 'mehendi' && (
        <g {...p}>
          <path d="M16 42 V25 C16 23 18 22 19 24 V14 C19 12 22 12 22 14 V22 V11 C22 9 25 9 25 11 V22 V12 C25 10 28 10 28 12 V23 V16 C28 14 31 14 31 16 V30 C31 37 27 42 22 42 Z" />
          <circle cx={23.5} cy={31} r={3} />
          <circle cx={23.5} cy={31} r={0.8} fill={color} />
          <path d="M20 37 H27" opacity={0.6} />
        </g>
      )}
      {kind === 'sangeet' && (
        <g {...p}>
          <path d="M9 18 C9 14 39 14 39 18 V30 C39 34 9 34 9 30 Z" />
          <ellipse cx={9} cy={24} rx={3} ry={6} />
          <ellipse cx={39} cy={24} rx={3} ry={6} />
          <path d="M14 16 L20 32 M20 16 L26 32 M26 16 L32 32 M32 16 L36 26" opacity={0.75} />
          <path d="M6 10 L12 14 M42 10 L36 14" />
        </g>
      )}
      {kind === 'baraat' && (
        <g {...p}>
          <path d="M8 22 C12 12 36 12 40 22 Z" />
          <path d="M24 9 V12 M24 22 V42 M20 42 H28" />
          <path d="M12 22 V25 M18 22 V26 M24 22 V26 M30 22 V26 M36 22 V25" opacity={0.75} />
          <circle cx={24} cy={8} r={1.4} fill={color} />
        </g>
      )}
      {kind === 'pheras' && (
        <g {...p}>
          <path d="M24 8 C30 16 32 22 24 30 C16 22 18 16 24 8 Z" />
          <path d="M17 18 C20 22 20 26 18 30 C13 26 14 22 17 18 Z" />
          <path d="M31 18 C34 22 35 26 30 30 C28 26 28 22 31 18 Z" />
          <path d="M11 32 H37 L34 37 H14 Z M8 37 H40 L37 42 H11 Z" />
        </g>
      )}
      {kind === 'varmala' && (
        <g {...p}>
          <path d="M10 10 C10 34 38 34 38 10" />
          {[[11, 17], [14, 24], [19, 29], [24, 31], [29, 29], [34, 24], [37, 17]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={2.4} />
          ))}
          <path d="M24 33 V40 M21 40 H27" />
        </g>
      )}
      {kind === 'tilak' && (
        <g {...p}>
          <ellipse cx={24} cy={32} rx={16} ry={5} />
          <path d="M8 32 C8 37 40 37 40 32" />
          <path d="M24 14 C27 19 27 22 24 26 C21 22 21 19 24 14 Z" />
          <circle cx={15} cy={30} r={1.8} fill={color} />
          <circle cx={33} cy={30} r={1.8} fill={color} />
        </g>
      )}
      {kind === 'kalash' && (
        <g {...p}>
          <path d="M17 18 H31 C31 21 29 22 29 23 C35 25 38 29 38 33 C38 39 31 42 24 42 C17 42 10 39 10 33 C10 29 13 25 19 23 C19 22 17 21 17 18 Z" />
          <path d="M24 18 V10 M24 16 L17 9 M24 16 L31 9" />
          <circle cx={24} cy={32} r={2.6} />
        </g>
      )}
    </svg>
  )
}

/* ─── The night sky: Dhruva, the Saptarishi, Vasishtha and Arundhati ──────── */

const STARS: [number, number, number, number][] = [
  // x, y, r, twinkle delay
  [22, 30, 0.9, 0.2], [48, 74, 0.7, 1.4], [70, 22, 1, 0.8], [160, 18, 0.8, 2.1], [188, 52, 0.7, 0.5], [212, 26, 1.1, 1.7],
  [252, 60, 0.8, 0.9], [280, 20, 0.9, 2.4], [306, 48, 0.7, 1.1], [330, 82, 1, 0.3], [352, 30, 0.8, 1.9], [378, 64, 0.9, 0.6],
  [30, 128, 0.8, 1.2], [56, 180, 0.7, 2.2], [262, 150, 0.8, 0.4], [296, 186, 0.7, 1.6], [338, 140, 1, 2.6], [372, 176, 0.8, 0.1],
  [148, 196, 0.7, 1.3], [196, 170, 0.8, 2], [236, 196, 0.7, 0.7], [118, 64, 0.6, 1.8], [16, 196, 0.7, 2.8], [390, 110, 0.7, 1.5],
]

/** Saptarishi, the Big Dipper: Kratu, Pulaha, Pulastya, Atri, Angiras, Vasishtha, Marichi. */
const RISHIS: [number, number][] = [
  [104, 130], [84, 168], [134, 176], [148, 142], [184, 132], [216, 120], [254, 132],
]

export function NightSky({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const dhruva: [number, number] = [136, 44]
  return (
    <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E0310" />
          <stop offset="0.55" stopColor="#2A0614" />
          <stop offset="1" stopColor={S.night} />
        </linearGradient>
        <radialGradient id={`${id}d`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor={S.goldLight} stopOpacity="0.45" />
          <stop offset="1" stopColor={S.gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={400} height={220} fill={`url(#${id}s)`} />
      {STARS.map(([x, y, r, d], i) => (
        <circle key={i} className="sp-twinkle" cx={x} cy={y} r={r} fill="#FFF4DF" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* the pointer stars lead the eye to Dhruva */}
      <path d={`M${RISHIS[1][0]} ${RISHIS[1][1]} L${dhruva[0]} ${dhruva[1]}`} stroke={S.goldLight} strokeWidth={0.6} strokeDasharray="2 4" opacity={0.45} />
      <path d={`M${RISHIS.map(([x, y]) => `${x} ${y}`).join(' L')} M${RISHIS[0][0]} ${RISHIS[0][1]} L${RISHIS[3][0]} ${RISHIS[3][1]}`} stroke={S.goldLight} strokeWidth={0.7} fill="none" opacity={0.5} />
      {RISHIS.map(([x, y], i) => (
        <circle key={i} className="sp-twinkle" cx={x} cy={y} r={2} fill="#FFF4DF" style={{ animationDelay: `${i * 0.37}s` }} />
      ))}
      {/* Arundhati, always beside Vasishtha */}
      <circle className="sp-twinkle" cx={RISHIS[5][0] + 6} cy={RISHIS[5][1] - 5} r={1.1} fill={S.goldLight} style={{ animationDelay: '0.9s' }} />
      <circle className="sp-glow" cx={dhruva[0]} cy={dhruva[1]} r={16} fill={`url(#${id}d)`} />
      <path
        d={`M${dhruva[0]} ${dhruva[1] - 7} L${dhruva[0] + 1.6} ${dhruva[1] - 1.6} L${dhruva[0] + 7} ${dhruva[1]} L${dhruva[0] + 1.6} ${dhruva[1] + 1.6} L${dhruva[0]} ${dhruva[1] + 7} L${dhruva[0] - 1.6} ${dhruva[1] + 1.6} L${dhruva[0] - 7} ${dhruva[1]} L${dhruva[0] - 1.6} ${dhruva[1] - 1.6} Z`}
        fill="#FFF8E6"
      />
      <text x={dhruva[0] + 12} y={dhruva[1] + 4} fill={S.goldLight} fontSize={9} letterSpacing={1.2} opacity={0.85}>DHRUVA</text>
      <text x={RISHIS[5][0] - 10} y={RISHIS[5][1] - 14} fill={S.goldLight} fontSize={7} letterSpacing={0.8} opacity={0.7}>VASISHTHA · ARUNDHATI</text>
    </svg>
  )
}
