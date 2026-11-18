import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import JsonLd from '@/components/seo/JsonLd'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import TemplateMarket, { type LevelInfo, type OccasionNav } from '@/components/catalog/market/TemplateMarket'
import { homeSans } from '@/components/homepage/fonts'
import { Price, PayMethods } from '@/components/price/Price'
import { ArrowRightIcon, EyeIcon, MessageIcon, MusicIcon, PenIcon, WhatsAppIcon, BanknoteIcon } from '@/components/ui/Icons'
import { TEMPLATES } from '@/modules/templates/data'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { OCCASIONS } from '@/lib/catalog'
import { buildCatalogItems, localiseItem } from '@/lib/catalogItems'
import { localeMeta } from '@/lib/pageMeta'
import { serverLang, serverT, tFor } from '@/lib/serverLang'
import { rich } from '@/lib/translate'
import { editorsPicks } from '@/lib/editorsPicks'
import { designPlaceholder } from '@/lib/designPlaceholders'
import { templateImage } from '@/lib/templateMedia'
import { ENDS_AFTER_DAYS } from '@/lib/retention'
import { FEATURES, TIER_MAP, type TierKey } from '@/lib/tiers'
import { absoluteUrl, breadcrumbJsonLd, collectionPageJsonLd, DEFAULT_OG_IMAGE, templateCategorySlug, templateCategoryLabel } from '@/lib/seo'

// The count was hard-coded as "11" while the catalogue held 24 designs.
const COUNT = TEMPLATES.length
const DESCRIPTION = 'digital invitation templates for weddings, birthdays, engagements, anniversaries, festivals, housewarmings and naming ceremonies, plus animated 3D greetings. Preview before you pay, share on WhatsApp.'

export function templatesMetadata(lang: string) {
  const t = tFor(lang)
  const title = t('Digital Invitation Templates for Every Event | ShareInvite')
  const description = `${COUNT} ${t(DESCRIPTION)}`
  return {
    ...localeMeta(lang, '/templates', { title, description, openGraph: { images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: t('ShareInvite templates') }] } }),
    twitter: { card: 'summary_large_image' as const, title, description, images: [DEFAULT_OG_IMAGE] },
  }
}

/** Each occasion shown by one of its own designs (the homepage's choices first, else its first design). */
const OCCASION_COVER: Record<string, string> = {
  wedding: 'signature-rajwada',
  engagement: 'indian-engagement',
  birthday: 'birthday-gala',
  anniversary: 'anniversary',
  baby: 'baby-shower',
  home: 'griha-pravesh',
}
const HERO = ['signature-aquarelle', 'signature-two-worlds', 'birthday-mirrorball']

/**
 * The Templates page: a marketplace for invitations. A compact hero, then the
 * catalogue (components/catalog/market/TemplateMarket: occasions, search,
 * filters, sort, the three level collections, and for a returning visitor
 * what they started, looked at or saved), what every purchase gives, the
 * crawlable occasion and category links, and the custom-design request.
 */
