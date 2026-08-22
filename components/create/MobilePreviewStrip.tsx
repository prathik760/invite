'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

/**
 * The preview is rendered at this fixed size and then scaled down, so the
 * template's own breakpoints resolve against a realistic phone width rather
 * than the few hundred pixels of the thumbnail. Both numbers are the single
 * source for the shell's geometry — the scale factor and the screen height are
 * derived from them, not written down separately.
 *
 * The previous version hard-coded `width: 144px`, `height: 248px` and
 * `scale(0.4390)`. Three numbers that had to agree with each other by hand, and
 * an identical 144px thumbnail on every phone from a 320px SE to a 430px Pro
 * Max — half the available width left empty on most devices.
 */
const DESIGN_W = 328
const DESIGN_H = 565

/** Share of the available width the phone shell should occupy. */
const WIDTH_RATIO = 0.54
const MIN_SCREEN_W = 132
const MAX_SCREEN_W = 208
/** Keeps the thumbnail from dominating a short viewport. */
const MAX_SCREEN_H = 330

const SHELL_PADDING = 6

interface MobilePreviewStripProps {
  templateId: string
  data: Record<string, string>
  isDark?: boolean
  color?: string
}

export default function MobilePreviewStrip({ templateId, data, isDark = false }: MobilePreviewStripProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  // Seeded with the midpoint rather than 0 so the first paint is already close
  // to final and the card does not visibly jump once measured.
  const [screenW, setScreenW] = useState(168)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const available = el.clientWidth - SHELL_PADDING * 2
      let w = Math.round(Math.min(Math.max(available * WIDTH_RATIO, MIN_SCREEN_W), MAX_SCREEN_W))
      // Re-derive from the height cap so the aspect ratio is never distorted.
      const h = w * (DESIGN_H / DESIGN_W)
      if (h > MAX_SCREEN_H) w = Math.round(MAX_SCREEN_H * (DESIGN_W / DESIGN_H))
      setScreenW(w)
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const screenH = Math.round(screenW * (DESIGN_H / DESIGN_W))
  const scale = screenW / DESIGN_W
  // Corner radii tracked to the shell size, otherwise a larger phone looks
  // square-ish and a smaller one looks like a pill.
  const screenRadius = Math.round(screenW * 0.118)
  const shellRadius = screenRadius + SHELL_PADDING

  return (
    <div
      ref={wrapRef}
      className="mx-4 my-4 flex flex-col items-center rounded-2xl px-3 py-5"
      style={{
        background: isDark ? 'rgba(6,6,14,0.6)' : 'rgba(184,138,68,0.05)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(184,138,68,0.15)'}`,
      }}
    >
      <p
        className="mb-3 text-center text-[9px] font-bold uppercase tracking-[.24em]"
        style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(44,32,28,0.38)' }}
      >
        Live preview — updates as you type
      </p>

      {/* Minimal phone shell */}
      <div
        style={{
          background: '#1C1C1E',
          borderRadius: `${shellRadius}px`,
          padding: `${SHELL_PADDING}px`,
          boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
          maxWidth: '100%',
        }}
      >
        {/* Dynamic island, sized off the screen width like everything else */}
        <div
          style={{
            height: Math.round(screenW * 0.125),
            display: 'flex',
            justifyContent: 'center',
            marginBottom: -Math.round(screenW * 0.097),
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              marginTop: 4,
              width: Math.round(screenW * 0.39),
              height: Math.round(screenW * 0.083),
              background: '#1C1C1E',
              borderRadius: 999,
            }}
          />
        </div>

        {/* Screen container — clips the scaled PreviewPane */}
        <div
          style={{
            width: screenW,
            height: screenH,
            borderRadius: `${screenRadius}px`,
            overflow: 'hidden',
            background: '#fff',
            position: 'relative',
          }}
        >
          <div
            style={{
              // Definite size so full-height (3D) previews resolve; the scale
              // maps it exactly onto the screen box above.
              width: DESIGN_W,
              height: DESIGN_H,
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
              // The whole strip is a tap target that opens the full-screen
              // preview, so the thumbnail must not swallow the tap.
              pointerEvents: 'none',
            }}
          >
            <PreviewPane templateId={templateId} data={data} />
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 5, paddingBottom: 1 }}>
          <div
            style={{
              width: Math.round(screenW * 0.3),
              height: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </div>

      {/* Was "Scroll inside to explore" — the thumbnail sets pointer-events to
          none and the whole card opens the full-screen preview, so nothing
          could be scrolled inside it. */}
      <p
        className="mt-3 text-center text-[9px]"
        style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(44,32,28,0.32)' }}
      >
        Tap to open full screen
      </p>
    </div>
  )
}
