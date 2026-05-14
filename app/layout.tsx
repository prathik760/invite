import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Invitely — Free Digital Wedding Invitation Builder',
    template: '%s | Invitely',
  },
  description:
    'Create beautiful digital wedding invitation websites in minutes. Share a link, collect heartfelt wishes, and make your big day unforgettable. Free online invitation builder.',
  keywords: [
    'digital invitation website',
    'wedding invitation online',
    'free invitation builder',
    'event invitation link',
    'digital wedding card',
    'birthday invitation link',
    'online invitation maker',
    'wedding website builder',
    'share wedding invitation',
  ],
  openGraph: {
    title: 'Invitely — Free Digital Wedding Invitation Builder',
    description:
      'Create beautiful digital wedding invitation websites in minutes. Share a link, collect wishes, and make your big day unforgettable.',
    type: 'website',
    siteName: 'Invitely',
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitely — Free Digital Wedding Invitation Builder',
    description: 'Create beautiful digital wedding invitation websites in minutes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
