// WebsiteSchema used to live here as a second, conflicting WebSite entity — the
// root layout already emits one with a proper @id and publisher link. It was
// imported by nothing, and carried the SearchAction that Google retired in
// November 2024, so it has been removed rather than reconciled.
//
// SoftwareAppSchema went the same way: the homepage, its only user, also
// emitted its own SoftwareApplication, so Google saw the product twice. The
// homepage's one (app/page.tsx) is the one kept.

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
