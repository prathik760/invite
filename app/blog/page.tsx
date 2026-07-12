import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import SiteFooter from '@/components/landing/SiteFooter'
import { blogCategories, blogDrafts, categorySlug } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Indian Invitation Ideas, Tips & Wording | ShareInvite Blog' },
  description:
    'Guides on digital invitations for Indian weddings, birthdays, Griha Pravesh, engagements, and family events. Wording samples, WhatsApp tips, and RSVP ideas.',
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
  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd id="blog-collection-jsonld" data={collectionPageJsonLd('ShareInvite Blog', metadata.description as string, absoluteUrl('/blog'))} />
      <JsonLd
        id="blog-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
        </div>
      </header>
      <section className="px-5 py-14 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong">Invitation ideas</p>
          <h1 className="mt-4 font-display text-4xl font-normal text-ink sm:text-6xl">Digital Invitation Blog</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
            Practical guides on creating digital invitations for Indian weddings, birthdays, engagements, housewarming ceremonies, baby showers, WhatsApp invitation cards, and online RSVP.
          </p>
        </div>
      </section>
      <section className="border-y border-border bg-white px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-xl text-ink">Categories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {blogCategories.map((category) => (
              <Link key={category} href={`/blog/category/${categorySlug(category)}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-muted hover:text-foreground">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogDrafts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">{post.category}</p>
              <h3 className="mt-3 font-heading text-xl text-ink">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{post.description}</p>
              <p className="mt-5 text-xs font-semibold text-[#B87924]">Read guide →</p>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
