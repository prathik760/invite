'use client'

/*
 * The pictures of the kids' party designs, all drawn here: original artwork, no characters.
 *
 * For each theme an opening (the scene a guest taps to start, which then plays like a short film,
 * animated by the `ph-play` class on the invitation's root: KidsParty.tsx) and a hero (what stays
 * at the top once it has played, built around the child's photo when there is one).
 *
 * Colours come from the theme's palette (`a`, skins.tsx), so the same scene works in green or
 * pink, for a boy or a girl.
 */

export type Art = Record<string, string>

// ─── Shared drawing bits ────────────────────────────────────────────────────

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function burst(cx: number, cy: number, spikes: number, outer: number, inner: number, turn = 0): string {
  const pts: string[] = []
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 ? inner : outer
    const ang = turn + (Math.PI * i) / spikes - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(ang)).toFixed(1)},${(cy + r * Math.sin(ang)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const STARS = (() => {
  const r = rng(11)
  return Array.from({ length: 54 }, () => ({ x: r() * 360, y: r() * 420, s: 0.6 + r() * 1.5, o: 0.35 + r() * 0.6 }))
})()
const SKYLINE: [number, number, number][] = [
  [0, 40, 70], [38, 30, 98], [66, 44, 60], [108, 26, 112], [132, 40, 82], [170, 34, 64], [202, 30, 102], [230, 46, 76], [274, 30, 120], [302, 28, 74], [328, 34, 96],
]
const WINDOWS = (() => {
  const r = rng(5)
  const out: { x: number; y: number }[] = []
  for (const [x, w, h] of SKYLINE) for (let wy = 320 - h + 10; wy < 312; wy += 14) for (let wx = x + 6; wx + 6 < x + w; wx += 10) if (r() > 0.55) out.push({ x: wx, y: wy })
  return out
})()

export const SPARKLE = 'M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z'

function Sparkle({ x, y, s = 1, fill, cls = 'kx-twinkle', delay = 0 }: { x: number; y: number; s?: number; fill: string; cls?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={SPARKLE} fill={fill} className={cls} style={delay ? { animationDelay: `${delay}ms` } : undefined} />
    </g>
  )
}

function Fern({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      {[-56, -28, 0, 28, 56].map((r) => <path key={r} d="M0 0 Q-8 -28 0 -56 Q8 -28 0 0Z" transform={`rotate(${r})`} />)}
    </g>
  )
}

const LEAF = 'M0 0 C26 -34 84 -38 116 -4 C84 22 28 26 0 0 Z'
function Leaf({ x, y, r, s = 1, fill, cls }: { x: number; y: number; r: number; s?: number; fill: string; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} className={cls}>
      <path d={LEAF} fill={fill} />
      <path d="M6 0 Q56 -10 110 -4" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" fill="none" />
    </g>
  )
}

/** The child's photo, cut to a circle. */
function PhotoCircle({ u, href, cx, cy, r }: { u: string; href: string; cx: number; cy: number; r: number }) {
  return (
    <>
      <defs>
        <clipPath id={`${u}ph`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#E8E2DA" />
      <image href={href} x={cx - r} y={cy - r} width={r * 2} height={r * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${u}ph)`} />
    </>
  )
}

// ─── Dinosaur ───────────────────────────────────────────────────────────────

const ZIG = '92,212 110,198 126,214 144,196 162,214 180,196 198,214 216,196 234,214 252,198 270,212'

function BabyDino({ a, ink }: { a: Art; ink: string }) {
  return (
    <g>
      <rect x="160" y="222" width="40" height="80" rx="18" fill={a.dino} />
      <path d="M150 182 L158 166 L166 180 L174 162 L182 178 L190 162 L198 180 L206 166 L212 184" fill={a.dinoDark} />
      <ellipse cx="180" cy="206" rx="42" ry="33" fill={a.dino} />
      <ellipse cx="180" cy="222" rx="26" ry="14" fill={a.belly} opacity="0.85" />
      <circle cx="164" cy="200" r="9" fill="#FFFFFF" />
      <circle cx="196" cy="200" r="9" fill="#FFFFFF" />
      <circle cx="166" cy="202" r="5" fill={ink} />
      <circle cx="194" cy="202" r="5" fill={ink} />
      <circle cx="167.6" cy="200" r="1.8" fill="#FFFFFF" />
      <circle cx="195.6" cy="200" r="1.8" fill="#FFFFFF" />
      <circle cx="150" cy="214" r="5" fill="#FF9C8A" opacity="0.6" />
      <circle cx="210" cy="214" r="5" fill="#FF9C8A" opacity="0.6" />
      <path d="M170 220 Q180 228 190 220" stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </g>
  )
}

export function DinoOpening({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 400" className="block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a.sky1} />
          <stop offset="1" stopColor={a.sky2} />
        </linearGradient>
        <clipPath id={`${u}low`}><polygon points={`20,212 ${ZIG} 340,212 340,400 20,400`} /></clipPath>
        <clipPath id={`${u}cap`}><polygon points={`20,40 340,40 340,212 ${ZIG.split(' ').reverse().join(' ')} 20,212`} /></clipPath>
      </defs>
      <rect width="360" height="400" fill={`url(#${u}sky)`} />
      <circle cx="298" cy="64" r="30" fill={a.sun} />
      <path d="M10 300 L70 196 Q80 184 90 194 Q100 184 110 196 L170 300 Z" fill={a.volcano} opacity="0.85" />
      <path d="M70 196 Q80 184 90 194 Q100 184 110 196 L104 204 Q96 198 90 206 Q84 198 76 204 Z" fill={a.lava} />
      <g className="kx-drift" fill={a.smoke}>
        <circle cx="88" cy="176" r="11" /><circle cx="102" cy="164" r="9" /><circle cx="92" cy="152" r="7" />
      </g>
      <path d="M0 300 Q90 270 180 292 T360 286 V400 H0 Z" fill={a.hill} />
      <path d="M0 336 Q120 312 220 332 T360 328 V400 H0 Z" fill={a.ground} />
      <Fern x={34} y={330} s={0.9} fill={a.fern} />
      <Fern x={328} y={334} s={0.85} fill={a.fern} />
      {/* The baby, inside until the egg hatches. */}
      <g className="dn-baby"><BabyDino a={a} ink={ink} /></g>
      <g className="dn-egg">
        <g clipPath={`url(#${u}low)`}>
          <ellipse cx="180" cy="250" rx="80" ry="96" fill={a.egg} stroke={ink} strokeWidth="3" />
          <g fill={a.eggSpot} opacity="0.8">
            <ellipse cx="146" cy="262" rx="11" ry="9" /><ellipse cx="214" cy="292" rx="12" ry="10" /><ellipse cx="160" cy="316" rx="8" ry="7" /><ellipse cx="226" cy="240" rx="7" ry="6" />
          </g>
        </g>
        <polyline className="dn-crack" points={ZIG} fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <g className="dn-cap">
          <g clipPath={`url(#${u}cap)`}>
            <ellipse cx="180" cy="250" rx="80" ry="96" fill={a.egg} stroke={ink} strokeWidth="3" />
            <g fill={a.eggSpot} opacity="0.8"><ellipse cx="160" cy="178" rx="10" ry="8" /><ellipse cx="206" cy="190" rx="7" ry="6" /></g>
          </g>
        </g>
      </g>
      {/* The nest, in front of the egg. */}
      <ellipse cx="180" cy="338" rx="118" ry="28" fill="#A86B3C" />
      <g stroke="#7A4A26" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M74 330 Q130 350 186 332 M120 346 Q190 360 280 334 M90 342 Q160 324 250 346 M150 352 Q220 340 290 344" />
      </g>
      <g className="dn-age">
        <circle cx="270" cy="158" r="30" fill={a.hat} stroke={ink} strokeWidth="3" />
        <text x="270" y="160" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 26 : 34} fontWeight="900" fill={ink}>{mark}</text>
      </g>
      <g className="dn-roar">
        <polygon points={burst(110, 112, 12, 54, 40)} fill={a.hatStripe} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <text x="110" y="114" textAnchor="middle" dominantBaseline="central" fontSize="25" fontWeight="900" fill="#FFFFFF" stroke={ink} strokeWidth="1.5" paintOrder="stroke">ROAR!</text>
      </g>
      {[[60, 378], [118, 386], [242, 386], [300, 378]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(1.4)`}>
          <path className="dn-print" style={{ animationDelay: `${2500 + i * 180}ms` }} d="M0 8 C-3 8 -4 6 -3 4 L-7 -3 L-2 0 L0 -8 L2 0 L7 -3 L3 4 C4 6 3 8 0 8Z" fill={ink} />
        </g>
      ))}
    </svg>
  )
}

export function DinoScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A friendly dinosaur in a party hat beside a big spotted egg">
      <defs>
        <linearGradient id={`${u}sky2`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></linearGradient>
        <clipPath id={`${u}egg2`}><ellipse cx="142" cy="226" rx="54" ry="64" /></clipPath>
      </defs>
      <rect width="360" height="320" fill={`url(#${u}sky2)`} />
      <circle cx="294" cy="64" r="32" fill={a.sun} />
      <path d="M14 238 L82 118 Q92 104 104 116 Q114 104 124 118 L196 238 Z" fill={a.volcano} />
      <path d="M82 118 Q92 104 104 116 Q114 104 124 118 L118 128 Q110 120 104 128 Q96 120 88 128 Z" fill={a.lava} />
      <path d="M100 124 Q93 150 102 168 Q111 150 107 124 Z" fill={a.lava} />
      <g className="kx-drift" fill={a.smoke}><circle cx="100" cy="94" r="14" /><circle cx="116" cy="82" r="12" /><circle cx="104" cy="68" r="10" /><circle cx="122" cy="58" r="7" /></g>
      <path d="M0 240 Q90 202 180 230 T360 224 V320 H0 Z" fill={a.hill} />
      <Fern x={36} y={250} s={0.9} fill={a.fern} />
      <g fill={a.dinoDark}>
        <rect x="228" y="236" width="22" height="46" rx="10" /><rect x="253" y="240" width="20" height="42" rx="9" /><rect x="287" y="238" width="22" height="44" rx="10" /><rect x="311" y="234" width="20" height="44" rx="9" />
      </g>
      <path d="M316 222 Q350 224 358 260 Q336 244 310 246 Z" fill={a.dino} />
      <ellipse cx="270" cy="228" rx="60" ry="36" fill={a.dino} />
      <ellipse cx="262" cy="246" rx="40" ry="13" fill={a.belly} opacity="0.75" />
      <g fill={a.spots} opacity="0.6"><circle cx="252" cy="212" r="7" /><circle cx="278" cy="206" r="6" /><circle cx="300" cy="220" r="5" /><circle cx="268" cy="228" r="4.5" /></g>
      <g className="kx-nod">
        <path d="M238 216 Q214 168 204 132" stroke={a.dino} strokeWidth="30" strokeLinecap="round" fill="none" />
        <ellipse cx="190" cy="120" rx="30" ry="20" fill={a.dino} />
        <circle cx="198" cy="113" r="4.2" fill={ink} /><circle cx="199.4" cy="111.6" r="1.4" fill="#FFFFFF" /><circle cx="164" cy="116" r="1.8" fill={ink} />
        <path d="M166 126 Q175 133 184 128" stroke={ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="190" cy="128" r="4.5" fill="#FF9C8A" opacity="0.6" />
        <g transform="rotate(14 206 96)">
          <path d="M192 102 L208 62 L222 100 Z" fill={a.hat} />
          <path d="M197 90 L218 87 M202 77 L214 75" stroke={a.hatStripe} strokeWidth="3" strokeLinecap="round" />
          <circle cx="208" cy="60" r="5.5" fill={a.hatStripe} />
        </g>
      </g>
      <path d="M0 268 Q120 242 220 264 T360 258 V320 H0 Z" fill={a.ground} />
      <Fern x={330} y={282} s={0.8} fill={a.fern} />
      <g className="kx-wobble">
        <ellipse cx="142" cy="226" rx="54" ry="64" fill={a.egg} stroke={ink} strokeWidth="3" />
        <g clipPath={`url(#${u}egg2)`}>
          <g fill={a.eggSpot} opacity="0.75"><ellipse cx="110" cy="214" rx="9" ry="7" /><ellipse cx="176" cy="264" rx="10" ry="8" /><ellipse cx="114" cy="274" rx="7" ry="6" /><ellipse cx="180" cy="214" rx="6" ry="5" /></g>
          <path d="M86 192 L104 182 L116 194 L130 180 L142 194 L156 180 L168 194 L182 182 L200 192" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" fill="none" />
        </g>
        <text x="142" y="240" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 62 : 90} fill={a.lava} stroke={ink} strokeWidth="3" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
    </svg>
  )
}

/** The child's photo with a dinosaur peeking over the top, claws on the frame. */
export function DinoPhoto({ u, a, href, mark }: { u: string; a: Art; href: string; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 300 330" className="block h-auto w-full" role="img" aria-label="The birthday child, with a dinosaur peeking over the frame">
      <g className="kx-nod">
        <path d="M96 48 L106 22 L118 42 L130 14 L142 38 L154 10 L166 38 L178 14 L188 40 L200 22 L206 50" fill={a.dinoDark} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="150" cy="70" rx="64" ry="42" fill={a.dino} stroke={ink} strokeWidth="3" />
        <circle cx="126" cy="60" r="12" fill="#FFFFFF" stroke={ink} strokeWidth="2" /><circle cx="174" cy="60" r="12" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
        <circle cx="128" cy="62" r="6.5" fill={ink} /><circle cx="172" cy="62" r="6.5" fill={ink} />
        <circle cx="130" cy="59.5" r="2.2" fill="#FFFFFF" /><circle cx="174" cy="59.5" r="2.2" fill="#FFFFFF" />
        <circle cx="108" cy="80" r="6" fill="#FF9C8A" opacity="0.6" /><circle cx="192" cy="80" r="6" fill="#FF9C8A" opacity="0.6" />
      </g>
      <circle cx="150" cy="200" r="106" fill={a.hat} stroke={ink} strokeWidth="4" />
      <PhotoCircle u={u} href={href} cx={150} cy={200} r={94} />
      <circle cx="150" cy="200" r="94" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <g fill={a.dino} stroke={ink} strokeWidth="2.5">
        <path d="M96 104 q-6 -14 6 -18 q6 -2 8 6 q4 -8 10 -4 q6 4 0 14 Z" />
        <path d="M204 104 q6 -14 -6 -18 q-6 -2 -8 6 q-4 -8 -10 -4 q-6 4 0 14 Z" />
      </g>
      <g>
        <circle cx="248" cy="272" r="34" fill={a.lava} stroke={ink} strokeWidth="4" />
        <text x="248" y="274" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 30 : 40} fill="#FFFFFF" stroke={ink} strokeWidth="2" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
    </svg>
  )
}

// ─── Space ──────────────────────────────────────────────────────────────────

function Rocket({ a }: { a: Art }) {
  return (
    <g>
      <path d="M150 300 L118 340 L152 330 Z M210 300 L242 340 L208 330 Z" fill={a.fin} />
      <path d="M180 140 Q218 190 216 300 L144 300 Q142 190 180 140 Z" fill={a.rocket} />
      <path d="M180 140 Q200 162 208 186 L152 186 Q160 162 180 140 Z" fill={a.fin} />
      <circle cx="180" cy="228" r="22" fill={a.window} stroke={a.sky2} strokeWidth="5" />
      <circle cx="173" cy="221" r="6" fill="#FFFFFF" opacity="0.6" />
      <rect x="160" y="300" width="40" height="12" rx="4" fill={a.fin} />
    </g>
  )
}

export function SpaceOpening({ u, a }: { u: string; a: Art }) {
  return (
    <svg viewBox="0 0 360 420" className="block h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id={`${u}sky`} cx="0.5" cy="0.35" r="0.85"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></radialGradient>
      </defs>
      <rect width="360" height="420" fill={`url(#${u}sky)`} />
      {STARS.map((s, i) => <circle key={i} cx={s.x.toFixed(1)} cy={(s.y * 0.8).toFixed(1)} r={s.s.toFixed(2)} fill="#FFFFFF" opacity={s.o.toFixed(2)} className={i % 7 === 0 ? 'kx-twinkle' : undefined} style={i % 7 === 0 ? { animationDelay: `${(i * 137) % 2400}ms` } : undefined} />)}
      <circle cx="300" cy="70" r="20" fill={a.moon} />
      <circle cx="294" cy="64" r="4" fill={a.sky1} opacity="0.35" />
      <circle cx="56" cy="110" r="14" fill={a.small} />
      <ellipse cx="56" cy="110" rx="24" ry="6" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" transform="rotate(-18 56 110)" />
      {/* The launch tower. */}
      <g stroke={a.tower} strokeWidth="4" fill="none" opacity="0.9">
        <path d="M86 360 V170 M112 360 V170 M86 180 L112 210 M112 210 L86 240 M86 240 L112 270 M112 270 L86 300 M86 300 L112 330 M112 196 H140 M112 250 H140" />
      </g>
      <g className="sp-rocket">
        <g className="sp-flame">
          <path d="M162 312 Q180 380 198 312 Z" fill={a.flame1} />
          <path d="M170 312 Q180 352 190 312 Z" fill={a.flame2} />
        </g>
        <Rocket a={a} />
      </g>
      <rect x="0" y="352" width="360" height="68" fill={a.ground} />
      <rect x="120" y="344" width="120" height="12" rx="4" fill={a.tower} />
      <g className="sp-smoke" fill="#FFFFFF">
        {[[120, 350, 26], [160, 360, 30], [200, 360, 30], [240, 350, 26], [90, 362, 22], [270, 362, 22]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} style={{ animationDelay: `${i * 60}ms` }} />)}
      </g>
    </svg>
  )
}

export function SpaceScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A rocket flying past a ringed planet">
      <defs>
        <radialGradient id={`${u}sky2`} cx="0.5" cy="0.4" r="0.8"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></radialGradient>
        <radialGradient id={`${u}pl`} cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor={a.planet1} /><stop offset="0.55" stopColor={a.planet2} /><stop offset="1" stopColor={a.planet3} /></radialGradient>
      </defs>
      <rect width="360" height="320" fill={`url(#${u}sky2)`} />
      {STARS.slice(0, 44).map((s, i) => <circle key={i} cx={s.x.toFixed(1)} cy={(s.y * 0.76).toFixed(1)} r={s.s.toFixed(2)} fill="#FFFFFF" opacity={s.o.toFixed(2)} className={i % 6 === 0 ? 'kx-twinkle' : undefined} />)}
      <g transform="translate(180 182) rotate(-14)"><path d="M-130 0 A130 32 0 0 1 130 0" stroke={a.ring} strokeWidth="9" fill="none" /></g>
      <circle cx="180" cy="176" r="76" fill={`url(#${u}pl)`} />
      <text x="180" y="168" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 64 : 88} fontWeight="800" fill="#FFFFFF" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      <g transform="translate(180 182) rotate(-14)"><path d="M-130 0 A130 32 0 0 0 130 0" stroke={a.ring} strokeWidth="9" fill="none" /></g>
      <g className="kx-float">
        <g transform="translate(64 96) rotate(38) scale(0.32) translate(-180 -230)"><Rocket a={a} /></g>
      </g>
      <circle cx="306" cy="58" r="17" fill={a.moon} />
      <circle cx="44" cy="270" r="13" fill={a.small} />
    </svg>
  )
}

