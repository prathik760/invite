'use client'

import Image from '@/components/ui/Image'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { SITE_URL, templateSeoSlug } from '@/lib/seo'
import { SUPPORT_WHATSAPP_DISPLAY, supportWhatsAppUrl } from '@/lib/support'

/*
 * "Our team fills it in for you": for customers who would rather not type out
 * a form. They message the team on WhatsApp, the team asks for what the design
 * needs, fills the builder in for them and sends the finished invitation within
 * a day. Every tap is a lead: the WhatsApp message names the design, and the
 * tap is recorded as `generate_lead` (GA4, Meta "Lead", and /admin/activity).
 */

export interface DoneForYouDesign {
  id: string
  /** Short name, e.g. "Two Worlds". */
  name: string
  image: string
  /** The price as shown to this customer, e.g. "₹3,999". */
  priceLabel: string
  price: number
  /** Names already typed, if any, so the team can pick up where they stopped. */
  names?: string
}

const WHATSAPP_GREEN = '#1FA855'

function whatsappLink(d: DoneForYouDesign): string {
  return supportWhatsAppUrl(
    [
      'Hi ShareInvite! Please fill in my invitation for me.',
      '',
      `Design: ${d.name} (${d.priceLabel})`,
      `${SITE_URL}/templates/${templateSeoSlug(d.id)}`,
      d.names ? `Names: ${d.names}` : '',
      '',
      'What details do you need from me?',
    ]
      .filter((line, i, all) => line || all[i - 1])
      .join('\n'),
  )
}

function track(d: DoneForYouDesign, source: string) {
  trackEvent(seoEvents.lead, { lead_type: 'done_for_you', template_id: d.id, template_name: d.name, price: d.price, source })
}

/** What happens, in three short steps. */
const STEPS = ['Tap below to message us on WhatsApp', 'Answer the few questions we send you', 'Get your finished invitation within 24 hours']

/**
 * The choice shown when a customer arrives at the builder with a design: fill
 * it in themselves, or have the team do it. Sits inside the builder's modal frame.
 */
export function DoneForYouChoice({ design, onSelf, onTeam }: { design: DoneForYouDesign; onSelf: () => void; onTeam: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 pr-10">
        <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-peach">
          <Image src={design.image} alt="" fill sizes="44px" className="object-cover" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.72rem] font-bold uppercase tracking-[0.16em] text-burnished-deep">{design.name} · {design.priceLabel}</p>
          <h2 className="text-balance font-editorial text-[1.55rem] font-semibold leading-tight text-charcoal">How would you like to make it?</h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onSelf}
          className="group block w-full rounded-2xl border border-line bg-white p-4 text-left transition-colors hover:border-charcoal/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-[1rem] font-semibold text-charcoal">I’ll fill it in myself</span>
            <span aria-hidden className="text-charcoal/40 transition-transform group-hover:translate-x-0.5">→</span>
          </span>
          <span className="mt-1 block text-[0.85rem] leading-6 text-muted">Type your names, dates and photos and watch it come together. About 10 minutes, and you preview before you pay.</span>
        </button>

        <div className="rounded-2xl border-2 p-4" style={{ borderColor: WHATSAPP_GREEN, background: 'linear-gradient(180deg, rgba(31,168,85,0.06), rgba(31,168,85,0.02))' }}>
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-[1rem] font-semibold text-charcoal">Let our team do it for you</span>
            <span className="rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white" style={{ background: WHATSAPP_GREEN }}>Ready in 24 hours</span>
          </p>
          <p className="mt-1 text-[0.85rem] leading-6 text-muted">Not one for forms? Chat with us on WhatsApp. We’ll ask for the details we need, fill in your invitation and send it to you.</p>
          <ol className="mt-3 space-y-1.5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-2.5 text-[0.82rem] leading-5 text-charcoal/85">
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white" style={{ background: WHATSAPP_GREEN }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <a
            href={whatsappLink(design)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track(design, 'builder_entry')
              onTeam()
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.95rem] font-bold text-white transition-[filter] hover:brightness-105"
            style={{ background: WHATSAPP_GREEN }}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat with our team on WhatsApp
          </a>
          <p className="mt-2 text-center text-[0.72rem] text-muted">We reply from {SUPPORT_WHATSAPP_DISPLAY}</p>
        </div>
      </div>
    </div>
  )
}

/** A slim reminder above the form, for anyone who starts typing and would rather not finish. */
export function DoneForYouStrip({ design }: { design: DoneForYouDesign }) {
  return (
    <a
      href={whatsappLink(design)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(design, 'builder_strip')}
      className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-colors hover:bg-white sm:mx-5 md:mx-5"
      style={{ borderColor: 'rgba(31,168,85,0.35)', background: 'rgba(31,168,85,0.05)' }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: WHATSAPP_GREEN }}>
        <WhatsAppIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 text-[0.8rem] leading-5 text-charcoal/85">
        <span className="font-semibold text-charcoal">Rather not fill this in?</span> Our team will do it for you on WhatsApp, ready in 24 hours.
      </span>
      <span aria-hidden className="shrink-0 text-[0.8rem] font-semibold" style={{ color: WHATSAPP_GREEN }}>Chat →</span>
    </a>
  )
}
