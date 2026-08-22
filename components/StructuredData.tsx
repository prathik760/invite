import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE, PLANS } from '@/lib/plans'

// WebsiteSchema used to live here as a second, conflicting WebSite entity — the
// root layout already emits one with a proper @id and publisher link. It was
// imported by nothing, and carried the SearchAction that Google retired in
// November 2024, so it has been removed rather than reconciled.

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
