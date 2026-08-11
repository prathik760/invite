import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
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
  const priceLabel = plan.price === 0 ? 'Free' : `₹${plan.price}`
  // Price in the title earns the click on commercial queries — "cost"/"price"
  // is the most common qualifier on these searches, and a visible price
  // pre-qualifies the visitor instead of surprising them at step 5.
  const title = `${template.name} Invitation Template — ${priceLabel} | ShareInvite`
  const description =
    template.id === 'royal-deco'
      ? `Royal wedding invitation template — ${priceLabel}, one-time. Add your names, date, venue, Google Maps and photos, then share the link on WhatsApp. No app needed for guests.`
      : `${template.description} ${priceLabel}, one-time — add your details, preview free, and share the invitation link on WhatsApp. No app needed for guests.`
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
  if (keys.has('brideFamily') || keys.has('groomFamily') || keys.has('brideFamilyDetails') || keys.has('groomFamilyDetails')) out.push('family name panels for both sides')
  if (keys.has('coupleStory')) out.push('a couple story section')
  if (keys.has('pooja')) out.push('muhurat and pooja timing details')
  if (keys.has('babyGender')) out.push("the baby's name reveal and parents' names")
  if (keys.has('theme')) out.push('a party theme line')
  if (keys.has('age')) out.push('a milestone age display')
  if (keys.has('years')) out.push('a years-together count')
  if (keys.has('pin')) out.push('a secret PIN with a hint, balloon pops, a sliding puzzle, a scratch card and a handwritten letter')
  if (keys.has('reasons')) out.push('a list of personal notes that reveal as the recipient scrolls')
  if (keys.has('upiId')) out.push('an optional UPI, QR and bank panel for shagun')
  if (keys.has('timeline') || keys.has('schedule')) out.push('an event schedule timeline')
  if (keys.has('galleryImages')) out.push('a photo gallery')
  if (keys.has('musicUrl')) out.push('background music')
  if (keys.has('mapsUrl')) out.push('a one-tap Google Maps link')
  if (keys.has('dressCode')) out.push('a dress code line')
  return out
}

