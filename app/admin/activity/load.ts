import { prisma } from '@/lib/db'
import { groupVisitors, type ActivityRow, type Visitor } from '@/lib/activityReport'
import { DAY, type Users } from './ui'

/** Rows read for one period. Enough for tens of thousands of visits; the page says when it is reached. */
export const ROW_CAP = 40000

export const SELECT = { visitorId: true, sessionId: true, userId: true, name: true, path: true, data: true, createdAt: true } as const

/**
 * The owner's own accounts, kept out of every count (ADMIN_EMAILS, comma
 * separated). Their browsers are also marked by opening /admin/activity, which
 * stops the journal there altogether (lib/journal.ts, OWNER_KEY).
 */
function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )
}

export interface Period {
  /** Real visitors: no likely bots, none of the owner's own accounts. */
  people: Visitor[]
  /** Visitors that behaved like automated browsers (Visitor.bot says why). */
  bots: Visitor[]
  /** Visitors signed in to an ADMIN_EMAILS account. */
  own: Visitor[]
  users: Users
  capped: boolean
}

export async function loadPeriod(days: number, restrictTo?: string[]): Promise<Period> {
  const since = new Date(Date.now() - days * DAY)
  const raw =
    restrictTo?.length === 0
      ? []
      : ((await prisma.activity.findMany({
          where: { createdAt: { gte: since }, ...(restrictTo ? { visitorId: { in: restrictTo } } : {}) },
          orderBy: { createdAt: 'desc' },
          take: ROW_CAP,
          select: SELECT,
        })) as ActivityRow[])
  const all = groupVisitors(raw)

  const userIds = Array.from(new Set(all.map((v) => v.userId).filter((x): x is string => Boolean(x))))
  const users: Users = new Map(
    (userIds.length
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, name: true } })
      : []
    ).map((u) => [u.id, { email: u.email, name: u.name }]),
  )

  const admins = adminEmails()
  const isOwn = (v: Visitor) => Boolean(v.userId && admins.has(users.get(v.userId)?.email.toLowerCase() ?? ''))
  const own = all.filter(isOwn)
  const bots = all.filter((v) => v.bot && !isOwn(v))
  const people = all.filter((v) => !v.bot && !isOwn(v))
  return { people, bots, own, users, capped: raw.length === ROW_CAP }
}

/** True for Prisma's "table does not exist" (P2021) — a setup step, not an outage. */
export function isMissingTable(err: unknown, table: string): boolean {
  if ((err as { code?: string })?.code === 'P2021') return true
  return err instanceof Error && new RegExp(`relation "?${table}"? does not exist`, 'i').test(err.message)
}