/** The child as an astronaut: their photo in the helmet's visor. */
export function SpacePhoto({ u, a, href, mark }: { u: string; a: Art; href: string; mark: string }) {
  return (
    <svg viewBox="0 0 320 300" className="block h-auto w-full" role="img" aria-label="The birthday child in an astronaut helmet">
      <g className="kx-float">
        <rect x="64" y="226" width="192" height="60" rx="26" fill={a.rocket} />
        <rect x="120" y="236" width="80" height="20" rx="6" fill={a.fin} />
        <circle cx="160" cy="146" r="118" fill={a.rocket} />
        <circle cx="160" cy="146" r="118" fill="none" stroke={a.sky2} strokeOpacity="0.25" strokeWidth="6" />
        <rect x="30" y="122" width="22" height="48" rx="10" fill={a.fin} />
        <rect x="268" y="122" width="22" height="48" rx="10" fill={a.fin} />
        <circle cx="160" cy="146" r="96" fill={a.sky2} />
        <PhotoCircle u={u} href={href} cx={160} cy={146} r={92} />
        <path d="M96 96 A80 80 0 0 1 176 62" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M112 84 A64 64 0 0 1 130 72" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <g>
        <ellipse cx="262" cy="248" rx="44" ry="10" fill="none" stroke={a.ring} strokeWidth="5" transform="rotate(-16 262 248)" />
        <circle cx="262" cy="246" r="28" fill={a.planet2} />
        <text x="262" y="247" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 22 : 30} fontWeight="800" fill="#FFFFFF" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
      <Sparkle x={40} y={40} s={0.9} fill={a.ring} />
      <Sparkle x={290} y={56} s={0.7} fill="#FFFFFF" delay={700} />
    </svg>
  )
}

