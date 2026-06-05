'use client'

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: 'event', eventName: string, params?: AnalyticsParams) => void
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...params,
  })

  window.gtag?.('event', eventName, params)
}

export const seoEvents = {
  templateView: 'template_view',
  inviteCreation: 'invite_creation',
  whatsappShare: 'whatsapp_share',
  rsvpSubmission: 'rsvp_submission',
}
