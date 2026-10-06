import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { ACTIVITY_KEYS, MAX_EVENTS_PER_BATCH, MAX_STRING, isUntrackedPath } from '@/lib/activityEvents'
import { botOf } from '@/lib/bots'

/**
 * Receives batches from the visitor journal (lib/journal.ts) and stores them
 * as Activity rows for /admin/activity.
 *
 * Always answers 204, even when it stores nothing: the sender is a beacon on a
 * page that may already be gone, and a broken journal must never surface to
 * a visitor. Before the Activity table exists, the insert simply fails here.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY = 32 * 1024
const ID = /^[A-Za-z0-9_-]{8,40}$/
const NAME = /^[a-z][a-z0-9_]{1,40}$/
const KEYS = new Set<string>(ACTIVITY_KEYS)
const MAX_AGE = 6 * 60 * 60 * 1000

const done = () => new NextResponse(null, { status: 204 })

function cleanData(raw: unknown): Record<string, string | number | boolean> | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!KEYS.has(k)) continue
    if (typeof v === 'string') out[k] = v.slice(0, MAX_STRING)
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
    else if (typeof v === 'boolean') out[k] = v
  }
  return Object.keys(out).length ? out : undefined
}

/** "Android · Chrome", "iPhone · Safari", "Windows · Edge" — enough to tell visits apart. */
function deviceOf(ua: string) {
  const os = /iPhone|iPod/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android'
    : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Other'
  const browser = /Instagram/.test(ua) ? 'Instagram app' : /FBAN|FBAV/.test(ua) ? 'Facebook app'
    : /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet'
    : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other'
  const mobile = /Mobi|iPhone|Android/.test(ua)
  return { device: `${os} · ${browser}`, mobile }
}

function header(req: NextRequest, name: string) {
  const v = req.headers.get(name)
  if (!v) return undefined
  try {
    return decodeURIComponent(v).slice(0, 60)
  } catch {
    return v.slice(0, 60)
  }
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? ''
  // A bot that runs the page's JavaScript is counted on the Bots tab instead
  // (middleware.ts saw it fetch the page), not as a visitor.
  if (botOf(ua)) return done()
  // Another site's pages may not post into our journal. (A script can forge
  // this header; the size caps below are what bound that.)
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (origin && origin !== 'null') {
    try {
      if (new URL(origin).host !== host) return done()
    } catch {
      return done()
    }
  }

  const text = await req.text()
  if (text.length > MAX_BODY) return done()
  let body: { v?: unknown; s?: unknown; now?: unknown; e?: unknown }
  try {
    body = JSON.parse(text)
  } catch {
    return done()
  }
  const { v, s, now, e } = body
  if (typeof v !== 'string' || !ID.test(v) || typeof s !== 'string' || !ID.test(s) || !Array.isArray(e)) return done()

  let userId: string | null = null
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (token && typeof token.id === 'string') userId = token.id
  } catch {}

  // Times are re-based on the server clock, so a phone set to the wrong time
  // still produces a timeline in the right order and the right day.
  const serverNow = Date.now()
  const clientNow = typeof now === 'number' ? now : serverNow
  // Added to the session's first row only; the rest of the visit inherits it.
  const where: Record<string, string | boolean> = deviceOf(ua)
  for (const [key, name] of [['country', 'x-vercel-ip-country'], ['region', 'x-vercel-ip-country-region'], ['city', 'x-vercel-ip-city']]) {
    const v = header(req, name)
    if (v) where[key] = v
  }

  const rows: Prisma.ActivityCreateManyInput[] = []
  for (const item of e.slice(0, MAX_EVENTS_PER_BATCH)) {
    if (!item || typeof item !== 'object') continue
    const { n, p, t, d } = item as { n?: unknown; p?: unknown; t?: unknown; d?: unknown }
    if (typeof n !== 'string' || !NAME.test(n) || typeof p !== 'string' || !p.startsWith('/')) continue
    if (isUntrackedPath(p)) continue
    const age = typeof t === 'number' ? Math.min(MAX_AGE, Math.max(0, clientNow - t)) : 0
    let data = cleanData(d)
    if (n === 'session_start') data = { ...data, ...where }
    rows.push({
      visitorId: v,
      sessionId: s,
      userId,
      name: n,
      path: p.slice(0, MAX_STRING),
      data: data ?? Prisma.JsonNull,
      createdAt: new Date(serverNow - age),
    })
  }
  if (!rows.length) return done()

  try {
    await prisma.activity.createMany({ data: rows })
  } catch (err) {
    console.error('[activity] insert failed', err instanceof Error ? err.message : err)
  }
  return done()
}
