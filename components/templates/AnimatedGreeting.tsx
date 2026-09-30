'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import type { Motif } from './greeting/GreetingScene3D'
import { caveat } from './kit/fonts/caveat'
import { cormorant } from './kit/fonts/cormorant'
import { fraunces } from './kit/fonts/fraunces'
import { instrument } from './kit/fonts/instrument'
import { jost } from './kit/fonts/jost'
import { tiro } from './kit/fonts/tiro'
import { youngSerif } from './kit/fonts/youngSerif'
import { Credit } from './kit/ui'
import { SceneBoundary, useWebGL } from './kit/webgl'

const GreetingScene3D = dynamic(() => import('./greeting/GreetingScene3D'), { ssr: false })

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const hand = caveat.style.fontFamily
const sans = jost.style.fontFamily

// ─── Themes ───────────────────────────────────────────────────────────────────
interface GreetingTheme {
  motif: Motif
  count: number
  bg: string
  objectColors: string[]
  accent: string
  /** Text colour on the accent button. */
  onAccent: string
  sparkle: string
  dark: boolean
  /** The small line above the headline, set in the display italic. */
  eyebrow: string
  display: string
  /** Headline set in italic (the romantic themes) or upright. */
  italic: boolean
  interactive?: 'propose'
}

const serif = {
  instrument: instrument.style.fontFamily,
  cormorant: cormorant.style.fontFamily,
  fraunces: fraunces.style.fontFamily,
  tiro: tiro.style.fontFamily,
  young: youngSerif.style.fontFamily,
}

export const GREETING_THEMES: Record<string, GreetingTheme> = {
  love: {
    motif: 'hearts', count: 22, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #4d1129 0%, #2f0c21 55%, #170812 100%)',
    objectColors: ['#D9587A', '#A8324A', '#E9A3B6', '#7E5BB8'], accent: '#F0B7C4', onAccent: '#2A0F1C', sparkle: '#ffd0e0',
    eyebrow: 'for you, with all my heart', display: serif.instrument, italic: true,
  },
  valentine: {
    motif: 'hearts', count: 24, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #6a1223 0%, #420e1c 55%, #200811 100%)',
    objectColors: ['#D9587A', '#A8324A', '#F0B7C4', '#FFF4F4'], accent: '#F4C2CB', onAccent: '#2E0C16', sparkle: '#ffd0e0',
    eyebrow: 'to my valentine', display: serif.instrument, italic: true,
  },
  anniversary: {
    motif: 'hearts', count: 20, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #5a1029 0%, #35101d 55%, #170910 100%)',
    objectColors: ['#8B0030', '#D6A447', '#A8324A', '#EFC56A'], accent: '#E6BE6C', onAccent: '#2A1308', sparkle: '#ffe9b0',
    eyebrow: 'celebrating us', display: serif.cormorant, italic: true,
  },
  propose: {
    motif: 'rings', count: 16, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #4a1030 0%, #2e0d26 55%, #160916 100%)',
    objectColors: ['#E3B55A', '#F0CD7C', '#D9587A', '#FFFFFF'], accent: '#E8C178', onAccent: '#2A1308', sparkle: '#ffe9b0',
    eyebrow: 'a question for you', display: serif.instrument, italic: true, interactive: 'propose',
  },
  promise: {
    motif: 'rings', count: 18, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #10332f 0%, #16243f 55%, #0c1322 100%)',
    objectColors: ['#2F766D', '#7E5BB8', '#E3B55A', '#7FC9BE'], accent: '#9ED4CB', onAccent: '#0C1F1D', sparkle: '#bfeee6',
    eyebrow: 'a promise, kept close', display: serif.cormorant, italic: true,
  },
  sorry: {
    motif: 'petals', count: 26, dark: false,
    bg: 'radial-gradient(120% 90% at 50% 0%, #f2f6fb 0%, #e6edf6 55%, #d9e3f0 100%)',
    objectColors: ['#8FB0CE', '#C9B7D9', '#FFFFFF', '#AFC7DF'], accent: '#3F5F86', onAccent: '#FFFFFF', sparkle: '#c9dcf0',
    eyebrow: 'from my heart to yours', display: serif.cormorant, italic: true,
  },
  congratulations: {
    motif: 'confetti', count: 36, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #231644 0%, #2e1238 55%, #140c22 100%)',
    objectColors: ['#E3B55A', '#D9587A', '#5AB7C9', '#57B98A', '#8E6BD1', '#F2A93B'], accent: '#F0C35C', onAccent: '#1E1206', sparkle: '#ffe9b0',
    eyebrow: 'so proud of you', display: serif.fraunces, italic: false,
  },
  festival: {
    motif: 'diyas', count: 22, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #3b1a04 0%, #2a1236 55%, #140a18 100%)',
    objectColors: ['#F08A1C', '#E3B55A', '#F2C14E', '#E8643A'], accent: '#F4C35E', onAccent: '#2A1204', sparkle: '#ffcf80',
    eyebrow: 'wishing you light and joy', display: serif.tiro, italic: false,
  },
  family: {
    motif: 'hearts', count: 18, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #5a2c10 0%, #40191b 55%, #200e0e 100%)',
    objectColors: ['#E0A04B', '#A8324A', '#F2C14E', '#D9587A'], accent: '#F1C872', onAccent: '#2A1308', sparkle: '#ffe0b0',
    eyebrow: 'to the ones I love most', display: serif.young, italic: false,
  },
  friendship: {
    motif: 'stars', count: 22, dark: true,
    bg: 'radial-gradient(120% 90% at 50% 0%, #0f3444 0%, #182652 55%, #230e38 100%)',
    objectColors: ['#5AB7C9', '#D9587A', '#F2C14E', '#8E6BD1', '#57B98A'], accent: '#8FD6E4', onAccent: '#0B1F2A', sparkle: '#bfeeff',
    eyebrow: 'for my favourite people', display: serif.fraunces, italic: false,
  },
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso?: string): string | null {
  if (!iso) return null
  const [y, mth, d] = iso.split('-').map(Number)
  if (!y || !mth || !d) return null
  return `${d} ${MONTHS[mth - 1]} ${y}`
}

