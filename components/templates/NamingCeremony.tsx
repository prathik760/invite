'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  bg: '#030510',
  bgMid: '#060A18',
  bgCard: '#0A1025',
  bgSurface: '#0E1530',
  text: '#F0F8FF',
  textMuted: 'rgba(240,248,255,0.55)',
  textFaint: 'rgba(240,248,255,0.28)',
  blue: '#4FC3F7',
  blueMuted: 'rgba(79,195,247,0.55)',
  blueFaint: 'rgba(79,195,247,0.1)',
  blueBorder: 'rgba(79,195,247,0.2)',
  pink: '#F48FB1',
  pinkMuted: 'rgba(244,143,177,0.55)',
  pinkFaint: 'rgba(244,143,177,0.1)',
  pinkBorder: 'rgba(244,143,177,0.22)',
  gold: '#FFD54F',
  goldMuted: 'rgba(255,213,79,0.6)',
  goldFaint: 'rgba(255,213,79,0.1)',
  goldBorder: 'rgba(255,213,79,0.2)',
  border: 'rgba(255,255,255,0.06)',
}

// ── Soft star field ───────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  r: Math.random() * 1.2 + 0.3, delay: Math.random() * 6, dur: 2.5 + Math.random() * 4,
  color: i % 4 === 0 ? C.gold : i % 4 === 1 ? C.blue : i % 4 === 2 ? C.pink : '#FFFFFF',
}))

const SoftStars = memo(function SoftStars() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STARS.map((s) => (
        <motion.div key={s.id} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, background: s.color }}
          animate={{ opacity: [0.04, 0.6, 0.04] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  )
})

// ── Floating soft dots (like baby bubbles) ────────────────────
const BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  id: i, x: 5 + Math.random() * 90, delay: Math.random() * 12, dur: 12 + Math.random() * 8,
  drift: (Math.random() - 0.5) * 50, size: 4 + Math.random() * 6,
  color: i % 2 === 0 ? C.blue : C.pink,
}))

const FloatingBubbles = memo(function FloatingBubbles() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BUBBLES.map((b) => (
        <motion.div key={b.id} className="absolute rounded-full"
          style={{ left: `${b.x}%`, bottom: -20, width: b.size, height: b.size, background: b.color, opacity: 0 }}
          animate={{ y: -800, x: [0, b.drift, b.drift * 0.4, -b.drift * 0.3, 0], opacity: [0, 0.45, 0.3, 0.1, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </div>
  )
})

const FilmGrain = memo(function FilmGrain() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.025'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '200px', mixBlendMode: 'overlay', opacity: 0.5, zIndex: 1,
    }} />
  )
})

const LotusIcon = memo(function LotusIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path d="M24 38 C24 38 12 30 12 20 C12 14 17 10 24 10 C31 10 36 14 36 20 C36 30 24 38 24 38Z" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M24 38 C24 38 16 28 24 20 C32 28 24 38 24 38Z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.15" />
      <path d="M8 28 C8 28 4 20 10 15 C14 12 18 14 20 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M40 28 C40 28 44 20 38 15 C34 12 30 14 28 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
})

const PureDivider = memo(function PureDivider({ className = '', gender = 'Boy' }: { className?: string; gender?: string }) {
  const accent = gender === 'Girl' ? C.pink : C.blue
  const accentMuted = gender === 'Girl' ? C.pinkMuted : C.blueMuted
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      <div className="h-px w-14" style={{ background: `linear-gradient(90deg,transparent,${accentMuted})` }} />
      <span className="select-none text-[10px]" style={{ color: C.gold }}>✦</span>
      <div className="h-px w-7" style={{ background: `linear-gradient(90deg,${accentMuted},${C.goldMuted})` }} />
      <span className="select-none text-[9px]" style={{ color: accent }}>❋</span>
      <div className="h-px w-7" style={{ background: `linear-gradient(270deg,${accentMuted},${C.goldMuted})` }} />
      <span className="select-none text-[10px]" style={{ color: C.gold }}>✦</span>
      <div className="h-px w-14" style={{ background: `linear-gradient(270deg,transparent,${accentMuted})` }} />
    </div>
  )
})

