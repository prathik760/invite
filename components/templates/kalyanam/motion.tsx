'use client'

import type { CSSProperties, ElementType } from 'react'
import { K, rng } from './art'

/*
 * Kalyanam's moving parts, driven by CSS in SignatureKalyanam: jasmine buds
 * and marigold petals drifting down, the akshata (turmeric rice and flowers)
 * thrown when the curtain parts, parrots crossing the dawn, temple bells, the
 * kolam clock and headlines that rise word by word. Every "random" number
 * comes from rng() and is rounded, so the server and the browser draw the
 * same thing.
 */

const n1 = (v: number) => Math.round(v * 10) / 10

/** Jasmine buds, marigold and rose petals drifting down through their box. */
export function Shower({ count = 14, seed = 1, className }: { count?: number; seed?: number; className?: string }) {
  const rand = rng(seed)
  return (
    <div className={`kl-shower ${className ?? ''}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const s = n1(6 + rand() * 6)
        return (
          <i
            key={i}
            className={`kl-bit kl-bit-${i % 3}`}
            style={
              {
                left: `${n1(rand() * 100)}%`,
                width: `${s}px`,
                height: `${n1(s * (i % 3 === 0 ? 1.7 : 1.25))}px`,
                animationDuration: `${n1(9 + rand() * 8)}s`,
                animationDelay: `-${n1(rand() * 17)}s`,
                '--dx': `${Math.round((rand() * 2 - 1) * 60)}px`,
                '--rot': `${Math.round(rand() * 800 - 400)}deg`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

/**
 * Akshata: turmeric rice, jasmine and petals thrown over the couple, once.
 * They fly up and out from `top` and fall away.
 */
export function Akshata({ count = 44, seed = 7, top = '40%' }: { count?: number; seed?: number; top?: string }) {
  const rand = rng(seed)
  return (
    <div className="kl-akshata" style={{ top }} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const kind = i % 4
        return (
          <i
            key={i}
            className={`kl-ak kl-ak-${kind}`}
            style={
              {
                '--x': `${Math.round((rand() * 2 - 1) * 170)}px`,
                '--up': `${Math.round(-60 - rand() * 150)}px`,
                '--down': `${Math.round(220 + rand() * 260)}px`,
                '--rot': `${Math.round(rand() * 900 - 450)}deg`,
                animationDelay: `${Math.round(rand() * 220)}ms`,
                animationDuration: `${n1(1.8 + rand() * 0.9)}s`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

/** Green parrots crossing the morning sky, wings beating. */
export function Parrots({ className }: { className?: string }) {
  const flock: [number, number, number, number][] = [
    [0, 10, 0, 1],
    [-34, 30, 0.2, 0.85],
    [26, 40, 0.45, 0.75],
  ]
  return (
    <div className={`kl-parrots ${className ?? ''}`} aria-hidden>
      {flock.map(([x, y, d, s], i) => (
        <svg key={i} viewBox="-16 -12 34 22" style={{ left: `${x}px`, top: `${y}px`, width: `${Math.round(30 * s)}px`, animationDelay: `-${d}s` }}>
          <path d="M-14 6C-8 4-4 3 0 2" stroke="#3E7A2A" strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <ellipse cx={4} cy={1} rx={9} ry={4.4} fill="#4FA33A" />
          <circle cx={12} cy={-1.4} r={3.4} fill="#5CB342" />
          <path d="M14.6 -2.4C17.6 -2.6 18 0.6 15.4 1.2Z" fill="#D8352A" />
          <circle cx={12.6} cy={-2.2} r={0.7} fill="#1B1B12" />
          <path className="kl-wing" d="M2 0C0 -8 6 -11 10 -9C8 -6 6 -3 6 0Z" fill="#2F7D24" />
        </svg>
      ))}
    </div>
  )
}

/** A brass temple bell on a chain, hung from its top (viewBox -14 0 28 80). */
export function Bell({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-14 0 28 80" className={`kl-bell ${className ?? ''}`} style={style} aria-hidden>
      <path d="M0 0V44" stroke={K.brassDark} strokeWidth={1.4} strokeDasharray="3 2" />
      <circle cx={0} cy={46} r={2.6} fill="none" stroke={K.brassDark} strokeWidth={1.2} />
      <path d="M-3 50C-4 50-5 51-5 53H5C5 51 4 50 3 50Z" fill={K.brass} stroke={K.brassDark} strokeWidth={0.7} />
      <path d="M-5 53C-6 60-8 66-12 70H12C8 66 6 60 5 53Z" fill={K.brassLight} stroke={K.brassDark} strokeWidth={0.8} />
      <path d="M-12 70H12V72.4H-12Z" fill={K.brass} stroke={K.brassDark} strokeWidth={0.6} />
      <path d="M-3 56C-3.6 61-5 65-7 68" stroke="#FFF1C2" strokeWidth={1} fill="none" opacity={0.8} />
      <g className="kl-clapper">
        <path d="M0 70V75" stroke={K.brassDark} strokeWidth={1} />
        <circle cx={0} cy={76.4} r={2} fill={K.brassDark} />
      </g>
    </svg>
  )
}

/**
 * The countdown's kolam clock: sixty rice-flour dots in a ring that light one
 * by one with the seconds, round a turning ring of loops (viewBox -150..150).
 */
export function KolamClock({ lit, className }: { lit: number; className?: string }) {
  return (
    <svg viewBox="-150 -150 300 300" className={className} aria-hidden>
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} className={i < lit ? 'kl-dot-on' : 'kl-dot'} cx={0} cy={-136} r={i % 5 === 0 ? 4.2 : 2.8} transform={`rotate(${i * 6})`} />
      ))}
      <g className="kl-loops">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0 -118C14 -118 20 -104 12 -96C6 -90 -6 -90 -12 -96C-20 -104 -14 -118 0 -118Z" transform={`rotate(${i * 22.5})`} fill="none" stroke="#FFF6E2" strokeWidth={1.6} opacity={0.75} />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={0} cy={-104} r={2.2} transform={`rotate(${i * 22.5 + 11.25})`} fill="#FFF6E2" />
        ))}
      </g>
      <g className="kl-loops kl-rev">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 -88C10 -78 10 -70 0 -62C-10 -70 -10 -78 0 -88Z" transform={`rotate(${i * 45})`} fill={K.turmericLight} opacity={0.55} />
        ))}
      </g>
      <circle r={66} fill={K.redDeep} stroke={K.turmericLight} strokeWidth={1.6} />
      <circle r={60} fill="none" stroke="#FFF6E2" strokeWidth={0.8} strokeDasharray="1 5" strokeLinecap="round" />
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
          <span key={i} className="kl-w">
            <span style={{ '--i': n++ } as CSSProperties}>{w}</span>
          </span>
        ),
      )}
    </Tag>
  )
}
