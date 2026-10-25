import { useEffect, useId, useState, type CSSProperties, type RefObject } from 'react'
import { C, q } from './folk'

/*
 * The international opening for Two Worlds, for guests of any faith or none.
 *
 * Dusk over the curve of the Earth. His city and hers light up on the horizon,
 * far apart; from each a line of gold rises, and the two meet overhead in a
 * pointed arch (the shape both their worlds build doorways in), where a pair of
 * rings draws itself. Their names stand inside the arch.
 *
 * The sky and the Earth are plain CSS, so they arrive with the page. The arch
 * is drawn to the screen's own size once it is measured, so it fits a phone
 * held either way, a tablet or a wide monitor without stretching.
 */

/** Where the parts sit, as fractions of the screen's height. The page's text is placed from the same numbers. */
export const RINGS_AT = 0.16
export const HORIZON_AT = 0.76
/** The Earth is a circle this many times the screen's width across. */
const EARTH = 2.6

/** How far each city stands from the centre: the CSS twin is `min(40cqw, 78cqh)`. */
const spreadOf = (w: number, h: number) => Math.min(w * 0.4, h * 0.78)

/** When the parts arrive, in ms. */
export const HORIZON_TIMES = { cities: 500, arch: 1000, archFor: 2000, rings: 2700, words: 3300 }

