import { NAV } from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import AnimateOnScroll from '@/components/AnimateOnScroll'

// The SocialProofNotification widget was removed here. It synthesised
// "<Name> from <City> just created a <type> invitation" toasts by picking at
// random from a static list in data/socialProof.ts — none of it reflected real
// activity. Fabricated social proof is a consumer-protection problem and, on a
// site whose measured activity is ~1 invitation created per 28 days, an easy
// one to disprove. Reinstate only when backed by real published-invite data
// (a lightweight endpoint over the Event table would do it).

const WhatsAppButton = dynamic(
  () => import('@/components/WhatsAppButton'),
  { ssr: false },
)

// Seasonal promotion, shown once the visitor scrolls past PROMO.triggerAtScroll
// or reaches the footer. ssr:false keeps it out of the
// initial payload and off the LCP path — it is a post-engagement prompt, so it
// must cost nothing until the visitor has actually engaged.
const ScrollPromo = dynamic(
  () => import('@/components/marketing/ScrollPromoMount'),
  { ssr: false },
)

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5377FL2P'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-5NYQ140ED1'
const OG_IMAGE = `${APP_URL}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Free Digital Wedding Invitations India | ShareInvite',
    template: '%s | ShareInvite',
  },
  description:
    'Create stunning digital wedding invitations, birthday invitations, engagement invitations, and event invites. Share instantly on WhatsApp with RSVP tracking.',
  keywords: [
    'digital invitation maker',
    'free digital invitation maker India',
    'online invitation card maker',
    'wedding invitation maker',
    'online wedding card',
    'digital wedding invitation',
    'whatsapp invitation card',
    'e-invitation WhatsApp',
    'shaadi card online',
    'wedding card design online India',
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
    'free invitation website India',
    'digital wedding card free',
    'invitation link share WhatsApp',
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
    site: '@shareinvite',
    creator: '@shareinvite',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/logo1.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: { url: '/logo1.png', sizes: '1024x1024', type: 'image/png' },
    shortcut: '/favicon-48.png',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${APP_URL}/#organization`,
  name: 'ShareInvite',
  url: APP_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${APP_URL}/#logo`,
    url: `${APP_URL}/logo1.png`,
    contentUrl: `${APP_URL}/logo1.png`,
    width: 512,
    height: 512,
    caption: 'ShareInvite',
  },
  description: 'Digital invitation website builder for Indian weddings, birthdays, and family events.',
  foundingDate: '2026',
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
  '@id': `${APP_URL}/#website`,
  name: 'ShareInvite',
  url: APP_URL,
  description: 'Digital invitation website builder for Indian weddings and events.',
  publisher: { '@id': `${APP_URL}/#organization` },
  // No `potentialAction: SearchAction` here. It only ever powered the sitelinks
  // search box, which Google retired globally on 21 November 2024 — the markup
  // now renders nothing. `name` is what still matters: it is the source of the
  // site name shown above the result.
}

const navSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  // Derived from the same NAV array the header renders, plus the create route.
  // The hand-written version listed /templates as a nav item while the header
  // linked to an on-page #templates anchor — the markup described navigation
  // the site did not have.
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Create Invitation',
      description: 'Build a digital wedding, birthday, or event invitation in minutes.',
      url: `${APP_URL}/create`,
    },
    ...NAV.map((item, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 2,
      name: item.label,
      description: item.description,
      url: `${APP_URL}${item.href}`,
    })),
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <meta name="theme-color" content="#7A3E4A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }} />
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
        <AnimateOnScroll />
        <SessionProvider>{children}</SessionProvider>
        <WhatsAppButton />
        <ScrollPromo />
        {GTM_ID && (
          <Script
            id="gtm"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga4" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
