'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { caveat } from './kit/fonts/caveat'
import { fraunces } from './kit/fonts/fraunces'
import { jost } from './kit/fonts/jost'
import { Credit } from './kit/ui'
import { SceneBoundary, useWebGL } from './kit/webgl'

// WebGL stages are code-split so three.js only loads for this template.
const GiftBox3D = dynamic(() => import('./journey/GiftBox3D'), { ssr: false, loading: () => <Loading label="Wrapping your gift…" /> })
const Balloons3D = dynamic(() => import('./journey/Balloons3D'), { ssr: false, loading: () => <Loading label="Blowing up balloons…" /> })

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const GOLD = '#EBC37A'
const ROSE = '#C9405F'
const display = fraunces.style.fontFamily
const hand = caveat.style.fontFamily
const sans = jost.style.fontFamily

type StageKey = 'gift' | 'pin' | 'photos' | 'balloons' | 'puzzle' | 'scratch' | 'letter'

function parseList(value?: string): string[] {
  if (!value?.trim()) return []
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

function Loading({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15" style={{ borderTopColor: GOLD }} />
      <p className="text-[13px] text-white/60" style={{ fontFamily: sans }}>{label}</p>
    </div>
  )
}

function Confetti({ fire }: { fire: boolean }) {
  const pieces = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({
      id: i, x: (i * 53) % 100, color: [ROSE, GOLD, '#5AB7C9', '#8E6BD1', '#57B98A'][i % 5], delay: (i % 10) * 0.03, rot: (i * 47) % 360,
    })),
    [],
  )
  if (!fire) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-10%', x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 2.4, delay: p.delay, ease: 'easeIn' }}
          className="absolute h-2.5 w-1.5"
          style={{ background: p.color, left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-10 pt-16 text-center"
    >
      {children}
    </motion.div>
  )
}

function Title({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-white" style={{ fontFamily: display, fontWeight: 500, fontSize: 30, lineHeight: 1.1 }}>{children}</h2>
      {sub && <p className="mt-2 text-[14px] text-white/65" style={{ fontFamily: sans }}>{sub}</p>}
    </div>
  )
}

function Next({ onClick, children = 'Continue' }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
      onClick={onClick}
      className="mt-8 rounded-full px-8 py-3.5 text-[15px] font-medium active:scale-[0.97]"
      style={{ background: GOLD, color: '#2A1420', fontFamily: sans }}
    >
      {children}
    </motion.button>
  )
}