/** The size of an element, once it has one; follows rotation and resizing. */
export function useBoxSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setSize((s) => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      return s && s.w === w && s.h === h ? s : { w, h }
    })
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/** The sky at dusk, its stars, a falling star, and the curve of the Earth with the sunrise on its rim. */
export function HorizonSky() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 72% 26% at 50% ${HORIZON_AT * 100}%, rgba(255,214,160,0.95) 0%, rgba(255,150,130,0.6) 30%, rgba(214,84,132,0.28) 58%, rgba(214,84,132,0) 100%)`,
            'radial-gradient(ellipse 60% 40% at 82% 18%, rgba(76,110,255,0.22), rgba(76,110,255,0) 70%)',
            'radial-gradient(ellipse 50% 36% at 12% 30%, rgba(194,24,91,0.2), rgba(194,24,91,0) 70%)',
            'linear-gradient(180deg, #050920 0%, #0C1338 24%, #1E1A52 44%, #47205F 60%, #8A2E6A 70%, #D9636D 77%, #F6A272 82%)',
          ].join(', '),
        }}
      />
      <HorizonStars />
      <span className="tw-shoot absolute left-[8%] top-[14%] block h-[1.5px] w-[min(26cqw,180px)] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,248,230,0.95))' }} />
      {/* The Earth: its rim catches the light; a few cities are already lit on its dark side. */}
      <div
        className="absolute left-1/2 aspect-square -translate-x-1/2 rounded-full"
        style={{
          top: `${HORIZON_AT * 100}%`,
          width: `${EARTH * 100}%`,
          background: 'radial-gradient(ellipse 50% 7% at 50% 0%, #3A2246 0%, #1A1030 45%, rgba(10,7,22,0) 100%), linear-gradient(180deg, #160E2A 0%, #0A0716 5%, #06040E 100%)',
          boxShadow: '0 -1px 0 1px rgba(255,234,196,0.95), 0 -8px 26px rgba(255,190,140,0.6), 0 -34px 90px rgba(255,120,140,0.38)',
        }}
      />
      <EarthLights />
    </div>
  )
}

/** Stars as dots of CSS, sized in pixels so they stay round on any screen. */
function HorizonStars() {
  const stars = Array.from({ length: 64 }, (_, i) => {
    const r = (n: number) => {
      const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453
      return s - Math.floor(s)
    }
    return { x: q(r(i * 3 + 1) * 100), y: q(r(i * 7 + 2) * HORIZON_AT * 92), s: q(1 + r(i * 11 + 3) * 1.8), o: q(0.4 + r(i * 13 + 5) * 0.6), d: q((i % 9) * 0.5) }
  })
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? 'tw-twinkle' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, background: '#FFF6DA', animationDelay: `${s.d}s` }}
        />
      ))}
    </>
  )
}

/** Night lights scattered on the Earth below the horizon. */
function EarthLights() {
  const lights = [[14, 88], [22, 93], [31, 86], [43, 95], [57, 90], [66, 96], [74, 87], [83, 92], [90, 97], [38, 99], [52, 84], [8, 97]]
  return (
    <>
      {lights.map(([x, y], i) => (
        <span key={i} className="tw-twinkle absolute h-[2px] w-[2px] rounded-full" style={{ left: `${x}%`, top: `${y}%`, background: i % 2 ? '#FFD58A' : '#BFD8FF', boxShadow: `0 0 6px ${i % 2 ? 'rgba(255,200,110,0.9)' : 'rgba(150,190,255,0.9)'}`, animationDelay: `${(i % 5) * 0.7}s` }} />
      ))}
    </>
  )
}

type City = { city: string; country: string }
/** "Mumbai, India" -> { city: 'Mumbai', country: 'India' } */
export function splitPlace(place: string): City | null {
  const p = place.trim()
  if (!p) return null
  const i = p.indexOf(',')
  return i < 0 ? { city: p, country: '' } : { city: p.slice(0, i).trim(), country: p.slice(i + 1).trim() }
}

/** His light: marigold. Hers: the blue of a summer sky over the steppe. */
const HIS = { core: '#FFD27A', glow: '#F7A817', line: '#F7A817' }
const HERS = { core: '#CFE2FF', glow: '#4F82D6', line: '#7FA8F0' }

/**
 * The two cities on the horizon and the arch of gold their lines make.
 * Drawn in the screen's own pixels (`w` by `h`), so nothing stretches.
 */
export function HorizonArch({ w, h, his, hers, draw }: { w: number; h: number; his: City | null; hers: City | null; draw: boolean }) {
  const id = useId().replace(/:/g, '')
  const top = RINGS_AT * h
  const horizon = HORIZON_AT * h
  const R = (EARTH * w) / 2
  const spread = spreadOf(w, h)
  // The cities sit on the curve of the Earth, a little below its highest point.
  const foot = q(horizon + R - Math.sqrt(R * R - spread * spread))
  const x1 = q(w / 2 - spread)
  const x2 = q(w / 2 + spread)
  const xt = q(w / 2)
  const H = foot - top
  // A lancet: straight up from the city for the lower part, then curving in to a point, so the
  // arch stays wide where their names stand.
  const arc = (x: number, side: 1 | -1, s = spread, t = top) =>
    `M${x} ${foot}L${x} ${q(t + H * 0.38)}C${x} ${q(t + H * 0.1)} ${q(xt - side * s * 0.34)} ${q(t + H * 0.1)} ${xt} ${q(t)}`
  const paths = [
    { d: arc(x1, 1), tone: HIS, from: x1 },
    { d: arc(x2, -1), tone: HERS, from: x2 },
  ]
  // A dotted echo just outside the arch, like the line of a second hand.
  const echo = [arc(q(x1 - 9), 1, spread + 9, top - 14), arc(q(x2 + 9), -1, spread + 9, top - 14)]
  const t = HORIZON_TIMES
  const at = (ms: number, dur?: number) => (draw ? { ['--d' as string]: `${ms}ms`, ...(dur ? { ['--dur' as string]: `${dur}ms` } : {}) } : undefined)

  return (
    <>
      <svg aria-hidden width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute left-0 top-0" overflow="visible">
        <defs>
          {paths.map((p, i) => (
            <linearGradient key={i} id={`${id}l${i}`} gradientUnits="userSpaceOnUse" x1={p.from} y1={foot} x2={xt} y2={top}>
              <stop offset="0" stopColor={p.tone.line} />
              <stop offset="0.55" stopColor="#F4D88E" />
              <stop offset="1" stopColor="#FFF4D6" />
            </linearGradient>
          ))}
          <radialGradient id={`${id}h`}>
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {echo.map((d, i) => (
          <path key={`e${i}`} d={d} className={draw ? 'tw-i' : undefined} style={at(t.arch + t.archFor - 300)} fill="none" stroke="rgba(244,216,142,0.5)" strokeWidth={1.2} strokeDasharray="1.5 7" strokeLinecap="round" />
        ))}
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} pathLength={1} className={draw ? 'tw-ink tw-arch' : undefined} style={at(t.arch, t.archFor)} fill="none" stroke={`url(#${id}l${i})`} strokeWidth={1.8} strokeLinecap="round" />
            {/* The bright head of the line as it travels, a wide soft stroke under a fine one. */}
            {draw && (
              <>
                <path d={p.d} pathLength={1} className="tw-comet" style={at(t.arch, t.archFor)} fill="none" stroke={p.tone.core} strokeOpacity={0.35} strokeWidth={9} strokeLinecap="round" />
                <path d={p.d} pathLength={1} className="tw-comet" style={at(t.arch, t.archFor)} fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" />
              </>
            )}
          </g>
        ))}
        {[{ x: x1, tone: HIS }, { x: x2, tone: HERS }].map((c, i) => (
          <g key={`c${i}`} className={draw ? 'tw-dot' : undefined} style={at(t.cities + i * 220)}>
            <circle className="tw-halo" cx={c.x} cy={foot} r={12} fill={c.tone.glow} opacity={0.4} />
            <circle cx={c.x} cy={foot} r={9} fill={`url(#${id}h)`} />
            <circle cx={c.x} cy={foot} r={3.4} fill={c.tone.core} />
          </g>
        ))}
      </svg>
      {[{ c: his, x: x1, side: 'left' as const, tone: HIS }, { c: hers, x: x2, side: 'right' as const, tone: HERS }].map(({ c, x, side, tone }, i) =>
        c ? (
          <div
            key={side}
            className={`pointer-events-none absolute ${draw ? 'tw-i' : ''}`}
            // `translate`, not `transform`: the fade-in animates transform.
            style={{ left: x, top: foot + 14, translate: side === 'left' ? '-14px 0' : 'calc(-100% + 14px) 0', textAlign: side, ...at(t.cities + 250 + i * 220) }}
          >
            <p className="whitespace-nowrap uppercase" style={{ fontSize: 'clamp(10.5px, 2.9cqw, 13px)', letterSpacing: '0.24em', color: '#FFF4DE', lineHeight: 1.2 }}>{c.city}</p>
            {c.country && <p className="mt-0.5 whitespace-nowrap italic" style={{ fontSize: 'clamp(11.5px, 3.1cqw, 14px)', color: tone.core, lineHeight: 1.2, opacity: 0.9 }}>{c.country}</p>}
          </div>
        ) : null,
      )}
    </>
  )
}

