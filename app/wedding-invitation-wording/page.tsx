import { Fragment } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import WordingToc from '@/components/wording/WordingToc'
import { WordingSection, tocFrom } from '@/components/wording/WordingSection'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'
import JsonLd from '@/components/seo/JsonLd'
import TemplateCard from '@/components/catalog/TemplateCard'
import { WEDDING_SECTIONS } from '@/content/wording/wedding'
import { buildCatalogItems } from '@/lib/catalogItems'
import { breadcrumbJsonLd } from '@/lib/seo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const TEMPLATE_ID = 'elegant-wedding'

/**
 * The design each section's "Use these words" opens, with the copied message
 * already in it: a Nikah message lands in the Nikah suite, a Muhurtham in
 * Kalyanam, the haldi and sangeet messages in the pre-wedding design.
 */
const SECTION_TEMPLATES: Record<string, string> = {
  simple: 'elegant-wedding',
  'my-wedding': 'cinematic-night',
  son: 'indian-wedding',
  daughter: 'signature-rajwada',
  sister: 'indian-wedding',
  brother: 'royal-deco',
  friends: 'cinematic-night',
  colleagues: 'elegant-wedding',
  formal: 'luxury-wedding',
  hindu: 'signature-rajwada',
  'south-indian': 'signature-kalyanam',
  nikah: 'signature-nikah',
  christian: 'signature-garden',
  hindi: 'indian-wedding',
  reception: 'royal-deco',
  functions: 'haldi-mehendi',
  situations: 'signature-garden',
  reminders: 'elegant-wedding',
  'save-the-date': 'save-the-date',
}

/** Shown after the first set of messages: what those words look like as an invitation. */
const DESIGN_IDS = ['signature-rajwada', 'signature-aquarelle', 'signature-kalyanam', 'signature-nikah', 'luxury-wedding', 'indian-wedding', 'elegant-wedding', 'signature-garden']

const MESSAGE_COUNT = WEDDING_SECTIONS.reduce((n, s) => n + s.messages.length, 0)
const TITLE = 'Wedding Invitation Message for WhatsApp: 100+ Marriage Ideas'
const DESCRIPTION =
  'Copy a wedding or marriage invitation message for WhatsApp — for son, daughter, sister, brother, friends & colleagues, Hindu, Nikah & Christian, in Hindi too.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/wedding-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/wedding-invitation-wording`,
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Wedding invitation messages for WhatsApp' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a simple wedding invitation message for WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep it to four or five lines with the couple, the date and the venue first — for example: "You\'re invited to the wedding of [Bride] & [Groom]! [Date] · [Time] · [Venue]. Your blessings mean the world to us." Then paste your digital invitation link underneath, so the full schedule, the venue map and the timings travel with the message.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I invite someone to my marriage on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send a short personal message — the couple\'s names, the date and the city — and paste your invitation link below it. Address elders by name and ask for their blessings; for friends, one casual line is enough. Send it one-to-one to anyone you would have invited in person, and use groups only for the wider circle.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I write in my sister\'s or brother\'s marriage invitation message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the relationship ("My sister [Name] is getting married"), give the date and the venue, and end with a line about why you want that person there. Say which functions they are invited to — friends and colleagues are often invited to the sangeet or the reception only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should wedding invitations be formal or informal in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the guest list and family tradition. For elders and community-wide invitations, formal wording with the family names is expected. For friends, colleagues and younger relatives, a warm and casual tone feels more genuine. Many families use two versions — a formal message for elders and a short WhatsApp message for friends — with the same invitation link.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write a marriage invitation in Hindi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional Hindi wording opens with "॥ श्री गणेशाय नमः ॥", names the couple with "का शुभ विवाह … के साथ", gives the date (दिनांक) and venue (स्थान), and invites guests with "आप सपरिवार सादर आमंत्रित हैं". The inviting family signs off with "दर्शनाभिलाषी" or "विनीत". For WhatsApp, a shorter version — "शुभ विवाह", the names, the date and the venue — works best.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I invite colleagues to my wedding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep it polite and short, say which function they are invited to (usually the reception), and give the time and the venue with a map link. A message in the office WhatsApp group or a short email both work; invite your manager personally.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I send a message or a digital invitation link on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send both: a short three-or-four-line message and a digital invitation link under it. A message alone cannot show the venue on a map, list every function or collect blessings from guests; the link does all of that and works on any phone. The message sets the tone; the link carries the details.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I send the wedding invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send digital wedding invitations three to four weeks before the wedding. For outstation guests or destination weddings, send a save-the-date six to eight weeks ahead so they can plan travel and stay, then the invitation. A reminder two or three days before the wedding is standard in Indian families.',
      },
    },
  ],
}

const TOC = [...tocFrom(WEDDING_SECTIONS), { id: 'quotes-captions', label: 'Quotes & captions' }]

