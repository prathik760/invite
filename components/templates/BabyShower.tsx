'use client'

import { useMemo, type CSSProperties } from 'react'
import WishesSection from './WishesSection'
import { dmSerif } from './kit/fonts/dmSerif'
import { hindMadurai } from './kit/fonts/hindMadurai'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
  fitCqi,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Godh Bharai — filling the lap.
 * A pastel still life in fine plum line: a woven basket that fills with fruit
 * and flowers as the page opens, a stand of glass bangles (valaikappu) that
 * slide down one by one, knitted booties and a rattle. Blush, mint and butter
 * on warm paper; scalloped edges like a baby blanket. The ritual's name comes
 * from the host's own words (Seemantham, Valaikappu, Saadh…), else Godh Bharai.
 */

const C = {
  blush: '#F7DED7',
  blushFill: '#F1BDB6',
  rose: '#A3405F',
  paper: '#FFF8F2',
  card: '#FFFDFA',
  mint: '#D5EBDD',
  mintFill: '#A9D6BD',
  butter: '#F8E6A8',
  butterDeep: '#EDC869',
  sand: '#E8CCA8',
  plum: '#4A2744',
  plumSoft: 'rgba(74,39,68,0.76)',
  plumFaint: 'rgba(74,39,68,0.52)',
  rule: 'rgba(74,39,68,0.16)',
  glass: ['#E893A6', '#8CCAAD', '#EFC553', '#B998CB'],
}

const display = dmSerif.style.fontFamily
const sans = hindMadurai.style.fontFamily
const LINE = C.plum
const SW = 1.5

const f1 = (n: number) => n.toFixed(1)

/** The host's own name for the ritual, from anything they typed. */
function ritualOf(...texts: (string | undefined)[]): string {
  const t = texts.filter(Boolean).join(' ').toLowerCase()
  if (/valai\s?kaa?ppu|valaigappu|valaikapu/.test(t)) return 'Valaikappu'
  if (/s(r|h)?ee?mant(h)?am|simantham|seemandham|srimantham|simantonnayan/.test(t)) return 'Seemantham'
  if (/dohale|dohaje/.test(t)) return 'Dohale Jevan'
  if (/\b(saadh|shaadh|sadh)\b/.test(t)) return 'Saadh'
  if (/godh|god\s?bharai|godbharai/.test(t)) return 'Godh Bharai'
  if (/baby\s?shower/.test(t)) return 'Baby Shower'
  return 'Godh Bharai'
}

/** "Dr. Ananya Rao" -> "Ananya", for the friendlier lines. */
function firstName(name: string): string {
  const bare = name.replace(/^((dr|mrs|mr|ms|smt|shrimati|shri|sri|miss|prof)\.?\s+)+/i, '').trim()
  return bare.split(/\s+/)[0] || name
}

// ─── Line art ───────────────────────────────────────────────────────────────

type Kind = 'flower' | 'coconut' | 'bangles' | 'rattle' | 'mango' | 'bootie'

/** A five-petal blossom centred on the origin. */
function Blossom({ x, y, r = 4.4, fill = C.card, rot = 0 }: { x: number; y: number; r?: number; fill?: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.95} rx={r * 0.62} ry={r} transform={`rotate(${a})`} fill={fill} stroke={LINE} strokeWidth={0.9} />
      ))}
      <circle r={r * 0.45} fill={C.butterDeep} stroke={LINE} strokeWidth={0.8} />
    </g>
  )
}

/** Knitted bootie, toe to the left, sole on y = 0. */
function Bootie({ x, y, scale = 1, fill = C.mintFill }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M-30 -2C-36 -6 -34 -18 -24 -20C-16 -22 -9 -22 -4 -27L-5 -44C3 -48 14 -48 21 -45L21 -8C21 -2 17 0 12 0L-26 0C-28 0 -30 -1 -30 -2Z"
        fill={fill}
        stroke={LINE}
        strokeWidth={SW}
      />
      <path d="M-4.5 -32C3 -34.5 14 -34.5 21 -32" fill="none" stroke={LINE} strokeWidth={1.1} />
      {[-1, 3.5, 8, 12.5, 17].map((rx) => (
        <path key={rx} d={`M${rx} -44.5V-33.5`} stroke={LINE} strokeWidth={0.8} opacity={0.7} />
      ))}
      <path d="M-28 -4.5C-14 -3 4 -3 20 -5" fill="none" stroke={LINE} strokeWidth={0.8} opacity={0.6} />
      <g transform="translate(-9 -25) rotate(-14)">
        <path d="M0 0C-3 -5 -9 -6 -9 -1C-9 3 -4 3 0 0ZM0 0C3 -5 9 -6 9 -1C9 3 4 3 0 0Z" fill={C.blushFill} stroke={LINE} strokeWidth={0.9} />
        <circle r="1.6" fill={C.blushFill} stroke={LINE} strokeWidth={0.8} />
      </g>
    </g>
  )
}

