import { TEMPLATES } from '@/modules/templates/data'
import { getRequiredPlan } from '@/lib/plans'
import {
  SOURCE_GROUPS,
  dataOf,
  isGalleryStart,
  isPhone,
  pageLabel,
  sourceInfo,
  stageOf,
  str,
  type ActivityRow,
  type SourceGroup,
  type Visitor,
} from '@/lib/activityReport'

/**
 * The summaries behind the Builder, Designs, Pages, Problems and Keywords tabs
 * of /admin/activity, computed from the same visitor journal as the overview.
 * Every count is of people (or visits, where it says so), not of events, so a
 * visitor who reloads a page ten times counts once.
 */

const median = (xs: number[]) => {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// ─── Sources ─────────────────────────────────────────────────────────────────

export interface SourceRow {
  group: SourceGroup
  label: string
  visitors: number
  design: number
  builder: number
  price: number
  paid: number
  /** The individual sites in the group, most visitors first: "Google 40 · Bing 2". */
  names: { name: string; count: number }[]
}

/** Where each visitor first came from, and how far the people from each source got. */
export function sourcesTable(visitors: Visitor[]): SourceRow[] {
  const rows = new Map<SourceGroup, SourceRow & { byName: Map<string, number> }>()
  for (const v of visitors) {
    const { group, name } = sourceInfo(v.context)
    const row = rows.get(group) ?? { group, label: SOURCE_GROUPS[group], visitors: 0, design: 0, builder: 0, price: 0, paid: 0, names: [], byName: new Map() }
    row.visitors++
    if (v.stage >= 1) row.design++
    if (v.stage >= 2) row.builder++
    if (v.stage >= 3) row.price++
    if (v.stage >= 5) row.paid++
    row.byName.set(name, (row.byName.get(name) ?? 0) + 1)
    rows.set(group, row)
  }
  return Array.from(rows.values())
    .map(({ byName, ...r }) => ({ ...r, names: Array.from(byName, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count) }))
    .sort((a, b) => b.visitors - a.visitors)
}

// ─── Builder ─────────────────────────────────────────────────────────────────

export interface BuilderJourney {
  visitor: Visitor
  phone: boolean
  /** Opened without a design chosen, so it started at step 1 (style). */
  gallery: boolean
  /** The last builder step finished (1 style … 4 extras). */
  passed: number
  price: boolean
  payment: boolean
  paid: boolean
  /** Time on the builder page, all visits together. */
  seconds: number
}

/** Everyone who opened the builder, and the furthest they got. */
export function builderJourneys(visitors: Visitor[]): BuilderJourney[] {
  const out: BuilderJourney[] = []
  for (const v of visitors) {
    let first: { gallery: boolean; phone: boolean } | null = null
    let passed = 0
    let price = false
    let payment = false
    let paid = false
    let seconds = 0
    for (const s of v.sessions) {
      let onBuilder = 0
      s.rows.forEach((r, i) => {
        const d = dataOf(r)
        if (r.name === 'create_start' && !first) {
          first = { gallery: isGalleryStart(s.rows, i), phone: isPhone(s.context) }
          // With a design chosen, the builder opens at step 2: style is done.
          if (!first.gallery) passed = Math.max(passed, 1)
        }
        if (r.name === 'create_step_complete') passed = Math.max(passed, Number(d.step) || 0)
        if (r.name === 'paywall_view') price = true
        if (r.name === 'checkout_start') payment = true
        if (r.name === 'purchase') paid = true
        if (r.name === 'page_hide' && r.path === '/create') onBuilder = Math.max(onBuilder, Number(d.seconds) || 0)
      })
      seconds += onBuilder
    }
    if (!first) continue
    const f = first as { gallery: boolean; phone: boolean }
    // Seeing the price means steps 1-4 were done, even if an event was missed.
    if (price || payment || paid) passed = Math.max(passed, 4)
    out.push({ visitor: v, phone: f.phone, gallery: f.gallery, passed, price: price || payment || paid, payment: payment || paid, paid, seconds })
  }
  return out
}

export const BUILDER_STEPS: { label: string; reached: (j: BuilderJourney) => boolean; stopped: string }[] = [
  { label: 'Opened the builder', reached: () => true, stopped: 'Left at step 1 · choosing a design (style)' },
  { label: 'Step 1 · chose a design (style)', reached: (j) => j.passed >= 1, stopped: 'Left at step 2 · names' },
  { label: 'Step 2 · names', reached: (j) => j.passed >= 2, stopped: 'Left at step 3 · details' },
  { label: 'Step 3 · details', reached: (j) => j.passed >= 3, stopped: 'Left at step 4 · extras' },
  { label: 'Step 4 · extras', reached: (j) => j.passed >= 4, stopped: 'Left before the price appeared' },
  { label: 'Saw the price (step 5)', reached: (j) => j.price, stopped: 'Saw the price, did not open payment' },
  { label: 'Opened payment', reached: (j) => j.payment, stopped: 'Opened payment, did not pay' },
  { label: 'Paid', reached: (j) => j.paid, stopped: 'Paid' },
]

/** Where each builder visitor stopped, with how long they had spent on the builder. */
export function builderStops(journeys: BuilderJourney[]) {
  return BUILDER_STEPS.map((step, i) => {
    const next = BUILDER_STEPS[i + 1]
    const here = journeys.filter((j) => step.reached(j) && !(next && next.reached(j)))
    return {
      label: step.stopped,
      count: here.length,
      phone: here.filter((j) => j.phone).length,
      medianSeconds: median(here.map((j) => j.seconds).filter((s) => s > 0)),
    }
  }).filter((s) => s.count > 0)
}

// ─── Designs ─────────────────────────────────────────────────────────────────

export interface DesignRow {
  id: string
  name: string
  price: number
  looked: number
  opened: number
  pastNames: number
  sawPrice: number
  payment: number
  paid: number
}

/** For each design: how many people looked at it, worked on it, saw its price and paid for it. */
export function designsTable(visitors: Visitor[]): { rows: DesignRow[]; unseen: string[] } {
  const sets = new Map<string, { looked: Set<string>; opened: Set<string>; pastNames: Set<string>; sawPrice: Set<string>; payment: Set<string>; paid: Set<string> }>()
  const get = (id: string) => {
    let s = sets.get(id)
    if (!s) {
      s = { looked: new Set(), opened: new Set(), pastNames: new Set(), sawPrice: new Set(), payment: new Set(), paid: new Set() }
      sets.set(id, s)
    }
    return s
  }
  for (const v of visitors) {
    v.viewed.forEach((id) => get(id).looked.add(v.id))
    v.tried.forEach((id) => get(id).opened.add(v.id))
    for (const r of v.sessions.flatMap((s) => s.rows)) {
      const d = dataOf(r)
      const id = str(d.template_id)
      if (!id) continue
      if (r.name === 'create_step_complete' && Number(d.step) >= 2) get(id).pastNames.add(v.id)
      if (r.name === 'paywall_view') get(id).sawPrice.add(v.id)
      if (r.name === 'checkout_start') get(id).payment.add(v.id)
      if (r.name === 'purchase') get(id).paid.add(v.id)
    }
  }
  const names = new Map(TEMPLATES.map((t) => [t.id, t.name]))
  const rows = Array.from(sets, ([id, s]) => ({
    id,
    name: names.get(id) ?? id,
    price: names.has(id) ? getRequiredPlan(id).price : 0,
    looked: s.looked.size,
    opened: s.opened.size,
    pastNames: s.pastNames.size,
    sawPrice: s.sawPrice.size,
    payment: s.payment.size,
    paid: s.paid.size,
  }))
    .filter((r) => names.has(r.id))
    .sort((a, b) => b.paid - a.paid || b.opened - a.opened || b.looked - a.looked)
  const unseen = TEMPLATES.filter((t) => !sets.has(t.id)).map((t) => t.name)
  return { rows, unseen }
}

// ─── Entry pages ─────────────────────────────────────────────────────────────

export interface PageRow {
  path: string
  label: string
  visits: number
  bounced: number
  design: number
  builder: number
  price: number
  paid: number
  sources: { group: SourceGroup; count: number }[]
}

/** Each page visits started on, and how far those visits went. Counts visits, not people. */
export function pagesTable(visitors: Visitor[]): PageRow[] {
  const rows = new Map<string, PageRow & { bySource: Map<SourceGroup, number> }>()
  for (const v of visitors) {
    for (const s of v.sessions) {
      const path = str(s.context.landing) || s.rows.find((r) => r.name === 'page_view')?.path
      if (!path) continue
      const row = rows.get(path) ?? { path, label: pageLabel(path), visits: 0, bounced: 0, design: 0, builder: 0, price: 0, paid: 0, sources: [], bySource: new Map() }
      const stage = stageOf(s.rows)
      row.visits++
      if (s.exit.key === 'bounce') row.bounced++
      if (stage >= 1) row.design++
      if (stage >= 2) row.builder++
      if (stage >= 3) row.price++
      if (stage >= 5) row.paid++
      const g = sourceInfo(s.context).group
      row.bySource.set(g, (row.bySource.get(g) ?? 0) + 1)
      rows.set(path, row)
    }
  }
  return Array.from(rows.values())
    .map(({ bySource, ...r }) => ({ ...r, sources: Array.from(bySource, ([group, count]) => ({ group, count })).sort((a, b) => b.count - a.count) }))
    .sort((a, b) => b.visits - a.visits || b.paid - a.paid)
}

// ─── Problems ────────────────────────────────────────────────────────────────

const PROBLEMS: Record<string, string> = {
  js_error: 'Page error',
  rage_click: 'Clicked again and again (did not respond)',
  checkout_error: 'Payment window did not open',
  payment_failed: 'Paid, but the payment was not confirmed',
  coupon_rejected: 'Discount code refused',
}

export interface ProblemRow {
  kind: string
  where: string
  path: string
  what: string
  count: number
  visitors: number
  last: Date
  lastVisitor: string
}

/** Errors and unresponsive buttons, grouped by page and by what went wrong, most people affected first. */
export function problemsList(visitors: Visitor[]): ProblemRow[] {
  const rows = new Map<string, Omit<ProblemRow, 'visitors'> & { who: Set<string> }>()
  for (const v of visitors) {
    for (const r of v.sessions.flatMap((s) => s.rows) as ActivityRow[]) {
      const kind = PROBLEMS[r.name]
      if (!kind) continue
      const d = dataOf(r)
      const what = str(d.label) || str(d.message) || str(d.reason) || str(d.coupon) || ''
      const key = `${r.name}|${r.path}|${what}`
      const row = rows.get(key) ?? { kind, where: pageLabel(r.path), path: r.path, what, count: 0, last: r.createdAt, lastVisitor: v.id, who: new Set<string>() }
      row.count++
      row.who.add(v.id)
      if (r.createdAt >= row.last) {
        row.last = r.createdAt
        row.lastVisitor = v.id
      }
      rows.set(key, row)
    }
  }
  return Array.from(rows.values())
    .map(({ who, ...r }) => ({ ...r, visitors: who.size }))
    .sort((a, b) => b.visitors - a.visitors || b.last.getTime() - a.last.getTime())
}

// ─── Search demand by occasion (Keywords tab) ────────────────────────────────

/**
 * Occasions people search for, matched against both the search words and the
 * designs (id, name, category, description), so "designs you have" counts what
 * a visitor searching for that occasion would find.
 */
export const OCCASIONS: { name: string; re: RegExp }[] = [
  { name: 'Save the date', re: /save the date/ },
  { name: 'Engagement', re: /engagement|mangni|roka|sagai|nischay|nishchay|ring ceremony|betrothal/ },
  { name: 'Haldi / Mehendi', re: /haldi|mehendi|mehndi/ },
  { name: 'Sangeet', re: /sangeet/ },
  { name: 'Reception', re: /reception/ },
  { name: 'Wedding', re: /wedding|shaadi|shadi|vivah|marriage|kalyanam|lagna|nikah|biye/ },
  { name: 'First birthday', re: /first birthday|1st birthday|pehla/ },
  { name: 'Birthday', re: /birthday|janamdin|b'?day/ },
  { name: 'Anniversary', re: /anniversary|saalgirah/ },
  { name: 'Housewarming', re: /house ?warming|griha|gruha|grah pravesh|vastu/ },
  { name: 'Baby shower', re: /baby shower|godh|seemantham|valaikappu|dohale|shrimant/ },
  { name: 'Naming ceremony', re: /naming|namakaran|namkaran|barsala|cradle/ },
  { name: 'Pooja', re: /pooja|puja|satyanarayan|havan|katha/ },
  { name: 'Diwali', re: /diwali|deepavali/ },
  { name: 'Ganesh Chaturthi', re: /ganesh|ganpati|ganapati|vinayak/ },
  { name: 'Raksha Bandhan', re: /rakhi|raksha/ },
  { name: 'Dasara / Navratri', re: /dasara|dussehra|navratri|durga|golu|bombe|bommai/ },
  { name: 'Christmas', re: /christmas|xmas/ },
  { name: 'New Year', re: /new year|nye\b/ },
  { name: 'Eid', re: /\beid\b|iftar|ramadan|ramzan/ },
  { name: 'Holi', re: /\bholi\b/ },
  { name: 'Retirement / farewell', re: /retirement|farewell/ },
  { name: 'Corporate / office', re: /corporate|office|business|company|launch|conference|seminar/ },
  { name: 'Thread ceremony', re: /upanayan|thread ceremony|janeu|munj/ },
  { name: 'Mundan / Annaprashan', re: /mundan|annaprashan|rice ceremony/ },
]

export interface OccasionRow {
  name: string
  searches: number
  impressions: number
  clicks: number
  position: number
  designs: number
  top: string[]
}

export function occasionDemand(queries: { query: string; clicks: number; impressions: number; position: number }[]): OccasionRow[] {
  const designText = TEMPLATES.map((t) => `${t.id} ${t.name} ${t.category} ${t.description ?? ''}`.toLowerCase())
  const rows = new Map<string, OccasionRow & { weighted: number; list: { q: string; i: number }[] }>()
  for (const q of queries) {
    const text = q.query.toLowerCase()
    const occasion = OCCASIONS.find((o) => o.re.test(text))
    const name = occasion?.name ?? 'Other searches'
    const row = rows.get(name) ?? {
      name,
      searches: 0,
      impressions: 0,
      clicks: 0,
      position: 0,
      designs: occasion ? designText.filter((d) => occasion.re.test(d)).length : -1,
      top: [],
      weighted: 0,
      list: [],
    }
    row.searches++
    row.impressions += q.impressions
    row.clicks += q.clicks
    row.weighted += q.position * q.impressions
    row.list.push({ q: q.query, i: q.impressions })
    rows.set(name, row)
  }
  return Array.from(rows.values())
    .map(({ weighted, list, ...r }) => ({
      ...r,
      position: r.impressions ? weighted / r.impressions : 0,
      top: list.sort((a, b) => b.i - a.i).slice(0, 4).map((x) => x.q),
    }))
    .sort((a, b) => b.impressions - a.impressions)
}
