/**
 * Recognises automated visitors by their user agent: search engines, AI
 * assistants, link previews, SEO tools, uptime monitors and scripts.
 *
 * Used by middleware.ts (every page a bot fetches is counted in BotHit, shown
 * on the Bots tab of /admin/activity) and by /api/activity (a bot that runs
 * the page's JavaScript is kept out of the visitor journal). Runs on the edge,
 * so nothing here may import Node modules.
 *
 * A user agent is only a claim: anyone can call themselves Googlebot. The
 * admin page says "says it is" for that reason.
 */

export type BotKind = 'search' | 'ai' | 'preview' | 'seo' | 'monitor' | 'other'

export const BOT_KINDS: Record<BotKind, string> = {
  search: 'Search engines',
  ai: 'AI assistants',
  preview: 'Link previews (someone shared a link)',
  seo: 'SEO tools',
  monitor: 'Speed tests and uptime monitors',
  other: 'Scripts and unknown bots',
}

/** Most specific first: a name earlier in the list wins. */
const BOTS: [RegExp, string, BotKind][] = [
  // AI assistants. "for a user" means a person asked the assistant something
  // just now and it opened this page to answer them.
  [/ChatGPT-User/i, 'ChatGPT (opened a page for a user)', 'ai'],
  [/OAI-SearchBot/i, 'ChatGPT search', 'ai'],
  [/GPTBot/i, 'OpenAI (GPTBot, training)', 'ai'],
  [/Perplexity-User/i, 'Perplexity (opened a page for a user)', 'ai'],
  [/PerplexityBot/i, 'Perplexity search', 'ai'],
  [/Claude-User/i, 'Claude (opened a page for a user)', 'ai'],
  [/Claude-SearchBot/i, 'Claude search', 'ai'],
  [/ClaudeBot|anthropic-ai/i, 'Claude (ClaudeBot, training)', 'ai'],
  [/MistralAI-User/i, 'Mistral (opened a page for a user)', 'ai'],
  [/DuckAssistBot/i, 'DuckDuckGo AI answers', 'ai'],
  [/meta-externalagent|meta-externalfetcher/i, 'Meta AI', 'ai'],
  [/Bytespider/i, 'ByteDance (TikTok) AI', 'ai'],
  [/Amazonbot/i, 'Amazon (Alexa)', 'ai'],
  [/CCBot/i, 'Common Crawl (AI training data)', 'ai'],
  [/cohere-ai|cohere-training/i, 'Cohere AI', 'ai'],
  [/YouBot/i, 'You.com', 'ai'],
  [/Diffbot/i, 'Diffbot', 'ai'],

  // Search engines.
  [/Google-InspectionTool/i, 'Google (Search Console live test)', 'search'],
  [/Googlebot-Image/i, 'Googlebot Images', 'search'],
  [/Googlebot-Video/i, 'Googlebot Video', 'search'],
  [/Googlebot/i, 'Googlebot', 'search'],
  [/AdsBot-Google|Mediapartners-Google/i, 'Google Ads check', 'search'],
  [/Storebot-Google/i, 'Google Shopping', 'search'],
  [/GoogleOther|Google-Extended|APIs-Google|FeedFetcher-Google|Google-Site-Verification|Google-Safety|Google-Read-Aloud/i, 'Google (other)', 'search'],
  [/bingbot|BingPreview|msnbot|adidxbot/i, 'Bingbot (Bing, Copilot)', 'search'],
  [/YandexBot|YandexImages|YandexMobileBot/i, 'Yandex', 'search'],
  [/Baiduspider/i, 'Baidu', 'search'],
  [/DuckDuckBot/i, 'DuckDuckGo', 'search'],
  [/Applebot/i, 'Applebot (Siri, Spotlight)', 'search'],
  [/Slurp/i, 'Yahoo', 'search'],
  [/PetalBot/i, 'Petal (Huawei)', 'search'],
  [/SeznamBot/i, 'Seznam', 'search'],
  [/Yeti\//i, 'Naver', 'search'],
  [/Sogou/i, 'Sogou', 'search'],
  [/Qwantify|Qwantbot/i, 'Qwant', 'search'],

  // Link previews: fetched when someone pastes a link into a chat or post.
  // iMessage previews call themselves facebookexternalhit too.
  [/WhatsApp/i, 'WhatsApp link preview', 'preview'],
  [/facebookexternalhit|facebookcatalog|Facebot/i, 'Facebook / Instagram / iMessage preview', 'preview'],
  [/Twitterbot/i, 'X (Twitter) preview', 'preview'],
  [/LinkedInBot/i, 'LinkedIn preview', 'preview'],
  [/TelegramBot/i, 'Telegram preview', 'preview'],
  [/Slackbot|Slack-ImgProxy/i, 'Slack preview', 'preview'],
  [/Discordbot/i, 'Discord preview', 'preview'],
  [/Pinterest/i, 'Pinterest', 'preview'],
  [/SkypeUriPreview|MicrosoftPreview/i, 'Microsoft Teams / Skype preview', 'preview'],
  [/Snap URL Preview/i, 'Snapchat preview', 'preview'],
  [/redditbot/i, 'Reddit preview', 'preview'],

  // SEO tools: someone (often a competitor) analysing the site.
  [/AhrefsBot|AhrefsSiteAudit/i, 'Ahrefs', 'seo'],
  [/SemrushBot|SiteAuditBot/i, 'Semrush', 'seo'],
  [/MJ12bot/i, 'Majestic', 'seo'],
  [/DotBot|rogerbot/i, 'Moz', 'seo'],
  [/Screaming Frog/i, 'Screaming Frog', 'seo'],
  [/serpstatbot/i, 'Serpstat', 'seo'],
  [/DataForSeoBot/i, 'DataForSEO', 'seo'],
  [/BLEXBot/i, 'BLEXBot', 'seo'],
  [/Barkrowler/i, 'Babbar', 'seo'],

  [/vercel/i, 'Vercel (hosting checks)', 'monitor'],
  [/Lighthouse|PageSpeed|Chrome-Lighthouse/i, 'PageSpeed / Lighthouse test', 'monitor'],
  [/GTmetrix/i, 'GTmetrix', 'monitor'],
  [/UptimeRobot|Pingdom|StatusCake|Better ?Uptime|Site24x7|uptime/i, 'Uptime monitor', 'monitor'],

  [/HeadlessChrome|PhantomJS|puppeteer|playwright|Selenium/i, 'Headless browser (automated)', 'other'],
  [/python|curl\/|wget|go-http-client|okhttp|java\/|libwww|node-fetch|axios|httpx|scrapy|aiohttp|undici|postman|insomnia|guzzle/i, 'Script or scraper', 'other'],
  // Most bots put a contact URL in their name ("+http://…"). "bot/1.0"
  // rather than plain "bot", so phones such as the CUBOT X30 are not caught.
  [/\+https?:\/\/|[\w-]*bot\/\d|crawler|spider|scraper|preview/i, 'Other bot', 'other'],
]

export interface Bot {
  name: string
  kind: BotKind
}

export function botOf(userAgent: string | null | undefined): Bot | null {
  const ua = userAgent ?? ''
  if (!ua.trim()) return { name: 'No browser name (script)', kind: 'other' }
  for (const [re, name, kind] of BOTS) if (re.test(ua)) return { name, kind }
  return null
}

/**
 * The page a bot fetched, as stored. Guests' invitations collapse to one line
 * (their addresses hold the hosts' names), and query strings are dropped.
 */
export function botPath(pathname: string): string {
  if (/^\/e\//.test(pathname)) return '/e/* (guest invitations)'
  return pathname.slice(0, 200) || '/'
}

/**
 * Shared secret between the middleware and /api/bot-hit, so nobody else can
 * post bot hits. Derived from NEXTAUTH_SECRET, which every deployment already
 * has; Web Crypto, so it runs on the edge and in Node alike.
 */
export async function botLogKey(): Promise<string | null> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${secret}:bot-hit`))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}
