import { NextResponse, type NextRequest } from 'next/server'
import { COUNTRY_COOKIE, intlPricingEnabled, normaliseCountry } from '@/lib/pricing'

/**
 * Remembers the visitor's country so static pages can show local prices
 * (lib/pricing.ts). It never redirects: language stays a choice the visitor
 * makes (lib/i18n.ts explains why a geo-redirect would break indexing).
 *
 * The cookie only decides what a page displays. The checkout reads the country
 * header itself, so editing the cookie cannot change what anyone is charged.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const current = req.cookies.get(COUNTRY_COOKIE)?.value

  if (!intlPricingEnabled()) {
    // Switched off (or back off): drop any cookie left from when it was on, or
    // pages would show a foreign price the checkout no longer charges.
    if (current) res.cookies.delete(COUNTRY_COOKIE)
    return res
  }

  // Vercel sets this header on every request. Locally there is none, so in
  // development `?cc=US` stands in for it to preview another country's prices
  // (the checkout honours the same override, in development only).
  const override = process.env.NODE_ENV !== 'production' ? normaliseCountry(req.nextUrl.searchParams.get('cc')) : null
  const country = override ?? normaliseCountry(req.headers.get('x-vercel-ip-country'))

  if (country && country !== current) {
    res.cookies.set(COUNTRY_COOKIE, country, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
  }
  return res
}

export const config = {
  // Pages only: not API routes, Next's assets, or files such as images.
  matcher: ['/((?!api/|_next/|.*\\.[a-zA-Z0-9]+$).*)'],
}
