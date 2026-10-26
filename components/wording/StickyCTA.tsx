'use client'

import Link from '@/components/ui/Link'
import { useEffect, useState } from 'react'
import BottomDock from '@/components/ui/BottomDock'
import Image from '@/components/ui/Image'
import { Price } from '@/components/price/Price'
import { CloseIcon } from '@/components/ui/Icons'
import { trackCta } from '@/lib/analytics'
import { CONSENT_EVENT, consentState } from '@/lib/consent'
import { templatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'

/** One close covers every wording guide for the rest of the visit. */
const CLOSED_KEY = 'si-wording-bar-closed'
const LOCATION = 'wording_sticky_bar'

interface StickyCTAProps {
  /** The guide's main design: the bar opens the builder with it. */
  templateId: string
  /** `id` of the guide's first section. The bar waits until the reader is past it. */
  afterId: string
}

/**
 * Phone-only bar: "send your words as an animated invitation", once the reader
 * is past the first section, until they close it.
 *
 * Mounted only while it shows. Its BottomDock publishes --bottom-dock-h, which
 * lifts the floating WhatsApp button (and any toast) clear of it; mounted all
 * along, that lift applied before the bar had appeared. It also waits while
 * the cookie question is open, so the two never stack at the bottom of a phone.
 */
export default function StickyCTA({ templateId, afterId }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(CLOSED_KEY)) return
    } catch {
      /* storage blocked: show it, the close still works for this page */
    }

    const phone = window.matchMedia('(max-width: 639.98px)')
    const section = document.getElementById(afterId)
    let past = false
    const update = () => setVisible(past && phone.matches && consentState() !== 'pending')

    window.addEventListener(CONSENT_EVENT, update)

    if (!section) {
      // No such section: fall back to a plain scroll depth.
      const onScroll = () => {
        past = window.scrollY > 900
        update()
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener(CONSENT_EVENT, update)
      }
    }

    // Past = the whole section is above the screen, including after a jump
    // link straight to a later section.
    const io = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      past = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
      update()
    })
    io.observe(section)
    return () => {
      io.disconnect()
      window.removeEventListener(CONSENT_EVENT, update)
    }
  }, [afterId])

  if (!visible || closed) return null

  const href = `/create?template=${encodeURIComponent(templateId)}&src=${LOCATION}`
  const close = () => {
    try {
      window.sessionStorage.setItem(CLOSED_KEY, '1')
    } catch {
      /* ignore */
    }
    setClosed(true)
  }

  return (
    <BottomDock
      className="animate-fade-up border-t border-line bg-paper/95 shadow-[0_-10px_30px_-20px_rgba(5,46,32,0.45)] backdrop-blur-md sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center gap-3 py-2 pl-3.5 pr-1.5">
        <Image
          src={templateImage(templateId)}
          alt=""
          width={32}
          height={40}
          sizes="32px"
          className="h-10 w-8 shrink-0 rounded-md border border-line object-cover object-top"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[0.82rem] font-semibold leading-[1.3] text-charcoal">Send your words as an animated invitation</p>
          <p className="mt-0.5 text-[0.72rem] leading-4 text-muted">
            Preview before you pay · <Price inr={templatePrice(templateId)} />
          </p>
        </div>
        <Link
          href={href}
          prefetch={false}
          onClick={() => trackCta('Try it', LOCATION, { template_id: templateId, destination: href })}
          className="btn-primary shrink-0 rounded-full px-4 py-2.5 text-[0.82rem] font-semibold"
        >
          Try it
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal/55 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </BottomDock>
  )
}
