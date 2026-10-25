'use client'

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { prata } from './kit/fonts/prata'
import { marckScript } from './kit/fonts/marckScript'
import { ebGaramondCyrillic } from './kit/fonts/ebGaramondCyrillic'
import { comforter } from './kit/fonts/comforter'
import { tiro } from './kit/fonts/tiro'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  pad2,
  parseLines,
  parseRows,
  telHref,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
} from './kit/core'
import { Credit, Reveal } from './kit/ui'
import { numberWords } from './kit/words'
import type { InviteTheme } from './kit/theme'
import { Act, Icon, Lightbox, SectionNav, useLightbox, type NavItem } from './rajwada/parts'
import { Glasses, StitchBand } from './twoworlds/art'
import {
  ARCH_MASK,
  ArchFrame,
  C,
  Candle,
  ColourPaisley,
  Diya,
  FolkDefs,
  KalynaStrand,
  MalaRing,
  MarigoldStrand,
  NightCity,
  PaintedCorner,
  PeacockEye,
  PetrykivkaFlower,
  PetrykivkaSpray,
  RushnykDrape,
  Stamp,
  q,
  Stars,
  WreathMedallion,
} from './twoworlds/folk'
import { GaneshaArt } from './twoworlds/ganesha'
import { PalaceScene } from './twoworlds/palace'
import { KnotStage } from './twoworlds/knot'
import { DiamondRule, HORIZON_AT, HORIZON_TIMES, HorizonArch, HorizonSky, Rings, RINGS_AT, splitPlace, useBoxSize } from './twoworlds/horizon'

/*
 * Two Worlds — a wedding told as the couple's love story, in both their colours.
 *
 * Written first for an Indian groom and a Ukrainian bride who met over dinner
 * in Dubai, and built so any couple can tell theirs. His side is marigold
 * strings, saffron and rani pink, paisleys and the jharokha arch; hers is
 * Petrykivka painting on black, kalyna berries, sunflowers and the ribbons of
 * a vinok. They hang side by side from the first screen to the last.
 *
 * It plays like a short film, and the couple choose how it opens. As a Hindu
 * wedding does, with Lord Ganesha: sun rays turn behind an ivory medallion
 * where he is painted stroke by stroke, a mala drops round it, the diyas light
 * and the Vakratunda shloka comes in line by line. Or, for guests from every
 * country, at dusk over the curve of the Earth: his city and hers light up on
 * the horizon and their lines of gold meet in an arch where two rings draw
 * themselves (twoworlds/horizon). The groom is named first throughout, then
 * the bride. Then their names come up over their photo or video, the night
 * sky joins their three cities, a candlelit table in the city where they met,
 * their years pegged on a line like prints left to dry, their own film on a
 * little cinema screen, the two worlds side by side with a varmala and a vinok
 * linked between them, a wall of their photographs dressed the way both their
 * families dress the pictures they love, and then every celebration in its
 * own colour. Their song turns on a record.
 */

const display = `${prata.style.fontFamily}, Georgia, serif`
const text = `${ebGaramondCyrillic.style.fontFamily}, Georgia, serif`
const hand = `${marckScript.style.fontFamily}, cursive`
const script = `${comforter.style.fontFamily}, cursive`
const deva = `${tiro.style.fontFamily}, serif`

const WISHES_THEME: InviteTheme = {
  bg: C.ivory,
  surface: '#FFFFFF',
  ink: C.ink,
  muted: C.soft,
  line: 'rgba(38,25,46,0.14)',
  accent: C.rani,
  onAccent: C.cream,
  heading: display,
  body: text,
  headingStyle: { fontSize: 'clamp(28px, 8cqi, 38px)', color: C.ink },
}

type Phase = 'closed' | 'opening' | 'open'
type Fn = { name: string; date: string; time: string; venue: string; dress: string }
type Star = { x: number; y: number; city: string; who: string; tone: string; align: 'left' | 'center' | 'right'; main?: boolean }

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const initial = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''
const isDeva = (s: string) => /[ऀ-ॿ]/.test(s)
/** A word set large in script: Comforter for Latin, Marck Script for Cyrillic (Comforter's is hard to read), Tiro for Hindi. */
const scriptWord = (w: string): CSSProperties =>
  isDeva(w) ? { fontFamily: deva, fontSize: '0.72em' } : /[Ѐ-ӿ]/.test(w) ? { fontFamily: hand, fontSize: '0.74em' } : { fontFamily: script }

/** YouTube / Vimeo id from a pasted link, for the film. */
function filmEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&title=0&byline=0&portrait=0`
  return null
}

/** A link or path the page can load directly (uploads are https; the demo's files are local). */
const media = (u?: string) => (u && /^(https?:\/\/|\/)/i.test(u.trim()) ? u.trim() : '')

const archMask: CSSProperties = { WebkitMaskImage: ARCH_MASK, maskImage: ARCH_MASK, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }

/* Each celebration gets its own colour, the way each day of a wedding has its own. */
const CARDS = [
  { bg: `linear-gradient(155deg, ${C.sunflower} 0%, ${C.marigold} 42%, ${C.saffron} 100%)`, ink: '#3A1604', soft: 'rgba(58,22,4,0.74)', chip: 'rgba(58,22,4,0.1)', line: 'rgba(58,22,4,0.3)', art: 'tw-mg0' },
  { bg: `linear-gradient(155deg, #43A052 0%, ${C.leaf} 40%, ${C.leafDark} 100%)`, ink: C.cream, soft: 'rgba(255,249,238,0.82)', chip: 'rgba(255,255,255,0.14)', line: 'rgba(255,249,238,0.35)', art: 'tw-sf' },
  { bg: `linear-gradient(155deg, ${C.rose} 0%, ${C.rani} 42%, ${C.berry} 100%)`, ink: C.cream, soft: 'rgba(255,249,238,0.84)', chip: 'rgba(255,255,255,0.14)', line: 'rgba(255,249,238,0.35)', art: 'tw-pp' },
  { bg: `linear-gradient(155deg, ${C.peacock} 0%, #12436B 48%, ${C.night2} 100%)`, ink: C.cream, soft: 'rgba(255,249,238,0.82)', chip: 'rgba(255,255,255,0.12)', line: 'rgba(255,249,238,0.35)', art: 'tw-cf' },
] as const

/* Photos and moments hang at slightly different angles, the way they would on a line. */
const TILTS = [-2.6, 1.8, -1.2, 2.6, -2, 1.2, 2.2, -1.6]
const TAGS = [C.saffron, C.peacock, C.rani, C.leaf] as const

/* Petals falling through the hero and the invitation: marigold, rose, sunflower, kalyna. */
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  size: 11 + ((i * 7) % 4) * 4,
  fall: 12 + ((i * 5) % 7) * 1.7,
  delay: -((i * 2.3) % 15),
  drift: (i % 2 ? 1 : -1) * (24 + ((i * 13) % 50)),
  tumble: 3 + (i % 3) * 1.4,
  kind: i % 4,
}))

/* The blessing the invitation opens with, unless the couple write their own (or "none"). */
const INVOCATION = '॥ श्री गणेशाय नमः ॥'
const SHLOKA = ['वक्रतुण्ड महाकाय', 'सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव', 'सर्वकार्येषु सर्वदा ॥']
const SHLOKA_MEANING = 'O Lord of the curved trunk and mighty form, radiant as a million suns, clear every obstacle from all we begin, always.'
/** When the first screen's parts arrive, in ms: the medallion, Ganesha's first stroke, the shloka's lines (then the meaning and the button). */
const MEDALLION_AT = 800
const PAINT_AT = 1000
const VERSE_AT = 2500
const VERSE_STEP = 300
/** Sindoor, the colour Ganesha is painted in. */
const SINDOOR = '#C8410F'

const GILT = 'linear-gradient(135deg, #FBE7A8 0%, #D9A93F 18%, #94661A 40%, #F1CF7A 58%, #B5832A 78%, #FCE9B0 100%)'
const WALNUT = 'linear-gradient(135deg, #6A4428 0%, #8C5D38 45%, #5A3820 100%)'

/* The family wall: a carved jharokha from his home, a rushnyk-dressed frame and a painted one from hers, gilt and walnut between. */
const WALL = ['jharokha', 'gilt', 'rushnyk', 'lacquer', 'walnut'] as const
const WALL_RATIOS = ['4/5', '1/1', '3/4', '5/4', '4/5', '3/4', '5/6']
const WALL_TILTS = [-0.9, 0.6, -0.4, 0.8, -0.6, 0.3, 0.5]

/* ─── Small parts ───────────────────────────────────────────────────────────── */

/** Becomes true once the element scrolls into view (at once in previews). */
function useInView<T extends Element>(immediate: boolean) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (immediate || !el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])
  return [ref, inView] as const
}

/** Every chapter opens between a marigold and a bunch of kalyna. */
function Chapter({ n, title, note, light = false }: { n: number; title: ReactNode; note?: ReactNode; light?: boolean }) {
  const kick = light ? C.goldLight : C.goldDeep
  const rule = <span aria-hidden className="h-px w-7" style={{ background: kick, opacity: 0.6 }} />
  return (
    <header className="text-center">
      <p className="flex items-center justify-center gap-2.5 uppercase" style={{ fontSize: 12, letterSpacing: '0.3em', color: kick, fontWeight: 500 }}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]"><Stamp id="tw-mg0" x={12} y={12} r={11} /></svg>
        {rule}
        <span className="px-1">Chapter {numberWords(n)}</span>
        {rule}
        <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]"><Stamp id="tw-kl" x={12} y={13} r={11} /></svg>
      </p>
      <h2 className="mx-auto mt-4 max-w-[18ch] text-balance" style={{ fontFamily: display, fontSize: 'clamp(34px, 10cqi, 60px)', lineHeight: 1.06, color: light ? C.cream : C.ink }}>
        {title}
      </h2>
      {note && (
        <p className="mt-3 -rotate-1" style={{ fontFamily: hand, fontSize: 'clamp(20px, 5.6cqi, 26px)', color: light ? C.goldLight : C.rani }}>
          {note}
        </p>
      )}
    </header>
  )
}

function Kicker({ children, color, className = '' }: { children: ReactNode; color: string; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontSize: 12, letterSpacing: '0.26em', color, fontWeight: 500 }}>
      {children}
    </p>
  )
}

/** Petals drifting down through a scene. */
function Petals({ count = 18 }: { count?: number }) {
  return (
    <div aria-hidden className="tw-petals pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="tw-petal"
          style={{ left: `${p.left}%`, width: p.kind === 3 ? p.size * 0.6 : p.size, height: p.kind === 3 ? p.size * 0.6 : p.size, ['--fd' as string]: `${p.fall}s`, ['--fdl' as string]: `${p.delay}s`, ['--fx' as string]: `${p.drift}px`, ['--td' as string]: `${p.tumble}s` }}
        >
          <svg viewBox="0 0 20 20">
            {p.kind === 0 ? (
              <>
                <path d="M10 1C15 3 18 8 16 14 14 19 6 19 4 14 2 8 5 3 10 1Z" fill={C.marigold} />
                <path d="M10 3C9 8 9 12 10 17" stroke={C.marigoldDeep} strokeWidth={1.1} fill="none" opacity={0.7} />
              </>
            ) : p.kind === 1 ? (
              <path d="M10 2C16 2 19 8 16 14 13 19 7 19 4 14 1 8 4 2 10 2Z" fill={C.rose} />
            ) : p.kind === 2 ? (
              <path d="M10 19C14 14 14 6 10 1 6 6 6 14 10 19Z" fill={C.sunflower} />
            ) : (
              <>
                <circle cx={10} cy={10} r={9} fill={C.kalyna} />
                <circle cx={7} cy={7} r={2.6} fill="rgba(255,255,255,0.7)" />
              </>
            )}
          </svg>
        </span>
      ))}
    </div>
  )
}

/**
 * A few garland strings hanging into a scene from its top corners: marigolds
 * on the left, kalyna and sunflowers on the right.
 */
