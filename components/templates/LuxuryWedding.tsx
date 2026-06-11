'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import WishesSection from './WishesSection'

interface Props {
  data: Record<string, string>
  eventId?: string
  isPreview?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const C = {
  ivory: '#FFF8F0',
  paper: '#F9F0DA',
  paperMid: '#F0DEB8',
  gold: '#B8963E',
  goldBright: '#D4AF5A',
  goldFaint: 'rgba(184,150,62,0.10)',
  goldBorder: 'rgba(184,150,62,0.28)',
  goldGlow: 'rgba(212,175,55,0.18)',
  ink: '#180B00',
  text: '#2A1600',
  muted: 'rgba(42,22,0,0.50)',
  wax: '#7A1424',
  waxLight: '#9E2038',
  env: '#EDD898',
  envDark: '#D4BA72',
  envShadow: '#C4A652',
  darkBg: '#0C0600',
}

type Phase = 'envelope' | 'revealed'
type Panel = null | 'rsvp' | 'events' | 'venue' | 'gallery' | 'family'

// ─── Utilities ───────────────────────────────────────────────────────────────

function parseList(v?: string): string[] {
  if (!v) return []
  return v.split(/\n|,/).map(s => s.trim()).filter(Boolean)
}

function buildDateTime(date?: string, time?: string): Date | null {
  if (!date) return null
  const d = new Date(`${date}T${time ?? '00:00'}:00`)
  return isNaN(d.getTime()) ? null : d
}

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!target) return null
  const diff = Math.max(target.getTime() - now, 0)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    ended: diff === 0,
  }
}

// ─── Gold dust particles (fixed positions for SSR safety) ───────────────────

const PARTICLES = [
  { id: 0,  x: 8,  y: 15, s: 1.8, o: 0.28, d: 14, dl: 0   },
  { id: 1,  x: 23, y: 72, s: 1.2, o: 0.20, d: 18, dl: 2.3  },
  { id: 2,  x: 45, y: 28, s: 2.0, o: 0.32, d: 11, dl: 0.8  },
  { id: 3,  x: 67, y: 55, s: 1.4, o: 0.18, d: 16, dl: 4.1  },
  { id: 4,  x: 82, y: 10, s: 1.6, o: 0.25, d: 13, dl: 1.7  },
  { id: 5,  x: 15, y: 88, s: 1.0, o: 0.22, d: 20, dl: 3.5  },
  { id: 6,  x: 55, y: 45, s: 2.2, o: 0.15, d: 15, dl: 0.3  },
  { id: 7,  x: 33, y: 62, s: 1.3, o: 0.30, d: 12, dl: 5.2  },
  { id: 8,  x: 77, y: 80, s: 1.7, o: 0.22, d: 17, dl: 1.0  },
  { id: 9,  x: 92, y: 35, s: 1.1, o: 0.26, d: 19, dl: 2.8  },
  { id: 10, x: 5,  y: 50, s: 1.9, o: 0.18, d: 14, dl: 4.6  },
  { id: 11, x: 40, y: 92, s: 1.4, o: 0.24, d: 16, dl: 0.6  },
  { id: 12, x: 60, y: 18, s: 1.2, o: 0.28, d: 21, dl: 3.2  },
  { id: 13, x: 88, y: 60, s: 1.6, o: 0.20, d: 13, dl: 1.9  },
  { id: 14, x: 18, y: 40, s: 2.1, o: 0.15, d: 18, dl: 5.8  },
]

const GoldDust = memo(function GoldDust() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.s, height: p.s,
            background: C.goldBright,
            boxShadow: `0 0 ${p.s * 3}px ${C.goldBright}`,
          }}
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            opacity: [0, p.o, p.o * 0.5, p.o, 0],
            scale: [0.4, 1, 0.6, 1, 0.4],
          }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

// ─── Corner ornament ─────────────────────────────────────────────────────────

