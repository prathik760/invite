'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

const BRAND_FEATURES = [
  'Mobile-first invitation websites — built for India',
  'Real-time preview as you fill the form',
  'WhatsApp sharing, gallery, music & countdown',
  'Collect and approve guest wishes from your dashboard',
]

function AuthBrandPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0"
      style={{ background: '#221B17' }}
    >
      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 10% 110%,rgba(217,164,65,0.18),transparent)' }} />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 95% 5%,rgba(217,164,65,0.09),transparent)' }} />
      {/* Decorative ring */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full"
        style={{ border: '1px solid rgba(217,164,65,0.08)' }} />

      {/* Logo */}
      <div className="relative">
        <Link href="/" className="font-display text-3xl tracking-wide text-white hover:opacity-80 transition-opacity">
          ShareInvite
        </Link>
        <p className="mt-1 text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Digital Invitation Builder
        </p>
      </div>

      {/* Main copy */}
      <div className="relative">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: '#D9A441' }}>
          Crafted for every celebration
        </p>
        <h2 className="font-display font-normal text-3xl xl:text-4xl text-white leading-[1.15]">
          Invitations as beautiful as the moment.
        </h2>
        <ul className="mt-8 space-y-4">
          {BRAND_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 text-[#D9A441]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Social proof */}
      <div className="relative">
        <blockquote
          className="rounded-2xl px-5 py-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-3 w-3" viewBox="0 0 24 24" fill="#D9A441">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            &ldquo;Made our wedding invite in 10 minutes. Everyone asked how we did it.&rdquo;
          </p>
          <p className="mt-2 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Meera &amp; Karthik · Bengaluru
          </p>
        </blockquote>
      </div>
    </div>
  )
}

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

  return (
    <div
      className="flex min-h-screen lg:min-h-0 flex-1 flex-col items-center justify-center px-5 py-12"
      style={{ background: 'linear-gradient(160deg, #FFF8F1 0%, #FBF7F1 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: BEZIER }}
        className="w-full max-w-[400px]"
      >
        {/* Logo — mobile only */}
        <div className="text-center mb-10 lg:hidden">
          <Link href="/" className="font-display text-3xl tracking-wide text-ink hover:opacity-70 transition-opacity">
            ShareInvite
          </Link>
          <div className="mt-1.5 text-xs tracking-[0.24em] uppercase text-muted">
            Digital Invitation Builder
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 sm:p-9"
          style={{ background: '#FFFFFF', border: '1px solid #E8DCCD', boxShadow: '0 24px 64px rgba(60,36,20,0.10)' }}
        >
          <div className="mb-7">
            <h1 className="font-display text-3xl text-ink mb-1.5 font-normal">Welcome back</h1>
            <p className="text-sm text-muted leading-relaxed">
              Sign in to manage your invitations and guest wishes.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(185,107,112,0.08)', border: '1px solid rgba(185,107,112,0.22)' }}
            >
              <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B96B70' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm" style={{ color: '#B96B70' }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7E716B' }}>
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7E716B' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full rounded-xl px-5 py-3.5 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#B87924' }}>
            Create one →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
