import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SoftwareAppSchema } from '@/components/StructuredData'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion, { type Faq } from '@/components/landing/FAQAccordion'
import CustomRequestSection from '@/components/landing/CustomRequestSection'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import TemplateBrowser from '@/components/catalog/TemplateBrowser'
import TrackedLink from '@/components/ui/TrackedLink'
import PhoneFanHero from '@/components/brand/PhoneFanHero'
import Marquee from '@/components/brand/Marquee'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import {
  ArrowRightIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  MusicIcon,
  SwapIcon,
} from '@/components/ui/Icons'
import { OCCASIONS } from '@/lib/catalog'
import { buildCatalogItems, occasionChips } from '@/lib/catalogItems'
import { LOCALES, hreflangAlternates, localePath } from '@/lib/i18n'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'
import { OFFER } from '@/lib/offer'
import { TEMPLATES } from '@/modules/templates/data'
import { priceRangeSentence } from '@/lib/priceCopy'
import SignatureShowcase from '@/components/brand/SignatureShowcase'
import { Price, PayMethods } from '@/components/price/Price'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

export const metadata: Metadata = {
  title: { absolute: 'Digital Invitation Maker for Weddings & Events | ShareInvite' },
  description:
    `Create digital invitations & animated 3D greetings for weddings, birthdays & every occasion. Share one link on WhatsApp — preview before you pay, from ₹${LOWEST_PAID_PRICE}.`,
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
  openGraph: {
    title: 'ShareInvite — Digital Invitation Maker for Weddings, Birthdays & Every Occasion',
    description: `Create digital invitations and animated 3D greetings for every occasion and share them with one link. Build and preview before you pay; publish from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} one-time.`,
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'ShareInvite digital invitation maker' }],
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

// ─── Content ───────────────────────────────────────────────────────────────────

/**
 * Rendered by the accordion AND emitted as FAQPage JSON-LD from this one list.
 * Google requires FAQ markup to match visible content; the previous homepage
 * marked up six questions while showing eight different ones.
 */
const HOME_FAQS: Faq[] = [
  {
    question: 'What is a digital invitation?',
    answer: 'A digital invitation is a beautifully designed page your guests open from a link — no app to download. Depending on the design it can hold your event details, a live countdown, photos, music, Google Maps directions and a wall where guests leave wishes.',
  },
  {
    question: 'Can guests open it on WhatsApp without installing anything?',
    answer: 'Yes. You get one link that works on WhatsApp, Instagram, Messenger, email, SMS and any phone or computer browser. Guests tap it and the invitation opens straight away — no app, no account, no sign-up.',
  },
  {
    question: 'Does it work for guests in other countries?',
    answer: 'Yes. An invitation is a web page, so it opens in any modern browser anywhere in the world. You can send the same link to family at home and to guests abroad.',
  },
  {
    question: 'Which occasions can I make an invitation for?',
    answer: 'Weddings, engagements, birthdays, anniversaries, naming ceremonies and housewarmings, festivals such as Diwali, Ganesh Chaturthi and Raksha Bandhan, and animated 3D greetings for love, proposals, friendship, family and congratulations. If your event is not listed, you can request a custom design.',
  },
  {
    question: 'Do I have to pay before I can see my invitation?',
    answer: `No. There is no payment until you publish — pick a design, add every detail and see the finished invitation without entering a card. Publishing is a one-time payment for the design you choose. ${priceRangeSentence()} There are no monthly fees.`,
  },
  {
    question: 'What exactly am I paying for?',
    answer: `One design. Each design shows its price up front, from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} to ₹${HIGHEST_PAID_PRICE.toLocaleString('en-IN')}. You pay once when you publish, and that covers everything in the design — your invitation on its own link, every feature it has, and sharing with as many guests as you like. No plans, bundles or subscription.`,
  },
  {
    question: 'Can I write my invitation in my own language?',
    answer: 'Yes. Every word on the invitation is yours to write, so you can use any language your keyboard supports — or mix two, as many families do.',
  },
  {
    question: 'Can I change the design after I have started?',
    answer: 'Yes. Go back and pick another design at any point before you publish. The names, date, venue and message you have already typed carry across wherever the new design has the same kind of field.',
  },
  {
    question: 'How long does it take?',
    answer: 'Usually a few minutes. Choose a design, fill in names, date, venue and a message, preview it, and publish to get your link.',
  },
]


