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
import { BIRTHDAY_SECTIONS } from '@/content/wording/birthday'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const TEMPLATE_ID = 'indian-birthday'
const TITLE = 'Birthday Invitation Message for WhatsApp: 120+ Simple Ideas'
const DESCRIPTION =
  'Copy a simple birthday invitation message for WhatsApp — for son, daughter, 1st, 50th & 60th birthdays, kids, friends, cake cutting, dinner & Hindi.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/birthday-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Birthday Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a simple birthday invitation message for WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep it to three or four lines with the date, time and venue up front — for example: "You\'re invited to [Name]\'s birthday! 🎉 [Date] · [Time] · [Venue]. Please come and make the day special!" If you are sending it one-to-one, add the guest\'s name or one warm line of your own, and paste a digital invite link underneath if you have one.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I write in a birthday invitation message on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A good WhatsApp birthday invitation should include: the celebrant\'s name and age (or milestone), the date and time, the venue address, and a warm personal line. Keep it under 8 lines for WhatsApp — long messages get cut off on preview. End with a line asking guests to confirm attendance or RSVP. For groups, a short 4–5 line message works best; save the details for the digital invite link.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write a birthday invitation message in Hindi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Open with the invitation itself — "[Name] के जन्मदिन पर आप सादर आमंत्रित हैं" — then give दिनांक (date), समय (time) and स्थान (venue) on separate lines, and close with a warm line such as "आपके आने से हमारी खुशी दोगुनी हो जाएगी". For elders, begin with "सादर प्रणाम" and ask for their आशीर्वाद.',
      },
    },
    {
      '@type': 'Question',
      name: 'How early should I send a birthday invitation message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a home birthday party, send invitations 7–10 days before the date. For a venue booking or larger gathering, 14–21 days is better so guests can plan. For a first birthday or milestone birthday (50th, 60th) with outstation family, send at least 3–4 weeks ahead. Always send a WhatsApp reminder 2 days before.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I send the same message to all my groups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can, but a small tweak per group feels more personal. The core details (date, time, venue) stay the same. Adjust the opening line — "Dear family" for family groups, a more casual tone for friends. For a shared digital invite link, the same link works across all groups and everyone sees the same beautiful page.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best birthday invitation format for a first birthday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a first birthday, start with the baby\'s name and the milestone ("Baby [Name] is turning 1!"), include both parents\' names, give date, time and venue clearly, mention the theme if any, and close with a warm invitation for the family\'s blessings. If you have a digital invite link, paste it right after the text — it shows photos and the countdown timer which parents love.',
      },
    },
  ],
}

const TOC = [...tocFrom(BIRTHDAY_SECTIONS), { id: 'quotes-captions', label: 'Quotes & captions' }]

