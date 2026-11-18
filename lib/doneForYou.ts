import { randomBytes, timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/db'
import { getTemplateData } from '@/modules/templates/data'
import { DFY_PREFIX, dfyQuestions, isRowField, type DfyStatus } from '@/lib/doneForYouShared'
import { sanitizeData } from '@/lib/eventData'

/**
 * Done-for-you requests on the server (lib/doneForYouShared.ts says what they are).
 *
 * Each request is an Event with an internal slug (`__dfy-<token>`), so no table had to be added:
 * internal slugs are never shown as invitations (app/e/[slug]), never listed in an account and
 * never deleted by the invitation clean-up, which removes requests on their own after
 * REQUEST_DAYS instead (app/api/cron/cleanup).
 *
 * Two secrets per request. The token (in the slug) opens the request read-only: it is the link the
 * customer gets. The team key lets the builder save the finished invitation into the request; it
 * only ever travels after a # (never to a server log or analytics), from the admin page.
 */

export const REQUEST_DAYS = 180

export interface DfyContact {
  name: string
  phone: string
  email?: string
}

export interface DfyRecord {
  kind: 'done-for-you'
  ref: string
  teamKey: string
  status: DfyStatus
  contact: DfyContact
  /** The invitation's boxes: the customer's answers first, the team's finished invitation after a save. */
  fields: Record<string, string>
  /** Lists asked as plain lines (isRowField), for the team to enter. */
  extras: Record<string, string>
  notes: string
  submittedAt: string
  savedAt?: string
  publishedSlug?: string
}

export const newToken = () => randomBytes(12).toString('base64url')
export const refOf = (token: string) => token.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** The customer's answers, kept to the boxes the form asks for this design. */
export function cleanAnswers(templateId: string, fields: unknown, extras: unknown): { fields: Record<string, string>; extras: Record<string, string> } | null {
  const t = getTemplateData(templateId)
  if (!t) return null
  const asked = dfyQuestions(t.config.fields)
  const inF = (fields && typeof fields === 'object' ? fields : {}) as Record<string, unknown>
  const inX = (extras && typeof extras === 'object' ? extras : {}) as Record<string, unknown>
  const outF: Record<string, string> = {}
  const outX: Record<string, string> = {}
  for (const f of asked) {
    if (isRowField(f)) {
      const v = clip(inX[f.key], 3000)
      if (v) outX[f.key] = v
      continue
    }
    const v = clip(inF[f.key], f.type === 'textarea' ? 3000 : 300)
    if (!v) continue
    if (f.type === 'choice' && !(f.options ?? []).some((o) => o.value === v)) continue
    if (f.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(v)) continue
    if (f.type === 'time' && !/^\d{1,2}:\d{2}$/.test(v)) continue
    outF[f.key] = v
  }
  return { fields: sanitizeData(outF) as Record<string, string>, extras: sanitizeData(outX) as Record<string, string> }
}

/** The builder's whole invitation, as saved by the team: any of the design's boxes, plus the builder's own settings. */
export function cleanBuilderData(templateId: string, data: unknown): Record<string, string> | null {
  const t = getTemplateData(templateId)
  if (!t || !data || typeof data !== 'object') return null
  const allowed = new Set([...t.config.fields.map((f) => f.key), '_hide', 'nameOrder'])
  const out: Record<string, string> = {}
  let size = 0
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    if (!allowed.has(k) || typeof v !== 'string') continue
    const s = v.slice(0, 8000)
    size += s.length
    out[k] = s
  }
  if (size > 80000) return null
  return sanitizeData(out) as Record<string, string>
}

export function isRecord(data: unknown): data is DfyRecord {
  return Boolean(data && typeof data === 'object' && (data as DfyRecord).kind === 'done-for-you')
}

export async function findRequest(token: string) {
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(token)) return null
  const event = await prisma.event.findUnique({ where: { slug: `${DFY_PREFIX}${token}` }, select: { id: true, templateId: true, data: true, createdAt: true } })
  if (!event || !isRecord(event.data)) return null
  return { event, rec: event.data }
}

export async function updateRequest(token: string, change: (rec: DfyRecord) => DfyRecord): Promise<DfyRecord | null> {
  const found = await findRequest(token)
  if (!found) return null
  const next = change(found.rec)
  await prisma.event.update({ where: { id: found.event.id }, data: { data: next as object } })
  return next
}
