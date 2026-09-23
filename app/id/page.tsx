import type { Metadata } from 'next'
import LocalisedHome from '@/components/i18n/LocalisedHome'
import { getLocale, hreflangAlternates } from '@/lib/i18n'
import { t } from '@/content/translations'
import { SITE_URL } from '@/lib/seo'

// Static locale route. A dynamic [locale] segment cannot be used here because
// app/[slug] already occupies that position, and Next forbids two differently
// named dynamic segments at the same level. The locale set is fixed, so an
// explicit folder per language is simpler and fully static anyway.
const LOCALE = 'id'

export function generateMetadata(): Metadata {
  const locale = getLocale(LOCALE)
  const url = `${SITE_URL}/${LOCALE}`
  const title = `ShareInvite — ${t('hero.tagline', LOCALE)}`
  const description = t('hero.sub', LOCALE)
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: hreflangAlternates('/', SITE_URL),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'ShareInvite',
      locale: locale.htmlLang.replace('-', '_'),
    },
    robots: { index: true, follow: true },
  }
}

export default function Page() {
  return <LocalisedHome locale={LOCALE} />
}
