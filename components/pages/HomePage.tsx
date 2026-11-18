import type { Metadata } from 'next'
import { localeMeta } from '@/lib/pageMeta'
import { serverLang, serverT, tFor } from '@/lib/serverLang'
import { rich } from '@/lib/translate'
import { localiseItem } from '@/lib/catalogItems'
import Link from '@/components/ui/Link'
import SiteFooter from '@/components/landing/SiteFooter'
import CustomRequestSection from '@/components/landing/CustomRequestSection'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import { Price } from '@/components/price/Price'
import { homeSans } from '@/components/homepage/fonts'
import SiteHeader from '@/components/layout/SiteHeader'
import Hero from '@/components/homepage/Hero'
import ProductDemo from '@/components/homepage/ProductDemo'
import OccasionGrid from '@/components/homepage/OccasionGrid'
import DesignShowcase from '@/components/homepage/DesignShowcase'
import PremiumSpread, { type Suite } from '@/components/homepage/PremiumSpread'
import TryInvitation from '@/components/homepage/TryInvitation'
import PricingLevels, { type Level } from '@/components/homepage/PricingLevels'
import RealWork from '@/components/homepage/RealWork'
import ReviewsSection from '@/components/reviews/ReviewsSection'
import HomeFaq from '@/components/homepage/HomeFaq'
import FinalCta from '@/components/homepage/FinalCta'
import { homeFaqs } from '@/components/homepage/faqs'
import { displayName } from '@/lib/catalog'
import { buildCatalogItems, occasionChips, type CatalogItem } from '@/lib/catalogItems'
import { hreflangAlternates } from '@/lib/i18n'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'
import { FEATURES, TIERS, type FeatureKey, type TierKey } from '@/lib/tiers'
import { TEMPLATES } from '@/modules/templates/data'
import { editorsPicks } from '@/lib/editorsPicks'
import { seasonAt } from '@/lib/season'
import { homeSample, homeSampleFields } from '@/lib/homeSample'
import { designPlaceholder } from '@/lib/designPlaceholders'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

export const englishHomeMetadata: Metadata = {
  title: { absolute: 'Digital Invitation Maker for Weddings & Events | ShareInvite' },
  description:
    `Create digital invitations & animated 3D greetings for weddings, birthdays & every occasion. Share one link on WhatsApp. Preview before you pay, from ₹${LOWEST_PAID_PRICE}.`,
  keywords: [
    'digital invitation maker',
    'online invitation maker',
    'digital invitation card',
    'wedding invitation maker',
    'birthday invitation maker',
    'engagement invitation maker',
    'online RSVP',
    'WhatsApp invitation',
    'e-invitation',
    'invitation website',
    '3D invitation',
    'animated invitation',
    'interactive digital invitation',
    'animated 3D greeting card',
    'digital wedding invitation',
    'anniversary invitation online',
    'housewarming invitation online',
    'Indian wedding invitation',
    'shaadi invitation online',
    'griha pravesh invitation online',
    'namakaran invitation online',
  ],
  // A page's openGraph replaces the layout's whole, so siteName is restated; twitter
  // is set too, or the card would keep the layout's generic title.
  openGraph: {
    title: 'ShareInvite: Digital Invitation Maker for Every Occasion',
    description: `Create digital invitations and animated 3D greetings for every occasion and share them with one link. Build and preview before you pay; publish from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} one-time.`,
    siteName: 'ShareInvite',
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'ShareInvite digital invitation maker' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shareinvite',
    creator: '@shareinvite',
    title: 'ShareInvite: Digital Invitation Maker for Every Occasion',
    description: `Create digital invitations for every occasion and share them with one link. Build and preview before you pay; publish from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} one-time.`,
    images: [`${APP_URL}/opengraph-image`],
  },
  alternates: {
    canonical: APP_URL,
    // Declared here as well as in the root layout: a page-level `alternates`
    // replaces the layout's rather than merging with it, so without this the
    // English homepage advertised no translations while every locale pointed
    // back to it. Google discards one-directional hreflang, which would have
    // silently disabled the whole set.
    languages: hreflangAlternates('/', APP_URL),
  },
}

