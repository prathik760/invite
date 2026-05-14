'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  bg: '#07000A',
  bgMid: '#0F0210',
  bgCard: '#180518',
  bgSurface: '#1D071D',
  text: '#FAF0E6',
  textMuted: 'rgba(250,240,230,0.55)',
  textFaint: 'rgba(250,240,230,0.28)',
  gold: '#D4A017',
  goldMuted: 'rgba(212,160,23,0.65)',
  goldFaint: 'rgba(212,160,23,0.12)',
  goldBorder: 'rgba(212,160,23,0.22)',
  crimson: '#C41E3A',
  crimsonMuted: 'rgba(196,30,58,0.55)',
  crimsonFaint: 'rgba(196,30,58,0.12)',
  crimsonBorder: 'rgba(196,30,58,0.25)',
  border: 'rgba(255,255,255,0.06)',
}

// ── Petal particles ───────────────────────────────────────────
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 12,
  dur: 10 + Math.random() * 10,
  drift: (Math.random() - 0.5) * 80,
  rotate: Math.random() * 360,
  size: 8 + Math.random() * 8,
  color: i % 3 === 0 ? C.crimson : i % 3 === 1 ? C.gold : '#FF6B8A',
}))

const FloatingPetals = memo(function FloatingPetals() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, bottom: -20, fontSize: p.size, color: p.color }}
          animate={{ y: -900, x: [0, p.drift, p.drift * 0.5, -p.drift * 0.3, 0], rotate: [p.rotate, p.rotate + 180, p.rotate + 360], opacity: [0, 0.7, 0.5, 0.2, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          ✿
        </motion.div>
      ))}
    </div>
  )
})

// ── Mandala rings ─────────────────────────────────────────────
const MandalaRings = memo(function MandalaRings({ isPreview }: { isPreview: boolean }) {
  const sizes = isPreview ? ['280px', '200px', '128px', '70px'] : ['640px', '480px', '340px', '210px', '110px']
  return (
    <>
      {sizes.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: s, height: s, border: `1px solid rgba(212,160,23,${0.14 - i * 0.025})` }}
          aria-hidden
        />
      ))}
      {/* Corner ornaments */}
      {!isPreview && [0, 1, 2, 3].map((i) => (
        <div
          key={`orn-${i}`}
          className="pointer-events-none absolute text-[10px] select-none"
          style={{
            color: C.goldMuted,
            top: i < 2 ? '2rem' : undefined,
            bottom: i >= 2 ? '2rem' : undefined,
            left: i % 2 === 0 ? '2rem' : undefined,
            right: i % 2 === 1 ? '2rem' : undefined,
            letterSpacing: '0.3em',
          }}
          aria-hidden
        >
          ✦ ✦ ✦
        </div>
      ))}
    </>
  )
})

// ── Film grain ────────────────────────────────────────────────
const FilmGrain = memo(function FilmGrain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        mixBlendMode: 'overlay',
        opacity: 0.6,
        zIndex: 1,
      }}
    />
  )
})

// ── Divider ───────────────────────────────────────────────────
const SpiceDivider = memo(function SpiceDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      <div className="h-px w-16" style={{ background: `linear-gradient(90deg,transparent,${C.crimsonMuted})` }} />
      <span className="select-none text-[10px] tracking-[0.5em]" style={{ color: C.gold }}>✦</span>
      <div className="h-px w-8" style={{ background: `linear-gradient(90deg,${C.crimsonMuted},${C.goldMuted})` }} />
      <span className="select-none text-[8px]" style={{ color: C.crimson }}>❋</span>
      <div className="h-px w-8" style={{ background: `linear-gradient(270deg,${C.crimsonMuted},${C.goldMuted})` }} />
      <span className="select-none text-[10px] tracking-[0.5em]" style={{ color: C.gold }}>✦</span>
      <div className="h-px w-16" style={{ background: `linear-gradient(270deg,transparent,${C.crimsonMuted})` }} />
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

// ── Music ─────────────────────────────────────────────────────
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
    <motion.button onClick={toggle} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 md:px-8 py-2.5"
      style={{ background: C.bgSurface, border: `1px solid ${C.goldBorder}`, color: C.text }}>
      <span style={{ color: C.gold }}>
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
        )}
      </span>
      <div className="flex items-end gap-[3px] h-4">
        {[4, 7, 10, 7, 4].map((h, i) => (
          <motion.div key={i} className="w-[3px] rounded-full"
            style={{ background: playing ? C.gold : C.textFaint }}
            animate={playing ? { height: [`${h * 0.6}px`, `${h}px`, `${h * 0.6}px`] } : { height: '3px' }}
            transition={{ duration: 0.55 + i * 0.1, delay: i * 0.08, repeat: playing ? Infinity : 0, ease: 'easeInOut' }} />
        ))}
      </div>
      <span className="text-[11px] tracking-[0.18em]" style={{ color: C.textMuted }}>{playing ? 'NOW PLAYING' : 'PLAY'}</span>
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

