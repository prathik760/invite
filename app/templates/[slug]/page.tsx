import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ComponentType } from 'react'
import ShareDesignButton from '@/components/catalog/ShareDesignButton'
import PreviewButton from '@/components/catalog/PreviewButton'
import TemplateCard from '@/components/catalog/TemplateCard'
import FAQAccordion from '@/components/landing/FAQAccordion'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Breadcrumbs } from '@/components/brand/PageHero'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, CalendarIcon, CameraIcon, ClockIcon, EyeIcon, HeartIcon, MapPinIcon, MusicIcon, PenIcon, ShirtIcon, SparklesIcon, UsersIcon, PhoneIcon, GlobeIcon, LaptopIcon, ClipboardIcon } from '@/components/ui/Icons'
import { displayName, is3D, primaryOccasion, styleTag } from '@/lib/catalog'
import { buildCatalogItems } from '@/lib/catalogItems'
import SiteHeader from '@/components/layout/SiteHeader'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import TrackedLink from '@/components/ui/TrackedLink'
import { TEMPLATES } from '@/modules/templates/data'
import { absoluteUrl, breadcrumbJsonLd, digitalOffer, SITE_NAME, templateCategorySlug, templateSeoSlug } from '@/lib/seo'
import { getRequiredPlan } from '@/lib/plans'
import { templateImage, templateImageUrl } from '@/lib/templateMedia'

type Props = { params: { slug: string } }

function findTemplateBySlug(slug: string) {
  return TEMPLATES.find((template) => templateSeoSlug(template.id) === slug)
}

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: templateSeoSlug(template.id) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const template = findTemplateBySlug(params.slug)
  if (!template) return {}
  const url = absoluteUrl(`/templates/${params.slug}`)
  const plan = getRequiredPlan(template.id)
  const priceLabel = plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`
  // Price in the title earns the click on commercial queries — "cost"/"price"
  // is the most common qualifier on these searches, and a visible price
  // pre-qualifies the visitor instead of surprising them at step 5.
  const title = `${template.name} Invitation Template — ${priceLabel} | ShareInvite`
  const description =
    template.id === 'royal-deco'
      ? `Royal wedding invitation template — ${priceLabel}, one-time. Add your names, date, venue, Google Maps and photos, then share the link on WhatsApp. No app needed for guests.`
      : `${template.description} ${priceLabel}, one-time — add your details, preview it before you pay, and share the invitation link on WhatsApp. No app needed for guests.`
  const ogImage = templateImageUrl(template.id)

  return {
    title: { absolute: title },
    description,
    keywords: [template.name, `${template.category} invitation template`, 'digital invitation template', 'whatsapp invitation card', 'online RSVP'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
      // Share previews now show the actual template rather than one generic
      // brand card repeated across every template page.
      images: [{ url: ogImage, alt: `${template.name} digital invitation template` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

function productJsonLd(template: NonNullable<ReturnType<typeof findTemplateBySlug>>, url: string) {
  const plan = getRequiredPlan(template.id)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${template.name} Template`,
    description: template.description,
    // The real preview of this template. Was the generic site-wide OG card,
    // which is the same image for all 23 products and shows no template at all.
    image: [templateImageUrl(template.id)],
    sku: template.id,
    brand: {
      '@type': 'Brand',
      name: 'ShareInvite',
    },
    category: `${template.category} invitation template`,
    url,
    // Offer URL is this page, not /create — the offer lives where the price is
    // stated. See lib/seo.ts for why there is no shippingDetails or validFrom.
    offers: digitalOffer(plan.price, url),
  }
}


/**
 * Per-occasion context. All 23 template pages previously shared three
 * identical boilerplate paragraphs with only the template name and description
 * substituted in — which is why Search Console reports
 * /templates/royal-deco-palace-edition-invitation-template as "Duplicate
 * without user-selected canonical". Text is keyed by category so pages differ
 * by what they are actually for, not by a swapped noun.
 */
