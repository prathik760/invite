/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
    ],
  },
  async redirects() {
    return [
      // The www -> apex redirect that used to live here has been removed.
      //
      // www.shareinvite.in is now a domain managed by Vercel, and Vercel applies
      // its own domain-level redirect at the edge before the app ever runs.
      // Keeping a second, app-level rule made the two halves of a redirect loop
      // the moment the Vercel side was pointed apex -> www: the edge sent
      // shareinvite.in to www (307), this rule sent it straight back (308), and
      // the site became unreachable.
      //
      // Domain canonicalisation now has exactly one owner: Vercel. Set the apex
      // as the primary domain there and have www redirect to it — that is the
      // direction every canonical tag, the sitemap and NEXT_PUBLIC_APP_URL
      // already assume.
      // Namakaran city pages don't exist — redirect to parent so Google stops 404ing them
      {
        source: '/namakaran-invitation/:city',
        destination: '/namakaran-invitation',
        permanent: true,
      },
      // /naming-ceremony-invitations duplicates /namakaran-invitation: same
      // query intent, same templates, generic body copy. app/sitemap.ts already
      // excluded it on the assumption this redirect existed — it did not, so the
      // page stayed live and indexable and competed with the page we want to
      // rank. Single hop, straight to the final canonical URL.
      {
        source: '/naming-ceremony-invitations',
        destination: '/namakaran-invitation',
        permanent: true,
      },
      // Consolidate the housewarming-wording blog into the authoritative wording page
      // (same search intent — avoids keyword cannibalisation, passes link equity).
      {
        source: '/blog/housewarming-invitation-wording-for-griha-pravesh',
        destination: '/griha-pravesh-invitation-wording',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // Published invitations are private to the host and their guests, and
        // must never appear in search. The pages already send
        // `robots: noindex, nofollow` in their metadata, but /e/:slug/
        // opengraph-image returns an image/png and therefore cannot carry a
        // meta tag at all — an HTTP header is the only way to exclude it.
        // Search Console had it under "Crawled - currently not indexed".
        //
        // This also backstops the HTML pages: a header cannot be lost the way a
        // metadata export can if that code is refactored.
        //
        // Safe for link previews — WhatsApp, Facebook and Twitter scrapers
        // ignore X-Robots-Tag, so OG images still render in shared chats.
        source: '/e/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https:",
              "connect-src 'self' https://checkout.razorpay.com https://www.google-analytics.com https://api.razorpay.com https://*.r2.cloudflarestorage.com https://www.googletagmanager.com",
              "frame-src https://api.razorpay.com https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