const lines = (v?: string) => (v || '').split('\n').map((s) => s.trim()).filter(Boolean)

/** Hand-drawn line motif for each theme — the cover's tap target without 3D, and the finale mark. */
function MotifMark({ motif, color, size = 96, strokeWidth = 1.6 }: { motif: Motif; color: string; size?: number; strokeWidth?: number }) {
  const common = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {motif === 'hearts' && (
        <path {...common} d="M50 83 C 30 70, 11 55, 13 36 C 15 21, 33 15, 44 26 C 47 29, 49 32, 50 35 C 52 30, 56 25, 61 22 C 73 16, 88 24, 87 40 C 86 57, 68 70, 50 83 Z" />
      )}
      {motif === 'rings' && (
        <g {...common}>
          <circle cx="40" cy="60" r="21" />
          <circle cx="60" cy="60" r="21" />
          <path d="M44 30 L50 22 L56 30 L50 37 Z M44 30 H56" />
        </g>
      )}
      {motif === 'stars' && (
        <path {...common} d="M50 14 L59 39 L86 40 L65 56 L72 82 L50 67 L28 82 L35 56 L14 40 L41 39 Z" />
      )}
      {motif === 'petals' && (
        <g {...common}>
          <path d="M50 80 C 36 64, 36 42, 50 22 C 64 42, 64 64, 50 80 Z" />
          <path d="M50 80 C 30 76, 18 62, 18 46 C 34 48, 46 60, 50 80 Z" />
          <path d="M50 80 C 70 76, 82 62, 82 46 C 66 48, 54 60, 50 80 Z" />
        </g>
      )}
      {motif === 'diyas' && (
        <g {...common}>
          <path d="M16 58 C 22 76, 78 76, 84 58 Z" />
          <path d="M84 58 C 88 56, 92 52, 94 48" />
          <path d="M50 52 C 42 42, 45 32, 50 20 C 55 32, 58 42, 50 52 Z" />
          <path d="M50 46 C 47 42, 48 37, 50 33" opacity={0.6} />
        </g>
      )}
      {motif === 'confetti' && (
        <g {...common}>
          <path d="M22 70 L40 30 L72 62 Z" />
          <path d="M52 22 c 4 6 -4 8 0 14 s -4 8 0 14" />
          <path d="M76 26 l 6 6 M82 26 l -6 6" />
          <path d="M18 34 c 6 -2 8 4 14 2" />
          <circle cx="78" cy="78" r="2.5" />
          <circle cx="60" cy="14" r="2" />
        </g>
      )}
    </svg>
  )
}

