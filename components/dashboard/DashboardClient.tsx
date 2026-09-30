'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAppUrl, formatRelativeDate } from '@/lib/utils'
import { templateImage } from '@/lib/templateMedia'
import Logo from '@/components/brand/Logo'
import { ArrowRightIcon, CheckIcon, EyeIcon, HeartIcon } from '@/components/ui/Icons'

const BEZIER = [0.16, 1, 0.3, 1] as [number, number, number, number]
const POLL_INTERVAL = 30_000

// ─── Template labels ──────────────────────────────────────────────────────────
// Kept local (rather than importing TEMPLATES) so the dashboard bundle does not
// carry every template's field config just to print a name.
const TEMPLATE_LABEL: Record<string, string> = {
  'elegant-wedding': 'Elegant Wedding',
  'cinematic-night': 'Cinematic Night',
  'indian-wedding': 'Shaadi',
  'indian-engagement': 'Mangni',
  'indian-birthday': 'Janamdin',
  'griha-pravesh': 'Griha Pravesh',
  'namakaran': 'Namakaran',
  'anniversary': 'Saalgirah',
  'kgf-wedding': 'KGF Royal Empire',
  'royal-deco': 'Royal Deco',
  'luxury-wedding': 'Luxury Wedding',
  'surprise-journey': '3D Surprise Journey',
  'rakshabandhan': 'Raksha Bandhan',
  'ganesh-chaturthi': 'Ganesh Chaturthi',
}
function templateLabel(id: string) {
  if (id.startsWith('greeting-')) return `3D greeting · ${id.slice(9).replace(/^\w/, (c) => c.toUpperCase())}`
  return TEMPLATE_LABEL[id] ?? 'Invitation'
}

// Mirrors isExpired() in app/e/[slug]/page.tsx: live until 3 days after the date.
function isExpired(data: Record<string, string>): boolean {
  if (!data.date) return false
  const [year, month, day] = data.date.split('-').map(Number)
  if (!year || !month || !day) return false
  return Date.now() > new Date(year, month - 1, day).getTime() + 3 * 24 * 60 * 60 * 1000
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
    <button
      type="button"
      onClick={copy}
      className={`shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-semibold transition-colors ${
        copied ? 'bg-emerald text-paper' : 'border border-line bg-paper text-charcoal hover:border-burnished'
      }`}
      aria-live="polite"
    >
      {copied ? 'Copied' : 'Copy link'}
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
  if (data.recipientName) return `For ${data.recipientName}`
  return 'Untitled invitation'
}

function formatEventDate(date?: string) {
  if (!date) return null
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  user: { name: string | null; email: string | null; plan?: string }
}

// No "N templates unlocked" badge: each design is sold on its own, so a tier
// count is not something the customer bought or can act on.

