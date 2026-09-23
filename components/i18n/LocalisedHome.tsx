import Link from 'next/link'
import Image from 'next/image'
import {
  GLOBAL_TEMPLATE_IDS,
  getLocale,
  localePath,
} from '@/lib/i18n'
import { t } from '@/content/translations'
import { templateSeoSlug } from '@/lib/seo'
import { TEMPLATES } from '@/modules/templates/data'
import { LOWEST_PAID_PRICE, templatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import TrackedLink from '@/components/ui/TrackedLink'

export default function LocalisedHome({ locale: L }: { locale: string }) {
  const locale = getLocale(L)

  const templates = GLOBAL_TEMPLATE_IDS
    .map((id) => TEMPLATES.find((tpl) => tpl.id === id))
    .filter(Boolean)
    .slice(0, 9) as typeof TEMPLATES

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href={localePath('/', L)} className="flex items-center gap-2.5">
            <Image src="/logo1.png" alt="" aria-hidden width={120} height={32} className="h-8 w-auto" />
            <span className="font-display text-xl tracking-wide text-ink">ShareInvite</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/create?src=global" className="gold-button rounded-xl px-4 py-2 text-sm font-semibold">
              {t('cta.createInvitation', L)}
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#FCF7F1] px-5 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-normal leading-tight text-ink sm:text-5xl">
            {t('hero.tagline', L)}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">
            {t('hero.sub', L)}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="/create?src=global_home"
              location="global_home_hero"
              meta={{ locale: L, page_type: 'localised_home' }}
              className="gold-button rounded-full px-9 py-4 text-base font-semibold"
            >
              {t('cta.createInvitation', L)}
            </TrackedLink>
            <Link
              href={localePath('/', L)}
              className="rounded-full border border-border bg-white px-9 py-4 text-base font-semibold text-ink"
            >
              {t('cta.browseTemplates', L)}
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            {t('price.freeToBuild', L)} · {t('price.oneTime', L)} · {t('price.noSubscription', L)}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-white px-5 py-12">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {['value.noApp', 'value.oneLink', 'value.editAnytime', 'value.rsvp'].map((key) => (
            <div key={key} className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-ink">
              {t(key, L)}
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-normal text-ink">{t('nav.templates', L)}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/templates/${templateSeoSlug(tpl.id)}`}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5"
              >
                <div className="relative aspect-[3/4] bg-[#FCF7F1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={templateImage(tpl.id)}
                    alt={tpl.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold"
                    style={{ color: '#B87924' }}
                  >
                    ₹{templatePrice(tpl.id)}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-heading text-base text-ink">{tpl.name}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{tpl.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white px-5 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-normal text-ink">{t('cta.createInvitation', L)}</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            {t('price.freeToBuild', L)} · {t('price.oneTime', L)} — ₹{LOWEST_PAID_PRICE}+
          </p>
          <TrackedLink
            href="/create?src=global_home_footer"
            location="global_home_footer"
            meta={{ locale: L, page_type: 'localised_home' }}
            className="gold-button mt-7 inline-flex rounded-full px-10 py-4 text-base font-semibold"
          >
            {t('cta.start', L)}
          </TrackedLink>
          <p className="mt-8 text-xs text-muted" dir={locale.dir}>
            <Link href="/" hrefLang="en" className="underline-offset-2 hover:underline">
              English
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
