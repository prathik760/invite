'use client'

import { useMemo, type CSSProperties } from 'react'
import WishesSection from './WishesSection'
import { eczar } from './kit/fonts/eczar'
import { laila } from './kit/fonts/laila'
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
} from './kit/core'
import { Credit, DirectionsLink, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Pooja — a still life on the chowki.
 * A low stool dressed in kumkum-red cloth with a turmeric zari hem; on it a
 * brass kalash with mango leaves and a coconut, a clay diya, and prasad on a
 * banana leaf. The pooja's name is set large above it, in a face that also
 * carries Devanagari. When the page opens a kolam is drawn in one line on the
 * floor in front of the chowki, and then the diya is lit. The mauli thread,
 * red and yellow, runs through the programme.
 */

const C = {
  wall: '#FAF1E1',
  paper: '#FDF8EE',
  card: '#FFFBF4',
  saffron: '#E4832A',
  saffronDeep: '#B85A14',
  kumkum: '#A8231C',
  kumkumDeep: '#861A15',
  turmeric: '#E9B535',
  turmericSoft: '#F5DB8C',
  brass: '#C9973C',
  brassDeep: '#9C6E22',
  brassLight: '#EBC872',
  leaf: '#5F8B3A',
  leafDeep: '#3F6628',
  banana: '#79A646',
  clay: '#B7602E',
  wood: '#7A4A26',
  coconut: '#946032',
  ink: '#3A2416',
  inkSoft: 'rgba(58,36,22,0.76)',
  inkFaint: 'rgba(58,36,22,0.52)',
  rule: 'rgba(58,36,22,0.15)',
  creamSoft: 'rgba(255,246,228,0.86)',
}

const display = eczar.style.fontFamily
const text = laila.style.fontFamily
const INK = C.ink
const SW = 1.3

const f1 = (n: number) => n.toFixed(1)

/** A lens-shaped leaf pointing along +x. */
function leaf(len: number, w: number) {
  return `M0 0C${f1(len * 0.3)} ${f1(-w)} ${f1(len * 0.75)} ${f1(-w * 0.8)} ${len} 0C${f1(len * 0.75)} ${f1(w * 0.8)} ${f1(len * 0.3)} ${f1(w)} 0 0Z`
}

/** A marigold head: a ruffled disc. */
function Marigold({ x, y, r, fill = C.saffron }: { x: number; y: number; r: number; fill?: string }) {
  const pts = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2
    const rr = r * (1 + 0.14 * Math.cos(a * 12))
    return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr * 0.8)}`
  })
  return (
    <g>
      <path d={`M${pts.join('L')}Z`} fill={fill} stroke={INK} strokeWidth={0.9} />
      <ellipse cx={x} cy={y - 0.4} rx={r * 0.42} ry={r * 0.32} fill={C.turmeric} stroke={INK} strokeWidth={0.7} />
    </g>
  )
}

/** The chowki and everything on it. `light` = the diya's entrance. */
function StillLife({ light }: { light: boolean }) {
  const mangoLeaves = [
    { x: 166, a: -162, l: 36 },
    { x: 170, a: -138, l: 38 },
    { x: 175, a: -114, l: 34 },
    { x: 185, a: -66, l: 34 },
    { x: 190, a: -42, l: 38 },
    { x: 194, a: -18, l: 36 },
  ]
  const zari = Array.from({ length: 24 }, (_, i) => 38 + i * (284 / 24))
  return (
    <svg viewBox="30 44 300 202" className="block w-full" aria-hidden style={{ overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="180" cy="241" rx="148" ry="5" fill={INK} opacity={0.08} />

      {/* chowki legs and cloth */}
      <rect x="52" y="212" width="12" height="28" rx="1.5" fill={C.wood} stroke={INK} strokeWidth={SW} />
      <rect x="296" y="212" width="12" height="28" rx="1.5" fill={C.wood} stroke={INK} strokeWidth={SW} />
      <path d="M64 158H296L322 180H38Z" fill={C.kumkum} stroke={INK} strokeWidth={SW} />
      <rect x="38" y="180" width="284" height="34" fill={C.kumkumDeep} stroke={INK} strokeWidth={SW} />
      <path d="M38 183H322" stroke={C.turmeric} strokeWidth={1.2} />
      <rect x="38" y="203" width="284" height="11" fill={C.turmeric} stroke={INK} strokeWidth={SW} />
      {zari.map((x, i) => (
        <g key={i}>
          <path d={`M${f1(x + 2.5)} 208.5l3.4 -3l3.4 3l-3.4 3Z`} fill={C.kumkumDeep} />
          <circle cx={f1(x + 11.2)} cy="208.5" r="0.9" fill={C.kumkumDeep} />
        </g>
      ))}
      {zari.map((x, i) => (
        <path key={i} d={`M${f1(x)} 214q5.9 5 11.83 0`} fill={C.turmeric} stroke={INK} strokeWidth={0.9} />
      ))}

      {/* rice under the kalash */}
      <path d="M142 172C150 160 210 160 218 172Z" fill="#FFF7E6" stroke={INK} strokeWidth={1} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${f1(150 + i * 4.6)} ${f1(169 - Math.sin((i / 13) * Math.PI) * 5)}l1.6 -0.6`} stroke={C.inkFaint} strokeWidth={0.8} />
      ))}

      {/* kalash */}
      <path d="M163 160L167 168H193L197 160Z" fill={C.brass} stroke={INK} strokeWidth={SW} />
      <path d="M160 108C140 116 136 150 156 160C166 165 194 165 204 160C224 150 220 116 200 108Z" fill={C.brass} stroke={INK} strokeWidth={SW} />
      <path d="M200 110C214 120 216 146 203 157" fill="none" stroke={C.brassDeep} strokeWidth={5} opacity={0.55} />
      <path d="M152 124C146 134 147 146 153 154" fill="none" stroke={C.brassLight} strokeWidth={3.4} />
      <path d="M147 124Q180 131 213 124" fill="none" stroke={C.brassDeep} strokeWidth={0.9} />
      <path d="M150 150Q180 157 210 150" fill="none" stroke={C.brassDeep} strokeWidth={0.9} />
      <circle cx="180" cy="138" r="5" fill={C.kumkum} />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * Math.PI * 2
        return <circle key={k} cx={f1(180 + Math.cos(a) * 9.5)} cy={f1(138 + Math.sin(a) * 9.5)} r="1.7" fill={C.turmeric} stroke={C.brassDeep} strokeWidth={0.5} />
      })}
      <path d="M166 108L164 99H196L194 108Z" fill={C.brass} stroke={INK} strokeWidth={SW} />
      <path d="M165 101.5H195M165.4 104.2H194.6" stroke={C.kumkum} strokeWidth={1.8} />
      <path d="M165.2 102.9H194.8M165.8 105.6H194.2" stroke={C.turmeric} strokeWidth={1} />

      {/* mango leaves, then the coconut */}
      {mangoLeaves.map((m, i) => (
        <g key={i} transform={`translate(${m.x} 98) rotate(${m.a})`}>
          <path d={leaf(m.l, 7.5)} fill={i % 2 ? C.leaf : '#6E9C45'} stroke={INK} strokeWidth={1.1} />
          <path d={`M2 0L${m.l - 3} 0`} stroke={C.leafDeep} strokeWidth={0.8} />
        </g>
      ))}
      <ellipse cx="180" cy="98" rx="22" ry="4.6" fill={C.brassLight} stroke={INK} strokeWidth={SW} />
      <path d="M180 54C192 56 198 68 197 80C196 91 189 97 180 97C171 97 164 91 163 80C162 68 168 56 180 54Z" fill={C.coconut} stroke={INK} strokeWidth={SW} />
      <path d="M167 84l4 0.5M171 92l2 -3M193 83l-4 1M189 92l-2 -3M166 72l3 1" stroke="#C48E57" strokeWidth={1} opacity={0.8} />
      <path d="M180 56C177 49 172 46 167 45M180 56C180 48 183 44 187 41M180 56C184 51 189 50 194 51" fill="none" stroke={INK} strokeWidth={1.3} />
      <circle cx="180" cy="71.5" r="1.9" fill={C.turmeric} />
      <ellipse cx="180" cy="80" rx="2.3" ry="4.4" fill={C.kumkum} />

      {/* diya on its plate */}
      <ellipse cx="92" cy="175" rx="30" ry="6" fill={C.brass} stroke={INK} strokeWidth={SW} />
      <g transform="translate(90 170)">
        <path d="M-24 -4C-22 8 2 12 16 2L29 -6C19 -7 12 -8 8 -8L-18 -8C-22 -8 -24 -6 -24 -4Z" fill={C.clay} stroke={INK} strokeWidth={SW} />
        <ellipse cx="-6" cy="-7" rx="14" ry="2.4" fill={C.turmeric} />
        <path d="M-18 -1C-12 3 -2 4 6 1" fill="none" stroke="#E0955E" strokeWidth={1.2} />
        <path d="M27 -6.5L28.5 -10" stroke={INK} strokeWidth={1.6} />
      </g>
      <g className={light ? 'pj-flame' : undefined}>
        <path d="M118.5 159C111.5 152 112 141 118.5 130C125 141 125.5 152 118.5 159Z" fill={C.turmeric} stroke={C.saffronDeep} strokeWidth={0.9} />
        <path d="M118.5 157C115.6 153 115.8 147 118.5 141C121.2 147 121.4 153 118.5 157Z" fill={C.saffron} />
      </g>

      {/* prasad on a banana leaf */}
      <g transform="translate(262 171)">
        <path d="M-50 4C-32 -13 22 -17 54 -8C36 9 -12 14 -50 4Z" fill={C.banana} stroke={INK} strokeWidth={SW} />
        <path d="M-47 3C-12 -4 20 -7 52 -8" fill="none" stroke={C.leafDeep} strokeWidth={1} />
        {[-30, -14, 2, 18, 34].map((x) => (
          <path key={x} d={`M${x} ${f1(-0.2 - (x + 47) * 0.1)}l6 -6M${x} ${f1(-0.2 - (x + 47) * 0.1)}l5 5`} stroke={C.leafDeep} strokeWidth={0.6} opacity={0.6} />
        ))}
        <path d="M-34 -1C-32 -16 -2 -18 0 -3Z" fill="#EDA23E" stroke={INK} strokeWidth={1.1} />
        {[[-24, -8], [-16, -12], [-9, -7], [-19, -4]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1" fill={C.saffronDeep} />
        ))}
        <path d="M-17 -14C-19 -19 -15 -22 -12 -21C-12 -17 -14 -15 -17 -14Z" fill={C.leaf} stroke={INK} strokeWidth={0.8} />
        <path d="M4 -4C8 -14 20 -18 30 -15C22 -13 14 -9 9 -2Z" fill="#F4D25A" stroke={INK} strokeWidth={1.1} />
        <path d="M8 -1C14 -9 25 -11 33 -8C25 -6 17 -3 12 2Z" fill="#F4D25A" stroke={INK} strokeWidth={1.1} />
        <circle cx="36" cy="-12" r="5.6" fill={C.saffron} stroke={INK} strokeWidth={1.1} />
        <circle cx="42" cy="-6" r="5.6" fill={C.saffron} stroke={INK} strokeWidth={1.1} />
        <path d="M34 -14l1 0.6M38 -11l1 0.6M40 -8l1 0.6M44 -5l1 0.6" stroke={C.saffronDeep} strokeWidth={1} />
      </g>

      <Marigold x={128} y={174} r={5.6} />
      <Marigold x={142} y={177.5} r={4.6} fill={C.turmeric} />
      <Marigold x={220} y={177} r={5} />
      <Marigold x={60} y={176} r={4.4} fill={C.turmeric} />
    </svg>
  )
}

