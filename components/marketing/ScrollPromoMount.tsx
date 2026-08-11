'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { PROMO, PROMO_EXCLUDED_PREFIXES, isPromoSnoozed } from '@/lib/promo'

/**
 * Lightweight scroll trigger for the seasonal promotion.
 *
 * This exists purely so the dialog's markup, imagery and analytics never enter
 * the bundle of a visitor who does not see it. Rendering the dialog directly
 * from the root layout put ~12 KB into the layout chunk — paid by every page
 * view, including the SEO landing pages whose speed matters most.
 *
 * Here only the trigger ships. The dialog is fetched once the visitor passes
 * the scroll threshold (or reaches the footer), by which point they are engaged
 * and the request is well clear of the LCP path.
 */
const ScrollPromo = dynamic(() => import('./ScrollPromo'), { ssr: false })

export default function ScrollPromoMount() {
  const pathname = usePathname()
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (!PROMO.enabled || triggered) return
    if (PROMO_EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return
    if (isPromoSnoozed()) return

    // Distance from the document bottom still counted as "reached the footer".
    const BOTTOM_SLACK_PX = 120

    let frame = 0
    let shortPageTimer: ReturnType<typeof setTimeout> | undefined

    const fire = () => {
      setTriggered(true)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(shortPageTimer)
    }

    function onScroll() {
      if (frame) return
      // rAF-throttled and passive: this listener is attached on every page, so
      // it must not be able to cause jank on a mid-range Android device.
      frame = requestAnimationFrame(() => {
        frame = 0
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        if (scrollable <= 0) return
        const depth = window.scrollY / scrollable
        const atBottom = scrollable - window.scrollY <= BOTTOM_SLACK_PX
        if (depth >= PROMO.triggerAtScroll || (PROMO.alsoTriggerAtBottom && atBottom)) {
          fire()
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Nothing to scroll — the visitor can already see the footer, so waiting for
    // a scroll event they will never produce would hide the popup entirely.
    if (PROMO.shortPageDelayMs !== null) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        shortPageTimer = setTimeout(fire, PROMO.shortPageDelayMs)
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(shortPageTimer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pathname, triggered])

  if (!triggered) return null
  return <ScrollPromo />
}
