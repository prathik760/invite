import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import MidPageCTA from '@/components/wording/MidPageCTA'
import WordingSample from '@/components/wording/WordingSample'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: '30+ Wedding Invitation Messages for WhatsApp | Copy-Paste' },
  description:
    '30+ wedding invitation messages & wording for WhatsApp — copy & paste free. Formal, casual, traditional and bilingual samples, plus quotes & lines in English & Hindi.',
  keywords: [
    'wedding invitation wording',
    'wedding invitation message',
    'wedding invitation wording in English',
    'WhatsApp wedding invitation message',
    'Indian wedding invitation message',
    'wedding invitation text',
    'wedding card wording India',
    'wedding invitation sample text',
  ],
  alternates: { canonical: `${APP_URL}/wedding-invitation-wording` },
  openGraph: {
    title: '30+ Wedding Invitation Messages for WhatsApp (Copy & Paste)',
    description: 'Copy & paste wedding invitation messages & wording for WhatsApp — formal, casual, traditional and bilingual samples, plus quotes & lines. Free.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Wedding Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best wording for a WhatsApp wedding invitation message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep WhatsApp messages short — 4 to 6 lines at most. Include the couple\'s names, the date, and a link to the full digital invitation for venue details, maps, and schedule. Something like: "We\'re getting married! [Bride] weds [Groom] on [Date] at [Venue]. View all details here: [Link]. We would love your blessings and presence." Long text walls get scrolled past; a link invites curiosity.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should wedding invitations be formal or informal in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the guest list and family tradition. For elders and community-wide invites, formal wording with family names is expected. For friends, colleagues, and younger relatives, a warm and casual tone feels more genuine. Many families use two versions — a formal message for elders and a short WhatsApp-friendly message for the friends\' circle. ShareInvite\'s digital invitation handles both: the link works for everyone.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write a wedding invitation in English and Hindi both?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A simple bilingual approach: write the first paragraph in Hindi with the auspicious blessing, and the second paragraph in English with the event details. For example: "श्री गणेशाय नमः — With the blessings of God, [Family Name] cordially invites you to celebrate the wedding of [Bride] and [Groom]." Most digital invitation platforms, including ShareInvite, display bilingual content cleanly when structured this way.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I send the invitation message or a digital invitation link on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Always send a digital invitation link, with a short 3–4 line message alongside it. A message alone can\'t show the venue on a map, list the full schedule, or collect blessings from guests. A link does all of this and works for both the tech-savvy and older guests. The short message sets the emotional tone; the link carries all practical details.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I send the wedding invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send digital wedding invitations 3 to 4 weeks before the wedding. For outstation guests or destination weddings, send 6 to 8 weeks in advance so they can plan travel and accommodation. A follow-up reminder message 2–3 days before the event is also standard practice in Indian families.',
      },
    },
  ],
}

