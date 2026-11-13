'use client'

import { useState } from 'react'
import Link from '@/components/ui/Link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { motion } from 'framer-motion'
import GoogleButton from '@/components/auth/GoogleButton'
import { AuthAlert, OrDivider, PasswordEye, Spinner } from '@/components/auth/AuthFormParts'
import AuthGate, { type AuthFrom } from '@/components/auth/AuthGate'
import { authHref, withParam } from '@/lib/authRedirect'
import type { DesignSummary } from '@/lib/designSummary'
import { rich } from '@/lib/translate'
import { useT } from '@/components/i18n/I18nProvider'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

// Strength meter: red → gold → emerald. Tokens are hex here because the bar is
// coloured inline per segment.
const PW_COLORS = ['', '#A33A3A', '#8C6B2C', '#123D2E']
const PW_LABELS = ['', 'Too short', 'Fair', 'Strong']

export default function SignupForm({ callbackUrl, from, design }: { callbackUrl: string; from: AuthFrom; design: DesignSummary | null }) {
  const tr = useT()
  const router = useRouter()
  // Sign-up ignored callbackUrl and always landed on /dashboard. A user who hit
  // "Create free account" from step 5 of the builder lost their place and had
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all required fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || undefined, email, password }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setLoading(false)
      setError((body as { error?: string }).error || 'Something went wrong. Please try again.')
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Account created but sign-in failed. Please sign in manually.')
    } else {
      // Fires only after the account exists and sign-in succeeded.
      trackEvent(seoEvents.signupComplete, { method: 'credentials', destination: callbackUrl, context: from ?? 'direct' })
      router.push(from ? withParam(callbackUrl, 'auth', 'password') : callbackUrl)
      router.refresh()
    }
  }

  const fromBuilder = !!from || callbackUrl.startsWith('/create')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full max-w-[34rem]"
    >
      <div className="card p-6 sm:p-10">
        <p className="eyebrow">{fromBuilder ? tr('One step before you customize') : tr('Welcome to ShareInvite')}</p>
        <h1 className="t-h2 mt-2">{tr('Create your account')}</h1>
        <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/70">
          {fromBuilder
            ? tr('A free account lets you personalize and save your invitation. You only pay when you publish.')
            : tr('Build and preview any design before you pay. You only pay when you publish.')}
        </p>

        <div className="mt-6">
          <AuthGate page="signup" from={from} callbackUrl={callbackUrl} design={design} />
        </div>

        {error && <AuthAlert>{tr(error)}</AuthAlert>}

        <div className="mt-7">
          <GoogleButton callbackUrl={from ? withParam(callbackUrl, 'auth', 'google') : callbackUrl} label={tr('Sign up with Google')} />
        </div>

        <OrDivider label={tr('or use your email')} />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="signup-name" className="field-label">
              {tr('Your name')} <span className="font-normal text-muted">{tr('(optional)')}</span>
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={tr('e.g. Priya Sharma')}
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="field-label">{tr('Email address')}</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="field-label">{tr('Password')}</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={tr('At least 8 characters')}
                aria-describedby="signup-password-hint"
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
            {password.length > 0 ? (
              <div id="signup-password-hint" className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{ background: i <= pwStrength ? PW_COLORS[pwStrength] : '#E8E2D7' }}
                    />
                  ))}
                </div>
                <span className="text-[0.75rem] font-semibold" style={{ color: PW_COLORS[pwStrength] }}>
                  {tr(PW_LABELS[pwStrength])}
                </span>
              </div>
            ) : (
              <p id="signup-password-hint" className="field-hint">{tr('Use 8 or more characters.')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[0.98rem] font-semibold disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? tr('Creating your account…') : tr('Create account')}
          </button>
        </form>

        <p className="mt-5 text-center text-[0.8rem] leading-6 text-muted">
          {rich(tr('By creating an account you agree to our {terms} and {privacy}.'), {
            terms: <Link href="/terms" className="font-semibold text-charcoal/80 underline-offset-2 hover:underline">{tr('Terms of Service')}</Link>,
            privacy: <Link href="/privacy" className="font-semibold text-charcoal/80 underline-offset-2 hover:underline">{tr('Privacy Policy')}</Link>,
          })}
        </p>
      </div>

      <p className="mt-6 text-center text-[0.92rem] text-charcoal/70">
        {tr('Already have an account?')}{' '}
        <Link href={authHref('/auth/login', callbackUrl, from)} className="link">
          {tr('Sign in')}
        </Link>
      </p>
    </motion.div>
  )
}

