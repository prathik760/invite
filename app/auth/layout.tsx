import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | ShareInvite',
  robots: { index: false, follow: false },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'}/auth/login` },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
