'use client'

import { ACTIVITY_KEYS, ACTIVITY_QUERY_KEYS, MAX_EVENTS_PER_BATCH, MAX_STRING, OWNER_KEY, isUntrackedPath } from './activityEvents'
import { CONSENT_EVENT, consentState } from './consent'

/**
 * The visitor journal: a first-party record of what each visitor did, shown
 * per visitor at /admin/activity. GA4 answers "how many"; this answers "what
 * did this person do, and where did they stop".
 *
 * Events queue in memory and leave in small batches — after a short pause, or
 * at once when the tab is hidden or closed (sendBeacon survives the unload).
 * A visitor is a random id in localStorage; a session ends after 30 minutes
 * without activity. Nothing typed into a form is ever read.
 *
 * Where cookies need a yes (lib/consent.ts), nothing is stored or sent until
 * the visitor accepts: events wait in memory and go out the moment they do,
 * and are dropped if they say no.
 */

type Params = Record<string, string | number | boolean | null | undefined>
interface Entry { n: string; p: string; t: number; d?: Record<string, string | number | boolean> }

const STORE_KEY = 'si_journal'
const SESSION_IDLE = 30 * 60 * 1000
const FLUSH_AFTER = 4000
const FLUSH_MAX_WAIT = 15000
/** Events kept while waiting for consent; the oldest go first beyond this. */
const MAX_HELD = 300

let ids: { v: string; s: string; at: number } | null = null
let sessionsThisPage = 0
const queue: Entry[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let firstQueuedAt = 0
/** When a named event (anything but a plain click) was last recorded; see the click listener. */
let lastNamedAt = 0

function randomId(): string {
  try {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 20)
  } catch {
    return (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 20)
  }
}

export function journalEnabled(): boolean {
  if (typeof window === 'undefined') return false
  if (window.top !== window) return false
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return false
  if (navigator.webdriver) return false
  if (consentState() === 'denied') return false
  try {
    if (localStorage.getItem(OWNER_KEY)) return false
  } catch {}
  return !isUntrackedPath(location.pathname)
}

function loadIds() {
  if (!ids && consentState() === 'granted') {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (saved && typeof saved.v === 'string' && typeof saved.s === 'string') ids = saved
    } catch {}
  }
  if (!ids) ids = { v: randomId(), s: '', at: 0 }
  return ids
}

/** The visitor id, shared with Clarity as a tag so a replay can be found from /admin/activity. */
export function visitorId(): string | null {
  return journalEnabled() ? loadIds().v : null
}

function currentIds(now: number, name: string) {
  ids = loadIds()
  if (!ids.s || now - ids.at > SESSION_IDLE) {
    const returning = Boolean(ids.s)
    ids = { ...ids, s: randomId(), at: now }
    queue.push({ n: 'session_start', p: location.pathname, t: now, d: sessionContext(returning) })
    // A visit that begins on a page already open (back to a tab after 30 idle
    // minutes) starts with a click or a leave, not a page load; say which page
    // it was on, or the visit reads as "0 pages".
    if (name !== 'page_view') queue.push({ n: 'page_view', p: location.pathname, t: now })
    sessionsThisPage++
  }
  ids.at = now
  saveIds()
  return ids
}

function saveIds() {
  if (!ids || consentState() !== 'granted') return
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(ids))
  } catch {}
}

/** Where the visit came from. The server adds device and country. */
function sessionContext(returning: boolean): Record<string, string | number | boolean> {
  const d: Record<string, string | number | boolean> = {
    landing: location.pathname,
    lang: navigator.language || '',
    screen: `${screen.width}x${screen.height}`,
  }
  if (returning) d.returning = true
  // document.referrer belongs to the page load; a session that starts later in
  // the same tab (after 30 idle minutes) was not referred by it.
  if (sessionsThisPage === 0 && document.referrer) {
    try {
      const r = new URL(document.referrer)
      if (r.host !== location.host) d.referrer = (r.host + r.pathname).slice(0, MAX_STRING)
    } catch {}
  }
  const q = new URLSearchParams(location.search)
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = q.get(k)
    if (v) d[k] = v.slice(0, 80)
  }
  if (q.has('fbclid')) d.ad_click = 'meta'
  else if (q.has('gclid') || q.has('gbraid') || q.has('wbraid')) d.ad_click = 'google'
  return d
}

function pick(params: Params): Record<string, string | number | boolean> | undefined {
  const out: Record<string, string | number | boolean> = {}
  for (const k of ACTIVITY_KEYS) {
    const v = params[k]
    if (v === undefined || v === null || v === '') continue
    out[k] = typeof v === 'string' ? v.slice(0, MAX_STRING) : v
  }
  return Object.keys(out).length ? out : undefined
}

let unloadHooked = false
/**
 * Sends the queue as the page goes away, even if the tracker never mounted, and
 * as soon as a visitor who was asked accepts (or forgets it if they decline).
 */
function hookUnload() {
  if (unloadHooked) return
  unloadHooked = true
  window.addEventListener('pagehide', () => flush(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })
  window.addEventListener(CONSENT_EVENT, () => {
    if (consentState() === 'granted') {
      saveIds()
      flush(false)
      return
    }
    queue.length = 0
    ids = null
    try {
      localStorage.removeItem(STORE_KEY)
    } catch {}
  })
}

