'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import { PortraitRow } from './PortraitRow'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  bg: '#080500',
  bgMid: '#100A00',
  bgCard: '#1A1200',
  bgSurface: '#201800',
  text: '#FFF5E6',
  textMuted: 'rgba(255,245,230,0.55)',
  textFaint: 'rgba(255,245,230,0.28)',
  saffron: '#FF8F00',
  saffronMuted: 'rgba(255,143,0,0.6)',
  saffronFaint: 'rgba(255,143,0,0.1)',
  saffronBorder: 'rgba(255,143,0,0.25)',
  terra: '#BF360C',
  terraMuted: 'rgba(191,54,12,0.55)',
  terraFaint: 'rgba(191,54,12,0.1)',
  terraBorder: 'rgba(191,54,12,0.25)',
  gold: '#FFD54F',
  goldMuted: 'rgba(255,213,79,0.6)',
  goldFaint: 'rgba(255,213,79,0.1)',
  goldBorder: 'rgba(255,213,79,0.2)',
  border: 'rgba(255,255,255,0.06)',
}

// ── Diya flames rising ────────────────────────────────────────
const DIYAS = Array.from({ length: 12 }, (_, i) => ({
  id: i, x: 5 + Math.random() * 90, delay: Math.random() * 10, dur: 10 + Math.random() * 8,
  drift: (Math.random() - 0.5) * 40,
}))

const FloatingDiyas = memo(function FloatingDiyas() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {DIYAS.map((d) => (
        <motion.div key={d.id} className="absolute select-none" style={{ left: `${d.x}%`, bottom: -20, fontSize: '14px' }}
          animate={{ y: -700, x: [0, d.drift, d.drift * 0.4, -d.drift * 0.3, 0], opacity: [0, 0.85, 0.6, 0.2, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeOut' }}>
          🪔
        </motion.div>
      ))}
    </div>
  )
})

// ── Rangoli dots pattern ──────────────────────────────────────
const RangoliPattern = memo(function RangoliPattern({ isPreview }: { isPreview: boolean }) {
  const count = isPreview ? 8 : 16
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360
        const r = isPreview ? 130 : 280
        const x = 50 + r * Math.cos((angle * Math.PI) / 180) / (isPreview ? 1.6 : 4)
        const y = 50 + r * Math.sin((angle * Math.PI) / 180) / (isPreview ? 2.4 : 6)
        return (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
            style={{ left: `${x}%`, top: `${y}%`, background: i % 3 === 0 ? C.saffron : i % 3 === 1 ? C.terra : C.gold, opacity: 0.3 }}
            animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.5 + (i % 4) * 0.5, delay: (i * 0.3) % 3, repeat: Infinity, ease: 'easeInOut' }} />
        )
      })}
    </div>
  )
})

const FilmGrain = memo(function FilmGrain() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.025'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '200px', mixBlendMode: 'overlay', opacity: 0.6, zIndex: 1,
    }} />
  )
})

const DiyaDivider = memo(function DiyaDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      <div className="h-px w-14" style={{ background: `linear-gradient(90deg,transparent,${C.saffronMuted})` }} />
      <span className="select-none text-[11px]" style={{ color: C.terra }}>✿</span>
      <div className="h-px w-7" style={{ background: `linear-gradient(90deg,${C.saffronMuted},${C.goldMuted})` }} />
      <span className="select-none text-[9px]" style={{ color: C.gold }}>🪔</span>
      <div className="h-px w-7" style={{ background: `linear-gradient(270deg,${C.saffronMuted},${C.goldMuted})` }} />
      <span className="select-none text-[11px]" style={{ color: C.terra }}>✿</span>
      <div className="h-px w-14" style={{ background: `linear-gradient(270deg,transparent,${C.saffronMuted})` }} />
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

function HouseWarmingWishes({ eventId }: { eventId: string }) {
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; message: string }>>([])
  const [name, setName] = useState(''); const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const MAX = 320

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
  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = C.saffronMuted }
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)' }

  return (
    <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
      <div className="max-w-xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.38em] mb-4" style={{ color: C.goldMuted }}>Griha Ashirwad</p>
          <h2 className="font-heading text-3xl sm:text-4xl mb-6" style={{ color: C.text }}>Bless Our Home</h2>
          <DiyaDivider />
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="mb-8 sm:mb-10 rounded-lg sm:rounded-2xl p-5 sm:p-7 sm:p-6 sm:p-9" style={{ background: C.bgCard, border: `1px solid ${C.saffronBorder}` }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5, ease: BEZIER }} className="text-3xl sm:text-4xl md:text-3xl sm:text-4xl md:text-5xl select-none mb-6">🪔</motion.div>
                <p className="font-heading text-2xl mb-3" style={{ color: C.text }}>Dhanyawad!</p>
                <p className="text-sm mb-7" style={{ color: C.textMuted, lineHeight: 1.8 }}>Your blessings light up our new home.<br />We are grateful for your love.</p>
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
                  <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, MAX))} placeholder="Bless this home with your words…" required rows={4} className="w-full border-0 border-b py-3 text-sm focus:outline-none resize-none" style={is} onFocus={fo} onBlur={bl} />
                  <div className="flex justify-end mt-1.5"><span className="text-[10px] tabular-nums" style={{ color: MAX - message.length <= 40 ? C.saffron : C.textFaint }}>{MAX - message.length} left</span></div>
                </div>
                {error && <p className="text-xs" style={{ color: '#E87070' }}>{error}</p>}
                <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full py-3.5 rounded-xl text-sm tracking-[0.12em] font-medium disabled:opacity-50"
                  style={{ background: C.saffronFaint, border: `1px solid ${C.saffronBorder}`, color: C.saffron }}>
                  {loading ? 'Sending…' : 'BLESS THIS HOME 🪔'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div key={wish.id} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl px-7 py-7 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.saffronBorder}` }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.saffronMuted} 50%,transparent 85%)` }} />
                <div className="font-heading select-none mb-2 leading-none" style={{ fontSize: '3.5rem', color: 'rgba(255,143,0,0.1)' }} aria-hidden>&ldquo;</div>
                <p className="text-sm italic leading-relaxed mb-5" style={{ color: C.textMuted }}>{wish.message}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0" style={{ background: C.saffronFaint, border: `1px solid ${C.saffronBorder}`, color: C.saffron }}>{wish.name.charAt(0).toUpperCase()}</div>
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

