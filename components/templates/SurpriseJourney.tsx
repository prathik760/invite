'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

// WebGL stages are code-split so three.js only loads for this template,
// never for the other (2D) invitation templates sharing the /e route bundle.
const GiftBox3D = dynamic(() => import('./journey/GiftBox3D'), { ssr: false, loading: () => <CanvasFallback label="Wrapping your gift…" /> })
const Balloons3D = dynamic(() => import('./journey/Balloons3D'), { ssr: false, loading: () => <CanvasFallback label="Inflating balloons…" /> })

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const GOLD = '#E8B84B'

// ─── Types & helpers ──────────────────────────────────────────────────────────
type StageKey = 'gift' | 'pin' | 'photos' | 'balloons' | 'puzzle' | 'scratch' | 'letter'

const STAGES: { key: StageKey; label: string; emoji: string }[] = [
  { key: 'gift', label: 'Open', emoji: '🎁' },
  { key: 'pin', label: 'Unlock', emoji: '🔒' },
  { key: 'photos', label: 'Memories', emoji: '💕' },
  { key: 'balloons', label: 'Wishes', emoji: '🎈' },
  { key: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { key: 'scratch', label: 'Scratch', emoji: '✨' },
  { key: 'letter', label: 'Letter', emoji: '💌' },
]

function parseList(value?: string): string[] {
  if (!value?.trim()) return []
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

function CanvasFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8B84B]" />
      <p className="text-sm text-white/60">{label}</p>
    </div>
  )
}

// ─── Confetti burst (lightweight, framer-motion) ──────────────────────────────
function Confetti({ fire }: { fire: boolean }) {
  const pieces = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: (i * 53) % 100,
      color: ['#E4577B', '#E8B84B', '#5AB7C9', '#8E6BD1', '#57B98A'][i % 5],
      delay: (i % 10) * 0.03,
      rot: (i * 47) % 360,
    })),
    []
  )
  if (!fire) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-10%', x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 2.4, delay: p.delay, ease: 'easeIn' }}
          className="absolute h-2.5 w-2 rounded-[1px]"
          style={{ background: p.color, left: 0, top: 0 }}
        />
      ))}
    </div>
  )
}

// ─── Progress rail ────────────────────────────────────────────────────────────
function ProgressRail({ current }: { current: number }) {
  return (
    <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 items-center gap-1.5">
      {STAGES.map((s, i) => (
        <div
          key={s.key}
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: i === current ? 22 : 8,
            background: i <= current ? GOLD : 'rgba(255,255,255,0.22)',
          }}
        />
      ))}
    </div>
  )
}

// ─── Shared stage shell ───────────────────────────────────────────────────────
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: BEZIER }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-10 pt-16"
    >
      {children}
    </motion.div>
  )
}

function ContinueButton({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: BEZIER }}
      onClick={onClick}
      className="mt-8 rounded-full px-8 py-3 text-sm font-bold tracking-wide text-[#2a1420] shadow-lg transition-transform active:scale-95"
      style={{ background: `linear-gradient(135deg, ${GOLD}, #d89a2a)` }}
    >
      {label} →
    </motion.button>
  )
}

// ─── Stage 1: Gift box ────────────────────────────────────────────────────────
function GiftStage({ occasion, recipient, tagLine, onOpen }: {
  occasion: string; recipient: string; tagLine: string; onOpen: () => void
}) {
  const [opened, setOpened] = useState(false)
  return (
    <Stage>
      <div className="mb-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">{occasion}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">{recipient}</h1>
      </div>
      <div className="relative h-[46vh] max-h-[420px] w-full">
        <GiftBox3D onOpened={() => { setOpened(true); onOpen() }} />
      </div>
      <Confetti fire={opened} />
      {!opened && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-1 text-center text-sm text-white/70"
        >
          {tagLine || 'Tap the gift to open it 🎁'}
        </motion.p>
      )}
    </Stage>
  )
}

