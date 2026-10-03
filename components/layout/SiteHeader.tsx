import Image from 'next/image'
import Link from 'next/link'
import { OCCASIONS } from '@/lib/catalog'
import { DEFAULT_LOCALE, localePath } from '@/lib/i18n'
import { t } from '@/content/translations'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import MobileMenu from '@/components/layout/MobileMenu'
import Logo from '@/components/brand/Logo'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon, ChevronDownIcon } from '@/components/ui/Icons'

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
  { label: 'Templates', key: 'nav.templates', href: '/templates', description: 'Browse digital invitation templates for weddings, birthdays, festivals, anniversaries and every celebration.' },
  { label: 'Pricing', key: 'nav.pricing', href: '/pricing', description: 'One-time pricing per template — no subscription.' },
  { label: 'Blog', key: 'nav.blog', href: '/blog', description: 'Guides, wording ideas and inspiration for digital invitations.' },
] as const

export default function SiteHeader({
  /** Lets an occasion page send visitors straight to its own template. */
  createHref = '/create',
  createLabel,
  /** Localised homepages pass their locale so the chrome speaks it too. */
  locale = DEFAULT_LOCALE,
}: {
  createHref?: string
  createLabel?: string
  locale?: string
}) {
  const cta = createLabel ?? t('nav.create', locale)
  const [templates, ...rest] = NAV

  return (
    <header
      className="sticky border-b border-line bg-champagne/95 backdrop-blur-xl"
      // Below the sticky offer bar while one is showing (components/marketing/PromoBar).
      style={{ zIndex: 'var(--z-sticky-header)' as unknown as number, top: 'var(--promo-bar-h, 0px)' }}
    >
      {/* Below 360px (small Androids, iPhone SE 1st gen) logo + CTA + menu need
          ~35px more than the row has, so the menu button was squeezed to 17px.
          Tighten type and spacing there only. */}
      <div className="mx-auto flex h-[4.6rem] max-w-7xl items-center gap-3 px-4 max-[359px]:gap-2 max-[359px]:px-3.5 sm:px-6">
        <Link href={localePath('/', locale)} className="flex shrink-0 items-center gap-2" aria-label="ShareInvite home">
          <Logo className="max-[359px]:gap-2 max-[359px]:[&>span:last-child]:text-[1.4rem]" />
        </Link>

        {/* Real links, not anchors — an in-page anchor is invisible to Google as
            a route and cannot become a sitelink. Hidden (not removed) below lg,
            so the links stay in the markup crawlers read. */}
        <nav aria-label="Main" className="ms-6 hidden flex-1 items-center gap-1 lg:flex">
          <Link href={templates.href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach">
            {t(templates.key, locale)}
          </Link>

          {/* CSS-only dropdown: opens on hover and on keyboard focus, and its
              links are plain anchors present in the server HTML. */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach group-focus-within:bg-peach"
              aria-haspopup="true"
            >
              Occasions
              <ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-[34rem] rounded-2xl border border-line bg-paper p-3 shadow-lift">
                <ul className="grid grid-cols-2 gap-1">
                  {OCCASIONS.map((o) => (
                    <li key={o.key}>
                      <Link href={o.href} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-peach">
                        <Image src={o.image} alt="" width={44} height={39} className="h-10 w-11 shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0">
                          <span className="block text-[0.9rem] font-semibold text-charcoal">{o.label}</span>
                          <span className="block truncate text-[0.75rem] text-muted">{o.blurb}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-peach/70 px-3 py-2.5 text-[0.82rem]">
                  <span className="text-charcoal">Planning something else?</span>
                  <Link href="/#custom-template" className="font-semibold text-emerald-soft hover:underline">
                    Request a custom design
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {rest.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach"
            >
              {t(item.key, locale)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 max-[359px]:gap-1">
          <LanguageSwitcher className="hidden md:block" />
          <Link
            href="/dashboard"
            className="hidden rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach md:inline-flex"
          >
            My invitations
          </Link>
          <TrackedLink
            href={createHref}
            location="site_header"
            className="btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.88rem] font-semibold max-[359px]:px-3 max-[359px]:text-[0.82rem] sm:px-5 sm:text-[0.95rem]"
          >
            {cta}
            <ArrowRightIcon className="hidden h-3.5 w-3.5 sm:block" />
          </TrackedLink>
          <MobileMenu createHref={createHref} createLabel={cta} locale={locale} />
        </div>
      </div>
    </header>
  )
}
