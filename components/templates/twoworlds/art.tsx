import type { CSSProperties } from 'react'

/*
 * Two Worlds — the drawing kit.
 *
 * Everything here is thread. The bride's side is Ukrainian vyshyvanka: counted
 * cross-stitch in red and black, every X sewn as two slightly uneven passes of
 * thread. The groom's side is Indian kantha and zari: a single gold running
 * stitch that draws paisleys, lotuses and a mango-leaf toran. Where the two
 * meet (the opening knot, the woven band, the route between three cities) the
 * threads cross, the way two families do.
 */

export const S = {
  ivory: '#F7F0E4',
  paper: '#FBF7EF',
  linen: '#EFE5D3',
  card: '#FFFCF6',
  ink: '#2A2023',
  soft: '#6E6158',
  faint: '#9A8B80',
  gold: '#B48F55',
  goldLight: '#E3C995',
  goldDeep: '#8A6731',
  wine: '#5B1A26',
  wineDeep: '#3B0E17',
  wineSoft: '#7B2F3B',
  thread: '#A9262F',
  threadDark: '#7A1820',
  stitchInk: '#2B1E20',
  blue: '#2D4870',
  blueDeep: '#18273F',
  dusk: '#22355A',
  blueSoft: '#6F88B0',
  rule: 'rgba(42,32,35,0.14)',
  ruleGold: 'rgba(180,143,85,0.5)',
} as const

/* ─── Cross-stitch ──────────────────────────────────────────────────────────── */

/** Deterministic noise per cell, so the server and the browser sew the same stitches. */
function noise(x: number, y: number, k: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + k * 74.7) * 43758.5453
  return n - Math.floor(n) - 0.5
}

/** A cell grid: one string per row, one character per cell; '.' is unstitched linen. */
export type Grid = string[]

const THREADS: Record<string, string> = { r: S.thread, k: S.stitchInk, d: S.threadDark, b: S.blue, g: S.goldDeep }

/**
 * Counted cross-stitch. Each cell is two diagonal passes, the second laid over
 * the first as a sewer would, with a fine highlight along the top thread and a
 * little irregularity at every end.
 */
export function CrossStitch({ grid, cell = 6, threads = THREADS, className, style, title }: {
  grid: Grid
  cell?: number
  threads?: Record<string, string>
  className?: string
  style?: CSSProperties
  title?: string
}) {
  const h = grid.length
  const w = Math.max(...grid.map((r) => r.length))
  const inset = cell * 0.17
  const lines: JSX.Element[] = []
  grid.forEach((row, y) => {
    Array.from(row).forEach((ch, x) => {
      const color = threads[ch]
      if (!color) return
      const j = (k: number) => noise(x, y, k) * cell * 0.11
      const x0 = x * cell + inset, y0 = y * cell + inset
      const x1 = (x + 1) * cell - inset, y1 = (y + 1) * cell - inset
      const under = `M${x0 + j(1)} ${y1 + j(2)}L${x1 + j(3)} ${y0 + j(4)}`
      const over = `M${x0 + j(5)} ${y0 + j(6)}L${x1 + j(7)} ${y1 + j(8)}`
      lines.push(
        <path key={`${x}-${y}-u`} d={under} stroke={color} />,
        <path key={`${x}-${y}-o`} d={over} stroke={color} />,
        <path key={`${x}-${y}-h`} d={over} stroke="#fff" strokeOpacity={0.22} strokeWidth={cell * 0.07} />,
      )
    })
  })
  return (
    <svg
      viewBox={`0 0 ${w * cell} ${h * cell}`}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g fill="none" strokeLinecap="round" strokeWidth={cell * 0.27}>{lines}</g>
    </svg>
  )
}

/** The vosmykutna zirka, the eight-pointed star of Ukrainian embroidery: a square and a diamond, laid on each other. */
export function rozha(R = 8, S2 = 5): Grid {
  const rows: string[] = []
  const inside = (x: number, y: number) => Math.abs(x) + Math.abs(y) <= R || (Math.abs(x) <= S2 && Math.abs(y) <= S2)
  for (let y = -R; y <= R; y++) {
    let row = ''
    for (let x = -R; x <= R; x++) {
      if (!inside(x, y)) { row += '.'; continue }
      const edge = !inside(x + 1, y) || !inside(x - 1, y) || !inside(x, y + 1) || !inside(x, y - 1)
      const seam = Math.abs(x) === Math.abs(y) || x === 0 || y === 0
      const heart = Math.abs(x) + Math.abs(y) <= 2
      if (heart) row += Math.abs(x) + Math.abs(y) === 0 ? 'k' : Math.abs(x) + Math.abs(y) === 2 ? 'r' : '.'
      else if (edge) row += 'k'
      else if (seam) row += '.'
      else row += 'r'
    }
    rows.push(row)
  }
  return rows
}

