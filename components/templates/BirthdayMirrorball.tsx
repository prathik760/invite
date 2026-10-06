'use client'

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { instrument } from './kit/fonts/instrument'
import { syne } from './kit/fonts/syne'
import { jost } from './kit/fonts/jost'
import { calendarHref, dateParts, galleryImages, mapsHref, parseLines, parseSchedule, timeLabel, useCountdown, pad2, type InviteProps, fitCqi } from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { ChannelIcon, ageOf, ordinal, partyName, useRsvp } from './kit/party'
import type { InviteTheme } from './kit/theme'

/*
 * Mirrorball — a disco birthday.
 * A warm-black room. A mirror ball comes down on its chain and turns; every
 * tile is a real facet of a sphere, so the glints travel across it the way
 * they do on the real thing, and the light it throws drifts round the walls.
 * Under the name, a lit dance floor. Further down, the night as the tracklist
 * of a record that spins while you read it, a photo-booth strip, and an RSVP
 * that sends itself on WhatsApp, by text or by email.
 */

const P = {
  night: '#0D0A0B',
  deep: '#150F12',
  panel: '#1B1417',
  ink: '#F6EFE6',
  soft: 'rgba(246,239,230,0.74)',
  faint: 'rgba(246,239,230,0.5)',
  rule: 'rgba(246,239,230,0.14)',
  tangerine: '#FF6A3D',
  amber: '#FFB547',
  rose: '#FF7DA0',
  ice: '#CFE1FF',
}

const serif = instrument.style.fontFamily
const display = syne.style.fontFamily
const sans = jost.style.fontFamily

const CHROME =
  'linear-gradient(180deg, #FFFFFF 0%, #E9E4DE 30%, #8F8781 49%, #5E5752 52%, #D9D3CC 66%, #FFFFFF 84%, #B4ACA5 100%)'

const WISHES_THEME: InviteTheme = {
  bg: P.night,
  surface: P.panel,
  ink: P.ink,
  muted: P.soft,
  line: P.rule,
  accent: P.tangerine,
  onAccent: '#140B08',
  heading: serif,
  body: sans,
  headingStyle: { fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, 10cqi, 44px)', letterSpacing: '-0.01em' },
}

const SAMPLE_WISHES = [
  { name: 'Priya & Dan', message: 'Platforms are out of the loft. You have been warned.' },
  { name: 'Aunt Lou', message: 'Happy 30th, darling girl. Dance like nobody’s filming (they will be).' },
]

/* ── Seeded randomness ──────────────────────────────────────────────── */

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const round = (n: number) => Math.round(n * 10) / 10
const n1 = (n: number) => String(round(n))

/* ── The mirror ball ────────────────────────────────────────────────── */

/*
 * The ball is a sphere of mirror tiles in latitude bands — fewer tiles towards
 * the poles, as on a real one — seen from slightly below. Each frame turns it a
 * little, projects every tile, and shades it by what it would reflect: the
 * room's key light (white glints), the dance floor below (tangerine) and a cool
 * spot from the right. The tiles are written straight to the DOM, so turning
 * never re-renders React.
 */
const R = 100
const BANDS = 17
const TILT = -0.32
const SPEED = 0.32 // radians a second: one turn in about twenty seconds

interface Tile { lat0: number; lat1: number; lon: number; dlon: number; jitter: number }

function buildTiles(): Tile[] {
  const r = rng(11)
  const tiles: Tile[] = []
  for (let b = 0; b < BANDS; b++) {
    const lat1 = Math.PI / 2 - (b * Math.PI) / BANDS
    const lat0 = lat1 - Math.PI / BANDS
    const n = Math.max(6, Math.round(38 * Math.cos((lat0 + lat1) / 2)))
    for (let k = 0; k < n; k++) tiles.push({ lat0, lat1, lon: (k / n) * Math.PI * 2, dlon: (Math.PI * 2) / n, jitter: (r() - 0.5) * 0.36 })
  }
  return tiles
}

const norm = (x: number, y: number, z: number): [number, number, number] => {
  const l = Math.hypot(x, y, z)
  return [x / l, y / l, z / l]
}
const KEY = norm(-0.5, 0.6, 0.62)
const FLOOR = norm(0.55, -0.62, 0.56)
const SPOT = norm(0.72, 0.32, 0.6)
const cT = Math.cos(TILT)
const sT = Math.sin(TILT)

function project(lat: number, lon: number): [number, number, number] {
  const X = Math.cos(lat) * Math.sin(lon)
  const Y = Math.sin(lat)
  const Z = Math.cos(lat) * Math.cos(lon)
  return [X, Y * cT - Z * sT, Y * sT + Z * cT]
}