// ─── Superhero ──────────────────────────────────────────────────────────────

const RAYS = Array.from({ length: 18 }, (_, i) => {
  const a1 = (Math.PI * 2 * i) / 18
  const a2 = a1 + Math.PI / 18
  return `180,146 ${(180 + 360 * Math.cos(a1)).toFixed(1)},${(146 + 360 * Math.sin(a1)).toFixed(1)} ${(180 + 360 * Math.cos(a2)).toFixed(1)},${(146 + 360 * Math.sin(a2)).toFixed(1)}`
})

function City({ a }: { a: Art }) {
  return (
    <>
      <g fill={a.city}>{SKYLINE.map(([x, w, h]) => <rect key={x} x={x} y={320 - h} width={w} height={h} />)}</g>
      <g fill={a.windows} opacity="0.75">{WINDOWS.map((w, i) => <rect key={i} x={w.x} y={w.y} width="4" height="6" />)}</g>
    </>
  )
}

export function HeroBack({ u, a }: { u: string; a: Art }) {
  return (
    <>
      <defs>
        <pattern id={`${u}dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.8" fill="#FFFFFF" opacity="0.16" /></pattern>
      </defs>
      <rect width="360" height="320" fill={a.sky} />
      <g fill={a.rays} opacity="0.7">{RAYS.map((pt, i) => <polygon key={i} points={pt} />)}</g>
      <rect width="360" height="320" fill={`url(#${u}dots)`} />
      <City a={a} />
    </>
  )
}

function Sfx({ x, y, text, fill, ink, cls, rot = 0, size = 1 }: { x: number; y: number; text: string; fill: string; ink: string; cls: string; rot?: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}>
      <g className={cls}>
        <polygon points={burst(0, 0, 13, 58, 40)} fill={fill} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="700" fontStyle="italic" fill="#FFFFFF" stroke={ink} strokeWidth="2.4" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{text}</text>
      </g>
    </g>
  )
}

/** Behind the comic's cover: the action, bursting in once it opens. */
export function HeroAction({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" aria-hidden>
      <HeroBack u={u} a={a} />
      <Sfx x={92} y={86} text="POW!" fill={a.num} ink={ink} cls="sh-sfx sh-sfx1" rot={-12} />
      <Sfx x={272} y={110} text="BAM!" fill={a.b2} ink={ink} cls="sh-sfx sh-sfx2" rot={10} size={0.9} />
      <Sfx x={120} y={232} text="ZOOM!" fill={a.burst} ink={ink} cls="sh-sfx sh-sfx3" rot={-6} size={0.95} />
      <g className="sh-big">
        <polygon points={burst(187, 153, 16, 100, 76)} fill={ink} />
        <polygon points={burst(180, 146, 16, 100, 76)} fill={a.burst} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <text x="180" y="152" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 96 : 120} fontWeight="700" fontStyle="italic" fill={a.num} stroke={ink} strokeWidth="5" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
    </svg>
  )
}

