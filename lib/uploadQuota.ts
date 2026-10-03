import crypto from 'crypto'
import { prisma } from '@/lib/db'

/**
 * How many files a signed-out visitor may upload: GUEST_UPLOADS_PER_HOUR from
 * one address in each clock hour.
 *
 * Counted in the database (UploadQuota) so every server instance shares one
 * count; a count kept in memory is per instance, and Vercel runs many. The
 * address is stored only as a keyed hash mixed with the hour, and the daily
 * cleanup deletes rows once their hour is over.
 *
 * If the table is missing or the database is unreachable, this instance counts
 * in memory instead: a broken counter must not stop people adding photos.
 */
export const GUEST_UPLOADS_PER_HOUR = 60

const HOUR = 60 * 60 * 1000
const memory = new Map<string, number>()
let warned = false

function keyFor(ip: string, hour: number): string {
  const secret = process.env.NEXTAUTH_SECRET || 'upload-quota'
  return crypto.createHmac('sha256', secret).update(`upload.${ip}.${hour}`).digest('base64url').slice(0, 32)
}

/** Counts one upload from `ip`. False once this hour's allowance is used up. */
export async function takeGuestUpload(ip: string, now = Date.now()): Promise<boolean> {
  const hour = Math.floor(now / HOUR)
  const key = keyFor(ip, hour)
  try {
    // A single-field upsert like this one runs as one INSERT … ON CONFLICT, so
    // simultaneous uploads cannot both read the same count.
    const row = await prisma.uploadQuota.upsert({
      where: { key },
      create: { key, count: 1, expiresAt: new Date((hour + 1) * HOUR) },
      update: { count: { increment: 1 } },
      select: { count: true },
    })
    return row.count <= GUEST_UPLOADS_PER_HOUR
  } catch (err) {
    if (!warned) {
      warned = true
      console.error('[upload] UploadQuota unavailable, counting in memory:', err instanceof Error ? err.message : err)
    }
    if (memory.size > 5000) memory.clear()
    const count = (memory.get(key) ?? 0) + 1
    memory.set(key, count)
    return count <= GUEST_UPLOADS_PER_HOUR
  }
}
