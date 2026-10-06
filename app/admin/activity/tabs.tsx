import { prisma } from '@/lib/db'
import { BOT_KINDS, type BotKind } from '@/lib/bots'
import { SOURCE_GROUPS, duration, pageLabel } from '@/lib/activityReport'
import {
  BUILDER_STEPS,
  builderJourneys,
  builderStops,
  designsTable,
  occasionDemand,
  pagesTable,
  problemsList,
} from '@/lib/activityInsights'
import {
  GscError,
  gscPath,
  gscProblemText,
  gscQueries,
  gscQueryPages,
  gscStatus,
  gscTotals,
  type GscRow,
} from '@/lib/searchConsole'
import { isMissingTable, type Period } from './load'
import { Bars, Cell, DAY, Empty, Table, ago, href, istDay, num, when, type Params } from './ui'

// ─── Builder ─────────────────────────────────────────────────────────────────

export function BuilderTab({ period }: { period: Period }) {
  const all = builderJourneys(period.people)
  if (!all.length) return <Empty><p>Nobody opened the builder in this period.</p></Empty>
  const phone = all.filter((j) => j.phone)
  const computer = all.filter((j) => !j.phone)
  const linked = all.filter((j) => !j.gallery)
  const gallery = all.filter((j) => j.gallery)
  const stops = builderStops(all)

  return (
    <>
      <section className="aa-card">
        <h3>How far people got in the builder</h3>
        <p className="aa-small aa-muted">
          {num(all.length)} people opened the builder. {num(linked.length)} came with a design already chosen (from a
          design page or a link), so the builder started them at step 2 · names; {num(gallery.length)} opened it without
          one and started at step 1 · choosing a design.
        </p>
        <Bars rows={BUILDER_STEPS.map((s) => ({ label: s.label, count: all.filter(s.reached).length }))} total={all.length} />
      </section>

      <section className="aa-card">
        <h3>Phone or computer</h3>
        <p className="aa-small aa-muted">Share of each group still in at every step. A gap between the two columns points at a phone-layout problem.</p>
        <Table head={['Step', `All (${all.length})`, `Phone (${phone.length})`, `Computer (${computer.length})`]}>
          {BUILDER_STEPS.map((s) => (
            <tr key={s.label}>
              <td>{s.label}</td>
              <Cell n={all.filter(s.reached).length} of={all.length} />
              <Cell n={phone.filter(s.reached).length} of={phone.length} />
              <Cell n={computer.filter(s.reached).length} of={computer.length} />
            </tr>
          ))}
        </Table>
      </section>

      <section className="aa-card">
        <h3>Where they stopped</h3>
        <p className="aa-small aa-muted">
          Each person once, at the furthest step they reached. &ldquo;Time in builder&rdquo; is the middle value for that
          group — a few seconds means they left almost as soon as it opened.
        </p>
        <Table head={['Stopped', 'People', 'On a phone', 'Time in builder']}>
          {stops.map((s) => (
            <tr key={s.label}>
              <td>{s.label}</td>
              <Cell n={s.count} of={all.length} />
              <Cell n={s.phone} of={s.count} />
              <td>{s.medianSeconds ? duration(s.medianSeconds) : '—'}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="aa-card">
        <h3>With or without a design chosen</h3>
        <Table head={['Came in', 'People', 'Got past names', 'Saw the price', 'Paid']}>
          {[
            { label: 'With a design (design page or link)', list: linked },
            { label: 'Without a design (menu or “Create”)', list: gallery },
          ].map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <Cell n={r.list.length} />
              <Cell n={r.list.filter((j) => j.passed >= 2).length} of={r.list.length} />
              <Cell n={r.list.filter((j) => j.price).length} of={r.list.length} />
              <Cell n={r.list.filter((j) => j.paid).length} of={r.list.length} />
            </tr>
          ))}
        </Table>
      </section>
    </>
  )
}

// ─── Designs ─────────────────────────────────────────────────────────────────

export function DesignsTab({ period }: { period: Period }) {
  const { rows, unseen } = designsTable(period.people)
  if (!rows.length) return <Empty><p>No design was looked at in this period.</p></Empty>
  return (
    <>
      <section className="aa-card">
        <h3>Each design, from first look to payment</h3>
        <p className="aa-small aa-muted">
          People, not clicks. &ldquo;Looked&rdquo; is its page or preview; &ldquo;Worked on&rdquo; is opening it in the
          builder (many arrive straight from a link, so it can be higher than Looked). Later columns show the share of the
          step before. Highlighted: looked at by several people, paid for by none — worth a look at its preview, price or
          builder fields.
        </p>
        <Table head={['Design', 'Price', 'Looked', 'Worked on', 'Past names', 'Saw price', 'Payment', 'Paid']}>
          {rows.map((r) => (
            <tr key={r.id} className={r.looked >= 5 && r.paid === 0 ? 'hi' : ''}>
              <td>{r.name}</td>
              <td>₹{num(r.price)}</td>
              <Cell n={r.looked} />
              <Cell n={r.opened} />
              <Cell n={r.pastNames} of={r.opened} />
              <Cell n={r.sawPrice} of={r.opened} />
              <Cell n={r.payment} of={r.sawPrice} />
              <Cell n={r.paid} of={r.sawPrice} />
            </tr>
          ))}
        </Table>
      </section>
      {unseen.length > 0 && (
        <section className="aa-card">
          <h3>No visitors in this period</h3>
          <p className="aa-small">{unseen.join(' · ')}</p>
        </section>
      )}
    </>
  )
}

// ─── Pages ───────────────────────────────────────────────────────────────────

async function topSearchesByPage(days: number): Promise<Map<string, GscRow[]> | string> {
  if (!gscStatus().connected) return 'Connect Search Console (Keywords tab) to see the Google searches behind each page.'
  try {
    const rows = await gscQueryPages(days)
    const byPage = new Map<string, GscRow[]>()
    for (const r of rows) {
      const path = gscPath(r.keys[1])
      byPage.set(path, [...(byPage.get(path) ?? []), r])
    }
    byPage.forEach((list) => list.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions))
    return byPage
  } catch (err) {
    return gscProblemText(err)
  }
}

