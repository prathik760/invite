'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import WishesSection from './WishesSection'
import { PortraitRow } from './PortraitRow'

interface Props {
  data: Record<string, string>
  eventId?: string
  isPreview?: boolean
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const COLORS = {
  background: '#FBF7F1',
  warm: '#FFF8F1',
  ink: '#221B17',
  text: '#2C201C',
  muted: 'rgba(44,32,28,0.56)',
  border: '#E8DCCD',
  gold: '#B87924',
  goldSoft: '#D9A441',
  rose: '#B96B70',
  jade: '#2F766D',
}

const PARTICLES = [
  { id: 0, x: 6, delay: 0, dur: 16, maxOpacity: 0.22, size: 9, drift: 20 },
  { id: 1, x: 19, delay: 3.2, dur: 20, maxOpacity: 0.14, size: 7, drift: -16 },
  { id: 2, x: 33, delay: 1.4, dur: 13, maxOpacity: 0.18, size: 11, drift: 24 },
  { id: 3, x: 50, delay: 5.8, dur: 18, maxOpacity: 0.12, size: 8, drift: -20 },
  { id: 4, x: 64, delay: 0.9, dur: 15, maxOpacity: 0.20, size: 10, drift: 18 },
  { id: 5, x: 78, delay: 4.1, dur: 14, maxOpacity: 0.15, size: 7, drift: -22 },
  { id: 6, x: 91, delay: 2.3, dur: 17, maxOpacity: 0.13, size: 9, drift: 15 },
]

// ─── Sub-components ─────────────────────────────────────────────────────────────

const FloatingHearts = memo(function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, bottom: '-30px', fontSize: `${p.size}px`, color: COLORS.rose }}
          animate={{
            y: -1200,
            x: [0, p.drift, p.drift * 0.4, -p.drift * 0.3, 0],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.85, p.maxOpacity * 0.4, 0],
            rotate: [-10, 15, -15, 8, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
            x: { duration: p.dur, ease: 'easeInOut' },
            rotate: { duration: p.dur, ease: 'easeInOut' },
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
})

const SectionDivider = memo(function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" aria-hidden>
      <div
        className="h-px w-24"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,121,36,0.38))' }}
      />
      <div className="flex items-center gap-1.5">
        <span className="block w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(184,121,36,0.45)' }} />
        <span className="block w-[8px] h-[8px] rotate-45 border" style={{ borderColor: 'rgba(184,121,36,0.55)' }} />
        <span className="block w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(184,121,36,0.45)' }} />
      </div>
      <div
        className="h-px w-24"
        style={{ background: 'linear-gradient(270deg, transparent, rgba(184,121,36,0.38))' }}
      />
    </div>
  )
})

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

function MapPinIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function parseList(value?: string): string[] {
  if (!value) return []
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildDateTime(date?: string, time?: string) {
  if (!date) return null
  const safeTime = time || '00:00'
  const target = new Date(`${date}T${safeTime}:00`)
  return Number.isNaN(target.getTime()) ? null : target
}

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!target) return null
  const diff = Math.max(target.getTime() - now, 0)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, ended: diff === 0 }
}

function MusicButton({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  if (!src) return null

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        className="flex h-11 w-11 items-center justify-center rounded-full border bg-white/85 shadow-card backdrop-blur"
        style={{ borderColor: 'rgba(184,121,36,0.25)', color: playing ? COLORS.gold : COLORS.text }}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
      >
        <MusicIcon />
      </button>
    </div>
  )
}

