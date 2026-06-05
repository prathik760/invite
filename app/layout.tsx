import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

const cormorant = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const greatVibes = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-great-vibes',
  display: 'swap',
  preload: false,
})

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T6G94KKL'
const OG_IMAGE = `${APP_URL}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
    template: '%s | ShareInvite',
  },
  description:
    'Create stunning digital wedding invitations, birthday invitations, engagement invitations, and event invites. Share instantly on WhatsApp with RSVP tracking.',
  keywords: [
    'digital invitation maker',
    'wedding invitation maker',
    'online wedding card',
    'digital wedding invitation',
    'whatsapp invitation card',
    'event invitation website',
    'engagement invitation card',
    'birthday invitation maker',
    'housewarming invitation',
    'online RSVP platform',
    'digital invitation card India',
    'Indian wedding e-invite',
    'online invitation maker India',
    'griha pravesh invitation',
    'namakaran invitation',
    'naming ceremony invitation',
    'anniversary invitation online',
    'corporate event invitation',
    'baby shower invitation',
    'free invitation website India',
  ],
  openGraph: {
    title: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
    description:
      'Create stunning digital wedding invitations, birthday invitations, engagement invitations, and event invites. Share instantly on WhatsApp with RSVP tracking.',
    type: 'website',
    siteName: 'ShareInvite',
    url: APP_URL,
    locale: 'en_IN',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
    description:
      'Create stunning digital wedding invitations and share instantly on WhatsApp with RSVP tracking. Free to start.',
    images: [OG_IMAGE],
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
