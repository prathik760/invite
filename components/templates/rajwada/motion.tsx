'use client'

import { useId, type CSSProperties, type ElementType } from 'react'
import { R, rng } from './art'

/*
 * Rajwada's moving parts, all driven by CSS in SignatureRajwada: petals that
 * drift down, fireworks over the palace, diyas that flicker, the toran over
 * the gate, lamps floating on the lake, birds crossing the dusk, the burst of
 * petals when the doors open, the mandala clock and headlines that rise word
 * by word. Every "random" number comes from rng() and is rounded, so the
 * server and the browser draw exactly the same thing.
 */

const n1 = (v: number) => Math.round(v * 10) / 10

/** Rose and marigold petals drifting down through their box. */
export function Petals({ count = 14, seed = 1, className }: { count?: number; seed?: number; className?: string }) {
  const rand = rng(seed)
  return (
    <div className={`rw-petals ${className ?? ''}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const s = n1(7 + rand() * 7)
        return (
          <i
            key={i}
            className={`rw-petal rw-petal-${i % 3}`}
            style={
              {
                left: `${n1(rand() * 100)}%`,
                width: `${s}px`,
                height: `${n1(s * 1.3)}px`,
                animationDuration: `${n1(9 + rand() * 8)}s`,
                animationDelay: `-${n1(rand() * 17)}s`,
                '--dx': `${Math.round((rand() * 2 - 1) * 70)}px`,
                '--rot': `${Math.round(rand() * 900 - 450)}deg`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

/** Petals thrown out from the middle of the doors as they open. */
export function PetalBurst({ count = 30, seed = 9 }: { count?: number; seed?: number }) {
  const rand = rng(seed)
  return (
    <div className="rw-burst" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * 360 + rand() * 12
        const r = 120 + rand() * 230
        return (
          <i
            key={i}
            className={`rw-petal-${i % 3}`}
            style={
              {
                '--a': `${Math.round(a)}deg`,
                '--r': `${Math.round(r)}px`,
                '--rot': `${Math.round(rand() * 720 - 360)}deg`,
                animationDelay: `${Math.round(rand() * 160)}ms`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

export interface Burst {
  /** Where it bursts, in % of its box. */
  x: number
  y: number
  /** Colour of the sparks. */
  c: string
  /** Seconds before it first goes up. */
  d: number
  /** How far the sparks fly, in px. */
  s: number
}

/** Rockets that rise and burst into sparks, on a loop. */
export function Fireworks({ bursts, className }: { bursts: Burst[]; className?: string }) {
  return (
    <div className={`rw-fireworks ${className ?? ''}`} aria-hidden>
      {bursts.map((b, i) => (
        <span key={i} className="rw-fw" style={{ left: `${b.x}%`, top: `${b.y}%`, '--c': b.c, '--d': `${b.d}s`, '--s': `${b.s}px` } as CSSProperties}>
          <b className="rw-fw-trail" />
          {Array.from({ length: 16 }, (_, k) => (
            <i key={k} style={{ '--a': `${Math.round((k / 16) * 360)}deg` } as CSSProperties} />
          ))}
          <em className="rw-fw-core" />
        </span>
      ))}
    </div>
  )
}

/** Stars that come and go. */
export function Stars({ count = 22, seed = 5, className }: { count?: number; seed?: number; className?: string }) {
  const rand = rng(seed)
  return (
    <div className={`rw-stars ${className ?? ''}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={
            {
              left: `${n1(rand() * 100)}%`,
              top: `${n1(rand() * 46)}%`,
              '--s': `${n1(1 + rand() * 1.8)}px`,
              animationDuration: `${n1(2.4 + rand() * 3)}s`,
              animationDelay: `-${n1(rand() * 5)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** A few birds crossing the evening sky, wings beating. */
export function Birds({ className }: { className?: string }) {
  const flock: [number, number, number, number][] = [
    [0, 18, 0, 1],
    [22, 14, 0.25, 0.8],
    [-18, 26, 0.5, 0.9],
    [40, 22, 0.15, 0.7],
  ]
  return (
    <div className={`rw-birds ${className ?? ''}`} aria-hidden>
      {flock.map(([x, y, d, s], i) => (
        <svg key={i} viewBox="-12 -6 24 10" style={{ left: `${x}px`, top: `${y}px`, width: `${Math.round(22 * s)}px`, animationDelay: `-${d}s` }}>
          <path d="M-11 -2Q-5 -6 0 1Q5 -6 11 -2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ))}
    </div>
  )
}

/** A clay diya with a flickering flame, drawn at x, y (the bowl's rim), inside an <svg>. */
export function DiyaG({ x, y, s = 1, i = 0, glow }: { x: number; y: number; s?: number; i?: number; glow: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle className="rw-dglow" cx={0} cy={-12} r={26} fill={`url(#${glow})`} style={{ animationDelay: `-${n1(i * 0.37)}s` }} />
      <path d="M-15 -3C-13 7 13 7 15 -3Z" fill="#A9472A" stroke="#5E2412" strokeWidth={0.8} />
      <path d="M-15 -3C-9 -6.5 9 -6.5 15 -3C9 -1 -9 -1 -15 -3Z" fill="#D66E37" />
      <path d="M-10 2.4H10" stroke="#E8A15A" strokeWidth={0.8} strokeDasharray="1.2 1.6" />
      <g className="rw-flame" style={{ animationDelay: `-${n1(i * 0.29)}s` }}>
        <path d="M0 -26C5 -17 6 -10 0 -4C-6 -10 -5 -17 0 -26Z" fill="#F29A26" />
        <path d="M0 -19C2.4 -14 2.4 -10 0 -6.5C-2.4 -10 -2.4 -14 0 -19Z" fill="#FFF0AE" />
      </g>
    </g>
  )
}

/** The glow a diya throws, for DiyaG's `glow`. */
export function DiyaGlow({ id }: { id: string }) {
  return (
    <radialGradient id={id}>
      <stop offset="0" stopColor="#FFD77E" stopOpacity={0.75} />
      <stop offset="0.45" stopColor="#FFB84D" stopOpacity={0.25} />
      <stop offset="1" stopColor="#FFB84D" stopOpacity={0} />
    </radialGradient>
  )
}

/** A single diya as its own picture. */
export function DiyaIcon({ className, i = 0 }: { className?: string; i?: number }) {
  const id = `rw-dg-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="-28 -40 56 48" className={className} aria-hidden>
      <defs>
        <DiyaGlow id={id} />
      </defs>
      <DiyaG x={0} y={0} i={i} glow={id} />
    </svg>
  )
}

/**
 * Dressing for the gate, in the door frame's own units (520 x 800): a toran of
 * mango leaves and marigold strings across the top, swaying, and diyas lit on
 * the threshold either side of the doors.
 */
export function GateDressing({ className }: { className?: string }) {
  const id = `rw-gate-${useId().replace(/:/g, '')}`
  const items = Array.from({ length: 16 }, (_, i) => 26 + i * 31).filter((x) => x < 238 || x > 282)
  const sag = (x: number) => n1(68 + 10 * (1 - ((x - 260) / 244) ** 2))
  return (
    <svg viewBox="0 0 520 800" className={className} style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <DiyaGlow id={`${id}-g`} />
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F7A2C" />
          <stop offset="1" stopColor="#7FA343" />
        </linearGradient>
      </defs>
      <path d="M14 66Q260 90 506 66" fill="none" stroke="#8A6526" strokeWidth={1.6} />
      {items.map((x, i) => {
        const y = sag(x)
        const leaf = i % 2 === 0
        return (
          <g key={x} className="rw-sway" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `-${n1(i * 0.31)}s` }}>
            {leaf ? (
              <path d={`M${x} ${y}C${x + 9} ${n1(y + 10)} ${x + 7} ${n1(y + 26)} ${x} ${n1(y + 34)}C${x - 7} ${n1(y + 26)} ${x - 9} ${n1(y + 10)} ${x} ${y}Z`} fill={`url(#${id}-leaf)`} stroke="#3A5A1E" strokeWidth={0.7} />
            ) : (
              [0, 1, 2].map((k) => (
                <g key={k}>
                  <circle cx={x} cy={n1(y + 6 + k * 10)} r={k === 2 ? 4.2 : 5.4} fill={k === 1 ? '#EFAE27' : '#E4801C'} stroke="#8A3E0E" strokeWidth={0.6} />
                  <circle cx={x} cy={n1(y + 6 + k * 10)} r={1.6} fill="#9A4A10" opacity={0.6} />
                </g>
              ))
            )}
          </g>
        )
      })}
      {[14, 44, 476, 506].map((x, i) => (
        <DiyaG key={x} x={x} y={757} s={1.25} i={i} glow={`${id}-g`} />
      ))}
    </svg>
  )
}

