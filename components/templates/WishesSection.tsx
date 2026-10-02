'use client'

import { useEffect, useState } from 'react'
import type { WishRecord } from '@/types'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { DEFAULT_THEME, type InviteTheme } from './kit/theme'

interface WishesSectionProps {
  eventId: string
  /** The host template's palette and faces. Defaults to warm ivory. */
  theme?: InviteTheme
  title?: string
  intro?: string
  /** Guest-facing word for a wish: "wish", "blessing"… */
  noun?: string
  /** Sample wishes for the builder preview, when the default pair doesn't suit the design. */
  previewWishes?: { name: string; message: string }[]
  /** Example in the name field ("e.g. Anjali & Rahul"). */
  namePlaceholder?: string
}

const MAX_MESSAGE = 320
const COLLAPSED = 6

const PREVIEW_WISHES: WishRecord[] = [
  { id: '1', eventId: '__preview__', name: 'Anjali & Vikram', message: 'So happy for you both. Counting the days — see you there!', isApproved: true, createdAt: new Date().toISOString() },
  { id: '2', eventId: '__preview__', name: 'The Mehta family', message: 'Wishing you a lifetime of love and laughter. Blessings from all of us.', isApproved: true, createdAt: new Date().toISOString() },
]

export default function WishesSection({
  eventId,
  theme = DEFAULT_THEME,
  title = 'Wishes & blessings',
  intro = 'Leave a few words for the family. Your message appears here for every guest.',
  noun = 'wish',
  previewWishes,
  namePlaceholder = 'e.g. Anjali & Rahul',
}: WishesSectionProps) {
  const isPreviewMode = eventId === '__preview__'
  const [wishes, setWishes] = useState<WishRecord[]>(() => {
    if (!isPreviewMode) return []
    if (!previewWishes?.length) return PREVIEW_WISHES
    return previewWishes.map((w, i) => ({ id: String(i + 1), eventId: '__preview__', name: w.name, message: w.message, isApproved: true, createdAt: PREVIEW_WISHES[0].createdAt }))
  })
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (isPreviewMode) return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then((r) => r.json())
      .then((data) => setWishes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [eventId, isPreviewMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (isPreviewMode) { setSubmitted(true); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      // Wishes are published on arrival, so show it straight away.
      const created: WishRecord = await res.json()
      setWishes((prev) => [created, ...prev.filter((w) => w.id !== created.id)])
      setSubmitted(true)
      trackEvent(seoEvents.rsvpSubmission, { event_id: eventId, response_type: 'wish' })
      setName('')
      setMessage('')
    } catch {
      setError(`Your ${noun} didn't send. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const t = theme
  const charsLeft = MAX_MESSAGE - message.length
  const visible = showAll ? wishes : wishes.slice(0, COLLAPSED)
  const field: React.CSSProperties = {
    color: t.ink,
    background: t.surface,
    border: `1px solid ${t.line}`,
    fontFamily: t.body,
  }

  return (
    <section className={`px-5 ${isPreviewMode ? 'py-12' : 'py-20'}`} style={{ background: t.bg, color: t.ink, fontFamily: t.body }}>
      <div className="mx-auto max-w-[34rem]">
        <h2
          className="text-center text-[30px] leading-[1.1]"
          style={{ fontFamily: t.heading, color: t.ink, ...t.headingStyle }}
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[26rem] text-center text-[14px] leading-[1.6]" style={{ color: t.muted }}>
          {intro}
        </p>

        <div className="mt-8 rounded-[14px] p-5" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          {submitted ? (
            <div className="py-6 text-center" role="status">
              <p className="text-[22px]" style={{ fontFamily: t.heading, color: t.ink, ...t.headingStyle }}>Thank you</p>
              <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: t.muted }}>
                Your {noun} is on the invitation now — everyone who opens the link will see it.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 text-[13px] font-medium underline underline-offset-4"
                style={{ color: t.accent }}
              >
                Write another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium" style={{ color: t.muted }}>Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={namePlaceholder}
                  required
                  maxLength={80}
                  className="w-full rounded-[10px] px-3.5 py-3 text-[16px] outline-none focus:ring-2"
                  style={{ ...field, ['--tw-ring-color' as string]: t.accent }}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-baseline justify-between text-[12px] font-medium" style={{ color: t.muted }}>
                  <span>Your {noun}</span>
                  <span className="tabular-nums" style={{ opacity: charsLeft <= 40 ? 1 : 0.6 }}>{charsLeft}</span>
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                  placeholder="Write something from the heart…"
                  required
                  rows={4}
                  className="w-full resize-none rounded-[10px] px-3.5 py-3 text-[16px] leading-[1.55] outline-none focus:ring-2"
                  style={{ ...field, ['--tw-ring-color' as string]: t.accent }}
                />
              </label>
              {error && <p className="text-[13px]" style={{ color: t.accent }} role="alert">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[10px] py-3.5 text-[15px] font-semibold transition-opacity disabled:opacity-60"
                style={{ background: t.accent, color: t.onAccent }}
              >
                {loading ? 'Sending…' : `Send your ${noun}`}
              </button>
            </form>
          )}
        </div>

        {wishes.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-[12px] font-medium" style={{ color: t.muted }}>
              {wishes.length} {wishes.length === 1 ? noun : /(sh|ch|s)$/.test(noun) ? `${noun}es` : `${noun}s`}
            </p>
            <ul className="space-y-3">
              {visible.map((wish) => (
                <li key={wish.id} className="rounded-[14px] px-5 py-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
                  <p className="whitespace-pre-line text-[15px] leading-[1.6]" style={{ color: t.ink }}>{wish.message}</p>
                  <p className="mt-2.5 text-[13px] font-semibold" style={{ color: t.accent }}>— {wish.name}</p>
                </li>
              ))}
            </ul>
            {wishes.length > COLLAPSED && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-4 w-full rounded-[10px] py-3 text-[14px] font-medium"
                style={{ color: t.ink, border: `1px solid ${t.line}` }}
              >
                {showAll ? 'Show fewer' : `Show all ${wishes.length}`}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
