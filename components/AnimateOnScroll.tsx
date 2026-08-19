'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnimateOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // Clear stale is-visible from any previous visit to this route so
    // all [data-animate] elements replay their entrance animation.
    // Done before the RAF so there's no paint with them hidden.
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.remove('is-visible')
    })

    let io: IntersectionObserver | null = null
    const rafId = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<Element>('[data-animate]'))

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
      inViewport.forEach((el) => el.classList.add('is-visible'))

      document.body.classList.add('js-animate')

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io!.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
      )

      els
        .filter((el) => !el.classList.contains('is-visible'))
        .forEach((el) => io!.observe(el))
    })

    return () => {
      cancelAnimationFrame(rafId)
      io?.disconnect()
      document.body.classList.remove('js-animate')
    }
    // Re-run on every route change — new page = new DOM elements to observe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