/** Kalyna, the guelder-rose: a cluster of red berries on black stems, the Ukrainian sign of love. */
export function kalyna(): Grid {
  const W = 19, H = 17
  const cells = Array.from({ length: H }, () => Array(W).fill('.'))
  const put = (x: number, y: number, c: string) => { if (x >= 0 && y >= 0 && x < W && y < H) cells[y][x] = c }
  // Stems, from the top of the sprig to each berry.
  const stems: [number, number, number, number][] = [[9, 1, 9, 6], [9, 3, 5, 7], [9, 3, 13, 7], [9, 5, 7, 10], [9, 5, 12, 11]]
  for (const [ax, ay, bx, by] of stems) {
    const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay))
    for (let i = 0; i <= n; i++) put(Math.round(ax + ((bx - ax) * i) / n), Math.round(ay + ((by - ay) * i) / n), 'k')
  }
  // Leaves, either side of the sprig.
  for (const [x, y] of [[6, 1], [5, 2], [4, 2], [5, 3], [12, 1], [13, 2], [14, 2], [13, 3]]) put(x, y, 'k')
  // Berries: round clusters of red with a darker cell on the shaded side.
  const berries: [number, number][] = [[9, 8], [5, 9], [13, 9], [7, 12], [11, 13], [9, 15], [4, 13], [14, 13]]
  for (const [cx, cy] of berries) {
    for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) if (Math.abs(x) + Math.abs(y) < 2 || (x === 1 && y === 1)) put(cx + x, cy + y, x === 1 && y === 1 ? 'd' : 'r')
  }
  return cells.map((r) => r.join(''))
}

/** One repeat of a rushnyk border: a red diamond with a black heart, black rules above and below. */
export function bandTile(): Grid {
  const W = 14, H = 11
  const rows: string[] = []
  for (let y = 0; y < H; y++) {
    let row = ''
    for (let x = 0; x < W; x++) {
      const dx = Math.abs(x - 6.5), dy = Math.abs(y - 5)
      const d = dx + dy
      if (y === 0 || y === H - 1) row += x % 2 === 0 ? 'k' : '.'
      else if (d >= 4.4 && d <= 5.6) row += 'r'
      else if (d <= 1.6) row += 'k'
      else if ((x === 0 || x === W - 1) && y === 5) row += 'r'
      else row += '.'
    }
    rows.push(row)
  }
  return rows
}

/**
 * A rushnyk band of any length: the tile is sewn once into an SVG pattern and
 * repeated, so a band across a whole page costs a handful of elements.
 */
export function StitchBand({ id, cell = 4, className, style, light = false }: { id: string; cell?: number; className?: string; style?: CSSProperties; light?: boolean }) {
  const tile = bandTile()
  const w = tile[0].length * cell, h = tile.length * cell
  return (
    <svg aria-hidden className={className} style={style} height={h} width="100%" preserveAspectRatio="xMinYMid slice">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          <CrossStitchTile grid={tile} cell={cell} threads={light ? LIGHT_THREADS : THREADS} />
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  )
}

/** Gold and ivory thread, for a band sewn on burgundy. */
const LIGHT_THREADS: Record<string, string> = { r: S.goldLight, k: 'rgba(247,240,228,0.55)', d: S.gold, b: S.blueSoft, g: S.goldLight }

function CrossStitchTile({ grid, cell, threads }: { grid: Grid; cell: number; threads: Record<string, string> }) {
  const inset = cell * 0.17
  const out: JSX.Element[] = []
  grid.forEach((row, y) => Array.from(row).forEach((ch, x) => {
    const color = threads[ch]
    if (!color) return
    const x0 = x * cell + inset, y0 = y * cell + inset, x1 = (x + 1) * cell - inset, y1 = (y + 1) * cell - inset
    out.push(<path key={`${x}-${y}`} d={`M${x0} ${y1}L${x1} ${y0}M${x0} ${y0}L${x1} ${y1}`} stroke={color} strokeWidth={cell * 0.27} strokeLinecap="round" fill="none" />)
  }))
  return <g>{out}</g>
}

/* ─── Running stitch (kantha, zari) ─────────────────────────────────────────── */

/** Props shared by the gold-thread drawings: a stitch length and gap, in viewBox units. */
const run = (stitch = 5, gap = 3.4) => ({ fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeDasharray: `${stitch} ${gap}` })

