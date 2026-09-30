'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import WishesSection from './WishesSection'
import { kalam } from './kit/fonts/kalam'
import { fraunces } from './kit/fonts/fraunces'
import { jost } from './kit/fonts/jost'
import {
  calendarHref,
  dateParts,
  galleryImages,
  grain,
  mapsHref,
  parseLines,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import type { InviteTheme } from './kit/theme'

/*
 * Raksha Bandhan — the thread.
 * A rakhi sits at the top of the page and its red-and-saffron thread runs on
 * down the whole invitation: along one margin, across each section as its
 * rule (knotted with a bead where the heading sits), down the other margin,
 * and ends in a tassel at the foot. Cream and gold, the names and the letter
 * hand-lettered. On arrival the rakhi opens and the thread is drawn across.
 *
 * The gifting fields (upiId, qrImage, bank*) are intentionally not rendered:
 * the RSVP / gift section stays switched off.
 */

const C = {
  paper: '#F8F1E3',
  card: '#FFFBF2',
  ink: '#35251B',
  soft: 'rgba(53,37,27,0.74)',
  faint: 'rgba(53,37,27,0.5)',
  gold: '#CFA044',
  goldDeep: '#8C6820',
  red: '#BD2A2B',
  redDeep: '#921D20',
  saffron: '#E8891E',
  pearl: '#FFF3DA',
  rule: '#E6D5B5',
}

const display = fraunces.style.fontFamily
const hand = kalam.style.fontFamily
const sans = jost.style.fontFamily
const SOFT = { fontVariationSettings: "'SOFT' 100, 'WONK' 0" }

const WISHES_THEME: InviteTheme = {
  // Transparent so the thread and the paper grain run on behind the form.
  bg: 'transparent',
  surface: C.card,
  ink: C.ink,
  muted: C.soft,
  line: C.rule,
  accent: C.red,
  onAccent: '#FFF8EE',
  heading: display,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 34, ...SOFT },
}

// ── Seeded irregularity ─────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const f1 = (n: number) => n.toFixed(1)

// ── The rakhi rosette, in a 200×200 box ────────────────────────────────────
const ROSETTE = (() => {
  const r = rng(12)
  const petal = (r0: number, len: number, w: number) =>
    `M0 ${-r0}C${f1(w)} ${f1(-r0 - len * 0.35)} ${f1(w * 0.55)} ${f1(-r0 - len * 0.82)} 0 ${f1(-r0 - len)}C${f1(-w * 0.55)} ${f1(-r0 - len * 0.82)} ${f1(-w)} ${f1(-r0 - len * 0.35)} 0 ${-r0}Z`
  const round = (r0: number, len: number, w: number) =>
    `M0 ${-r0}C${f1(w)} ${f1(-r0 - len * 0.15)} ${f1(w * 0.9)} ${f1(-r0 - len)} 0 ${f1(-r0 - len)}C${f1(-w * 0.9)} ${f1(-r0 - len)} ${f1(-w)} ${f1(-r0 - len * 0.15)} 0 ${-r0}Z`
  return {
    outer: Array.from({ length: 14 }, (_, i) => ({ a: (i * 360) / 14 + (r() - 0.5) * 5, d: petal(50, 38 + r() * 5, 12.5 + r() * 1.5) })),
    mid: Array.from({ length: 10 }, (_, i) => ({ a: i * 36 + 18 + (r() - 0.5) * 5, d: round(30, 28 + r() * 3, 13 + r() * 1.5) })),
    beads: Array.from({ length: 18 }, (_, i) => (i * 20 * Math.PI) / 180),
    dots: Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180 + 0.26),
  }
})()

