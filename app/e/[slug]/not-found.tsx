import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoMark } from '@/components/brand/Logo'

export const metadata: Metadata = {
  title: 'Invitation not available | ShareInvite',
  robots: { index: false, follow: false },
}

/**
 * Shown when an invitation slug no longer exists.
 *
 * Search Console lists 21 of these — all deleted invitations, most of them
 * created with template default names (emily-james-*, ananya-vihaan-*,
 * reena-rocky-*). A 404 is the correct response and Google will drop them, so
 * the status code is unchanged.
 *
 * What was wrong is the experience: anyone arriving here clicked an invitation
 * link someone sent them, which makes them the most pre-qualified visitor the
 * site gets — and they were being shown Next's unstyled default 404 with no
 * branding and no way onward.
 */
export default function InvitationNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-champagne px-5 py-16 text-charcoal">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_50%_0%,rgba(232,200,102,0.2),transparent_70%)]" />
      <div className="relative w-full max-w-md text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="t-h2 mt-6">This invitation isn&apos;t available</h1>
        <p className="mt-4 text-[0.98rem] leading-7 text-charcoal/70">
          The link may have been removed by the host, or the event may have already passed.
          If you were expecting an invitation, ask the host to resend their link.
        </p>

        <div className="card mt-9 p-6 text-left sm:p-7">
          <p className="t-h3">Planning something yourself?</p>
          <p className="mt-2 text-[0.92rem] leading-6 text-charcoal/70">
            Create a digital invitation with a live countdown, photo gallery, Google Maps
            directions and guest wishes — one link you can share on WhatsApp.
          </p>
          <Link href="/create?src=invite_not_found" className="btn-primary mt-5 inline-flex rounded-full px-7 py-3 text-[0.9rem] font-semibold">
            Create an invitation
          </Link>
          <p className="mt-3 text-[0.78rem] text-muted">
            Free to build &amp; preview · One price per design, from ₹99
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.9rem]">
          <Link href="/templates" className="link">Browse designs</Link>
          <Link href="/pricing" className="link">Pricing</Link>
          <Link href="/" className="link">ShareInvite home</Link>
        </div>
      </div>
    </main>
  )
}
