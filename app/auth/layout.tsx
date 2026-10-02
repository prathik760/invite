import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Logo, { LogoMark } from '@/components/brand/Logo'
import TrustList from '@/components/brand/TrustList'
import { PayMethods } from '@/components/price/Price'

export const metadata: Metadata = {
  // Was 'Authentication | ShareInvite', which the root template turned into
  // "Authentication | ShareInvite | ShareInvite" in GA4 and browser tabs. A
  // plain string here would also stop the root template reaching the login and
  // signup titles, so the template is restated for them.
  title: { default: 'Log in or sign up | ShareInvite', template: '%s | ShareInvite' },
  robots: { index: false, follow: false },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'}/auth/login` },
}

/**
 * Shared frame for login and sign-up: an emerald brand panel on the left (a
 * slim brand strip on phones) and the form on the right. The pages render only
 * their form card, so both screens stay visually identical.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-champagne text-charcoal lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* ── Phones: brand strip ── */}
      <div className="relative overflow-hidden bg-emerald text-paper lg:hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(232,200,102,0.2),transparent_65%)]"
        />
        <div className="relative flex items-center justify-between gap-3 px-4 pb-4 pt-5 sm:px-6">
          <Link href="/" aria-label="ShareInvite home" className="rounded-lg">
            <Logo tone="light" markClassName="h-8 w-8" />
          </Link>
          <Link href="/" className="rounded-full border border-paper/20 px-3.5 py-1.5 text-[0.82rem] font-semibold text-paper/85 transition-colors hover:bg-paper/10">
            Back to home
          </Link>
        </div>
        <div className="relative px-4 pb-5 sm:px-6">
          <TrustList tone="dark" className="!gap-x-4 !gap-y-1.5 !text-[0.82rem]" />
        </div>
      </div>

      {/* ── Desktop: brand panel ── */}
      <aside className="relative hidden overflow-hidden bg-emerald text-paper lg:block" aria-label="About ShareInvite">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_15%,rgba(232,200,102,0.18),transparent_70%),radial-gradient(70%_60%_at_0%_100%,rgba(11,74,52,0.9),transparent_70%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[34rem] w-[34rem] rounded-full border border-gold-soft/10" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full border border-gold-soft/10" />

        <div className="sticky top-0 flex min-h-screen flex-col justify-between gap-10 p-10 xl:p-14">
          <Link href="/" aria-label="ShareInvite home" className="enter-0 self-start rounded-lg">
            <Logo tone="light" />
          </Link>

          <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="enter-1">
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft">Digital invitations for every celebration</p>
              <p className="t-h2 mt-4 max-w-md">
                Invitations as beautiful as <em className="font-medium text-gold-soft">the moment.</em>
              </p>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-7 text-paper/70">
                Choose a design, make it yours and send one link your guests open on any phone.
              </p>
            </div>

            {/* One real design, so the panel shows the product rather than describing it. */}
            <figure className="enter-3 relative mx-auto w-fit xl:mx-0">
              <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gold-soft/10 blur-2xl" />
              <div className="float-slower relative" style={{ ['--tilt' as string]: '-3deg' }}>
                <div className="relative aspect-[4/5] w-[min(24vh,13rem)] overflow-hidden rounded-[1.4rem] border border-gold-soft/30 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/templates/luxury-wedding.jpg"
                    alt="The Luxury Wedding invitation design"
                    fill
                    sizes="(min-width: 1280px) 16rem, (min-width: 1024px) 13rem, 1px"
                    className="object-cover"
                  />
                </div>
                <span aria-hidden className="absolute -bottom-4 -left-4 rounded-full bg-emerald p-1 shadow-lift">
                  <LogoMark className="h-11 w-11" />
                </span>
              </div>
              <svg aria-hidden viewBox="0 0 24 24" className="spark-twinkle absolute -right-3 -top-3 h-6 w-6 text-gold-soft" fill="currentColor">
                <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
              </svg>
              <figcaption className="mt-9 text-center text-[0.78rem] text-paper/55">Shown: the Luxury Wedding design</figcaption>
            </figure>
          </div>

          <div className="enter-2 border-t border-paper/10 pt-6">
            <TrustList tone="dark" />
            <p className="mt-3 text-[0.8rem] text-paper/50">Secure one-time payments by Razorpay — <PayMethods />.</p>
          </div>
        </div>
      </aside>

      {/* ── Form column ── */}
      <main className="flex flex-col px-4 pb-12 pt-6 sm:px-6 lg:min-h-screen lg:px-12 lg:pt-8 xl:px-16">
        <div className="hidden justify-end lg:flex">
          <Link href="/" className="rounded-full px-3.5 py-2 text-[0.9rem] font-semibold text-charcoal/75 transition-colors hover:bg-peach hover:text-charcoal">
            ← Back to home
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center pt-2 sm:items-center sm:py-10">{children}</div>
      </main>
    </div>
  )
}
