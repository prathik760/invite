'use client'

import { useState } from 'react'
import Link from '@/components/ui/Link'
import { AuthAlert, Spinner } from '@/components/auth/AuthFormParts'
import { authHref } from '@/lib/authRedirect'
import { trackEvent } from '@/lib/analytics'
import { rich } from '@/lib/translate'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * "Forgot password": asks for the email and sends a reset link (app/api/auth/forgot). The page says
 * the same thing whether or not the address has an account. The return address travels on, so
 * after the reset the person carries on where they were (the builder with their design, say).
 */
export default function ForgotForm({ callbackUrl, from }: { callbackUrl: string; from: string | null }) {
  const tr = useT()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter the email address you signed up with.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, callbackUrl }) }).catch(() => null)
    setLoading(false)
    if (!res) { setError('We could not reach ShareInvite. Check your connection and try again.'); return }
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) { setError(body.error || 'Something went wrong. Please try again.'); return }
    trackEvent('password_reset_request', { context: from ?? 'direct' })
    setSent(true)
  }

  return (
    <div className="w-full max-w-[34rem]">
      <div className="card p-6 sm:p-10">
        <p className="eyebrow">{tr('Forgot your password?')}</p>
        <h1 className="t-h2 mt-2">{sent ? tr('Check your email') : tr('Reset your password')}</h1>
        {sent ? (
          <div role="status" className="mt-3 space-y-3 text-[0.95rem] leading-7 text-charcoal/75">
            <p>
              {rich(tr('If {email} has a ShareInvite account, a link to choose a new password is on its way. It works once and for 30 minutes.'), { email: <span className="font-semibold text-charcoal">{email.trim()}</span> })}
            </p>
            <p>{tr('Nothing there after a few minutes? Check your spam folder, or ask again.')}</p>
            <button type="button" onClick={() => setSent(false)} className="link">{tr('Use a different email')}</button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/70">
              {tr('Enter the email you use for ShareInvite and we will send you a link to choose a new password.')}
            </p>
            {error && <AuthAlert>{tr(error)}</AuthAlert>}
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="forgot-email" className="field-label">{tr('Email address')}</label>
                <input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field-input" aria-invalid={error ? true : undefined} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[0.98rem] font-semibold disabled:opacity-60">
                {loading && <Spinner />}
                {loading ? tr('Sending…') : tr('Send reset link')}
              </button>
            </form>
          </>
        )}
      </div>
      <p className="mt-6 text-center text-[0.92rem] text-charcoal/70">
        {tr('Remembered it?')}{' '}
        <Link href={authHref('/auth/login', callbackUrl, from)} className="link">{tr('Back to sign in')}</Link>
      </p>
    </div>
  )
}
