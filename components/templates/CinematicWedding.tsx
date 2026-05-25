'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import { PortraitRow } from './PortraitRow'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  bg: '#08080F',
  bgMid: '#0E0E17',
  bgSurface: '#141420',
  bgCard: '#1A1A28',
  text: '#F2EEE6',
  textMuted: 'rgba(242,238,230,0.52)',
  textFaint: 'rgba(242,238,230,0.26)',
  gold: '#C9A84C',
  goldMuted: 'rgba(201,168,76,0.6)',
  goldFaint: 'rgba(201,168,76,0.14)',
  goldBorder: 'rgba(201,168,76,0.2)',
  border: 'rgba(255,255,255,0.06)',
}

// ── Stars ─────────────────────────────────────────────────────
interface StarDef { id: number; x: number; y: number; r: number; delay: number; dur: number }

const STARS: StarDef[] = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.5 + 0.4,
  delay: Math.random() * 5,
  dur: 2.5 + Math.random() * 4,
}))

const StarField = memo(function StarField() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2 }}
          animate={{ opacity: [0.08, 0.75, 0.08] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

// ── Film grain ────────────────────────────────────────────────
const FilmGrain = memo(function FilmGrain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        mixBlendMode: 'overlay',
        opacity: 0.8,
        zIndex: 1,
      }}
    />
  )
})

// ── Gold divider ──────────────────────────────────────────────
const GoldDivider = memo(function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      <div className="h-px w-20" style={{ background: `linear-gradient(90deg,transparent,${C.goldMuted})` }} />
      <span className="select-none" style={{ color: C.gold, fontSize: '9px', letterSpacing: '0.5em' }}>✦</span>
      <div className="h-px w-20" style={{ background: `linear-gradient(270deg,transparent,${C.goldMuted})` }} />
    </div>
  )
})

