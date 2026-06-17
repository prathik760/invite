import { MetadataRoute } from 'next'
import { blogDrafts } from '@/content/blog'
import { blogArticles } from '@/content/blog-articles'
import { landingPages } from '@/content/seo-pages'
import { TEMPLATES } from '@/modules/templates/data'
import { SITE_URL, templateSeoSlug } from '@/lib/seo'

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
//   must never list a URL that redirects (GSC flags it as "Page with redirect")
const SKIP_LANDING_SLUGS = new Set([
  'wedding-invitations',
  'engagement-invitations',
  'birthday-invitations',
  'anniversary-invitations',
  'griha-pravesh-invitations',
  'naming-ceremony-invitations',
])

// Quality-gated user invite pages.
// Gate matches the page-level robots decision in app/e/[slug]/page.tsx:
//   index = isPaid OR totalWishCount >= 2
// Using >= 2 (not just "any approved wish") prevents single test-wish events
// from leaking through. Fetch 600, post-filter, then cap at 300.
async function getPublicInviteEntries(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) return []

  try {
    const { prisma } = await import('@/lib/db')
    const events = await prisma.event.findMany({
      where: {
        slug: { not: '__custom-requests__' },
        OR: [
          { isPaid: true },
          { wishes: { some: { isApproved: true } } },
        ],
      },
      select: {
        slug: true,
        createdAt: true,
        isPaid: true,
        _count: { select: { wishes: { where: { isApproved: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 600,
    })

    return events
      .filter((event) => {
        const isPaid = (event as { isPaid: boolean }).isPaid
        const wishCount = (event as { _count: { wishes: number } })._count.wishes
        return isPaid || wishCount >= 2
      })
      .slice(0, 300)
      .map((event) => ({
        url: `${SITE_URL}/e/${event.slug}`,
        lastModified: event.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
  } catch {
    return []
  }
}

// Cities with genuinely unique content in their city-specific pages.
// Wedding and Griha Pravesh pages have 2+ unique paragraphs + local traditions → keep indexed.
// Birthday and Engagement city pages are thin (1 sentence unique) → excluded from sitemap + noindexed at the page level.
const INDEXED_CITIES = ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicInvites = await getPublicInviteEntries()

  return [
    // ─── Tier 1: Core product pages ───────────────────────────────────────────
    entry('', 1.0, 'weekly'),
    entry('/create', 0.95, 'weekly'),
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

    // Birthday/Engagement city pages are intentionally excluded here.
    // They are also noindexed at the page level until content is substantially improved.

    // ─── Tier 5: Wording guides (high-value informational content) ────────────
    entry('/wedding-invitation-wording', 0.74, 'monthly'),
    entry('/engagement-invitation-wording', 0.72, 'monthly'),
    entry('/birthday-invitation-wording', 0.72, 'monthly'),
    entry('/griha-pravesh-invitation-wording', 0.70, 'monthly'),
    entry('/namakaran-invitation-wording', 0.70, 'monthly'),
    entry('/baby-shower-invitation-wording', 0.68, 'monthly'),

    // ─── Tier 6: Individual template pages ────────────────────────────────────
    ...TEMPLATES.map((template) => entry(`/templates/${templateSeoSlug(template.id)}`, 0.65)),

    // ─── Tier 7: Blog posts — only hand-written articles, not auto-generated fallbacks ──
    ...blogDrafts
      .filter((post) => post.slug in blogArticles)
      .map((post) => entry(`/blog/${post.slug}`, 0.65)),

    // ─── Tier 8: Supporting pages ─────────────────────────────────────────────
    entry('/partners', 0.55),
    entry('/press', 0.55),

    // ─── Tier 9: Quality-gated user-created invitation pages ──────────────────
    // Only paid events or events with approved guest wishes are included.
    // Capped at 300 to preserve crawl budget for higher-value pages.
    ...publicInvites,
  ]
}
