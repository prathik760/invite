import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Price } from '@/components/price/Price'
import { HandNote } from '@/components/home/Hand'
import { displayName } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'
import { TEMPLATES } from '@/modules/templates/data'

/** What each suite is, in a few words. */
const SUITES: { id: string; note: string }[] = [
  { id: 'signature-two-worlds', note: 'Your love story, two cultures' },
  { id: 'signature-rajwada', note: 'Palace doors, Rajasthani' },
  { id: 'signature-saptapadi', note: 'The antarpat and the seven vows' },
  { id: 'signature-aquarelle', note: 'Watercolour roses, a wax seal' },
  { id: 'signature-kalyanam', note: 'A South Indian temple' },
  { id: 'signature-nikah', note: 'Lattice and lanterns' },
  { id: 'signature-garden', note: 'A postcard from the destination' },
]

/**
 * The Signature wedding suites as a magazine spread: one design shown large,
 * what a suite holds in plain sentences, and the suites as a priced list.
 */
export default function SignatureSpread() {
  const suites = SUITES.filter((s) => TEMPLATES.some((t) => t.id === s.id)).map((s) => ({
    ...s,
    name: displayName(TEMPLATES.find((t) => t.id === s.id)!.name),
  }))
  if (suites.length === 0) return null

  return (
    <section id="signature-collection" aria-labelledby="signature-heading" className="bg-emerald text-paper">
      <div className="shell grid gap-8 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <figure className="relative mx-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:col-span-5 lg:max-w-none lg:self-center">
          <Link href={`/templates/${templateSeoSlug('signature-saptapadi')}`} prefetch={false} className="block rotate-[-1.5deg] bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:rotate-0">
            <span className="relative block aspect-[4/5] overflow-hidden">
              <Image src={templateImage('signature-saptapadi')} alt="Saptapadi wedding invitation in red and gold" fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
            </span>
          </Link>
          <figcaption className="mt-4 text-center lg:text-left">
            <HandNote arrow="none" color="text-gold-soft" className="-rotate-2">Saptapadi: the antarpat lowers, then the seven vows</HandNote>
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:pt-4">
          <p className="text-[0.95rem] italic text-gold-soft">The Signature suites</p>
          <h2 id="signature-heading" className="mt-3 text-balance font-editorial text-[2.2rem] font-medium leading-[1.04] sm:text-[2.9rem]">
            For a wedding that&apos;s five functions long
          </h2>
          <div className="mt-5 max-w-[36rem] space-y-3 text-[1rem] leading-[1.7] text-paper/80">
            <p>
              Every function gets its own card with its time, venue, dress code, a map and a button that adds it to
              the guest&apos;s calendar. There&apos;s room for both families and the elders whose blessings you carry,
              for your story, and for travel and stay if people are coming from out of town.
            </p>
            <p>RSVPs come to your WhatsApp. Family abroad gets the livestream link on the same page.</p>
          </div>

          <ul className="mt-7 border-t border-paper/20">
            {suites.map((s) => (
              <li key={s.id} className="border-b border-paper/20">
                <Link href={`/templates/${templateSeoSlug(s.id)}`} prefetch={false} className="group flex items-baseline gap-4 py-3">
                  <span className="font-editorial text-[1.45rem] font-medium leading-tight transition-colors group-hover:text-gold-soft sm:text-[1.6rem]">
                    {s.name}
                  </span>
                  <span className="hidden text-[0.9rem] text-paper/55 sm:inline">{s.note}</span>
                  <span aria-hidden className="flex-1 border-b border-dotted border-paper/25" />
                  <Price inr={templatePrice(s.id)} className="shrink-0 text-[1rem] font-semibold tabular-nums text-gold-soft" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/templates/category/signature" prefetch={false} className="mt-7 inline-block text-[1rem] font-semibold text-paper underline decoration-paper/35 underline-offset-[6px] hover:decoration-gold-soft">
            See the Signature collection
          </Link>
        </div>
      </div>
    </section>
  )
}
