import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteR2Objects, isR2Configured, listR2UploadsOlderThan, r2KeysIn } from '@/lib/r2'
import { ACTIVITY_DAYS, deletionDate, isInternalSlug, ORPHAN_UPLOAD_DAYS } from '@/lib/retention'

/**
 * Daily data cleanup, run by Vercel Cron (vercel.json).
 *
 * 1. Invitations past their deletion date (lib/retention.ts) are deleted with
 *    their guest wishes (cascade) and every photo and song uploaded for them.
 * 2. Uploads that no invitation uses (abandoned drafts) are deleted once they
 *    are ORPHAN_UPLOAD_DAYS old.
 * 3. Visitor activity (/admin/activity) older than ACTIVITY_DAYS is deleted.
 * 4. Guest upload counts (lib/uploadQuota.ts) are deleted once their hour is over.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`; without CRON_SECRET set,
 * the job refuses to run. `?dry=1` reports what would be deleted and deletes
 * nothing.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DAY = 24 * 60 * 60 * 1000
const BATCH = 200

/** Forgives the spaces, line breaks or quotes easily pasted along with a value. */
const clean = (v: string) => v.trim().replace(/^(['"])(.*)\1$/, '$2').trim()

export async function GET(request: Request) {
  // Says which check failed, so a misconfigured deployment can be told apart
  // from a wrong secret; neither reason reveals anything about the secret.
  const secret = clean(process.env.CRON_SECRET ?? '')
  if (!secret) {
    return NextResponse.json({ error: 'Unauthorized', reason: 'CRON_SECRET is not set on this deployment' }, { status: 401 })
  }
  const given = clean((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''))
  if (given !== secret) {
    return NextResponse.json({ error: 'Unauthorized', reason: 'Wrong secret' }, { status: 401 })
  }
  const dry = new URL(request.url).searchParams.get('dry') === '1'
  const now = new Date()
  const r2 = isR2Configured()

  // ── 1. Invitations past their deletion date ────────────────────────────────
  const expired: { id: string; slug: string; keys: string[] }[] = []
  const stillUsed = new Set<string>()
  let cursor: string | undefined
  for (;;) {
    const page = await prisma.event.findMany({
      select: { id: true, slug: true, data: true, createdAt: true },
      orderBy: { id: 'asc' },
      take: BATCH,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })
    if (!page.length) break
    for (const ev of page) {
      const keys = r2KeysIn(ev.data)
      const data = (ev.data ?? {}) as Record<string, string>
      if (!isInternalSlug(ev.slug) && deletionDate(data, ev.createdAt) <= now) {
        expired.push({ id: ev.id, slug: ev.slug, keys })
      } else {
        keys.forEach((k) => stillUsed.add(k))
      }
    }
    cursor = page[page.length - 1].id
  }

  // A photo shared by a live invitation (a host who reused an upload) is kept.
  const expiredKeys = Array.from(new Set(expired.flatMap((e) => e.keys))).filter((k) => !stillUsed.has(k))

  // ── 2. Uploads no invitation uses ──────────────────────────────────────────
  let orphanKeys: string[] = []
  if (r2) {
    const old = await listR2UploadsOlderThan(new Date(now.getTime() - ORPHAN_UPLOAD_DAYS * DAY))
    const expiredSet = new Set(expiredKeys)
    orphanKeys = old.filter((k) => !stillUsed.has(k) && !expiredSet.has(k))
  }

  // ── 3. Old visitor activity ────────────────────────────────────────────────
  // Kept apart from the rest: until the Activity table exists this throws, and
  // that must not stop invitations from being cleaned up.
  const activityBefore = new Date(now.getTime() - ACTIVITY_DAYS * DAY)
  const activityRows = async (del: boolean) => {
    try {
      const where = { createdAt: { lt: activityBefore } }
      return del ? (await prisma.activity.deleteMany({ where })).count : await prisma.activity.count({ where })
    } catch {
      return 0
    }
  }

  if (dry) {
    return NextResponse.json({
      dry: true,
      invitations: expired.length,
      invitationSlugs: expired.slice(0, 50).map((e) => e.slug),
      files: expiredKeys.length,
      orphanFiles: orphanKeys.length,
      activityRows: await activityRows(false),
      r2Configured: r2,
    })
  }

  // Files first: if the database delete then fails, tomorrow's run retries it,
  // and a file deleted twice is harmless.
  const filesDeleted = r2 ? await deleteR2Objects([...expiredKeys, ...orphanKeys]) : 0
  let invitationsDeleted = 0
  for (let i = 0; i < expired.length; i += BATCH) {
    const ids = expired.slice(i, i + BATCH).map((e) => e.id)
    const res = await prisma.event.deleteMany({ where: { id: { in: ids } } })
    invitationsDeleted += res.count
  }

  const activityDeleted = await activityRows(true)

  // Guest upload counts (lib/uploadQuota.ts) whose hour is over. Kept apart
  // like the activity rows: a missing table must not fail the job.
  const quotaDeleted = await prisma.uploadQuota
    .deleteMany({ where: { expiresAt: { lt: now } } })
    .then((r) => r.count)
    .catch(() => 0)

  // Bot visit counts (the Bots tab) are kept as long as visitor activity. Days
  // are stored as YYYY-MM-DD text, which sorts like a date.
  const botDayBefore = activityBefore.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const botRowsDeleted = await prisma.botHit
    .deleteMany({ where: { day: { lt: botDayBefore } } })
    .then((r) => r.count)
    .catch(() => 0)

  console.log(`[cleanup] deleted ${invitationsDeleted} invitations, ${filesDeleted} files (${orphanKeys.length} unused uploads), ${activityDeleted} activity rows, ${botRowsDeleted} bot rows, ${quotaDeleted} upload counts`)
  return NextResponse.json({ invitationsDeleted, filesDeleted, orphanFiles: orphanKeys.length, activityDeleted, botRowsDeleted, quotaDeleted, r2Configured: r2 })
}
