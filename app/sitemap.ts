import { MetadataRoute } from 'next'
import { blogCategories, blogDrafts, categorySlug, indexablePostCount, MIN_INDEXABLE_POSTS } from '@/content/blog'
import { hasFullArticle } from '@/content/blog-articles'
import { landingPages, locationPages } from '@/content/seo-pages'
import { TEMPLATES } from '@/modules/templates/data'
import { MIN_TEMPLATES_TO_INDEX, SITE_URL, templateCategorySlug, templateCountFor, templateSeoSlug } from '@/lib/seo'
import { PREFIXED_LOCALES } from '@/lib/i18n'

const now = new Date()

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }
}

// Slugs to exclude from the landingPages spread:
// - the plural gallery slugs (wedding-invitations etc.) 301 to the singular
//   occasion pages in next.config.mjs, so they must not be listed
// - naming-ceremony-invitations 301-redirects to /namakaran-invitation; a sitemap
//   must never list a URL that redirects (GSC flags it as "Page with redirect").
//   That redirect is defined in next.config.mjs — it was missing until now, so
//   the page was live, indexable and cannibalising /namakaran-invitation.
const SKIP_LANDING_SLUGS = new Set([
  'wedding-invitations',
  'engagement-invitations',
  'birthday-invitations',
  'anniversary-invitations',
  'griha-pravesh-invitations',
  'naming-ceremony-invitations',
])

// Cities with genuinely unique content in their city-specific pages.
// All four occasion families (wedding, griha pravesh, birthday, engagement)
// carry per-city hero copy, a "built for" paragraph, a real venue list and
// city-specific FAQs in lib/cityContent.ts — so all four are indexable and all
// four are listed below.
//
// The previous comment here claimed birthday and engagement city pages were
// "thin (1 sentence unique) → excluded from sitemap + noindexed". That was
// false on both counts: Tier 4b lists them, and both routes set
// robots: { index: true }. Left uncorrected it would have prompted someone to
// noindex 16 pages that do carry unique content.
const INDEXED_CITIES = ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

/**
 * The live seasonal campaign — currently Diwali.
 *
 * Tiers 6 and 7 give every template page and every blog post the same
 * 0.65/monthly, which is right for a stable catalogue and wrong for a page that
 * has to be found before a festival passes: a new URL arrives with no history,
 * ranked equal-last among 25 templates and 34 posts. These two are listed
 * separately at a much higher priority and a weekly change frequency, and
 * filtered out of the generic spreads below so no URL appears twice.
 *
 * Priority and changeFrequency are hints, not instructions — the real work is
 * done by the internal links from the homepage and the template page. Point
 * these at the next festival when the campaign moves on, or set them to null.
 */
// Moved from Ganesh Chaturthi (over by October) to Diwali, 8 November 2026.
// The Diwali wording guide itself is listed weekly in Tier 5.
const SEASONAL_TEMPLATE_ID: string | null = 'diwali-party'
const SEASONAL_BLOG_SLUG: string | null = null