function Button({ onClick, children, theme, variant = 'solid' }: {
  onClick: () => void; children: React.ReactNode; theme: GreetingTheme; variant?: 'solid' | 'ghost'
}) {
  const style: CSSProperties = variant === 'solid'
    ? { background: theme.accent, color: theme.onAccent }
    : { color: theme.dark ? 'rgba(255,255,255,0.8)' : 'rgba(36,50,71,0.8)', border: `1px solid ${theme.dark ? 'rgba(255,255,255,0.28)' : 'rgba(36,50,71,0.25)'}` }
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="mt-9 rounded-full px-7 py-3.5 text-[15px] font-medium"
      style={{ ...style, fontFamily: sans, pointerEvents: 'auto' }}
    >
      {children}
    </motion.button>
  )
}

function Small({ children, color, theme }: { children: React.ReactNode; color: string; theme: GreetingTheme }) {
  return (
    <p className="italic" style={{ color, fontFamily: theme.display, fontSize: 'clamp(17px, 5cqw, 20px)' }}>
      {children}
    </p>
  )
}

const beatIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.5, ease: EASE },
}

// ─── Beats ────────────────────────────────────────────────────────────────────
function CoverBeat({ theme, recipient, sender, textColor, subColor, has3D, onOpen }: {
  theme: GreetingTheme; recipient: string; sender: string; textColor: string; subColor: string; has3D: boolean; onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      {...beatIn}
      onClick={onOpen}
      aria-label={`Open the greeting for ${recipient}`}
      className="flex min-h-[70svh] w-full flex-col items-center justify-end pb-[12svh] text-center"
      style={{ pointerEvents: 'auto' }}
    >
      {!has3D && (
        <span className="mb-auto mt-[16svh] block">
          <MotifMark motif={theme.motif} color={theme.accent} size={120} />
        </span>
      )}
      {sender && <Small color={subColor} theme={theme}>a note from {sender}</Small>}
      <p className="mt-1" style={{ color: theme.accent, fontFamily: hand, fontSize: 'clamp(40px, 13cqw, 56px)', lineHeight: 1.05 }}>
        for {recipient}
      </p>
      <span
        className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px]"
        style={{ color: textColor, fontFamily: sans, border: `1px solid ${theme.dark ? 'rgba(255,255,255,0.3)' : 'rgba(36,50,71,0.25)'}` }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </svg>
        Tap to open
      </span>
    </motion.button>
  )
}

