import { useId, type CSSProperties } from 'react'
import { C, Stamp, q } from './folk'

/*
 * Tie the knot. On the left hangs the end of his dupatta, saffron into rani
 * with a zari border and gold tassels; on the right the end of a rushnyk,
 * white linen with red and black cross-stitch and a fringe. A Hindu wedding
 * knots the bride's dupatta to the groom's scarf (gathbandhan); a Ukrainian
 * one binds the couple's hands with a rushnyk. Tapped, the two swing in and
 * cross, a bow pulls tight where they meet, and petals from both weddings
 * burst out of it: marigolds and roses, barvinok and kalyna.
 *
 * `tied` drives everything through CSS (tw-cloth, tw-bow, tw-burst in the
 * design's styles); `burst` is a counter that restarts the petals each tie.
 */

const PETALS = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 2 ? 0.12 : -0.08)
  const d = 70 + (i % 4) * 22
  return {
    id: ['tw-mg0', 'tw-rs', 'tw-bv', 'tw-kl', 'tw-mg1', 'tw-sf', 'tw-rr'][i % 7],
    bx: `${q(Math.cos(a) * d)}px`,
    by: `${q(Math.sin(a) * d * 0.8 + 26)}px`,
    br: `${(i % 2 ? 1 : -1) * (180 + (i % 5) * 70)}deg`,
    r: 5 + (i % 3) * 1.6,
    // After the bow has pulled tight.
    delay: `${760 + (i % 4) * 40}ms`,
  }
})

/** The two ends meet here once they have swung in by 38°, each from 90 units out. */
const KX = 200
const KY = 129

export function KnotStage({ tied, burst, className, style }: { tied: boolean; burst: number; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const butis = [40, 64, 88, 112, 136, 160].flatMap((y, r) => (r % 2 ? [104, 116] : [98, 110, 122]).map((x) => [x, y] as const))
  return (
    <svg viewBox="0 0 400 236" className={className} style={style} role="img" aria-label={tied ? 'His dupatta and her rushnyk, tied in a knot' : 'His dupatta and her rushnyk, hanging apart'}>
      <defs>
        <linearGradient id={`${id}-silk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.marigold} />
          <stop offset="0.5" stopColor={C.saffron} />
          <stop offset="1" stopColor={C.rani} />
        </linearGradient>
        <linearGradient id={`${id}-linen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EFE6D3" />
          <stop offset="0.5" stopColor="#FBF7EE" />
          <stop offset="1" stopColor="#ECE2CE" />
        </linearGradient>
      </defs>

      {/* His dupatta, hung from a marigold */}
      <g className={`tw-cloth tw-cloth-l ${tied ? 'is-tied' : ''}`}>
        <g className="tw-cloth-sway" style={{ ['--sd' as string]: '5.2s' }}>
          <path d="M86 14C83 70 94 132 87 200H135C140 132 129 70 134 14Z" fill={`url(#${id}-silk)`} />
          <path d="M92 18C89 72 100 132 93 196M128 18C124 72 135 132 129 196" stroke={C.goldLight} strokeWidth={1.6} strokeDasharray="3 2" fill="none" />
          {butis.map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y - 3}l2 3-2 3-2-3Z`} fill={C.goldLight} opacity={0.9} />)}
          <path d="M88 178H134" stroke={C.gold} strokeWidth={5} />
          <path d="M88 186H134" stroke={C.goldLight} strokeWidth={1.4} />
          {[91, 99, 107, 115, 123, 131].map((x) => (
            <g key={x}>
              <path d={`M${x} 200v7`} stroke={C.gold} strokeWidth={1.2} />
              <path d={`M${x} 206l2.4 4-2.4 4-2.4-4Z`} fill={C.gold} />
            </g>
          ))}
        </g>
        <Stamp id="tw-mg0" x={110} y={14} r={11} rot={20} />
      </g>

      {/* Her rushnyk, hung from a bunch of kalyna */}
      <g className={`tw-cloth tw-cloth-r ${tied ? 'is-tied' : ''}`}>
        <g className="tw-cloth-sway" style={{ ['--sd' as string]: '6s', ['--sdl' as string]: '-2s' }}>
          <path d="M266 14C263 70 274 132 267 200H315C320 132 309 70 314 14Z" fill={`url(#${id}-linen)`} />
          <path d={`M272 34${Array.from({ length: 9 }, (_, k) => `M${276 + k * 4.6} 31l2.6 2.6m0-2.6l-2.6 2.6`).join('')}`} stroke={C.kalyna} strokeWidth={0.9} fill="none" />
          <path d="M270 150H312M270 178H312" stroke={C.ink} strokeWidth={0.9} />
          {[279, 303].map((cx) => (
            <g key={cx}>
              <path d={`M${cx} 153L${cx + 9} 164 ${cx} 175 ${cx - 9} 164Z`} fill={C.kalyna} />
              <path d={`M${cx} 158L${cx + 4.5} 164 ${cx} 170 ${cx - 4.5} 164Z`} fill={C.ink} />
            </g>
          ))}
          <path d="M291 156l3 3m0-3l-3 3M291 169l3 3m0-3l-3 3" stroke={C.kalyna} strokeWidth={1} />
          <path d={`M270 186${Array.from({ length: 10 }, (_, k) => `l4.2 ${k % 2 ? 3 : -3}`).join('')}`} stroke={C.kalyna} strokeWidth={1} fill="none" />
          {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M${q(269 + k * 4)} 200v${7 + (k % 3)}`} stroke="#E9DFC9" strokeWidth={1} strokeLinecap="round" />)}
        </g>
        <Stamp id="tw-kl" x={290} y={16} r={13} />
      </g>

      {/* The bow where they cross */}
      <g className={`tw-bow ${tied ? 'is-tied' : ''}`}>
        <path d={`M${KX} ${KY}C${KX - 18} ${KY - 26} ${KX - 42} ${KY - 22} ${KX - 36} ${KY}C${KX - 42} ${KY + 22} ${KX - 18} ${KY + 26} ${KX} ${KY}Z`} fill={`url(#${id}-silk)`} stroke={C.gold} strokeWidth={1.4} />
        <path d={`M${KX} ${KY}C${KX + 18} ${KY - 26} ${KX + 42} ${KY - 22} ${KX + 36} ${KY}C${KX + 42} ${KY + 22} ${KX + 18} ${KY + 26} ${KX} ${KY}Z`} fill={`url(#${id}-linen)`} stroke={C.kalyna} strokeWidth={1.2} />
        <path d={`M${KX + 10} ${KY - 8}l3 3m0-3l-3 3M${KX + 20} ${KY - 4}l3 3m0-3l-3 3M${KX + 10} ${KY + 5}l3 3m0-3l-3 3`} stroke={C.kalyna} strokeWidth={0.9} />
        <path d={`M${KX - 22} ${KY - 9}l2 3-2 3-2-3ZM${KX - 14} ${KY + 4}l2 3-2 3-2-3Z`} fill={C.goldLight} />
        <rect x={KX - 7} y={KY - 10} width={14} height={20} rx={5} fill={C.gold} stroke={C.goldDeep} strokeWidth={1} />
        <Stamp id="tw-bv" x={KX} y={KY - 1} r={6} />
      </g>

      {/* Petals from both weddings, thrown out of the knot */}
      {tied && (
        <g key={burst}>
          {PETALS.map((p, i) => (
            <g key={i} className="tw-burst" style={{ ['--bx' as string]: p.bx, ['--by' as string]: p.by, ['--br' as string]: p.br, animationDelay: p.delay }}>
              <Stamp id={p.id} x={KX} y={KY} r={p.r} />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}
