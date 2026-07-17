'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import { PortraitRow } from './PortraitRow'

const BZ = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ── Premium KGF Color System — Warm Amber Coal ───────────────────────────────
const C = {
  bg: '#030100',
  bgMid: '#080502',
  bgCard: '#0E0A03',
  bgCardRich: '#130E05',
  bgDeep: '#010000',
  text: '#F6EAC4',
  textMuted: 'rgba(246,234,196,0.55)',
  textFaint: 'rgba(246,234,196,0.22)',
  textSubtle: 'rgba(246,234,196,0.10)',
  gold: '#D4A017',
  goldBright: '#F2C236',
  goldHot: '#FFD060',
  goldMuted: 'rgba(212,160,23,0.60)',
  goldFaint: 'rgba(212,160,23,0.08)',
  goldBorder: 'rgba(212,160,23,0.20)',
  goldGlow: 'rgba(212,160,23,0.12)',
  goldShimmer: 'rgba(255,210,80,0.85)',
  amber: '#E08000',
  amberMuted: 'rgba(224,128,0,0.35)',
  amberFaint: 'rgba(224,128,0,0.08)',
  ember: '#FF4D00',
  emberBright: '#FF8800',
  emberMuted: 'rgba(255,77,0,0.40)',
  emberFaint: 'rgba(255,77,0,0.08)',
  fireGlow: 'rgba(255,90,0,0.14)',
  shaftLight: 'rgba(212,160,23,0.26)',
}

// ── Pre-computed 3-tier ember system (40 particles) ───────────────────────────
const EMBERS: { id: number; x: string; size: number; dur: number; delay: string; drift: number; tier: string }[] = [
  // Tier 3 — large glowing chunks (7)
  ...Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: ((i * 14.4 + 6) % 100).toFixed(1),
    size: 4.2 + (i % 3) * 0.6,
    dur: 7 + (i % 3) * 1.8,
    delay: ((i * 1.3) % 10).toFixed(1),
    drift: ((i % 5) - 2) * 20,
    tier: 'lg',
  })),
  // Tier 2 — mid embers (13)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 7,
    x: ((i * 7.8 + 11) % 100).toFixed(1),
    size: 2.2 + (i % 4) * 0.45,
    dur: 4.5 + (i % 5) * 1.1,
    delay: ((i * 0.72) % 9).toFixed(1),
    drift: ((i % 7) - 3) * 13,
    tier: 'md',
  })),
  // Tier 1 — tiny sparks (20)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 20,
    x: ((i * 5.1 + 3) % 100).toFixed(1),
    size: 0.9 + (i % 3) * 0.28,
    dur: 3.2 + (i % 4) * 0.9,
    delay: ((i * 0.31) % 7).toFixed(1),
    drift: ((i % 9) - 4) * 9,
    tier: 'sm',
  })),
]

// ── Global CSS — keyframes that make KGF cinematic ───────────────────────────
const KGFStyles = memo(function KGFStyles() {
  return (
    <style>{`
      /* Embers rise from the coal depths */
      @keyframes kgf-rise {
        0%   { transform:translateY(0)      translateX(0)                scale(1.0); opacity:0;   }
        5%   {                                                                        opacity:1;   }
        80%  {                                                                        opacity:0.5; }
        100% { transform:translateY(-680px) translateX(var(--kd,0px))    scale(0.12); opacity:0;  }
      }
      /* Volumetric smoke */
      @keyframes kgf-smoke {
        0%   { transform:translateX(0)    translateY(0)     scale(1);   opacity:0;   }
        16%  {                                                           opacity:0.9; }
        72%  {                                                           opacity:0.4; }
        100% { transform:translateX(60px) translateY(-120px) scale(2.1); opacity:0;  }
      }
      /* Metallic gold shimmer sweeps across the names */
      @keyframes kgf-shimmer {
        0%   { background-position:200% center;  }
        100% { background-position:-200% center; }
      }
      /* Ember heart flicker — feels like a real flame */
      @keyframes kgf-flicker {
        0%,100% { opacity:0.52; filter:drop-shadow(0 0 14px rgba(255,77,0,0.5));  }
        20%      { opacity:0.90; filter:drop-shadow(0 0 28px rgba(255,140,0,0.7)); }
        55%      { opacity:0.65; filter:drop-shadow(0 0 18px rgba(255,77,0,0.55)); }
        80%      { opacity:0.78; filter:drop-shadow(0 0 22px rgba(255,110,0,0.60));}
      }
      /* Gold border pulse glow */
      @keyframes kgf-pulse {
        0%,100% { box-shadow:0 0 0 1px rgba(212,160,23,0.14), 0 0 12px rgba(212,160,23,0.08); }
        50%      { box-shadow:0 0 0 1px rgba(212,160,23,0.32), 0 0 28px rgba(212,160,23,0.18); }
      }
      /* Burn-in reveal for underlines */
      @keyframes kgf-burnin {
        0%   { clip-path:inset(0 100% 0 0); opacity:0; }
        10%  { opacity:1; }
        100% { clip-path:inset(0 0%   0 0); opacity:1; }
      }
      /* Countdown digit flip hint */
      @keyframes kgf-digit {
        0%   { transform:translateY(-4px); opacity:0.6; }
        100% { transform:translateY(0);    opacity:1;   }
      }
    `}</style>
  )
})

