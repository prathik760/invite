import Script from 'next/script'
import type { ComponentType } from 'react'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import CtaBand from '@/components/brand/CtaBand'
import TrustList from '@/components/brand/TrustList'
import { Section, SectionHeading } from '@/components/brand/Section'
import SignatureShowcase from '@/components/brand/SignatureShowcase'
import PriceCatalogue, { type PriceGroup } from '@/components/pricing/PriceCatalogue'
import PricingFaq, { answerText, type PricingQuestion } from '@/components/pricing/PricingFaq'
import {
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  LinkIcon,
  MapPinIcon,
  MessageIcon,
  MusicIcon,
  PenIcon,
  PhoneIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from '@/components/ui/Icons'
import { TEMPLATES } from '@/modules/templates/data'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE, templatePrice } from '@/lib/plans'
import { digitalOffer, templateSeoSlug } from '@/lib/seo'
import { templateImageUrl } from '@/lib/templateMedia'
import { OCCASIONS, primaryOccasion } from '@/lib/catalog'
import { buildCatalogItems } from '@/lib/catalogItems'
import { designPlaceholder } from '@/lib/designPlaceholders'
import { FEATURES, TIERS, TIER_MAP, type FeatureKey } from '@/lib/tiers'
import { OFFER } from '@/lib/offer'
import { priceRangeSentence } from '@/lib/priceCopy'
import { localeMeta } from '@/lib/pageMeta'
import { serverT, tFor } from '@/lib/serverLang'
import { rich, type T } from '@/lib/translate'
import { Price, PayMethods, ChargeCurrency } from '@/components/price/Price'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

/** The Pricing page in any language: English at /pricing, the Indian languages at /<lang>/pricing. */
export function pricingMetadata(lang: string) {
  const t = tFor(lang)
  return localeMeta(lang, '/pricing', {
    title: t('Pricing: One Design, One Price | ShareInvite'),
    description: lang === 'en' ? `Pay once per design. ${priceRangeSentence()} Preview before you pay. No subscription.` : t('Pay once per design, from {from} to {to}. Preview before you pay. No subscription.', { from: inr(LOWEST_PAID_PRICE), to: inr(HIGHEST_PAID_PRICE) }),
    keywords: ['digital invitation price india', 'wedding invitation cost online india', 'shareinvite pricing', 'digital invite one-time payment india', 'online wedding invitation price', 'e-invitation cost india', 'digital invitation maker price'],
    openGraph: { images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: t('ShareInvite pricing for digital invitations') }] },
  })
}

// ─── The catalogue, from one source ──────────────────────────────────────────
// Every price below comes from lib/plans templatePrice (through lib/catalogItems), the same
// function the Templates page, the preview popup, the builder and the checkout use.

const ITEMS = buildCatalogItems()
const COUNT = ITEMS.length

/** The three levels the Templates page uses, with their real price span and count. */
const LADDER = [...TIERS].reverse().map((t) => {
  const prices = ITEMS.filter((i) => i.tier === t.key).map((i) => i.price)
  return { key: t.key, name: t.name, count: prices.length, min: Math.min(...prices), max: Math.max(...prices) }
}).filter((l) => l.count > 0)

const CHEAPEST = ITEMS.reduce((a, b) => (b.price < a.price ? b : a))
const DEAREST = ITEMS.reduce((a, b) => (b.price > a.price ? b : a))

/** Short names for what a design holds, in the price list (most telling first). */
const HOLDS: Partial<Record<FeatureKey, string>> = {
  functions: 'every function',
  rsvp: 'RSVP',
  film: 'film',
  photos: 'photos',
  music: 'music',
  map: 'map',
  programme: 'programme',
  wishes: 'wishes',
}

