import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import { LogoMark } from '@/components/brand/Logo'
import { ArrowRightIcon } from '@/components/ui/Icons'

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
    <>
      <SiteHeader />
      <main className="relative overflow-hidden bg-champagne px-5 py-20 text-charcoal sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_0%,rgba(232,200,102,0.22),transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-2xl text-center">
          <LogoMark className="enter-0 mx-auto h-16 w-16" />
          <p className="eyebrow enter-0 mt-6">Error 404</p>
          <h1 className="t-h1 enter-0 mt-3">This invitation seems to have wandered off</h1>
          <p className="t-lede enter-1 mx-auto mt-4 max-w-lg">
            The link may be out of date or mistyped. Here are the places people usually want.
          </p>

          <div className="enter-2 mt-10 grid gap-3 text-left sm:grid-cols-2">
            {[
              { href: '/templates', title: 'Invitation designs', desc: 'Browse every design with its price' },
              { href: '/create', title: 'Create an invitation', desc: 'Build and preview free' },
              { href: '/wedding-invitation', title: 'Wedding invitations', desc: 'Classic, cinematic and traditional designs' },
              { href: '/birthday-invitation', title: 'Birthday invitations', desc: 'Countdown, gallery and party details' },
              { href: '/blog', title: 'Guides & wording', desc: 'Invitation messages you can copy' },
              { href: '/pricing', title: 'Pricing', desc: 'One design, one price, no subscription' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="lift group flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-4">
                <span>
                  <span className="block font-editorial text-[1.25rem] font-semibold leading-tight">{link.title}</span>
                  <span className="mt-0.5 block text-[0.8rem] text-muted">{link.desc}</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-burnished transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          <Link href="/" className="btn-primary mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold">
            Back to ShareInvite home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
