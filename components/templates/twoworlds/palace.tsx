import { useId, type CSSProperties } from 'react'
import { C, Candle, Stamp, q } from './folk'

/*
 * The hero when a couple have no photo of their own: a palace doorway at dusk,
 * drawn and moving. Strands of roses and marigolds hang either side of a
 * cusped arch, a chandelier sways in its glow, candles flicker along a path of
 * petals, fairy lights and stars twinkle, and a bride and groom, seen from
 * behind, stand hand in hand at the threshold. No faces, so it is anyone's
 * wedding.
 *
 * Both weddings are in it. She wears a lehenga and dupatta with a Ukrainian
 * vinok over them, periwinkle and kalyna with its ribbons streaming down her
 * back; he wears the marigold varmala she put round his neck. Their hands are
 * bound with a rushnyk, as a Ukrainian priest binds them, and they stand on a
 * rushnyk, the way a Ukrainian couple step onto one together.
 *
 * Drawn 1800 units wide and 1000 tall around a 1000-unit centre, and cropped
 * to the screen (xMidYMax slice): a phone sees the middle of the centre, full
 * height; a laptop sees the full height and the arcades running off either
 * side, so the couple always stand clear of the names above them. Seeded numbers go through q() so the server and the browser agree.
 */

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const STARS = Array.from({ length: 90 }, (_, i) => ({ x: q(rnd(i + 1) * 1800 - 400), y: q(rnd(i + 71) * 300), r: q(0.9 + rnd(i + 151) * 1.7), twinkle: i % 9 === 0, delay: (i % 7) * 0.5 }))

/** The ogee arch of the doorway, from the ARCH_MASK outline, fitted to a box. */
function arch(x0: number, x1: number, top: number, bottom: number) {
  const pts: [number, number][] = [[0, 130], [0, 50], [0, 30], [16, 20], [32, 12], [42, 4], [46, 0], [50, 0], [54, 0], [58, 4], [68, 12], [84, 20], [100, 30], [100, 50], [100, 130]]
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o] = pts.map(([x, y]) => `${q(x0 + (x / 100) * (x1 - x0))} ${q(top + (y / 130) * (bottom - top))}`)
  return `M${a}V${b.split(' ')[1]}Q${c} ${d}Q${e} ${f}Q${g} ${h}Q${i} ${j}Q${k} ${l}Q${m} ${n}V${o.split(' ')[1]}Z`
}

/** A strand of roses (pink, white and red) ending in marigolds, as on the pillars of a mandap. */
function Strand({ x, top, bottom, seed }: { x: number; top: number; bottom: number; seed: number }) {
  const n = Math.floor((bottom - top) / 12.5)
  return (
    // Held still: a swaying strand inside the scene made the whole scene redraw every frame.
    <g>
      <path d={`M${x} ${top}V${bottom}`} stroke="#E8D3A2" strokeWidth={1} />
      {Array.from({ length: n }, (_, i) => {
        const y = top + 7 + i * 12.5
        const low = (y - top) / (bottom - top) > 0.8
        const id = low ? (i % 2 ? 'tw-mg0' : 'tw-mg1') : ['tw-rs', 'tw-rw', 'tw-rr', 'tw-rs', 'tw-rw', 'tw-rr', 'tw-rs'][(i + seed * 2) % 7]
        const dx = (rnd(seed * 97 + i) - 0.5) * 5
        return (
          <g key={i}>
            {i % 6 === 3 && <Stamp id={i % 12 === 3 ? 'tw-lf0' : 'tw-lf1'} x={x + (i % 12 === 3 ? 9 : -9)} y={y - 2} r={9} rot={i % 12 === 3 ? 70 : -70} />}
            <Stamp id={id} x={x + dx} y={y} r={low ? 9 : 8.4} rot={i * 47 + seed * 13} />
          </g>
        )
      })}
    </g>
  )
}

