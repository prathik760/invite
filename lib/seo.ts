import { TEMPLATES } from '@/modules/templates/data'

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')
export const SITE_NAME = 'ShareInvite'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`

export const PRIMARY_KEYWORDS = [
  'digital wedding invitation',
  'online invitation maker',
  'wedding invitation card maker',
  'whatsapp invitation card',
  'digital invitation card',
  'online RSVP',
  'engagement invitation card',
  'birthday invitation maker',
  'griha pravesh invitation',
  'baby shower invitation',
  'naming ceremony invitation',
  'indian wedding invitation',
]

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function templateSeoSlug(templateId: string) {
  const template = TEMPLATES.find((item) => item.id === templateId)
  if (!template) return `${templateId}-invitation-template`
  const base = slugify(template.name.replace(/—/g, ' '))
  return base.includes('invitation') ? `${base}-template` : `${base}-invitation-template`
}

export function templateCategorySlug(category?: string) {
  return slugify(category || 'digital-invitations')
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function collectionPageJsonLd(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}
