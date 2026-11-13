import crypto from 'crypto'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'
import { lastEventDay, isInternalSlug } from '@/lib/retention'
import { eventTitle } from '@/lib/inviteCardText'
import { getTemplateData } from '@/modules/templates/data'
import { displayName } from '@/lib/catalog'
import { isDeliverable, sendMail } from '@/lib/mail'
import { reviewRequestEmail } from '@/lib/emails'

/**
 * Reviews from hosts (13 Nov 2026): the site had none, and a stranger about to
 * pay ₹1,499 for a wedding invitation wants to hear from someone who did.
 *
 * Only real customers: a review is asked for one paid invitation, after its
 * celebration, through a signed link that only its host receives (by email,
 * and by WhatsApp from /admin/reviews). Nothing is shown on the site unless the
 * host ticked "you may show this" and the owner approved it. Low ratings are
 * asked for and read exactly like high ones; the request goes to every host.
 */

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
const DAY = 24 * 60 * 60 * 1000

/** Asked once the day after the celebration's last day is over (early the next morning), and not after a fortnight. */
export const ASK_AFTER_DAYS = 1
export const ASK_WITHIN_DAYS = 14
/** One request a week per host at most, however many invitations they made (bride's side, groom's side). */
const ONE_ASK_PER_DAYS = 7
/** Each email takes a second or two, and the daily job has a minute for everything; the rest wait a day. */
const MAX_ASKS_PER_RUN = 15

/** Cache tag of every page that shows reviews; cleared when one is approved or hidden. */
export const REVIEWS_TAG = 'reviews'

export const REVIEW_LIMITS = { name: 80, city: 60, text: 1000 } as const

/** True for Prisma's "table does not exist" (P2021): prisma/migrations/20261113130000_reviews not run yet. */
export function isMissingReviewTable(err: unknown): boolean {
  if ((err as { code?: string })?.code === 'P2021') return true
  return err instanceof Error && /relation "?Review"? does not exist/i.test(err.message)
}

// ── The review link ─────────────────────────────────────────────────────────

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not configured')
  return s
}

const sign = (eventId: string) => crypto.createHmac('sha256', secret()).update(`review.${eventId}`).digest('base64url')

/** The private token in a host's review link. It names one invitation and needs no sign-in. */
export function reviewToken(eventId: string): string {
  return `${eventId}.${sign(eventId)}`
}

/** The invitation a genuine token was made for; null for anything else. */
export function readReviewToken(token: unknown): string | null {
  if (typeof token !== 'string' || token.length > 200) return null
  const [eventId, sig] = token.split('.')
  if (!eventId || !sig || !/^[A-Za-z0-9_-]{6,40}$/.test(eventId)) return null
  const expected = sign(eventId)
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  return eventId
}

/** The host's review page; `rating` preselects the star tapped in the email. */
export function reviewUrl(eventId: string, rating?: number): string {
  return `${APP_URL}/review/${reviewToken(eventId)}${rating ? `?rating=${rating}` : ''}`
}

// ── Who and what ────────────────────────────────────────────────────────────

/** How a review is signed unless the host changes it: the couple, the celebrant, the hosts. */
export function suggestedName(data: Record<string, string>, accountName?: string | null): string {
  const pick =
    (data.brideName && data.groomName && `${data.brideName.trim()} & ${data.groomName.trim()}`) ||
    (data.partner1Name && data.partner2Name && `${data.partner1Name.trim()} & ${data.partner2Name.trim()}`) ||
    data.coupleNames || data.hostNames || data.parentNames || data.celebrantName || accountName || ''
  return pick.trim().slice(0, REVIEW_LIMITS.name) || 'A ShareInvite host'
}

export function designNameOf(templateId: string): string {
  const t = getTemplateData(templateId)
  return t ? displayName(t.name) : 'ShareInvite'
}

/** The WhatsApp message the owner sends from /admin/reviews. */
export function whatsappAsk(name: string, title: string, eventId: string): string {
  const first = name.split(/[\s&]+/)[0] || ''
  return `Namaste${first ? ` ${first}` : ''}! 🙏 We hope ${title} went beautifully. Could you tell us how your ShareInvite invitation went? It takes a minute: ${reviewUrl(eventId)}`
}

// ── Asking ──────────────────────────────────────────────────────────────────

/**
 * The daily job's part (app/api/cron/cleanup): every paid invitation whose
 * celebration ended yesterday or in the fortnight before, not yet asked, gets
 * a request by email, and a row at /admin/reviews for a WhatsApp nudge.
 */
