'use client'

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from 'react'
import { inOrder } from '@/lib/nameOrder'
import WishesSection from './WishesSection'
import { bodoniDisplay } from './kit/fonts/bodoniDisplay'
import { jost } from './kit/fonts/jost'
import { oswald } from './kit/fonts/oswald'
import { pinyon } from './kit/fonts/pinyon'
import {
  calendarHref,
  dateParts,
  fitCqi,
  galleryImages,
  mapsHref,
  pad2,
  parseLines,
  parseRows,
  telHref,
  timeLabel,
  useCountdown,
  whatsappHref,
  type InviteProps,
  musicSrc,
} from './kit/core'
import { Credit, MusicToggle } from './kit/ui'
import { timeWords } from './kit/words'
import type { InviteTheme } from './kit/theme'
import { Act, Icon, Lightbox, useLightbox } from './rajwada/parts'
import { paletteOf, paletteVars } from './royaledit/palette'
import { Barcode, Dust, EventIcon, Flap, Odo, Seal, Words, dressColours, numberWord, seq } from './royaledit/parts'

/*
 * The Royal Edit: the wedding as a luxury magazine, with the couple on the
 * cover. It arrives on velvet in a clear sleeve with a gold "your copy"
 * sticker. A tap slides the sleeve off and the cover fills the screen under a
 * burst of camera flashes; the cover lives (the photograph drifts, the foil
 * masthead catches the light, the seal turns). A tap or a swipe turns the
 * page in 3D, into the issue: contents, the invitation as a feature, the
 * cover story, the celebrations as stacking cards (each with the colours its
 * dress code names), a portfolio to swipe, the guide, a split-flap countdown,
 * a reply postcard that gets stamped, the wishes and the back cover.
 *
 * Content reveals are CSS driven by one IntersectionObserver that sets
 * data-in; every hidden state sits behind .re[data-anim], which is only set
 * after hydration, so the server HTML is always readable.
 */

const FONTS = {
  '--re-fd': `${bodoniDisplay.style.fontFamily}, 'Bodoni 72', Didot, Georgia, serif`,
  '--re-ft': `${jost.style.fontFamily}, system-ui, sans-serif`,
  '--re-fc': `${oswald.style.fontFamily}, 'Arial Narrow', sans-serif`,
  '--re-fs': `${pinyon.style.fontFamily}, cursive`,
} as CSSProperties

const DEFAULTS = {
  blessingLine: 'With the blessings of our families',
  tagline: 'Two hearts. One beautiful beginning.',
  requestLine: 'Request the pleasure of your company\nas we begin our forever together.',
  celebrationLine: 'A celebration of love, family,\ntradition, and a lifetime of memories.',
}

const HEADER = 48

interface Fn {
  name: string
  date: string
  time: string
  venue: string
  dress: string
  map: string
}

interface Part {
  id: string
  label: string
  deck: string
  page: number
}

type Phase = 'sleeve' | 'cover' | 'turning' | 'open'

const first = (s: string) => Array.from(s.trim())[0]?.toUpperCase() ?? ''
const img = (u?: string) => (u && /^(https?:)?\//.test(u) ? u : '')

/** Scroll the window to a section at once, past the page's own smooth scrolling. */
function jumpTo(id: string, smooth = false) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: (smooth ? 'smooth' : 'instant') as ScrollBehavior })
}

/** Kicker, headline rising word by word, and an optional standfirst. */
function Head({ kicker, title, sub, dark, center = true }: { kicker: string; title: string; sub?: string; dark?: boolean; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''} data-rv="">
      <p className="re-kicker" style={{ color: dark ? 'var(--re-gold)' : 'var(--re-wine)' }}>
        {kicker}
      </p>
      <Words as="h2" text={title} className="re-h2 mt-3" style={{ color: dark ? 'var(--re-paper)' : 'var(--re-ink)' }} />
      {sub && (
        <p className="re-sub mt-4" style={{ color: dark ? 'var(--re-blush)' : 'var(--re-soft)' }}>
          {sub}
        </p>
      )}
      <span className={`re-rule mt-6 ${center ? 'mx-auto' : ''}`} />
    </div>
  )
}