// ── Wishes ────────────────────────────────────────────────────
function WeddingWishes({ eventId }: { eventId: string }) {
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; message: string }>>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const MAX = 320

  useEffect(() => {
    if (eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then(r => r.json())
      .then(d => setWishes(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [eventId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (eventId === '__preview__') { setSubmitted(true); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true); setName(''); setMessage('')
    } catch { setError('Could not send your wish. Please try again.') }
    finally { setLoading(false) }
  }

  const inputStyle = { color: C.text, borderBottom: `1px solid rgba(255,255,255,0.1)`, background: 'transparent' }
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = C.goldMuted }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)' }

  return (
    <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
      <div className="max-w-xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.38em] mb-4" style={{ color: C.goldMuted }}>Ashirwad</p>
          <h2 className="font-heading text-3xl sm:text-4xl mb-6" style={{ color: C.text }}>Bless the Couple</h2>
          <SpiceDivider />
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mb-8 sm:mb-10 rounded-lg sm:rounded-2xl p-5 sm:p-7 sm:p-6 sm:p-9" style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5, ease: BEZIER }} className="text-3xl sm:text-4xl md:text-5xl select-none mb-6" style={{ color: C.gold }}>✦</motion.div>
                <p className="font-heading text-2xl mb-3" style={{ color: C.text }}>Dhanyawad!</p>
                <p className="text-sm mb-7" style={{ color: C.textMuted, lineHeight: 1.8 }}>Your blessings have been received with love.<br />They will appear here for all to see.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs tracking-[0.12em] transition-opacity hover:opacity-100" style={{ color: C.goldMuted }}>Send another blessing →</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sharma Ji" required className="w-full border-0 border-b py-3 text-sm focus:outline-none" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>Your Blessing</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, MAX))} placeholder="Write something from the heart…" required rows={4} className="w-full border-0 border-b py-3 text-sm focus:outline-none resize-none" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  <div className="flex justify-end mt-1.5">
                    <span className="text-[10px] tabular-nums" style={{ color: MAX - message.length <= 40 ? C.gold : C.textFaint }}>{MAX - message.length} left</span>
                  </div>
                </div>
                {error && <p className="text-xs" style={{ color: '#E87070' }}>{error}</p>}
                <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full py-3.5 rounded-xl text-sm tracking-[0.12em] font-medium disabled:opacity-50"
                  style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                  {loading ? 'Sending…' : 'SEND BLESSINGS ✦'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div key={wish.id} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl px-7 py-7 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.goldMuted} 50%,transparent 85%)` }} />
                <div className="font-heading select-none mb-2 leading-none" style={{ fontSize: '3.5rem', color: 'rgba(212,160,23,0.1)' }} aria-hidden>&ldquo;</div>
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

// ── Main ──────────────────────────────────────────────────────
interface Props { data: Record<string, string>; eventId?: string; isPreview?: boolean }

export default function IndianWedding({ data, eventId, isPreview = false }: Props) {
  const brideName = data.brideName || 'Priya'
  const groomName = data.groomName || 'Arjun'
  const { date, time, venue, venueAddress, mapsUrl, dressCode, schedule, galleryImages, musicUrl, message } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const gallery = useMemo(() => parseList(galleryImages), [galleryImages])
  const scheduleItems = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)

  const details = [
    { label: 'Vivah Tithi', value: formattedDate },
    { label: 'Muhurat', value: formattedTime },
    ...(venue ? [{ label: 'Vivah Sthal', value: venue, sub: venueAddress }] : []),
    ...(dressCode ? [{ label: 'Dress Code', value: dressCode }] : []),
  ].filter(d => d.value)

  return (
    <div className="relative min-h-screen font-body" style={{ background: C.bg, color: C.text }}>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className={`relative flex ${isPreview ? 'min-h-[380px] py-12' : 'min-h-screen'} flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 text-center`}>
        <FilmGrain />
        <MandalaRings isPreview={isPreview} />
        {!isPreview && <FloatingPetals />}

        {/* Ambient blooms */}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(196,30,58,0.1) 0%, transparent 65%)' }} aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 55%, rgba(212,160,23,0.06) 0%, transparent 70%)' }} aria-hidden />

        <div className="relative z-[2] flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '1.5em' }} animate={{ opacity: 1, letterSpacing: '0.55em' }}
            transition={{ duration: 1.6, delay: 0.1, ease: BEZIER }}
            className="mb-6 text-[10px] uppercase select-none" style={{ color: C.goldMuted }}>
            ॐ श्री गणेशाय नमः
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: BEZIER }} className="mb-7 w-full">
            <SpiceDivider />
          </motion.div>

          {musicUrl && !isPreview && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: BEZIER }} className="mb-8 sm:mb-10">
              <MusicButton src={musicUrl} />
            </motion.div>
          )}

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: BEZIER }}
            className="text-[11px] uppercase tracking-[0.38em] mb-6 select-none" style={{ color: C.crimsonMuted }}>
            Shubh Vivah
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: BEZIER }}
            className="font-heading" style={{ fontSize: isPreview ? '2.2rem' : 'clamp(2rem,9vw,7rem)', lineHeight: 1.05, color: C.text, textShadow: '0 0 60px rgba(196,30,58,0.3)', letterSpacing: '0.025em', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {brideName}
          </motion.h1>

          <motion.p initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.75, ease: BEZIER }}
            className="select-none my-2 font-heading" style={{ fontSize: isPreview ? '1.5rem' : 'clamp(2rem,6vw,4.5rem)', color: C.crimson }}>
            &amp;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.95, ease: BEZIER }}
            className="font-heading" style={{ fontSize: isPreview ? '2.2rem' : 'clamp(2rem,9vw,7rem)', lineHeight: 1.05, color: C.text, textShadow: '0 0 60px rgba(196,30,58,0.3)', letterSpacing: '0.025em', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {groomName}
          </motion.h1>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 1.2, ease: BEZIER }} className="my-8 w-full">
            <SpiceDivider />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.35 }}
            className="text-sm uppercase tracking-[0.42em]" style={{ color: C.textMuted }}>
            {formattedDate || 'The Auspicious Day'}
          </motion.p>
          {venue && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
              className="mt-2 text-xs uppercase tracking-[0.3em]" style={{ color: C.textFaint }}>
              {venue}
            </motion.p>
          )}
        </div>

        <motion.div animate={{ opacity: [0, 0.5, 0], y: [0, 10, 0] }} transition={{ duration: 2.2, delay: 2.5, repeat: Infinity }} className="absolute bottom-24 z-[2]" aria-hidden>
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
              Shubh Muhurat Countdown
            </motion.p>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 sm:gap-3'}`}>
              {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: minutes, l: 'Mins' }, { v: seconds, l: 'Secs' }].map(({ v, l }, i) => (
                <motion.div key={l} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl flex flex-col items-center justify-center py-4 sm:py-6 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.crimsonBorder}` }}>
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg,transparent 10%,${C.crimsonBorder} 50%,transparent 90%)` }} />
                  <span className="font-heading tabular-nums" style={{ fontSize: isPreview ? '1.3rem' : 'clamp(1.6rem,5vw,2.6rem)', color: C.text, lineHeight: 1 }}>{String(v).padStart(2, '0')}</span>
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
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Vivah Vivaran</motion.p>
            <motion.h2 {...fadeUp(0.08)} className={`font-heading text-center ${isPreview ? 'text-lg mb-5' : 'text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12'}`} style={{ color: C.text }}>Event Details</motion.h2>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 sm:gap-4'}`}>
              {details.map((detail, i) => (
                <motion.div key={detail.label} {...fadeUp(i * 0.07)} className={`relative overflow-hidden ${isPreview ? 'rounded-lg p-3' : 'rounded-lg sm:rounded-2xl p-4 sm:p-6'}`} style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}>
                  <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.crimsonMuted} 50%,transparent 85%)` }} />
                  <p className="text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: C.goldMuted }}>{detail.label}</p>
                  <p className="text-base font-medium leading-snug" style={{ color: C.text }}>{detail.value}</p>
                  {'sub' in detail && detail.sub && <p className="mt-1 text-sm" style={{ color: C.textMuted }}>{detail.sub as string}</p>}
                </motion.div>
              ))}
            </div>
            {mapsUrl && (
              <motion.div {...fadeUp(0.32)} className="mt-8 text-center">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full px-4 sm:px-6 md:px-8 py-3 text-sm tracking-[0.12em]" style={{ background: C.crimsonFaint, border: `1px solid ${C.crimsonBorder}`, color: C.crimson }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  VIEW ON MAP
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── SCHEDULE ─────────────────────────────────────────── */}
      {scheduleItems.length > 0 && (
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20" style={{ background: C.bgMid }}>
          <div className="max-w-md mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Rasam</motion.p>
            <motion.h2 {...fadeUp(0.07)} className="font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-12" style={{ color: C.text }}>Ceremony Programme</motion.h2>
            <div className="relative pl-5 sm:pl-7">
              <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${C.crimsonBorder} 20%,${C.crimsonBorder} 80%,transparent)` }} />
              <div className="space-y-7">
                {scheduleItems.map((item, i) => {
                  const parts = item.split(/[-–—]/).map(s => s.trim())
                  const timePart = parts.length > 1 ? parts[0] : null
                  const desc = parts.length > 1 ? parts.slice(1).join(' ') : item
                  return (
                    <motion.div key={i} {...fadeUp(i * 0.07)} className="relative">
                      <div className="absolute -left-[1.75rem] top-1.5 w-3 h-3 rounded-full" style={{ background: C.bg, border: `1.5px solid ${C.crimson}` }} />
                      {timePart && <p className="text-[10px] uppercase tracking-[0.22em] mb-0.5" style={{ color: C.goldMuted }}>{timePart}</p>}
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
          <motion.p {...fadeUp()} className="px-4 sm:px-6 md:px-8 text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Yadein</motion.p>
          <motion.h2 {...fadeUp(0.07)} className="px-4 sm:px-6 md:px-8 font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-10" style={{ color: C.text }}>Our Story</motion.h2>
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {gallery.map((src, i) => (
              <motion.div key={`${src}-${i}`} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }} transition={{ duration: 0.7, delay: i * 0.06, ease: BEZIER }}
                className="shrink-0 overflow-hidden rounded-xl" style={{ width: i % 3 === 0 ? 240 : 190, height: i % 3 === 0 ? 320 : 252, border: `1px solid ${C.crimsonBorder}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Memory ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── MESSAGE ──────────────────────────────────────────── */}
      {message && (
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp()}>
              <div className="font-heading select-none mb-1 leading-none" style={{ fontSize: '6rem', color: 'rgba(212,160,23,0.09)' }} aria-hidden>&ldquo;</div>
              <p className="font-heading text-xl sm:text-2xl italic leading-relaxed" style={{ color: C.textMuted }}>{message}</p>
              <p className="mt-7 text-sm uppercase tracking-[0.32em]" style={{ color: C.goldMuted }}>— {brideName} &amp; {groomName}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── WISHES ───────────────────────────────────────────── */}
      {eventId && <WeddingWishes eventId={eventId} />}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="px-4 sm:px-6 md:px-8 py-12 text-center" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <SpiceDivider className="mb-7" />
        <p className="text-xs uppercase tracking-[0.38em]" style={{ color: C.textFaint }}>{brideName} &amp; {groomName}</p>
        {formattedDate && <p className="mt-1.5 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(250,240,230,0.18)' }}>{formattedDate}</p>}
        <p className="mt-5 text-[10px] tracking-[0.22em]" style={{ color: 'rgba(250,240,230,0.12)' }}>Made with Invitely</p>
      </footer>
    </div>
  )
}
