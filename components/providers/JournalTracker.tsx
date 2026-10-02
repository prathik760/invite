'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
  const page = useRef({ start: Date.now(), scroll: 0 })

  useEffect(() => {
    const measure = () => {
      const el = document.documentElement
      const seen = el.scrollHeight > 0 ? (window.scrollY + window.innerHeight) / el.scrollHeight : 1
      page.current.scroll = Math.max(page.current.scroll, Math.min(100, Math.round(seen * 100)))
    }
    window.addEventListener('scroll', measure, { passive: true })
    const stop = startJournal(() => {
      measure()
      return { seconds: Math.round((Date.now() - page.current.start) / 1000), scroll: page.current.scroll }
    })
    // Lets a Clarity replay be found from the visitor's page at /admin/activity.
    const id = visitorId()
    if (id) window.clarity?.('set', 'visitor', id)
    return () => {
      window.removeEventListener('scroll', measure)
      stop()
    }
  }, [])

  useBeforePageEffects(() => {
    page.current = { start: Date.now(), scroll: 0 }
    if (journalEnabled()) journalPageView()
  }, [pathname])

  return null
}
