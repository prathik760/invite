import { TEMPLATES } from '@/modules/templates/data'
import { templateSeoSlug } from '@/lib/seo'
import { displayName } from '@/lib/catalog'

/**
 * Turns raw Activity rows (lib/journal.ts) into what /admin/activity shows:
 * readable timeline lines, the furthest funnel step each visitor reached, and
 * the most likely reason each visit ended.
 *
 * "Why they left" is an inference from the last things a visitor did — the
 * page cannot ask them. It is worded as a likely reason, never as fact.
 */

export interface ActivityRow {
  visitorId: string
  sessionId: string
  userId: string | null
  name: string
  path: string
  data: unknown
  createdAt: Date
}

type Data = Record<string, string | number | boolean | undefined>
export type Tone = 'good' | 'warn' | 'bad' | 'neutral'

const dataOf = (r: ActivityRow): Data => (r.data && typeof r.data === 'object' ? (r.data as Data) : {})
const str = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '')

// ─── Names ───────────────────────────────────────────────────────────────────

const TEMPLATE_NAMES = new Map(TEMPLATES.map((t) => [t.id, displayName(t.name)]))
const SEO_SLUGS = new Map(TEMPLATES.map((t) => [templateSeoSlug(t.id), t.id]))

export function templateName(id: unknown): string {
  const key = str(id)
  return TEMPLATE_NAMES.get(key) ?? key
}

/** The design a page is about: /demo/<id> or /templates/<seo-slug>. */
export function templateFromPath(path: string): string | undefined {
  const demo = path.match(/^\/demo\/([^/]+)/)
  if (demo && TEMPLATE_NAMES.has(demo[1])) return demo[1]
  const seo = path.match(/^\/templates\/([^/]+)$/)
  return seo ? SEO_SLUGS.get(seo[1]) : undefined
}

const PAGES: Record<string, string> = {
  '/': 'Home page',
  '/create': 'Builder',
  '/templates': 'All designs',
  '/pricing': 'Pricing',
  '/dashboard': 'My invitations',
  '/auth/login': 'Sign-in page',
  '/auth/signup': 'Sign-up page',
  '/blog': 'Blog',
  '/partners': 'Partners',
  '/privacy': 'Privacy policy',
  '/terms': 'Terms',
  '/refund-policy': 'Refund policy',
}

const words = (slug: string) => slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

export function pageLabel(path: string): string {
  if (PAGES[path]) return PAGES[path]
  const tpl = templateFromPath(path)
  if (tpl) return `Design: ${templateName(tpl)}`
  const m = path.match(/^\/blog\/(.+)$/)
  if (m) return `Blog: ${words(m[1])}`
  const cat = path.match(/^\/templates\/category\/(.+)$/)
  if (cat) return `Designs: ${words(cat[1])}`
  if (/-wording$/.test(path)) return `Wording guide: ${words(path.slice(1).replace(/-invitation-wording$|-wording$/, ''))}`
  if (/^\/(hi|ar|es|fr|id|pt|vi)(\/|$)/.test(path)) return `${path.slice(1, 3).toUpperCase()} · ${path.length > 3 ? pageLabel(path.slice(3)) : 'Home page'}`
  return path
}

const money = (d: Data, key: 'price' | 'value' = 'price') => {
  const v = d[key] ?? d.price
  if (typeof v !== 'number') return ''
  const cur = str(d.currency) || 'INR'
  return cur === 'INR' ? `₹${v.toLocaleString('en-IN')}` : `${cur} ${v}`
}

