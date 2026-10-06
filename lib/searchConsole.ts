import { createSign } from 'crypto'
import { unstable_cache } from 'next/cache'
import { SITE_URL } from '@/lib/seo'

/**
 * Google Search Console, read-only: which searches showed the site and which
 * were clicked, per page and per day. Feeds the Keywords and Pages tabs of
 * /admin/activity and the "what they probably searched" box on a visitor.
 *
 * Google never tells a site what one person searched; Search Console is the
 * only source of search words at all, and only as totals per page and day.
 *
 * Set up once (see .env.example): a Google Cloud service account with the
 * Search Console API enabled, added as a Restricted user of the property, and
 * its JSON key in GSC_SERVICE_ACCOUNT. Answers are cached for six hours in
 * Next's data cache, so the admin page stays fast and well inside Google's
 * quota; nothing is stored in the database.
 */

export type GscProblem = 'not-configured' | 'bad-key' | 'api-disabled' | 'no-access' | 'failed'

export class GscError extends Error {
  constructor(public problem: GscProblem, message: string) {
    super(message)
  }
}

export interface GscRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface Account {
  client_email: string
  private_key: string
}

function account(): Account | null {
  const raw = (process.env.GSC_SERVICE_ACCOUNT ?? '').trim()
  if (!raw) return null
  try {
    // The JSON key as it was downloaded, or base64 of it (easier to paste).
    const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
    const a = JSON.parse(json)
    if (typeof a.client_email === 'string' && typeof a.private_key === 'string') {
      return { client_email: a.client_email, private_key: a.private_key.replace(/\\n/g, '\n') }
    }
  } catch {}
  throw new GscError('bad-key', 'GSC_SERVICE_ACCOUNT is set but is not a service account JSON key.')
}

export function gscStatus(): { connected: boolean; email?: string; problem?: GscProblem } {
  try {
    const a = account()
    return a ? { connected: true, email: a.client_email } : { connected: false, problem: 'not-configured' }
  } catch (err) {
    return { connected: false, problem: err instanceof GscError ? err.problem : 'bad-key' }
  }
}

let token: { value: string; expires: number } | null = null

async function accessToken(a: Account): Promise<string> {
  if (token && token.expires > Date.now() + 60_000) return token.value
  const now = Math.floor(Date.now() / 1000)
  const part = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const unsigned = `${part({ alg: 'RS256', typ: 'JWT' })}.${part({
    iss: a.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  let signature: string
  try {
    signature = createSign('RSA-SHA256').update(unsigned).sign(a.private_key, 'base64url')
  } catch {
    throw new GscError('bad-key', 'The private key in GSC_SERVICE_ACCOUNT could not be read.')
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
    cache: 'no-store',
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || typeof body.access_token !== 'string') {
    throw new GscError('bad-key', `Google refused the service account key (${body.error_description ?? body.error ?? res.status}).`)
  }
  token = { value: body.access_token, expires: Date.now() + (Number(body.expires_in) || 3600) * 1000 }
  return token.value
}

async function google(path: string, tok: string, body?: object) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${tok}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message: string = json?.error?.message ?? `HTTP ${res.status}`
    if (/has not been used|is disabled|SERVICE_DISABLED/i.test(message)) throw new GscError('api-disabled', message)
    if (res.status === 403) throw new GscError('no-access', message)
    throw new GscError('failed', message)
  }
  return json
}

let site: string | null = null

/**
 * The Search Console property to read: GSC_SITE_URL when set, otherwise the one
 * the service account was given that matches this site (a Domain property is
 * preferred over a URL-prefix one).
 */
async function property(tok: string): Promise<string> {
  const configured = (process.env.GSC_SITE_URL ?? '').trim()
  if (configured) return configured
  if (site) return site
  const host = new URL(SITE_URL).hostname.replace(/^www\./, '')
  const list: { siteUrl: string; permissionLevel: string }[] = (await google('/sites', tok)).siteEntry ?? []
  const usable = list.filter((s) => s.permissionLevel !== 'siteUnverifiedUser')
  const match =
    usable.find((s) => s.siteUrl === `sc-domain:${host}`) ??
    usable.find((s) => s.siteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') === host)
  if (!match) {
    throw new GscError('no-access', `The service account has not been added to the Search Console property for ${host}.`)
  }
  site = match.siteUrl
  return site
}

async function query(body: object): Promise<GscRow[]> {
  const a = account()
  if (!a) throw new GscError('not-configured', 'Search Console is not connected.')
  const tok = await accessToken(a)
  const prop = await property(tok)
  const json = await google(`/sites/${encodeURIComponent(prop)}/searchAnalytics/query`, tok, body)
  return (json.rows ?? []) as GscRow[]
}

/** Six hours: Search Console itself updates about once a day. Errors are not cached. */
const cached = unstable_cache(async (body: string) => query(JSON.parse(body)), ['gsc-search-analytics'], { revalidate: 6 * 60 * 60 })

const DAY = 24 * 60 * 60 * 1000

/** Search Console counts days in California time. */
export const gscDate = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })

/** Page URLs come back in full; the admin pages work in paths. */
export function gscPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

function range(days: number) {
  const end = new Date()
  return { startDate: gscDate(new Date(end.getTime() - (days - 1) * DAY)), endDate: gscDate(end) }
}

// `dataState: 'all'` includes the last day or two, which Google marks as
// provisional; without it the newest visits would have nothing to match.
const base = { type: 'web', dataState: 'all' } as const

/** Totals for the period: one row, no keys. */
export async function gscTotals(days: number): Promise<GscRow | null> {
  const rows = await cached(JSON.stringify({ ...base, ...range(days) }))
  return rows[0] ?? null
}

/** Every search with the page it showed, for the period. */
export function gscQueryPages(days: number): Promise<GscRow[]> {
  return cached(JSON.stringify({ ...base, ...range(days), dimensions: ['query', 'page'], rowLimit: 25000 }))
}

/** Every search for the period, totalled across pages. */
export function gscQueries(days: number): Promise<GscRow[]> {
  return cached(JSON.stringify({ ...base, ...range(days), dimensions: ['query'], rowLimit: 25000 }))
}

/** The searches that showed one page, on one day (California date) or over the last `days`. */
export function gscPageSearches(path: string, when: { date: string } | { days: number }): Promise<GscRow[]> {
  const dates = 'date' in when ? { startDate: when.date, endDate: when.date } : range(when.days)
  return cached(JSON.stringify({
    ...base,
    ...dates,
    dimensions: ['query'],
    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: `${SITE_URL}${path}` }] }],
    rowLimit: 50,
  }))
}

export function gscProblemText(err: unknown): string {
  if (!(err instanceof GscError)) return 'Search Console did not answer. Reload in a moment.'
  switch (err.problem) {
    case 'not-configured':
      return 'Search Console is not connected yet.'
    case 'bad-key':
      return `The Search Console key is not working: ${err.message}`
    case 'api-disabled':
      return 'The Google Search Console API is switched off in the Google Cloud project. Open console.cloud.google.com → APIs & Services → Library → "Google Search Console API" → Enable, wait a few minutes, then reload.'
    case 'no-access':
      return `Search Console has not given the service account access yet. In Search Console → Settings → Users and permissions → Add user, add ${gscStatus().email ?? 'the service account email'} as Restricted. (${err.message})`
    default:
      return `Search Console returned an error: ${err.message}`
  }
}
