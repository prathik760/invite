'use client'

import { useEffect, useState } from 'react'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { SAMPLE_QUIET, SAMPLE_RSVP, SAMPLE_SHOW, type SampleFeature } from '@/lib/embedSignals'

/**
 * A design as a guest gets it, made safe to play with on the homepage
 * (/demo/<id>/sample, framed by components/homepage/TryInvitation).
 *
 *  - Sample music: the sample data carries no song, so one is added once the
 *    page has mounted, as an absolute address (kit/core musicSrc also takes a
 *    path on this site now; the absolute form is kept as it was).
 *  - The reply never leaves: a tap on a WhatsApp link is stopped here and
 *    its prefilled text handed to the homepage, which shows it as a sample.
 *    Nothing is sent and nothing is stored.
 *  - "Show me": the homepage can ask for a part of the invitation (music,
 *    photos, map, reply). If the design is still closed it is opened first,
 *    then the part is scrolled to and outlined for a moment.
 */
/** A design's cover: while it is showing, nothing below it can be reached. */
const OPENERS = 'button[aria-label^="Open the doors"], button[aria-label^="Open the invitation"]'
const TARGETS: Record<SampleFeature, string> = {
  details: '[id$="-invite"]',
  music: 'button[aria-label$="music"]',
  gallery: 'button[aria-label^="View photo"]',
  map: 'a[href*="google.com/maps"], a[href*="maps.google"], a[href*="maps.app.goo.gl"]',
  rsvp: 'a[href^="https://wa.me/"]',
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function SampleStage({ templateId, data, musicPath }: { templateId: string; data: Record<string, string>; musicPath?: string }) {
  const [sample, setSample] = useState(data)
  const [note, setNote] = useState(false)

  useEffect(() => {
    if (musicPath) setSample((d) => ({ ...d, musicUrl: window.location.origin + musicPath }))
  }, [musicPath])

  useEffect(() => {
    const origin = window.location.origin
    const framed = window.parent !== window

    // Replies stay here.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]') as HTMLAnchorElement | null
      if (!a) return
      e.preventDefault()
      e.stopPropagation()
      const text = new URL(a.href).searchParams.get('text') ?? ''
      if (framed) window.parent.postMessage({ type: SAMPLE_RSVP, text }, origin)
      else setNote(true)
    }
    document.addEventListener('click', onClick, true)

    let busy = 0
    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== origin || e.source !== window.parent) return
      if (e.data?.type === SAMPLE_QUIET) {
        document.querySelector<HTMLElement>('button[aria-label="Pause music"]')?.click()
        return
      }
      if (e.data?.type !== SAMPLE_SHOW) return
      const feature = e.data.feature as SampleFeature
      const my = ++busy
      // Still closed? Open it first: the page under a cover does not scroll.
      const opener = document.querySelector<HTMLElement>(OPENERS)
      if (opener && opener.getBoundingClientRect().height > 0 && getComputedStyle(opener).visibility !== 'hidden') opener.click()
      // Then wait until the page can scroll and the part is laid out (an opening runs a few seconds).
      const ready = () => {
        const t = document.querySelector<HTMLElement>(TARGETS[feature])
        const scrolls = document.documentElement.scrollHeight > window.innerHeight + 200
        return t && t.getBoundingClientRect().height > 0 && (scrolls || feature === 'music') ? t : null
      }
      let el = ready()
      for (let waited = 0; !el && waited < 9000 && my === busy; waited += 250) {
        await sleep(250)
        el = ready()
      }
      if (!el || my !== busy) return
      await sleep(300)
      // The gallery is outlined as a whole, not its first photo.
      const spot = feature === 'gallery' ? (el.parentElement?.parentElement ?? el) : el
      spot.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (feature === 'music' && el.getAttribute('aria-pressed') !== 'true') el.click()
      await sleep(500)
      document.querySelectorAll('.si-spot').forEach((n) => n.classList.remove('si-spot'))
      spot.classList.add('si-spot')
      await sleep(2600)
      spot.classList.remove('si-spot')
    }
    window.addEventListener('message', onMessage)

    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: '.si-spot{outline:3px solid #C7A45B!important;outline-offset:5px;border-radius:12px;animation:siSpot 1.3s ease-out 2}@keyframes siSpot{0%{box-shadow:0 0 0 0 rgba(199,164,91,.6)}100%{box-shadow:0 0 0 18px rgba(199,164,91,0)}}@media (prefers-reduced-motion:reduce){.si-spot{animation:none}}' }} />
      <TemplateRenderer templateId={templateId} data={sample} isPreview={false} />
      {note && (
        <div role="status" className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-white p-4 text-[14px] text-neutral-800 shadow-2xl">
          This is a sample invitation, so no reply was sent. On a real invitation this opens WhatsApp with the guest&apos;s answer, addressed to the hosts.
          <button type="button" onClick={() => setNote(false)} className="mt-2 block font-semibold text-emerald-800 underline">
            Close
          </button>
        </div>
      )}
    </>
  )
}
