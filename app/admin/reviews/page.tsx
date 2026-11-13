import type { Metadata } from 'next'
import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/db'
import { ADMIN_CSS } from '../styles'
import { designNameOf, isMissingReviewTable, REVIEWS_TAG, reviewUrl, whatsappAsk } from '@/lib/reviews'
import { eventTitle } from '@/lib/inviteCardText'
import { templateSeoSlug } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Admin — Reviews | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const DAY = 24 * 60 * 60 * 1000
/** Hosts not yet answered are listed this long after they were asked. */
const ASKED_SHOWN_DAYS = 45

const CSS = `
.rv-stars{color:#B8913F;font-size:16px;letter-spacing:1px}
.rv-text{white-space:pre-wrap;margin:0}
.rv-actions{display:flex;gap:8px;flex-wrap:wrap}
.rv-actions button,.rv-wa{padding:8px 14px;border-radius:10px;border:0;font:inherit;font-weight:700;cursor:pointer;text-decoration:none;font-size:13px}
.rv-ok{background:#0B4A34;color:#fff}
.rv-no{background:#F3EDE7;color:#4A403B}
.rv-wa{background:#1DA851;color:#fff;display:inline-block}
.rv-link{font-family:Menlo,Consolas,monospace;font-size:11.5px;word-break:break-all;color:#7A6E68}
`

const when = (d: Date | null) =>
  d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '—'

/** "98765 43210", "+91-98765-43210" → "919876543210", for wa.me. */
function waNumber(raw?: string): string | null {
  let d = (raw || '').replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  if (d.length === 10) d = `91${d}`
  return d.length >= 11 && d.length <= 15 ? d : null
}

/** Approves, hides or brings back a review, then refreshes every page that shows reviews. */
async function setStatus(formData: FormData) {
  'use server'
  const secret = process.env.ADMIN_SECRET
  if (!secret || formData.get('token') !== secret) return
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || !['approved', 'hidden', 'submitted'].includes(status)) return
  const review = await prisma.review.findUnique({ where: { id }, select: { publish: true, templateId: true } })
  // Never shown without the host's permission.
  if (!review || (status === 'approved' && !review.publish)) return
  await prisma.review.update({ where: { id }, data: { status } })
  revalidateTag(REVIEWS_TAG)
  revalidatePath('/')
  revalidatePath(`/templates/${templateSeoSlug(review.templateId)}`)
  revalidatePath('/admin/reviews')
}

function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  const q = token ? `?token=${encodeURIComponent(token)}` : ''
  return (
    <div className="aa">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + CSS }} />
      <header className="aa-top">
        <div className="aa-top-in">
          <strong>ShareInvite Admin · Reviews</strong>
          {token && (
            <span className="aa-top-links">
              <a href={`/admin/activity${q}`}>Visitor activity →</a>
              <a href={`/admin/checkouts${q}`}>Unpaid checkouts →</a>
            </span>
          )}
        </div>
      </header>
      <main className="aa-main">{children}</main>
    </div>
  )
}

type Row = Awaited<ReturnType<typeof prisma.review.findMany>>[number]

function Stars({ n }: { n: number | null }) {
  return <span className="rv-stars" aria-label={`${n ?? 0} of 5`}>{'★'.repeat(n ?? 0)}<span style={{ opacity: 0.25 }}>{'★'.repeat(5 - (n ?? 0))}</span></span>
}

function ReviewCard({ r, token, actions }: { r: Row; token: string; actions: { label: string; status: string; tone: 'ok' | 'no' }[] }) {
  return (
    <div className="aa-card">
      <div className="aa-row">
        <Stars n={r.rating} />
        <span className="aa-small aa-muted">{designNameOf(r.templateId)} · {when(r.submittedAt)}</span>
      </div>
      {r.text ? <p className="rv-text">{r.text}</p> : <p className="aa-small aa-muted">No words, stars only.</p>}
      <p className="aa-small"><strong>{r.name}</strong>{r.city ? `, ${r.city}` : ''}</p>
      {actions.length > 0 && (
        <form action={setStatus} className="rv-actions">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="id" value={r.id} />
          {actions.map((a) => (
            <button key={a.status} type="submit" name="status" value={a.status} className={a.tone === 'ok' ? 'rv-ok' : 'rv-no'}>{a.label}</button>
          ))}
        </form>
      )}
    </div>
  )
}

interface PageProps {
  searchParams: { token?: string }
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const secret = process.env.ADMIN_SECRET
  const token = searchParams.token
  if (!secret || token !== secret) {
    return (
      <Shell>
        <form className="aa-card aa-login" method="GET" action="/admin/reviews">
          <h2>Admin sign-in</h2>
          {!secret && <p className="aa-small">Set <code>ADMIN_SECRET</code> in the environment first.</p>}
          {secret && token && <p className="aa-small" style={{ color: '#9B1C1C' }}>Incorrect token. Try again.</p>}
          <input name="token" type="password" placeholder="Admin token" required autoFocus aria-label="Admin token" />
          <button type="submit">View reviews</button>
        </form>
      </Shell>
    )
  }

