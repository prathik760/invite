import Image from 'next/image'
import Link from 'next/link'
import { Price } from '@/components/price/Price'
import { OCCASIONS } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'
import { TEMPLATES } from '@/modules/templates/data'

/** One real design to stand for each occasion in the index. */
const COVER: Record<string, string> = {
  wedding: 'luxury-wedding',
  engagement: 'indian-engagement',
  birthday: 'birthday-mirrorball',
  anniversary: 'anniversary',
  baby: 'baby-shower',
  home: 'griha-pravesh',
  festival: 'diwali-party',
  love: 'greeting-love',
  friends: 'greeting-friendship',
  congrats: 'retirement',
}

const LIVE = new Set(TEMPLATES.map((t) => t.id))

/**
 * Where an occasion has an indexable category page, link there rather than to
 * a /templates?occasion= filter, which is canonicalised to /templates and so
 * passes nothing to the category page.
 */
const INDEXABLE_HREF: Record<string, string> = {
  festival: '/templates/category/festival',
}

/**
 * Occasions as a contents page: name, how many designs, the lowest price,
 * each line a link. Counts and prices come from the catalogue, so they stay
 * true as designs are added.
 */
export default function OccasionIndex() {
  const rows = OCCASIONS.map((o) => {
    const ids = o.templateIds.filter((id) => LIVE.has(id))
    return { ...o, href: INDEXABLE_HREF[o.key] ?? o.href, count: ids.length, from: Math.min(...ids.map(templatePrice)), cover: COVER[o.key] ?? ids[0] }
  }).filter((o) => o.count > 0)

  return (
    <section id="occasions" aria-labelledby="occasions-heading" className="border-b border-charcoal/10">
      <div className="shell py-10 sm:py-12 lg:py-14">
        <div className="grid gap-3 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="occasions-heading" className="font-editorial text-balance text-[2.2rem] font-medium leading-[1.02] sm:text-[2.8rem] lg:col-span-6">
            What are you celebrating?
          </h2>
          <p className="max-w-xl text-[0.98rem] leading-7 text-charcoal/70 lg:col-span-6 lg:justify-self-end">
            Each occasion has its own page of invitation designs, priced before you begin. Something we haven&apos;t listed?{' '}
            <a href="#custom-template" className="font-semibold text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:decoration-burnished">
              We&apos;ll draw one for you.
            </a>
          </p>
        </div>

        {/* Two columns at every width: compact on a phone, with dotted leaders on a laptop. */}
        <ul className="mt-7 grid grid-cols-2 gap-x-4 border-t border-charcoal/15 sm:gap-x-8 lg:mt-9 lg:gap-x-14">
          {rows.map((o) => (
            <li key={o.key} className="border-b border-charcoal/15">
              <Link href={o.href} prefetch={false} className="group flex items-center gap-2.5 py-3 sm:gap-4 lg:py-3.5">
                <span className="relative block aspect-[4/5] w-9 shrink-0 overflow-hidden bg-peach shadow-[0_6px_12px_-8px_rgba(30,39,38,0.5)] transition-transform duration-300 group-hover:-rotate-3 sm:w-11">
                  <Image src={templateImage(o.cover)} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 lg:flex lg:items-baseline lg:gap-4">
                  <span className="block font-editorial text-[1.15rem] font-medium leading-tight transition-colors group-hover:text-burnished-deep sm:text-[1.45rem] lg:shrink-0 lg:text-[1.6rem]">
                    {o.label}
                  </span>
                  <span aria-hidden className="hidden flex-1 border-b border-dotted border-charcoal/30 lg:block" />
                  <span className="mt-0.5 block text-[0.76rem] leading-snug tabular-nums text-charcoal/60 sm:text-[0.86rem] lg:mt-0 lg:shrink-0">
                    {o.count} {o.count === 1 ? 'design' : 'designs'}
                    <span className="hidden sm:inline"> · </span>
                    <span className="block sm:inline">from <Price inr={o.from} /></span>
                  </span>
                </span>
                <span aria-hidden className="hidden text-[1.1rem] text-charcoal/40 transition-transform group-hover:translate-x-1 group-hover:text-burnished-deep sm:inline">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
