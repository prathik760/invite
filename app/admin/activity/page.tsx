import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { ACTIVITY_DAYS } from '@/lib/retention'
import {
  EXIT_GROUPS,
  STAGES,
  describe,
  duration,
  groupVisitors,
  isGalleryStart,
  pageLabel,
  placeOf,
  sourceInfo,
  sourceOf,
  str,
  templateName,
  type ActivityRow,
  type Session,
  type Visitor,
} from '@/lib/activityReport'
import { sourcesTable } from '@/lib/activityInsights'
import { gscDate, gscPageSearches, gscProblemText, gscStatus } from '@/lib/searchConsole'
import { OWNER_KEY } from '@/lib/activityEvents'
import { ROW_CAP, SELECT, isMissingTable, loadPeriod } from './load'
import { BotsTab, BuilderTab, DesignsTab, KeywordsTab, PagesTab, ProblemsTab } from './tabs'
import { ADMIN_CSS } from '../styles'
import {
  Bars,
  Cell,
  Chips,
  DAY,
  ExitBadge,
  TABS,
  TONE,
  Table,
  ago,
  clock,
  href,
  istDay,
  num,
  when,
  who,
  type Params,
  type TabKey,
  type Users,
} from './ui'

export const metadata: Metadata = {
  title: { absolute: 'Admin — Visitor activity | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const LIST_CAP = 150
const RANGES = [
  { days: 1, label: 'Today' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: ACTIVITY_DAYS, label: `${ACTIVITY_DAYS} days` },
]
const FILTERS: { key: string; label: string; test: (v: Visitor) => boolean }[] = [
  { key: 'all', label: 'Everyone', test: () => true },
  { key: 'signed', label: 'Signed in', test: (v) => Boolean(v.userId) },
  { key: 'design', label: 'Opened a design', test: (v) => v.stage >= 1 },
  { key: 'builder', label: 'Opened the builder', test: (v) => v.stage >= 2 },
  { key: 'payment', label: 'Reached payment', test: (v) => v.stage >= 4 },
  { key: 'paid', label: 'Paid', test: (v) => v.stage >= 5 },
  { key: 'problem', label: 'Had a problem', test: (v) => v.errors > 0 },
]

// ─── Visitor card ────────────────────────────────────────────────────────────

function VisitorCard({ v, users, p }: { v: Visitor; users: Users; p: Params }) {
  return (
    <a className="aa-card aa-visitor" href={href(p, { visitor: v.id, q: undefined })}>
      <div className="aa-row">
        <strong>{who(v, users)}</strong>
        <span className="aa-muted">{ago(v.last)}</span>
      </div>
      <p className="aa-muted aa-small">
        {[sourceOf(v.context), String(v.context.device ?? ''), placeOf(v.context)].filter(Boolean).join(' · ')}
      </p>
      <p className="aa-small">
        {v.sessions.length} visit{v.sessions.length === 1 ? '' : 's'} · {v.pages} page{v.pages === 1 ? '' : 's'} · reached{' '}
        <strong>{STAGES[v.stage]}</strong>
      </p>
      <Chips ids={v.viewed} label="Looked at" />
      <Chips ids={v.tried} label="Worked on" />
      <div className="aa-row">
        <ExitBadge exit={v.exit} prefix={v.exitIsLastVisit ? 'Last visit: ' : undefined} />
        <span className="aa-link">Full history →</span>
      </div>
    </a>
  )
}

// ─── What a visitor probably searched ────────────────────────────────────────

/**
 * Google keeps a searcher's words from the site they click, so nobody can know
 * them for one person. What Search Console does know is which searches brought
 * clicks to that page on that day; when it was one search and one click, it
 * was almost certainly theirs.
 */
async function LikelySearches({ s }: { s: Session }) {
  const path = str(s.context.landing) || s.rows.find((r) => r.name === 'page_view')?.path || '/'
  const date = gscDate(s.start)
  const recent = Date.now() - s.start.getTime() < 3 * DAY
  try {
    let rows = await gscPageSearches(path, { date })
    let scope = `on ${date} (Google's date)`
    if (!rows.length) {
      rows = await gscPageSearches(path, { days: 28 })
      scope = 'over the last 28 days'
    }
    rows = [...rows].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 6)
    const clicked = rows.filter((r) => r.clicks > 0)
    const sure = scope.startsWith('on') && clicked.length === 1 && clicked[0].clicks === 1
    return (
      <div className="aa-search-box">
        <p className="aa-small">
          <strong>🔎 What they probably searched</strong>{' '}
          <span className="aa-muted">— Google searches that led to {pageLabel(path)} {scope}</span>
        </p>
        {sure && <p className="aa-small">Very likely: <strong>&ldquo;{clicked[0].keys[0]}&rdquo;</strong> (the only search that brought a click that day)</p>}
        {rows.length ? (
          <ul className="aa-list aa-small">
            {rows.map((r) => (
              <li key={r.keys[0]}>
                &ldquo;{r.keys[0]}&rdquo;{' '}
                <span className="aa-muted">· {r.clicks} click{r.clicks === 1 ? '' : 's'} · shown {r.impressions} · rank {r.position.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="aa-small aa-muted">Google has no search words for this page yet — new pages and rare searches are hidden.</p>
        )}
        {recent && scope.startsWith('over') && (
          <p className="aa-small aa-muted">That day&apos;s figures are not in Search Console yet (it runs 1–3 days behind); check back.</p>
        )}
      </div>
    )
  } catch (err) {
    return <p className="aa-small aa-muted">{gscProblemText(err)}</p>
  }
}

/** For a visit from an AI assistant: the page it sent them to, and whether it read that page for someone that day. */
async function AiVisit({ s, assistant }: { s: Session; assistant: string }) {
  const path = str(s.context.landing) || '/'
  let reads = 0
  try {
    const rows = await prisma.botHit.findMany({ where: { day: istDay(s.start), path, kind: 'ai' }, select: { bot: true, hits: true } })
    reads = rows.filter((r) => /for a user/.test(r.bot)).reduce((n, r) => n + r.hits, 0)
  } catch {}
  return (
    <div className="aa-search-box">
      <p className="aa-small">
        <strong>🤖 {assistant} sent them to {pageLabel(path)}.</strong>{' '}
        <span className="aa-muted">
          AI assistants do not pass on what the person asked; the page they were sent to is the best clue.
          {reads > 0 && ` That day, AI assistants opened this page ${reads} time${reads === 1 ? '' : 's'} to answer someone.`}
        </span>
      </p>
    </div>
  )
}

// ─── Visitor detail ──────────────────────────────────────────────────────────

async function VisitorDetail({ id, p }: { id: string; p: Params }) {
  const rows = (await prisma.activity.findMany({
    where: { visitorId: id },
    orderBy: { createdAt: 'asc' },
    take: 5000,
    select: SELECT,
  })) as ActivityRow[]
  const [v] = groupVisitors(rows)
  if (!v) {
    return (
      <div className="aa-card">
        <p>No activity recorded for this visitor in the last {ACTIVITY_DAYS} days.</p>
        <a className="aa-link" href={href(p, { visitor: undefined })}>← All visitors</a>
      </div>
    )
  }

  const user = v.userId
    ? await prisma.user.findUnique({
        where: { id: v.userId },
        select: {
          email: true, name: true, createdAt: true,
          subscription: { select: { plan: true, status: true } },
          events: { select: { slug: true, templateId: true, isPaid: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 20 },
        },
      })
    : null
  const users: Users = new Map(user && v.userId ? [[v.userId, { email: user.email, name: user.name }]] : [])
  const first = sourceInfo(v.context)
  const gsc = gscStatus().connected
  // Search words only for the most recent Google visits: each is one cached Search Console call.
  const googleVisits = new Set(v.sessions.filter((s) => sourceInfo(s.context).name === 'Google').slice(-6).map((s) => s.id))

  return (
    <>
      <a className="aa-link" href={href(p, { visitor: undefined })}>← All visitors</a>

      {v.bot && (
        <section className="aa-card aa-callout">
          <p className="aa-small"><strong>🤖 Likely a bot, not a person.</strong> {v.bot}. Left out of every count.</p>
        </section>
      )}

      <section className="aa-card">
        <h2>{who(v, users)}</h2>
        <dl className="aa-facts">
          <div><dt>How they found you</dt><dd><strong>{sourceOf(v.context).split(' · ')[0]}</strong> · {first.name}</dd></div>
          <div><dt>First seen</dt><dd>{when(v.first)}</dd></div>
          <div><dt>Last seen</dt><dd>{when(v.last)} ({ago(v.last)})</dd></div>
          <div><dt>Visits</dt><dd>{v.sessions.length} · {v.pages} pages</dd></div>
          <div><dt>Furthest step</dt><dd>{STAGES[v.stage]}</dd></div>
          <div><dt>First landed on</dt><dd>{pageLabel(str(v.context.landing) || '/')}</dd></div>
          <div><dt>Device</dt><dd>{String(v.context.device ?? '—')}</dd></div>
          <div><dt>Location</dt><dd>{placeOf(v.context) || '—'}</dd></div>
          <div><dt>Visitor id</dt><dd><code>{v.id}</code></dd></div>
        </dl>
        <Chips ids={v.viewed} label="Looked at" />
        <Chips ids={v.tried} label="Worked on" />
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <p className="aa-small aa-muted">
            Screen recordings: Microsoft Clarity → Recordings → Filters → Custom tags, <code>visitor</code> = <code>{v.id}</code>.
          </p>
        )}
        {first.group === 'organic' && first.name === 'Google' && !gsc && (
          <p className="aa-small aa-muted">
            Connect Search Console (Keywords tab) to see what this visitor most likely searched on Google.
          </p>
        )}
      </section>

      {user && (
        <section className="aa-card">
          <h3>Account</h3>
          <p className="aa-small">
            Signed up {when(user.createdAt)} · plan <strong>{user.subscription?.plan ?? 'none'}</strong>
            {user.subscription?.status && user.subscription.status !== 'active' ? ` (${user.subscription.status})` : ''}
          </p>
          {user.events.length ? (
            <ul className="aa-list">
              {user.events.map((e) => (
                <li key={e.slug}>
                  <a href={`/e/${e.slug}`} target="_blank" rel="noreferrer">{templateName(e.templateId)}</a>
                  <span className="aa-muted"> · {when(e.createdAt)} · {e.isPaid ? 'paid' : 'not paid'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="aa-small aa-muted">No invitations published.</p>
          )}
        </section>
      )}

      {await Promise.all(
        [...v.sessions].reverse().map(async (s, i) => {
          const seconds = (s.end.getTime() - s.start.getTime()) / 1000
          const src = sourceInfo(s.context)
          return (
            <section key={s.id} className="aa-card">
              <div className="aa-row">
                <h3>
                  Visit {v.sessions.length - i} · {when(s.start)}
                </h3>
                <span className="aa-muted aa-small">{duration(seconds)}</span>
              </div>
              <p className="aa-small aa-muted">
                {[sourceOf(s.context), String(s.context.device ?? ''), placeOf(s.context)].filter(Boolean).join(' · ')}
              </p>
              {gsc && googleVisits.has(s.id) && <LikelySearches s={s} />}
              {src.group === 'ai' && <AiVisit s={s} assistant={src.name} />}
              <p className="aa-small"><span className="aa-muted">How it ended (likely): </span><ExitBadge exit={s.exit} /></p>
              <ol className="aa-timeline">
                {s.rows.map((r, j) => {
                  const line = describe(r, j === s.rows.length - 1, r.name === 'create_start' && isGalleryStart(s.rows, j))
                  const gap = j ? (r.createdAt.getTime() - s.rows[j - 1].createdAt.getTime()) / 1000 : 0
                  return (
                    <li key={j} className={TONE[line.tone].cls}>
                      {gap >= 30 && <p className="aa-gap">… {duration(gap)} later</p>}
                      <time>{clock(r.createdAt)}</time>
                      <span className="aa-icon" aria-hidden>{line.icon}</span>
                      <span>
                        {line.text}
                        {line.detail && <span className="aa-detail">{line.detail}</span>}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        }),
      )}
    </>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────

async function Overview({ p }: { p: Params }) {
  let restrictTo: string[] | undefined
  let searchNote = ''
  if (p.q) {
    const q = p.q.trim()
    const ids = new Set<string>()
    const matches = await prisma.user.findMany({
      where: { OR: [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }] },
      select: { id: true },
      take: 20,
    })
    if (matches.length) {
      const found = await prisma.activity.findMany({
        where: { userId: { in: matches.map((m) => m.id) } },
        distinct: ['visitorId'],
        select: { visitorId: true },
        take: 50,
      })
      found.forEach((f) => ids.add(f.visitorId))
    }
    if (/^[A-Za-z0-9_-]{6,40}$/.test(q)) {
      const byId = await prisma.activity.findMany({
        where: { visitorId: { startsWith: q } },
        distinct: ['visitorId'],
        select: { visitorId: true },
        take: 20,
      })
      byId.forEach((f) => ids.add(f.visitorId))
    }
    restrictTo = Array.from(ids)
    searchNote = `${restrictTo.length} visitor${restrictTo.length === 1 ? '' : 's'} match “${q}” (all ${ACTIVITY_DAYS} days)`
  }

  const period = await loadPeriod(restrictTo ? ACTIVITY_DAYS : p.days, restrictTo)
  // A search shows whoever matches, bots and the owner included.
  const visitors = restrictTo ? [...period.people, ...period.bots, ...period.own] : period.people
  const filter = FILTERS.find((f) => f.key === p.show) ?? FILTERS[0]
  const shown = visitors.filter(filter.test).sort((a, b) => b.last.getTime() - a.last.getTime())
  const total = visitors.length

  const funnel = STAGES.map((label, i) => ({ label, count: visitors.filter((v) => v.stage >= i).length }))
  const exits = new Map<string, number>()
  for (const v of visitors) exits.set(v.exit.key, (exits.get(v.exit.key) ?? 0) + 1)
  const exitRows = Array.from(exits, ([key, count]) => ({ label: EXIT_GROUPS[key] ?? key, count })).sort((a, b) => b.count - a.count)
  const sources = sourcesTable(visitors)

  return (
    <>
      <form className="aa-search" method="GET" action="/admin/activity">
        <input type="hidden" name="token" value={p.token} />
        <input name="q" defaultValue={p.q} placeholder="Find by email, name or visitor id" aria-label="Find a visitor" />
        <button type="submit">Find</button>
        {p.q && <a className="aa-link" href={href(p, { q: undefined })}>Clear</a>}
      </form>
      {searchNote && <p className="aa-small aa-muted">{searchNote}</p>}

      <div className="aa-stats">
        {[
          { label: 'Visitors', value: total },
          { label: 'Visits', value: visitors.reduce((n, v) => n + v.sessions.length, 0) },
          { label: 'Signed in', value: visitors.filter((v) => v.userId).length },
          { label: 'Paid', value: funnel[5].count },
        ].map((s) => (
          <div key={s.label} className="aa-card aa-stat">
            <p className="aa-stat-label">{s.label}</p>
            <p className="aa-stat-value">{num(s.value)}</p>
          </div>
        ))}
      </div>
      {!restrictTo && (period.bots.length > 0 || period.own.length > 0) && (
        <p className="aa-small aa-muted">
          Not counted:{' '}
          {period.bots.length > 0 && (
            <a className="aa-link" href={href(p, { tab: 'bots' })}>{num(period.bots.length)} likely bot{period.bots.length === 1 ? '' : 's'}</a>
          )}
          {period.bots.length > 0 && period.own.length > 0 && ' · '}
          {period.own.length > 0 && `${num(period.own.length)} of your own (ADMIN_EMAILS)`}
        </p>
      )}

      {total > 0 && (
        <div className="aa-two">
          <section className="aa-card">
            <h3>How far visitors got</h3>
            <p className="aa-small aa-muted">Share of all {num(total)} visitors reaching each step</p>
            <Bars rows={funnel} total={total} />
          </section>
          <section className="aa-card">
            <h3>Why they left (likely)</h3>
            <p className="aa-small aa-muted">How each visitor&apos;s story ended — the visit they paid in, otherwise their latest visit</p>
            <Bars rows={exitRows} total={total} />
          </section>
        </div>
      )}

      {total > 0 && (
        <section className="aa-card">
          <h3>Where visitors came from</h3>
          <p className="aa-small aa-muted">
            Each visitor by their first visit. Organic search is a click on an ordinary Google result; Direct is a typed
            address, a bookmark, or a link opened in WhatsApp or another app (apps do not say where a link came from).
          </p>
          <Table head={['Source', 'Visitors', 'Opened a design', 'Builder', 'Saw price', 'Paid']}>
            {sources.map((s) => (
              <tr key={s.group}>
                <td>
                  {s.label}
                  <span className="aa-detail">{s.names.slice(0, 4).map((n) => `${n.name} ${n.count}`).join(' · ')}</span>
                </td>
                <Cell n={s.visitors} of={total} />
                <Cell n={s.design} of={s.visitors} />
                <Cell n={s.builder} of={s.visitors} />
                <Cell n={s.price} of={s.visitors} />
                <Cell n={s.paid} of={s.visitors} />
              </tr>
            ))}
          </Table>
        </section>
      )}

      <nav className="aa-pills" aria-label="Show">
        {FILTERS.map((f) => (
          <a key={f.key} className={f.key === filter.key ? 'on' : ''} href={href(p, { show: f.key })}>{f.label}</a>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className="aa-card aa-empty">
          <p>No visitors here yet.</p>
          <p className="aa-small aa-muted">Activity appears within a few seconds of someone using the site.</p>
        </div>
      ) : (
        <div className="aa-grid">
          {shown.slice(0, LIST_CAP).map((v) => <VisitorCard key={v.id} v={v} users={period.users} p={p} />)}
        </div>
      )}
      <p className="aa-small aa-muted aa-center">
        {shown.length > LIST_CAP ? `Showing the ${LIST_CAP} most recent of ${num(shown.length)} visitors · ` : ''}
        {period.capped ? `Read the latest ${num(ROW_CAP)} events only — pick a shorter range for exact totals · ` : ''}
        Times in IST · activity is kept {ACTIVITY_DAYS} days
      </p>
    </>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

/**
 * Opening the admin with the right token marks this browser as the owner's,
 * so the journal stops recording it (lib/journal.ts). Covers the owner's
 * signed-out browsing that ADMIN_EMAILS cannot catch.
 */
const MARK_OWNER = `try{localStorage.setItem('${OWNER_KEY}','1')}catch(e){}`

function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  return (
    <div className="aa">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      {token && <script dangerouslySetInnerHTML={{ __html: MARK_OWNER }} />}
      <header className="aa-top">
        <div className="aa-top-in">
          <strong>ShareInvite Admin · Visitor activity</strong>
          {token && (
            <span className="aa-top-links">
              <a href={`/admin/checkouts?token=${encodeURIComponent(token)}`}>Unpaid checkouts →</a>
              <a href={`/admin/requests?token=${encodeURIComponent(token)}`}>Custom requests →</a>
            </span>
          )}
        </div>
      </header>
      <main className="aa-main">{children}</main>
    </div>
  )
}

function Nav({ p }: { p: Params }) {
  return (
    <>
      <nav className="aa-tabs" aria-label="Sections">
        {TABS.map((t) => (
          <a key={t.key} className={!p.visitor && t.key === p.tab ? 'on' : ''} href={href(p, { tab: t.key, visitor: undefined, q: undefined, show: 'all' })}>
            {t.label}
          </a>
        ))}
      </nav>
      {!p.visitor && !p.q && (
        <nav className="aa-pills" aria-label="Time range">
          {RANGES.map((r) => (
            <a key={r.days} className={r.days === p.days ? 'on' : ''} href={href(p, { days: r.days })}>{r.label}</a>
          ))}
        </nav>
      )}
      {!p.visitor && p.tab === 'overview' && (
        <p className="aa-small aa-muted">
          This browser is marked as yours, so your own visits from it are not recorded. Open this page once on each phone
          or computer you use.
        </p>
      )}
    </>
  )
}

async function Tab({ p }: { p: Params }) {
  if (p.visitor) return VisitorDetail({ id: p.visitor, p })
  if (p.tab === 'overview') return Overview({ p })
  if (p.tab === 'keywords') return KeywordsTab({ p })
  const period = await loadPeriod(p.days)
  if (p.tab === 'builder') return <BuilderTab period={period} />
  if (p.tab === 'designs') return <DesignsTab period={period} />
  if (p.tab === 'pages') return PagesTab({ period, p })
  if (p.tab === 'problems') return <ProblemsTab period={period} p={p} />
  return BotsTab({ period, p })
}

interface PageProps {
  searchParams: Promise<{ token?: string; tab?: string; days?: string; show?: string; visitor?: string; q?: string }>
}

export default async function AdminActivityPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const secret = process.env.ADMIN_SECRET
  if (!secret || sp.token !== secret) {
    return (
      <Shell>
        <form className="aa-card aa-login" method="GET" action="/admin/activity">
          <h2>Admin sign-in</h2>
          {!secret && <p className="aa-small">Set <code>ADMIN_SECRET</code> in the environment first.</p>}
          {secret && sp.token && <p className="aa-small" style={{ color: '#9B1C1C' }}>Incorrect token. Try again.</p>}
          <input name="token" type="password" placeholder="Admin token" required autoFocus aria-label="Admin token" />
          <button type="submit">View activity</button>
        </form>
      </Shell>
    )
  }

  const days = RANGES.some((r) => r.days === Number(sp.days)) ? Number(sp.days) : 7
  const p: Params = {
    token: sp.token,
    tab: (TABS.find((t) => t.key === sp.tab)?.key ?? 'overview') as TabKey,
    days,
    show: FILTERS.some((f) => f.key === sp.show) ? sp.show! : 'all',
    visitor: sp.visitor && /^[A-Za-z0-9_-]{8,40}$/.test(sp.visitor) ? sp.visitor : undefined,
    q: sp.q?.trim().slice(0, 80) || undefined,
  }

  let body: React.ReactNode
  try {
    body = await Tab({ p })
  } catch (err) {
    // "Table does not exist" is a setup step; anything else (no database
    // configured, connection refused) is a connection problem.
    const missing = isMissingTable(err, 'Activity')
    body = (
      <div className="aa-card">
        <h3>{missing ? 'The activity table has not been created yet' : 'Could not load activity'}</h3>
        <p className="aa-small">
          {missing
            ? 'Create it once against the production database (see prisma/migrations/20261002120000_activity_journal), then reload this page.'
            : 'The database did not answer. Reload in a moment.'}
        </p>
      </div>
    )
  }
  return (
    <Shell token={p.token}>
      <Nav p={p} />
      {body}
    </Shell>
  )
}
