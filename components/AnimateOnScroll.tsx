'use client'

import { useEffect } from 'react'

export default function AnimateOnScroll() {
  useEffect(() => {
    // Signal CSS that JS is ready — activates the scroll-reveal hiding
    document.body.classList.add('js-animate')

    const els = document.querySelectorAll('[data-animate]')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -56px 0px' },
    )

    els.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      document.body.classList.remove('js-animate')
    }
  }, [])

  return null
}