export async function PagesTab({ period, p }: { period: Period; p: Params }) {
  const rows = pagesTable(period.people).slice(0, 60)
  if (!rows.length) return <Empty><p>No visits in this period.</p></Empty>
  const searches = await topSearchesByPage(Math.max(p.days, 7))
  return (
    <>
      <section className="aa-card">
        <h3>Pages people arrive on</h3>
        <p className="aa-small aa-muted">
          Every visit counted on the page it started on. Pages that bring readers who leave are fine for awareness; pages
          that lead to the builder and to payments are the ones to grow.
          {typeof searches === 'string' ? ` ${searches}` : ' Under each page: the Google searches that brought clicks to it.'}
        </p>
        <Table head={['Page', 'Visits', 'Left at once', 'Opened a design', 'Builder', 'Saw price', 'Paid']}>
          {rows.map((r) => {
            const top = typeof searches === 'string' ? [] : (searches.get(r.path) ?? []).slice(0, 3)
            return (
              <tr key={r.path} className={r.paid > 0 ? 'good' : ''}>
                <td>
                  <a href={r.path} target="_blank" rel="noreferrer" className="aa-link">{r.label}</a>
                  <span className="aa-detail">
                    {r.sources.slice(0, 3).map((s) => `${SOURCE_GROUPS[s.group]} ${s.count}`).join(' · ')}
                  </span>
                  {top.length > 0 && (
                    <span className="aa-detail">🔎 {top.map((q) => `“${q.keys[0]}”${q.clicks ? ` (${q.clicks})` : ''}`).join(', ')}</span>
                  )}
                </td>
                <Cell n={r.visits} />
                <Cell n={r.bounced} of={r.visits} />
                <Cell n={r.design} of={r.visits} />
                <Cell n={r.builder} of={r.visits} />
                <Cell n={r.price} />
                <Cell n={r.paid} />
              </tr>
            )
          })}
        </Table>
      </section>
    </>
  )
}

// ─── Keywords ────────────────────────────────────────────────────────────────