export function HeroScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A comic-book burst over a city skyline">
      <HeroBack u={u} a={a} />
      <path d="M318 26 L304 56 L316 56 L308 84 L336 46 L324 46 L332 26 Z" fill={a.bolt} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M44 176 L30 206 L42 206 L34 234 L62 196 L50 196 L58 176 Z" fill={a.bolt} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(14 14)">
        <path d="M10 0 H106 Q116 0 116 10 V34 Q116 44 106 44 H46 L28 60 L32 44 H10 Q0 44 0 34 V10 Q0 0 10 0 Z" fill="#FFFFFF" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <text x="58" y="23" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="700" fontStyle="italic" fill={ink} style={{ fontFamily: 'var(--kx-display)' }}>HOORAY!</text>
      </g>
      <g className="kx-pulse">
        <polygon points={burst(187, 153, 16, 100, 76)} fill={ink} />
        <polygon points={burst(180, 146, 16, 100, 76)} fill={a.burst} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <polygon points={burst(180, 146, 16, 76, 64, Math.PI / 16)} fill={a.burstIn} />
        <text x="180" y="152" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 96 : 120} fontWeight="700" fontStyle="italic" fill={a.num} stroke={ink} strokeWidth="5" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
    </svg>
  )
}

/** The child as the hero of a comic poster: their photo in a tilted panel, the age in a burst. */
export function HeroPhoto({ u, a, href, mark }: { u: string; a: Art; href: string; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="The birthday child on a comic-book poster">
      <HeroBack u={u} a={a} />
      <defs><clipPath id={`${u}panel`}><rect x="96" y="40" width="168" height="200" rx="4" /></clipPath></defs>
      <g transform="rotate(-4 180 140)">
        <rect x="104" y="48" width="168" height="200" fill={ink} />
        <rect x="96" y="40" width="168" height="200" fill="#FFFFFF" />
        <image href={href} x="96" y="40" width="168" height="200" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${u}panel)`} />
        <rect x="96" y="40" width="168" height="200" fill="none" stroke={ink} strokeWidth="5" />
      </g>
      <path d="M40 120 L26 150 L38 150 L30 178 L58 140 L46 140 L54 120 Z" fill={a.bolt} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <g className="kx-pulse">
        <polygon points={burst(294, 222, 14, 56, 42)} fill={ink} transform="translate(5 5)" />
        <polygon points={burst(294, 222, 14, 56, 42)} fill={a.burst} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <text x="294" y="226" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 46 : 58} fontWeight="700" fontStyle="italic" fill={a.num} stroke={ink} strokeWidth="3.5" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
      <g transform="translate(12 14)">
        <path d="M10 0 H96 Q106 0 106 10 V32 Q106 42 96 42 H44 L26 58 L30 42 H10 Q0 42 0 32 V10 Q0 0 10 0 Z" fill="#FFFFFF" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <text x="53" y="22" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="700" fontStyle="italic" fill={ink} style={{ fontFamily: 'var(--kx-display)' }}>HOORAY!</text>
      </g>
    </svg>
  )
}

// ─── Unicorn ────────────────────────────────────────────────────────────────

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF">
      <circle cx="0" cy="0" r="24" /><circle cx="26" cy="-12" r="28" /><circle cx="54" cy="-2" r="24" /><circle cx="76" cy="8" r="18" />
      <rect x="-14" y="2" width="102" height="22" rx="11" />
    </g>
  )
}

function UnicornHead({ u, a, ink }: { u: string; a: Art; ink: string }) {
  const head = (
    <>
      <path d="M-34 112 Q-30 52 -10 26 L30 36 Q16 74 22 112 Z" />
      <circle cx="0" cy="0" r="34" />
      <ellipse cx="34" cy="18" rx="28" ry="22" transform="rotate(18 34 18)" />
      <path d="M-16 -26 L-8 -58 L6 -30 Z" />
    </>
  )
  const mane = a.rainbow.split(',')
  return (
    <g>
      <defs><clipPath id={`${u}horn`}><path d="M2 -32 L30 -84 L20 -28 Z" /></clipPath></defs>
      <g>
        <circle cx="-30" cy="-18" r="15" fill={mane[0]} /><circle cx="-40" cy="6" r="14" fill={mane[5]} /><circle cx="-42" cy="32" r="14" fill={mane[3]} />
        <circle cx="-40" cy="58" r="13" fill={mane[4]} /><circle cx="-36" cy="84" r="13" fill={mane[1]} />
      </g>
      <g fill={ink} stroke={ink} strokeWidth="7" strokeLinejoin="round">{head}</g>
      <g fill="#FFFFFF">{head}</g>
      <path d="M-12 -30 L-8 -50 L0 -32 Z" fill="#FFC6DA" />
      <path d="M2 -32 L30 -84 L20 -28 Z" fill={a.horn} />
      <g clipPath={`url(#${u}horn)`} stroke={a.hornStripe} strokeWidth="3"><path d="M4 -40 L26 -46 M10 -54 L28 -59 M16 -67 L30 -71" /></g>
      <path d="M2 -32 L30 -84 L20 -28 Z" fill="none" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="-6" cy="-30" r="10" fill={mane[0]} /><circle cx="-16" cy="-22" r="8" fill={mane[5]} />
      <path d="M8 -6 Q15 2 22 -6" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M10 -2 L7 2 M15 0 L15 5 M20 -2 L23 2" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="14" r="6" fill="#FF8FB1" opacity="0.55" />
      <path d="M54 12 Q58 16 55 20" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M38 32 Q46 37 54 30" stroke={ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  )
}

function Rainbow({ a, cx, cy, outer, band, cls }: { a: Art; cx: number; cy: number; outer: number; band: number; cls?: string }) {
  return (
    <g fill="none" strokeWidth={band}>
      {a.rainbow.split(',').map((c, i) => {
        const r = outer - i * band
        const d = `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`
        return <path key={c + i} d={d} stroke={c} className={cls} pathLength={1} style={cls ? { animationDelay: `${500 + i * 150}ms` } : undefined} />
      })}
    </g>
  )
}

export function UnicornOpening({ u, a }: { u: string; a: Art }) {
  const rays = Array.from({ length: 12 }, (_, i) => i)
  return (
    <svg viewBox="0 0 360 400" className="block h-auto w-full" aria-hidden>
      <defs><linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></linearGradient></defs>
      <rect width="360" height="400" fill={`url(#${u}sky)`} />
      <Rainbow a={a} cx={186} cy={330} outer={168} band={13} cls="un-arc" />
      <Cloud x={10} y={330} s={1.1} />
      <Cloud x={262} y={332} s={1.05} />
      <g className="un-uni"><g transform="translate(78 236) scale(1.05)"><UnicornHead u={u} a={a} ink={a.ink} /></g></g>
      <Sparkle x={40} y={50} s={1} fill="#FFFFFF" />
      <Sparkle x={318} y={80} s={0.9} fill={a.horn} delay={600} />
      <Sparkle x={250} y={40} s={0.6} fill="#FFFFFF" delay={1300} />
      <g className="un-star">
        <defs><radialGradient id={`${u}glow`}><stop offset="0" stopColor={a.horn} stopOpacity="0.55" /><stop offset="1" stopColor={a.horn} stopOpacity="0" /></radialGradient></defs>
        <circle cx="180" cy="170" r="74" fill={`url(#${u}glow)`} className="kx-glow" />
        <path d={SPARKLE} transform="translate(180 170) scale(5.2)" fill={a.horn} stroke="#FFFFFF" strokeWidth="0.5" />
        <path d={SPARKLE} transform="translate(180 170) scale(2.2)" fill="#FFFFFF" opacity="0.9" />
      </g>
      <g className="un-rays">
        {rays.map((i) => (
          <g key={i} className="un-ray" style={{ ['--tx' as string]: `${Math.round(Math.cos((i / 12) * Math.PI * 2) * 140)}px`, ['--ty' as string]: `${Math.round(Math.sin((i / 12) * Math.PI * 2) * 140)}px` }}>
            <path d={SPARKLE} fill={i % 2 ? '#FFFFFF' : a.horn} transform="translate(180 170) scale(0.9)" />
          </g>
        ))}
      </g>
      {[[60, 0], [130, 300], [210, 150], [290, 450], [330, 650]].map(([x, d], i) => (
        <g key={i} className="un-fall" style={{ animationDelay: `${2000 + d}ms` }}>
          <path d={SPARKLE} fill={i % 2 ? '#FFFFFF' : a.horn} transform={`translate(${x} -10) scale(0.8)`} />
        </g>
      ))}
    </svg>
  )
}

export function UnicornScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A unicorn under a rainbow">
      <defs><linearGradient id={`${u}sky2`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></linearGradient></defs>
      <rect width="360" height="320" fill={`url(#${u}sky2)`} />
      <Sparkle x={40} y={44} s={1} fill="#FFFFFF" />
      <Sparkle x={318} y={70} s={0.9} fill={a.horn} delay={600} />
      <Sparkle x={250} y={36} s={0.6} fill="#FFFFFF" delay={1300} />
      <Rainbow a={a} cx={194} cy={276} outer={168} band={13} />
      <Cloud x={272} y={272} s={1.05} />
      <text x="204" y="222" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 76 : 112} fontWeight="800" fill={a.num} stroke="#FFFFFF" strokeWidth="7" paintOrder="stroke" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      <g transform="translate(66 208) scale(1.12)"><g className="kx-bob"><UnicornHead u={u} a={a} ink={a.ink} /></g></g>
    </svg>
  )
}