/**
 * A single-line kolam around a row of dots: two strands weave over and
 * under, joined by a loop at each end, so the line never lifts.
 */
function kolamPath(n: number, s: number, x0: number, y: number, a: number) {
  const xs = Array.from({ length: n }, (_, i) => x0 + i * s)
  const A = (i: number) => y + (i % 2 === 0 ? -a : a)
  const B = (i: number) => y + (i % 2 === 0 ? a : -a)
  let d = `M${xs[0]} ${A(0)}`
  for (let i = 0; i < n - 1; i++) d += `C${f1(xs[i] + s * 0.42)} ${A(i)} ${f1(xs[i + 1] - s * 0.42)} ${A(i + 1)} ${xs[i + 1]} ${A(i + 1)}`
  d += `A${a} ${a} 0 0 ${A(n - 1) < y ? 1 : 0} ${xs[n - 1]} ${B(n - 1)}`
  for (let i = n - 1; i > 0; i--) d += `C${f1(xs[i] - s * 0.42)} ${B(i)} ${f1(xs[i - 1] + s * 0.42)} ${B(i - 1)} ${xs[i - 1]} ${B(i - 1)}`
  d += `A${a} ${a} 0 0 1 ${xs[0]} ${A(0)}Z`
  return { d, xs }
}

function Kolam({ draw, dots = 9, className }: { draw: boolean; dots?: number; className?: string }) {
  const s = 30
  const width = (dots - 1) * s + 60
  const { d, xs } = kolamPath(dots, s, 30, 24, 11)
  return (
    <svg viewBox={`0 0 ${width} 48`} className={className} aria-hidden fill="none">
      <path d={d} pathLength={1} className={draw ? 'pj-kolam' : undefined} stroke={C.saffronDeep} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x) => (
        <circle key={x} cx={x} cy="24" r="2.3" fill={C.kumkum} />
      ))}
      {xs.slice(0, -1).map((x) => (
        <g key={`c${x}`}>
          <circle cx={x + s / 2} cy="7" r="1.3" fill={C.turmeric} />
          <circle cx={x + s / 2} cy="41" r="1.3" fill={C.turmeric} />
        </g>
      ))}
    </svg>
  )
}