/** Records one event. Safe to call anywhere; does nothing on untracked pages. */
export function journal(name: string, params: Params = {}) {
  if (!journalEnabled()) return
  hookUnload()
  const now = Date.now()
  currentIds(now, name)
  if (name !== 'click') lastNamedAt = now
  queue.push({ n: name, p: location.pathname, t: now, d: pick(params) })
  if (queue.length > MAX_HELD) queue.splice(0, queue.length - MAX_HELD)
  if (!firstQueuedAt) firstQueuedAt = now
  if (queue.length >= 20) return flush(false)
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => flush(false), Math.max(0, Math.min(FLUSH_AFTER, firstQueuedAt + FLUSH_MAX_WAIT - now)))
}

/** Sends what is queued. `leaving` uses sendBeacon, which survives the page closing. */
export function flush(leaving: boolean) {
  if (timer) clearTimeout(timer)
  timer = null
  firstQueuedAt = 0
  if (!queue.length || !ids || consentState() !== 'granted') return
  const sent = queue.splice(0, MAX_EVENTS_PER_BATCH)
  // text/plain keeps this a simple request, which sendBeacon sends in every browser.
  const body = JSON.stringify({ v: ids.v, s: ids.s, now: Date.now(), e: sent })
  let ok = false
  if (leaving && navigator.sendBeacon) {
    try {
      ok = navigator.sendBeacon('/api/activity', new Blob([body], { type: 'text/plain' }))
    } catch {}
  }
  if (!ok) {
    fetch('/api/activity', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
  }
  if (queue.length) flush(leaving)
}

/** A page view, with the few address parameters that say which design or occasion was asked for. */
export function journalPageView() {
  const q = new URLSearchParams(location.search)
  const kept: string[] = []
  for (const k of ACTIVITY_QUERY_KEYS) {
    const v = q.get(k)
    if (v) kept.push(`${k}=${v.slice(0, 60)}`)
  }
  journal('page_view', kept.length ? { q: kept.join('&') } : {})
}

// ─── Automatic signals ───────────────────────────────────────────────────────

/** A short, non-personal name for what was clicked. Null inside anything marked private. */
function describe(el: Element): { label: string; href?: string } | null {
  if (el.closest('[data-clarity-mask],[data-journal-private]')) return null
  const label = (
    el.getAttribute('aria-label') ||
    el.getAttribute('title') ||
    (el as HTMLElement).innerText ||
    el.querySelector('img')?.getAttribute('alt') ||
    ''
  ).replace(/\s+/g, ' ').trim().slice(0, 60)
  const out: { label: string; href?: string } = { label: label || el.tagName.toLowerCase() }
  if (el instanceof HTMLAnchorElement && el.href) {
    try {
      const u = new URL(el.href)
      // Own pages keep their path; anything else keeps only its host, so a
      // wa.me or tel: link never stores a phone number.
      out.href = u.origin === location.origin ? u.pathname : u.protocol === 'https:' || u.protocol === 'http:' ? u.host : u.protocol
    } catch {}
  }
  return out
}

/**
 * Starts the click, rage-click, error and leave listeners. Returns a cleanup
 * function. `onLeave` supplies the current page's time and scroll depth.
 */
export function startJournal(onLeave: () => { seconds: number; scroll: number; interacted: boolean }) {
  const recent: { x: number; y: number; t: number }[] = []
  let lastRage = 0
  let errors = 0
  let lastHide = 0

  const onClick = (e: MouseEvent) => {
    const now = Date.now()
    // Three or more clicks in one spot within a second: the visitor expected
    // something to happen and it did not.
    recent.push({ x: e.clientX, y: e.clientY, t: now })
    while (recent.length && now - recent[0].t > 1000) recent.shift()
    const near = recent.filter((c) => Math.abs(c.x - e.clientX) < 30 && Math.abs(c.y - e.clientY) < 30)
    const target = e.target instanceof Element ? e.target : null
    if (near.length >= 3 && now - lastRage > 3000 && target) {
      lastRage = now
      const what = describe(target.closest('a,button,[role="button"]') ?? target)
      if (what) journal('rage_click', what)
    }

    const el = target?.closest('a,button,[role="button"],[role="tab"],summary')
    if (!el) return
    const what = describe(el)
    if (!what) return
    // Most important buttons already record a named event (Preview, Use design,
    // Pay...). Those run in the same tick, so wait for it and only record a
    // plain click when nothing more specific explained it.
    setTimeout(() => {
      if (lastNamedAt >= now) return
      journal('click', what)
    }, 0)
  }

  const onError = (e: ErrorEvent) => {
    // Cross-origin scripts (payments, ads) report only "Script error." with no detail.
    if (errors >= 5 || !e.message || e.message === 'Script error.') return
    if (e.filename && !e.filename.startsWith(location.origin)) return
    errors++
    journal('js_error', { message: e.message })
  }
  const onRejection = (e: PromiseRejectionEvent) => {
    if (errors >= 5) return
    const r = e.reason
    const message = r instanceof Error ? r.message : typeof r === 'string' ? r : ''
    if (!message) return
    errors++
    journal('js_error', { message })
  }

  const onHide = () => {
    if (document.visibilityState !== 'hidden') return
    const now = Date.now()
    if (now - lastHide > 2000) {
      lastHide = now
      journal('page_hide', onLeave())
    }
    flush(true)
  }
  document.addEventListener('click', onClick, true)
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
  document.addEventListener('visibilitychange', onHide)
  return () => {
    document.removeEventListener('click', onClick, true)
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onRejection)
    document.removeEventListener('visibilitychange', onHide)
  }
}
