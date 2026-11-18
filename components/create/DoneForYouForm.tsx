'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import Image from '@/components/ui/Image'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { supportWhatsAppUrl } from '@/lib/support'
import { dfyQuestions, isRowField } from '@/lib/doneForYouShared'
import type { TemplateField } from '@/types'
import type { DoneForYouDesign } from './DoneForYou'

/**
 * "Our team fills it in": the questions this design needs, on one page (lib/doneForYouShared.ts).
 *
 * The design's required boxes come first, the rest fold under "More details", and whatever the
 * customer already typed in the builder is filled in. Only their name and WhatsApp number are
 * needed to send: a family that has not fixed the venue yet should still be able to ask. Photos
 * and music follow on WhatsApp, from the thank-you screen.
 */

const WHATSAPP_GREEN = '#1FA855'

export default function DoneForYouForm({ design, fields, typed, onClose }: {
  design: DoneForYouDesign
  fields: TemplateField[]
  /** What the customer typed in the builder so far. */
  typed: Record<string, string>
  onClose: () => void
}) {
  const questions = useMemo(() => dfyQuestions(fields), [fields])
  const first = questions.filter((f) => f.required)
  const more = questions.filter((f) => !f.required)
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.filter((f) => !isRowField(f) && typed[f.key]?.trim()).map((f) => [f.key, typed[f.key]])),
  )
  const [contact, setContact] = useState({ name: '', phone: '', email: '' })
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const [ref, setRef] = useState('')
  const firstBox = useRef<HTMLInputElement>(null)
  const close = useRef(onClose)
  close.current = onClose

  // Once, when the form opens. It used to run again whenever the builder behind it re-rendered (a new
  // onClose each time), which put the cursor back in the first box and scrolled the form to the top
  // in the middle of a tap.
  useEffect(() => {
    firstBox.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close.current() }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [])

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setError('')
    setState('sending')
    const fieldsOut: Record<string, string> = {}
    const extrasOut: Record<string, string> = {}
    for (const f of questions) {
      const v = (values[f.key] ?? '').trim()
      if (!v) continue
      if (isRowField(f)) extrasOut[f.key] = v
      else fieldsOut[f.key] = v
    }
    try {
      const res = await fetch('/api/done-for-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: design.id, contact, fields: fieldsOut, extras: extrasOut, notes, website }),
      })
      const body = (await res.json().catch(() => ({}))) as { ref?: string; error?: string }
      if (!res.ok || !body.ref) throw new Error(body.error || 'Something went wrong. Please try again.')
      setRef(body.ref)
      setState('sent')
      trackEvent(seoEvents.lead, { lead_type: 'done_for_you_form', template_id: design.id, template_name: design.name, price: design.price, source: 'dfy_form' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('idle')
    }
  }

  const input = 'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.95rem] text-charcoal outline-none transition-colors focus:border-emerald'
  const label = 'mb-1 block text-[0.82rem] font-semibold text-charcoal'

  const box = (f: TemplateField) => {
    const id = `dfy-${f.key}`
    const v = values[f.key] ?? ''
    const columns = f.columns?.map((c) => c.label).join(', ')
    return (
      <div key={f.key}>
        <label htmlFor={id} className={label}>
          {f.label}
          {f.required && <span className="text-burnished-deep"> *</span>}
        </label>
        {isRowField(f) ? (
          <>
            <textarea id={id} rows={3} value={v} onChange={(e) => set(f.key, e.target.value)} className={input} placeholder={`One per line: ${columns}`} />
            <p className="mt-1 text-[0.72rem] text-muted">One per line: {columns}.</p>
          </>
        ) : f.type === 'textarea' ? (
          <textarea id={id} rows={3} value={v} onChange={(e) => set(f.key, e.target.value)} className={input} placeholder={f.placeholder} />
        ) : f.type === 'choice' ? (
          <select id={id} value={v} onChange={(e) => set(f.key, e.target.value)} className={input}>
            <option value="">Let the team choose</option>
            {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input
            id={id}
            type={f.type === 'date' || f.type === 'time' ? f.type : f.type === 'url' ? 'url' : 'text'}
            value={v}
            onChange={(e) => set(f.key, e.target.value)}
            className={input}
            placeholder={f.type === 'date' || f.type === 'time' ? undefined : f.placeholder}
          />
        )}
      </div>
    )
  }

  const photosLink = supportWhatsAppUrl(`Hi ShareInvite! This is ${contact.name.trim() || 'me'}, request #${ref} (${design.name}). Here are my photos:`)

  // Drawn on the page itself, not inside the builder: the builder's panels move as focus comes and
  // goes (typing mode), and a dialog inside them moved too, between a finger going down and up.
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-charcoal/50 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dfy-title"
        className="flex max-h-[94dvh] w-full max-w-[34rem] flex-col overflow-hidden rounded-t-[1.5rem] bg-paper shadow-2xl sm:rounded-[1.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="relative h-12 w-[2.4rem] shrink-0 overflow-hidden rounded-md border border-line bg-peach">
            <Image src={design.image} alt="" fill sizes="40px" className="object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.7rem] font-bold uppercase tracking-[0.14em] text-burnished-deep">{design.name} · {design.priceLabel}</p>
            <h2 id="dfy-title" className="font-editorial text-[1.3rem] font-semibold leading-tight text-charcoal">
              {state === 'sent' ? 'Got it. We’re on it.' : 'Our team fills it in for you'}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal/60 hover:bg-charcoal/5">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {state === 'sent' ? (
          <div className="overflow-y-auto px-5 py-6">
            <p className="text-[0.95rem] leading-7 text-charcoal">
              Your request number is <strong>#{ref}</strong>. We’ll fill in your invitation and send you a link on WhatsApp within 24 hours. You’ll see the whole invitation before paying anything, and you can change any detail.
            </p>
            <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: 'rgba(31,168,85,0.35)', background: 'rgba(31,168,85,0.05)' }}>
              <p className="text-[0.9rem] font-semibold text-charcoal">Have photos you’d like on it?</p>
              <p className="mt-0.5 text-[0.82rem] leading-6 text-muted">Send them on WhatsApp with your request number, and any song you’d like to play.</p>
              <a
                href={photosLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('dfy_photos', { template_id: design.id })}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.95rem] font-bold text-white"
                style={{ background: WHATSAPP_GREEN }}
              >
                <WhatsAppIcon className="h-5 w-5" />
                Send photos on WhatsApp
              </a>
            </div>
            <button type="button" onClick={onClose} className="btn-outline mt-4 w-full rounded-full py-3 text-[0.9rem] font-semibold">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <p className="text-[0.85rem] leading-6 text-muted">
                Tell us what you know; leave out what isn’t decided yet. We fill in the invitation and send it to you on WhatsApp within 24 hours. You see it all before you pay.
              </p>

              <fieldset className="space-y-3">
                <legend className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-charcoal/60">About you</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="dfy-name" className={label}>Your name <span className="text-burnished-deep">*</span></label>
                    <input ref={firstBox} id="dfy-name" required autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label htmlFor="dfy-phone" className={label}>WhatsApp number <span className="text-burnished-deep">*</span></label>
                    <input id="dfy-phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" aria-describedby="dfy-phone-hint" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={input} />
                    <p id="dfy-phone-hint" className="mt-1 text-[0.72rem] text-muted">Outside India? Start with + and your country code.</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="dfy-email" className={label}>Email <span className="font-normal text-muted">(optional)</span></label>
                  <input id="dfy-email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={input} />
                </div>
              </fieldset>

              {first.length > 0 && (
                <fieldset className="space-y-3">
                  <legend className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-charcoal/60">The invitation</legend>
                  {first.map(box)}
                </fieldset>
              )}

              {more.length > 0 && (
                <details className="group rounded-2xl border border-line bg-white/60 px-4 py-3" open={first.length === 0}>
                  <summary className="cursor-pointer list-none text-[0.88rem] font-semibold text-charcoal">
                    More details <span className="font-normal text-muted">(optional: functions, schedule, message…)</span>
                    <span aria-hidden className="float-right transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="mt-3 space-y-3">{more.map(box)}</div>
                </details>
              )}

              <div>
                <label htmlFor="dfy-notes" className={label}>Anything else? <span className="font-normal text-muted">(optional)</span></label>
                <textarea id="dfy-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={input} placeholder="Wording you like, changes to the design, a custom idea, the language you’d like it in…" />
              </div>

              {/* A box people never see: only bots fill it in. */}
              <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="dfy-website">Website</label>
                <input id="dfy-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>

            <div className="border-t border-line bg-paper px-5 py-4">
              {error && <p role="alert" className="mb-2 text-[0.82rem] text-[#A33A3A]">{error}</p>}
              <button
                type="submit"
                disabled={state === 'sending' || !contact.name.trim() || contact.phone.replace(/\D/g, '').length < 10}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.95rem] font-bold text-white transition-opacity disabled:opacity-50"
                style={{ background: WHATSAPP_GREEN }}
              >
                {state === 'sending' ? 'Sending…' : 'Send to our team'}
              </button>
              <p className="mt-2 text-center text-[0.72rem] text-muted">
                Prefer to chat?{' '}
                <a href={supportWhatsAppUrl(`Hi ShareInvite! Please fill in my invitation for me: ${design.name}.`)} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  Message us on WhatsApp
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
