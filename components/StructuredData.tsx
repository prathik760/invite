import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE, PLANS } from '@/lib/plans'

export function WebsiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ShareInvite',
          url: 'https://shareinvite.in',
          description: 'Create and share digital invitations for Indian weddings, birthdays and celebrations.',
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: 'https://shareinvite.in/templates?q={search_term_string}' },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  )
}

export function SoftwareAppSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'ShareInvite',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          description: 'Digital invitation maker for Indian weddings, birthdays, engagements and all celebrations. Free to build and preview; one-time payment to publish.',
          url: 'https://shareinvite.in',
          // Advertised as a real price range, not ₹0 — Google treats an Offer
          // price of 0 as "this product is free", which is no longer true and
          // would be flagged as a price mismatch against the template pages.
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: String(LOWEST_PAID_PRICE),
            highPrice: String(HIGHEST_PAID_PRICE),
            offerCount: PLANS.length,
            description: 'One-time payment per template. Free to build and preview.',
          },
          author: {
            '@type': 'Person',
            name: 'Prathik Thelkar',
          },
        }),
      }}
    />
  )
}

export function BlogPostSchema({
  title,
  description,
  publishDate,
  url,
  imageUrl,
}: {
  title: string
  description: string
  publishDate: string
  url: string
  imageUrl?: string
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          datePublished: publishDate,
          url,
          ...(imageUrl && { image: imageUrl }),
          author: {
            '@type': 'Person',
            name: 'Prathik Thelkar',
            url: 'https://shareinvite.in',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ShareInvite',
            url: 'https://shareinvite.in',
            logo: { '@type': 'ImageObject', url: 'https://shareinvite.in/logo.png' },
          },
        }),
      }}
    />
  )
}
