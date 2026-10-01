import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteR2Objects, isR2Configured, listR2UploadsOlderThan, r2KeysIn } from '@/lib/r2'
import { deletionDate, isInternalSlug, ORPHAN_UPLOAD_DAYS } from '@/lib/retention'

/**
 * Daily data cleanup, run by Vercel Cron (vercel.json).
 *
 * 1. Invitations past their deletion date (lib/retention.ts) are deleted with
 *    their guest wishes (cascade) and every photo and song uploaded for them.
 * 2. Uploads that no invitation uses (abandoned drafts) are deleted once they
 *    are ORPHAN_UPLOAD_DAYS old.
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

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

  if (dry) {
    return NextResponse.json({
      dry: true,
      invitations: expired.length,
      invitationSlugs: expired.slice(0, 50).map((e) => e.slug),
      files: expiredKeys.length,
      orphanFiles: orphanKeys.length,
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

  console.log(`[cleanup] deleted ${invitationsDeleted} invitations, ${filesDeleted} files (${orphanKeys.length} unused uploads)`)
  return NextResponse.json({ invitationsDeleted, filesDeleted, orphanFiles: orphanKeys.length, r2Configured: r2 })
}