export async function askForReviews({ now = new Date(), dry = false } = {}): Promise<{ asked: number; emailed: number; missingTable?: boolean }> {
  const t = now.getTime()
  const events = await prisma.event.findMany({
    where: { isPaid: true, userId: { not: null }, createdAt: { gte: new Date(t - 400 * DAY) } },
    select: { id: true, slug: true, templateId: true, userId: true, data: true, user: { select: { email: true, name: true } } },
  })
  const due = events.filter((e) => {
    if (isInternalSlug(e.slug)) return false
    const last = lastEventDay((e.data ?? {}) as Record<string, string>)
    // `last` is the start of the last day. The job runs at 3 am in India, so a celebration on the
    // 10th is asked about early on the 12th: the family gets the day after it to rest.
    return last !== null && t >= last + (ASK_AFTER_DAYS + 0.5) * DAY && t <= last + (ASK_WITHIN_DAYS + 1) * DAY
  })
  if (!due.length) return { asked: 0, emailed: 0 }

  let existing: { eventId: string; userId: string | null; createdAt: Date }[]
  try {
    existing = await prisma.review.findMany({
      where: { OR: [{ eventId: { in: due.map((e) => e.id) } }, { userId: { in: due.map((e) => e.userId!) }, createdAt: { gte: new Date(t - ONE_ASK_PER_DAYS * DAY) } }] },
      select: { eventId: true, userId: true, createdAt: true },
    })
  } catch (err) {
    if (isMissingReviewTable(err)) return { asked: 0, emailed: 0, missingTable: true }
    throw err
  }
  const askedEvents = new Set(existing.map((r) => r.eventId))
  const recentlyAsked = new Set(existing.filter((r) => r.createdAt.getTime() >= t - ONE_ASK_PER_DAYS * DAY).map((r) => r.userId))

  let asked = 0
  let emailed = 0
  for (const e of due) {
    if (asked >= MAX_ASKS_PER_RUN) break
    if (askedEvents.has(e.id) || recentlyAsked.has(e.userId)) continue
    recentlyAsked.add(e.userId)
    asked++
    if (dry) continue
    const data = (e.data ?? {}) as Record<string, string>
    const name = suggestedName(data, e.user?.name)
    await prisma.review.create({ data: { eventId: e.id, userId: e.userId, templateId: e.templateId, name } })
    const to = e.user?.email
    if (isDeliverable(to)) {
      const sent = await sendMail(
        reviewRequestEmail({
          to,
          name: e.user?.name || name,
          title: eventTitle(data, e.templateId),
          designName: designNameOf(e.templateId),
          starUrl: (n) => reviewUrl(e.id, n),
          url: reviewUrl(e.id),
        }),
      )
      if (sent) {
        emailed++
        await prisma.review.update({ where: { eventId: e.id }, data: { emailedAt: new Date() } })
      }
    }
  }
  return { asked, emailed }
}

/**
 * The review behind a host's link, made on the spot when the link was sent
 * before the daily job reached the invitation (from /admin/reviews).
 */
export async function reviewForToken(token: string) {
  const eventId = readReviewToken(token)
  if (!eventId) return null
  const found = await prisma.review.findUnique({ where: { eventId } })
  if (found) return found
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, templateId: true, userId: true, data: true, isPaid: true, user: { select: { name: true } } },
  })
  if (!event || !event.isPaid) return null
  return prisma.review.create({
    data: { eventId, userId: event.userId, templateId: event.templateId, name: suggestedName((event.data ?? {}) as Record<string, string>, event.user?.name) },
  })
}

// ── Showing ─────────────────────────────────────────────────────────────────

export interface ShownReview {
  id: string
  templateId: string
  name: string
  city: string | null
  rating: number
  text: string
  /** ISO date. */
  date: string
}

/** Rejects after `ms`: a page is never held up by its reviews. */
function within<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const late = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`no answer in ${ms} ms`)), ms) })
  return Promise.race([work, late]).finally(() => clearTimeout(timer))
}

// Cached for every page that shows reviews, until one is approved or hidden (REVIEWS_TAG).
// Only an answer is cached: a failure throws through it, so one bad moment during a build
// cannot leave every page without its reviews.
const loadApproved = unstable_cache(
  async (): Promise<ShownReview[]> => {
    const rows = await within(
      prisma.review.findMany({
        where: { status: 'approved', publish: true, rating: { not: null } },
        orderBy: { submittedAt: 'desc' },
        take: 100,
        select: { id: true, templateId: true, name: true, city: true, rating: true, text: true, submittedAt: true, createdAt: true },
      }),
      5000,
    )
    return rows.map((r) => ({
      id: r.id,
      templateId: r.templateId,
      name: r.name,
      city: r.city,
      rating: r.rating ?? 5,
      text: r.text ?? '',
      date: (r.submittedAt ?? r.createdAt).toISOString(),
    }))
  },
  ['approved-reviews-v1'],
  { tags: [REVIEWS_TAG] },
)

/**
 * The reviews on the site: approved, and allowed by their hosts. Newest first.
 * A page never fails for them: a database out of reach (a build with none) or a
 * table not created yet shows none, and the next approval refreshes the pages.
 */
export async function approvedReviews(): Promise<ShownReview[]> {
  try {
    return await loadApproved()
  } catch (err) {
    if (!isMissingReviewTable(err)) console.error('[reviews] could not load reviews', err instanceof Error ? err.message : err)
    return []
  }
}