function CornerOrnament({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const sx = pos === 'tr' || pos === 'br' ? -1 : 1
  const sy = pos === 'bl' || pos === 'br' ? -1 : 1
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...(pos.includes('t') ? { top: 0 } : { bottom: 0 }),
        ...(pos.includes('l') ? { left: 0 } : { right: 0 }),
        transform: `scaleX(${sx}) scaleY(${sy})`,
        transformOrigin: `${pos.includes('l') ? 'left' : 'right'} ${pos.includes('t') ? 'top' : 'bottom'}`,
      }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M4 4 Q4 28 28 28 Q28 4 4 4" stroke={C.goldBorder} strokeWidth="1" />
        <path d="M4 18 Q11 11 18 4" stroke={C.gold} strokeWidth="1.1" strokeLinecap="round" opacity="0.65" />
        <path d="M4 26 Q15 15 26 4" stroke={C.gold} strokeWidth="0.7" strokeLinecap="round" opacity="0.35" />
        <circle cx="4" cy="4" r="2.2" fill={C.gold} opacity="0.75" />
        <circle cx="4" cy="4" r="1.1" fill={C.goldBright} />
        <path d="M12 4 Q12 8 8 10 Q4 12 4 16" stroke={C.gold} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  )
}

function CardBorder() {
  return (
    <div className="absolute inset-3 pointer-events-none" style={{ border: `1px solid ${C.goldBorder}` }}>
      <div className="absolute inset-[5px]" style={{ border: `0.5px solid rgba(184,150,62,0.15)` }} />
      <CornerOrnament pos="tl" />
      <CornerOrnament pos="tr" />
      <CornerOrnament pos="bl" />
      <CornerOrnament pos="br" />
    </div>
  )
}

// ─── Envelope ────────────────────────────────────────────────────────────────

