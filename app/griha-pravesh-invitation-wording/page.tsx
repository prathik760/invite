import { Fragment } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'
import WordingToc from '@/components/wording/WordingToc'
import { WordingSection, tocFrom } from '@/components/wording/WordingSection'
import JsonLd from '@/components/seo/JsonLd'
import TemplateCard from '@/components/catalog/TemplateCard'
import { GRIHA_SECTIONS } from '@/content/wording/griha-pravesh'
import { buildCatalogItems } from '@/lib/catalogItems'
import { breadcrumbJsonLd } from '@/lib/seo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

const TEMPLATE_ID = 'griha-pravesh'
const TITLE = 'Griha Pravesh Invitation Message: 100+ Housewarming Ideas'
const DESCRIPTION =
  'Copy a Griha Pravesh invitation message for WhatsApp — housewarming wording in English & Hindi with muhurat time, pooja schedule, quotes & captions.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/griha-pravesh-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Griha Pravesh Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should a Griha Pravesh invitation message say?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Griha Pravesh invitation should include: the muhurat time (most critical), the full new address with a landmark or Google Maps pin, pooja schedule (Ganesh Puja, Grah Shanti, lunch timing), the host family names, parking or building entry instructions if needed, and a personal blessing request from guests. The muhurat time should appear in the first two lines — guests plan their entire day around it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How important is it to include muhurat time in the invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Muhurat time is the single most important detail in a Griha Pravesh invitation. Unlike a party where late arrival is acceptable, guests need to arrive before the muhurat for the auspicious entry ritual. Not mentioning the exact muhurat time — or only writing "auspicious morning" — causes confusion and late arrivals. Always state the muhurat time clearly and separately from the general gathering time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I send a digital Griha Pravesh invitation or printed cards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Digital invitations work extremely well for Griha Pravesh because the new address is often in an unfamiliar area. A digital invite lets you embed a Google Maps link directly, which printed cards cannot do. You can also include the full pooja schedule, parking instructions, and a photo of the new home — all from a single WhatsApp link. Many families send a digital invite to most guests and printed cards only to elderly relatives who prefer it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How formal should a housewarming invitation be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Match it to your guest list and family. A Griha Pravesh is a religious ceremony, so the base tone should be respectful and warm — more formal than a birthday party, less elaborate than a wedding. For family groups a warm, personal tone works; for neighbours and office contacts you know less well, a slightly more formal one. What matters is that guests can tell it is a pooja with a muhurat, not only a party — that decides when they arrive.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I send the Griha Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send the Griha Pravesh invitation 10–14 days before the ceremony. For outstation family and close relatives who need to travel, send 3–4 weeks ahead. Always send a WhatsApp reminder 2 days before with the address and muhurat time. With a digital invitation, the reminder is just re-sharing the same link — no new design needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Griha Pravesh and Vastu Shanti?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Griha Pravesh is the ceremonial first entry into a new home at an auspicious muhurat. Vastu Shanti is the pooja that blesses the home and its directions; Marathi and Gujarati families often use that name for the whole ceremony, and many families perform both on the same day. Use the name your family uses on the invitation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I invite friends and colleagues to a housewarming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep it short and say which part they are invited to — friends and colleagues usually come for the lunch or an evening get-together rather than the morning pooja. Give that time, the address with a map link, and a line like "would love to see you there"; for colleagues, the office WhatsApp group or a short email both work.',
      },
    },
  ],
}


/** The pooja-led sections open the Pooja design; everything else the Griha Pravesh one. */
const SECTION_TEMPLATES: Record<string, string> = {
  'satyanarayan-pooja': 'pooja-invite',
  'office-shop': 'pooja-invite',
}
const DESIGN_IDS = ['griha-pravesh', 'pooja-invite']
const MESSAGE_COUNT = GRIHA_SECTIONS.reduce((n, s) => n + s.messages.length, 0)

const TOC = [...tocFrom(GRIHA_SECTIONS), { id: 'quotes-captions', label: 'Quotes & captions' }]