/** Small drawings for the programme. */
function Motif({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} fill="none" aria-hidden strokeLinejoin="round" strokeLinecap="round">
      {kind === 'flower' && (
        <>
          <path d="M22 30C21 35 19 38 16 40" stroke={LINE} strokeWidth={1.2} />
          <path d="M18.5 36C14 36 11 34 10 31C14 30.5 17 32 18.5 36Z" fill={C.mintFill} stroke={LINE} strokeWidth={1.1} />
          <Blossom x={22} y={20} r={6.4} fill={C.blushFill} rot={8} />
        </>
      )}
      {kind === 'coconut' && (
        <>
          <circle cx="22" cy="25" r="13" fill={C.sand} stroke={LINE} strokeWidth={1.3} />
          <path d="M14 20C16 17 19 15.5 22 15.5M13 27C15 23 18 21 21 20.5M17 34C19 30 23 28 27 27.5" stroke={LINE} strokeWidth={0.8} opacity={0.6} />
          <path d="M22 12C21 8 19 6 17 5M22 12C22.5 8 24 6 26.5 4.5M22 12C23.5 9.5 26 9 28.5 9" stroke={LINE} strokeWidth={1.1} />
        </>
      )}
      {kind === 'bangles' && (
        <>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="22" cy={30 - i * 7} rx="14" ry="4.4" stroke={LINE} strokeWidth={4.6} />
          ))}
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="22" cy={30 - i * 7} rx="14" ry="4.4" stroke={C.glass[i]} strokeWidth={3} />
          ))}
        </>
      )}
      {kind === 'rattle' && (
        <>
          <path d="M26 24L36 38" stroke={LINE} strokeWidth={5} />
          <path d="M26 24L36 38" stroke={C.butterDeep} strokeWidth={2.8} />
          <circle cx="37.5" cy="40" r="2.6" stroke={LINE} strokeWidth={1.1} fill={C.card} />
          <circle cx="20" cy="16" r="11" fill={C.blushFill} stroke={LINE} strokeWidth={1.3} />
          <path d="M11 13.5C16 17 22 18.5 29.5 17.5M12.5 21C16 23 20 23.8 24 23.5" stroke={LINE} strokeWidth={0.9} />
        </>
      )}
      {kind === 'mango' && (
        <>
          <path d="M22 12C31 12 36 20 34.5 27C33 34 25 37 17.5 35C10 33 7 25 10.5 19C13 14.5 17 12 22 12Z" fill="#F6C878" stroke={LINE} strokeWidth={1.3} />
          <path d="M22 12C22.5 9.5 23.5 8 25 7" stroke={LINE} strokeWidth={1.2} />
          <path d="M24.5 8.5C28 4.5 33 4 36 5.5C33.5 9 29 10.5 24.5 8.5Z" fill={C.mintFill} stroke={LINE} strokeWidth={1.1} />
          <path d="M14 22C15 19 17 17 19.5 16" stroke="#FFFFFF" strokeWidth={1.4} opacity={0.8} />
        </>
      )}
      {kind === 'bootie' && (
        <g transform="translate(24 38) scale(0.62)">
          <Bootie x={0} y={0} />
        </g>
      )}
    </svg>
  )
}

function motifFor(title: string, i: number): Kind {
  const t = title.toLowerCase()
  if (/bangle|valai|chud/.test(t)) return 'bangles'
  if (/lunch|dinner|food|meal|tea|brunch|snack|bhoj|feast|sadya|sweets/.test(t)) return 'mango'
  if (/game|gift|fun|music|dance|photo/.test(t)) return 'rattle'
  if (/ritual|godh|bharai|pooja|puja|aarti|seemant|blessing|haldi|kumkum|oti/.test(t)) return 'coconut'
  if (/welcome|mehendi|mehndi|arrival|flower/.test(t)) return 'flower'
  return (['flower', 'bangles', 'mango', 'rattle', 'bootie'] as Kind[])[i % 5]
}

/** Point and tangent angle on a cubic Bézier. */
function cubicAt(p: number[][], t: number) {
  const u = 1 - t
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0]
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0])
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1])
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}

const HANDLE = [[112, 176], [106, 66], [254, 66], [248, 176]]
const BODY = 'M104 172C108 206 116 236 136 245Q180 256 224 245C244 236 252 206 256 172A76 12 0 0 1 104 172Z'

/**
 * The basket, the bangle stand, booties and a rattle. When `animate`, fruit
 * drops into the basket and bangles slide down the stand — the lap being filled.
 */