// ─── 2D stand-ins when the phone can't do WebGL ───────────────────────────────
function GiftBox2D({ onOpened }: { onOpened: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      aria-label="Open the gift"
      onClick={() => { if (!open) { setOpen(true); setTimeout(onOpened, 650) } }}
      className="mx-auto block h-full max-h-[300px] w-full"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <ellipse cx="100" cy="182" rx="62" ry="8" fill="rgba(0,0,0,0.3)" />
        <rect x="42" y="92" width="116" height="86" rx="4" fill={ROSE} />
        <rect x="92" y="92" width="16" height="86" fill={GOLD} />
        <g style={{ transformOrigin: '100px 92px', transform: open ? 'translateY(-46px) rotate(-14deg)' : 'none', transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)' }}>
          <rect x="34" y="70" width="132" height="26" rx="4" fill="#B3324F" />
          <rect x="92" y="70" width="16" height="26" fill={GOLD} />
          <path d="M100 70 C 76 44, 58 58, 76 70 Z M100 70 C 124 44, 142 58, 124 70 Z" fill={GOLD} />
        </g>
      </svg>
    </button>
  )
}

const BALLOON_COLORS = [ROSE, '#E8A33D', '#5AB7C9', '#8E6BD1', '#57B98A', '#F08A6C']
function Balloons2D({ count, onPop, onAllPopped }: { count: number; onPop: (i: number) => void; onAllPopped: () => void }) {
  const [popped, setPopped] = useState<boolean[]>(() => Array(count).fill(false))
  const pop = (i: number) => {
    if (popped[i]) return
    const next = [...popped]
    next[i] = true
    setPopped(next)
    onPop(i)
    if (next.every(Boolean)) setTimeout(onAllPopped, 700)
  }
  return (
    <div className="absolute inset-x-0 top-[26%] flex flex-wrap justify-center gap-x-3 gap-y-6 px-6">
      <style>{`@keyframes sj-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }`}</style>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Pop balloon ${i + 1}`}
          onClick={() => pop(i)}
          style={{ animation: `sj-bob ${3 + (i % 3) * 0.6}s ease-in-out ${i * 0.3}s infinite`, visibility: popped[i] ? 'hidden' : 'visible' }}
        >
          <svg viewBox="0 0 60 110" width="60" height="110" aria-hidden>
            <path d="M30 4 C 50 4, 56 26, 52 40 C 48 56, 36 66, 30 68 C 24 66, 12 56, 8 40 C 4 26, 10 4, 30 4 Z" fill={BALLOON_COLORS[i % BALLOON_COLORS.length]} />
            <path d="M18 18 C 16 24, 16 30, 18 34" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M27 68 L33 68 L30 73 Z" fill={BALLOON_COLORS[i % BALLOON_COLORS.length]} />
            <path d="M30 73 C 26 84, 34 92, 30 108" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ─── Stages ───────────────────────────────────────────────────────────────────
function GiftStage({ occasion, recipient, tagLine, has3D, onFail, onOpen }: {
  occasion: string; recipient: string; tagLine: string; has3D: boolean; onFail: () => void; onOpen: () => void
}) {
  const [opened, setOpened] = useState(false)
  const handle = () => { setOpened(true); onOpen() }
  return (
    <Stage>
      <p className="italic text-white/70" style={{ fontFamily: display, fontSize: 19 }}>{occasion}</p>
      <h1 className="mt-1" style={{ color: GOLD, fontFamily: hand, fontSize: 'clamp(44px, 13cqi, 60px)', lineHeight: 1 }}>{recipient}</h1>
      <div className="relative mt-4 h-[44svh] max-h-[400px] w-full">
        {has3D ? (
          <SceneBoundary fallback={<GiftBox2D onOpened={handle} />} onError={onFail}>
            <GiftBox3D onOpened={handle} />
          </SceneBoundary>
        ) : (
          <GiftBox2D onOpened={handle} />
        )}
      </div>
      <Confetti fire={opened} />
      {!opened && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-2 max-w-[18rem] text-[15px] text-white/75" style={{ fontFamily: sans }}>
          {tagLine || 'Tap the gift to open it'}
        </motion.p>
      )}
    </Stage>
  )
}

function Key({ onClick, children, quiet, label }: { onClick: () => void; children: React.ReactNode; quiet?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center rounded-full text-[22px] text-white transition-transform active:scale-90"
      style={{ fontFamily: sans, background: quiet ? 'transparent' : 'rgba(255,255,255,0.08)', border: quiet ? 'none' : '1px solid rgba(255,255,255,0.14)' }}
    >
      {children}
    </button>
  )
}

function PinStage({ pin, hint, onUnlock }: { pin: string; hint: string; onUnlock: () => void }) {
  const [entry, setEntry] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const target = pin.replace(/\s/g, '') || '0000'

  const press = (d: string) => {
    if (unlocked) return
    const next = (entry + d).slice(0, target.length)
    setEntry(next)
    if (next.length === target.length) {
      if (next === target) {
        setUnlocked(true)
        setTimeout(onUnlock, 900)
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setEntry('') }, 500)
      }
    }
  }

  return (
    <Stage>
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke={GOLD} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
        <rect x="10" y="21" width="28" height="20" rx="3" />
        <path d={unlocked ? 'M16 21v-5a8 8 0 0 1 15.5-2.8' : 'M16 21v-5a8 8 0 0 1 16 0v5'} />
        <circle cx="24" cy="31" r="2" fill={GOLD} />
      </svg>
      <div className="mt-4"><Title sub="Only you would know it">Enter the secret code</Title></div>

      <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="flex gap-3" aria-live="polite">
        {Array.from({ length: target.length }).map((_, i) => (
          <span key={i} className="block h-3 w-3 rounded-full transition-colors" style={{ background: i < entry.length ? GOLD : 'rgba(255,255,255,0.22)' }} />
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <Key key={d} onClick={() => press(d)}>{d}</Key>)}
        <Key quiet onClick={() => setShowHint((s) => !s)}><span className="text-[13px] text-white/70">Hint</span></Key>
        <Key onClick={() => press('0')}>0</Key>
        <Key quiet label="Delete" onClick={() => setEntry((e) => e.slice(0, -1))}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden>
            <path d="M9 5h11v14H9l-6-7z" /><path strokeLinecap="round" d="m12 9 5 6m0-6-5 6" />
          </svg>
        </Key>
      </div>

      <AnimatePresence>
        {showHint && hint && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-6 max-w-xs text-white/80" style={{ fontFamily: hand, fontSize: 24 }}>
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </Stage>
  )
}

function PhotosStage({ photos, onDone }: { photos: string[]; onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const atEnd = index >= photos.length - 1
  return (
    <Stage>
      <Title>Our favourite moments</Title>
      <div className="relative h-[46svh] max-h-[420px] w-full max-w-[300px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, rotate: -4, y: 24 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            exit={{ opacity: 0, rotate: 4, y: -24 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 bg-[#FBF8F2] p-3 pb-12"
            style={{ boxShadow: '0 26px 50px -24px rgba(0,0,0,0.7)' }}
            onClick={() => !atEnd && setIndex((i) => i + 1)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[index]} alt={`Memory ${index + 1}`} className="h-full w-full object-cover" />
            <p className="absolute bottom-2.5 left-0 w-full text-center text-[#3a3230]" style={{ fontFamily: hand, fontSize: 22 }}>
              {index + 1} / {photos.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-5 text-[14px] text-white/60" style={{ fontFamily: sans }}>{atEnd ? '' : 'Tap the photo for the next one'}</p>
      {atEnd && <Next onClick={onDone}>Keep going</Next>}
    </Stage>
  )
}

function BalloonsStage({ messages, has3D, onFail, onDone }: { messages: string[]; has3D: boolean; onFail: () => void; onDone: () => void }) {
  const list = useMemo(() => (messages.length ? messages : ['A wish, just for you']), [messages])
  const [toast, setToast] = useState<string | null>(null)
  const [poppedCount, setPoppedCount] = useState(0)

  const handlePop = useCallback((i: number) => {
    setToast(list[i % list.length])
    setPoppedCount((c) => c + 1)
  }, [list])

  const flat = <Balloons2D count={list.length} onPop={handlePop} onAllPopped={onDone} />
  return (
    <Stage>
      <div className="absolute top-14 z-20 w-full">
        <Title sub={`${poppedCount} of ${list.length} popped`}>Pop a balloon</Title>
      </div>
      <div className="absolute inset-0">
        {has3D ? (
          <SceneBoundary fallback={flat} onError={onFail}>
            <Balloons3D count={list.length} onPop={handlePop} onAllPopped={onDone} />
          </SceneBoundary>
        ) : flat}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute bottom-16 left-1/2 z-30 w-[82%] max-w-[22rem] -translate-x-1/2 bg-[#FBF7EE] px-5 py-4 text-[#2d2a33]"
            style={{ fontFamily: hand, fontSize: 26, lineHeight: 1.15, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}

const SIZE = 3
function makeSolvableBoard(): number[] {
  // Start solved (8 = blank), then apply legal moves — always solvable.
  const board = Array.from({ length: SIZE * SIZE }, (_, i) => i)
  let blank = SIZE * SIZE - 1
  for (let n = 0; n < 80; n++) {
    const r = Math.floor(blank / SIZE)
    const c = blank % SIZE
    const moves: number[] = []
    if (r > 0) moves.push(blank - SIZE)
    if (r < SIZE - 1) moves.push(blank + SIZE)
    if (c > 0) moves.push(blank - 1)
    if (c < SIZE - 1) moves.push(blank + 1)
    const pick = moves[(n * 7 + blank * 3) % moves.length]
    ;[board[blank], board[pick]] = [board[pick], board[blank]]
    blank = pick
  }
  return board
}

function PuzzleStage({ image, onDone }: { image: string; onDone: () => void }) {
  const [board, setBoard] = useState<number[]>(() => makeSolvableBoard())
  const solved = board.every((v, i) => v === i)

  const move = (idx: number) => {
    if (solved) return
    const blank = board.indexOf(SIZE * SIZE - 1)
    const r1 = Math.floor(idx / SIZE), c1 = idx % SIZE
    const r2 = Math.floor(blank / SIZE), c2 = blank % SIZE
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return
    const next = [...board]
    ;[next[idx], next[blank]] = [next[blank], next[idx]]
    setBoard(next)
  }

  useEffect(() => {
    if (solved) { const t = setTimeout(onDone, 1600); return () => clearTimeout(t) }
  }, [solved, onDone])

  return (
    <Stage>
      <Title sub={solved ? 'Perfect.' : 'Tap a tile next to the gap'}>Put the photo back together</Title>
      <div
        className="relative grid aspect-square w-full max-w-[320px] gap-1 p-1"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, background: 'rgba(255,255,255,0.08)' }}
      >
        {board.map((tile, idx) => {
          const isBlank = tile === SIZE * SIZE - 1
          if (isBlank && !solved) return <div key={idx} />
          const tr = Math.floor(tile / SIZE), tc = tile % SIZE
          return (
            <motion.button
              key={idx}
              type="button"
              layout
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => move(idx)}
              aria-label={`Tile ${tile + 1}`}
              className="relative aspect-square overflow-hidden"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                backgroundPosition: `${(tc / (SIZE - 1)) * 100}% ${(tr / (SIZE - 1)) * 100}%`,
              }}
            />
          )
        })}
      </div>
      {solved && <Confetti fire={solved} />}
    </Stage>
  )
}

function ScratchStage({ message, onDone }: { message: string; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#caa05a'); grad.addColorStop(0.5, '#ecd296'); grad.addColorStop(1, '#bd8f45')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(70,45,10,0.55)'
    ctx.font = '500 17px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Scratch here', canvas.width / 2, canvas.height / 2 + 6)
  }, [])

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 24, 0, Math.PI * 2)
    ctx.fill()
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    for (let i = 3; i < data.length; i += 40) if (data[i] === 0) clear++
    if (clear / (data.length / 40) > 0.55) {
      setRevealed(true)
      setTimeout(onDone, 1800)
    }
  }

  return (
    <Stage>
      <Title>A little secret</Title>
      <div className="relative h-52 w-full max-w-xs overflow-hidden bg-[#FBF7EE]" style={{ boxShadow: '0 26px 50px -24px rgba(0,0,0,0.7)' }}>
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center" style={{ color: ROSE, fontFamily: hand, fontSize: 34, lineHeight: 1.1 }}>
          {message || 'You are so loved'}
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          style={{ opacity: revealed ? 0 : 1, transition: 'opacity 0.6s' }}
          onPointerDown={(e) => { drawing.current = true; scratch(e) }}
          onPointerMove={scratch}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
        />
      </div>
      <p className="mt-5 text-[14px] text-white/60" style={{ fontFamily: sans }}>{revealed ? '' : 'Drag your finger across the card'}</p>
      {revealed && <Confetti fire={revealed} />}
    </Stage>
  )
}

function LetterStage({ body, signature, sender, isPreview }: { body: string; signature: string; sender: string; isPreview?: boolean }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 2
      setShown(body.slice(0, i))
      if (i >= body.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [body])
  const done = shown.length >= body.length

  return (
    <Stage>
      <div
        onClick={() => setShown(body)}
        className="w-full max-w-[23rem] text-left"
        style={{
          background: '#FBF7EE',
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 33px, rgba(80,110,160,0.14) 33px 34px)',
          padding: '26px 24px',
          maxHeight: '70svh',
          overflowY: 'auto',
          transform: 'rotate(-0.6deg)',
          boxShadow: '0 30px 60px -28px rgba(0,0,0,0.75)',
        }}
      >
        <p className="whitespace-pre-wrap text-[#2d2a33]" style={{ fontFamily: hand, fontSize: 24, lineHeight: '34px' }}>
          {shown}
          {!done && <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-[#2d2a33] align-middle" />}
        </p>
        <AnimatePresence>
          {done && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-[34px] text-right" style={{ color: ROSE, fontFamily: hand, fontSize: 28, lineHeight: '34px' }}>
              {signature || (sender ? `— ${sender}` : '')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
          <Credit isPreview={isPreview} color="rgba(255,255,255,0.45)" linkColor="rgba(255,255,255,0.8)" />
        </motion.div>
      )}
    </Stage>
  )
}

// ─── The journey ──────────────────────────────────────────────────────────────
export default function SurpriseJourney({ data, isPreview }: {
  data: Record<string, string>; eventId?: string; isPreview?: boolean
}) {
  const webgl = useWebGL()
  const [sceneFailed, setSceneFailed] = useState(false)
  const has3D = webgl === true && !sceneFailed
  const [stage, setStage] = useState(0)
  const [muted, setMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const photos = useMemo(() => parseList(data.galleryImages).filter((u) => /^(https?:)?\//.test(u)), [data.galleryImages])
  const balloonMessages = useMemo(() => parseList(data.balloonMessages), [data.balloonMessages])

  // Photo and puzzle stages need a photo; without one they are skipped rather
  // than shown with a placeholder.
  const stages = useMemo<StageKey[]>(
    () => ['gift', 'pin', ...(photos.length ? (['photos'] as StageKey[]) : []), 'balloons', ...(photos.length ? (['puzzle'] as StageKey[]) : []), 'scratch', 'letter'],
    [photos.length],
  )
  const advance = useCallback(() => setStage((s) => Math.min(s + 1, stages.length - 1)), [stages.length])

  const startMusic = useCallback(() => {
    if (!data.musicUrl || !audioRef.current) return
    audioRef.current.muted = false
    setMuted(false)
    audioRef.current.play().catch(() => {})
  }, [data.musicUrl])

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !muted
    audioRef.current.muted = next
    if (!next) audioRef.current.play().catch(() => {})
    setMuted(next)
  }

  const current = stages[Math.min(stage, stages.length - 1)]
  const fail = () => setSceneFailed(true)

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: isPreview ? '100%' : '100svh',
        height: isPreview ? '100%' : undefined,
        background: 'radial-gradient(120% 90% at 50% 0%, #3a1030 0%, #24102a 45%, #140a1c 100%)',
        containerType: 'inline-size',
      }}
    >
      <div className="greet-grain" style={{ zIndex: 1 }} />

      <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 items-center gap-1.5" aria-hidden>
        {stages.map((s, i) => (
          <span key={s} className="block h-[3px] rounded-full transition-all duration-500"
            style={{ width: i === stage ? 22 : 8, background: i <= stage ? GOLD : 'rgba(255,255,255,0.22)' }} />
        ))}
      </div>

      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl} loop muted={muted} />
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Play music' : 'Mute music'}
            className="absolute right-4 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full text-white/85"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path strokeLinejoin="round" d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
              {muted ? <path strokeLinecap="round" d="m16 10 4 4m0-4-4 4" /> : <path strokeLinecap="round" d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />}
            </svg>
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <div key={current} className="contents">
          {current === 'gift' && (
            <GiftStage
              occasion={data.occasion || 'A surprise for you'}
              recipient={data.recipientName || 'you'}
              tagLine={data.coverMessage || ''}
              has3D={has3D}
              onFail={fail}
              onOpen={() => { startMusic(); setTimeout(advance, 1400) }}
            />
          )}
          {current === 'pin' && <PinStage pin={data.pin || '0000'} hint={data.pinHint || ''} onUnlock={advance} />}
          {current === 'photos' && <PhotosStage photos={photos} onDone={advance} />}
          {current === 'balloons' && <BalloonsStage messages={balloonMessages} has3D={has3D} onFail={fail} onDone={advance} />}
          {current === 'puzzle' && <PuzzleStage image={photos[0]} onDone={advance} />}
          {current === 'scratch' && <ScratchStage message={data.scratchMessage || ''} onDone={advance} />}
          {current === 'letter' && (
            <LetterStage body={data.letterBody || ''} signature={data.signature || ''} sender={data.senderName || ''} isPreview={isPreview} />
          )}
        </div>
      </AnimatePresence>

      {/* Editor-only skip so the creator can inspect every stage quickly. */}
      {isPreview && (
        <button type="button" onClick={advance}
          className="absolute bottom-4 right-4 z-30 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/75"
          style={{ background: 'rgba(255,255,255,0.12)', fontFamily: sans }}>
          Skip
        </button>
      )}
    </div>
  )
}
