import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'
import { botLogKey, botOf, botPath, botSampleRate, COUNTED_BOT_KINDS, isBlockedBot, type Bot } from '@/lib/bots'
import { CONSENT_COUNTRIES, REGION_COOKIE } from '@/lib/consent'
import { COUNTRY_COOKIE, intlPricingEnabled, normaliseCountry } from '@/lib/pricing'
import { isIndianLocale } from '@/lib/i18n'

/**
 * Counts a page fetched by a search engine, AI assistant or other bot, for the
 * Bots tab of /admin/activity. Sent after the response (waitUntil), so the
 * bot is never kept waiting, and it can never fail the page. Only the kinds
 * that can bring a customer (COUNTED_BOT_KINDS): each count is a server call,
 * so crawlers are sampled (botSampleRate in lib/bots.ts).
 */
function logBot(req: NextRequest, event: NextFetchEvent, bot: Bot) {
  if (process.env.NODE_ENV !== 'production' || !COUNTED_BOT_KINDS.has(bot.kind)) return
  const weight = botSampleRate(bot)
  if (weight > 1 && Math.random() * weight >= 1) return
  event.waitUntil(
    botLogKey()
      .then(async (key) => {
        if (!key) return
        await fetch(new URL('/api/bot-hit', req.nextUrl.origin), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-bot-key': key },
          body: JSON.stringify({ bot: bot.name, kind: bot.kind, path: botPath(req.nextUrl.pathname), weight }),
        })
      })
      .catch(() => {}),
  )
}

/**
 * Remembers where the visitor is, for two things a static page cannot work out
 * on its own:
 *
 * - whether to ask before analytics and ad cookies (lib/consent.ts), and
 * - local prices (lib/pricing.ts), once switched on.
 *
 * It never redirects: language stays a choice the visitor makes (lib/i18n.ts
 * explains why a geo-redirect would break indexing).
 *
 * The pricing cookie only decides what a page displays. The checkout reads the
 * country header itself, so editing the cookie cannot change what anyone is
 * charged.
 */
export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const bot = botOf(req.headers.get('user-agent'))
  if (bot && isBlockedBot(bot)) return new NextResponse(null, { status: 403 })
  if (bot) logBot(req, event, bot)

  // The builder is open to everyone (13 Nov 2026). From 4 Nov an account was asked for here,
  // before anything of the builder loaded, which broke the promise every page makes ("build
  // and preview before you pay") at the first tap. An account is still needed to publish and
  // to pay: the builder asks for it at that moment (app/create/page.tsx), the draft waits on
  // the device meanwhile, and the APIs check it themselves.
  const { pathname } = req.nextUrl

  // Indian-language pages (/ta/pricing) are served from one translated tree (app/l/[lang]/…): a
  // dynamic [lang] folder cannot sit beside app/[slug] at the root, so the address is rewritten.
  // The tree's own addresses (/l/ta/…) are never public: they lead to the real ones.
  if (pathname === '/l' || pathname.startsWith('/l/')) {
    const to = req.nextUrl.clone()
    to.pathname = pathname.slice(2) || '/'
    return NextResponse.redirect(to, 308)
  }
  const lm = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  let res: NextResponse
  if (lm && isIndianLocale(lm[1])) {
    const to = req.nextUrl.clone()
    to.pathname = `/l/${lm[1]}${lm[2] && lm[2] !== '/' ? lm[2] : ''}`
    res = NextResponse.rewrite(to)
  } else {
    res = NextResponse.next()
  }

  // Vercel sets this header on every request. Locally there is none, so in
  // development `?cc=GB` stands in for it to preview another country (the
  // checkout honours the same override, in development only).
  const override = process.env.NODE_ENV !== 'production' ? normaliseCountry(req.nextUrl.searchParams.get('cc')) : null
  const country = override ?? normaliseCountry(req.headers.get('x-vercel-ip-country'))

  if (country) {
    const region = CONSENT_COUNTRIES.has(country) ? '1' : '0'
    if (req.cookies.get(REGION_COOKIE)?.value !== region) {
      res.cookies.set(REGION_COOKIE, region, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
    }
  }

  const current = req.cookies.get(COUNTRY_COOKIE)?.value
  if (!intlPricingEnabled()) {
    // Switched off (or back off): drop any cookie left from when it was on, or
    // pages would show a foreign price the checkout no longer charges.
    if (current) res.cookies.delete(COUNTRY_COOKIE)
    return res
  }

  if (country && country !== current) {
    res.cookies.set(COUNTRY_COOKIE, country, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
  }
  return res
}

export const config = {
  // Pages only: not API routes, Next's assets, or files such as images. The
  // share cards (…/opengraph-image) are images too: every WhatsApp preview
  // fetches one, and nothing above applies to an image, so they skip this.
  matcher: ['/((?!api/|_next/|.*opengraph-image|.*\\.[a-zA-Z0-9]+$).*)'],
}