const DetailCard = memo(function DetailCard({
  icon,
  label,
  value,
  delay = 0,
  isPreview = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delay?: number
  isPreview?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: BEZIER }}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      className={`relative flex flex-col items-center text-center overflow-hidden ${isPreview ? 'py-4 px-3 rounded-lg' : 'py-9 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-2xl'}`}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 10px 34px rgba(60,36,20,0.08)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(184,121,36,0.55) 50%, transparent 90%)',
        }}
      />

      {/* Icon circle */}
      <div
        className={`${isPreview ? 'w-9 h-9 mb-3' : 'w-[52px] h-[52px] mb-5'} rounded-full flex items-center justify-center`}
        style={{
          background: 'rgba(217,164,65,0.13)',
          color: COLORS.gold,
          boxShadow: '0 0 0 1px rgba(184,121,36,0.18), 0 0 20px rgba(217,164,65,0.08)',
        }}
      >
        {icon}
      </div>

      <p
        className="font-body mb-2"
        style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,32,28,0.42)' }}
      >
        {label}
      </p>
      <p style={{ color: COLORS.text, fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }} className="font-body">
        {value}
      </p>

      {/* Bottom blush glow */}
      <div
        className="absolute bottom-0 inset-x-0 h-14 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(217,164,65,0.06), transparent)' }}
      />
    </motion.div>
  )
})

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true as const, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: BEZIER },
})

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function ElegantWedding({ data, eventId, isPreview = false }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const targetDate = useMemo(() => buildDateTime(data.date, data.time), [data.date, data.time])
  const countdown = useCountdown(isPreview ? null : targetDate)
  const galleryImages = useMemo(() => parseList(data.galleryImages), [data.galleryImages])
  const scheduleItems = useMemo(() => parseList(data.schedule), [data.schedule])

  return (
    <div style={{ background: COLORS.background, color: COLORS.text }} className="font-body overflow-x-hidden">
      <MusicButton src={data.musicUrl} />

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section
        className={`relative flex flex-col items-center justify-center overflow-hidden ${isPreview ? 'min-h-[360px] py-16 px-4 sm:px-6 md:px-8' : 'min-h-screen py-12 sm:py-18 md:py-24 px-4 sm:px-6 md:px-8'
          }`}
        style={{ background: COLORS.background }}
      >
        {/* Layer 1 — soft blush top bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 100% 70% at 50% -5%, rgba(217,164,65,0.22) 0%, transparent 60%)',
          }}
        />
        {/* Layer 2 — central blush glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 48%, rgba(185,107,112,0.12) 0%, transparent 65%)',
          }}
        />
        {/* Layer 3 — bottom soft fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 45%, rgba(251,247,241,0.9) 100%)',
          }}
        />
        {/* Layer 4 — subtle film texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '200px 200px',
            opacity: 0.018,
            mixBlendMode: 'multiply',
          }}
        />
        {/* Layer 5 — concentric rings */}
        {[
          isPreview ? '320px' : '720px',
          isPreview ? '220px' : '500px',
          isPreview ? '130px' : '300px',
        ].map((size, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(184,121,36,${0.16 - i * 0.035})`,
            }}
          />
        ))}

        {/* Layer 6 — floating hearts */}
        {!isPreview && !prefersReducedMotion && <FloatingHearts />}

        {/* ── Hero Content ── */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: BEZIER }}
            className={`flex justify-center ${isPreview ? 'mb-7' : 'mb-11'}`}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full font-body"
              style={{
                fontSize: '11px',
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: COLORS.gold,
                border: '1px solid rgba(184,121,36,0.3)',
                background: 'rgba(255,255,255,0.62)',
              }}
            >
              <span
                className="w-1 h-1 rounded-full block"
                style={{ background: COLORS.goldSoft }}
              />
              You are cordially invited
              <span
                className="w-1 h-1 rounded-full block"
                style={{ background: COLORS.goldSoft }}
              />
            </span>
          </motion.div>

          <PortraitRow data={data} dark={false} />

          {/* Bride name */}
          <motion.h1
            initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: BEZIER }}
            className={`font-heading leading-[0.92] tracking-[-0.01em] ${isPreview ? 'text-[2.75rem]' : 'text-[3rem] sm:text-[6.5rem] lg:text-[8rem]'
              }`}
            style={{
              color: COLORS.ink,
              textShadow: '0 0 80px rgba(217,164,65,0.18)',
            }}
          >
            {data.brideName || 'Emily'}
          </motion.h1>

          {/* "&" with flanking lines */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.75, delay: 0.32, ease: BEZIER }}
            className={`flex items-center justify-center gap-3 sm:gap-4 ${isPreview ? 'my-3' : 'my-5 sm:my-7'}`}
          >
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(184,121,36,0.45))' }}
            />
            <span
              className={`font-heading italic select-none ${isPreview ? 'text-[1.6rem]' : 'text-[2.5rem] sm:text-[3rem]'
                }`}
              style={{ color: COLORS.gold }}
            >
              &amp;
            </span>
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: 'linear-gradient(270deg, transparent, rgba(184,121,36,0.45))' }}
            />
          </motion.div>

          {/* Groom name */}
          <motion.h1
            initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.22, ease: BEZIER }}
            className={`font-heading leading-[0.92] tracking-[-0.01em] ${isPreview ? 'text-[2.75rem]' : 'text-[3rem] sm:text-[6.5rem] lg:text-[8rem]'
              }`}
            style={{
              color: COLORS.ink,
              textShadow: '0 0 80px rgba(217,164,65,0.18)',
            }}
          >
            {data.groomName || 'James'}
          </motion.h1>

          {/* Date badge */}
          {data.date && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.52 }}
              className={`flex justify-center ${isPreview ? 'mt-5' : 'mt-10'}`}
            >
              <div
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 rounded-full"
                style={{
                  border: '1px solid rgba(184,121,36,0.24)',
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="block w-[5px] h-[5px] rounded-full" style={{ background: COLORS.goldSoft }} />
                <p
                  className="font-body"
                  style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}
                >
                  {formatDate(data.date)}
                </p>
                <span className="block w-[5px] h-[5px] rounded-full" style={{ background: COLORS.goldSoft }} />
              </div>
            </motion.div>
          )}

          {/* Personal message */}
          {data.message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.68 }}
              className={`italic leading-relaxed font-body mx-auto ${isPreview ? 'text-xs mt-4 max-w-xs' : 'text-base mt-9 max-w-lg'
                }`}
              style={{ color: COLORS.muted }}
            >
              &ldquo;{data.message}&rdquo;
            </motion.p>
          )}
        </div>

        {/* Scroll indicator */}
        {!isPreview && (
          <motion.div
            className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <p
              className="font-body"
              style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(44,32,28,0.34)' }}
            >
              Scroll
            </p>
            <div
              className="w-px h-10 relative overflow-hidden"
              style={{ background: 'rgba(44,32,28,0.1)' }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-5"
                style={{ background: 'linear-gradient(180deg, rgba(184,121,36,0.72), transparent)' }}
                animate={{ y: [0, 40] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════
          COUNTDOWN
      ════════════════════════════════════════════════════ */}
      {countdown && !countdown.ended && (
        <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-6' : 'py-12'}`} style={{ background: COLORS.background }}>
          <motion.div
            {...fadeUp(0)}
            className="mx-auto max-w-3xl rounded-3xl px-4 sm:px-6 md:px-8 py-8 text-center"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,248,241,0.92))',
              border: '1px solid rgba(184,121,36,0.18)',
              boxShadow: '0 18px 60px rgba(60,36,20,0.09)',
            }}
          >
            <p
              className="mb-6 font-body"
              style={{ fontSize: '11px', letterSpacing: '0.32em', textTransform: 'uppercase', color: COLORS.gold }}
            >
              Celebration begins in
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 sm:gap-4">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Minutes', countdown.minutes],
                ['Seconds', countdown.seconds],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg sm:rounded-2xl border bg-white/75 px-2 py-4" style={{ borderColor: COLORS.border }}>
                  <p className="font-heading text-2xl sm:text-3xl text-foreground sm:text-3xl sm:text-4xl md:text-5xl">
                    {String(value).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-muted sm:text-[10px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── Divider ─── */}
      <div className="flex items-center justify-center py-7 bg-surface">
        <SectionDivider />
      </div>

      {/* ════════════════════════════════════════════════════
          EVENT DETAILS
      ════════════════════════════════════════════════════ */}
      <section className={`px-4 sm:px-6 md:px-8 bg-surface ${isPreview ? 'py-6' : 'py-12 sm:py-18 md:py-24'}`}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-12">
            <p
              className="font-body mb-4"
              style={{ fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: COLORS.gold }}
            >
              Event Details
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8" style={{ background: 'rgba(44,32,28,0.12)' }} />
              <div className="w-[5px] h-[5px] rotate-45 border" style={{ borderColor: 'rgba(44,32,28,0.16)' }} />
              <div className="h-px w-8" style={{ background: 'rgba(44,32,28,0.12)' }} />
            </div>
          </motion.div>

          <div className={`grid gap-3 ${isPreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3 sm:gap-4'}`}>
            <DetailCard
              icon={<CalendarIcon />}
              label="Date"
              value={data.date ? formatDate(data.date) : 'To be announced'}
              delay={0}
              isPreview={isPreview}
            />
            <DetailCard
              icon={<ClockIcon />}
              label="Time"
              value={data.time ? formatTime(data.time) : 'To be announced'}
              delay={0.1}
              isPreview={isPreview}
            />
            <DetailCard
              icon={<StarIcon />}
              label="Dress Code"
              value={data.dressCode || 'Formal Attire'}
              delay={0.2}
              isPreview={isPreview}
            />
          </div>

          {scheduleItems.length > 0 && (
            <motion.div {...fadeUp(0.18)} className="mt-10 rounded-3xl p-4 sm:p-6" style={{
              background: '#FFF8F1',
              border: '1px solid rgba(184,121,36,0.16)',
            }}>
              <p
                className="mb-5 text-center font-body"
                style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: COLORS.gold }}
              >
                Ceremony Flow
              </p>
              <div className="space-y-3">
                {scheduleItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-3 sm:gap-4 rounded-lg sm:rounded-2xl bg-white/70 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm" style={{ background: 'rgba(217,164,65,0.14)', color: COLORS.gold }}>
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6" style={{ color: COLORS.muted }}>{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div
        className="flex items-center justify-center py-7"
        style={{ background: COLORS.background }}
      >
        <SectionDivider />
      </div>

      {/* ════════════════════════════════════════════════════
          GALLERY
      ════════════════════════════════════════════════════ */}
      {galleryImages.length > 0 && (
        <>
          <section className={`px-4 sm:px-6 md:px-8 ${isPreview ? 'py-8' : 'py-12 sm:py-18 md:py-24'}`} style={{ background: COLORS.background }}>
            <div className="mx-auto max-w-5xl">
              <motion.div {...fadeUp(0)} className="mb-8 sm:mb-12 text-center">
                <p
                  className="mb-4 font-body"
                  style={{ fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: COLORS.gold }}
                >
                  Our Memories
                </p>
                <h2 className={`font-heading leading-tight ${isPreview ? 'text-[1.3rem]' : 'text-[2.6rem] sm:text-[4.5rem]'}`} style={{ color: COLORS.ink }}>
                  A little glimpse of us
                </h2>
              </motion.div>

              <div className={`grid gap-2 ${isPreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 sm:gap-3'}`}>
                {galleryImages.slice(0, 8).map((src, index) => (
                  <motion.figure
                    key={`${src}-${index}`}
                    {...fadeUp(index * 0.04)}
                    className={`overflow-hidden rounded-lg sm:rounded-2xl border bg-white shadow-card ${!isPreview && (index === 0 || index === 3) ? 'col-span-2 row-span-2' : ''}`}
                    style={{ borderColor: COLORS.border }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Wedding memory ${index + 1}`}
                      className="h-full min-h-[150px] w-full object-cover"
                      loading="lazy"
                    />
                  </motion.figure>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center py-7" style={{ background: COLORS.background }}>
            <SectionDivider />
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════
          LOCATION
      ════════════════════════════════════════════════════ */}
      <section
        className={`px-4 sm:px-6 md:px-8 relative overflow-hidden ${isPreview ? 'py-6' : 'py-28'}`}
        style={{ background: COLORS.background }}
      >
        {/* Ambient blush glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(217,164,65,0.12) 0%, transparent 70%)',
          }}
        />

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-xl mx-auto text-center">
          <p
            className="font-body mb-5"
            style={{ fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: COLORS.gold }}
          >
            Where We Celebrate
          </p>

          <h2
            className={`font-heading leading-tight ${isPreview ? 'text-[1.85rem] mb-3' : 'text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem] mb-4'
              }`}
            style={{ color: COLORS.ink, textShadow: !isPreview ? '0 0 60px rgba(217,164,65,0.12)' : undefined }}
          >
            {data.venue || 'The Grand Venue'}
          </h2>

          {data.venueAddress && (
            <div className={`flex items-start justify-center gap-2 ${isPreview ? 'mb-5' : 'mb-8 sm:mb-10'}`}>
              <span style={{ color: COLORS.gold, marginTop: '2px' }}>
                <MapPinIcon size="sm" />
              </span>
              <p
                className="text-sm font-body leading-relaxed"
                style={{ color: COLORS.muted }}
              >
                {data.venueAddress}
              </p>
            </div>
          )}

          {data.mapsUrl && !isPreview ? (
            <motion.a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(184,121,36,0.24)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium font-body transition-all"
              style={{
                border: '1px solid rgba(184,121,36,0.36)',
                background: 'rgba(217,164,65,0.12)',
                color: COLORS.text,
              }}
            >
              <span style={{ color: COLORS.gold }}>
                <MapPinIcon size="sm" />
              </span>
              Get Directions
              <span style={{ color: COLORS.gold }}>
                <ArrowUpRightIcon />
              </span>
            </motion.a>
          ) : !data.mapsUrl ? (
            <div
              className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 rounded-full"
              style={{ border: '1px solid rgba(44,32,28,0.1)', color: 'rgba(44,32,28,0.42)' }}
            >
              <MapPinIcon size="sm" />
              <span className="font-body text-xs tracking-wide">
                {data.venueAddress || 'Venue to be announced'}
              </span>
            </div>
          ) : null}
        </motion.div>
      </section>

      {/* ─── Wishes section ─── */}
      {eventId && (
        <>
          <div
            className="flex items-center justify-center py-7"
            style={{ background: COLORS.background }}
          >
            <SectionDivider />
          </div>
          <WishesSection eventId={eventId} />
        </>
      )}

      {/* ─── Footer ─── */}
      <footer
        className="px-4 sm:px-6 md:px-8 py-12 text-center"
        style={{ background: '#221B17', borderTop: '1px solid rgba(217,164,65,0.18)' }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
          <div className="h-px w-10" style={{ background: 'rgba(217,164,65,0.35)' }} />
          <span style={{ color: 'rgba(217,164,65,0.72)', fontSize: '12px' }}>✦</span>
          <div className="h-px w-10" style={{ background: 'rgba(217,164,65,0.35)' }} />
        </div>
        <p
          className="font-body tracking-widest uppercase"
          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.46)' }}
        >
          Made with love &nbsp;·&nbsp;{' '}
          <span style={{ color: 'rgba(217,164,65,0.88)' }}>ShareInvite</span>
        </p>
        {!isPreview && (
          <Link
            href="/create"
            className="mt-6 inline-flex rounded-full px-4 sm:px-6 md:px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ background: '#FFFFFF', color: COLORS.ink }}
          >
            Create your own invitation
          </Link>
        )}
      </footer>
    </div>
  )
}
