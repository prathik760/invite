import Image from 'next/image'
import Link from 'next/link'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'
import { TEMPLATES } from '@/modules/templates/data'
import { templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'
import { displayName, styleTag } from '@/lib/catalog'
import { Price } from '@/components/price/Price'

const SIGNATURE = TEMPLATES.filter((t) => t.id.startsWith('signature-'))

/** What a Signature suite adds over an everyday design — all real, per the field set. */
const ADDS = [
  'Every function on its own card — date, time, venue, dress code, map and calendar',
  'Both families and the elders whose blessings you carry',
  'Your story, told as a timeline',
  'Travel & stay, the people to call, and answers to guests’ questions',
  'RSVP on WhatsApp, a livestream link for family abroad, your hashtag',
  'A signature opening — palace doors, a lattice window, a postcard',
]

/** A line under each name that says what the suite is (its style tag for Nikah would just repeat the name). */
const SUBTITLES: Record<string, string> = {
  'signature-rajwada': 'Palace doors · Rajasthani',
  'signature-kalyanam': 'South Indian temple',
  'signature-nikah': 'Lattice & lanterns',
  'signature-garden': 'Destination postcard',
}

/**
 * The Signature collection on an emerald band: the four wedding suites with
 * their prices, and exactly what they add. Used on the homepage and pricing.
 */
export default function SignatureShowcase({ id = 'signature' }: { id?: string }) {
  if (SIGNATURE.length === 0) return null
  return (
    <Section tone="emerald" id={id} aria-label="The Signature collection">
      <SectionHeading
        tone="emerald"
        eyebrow="The Signature collection"
        title="For the wedding of the year"
        sub="Complete wedding suites for celebrations that run across days and cities — everything your guests need, in one link that feels like it was made by hand."
        action={{ href: '/templates/category/signature', label: 'See the collection' }}
      />
      {/* The four suites in one row on a laptop, two by two on a phone. */}
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5" data-reveal-group>
        {SIGNATURE.map((t) => (
          <li key={t.id}>
            <Link href={`/templates/${templateSeoSlug(t.id)}`} className="lift group flex h-full flex-col overflow-hidden rounded-3xl border border-gold-soft/25 bg-emerald-deep">
              <span className="relative block aspect-[4/5] overflow-hidden">
                <Image src={templateImage(t.id)} alt={`${displayName(t.name)} invitation design`} fill sizes="(min-width: 1024px) 270px, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                {/* The price rides on the artwork, so the name below never has to share its line. */}
                <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-deep/90 px-2.5 py-1 font-editorial text-[1.05rem] font-semibold leading-none text-gold-soft shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] sm:left-3 sm:top-3 sm:px-3 sm:text-[1.15rem]">
                  <Price inr={templatePrice(t.id)} />
                </span>
              </span>
              <span className="flex flex-1 items-start justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-4">
                <span className="min-w-0">
                  <span className="block font-editorial text-[1.2rem] font-semibold leading-tight text-paper sm:text-[1.35rem]">{displayName(t.name)}</span>
                  <span className="mt-0.5 block text-[0.78rem] leading-snug text-paper/60">{SUBTITLES[t.id] ?? styleTag(t.id).replace('Signature · ', '')}</span>
                </span>
                <ArrowRightIcon className="mt-1.5 hidden h-4 w-4 shrink-0 text-gold-soft transition-transform group-hover:translate-x-1 sm:block" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* What every suite adds: one full-width band under the row, so both edges line up. */}
      <div className="mt-6 rounded-3xl border border-gold-soft/25 bg-emerald-deep/60 p-6 sm:mt-8 sm:p-9 lg:p-10">
        <p className="eyebrow text-gold-soft">What a Signature suite adds</p>
        <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADDS.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[0.98rem] leading-7 text-paper/85">
              <CheckIcon className="mt-1.5 h-4 w-4 shrink-0 text-gold-soft" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-5 border-t border-gold-soft/15 pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="max-w-2xl text-[0.9rem] leading-7 text-paper/60">
            Plus everything in every design: countdown, photo gallery, music, the guest wishes wall and one private link. Build and preview the whole suite before you pay — pay once when you publish.
          </p>
          <Link href="/templates/category/signature" className="btn-gold inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold sm:w-auto">
            Explore the Signature collection <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}
