import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import { OCCASIONS } from '@/lib/catalog'
import { DEFAULT_LOCALE, isIndianLocale, localePath } from '@/lib/i18n'
import { t } from '@/content/translations'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import MobileMenu from '@/components/layout/MobileMenu'
import Logo from '@/components/brand/Logo'
import TrackedLink from '@/components/ui/TrackedLink'
import NavLink from '@/components/layout/NavLink'
import OccasionsMenu from '@/components/layout/OccasionsMenu'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { serverLang, serverT } from '@/lib/serverLang'

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
  { label: 'Pricing', key: 'nav.pricing', href: '/pricing', description: 'One-time pricing per template, no subscription.' },
  { label: 'Blog', key: 'nav.blog', href: '/blog', description: 'Guides, wording ideas and inspiration for digital invitations.' },
] as const

const LINK = 'rounded-full px-3 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach'

export default function SiteHeader({
  /** Lets an occasion page send visitors straight to its own template. */
  createHref = '/create',
  createLabel,
  /** Localised homepages pass their locale so the chrome speaks it too. */
  locale = DEFAULT_LOCALE,
  /** Analytics placement of the Create button (the homepage keeps its own, "home_header"). */
  ctaLocation = 'site_header',
}: {
  createHref?: string
  createLabel?: string
  locale?: string
  ctaLocation?: string
}) {
  // The page's language: a localised homepage passes it; the Indian-language pages set it per render.
  const lang = locale !== DEFAULT_LOCALE ? locale : serverLang()
  const tr = serverT()
  const indian = isIndianLocale(lang)
  const navLabel = (item: (typeof NAV)[number]) => (indian ? tr(item.label) : t(item.key, locale))
  const cta = createLabel ? tr(createLabel) : indian ? tr('Create invitation') : t('nav.create', locale)
  const [templates, ...rest] = NAV

  return (
    <header
      className="sticky border-b border-line bg-champagne/95 backdrop-blur-xl"
      // Below the sticky offer bar while one is showing (components/marketing/PromoBar).
      style={{ zIndex: 'var(--z-sticky-header)' as unknown as number, top: 'var(--promo-bar-h, 0px)' }}
    >
      {/* The same container as every page's content (.shell), so the logo lines up with the page.
          Below 360px (small Androids, iPhone SE 1st gen) logo + CTA + menu need ~35px more than the
          row has, so type and spacing tighten there only. */}
      <div className="shell flex h-[4.6rem] items-center gap-3 max-[359px]:gap-2">
        <Link href={localePath('/', locale)} className="flex shrink-0 items-center gap-2" aria-label={tr('ShareInvite home')}>
          <Logo className="max-[359px]:gap-2 max-[359px]:[&>span:last-child]:text-[1.4rem]" />
        </Link>

        {/* Real links, not anchors: an in-page anchor is invisible to Google as a route and cannot
            become a sitelink. Hidden (not removed) below lg, so the links stay in the markup
            crawlers read. Wedding, Birthday and Engagement (the homepage navbar's own links) lead
            the Occasions menu: as separate links they would not fit the 80rem bar beside the rest. */}
        <nav aria-label={tr('Main')} className="ms-5 hidden flex-1 items-center gap-0.5 lg:flex xl:ms-6">
          <OccasionsMenu label={tr('Occasions')}>
            <div className="w-[34rem] rounded-2xl border border-line bg-paper p-3 shadow-lift">
              <ul className="grid grid-cols-2 gap-1">
                {OCCASIONS.map((o) => (
                  <li key={o.key}>
                    <Link href={o.href} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-peach">
                      <Image src={o.image} alt="" width={44} height={39} className="h-10 w-11 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0">
                        <span className="block text-[0.9rem] font-semibold text-charcoal">{tr(o.label)}</span>
                        <span className="block truncate text-[0.75rem] text-muted">{tr(o.blurb)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-peach/70 px-3 py-2.5 text-[0.82rem]">
                <span className="text-charcoal">{tr('Planning something else?')}</span>
                <Link href="/#custom-template" className="font-semibold text-emerald-soft hover:underline">
                  {tr('Request a custom design')}
                </Link>
              </div>
            </div>
          </OccasionsMenu>

          <NavLink href={templates.href} className={LINK}>
            {navLabel(templates)}
          </NavLink>
          {rest.map((item) => (
            <NavLink key={item.href} href={item.href} className={LINK}>
              {navLabel(item)}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 max-[359px]:gap-1">
          <LanguageSwitcher className="hidden md:block" />
          <NavLink href="/dashboard" className={`${LINK} hidden md:inline-flex`}>
            {tr('My invitations')}
          </NavLink>
          <TrackedLink
            href={createHref}
            location={ctaLocation}
            className="btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.88rem] font-semibold max-[359px]:px-3 max-[359px]:text-[0.82rem] sm:px-5 sm:text-[0.95rem]"
          >
            {cta}
            <ArrowRightIcon className="hidden h-3.5 w-3.5 sm:block" />
          </TrackedLink>
          <MobileMenu createHref={createHref} createLabel={cta} locale={lang} />
        </div>
      </div>
    </header>
  )
}