// ── Ember particle layer ──────────────────────────────────────────────────────
const EmberParticles = memo(function EmberParticles() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {EMBERS.map(e => {
        const isLg = e.tier === 'lg', isMd = e.tier === 'md'
        return (
          <div key={e.id} className="absolute rounded-full" style={{
            left: `${e.x}%`,
            bottom: `${(e.id % 18)}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: isLg
              ? 'radial-gradient(circle,#FFE890 0%,#FFAA20 30%,#FF5500 70%,#CC2200 100%)'
              : isMd
                ? 'radial-gradient(circle,#FFBB40 0%,#FF7700 55%,#CC3300 100%)'
                : 'radial-gradient(circle,#FF9040,#FF4400)',
            boxShadow: isLg
              ? `0 0 ${e.size * 5}px #FFAA20, 0 0 ${e.size * 10}px rgba(255,85,0,0.5)`
              : isMd
                ? `0 0 ${e.size * 5}px rgba(255,120,0,0.8)`
                : `0 0 ${e.size * 4}px rgba(255,80,0,0.6)`,
            '--kd': `${e.drift}px`,
            animationName: 'kgf-rise',
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
          } as React.CSSProperties} />
        )
      })}
    </div>
  )
})

// ── Volumetric smoke ──────────────────────────────────────────────────────────
const SmokeLayer = memo(function SmokeLayer() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[
        { l: '4%', b: '0', w: 280, dur: '15s', dl: '0s' },
        { l: '32%', b: '2%', w: 340, dur: '20s', dl: '5s' },
        { l: '63%', b: '0', w: 210, dur: '13s', dl: '9.5s' },
        { l: '82%', b: '1%', w: 160, dur: '11s', dl: '2.5s' },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: p.l, bottom: p.b,
          width: p.w, height: p.w * 0.52,
          background: 'radial-gradient(ellipse,rgba(70,45,15,0.16) 0%,transparent 68%)',
          filter: 'blur(26px)',
          animationName: 'kgf-smoke',
          animationDuration: p.dur,
          animationDelay: p.dl,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
        } as React.CSSProperties} />
      ))}
    </div>
  )
})

// ── Coal / mine-shaft texture ─────────────────────────────────────────────────
const CoalTexture = memo(function CoalTexture() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{
        backgroundImage: `
          repeating-linear-gradient(-54deg,rgba(212,160,23,0.032) 0px,rgba(212,160,23,0.032) 1px,transparent 1px,transparent 16px),
          repeating-linear-gradient(36deg,rgba(255,255,255,0.014) 0px,rgba(255,255,255,0.014) 1px,transparent 1px,transparent 10px)`,
        zIndex: 1,
      }} />
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E")`,
        backgroundSize: '260px',
        mixBlendMode: 'overlay',
        zIndex: 1,
      }} />
    </>
  )
})

// ── Burning underline (animate on section entrance) ───────────────────────────
function BurnLine({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay, ease: BZ }}
      style={{
        height: '2px',
        transformOrigin: 'left',
        background: `linear-gradient(90deg, ${C.ember} 0%, ${C.amber} 30%, ${C.gold} 60%, transparent 100%)`,
        boxShadow: `0 0 10px ${C.amberMuted}, 0 0 20px rgba(255,77,0,0.12)`,
        maxWidth: '220px',
      }}
      className={`mx-auto ${className}`}
    />
  )
}

// ── KGF chapter / section header ─────────────────────────────────────────────
function SectionHead({ chapter, title, delay = 0 }: { chapter: string; title: string; delay?: number }) {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay, ease: BZ }}
        className="inline-flex items-center gap-2 mb-5"
        style={{
          border: `1px solid ${C.goldBorder}`,
          background: 'rgba(212,160,23,0.05)',
          borderRadius: '2px',
          padding: '5px 14px',
          animationName: 'kgf-pulse',
          animationDuration: '3s',
          animationIterationCount: 'infinite',
        } as React.CSSProperties}
      >
        <span style={{ color: C.amber, fontSize: '8px' }}>⬥</span>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.55em]" style={{ color: C.goldMuted }}>
          {chapter}
        </span>
        <span style={{ color: C.amber, fontSize: '8px' }}>⬥</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.0, delay: delay + 0.1, ease: BZ }}
        className="font-heading"
        style={{ fontSize: 'clamp(1.45rem,5vw,2.6rem)', color: C.text, letterSpacing: '0.02em' }}
      >
        {title}
      </motion.h2>
      <BurnLine delay={delay + 0.2} className="mt-3" />
    </div>
  )
}

