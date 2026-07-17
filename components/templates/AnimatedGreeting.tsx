'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import type { Motif } from './greeting/GreetingScene3D'

const GreetingScene3D = dynamic(() => import('./greeting/GreetingScene3D'), { ssr: false })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ─── Theme definitions ────────────────────────────────────────────────────────
interface GreetingTheme {
  motif: Motif
  count: number
  bg: string
  objectColors: string[]
  accent: string
  sparkle: string
  dark: boolean
  eyebrow: string
  interactive?: 'propose'
}

export const GREETING_THEMES: Record<string, GreetingTheme> = {
  love: {
    motif: 'hearts', count: 30, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #5a1030 0%, #3a0f2a 50%, #1c0a18 100%)',
    objectColors: ['#E4577B', '#B0324B', '#8E6BD1', '#F2A9C0'], accent: '#F2A9C0', sparkle: '#ffd0e0',
    eyebrow: 'For you, with all my heart',
  },
  valentine: {
    motif: 'hearts', count: 32, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #7a1226 0%, #4a0f1f 55%, #240912 100%)',
    objectColors: ['#E4577B', '#B0324B', '#F2A9C0', '#ffffff'], accent: '#F2A9C0', sparkle: '#ffd0e0',
    eyebrow: 'Happy Valentine\'s Day',
  },
  anniversary: {
    motif: 'hearts', count: 26, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #6a1030 0%, #3c1220 55%, #1a0a12 100%)',
    objectColors: ['#8B0030', '#D9A441', '#B0324B', '#F2C14E'], accent: '#E8B84B', sparkle: '#ffe9b0',
    eyebrow: 'Celebrating us',
  },
  propose: {
    motif: 'rings', count: 22, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #5a1236 0%, #3a1030 55%, #1c0a1a 100%)',
    objectColors: ['#E8B84B', '#F2C14E', '#E4577B', '#ffffff'], accent: '#E8B84B', sparkle: '#ffe9b0',
    eyebrow: 'A question for you', interactive: 'propose',
  },
  promise: {
    motif: 'rings', count: 24, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #123c3a 0%, #1a2a4a 55%, #0e1526 100%)',
    objectColors: ['#2F766D', '#8E6BD1', '#E8B84B', '#7FC9BE'], accent: '#7FC9BE', sparkle: '#bfeee6',
    eyebrow: 'My promise to you',
  },
  sorry: {
    motif: 'petals', count: 34, dark: false,
    bg: 'radial-gradient(120% 90% at 50% 10%, #eef4fb 0%, #e4ecf6 55%, #d7e2f0 100%)',
    objectColors: ['#7FA8C9', '#C9B7D9', '#ffffff', '#A9C4DE'], accent: '#5E7FA8', sparkle: '#c9dcf0',
    eyebrow: 'From my heart to yours',
  },
  congratulations: {
    motif: 'confetti', count: 44, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #2a1a4a 0%, #3a1442 55%, #180e28 100%)',
    objectColors: ['#E8B84B', '#E4577B', '#5AB7C9', '#57B98A', '#8E6BD1', '#F2A93B'], accent: '#E8B84B', sparkle: '#ffe9b0',
    eyebrow: 'So proud of you',
  },
  festival: {
    motif: 'diyas', count: 28, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #3a1a02 0%, #2a1240 55%, #140a1c 100%)',
    objectColors: ['#FF8C00', '#E8B84B', '#F2C14E', '#FF6B35'], accent: '#F2C14E', sparkle: '#ffcf80',
    eyebrow: 'Wishing you light & joy',
  },
  family: {
    motif: 'hearts', count: 24, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #6a3410 0%, #4a1e20 55%, #241010 100%)',
    objectColors: ['#E8A44B', '#B0324B', '#F2C14E', '#E4577B'], accent: '#F2C14E', sparkle: '#ffe0b0',
    eyebrow: 'To the ones I love most',
  },
  friendship: {
    motif: 'stars', count: 30, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 10%, #103a4a 0%, #1a2a5a 50%, #2a1040 100%)',
    objectColors: ['#5AB7C9', '#E4577B', '#F2C14E', '#8E6BD1', '#57B98A'], accent: '#5AB7C9', sparkle: '#bfeeff',
    eyebrow: 'Cheers to us',
  },
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

function formatDate(iso?: string): string | null {
  if (!iso) return null
  const [y, mth, d] = iso.split('-').map(Number)
  if (!y || !mth || !d) return null
  return `${d} ${MONTHS[mth - 1]} ${y}`
}

// ─── Confetti / heart shower (DOM, lightweight) ───────────────────────────────
function Confetti({ fire, colors }: { fire: boolean; colors: string[] }) {
  const pieces = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({
      id: i, x: (i * 53) % 100, color: colors[i % colors.length],
      delay: (i % 12) * 0.03, rot: (i * 47) % 360,
    })),
    [colors]
  )
  if (!fire) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-10%', x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 2.6, delay: p.delay, ease: 'easeIn' }}
          className="absolute h-2.5 w-2 rounded-[1px]"
          style={{ background: p.color, left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="font-semibold uppercase" style={{ color, fontSize: 'clamp(0.6rem, 2.7cqw, 0.72rem)', letterSpacing: '0.34em' }}>
      {children}
    </p>
  )
}