// The gallery's "All" view is capped at eight cards, so lead with a spread of
// occasions rather than the catalogue order (which would be six weddings).
/** Quick ways in from the hero — the occasions most visitors come for. */
const HERO_OCCASIONS = [
  { label: 'Wedding', href: '/wedding-invitation' },
  { label: 'Haldi & Mehendi', href: '/templates/category/prewedding' },
  { label: 'Birthday', href: '/birthday-invitation' },
  { label: 'Griha Pravesh', href: '/griha-pravesh-invitation' },
  { label: 'Baby shower', href: '/templates/category/babyshower' },
  { label: 'Diwali & Eid', href: '/templates/category/festival' },
]

const FEATURED_FIRST = [
  'luxury-wedding', 'indian-birthday', 'greeting-love', 'anniversary',
  'elegant-wedding', 'ganesh-chaturthi', 'namakaran', 'surprise-journey',
]

// Left and right of the phone in the feature showcase.
const FEATURES_LEFT = [
  { Icon: MapPinIcon, title: 'Venue & directions', copy: 'The address and a one-tap Google Maps button.' },
  { Icon: CalendarIcon, title: 'Every function', copy: 'Ceremonies and timings, in order.' },
  { Icon: ClockIcon, title: 'Live countdown', copy: 'Days, hours and minutes to the moment.' },
]
const FEATURES_RIGHT = [
  { Icon: CameraIcon, title: 'Your photos', copy: 'A gallery guests can scroll through.' },
  { Icon: MusicIcon, title: 'Background music', copy: 'A song that sets the mood.' },
  { Icon: HeartIcon, title: 'Guest wishes', copy: 'Messages from guests appear live.' },
]

// Sample line in each language the site is translated into. Each card links to
// that language's homepage, so the section doubles as crawlable locale links.
const LANGUAGE_SAMPLES: Record<string, string> = {
  en: 'Together we celebrate',
  hi: 'साथ मिलकर जश्न मनाएँ',
  es: 'Celebremos juntos',
  pt: 'Vamos celebrar juntos',
  fr: 'Célébrons ensemble',
  id: 'Mari rayakan bersama',
  vi: 'Cùng nhau chung vui',
  ar: 'لنحتفل معاً',
}