/** The child as a unicorn: their photo with a golden horn, ears and a flower crown. */
export function UnicornPhoto({ u, a, href, mark }: { u: string; a: Art; href: string; mark: string }) {
  const ink = a.ink
  const mane = a.rainbow.split(',')
  return (
    <svg viewBox="0 0 320 320" className="block h-auto w-full" role="img" aria-label="The birthday child with a unicorn horn and a flower crown">
      <Rainbow a={a} cx={160} cy={250} outer={156} band={11} />
      <Cloud x={-4} y={262} s={1} />
      <Cloud x={232} y={262} s={1} />
      <g>
        <path d="M100 96 L92 46 L134 78 Z" fill="#FFFFFF" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M104 86 L100 60 L122 78 Z" fill="#FFC6DA" />
        <path d="M220 96 L228 46 L186 78 Z" fill="#FFFFFF" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M216 86 L220 60 L198 78 Z" fill="#FFC6DA" />
      </g>
      <circle cx="160" cy="170" r="98" fill="#FFFFFF" />
      <circle cx="160" cy="170" r="98" fill="none" stroke={a.ring} strokeWidth="6" />
      <PhotoCircle u={u} href={href} cx={160} cy={170} r={88} />
      <g>
        <defs><clipPath id={`${u}horn2`}><path d="M144 76 L160 6 L176 76 Z" /></clipPath></defs>
        <path d="M144 76 L160 6 L176 76 Z" fill={a.horn} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <g clipPath={`url(#${u}horn2)`} stroke={a.hornStripe} strokeWidth="4"><path d="M140 62 L182 50 M144 44 L180 32 M150 26 L176 18" /></g>
      </g>
      {[[104, 92], [122, 80], [142, 74], [178, 74], [198, 80], [216, 92]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy="-7" rx="5" ry="7" fill={mane[i % mane.length]} transform={`rotate(${r})`} />)}
          <circle cx="0" cy="0" r="4" fill="#FFE27A" />
        </g>
      ))}
      <g>
        <circle cx="262" cy="250" r="30" fill={a.num} stroke="#FFFFFF" strokeWidth="5" />
        <text x="262" y="252" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 26 : 34} fontWeight="800" fill="#FFFFFF" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
      <Sparkle x={40} y={60} s={1} fill={a.horn} />
      <Sparkle x={282} y={40} s={0.8} fill="#FFFFFF" delay={700} />
      <Sparkle x={292} y={150} s={0.6} fill={a.horn} delay={1400} />
    </svg>
  )
}