/** A line of news running across the page. */
function Ticker({ items, reverse, tone }: { items: string[]; reverse?: boolean; tone: 'wine' | 'gold' }) {
  const line = `${items.join('  ✦  ')}  ✦  `
  return (
    <div className={`re-ticker re-ticker-${tone}`} aria-hidden>
      <div className={`re-ticker-track ${reverse ? 're-rev' : ''}`}>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}

/** With no cover photograph: their initials, in foil, inside a lit jali. */
function Monogram({ initials }: { initials: [string, string] }) {
  return (
    <div className="re-mono" aria-hidden>
      <div className="re-mono-glow" />
      <svg viewBox="0 0 200 200" className="re-mono-ring">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="88" />
      </svg>
      <p className="re-mono-text">
        {initials[0]}
        <span>&amp;</span>
        {initials[1]}
      </p>
    </div>
  )
}

export default function SignatureRoyalEdit({ data, eventId, isPreview = false }: InviteProps) {
  const palette = paletteOf(data.palette)
  const bride = data.brideName?.trim() || 'Ananya'
  const groom = data.groomName?.trim() || 'Arjun'
  // The couple in the invitation's order: the host's choice, else this design's own (lib/nameOrder.ts).
  const [nameA, nameB] = inOrder(data, 'signature-royal-edit', bride, groom)
  const couple = `${nameA} & ${nameB}`
  const date = dateParts(data.date)
  const time = timeLabel(data.time)
  const timeSpoken = timeWords(data.time)
  const venue = data.venue?.trim() || ''
  const address = data.venueAddress?.trim() || ''
  const place = [venue, address].filter(Boolean).join(', ')
  const directions = mapsHref(data.mapsUrl, venue, address)
  const weddingCal = calendarHref(`Wedding of ${couple}`, data.date, data.time, place || undefined, 5)
  const hosts = data.hosts?.trim() || ''
  const blessingLine = data.blessingLine?.trim() || DEFAULTS.blessingLine
  const tagline = data.tagline?.trim() || DEFAULTS.tagline
  const requestLines = parseLines(data.requestLine || DEFAULTS.requestLine)
  const celebrationLines = parseLines(data.celebrationLine || DEFAULTS.celebrationLine)
  const blessings = useMemo(() => parseLines(data.blessings), [data.blessings])
  const storyParas = useMemo(() => parseLines(data.ourStory), [data.ourStory])
  const quote = data.storyQuote?.trim() || ''
  const travel = useMemo(() => parseLines(data.travel), [data.travel])
  const faq = useMemo(() => parseRows(data.faq, ['q', 'a'] as const), [data.faq])
  const contacts = useMemo(() => parseRows(data.contacts, ['name', 'phone'] as const), [data.contacts])
  const photos = useMemo(() => galleryImages(data.galleryImages, 12), [data.galleryImages])
  const coverPhoto = img(data.couplePhoto)
  const storyPhoto = img(data.storyPhoto) || coverPhoto
  const closing = parseLines(data.message)
  const hashtag = data.hashtag?.trim()
  const live = data.livestreamUrl && /^https?:\/\//i.test(data.livestreamUrl) ? data.livestreamUrl : null
  const rsvpBy = dateParts(data.rsvpBy)
  const canReply = Boolean(whatsappHref(data.whatsappNumber))
  const look = dressColours(data.dressCode)

  const issue = date ? `No. ${date.day}` : 'No. 1'
  const monthYear = date ? `${date.month} ${date.year}` : ''
  const issueLine = ['The Wedding Issue', monthYear].filter(Boolean).join(' · ')
  const dotted = date && data.date ? `${date.dayPadded}.${data.date.slice(5, 7)}.${date.year}` : ''
  const city = address.split(',')[0]?.trim() || venue

  const functions = useMemo(() => {
    const list = parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress', 'map'] as const) as Fn[]
    const dated = list.length > 0 && list.every((f) => dateParts(f.date))
    if (dated) list.sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
    return list
  }, [data.events])

  const hasStory = Boolean(storyParas.length || quote || storyPhoto)
  const hasGuests = travel.length > 0 || contacts.length > 0 || faq.length > 0 || Boolean(live)

  // The issue's running order, with page numbers that add up like a real one.
  const parts = useMemo(() => {
    const list: [string, string, string, number][] = [
      ['re-invite', 'The Invitation', hosts ? `A letter from ${hosts}` : 'A letter from our families', 3],
      ...(hasStory ? ([['re-story', 'Cover Story', quote || 'How it all began', 4]] as [string, string, string, number][]) : []),
      ...(functions.length ? ([['re-events', 'The Celebrations', functions.map((f) => f.name).join(', '), 2 * functions.length]] as [string, string, string, number][]) : []),
      ...(photos.length ? ([['re-gallery', 'The Portfolio', `${numberWord(photos.length)} photographs`, Math.ceil(photos.length / 2) + 1]] as [string, string, string, number][]) : []),
      ['re-details', 'The Guide', 'When, where and what to wear', 3],
      ...(date ? ([['re-countdown', 'The Countdown', date.long, 1]] as [string, string, string, number][]) : []),
      ['re-rsvp', 'Reply Card', rsvpBy ? `Kindly reply by ${rsvpBy.weekday}, ${rsvpBy.day} ${rsvpBy.month}` : 'Kindly let us know', 2],
      ...(eventId ? ([['re-wishes', 'Letters', 'Wishes from our guests', 2]] as [string, string, string, number][]) : []),
    ]
    let page = 3
    const out: Part[] = [{ id: 're-contents', label: 'Contents', deck: '', page: 2 }]
    for (const [id, label, deck, pages] of list) {
      out.push({ id, label, deck, page })
      page += pages
    }
    out.push({ id: 're-finale', label: 'Back Cover', deck: '', page })
    return out
  }, [hosts, hasStory, quote, functions, photos.length, date, rsvpBy, eventId])

  // The guest a personal link was made for: ?to=Mehra+family
  const [guest, setGuest] = useState('')
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to')?.replace(/\s+/g, ' ').trim()
    if (to) setGuest(to.slice(0, 40))
  }, [])

  /*
   * sleeve: the magazine on velvet, still in its sleeve (plays on its own).
   * cover: unwrapped, the cover fills the screen and comes alive.
   * turning: the cover swings open in 3D; then the page lands on the contents.
   * open: reading. The cover stays at the top, closed, for anyone who scrolls back.
   */
  const rootRef = useRef<HTMLDivElement | null>(null)
  const still = useRef(false)
  const [phase, setPhase] = useState<Phase>(isPreview ? 'open' : 'sleeve')
  const [rest, setRest] = useState(isPreview)
  const [anim, setAnim] = useState(false)
  const [veil, setVeil] = useState<'none' | 'in' | 'out'>('none')
  const timers = useRef<number[]>([])
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  useEffect(() => {
    if (isPreview) return
    still.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still.current) setPhase('cover')
    else setAnim(true)
  }, [isPreview])

  const unwrap = useCallback(() => {
    if (phase !== 'sleeve') return
    rootRef.current?.querySelector('audio')?.play().catch(() => {})
    startTransition(() => setRest(true))
    setPhase('cover')
  }, [phase])

  const turn = useCallback(() => {
    if (phase === 'sleeve') return unwrap()
    if (phase === 'turning') return
    setRest(true)
    if (phase === 'open' || still.current) {
      setPhase('open')
      window.setTimeout(() => jumpTo('re-contents', !still.current), 30)
      return
    }
    setPhase('turning')
    later(1050, () => setVeil('in'))
    later(1300, () => {
      jumpTo('re-contents')
      setPhase('open')
      setVeil('out')
    })
    later(2000, () => setVeil('none'))
  }, [phase, unwrap, later])

  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const t = touch.current
    touch.current = null
    if (!t || isPreview) return
    const dx = e.changedTouches[0].clientX - t.x
    const dy = e.changedTouches[0].clientY - t.y
    if (dx < -50 && Math.abs(dy) < 70) turn()
  }

  // Reveal on scroll: one observer for every [data-rv], including ones mounted later.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !anim || !rest) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const watch = () => root.querySelectorAll('[data-rv]:not([data-in])').forEach((el) => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [anim, rest])

  // The running head: which part of the issue is on screen, and how far through it the guest is.
  const [active, setActive] = useState('re-contents')
  const barRef = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root || !rest) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    parts.forEach((p) => {
      const el = root.querySelector(`#${p.id}`)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [rest, parts])
  useEffect(() => {
    if (isPreview || !rest) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [isPreview, rest])
  const current = parts.find((p) => p.id === active) ?? parts[0]

  const go = (id: string) => {
    if (isPreview) return
    const el = rootRef.current?.querySelector(`#${id}`) as HTMLElement | null
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
  }

  const lb = useLightbox(photos.length)
  const stageH = isPreview ? 'min(max(600px, 178cqi), 980px)' : '100svh'

  const wishesTheme: InviteTheme = {
    bg: palette.paper,
    surface: '#FFFFFF',
    ink: palette.ink,
    muted: palette.soft,
    line: `${palette.gold}66`,
    accent: palette.wine,
    onAccent: palette.paper,
    heading: `${bodoniDisplay.style.fontFamily}, Didot, Georgia, serif`,
    body: `${jost.style.fontFamily}, system-ui, sans-serif`,
    headingStyle: { fontSize: 'clamp(32px, 9cqi, 48px)', fontWeight: 400, color: palette.ink },
  }

  const nameSize = fitCqi(`${bride} ${groom}`, { room: 86, em: 0.5, max: 19 })
  const tickerTop = [couple, date ? `${date.day} ${date.month} ${date.year}` : '', venue, ...functions.map((f) => f.name), hashtag || ''].filter(Boolean)
  const tickerReply = [
    rsvpBy ? `Kindly reply by ${rsvpBy.day} ${rsvpBy.month}` : 'Kindly reply',
    'Your presence is our favourite gift',
    couple,
    date ? `${date.day} ${date.month}` : '',
  ].filter(Boolean)

  return (
    <div
      ref={rootRef}
      className="re relative"
      data-ph={phase}
      data-anim={anim ? '' : undefined}
      data-preview={isPreview ? '' : undefined}
      style={{ ...paletteVars(palette), ...FONTS, background: 'var(--re-paper)', color: 'var(--re-ink)', fontFamily: 'var(--re-ft)', containerType: 'inline-size', overflowX: 'clip' }}
    >
      {/* Raw CSS, not a text child: React escapes > and " in text on the server (see SignatureRajwada). No user data is interpolated. */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={palette.goldHi} background={`${palette.night}D9`} border={`${palette.gold}66`} />

      {/* ── The cover ─────────────────────────────────────────────────── */}
      <section
        id="re-top"
        className="re-stage"
        style={{ height: stageH, minHeight: isPreview ? undefined : 560 }}
        onClick={() => !isPreview && (phase === 'sleeve' ? unwrap() : turn())}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <h1 className="sr-only">
          {couple}
          {date ? `, ${date.long}` : ''}
        </h1>
        <div className="re-velvet" aria-hidden />
        <Dust count={22} seed="velvet" className="re-dust-back" />
        <div className="re-mag">
          <div className="re-mag-in">
            <div className="re-under" aria-hidden>
              <p className="re-kicker" style={{ color: 'var(--re-wine)' }}>
                {issueLine}
              </p>
              <Words as="p" text="Inside this issue" className="re-h2 mt-3" />
            </div>
            <div className="re-page">
              <div className="re-face">
                {coverPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="re-cover-img" src={coverPhoto} alt="" decoding="async" />
                ) : (
                  <Monogram initials={[first(nameA), first(nameB)]} />
                )}
                <div className="re-cover-shade" aria-hidden />
                <Dust count={10} seed="cover" className="re-dust-front" />

                <header className="re-cover-top">
                  <div className="re-strap">
                    <span>The Wedding Issue</span>
                    <span>{[issue, date ? `${date.monthShort} ${date.year}` : ''].filter(Boolean).join(' · ')}</span>
                  </div>
                  <p className="re-mast" aria-label="The Royal Edit">
                    <span className="re-mast-the">The</span>
                    <span className="re-mast-word">
                      RO<span className="re-kern">Y</span>AL EDIT
                      <span className="re-mast-shine" aria-hidden>
                        RO<span className="re-kern">Y</span>AL EDIT
                      </span>
                    </span>
                  </p>
                  <p className="re-price">
                    <span>Priceless</span> · Collector&rsquo;s edition
                  </p>
                </header>

                {date && (
                  <div className="re-cover-seal">
                    <Seal uid={isPreview ? 'p' : 'g'} ring="SAVE THE DATE ✦ SAVE THE DATE ✦ " top={String(date.day)} bottom={date.monthShort.toUpperCase()} />
                  </div>
                )}

                <div className="re-cover-lines">
                  <p className="re-tag">{guest ? `Reserved for ${guest}` : 'Exclusive'}</p>
                  <p className="re-cover-names" style={{ fontSize: `clamp(34px, ${nameSize}cqi, 120px)` }}>
                    <span>{nameA}</span>
                    <span>
                      <em>&amp;</em> {nameB}
                    </span>
                  </p>
                  <p className="re-cover-deck">{tagline}</p>
                  {functions.length > 0 && (
                    <p className="re-cover-inside">
                      <b>Inside</b> {functions.map((f) => f.name).join(' · ')}
                    </p>
                  )}
                </div>

                <div className="re-cover-strip">
                  <div>
                    {dotted && <p className="re-cover-date">{dotted}</p>}
                    {city && <p className="re-cover-city">{city}</p>}
                  </div>
                  <Barcode seed={couple + data.date} digits={`8 ${dotted.replace(/\./g, '')} ${(first(nameA) + first(nameB)).charCodeAt(0) % 10}`} />
                </div>

                <button
                  type="button"
                  className="re-turn"
                  tabIndex={isPreview ? -1 : undefined}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isPreview) turn()
                  }}
                >
                  <span>Turn the page</span>
                  <svg viewBox="0 0 28 10" aria-hidden>
                    <path d="M1 5h25M21 1l5 4-5 4" />
                  </svg>
                </button>
                <span className="re-curl" aria-hidden />
                <div className="re-flashes" aria-hidden>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            {!isPreview && (
              <div className="re-sleeve" aria-hidden={phase !== 'sleeve'}>
                <span className="re-sleeve-seam" />
                <span className="re-sleeve-gloss" />
                <button
                  type="button"
                  className="re-sticker"
                  onClick={(e) => {
                    e.stopPropagation()
                    unwrap()
                  }}
                  tabIndex={phase === 'sleeve' ? 0 : -1}
                >
                  <svg viewBox="0 0 100 100" aria-hidden>
                    <path d={STICKER} />
                  </svg>
                  <span className="re-sticker-k">{guest ? 'For' : 'Your copy'}</span>
                  <span className="re-sticker-n">{guest || couple}</span>
                  <span className="re-sticker-t">Tap to open</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {!isPreview && (
          <p className="re-hint" aria-hidden={phase !== 'sleeve'}>
            {guest ? `A copy for ${guest} has arrived` : 'Your copy has arrived'} · <b>tap to open</b>
          </p>
        )}
      </section>

      {veil !== 'none' && <div aria-hidden className={`re-veil re-veil-${veil}`} />}

      {rest && (
        <>
          <header className="re-run" style={{ background: `${palette.paper}F0`, paddingRight: musicSrc(data.musicUrl) ? 104 : 16 }}>
            <button type="button" className="re-run-mast" onClick={() => go('re-contents')}>
              The Royal Edit
            </button>
            <span className="re-run-page">
              <span key={current.id} className="re-run-label">
                {current.label}
              </span>
              <span className="re-run-no">P. {pad2(current.page)}</span>
            </span>
            <span ref={barRef} className="re-run-bar" aria-hidden />
          </header>

          {/* ── Contents ────────────────────────────────────────────────── */}
          <section id="re-contents" className="re-sec re-paper re-contents">
            <div data-rv="">
              <p className="re-kicker" style={{ color: 'var(--re-wine)' }}>
                {issueLine}
              </p>
              <Words as="h2" text="Inside this issue" className="re-h2 mt-3" />
            </div>
            <ol className="re-toc mt-10">
              {parts.slice(1, -1).map((p, i) => (
                <li key={p.id} data-rv="" style={{ '--k': i } as CSSProperties}>
                  <button type="button" onClick={() => go(p.id)} className="re-toc-row" tabIndex={isPreview ? -1 : undefined}>
                    <Odo value={pad2(p.page)} className="re-toc-no" />
                    <span className="re-toc-text">
                      <span className="re-toc-title">{p.label}</span>
                      {p.deck && <span className="re-toc-deck">{p.deck}</span>}
                    </span>
                    <svg viewBox="0 0 28 10" className="re-toc-arrow" aria-hidden>
                      <path d="M1 5h25M21 1l5 4-5 4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ol>
            <div className="re-oncover mt-12" data-rv="">
              {coverPhoto && (
                <span className="re-oncover-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPhoto} alt="" loading="lazy" decoding="async" />
                </span>
              )}
              <p>
                <b>On the cover</b>
                {nameA} and {nameB}, {date ? `who marry on ${date.weekday}, ${date.day} ${date.month}` : 'soon to be married'}
                {venue ? ` at ${venue}` : ''}.
              </p>
            </div>
          </section>

          {/* ── The invitation ──────────────────────────────────────────── */}
          <section id="re-invite" className="re-sec re-paper re-invite">
            <div className="re-inv-frame">
              <p className="re-kicker text-center" style={{ color: 'var(--re-wine)' }} data-rv="">
                {blessingLine}
              </p>
              <h2 className="re-inv-names" data-rv="">
                <Words text={nameA} className="block" />
                <span className="re-amp" aria-label="and">
                  &amp;
                </span>
                <Words text={nameB} className="block" start={2} />
              </h2>
              <div className="re-inv-req" data-rv="">
                {requestLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>

              {date && (
                <div className="re-inv-date" data-rv="">
                  <span className="re-inv-line" />
                  <div>
                    <p className="re-kicker" style={{ color: 'var(--re-wine)' }}>
                      {date.weekday}
                    </p>
                    <Odo value={date.dayPadded} className="re-inv-day" />
                    <p className="re-kicker" style={{ color: 'var(--re-ink)' }}>
                      {date.month} {date.year}
                    </p>
                    {timeSpoken && <p className="re-inv-time">at {timeSpoken}</p>}
                  </div>
                  <span className="re-inv-line" />
                </div>
              )}

              {(venue || address) && (
                <div className="re-inv-venue" data-rv="">
                  {venue && <p className="re-inv-venue-name">{venue}</p>}
                  {address && <p className="re-kicker mt-2" style={{ color: 'var(--re-soft)', letterSpacing: '0.2em' }}>{address}</p>}
                </div>
              )}

              <div className="re-actions" data-rv="">
                <Act href={weddingCal} isPreview={isPreview} className="re-btn">
                  {Icon.calendar} Save the date
                </Act>
                <Act href={directions} isPreview={isPreview} className="re-btn re-btn-ghost">
                  {Icon.pin} Directions
                </Act>
              </div>

              <blockquote className="re-inv-quote" data-rv="">
                {celebrationLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </blockquote>

              {hosts && (
                <div className="re-inv-sign" data-rv="">
                  <p className="re-kicker" style={{ color: 'var(--re-wine)' }}>
                    With love
                  </p>
                  <p className="re-script">{hosts}</p>
                </div>
              )}

              {(data.brideParents?.trim() || data.groomParents?.trim()) && (
                <div className="re-inv-parents" data-rv="">
                  {inOrder(data, 'signature-royal-edit', { name: bride, parents: data.brideParents?.trim() }, { name: groom, parents: data.groomParents?.trim() }).map((p) =>
                    p.parents ? (
                      <p key={p.name}>
                        <b>{p.name}</b>
                        {p.parents}
                      </p>
                    ) : null,
                  )}
                </div>
              )}

              {blessings.length > 0 && (
                <div className="re-inv-bless" data-rv="">
                  <p className="re-kicker" style={{ color: 'var(--re-wine)', fontSize: 10 }}>
                    With the blessings of
                  </p>
                  {blessings.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Ticker items={tickerTop} tone="wine" />

          {/* ── Cover story ─────────────────────────────────────────────── */}
          {hasStory && (
            <section id="re-story" className="re-sec re-paper2 re-story">
              <div className="re-story-grid">
                {storyPhoto && (
                  <figure className="re-story-photo" data-rv="">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={storyPhoto} alt={couple} loading="lazy" decoding="async" />
                    <figcaption>
                      {nameA} &amp; {nameB}
                    </figcaption>
                  </figure>
                )}
                <div className="re-story-text">
                  <Head kicker="Cover story" title="The story so far" center={false} />
                  {quote && (
                    <p className="re-deck" data-rv="">
                      {quote}
                    </p>
                  )}
                  <p className="re-byline" data-rv="">
                    By {nameA} &amp; {nameB}
                  </p>
                  {storyParas.length > 0 && (
                    <div className="re-body" data-rv="">
                      {storyParas.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── The celebrations ────────────────────────────────────────── */}
          {functions.length > 0 && (
            <section id="re-events" className="re-sec re-dark re-events">
              <Head
                kicker="The itinerary"
                title="The Celebrations"
                sub={functions.length > 1 ? `${numberWord(functions.length)} celebrations, one love story` : undefined}
                dark
              />
              <ol className="re-stack">
                {functions.map((fn, i) => (
                  <Card key={`${fn.name}-${i}`} fn={fn} i={i} total={functions.length} couple={couple} venue={venue} directions={directions} weddingDate={data.date} isPreview={isPreview} />
                ))}
              </ol>
            </section>
          )}

          {/* ── The portfolio ───────────────────────────────────────────── */}
          {photos.length > 0 && (
            <section id="re-gallery" className="re-sec re-paper re-gallery">
              <Head kicker="The portfolio" title="Moments we treasure" />
              <Portfolio photos={photos} onOpen={(i) => !isPreview && lb.setOpen(i)} />
              {lb.open !== null && <Lightbox photos={photos} index={lb.open} onClose={lb.close} onStep={lb.step} background={`${palette.night}F7`} color={palette.paper} font={`${jost.style.fontFamily}, system-ui, sans-serif`} />}
            </section>
          )}

          {/* ── The guide ───────────────────────────────────────────────── */}
          <section id="re-details" className="re-sec re-paper2 re-guide">
            <Head kicker="Everything you need to know" title="The Guide" />
            <div className="re-facts">
              <Fact label="When" n="01">
                {date && (
                  <p className="re-fact-big">
                    {date.weekday},<br />
                    {date.day} {date.month} {date.year}
                  </p>
                )}
                {time && <p className="re-fact-sub">{time}</p>}
                <Act href={weddingCal} isPreview={isPreview} className="re-link">
                  {Icon.calendar} Add to calendar
                </Act>
              </Fact>
              <Fact label="Where" n="02">
                {venue && <p className="re-fact-big">{venue}</p>}
                {address && <p className="re-fact-sub">{address}</p>}
                <Act href={directions} isPreview={isPreview} className="re-link">
                  {Icon.pin} Get directions
                </Act>
              </Fact>
              {data.dressCode?.trim() && (
                <Fact label="Wear" n="03">
                  <p className="re-fact-big re-fact-italic">{data.dressCode}</p>
                  {look.length > 0 && <Swatches colours={look} />}
                </Fact>
              )}
            </div>

            {hasGuests && (
              <div className="re-desk">
                {travel.length > 0 && (
                  <div data-rv="">
                    <h3 className="re-h3">The travel desk</h3>
                    <ol className="re-travel">
                      {travel.map((t, i) => (
                        <li key={t}>
                          <span>{pad2(i + 1)}</span>
                          <p>{t}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {live && (
                  <div data-rv="">
                    <h3 className="re-h3">Watch from afar</h3>
                    <Act href={live} isPreview={isPreview} className="re-link mt-3">
                      {Icon.play} Join the livestream
                    </Act>
                  </div>
                )}
                {contacts.length > 0 && (
                  <div data-rv="">
                    <h3 className="re-h3">Who to call</h3>
                    <ul className="re-calls">
                      {contacts.map((c) => (
                        <li key={c.name + c.phone}>
                          <span>{c.name}</span>
                          <Act href={telHref(c.phone)} isPreview={isPreview} external={false} className="re-link">
                            {Icon.phone} {c.phone}
                          </Act>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {faq.length > 0 && (
                  <div data-rv="">
                    <h3 className="re-h3">Ask the couple</h3>
                    <div className="mt-2">
                      {faq.map((f, i) => (
                        <details key={f.q + i} className="re-faq">
                          <summary>
                            <span className="re-faq-q">Q.</span>
                            <span className="flex-1">{f.q}</span>
                            <span aria-hidden className="re-plus">
                              +
                            </span>
                          </summary>
                          <p>
                            <span className="re-faq-q">A.</span>
                            {f.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── The countdown ───────────────────────────────────────────── */}
          {date && (
            <section id="re-countdown" className="re-sec re-dark re-count">
              <Dust count={14} seed="count" />
              <Head kicker="The countdown" title="Until forever begins" dark />
              <Board date={data.date} time={data.time} />
              <p className="re-count-when" data-rv="">
                {date.long}
                {time ? `, ${time}` : ''}
              </p>
              <div className="mt-6 flex justify-center" data-rv="">
                <Act href={weddingCal} isPreview={isPreview} className="re-btn re-btn-gold">
                  {Icon.calendar} Add to calendar
                </Act>
              </div>
            </section>
          )}

          <Ticker items={tickerReply} tone="gold" reverse />

          {/* ── Reply card ──────────────────────────────────────────────── */}
          <section id="re-rsvp" className="re-sec re-paper re-rsvp">
            <Head kicker="Kindly reply" title="Your presence matters" />
            {canReply ? (
              <Reply number={data.whatsappNumber} couple={couple} date={date} rsvpBy={rsvpBy} initials={`${first(nameA)}${first(nameB)}`} isPreview={isPreview} />
            ) : (
              <p className="re-sub mx-auto mt-8 max-w-[26rem] text-center" style={{ color: 'var(--re-soft)' }}>
                We would love to know if you can join us. Please reply to the family directly.
              </p>
            )}
          </section>

          {eventId && (
            <div id="re-wishes">
              <WishesSection eventId={eventId} theme={wishesTheme} title="Letters to the couple" intro={`Leave a few words for ${nameA} and ${nameB}. Every guest can read them here.`} noun="wish" namePlaceholder="e.g. The Mehra family" />
            </div>
          )}

          {/* ── Back cover ──────────────────────────────────────────────── */}
          <section id="re-finale" className="re-sec re-dark re-finale">
            <Dust count={16} seed="finale" />
            <div className="relative" data-rv="">
              <p className="re-kicker" style={{ color: 'var(--re-gold)' }}>
                Thank you for reading
              </p>
              <p className="re-mast re-mast-small mt-5">
                <span className="re-mast-the">The</span>
                <span className="re-mast-word">
                  RO<span className="re-kern">Y</span>AL EDIT
                  <span className="re-mast-shine" aria-hidden>
                    RO<span className="re-kern">Y</span>AL EDIT
                  </span>
                </span>
              </p>
            </div>
            {closing.length > 0 && (
              <div className="re-finale-words" data-rv="">
                {closing.map((l, i) => (
                  <Words key={l} as="p" text={l} start={i * 6} />
                ))}
              </div>
            )}
            {hosts && (
              <div className="mt-9" data-rv="">
                <p className="re-kicker" style={{ color: 'var(--re-gold)' }}>
                  With love
                </p>
                <p className="re-script re-script-light">{hosts}</p>
              </div>
            )}
            {hashtag && (
              <p className="re-hashtag" data-rv="">
                {hashtag}
              </p>
            )}
            <div className="re-finale-foot" data-rv="">
              <Barcode seed={`${couple}back`} digits={[issue, monthYear].filter(Boolean).join(' · ').toUpperCase()} />
              {!isPreview && (
                <button type="button" className="re-btn re-btn-gold" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to the cover
                </button>
              )}
            </div>
            <div className="mt-14">
              <Credit isPreview={isPreview} color={`${palette.blush}B3`} linkColor={palette.goldHi} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

/** One fact in the guide: a numbered label and what goes under it. */
function Fact({ label, n, children }: { label: string; n: string; children: ReactNode }) {
  return (
    <div className="re-fact" data-rv="">
      <p className="re-fact-label">
        <span>{n}</span>
        {label}
      </p>
      <div className="re-fact-body">{children}</div>
    </div>
  )
}

/** The colours a dress code names, as fabric swatches. */
function Swatches({ colours }: { colours: string[] }) {
  return (
    <span className="re-swatches" aria-hidden>
      {colours.map((c, i) => (
        <i key={c} style={{ background: c, '--i': i } as CSSProperties} />
      ))}
    </span>
  )
}

/** A celebration, as a card that sticks and lets the next one slide over it. */
function Card({ fn, i, total, couple, venue, directions, weddingDate, isPreview }: { fn: Fn; i: number; total: number; couple: string; venue: string; directions: string | null; weddingDate?: string; isPreview: boolean }) {
  const d = dateParts(fn.date)
  const t = timeLabel(fn.time)
  const fnPlace = fn.venue?.trim() || venue
  const atWeddingVenue = !fn.venue?.trim() || fn.venue.trim().toLowerCase() === venue.toLowerCase()
  const fnDir = mapsHref(fn.map) ?? (atWeddingVenue ? directions : mapsHref(undefined, fn.venue))
  const fnCal = calendarHref(`${fn.name} · ${couple}`, fn.date || weddingDate, fn.time, fnPlace || undefined, 3)
  const colours = dressColours(fn.dress)
  const light = i % 2 === 1
  return (
    <li className={`re-card ${light ? 're-card-light' : ''}`} style={{ '--k': i, zIndex: i + 1 } as CSSProperties} data-rv="">
      <div className="re-card-top">
        <span className="re-card-no">
          No. {pad2(i + 1)}
          <small> of {pad2(total)}</small>
        </span>
        <EventIcon name={fn.name} />
      </div>
      <h3 className="re-card-name">{fn.name}</h3>
      {(d || t) && <p className="re-card-when">{[d ? `${d.weekday} ${d.day} ${d.month}` : '', t].filter(Boolean).join('  ·  ')}</p>}
      {fnPlace && <p className="re-card-where">{fnPlace}</p>}
      {fn.dress?.trim() && (
        <div className="re-look">
          <p className="re-look-label">The look</p>
          <p className="re-look-text">{fn.dress}</p>
          {colours.length > 0 && <Swatches colours={colours} />}
        </div>
      )}
      <div className="re-card-acts">
        <Act href={fnDir} isPreview={isPreview} className="re-link">
          {Icon.pin} Directions
        </Act>
        <Act href={fnCal} isPreview={isPreview} className="re-link">
          {Icon.calendar} Add to calendar
        </Act>
      </div>
    </li>
  )
}

/** Large plates to swipe through, the one in focus lifted; a tap opens the lightbox. */
function Portfolio({ photos, onOpen }: { photos: string[]; onOpen: (i: number) => void }) {
  const track = useRef<HTMLDivElement | null>(null)
  const [at, setAt] = useState(0)
  useEffect(() => {
    const el = track.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.i))
      },
      { root: el, threshold: 0.6 },
    )
    el.querySelectorAll('[data-i]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [photos])
  const step = (by: number) => {
    const el = track.current
    const slide = el?.querySelector('[data-i]') as HTMLElement | null
    if (!el || !slide) return
    el.scrollBy({ left: by * (slide.offsetWidth + 14), behavior: 'smooth' })
  }
  return (
    <div className="re-port" data-rv="">
      <div ref={track} className="re-track">
        {photos.map((src, i) => (
          <figure key={src + i} data-i={i} className="re-slide" data-on={i === at ? '' : undefined}>
            <button type="button" onClick={() => onOpen(i)} aria-label={`View photo ${i + 1} of ${photos.length}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
            </button>
            <figcaption>Plate {pad2(i + 1)}</figcaption>
          </figure>
        ))}
      </div>
      <div className="re-port-ui">
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" disabled={at === 0}>
          <svg viewBox="0 0 28 10" aria-hidden>
            <path d="M27 5H2M7 1L2 5l5 4" />
          </svg>
        </button>
        <span className="re-port-count">
          {pad2(at + 1)} <i>/</i> {pad2(photos.length)}
        </span>
        <span className="re-port-bar">
          <span style={{ transform: `scaleX(${(at + 1) / photos.length})` }} />
        </span>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" disabled={at === photos.length - 1}>
          <svg viewBox="0 0 28 10" aria-hidden>
            <path d="M1 5h25M21 1l5 4-5 4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** The departures board: days, hours, minutes and seconds on split flaps. */
function Board({ date, time }: { date?: string; time?: string }) {
  const c = useCountdown(date, time, true)
  const units: [number, string][] = [
    [c?.days ?? 0, c?.days === 1 ? 'Day' : 'Days'],
    [c?.hours ?? 0, 'Hours'],
    [c?.minutes ?? 0, 'Minutes'],
    [c?.seconds ?? 0, 'Seconds'],
  ]
  return (
    <div className="re-board" role="timer" aria-live="off" data-rv="">
      {units.map(([n, label]) => (
        <div key={label} className="re-board-unit">
          <span className="re-board-digits">
            {Array.from(pad2(n)).map((ch, i) => (
              <Flap key={i} value={ch} />
            ))}
          </span>
          <span className="re-board-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

/** The reply postcard: name, yes or no, how many, a note; sent on WhatsApp, then stamped. */
function Reply({ number, couple, date, rsvpBy, initials, isPreview }: { number?: string; couple: string; date: ReturnType<typeof dateParts>; rsvpBy: ReturnType<typeof dateParts>; initials: string; isPreview: boolean }) {
  const [name, setName] = useState('')
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [guests, setGuests] = useState(1)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState<'yes' | 'no' | null>(null)
  const [nudge, setNudge] = useState(false)
  const on = date ? ` on ${date.weekday}, ${date.day} ${date.month}` : ''
  const who = name.trim()
  const plural = /&| and |family|families/i.test(who)
  const sign = `\n\nWith love,\n${who}`
  const extra = note.trim() ? `\n\n${note.trim()}` : ''
  const message =
    answer === 'no'
      ? `Dear ${couple},\n\nWith regret, ${plural ? 'we are' : 'I am'} unable to join you for the wedding${on}. Wishing you both a lifetime of happiness.${extra}${sign}`
      : `Dear ${couple},\n\nJoyfully accepting your kind invitation to the wedding${on}. ${guests === 1 ? 'One guest will attend.' : `${guests} guests will attend.`}${extra}${sign}`
  const href = whatsappHref(number, message)
  const leaves = useMemo(() => seq(couple, 72), [couple])

  const send = () => {
    if (!who || !answer) {
      setNudge(true)
      return
    }
    if (isPreview || !href) return
    window.open(href, '_blank', 'noopener')
    setSent(answer)
  }

  const choice = (value: 'yes' | 'no', label: string, line: string) => {
    const picked = answer === value
    return (
      <button
        type="button"
        role="radio"
        aria-checked={picked}
        onClick={() => {
          setAnswer(value)
          setNudge(false)
        }}
        className="re-choice"
        data-on={picked ? '' : undefined}
      >
        <span className="re-choice-box" aria-hidden>
          <svg viewBox="0 0 16 16">
            <path d="M3 8.5l3.2 3L13 4.5" />
          </svg>
        </span>
        <span>
          <span className="re-choice-label">{label}</span>
          <span className="re-choice-line">{line}</span>
        </span>
      </button>
    )
  }

  return (
    <div className="re-post-wrap" data-rv="">
      <div className="re-post">
        <div className="re-post-head">
          <div>
            <p className="re-kicker" style={{ color: 'var(--re-wine)', fontSize: 10 }}>
              Reply card
            </p>
            <p className="re-post-title">Will you join us?</p>
            {rsvpBy && (
              <p className="re-post-by">
                Kindly reply by {rsvpBy.weekday}, {rsvpBy.day} {rsvpBy.month}
              </p>
            )}
          </div>
          <div className="re-stampbox" aria-hidden>
            <span className="re-stamp-paper">
              <span className="re-stamp-ini">{initials}</span>
              <span className="re-stamp-val">Priceless</span>
            </span>
            <svg viewBox="0 0 90 90" className="re-postmark">
              <circle cx="45" cy="45" r="30" />
              <circle cx="45" cy="45" r="25" />
              <text x="45" y="42" textAnchor="middle">
                {date ? `${date.day} ${date.monthShort.toUpperCase()}` : 'WITH'}
              </text>
              <text x="45" y="54" textAnchor="middle">
                {date ? date.year : 'LOVE'}
              </text>
              <path d="M2 30c6-4 10 4 16 0M2 40c6-4 10 4 16 0M72 50c6-4 10 4 16 0M72 60c6-4 10 4 16 0" />
            </svg>
          </div>
        </div>

        <label className="re-post-field">
          <span className="re-post-label">Your name</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNudge(false)
            }}
            placeholder="e.g. Priya & Rohan Mehra"
            autoComplete="name"
            className="re-input"
            data-bad={nudge && !who ? '' : undefined}
          />
        </label>
        <div role="radiogroup" aria-label="Will you attend?" className="re-choices">
          {choice('yes', 'Joyfully accepts', 'Count me in')}
          {choice('no', 'Regretfully declines', 'With love from afar')}
        </div>
        {answer === 'yes' && (
          <div className="re-guests">
            <span className="re-post-label">Number of guests</span>
            <div className="flex items-center gap-4">
              <button type="button" aria-label="One guest fewer" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="re-step" disabled={guests <= 1}>
                −
              </button>
              <span key={guests} aria-live="polite" className="re-guests-n">
                {guests}
              </span>
              <button type="button" aria-label="One guest more" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="re-step" disabled={guests >= 12}>
                +
              </button>
            </div>
          </div>
        )}
        <label className="re-post-field">
          <span className="re-post-label">A note for the couple (optional)</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={400} className="re-input re-input-area" />
        </label>
        {nudge && (
          <p role="alert" className="re-nudge">
            {!who ? 'Please add your name' : 'Please choose whether you can come'}
            {!who && !answer ? ', and whether you can come.' : '.'}
          </p>
        )}
        <button type="button" onClick={send} className="re-btn re-btn-wide" aria-disabled={isPreview || undefined}>
          {Icon.whatsapp} Send my reply
        </button>
        {sent && (
          <>
            <p className="re-sent">Your reply is ready in WhatsApp. Tap send to deliver it. Thank you.</p>
            <span className="re-stamp" aria-hidden>
              {sent === 'yes' ? 'With joy' : 'With love'}
            </span>
          </>
        )}
        {sent === 'yes' && (
          <span className="re-burst" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2 + leaves[i] * 0.4
              const r = 90 + leaves[i + 24] * 110
              return (
                <i
                  key={i}
                  style={
                    {
                      '--x': `${Math.round(Math.cos(a) * r)}px`,
                      '--y': `${Math.round(Math.sin(a) * r - 40)}px`,
                      '--r': `${Math.round(leaves[i + 48] * 540 - 270)}deg`,
                      animationDelay: `${Math.round(leaves[i + 48] * 120)}ms`,
                    } as CSSProperties
                  }
                />
              )
            })}
          </span>
        )}
      </div>
    </div>
  )
}

/** The "your copy" sticker: a scalloped gold disc (100 x 100). */
const STICKER = (() => {
  const pts: string[] = []
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const r = i % 2 ? 46 : 49.5
    pts.push(`${Math.round((50 + Math.cos(a) * r) * 100) / 100},${Math.round((50 + Math.sin(a) * r) * 100) / 100}`)
  }
  return `M${pts.join('L')}Z`
})()

/* Every rule is scoped to .re; colours and faces are the root's custom properties. */
const CSS = `
.re .re-kicker { font-family: var(--re-ft); font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; font-weight: 500; text-wrap: balance; }
.re .re-h2 { font-family: var(--re-fd); font-size: clamp(36px, 10.5cqi, 60px); line-height: 1.04; font-weight: 400; letter-spacing: -0.01em; text-wrap: balance; }
.re .re-h3 { font-family: var(--re-fd); font-size: 26px; font-weight: 400; font-style: italic; color: var(--re-ink); }
.re .re-sub { font-family: var(--re-fd); font-style: italic; font-size: clamp(18px, 5cqi, 21px); line-height: 1.45; }
.re .re-rule { display: block; width: 64px; height: 1px; background: var(--re-gold); transform-origin: left; }
.re .text-center .re-rule { transform-origin: center; }
.re .re-sec { position: relative; padding: 88px 22px 96px; scroll-margin-top: 0; }
.re .re-paper { background-color: var(--re-paper); }
.re .re-paper2 { background-color: var(--re-paper2); }
.re .re-dark { background: radial-gradient(130% 80% at 50% 0%, var(--re-deep) 0%, var(--re-night) 72%); color: var(--re-paper); overflow: hidden; }
.re .re-script { font-family: var(--re-fs); font-size: clamp(34px, 10cqi, 48px); line-height: 1.25; color: var(--re-ink); margin-top: 6px; }
.re .re-script-light { color: var(--re-goldHi); }

/* ── Buttons and links ── */
.re .re-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 15px clamp(18px, 6cqi, 26px); white-space: nowrap; background: var(--re-wine); color: var(--re-paper); font-family: var(--re-ft); font-size: 12px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; border-radius: 999px; box-shadow: 0 12px 30px -14px var(--re-wine); transition: transform .25s ease, box-shadow .25s ease, filter .25s ease; }
.re .re-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
.re .re-btn:active { transform: translateY(0) scale(.98); }
.re .re-btn-ghost { background: transparent; color: var(--re-wine); box-shadow: inset 0 0 0 1px var(--re-wine); }
.re .re-btn-gold { background: linear-gradient(100deg, var(--re-goldLo), var(--re-goldHi) 45%, var(--re-gold) 70%, var(--re-goldLo)); background-size: 220% 100%; color: var(--re-night); box-shadow: 0 14px 34px -16px var(--re-gold); animation: re-foil 5s linear infinite; }
.re .re-btn-wide { width: 100%; margin-top: 26px; }
.re .re-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--re-ft); font-size: 11.5px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--re-wine); text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 1px; text-decoration-color: var(--re-gold); }
.re .re-dark .re-link { color: var(--re-goldHi); text-decoration-color: var(--re-goldLo); }
.re .re-dark .re-card-light .re-link { color: var(--re-wine); text-decoration-color: var(--re-gold); }
.re .re-link:hover { text-decoration-color: currentColor; }
.re .re-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }

/* ── The stage: velvet, the magazine, the sleeve ── */
.re .re-stage { position: relative; overflow: hidden; background: var(--re-night); cursor: pointer; isolation: isolate; -webkit-tap-highlight-color: transparent; }
.re[data-preview] .re-stage { cursor: default; }
.re .re-velvet { position: absolute; inset: 0; background: radial-gradient(70% 48% at 50% 42%, var(--re-deep) 0%, transparent 100%), radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,.6), transparent 60%), var(--re-night); }
.re .re-velvet::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 2px, transparent 2px 5px); }
.re .re-mag { position: absolute; left: 0; right: 0; top: 0; height: 100%; z-index: 1; transform-origin: 50% 50%; transition: transform 1s cubic-bezier(.7,0,.2,1), top 1s cubic-bezier(.7,0,.2,1), height 1s cubic-bezier(.7,0,.2,1); }
.re[data-ph="sleeve"] .re-mag { top: calc(50% - 66cqi); height: 132cqi; transform: scale(.8); }
.re .re-mag-in { position: absolute; inset: 0; perspective: 2200px; }
.re[data-ph="sleeve"] .re-mag-in { animation: re-arrive 1.5s cubic-bezier(.2,.8,.25,1) .25s both, re-float 6s ease-in-out 2s infinite; }
.re[data-ph="sleeve"] .re-mag-in::before { content: ''; position: absolute; inset: 0; border-radius: 4px; transform: translate(5px, 6px); background: linear-gradient(90deg, #d9d0bf, #f4eee3 40%, #e2d9c8); box-shadow: 2px 2px 0 #cbc1ae, 4px 5px 0 #b9ae99, 0 50px 70px -24px rgba(0,0,0,.85); }
.re .re-under { position: absolute; inset: 0; background: var(--re-paper); padding: ${HEADER + 64}px 22px 0; }
.re[data-ph="sleeve"] .re-under, .re[data-ph="cover"] .re-under { visibility: hidden; }
.re .re-page { position: absolute; inset: 0; transform-origin: 0 50%; }
/* 3D only while the page turns: WebKit paints faces in the wrong order when they sit in a 3D context at rest. */
.re[data-ph="turning"] .re-page { transform: rotateY(-172deg); transition: transform 1.15s cubic-bezier(.6,.02,.3,1); }
.re .re-face { position: absolute; inset: 0; overflow: hidden; }
.re[data-ph="turning"] .re-face { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
.re .re-face { container-type: inline-size; background: var(--re-deep); }
.re[data-ph="sleeve"] .re-face { border-radius: 4px; box-shadow: 0 50px 80px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.06); }
.re .re-face::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(0,0,0,.28), transparent 4%, transparent 96%, rgba(255,255,255,.06)); opacity: 0; transition: opacity .6s ease; }
.re[data-ph="sleeve"] .re-face::after { opacity: 1; }
.re[data-ph="turning"] .re-face::after { opacity: 1; background: linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,.55)); transition: opacity 1.1s ease; }

.re .re-sleeve { position: absolute; inset: -1.4%; z-index: 3; border-radius: 6px; background: linear-gradient(165deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.07) 30%, rgba(255,255,255,.14) 55%, rgba(255,255,255,.04) 80%, rgba(255,255,255,.12) 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), inset 0 0 40px rgba(255,255,255,.08); overflow: hidden; transition: transform .9s cubic-bezier(.6,0,.3,1), opacity .9s ease; container-type: inline-size; }
.re .re-sleeve-seam { position: absolute; left: 0; right: 0; top: 7%; height: 2px; background: rgba(255,255,255,.35); box-shadow: 0 1px 0 rgba(0,0,0,.15); }
.re .re-sleeve-gloss { position: absolute; top: -20%; bottom: -20%; width: 38%; left: -60%; transform: skewX(-18deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.38), transparent); animation: re-gloss 4.5s ease-in-out 1.6s infinite; }
.re:not([data-ph="sleeve"]) .re-sleeve { transform: translateY(118%) rotate(5deg); opacity: 0; pointer-events: none; }
.re .re-sticker { position: absolute; right: 3%; bottom: 3.5%; width: 34cqi; height: 34cqi; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--re-night); animation: re-pop .7s cubic-bezier(.3,1.6,.5,1) 1.7s both, re-wobble 3.2s ease-in-out 2.6s infinite; filter: drop-shadow(0 8px 14px rgba(0,0,0,.45)); }
.re .re-sticker svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.re .re-sticker path { fill: var(--re-goldHi); stroke: var(--re-goldLo); stroke-width: .6; }
.re .re-sticker::before { content: ''; position: absolute; inset: 9%; border-radius: 50%; border: 1px dashed var(--re-goldLo); z-index: 1; }
.re .re-sticker span { position: relative; z-index: 2; }
.re .re-sticker-k { font-family: var(--re-fc); font-size: 3.4cqi; letter-spacing: .26em; text-transform: uppercase; }
.re .re-sticker-n { font-family: var(--re-fd); font-style: italic; font-size: 5.4cqi; line-height: 1.1; padding: 1.2cqi 4cqi; max-width: 30cqi; overflow-wrap: anywhere; }
.re .re-sticker-t { font-family: var(--re-fc); font-size: 3cqi; letter-spacing: .2em; text-transform: uppercase; color: var(--re-wine); }
.re .re-hint { position: absolute; left: 0; right: 0; bottom: max(22px, 4.5svh); z-index: 4; text-align: center; font-family: var(--re-ft); font-size: 11px; letter-spacing: .26em; text-transform: uppercase; color: var(--re-goldHi); opacity: .9; animation: re-fade 1s ease 2.3s both; transition: opacity .4s ease; pointer-events: none; }
.re .re-hint b { font-weight: 600; animation: re-blink 2.4s ease-in-out 3s infinite; }
.re:not([data-ph="sleeve"]) .re-hint { animation: none; opacity: 0; }

/* ── The cover ── */
.re .re-cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; transform-origin: 50% 35%; }
.re:not([data-ph="sleeve"]) .re-cover-img { animation: re-burns 22s ease-in-out infinite alternate; }
.re .re-cover-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.18) 22%, transparent 36%, transparent 46%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.86) 100%); }
.re .re-cover-top { position: absolute; left: 0; right: 0; top: 0; padding: 4.5cqi 5cqi 0; color: var(--re-paper); }
.re .re-strap { display: flex; justify-content: space-between; gap: 12px; font-family: var(--re-fc); font-size: clamp(9px, 2.7cqi, 13px); letter-spacing: .3em; text-transform: uppercase; opacity: .92; border-bottom: 1px solid rgba(255,255,255,.35); padding-bottom: 1.8cqi; }
.re .re-mast { position: relative; margin-top: 1.6cqi; line-height: .86; font-family: var(--re-fd); white-space: nowrap; }
.re .re-mast-the { display: block; font-style: italic; font-size: 5.2cqi; letter-spacing: .02em; color: var(--re-goldHi); margin-left: .6cqi; }
.re .re-mast-word { position: relative; display: inline-block; font-size: 15.6cqi; font-weight: 600; letter-spacing: -.02em; background: linear-gradient(180deg, var(--re-goldHi) 12%, var(--re-gold) 56%, var(--re-goldLo) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--re-gold); }
.re .re-mast-shine { position: absolute; inset: 0; background: linear-gradient(100deg, transparent 38%, rgba(255,252,240,.95) 48%, transparent 58%); background-size: 280% 100%; background-position: 140% 0; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; pointer-events: none; }
.re:not([data-ph="sleeve"]) .re-mast-shine { animation: re-shine 5.5s ease-in-out 1s infinite; }
.re .re-kern { margin-right: -.11em; }
.re .re-mast-small { display: inline-block; text-align: left; }
.re .re-mast-small .re-mast-word { font-size: clamp(44px, 15cqi, 96px); }
.re .re-mast-small .re-mast-the { font-size: clamp(16px, 5cqi, 28px); }
.re .re-mast-small .re-mast-shine { animation: re-shine 5.5s ease-in-out 1s infinite; }
.re .re-price { margin-top: 2cqi; font-family: var(--re-fc); font-size: clamp(9px, 2.6cqi, 12px); letter-spacing: .26em; text-transform: uppercase; color: var(--re-paper); opacity: .85; }
.re .re-price span { color: var(--re-goldHi); }
.re .re-cover-seal { position: absolute; left: 4.5cqi; top: 41cqi; width: 23cqi; transform: rotate(-10deg); }
.re[data-ph="sleeve"] .re-cover-seal, .re[data-ph="sleeve"] .re-cover-deck, .re[data-ph="sleeve"] .re-cover-inside { display: none; }
.re:not([data-preview]) .re-cover-seal { animation: re-seal-in .6s cubic-bezier(.3,1.5,.5,1) 1.45s both; }
.re:not([data-preview]) .re-cover-deck { animation: re-up .8s cubic-bezier(.2,.7,.2,1) 1.05s both; }
.re:not([data-preview]) .re-cover-inside { animation: re-up .8s cubic-bezier(.2,.7,.2,1) 1.2s both; }
.re .re-seal { width: 100%; height: auto; filter: drop-shadow(0 6px 12px rgba(0,0,0,.4)); }
.re .re-seal-disc { fill: var(--re-wine); }
.re .re-seal-rule { fill: none; stroke: var(--re-goldHi); stroke-width: .8; opacity: .8; }
.re .re-seal-ring { font-family: var(--re-fc); font-size: 10.5px; letter-spacing: 2px; fill: var(--re-goldHi); }
.re .re-seal-top { font-family: var(--re-fd); font-size: 30px; fill: var(--re-paper); }
.re .re-seal-bot { font-family: var(--re-fc); font-size: 11px; letter-spacing: 3px; fill: var(--re-goldHi); }
.re .re-seal-spin { transform-origin: 60px 60px; }
.re:not([data-ph="sleeve"]) .re-seal-spin { animation: re-spin 26s linear infinite; }
.re .re-cover-lines { position: absolute; left: 5cqi; right: 5cqi; bottom: 27cqi; color: var(--re-paper); }
.re .re-tag { display: inline-block; font-family: var(--re-fc); font-size: clamp(10px, 3cqi, 14px); font-weight: 500; letter-spacing: .24em; text-transform: uppercase; background: var(--re-wine); color: #fff; padding: 1cqi 2.4cqi .9cqi; }
.re .re-cover-names { margin-top: 2.6cqi; font-family: var(--re-fd); font-style: italic; font-weight: 500; line-height: .92; text-shadow: 0 4px 28px rgba(0,0,0,.45); }
.re .re-cover-names span { display: block; overflow-wrap: anywhere; }
.re .re-cover-names span + span { padding-left: 9cqi; }
.re .re-cover-names em { font-style: italic; color: var(--re-goldHi); }
.re .re-cover-deck { margin-top: 2.8cqi; max-width: 70cqi; font-family: var(--re-fd); font-size: clamp(15px, 4.6cqi, 24px); line-height: 1.25; color: var(--re-paper); text-wrap: balance; }
.re .re-cover-inside { margin-top: 3cqi; max-width: 82cqi; font-family: var(--re-fc); font-size: clamp(10px, 3cqi, 14px); letter-spacing: .14em; text-transform: uppercase; line-height: 1.5; color: var(--re-paper); opacity: .92; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.re .re-cover-inside b { color: var(--re-goldHi); font-weight: 600; margin-right: .5em; }
.re .re-cover-strip { position: absolute; left: 5cqi; right: 5cqi; bottom: 11cqi; display: flex; align-items: flex-end; justify-content: space-between; gap: 4cqi; border-top: 1px solid rgba(255,255,255,.3); padding-top: 2.6cqi; color: var(--re-paper); }
.re .re-cover-date { font-family: var(--re-fd); font-size: clamp(20px, 6.4cqi, 34px); letter-spacing: .02em; font-variant-numeric: lining-nums; }
.re .re-cover-city { font-family: var(--re-fc); font-size: clamp(9px, 2.6cqi, 12px); letter-spacing: .3em; text-transform: uppercase; color: var(--re-goldHi); margin-top: .6cqi; }
.re .re-barcode { display: inline-flex; flex-direction: column; align-items: center; background: #fff; padding: 1.4cqi 2cqi .8cqi; width: 24cqi; flex-shrink: 0; }
.re .re-barcode svg { width: 100%; height: 7cqi; display: block; }
.re .re-barcode rect { fill: #111; transform-origin: 50% 100%; transform-box: fill-box; }
.re .re-barcode span { font-family: var(--re-fc); font-size: clamp(7px, 1.9cqi, 10px); letter-spacing: .12em; color: #111; margin-top: .4cqi; white-space: nowrap; }
.re .re-turn { position: absolute; left: 5cqi; bottom: 3.2cqi; display: inline-flex; align-items: center; gap: 2.4cqi; font-family: var(--re-fc); font-size: clamp(10px, 3cqi, 14px); letter-spacing: .3em; text-transform: uppercase; color: var(--re-goldHi); }
.re .re-turn svg { width: 7cqi; height: auto; fill: none; stroke: currentColor; stroke-width: 1.4; }
.re:not([data-ph="sleeve"]):not([data-preview]) .re-turn svg { animation: re-nudge 1.6s ease-in-out infinite; }
.re .re-curl { position: absolute; right: 0; bottom: 0; width: 11cqi; height: 11cqi; background: linear-gradient(to bottom right, var(--re-paper2) 0%, #fff 32%, var(--re-paper) 49.6%, var(--re-night) 50.4%); filter: drop-shadow(-3px -3px 6px rgba(0,0,0,.45)); }
.re:not([data-ph="sleeve"]):not([data-preview]) .re-curl { animation: re-lift 3s ease-in-out 1.2s infinite; }
.re .re-flashes i { position: absolute; width: 90cqi; height: 90cqi; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,.35) 30%, transparent 62%); opacity: 0; pointer-events: none; mix-blend-mode: screen; }
.re .re-flashes i:nth-child(1) { left: -30cqi; top: 8%; }
.re .re-flashes i:nth-child(2) { right: -34cqi; top: 30%; }
.re .re-flashes i:nth-child(3) { left: 10cqi; bottom: -30cqi; }
.re[data-ph="cover"] .re-flashes i:nth-child(1) { animation: re-flash .5s ease-out .75s both; }
.re[data-ph="cover"] .re-flashes i:nth-child(2) { animation: re-flash .45s ease-out 1.05s both; }
.re[data-ph="cover"] .re-flashes i:nth-child(3) { animation: re-flash .5s ease-out 1.3s both; }

/* No photograph: the monogram cover. */
.re .re-mono { position: absolute; inset: 0; background: radial-gradient(80% 55% at 50% 42%, var(--re-wine) 0%, var(--re-deep) 55%, var(--re-night) 100%); }
.re .re-mono-glow { position: absolute; left: 50%; top: 42%; width: 120cqi; height: 120cqi; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(255,230,170,.28), transparent 60%); }
.re .re-mono-ring { position: absolute; left: 50%; top: 42%; width: 78cqi; transform: translate(-50%, -50%); fill: none; stroke: var(--re-gold); stroke-width: .8; opacity: .7; }
.re .re-mono-text { position: absolute; left: 0; right: 0; top: 42%; transform: translateY(-50%); text-align: center; font-family: var(--re-fd); font-style: italic; font-size: 30cqi; line-height: 1; background: linear-gradient(180deg, var(--re-goldHi), var(--re-gold) 60%, var(--re-goldLo)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.re .re-mono-text span { font-size: .5em; margin: 0 .08em; vertical-align: .35em; }

/* Gold dust. */
.re .re-dust { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
.re .re-dust-back { z-index: 0; }
.re .re-dust-front { z-index: 2; opacity: .8; }
.re .re-dust i { position: absolute; width: var(--s); height: var(--s); border-radius: 50%; background: var(--re-goldHi); box-shadow: 0 0 6px 1px var(--re-gold); opacity: 0; animation-name: re-dust; animation-timing-function: linear; animation-iteration-count: infinite; }

/* The veil that hides the jump from the cover to the contents. */
.re .re-veil { position: fixed; inset: 0; z-index: 70; pointer-events: none; background: var(--re-paper); }
.re .re-veil-in { animation: re-fade .25s ease forwards; }
.re .re-veil-out { animation: re-fade-out .7s ease forwards; }

/* ── The running head ── */
.re .re-run { position: sticky; top: 0; z-index: 30; height: ${HEADER}px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-left: 16px; border-bottom: 1px solid rgba(0,0,0,.08); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.re .re-run-mast { font-family: var(--re-fd); font-weight: 600; font-size: 17px; letter-spacing: -.01em; color: var(--re-ink); white-space: nowrap; }
.re .re-run-page { display: flex; align-items: baseline; gap: 10px; min-width: 0; font-family: var(--re-fc); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--re-soft); }
.re .re-run-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: re-up .5s cubic-bezier(.2,.7,.2,1) both; }
.re .re-run-no { color: var(--re-wine); font-weight: 600; white-space: nowrap; }
.re .re-run-bar { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: linear-gradient(90deg, var(--re-goldLo), var(--re-gold), var(--re-wine)); transform: scaleX(0); transform-origin: left; }

/* ── Contents ── */
.re .re-contents { padding-top: ${HEADER + 64}px; max-width: 46rem; margin: 0 auto; }
.re .re-under .re-h2, .re .re-contents .re-h2 { font-size: clamp(42px, 13cqi, 76px); }
.re .re-toc { border-top: 1px solid var(--re-ink); }
.re .re-toc-row { width: 100%; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 18px; padding: 18px 2px; border-bottom: 1px solid rgba(0,0,0,.12); text-align: left; transition: background-color .3s ease, padding .3s ease; }
.re .re-toc-row:hover { background: var(--re-paper2); padding-left: 10px; }
.re .re-toc-no { font-family: var(--re-fd); font-size: clamp(34px, 10cqi, 48px); line-height: 1; color: var(--re-wine); font-variant-numeric: lining-nums tabular-nums; min-width: 1.3em; }
.re .re-toc-title { display: block; font-family: var(--re-fd); font-size: clamp(21px, 6cqi, 27px); font-style: italic; line-height: 1.15; color: var(--re-ink); }
.re .re-toc-deck { display: block; margin-top: 4px; font-size: 13.5px; line-height: 1.45; color: var(--re-soft); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.re .re-toc-arrow { width: 26px; fill: none; stroke: var(--re-wine); stroke-width: 1.3; transition: transform .3s ease; }
.re .re-toc-row:hover .re-toc-arrow { transform: translateX(5px); }
.re .re-oncover { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--re-paper2); }
.re .re-oncover-img { flex-shrink: 0; width: 64px; aspect-ratio: 3/4; overflow: hidden; box-shadow: 0 10px 20px -10px rgba(0,0,0,.5); transform: rotate(-3deg); }
.re .re-oncover-img img { width: 100%; height: 100%; object-fit: cover; }
.re .re-oncover p { font-size: 14px; line-height: 1.55; color: var(--re-soft); }
.re .re-oncover b { display: block; font-family: var(--re-fc); font-size: 11px; font-weight: 500; letter-spacing: .26em; text-transform: uppercase; color: var(--re-wine); margin-bottom: 2px; }

/* Odometer digits. */
.re .re-odo { display: inline-flex; }
.re .re-odo-col { display: inline-block; height: 1em; overflow: hidden; line-height: 1; }
.re .re-odo-reel { display: flex; flex-direction: column; transform: translateY(calc(var(--d) * -1em)); transition: transform 1.4s cubic-bezier(.2,.75,.15,1) calc(var(--i) * 140ms + var(--k, 0) * 90ms); }
.re .re-odo-reel span { height: 1em; line-height: 1; display: block; }

/* ── The invitation ── */
.re .re-invite { padding-left: 16px; padding-right: 16px; }
.re .re-inv-frame { position: relative; max-width: 38rem; margin: 0 auto; padding: 64px 22px 56px; text-align: center; border: 1px solid var(--re-gold); outline: 1px solid var(--re-gold); outline-offset: -8px; }
.re .re-inv-names { margin-top: 26px; font-family: var(--re-fd); font-weight: 400; font-size: clamp(54px, 17cqi, 104px); line-height: .95; color: var(--re-ink); }
.re .re-inv-names .block { display: block; overflow-wrap: anywhere; }
.re .re-amp { display: block; font-style: italic; font-size: .5em; line-height: 1.2; background: linear-gradient(100deg, var(--re-goldLo), var(--re-goldHi) 45%, var(--re-gold) 65%, var(--re-goldLo)); background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--re-gold); animation: re-foil 6s linear infinite; }
.re .re-inv-req { margin-top: 28px; font-size: clamp(15px, 4.3cqi, 18px); line-height: 1.75; font-weight: 300; color: var(--re-ink); }
.re .re-inv-date { margin: 40px auto 0; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 18px; max-width: 24rem; }
.re .re-inv-line { height: 1px; background: var(--re-gold); transform-origin: center; }
.re .re-inv-day { font-family: var(--re-fd); font-size: clamp(84px, 26cqi, 130px); line-height: 1; color: var(--re-ink); margin: 8px 0 6px; font-variant-numeric: lining-nums; }
.re .re-inv-time { margin-top: 8px; font-family: var(--re-fd); font-style: italic; font-size: clamp(16px, 4.6cqi, 19px); color: var(--re-soft); }
.re .re-inv-venue { margin-top: 30px; }
.re .re-inv-venue-name { font-family: var(--re-fd); font-size: clamp(24px, 7cqi, 32px); color: var(--re-ink); }
.re .re-inv-quote { position: relative; margin: 44px auto 0; max-width: 26rem; padding: 26px 0 0; font-family: var(--re-fd); font-style: italic; font-size: clamp(19px, 5.4cqi, 24px); line-height: 1.45; color: var(--re-wine); }
.re .re-inv-quote::before { content: ''; position: absolute; left: 50%; top: 0; width: 8px; height: 8px; background: var(--re-gold); transform: translateX(-50%) rotate(45deg); box-shadow: 16px -16px 0 -2px var(--re-gold), -16px 16px 0 -2px var(--re-gold); }
.re .re-inv-sign { margin-top: 40px; }
.re .re-inv-sign .re-script { display: inline-block; clip-path: inset(0 0 0 0); }
.re .re-inv-parents { margin-top: 34px; display: grid; gap: 14px; font-size: 14px; color: var(--re-soft); }
.re .re-inv-parents b { display: block; font-family: var(--re-fc); font-weight: 500; font-size: 11px; letter-spacing: .26em; text-transform: uppercase; color: var(--re-wine); margin-bottom: 2px; }
.re .re-inv-bless { margin-top: 28px; font-size: 14px; color: var(--re-soft); }

/* ── Tickers ── */
.re .re-ticker { position: relative; z-index: 2; overflow: hidden; margin: -14px -4% ; padding: 13px 0; transform: rotate(-2.2deg); box-shadow: 0 10px 30px -18px rgba(0,0,0,.6); }
.re .re-ticker-wine { background: var(--re-wine); color: var(--re-goldHi); }
.re .re-ticker-gold { background: linear-gradient(90deg, var(--re-goldLo), var(--re-goldHi), var(--re-gold)); color: var(--re-night); transform: rotate(1.8deg); }
.re .re-ticker-track { display: flex; width: max-content; animation: re-marquee 38s linear infinite; }
.re .re-ticker-track.re-rev { animation-direction: reverse; }
.re .re-ticker span { flex-shrink: 0; white-space: pre; font-family: var(--re-fc); font-size: 15px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; }

/* ── Cover story ── */
.re .re-story { padding-top: 104px; }
.re .re-story-grid { display: grid; gap: 40px; max-width: 64rem; margin: 0 auto; align-items: start; }
.re .re-story-photo { position: relative; margin: 0 -22px; overflow: hidden; aspect-ratio: 4/5; background: var(--re-deep); }
.re .re-story-photo img { width: 100%; height: 100%; object-fit: cover; }
.re .re-story-photo figcaption { position: absolute; left: 18px; bottom: 16px; font-family: var(--re-fc); font-size: 11px; letter-spacing: .26em; text-transform: uppercase; color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,.6); }
.re .re-deck { margin-top: 22px; font-family: var(--re-fd); font-style: italic; font-size: clamp(22px, 6.4cqi, 30px); line-height: 1.3; color: var(--re-wine); text-wrap: balance; }
.re .re-byline { margin-top: 18px; font-family: var(--re-fc); font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--re-soft); }
.re .re-body { margin-top: 24px; font-size: clamp(15.5px, 4.3cqi, 17px); line-height: 1.85; font-weight: 300; color: var(--re-ink); }
.re .re-body p + p { margin-top: 14px; }
.re .re-body > p:first-child::first-letter { float: left; font-family: var(--re-fd); font-size: 4.1em; line-height: .78; padding: 6px 10px 0 0; color: var(--re-wine); }

/* ── The celebrations: stacking cards ── */
.re .re-events { padding-bottom: 120px; overflow: clip; }
.re .re-stack { max-width: 36rem; margin: 48px auto 0; display: grid; gap: 22px; }
.re .re-card { position: sticky; top: calc(${HEADER + 14}px + var(--k) * 12px); padding: 26px 24px 24px; border-radius: 16px; background: radial-gradient(120% 90% at 100% 0%, var(--re-deep), var(--re-night) 70%); color: var(--re-paper); box-shadow: 0 -20px 40px -24px rgba(0,0,0,.8), inset 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 7px transparent, inset 0 0 0 8px rgba(201,166,107,.32); min-height: 340px; overflow: hidden; }
.re .re-card::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.08) 1px, transparent 1.5px); background-size: 14px 14px; mask-image: linear-gradient(200deg, #000, transparent 60%); -webkit-mask-image: linear-gradient(200deg, #000, transparent 60%); pointer-events: none; }
.re .re-card > * { position: relative; }
.re .re-card-light { background: var(--re-paper); color: var(--re-ink); box-shadow: 0 -20px 40px -24px rgba(0,0,0,.8), inset 0 0 0 8px var(--re-paper), inset 0 0 0 9px var(--re-gold); }
.re .re-card-light::before { background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,.07) 1px, transparent 1.5px); }
.re .re-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.re .re-card-no { font-family: var(--re-fc); font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--re-gold); }
.re .re-card-light .re-card-no { color: var(--re-wine); }
.re .re-card-no small { font-size: 1em; opacity: .55; }
.re .re-ico { width: 58px; height: 58px; fill: none; stroke: var(--re-goldHi); stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; }
.re .re-card-light .re-ico { stroke: var(--re-wine); }
.re .re-ico path { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 1.6s ease calc(.3s + var(--i) * .25s); }
.re .re-card-name { margin-top: 18px; font-family: var(--re-fd); font-style: italic; font-weight: 400; font-size: clamp(36px, 11cqi, 56px); line-height: 1; overflow-wrap: anywhere; }
.re .re-card-when { margin-top: 16px; font-family: var(--re-fc); font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: var(--re-goldHi); }
.re .re-card-light .re-card-when { color: var(--re-wine); }
.re .re-card-where { margin-top: 6px; font-size: 16px; opacity: .92; }
.re .re-look { margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(201,166,107,.35); }
.re .re-look-label { font-family: var(--re-fc); font-size: 10.5px; letter-spacing: .32em; text-transform: uppercase; color: var(--re-gold); }
.re .re-card-light .re-look-label { color: var(--re-wine); }
.re .re-look-text { margin-top: 5px; font-family: var(--re-fd); font-style: italic; font-size: 18px; line-height: 1.35; }
.re .re-swatches { display: flex; gap: 8px; margin-top: 12px; }
.re .re-swatches i { width: 26px; height: 26px; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,.85), 0 4px 10px rgba(0,0,0,.35); transition: transform .5s cubic-bezier(.3,1.6,.5,1) calc(.5s + var(--i) * .1s); }
.re .re-card-acts { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 22px; }

/* ── The portfolio ── */
.re .re-port { margin: 44px -22px 0; }
.re .re-track { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 10px calc(50% - min(39cqi, 210px)) 18px; scrollbar-width: none; overscroll-behavior-x: contain; }
.re .re-track::-webkit-scrollbar { display: none; }
.re .re-slide { flex: 0 0 min(78cqi, 420px); scroll-snap-align: center; margin: 0; transition: transform .6s cubic-bezier(.2,.7,.2,1), opacity .6s ease; transform: scale(.9); opacity: .55; }
.re .re-slide[data-on] { transform: none; opacity: 1; }
.re .re-slide button { display: block; width: 100%; aspect-ratio: 4/5; overflow: hidden; background: var(--re-paper2); box-shadow: 0 30px 50px -30px rgba(0,0,0,.6); }
.re .re-slide img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.4s cubic-bezier(.2,.7,.2,1); transform: scale(1.12); }
.re .re-slide[data-on] img { transform: scale(1); }
.re .re-slide figcaption { margin-top: 12px; font-family: var(--re-fc); font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--re-soft); text-align: center; }
.re .re-port-ui { display: flex; align-items: center; gap: 14px; max-width: 26rem; margin: 8px auto 0; padding: 0 22px; }
.re .re-port-ui button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--re-gold); display: grid; place-items: center; color: var(--re-wine); transition: background-color .25s ease, opacity .25s ease; }
.re .re-port-ui button:disabled { opacity: .3; }
.re .re-port-ui button:not(:disabled):hover { background: var(--re-paper2); }
.re .re-port-ui svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 1.4; }
.re .re-port-count { font-family: var(--re-fd); font-size: 18px; color: var(--re-ink); font-variant-numeric: lining-nums tabular-nums; white-space: nowrap; }
.re .re-port-count i { color: var(--re-gold); font-style: normal; margin: 0 2px; }
.re .re-port-bar { flex: 1; height: 1px; background: rgba(0,0,0,.15); position: relative; }
.re .re-port-bar span { position: absolute; inset: -0.5px 0; background: var(--re-wine); transform-origin: left; transition: transform .5s ease; }

/* ── The guide ── */
.re .re-facts { display: grid; gap: 14px; max-width: 64rem; margin: 48px auto 0; }
.re .re-fact { position: relative; background: var(--re-paper); padding: 26px 22px 24px; box-shadow: 0 20px 40px -32px rgba(0,0,0,.5); }
.re .re-fact::after { content: ''; position: absolute; left: 22px; right: 22px; top: 0; height: 3px; background: var(--re-wine); transform-origin: left; transition: transform 1s cubic-bezier(.2,.7,.2,1) .2s; }
.re .re-fact-label { display: flex; align-items: baseline; gap: 12px; font-family: var(--re-fd); font-style: italic; font-size: 30px; color: var(--re-ink); }
.re .re-fact-label span { font-family: var(--re-fc); font-style: normal; font-size: 11px; letter-spacing: .3em; color: var(--re-wine); }
.re .re-fact-body { margin-top: 12px; display: grid; gap: 6px; justify-items: start; }
.re .re-fact-big { font-family: var(--re-fd); font-size: clamp(21px, 6cqi, 25px); line-height: 1.3; color: var(--re-ink); }
.re .re-fact-italic { font-style: italic; }
.re .re-fact-sub { font-size: 15px; color: var(--re-soft); margin-bottom: 8px; }
.re .re-desk { max-width: 44rem; margin: 56px auto 0; display: grid; gap: 40px; }
.re .re-travel { margin-top: 14px; display: grid; gap: 14px; }
.re .re-travel li { display: grid; grid-template-columns: 34px 1fr; gap: 10px; font-size: 16px; line-height: 1.7; font-weight: 300; color: var(--re-ink); }
.re .re-travel li span { font-family: var(--re-fd); font-size: 22px; line-height: 1.3; color: var(--re-wine); }
.re .re-calls { margin-top: 10px; }
.re .re-calls li { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 16px; padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,.1); font-size: 16px; }
.re .re-faq { border-bottom: 1px solid rgba(0,0,0,.1); padding: 16px 0; }
.re .re-faq summary { display: flex; align-items: flex-start; gap: 10px; list-style: none; cursor: pointer; font-family: var(--re-fd); font-size: 19px; line-height: 1.35; color: var(--re-ink); }
.re .re-faq summary::-webkit-details-marker { display: none; }
.re .re-faq p { display: flex; gap: 10px; margin-top: 10px; font-size: 15.5px; line-height: 1.7; color: var(--re-soft); }
.re .re-faq-q { font-family: var(--re-fd); font-style: italic; color: var(--re-wine); flex-shrink: 0; width: 22px; }
.re .re-plus { color: var(--re-wine); font-size: 22px; line-height: 1; transition: transform .3s ease; }
.re .re-faq[open] .re-plus { transform: rotate(45deg); }

/* ── The countdown board ── */
.re .re-count { text-align: center; }
.re .re-board { display: flex; justify-content: center; gap: clamp(8px, 3cqi, 22px); margin: 48px auto 0; max-width: 40rem; }
.re .re-board-unit { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.re .re-board-digits { display: flex; gap: 3px; }
.re .re-board-label { font-family: var(--re-fc); font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; color: var(--re-gold); }
.re .re-flap { position: relative; display: block; width: clamp(30px, 9.4cqi, 54px); height: clamp(46px, 14cqi, 80px); font-family: var(--re-fd); font-size: clamp(34px, 10.4cqi, 60px); color: var(--re-goldHi); perspective: 260px; font-variant-numeric: lining-nums tabular-nums; }
.re .re-flap > span { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: linear-gradient(180deg, #2a2a2e, #1a1a1d); border-radius: 6px; }
.re .re-flap > span i { display: block; height: 200%; font-style: normal; text-align: center; line-height: clamp(46px, 14cqi, 80px); }
.re .re-flap-top { top: 0; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; transform-origin: 50% 100%; }
.re .re-flap-bot { bottom: 0; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; transform-origin: 50% 0; background: linear-gradient(180deg, #1d1d20, #141416) !important; }
.re .re-flap-bot i { transform: translateY(-50%); }
.re .re-flap::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(0,0,0,.7); z-index: 3; }
.re .re-flap-fall { z-index: 2; animation: re-flap-fall .28s ease-in forwards; }
.re .re-flap-drop { z-index: 2; animation: re-flap-drop .28s ease-out .28s both; }
.re .re-count-when { margin-top: 34px; font-family: var(--re-fd); font-style: italic; font-size: clamp(18px, 5cqi, 22px); color: var(--re-blush); }

/* ── The reply postcard ── */
.re .re-post-wrap { position: relative; max-width: 30rem; margin: 48px auto 0; }
.re .re-post { position: relative; background: #fffdf8; padding: 28px 24px 30px; box-shadow: 0 40px 70px -40px rgba(0,0,0,.55), 0 2px 0 rgba(0,0,0,.03); transform: rotate(-1deg); }
.re .re-post::before { content: ''; position: absolute; left: 0; right: 0; top: -7px; height: 14px; background: radial-gradient(circle at 7px 7px, var(--re-paper) 4.5px, transparent 5px) 0 0 / 14px 14px repeat-x; }
.re .re-post-head { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px dashed rgba(0,0,0,.2); }
.re .re-post-title { margin-top: 6px; font-family: var(--re-fd); font-style: italic; font-size: clamp(26px, 8cqi, 34px); line-height: 1.1; color: var(--re-ink); }
.re .re-post-by { margin-top: 8px; font-size: 14px; color: var(--re-soft); }
.re .re-stampbox { position: relative; flex-shrink: 0; width: 76px; height: 92px; }
.re .re-stamp-paper { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: var(--re-wine); color: var(--re-goldHi); border: 4px solid #fffdf8; outline: 1px dashed rgba(0,0,0,.25); transform: rotate(3deg); box-shadow: 0 3px 8px rgba(0,0,0,.2); }
.re .re-stamp-ini { font-family: var(--re-fd); font-style: italic; font-size: 26px; line-height: 1; }
.re .re-stamp-val { font-family: var(--re-fc); font-size: 8.5px; letter-spacing: .2em; text-transform: uppercase; }
.re .re-postmark { position: absolute; left: -46px; top: 18px; width: 86px; fill: none; stroke: var(--re-ink); stroke-width: 1.2; opacity: .55; transform: rotate(-14deg); }
.re .re-postmark text { stroke: none; fill: var(--re-ink); font-family: var(--re-fc); font-size: 9px; letter-spacing: 1.5px; }
.re .re-post-field { display: block; margin-top: 22px; }
.re .re-post-label { display: block; font-family: var(--re-fc); font-size: 10.5px; letter-spacing: .28em; text-transform: uppercase; color: var(--re-wine); }
.re .re-input { margin-top: 6px; width: 100%; background: transparent; outline: none; padding: 8px 0; border-bottom: 1px solid var(--re-gold); font-family: var(--re-fd); font-size: 21px; color: var(--re-ink); transition: border-color .25s ease; }
.re .re-input:focus { border-color: var(--re-wine); }
.re .re-input[data-bad] { border-color: var(--re-wine); animation: re-shake .4s ease; }
.re .re-input::placeholder { color: var(--re-soft); opacity: .5; font-style: italic; }
.re .re-input-area { resize: none; font-family: var(--re-ft); font-size: 16px; line-height: 1.6; background-image: repeating-linear-gradient(transparent 0 31px, rgba(0,0,0,.1) 31px 32px); }
.re .re-choices { display: grid; gap: 10px; margin-top: 22px; }
.re .re-choice { display: flex; align-items: center; gap: 14px; padding: 14px 16px; text-align: left; border: 1px solid rgba(0,0,0,.14); background: transparent; transition: border-color .25s ease, background-color .25s ease, transform .25s ease; }
.re .re-choice[data-on] { border-color: var(--re-wine); background: var(--re-paper); transform: translateX(4px); }
.re .re-choice-box { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--re-gold); display: grid; place-items: center; flex-shrink: 0; transition: background-color .25s ease, border-color .25s ease; }
.re .re-choice-box svg { width: 14px; fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 20; stroke-dashoffset: 20; transition: stroke-dashoffset .35s ease .1s; }
.re .re-choice[data-on] .re-choice-box { background: var(--re-wine); border-color: var(--re-wine); }
.re .re-choice[data-on] .re-choice-box svg { stroke-dashoffset: 0; }
.re .re-choice-label { display: block; font-family: var(--re-fd); font-style: italic; font-size: 20px; color: var(--re-ink); }
.re .re-choice-line { display: block; font-size: 13px; color: var(--re-soft); }
.re .re-guests { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 22px; animation: re-up .4s ease both; }
.re .re-guests-n { font-family: var(--re-fd); font-size: 30px; min-width: 1.4em; text-align: center; color: var(--re-ink); animation: re-pop .35s cubic-bezier(.3,1.6,.5,1) both; }
.re .re-step { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--re-gold); color: var(--re-wine); font-size: 20px; line-height: 1; }
.re .re-step:disabled { opacity: .35; }
.re .re-nudge { margin-top: 16px; font-size: 14px; color: var(--re-wine); }
.re .re-sent { margin-top: 16px; text-align: center; font-family: var(--re-fd); font-style: italic; font-size: 17px; color: var(--re-soft); }
.re .re-stamp { position: absolute; right: 18px; top: 46%; padding: 8px 16px; border: 3px double var(--re-wine); color: var(--re-wine); font-family: var(--re-fc); font-size: 22px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; transform: rotate(-14deg); mix-blend-mode: multiply; opacity: .85; animation: re-stamp .45s cubic-bezier(.3,1.4,.5,1) both; pointer-events: none; }
.re .re-burst { position: absolute; left: 50%; top: 60%; pointer-events: none; }
.re .re-burst i { position: absolute; width: 9px; height: 14px; border-radius: 1px 8px; background: linear-gradient(135deg, var(--re-goldHi), var(--re-gold) 60%, var(--re-goldLo)); animation: re-leaf 1.6s cubic-bezier(.2,.7,.3,1) both; }

/* ── Back cover ── */
.re .re-finale { text-align: center; padding-bottom: 48px; }
.re .re-finale-words { position: relative; max-width: 32rem; margin: 36px auto 0; font-family: var(--re-fd); font-style: italic; font-size: clamp(24px, 7.2cqi, 34px); line-height: 1.35; color: var(--re-paper); text-wrap: balance; }
.re .re-finale-words p + p { margin-top: 10px; }
.re .re-hashtag { margin-top: 26px; font-family: var(--re-fc); font-size: 14px; letter-spacing: .2em; color: var(--re-goldHi); }
.re .re-finale-foot { display: flex; flex-direction: column; align-items: center; gap: 26px; margin-top: 46px; }
.re .re-finale .re-barcode { width: min(46cqi, 210px); padding: 10px 14px 6px; }
.re .re-finale .re-barcode svg { height: 54px; }
.re .re-finale .re-barcode span { font-size: 10px; }

/* ── Wider screens ── */
@container (min-width: 640px) {
  /* A tall fashion-magazine page: the cover needs about 1.6 widths of height to keep the couple clear. */
  .re .re-mag, .re[data-ph="sleeve"] .re-mag { top: 3%; height: 94%; right: auto; width: auto; aspect-ratio: 0.64; left: 50%; translate: -50% 0; }
  .re[data-ph="sleeve"] .re-mag { transform: scale(.86); }
  .re .re-face { box-shadow: 0 50px 90px -40px rgba(0,0,0,.9); }
  .re .re-sec { padding-left: 40px; padding-right: 40px; }
  .re .re-facts { grid-template-columns: repeat(3, 1fr); }
  .re .re-story-grid { grid-template-columns: 5fr 6fr; gap: 56px; }
  .re .re-story-photo { margin: 0; position: sticky; top: ${HEADER + 24}px; }
  .re .re-inv-parents { grid-template-columns: 1fr 1fr; }
  .re .re-port { margin-left: -40px; margin-right: -40px; }
}

/* ── Reveals: hidden states only once the page is animating, and only until data-in ── */
.re[data-anim] [data-rv] { transition: opacity .9s ease, transform 1s cubic-bezier(.2,.7,.2,1); transition-delay: calc(var(--k, 0) * 90ms); }
.re[data-anim] [data-rv]:not([data-in]) { opacity: 0; transform: translateY(22px); }
.re[data-anim] .re-card[data-rv]:not([data-in]) { transform: translateY(60px) scale(.96); }
.re[data-anim] [data-rv]:not([data-in]) .re-w > span { transform: translateY(108%); }
.re .re-w { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 .06em .14em; margin: 0 -.06em -.14em; }
.re .re-w > span { display: inline-block; transition: transform 1s cubic-bezier(.2,.75,.15,1) calc(var(--i) * 80ms + .1s); }
.re[data-anim] [data-rv]:not([data-in]) .re-odo-reel { transform: none; transition: none; }
.re[data-anim] [data-rv]:not([data-in]) .re-rule, .re[data-anim] [data-rv]:not([data-in]) .re-inv-line, .re[data-anim] [data-rv]:not([data-in])::after { transform: scaleX(0); }
.re .re-rule, .re .re-inv-line { transition: transform 1.1s cubic-bezier(.2,.7,.2,1) .35s; }
.re[data-anim] [data-rv]:not([data-in]) .re-ico path { stroke-dashoffset: 1; }
.re[data-anim] [data-rv]:not([data-in]) .re-swatches i { transform: scale(0); }
.re[data-anim] .re-inv-sign:not([data-in]) .re-script { clip-path: inset(0 100% 0 0); }
.re .re-inv-sign .re-script { transition: clip-path 2.2s cubic-bezier(.45,.05,.3,1) .4s; }
.re[data-anim] .re-story-photo:not([data-in]) { clip-path: inset(100% 0 0 0); opacity: 1; transform: none; }
.re .re-story-photo { transition: clip-path 1.4s cubic-bezier(.7,0,.2,1) !important; clip-path: inset(0 0 0 0); }
.re .re-story-photo img { transition: transform 2.4s cubic-bezier(.2,.7,.2,1); }
.re[data-anim] .re-story-photo:not([data-in]) img { transform: scale(1.25); }
.re[data-anim] .re-post-wrap:not([data-in]) { transform: translateY(60px) rotate(4deg); }
.re[data-anim] .re-board:not([data-in]) .re-flap { transform: rotateX(90deg); }
.re .re-board .re-flap { transition: transform .8s cubic-bezier(.3,1.4,.5,1); }
.re .re-board-unit:nth-child(2) .re-flap { transition-delay: .1s; }
.re .re-board-unit:nth-child(3) .re-flap { transition-delay: .2s; }
.re .re-board-unit:nth-child(4) .re-flap { transition-delay: .3s; }
.re .re-toc li { --k: 0; }

@keyframes re-arrive { 0% { opacity: 0; transform: translateY(70%) rotateX(38deg) rotateZ(-6deg) scale(.9); } 70% { opacity: 1; transform: translateY(-2%) rotateX(-4deg) rotateZ(1deg) scale(1.01); } 100% { opacity: 1; transform: none; } }
@keyframes re-float { 0%, 100% { transform: translateY(0) rotateX(0) rotateZ(0); } 50% { transform: translateY(-1.2%) rotateX(3deg) rotateZ(-.6deg); } }
@keyframes re-gloss { 0% { left: -60%; } 45%, 100% { left: 130%; } }
@keyframes re-pop { 0% { opacity: 0; transform: scale(.2) rotate(-30deg); } 100% { opacity: 1; transform: none; } }
@keyframes re-wobble { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(-5deg) scale(1.04); } }
@keyframes re-blink { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes re-burns { from { transform: scale(1.02); } to { transform: scale(1.14) translate(-1.5%, 1%); } }
@keyframes re-shine { 0% { background-position: 140% 0; } 45%, 100% { background-position: -40% 0; } }
@keyframes re-spin { to { transform: rotate(360deg); } }
@keyframes re-seal-in { 0% { opacity: 0; transform: rotate(-40deg) scale(2.2); } 100% { opacity: 1; transform: rotate(-10deg) scale(1); } }
@keyframes re-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
@keyframes re-lift { 0%, 100% { width: 11cqi; height: 11cqi; } 50% { width: 17cqi; height: 17cqi; } }
@keyframes re-flash { 0% { opacity: 0; } 18% { opacity: 1; } 100% { opacity: 0; } }
@keyframes re-dust { 0% { opacity: 0; transform: translateY(0) scale(.6); } 20% { opacity: .9; } 80% { opacity: .6; } 100% { opacity: 0; transform: translateY(-160px) scale(1); } }
@keyframes re-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes re-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes re-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes re-foil { from { background-position: 220% 0; } to { background-position: -20% 0; } }
@keyframes re-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes re-flap-fall { to { transform: rotateX(-90deg); } }
@keyframes re-flap-drop { from { transform: rotateX(90deg); } to { transform: none; } }
@keyframes re-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@keyframes re-stamp { 0% { opacity: 0; transform: rotate(-14deg) scale(2.6); } 100% { opacity: .85; transform: rotate(-14deg) scale(1); } }
@keyframes re-leaf { 0% { opacity: 1; transform: translate(0, 0) rotate(0); } 100% { opacity: 0; transform: translate(var(--x), calc(var(--y) + 120px)) rotate(var(--r)); } }

@media (prefers-reduced-motion: reduce) {
  .re *, .re *::before, .re *::after { animation: none !important; transition: none !important; }
  .re[data-ph="sleeve"] .re-mag { transform: none; }
}
`