export default function BirthdayInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader createHref={`/create?template=${TEMPLATE_ID}`} />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Birthday invitation wording' }]}
        eyebrow="120+ messages · WhatsApp-ready · Copy in one tap"
        title={<>Birthday Invitation Messages &amp;<br />
            <em className="font-medium text-burnished">Wording for WhatsApp</em></>}
        lede={<>120+ ready-to-copy birthday invitation messages for WhatsApp — simple and short samples, wording for son,
            daughter and kids, first, 50th and 60th birthdays, cake cutting, lunch and dinner, and messages in Hindi.</>}
        actions={<><Link href={`/create?template=${TEMPLATE_ID}`} className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Start My Birthday Invite</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {BIRTHDAY_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={TEMPLATE_ID} ctaHref="/birthday-invitation" paper={i % 2 === 1} />

          {section.id === 'kids' && (
            <section className="border-b border-line px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Your guests deserve more than a WhatsApp text"
                  body="A plain message tells them the date. A digital invite shows them the venue on a map, counts down the days, plays a song, and lets them leave a birthday wish — all from a single link you paste into any group."
                  features={[
                    'Live countdown to the birthday',
                    'Photo gallery & background music',
                    'Tap-to-open Google Maps',
                    'Birthday wishes from guests',
                  ]}
                  ctaHref="/birthday-invitation"
                  ctaText="Start My Birthday Invite →"
                />
              </div>
            </section>
          )}

          {section.id === 'whatsapp-groups' && (
            <section className="border-b border-line bg-paper px-5 py-2">
              <div className="mx-auto max-w-3xl">
                <MidPageCTA
                  headline="Those [Digital Invite Link] placeholders? Create yours in 5 minutes."
                  body="Every short message above is designed to pair with a digital invite link. Paste the link and your guests get the venue on a map, a countdown, photos, and a place to leave wishes — all without installing anything."
                  features={[
                    'One link works on every phone',
                    'Re-send the same link as a reminder',
                    'No app needed for guests',
                    'Preview before you pay',
                  ]}
                  ctaHref="/birthday-invitation"
                  ctaText="Get Your Birthday Invite Link →"
                />
              </div>
            </section>
          )}
        </Fragment>
      ))}

      {/* Quotes, Lines & Captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Birthday Invitation Quotes, Lines &amp; Captions (English)</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners to open your invitation, use as a WhatsApp caption, or pair with your digital invite link. Mix and match with any message above.
          </p>

          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Birthday invitation quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;Grow old with me — but first, come celebrate!&rdquo;</li>
                <li>&ldquo;Another year wiser, and the party&apos;s just getting started.&rdquo;</li>
                <li>&ldquo;Life is a party — and you&apos;re on the guest list.&rdquo;</li>
                <li>&ldquo;Cake, candles and you — that&apos;s all we need.&rdquo;</li>
                <li>&ldquo;Every birthday is a gift; your presence is ours.&rdquo;</li>
                <li>&ldquo;Let&apos;s make a wish and make some memories.&rdquo;</li>
                <li>&ldquo;Older, bolder, and ready to celebrate.&rdquo;</li>
                <li>&ldquo;Good friends, good cake, great memories — join us.&rdquo;</li>
                <li>&ldquo;A candle for every year, a smile for every guest.&rdquo;</li>
                <li>&ldquo;Come for the cake, stay for the memories.&rdquo;</li>
                <li>&ldquo;Birthdays are better with the people we love — so please come.&rdquo;</li>
                <li>&ldquo;Another lap around the sun calls for a celebration.&rdquo;</li>
                <li>&ldquo;Count your age by friends, not years — bring yours along!&rdquo;</li>
                <li>&ldquo;Let&apos;s eat cake and act our shoe size, not our age.&rdquo;</li>
                <li>&ldquo;The more, the merrier — and you&apos;re the &lsquo;more&rsquo; we want.&rdquo;</li>
                <li>&ldquo;Here&apos;s to another year of being fabulous — join the celebration!&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>You&apos;re invited to [Name]&apos;s birthday — [Date] at [Venue]!</li>
                <li>Come celebrate [Name] turning [Age] with us! 🎂</li>
                <li>Join us for cake, laughter and love on [Date].</li>
                <li>It wouldn&apos;t be a party without you — please come!</li>
                <li>Save the date: [Name]&apos;s birthday, [Date] · [Time].</li>
                <li>Let&apos;s celebrate another trip around the sun! ☀️</li>
                <li>Bring your smile — the rest is on us. [Date], [Venue].</li>
                <li>Big day, big fun — [Name]&apos;s birthday, [Date]!</li>
                <li>Please join us to make [Name]&apos;s day unforgettable.</li>
                <li>Your presence is the only present we need. [Date], [Venue].</li>
                <li>We&apos;re celebrating — and we&apos;d love you to be there!</li>
                <li>Mark your calendar: it&apos;s [Name]&apos;s big day!</li>
                <li>Cake, candles and good company — see you on [Date].</li>
                <li>Come one, come all — [Name] is turning [Age]!</li>
                <li>Let&apos;s raise a toast to [Name] on [Date] at [Venue].</li>
                <li>The celebration begins at [Time] — don&apos;t miss it!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Captions for WhatsApp status &amp; social</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Birthday loading… 🎉 [Date]. You&apos;re invited!</li>
                <li>It&apos;s my day and I want you there ❤️ [Date] · [Venue]</li>
                <li>Cake o&apos;clock! 🎂 Come celebrate [Name] on [Date].</li>
                <li>Party mode: ON. 🥳 See you [Date] at [Venue].</li>
                <li>One year cuter — [Child&apos;s Name] turns [Age]! 🎈</li>
                <li>Let&apos;s get this party started — [Date], [Time]!</li>
                <li>Tap the link, save the date, don&apos;t be late. 👇</li>
                <li>New age, same me — come celebrate! 🎂 [Date]</li>
                <li>Warning: birthday in progress. Cake ahead! 🍰 [Venue]</li>
                <li>Officially [Age] — let&apos;s celebrate together! 🥳</li>
                <li>Gather round, friends — it&apos;s party time! [Date]</li>
                <li>Making [Age] look good. Join the fun! ✨</li>
                <li>Best day of the year is here — you&apos;re invited! 🎉</li>
                <li>Come hungry, leave happy. 🎂 [Date] · [Venue]</li>
                <li>Blow out the candles with us! 🕯️ [Date] at [Time]</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">First birthday &amp; milestone lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Our little one is turning ONE — come bless [Baby&apos;s Name]! 🎂</li>
                <li>Baby&apos;s first birthday — your blessings make it complete. [Date]</li>
                <li>[Name] is turning [Age] — a milestone worth celebrating together!</li>
                <li>Half a century of [Parent&apos;s Name] — join the golden celebration! ✨</li>
                <li>60 years young — come honour [Parent&apos;s Name] with us. [Date]</li>
                <li>A big day for a big milestone — please join the celebration!</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: paste any of these as the opening line, then drop your{' '}
              <Link href="/birthday-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital invite link</Link>{' '}
              below it — guests get the venue map, countdown and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes It Work */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">What Makes a Birthday Invitation Message Work</h2>
          <div className="rounded-2xl border border-line bg-champagne p-8 shadow-sm">
            <p className="text-sm text-muted leading-7">
              A birthday invitation message does one job: it tells guests everything they need to show up. The warmth comes from how you say it; the usefulness comes from what you include. The single most common reason guests arrive late or go to the wrong place is that the date, time, and venue were buried in the third or fourth line. Put those three details in the first three lines — always. The rest of the message can carry the emotion.
            </p>
            <p className="text-sm text-muted leading-7 mt-4">
              Tone matters more than most people think. A message for a grandmother&apos;s 60th birthday celebration reads nothing like a message for a 25-year-old&apos;s rooftop party — and guests notice when the tone feels off. Match the message to the person being celebrated and to the kind of gathering it is.
            </p>
            <p className="text-sm text-muted leading-7 mt-4">
              For WhatsApp groups, a text message alone is rarely enough. Links get far higher engagement than plain text because guests can see the venue on a map, view a photo, and check the time without having to scroll back up. A digital invite link at the end of even a short message does more work than a long paragraph of directions. It also means you can send reminders without rewriting anything — just re-share the same link.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-line">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Birthday Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/birthday-invitation" className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Create a digital birthday invitation →
            </Link>
            <Link href="/templates/category/birthday" className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Browse birthday invitation designs →
            </Link>
            <Link href="/blog/birthday-invitation-text-for-whatsapp-groups" className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Birthday invitation text for WhatsApp groups →
            </Link>
            <Link href="/blog/first-birthday-invitation-ideas-for-indian-families" className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              First birthday invitation ideas →
            </Link>
            <Link href="/diwali-invitation-wording" className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-foreground hover:border-burnished/50 transition-colors">
              Diwali party invitation messages →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Birthday Invitation Wording — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      {/* CTA */}
      <CtaBand
        title={'Ready to Create Your Birthday Invitation?'}
        sub={'Preview before you pay · Pay once to publish · WhatsApp-ready link in minutes'}
        primary={{ href: `/create?template=${TEMPLATE_ID}`, label: 'Start My Birthday Invite' }}
      />

      <StickyCTA href="/birthday-invitation" text="Start My Birthday Invite →" />

      <SiteFooter />
    </main>
  )
}
