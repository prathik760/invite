import Link from 'next/link'
import Image from 'next/image'
import { GLOBAL_TEMPLATE_IDS, getLocale } from '@/lib/i18n'
import { t } from '@/content/translations'
import { templateSeoSlug } from '@/lib/seo'
import { TEMPLATES } from '@/modules/templates/data'
import { LOWEST_PAID_PRICE, formatTemplatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'
import { displayName } from '@/lib/catalog'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/brand/CtaBand'
import { LogoMark } from '@/components/brand/Logo'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'

// No "edit after you share" or "RSVP" here: a published invitation cannot be
// edited, and RSVP is on one design only — only promises the product keeps.
const VALUES = ['value.noApp', 'value.oneLink', 'price.previewFirst', 'price.noSubscription']

export default function LocalisedHome({ locale: L }: { locale: string }) {
  const locale = getLocale(L)

  const templates = GLOBAL_TEMPLATE_IDS
    .map((id) => TEMPLATES.find((tpl) => tpl.id === id))
    .filter(Boolean)
    .slice(0, 8) as typeof TEMPLATES

  return (
    <main className="min-h-screen bg-champagne text-charcoal" dir={locale.dir} lang={locale.htmlLang}>
      <SiteHeader locale={L} createHref="/create?src=global" />

      <section className="relative overflow-hidden border-b border-line px-4 py-16 text-center sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_10%,rgba(232,200,102,0.2),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <LogoMark className="enter-0 mx-auto mb-6 h-14 w-14" />
          <h1 className="t-h1 enter-0">
            {t('hero.tagline', L)}
          </h1>
          <p className="t-lede enter-1 mx-auto mt-6 max-w-2xl">
            {t('hero.sub', L)}
          </p>
          <div className="enter-2 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="/create?src=global_home"
              location="global_home_hero"
              meta={{ locale: L, page_type: 'localised_home' }}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-9 py-4 text-[1rem] font-semibold"
            >
              {t('cta.createInvitation', L)}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </TrackedLink>
            {/* Was a link to this same page. */}
            <a href="#templates" className="btn-outline inline-flex rounded-full px-9 py-4 text-[1rem] font-semibold">
              {t('cta.browseTemplates', L)}
            </a>
          </div>
          <p className="mt-5 text-[0.9rem] text-muted">
            {t('price.previewFirst', L)} · {t('price.oneTime', L)} · {t('price.noSubscription', L)}
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper px-4 py-10">
        <ul className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {VALUES.map((key) => (
            <li key={key} className="flex items-center gap-2.5 rounded-2xl border border-line bg-champagne p-4 text-[0.95rem] font-medium">
              <CheckIcon className="h-4 w-4 shrink-0 text-emerald-soft" />
              {t(key, L)}
            </li>
          ))}
        </ul>
      </section>

      <section id="templates" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="t-h2" data-reveal>{t('nav.templates', L)}</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
            {templates.map((tpl) => (
              <li key={tpl.id}>
                <Link
                  href={`/templates/${templateSeoSlug(tpl.id)}`}
                  className="lift group block overflow-hidden rounded-3xl border border-line bg-paper shadow-soft"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-peach">
                    <Image
                      src={templateImage(tpl.id)}
                      alt={tpl.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute end-3 top-3 rounded-full bg-charcoal/85 px-2.5 py-1 text-[0.78rem] font-bold text-paper" dir="ltr">
                      {formatTemplatePrice(tpl.id)}
                    </span>
                  </span>
                  <span className="block p-4">
                    <span className="block font-editorial text-[1.3rem] font-semibold leading-tight" dir="ltr">{displayName(tpl.name)}</span>
                    <span className="mt-1 block text-[0.8rem] leading-5 text-muted" dir="ltr">{tpl.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        eyebrow={t('price.noSubscription', L)}
        title={t('cta.createInvitation', L)}
        sub={`${t('price.previewFirst', L)} · ${t('price.oneTime', L)} — ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}+`}
        primary={{ href: '/create?src=global_home_footer', label: t('cta.start', L) }}
        secondary={null}
        location="global_home_footer"
      />

      <SiteFooter />
    </main>
  )
}
