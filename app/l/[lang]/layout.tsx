import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import I18nProvider from '@/components/i18n/I18nProvider'
import { INDIAN_LOCALES, getLocale, isIndianLocale } from '@/lib/i18n'
import { clientDictionary } from '@/lib/dictionaries'
import { setServerLang } from '@/lib/serverLang'

/**
 * The Indian-language pages (/hi, /ta/pricing, /te/templates/…). Visitors never see /l/…:
 * middleware.ts rewrites /<lang>/… here, and sends /l/… back to the public address.
 * Every page is built ahead, one per language.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return INDIAN_LOCALES.map((lang) => ({ lang }))
}

export default function LocaleLayout({ params, children }: { params: { lang: string }; children: ReactNode }) {
  if (!isIndianLocale(params.lang)) notFound()
  setServerLang(params.lang)
  const locale = getLocale(params.lang)
  return (
    <I18nProvider lang={params.lang} dict={clientDictionary(params.lang)}>
      {/* The root layout says lang="en" (it is shared and static); this page's language, for screen readers and search. */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(locale.htmlLang)}` }} />
      <div lang={locale.htmlLang} className="contents">
        {children}
      </div>
    </I18nProvider>
  )
}
