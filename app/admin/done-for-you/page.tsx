import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { ADMIN_CSS } from '../styles'
import { getTemplateData } from '@/modules/templates/data'
import { displayName } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'
import { isRecord, updateRequest, type DfyRecord } from '@/lib/doneForYou'
import { DFY_PREFIX, DFY_STATUS_LABEL, dfyCustomerPath, dfyQuestions, isRowField, type DfyStatus } from '@/lib/doneForYouShared'

/**
 * /admin/done-for-you: requests from "Our team fills it in" (components/create/DoneForYouForm).
 *
 * Each card has what the customer told us, a WhatsApp link to them, and "Open in builder", which
 * opens the builder already filled in with their answers and a "Save for customer" button. Saving
 * gives the link to send them; they publish (and pay) from it. Publishing marks the request done.
 */

export const metadata: Metadata = {
  title: { absolute: 'Admin — Done for you | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const CSS = `
.df-badge{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.df-new{background:#FEF3C7;color:#92400E}.df-working{background:#DBEAFE;color:#1E40AF}.df-ready{background:#E0E7FF;color:#3730A3}
.df-published{background:#DCFCE7;color:#166534}.df-closed{background:#F3F4F6;color:#4B5563}
.df-table{border-collapse:collapse;width:100%;font-size:13px}
.df-table td{padding:5px 10px 5px 0;vertical-align:top}
.df-table td:first-child{color:#7A6E68;white-space:nowrap;width:1%}
.df-table td:last-child{white-space:pre-wrap;word-break:break-word}
.df-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.df-btn{padding:8px 14px;border-radius:10px;border:0;font:inherit;font-weight:700;cursor:pointer;text-decoration:none;font-size:13px;display:inline-block}
.df-open{background:#0B4A34;color:#fff}.df-wa{background:#1DA851;color:#fff}.df-soft{background:#F3EDE7;color:#4A403B}
.df-link{font-family:Menlo,Consolas,monospace;font-size:11.5px;word-break:break-all;color:#7A6E68}
.df-counts{display:flex;gap:8px;flex-wrap:wrap}
`

const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '—'

async function setStatus(formData: FormData) {
  'use server'
  const secret = process.env.ADMIN_SECRET
  if (!secret || formData.get('token') !== secret) return
  const reqToken = String(formData.get('request') ?? '')
  const status = String(formData.get('status') ?? '') as DfyStatus
  if (!reqToken || !(status in DFY_STATUS_LABEL)) return
  await updateRequest(reqToken, (r) => ({ ...r, status }))
  revalidatePath('/admin/done-for-you')
}

function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  const q = token ? `?token=${encodeURIComponent(token)}` : ''
  return (
    <div className="aa">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + CSS }} />
      <header className="aa-top">
        <div className="aa-top-in">
          <strong>ShareInvite Admin · Done for you</strong>
          {token && (
            <span className="aa-top-links">
              <a href={`/admin/requests${q}`}>Custom requests →</a>
              <a href={`/admin/checkouts${q}`}>Unpaid checkouts →</a>
              <a href={`/admin/activity${q}`}>Visitor activity →</a>
            </span>
          )}
        </div>
      </header>
      <main className="aa-main">{children}</main>
    </div>
  )
}

interface Item {
  token: string
  templateId: string
  rec: DfyRecord
}

function Card({ item, token, origin }: { item: Item; token: string; origin: string }) {
  const { rec, templateId } = item
  const t = getTemplateData(templateId)
  const rows: [string, string][] = []
  if (t) {
    for (const f of dfyQuestions(t.config.fields)) {
      const v = isRowField(f) ? rec.extras[f.key] : rec.fields[f.key]
      if (v) rows.push([f.label, v])
    }
  }
  if (rec.notes) rows.push(['Anything else', rec.notes])
  const customerLink = `${origin}${dfyCustomerPath(item.token)}`
  const builderLink = `${dfyCustomerPath(item.token)}#team=${encodeURIComponent(rec.teamKey)}`
  const first = rec.contact.name.split(/\s+/)[0]
  const design = t ? displayName(t.name) : templateId
  const wa = (text: string) => `https://wa.me/${rec.contact.phone}?text=${encodeURIComponent(text)}`
  const next: { label: string; status: DfyStatus }[] = (
    [
      { label: 'Working on it', status: 'working' },
      { label: 'Link sent', status: 'ready' },
      { label: 'Published', status: 'published' },
      { label: 'Close', status: 'closed' },
      { label: 'Reopen', status: 'new' },
    ] as const
  ).filter((a) => a.status !== rec.status && !(a.status === 'new' && rec.status !== 'closed'))

  return (
    <div className="aa-card">
      <div className="aa-row">
        <h3>#{rec.ref} · {design}{t ? ` · ₹${templatePrice(templateId).toLocaleString('en-IN')}` : ''}</h3>
        <span className={`df-badge df-${rec.status}`}>{DFY_STATUS_LABEL[rec.status]}</span>
      </div>
      <p className="aa-small">
        <strong>{rec.contact.name}</strong> · <a href={wa(`Hi ${first}, this is ShareInvite about your ${design} invitation (request #${rec.ref}). `)} target="_blank" rel="noopener noreferrer">WhatsApp +{rec.contact.phone}</a>
        {rec.contact.email ? <> · <a href={`mailto:${rec.contact.email}`}>{rec.contact.email}</a></> : null}
        <span className="aa-muted"> · sent {when(rec.submittedAt)}{rec.savedAt ? ` · saved ${when(rec.savedAt)}` : ''}</span>
      </p>
      {rows.length > 0 ? (
        <table className="df-table"><tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
      ) : (
        <p className="aa-small aa-muted">No details yet: ask them on WhatsApp.</p>
      )}
      {rec.publishedSlug && <p className="aa-small">Published: <a href={`/e/${rec.publishedSlug}`} target="_blank" rel="noopener noreferrer">/e/{rec.publishedSlug}</a></p>}
      <div className="df-actions">
        <a className="df-btn df-open" href={builderLink} target="_blank" rel="noopener noreferrer">Open in builder</a>
        {rec.savedAt && (
          <a className="df-btn df-wa" href={wa(`Hi ${first}, your ${design} invitation is ready: ${customerLink}\n\nOpen it to see the whole invitation, change anything you like, and publish it when you are happy. Any questions, just reply here.`)} target="_blank" rel="noopener noreferrer">
            Send them the link
          </a>
        )}
        <form action={setStatus} className="df-actions">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="request" value={item.token} />
          {next.map((a) => <button key={a.status} type="submit" name="status" value={a.status} className="df-btn df-soft">{a.label}</button>)}
        </form>
      </div>
      <p className="df-link">Customer link: {customerLink}</p>
    </div>
  )
}

export default async function AdminDoneForYouPage({ searchParams }: { searchParams: { token?: string; show?: string } }) {
  const secret = process.env.ADMIN_SECRET
  const token = searchParams.token
  if (!secret || token !== secret) {
    return (
      <Shell>
        <form className="aa-card aa-login" method="GET" action="/admin/done-for-you">
          <h2>Admin sign-in</h2>
          {!secret && <p className="aa-small">Set <code>ADMIN_SECRET</code> in the environment first.</p>}
          {secret && token && <p className="aa-small" style={{ color: '#9B1C1C' }}>Incorrect token. Try again.</p>}
          <input name="token" type="password" placeholder="Admin token" required autoFocus aria-label="Admin token" />
          <button type="submit">View requests</button>
        </form>
      </Shell>
    )
  }

  let items: Item[] = []
  try {
    const events = await prisma.event.findMany({
      where: { slug: { startsWith: DFY_PREFIX } },
      orderBy: { createdAt: 'desc' },
      take: 300,
      select: { slug: true, templateId: true, data: true },
    })
    items = events.flatMap((e) => (isRecord(e.data) ? [{ token: e.slug.slice(DFY_PREFIX.length), templateId: e.templateId, rec: e.data }] : []))
  } catch (err) {
    console.error('[admin/done-for-you]', err instanceof Error ? err.message : err)
  }

  const showAll = searchParams.show === 'all'
  const open = items.filter((i) => i.rec.status !== 'closed' && i.rec.status !== 'published')
  const shown = showAll ? items : open
  const counts = (Object.keys(DFY_STATUS_LABEL) as DfyStatus[]).map((s) => [s, items.filter((i) => i.rec.status === s).length] as const)
  const origin = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
  const q = `?token=${encodeURIComponent(token)}`

  return (
    <Shell token={token}>
      <div className="aa-row">
        <h2>Done-for-you requests</h2>
        <a className="aa-link" href={`/admin/done-for-you${q}${showAll ? '' : '&show=all'}`}>{showAll ? 'Show open only' : `Show all (${items.length})`}</a>
      </div>
      <div className="df-counts">
        {counts.map(([s, n]) => <span key={s} className={`df-badge df-${s}`}>{DFY_STATUS_LABEL[s]}: {n}</span>)}
      </div>
      <p className="aa-small aa-muted">
        Open in builder: their answers are filled in. Add photos and anything from their notes, press Save for customer, then send them the link. They check it and publish (and pay) themselves.
      </p>
      {shown.length === 0 ? (
        <div className="aa-card aa-center"><p className="aa-small aa-muted">{items.length ? 'No open requests.' : 'No requests yet.'}</p></div>
      ) : (
        shown.map((item) => <Card key={item.token} item={item} token={token} origin={origin} />)
      )}
    </Shell>
  )
}
