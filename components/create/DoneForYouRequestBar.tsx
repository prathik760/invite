'use client'

import { useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { supportWhatsAppUrl } from '@/lib/support'
import { dfyCustomerPath, DFY_STATUS_LABEL, type DfyStatus } from '@/lib/doneForYouShared'

/**
 * The builder opened from a done-for-you request (app/create, ?request=<token>; lib/doneForYou.ts).
 *
 * For the team (the admin page's link, which carries the team key after #): who asked, their notes,
 * and "Save for customer", which stores the invitation as it stands in the builder and gives the
 * link to send them. For the customer: a line saying the team made it, so they check it and publish.
 */

export interface DfyBuilderState {
  token: string
  ref: string
  status: DfyStatus
  firstName: string
  team: null | {
    key: string
    contact: { name: string; phone: string; email?: string }
    extras: Record<string, string>
    notes: string
  }
}

const GREEN = '#1FA855'

export default function DoneForYouRequestBar({ req, templateId, designName, data, onStatus }: {
  req: DfyBuilderState
  templateId: string
  designName: string
  data: Record<string, string>
  onStatus: (s: DfyStatus) => void
}) {
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const link = typeof window === 'undefined' ? dfyCustomerPath(req.token) : `${window.location.origin}${dfyCustomerPath(req.token)}`

  if (!req.team) {
    return (
      <div className="mx-4 mt-3 rounded-2xl border px-3.5 py-2.5 sm:mx-5" style={{ borderColor: 'rgba(31,168,85,0.35)', background: 'rgba(31,168,85,0.05)' }}>
        <p className="text-[0.82rem] leading-5 text-charcoal/85">
          {req.status === 'new' || req.status === 'working' ? (
            <><span className="font-semibold text-charcoal">We’re still making your invitation</span> (request #{req.ref}). We’ll message you on WhatsApp when it’s ready; here is what we have so far.</>
          ) : (
            <><span className="font-semibold text-charcoal">Made for you by the ShareInvite team</span> (request #{req.ref}). Check every detail, change anything you like, then publish it.</>
          )}{' '}
          <a href={supportWhatsAppUrl(`Hi ShareInvite! About my invitation, request #${req.ref}:`)} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: '#137A3E' }}>
            Questions? WhatsApp us
          </a>
        </p>
      </div>
    )
  }

  const { contact, extras, notes } = req.team
  const wa = (text: string) => `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`
  const sendText = `Hi ${req.firstName}, your ${designName} invitation is ready: ${link}\n\nOpen it to see the whole invitation, change anything you like, and publish it when you are happy. Any questions, just reply here.`
  const notesShown = [...Object.values(extras), notes].filter(Boolean)

  async function save() {
    setSaving('saving')
    setMessage('')
    try {
      const res = await fetch(`/api/done-for-you/${encodeURIComponent(req.token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-team-key': req.team!.key },
        body: JSON.stringify({ templateId, data }),
      })
      const body = (await res.json().catch(() => ({}))) as { status?: DfyStatus; error?: string }
      if (!res.ok) throw new Error(body.error || 'Could not save.')
      if (body.status) onStatus(body.status)
      setSaving('saved')
      trackEvent('dfy_team_save', { template_id: templateId })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save.')
      setSaving('error')
    }
  }

  return (
    <div className="mx-4 mt-3 rounded-2xl border-2 px-3.5 py-3 sm:mx-5" style={{ borderColor: '#0B4A34', background: '#F3FAF5' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.82rem] leading-5 text-charcoal">
          <span className="font-bold">Team · request #{req.ref}</span> for {contact.name} · {DFY_STATUS_LABEL[req.status]}
        </p>
        <a href={wa(`Hi ${req.firstName}, this is ShareInvite about your ${designName} invitation (request #${req.ref}). `)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[0.78rem] font-semibold" style={{ color: '#137A3E' }}>
          <WhatsAppIcon className="h-3.5 w-3.5" /> +{contact.phone}
        </a>
      </div>
      {notesShown.length > 0 && (
        <details className="mt-2 text-[0.78rem] text-charcoal/85">
          <summary className="cursor-pointer font-semibold">Their notes and lists ({notesShown.length})</summary>
          <div className="mt-1.5 space-y-1.5 whitespace-pre-wrap rounded-xl bg-white p-2.5">{notesShown.map((n, i) => <p key={i}>{n}</p>)}</div>
        </details>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={saving === 'saving'} className="rounded-xl px-3.5 py-2 text-[0.8rem] font-bold text-white disabled:opacity-60" style={{ background: '#0B4A34' }}>
          {saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved ✓ Save again' : 'Save for customer'}
        </button>
        {saving === 'saved' && (
          <>
            <a href={wa(sendText)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[0.8rem] font-bold text-white" style={{ background: GREEN }}>
              <WhatsAppIcon className="h-4 w-4" /> Send them the link
            </a>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(link).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000) }).catch(() => {}) }}
              className="rounded-xl border border-line bg-white px-3.5 py-2 text-[0.8rem] font-semibold text-charcoal"
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </>
        )}
      </div>
      {message && <p role="alert" className="mt-1.5 text-[0.75rem] text-[#A33A3A]">{message}</p>}
      <p className="mt-1.5 text-[0.7rem] leading-4 text-charcoal/60">Don’t publish it from here: the customer publishes and pays from their link, with the same checkout as everyone.</p>
    </div>
  )
}
