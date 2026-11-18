import type { TemplateField } from '@/types'

/**
 * "Our team fills it in" (15 Nov 2026): the customer answers a short form built from the design's
 * own boxes, the team finishes the invitation in the builder, and the customer opens it from a link,
 * previews it and publishes it (paying, or free with branding) like anyone else.
 *
 * Shared by the form (components/create/DoneForYouForm.tsx), the builder and the server
 * (lib/doneForYou.ts). Nothing here touches the database.
 */

/** Requests are stored as events with this slug prefix: internal (lib/retention isInternalSlug), never a page. */
export const DFY_PREFIX = '__dfy-'

/** Photos, film and music come later on WhatsApp: a form is the wrong place for them. */
const SKIP_TYPES = new Set<TemplateField['type']>(['image', 'gallery', 'video'])
const SKIP_KEYS = new Set(['musicUrl', 'galleryImages'])

/** What the form asks for this design, in the design's own order. */
export function dfyQuestions(fields: TemplateField[]): TemplateField[] {
  return fields.filter((f) => !SKIP_TYPES.has(f.type) && !SKIP_KEYS.has(f.key))
}

/**
 * A list edited row by row in the builder (the functions of a wedding, a gala's weekend, FAQs).
 * The form asks for it as plain lines, kept apart as a note for the team: the builder's row
 * format ("Mehendi | 2026-12-12 | 16:00") is not something to ask a customer to type.
 */
export function isRowField(f: TemplateField): boolean {
  return Boolean(f.columns?.length)
}

export type DfyStatus = 'new' | 'working' | 'ready' | 'published' | 'closed'

export const DFY_STATUS_LABEL: Record<DfyStatus, string> = {
  new: 'New',
  working: 'In progress',
  ready: 'Link sent',
  published: 'Published',
  closed: 'Closed',
}

/** "98765 43210", "+91-98765-43210" → "919876543210": an Indian number without its code gets +91. */
export function waDigits(raw?: string): string | null {
  let d = (raw || '').replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  if (d.length === 10) d = `91${d}`
  return d.length >= 11 && d.length <= 15 ? d : null
}

/** The address a customer opens to see their finished invitation. */
export function dfyCustomerPath(token: string): string {
  return `/create?request=${encodeURIComponent(token)}`
}