/** The homepage in an Indian language (/hi, /ta …). */
export function homeMetadata(lang: string): Metadata {
  if (lang === 'en') return englishHomeMetadata
  const t = tFor(lang)
  return localeMeta(lang, '/', {
    title: t('Digital Invitation Maker for Weddings & Events | ShareInvite'),
    description: t('Create digital invitations and animated 3D greetings for weddings, birthdays and every occasion. Share one link on WhatsApp. Preview before you pay, from {price}.', { price: `₹${LOWEST_PAID_PRICE}` }),
    openGraph: { images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: t('ShareInvite digital invitation maker') }] },
  })
}

// ─── Content ───────────────────────────────────────────────────────────────────

// The collection opens on the editor's selection (lib/editorsPicks); every filter then leads with its own picks.

/** The Signature wedding suites, most elaborate first, each with a line on what makes it. */
const SUITES: [string, string][] = [
  ['signature-two-worlds', 'A love story across two cultures'],
  ['signature-royal-edit', 'A luxury magazine, with you on the cover'],
  ['signature-rajwada', 'Palace doors at dusk, and fireworks'],
  ['signature-aquarelle', 'Redouté roses and a wax seal'],
  ['signature-saptapadi', 'The antarpat lifts on seven vows'],
  ['signature-kalyanam', 'A temple at dawn, a jasmine curtain'],
  ['signature-nikah', 'Lattice and lanterns'],
  ['signature-garden', 'A destination postcard'],
]

/** The walkthrough's gallery: six real designs, the pointer picking Rajwada (the phone frames are Rajwada's). */
const DEMO_PICKS = ['signature-two-worlds', 'birthday-mirrorball', 'haldi-mehendi', 'signature-royal-edit', 'signature-rajwada', 'sangeet-night']

/** The pricing table's rows, most asked-about first. */
const MATRIX: FeatureKey[] = ['map', 'music', 'photos', 'rsvp', 'wishes', 'programme', 'functions', 'guide', 'film']

const LEVEL_RECOMMENDED: Partial<Record<TierKey, string>> = { signature: 'Recommended for weddings' }