export default function TemplatesIndexPage() {
  const t = serverT()
  const english = serverLang() === 'en'
  // Recommended order: the editor's selection first (lib/editorsPicks), then the rest of the catalogue.
  const base = buildCatalogItems(editorsPicks(), { keepOrder: true })
  const items = english ? base : base.map((i) => localiseItem(i, t))
  // The English words too, so a reader of a translated page can search in either language.
  const englishWords = Object.fromEntries(base.map((i) => [i.id, english ? '' : [i.description, i.occasionLabel, i.style].join(' ')]))
  const count = (k: string) => items.filter((i) => i.features.includes(k as (typeof FEATURES)[number]['key'])).length
  const placeholders = Object.fromEntries(items.map((i) => [i.id, designPlaceholder(i.id)]))

  const occasions: OccasionNav[] = OCCASIONS.map((o) => {
    const list = items.filter((i) => i.occasions.includes(o.key))
    const cover = OCCASION_COVER[o.key] && list.some((i) => i.id === OCCASION_COVER[o.key]) ? OCCASION_COVER[o.key] : list[0]?.id
    return { key: o.key, label: t(o.short), count: list.length, cover: cover ?? '', image: cover ? templateImage(cover) : '' }
  }).filter((o) => o.count > 0)

  const levels: LevelInfo[] = (['signature', 'premium', 'classic'] as TierKey[])
    .map((key) => {
      const list = items.filter((i) => i.tier === key)
      return {
        key,
        name: t(TIER_MAP[key].name),
        promise: t(TIER_MAP[key].promise),
        from: list.length ? Math.min(...list.map((i) => i.price)) : 0,
        count: list.length,
        common: FEATURES.filter((f) => list.length > 0 && list.every((i) => i.features.includes(f.key))).map((f) => t(f.label)).slice(0, 4),
      }
    })
    .filter((l) => l.count > 0)

  const features = FEATURES.filter((f) => items.some((i) => i.features.includes(f.key))).map((f) => ({ key: f.key, label: t(f.label) }))

  // What each design is found by: its name and words, every occasion it is in, its style, level and contents.
  const hay = Object.fromEntries(
    items.map((i) => [
      i.id,
      [
        i.name,
        i.description,
        i.occasionLabel,
        // Labels only: an occasion's blurb names some of its designs ("Palace suites…") and would match them all.
        ...OCCASIONS.filter((o) => i.occasions.includes(o.key)).flatMap((o) => [o.label, o.short, t(o.label), t(o.short)]),
        i.style,
        englishWords[i.id],
        TIER_MAP[i.tier].name,
        t(TIER_MAP[i.tier].name),
        ...FEATURES.filter((f) => i.features.includes(f.key)).flatMap((f) => [f.label, t(f.label)]),
        i.features.includes('rsvp') ? 'rsvp reply' : '',
        i.is3D ? '3d animated interactive greeting' : '',
      ]
        .join(' ')
        .toLowerCase(),
    ]),
  )

  const categories = Array.from(new Set(TEMPLATES.map((template) => template.category || 'digital')))

  return (
    <main className="min-h-screen bg-hv-ivory text-hv-ink">
      <JsonLd id="templates-jsonld" data={collectionPageJsonLd(t('Digital Invitation Templates'), `${COUNT} ${t(DESCRIPTION)}`, absoluteUrl('/templates'))} />
      <JsonLd
        id="templates-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: t('Home'), url: absoluteUrl('/') },
          { name: t('Templates'), url: absoluteUrl('/templates') },
        ])}
      />

      <SiteHeader />

      <div className={`hv ${homeSans.variable} overflow-x-clip`}>
        {/* Hero: what this is, in one look, and straight on to the designs. */}
        <section aria-labelledby="tpl-title" className="hv-shell grid items-center gap-8 pb-4 pt-6 sm:pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-6 lg:pt-10">
          <div>
            <nav aria-label={t('Breadcrumb')} className="text-[0.85rem] text-hv-muted">
              <Link href="/" prefetch={false} className="hover:text-hv-forest">
                {t('Home')}
              </Link>
              <span aria-hidden className="px-1.5">/</span>
              <span aria-current="page">{t('Templates')}</span>
            </nav>
            <p className="hv-kicker max-sm:!text-[11.5px] mt-5">{t('The collection')}</p>
            <h1 id="tpl-title" className="hv-serif mt-4 text-[2.3rem] font-medium leading-[1.06] tracking-[-0.012em] text-hv-ink [text-wrap:balance] sm:text-[3rem] lg:max-w-[16ch] lg:text-[3.7rem]">
              {t('Digital invitation templates for every celebration')}
            </h1>
            <p className="hv-lede mt-4 max-w-[34rem]">
              {t('{n} designs for weddings, birthdays and every occasion in between. Open any one live, make it yours, and pay once when you publish.', { n: COUNT })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink href="#designs" location="templates_hero" className="hv-btn">
                {t('Explore templates')}
                <ArrowRightIcon className="h-4 w-4" />
              </TrackedLink>
              <TrackedLink href="#occasions" location="templates_hero_occasions" className="hv-btn-line">
                {t('Explore by occasion')}
              </TrackedLink>
            </div>
            <p className="mt-4 text-[0.88rem] text-hv-muted">
              {rich(t('Preview before you pay · From {price} · No subscription'), { price: <Price inr={LOWEST_PAID_PRICE} /> })}
            </p>
          </div>

          {/* Three real designs, laid down like printed cards (wide screens only, so phones reach the designs sooner).
              Still, on purpose: an entrance animation here kept them out of full-page screenshots. */}
          <div aria-hidden className="relative mx-auto hidden h-[25rem] w-full max-w-[32rem] lg:block">
            {HERO.map((id, i) => (
              <div
                key={id}
                className="absolute top-1/2 w-[46%] overflow-hidden rounded-[0.7rem] shadow-[0_34px_60px_-30px_rgba(12,43,34,0.6)] ring-1 ring-hv-ink/5"
                style={{
                  left: `${[2, 27, 52][i]}%`,
                  translate: '0 -50%',
                  zIndex: i === 1 ? 2 : 1,
                  transform: `rotate(${[-6, 0, 6][i]}deg)`,
                }}
              >
                <Image src={templateImage(id)} alt="" width={480} height={600} sizes="240px" priority={i === 1} className="block h-auto w-full" style={placeholders[id]} />
              </div>
            ))}
          </div>
        </section>

        <TemplateMarket items={items} occasions={occasions} levels={levels} features={features} hay={hay} placeholders={placeholders} />

        {/* What every purchase gives: the product's own facts, counted from the designs. */}
        <section aria-labelledby="tpl-value-title" className="mt-12 bg-hv-linen py-12 lg:mt-16 lg:py-20">
          <div className="hv-shell">
            <h2 id="tpl-value-title" className="hv-h2 lg:max-w-[36rem]">
              {t('What you get with every design')}
            </h2>
            <p className="mt-3 max-w-[34rem] text-[15px] leading-[1.6] text-hv-muted lg:text-[1.02rem]">{t('The same for every design you choose, whatever its price.')}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-5">
              {[
                { icon: EyeIcon, t: t('See it finished first'), d: t('Build the whole invitation with your details and preview it exactly as guests will. You pay only to publish.') },
                { icon: BanknoteIcon, t: t('One price, paid once'), d: rich(t('The price on each design is what you pay, once, by {methods} through Razorpay. No subscription.'), { methods: <PayMethods /> }) },
                { icon: WhatsAppIcon, t: t('One link for every guest'), d: t('Your invitation gets its own link as soon as payment is confirmed. Share it on WhatsApp, Instagram, email or text; guests need no app.') },
                { icon: MessageIcon, t: t('Replies on WhatsApp'), d: t('On {n} of {total} designs, guests answer from the invitation and the reply comes to your WhatsApp.', { n: count('rsvp'), total: COUNT }) },
                { icon: MusicIcon, t: t('Music, photos and directions'), d: t('{music} designs play your song, {photos} have a photo gallery and {map} give guests directions on Google Maps.', { music: count('music'), photos: count('photos'), map: count('map') }) },
                { icon: PenIcon, t: t('Yours to change'), d: t('Edit the details until your event, on the same link. It stays live through the event and {n} days after.', { n: ENDS_AFTER_DAYS }) },
              ].map(({ icon: Icon, t: title, d }) => (
                <li key={title} className="flex gap-4 rounded-[1rem] bg-white/80 p-4 ring-1 ring-hv-ink/5 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-hv-forest text-hv-gold" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold leading-snug text-hv-ink lg:text-[1.2rem]">{title}</span>
                    <span className="mt-1 block text-[15px] leading-[1.6] text-hv-muted lg:text-[0.98rem]">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Crawlable ways in: occasion guides and template categories. */}
        <section aria-label={t('More ways to browse')} className="hv-shell grid gap-8 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div>
            <h2 className="hv-serif text-[1.45rem] font-semibold text-hv-ink">{t('Occasion guides')}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {OCCASIONS.filter((o) => !o.href.startsWith('/templates')).map((o) => (
                <li key={o.key}>
                  <Link href={o.href} prefetch={false} className="inline-flex min-h-[40px] items-center rounded-full bg-white px-4 text-[14px] font-semibold text-hv-ink ring-1 ring-hv-ink/10 hover:ring-hv-forest/40">
                    {t(o.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="hv-serif text-[1.45rem] font-semibold text-hv-ink">{t('Template categories')}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    prefetch={false}
                    href={`/templates/category/${templateCategorySlug(category)}`}
                    className="inline-flex min-h-[40px] items-center rounded-full bg-white px-3.5 text-[14px] text-hv-ink/85 ring-1 ring-hv-ink/10 hover:ring-hv-forest/40"
                  >
                    {t(templateCategoryLabel(category))}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Nothing fits: a design made for them. */}
        <section aria-labelledby="tpl-custom-title" className="bg-hv-deep text-hv-ivory">
          <div className="hv-shell flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-14">
            <div>
              <p className="hv-kicker max-sm:!text-[11.5px] !text-hv-gold">{t('Something else in mind?')}</p>
              <h2 id="tpl-custom-title" className="hv-serif mt-3 text-[2rem] font-medium leading-[1.1] text-hv-ivory sm:text-[2.4rem]">
                {t('Can’t find the right design? We’ll create it.')}
              </h2>
              <p className="mt-3 max-w-[36rem] text-[1rem] leading-[1.65] text-hv-ivory/70">
                {t('Baby showers, corporate events, reunions and more. Tell us about your event and our designers will make one for you.')}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <TrackedLink href="/#custom-template" location="templates_closing" className="hv-btn-light">
                {t('Request a custom design')}
                <ArrowRightIcon className="h-4 w-4" />
              </TrackedLink>
              <TrackedLink href="/create" location="templates_closing_create" className="hv-btn-line !border-hv-ivory/30 !text-hv-ivory">
                {t('Start with a design')}
              </TrackedLink>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}