// ─── Stage 2: Secret PIN ──────────────────────────────────────────────────────
function PinStage({ pin, hint, onUnlock }: { pin: string; hint: string; onUnlock: () => void }) {
  const [entry, setEntry] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const target = pin.replace(/\s/g, '')

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
      <div className="text-5xl">{unlocked ? '🔓' : '🔒'}</div>
      <h2 className="mt-4 font-serif text-2xl font-bold text-white">Enter the secret code</h2>
      <p className="mt-1 text-sm text-white/60">Only they would know it 💫</p>

      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="mt-6 flex gap-2.5"
      >
        {Array.from({ length: target.length }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 w-3.5 rounded-full transition-all"
            style={{ background: i < entry.length ? GOLD : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="h-14 w-14 rounded-2xl text-xl font-semibold text-white transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => setShowHint((s) => !s)}
          className="h-14 w-14 rounded-2xl text-xs font-medium text-white/70 transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          Hint
        </button>
        <button
          onClick={() => press('0')}
          className="h-14 w-14 rounded-2xl text-xl font-semibold text-white transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          0
        </button>
        <button
          onClick={() => setEntry((e) => e.slice(0, -1))}
          className="h-14 w-14 rounded-2xl text-xl text-white/70 transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          ⌫
        </button>
      </div>

      <AnimatePresence>
        {showHint && hint && (
          <motion.p
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-5 max-w-xs text-center text-sm italic text-white/70"
          >
            💡 {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </Stage>
  )
}

// ─── Stage 3: Photo memories ──────────────────────────────────────────────────
function PhotosStage({ photos, onDone }: { photos: string[]; onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const list = photos.length ? photos : ['']
  const atEnd = index >= list.length - 1

  return (
    <Stage>
      <h2 className="mb-5 font-serif text-2xl font-bold text-white">Our favourite moments</h2>
      <div className="relative h-[46vh] max-h-[420px] w-full max-w-xs">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, rotate: -4, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, rotate: -2, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 4, y: -24, scale: 0.95 }}
            transition={{ duration: 0.5, ease: BEZIER }}
            className="absolute inset-0 rounded-lg bg-white p-3 pb-10 shadow-2xl"
            onClick={() => !atEnd && setIndex((i) => i + 1)}
          >
            {list[index] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={list[index]} alt={`Memory ${index + 1}`} className="h-full w-full rounded-sm object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-sm bg-gradient-to-br from-rose-200 to-amber-100 text-4xl">💕</div>
            )}
            <p className="absolute bottom-3 left-0 w-full text-center font-serif text-sm text-neutral-500">
              {index + 1} of {list.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-xs text-white/50">{atEnd ? '' : 'Tap the photo for the next memory'}</p>
      {atEnd && <ContinueButton onClick={onDone} label="Keep going" />}
    </Stage>
  )
}

// ─── Stage 4: Balloon wishes ──────────────────────────────────────────────────
function BalloonsStage({ messages, onDone }: { messages: string[]; onDone: () => void }) {
  const list = useMemo(() => (messages.length ? messages : ['A wish, just for you ✨']), [messages])
  const [toast, setToast] = useState<string | null>(null)
  const [poppedCount, setPoppedCount] = useState(0)

  const handlePop = useCallback((i: number) => {
    setToast(list[i % list.length])
    setPoppedCount((c) => c + 1)
  }, [list])

  return (
    <Stage>
      <h2 className="absolute top-14 z-20 w-full text-center font-serif text-2xl font-bold text-white">
        Pop a balloon 🎈
      </h2>
      <p className="absolute top-[5.6rem] z-20 w-full text-center text-xs text-white/50">
        {poppedCount} of {list.length} popped
      </p>
      <div className="absolute inset-0">
        <Balloons3D count={list.length} onPop={handlePop} onAllPopped={onDone} />
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: BEZIER }}
            className="absolute bottom-16 left-1/2 z-30 max-w-[80%] -translate-x-1/2 rounded-2xl px-5 py-3 text-center text-sm font-medium text-[#2a1420] shadow-xl"
            style={{ background: 'rgba(255,255,255,0.95)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}

// ─── Stage 5: Sliding puzzle ──────────────────────────────────────────────────
const SIZE = 3
function makeSolvableBoard(): number[] {
  // Start solved (8 = blank), then apply random legal moves — guarantees solvability.
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
      <h2 className="mb-1 font-serif text-2xl font-bold text-white">Unscramble the photo 🧩</h2>
      <p className="mb-5 text-xs text-white/50">{solved ? 'Perfect! 💛' : 'Tap a tile next to the gap'}</p>
      <div
        className="relative grid aspect-square w-full max-w-[320px] gap-1 rounded-xl p-1"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, background: 'rgba(255,255,255,0.06)' }}
      >
        {board.map((tile, idx) => {
          const isBlank = tile === SIZE * SIZE - 1
          if (isBlank && !solved) return <div key={idx} />
          const tr = Math.floor(tile / SIZE), tc = tile % SIZE
          return (
            <motion.button
              key={idx}
              layout
              transition={{ duration: 0.25, ease: BEZIER }}
              onClick={() => move(idx)}
              className="relative aspect-square overflow-hidden rounded-md"
              style={
                image
                  ? {
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${SIZE * 100}%  ${SIZE * 100}%`,
                      backgroundPosition: `${(tc / (SIZE - 1)) * 100}% ${(tr / (SIZE - 1)) * 100}%`,
                    }
                  : { background: `hsl(${(tile * 40) % 360} 60% 65%)` }
              }
            >
              {!image && <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white/90">{tile + 1}</span>}
            </motion.button>
          )
        })}
      </div>
      {solved && <Confetti fire={solved} />}
    </Stage>
  )
}

// ─── Stage 6: Scratch card ────────────────────────────────────────────────────
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
    // Gold foil overlay
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#d4a537'); grad.addColorStop(0.5, '#f3d980'); grad.addColorStop(1, '#c8912a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(90,60,10,0.55)'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('✨ Scratch here ✨', canvas.width / 2, canvas.height / 2)
  }, [])

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 24, 0, Math.PI * 2)
    ctx.fill()
    // Sample transparency to detect "enough scratched"
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
      <h2 className="mb-5 font-serif text-2xl font-bold text-white">A little secret 🤫</h2>
      <div className="relative h-52 w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-serif text-xl font-semibold text-[#b0324b]">
          {message || 'You are so loved ❤️'}
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
      <p className="mt-4 text-xs text-white/50">{revealed ? '' : 'Drag your finger to scratch it off'}</p>
      {revealed && <Confetti fire={revealed} />}
    </Stage>
  )
}

// ─── Stage 7: Handwritten letter ──────────────────────────────────────────────
function LetterStage({ body, signature, sender }: { body: string; signature: string; sender: string }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 2
      setShown(body.slice(0, i))
      if (i >= body.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [body])

  const done = shown.length >= body.length

  return (
    <Stage>
      <div className="w-full max-w-sm rounded-2xl px-6 py-8 shadow-2xl"
        style={{ background: 'linear-gradient(180deg,#fffdf7,#fbf4e6)', maxHeight: '72vh', overflowY: 'auto' }}
      >
        <div className="mb-4 text-center text-2xl">💌</div>
        <p className="whitespace-pre-wrap font-serif text-[15px] leading-7 text-neutral-700" style={{ fontFamily: 'Georgia, serif' }}>
          {shown}
          {!done && <span className="animate-pulse">|</span>}
        </p>
        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-6 text-right font-serif text-lg italic text-[#b0324b]"
            >
              {signature || `— ${sender}`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {done && (
        <motion.a
          href="/"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-white/40 underline underline-offset-4"
        >
          Made with ShareInvite — create your own
        </motion.a>
      )}
    </Stage>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SurpriseJourney({ data, isPreview }: {
  data: Record<string, string>; eventId?: string; isPreview?: boolean
}) {
  const [stage, setStage] = useState(0)
  const [muted, setMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const photos = useMemo(() => parseList(data.galleryImages), [data.galleryImages])
  const balloonMessages = useMemo(() => parseList(data.balloonMessages), [data.balloonMessages])
  const puzzleImage = photos[0] ?? ''

  const advance = useCallback(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), [])

  // Start music after the first gesture (opening the gift).
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

  const current = STAGES[stage].key

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        // Bounded preview: fill the phone-shell container (its stages are
        // absolute inset-0, so the root needs a definite height). Full page: 100svh.
        minHeight: isPreview ? '100%' : '100svh',
        height: isPreview ? '100%' : undefined,
        background: 'radial-gradient(120% 90% at 50% 0%, #3a1030 0%, #24102a 45%, #140a1c 100%)',
      }}
    >
      <ProgressRail current={stage} />

      {/* Music */}
      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl} loop muted={muted} />
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full text-white/80"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <div key={current} className="contents">
          {current === 'gift' && (
            <GiftStage
              occasion={data.occasion || 'A surprise for you'}
              recipient={data.recipientName || 'You'}
              tagLine={data.coverMessage || ''}
              onOpen={() => { startMusic(); setTimeout(advance, 1400) }}
            />
          )}
          {current === 'pin' && (
            <PinStage pin={data.pin || '0000'} hint={data.pinHint || ''} onUnlock={advance} />
          )}
          {current === 'photos' && <PhotosStage photos={photos} onDone={advance} />}
          {current === 'balloons' && <BalloonsStage messages={balloonMessages} onDone={advance} />}
          {current === 'puzzle' && <PuzzleStage image={puzzleImage} onDone={advance} />}
          {current === 'scratch' && <ScratchStage message={data.scratchMessage || ''} onDone={advance} />}
          {current === 'letter' && (
            <LetterStage body={data.letterBody || ''} signature={data.signature || ''} sender={data.senderName || ''} />
          )}
        </div>
      </AnimatePresence>

      {/* Skip control in editor preview so the creator can inspect every stage fast */}
      {isPreview && (
        <button
          onClick={advance}
          className="absolute bottom-4 right-4 z-30 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/70"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          Skip stage →
        </button>
      )}
    </div>
  )
}
