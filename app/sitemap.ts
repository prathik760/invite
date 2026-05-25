import { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ──
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${APP_URL}/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // ── SEO landing pages ──
    {
      url: `${APP_URL}/wedding-invitation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${APP_URL}/birthday-invitation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${APP_URL}/digital-invitation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ]
}