// ─── Jungle ─────────────────────────────────────────────────────────────────

function Giraffe({ u, a, ink }: { u: string; a: Art; ink: string }) {
  return (
    <g>
      <defs><clipPath id={`${u}neck`}><path d="M290 320 Q292 230 296 150 L322 146 Q322 230 330 320 Z" /></clipPath></defs>
      <path d="M290 320 Q292 230 296 150 L322 146 Q322 230 330 320 Z" fill={a.giraffe} />
      <g clipPath={`url(#${u}neck)`} fill={a.patch}>
        <rect x="296" y="168" width="14" height="12" rx="4" /><rect x="311" y="192" width="12" height="14" rx="4" /><rect x="295" y="212" width="14" height="13" rx="4" />
        <rect x="312" y="238" width="13" height="13" rx="4" /><rect x="296" y="262" width="14" height="14" rx="4" /><rect x="313" y="288" width="13" height="12" rx="4" />
      </g>
      <path d="M302 114 L298 94 M316 116 L318 96" stroke={a.patch} strokeWidth="5" strokeLinecap="round" />
      <circle cx="298" cy="93" r="5" fill={a.dark} /><circle cx="318" cy="95" r="5" fill={a.dark} />
      <ellipse cx="332" cy="118" rx="12" ry="5" transform="rotate(-24 332 118)" fill={a.giraffe} />
      <ellipse cx="306" cy="128" rx="28" ry="17" transform="rotate(-12 306 128)" fill={a.giraffe} />
      <ellipse cx="282" cy="137" rx="15" ry="12" fill={a.muzzle} />
      <circle cx="301" cy="123" r="3.6" fill={ink} /><circle cx="302.2" cy="121.8" r="1.2" fill="#FFFFFF" />
      <path d="M272 143 Q279 148 287 144" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </g>
  )
}

