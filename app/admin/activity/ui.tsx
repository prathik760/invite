import { templateName, type Exit, type Tone, type Visitor } from '@/lib/activityReport'

/** Shared pieces of /admin/activity: addresses, formatting and small components. */

export const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'builder', label: 'Builder' },
  { key: 'designs', label: 'Designs' },
  { key: 'pages', label: 'Pages' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'problems', label: 'Problems' },
  { key: 'bots', label: 'Bots' },
] as const
export type TabKey = (typeof TABS)[number]['key']

export type Params = { token: string; tab: TabKey; days: number; show: string; visitor?: string; q?: string }

export function href(p: Params, change: Partial<Params> = {}) {
  const next = { ...p, ...change }
  const qs = new URLSearchParams({ token: next.token })
  if (next.tab !== 'overview') qs.set('tab', next.tab)
  if (next.days !== 7) qs.set('days', String(next.days))
  if (next.show !== 'all') qs.set('show', next.show)
  if (next.visitor) qs.set('visitor', next.visitor)
  if (next.q) qs.set('q', next.q)
  return `/admin/activity?${qs}`
}

export const DAY = 24 * 60 * 60 * 1000

const ist = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...o })
export const when = (d: Date) => ist(d, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
export const clock = (d: Date) => ist(d, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
export const istDay = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
export function ago(d: Date) {
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return when(d)
}

export const num = (n: number) => n.toLocaleString('en-IN')
export const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '—')

export const TONE: Record<Tone, { mark: string; cls: string }> = {
  good: { mark: '✓', cls: 'good' },
  warn: { mark: '!', cls: 'warn' },
  bad: { mark: '✕', cls: 'bad' },
  neutral: { mark: '•', cls: 'neutral' },
}

export function ExitBadge({ exit, prefix }: { exit: Exit; prefix?: string }) {
  const t = TONE[exit.tone]
  return (
    <span className={`aa-exit ${t.cls}`}>
      <span aria-hidden>{t.mark}</span> {prefix}
      {exit.label}
    </span>
  )
}

export function Bars({ rows, total }: { rows: { label: string; count: number }[]; total: number }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <ul className="aa-bars">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${num(r.count)} of ${num(total)}`}>
          <span className="aa-bar-label">{r.label}</span>
          <span className="aa-bar-track">
            {r.count > 0 && <span className="aa-bar" style={{ width: `${(r.count / max) * 100}%` }} />}
          </span>
          <span className="aa-bar-value">
            {num(r.count)}
            <span className="aa-muted"> · {total ? Math.round((r.count / total) * 100) : 0}%</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Chips({ ids, label }: { ids: string[]; label: string }) {
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

export type Users = Map<string, { email: string; name: string | null }>

export function who(v: Visitor, users: Users) {
  const u = v.userId ? users.get(v.userId) : undefined
  return u ? (u.name ? `${u.name} · ${u.email}` : u.email) : `Visitor ${v.id.slice(0, 6)}`
}

/** A table that scrolls sideways on a phone instead of widening the page. */
export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="aa-scroll">
      <table className="aa-table">
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

/** A count with its share of a total underneath: "12 · 40%". */
export function Cell({ n, of }: { n: number; of?: number }) {
  return (
    <td>
      {num(n)}
      {of !== undefined && <span className="aa-of">{pct(n, of)}</span>}
    </td>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="aa-card aa-empty">{children}</div>
}
