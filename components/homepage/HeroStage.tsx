'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * The hero's stage, and the one thing that runs its 16s loop (globals.css,
 * "Hero"):
 *  - it rests while the hero is off screen or the tab is in the background,
 *    so the loop costs nothing nobody is watching, and picks up where it was;
 *  - Pause / Play and Replay, for anyone who wants it still or from the top
 *    (WCAG 2.2.2: moving content that lasts more than five seconds can be paused).
 * With reduced motion there is no loop, so there are no controls either.
 */
const LOOP = /^hv(Seq|Cap)/
// The loop's own start, after the phone's entrance (the 1.4s delay in globals.css).
const START_MS = 1400

export default function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const tr = useT()
  const ref = useRef<HTMLDivElement>(null)
  const away = useRef({ off: false, hidden: false })
  const [paused, setPaused] = useState(false)
  const [motion, setMotion] = useState(false)

  const loop = useCallback(
    () => (ref.current?.getAnimations({ subtree: true }) ?? []).filter((a): a is CSSAnimation => 'animationName' in a && LOOP.test((a as CSSAnimation).animationName)),
    [],
  )
  const apply = useCallback(() => {
    const run = !paused && !away.current.off && !away.current.hidden
    for (const a of loop()) {
      if (run && a.playState === 'paused') a.play()
      else if (!run && a.playState === 'running') a.pause()
    }
  }, [paused, loop])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setMotion(!mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      away.current.off = !e.isIntersecting
      apply()
    })
    io.observe(el)
    const onVisibility = () => {
      away.current.hidden = document.hidden
      apply()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [apply])

  useEffect(apply, [apply])

  const replay = () => {
    for (const a of loop()) a.currentTime = START_MS
    setPaused(false)
  }

  return (
    <div ref={ref} className={className}>
      {children}
      {motion && (
        <div className="absolute bottom-[-0.45rem] left-1/2 z-10 ml-[5.6rem] flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? tr('Play the invitation demo') : tr('Pause the invitation demo')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-hv-muted transition-colors hover:bg-hv-ink/5 hover:text-hv-forest"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              {paused ? <path d="M4.5 2.8v10.4L13 8z" /> : <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />}
            </svg>
          </button>
          <button
            type="button"
            onClick={replay}
            aria-label={tr('Replay the invitation demo from the start')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-hv-muted transition-colors hover:bg-hv-ink/5 hover:text-hv-forest"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