export function SearchConsoleSetup() {
  const status = gscStatus()
  return (
    <section className="aa-card">
      <h3>Connect Google Search Console</h3>
      <p className="aa-small">
        Google never tells a website what one person typed. Search Console is the only place the search words exist — as
        totals for each page and day. Once connected, this tab shows every search you appear for, and each Google visitor
        shows the searches that most likely brought them.
      </p>
      {status.problem === 'bad-key' && <p className="aa-small aa-bad-text">GSC_SERVICE_ACCOUNT is set but is not a valid service account JSON key.</p>}
      <ol className="aa-steps">
        <li>Open <strong>console.cloud.google.com</strong>, create a project (any name), then APIs &amp; Services → Library → <strong>Google Search Console API</strong> → Enable.</li>
        <li>APIs &amp; Services → Credentials → Create credentials → <strong>Service account</strong> (any name, no roles needed). Open it → Keys → Add key → <strong>JSON</strong>. A file downloads.</li>
        <li>In <strong>Search Console</strong> → Settings → Users and permissions → Add user: paste the service account&apos;s email (it ends in <code>.iam.gserviceaccount.com</code>), permission <strong>Restricted</strong>.</li>
        <li>In <strong>Vercel</strong> → Project → Settings → Environment Variables: add <code>GSC_SERVICE_ACCOUNT</code> with the whole contents of the JSON file, then redeploy.</li>
      </ol>
      <p className="aa-small aa-muted">Read-only access. Answers are cached for six hours; nothing is stored in your database.</p>
    </section>
  )
}

