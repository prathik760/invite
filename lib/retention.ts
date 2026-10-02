/**
 * When an invitation ends, and when it is deleted. One place, used by the
 * invitation page, the host dashboard and the daily cleanup job, so what the
 * host is told and what actually happens can't drift apart.
 */

/** The invitation shows "this celebration has taken place" this many days after its last day. */
export const ENDS_AFTER_DAYS = 3
/** The invitation, its guest wishes and its uploaded photos and music are deleted this many days after its last day. */
export const DELETE_AFTER_DAYS = 30
/** Invitations without a date (the 3D greetings) are deleted this many days after they were created. */
export const UNDATED_DELETE_AFTER_DAYS = 60
/** Uploads never used by a published invitation (abandoned drafts) are deleted after this many days. */
export const ORPHAN_UPLOAD_DAYS = 30
/** The visitor activity journal (/admin/activity) keeps each event this many days. */
export const ACTIVITY_DAYS = 90

const DAY = 24 * 60 * 60 * 1000

function parseDay(value?: string): number | null {
  const v = (value || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null
  const [y, m, d] = v.split('-').map(Number)
  const t = new Date(y, m - 1, d).getTime()
  return Number.isNaN(t) ? null : t
}

/**
 * The celebration's last day: the main date, or a later one — a reception
 * after the wedding in a suite's functions list, or a Ganesh visarjan.
 */
export function lastEventDay(data: Record<string, string>): number | null {
  const days = [parseDay(data.date), parseDay(data.visarjanDate)]
  for (const line of (data.events || '').split('\n')) days.push(parseDay(line.split('|')[1]))
  const valid = days.filter((d): d is number => d !== null)
  return valid.length ? Math.max(...valid) : null
}

/** Has the celebration ended? Undated invitations never "end". */
export function isEnded(data: Record<string, string>, now = Date.now()): boolean {
  const last = lastEventDay(data)
  return last !== null && now > last + ENDS_AFTER_DAYS * DAY
}

/** When the invitation and everything uploaded for it will be deleted. */
export function deletionDate(data: Record<string, string>, createdAt: Date | string): Date {
  const last = lastEventDay(data)
  if (last !== null) return new Date(last + (DELETE_AFTER_DAYS + 1) * DAY)
  return new Date(new Date(createdAt).getTime() + UNDATED_DELETE_AFTER_DAYS * DAY)
}

/** Internal records (custom design requests are stored on one) are never invitations and never deleted. */
export function isInternalSlug(slug: string): boolean {
  return slug.startsWith('__')
}
