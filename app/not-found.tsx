import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found | ShareInvite',
  robots: { index: false, follow: false },
}

/**
 * Site-wide 404. The app had no not-found.tsx at any level, so every missing
 * URL rendered Next's unstyled default — no header, no navigation, no way back
 * into the site. Still a genuine 404 status; only the page body changes.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">404</p>
        <h1 className="mt-4 font-display text-4xl font-normal leading-tight text-ink">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The link may be out of date or mistyped. Here are the places people usually want.
        </p>

        <div className="mt-9 grid gap-3 text-left sm:grid-cols-2">
          {[
            { href: '/templates', title: 'Invitation templates', desc: 'Browse every design with prices' },
            { href: '/create', title: 'Create an invitation', desc: 'Build and preview free in 5 minutes' },
            { href: '/wedding-invitation', title: 'Wedding invitations', desc: 'Digital shaadi invites for India' },
            { href: '/birthday-invitation', title: 'Birthday invitations', desc: 'Countdown, gallery and party details' },
            { href: '/blog', title: 'Guides & wording', desc: 'Invitation messages you can copy' },
            { href: '/pricing', title: 'Pricing', desc: 'One-time payment, no subscription' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border bg-white p-4 transition-colors hover:border-[#D9A441]/60"
            >
              <p className="text-sm font-semibold text-ink">{link.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{link.desc}</p>
            </Link>
          ))}
        </div>

        <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-accent-strong hover:underline">
          ← Back to ShareInvite home
        </Link>
      </div>
    </main>
  )
}
