'use client'

import { useState } from 'react'
import Link from '@/components/ui/Link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { trackEvent } from '@/lib/analytics'
import { motion } from 'framer-motion'
import GoogleButton from '@/components/auth/GoogleButton'
import { AuthAlert, OrDivider, PasswordEye, Spinner } from '@/components/auth/AuthFormParts'
import AuthGate, { type AuthFrom } from '@/components/auth/AuthGate'
import { authHref, withParam } from '@/lib/authRedirect'
import type { DesignSummary } from '@/lib/designSummary'
import { useT } from '@/components/i18n/I18nProvider'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

// The brand panel (and the old unverified five-star "testimonial" it carried)
// now lives in app/auth/layout.tsx; this page renders only its form card.

export default function LoginForm({ callbackUrl, from, design }: { callbackUrl: string; from: AuthFrom; design: DesignSummary | null }) {
  const tr = useT()
  const router = useRouter()
  // callbackUrl arrives already checked (same-site only) by the server page: lib/authRedirect.

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Incorrect email or password. Please try again.')
    } else {
      trackEvent('login', { method: 'password', context: from ?? 'direct' })
      router.push(from ? withParam(callbackUrl, 'auth', 'password') : callbackUrl)
      router.refresh()
    }
  }

  // Arriving from the builder means a design is waiting — say so.
  const fromBuilder = !!from || callbackUrl.startsWith('/create')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full max-w-[34rem]"
    >
      <div className="card p-6 sm:p-10">
        <p className="eyebrow">{fromBuilder ? tr('One step before you customize') : tr('Welcome back')}</p>
        <h1 className="t-h2 mt-2">{fromBuilder ? tr('Sign in to customize') : tr('Sign in')}</h1>
        <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/70">
          {fromBuilder
            ? tr('You need a free account to personalize and save an invitation. Browsing and previews never need one.')
            : tr('Manage your invitations and see the wishes your guests leave.')}
        </p>

        <div className="mt-6">
          <AuthGate page="login" from={from} callbackUrl={callbackUrl} design={design} />
        </div>

        {error && <AuthAlert>{tr(error)}</AuthAlert>}

        <div className="mt-7">
          <GoogleButton callbackUrl={from ? withParam(callbackUrl, 'auth', 'google') : callbackUrl} label={tr('Continue with Google')} />
        </div>

        <OrDivider label={tr('or use your email')} />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="field-label">{tr('Email address')}</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="login-password" className="field-label">{tr('Password')}</label>
              <Link href={`/auth/forgot${authHref('/auth/login', callbackUrl, from).replace('/auth/login', '')}`} className="mb-1.5 text-[0.82rem] font-semibold text-emerald-soft hover:underline">
                {tr('Forgot password?')}
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={tr('Your password')}
                className="field-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-peach hover:text-charcoal"
                aria-label={showPw ? tr('Hide password') : tr('Show password')}
              >
                <PasswordEye open={showPw} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[0.98rem] font-semibold disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? tr('Signing in…') : tr('Sign in')}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-[0.92rem] text-charcoal/70">
        {tr('New to ShareInvite?')}{' '}
        <Link href={authHref('/auth/signup', callbackUrl, from)} className="link">
          {tr('Create an account')}
        </Link>
      </p>
    </motion.div>
  )
}

