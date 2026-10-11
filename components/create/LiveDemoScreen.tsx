'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EMBED_PLAY, EMBED_READY } from '@/lib/embedSignals'

/**
 * A design's real demo page (/demo/<id>/embed) inside a phone screen.
 *
 * The live preview used to render the template in builder mode, which skips
 * the opening (doors, envelope, postcard), the entrance animations and the
 * ticking countdown — so it never looked like what guests receive. This frames
 * the actual page instead.
 *
 * `phoneWidth`: the CSS width the page is laid out at. A smaller screen shows
 * that layout scaled down, like a phone held further away; a wider one just
 * lays out wider. Pass 0 to always lay out at the screen's own width (the
 * full-screen preview on a phone).
 *
 * The frame stays hidden behind the poster until the page reports that its
 * first screen is ready (EmbedStage), not until `load` — which waited for
 * every image, by when the opening had already played unseen. On reveal the
 * page is told to start the design over, so the opening is always seen.
 * `load` remains the fallback.
 */
export default function LiveDemoScreen({
  templateId,
  title,
  poster,
  phoneWidth = 390,
  className,
}: {
  templateId: string
  title: string
  poster?: string
  phoneWidth?: number
  className?: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const revealed = useRef(false)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    setLoaded(true)
    frameRef.current?.contentWindow?.postMessage(EMBED_PLAY, window.location.origin)
  }, [])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === EMBED_READY && e.origin === window.location.origin && e.source === frameRef.current?.contentWindow) reveal()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [reveal])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    revealed.current = false
    setLoaded(false)
  }, [templateId])

  const scale = box && phoneWidth > 0 && box.w < phoneWidth ? box.w / phoneWidth : 1
  const frameW = box ? box.w / scale : 0
  const frameH = box ? box.h / scale : 0

  return (
    <div ref={boxRef} className={`relative h-full w-full overflow-hidden ${className ?? ''}`}>
      {box && (
        <iframe
          key={templateId}
          ref={frameRef}
          src={`/demo/${templateId}/embed`}
          title={`${title} — live preview`}
          onLoad={reveal}
          className="absolute left-0 top-0 border-0"
          style={{
            width: frameW,
            height: frameH,
            transform: scale === 1 ? undefined : `scale(${scale})`,
            transformOrigin: '0 0',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        />
      )}
      {!loaded && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {poster && <Image src={poster} alt="" fill sizes="320px" className="object-cover object-top" />}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/45 via-transparent to-transparent pb-8">
            <span className="flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-1.5 text-[12px] font-semibold text-white">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Opening the live preview…
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
