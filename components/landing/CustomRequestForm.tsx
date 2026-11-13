'use client'

import { useState } from 'react'
import { useT } from '@/components/i18n/I18nProvider'

const EVENT_TYPES = [
  'Wedding', 'Engagement', 'Birthday', 'House Warming', 'Naming Ceremony',
  'Anniversary', 'Baby Shower', 'Festival Celebration', 'Corporate Event', 'Other',
]

type Field = 'name' | 'email' | 'phone' | 'eventType' | 'description'
const EMPTY: Record<Field, string> = { name: '', email: '', phone: '', eventType: '', description: '' }

/**
 * The custom-design request form, posting to /api/custom-request as it always has. Used by the
 * homepage's custom-design section and the Contact page. Every field has a label and its own
 * message; the server's reason is shown when it refuses; sending and sent are clear.
 */
export default function CustomRequestForm({ idPrefix = 'custom-request', heading = 'Request a custom design' }: { idPrefix?: string; heading?: string }) {
  const tr = useT()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const id = (f: Field) => `${idPrefix}-${f}`

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) e.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter an email address we can reply to.'
    if (!form.eventType) e.eventType = 'Please choose the kind of event.'
    if (!form.description.trim()) e.description = 'Please describe the invitation you have in mind.'
    else if (form.description.length > 2000) e.description = 'Please keep it under 2,000 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending'); setServerError('')
    try {
      const res = await fetch('/api/custom-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        setStatus('sent')
        setForm(EMPTY)
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setServerError(body.error || tr('Something went wrong. Please try again or write to us directly.'))
        setStatus('error')
      }
    } catch {
      setServerError(tr('We could not reach ShareInvite. Check your connection and try again.'))
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-hv-forest text-hv-ivory" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="t-h3 mb-2">{tr('Request received')}</h3>
        <p className="mx-auto max-w-xs text-sm leading-7 text-muted">{tr('Our design team will reach out within 24 hours to discuss your custom template.')}</p>
        <button type="button" onClick={() => setStatus('idle')} className="hv-btn-line mt-6 !min-h-[2.75rem] !px-5 !py-2 !text-[0.9rem]">
          {tr('Send another request')}
        </button>
      </div>
    )
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${id(f)}-error`} className="field-error">
        {tr(errors[f] as string)}
      </p>
    ) : null
  const aria = (f: Field) => (errors[f] ? { 'aria-invalid': true as const, 'aria-describedby': `${id(f)}-error` } : {})

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-sm:space-y-4" noValidate>
      <div>
        <h3 className="t-h3 mb-1">{tr(heading)}</h3>
        <p className="text-[0.85rem] leading-6 text-muted">{tr('Fill in your details and describe your vision. We’ll take it from there.')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className="field-label">{tr('Your name')} <span className="text-burnished-deep">*</span></label>
          <input id={id('name')} type="text" autoComplete="name" value={form.name} onChange={set('name')} placeholder={tr('Priya Sharma')} className="field-input" {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor={id('phone')} className="field-label">{tr('Phone')} <span className="font-normal text-muted">{tr('(optional)')}</span></label>
          <input id={id('phone')} type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor={id('email')} className="field-label">{tr('Email address')} <span className="text-burnished-deep">*</span></label>
        <input id={id('email')} type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="priya@example.com" className="field-input" {...aria('email')} />
        {err('email')}
      </div>

      <div>
        <label htmlFor={id('eventType')} className="field-label">{tr('Event type')} <span className="text-burnished-deep">*</span></label>
        <select id={id('eventType')} value={form.eventType} onChange={set('eventType')} className={`field-input ${form.eventType ? '' : 'text-muted'}`} {...aria('eventType')}>
          <option value="" disabled>{tr('Select your event type…')}</option>
          {EVENT_TYPES.map((ev) => <option key={ev} value={ev}>{tr(ev)}</option>)}
        </select>
        {err('eventType')}
      </div>

      <div>
        <label htmlFor={id('description')} className="field-label">{tr('Your vision')} <span className="text-burnished-deep">*</span></label>
        <textarea id={id('description')} value={form.description} onChange={set('description')} rows={4} maxLength={2000} placeholder={tr('Describe your dream invitation: style, colours, theme, any special elements or references you love…')} className="field-input resize-none" {...aria('description')} />
        {err('description')}
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-xl border border-[#A33A3A]/20 bg-[#A33A3A]/[0.06] px-4 py-3 text-[0.88rem] font-medium text-[#A33A3A]">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className="hv-btn w-full disabled:opacity-60">
        {status === 'sending' ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {tr('Sending your request…')}
          </>
        ) : (
          <>
            {tr('Send custom request')}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-[0.78rem] text-muted">{tr('We typically respond within 24 hours · No upfront payment required')}</p>
    </form>
  )
}