function ContinueButton({ onClick, label, accent }: { onClick: () => void; label: string; accent: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: BEZIER }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="mt-9 rounded-full font-bold tracking-wide text-[#2a1420]"
      style={{
        background: `linear-gradient(135deg, ${accent}, #d89a2a)`,
        padding: 'clamp(0.7rem, 2.6cqw, 0.85rem) clamp(1.6rem, 6cqw, 2.2rem)',
        fontSize: 'clamp(0.82rem, 3.2cqw, 0.9rem)',
        boxShadow: `0 10px 30px -6px ${accent}80, 0 0 0 1px rgba(255,255,255,0.15) inset`,
        pointerEvents: 'auto',
      }}
    >
      {label}
    </motion.button>
  )
}

const beatIn = {
  initial: { opacity: 0, scale: 0.98, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -16 },
  transition: { duration: 0.55, ease: BEZIER },
}

// ─── Beat: cover (tap the 3D hero to open) ────────────────────────────────────
function CoverBeat({ recipient, sender, accent, textColor, subColor }: { recipient: string; sender: string; accent: string; textColor: string; subColor: string }) {
  return (
    <motion.div {...beatIn} className="pointer-events-none flex flex-col items-center justify-end pb-[18vh] text-center">
      {sender && <Eyebrow color={subColor}>A letter from {sender}</Eyebrow>}
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-3 font-medium"
        style={{ color: accent, fontFamily: 'var(--font-script)', fontSize: 'clamp(1.6rem, 8cqw, 2.6rem)' }}
      >
        For {recipient}
      </motion.p>
      <motion.p
        animate={{ scale: [1, 1.09, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-4 font-medium"
        style={{ color: textColor, fontSize: 'clamp(0.85rem, 3.4cqw, 0.98rem)' }}
      >
        Tap to open 💌
      </motion.p>
    </motion.div>
  )
}

// ─── Beat: the reveal (headline moment) ───────────────────────────────────────
function RevealBeat({ theme, headline, subtitle, avatar, dateStr, dateBadge, textColor, subColor, onNext }: {
  theme: GreetingTheme; headline: string; subtitle: string; avatar: string; dateStr: string | null; dateBadge: string | null
  textColor: string; subColor: string; onNext: () => void
}) {
  const shimmer = theme.dark
    ? `linear-gradient(100deg, ${theme.accent} 5%, #fff4d6 50%, ${theme.accent} 95%)`
    : `linear-gradient(100deg, ${theme.accent} 5%, #93a9c6 50%, ${theme.accent} 95%)`
  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      {avatar && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="mb-5 overflow-hidden rounded-full"
          style={{ width: 'clamp(72px, 22cqw, 104px)', height: 'clamp(72px, 22cqw, 104px)', border: `3px solid ${theme.accent}`, boxShadow: `0 0 30px -4px ${theme.accent}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        </motion.div>
      )}
      <Eyebrow color={subColor}>{theme.eyebrow}</Eyebrow>
      <div className="greet-float mt-5">
        <motion.h1
          initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.15, duration: 0.95, ease: BEZIER }}
          className="greet-shimmer font-bold"
          style={{ backgroundImage: shimmer, fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 10cqw, 5rem)', lineHeight: 1.05 }}
        >
          {headline}
        </motion.h1>
      </div>
      {subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-3 italic" style={{ color: textColor, fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 4cqw, 1.2rem)' }}>
          {subtitle}
        </motion.p>
      )}
      {dateStr && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
          style={{ background: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', color: textColor }}>
          <span>📅 {dateStr}</span>
          {dateBadge && <span style={{ color: theme.accent }}>· {dateBadge}</span>}
        </motion.div>
      )}
      <ContinueButton onClick={onNext} label="Continue →" accent={theme.accent} />
    </motion.div>
  )
}

// ─── Beat: photo memory ───────────────────────────────────────────────────────
// ─── Beat: photo memories (a tappable deck of polaroids) ──────────────────────
const TILTS = [-4, 3, -2, 5, -3, 2]
function MemoriesBeat({ theme, photos, subColor, onNext }: {
  theme: GreetingTheme; photos: string[]; subColor: string; onNext: () => void
}) {
  const [index, setIndex] = useState(0)
  const atEnd = index >= photos.length - 1

  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <Eyebrow color={subColor}>Moments I treasure with you</Eyebrow>

      {/* Polaroid deck — remaining photos peek from behind the top one */}
      <div className="relative mt-7" style={{ width: 'min(80cqw, 310px)', height: 'min(104cqw, 400px)' }}>
        {photos.map((src, i) => {
          if (i < index) return null
          const depth = i - index
          if (depth > 3) return null
          const isTop = depth === 0
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: 1 - depth * 0.05,
                y: depth * 14,
                rotate: TILTS[i % TILTS.length],
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: BEZIER }}
              onClick={() => { if (isTop && !atEnd) setIndex((v) => v + 1) }}
              className="absolute inset-0 rounded-lg bg-white p-3 pb-9 shadow-2xl"
              style={{ zIndex: 10 - depth, pointerEvents: isTop ? 'auto' : 'none' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Memory ${i + 1}`} className="h-[82%] w-full rounded-sm object-cover" />
              <p className="mt-3 text-sm italic text-neutral-500" style={{ fontFamily: 'var(--font-script)', fontSize: '1.05rem' }}>
                {index + 1} of {photos.length}
              </p>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-5 text-xs" style={{ color: subColor }}>{atEnd ? 'Every one of them, my favourite.' : 'Tap the photo for the next memory'}</p>
      {atEnd && <ContinueButton onClick={onNext} label="There's more →" accent={theme.accent} />}
    </motion.div>
  )
}

// ─── Beat: reasons / confession (revealed one at a time) ──────────────────────
function ReasonsBeat({ theme, reasons, recipient, textColor, subColor, onNext }: {
  theme: GreetingTheme; reasons: string[]; recipient: string; textColor: string; subColor: string; onNext: () => void
}) {
  const list = reasons.slice(0, 4) // show at most 4 reasons
  const [shown, setShown] = useState(1)
  const allShown = shown >= list.length
  const heading = theme.interactive === 'propose' ? 'Before I ask…' : 'A few reasons why'

  return (
    <motion.div {...beatIn} className="flex w-full flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <Eyebrow color={subColor}>{heading}</Eyebrow>
      <h3 className="mt-3" style={{ color: theme.accent, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 6.5cqw, 2.2rem)' }}>
        Why {recipient} 💛
      </h3>

      <div className="mt-6 flex w-full max-w-md flex-col items-center gap-3">
        <AnimatePresence>
          {list.slice(0, shown).map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: BEZIER }}
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left"
              style={{
                background: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)',
                border: `1px solid ${theme.accent}33`,
                backdropFilter: 'blur(6px)',
              }}
            >
              <span className="shrink-0 text-lg font-bold" style={{ color: theme.accent, fontFamily: 'var(--font-display)' }}>{i + 1}</span>
              <span style={{ color: textColor, fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 3.8cqw, 1.08rem)' }}>{r}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!allShown ? (
        <ContinueButton onClick={() => setShown((v) => Math.min(v + 1, list.length))} label="One more reason 💫" accent={theme.accent} />
      ) : (
        <ContinueButton onClick={onNext} label="Read my letter →" accent={theme.accent} />
      )}
    </motion.div>
  )
}

// ─── Beat: the letter (typewriter) ────────────────────────────────────────────
function LetterBeat({ theme, recipient, message, subColor, onNext }: {
  theme: GreetingTheme; recipient: string; message: string; subColor: string; onNext: () => void
}) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => { i += 2; setShown(message.slice(0, i)); if (i >= message.length) clearInterval(id) }, 42)
    return () => clearInterval(id)
  }, [message])
  const done = shown.length >= message.length

  return (
    <motion.div {...beatIn} className="flex w-full flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <Eyebrow color={subColor}>A note for you</Eyebrow>
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7, ease: BEZIER }}
        className="mt-5 w-full rounded-2xl shadow-2xl"
        style={{
          maxWidth: 'min(92cqw, 30rem)',
          background: theme.dark ? 'linear-gradient(180deg,#fffdf7,#fbf4e6)' : 'linear-gradient(180deg,#ffffff,#f4f8fd)',
          padding: 'clamp(1.4rem, 5cqw, 2rem)',
          maxHeight: '62vh', overflowY: 'auto',
          borderTop: `3px solid ${theme.accent}`,
          boxShadow: `0 30px 70px -20px rgba(0,0,0,0.5), 0 0 0 1px ${theme.accent}22`,
        }}
      >
        <p className="text-left" style={{ fontFamily: 'var(--font-script)', color: theme.accent, fontSize: 'clamp(1.3rem, 5.5cqw, 1.7rem)', marginBottom: '0.6rem' }}>
          Dear {recipient},
        </p>
        <p className="whitespace-pre-wrap text-left text-neutral-700" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 3.7cqw, 1.05rem)', lineHeight: 1.75 }}>
          {shown}{!done && <span className="animate-pulse">|</span>}
        </p>
      </motion.div>
      {done && <ContinueButton onClick={onNext} label="One last thing →" accent={theme.accent} />}
    </motion.div>
  )
}