function Envelope({
  brideName, groomName, onOpen, isOpening,
}: {
  brideName: string; groomName: string
  onOpen: () => void; isOpening: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -80, scale: 0.9 }}
      transition={{ duration: 1.3, ease: EASE }}
      className="relative mx-auto"
      style={{ width: 'min(400px, 88vw)', perspective: '1000px' }}
    >
      {/* Drop shadow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '80%', height: 24,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }} />

      {/* Envelope body */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '3/2',
          background: `linear-gradient(160deg, #FFF8E8 0%, ${C.env} 45%, ${C.envDark} 100%)`,
          borderRadius: 3,
          boxShadow: `
            0 35px 70px rgba(0,0,0,0.28),
            0 15px 30px rgba(0,0,0,0.18),
            0 5px 10px rgba(0,0,0,0.10),
            inset 0 1px 0 rgba(255,255,255,0.75),
            inset 0 -1px 0 rgba(0,0,0,0.08)
          `,
          border: `1px solid rgba(184,150,62,0.35)`,
        }}
      >
        {/* Fold lines (decorative) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 267" preserveAspectRatio="none">
          <line x1="0" y1="267" x2="200" y2="134" stroke={C.goldBorder} strokeWidth="1" />
          <line x1="400" y1="267" x2="200" y2="134" stroke={C.goldBorder} strokeWidth="1" />
          <line x1="0" y1="0" x2="200" y2="134" stroke={C.goldBorder} strokeWidth="0.7" opacity="0.5" />
          <line x1="400" y1="0" x2="200" y2="134" stroke={C.goldBorder} strokeWidth="0.7" opacity="0.5" />
          <polygon points="0,267 400,267 200,134" fill="rgba(215,185,100,0.06)" />
          <polygon points="0,0 0,267 200,134" fill="rgba(215,185,100,0.07)" />
          <polygon points="400,0 400,267 200,134" fill="rgba(215,185,100,0.05)" />
          <rect x="8" y="8" width="384" height="251" fill="none" stroke={C.goldBorder} strokeWidth="0.7" rx="2" />
        </svg>

        {/* Card peeking from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '76%', height: 44,
            background: `linear-gradient(0deg, ${C.ivory}, ${C.paper})`,
            border: `1px solid rgba(184,150,62,0.28)`,
            borderBottom: 'none', borderRadius: '3px 3px 0 0',
            boxShadow: '0 -6px 20px rgba(184,150,62,0.18)',
          }} />

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
          <p style={{ fontFamily: 'serif', fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.muted }}>
            Wedding Invitation
          </p>
          <p style={{ fontFamily: 'serif', fontSize: 17, color: C.ink, fontStyle: 'italic', marginTop: 6, letterSpacing: '0.04em' }}>
            {brideName} &amp; {groomName}
          </p>
        </div>

        {/* Top flap — opens with rotateX */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '54%', perspective: '900px' }}>
          <motion.div
            animate={{ rotateX: isOpening ? -186 : 0 }}
            transition={{ duration: 1.3, delay: 0.15, ease: EASE }}
            style={{
              width: '100%', height: '100%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 400 145" preserveAspectRatio="none">
              <polygon points="0,0 400,0 200,145"
                fill={`url(#flapG)`} />
              <polygon points="0,0 400,0 200,145"
                fill="none" stroke={C.goldBorder} strokeWidth="1" />
              <defs>
                <linearGradient id="flapG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF0CC" />
                  <stop offset="100%" stopColor={C.envDark} />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Wax seal */}
        <motion.button
          onClick={!isOpening ? onOpen : undefined}
          className="absolute z-20 flex items-center justify-center"
          style={{ top: '36%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={isOpening ? { scale: 0.4, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          whileHover={!isOpening ? { scale: 1.06 } : {}}
          whileTap={!isOpening ? { scale: 0.94 } : {}}
          aria-label="Open invitation"
        >
          <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
            <circle cx="38" cy="38" r="34" fill="none" stroke={C.gold} strokeWidth="1.4" opacity="0.55" />
            <circle cx="38" cy="38" r="30" fill={C.wax} />
            <circle cx="38" cy="38" r="30" fill="url(#waxShine)" />
            <text x="38" y="44" textAnchor="middle" fill={C.goldBright} fontFamily="serif" fontSize="18" fontStyle="italic">✦</text>
            <circle cx="38" cy="38" r="22" fill="none" stroke={C.goldBright} strokeWidth="0.7" opacity="0.4" />
            <defs>
              <radialGradient id="waxShine" cx="36%" cy="32%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="60%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </radialGradient>
            </defs>
          </svg>
        </motion.button>
      </div>

      {/* Tap hint */}
      <motion.p
        className="text-center mt-8"
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(184,150,62,0.55)', fontFamily: 'sans-serif' }}
      >
        Tap the seal to open
      </motion.p>
    </motion.div>
  )
}

// ─── Countdown unit ──────────────────────────────────────────────────────────

function CdUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="text-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={display}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ fontFamily: 'serif', fontSize: 'clamp(22px, 5.5vw, 32px)', color: C.ink, lineHeight: 1 }}
        >
          {display}
        </motion.div>
      </AnimatePresence>
      <div style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.muted, marginTop: 4, fontFamily: 'sans-serif' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Card action button ───────────────────────────────────────────────────────

function CardBtn({
  label, icon, active, onClick,
}: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '10px 12px', borderRadius: 6, minWidth: 52,
        background: active ? C.gold : 'transparent',
        border: `1px solid ${active ? C.gold : C.goldBorder}`,
        color: active ? '#fff' : C.text,
        transition: 'background 0.25s, border-color 0.25s, color 0.25s',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: active ? '#fff' : C.gold, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </motion.button>
  )
}

// ─── Main invitation card ─────────────────────────────────────────────────────

