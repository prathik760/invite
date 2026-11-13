import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { BOT_KINDS, BOT_SAMPLE, botLogKey } from '@/lib/bots'

/**
 * Counts one page fetched by a bot. Called only by middleware.ts, which signs
 * the request with botLogKey(); anything else is ignored.
 *
 * One row per bot, page and day, incremented in place, so a busy crawler adds
 * to a number rather than to the table. Before the BotHit table exists the
 * insert fails here and nothing else notices.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const done = () => new NextResponse(null, { status: 204 })

/** The day in India time, matching every other date on the admin pages. */
const istDay = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export async function POST(req: NextRequest) {
  const key = await botLogKey()
  if (!key || req.headers.get('x-bot-key') !== key) return done()

  let body: { bot?: unknown; kind?: unknown; path?: unknown; weight?: unknown }
  try {
    body = await req.json()
  } catch {
    return done()
  }
  const { bot, kind, path } = body
  if (typeof bot !== 'string' || typeof kind !== 'string' || typeof path !== 'string') return done()
  if (!(kind in BOT_KINDS) || !bot || bot.length > 80 || !path.startsWith('/')) return done()
  // A sampled crawler read stands for `weight` reads (botSampleRate in lib/bots.ts).
  const weight = Number.isInteger(body.weight) && (body.weight as number) >= 1 && (body.weight as number) <= BOT_SAMPLE ? (body.weight as number) : 1

  try {
    await prisma.$executeRaw`
      INSERT INTO "BotHit" ("day", "bot", "kind", "path", "hits", "lastAt")
      VALUES (${istDay(new Date())}, ${bot}, ${kind}, ${path.slice(0, 200)}, ${weight}, NOW())
      ON CONFLICT ("day", "bot", "path")
      DO UPDATE SET "hits" = "BotHit"."hits" + ${weight}, "lastAt" = NOW()`
  } catch (err) {
    console.error('[bot-hit] insert failed', err instanceof Error ? err.message : err)
  }
  return done()
}
