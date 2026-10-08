import { Fragment } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import MidPageCTA from '@/components/wording/MidPageCTA'
import WordingToc from '@/components/wording/WordingToc'
import { WordingSection, tocFrom } from '@/components/wording/WordingSection'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'
import JsonLd from '@/components/seo/JsonLd'
import TemplateCard from '@/components/catalog/TemplateCard'
import { ENGAGEMENT_SECTIONS } from '@/content/wording/engagement'
import { buildCatalogItems } from '@/lib/catalogItems'
import { breadcrumbJsonLd } from '@/lib/seo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

const TEMPLATE_ID = 'indian-engagement'
const TITLE = 'Engagement Invitation Message: 100+ Simple WhatsApp Ideas'
const DESCRIPTION =
  'Copy a simple engagement invitation message for WhatsApp — ring ceremony, Roka, Sagai, for daughter or son, “we cordially invite” wording & captions.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'engagement invitation message',
    'roka invitation wording',
    'sagai invitation message',
    'ring ceremony invitation wording',
    'engagement invitation wording',
    'mangni invitation message',
    'engagement card wording India',
    'ring ceremony invitation text',
  ],
  alternates: { canonical: `${APP_URL}/engagement-invitation-wording` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Engagement Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a simple engagement invitation message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three lines are enough: who is getting engaged, when and where, and a warm request — for example: "We\'re engaged! 💍 Join us to celebrate [Name] & [Name]\'s engagement on [Date] at [Time], [Venue]. Your presence and blessings mean the world to us." Add the parents\' names if the invitation comes from the family, and paste a digital invite link below it for the map and schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Roka and engagement invitation wording?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Roka is an intimate family-only ceremony that marks the formal acceptance of the relationship — before the engagement. The wording for a Roka invitation is short, warm, and informal since it is typically for close relatives only. Engagement / Mangni / Ring Ceremony invitations are broader, often include family names, a ceremony schedule, and may be sent to extended family, friends, and colleagues.',
      },
    },
    {
      '@type': 'Question',
      name: "Who hosts the engagement invitation — bride's or groom's family?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In most North Indian traditions, the engagement is jointly hosted by both families. In South Indian families, the boy's family (for Nishchayam) or the girl's family traditionally sends the invitation. For modern couples hosting their own ring ceremony, the couple's names lead the invitation. There is no fixed rule — follow your family's tradition and make it clear in the wording.",
      },
    },
    {
      '@type': 'Question',
      name: 'Should I send the engagement invitation 1 week or 2 weeks before?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send digital engagement invitations at least 10 to 14 days in advance. For outstation family members who need to book travel, 3 weeks is ideal. Roka invitations are often more spontaneous — a week in advance is fine since the guest list is typically close family only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Hindi wording for an engagement invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Hindi wording works beautifully for Roka and Mangni invitations, especially for close family groups. A common opening is: "बड़े हर्ष के साथ आपको सूचित करते हैं कि हमारे [पुत्र/पुत्री] [Name] की रोका/मंगनी की रस्म..." You can also use bilingual wording — Hindi for the ceremonial parts and English for the venue and schedule details.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the different names for an engagement ceremony in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Roka in Punjabi and many North Indian families, Sagai or Mangni across Rajasthan, Gujarat and North India, Gol Dhana in Gujarati families, Nishchayathartham in Tamil and Telugu families, and Mangni or Nisbat in Muslim families. "Ring ceremony" is understood everywhere. Use the name your own family uses — it is the first thing elders read.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I invite friends and colleagues to my engagement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For friends, a short first-person message is enough: "I\'m getting engaged! [Date] at [Venue] — I\'d love for you to be there," with your invitation link below. For colleagues, keep it polite, give the time and venue, and post it in the office group or send a short email; invite your manager personally.',
      },
    },
  ],
}

/** Designs shown after the first set of messages. */
const DESIGN_IDS = ['indian-engagement', 'save-the-date', 'greeting-propose', 'greeting-promise']
const MESSAGE_COUNT = ENGAGEMENT_SECTIONS.reduce((n, s) => n + s.messages.length, 0)

const TOC = [...tocFrom(ENGAGEMENT_SECTIONS), { id: 'quotes-captions', label: 'Quotes & captions' }]

