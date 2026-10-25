import type { Metadata } from 'next'
import type { Orders } from 'razorpay/dist/types/orders'
import type { Payments } from 'razorpay/dist/types/payments'
import { getRazorpayClient } from '@/lib/razorpay'
import { currencyOf, formatMoney, isPriceList } from '@/lib/pricing'
import { PLAN_MAP, type PlanId } from '@/lib/plans'
import { displayName } from '@/lib/catalog'
import { getTemplateData } from '@/modules/templates/data'
import { ADMIN_CSS } from '../styles'
import { ago, num, when } from '../activity/ui'

/**
 * Razorpay checkouts that were opened but not paid, so the owner can follow up
 * personally. Read straight from Razorpay (orders and their payment attempts):
 * a failed payment carries the payer's phone and email, which is everything a
 * WhatsApp message needs. Read-only; nothing here touches an order.
 */

export const metadata: Metadata = {
  title: { absolute: 'Admin · Unpaid checkouts | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const DAYS = 30
/** Razorpay's largest page, and how many pages to read at most (2,000 records). */
const PAGE = 100
const MAX_PAGES = 20
/** Attempted orders whose payments were not in the listing are fetched one by one, up to this many. */
const FETCH_CAP = 30
const TIMEOUT_MS = 25_000

type Order = Orders.RazorpayOrder
type Payment = Payments.RazorpayPayment

// ─── Reading Razorpay ────────────────────────────────────────────────────────

/** Every page of a Razorpay listing, newest first, stopping at MAX_PAGES. */
async function listAll<T>(fetchPage: (skip: number) => Promise<{ items: T[] }>) {
  const items: T[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = (await fetchPage(page * PAGE)).items
    items.push(...batch)
    if (batch.length < PAGE) return { items, capped: false }
  }
  return { items, capped: true }
}

async function withTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Razorpay took more than ${TIMEOUT_MS / 1000} seconds to answer.`)), TIMEOUT_MS)
  })
  try {
    return await Promise.race([work, late])
  } finally {
    clearTimeout(timer)
  }
}

async function loadCheckouts() {
  const razorpay = getRazorpayClient()
  const to = Math.floor(Date.now() / 1000)
  const from = to - DAYS * 24 * 60 * 60

  // One listing of orders and one of payments covers the whole window in a few
  // calls, instead of one call per order.
  const [orders, payments] = await Promise.all([
    listAll((skip) => razorpay.orders.all({ from, to, count: PAGE, skip })),
    listAll((skip) => razorpay.payments.all({ from, to, count: PAGE, skip })),
  ])

  const byOrder = new Map<string, Payment[]>()
  for (const p of payments.items) {
    if (!p.order_id) continue
    byOrder.set(p.order_id, [...(byOrder.get(p.order_id) ?? []), p])
  }

  // An order Razorpay says was attempted but whose payments the listing did
  // not include (only when that listing hit its cap): ask for them directly.
  const missing = orders.items.filter((o) => o.status !== 'paid' && o.attempts > 0 && !byOrder.has(o.id)).slice(0, FETCH_CAP)
  for (let i = 0; i < missing.length; i += 5) {
    const batch = missing.slice(i, i + 5)
    const found = await Promise.allSettled(batch.map((o) => razorpay.orders.fetchPayments(o.id)))
    found.forEach((r, j) => {
      if (r.status === 'fulfilled' && r.value.items.length) byOrder.set(batch[j].id, r.value.items)
    })
  }
  byOrder.forEach((list) => list.sort((a, b) => b.created_at - a.created_at))

  return { orders: orders.items, byOrder, capped: orders.capped || payments.capped }
}

/** Why Razorpay could not be read, in words the owner can act on. */
function problemText(err: unknown): string {
  // The SDK rejects with { statusCode, error: { code, description } }.
  const e = (err ?? {}) as { statusCode?: number | string; error?: { description?: string }; message?: string }
  if (Number(e.statusCode) === 401) {
    return 'Razorpay did not accept the keys (HTTP 401). Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
  }
  const detail = (e.error?.description || e.message || String(err)).trim().replace(/[.!]+$/, '')
  return `${detail}${e.statusCode ? ` (HTTP ${e.statusCode})` : ''}. Reload in a moment.`
}

// ─── Reading an order ────────────────────────────────────────────────────────

function note(o: Order, key: string): string {
  const v = (o.notes as Record<string, unknown> | undefined)?.[key]
  return v === undefined || v === null ? '' : String(v)
}

/** Made by the ShareInvite checkout (app/api/payments/create-order), not a payment link or another integration. */
const isShareInviteOrder = (o: Order) => Boolean(note(o, 'plan'))

/** A token-price order (lib/priceOverrides.ts) is the owner testing, not a customer. */
const isTestOrder = (o: Order) => Boolean(note(o, 'priceOverrideInr'))

function designOf(o: Order): string | null {
  const t = getTemplateData(note(o, 'templateId'))
  return t ? displayName(t.name) : null
}

function designLabel(o: Order): string {
  const design = designOf(o)
  if (design) return design
  const plan = PLAN_MAP[note(o, 'plan') as PlanId]
  return plan ? `${plan.name} plan (design not recorded)` : 'Design not recorded'
}

/** "₹1,499", "US$39": the amount the order was for, from minor units. */
function money(o: Order): string {
  const amount = Number(o.amount) / 100
  const list = note(o, 'priceList')
  if (isPriceList(list) && currencyOf(list) === o.currency) return formatMoney(amount, list)
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: o.currency, maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `${o.currency} ${amount}`
  }
}

const at = (seconds: number) => new Date(seconds * 1000)

// ─── Reading a payment ───────────────────────────────────────────────────────

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Razorpay puts void@razorpay.com in place of an email the checkout did not ask for. */
function emailOf(p: Payment): string | null {
  const email = String(p.email ?? '').trim().toLowerCase()
  return EMAIL.test(email) && !email.endsWith('@razorpay.com') ? email : null
}

/** Digits as wa.me wants them: country code first, no '+'. Razorpay usually stores "+91…". */
function phoneOf(p: Payment): string | null {
  const raw = String(p.contact ?? '').trim()
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  else if (!raw.startsWith('+')) {
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
    if (d.length === 10 && /^[6-9]/.test(d)) d = `91${d}`
  }
  return d.length >= 8 && d.length <= 15 ? d : null
}

const showPhone = (digits: string) => (digits.length === 12 && digits.startsWith('91') ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}` : `+${digits}`)

const METHOD: Record<string, string> = { upi: 'UPI', card: 'card', netbanking: 'net banking', wallet: 'wallet', emi: 'EMI', paylater: 'pay later' }

function methodOf(p: Payment): string {
  const name = METHOD[p.method] ?? p.method
  const via = p.vpa || p.wallet || p.bank
  return via ? `${name} (${via})` : name
}

type Tone = 'bad' | 'warn' | 'neutral'

function statusOf(p: Payment): { tone: Tone; mark: string; label: string; short: string } {
  if (p.status === 'failed') return { tone: 'bad', mark: '✕', label: 'Payment failed', short: 'failed' }
  if (p.status === 'created') return { tone: 'warn', mark: '!', label: 'Started paying, did not finish', short: 'not finished' }
  if (p.status === 'authorized') {
    return { tone: 'warn', mark: '!', label: 'Money authorised but not captured: check Razorpay first', short: 'authorised, not captured' }
  }
  return { tone: 'neutral', mark: '•', label: `Payment ${p.status}`, short: p.status }
}

/** Razorpay's own words for a failure, or its reason code made readable. */
function reasonOf(p: Payment): string | null {
  if (p.error_description) return p.error_description
  return p.error_reason ? p.error_reason.replace(/_/g, ' ') : null
}

// ─── The follow-up message ───────────────────────────────────────────────────

/** A short, warm note in the owner's voice. No discount, nothing that sounds automated. */
function followUp(design: string | null, p: Payment): string {
  const what = design ? `the ${design} invitation` : 'your invitation'
  if (p.status === 'failed') {
    return `Hi! I'm writing from ShareInvite. I noticed your payment for ${what} didn't go through, sorry about that. If you'd like, I can help you finish your invitation. Just reply whenever it suits you.`
  }
  if (p.status === 'authorized') {
    return `Hi! I'm writing from ShareInvite. I can see your payment for ${what} reached us but hasn't been confirmed yet. I'm looking into it now and will make sure it's sorted. Just reply here if you have any questions.`
  }
  return `Hi! I'm writing from ShareInvite. I noticed you were getting ${what} ready but didn't get to finish. Can I help with anything? Just reply here and I'll help you complete it.`
}

const whatsAppUrl = (digits: string, text: string) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
const mailUrl = (email: string, text: string) =>
  `mailto:${email}?subject=${encodeURIComponent('Your ShareInvite invitation')}&body=${encodeURIComponent(text)}`

// ─── People to follow up ─────────────────────────────────────────────────────

interface Checkout {
  order: Order
  /** Newest first. */
  payments: Payment[]
}

interface Person {
  phone: string | null
  email: string | null
  /** Newest first. */
  checkouts: Checkout[]
  boughtLater?: { at: number; design: string }
}

interface Report {
  people: Person[]
  bought: Person[]
  /** Opened payment and closed it before any payment was made, so Razorpay holds no contact. */
  closedEarly: { count: number; designs: { name: string; count: number }[] }
  stats: { opened: number; paid: number; unpaid: number }
  tests: number
  capped: boolean
}

function buildReport(orders: Order[], byOrder: Map<string, Payment[]>, capped: boolean): Report {
  const ours = orders.filter(isShareInviteOrder)
  const real = ours.filter((o) => !isTestOrder(o))
  const paid = real.filter((o) => o.status === 'paid')
  const unpaid = real.filter((o) => o.status !== 'paid')

  // Who has paid, by account, phone and email, and when: someone who paid for
  // a later checkout needs no follow-up.
  const purchases = new Map<string, { at: number; design: string }[]>()
  const addPurchase = (key: string, o: Order) => purchases.set(key, [...(purchases.get(key) ?? []), { at: o.created_at, design: designLabel(o) }])
  for (const o of paid) {
    const user = note(o, 'userId')
    if (user && user !== 'guest') addPurchase(`u:${user}`, o)
    for (const p of byOrder.get(o.id) ?? []) {
      if (p.status !== 'captured' && p.status !== 'refunded') continue
      const phone = phoneOf(p)
      const email = emailOf(p)
      if (phone) addPurchase(`p:${phone}`, o)
      if (email) addPurchase(`e:${email}`, o)
    }
  }

  // Unpaid checkouts with at least one payment attempt, grouped by person so
  // someone who tried three times gets one message, not three.
  const people = new Map<string, Person & { keys: Set<string> }>()
  const early: Order[] = []
  for (const o of unpaid) {
    const payments = byOrder.get(o.id) ?? []
    if (!payments.length) {
      early.push(o)
      continue
    }
    const phone = payments.map(phoneOf).find(Boolean) ?? null
    const email = payments.map(emailOf).find(Boolean) ?? null
    const user = note(o, 'userId')
    const account = user && user !== 'guest' ? `u:${user}` : null
    const key = phone ? `p:${phone}` : email ? `e:${email}` : account ?? `o:${o.id}`
    const person = people.get(key) ?? { phone, email, checkouts: [], keys: new Set<string>() }
    person.phone ??= phone
    person.email ??= email
    person.checkouts.push({ order: o, payments })
    for (const k of [phone && `p:${phone}`, email && `e:${email}`, account]) if (k) person.keys.add(k)
    people.set(key, person)
  }

  const all = Array.from(people.values())
  for (const person of all) {
    person.checkouts.sort((a, b) => b.order.created_at - a.order.created_at)
    const latest = person.checkouts[0].order.created_at
    const later = Array.from(person.keys)
      .flatMap((k) => purchases.get(k) ?? [])
      .filter((b) => b.at > latest)
      .sort((a, b) => b.at - a.at)
    if (later.length) person.boughtLater = later[0]
  }
  all.sort((a, b) => b.checkouts[0].order.created_at - a.checkouts[0].order.created_at)

  // Closed before entering details: one per signed-in account (and not anyone
  // already listed or who paid later), one per checkout for signed-out visitors,
  // who cannot be told apart.
  const listed = new Set(all.flatMap((p) => Array.from(p.keys)))
  const seen = new Set<string>()
  const designs = new Map<string, number>()
  let count = 0
  for (const o of early) {
    const user = note(o, 'userId')
    if (user && user !== 'guest') {
      const key = `u:${user}`
      if (seen.has(key) || listed.has(key) || (purchases.get(key) ?? []).some((b) => b.at > o.created_at)) continue
      seen.add(key)
    }
    count++
    const name = designLabel(o)
    designs.set(name, (designs.get(name) ?? 0) + 1)
  }

  return {
    people: all.filter((p) => !p.boughtLater),
    bought: all.filter((p) => p.boughtLater),
    closedEarly: {
      count,
      designs: Array.from(designs, ([name, n]) => ({ name, count: n })).sort((a, b) => b.count - a.count),
    },
    stats: { opened: real.length, paid: paid.length, unpaid: unpaid.length },
    tests: ours.length - real.length,
    capped,
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CSS = `
.ac-grid{grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))}
.ac-badge{align-self:flex-start}
.ac-amount{font-size:15px;font-weight:700}
.ac-contact{display:flex;flex-direction:column;gap:2px;font-size:13.5px;overflow-wrap:anywhere}
.ac-contact a{color:#0B4A34;text-decoration:none;font-weight:600}
.ac-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}
.ac-wa{display:inline-flex;align-items:center;gap:7px;background:#0E7A43;color:#fff;font-weight:700;font-size:14px;padding:10px 16px;border-radius:10px;text-decoration:none}
.ac-wa:hover{background:#0B4A34}
.ac-mail{display:inline-flex;align-items:center;padding:10px 14px;border-radius:10px;border:1px solid rgba(44,32,28,.16);background:#fff;color:#4A403B;font-size:14px;font-weight:600;text-decoration:none}
.ac-earlier{margin:0;padding-left:18px;font-size:12.5px;color:#7A6E68}
`

function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  const q = token ? `?token=${encodeURIComponent(token)}` : ''
  return (
    <div className="aa">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + CSS }} />
      <header className="aa-top">
        <div className="aa-top-in">
          <strong>ShareInvite Admin · Unpaid checkouts</strong>
          {token && (
            <span className="aa-top-links">
              <a href={`/admin/activity${q}`}>Visitor activity →</a>
              <a href={`/admin/requests${q}`}>Custom requests →</a>
            </span>
          )}
        </div>
      </header>
      <main className="aa-main">{children}</main>
    </div>
  )
}

