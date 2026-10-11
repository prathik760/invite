'use client'

import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { EMBED_PLAY, EMBED_READY } from '@/lib/embedSignals'

/** Never keep the preview waiting longer than this for images or fonts. */
const READY_CAP_MS = 2500

/**
 * Wraps a design on /demo/<id>/embed, the page the live preview frames.
 *
 * The preview keeps its frame hidden behind a poster until the page can be
 * shown. It used to wait for the frame's `load` event — every image on the
 * page, seconds after the design had started — so on a first visit the
 * opening (doors, envelope, seal) played unseen. Now the page says when its
 * first screen is ready, and when the preview reveals it the design is
 * remounted, so it starts from its first frame in view. Its code and images
 * are loaded by then, so the restart is instant.
 *
 * Outside a frame (someone opening the URL directly) nothing changes.
 */
export default function EmbedStage({ children }: { children: ReactNode }) {
  const [take, setTake] = useState(0)

  useEffect(() => {
    if (window.parent === window) return
    const origin = window.location.origin

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== origin || e.data !== EMBED_PLAY) return
      window.scrollTo(0, 0)
      setTake((n) => n + 1)
    }
    window.addEventListener('message', onMessage)

    let cancelled = false
    const firstScreen = Array.from(document.images).filter(
      (img) => !img.complete && img.getBoundingClientRect().top < window.innerHeight,
    )
    const settled = Promise.all([document.fonts?.ready, ...firstScreen.map((img) => img.decode().catch(() => undefined))])
    const cap = new Promise((resolve) => setTimeout(resolve, READY_CAP_MS))
    Promise.race([settled, cap]).then(() => {
      // Two frames, so what is posted as ready has been painted.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!cancelled) window.parent.postMessage(EMBED_READY, origin)
      }))
    })

    return () => {
      cancelled = true
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return <Fragment key={take}>{children}</Fragment>
}
