import type { CatalogItem } from '@/lib/catalogItems'
import { FEATURES, TIERS } from '@/lib/tiers'
import TemplateCard from '@/components/catalog/TemplateCard'
import { withLocalPrices } from '@/components/price/localised'

/**
 * Designs grouped by level, best first: Signature, Premium, Classic. Each
 * level opens with who it is for, its lowest price, how many designs it has,
 * and what every one of them includes (worked out from the designs' fields,
 * so it is always true). A level with nothing in it is left out.
 *
 * Plain component: server pages and the client gallery both use it.
 *
 * `revealed`: the grids appeared after a tap on a filter, not on page load.
 * The scroll-reveal script (AnimateOnScroll) only registers the grids that
 * exist when a page loads, so a grid added later would stay hidden, and one it
 * had registered would still fade in over most of a second. After a tap the
 * grids leave the scroll reveal out and simply show.
 */
export default function TieredGrid({ items, source, priority = true, revealed = false }: { items: CatalogItem[]; source: string; priority?: boolean; revealed?: boolean }) {
  const groups = TIERS.map((tier) => ({ tier, list: items.filter((i) => i.tier === tier.key) })).filter((g) => g.list.length > 0)
  let shown = 0
  return (
    <div className="space-y-12 sm:space-y-16">
      {groups.map(({ tier, list }) => {
        const from = Math.min(...list.map((i) => i.price))
        const common = FEATURES.filter((f) => list.every((i) => i.features.includes(f.key))).slice(0, 4)
        return (
          <section key={tier.key} aria-labelledby={`tier-${tier.key}`}>
            <header className="border-t border-charcoal/15 pt-5 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-x-8">
              <div className="lg:col-span-4">
                <h3 id={`tier-${tier.key}`} className="flex items-baseline gap-3 font-editorial text-[1.85rem] font-medium leading-none sm:text-[2.1rem]">
                  {tier.name}
                  {tier.key === 'signature' && <span aria-hidden className="h-2 w-2 rotate-45 bg-burnished" />}
                </h3>
                <p className="mt-2 text-[0.9rem] text-muted">
                  <span className="font-semibold tabular-nums text-charcoal">{withLocalPrices(`from ₹${from.toLocaleString('en-IN')}`)}</span>
                  {' · '}
                  {list.length} {list.length === 1 ? 'design' : 'designs'}
                </p>
              </div>
              <div className="mt-3 lg:col-span-8 lg:mt-0">
                <p className="max-w-2xl text-[1rem] leading-7 text-charcoal/80">{tier.promise}</p>
                {common.length > 0 && (
                  <p className="mt-2 text-[0.85rem] leading-6 text-muted">
                    In every design here: <span className="text-charcoal/80">{common.map((f) => f.label).join(' · ')}</span>
                  </p>
                )}
              </div>
            </header>
            <div data-reveal-group={revealed ? undefined : ''} className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {list.map((item) => (
                <TemplateCard key={item.id} item={item} source={source} priority={priority && shown++ < 2} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