const CATEGORY_CONTEXT: Record<string, { intro: string; guests: string }> = {
  signature: {
    intro: 'A wedding of several days asks guests to plan: which functions they are invited to, what to wear to each, where to stay and how to get there.',
    guests: 'Guests — especially those travelling from other cities or abroad — want every function, venue, dress code, hotel and contact in one link they can reopen all week.',
  },
  babyshower: {
    intro: 'A Godh Bharai or baby shower is planned around the mother’s comfort, often at home and at short notice.',
    guests: 'Family and friends want the time, the address and a note on the theme or colours so they can bring the right blessings.',
  },
  prewedding: {
    intro: 'Haldi, Mehendi and Sangeet are the most relaxed and the most crowded days of a wedding, and they move around more than the wedding itself.',
    guests: 'Guests want the timing, the venue and above all the dress code — yellow for the Haldi, green for the Mehendi, glamour for the Sangeet.',
  },
  pooja: {
    intro: 'A home pooja is fixed around its muhurat, so the start time matters more than anything else on the invitation.',
    guests: 'Guests want the pooja and aarti timings, the address and whether prasad or lunch will be served.',
  },
  festival: {
    intro: 'Festival evenings — Diwali, Eid and the rest — are planned in a busy week, with many invitations arriving at once.',
    guests: 'Guests want the time, the address and a sense of the evening, so an invitation that stands out gets the answer first.',
  },
  retirement: {
    intro: 'A retirement or farewell gathers colleagues, friends and family who rarely meet in one place.',
    guests: 'Guests want the venue, the time and a place to leave a message for the person of the evening.',
  },
  wedding: {
    intro: 'Indian weddings run across several days and several venues, and the details move right up to the last week — a muhurat shifts, a hall changes, a function gets added.',
    guests: 'Guests travelling in from other cities need the venue address, a map pin and the ceremony timings in one place they can reopen on the morning of the wedding.',
  },
  engagement: {
    intro: 'A Mangni, Roka or Sagai is usually arranged on shorter notice than the wedding itself, often within a few weeks of the families agreeing.',
    guests: 'Because the guest list is smaller and more personal, the invitation carries more weight — guests look for the ring ceremony time, the venue and who is hosting.',
  },
  birthday: {
    intro: 'Birthday plans change more than any other event — the venue, the time and the theme are often confirmed only days before.',
    guests: 'Parents and friends want the party time, the address with directions, and a sense of the theme so they know what to bring and what to wear.',
  },
  housewarming: {
    intro: 'A Griha Pravesh is scheduled around a muhurat, which means the timing matters more than almost anything else on the invitation.',
    guests: 'Guests need the pooja start time, the full new address — usually somewhere they have never been — and a map link, since new developments are often missing from older directions.',
  },
  naming: {
    intro: 'A Namakaran or cradle ceremony is typically held within weeks of the birth, when the family has very little time to organise printing and delivery.',
    guests: 'Close family and neighbours need the ceremony time, the venue and the baby\u2019s name reveal — and they tend to reopen the invitation to show relatives.',
  },
  anniversary: {
    intro: 'A milestone anniversary is usually organised by children or family rather than the couple themselves, often as a surprise.',
    guests: 'Guests want the celebration time, the venue and a sense of the couple\u2019s story — photographs from across the years do more work here than on any other invitation.',
  },
  movie: {
    intro: 'A cinematic wedding invitation sets a tone before a single detail is read — it signals the scale and mood of the celebration.',
    guests: 'The dramatic treatment is what gets it forwarded, but guests still need the practical details underneath: dates, venue, schedule and directions.',
  },
  retro: {
    intro: 'A period-styled invitation suits couples who have chosen a palace, heritage or black-tie venue and want the invitation to match it.',
    guests: 'A clear dress code matters more with this kind of event, alongside the usual timings, venue and map link.',
  },
  interactive: {
    intro: 'This is a gift rather than a notice — something the recipient unlocks and moves through, rather than reads once.',
    guests: 'It is made for one person, not a guest list: the whole point is the moment they open it and work through what you have hidden inside.',
  },
  rakshabandhan: {
    intro: 'Rakhi is one of the hardest days to be in a different city from your sibling, and families are increasingly spread across the country and abroad.',
    guests: 'Whether you are inviting family home or sending the wish itself, it lands as one link that opens instantly on any phone.',
  },
  ganeshchaturthi: {
    intro: 'Ganeshotsav runs for several days rather than one, and the invitation has to hold a sthapana muhurat, daily aarti timings and a visarjan day that is often confirmed late.',
    guests: 'Relatives, neighbours and mandal members come for darshan across different days, so they reopen the same link to check that evening\u2019s aarti time and find the mandap on a map.',
  },
  greeting: {
    intro: 'This is an animated greeting for one person rather than an event invitation \u2014 there is no venue, no guest list and no RSVP.',
    guests: 'It is built to be opened once, properly, on a phone: your photos, your words, and an animation that plays as they scroll.',
  },
}

