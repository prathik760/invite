import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, CheckIcon, EyeIcon } from '@/components/ui/Icons'
import PreviewButton from '@/components/catalog/PreviewButton'
import CustomizeLink from '@/components/pricing/CustomizeLink'
import { TEMPLATES } from '@/modules/templates/data'
import { templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'
import { displayName, primaryOccasion, styleTag } from '@/lib/catalog'
import { TIER_MAP, tierOf } from '@/lib/tiers'
import { Price } from '@/components/price/Price'
import { serverT } from '@/lib/serverLang'

const SIGNATURE = TEMPLATES.filter((t) => t.id.startsWith('signature-'))

/** What a Signature suite adds over an everyday design — all real, per the field set. */
const ADDS = [
  'Every function on its own card: date, time, venue, dress code, map and calendar',
  'Both families and the elders whose blessings you carry',
  'Your story, told as a timeline',
  'Travel & stay, the people to call, and answers to guests’ questions',
  'RSVP on WhatsApp, a livestream link for family abroad, your hashtag',
  'A signature opening: palace doors, a lattice window, a postcard, a sheet of vellum',
]

/** A line under each name that says what the suite is (its style tag for Nikah would just repeat the name). */
const SUBTITLES: Record<string, string> = {
  'signature-rajwada': 'Palace doors at dusk · Fireworks',
  'signature-kalyanam': 'Temple at dawn · Jasmine curtain',
  'signature-saptapadi': 'Antarpat · Seven vows',
  'signature-two-worlds': 'Love story · Two cultures',
  'signature-royal-edit': 'A luxury magazine · You on the cover',
  'signature-nikah': 'Lattice & lanterns',
  'signature-garden': 'Destination postcard',
  'signature-aquarelle': 'Redouté florals · Wax seal',
}

/**
 * The Signature collection on an emerald band (the Pricing page): every wedding suite with
 * its artwork and real price, a live Preview and Customize on each, and exactly what the
 * suites add. These are simply all the suites, not a "most popular" pick: there is no
 * sales data behind any ranking, so none is claimed.
 */
export default function SignatureShowcase({ id = 'signature', section = 'pricing_signature' }: { id?: string; section?: string }) {
  if (SIGNATURE.length === 0) return null
  const tr = serverT()
  return (
    <Section tone="emerald" id={id} aria-label={tr('The Signature collection')}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <SectionHeading
          tone="emerald"
          eyebrow={tr('The Signature collection')}
          title={tr('For the wedding of the year')}
          sub={tr('Complete wedding suites for celebrations that run across days and cities: everything your guests need, in one link that feels like it was made by hand.')}
        />
        <Link href="/templates/category/signature" className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-[0.95rem] font-semibold text-gold-soft underline-offset-4 hover:underline">
          {tr('View all {n} suites', { n: SIGNATURE.length })} <ArrowRightIcon />
        </Link>
      </div>
      {/* Four to a row on a laptop (two even rows of the eight suites), a swipeable row on a phone. */}
      <ul className="phone-rail mt-12 grid grid-cols-2 gap-3 max-sm:mt-8 sm:gap-4 lg:grid-cols-4 lg:gap-5" style={{ ['--rail' as string]: '62%' }}>
        {SIGNATURE.map((t, i) => {
          const name = displayName(t.name)
          const price = templatePrice(t.id)
          return (
            <li key={t.id}>
              <article data-tpl={t.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-gold-soft/25 bg-emerald-deep" aria-labelledby={`${id}-${t.id}`}>
                {/* The artwork opens the live invitation. */}
                <PreviewButton templateId={t.id} source={section} ariaLabel={tr('Preview {name}', { name })} className="group relative block aspect-[4/5] overflow-hidden">
                  <Image
                    src={templateImage(t.id)}
                    alt={tr('{name} invitation design', { name })}
                    fill
                    priority={i < 2}
                    sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 62vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* The price rides on the artwork, so the name below never has to share its line. */}
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-deep/90 px-2.5 py-1 font-editorial text-[1.05rem] font-semibold leading-none text-gold-soft shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] sm:left-3 sm:top-3 sm:px-3 sm:text-[1.15rem]">
                    <Price inr={price} />
                  </span>
                </PreviewButton>
                <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
                  <h3 id={`${id}-${t.id}`} className="font-editorial text-[1.2rem] font-semibold leading-tight text-paper sm:text-[1.35rem]">
                    <Link href={`/templates/${templateSeoSlug(t.id)}`} prefetch={false} className="-my-2.5 inline-block py-2.5 hover:text-gold-soft">
                      {name}
                    </Link>
                  </h3>
                  <p className="mt-0.5 text-[0.78rem] leading-snug text-paper/60">{tr(SUBTITLES[t.id] ?? styleTag(t.id).replace('Signature · ', ''))}</p>
                  {/* Preview (the live invitation) and Customize (the builder): an eye button on a phone so Customize keeps its label. */}
                  <div className="mt-auto flex gap-2 pt-3.5">
                    <PreviewButton
                      templateId={t.id}
                      source={section}
                      ariaLabel={tr('Live preview of {name}', { name })}
                      className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-paper/30 text-[0.9rem] font-semibold text-paper transition-colors hover:border-gold-soft sm:w-auto sm:flex-1 sm:px-3"
                    >
                      <EyeIcon className="h-[1.05rem] w-[1.05rem]" />
                      <span className="max-sm:hidden">{tr('Preview')}</span>
                    </PreviewButton>
                    <CustomizeLink
                      templateId={t.id}
                      name={name}
                      price={price}
                      level={TIER_MAP[tierOf(price)].key}
                      category={primaryOccasion(t.id)?.key ?? 'wedding'}
                      section={section}
                      className="inline-flex h-[44px] flex-1 items-center justify-center rounded-full bg-paper px-3 text-[0.9rem] font-semibold text-emerald transition-colors hover:bg-white"
                    >
                      {tr('Customize')}
                    </CustomizeLink>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {/* What every suite adds: one full-width band under the row, so both edges line up. */}
      <div className="mt-6 rounded-3xl border border-gold-soft/25 bg-emerald-deep/60 p-6 sm:mt-8 sm:p-9 lg:p-10">
        <p className="eyebrow text-gold-soft">{tr('What a Signature suite adds')}</p>
        <ul className="mt-6 grid gap-x-10 gap-y-4 max-sm:mt-4 max-sm:gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {ADDS.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[0.98rem] leading-7 text-paper/85 max-sm:text-[0.93rem] max-sm:leading-6">
              <CheckIcon className="mt-1.5 h-4 w-4 shrink-0 text-gold-soft" />
              {tr(f)}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-5 border-t border-gold-soft/15 pt-7 max-sm:mt-6 max-sm:gap-4 max-sm:pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="max-w-2xl text-[0.9rem] leading-7 text-paper/60">
            {tr('Every suite also has a countdown, a photo gallery, your music, the guest wishes wall and its own private link. Build and preview the whole suite before you pay, and pay once when you publish.')}
          </p>
          <Link href="/templates/category/signature" className="btn-gold inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold sm:w-auto">
            {tr('Explore the Signature collection')} <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}
