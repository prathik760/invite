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
      className="relative overflow-hidden px-5 py-20 sm:py-28"
      style={{ background: 'linear-gradient(165deg, #FAF3E8 0%, #FFF9F2 40%, #F5EDE2 100%)' }}
    >
      {/* Decorative background rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-[#D9A441]/12" />
        <div className="absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-[#D9A441]/10" />
        <div className="absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full border border-[#D9A441]/08" />
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
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#D9A441]/40 bg-white px-5 py-2.5 shadow-sm">
              <span className="flex h-2 w-2 rounded-full" style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)' }} />
              <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: '#B87924' }}>
                Custom Templates
              </span>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                style={{ background: 'rgba(47,118,109,0.12)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.25)' }}>
                New
              </span>
            </div>

            <h2 className="font-display font-normal text-3xl text-ink sm:text-4xl lg:text-5xl leading-[1.08]">
              Need something<br />
              <span className="gradient-accent italic">truly unique?</span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-8 text-muted">
              Tell us your vision — our design team will craft a bespoke invitation template
              tailored specifically to your event, style, and preferences.
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
                  <span className="mt-1 shrink-0 text-[10px]" style={{ color: '#D9A441' }}>{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted leading-5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#D9A441]/22 bg-white/70 px-5 py-4">
              <div className="flex -space-x-2 shrink-0">
                {['https://i.pravatar.cc/40?img=12', 'https://i.pravatar.cc/40?img=25', 'https://i.pravatar.cc/40?img=33'].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" width={32} height={32}
                    className="h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                ))}
              </div>
              <p className="text-sm text-muted leading-5">
                <strong className="text-ink">12+ custom templates</strong> delivered this month
              </p>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div
            className="rounded-3xl border border-[#E8DCCD] bg-white p-7 shadow-card-md sm:p-9"
            style={{ boxShadow: '0 24px 64px rgba(60,36,20,0.10), 0 0 0 1px rgba(217,164,65,0.14)' }}
          >
            {/* Gold top bar */}
            <div className="h-[3px] rounded-full mb-7" style={{ background: 'linear-gradient(90deg, #B87924, #D9A441, #B96B70)' }} />

            {status === 'sent' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4 select-none" style={{ color: '#B87924' }}>✦</div>
                <h3 className="font-heading text-2xl text-ink mb-2">Request received!</h3>
                <p className="text-sm text-muted leading-7 max-w-xs mx-auto">
                  Our design team will reach out within 24 hours to discuss your custom template.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                  style={{ background: 'rgba(217,164,65,0.12)', color: '#B87924', border: '1px solid rgba(184,121,36,0.25)' }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-heading text-xl text-ink mb-1">Request a Custom Template</h3>
                  <p className="text-xs text-muted leading-5">Fill in your details and describe your vision — we&apos;ll take it from there.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Your Name <span style={{ color: '#B87924' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Priya Sharma"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    Email Address <span style={{ color: '#B87924' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="priya@example.com"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    Event Type <span style={{ color: '#B87924' }}>*</span>
                  </label>
                  <select
                    required
                    value={form.eventType}
                    onChange={set('eventType')}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                    style={{ color: form.eventType ? undefined : 'rgba(44,32,28,0.4)' }}
                  >
                    <option value="" disabled>Select your event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    Your Vision <span style={{ color: '#B87924' }}>*</span>
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={set('description')}
                    rows={4}
                    placeholder="Describe your dream invitation — style, colours, theme, any special elements or references you love…"
                    className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
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
                  className="gold-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold disabled:opacity-60"
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