export async function KeywordsTab({ p }: { p: Params }) {
  if (!gscStatus().connected) return <SearchConsoleSetup />
  // Search Console runs a day or two behind, so "Today" alone would be empty.
  const days = Math.max(p.days, 7)
  let totals: GscRow | null
  let queries: GscRow[]
  let pairs: GscRow[]
  try {
    ;[totals, queries, pairs] = await Promise.all([gscTotals(days), gscQueries(days), gscQueryPages(days)])
  } catch (err) {
    return (
      <section className="aa-card">
        <h3>Search Console</h3>
        <p className="aa-small">{gscProblemText(err)}</p>
        {err instanceof GscError && err.problem !== 'failed' && <SearchConsoleSetup />}
      </section>
    )
  }

  // The page that shows most for each search.
  const pageOf = new Map<string, { path: string; impressions: number }>()
  for (const r of pairs) {
    const best = pageOf.get(r.keys[0])
    if (!best || r.impressions > best.impressions) pageOf.set(r.keys[0], { path: gscPath(r.keys[1]), impressions: r.impressions })
  }
  const list = queries.map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }))
  const occasions = occasionDemand(list)
  const almost = list.filter((q) => q.position > 7 && q.position <= 20 && q.impressions >= 10).sort((a, b) => b.impressions - a.impressions).slice(0, 30)
  const unclicked = list.filter((q) => q.position <= 7 && q.impressions >= 20 && q.ctr < 0.02).sort((a, b) => b.impressions - a.impressions).slice(0, 20)
  const top = [...list].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 150)
  const page = (q: string) => {
    const pg = pageOf.get(q)
    return pg ? <a href={pg.path} target="_blank" rel="noreferrer" className="aa-detail">{pageLabel(pg.path)}</a> : null
  }
  const rank = (n: number) => n.toFixed(1)

  return (
    <>
      <div className="aa-stats">
        {[
          { label: 'Clicks from Google', value: num(totals?.clicks ?? 0) },
          { label: 'Times shown', value: num(totals?.impressions ?? 0) },
          { label: 'Click rate', value: totals ? `${(totals.ctr * 100).toFixed(1)}%` : '—' },
          { label: 'Average rank', value: totals ? rank(totals.position) : '—' },
        ].map((s) => (
          <div key={s.label} className="aa-card aa-stat">
            <p className="aa-stat-label">{s.label}</p>
            <p className="aa-stat-value">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="aa-small aa-muted">
        Last {days} days, Google web search. Very rare searches are hidden by Google for privacy, so the rows add up to
        less than the totals.
      </p>

      <section className="aa-card">
        <h3>What people search for, by occasion</h3>
        <p className="aa-small aa-muted">
          Demand you already appear for. Many searches and few (or no) designs for an occasion is the strongest signal for
          which design to make next; a poor rank with many searches is the page to improve.
        </p>
        <Table head={['Occasion', 'Shown', 'Clicks', 'Avg rank', 'Your designs']}>
          {occasions.map((o) => (
            <tr key={o.name} className={o.designs === 0 && o.impressions > 0 ? 'hi' : ''}>
              <td>
                {o.name}
                <span className="aa-detail">{o.top.map((q) => `“${q}”`).join(', ')}</span>
              </td>
              <Cell n={o.impressions} />
              <Cell n={o.clicks} />
              <td>{rank(o.position)}</td>
              <td>{o.designs < 0 ? '—' : o.designs === 0 ? <span className="aa-tag">none yet</span> : o.designs}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="aa-card">
        <h3>Almost on page one</h3>
        <p className="aa-small aa-muted">
          You rank 8th–20th for these and people see you. Moving them into the top five is usually the cheapest new
          traffic: improve the page shown, add these words to its title and headings, and link to it from related pages.
        </p>
        {almost.length ? (
          <Table head={['Search', 'Shown', 'Clicks', 'Rank']}>
            {almost.map((q) => (
              <tr key={q.query}>
                <td>{q.query}{page(q.query)}</td>
                <Cell n={q.impressions} />
                <Cell n={q.clicks} />
                <td>{rank(q.position)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <p className="aa-small">None in this period.</p>
        )}
      </section>

      <section className="aa-card">
        <h3>Shown near the top, rarely clicked</h3>
        <p className="aa-small aa-muted">
          You already rank well here, but people pick another result. Rewrite that page&apos;s title and description to
          match the search (a price, &ldquo;WhatsApp&rdquo;, the occasion&apos;s own word).
        </p>
        {unclicked.length ? (
          <Table head={['Search', 'Shown', 'Click rate', 'Rank']}>
            {unclicked.map((q) => (
              <tr key={q.query}>
                <td>{q.query}{page(q.query)}</td>
                <Cell n={q.impressions} />
                <td>{(q.ctr * 100).toFixed(1)}%</td>
                <td>{rank(q.position)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <p className="aa-small">None in this period.</p>
        )}
      </section>

      <section className="aa-card">
        <h3>All searches</h3>
        <p className="aa-small aa-muted">Most clicks first; the page Google showed most for each is underneath.</p>
        <Table head={['Search', 'Clicks', 'Shown', 'Click rate', 'Rank']}>
          {top.map((q) => (
            <tr key={q.query}>
              <td>{q.query}{page(q.query)}</td>
              <Cell n={q.clicks} />
              <Cell n={q.impressions} />
              <td>{(q.ctr * 100).toFixed(1)}%</td>
              <td>{rank(q.position)}</td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  )
}

// ─── Problems ────────────────────────────────────────────────────────────────

export function ProblemsTab({ period, p }: { period: Period; p: Params }) {
  const rows = problemsList(period.people)
  if (!rows.length) return <Empty><p>No errors or unresponsive buttons in this period.</p></Empty>
  return (
    <section className="aa-card">
      <h3>What went wrong for visitors</h3>
      <p className="aa-small aa-muted">
        Page errors, buttons pressed again and again with no result, and payment problems — grouped by page, most people
        affected first. Open the latest visitor to see what they were doing just before.
      </p>
      <Table head={['Problem', 'People', 'Times', 'Last']}>
        {rows.map((r) => (
          <tr key={`${r.kind}${r.path}${r.what}`}>
            <td>
              <strong>{r.kind}</strong>
              <span className="aa-detail">{r.where}{r.what ? ` · “${r.what}”` : ''}</span>
              <a className="aa-link aa-small" href={href(p, { visitor: r.lastVisitor, tab: 'overview' })}>Latest visitor →</a>
            </td>
            <Cell n={r.visitors} />
            <Cell n={r.count} />
            <td>{ago(r.last)}</td>
          </tr>
        ))}
      </Table>
    </section>
  )
}

// ─── Bots ────────────────────────────────────────────────────────────────────

const KIND_ORDER: BotKind[] = ['search', 'ai', 'preview', 'seo', 'monitor', 'other']

export async function BotsTab({ period, p }: { period: Period; p: Params }) {
  const since = istDay(new Date(Date.now() - (p.days - 1) * DAY))
  let hits: { day: string; bot: string; kind: string; path: string; hits: number; lastAt: Date }[] | null = null
  let missing = false
  try {
    hits = await prisma.botHit.findMany({ where: { day: { gte: since } }, take: 50000 })
  } catch (err) {
    missing = isMissingTable(err, 'BotHit')
    if (!missing) throw err
  }

  const byBot = new Map<string, { bot: string; kind: BotKind; hits: number; pages: Set<string>; last: Date }>()
  const byKindPage = new Map<BotKind, Map<string, number>>()
  for (const h of hits ?? []) {
    const kind = (h.kind in BOT_KINDS ? h.kind : 'other') as BotKind
    const b = byBot.get(h.bot) ?? { bot: h.bot, kind, hits: 0, pages: new Set<string>(), last: h.lastAt }
    b.hits += h.hits
    b.pages.add(h.path)
    if (h.lastAt > b.last) b.last = h.lastAt
    byBot.set(h.bot, b)
    const pages = byKindPage.get(kind) ?? new Map<string, number>()
    pages.set(h.path, (pages.get(h.path) ?? 0) + h.hits)
    byKindPage.set(kind, pages)
  }
  const bots = Array.from(byBot.values())
  const forUsers = (hits ?? []).filter((h) => /for a user/.test(h.bot))
  const askedPages = new Map<string, number>()
  forUsers.forEach((h) => askedPages.set(h.path, (askedPages.get(h.path) ?? 0) + h.hits))

  return (
    <>
      <p className="aa-small aa-muted">
        Bots do not search — they read pages. Search engines read your pages to rank them; AI assistants read them to
        answer people&apos;s questions. The searches people make are on the Keywords tab.
      </p>

      {missing && (
        <section className="aa-card">
          <h3>The bot table has not been created yet</h3>
          <p className="aa-small">
            Run prisma/migrations/20261005120000_bot_hits/migration.sql once in the Supabase SQL editor, then reload. Bots
            are counted from then on.
          </p>
        </section>
      )}

      {hits && !bots.length && <Empty><p>No bots recorded in this period yet. They appear within a few seconds of a bot reading a page.</p></Empty>}

      {askedPages.size > 0 && (
        <section className="aa-card">
          <h3>Pages AI assistants opened to answer someone</h3>
          <p className="aa-small aa-muted">
            Each of these is a person asking ChatGPT, Perplexity or Claude something, and the assistant reading your page to
            answer. These pages are your AI search presence — keep them accurate, with clear prices.
          </p>
          <Table head={['Page', 'Times']}>
            {Array.from(askedPages).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([path, n]) => (
              <tr key={path}>
                <td>{pageLabel(path)}<span className="aa-detail">{path}</span></td>
                <Cell n={n} />
              </tr>
            ))}
          </Table>
        </section>
      )}

      {KIND_ORDER.map((kind) => {
        const list = bots.filter((b) => b.kind === kind).sort((a, b) => b.hits - a.hits)
        if (!list.length) return null
        const pages = Array.from(byKindPage.get(kind) ?? []).sort((a, b) => b[1] - a[1]).slice(0, 8)
        return (
          <section key={kind} className="aa-card">
            <h3>{BOT_KINDS[kind]}</h3>
            <Table head={['Bot (by the name it gives)', 'Pages read', 'Different pages', 'Last']}>
              {list.map((b) => (
                <tr key={b.bot}>
                  <td>{b.bot}</td>
                  <Cell n={b.hits} />
                  <Cell n={b.pages.size} />
                  <td>{ago(b.last)}</td>
                </tr>
              ))}
            </Table>
            <p className="aa-small aa-muted">
              Most read: {pages.map(([path, n]) => `${pageLabel(path)} (${num(n)})`).join(' · ')}
            </p>
          </section>
        )
      })}

      <section className="aa-card">
        <h3>Likely bots among visitors</h3>
        <p className="aa-small aa-muted">
          These ran your pages like a browser, so they passed the name check, but behaved like a script. They are left out
          of every count on the other tabs. A real person who opened a link and closed it at once can look the same.
        </p>
        {period.bots.length ? (
          <Table head={['Visitor', 'Visits', 'Why']}>
            {period.bots.slice(0, 100).map((v) => (
              <tr key={v.id}>
                <td>
                  <a className="aa-link" href={href(p, { visitor: v.id, tab: 'overview' })}>Visitor {v.id.slice(0, 6)}</a>
                  <span className="aa-detail">
                    {[String(v.context.device ?? ''), [v.context.city, v.context.country].filter(Boolean).join(', '), when(v.last)].filter(Boolean).join(' · ')}
                  </span>
                </td>
                <Cell n={v.sessions.length} />
                <td className="aa-left">{v.bot}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <p className="aa-small">None in this period.</p>
        )}
      </section>
      <p className="aa-small aa-muted aa-center">
        A bot&apos;s name is its own claim — anyone can call a script &ldquo;Googlebot&rdquo;.
      </p>
    </>
  )
}
