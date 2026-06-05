import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import { blogDrafts, categorySlug, findBlogPost } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return blogDrafts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = findBlogPost(params.slug)
  if (!post) return {}
  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    title: `${post.title} | ShareInvite Blog`,
    description: post.description,
    keywords: [post.keyword, 'digital invitation', 'online invitation maker', 'whatsapp invitation card', 'online RSVP'],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      siteName: SITE_NAME,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

function articleJsonLd(post: NonNullable<ReturnType<typeof findBlogPost>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'ShareInvite',
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'ShareInvite',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    image: DEFAULT_OG_IMAGE,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = findBlogPost(params.slug)
  if (!post) notFound()

  const sections = [
    `The search demand behind "${post.keyword}" is practical: hosts want an invitation that looks polished, opens quickly on mobile, and can be shared through WhatsApp without creating confusion. A good digital invitation page should make the event feel special while still answering every guest question in one place.`,
    `For Indian events, the invitation has to carry more context than a simple save-the-date. Families need names, venue, map link, ceremony sequence, dress note, timing, host message, and a simple response flow. ShareInvite supports this as a live page rather than a compressed card image.`,
    `Start with the guest journey. Someone receives the link in a WhatsApp group, opens it on a phone, checks the date and time, looks at the venue, reads the schedule, and may send a wish or RSVP. If any of those steps feel hard, the invitation creates follow-up work for the host.`,
    `The strongest digital invitation templates combine emotion and utility. Use a clear hero section for the event name, readable typography for details, a photo gallery only when it adds meaning, and a call to action that is obvious on small screens. Keep the page fast and avoid burying the venue or map link.`,
    `For SEO, every invite-related article should connect to landing pages, templates, and relevant categories. That internal linking helps users move from ideas to creation, and it helps search engines understand how wedding invitations, WhatsApp invitation cards, online RSVP, and event templates relate to each other.`,
  ]

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <JsonLd id="article-jsonld" data={articleJsonLd(post)} />
      <JsonLd
        id="blog-post-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
          { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-display text-2xl text-ink">ShareInvite</Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-14">
        <Link href={`/blog/category/${categorySlug(post.category)}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
          {post.category}
        </Link>
        <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{post.description}</p>
        <div className="mt-10 space-y-7 text-base leading-8 text-muted">
          {sections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </div>
        <div className="mt-10 rounded-lg border border-border bg-white p-6">
          <h2 className="font-heading text-xl text-ink">Quick checklist</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <li>Use a clean invitation URL and a descriptive title.</li>
            <li>Add venue, Google Maps, date, time, and schedule near the top.</li>
            <li>Connect the article to relevant landing pages and templates.</li>
            <li>Use WhatsApp sharing and RSVP tracking to reduce manual follow-up.</li>
          </ul>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link href="/wedding-invitations" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">
            Digital wedding invitations
          </Link>
          <Link href="/whatsapp-invitation-maker" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">
            WhatsApp invitation maker
          </Link>
          <Link href="/online-rsvp" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">
            Online RSVP platform
          </Link>
          <Link href="/templates" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">
            Browse templates
          </Link>
        </div>
      </article>
      <StickyCTA />
    </main>
  )
}
