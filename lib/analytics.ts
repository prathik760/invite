'use client'

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: 'event', eventName: string, params?: AnalyticsParams) => void
  }
}

/**
 * Funnel event names.
 *
 * Rules that keep this data trustworthy:
 *  - Conversion events NEVER fire on page load. `templateView` is the only
 *    view-type event, and it is deliberately scoped to a page whose entire
 *    purpose is one template.
 *  - `inviteCreated` fires only after the API returns a slug (a real invite in
 *    the database), never on clicking Publish. `publishClick` covers intent.
 *  - `purchase` fires only after server-side payment verification succeeds.
 *
 * GA4 already auto-collects page_view, session_start, scroll, click and
 * form_start via Enhanced Measurement — those are intentionally not duplicated
 * here. Everything below is a step GA4 cannot infer on its own.
 */
export const seoEvents = {
  // ─── Discovery ───────────────────────────────────────────────────────────
  templateView: 'template_view',
  ctaClick: 'cta_click',

  // ─── Create flow ─────────────────────────────────────────────────────────
  createStart: 'create_start',
  createStepComplete: 'create_step_complete',
  previewOpen: 'preview_open',
  publishClick: 'publish_click',
  inviteCreation: 'invite_creation',

  // ─── Account ─────────────────────────────────────────────────────────────
  signupStart: 'signup_start',
  signupComplete: 'sign_up',

  // ─── Monetisation ────────────────────────────────────────────────────────
  paywallView: 'paywall_view',
  checkoutStart: 'checkout_start',
  purchase: 'purchase',
  // Without these three, `checkout_start` minus `purchase` is a single opaque
  // bucket: a dismissed sheet, a declined card and a failed verification all
  // look identical, so the largest drop in the funnel cannot be diagnosed.
  /** Razorpay sheet closed without paying. */
  checkoutAbandon: 'checkout_abandon',
  /** Could not reach checkout at all (order creation / script load failed). */
  checkoutError: 'checkout_error',
  /** Money may have left the account but the server could not confirm it. */
  paymentFailed: 'payment_failed',

  // ─── Promotions ──────────────────────────────────────────────────────────
  // promoView fires when the popup is actually shown, not when it mounts, so
  // the click-through rate below is a real rate rather than a mount count.
  promoView: 'promo_view',
  promoClick: 'promo_click',
  promoDismiss: 'promo_dismiss',

  // ─── Support / enquiry ───────────────────────────────────────────────────
  /** Any tap that opens a route to a human (WhatsApp button, checkout help). */
  supportContact: 'support_contact',
  /** Custom-template enquiry form submitted successfully. */
  enquirySubmit: 'enquiry_submit',

  // ─── Sharing ─────────────────────────────────────────────────────────────
  whatsappShare: 'whatsapp_share',
  linkCopy: 'link_copy',
  rsvpSubmission: 'rsvp_submission',
} as const

/** Named step labels so `create_step_complete` is readable in GA4 reports. */
export const CREATE_STEPS: Record<number, string> = {
  1: 'style',
  2: 'names',
  3: 'details',
  4: 'extras',
  5: 'publish',
}

function deviceType(): string {
  if (typeof window === 'undefined') return 'unknown'
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return

  // Attach context every event should carry, so funnels can be segmented by
  // entry page and device without a separate join in GA4.
  const enriched: AnalyticsParams = {
    ...params,
    device: params.device ?? deviceType(),
    page_path: params.page_path ?? window.location.pathname,
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...enriched })
  window.gtag?.('event', eventName, enriched)
}

/**
 * Convenience wrapper for CTA instrumentation. `location` is what makes this
 * useful — it tells us which placement of a button actually produces users
 * (hero vs sticky bar vs footer vs blog inline block).
 */
export function trackCta(
  ctaText: string,
  location: string,
  extra: AnalyticsParams = {},
) {
  trackEvent(seoEvents.ctaClick, {
    cta_text: ctaText,
    cta_location: location,
    ...extra,
  })
}
