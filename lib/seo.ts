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
  'ganesh chaturthi invitation card',
  'ganpati invitation card online',
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

/**
 * Human name for a template category. The category keys are internal
 * ("ganeshchaturthi", "movie", "retro"); URLs keep using them via
 * templateCategorySlug, but people should read proper names.
 */
const CATEGORY_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  engagement: 'Engagement',
  birthday: 'Birthday',
  housewarming: 'Housewarming',
  naming: 'Naming ceremony',
  anniversary: 'Anniversary',
  movie: 'Cinematic',
  retro: 'Art Deco',
  interactive: '3D surprise',
  greeting: '3D greetings',
  rakshabandhan: 'Raksha Bandhan',
  ganeshchaturthi: 'Ganesh Chaturthi',
  signature: 'Signature collection',
  babyshower: 'Baby shower',
  prewedding: 'Haldi, Mehendi & Sangeet',
  pooja: 'Pooja',
  festival: 'Festival',
  retirement: 'Retirement',
  savethedate: 'Save the date',
  digital: 'Digital',
}

export function templateCategoryLabel(category?: string) {
  const key = (category || 'digital').toLowerCase()
  return CATEGORY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

/**
 * Return policy, modelled from the actual published policy at /refund-policy:
 * refund requests are accepted within 7 days of the transaction, at no cost to
 * the customer, for customers in India.
 *
 * Nothing here is invented to satisfy a Search Console warning — every value
 * maps to a sentence in the live policy page.
 */
export const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'IN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 7,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  merchantReturnLink: `${SITE_URL}/refund-policy`,
} as const

/**
 * Offer for a digital product.
 *
 * Deliberately has NO `shippingDetails`: ShareInvite sells a hosted invitation
 * page delivered instantly over the web. There is no parcel, no destination and
 * no delivery window, so inventing an OfferShippingDetails block purely to
 * clear the Merchant Listing warning would be a false statement about the
 * business. Digital delivery is declared explicitly instead, via the
 * GoodRelations DirectDownload delivery mode that schema.org defines for this.
 *
 * Also deliberately has NO `validFrom` / `priceValidUntil`: these prices are
 * standing prices, not a promotion with a start and end date. Adding invented
 * dates would tell Google the price expires when it does not.
 */
export function digitalOffer(price: number, url: string) {
  return {
    '@type': 'Offer',
    price: String(price),
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    url,
    availableDeliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
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

/**
 * A template category listing exactly one design says nothing the template's
 * own page does not. Eight of the eleven categories are in that position, which
 * is why /templates/category/engagement and /templates/category/rakshabandhan
 * were discovered by Google and never crawled. Below this threshold the
 * category page is noindex,follow — reachable, still passing equity, but not
 * competing with the template page it duplicates.
 */
export const MIN_TEMPLATES_TO_INDEX = 2

export function templateCountFor(category: string): number {
  return TEMPLATES.filter((t) => (t.category || 'digital') === category).length
}
