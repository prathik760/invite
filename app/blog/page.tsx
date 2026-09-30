import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import JsonLd from '@/components/seo/JsonLd'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import BlogCard from '@/components/blog/BlogCard'
import { blogCategories, blogDrafts, categorySlug } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Indian Invitation Ideas, Tips & Wording | ShareInvite Blog' },
  description:
    'Guides on digital invitations for weddings, birthdays, Griha Pravesh, engagements and family events. Wording samples, WhatsApp tips and invitation ideas.',
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    title: 'Indian Invitation Ideas, Tips & Wording | ShareInvite Blog',
    description: 'Guides on digital invitations for Indian weddings, birthdays, Griha Pravesh, engagements, and family events.',
    type: 'website',
    siteName: SITE_NAME,
    url: absoluteUrl('/blog'),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'ShareInvite Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Invitation Ideas, Tips & Wording | ShareInvite Blog',
    description: 'Wording samples, WhatsApp tips, and RSVP ideas for Indian events.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function BlogIndexPage() {
  const [featured, ...rest] = blogDrafts
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <JsonLd id="blog-collection-jsonld" data={collectionPageJsonLd('ShareInvite Blog', metadata.description as string, absoluteUrl('/blog'))} />
      <JsonLd
        id="blog-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
        ])}
      />
      <SiteHeader />
      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Blog' }]}
        eyebrow="Ideas & inspiration"
        title={<>Digital Invitation <em className="font-medium text-burnished">Blog</em></>}
        lede="Practical guides, wording ideas and inspiration for weddings, birthdays, engagements, housewarmings, baby showers and every celebration you want to invite people to."
      />

      <Section size="sm" aria-label="Categories">
        <ul className="flex flex-wrap gap-2" data-reveal>
          {blogCategories.map((category) => (
            <li key={category}>
              <Link href={`/blog/category/${categorySlug(category)}`} className="pill px-4 py-2 text-[0.9rem] hover:border-burnished">
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {featured && (
        <Section size="sm" aria-label="Featured article">
          <div data-reveal><BlogCard post={featured} featured /></div>
        </Section>
      )}

      <Section aria-label="All articles">
        <SectionHeading eyebrow="Latest" title="All guides" />
        {/* No `data-reveal-group` here. The reveal fires once 8% of the group
            is on screen, and this grid of 60+ cards is 11,000–35,000px tall,
            so 8% of it never fits in a viewport: the cards stayed at opacity 0
            however far the reader scrolled. Cards render visible; the images
            inside lazy-load as they approach. */}
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      </Section>

      <CtaBand eyebrow="From reading to sending" title="Put the perfect words in a beautiful design" location="blog_index_footer" />
      <SiteFooter />
    </main>
  )
}
