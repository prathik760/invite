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
import { ANNIVERSARY_NAMES, ANNIVERSARY_SECTIONS } from '@/content/wording/anniversary'
import { buildCatalogItems } from '@/lib/catalogItems'
import { breadcrumbJsonLd } from '@/lib/seo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
/** Every section opens the Saalgirah design with the copied words in it. */
const TEMPLATE_ID = 'anniversary'
const DESIGN_IDS = ['anniversary', 'greeting-anniversary']

const MESSAGE_COUNT = ANNIVERSARY_SECTIONS.reduce((n, s) => n + s.messages.length, 0)
const TITLE = 'Anniversary Invitation Message for WhatsApp: 80+ Ideas'
const DESCRIPTION =
  "Copy an anniversary invitation message for WhatsApp — 25th silver & 50th golden jubilee, parents' anniversary from children, surprise party, pooja & Hindi."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/anniversary-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/anniversary-invitation-wording`,
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Anniversary invitation messages for WhatsApp' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a simple anniversary invitation message for WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep it to four or five lines with the couple, the milestone, the date and the venue first — for example: "You\'re invited to celebrate [Names]\' [Number]th wedding anniversary! [Date] · [Time] · [Venue]. Your presence would make the day special." Paste a digital invitation link underneath so guests get the venue map and timings in one tap.',
      },
    },
    {
      '@type': 'Question',
      name: "What should I write in my parents' anniversary invitation?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Name your parents first, say how many years they are celebrating, and sign it from the children: "Our parents [Father\'s Name] & [Mother\'s Name] are celebrating [Number] years of marriage! Please join us on [Date] at [Venue] to bless them. — [Children\'s Names]". For elders and relatives, a formal version that begins "[Children\'s Names] request the pleasure of your company…" reads better.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the 25th and 50th wedding anniversaries called?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 25th wedding anniversary is the silver jubilee (रजत जयंती), the 50th is the golden jubilee (स्वर्ण जयंती) and the 60th is the diamond jubilee. Other traditional names include pearl for the 30th and ruby for the 40th — a nice opening line for the invitation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I say "no gifts" politely on an anniversary invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Add one gentle line at the end: "Your presence is the only gift we wish for" or "Your blessings are the only gift we seek." It is clear without sounding like an instruction, and works in both formal and casual invitations.',
      },
    },
    {
      '@type': 'Question',
      name: 'How early should I send an anniversary invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Two to three weeks ahead for a dinner or a party. For a 25th or 50th anniversary with relatives travelling from other cities, send it four to six weeks ahead. Send a reminder the day before — the same invitation link again is enough.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write an anniversary invitation in Hindi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use "शादी की सालगिरह" (or "विवाह की वर्षगांठ" for formal wording) with the couple\'s names, then invite guests with "आप सपरिवार सादर आमंत्रित हैं" and give the date (दिनांक), time (समय) and venue (स्थान). For a 25th anniversary write "रजत जयंती", for a 50th "स्वर्ण जयंती".',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I invite guests to a surprise anniversary party?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send the invitation one-to-one, never in a group the couple is part of. Give guests an arrival time well before the couple arrives, say where to park so cars do not give it away, and end with a clear "please keep it a secret" line.',
      },
    },
  ],
}

const TOC = [
  ...tocFrom(ANNIVERSARY_SECTIONS),
  { id: 'anniversary-names', label: 'Anniversary names by year' },
  { id: 'quotes-captions', label: 'Quotes & captions' },
]

export default function AnniversaryInvitationWordingPage() {
  const DESIGNS = buildCatalogItems(DESIGN_IDS, { keepOrder: true }).slice(0, DESIGN_IDS.length)
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <JsonLd id="anniversary-wording-faq" data={faqSchema} />
      <JsonLd
        id="anniversary-wording-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', url: APP_URL },
          { name: 'Anniversary invitation wording', url: `${APP_URL}/anniversary-invitation-wording` },
        ])}
      />

      <SiteHeader createHref={`/create?template=${TEMPLATE_ID}`} />

      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Anniversary invitation wording' }]}
        eyebrow={`${MESSAGE_COUNT} messages · WhatsApp-ready · Copy in one tap`}
        title={<>Anniversary Invitation Messages &amp;<br />
            <em className="font-medium text-burnished">Wording for WhatsApp</em></>}
        lede={<>{MESSAGE_COUNT} ready-to-copy anniversary invitation messages for WhatsApp — for a 25th silver jubilee or a
            50th golden jubilee, your parents&apos; anniversary from the children, a surprise party, a dinner or a pooja,
            formal card wording, and messages in Hindi.</>}
        actions={<><Link href="#anniversary-designs" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the anniversary designs</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {ANNIVERSARY_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={TEMPLATE_ID} ctaHref="/anniversary-invitation" paper={i % 2 === 1} />

          {i === 0 && (
            <Section id="anniversary-designs" tone="paper" aria-label="Anniversary invitation designs" className="scroll-mt-10">
              <SectionHeading
                eyebrow="Send these words as an invitation"
                title="Anniversary designs"
                sub="Paste your message into either design and guests get the date, the venue map, a countdown, your photos through the years and a place to send their wishes — from one link. Tap a design for a live preview."
                action={{ href: '/anniversary-invitation', label: 'About anniversary invitations' }}
              />
              <div className="mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:gap-5" data-reveal-group>
                {DESIGNS.map((item) => (
                  <TemplateCard key={item.id} item={item} source="anniversary_wording_gallery" />
                ))}
              </div>
            </Section>
          )}

          {section.id === 'parents' && (
            <section className="border-b border-line px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Give them an invitation as special as their story"
                  body="A text message tells guests the date. A digital anniversary invitation shows photos from the wedding day to today, counts down to the celebration, gives the venue on a map, and collects wishes from everyone — from one link shared on WhatsApp."
                  features={[
                    'Photos through the years',
                    'Live countdown to the celebration',
                    'Google Maps tap-to-navigate',
                    'Wishes from family and friends',
                  ]}
                  ctaHref="/anniversary-invitation"
                  ctaText="Start the Anniversary Invite →"
                />
              </div>
            </section>
          )}
        </Fragment>
      ))}

      {/* Anniversary names by year */}
      <section id="anniversary-names" className="scroll-mt-10 border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Wedding Anniversary Names by Year</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Each milestone has a traditional name — open your invitation with it (&ldquo;the Silver Jubilee of…&rdquo;) or use it as the theme for the celebration.
          </p>
          <table className="w-full overflow-hidden rounded-2xl border border-line bg-champagne text-left text-sm shadow-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3 font-semibold text-charcoal">Anniversary</th>
                <th scope="col" className="px-5 py-3 font-semibold text-charcoal">Traditional name</th>
              </tr>
            </thead>
            <tbody>
              {ANNIVERSARY_NAMES.map((r) => (
                <tr key={r.year} className="border-b border-line last:border-0">
                  <td className="px-5 py-2.5 text-charcoal">{r.year}</td>
                  <td className="px-5 py-2.5 text-muted">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quotes, Lines & Captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Anniversary Invitation Quotes, Lines &amp; Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            One-liners to open your invitation, use as a WhatsApp status, or pair with your invitation link.
          </p>
          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Anniversary invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;[Number] years of love, and the story is still being written.&rdquo;</li>
                <li>&ldquo;Still holding hands after all these years — come celebrate with us.&rdquo;</li>
                <li>&ldquo;A love that has stood the test of time deserves a celebration.&rdquo;</li>
                <li>&ldquo;Every year together is a reason to celebrate — this one most of all.&rdquo;</li>
                <li>&ldquo;Two hearts, one journey, [Number] beautiful years.&rdquo;</li>
                <li>&ldquo;Here&apos;s to the love that built our family.&rdquo;</li>
                <li>&ldquo;Happily married for [Number] years — and counting.&rdquo;</li>
                <li>&ldquo;Forever is made of years like these.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp status &amp; Instagram captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>[Number] years down, forever to go 💕</li>
                <li>Silver and still shining ✨ 25 years!</li>
                <li>Golden years, golden hearts 💛 50 years of [Names]</li>
                <li>Mummy &amp; Papa, [Number] years strong ❤️</li>
                <li>Anniversary loading… 🥂 [Date]</li>
                <li>Loved you then, love you still 💑</li>
                <li>Cheers to [Number] years! 🥂 You&apos;re invited 👉 [Invitation Link]</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/anniversary-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital anniversary invitation link</Link>{' '}
              below it — guests get the venue map, a countdown, your photos and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* What to Include */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">What to Include in an Anniversary Invitation</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            Everything a guest needs to say yes and arrive on time — in the order they look for it.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { item: "The couple's names", detail: 'Both names, as the family knows them. When the children host, name the parents first and sign from the children.' },
              { item: 'The milestone', detail: "Say the number — 25th, 50th — or the jubilee's name. It is the reason guests make the effort to come." },
              { item: 'What the celebration is', detail: 'Dinner, lunch at home, a pooja, a party night or a surprise — guests plan their evening around it.' },
              { item: 'Date, time and venue', detail: 'The full address with a Google Maps link. For a pooja followed by a meal, give both times.' },
              { item: 'Who is hosting', detail: '"The children of…", "the [Family Name] family" or the couple themselves — it sets the tone of the whole invitation.' },
              { item: 'Gifts and RSVP', detail: 'A gentle "your presence is the only gift we wish for" if you mean it, and a number to confirm on.' },
            ].map((c) => (
              <div key={c.item} className="rounded-2xl border border-line bg-champagne p-6 shadow-sm">
                <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">✓ {c.item}</h3>
                <p className="text-sm text-muted leading-7">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-line">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Anniversary Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/anniversary-invitation', label: 'Create a digital anniversary invitation' },
              { href: '/templates/saalgirah-anniversary-invitation-template', label: 'Saalgirah anniversary design' },
              { href: '/templates/anniversary-3d-celebration-invitation-template', label: '3D anniversary card' },
              { href: '/blog/silver-anniversary-invitation-ideas', label: 'Silver anniversary invitation ideas' },
              { href: '/blog/golden-anniversary-invitation-wording', label: 'Golden anniversary invitation wording' },
              { href: '/wedding-invitation-wording', label: 'Wedding invitation messages' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Anniversary Invitation Messages — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      <CtaBand
        title={'Ready to Create the Anniversary Invitation?'}
        sub={'Preview before you pay · Pay once to publish · WhatsApp-ready link in minutes'}
        primary={{ href: `/create?template=${TEMPLATE_ID}`, label: 'Start the Anniversary Invite' }}
      />

      <StickyCTA href="/anniversary-invitation" text="Start the Anniversary Invite →" />

      <SiteFooter />
    </main>
  )
}