function Rosette({ animate }: { animate: boolean }) {
  const ring = (delay: number) => (animate ? { className: 'rb-bloom', style: { animationDelay: `${delay}ms` } } : {})
  return (
    <svg viewBox="0 0 200 200" className="block h-auto w-full" aria-hidden style={{ overflow: 'visible' }}>
      <g transform="translate(100 100)">
        <g {...ring(1250)}>
        {[-1, 1].map((side) =>
          [100, 113, 124, 136, 147].map((x, i) =>
            i % 2 === 0 ? (
              <circle key={`${side}-${x}`} cx={side * x} cy={0} r={i === 0 ? 5.6 : 4.6} fill={C.pearl} stroke={C.goldDeep} strokeWidth={0.8} />
            ) : (
              <circle key={`${side}-${x}`} cx={side * x} cy={0} r={3.2} fill={C.gold} stroke={C.goldDeep} strokeWidth={0.8} />
            ),
          ),
        )}
        </g>
      </g>
      <g transform="translate(100 100)">
        <g {...ring(250)}>
          {ROSETTE.outer.map((p, i) => (
            <g key={i} transform={`rotate(${f1(p.a)})`}>
              <path d={p.d} fill={C.gold} stroke={C.goldDeep} strokeWidth={1} strokeLinejoin="round" />
              <path d="M0 -56V-80" stroke={C.goldDeep} strokeWidth={0.7} opacity={0.55} />
            </g>
          ))}
        </g>
        <g {...ring(420)}>
          {ROSETTE.mid.map((p, i) => (
            <path key={i} d={p.d} transform={`rotate(${f1(p.a)})`} fill={C.red} stroke={C.redDeep} strokeWidth={1} strokeLinejoin="round" />
          ))}
        </g>
        <g {...ring(560)}>
          <circle r={31} fill={C.saffron} stroke={C.goldDeep} strokeWidth={1} />
          {ROSETTE.beads.map((a, i) => (
            <circle key={i} cx={f1(35.5 * Math.cos(a))} cy={f1(35.5 * Math.sin(a))} r={4.1} fill={C.pearl} stroke={C.goldDeep} strokeWidth={0.8} />
          ))}
          {ROSETTE.dots.map((a, i) => (
            <circle key={i} cx={f1(23 * Math.cos(a))} cy={f1(23 * Math.sin(a))} r={1.7} fill={C.pearl} />
          ))}
          <circle r={14} fill={C.red} stroke={C.gold} strokeWidth={2.4} />
          <ellipse cx={-4.5} cy={-5} rx={4} ry={2.6} fill="#FFFFFF" opacity={0.45} transform="rotate(-30 -4.5 -5)" />
        </g>
      </g>
    </svg>
  )
}

// ── The thread: measured from the page, so it ties whatever sections exist ──
type Pt = [number, number]
interface ThreadGeo {
  w: number
  h: number
  d: string
  knots: Pt[]
  beads: Pt[]
  end: Pt
  /** The edge the thread enters from. */
  entry: 'l' | 'r'
}

function measureThread(root: HTMLElement): ThreadGeo | null {
  const W = root.clientWidth
  // In-flow height only: the overlay itself must never hold the page open.
  const H = root.clientHeight
  // Layout position relative to the root (offsets ignore Reveal's transforms).
  const at = (node: HTMLElement): Pt => {
    let x = node.offsetWidth / 2
    let y = node.offsetHeight / 2
    let n: HTMLElement | null = node
    while (n && n !== root) {
      x += n.offsetLeft
      y += n.offsetTop
      n = n.offsetParent as HTMLElement | null
    }
    return [x, y]
  }
  const rakhi = root.querySelector<HTMLElement>('[data-rb-rakhi]')
  const knotEls = Array.from(root.querySelectorAll<HTMLElement>('[data-rb-knot]'))
  if (!rakhi || knotEls.length === 0) return null
  const anchors = [rakhi, ...knotEls].map(at)

  // Lanes sit in the side gutters of the content column.
  const colW = Math.min(W, 440)
  const colL = (W - colW) / 2
  const m = W < 340 ? 11 : 15
  const lane = { l: colL + m, r: colL + colW - m }
  // A knot marked "left" must be followed by the left lane (the timeline hangs its beads there).
  const pin = knotEls.findIndex((k) => k.dataset.rbKnot === 'left') + 1
  const side = (j: number): 'l' | 'r' => (pin > 0 ? ((pin - j) % 2 === 0 ? 'l' : 'r') : j % 2 === 0 ? 'r' : 'l')

  const R = 22
  const cx = W / 2
  const ry = anchors[0][1]
  const s0 = side(0)
  const L0 = lane[s0]
  let d = `M${s0 === 'r' ? -14 : W + 14} ${f1(ry)}L${f1(L0 - (s0 === 'r' ? R : -R))} ${f1(ry)}Q${f1(L0)} ${f1(ry)} ${f1(L0)} ${f1(ry + R)}`
  const knots: Pt[] = []
  let end: Pt = [cx, ry]
  for (let j = 1; j < anchors.length; j++) {
    const ky = anchors[j][1]
    const from = side(j - 1)
    const Lx = lane[from]
    const inward = from === 'r' ? -1 : 1
    d += `L${f1(Lx)} ${f1(ky - R)}Q${f1(Lx)} ${f1(ky)} ${f1(Lx + inward * R)} ${f1(ky)}`
    knots.push([cx, ky])
    if (j === anchors.length - 1) {
      d += `L${f1(cx)} ${f1(ky)}`
      end = [cx, ky]
    } else {
      const Tx = lane[side(j)]
      d += `L${f1(Tx - inward * R)} ${f1(ky)}Q${f1(Tx)} ${f1(ky)} ${f1(Tx)} ${f1(ky + R)}`
    }
  }

  const beads: Pt[] = Array.from(root.querySelectorAll<HTMLElement>('[data-rb-bead]')).map((el) => {
    const [, y] = at(el)
    let j = 0
    while (j + 1 < anchors.length && anchors[j + 1][1] < y) j++
    return [lane[side(j)], y]
  })

  return { w: W, h: H, d, knots, beads, end, entry: s0 === 'r' ? 'l' : 'r' }
}