export default function TemplateSeoPage({ params }: Props) {
  const template = findTemplateBySlug(params.slug)
  if (!template) notFound()
  const url = absoluteUrl(`/templates/${params.slug}`)
  const categoryHref = `/templates/category/${templateCategorySlug(template.category)}`
  const fields = template.config.fields.slice(0, 8)
  const plan = getRequiredPlan(template.id)
  const context = CATEGORY_CONTEXT[template.category ?? ''] ?? CATEGORY_CONTEXT.wedding
  const highlights = fieldHighlights(template)
  const siblings = TEMPLATES.filter(
    (t) => t.category === template.category && t.id !== template.id,
  ).slice(0, 3)
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
  }
  const occasion = OCCASION_LINK[template.category ?? ''] ?? {
    href: '/whatsapp-invitation-maker',
    label: 'WhatsApp invitation maker',
  }
  const occasionHref = occasion.href
  const occasionLabel = occasion.label

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does the ${template.name} template cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: plan.price === 0
            ? `The ${template.name} template is completely free. Create your invitation and share it on WhatsApp at no cost.`
            : `The ${template.name} template is included in the ${plan.name} plan at ₹${plan.price}. This is a one-time payment — no subscription. The free Elegant Wedding template is available at ₹0 if you'd like to try first.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I create an invitation with the ${template.name} template?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Go to shareinvite.in/create, select the ${template.name} template, fill in the event details — names, date, venue, schedule, and photos — and your invitation is live in under 5 minutes. Share it directly on WhatsApp.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Do guests need to download an app to view the invitation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No app download required. Guests open the invitation link in their phone browser — it works on any Android or iOS device. The page loads fast even on slower mobile networks.',
        },
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
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
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/"><Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" /></Link>
          <TrackedLink href={`/create?template=${template.id}&src=template_header`} location="template_page_header" meta={{ template_id: template.id, price: plan.price, page_type: 'template_detail' }} className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Use Template</TrackedLink>
        </div>
      </header>
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Link href={categoryHref} className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              {template.category} templates
            </Link>
            <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-6xl">{template.name} Template</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{template.description} Create it as a mobile-first digital invitation page with WhatsApp sharing, venue details, gallery, schedule, and RSVP-ready guest flow.</p>
            {/* Price badge. States the model plainly — the previous "Free
                forever" wording appeared on paid templates' sibling pages and
                set an expectation the checkout then contradicted. */}
            <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-[#D9A441]/40 bg-[#FFFBF5] px-4 py-2">
              <span className="text-sm font-bold text-ink">
                {plan.price === 0 ? 'Free — no payment needed' : `₹${plan.price} one-time`}
              </span>
              <span className="text-xs text-muted">
                {plan.price === 0 ? '· Publish and share at no cost' : '· No subscription · Build & preview free before paying'}
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={`/create?template=${template.id}&src=template_page`}
                location="template_page_hero"
                meta={{ template_id: template.id, template_name: template.name, price: plan.price, page_type: 'template_detail' }}
                className="gold-button rounded-full px-9 py-4 text-center text-base font-semibold"
              >
                {plan.price === 0 ? 'Create with this template — free' : 'Create with this template'}
              </TrackedLink>
              <Link href="/templates" className="rounded-full border border-border bg-white px-9 py-4 text-center text-base font-semibold text-ink">All Templates</Link>
            </div>
            {/* Removes the "what happens after I click?" hesitation. */}
            <p className="mt-4 text-sm leading-6 text-muted">
              Next: pick your details, see a live preview of your invitation, then publish.
              {plan.price > 0 && ' Payment is only asked for at the final publish step.'}
            </p>
          </div>
          {/* The template itself. This page previously showed only a list of
              field names — a visitor could not see the design they were being
              asked to buy anywhere above the fold. */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            <Image
              src={templateImage(template.id)}
              alt={`${template.name} digital invitation template preview`}
              width={800}
              height={600}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="w-full object-cover"
            />
            <div className="border-t border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">You can customise</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {fields.map((field) => (
                  <span key={field.key} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink">
                    {field.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-white px-5 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-normal text-ink">About this template</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-muted">
            <p>{template.description} {context.intro}</p>
            <p>{context.guests}</p>
            {highlights.length > 0 && (
              <p>
                Specific to this design, the {template.name.split('—')[0].trim()} template gives you {highlights.slice(0, -1).join(', ')}
                {highlights.length > 1 ? ' and ' : ''}{highlights[highlights.length - 1]}.
              </p>
            )}
            <p>
              Everything is edited from one form and published to a single link. If a detail changes after you have sent it,
              you update the page and the same link shows the new version — nobody needs a corrected card, and nobody is
              left reading an out-of-date message in a WhatsApp thread.
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Same-category siblings with their real prices. Replaces four
              hardcoded links that were byte-identical on all 23 template pages
              and gave Google nothing to tell these pages apart. */}
          <h2 className="font-display text-2xl font-normal text-ink mb-6">
            {siblings.length > 0 ? `Other ${template.category} templates` : 'Other templates to explore'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {siblings.map((sibling) => (
              <Link
                key={sibling.id}
                href={`/templates/${templateSeoSlug(sibling.id)}`}
                className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-[#D9A441]/60"
              >
                <p className="text-sm font-semibold text-ink">{sibling.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{sibling.description}</p>
                <p className="mt-2 text-xs font-bold text-accent-strong">
                  {getRequiredPlan(sibling.id).price === 0 ? 'Free' : `₹${getRequiredPlan(sibling.id).price}`}
                </p>
              </Link>
            ))}
            <Link href="/templates" className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">Browse all templates →</Link>
            <Link href={occasionHref} className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink hover:text-accent-strong">{occasionLabel} →</Link>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-white px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-normal text-ink mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <p className="font-heading text-base text-ink">{item.name}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
      <StickyCTA pageType="template_detail" />
    </main>
  )
}