const label = (k: FeatureKey) => FEATURES.find((f) => f.key === k)?.label ?? k
const commonFeatures = (list: CatalogItem[]) => FEATURES.map((f) => f.key).filter((k) => list.length > 0 && list.every((i) => i.features.includes(k)))

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const tr = serverT()
  const english = serverLang() === 'en'
  const season = seasonAt()
  const all = buildCatalogItems(editorsPicks(), { keepOrder: true }).map((i) => (english ? i : localiseItem(i, tr)))
  // The collection opens with designs the Signature spread just below does not show (13 Nov 2026):
  // both used to open with Two Worlds, The Royal Edit, Rajwada and Aquarelle, so the second read as
  // a repeat of the first. The suites stay in the collection, after the rest, and under "Signature".
  const inSpread = new Set(SUITES.map(([id]) => id))
  const showcase = [...all.filter((i) => !inSpread.has(i.id)), ...all.filter((i) => inSpread.has(i.id))]
  const paid = all.filter((i) => i.price > 0)
  const count = (k: FeatureKey) => all.filter((i) => i.features.includes(k)).length
  const total = all.length

  // Levels, cheapest first: what each costs, holds and how many designs it has.
  const levels: Level[] = [...TIERS].reverse().map((t) => {
    const set = paid.filter((i) => i.tier === t.key)
    const prices = set.map((i) => i.price)
    return {
      key: t.key,
      name: tr(t.name),
      promise: tr(t.promise),
      from: Math.min(...prices),
      to: Math.max(...prices),
      count: set.length,
      // Every feature, with how many of this level's designs hold it: shown as a count, so nothing is overstated.
      matrix: MATRIX.map((k) => ({ key: k, label: tr(label(k)), n: set.filter((i) => i.features.includes(k)).length })),
      recommended: LEVEL_RECOMMENDED[t.key] ? tr(LEVEL_RECOMMENDED[t.key] as string) : undefined,
    }
  })

  // A row that no level has would only say "no" three times.
  const keep = new Set(MATRIX.filter((_, ri) => levels.some((l) => l.matrix[ri].n > 0)))
  for (const l of levels) l.matrix = l.matrix.filter((r) => keep.has(r.key as FeatureKey))

  const suites: Suite[] = SUITES.flatMap(([id, note]) => {
    const i = all.find((t) => t.id === id)
    return i ? [{ id: i.id, name: i.name, note: tr(note), price: i.price, image: i.image, slug: i.slug, ph: designPlaceholder(i.id) }] : []
  })
  const suiteIncludes = commonFeatures(all.filter((i) => SUITES.some(([s]) => s === i.id))).map((k) => tr(label(k)))


  const sample = homeSample()
  const faqs = homeFaqs({ total, rsvp: count('rsvp'), music: count('music'), photos: count('photos') }, tr)
  const names = Object.fromEntries(TEMPLATES.map((t) => [t.id, displayName(t.name)]))

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ShareInvite',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    url: APP_URL,
    description:
      'Create a beautiful digital invitation for weddings, birthdays, engagements, anniversaries, naming ceremonies, housewarmings, festivals and animated greetings. Share one link on WhatsApp, Instagram or email.',
    // No aggregateRating / review: nothing in this codebase backs a rating, and
    // Google disallows self-serving reviews on your own Organization/Product
    // markup. Re-add only once reviews are genuinely collected and stored.
    // One price per design, not plans: a range across the catalogue.
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(LOWEST_PAID_PRICE),
      highPrice: String(HIGHEST_PAID_PRICE),
      priceCurrency: 'INR',
      offerCount: TEMPLATES.length,
      availability: 'https://schema.org/InStock',
      url: `${APP_URL}/templates`,
    },
    author: { '@type': 'Person', name: 'Prathik Thelkar' },
    featureList: [
      'Mobile-first invitation website',
      'Live countdown timer',
      'Photo gallery',
      'Background music player',
      'Google Maps integration',
      'WhatsApp sharing link',
      'Guest wishes collection',
      `${TEMPLATES.length} event & greeting templates`,
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    // overflow-x-clip, not -hidden: "hidden" makes <main> a scroll container,
    // and the sticky header then measured its top from <main> instead of the window.
    <main className={`hv ${homeSans.variable} min-h-screen overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader ctaLocation="home_header" />
      <Hero names={names} />
      <ProductDemo
        picks={DEMO_PICKS.flatMap((id) => all.filter((i) => i.id === id)).map((i) => ({ id: i.id, name: i.name, image: i.image, price: i.price, ph: designPlaceholder(i.id) }))}
        pickIndex={DEMO_PICKS.indexOf('signature-rajwada')}
        start={homeSampleFields(sample)}
      />
      <OccasionGrid />
      <DesignShowcase
        items={showcase}
        occasions={occasionChips(all)}
        levels={levels.map((l) => ({ key: l.key, label: l.name, from: l.from }))}
        total={total}
        placeholders={Object.fromEntries(all.map((i) => [i.id, designPlaceholder(i.id)]))}
      />
      <PremiumSpread suites={suites} includes={suiteIncludes} />
      <TryInvitation templateId={sample.templateId} couple={sample.couple} link={sample.link} />
      <PricingLevels levels={levels} />
      <RealWork />
      {/* Real reviews from hosts (lib/reviews.ts); nothing at all until there is one. English only: they are written in English. */}
      {english && <ReviewsSection tone="champagne" />}
      <HomeFaq faqs={faqs} />
      <CustomRequestSection />
      <FinalCta />

      {/* ─── SEO CONTENT (crawlable copy + internal links) ─── */}
      <section className="bg-hv-ivory" aria-label={tr('About ShareInvite digital invitation maker')}>
        <div className="hv-shell max-w-3xl py-14 max-sm:py-10">
          <h2 className="hv-h3">{tr('The digital invitation maker for every celebration')}</h2>
          <input type="checkbox" id="about-more" className="phone-more-check sr-only" aria-label={tr('Show all of About ShareInvite')} />
          <div className="phone-more-body prose-brand mt-5 text-[0.95rem]">
            <p>
              {rich(tr('{brand} is an online invitation maker for creating beautiful digital invitations and animated 3D greeting cards in minutes: no design skills and no app needed for your guests. Choose a template, add your names, date, venue and photos, and share a single link on WhatsApp that opens instantly in any phone browser, anywhere in the world.'), { brand: <strong>ShareInvite</strong> })}
            </p>
            <p>
              {rich(tr('Make a {wedding}, a {birthday}, an {engagement}, an {anniversary}, a {griha}, or a {namakaran}.'), {
                wedding: <Link prefetch={false} href="/wedding-invitation">{tr('digital wedding invitation')}</Link>,
                birthday: <Link prefetch={false} href="/birthday-invitation">{tr('birthday invitation')}</Link>,
                engagement: <Link prefetch={false} href="/engagement-invitation">{tr('engagement invite')}</Link>,
                anniversary: <Link prefetch={false} href="/anniversary-invitation">{tr('anniversary invitation')}</Link>,
                griha: <Link prefetch={false} href="/griha-pravesh-invitation">{tr('griha pravesh invitation')}</Link>,
                namakaran: <Link prefetch={false} href="/namakaran-invitation">{tr('namakaran invitation')}</Link>,
              })}{' '}
              {rich(tr('Prefer something more personal? Send an interactive {journey}, a {valentine}, an {anniversary}, or a {proposal}.'), {
                journey: <Link prefetch={false} href="/blog/3d-surprise-journey-the-interactive-digital-gift-you-send-online">3D Surprise Journey</Link>,
                valentine: <Link prefetch={false} href="/blog/valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp">{tr('Valentine’s Day card')}</Link>,
                anniversary: <Link prefetch={false} href="/blog/anniversary-card-online-create-a-3d-animated-anniversary-card">{tr('anniversary card')}</Link>,
                proposal: <Link prefetch={false} href="/blog/digital-proposal-card-a-3d-will-you-marry-me-card-that-says-yes">{tr('3D proposal card')}</Link>,
              })}{' '}
              {rich(tr('Celebrating Rakhi apart from your sibling? Send a {rakhi}.'), { rakhi: <Link prefetch={false} href="/blog/raksha-bandhan-invitation-card-online-free-digital-rakhi-template">{tr('Raksha Bandhan invitation card online')}</Link> })}{' '}
              {rich(tr('Welcoming Bappa home? Make a {ganesh} for just {price}.'), {
                ganesh: <Link prefetch={false} href="/blog/ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template">{tr('Ganesh Chaturthi invitation card online')}</Link>,
                price: <Price inr={LOWEST_PAID_PRICE} />,
              })}{' '}
              {/* The season's sentence (lib/season.ts): New Year's Eve until 31 December, then Valentine's Day. */}
              {season.key === 'newyear' && rich(tr('Hosting a New Year’s Eve party? Start with our {newyear}, or find the right words for a {birthday}.'), {
                newyear: <Link prefetch={false} href="/blog/new-year-party-invitation-message-new-years-eve-invitation-wording">{tr('New Year party invitation messages')}</Link>,
                birthday: <Link prefetch={false} href="/birthday-invitation-wording">{tr('birthday invitation message')}</Link>,
              })}
              {season.key === 'valentine' && <>{rich(tr('Saying it this Valentine’s Day? Write a {confession} that asks the question.'), {
                confession: <Link prefetch={false} href="/blog/valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp">{tr('Valentine confession letter')}</Link>,
              })}{' '}</>}
              {/* The wording guides are the site's most-read pages; the New Year sentence links the birthday one itself. */}
              {season.key !== 'newyear' && rich(tr('Need the words first? Copy a {birthday} or a {wedding} for WhatsApp.'), {
                birthday: <Link prefetch={false} href="/birthday-invitation-wording">{tr('birthday invitation message')}</Link>,
                wedding: <Link prefetch={false} href="/wedding-invitation-wording">{tr('wedding invitation message')}</Link>,
              })}
            </p>
            <p>
              {rich(tr('Build and preview before you pay. One-time payment, from {price}, only when you publish. See every design on the {templates}, see how pricing works on {pricing}, or read guides on the {blog}.'), {
                price: <Price inr={LOWEST_PAID_PRICE} />,
                templates: <Link prefetch={false} href="/templates">{tr('templates page')}</Link>,
                pricing: <Link prefetch={false} href="/pricing">{tr('pricing')}</Link>,
                blog: <Link prefetch={false} href="/blog">{tr('ShareInvite blog')}</Link>,
              })}
            </p>
          </div>
          <label htmlFor="about-more" className="phone-more-toggle mt-3 text-[0.9rem] font-semibold text-hv-forest underline underline-offset-4" />
        </div>
      </section>

      <SiteFooter />
      <StickyMobileCTA />
    </main>
  )
}
