import { CheckIcon } from '@/components/ui/Icons'
import { OFFER_PROMISES } from '@/lib/offer'
import { withLocalPrices } from '@/components/price/localised'

/** A row of short, true reassurances with check marks. */
export default function TrustList({
  items = OFFER_PROMISES as readonly string[],
  tone = 'light',
  className = '',
}: {
  items?: readonly string[]
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem] ${tone === 'dark' ? 'text-paper/80' : 'text-charcoal/80'} ${className}`}>
      {items.map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5">
          <CheckIcon className={`h-4 w-4 ${tone === 'dark' ? 'text-gold-soft' : 'text-emerald-soft'}`} />
          {withLocalPrices(t)}
        </li>
      ))}
    </ul>
  )
}