/**
 * Two wedding rings, linked: the left over the right at the top, the right over
 * the left at the bottom, a small stone set on the right one. With `draw` they
 * trace themselves from `start` (ms) and the stone catches the light.
 */
export function Rings({ draw = false, start = 0, className, style }: { draw?: boolean; start?: number; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, '')
  const ink = (at: number, dur: number) => (draw ? { className: 'tw-ink', style: { ['--d' as string]: `${start + at}ms`, ['--dur' as string]: `${dur}ms` } as CSSProperties } : {})
  const gold = `url(#${id}g)`
  return (
    <svg aria-hidden viewBox="0 0 120 76" className={className} style={style} overflow="visible">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF6D6" />
          <stop offset="0.3" stopColor="#F1CF7A" />
          <stop offset="0.6" stopColor="#B5832A" />
          <stop offset="0.82" stopColor="#E9C46C" />
          <stop offset="1" stopColor="#FFF1C4" />
        </linearGradient>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#DCEBFF" />
          <stop offset="1" stopColor="#9CC1EE" />
        </linearGradient>
        <radialGradient id={`${id}s`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Right ring first, the left over it, then the right's lower arc back over the left: linked. */}
      <circle cx={73} cy={44} r={24} pathLength={1} transform="rotate(-90 73 44)" fill="none" stroke={gold} strokeWidth={4.4} {...ink(250, 900)} />
      <circle cx={47} cy={44} r={24} pathLength={1} transform="rotate(-90 47 44)" fill="none" stroke={gold} strokeWidth={4.4} {...ink(0, 900)} />
      <g className={draw ? 'tw-ink-fade' : undefined} style={draw ? ({ ['--d' as string]: `${start + 1100}ms` } as CSSProperties) : undefined}>
        <path d="M66.79 67.18A24 24 0 0 1 54.62 59.43" fill="none" stroke="rgba(14,10,30,0.55)" strokeWidth={7.2} />
        <path d="M66.79 67.18A24 24 0 0 1 54.62 59.43" fill="none" stroke={gold} strokeWidth={4.4} />
      </g>
      <g className={draw ? 'tw-dot' : undefined} style={draw ? ({ ['--d' as string]: `${start + 1200}ms` } as CSSProperties) : undefined}>
        <path d="M67.6 13.6L70.2 9.4H75.8L78.4 13.6L73 20.4Z" fill={`url(#${id}d)`} stroke="#F4D88E" strokeWidth={0.7} strokeLinejoin="round" />
        <path d="M67.6 13.6H78.4M70.2 9.4L71.6 13.6 73 20.4 74.4 13.6 75.8 9.4" fill="none" stroke="rgba(120,160,220,0.6)" strokeWidth={0.5} />
        <g className="tw-twinkle" style={{ animationDuration: '2.6s' }}>
          <circle cx={78} cy={8} r={5} fill={`url(#${id}s)`} />
          <path d="M78 2.5L78.8 7.2 83.5 8 78.8 8.8 78 13.5 77.2 8.8 72.5 8 77.2 7.2Z" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  )
}

/** A small rule with a diamond, between lines of the invitation. */
export function DiamondRule({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span aria-hidden className={`flex items-center justify-center gap-2.5 ${className ?? ''}`} style={style}>
      <span className="h-px w-10" style={{ background: 'linear-gradient(90deg, rgba(244,216,142,0), rgba(244,216,142,0.85))' }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ background: C.goldLight }} />
      <span className="h-px w-10" style={{ background: 'linear-gradient(90deg, rgba(244,216,142,0.85), rgba(244,216,142,0))' }} />
    </span>
  )
}