function InvitationCard({
  data, countdown, activePanel, setActivePanel, isPreview,
}: {
  data: Record<string, string>
  countdown: ReturnType<typeof useCountdown>
  activePanel: Panel
  setActivePanel: (p: Panel) => void
  isPreview: boolean
}) {
  const brideName = data.brideName || 'Priya'
  const groomName = data.groomName || 'Arjun'
  const gallery = useMemo(() => parseList(data.galleryImages), [data.galleryImages])
  const hasFamily = !isPreview && (parseList(data.brideFamily).length > 0 || parseList(data.groomFamily).length > 0)

  return (
    <motion.div
      className="relative mx-auto"
      style={{
        width: isPreview ? '100%' : 'min(460px, 92vw)',
        background: 'linear-gradient(158deg, #FFFBF2 0%, #F9EDCA 45%, #F3E4B5 70%, #F9EDCA 100%)',
        borderRadius: 4,
        boxShadow: isPreview ? '0 8px 24px rgba(0,0,0,0.12)' : `
          inset 0 2px 0 rgba(255,255,255,0.88),
          inset 0 -2px 0 rgba(0,0,0,0.05),
          inset 2px 0 0 rgba(255,255,255,0.55),
          inset -2px 0 0 rgba(0,0,0,0.03),
          0 50px 100px rgba(0,0,0,0.30),
          0 25px 50px rgba(0,0,0,0.20),
          0 10px 20px rgba(0,0,0,0.13),
          0 3px 6px rgba(0,0,0,0.08)
        `,
      }}
      whileHover={!isPreview ? { y: -3, boxShadow: `
        inset 0 2px 0 rgba(255,255,255,0.88),
        inset 0 -2px 0 rgba(0,0,0,0.05),
        0 60px 120px rgba(0,0,0,0.32),
        0 30px 60px rgba(0,0,0,0.22),
        0 12px 24px rgba(0,0,0,0.14),
        0 4px 8px rgba(0,0,0,0.08)
      ` } : {}}
      transition={{ duration: 0.4 }}
    >
      <CardBorder />

      <div className={`relative z-10 text-center ${isPreview ? 'px-7 py-9' : 'px-8 py-11 sm:px-12 sm:py-14'}`}>
        {/* Monogram crest */}
        <div className="flex justify-center mb-5">
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            border: `1px solid ${C.goldBorder}`,
            background: `radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 1.5L12.7 7.4H19L13.8 10.8L15.5 16.7L11 13.3L6.5 16.7L8.2 10.8L3 7.4H9.3L11 1.5Z"
                stroke={C.gold} strokeWidth="1.1" strokeLinejoin="round" fill={C.goldFaint} />
            </svg>
          </div>
        </div>

        {/* Eyebrow */}
        <p style={{ fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.gold, marginBottom: 14, fontFamily: 'sans-serif' }}>
          Together Forever
        </p>

        {/* Bride */}
        <h1 className="font-heading" style={{
          fontSize: isPreview ? '2.5rem' : 'clamp(2.8rem, 9vw, 4.8rem)',
          color: C.ink, lineHeight: 0.93, letterSpacing: '-0.01em',
          textShadow: '0 2px 0 rgba(255,255,255,0.7)',
        }}>
          {brideName}
        </h1>

        {/* Ampersand */}
        <div className="flex items-center justify-center gap-4 my-3">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${C.goldBorder})` }} />
          <span className="font-heading" style={{ fontSize: '1.7rem', fontStyle: 'italic', color: C.gold, lineHeight: 1 }}>&amp;</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${C.goldBorder})` }} />
        </div>

        {/* Groom */}
        <h1 className="font-heading" style={{
          fontSize: isPreview ? '2.5rem' : 'clamp(2.8rem, 9vw, 4.8rem)',
          color: C.ink, lineHeight: 0.93, letterSpacing: '-0.01em',
          textShadow: '0 2px 0 rgba(255,255,255,0.7)',
        }}>
          {groomName}
        </h1>

        {/* Star divider */}
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-px flex-1" style={{ background: C.goldBorder }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill={C.gold} opacity="0.7">
            <path d="M7 0L8.4 4.6H13.5L9.5 7.4L10.9 12L7 9.2L3.1 12L4.5 7.4L0.5 4.6H5.6L7 0Z" />
          </svg>
          <div className="h-px flex-1" style={{ background: C.goldBorder }} />
        </div>

        {/* Date & venue */}
        {data.date && (
          <p className="font-body" style={{ fontSize: 13, letterSpacing: '0.16em', color: C.text, marginBottom: 4 }}>
            {formatDate(data.date)}{data.time ? ` · ${formatTime(data.time)}` : ''}
          </p>
        )}
        {data.venue && (
          <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, fontFamily: 'sans-serif', marginBottom: 12 }}>
            {data.venue}
          </p>
        )}

        {/* Message */}
        {data.message && (
          <p className="font-body" style={{
            fontSize: 12, fontStyle: 'italic', color: C.muted, lineHeight: 1.75,
            marginBottom: 14, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto',
          }}>
            &ldquo;{data.message}&rdquo;
          </p>
        )}

        {/* Countdown */}
        {countdown && !countdown.ended && (
          <>
            <div className="h-px my-5" style={{ background: C.goldBorder }} />
            <p style={{ fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.gold, marginBottom: 10, fontFamily: 'sans-serif' }}>
              Celebration begins in
            </p>
            <div className="flex items-center justify-center gap-4">
              <CdUnit value={countdown.days} label="Days" />
              <span style={{ color: C.goldBorder, fontFamily: 'serif', fontSize: 18, marginBottom: 14 }}>·</span>
              <CdUnit value={countdown.hours} label="Hrs" />
              <span style={{ color: C.goldBorder, fontFamily: 'serif', fontSize: 18, marginBottom: 14 }}>·</span>
              <CdUnit value={countdown.minutes} label="Min" />
              <span style={{ color: C.goldBorder, fontFamily: 'serif', fontSize: 18, marginBottom: 14 }}>·</span>
              <CdUnit value={countdown.seconds} label="Sec" />
            </div>
          </>
        )}

        {/* Action buttons */}
        {!isPreview && (
          <>
            <div className="h-px mt-6 mb-5" style={{ background: C.goldBorder }} />
            <div className="flex items-center justify-center flex-wrap gap-2">
              <CardBtn label="RSVP" active={activePanel === 'rsvp'} onClick={() => setActivePanel(activePanel === 'rsvp' ? null : 'rsvp')}
                icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
              />
              <CardBtn label="Events" active={activePanel === 'events'} onClick={() => setActivePanel(activePanel === 'events' ? null : 'events')}
                icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></svg>}
              />
              <CardBtn label="Venue" active={activePanel === 'venue'} onClick={() => setActivePanel(activePanel === 'venue' ? null : 'venue')}
                icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
              />
              {gallery.length > 0 && (
                <CardBtn label="Gallery" active={activePanel === 'gallery'} onClick={() => setActivePanel(activePanel === 'gallery' ? null : 'gallery')}
                  icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
                />
              )}
              {hasFamily && (
                <CardBtn label="Family" active={activePanel === 'family'} onClick={() => setActivePanel(activePanel === 'family' ? null : 'family')}
                  icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                />
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Insert card shell ────────────────────────────────────────────────────────

function InsertCard({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative mx-auto mt-4"
      style={{
        width: 'min(460px, 92vw)',
        background: 'linear-gradient(158deg, #FFFBF2 0%, #F9EDCA 45%, #F3E4B5 70%, #F9EDCA 100%)',
        borderRadius: 4,
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.85),
          0 35px 70px rgba(0,0,0,0.25),
          0 15px 35px rgba(0,0,0,0.16),
          0 5px 10px rgba(0,0,0,0.09)
        `,
        border: `1px solid ${C.goldBorder}`,
      }}
    >
      <CardBorder />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20"
        style={{ color: C.muted, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
        aria-label="Close"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function InsertHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center px-10 pt-10 pb-6">
      <p style={{ fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.gold, marginBottom: 8, fontFamily: 'sans-serif' }}>
        {tag}
      </p>
      <h2 className="font-heading" style={{ fontSize: '2rem', color: C.ink, lineHeight: 1.1 }}>{title}</h2>
      {subtitle && <p className="font-body" style={{ fontSize: 12, fontStyle: 'italic', color: C.muted, marginTop: 6 }}>{subtitle}</p>}
      <div className="h-px mt-5" style={{ background: C.goldBorder }} />
    </div>
  )
}

