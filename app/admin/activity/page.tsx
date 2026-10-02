import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { ACTIVITY_DAYS } from '@/lib/retention'
import {
  EXIT_GROUPS,
  STAGES,
  describe,
  duration,
  groupVisitors,
  placeOf,
  sourceOf,
  templateName,
  type ActivityRow,
  type Exit,
  type Tone,
  type Visitor,
} from '@/lib/activityReport'

export const metadata: Metadata = {
  title: { absolute: 'Admin — Visitor activity | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const DAY = 24 * 60 * 60 * 1000
/** Rows read for the overview. Enough for tens of thousands of visits; the page says when it is reached. */
const ROW_CAP = 40000
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
  { key: 'builder', label: 'Started the builder', test: (v) => v.stage >= 2 },
  { key: 'payment', label: 'Reached payment', test: (v) => v.stage >= 4 },
  { key: 'paid', label: 'Paid', test: (v) => v.stage >= 5 },
  { key: 'problem', label: 'Had a problem', test: (v) => v.errors > 0 },
]

type Params = { token: string; days: number; show: string; visitor?: string; q?: string }

function href(p: Params, change: Partial<Params> = {}) {
  const next = { ...p, ...change }
  const qs = new URLSearchParams({ token: next.token })
  if (next.days !== 7) qs.set('days', String(next.days))
  if (next.show !== 'all') qs.set('show', next.show)
  if (next.visitor) qs.set('visitor', next.visitor)
  if (next.q) qs.set('q', next.q)
  return `/admin/activity?${qs}`
}

const ist = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...o })
const when = (d: Date) => ist(d, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const clock = (d: Date) => ist(d, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
function ago(d: Date) {
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return when(d)
}

const TONE: Record<Tone, { mark: string; cls: string }> = {
  good: { mark: '✓', cls: 'good' },
  warn: { mark: '!', cls: 'warn' },
  bad: { mark: '✕', cls: 'bad' },
  neutral: { mark: '•', cls: 'neutral' },
}

const SELECT = { visitorId: true, sessionId: true, userId: true, name: true, path: true, data: true, createdAt: true } as const

// ─── Pieces ──────────────────────────────────────────────────────────────────

function ExitBadge({ exit }: { exit: Exit }) {
  const t = TONE[exit.tone]
  return (
    <span className={`aa-exit ${t.cls}`}>
      <span aria-hidden>{t.mark}</span> {exit.label}
    </span>
  )
}

function Bars({ rows, total }: { rows: { label: string; count: number }[]; total: number }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <ul className="aa-bars">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.count.toLocaleString('en-IN')} of ${total.toLocaleString('en-IN')}`}>
          <span className="aa-bar-label">{r.label}</span>
          <span className="aa-bar-track">
            {r.count > 0 && <span className="aa-bar" style={{ width: `${(r.count / max) * 100}%` }} />}
          </span>
          <span className="aa-bar-value">
            {r.count.toLocaleString('en-IN')}
            <span className="aa-muted"> · {total ? Math.round((r.count / total) * 100) : 0}%</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function Chips({ ids, label }: { ids: string[]; label: string }) {
  if (!ids.length) return null
  return (
    <p className="aa-chips">
      <span className="aa-muted">{label}</span>
      {ids.slice(0, 5).map((id) => (
        <span key={id} className="aa-chip">{templateName(id)}</span>
      ))}
      {ids.length > 5 && <span className="aa-muted">+{ids.length - 5} more</span>}
    </p>
  )
}

function who(v: Visitor, users: Map<string, { email: string; name: string | null }>) {
  const u = v.userId ? users.get(v.userId) : undefined
  return u ? (u.name ? `${u.name} · ${u.email}` : u.email) : `Visitor ${v.id.slice(0, 6)}`
}

function VisitorCard({ v, users, p }: { v: Visitor; users: Map<string, { email: string; name: string | null }>; p: Params }) {
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
      <Chips ids={v.tried} label="Tried" />
      <div className="aa-row">
        <ExitBadge exit={v.exit} />
        <span className="aa-link">Full history →</span>
      </div>
    </a>
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
  const users = new Map(user && v.userId ? [[v.userId, { email: user.email, name: user.name }]] : [])

  return (
    <>
      <a className="aa-link" href={href(p, { visitor: undefined })}>← All visitors</a>

      <section className="aa-card">
        <h2>{who(v, users)}</h2>
        <dl className="aa-facts">
          <div><dt>First seen</dt><dd>{when(v.first)}</dd></div>
          <div><dt>Last seen</dt><dd>{when(v.last)} ({ago(v.last)})</dd></div>
          <div><dt>Visits</dt><dd>{v.sessions.length} · {v.pages} pages</dd></div>
          <div><dt>Furthest step</dt><dd>{STAGES[v.stage]}</dd></div>
          <div><dt>First came from</dt><dd>{sourceOf(v.context)}</dd></div>
          <div><dt>Device</dt><dd>{String(v.context.device ?? '—')}</dd></div>
          <div><dt>Location</dt><dd>{placeOf(v.context) || '—'}</dd></div>
          <div><dt>Visitor id</dt><dd><code>{v.id}</code></dd></div>
        </dl>
        <Chips ids={v.viewed} label="Looked at" />
        <Chips ids={v.tried} label="Tried" />
        <p className="aa-small aa-muted">
          To watch this visitor&apos;s screen recordings: in Microsoft Clarity → Recordings → Filters → Custom tags,
          choose <code>visitor</code> = <code>{v.id}</code>.
        </p>
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

      {[...v.sessions].reverse().map((s, i) => {
        const seconds = (s.end.getTime() - s.start.getTime()) / 1000
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
            <p className="aa-small"><span className="aa-muted">How it ended (likely): </span><ExitBadge exit={s.exit} /></p>
            <ol className="aa-timeline">
              {s.rows.map((r, j) => {
                const line = describe(r, j === s.rows.length - 1)
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
      })}
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

  const since = new Date(Date.now() - (restrictTo ? ACTIVITY_DAYS : p.days) * DAY)
  const raw = restrictTo?.length === 0
    ? []
    : ((await prisma.activity.findMany({
        where: { createdAt: { gte: since }, ...(restrictTo ? { visitorId: { in: restrictTo } } : {}) },
        orderBy: { createdAt: 'desc' },
        take: ROW_CAP,
        select: SELECT,
      })) as ActivityRow[])
  const capped = raw.length === ROW_CAP
  const visitors = groupVisitors(raw)

  const userIds = Array.from(new Set(visitors.map((v) => v.userId).filter((x): x is string => Boolean(x))))
  const users = new Map(
    (userIds.length
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, name: true } })
      : []
    ).map((u) => [u.id, { email: u.email, name: u.name }]),
  )

  const filter = FILTERS.find((f) => f.key === p.show) ?? FILTERS[0]
  const shown = visitors.filter(filter.test)
  const total = visitors.length

  const funnel = STAGES.map((label, i) => ({ label, count: visitors.filter((v) => v.stage >= i).length }))
  const exits = new Map<string, number>()
  for (const v of visitors) exits.set(v.exit.key, (exits.get(v.exit.key) ?? 0) + 1)
  const exitRows = Array.from(exits, ([key, count]) => ({ label: EXIT_GROUPS[key] ?? key, count })).sort((a, b) => b.count - a.count)

  return (
    <>
      <form className="aa-search" method="GET" action="/admin/activity">
        <input type="hidden" name="token" value={p.token} />
        <input name="q" defaultValue={p.q} placeholder="Find by email, name or visitor id" aria-label="Find a visitor" />
        <button type="submit">Find</button>
        {p.q && <a className="aa-link" href={href(p, { q: undefined })}>Clear</a>}
      </form>

      {!p.q && (
        <nav className="aa-pills" aria-label="Time range">
          {RANGES.map((r) => (
            <a key={r.days} className={r.days === p.days ? 'on' : ''} href={href(p, { days: r.days })}>{r.label}</a>
          ))}
        </nav>
      )}
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
            <p className="aa-stat-value">{s.value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="aa-two">
          <section className="aa-card">
            <h3>How far visitors got</h3>
            <p className="aa-small aa-muted">Share of all {total.toLocaleString('en-IN')} visitors reaching each step</p>
            <Bars rows={funnel} total={total} />
          </section>
          <section className="aa-card">
            <h3>Why they left (likely)</h3>
            <p className="aa-small aa-muted">How each visitor&apos;s latest visit ended, read from their last actions</p>
            <Bars rows={exitRows} total={total} />
          </section>
        </div>
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
          {shown.slice(0, LIST_CAP).map((v) => <VisitorCard key={v.id} v={v} users={users} p={p} />)}
        </div>
      )}
      <p className="aa-small aa-muted aa-center">
        {shown.length > LIST_CAP ? `Showing the ${LIST_CAP} most recent of ${shown.length.toLocaleString('en-IN')} visitors · ` : ''}
        {capped ? `Read the latest ${ROW_CAP.toLocaleString('en-IN')} events only — pick a shorter range for exact totals · ` : ''}
        Times in IST · activity is kept {ACTIVITY_DAYS} days
      </p>
    </>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CSS = `
.aa{min-height:100dvh;background:#FFFCF8;color:#1E2726;font-family:var(--font-sans,system-ui,sans-serif);font-size:14px;line-height:1.5}
.aa-top{background:#052E20;color:#fff;padding:14px 16px}
.aa-top-in,.aa-main{max-width:1040px;margin:0 auto}
.aa-top-in{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.aa-top a{color:rgba(255,255,255,.7);font-size:13px;text-decoration:none}
.aa-main{padding:20px 16px 48px;display:flex;flex-direction:column;gap:14px}
.aa h2{font-size:20px;font-weight:700;margin:0 0 10px}
.aa h3{font-size:15px;font-weight:700;margin:0}
.aa-card{background:#fff;border:1px solid rgba(44,32,28,.09);border-radius:14px;padding:16px;box-shadow:0 2px 6px rgba(44,32,28,.04);display:flex;flex-direction:column;gap:8px;min-width:0}
.aa-row{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.aa-muted{color:#7A6E68}
.aa-small{font-size:12.5px;margin:0}
.aa-center{text-align:center}
.aa-link{color:#0B4A34;font-weight:600;text-decoration:none;font-size:13px}
.aa-visitor{text-decoration:none;color:inherit}
.aa-visitor:hover{border-color:rgba(11,74,52,.35)}
.aa-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.aa-two{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
.aa-stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.aa-stat{gap:2px}
.aa-stat-label{font-size:11px;color:#7A6E68;letter-spacing:.04em;text-transform:uppercase;margin:0}
.aa-stat-value{font-size:26px;font-weight:700;margin:0}
.aa-pills{display:flex;gap:8px;flex-wrap:wrap}
.aa-pills a{padding:6px 12px;border-radius:99px;border:1px solid rgba(44,32,28,.14);background:#fff;color:#4A403B;text-decoration:none;font-size:13px}
.aa-pills a.on{background:#0B4A34;border-color:#0B4A34;color:#fff}
.aa-search{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.aa-search input[name=q]{flex:1 1 220px;padding:10px 12px;border-radius:10px;border:1.5px solid rgba(44,32,28,.16);font:inherit;background:#fff;min-width:0}
.aa-search button{padding:10px 16px;border-radius:10px;border:0;background:#0B4A34;color:#fff;font-weight:700;font:inherit;cursor:pointer}
.aa-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0;font-size:12.5px}
.aa-chip{background:#F6F0E8;border-radius:99px;padding:2px 9px}
.aa-exit{display:inline-flex;gap:6px;align-items:baseline;border-radius:8px;padding:3px 9px;font-size:12.5px;font-weight:600}
.aa-exit.good{background:#F0FDF4;color:#166534}.aa-exit.warn{background:#FFFBEB;color:#92400E}
.aa-exit.bad{background:#FEF2F2;color:#9B1C1C}.aa-exit.neutral{background:#F3F4F6;color:#374151}
.aa-bars{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}
.aa-bars li{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(60px,1fr) auto;gap:10px;align-items:center;font-size:13px}
.aa-bar-label{overflow-wrap:anywhere}
.aa-bar-track{display:block;height:12px}
.aa-bar{display:block;height:12px;min-width:2px;background:#0B4A34;border-radius:0 4px 4px 0}
.aa-bar-value{font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}
.aa-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px 16px;margin:0}
.aa-facts dt{font-size:11px;color:#7A6E68;text-transform:uppercase;letter-spacing:.04em}
.aa-facts dd{margin:0;overflow-wrap:anywhere}
.aa code{background:#F3EDE7;padding:1px 5px;border-radius:4px;font-size:12px;overflow-wrap:anywhere}
.aa-list{margin:0;padding-left:18px}
.aa-list a{color:#0B4A34}
.aa-timeline{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column}
.aa-timeline li{display:grid;grid-template-columns:86px 22px minmax(0,1fr);gap:6px;padding:6px 0;border-top:1px solid rgba(44,32,28,.06);align-items:baseline}
.aa-timeline li.bad{background:#FEF7F7}.aa-timeline li.warn{background:#FFFCF2}.aa-timeline li.good{background:#F6FDF8}
.aa-timeline time{font-variant-numeric:tabular-nums;color:#7A6E68;font-size:12px;white-space:nowrap}
.aa-detail{display:block;color:#7A6E68;font-size:12px;overflow-wrap:anywhere}
.aa-gap{grid-column:1/-1;margin:0 0 2px;color:#A39890;font-size:11.5px}
.aa-empty{align-items:center;text-align:center;padding:40px 16px}
.aa-login{max-width:380px;margin:12vh auto 0}
.aa-login input{padding:11px 14px;border-radius:10px;border:1.5px solid rgba(44,32,28,.16);font:inherit}
.aa-login button{padding:12px;border-radius:10px;border:0;background:linear-gradient(135deg,#0B4A34,#A47945);color:#fff;font-weight:700;font:inherit;cursor:pointer}
`

function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  return (
    <div className="aa">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="aa-top">
        <div className="aa-top-in">
          <strong>ShareInvite Admin · Visitor activity</strong>
          {token && <a href={`/admin/requests?token=${encodeURIComponent(token)}`}>Custom requests →</a>}
        </div>
      </header>
      <main className="aa-main">{children}</main>
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ token?: string; days?: string; show?: string; visitor?: string; q?: string }>
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
    days,
    show: FILTERS.some((f) => f.key === sp.show) ? sp.show! : 'all',
    visitor: sp.visitor && /^[A-Za-z0-9_-]{8,40}$/.test(sp.visitor) ? sp.visitor : undefined,
    q: sp.q?.trim().slice(0, 80) || undefined,
  }

  try {
    return <Shell token={p.token}>{p.visitor ? await VisitorDetail({ id: p.visitor, p }) : await Overview({ p })}</Shell>
  } catch (err) {
    // P2021 is Prisma's "table does not exist"; anything else (no database
    // configured, connection refused) is a connection problem, not a setup step.
    const missing = (err as { code?: string })?.code === 'P2021' || (err instanceof Error && /relation "?Activity"? does not exist/i.test(err.message))
    return (
      <Shell token={p.token}>
        <div className="aa-card">
          <h3>{missing ? 'The activity table has not been created yet' : 'Could not load activity'}</h3>
          <p className="aa-small">
            {missing
              ? 'Create it once against the production database (see prisma/migrations/20261002120000_activity_journal), then reload this page.'
              : 'The database did not answer. Reload in a moment.'}
          </p>
        </div>
      </Shell>
    )
  }
}