// Illustrative wishes for the showcase. Labelled as an example on the page.
const SAMPLE_WISHES = [
  { name: 'Sharma family', msg: 'Wishing you both a lifetime of love and laughter. So happy for you!' },
  { name: 'Priya aunty', msg: 'May your home always be full of joy. Blessings from all of us.' },
  { name: 'College gang', msg: 'We always knew! Cannot wait to dance at the sangeet.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const items = buildCatalogItems(FEATURED_FIRST, { keepOrder: true })
  const chips = occasionChips(items)

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
    mainEntity: HOME_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    // overflow-x-clip, not -hidden: "hidden" makes <main> a scroll container,
    // and the sticky header then measured its top from <main> instead of the
    // window — a gap under the offer bar on phones, and a header that scrolled away.
    <main className="min-h-screen overflow-x-clip bg-champagne text-charcoal">
      <SoftwareAppSchema />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      {/* ─── HERO ─── */}
      <section aria-labelledby="hero-headline" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_20%,rgba(232,200,102,0.22),transparent_70%),radial-gradient(45%_50%_at_0%_100%,rgba(251,239,227,0.95),transparent_70%)]"
        />
        <div className="shell relative grid items-center gap-10 pb-12 pt-8 sm:gap-12 md:pb-16 md:pt-12 lg:grid-cols-[1.02fr_1fr] lg:gap-8 lg:pb-20 lg:pt-14">
          <div className="min-w-0">
            <p className="enter-0 inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3.5 py-1.5 text-[0.78rem] font-semibold text-charcoal/80">
              <span className="h-1.5 w-1.5 rounded-full bg-burnished" aria-hidden />
              Digital invitation maker
            </p>
            <h1 id="hero-headline" className="t-display enter-0 mt-5" style={{ fontSize: 'clamp(2.55rem, 5.4vw, 4.9rem)' }}>
              Digital invitations, <em className="font-medium text-burnished">beautifully</em> made for every celebration
            </h1>
            <p className="t-lede enter-1 mt-5 max-w-[34rem] sm:mt-6">
              Choose a design you love, make it yours in minutes, and send one link your guests open anywhere —
              WhatsApp, Instagram, email or text. You only pay when it&apos;s ready to share.
            </p>

            <div className="enter-2 mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/create"
                location="home_hero"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
              >
                Create your invitation
                <ArrowRightIcon />
              </TrackedLink>
              <Link
                href="/templates"
                className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold"
              >
                See the designs
              </Link>
            </div>
            <TrustList className="enter-3 mt-6" items={['Preview before you pay', 'Pay once, from ₹' + LOWEST_PAID_PRICE, 'No app for guests']} />

            <nav aria-label="Popular occasions" className="enter-3 mt-8 border-t border-line pt-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted">Popular right now</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {HERO_OCCASIONS.map((o) => (
                  <li key={o.href}>
                    <Link
                      href={o.href}
                      className="inline-flex min-h-[2.6rem] items-center rounded-full border border-line bg-paper px-4 text-[0.88rem] font-semibold text-charcoal transition-colors hover:border-burnished hover:text-burnished-deep"
                    >
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="enter-4 mx-auto w-full min-w-0 max-w-[34rem] lg:max-w-none">
            <PhoneFanHero />
          </div>
        </div>
      </section>

      <Marquee />

      {/* ─── OCCASIONS ─── */}
      <Section id="occasions" aria-label="Occasions">
        <SectionHeading
          eyebrow="Start with your occasion"
          title="For every celebration, big or small"
          sub="Weddings and birthdays, festivals and first names, proposals and thank-yous — begin with what you're celebrating."
          action={{ href: '/templates', label: 'All designs' }}
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5" data-reveal-group>
          {OCCASIONS.map((o) => (
            <li key={o.key}>
              <Link href={o.href} className="lift group block overflow-hidden rounded-3xl border border-line bg-paper">
                <span className="relative block aspect-[384/300] overflow-hidden bg-peach">
                  <Image
                    src={o.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </span>
                <span className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="min-w-0">
                    <span className="block font-editorial text-[1.35rem] font-semibold leading-tight">{o.label}</span>
                    <span className="mt-0.5 block truncate text-[0.8rem] text-muted">{o.blurb}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-burnished transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-[0.95rem] text-muted" data-reveal>
          Celebrating something else?{' '}
          <a href="#custom-template" className="link">We&apos;ll design it for you</a>
        </p>
      </Section>

      {/* ─── DESIGNS ─── */}
      <Section tone="paper" id="templates" aria-label="Featured designs">
        <SectionHeading
          eyebrow="The collection"
          title="Choose a design you love"
          sub="Open any design in a live preview, exactly as guests will see it, and try it with your own details before you pay."
          action={{ href: '/templates', label: 'See every design' }}
        />
        <div className="mt-9">
          <TemplateBrowser items={items} chips={chips} source="home_gallery" limit={8} showCount={false} />
        </div>
      </Section>

      <SignatureShowcase id="signature-collection" />

      {/* ─── THE OFFER ─── */}
      <Section id="pricing" aria-labelledby="offer-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div data-reveal>
            <p className="eyebrow">Simple, honest pricing</p>
            <h2 id="offer-heading" className="t-h2 mt-3">{OFFER.headline}</h2>
            <p className="t-lede mt-5 max-w-xl">
              Every design shows its price up front — from <Price inr={LOWEST_PAID_PRICE} /> to <Price inr={HIGHEST_PAID_PRICE} />. Build it,
              preview it, and share it with family first if you like. When you&apos;re happy, pay once and it&apos;s
              yours. No plans. No bundles. No subscription.
            </p>
            <ol className="mt-9 space-y-5" data-reveal-group>
              {[
                { t: 'Preview it with your details', c: 'Add your real names, date and photos and see the finished invitation before you pay.' },
                { t: 'Pay once for the one you choose', c: <>A single secure payment by <PayMethods />.</> },
                { t: 'Your invitation, handed over', c: 'Your link, every feature in the design, and as many guests as you like.' },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burnished/50 font-editorial text-[1.25rem] font-semibold text-burnished-deep">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[1.02rem] font-semibold">{step.t}</span>
                    <span className="mt-0.5 block text-[0.95rem] leading-7 text-charcoal/70">{step.c}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/pricing" className="link mt-8 inline-flex items-center gap-1.5">
              How pricing works <ArrowRightIcon />
            </Link>
          </div>
          <div data-reveal="scale">
            <OfferCard cta="Create your invitation" location="home_offer" />
          </div>
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section tone="peach" id="how-it-works" aria-label="How it works">
        <SectionHeading align="center" eyebrow="Three simple steps" title="From idea to invitation in minutes" />
        <div className="mt-12">
          <HowItWorks />
        </div>
        <div className="mt-10 flex flex-col items-center gap-3" data-reveal>
          <TrackedLink href="/create" location="home_steps" className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
            Start with a design
            <ArrowRightIcon />
          </TrackedLink>
          <p className="inline-flex items-center gap-2 text-[0.88rem] text-charcoal/70">
            <SwapIcon className="h-4 w-4 text-emerald-soft" /> Switch designs any time — your details come with you
          </p>
        </div>
      </Section>

      {/* ─── FEATURE SHOWCASE ─── */}
      <Section id="features" aria-label="What an invitation includes">
        <SectionHeading
          align="center"
          eyebrow="More than a card"
          title="Everything guests need, in one link"
          sub="No more forwarding the address, the timings and the photos as five separate messages."
        />
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" data-reveal-group>
            {FEATURES_LEFT.map((f) => <FeatureItem key={f.title} {...f} align="right" />)}
          </ul>
          <div className="relative mx-auto w-[15.5rem]" data-reveal="scale">
            <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(232,200,102,0.35),transparent)]" />
            <div className="relative rounded-[2.4rem] bg-charcoal p-[7px] shadow-[0_40px_80px_-30px_rgba(5,46,32,0.7)]">
              <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-peach">
                <Image src="/templates/phone/royal-deco-screen.jpg" alt="Royal Deco invitation design on a phone" fill sizes="250px" className="object-cover" />
                <span aria-hidden className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-charcoal" />
              </div>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" data-reveal-group>
            {FEATURES_RIGHT.map((f) => <FeatureItem key={f.title} {...f} align="left" />)}
          </ul>
        </div>
        <p className="mt-10 text-center text-[0.85rem] text-muted">
          Features vary by design — the live preview shows exactly what each one includes.
        </p>
      </Section>

      {/* ─── GLOBAL ─── */}
      <Section tone="emerald" aria-labelledby="global-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft">One link · every language</p>
            <h2 id="global-heading" className="t-h2 mt-3">Celebrate with people wherever they call home</h2>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-8 text-paper/75">
              Your guests don&apos;t need an app, an account or a particular phone. The invitation opens in any
              browser, in any country — and every word on it is yours, in whichever language your family speaks.
            </p>
            <ul className="mt-7 space-y-2.5 text-[0.95rem] text-paper/85">
              {['Works on every phone and computer', 'Share on WhatsApp, Instagram, email or text', 'A rich preview card in every chat'].map((t) => (
                <li key={t} className="flex items-center gap-2"><GlobeIcon className="h-4 w-4 text-gold-soft" />{t}</li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-reveal-group>
            {LOCALES.map((l) => (
              <li key={l.code}>
                <Link
                  href={localePath('/', l.code)}
                  hrefLang={l.htmlLang}
                  className="flex h-full flex-col justify-between rounded-3xl border border-paper/15 bg-paper/[0.06] p-4 transition-colors hover:border-gold-soft/60 hover:bg-paper/10"
                >
                  <span className="spark-twinkle inline-block text-gold-soft" aria-hidden>✦</span>
                  <span dir={l.dir} lang={l.htmlLang} className="mt-6 block font-editorial text-[1.35rem] italic leading-tight">
                    {LANGUAGE_SAMPLES[l.code]}
                  </span>
                  <span className="mt-3 block text-[0.78rem] text-paper/55">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ─── WISHES ─── */}
      <Section aria-label="Guest wishes">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow">Guest wishes</p>
            <h2 className="t-h2 mt-3">An invitation that fills up with love</h2>
            <p className="t-lede mt-5 max-w-lg">
              On every event design, guests leave a message right on the invitation — even those who can&apos;t make
              it in person. Each one appears straight away for everyone who opens the link, and you can remove any
              from your dashboard.
            </p>
            <ul className="mt-7 space-y-3 text-[0.95rem]">
              {['Takes a guest about twenty seconds', 'No approval queue — wishes go live instantly', 'Stays on the invitation as a keepsake'].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-soft" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="card p-5 sm:p-7" data-reveal="right">
            <div className="flex items-center justify-between">
              <p className="font-editorial text-[1.55rem] font-semibold">Wishes for Priya &amp; Arjun</p>
              <span className="pill border-transparent bg-peach text-burnished-deep">Example</span>
            </div>
            <ul className="mt-5 space-y-3" data-reveal-group>
              {SAMPLE_WISHES.map((w) => (
                <li key={w.name} className="rounded-2xl border border-line bg-champagne p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald font-editorial text-[1.1rem] font-semibold text-paper">
                      {w.name[0].toUpperCase()}
                    </span>
                    <span className="text-[0.92rem] font-semibold">{w.name}</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-emerald-soft">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-soft" /> Live
                    </span>
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-6 text-charcoal/75">{w.msg}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section tone="paper" id="faq" aria-label="Frequently asked questions">
        <SectionHeading align="center" eyebrow="Questions" title="Everything you'd want to know" />
        <div className="mt-10">
          <FAQAccordion faqs={HOME_FAQS} />
        </div>
      </Section>

      <CustomRequestSection />

      <CtaBand location="home_closing" />

      {/* ─── SEO CONTENT (crawlable copy + internal links) ─── */}
      <section className="bg-paper" aria-label="About ShareInvite digital invitation maker">
        <div className="shell max-w-3xl py-14">
          <h2 className="font-editorial text-[1.9rem] font-semibold">The digital invitation maker for every celebration</h2>
          <div className="prose-brand mt-5 text-[0.95rem]">
            <p>
              <strong>ShareInvite</strong> is an online invitation maker for creating beautiful digital
              invitations and animated 3D greeting cards in minutes — no design skills and no app needed for your guests.
              Choose a template, add your names, date, venue and photos, and share a single link on WhatsApp that opens
              instantly in any phone browser, anywhere in the world.
            </p>
            <p>
              Make a <Link href="/wedding-invitation">digital wedding invitation</Link>,
              a <Link href="/birthday-invitation">birthday invitation</Link>,
              an <Link href="/engagement-invitation">engagement invite</Link>,
              an <Link href="/anniversary-invitation">anniversary invitation</Link>,
              a <Link href="/griha-pravesh-invitation">griha pravesh invitation</Link>, or a
              {' '}<Link href="/namakaran-invitation">namakaran invitation</Link>.
              Prefer something more personal? Send an interactive
              {' '}<Link href="/blog/3d-surprise-journey-the-interactive-digital-gift-you-send-online">3D Surprise Journey</Link>,
              a <Link href="/blog/valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp">Valentine&apos;s Day card</Link>,
              an <Link href="/blog/anniversary-card-online-create-a-3d-animated-anniversary-card">anniversary card</Link>, or a
              {' '}<Link href="/blog/digital-proposal-card-a-3d-will-you-marry-me-card-that-says-yes">3D proposal card</Link>.
              Celebrating Rakhi apart from your sibling? Send a
              {' '}<Link href="/blog/raksha-bandhan-invitation-card-online-free-digital-rakhi-template">Raksha Bandhan invitation card online</Link>.
              Welcoming Bappa home? Make a
              {' '}<Link href="/blog/ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template">Ganesh Chaturthi invitation card online</Link>
              {' '}for just <Price inr={LOWEST_PAID_PRICE} />.
              Hosting a Diwali party? Start with our
              {' '}<Link href="/diwali-invitation-wording">Diwali invitation messages</Link>, or find the right words for a
              {' '}<Link href="/birthday-invitation-wording">birthday invitation message</Link>.
            </p>
            <p>
              Build and preview before you pay — one-time payment, from <Price inr={LOWEST_PAID_PRICE} />, only when you publish. See every design on the
              {' '}<Link href="/templates">templates page</Link>, see how pricing works on
              {' '}<Link href="/pricing">pricing</Link>, or read guides on the <Link href="/blog">ShareInvite blog</Link>.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <StickyMobileCTA />
    </main>
  )
}

function FeatureItem({
  Icon,
  title,
  copy,
  align,
}: {
  Icon: (p: { className?: string }) => JSX.Element
  title: string
  copy: string
  align: 'left' | 'right'
}) {
  return (
    <li className={`flex items-start gap-4 rounded-3xl border border-line bg-paper p-5 ${align === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-soft">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-editorial text-[1.35rem] font-semibold leading-tight">{title}</span>
        <span className="mt-1 block text-[0.92rem] leading-6 text-charcoal/70">{copy}</span>
      </span>
    </li>
  )
}