function Scene({ animate }: { animate: boolean }) {
  const ribs = Array.from({ length: 11 }, (_, k) => k / 10)
  const ribX = (t: number, y: number) => {
    const k = (y - 172) / (250 - 172)
    return 104 + 152 * t + (32 - 64 * t) * k
  }
  const rows = [190, 205, 220, 234]
  const bangles = Array.from({ length: 12 }, (_, i) => ({ y: 240 - i * 8.6, color: C.glass[i % 4], i }))
  const bx = 52
  const drop = (delay: number, cls = 'bs-fruit'): { className?: string; style?: CSSProperties } =>
    animate ? { className: cls, style: { animationDelay: `${delay}ms` } } : {}

  // Jasmine buds along the sagging garland.
  const buds = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20
    const x = 108 + 144 * t
    const y = 180 + 15 * Math.sin(Math.PI * t) + (i % 2 ? 1.2 : -1.2)
    return { x, y, rot: -40 + t * 80 + (i % 3) * 12 }
  })

  const ellipsePt = (cx: number, cy: number, rx: number, ry: number, a: number) => `${f1(cx + rx * Math.cos(a))} ${f1(cy + ry * Math.sin(a))}`

  return (
    <svg viewBox="4 76 352 184" className="block w-full" aria-hidden style={{ overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id="bs-body">
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* ground */}
      <ellipse cx="52" cy="251" rx="30" ry="4.5" fill={C.mintFill} opacity={0.55} />
      <ellipse cx="182" cy="251" rx="86" ry="6" fill={C.mintFill} opacity={0.55} />
      <ellipse cx="316" cy="251" rx="36" ry="4.5" fill={C.mintFill} opacity={0.55} />

      {/* ── bangle stand ── */}
      <ellipse cx={bx} cy="247" rx="21" ry="5.5" fill={C.sand} stroke={LINE} strokeWidth={SW} />
      {bangles.map((b) => (
        <path
          key={`b${b.i}`}
          d={`M${bx - 21} ${f1(b.y)}A21 5.4 0 0 1 ${bx + 21} ${f1(b.y)}`}
          fill="none"
          stroke={LINE}
          strokeWidth={5.6}
          {...drop(80 + (11 - b.i) * 55, 'bs-bangle')}
        />
      ))}
      {bangles.map((b) => (
        <path
          key={`bc${b.i}`}
          d={`M${bx - 21} ${f1(b.y)}A21 5.4 0 0 1 ${bx + 21} ${f1(b.y)}`}
          fill="none"
          stroke={b.color}
          strokeWidth={3.6}
          {...drop(80 + (11 - b.i) * 55, 'bs-bangle')}
        />
      ))}
      <rect x={bx - 2.6} y="114" width="5.2" height="133" rx="1.5" fill={C.sand} stroke={LINE} strokeWidth={SW} />
      <circle cx={bx} cy="110" r="6" fill={C.sand} stroke={LINE} strokeWidth={SW} />
      {bangles.map((b) => (
        <g key={`f${b.i}`} {...drop(80 + (11 - b.i) * 55, 'bs-bangle')}>
          <path d={`M${bx - 21} ${f1(b.y)}A21 5.4 0 0 0 ${bx + 21} ${f1(b.y)}`} fill="none" stroke={LINE} strokeWidth={5.6} />
          <path d={`M${bx - 21} ${f1(b.y)}A21 5.4 0 0 0 ${bx + 21} ${f1(b.y)}`} fill="none" stroke={b.color} strokeWidth={3.6} />
          <path
            d={`M${ellipsePt(bx, b.y, 21, 5.4, 2.3)}A21 5.4 0 0 0 ${ellipsePt(bx, b.y, 21, 5.4, 1.75)}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1}
            opacity={0.85}
          />
        </g>
      ))}

      {/* ── basket: handle and back rim ── */}
      <path d="M112 176C106 66 254 66 248 176" fill="none" stroke={LINE} strokeWidth={11} />
      <path d="M112 176C106 66 254 66 248 176" fill="none" stroke={C.butter} strokeWidth={8} />
      {Array.from({ length: 17 }, (_, i) => {
        const p = cubicAt(HANDLE, 0.06 + i * 0.055)
        return <path key={i} d="M-3 -3.6L3 3.6" transform={`translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(p.a)})`} stroke={LINE} strokeWidth={0.9} />
      })}
      <ellipse cx="180" cy="172" rx="76" ry="12" fill={C.butterDeep} stroke={LINE} strokeWidth={SW} />
      <ellipse cx="180" cy="173" rx="68" ry="8.5" fill="#D9A94B" opacity={0.55} />

      {/* ── what fills the lap ── */}
      <g {...drop(760)}>
        {[
          { x: 132, y: 176, r: -38 },
          { x: 142, y: 174, r: -16 },
          { x: 234, y: 174, r: 34 },
        ].map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
            <path d="M0 0C-10 2 -21 -6 -21 -19C-21 -31 -9 -41 0 -54C9 -41 21 -31 21 -19C21 -6 10 2 0 0Z" fill={i === 1 ? '#BFE2CD' : C.mintFill} stroke={LINE} strokeWidth={SW} />
            <path d="M0 -2V-48M0 -14C-6 -16 -11 -21 -14 -27M0 -14C6 -16 11 -21 14 -27M0 -28C-4 -30 -7 -33 -9 -37M0 -28C4 -30 7 -33 9 -37" fill="none" stroke={LINE} strokeWidth={0.75} opacity={0.6} />
          </g>
        ))}
      </g>
      <g {...drop(900)}>
        <path d="M183 108C199 109 211 125 210 143C209 160 198 170 183 170C168 170 157 160 156 143C155 125 167 109 183 108Z" fill="#DDB68C" stroke={LINE} strokeWidth={SW} />
        <path d="M168 124l4 3M163 138l5 1M166 153l4 -2M175 162l2 -4M195 118l-3 4M202 131l-5 2M204 147l-4 -1M197 160l-2 -4M176 118l2 4M189 164l0 -4" fill="none" stroke={LINE} strokeWidth={0.9} opacity={0.5} />
        <path d="M183 110C180 102 175 98 169 96M183 110C183 101 185 96 190 92.5M183 110C187 104 193 102 199 103M183 110C179 105 173 104 168 105.5" fill="none" stroke={LINE} strokeWidth={1.2} />
        <ellipse cx="183" cy="141" rx="2.6" ry="5" fill={C.rose} />
        <circle cx="183" cy="151" r="2" fill={C.butterDeep} />
      </g>
      <g {...drop(1040)}>
        <circle cx="226" cy="152" r="20" fill="#EE9FA5" stroke={LINE} strokeWidth={SW} />
        <path d="M219 133.5L221 128L224 132L226.5 127L229 132L232 128L233.5 133.5" fill="#EE9FA5" stroke={LINE} strokeWidth={1.2} />
        <path d="M213 147C214.5 142 218 139 222 138" fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.7} />
      </g>
      <g {...drop(1180)}>
        <g transform="translate(153 160) rotate(-18)">
          <path d="M0 -16C14 -16 22 -4 20 6C18 16 6 20 -6 17C-18 14 -22 0 -16 -9C-12 -14 -6 -16 0 -16Z" fill="#F6C878" stroke={LINE} strokeWidth={SW} />
          <path d="M0 -16C0.5 -19.5 2 -21.5 4 -22.5" fill="none" stroke={LINE} strokeWidth={1.2} />
          <path d="M3 -21C8 -27 15 -28 20 -26C16.5 -20.5 10 -18.5 3 -21Z" fill={C.mintFill} stroke={LINE} strokeWidth={1.2} />
          <path d="M-12 -5C-10.5 -9 -7 -12 -3 -13" fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.75} />
        </g>
      </g>
      <g {...drop(1320)}>
        {[
          [214, 167],
          [228, 170],
          [221, 160],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6.6" fill={C.butterDeep} stroke={LINE} strokeWidth={1.2} />
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={x - 3 + ((k * 7 + i * 3) % 6)} cy={y - 3 + ((k * 5 + i) % 6)} r="0.8" fill={LINE} opacity={0.5} />
            ))}
          </g>
        ))}
        <Blossom x={196} y={168} r={5} fill={C.card} rot={10} />
        <Blossom x={176} y={171} r={4.4} fill={C.blushFill} rot={30} />
      </g>

      {/* ── basket front: woven body and rim ── */}
      <path d={BODY} fill={C.butter} stroke={LINE} strokeWidth={SW} />
      <g clipPath="url(#bs-body)" stroke={LINE} fill="none">
        {ribs.slice(1, -1).map((t) => (
          <path key={t} d={`M${f1(ribX(t, 176))} 176L${f1(ribX(t, 252))} 252`} strokeWidth={0.9} opacity={0.75} />
        ))}
        {rows.map((y, r) => (
          <path
            key={y}
            strokeWidth={1}
            d={ribs
              .slice(0, -1)
              .map((t, k) => {
                const x0 = ribX(t, y)
                const x1 = ribX(ribs[k + 1], y)
                const lift = (k + r) % 2 ? 3.2 : -3.2
                return `${k === 0 ? `M${f1(x0 - 6)} ${y}L${f1(x0)} ${y}` : ''}Q${f1((x0 + x1) / 2)} ${f1(y + lift)} ${f1(x1)} ${y}`
              })
              .join('')}
          />
        ))}
      </g>
      <path d="M104 172A76 12 0 0 0 256 172" fill="none" stroke={LINE} strokeWidth={9} />
      <path d="M104 172A76 12 0 0 0 256 172" fill="none" stroke={C.butterDeep} strokeWidth={6.4} />

      {/* jasmine draped over the rim */}
      <path d="M106 179Q180 212 254 179" fill="none" stroke={LINE} strokeWidth={0.8} opacity={0.7} />
      {buds.map((b, i) => (
        <ellipse key={i} cx={f1(b.x)} cy={f1(b.y)} rx="3.4" ry="2.3" transform={`rotate(${f1(b.rot)} ${f1(b.x)} ${f1(b.y)})`} fill={C.card} stroke={LINE} strokeWidth={0.8} />
      ))}
      <path d="M254 179C257 186 256 193 252 199M254 179C259 184 262 189 262 195" fill="none" stroke={LINE} strokeWidth={0.8} />
      <ellipse cx="252" cy="201" rx="2.6" ry="3.4" fill={C.card} stroke={LINE} strokeWidth={0.8} />
      <ellipse cx="262" cy="197" rx="2.6" ry="3.4" fill={C.card} stroke={LINE} strokeWidth={0.8} />

      {/* bow on the handle */}
      <g transform="translate(180 94)">
        <path d="M0 2C-3 9 -6 15 -10 21L-5 19.5L-3 24C0 17 1 10 0 2ZM0 2C3 9 6 15 9 21L4.5 19.8L3 24C0 17 -1 10 0 2Z" fill={C.blushFill} stroke={LINE} strokeWidth={1.1} />
        <path d="M0 0C-5 -9 -19 -12 -19 -2C-19 7 -7 6 0 0ZM0 0C5 -9 19 -12 19 -2C19 7 7 6 0 0Z" fill={C.blushFill} stroke={LINE} strokeWidth={1.3} />
        <path d="M-5 -2C-9 -5 -13 -5 -15 -3M5 -2C9 -5 13 -5 15 -3" fill="none" stroke={LINE} strokeWidth={0.7} opacity={0.6} />
        <ellipse rx="3.6" ry="4" fill={C.blushFill} stroke={LINE} strokeWidth={1.2} />
      </g>

      {/* ── booties and rattle ── */}
      <Bootie x={333} y={243} scale={0.9} fill="#C3E3D0" />
      <Bootie x={314} y={249} />
      <g>
        <path d="M272 219L290 247" stroke={LINE} strokeWidth={6.6} />
        <path d="M272 219L290 247" stroke={C.butterDeep} strokeWidth={4} />
        <circle cx="292.5" cy="251" r="4.6" fill={C.card} stroke={LINE} strokeWidth={1.3} />
        <circle cx="266" cy="207" r="14.5" fill={C.blushFill} stroke={LINE} strokeWidth={SW} />
        <path d="M253 202C258 207 266 209 278.5 207.5M254.5 212C259 215 265 216 272 215" fill="none" stroke={LINE} strokeWidth={1} />
        <path d="M258 199C259.5 196 262 194 265 193.5" fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.8} />
        <circle cx="266" cy="191.5" r="2.6" fill={C.butterDeep} stroke={LINE} strokeWidth={1} />
      </g>
    </svg>
  )
}

/** A glass bangle around the countdown's number. */
function BangleRing({ className }: { className?: string }) {
  const dots = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2)
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none">
      <circle cx="100" cy="100" r="84" stroke={LINE} strokeWidth={17} />
      <circle cx="100" cy="100" r="84" stroke={C.glass[0]} strokeWidth={14} />
      <circle cx="100" cy="100" r="84" stroke="#FFFFFF" strokeWidth={1} opacity={0.35} strokeDasharray="2 7" />
      {dots.map((a, i) => (
        <circle key={i} cx={f1(100 + 84 * Math.cos(a))} cy={f1(100 + 84 * Math.sin(a))} r={i % 2 ? 1.3 : 2.1} fill={C.butter} />
      ))}
      <path d="M36 62A76 76 0 0 1 70 27" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.75} />
    </svg>
  )
}

/** Circles along the inside of the box — unioned, a scalloped mat. */
function ScallopClip({ id, aspect }: { id: string; aspect: number }) {
  const rx = 0.045
  const ry = rx * aspect
  const along = (from: number, to: number, r: number) => {
    const n = Math.max(2, Math.round((to - from) / (r * 1.7)) + 1)
    return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1))
  }
  const xs = along(rx, 1 - rx, rx)
  const ys = along(ry, 1 - ry, ry)
  const pts = [
    ...xs.map((x) => [x, ry]),
    ...xs.map((x) => [x, 1 - ry]),
    ...ys.slice(1, -1).map((y) => [rx, y]),
    ...ys.slice(1, -1).map((y) => [1 - rx, y]),
  ]
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <rect x={rx} y={ry} width={1 - 2 * rx} height={1 - 2 * ry} />
        {pts.map(([x, y], i) => (
          <ellipse key={i} cx={x.toFixed(4)} cy={y.toFixed(4)} rx={rx} ry={ry.toFixed(4)} />
        ))}
      </clipPath>
    </svg>
  )
}

/** Half-circles hanging from the section above, like a blanket's edge. */
const scallopEdge = (color: string, r = 11): CSSProperties => ({
  height: r,
  backgroundImage: `radial-gradient(circle at ${r}px 0, ${color} ${r - 0.6}px, transparent ${r}px)`,
  backgroundSize: `${r * 2}px ${r}px`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'center top',
})

// ─── Template ───────────────────────────────────────────────────────────────

export default function BabyShower({ data, eventId, isPreview = false }: InviteProps) {
  const mother = data.motherName?.trim() || 'Riya'
  const hosts = data.hostNames?.trim() || ''
  const ritual = ritualOf(data.schedule, data.message, data.dressCode)
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const photo = data.motherPhoto && /^(https?:)?\//.test(data.motherPhoto) ? data.motherPhoto : null
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(`${ritual} of ${mother}`, data.date, data.time, place, 4)

  const longest = Math.max(...mother.split(/\s+/).map((w) => w.length), 1)
  const nameCqi = Math.min(24, 88 / (longest * 0.56))
  const nameSize = `clamp(20px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.3)}px)`

  const WISHES_THEME: InviteTheme = {
    bg: C.paper,
    surface: C.card,
    ink: C.plum,
    muted: C.plumSoft,
    line: '#EDD6CF',
    accent: C.plum,
    onAccent: '#FFFFFF',
    heading: display,
    body: sans,
    headingStyle: { fontSize: 'clamp(28px, 9cqi, 36px)', fontWeight: 400 },
  }

  const button = 'bs-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold'
  const tagCut = (c: number) => `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, 0 100%, 0 ${c}px)`

  return (
    <div
      className="bs relative overflow-x-hidden"
      style={{ backgroundColor: C.paper, color: C.plum, fontFamily: sans, containerType: 'inline-size' }}
    >
      <style>{`
        .bs .bs-bangle { animation: bs-bangle 560ms cubic-bezier(.3,.8,.35,1) both; }
        .bs .bs-fruit { animation: bs-fruit 820ms cubic-bezier(.35,.9,.4,1) both; }
        @keyframes bs-bangle {
          0% { transform: translateY(-58px); opacity: 0; }
          35% { opacity: 1; }
          78% { transform: translateY(1.6px); }
          100% { transform: none; opacity: 1; }
        }
        @keyframes bs-fruit {
          0% { transform: translateY(-96px); opacity: 0; }
          30% { opacity: 1; }
          62% { transform: translateY(4px); }
          80% { transform: translateY(-3px); }
          100% { transform: none; opacity: 1; }
        }
        .bs .bs-btn { transition: opacity 160ms ease, transform 160ms ease; }
        .bs .bs-btn:hover { opacity: .9; }
        .bs .bs-btn:active { transform: translateY(1px); }
        @media (prefers-reduced-motion: reduce) {
          .bs .bs-bangle, .bs .bs-fruit { animation: none; }
        }
      `}</style>

      <ScallopClip id="bs-mat" aspect={4 / 5} />
      <ScallopClip id="bs-oval" aspect={5 / 6} />

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.plum} background="rgba(255,248,242,0.9)" border={C.rule} />

      {/* ── The lap, being filled ─────────────────────────────────── */}
      <section
        className="relative px-5 pb-14 pt-10 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh', backgroundColor: C.blush, ...grain(0.05) }}
      >
        <div className="mx-auto w-full max-w-[27rem]">
          <div className="flex items-center justify-center gap-3">
            <svg viewBox="0 0 40 12" className="h-3 w-10" aria-hidden fill="none">
              <path d="M0 6H26" stroke={C.plumFaint} strokeWidth={1} />
              <ellipse cx="32" cy="6" rx="6" ry="4" stroke={C.glass[1]} strokeWidth={2.2} />
            </svg>
            <p style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(24px, 7.6cqi, 30px)', color: C.rose, lineHeight: 1.1 }}>
              {ritual}
            </p>
            <svg viewBox="0 0 40 12" className="h-3 w-10" aria-hidden fill="none" style={{ transform: 'scaleX(-1)' }}>
              <path d="M0 6H26" stroke={C.plumFaint} strokeWidth={1} />
              <ellipse cx="32" cy="6" rx="6" ry="4" stroke={C.glass[0]} strokeWidth={2.2} />
            </svg>
          </div>

          <div className="mx-auto mt-5 w-full max-w-[380px]">
            <Scene animate={!isPreview} />
          </div>

          <p className="mx-auto mt-7 max-w-[20rem] leading-[1.45]" style={{ fontSize: 16.5, color: C.plumSoft, textWrap: 'balance' }}>
            {hosts ? (
              <>
                <span style={{ color: C.plum, fontWeight: 600 }}>{hosts}</span> invite you to shower blessings on
              </>
            ) : (
              'You are invited to shower blessings on'
            )}
          </p>
          <h1 className="mt-2 break-words leading-[0.98]" style={{ fontFamily: display, fontSize: nameSize, fontWeight: 400, letterSpacing: '-0.01em' }}>
            {mother}
          </h1>
          <p className="mt-2" style={{ fontFamily: display, fontStyle: 'italic', fontSize: 'clamp(19px, 5.8cqi, 23px)', color: C.rose }}>
            and the little one on the way
          </p>

          {/* The gift tag: when & where */}
          <div className="relative mx-auto mt-10 max-w-[21.5rem]" style={{ transform: 'rotate(-1.2deg)' }}>
            <svg viewBox="0 0 120 40" className="absolute left-1/2 z-10 top-[-26px] h-[40px] w-[120px] -translate-x-1/2" aria-hidden fill="none" style={{ overflow: 'visible' }}>
              <path d="M60 44C51 30 52 14 60 4C68 14 69 30 60 44" stroke={C.rose} strokeWidth={1.6} strokeLinejoin="round" />
              <path d="M60 4C56 -2 50 -4 44 -3M60 4C63 -1 69 -3 75 -1" stroke={C.rose} strokeWidth={1.6} strokeLinecap="round" />
            </svg>
            <div style={{ clipPath: tagCut(30), background: C.plum, padding: 1.5 }}>
              <div className="px-6 pb-8 pt-12" style={{ clipPath: tagCut(29.4), background: C.butter }}>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[14px] h-[15px] w-[15px] -translate-x-1/2 rounded-full"
                  style={{ background: C.blush, boxShadow: `0 0 0 1.5px ${C.plum}, 0 0 0 4.5px ${C.card}, 0 0 0 6px ${C.plum}` }}
                />
                {date ? (
                  <>
                    <p style={{ fontSize: 16, fontWeight: 500, color: C.plumSoft }}>{date.weekday}</p>
                    <p className="mt-0.5 leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(34px, 10.6cqi, 42px)' }}>
                      {date.day} {date.month}
                    </p>
                    <p className="mt-1.5" style={{ fontSize: 17, fontWeight: 500 }}>
                      {date.year}
                      {time && <> · {time}</>}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="leading-[1.1]" style={{ fontFamily: display, fontSize: 30 }}>Date to be announced</p>
                    {time && <p className="mt-1.5" style={{ fontSize: 17, fontWeight: 500 }}>{time}</p>}
                  </>
                )}

                <div className="mx-auto my-6 h-0 w-24 border-t-[1.5px] border-dashed" style={{ borderColor: C.plumFaint }} aria-hidden />

                <p className="leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.8cqi, 26px)' }}>{data.venue || 'Venue to be announced'}</p>
                {data.venueAddress && (
                  <p className="mx-auto mt-1.5 max-w-[17rem] leading-[1.5]" style={{ fontSize: 15.5, color: C.plumSoft }}>
                    {data.venueAddress}
                  </p>
                )}
                {data.dressCode && (
                  <p className="mt-4" style={{ fontSize: 15.5, color: C.plumSoft }}>
                    Dress code · <span style={{ fontFamily: display, fontStyle: 'italic', fontSize: 18, color: C.rose }}>{data.dressCode}</span>
                  </p>
                )}

                {(directions || calendar) && (
                  <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                    <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: C.plum, color: '#FFFFFF' }}>
                      Directions
                    </DirectionsLink>
                    {calendar && (
                      <a
                        href={isPreview ? undefined : calendar}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={isPreview || undefined}
                        className={`${button} border-[1.5px]`}
                        style={{ borderColor: C.plum, color: C.plum, background: 'transparent' }}
                      >
                        Add to calendar
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div aria-hidden style={scallopEdge(C.blush)} />

      {/* ── Her photograph and a note from the family ─────────────── */}
      {(photo || data.message) && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pb-12 pt-14 text-center">
          {photo && (
            <div className="mx-auto mb-9 w-[62%] max-w-[230px] p-[11px]" style={{ clipPath: 'url(#bs-oval)', background: C.mintFill }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={mother} loading="lazy" className="block aspect-[5/6] w-full rounded-[10px] object-cover" />
            </div>
          )}
          {data.message && (
            <>
              <svg viewBox="0 0 120 26" className="mx-auto h-[26px] w-[120px]" aria-hidden fill="none">
                <path d="M4 6Q60 34 116 6" stroke={LINE} strokeWidth={0.8} opacity={0.6} />
                {Array.from({ length: 11 }, (_, i) => {
                  const t = i / 10
                  const x = 8 + 104 * t
                  const y = 7 + 11 * Math.sin(Math.PI * t)
                  return <ellipse key={i} cx={f1(x)} cy={f1(y)} rx="3.2" ry="2.2" transform={`rotate(${f1(-40 + t * 80)} ${f1(x)} ${f1(y)})`} fill={C.card} stroke={LINE} strokeWidth={0.8} />
                })}
              </svg>
              <p className="mx-auto mt-6 leading-[1.5]" style={{ fontFamily: display, fontSize: 'clamp(21px, 6.2cqi, 25px)', textWrap: 'pretty' }}>
                {data.message}
              </p>
              {hosts && <p className="mt-5" style={{ fontSize: 16, fontWeight: 500, color: C.rose }}>— {hosts}</p>}
            </>
          )}
        </Reveal>
      )}

      {/* ── Days to go, inside a glass bangle ─────────────────────── */}
      {countdown && (
        <section className="relative" style={{ backgroundColor: C.mint }}>
          <div aria-hidden style={{ ...scallopEdge(C.paper), transform: 'none' }} />
          <Reveal disabled={isPreview} className="px-6 pb-14 pt-10 text-center">
            <div className="relative mx-auto w-[200px]">
              <BangleRing className="block h-[200px] w-[200px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="leading-none tabular-nums" style={{ fontFamily: display, fontSize: 64 }}>{countdown.days}</span>
                <span className="mt-1" style={{ fontSize: 16, fontWeight: 500, color: C.plumSoft }}>{countdown.days === 1 ? 'day' : 'days'} to go</span>
              </div>
            </div>
            <p className="mt-5 tabular-nums" style={{ fontSize: 15.5, color: C.plumSoft, letterSpacing: '0.03em' }}>
              {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
            </p>
          </Reveal>
          <div aria-hidden style={{ ...scallopEdge(C.mint), position: 'absolute', left: 0, right: 0, bottom: -11 }} />
        </section>
      )}

      {/* ── The programme ─────────────────────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-8 pt-16">
          <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(30px, 9.4cqi, 38px)', fontWeight: 400 }}>The programme</h2>
          <ol className="mt-8">
            {schedule.map((item, i) => (
              <li
                key={`${item.title}-${i}`}
                className="flex items-center gap-4 py-4"
                style={{ borderTop: i ? `1.5px dotted ${C.rule}` : undefined }}
              >
                <Motif kind={motifFor(item.title, i)} className="h-11 w-11 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="leading-[1.25]" style={{ fontFamily: display, fontSize: 21 }}>{item.title}</p>
                  {item.note && <p className="mt-0.5" style={{ fontSize: 15, color: C.plumSoft }}>{item.note}</p>}
                </div>
                {item.time && (
                  <p className="shrink-0 text-right tabular-nums" style={{ fontSize: 15.5, fontWeight: 600, color: C.rose }}>{item.time}</p>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Photographs on scalloped mats ─────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-5 pb-14 pt-10">
          <Reveal disabled={isPreview}>
            <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 400 }}>A few photographs</h2>
          </Reveal>
          <div className={`mt-8 grid gap-4 ${photos.length === 1 ? 'mx-auto w-[70%] grid-cols-1' : 'grid-cols-2'}`}>
            {photos.map((src, i) => (
              <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} style={{ marginTop: photos.length > 1 && i % 2 ? 36 : 0 }}>
                <div className="p-[9px]" style={{ clipPath: 'url(#bs-mat)', background: [C.blushFill, C.mintFill, C.butterDeep][i % 3] }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-[4/5] w-full rounded-[6px] object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {eventId && (
        <div style={{ borderTop: `1px solid ${C.rule}` }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title={`Blessings for ${firstName(mother)}`}
            intro={`Leave a few words for ${firstName(mother)} and the little one. They appear here for every guest.`}
            noun="blessing"
          />
        </div>
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="relative px-6 pb-10 pt-16 text-center" style={{ backgroundColor: C.blush }}>
        <div aria-hidden className="absolute left-0 right-0 top-0" style={scallopEdge(C.paper)} />
        <Motif kind="bangles" className="mx-auto h-12 w-12" />
        {/* its own container, so a long name is sized to the footer instead of running off it */}
        <div style={{ containerType: 'inline-size', width: '100%' }}>
          <p className="mt-2" style={{ fontFamily: display, fontSize: `clamp(18px, ${fitCqi(mother, { em: 0.6, max: 30 })}cqi, 30px)` }}>{mother}</p>
        </div>
        <p className="mt-1" style={{ fontSize: 15, color: C.plumSoft }}>
          {ritual}
          {date && <> · {date.day} {date.month} {date.year}</>}
        </p>
        <div className="mt-9">
          <Credit isPreview={isPreview} color={C.plumFaint} linkColor={C.rose} />
        </div>
      </footer>
    </div>
  )
}
