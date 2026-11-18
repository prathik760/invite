'use client'

import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { caveat } from './kit/fonts/caveat'
import { pinyon } from './kit/fonts/pinyon'
import { cormorant } from './kit/fonts/cormorant'
import { Credit, MusicToggle } from './kit/ui'
import { galleryImages, parseLines, whatsappHref, type InviteProps } from './kit/core'

/*
 * Confession: a love letter that asks the question (Valentine's Day, 2027).
 *
 * One design in two voices, each its own card in the catalogue: "for her" (written by him: blush,
 * cream paper, a red wax seal) and "for him" (written by her: a midnight envelope, gold, a deep
 * red seal). A guest opens it in three moments:
 *
 *   1  A sealed envelope addressed to them. A tap breaks the seal (and starts the song): the flap
 *      lifts, the letter rises out, and the page turns to it.
 *   2  The letter, in handwriting, one line at a time, with up to three photos and the sender's
 *      name. Under it, the question: a Yes that grows each time the No is tried, and a No that
 *      jumps away from every tap and, after a few tries, runs off altogether.
 *   3  Yes: a burst of hearts, "you just made {sender} very happy", a button that sends the yes
 *      to the sender on WhatsApp, and their plan for the day, kept a surprise until then.
 *
 * The builder's preview (isPreview) shows all three at once, still, so the writer sees everything
 * they type. Nothing here asks a guest for anything: the reply is a message they choose to send.
 */

type Voice = 'him' | 'her'

interface Theme {
  bg: string
  coverInk: string
  coverSoft: string
  paper: string
  ink: string
  soft: string
  accent: string
  accentDeep: string
  hearts: string
  seal: string
  sealHeart: string
  envelope: string
  pocket: string
  flap: string
}

const THEMES: Record<Voice, Theme> = {
  // Written by him, for her.
  him: {
    bg: '#F6E2DE',
    coverInk: '#3A1420',
    coverSoft: 'rgba(58,20,32,0.66)',
    paper: '#FFFBF6',
    ink: '#3A1420',
    soft: 'rgba(58,20,32,0.72)',
    accent: '#C2334E',
    accentDeep: '#9E2139',
    hearts: '#E58A9C',
    seal: '#B32541',
    sealHeart: '#F7C9D1',
    envelope: '#EFCFC7',
    pocket: '#F5DCD5',
    flap: '#E6BDB4',
  },
  // Written by her, for him.
  her: {
    bg: '#121A38',
    coverInk: '#F5EBD6',
    coverSoft: 'rgba(245,235,214,0.7)',
    paper: '#FBF5E8',
    ink: '#1B2240',
    soft: 'rgba(27,34,64,0.74)',
    accent: '#B8892F',
    accentDeep: '#8E6A22',
    hearts: '#C9A24A',
    seal: '#8E1B35',
    sealHeart: '#E9D39A',
    envelope: '#26325F',
    pocket: '#2C3970',
    flap: '#1F2A54',
  },
}

const SAMPLE: Record<Voice, { to: string; from: string }> = {
  him: { to: 'Isha', from: 'Neel' },
  her: { to: 'Neel', from: 'Isha' },
}

/** What the No says each time it is tried, before it gives up. */
const NO_LABELS = ['No', 'Are you sure?', 'Think again 🥺', 'Really?', 'Pretty please?', 'Last chance…']

const hand = caveat.style.fontFamily
const script = pinyon.style.fontFamily
const serif = cormorant.style.fontFamily

function HeartShape({ size = 16, color, style, className }: { size?: number; color: string; style?: CSSProperties; className?: string }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={size * 0.92} className={className} style={style} aria-hidden>
      <path d="M12 21.6 10.3 20C4.2 14.5.2 10.9.2 6.5.2 2.9 3 .2 6.5.2c2 0 3.9.9 5.5 2.4C13.6 1.1 15.5.2 17.5.2 21 .2 23.8 2.9 23.8 6.5c0 4.4-4 8-10.1 13.5Z" fill={color} />
    </svg>
  )
}