function groups(t: T): PriceGroup[] {
  return OCCASIONS.map((o) => ({
    key: o.key,
    label: t(o.label),
    one: t(o.short).toLowerCase(),
    entries: ITEMS.filter((i) => primaryOccasion(i.id)?.key === o.key)
      // Cheapest first; the catalogue's own order among equal prices.
      .map((i, n) => ({ i, n }))
      .sort((a, b) => a.i.price - b.i.price || a.n - b.n)
      .map(({ i }) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        slug: i.slug,
        image: i.image,
        level: t(TIER_MAP[i.tier].name),
        holds: i.features.map((f) => HOLDS[f]).filter((x): x is string => Boolean(x)).slice(0, 3).map((h) => t(h)),
        // Found by its English words and by the reader's own.
        hay: [i.name, i.style, ...i.style.split(' · ').map((s) => t(s)), TIER_MAP[i.tier].name, t(TIER_MAP[i.tier].name), ...OCCASIONS.filter((x) => i.occasions.includes(x.key)).flatMap((x) => [x.label, x.short, t(x.label), t(x.short)]), i.is3D ? '3d' : '']
          .join(' ')
          .toLowerCase(),
      })),
  })).filter((g) => g.entries.length > 0)
}

const PLACEHOLDERS = Object.fromEntries(ITEMS.map((i) => [i.id, designPlaceholder(i.id)]))

/** What varies by design, with how many designs really have it (read from each design's fields). */
const FEATURE_ICON: Record<FeatureKey, ComponentType<{ className?: string }>> = {
  photos: CameraIcon,
  music: MusicIcon,
  wishes: MessageIcon,
  map: MapPinIcon,
  programme: ClipboardIcon,
  rsvp: PhoneIcon,
  functions: SparklesIcon,
  guide: GlobeIcon,
  film: EyeIcon,
}
const FEATURE_NOTE: Partial<Record<FeatureKey, string>> = {
  map: 'Google Maps directions to your venue',
  rsvp: 'Guests reply to your WhatsApp number',
  photos: 'Your photos, in the design’s own frames',
  wishes: 'Guests leave blessings on the invitation',
  programme: 'The order of the day, hour by hour',
}
const BY_DESIGN = FEATURES.map((f) => ({
  key: f.key,
  label: f.label,
  count: ITEMS.filter((i) => i.features.includes(f.key)).length,
}))
  .filter((f) => f.count > 0)
  .sort((a, b) => b.count - a.count)

// ─── Questions ───────────────────────────────────────────────────────────────

function pricingFaqs(t: T): PricingQuestion[] {
  const ladderSentence = LADDER.map((l) => t('{level} designs {from} to {to}', { level: t(l.name), from: inr(l.min), to: inr(l.max) })).join(', ')
  return [
    {
      question: t('Is it a one-time payment or a subscription?'),
      answer: t('A one-time payment. You pay once for the design you publish. There is no subscription, no renewal and nothing charged again later.'),
    },
    {
      question: t('How much does a digital invitation cost?'),
      answer: t('Each design has one fixed price, shown on the design and in the list on this page: {ladder}. The cheapest is {cheap} at {cheapPrice}; the most elaborate is the {dear} wedding suite at {dearPrice}.', { ladder: ladderSentence, cheap: CHEAPEST.name, cheapPrice: inr(CHEAPEST.price), dear: DEAREST.name, dearPrice: inr(DEAREST.price) }),
    },
    {
      question: t('What is included in the price?'),
      answer: t('That one invitation with every feature its design has: your details, its own link, sharing with as many guests as you like, changes until your event, and no banner or ads. What a design holds (photos, music, a map, RSVP) depends on the design, and its live preview shows exactly what you get. There are no add-ons or upgrades to buy.'),
    },
    {
      question: t('Can I see my invitation before I pay?'),
      answer: t('Yes. Pick any design, fill in every detail, add photos, and see the finished invitation on your own phone without paying or entering card details. Payment is only asked for at the final publish step, when you get your shareable link.'),
    },
    {
      question: t('Can I edit my invitation after paying?'),
      answer: t('Yes, until your celebration ends. Change a time, the venue, names or photos and the same link shows the new details to every guest. Open it from My invitations when you are signed in, or from the device you published on; if you were signed in when you paid, the email confirming your invitation has an edit link too. The design stays the one you paid for.'),
    },
    {
      question: t('How does sharing on WhatsApp work?'),
      answer: t('When you publish, you get your invitation’s own link and a WhatsApp share button. Send it to one person or a whole family group: the chat shows a preview card, and guests open the invitation in their phone’s browser with no app to install. On designs with WhatsApp RSVP, guests can reply straight to the number you add.'),
    },
    {
      question: t('Is there a limit on guests?'),
      answer: t('No. Share the link with as many guests as you like, as often as you like. There is no guest count, no view limit and no charge per guest.'),
    },
    {
      question: t('How long does my invitation stay online?'),
      answer: t('Through your celebration and for three days after its last day, so guests can look back at it. After that it shows that the celebration has taken place, and it is deleted, with its wishes and uploaded photos, 30 days after the last day. Greetings without a date stay online for 60 days from publishing.'),
    },
    {
      question: t('What is the refund policy?'),
      answer: t('Refunds are for genuine problems: a double charge, a payment taken without your invitation being delivered, or a fault on our side we cannot fix. Ask within 7 days of paying, and approved refunds go back to your original payment method through Razorpay. A change of mind after publishing is not covered, since you can see the whole invitation before you pay. The full terms are in our'),
      link: { href: '/refund-policy', label: t('Refund & Cancellation Policy') },
    },
    {
      question: t('Is the payment secure?'),
      answer: t('Yes. All payments are processed by Razorpay, and ShareInvite never sees or stores your card details. In India you can pay by UPI, credit or debit card, or net banking. You pay the price and currency shown on the design.'),
    },
  ]
}