export default function DashboardClient({ user }: Props) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [expandedWishes, setExpandedWishes] = useState<Set<string>>(new Set())
  const [newWishIds, setNewWishIds] = useState<Set<string>>(new Set())
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  const [signingOut, setSigningOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prevWishCountRef = useRef<Record<string, number>>({})
  const wishBannerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const baseUrl = getAppUrl()

  const fetchEvents = useCallback(() => {
    setFetchError('')
    return fetch('/api/dashboard/events')
      .then(r => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json() })
      .then((data: unknown) => {
        const evs = Array.isArray(data) ? (data as Event[]) : []

        // Detect wishes that arrived since the last poll. They are already live
        // on the invitation — this only flags them as unread for the host.
        const incoming = new Set<string>()
        for (const ev of evs) {
          const prev = prevWishCountRef.current[ev.id] ?? ev.wishes.length
          ev.wishes.slice(prev).forEach(w => incoming.add(w.id))
          prevWishCountRef.current[ev.id] = ev.wishes.length
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
    return () => clearInterval(id)
  }, [fetchEvents])

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  // Removal is the only moderation action — wishes are live from the moment a
  // guest sends them, so there is nothing to approve.
  const deleteWish = async (wishId: string) => {
    setRemovingId(wishId)
    try {
      const res = await fetch(`/api/wishes/${wishId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setEvents(prev => prev.map(ev => ({ ...ev, wishes: ev.wishes.filter(w => w.id !== wishId) })))
      setNewWishIds(prev => { const n = new Set(prev); n.delete(wishId); return n })
    } catch {
      // Server rejected — leave state unchanged
    } finally { setRemovingId(null) }
  }

  const toggleWishes = (id: string) => {
    setExpandedWishes(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id) } else { n.add(id) }; return n })
  }

  const totalNew = events.reduce((s, ev) => s + ev.wishes.filter(w => newWishIds.has(w.id)).length, 0)
  const totalWishes = events.reduce((s, ev) => s + ev.wishes.length, 0)
  const liveCount = events.filter(ev => !isExpired(ev.data)).length
  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()

  const scrollToNewWishes = () => {
    const firstEventWithNew = events.find(ev => ev.wishes.some(w => newWishIds.has(w.id)))
    if (!firstEventWithNew) return
    setExpandedWishes(prev => { const n = new Set(prev); n.add(firstEventWithNew.id); return n })
    setTimeout(() => {
      document.getElementById(`event-${firstEventWithNew.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-champagne text-charcoal">

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-20 border-b border-line bg-champagne/95 backdrop-blur-xl">
        <div className="shell flex h-[4.6rem] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" aria-label="ShareInvite home"><Logo /></Link>
            <span className="hidden h-6 w-px bg-line sm:block" />
            <p className="hidden text-[0.92rem] font-semibold text-charcoal/70 sm:block">My invitations</p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/create" className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.88rem] font-semibold">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New invitation
            </Link>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-peach"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-[0.75rem] font-bold text-gold-soft">{initials}</span>
                <span className="hidden max-w-[120px] truncate text-[0.88rem] font-semibold sm:block">
                  {user.name || user.email?.split('@')[0]}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: BEZIER }}
                    className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-line bg-paper py-1.5 shadow-lift"
                  >
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate text-[0.85rem] font-semibold">{user.name || 'Welcome back'}</p>
                      <p className="truncate text-[0.8rem] text-muted">{user.email}</p>
                    </div>
                    <Link href="/templates" className="block px-4 py-2.5 text-[0.88rem] hover:bg-peach">Browse designs</Link>
                    <Link href="/pricing" className="block px-4 py-2.5 text-[0.88rem] hover:bg-peach">Pricing</Link>
                    <button
                      type="button"
                      onClick={async () => { setSigningOut(true); await signOut({ callbackUrl: '/' }) }}
                      disabled={signingOut}
                      className="block w-full border-t border-line px-4 py-2.5 text-left text-[0.88rem] text-charcoal/75 hover:bg-peach"
                    >
                      {signingOut ? 'Signing out…' : 'Sign out'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Wish notification banner ─── */}
      <AnimatePresence>
        {totalNew > 0 && (
          <motion.div ref={wishBannerRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: BEZIER }}
            className="overflow-hidden bg-emerald text-paper">
            <div className="shell flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-soft opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-soft" />
                </span>
                <p className="text-[0.9rem] font-semibold">
                  {totalNew} new wish{totalNew !== 1 ? 'es' : ''} — already live on your invitation
                </p>
                <span className="hidden text-[0.8rem] text-paper/60 sm:block">· Last checked {formatRelativeDate(lastChecked.toISOString())}</span>
              </div>
              <button type="button" onClick={scrollToNewWishes} className="btn-gold shrink-0 rounded-full px-4 py-1.5 text-[0.8rem] font-semibold">
                See them
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="shell max-w-5xl py-10 sm:py-14">

        {/* Page header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1 className="t-h1 mt-2">
              {user.name ? `Welcome, ${user.name.split(' ')[0]}` : 'My invitations'}
            </h1>
            <p className="mt-2 text-[0.98rem] text-charcoal/70">Every invitation you have published, and every wish your guests leave.</p>
          </div>
          {!loading && events.length > 0 && (
            <dl className="grid shrink-0 grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-paper text-center">
              {[
                ['Invitations', events.length],
                ['Live now', liveCount],
                ['Wishes', totalWishes],
              ].map(([label, value]) => (
                <div key={label as string} className="px-5 py-3">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">{label}</dt>
                  <dd className="mt-0.5 font-editorial text-[1.8rem] font-semibold leading-none">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-28 text-muted">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-[0.92rem]">Loading your invitations…</span>
            </div>

          ) : fetchError ? (
            <div className="card py-20 text-center">
              <p className="t-h3">Could not load your invitations</p>
              <p className="mb-6 mt-2 text-[0.9rem] text-muted">{fetchError}</p>
              <button type="button" onClick={() => { setLoading(true); fetchEvents() }} className="btn-primary inline-flex rounded-full px-6 py-3 text-[0.9rem] font-semibold">
                Try again
              </button>
            </div>

          ) : events.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: BEZIER }}
              className="relative overflow-hidden rounded-[2rem] border border-line bg-paper px-6 py-16 text-center shadow-soft sm:py-20">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(232,200,102,0.18),transparent_70%)]" />
              <div className="relative mx-auto flex w-fit -space-x-6">
                {['/templates/elegant-wedding.jpg', '/templates/indian-wedding.jpg', '/templates/indian-birthday.jpg'].map((src, i) => (
                  <span key={src} className={`relative h-28 w-20 overflow-hidden rounded-xl border-4 border-paper shadow-soft ${i === 1 ? 'z-10 -translate-y-2' : i === 0 ? '-rotate-6' : 'rotate-6'}`}>
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="t-h2 relative mt-8">Something wonderful starts here</p>
              <p className="relative mx-auto mt-3 max-w-md text-[0.98rem] text-charcoal/70">
                Choose a design, make it yours and share it with one link. It&apos;s free to build and preview.
              </p>
              <Link href="/create" className="btn-primary relative mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold">
                Create your first invitation <ArrowRightIcon />
              </Link>
            </motion.div>

          ) : (
            <div className="space-y-5">
              {events.map((event, idx) => {
                const d = event.data
                const title = getEventTitle(d)
                const eventUrl = `${baseUrl}/e/${event.slug}`
                const waUrl = `https://wa.me/?text=${encodeURIComponent(`You're invited ❤️\n\n${title}\n\n${eventUrl}`)}`
                // No pending/approved split any more — every wish is live. The
                // only distinction the host cares about is which ones are unread.
                const unreadWishes = event.wishes.filter(w => newWishIds.has(w.id))
                const wishesExpanded = expandedWishes.has(event.id)
                const expired = isExpired(d)
                const eventDate = formatEventDate(d.date)

                return (
                  <motion.article key={event.id} id={`event-${event.id}`}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.05, ease: BEZIER }}
                    className="overflow-hidden rounded-3xl border border-line bg-paper shadow-soft">

                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                      <Link href={`/e/${event.slug}`} target="_blank" className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-peach sm:h-24 sm:w-20">
                        <Image src={templateImage(event.templateId)} alt="" fill sizes="(max-width: 640px) 100vw, 80px" className="object-cover" />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${expired ? 'bg-line text-charcoal/60' : 'bg-emerald/10 text-emerald-soft'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${expired ? 'bg-charcoal/40' : 'animate-pulse bg-emerald-soft'}`} />
                            {expired ? 'Ended' : 'Live'}
                          </span>
                          <span className="text-[0.78rem] text-muted">{templateLabel(event.templateId)}</span>
                          {unreadWishes.length > 0 && (
                            <span className="rounded-full bg-gold-soft/30 px-2 py-0.5 text-[0.72rem] font-semibold text-burnished-deep">
                              {unreadWishes.length} new
                            </span>
                          )}
                        </div>
                        <h2 className="mt-1.5 truncate font-editorial text-[1.6rem] font-semibold leading-tight">{title}</h2>
                        <p className="mt-0.5 text-[0.82rem] text-muted">
                          {eventDate ? `${eventDate} · ` : ''}Created {formatRelativeDate(event.createdAt)}
                        </p>
                        <div className="mt-3 flex min-w-0 items-center gap-2">
                          <p className="min-w-0 truncate rounded-full bg-champagne px-3 py-1 text-[0.8rem] text-charcoal/70">{eventUrl}</p>
                          <CopyButton text={eventUrl} />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                        <Link href={`/e/${event.slug}`} target="_blank" className="btn-outline inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-semibold">
                          <EyeIcon className="h-3.5 w-3.5" /> View
                        </Link>
                        <a href={waUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#128C4B] px-4 py-2 text-[0.82rem] font-semibold text-white transition-opacity hover:opacity-90">
                          Share on WhatsApp
                        </a>
                        {event.wishes.length > 0 && (
                          <button type="button" onClick={() => toggleWishes(event.id)}
                            aria-expanded={wishesExpanded}
                            className="btn-outline inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-semibold">
                            <HeartIcon className="h-3.5 w-3.5 text-burnished" />
                            {event.wishes.length} wish{event.wishes.length !== 1 ? 'es' : ''}
                          </button>
                        )}
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
                          className="overflow-hidden border-t border-line bg-champagne"
                        >
                          <div className="p-5 sm:p-6">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <p className="eyebrow">Live on your invitation ({event.wishes.length})</p>
                              <p className="text-[0.78rem] text-muted">Every guest can see these · Remove any you don&apos;t want</p>
                            </div>
                            <ul className="space-y-3">
                              {event.wishes.map(wish => (
                                <li key={wish.id}
                                  className={`group flex items-start gap-3 rounded-2xl border p-4 ${newWishIds.has(wish.id) ? 'border-gold-soft/60 bg-paper' : 'border-line bg-paper/70'}`}>
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald font-editorial text-[1.1rem] font-semibold text-paper">
                                    {wish.name.slice(0, 1).toUpperCase()}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="flex items-center gap-2 text-[0.9rem] font-semibold">
                                      {wish.name}
                                      {newWishIds.has(wish.id) && <span className="rounded-full bg-gold-soft/30 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-burnished-deep">New</span>}
                                    </p>
                                    <p className="mt-0.5 text-[0.9rem] leading-6 text-charcoal/75">{wish.message}</p>
                                    <p className="mt-1 text-[0.75rem] text-muted">{formatRelativeDate(wish.createdAt)}</p>
                                  </div>
                                  <button type="button" onClick={() => deleteWish(wish.id)} disabled={removingId === wish.id}
                                    className="shrink-0 rounded-full border border-[#A33A3A]/25 bg-[#A33A3A]/[0.06] px-3 py-1.5 text-[0.75rem] font-semibold text-[#A33A3A] transition-opacity disabled:opacity-50 sm:opacity-0 sm:focus:opacity-100 sm:group-hover:opacity-100">
                                    {removingId === wish.id ? 'Removing…' : 'Remove'}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* No wishes nudge */}
                    {event.wishes.length === 0 && (
                      <div className="flex items-center gap-2 border-t border-line px-5 py-3.5 text-[0.82rem] text-muted sm:px-6">
                        <CheckIcon className="h-3.5 w-3.5 text-emerald-soft" />
                        No wishes yet — share your invitation to start collecting them.
                      </div>
                    )}
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
