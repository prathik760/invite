import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Admin — Custom Requests | ShareInvite' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface Wish {
  id: string
  name: string
  message: string
  isApproved: boolean
  createdAt: Date
}

function parseWishName(raw: string) {
  const parts = raw.split(' | ')
  return {
    name: parts[0] ?? '—',
    email: parts[1] ?? '—',
    phone: parts[2] ?? '—',
    eventType: parts[3] ?? '—',
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

const EVENT_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  wedding:     { bg: '#FEF2F2', color: '#9B1C1C' },
  shaadi:      { bg: '#FEF2F2', color: '#9B1C1C' },
  engagement:  { bg: '#FDF2F8', color: '#9D174D' },
  mangni:      { bg: '#FDF2F8', color: '#9D174D' },
  birthday:    { bg: '#FFF7ED', color: '#9A3412' },
  janamdin:    { bg: '#FFF7ED', color: '#9A3412' },
  anniversary: { bg: '#FFF1F2', color: '#881337' },
  saalgirah:   { bg: '#FFF1F2', color: '#881337' },
  namakaran:   { bg: '#EFF6FF', color: '#1E40AF' },
  'griha pravesh': { bg: '#FFFBEB', color: '#92400E' },
}

function getEventTypeStyle(eventType: string) {
  const key = eventType.toLowerCase().trim()
  return EVENT_TYPE_COLORS[key] ?? { bg: '#F3F4F6', color: '#374151' }
}

// ─── Login page ─────────────────────────────────────────────────────────────

function LoginPage({ wrongToken }: { wrongToken: boolean }) {
  return (
    <div style={{
      minHeight: '100dvh', background: '#FFFCF8', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    }}>
      <div style={{
        width: '100%', maxWidth: '380px',
        background: '#fff', borderRadius: '20px',
        padding: '36px 32px',
        border: '1px solid rgba(44,32,28,0.09)',
        boxShadow: '0 8px 32px rgba(44,32,28,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #B87924, #D9A441)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#9B8F8A', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '1px' }}>ShareInvite</p>
            <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#221B17', lineHeight: 1 }}>Admin Panel</h1>
          </div>
        </div>

        {wrongToken && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px',
            padding: '10px 14px', marginBottom: '20px',
            fontSize: '13px', color: '#9B1C1C',
          }}>
            Incorrect token. Try again.
          </div>
        )}

        <form method="GET" action="/admin/requests">
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6B5F58', marginBottom: '8px', letterSpacing: '.04em' }}>
            ACCESS TOKEN
          </label>
          <input
            name="token"
            type="password"
            placeholder="Enter admin token"
            autoFocus
            required
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '11px 14px', borderRadius: '10px',
              border: '1.5px solid rgba(44,32,28,0.16)',
              background: '#FFFCF8', color: '#221B17',
              fontSize: '14px', outline: 'none',
              marginBottom: '16px',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px',
              borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #B87924, #D9A441)',
              color: '#fff', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', letterSpacing: '.02em',
            }}
          >
            View Requests
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#B0A69F', textAlign: 'center', lineHeight: '1.5' }}>
          Token is set in <code style={{ background: '#F3EDE7', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>.env.local</code> → <code style={{ background: '#F3EDE7', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>ADMIN_SECRET</code>
        </p>
      </div>
    </div>
  )
}

// ─── Setup page (env var not configured) ────────────────────────────────────

function SetupPage() {
  return (
    <div style={{
      minHeight: '100dvh', background: '#FFFCF8', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    }}>
      <div style={{
        maxWidth: '460px', background: '#fff', borderRadius: '20px',
        padding: '36px 32px', border: '1px solid rgba(44,32,28,0.09)',
        boxShadow: '0 8px 32px rgba(44,32,28,0.07)',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#221B17', marginBottom: '12px' }}>
          Admin not configured
        </h2>
        <p style={{ fontSize: '14px', color: '#6B5F58', lineHeight: '1.6', marginBottom: '20px' }}>
          Add the following to your <code style={{ background: '#F3EDE7', padding: '1px 5px', borderRadius: '4px' }}>.env.local</code> file:
        </p>
        <pre style={{
          background: '#1C1917', color: '#A3E635', padding: '16px 18px',
          borderRadius: '10px', fontSize: '13px', overflowX: 'auto',
          fontFamily: 'monospace',
        }}>
          ADMIN_SECRET=your-secret-token-here
        </pre>
        <p style={{ fontSize: '13px', color: '#9B8F8A', marginTop: '16px', lineHeight: '1.5' }}>
          Then access the admin at <code style={{ background: '#F3EDE7', padding: '1px 5px', borderRadius: '4px', fontSize: '12px' }}>/admin/requests?token=your-secret-token-here</code>
        </p>
      </div>
    </div>
  )
}

// ─── Request card ────────────────────────────────────────────────────────────

function RequestCard({ wish, index }: { wish: Wish; index: number }) {
  const { name, email, phone, eventType } = parseWishName(wish.name)
  const typeStyle = getEventTypeStyle(eventType)
  const isPhoneSet = phone && phone !== '—'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(44,32,28,0.09)',
      borderRadius: '16px',
      padding: '20px 22px',
      boxShadow: '0 2px 8px rgba(44,32,28,0.04)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {/* Avatar circle */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, rgba(184,121,36,0.15), rgba(184,121,36,0.08))`,
            border: '1.5px solid rgba(184,121,36,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#B87924',
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#221B17', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </p>
            <span style={{
              display: 'inline-block', padding: '2px 8px', borderRadius: '99px',
              fontSize: '10px', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase',
              background: typeStyle.bg, color: typeStyle.color,
              border: `1px solid ${typeStyle.color}22`,
            }}>
              {eventType}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', color: '#B0A69F', lineHeight: '1.4' }}>
            #{String(index + 1).padStart(3, '0')}
          </p>
          <p style={{ fontSize: '11px', color: '#9B8F8A', lineHeight: '1.4' }}>
            {formatDate(wish.createdAt)}
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px 16px',
        padding: '10px 12px', borderRadius: '10px',
        background: '#FAFAF9', border: '1px solid rgba(44,32,28,0.06)',
        marginBottom: '12px',
      }}>
        <a
          href={`mailto:${email}`}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#2563EB', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {email}
        </a>
        {isPhoneSet && (
          <a
            href={`tel:${phone}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#059669', textDecoration: 'none' }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '13px', color: '#4B4542', lineHeight: '1.65',
        background: '#FEFCF8', border: '1px solid rgba(44,32,28,0.07)',
        borderRadius: '10px', padding: '12px 14px',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        margin: 0,
      }}>
        {wish.message}
      </p>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ requests, token }: { requests: Wish[]; token: string }) {
  const thisMonth = requests.filter(r => {
    const d = new Date(r.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div style={{
      minHeight: '100dvh', background: '#F5EFE6',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    }}>
      {/* Top bar */}
      <div style={{
        background: '#221B17', padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '52px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#D9A441', letterSpacing: '.05em' }}>
              SHAREINVITE
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>/</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' }}>
              Custom Requests
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(217,164,65,0.18)', color: '#D9A441',
              padding: '3px 10px', borderRadius: '99px',
              fontSize: '12px', fontWeight: '700',
            }}>
              {requests.length} total
            </span>
            <a
              href={`/admin/requests?token=${encodeURIComponent(token)}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)',
                padding: '5px 10px', borderRadius: '8px',
                fontSize: '12px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total requests', value: requests.length, icon: '📋' },
            { label: 'This month', value: thisMonth, icon: '📅' },
            { label: 'Pending reply', value: requests.filter(r => !r.isApproved).length, icon: '⏳' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 140px', minWidth: '120px',
              background: '#fff', borderRadius: '14px',
              padding: '14px 18px',
              border: '1px solid rgba(44,32,28,0.09)',
              boxShadow: '0 2px 6px rgba(44,32,28,0.04)',
            }}>
              <p style={{ fontSize: '11px', color: '#9B8F8A', marginBottom: '4px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#221B17', lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Request list */}
        {requests.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: '#fff', borderRadius: '20px',
            border: '1px solid rgba(44,32,28,0.09)',
          }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#221B17', marginBottom: '6px' }}>
              No requests yet
            </p>
            <p style={{ fontSize: '14px', color: '#9B8F8A' }}>
              Custom template requests will appear here when users submit them.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {requests.map((wish, i) => (
              <RequestCard key={wish.id} wish={wish} index={i} />
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#B0A69F' }}>
          Showing all {requests.length} request{requests.length !== 1 ? 's' : ''} · newest first
        </p>
      </div>
    </div>
  )
}

// ─── Page entry ──────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function AdminRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const adminSecret = process.env.ADMIN_SECRET
  const token = params.token

  if (!adminSecret) {
    return <SetupPage />
  }

  if (!token || token !== adminSecret) {
    return <LoginPage wrongToken={!!token} />
  }

  let requests: Wish[] = []
  try {
    const sentinelEvent = await prisma.event.findFirst({
      where: { slug: '__custom-requests__' },
    })
    if (sentinelEvent) {
      requests = await prisma.wish.findMany({
        where: { eventId: sentinelEvent.id },
        orderBy: { createdAt: 'desc' },
      })
    }
  } catch {
    // DB unavailable — show empty state
  }

  return <Dashboard requests={requests} token={token} />
}
