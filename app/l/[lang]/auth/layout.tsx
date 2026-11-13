import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import { setServerLang, tFor } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const t = tFor(params.lang)
  return {
    title: { default: t('Log in or sign up | ShareInvite'), template: '%s | ShareInvite' },
    robots: { index: false, follow: false },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'}/auth/login` },
  }
}

/** Sign-in in the Indian languages: the same frame and forms as /auth, in the reader's language. */
export default function LocaleAuthLayout({ params, children }: { params: { lang: string }; children: React.ReactNode }) {
  setServerLang(params.lang)
  return <AuthShell>{children}</AuthShell>
}
