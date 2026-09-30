'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

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
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => setLoaded(false), [templateId])

  const scale = box && phoneWidth > 0 && box.w < phoneWidth ? box.w / phoneWidth : 1
  const frameW = box ? box.w / scale : 0
  const frameH = box ? box.h / scale : 0

  return (
    <div ref={boxRef} className={`relative h-full w-full overflow-hidden ${className ?? ''}`}>
      {box && (
        <iframe
          key={templateId}
          src={`/demo/${templateId}/embed`}
          title={`${title} — live preview`}
          onLoad={() => setLoaded(true)}
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