function screen(p: [number, number, number]): string {
  let [x, y] = p
  // A corner just past the limb would fold back inside the disc; pin it to the rim.
  if (p[2] < 0) {
    const l = Math.hypot(x, y) || 1
    x /= l
    y /= l
  }
  return `${n1(x * R)},${n1(-y * R)}`
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))

function frame(tiles: Tile[], turn: number): { points: string; fill: string }[] {
  return tiles.map((t) => {
    let lon = (t.lon + turn) % (Math.PI * 2)
    if (lon > Math.PI) lon -= Math.PI * 2
    const mid = (t.lat0 + t.lat1) / 2
    const n = project(mid, lon + t.dlon / 2)
    if (n[2] < 0.05) return { points: '', fill: 'none' }
    const g = 0.017
    const gl = g / Math.max(Math.cos(mid), 0.25)
    const pts = [
      project(t.lat1 - g, lon + gl),
      project(t.lat1 - g, lon + t.dlon - gl),
      project(t.lat0 + g, lon + t.dlon - gl),
      project(t.lat0 + g, lon + gl),
    ]
      .map(screen)
      .join(' ')
    // what the facet reflects back to the viewer
    const d = Math.max(0, n[0] * KEY[0] + n[1] * KEY[1] + n[2] * KEY[2])
    const rv: [number, number, number] = [2 * n[2] * n[0], 2 * n[2] * n[1], 2 * n[2] * n[2] - 1]
    const dot = (v: [number, number, number]) => Math.max(0, rv[0] * v[0] + rv[1] * v[1] + rv[2] * v[2])
    const glint = Math.pow(dot(KEY), 22)
    const warm = Math.pow(dot(FLOOR), 5)
    const cool = Math.pow(dot(SPOT), 9)
    const limb = 0.5 + 0.5 * n[2]
    const grey = (44 + 180 * Math.max(0, 0.2 + 0.6 * d + t.jitter)) * limb
    const fill = `rgb(${clamp(grey + 255 * warm * 0.75 + 190 * cool * 0.45 + 255 * glint)},${clamp(grey + 112 * warm * 0.75 + 214 * cool * 0.45 + 250 * glint)},${clamp(grey * 1.02 + 62 * warm * 0.75 + 255 * cool * 0.45 + 240 * glint)})`
    return { points: pts, fill }
  })
}

function MirrorBall({ spin }: { spin: boolean }) {
  const tiles = useMemo(buildTiles, [])
  const first = useMemo(() => frame(tiles, 0.4), [tiles])
  const refs = useRef<(SVGPolygonElement | null)[]>([])
  const svg = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!spin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    if (svg.current) io.observe(svg.current)
    const start = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden || now - last < 33) return
      last = now
      const f = frame(tiles, 0.4 + ((now - start) / 1000) * SPEED)
      for (let i = 0; i < f.length; i++) {
        const el = refs.current[i]
        if (!el) continue
        el.setAttribute('points', f[i].points)
        el.setAttribute('fill', f[i].fill)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [spin, tiles])

  return (
    <svg ref={svg} viewBox="-104 -104 208 208" className="block h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
      <circle r={R} fill="#1A1617" />
      {first.map((t, i) => (
        <polygon key={i} ref={(el) => { refs.current[i] = el }} points={t.points} fill={t.fill} />
      ))}
      {/* the rim catches a little of the floor */}
      <circle r={R - 0.5} fill="none" stroke="rgba(255,122,70,0.28)" strokeWidth={1.2} strokeDasharray="0 150 120 999" transform="rotate(-10)" />
      <Glint x={-30} y={-38} size={30} delay={0} />
      <Glint x={42} y={34} size={18} delay={1.3} warm />
      <Glint x={-62} y={18} size={12} delay={2.4} />
    </svg>
  )
}