// ─── Structured Data ──────────────────────────────────────────────────────────

const TEMPLATE_PRICES = TEMPLATES.map((tpl) => ({
  id: tpl.id,
  name: tpl.name,
  description: tpl.description,
  price: templatePrice(tpl.id),
  slug: templateSeoSlug(tpl.id),
}))

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ShareInvite Pricing',
  description: 'Digital invitation template pricing for Indian weddings, birthdays, and family events',
  url: `${APP_URL}/pricing`,
  mainEntity: {
    '@type': 'ItemList',
    name: 'ShareInvite Digital Invitation Templates',
    itemListElement: TEMPLATE_PRICES.map((tpl, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${tpl.name} Digital Invitation Template`,
        description: tpl.description,
        sku: tpl.id,
        image: [templateImageUrl(tpl.id)],
        brand: { '@type': 'Brand', name: 'ShareInvite' },
        url: `${APP_URL}/templates/${tpl.slug}`,
        offers: digitalOffer(tpl.price, `${APP_URL}/templates/${tpl.slug}`),
      },
    })),
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const t = serverT()
  const faqs = pricingFaqs(t)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: answerText(faq) } })),
  }
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <PageHero
        crumbs={[{ name: t('Home'), href: '/' }, { name: t('Pricing') }]}
        eyebrow={t('Pricing')}
        title={<>{t('One design. One price.')}<br /><em className="font-medium text-burnished">{t('Everything included.')}</em></>}
        lede={t('Every design has one fixed price, shown on the design, from {from} to {to}. Build and preview it free, then pay once for the invitation you publish: you get its own link to share, and you can change the details until your event. No subscription, no renewals.', { from: inr(LOWEST_PAID_PRICE), to: inr(HIGHEST_PAID_PRICE) })}
        actions={
          <>
            <TrackedLink href="/templates" location="pricing_hero" className="btn-primary inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[1rem] font-semibold">
              {t('Explore invitations')}
              <ArrowRightIcon />
            </TrackedLink>
            <a href="#prices" className="btn-outline inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[1rem] font-semibold">
              {t('See every price')}
            </a>
          </>
        }
        footnote={
          <>
            {/* What "from ₹99" means: the three levels, their real price spans and counts. */}
            <dl className="grid overflow-hidden rounded-2xl border border-line bg-paper/80 text-charcoal sm:grid-cols-3">
              {LADDER.map((l) => (
                <div key={l.key} className="flex items-baseline justify-between gap-3 border-line px-4 py-3 max-sm:[&+&]:border-t sm:block sm:[&+&]:border-l">
                  <dt className="text-[0.9rem]">
                    <span className="font-semibold">{t(l.name)}</span>
                    <span className="text-muted"> · {t('{n} designs', { n: l.count })}</span>
                  </dt>
                  <dd className="font-editorial text-[1.35rem] font-semibold tabular-nums sm:mt-0.5">
                    {l.max > l.min ? rich(t('{from} to {to}'), { from: <Price inr={l.min} />, to: <Price inr={l.max} /> }) : <Price inr={l.min} />}
                  </dd>
                </div>
              ))}
            </dl>
            <TrustList className="mt-4" />
          </>
        }
        // On a phone the card keeps its price and action; its list of inclusions is the "Unlocked when you pay" panel just below.
        aside={<OfferCard href="/templates" cta={t('Explore invitations')} location="pricing_hero_offer" includesClassName="max-sm:hidden" />}
      />

      {/* ─── HOW PAYING WORKS ─── */}
      <Section aria-labelledby="pay-title" innerClassName="!py-14 sm:!py-20">
        <SectionHeading id="pay-title" align="center" eyebrow={t('How paying works')} title={t('Pay only when you love it')} sub={t('You see the finished invitation before you pay anything.')} />
        <ol className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-4">
          {[
            { Icon: EyeIcon, title: t('Choose your invitation'), copy: t('Browse every design with its price, and open any one live on your phone.') },
            { Icon: PenIcon, title: t('Customize it'), copy: t('Add your names, dates, venue, photos and music. See the finished invitation as you go.') },
            { Icon: ShieldIcon, title: t('Review, and pay when ready'), copy: rich(t('Check it once more, then pay its one price by {methods}. It goes live on its own link.'), { methods: <PayMethods /> }) },
          ].map(({ Icon, title, copy }, i) => (
            <li key={title} className="relative flex gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6 md:flex-col md:gap-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-paper">
                <Icon className="h-5 w-5" />
              </span>
              {/* The step's number, as before: a large editorial numeral in the corner. */}
              <span aria-hidden className="absolute right-5 top-4 font-editorial text-[3rem] font-semibold leading-none text-burnished/25 sm:right-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 max-md:pr-12 md:mt-5">
                <h3 className="t-h3">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-7 text-charcoal/75">{copy}</p>
              </span>
            </li>
          ))}
        </ol>

        {/* What is free, and what the one payment unlocks. */}
        <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-2 md:gap-4">
          <div className="rounded-2xl border border-line bg-paper/60 p-5 sm:p-6">
            <p className="eyebrow">{t('Free, before you pay')}</p>
            <ul className="mt-4 space-y-3 text-[0.98rem]">
              {['Browse and preview every design', 'Fill in every detail and add your photos', 'See the finished invitation on your phone', 'No card needed'].map((s) => (
                <li key={s} className="flex items-start gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-emerald-soft" />{t(s)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-emerald p-5 text-paper sm:p-6">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft">{t('Unlocked when you pay')}</p>
            <ul className="mt-4 space-y-3 text-[0.98rem] text-paper/90">
              {['Your invitation live on its own link', 'Share it on WhatsApp, Instagram, email or text', 'Guests’ wishes, and RSVPs on designs that have them', 'Change the details until your event, same link'].map((s) => (
                <li key={s} className="flex items-start gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-soft" />{t(s)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment, in one line of four. */}
        <ul className="mt-6 grid gap-x-4 gap-y-3.5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: ShieldIcon, k: 'razorpay', t: t('Secure by Razorpay'), c: <PayMethods capitalise /> },
            { Icon: CheckIcon, k: 'refund', t: t('7-day refund policy'), c: t('For genuine problems'), href: '/refund-policy' },
            { Icon: GlobeIcon, k: 'anywhere', t: t('Guests anywhere'), c: rich(t('Charged in {currency}, opens worldwide'), { currency: <ChargeCurrency /> }) },
            { Icon: MessageIcon, k: 'help', t: t('Help when you need it'), c: t('Chat with us on WhatsApp') },
          ].map(({ Icon, k, t: title, c, href }) => (
            <li key={k} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burnished/40 bg-paper text-burnished">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{href ? <Link href={href} className="-my-2.5 inline-block py-2.5 underline decoration-burnished/40 underline-offset-4 hover:decoration-current">{title}</Link> : title}</span>
                <span className="block text-[0.85rem] text-charcoal/70">{c}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── EVERY DESIGN, WITH ITS PRICE ─── */}
      <Section tone="paper" id="prices" aria-labelledby="prices-title" innerClassName="!py-14 sm:!py-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading
            id="prices-title"
            eyebrow={t('Transparent prices')}
            title={t('Every design, with its price')}
            sub={t('One price per design, paid once when you publish. Tap any design to see it live before you decide.')}
          />
          <Link href="/templates" className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-soft underline-offset-4 hover:underline">
            {t('Browse with previews')} <ArrowRightIcon />
          </Link>
        </div>
        <PriceCatalogue groups={groups(t)} placeholders={PLACEHOLDERS} />
        <p className="mt-6 text-center text-[0.85rem] text-muted">{t('All prices in Indian rupees, one-time, per design.')}</p>
      </Section>

      <SignatureShowcase />

      {/* ─── WHAT'S INCLUDED ─── */}
      <Section aria-labelledby="included-title" innerClassName="!py-14 sm:!py-20">
        <SectionHeading
          id="included-title"
          align="center"
          eyebrow={t('What you get')}
          title={t("What's included")}
          sub={t('Some things come with every design. Others depend on the design, so each is listed with how many designs have it.')}
        />

        <h3 className="t-h3 mt-10 sm:mt-12">{t('With every design')}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {[
            { Icon: PenIcon, t: 'Your details, your words', d: 'Names, date, time, venue and your own message, set in the design’s style.' },
            { Icon: LinkIcon, t: 'Its own private link', d: 'Share on WhatsApp, Instagram, email or text, with a preview card in chats.' },
            { Icon: PhoneIcon, t: 'Opens on any phone', d: 'Guests tap the link. No app to install, nothing to sign up for.' },
            { Icon: ClockIcon, t: 'Change it until your event', d: 'Fix a time or the venue after publishing. Same link, new details.' },
            { Icon: UsersIcon, t: 'As many guests as you like', d: 'No guest count, view limit or charge per guest.' },
            { Icon: SparklesIcon, t: 'Live through your celebration', d: 'Online for your event and three days after, with no banner or ads.' },
          ].map(({ Icon, t: title, d }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-soft">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.98rem] font-semibold">{t(title)}</span>
                <span className="mt-1 block text-[0.9rem] leading-7 text-charcoal/70">{t(d)}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 sm:mt-10">
          <h3 className="t-h3">{t('Depending on the design')}</h3>
          <p className="text-[0.85rem] text-muted">{t('Tap one to see the designs that have it.')}</p>
        </div>
        <ul className="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {BY_DESIGN.map((f) => {
            const Icon = FEATURE_ICON[f.key]
            const note = FEATURE_NOTE[f.key]
            return (
              <li key={f.key} className="border-t border-line">
                <Link href={`/templates?has=${f.key}`} prefetch={false} className="group flex min-h-[64px] items-center gap-3.5 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burnished/40 bg-paper text-burnished">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.98rem] font-semibold group-hover:text-emerald-soft">{t(f.label)}</span>
                    <span className="block text-[0.85rem] leading-snug text-charcoal/70">
                      {f.count === COUNT ? t('Every design') : t('{n} of {total} designs', { n: f.count, total: COUNT })}
                      {note ? ` · ${t(note)}` : ''}
                    </span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-burnished transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mt-5 text-[0.9rem] leading-7 text-charcoal/70">
          {t('Open any design’s live preview to see exactly what it includes before you pay.')}
        </p>
      </Section>

      {/* ─── FAQ ─── */}
      <Section tone="paper" id="faq" aria-labelledby="faq-title" innerClassName="!py-14 sm:!py-20">
        <SectionHeading id="faq-title" align="center" eyebrow={t('FAQ')} title={t('Pricing questions')} />
        <div className="mt-8 sm:mt-10">
          <PricingFaq items={faqs} />
        </div>
      </Section>

      <CtaBand
        eyebrow={t('See before you buy')}
        title={t(OFFER.headline)}
        sub={t('Find your design, make it yours and preview it free. Pay once, from {from}, when you publish.', { from: inr(LOWEST_PAID_PRICE) })}
        primary={{ href: '/templates', label: t('Explore invitation designs') }}
        secondary={null}
        location="pricing_closing"
      />

      <SiteFooter />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </main>
  )
}