function CornerStrands({ lengths, width = 'min(7cqi, 46px)', className = '' }: { lengths: number[]; width?: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 flex justify-between ${className}`}>
      <div className="flex gap-[1.4cqi] pl-[2cqi]">
        {lengths.map((l, i) => (
          <div key={i} className="tw-sway" style={{ width, ['--sd' as string]: `${5.5 + i * 0.9}s`, ['--sdl' as string]: `${-i * 1.3}s` }}>
            <MarigoldStrand length={l} seed={i + 2} className="block w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-row-reverse gap-[1.4cqi] pr-[2cqi]">
        {lengths.map((l, i) => (
          <div key={i} className="tw-sway" style={{ width, ['--sd' as string]: `${6.2 + i * 0.8}s`, ['--sdl' as string]: `${-i * 1.7}s` }}>
            <KalynaStrand length={l + 20} seed={i + 1} className="block w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * A toran of marigolds swagged across the top of a section, with a short
 * string and a bell falling from every point where two swags meet. An odd
 * number of swags puts the middle of one, not a bell, at the centre.
 */
function MarigoldToran({ swags = 12 }: { swags?: number }) {
  const swag = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 0.5) / 9
    return { x: 6 + t * 148, y: 10 + Math.sin(t * Math.PI) * 30, i }
  })
  return (
    <div aria-hidden className="pointer-events-none flex justify-center overflow-hidden">
      {Array.from({ length: swags }, (_, s) => (
        <svg key={s} viewBox="0 0 160 96" className="h-[96px] w-[160px] shrink-0" overflow="visible">
          <path d="M0 8Q80 64 160 8" stroke="#D9BF86" strokeWidth={1.2} fill="none" />
          {swag.map(({ x, y, i }) => (
            <Stamp key={i} id={(i + s) % 3 === 0 ? 'tw-mg1' : 'tw-mg0'} x={x} y={y} r={9.5} rot={i * 33 + s * 11} />
          ))}
          <g>
            <path d="M0 8V62" stroke="#D9BF86" strokeWidth={1} />
            <Stamp id="tw-lf1" x={-5} y={18} r={8} rot={-40} />
            <Stamp id="tw-lf0" x={5} y={18} r={8} rot={40} />
            <Stamp id={s % 2 ? 'tw-mg0' : 'tw-pp'} x={0} y={30} r={8} />
            <Stamp id="tw-mg1" x={0} y={46} r={7.5} rot={40} />
            <path d="M-5 70C-5 62-3 58 0 58S5 62 5 70Z" fill={C.gold} stroke={C.goldDeep} strokeWidth={0.8} />
            <circle cy={71.5} r={1.4} fill={C.goldDeep} />
          </g>
        </svg>
      ))}
    </div>
  )
}

/**
 * The varmala and the vinok, linked like two rings: his of marigolds and rose
 * beads, hers of sunflowers, kalyna, poppies and cornflowers. Where they cross
 * at the top his garland passes over hers, and at the bottom hers over his.
 */
function LinkedGarlands({ his, hers, className }: { his: string; hers: string; className?: string }) {
  const R = 86
  const ring = (cx: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2
      return { x: cx + Math.cos(a) * R, y: 130 + Math.sin(a) * R, a, i }
    })
  const a = ring(150, 22)
  const b = ring(250, 18)
  const hisItem = ({ x, y, i }: (typeof a)[number]) =>
    i % 2 ? <circle key={`a${i}`} cx={q(x)} cy={q(y)} r={5.5} fill={C.rose} stroke={C.rani} strokeWidth={1} /> : <Stamp key={`a${i}`} id={i % 4 ? 'tw-mg1' : 'tw-mg0'} x={x} y={y} r={13.5} rot={i * 27} />
  const over = a.filter(({ x, y }) => x > 176 && y < 100)
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label={`A marigold varmala and a Ukrainian vinok, linked: ${his} and ${hers}`}>
      <circle cx={150} cy={130} r={R} fill="none" stroke="#E8D3A2" strokeWidth={1.2} />
      {a.map(hisItem)}
      <circle cx={250} cy={130} r={R} fill="none" stroke={C.leafDark} strokeWidth={3} />
      {b.map(({ x, y, a: ang, i }) => (
        <Stamp key={`bl${i}`} id={i % 2 ? 'tw-lf0' : 'tw-lf1'} x={x} y={y} r={13} rot={(ang * 180) / Math.PI + (i % 2 ? 150 : 30)} />
      ))}
      {b.map(({ x, y, i }) => (
        <Stamp key={`b${i}`} id={['tw-sf', 'tw-kl', 'tw-pp', 'tw-cf', 'tw-kl', 'tw-sf'][i % 6]} x={x} y={y} r={i % 3 === 0 ? 14 : 11.5} rot={i * 19} />
      ))}
      {over.map(hisItem)}
      <text x={150} y={144} textAnchor="middle" style={{ fontFamily: display, fontSize: 42, fill: C.cream }}>{his}</text>
      <text x={250} y={144} textAnchor="middle" style={{ fontFamily: display, fontSize: 42, fill: C.cream }}>{hers}</text>
      <text x={200} y={142} textAnchor="middle" style={{ fontFamily: script, fontSize: 34, fill: C.goldLight }}>&amp;</text>
    </svg>
  )
}

/** Their three cities as a constellation: her home and his, each line drawn to the city where they met. */
function Constellation({ stars, isPreview }: { stars: Star[]; isPreview: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(isPreview)
  const meet = stars.find((s) => s.main)
  const lines = meet ? stars.filter((s) => !s.main).map((s) => [s, meet] as const) : [[stars[0], stars[1]] as const]
  return (
    <div ref={ref} className={`relative mx-auto mt-20 max-w-[46rem] pb-12 ${inView ? 'is-in' : ''}`}>
      <svg viewBox="0 0 400 260" className="block w-full overflow-visible" role="img" aria-label={`Their constellation: ${stars.map((s) => s.city).join(', ')}`}>
        {lines.map(([s, to], i) => {
          const mx = (s.x + to.x) / 2 + (i ? 14 : -18)
          const my = (s.y + to.y) / 2 + (i ? 30 : -30)
          return <path key={s.city} className="tw-draw" pathLength={1} style={{ ['--d' as string]: `${300 + i * 600}ms` }} d={`M${s.x} ${s.y}Q${mx} ${my} ${to.x} ${to.y}`} stroke={s.tone} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        })}
        {stars.map((s, i) => {
          const r = s.main ? 13 : 9
          return (
            <g key={s.city}>
              {s.main && <circle className="tw-halo" cx={s.x} cy={s.y} r={24} fill="rgba(244,216,142,0.22)" />}
              <g className="tw-pop" style={{ ['--d' as string]: `${i * 450}ms` }}>
                <path d={`M${s.x} ${s.y - r}L${s.x + 2.2} ${s.y - 2.2}L${s.x + r} ${s.y}L${s.x + 2.2} ${s.y + 2.2}L${s.x} ${s.y + r}L${s.x - 2.2} ${s.y + 2.2}L${s.x - r} ${s.y}L${s.x - 2.2} ${s.y - 2.2}Z`} fill={s.main ? '#FFF6DA' : s.tone} />
                <circle cx={s.x} cy={s.y} r={s.main ? 3.4 : 2.4} fill="#FFFFFF" />
              </g>
            </g>
          )
        })}
      </svg>
      {stars.map((s, i) => (
        <div
          key={s.city}
          className="tw-label absolute"
          style={{
            left: `${(s.x / 400) * 100}%`,
            top: `${(s.y / 260) * 100}%`,
            transform: s.align === 'left' ? 'translate(-14px, calc(-100% - 16px))' : s.align === 'right' ? 'translate(calc(-100% + 14px), 22px)' : 'translate(-50%, 26px)',
            textAlign: s.align,
            ['--d' as string]: `${700 + i * 450}ms`,
          }}
        >
          <p className="whitespace-nowrap" style={{ fontFamily: display, fontSize: s.main ? 'clamp(21px, 5.8cqi, 30px)' : 'clamp(16px, 4.4cqi, 21px)', color: C.cream, lineHeight: 1.15 }}>{s.city}</p>
          <p className="mt-1 whitespace-nowrap uppercase" style={{ fontSize: 10.5, letterSpacing: '0.2em', color: s.tone }}>{s.who}</p>
        </div>
      ))}
    </div>
  )
}

/** A wooden clothes peg. */
function Peg() {
  return (
    <svg aria-hidden viewBox="0 0 14 34" className="absolute left-1/2 top-[-16px] z-[2] h-[34px] w-[14px] -translate-x-1/2">
      <rect x={2} y={0} width={10} height={34} rx={2.6} fill="#D3A46C" />
      <rect x={2} y={0} width={4.5} height={34} rx={2} fill="#E2B985" />
      <rect x={1.5} y={14} width={11} height={3.2} rx={1} fill="#8E6534" />
    </svg>
  )
}

/** One sagging length of twine, from a peg to the next. */
function Twine({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 20" preserveAspectRatio="none" className={`pointer-events-none absolute top-[-8px] h-[20px] ${className}`}>
      <path d="M0 2Q50 22 100 2" stroke="#9C7B55" strokeWidth={1.4} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const btn = 'tw-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px]'

/* ─── The blessing ──────────────────────────────────────────────────────────── */

/**
 * The centre of the first screen: Lord Ganesha painted in sindoor on an ivory
 * medallion (or the couple's own picture), a gilt rim, and a mala that drops
 * round it once he is drawn.
 */
function Medallion({ photo }: { photo: string }) {
  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-0 overflow-hidden rounded-full" style={{ background: 'radial-gradient(circle at 50% 42%, #FFFBF1 0%, #FFF3DC 58%, #F5DDB0 100%)', boxShadow: `0 0 0 3px ${C.gold}, 0 0 0 5px #8A5A12, 0 0 0 7px ${C.goldLight}, 0 26px 56px -18px rgba(40,4,22,0.85), inset 0 0 34px rgba(214,150,50,0.28)` }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="The blessing" className="h-full w-full object-cover" />
        ) : (
          <GaneshaArt color={SINDOOR} draw start={PAINT_AT} className="absolute left-[4%] top-[5%] h-[88%] w-[88%]" />
        )}
        <span aria-hidden className="absolute inset-0 m-[3.2%] rounded-full" style={{ border: '1.5px dotted rgba(184,128,40,0.75)' }} />
      </div>
      <div className="tw-i tw-i-drop pointer-events-none absolute inset-0" style={{ ['--d' as string]: `${PAINT_AT + 1500}ms` }}>
        <MalaRing className="tw-mala absolute left-[-12%] top-[-12%] w-[124%] max-w-none" />
      </div>
    </div>
  )
}

/** Lines of the shloka, each arriving after the last; the dandas in marigold. */
function Verse({ lines, from, align, className, style }: { lines: string[]; from: number; align: 'left' | 'right' | 'center'; className?: string; style?: CSSProperties }) {
  return (
    <div lang="sa" className={className} style={{ fontFamily: deva, color: '#FFF1D2', textAlign: align, textShadow: '0 1px 12px rgba(50,0,20,0.65)', ...style }}>
      {lines.map((l, i) => (
        <p key={i} className="tw-i" style={{ ['--d' as string]: `${VERSE_AT + (from + i) * VERSE_STEP}ms` }}>
          {l.split(/([।॥|]+)/).map((part, k) => (/[।॥|]/.test(part) ? <span key={k} style={{ color: C.marigold }}>{part}</span> : part))}
        </p>
      ))}
    </div>
  )
}

/** A diya on the first screen, lit after `at` ms. */
function Lamp({ at }: { at: number }) {
  return (
    <span aria-hidden className="tw-lamp block w-[clamp(34px,9cqi,50px)] shrink-0" style={{ ['--d' as string]: `${at}ms` }}>
      <Diya className="block w-full" />
    </span>
  )
}

/** The first screen's button, in either opening: a gilt pill with a light running across it. */
function OpenButton({ onClick, disabled, label, delay, icon }: { onClick: () => void; disabled: boolean; label: string; delay: number; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="tw-i tw-open pointer-events-auto relative mb-1 inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[16px] font-medium"
      style={{ ['--d' as string]: `${delay}ms`, background: 'linear-gradient(180deg, #FFEBB0 0%, #F6C75E 48%, #E3A33C 100%)', color: '#3A1604', boxShadow: '0 12px 28px -12px rgba(30,0,10,0.8), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -2px 0 rgba(150,90,10,0.35)' }}
    >
      {icon}
      Open the invitation
      <span aria-hidden className="tw-shine absolute inset-y-0 w-1/3" />
    </button>
  )
}

/** The width of the rings on the international first screen. */
const INTL_RINGS = 'min(clamp(78px, 24cqw, 140px), 15cqh)'

/** A small flag beside a home city, for the two countries this design was first written for. */
function HomeFlag({ place }: { place: string }) {
  const ua = /ukrain|україн/i.test(place)
  const india = /india|भारत/i.test(place)
  if (!ua && !india) return null
  return (
    <svg aria-hidden viewBox="0 0 18 12" className="mr-2 inline-block h-[0.72em] w-auto rounded-[2px] align-[0.02em]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.35)' }}>
      {ua ? (
        <>
          <rect width={18} height={6} fill="#0057B7" />
          <rect y={6} width={18} height={6} fill="#FFD700" />
        </>
      ) : (
        <>
          <rect width={18} height={4} fill="#FF9933" />
          <rect y={4} width={18} height={4} fill="#FFFFFF" />
          <rect y={8} width={18} height={4} fill="#138808" />
          <circle cx={9} cy={6} r={1.5} fill="none" stroke="#000080" strokeWidth={0.5} />
        </>
      )}
    </svg>
  )
}

/* ─── The family wall ───────────────────────────────────────────────────────── */

/**
 * One photograph on the wall, framed by its place in the row: a carved
 * jharokha arch, gilt with a mount, walnut dressed in a rushnyk, black lacquer
 * painted Petrykivka-style, or plain walnut with a mount.
 */
function WallFrame({ src, i, alt }: { src: string; i: number; alt: string }) {
  const kind = WALL[i % WALL.length]
  const ratio = WALL_RATIOS[i % WALL_RATIOS.length]
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={src} alt={alt} loading="lazy" className="block h-full w-full object-cover" />
  if (kind === 'jharokha') {
    return (
      <div className="relative" style={{ aspectRatio: '100/130' }}>
        <div className="absolute inset-0" style={{ ...archMask, background: 'linear-gradient(160deg, #7A4322 0%, #A2602E 38%, #5A2E14 100%)' }} />
        <div className="absolute inset-0 m-[7%]">
          <div className="h-full w-full" style={archMask}>{img}</div>
          <ArchFrame className="absolute inset-0 h-full w-full" color={C.goldLight} />
        </div>
        <ArchFrame className="absolute inset-0 h-full w-full" color={C.gold} />
      </div>
    )
  }
  if (kind === 'lacquer') {
    return (
      <div className="relative" style={{ padding: '9%', background: 'linear-gradient(135deg, #221A1F 0%, #0E0B0D 100%)' }}>
        <div style={{ aspectRatio: ratio, boxShadow: `0 0 0 1.5px ${C.kalyna}` }}>{img}</div>
        {[0, 90, 180, 270].map((r) => (
          <PaintedCorner key={r} className={`pointer-events-none absolute w-[17%] ${r === 0 ? 'left-0 top-0' : r === 90 ? 'right-0 top-0' : r === 180 ? 'bottom-0 right-0' : 'bottom-0 left-0'}`} style={{ transform: `rotate(${r}deg)` }} />
        ))}
      </div>
    )
  }
  if (kind === 'rushnyk') {
    return (
      <div className="relative">
        <div style={{ padding: '4%', background: WALNUT }}>
          <div style={{ aspectRatio: ratio }}>{img}</div>
        </div>
        <RushnykDrape className="pointer-events-none absolute left-[-9%] top-0 -mt-[5%] w-[118%] max-w-none" />
      </div>
    )
  }
  return (
    <div style={{ padding: '4.5%', background: kind === 'gilt' ? GILT : WALNUT }}>
      <div style={{ padding: '7%', background: '#FBF6EA', boxShadow: 'inset 0 1px 5px rgba(60,40,10,0.3)' }}>
        <div style={{ aspectRatio: ratio, boxShadow: '0 0 0 1px rgba(120,90,40,0.35)' }}>{img}</div>
      </div>
    </div>
  )
}

/* ─── The film, on a little cinema screen ───────────────────────────────────── */

function Cinema({ src, poster, title, isPreview }: { src: string; poster: string; title: string; isPreview: boolean }) {
  const [on, setOn] = useState(false)
  const embed = filmEmbed(src)
  const start = () => {
    // The film has its own sound: the song steps aside.
    document.querySelectorAll('audio').forEach((a) => a.pause())
    setOn(true)
  }
  const bulbs = (n: number, side: 'top' | 'bottom' | 'left' | 'right') =>
    Array.from({ length: n }, (_, i) => {
      const t = `${((i + 0.5) / n) * 100}%`
      const pos: CSSProperties =
        side === 'top' ? { top: 11, left: t } : side === 'bottom' ? { top: 'calc(100% - 11px)', left: t } : side === 'left' ? { left: 11, top: t } : { left: 'calc(100% - 11px)', top: t }
      return (
        <span
          key={`${side}${i}`}
          aria-hidden
          className="tw-bulb absolute h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ ...pos, background: 'radial-gradient(circle, #FFF8DA 0 30%, #FFC93C 55%, rgba(255,170,30,0) 72%)', boxShadow: '0 0 10px 2px rgba(255,190,60,0.5)', animationDelay: `${(i % 2) * 0.8}s` }}
        />
      )
    })
  return (
    <figure className="mx-auto w-full max-w-[52rem]">
      <div className="relative rounded-[14px] p-[22px]" style={{ background: 'linear-gradient(180deg, #4A1A40 0%, #2A0F26 100%)', boxShadow: `0 0 0 2px ${C.goldDeep}, 0 30px 60px -30px rgba(0,0,0,0.8)` }}>
        {bulbs(16, 'top')}
        {bulbs(16, 'bottom')}
        {bulbs(8, 'left')}
        {bulbs(8, 'right')}
        <div className="relative aspect-video overflow-hidden rounded-[4px]" style={{ background: '#07040A', boxShadow: `0 0 0 1px ${C.gold}` }}>
          {on && embed ? (
            <iframe src={embed} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
          ) : on ? (
            <video src={src} poster={poster || undefined} controls autoPlay playsInline preload="metadata" className="absolute inset-0 h-full w-full bg-black object-contain" />
          ) : (
            <button type="button" onClick={start} className="group absolute inset-0 h-full w-full" aria-label={`Play ${title}`}>
              {poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
              )}
              <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(70% 70% at 50% 50%, rgba(20,13,34,0.1), rgba(20,13,34,0.7))' }} />
              <span className="absolute left-1/2 top-1/2 flex h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105" style={{ background: 'rgba(255,249,238,0.14)', boxShadow: `inset 0 0 0 1.5px ${C.goldLight}`, backdropFilter: 'blur(4px)' }}>
                <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill={C.cream}><path d="M7 4.5v15l12-7.5z" /></svg>
              </span>
              {!isPreview && (
                <span className="absolute inset-x-0 bottom-4 text-center uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', color: 'rgba(255,249,238,0.85)' }}>Tap to play</span>
              )}
            </button>
          )}
        </div>
      </div>
    </figure>
  )
}

/* ─── The flip countdown ────────────────────────────────────────────────────── */