export default function WeddingInvitationWordingPage() {
  const DESIGNS = buildCatalogItems(DESIGN_IDS, { keepOrder: true }).slice(0, DESIGN_IDS.length)
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <JsonLd id="wedding-wording-faq" data={faqSchema} />
      <JsonLd
        id="wedding-wording-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', url: APP_URL },
          { name: 'Wedding invitation wording', url: `${APP_URL}/wedding-invitation-wording` },
        ])}
      />

      <SiteHeader createHref={`/create?template=${TEMPLATE_ID}`} />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Wedding invitation wording' }]}
        eyebrow={`${MESSAGE_COUNT} messages · WhatsApp-ready · Copy in one tap`}
        title={<>Wedding Invitation Messages &amp;<br />
            <em className="font-medium text-burnished">Marriage Wording for WhatsApp</em></>}
        lede={<>{MESSAGE_COUNT} ready-to-copy wedding invitation messages for WhatsApp — simple and formal samples, wording for
            your son&apos;s, daughter&apos;s, sister&apos;s or brother&apos;s marriage, messages for friends and colleagues, Hindu,
            South Indian, Nikah and Christian wording, and invitations in Hindi.</>}
        actions={<><Link href="#wedding-designs" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the wedding designs</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {WEDDING_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={SECTION_TEMPLATES[section.id] ?? TEMPLATE_ID} ctaHref="/wedding-invitation" paper={i % 2 === 1} />

          {i === 0 && (
            <Section id="wedding-designs" tone="paper" aria-label="Wedding invitation designs" className="scroll-mt-10">
              <SectionHeading
                eyebrow="Send these words as an invitation"
                title="Wedding designs"
                sub="Paste your message into any of these and guests get every function, the venue map, a countdown and a way to send blessings — from one link. Tap a design for a live preview."
                action={{ href: '/templates/category/wedding', label: 'All wedding designs' }}
              />
              <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3" data-reveal-group>
                {DESIGNS.map((item) => (
                  <TemplateCard key={item.id} item={item} source="wedding_wording_gallery" />
                ))}
              </div>
            </Section>
          )}

          {section.id === 'daughter' && (
            <section className="border-b border-line px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Your wedding invitation sets the tone for the big day"
                  body="A plain text message tells guests the date. A digital wedding invitation shows them the venue on a map, counts down to the wedding, and lets them leave their blessings — all from one link shared on WhatsApp."
                  features={[
                    'Live wedding countdown',
                    'Every function, with timings',
                    'Google Maps tap-to-navigate',
                    'Blessings from guests on the invitation',
                  ]}
                  ctaHref="/wedding-invitation"
                  ctaText="Start My Wedding Invite →"
                />
              </div>
            </section>
          )}

          {section.id === 'hindi' && (
            <section className="border-b border-line px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Those [Invitation Link] placeholders? Create yours in minutes."
                  body="Every short message above is written to pair with an invitation link. Share the same link in every WhatsApp group — outstation family sees the travel details, local guests see the venue map, and everyone can send their blessings."
                  features={[
                    'Haldi, mehendi, sangeet & reception schedule',
                    'Venue address with Google Maps',
                    'Background music & your story',
                    'Preview before you pay',
                  ]}
                  ctaHref="/wedding-invitation"
                  ctaText="Get Your Wedding Invite Link →"
                />
              </div>
            </section>
          )}
        </Fragment>
      ))}

      {/* Quotes, Lines & Captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Wedding Invitation Quotes, Lines &amp; Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners to open your wedding invitation, use as a WhatsApp status, or pair with your invitation link.
          </p>
          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Wedding invitation quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;Two souls, one journey — and it begins with your blessings.&rdquo;</li>
                <li>&ldquo;Come witness the start of our happily ever after.&rdquo;</li>
                <li>&ldquo;A love written in the stars, celebrated with you.&rdquo;</li>
                <li>&ldquo;Together forever, and it starts with you by our side.&rdquo;</li>
                <li>&ldquo;With our families&apos; blessings, we begin as one.&rdquo;</li>
                <li>&ldquo;Every love story is beautiful; ours begins on [Date].&rdquo;</li>
                <li>&ldquo;Join us where forever begins.&rdquo;</li>
                <li>&ldquo;Two hearts becoming one — please share the moment.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>[Name] &amp; [Name] are getting married — join us on [Date]! 💍</li>
                <li>You&apos;re invited to our wedding — [Date] at [Venue].</li>
                <li>Save the date: our wedding, [Date] · [City].</li>
                <li>With joy, we invite you to bless our union. [Date]</li>
                <li>Come celebrate love, laughter and forever with us!</li>
                <li>Our big day needs your blessings — [Date] · [Venue].</li>
                <li>Two families unite — please join the celebration!</li>
                <li>The wedding of [Name] &amp; [Name] awaits your presence.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp status &amp; Instagram captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Forever starts on [Date] 💍 You&apos;re invited!</li>
                <li>She said yes, now the wedding&apos;s a date! 💛 [Date]</li>
                <li>#Shaadi loading… join us [Date] at [Venue]! 🎉</li>
                <li>From two hearts to one home — come celebrate! 🏡</li>
                <li>Wedding bells are ringing 🔔 Details 👉 [Invitation Link]</li>
                <li>Our forever begins — save the date! ✨ [Date]</li>
                <li>Tying the knot &amp; can&apos;t wait to see you there! 💍</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/wedding-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital wedding invitation link</Link>{' '}
              below it — guests get the venue map, countdown, schedule and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* What to Include */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">What to Include in a Wedding Invitation</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            A complete Indian wedding invitation answers every question a guest has before they need to ask it.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                item: "Couple's full names",
                detail: "Both names in full, as they appear on the wedding card. In traditional invitations, the families' names come before the couple's.",
              },
              {
                item: 'Date and muhurat time',
                detail: "The exact date and the muhurat set by the pandit. 'Evening' is not enough — outstation guests plan their travel around the muhurat.",
              },
              {
                item: 'Venue, full address and a map link',
                detail: 'The venue name alone is not enough. Give the street, a landmark, the city and the pin code — and a one-tap Google Maps link.',
              },
              {
                item: 'Every function',
                detail: 'List each event — haldi, mehendi, sangeet, baraat, pheras, reception — with its time. Guests with children or travel plans need the full schedule.',
              },
              {
                item: 'Dress code',
                detail: 'Mention a theme (pastels, yellow for haldi, green for mehendi) or whether ethnic wear is expected. Guests appreciate the guidance.',
              },
              {
                item: 'RSVP',
                detail: 'A WhatsApp number to confirm on helps the family plan catering, seating and travel accurately.',
              },
              {
                item: 'A personal line',
                detail: "One heartfelt line — 'your presence would mean the world to us' — makes the invitation feel personal, not printed.",
              },
            ].map((c) => (
              <div key={c.item} className="rounded-2xl border border-line bg-champagne p-6 shadow-sm">
                <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">✓ {c.item}</h3>
                <p className="text-sm text-muted leading-7">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Common Wedding Invitation Wording Mistakes</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            Real, recurring mistakes in Indian wedding invitations — most take two minutes to fix.
          </p>
          <div className="space-y-4">
            {[
              {
                n: '1',
                mistake: 'Putting the venue address only inside an image',
                fix: 'An address in a JPEG cannot be copied into Google Maps. Always include it as text — in your WhatsApp message, or in a digital invitation where guests tap to navigate.',
              },
              {
                n: '2',
                mistake: 'Leaving out the muhurat time',
                fix: '"Morning ceremony" does not help a guest booking a train. Give the exact muhurat so guests from other cities can plan around it.',
              },
              {
                n: '3',
                mistake: 'Sending the whole card as one long WhatsApp message',
                fix: 'A forty-line message gets scrolled past. Send four lines and let your invitation link carry the details — guests are far more likely to read it.',
              },
              {
                n: '4',
                mistake: 'Formal language for a casual celebration',
                fix: 'For a small garden party with fifty friends, "solicit your gracious presence" sounds out of place. Match the tone to the wedding.',
              },
              {
                n: '5',
                mistake: 'No parking or entry note for a large venue',
                fix: 'Big venues often have several gates or valet-only parking. One line about where to enter and park saves guests twenty minutes on the day.',
              },
            ].map((m) => (
              <div key={m.n} className="rounded-2xl border border-line bg-paper p-6 shadow-sm flex gap-5">
                <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-soft/10 text-accent-strong font-editorial text-sm font-bold">{m.n}</div>
                <div>
                  <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1">{m.mistake}</h3>
                  <p className="text-sm text-muted leading-7">{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Wedding Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/wedding-invitation', label: 'Create a digital wedding invitation' },
              { href: '/templates/category/wedding', label: 'Browse wedding invitation designs' },
              { href: '/templates/category/signature', label: 'Signature wedding suites' },
              { href: '/save-the-date', label: 'Save the date card' },
              { href: '/engagement-invitation-wording', label: 'Engagement invitation messages' },
              { href: '/blog/indian-wedding-invitation-wording-for-whatsapp', label: 'Wedding wording for WhatsApp groups' },
              { href: '/blog/how-to-create-a-whatsapp-wedding-invitation', label: 'How to create a WhatsApp wedding invitation' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Wedding Invitation Messages — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      {/* CTA */}
      <CtaBand
        title={'Ready to Create Your Wedding Invitation?'}
        sub={'Preview before you pay · Pay once to publish · WhatsApp-ready link in minutes'}
        primary={{ href: `/create?template=${TEMPLATE_ID}`, label: 'Start My Wedding Invite' }}
      />

      <StickyCTA href="/wedding-invitation" text="Start My Wedding Invite →" />

      <SiteFooter />
    </main>
  )
}