/** A small diya glyph for separators. */
function Diya({ className, color = C.turmeric }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 28 22" className={className} aria-hidden>
      <path d="M14 11C10.5 7.5 11 3.5 14 0.5C17 3.5 17.5 7.5 14 11Z" fill={color} />
      <path d="M2 13C4 20 24 20 26 13Z" fill={color} />
    </svg>
  )
}

/** Turmeric zari border for the red band, as a repeating tile. */
const ZARI = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='14' viewBox='0 0 24 14'><rect width='24' height='14' fill='${C.turmeric}'/><path d='M0 1.5H24M0 12.5H24' stroke='${C.kumkumDeep}' stroke-width='0.8'/><path d='M12 3.6L15.4 7L12 10.4L8.6 7Z' fill='${C.kumkumDeep}'/><circle cx='1' cy='7' r='1.1' fill='${C.kumkumDeep}'/><circle cx='23' cy='7' r='1.1' fill='${C.kumkumDeep}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

const zariBand: CSSProperties = { height: 14, backgroundImage: ZARI, backgroundRepeat: 'repeat-x', backgroundSize: '24px 14px', backgroundPosition: 'center' }

/** The mauli, twisted red and yellow, as a vertical thread. */
const mauli: CSSProperties = {
  width: 5,
  borderRadius: 3,
  backgroundImage: `repeating-linear-gradient(150deg, ${C.kumkum} 0 5px, ${C.turmeric} 5px 8px, ${C.kumkum} 8px 9px)`,
}