/** Lamps floating on the lake, for LakeView's children (its units: 360 x 120). */
export function LakeLamps() {
  const id = `rw-ll-${useId().replace(/:/g, '')}`
  const lamps: [number, number, number][] = [
    [40, 100, 0],
    [110, 108, 1],
    [196, 112, 2],
    [262, 104, 3],
    [318, 110, 4],
  ]
  return (
    <g>
      <defs>
        <DiyaGlow id={id} />
      </defs>
      {lamps.map(([x, y, i]) => (
        <g key={i} className="rw-float" style={{ animationDelay: `-${i * 1.7}s` }}>
          <circle cx={x} cy={y - 2} r={9} fill={`url(#${id})`} />
          <path d={`M${x - 3} ${y}h6l-1 1.6h-4Z`} fill="#B5502E" />
          <path d={`M${x} ${y - 4.6}c1 1.4 1.2 2.6 0 3.8c-1.2-1.2-1-2.4 0-3.8Z`} fill="#FFD36A" />
          <path d={`M${x - 4} ${y + 3.4}h8`} stroke="#FFD36A" strokeWidth={0.6} opacity={0.5} />
        </g>
      ))}
    </g>
  )
}

/**
 * The countdown's carved mandala: a ring of sixty petals that light one by one
 * with the seconds, around a slowly turning lotus. viewBox -150..150.
 */