// ─── Beat: finale (signature + interactive send-love / say-yes) ───────────────
function FinaleBeat({ theme, sender, textColor, subColor, onReplay, onCelebrate, celebrated }: {
  theme: GreetingTheme; sender: string; textColor: string; subColor: string
  onReplay: () => void; onCelebrate: () => void; celebrated: boolean
}) {
  const isPropose = theme.interactive === 'propose'
  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
        className="text-5xl"
      >
        {isPropose ? (celebrated ? '💍' : '💍') : '💝'}
      </motion.div>
      <h2 className="mt-4 font-bold" style={{ color: theme.accent, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 7cqw, 2.4rem)' }}>
        {isPropose ? (celebrated ? 'She said YES!' : 'Will you?') : celebrated ? 'Sent with love' : 'With all my love'}
      </h2>
      {sender && (
        <p className="mt-3" style={{ color: textColor, fontFamily: 'var(--font-script)', fontSize: 'clamp(1.5rem, 6.5cqw, 2.1rem)' }}>{sender}</p>
      )}

      <button
        onClick={onCelebrate}
        className="mt-8 rounded-full px-9 py-3.5 text-sm font-bold text-[#2a1420] shadow-xl transition-transform active:scale-95"
        style={{ background: `linear-gradient(135deg, ${theme.accent}, #d89a2a)`, pointerEvents: 'auto' }}
      >
        {isPropose ? 'Say Yes 💍' : 'Send Love ❤️'}
      </button>

      <button
        onClick={onReplay}
        className="mt-4 text-xs font-medium underline underline-offset-4"
        style={{ color: subColor, pointerEvents: 'auto' }}
      >
        ↻ Play again
      </button>

      <a href="/" className="mt-8 text-[11px] underline underline-offset-4" style={{ color: subColor, pointerEvents: 'auto' }}>
        Made with ShareInvite — create your own
      </a>
    </motion.div>
  )
}