function useCountdown(dateStr: string, timeStr: string) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    if (!dateStr) return
    const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`)
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [dateStr, timeStr])
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) }
}

function parseList(v?: string): string[] {
  if (!v) return []
  return v.split(/\n|,/).map(s => s.trim()).filter(Boolean)
}

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.9, delay, ease: BEZIER } } as const
}

function NamingWishes({ eventId, gender }: { eventId: string; gender?: string }) {
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; message: string }>>([])
  const [name, setName] = useState(''); const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const MAX = 320
  const accent = gender === 'Girl' ? C.pink : C.blue
  const accentMuted = gender === 'Girl' ? C.pinkMuted : C.blueMuted
  const accentFaint = gender === 'Girl' ? C.pinkFaint : C.blueFaint
  const accentBorder = gender === 'Girl' ? C.pinkBorder : C.blueBorder

  useEffect(() => {
    if (eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`).then(r => r.json()).then(d => setWishes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [eventId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !message.trim()) return
    if (eventId === '__preview__') { setSubmitted(true); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/wishes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }) })
      if (!res.ok) throw new Error()
      setSubmitted(true); setName(''); setMessage('')
    } catch { setError('Could not send your blessing. Please try again.') } finally { setLoading(false) }
  }

  const is = { color: C.text, borderBottom: `1px solid rgba(255,255,255,0.1)`, background: 'transparent' }
  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = accentMuted }
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)' }

  return (
    <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
      <div className="max-w-xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.38em] mb-4" style={{ color: C.goldMuted }}>Shishu Ashirwad</p>
          <h2 className="font-heading text-3xl sm:text-4xl mb-6" style={{ color: C.text }}>Bless the Little One</h2>
          <PureDivider gender={gender} />
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="mb-8 sm:mb-10 rounded-lg sm:rounded-2xl p-5 sm:p-7 sm:p-6 sm:p-9" style={{ background: C.bgCard, border: `1px solid ${accentBorder}` }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5, ease: BEZIER }} className="text-3xl sm:text-4xl md:text-3xl sm:text-4xl md:text-5xl select-none mb-6">🌸</motion.div>
                <p className="font-heading text-2xl mb-3" style={{ color: C.text }}>Aabhar!</p>
                <p className="text-sm mb-7" style={{ color: C.textMuted, lineHeight: 1.8 }}>Your blessings have been received.<br />The little one is grateful for your love.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs tracking-[0.12em]" style={{ color: C.goldMuted }}>Send another blessing →</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full border-0 border-b py-3 text-sm focus:outline-none" style={is} onFocus={fo} onBlur={bl} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: C.textMuted }}>Your Blessing</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, MAX))} placeholder="Write a blessing for the little one…" required rows={4} className="w-full border-0 border-b py-3 text-sm focus:outline-none resize-none" style={is} onFocus={fo} onBlur={bl} />
                  <div className="flex justify-end mt-1.5"><span className="text-[10px] tabular-nums" style={{ color: MAX - message.length <= 40 ? accent : C.textFaint }}>{MAX - message.length} left</span></div>
                </div>
                {error && <p className="text-xs" style={{ color: '#E87070' }}>{error}</p>}
                <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full py-3.5 rounded-xl text-sm tracking-[0.12em] font-medium disabled:opacity-50"
                  style={{ background: accentFaint, border: `1px solid ${accentBorder}`, color: accent }}>
                  {loading ? 'Sending…' : 'BLESS THE LITTLE ONE 🌸'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div key={wish.id} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl px-7 py-7 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${accentBorder}` }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${accentMuted} 50%,transparent 85%)` }} />
                <div className="font-heading select-none mb-2 leading-none" style={{ fontSize: '3.5rem', color: 'rgba(255,213,79,0.1)' }} aria-hidden>&ldquo;</div>
                <p className="text-sm italic leading-relaxed mb-5" style={{ color: C.textMuted }}>{wish.message}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0" style={{ background: accentFaint, border: `1px solid ${accentBorder}`, color: accent }}>{wish.name.charAt(0).toUpperCase()}</div>
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

interface Props { data: Record<string, string>; eventId?: string; isPreview?: boolean }

