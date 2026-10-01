'use client'

import { useState } from 'react'
import { trackEvent, seoEvents } from '@/lib/analytics'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/** The link to send a customer: the design's live demo, which opens exactly as guests see it. */
export function designDemoUrl(templateId: string) {
  return `${SITE_URL}/demo/${templateId}`
}

/**
 * "Share this design": the phone's share sheet (WhatsApp, Instagram, copy)
 * where there is one, otherwise the link is copied to paste into a chat.
 */
export default function ShareDesignButton({
  templateId,
  name,
  source,
  className,
  label = 'Share',
  style,
}: {
  templateId: string
  name: string
  source: string
  className?: string
  label?: string
  style?: React.CSSProperties
}) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = designDemoUrl(templateId)
    trackEvent(seoEvents.linkCopy, { share_url: url, template_id: templateId, source })
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} — ShareInvite`, text: `See the ${name} invitation design:`, url })
        return
      } catch (e) {
        // Dismissing the sheet is not an error; anything else falls back to copying.
        if ((e as Error).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link', url)
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button type="button" onClick={share} className={className} style={style} aria-label={`Share the ${name} design`}>
      <svg aria-hidden className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4M18 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM8 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm10 6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      <span>{copied ? 'Link copied' : label}</span>
    </button>
  )
}
