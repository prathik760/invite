'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// `data-reveal` / `data-reveal-group` are the brand motion system (see the
// "Motion: reveal on scroll" block in globals.css); `data-animate` is legacy.
const SELECTOR = '[data-animate], [data-reveal], [data-reveal-group]'

export default function AnimateOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // Clear stale is-visible from any previous visit to this route so
    // all [data-animate] elements replay their entrance animation.
    // Done before the RAF so there's no paint with them hidden.
    document.querySelectorAll(SELECTOR).forEach((el) => {
      el.classList.remove('is-visible', 'reveal-done')
    })

    let io: IntersectionObserver | null = null
    const timers: number[] = []
    const rafId = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<Element>(SELECTOR))

      // Pre-mark elements already in viewport so they are never hidden.
      //
      // Split into a read pass then a write pass. Previously each iteration
      // called getBoundingClientRect() (a read that forces layout) and then
      // classList.add() (a write that invalidates it), so every element in the
      // list triggered its own synchronous relayout — classic layout thrash,
      // and the "forced reflow" Lighthouse reports. Batching means one layout
      // for the whole set.
      const viewportH = window.innerHeight
      const inViewport = els.filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.top < viewportH && rect.bottom > 0
      })
      inViewport.forEach((el) => el.classList.add('is-visible', 'reveal-done'))

      document.body.classList.add('js-animate')

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target
              el.classList.add('is-visible')
              io!.unobserve(el)
              // Stagger delays exist for the entrance only. Once it has played,
              // drop them so hover transitions on those elements are immediate.
              timers.push(window.setTimeout(() => el.classList.add('reveal-done'), 1600))
            }
          })
        },
        // Reveal once an element's top is 10% up the screen. A ratio threshold
        // (it was 8%) can never be met by a group taller than ~12 screens — the
        // blog's article grid stayed invisible however far you scrolled.
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      )

      els
        .filter((el) => !el.classList.contains('is-visible'))
        .forEach((el) => io!.observe(el))
    })

    return () => {
      cancelAnimationFrame(rafId)
      timers.forEach((t) => window.clearTimeout(t))
      io?.disconnect()
      document.body.classList.remove('js-animate')
    }
    // Re-run on every route change — new page = new DOM elements to observe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
