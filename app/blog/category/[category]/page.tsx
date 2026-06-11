import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogCategories, blogDrafts, categorySlug, findBlogCategory } from '@/content/blog'
import JsonLd from '@/components/seo/JsonLd'
import SiteFooter from '@/components/landing/SiteFooter'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

type Props = { params: { category: string } }

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: categorySlug(category) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const category = findBlogCategory(params.category)
  if (!category) return {}
  const url = absoluteUrl(`/blog/category/${params.category}`)
  const title = `${category} Invitation Ideas | ShareInvite Blog`
  const description = `Read ShareInvite drafts and guides for ${category.toLowerCase()} invitations, WhatsApp sharing, RSVP workflows, and digital invitation growth.`

  return {
    title,
    description,
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
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd id="blog-category-jsonld" data={collectionPageJsonLd(`${category} Invitation Ideas`, `ShareInvite guides for ${category.toLowerCase()} invitations.`, url)} />
      <JsonLd
        id="blog-category-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
          { name: category, url },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /><span className="font-display text-xl text-ink tracking-wide">ShareInvite</span></Link>
          <Link href="/blog" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted">All Posts</Link>
        </div>
      </header>
      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-4xl font-normal text-ink sm:text-5xl">{category} Invitation Ideas</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Draft guides and internal-linking content for {category.toLowerCase()} invitation keywords, templates, and conversion journeys.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">{post.keyword}</p>
                <h2 className="mt-3 font-heading text-xl text-ink">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