export default function HouseWarming({ data, eventId, isPreview = false }: Props) {
  const hostNames = data.hostNames || 'The Sharma Family'
  const { date, time, venue, venueAddress, mapsUrl, pooja, schedule, galleryImages, message } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const gallery = useMemo(() => parseList(galleryImages), [galleryImages])
  const scheduleItems = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)

  const details = [
    { label: 'Shubh Tithi', value: formattedDate },
    { label: 'Muhurat', value: formattedTime },
    ...(venue ? [{ label: 'New Home', value: venue, sub: venueAddress }] : []),
    ...(pooja ? [{ label: 'Pooja Details', value: pooja }] : []),
  ].filter(d => d.value)

  return (
    <div className="relative min-h-screen font-body" style={{ background: C.bg, color: C.text }}>

      {/* ── HERO ── */}
      <section className={`relative flex ${isPreview ? 'min-h-[360px] py-12' : 'min-h-screen'} flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 text-center`}>
        <FilmGrain />
        <RangoliPattern isPreview={isPreview} />
        {!isPreview && <FloatingDiyas />}

        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,143,0,0.1) 0%, transparent 65%)' }} aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 35% at 50% 60%, rgba(191,54,12,0.07) 0%, transparent 70%)' }} aria-hidden />

        {[isPreview ? '260px' : '580px', isPreview ? '180px' : '400px', isPreview ? '110px' : '250px'].map((s, i) => (
          <div key={i} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: s, height: s, border: `1px solid rgba(255,143,0,${0.13 - i * 0.035})` }} aria-hidden />
        ))}

        <div className="relative z-[2] flex flex-col items-center">
          <motion.p initial={{ opacity: 0, letterSpacing: '1.5em' }} animate={{ opacity: 1, letterSpacing: '0.5em' }} transition={{ duration: 1.4, delay: 0.1, ease: BEZIER }}
            className="mb-5 text-[10px] uppercase select-none" style={{ color: C.goldMuted }}>
            ॐ गं गणपतये नमः
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.7, delay: 0.3, ease: BEZIER }} className="mb-7 w-full">
            <DiyaDivider />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="text-[11px] uppercase tracking-[0.35em] mb-5 select-none" style={{ color: C.saffronMuted }}>
            Griha Pravesh Samaroh
          </motion.p>

          <PortraitRow data={data} dark={true} />

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.55, ease: BEZIER }}
            className="font-heading" style={{ fontSize: isPreview ? '2rem' : 'clamp(1.9rem,8vw,6rem)', lineHeight: 1.1, color: C.text, textShadow: '0 0 70px rgba(255,143,0,0.2)', letterSpacing: '0.02em', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {hostNames}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-4 text-sm italic leading-relaxed max-w-sm" style={{ color: C.textMuted }}>
            invite you to grace our new home with your divine presence &amp; blessings
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 1.1, ease: BEZIER }} className="my-8 w-full">
            <DiyaDivider />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.25 }}
            className="text-sm uppercase tracking-[0.42em]" style={{ color: C.textMuted }}>
            {formattedDate || 'The Auspicious Day'}
          </motion.p>
          {venue && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }}
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
            <motion.p {...fadeUp()} className="text-center text-[11px] uppercase tracking-[0.38em] mb-8 sm:mb-10" style={{ color: C.goldMuted }}>Shubh Muhurat In</motion.p>
            <div className={`grid gap-2 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 sm:gap-3'}`}>
              {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: minutes, l: 'Mins' }, { v: seconds, l: 'Secs' }].map(({ v, l }, i) => (
                <motion.div key={l} {...fadeUp(i * 0.07)} className="rounded-lg sm:rounded-2xl flex flex-col items-center justify-center py-4 sm:py-6 relative overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.saffronBorder}` }}>
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg,transparent 10%,${C.saffronBorder} 50%,transparent 90%)` }} />
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
                  <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 15%,${C.saffronMuted} 50%,transparent 85%)` }} />
                  <p className="text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: C.goldMuted }}>{detail.label}</p>
                  <p className="text-base font-medium leading-snug" style={{ color: C.text }}>{detail.value}</p>
                  {'sub' in detail && detail.sub && <p className="mt-1 text-sm" style={{ color: C.textMuted }}>{detail.sub as string}</p>}
                </motion.div>
              ))}
            </div>
            {mapsUrl && (
              <motion.div {...fadeUp(0.32)} className="mt-8 text-center">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full px-4 sm:px-6 md:px-8 py-3 text-sm tracking-[0.12em]" style={{ background: C.saffronFaint, border: `1px solid ${C.saffronBorder}`, color: C.saffron }}>
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
            <motion.h2 {...fadeUp(0.07)} className="font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-12" style={{ color: C.text }}>Pooja Programme</motion.h2>
            <div className="relative pl-5 sm:pl-7">
              <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg,transparent,${C.saffronBorder} 20%,${C.saffronBorder} 80%,transparent)` }} />
              <div className="space-y-7">
                {scheduleItems.map((item, i) => {
                  const parts = item.split(/[-–—]/).map(s => s.trim())
                  const timePart = parts.length > 1 ? parts[0] : null
                  const desc = parts.length > 1 ? parts.slice(1).join(' ') : item
                  return (
                    <motion.div key={i} {...fadeUp(i * 0.07)} className="relative">
                      <div className="absolute -left-[1.75rem] top-1.5 w-3 h-3 rounded-full" style={{ background: C.bg, border: `1.5px solid ${C.saffron}` }} />
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

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 overflow-hidden" style={{ background: C.bg }}>
          <motion.p {...fadeUp()} className="px-4 sm:px-6 md:px-8 text-center text-[11px] uppercase tracking-[0.38em] mb-3" style={{ color: C.goldMuted }}>Hamara Ghar</motion.p>
          <motion.h2 {...fadeUp(0.07)} className="px-4 sm:px-6 md:px-8 font-heading text-center text-2xl sm:text-3xl mb-8 sm:mb-10" style={{ color: C.text }}>Our New Home</motion.h2>
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {gallery.map((src, i) => (
              <motion.div key={`${src}-${i}`} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }} transition={{ duration: 0.7, delay: i * 0.06, ease: BEZIER }}
                className="shrink-0 overflow-hidden rounded-xl" style={{ width: i % 3 === 0 ? 240 : 190, height: i % 3 === 0 ? 320 : 252, border: `1px solid ${C.saffronBorder}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Home ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── MESSAGE ── */}
      {message && (
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-18 md:py-24" style={{ background: C.bgMid }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp()}>
              <div className="font-heading select-none mb-1 leading-none" style={{ fontSize: '6rem', color: 'rgba(255,143,0,0.09)' }} aria-hidden>&ldquo;</div>
              <p className="font-heading text-xl sm:text-2xl italic leading-relaxed" style={{ color: C.textMuted }}>{message}</p>
              <p className="mt-7 text-sm uppercase tracking-[0.32em]" style={{ color: C.goldMuted }}>— {hostNames}</p>
            </motion.div>
          </div>
        </section>
      )}

      {eventId && <HouseWarmingWishes eventId={eventId} />}

      <footer className="px-4 sm:px-6 md:px-8 py-12 text-center" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <DiyaDivider className="mb-7" />
        <p className="text-xs uppercase tracking-[0.38em]" style={{ color: C.textFaint }}>{hostNames}</p>
        {formattedDate && <p className="mt-1.5 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(255,245,230,0.18)' }}>{formattedDate}</p>}
        <p className="mt-5 text-[10px] tracking-[0.22em]" style={{ color: 'rgba(255,245,230,0.12)' }}>Made with ShareInvite</p>
      </footer>
    </div>
  )
}