function RevealBeat({ theme, headline, subtitle, avatar, dateStr, dateBadge, textColor, subColor, onNext }: {
  theme: GreetingTheme; headline: string; subtitle: string; avatar: string; dateStr: string | null; dateBadge: string | null
  textColor: string; subColor: string; onNext: () => void
}) {
  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      {avatar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 overflow-hidden rounded-full p-[3px]"
          style={{ width: 'clamp(84px, 26cqw, 116px)', height: 'clamp(84px, 26cqw, 116px)', border: `1px solid ${theme.accent}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
        </motion.div>
      )}
      <Small color={subColor} theme={theme}>{theme.eyebrow}</Small>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
        className="mt-4"
        style={{
          color: textColor,
          fontFamily: theme.display,
          fontStyle: theme.italic ? 'italic' : 'normal',
          fontWeight: theme.display === serif.fraunces ? 600 : 400,
          fontSize: 'clamp(46px, 15cqw, 92px)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          textWrap: 'balance',
        } as CSSProperties}
      >
        {headline}
      </motion.h1>
      {subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-4" style={{ color: theme.accent, fontFamily: hand, fontSize: 'clamp(24px, 7.5cqw, 32px)' }}>
          {subtitle}
        </motion.p>
      )}
      {dateStr && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 text-[14px]" style={{ color: subColor, fontFamily: sans, letterSpacing: '0.02em' }}>
          {dateStr}{dateBadge && <span style={{ color: theme.accent }}> · {dateBadge}</span>}
        </motion.p>
      )}
      <Button onClick={onNext} theme={theme}>Continue</Button>
    </motion.div>
  )
}

const TILTS = [-4, 3, -2, 5, -3, 2]
function MemoriesBeat({ theme, photos, subColor, onNext }: {
  theme: GreetingTheme; photos: string[]; subColor: string; onNext: () => void
}) {
  const [index, setIndex] = useState(0)
  const atEnd = index >= photos.length - 1

  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <Small color={subColor} theme={theme}>moments I keep coming back to</Small>

      <div className="relative mt-7" style={{ width: 'min(78cqw, 300px)', height: 'min(100cqw, 386px)' }}>
        {photos.map((src, i) => {
          if (i < index) return null
          const depth = i - index
          if (depth > 3) return null
          const isTop = depth === 0
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ scale: 1 - depth * 0.04, y: depth * 12, rotate: TILTS[i % TILTS.length], opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={() => { if (isTop && !atEnd) setIndex((v) => v + 1) }}
              className="absolute inset-0 bg-[#FBF8F2] p-3 pb-12"
              style={{ zIndex: 10 - depth, pointerEvents: isTop ? 'auto' : 'none', boxShadow: '0 24px 50px -24px rgba(0,0,0,0.6)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Memory ${i + 1}`} className="h-full w-full object-cover" />
              <p className="absolute bottom-2.5 left-0 right-0 text-center text-[#3a3230]" style={{ fontFamily: hand, fontSize: 22 }}>
                {index + 1} / {photos.length}
              </p>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-6 text-[14px]" style={{ color: subColor, fontFamily: sans }}>
        {atEnd ? 'Every one of them, a favourite.' : 'Tap the photo for the next one'}
      </p>
      {atEnd && <Button onClick={onNext} theme={theme}>There&apos;s more</Button>}
    </motion.div>
  )
}

function ReasonsBeat({ theme, reasons, recipient, textColor, subColor, onNext }: {
  theme: GreetingTheme; reasons: string[]; recipient: string; textColor: string; subColor: string; onNext: () => void
}) {
  const list = reasons.slice(0, 5)
  const [shown, setShown] = useState(1)
  const allShown = shown >= list.length

  return (
    <motion.div {...beatIn} className="flex w-full flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <Small color={subColor} theme={theme}>{theme.interactive === 'propose' ? 'before I ask…' : 'a few reasons why'}</Small>
      <h2 className="mt-2" style={{ color: textColor, fontFamily: theme.display, fontStyle: theme.italic ? 'italic' : 'normal', fontSize: 'clamp(34px, 11cqw, 52px)', lineHeight: 1.05 }}>
        {theme.interactive === 'propose' ? `${recipient},` : `Why ${recipient}`}
      </h2>

      <ol className="mt-7 w-full max-w-[26rem] text-left">
        <AnimatePresence initial={false}>
          {list.slice(0, shown).map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex items-baseline gap-4 border-t py-3.5"
              style={{ borderColor: theme.dark ? 'rgba(255,255,255,0.16)' : 'rgba(36,50,71,0.14)' }}
            >
              <span style={{ color: theme.accent, fontFamily: hand, fontSize: 26, lineHeight: 1 }}>{i + 1}</span>
              <span style={{ color: textColor, fontFamily: theme.display, fontSize: 'clamp(19px, 5.4cqw, 22px)', lineHeight: 1.35 }}>{r}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {!allShown ? (
        <Button onClick={() => setShown((v) => Math.min(v + 1, list.length))} theme={theme} variant="ghost">One more</Button>
      ) : (
        <Button onClick={onNext} theme={theme}>Read my note</Button>
      )}
    </motion.div>
  )
}

function LetterBeat({ theme, recipient, sender, message, onNext }: {
  theme: GreetingTheme; recipient: string; sender: string; message: string; onNext: () => void
}) {
  // Write the note out at reading pace; tapping the paper finishes it at once.
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => { i += 2; setShown(message.slice(0, i)); if (i >= message.length) clearInterval(id) }, 38)
    return () => clearInterval(id)
  }, [message])
  const done = shown.length >= message.length

  return (
    <motion.div {...beatIn} className="flex w-full flex-col items-center" style={{ pointerEvents: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -1.2 }} animate={{ opacity: 1, y: 0, rotate: -0.6 }} transition={{ duration: 0.7, ease: EASE }}
        onClick={() => setShown(message)}
        className="w-full text-left"
        style={{
          maxWidth: 'min(92cqw, 30rem)',
          background: '#FBF7EE',
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 33px, rgba(80,110,160,0.14) 33px 34px)',
          padding: 'clamp(22px, 6cqw, 32px)',
          maxHeight: '66svh',
          overflowY: 'auto',
          boxShadow: '0 30px 60px -28px rgba(0,0,0,0.65)',
          pointerEvents: 'auto',
        }}
      >
        <p style={{ fontFamily: hand, color: '#2d2a33', fontSize: 30, lineHeight: '34px' }}>Dear {recipient},</p>
        <p className="mt-[34px] whitespace-pre-wrap" style={{ fontFamily: hand, color: '#2d2a33', fontSize: 24, lineHeight: '34px' }}>
          {shown}
          {!done && <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-[#2d2a33] align-middle" />}
        </p>
        {done && sender && (
          <p className="mt-[34px] text-right" style={{ fontFamily: hand, color: '#2d2a33', fontSize: 28, lineHeight: '34px' }}>— {sender}</p>
        )}
      </motion.div>
      {done && <Button onClick={onNext} theme={theme}>One last thing</Button>}
    </motion.div>
  )
}

