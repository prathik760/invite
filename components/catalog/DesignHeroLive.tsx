'use client'

import { useEffect, useState } from 'react'
import Image from '@/components/ui/Image'
import LiveDemoScreen from '@/components/create/LiveDemoScreen'
import PreviewButton from '@/components/catalog/PreviewButton'
import { EyeIcon } from '@/components/ui/Icons'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * A design's page opens on the design itself, animating: the real invitation guests receive
 * (/demo/<id>/embed, through LiveDemoScreen) inside a phone, playing from its opening.
 *
 * The design's picture shows first (it is what the page is judged by for speed), and the live
 * invitation fades in over it once the page has loaded and the browser is idle, so the animation
 * never delays the page. On Save-Data or a 2G/3G connection the picture stays.
 *
 * With a mouse the invitation can be clicked and scrolled right there. On a touch screen a swipe
 * on it would scroll the invitation instead of the page, so a tap opens the full-screen live
 * preview instead.
 */
export default function DesignHeroLive({ templateId, name, image }: { templateId: string; name: string; image: string }) {
  const tr = useT()
  const [live, setLive] = useState(false)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none), (pointer: coarse)').matches)
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? '')) return
    let idle = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void }
    const start = () => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setLive(true), { timeout: 2500 })
      else timer = setTimeout(() => setLive(true), 1200)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idle) w.cancelIdleCallback?.(idle)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-[15.5rem] sm:max-w-[20rem]">
      <div aria-hidden className="absolute -inset-8 rounded-[3rem] bg-gold-soft/15 blur-2xl" />
      {/* The phone: a dark bezel, the screen inside. */}
      <div className="relative rounded-[2.6rem] bg-[#16181a] p-[9px] shadow-[0_40px_80px_-40px_rgba(12,43,34,0.75)] ring-1 ring-black/40">
        <div className="relative aspect-[300/620] overflow-hidden rounded-[2.1rem] bg-peach">
          <Image src={image} alt={`${name} digital invitation design`} fill priority sizes="320px" className="object-cover object-top" />
          {live && (
            <div className={`absolute inset-0 ${touch ? 'pointer-events-none' : ''}`}>
              <LiveDemoScreen templateId={templateId} title={name} poster={image} phoneWidth={390} />
            </div>
          )}
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-[9px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#16181a]" />
          {/* On a touch screen the whole phone opens the full-screen live preview. */}
          {touch && (
            <PreviewButton templateId={templateId} source="template_page_phone" ariaLabel={tr('Open the live {name} invitation full screen', { name })} className="absolute inset-0 block" >
              <span className="sr-only">{tr('Open the live invitation')}</span>
            </PreviewButton>
          )}
        </div>
      </div>
      <p className="mt-4 text-balance text-center text-[0.85rem] leading-6 text-muted">
        <span className={`mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full align-middle ${live ? 'bg-emerald-soft' : 'bg-burnished'}`} aria-hidden />
        {touch ? tr('The real invitation, animating. Tap it to open full screen.') : tr('The real invitation, animating. Click and scroll inside it.')}
      </p>
      <div className="mt-3 flex justify-center">
        <PreviewButton
          templateId={templateId}
          source="template_page"
          className="btn-gold inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[0.9rem] font-semibold"
        >
          <EyeIcon className="h-4 w-4" /> {tr('Open full-screen preview')}
        </PreviewButton>
      </div>
    </div>
  )
}