function Savanna({ u, a, mark, ink }: { u: string; a: Art; mark?: string; ink: string }) {
  return (
    <>
      <defs><linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></linearGradient></defs>
      <rect width="360" height="320" fill={`url(#${u}sky)`} />
      <circle cx="172" cy="150" r="88" fill={a.sun} />
      <circle cx="172" cy="150" r="72" fill={a.sunIn} />
      <path d="M112 54 Q118 48 124 54 Q130 48 136 54 M214 40 Q219 35 224 40 Q229 35 234 40" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M0 238 Q90 222 180 232 T360 226 V320 H0 Z" fill={a.savanna} />
      <path d="M72 236 L76 186 M76 192 Q66 176 52 168 M76 190 Q88 174 104 166" stroke={a.trunk} strokeWidth="5" strokeLinecap="round" fill="none" />
      <g fill={a.tree}><ellipse cx="58" cy="164" rx="30" ry="9" /><ellipse cx="100" cy="162" rx="28" ry="8" /><ellipse cx="80" cy="154" rx="34" ry="10" /></g>
      {mark && <text x="172" y="156" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 84 : 112} fontWeight="900" fill={ink} style={{ fontFamily: 'var(--kx-display)', fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>{mark}</text>}
    </>
  )
}

function Monkey({ a, ink }: { a: Art; ink: string }) {
  return (
    <g>
      <path d="M0 0 L0 150" stroke={a.tree} strokeWidth="4" />
      <g transform="translate(0 150)">
        <path d="M18 34 Q40 40 34 62 Q30 74 20 70" stroke={a.monkey} strokeWidth="6" strokeLinecap="round" fill="none" />
        <ellipse cx="4" cy="32" rx="18" ry="22" fill={a.monkey} />
        <path d="M-2 -6 L0 14" stroke={a.monkey} strokeWidth="8" strokeLinecap="round" />
        <circle cx="-14" cy="20" r="8" fill={a.monkey} /><circle cx="22" cy="20" r="8" fill={a.monkey} />
        <circle cx="4" cy="22" r="17" fill={a.monkey} />
        <ellipse cx="4" cy="27" rx="12" ry="10" fill={a.monkeyFace} />
        <circle cx="-1" cy="22" r="2.6" fill={ink} /><circle cx="9" cy="22" r="2.6" fill={ink} />
        <path d="M-2 30 Q4 34 10 30" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

export function JungleOpening({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full overflow-hidden" aria-hidden>
      <Savanna u={u} a={a} mark={mark} ink={ink} />
      <path d="M0 270 Q120 254 240 268 T360 262 V320 H0 Z" fill={a.grass} />
      <g className="jg-swing" style={{ transformOrigin: '60px -20px' }}><g transform="translate(60 -20)"><Monkey a={a} ink={ink} /></g></g>
      <g className="jg-rawr">
        <polygon points={burst(270, 70, 12, 46, 34)} fill={a.a} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <text x="270" y="72" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="900" fill="#FFFFFF" stroke={ink} strokeWidth="1.4" paintOrder="stroke">RAWR!</text>
      </g>
      {/* The leaf curtains that part. */}
      <g className="jg-left">
        <rect x="-10" y="0" width="190" height="320" fill={a.leaf1} />
        {[[-20, 20, 30], [-30, 90, 10], [-10, 160, 30], [-30, 230, 6], [-14, 300, 24], [60, 50, 60], [70, 190, 50]].map(([x, y, r], i) => <Leaf key={i} x={x} y={y} r={r} s={1.2} fill={i % 2 ? a.leaf2 : a.leaf3} />)}
      </g>
      <g className="jg-right">
        <rect x="180" y="0" width="190" height="320" fill={a.leaf1} />
        {[[380, 20, 150], [390, 90, 170], [370, 160, 150], [390, 230, 174], [374, 300, 156], [300, 50, 120], [290, 190, 130]].map(([x, y, r], i) => <Leaf key={i} x={x} y={y} r={r} s={1.2} fill={i % 2 ? a.leaf2 : a.leaf3} />)}
      </g>
      <g className="jg-sign">
        <path d="M130 0 V64 M230 0 V64" stroke={a.trunk} strokeWidth="4" />
        <rect x="96" y="60" width="168" height="62" rx="10" fill={a.wood} stroke={a.trunk} strokeWidth="4" />
        <path d="M104 80 H256 M104 100 H256" stroke={a.trunk} strokeOpacity="0.25" strokeWidth="2" />
        <text x="180" y="92" textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="900" fill="#FFF8E7" style={{ fontFamily: 'var(--kx-display)' }}>Let’s go wild!</text>
      </g>
    </svg>
  )
}

export function JungleScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = a.ink
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A giraffe peeking past a big sun in the savanna">
      <Savanna u={u} a={a} mark={mark} ink={ink} />
      <g className="kx-sway"><Giraffe u={u} a={a} ink={ink} /></g>
      <path d="M0 270 Q120 254 240 268 T360 262 V320 H0 Z" fill={a.grass} />
      <g className="kx-rustle">
        <Leaf x={-24} y={16} r={30} fill={a.leaf1} />
        <Leaf x={-14} y={52} r={6} s={0.75} fill={a.leaf2} />
        <Leaf x={384} y={18} r={152} s={0.85} fill={a.leaf1} />
      </g>
      <Leaf x={-14} y={318} r={-34} fill={a.leaf1} />
      <Leaf x={14} y={330} r={-72} s={0.8} fill={a.leaf2} />
    </svg>
  )
}

/** The child as a little lion: their photo framed by a mane and two round ears. */
export function JunglePhoto({ u, a, href, mark }: { u: string; a: Art; href: string; mark: string }) {
  const ink = a.ink
  const petals = Array.from({ length: 18 }, (_, i) => i)
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="The birthday child framed by a lion's mane">
      <Savanna u={u} a={a} ink={ink} />
      <path d="M0 270 Q120 254 240 268 T360 262 V320 H0 Z" fill={a.grass} />
      <g className="kx-rustle">
        <Leaf x={-24} y={16} r={30} fill={a.leaf1} />
        <Leaf x={384} y={18} r={152} s={0.85} fill={a.leaf1} />
      </g>
      <g transform="translate(180 168)">
        <g className="kx-mane">
          {petals.map((i) => <path key={i} d="M-22 -86 Q-30 -118 0 -134 Q30 -118 22 -86 Z" fill={a.mane2} transform={`rotate(${i * 20})`} />)}
          {petals.map((i) => <path key={`in${i}`} d="M-18 -84 Q-22 -108 0 -118 Q22 -108 18 -84 Z" fill={a.mane1} transform={`rotate(${i * 20 + 10})`} />)}
        </g>
        <circle cx="-62" cy="-76" r="22" fill={a.dark} /><circle cx="-62" cy="-76" r="12" fill={a.muzzle} />
        <circle cx="62" cy="-76" r="22" fill={a.dark} /><circle cx="62" cy="-76" r="12" fill={a.muzzle} />
      </g>
      <circle cx="180" cy="168" r="86" fill={a.muzzle} />
      <PhotoCircle u={u} href={href} cx={180} cy={168} r={80} />
      <circle cx="180" cy="168" r="80" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <g>
        <circle cx="290" cy="262" r="30" fill={a.a} stroke="#FFFFFF" strokeWidth="5" />
        <text x="290" y="264" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 26 : 34} fontWeight="900" fill="#FFFFFF" style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      </g>
    </svg>
  )
}

// ─── Race cars ──────────────────────────────────────────────────────────────