/** Highlights derived from the template's real field set, so no two lists match. */
function fieldHighlights(template: NonNullable<ReturnType<typeof findTemplateBySlug>>) {
  const keys = new Set(template.config.fields.map((f) => f.key))
  const out: string[] = []
  if (keys.has('mehendiDate') || keys.has('haldiDate') || keys.has('sangeetDate')) out.push('separate Mehendi, Haldi, Sangeet and Reception blocks, each with its own date, time and venue')
  if (keys.has('brideFamily') || keys.has('groomFamily') || keys.has('brideFamilyDetails') || keys.has('groomFamilyDetails') || keys.has('brideParents')) out.push('family name panels for both sides')
  if (keys.has('coupleStory')) out.push('a couple story section')
  if (keys.has('pooja')) out.push('muhurat and pooja timing details')
  if (keys.has('babyGender')) out.push("the baby's name reveal and parents' names")
  if (keys.has('theme')) out.push('a party theme line')
  if (keys.has('age')) out.push('a milestone age display')
  if (keys.has('years')) out.push('a years-together count')
  if (keys.has('pin')) out.push('a secret PIN with a hint, balloon pops, a sliding puzzle, a scratch card and a handwritten letter')
  if (keys.has('reasons')) out.push('personal notes revealed one at a time')
  if (keys.has('whatsappNumber')) out.push('an RSVP button that opens a WhatsApp reply to you')
  if (keys.has('timeline') || keys.has('schedule')) out.push('an event schedule timeline')
  if (keys.has('galleryImages')) out.push('a photo gallery')
  if (keys.has('musicUrl')) out.push('background music')
  if (keys.has('mapsUrl')) out.push('a one-tap Google Maps link')
  if (keys.has('dressCode')) out.push('a dress code line')
  return out
}

/** Designs with an RSVP action (WhatsApp) built into the page. Raksha
 *  Bandhan's RSVP + gift section exists in code but is currently disabled. */

type Feature = { Icon: ComponentType<{ className?: string }>; title: string; copy: string }

/**
 * What this design actually contains, read from its own field set and the
 * template's behaviour — never a generic list. Every event design renders a
 * live countdown; the 3D greetings and the Surprise Journey do not.
 */
