'use client'

import { useEffect, useRef, useState } from 'react'
import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import LiveDemoScreen from '@/components/create/LiveDemoScreen'
import RajwadaFrame from './RajwadaFrame'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { SAMPLE_QUIET, SAMPLE_RSVP, SAMPLE_SHOW, type SampleFeature } from '@/lib/embedSignals'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * "Open a real invitation": Rajwada exactly as guests get it, live in a phone
 * (/demo/signature-rajwada/sample), with the features around it. Each one has
 * a "Show me" that opens the invitation to that part; the visitor can also just
 * use the phone. It is a sample: the song is a sample, and a reply never
 * leaves the page (components/templates/SampleStage), it is shown here instead.
 *
 * The frame loads only as the section comes near. On a touch screen the phone
 * starts behind a "Tap to try it" cover, so scrolling the page never gets
 * caught inside the invitation; "Done" puts the cover back.
 */
type Key = SampleFeature | 'share'
const FEATURES: { key: Key; title: string; copy: string }[] = [
  { key: 'details', title: 'Personalization', copy: 'Your names, your families and your words, in any language.' },
  { key: 'music', title: 'Background music', copy: 'Your song, playing as soon as a guest presses play.' },
  { key: 'gallery', title: 'Photo gallery', copy: 'Your photographs, large, and full screen at a tap.' },
  { key: 'map', title: 'Google Maps', copy: 'A Directions button that opens the way to the venue.' },
  { key: 'rsvp', title: 'Guest RSVP', copy: 'Guests reply from the invitation, straight to your WhatsApp.' },
  { key: 'share', title: 'WhatsApp sharing', copy: 'One link with a preview card, for every chat and group.' },
]

function Icon({ k }: { k: Key }) {
  const d: Record<Key, string> = {
    details: 'M4 20h4L19 9l-4-4L4 16v4Zm11-15 4 4',
    music: 'M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    gallery: 'M4 6h16v12H4zM4 15l4-4 4 4 3-3 5 5M15 9.5h.01',
    map: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    rsvp: 'M5 12.5 10 17 19 7',
    share: 'M8 12h8M12 8l4 4-4 4M4 5v14',
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hv-gold/50 text-hv-gold-ink" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d[k]} /></svg>
    </span>
  )
}