export default function EngagementInvitationWordingPage() {
  const DESIGNS = buildCatalogItems(DESIGN_IDS, { keepOrder: true }).slice(0, DESIGN_IDS.length)
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <JsonLd id="engagement-wording-faq" data={faqSchema} />
      <JsonLd
        id="engagement-wording-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', url: APP_URL },
          { name: 'Engagement invitation wording', url: `${APP_URL}/engagement-invitation-wording` },
        ])}
      />

      <SiteHeader createHref={`/create?template=${TEMPLATE_ID}`} />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Engagement invitation wording' }]} eyebrow={`${MESSAGE_COUNT} messages · Roka · Sagai · Mangni`}
        title={<>Engagement Invitation Messages &amp;<br />
            <em className="font-medium text-burnished">Wording — Roka, Ring Ceremony</em></>}
        lede={<>{MESSAGE_COUNT} ready-to-copy engagement invitation messages for WhatsApp — simple &amp; short samples, Ring Ceremony,
            Roka, Sagai and Nishchayathartham wording, messages for a son or daughter, your own, a sister&apos;s or brother&apos;s
            engagement, for friends and colleagues, in Hindi, plus quotes &amp; captions.</>}
        actions={<><Link href="#engagement-designs" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the engagement designs</Link></>}
        footnote={<TrustList />}
      />

      <WordingToc items={TOC} />

      {ENGAGEMENT_SECTIONS.map((section, i) => (
        <Fragment key={section.id}>
          <WordingSection section={section} templateId={TEMPLATE_ID} ctaHref="/engagement-invitation" paper={i % 2 === 0} />

          {i === 0 && (
            <Section id="engagement-designs" aria-label="Engagement invitation designs" className="scroll-mt-10">
              <SectionHeading
                eyebrow="Send these words as an invitation"
                title="Engagement designs"
                sub="Paste your message into a design and guests get the ring ceremony time, the venue map, a countdown and a place to send their blessings — from one link. Tap a design for a live preview."
                action={{ href: '/engagement-invitation', label: 'About engagement invitations' }}
              />
              <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4" data-reveal-group>
                {DESIGNS.map((item) => (
                  <TemplateCard key={item.id} item={item} source="engagement_wording_gallery" />
                ))}
              </div>
            </Section>
          )}

          {section.id === 'whatsapp' && (
            <section className="px-5 py-2 border-b border-line">
              <div className="mx-auto max-w-4xl">
                <MidPageCTA
                  headline="Make your engagement announcement as beautiful as the moment"
                  body="A WhatsApp text disappears in the chat. A digital invite link can be reopened any time — guests check the venue map, confirm the ring ceremony time, and leave their blessings without calling you."
                  features={[
                    'Ring ceremony schedule & timeline',
                    'Couple photos & gallery',
                    'Tap-to-open Google Maps',
                    'Guest blessings on the invitation',
                  ]}
                  ctaHref="/engagement-invitation"
                  ctaText="Start My Engagement Invite →"
                />
              </div>
            </section>
          )}
        </Fragment>
      ))}

      {/* Section: Quotes, Lines & Captions */}
      <section id="quotes-captions" className="scroll-mt-10 border-b border-line px-5 py-16 sm:py-20 bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Engagement Quotes, Lines &amp; Instagram Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners for your invitation opener, WhatsApp status, or Instagram — including Roka and &ldquo;rokafied&rdquo; captions to announce the big news.
          </p>

          <div className="rounded-2xl border border-line bg-champagne p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Engagement quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;Two hearts, one promise — the beginning of forever.&rdquo;</li>
                <li>&ldquo;And so the adventure begins — we&apos;re engaged!&rdquo;</li>
                <li>&ldquo;Every love story is beautiful, but ours is my favourite.&rdquo;</li>
                <li>&ldquo;He stole my heart, so I&apos;m taking his last name.&rdquo;</li>
                <li>&ldquo;A ring, a promise, and a lifetime to keep it.&rdquo;</li>
                <li>&ldquo;From this day, a new journey of togetherness begins.&rdquo;</li>
                <li>&ldquo;Found my forever — come celebrate with us.&rdquo;</li>
                <li>&ldquo;Sealed with a ring, blessed by our families.&rdquo;</li>
                <li>&ldquo;The best kind of &lsquo;yes&rsquo; — join our celebration.&rdquo;</li>
                <li>&ldquo;One ring to bind two hearts and two families.&rdquo;</li>
                <li>&ldquo;Our happily-ever-after has an official start date.&rdquo;</li>
                <li>&ldquo;Love brought us here; blessings will keep us going.&rdquo;</li>
                <li>&ldquo;Better together — and now it&apos;s official.&rdquo;</li>
                <li>&ldquo;A promise made, a lifetime to keep it.&rdquo;</li>
                <li>&ldquo;Where there is love, there is a new beginning.&rdquo;</li>
                <li>&ldquo;Two souls, one journey — the ring says it all.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us as [Name] &amp; [Name] say &ldquo;yes&rdquo; to forever! 💍</li>
                <li>You&apos;re invited to our engagement — [Date] at [Venue]!</li>
                <li>Come bless the newly engaged couple on [Date].</li>
                <li>Love is in the air — and there&apos;s a ring involved! [Date]</li>
                <li>Save the date: our ring ceremony, [Date] · [Time].</li>
                <li>Two families, one celebration — please join us!</li>
                <li>The countdown to forever begins — be there! [Date]</li>
                <li>It wouldn&apos;t be complete without you. [Date], [Venue].</li>
                <li>Rings, blessings and lots of love — please join us!</li>
                <li>We&apos;re tying the (pre-wedding) knot — come celebrate!</li>
                <li>Our engagement, your blessings — [Date] · [Venue].</li>
                <li>A little ring, a big celebration — see you there!</li>
                <li>Be part of our first &ldquo;forever&rdquo; step. [Date]</li>
                <li>Mark the date — the rings come out on [Date]!</li>
                <li>Come witness the &ldquo;yes&rdquo; that changes everything.</li>
                <li>From engaged to inseparable — join the celebration!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp status captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Engaged! 💍 [Date] — you&apos;re invited!</li>
                <li>She said yes 💍 Come celebrate on [Date]!</li>
                <li>Officially off the market! Ring ceremony on [Date] 🎉</li>
                <li>Two hearts, one ring, endless love. Join us [Date]!</li>
                <li>Our forever starts here — [Date] · [Venue] 💛</li>
                <li>Ring secured 💍 Details 👉 [Digital Invite Link]</li>
                <li>Better together, now official. See you [Date]!</li>
                <li>Said yes to the ring and the man 💍 [Date]</li>
                <li>Loading… forever. 💛 Ring ceremony [Date]!</li>
                <li>From today, it&apos;s &ldquo;we&rdquo; forever. Join us [Date]!</li>
                <li>Best decision, sealed with a ring 💍 [Venue] · [Date]</li>
                <li>Save the date — our forever begins [Date]! ✨</li>
                <li>Engaged to my favourite person 💍 You&apos;re invited!</li>
                <li>Two families, one big yes — [Date] · [Venue].</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Roka &amp; engagement captions for Instagram</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>#Rokafied ✨ The beginning of forever.</li>
                <li>Rokafied and overjoyed 💍 [Names] · [Date]</li>
                <li>From &ldquo;just talking&rdquo; to &ldquo;forever&rdquo; — Roka done! 💛</li>
                <li>Two families became one today. #Roka #Engaged</li>
                <li>He put a ring on it 💍 #Rokafied</li>
                <li>Sealed with sindoor of blessings — Roka complete ✨</li>
                <li>Ring ceremony vibes 💍 Swipe for the moment we said yes.</li>
                <li>Officially fianc(é/ée)! 💍 #EngagedAF #Rokafied</li>
                <li>Our favourite &ldquo;yes&rdquo; yet. #Engaged [Date]</li>
                <li>Blessed, engaged, and a little bit obsessed 💛</li>
                <li>Rokafied &amp; ready for forever 💍 #Roka #Engaged</li>
                <li>She said yes, the families said yes — it&apos;s a wrap! #Rokafied</li>
                <li>Level: engaged 💍 Loading our happily ever after ✨</li>
                <li>Partners in crime, now partners for life. #Engaged</li>
                <li>Two hearts, one hashtag: #Rokafied 💛</li>
                <li>The ring finally has a home 💍 #Engaged [Date]</li>
                <li>Roka done, hearts full, forever loading… ✨</li>
                <li>From crush to forever — Rokafied! 💍</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Hindi &amp; bilingual lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>बड़े हर्ष के साथ सूचित करते हैं कि [Name] एवं [Name] की सगाई तय हुई है।</li>
                <li>आपकी उपस्थिति एवं आशीर्वाद प्रार्थनीय है। 🙏</li>
                <li>दो दिल, एक वादा — सगाई की शुभकामनाएँ! 💍</li>
                <li>हमारे साथ इस खुशी के पल का हिस्सा बनें — [Date]।</li>
                <li>सगाई की रस्म · [Date] · [Venue] — सादर आमंत्रण।</li>
                <li>Two hearts, one promise — सगाई मुबारक! 💛</li>
                <li>हमारी खुशियों में शामिल होकर हमें आशीर्वाद दें। 🙏</li>
                <li>प्रेम और परिवार के इस बंधन का उत्सव — [Date]।</li>
                <li>[Name] एवं [Name] की अंगूठी की रस्म पर सादर आमंत्रित। 💍</li>
                <li>आपका आना ही हमारे लिए सबसे बड़ा आशीर्वाद है।</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: use any line as your opener, then paste your{' '}
              <Link href="/engagement-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital engagement invite link</Link>{' '}
              below it — guests get the venue map, schedule and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page CTA 2 */}
      <section className="px-5 py-2 border-b border-line">
        <div className="mx-auto max-w-4xl">
          <MidPageCTA
            headline="One link. Every guest. All the details — without the phone calls."
            body="Create a digital engagement invite once. Share the same link across family groups, friend circles, and office colleagues. Everyone sees the updated details; you answer zero repeated questions."
            features={[
              'One link works for all groups',
              'Venue map & schedule in one place',
              'No app install for guests',
              'Preview before you pay',
            ]}
            ctaHref="/engagement-invitation"
            ctaText="Get Your Engagement Invite Link →"
          />
        </div>
      </section>

      {/* Section 4: What to Include */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">What to Include in an Engagement Invitation</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            A complete engagement invitation removes every reason a guest might need to call and ask. Here is what each element does.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                item: "Both Families' Names",
                detail: "Traditional invitations list both the bride's and groom's family names. This establishes the alliance formally and is expected by elders.",
              },
              {
                item: "Couple's Names",
                detail: "State both names clearly. In formal invitations, the bride or groom's name follows the parents' names. In modern invites, the couple's names can lead.",
              },
              {
                item: "Ceremony Name",
                detail: "Specify whether it is a Roka, Mangni, Ring Ceremony, Sagai, or Nishchayam. Different families use different terms — clarity avoids confusion.",
              },
              {
                item: "Date, Time, Venue",
                detail: "The exact time and full venue address with a Google Maps link. For home ceremonies, include the house number and landmark.",
              },
              {
                item: "Schedule (Ritual → Ring Exchange → Meal)",
                detail: "List each event with approximate times so guests know when they need to arrive and how long to stay.",
              },
              {
                item: "Dress Code Guidance",
                detail: "Optional but appreciated. 'Ethnic / Indian wear preferred' or 'festive formals' helps guests dress appropriately.",
              },
              {
                item: "Google Maps Link",
                detail: "Embed a Google Maps link in your digital invitation. Venues in residential areas or community halls are often hard to find without GPS.",
              },
            ].map((c) => (
              <div key={c.item} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">✓ {c.item}</h3>
                <p className="text-sm text-muted leading-7">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Mistakes to Avoid */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Engagement Invitation Mistakes to Avoid</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These are real, common mistakes — easy to fix before you hit send.
          </p>
          <div className="space-y-4">
            {[
              {
                n: '1',
                mistake: 'Using "Engagement" when the family calls it "Roka"',
                fix: "Close relatives may be confused or even mildly offended if the ceremony name doesn't match what they know it as. Ask both families what term they use and reflect that in your invitation.",
              },
              {
                n: '2',
                mistake: 'Omitting the ceremony schedule when multiple rituals are planned',
                fix: 'If you have a Tilak, ring exchange, and lunch all in one event, list each with an approximate time. Guests with small children or return flights plan around this.',
              },
              {
                n: '3',
                mistake: "Not clarifying whether it's women-only or mixed company",
                fix: 'Some communities hold a separate ladies-only Sagai ritual. If the ceremony is women-only or if one segment is, state it clearly. Guests should not arrive to find out on the day.',
              },
              {
                n: '4',
                mistake: 'Sending only a text message without a digital invite link',
                fix: 'A WhatsApp message disappears into the chat history. A digital invitation link can be reopened any time — guests check the venue address and schedule the morning of the event.',
              },
              {
                n: '5',
                mistake: 'Too formal a tone for an intimate family Roka',
                fix: 'A Roka is a small family gathering. A five-paragraph formal invitation feels out of place. Keep Roka invitations warm, short, and personal.',
              },
            ].map((m) => (
              <div key={m.n} className="rounded-2xl border border-line bg-champagne p-6 shadow-sm flex gap-5">
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

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Engagement Invitation Wording — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      {/* Internal Links */}
      <section className="bg-paper border-b border-line px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-6 text-center">Related guides &amp; tools</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/engagement-invitation', label: 'Create a digital engagement invitation' },
              { href: '/templates', label: 'Browse invitation designs' },
              { href: '/blog/roka-ceremony-invitation-ideas-and-wording', label: 'Roka invitation ideas and wording' },
              { href: '/blog/engagement-invitation-wording-for-ring-ceremony', label: 'Ring ceremony invitation wording' },
              { href: '/create?template=indian-engagement', label: 'Start with the Mangni engagement design' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-line bg-champagne px-4 py-3 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title={'Ready to Create Your Digital Engagement Invitation?'}
        sub={'Use any wording sample above. Add photos, venue map, and schedule — share in 5 minutes.'}
        primary={{ href: '/create?template=indian-engagement', label: 'Start My Engagement Invite' }}
      />

      <StickyCTA href="/engagement-invitation" text="Start My Engagement Invite →" />

      <SiteFooter />
    </main>
  )
}
