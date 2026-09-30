/**
 * Line botanicals generated from a seed, so every leaf is slightly different —
 * the irregularity is what makes them read as drawn rather than stamped.
 */

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A lens-shaped leaf pointing along +x from the origin. */
function leafPath(len: number, width: number, bend: number) {
  const w = width / 2
  return `M0 0 C ${len * 0.3} ${-w * 1.2 + bend} ${len * 0.72} ${-w + bend} ${len} ${bend * 0.6} C ${len * 0.7} ${w + bend * 0.4} ${len * 0.28} ${w * 1.1} 0 0 Z`
}

interface Leaf {
  x: number
  y: number
  angle: number
  len: number
  width: number
  bend: number
}

/**
 * A horizontal sprig (olive / eucalyptus) in a 240×80 box, stem running left
 * to right. `flip` mirrors it for the other side of a composition.
 */
export function Sprig({
  color = 'currentColor',
  fill = 'none',
  seed = 7,
  leaves = 9,
  strokeWidth = 1.1,
  flip = false,
  className,
  style,
  draw = false,
}: {
  color?: string
  fill?: string
  seed?: number
  leaves?: number
  strokeWidth?: number
  flip?: boolean
  className?: string
  style?: React.CSSProperties
  /** Adds the `botanical-draw` class hooks for a stroke-drawing entrance. */
  draw?: boolean
}) {
  const r = rng(seed)
  const stem = 'M8 58 C 60 50, 120 36, 232 22'
  // Points along the stem (cubic approximation sampled by hand-tuned t values).
  const at = (t: number) => {
    const p0 = [8, 58], p1 = [60, 50], p2 = [120, 36], p3 = [232, 22]
    const u = 1 - t
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    return [x, y]
  }
  const list: Leaf[] = []
  for (let i = 0; i < leaves; i++) {
    const t = 0.1 + (i / (leaves - 1)) * 0.86
    const [x, y] = at(t)
    const side = i % 2 === 0 ? -1 : 1
    const size = 1 - t * 0.45
    list.push({
      x,
      y,
      angle: -12 + side * (38 + r() * 18),
      len: (30 + r() * 10) * size,
      width: (10 + r() * 4) * size,
      bend: side * (1 + r() * 2.5),
    })
  }
  return (
    <svg
      viewBox="0 0 240 80"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible', ...style }}
      aria-hidden
    >
      <path d={stem} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" className={draw ? 'botanical-stroke' : undefined} />
      {list.map((l, i) => (
        <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}>
          <path
            d={leafPath(l.len, l.width, l.bend)}
            fill={fill}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            className={draw ? 'botanical-leaf' : undefined}
            style={draw ? { animationDelay: `${600 + i * 90}ms` } : undefined}
          />
          <path d={`M1 0 L ${(l.len * 0.8).toFixed(1)} ${(l.bend * 0.4).toFixed(1)}`} stroke={color} strokeWidth={strokeWidth * 0.6} opacity={0.7} />
        </g>
      ))}
      <circle cx="232" cy="22" r="2.2" fill={color} />
    </svg>
  )
}

/**
 * An open laurel wreath (two arcs of leaves meeting at the bottom), drawn in a
 * 200×200 box, for framing a monogram.
 */
export function Laurel({
  color = 'currentColor',
  fill = 'none',
  seed = 11,
  strokeWidth = 1,
  className,
  style,
}: {
  color?: string
  fill?: string
  seed?: number
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
}) {
  const r = rng(seed)
  const cx = 100, cy = 100, R = 78
  const arc = (side: 1 | -1) => {
    const leaves: Leaf[] = []
    const count = 11
    for (let i = 0; i < count; i++) {
      // from bottom (90deg) up to ~ -40deg on each side
      const a = ((90 - side * (18 + i * 12.5)) * Math.PI) / 180
      const x = cx + R * Math.cos(a)
      const y = cy + R * Math.sin(a)
      const tangent = (a * 180) / Math.PI + (side === 1 ? -90 : 90)
      const size = 1 - i * 0.035
      for (const k of [-1, 1] as const) {
        leaves.push({
          x,
          y,
          angle: tangent + k * (28 + r() * 10) * -side,
          len: (22 + r() * 6) * size,
          width: (8 + r() * 3) * size,
          bend: k * (0.8 + r() * 1.6),
        })
      }
    }
    return leaves
  }
  const all = [...arc(1), ...arc(-1)]
  const stemPath = (side: 1 | -1) => {
    const a0 = ((90 - side * 16) * Math.PI) / 180
    const a1 = ((90 - side * 150) * Math.PI) / 180
    return `M ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 0 ${side === 1 ? 0 : 1} ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}`
  }
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <path d={stemPath(1)} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d={stemPath(-1)} fill="none" stroke={color} strokeWidth={strokeWidth} />
      {all.map((l, i) => (
        <path
          key={i}
          d={leafPath(l.len, l.width, l.bend)}
          transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