export function Mandala({ lit, className }: { lit: number; className?: string }) {
  return (
    <svg viewBox="-150 -150 300 300" className={className} aria-hidden>
      <g>
        {Array.from({ length: 60 }, (_, i) => (
          <path key={i} className={i < lit ? 'rw-sec-on' : 'rw-sec'} d="M0 -142C3.4 -136 3.4 -131 0 -126C-3.4 -131 -3.4 -136 0 -142Z" transform={`rotate(${i * 6})`} />
        ))}
      </g>
      <circle r={120} fill="none" stroke={R.goldLight} strokeWidth={1} opacity={0.6} />
      <g className="rw-lotus-spin">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M0 -116C10 -104 10 -92 0 -82C-10 -92 -10 -104 0 -116Z" transform={`rotate(${i * 15})`} fill="none" stroke={R.goldLight} strokeWidth={1} opacity={0.75} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -96C6 -90 6 -84 0 -78C-6 -84 -6 -90 0 -96Z" transform={`rotate(${i * 30 + 15})`} fill={R.goldLight} opacity={0.5} />
        ))}
      </g>
      <g className="rw-lotus-spin rw-rev">
        {Array.from({ length: 36 }, (_, i) => (
          <circle key={i} cx={0} cy={-74} r={1.6} transform={`rotate(${i * 10})`} fill={R.goldPale} opacity={0.7} />
        ))}
      </g>
      <circle r={68} fill={R.maroonDeep} stroke={R.goldLight} strokeWidth={1.6} />
      <circle r={62} fill="none" stroke={R.gold} strokeWidth={0.7} />
    </svg>
  )
}

/** A line whose words rise into place one after another once its block is revealed. */
export function Words({ text, as: Tag = 'span', className, style, start = 0 }: { text: string; as?: ElementType; className?: string; style?: CSSProperties; start?: number }) {
  let n = start
  return (
    <Tag className={className} style={style}>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) || !w ? (
          w
        ) : (
          <span key={i} className="rw-w">
            <span style={{ '--i': n++ } as CSSProperties}>{w}</span>
          </span>
        ),
      )}
    </Tag>
  )
}