function useThread(rootRef: RefObject<HTMLDivElement>) {
  const [geo, setGeo] = useState<ThreadGeo | null>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const next = measureThread(root)
        setGeo((prev) => (prev && next && prev.d === next.d && prev.h === next.h && prev.beads.length === next.beads.length ? prev : next))
      })
    }
    run()
    const ro = new ResizeObserver(run)
    ro.observe(root)
    document.fonts?.ready.then(run).catch(() => {})
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [rootRef])
  return geo
}

function Bead({ x, y, r = 5.5, pearls = false }: { x: number; y: number; r?: number; pearls?: boolean }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})`}>
      {pearls &&
        [-1, 1].map((k) => <circle key={k} cx={k * (r + 5)} r={3.3} fill={C.pearl} stroke={C.goldDeep} strokeWidth={0.8} />)}
      <circle r={r} fill={C.gold} stroke={C.goldDeep} strokeWidth={0.9} />
      <circle cx={-r * 0.32} cy={-r * 0.34} r={r * 0.3} fill="#FFF6DD" opacity={0.8} />
    </g>
  )
}

function Thread({ geo, animate }: { geo: ThreadGeo; animate: boolean }) {
  const sweep = useRef<SVGRectElement | null>(null)
  const start = useRef<number | null>(null)
  const done = useRef(!animate)

  useEffect(() => {
    const rect = sweep.current
    if (!rect) return
    const full = geo.w + 40
    const set = (w: number) => {
      rect.setAttribute('width', String(w))
      rect.setAttribute('x', String(geo.entry === 'l' ? -20 : geo.w + 20 - w))
    }
    if (done.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      done.current = true
      set(full)
      return
    }
    let raf = 0
    const step = (t: number) => {
      if (start.current === null) start.current = t
      const p = Math.min(1, Math.max(0, (t - start.current - 350) / 1500))
      set(full * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
      else done.current = true
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [geo])

  const [ex, ey] = geo.end
  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={geo.w} height={geo.h} aria-hidden>
      <defs>
        <clipPath id="rb-sweep">
          <rect ref={sweep} x={-20} y={-20} width={animate ? 0 : geo.w + 40} height={geo.h + 40} />
        </clipPath>
      </defs>
      <g clipPath="url(#rb-sweep)">
        {/* two strands twisted: red cord, saffron wrap, a glint of zari */}
        <path d={geo.d} fill="none" stroke={C.red} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d={geo.d} fill="none" stroke={C.saffron} strokeWidth={3.8} strokeDasharray="2.6 3.8" />
        <path d={geo.d} fill="none" stroke="#FBE3A6" strokeWidth={0.9} strokeDasharray="1.4 5" strokeDashoffset={-0.6} opacity={0.85} />
        {geo.beads.map(([x, y], i) => (
          <Bead key={`b${i}`} x={x} y={y} r={4.2} />
        ))}
        {geo.knots.map(([x, y], i) => (
          <Bead key={`k${i}`} x={x} y={y} r={6.2} pearls />
        ))}
        {/* the tassel the thread ends in */}
        <g transform={`translate(${f1(ex)} ${f1(ey)})`}>
          <path d="M0 6V34" stroke={C.red} strokeWidth={3} strokeLinecap="round" />
          <path d="M0 6V34" stroke={C.saffron} strokeWidth={3} strokeDasharray="2.4 3.4" />
          <circle cy={39} r={6} fill={C.gold} stroke={C.goldDeep} strokeWidth={0.9} />
          <path d="M-5.5 45H5.5" stroke={C.goldDeep} strokeWidth={2} strokeLinecap="round" />
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => (
            <path key={k} d={`M${f1(k * 1.1)} 46Q${f1(k * 1.6)} 58 ${f1(k * 2.6)} 74`} fill="none" stroke={k % 2 ? C.saffron : C.red} strokeWidth={1.7} strokeLinecap="round" />
          ))}
        </g>
      </g>
    </svg>
  )
}

/** An empty row the thread crosses, knotted with a bead at its centre. */
function Knot({ pin, className = 'h-[56px]' }: { pin?: 'left'; className?: string }) {
  return <div data-rb-knot={pin ?? ''} aria-hidden className={className} />
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center italic leading-[1.1]" style={{ fontFamily: display, fontSize: 'clamp(30px, 9cqi, 38px)', fontWeight: 400, ...SOFT }}>
      {children}
    </h2>
  )
}

export default function RakshaBandhanPremium({ data, eventId, isPreview = false }: InviteProps) {
  const sister = data.sisterName?.trim() || 'Priya'
  const brother = data.brotherName?.trim() || 'Rahul'
  const tagline = data.tagline?.trim()
  const title = data.title?.trim() || 'Raksha Bandhan'
  const subtitle = data.subtitle?.trim()
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const story = useMemo(() => parseLines(data.story), [data.story])
  const timeline = useMemo(() => parseSchedule(data.timeline), [data.timeline])
  const photos = useMemo(() => galleryImages(data.galleryImages, 6), [data.galleryImages])
  const featured = useMemo(
    () =>
      parseLines(data.sampleWishes)
        .map((line) => {
          const [name = '', ...rest] = line.split('|')
          return { name: name.trim(), message: rest.join('|').trim() }
        })
        .filter((w) => w.name && w.message),
    [data.sampleWishes],
  )
  const hero = data.heroImage && /^(https?:)?\//.test(data.heroImage) ? data.heroImage : ''
  const venue = data.venue?.trim()
  const venueAddress = data.venueAddress?.trim()
  const place = [venue, venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`${title} — ${sister} & ${brother}`, data.date, data.time, place || undefined)
  const directions = mapsHref(data.mapsUrl, venue, venueAddress)
  const animate = !isPreview

  const rootRef = useRef<HTMLDivElement>(null)
  const geo = useThread(rootRef)

  return (
    <div
      ref={rootRef}
      className="rb relative overflow-x-hidden"
      style={{ background: C.paper, color: C.ink, fontFamily: sans, containerType: 'inline-size', ...grain(0.05) }}
    >
      <style>{`
        .rb .rb-bloom { transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.55) rotate(-24deg); animation: rb-bloom 1.1s cubic-bezier(.2,.8,.25,1) forwards; }
        .rb .rb-in { opacity: 0; transform: translateY(8px); animation: rb-in 900ms cubic-bezier(.2,.7,.2,1) forwards; }
        .rb .rb-link:hover { text-decoration-thickness: 2px; }
        @keyframes rb-bloom { to { opacity: 1; transform: none; } }
        @keyframes rb-in { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .rb .rb-bloom, .rb .rb-in { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {geo && <Thread geo={geo} animate={animate} />}
      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={C.redDeep} background="rgba(255,251,242,0.9)" border={C.rule} />

      <div className="relative">
        {/* ── The rakhi ───────────────────────────────────────────── */}
        <header
          className="mx-auto flex max-w-[30rem] flex-col justify-center px-[30px] pb-14 pt-10 text-center"
          style={{ minHeight: isPreview ? 560 : '100svh' }}
        >
          {tagline && (
            <p className="rb-in" style={{ fontFamily: hand, fontSize: 20, color: C.redDeep }}>
              {tagline}
            </p>
          )}
          <div data-rb-rakhi className={`mx-auto w-[min(46%,180px)] ${tagline ? 'mt-6' : 'mt-2'}`}>
            <Rosette animate={animate} />
          </div>

          <h1
            className="rb-in mt-7 leading-[1.02]"
            style={{ fontFamily: display, fontSize: 'clamp(40px, 12.2cqi, 60px)', fontWeight: 400, ...SOFT, animationDelay: '450ms' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="rb-in mx-auto mt-3 max-w-[20rem] text-balance italic leading-[1.4]"
              style={{ fontFamily: display, fontSize: 19, color: C.soft, ...SOFT, animationDelay: '550ms' }}
            >
              {subtitle}
            </p>
          )}

          <p
            className="rb-in mt-8 text-balance break-words leading-[1.15]"
            style={{ fontFamily: hand, fontSize: 'clamp(30px, 9.4cqi, 42px)', color: C.red, animationDelay: '700ms' }}
          >
            {sister}{' '}
            <span className="mx-0.5 italic" style={{ fontFamily: display, fontSize: '0.7em', color: C.goldDeep, ...SOFT }}>
              &amp;
            </span>{' '}
            {brother}
          </p>

          <div className="rb-in mt-8" style={{ animationDelay: '850ms' }}>
            <p className="text-balance leading-[1.2]" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.6cqi, 27px)', ...SOFT }}>
              {date ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
            </p>
            {time && (
              <p className="mt-2" style={{ fontSize: 17, color: C.soft }}>
                from <span style={{ fontWeight: 500, color: C.ink }}>{time}</span>
              </p>
            )}
            {(venue || venueAddress) && (
              <div className="mt-4">
                {venue && <p className="text-balance leading-[1.25]" style={{ fontFamily: display, fontSize: 21, ...SOFT }}>{venue}</p>}
                {venueAddress && <p className="mt-1 text-balance text-[15px] leading-[1.5]" style={{ color: C.soft }}>{venueAddress}</p>}
              </div>
            )}
            {(calendar || directions) && (
              <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
                <DirectionsLink
                  href={calendar}
                  isPreview={isPreview}
                  className="rb-link inline-block text-[15px] font-medium underline decoration-1 underline-offset-[5px]"
                  style={{ color: C.redDeep }}
                >
                  Add to calendar
                </DirectionsLink>
                <DirectionsLink
                  href={directions}
                  isPreview={isPreview}
                  className="rb-link inline-block text-[15px] font-medium underline decoration-1 underline-offset-[5px]"
                  style={{ color: C.redDeep }}
                >
                  Directions
                </DirectionsLink>
              </div>
            )}
            {countdown && (
              <p className="mt-5" style={{ fontFamily: hand, fontSize: 22, color: C.redDeep }}>
                {countdown.days === 0 ? 'Almost time' : `${countdown.days} ${countdown.days === 1 ? 'day' : 'days'} to go`}
              </p>
            )}
          </div>

          {hero && (
            <div className="rb-in mx-auto mt-10 w-[min(78%,300px)]" style={{ animationDelay: '1000ms' }}>
              <div className="p-2 pb-8" style={{ background: '#FFFFFF', transform: 'rotate(-2deg)', boxShadow: '0 16px 30px -20px rgba(53,37,27,0.55)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero} alt={`${sister} and ${brother}`} className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          )}
        </header>

        {/* ── Our bond, as a letter ───────────────────────────────── */}
        {story.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-[30px] pb-14">
            <Knot />
            <Heading>Our bond</Heading>
            <div className="relative mt-8 px-6 pb-7 pt-6" style={{ background: C.card, boxShadow: '0 1px 0 rgba(53,37,27,0.05), 0 18px 34px -26px rgba(53,37,27,0.45)', transform: 'rotate(0.6deg)' }}>
              <span aria-hidden className="absolute bottom-0 left-[18px] top-0 w-px" style={{ background: 'rgba(189,42,43,0.35)' }} />
              <div
                className="pl-3"
                style={{
                  fontFamily: hand,
                  fontSize: 20,
                  lineHeight: '34px',
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 33px, ${C.rule} 33px, ${C.rule} 34px)`,
                }}
              >
                {story.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ── On the day, each moment a bead on the thread ─────────── */}
        {timeline.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-[30px] pb-14">
            <Knot pin="left" />
            <Heading>On the day</Heading>
            <ol className="mt-8 space-y-7">
              {timeline.map((item, i) => (
                <li key={`${item.title}-${i}`}>
                  {item.time && (
                    <p data-rb-bead className="tabular-nums" style={{ fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', color: C.red }}>
                      {item.time}
                    </p>
                  )}
                  {!item.time && <span data-rb-bead className="block h-0" />}
                  <p className="mt-0.5 leading-[1.25]" style={{ fontFamily: display, fontSize: 22, ...SOFT }}>
                    {item.title}
                  </p>
                  {item.note && (
                    <p className="mt-1 leading-[1.5]" style={{ fontSize: 15.5, color: C.soft }}>
                      {item.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* ── Photographs, as prints ─────────────────────────────── */}
        {photos.length > 0 && (
          <section className="mx-auto max-w-[30rem] px-[30px] pb-14">
            <Reveal disabled={isPreview}>
              <Knot />
              <Heading>Through the years</Heading>
            </Reveal>
            <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-4">
              {photos.map((src, i) => {
                const wide = i === 0 || (i === photos.length - 1 && photos.length % 2 === 0)
                return (
                  <Reveal key={`${src}-${i}`} disabled={isPreview} delay={(i % 2) * 80} className={wide ? 'col-span-2' : ''}>
                    <figure
                      className="p-[7px] pb-5"
                      style={{ background: '#FFFFFF', transform: `rotate(${[-1.4, 1.2, -0.8, 1.6, -1.2, 0.9][i % 6]}deg)`, boxShadow: '0 12px 24px -18px rgba(53,37,27,0.55)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className={`w-full object-cover ${wide ? 'aspect-[3/2]' : 'aspect-[4/5]'}`} />
                    </figure>
                  </Reveal>
                )
              })}
            </div>
          </section>
        )}

        {/* ── From the family ────────────────────────────────────── */}
        {featured.length > 0 && (
          <Reveal disabled={isPreview} as="section" className="mx-auto max-w-[30rem] px-[30px] pb-14 text-center">
            <Knot />
            <Heading>From the family</Heading>
            <ul className="mt-8 space-y-8">
              {featured.map((w, i) => (
                <li key={`${w.name}-${i}`}>
                  <p className="text-balance italic leading-[1.5]" style={{ fontFamily: display, fontSize: 19, ...SOFT }}>
                    &ldquo;{w.message}&rdquo;
                  </p>
                  <p className="mt-2" style={{ fontFamily: hand, fontSize: 20, color: C.red }}>
                    {w.name}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {eventId && (
          <div className="mx-auto max-w-[30rem] px-[10px]">
            <Knot className="-mb-6 h-[56px]" />
            <WishesSection
              eventId={eventId}
              theme={WISHES_THEME}
              title="Send your wishes"
              intro={`Leave a few words for ${sister} and ${brother}. Every guest who opens this invitation will see them.`}
            />
          </div>
        )}

        {/* ── Where the thread ends ──────────────────────────────── */}
        <footer className="px-[30px] pb-10 pt-4 text-center">
          <Knot className="h-[40px]" />
          <p className="mt-24 leading-[1.2]" style={{ fontFamily: hand, fontSize: 28, color: C.red }}>
            {sister} &amp; {brother}
          </p>
          {date && (
            <p className="mt-1" style={{ fontSize: 14, color: C.faint, letterSpacing: '0.06em' }}>
              {date.day} {date.month} {date.year}
            </p>
          )}
          <div className="mt-8">
            <Credit isPreview={isPreview} color={C.faint} linkColor={C.redDeep} />
          </div>
        </footer>
      </div>
    </div>
  )
}
