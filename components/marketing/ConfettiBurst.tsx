'use client'

import { useEffect, useState, type CSSProperties } from 'react'

/**
 * A one-shot confetti burst in the Rajwada palette: pieces fly out from
 * (`x`, `y`) inside the nearest positioned parent, tumble and fall away in
 * about 1.6 seconds, then the layer removes itself.
 *
 * Pieces are generated after mount, so server and client markup match, and
 * nothing renders for visitors who ask for reduced motion.
 */

const COLOURS = ['#E8C866', '#C9A45C', '#F6E3A8', '#8A2E35', '#B5434E', '#FFF3D6', '#0B4A34']

interface Piece {
  style: CSSProperties
}

function pieces(count: number, spread: number, direction: 'up' | 'down', reach: number): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    // A fan around straight up (or down), like a popper, a few going sideways.
    const angle = ((direction === 'up' ? -90 : 90) + (Math.random() - 0.5) * 150 * spread) * (Math.PI / 180)
    const distance = (70 + Math.random() * 120 * spread) * reach
    const shape = i % 3
    const w = shape === 0 ? 7 : shape === 1 ? 6 : 3.5
    const h = shape === 0 ? 11 : shape === 1 ? 6 : 15
    return {
      style: {
        width: w,
        height: h,
        borderRadius: shape === 1 ? '50%' : 1.5,
        background: COLOURS[i % COLOURS.length],
        '--dx': `${Math.cos(angle) * distance}px`,
        '--dy': `${Math.sin(angle) * distance}px`,
        '--fall': `${90 + Math.random() * 110}px`,
        '--rot': `${(Math.random() - 0.5) * 900}deg`,
        animationDelay: `${Math.random() * 90}ms`,
        animationDuration: `${1300 + Math.random() * 600}ms`,
      } as CSSProperties,
    }
  })
}

export default function ConfettiBurst({
  x = '50%',
  y = '50%',
  count = 44,
  spread = 1,
  delay = 0,
  direction = 'up',
  reach = 1,
}: {
  x?: string
  y?: string
  count?: number
  /** 1 = a wide fan; smaller keeps the burst tight. */
  spread?: number
  delay?: number
  /** 'down' for a burst from a bar at the top of the page. */
  direction?: 'up' | 'down'
  /** How far pieces fly before falling: 1 = full popper, smaller stays close. */
  reach?: number
}) {
  const [burst, setBurst] = useState<Piece[] | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = setTimeout(() => setBurst(pieces(count, spread, direction, reach)), delay)
    const end = setTimeout(() => setBurst(null), delay + 2200)
    return () => { clearTimeout(start); clearTimeout(end) }
  }, [count, spread, delay, direction, reach])

  if (!burst) return null
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-visible">
      {burst.map((p, i) => (
        <span key={i} className="si-confetti" style={{ left: x, top: y, ...p.style }} />
      ))}
    </span>
  )
}
