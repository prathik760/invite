/**
 * What the visitor journal (lib/journal.ts → /api/activity → /admin/activity)
 * is allowed to store. Shared by the browser and the server, so a field the
 * browser starts sending is dropped until it is listed here on purpose.
 */

/**
 * Event parameters worth keeping. Everything else a `trackEvent` call carries
 * is dropped — in particular `invite_names` and `share_url`, which hold a
 * host's names and their invitation's address.
 */
export const ACTIVITY_KEYS = [
  // design
  'template_id', 'template_name', 'template_category', 'price', 'plan', 'value', 'currency', 'coupon',
  // builder
  'step', 'step_name', 'requires_payment', 'trigger', 'method', 'reason', 'entry_point',
  // placement
  'source', 'cta_text', 'cta_location', 'destination', 'channel', 'occasion', 'from', 'to', 'response_type',
  // journal's own events (clicks, errors, page exits, session start)
  'label', 'href', 'seconds', 'scroll', 'interacted', 'message', 'q',
  'referrer', 'landing', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'ad_click', 'lang', 'screen', 'returning',
] as const

/** Page-address query parameters kept on a page view; the rest (wording text, tokens) are not. */
export const ACTIVITY_QUERY_KEYS = ['template', 'occasion', 'category', 'plan', 'code'] as const

/** Paths the journal never records: guests' invitations, the live-preview frame, and the admin. */
export function isUntrackedPath(path: string): boolean {
  return /^\/(e|admin)(\/|$)/.test(path) || /^\/demo\/[^/]+\/embed/.test(path)
}

/** Set by /admin/activity in the owner's own browsers; the journal records nothing there. */
export const OWNER_KEY = 'si_owner'

export const MAX_EVENTS_PER_BATCH = 40
export const MAX_STRING = 200
