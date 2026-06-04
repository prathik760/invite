import type { Metadata } from 'next'
import { Lora, Great_Vibes } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

const cormorant = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T6G94KKL'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'ShareInvite — Free Digital Invitation Website Builder for Indian Weddings & Events',
    template: '%s | ShareInvite',
  },
  description:
    'Create a stunning digital invitation website for your Indian wedding, birthday, engagement, house warming, naming ceremony or anniversary. 10 templates. WhatsApp-ready link in 5 minutes. Free to start.',
  keywords: [
    'digital invitation website India',
    'online wedding invitation India',
    'free wedding invitation website',
    'digital wedding card India',
    'WhatsApp wedding invitation link',
    'digital birthday invitation India',
    'online invitation maker India',
    'Indian wedding e-invite',
    'house warming invitation online',
    'namakaran invitation website',
    'engagement invitation website India',
    'anniversary invitation website',
    'wedding invitation website free',
    'digital invitation card WhatsApp',
  ],
  openGraph: {
    title: 'ShareInvite — Free Digital Invitation Website Builder for Indian Weddings & Events',
    description:
      'Create a beautiful digital invitation website for your Indian wedding, birthday, house warming, naming ceremony, or engagement. WhatsApp-ready link in 5 minutes. Free to start.',
    type: 'website',
    siteName: 'ShareInvite',
    url: APP_URL,
    locale: 'en_IN',
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ShareInvite — Digital Invitation Website Builder for Indian Weddings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareInvite — Free Digital Invitation Website for Indian Weddings',
    description: 'Beautiful digital invite websites — WhatsApp-ready in 5 minutes. Free to start.',
    images: [`${APP_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: APP_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ShareInvite',
  url: APP_URL,
  logo: `${APP_URL}/logo.png`,
  description: 'Digital invitation website builder for Indian weddings, birthdays, and family events.',
  foundingDate: '2024',
  areaServed: { '@type': 'Country', name: 'India' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/shareinvite.in',
    'https://www.facebook.com/shareinvite.in',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShareInvite',
  url: APP_URL,
  description: 'Digital invitation website builder for Indian weddings and events.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${APP_URL}/create`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${greatVibes.variable}`}>
      <head>
        <meta name="theme-color" content="#B87924" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <SessionProvider>{children}</SessionProvider>
        {GTM_ID && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