// ─── Template ───────────────────────────────────────────────────────────────

export default function PoojaInvite({ data, eventId, isPreview = false }: InviteProps) {
  const pooja = data.poojaName?.trim() || 'Satyanarayan Pooja'
  const hosts = data.hostNames?.trim() || ''
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const details = useMemo(
    () =>
      (data.pooja || '')
        .split(/\s*[·•|]\s*|\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [data.pooja],
  )
  const photo = data.hostPhoto && /^(https?:)?\//.test(data.hostPhoto) ? data.hostPhoto : null
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const calendar = calendarHref(hosts ? `${pooja} — ${hosts}` : pooja, data.date, data.time, place, 3)

  const words = pooja.split(/\s+/)
  const longest = Math.max(...words.map((w) => w.length), 1)
  const nameCqi = Math.min(19, 90 / (longest * 0.58))
  const nameSize = `clamp(40px, ${nameCqi.toFixed(1)}cqi, ${Math.round(nameCqi * 4.4)}px)`

  const WISHES_THEME: InviteTheme = {
    bg: C.paper,
    surface: C.card,
    ink: C.ink,
    muted: C.inkSoft,
    line: '#EBDCC3',
    accent: C.kumkum,
    onAccent: '#FFFFFF',
    heading: display,
    body: text,
    headingStyle: { fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 600 },
  }

  const button = 'pj-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[6px] px-6 text-[15.5px] font-semibold'

  return (
    <div className="pj relative overflow-x-hidden" style={{ backgroundColor: C.paper, color: C.ink, fontFamily: text, containerType: 'inline-size' }}>
      <style>{`
        .pj .pj-kolam { stroke-dasharray: 1; stroke-dashoffset: 1; animation: pj-draw 2300ms cubic-bezier(.45,.1,.35,1) 300ms forwards; }
        .pj .pj-flame { transform-origin: 118.5px 159px; transform-box: view-box; animation: pj-light 800ms cubic-bezier(.3,1.3,.5,1) 2500ms both, pj-flicker 3.2s ease-in-out 3300ms infinite; }
        @keyframes pj-draw { to { stroke-dashoffset: 0; } }
        @keyframes pj-light { from { transform: scale(0.05); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes pj-flicker {
          0%, 100% { transform: none; }
          30% { transform: scale(0.95, 1.06) skewX(-2deg); }
          62% { transform: scale(1.03, 0.96) skewX(1.5deg); }
        }
        .pj .pj-btn { transition: opacity 160ms ease; }
        .pj .pj-btn:hover { opacity: .9; }
        @media (prefers-reduced-motion: reduce) {
          .pj .pj-kolam { animation: none; stroke-dashoffset: 0; }
          .pj .pj-flame { animation: none; }
        }
      `}</style>

      {/* ── The chowki ────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-5 pb-12 pt-10 text-center"
        style={{ minHeight: isPreview ? 560 : '100svh', backgroundColor: C.wall, ...grain(0.05) }}
      >
        <div className="w-full max-w-[27rem]">
          <div className="flex items-center justify-center gap-2" aria-hidden>
            {[C.turmeric, C.kumkum, C.turmeric, C.kumkum, C.turmeric].map((c, i) => (
              <span key={i} className="rounded-full" style={{ background: c, width: i === 2 ? 8 : 6, height: i === 2 ? 8 : 6 }} />
            ))}
          </div>
          {hosts && (
            <p className="mt-5 leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(20px, 6cqi, 24px)', fontWeight: 600, color: C.kumkum }}>
              {hosts}
            </p>
          )}
          <p className="mx-auto mt-1.5 max-w-[20rem] leading-[1.45]" style={{ fontSize: 16.5, color: C.inkSoft, textWrap: 'balance' }}>
            {hosts ? 'invite you and your family for the' : 'You and your family are invited for the'}
          </p>
          <h1 className="mt-3 break-words leading-[1.02]" style={{ fontFamily: display, fontSize: nameSize, fontWeight: 700, color: C.saffronDeep, letterSpacing: '-0.01em', textWrap: 'balance' }}>
            {pooja}
          </h1>

          <div className="mx-auto mt-8 w-full max-w-[380px]">
            <StillLife light={!isPreview} />
          </div>
          <Kolam draw={!isPreview} className="mx-auto mt-3 block w-[82%] max-w-[300px]" />

          <p className="mt-6 leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.8cqi, 27px)', fontWeight: 600 }}>
            {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
          </p>
          <p className="mt-1.5" style={{ fontSize: 17, color: C.inkSoft }}>
            {[time, data.venue].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      {/* ── Pooja details, on the red cloth ───────────────────────── */}
      {details.length > 0 && (
        <section style={{ backgroundColor: C.kumkum, color: '#FFF6E4' }}>
          <div aria-hidden style={zariBand} />
          <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-10 text-center">
            {details.map((d, i) => (
              <div key={`${d}-${i}`}>
                {i > 0 && <Diya className="mx-auto my-3 h-4 w-5" />}
                <p className="leading-[1.3]" style={{ fontFamily: display, fontSize: 'clamp(20px, 6.2cqi, 24px)', fontWeight: 500 }}>{d}</p>
              </div>
            ))}
          </Reveal>
          <div aria-hidden style={zariBand} />
        </section>
      )}

      {/* ── From the family ───────────────────────────────────────── */}
      {(photo || data.message) && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-7 pb-8 pt-16 text-center">
          {photo && (
            <div
              className="mx-auto mb-8 w-[56%] max-w-[210px] rounded-full p-[5px]"
              style={{ backgroundImage: `repeating-conic-gradient(${C.kumkum} 0 7deg, ${C.turmeric} 7deg 11deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={hosts || 'The family'} loading="lazy" className="block aspect-square w-full rounded-full object-cover" style={{ border: `4px solid ${C.paper}` }} />
            </div>
          )}
          {data.message && (
            <>
              <p className="leading-[1.55]" style={{ fontSize: 'clamp(19px, 5.8cqi, 22px)', textWrap: 'pretty' }}>{data.message}</p>
              {hosts && (
                <p className="mt-5" style={{ fontFamily: display, fontSize: 20, fontWeight: 600, color: C.kumkum }}>
                  — {hosts}
                </p>
              )}
            </>
          )}
        </Reveal>
      )}

      {/* ── Days to the pooja ─────────────────────────────────────── */}
      {countdown && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[26rem] px-6 py-12 text-center">
          <Diya className="mx-auto h-6 w-8" color={C.saffron} />
          <p className="mt-3 leading-none" style={{ fontFamily: display }}>
            <span style={{ fontSize: 64, fontWeight: 700, color: C.saffronDeep }}>{countdown.days}</span>
            <span className="ml-2" style={{ fontSize: 23, fontWeight: 500 }}>{countdown.days === 1 ? 'day' : 'days'} to the pooja</span>
          </p>
          <p className="mt-3 tabular-nums" style={{ fontSize: 15.5, color: C.inkSoft, letterSpacing: '0.04em' }}>
            {countdown.hours} h · {String(countdown.minutes).padStart(2, '0')} m · {String(countdown.seconds).padStart(2, '0')} s
          </p>
        </Reveal>
      )}

      {/* ── The programme, along the mauli ────────────────────────── */}
      {schedule.length > 0 && (
        <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-6 pb-14 pt-6">
          <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 36px)', fontWeight: 600 }}>The programme</h2>
          <Kolam draw={false} dots={5} className="mx-auto mt-2 block w-[150px]" />
          <ol className="relative mt-8 pl-9">
            <span aria-hidden className="absolute bottom-2 left-[9px] top-2" style={mauli} />
            {schedule.map((item, i) => (
              <li key={`${item.title}-${i}`} className="relative pb-7 last:pb-0">
                <span
                  aria-hidden
                  className="absolute left-[-33px] top-[5px] h-[15px] w-[15px] rounded-full"
                  style={{ background: C.paper, boxShadow: `inset 0 0 0 3.5px ${i % 2 ? C.turmeric : C.kumkum}` }}
                />
                {item.time && <p className="tabular-nums" style={{ fontSize: 16, fontWeight: 600, color: C.saffronDeep }}>{item.time}</p>}
                <p className="leading-[1.3]" style={{ fontFamily: display, fontSize: 21, fontWeight: 500 }}>{item.title}</p>
                {item.note && <p className="mt-0.5" style={{ fontSize: 15, color: C.inkSoft }}>{item.note}</p>}
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* ── Where ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.wall, ...grain(0.05) }}>
        <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-6 py-16 text-center">
          <Diya className="mx-auto h-5 w-7" color={C.saffron} />
          <h2 className="mt-4 leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(28px, 9cqi, 38px)', fontWeight: 600, textWrap: 'balance' }}>
            {data.venue || 'Venue to be announced'}
          </h2>
          {data.venueAddress && (
            <p className="mx-auto mt-3 max-w-[20rem] leading-[1.55]" style={{ fontSize: 16, color: C.inkSoft }}>
              {data.venueAddress}
            </p>
          )}
          <p className="mt-4" style={{ fontSize: 17, fontWeight: 600, textWrap: 'balance' }}>
            {date ? `${date.weekday}, ${date.day} ${date.month}` : 'Date to be announced'}
            {time && ` · ${time}`}
          </p>
          {(directions || calendar) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <DirectionsLink href={directions} isPreview={isPreview} className={button} style={{ background: C.kumkum, color: '#FFFFFF' }}>
                Directions
              </DirectionsLink>
              {calendar && (
                <a
                  href={isPreview ? undefined : calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className={`${button} border-[1.5px]`}
                  style={{ borderColor: C.kumkum, color: C.kumkum }}
                >
                  Add to calendar
                </a>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {/* ── Photographs ───────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-[32rem] px-6 pb-12 pt-16">
          <Reveal disabled={isPreview}>
            <h2 className="text-center" style={{ fontFamily: display, fontSize: 'clamp(28px, 8.6cqi, 34px)', fontWeight: 600 }}>Photographs</h2>
          </Reveal>
          <div className={`mt-8 grid gap-4 ${photos.length === 1 ? 'mx-auto w-[72%] grid-cols-1' : 'grid-cols-2'}`}>
            {photos.map((src, i) => (
              <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 90} style={{ marginTop: photos.length > 1 && i % 2 ? 28 : 0 }}>
                <div className="p-[5px]" style={{ background: C.card, boxShadow: `0 0 0 1.5px ${i % 2 ? C.turmeric : C.saffron}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block aspect-[4/5] w-full object-cover" />
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
            title="Blessings & wishes"
            intro={`Can’t be there for the ${pooja.toLowerCase().includes('pooja') || pooja.toLowerCase().includes('puja') ? 'pooja' : pooja}? Leave a few words for the family — they appear here for every guest.`}
            noun="wish"
          />
        </div>
      )}

      {/* ── Foot ──────────────────────────────────────────────────── */}
      <footer className="text-center" style={{ backgroundColor: C.kumkum, color: '#FFF6E4' }}>
        <div aria-hidden style={zariBand} />
        <div className="px-6 pb-10 pt-12">
          <svg viewBox="0 0 40 46" className="mx-auto h-11 w-10" aria-hidden>
            <path d="M20 4C23 4 25 7 25 10C25 13 23 15 20 15C17 15 15 13 15 10C15 7 17 4 20 4Z" fill={C.turmericSoft} />
            <path d="M12 16C9 12 6 11 3 12M28 16C31 12 34 11 37 12" stroke={C.turmericSoft} strokeWidth={2} fill="none" strokeLinecap="round" />
            <path d="M13 16H27L26 20C35 23 36 36 28 41H12C4 36 5 23 14 20Z" fill={C.turmeric} />
            <circle cx="20" cy="31" r="2.6" fill={C.kumkum} />
          </svg>
          <p className="mt-3" style={{ fontFamily: display, fontSize: 26, fontWeight: 600 }}>{pooja}</p>
          <p className="mt-1" style={{ fontSize: 15, color: C.creamSoft }}>
            {[hosts, date && `${date.day} ${date.month} ${date.year}`].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-8">
            <Credit isPreview={isPreview} color="rgba(255,246,228,0.6)" linkColor={C.turmericSoft} />
          </div>
        </div>
      </footer>
    </div>
  )
}