  let rows: Row[]
  try {
    rows = await prisma.review.findMany({
      where: { OR: [{ status: { in: ['submitted', 'approved', 'hidden'] } }, { status: 'asked', createdAt: { gte: new Date(Date.now() - ASKED_SHOWN_DAYS * DAY) } }] },
      orderBy: { createdAt: 'desc' },
      take: 300,
    })
  } catch (err) {
    if (!isMissingReviewTable(err)) throw err
    return (
      <Shell token={token}>
        <section className="aa-card aa-callout">
          <h3>The review table has not been created yet</h3>
          <p className="aa-small">
            Run prisma/migrations/20261113130000_reviews/migration.sql once in the Supabase SQL editor, then reload. From the
            next morning, hosts are asked for a review the day after their celebration.
          </p>
        </section>
      </Shell>
    )
  }

  const toApprove = rows.filter((r) => r.status === 'submitted' && r.publish)
  const privateOnes = rows.filter((r) => r.status === 'submitted' && !r.publish)
  const shown = rows.filter((r) => r.status === 'approved')
  const hidden = rows.filter((r) => r.status === 'hidden')
  const waiting = rows.filter((r) => r.status === 'asked')

  // The invitations of hosts still to answer: their title, and a phone number when the design has one.
  const events = waiting.length
    ? await prisma.event.findMany({ where: { id: { in: waiting.map((r) => r.eventId) } }, select: { id: true, templateId: true, data: true, user: { select: { email: true } } } })
    : []
  const eventOf = new Map(events.map((e) => [e.id, e]))

  return (
    <Shell token={token}>
      <p className="aa-small aa-muted">
        The morning after each paid invitation&apos;s celebration, its host is emailed a private link to review it. Nothing
        appears on the site until the host has allowed it and you approve it here. Approving refreshes the home page and
        that design&apos;s page.
      </p>

      <section className="aa-card">
        <h3>To approve ({toApprove.length})</h3>
        <p className="aa-small aa-muted">The host allowed these on the site.</p>
      </section>
      {toApprove.map((r) => (
        <ReviewCard key={r.id} r={r} token={token} actions={[{ label: 'Approve: show on the site', status: 'approved', tone: 'ok' }, { label: 'Hide', status: 'hidden', tone: 'no' }]} />
      ))}

      {privateOnes.length > 0 && (
        <>
          <section className="aa-card">
            <h3>Private feedback ({privateOnes.length})</h3>
            <p className="aa-small aa-muted">The host did not allow these on the site. Read them; they cannot be shown.</p>
          </section>
          {privateOnes.map((r) => <ReviewCard key={r.id} r={r} token={token} actions={[]} />)}
        </>
      )}

      <section className="aa-card">
        <h3>Not answered yet ({waiting.length})</h3>
        <p className="aa-small aa-muted">
          A WhatsApp message from you gets far more replies than the email. The button opens WhatsApp with the message and
          the host&apos;s private link filled in; with no number on the invitation, choose their chat yourself.
        </p>
      </section>
      {waiting.map((r) => {
        const e = eventOf.get(r.eventId)
        const data = (e?.data ?? {}) as Record<string, string>
        const title = e ? eventTitle(data, e.templateId) : designNameOf(r.templateId)
        const phone = waNumber(data.whatsappNumber || data.rsvpPhone || data.phone)
        const text = whatsappAsk(r.name, title, r.eventId)
        return (
          <div key={r.id} className="aa-card">
            <div className="aa-row">
              <strong>{r.name}</strong>
              <span className="aa-small aa-muted">{designNameOf(r.templateId)} · asked {when(r.createdAt)}</span>
            </div>
            <p className="aa-small">
              {r.emailedAt ? `Emailed ${when(r.emailedAt)}` : 'No email sent (no inbox on the account)'}
              {e?.user?.email ? ` · ${e.user.email}` : ''}
              {phone ? ` · +${phone}` : ''}
            </p>
            <div className="rv-actions">
              <a className="rv-wa" href={`https://wa.me/${phone ?? ''}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
            </div>
            <span className="rv-link">{reviewUrl(r.eventId)}</span>
          </div>
        )
      })}

      <section className="aa-card">
        <h3>On the site ({shown.length})</h3>
      </section>
      {shown.map((r) => (
        <ReviewCard key={r.id} r={r} token={token} actions={[{ label: 'Hide from the site', status: 'hidden', tone: 'no' }]} />
      ))}

      {hidden.length > 0 && (
        <>
          <section className="aa-card">
            <h3>Hidden ({hidden.length})</h3>
          </section>
          {hidden.map((r) => (
            <ReviewCard key={r.id} r={r} token={token} actions={r.publish ? [{ label: 'Show on the site', status: 'approved', tone: 'ok' }] : []} />
          ))}
        </>
      )}
    </Shell>
  )
}
