'use client'

import { useEffect, useState, type CSSProperties, type ElementType } from 'react'

/*
 * The Royal Edit's printed parts: the cover barcode and seal, the split-flap
 * countdown digits, rolling page numbers, headlines that rise word by word,
 * gold dust, the celebration icons and the colours read out of a dress code.
 * Anything "random" comes from seq(), which gives the server and the browser
 * the same numbers, so hydration never mismatches.
 */

/** A seeded sequence in [0, 1): identical on every engine (integer maths only). */
export function seq(seed: string, n: number): number[] {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    out.push(h / 4294967296)
  }
  return out
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** 4 -> "Four"; past twelve, the digits. */
export function numberWord(n: number): string {
  const w = WORDS[n]
  return w ? w[0].toUpperCase() + w.slice(1) : String(n)
}

/** A newsstand barcode: guard bars, the seeded pattern, the digits under it. */
export function Barcode({ seed, digits, className, style }: { seed: string; digits: string; className?: string; style?: CSSProperties }) {
  const r = seq(seed, 80)
  const bars: { x: number; w: number; tall?: boolean }[] = []
  let x = 0
  const guard = () => {
    bars.push({ x, w: 1, tall: true }, { x: x + 2, w: 1, tall: true })
    x += 4
  }
  guard()
  for (let i = 0; i < 36; i++) {
    if (i === 18) guard()
    const w = 1 + Math.floor(r[i] * 3)
    bars.push({ x, w })
    x += w + 1 + Math.floor(r[i + 40] * 2)
  }
  guard()
  return (
    <div className={`re-barcode ${className ?? ''}`} style={style} aria-hidden>
      <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none">
        {bars.map((b, i) => (
          <rect key={i} className="re-bar" x={b.x} y={0} width={b.w} height={b.tall ? 40 : 34} style={{ '--i': i } as CSSProperties} />
        ))}
      </svg>
      <span>{digits}</span>
    </div>
  )
}

/** The round "save the date" seal: words on a ring that turns, the date inside. */
export function Seal({ uid, ring, top, bottom }: { uid: string; ring: string; top: string; bottom: string }) {
  return (
    <svg viewBox="0 0 120 120" className="re-seal" aria-hidden>
      <defs>
        <path id={`re-ring-${uid}`} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <circle cx="60" cy="60" r="59" className="re-seal-disc" />
      <circle cx="60" cy="60" r="55" className="re-seal-rule" />
      <g className="re-seal-spin">
        <text className="re-seal-ring">
          <textPath href={`#re-ring-${uid}`} textLength="286" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="35" className="re-seal-rule" />
      <text x="60" y="60" textAnchor="middle" className="re-seal-top">
        {top}
      </text>
      <text x="60" y="78" textAnchor="middle" className="re-seal-bot">
        {bottom}
      </text>
    </svg>
  )
}

/**
 * One split-flap character. On a change the old top half falls away and the
 * new bottom half drops into place, like a station departures board.
 */
export function Flap({ value }: { value: string }) {
  const [now, setNow] = useState(value)
  const [was, setWas] = useState(value)
  const [turns, setTurns] = useState(0)
  useEffect(() => {
    if (value === now) return
    setWas(now)
    setNow(value)
    setTurns((t) => t + 1)
  }, [value, now])
  return (
    <span className="re-flap">
      <span className="re-flap-top">
        <i>{now}</i>
      </span>
      <span className="re-flap-bot">
        <i>{was}</i>
      </span>
      {turns > 0 && (
        <span key={`t${turns}`} className="re-flap-top re-flap-fall">
          <i>{was}</i>
        </span>
      )}
      {turns > 0 && (
        <span key={`b${turns}`} className="re-flap-bot re-flap-drop">
          <i>{now}</i>
        </span>
      )}
    </span>
  )
}

/** Digits that roll up from zero when their block is revealed. */
export function Odo({ value, className, style }: { value: string; className?: string; style?: CSSProperties }) {
  return (
    <span className={`re-odo ${className ?? ''}`} style={style}>
      <span className="sr-only">{value}</span>
      {Array.from(value).map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} className="re-odo-col" aria-hidden>
            <span className="re-odo-reel" style={{ '--d': c, '--i': i } as CSSProperties}>
              {'0123456789'.split('').map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden>
            {c}
          </span>
        ),
      )}
    </span>
  )
}

/** A headline whose words rise into place one after another. */
export function Words({ text, as: Tag = 'span', className, style, start = 0 }: { text: string; as?: ElementType; className?: string; style?: CSSProperties; start?: number }) {
  let n = start
  return (
    <Tag className={className} style={style}>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) || !w ? (
          w
        ) : (
          <span key={i} className="re-w">
            <span style={{ '--i': n++ } as CSSProperties}>{w}</span>
          </span>
        ),
      )}
    </Tag>
  )
}