/** Fairy lights on a sagging wire between two points. */
function Lights({ from, to, sag, n, k }: { from: [number, number]; to: [number, number]; sag: number; n: number; k: number }) {
  const [x0, y0] = from
  const [x1, y1] = to
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2 + sag
  return (
    <g>
      <path d={`M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`} stroke="rgba(60,30,20,0.55)" strokeWidth={1} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = q((1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1)
        const y = q((1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1)
        return (
          <g key={i} className={(i + k) % 5 === 0 ? 'tw-twinkle' : undefined} style={{ animationDelay: `${((i + k) % 5) * 0.6}s` }}>
            <circle cx={x} cy={y + 2} r={7} fill="rgba(255,214,120,0.22)" />
            <circle cx={x} cy={y + 2} r={2.6} fill="#FFF1C2" />
          </g>
        )
      })}
    </g>
  )
}

/** A lit arch in a wall: dark edge, warm light inside. */
function Niche({ x0, x1, top, bottom, glow }: { x0: number; x1: number; top: number; bottom: number; glow: string }) {
  return (
    <g>
      <path d={arch(x0 - 5, x1 + 5, top - 6, bottom)} fill="#D9BE8C" />
      <path d={arch(x0, x1, top, bottom)} fill={glow} />
    </g>
  )
}

/**
 * The couple, from behind, in their own coordinates: the ground at y 0, the
 * groom to the right of x 0 and the bride to the left, hands joined between.
 */
