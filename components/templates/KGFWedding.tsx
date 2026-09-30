'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import WishesSection from './WishesSection'
import { cinzel } from './kit/fonts/cinzel'
import { oswald } from './kit/fonts/oswald'
import {
  calendarHref,
  dateParts,
  galleryImages,
  mapsHref,
  pad2,
  parseLines,
  parseSchedule,
  timeLabel,
  useCountdown,
  type InviteProps,
} from './kit/core'
import { Credit, DirectionsLink, MusicToggle, Reveal } from './kit/ui'
import { numberWords } from './kit/words'
import type { InviteTheme } from './kit/theme'

/*
 * KGF Wedding — the poster for a period epic.
 * Coal black, antique gold and a line of ember along a mountain ridge.
 * Monumental stacked names (the only gold foil), then the invitation told in
 * chapters: the families, the story, the wedding. Gritty, heavy, printed.
 */

const K = {
  coal: '#0D0C0A',
  deep: '#070605',
  bone: '#E8DFCC',
  soft: 'rgba(232,223,204,0.74)',
  faint: 'rgba(232,223,204,0.48)',
  gold: '#C9A55C',
  goldDim: 'rgba(201,165,92,0.62)',
  rule: 'rgba(201,165,92,0.28)',
  ember: '#D4683C',
}

const display = cinzel.style.fontFamily
const sans = oswald.style.fontFamily

/** Antique gold leaf — used on the names and nowhere else. */
const FOIL = 'linear-gradient(178deg, #F3E0A6 0%, #D8B765 28%, #9A7231 50%, #C8A256 64%, #EACD89 82%, #A57C3E 100%)'

const WISHES_THEME: InviteTheme = {
  bg: 'transparent',
  surface: 'rgba(232,223,204,0.04)',
  ink: K.bone,
  muted: K.soft,
  line: K.rule,
  accent: K.gold,
  onAccent: K.coal,
  heading: display,
  body: sans,
  headingStyle: { textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, fontSize: 28 },
}

function noise(opacity: number, size: number, freq: number): CSSProperties {
  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.92 0 0 0 0 0.86 0 0 0 0 0.74 0 0 0 ${opacity} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: `${size}px ${size}px`,
  }
}

/** Worn-print mask: knocks tiny specks out of the gold, like ink that didn't take. */
const WORN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -22 0 0 0 15.6'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)'/%3E%3C/svg%3E")`

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A mountain ridge in a 400×120 box: jittered points pulled up into peaks. */
function ridge(seed: number, base: number, jitter: number, step: number, peaks: [number, number, number][]) {
  const r = rng(seed)
  const pts: [number, number][] = []
  for (let x = 0; x < 400; x += step * (0.55 + r() * 0.9)) {
    let y = base + (r() - 0.5) * jitter
    for (const [px, h, w] of peaks) y -= h * Math.max(0, 1 - Math.abs(x - px) / w)
    pts.push([x, y])
  }
  pts.push([400, base - 4])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return { line, fill: `${line} L400 120 L0 120 Z` }
}

const FAR = ridge(9, 70, 6, 14, [[70, 26, 90], [300, 34, 110]])
const NEAR = ridge(23, 92, 9, 7, [[150, 50, 95], [345, 22, 60]])

function roman(n: number) {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (n >= v) { out += s; n -= v }
  return out
}

/**
 * Poster caps fill their measure: size a line from its longest word so a long
 * name steps down instead of running off the edge. `span` is the measure in
 * cqi, `k` the face's average capital width in em.
 */
function fit(names: string[], span: number, k: number, min: number, max: number) {
  const n = Math.max(3, ...names.map((s) => Math.max(...s.split(/\s+/).map((w) => w.length), s.length * 0.62)))
  const cqi = Math.min(22, span / (n * k))
  return `clamp(${min}px, ${cqi.toFixed(2)}cqi, ${max}px)`
}

function Label({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={`uppercase ${className}`} style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.34em', color: K.ember, ...style }}>
      {children}
    </p>
  )
}