export default function GrihaPraveshInvitationWordingPage() {
  const DESIGNS = buildCatalogItems(DESIGN_IDS, { keepOrder: true }).slice(0, DESIGN_IDS.length)
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <JsonLd id="griha-wording-faq" data={faqSchema} />
      <JsonLd
        id="griha-wording-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', url: APP_URL },
          { name: 'Griha Pravesh invitation wording', url: `${APP_URL}/griha-pravesh-invitation-wording` },
        ])}
      />

      <SiteHeader createHref={`/create?template=${TEMPLATE_ID}`} />
      <StickyCTA href="/create?template=griha-pravesh" text="Start My Griha Pravesh Invite →" />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Griha Pravesh invitation wording' }]} eyebrow={`${MESSAGE_COUNT} messages · Muhurat-ready · Copy in one tap`}
        title={<>Griha Pravesh &amp; Housewarming<br />
            <em className="font-medium text-burnished">Invitation Messages for WhatsApp</em></>}
        lede={<>{MESSAGE_COUNT} ready-to-copy Griha Pravesh &amp; housewarming invitation messages for WhatsApp — formal, short,
            modern and Hindi samples, Gruhapravesham and Vastu Shanti wording, messages for friends and colleagues, a new
            office or shop, plus 70+ quotes, lines and new-home captions.</>}
        actions={<><Link href="#griha-designs" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the Griha Pravesh designs</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {GRIHA_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={SECTION_TEMPLATES[section.id] ?? TEMPLATE_ID} ctaHref="/griha-pravesh-invitation" paper={i % 2 === 1} />

          {i === 0 && (
            <Section id="griha-designs" tone="paper" aria-label="Griha Pravesh invitation designs" className="scroll-mt-10">
              <SectionHeading
                eyebrow="Send these words as an invitation"
                title="Griha Pravesh designs"
                sub="Paste your message into a design and guests get the muhurat, the pooja schedule, a Google Maps pin to the new address and a place to send their blessings — from one link. Tap a design for a live preview."
                action={{ href: '/griha-pravesh-invitation', label: 'About Griha Pravesh invitations' }}
              />
              <div className="mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:gap-5" data-reveal-group>
                {DESIGNS.map((item) => (
                  <TemplateCard key={item.id} item={item} source="griha_wording_gallery" />
                ))}
              </div>
            </Section>
          )}

          {section.id === 'whatsapp' && (
            <div className="px-5">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Those [Digital Invite Link] placeholders? Replace them with a real link guests can tap."
                  body="Each message above uses [Digital Invite Link] — a shareable page that already has your muhurat time, Google Maps, and pooja schedule. Build it in a few minutes and preview it before you pay."
                  features={['Muhurat time clearly highlighted', 'Embedded Google Maps pin', 'Full pooja schedule', 'WhatsApp-ready link']}
                  ctaHref="/create?template=griha-pravesh"
                  ctaText="Start My Griha Pravesh Invite →"
                />
              </div>
            </div>
          )}
        </Fragment>
      ))}

      {/* Section: Quotes, Lines & Captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Griha Pravesh Quotes, Lines &amp; New-Home Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners for your invitation opener, WhatsApp status, or Instagram — perfect for announcing a new home.
          </p>

          <div className="rounded-2xl border border-line bg-champagne p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Housewarming quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;A house is made of walls; a home is made of love and blessings.&rdquo;</li>
                <li>&ldquo;New address, same open door — come celebrate with us.&rdquo;</li>
                <li>&ldquo;May every corner of this home be filled with joy.&rdquo;</li>
                <li>&ldquo;Bless our new beginning with your presence.&rdquo;</li>
                <li>&ldquo;Home is where our story continues — and you&apos;re part of it.&rdquo;</li>
                <li>&ldquo;Four walls, one family, endless memories to come.&rdquo;</li>
                <li>&ldquo;We built a house; your blessings make it a home.&rdquo;</li>
                <li>&ldquo;May peace, prosperity and laughter live here forever.&rdquo;</li>
                <li>&ldquo;A new nest for our family — come share the warmth.&rdquo;</li>
                <li>&ldquo;May this threshold welcome only happiness.&rdquo;</li>
                <li>&ldquo;New keys, new dreams, same love — please join us.&rdquo;</li>
                <li>&ldquo;Every home needs a blessing; ours needs yours.&rdquo;</li>
                <li>&ldquo;May our doorstep always welcome friends like you.&rdquo;</li>
                <li>&ldquo;Bricks and beams become a home when loved ones visit.&rdquo;</li>
                <li>&ldquo;A prayer at the threshold, a lifetime of happiness within.&rdquo;</li>
                <li>&ldquo;May Lakshmi bless every room and every day.&rdquo;</li>
                <li>&ldquo;New home, new hopes — old friends still welcome.&rdquo;</li>
                <li>&ldquo;Where family gathers, a house becomes a home.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us for our Griha Pravesh — [Date] at [Muhurat Time]! 🏡</li>
                <li>We&apos;ve moved! Come bless our new home on [Date].</li>
                <li>Housewarming at [Address] — your presence is our blessing.</li>
                <li>New home, new beginnings — please join the celebration!</li>
                <li>Muhurat: [Time] · [Date] · [New Address]. Do come!</li>
                <li>Come warm our new home with your love and blessings. 🙏</li>
                <li>Our new address awaits you — [Date] · [Time].</li>
                <li>Bring your blessings; we&apos;ll bring the lunch! [Date]</li>
                <li>A new home is not complete without loved ones in it.</li>
                <li>Step into our new home with us — [Date] · [Muhurat Time].</li>
                <li>Grah Shanti &amp; lunch to follow — please join us!</li>
                <li>Your blessings make our house a home. See you [Date]!</li>
                <li>Padharo! Our new home awaits you on [Date]. 🏡</li>
                <li>New home unlocked 🔑 — come celebrate the milestone!</li>
                <li>Join the pooja, stay for the feast — [Date] · [Time].</li>
                <li>We&apos;d be honoured to host you at our new home.</li>
                <li>First guests, best guests — that&apos;s you! [Date]</li>
                <li>Come bless the walls we&apos;ll make memories in. 🙏</li>
                <li>Our housewarming isn&apos;t complete without you.</li>
                <li>A new doorstep, an open invitation — do come! [Date]</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">New-home captions for WhatsApp &amp; Instagram</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Home sweet (new) home 🏡✨ #GrihaPravesh</li>
                <li>New keys, new memories 🔑 Housewarming on [Date]!</li>
                <li>Officially home owners! 🏡 Come celebrate with us.</li>
                <li>Blessed to move into our new nest 🙏🏡</li>
                <li>We built it, now let&apos;s bless it — join us [Date]!</li>
                <li>New address, unchanged love ❤️ You&apos;re invited!</li>
                <li>Our forever home starts today ✨ #Housewarming</li>
                <li>Padharo — the new place is ready for you! 🏡</li>
                <li>Griha Pravesh done, hearts full 🙏 Swipe for the new home.</li>
                <li>From house to home in one blessing 🏡💛</li>
                <li>New beginnings smell like fresh paint &amp; ghee 🪔🏡</li>
                <li>Come see where the next chapter unfolds ✨ [Date]</li>
                <li>Keys in hand, hearts full 🔑❤️ #NewHome</li>
                <li>Housewarming loading… 🏡 [Date]. You&apos;re invited!</li>
                <li>Made it home 🏡 Come bless the new place!</li>
                <li>Our happy place has a new address ✨ #GrihaPravesh</li>
                <li>Diyas lit, doors open — welcome home! 🪔</li>
                <li>Small home, big love — come fill it with us! 💛</li>
                <li>New nest, same flock — join us [Date]! 🕊️🏡</li>
                <li>Here&apos;s to the address where our dreams live 🏡✨</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Hindi lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>नया घर, नई खुशियाँ — आपके आशीर्वाद के साथ। 🏡</li>
                <li>गृह प्रवेश की हार्दिक शुभकामनाएँ — पधारें! 🙏</li>
                <li>हमारे नए आशियाने में आपका हार्दिक स्वागत है।</li>
                <li>मुहूर्त [Time] · दिनांक [Date] — सादर आमंत्रण।</li>
                <li>आपकी उपस्थिति ही हमारी सबसे बड़ी खुशी है।</li>
                <li>नए घर की नई शुरुआत — साथ मनाएँ! ✨</li>
                <li>गृह प्रवेश मुहूर्त: [Time] · दिनांक: [Date] — पधारें। 🙏</li>
                <li>हमारे नए घर को आपके आशीर्वाद की प्रतीक्षा है। 🏡</li>
                <li>चार दीवारें तब घर बनती हैं जब अपने आते हैं।</li>
                <li>पधारो जी! नया घर आपके स्वागत को तैयार है। 🪔</li>
                <li>आपके आशीर्वाद से हमारा नया घर सजेगा।</li>
                <li>नई दहलीज़, वही प्यार — ज़रूर आइए! ❤️</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Regional lines (Gruhapravesham &amp; Ghar Pravesh)</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us for our Gruhapravesham on [Date] at [Muhurat Time]. 🏡</li>
                <li>Ghar Pravesh at our new home — your blessings awaited! 🙏</li>
                <li>Gruhapravesham pooja &amp; lunch — do grace the occasion.</li>
                <li>Our Ghar Pravesh muhurat is [Time], [Date]. Please come!</li>
                <li>Housewarming (Gruhapravesham) — [New Address, City].</li>
                <li>Seeking your blessings for our Ghar Pravesh. 🪔 [Date]</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/griha-pravesh-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital Griha Pravesh invite link</Link>{' '}
              below it — guests get the muhurat time, pooja schedule, map and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* MidPage CTA 2 */}
      <div className="px-5">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Stop re-typing the address. Send a link guests can tap for directions."
            body="The most common complaint after a Griha Pravesh: guests couldn't find the new address. A digital invite with Google Maps pin solves this — no WhatsApp replies asking 'bhai address bhejna'."
            features={['One tap to Google Maps', 'Pooja schedule with timings', 'Blessings from guests on the page', 'Re-send the same link as a reminder']}
            ctaHref="/create?template=griha-pravesh"
            ctaText="Start My Digital Invite →"
          />
        </div>
      </div>

      {/* Section 3: What Must Be Included */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">What Must Be in a Griha Pravesh Invitation</h2>
          <div className="space-y-5">
            {[
              {
                title: 'Muhurat time — the most critical detail',
                body: 'The muhurat is not just a start time — it is the exact moment the family enters the home for the first time. Guests need to arrive before it begins. Write the muhurat time in the first two lines of your invitation, separate from "general arrival" or "programme begins." Never write "auspicious morning" without the actual time.',
              },
              {
                title: 'Full address + landmark',
                body: 'New colonies and recently completed apartment projects are often in areas guests have never visited. Include the full address, the society/building name, wing and floor number if applicable, and a nearby landmark. A digital invite lets you embed a Google Maps pin — this alone prevents most "I got lost" calls on the day.',
              },
              {
                title: 'Parking instructions',
                body: 'For apartment complex housewarmings, parking is one of the most common friction points. Specify whether there is visitor parking, at which gate, on which level, or whether guests should park on the street. A short note saves a dozen phone calls on ceremony day.',
              },
              {
                title: 'Pooja schedule',
                body: 'Many guests will plan their day around specific parts of the ceremony. A clear schedule — Ganesh Puja at [time] → Ghar Pravesh muhurat at [time] → Grah Shanti at [time] → Lunch at [time] — helps guests decide when to arrive and how long to stay.',
              },
              {
                title: 'Whether lunch is included or just prasad',
                body: 'Guests often assume a housewarming includes lunch, but some ceremonies close with just prasad distribution. State this clearly to avoid awkward situations. If lunch is included, a rough serving time helps guests plan.',
              },
              {
                title: 'Contact number for day-of queries',
                body: 'Especially for new addresses, guests will call with "how do I reach there" questions. Include a contact number — preferably someone who can take calls during the ceremony, like a sibling or close family friend.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-7">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: What to leave out (merged from the retired housewarming-wording blog post) */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">What to Leave Out of a Griha Pravesh Invitation</h2>
          <div className="rounded-2xl border border-line bg-champagne p-8 shadow-sm space-y-4">
            <p className="text-sm text-muted leading-7">
              <strong className="text-charcoal">A gift list.</strong> In most Indian families a wish list on a Griha Pravesh invitation reads as if the gifts matter more than the guests. Leave it out entirely; anyone who wants to bring something will ask.
            </p>
            <p className="text-sm text-muted leading-7">
              <strong className="text-charcoal">Details about the home itself.</strong> How many bedrooms, which builder, what it cost — none of it belongs on the invitation. The occasion is the blessing, not the property.
            </p>
            <p className="text-sm text-muted leading-7">
              <strong className="text-charcoal">Family arrangements.</strong> Who is contributing to the pooja, who is cooking, who is collecting the pandit — keep those conversations in the family chat, not on the invitation everyone receives.
            </p>
            <p className="text-sm text-muted leading-7">
              <strong className="text-charcoal">Photos of half-finished rooms.</strong> If you add a photo to a digital invitation, a clean shot of the front door or the building is better than interiors that are still being set up.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Mistakes */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">Griha Pravesh Invitation Mistakes That Cause Confusion</h2>
          <div className="space-y-4">
            {[
              {
                num: '01',
                title: 'Not mentioning the muhurat time',
                body: 'Writing "auspicious morning" or "morning ceremony" without the actual time leaves guests guessing. Some will arrive two hours early; others will show up after the muhurat has passed. Always state the exact time — and separately note when guests should arrive so the muhurat runs on schedule.',
              },
              {
                num: '02',
                title: 'Sending without a Maps link',
                body: 'New residential areas and apartment projects often have poor map listings. Guests navigating to a new locality for the first time will struggle without a Google Maps pin. A digital invite with an embedded map pin eliminates this problem entirely.',
              },
              {
                num: '03',
                title: 'No parking guidance for apartment complexes',
                body: 'Apartment societies have limited visitor parking. Without guidance, guests circle the compound, block the entrance, or park far away and arrive flustered. A single sentence — "Visitor parking at Gate 2, B2 level" — saves enormous confusion.',
              },
              {
                num: '04',
                title: 'Not stating whether lunch is included',
                body: 'Many housewarmings serve a full lunch after the puja; some serve only prasad. Guests need to know so they can plan. If lunch is included, a rough serving time helps. If only prasad is being distributed, it is better to mention it clearly than to have guests waiting.',
              },
              {
                num: '05',
                title: 'Sending too late',
                body: 'Invitations sent 3–4 days before the ceremony give outstation family no time to travel and even local guests too little time to plan. Send 10–14 days ahead for local guests and 3–4 weeks ahead if family needs to travel. A reminder 2 days before works well for everyone.',
              },
            ].map((item) => (
              <div key={item.num} className="rounded-2xl border border-line bg-paper p-6 shadow-sm flex gap-5">
                <span className="font-editorial font-semibold text-4xl text-accent/40 shrink-0 leading-none">{item.num}</span>
                <div>
                  <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-7">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Griha Pravesh Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/griha-pravesh-invitation" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Create a digital Griha Pravesh invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Browse digital invitation templates →
            </Link>
            <Link href="/blog/how-to-make-a-digital-griha-pravesh-invitation" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              How to make a digital Griha Pravesh invitation →
            </Link>
            <Link href="/blog/housewarming-pooja-schedule-invitation-guide" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Housewarming pooja schedule guide →
            </Link>
            <Link href="/create?template=griha-pravesh" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Start with the Griha Pravesh design →
            </Link>
            <Link href="/diwali-invitation-wording" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Diwali party invitation messages →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Griha Pravesh Invitation Wording — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      {/* CTA */}
      <CtaBand
        title={'Create Your Griha Pravesh Invitation'}
        sub={'Preview before you pay · Muhurat time, map & pooja schedule · WhatsApp-ready in minutes'}
        primary={{ href: '/create?template=griha-pravesh', label: 'Start My Griha Pravesh Invite' }}
      />

      <SiteFooter />
    </main>
  )
}
