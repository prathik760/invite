import { MetadataRoute } from 'next'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          // Only paths that must never be fetched at all.
          //
          // /auth/, /dashboard/ and /admin/ were previously disallowed here.
          // That is self-defeating: all three already send
          // `robots: { index: false }` in their metadata, but a disallowed URL
          // is never fetched, so Google never reads the noindex — it just
          // indexes the URL from external links with no snippet. That is
          // exactly what Search Console reports for /auth/login
          // ("Indexed, though blocked by robots.txt").
          //
          // Letting Googlebot crawl them means it reads the noindex and drops
          // them properly. To block a page from the index, allow the crawl.
          //
          // /admin/ stays blocked: it is gated by a ?token= check against
          // ADMIN_SECRET, has no SEO purpose, and nothing links to it — so
          // there is no indexing risk to solve by allowing the crawl.
          '/api/',
          '/admin/',
          '/e/__custom-requests__/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