function Chapter({ n, title }: { n: number; title: string }) {
  return (
    <header className="flex items-end gap-4 border-b pb-4" style={{ borderColor: K.rule }}>
      <span
        aria-hidden
        className="shrink-0 leading-[0.78]"
        style={{ fontFamily: display, fontWeight: 700, fontSize: 64, color: K.gold, WebkitMaskImage: WORN, maskImage: WORN, WebkitMaskSize: '220px 220px', maskSize: '220px 220px' }}
      >
        {roman(n)}
      </span>
      <div className="min-w-0 pb-0.5">
        <Label>Chapter {numberWords(n)}</Label>
        <h2 className="mt-2 uppercase leading-[1.05]" style={{ fontFamily: display, fontSize: 'clamp(24px, 7.4cqi, 32px)', fontWeight: 600, letterSpacing: '0.03em' }}>
          {title}
        </h2>
      </div>
    </header>
  )
}

interface Person {
  role: string
  name: string
  family?: string
  photo?: string
}

export default function KGFWedding({ data, eventId, isPreview = false }: InviteProps) {
  const groom = data.groomName?.trim() || 'Rocky'
  const bride = data.brideName?.trim() || 'Reena'
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const countdown = useCountdown(data.date, data.time, !isPreview)
  const schedule = useMemo(() => parseSchedule(data.schedule), [data.schedule])
  const photos = useMemo(() => galleryImages(data.galleryImages, 5), [data.galleryImages])
  const story = useMemo(
    () => parseLines(data.coupleStory).flatMap((p) => p.match(/[^.!?]+[.!?]*["”’]?/g) ?? [p]).map((s) => s.trim()).filter(Boolean),
    [data.coupleStory],
  )
  const directions = mapsHref(data.mapsUrl, data.venue, data.venueAddress)
  const place = [data.venue, data.venueAddress].filter(Boolean).join(', ')
  const calendar = calendarHref(`Wedding of ${groom} & ${bride}`, data.date, data.time, place)
  const venue = data.venue?.trim() || 'The venue'
  const isPhoto = (u?: string) => !!u && /^(https?:)?\//.test(u)

  const people: Person[] = [
    { role: 'The groom', name: groom, family: data.groomFamilyDetails?.trim(), photo: isPhoto(data.groomPhoto) ? data.groomPhoto : undefined },
    { role: 'The bride', name: bride, family: data.brideFamilyDetails?.trim(), photo: isPhoto(data.bridePhoto) ? data.bridePhoto : undefined },
  ]
  const hasFamilies = people.some((p) => p.family || p.photo)
  const hasStory = story.length > 0 || photos.length > 0

  let chapter = 0
  const familiesNo = hasFamilies ? ++chapter : 0
  const storyNo = hasStory ? ++chapter : 0
  const weddingNo = ++chapter

  const nameFont = fit([groom, bride], 86, 0.84, 20, 132)
  const foil: CSSProperties = {
    background: FOIL,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitMaskImage: WORN,
    maskImage: WORN,
    WebkitMaskSize: '220px 220px',
    maskSize: '220px 220px',
  }

  return (
    <div
      className="kg relative overflow-x-hidden"
      style={{ background: K.coal, color: K.bone, fontFamily: sans, containerType: 'inline-size', ...noise(0.075, 170, 0.85) }}
    >
      <style>{`
        .kg .kg-name { opacity: 0; transform: translateY(22px) scale(1.035); animation: kg-set 1.5s cubic-bezier(.16,.8,.22,1) forwards; }
        .kg .kg-in { opacity: 0; animation: kg-in 1s ease forwards; }
        .kg .kg-ember { stroke-dasharray: 1; stroke-dashoffset: 1; animation: kg-draw 2.2s cubic-bezier(.4,0,.2,1) forwards 300ms; }
        .kg .kg-range { opacity: 0; transform: translateY(14px); animation: kg-set 1.6s cubic-bezier(.2,.7,.2,1) forwards; }
        .kg .kg-sun { opacity: 0; transform: translateY(26%); animation: kg-set 2.6s cubic-bezier(.2,.7,.2,1) forwards 250ms; }
        @keyframes kg-set { to { opacity: 1; transform: none; } }
        @keyframes kg-in { to { opacity: 1; } }
        @keyframes kg-draw { to { stroke-dashoffset: 0; } }
        .kg .kg-btn, .kg .kg-solid { transition: background-color .2s ease; }
        .kg .kg-btn:hover { background-color: rgba(201,165,92,0.12); }
        .kg .kg-solid { background-color: ${K.gold}; }
        .kg .kg-solid:hover { background-color: #D8B66E; }
        @media (prefers-reduced-motion: reduce) {
          .kg .kg-name, .kg .kg-in, .kg .kg-range, .kg .kg-sun { animation: none; opacity: 1; transform: none; }
          .kg .kg-ember { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={K.bone} background="rgba(13,12,10,0.72)" border={K.rule} />

      {/* ── The poster ───────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: isPreview ? 560 : '100svh' }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 38%, transparent 45%, rgba(0,0,0,0.6) 100%)' }}
        />

        <div className="kg-in relative px-6 pt-12 text-center" style={{ animationDelay: '200ms' }}>
          <p className="text-balance uppercase" style={{ fontSize: 12, letterSpacing: '0.34em', color: K.soft }}>
            With the blessings of their families
          </p>
          <span aria-hidden className="mx-auto mt-4 block h-[3px] w-14 border-y" style={{ borderColor: K.goldDim }} />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <h1 className="uppercase" style={{ fontFamily: display, fontWeight: 800, lineHeight: 0.92, letterSpacing: '0.02em', overflowWrap: 'break-word' }}>
            <span className="kg-name block" style={{ animationDelay: '500ms' }}>
              <span className="block" style={{ ...foil, fontSize: nameFont }}>{groom}</span>
            </span>
            <span className="kg-in my-4 flex items-center justify-center gap-4" style={{ animationDelay: '1200ms' }}>
              <span aria-hidden className="h-px w-12" style={{ background: K.goldDim }} />
              <span style={{ fontFamily: sans, fontWeight: 400, fontSize: 15, letterSpacing: '0.42em', color: K.ember, paddingLeft: '0.42em' }}>weds</span>
              <span aria-hidden className="h-px w-12" style={{ background: K.goldDim }} />
            </span>
            <span className="kg-name block" style={{ animationDelay: '800ms' }}>
              <span className="block" style={{ ...foil, fontSize: nameFont }}>{bride}</span>
            </span>
          </h1>
        </div>

        {/* Mountains, with the ember line drawn along the ridge. */}
        <div aria-hidden className="relative -mb-px h-[clamp(112px,36cqi,190px)] w-full">
          <span
            className="kg-sun absolute rounded-full"
            style={{
              width: 'min(46cqi, 230px)',
              aspectRatio: '1',
              left: 'calc(37.5% - min(23cqi, 115px))',
              top: 'calc(52% - min(23cqi, 115px))',
              background: 'rgba(201,165,92,0.13)',
            }}
          />
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="kg-range absolute inset-0 h-full w-full" style={{ animationDelay: '150ms' }}>
            <path d={FAR.fill} fill="#1C1914" />
            <path d={NEAR.fill} fill={K.deep} />
            <path d={NEAR.line} fill="none" stroke={K.ember} strokeWidth={1.1} vectorEffect="non-scaling-stroke" pathLength={1} className="kg-ember" strokeOpacity={0.85} />
          </svg>
        </div>

        <div className="kg-in relative px-6 pb-10 pt-4 text-center" style={{ background: K.deep, animationDelay: '1500ms' }}>
          <p className="uppercase" style={{ fontFamily: display, fontSize: 'clamp(22px, 7cqi, 30px)', fontWeight: 600, letterSpacing: '0.08em' }}>
            {date ? `${date.day} ${date.month} ${date.year}` : 'Date to be announced'}
          </p>
          <p className="mt-2 uppercase" style={{ fontSize: 15, letterSpacing: '0.2em', color: K.soft }}>
            {[date?.weekday, time].filter(Boolean).join('  ·  ')}
          </p>
          <p className="mt-1 text-balance uppercase leading-[1.4]" style={{ fontSize: 15, letterSpacing: '0.2em', color: K.gold }}>
            {venue}
          </p>
        </div>
      </section>

      {/* ── Prologue: the family's own words ───────────────────── */}
      {data.message && (
        <section style={{ background: K.deep }}>
          <Reveal disabled={isPreview} className="mx-auto max-w-[30rem] px-7 pb-16 pt-10 text-center">
            <Label style={{ color: K.goldDim }}>Prologue</Label>
            <p className="mt-5 leading-[1.5]" style={{ fontFamily: display, fontSize: 'clamp(18px, 5.4cqi, 23px)' }}>
              {data.message}
            </p>
          </Reveal>
        </section>
      )}

      <div className="mx-auto max-w-[32rem] px-5">
        {/* ── Chapter: the families ────────────────────────────── */}
        {hasFamilies && (
          <Reveal disabled={isPreview} as="section" className="pt-16">
            <Chapter n={familiesNo} title="The Families" />
            <div className="mt-8 space-y-9">
              {people.map((p) => (
                <article key={p.role} className="flex gap-5">
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photo}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[3/4] w-[38%] shrink-0 object-cover"
                      style={{ filter: 'sepia(0.3) saturate(0.85) contrast(1.08) brightness(0.92)', border: `1px solid ${K.rule}` }}
                    />
                  ) : (
                    <span aria-hidden className="w-px shrink-0" style={{ background: K.goldDim }} />
                  )}
                  <div className="min-w-0 self-center">
                    <Label style={{ color: K.goldDim }}>{p.role}</Label>
                    <p
                      className="mt-2 uppercase leading-[1.05]"
                      style={{ fontFamily: display, fontWeight: 700, fontSize: fit([p.name], p.photo ? 46 : 80, 0.8, 13, 34), color: K.gold, overflowWrap: 'anywhere' }}
                    >
                      {p.name}
                    </p>
                    {p.family && (
                      <p className="mt-2.5 leading-[1.45]" style={{ fontSize: 17, fontWeight: 300, color: K.soft }}>
                        {p.family}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        )}

        {/* ── Chapter: the story ───────────────────────────────── */}
        {hasStory && (
          <section className="pt-16">
            <Reveal disabled={isPreview}>
              <Chapter n={storyNo} title="The Story" />
            </Reveal>
            {story.length > 0 && (
              <div className="mt-8 space-y-5">
                {story.map((line, i) => (
                  <Reveal key={i} disabled={isPreview} delay={i * 60}>
                    <p className="leading-[1.5]" style={{ fontFamily: display, fontSize: 'clamp(18px, 5.2cqi, 21px)' }}>
                      {line}
                    </p>
                  </Reveal>
                ))}
              </div>
            )}
            {photos.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-2">
                {photos.map((src, i) => (
                  <Reveal
                    key={`${src}-${i}`}
                    disabled={isPreview}
                    delay={(i % 2) * 80}
                    className={i === 0 || (i === photos.length - 1 && i % 2 === 1) ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ filter: 'sepia(0.18) contrast(1.05)', border: `1px solid ${K.rule}` }}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Chapter: the wedding ─────────────────────────────── */}
        <Reveal disabled={isPreview} as="section" className="pb-6 pt-16">
          <Chapter n={weddingNo} title="The Wedding" />

          <div className="mt-9">
            {date ? (
              <div className="flex items-end gap-5">
                <span className="leading-[0.8] tabular-nums" style={{ fontFamily: display, fontWeight: 700, fontSize: 'clamp(92px, 30cqi, 128px)', color: K.gold }}>
                  {date.day}
                </span>
                <div className="pb-1">
                  <Label style={{ color: K.goldDim }}>{date.weekday}</Label>
                  <p className="mt-1.5 uppercase leading-none" style={{ fontFamily: display, fontSize: 'clamp(22px, 6.8cqi, 30px)', fontWeight: 600 }}>
                    {date.month}
                  </p>
                  <p className="mt-1.5 uppercase" style={{ fontSize: 18, letterSpacing: '0.16em', color: K.soft }}>
                    {date.year}
                    {time && <> · {time}</>}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="uppercase" style={{ fontFamily: display, fontSize: 26, fontWeight: 600 }}>Date to be announced</p>
                {time && <p className="mt-2 uppercase" style={{ fontSize: 18, letterSpacing: '0.16em', color: K.soft }}>{time}</p>}
              </div>
            )}

            {countdown && (
              <p className="mt-7 flex items-baseline gap-3 border-y py-3.5 uppercase" style={{ borderColor: K.rule, fontSize: 15, letterSpacing: '0.16em', color: K.soft }}>
                <span style={{ fontFamily: display, fontSize: 24, fontWeight: 700, color: K.bone, letterSpacing: 0 }}>{countdown.days}</span>
                <span>{countdown.days === 1 ? 'day' : 'days'} to go</span>
                <span className="ml-auto tabular-nums" style={{ color: K.faint }}>
                  {pad2(countdown.hours)}:{pad2(countdown.minutes)}:{pad2(countdown.seconds)}
                </span>
              </p>
            )}
          </div>

          <div className="mt-10">
            <Label style={{ color: K.goldDim }}>The venue</Label>
            <p className="mt-2 uppercase leading-[1.15]" style={{ fontFamily: display, fontSize: 'clamp(24px, 7.2cqi, 30px)', fontWeight: 600 }}>
              {venue}
            </p>
            {data.venueAddress && (
              <p className="mt-2 leading-[1.5]" style={{ fontSize: 17, fontWeight: 300, color: K.soft }}>
                {data.venueAddress}
              </p>
            )}
            <div className={`mt-6 grid gap-2.5 ${directions && calendar ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <DirectionsLink
                href={directions}
                isPreview={isPreview}
                className="kg-solid flex min-h-[50px] items-center justify-center uppercase"
                style={{ color: K.coal, fontSize: 'clamp(12.5px, 3.9cqi, 14px)', letterSpacing: '0.16em', fontWeight: 500 }}
              >
                Directions
              </DirectionsLink>
              <DirectionsLink
                href={calendar}
                isPreview={isPreview}
                className="kg-btn flex min-h-[50px] items-center justify-center border uppercase"
                style={{ borderColor: K.goldDim, color: K.gold, fontSize: 'clamp(12.5px, 3.9cqi, 14px)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}
              >
                Add to calendar
              </DirectionsLink>
            </div>
          </div>

          {data.dressCode && (
            <div className="mt-10">
              <Label style={{ color: K.goldDim }}>Attire</Label>
              <p className="mt-2 uppercase" style={{ fontSize: 19, letterSpacing: '0.1em' }}>{data.dressCode}</p>
            </div>
          )}

          {schedule.length > 0 && (
            <div className="mt-12">
              <Label style={{ color: K.goldDim }}>The order of events</Label>
              <ol className="mt-4 border-t" style={{ borderColor: K.rule }}>
                {schedule.map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className="grid grid-cols-[6.4rem_1fr] items-baseline gap-4 border-b py-4"
                    style={{ borderColor: K.rule }}
                  >
                    <span className="uppercase tabular-nums" style={{ fontFamily: display, fontSize: 18, fontWeight: 600, color: K.gold }}>
                      {item.time || '—'}
                    </span>
                    <span className="uppercase leading-[1.3]" style={{ fontSize: 17, letterSpacing: '0.1em' }}>
                      {item.title}
                      {item.note && (
                        <span className="mt-1 block normal-case" style={{ fontSize: 15, fontWeight: 300, letterSpacing: '0.02em', color: K.soft }}>
                          {item.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Reveal>
      </div>

      {eventId && (
        <div className="mt-10 border-t" style={{ borderColor: K.rule }}>
          <WishesSection
            eventId={eventId}
            theme={WISHES_THEME}
            title="Blessings"
            intro={`Leave a few words for ${groom}, ${bride} and their families. Every guest will see it here.`}
            noun="blessing"
          />
        </div>
      )}

      {/* ── The last frame ───────────────────────────────────────── */}
      <footer className="px-6 pb-10 pt-14 text-center" style={{ background: K.deep }}>
        <span aria-hidden className="mx-auto block h-[3px] w-14 border-y" style={{ borderColor: K.goldDim }} />
        <p className="mt-6 uppercase leading-[1.2]" style={{ fontFamily: display, fontSize: 22, fontWeight: 700, color: K.gold, letterSpacing: '0.06em' }}>
          {groom} <span style={{ fontFamily: sans, fontWeight: 400, fontSize: 13, letterSpacing: '0.36em', color: K.ember }}>weds</span> {bride}
        </p>
        {date && (
          <p className="mt-3" style={{ fontFamily: display, fontSize: 14, letterSpacing: '0.3em', color: K.faint }}>
            {roman(date.day)} · {roman(Number(data.date.slice(5, 7)))} · {roman(date.year)}
          </p>
        )}
        <div className="mt-10">
          <Credit isPreview={isPreview} color={K.faint} linkColor={K.soft} />
        </div>
      </footer>
    </div>
  )
}