// ─── RSVP panel ───────────────────────────────────────────────────────────────

function RSVPPanel({ data, onClose }: { data: Record<string, string>; onClose: () => void }) {
  const waNum = data.whatsappNumber?.replace(/\D/g, '')
  const brideName = data.brideName || 'the bride'
  const groomName = data.groomName || 'the groom'

  return (
    <InsertCard onClose={onClose}>
      <InsertHeader tag="Kindly Reply" title="RSVP" subtitle="Your presence would be our greatest joy" />
      <div className="px-8 pb-10 space-y-3">
        {waNum && (
          <a
            href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hi! I'm confirming my attendance for ${brideName} & ${groomName}'s wedding.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded"
            style={{ background: '#25D366', color: '#fff', fontFamily: 'sans-serif', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            RSVP via WhatsApp
          </a>
        )}
        {data.date && (
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${brideName} & ${groomName} Wedding`)}&dates=${data.date.replace(/-/g, '')}T${(data.time || '10:00').replace(':', '')}00/${data.date.replace(/-/g, '')}T${(data.time || '10:00').replace(':', '')}00&location=${encodeURIComponent(data.venueAddress || data.venue || '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded"
            style={{ background: 'transparent', color: C.text, border: `1px solid ${C.goldBorder}`, fontFamily: 'sans-serif', fontSize: 14, textDecoration: 'none' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.gold} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            Add to Calendar
          </a>
        )}
      </div>
    </InsertCard>
  )
}

// ─── Events panel ─────────────────────────────────────────────────────────────

function EventsPanel({ data, onClose }: { data: Record<string, string>; onClose: () => void }) {
  const events = [
    { title: 'Mehendi', date: data.mehendiDate, time: data.mehendiTime, venue: data.mehendiVenue, dot: '#4CAF50' },
    { title: 'Haldi',   date: data.haldiDate,   time: data.haldiTime,   venue: data.haldiVenue,   dot: '#FF9800' },
    { title: 'Sangeet', date: data.sangeetDate, time: data.sangeetTime, venue: data.sangeetVenue, dot: '#9C27B0' },
    { title: 'Wedding', date: data.date,         time: data.time,        venue: data.venue,        dot: C.gold   },
    { title: 'Reception', date: data.receptionDate, time: data.receptionTime, venue: data.receptionVenue, dot: '#E91E63' },
  ].filter(e => e.date || e.venue)

  if (events.length === 0) return null

  return (
    <InsertCard onClose={onClose}>
      <InsertHeader tag="Wedding Celebrations" title="The Events" />
      <div className="px-8 pb-10 space-y-0">
        {events.map((e, i) => (
          <motion.div
            key={e.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: EASE }}
            className="flex items-start gap-4 py-4"
            style={{ borderBottom: i < events.length - 1 ? `1px solid ${C.goldBorder}` : 'none' }}
          >
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: `${e.dot}14`, border: `1px solid ${e.dot}35` }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.dot }} />
            </div>
            <div>
              <p className="font-heading" style={{ fontSize: '1.15rem', color: C.ink, marginBottom: 2 }}>{e.title}</p>
              {e.date && <p className="font-body" style={{ fontSize: 13, color: C.text }}>{formatDate(e.date)}{e.time ? ` · ${formatTime(e.time)}` : ''}</p>}
              {e.venue && <p style={{ fontSize: 11, color: C.muted, fontFamily: 'sans-serif', marginTop: 2 }}>{e.venue}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </InsertCard>
  )
}

// ─── Venue panel ──────────────────────────────────────────────────────────────

function VenuePanel({ data, onClose }: { data: Record<string, string>; onClose: () => void }) {
  return (
    <InsertCard onClose={onClose}>
      <InsertHeader tag="Where We Celebrate" title="The Venue" />
      <div className="px-8 pb-10 text-center">
        <div className="flex justify-center mb-5">
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: C.goldFaint, border: `1px solid ${C.goldBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={C.gold} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        </div>
        <h3 className="font-heading" style={{ fontSize: '1.5rem', color: C.ink, marginBottom: 8 }}>
          {data.venue || 'The Grand Venue'}
        </h3>
        {data.venueAddress && (
          <p className="font-body" style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 22 }}>
            {data.venueAddress}
          </p>
        )}
        {data.mapsUrl && (
          <a
            href={data.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded"
            style={{ border: `1px solid ${C.goldBorder}`, background: C.goldFaint, color: C.text, fontFamily: 'sans-serif', fontSize: 13, textDecoration: 'none' }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.gold} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
            Get Directions
          </a>
        )}
      </div>
    </InsertCard>
  )
}

// ─── Gallery panel ────────────────────────────────────────────────────────────

function GalleryPanel({ images, onClose }: { images: string[]; onClose: () => void }) {
  return (
    <InsertCard onClose={onClose}>
      <InsertHeader tag="Our Memories" title="A Glimpse of Us" />
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 6).map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
              className={`overflow-hidden rounded ${i === 0 ? 'col-span-2' : ''}`}
              style={{ border: `1px solid ${C.goldBorder}`, aspectRatio: i === 0 ? '16/9' : '1' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </InsertCard>
  )
}

// ─── Family panel ─────────────────────────────────────────────────────────────

function FamilyPanel({ data, onClose }: { data: Record<string, string>; onClose: () => void }) {
  const brideFamily = parseList(data.brideFamily)
  const groomFamily = parseList(data.groomFamily)
  const families = [
    { title: data.brideFamilyTitle || `${data.brideName || 'Bride'}'s Family`, members: brideFamily },
    { title: data.groomFamilyTitle || `${data.groomName || 'Groom'}'s Family`, members: groomFamily },
  ].filter(f => f.members.length > 0)

  return (
    <InsertCard onClose={onClose}>
      <InsertHeader tag="With Blessings From" title="Our Families" />
      <div className="px-8 pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {families.map((f, i) => (
            <div key={i} className="text-center">
              <p style={{ fontSize: 8, letterSpacing: '0.30em', textTransform: 'uppercase', color: C.gold, marginBottom: 12, fontFamily: 'sans-serif' }}>
                {f.title}
              </p>
              <div className="space-y-2">
                {f.members.map((m, mi) => (
                  <p key={mi} className="font-heading" style={{ fontSize: '1.05rem', color: C.ink }}>{m}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </InsertCard>
  )
}

// ─── Music button ─────────────────────────────────────────────────────────────

function MusicButton({ src }: { src?: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [on, setOn] = useState(false)
  if (!src) return null

  const toggle = async () => {
    const a = ref.current
    if (!a) return
    if (on) { a.pause(); setOn(false); return }
    try { await a.play(); setOn(true) } catch { setOn(false) }
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <audio ref={ref} src={src} loop preload="none" />
      <button onClick={toggle} aria-label={on ? 'Pause music' : 'Play music'}
        className="flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: `1px solid rgba(184,150,62,0.35)`,
          color: on ? C.goldBright : 'rgba(255,255,255,0.45)',
        }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LuxuryWedding({ data, eventId, isPreview = false }: Props) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(isPreview ? 'revealed' : 'envelope')
  const [isOpening, setIsOpening] = useState(false)
  const [activePanel, setActivePanel] = useState<Panel>(null)

  const targetDate = useMemo(() => buildDateTime(data.date, data.time), [data.date, data.time])
  const countdown = useCountdown(isPreview ? null : targetDate)

  const handleOpen = useCallback(() => {
    setIsOpening(true)
    setTimeout(() => setPhase('revealed'), 2000)
  }, [])

  const handlePanel = useCallback((p: Panel) => setActivePanel(p), [])

  // Preview renders the card on a warm paper background with no envelope
  if (isPreview) {
    return (
      <div style={{ background: 'linear-gradient(160deg, #FAF4E4 0%, #F0DFBA 100%)', minHeight: '100%', padding: '24px 16px' }}>
        <InvitationCard data={data} countdown={null} activePanel={null} setActivePanel={() => {}} isPreview />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: `radial-gradient(ellipse at 50% 0%, #1E1000 0%, #0C0600 55%, #050200 100%)` }}
    >
      {/* SEO: key event data always in DOM regardless of animation phase */}
      <div className="sr-only" aria-hidden="false">
        {data.brideName && data.groomName && (
          <h1>{data.brideName} &amp; {data.groomName} — Wedding Invitation</h1>
        )}
        {data.date && <p>Wedding Date: {data.date}{data.time ? ` at ${data.time}` : ''}</p>}
        {data.venue && <p>Venue: {data.venue}</p>}
        {data.venueAddress && <p>Address: {data.venueAddress}</p>}
        {data.message && <p>{data.message}</p>}
      </div>

      <MusicButton src={data.musicUrl} />

      {/* Ambient top shimmer */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none" style={{ zIndex: 0, height: 300 }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 300,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(184,150,62,0.10) 0%, transparent 70%)',
        }} />
      </div>

      {!reduced && phase === 'revealed' && <GoldDust />}

      {/* ── Envelope phase ── */}
      <AnimatePresence>
        {phase === 'envelope' && (
          <motion.div
            key="envelope-screen"
            exit={{ opacity: 0, scale: 0.88, y: -50 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16"
          >
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-center mb-10"
              style={{ fontSize: 10, letterSpacing: '0.48em', textTransform: 'uppercase', color: 'rgba(184,150,62,0.55)', fontFamily: 'sans-serif' }}
            >
              You are cordially invited
            </motion.p>
            <Envelope
              brideName={data.brideName || 'Priya'}
              groomName={data.groomName || 'Arjun'}
              onOpen={handleOpen}
              isOpening={isOpening}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Revealed phase ── */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            key="card-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="relative z-10 px-4 py-14 pb-20"
          >
            {/* Card entrance */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.2, ease: EASE }}
              className="max-w-lg mx-auto"
            >
              <InvitationCard
                data={data}
                countdown={countdown}
                activePanel={activePanel}
                setActivePanel={handlePanel}
                isPreview={false}
              />

              {/* Insert panels emerge below the card */}
              <AnimatePresence mode="wait">
                {activePanel === 'rsvp' && <RSVPPanel key="rsvp" data={data} onClose={() => setActivePanel(null)} />}
                {activePanel === 'events' && <EventsPanel key="events" data={data} onClose={() => setActivePanel(null)} />}
                {activePanel === 'venue' && <VenuePanel key="venue" data={data} onClose={() => setActivePanel(null)} />}
                {activePanel === 'gallery' && <GalleryPanel key="gallery" images={parseList(data.galleryImages)} onClose={() => setActivePanel(null)} />}
                {activePanel === 'family' && <FamilyPanel key="family" data={data} onClose={() => setActivePanel(null)} />}
              </AnimatePresence>
            </motion.div>

            {/* Guestbook */}
            {eventId && (
              <div className="relative z-10 max-w-lg mx-auto mt-6">
                <WishesSection eventId={eventId} />
              </div>
            )}

            {/* Footer */}
            <footer className="relative z-10 text-center mt-14 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10" style={{ background: 'rgba(184,150,62,0.22)' }} />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(184,150,62,0.45)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <div className="h-px w-10" style={{ background: 'rgba(184,150,62,0.22)' }} />
              </div>
              <p style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontFamily: 'sans-serif' }}>
                Made with love &nbsp;·&nbsp; <span style={{ color: 'rgba(184,150,62,0.65)' }}>ShareInvite</span>
              </p>
              <Link
                href="/create"
                className="mt-6 inline-flex rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                Create your own invitation
              </Link>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