// ── Premium gold divider bar ──────────────────────────────────────────────────
const GoldBar = memo(function GoldBar({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className}`} style={{ height: '16px' }}>
      <div className="flex-1 h-[1.5px]" style={{
        background: `linear-gradient(90deg, transparent 0%, ${C.amber} 30%, ${C.goldBright} 50%, ${C.amber} 70%, transparent 100%)`,
        boxShadow: `0 0 8px ${C.amberMuted}`,
      }} />
      <div className="shrink-0 mx-3 w-3 h-3 rotate-45" style={{
        background: C.goldBright,
        boxShadow: `0 0 12px ${C.gold}, 0 0 24px ${C.goldGlow}`,
      }} />
      <div className="flex-1 h-[1.5px]" style={{
        background: `linear-gradient(90deg, transparent 0%, ${C.amber} 30%, ${C.goldBright} 50%, ${C.amber} 70%, transparent 100%)`,
        boxShadow: `0 0 8px ${C.amberMuted}`,
      }} />
    </div>
  )
})

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(dateStr: string, timeStr: string) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    if (!dateStr) return
    const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`)
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [dateStr, timeStr])
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// ── Premium music player ──────────────────────────────────────────────────────
const MusicButton = memo(function MusicButton({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    if (!src) return
    audio.current = new Audio(src); audio.current.loop = true
    return () => { audio.current?.pause(); audio.current = null }
  }, [src])
  const toggle = useCallback(() => {
    if (!audio.current) return
    if (playing) { audio.current.pause(); setPlaying(false) }
    else audio.current.play().then(() => setPlaying(true)).catch(() => { })
  }, [playing])
  return (
    <motion.button onClick={toggle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2.5 px-5 py-2.5 select-none"
      style={{
        background: 'linear-gradient(135deg,rgba(212,160,23,0.08),rgba(224,128,0,0.05))',
        border: `1px solid ${C.goldBorder}`,
        borderRadius: '2px',
        boxShadow: `0 0 24px ${C.goldGlow}, inset 0 1px 0 rgba(212,160,23,0.10)`,
        color: C.text,
      }}>
      <span style={{ color: playing ? C.ember : C.goldBright }}>
        {playing
          ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          : <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
        }
      </span>
      <div className="flex items-end gap-[2px] h-4">
        {[3, 6, 10, 6, 3].map((h, i) => (
          <motion.div key={i} className="w-[2.5px] rounded-full"
            style={{ background: playing ? C.ember : C.goldMuted }}
            animate={playing ? { height: [`${h * .5}px`, `${h}px`, `${h * .5}px`] } : { height: '2px' }}
            transition={{ duration: .5 + i * .09, delay: i * .06, repeat: playing ? Infinity : 0, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="text-[10px] sm:text-[11px] tracking-[0.24em]" style={{ color: C.textMuted }}>
        {playing ? 'NOW PLAYING' : 'PLAY MUSIC'}
      </span>
    </motion.button>
  )
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseList(v?: string): string[] {
  if (!v) return []
  return v.split(/\n|,/).map(s => s.trim()).filter(Boolean)
}

function reveal(delay = 0, y = 28) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 1.05, delay, ease: BZ },
  } as const
}

// ── Premium KGF card ──────────────────────────────────────────────────────────
function KGFCard({
  children, className = '', style = {}, glow = false,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties; glow?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{
      background: `linear-gradient(145deg, ${C.bgCardRich}, ${C.bgCard})`,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: '3px',
      boxShadow: [
        `inset 0 1px 0 rgba(212,160,23,0.12)`,
        `inset 0 0 60px rgba(212,160,23,0.03)`,
        `0 6px 40px rgba(0,0,0,0.85)`,
        glow ? `0 0 30px rgba(212,160,23,0.10)` : '',
      ].filter(Boolean).join(','),
      ...style,
    }}>
      {/* Top amber highlight edge */}
      <div className="absolute inset-x-0 top-0 h-[1px]" aria-hidden style={{
        background: `linear-gradient(90deg, transparent 8%, ${C.amber} 50%, transparent 92%)`,
        opacity: 0.8,
      }} />
      {children}
    </div>
  )
}

// ── Corner bracket accent ─────────────────────────────────────────────────────
function CornerBrackets({ color = C.amber, size = 16 }: { color?: string; size?: number }) {
  const s = size; const t = '1.5px'
  return (
    <>
      <div className="absolute top-0 left-0" style={{ width: s, height: s, borderTop: `${t} solid ${color}`, borderLeft: `${t} solid ${color}` }} aria-hidden />
      <div className="absolute top-0 right-0" style={{ width: s, height: s, borderTop: `${t} solid ${color}`, borderRight: `${t} solid ${color}` }} aria-hidden />
      <div className="absolute bottom-0 left-0" style={{ width: s, height: s, borderBottom: `${t} solid ${color}`, borderLeft: `${t} solid ${color}` }} aria-hidden />
      <div className="absolute bottom-0 right-0" style={{ width: s, height: s, borderBottom: `${t} solid ${color}`, borderRight: `${t} solid ${color}` }} aria-hidden />
    </>
  )
}

// ── Wishes / RSVP ─────────────────────────────────────────────────────────────
function KGFWishes({ eventId }: { eventId: string }) {
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; message: string }>>([])
  const [name, setName] = useState(''); const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const MAX = 320; const left = MAX - msg.length

  useEffect(() => {
    if (eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`).then(r => r.json()).then(d => setWishes(Array.isArray(d) ? d : [])).catch(() => { })
  }, [eventId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    if (eventId === '__preview__') { setSent(true); return }
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: msg.trim() })
      })
      if (!res.ok) throw new Error()
      setSent(true); setName(''); setMsg('')
    } catch { setErr('Could not send. Please try again.') }
    finally { setBusy(false) }
  }

  return (
    <section style={{ background: C.bgMid, borderTop: `1px solid ${C.goldBorder}` }}>
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-xl mx-auto">
          <SectionHead chapter="Chapter VII" title="Send Your Blessings" />

          <motion.div {...reveal(0.1)}>
            <KGFCard className="mb-8 p-5 sm:p-7 sm:p-8" glow>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="ty" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8 sm:py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: .5, ease: BZ }}
                      className="text-4xl select-none mb-5" style={{ color: C.ember, animationName: 'kgf-flicker', animationDuration: '2s', animationIterationCount: 'infinite' } as React.CSSProperties} aria-hidden>⚡</motion.div>
                    <p className="font-heading text-xl sm:text-2xl mb-3" style={{ color: C.text }}>Blessing Received</p>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: C.textMuted }}>
                      Your blessing has been received with honour.<br />It shall appear once approved.
                    </p>
                    <button onClick={() => setSent(false)} className="text-xs tracking-[0.14em] hover:opacity-100 transition-opacity" style={{ color: C.goldMuted }}>
                      Send another blessing →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.28em] mb-2.5" style={{ color: C.textMuted }}>Your Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Anjali & Suresh" required
                        className="w-full bg-transparent border-0 border-b py-2.5 text-sm focus:outline-none transition-all"
                        style={{ color: C.text, borderBottom: `1px solid rgba(255,255,255,0.09)` }}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = C.goldMuted)}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.09)')} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.28em] mb-2.5" style={{ color: C.textMuted }}>Your Blessing</label>
                      <textarea value={msg} onChange={e => setMsg(e.target.value.slice(0, MAX))} placeholder="May your union shine like gold forever…" required rows={4}
                        className="w-full bg-transparent border-0 border-b py-2.5 text-sm focus:outline-none resize-none transition-all"
                        style={{ color: C.text, borderBottom: `1px solid rgba(255,255,255,0.09)` }}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = C.goldMuted)}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.09)')} />
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] tabular-nums" style={{ color: left <= 40 ? C.ember : C.textFaint }}>{left} left</span>
                      </div>
                    </div>
                    {err && <p className="text-xs" style={{ color: '#E87070' }}>{err}</p>}
                    <motion.button type="submit" disabled={busy}
                      whileHover={{ scale: busy ? 1 : 1.015 }} whileTap={{ scale: busy ? 1 : 0.985 }}
                      className="w-full py-4 text-sm tracking-[0.18em] font-medium transition-all disabled:opacity-50"
                      style={{
                        background: `linear-gradient(135deg,rgba(212,160,23,0.12),rgba(224,128,0,0.08))`,
                        border: `1px solid ${C.goldBorder}`,
                        color: C.goldBright, borderRadius: '2px',
                        boxShadow: `0 0 20px ${C.goldGlow}`,
                      }}>
                      {busy ? 'Sending…' : 'SEND BLESSING ⚡'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </KGFCard>
          </motion.div>

          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.map((w, i) => (
                <motion.div key={w.id} {...reveal(i * .07)}>
                  <KGFCard className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="font-heading select-none leading-none mb-2" style={{ fontSize: '3rem', color: 'rgba(212,160,23,0.07)', marginTop: '-0.25rem' }} aria-hidden>&ldquo;</div>
                    <p className="text-sm italic leading-relaxed mb-4" style={{ color: C.textMuted }}>{w.message}</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] shrink-0"
                        style={{ background: C.emberFaint, border: `1px solid ${C.emberMuted}`, color: C.ember, borderRadius: '2px' }}>
                        {w.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs tracking-wider" style={{ color: C.goldMuted }}>{w.name}</p>
                    </div>
                  </KGFCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Main KGF Wedding Component ────────────────────────────────────────────────
interface Props { data: Record<string, string>; eventId?: string; isPreview?: boolean }

export default function KGFWedding({ data, eventId, isPreview = false }: Props) {
  const groomName = data.groomName || 'Rocky'
  const brideName = data.brideName || 'Reena'
  const { date, time, venue, venueAddress, mapsUrl, dressCode, schedule, galleryImages, musicUrl, message, coupleStory, brideFamilyDetails, groomFamilyDetails } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const gallery = useMemo(() => parseList(galleryImages), [galleryImages])
  const sched = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)
  const year = date ? new Date(date + 'T00:00:00').getFullYear() : new Date().getFullYear()

  const handleWhatsApp = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = encodeURIComponent(`You are cordially invited to the royal wedding of ${groomName} & ${brideName}. View invitation: ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }, [groomName, brideName])

  const details = [
    { label: 'Wedding Date', value: formattedDate },
    { label: 'Ceremony Time', value: formattedTime },
    ...(venue ? [{ label: 'Venue', value: venue, sub: venueAddress }] : []),
    ...(dressCode ? [{ label: 'Royal Attire', value: dressCode }] : []),
  ].filter(d => d.value)

  // ── Metallic-shimmer gold for hero names ────────────────────────────────────
  const nameStyle: React.CSSProperties = {
    fontSize: isPreview ? '2.1rem' : 'clamp(2.6rem, 9vw, 9.5rem)',
    lineHeight: 0.96,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    background: 'linear-gradient(105deg,#9E6E00 0%,#D4A017 18%,#F8E080 32%,#FFD870 42%,#FFF0A0 50%,#FFD870 58%,#F8E080 68%,#D4A017 82%,#9E6E00 100%)',
    backgroundSize: '250% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 40px rgba(212,160,23,0.45)) drop-shadow(0 4px 20px rgba(0,0,0,0.95))',
    animationName: 'kgf-shimmer',
    animationDuration: '4.5s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  }

  return (
    <div className="relative font-body" style={{ background: C.bg, color: C.text, overflowX: 'hidden' }}>
      <KGFStyles />

      {/* ── HERO — Underground kingdom opening ───────────────────────────────── */}
      <section
        className={`relative flex ${isPreview ? 'min-h-[440px] py-12' : 'min-h-screen'} flex-col items-center justify-center overflow-hidden text-center`}
        style={{
          background: `
            radial-gradient(ellipse 26% 16% at 50% -2%,  ${C.shaftLight}        0%, transparent 100%),
            radial-gradient(ellipse 95% 48% at 50% 106%, rgba(255,60,0,0.22)    0%, transparent 65%),
            radial-gradient(ellipse 50% 32% at 50% 60%,  rgba(255,77,0,0.05)    0%, transparent 65%),
            radial-gradient(ellipse 70% 42% at 50% 50%,  rgba(212,160,23,0.04)  0%, transparent 68%),
            ${C.bgDeep}
          `,
        }}
      >
        <CoalTexture />
        {!isPreview && <EmberParticles />}
        {!isPreview && <SmokeLayer />}

        {/* ── CINEMATIC LETTERBOX OPENING (the premiere signature effect) ─── */}
        <motion.div
          className="pointer-events-none absolute top-0 inset-x-0 z-20"
          initial={{ height: isPreview ? '14px' : '50vh' }}
          animate={{ height: isPreview ? '14px' : '44px' }}
          transition={{ duration: 2.0, delay: isPreview ? 0 : 0.3, ease: BZ }}
          style={{ background: '#000' }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute bottom-0 inset-x-0 z-20"
          initial={{ height: isPreview ? '14px' : '50vh' }}
          animate={{ height: isPreview ? '14px' : '44px' }}
          transition={{ duration: 2.0, delay: isPreview ? 0 : 0.3, ease: BZ }}
          style={{ background: '#000' }}
          aria-hidden
        />

        {/* Heavy side vignettes — focus center */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[3]"
          style={{ width: 'clamp(40px,11vw,130px)', background: 'linear-gradient(90deg,rgba(0,0,0,0.88),transparent)' }} aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[3]"
          style={{ width: 'clamp(40px,11vw,130px)', background: 'linear-gradient(270deg,rgba(0,0,0,0.88),transparent)' }} aria-hidden />

        {/* Scorched bottom — coal fire rises */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[4]"
          style={{ height: '38%', background: 'linear-gradient(to top,rgba(16,5,0,0.96) 0%,rgba(26,9,0,0.72) 35%,rgba(38,12,0,0.38) 65%,transparent 100%)' }} aria-hidden />

        {/* Amber shaft from above */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-[2]"
          style={{ height: '22%', background: 'linear-gradient(to bottom,rgba(212,160,23,0.14) 0%,transparent 100%)' }} aria-hidden />

        {/* Centre content — fades in after letterbox opens */}
        <motion.div
          initial={{ opacity: isPreview ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: isPreview ? 0 : 1.1, ease: BZ }}
          className="relative z-[5] flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6"
        >
          {/* Chapter badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: isPreview ? 0 : 1.3, ease: BZ }}
            className="mb-5 sm:mb-7 inline-flex items-center gap-2.5 px-5 py-2"
            style={{
              border: `1px solid ${C.goldBorder}`,
              background: 'rgba(212,160,23,0.05)',
              borderRadius: '2px',
              boxShadow: `0 0 24px ${C.goldGlow}`,
            }}>
            <span style={{ color: C.amber, fontSize: '8px' }}>⬥</span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.58em]" style={{ color: C.goldMuted }}>
              Chapter I — The Wedding
            </span>
            <span style={{ color: C.amber, fontSize: '8px' }}>⬥</span>
          </motion.div>

          {/* Music button */}
          {musicUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: isPreview ? 0 : 1.5, ease: BZ }} className="mb-6 sm:mb-8">
              <MusicButton src={musicUrl} />
            </motion.div>
          )}

          <PortraitRow data={data} dark={true} />

          {/* GROOM NAME — metallic shimmer gold */}
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: isPreview ? 0 : 1.35, ease: BZ }}
            className="font-heading select-none"
            style={nameStyle}
          >{groomName}</motion.h1>

          {/* Ember heart */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .65, delay: isPreview ? 0 : 1.9, ease: [0.34, 1.56, 0.64, 1] }}
            className="select-none my-2 sm:my-3"
            style={{
              color: C.ember,
              fontSize: isPreview ? '1.5rem' : 'clamp(1.6rem,5vw,4rem)',
              animationName: 'kgf-flicker',
              animationDuration: '2.8s',
              animationIterationCount: 'infinite',
            } as React.CSSProperties}
            aria-hidden
          >❤</motion.div>

          {/* BRIDE NAME — metallic shimmer gold */}
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: isPreview ? 0 : 2.05, ease: BZ }}
            className="font-heading select-none"
            style={nameStyle}
          >{brideName}</motion.h1>

          {/* GoldBar divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, delay: isPreview ? 0 : 2.5, ease: BZ }}
            className="mt-7 sm:mt-9 mb-5 sm:mb-6 w-full max-w-xs sm:max-w-md"
          >
            <GoldBar />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: isPreview ? 0 : 2.7 }}
            className="mb-3 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.56em]"
            style={{ color: C.gold }}
          >The Wedding Chapter Begins</motion.p>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: isPreview ? 0 : 2.9 }}
            className="text-xs sm:text-sm uppercase tracking-[0.3em]"
            style={{ color: C.textMuted }}
          >{formattedDate || String(year)}</motion.p>

          {/* Venue */}
          {venue && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, delay: isPreview ? 0 : 3.1 }}
              className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-[0.24em]" style={{ color: C.textFaint }}>
              {venue}
            </motion.p>
          )}
        </motion.div>

        {/* Scroll cue */}
        {!isPreview && (
          <motion.div animate={{ opacity: [0, .5, 0], y: [0, 9, 0] }} transition={{ duration: 2.1, delay: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-24 z-[5]" aria-hidden>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke={C.goldMuted} strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2v16m0 0l-4-5m4 5l4-5" />
            </svg>
          </motion.div>
        )}
      </section>

      {/* ── THE CHRONICLE — Journalist Narrator (KGF-style banned-book narration) */}
      <section style={{ background: '#010000', borderTop: `1px solid ${C.goldBorder}` }}
        className={`relative px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8' : 'py-14 sm:py-20 md:py-24'} overflow-hidden`}>

        {/* Deep atmospheric glow */}
        {/* <div className="pointer-events-none absolute inset-0" aria-hidden style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,160,23,0.035) 0%, transparent 70%)',
        }} /> */}

      </section>

      {/* ── COUPLE STORY ─────────────────────────────────────────────────────── */}
      {coupleStory && (
        <section style={{ background: C.bgMid, borderTop: `1px solid ${C.goldBorder}` }}
          className={`relative px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8' : 'py-12 sm:py-16 md:py-20'} overflow-hidden`}>
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%,rgba(255,77,0,0.055) 0%,transparent 70%)' }} />
          <div className="relative max-w-2xl mx-auto">
            <SectionHead chapter="Chapter II" title="A Royal Love Story" />
            <motion.div {...reveal(.15)}>
              <KGFCard className="p-6 sm:p-9" glow>
                <div className="font-heading select-none leading-none mb-2"
                  style={{ fontSize: '4.5rem', color: 'rgba(212,160,23,0.07)', marginTop: '-0.6rem' }} aria-hidden>&ldquo;</div>
                <p className="font-heading text-base sm:text-lg md:text-xl italic leading-relaxed text-center"
                  style={{ color: C.textMuted }}>{coupleStory}</p>
                <GoldBar className="mt-6 mb-4 max-w-xs mx-auto" />
                <p className="text-xs sm:text-sm uppercase tracking-[0.34em] text-center" style={{ color: C.goldMuted }}>
                  — {groomName} &amp; {brideName}
                </p>
              </KGFCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── COUNTDOWN ────────────────────────────────────────────────────────── */}
      {date && (
        <section style={{ background: C.bg, borderTop: `1px solid ${C.goldBorder}` }}
          className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-7' : 'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-lg mx-auto">
            <SectionHead chapter="Chapter III" title="The Grand Countdown" />
            <div className={`grid gap-3 sm:gap-4 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: minutes, l: 'Mins' }, { v: seconds, l: 'Secs' }].map(({ v, l }, i) => (
                <motion.div key={l} {...reveal(i * .08)}>
                  <KGFCard className="flex flex-col items-center justify-center py-5 sm:py-7" glow>
                    <div className="absolute inset-x-0 bottom-0 h-[1.5px]" aria-hidden style={{
                      background: `linear-gradient(90deg,transparent 20%,${C.amber} 50%,transparent 80%)`,
                      boxShadow: `0 0 8px ${C.amberMuted}`,
                    }} />
                    <span className="font-heading tabular-nums" style={{
                      fontSize: isPreview ? '1.9rem' : 'clamp(2.1rem,7vw,3.4rem)',
                      lineHeight: 1,
                      background: 'linear-gradient(175deg,#FFE070 0%,#D4A017 45%,#9E6E00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 12px rgba(212,160,23,0.50))',
                    }}>
                      {String(v).padStart(2, '0')}
                    </span>
                    <span className="mt-2 text-[8px] sm:text-[9px] uppercase tracking-[0.26em]" style={{ color: C.textFaint }}>{l}</span>
                  </KGFCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENT DETAILS ────────────────────────────────────────────────────── */}
      {details.length > 0 && (
        <section style={{ background: C.bgMid, borderTop: `1px solid ${C.goldBorder}` }}
          className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-7' : 'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-2xl mx-auto">
            <SectionHead chapter="Chapter IV" title="Your Presence is Commanded" />
            <div className={`grid gap-3 sm:gap-4 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {details.map((d, i) => (
                <motion.div key={d.label} {...reveal(i * .08)}>
                  <KGFCard className="p-4 sm:p-6">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.32em] mb-1.5" style={{ color: C.goldMuted }}>{d.label}</p>
                    <p className="text-sm sm:text-base font-medium leading-snug" style={{ color: C.text }}>{d.value}</p>
                    {'sub' in d && d.sub && <p className="mt-1 text-xs sm:text-sm leading-relaxed" style={{ color: C.textMuted }}>{d.sub as string}</p>}
                  </KGFCard>
                </motion.div>
              ))}
            </div>
            {mapsUrl && (
              <motion.div {...reveal(.3)} className="mt-8 text-center">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-[0.16em] transition-all hover:opacity-85"
                  style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.goldBright, borderRadius: '2px', boxShadow: `0 0 20px ${C.goldGlow}` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  VIEW ROYAL VENUE
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── SCHEDULE ─────────────────────────────────────────────────────────── */}
      {sched.length > 0 && (
        <section style={{ background: C.bg, borderTop: `1px solid ${C.goldBorder}` }}
          className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8' : 'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-md mx-auto">
            <SectionHead chapter="Chapter V" title="Sequence of Events" />
            <div className="relative pl-7 sm:pl-9">
              {/* Glowing amber mine-shaft vertical line */}
              <div className="absolute left-0 top-3 bottom-3" style={{
                width: '2px',
                background: `linear-gradient(180deg,transparent,${C.amber} 12%,${C.amber} 88%,transparent)`,
                boxShadow: `0 0 10px ${C.amberMuted}, 0 0 20px rgba(224,128,0,0.10)`,
              }} />
              <div className="space-y-8 sm:space-y-10">
                {sched.map((item, i) => {
                  const parts = item.split(/[-–—]/).map(s => s.trim())
                  const timeTag = parts.length > 1 ? parts[0] : null
                  const desc = parts.length > 1 ? parts.slice(1).join(' ') : item
                  return (
                    <motion.div key={i} {...reveal(i * .09)} className="relative">
                      {/* Square glowing node */}
                      <div className="absolute -left-[2.1rem] sm:-left-[2.35rem] top-1" style={{
                        width: '14px', height: '14px',
                        background: `linear-gradient(135deg,${C.bgCard},${C.bgCardRich})`,
                        border: `1.5px solid ${C.amber}`,
                        borderRadius: '2px',
                        boxShadow: `0 0 10px ${C.amberMuted}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: '5px', height: '5px', background: C.ember, borderRadius: '1px', boxShadow: `0 0 6px ${C.ember}` }} />
                      </div>
                      {timeTag && (
                        <span className="inline-block text-[8px] sm:text-[9px] uppercase tracking-[0.28em] mb-1 px-2 py-0.5"
                          style={{ background: C.amberFaint, border: `1px solid ${C.amberMuted}`, color: C.amber, borderRadius: '2px' }}>
                          {timeTag}
                        </span>
                      )}
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.text }}>{desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ──────────────────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section style={{ background: C.bgMid, borderTop: `1px solid ${C.goldBorder}` }}
          className={`${isPreview ? 'py-8' : 'py-12 sm:py-16 md:py-20'} overflow-hidden`}>
          <div className="px-4 sm:px-6">
            <SectionHead chapter="Chapter VI" title="Captured Frames" />
          </div>
          <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
            {gallery.map((src, i) => (
              <motion.div key={`${src}-${i}`}
                initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: .85, delay: i * .07, ease: BZ }}
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: i % 3 === 0 ? 'clamp(148px,32vw,205px)' : 'clamp(118px,25vw,162px)',
                  height: i % 3 === 0 ? 'clamp(198px,42vw,274px)' : 'clamp(158px,34vw,214px)',
                  border: `1px solid ${C.goldBorder}`,
                  borderRadius: '3px',
                  boxShadow: `0 8px 40px rgba(0,0,0,0.75)`,
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Memory ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg,rgba(1,0,0,0.20) 0%,transparent 40%,rgba(3,1,0,0.82) 100%)' }} />
                <CornerBrackets color={C.amber} size={14} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAMILY DETAILS ───────────────────────────────────────────────────── */}
      {(brideFamilyDetails || groomFamilyDetails) && (
        <section style={{ background: C.bg, borderTop: `1px solid ${C.goldBorder}` }}
          className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8' : 'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-2xl mx-auto">
            <SectionHead chapter="The Royal Families" title="Two Empires, One Union" />
            <div className={`grid gap-4 sm:gap-6 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {groomFamilyDetails && (
                <motion.div {...reveal(.08)}>
                  <KGFCard className="p-6 sm:p-7 text-center" glow>
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                      style={{ background: `linear-gradient(135deg,${C.goldFaint},${C.amberFaint})`, border: `1.5px solid ${C.goldBorder}`, borderRadius: '2px', boxShadow: `0 0 20px ${C.goldGlow}` }}>
                      <span style={{ color: C.goldBright, fontSize: '22px' }}>♔</span>
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.38em] mb-1.5" style={{ color: C.goldMuted }}>The Groom</p>
                    <p className="font-heading text-xl sm:text-2xl mb-2" style={{ color: C.text }}>{groomName}</p>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.textMuted }}>{groomFamilyDetails}</p>
                  </KGFCard>
                </motion.div>
              )}
              {brideFamilyDetails && (
                <motion.div {...reveal(.14)}>
                  <KGFCard className="p-6 sm:p-7 text-center" glow>
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                      style={{ background: `linear-gradient(135deg,${C.emberFaint},rgba(255,77,0,0.05))`, border: `1.5px solid ${C.emberMuted}`, borderRadius: '2px', boxShadow: `0 0 20px rgba(255,77,0,0.10)` }}>
                      <span style={{ color: C.ember, fontSize: '22px' }}>♕</span>
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.38em] mb-1.5" style={{ color: C.goldMuted }}>The Bride</p>
                    <p className="font-heading text-xl sm:text-2xl mb-2" style={{ color: C.text }}>{brideName}</p>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.textMuted }}>{brideFamilyDetails}</p>
                  </KGFCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── MESSAGE ──────────────────────────────────────────────────────────── */}
      {message && (
        <section style={{ background: C.bgMid, borderTop: `1px solid ${C.goldBorder}` }}
          className={`relative px-4 sm:px-6 md:px-8 ${isPreview ? 'py-10' : 'py-14 sm:py-20 md:py-24'} overflow-hidden`}>
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%,rgba(212,160,23,0.06) 0%,transparent 68%)' }} />
          <div className="relative max-w-xl mx-auto text-center">
            <motion.div {...reveal()}>
              <div className="font-heading select-none leading-none" style={{ fontSize: '5rem', color: 'rgba(212,160,23,0.07)', marginTop: '-0.8rem' }} aria-hidden>&ldquo;</div>
              <p className="font-heading italic leading-relaxed" style={{ fontSize: 'clamp(1.05rem,3.5vw,1.5rem)', color: C.textMuted }}>
                {message}
              </p>
              <GoldBar className="mt-7 mb-5 max-w-xs sm:max-w-sm mx-auto" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.38em]" style={{ color: C.goldMuted }}>
                — {groomName} &amp; {brideName}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── WISHES / RSVP ────────────────────────────────────────────────────── */}
      {eventId && <KGFWishes eventId={eventId} />}

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="relative px-4 sm:px-6 py-12 sm:py-16 text-center overflow-hidden"
        style={{ background: C.bgDeep, borderTop: `2px solid ${C.goldBorder}` }}>
        {/* Atmospheric fire glow at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0" aria-hidden
          style={{ height: '50%', background: `linear-gradient(to bottom,${C.fireGlow} 0%,transparent 100%)` }} />
        {/* Corner bracket for footer as final frame */}
        <CornerBrackets color={C.goldBorder} size={20} />

        <div className="relative z-[2]">
          <GoldBar className="mx-auto max-w-xs sm:max-w-sm mb-7 sm:mb-9" />

          <p className="font-heading mb-1.5" style={{ fontSize: 'clamp(1.05rem,3.5vw,1.4rem)', color: C.text }}>
            {groomName} &amp; {brideName}
          </p>
          {formattedDate && (
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] mb-8 sm:mb-10" style={{ color: C.textFaint }}>
              {formattedDate}
            </p>
          )}

          {/* WhatsApp share */}
          {!isPreview && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWhatsApp}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 mb-10 sm:mb-12 text-xs sm:text-sm tracking-[0.14em]"
              style={{
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.24)',
                color: '#25D366', borderRadius: '2px',
                boxShadow: '0 0 20px rgba(37,211,102,0.06)',
              }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              SHARE ON WHATSAPP
            </motion.button>
          )}

          <p className="text-[9px] sm:text-[10px] tracking-[0.24em]" style={{ color: C.textSubtle }}>
            Made with ShareInvite
          </p>
        </div>
      </footer>
    </div>
  )
}
