import Link from 'next/link'
import type { Metadata } from 'next'

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
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-md text-center">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{ background: 'rgba(217,164,65,0.12)', color: '#B87924' }}
          aria-hidden
        >
          ✉
        </div>
        <h1 className="font-display text-3xl font-normal leading-tight text-ink">
          This invitation isn&apos;t available
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The link may have been removed by the host, or the event may have already passed.
          If you were expecting an invitation, ask the host to resend their link.
        </p>

        <div className="mt-8 rounded-2xl border border-[#E8DCCD] bg-[#FFF9F2] p-6">
          <p className="font-heading text-base text-ink">Planning something yourself?</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Create a digital invitation with a live countdown, photo gallery, Google Maps
            directions and guest wishes — one link you can share on WhatsApp.
          </p>
          <Link
            href="/create?src=invite_not_found"
            className="gold-button mt-5 inline-flex rounded-full px-7 py-3 text-sm font-semibold"
          >
            Create an invitation →
          </Link>
          <p className="mt-3 text-xs text-muted">
            Free to build &amp; preview · Paid templates from ₹99 one-time
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link href="/templates" className="font-semibold text-accent-strong hover:underline">Browse templates</Link>
          <Link href="/pricing" className="font-semibold text-accent-strong hover:underline">Pricing</Link>
          <Link href="/" className="font-semibold text-accent-strong hover:underline">ShareInvite home</Link>
        </div>
      </div>
    </main>
  )
}