export function duration(seconds: number): string {
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m ${Math.round(seconds % 60)}s`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

// ─── Where a visit came from ─────────────────────────────────────────────────

const SOURCES: [RegExp, string][] = [
  [/chatgpt\.com|openai\.com/, 'ChatGPT'],
  [/gemini\.google/, 'Gemini'],
  [/perplexity/, 'Perplexity'],
  [/copilot\.microsoft|bing\.com\/chat/, 'Copilot'],
  [/claude\.ai/, 'Claude'],
  [/(^|\.)google\./, 'Google search'],
  [/bing\.com/, 'Bing search'],
  [/duckduckgo/, 'DuckDuckGo'],
  [/yahoo\./, 'Yahoo search'],
  [/instagram\.com/, 'Instagram'],
  [/facebook\.com|fb\.com|fb\.me/, 'Facebook'],
  [/whatsapp|wa\.me/, 'WhatsApp'],
  [/youtube\.com|youtu\.be/, 'YouTube'],
  [/pinterest\./, 'Pinterest'],
  [/(^|\.)t\.co$|twitter\.com|(^|\.)x\.com/, 'X (Twitter)'],
  [/linkedin\./, 'LinkedIn'],
  [/reddit\./, 'Reddit'],
]

export function sourceOf(d: Data): string {
  if (d.ad_click === 'meta') return 'Meta ad (Facebook / Instagram)'
  if (d.ad_click === 'google') return 'Google ad'
  if (d.utm_source) return [d.utm_source, d.utm_medium, d.utm_campaign].filter(Boolean).join(' · ')
  const host = str(d.referrer).split('/')[0]
  if (!host) return d.returning ? 'Came back (direct)' : 'Direct · typed, bookmark or a shared link'
  return SOURCES.find(([re]) => re.test(host))?.[1] ?? host
}

export function placeOf(d: Data): string {
  return [d.city, d.region, d.country].map(str).filter(Boolean).join(', ')
}

// ─── Timeline lines ──────────────────────────────────────────────────────────

export interface Line {
  icon: string
  text: string
  detail?: string
  tone: Tone
}

export function describe(r: ActivityRow, isLast = false): Line {
  const d = dataOf(r)
  const tpl = d.template_id ? templateName(d.template_id) : ''
  const at = (s: string) => (s ? ` · ${s}` : '')
  switch (r.name) {
    case 'session_start':
      return {
        icon: '🚪',
        text: `Arrived from ${sourceOf(d)}`,
        detail: [`landed on ${pageLabel(str(d.landing) || r.path)}`, str(d.device), placeOf(d), str(d.lang)].filter(Boolean).join(' · '),
        tone: 'neutral',
      }
    case 'page_view':
      return { icon: '📄', text: `Opened ${pageLabel(r.path)}`, detail: d.q ? `${r.path}?${d.q}` : r.path, tone: 'neutral' }
    case 'page_hide': {
      const detail = `${duration(Number(d.seconds) || 0)} on ${pageLabel(r.path)}${typeof d.scroll === 'number' ? ` · scrolled ${d.scroll}% of the page` : ''}`
      return isLast
        ? { icon: '👋', text: 'Left the site from here', detail, tone: 'warn' }
        : { icon: '↩️', text: 'Left this page (or switched tabs)', detail, tone: 'neutral' }
    }
    case 'click':
      return { icon: '👆', text: `Clicked “${str(d.label)}”`, detail: d.href ? `→ ${d.href}` : undefined, tone: 'neutral' }
    case 'cta_click':
      return { icon: '👆', text: `Clicked “${str(d.cta_text)}”${tpl ? ` on ${tpl}` : ''}`, detail: [str(d.cta_location), str(d.destination)].filter(Boolean).join(' → ') || undefined, tone: 'neutral' }
    case 'template_filter':
      return { icon: '🔎', text: `Filtered designs by ${words(str(d.occasion))}`, tone: 'neutral' }
    case 'template_view':
      return { icon: '🎨', text: `Opened the design ${tpl} in the builder`, tone: 'neutral' }
    case 'preview_open':
      return { icon: '👀', text: `Previewed ${tpl || 'a design'}`, detail: d.step_name ? `during builder step ${d.step} (${d.step_name})` : str(d.source) || undefined, tone: 'neutral' }
    case 'create_start':
      return { icon: '✏️', text: `Started making an invitation with ${tpl}`, detail: money(d) || undefined, tone: 'neutral' }
    case 'create_step_complete':
      return { icon: '✅', text: `Finished builder step ${d.step} · ${str(d.step_name)}`, detail: tpl || undefined, tone: 'neutral' }
    case 'publish_click':
      return { icon: '🚀', text: 'Pressed Publish', detail: d.requires_payment ? `payment needed${at(money(d))}` : 'no payment needed', tone: 'neutral' }
    case 'paywall_view':
      return { icon: '🏷️', text: `Saw the price ${money(d)}`.trim(), detail: [tpl, d.plan ? `plan ${d.plan}` : ''].filter(Boolean).join(' · ') || undefined, tone: 'neutral' }
    case 'signup_start':
      return { icon: '🔐', text: 'Was asked to sign in', detail: str(d.trigger) || undefined, tone: 'neutral' }
    case 'sign_up':
      return { icon: '🙋', text: 'Created an account', detail: str(d.method) || undefined, tone: 'good' }
    case 'checkout_start':
      return { icon: '💳', text: `Opened the payment window ${money(d)}`.trim(), detail: [tpl, d.coupon ? `code ${str(d.coupon)}` : ''].filter(Boolean).join(' · ') || undefined, tone: 'neutral' }
    case 'checkout_abandon':
      return { icon: '✖️', text: 'Closed the payment window without paying', detail: tpl || undefined, tone: 'warn' }
    case 'checkout_error':
      return { icon: '⚠️', text: 'The payment window did not open', detail: str(d.reason) || undefined, tone: 'bad' }
    case 'payment_failed':
      return { icon: '⚠️', text: 'Paid, but our server could not confirm the payment', detail: 'check Razorpay for this payment', tone: 'bad' }
    case 'purchase':
      return { icon: '💰', text: `Paid ${money(d, 'value')}`.trim(), detail: [tpl, d.coupon ? `code ${str(d.coupon)}` : ''].filter(Boolean).join(' · ') || undefined, tone: 'good' }
    case 'coupon_applied':
      return { icon: '🎟️', text: `Got the discount code ${str(d.coupon)}`, detail: d.source === 'link' ? 'from a campaign link' : 'typed at checkout', tone: 'good' }
    case 'coupon_rejected':
      return { icon: '🎟️', text: `Tried a discount code that did not work${d.coupon ? ` (${str(d.coupon)})` : ''}`, detail: str(d.reason) || undefined, tone: 'warn' }
    case 'invite_creation':
      return { icon: '🎉', text: `Published an invitation with ${tpl}`, tone: 'good' }
    case 'wording_copy':
      return { icon: '📋', text: 'Copied a wording sample', detail: tpl || undefined, tone: 'neutral' }
    case 'whatsapp_share':
      return { icon: '💬', text: 'Shared on WhatsApp', detail: tpl || undefined, tone: 'good' }
    case 'link_copy':
      return { icon: '🔗', text: 'Copied a share link', detail: tpl || undefined, tone: 'neutral' }
    case 'support_contact':
      return { icon: '💬', text: 'Tapped WhatsApp support', detail: str(d.source) || undefined, tone: 'neutral' }
    case 'enquiry_submit':
      return { icon: '📨', text: 'Sent a custom design request', tone: 'good' }
    case 'promo_view':
      return { icon: '🎁', text: 'Saw the promo popup', tone: 'neutral' }
    case 'promo_click':
      return { icon: '🎁', text: 'Clicked the promo', tone: 'neutral' }
    case 'promo_dismiss':
      return { icon: '🎁', text: 'Closed the promo popup', detail: str(d.reason) || undefined, tone: 'neutral' }
    case 'language_switch':
      return { icon: '🌐', text: `Switched language to ${str(d.to).toUpperCase()}`, tone: 'neutral' }
    case 'rage_click':
      return { icon: '😤', text: `Clicked “${str(d.label)}” again and again`, detail: 'it may not have responded', tone: 'bad' }
    case 'js_error':
      return { icon: '🐞', text: 'Hit a page error', detail: str(d.message), tone: 'bad' }
    default:
      return { icon: '•', text: words(r.name), detail: tpl || undefined, tone: 'neutral' }
  }
}

// ─── Funnel and exit ─────────────────────────────────────────────────────────

export const STAGES = ['Visited', 'Opened a design', 'Started the builder', 'Saw the price', 'Opened payment', 'Paid'] as const

const DESIGN_EVENTS = new Set(['template_view', 'preview_open'])

export function stageOf(rows: ActivityRow[]): number {
  let stage = 0
  for (const r of rows) {
    if (r.name === 'purchase') return 5
    if (r.name === 'checkout_start') stage = Math.max(stage, 4)
    else if (r.name === 'paywall_view') stage = Math.max(stage, 3)
    else if (r.name === 'create_start' || r.name === 'create_step_complete') stage = Math.max(stage, 2)
    else if (DESIGN_EVENTS.has(r.name) || (r.name === 'page_view' && templateFromPath(r.path))) stage = Math.max(stage, 1)
  }
  return stage
}

export interface Exit {
  /** Stable category, for counting "why people left". */
  key: string
  label: string
  tone: Tone
}

export const EXIT_GROUPS: Record<string, string> = {
  paid: 'Paid and published',
  paid_unpublished: 'Paid, did not publish',
  published: 'Published (no payment needed)',
  error: 'Hit a page error',
  payment_failed: 'Payment not confirmed',
  checkout_error: 'Payment window did not open',
  checkout_abandon: 'Closed the payment window',
  checkout_left: 'Left during payment',
  rage: 'A button did not respond',
  signin: 'Asked to sign in, did not',
  paywall: 'Saw the price, left',
  builder: 'Left the builder part-way',
  builder_start: 'Opened the builder, left at once',
  signed_up: 'Signed up, did not start',
  support: 'Went to WhatsApp support',
  wording: 'Copied wording, left',
  designs: 'Looked at designs, did not start',
  bounce: 'Left within seconds',
  browsed: 'Read pages, never opened a design',
}

const exit = (key: string, label = EXIT_GROUPS[key], tone: Tone = 'warn'): Exit => ({ key, label, tone })

/** The most likely reason a visit ended, read from what the visitor did last. */
export function exitReason(rows: ActivityRow[]): Exit {
  const has = (n: string) => rows.some((r) => r.name === n)
  if (has('purchase')) return has('invite_creation') ? exit('paid', undefined, 'good') : exit('paid_unpublished', 'Paid, but left before publishing', 'warn')
  if (has('invite_creation')) return exit('published', 'Published an invitation', 'good')

  // Trouble in the last minute is the strongest explanation for leaving.
  const end = rows.length ? rows[rows.length - 1].createdAt.getTime() : 0
  const tail = rows.filter((r) => end - r.createdAt.getTime() < 60_000)
  const err = tail.find((r) => r.name === 'js_error')
  if (err) return exit('error', `Hit a page error, then left: ${str(dataOf(err).message).slice(0, 90)}`, 'bad')

  if (has('payment_failed')) return exit('payment_failed', 'Paid, but the payment was not confirmed', 'bad')
  if (has('checkout_error')) return exit('checkout_error', undefined, 'bad')
  if (has('checkout_abandon')) return exit('checkout_abandon', 'Closed the payment window without paying')
  if (has('checkout_start')) return exit('checkout_left', 'Left while the payment window was open')

  const rage = tail.find((r) => r.name === 'rage_click')
  if (rage) return exit('rage', `Clicked “${str(dataOf(rage).label)}” repeatedly, then left`, 'bad')

  if (has('signup_start') && !has('sign_up')) return exit('signin', 'Was asked to sign in, and did not')
  if (has('paywall_view')) {
    const pw = rows.filter((r) => r.name === 'paywall_view').pop()!
    return exit('paywall', `Saw the price${money(dataOf(pw)) ? ` (${money(dataOf(pw))})` : ''}, then left`)
  }
  const steps = rows.filter((r) => r.name === 'create_step_complete').map(dataOf)
  if (steps.length) {
    const last = steps.reduce((a, b) => (Number(b.step) > Number(a.step) ? b : a))
    return exit('builder', `Left the builder after step ${last.step} (${str(last.step_name)})`)
  }
  if (has('create_start')) return exit('builder_start', 'Opened the builder, left without filling it in')
  if (has('sign_up')) return exit('signed_up', 'Created an account, then left without starting', 'neutral')
  if (has('support_contact')) return exit('support', 'Went to WhatsApp to talk to you', 'neutral')
  if (has('wording_copy')) return exit('wording', 'Copied a wording sample, then left', 'neutral')
  if (stageOf(rows) >= 1) return exit('designs', 'Looked at designs, did not start one', 'neutral')

  const pages = rows.filter((r) => r.name === 'page_view').length
  const seconds = rows.length ? (end - rows[0].createdAt.getTime()) / 1000 + (Number(dataOf(rows[rows.length - 1]).seconds) || 0) : 0
  if (pages <= 1 && seconds < 15) return exit('bounce', `Left within ${Math.max(1, Math.round(seconds))} seconds`, 'neutral')
  return exit('browsed', `Read ${pages} page${pages === 1 ? '' : 's'}, never opened a design`, 'neutral')
}

// ─── Grouping ────────────────────────────────────────────────────────────────

export interface Session {
  id: string
  start: Date
  end: Date
  rows: ActivityRow[]
  context: Data
  exit: Exit
}

export interface Visitor {
  id: string
  userId: string | null
  first: Date
  last: Date
  sessions: Session[]
  pages: number
  /** Designs looked at, in the order first seen. */
  viewed: string[]
  /** Designs the visitor started an invitation with. */
  tried: string[]
  stage: number
  errors: number
  /** How the most recent visit ended. */
  exit: Exit
  context: Data
}

/** Groups rows (any order) into visitors, newest activity first. */
export function groupVisitors(rows: ActivityRow[]): Visitor[] {
  const byVisitor = new Map<string, ActivityRow[]>()
  for (const r of rows) {
    const list = byVisitor.get(r.visitorId)
    if (list) list.push(r)
    else byVisitor.set(r.visitorId, [r])
  }
  const visitors: Visitor[] = []
  byVisitor.forEach((list, id) => {
    list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    const bySession = new Map<string, ActivityRow[]>()
    for (const r of list) {
      const s = bySession.get(r.sessionId)
      if (s) s.push(r)
      else bySession.set(r.sessionId, [r])
    }
    const sessions: Session[] = []
    bySession.forEach((srows, sid) => {
      const start = srows.find((r) => r.name === 'session_start')
      sessions.push({
        id: sid,
        start: srows[0].createdAt,
        end: srows[srows.length - 1].createdAt,
        rows: srows,
        context: start ? dataOf(start) : {},
        exit: exitReason(srows),
      })
    })
    sessions.sort((a, b) => a.start.getTime() - b.start.getTime())

    const viewed: string[] = []
    const tried: string[] = []
    const add = (arr: string[], v?: string) => v && !arr.includes(v) && arr.push(v)
    for (const r of list) {
      const d = dataOf(r)
      if (r.name === 'page_view') add(viewed, templateFromPath(r.path))
      if (DESIGN_EVENTS.has(r.name) || r.name === 'cta_click') add(viewed, str(d.template_id) || undefined)
      if (r.name === 'create_start') add(tried, str(d.template_id) || undefined)
    }
    const firstContext = sessions.find((s) => Object.keys(s.context).length)?.context ?? {}
    visitors.push({
      id,
      userId: [...list].reverse().find((r) => r.userId)?.userId ?? null,
      first: list[0].createdAt,
      last: list[list.length - 1].createdAt,
      sessions,
      pages: list.filter((r) => r.name === 'page_view').length,
      viewed,
      tried,
      stage: stageOf(list),
      errors: list.filter((r) => r.name === 'js_error' || r.name === 'rage_click' || r.name === 'checkout_error' || r.name === 'payment_failed').length,
      exit: sessions[sessions.length - 1].exit,
      context: firstContext,
    })
  })
  return visitors.sort((a, b) => b.last.getTime() - a.last.getTime())
}