function designFeatures(template: NonNullable<ReturnType<typeof findTemplateBySlug>>): Feature[] {
  const keys = new Set(template.config.fields.map((f) => f.key))
  const out: Feature[] = []
  if (is3D(template.id)) out.push({ Icon: SparklesIcon, title: '3D animation', copy: 'An animated experience that plays as they open it.' })
  if (keys.has('pin')) out.push({ Icon: SparklesIcon, title: 'Secret unlock & surprises', copy: 'A PIN with a hint, balloon pops, a puzzle, a scratch card and a letter.' })
  if (!is3D(template.id)) out.push({ Icon: ClockIcon, title: 'Live countdown', copy: 'Days, hours and minutes to the moment.' })
  if (keys.has('mapsUrl')) out.push({ Icon: MapPinIcon, title: 'Venue & Google Maps', copy: 'The address with one-tap directions.' })
  if (keys.has('events')) out.push({ Icon: CalendarIcon, title: 'Every function', copy: 'Each function on its own card — date, time, venue, dress code, map and calendar link.' })
  else if (keys.has('sangeetDate') || keys.has('haldiDate')) out.push({ Icon: CalendarIcon, title: 'Every function', copy: 'Mehendi, Haldi, Sangeet and Reception, each with its own date and venue.' })
  else if (keys.has('mehendiDate')) out.push({ Icon: CalendarIcon, title: 'Haldi and Mehendi', copy: 'Both functions, each with its own time and venue.' })
  else if (keys.has('schedule') || keys.has('timeline')) out.push({ Icon: CalendarIcon, title: 'Event schedule', copy: 'Each moment of the day, in order.' })
  if (keys.has('galleryImages')) out.push({ Icon: CameraIcon, title: 'Photo gallery', copy: 'Your photos, beautifully laid out.' })
  if (keys.has('musicUrl')) out.push({ Icon: MusicIcon, title: 'Background music', copy: 'A song that plays softly for guests.' })
  // Every event design posts to /api/wishes; the 3D greetings and the
  // Surprise Journey are one-to-one gifts with no guest wall.
  if (!is3D(template.id)) out.push({ Icon: HeartIcon, title: 'Guest wishes wall', copy: 'Messages from guests appear live on the invitation.' })
  if (keys.has('whatsappNumber')) out.push({ Icon: PhoneIcon, title: 'RSVP on WhatsApp', copy: 'Guests reply to you with one tap.' })
  if (keys.has('travel') || keys.has('faq')) out.push({ Icon: GlobeIcon, title: 'Travel, stay & FAQs', copy: 'Hotels, airport pickups, who to call and answers to guests’ questions.' })
  if (keys.has('livestreamUrl')) out.push({ Icon: LaptopIcon, title: 'Livestream link', copy: 'Family abroad can watch the ceremony live.' })
  if (keys.has('registryUrl')) out.push({ Icon: ClipboardIcon, title: 'Gift registry', copy: 'A link to your registry, if you have one.' })
  if (keys.has('brideFamily') || keys.has('groomFamily') || keys.has('brideFamilyDetails') || keys.has('groomFamilyDetails') || keys.has('brideParents')) out.push({ Icon: UsersIcon, title: 'Both families', copy: 'Family names for both sides.' })
  if (keys.has('coupleStory') || keys.has('story')) out.push({ Icon: PenIcon, title: 'Your story', copy: 'A section for how it all began.' })
  if (keys.has('reasons')) out.push({ Icon: PenIcon, title: 'Little notes', copy: 'Personal lines that reveal one at a time.' })
  if (keys.has('dressCode')) out.push({ Icon: ShirtIcon, title: 'Dress code', copy: 'So guests know what to wear.' })
  return out
}