function PersonCard({ person }: { person: Person }) {
  const [latest, ...earlier] = person.checkouts
  const payment = latest.payments[0]
  const status = statusOf(payment)
  const reason = reasonOf(payment)
  const design = designOf(latest.order)
  const coupon = note(latest.order, 'coupon')
  const message = followUp(design, payment)
  const tries = person.checkouts.reduce((n, c) => n + c.payments.length, 0)

  return (
    <section className="aa-card">
      <div className="aa-row">
        <strong>{designLabel(latest.order)}</strong>
        <span className="aa-muted aa-small" title={when(at(latest.order.created_at))}>{ago(at(latest.order.created_at))}</span>
      </div>
      <p className="aa-small">
        <span className="ac-amount">{money(latest.order)}</span>
        {coupon && <> <span className="aa-tag">Code {coupon}</span></>}
      </p>
      <span className={`aa-exit ac-badge ${status.tone}`}>
        <span aria-hidden>{status.mark}</span> {status.label}
      </span>
      {reason && <p className="aa-small">Reason: {reason}</p>}

      <div className="ac-contact">
        {person.phone ? <a href={`tel:+${person.phone}`}>{showPhone(person.phone)}</a> : <span className="aa-muted">No phone number</span>}
        {person.email ? <a href={mailUrl(person.email, message)}>{person.email}</a> : <span className="aa-muted">No email</span>}
      </div>

      {(person.phone || person.email) && (
        <div className="ac-actions">
          {person.phone && (
            <a className="ac-wa" href={whatsAppUrl(person.phone, message)} target="_blank" rel="noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" />
              </svg>
              WhatsApp
            </a>
          )}
          {person.email && !person.phone && (
            <a className="ac-mail" href={mailUrl(person.email, message)}>Email</a>
          )}
        </div>
      )}

      <p className="aa-small aa-muted">
        {tries} payment attempt{tries === 1 ? '' : 's'} · last by {methodOf(payment)} · <code>{latest.order.id}</code>
      </p>
      {earlier.length > 0 && (
        <ul className="ac-earlier">
          {earlier.map((c) => (
            <li key={c.order.id}>
              Earlier: {designLabel(c.order)} {money(c.order)} on {when(at(c.order.created_at))} ({statusOf(c.payments[0]).short})
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Body({ report }: { report: Report }) {
  const { people, bought, closedEarly, stats } = report
  return (
    <>
      <p className="aa-small aa-muted">
        Razorpay checkouts from the last {DAYS} days that were not paid, newest first. Each person appears once, with their
        latest checkout. The WhatsApp button opens a chat with a short message ready to edit and send.
      </p>

      <div className="aa-stats">
        {[
          { label: 'Checkouts opened', value: stats.opened },
          { label: 'Paid', value: stats.paid },
          { label: 'Not paid', value: stats.unpaid },
          { label: 'To follow up', value: people.length },
        ].map((s) => (
          <div key={s.label} className="aa-card aa-stat">
            <p className="aa-stat-label">{s.label}</p>
            <p className="aa-stat-value">{num(s.value)}</p>
          </div>
        ))}
      </div>

      {closedEarly.count > 0 && (
        <section className="aa-card aa-callout">
          <p className="aa-small">
            <strong>
              {num(closedEarly.count)} {closedEarly.count === 1 ? 'person' : 'people'} opened payment and closed it before entering
              details.
            </strong>{' '}
            Razorpay has no phone number or email for them.
          </p>
          <p className="aa-small aa-muted">{closedEarly.designs.map((d) => `${d.name} ${d.count}`).join(' · ')}</p>
        </section>
      )}

      {people.length === 0 ? (
        <div className="aa-card aa-empty">
          <p>Nobody to follow up right now.</p>
          <p className="aa-small aa-muted">Anyone whose payment fails or is left unfinished will appear here.</p>
        </div>
      ) : (
        <div className="aa-grid ac-grid">
          {people.map((p) => (
            <PersonCard key={p.checkouts[0].order.id} person={p} />
          ))}
        </div>
      )}

      {bought.length > 0 && (
        <section className="aa-card">
          <h3>Paid afterwards</h3>
          <p className="aa-small aa-muted">These people had an unpaid checkout but paid on a later one, so there is no need to message them.</p>
          <ul className="aa-list aa-small">
            {bought.map((p) => (
              <li key={p.checkouts[0].order.id}>
                {p.phone ? showPhone(p.phone) : p.email ?? 'Signed-in customer'}: paid for {p.boughtLater!.design} on{' '}
                {when(at(p.boughtLater!.at))}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="aa-small aa-muted aa-center">
        {report.capped ? `Read the latest ${num(PAGE * MAX_PAGES)} records only · ` : ''}
        {report.tests > 0 ? `${report.tests} test-price order${report.tests === 1 ? '' : 's'} left out · ` : ''}
        Only orders from the ShareInvite checkout · times in IST
      </p>
    </>
  )
}

function Problem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="aa-card">
      <h3>{title}</h3>
      <p className="aa-small">{children}</p>
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function AdminCheckoutsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const secret = process.env.ADMIN_SECRET
  if (!secret || sp.token !== secret) {
    return (
      <Shell>
        <form className="aa-card aa-login" method="GET" action="/admin/checkouts">
          <h2>Admin sign-in</h2>
          {!secret && <p className="aa-small">Set <code>ADMIN_SECRET</code> in the environment first.</p>}
          {secret && sp.token && <p className="aa-small" style={{ color: '#9B1C1C' }}>Incorrect token. Try again.</p>}
          <input name="token" type="password" placeholder="Admin token" required autoFocus aria-label="Admin token" />
          <button type="submit">View checkouts</button>
        </form>
      </Shell>
    )
  }

  let body: React.ReactNode
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    body = (
      <Problem title="Razorpay is not connected here">
        Set <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in the environment, then reload this page.
      </Problem>
    )
  } else {
    try {
      const { orders, byOrder, capped } = await withTimeout(loadCheckouts())
      body = <Body report={buildReport(orders, byOrder, capped)} />
    } catch (err) {
      console.error('[admin/checkouts]', err)
      body = (
        <Problem title="Could not read checkouts from Razorpay">
          {problemText(err)}
        </Problem>
      )
    }
  }

  return <Shell token={sp.token}>{body}</Shell>
}