function Car({ a, ink, mark }: { a: Art; ink: string; mark: string }) {
  return (
    <g>
      <ellipse cx="112" cy="98" rx="102" ry="7" fill="#000000" opacity="0.22" />
      <path d="M0 28 H26 V36 H0 Z M12 36 L16 48" fill={ink} stroke={ink} strokeWidth="3" />
      <path d="M6 70 L16 50 Q24 42 40 42 L84 40 L104 18 Q110 12 122 12 L148 12 Q160 12 166 22 L176 40 L206 44 Q218 46 220 58 L220 72 Q220 78 212 78 L12 78 Q6 78 6 70 Z" fill={a.car} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M110 22 L146 22 Q154 22 158 30 L163 40 L100 40 Z" fill="#BDE7FF" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="128" cy="33" r="8.5" fill={a.helmet} stroke={ink} strokeWidth="2" />
      <path d="M130 30 H137" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="20" y="64" width="190" height="5" fill="#FFFFFF" />
      <circle cx="80" cy="55" r="12.5" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
      <text x="80" y="56" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 11 : 15} fontWeight="800" fill={ink}>{mark}</text>
      {[52, 176].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="78" r="20" fill={ink} />
          <g className="kx-spin"><circle cx={cx} cy="78" r="9" fill="#C9CED8" /><path d={`M${cx - 9} 78 H${cx + 9} M${cx} 69 V87`} stroke={ink} strokeWidth="2.5" /></g>
        </g>
      ))}
    </g>
  )
}

export function RaceOpening({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = '#14161C'
  return (
    <svg viewBox="0 0 360 340" className="block h-auto w-full overflow-hidden" aria-hidden>
      <defs>
        <linearGradient id={`${u}dusk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B2034" /><stop offset="1" stopColor="#3A3F55" /></linearGradient>
        <pattern id={`${u}chk`} width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#FFFFFF" /><rect width="6" height="6" fill={ink} /><rect x="6" y="6" width="6" height="6" fill={ink} /></pattern>
      </defs>
      <rect width="360" height="340" fill={`url(#${u}dusk)`} />
      {STARS.slice(0, 24).map((s, i) => <circle key={i} cx={s.x.toFixed(1)} cy={(s.y * 0.3).toFixed(1)} r={(s.s * 0.8).toFixed(2)} fill="#FFFFFF" opacity={(s.o * 0.7).toFixed(2)} />)}
      {/* The start lights. */}
      <rect x="30" y="40" width="300" height="10" fill="#0B0D12" />
      <path d="M50 50 V20 M310 50 V20" stroke="#0B0D12" strokeWidth="6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${66 + i * 57} 50)`}>
          <rect x="-22" y="0" width="44" height="78" rx="10" fill="#0B0D12" />
          <circle cx="0" cy="22" r="14" className={`rc-light rc-l${i}`} />
          <circle cx="0" cy="56" r="14" className={`rc-light rc-l${i}`} />
        </g>
      ))}
      <path d="M0 238 Q180 214 360 238 V340 H0 Z" fill="#2E323C" />
      <path d="M0 238 Q180 214 360 238" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      <path d="M0 238 Q180 214 360 238" stroke={a.kerb} strokeWidth="6" strokeDasharray="14 14" fill="none" />
      <rect x="0" y="292" width="360" height="16" fill={`url(#${u}chk)`} opacity="0.9" />
      <g className="rc-lines" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round">
        <path d="M20 250 H120 M10 270 H100 M30 284 H140" />
      </g>
      <g className="rc-car"><g transform="translate(70 196)"><Car a={a} ink={ink} mark={mark} /></g></g>
    </svg>
  )
}

export function RaceScene({ u, a, mark }: { u: string; a: Art; mark: string }) {
  const ink = '#1A1D24'
  const bunting = a.bunting.split(',')
  return (
    <svg viewBox="0 0 360 320" className="block h-auto w-full" role="img" aria-label="A race car on a track under a racing number">
      <defs>
        <linearGradient id={`${u}sky2`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.sky1} /><stop offset="1" stopColor={a.sky2} /></linearGradient>
        <pattern id={`${u}chk2`} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FFFFFF" /><rect width="5" height="5" fill={ink} /><rect x="5" y="5" width="5" height="5" fill={ink} /></pattern>
      </defs>
      <rect width="360" height="320" fill={`url(#${u}sky2)`} />
      <path d="M0 8 Q180 52 360 8" stroke={ink} strokeWidth="1.5" fill="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i + 0.5) / 12
        const x = 360 * t
        const y = 8 + 88 * t * (1 - t)
        return <path key={i} d={`M${(x - 11).toFixed(1)} ${y.toFixed(1)} L${(x + 11).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y + 18).toFixed(1)} Z`} fill={bunting[i % bunting.length]} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />
      })}
      <path d="M0 238 Q60 198 140 214 T300 206 T360 214 V240 H0 Z" fill={a.hills} />
      <g className="kx-flag"><path d="M40 70 V176" stroke={ink} strokeWidth="3" strokeLinecap="round" /><path d="M40 72 Q52 66 64 72 T88 72 V102 Q76 96 64 102 T40 102 Z" fill={`url(#${u}chk2)`} stroke={ink} strokeWidth="2" /></g>
      <g className="kx-flag" style={{ animationDelay: '400ms' }}><path d="M320 70 V176" stroke={ink} strokeWidth="3" strokeLinecap="round" /><path d="M320 72 Q308 66 296 72 T272 72 V102 Q284 96 296 102 T320 102 Z" fill={`url(#${u}chk2)`} stroke={ink} strokeWidth="2" /></g>
      <circle cx="180" cy="116" r="70" fill="#FFFFFF" stroke={ink} strokeWidth="4" />
      <circle cx="180" cy="116" r="63" fill="none" stroke={ink} strokeWidth="6" strokeDasharray="9.896 9.896" />
      <circle cx="180" cy="116" r="57" fill="none" stroke={ink} strokeWidth="6" strokeDasharray="8.954 8.954" strokeDashoffset="8.954" />
      <circle cx="180" cy="116" r="52" fill="#FFFFFF" stroke={ink} strokeWidth="2.5" />
      <text x="180" y="118" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 1 ? 56 : 76} fontWeight="800" fontStyle="italic" fill={a.car} style={{ fontFamily: 'var(--kx-display)' }}>{mark}</text>
      <path d="M0 238 Q180 206 360 238 V296 Q180 268 0 296 Z" fill={a.road} />
      <path d="M0 238 Q180 206 360 238" stroke="#FFFFFF" strokeWidth="9" fill="none" />
      <path d="M0 238 Q180 206 360 238" stroke={a.kerb} strokeWidth="9" strokeDasharray="14 14" fill="none" />
      <path d="M0 268 Q180 238 360 268" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="3.5" strokeDasharray="18 16" fill="none" />
      <path d="M0 296 Q180 268 360 296 V320 H0 Z" fill={a.grass} />
      <g className="kx-drive"><g transform="translate(66 176)"><Car a={a} ink={ink} mark={mark} /></g></g>
    </svg>
  )
}