export default function TryInvitation({ templateId: ID, couple, link }: { templateId: string; couple: string; link: string }) {
  const tr = useT()
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLIFrameElement | null>(null)
  const [near, setNear] = useState(false)
  // Off screen, the frame is set aside (display: none) so the design's own
  // animations stop costing anything; it keeps its place and state.
  const [awake, setAwake] = useState(true)
  const [active, setActive] = useState<Key | null>(null)
  const [touch, setTouch] = useState(false)
  const [live, setLive] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '700px 0px' })
    io.observe(el)
    const seen = new IntersectionObserver(
      ([e]) => {
        setAwake(e.isIntersecting)
        if (!e.isIntersecting) frame.current?.contentWindow?.postMessage({ type: SAMPLE_QUIET }, window.location.origin)
      },
      { rootMargin: '150px 0px' },
    )
    seen.observe(el)
    return () => {
      io.disconnect()
      seen.disconnect()
    }
  }, [])

  // While a visitor on a touch screen is using the invitation (or one of its sheets is open),
  // the page's floating bar and chat button step aside so they never sit over it (globals.css).
  useEffect(() => {
    const focus = touch && (live || reply !== null || sharing)
    document.documentElement.toggleAttribute('data-hv-focus', focus)
    return () => document.documentElement.removeAttribute('data-hv-focus')
  }, [touch, live, reply, sharing])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow || e.data?.type !== SAMPLE_RSVP) return
      setSharing(false)
      setReply(String(e.data.text || ''))
      trackEvent('sample_rsvp', { location: 'home_try' })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const show = (k: Key) => {
    setActive(k)
    setReply(null)
    trackEvent('feature_demo', { feature: k, location: 'home_try' })
    if (k === 'share') {
      setSharing(true)
      return
    }
    setSharing(false)
    frame.current?.contentWindow?.postMessage({ type: SAMPLE_SHOW, feature: k }, window.location.origin)
  }

  const item = (f: (typeof FEATURES)[number], side: 'left' | 'right') => (
    <li key={f.key}>
      <button
        type="button"
        onClick={() => show(f.key)}
        aria-pressed={active === f.key}
        className={`group flex w-full items-start gap-4 py-5 text-left transition-colors ${side === 'left' ? 'lg:flex-row-reverse lg:text-right' : ''}`}
      >
        <Icon k={f.key} />
        <span className="min-w-0">
          <span className={`hv-serif block text-[1.45rem] font-semibold leading-tight ${active === f.key ? 'text-hv-forest' : 'text-hv-ink'}`}>{tr(f.title)}</span>
          <span className="mt-1 block text-[0.98rem] leading-[1.6] text-hv-muted">{tr(f.copy)}</span>
          <span className={`mt-2 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-hv-forest underline decoration-hv-gold/60 underline-offset-4 transition-opacity ${active === f.key ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
            {active === f.key ? tr('Showing on the phone') : tr('Show me')}
          </span>
        </span>
      </button>
    </li>
  )

  return (
    <section ref={root} id="features" aria-labelledby="hv-try-title" className="hv-sec scroll-mt-20">
      <div className="hv-shell">
        <div className="mx-auto max-w-[44rem] text-center" data-reveal>
          <h2 id="hv-try-title" className="hv-h2">{tr('Open a real invitation.')}</h2>
          <p className="hv-lede mx-auto mt-5 max-w-[36rem]">
            {tr('This is {name}, exactly as your guests receive it. Tap the doors, play the music, look through the photos and try a reply. It is a sample: nothing here is sent to anyone.', { name: 'Rajwada' })}
          </p>
        </div>

        {/* minmax(0,1fr): the chip rail must scroll inside the column, not widen it. */}
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] items-center gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-14">
          <ul className="divide-y divide-hv-line max-lg:hidden">{FEATURES.slice(0, 3).map((f) => item(f, 'left'))}</ul>

          {/* The phone, live. */}
          <div className="mx-auto flex flex-col items-center">
            <div className="hv-phone w-[16rem] sm:w-[18rem] lg:w-[19rem]">
              <div className="hv-screen-box">
                <div className="absolute inset-0 flex flex-col">
                  {/* A status bar, so the invitation starts below the notch as it does on a real phone. */}
                  <div className="flex h-[11.5cqw] shrink-0 items-center justify-between bg-[#111] px-[7.5cqw] text-[3.3cqw] font-semibold text-white" aria-hidden>
                    <span>9:41</span>
                    <span className="flex items-center gap-[1.2cqw]">
                      <svg viewBox="0 0 18 12" className="h-[2.8cqw] w-[4.2cqw]" fill="currentColor"><path d="M1 9h3v3H1zM6 6h3v6H6zM11 3h3v9h-3zM16 0h2v12h-2z" /></svg>
                      <span className="relative h-[3cqw] w-[6cqw] rounded-[0.8cqw] border border-white/70 p-[0.4cqw]"><span className="block h-full w-[75%] rounded-[0.4cqw] bg-white" /></span>
                    </span>
                  </div>
                  <div className={`relative min-h-0 flex-1 ${awake ? '' : '[&_iframe]:!hidden'}`}>
                    {/* The design's cover, always underneath: it shows before the live
                        invitation arrives, while it loads, and while it rests off screen,
                        so the phone is never an empty black screen. Cached from the hero. */}
                    <RajwadaFrame name="closed" alt={tr('{name}, a sample invitation, closed at its palace gate', { name: 'Rajwada' })} className="hv-fill object-top" />
                    {near && <LiveDemoScreen templateId={ID} title={tr('{name}, a sample invitation', { name: 'Rajwada' })} src={`/demo/${ID}/sample`} frameRef={frame} className="!absolute inset-0" />}
                  </div>
                </div>

                {/* Touch screens: a cover until the visitor chooses to play. */}
                {touch && !live && (
                  <button type="button" onClick={() => setLive(true)} className="absolute inset-0 z-10">
                    {/* On the lower door panels: clear of the couple's names, date and the design's own words. */}
                    <span className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-hv-deep shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
                      {tr('Tap to try it')}
                    </span>
                  </button>
                )}

                {/* A reply, shown instead of sent. */}
                <div className="hv-sheet absolute inset-x-0 bottom-0 z-20 rounded-t-[1.4rem] bg-white p-[6cqw] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.4)]" data-open={reply !== null ? '' : undefined} aria-hidden={reply === null}>
                  <p className="text-[4.6cqw] font-semibold text-hv-ink">{tr('Your sample reply')}</p>
                  <p className="mt-[2cqw] text-[3.6cqw] leading-[1.5] text-hv-muted">{tr('On your invitation, this opens WhatsApp with the guest’s answer, addressed to you:')}</p>
                  <p className="mt-[3cqw] rounded-[2.4cqw] rounded-tr-none bg-[#D9FDD3] px-[3cqw] py-[2.4cqw] text-[3.6cqw] leading-[1.45] text-[#111B21]">
                    {reply}
                    <span className="text-[#667781]">…</span>
                  </p>
                  <p className="mt-[3cqw] text-[3.3cqw] text-hv-muted">{tr('Nothing was sent.')}</p>
                  <button type="button" tabIndex={reply === null ? -1 : 0} onClick={() => setReply(null)} className="mt-[4cqw] w-full rounded-full bg-hv-forest py-[3cqw] text-[3.8cqw] font-semibold text-hv-ivory">
                    {tr('Back to the invitation')}
                  </button>
                </div>

                {/* Sharing: what publishing gives you. */}
                <div className="hv-sheet absolute inset-x-0 bottom-0 z-20 rounded-t-[1.4rem] bg-white p-[6cqw] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.4)]" data-open={sharing ? '' : undefined} aria-hidden={!sharing}>
                  <p className="text-[4.6cqw] font-semibold text-hv-ink">{tr('Share invitation')}</p>
                  <div className="mt-[3cqw] overflow-hidden rounded-[2.4cqw] bg-[#F0F2F5]">
                    <Image src="/templates/phone/share-rajwada.jpg" alt="" width={600} height={315} sizes="300px" className="block h-auto w-full" />
                    <p className="px-[3cqw] py-[2cqw] text-[3.4cqw] font-semibold text-[#111B21]">{tr('Wedding Invitation · {couple}', { couple })}</p>
                  </div>
                  <p className="mt-[3cqw] truncate rounded-[2cqw] bg-hv-linen px-[3cqw] py-[2cqw] text-[3.4cqw] text-hv-ink">{link}</p>
                  <div className="mt-[3.5cqw] grid grid-cols-4 gap-[2cqw] text-center text-[2.9cqw] text-hv-muted">
                    {[['WhatsApp', '#25D366'], ['Instagram', '#D6297B'], ['Email', '#5B6B7A'], ['Copy link', '#123D2E']].map(([n, c]) => (
                      <span key={n}>
                        <span className="mx-auto mb-[1.4cqw] block h-[11cqw] w-[11cqw] rounded-full" style={{ background: c }} />
                        {tr(n)}
                      </span>
                    ))}
                  </div>
                  <button type="button" tabIndex={sharing ? 0 : -1} onClick={() => setSharing(false)} className="mt-[4cqw] w-full rounded-full border border-hv-ink/15 py-[2.6cqw] text-[3.6cqw] font-semibold text-hv-ink">
                    {tr('Close')}
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-5 flex items-center gap-3 text-[0.9rem] text-hv-muted">
              {touch && live ? (
                <button type="button" onClick={() => setLive(false)} className="font-semibold text-hv-forest underline underline-offset-4">
                  {tr('Done')}
                </button>
              ) : (
                <span>{tr('A sample invitation, live')}</span>
              )}
              <span aria-hidden>·</span>
              <TrackedLink href={`/demo/${ID}`} location="home_try_full" className="font-semibold text-hv-forest underline decoration-hv-gold/60 underline-offset-4">
                {tr('Open full screen')}
              </TrackedLink>
            </p>
          </div>

          <ul className="divide-y divide-hv-line max-lg:hidden">{FEATURES.slice(3).map((f) => item(f, 'right'))}</ul>

          {/* Phones and tablets: the features as a row of chips under the phone. */}
          <div className="min-w-0 lg:hidden">
            <div className="hv-rail -mx-[var(--hv-gutter)] flex gap-2 overflow-x-auto px-[var(--hv-gutter)] pb-1" role="group" aria-label={tr('Show a feature on the phone')}>
              {FEATURES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => show(f.key)}
                  aria-pressed={active === f.key}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-[0.92rem] font-medium transition-colors ${active === f.key ? 'border-hv-forest bg-hv-forest text-hv-ivory' : 'border-hv-ink/15 text-hv-ink'}`}
                >
                  {tr(f.title)}
                </button>
              ))}
            </div>
            <p className="mt-4 min-h-[3.2rem] text-center text-[1rem] leading-[1.6] text-hv-muted">
              {active ? tr(FEATURES.find((f) => f.key === active)?.copy ?? '') : tr('Pick one to see it on the phone, or tap the phone and explore.')}
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center" data-reveal>
          <TrackedLink href="/create?template=signature-rajwada" location="home_try" className="hv-btn">
            {tr('Make this invitation yours')}
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
