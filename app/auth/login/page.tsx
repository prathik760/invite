'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import GoogleButton from '@/components/auth/GoogleButton'
import { AuthAlert, OrDivider, PasswordEye, Spinner, withCallback } from '@/components/auth/AuthFormParts'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

// The brand panel (and the old unverified five-star "testimonial" it carried)
// now lives in app/auth/layout.tsx; this page renders only its form card.

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get('callbackUrl') || '/dashboard'
  // Only allow same-origin redirects — strip any external URL to prevent open-redirect phishing
  const callbackUrl = rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/dashboard'

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
      router.push(callbackUrl)
      router.refresh()
    }
  }

  // Arriving from the builder means a design is waiting — say so.
  const fromBuilder = callbackUrl.startsWith('/create')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full max-w-[34rem]"
    >
      <div className="card p-6 sm:p-10">
        <p className="eyebrow">{fromBuilder ? 'Almost there' : 'Welcome back'}</p>
        <h1 className="t-h2 mt-2">Sign in</h1>
        <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/70">
          {fromBuilder
            ? 'Sign in to publish your invitation — your design and details are saved.'
            : 'Manage your invitations and see the wishes your guests leave.'}
        </p>

        {error && <AuthAlert>{error}</AuthAlert>}

        <div className="mt-7">
          <GoogleButton callbackUrl={callbackUrl} label="Continue with Google" />
        </div>

        <OrDivider />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="field-label">Email address</label>
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
            <label htmlFor="login-password" className="field-label">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="field-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-peach hover:text-charcoal"
                aria-label={showPw ? 'Hide password' : 'Show password'}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-[0.92rem] text-charcoal/70">
        New to ShareInvite?{' '}
        <Link href={withCallback('/auth/signup', callbackUrl)} className="link">
          Create a free account
        </Link>
      </p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
