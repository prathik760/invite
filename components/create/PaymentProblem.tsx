'use client'

import Link from 'next/link'
import { useState } from 'react'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { supportWhatsAppUrl } from '@/lib/support'

/**
 * Why this exists at all: every payment problem in the create flow used to be a
 * bare `alert()` — including the verification failure, which can fire *after*
 * Razorpay has taken the customer's money. A browser dialog reading "Payment
 * verification failed." with an OK button, and no reference number, is how a
 * sale becomes a chargeback and a one-star review.
 *
 * Three distinct situations, deliberately worded differently:
 *
 *  - `cancelled`    they closed the sheet. Not an error. Say plainly that
 *                   nothing was charged and offer the way back in.
 *  - `setup`        we never reached Razorpay. No money involved. Retry.
 *  - `verification` the dangerous one. Money may be gone. Lead with the
 *                   reassurance, show the payment reference, and put a human
 *                   one tap away.
 */
export type PayError = {
  kind: 'cancelled' | 'setup' | 'verification'
  message: string
  paymentId?: string
}

function CopyableRef({ paymentId }: { paymentId: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(paymentId)
          .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
          .catch(() => {})
      }}
      className="mt-2.5 flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-left transition-colors hover:border-[#0B4A34]/40"
    >
      <span className="min-w-0">
        <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-muted">Payment reference</span>
        <span className="block truncate font-mono text-[11px] text-charcoal">{paymentId}</span>
      </span>
      <span className="shrink-0 text-[10px] font-bold" style={{ color: '#0B4A34' }}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}

export default function PaymentProblem({
  error, price, templateName, onRetry, retrying,
}: {
  error: PayError
  price: number
  templateName?: string
  onRetry: () => void
  retrying: boolean
}) {
  const isCancelled = error.kind === 'cancelled'
  const isVerification = error.kind === 'verification'

  // A cancelled payment is not a failure, so it must not be dressed in red.
  const tone = isCancelled
    ? { bg: 'rgba(164,121,69,0.06)', border: 'rgba(164,121,69,0.28)', accent: '#0B4A34' }
    : { bg: 'rgba(163,58,58,0.06)', border: 'rgba(163,58,58,0.30)', accent: '#A33A3A' }

  const supportMessage = isVerification
    ? `Hi, my ShareInvite payment of ₹${price.toLocaleString('en-IN')} did not go through properly.${error.paymentId ? ` Payment reference: ${error.paymentId}.` : ''}${templateName ? ` Template: ${templateName}.` : ''} Could you check it for me?`
    : `Hi, I had trouble paying ₹${price.toLocaleString('en-IN')} on ShareInvite${templateName ? ` for the ${templateName} template` : ''}. Could you help?`

  return (
    <div
      className="mb-4 rounded-2xl p-4"
      style={{ background: tone.bg, border: `1px solid ${tone.border}` }}
      role={isCancelled ? 'status' : 'alert'}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tone.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          {isCancelled
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />}
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-charcoal">
            {isCancelled
              ? 'Payment cancelled'
              : isVerification
                ? 'We could not confirm your payment'
                : 'Payment could not be started'}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted">{error.message}</p>

          {/* The single most important sentence on this screen. */}
          {isVerification && (
            <p className="mt-2 text-[11px] font-semibold leading-5" style={{ color: '#0B4A34' }}>
              Your money is safe. If your account was charged, we will either unlock your
              template or refund you in full — send us the reference below and we will sort
              it out today.
            </p>
          )}

          {error.paymentId && <CopyableRef paymentId={error.paymentId} />}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: '#052E20' }}
        >
          {retrying ? 'Opening…' : isCancelled ? `Try again — ₹${price.toLocaleString('en-IN')}` : 'Retry payment'}
        </button>
        <a
          href={supportWhatsAppUrl(supportMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(seoEvents.supportContact, {
            channel: 'whatsapp',
            source: 'payment_error',
            error_kind: error.kind,
            transaction_id: error.paymentId,
          })}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-colors"
          style={{ borderColor: 'rgba(22,163,74,0.30)', background: 'rgba(22,163,74,0.06)', color: 'rgb(22,163,74)' }}
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.528 5.861L0 24l6.336-1.502A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 01-5.004-1.373l-.359-.214-3.741.888.944-3.619-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
          Chat with us
        </a>
        {!isCancelled && (
          <Link
            href="/refund-policy"
            target="_blank"
            className="rounded-lg border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-foreground"
          >
            Refund policy
          </Link>
        )}
      </div>
    </div>
  )
}
