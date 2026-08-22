import Image from 'next/image'
import Link from 'next/link'

/**
 * The one navigation for the whole site.
 *
 * Twenty-two pages each carried their own `<header>` containing nothing but the
 * logo and a single "Create Invitation" button. Only the homepage had real
 * navigation, and even there "Templates" pointed at `#templates` — an on-page
 * anchor — rather than the /templates page.
 *
 * That matters beyond tidiness. Google builds sitelinks from a site's structure
 * and internal linking, and a nav repeated across every page is the strongest
 * signal it has for which pages matter. A site whose every inner page links
 * only to "/" and "/create" is telling Google it has two pages worth knowing
 * about. The sitelinks on any large site are, visibly, just its main nav.
 *
 * `NAV` is also the source for the SiteNavigationElement JSON-LD in the root
 * layout, so the markup can never again claim a nav item the HTML does not have.
 */
export const NAV = [
  { label: 'Templates', href: '/templates', description: 'Browse digital invitation templates for weddings, birthdays, namakaran, griha pravesh and more.' },
  { label: 'Pricing', href: '/pricing', description: 'One-time pricing per template — no subscription.' },
  { label: 'Blog', href: '/blog', description: 'Guides and ideas for digital invitations for Indian weddings and events.' },
] as const

export default function SiteHeader({
  /** Lets an occasion page send visitors straight to its own template. */
  createHref = '/create',
  createLabel = 'Create Invitation',
}: {
  createHref?: string
  createLabel?: string
}) {
  return (
    <header
      className="sticky top-0 border-b border-border/60 bg-background/95 backdrop-blur-xl"
      style={{ zIndex: 'var(--z-sticky-header)' as unknown as number }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="ShareInvite home">
          <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width={120} height={32} />
          <span className="font-display text-lg tracking-wide text-ink sm:text-xl">ShareInvite</span>
        </Link>

        {/* Real links, not anchors — an in-page anchor is invisible to Google as
            a route and cannot become a sitelink. */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={createHref}
          className="gold-button shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold sm:px-5 sm:text-sm"
        >
          {createLabel}
        </Link>
      </div>

      {/* Below md the nav collapses to a scrollable strip rather than a burger:
          the links stay crawlable in the same markup and remain one tap away. */}
      <nav
        aria-label="Main"
        className="scrollbar-hide flex items-center gap-5 overflow-x-auto border-t border-border/40 px-4 py-2 md:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
