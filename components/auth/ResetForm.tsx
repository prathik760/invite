'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from '@/components/ui/Link'
import { AuthAlert, PasswordEye, Spinner } from '@/components/auth/AuthFormParts'
import { authHref } from '@/lib/authRedirect'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * Choose a new password from an emailed link (app/api/auth/reset). On success the person is signed
 * in and taken on to where they were going; an expired or used link says so and offers a new one.
 */
export default function ResetForm({ token, callbackUrl, expired }: { token: string; callbackUrl: string; expired: boolean }) {
  const tr = useT()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(expired ? 'This reset link has expired or has already been used. Ask for a new one below.' : '')
  const [dead, setDead] = useState(expired)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Your new password needs at least 8 characters.'); return }
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) }).catch(() => null)
    if (!res) { setLoading(false); setError('We could not reach ShareInvite. Check your connection and try again.'); return }
    const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string; email?: string }
    if (!res.ok || !body.email) {
      setLoading(false)
      setError(body.error || 'Something went wrong. Please try again.')
      if (body.code === 'TOKEN_INVALID') setDead(true)
      return
    }
    trackEvent('password_reset_complete', {})
    const result = await signIn('credentials', { email: body.email, password, redirect: false })
    if (result?.error) { router.push(authHref('/auth/login', callbackUrl, null)); return }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="w-full max-w-[34rem]">
      <div className="card p-6 sm:p-10">
        <p className="eyebrow">{tr('Your ShareInvite account')}</p>
        <h1 className="t-h2 mt-2">{tr('Choose a new password')}</h1>
        {error && <AuthAlert>{tr(error)}</AuthAlert>}
        {dead ? (
          <Link href={`/auth/forgot${callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="btn-primary mt-6 flex w-full items-center justify-center rounded-full px-5 py-4 text-[0.98rem] font-semibold">
            {tr('Send me a new link')}
          </Link>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="reset-password" className="field-label">{tr('New password')}</label>
              <div className="relative">
                <input id="reset-password" type={show ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={tr('At least 8 characters')} className="field-input pr-12" aria-describedby="reset-hint" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-peach hover:text-charcoal" aria-label={show ? tr('Hide password') : tr('Show password')}>
                  <PasswordEye open={show} />
                </button>
              </div>
              <p id="reset-hint" className="field-hint">{tr('Use 8 or more characters.')}</p>
            </div>
            <div>
              <label htmlFor="reset-confirm" className="field-label">{tr('Type it again')}</label>
              <input id="reset-confirm" type={show ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field-input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[0.98rem] font-semibold disabled:opacity-60">
              {loading && <Spinner />}
              {loading ? tr('Saving…') : tr('Save and sign in')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