export default function NamingCeremony({ data, eventId, isPreview = false }: Props) {
  const babyName = data.babyName || 'Aarav'
  const parentNames = data.parentNames || 'Anjali & Suresh'
  const gender = data.babyGender || 'Boy'
  const { date, time, venue, venueAddress, mapsUrl, schedule, message } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const scheduleItems = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)

  const accent = gender === 'Girl' ? C.pink : C.blue
  const accentMuted = gender === 'Girl' ? C.pinkMuted : C.blueMuted
  const accentFaint = gender === 'Girl' ? C.pinkFaint : C.blueFaint
  const accentBorder = gender === 'Girl' ? C.pinkBorder : C.blueBorder

  const details = [
    { label: 'Namakaran Tithi', value: formattedDate },
    { label: 'Muhurat', value: formattedTime },
    ...(venue ? [{ label: 'Venue', value: venue, sub: venueAddress }] : []),
  ].filter(d => d.value)

  return (
    <div className="relative min-h-screen font-body" style={{ background: C.bg, color: C.text }}>

      {/* ── HERO ── */}
      <section className={`relative flex ${isPreview ? 'min-h-[360px] py-12' : 'min-h-screen'} flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 text-center`}>
        <FilmGrain />
        <SoftStars />
        {!isPreview && <FloatingBubbles />}

        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${accentFaint.replace('0.1', '0.12')} 0%, transparent 65%)` }} aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 35% at 50% 65%, rgba(255,213,79,0.05) 0%, transparent 70%)' }} aria-hidden />

        {[isPreview ? '240px' : '540px', isPreview ? '165px' : '370px', isPreview ? '100px' : '230px'].map((s, i) => (
          <div key={i} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: s, height: s, border: `1px solid ${accentBorder.replace('0.2', `${0.12 - i * 0.035}`)}` }} aria-hidden />
        ))}

        <div className="relative z-[2] flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: BEZIER }}
            className="mb-5" style={{ color: accent }}>
            <LotusIcon />
          </motion.div>

          <motion.p initial={{ opacity: 0, letterSpacing: '1.5em' }} animate={{ opacity: 1, letterSpacing: '0.5em' }} transition={{ duration: 1.4, delay: 0.3, ease: BEZIER }}
            className="mb-4 text-[10px] uppercase select-none" style={{ color: C.goldMuted }}>
            Namakaran Samaroh
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.7, delay: 0.45, ease: BEZIER }} className="mb-7 w-full">
            <PureDivider gender={gender} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
            className="text-[11px] uppercase tracking-[0.35em] mb-4 select-none" style={{ color: accentMuted }}>
            {gender === 'Girl' ? 'Our Little Princess' : 'Our Little Prince'} is named
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.65, ease: BEZIER }}
            className="font-heading" style={{ fontSize: isPreview ? '2.8rem' : 'clamp(2rem,10vw,8rem)', lineHeight: 1.02, color: C.text, textShadow: `0 0 80px ${accentFaint.replace('0.1', '0.35')}`, letterSpacing: '0.02em', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {babyName}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95 }}
            className="mt-4 text-sm leading-relaxed" style={{ color: C.textMuted }}>
            Blessed by {parentNames}
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 1.2, ease: BEZIER }} className="my-8 w-full">
            <PureDivider gender={gender} />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.35 }}
            className="text-sm uppercase tracking-[0.42em]" style={{ color: C.textMuted }}>
            {formattedDate || 'The Blessed Day'}
          </motion.p>
          {venue && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
              className="mt-2 text-xs uppercase tracking-[0.3em]" style={{ color: C.textFaint }}>{venue}</motion.p>
          )}
        </div>

        <motion.div animate={{ opacity: [0, 0.5, 0], y: [0, 10, 0] }} transition={{ duration: 2.2, delay: 2.5, repeat: Infinity }} className="absolute bottom-24 z-[2]" aria-hidden>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke={C.goldMuted} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 2v18m0 0l-4-5m4 5l4-5" /></svg>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      {date && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-6' : 'py-12 sm:py-16 md:py-20'}`} style={{ background: C.bgMid }}>
          <div className="max-w-lg mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-8 sm:mb-10" style={{ color: C.goldMuted }}>Ceremony Begins In</motion.p>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 sm:gap-3'}`}>
              {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: minutes, l: 'Mins' }, { v: seconds, l: 'Secs' }].map(({ v, l }, i) => (
                <motion.div key={l} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl flex flex-col items-center justify-center py-4 sm:py-6 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${accentBorder}` }}>
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg,transparent 10%,${accentBorder} 50%,transparent 90%)` }} />
                  <span className="font-heading tabular-nums" style={{ fontSize: isPreview ? '1.3rem' : 'clamp(1.6rem,5vw,2.6rem)', color: C.text, lineHeight: 1 }}>{String(v).padStart(2, '0')}</span>
                  <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em]" style={{ color: C.textFaint }}>{l}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DETAILS ── */}
      {details.length > 0 && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-6' : 'py-12 sm:py-16 md:py-20'}`} style={{ background: C.bg }}>
          <div className="max-w-2xl mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Samaroh Vivaran</motion.p>
            <motion.h2 {...fadeUp(0.08)} className={`font-heading text-center ${isPreview ? 'text-lg mb-5' : 'text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12'}`} style={{ color: C.text }}>Ceremony Details</motion.h2>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 sm:gap-4'}`}>
              {details.map((detail, i) => (
                <motion.div key={detail.label} {...fadeUp(i * 0.07)} className={`relative overflow-hidden ${isPreview ? 'rounded-lg p-3' : 'rounded-lg sm:rounded-2xl p-4 sm:p-6'}`} style={{ background: C.bgCard, border: `1px solid ${C.goldBorder}` }}>
                  <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${accentMuted} 50%,transparent 85%)` }} />
                  <p className="text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: C.goldMuted }}>{detail.label}</p>
                  <p className="text-base font-medium leading-snug" style={{ color: C.text }}>{detail.value}</p>
                  {'sub' in detail && detail.sub && <p className="mt-1 text-sm" style={{ color: C.textMuted }}>{detail.sub as string}</p>}
                </motion.div>
              ))}
            </div>
            {mapsUrl && (
              <motion.div {...fadeUp(0.32)} className="mt-8 text-center">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full px-4 sm:px-6 md:px-8 py-3 text-sm tracking-[0.12em]" style={{ background: accentFaint, border: `1px solid ${accentBorder}`, color: accent }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  GET DIRECTIONS
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── SCHEDULE ── */}
      {scheduleItems.length > 0 && (
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20" style={{ background: C.bgMid }}>
          <div className="max-w-md mx-auto">
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Karyakram</motion.p>
            <motion.h2 {...fadeUp(0.07)} className="font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-12" style={{ color: C.text }}>Programme</motion.h2>
            <div className="relative pl-5 sm:pl-7">
              <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${accentBorder} 20%,${accentBorder} 80%,transparent)` }} />
              <div className="space-y-7">
                {scheduleItems.map((item, i) => {
                  const parts = item.split(/[-–—]/).map(s => s.trim())
                  const timePart = parts.length > 1 ? parts[0] : null
                  const desc = parts.length > 1 ? parts.slice(1).join(' ') : item
                  return (
                    <motion.div key={i} {...fadeUp(i * 0.07)} className="relative">
                      <div className="absolute -left-[1.75rem] top-1.5 w-3 h-3 rounded-full" style={{ background: C.bg, border: `1.5px solid ${accent}` }} />
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

      {/* ── MESSAGE ── */}
      {message && (
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bg }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp()}>
              <div className="font-heading select-none mb-1 leading-none" style={{ fontSize: '6rem', color: 'rgba(255,213,79,0.09)' }} aria-hidden>&ldquo;</div>
              <p className="font-heading text-xl sm:text-2xl italic leading-relaxed" style={{ color: C.textMuted }}>{message}</p>
              <p className="mt-7 text-sm uppercase tracking-[0.32em]" style={{ color: C.goldMuted }}>— {parentNames}</p>
            </motion.div>
          </div>
        </section>
      )}

      {eventId && <NamingWishes eventId={eventId} gender={gender} />}

      <footer className="px-4 sm:px-6 md:px-8 py-12 text-center" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <PureDivider gender={gender} className="mb-7" />
        <p className="text-xs uppercase tracking-[0.38em]" style={{ color: C.textFaint }}>{babyName} · {parentNames}</p>
        {formattedDate && <p className="mt-1.5 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(240,248,255,0.18)' }}>{formattedDate}</p>}
        <p className="mt-5 text-[10px] tracking-[0.22em]" style={{ color: 'rgba(240,248,255,0.12)' }}>Made with Invitely</p>
      </footer>
    </div>
  )
}
