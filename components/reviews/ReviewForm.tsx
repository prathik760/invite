'use client'

import { useState } from 'react'

const LIMITS = { name: 80, city: 60, text: 1000 }
const WORDS = ['', 'Poor', 'Not great', 'Good', 'Very good', 'Excellent']

interface Initial {
  rating: number
  name: string
  city: string
  text: string
  publish: boolean
}

/**
 * The review form on a host's private link (app/review/[token]). "You may show
 * this" starts unticked: a review appears on the site only when its host chose
 * that, and the owner approved it (/admin/reviews).
 */
export default function ReviewForm({
  token,
  initial,
  alreadySent,
  googleReviewUrl,
  supportUrl,
}: {
  token: string
  initial: Initial
  alreadySent: boolean
  /** A Google Business Profile review link, offered to every host after they send, whatever they gave. */
  googleReviewUrl: string | null
  supportUrl: string
}) {
  const [rating, setRating] = useState(initial.rating)
  const [name, setName] = useState(initial.name)
  const [city, setCity] = useState(initial.city)
  const [text, setText] = useState(initial.text)
  const [publish, setPublish] = useState(initial.publish)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) { setError('Choose from one to five stars.'); return }
    if (!name.trim()) { setError('Add the name to sign your review with.'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rating, name, city, text, publish }),
      })
      const body = await res.json().catch(() => ({})) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'Your review could not be saved. Please try again.')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your review could not be saved. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="card mt-8 p-6 text-center sm:p-8">
        <p className="font-editorial text-[1.8rem] font-semibold leading-tight">Thank you, {name.split(/[\s&]+/)[0] || 'truly'}.</p>
        <p className="mt-3 text-[0.95rem] leading-7 text-charcoal/75">
          {publish
            ? 'We read every review. Once we have, yours appears on our website with your name.'
            : 'We read every review. Yours stays with us: it will not be shown on the website.'}
        </p>
        {googleReviewUrl && (
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 inline-flex rounded-full px-7 py-3 text-[0.9rem] font-semibold">
            Would you also review us on Google?
          </a>
        )}
        <p className="mt-5 text-[0.85rem] text-muted">
          Anything we should fix?{' '}
          <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="link">Message us on WhatsApp</a>
        </p>
      </div>
    )
  }

  const field = 'mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[0.95rem] text-charcoal outline-none focus:border-burnished'

  return (
    <form onSubmit={send} className="card mt-8 space-y-6 p-6 sm:p-8">
      {alreadySent && (
        <p className="rounded-xl bg-peach/60 px-4 py-2.5 text-[0.85rem] text-charcoal/80">
          You have sent a review already. Change anything below and send it again.
        </p>
      )}

      <fieldset>
        <legend className="text-[0.9rem] font-semibold">Your rating</legend>
        <div role="radiogroup" aria-label="Your rating" className="mt-2 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} of 5: ${WORDS[n]}`}
              onClick={() => setRating(n)}
              className={`text-[2.2rem] leading-none transition-transform hover:scale-110 ${n <= rating ? 'text-burnished' : 'text-charcoal/20'}`}
            >
              ★
            </button>
          ))}
          <span className="ms-2 text-[0.9rem] text-muted">{WORDS[rating]}</span>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-[0.9rem] font-semibold">What did you and your guests think?</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={LIMITS.text}
          rows={5}
          placeholder="What guests said when they opened it, what worked, what could be better."
          className={field}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.9rem] font-semibold">Sign it as</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name} required className={field} />
        </label>
        <label className="block">
          <span className="text-[0.9rem] font-semibold">City <span className="font-normal text-muted">(optional)</span></span>
          <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={LIMITS.city} placeholder="Bengaluru" className={field} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-[0.9rem] leading-6 text-charcoal/85">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0B4A34]" />
        <span>ShareInvite may show this review, with this name and city, on its website.</span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-[#A33A3A]/20 bg-[#A33A3A]/[0.06] px-4 py-2.5 text-[0.85rem] font-medium text-[#A33A3A]">{error}</p>
      )}

      <button type="submit" disabled={sending} className="btn-primary flex w-full items-center justify-center rounded-full py-3.5 text-[0.95rem] font-semibold disabled:opacity-50">
        {sending ? 'Sending…' : 'Send my review'}
      </button>
    </form>
  )
}