export default function WeddingInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader createHref="/create?template=elegant-wedding" />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Wedding invitation wording' }]} eyebrow="30+ ready-to-copy samples · WhatsApp ready"
        title={<>Wedding Invitation Wording &amp; Messages for Indian Families</>}
        lede={<>30+ ready-to-copy wedding invitation samples — formal, casual, traditional, bilingual, and WhatsApp-ready. Copy, personalise, and share.</>}
        actions={<><Link href="/create?template=elegant-wedding" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Create Digital Wedding Invite</Link></>}
        footnote={<TrustList />}
      />

      {/* Section 1: Formal Wedding Invitation Wording */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Formal Wedding Invitation Wording (English)</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These formal samples use traditional language expected by elders and community invitations. Replace the bracketed placeholders with your own details.
          </p>
          <div className="space-y-6">

            {/* Sample 1 */}
            <WordingSample title={<>1. Traditional Joint-Family Formal</>} tag="Pan-India">
                  <p>With the blessings of the Almighty,</p>
                  <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                  <p>along with</p>
                  <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                  <p>joyfully request your presence at the wedding of their children</p>
                  <p className="font-semibold text-charcoal">[Bride&apos;s Full Name] &amp; [Groom&apos;s Full Name]</p>
                  <p>on [Day], [Date] at [Time]</p>
                  <p>[Venue Name], [Full Address]</p>
                  <p>Your blessings and presence will honour this occasion.</p>
              
            </WordingSample>

            {/* Sample 2 */}
            <WordingSample title={<>2. Couple-Hosted Modern Formal</>} tag="Modern">
                  <p>We are delighted to invite you to celebrate our wedding.</p>
                  <p className="font-semibold text-charcoal">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                  <p>[Day], [Date] · [Time]</p>
                  <p>[Venue Name]</p>
                  <p>[Full Address]</p>
                  <p>Your presence would mean the world to us.</p>
                  <p>RSVP by [Date]: [Phone / WhatsApp Number]</p>
              
            </WordingSample>

            {/* Sample 3 */}
            <WordingSample title={<>3. Religious Blessing Opening (Formal)</>} tag="Hindu">
                  <p>॥ श्री गणेशाय नमः ॥</p>
                  <p>With the grace of God and the blessings of our ancestors,</p>
                  <p>[Father&apos;s Name] S/o [Grandfather&apos;s Name] &amp; Smt. [Mother&apos;s Name]</p>
                  <p>request the honour of your presence at the</p>
                  <p>auspicious wedding ceremony of their son / daughter</p>
                  <p className="font-semibold text-charcoal">[Groom&apos;s Name] / [Bride&apos;s Name]</p>
                  <p>with</p>
                  <p className="font-semibold text-charcoal">[Bride&apos;s Name] / [Groom&apos;s Name]</p>
                  <p>D/o [Father&apos;s Name] &amp; Smt. [Mother&apos;s Name]</p>
                  <p>Date: [Date] · Muhurat: [Time]</p>
                  <p>[Venue Name], [Address]</p>
              
            </WordingSample>

            {/* Sample 4 */}
            <WordingSample title={<>4. South Indian Formal (Muhurtham)</>} tag="South India">
                  <p>With the blessings of Sri [Family Deity],</p>
                  <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                  <p>cordially invite you to the</p>
                  <p className="font-semibold text-charcoal">Muhurtham — Wedding Ceremony</p>
                  <p>of their daughter / son</p>
                  <p className="font-semibold text-charcoal">[Bride&apos;s Name] with [Groom&apos;s Name]</p>
                  <p>Muhurtham: [Day], [Date] at [Time]</p>
                  <p>Reception: [Date] at [Time]</p>
                  <p>[Kalyana Mandapam / Venue Name]</p>
                  <p>[Address]</p>
                  <p>Kindly grace us with your presence and blessings.</p>
              
            </WordingSample>

          </div>
        </div>
      </section>

      {/* Mid-page CTA 1 */}
      <section className="px-5 py-2 border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Your wedding invitation sets the tone for the big day"
            body="A plain text message tells guests the date. A digital wedding invite shows them the venue on a map, counts down to the wedding, and lets them leave their blessings — all from one link shared on WhatsApp."
            features={[
              'Live wedding countdown',
              'Full photo gallery & couple story',
              'Google Maps tap-to-navigate',
              'Guest wishes on the invitation',
            ]}
            ctaHref="/wedding-invitation"
            ctaText="Start My Wedding Invite →"
          />
        </div>
      </section>

      {/* Section 2: WhatsApp Messages */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Simple WhatsApp Wedding Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            WhatsApp messages should be short. 3–6 lines maximum. The full details go in your digital invitation link — these messages just open the conversation and set the tone.
          </p>
          <div className="space-y-6">

            <WordingSample title={<>1. Short Casual</>} tag="3–4 lines">
                  <p>We&apos;re getting married! 🎊</p>
                  <p>[Bride&apos;s Name] weds [Groom&apos;s Name]</p>
                  <p>[Date] · [Venue]</p>
                  <p>Your presence and blessings mean everything to us.</p>
              
            </WordingSample>

            <WordingSample title={<>2. With Digital Invite Link</>} tag="Recommended">
                  <p>We are overjoyed to share that [Bride&apos;s Name] &amp; [Groom&apos;s Name] are getting married on [Date].</p>
                  <p>Click the link below for full venue details, schedule, and Google Maps:</p>
                  <p>[Your ShareInvite Link]</p>
                  <p>We would be honoured to have you celebrate with us.</p>
              
            </WordingSample>

            <WordingSample title={<>3. With RSVP Request</>} tag="RSVP">
                  <p>[Bride&apos;s Name] &amp; [Groom&apos;s Name] are tying the knot on [Date] at [Venue].</p>
                  <p>We would love to have you there. Please let us know if you can make it by [RSVP Date].</p>
                  <p>Full invitation: [Link]</p>
              
            </WordingSample>

            <WordingSample title={<>4. Hindi / English Mixed</>} tag="Bilingual">
                  <p>बड़े हर्ष के साथ सूचित करते हैं कि</p>
                  <p>[Bride&apos;s Name] एवं [Groom&apos;s Name] का विवाह</p>
                  <p>[Date] को [Venue] में सम्पन्न होगा।</p>
                  <p>Kindly view the full invitation here: [Link]</p>
                  <p>आपका आशीर्वाद एवं उपस्थिति हमारे लिए अत्यंत महत्वपूर्ण है।</p>
              
            </WordingSample>

            <WordingSample title={<>5. Friends-Only Informal</>} tag="Friends">
                  <p>Guys, I&apos;m getting married!! 🥳</p>
                  <p>[Date] at [Venue] — it&apos;s going to be a mad time.</p>
                  <p>You are all invited. No excuses accepted.</p>
                  <p>Full invite here: [Link]</p>
              
            </WordingSample>

          </div>
        </div>
      </section>

      {/* Mid-page CTA 2 */}
      <section className="px-5 py-2 border-b border-line">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="One link. Ceremonies, maps, schedule and wishes — all in one place."
            body="Share the same digital invite link across every WhatsApp group. Outstation family sees the hotel address; local guests see the venue map. One update reaches everyone instantly."
            features={[
              'Shaadi, mehendi & reception schedule',
              'Venue address with Google Maps',
              'Background music & love story',
              'Free to build & preview',
            ]}
            ctaHref="/wedding-invitation"
            ctaText="Get Your Wedding Invite Link →"
          />
        </div>
      </section>

      {/* Section 3: Different Scenarios */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Wedding Invitation Wording for Different Scenarios</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            Not all weddings follow the standard format. Here are word-ready samples for specific situations.
          </p>
          <div className="space-y-6">

            <WordingSample title={<>Second Marriage / Intimate Ceremony</>}>
                  <p>[Name] and [Name] joyfully invite you to celebrate their wedding.</p>
                  <p>This is an intimate ceremony, shared with close family and a few dear friends.</p>
                  <p>[Date] · [Time] · [Venue]</p>
                  <p>Your warm wishes and presence will make this moment complete.</p>
              
            </WordingSample>

            <WordingSample title={<>Destination Wedding (Travel Note)</>}>
                  <p>We are getting married — and it is going to be a celebration you will remember.</p>
                  <p className="font-semibold text-charcoal">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                  <p>[Date] at [Destination Hotel / Resort]</p>
                  <p>[City, State]</p>
                  <p>Travel &amp; stay details are included in our digital invitation. We have arranged group transport from [City] — please RSVP by [Date] so we can plan your arrangements.</p>
                  <p>Full details: [Link]</p>
              
            </WordingSample>

            <WordingSample title={<>Court Marriage / Legal Wedding Reception</>}>
                  <p>[Name] and [Name] were married on [Date] in a private ceremony.</p>
                  <p>We now invite you to join us for a reception celebration in honour of the occasion.</p>
                  <p>[Reception Date] · [Time]</p>
                  <p>[Venue Name &amp; Address]</p>
                  <p>Dinner will be served. Kindly confirm your attendance by [RSVP Date].</p>
              
            </WordingSample>

            <WordingSample title={<>Late-Evening Reception Only (Parents&apos; Hosting)</>}>
                  <p>[Father&apos;s Name] &amp; [Mother&apos;s Name] request the pleasure of your company</p>
                  <p>at a reception in honour of the marriage of their son / daughter</p>
                  <p className="font-semibold text-charcoal">[Groom&apos;s Name] with [Bride&apos;s Name]</p>
                  <p>on [Day], [Date]</p>
                  <p>7:00 PM onwards</p>
                  <p>[Venue Name], [Address]</p>
                  <p>Kindly RSVP by [Date].</p>
              
            </WordingSample>

          </div>
        </div>
      </section>

      {/* Section 4: What to Include */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">What to Include in a Wedding Invitation</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            A complete Indian wedding invitation should cover every detail a guest needs — before they even have to ask. Here is each element explained.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                item: "Couple's Full Names",
                detail: "Both names in full — as they appear on the wedding card. In traditional invitations, family members' names precede the couple.",
              },
              {
                item: "Event Date and Muhurat Time",
                detail: "The exact date and the auspicious muhurat time set by the pandit. 'Evening' is not a substitute — guests plan travel around the muhurat.",
              },
              {
                item: "Venue Name, Full Address, Google Maps Link",
                detail: "Venue name alone is not enough. Include the street, landmark, city, and pin code. A one-tap Google Maps link in your digital invite removes all confusion.",
              },
              {
                item: "Ceremony Schedule",
                detail: "List each event: Baraat arrival time, Varmala, Pheras, Reception. Guests with children or outstation travel need the full schedule to plan.",
              },
              {
                item: "Dress Code",
                detail: "Mention if there is a theme (pastels, sarees only, etc.) or if formals / ethnic wear are expected. Guests appreciate the guidance.",
              },
              {
                item: "RSVP Instructions",
                detail: "A WhatsApp number to confirm on, stated clearly in your invitation, helps families manage catering, parking, and seating accurately.",
              },
              {
                item: "Personal Family Message",
                detail: "A single heartfelt line — 'your presence would mean the world to us' — makes the invitation feel personal, not printed.",
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

      {/* Section 5: Common Mistakes */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="t-h2 mb-3">Common Wedding Invitation Wording Mistakes</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These are real, recurring mistakes in Indian wedding invitations — most can be fixed in 2 minutes.
          </p>
          <div className="space-y-4">
            {[
              {
                n: '1',
                mistake: 'Putting the venue address inside an image',
                fix: 'A venue address buried in a JPEG cannot be copied into Google Maps. Always include the address as searchable text — in your WhatsApp message or in a digital invitation where guests can tap to navigate.',
              },
              {
                n: '2',
                mistake: 'Omitting the muhurat time',
                fix: '"Morning ceremony" or "auspicious time" is not helpful. Share the exact muhurat time so guests from other cities can plan train and flight bookings around it.',
              },
              {
                n: '3',
                mistake: 'Writing the full invitation text in the WhatsApp message',
                fix: 'A 40-line text wall gets scrolled past. Send a 4-line message and let your digital invitation carry the full details. Guests are more likely to read it.',
              },
              {
                n: '4',
                mistake: 'Using overly formal language for a casual celebration',
                fix: 'If your wedding is a small garden party with 50 friends, "cordially request the honour of your presence" sounds out of place. Match the tone to the event.',
              },
              {
                n: '5',
                mistake: 'Not including parking or gate-entry instructions for large venues',
                fix: 'Large wedding venues in metro cities often have confusing entry gates, valet-only parking, or colony road access restrictions. A short note in your digital invitation saves guests 20 minutes of confusion on the day.',
              },
            ].map((m) => (
              <div key={m.n} className="rounded-2xl border border-line bg-champagne p-6 shadow-sm flex gap-5">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#0B4A34]/10 text-accent-strong font-editorial font-semibold text-sm font-bold">{m.n}</div>
                <div>
                  <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1">{m.mistake}</h3>
                  <p className="text-sm text-muted leading-7">{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes, Lines & Captions */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Wedding Invitation Quotes, Lines &amp; Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners to open your wedding invitation, use as a WhatsApp caption, or pair with your digital invite link.
          </p>
          <div className="rounded-2xl border border-line bg-champagne p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Wedding invitation quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;Two souls, one journey — begins with your blessings.&rdquo;</li>
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
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp &amp; Instagram captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Forever starts on [Date] 💍 You&apos;re invited!</li>
                <li>She said yes, now the wedding&apos;s a date! 💛 [Date]</li>
                <li>#Shaadi loading… join us [Date] at [Venue]! 🎉</li>
                <li>From two hearts to one home — come celebrate! 🏡</li>
                <li>Wedding bells are ringing 🔔 Details 👉 [Invite Link]</li>
                <li>Our forever begins — save the date! ✨ [Date]</li>
                <li>Tying the knot &amp; can&apos;t wait to see you there! 💍</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/wedding-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital wedding invite link</Link>{' '}
              below it — guests get the venue map, countdown, schedule and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Wedding Invitation Wording — FAQ'} />
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
              { href: '/wedding-invitation', label: 'Create free digital wedding invitation' },
              { href: '/templates', label: 'Browse wedding invitation templates' },
              { href: '/blog/indian-wedding-invitation-wording-for-whatsapp', label: 'Wedding invitation wording for WhatsApp groups' },
              { href: '/blog/how-to-create-a-whatsapp-wedding-invitation', label: 'How to create a WhatsApp wedding invitation' },
              { href: '/create', label: 'Create your wedding invitation free' },
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
        title={'Ready to Create Your Digital Wedding Invitation?'}
        sub={'Use any wording sample above. Add your details, photos, and music — and share in 5 minutes.'}
        primary={{ href: '/create?template=elegant-wedding', label: 'Start My Wedding Invite' }}
      />

      <StickyCTA href="/wedding-invitation" text="Start My Wedding Invite →" />

      <SiteFooter />
    </main>
  )
}