/** A buta (paisley) in gold running stitch, with an echo inside it and a seed of French knots. */
export function Paisley({ className, style, color = S.gold, flip = false }: { className?: string; style?: CSSProperties; color?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 100 130" className={className} style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}>
      <g stroke={color} strokeWidth={2.2} {...run(5, 3.6)}>
        <path d="M50 124C24 124 10 106 12 84 14 62 34 52 48 42 60 33 66 22 63 10 C61 4 55 4 53 9 C77 16 88 38 88 60 88 86 78 108 66 118 61 122 56 124 50 124Z" />
        <path d="M52 108C34 108 26 96 27 82 28 68 40 60 50 53 58 47 63 40 64 32 C74 42 78 56 77 72 76 92 66 108 52 108Z" strokeWidth={1.8} />
      </g>
      <g fill={color}>
        {[[48, 94], [58, 86], [44, 80], [60, 72], [52, 68]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.1} />)}
      </g>
    </svg>
  )
}

/** A lotus in gold running stitch: five petals on a curved stalk of water. */
export function Lotus({ className, style, color = S.gold }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 140 96" className={className} style={style}>
      <g stroke={color} strokeWidth={2} {...run(4.6, 3.2)}>
        <path d="M70 72C60 56 60 30 70 12 80 30 80 56 70 72Z" />
        <path d="M70 72C54 64 44 46 46 26 60 34 68 52 70 72Z" />
        <path d="M70 72C86 64 96 46 94 26 80 34 72 52 70 72Z" />
        <path d="M70 74C50 74 30 66 22 50 40 48 58 58 70 74Z" />
        <path d="M70 74C90 74 110 66 118 50 100 48 82 58 70 74Z" />
        <path d="M24 84C48 78 92 78 116 84" />
        <path d="M38 91C56 88 84 88 102 91" strokeWidth={1.6} />
      </g>
    </svg>
  )
}

/** A toran of mango leaves strung on a gold thread, the welcome hung over Indian doorways. */
export function Toran({ className, style, leaves = 9, color = S.gold, leaf = '#5E6B3C' }: { className?: string; style?: CSSProperties; leaves?: number; color?: string; leaf?: string }) {
  const w = 40 * leaves
  return (
    <svg aria-hidden viewBox={`0 0 ${w} 70`} className={className} style={style} preserveAspectRatio="xMidYMin meet">
      <path d={`M0 10Q${w / 2} 22 ${w} 10`} stroke={color} strokeWidth={2} {...run(6, 3.4)} />
      {Array.from({ length: leaves }, (_, i) => {
        const x = 20 + i * 40
        const sag = 10 + 12 * Math.sin((Math.PI * x) / w)
        const len = i % 2 ? 40 : 48
        return (
          <g key={i} transform={`translate(${x} ${sag}) rotate(${(i - (leaves - 1) / 2) * 1.6})`}>
            <path d={`M0 0C-11 ${len * 0.35} -9 ${len * 0.8} 0 ${len}C9 ${len * 0.8} 11 ${len * 0.35} 0 0Z`} fill={leaf} opacity={0.9} />
            <path d={`M0 3V${len - 4}`} stroke={S.goldLight} strokeWidth={1} {...run(3, 2.6)} />
            {i % 2 === 0 && <circle cx={0} cy={len + 6} r={4.5} fill="#E08A2E" />}
          </g>
        )
      })}
    </svg>
  )
}

/** A ring of gold running stitch with four red cross-stitches at the quarters: the two threads in one frame. */
export function StitchRing({ className, style, color = S.gold }: { className?: string; style?: CSSProperties; color?: string }) {
  const q = (cx: number, cy: number) => `M${cx - 4} ${cy - 4}L${cx + 4} ${cy + 4}M${cx + 4} ${cy - 4}L${cx - 4} ${cy + 4}`
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className} style={style}>
      <circle cx={60} cy={60} r={54} stroke={color} strokeWidth={1.8} {...run(5, 3.4)} />
      <circle cx={60} cy={60} r={47} stroke={color} strokeWidth={1} strokeOpacity={0.55} fill="none" />
      <path d={`${q(60, 6)}${q(114, 60)}${q(60, 114)}${q(6, 60)}`} stroke={S.thread} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  )
}

/* ─── Where it began ────────────────────────────────────────────────────────── */

/**
 * Dubai after dark, drawn in gold thread: the skyline with its needle, the
 * Frame, the sail on the water, a dhow, a crescent and a few stars, and the
 * lights broken up in the water. Drawn, not photographed, so it suits any couple
 * whose story began there, and it can never be the wrong photo.
 */
