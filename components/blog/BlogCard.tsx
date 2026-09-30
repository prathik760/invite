import Image from 'next/image'
import Link from 'next/link'
import type { BlogDraft } from '@/content/blog'

// Every post carries its own photograph (public/blog/<slug>.jpg, set as
// `image` in content/blog.ts). This category artwork is only the fallback for
// a future post published before its photo is added — it is what made every
// card in a category look identical when no post had an image of its own.
const CATEGORY_ART: Record<string, string> = {
  Wedding: '/occasions/photo-wedding.jpg',
  'Wedding Trends': '/occasions/photo-engagement.jpg',
  Engagement: '/occasions/photo-love.jpg',
  Birthday: '/occasions/photo-birthday.jpg',
  Housewarming: '/occasions/photo-home.jpg',
  'Baby Shower': '/occasions/photo-baby.jpg',
  'Invitation Ideas': '/occasions/photo-congrats.jpg',
  'Digital Invitations': '/occasions/photo-friends.jpg',
}

export function blogArt(post: Pick<BlogDraft, 'category' | 'image'>): string {
  return post.image ?? CATEGORY_ART[post.category] ?? '/occasions/photo-festival.jpg'
}

// Rendered widths inside `.shell` (max-w-7xl = 1088px at the 85% root size):
// a grid card is ~335px across three columns, half the viewport across two,
// and full width on phones. The featured image is half the shell from md up.
// Stating them lets next/image pick a 384–750px file instead of a 1200px one.
export const GRID_CARD_SIZES = '(min-width: 1088px) 340px, (min-width: 768px) 50vw, 100vw'
const FEATURED_SIZES = '(min-width: 1088px) 520px, (min-width: 768px) 50vw, 100vw'

function formatDate(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogCard({
  post,
  featured = false,
  sizes,
}: {
  post: BlogDraft
  featured?: boolean
  /** Override the grid `sizes` when the card sits in a different grid. */
  sizes?: string
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      // The index lists 60+ cards. With viewport prefetching on, scrolling it
      // downloaded the full RSC payload of every article it passed (~1.4 MB on
      // a phone) while the reader was waiting for the card photos. Articles are
      // static, so a click still loads quickly; only the featured post is
      // prefetched.
      prefetch={featured ? undefined : false}
      className={`lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper ${featured ? 'md:flex-row' : ''}`}
    >
      <span className={`relative block shrink-0 overflow-hidden bg-peach ${featured ? 'aspect-[16/10] md:aspect-auto md:w-1/2' : 'aspect-[16/10]'}`}>
        <Image
          src={blogArt(post)}
          alt=""
          fill
          // The featured photo is the first large image on /blog — load it
          // eagerly at high priority; every other card lazy-loads on scroll.
          priority={featured}
          sizes={featured ? FEATURED_SIZES : sizes ?? GRID_CARD_SIZES}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
      </span>
      <span className={`flex flex-1 flex-col ${featured ? 'p-7 sm:p-10' : 'p-6'}`}>
        <span className="flex items-center gap-2 text-[0.75rem] text-muted">
          <span className="pill border-transparent bg-peach py-0.5 text-burnished-deep">{post.category}</span>
          <span>{formatDate(post.date)}</span>
        </span>
        <span className={`mt-4 block font-editorial font-semibold leading-tight text-charcoal group-hover:text-emerald-soft ${featured ? 'text-[2.1rem]' : 'text-[1.45rem]'}`}>
          {post.title}
        </span>
        <span className="mt-3 line-clamp-3 block text-[0.92rem] leading-7 text-charcoal/70">{post.description}</span>
        <span className="mt-auto pt-5 text-[0.88rem] font-semibold text-emerald-soft">Read the guide →</span>
      </span>
    </Link>
  )
}
