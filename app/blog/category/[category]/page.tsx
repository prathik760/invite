import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import { notFound } from 'next/navigation'
import { blogCategories, blogDrafts, categorySlug, findBlogCategory, indexablePostCount, MIN_INDEXABLE_POSTS } from '@/content/blog'
import { hasFullArticle } from '@/content/blog-articles'
import { BLOG_CATEGORY_INTRO } from '@/content/category-intros'
import JsonLd from '@/components/seo/JsonLd'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import { Section } from '@/components/brand/Section'
import BlogCard from '@/components/blog/BlogCard'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

type Props = { params: { category: string } }

// A category page is only worth indexing if it lists at least
// MIN_INDEXABLE_POSTS posts Google is allowed to index. "Wedding Trends" has
// seven posts and zero real articles — all generated filler, now noindexed —
// so its category page is an empty shell pointing at pages Google will not
// index. The rule lives in content/blog.ts so the sitemap shares it exactly.
const indexable = (category: string) => indexablePostCount(category, hasFullArticle)

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: categorySlug(category) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const category = findBlogCategory(params.category)
  if (!category) return {}
  const url = absoluteUrl(`/blog/category/${params.category}`)
  const title = `${category} Invitation Ideas | ShareInvite Blog`
  const description =
    BLOG_CATEGORY_INTRO[category]?.slice(0, 155) ??
    `Tips, ideas, and guides for ${category.toLowerCase()} invitations — WhatsApp sharing, wording samples, RSVP, and digital invitation inspiration for Indian families.`

  return {
    title,
    description,
    robots:
      indexable(category) >= MIN_INDEXABLE_POSTS
        ? { index: true, follow: true }
        : { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
  }
}

export default function BlogCategoryPage({ params }: Props) {
  const category = findBlogCategory(params.category)
  if (!category) notFound()
  const posts = blogDrafts.filter((post) => post.category === category)
  const url = absoluteUrl(`/blog/category/${params.category}`)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <JsonLd id="blog-category-jsonld" data={collectionPageJsonLd(`${category} Invitation Ideas`, `ShareInvite guides for ${category.toLowerCase()} invitations.`, url)} />
      <JsonLd
        id="blog-category-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
          { name: category, url },
        ])}
      />
      <SiteHeader />
      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }, { name: category }]}
        eyebrow="Ideas & inspiration"
        title={<>{category} <em className="font-medium text-burnished">Invitation Ideas</em></>}
        lede={
          BLOG_CATEGORY_INTRO[category] ??
          `Ideas, wording samples, and practical guides for ${category.toLowerCase()} invitations — from what to write to how to share on WhatsApp.`
        }
      />
      <Section aria-label={`${category} guides`}>
        {/* Not a `data-reveal-group`: the reveal needs 8% of the group on
            screen, which a category of 20 cards (~11,000px on a phone) can
            never show, so its cards stayed invisible. See app/blog/page.tsx. */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
        <ul className="mt-12 flex flex-wrap gap-2">
          {blogCategories.filter((c) => c !== category).map((c) => (
            <li key={c}>
              <Link href={`/blog/category/${categorySlug(c)}`} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">{c}</Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title={`Create your ${category.toLowerCase()} invitation`} location="blog_category_footer" />
      <SiteFooter />
    </main>
  )
}
