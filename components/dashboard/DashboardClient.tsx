'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAppUrl, formatRelativeDate } from '@/lib/utils'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const POLL_INTERVAL = 30_000

// ─── Template metadata ────────────────────────────────────────────────────────

const TEMPLATE_META: Record<string, { label: string; dot: string; category: string }> = {
  'elegant-wedding':    { label: 'Elegant Wedding',    dot: '#B87924', category: 'Wedding' },
  'cinematic-night':    { label: 'Cinematic Night',    dot: '#C9A84C', category: 'Wedding' },
  'indian-wedding':     { label: 'Shaadi — Wedding',   dot: '#C41E3A', category: 'Wedding' },
  'indian-engagement':  { label: 'Mangni — Engagement',dot: '#C2185B', category: 'Engagement' },
  'indian-birthday':    { label: 'Janamdin — Birthday',dot: '#FF8C00', category: 'Birthday' },
  'griha-pravesh':      { label: 'Griha Pravesh',      dot: '#FF8F00', category: 'Housewarming' },
  'namakaran':          { label: 'Namakaran',          dot: '#0288D1', category: 'Naming' },
  'anniversary':        { label: 'Saalgirah — Anniversary', dot: '#8B0030', category: 'Anniversary' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Wish {
  id: string
  name: string
  message: string
  isApproved: boolean
  createdAt: string
}

interface Event {
  id: string
  slug: string
  templateId: string
  data: Record<string, string>
  isPaid: boolean
  createdAt: string
  wishes: Wish[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea'); el.value = text
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="d" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="flex items-center gap-1 text-emerald-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg> Copied
          </motion.span>
        ) : (
          <motion.span key="c" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function getEventTitle(data: Record<string, string>): string {
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName}`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name}`
  if (data.celebrantName) return data.age ? `${data.celebrantName} — ${data.age}th Birthday` : `${data.celebrantName}'s Birthday`
  if (data.hostNames) return data.hostNames
  if (data.babyName) return `Namakaran — ${data.babyName}`
  if (data.coupleNames) return data.years ? `${data.coupleNames} — ${data.years} Years` : data.coupleNames
  return 'Untitled Invitation'
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  user: { name: string | null; email: string | null; plan?: string }
}

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  free:     { label: 'Free',     color: '#7E716B', bg: 'rgba(126,113,107,0.1)',  border: '1px solid rgba(126,113,107,0.2)' },
  standard: { label: 'Standard', color: '#B87924', bg: 'rgba(184,121,36,0.12)', border: '1px solid rgba(184,121,36,0.25)' },
  premium:  { label: 'Premium',  color: '#2F766D', bg: 'rgba(47,118,109,0.12)', border: '1px solid rgba(47,118,109,0.25)' },
  gold:     { label: 'Gold',     color: '#C9A84C', bg: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.3)'  },
}

export default function DashboardClient({ user }: Props) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [expandedWishes, setExpandedWishes] = useState<Set<string>>(new Set())
  const [newWishIds, setNewWishIds] = useState<Set<string>>(new Set())
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  const [signingOut, setSigningOut] = useState(false)
  const [userPlan, setUserPlan] = useState('free')
  const prevWishCountRef = useRef<Record<string, number>>({})
  const wishBannerRef = useRef<HTMLDivElement>(null)
  const baseUrl = getAppUrl()

  const fetchEvents = useCallback(() => {
    setFetchError('')
    return fetch('/api/dashboard/events')
      .then(r => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json() })
      .then((data: unknown) => {
        const evs = Array.isArray(data) ? (data as Event[]) : []

        // Detect new wishes since last check
        const incoming = new Set<string>()
        for (const ev of evs) {
          const prev = prevWishCountRef.current[ev.id] ?? ev.wishes.length
          const newWishes = ev.wishes.filter(w => !w.isApproved).slice(prev)
          newWishes.forEach(w => incoming.add(w.id))
          prevWishCountRef.current[ev.id] = ev.wishes.filter(w => !w.isApproved).length
        }
        setNewWishIds(prev => {
          const next = new Set(prev)
          incoming.forEach(id => next.add(id))
          return next
        })

        setEvents(evs)
        setLastChecked(new Date())
      })
      .catch((err: unknown) => setFetchError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchEvents()
    const id = setInterval(fetchEvents, POLL_INTERVAL)
    fetch('/api/user/subscription').then(r => r.json()).then((b: { plan: string }) => { if (b.plan) setUserPlan(b.plan) }).catch(() => {})
    return () => clearInterval(id)
  }, [fetchEvents])

  const approveWish = async (wishId: string) => {
    setApprovingId(wishId)
    try {
      const res = await fetch(`/api/wishes/${wishId}/approve`, { method: 'PATCH' })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setEvents(prev => prev.map(ev => ({ ...ev, wishes: ev.wishes.map(w => w.id === wishId ? { ...w, isApproved: true } : w) })))
      setNewWishIds(prev => { const n = new Set(prev); n.delete(wishId); return n })
    } catch {
      // Server rejected — leave state unchanged
    } finally { setApprovingId(null) }
  }

  const deleteWish = async (wishId: string) => {
    setApprovingId(wishId)
    try {
      const res = await fetch(`/api/wishes/${wishId}/approve`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setEvents(prev => prev.map(ev => ({ ...ev, wishes: ev.wishes.filter(w => w.id !== wishId) })))
      setNewWishIds(prev => { const n = new Set(prev); n.delete(wishId); return n })
    } catch {
      // Server rejected — leave state unchanged
    } finally { setApprovingId(null) }
  }

  const toggleWishes = (id: string) => {
    setExpandedWishes(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id) } else { n.add(id) }; return n })
  }

  const totalPending = events.reduce((s, ev) => s + ev.wishes.filter(w => !w.isApproved).length, 0)
  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()

  const scrollToPendingWishes = () => {
    const firstEventWithPending = events.find(ev => ev.wishes.some(w => !w.isApproved))
    if (!firstEventWithPending) return
    setExpandedWishes(prev => { const n = new Set(prev); n.add(firstEventWithPending.id); return n })
    setTimeout(() => {
      document.getElementById(`event-${firstEventWithPending.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Header ─── */}
      <header className="border-b border-border px-5 sm:px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="font-heading text-xl text-ink hover:opacity-75 transition-opacity shrink-0">
            ShareInvite
          </Link>
          <div className="hidden sm:block h-5 w-px bg-border" />
          <p className="hidden sm:block text-sm font-medium text-muted truncate">Dashboard</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/create"
            className="gold-button inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Invite
          </Link>

          {/* User avatar */}
          <div className="relative group">
            <button className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-xl hover:bg-border/50 transition-colors">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)' }}>
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[120px]">
                {user.name || user.email?.split('@')[0]}
              </span>
              <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border bg-white shadow-card-md py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="px-4 py-3 border-b border-border/60">
                <p className="text-xs font-semibold text-ink truncate">{user.name || 'Welcome back'}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
                {PLAN_LABELS[userPlan] && (
                  <span className="mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: PLAN_LABELS[userPlan].bg, color: PLAN_LABELS[userPlan].color, border: PLAN_LABELS[userPlan].border }}>
                    {PLAN_LABELS[userPlan].label} plan
                  </span>
                )}
              </div>
              <button
                onClick={async () => { setSigningOut(true); await signOut({ callbackUrl: '/' }) }}
                disabled={signingOut}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Wish notification banner ─── */}
      <AnimatePresence>
        {totalPending > 0 && (
          <motion.div ref={wishBannerRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: BEZIER }}
            className="overflow-hidden">
            <div className="px-5 sm:px-6 py-3 flex items-center justify-between gap-4"
              style={{ background: 'linear-gradient(135deg,rgba(217,164,65,0.12),rgba(184,121,36,0.08))', borderBottom: '1px solid rgba(217,164,65,0.2)' }}>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#D9A441' }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#B87924' }} />
                </span>
                <p className="text-sm font-semibold text-ink">
                  {totalPending} pending wish{totalPending !== 1 ? 'es' : ''} waiting for your approval
                </p>
                <span className="hidden sm:block text-xs text-muted">· Last checked {formatRelativeDate(lastChecked.toISOString())}</span>
              </div>
              <button
                onClick={scrollToPendingWishes}
                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                style={{ background: 'rgba(184,121,36,0.12)', color: '#B87924', border: '1px solid rgba(184,121,36,0.22)' }}
              >
                Review now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-10">

        {/* Page header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-ink mb-1">
              {user.name ? `Welcome, ${user.name.split(' ')[0]}` : 'My Invitations'}
            </h1>
            <p className="text-muted text-sm">Manage your invitations and approve guest wishes.</p>
          </div>
          <div className="shrink-0 text-right hidden sm:flex items-center gap-3">
            {!loading && events.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-heading text-ink">{events.length}</p>
                <p className="text-xs text-muted">invitation{events.length !== 1 ? 's' : ''}</p>
              </div>
            )}
            {PLAN_LABELS[userPlan] && (
              <span className="rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
                style={{ background: PLAN_LABELS[userPlan].bg, color: PLAN_LABELS[userPlan].color, border: PLAN_LABELS[userPlan].border }}>
                {PLAN_LABELS[userPlan].label}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-28 gap-3 text-muted">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Loading your invitations…</span>
          </div>

        ) : fetchError ? (
          <div className="text-center py-24 bg-surface rounded-2xl surface-border">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="font-heading text-xl text-foreground mb-2">Could not load invitations</p>
            <p className="text-muted text-sm mb-6">{fetchError}</p>
            <button onClick={() => { setLoading(true); fetchEvents() }}
              className="gold-button inline-flex px-5 py-2.5 rounded-xl text-sm font-medium">
              Try again
            </button>
          </div>

        ) : events.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: BEZIER }}
            className="text-center py-28 bg-surface rounded-2xl surface-border">
            <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl select-none"
              style={{ background: 'rgba(217,164,65,0.12)', border: '1px solid rgba(184,121,36,0.2)' }} aria-hidden>
              ♥
            </div>
            <p className="font-heading text-2xl text-foreground mb-2">No invitations yet</p>
            <p className="text-muted text-sm mb-7">Create your first beautiful invitation and start sharing.</p>
            <Link href="/create" className="gold-button inline-flex px-6 py-3 rounded-xl text-sm font-semibold">
              Create Invitation
            </Link>
          </motion.div>

        ) : (
          <div className="space-y-5">
            {events.map((event, idx) => {
              const d = event.data
              const title = getEventTitle(d)
              const eventUrl = `${baseUrl}/e/${event.slug}`
              const waUrl = `https://wa.me/?text=${encodeURIComponent(`You're invited ❤️\n\n${title}\n\n${eventUrl}`)}`
              const pending = event.wishes.filter(w => !w.isApproved)
              const approved = event.wishes.filter(w => w.isApproved)
              const wishesExpanded = expandedWishes.has(event.id)
              const meta = TEMPLATE_META[event.templateId]
              const hasNewWishes = event.wishes.some(w => newWishIds.has(w.id))

              return (
                <motion.div key={event.id} id={`event-${event.id}`}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: BEZIER }}
                  className="bg-surface rounded-2xl surface-border shadow-card overflow-hidden">

                  {/* New wish indicator stripe */}
                  {hasNewWishes && (
                    <div className="h-0.5" style={{ background: 'linear-gradient(90deg,#D9A441,#B87924)' }} />
                  )}

                  {/* Event header */}
                  <div className="px-5 sm:px-6 py-5 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h2 className="font-heading text-xl text-foreground">{title}</h2>
                          {meta && (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                              style={{ background: `${meta.dot}18`, color: meta.dot, border: `1px solid ${meta.dot}30` }}>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.dot }} />
                              {meta.label}
                            </span>
                          )}
                          {pending.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                              style={{ background: 'rgba(217,164,65,0.12)', color: '#B87924', border: '1px solid rgba(184,121,36,0.2)' }}>
                              {hasNewWishes && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                              {pending.length} pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-muted text-xs truncate max-w-[220px] sm:max-w-sm">{eventUrl}</p>
                          <CopyButton text={eventUrl} />
                        </div>
                        <p className="text-muted text-xs mt-0.5 opacity-70">Created {formatRelativeDate(event.createdAt)}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Link href={`/e/${event.slug}`} target="_blank"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-background text-foreground text-xs rounded-xl border border-border hover:border-accent/40 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          View
                        </Link>
                        <a href={waUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-white text-xs rounded-xl transition-colors"
                          style={{ background: 'rgb(22,163,74)' }}>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.528 5.861L0 24l6.336-1.502A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 01-5.004-1.373l-.359-.214-3.741.888.944-3.619-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                          </svg>
                          Share
                        </a>
                        {event.wishes.length > 0 && (
                          <button onClick={() => toggleWishes(event.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl border border-border transition-colors hover:border-accent/40"
                            style={{ color: pending.length > 0 ? '#B87924' : '#7E716B' }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            {event.wishes.length} wish{event.wishes.length !== 1 ? 'es' : ''}
                            <svg className={`w-3 h-3 transition-transform ${wishesExpanded ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Wishes panel */}
                  <AnimatePresence>
                    {wishesExpanded && event.wishes.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: BEZIER }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-border">
                          {pending.length > 0 && (
                            <div className="px-5 sm:px-6 py-5">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] text-muted uppercase tracking-[0.22em]">
                                  Pending Approval ({pending.length})
                                </p>
                                <p className="text-[10px] text-muted/60">Approve to make visible on the invite</p>
                              </div>
                              <div className="space-y-3">
                                {pending.map(wish => (
                                  <div key={wish.id}
                                    className="flex items-start gap-3 rounded-xl p-4 border transition-all"
                                    style={{
                                      background: newWishIds.has(wish.id) ? 'rgba(217,164,65,0.04)' : 'rgba(255,255,255,0.7)',
                                      borderColor: newWishIds.has(wish.id) ? 'rgba(217,164,65,0.25)' : '#E8DCCD',
                                    }}
                                  >
                                    {newWishIds.has(wish.id) && (
                                      <span className="shrink-0 mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-md"
                                        style={{ background: 'rgba(217,164,65,0.14)', color: '#B87924' }}>New</span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-foreground mb-0.5">{wish.name}</p>
                                      <p className="text-sm text-muted leading-relaxed line-clamp-2">{wish.message}</p>
                                      <p className="text-xs text-muted/50 mt-1">{formatRelativeDate(wish.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button onClick={() => approveWish(wish.id)} disabled={approvingId === wish.id}
                                        className="px-3 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-50"
                                        style={{ background: 'rgba(22,163,74,0.08)', color: 'rgb(22,163,74)', borderColor: 'rgba(22,163,74,0.22)' }}>
                                        Approve
                                      </button>
                                      <button onClick={() => deleteWish(wish.id)} disabled={approvingId === wish.id}
                                        className="px-3 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-50"
                                        style={{ background: 'rgba(185,107,112,0.08)', color: '#B96B70', borderColor: 'rgba(185,107,112,0.22)' }}>
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {approved.length > 0 && (
                            <div className="px-5 sm:px-6 py-5">
                              <p className="text-[10px] text-muted uppercase tracking-[0.22em] mb-3">
                                Approved &amp; Visible ({approved.length})
                              </p>
                              <div className="space-y-2">
                                {approved.map(wish => (
                                  <div key={wish.id} className="flex items-start gap-3 py-2.5 rounded-xl px-3 hover:bg-background/60 transition-colors group">
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-semibold text-foreground mr-2">{wish.name}</span>
                                      <span className="text-sm text-muted">— {wish.message}</span>
                                    </div>
                                    <button onClick={() => deleteWish(wish.id)} disabled={approvingId === wish.id}
                                      className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose transition-all shrink-0 p-1 rounded-lg hover:bg-rose/8"
                                      title="Delete">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* No wishes nudge */}
                  {event.wishes.length === 0 && (
                    <div className="px-5 sm:px-6 py-4 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                      <p className="text-muted text-xs">No wishes yet — share your invitation to start collecting them.</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