// ── Countdown ─────────────────────────────────────────────────
function useCountdown(dateStr: string, timeStr: string) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    if (!dateStr) return
    const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`)
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dateStr, timeStr])
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// ── Music player ──────────────────────────────────────────────
const MusicButton = memo(function MusicButton({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!src) return
    audioRef.current = new Audio(src)
    audioRef.current.loop = true
    return () => { audioRef.current?.pause(); audioRef.current = null }
  }, [src])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else a.play().then(() => setPlaying(true)).catch(() => {})
  }, [playing])

  return (
    <motion.button
      onClick={toggle}
      className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 md:px-8 py-2.5 select-none"
      style={{ background: C.bgSurface, border: `1px solid ${C.goldBorder}`, color: C.text }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span style={{ color: C.gold }}>
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      <div className="flex items-end gap-[3px] h-4">
        {[4, 7, 10, 7, 4].map((h, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full"
            style={{ background: playing ? C.gold : C.textFaint }}
            animate={playing
              ? { height: [`${h * 0.6}px`, `${h}px`, `${h * 0.6}px`], opacity: [0.6, 1, 0.6] }
              : { height: '3px', opacity: 0.3 }}
            transition={{ duration: 0.55 + i * 0.1, delay: i * 0.08, repeat: playing ? Infinity : 0, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="text-[11px] tracking-[0.18em]" style={{ color: C.textMuted }}>
        {playing ? 'NOW PLAYING' : 'PLAY'}
      </span>
    </motion.button>
  )
})

// ── Helpers ───────────────────────────────────────────────────
function parseList(v?: string): string[] {
  if (!v) return []
  return v.split(/\n|,/).map(s => s.trim()).filter(Boolean)
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.9, delay, ease: BEZIER },
  } as const
}

// ── Cinematic wishes (dark-themed inline) ─────────────────────
function CinematicWishes({ eventId }: { eventId: string }) {
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; message: string }>>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const MAX = 320
  const charsLeft = MAX - message.length

  useEffect(() => {
    if (eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then(r => r.json())
      .then(data => setWishes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [eventId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (eventId === '__preview__') { setSubmitted(true); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      setName('')
      setMessage('')
    } catch {
      setError('Could not send your wish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
      <div className="max-w-xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.38em] mb-4" style={{ color: C.goldMuted }}>
            Leave a Message
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl mb-6" style={{ color: C.text }}>
            Heartfelt Wishes
          </h2>
          <GoldDivider />
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="mb-8 sm:mb-10 rounded-lg sm:rounded-2xl p-5 sm:p-7 sm:p-6 sm:p-9"
          style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5, ease: BEZIER }}
                  className="text-3xl sm:text-4xl md:text-5xl select-none mb-6"
                  style={{ color: C.gold }}
                  aria-hidden
                >
                  ✦
                </motion.div>
                <p className="font-heading text-2xl mb-3" style={{ color: C.text }}>Thank You</p>
                <p className="text-sm mb-7" style={{ color: C.textMuted, lineHeight: 1.8 }}>
                  Your wish has been received with love.<br />
                  It will appear here once approved.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs tracking-[0.12em] transition-opacity hover:opacity-100"
                  style={{ color: C.goldMuted }}
                >
                  Send another wish →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                {[
                  { label: 'Your Name', value: name, onChange: (v: string) => setName(v), placeholder: 'e.g. Anjali & Rahul', type: 'text' },
                ].map(({ label, value, onChange, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      placeholder={placeholder}
                      required
                      className="w-full bg-transparent border-0 border-b py-3 text-sm focus:outline-none transition-all"
                      style={{ color: C.text, borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = C.goldMuted)}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>
                    Your Wish
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, MAX))}
                    placeholder="Write something from the heart…"
                    required
                    rows={4}
                    className="w-full bg-transparent border-0 border-b py-3 text-sm focus:outline-none resize-none transition-all"
                    style={{ color: C.text, borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = C.goldMuted)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div className="flex justify-end mt-1.5">
                    <span className="text-[10px] tabular-nums" style={{ color: charsLeft <= 40 ? C.gold : C.textFaint }}>
                      {charsLeft} left
                    </span>
                  </div>
                </div>
                {error && <p className="text-xs" style={{ color: '#E87070' }}>{error}</p>}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full py-3.5 rounded-xl text-sm tracking-[0.12em] font-medium transition-all disabled:opacity-50"
                  style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}
                >
                  {loading ? 'Sending…' : 'SEND WISH ✦'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                {...fadeUp(i * 0.07)}
                className="rounded-lg sm:rounded-2xl px-7 py-7 relative overflow-hidden"
                style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}
              >
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.goldMuted} 50%,transparent 85%)` }} />
                <div className="font-heading select-none mb-2 leading-none" style={{ fontSize: '3.5rem', color: 'rgba(201,168,76,0.1)', marginTop: '-0.3rem' }} aria-hidden>&ldquo;</div>
                <p className="text-sm italic leading-relaxed mb-5" style={{ color: C.textMuted }}>{wish.message}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0" style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                    {wish.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs tracking-wider" style={{ color: C.goldMuted }}>{wish.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────
interface Props {
  data: Record<string, string>
  eventId?: string
  isPreview?: boolean
}

export default function CinematicWedding({ data, eventId, isPreview = false }: Props) {
  const brideName = data.brideName || 'Emily'
  const groomName = data.groomName || 'James'
  const { date, time, venue, venueAddress, mapsUrl, dressCode, schedule, galleryImages, musicUrl, message } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const gallery = useMemo(() => parseList(galleryImages), [galleryImages])
  const scheduleItems = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)

  const weddingYear = date ? new Date(date + 'T00:00:00').getFullYear() : new Date().getFullYear()

  const details = [
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: formattedTime },
    ...(venue ? [{ label: 'Venue', value: venue, sub: venueAddress }] : []),
    ...(dressCode ? [{ label: 'Dress Code', value: dressCode }] : []),
  ].filter(d => d.value)

  return (
    <div className="relative min-h-screen font-body" style={{ background: C.bg, color: C.text }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className={`relative flex ${isPreview ? 'min-h-[380px] py-12' : 'min-h-screen'} flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 text-center`}>
        <StarField />
        <FilmGrain />

        {/* Letterbox bars */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10" style={{ height: isPreview ? '18px' : 'clamp(36px,7vh,72px)', background: '#000' }} aria-hidden />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10" style={{ height: isPreview ? '18px' : 'clamp(36px,7vh,72px)', background: '#000' }} aria-hidden />

        {/* Ambient bloom */}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 42%, rgba(201,168,76,0.07) 0%, transparent 68%)' }} aria-hidden />

        <div className="relative z-[2] flex flex-col items-center">
          {/* Year */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '1em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.5, delay: 0.2, ease: BEZIER }}
            className="mb-8 text-[10px] uppercase select-none"
            style={{ color: C.goldMuted }}
          >
            Est. {weddingYear}
          </motion.p>

          {/* Music */}
          {musicUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: BEZIER }}
              className="mb-8 sm:mb-10"
            >
              <MusicButton src={musicUrl} />
            </motion.div>
          )}

          <PortraitRow data={data} dark={true} />

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45, ease: BEZIER }}
            className="font-heading"
            style={{ fontSize: isPreview ? '2.2rem' : 'clamp(2rem,9vw,7.5rem)', lineHeight: 1.05, color: C.text, letterSpacing: '0.025em', overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            {brideName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.75, ease: BEZIER }}
            className="select-none my-1"
            style={{ color: C.gold, fontSize: isPreview ? '1.6rem' : 'clamp(2.2rem,7vw,5.5rem)', fontFamily: 'var(--font-cormorant), Georgia, serif' }}
            aria-hidden
          >
            &amp;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.0, ease: BEZIER }}
            className="font-heading"
            style={{ fontSize: isPreview ? '2.2rem' : 'clamp(2rem,9vw,7.5rem)', lineHeight: 1.05, color: C.text, letterSpacing: '0.025em', overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            {groomName}
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.25, ease: BEZIER }}
            className="my-8 w-full"
          >
            <GoldDivider />
          </motion.div>

          {/* Date + venue tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-sm uppercase tracking-[0.42em]"
            style={{ color: C.textMuted }}
          >
            {formattedDate || 'The Wedding Day'}
          </motion.p>
          {venue && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="mt-2 text-xs uppercase tracking-[0.3em]"
              style={{ color: C.textFaint }}
            >
              {venue}
            </motion.p>
          )}
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ opacity: [0, 0.55, 0], y: [0, 10, 0] }}
          transition={{ duration: 2.2, delay: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 z-[2]"
          aria-hidden
        >
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke={C.goldMuted} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v18m0 0l-4-5m4 5l4-5" />
          </svg>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ─────────────────────────────────────────── */}
      {date && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-6' : 'py-12 sm:py-16 md:py-20'}`} style={{ background: C.bgMid }}>
          <div className="max-w-lg mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-8 sm:mb-10" style={{ color: C.goldMuted }}>
              Counting Down to Forever
            </motion.p>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 sm:gap-3'}`}>
              {[
                { v: days, l: 'Days' },
                { v: hours, l: 'Hours' },
                { v: minutes, l: 'Mins' },
                { v: seconds, l: 'Secs' },
              ].map(({ v, l }, i) => (
                <motion.div
                  key={l}
                  {...fadeUp(i * 0.07)}
                  className="rounded-lg sm:rounded-2xl flex flex-col items-center justify-center py-4 sm:py-6 relative overflow-hidden"
                  style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg,transparent 10%,${C.goldBorder} 50%,transparent 90%)` }} />
                  <span className="font-heading tabular-nums" style={{ fontSize: isPreview ? '1.3rem' : 'clamp(1.6rem,5vw,2.6rem)', color: C.text, lineHeight: 1 }}>
                    {String(v).padStart(2, '0')}
                  </span>
                  <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em]" style={{ color: C.textFaint }}>{l}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DETAILS ──────────────────────────────────────────── */}
      {details.length > 0 && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-6' : 'py-12 sm:py-16 md:py-20'}`} style={{ background: C.bg }}>
          <div className="max-w-2xl mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>
              The Details
            </motion.p>
            <motion.h2 {...fadeUp(0.08)} className={`font-heading text-center ${isPreview ? 'text-lg mb-5' : 'text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12'}`} style={{ color: C.text }}>
              Your Presence is Requested
            </motion.h2>

            <div className={`grid gap-2 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 sm:gap-4'}`}>
              {details.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  {...fadeUp(i * 0.07)}
                  className={`relative overflow-hidden ${isPreview ? 'rounded-lg p-3' : 'rounded-lg sm:rounded-2xl p-4 sm:p-6'}`}
                  style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}
                >
                  <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.goldBorder} 50%,transparent 85%)` }} />
                  <p className="text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: C.goldMuted }}>{detail.label}</p>
                  <p className="text-base font-medium leading-snug" style={{ color: C.text }}>{detail.value}</p>
                  {'sub' in detail && detail.sub && (
                    <p className="mt-1 text-sm" style={{ color: C.textMuted }}>{detail.sub as string}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {mapsUrl && (
              <motion.div {...fadeUp(0.32)} className="mt-8 text-center">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full px-4 sm:px-6 md:px-8 py-3 text-sm tracking-[0.12em] transition-all"
                  style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  VIEW ON MAP
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── SCHEDULE ─────────────────────────────────────────── */}
      {scheduleItems.length > 0 && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8 sm:py-10' : 'py-12 sm:py-16 md:py-20'}`} style={{ background: C.bgMid }}>
          <div className="max-w-md mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>
              The Programme
            </motion.p>
            <motion.h2 {...fadeUp(0.07)} className="font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-12" style={{ color: C.text }}>
              Sequence of Events
            </motion.h2>

            <div className="relative pl-5 sm:pl-7">
              <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${C.goldBorder} 20%,${C.goldBorder} 80%,transparent)` }} />
              <div className="space-y-7">
                {scheduleItems.map((item, i) => {
                  const parts = item.split(/[-–—]/).map(s => s.trim())
                  const timePart = parts.length > 1 ? parts[0] : null
                  const desc = parts.length > 1 ? parts.slice(1).join(' ') : item
                  return (
                    <motion.div key={i} {...fadeUp(i * 0.07)} className="relative">
                      <div className="absolute -left-[1.75rem] top-1.5 w-3 h-3 rounded-full" style={{ background: C.bg, border: `1.5px solid ${C.gold}` }} />
                      {timePart && (
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-0.5" style={{ color: C.goldMuted }}>{timePart}</p>
                      )}
                      <p className="text-sm leading-relaxed" style={{ color: C.text }}>{desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ──────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 overflow-hidden" style={{ background: C.bg }}>
          <motion.p {...fadeUp()} className="px-4 sm:px-6 md:px-8 text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>
            Captured Moments
          </motion.p>
          <motion.h2 {...fadeUp(0.07)} className="px-4 sm:px-6 md:px-8 font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-10" style={{ color: C.text }}>
            Our Story in Frames
          </motion.h2>

          {/* Filmstrip scroll */}
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {gallery.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: BEZIER }}
                className="shrink-0 overflow-hidden rounded-xl"
                style={{
                  width: i % 3 === 0 ? 240 : 190,
                  height: i % 3 === 0 ? 320 : 252,
                  border: `1px solid ${C.goldBorder}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Memory ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── MESSAGE ──────────────────────────────────────────── */}
      {message && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8 sm:py-10' : 'py-12 sm:py-18 md:py-24'}`} style={{ background: C.bgMid }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp()}>
              <div className="font-heading select-none mb-1 leading-none" style={{ fontSize: '6rem', color: 'rgba(201,168,76,0.09)', marginTop: '-1.5rem' }} aria-hidden>&ldquo;</div>
              <p className="font-heading text-xl sm:text-2xl italic leading-relaxed" style={{ color: C.textMuted }}>
                {message}
              </p>
              <p className="mt-7 text-sm uppercase tracking-[0.32em]" style={{ color: C.goldMuted }}>
                — {brideName} &amp; {groomName}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── WISHES ───────────────────────────────────────────── */}
      {eventId && <CinematicWishes eventId={eventId} />}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="px-4 sm:px-6 md:px-8 py-12 text-center" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <GoldDivider className="mb-7" />
        <p className="text-xs uppercase tracking-[0.38em]" style={{ color: C.textFaint }}>
          {brideName} &amp; {groomName}
        </p>
        {formattedDate && (
          <p className="mt-1.5 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(242,238,230,0.18)' }}>{formattedDate}</p>
        )}
        <p className="mt-5 text-[10px] tracking-[0.22em]" style={{ color: 'rgba(242,238,230,0.12)' }}>
          Made with ShareInvite
        </p>
      </footer>
    </div>
  )
}
