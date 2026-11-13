'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

/** Reports `pricing_view` once, when the homepage's pricing section is half on screen. */
export default function PricingView() {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const section = ref.current?.parentElement
    if (!section) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        trackEvent('pricing_view', { location: 'home' })
        io.disconnect()
      },
      { threshold: 0.35 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])
  return <span ref={ref} hidden />
}
