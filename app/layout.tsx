import { NAV } from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import AnimateOnScroll from '@/components/AnimateOnScroll'
// Imported directly, not lazily: it must be listening from hydration, or a
// visitor who leaves within seconds is never recorded (lib/journal.ts).
import JournalTracker from '@/components/providers/JournalTracker'
// Also direct: in the UK and EU it has to ask before the trackers start.
import CookieConsent from '@/components/providers/CookieConsent'
import { hreflangAlternates } from '@/lib/i18n'
import { consentBootScript } from '@/lib/consent'
import { COUNTRY_COOKIE } from '@/lib/pricing'

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

// Offers another language based on the browser's declared preference. ssr:false
// because it depends on navigator.language, and it must never redirect — see
// lib/i18n.ts for why a geo-redirect would stop the other locales being indexed.
const LocaleSuggestion = dynamic(
  () => import('@/components/i18n/LocaleSuggestion'),
  { ssr: false },
)


// The editorial display face for marketing headings. Self-hosted by next/font
// at build time, so it adds no third-party request and no layout shift. It is
// exposed only as --font-editorial: the invitation templates read
// --font-display, which is deliberately left untouched.
const editorial = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-editorial',
})

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5377FL2P'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-5NYQ140ED1'
// Meta Pixel, for measuring Facebook/Instagram ads. Off until the ID is set.
// Digits only, so a stray space or quote in the dashboard cannot break the script.
const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '').replace(/\D/g, '')
// Microsoft Clarity: screen recordings and heatmaps of each visit. Off until the
// project ID (clarity.microsoft.com → Settings → Overview) is set.
const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID ?? '').replace(/[^a-z0-9]/gi, '')
const OG_IMAGE = `${APP_URL}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Digital Invitation Maker for Every Celebration | ShareInvite',
    template: '%s | ShareInvite',
  },
  description:
    'Beautiful digital invitations for weddings, birthdays, engagements and every celebration. Build and preview before you pay, pay once for your design, and share one link on WhatsApp.',
  keywords: [
    'digital invitation maker',
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
    'invitation link share WhatsApp',
  ],
  openGraph: {
    title: 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform',
    description:
      'Beautiful digital invitations for weddings, birthdays, engagements and every celebration. Build and preview before you pay, pay once for your design, and share one link on WhatsApp.',
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
      'Beautiful digital invitations for every celebration. Build and preview before you pay, pay once for your design, share one link on WhatsApp.',
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: APP_URL,
    // Reciprocal hreflang. Google discards one-directional annotations, so the
    // English root must point at every locale exactly as each locale points
    // back here. Root is also x-default: where an unmatched visitor belongs.
    languages: hreflangAlternates('/', APP_URL),
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
      { url: '/brand/mark-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/brand/mark-180.png', sizes: '180x180', type: 'image/png' },
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
    url: `${APP_URL}/brand/mark-512.png`,
    contentUrl: `${APP_URL}/brand/mark-512.png`,
    width: 512,
    height: 512,
    caption: 'ShareInvite',
  },
  description: 'Digital invitation maker for weddings, birthdays, festivals and every celebration — shared with one link, anywhere in the world.',
  foundingDate: '2026',
  areaServed: 'Worldwide',
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
  description: 'Digital invitation maker for weddings, birthdays and every celebration.',
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
    // `en` matches the root's hreflang (lib/i18n.ts). `en-IN` told crawlers the
    // English site was for India only while hreflang offered it as x-default.
    // suppressHydrationWarning: the pricing script below may add data-cc
    // before React hydrates.
    <html lang="en" className={editorial.variable} suppressHydrationWarning>
      <head>
        {/* Cookie consent (lib/consent.ts): first, so that in the UK, EU and
            Switzerland every tracker below waits for the visitor's answer. */}
        <script dangerouslySetInnerHTML={{ __html: consentBootScript() }} />
        {/* Country pricing (lib/pricing.ts): marks visitors outside India before
            the first paint, so the INR prices in the static HTML stay hidden
            until <Price> swaps in their own currency. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var m=document.cookie.match(/(?:^|;\\s*)${COUNTRY_COOKIE}=([A-Za-z]{2})/);if(m&&m[1].toUpperCase()!=='IN')document.documentElement.setAttribute('data-cc',m[1].toUpperCase())}catch(e){}`,
          }}
        />
        <meta name="theme-color" content="#052E20" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* Meta Pixel: queues events from the first paint, but downloads Meta's
            script only once the page has loaded, so it never delays it. Skipped
            inside frames (the live-preview phone), and on the invitations guests
            open (/e/…): their addresses carry the hosts' names, and guests are
            not the audience. Waits for consent where it is needed
            (lib/consent.ts). Events are sent from lib/analytics.ts. */}
        {META_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(w,d,id){if(!w.siConsent||w.top!==w||/^\\/e\\//.test(location.pathname))return;w.siConsent.run(function(){if(w.fbq)return;var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};w._fbq=w._fbq||n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];n('init',id);n('track','PageView');function l(){var s=d.createElement('script');s.async=!0;s.src='https://connect.facebook.net/en_US/fbevents.js';d.head.appendChild(s)}function i(){w.requestIdleCallback?w.requestIdleCallback(l,{timeout:3000}):setTimeout(l,1)}d.readyState==='complete'?i():w.addEventListener('load',i)})}(window,document,'${META_PIXEL_ID}');`,
            }}
          />
        )}
        {/* Microsoft Clarity: same rules as the pixel above, plus the admin pages
            and visitors who ask not to be tracked (Global Privacy Control). It
            masks every form field; the builder preview is masked in
            PreviewPane. Waits for consent where it is needed, and is then told
            it was given (Clarity's consentv2). lib/analytics.ts tags each
            recording with funnel steps. */}
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(w,d,id){if(!w.siConsent||w.top!==w||navigator.globalPrivacyControl||/^\\/(e|admin)(\\/|$)/.test(location.pathname))return;w.siConsent.run(function(){if(w.clarity)return;w.clarity=function(){(w.clarity.q=w.clarity.q||[]).push(arguments)};if(w.siConsent.choice)w.clarity('consentv2',{ad_Storage:'granted',analytics_Storage:'granted'});function l(){var s=d.createElement('script');s.async=!0;s.src='https://www.clarity.ms/tag/'+id;d.head.appendChild(s)}function i(){w.requestIdleCallback?w.requestIdleCallback(l,{timeout:3000}):setTimeout(l,1)}d.readyState==='complete'?i():w.addEventListener('load',i)})}(window,document,'${CLARITY_ID}');`,
            }}
          />
        )}
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
        <LocaleSuggestion />
        <AnimateOnScroll />
        <SessionProvider>{children}</SessionProvider>
        <JournalTracker />
        <CookieConsent />
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