function Couple({ id }: { id: string }) {
  const skin = '#B97D58'
  const skinShade = '#9C6444'
  const gold = '#E9C46A'
  // Butis on the lehenga: a seeded scatter inside the flare of the skirt.
  const butis = Array.from({ length: 34 }, (_, i) => {
    const t = rnd(i + 301)
    const y = -140 + t * 120
    const half = 22 + (t * 120) * 0.42
    const x = -44 + (rnd(i + 401) - 0.5) * 2 * half * 0.86
    return [q(x), q(y)] as const
  })
  return (
    <g>
      <ellipse cx={-14} cy={2} rx={128} ry={11} fill="rgba(70,24,10,0.35)" />

      {/* The rushnyk they stand on: linen, a red running border, a rozha at each end and a fringe */}
      <path d="M-158 -7H138L156 15H-176Z" fill="#F8F2E4" />
      <path d="M-157 -3.6H137M-171 11.4H151" stroke={C.kalyna} strokeWidth={1.3} strokeDasharray="3 2" />
      {[-152, 132].map((x) => (
        <g key={x}>
          <path d={`M${x} -1L${x + 5} 4 ${x} 9 ${x - 5} 4Z`} fill={C.kalyna} />
          <path d={`M${x} 1.6L${x + 2.4} 4 ${x} 6.4 ${x - 2.4} 4Z`} fill={C.ink} />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${q(-159 - i * 2.2)} ${q(-5 + i * 2.6)}h-6`} stroke="#EFE5CF" strokeWidth={0.9} strokeLinecap="round" />)}
      {Array.from({ length: 8 }, (_, i) => <path key={`r${i}`} d={`M${q(139 + i * 2.2)} ${q(-5 + i * 2.6)}h6`} stroke="#EFE5CF" strokeWidth={0.9} strokeLinecap="round" />)}

      {/* The groom: churidar, mojaris, a long brocade sherwani */}
      <path d="M26 -96L25 -14H44L45 -96Z M49 -96L51 -14H69L67 -96Z" fill="#F3E9D9" />
      <path d="M22 -14H46Q49 -4 41 0H21Q17 -6 22 -14Z M49 -14H72Q76 -6 70 0H50Q45 -4 49 -14Z" fill="#B8862B" />
      <path d="M30 -262Q10 -258 -2 -246Q-9 -240 -9 -226L-6 -152L-12 -88Q43 -80 98 -88L92 -152L95 -226Q95 -240 88 -246Q76 -258 56 -262Z" fill={`url(#${id}-coat)`} />
      <path d="M30 -262Q10 -258 -2 -246Q-9 -240 -9 -226L-6 -152L-12 -88Q43 -80 98 -88L92 -152L95 -226Q95 -240 88 -246Q76 -258 56 -262Z" fill={`url(#${id}-brocade)`} opacity={0.55} />
      <path d="M-11 -94Q43 -86 97 -94" stroke={gold} strokeWidth={5} fill="none" />
      <path d="M43 -256V-88" stroke="rgba(60,4,14,0.45)" strokeWidth={1.4} />
      <path d="M86 -244Q101 -236 103 -220L107 -146Q105 -137 96 -138L88 -146Q86 -200 86 -244Z" fill="#951326" />
      <path d="M90 -150L106 -150 107 -142 92 -141Z" fill={gold} />
      <ellipse cx={100} cy={-128} rx={7} ry={10} fill={skin} />
      <path d="M0 -244Q-15 -236 -17 -220L-25 -162Q-24 -152 -14 -153L-8 -164Q-4 -200 0 -244Z" fill="#951326" />
      <path d="M-25 -166L-11 -164 -12 -156 -26 -158Z" fill={gold} />
      <g transform="rotate(-6 43 -262)">
        <rect x={35} y={-276} width={16} height={18} fill={skinShade} />
        <path d="M30 -264H56V-256H30Z" fill={gold} />
        <ellipse cx={25} cy={-290} rx={3.6} ry={6.5} fill={skin} />
        <ellipse cx={61} cy={-290} rx={3.6} ry={6.5} fill={skin} />
        <path d="M27 -284C24 -300 28 -314 43 -316C58 -314 63 -300 59 -284C58 -277 52 -272 43 -272C34 -272 28 -277 27 -284Z" fill="#21150F" />
        <path d="M30 -302Q38 -312 52 -310M33 -292Q42 -300 56 -296" stroke="rgba(255,226,180,0.22)" strokeWidth={1.6} fill="none" />
      </g>
      {/* The varmala she put round his neck, seen across his shoulders */}
      {Array.from({ length: 11 }, (_, i) => {
        const t = i / 10
        const x = (1 - t) * (1 - t) * -1 + 2 * (1 - t) * t * 43 + t * t * 87
        const y = (1 - t) * (1 - t) * -240 + 2 * (1 - t) * t * -268 + t * t * -240
        return <Stamp key={i} id={i % 3 === 1 ? 'tw-mg1' : i === 5 ? 'tw-rr' : 'tw-mg0'} x={x} y={y} r={6.4} rot={i * 41} />
      })}

      {/* The bride: a flared lehenga with a gold hem, bangles, and a dupatta over her head to the floor */}
      <path d="M-68 -152Q-90 -80 -124 -2Q-54 9 18 -2Q-4 -80 -22 -152Z" fill={`url(#${id}-skirt)`} />
      {butis.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.7} fill={gold} opacity={0.85} />)}
      <path d="M-121 -10Q-54 0 16 -10" stroke={gold} strokeWidth={9} fill="none" />
      <path d="M-114 -22Q-54 -12 12 -22" stroke={gold} strokeWidth={1.6} strokeDasharray="2 3" fill="none" />
      <path d="M-70 -150L-72 -232Q-66 -248 -46 -252Q-30 -250 -20 -236L-20 -150Z" fill="#B3122B" />
      <path d="M-26 -244Q-14 -236 -14 -220L-18 -156Q-21 -147 -30 -151L-30 -220Z" fill={skin} />
      <path d="M-30 -232Q-22 -240 -14 -226L-14 -216 -30 -214Z" fill="#B3122B" />
      {[-188, -183, -178, -173, -168].map((y, i) => <path key={y} d={`M-30 ${y}L-16 ${y + 1}`} stroke={i % 2 ? gold : '#D11F3A'} strokeWidth={3.4} />)}
      <ellipse cx={-21} cy={-144} rx={9} ry={8} fill={skin} />
      {/* Their joined hands, bound with a rushnyk; its end hangs free */}
      <g className="tw-ribbon">
        <path d="M-24 -141L-29 -100H-15L-16 -141Z" fill="#F8F2E4" />
        <path d="M-28.4 -110H-15.6M-28.8 -105H-15.2" stroke={C.kalyna} strokeWidth={1.3} />
        <path d="M-22 -122l3 3.4-3 3.4-3-3.4Z" fill={C.kalyna} />
        {[-28, -25, -22, -19, -16].map((x) => <path key={x} d={`M${x} -100v5`} stroke="#EFE5CF" strokeWidth={0.8} />)}
      </g>
      <path d="M-34 -151L-8 -149 -9 -137 -33 -139Z" fill="#F8F2E4" />
      <path d="M-33 -147L-9 -145M-33 -142L-9 -140" stroke={C.kalyna} strokeWidth={1} strokeDasharray="2 1.5" />
      <g className="tw-veil" style={{ transformOrigin: '72% 0%' }}>
        <path d="M-46 -320Q-72 -318 -76 -290Q-84 -250 -98 -200Q-114 -120 -134 -12Q-104 -2 -80 -12L-60 -118Q-50 -200 -32 -248Q-22 -282 -27 -302Q-32 -320 -46 -320Z" fill="rgba(196,16,46,0.9)" />
        <path d="M-46 -320Q-72 -318 -76 -290Q-84 -250 -98 -200Q-114 -120 -134 -12" stroke={gold} strokeWidth={3.2} strokeDasharray="1 3.4" strokeLinecap="round" fill="none" />
        <path d="M-80 -12L-60 -118Q-50 -200 -32 -248Q-22 -282 -27 -302" stroke={gold} strokeWidth={2.4} fill="none" />
        <path d="M-60 -300Q-46 -312 -34 -296" stroke="rgba(255,226,160,0.4)" strokeWidth={2} fill="none" />
      </g>

      {/* Her vinok over the dupatta: barvinok, kalyna, sunflowers and roses, the ribbons streaming down her back */}
      {[C.kalyna, C.sunflower, C.blue, C.leaf, C.rani].map((col, i) => (
        <path key={col} className="tw-ribbon" style={{ animationDelay: `${i * 0.4}s` }} d={`M${-54 + i * 2.4} -306C${-62 + i * 3} -262 ${-44 + i * 2} -232 ${-60 + i * 4} ${-168 + i * 7}`} stroke={col} strokeWidth={4.2} fill="none" strokeLinecap="round" />
      ))}
      {Array.from({ length: 5 }, (_, k) => {
        const a = Math.PI * (1.12 + k * 0.19)
        return <Stamp key={`f${k}`} id={['tw-lf0', 'tw-bv', 'tw-kl', 'tw-bv', 'tw-lf1'][k]} x={-50 + Math.cos(a) * 24} y={-315 + Math.sin(a) * 7} r={5.4} rot={k * 50 - 90} />
      })}
      {Array.from({ length: 8 }, (_, k) => {
        const a = Math.PI * (k / 7)
        return <Stamp key={`n${k}`} id={['tw-bv', 'tw-rr', 'tw-sf', 'tw-kl', 'tw-bv', 'tw-rw', 'tw-sf', 'tw-rr'][k]} x={-50 + Math.cos(a) * 25} y={-315 + Math.sin(a) * 7.5} r={k % 2 ? 6.6 : 6} rot={k * 37} />
      })}
    </g>
  )
}

export function PalaceScene({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const doorway = arch(372, 628, 404, 862)
  const inner = arch(418, 582, 492, 862)
  const candles: [number, number, number][] = [[446, 884, 15], [420, 914, 20], [388, 950, 27], [348, 992, 36]]
  const petals = Array.from({ length: 64 }, (_, i) => {
    const t = rnd(i + 501)
    const y = 866 + t * 134
    const half = 32 + t * 110
    return { x: q(500 + (rnd(i + 601) - 0.5) * 2 * half), y: q(y), r: q(4 + t * 7), id: ['tw-mg0', 'tw-rr', 'tw-mg1', 'tw-rs', 'tw-mg0'][i % 5], rot: q(rnd(i + 701) * 360) }
  })
  return (
    <svg viewBox="-400 0 1800 1000" preserveAspectRatio="xMidYMax slice" aria-hidden className={className} style={style}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140D22" />
          <stop offset="0.32" stopColor="#2C1446" />
          <stop offset="0.56" stopColor="#6B1C52" />
          <stop offset="0.7" stopColor="#B83A5A" />
          <stop offset="0.8" stopColor="#E9804A" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2C796" />
          <stop offset="1" stopColor="#B99766" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7E8CC" />
          <stop offset="1" stopColor="#E3C796" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.62" r="0.62">
          <stop offset="0" stopColor="#FFF4D2" />
          <stop offset="0.45" stopColor="#FFD27A" />
          <stop offset="1" stopColor="#E8963A" />
        </radialGradient>
        <radialGradient id={`${id}-deep`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#FFFBEA" />
          <stop offset="0.5" stopColor="#FFE3A0" />
          <stop offset="1" stopColor="#F2B45A" />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="rgba(255,236,170,0.75)" />
          <stop offset="1" stopColor="rgba(255,200,110,0)" />
        </radialGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DDB8" />
          <stop offset="1" stopColor="#C9A27A" />
        </linearGradient>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E1022" />
          <stop offset="0.45" stopColor="#B81D2E" />
          <stop offset="1" stopColor="#8A0F21" />
        </linearGradient>
        <pattern id={`${id}-brocade`} width="14" height="16" patternUnits="userSpaceOnUse">
          <path d="M7 3L9 8 7 13 5 8Z" fill="#E9C46A" />
          <circle cx={0} cy={0} r={1.2} fill="#E9C46A" />
          <circle cx={14} cy={16} r={1.2} fill="#E9C46A" />
        </pattern>
        <linearGradient id={`${id}-skirt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D2203A" />
          <stop offset="1" stopColor="#99101F" />
        </linearGradient>
      </defs>

      {/* Dusk sky, stars and a new moon */}
      <rect x={-400} width={1800} height={1000} fill={`url(#${id}-sky)`} />
      {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFF6DA" className={s.twinkle ? 'tw-twinkle' : undefined} style={{ animationDelay: `${s.delay}s` }} />)}
      <path d="M648 96a24 24 0 1 0 18 40 19 19 0 1 1-18-40Z" fill="#FBE7B0" />

      {/* Hills, and the lower arcades of the palace either side */}
      <path d="M-400 664C-260 630 -120 676 0 690C110 640 210 680 310 656S520 632 640 664 860 626 1000 674C1140 640 1260 690 1400 660V880H-400Z" fill="#3A1236" />
      <g fill={`url(#${id}-shade)`}>
        <rect x={-400} y={612} width={700} height={258} />
        <rect x={700} y={612} width={700} height={258} />
      </g>
      <path d="M-400 612H300M700 612H1400" stroke="#B88A45" strokeWidth={4} />
      {[-370, -284, -198, -112, -26, 60, 146, 232, 704, 790, 876, 962, 1048, 1134, 1220, 1306].map((x) => (
        <g key={x} opacity={0.82}>
          <Niche x0={x} x1={x + 54} top={690} bottom={862} glow={`url(#${id}-glow)`} />
          <rect x={x - 18} y={690} width={10} height={172} fill="#C9A877" />
        </g>
      ))}
      {[[-400, -50], [-50, 300], [700, 1050], [1050, 1400]].map(([a, b], i) => <Lights key={a} from={[a, 604]} to={[b, 604]} sag={26} n={12} k={i * 2} />)}

      {/* The pavilion: chhatris, a dome, the cornice and its kanguras */}
      <g fill={`url(#${id}-stone)`} stroke="#C99E5C" strokeWidth={2}>
        {[300, 700].map((cx) => (
          <g key={cx}>
            <path d={`M${cx - 46} 272C${cx - 46} 226 ${cx - 20} 214 ${cx} 186C${cx + 20} 214 ${cx + 46} 226 ${cx + 46} 272Z`} />
            <rect x={cx - 52} y={270} width={104} height={10} />
            <path d={`M${cx - 40} 280V322M${cx - 14} 280V322M${cx + 14} 280V322M${cx + 40} 280V322`} strokeWidth={6} stroke="#E9D2A6" />
            <path d={`M${cx} 186V166`} strokeWidth={3} stroke={C.gold} />
            <circle cx={cx} cy={162} r={4} fill={C.gold} stroke="none" />
          </g>
        ))}
        <path d="M414 300C414 236 456 210 500 166C544 210 586 236 586 300Z" />
        <rect x={404} y={296} width={192} height={14} />
      </g>
      <path d="M500 166V126" stroke={C.gold} strokeWidth={3.5} />
      <circle cx={500} cy={122} r={5} fill={C.gold} />
      <path d="M440 262C470 250 530 250 560 262" stroke="#C99E5C" strokeWidth={2} fill="none" />
      <rect x={244} y={322} width={512} height={548} fill={`url(#${id}-stone)`} />
      <path d={`M244 322H756${Array.from({ length: 21 }, (_, i) => `M${250 + i * 24.8} 322a12 12 0 0 1 24 0`).join('')}`} fill="#F1DDB6" stroke="#C99E5C" strokeWidth={2} />
      <rect x={240} y={330} width={520} height={16} fill="#D9B978" />
      <path d="M240 346H760" stroke="#B88A45" strokeWidth={2} />

      {/* Jharokha windows and lit niches beside the doorway */}
      {[[262, 338], [662, 738]].map(([a, b]) => (
        <g key={a}>
          <path d={arch(a, b, 400, 520)} fill="#6B2A3A" />
          <path d={arch(a + 8, b - 8, 412, 520)} fill={`url(#${id}-glow)`} opacity={0.75} />
          <path d={`M${a - 8} 520H${b + 8}V532H${a - 8}Z`} fill="#D9B978" />
          <Niche x0={a + 4} x1={b - 4} top={640} bottom={830} glow={`url(#${id}-glow)`} />
        </g>
      ))}

      {/* The doorway: a carved frame, the arch, a deeper arch inside, all lit */}
      <rect x={350} y={384} width={300} height={486} fill="#EAD3A6" stroke={C.gold} strokeWidth={4} />
      <rect x={358} y={392} width={284} height={470} fill="none" stroke="#C99E5C" strokeWidth={1.5} strokeDasharray="3 4" />
      {[[370, 404], [630, 404]].map(([x, y]) => <Stamp key={x} id="tw-rs" x={x} y={y} r={8} />)}
      <path d={doorway} fill={`url(#${id}-glow)`} />
      <path d={inner} fill={`url(#${id}-deep)`} />
      <path d={inner} fill="none" stroke="rgba(170,110,40,0.5)" strokeWidth={3} />
      <path d={doorway} fill="none" stroke={C.gold} strokeWidth={5} />
      <path d="M372 862H628" stroke="rgba(150,90,30,0.4)" strokeWidth={2} />

      {/* The chandelier, swaying in its own light */}
      <g className="tw-chand">
        <circle cx={500} cy={540} r={92} fill={`url(#${id}-halo)`} className="tw-glow" />
        <path d="M500 410V488" stroke={C.goldDeep} strokeWidth={2} />
        <path d="M474 488H526L520 498H480Z" fill={C.gold} />
        <path d="M458 512Q500 538 542 512M468 534Q500 552 532 534" stroke={C.gold} strokeWidth={3} fill="none" />
        {[[458, 512], [472, 522], [486, 527], [500, 528], [514, 527], [528, 522], [542, 512], [468, 534], [484, 541], [500, 543], [516, 541], [532, 534]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y}l3.4 7-3.4 9-3.4-9Z`} fill="#FFF8DE" stroke={C.gold} strokeWidth={0.8} />
        ))}
        <path d="M500 552l8 15-8 17-8-17Z" fill="#FFF8DE" stroke={C.gold} strokeWidth={1} />
        {[462, 500, 538].map((x) => <ellipse key={x} cx={x} cy={500} rx={3} ry={6} fill="#FFE7A0" className="tw-flame" />)}
      </g>

      {/* Strands of roses and marigolds either side of the arch */}
      {[326, 344, 362, 638, 656, 674].map((x, i) => <Strand key={x} x={x} top={352} bottom={872} seed={i + 1} />)}
      <Lights from={[244, 352]} to={[500, 352]} sag={44} n={9} k={0} />
      <Lights from={[500, 352]} to={[756, 352]} sag={44} n={9} k={2} />

      {/* The floor, a path of petals and candles in glass */}
      <path d="M-400 870H1400V1000H-400Z" fill={`url(#${id}-floor)`} />
      <path d="M-400 870H1400" stroke="#B88A45" strokeWidth={2} />
      <path d="M462 870L538 870 640 1000 360 1000Z" fill="rgba(255,236,190,0.35)" />
      {petals.map((p, i) => <Stamp key={i} id={p.id} x={p.x} y={p.y} r={p.r} rot={p.rot} />)}
      {candles.flatMap(([x, y, w], i) => [
        <svg key={`l${i}`} x={x - w / 2} y={y - w * 2.4} width={w} height={w * 2.84} viewBox="0 0 60 170" overflow="visible"><Candle /></svg>,
        <svg key={`r${i}`} x={1000 - x - w / 2} y={y - w * 2.4} width={w} height={w * 2.84} viewBox="0 0 60 170" overflow="visible"><Candle /></svg>,
      ])}

      {/* The couple at the threshold */}
      <g transform="translate(508 968) scale(0.93)">
        <Couple id={id} />
      </g>
    </svg>
  )
}
