import Link from '@/components/ui/Link'
import { Section, SectionHeading } from '@/components/brand/Section'
import { bandRange, occasionPriceBands } from '@/lib/occasionPrices'

/**
 * "How much does a digital wedding invitation cost?" as a section: the
 * occasion's designs by level, lowest first, each with its price, linking to
 * the design's own page. Searchers ask this before they choose a design, and
 * the answer was spread over a grid of cards.
 */
export default function OccasionPrices({ occasion, noun }: { occasion: string; noun: string }) {
  const bands = occasionPriceBands(occasion)
  if (!bands.length) return null
  return (
    <Section id="prices" aria-label="Prices">
      <SectionHeading
        eyebrow="Prices"
        title={`How much does a digital ${noun} cost?`}
        sub="One price per design, paid once when you publish. Build and preview every design free first. No subscription, and the design stays yours for another invitation at no extra cost."
      />
      <ul className={`mt-9 grid gap-4 ${bands.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`} data-reveal-group>
        {bands.map((b) => (
          <li key={b.tier.key} className="flex flex-col rounded-3xl border border-line bg-paper p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-editorial text-[1.45rem] font-semibold leading-tight">{b.tier.name}</p>
              <p className="shrink-0 text-[1.05rem] font-semibold text-burnished-deep">{bandRange(b)}</p>
            </div>
            <p className="mt-2 text-[0.88rem] leading-6 text-charcoal/70">{b.tier.promise}</p>
            <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
              {b.designs.map((d) => (
                <li key={d.id} className="flex items-baseline justify-between gap-3 text-[0.9rem]">
                  <Link href={`/templates/${d.slug}`} className="link truncate">
                    {d.name}
                  </Link>
                  <span className="shrink-0 tabular-nums text-charcoal/70">{d.priceLabel}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}