export default function TemplateSeoPage({ params }: Props) {
  const template = findTemplateBySlug(params.slug)
  if (!template) notFound()
  const url = absoluteUrl(`/templates/${params.slug}`)
  const categoryHref = `/templates/category/${templateCategorySlug(template.category)}`
  const plan = getRequiredPlan(template.id)
  const price = plan.price
  const name = displayName(template.name)
  const context = CATEGORY_CONTEXT[template.category ?? ''] ?? CATEGORY_CONTEXT.wedding
  const highlights = fieldHighlights(template)
  const features = designFeatures(template)
  const occasionInfo = primaryOccasion(template.id)
  const createHref = `/create?template=${template.id}&src=template_page`

  // Related designs from the same occasion (falls back to the whole catalogue).
  const relatedIds = (occasionInfo?.templateIds ?? []).filter((id) => id !== template.id)
  const related = buildCatalogItems(relatedIds.length ? relatedIds : undefined).filter((i) => i.id !== template.id).slice(0, 4)

  // Route back up to the matching occasion landing page, completing the
  // landing page → template → create loop instead of always pointing at the
  // wedding page regardless of what this template is for.
  const OCCASION_LINK: Record<string, { href: string; label: string }> = {
    wedding: { href: '/wedding-invitation', label: 'Digital wedding invitations' },
    movie: { href: '/wedding-invitation', label: 'Digital wedding invitations' },
    retro: { href: '/wedding-invitation', label: 'Digital wedding invitations' },
    engagement: { href: '/engagement-invitation', label: 'Digital engagement invitations' },
    birthday: { href: '/birthday-invitation', label: 'Digital birthday invitations' },
    housewarming: { href: '/griha-pravesh-invitation', label: 'Griha Pravesh invitations' },
    naming: { href: '/namakaran-invitation', label: 'Namakaran invitations' },
    anniversary: { href: '/anniversary-invitation', label: 'Anniversary invitations' },
    ganeshchaturthi: {
      href: '/blog/ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template',
      label: 'Ganesh Chaturthi invitation guide',
    },
  }
  const occasion = OCCASION_LINK[template.category ?? ''] ?? {
    href: '/whatsapp-invitation-maker',
    label: 'WhatsApp invitation maker',
  }

  // Visible FAQ and FAQPage JSON-LD come from this one list. The price answer
  // used to say the design was "included in the <plan> plan" — plans are not
  // sold; each design has its own one-time price.
  const faqs = [
    {
      question: `How much does the ${template.name} template cost?`,
      answer: `The ${name} design is ₹${price.toLocaleString('en-IN')}, paid once when you publish. There is no subscription. You can build and preview the whole invitation before you pay.`,
    },
    {
      question: `How do I create an invitation with the ${template.name} template?`,
      answer: `Choose "Use this design", fill in your details — names, date, venue, schedule and photos — and preview the invitation as you type. When you're happy, pay once and publish to get your link, ready to share on WhatsApp.`,
    },
    {
      question: 'Do guests need to download an app to view the invitation?',
      answer: 'No app download required. Guests open the invitation link in their phone browser — it works on any Android or iOS device, in any country.',
    },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <JsonLd id="template-product-jsonld" data={productJsonLd(template, url)} />
      <JsonLd id="template-faq-jsonld" data={faqJsonLd} />
      <JsonLd
        id="template-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Templates', url: absoluteUrl('/templates') },
          { name: template.name, url },
        ])}
      />
      <SiteHeader createHref={`/create?template=${template.id}&src=template_header`} createLabel="Use this design" />

      {/* ─── PRODUCT HERO ─── */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_20%,rgba(232,200,102,0.2),transparent_70%)]" />
        <div className="shell relative pb-16 pt-8 sm:pt-10">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Templates', href: '/templates' }, { name }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            {/* The design itself, large, with the live preview one tap away. */}
            <div className="enter-4 relative mx-auto w-full max-w-[30rem]">
              <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gold-soft/15 blur-2xl" />
              <div className="relative rounded-[2rem] bg-paper p-3 shadow-lift">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-peach">
                  <Image
                    src={templateImage(template.id)}
                    alt={`${template.name} digital invitation template preview`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 30rem"
                    className="object-cover"
                  />
                  {is3D(template.id) && (
                    <span className="absolute left-4 top-4 rounded-full bg-emerald px-3 py-1 text-[0.75rem] font-bold text-paper">3D</span>
                  )}
                  {/* Centred by a flex row, not translate-x: the button's hover lift sets its own transform. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                    <PreviewButton
                      templateId={template.id}
                      source="template_page"
                      className="btn-gold pointer-events-auto inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[0.9rem] font-semibold"
                    >
                      <EyeIcon className="h-4 w-4" /> Open live preview
                    </PreviewButton>
                  </div>
                </div>
              </div>
              {/* The demo link is what to send a customer on WhatsApp. */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.88rem]">
                <Link href={`/demo/${template.id}`} className="link">Open the full demo</Link>
                <span aria-hidden className="text-muted">·</span>
                <ShareDesignButton
                  templateId={template.id}
                  name={displayName(template.name)}
                  source="template_page"
                  label="Share this design"
                  className="inline-flex items-center gap-1.5 font-semibold text-emerald-soft hover:underline"
                />
              </div>
            </div>

            <div>
              <p className="enter-0 flex flex-wrap items-center gap-2">
                <Link href={categoryHref} className="pill hover:border-burnished">{occasionInfo?.label ?? template.category}</Link>
                <span className="pill border-transparent bg-peach text-burnished-deep">{styleTag(template.id)}</span>
              </p>
              <h1 className="t-h1 enter-0 mt-5">{template.name} Template</h1>
              <p className="t-lede enter-1 mt-5 max-w-xl">{template.description}</p>

              {/* Price. States the model plainly: one design, one payment. */}
              <div className="enter-2 mt-7 flex items-end gap-3">
                <span className="font-editorial text-[3.6rem] font-semibold leading-none">₹{price.toLocaleString('en-IN')}</span>
                <span className="pb-2 text-[0.95rem] text-muted">one-time · everything in this design included</span>
              </div>

              <div className="enter-2 mt-7 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href={createHref}
                  location="template_page_hero"
                  meta={{ template_id: template.id, template_name: template.name, price, page_type: 'template_detail' }}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
                >
                  Use this design
                  <ArrowRightIcon />
                </TrackedLink>
                <PreviewButton
                  templateId={template.id}
                  source="template_page_secondary"
                  className="btn-outline inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
                >
                  Live preview
                </PreviewButton>
              </div>
              {/* Removes the "what happens after I click?" hesitation. */}
              <p className="mt-4 text-[0.9rem] leading-6 text-charcoal/70">
                Next: add your details and watch the invitation come to life. Payment is only asked for when you publish.
              </p>
              <TrustList className="mt-6" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S IN THIS DESIGN ─── */}
      <Section aria-label="What's in this design">
        <SectionHeading
          eyebrow="What's in this design"
          title={`Everything the ${name} design includes`}
          sub="Taken from the design itself — nothing here is an add-on, and nothing is locked once it's yours."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {features.map(({ Icon, title, copy }) => (
            <li key={title} className="flex items-start gap-4 rounded-3xl border border-line bg-paper p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-soft">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-editorial text-[1.3rem] font-semibold leading-tight">{title}</span>
                <span className="mt-1 block text-[0.9rem] leading-6 text-charcoal/70">{copy}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── ABOUT + OFFER ─── */}
      <Section tone="paper" aria-label="About this design">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div data-reveal>
            <p className="eyebrow">About this design</p>
            <h2 className="t-h2 mt-3">Made for the way this celebration really happens</h2>
            <div className="prose-brand mt-6">
              <p>{template.description} {context.intro}</p>
              <p>{context.guests}</p>
              {highlights.length > 0 && (
                <p>
                  Specific to this design, the {name} template gives you {highlights.slice(0, -1).join(', ')}
                  {highlights.length > 1 ? ' and ' : ''}{highlights[highlights.length - 1]}.
                </p>
              )}
              <p>
                You fill everything in on one form, watch it take shape in a live preview, and publish it to a single
                link that opens on any phone.
              </p>
            </div>
          </div>
          <div data-reveal="scale">
            <OfferCard price={price} designName={name} href={createHref} cta="Use this design" location="template_page_offer" />
          </div>
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title="Three steps to your invitation" />
        <div className="mt-12"><HowItWorks /></div>
      </Section>

      {/* ─── RELATED DESIGNS ─── */}
      {related.length > 0 && (
        <Section aria-label="Related designs">
          {/* Real sibling designs with their prices. Replaces hardcoded links
              that were byte-identical on every template page and gave Google
              nothing to tell these pages apart. */}
          <SectionHeading
            eyebrow="You might also love"
            title={occasionInfo ? `More ${occasionInfo.short.toLowerCase()} designs` : 'More designs to explore'}
            action={{ href: occasion.href, label: occasion.label }}
          />
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4" data-reveal-group>
            {related.map((item) => <TemplateCard key={item.id} item={item} source="template_page_related" />)}
          </div>
          <p className="mt-8 text-center">
            <Link href="/templates" className="link inline-flex items-center gap-1.5">Browse every design <ArrowRightIcon /></Link>
          </p>
        </Section>
      )}

      {/* ─── FAQ ─── */}
      <Section tone="paper" aria-label="Questions about this design">
        <SectionHeading align="center" eyebrow="Questions" title="About this design" />
        <div className="mt-10"><FAQAccordion faqs={faqs} /></div>
      </Section>

      <CtaBand
        eyebrow={`${name} · ₹${price.toLocaleString('en-IN')} one-time`}
        title="Make this design yours"
        sub="Preview before you pay. Pay once when you publish — every feature in the design is included."
        primary={{ href: createHref, label: 'Use this design' }}
        secondary={{ href: `/demo/${template.id}`, label: 'Open the full demo' }}
        location="template_page_closing"
      />
      <SiteFooter />
      <StickyCTA
        pageType="template_detail"
        title={`${name} · ₹${price.toLocaleString('en-IN')}`}
        sub="One-time · everything in this design included"
        href={`/create?template=${template.id}&src=sticky_bar`}
        label="Use this design"
      />
    </main>
  )
}
