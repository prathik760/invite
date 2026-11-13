import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'

export const metadata: Metadata = {
  // Was 'Authentication | ShareInvite', which the root template turned into
  // "Authentication | ShareInvite | ShareInvite" in GA4 and browser tabs. A
  // plain string here would also stop the root template reaching the login and
  // signup titles, so the template is restated for them.
  title: { default: 'Log in or sign up | ShareInvite', template: '%s | ShareInvite' },
  robots: { index: false, follow: false },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'}/auth/login` },
}

/** Login, sign-up and password reset share one frame (components/auth/AuthShell), also used in the Indian languages. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>
}