/** Gold dust drifting up through the light. */
export function Dust({ count = 18, seed = 'dust', className }: { count?: number; seed?: string; className?: string }) {
  const r = seq(seed, count * 4)
  return (
    <div className={`re-dust ${className ?? ''}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={
            {
              left: `${(r[i * 4] * 100).toFixed(1)}%`,
              top: `${(10 + r[i * 4 + 1] * 85).toFixed(1)}%`,
              '--s': `${(1.4 + r[i * 4 + 2] * 2.6).toFixed(1)}px`,
              animationDuration: `${(7 + r[i * 4 + 2] * 7).toFixed(1)}s`,
              animationDelay: `-${(r[i * 4 + 3] * 12).toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

type IconKind = 'mehendi' | 'haldi' | 'sangeet' | 'reception' | 'ring' | 'agni' | 'star'

function iconKind(name: string): IconKind {
  const n = name.toLowerCase()
  if (/mehe?n?di|mehndi|henna/.test(n)) return 'mehendi'
  if (/haldi|pithi|ubtan|mayun/.test(n)) return 'haldi'
  if (/sangeet|music|dance|garba|dandiya/.test(n)) return 'sangeet'
  if (/engage|ring|roka|sagai|mangni|tilak/.test(n)) return 'ring'
  if (/reception|dinner|party|cocktail|brunch|after/.test(n)) return 'reception'
  if (/wedding|phera|ceremony|muhurt|vivah|shaadi|nikah|kalyanam|lagna|anand karaj/.test(n)) return 'agni'
  return 'star'
}

const ICONS: Record<IconKind, string[]> = {
  // A paisley, the mehendi artist's first mark.
  mehendi: ['M33 7c-3 5-1 8 3 10 4 3 5 7 5 11 0 9-8 14-16 14S9 37 9 29C9 17 19 9 33 7z', 'M25 21c-4 0-7 3-7 7s3 7 7 7 6-3 6-6', 'M25 28h.01M19 40h.01M36 21h.01'],
  // A marigold in full sun.
  haldi: ['M24 31a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M24 5v7M24 36v7M5 24h7M36 24h7M10.6 10.6l5 5M32.4 32.4l5 5M10.6 37.4l5-5M32.4 15.6l5-5'],
  sangeet: ['M18 35V12l18-4v22', 'M18 18l18-4', 'M18 35a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM36 31a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z'],
  // Two glasses meeting.
  reception: ['M9 14h12c0 6-2.6 9-6 9s-6-3-6-9zM15 23v13M10.5 36h9', 'M27 14h12c0 6-2.6 9-6 9s-6-3-6-9zM33 23v13M28.5 36h9', 'M24 5v5M19.5 7.5l2 2.5M28.5 7.5l-2 2.5'],
  ring: ['M24 42a11 11 0 1 0 0-22 11 11 0 0 0 0 22z', 'M18.5 14.5L24 8l5.5 6.5L24 20z', 'M18.5 14.5h11'],
  // The sacred fire, on its diya.
  agni: ['M24 7c4 6 9 9 9 16a9 9 0 0 1-18 0c0-5 3-7 5-10 1 3 2 4.5 4 5.5 1-4 0-7 0-11.5z', 'M24 32c-2 0-3.5-1.6-3.5-3.6 0-2.4 2-3.4 3.5-5.4 1.5 2 3.5 3 3.5 5.4 0 2-1.5 3.6-3.5 3.6z', 'M10 37h28M14 41h20'],
  star: ['M24 6l3.6 14.4L42 24l-14.4 3.6L24 42l-3.6-14.4L6 24l14.4-3.6z'],
}

/** A line icon for a celebration, guessed from its name; it draws itself in. */
export function EventIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`re-ico ${className ?? ''}`} aria-hidden>
      {ICONS[iconKind(name)].map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ '--i': i } as CSSProperties} />
      ))}
    </svg>
  )
}

const COLOURS: [RegExp, string[]][] = [
  [/\bjewel[- ]?tones?\b/, ['#9B1B30', '#1F6B52', '#1F3F8F']],
  [/\bpastels?\b/, ['#F3C5CF', '#CDE6D5', '#F6E2AE']],
  [/\bbrights?\b/, ['#E8432E', '#F2C230', '#2E9C6A']],
  [/\b(reds?|ruby)\b/, ['#B3122E']],
  [/\b(maroon|wine|burgundy)s?\b/, ['#6E1426']],
  [/\bpinks?\b/, ['#E58CA8']],
  [/\bblush(es)?\b/, ['#F1C4BF']],
  [/\broses?\b/, ['#D9849B']],
  [/\bpeach(es)?\b/, ['#F5B993']],
  [/\b(oranges?|saffron)\b/, ['#E8862E']],
  [/\byellows?\b/, ['#F2C230']],
  [/\bmustard\b/, ['#D2A021']],
  [/\bgold(en)?\b/, ['#C9A55C']],
  [/\bgreens?\b/, ['#3E7B4E']],
  [/\bemeralds?\b/, ['#1F6B52']],
  [/\b(mint|sage)\b/, ['#A9CDB4']],
  [/\bteal\b/, ['#1E6E70']],
  [/\bblues?\b/, ['#2F5AA8']],
  [/\b(navy|sapphire)\b/, ['#1D2B5E']],
  [/\b(purples?|violet)\b/, ['#6B3F8F']],
  [/\b(lavender|lilac)\b/, ['#BBA6DA']],
  [/\b(whites?|ivory)\b/, ['#F7F2E6']],
  [/\b(cream|beige|champagne)\b/, ['#E6D5B5']],
  [/\bsilver\b/, ['#C4C4CC']],
  [/\b(black|black tie)\b/, ['#141414']],
]

/** The colours a dress code names, in the order it names them (at most four). */
export function dressColours(text?: string): string[] {
  const t = (text || '').toLowerCase()
  const found: { at: number; c: string[] }[] = []
  for (const [re, c] of COLOURS) {
    const m = re.exec(t)
    if (m) found.push({ at: m.index, c })
  }
  return Array.from(new Set(found.sort((a, b) => a.at - b.at).flatMap((f) => f.c))).slice(0, 4)
}