export default function sitemap(): MetadataRoute.Sitemap {
  const templateCategories = Array.from(new Set(TEMPLATES.map((t) => t.category || 'digital')))

  return [
    // ─── Tier 1: Core product pages ───────────────────────────────────────────
    entry('', 1.0, 'weekly'),
    entry('/create', 0.95, 'weekly'),
    entry('/pricing', 0.90, 'weekly'),
    entry('/templates', 0.90, 'weekly'),
    entry('/blog', 0.85, 'weekly'),

    // ─── Tier 2: Main category landing pages ──────────────────────────────────
    entry('/digital-invitation', 0.88),
    entry('/wedding-invitation', 0.88),
    entry('/engagement-invitation', 0.84),
    entry('/birthday-invitation', 0.82),
    entry('/griha-pravesh-invitation', 0.80),
    entry('/namakaran-invitation', 0.78),
    entry('/anniversary-invitation', 0.78),

    // (Tier 2b, the plural gallery pages — /wedding-invitations and friends —
    // now 301 to the singular pages above, which show the same designs.)

    // ─── Tier 3: SEO landing pages (occasion-focused, unique content) ─────────
    // These are the /[slug] pages from landingPages in seo-pages.ts.
    // Each has unique occasion-specific body copy and FAQs — worth indexing.
    ...landingPages
      .filter((page) => !SKIP_LANDING_SLUGS.has(page.slug))
      .map((page) => entry(`/${page.slug}`, 0.76)),

    // ─── Tier 4: City pages with substantial unique content ───────────────────
    // Wedding city pages: 2 full unique paragraphs + traditions + venues per city.
    ...INDEXED_CITIES.map((c) => entry(`/wedding-invitation/${c}`, 0.72)),
    // Griha Pravesh city pages: 2 full unique paragraphs + traditions per city.
    ...INDEXED_CITIES.map((c) => entry(`/griha-pravesh-invitation/${c}`, 0.70)),

    // ─── Tier 4b: Birthday & Engagement city pages ────────────────────────────
    ...INDEXED_CITIES.map((c) => entry(`/birthday-invitation/${c}`, 0.68)),
    ...INDEXED_CITIES.map((c) => entry(`/engagement-invitation/${c}`, 0.68)),

    // ─── Tier 4c: Digital-invitations location pages ──────────────────────────
    ...locationPages.map((page) => entry(`/${page.slug}`, 0.64)),

    // ─── Tier 5: Wording guides (high-value informational content) ────────────
    entry('/wedding-invitation-wording', 0.74, 'monthly'),
    entry('/engagement-invitation-wording', 0.72, 'monthly'),
    entry('/birthday-invitation-wording', 0.72, 'monthly'),
    entry('/griha-pravesh-invitation-wording', 0.70, 'monthly'),
    // /namakaran-invitation-wording and /baby-shower-invitation-wording now 301
    // to their blog posts (listed in Tier 7), so they are not listed here.
    entry('/diwali-invitation-wording', 0.72, 'weekly'),

    // ─── Tier 5b: Live seasonal campaign ──────────────────────────────────────
    ...(SEASONAL_TEMPLATE_ID
      ? [entry(`/templates/${templateSeoSlug(SEASONAL_TEMPLATE_ID)}`, 0.92, 'weekly')]
      : []),
    ...(SEASONAL_BLOG_SLUG ? [entry(`/blog/${SEASONAL_BLOG_SLUG}`, 0.90, 'weekly')] : []),

    // ─── Tier 6: Individual template pages ────────────────────────────────────
    ...TEMPLATES
      .filter((template) => template.id !== SEASONAL_TEMPLATE_ID)
      .map((template) => entry(`/templates/${templateSeoSlug(template.id)}`, 0.65)),

    // ─── Tier 7: Blog posts ────────────────────────────────────────────────────
    // Only posts with a hand-written article. The other 30 drafts render
    // templated filler that differs by keyword alone; submitting them was
    // asking Google to index 30 near-identical pages, and it declined
    // ("Duplicate without user-selected canonical"). They are noindex,follow
    // at the page level and re-enter this list as soon as real copy is added.
    ...blogDrafts
      .filter((post) => hasFullArticle(post.slug) && post.slug !== SEASONAL_BLOG_SLUG)
      .map((post) => entry(`/blog/${post.slug}`, 0.65)),

    // ─── Tier 8: Supporting pages ─────────────────────────────────────────────
    entry('/partners', 0.55),
    entry('/press', 0.55),

    // ─── Tier 9: Legal / policy pages ─────────────────────────────────────────
    entry('/terms', 0.40, 'yearly'),
    entry('/privacy', 0.40, 'yearly'),
    entry('/refund-policy', 0.40, 'yearly'),

    // ─── Tier 9: Blog category pages ──────────────────────────────────────────
    // Only categories with enough indexable posts behind them. "Wedding Trends"
    // has seven posts and zero real articles, so its page lists nothing Google
    // will index — it is noindexed at the route and omitted here to match.
    ...blogCategories
      .filter((category) => indexablePostCount(category, hasFullArticle) >= MIN_INDEXABLE_POSTS)
      .map((category) => entry(`/blog/category/${categorySlug(category)}`, 0.60)),

    // ─── Tier 0b: Localised home pages ────────────────────────────────────────
    // One entry per non-English locale. Listing them is what makes them
    // discoverable: there is deliberately no geo-redirect, so Googlebot only
    // reaches these through the sitemap, the switcher links and hreflang.
    ...PREFIXED_LOCALES.map((l) => entry(`/${l.code}`, 0.80, 'weekly')),

    // ─── Tier 10: Template category pages ─────────────────────────────────────
    // Single-template categories duplicate the template's own page, so they are
    // noindexed at the route and left out here.
    ...templateCategories
      .filter((category) => templateCountFor(category) >= MIN_TEMPLATES_TO_INDEX)
      .map((category) => entry(`/templates/category/${templateCategorySlug(category)}`, 0.60)),
  ]
}