/** Small hearts drifting up behind a scene: decoration only. */
function RisingHearts({ color, count = 14 }: { color: string; count?: number }) {
  const hearts = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ left: (i * 37) % 100, size: 10 + ((i * 7) % 14), delay: (i * 1.3) % 9, dur: 9 + ((i * 3) % 7) })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span key={i} className="cf-rise absolute bottom-[-30px]" style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s` }}>
          <HeartShape size={h.size} color={color} style={{ opacity: 0.45 }} />
        </span>
      ))}
    </div>
  )
}

/** The burst of hearts when the answer is yes. */
function Burst({ color, accent }: { color: string; accent: string }) {
  const bits = useMemo(
    () => Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2
      const dist = 110 + ((i * 53) % 120)
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, size: 12 + ((i * 11) % 18), delay: (i % 7) * 0.04, tone: i % 3 === 0 ? accent : color }
    }),
    [color, accent],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%]">
      {bits.map((b, i) => (
        <span
          key={i}
          className="cf-burst absolute"
          style={{ ['--x' as string]: `${b.x}px`, ['--y' as string]: `${b.y}px`, animationDelay: `${b.delay}s` }}
        >
          <HeartShape size={b.size} color={b.tone} />
        </span>
      ))}
    </div>
  )
}

/** The sealed envelope: its seal is the button that opens the letter. */
function Envelope({ to, t, opening, onOpen, still }: { to: string; t: Theme; opening: boolean; onOpen?: () => void; still: boolean }) {
  return (
    <div className="relative mx-auto" style={{ width: 'min(80cqi, 330px)', aspectRatio: '3 / 2', perspective: 900 }}>
      <div className="absolute inset-0 rounded-[12px]" style={{ background: t.envelope, boxShadow: '0 30px 60px -28px rgba(0,0,0,0.45)' }} />
      {/* The letter inside, which rises out as the flap lifts. */}
      <div
        className={`absolute inset-x-[7%] top-[7%] bottom-[8%] rounded-[6px] ${opening ? 'cf-letter-out' : ''}`}
        style={{ background: t.paper, zIndex: opening ? 4 : 1, boxShadow: '0 6px 18px -10px rgba(0,0,0,0.3)' }}
      >
        <div className="mx-auto mt-[12%] h-[3px] w-[52%] rounded" style={{ background: `${t.ink}22` }} />
        <div className="mx-auto mt-[6%] h-[3px] w-[64%] rounded" style={{ background: `${t.ink}18` }} />
        <div className="mx-auto mt-[6%] h-[3px] w-[44%] rounded" style={{ background: `${t.ink}14` }} />
      </div>
      <div
        className="absolute inset-0 rounded-[12px]"
        style={{ background: t.pocket, clipPath: 'polygon(0 34%, 50% 66%, 100% 34%, 100% 100%, 0 100%)', zIndex: 2 }}
      />
      <div
        className="cf-flap absolute inset-x-0 top-0 h-[64%] rounded-t-[12px]"
        style={{
          background: t.flap,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          transformOrigin: 'top center',
          transform: opening ? 'rotateX(180deg)' : 'none',
          zIndex: opening ? 0 : 3,
        }}
      />
      <button
        type="button"
        onClick={onOpen}
        disabled={still || opening}
        aria-label={`Open the letter for ${to}`}
        className={`absolute left-1/2 top-[64%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${still ? '' : 'cf-pulse cursor-pointer'} ${opening ? 'cf-seal-break' : ''}`}
        style={{
          width: 'clamp(58px, 18cqi, 74px)',
          height: 'clamp(58px, 18cqi, 74px)',
          background: `radial-gradient(circle at 35% 30%, ${t.seal}, ${t.seal} 55%, rgba(0,0,0,0.25) 100%)`,
          boxShadow: '0 6px 14px -4px rgba(0,0,0,0.45), inset 0 -3px 6px rgba(0,0,0,0.25)',
          zIndex: 5,
        }}
      >
        <HeartShape size={26} color={t.sealHeart} />
      </button>
    </div>
  )
}

function Confession({ data, isPreview = false, voice }: InviteProps & { voice: Voice }) {
  const t = THEMES[voice]
  const to = data.recipientName?.trim() || SAMPLE[voice].to
  const from = data.senderName?.trim() || SAMPLE[voice].from
  const lines = useMemo(() => parseLines(data.message), [data.message])
  const question = data.question?.trim() || 'Will you be my Valentine?'
  const plan = data.plan?.trim() || ''
  const photos = useMemo(() => galleryImages(data.galleryImages, 3), [data.galleryImages])
  const reply = whatsappHref(data.replyNumber, `Yes! 💖 I read your letter. – ${to}`)
  const still = isPreview

  const rootRef = useRef<HTMLDivElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const yesPressed = useRef(false)
  const noPressed = useRef(false)
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [tries, setTries] = useState(0)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)

  // The seal is the guest's tap: the song may start with it.
  const open = () => {
    if (opening) return
    setOpening(true)
    rootRef.current?.querySelector('audio')?.play().catch(() => {})
    window.setTimeout(() => {
      setOpened(true)
      rootRef.current?.scrollIntoView({ block: 'start' })
    }, 1400)
  }

  // The No jumps somewhere else in its corner of the page, every time it is tried.
  const dodge = () => {
    if (still) return
    const arena = arenaRef.current
    if (!arena) return
    const w = arena.clientWidth
    const h = arena.clientHeight
    const next = tries + 1
    setTries(next)
    const x = Math.round(Math.random() * Math.max(0, w - 150))
    const y = Math.round(Math.random() * Math.max(0, h - 50))
    setNoPos({ x, y })
  }
  const noGone = tries >= NO_LABELS.length
  const yesScale = Math.min(1 + tries * 0.14, 1.75)

  const showCover = still || !opened
  const showLetter = still || opened

  const Yes = (
    <div className="relative px-6 pb-12 pt-6 text-center" style={{ color: t.coverInk }}>
      {!still && <Burst color={t.hearts} accent={t.accent} />}
      <p className="cf-pop leading-none" style={{ fontFamily: script, fontSize: 'clamp(64px, 22cqi, 96px)', color: t.coverInk === '#F5EBD6' ? t.sealHeart : t.accent }}>
        Yes!
      </p>
      <p className="mx-auto mt-5 max-w-[22rem] text-balance" style={{ fontFamily: serif, fontSize: 'clamp(20px, 6cqi, 26px)', lineHeight: 1.35 }}>
        You just made {from} very, very happy.
      </p>
      {plan && (
        <div className="mx-auto mt-7 max-w-[22rem] rounded-2xl px-5 py-4 text-left" style={{ background: t.paper, color: t.ink }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: t.accent }}>Your date</p>
          <p className="mt-1.5" style={{ fontFamily: hand, fontSize: 'clamp(22px, 6.4cqi, 26px)', lineHeight: 1.3 }}>{plan}</p>
        </div>
      )}
      {reply ? (
        <a
          href={still ? undefined : reply}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-7 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold shadow-lg"
          style={{ background: '#25D366', color: '#0B2A17' }}
        >
          Tell {from} on WhatsApp
        </a>
      ) : (
        <p className="mt-7 text-[15px]" style={{ color: t.coverSoft }}>Now go and tell {from}. 💌</p>
      )}
      {!still && (
        <button type="button" onClick={() => setAnswered(false)} className="mx-auto mt-5 block text-[13px] underline underline-offset-4" style={{ color: t.coverSoft }}>
          Read the letter again
        </button>
      )}
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={`cf relative overflow-hidden ${still ? '' : 'min-h-[100svh]'}`}
      style={{ background: t.bg, containerType: 'inline-size', fontFamily: serif }}
    >
      <style>{`
        .cf .cf-rise { animation: cf-rise linear infinite; }
        @keyframes cf-rise { from { transform: translateY(0) rotate(-8deg); opacity: 0; } 12% { opacity: 1; } to { transform: translateY(-115svh) rotate(10deg); opacity: 0; } }
        .cf .cf-pulse { animation: cf-pulse 1.8s ease-in-out infinite; }
        @keyframes cf-pulse { 0%, 100% { box-shadow: 0 6px 14px -4px rgba(0,0,0,0.45), 0 0 0 0 rgba(255,255,255,0.45); } 50% { box-shadow: 0 6px 14px -4px rgba(0,0,0,0.45), 0 0 0 14px rgba(255,255,255,0); } }
        .cf .cf-flap { transition: transform 700ms cubic-bezier(.5,0,.3,1), z-index 0s 350ms; }
        .cf .cf-seal-break { animation: cf-seal 600ms ease-in forwards; }
        @keyframes cf-seal { to { transform: translate(-50%, 20%) scale(0.4) rotate(40deg); opacity: 0; } }
        .cf .cf-letter-out { animation: cf-out 800ms 550ms cubic-bezier(.3,.7,.3,1) both; }
        @keyframes cf-out { to { transform: translateY(-62%); } }
        .cf .cf-line { animation: cf-up 900ms cubic-bezier(.2,.7,.3,1) both; }
        @keyframes cf-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .cf .cf-burst { animation: cf-burst 1300ms cubic-bezier(.15,.75,.3,1) both; }
        @keyframes cf-burst { from { transform: translate(-50%, -50%) scale(0.2); opacity: 1; } to { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1); opacity: 0; } }
        .cf .cf-pop { animation: cf-pop 700ms cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes cf-pop { from { transform: scale(0.3); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .cf .cf-rise, .cf .cf-pulse, .cf .cf-line, .cf .cf-burst, .cf .cf-pop, .cf .cf-letter-out, .cf .cf-seal-break { animation: none !important; }
          .cf .cf-flap { transition: none; }
        }
      `}</style>

      <MusicToggle src={data.musicUrl} isPreview={isPreview} color={t.coverInk} background={voice === 'her' ? 'rgba(18,26,56,0.75)' : 'rgba(255,251,246,0.85)'} border={voice === 'her' ? 'rgba(201,162,74,0.45)' : 'rgba(194,51,78,0.3)'} />

      {/* 1  The sealed envelope. */}
      {showCover && (
        <section className={`relative flex flex-col items-center justify-center px-5 text-center ${still ? 'py-14' : 'min-h-[100svh] py-16'}`}>
          {!still && <RisingHearts color={t.hearts} />}
          <p className="relative text-[12px] font-semibold uppercase tracking-[0.32em]" style={{ color: t.coverSoft, fontFamily: 'system-ui, sans-serif' }}>
            A letter for
          </p>
          <h1 className="relative mt-2 leading-none" style={{ fontFamily: script, fontSize: 'clamp(52px, 18cqi, 84px)', color: t.coverInk }}>
            {to}
          </h1>
          <div className="relative mt-10 w-full">
            <Envelope to={to} t={t} opening={opening} onOpen={open} still={still} />
          </div>
          <p className="relative mt-8 text-[14px]" style={{ color: t.coverSoft, fontFamily: 'system-ui, sans-serif' }}>
            {still ? 'Your guest taps the seal to open it' : 'Tap the seal to open'}
          </p>
          {photos.length > 0 && !still && <span className="sr-only">Photos inside</span>}
        </section>
      )}

      {/* 2  The letter, then the question. */}
      {showLetter && (
        <>
          <section className="relative px-4 pb-10 pt-12">
            <article
              className="relative mx-auto max-w-[30rem] rounded-[6px] px-6 pb-10 pt-9 sm:px-9"
              style={{ background: t.paper, color: t.ink, boxShadow: '0 28px 60px -30px rgba(0,0,0,0.45)', backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${t.accent}0D, transparent 60%)` }}
            >
              <HeartShape size={22} color={t.accent} className="mx-auto block" />
              <p className={`mt-5 leading-none ${still ? '' : 'cf-line'}`} style={{ fontFamily: script, fontSize: 'clamp(38px, 12cqi, 52px)', color: t.accentDeep }}>
                {to},
              </p>
              <div className="mt-5 space-y-3" style={{ fontFamily: hand, fontSize: 'clamp(21px, 6.2cqi, 25px)', lineHeight: 1.45 }}>
                {lines.map((line, i) => (
                  <p key={i} className={still ? '' : 'cf-line'} style={still ? undefined : { animationDelay: `${0.5 + i * 0.7}s` }}>
                    {line}
                  </p>
                ))}
              </div>
              {photos.length > 0 && (
                <div className="mt-8 flex justify-center">
                  {photos.map((src, i) => (
                    <div
                      key={src}
                      className={`w-[34%] max-w-[150px] bg-white p-[5px] pb-[18px] shadow-md ${i ? '-ml-4' : ''}`}
                      style={{ transform: `rotate(${[-5, 4, -2][i]}deg)` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <p className={`mt-8 text-right ${still ? '' : 'cf-line'}`} style={{ fontFamily: hand, fontSize: 'clamp(20px, 6cqi, 24px)', animationDelay: still ? undefined : `${0.7 + lines.length * 0.7}s` }}>
                Yours,
              </p>
              <p className={`text-right leading-none ${still ? '' : 'cf-line'}`} style={{ fontFamily: script, fontSize: 'clamp(36px, 11cqi, 46px)', color: t.accentDeep, animationDelay: still ? undefined : `${0.9 + lines.length * 0.7}s` }}>
                {from}
              </p>
            </article>
          </section>

          <section className={`relative px-5 text-center ${still ? 'pb-10 pt-6' : 'min-h-[80svh] pb-16 pt-8'}`} style={{ color: t.coverInk }}>
            <p className="leading-none" style={{ fontFamily: script, fontSize: 'clamp(40px, 13cqi, 58px)', color: voice === 'her' ? t.sealHeart : t.accent }}>
              {to},
            </p>
            <h2 className="mx-auto mt-4 max-w-[22rem] text-balance" style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(30px, 10cqi, 44px)', lineHeight: 1.1 }}>
              {question}
            </h2>
            <div ref={arenaRef} className="relative mx-auto mt-10 h-48 w-full max-w-sm">
              <button
                type="button"
                // Only a press that began on Yes counts. A tap on the No moves it away at once, and the
                // phone then delivers that tap to whatever is under the finger: never a Yes nobody chose.
                // A keyboard press (detail 0) has no pointer and always counts.
                onPointerDown={() => { yesPressed.current = true }}
                onClick={(e) => {
                  const chosen = yesPressed.current || e.detail === 0
                  yesPressed.current = false
                  if (chosen && !still) setAnswered(true)
                }}
                className="absolute left-[8%] top-6 rounded-full px-9 py-3.5 text-[17px] font-semibold shadow-lg transition-transform"
                style={{ background: t.accent, color: voice === 'her' ? '#121A38' : '#FFFFFF', transform: `scale(${yesScale})`, transformOrigin: 'left center' }}
              >
                Yes 💖
              </button>
              {!noGone && (
                <button
                  type="button"
                  // One try per tap: the press moves it; the click that follows the same press is
                  // ignored. A keyboard press has no pointer, so its click is the try.
                  onPointerDown={(e) => { if (!still) { e.preventDefault(); noPressed.current = true; dodge() } }}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') dodge() }}
                  onClick={() => {
                    if (noPressed.current) noPressed.current = false
                    else dodge()
                  }}
                  data-no=""
                  className="absolute rounded-full border px-6 py-3 text-[15px] font-semibold transition-[left,top] duration-200"
                  style={{
                    borderColor: t.coverSoft,
                    color: t.coverInk,
                    left: noPos ? noPos.x : '62%',
                    top: noPos ? noPos.y : 28,
                    transform: `scale(${Math.max(0.6, 1 - tries * 0.07)})`,
                  }}
                >
                  {NO_LABELS[Math.min(tries, NO_LABELS.length - 1)]}
                </button>
              )}
              {noGone && <p className="absolute inset-x-0 bottom-0 text-[14px]" style={{ color: t.coverSoft }}>No seems to have run away. ❤️</p>}
            </div>
          </section>

          {/* 3  Yes. In the preview, shown under the question so the writer sees their plan. */}
          {still && (
            <section className="relative border-t border-dashed pt-8" style={{ borderColor: t.coverSoft }}>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: t.coverSoft, fontFamily: 'system-ui, sans-serif' }}>
                When they say yes
              </p>
              {Yes}
            </section>
          )}

          <div className="relative pb-8 pt-2">
            <Credit color={t.coverSoft} linkColor={t.coverInk} />
          </div>
        </>
      )}

      {answered && !still && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto" style={{ background: t.bg }} role="dialog" aria-modal="true" aria-label="Yes!">
          <RisingHearts color={t.hearts} count={18} />
          <div className="relative w-full">{Yes}</div>
        </div>
      )}
    </div>
  )
}

/** Written by him, for her. */
export function ConfessionForHer(props: InviteProps) {
  return <Confession {...props} voice="him" />
}

/** Written by her, for him. */
export function ConfessionForHim(props: InviteProps) {
  return <Confession {...props} voice="her" />
}