function FinaleBeat({ theme, sender, textColor, subColor, onReplay, onCelebrate, celebrated, isPreview }: {
  theme: GreetingTheme; sender: string; textColor: string; subColor: string
  onReplay: () => void; onCelebrate: () => void; celebrated: boolean; isPreview?: boolean
}) {
  const isPropose = theme.interactive === 'propose'
  const title = isPropose ? (celebrated ? 'Yes!' : 'Will you marry me?') : celebrated ? 'Sent with love' : 'With all my love'
  return (
    <motion.div {...beatIn} className="flex flex-col items-center text-center" style={{ pointerEvents: 'none' }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}>
        <MotifMark motif={theme.motif} color={theme.accent} size={84} />
      </motion.div>
      <h2 className="mt-5" style={{ color: textColor, fontFamily: theme.display, fontStyle: theme.italic ? 'italic' : 'normal', fontSize: 'clamp(40px, 13cqw, 64px)', lineHeight: 1.02 }}>
        {title}
      </h2>
      {sender && (
        <p className="mt-2" style={{ color: theme.accent, fontFamily: hand, fontSize: 'clamp(30px, 9cqw, 40px)' }}>{sender}</p>
      )}
      {!celebrated && (
        <Button onClick={onCelebrate} theme={theme}>{isPropose ? 'Say yes' : 'Send love back'}</Button>
      )}
      <button
        type="button"
        onClick={onReplay}
        className="mt-5 text-[14px] underline underline-offset-4"
        style={{ color: subColor, fontFamily: sans, pointerEvents: 'auto' }}
      >
        Play it again
      </button>
      <div className="mt-10" style={{ pointerEvents: 'auto' }}>
        <Credit isPreview={isPreview} color={subColor} linkColor={textColor} />
      </div>
    </motion.div>
  )
}

