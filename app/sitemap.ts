import { MetadataRoute } from 'next'
import { blogCategories, blogDrafts, categorySlug } from '@/content/blog'
import { hasFullArticle } from '@/content/blog-articles'
import { landingPages, locationPages } from '@/content/seo-pages'
import { TEMPLATES } from '@/modules/templates/data'
import { SITE_URL, templateCategorySlug, templateSeoSlug } from '@/lib/seo'

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
// - gallery pages are already listed explicitly in Tier 2b with correct priorities
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

    // ─── Tier 2b: Template gallery pages (plural, browse/filter UX) ──────────
    entry('/wedding-invitations', 0.85, 'weekly'),
    entry('/engagement-invitations', 0.81),
    entry('/birthday-invitations', 0.79),
    entry('/anniversary-invitations', 0.75),
    entry('/griha-pravesh-invitations', 0.75),

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
    entry('/namakaran-invitation-wording', 0.70, 'monthly'),
    entry('/baby-shower-invitation-wording', 0.68, 'monthly'),

    // ─── Tier 6: Individual template pages ────────────────────────────────────
    ...TEMPLATES.map((template) => entry(`/templates/${templateSeoSlug(template.id)}`, 0.65)),

    // ─── Tier 7: Blog posts ────────────────────────────────────────────────────
    // Only posts with a hand-written article. The other 30 drafts render
    // templated filler that differs by keyword alone; submitting them was
    // asking Google to index 30 near-identical pages, and it declined
    // ("Duplicate without user-selected canonical"). They are noindex,follow
    // at the page level and re-enter this list as soon as real copy is added.
    ...blogDrafts
      .filter((post) => hasFullArticle(post.slug))
      .map((post) => entry(`/blog/${post.slug}`, 0.65)),

    // ─── Tier 8: Supporting pages ─────────────────────────────────────────────
    entry('/partners', 0.55),
    entry('/press', 0.55),

    // ─── Tier 9: Legal / policy pages ─────────────────────────────────────────
    entry('/terms', 0.40, 'yearly'),
    entry('/privacy', 0.40, 'yearly'),
    entry('/refund-policy', 0.40, 'yearly'),

    // ─── Tier 9: Blog category pages ──────────────────────────────────────────
    ...blogCategories.map((category) => entry(`/blog/category/${categorySlug(category)}`, 0.60)),

    // ─── Tier 10: Template category pages ─────────────────────────────────────
    ...templateCategories.map((category) => entry(`/templates/category/${templateCategorySlug(category)}`, 0.60)),
  ]
}
