import { Fragment } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import WordingToc from '@/components/wording/WordingToc'
import { WordingSection, tocFrom } from '@/components/wording/WordingSection'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'
import { DIWALI_SECTIONS } from '@/content/wording/diwali'
import { templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const TEMPLATE_ID = 'diwali-party'
const CREATE_HREF = `/create?template=${TEMPLATE_ID}`
// Update these two each year (and the FAQ answer below that uses them).
const DIWALI_YEAR = 2026
const DIWALI_DATE = 'Sunday, 8 November 2026'

const TITLE = `Diwali Party Invitation Message for WhatsApp — ${DIWALI_YEAR} Ideas`
const DESCRIPTION =
  'Copy a Diwali party invitation message for WhatsApp — for a party at home, Lakshmi Puja, office, society or card party, in English & Hindi.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'diwali party invitation message',
    'diwali invitation message for whatsapp',
    'diwali get together invitation message',
    'diwali pooja invitation message',
    'lakshmi puja invitation message',
    'office diwali party invitation',
    'diwali invitation message in hindi',
  ],
  alternates: { canonical: `${APP_URL}/diwali-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/diwali-invitation-wording`,
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Diwali party invitation messages' }],
  },
}

const FAQS = [
  {
    question: `When is Diwali ${DIWALI_YEAR}?`,
    answer: `Diwali — the night of the Lakshmi Puja — falls on ${DIWALI_DATE}. Because it is a Sunday, many families will hold their Diwali party on the evening itself or on the Saturday before, and plenty of friends' and office parties will happen on the weekend of 31 October–1 November. Check your local panchang or family priest for the exact puja muhurat.`,
  },
  {
    question: 'When should I send a Diwali party invitation?',
    answer: 'Send it 10–14 days ahead. Diwali weekends fill up fast with family visits, so the earlier invitation usually wins. For an office or society celebration, give two to three weeks. Send a short reminder two days before with the same link.',
  },
  {
    question: 'What should a Diwali invitation message include?',
    answer: 'Who is hosting, the date and time, the full address with a landmark, and what kind of evening it is — a puja, a dinner, a card party or all three. If there is a Lakshmi Puja, give the puja time on its own line. Add a dress code if you have one, whether children are welcome, and an RSVP number if you need a headcount for food.',
  },
  {
    question: 'Can I send the same Diwali invitation to all my WhatsApp groups?',
    answer: 'Yes — keep the details identical and change only the opening line: "Dear family" for relatives, something lighter for friends, a more formal line for colleagues. If you paste an invitation link under the message, every group sees the same page with the map and the plan for the evening.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
}

const TOC = [...tocFrom(DIWALI_SECTIONS), { id: 'quotes-captions', label: 'Lines & captions' }]

export default function DiwaliInvitationWordingPage() {
  const price = templatePrice(TEMPLATE_ID)
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader createHref={CREATE_HREF} />

      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Diwali invitation wording' }]}
        eyebrow="45+ messages · English & Hindi · Copy in one tap"
        title={<>Diwali Party Invitation Messages<br />
            <em className="font-medium text-burnished">for WhatsApp</em></>}
        lede={<>Diwali falls on {DIWALI_DATE}. Ready-to-copy Diwali invitation messages for a party at home, the Lakshmi Puja,
            the office, your society and your card-party friends — in English and Hindi.</>}
        actions={<><Link href={CREATE_HREF} className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Start My Diwali Invite</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {DIWALI_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={TEMPLATE_ID} ctaHref={CREATE_HREF} paper={i % 2 === 1} />
          {section.id === 'lakshmi-puja' && (
            <section className="border-b border-line bg-paper px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Send it as an invitation that glows"
                  body="The Diwali Milan design puts your words on a page of lamplight and rangoli, with the evening's plan, the dress code, your photos and a one-tap map — one link for every WhatsApp group."
                  features={['Lamplight & rangoli design', "The evening's plan, hour by hour", 'Tap-to-open Google Maps', 'Guest wishes on the page']}
                  ctaHref={CREATE_HREF}
                  ctaText="Start My Diwali Invite →"
                />
              </div>
            </section>
          )}
        </Fragment>
      ))}

      {/* Lines & captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Diwali Invitation Lines &amp; WhatsApp Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            One-liners to open your invitation, caption a photo of the diyas, or post on WhatsApp status with your invitation link.
          </p>
          <div className="rounded-2xl border border-line bg-champagne p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Light a diya with us this Diwali — [Date], [Time]. 🪔</li>
                <li>Our home is ready for Diwali. All it needs is you.</li>
                <li>Diyas lit, mithai ready, doors open — see you on [Date]!</li>
                <li>Come celebrate the festival of lights with us. ✨</li>
                <li>Diwali is brighter with family — please join us on [Date].</li>
                <li>Puja at [Time], dinner after — do come! 🙏</li>
                <li>One evening, many lamps, all our favourite people. [Date]</li>
                <li>Join us for Lakshmi Puja and a festive dinner on [Date].</li>
                <li>Rangoli, rasmalai and you — that&apos;s our Diwali plan.</li>
                <li>The card table is set. Diwali party on [Date]! 🃏</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp status captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Diwali loading… 🪔 Party at ours on [Date]!</li>
                <li>Diyas: lit. Mithai: ready. Guests: you. ✨</li>
                <li>Festival of lights, festival of us. 💛 [Date]</li>
                <li>Shubh Deepavali! Come light up our home. 🪔</li>
                <li>Rangoli done, now we just need the guests. 😄</li>
                <li>Phuljhadis on the terrace at [Time] — don&apos;t miss it! ✨</li>
                <li>शुभ दीपावली 🪔 आपका इंतज़ार रहेगा!</li>
                <li>दीयों की रोशनी, मिठाई की मिठास — आइए, साथ मनाएँ।</li>
                <li>Invite 👇 tap for the map and the plan.</li>
                <li>Happy Diwali from our home to yours. 🪔</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href={`/templates/${templateSeoSlug(TEMPLATE_ID)}`} className="text-accent-strong underline-offset-2 hover:underline">Diwali invitation link</Link>{' '}
              below it — guests get the address, the map and the plan for the evening in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* What makes it work */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">How to Write a Diwali Invitation People Act On</h2>
          <div className="rounded-2xl border border-line bg-paper p-8 shadow-sm space-y-4">
            <p className="text-sm text-muted leading-7">
              Diwali invitations compete with a dozen others in the same week, so the first line has to do the work: whose party it is, which day, and what time. The festive wishes can come after.
            </p>
            <p className="text-sm text-muted leading-7">
              Say what kind of evening it is. A guest who knows there is a Lakshmi Puja at seven will arrive at a quarter to; a guest who thinks it is a dinner may walk in after the aarti. A card party, a potluck or a puja each set different expectations — name yours.
            </p>
            <p className="text-sm text-muted leading-7">
              Send it early, and send it once. Ten to fourteen days ahead is right for most parties; a reminder two days before, with the same link, catches everyone who meant to reply.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-5 py-14 border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Invitation Messages</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/templates/${templateSeoSlug(TEMPLATE_ID)}`} className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              See the Diwali Milan design →
            </Link>
            <Link href="/griha-pravesh-invitation-wording" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Griha Pravesh invitation messages →
            </Link>
            <Link href="/birthday-invitation-wording" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Birthday invitation messages →
            </Link>
            <Link href="/blog/festival-wishes-card-online-diwali-and-festival-greetings" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Animated Diwali greeting cards →
            </Link>
          </div>
        </div>
      </section>

      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title="Diwali Invitation Messages — FAQ" />
        <div className="mt-10">
          <FAQAccordion faqs={FAQS} />
        </div>
      </Section>

      <CtaBand
        title="Make your Diwali invitation"
        sub={`Preview before you pay · ₹${price.toLocaleString('en-IN')} once to publish · One link for every group`}
        primary={{ href: CREATE_HREF, label: 'Start My Diwali Invite' }}
        location="diwali_wording_closing"
      />

      <StickyCTA href={CREATE_HREF} text="Start My Diwali Invite →" />

      <SiteFooter />
    </main>
  )
}