// ─── The greeting experience ───────────────────────────────────────────────────
function AnimatedGreeting({ theme, data, isPreview }: {
  theme: GreetingTheme; data: Record<string, string>; isPreview?: boolean
}) {
  const mounted = useMounted()
  const [muted, setMuted] = useState(true)
  const [stage, setStage] = useState(0)
  const [celebrated, setCelebrated] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Skip the tap-to-open cover in the editor so the creator sees the content live.
  useEffect(() => { if (isPreview) setStage(1) }, [isPreview])

  const recipient = data.recipientName || 'You'
  const sender = data.senderName || ''
  const headline = data.headline || 'A message for you'
  const subtitle = data.subtitle || ''
  const message = data.message || ''
  const avatar = data.photo || ''
  const dateStr = formatDate(data.date)
  const textColor = theme.dark ? '#ffffff' : '#243247'
  const subColor = theme.dark ? 'rgba(255,255,255,0.72)' : 'rgba(36,50,71,0.7)'

  const photos = useMemo(() => (data.galleryImages || '').split('\n').map((s) => s.trim()).filter(Boolean), [data.galleryImages])
  const reasons = useMemo(() => (data.reasons || '').split('\n').map((s) => s.trim()).filter(Boolean), [data.reasons])

  // Beats build from the data available — the more they add, the richer the journey.
  const beats = useMemo(() => {
    const b: string[] = ['cover', 'reveal']
    if (photos.length) b.push('memories')
    if (reasons.length) b.push('reasons')
    if (message) b.push('letter')
    b.push('finale')
    return b
  }, [photos.length, reasons.length, message])

  const current = beats[Math.min(stage, beats.length - 1)]

  const dateBadge = useMemo(() => {
    if (!mounted || !data.date) return null
    const [y, m, d] = data.date.split('-').map(Number)
    if (!y || !m || !d) return null
    const days = Math.round((new Date(y, m - 1, d).getTime() - Date.now()) / 86400000)
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} to go`
    if (days < 0) return `together ${Math.abs(days)} days & counting 💞`
    return 'today 🎉'
  }, [mounted, data.date])

  const startMusic = () => {
    if (audioRef.current) { audioRef.current.muted = false; setMuted(false); audioRef.current.play().catch(() => {}) }
  }
  const advance = () => setStage((s) => Math.min(s + 1, beats.length - 1))
  const open = () => { startMusic(); advance() }
  const replay = () => { setCelebrated(false); setStage(1) }
  const celebrate = () => setCelebrated(true)

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !muted
    audioRef.current.muted = next
    if (!next) audioRef.current.play().catch(() => {})
    setMuted(next)
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        // In a bounded preview (editor / preview modal) fill the container height
        // instead of 100svh, which would blow out of the small phone shell.
        minHeight: isPreview ? '100%' : '100svh',
        height: isPreview ? '100%' : undefined,
        background: theme.bg,
      }}
    >
      {/* Dreamy bokeh light orbs (depth behind the 3D) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="greet-orb" style={{ width: '46vw', height: '46vw', top: '-8%', left: '-10%', background: theme.objectColors[0], animationDelay: '0s' }} />
        <span className="greet-orb" style={{ width: '38vw', height: '38vw', bottom: '-6%', right: '-8%', background: theme.objectColors[1] ?? theme.accent, animationDelay: '3s' }} />
        <span className="greet-orb" style={{ width: '30vw', height: '30vw', top: '35%', right: '20%', background: theme.objectColors[2] ?? theme.accent, animationDelay: '6s', opacity: 0.35 }} />
      </div>

      {/* Interactive 3D scene — tap hero to open, parallax tilt, tap-to-burst */}
      <div className="absolute inset-0">
        <GreetingScene3D
          motif={theme.motif} colors={theme.objectColors} count={theme.count} sparkleColor={theme.sparkle}
          opened={stage > 0} onOpen={open}
        />
      </div>

      {/* Readability veil (gently breathing) behind text */}
      <div className="greet-breathe pointer-events-none absolute inset-0" style={{ background: theme.dark
        ? 'radial-gradient(62% 55% at 50% 48%, rgba(0,0,0,0.55), transparent 80%)'
        : 'radial-gradient(62% 55% at 50% 48%, rgba(255,255,255,0.62), transparent 80%)' }} />

      {/* Cinematic film grain */}
      <div className="greet-grain" style={{ zIndex: 15 }} />

      {/* Progress rail */}
      {stage > 0 && (
        <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 items-center gap-1.5">
          {beats.slice(1).map((b, i) => (
            <div key={b} className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: i === stage - 1 ? 22 : 8, background: i <= stage - 1 ? theme.accent : 'rgba(150,150,150,0.35)' }} />
          ))}
        </div>
      )}

      {/* Music */}
      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl} loop muted={muted} autoPlay />
          <button onClick={toggleMute} aria-label={muted ? 'Unmute music' : 'Mute music'}
            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)', color: textColor }}>
            {muted ? '🔇' : '🔊'}
          </button>
        </>
      )}

      {/* Beats */}
      <div
        className={`relative z-10 flex items-center justify-center ${isPreview ? 'h-full min-h-full' : 'min-h-[100svh]'}`}
        style={{
          // Query container so the beat text (sized in cqw) scales to THIS width —
          // the small phone shell in a preview, or the full viewport on the live page.
          containerType: 'inline-size',
          paddingLeft: isPreview ? '1.25rem' : 'clamp(1.25rem, 5vw, 3rem)',
          paddingRight: isPreview ? '1.25rem' : 'clamp(1.25rem, 5vw, 3rem)',
          paddingTop: isPreview ? '3.25rem' : 'max(4.5rem, env(safe-area-inset-top))',
          paddingBottom: isPreview ? '4rem' : 'max(4rem, env(safe-area-inset-bottom))',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={current} {...beatIn} className="flex w-full items-center justify-center">
            <div className="flex w-full items-center justify-center">
              {current === 'cover' && <CoverBeat recipient={recipient} sender={sender} accent={theme.accent} textColor={textColor} subColor={subColor} />}
              {current === 'reveal' && (
                <RevealBeat theme={theme} headline={headline} subtitle={subtitle} avatar={avatar} dateStr={dateStr} dateBadge={dateBadge}
                  textColor={textColor} subColor={subColor} onNext={advance} />
              )}
              {current === 'memories' && (
                <MemoriesBeat theme={theme} photos={photos} subColor={subColor} onNext={advance} />
              )}
              {current === 'reasons' && (
                <ReasonsBeat theme={theme} reasons={reasons} recipient={recipient} textColor={textColor} subColor={subColor} onNext={advance} />
              )}
              {current === 'letter' && (
                <LetterBeat theme={theme} recipient={recipient} message={message} subColor={subColor} onNext={advance} />
              )}
              {current === 'finale' && (
                <FinaleBeat theme={theme} sender={sender} textColor={textColor} subColor={subColor}
                  onReplay={replay} onCelebrate={celebrate} celebrated={celebrated} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Confetti fire={celebrated} colors={theme.objectColors} />

      {/* Preview-only quick navigation so the creator can inspect every beat.
          Centered in a backdrop pill so it never sits on top of the beat content. */}
      {isPreview && (
        <div
          className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-1.5 py-1"
          style={{ background: theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <button onClick={() => setStage((s) => Math.max(0, s - 1))}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ background: theme.dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)', color: textColor }}>‹ Prev</button>
          <button onClick={advance}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ background: theme.dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)', color: textColor }}>Next ›</button>
        </div>
      )}
    </div>
  )
}

// ─── Bind each occasion to a themed component, exported as a registry map ─────
function bind(themeKey: string): ComponentType<{ data: Record<string, string>; eventId?: string; isPreview?: boolean }> {
  const theme = GREETING_THEMES[themeKey]
  const Bound = (props: { data: Record<string, string>; eventId?: string; isPreview?: boolean }) => (
    <AnimatedGreeting theme={theme} data={props.data} isPreview={props.isPreview} />
  )
  Bound.displayName = `Greeting_${themeKey}`
  return Bound
}

// Individual named exports so a Server Component can import each as a client
// reference. (A plain-object export from a 'use client' module becomes an opaque
// client reference on the server — spreading it yields nothing.)
export const GreetingLove = bind('love')
export const GreetingValentine = bind('valentine')
export const GreetingAnniversary = bind('anniversary')
export const GreetingPropose = bind('propose')
export const GreetingPromise = bind('promise')
export const GreetingSorry = bind('sorry')
export const GreetingCongratulations = bind('congratulations')
export const GreetingFestival = bind('festival')
export const GreetingFamily = bind('family')
export const GreetingFriendship = bind('friendship')
