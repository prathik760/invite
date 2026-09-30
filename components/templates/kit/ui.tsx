'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * A quiet entrance for content below the fold: 14px rise and fade, once.
 *
 * Server HTML is always visible. After hydration, only elements that start
 * *below* the viewport are hidden and then revealed as they scroll in — so
 * nothing already on screen flickers, and content is never left invisible if
 * scripts fail. Disabled in builder previews and for reduced motion.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  disabled = false,
  className,
  style,
  children,
}: {
  as?: ElementType
  delay?: number
  disabled?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    setState('hidden')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disabled])

  const motion: CSSProperties =
    state === 'idle'
      ? {}
      : {
          opacity: state === 'shown' ? 1 : 0,
          transform: state === 'shown' ? 'none' : 'translateY(14px)',
          transition: `opacity 700ms ease ${delay}ms, transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
        }

  return (
    <Tag ref={ref} className={className} style={{ ...style, ...motion }}>
      {children}
    </Tag>
  )
}

/** Background music, off until the guest taps — browsers block autoplay anyway. */
export function MusicToggle({
  src,
  isPreview,
  color,
  background,
  border,
}: {
  src?: string
  isPreview?: boolean
  color: string
  background: string
  border: string
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  if (!src || !/^https?:\/\//i.test(src)) return null

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
    <div className={`${isPreview ? 'absolute' : 'fixed'} right-3 top-3 z-40`}>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
        className="flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] font-medium backdrop-blur"
        style={{ color, background, border: `1px solid ${border}` }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          {playing ? (
            <path strokeLinecap="round" d="M9 6v12M15 6v12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          )}
        </svg>
        {playing ? 'Pause' : 'Music'}
      </button>
    </div>
  )
}

/** Directions button; renders nothing when there is no venue to point at. */
export function DirectionsLink({
  href,
  isPreview,
  className,
  style,
  children = 'Get directions',
}: {
  href: string | null
  isPreview?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  if (!href) return null
  return (
    <a
      href={isPreview ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-disabled={isPreview || undefined}
    >
      {children}
    </a>
  )
}

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * The small credit at the foot of every invitation. Kept deliberately quiet:
 * the page belongs to the host. The domain is the link — it opens the
 * ShareInvite site in a new tab, so a guest never loses the invitation.
 * It stays live in previews too: it leaves the builder rather than acting in it.
 */
export function Credit({ color, linkColor }: { isPreview?: boolean; color: string; linkColor: string }) {
  return (
    <p className="text-center text-[12px] tracking-[0.04em]" style={{ color }}>
      Invitation made with{' '}
      <a
        href={`${SITE_URL}/?src=invite_footer`}
        target="_blank"
        rel="noopener"
        className="font-semibold underline decoration-1 underline-offset-[3px] transition-opacity hover:opacity-80"
        style={{ color: linkColor, textDecorationColor: 'currentColor' }}
      >
        shareinvite.in
      </a>
    </p>
  )
}