export function Skyline({ className, style, color = S.goldLight }: { className?: string; style?: CSSProperties; color?: string }) {
  const windows = (x: number, top: number, bottom: number, cols: number, gap = 6) =>
    Array.from({ length: cols }, (_, i) => <path key={`w${x}-${i}`} d={`M${x + 4 + i * gap} ${top + 8}V${bottom - 6}`} strokeDasharray="1.6 4.4" strokeWidth={1.4} />)
  return (
    <svg viewBox="0 0 640 260" className={className} style={style} role="img" aria-label="The Dubai skyline at night, drawn in gold thread">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}>
        {/* Crescent and stars */}
        <path d="M548 44a18 18 0 1 0 14 30 15 15 0 1 1-14-30Z" fill={color} fillOpacity={0.9} stroke="none" />
        {[[88, 40], [180, 26], [402, 34], [470, 66], [610, 22], [36, 82]].map(([x, y]) => (
          <path key={`s${x}`} d={`M${x} ${y - 5}V${y + 5}M${x - 5} ${y}H${x + 5}`} strokeWidth={1.2} />
        ))}
        {/* The Frame */}
        <path d="M118 210V118H170V210M128 210V128H160V210M118 124H170" />
        {/* Towers, west to east, with lit windows */}
        <path d="M184 210V150L196 142V210" />
        {windows(184, 150, 210, 2)}
        <path d="M206 210V104C206 100 220 100 220 104V210" />
        {windows(206, 104, 210, 2)}
        <path d="M228 210C230 180 236 160 232 132 236 124 246 124 246 132 244 160 250 180 252 210" />
        {/* The needle: setbacks to a spire */}
        <path d="M268 210L272 170H278L280 128H286L288 92H292L294 60H296L298 18L300 60H302L304 92H308L310 128H316L318 170H324L328 210" />
        <path d="M298 18V8" strokeWidth={1.2} />
        <path d="M338 210V124H356V210" />
        {windows(338, 124, 210, 3)}
        <path d="M364 210V146L378 138L392 146V210" />
        {windows(364, 146, 210, 4)}
        <path d="M402 210V112C410 104 420 104 428 112V210" />
        {windows(402, 112, 210, 4)}
        <path d="M438 210V160H462V210" />
        {/* The sail */}
        <path d="M498 210V104C540 120 560 170 562 210" />
        <path d="M494 210V98M494 120H504M494 150H520M494 180H540" strokeWidth={1.2} />
        {/* The shore and the water */}
        <path d="M20 210H620" strokeWidth={1.4} />
        {[0, 1, 2, 3].map((i) => (
          <path key={`r${i}`} d={`M${60 + i * 140} ${222 + (i % 2) * 8}H${120 + i * 140}`} strokeDasharray="10 7" strokeOpacity={0.6} strokeWidth={1.2} />
        ))}
        {[268, 300, 330, 410, 500].map((x, i) => (
          <path key={`l${x}`} d={`M${x} ${218 + (i % 3) * 7}h${8 + (i % 2) * 6}`} strokeWidth={1.4} strokeOpacity={0.8} />
        ))}
        {/* A dhow under sail */}
        <path d="M44 226C60 236 92 236 108 226H44ZM76 226V190L58 222M76 196L100 222" strokeWidth={1.4} />
      </g>
    </svg>
  )
}

/** Two glasses meeting over a table, the evening it started. */
export function Glasses({ className, style, color = S.gold }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 110" className={className} style={style}>
      <g fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-14 38 60)">
          <path d="M22 22H54C54 42 48 54 38 56 28 54 22 42 22 22Z" />
          <path d="M24 32H52" strokeOpacity={0.55} />
          <path d="M38 56V88M26 90H50" />
        </g>
        <g transform="rotate(14 82 60)">
          <path d="M66 22H98C98 42 92 54 82 56 72 54 66 42 66 22Z" />
          <path d="M68 32H96" strokeOpacity={0.55} />
          <path d="M82 56V88M70 90H94" />
        </g>
        <path d="M60 8V2M52 10L48 5M68 10L72 5" stroke={S.thread} />
      </g>
    </svg>
  )
}

/* ─── Where the two threads meet ────────────────────────────────────────────── */

/** Points along a quadratic curve, for laying single cross-stitches along a path. */
export function curvePoints(a: [number, number], c: [number, number], b: [number, number], n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0]
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]
    return [x, y]
  })
}

/** `n` points spaced evenly along a quadratic curve (by length, not by parameter), so stitches never bunch. */
export function evenCurvePoints(a: [number, number], c: [number, number], b: [number, number], n: number): [number, number][] {
  const fine = curvePoints(a, c, b, 240)
  const dist = [0]
  for (let i = 1; i < fine.length; i++) dist.push(dist[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]))
  const total = dist[dist.length - 1]
  return Array.from({ length: n }, (_, k) => {
    const target = (total * k) / (n - 1)
    const i = Math.max(0, dist.findIndex((d) => d >= target))
    return fine[i]
  })
}

/** A single cross-stitch at a point. */
export function xAt(x: number, y: number, s = 4.5) {
  return `M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`
}