// ─── Celebration shower (DOM, lightweight) ────────────────────────────────────
function Confetti({ fire, colors }: { fire: boolean; colors: string[] }) {
  const pieces = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({ id: i, x: (i * 53) % 100, color: colors[i % colors.length], delay: (i % 10) * 0.035, rot: (i * 47) % 360 })),
    [colors],
  )
  if (!fire) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-10%', x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 2.6, delay: p.delay, ease: 'easeIn' }}
          className="absolute h-2.5 w-1.5"
          style={{ background: p.color, left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}

// ─── The greeting experience ───────────────────────────────────────────────────
function AnimatedGreeting({ theme, data, isPreview }: { theme: GreetingTheme; data: Record<string, string>; isPreview?: boolean }) {
  const webgl = useWebGL()
  const [sceneFailed, setSceneFailed] = useState(false)
  const has3D = webgl === true && !sceneFailed
  const [muted, setMuted] = useState(true)
  const [stage, setStage] = useState(0)
  const [celebrated, setCelebrated] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // The editor skips the envelope so the creator sees their words straight away.
  useEffect(() => { if (isPreview) setStage(1) }, [isPreview])
  useEffect(() => setNow(Date.now()), [])

  const recipient = data.recipientName?.trim() || 'you'
  const sender = data.senderName?.trim() || ''
  const headline = data.headline?.trim() || 'A message for you'
  const subtitle = data.subtitle?.trim() || ''
  const message = data.message?.trim() || ''
  const avatar = /^(https?:)?\//.test(data.photo || '') ? data.photo : ''
  const dateStr = formatDate(data.date)
  const textColor = theme.dark ? '#FFFFFF' : '#1F2D42'
  const subColor = theme.dark ? 'rgba(255,255,255,0.72)' : 'rgba(31,45,66,0.72)'

  const photos = useMemo(() => lines(data.galleryImages).filter((u) => /^(https?:)?\//.test(u)), [data.galleryImages])
  const reasons = useMemo(() => lines(data.reasons), [data.reasons])

  // The journey grows with what the sender added.
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
    if (now === null || !data.date) return null
    const [y, m, d] = data.date.split('-').map(Number)
    if (!y || !m || !d) return null
    const days = Math.round((new Date(y, m - 1, d).getTime() - now) / 86400000)
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} to go`
    if (days < 0) return `${Math.abs(days)} days and counting`
    return 'today'
  }, [now, data.date])

  const startMusic = () => {
    if (audioRef.current) { audioRef.current.muted = false; setMuted(false); audioRef.current.play().catch(() => {}) }
  }
  const advance = () => setStage((s) => Math.min(s + 1, beats.length - 1))
  const open = () => { startMusic(); advance() }
  const replay = () => { setCelebrated(false); setStage(1) }

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !muted
    audioRef.current.muted = next
    if (!next) audioRef.current.play().catch(() => {})
    setMuted(next)
  }

  const chrome = theme.dark ? 'rgba(255,255,255,0.14)' : 'rgba(31,45,66,0.08)'

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: isPreview ? '100%' : '100svh', height: isPreview ? '100%' : undefined, background: theme.bg }}
    >
      {has3D && (
        <div className="absolute inset-0">
          <SceneBoundary fallback={null} onError={() => setSceneFailed(true)}>
            <GreetingScene3D
              motif={theme.motif} colors={theme.objectColors} count={theme.count} sparkleColor={theme.sparkle}
              opened={stage > 0} onOpen={open}
            />
          </SceneBoundary>
        </div>
      )}

      {/* Keeps text readable over the 3D field. */}
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.dark
        ? 'radial-gradient(70% 55% at 50% 50%, rgba(0,0,0,0.5), transparent 85%)'
        : 'radial-gradient(70% 55% at 50% 50%, rgba(255,255,255,0.6), transparent 85%)' }} />
      <div className="greet-grain" style={{ zIndex: 15 }} />

      {stage > 0 && (
        <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 items-center gap-1.5" aria-hidden>
          {beats.slice(1).map((b, i) => (
            <span key={b} className="block h-[3px] rounded-full transition-all duration-500"
              style={{ width: i === stage - 1 ? 22 : 8, background: i <= stage - 1 ? theme.accent : chrome }} />
          ))}
        </div>
      )}

      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl} loop muted={muted} autoPlay />
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Play music' : 'Mute music'}
            className="absolute right-4 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: chrome, color: textColor }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path strokeLinejoin="round" d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
              {muted ? <path strokeLinecap="round" d="m16 10 4 4m0-4-4 4" /> : <path strokeLinecap="round" d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />}
            </svg>
          </button>
        </>
      )}

      <div
        className={`relative z-10 flex items-center justify-center ${isPreview ? 'h-full min-h-full' : 'min-h-[100svh]'}`}
        style={{
          containerType: 'inline-size',
          paddingLeft: isPreview ? '1.25rem' : 'clamp(1.25rem, 5vw, 3rem)',
          paddingRight: isPreview ? '1.25rem' : 'clamp(1.25rem, 5vw, 3rem)',
          paddingTop: isPreview ? '3.25rem' : 'max(4.5rem, env(safe-area-inset-top))',
          paddingBottom: isPreview ? '4rem' : 'max(4rem, env(safe-area-inset-bottom))',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={current} {...beatIn} className="flex w-full items-center justify-center">
            {current === 'cover' && (
              <CoverBeat theme={theme} recipient={recipient} sender={sender} textColor={textColor} subColor={subColor} has3D={has3D} onOpen={open} />
            )}
            {current === 'reveal' && (
              <RevealBeat theme={theme} headline={headline} subtitle={subtitle} avatar={avatar} dateStr={dateStr} dateBadge={dateBadge}
                textColor={textColor} subColor={subColor} onNext={advance} />
            )}
            {current === 'memories' && <MemoriesBeat theme={theme} photos={photos} subColor={subColor} onNext={advance} />}
            {current === 'reasons' && (
              <ReasonsBeat theme={theme} reasons={reasons} recipient={recipient} textColor={textColor} subColor={subColor} onNext={advance} />
            )}
            {current === 'letter' && <LetterBeat theme={theme} recipient={recipient} sender={sender} message={message} onNext={advance} />}
            {current === 'finale' && (
              <FinaleBeat theme={theme} sender={sender} textColor={textColor} subColor={subColor}
                onReplay={replay} onCelebrate={() => setCelebrated(true)} celebrated={celebrated} isPreview={isPreview} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Confetti fire={celebrated} colors={theme.objectColors} />

      {/* Editor-only stepper, so the creator can check every beat. */}
      {isPreview && (
        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full p-1"
          style={{ background: theme.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)' }}>
          <button type="button" onClick={() => setStage((s) => Math.max(0, s - 1))}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ background: chrome, color: textColor, fontFamily: sans }}>Back</button>
          <button type="button" onClick={advance}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ background: chrome, color: textColor, fontFamily: sans }}>Next</button>
        </div>
      )}
    </div>
  )
}

// ─── One named export per occasion (Server Components import them as client refs) ─
function bind(themeKey: string): ComponentType<{ data: Record<string, string>; eventId?: string; isPreview?: boolean }> {
  const theme = GREETING_THEMES[themeKey]
  const Bound = (props: { data: Record<string, string>; eventId?: string; isPreview?: boolean }) => (
    <AnimatedGreeting theme={theme} data={props.data} isPreview={props.isPreview} />
  )
  Bound.displayName = `Greeting_${themeKey}`
  return Bound
}

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
