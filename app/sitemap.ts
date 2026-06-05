import { MetadataRoute } from 'next'
import { blogCategories, blogDrafts, categorySlug } from '@/content/blog'
import { landingPages, locationPages } from '@/content/seo-pages'
import { TEMPLATES } from '@/modules/templates/data'
import { SITE_URL, templateCategorySlug, templateSeoSlug } from '@/lib/seo'

const now = new Date()

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly') {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }
}

async function getPublicInviteEntries(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) return []

  try {
    const { prisma } = await import('@/lib/db')
    const events = await prisma.event.findMany({
      where: { slug: { not: '__custom-requests__' } },
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    })

    return events.map((event) => ({
      url: `${SITE_URL}/e/${event.slug}`,
      lastModified: event.createdAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const templateCategories = Array.from(new Set(TEMPLATES.map((template) => template.category || 'digital')))
  const publicInvites = await getPublicInviteEntries()

  return [
    entry('', 1, 'weekly'),
    entry('/create', 0.95, 'weekly'),
    entry('/digital-invitation', 0.9),
    entry('/wedding-invitation', 0.9),
    entry('/birthday-invitation', 0.85),
    entry('/templates', 0.88, 'weekly'),
    entry('/blog', 0.82, 'weekly'),
    ...landingPages.map((page) => entry(`/${page.slug}`, 0.9)),
    ...locationPages.map((page) => entry(`/${page.slug}`, 0.84)),
    ...TEMPLATES.map((template) => entry(`/templates/${templateSeoSlug(template.id)}`, 0.82)),
    ...templateCategories.map((category) => entry(`/templates/category/${templateCategorySlug(category)}`, 0.76)),
    ...blogDrafts.map((post) => entry(`/blog/${post.slug}`, 0.72)),
    ...blogCategories.map((category) => entry(`/blog/category/${categorySlug(category)}`, 0.68)),
    ...publicInvites,
  ]
}
