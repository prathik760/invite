'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_EVENT } from '@/lib/consent'
import { journalEnabled, journalPageView, startJournal, visitorId } from '@/lib/journal'

// A layout effect runs before every page's own effects, so "Opened Builder"
// is recorded ahead of the "Started the builder" event the page fires.
const useBeforePageEffects = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Feeds the visitor journal (lib/journal.ts): a page view on every route
 * change, plus the click, error and leave listeners. Renders nothing.
 */
export default function JournalTracker() {
  const pathname = usePathname()
  const page = useRef({ start: Date.now(), scroll: 0, interacted: false })

  useEffect(() => {
    const measure = () => {
      const el = document.documentElement
      const seen = el.scrollHeight > 0 ? (window.scrollY + window.innerHeight) / el.scrollHeight : 1
      page.current.scroll = Math.max(page.current.scroll, Math.min(100, Math.round(seen * 100)))
    }
    const onScroll = () => {
      page.current.interacted = true
      measure()
    }
    // Whether a person did anything on the page at all: a tap, a key, a scroll.
    // An automated browser that only loads the page does none of these, which
    // is how /admin/activity tells it from a real visitor who left quickly.
    const acted = () => {
      page.current.interacted = true
    }
    const ACTS = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const
    window.addEventListener('scroll', onScroll, { passive: true })
    ACTS.forEach((e) => window.addEventListener(e, acted, { passive: true, capture: true }))
    const stop = startJournal(() => {
      measure()
      return {
        seconds: Math.round((Date.now() - page.current.start) / 1000),
        scroll: page.current.scroll,
        interacted: page.current.interacted,
      }
    })
    // Lets a Clarity replay be found from the visitor's page at /admin/activity.
    // Where Clarity waits for consent (lib/consent.ts), it starts on the yes.
    const tagClarity = () => {
      const id = visitorId()
      if (id) window.clarity?.('set', 'visitor', id)
    }
    tagClarity()
    window.addEventListener(CONSENT_EVENT, tagClarity)
    return () => {
      window.removeEventListener('scroll', onScroll)
      ACTS.forEach((e) => window.removeEventListener(e, acted, { capture: true }))
      window.removeEventListener(CONSENT_EVENT, tagClarity)
      stop()
    }
  }, [])

  useBeforePageEffects(() => {
    page.current = { start: Date.now(), scroll: 0, interacted: false }
    if (journalEnabled()) journalPageView()
  }, [pathname])

  return null
}
