import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { seasonAt, seasonChangedWithin } from '@/lib/season'

/**
 * Daily, just after midnight in India (vercel.json): when the season has changed (lib/season.ts),
 * rebuild the static pages that show it, so the New Year's Eve slots become the Valentine's ones on
 * 1 January without a deploy. On any other day it does nothing.
 *
 * The window is two days, so a run that Vercel starts late, or skips, is caught by the next one;
 * rebuilding twice costs one render of each page.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`; without it the job refuses to run, as the
 * cleanup job does. `?force=1` rebuilds whatever the date.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const clean = (v: string) => v.trim().replace(/^(['"])(.*)\1$/, '$2').trim()

/**
 * The English pages that read the season: the home page, the design gallery and the sitemap.
 *
 * Not the translated ones (/hi, /hi/templates…): they are built with dynamicParams = false, and on
 * Next 14.2 a page like that answers 404 once it is rebuilt on demand (tested 15 Nov 2026: every
 * /l/[lang] page 404'd after revalidatePath, by pattern or by its own path). They take the new
 * season at the next deploy.
 */
const PATHS = ['/', '/templates', '/sitemap.xml']

export async function GET(request: Request) {
  const secret = clean(process.env.CRON_SECRET ?? '')
  if (!secret) {
    return NextResponse.json({ error: 'Unauthorized', reason: 'CRON_SECRET is not set on this deployment' }, { status: 401 })
  }
  const given = clean((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''))
  if (given !== secret) {
    return NextResponse.json({ error: 'Unauthorized', reason: 'Wrong secret' }, { status: 401 })
  }
  const season = seasonAt().key
  const force = new URL(request.url).searchParams.get('force') === '1'
  if (!force && !seasonChangedWithin(50)) {
    return NextResponse.json({ season, rebuilt: [] })
  }
  for (const path of PATHS) revalidatePath(path)
  return NextResponse.json({ season, rebuilt: PATHS })
}