/** A four-point star where the key light hits square on. */
function Glint({ x, y, size, delay, warm }: { x: number; y: number; size: number; delay: number; warm?: boolean }) {
  const s = size / 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="mb-glint" style={{ animationDelay: `${delay}s`, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path
          d={`M0 ${-s}C${s * 0.08} ${-s * 0.2} ${s * 0.2} ${-s * 0.08} ${s} 0C${s * 0.2} ${s * 0.08} ${s * 0.08} ${s * 0.2} 0 ${s}C${-s * 0.08} ${s * 0.2} ${-s * 0.2} ${s * 0.08} ${-s} 0C${-s * 0.2} ${-s * 0.08} ${-s * 0.08} ${-s * 0.2} 0 ${-s}Z`}
          fill={warm ? '#FFE2C4' : '#FFFFFF'}
        />
        <circle r={s * 0.22} fill="#FFFFFF" />
      </g>
    </g>
  )
}

/* ── Light thrown round the room ────────────────────────────────────── */

const FLECK_COLOURS = ['#FFFFFF', P.ice, P.amber, P.tangerine, '#FFFFFF', P.rose, P.ice, '#FFFFFF']

/**
 * The spots of light a turning ball throws. They sit on a ring centred on the
 * ball and the ring turns with it, so far spots sweep faster than near ones —
 * which is how it looks in a real room.
 */
function Flecks({ count, spread, seed }: { count: number; spread: number; seed: number }) {
  const spots = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, (_, i) => {
      const a = r() * Math.PI * 2
      const d = 70 + Math.pow(r(), 0.7) * spread
      const w = 3 + r() * 7
      return {
        x: round(Math.cos(a) * d),
        y: round(Math.sin(a) * d * 0.82),
        w: round(w),
        h: round(w * (0.45 + r() * 0.4)),
        rot: round((a * 180) / Math.PI + 90),
        c: FLECK_COLOURS[i % FLECK_COLOURS.length],
        dur: round(1.6 + r() * 2.8),
        delay: round(-r() * 4),
      }
    })
  }, [count, spread, seed])
  return (
    <div className="mb-ring pointer-events-none absolute left-1/2 top-0 h-0 w-0" aria-hidden>
      {spots.map((s, i) => (
        <span
          key={i}
          className="mb-fleck absolute block rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.w,
            height: s.h,
            background: s.c,
            boxShadow: `0 0 ${round(s.w * 1.6)}px ${round(s.w * 0.3)}px ${s.c}`,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ── The dance floor ────────────────────────────────────────────────── */

const FLOOR_COLOURS = [P.tangerine, P.amber, P.rose, P.ice, P.amber, P.tangerine]

function DanceFloor() {
  const tiles = useMemo(() => {
    const r = rng(29)
    return Array.from({ length: 9 * 6 }, (_, i) => ({
      c: FLOOR_COLOURS[Math.floor(r() * FLOOR_COLOURS.length)],
      dur: round(2.2 + r() * 3.4),
      delay: round(-r() * 5),
      key: i,
    }))
  }, [])
  return (
    <div
      className="pointer-events-none absolute inset-x-[-30%] bottom-0 h-[34%]"
      style={{ perspective: 380, maskImage: 'linear-gradient(to top, #000 35%, transparent 96%)', WebkitMaskImage: 'linear-gradient(to top, #000 35%, transparent 96%)' }}
      aria-hidden
    >
      <div className="grid h-[150%] w-full origin-bottom grid-cols-9 gap-[3px]" style={{ transform: 'rotateX(64deg)', transformOrigin: '50% 100%', position: 'absolute', bottom: 0 }}>
        {tiles.map((t) => (
          <span
            key={t.key}
            className="mb-tile block rounded-[2px]"
            style={{ background: t.c, boxShadow: `0 0 18px ${t.c}`, animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── The record ─────────────────────────────────────────────────────── */

function Record({ name, age }: { name: string; age: number | null }) {
  const grooves = Array.from({ length: 16 }, (_, i) => 44 + i * 3.1)
  return (
    <svg viewBox="-100 -100 200 200" className="mb-record block h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="mb-vinyl" r="1">
          <stop offset="0.3" stopColor="#1E1A1C" />
          <stop offset="1" stopColor="#0A0809" />
        </radialGradient>
        <linearGradient id="mb-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.35" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.16)" />
          <stop offset="0.65" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <circle r={98} fill="url(#mb-vinyl)" />
      {grooves.map((g, i) => (
        <circle key={i} r={g} fill="none" stroke={i % 5 === 4 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.045)'} strokeWidth={i % 5 === 4 ? 0.9 : 0.6} />
      ))}
      <circle r={38} fill={P.tangerine} />
      <circle r={34} fill="none" stroke="rgba(20,11,8,0.35)" strokeWidth={0.6} />
      <text y={-12} textAnchor="middle" fontFamily={display} fontSize={8.5} fontWeight={700} letterSpacing={2.4} fill="#160B07">
        {name.toUpperCase().slice(0, 12)}
      </text>
      <text y={8} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={19} fill="#160B07">
        {age ? ordinal(age) : 'birthday'}
      </text>
      <text y={22} textAnchor="middle" fontFamily={display} fontSize={5.4} fontWeight={600} letterSpacing={1.8} fill="rgba(22,11,7,0.72)">
        33⅓ · SIDE A
      </text>
      <circle r={3.2} fill={P.night} />
      <circle r={98} fill="url(#mb-sheen)" />
    </svg>
  )
}

/* ── Small parts ────────────────────────────────────────────────────── */

const chrome = (extra?: CSSProperties): CSSProperties => ({
  backgroundImage: CHROME,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  ...extra,
})

function Label({ children, color = P.faint, className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: display, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.3em', color }}>
      {children}
    </p>
  )
}

function PillLink({ href, isPreview, solid, children }: { href: string | null; isPreview: boolean; solid?: boolean; children: ReactNode }) {
  return (
    <DirectionsLink
      href={href}
      isPreview={isPreview}
      className="mb-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-5 text-center"
      style={{
        fontFamily: display,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        ...(solid ? { background: P.tangerine, color: '#160B07' } : { border: `1px solid ${P.rule}`, color: P.ink, background: 'rgba(246,239,230,0.04)' }),
      }}
    >
      {children}
    </DirectionsLink>
  )
}

/** Its own component, so the once-a-second tick re-renders only the numbers. */
function Countdown({ date, time, enabled }: { date?: string; time?: string; enabled: boolean }) {
  const c = useCountdown(date, time, enabled)
  if (!c) return null
  const cells: [number, string][] = [
    [c.days, c.days === 1 ? 'day' : 'days'],
    [c.hours, 'hrs'],
    [c.minutes, 'min'],
    [c.seconds, 'sec'],
  ]
  return (
    <Reveal disabled={!enabled} className="mx-auto mt-16 w-[min(100%,26rem)] text-center">
      <Label color={P.amber}>Until the floor opens</Label>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {cells.map(([n, l]) => (
          <div key={l} className="rounded-[14px] py-3" style={{ background: P.panel, border: `1px solid ${P.rule}` }}>
            <p className="tabular-nums leading-none" style={chrome({ fontFamily: serif, fontSize: 'clamp(34px, 11cqi, 46px)' })}>
              {l === 'days' || l === 'day' ? n : pad2(n)}
            </p>
            <p className="mt-1.5 uppercase" style={{ fontFamily: display, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.24em', color: P.faint }}>
              {l}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

function Rsvp({ phone, email, what, date, rsvpBy, isPreview }: { phone?: string; email?: string; what: string; date?: string; rsvpBy?: string; isPreview: boolean }) {
  const r = useRsvp({ phone, email, what, date })
  if (!r.available) return null
  const by = dateParts(rsvpBy)
  return (
    <section className="px-5 pb-20 pt-4">
      <Reveal disabled={isPreview} className="mx-auto w-[min(100%,28rem)] rounded-[26px] p-7 text-center" style={{ background: `linear-gradient(160deg, ${P.panel}, ${P.deep})`, border: `1px solid ${P.rule}` }}>
        <Label color={P.amber}>RSVP</Label>
        <h2 className="mt-3" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(36px, 11cqi, 48px)', lineHeight: 1, color: P.ink }}>
          Are you in?
        </h2>
        {by && (
          <p className="mt-3" style={{ fontSize: 15, color: P.soft }}>
            Let me know by {by.weekday} {by.day} {by.month}
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-2.5" role="group" aria-label="Your answer">
          {(['yes', 'no'] as const).map((a) => {
            const on = r.answer === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => r.setAnswer(a)}
                aria-pressed={on}
                className="mb-btn min-h-[52px] rounded-full px-3"
                style={{
                  fontFamily: sans,
                  fontSize: 16.5,
                  fontWeight: 500,
                  background: on ? (a === 'yes' ? P.tangerine : P.ink) : 'transparent',
                  color: on ? '#160B07' : P.ink,
                  border: `1px solid ${on ? 'transparent' : P.rule}`,
                }}
              >
                {a === 'yes' ? 'I’m in' : 'Can’t make it'}
              </button>
            )
          })}
        </div>
        {r.answer && (
          <div className="mb-pop mt-5">
            <p style={{ fontSize: 14.5, color: P.soft }}>{r.answer === 'yes' ? 'Brilliant. Send it to me on' : 'Ah, next time. Tell me on'}</p>
            <div className="mt-3 grid gap-2">
              {r.channels.map((c) => (
                <a
                  key={c.kind}
                  href={isPreview ? undefined : c.href}
                  target={c.kind === 'whatsapp' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={isPreview || undefined}
                  className="mb-btn flex min-h-[48px] items-center justify-center gap-2.5 rounded-full"
                  style={{ fontFamily: sans, fontSize: 15.5, fontWeight: 500, color: P.ink, background: 'rgba(246,239,230,0.06)', border: `1px solid ${P.rule}` }}
                >
                  <ChannelIcon kind={c.kind} />
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  )
}

/** Up to four photos per strip, the way a booth prints them. */
function BoothStrips({ photos, name, age, isPreview }: { photos: string[]; name: string; age: number | null; isPreview: boolean }) {
  if (!photos.length) return null
  const strips: string[][] = []
  for (let i = 0; i < photos.length; i += 4) strips.push(photos.slice(i, i + 4))
  const stamp = `${name.toUpperCase()}${age ? ` · ${age}` : ''}`
  return (
    <section className="overflow-hidden px-5 pb-20 pt-6">
      <Label className="text-center" color={P.amber}>From the booth</Label>
      <div className="mt-8 flex flex-wrap items-start justify-center gap-6">
        {strips.map((s, si) => (
          <Reveal key={si} disabled={isPreview} delay={si * 120}>
            <figure
              className="m-0 p-[9px] pb-0"
              style={{ width: 'min(40cqi, 168px)', background: '#F4EFE8', transform: `rotate(${si % 2 ? 3.2 : -2.6}deg)`, boxShadow: '0 22px 40px rgba(0,0,0,0.5)' }}
            >
              {s.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" loading="lazy" className="mb-[9px] block aspect-[4/3.4] w-full object-cover" style={{ filter: 'contrast(1.06) saturate(0.9)' }} />
              ))}
              <figcaption className="py-2.5 text-center" style={{ fontFamily: display, fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: '#2A2224' }}>
                {stamp}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── The invitation ─────────────────────────────────────────────────── */

export default function BirthdayMirrorball({ data, eventId, isPreview = false }: InviteProps) {
  const name = data.celebrantName?.trim() || 'Maya'
  const age = ageOf(data.age)
  const what = partyName(name, age)
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const tagline = data.theme?.trim() || 'A disco birthday'
  const plan = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const note = useMemo(() => parseLines(data.message), [data.message])
  const photos = useMemo(() => {
    const own = data.celebrantPhoto && /^(https?:)?\//.test(data.celebrantPhoto) ? [data.celebrantPhoto] : []
    return [...own, ...galleryImages(data.galleryImages, 8)].slice(0, 8)
  }, [data.celebrantPhoto, data.galleryImages])
  const map = mapsHref(data.mapsUrl, venue, address)
  const calendar = calendarHref(what, data.date, data.time, [venue, address].filter(Boolean).join(', ') || undefined, 5)
  const signer = data.invitedBy?.trim() || name
  const animate = !isPreview

  // The name is set as large as its length allows.
  // Sized by the longest word (the last one carries the "’s"), so a long
  // name wraps between words and shrinks rather than breaking mid-word.
  const nameWords = name.split(/\s+/)
  const nameCqi = Math.min(26, 88 / (Math.max(5, ...nameWords.map((w, i) => w.length + (i === nameWords.length - 1 ? 2 : 0))) * 0.5))
  const sideA = plan.slice(0, Math.ceil(plan.length / 2))
  const sideB = plan.slice(Math.ceil(plan.length / 2))

  return (
    <div className={`mb relative ${animate ? 'mb-in' : ''}`} style={{ background: P.night, color: P.ink, fontFamily: sans, overflowX: 'clip' }}>
      <style>{`
        .mb .mb-glint { animation: mb-glint 3.6s ease-in-out infinite; }
        @keyframes mb-glint { 0%, 100% { opacity: .15; transform: scale(.4) rotate(0deg); } 45% { opacity: 1; transform: scale(1) rotate(25deg); } 60% { opacity: .9; } }
        .mb .mb-ring { animation: mb-ring 48s linear infinite; }
        @keyframes mb-ring { to { transform: rotate(360deg); } }
        .mb .mb-fleck { animation-name: mb-fleck; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @keyframes mb-fleck { 0%, 100% { opacity: .18; } 50% { opacity: 1; } }
        .mb .mb-tile { animation-name: mb-tile; animation-iteration-count: infinite; animation-timing-function: ease-in-out; opacity: .16; }
        @keyframes mb-tile { 0%, 100% { opacity: .1; } 50% { opacity: .92; } }
        .mb .mb-sway { animation: mb-sway 7s ease-in-out infinite; transform-origin: 50% 0; }
        @keyframes mb-sway { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
        .mb .mb-sheen { background-size: 260% 100%, 100% 100%; animation: mb-sheen 6s ease-in-out infinite; }
        @keyframes mb-sheen { 0%, 55% { background-position: 130% 0, 0 0; } 100% { background-position: -130% 0, 0 0; } }
        .mb .mb-record { animation: mb-spin 3.6s linear infinite; }
        @keyframes mb-spin { to { transform: rotate(360deg); } }
        .mb .mb-btn { transition: transform .18s ease, background-color .18s ease, opacity .18s ease; }
        .mb .mb-btn:active { transform: scale(.97); }
        .mb .mb-pop { animation: mb-pop .38s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes mb-pop { from { opacity: 0; transform: translateY(8px); } }
        .mb.mb-in .mb-drop { animation: mb-drop 1.5s cubic-bezier(.3,1.32,.5,1) .1s both; }
        @keyframes mb-drop { from { transform: translateY(-120%); } }
        .mb.mb-in .mb-rise { animation: mb-rise .9s cubic-bezier(.2,.75,.25,1) both; }
        @keyframes mb-rise { from { opacity: 0; transform: translateY(22px); filter: blur(6px); } }
        .mb.mb-in .mb-lights { animation: mb-lights 1.2s ease 1.1s both; }
        @keyframes mb-lights { from { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .mb .mb-glint, .mb .mb-ring, .mb .mb-fleck, .mb .mb-tile, .mb .mb-sway, .mb .mb-sheen, .mb .mb-record,
          .mb.mb-in .mb-drop, .mb.mb-in .mb-rise, .mb.mb-in .mb-lights { animation: none; }
          .mb .mb-tile { opacity: .45; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={P.ink} background="rgba(13,10,11,0.7)" border={P.rule} />

      {/* ── The room ─────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center overflow-hidden"
        style={{
          minHeight: isPreview ? 700 : '100svh',
          background: `radial-gradient(70% 45% at 50% 16%, rgba(255,140,90,0.13), transparent 70%), radial-gradient(90% 40% at 50% 100%, rgba(255,106,61,0.22), transparent 72%), ${P.night}`,
        }}
      >
        <div className="mb-lights absolute inset-0" style={{ top: 'clamp(150px, 27svh, 230px)' }}>
          <Flecks count={58} spread={560} seed={5} />
        </div>
        <DanceFloor />

        {/* chain and ball */}
        <div className="mb-drop relative z-[1] flex w-full justify-center" style={{ height: 'clamp(220px, 34svh, 300px)' }}>
          <div className="mb-sway absolute top-0 flex flex-col items-center">
            <span className="block w-[2px]" style={{ height: 'clamp(40px, 9svh, 80px)', background: 'repeating-linear-gradient(180deg, #9C958E 0 5px, #4A4542 5px 7px)' }} />
            <span className="block h-[10px] w-[18px] rounded-t-[3px]" style={{ background: 'linear-gradient(90deg, #6E6863, #E1DCD6, #7A746F)' }} />
            <div className="-mt-[3px] h-[clamp(150px,24svh,200px)] w-[clamp(150px,24svh,200px)]" style={{ filter: 'drop-shadow(0 18px 40px rgba(255,106,61,0.25))' }}>
              <MirrorBall spin />
            </div>
          </div>
        </div>

        {/* the words */}
        <div className="relative z-[2] mx-auto w-full max-w-[30rem] px-6 text-center" style={{ containerType: 'inline-size' }}>
          <div className="mb-rise" style={{ animationDelay: '.9s' }}>
            <Label color={P.amber}>
              {date ? `${date.weekday} · ${date.day} ${date.month}` : 'You’re invited'}
            </Label>
          </div>
          <h1 className="mt-[4cqi]" style={{ fontWeight: 400, lineHeight: 0.86 }}>
            <span
              className="mb-rise mb-sheen block break-words"
              style={chrome({
                fontFamily: serif,
                fontStyle: 'italic',
                fontSize: `clamp(22px, ${nameCqi.toFixed(1)}cqi, 132px)`,
                letterSpacing: '-0.015em',
                backgroundImage: `linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.95) 50%, transparent 58%), ${CHROME}`,
                filter: 'drop-shadow(0 6px 22px rgba(255,120,70,0.22))',
                animationDelay: '1.05s',
                paddingBottom: '0.2em',
                marginBottom: '-0.2em',
              })}
            >
              {name}’s
            </span>
            {age ? (
              <span className="mb-rise relative inline-block" style={{ animationDelay: '1.2s' }}>
                <span style={chrome({ fontFamily: serif, fontSize: 'clamp(120px, 50cqi, 230px)', letterSpacing: '-0.04em', filter: 'drop-shadow(0 10px 30px rgba(255,120,70,0.28))' })}>
                  {age}
                </span>
                <span className="absolute left-full top-[18%] ml-1" style={{ fontFamily: display, fontWeight: 800, fontSize: 'clamp(18px, 7cqi, 30px)', letterSpacing: '0.04em', color: P.tangerine }}>
                  {ordinal(age).slice(String(age).length).toUpperCase()}
                </span>
              </span>
            ) : (
              <span className="mb-rise mt-[2cqi] block" style={chrome({ fontFamily: serif, fontSize: 'clamp(64px, 24cqi, 120px)', animationDelay: '1.2s', paddingBottom: '0.15em', marginBottom: '-0.15em' })}>
                {/birthday/i.test(tagline) ? 'party' : 'birthday'}
              </span>
            )}
          </h1>
          <p className="mb-rise mt-[3cqi] uppercase" style={{ fontFamily: display, fontWeight: 700, fontSize: 'clamp(13px, 4.1cqi, 17px)', letterSpacing: '0.34em', color: P.ink, animationDelay: '1.35s' }}>
            {tagline}
          </p>
          <p className="mb-rise mt-[3.4cqi] pb-[30svh]" style={{ fontSize: 'clamp(15px, 4.4cqi, 18px)', color: P.soft, animationDelay: '1.5s' }}>
            {[time && `${time} till late`, venue].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      {/* ── The details ──────────────────────────────────────────────── */}
      <div className="relative" style={{ containerType: 'inline-size' }}>
        <section className="relative overflow-hidden px-5 pb-6 pt-16">
          <div className="pointer-events-none absolute inset-0 opacity-50" style={{ top: 40 }}>
            <Flecks count={22} spread={380} seed={17} />
          </div>
          <Reveal disabled={isPreview} className="relative mx-auto w-[min(100%,28rem)]">
            <Label color={P.amber}>The details</Label>
            <dl
              className="mt-5 space-y-7 rounded-[24px] px-6 py-7"
              style={{ background: 'linear-gradient(170deg, rgba(246,239,230,0.07), rgba(246,239,230,0.015) 60%)', border: `1px solid ${P.rule}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.35)' }}
            >
              <div>
                <dt><Label>When</Label></dt>
                <dd className="mt-1.5" style={{ fontFamily: serif, fontSize: 'clamp(28px, 8.4cqi, 36px)', lineHeight: 1.08 }}>
                  {date ? `${date.weekday} ${date.day} ${date.month}` : 'Date to come'}
                  {time && <span className="mt-1 block" style={{ fontFamily: sans, fontSize: 16, color: P.soft }}>From {time} — till late</span>}
                </dd>
              </div>
              {(venue || address) && (
                <div>
                  <dt><Label>Where</Label></dt>
                  <dd className="mt-1.5" style={{ fontFamily: serif, fontSize: 'clamp(28px, 8.4cqi, 36px)', lineHeight: 1.08 }}>
                    {venue}
                    {address && <span className="mt-1 block" style={{ fontFamily: sans, fontSize: 16, color: P.soft, lineHeight: 1.45 }}>{address}</span>}
                  </dd>
                </div>
              )}
              {data.dressCode?.trim() && (
                <div>
                  <dt><Label>Wear</Label></dt>
                  <dd className="mt-1.5" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(24px, 7cqi, 30px)', lineHeight: 1.15 }}>
                    {data.dressCode.trim()}
                  </dd>
                </div>
              )}
            </dl>
            {(map || calendar) && (
              <div className="mt-8 grid grid-cols-2 gap-2.5">
                {map && <PillLink href={map} isPreview={isPreview} solid>Directions</PillLink>}
                {calendar && <PillLink href={calendar} isPreview={isPreview}>Calendar</PillLink>}
              </div>
            )}
            {data.guestNote?.trim() && (
              <p
                className="mt-8 flex items-start gap-3 rounded-[16px] px-4 py-3.5"
                style={{ background: 'rgba(255,106,61,0.12)', border: '1px solid rgba(255,106,61,0.35)', fontSize: 16, lineHeight: 1.45 }}
              >
                <span aria-hidden style={{ color: P.tangerine, fontSize: 18, lineHeight: 1.2 }}>✦</span>
                {data.guestNote.trim()}
              </p>
            )}
          </Reveal>
          <Countdown date={data.date} time={data.time} enabled={!isPreview} />
        </section>

        {/* ── The night, as a record ─────────────────────────────────── */}
        {plan.length > 0 && (
          <section className="px-5 pb-16 pt-14">
            <Reveal disabled={isPreview} className="mx-auto w-[min(100%,28rem)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <Label color={P.amber}>The night</Label>
                  <h2 className="mt-2" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(38px, 12cqi, 52px)', lineHeight: 0.95 }}>
                    Tracklist
                  </h2>
                </div>
                <div className="relative -mr-[14cqi] h-[min(46cqi,200px)] w-[min(46cqi,200px)] shrink-0">
                  <Record name={name} age={age} />
                </div>
              </div>
              {[['A', sideA], ['B', sideB]].map(([side, items]) =>
                (items as typeof plan).length ? (
                  <div key={side as string} className="mt-6">
                    <Label>Side {side as string}</Label>
                    <ol className="mt-2">
                      {(items as typeof plan).map((it, i) => (
                        <li key={i} className="flex items-baseline gap-3 py-2.5" style={{ borderBottom: `1px solid ${P.rule}` }}>
                          <span className="w-7 shrink-0" style={{ fontFamily: display, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: P.tangerine }}>
                            {side as string}{i + 1}
                          </span>
                          <span className="min-w-0 flex-1" style={{ fontSize: 17 }}>{it.title}</span>
                          {it.time && <span className="shrink-0 tabular-nums" style={{ fontFamily: display, fontSize: 13, fontWeight: 600, color: P.soft }}>{it.time}</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null,
              )}
            </Reveal>
          </section>
        )}

        {/* ── A note ─────────────────────────────────────────────────── */}
        {note.length > 0 && (
          <section className="px-6 pb-16 pt-6">
            <Reveal disabled={isPreview} className="mx-auto w-[min(100%,27rem)]">
              <svg viewBox="0 0 40 28" className="block h-[28px] w-[40px]" aria-hidden>
                <path d="M15 2C7 4.5 2 11 2 19c0 4 2.6 7 6.2 7 3.2 0 5.8-2.4 5.8-5.6 0-3.1-2.3-5.4-5.3-5.6C9.6 10 12 6.4 16 4.6ZM37 2c-8 2.5-13 9-13 17 0 4 2.6 7 6.2 7 3.2 0 5.8-2.4 5.8-5.6 0-3.1-2.3-5.4-5.3-5.6C31.6 10 34 6.4 38 4.6Z" fill={P.tangerine} />
              </svg>
              {note.map((line, i) => (
                <p key={i} className="mt-3" style={{ fontFamily: serif, fontSize: 'clamp(24px, 7.4cqi, 31px)', lineHeight: 1.22, textWrap: 'pretty' }}>
                  {line}
                </p>
              ))}
              <p className="mt-5" style={{ fontFamily: display, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.amber }}>
                — {signer}
              </p>
              {data.giftNote?.trim() && (
                <p className="mt-8" style={{ fontSize: 15.5, color: P.soft, borderTop: `1px solid ${P.rule}`, paddingTop: 16 }}>
                  <span style={{ color: P.ink }}>Gifts · </span>{data.giftNote.trim()}
                </p>
              )}
            </Reveal>
          </section>
        )}

        <BoothStrips photos={photos} name={name} age={age} isPreview={isPreview} />

        <Rsvp phone={data.rsvpPhone} email={data.rsvpEmail} what={what} date={data.date} rsvpBy={data.rsvpBy} isPreview={isPreview} />

        {eventId && (
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title={`Notes for ${name}`}
            intro={`A birthday message, a memory, a song request — leave a few words for ${name}. Everyone who opens this page can read them.`}
            noun="note"
            previewWishes={SAMPLE_WISHES}
            namePlaceholder="e.g. Priya & Dan"
          />
        )}

        {/* ── Foot ───────────────────────────────────────────────────── */}
        <footer className="relative overflow-hidden px-6 pb-10 pt-16 text-center" style={{ background: `radial-gradient(80% 60% at 50% 100%, rgba(255,106,61,0.18), transparent 70%), ${P.deep}` }}>
          {/* its own container, so a long name is sized to the footer instead of running off it */}
          <div style={{ containerType: 'inline-size', width: '100%' }}>
            <p style={chrome({ fontFamily: serif, fontStyle: 'italic', fontSize: `clamp(24px, ${fitCqi(name, { em: 0.52, max: 54 })}cqi, 54px)`, lineHeight: 1.05 })}>
              {name}{age ? ` · ${age}` : ''}
            </p>
          </div>
          <p className="mt-3 uppercase" style={{ fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: '0.32em', color: P.faint }}>
            {[date ? `${date.day} ${date.month} ${date.year}` : '', venue].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-9">
            <Credit isPreview={isPreview} color={P.faint} linkColor={P.ink} />
          </div>
        </footer>
      </div>
    </div>
  )
}