// Ticks in the builder preview too, so the host sees it working: only these four
// boxes redraw each second, not the design around them.
function Countdown({ date, time }: { date?: string; time?: string }) {
  const cd = useCountdown(date, time)
  const parts: [string, string][] = cd
    ? [[String(cd.days), cd.days === 1 ? 'day' : 'days'], [pad2(cd.hours), 'hours'], [pad2(cd.minutes), 'minutes'], [pad2(cd.seconds), 'seconds']]
    : [['–', 'days'], ['–', 'hours'], ['–', 'minutes'], ['–', 'seconds']]
  return (
    <div className="mx-auto grid max-w-[34rem] grid-cols-4 gap-[2.4cqi] [@container(min-width:760px)]:gap-4" aria-live="off">
      {parts.map(([v, label], i) => (
        <div key={label} className="text-center">
          <div className="relative overflow-hidden rounded-[10px] py-[3.4cqi] [@container(min-width:760px)]:py-5" style={{ background: `linear-gradient(180deg, #2C1D45 0 50%, ${C.night} 50% 100%)`, boxShadow: '0 14px 28px -16px rgba(20,13,34,0.7), inset 0 0 0 1px rgba(214,168,70,0.35)' }}>
            <span key={v} className="tw-flip block tabular-nums" style={{ fontFamily: display, fontSize: 'clamp(26px, 8.6cqi, 46px)', lineHeight: 1, color: C.goldLight }}>{v}</span>
            <span aria-hidden className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <span aria-hidden className="absolute left-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r-full" style={{ background: C.ivory }} />
            <span aria-hidden className="absolute right-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-l-full" style={{ background: C.ivory }} />
          </div>
          <p className="mt-2.5 uppercase" style={{ fontSize: 'clamp(9.5px, 2.9cqi, 11px)', letterSpacing: 'clamp(0.1em, 0.5cqi, 0.2em)', color: [C.saffron, C.rani, C.peacock, C.leaf][i] }}>{label}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── The record player ─────────────────────────────────────────────────────── */

function Record({ playing, label, onToggle, title, hint, isPreview }: { playing: boolean; label: string; onToggle: () => void; title: string; hint: boolean; isPreview: boolean }) {
  const show = hint || playing
  return (
    <div className={`${isPreview ? 'absolute right-3 top-3' : 'fixed bottom-4 right-4'} z-40 flex items-center gap-2`}>
      <span
        className="pointer-events-none max-w-[13rem] truncate rounded-full px-3.5 py-2 text-[13px] transition-all duration-500"
        style={{ background: 'rgba(20,13,34,0.88)', color: C.cream, boxShadow: '0 8px 22px -10px rgba(0,0,0,0.6)', opacity: show ? 1 : 0, transform: show ? 'none' : 'translateX(8px)', backdropFilter: 'blur(6px)' }}
      >
        <span style={{ color: C.goldLight }}>{playing ? '♪ ' : '▶ '}</span>
        {playing ? title || 'Our song' : `Play our song${title ? ` · ${title}` : ''}`}
      </span>
      <button type="button" onClick={onToggle} aria-label={playing ? 'Pause our song' : 'Play our song'} aria-pressed={playing} className="relative h-[58px] w-[58px] shrink-0">
        <span
          className={`tw-vinyl absolute inset-0 rounded-full ${playing ? 'is-on' : ''}`}
          style={{ background: 'repeating-radial-gradient(circle at 50% 50%, #151018 0 1.5px, #262029 1.5px 3px)', boxShadow: '0 10px 24px -8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)' }}
        >
          <span aria-hidden className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 20deg, transparent 0 12%, rgba(255,255,255,0.14) 16%, transparent 22% 62%, rgba(255,255,255,0.1) 66%, transparent 72%)' }} />
          <span className="absolute inset-[19px] overflow-hidden rounded-full" style={{ background: C.rani }}>
            {label && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={label} alt="" className="h-full w-full object-cover" />
            )}
          </span>
          <span aria-hidden className="absolute left-1/2 top-1/2 h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: C.cream }} />
        </span>
        <svg aria-hidden viewBox="0 0 40 40" className={`tw-arm absolute -right-[6px] -top-[8px] h-[34px] w-[34px] ${playing ? 'is-on' : ''}`}>
          <circle cx={34} cy={5} r={4} fill={C.goldLight} stroke={C.goldDeep} />
          <path d="M34 5L26 30 20 33" stroke={C.goldLight} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={15} y={30} width={7} height={5} rx={1} fill={C.goldDeep} transform="rotate(-25 18 32)" />
        </svg>
      </button>
    </div>
  )
}

/* ─── The design ────────────────────────────────────────────────────────────── */

export default function SignatureTwoWorlds({ data, eventId, isPreview = false }: InviteProps) {
  const bride = data.brideName?.trim() || 'Olena'
  const groom = data.groomName?.trim() || 'Aarav'
  // The groom is named first everywhere, then the bride; his family before hers.
  const couple = `${groom} & ${bride}`
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const place = [venue, data.venueAddress].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const weddingCal = calendarHref(`Wedding of ${couple}`, data.date, data.time, place || undefined, 5)

  const tagline = data.tagline?.trim() || ''
  const greetings = useMemo(() => parseLines(data.greetings), [data.greetings])
  const loveWords = useMemo(() => parseLines(data.loveWords), [data.loveWords])
  const thanks = useMemo(() => parseLines(data.thanks), [data.thanks])
  const metCity = data.metCity?.trim() || ''
  const metCoords = data.metCoords?.trim() || ''
  const metLine = data.metLine?.trim() || ''
  const metPhoto = media(data.metPhoto)
  const metCaption = data.metCaption?.trim() || ''
  const loveStory = useMemo(() => parseLines(data.loveStory), [data.loveStory])
  const moments = useMemo(() => parseRows(data.story, ['when', 'title', 'text'] as const), [data.story])
  const photos = useMemo(() => galleryImages(data.galleryImages, 12), [data.galleryImages])
  const notes = useMemo(() => parseLines(data.photoNotes), [data.photoNotes])
  const film = media(data.videoUrl)
  const filmTitle = data.videoTitle?.trim() || 'A little film of us'
  const couplePhoto = media(data.couplePhoto)
  // The loop behind their names must be a file the page can play silently; a YouTube link belongs in the film.
  const heroVideo = filmEmbed(data.heroVideoUrl ?? '') ? '' : media(data.heroVideoUrl)
  const closingPhoto = media(data.closingPhoto) || couplePhoto
  const portraits = { bride: media(data.bridePhoto), groom: media(data.groomPhoto) }
  const homes = { groom: data.groomFrom?.trim() || '', bride: data.brideFrom?.trim() || '' }
  const worlds = { groom: data.groomWorld?.trim() || '', bride: data.brideWorld?.trim() || '' }
  const togetherLine = data.togetherLine?.trim() || ''
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const reply = whatsappHref(data.whatsappNumber, `Hello! This is our reply to ${couple}'s wedding invitation: `)
  const rsvpBy = dateParts(data.rsvpBy)
  const hashtag = data.hashtag?.trim()
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null
  const closing = data.message?.trim() || ''
  const song = media(data.musicUrl)
  const songTitle = data.songTitle?.trim() || ''
  const album = useMemo(() => galleryImages(data.albumImages, 24), [data.albumImages])
  const traditions = useMemo(() => parseRows(data.traditions, ['theme', 'hindu', 'hinduText', 'ukrainian', 'ukrainianText'] as const), [data.traditions])
  const albumLine = data.albumLine?.trim() || ''

  // The first screen is Lord Ganesha's blessing, or the international opening if the couple choose it.
  // With the blessing they may write their own words, or "none" to open without it.
  const intl = data.introStyle === 'international'
  const invocationText = data.invocation?.trim() || ''
  const blessed = !intl && !/^(none|no|off|-)$/i.test(invocationText)
  const ownShloka = useMemo(() => parseLines(data.shloka), [data.shloka])
  const invocation = blessed ? invocationText || INVOCATION : ''
  const shloka = blessed ? (ownShloka.length ? ownShloka : SHLOKA) : []
  const meaning = blessed ? data.shlokaMeaning?.trim() || (ownShloka.length ? '' : SHLOKA_MEANING) : ''
  const ownPicture = media(data.deityPhoto)
  const half = Math.ceil(shloka.length / 2)
  // When the opening has been read and the button arrives.
  const after = intl ? HORIZON_TIMES.words + 1300 : VERSE_AT + shloka.length * VERSE_STEP

  // "Four years of us": from the year they met to the year they marry.
  const since = Number(data.togetherSince?.match(/\d{4}/)?.[0] ?? 0)
  const weddingYear = date?.year ?? 0
  const years = since && weddingYear > since ? weddingYear - since : 0
  const usTitle = years ? (
    <>
      <span style={{ fontFamily: script, fontSize: '1.32em', lineHeight: 0.8, color: C.rani }}>{cap(numberWords(years))}</span> {years === 1 ? 'year' : 'years'} of us
    </>
  ) : (
    'Our years together'
  )
  const yearMarks = since && weddingYear >= since && weddingYear - since <= 8 ? Array.from({ length: weddingYear - since + 1 }, (_, i) => since + i) : []

  const functions = useMemo(() => {
    const list = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'] as const) as Fn[]
    const dated = list.length > 0 && list.every((f) => dateParts(f.date))
    if (dated) list.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    return list
  }, [data.events])

  /** The line of memories: photos, with a moment of their story after every two. */
  const line = useMemo(() => {
    const out: ({ kind: 'photo'; src: string; i: number } | { kind: 'moment'; m: (typeof moments)[number]; i: number })[] = []
    let m = 0
    photos.forEach((src, i) => {
      out.push({ kind: 'photo', src, i })
      if (i % 2 === 1 && m < moments.length) out.push({ kind: 'moment', m: moments[m], i: m++ })
    })
    while (m < moments.length) out.push({ kind: 'moment', m: moments[m], i: m++ })
    return out
  }, [photos, moments])

  /* Their constellation: his home to the north-west, the city that introduced them, her home to the south-east. */
  const stars = [
    homes.groom ? { x: 64, y: 56, city: homes.groom, who: `${groom}’s home`, tone: C.marigold, align: 'left' } : null,
    metCity ? { x: 214, y: 140, city: metCity, who: 'where we met', tone: C.goldLight, align: 'center', main: true } : null,
    homes.bride ? { x: 340, y: 222, city: homes.bride, who: `${bride}’s home`, tone: '#FF7A86', align: 'right' } : null,
  ].filter(Boolean) as Star[]

  const hasStars = loveStory.length > 0 || stars.length > 1
  const hasDinner = Boolean(metCity || metPhoto || metLine || loveStory.length > 1)
  const hasUs = line.length > 0 || yearMarks.length > 1
  const hasWorlds = Boolean(homes.groom || homes.bride || worlds.groom || worlds.bride || togetherLine || portraits.groom || portraits.bride)
  const hasGuests = travel.length > 0 || faq.length > 0 || contacts.length > 0
  const hasAlbum = album.length > 0
  const hasWays = traditions.length > 0
  const chapters = [hasStars && 'stars', hasDinner && 'dinner', hasUs && 'us', hasWorlds && 'worlds', hasWays && 'ways', hasAlbum && 'album', 'wedding'].filter(Boolean) as string[]
  const no = (id: string) => chapters.indexOf(id) + 1

  const nav: NavItem[] = [
    hasStars || hasDinner ? { id: hasStars ? 'tw-begin' : 'tw-dinner', label: 'Our story' } : null,
    hasUs || film ? { id: hasUs ? 'tw-us' : 'tw-film', label: 'Our years' } : null,
    hasWorlds || hasWays ? { id: hasWorlds ? 'tw-worlds' : 'tw-ways', label: 'Two worlds' } : null,
    hasWays ? { id: 'tw-ways', label: 'Traditions' } : null,
    hasAlbum ? { id: 'tw-album', label: 'Photos' } : null,
    { id: 'tw-wedding', label: 'The wedding' },
    { id: 'tw-rsvp', label: 'RSVP' },
    eventId ? { id: 'tw-wishes', label: 'Wishes' } : null,
  ].filter(Boolean) as NavItem[]

  // The guest a personal link was made for: ?to=Mehra+family
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 48))
  }, [])

  /* Their song, on the record. Opening the invitation is a tap, so it may start the song. */
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(false)
  const toggleSong = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [])

  /* The opening: closed (the blessing plays) → opening (a bloom of light) → open. */
  const [phase, setPhase] = useState<Phase>('closed')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  // A tap anywhere opens the invitation, but only once the blessing has been read; the button works from the start.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true)
      return
    }
    setReady(false)
    const t = window.setTimeout(() => setReady(true), after + 600)
    return () => window.clearTimeout(t)
  }, [after])
  // In the builder, picking the other opening shows it from the start.
  const shownIntro = useRef(intl)
  useEffect(() => {
    if (!isPreview || shownIntro.current === intl) return
    shownIntro.current = intl
    timers.current.forEach((t) => window.clearTimeout(t))
    setPhase('closed')
  }, [intl, isPreview])
  // Everything below the names is built once the guest taps, as a low-priority render while the light
  // blooms (it plays on the compositor), so the page never freezes at the moment it opens.
  const [rest, setRest] = useState(false)
  const open = useCallback(() => {
    if (phase !== 'closed') return
    startTransition(() => setRest(true))
    if (song) {
      if (!isPreview) audioRef.current?.play().catch(() => {})
      setHint(true)
      timers.current.push(window.setTimeout(() => setHint(false), 7000))
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('opening')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('open')
        if (!isPreview) window.scrollTo(0, 0)
      }, 2100),
    )
  }, [phase, isPreview, song])

  /* Two traditions: tie the knot (it joins every pair), or bring the pairs together one at a time. */
  const [tied, setTied] = useState(false)
  const [burst, setBurst] = useState(0)
  const [ripple, setRipple] = useState(false)
  const [joined, setJoined] = useState<number[]>([])
  const tieNow = () => {
    setTied(true)
    setBurst((b) => b + 1)
    setRipple(true)
    timers.current.push(window.setTimeout(() => setRipple(false), 600 + traditions.length * 90 + 900))
  }
  const tie = () => {
    if (!tied) return tieNow()
    // Untie and tie again, for the pleasure of it.
    setTied(false)
    timers.current.push(window.setTimeout(tieNow, 1000))
  }
  const toggleJoin = (i: number) => setJoined((j) => (j.includes(i) ? j.filter((x) => x !== i) : [...j, i]))

  const lineRef = useRef<HTMLDivElement | null>(null)
  const slide = (dir: number) => {
    const el = lineRef.current
    if (el) el.scrollBy({ left: dir * Math.min(300, el.clientWidth * 0.8), behavior: 'smooth' })
  }

  // Sections scrolled out of view stop their twinkling, swaying and drawing, so only what is on screen moves.
  const rootRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!rest || !root || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('tw-off', !e.isIntersecting)), { rootMargin: '200px 0px' })
    root.querySelectorAll(':scope > section, :scope > footer').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rest])

  // The international opening's arch is drawn to the first screen's own size.
  const heroRef = useRef<HTMLElement | null>(null)
  const heroBox = useBoxSize(heroRef)

  const lb = useLightbox(photos.length)
  const alb = useLightbox(album.length)
  const heroH = isPreview ? 'clamp(620px, 205cqi, 900px)' : '100svh'
  const paper: CSSProperties = { background: C.ivory, ...grain(0.05) }
  const longest = Math.max(Array.from(bride).length, Array.from(groom).length)
  const nameSize = `clamp(46px, ${Math.max(10, 18 - longest * 0.55)}cqi, 132px)`
  const words = loveWords.length ? loveWords : [couple]

  return (
    <div ref={rootRef} className="tw relative" data-ph={phase} style={{ background: C.night, color: C.ink, fontFamily: text, containerType: 'inline-size', overflowX: 'clip' }}>
      {/* Raw CSS, not a text child: React escapes > and " in text on the server (see SignatureRajwada). */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tw .tw-sway, .tw .tw-hang { transform-origin: 50% 0; animation: tw-sway var(--sd, 6s) ease-in-out var(--sdl, 0s) infinite alternate; }
        .tw .tw-off * { animation-play-state: paused !important; }
        .tw .tw-i { animation: tw-i-in 1.3s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
        .tw .tw-i.tw-i-drop { animation-name: tw-i-drop; animation-duration: 1.5s; animation-timing-function: cubic-bezier(.3,1.3,.5,1); }
        .tw .tw-i-toran { animation: tw-i-toran 1.3s cubic-bezier(.2,.8,.2,1) .25s both; }
        .tw .tw-i-frame { animation: tw-i-frame 1.6s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
        .tw .tw-rays { width: clamp(820px, 200cqi, 1800px); aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255,232,160,.34) 0deg, rgba(255,232,160,0) 4deg 8deg, rgba(255,232,160,.34) 12deg); -webkit-mask-image: radial-gradient(closest-side, #000 10%, rgba(0,0,0,.5) 40%, transparent 78%); mask-image: radial-gradient(closest-side, #000 10%, rgba(0,0,0,.5) 40%, transparent 78%); animation: tw-i-fade 2.4s ease .1s both, tw-turn 160s linear infinite; }
        .tw .tw-i-glow { translate: -50% -50%; animation: tw-i-fade 2s ease .3s both, tw-breath 3.6s ease-in-out 2.3s infinite alternate; }
        .tw .tw-gold { background: linear-gradient(100deg, #E9B949 0%, #FFF4D2 18%, #F4D88E 32%, #D99A2B 48%, #FFF1C4 64%, #E9B949 80%, #FFF4D2 100%); background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tw-shimmer 7s linear infinite; }
        .tw .tw-sheen { background: linear-gradient(115deg, transparent 38%, rgba(255,255,255,.24) 47%, rgba(255,255,255,.06) 53%, transparent 60%); background-size: 300% 100%; background-position: 120% 0; animation: tw-sheen 1.8s ease-in-out 2.4s both; }
        .tw .tw-mala { transform-origin: 50% 4%; animation: tw-swing 5.5s ease-in-out infinite alternate; }
        .tw .tw-ink { stroke-dasharray: 1 1; stroke-dashoffset: 1; animation: tw-ink var(--dur, 600ms) cubic-bezier(.45,.05,.35,1) var(--d, 0ms) both; }
        .tw .tw-ink-fade { animation: tw-i-fade .7s ease var(--d, 0ms) both; }
        .tw .tw-lamp .tw-flame { animation: tw-lamp .6s ease var(--d, 0ms) both, tw-flicker 1.7s ease-in-out infinite alternate; }
        .tw .tw-lamp .tw-glow { animation: tw-lamp .9s ease var(--d, 0ms) both, tw-breath 2.6s ease-in-out infinite alternate; }
        .tw .tw-open .tw-shine { left: -40%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.6), transparent); animation: tw-shine 3.4s ease-in-out calc(var(--d, 0ms) + 900ms) infinite; }
        .tw .tw-i-bloom { translate: -50% -50%; opacity: 0; transform: scale(.25); background: radial-gradient(closest-side, #FFFBEA 0%, #FFE9AE 38%, rgba(255,214,130,.6) 62%, rgba(255,200,110,0) 100%); }
        .tw .tw-intro.is-opening { pointer-events: none; animation: tw-out .9s ease 1.15s forwards; }
        .tw .tw-intro.is-opening .tw-i-bloom { animation: tw-bloom 1.3s cubic-bezier(.45,0,.25,1) forwards; }
        .tw .tw-intro.is-opening .tw-cover-front { transition: transform 1.6s cubic-bezier(.5,0,.2,1), opacity .7s ease .4s; transform: scale(1.05); opacity: 0; }
        .tw .tw-intro.is-opening .tw-i-toran { animation: tw-up 1s cubic-bezier(.5,0,.2,1) .1s forwards; }
        .tw .tw-intro.is-opening .tw-bell { animation: tw-ring .7s ease-in-out; }
        .tw .tw-bell { transform-origin: 50% 8%; }
        .tw .tw-comet { stroke-dasharray: .07 2; stroke-dashoffset: .07; animation: tw-comet var(--dur, 2000ms) cubic-bezier(.45,.05,.35,1) var(--d, 0ms) both, tw-comet-fade var(--dur, 2000ms) linear var(--d, 0ms) both; }
        .tw .tw-dot { transform-box: fill-box; transform-origin: center; animation: tw-dot .8s cubic-bezier(.3,1.6,.5,1) var(--d, 0ms) both; }
        .tw .tw-shoot { transform-origin: 100% 50%; opacity: 0; animation: tw-shoot 9s ease-in 2.4s infinite; }
        .tw .tw-ring-glow { translate: -50% -50%; animation: tw-i-fade 1.4s ease var(--d, 0ms) both, tw-breath 3.8s ease-in-out calc(var(--d, 0ms) + 1.4s) infinite alternate; }
        .tw .tw-intl-words { justify-content: center; }
        .tw .tw-intl-names { font-size: var(--nm-stack); }
        .tw .tw-intl-foot { padding-top: clamp(16px, 5cqh, 48px); }
        @container (orientation: portrait) and (max-width: 640px) { .tw .tw-intl-words { justify-content: flex-end; } }
        @container (min-width: 760px) { .tw .tw-intl-names { font-size: var(--nm-line); } }
        @container (max-width: 640px) { .tw .tw-intl-foot { padding-top: clamp(58px, 11cqh, 78px); } }
        .tw .tw-intl.is-opening .tw-cover-front { transform: scale(1.03) translateY(-2%); }
        .tw .tw-medal { animation: tw-float 6s ease-in-out infinite; }
        .tw .tw-hint { animation: tw-breathe 2.6s ease-in-out infinite; }
        .tw .tw-kb { animation: tw-kb 28s ease-in-out infinite alternate; transform-origin: 50% 35%; }
        .tw .tw-rise { transition: opacity 1.2s ease var(--d, 0ms), transform 1.5s cubic-bezier(.2,.7,.2,1) var(--d, 0ms); }
        .tw[data-ph="closed"] .tw-rise { opacity: 0; transform: translateY(26px); }
        .tw[data-ph="opening"] .tw-rise { transition-delay: calc(var(--d, 0ms) + 1000ms); }
        .tw .tw-petals { container-type: size; }
        .tw .tw-petal { position: absolute; top: -40px; animation: tw-fall var(--fd) linear var(--fdl) infinite; }
        .tw .tw-petal > svg { display: block; width: 100%; height: 100%; animation: tw-tumble var(--td) ease-in-out infinite alternate; }
        .tw .tw-marquee { animation: tw-marquee 46s linear infinite; }
        .tw .tw-draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) var(--d, 0ms); }
        .tw .is-in .tw-draw { stroke-dashoffset: 0; }
        .tw .tw-pop { opacity: 0; transform: scale(.3); transform-box: fill-box; transform-origin: center; transition: opacity .7s ease var(--d, 0ms), transform 1s cubic-bezier(.3,1.5,.5,1) var(--d, 0ms); }
        .tw .is-in .tw-pop { opacity: 1; transform: none; }
        .tw .tw-label { opacity: 0; translate: 0 8px; transition: opacity .8s ease var(--d, 0ms), translate .8s ease var(--d, 0ms); }
        .tw .is-in .tw-label { opacity: 1; translate: 0 0; }
        .tw .tw-halo { animation: tw-halo 3.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .tw .tw-flame { animation: tw-flicker 1.7s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
        .tw .tw-glow { animation: tw-glow 2.6s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
        .tw .tw-twinkle { animation: tw-twinkle 3.4s ease-in-out infinite; }
        .tw .tw-ribbon { animation: tw-ribbon 5s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0; }
        .tw .tw-bulb { animation: tw-bulb 1.6s ease-in-out infinite; }
        .tw .tw-flip { animation: tw-flip .55s cubic-bezier(.3,1.3,.5,1); }
        .tw .tw-vinyl { animation: tw-spin 3.4s linear infinite; animation-play-state: paused; }
        .tw .tw-vinyl.is-on { animation-play-state: running; }
        .tw .tw-arm { transform-origin: 85% 12%; transform: rotate(-30deg); transition: transform .7s cubic-bezier(.4,1.4,.5,1); }
        .tw .tw-arm.is-on { transform: rotate(0deg); }
        .tw .tw-line { scrollbar-width: none; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
        .tw .tw-line::-webkit-scrollbar { display: none; }
        .tw .tw-snap { scroll-snap-align: center; }
        .tw .tw-btn { transition: background-color .2s ease, color .2s ease, border-color .2s ease, filter .2s ease; border-radius: 999px; font-family: inherit; }
        .tw .tw-link { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; }
        .tw .tw-names > span { display: block; }
        .tw .tw-wide { display: none; }
        .tw .tw-hero-media { height: 122%; object-position: 50% 0; transform-origin: 50% 20%; }
        .tw .tw-chand { transform-box: view-box; transform-origin: 500px 410px; animation: tw-swing 4.6s ease-in-out infinite alternate; }
        .tw .tw-veil { transform-box: fill-box; animation: tw-veil 5s ease-in-out infinite alternate; }
        .tw .tw-wall { columns: 2; column-gap: 20px; }
        .tw .tw-ways { display: grid; gap: 30px; }
        .tw .tw-half { transition: transform .75s cubic-bezier(.3,1.4,.5,1); }
        .tw .tw-pair:not(.is-joined) .tw-half-h { transform: translateX(-10px) rotate(-1.4deg); }
        .tw .tw-pair:not(.is-joined) .tw-half-u { transform: translateX(10px) rotate(1.4deg); }
        .tw .tw-seal { transform: translate(-50%, -50%) scale(1); transition: transform .55s cubic-bezier(.3,1.8,.5,1), opacity .3s ease; }
        .tw .tw-pair:not(.is-joined) .tw-seal { transform: translate(-50%, -50%) scale(.2); opacity: 0; }
        .tw .tw-pair:focus-visible { outline: 2px solid #C2185B; outline-offset: 6px; border-radius: 16px; }
        .tw .tw-cloth { transform-box: view-box; transition: transform 1s cubic-bezier(.5,-0.1,.25,1.15); }
        .tw .tw-cloth-l { transform-origin: 110px 14px; }
        .tw .tw-cloth-r { transform-origin: 290px 14px; }
        .tw .tw-cloth-l.is-tied { transform: rotate(-38deg); }
        .tw .tw-cloth-r.is-tied { transform: rotate(38deg); }
        .tw .tw-cloth-sway { transform-box: fill-box; transform-origin: 50% 0; animation: tw-swing var(--sd, 6s) ease-in-out var(--sdl, 0s) infinite alternate; }
        .tw .tw-bow { transform-box: fill-box; transform-origin: center; transform: scale(0); opacity: 0; transition: transform .6s cubic-bezier(.3,1.7,.5,1), opacity .2s ease; }
        .tw .tw-bow.is-tied { transform: scale(1.35); opacity: 1; transition-delay: .7s; }
        .tw .tw-burst { transform-box: fill-box; transform-origin: center; animation: tw-burst 1.5s cubic-bezier(.2,.7,.3,1) both; }
        .tw .tw-tie { transition: background .3s ease, color .3s ease, transform .2s ease; }
        .tw .tw-tie:active { transform: scale(.97); }
        .tw .tw-wide-in { display: none; }
        @container (min-width: 720px) { .tw .tw-wide-in { display: block; } }
        .tw .tw-wall > li { break-inside: avoid; padding: 12px 0 30px; }
        .tw .tw-dinner { display: grid; gap: 48px; grid-template-columns: 1fr; }
        .tw .tw-worlds { display: grid; grid-template-columns: 1fr; }
        .tw .tw-cards { display: grid; gap: 16px; grid-template-columns: 1fr; }
        .tw details > summary { list-style: none; cursor: pointer; }
        .tw details > summary::-webkit-details-marker { display: none; }
        .tw details .tw-plus { transition: transform .25s ease; }
        .tw details[open] .tw-plus { transform: rotate(45deg); }
        @container (min-width: 560px) { .tw .tw-cards { grid-template-columns: 1fr 1fr; } }
        @container (min-width: 760px) {
          .tw .tw-names > span { display: inline; }
          .tw .tw-wide { display: block; }
          .tw .tw-narrow { display: none; }
          .tw .tw-hero-media { height: 100%; }
          .tw .tw-wall { columns: 3; column-gap: 44px; }
          .tw .tw-wall > li { padding-bottom: 46px; }
          .tw .tw-dinner { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); align-items: center; gap: 6cqi; }
          .tw .tw-worlds { grid-template-columns: 1fr 1fr; }
        }
        @container (min-width: 1100px) { .tw .tw-wall { columns: 4; } }
        @container (min-width: 900px) { .tw .tw-ways { grid-template-columns: 1fr 1fr; gap: 36px 32px; } .tw .tw-ways > li:last-child:nth-child(odd) { grid-column: 1 / -1; justify-self: center; width: calc(50% - 16px); } }
        @keyframes tw-sway { from { transform: rotate(-1.8deg); } to { transform: rotate(1.8deg); } }
        @keyframes tw-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes tw-breathe { 0%, 100% { opacity: .6; } 50% { opacity: 1; } }
        @keyframes tw-kb { from { transform: scale(1.03); } to { transform: scale(1.16) translate(-1.5%, -1%); } }
        @keyframes tw-fall { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(var(--fx, 30px), calc(100cqh + 90px), 0); } }
        @keyframes tw-tumble { from { transform: rotate(-35deg) rotateY(0deg); } to { transform: rotate(150deg) rotateY(170deg); } }
        @keyframes tw-marquee { to { transform: translateX(-50%); } }
        @keyframes tw-halo { 0%, 100% { opacity: .3; transform: scale(.8); } 50% { opacity: .85; transform: scale(1.2); } }
        @keyframes tw-flicker { 0% { transform: scale(1, 1) skewX(0); } 45% { transform: scale(.95, 1.07) skewX(-2deg); } 100% { transform: scale(1.04, .95) skewX(2deg); } }
        @keyframes tw-glow { from { opacity: .55; transform: scale(.92); } to { opacity: 1; transform: scale(1.08); } }
        @keyframes tw-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        @keyframes tw-ribbon { from { transform: rotate(-3deg); } to { transform: rotate(4deg); } }
        @keyframes tw-bulb { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
        @keyframes tw-flip { from { transform: perspective(240px) rotateX(-100deg); opacity: .2; } to { transform: none; opacity: 1; } }
        @keyframes tw-spin { to { transform: rotate(360deg); } }
        @keyframes tw-i-in { from { opacity: 0; transform: translateY(12px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes tw-i-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tw-i-drop { 0% { opacity: 0; transform: translateY(-9%); } 55% { opacity: 1; } 100% { opacity: 1; transform: none; } }
        @keyframes tw-i-toran { from { transform: translateY(-105%); } to { transform: none; } }
        @keyframes tw-i-frame { from { opacity: 0; transform: translateY(20px) scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes tw-turn { to { rotate: 360deg; } }
        @keyframes tw-breath { from { transform: scale(.94); } to { transform: scale(1.07); } }
        @keyframes tw-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
        @keyframes tw-sheen { from { background-position: 120% 0; } to { background-position: -40% 0; } }
        @keyframes tw-swing { from { transform: rotate(-.7deg); } to { transform: rotate(.7deg); } }
        @keyframes tw-veil { from { transform: rotate(0deg) skewX(0deg); } to { transform: rotate(1.6deg) skewX(-1.5deg); } }
        @keyframes tw-lamp { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tw-shine { 0% { left: -40%; } 45%, 100% { left: 120%; } }
        @keyframes tw-out { to { opacity: 0; } }
        @keyframes tw-bloom { 0% { opacity: 0; transform: scale(.25); } 35% { opacity: 1; } 100% { opacity: 1; transform: scale(11); } }
        @keyframes tw-up { to { transform: translateY(-110%); } }
        @keyframes tw-burst { 0% { transform: translate(0, 0) scale(.3) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translate(var(--bx), var(--by)) scale(1) rotate(var(--br)); opacity: 0; } }
        @keyframes tw-ink { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes tw-ring { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(18deg); } 45% { transform: rotate(-14deg); } 70% { transform: rotate(8deg); } }
        @keyframes tw-comet { from { stroke-dashoffset: .07; } to { stroke-dashoffset: -.93; } }
        @keyframes tw-comet-fade { 0% { opacity: 0; } 6%, 86% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tw-dot { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: none; } }
        @keyframes tw-shoot { 0% { opacity: 0; transform: rotate(22deg) translateX(0) scaleX(.3); } 1.5% { opacity: 1; } 8% { opacity: 0; transform: rotate(22deg) translateX(min(62cqw, 520px)) scaleX(1); } 100% { opacity: 0; transform: rotate(22deg) translateX(min(62cqw, 520px)) scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .tw .tw-sway, .tw .tw-hang, .tw .tw-kb, .tw .tw-marquee, .tw .tw-medal, .tw .tw-hint, .tw .tw-halo, .tw .tw-flame, .tw .tw-glow, .tw .tw-twinkle, .tw .tw-ribbon, .tw .tw-bulb, .tw .tw-flip, .tw .tw-vinyl { animation: none; }
          .tw .tw-petals { display: none; }
          .tw .tw-draw { transition: none; stroke-dashoffset: 0; }
          .tw .tw-pop, .tw .tw-label { transition: none; opacity: 1; transform: none; translate: none; }
          .tw .tw-rise, .tw .tw-cover-front { transition: none; }
          .tw .tw-ink { animation: none; stroke-dashoffset: 0; }
          .tw .tw-chand, .tw .tw-veil, .tw .tw-cloth-sway { animation: none; }
          .tw .tw-half, .tw .tw-seal, .tw .tw-cloth, .tw .tw-bow { transition: none; }
          .tw .tw-burst { display: none; }
          .tw .tw-i, .tw .tw-ink-fade, .tw .tw-i-toran, .tw .tw-i-frame, .tw .tw-rays, .tw .tw-i-glow, .tw .tw-gold, .tw .tw-mala, .tw .tw-lamp .tw-flame, .tw .tw-lamp .tw-glow { animation: none; }
          .tw .tw-sheen, .tw .tw-open .tw-shine { display: none; }
          .tw .tw-comet, .tw .tw-shoot { display: none; }
          .tw .tw-dot, .tw .tw-ring-glow { animation: none; }
        }
      ` }} />
      <FolkDefs />

      {song && (
        <>
          <audio ref={audioRef} src={song} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          {phase === 'open' && <Record playing={playing} label={couplePhoto} onToggle={toggleSong} title={songTitle} hint={hint} isPreview={isPreview} />}
        </>
      )}

      {/* ── The opening: their names over their photo or video ─────────────── */}
      <section ref={heroRef} id="tw-top" className="relative overflow-hidden" style={{ minHeight: heroH, background: C.night }}>
        {/* Their names sit at the top, so the photo is shown from its top edge: the couple stand in the lower half.
            On a phone it runs a little past the foot of the screen, which lowers them further. */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {heroVideo ? (
            <video src={heroVideo} poster={couplePhoto || undefined} autoPlay muted loop playsInline preload="auto" className="tw-hero-media absolute inset-x-0 top-0 w-full object-cover" />
          ) : couplePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={couplePhoto} alt="" className="tw-kb tw-hero-media absolute inset-x-0 top-0 w-full object-cover" />
          ) : (
            // No photo of their own: the palace doorway at dusk, drawn and moving, with a couple anyone can be.
            <PalaceScene className="absolute inset-0 h-full w-full" />
          )}
          {/* Dark at the top where the names are, with a soft pool behind the words; the couple below stay bright. */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 78% 40% at 50% 30%, rgba(20,13,34,0.58) 0%, rgba(20,13,34,0.32) 55%, rgba(20,13,34,0) 100%), linear-gradient(180deg, rgba(20,13,34,0.8) 0%, rgba(20,13,34,0.56) 26%, rgba(20,13,34,0.3) 46%, rgba(20,13,34,0.06) 60%, rgba(20,13,34,0) 68%, rgba(20,13,34,0.5) 88%, #140D22 100%)' }} />
        </div>

        <CornerStrands lengths={[280, 400, 210]} className="z-[1]" />
        <Petals />

        <div className="relative z-[2] mx-auto flex max-w-[72rem] flex-col items-center px-6 pb-28 text-center" style={{ minHeight: heroH, paddingTop: 'clamp(48px, 7svh, 76px)' }}>
          {/* Ganesha's blessing stays with the names, small, the way it heads a wedding card. */}
          {blessed && (
            <div className="tw-rise mb-4 flex flex-col items-center" style={{ ['--d' as string]: '0ms' }}>
              {ownPicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ownPicture} alt="" className="h-[68px] w-[68px] rounded-full object-cover" style={{ boxShadow: `0 0 0 2px ${C.goldLight}, 0 8px 22px rgba(10,6,18,0.6)` }} />
              ) : (
                <GaneshaArt color={C.goldLight} className="w-[clamp(60px,16cqi,96px)]" style={{ filter: 'drop-shadow(0 2px 10px rgba(10,6,18,0.75))' }} />
              )}
              <p lang="hi" className="mt-1.5" style={{ fontFamily: deva, fontSize: 'clamp(17px, 4.6cqi, 21px)', color: C.goldLight, textShadow: '0 1px 12px rgba(10,6,18,0.9)' }}>॥ शुभ विवाह ॥</p>
            </div>
          )}
          {/* With the international opening, its two rings head the names instead. */}
          {intl && (
            <div className="tw-rise mb-5 flex items-center gap-3" style={{ ['--d' as string]: '0ms' }}>
              <span aria-hidden className="h-px w-[clamp(28px,9cqi,56px)]" style={{ background: 'linear-gradient(90deg, rgba(244,216,142,0), rgba(244,216,142,0.9))' }} />
              <Rings className="w-[clamp(66px,17cqi,104px)]" style={{ filter: 'drop-shadow(0 3px 12px rgba(10,6,18,0.8))' }} />
              <span aria-hidden className="h-px w-[clamp(28px,9cqi,56px)]" style={{ background: 'linear-gradient(90deg, rgba(244,216,142,0.9), rgba(244,216,142,0))' }} />
            </div>
          )}
          {greetings.length > 0 && (
            <p className="tw-rise mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1" style={{ ['--d' as string]: '150ms' }}>
              {greetings.map((g, i) => (
                <span key={g} className="inline-flex items-center gap-3" style={{ fontFamily: isDeva(g) ? deva : text, fontSize: 16, color: C.goldLight, letterSpacing: '0.04em', textShadow: '0 1px 12px rgba(10,6,18,0.9), 0 0 2px rgba(10,6,18,0.6)' }}>
                  {i > 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: i % 2 ? C.kalyna : C.marigold }} />}
                  {g}
                </span>
              ))}
            </p>
          )}
          <h1 className="tw-rise tw-names" style={{ ['--d' as string]: '350ms', fontFamily: display, fontSize: nameSize, lineHeight: 0.98, color: C.cream, textShadow: '0 4px 36px rgba(10,6,18,0.55)' }}>
            <span>{groom}</span>
            <span className="px-[0.18em]" style={{ fontFamily: script, fontSize: '0.78em', lineHeight: 1, color: C.goldLight }}>&amp;</span>
            <span>{bride}</span>
          </h1>
          {tagline && (
            <p className="tw-rise mt-5 max-w-[30rem] text-balance italic" style={{ ['--d' as string]: '550ms', fontSize: 'clamp(19px, 5.2cqi, 25px)', lineHeight: 1.45, color: 'rgba(255,249,238,0.95)', textShadow: '0 1px 14px rgba(10,6,18,0.9)' }}>
              {tagline}
            </p>
          )}
          {(date || venue) && (
            <div className="tw-rise mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 uppercase" style={{ ['--d' as string]: '700ms', fontSize: 13, letterSpacing: '0.24em', color: 'rgba(255,249,238,0.92)', textShadow: '0 1px 12px rgba(10,6,18,0.9)' }}>
              {date && <span>{date.day} {date.month} {date.year}</span>}
              {date && venue && <span aria-hidden className="tw-wide h-1 w-1 rounded-full" style={{ background: C.goldLight }} />}
              {venue && <span>{venue}</span>}
            </div>
          )}
          {!isPreview && phase === 'open' && nav[0] && (
            <a href={`#${nav[0].id}`} className="tw-rise absolute bottom-7 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2" style={{ ['--d' as string]: '900ms', color: C.goldLight }}>
              <span className="uppercase" style={{ fontSize: 11, letterSpacing: '0.28em' }}>Our story</span>
              <svg aria-hidden viewBox="0 0 12 40" className="tw-hint h-9 w-3"><path d="M6 0V36M2 31L6 37 10 31" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" /></svg>
            </a>
          )}
        </div>

        {/* ── The first screen: Lord Ganesha's blessing, before anything else ── */}
        {phase !== 'open' && !intl && (
          <div className={`tw-intro absolute inset-0 z-30 overflow-hidden ${phase === 'opening' ? 'is-opening' : ''}`}>
            <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 62% at 50% 44%, #FFC75A 0%, #F68A22 14%, #E2452F 30%, ${C.rani} 44%, #73103F 66%, #2C0A27 86%, ${C.night} 100%)` }} />
            <Petals count={12} />
            <div aria-hidden className="tw-i-toran pointer-events-none absolute inset-x-0 top-0 z-[1]">
              <MarigoldToran swags={13} />
            </div>

            {/* Once the blessing has been read, a tap anywhere opens it too; the button is the real control. */}
            {phase === 'closed' && ready && <button type="button" tabIndex={-1} aria-hidden onClick={open} className="absolute inset-0 z-[1] cursor-pointer" />}

            <div className="tw-cover-front pointer-events-none relative z-[2] flex h-full flex-col items-center px-5 text-center" style={{ paddingTop: 'clamp(84px, 11svh, 112px)', paddingBottom: 'clamp(14px, 3svh, 30px)' }}>
              {guest && <p className="tw-i" style={{ ['--d' as string]: '400ms', fontFamily: hand, fontSize: 'clamp(20px, 5.6cqi, 26px)', lineHeight: 1.15, color: C.goldLight }}>For {guest},</p>}
              {invocation && (
                <p lang="sa" className="tw-i" style={{ ['--d' as string]: '600ms' }}>
                  <span className="tw-gold inline-block" style={{ fontFamily: deva, fontSize: 'clamp(26px, 7.4cqi, 46px)', lineHeight: 1.3, filter: 'drop-shadow(0 2px 12px rgba(70,0,24,0.55))' }}>{invocation}</span>
                </p>
              )}
              <p aria-hidden className="tw-i mt-1 flex items-center gap-3" style={{ ['--d' as string]: '900ms' }}>
                <span className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,226,150,0.8))' }} />
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]"><Stamp id="tw-mg1" x={12} y={12} r={11} /></svg>
                <span className="h-px w-12" style={{ background: 'linear-gradient(90deg, rgba(255,226,150,0.8), transparent)' }} />
              </p>

              {/* The picture with the shloka either side of it on a wide screen, below it on a phone. The stage is
                  a size container, so the medallion can be sized from whatever height is left (Safari won't size a
                  stretched flex item from its aspect ratio). */}
              <div className="relative mt-[1.4svh] flex min-h-0 w-full max-w-[66rem] flex-1 justify-center gap-[5cqi]" style={{ containerType: 'size' }}>
                {shloka.length > 0 && (
                  <Verse lines={shloka.slice(0, half)} from={0} align="right" className="tw-wide-in min-w-0 flex-1 self-center" style={{ fontSize: 'clamp(22px, 3.1cqi, 32px)', lineHeight: 1.6 }} />
                )}
                {/* The medallion is two-thirds of this box's height; the mala's top and its tassel fill the rest. */}
                <div className="relative flex shrink-0 items-center" style={{ width: 'min(66cqw, 66.6cqh)' }}>
                  <div className="relative w-full" style={{ aspectRatio: '100/150' }}>
                    <span aria-hidden className="tw-rays pointer-events-none absolute left-1/2 top-[41.3%]" />
                    <span aria-hidden className="tw-i-glow pointer-events-none absolute left-1/2 top-[41.3%] aspect-square w-[175%] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(255,240,190,0.85), rgba(255,196,90,0.45) 45%, rgba(255,160,60,0) 100%)' }} />
                    <div className="tw-i-frame absolute inset-x-0 top-[8%]" style={{ ['--d' as string]: `${MEDALLION_AT}ms` }}>
                      {blessed ? (
                        <Medallion photo={ownPicture} />
                      ) : (
                        <div className="tw-medal relative">
                          <WreathMedallion className="relative block w-full" />
                          <span aria-hidden className="absolute left-1/2 top-[42.4%] flex -translate-x-1/2 -translate-y-1/2 items-baseline gap-1" style={{ fontFamily: display, fontSize: 'clamp(28px, 8cqi, 42px)', color: C.cream }}>
                            {initial(groom)}
                            <span style={{ fontFamily: script, fontSize: '0.9em', color: C.goldLight }}>&amp;</span>
                            {initial(bride)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {shloka.length > 0 && (
                  <Verse lines={shloka.slice(half)} from={half} align="left" className="tw-wide-in min-w-0 flex-1 self-center" style={{ fontSize: 'clamp(22px, 3.1cqi, 32px)', lineHeight: 1.6 }} />
                )}
              </div>

              {shloka.length > 0 ? (
                <Verse lines={shloka} from={0} align="center" className="tw-narrow mt-[1.6svh]" style={{ fontSize: 'clamp(17px, 4.8cqi, 21px)', lineHeight: 1.48 }} />
              ) : (
                <p className="tw-i mt-[2svh]" style={{ ['--d' as string]: '1600ms', fontFamily: display, fontSize: 'clamp(28px, 8.4cqi, 50px)', lineHeight: 1.08, color: C.cream, textShadow: '0 2px 20px rgba(10,6,18,0.7)' }}>
                  Two worlds.
                  <span className="block" style={{ fontFamily: script, fontSize: '1.2em', lineHeight: 1, color: C.goldLight }}>One love.</span>
                </p>
              )}
              {meaning && (
                <p className="tw-i mx-auto mt-[1.2svh] max-w-[34rem] text-balance italic" style={{ ['--d' as string]: `${after}ms`, fontSize: 'clamp(14.5px, 3.9cqi, 18px)', lineHeight: 1.45, color: 'rgba(255,241,214,0.86)', textShadow: '0 1px 10px rgba(50,0,20,0.6)' }}>
                  {meaning}
                </p>
              )}

              <div className="mt-[2svh] flex items-end gap-3.5">
                <Lamp at={1200} />
                <OpenButton
                  onClick={open}
                  disabled={phase !== 'closed'}
                  label={`Open ${couple}'s wedding invitation`}
                  delay={after + 300}
                  icon={
                    <svg aria-hidden viewBox="0 0 24 24" className="tw-bell h-[18px] w-[18px]">
                      <path d="M12 2.5V5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                      <path d="M6.2 17.2C6.2 11 8.4 6.4 12 6.4S17.8 11 17.8 17.2Z" fill="currentColor" />
                      <path d="M4.6 17.4H19.4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                      <circle cx={12} cy={20.2} r={1.6} fill="currentColor" />
                    </svg>
                  }
                />
                <Lamp at={1450} />
              </div>
              <p className="tw-i mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 uppercase" style={{ ['--d' as string]: `${after + 500}ms`, fontSize: 11.5, letterSpacing: '0.22em', color: 'rgba(255,241,214,0.78)' }}>
                <span>{couple}</span>
                {date && <span aria-hidden className="h-1 w-1 rounded-full" style={{ background: C.goldLight }} />}
                {date && <span>{date.day} {date.month} {date.year}</span>}
                {song && !isPreview && <span className="basis-full" style={{ color: C.goldLight }}>♪ Sound on</span>}
              </p>
            </div>
            <div aria-hidden className="tw-i-bloom pointer-events-none absolute left-1/2 top-[44%] z-[4] aspect-square w-[34cqi] rounded-full" />
          </div>
        )}

        {/* ── Or the international first screen: dusk over the Earth, their two cities, an arch of gold ── */}
        {phase !== 'open' && intl && (
          <div className={`tw-intro tw-intl absolute inset-0 z-30 overflow-hidden ${phase === 'opening' ? 'is-opening' : ''}`} style={{ containerType: 'size' }}>
            <HorizonSky />
            {heroBox && <HorizonArch w={heroBox.w} h={heroBox.h} his={splitPlace(homes.groom)} hers={splitPlace(homes.bride)} draw />}

            {phase === 'closed' && ready && <button type="button" tabIndex={-1} aria-hidden onClick={open} className="absolute inset-0 z-[1] cursor-pointer" />}

            <div className="tw-cover-front pointer-events-none absolute inset-0 z-[2]">
              {guest && (
                <p className="tw-i absolute inset-x-0 text-center" style={{ ['--d' as string]: '300ms', top: 'max(14px, 3.4cqh)', fontFamily: hand, fontSize: 'clamp(20px, min(5.6cqw, 3.4cqh), 28px)', lineHeight: 1.15, color: C.goldLight }}>
                  For {guest},
                </p>
              )}
              {/* The rings, where the two lines meet. */}
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${RINGS_AT * 100}%`, width: INTL_RINGS }}>
                <span aria-hidden className="tw-ring-glow absolute left-1/2 top-1/2 aspect-square w-[230%] rounded-full" style={{ ['--d' as string]: `${HORIZON_TIMES.rings + 400}ms`, background: 'radial-gradient(closest-side, rgba(255,236,190,0.55), rgba(255,200,140,0.18) 55%, rgba(255,200,140,0) 100%)' }} />
                <Rings draw start={HORIZON_TIMES.rings} className="relative block w-full" style={{ filter: 'drop-shadow(0 2px 10px rgba(20,10,40,0.55))' }} />
              </div>

              {/* Their names inside the arch. */}
              <div
                className="tw-intl-words absolute inset-x-0 flex flex-col items-center text-center"
                style={{ top: `calc(${RINGS_AT * 100}% + ${INTL_RINGS} * 0.36 + 10px)`, bottom: `calc(${(1 - HORIZON_AT) * 100}% + 16px)`, paddingInline: 'calc(50cqw - min(40cqw, 78cqh) + 16px)' }}
              >
                <p className="tw-i uppercase" style={{ ['--d' as string]: `${HORIZON_TIMES.words}ms`, fontSize: 'clamp(10px, min(2.8cqw, 1.6cqh), 13px)', letterSpacing: 'clamp(0.16em, 0.6cqw, 0.32em)', color: '#F3D7A0', textShadow: '0 1px 10px rgba(8,6,30,0.8)' }}>
                  Together with their families
                </p>
                <h2
                  className="tw-i tw-names tw-intl-names mt-[1.4cqh]"
                  style={{
                    ['--d' as string]: `${HORIZON_TIMES.words + 250}ms`,
                    // Fitted inside the arch (its width less a margin, at about 0.62em a letter): to the longer
                    // name when they stand one above the other, to both together when they share a line.
                    ['--nm-stack' as string]: `max(30px, min(14.5cqw, 112px, 10cqh, calc((min(80cqw, 156cqh) - 40px) / ${q(0.62 * longest)})))`,
                    ['--nm-line' as string]: `max(30px, min(112px, 10cqh, calc((min(80cqw, 156cqh) - 40px) / ${q(0.62 * (Array.from(groom).length + Array.from(bride).length + 2))})))`,
                    fontFamily: display,
                    lineHeight: 1.02,
                    color: C.cream,
                    textShadow: '0 2px 26px rgba(10,6,30,0.65)',
                  }}
                >
                  <span>{groom}</span>
                  <span className="tw-gold px-[0.16em]" style={{ fontFamily: script, fontSize: '0.8em', lineHeight: 1.05 }}>&amp;</span>
                  <span>{bride}</span>
                </h2>
                <p className="tw-i mt-[1.6cqh] max-w-[26rem] text-balance italic" style={{ ['--d' as string]: `${HORIZON_TIMES.words + 600}ms`, fontSize: 'clamp(15px, min(4.5cqw, 2.5cqh), 22px)', lineHeight: 1.4, color: 'rgba(255,241,226,0.92)', textShadow: '0 1px 12px rgba(8,6,30,0.8)' }}>
                  invite you to celebrate their marriage
                </p>
                {(date || venue) && <DiamondRule className="tw-i mt-[1.8cqh]" style={{ ['--d' as string]: `${HORIZON_TIMES.words + 800}ms` }} />}
                {date && (
                  <p className="tw-i mt-[1.5cqh] text-balance uppercase" style={{ ['--d' as string]: `${HORIZON_TIMES.words + 950}ms`, fontSize: 'clamp(11px, min(3.1cqw, 1.75cqh), 14px)', letterSpacing: '0.24em', lineHeight: 1.6, color: C.goldLight, textShadow: '0 1px 10px rgba(8,6,30,0.8)' }}>
                    {date.weekday} · {date.day} {date.month} {date.year}
                  </p>
                )}
                {venue && (
                  <p className="tw-i mt-1 text-balance italic" style={{ ['--d' as string]: `${HORIZON_TIMES.words + 1050}ms`, fontSize: 'clamp(14px, min(4.1cqw, 2.3cqh), 19px)', lineHeight: 1.35, color: 'rgba(255,249,238,0.86)', textShadow: '0 1px 10px rgba(8,6,30,0.8)' }}>
                    {venue}
                  </p>
                )}
              </div>

              {/* On the dark of the Earth, below the cities. */}
              <div className="tw-intl-foot absolute inset-x-0 bottom-0 flex flex-col items-center px-5 text-center" style={{ top: `${HORIZON_AT * 100}%` }}>
                <OpenButton
                  onClick={open}
                  disabled={phase !== 'closed'}
                  label={`Open ${couple}'s wedding invitation`}
                  delay={after}
                  icon={
                    <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
                      <rect x={3} y={5.5} width={18} height={13} rx={2} />
                      <path d="M3.6 7.2L12 13.4L20.4 7.2" strokeLinecap="round" />
                    </svg>
                  }
                />
                {song && !isPreview && (
                  <p className="tw-i mt-2.5 uppercase" style={{ ['--d' as string]: `${after + 200}ms`, fontSize: 11, letterSpacing: '0.24em', color: C.goldLight }}>♪ Sound on</p>
                )}
              </div>
            </div>
            <div aria-hidden className="tw-i-bloom pointer-events-none absolute left-1/2 z-[4] aspect-square w-[34cqi] rounded-full" style={{ top: `${RINGS_AT * 100}%` }} />
          </div>
        )}
      </section>

      {(rest || phase === 'open') && (
        <>
          <SectionNav
            items={nav}
            className="sticky top-0 z-30 border-b"
            style={{ background: 'rgba(20,13,34,0.94)', borderColor: 'rgba(214,168,70,0.35)', backdropFilter: 'blur(8px)' }}
            linkStyle={{ fontFamily: text, fontSize: 15, color: 'rgba(255,249,238,0.72)' }}
            activeColor={C.goldLight}
            underline={C.marigold}
          />

          {/* ── Love, in each of their languages ──────────────────────────── */}
          <div aria-hidden className="relative overflow-hidden py-3" style={{ background: `linear-gradient(90deg, ${C.saffron}, ${C.rani} 50%, ${C.kalyna})` }}>
            <div className="tw-marquee flex w-max items-center">
              {[0, 1].map((k) => (
                <div key={k} className="flex items-center">
                  {Array.from({ length: 4 }, (_, r) =>
                    words.map((w, i) => (
                      <span key={`${r}-${i}`} className="flex items-center">
                        <span className="whitespace-nowrap px-6" style={{ fontSize: 38, lineHeight: 1.2, color: C.cream }}><span style={scriptWord(w)}>{w}</span></span>
                        <svg viewBox="0 0 24 24" className="h-5 w-5"><Stamp id={(i + r) % 2 ? 'tw-sf' : 'tw-mg1'} x={12} y={12} r={11} /></svg>
                      </span>
                    )),
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── I. Written in the stars ───────────────────────────────────── */}
          {hasStars && (
            <section id="tw-begin" className="relative overflow-hidden px-6 pb-20 pt-20" style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.night2} 40%, #3A1648 78%, #5A1A45 100%)`, scrollMarginTop: 56 }}>
              <Stars count={110} seed={9} className="absolute inset-0 h-full w-full" />
              <div className="relative mx-auto max-w-[60rem]">
                <Reveal disabled={isPreview}>
                  <Chapter n={no('stars')} light title={<>Written in the <span style={{ fontFamily: script, fontSize: '1.3em', color: C.goldLight }}>stars</span></>} />
                </Reveal>
                {stars.length > 1 && <Constellation stars={stars} isPreview={isPreview} />}
                {loveStory[0] && (
                  <Reveal disabled={isPreview} className="mx-auto mt-14 max-w-[38rem] text-center">
                    <p className="text-balance italic" style={{ fontSize: 'clamp(23px, 6.6cqi, 34px)', lineHeight: 1.4, color: C.cream }}>{loveStory[0]}</p>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── II. The first dinner, in the city where they met ──────────── */}
          {hasDinner && (
            <section id="tw-dinner" className="relative overflow-hidden px-6 pb-24 pt-16" style={{ background: 'linear-gradient(180deg, #5A1A45 0%, #3D1233 34%, #220B1D 100%)', scrollMarginTop: 56 }}>
              <div className="relative mx-auto max-w-[64rem]">
                <Reveal disabled={isPreview}>
                  <Chapter
                    n={no('dinner')}
                    light
                    title={
                      metCity ? (
                        <>
                          <span className="mb-2 block uppercase" style={{ fontFamily: text, fontSize: 'clamp(13px, 3.6cqi, 16px)', letterSpacing: '0.3em', color: 'rgba(255,249,238,0.75)' }}>It began in</span>
                          <span className="italic" style={{ color: C.goldLight }}>{metCity}</span>
                        </>
                      ) : (
                        'Where it began'
                      )
                    }
                  />
                  {metCoords && <p className="mt-3 text-center uppercase tabular-nums" style={{ fontSize: 11.5, letterSpacing: '0.24em', color: 'rgba(244,216,142,0.75)' }}>{metCoords}</p>}
                </Reveal>

                {metCity && (
                  <Reveal disabled={isPreview} className="relative mx-auto mt-8 max-w-[48rem]">
                    <div aria-hidden className="absolute inset-x-[10%] bottom-[8%] top-[30%] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(247,168,23,0.28), transparent)' }} />
                    <NightCity className="relative block w-full" />
                  </Reveal>
                )}

                <div className="tw-dinner mt-12">
                  {metPhoto && (
                    <Reveal disabled={isPreview} className="relative">
                      <figure className="relative mx-auto w-[min(64cqi,22rem)]">
                        <div className="relative aspect-[100/130]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={metPhoto} alt={metCaption || `Where ${couple} met`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={archMask} />
                          <ArchFrame className="absolute -inset-[7px] h-[calc(100%+14px)] w-[calc(100%+14px)]" color={C.goldLight} />
                          <Candle className="absolute -left-[17%] bottom-[-3%] w-[17%]" />
                          <Candle className="absolute -right-[14%] bottom-[-3%] w-[14%]" />
                        </div>
                        {metCaption && (
                          <figcaption className="mt-7 flex items-center justify-center gap-2 -rotate-[2deg]" style={{ fontFamily: hand, fontSize: 'clamp(21px, 5.8cqi, 26px)', color: C.goldLight }}>
                            <Glasses className="h-10 w-10" color={C.goldLight} />
                            {metCaption}
                          </figcaption>
                        )}
                      </figure>
                    </Reveal>
                  )}

                  <Reveal disabled={isPreview} className={metPhoto ? '' : 'mx-auto max-w-[40rem]'}>
                    {metLine && (
                      <p className="text-balance italic" style={{ fontFamily: display, fontSize: 'clamp(24px, 6.8cqi, 36px)', lineHeight: 1.3, color: C.cream }}>
                        <span aria-hidden style={{ color: C.marigold, fontSize: '1.4em', lineHeight: 0, verticalAlign: '-0.3em', marginRight: 6 }}>“</span>
                        {metLine}
                      </p>
                    )}
                    {loveStory.slice(1).map((para, i) => (
                      <p key={i} className={i || metLine ? 'mt-6' : ''} style={{ fontSize: 'clamp(18px, 4.9cqi, 21px)', lineHeight: 1.75, color: 'rgba(255,249,238,0.88)' }}>
                        {i === 0 ? (
                          <>
                            <span aria-hidden className="float-left mr-2.5 mt-1.5" style={{ fontFamily: display, fontSize: '3.6em', lineHeight: 0.8, color: C.marigold }}>{Array.from(para)[0]}</span>
                            <span className="sr-only">{Array.from(para)[0]}</span>
                            {Array.from(para).slice(1).join('')}
                          </>
                        ) : (
                          para
                        )}
                      </p>
                    ))}
                    {loveStory.length > 1 && (
                      <p className="mt-7 text-right -rotate-1" style={{ fontFamily: hand, fontSize: 'clamp(24px, 6.4cqi, 30px)', color: C.goldLight }}>
                        {groom} &amp; {bride}
                      </p>
                    )}
                  </Reveal>
                </div>
              </div>
            </section>
          )}

          {/* ── III. Their years, pegged on a line ────────────────────────── */}
          {hasUs && (
            <section id="tw-us" className="relative overflow-hidden pb-16 pt-[128px]" style={{ ...paper, scrollMarginTop: 56 }}>
              <div className="absolute inset-x-0 top-0">
                <MarigoldToran />
              </div>
              <div className="relative mx-auto max-w-[64rem] px-6">
                <Reveal disabled={isPreview}>
                  <Chapter n={no('us')} title={usTitle} note={yearMarks.length ? `${since} – ${weddingYear}` : undefined} />
                </Reveal>

                {/* The years as flowers on a twisted thread, gold and red. */}
                {yearMarks.length > 1 && (
                  <Reveal disabled={isPreview} className="relative mx-auto mt-10 max-w-[36rem]">
                    <svg aria-hidden viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-x-[7%] top-[6px] h-[24px] w-[86%]">
                      <path d="M0 12C50 2 100 22 150 12S250 2 300 12 350 22 400 12" stroke={C.gold} strokeWidth={1.6} fill="none" vectorEffect="non-scaling-stroke" />
                      <path d="M0 12C50 22 100 2 150 12S250 22 300 12 350 2 400 12" stroke={C.kalyna} strokeWidth={1.6} fill="none" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="relative flex items-start justify-between">
                      {yearMarks.map((y, i) => {
                        const last = i === yearMarks.length - 1
                        return (
                          <div key={y} className="flex w-[54px] flex-col items-center">
                            <svg aria-hidden viewBox="0 0 36 36" className="h-9 w-9">
                              {last ? (
                                <>
                                  <circle cx={18} cy={18} r={16} fill={C.ivory} stroke={C.gold} strokeWidth={1.6} />
                                  <Stamp id="tw-pp" x={18} y={18} r={12} />
                                </>
                              ) : (
                                <Stamp id={i % 2 ? 'tw-sf' : 'tw-mg0'} x={18} y={18} r={16} rot={i * 30} />
                              )}
                            </svg>
                            <span className="mt-1.5 tabular-nums" style={{ fontFamily: display, fontSize: 15, color: last ? C.rani : C.soft }}>{y}</span>
                            {last && <span style={{ fontFamily: hand, fontSize: 18, color: C.rani, whiteSpace: 'nowrap' }}>forever</span>}
                          </div>
                        )
                      })}
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Their photos and moments, pegged on a line like prints left to dry. */}
              {line.length > 0 && (
                <Reveal disabled={isPreview} className="relative mt-12">
                  <div ref={lineRef} className="tw-line overflow-x-auto pb-10 pt-8">
                    <div className="relative flex w-max items-start gap-[26px] px-[max(24px,calc(50cqi-32rem+24px))]">
                      {line.map((item, k) => {
                        const tilt = TILTS[k % TILTS.length]
                        return (
                          <div key={`${item.kind}${item.i}`} className="tw-snap relative w-[clamp(210px,62cqi,280px)] shrink-0">
                            {k === 0 && <Twine className="right-1/2 w-[100cqi]" />}
                            <Twine className={`left-1/2 ${k < line.length - 1 ? 'w-[calc(100%+26px)]' : 'w-[calc(50%+24px)]'}`} />
                            <div className="tw-hang relative" style={{ ['--sd' as string]: `${6 + (k % 3)}s`, ['--sdl' as string]: `${-k * 1.1}s` }}>
                              <Peg />
                              {item.kind === 'photo' ? (
                                <figure style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '50% 0' }}>
                                  <button
                                    type="button"
                                    onClick={() => !isPreview && lb.setOpen(item.i)}
                                    className="block w-full p-[10px] pb-0 text-left"
                                    style={{ background: '#FFFDF8', boxShadow: '0 1px 2px rgba(38,25,46,0.12), 0 22px 34px -22px rgba(38,25,46,0.6)', cursor: isPreview ? 'default' : 'zoom-in' }}
                                    aria-label={`Open photo ${item.i + 1} of ${photos.length}`}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.src} alt={notes[item.i] || `${couple}, a memory`} loading="lazy" className="block aspect-[4/5] w-full object-cover" />
                                    <span className="flex h-[58px] items-center justify-center px-2 text-center" style={{ fontFamily: hand, fontSize: 'clamp(18px, 5cqi, 21px)', lineHeight: 1.1, color: C.ink }}>
                                      {notes[item.i] || ''}
                                    </span>
                                  </button>
                                </figure>
                              ) : (
                                <article className="relative px-6 pb-7 pt-9 text-center" style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '50% 0', background: TAGS[item.i % TAGS.length], color: C.cream, borderRadius: 6, boxShadow: '0 22px 34px -22px rgba(38,25,46,0.6)' }}>
                                  <span aria-hidden className="absolute left-1/2 top-[20px] h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ background: C.ivory, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }} />
                                  {item.m.when && <p className="mt-4" style={{ fontFamily: display, fontSize: 'clamp(30px, 8cqi, 38px)', lineHeight: 1.05 }}>{item.m.when}</p>}
                                  {item.m.title && <h3 className="mt-3 uppercase" style={{ fontSize: 12.5, letterSpacing: '0.22em', color: 'rgba(255,249,238,0.85)' }}>{item.m.title}</h3>}
                                  {item.m.text && <p className="mt-3 text-balance" style={{ fontFamily: hand, fontSize: 'clamp(19px, 5.2cqi, 22px)', lineHeight: 1.3 }}>{item.m.text}</p>}
                                  <svg aria-hidden viewBox="0 0 120 24" className="mx-auto mt-4 block w-[96px]">
                                    <Stamp id="tw-lf1" x={44} y={16} r={10} rot={-70} />
                                    <Stamp id={item.i % 2 ? 'tw-kl' : 'tw-mg0'} x={60} y={12} r={10} />
                                    <Stamp id="tw-lf0" x={76} y={16} r={10} rot={70} />
                                  </svg>
                                </article>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mx-auto flex max-w-[64rem] items-center justify-between gap-4 px-6">
                    <p className="-rotate-1" style={{ fontFamily: hand, fontSize: 21, color: C.rani }}>swipe through our years →</p>
                    <div className="flex shrink-0 gap-2">
                      {[-1, 1].map((d) => (
                        <button key={d} type="button" onClick={() => slide(d)} aria-label={d < 0 ? 'Earlier photos' : 'More photos'} className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:bg-[rgba(194,24,91,0.06)]" style={{ borderColor: 'rgba(194,24,91,0.45)', color: C.rani }}>
                          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transform: d < 0 ? 'scaleX(-1)' : undefined }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </section>
          )}

          {/* ── Their film, now showing ───────────────────────────────────── */}
          {film && (
            <section id="tw-film" className="relative overflow-hidden px-5 pb-20 pt-16" style={{ background: `radial-gradient(90% 60% at 50% 0%, #4A1A40 0%, ${C.night2} 55%, ${C.night} 100%)`, scrollMarginTop: 56 }}>
              <Stars count={50} seed={14} className="absolute inset-0 h-full w-full opacity-60" />
              <div className="relative mx-auto max-w-[56rem]">
                <Reveal disabled={isPreview} className="text-center">
                  <Kicker color={C.marigold}>Now showing</Kicker>
                  <h2 className="mx-auto mt-3 max-w-[20ch] text-balance" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 50px)', lineHeight: 1.1, color: C.goldLight, textShadow: '0 0 24px rgba(247,168,23,0.45)' }}>{filmTitle}</h2>
                  <p className="mt-2" style={{ fontFamily: hand, fontSize: 'clamp(20px, 5.4cqi, 24px)', color: '#FF8FA8' }}>starring {groom} &amp; {bride}</p>
                </Reveal>
                <Reveal disabled={isPreview} className="mt-10">
                  <Cinema src={film} poster={photos[Math.min(4, photos.length - 1)] || couplePhoto} title={filmTitle} isPreview={isPreview} />
                </Reveal>
              </div>
            </section>
          )}

          {/* ── IV. Two worlds, side by side ──────────────────────────────── */}
          {hasWorlds && (
            <section id="tw-worlds" className="relative" style={{ scrollMarginTop: 56 }}>
              <div className="px-6 pb-2 pt-16 text-center" style={{ background: C.night }}>
                <Reveal disabled={isPreview}>
                  <Chapter n={no('worlds')} light title={<>Two <span style={{ fontFamily: script, fontSize: '1.3em', color: C.goldLight }}>worlds</span></>} />
                </Reveal>
              </div>
              <div className="tw-worlds">
                {/* His: saffron into rani pink, a jharokha arch, paisleys and a peacock feather. */}
                <Reveal disabled={isPreview} className="relative overflow-hidden px-6 pb-[22cqi] pt-14 text-center [@container(min-width:760px)]:pb-[13cqi]" style={{ background: `linear-gradient(165deg, ${C.marigold} 0%, ${C.saffron} 34%, ${C.rani} 100%)` }}>
                  <ColourPaisley id="tw-pz-a" className="pointer-events-none absolute -left-[22px] top-[16%] w-[min(22cqi,120px)] -rotate-[24deg] opacity-80 [@container(min-width:760px)]:w-[min(11cqi,120px)]" />
                  <ColourPaisley id="tw-pz-b" className="pointer-events-none absolute -right-[18px] bottom-[20%] w-[min(20cqi,110px)] rotate-[160deg] opacity-80 [@container(min-width:760px)]:w-[min(10cqi,110px)]" />
                  <PeacockEye className="pointer-events-none absolute right-[6%] top-[5%] w-[min(11cqi,60px)] rotate-[18deg] [@container(min-width:760px)]:w-[min(5.5cqi,60px)]" />
                  <Kicker color="#3A1604">His world</Kicker>
                  <div className="relative mx-auto mt-7 w-[min(54cqi,15rem)] [@container(min-width:760px)]:w-[min(24cqi,15rem)]">
                    <div className="relative aspect-[100/130]">
                      {portraits.groom ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={portraits.groom} alt={groom} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={archMask} />
                      ) : (
                        <div className="absolute inset-0 flex items-end justify-center pb-[14%]" style={{ ...archMask, background: `radial-gradient(80% 60% at 50% 35%, #6A1F4C, ${C.night})` }}>
                          <ColourPaisley id="tw-pz-arch" className="absolute left-1/2 top-[16%] w-[40%] -translate-x-1/2" />
                          <Diya className="relative w-[50%]" />
                        </div>
                      )}
                      <ArchFrame className="absolute -inset-[7px] h-[calc(100%+14px)] w-[calc(100%+14px)]" color={C.cream} />
                    </div>
                  </div>
                  <h3 className="mt-7" style={{ fontFamily: display, fontSize: 'clamp(32px, 9cqi, 44px)', lineHeight: 1.05, color: C.cream }}>{groom}</h3>
                  {homes.groom && <p className="mt-1 italic" style={{ fontSize: 18, color: 'rgba(255,249,238,0.9)' }}><HomeFlag place={homes.groom} />{homes.groom}</p>}
                  {worlds.groom && <p className="mx-auto mt-4 max-w-[22rem] text-balance" style={{ fontSize: 18.5, lineHeight: 1.6, color: C.cream }}>{worlds.groom}</p>}
                </Reveal>

                {/* Hers: Petrykivka painting on black, her portrait in a vinok. */}
                <Reveal disabled={isPreview} delay={100} className="relative overflow-hidden px-6 pb-[22cqi] pt-14 text-center [@container(min-width:760px)]:pb-[13cqi]" style={{ background: '#100B0E' }}>
                  <PetrykivkaSpray className="pointer-events-none absolute -right-[8%] -top-[4%] w-[min(44cqi,240px)] [@container(min-width:760px)]:w-[min(20cqi,240px)]" flip />
                  <PetrykivkaSpray className="pointer-events-none absolute -bottom-[3cqi] -left-[5cqi] w-[min(27cqi,180px)] rotate-180 opacity-90 [@container(min-width:760px)]:-bottom-[1cqi] [@container(min-width:760px)]:w-[min(14cqi,180px)]" flip />
                  <Kicker color={C.sunflower}>Her world</Kicker>
                  <div className="relative mx-auto mt-2 w-[min(66cqi,18rem)] [@container(min-width:760px)]:w-[min(29cqi,18rem)]">
                    <div className="relative aspect-[300/330]">
                      <div className="absolute left-[25.5%] top-[19.5%] aspect-square w-[49%] overflow-hidden rounded-full" style={{ background: '#2A1A22' }}>
                        {portraits.bride ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={portraits.bride} alt={bride} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <svg aria-hidden viewBox="0 0 100 100" className="h-full w-full">
                            <PetrykivkaFlower x={50} y={66} s={40} />
                            <PetrykivkaFlower x={24} y={50} s={18} rot={-50} tone="blue" />
                            <PetrykivkaFlower x={76} y={50} s={18} rot={50} tone="yellow" />
                          </svg>
                        )}
                      </div>
                      <WreathMedallion className="absolute inset-0 h-full w-full" />
                    </div>
                  </div>
                  <h3 className="-mt-2" style={{ fontFamily: display, fontSize: 'clamp(32px, 9cqi, 44px)', lineHeight: 1.05, color: C.cream }}>{bride}</h3>
                  {homes.bride && <p className="mt-1 italic" style={{ fontSize: 18, color: 'rgba(255,249,238,0.8)' }}><HomeFlag place={homes.bride} />{homes.bride}</p>}
                  {worlds.bride && <p className="mx-auto mt-4 max-w-[22rem] text-balance" style={{ fontSize: 18.5, lineHeight: 1.6, color: 'rgba(255,249,238,0.92)' }}>{worlds.bride}</p>}
                </Reveal>
              </div>

              {/* Where the two worlds meet: the varmala and the vinok, linked. */}
              <div className="relative flow-root px-6 pb-20 text-center" style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.night} 100%)` }}>
                <Reveal disabled={isPreview} className="relative z-[1] mx-auto -mt-[19cqi] w-[min(92cqi,30rem)] [@container(min-width:760px)]:-mt-[11cqi]">
                  <LinkedGarlands his={initial(groom)} hers={initial(bride)} className="block w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
                </Reveal>
                <Reveal disabled={isPreview} className="mx-auto mt-4 max-w-[38rem]">
                  <h2 className="text-balance" style={{ fontFamily: display, fontSize: 'clamp(28px, 7.6cqi, 48px)', lineHeight: 1.1, color: C.cream }}>
                    Two cultures, <span style={{ fontFamily: script, fontSize: '1.25em', color: C.goldLight }}>one future</span>
                  </h2>
                  {togetherLine && <p className="mx-auto mt-5 max-w-[32rem] text-balance italic" style={{ fontSize: 'clamp(19px, 5.4cqi, 24px)', lineHeight: 1.55, color: 'rgba(255,249,238,0.88)' }}>{togetherLine}</p>}
                </Reveal>
              </div>
            </section>
          )}

          {/* ── Two traditions, one wedding: each rite of a Hindu wedding beside its Ukrainian cousin ── */}
          {hasWays && (
            <section id="tw-ways" className="relative overflow-hidden px-5 pb-20 pt-16" style={{ ...paper, scrollMarginTop: 56 }}>
              <div className="relative mx-auto max-w-[64rem]">
                <Reveal disabled={isPreview}>
                  <Chapter n={no('ways')} title={<>Two traditions, <span style={{ fontFamily: script, fontSize: '1.3em', color: C.rani }}>one wedding</span></>} note="what you will see, and where it comes from" />
                  <p className="mx-auto mt-5 max-w-[34rem] text-center text-balance italic" style={{ fontSize: 'clamp(18px, 4.8cqi, 21px)', lineHeight: 1.55, color: C.soft }}>
                    A Hindu wedding and a Ukrainian one keep many of the same promises in different words. Here they are side by side, the way they will be on the day.
                  </p>
                </Reveal>

                {/* Tie the knot: his dupatta and her rushnyk */}
                <Reveal disabled={isPreview} className="relative mx-auto mt-8 max-w-[30rem]">
                  <KnotStage tied={tied} burst={burst} className="mx-auto block w-full overflow-visible" />
                  <div className="-mt-1 flex flex-col items-center text-center">
                    <button type="button" onClick={tie} aria-pressed={tied} className={`${btn} tw-tie min-w-[12rem] font-medium`} style={tied ? { border: `1px solid ${C.rani}`, color: C.rani } : { background: `linear-gradient(180deg, ${C.rose}, ${C.rani})`, color: C.cream, boxShadow: '0 12px 24px -12px rgba(194,24,91,0.7)' }}>
                      {tied ? 'Tied. Tie it again' : 'Tie the knot'}
                    </button>
                    <p className="mt-4 max-w-[26rem] text-balance" style={{ fontSize: 16.5, lineHeight: 1.55, color: C.soft }}>
                      {tied
                        ? 'One promise in two languages. Every pair below has come together too.'
                        : 'A Hindu wedding knots her dupatta to his scarf. A Ukrainian one binds their hands with a rushnyk.'}
                    </p>
                  </div>
                </Reveal>

                {!tied && joined.length < traditions.length && (
                  <p className="mt-10 text-center -rotate-1" style={{ fontFamily: hand, fontSize: 21, color: C.rani }}>or tap a pair to bring its halves together</p>
                )}
                <ol className={`tw-ways ${!tied && joined.length < traditions.length ? 'mt-6' : 'mt-12'}`}>
                  {traditions.map((t, i) => {
                    const [hNative, hLatin] = t.hindu.split(' / ')
                    const [uNative, uLatin] = t.ukrainian.split(' / ')
                    const on = tied || joined.includes(i)
                    // When the knot is tied the pairs come together one after another.
                    const delay = ripple ? `${600 + i * 90}ms` : '0ms'
                    const sealDelay = `${(ripple ? 600 + i * 90 : 0) + 250}ms`
                    const half = '0 18px 34px -26px rgba(38,25,46,0.6), 0 0 0 1px rgba(38,25,46,0.08)'
                    return (
                      <Reveal as="li" key={`${t.theme}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className="flex flex-col">
                        <p className="flex items-baseline justify-center gap-3 text-center">
                          <span className="tabular-nums" style={{ fontFamily: display, fontSize: 15, color: C.goldDeep }}>{pad2(i + 1)}</span>
                          <span style={{ fontFamily: display, fontSize: 'clamp(21px, 5.6cqi, 25px)', lineHeight: 1.2, color: C.ink }}>{t.theme}</span>
                        </p>
                        <div
                          role="button"
                          tabIndex={0}
                          aria-pressed={on}
                          aria-label={`${t.theme}: ${hLatin || hNative} and ${uLatin || uNative}${on ? ', together' : ', tap to bring together'}`}
                          onClick={() => toggleJoin(i)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              toggleJoin(i)
                            }
                          }}
                          className={`tw-pair relative mt-3 grid flex-1 cursor-pointer select-none grid-cols-2 ${on ? 'is-joined' : ''}`}
                        >
                          {/* His side: a string of marigolds along the top, saffron paper */}
                          <div className="tw-half tw-half-h relative overflow-hidden rounded-l-[14px] pb-5 pl-4 pr-6 pt-8" style={{ background: 'linear-gradient(180deg, #FFF0D9, #FFE6C2)', boxShadow: half, transitionDelay: delay }}>
                            <svg aria-hidden viewBox="0 0 400 14" preserveAspectRatio="xMinYMid slice" className="absolute inset-x-0 top-0 h-[14px] w-full">
                              {Array.from({ length: 34 }, (_, k) => <Stamp key={k} id={k % 3 === 1 ? 'tw-mg1' : 'tw-mg0'} x={6 + k * 12} y={7} r={6.4} rot={k * 40} />)}
                            </svg>
                            <p lang="hi" style={{ fontFamily: deva, fontSize: 'clamp(20px, 5.4cqi, 26px)', lineHeight: 1.25, color: C.marigoldDeep }}>{hNative}</p>
                            {hLatin && <p className="mt-0.5 uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8A4A12' }}>{hLatin}</p>}
                            {t.hinduText && <p className="mt-2.5" style={{ fontSize: 'clamp(15px, 4cqi, 16.5px)', lineHeight: 1.5, color: C.ink }}>{t.hinduText}</p>}
                          </div>
                          {/* Hers: linen with a band of rushnyk cross-stitch along the top */}
                          <div className="tw-half tw-half-u relative overflow-hidden rounded-r-[14px] pb-5 pl-6 pr-4 pt-8" style={{ background: 'linear-gradient(180deg, #FBF8F1, #F1ECE1)', boxShadow: half, transitionDelay: delay }}>
                            <StitchBand id={`tw-stitch-${i}`} cell={1.3} className="absolute inset-x-0 top-[1px]" />
                            <p lang="uk" style={{ fontFamily: display, fontSize: 'clamp(19px, 5cqi, 24px)', lineHeight: 1.25, color: C.kalyna }}>{uNative}</p>
                            {uLatin && <p className="mt-0.5 uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: '#5B1A26' }}>{uLatin}</p>}
                            {t.ukrainianText && <p className="mt-2.5" style={{ fontSize: 'clamp(15px, 4cqi, 16.5px)', lineHeight: 1.5, color: C.ink }}>{t.ukrainianText}</p>}
                          </div>
                          <span aria-hidden className="tw-seal absolute left-1/2 top-[14px] flex h-9 w-9 items-center justify-center rounded-full" style={{ background: C.ivory, boxShadow: `0 0 0 1.5px ${C.gold}, 0 4px 10px rgba(38,25,46,0.18)`, fontFamily: script, fontSize: 26, lineHeight: 1, color: C.rani, transitionDelay: sealDelay }}>
                            &amp;
                          </span>
                        </div>
                      </Reveal>
                    )
                  })}
                </ol>
              </div>
            </section>
          )}

          {/* ── V. The family wall: their photographs, dressed the way both their homes dress them ── */}
          {hasAlbum && (
            <section id="tw-album" className="relative overflow-hidden px-5 pb-16 pt-16" style={{ background: 'radial-gradient(120% 55% at 50% 0%, #22909A 0%, #106A74 40%, #0A4950 100%)', scrollMarginTop: 56 }}>
              <div aria-hidden className="absolute inset-0" style={grain(0.1)} />
              <div aria-hidden className="absolute inset-x-0 top-0 h-[9px]" style={{ background: 'linear-gradient(180deg, #8C5D38 0%, #B07A4A 45%, #5A3820 100%)', boxShadow: '0 4px 10px rgba(0,20,24,0.45)' }} />
              <div className="relative mx-auto max-w-[70rem]">
                <Reveal disabled={isPreview}>
                  <Chapter n={no('album')} light title={<>The family <span style={{ fontFamily: script, fontSize: '1.3em', color: C.goldLight }}>wall</span></>} note="both our homes, on one wall" />
                </Reveal>
                {albumLine && (
                  <Reveal disabled={isPreview} className="mx-auto mt-5 max-w-[36rem] text-center">
                    <p className="text-balance italic" style={{ fontSize: 'clamp(18px, 4.9cqi, 22px)', lineHeight: 1.55, color: 'rgba(255,249,238,0.9)' }}>{albumLine}</p>
                  </Reveal>
                )}
                <ul className="tw-wall mt-12">
                  {album.map((src, i) => (
                    <li key={`${i}-${src.slice(-12)}`}>
                      <Reveal disabled={isPreview} delay={(i % 3) * 90}>
                        <button
                          type="button"
                          onClick={() => !isPreview && alb.setOpen(i)}
                          aria-label={`Open photo ${i + 1} of ${album.length}`}
                          className="block w-full text-left"
                          style={{ transform: `rotate(${WALL_TILTS[i % WALL_TILTS.length]}deg)`, filter: 'drop-shadow(0 16px 14px rgba(0,18,22,0.5)) drop-shadow(0 2px 2px rgba(0,0,0,0.25))', cursor: isPreview ? 'default' : 'zoom-in' }}
                        >
                          <WallFrame src={src} i={i} alt={`${couple}, photo ${i + 1}`} />
                        </button>
                      </Reveal>
                    </li>
                  ))}
                </ul>
                {!isPreview && <p className="text-center -rotate-1" style={{ fontFamily: hand, fontSize: 21, color: C.goldLight }}>tap a photo to see it larger</p>}
              </div>
            </section>
          )}

          {/* ── VI. The wedding ────────────────────────────────────────────── */}
          <section id="tw-wedding" className="relative overflow-hidden pb-20 pt-[128px]" style={{ ...paper, scrollMarginTop: 56 }}>
            <div className="absolute inset-x-0 top-0">
              <MarigoldToran />
            </div>
            <div className="relative mx-auto max-w-[60rem] px-5">
              <Reveal disabled={isPreview}>
                <Chapter n={no('wedding')} title={<>The <span style={{ fontFamily: script, fontSize: '1.3em', color: C.rani }}>wedding</span></>} />
              </Reveal>

              {(data.groomParents?.trim() || data.brideParents?.trim() || blessings.length > 0) && (
                <Reveal disabled={isPreview} className="mx-auto mt-10 max-w-[34rem] text-center">
                  <Kicker color={C.goldDeep}>Together with their families</Kicker>
                  <div className="mt-4 space-y-1" style={{ fontFamily: display, fontSize: 'clamp(18px, 5cqi, 22px)', lineHeight: 1.5, color: C.ink }}>
                    {data.groomParents?.trim() && <p>{data.groomParents}</p>}
                    {data.groomParents?.trim() && data.brideParents?.trim() && <p style={{ fontFamily: script, fontSize: '1.5em', lineHeight: 1, color: C.rani }}>and</p>}
                    {data.brideParents?.trim() && <p>{data.brideParents}</p>}
                  </div>
                  {blessings.length > 0 && <p className="mt-4 italic" style={{ fontSize: 17, color: C.soft }}>With the blessings of {blessings.join(', ')}</p>}
                </Reveal>
              )}

              {/* The date in a wreath of both their flowers, then the place. */}
              <Reveal disabled={isPreview} className="mt-12 text-center">
                {date ? (
                  <div className="relative mx-auto w-[min(80cqi,21rem)]">
                    <svg aria-hidden viewBox="0 0 300 300" className="absolute inset-0 h-full w-full overflow-visible">
                      {Array.from({ length: 28 }, (_, i) => {
                        const a = (i / 28) * Math.PI * 2 - Math.PI / 2
                        const x = 150 + Math.cos(a) * 130
                        const y = 150 + Math.sin(a) * 130
                        const his = Math.cos(a) < -0.02
                        return i % 2 ? (
                          <Stamp key={i} id={his ? 'tw-lf1' : 'tw-lf0'} x={x} y={y} r={14} rot={(a * 180) / Math.PI + 120} />
                        ) : (
                          <Stamp key={i} id={his ? (i % 4 ? 'tw-mg1' : 'tw-mg0') : ['tw-sf', 'tw-kl', 'tw-pp', 'tw-cf'][(i / 2) % 4]} x={x} y={y} r={his ? 16 : 14} rot={i * 21} />
                        )
                      })}
                    </svg>
                    <div className="relative flex aspect-square flex-col items-center justify-center">
                      <p className="uppercase" style={{ fontSize: 12.5, letterSpacing: '0.3em', color: C.soft }}>{date.weekday}</p>
                      <p className="tabular-nums" style={{ fontFamily: display, fontSize: 'clamp(80px, 25cqi, 124px)', lineHeight: 0.95, color: C.rani }}>{date.day}</p>
                      <p className="uppercase" style={{ fontSize: 'clamp(14px, 4cqi, 16px)', letterSpacing: '0.24em', color: C.ink }}>{date.month} {date.year}</p>
                      {time && <p className="mt-1 italic" style={{ fontSize: 18, color: C.soft }}>at {time}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="italic" style={{ fontSize: 19, color: C.soft }}>Date to be announced</p>
                )}
                {venue && <p className="mt-9" style={{ fontFamily: display, fontSize: 'clamp(24px, 6.8cqi, 32px)', color: C.ink }}>{venue}</p>}
                {data.venueAddress?.trim() && <p className="mx-auto mt-1 max-w-[26rem]" style={{ fontSize: 17, color: C.soft }}>{data.venueAddress}</p>}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Act href={directions} isPreview={isPreview} className={`${btn} hover:brightness-110`} style={{ background: C.rani, color: C.cream }}>
                    {Icon.pin} Directions
                  </Act>
                  <Act href={weddingCal} isPreview={isPreview} className={`${btn} border hover:bg-[rgba(194,24,91,0.06)]`} style={{ borderColor: C.rani, color: C.rani }}>
                    {Icon.calendar} Add to calendar
                  </Act>
                </div>
              </Reveal>

              {date && (
                <Reveal disabled={isPreview} className="mt-14">
                  <Countdown date={data.date} time={data.time} />
                  <p className="mt-4 text-center -rotate-1" style={{ fontFamily: hand, fontSize: 'clamp(21px, 5.6cqi, 25px)', color: C.rani }}>until forever begins</p>
                </Reveal>
              )}

              {functions.length > 0 && (
                <div className="mt-16">
                  <Reveal disabled={isPreview} className="text-center">
                    <Kicker color={C.goldDeep}>Join us for</Kicker>
                    <h3 className="mt-2" style={{ fontFamily: display, fontSize: 'clamp(28px, 8cqi, 40px)', color: C.ink }}>The celebrations</h3>
                  </Reveal>
                  <ol className="tw-cards mx-auto mt-8 max-w-[52rem]">
                    {functions.map((fn, i) => {
                      const d = dateParts(fn.date)
                      const t = timeLabel(fn.time)
                      const fnPlace = fn.venue?.trim() || venue
                      const fnDir = fn.venue?.trim() ? mapsHref(undefined, fn.venue) : directions
                      const fnCal = calendarHref(`${fn.name} · ${couple}`, fn.date || data.date, fn.time, fnPlace || undefined, 3)
                      const k = CARDS[i % CARDS.length]
                      return (
                        <Reveal as="li" key={`${fn.name}-${i}`} disabled={isPreview} delay={(i % 2) * 90} className="relative overflow-hidden rounded-[18px] px-6 pb-6 pt-7" style={{ background: k.bg, color: k.ink, boxShadow: '0 24px 40px -28px rgba(38,25,46,0.7)' }}>
                          <svg aria-hidden viewBox="0 0 120 120" className="pointer-events-none absolute -right-[26px] -top-[26px] h-[124px] w-[124px]">
                            <Stamp id="tw-lf1" x={34} y={44} r={22} rot={-62} />
                            <Stamp id="tw-lf0" x={68} y={92} r={22} rot={196} />
                            <Stamp id={k.art} x={72} y={48} r={40} rot={i * 25} />
                          </svg>
                          <p className="uppercase tabular-nums" style={{ fontSize: 12, letterSpacing: '0.24em', color: k.soft }}>
                            {pad2(i + 1)}
                            {d && <span>{`  ·  ${d.weekday.slice(0, 3)} ${d.day} ${d.monthShort}`}</span>}
                          </p>
                          <h4 className="mt-3 max-w-[76%] text-balance" style={{ fontFamily: display, fontSize: 'clamp(25px, 7cqi, 30px)', lineHeight: 1.12 }}>{fn.name}</h4>
                          {t && <p className="mt-2" style={{ fontFamily: hand, fontSize: 'clamp(25px, 6.8cqi, 29px)', lineHeight: 1 }}>{t}</p>}
                          <div className="mt-4 border-t pt-4" style={{ borderColor: k.line }}>
                            {fnPlace && <p style={{ fontSize: 17, lineHeight: 1.45 }}>{fnPlace}</p>}
                            {fn.dress?.trim() && <p className="mt-1 italic" style={{ fontSize: 16, color: k.soft }}>Wear: {fn.dress}</p>}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Act href={fnCal} isPreview={isPreview} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px]" style={{ background: k.chip }}>{Icon.calendar} Calendar</Act>
                            <Act href={fnDir} isPreview={isPreview} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px]" style={{ background: k.chip }}>{Icon.pin} Directions</Act>
                          </div>
                        </Reveal>
                      )
                    })}
                  </ol>
                </div>
              )}

              {data.dressCode?.trim() && (
                <Reveal disabled={isPreview} className="mx-auto mt-14 max-w-[32rem] text-center">
                  <Kicker color={C.goldDeep}>What to wear</Kicker>
                  <p className="mt-3 text-balance" style={{ fontFamily: display, fontSize: 'clamp(20px, 5.6cqi, 24px)', lineHeight: 1.4, color: C.ink }}>{data.dressCode}</p>
                  <div aria-hidden className="mt-4 flex justify-center gap-2">
                    {[C.saffron, C.rani, C.kalyna, C.sunflower, C.leaf, C.cornflower].map((c) => <span key={c} className="h-4 w-4 rounded-full" style={{ background: c, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.5)' }} />)}
                  </div>
                </Reveal>
              )}

              {hasGuests && (
                <div className="mx-auto mt-16 max-w-[42rem]">
                  {travel.length > 0 && (
                    <Reveal disabled={isPreview} className="relative overflow-hidden rounded-[16px] px-6 py-7" style={{ background: '#FFFFFF', boxShadow: `inset 4px 0 0 ${C.saffron}, 0 18px 34px -28px rgba(38,25,46,0.55)` }}>
                      <Kicker color={C.saffron}>Travel &amp; stay</Kicker>
                      <div className="mt-3 space-y-2.5" style={{ fontSize: 17.5, lineHeight: 1.6, color: C.ink }}>
                        {travel.map((l) => <p key={l}>{l}</p>)}
                      </div>
                    </Reveal>
                  )}
                  {faq.length > 0 && (
                    <Reveal disabled={isPreview} className="mt-10">
                      <Kicker className="text-center" color={C.goldDeep}>Good to know</Kicker>
                      <div className="mt-4 border-t" style={{ borderColor: 'rgba(38,25,46,0.14)' }}>
                        {faq.map((f) => (
                          <details key={f.q} className="border-b" style={{ borderColor: 'rgba(38,25,46,0.14)' }}>
                            <summary className="flex items-baseline justify-between gap-4 py-4">
                              <span style={{ fontFamily: display, fontSize: 'clamp(18px, 5cqi, 21px)', color: C.ink }}>{f.q}</span>
                              <span aria-hidden className="tw-plus shrink-0 text-[24px] leading-none" style={{ color: C.rani }}>+</span>
                            </summary>
                            <p className="pb-5" style={{ fontSize: 17, lineHeight: 1.6, color: C.soft }}>{f.a}</p>
                          </details>
                        ))}
                      </div>
                    </Reveal>
                  )}
                  {contacts.length > 0 && (
                    <Reveal disabled={isPreview} className="mt-10 text-center">
                      <Kicker color={C.goldDeep}>If you need anything</Kicker>
                      <ul className="mt-5 grid gap-3 [@container(min-width:560px)]:grid-cols-2">
                        {contacts.map((c, i) => {
                          const tel = telHref(c.phone)
                          const wa = whatsappHref(c.phone, `Hello! A question about ${couple}'s wedding: `)
                          return (
                            <li key={c.name} className="flex flex-col items-center gap-2 rounded-[14px] px-4 py-5" style={{ background: '#FFFFFF', boxShadow: `inset 0 3px 0 ${i % 2 ? C.kalyna : C.marigold}, 0 14px 28px -24px rgba(38,25,46,0.6)` }}>
                              <span style={{ fontFamily: display, fontSize: 18, color: C.ink }}>{c.name}</span>
                              <span className="flex gap-5">
                                <Act href={tel} external={false} isPreview={isPreview} label={`Call ${c.name}`} className="tw-link inline-flex items-center gap-1.5 text-[15px]" style={{ color: C.rani }}>{Icon.phone} Call</Act>
                                <Act href={wa} isPreview={isPreview} label={`WhatsApp ${c.name}`} className="tw-link inline-flex items-center gap-1.5 text-[15px]" style={{ color: C.rani }}>{Icon.whatsapp} WhatsApp</Act>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </Reveal>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ── The invitation: celebrate with us ─────────────────────────── */}
          <section id="tw-rsvp" className="relative overflow-hidden px-6 pb-20 pt-24 text-center" style={{ background: `radial-gradient(120% 75% at 50% 0%, #E0457E 0%, ${C.rani} 34%, #7A0E3A 72%, #3B0A24 100%)`, color: C.cream, scrollMarginTop: 56 }}>
            <CornerStrands lengths={[300, 420, 230]} />
            <Petals count={12} />
            <div className="relative mx-auto max-w-[38rem]">
              {closingPhoto && (
                <Reveal disabled={isPreview} className="relative mx-auto mb-10 w-[min(54cqi,17rem)]">
                  <div className="relative aspect-[100/130]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={closingPhoto} alt={couple} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={archMask} />
                    <ArchFrame className="absolute -inset-[7px] h-[calc(100%+14px)] w-[calc(100%+14px)]" color={C.goldLight} />
                  </div>
                  <Diya className="absolute -left-[24%] bottom-[-2%] w-[26%]" />
                  <Diya className="absolute -right-[24%] bottom-[-2%] w-[26%]" />
                </Reveal>
              )}
              <Reveal disabled={isPreview}>
                <Kicker color={C.goldLight}>The invitation</Kicker>
                <h2 className="mt-3" style={{ fontFamily: display, fontSize: 'clamp(36px, 11cqi, 60px)', lineHeight: 1.05, color: C.cream }}>
                  Celebrate <span style={{ fontFamily: script, fontSize: '1.3em', color: C.goldLight }}>with us</span>
                </h2>
                {closing && <p className="mx-auto mt-6 max-w-[30rem] text-balance italic" style={{ fontSize: 'clamp(19px, 5.4cqi, 24px)', lineHeight: 1.55, color: 'rgba(255,249,238,0.94)' }}>{closing}</p>}
                {rsvpBy && <p className="mt-7 uppercase" style={{ fontSize: 12.5, letterSpacing: '0.24em', color: C.goldLight }}>Kindly reply by {rsvpBy.day} {rsvpBy.month}</p>}
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Act href={reply} isPreview={isPreview} className={`${btn} min-w-[14rem] font-medium hover:brightness-105`} style={{ background: C.sunflower, color: '#3A1604', boxShadow: '0 12px 26px -12px rgba(0,0,0,0.5)' }}>
                    {Icon.whatsapp} Reply on WhatsApp
                  </Act>
                  <Act href={weddingCal} isPreview={isPreview} className={`${btn} min-w-[14rem] border hover:bg-[rgba(255,249,238,0.08)]`} style={{ borderColor: 'rgba(255,249,238,0.6)', color: C.cream }}>
                    {Icon.calendar} Save the date
                  </Act>
                </div>
                {live && (
                  <Act href={live} isPreview={isPreview} className={`${btn} mt-4 border hover:bg-[rgba(255,249,238,0.08)]`} style={{ borderColor: 'rgba(255,249,238,0.6)', color: C.cream }}>
                    {Icon.play} Watch the livestream
                  </Act>
                )}
                {hashtag && <p className="mt-9" style={{ fontFamily: hand, fontSize: 26, color: C.goldLight }}>{hashtag}</p>}
              </Reveal>
            </div>
          </section>

          {eventId && (
            <div id="tw-wishes" style={{ scrollMarginTop: 56 }}>
              <WishesSection
                eventId={eventId}
                theme={WISHES_THEME}
                title="Wishes for the two of us"
                intro={`Leave a few words for ${couple}, in any language. They appear here for every guest.`}
                noun="wish"
                namePlaceholder="e.g. The Mehra family"
              />
            </div>
          )}

          <footer className="relative overflow-hidden px-6 pb-10 pt-[150px] text-center" style={{ background: `linear-gradient(180deg, ${C.night2}, ${C.night})`, color: C.cream }}>
            <Stars count={60} seed={21} className="absolute inset-0 h-full w-full opacity-70" />
            <CornerStrands lengths={[170, 230, 130]} width="min(6cqi, 40px)" />
            <div className="relative">
              {thanks.length > 0 && (
                <p className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1" style={{ fontSize: 38, color: C.goldLight }}>
                  {thanks.map((t) => <span key={t} style={scriptWord(t)}>{t}</span>)}
                </p>
              )}
              <p className="mt-5" style={{ fontFamily: display, fontSize: 'clamp(28px, 8cqi, 40px)', color: C.cream }}>
                {groom} <span style={{ fontFamily: script, color: C.marigold }}>&amp;</span> {bride}
              </p>
              {date && <p className="mt-2 uppercase" style={{ fontSize: 12, letterSpacing: '0.26em', color: 'rgba(255,249,238,0.65)' }}>{date.day} · {date.month} · {date.year}</p>}
              <div className="mt-10">
                <Credit isPreview={isPreview} color="rgba(255,249,238,0.55)" linkColor={C.goldLight} />
              </div>
            </div>
          </footer>

          {lb.open !== null && <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background="rgba(14,9,24,0.96)" color={C.cream} font={text} />}
          {alb.open !== null && <Lightbox photos={album} index={alb.open} onClose={alb.close} onStep={alb.step} background="rgba(14,9,24,0.96)" color={C.cream} font={text} />}
        </>
      )}
    </div>
  )
}
