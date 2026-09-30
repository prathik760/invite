'use client'

import { useState } from 'react'

const EVENT_TYPES = [
  'Wedding', 'Engagement', 'Birthday', 'House Warming', 'Naming Ceremony',
  'Anniversary', 'Baby Shower', 'Festival Celebration', 'Corporate Event', 'Other',
]

export default function CustomRequestSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', eventType: '', description: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.eventType || !form.description.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/custom-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', phone: '', eventType: '', description: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="custom-template"
      className="relative overflow-hidden border-t border-line bg-peach/50 px-5 py-16 sm:py-20"
    >
      {/* Decorative background rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-burnished/10" />
        <div className="absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-burnished/10" />
        <div className="absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full border border-burnished/10" />
        <div
          className="absolute right-0 top-0 h-72 w-72 opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(217,164,65,0.22), transparent 65%)' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">

          {/* ── Left: Copy ── */}
          <div>
            {/* Highlight badge */}
            <p className="eyebrow mb-3">Custom designs</p>

            <h2 className="font-editorial text-[2.6rem] font-semibold leading-[1.05] text-charcoal sm:text-[3.3rem]">
              Celebrating something else?<br />
              <em className="font-medium text-burnished">We&apos;ll design it.</em>
            </h2>

            <p className="t-lede mt-5 max-w-md">
              Baby shower, graduation, a corporate launch, a reunion — tell us your vision and our design team
              will craft an invitation for your event, style and language.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-4">
              {[
                { icon: '✦', title: 'Tailored design language', desc: 'Custom colors, fonts, motifs matching your exact theme' },
                { icon: '✦', title: 'Any occasion or occasion style', desc: 'Fusion, regional, modern, or completely original' },
                { icon: '✦', title: 'Fast turnaround', desc: 'Your custom template ready in 2–5 working days' },
                { icon: '✦', title: 'Delivered as a live link', desc: 'Same WhatsApp-shareable invite website as all templates' },
              ].map(item => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span className="mt-1 shrink-0 text-[10px] text-burnished">{item.icon}</span>
                  <div>
                    <p className="text-[0.95rem] font-semibold text-charcoal">{item.title}</p>
                    <p className="mt-0.5 text-[0.85rem] leading-6 text-charcoal/70">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* A "12+ custom templates delivered this month" line with stock
                pravatar.cc faces labelled "ShareInvite customer" used to sit here.
                Neither the count nor the people were real, so it was removed. */}
          </div>

          {/* ── Right: Form ── */}
          <div
            className="card p-7 sm:p-9"
            data-reveal="right"
          >
            {/* Gold top bar */}
            <div className="mb-7 h-[3px] rounded-full bg-gradient-to-r from-emerald via-burnished to-gold-soft" />

            {status === 'sent' ? (
              <div className="text-center py-8">
                <div className="mb-4 select-none text-5xl text-burnished-deep">✦</div>
                <h3 className="t-h3 mb-2">Request received</h3>
                <p className="text-sm text-muted leading-7 max-w-xs mx-auto">
                  Our design team will reach out within 24 hours to discuss your custom template.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                  style={{ background: 'rgba(11,74,52,0.08)', color: '#0B4A34', border: '1px solid rgba(11,74,52,0.2)' }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="t-h3 mb-1">Request a custom design</h3>
                  <p className="text-xs text-muted leading-5">Fill in your details and describe your vision — we&apos;ll take it from there.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">
                      Your Name <span className="text-burnished-deep">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Priya Sharma"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91 98765 43210"
                      className="field-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">
                    Email Address <span className="text-burnished-deep">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="priya@example.com"
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="custom-request-event-type" className="field-label">
                    Event Type <span className="text-burnished-deep">*</span>
                  </label>
                  <select
                    id="custom-request-event-type"
                    required
                    value={form.eventType}
                    onChange={set('eventType')}
                    className="field-input"
                    style={{ color: form.eventType ? undefined : 'rgba(44,32,28,0.4)' }}
                  >
                    <option value="" disabled>Select your event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="field-label">
                    Your Vision <span className="text-burnished-deep">*</span>
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={set('description')}
                    rows={4}
                    placeholder="Describe your dream invitation — style, colours, theme, any special elements or references you love…"
                    className="field-input resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs font-medium" style={{ color: '#B96B70' }}>
                    Something went wrong. Please try again or contact us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-[0.95rem] font-semibold disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending your request…
                    </>
                  ) : (
                    <>
                      Send Custom Request
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-muted/60">
                  We typically respond within 24 hours · No upfront payment required
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
