import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Wedding Invitation Wording & Messages India | ShareInvite',
  description:
    '30+ ready-to-copy wedding invitation wording samples for Indian families. Formal, casual, WhatsApp, bilingual — copy & share in minutes.',
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
    title: 'Wedding Invitation Wording & Messages India | ShareInvite',
    description: '30+ ready-to-copy wedding invitation wording samples for Indian families. Formal, casual, WhatsApp, bilingual — copy & share in minutes.',
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
        text: 'Always send a digital invitation link, with a short 3–4 line message alongside it. A message alone can\'t show the venue on a map, list the full schedule, or let guests RSVP. A link does all of this and works for both the tech-savvy and older guests. The short message sets the emotional tone; the link carries all practical details.',
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
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            30+ ready-to-copy samples · WhatsApp ready
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Wedding Invitation Wording &amp; Messages for Indian Families
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            30+ ready-to-copy wedding invitation samples — formal, casual, traditional, bilingual, and WhatsApp-ready. Copy, personalise, and share.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Digital Wedding Invite →
            </Link>
            <span className="text-sm text-muted">Free to start · No credit card</span>
          </div>
        </div>
      </section>

      {/* Section 1: Formal Wedding Invitation Wording */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Formal Wedding Invitation Wording (English)</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These formal samples use traditional language expected by elders and community invitations. Replace the bracketed placeholders with your own details.
          </p>
          <div className="space-y-6">

            {/* Sample 1 */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">1. Traditional Joint-Family Formal</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Pan-India</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>With the blessings of the Almighty,</p>
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>along with</p>
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>joyfully request your presence at the wedding of their children</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Full Name] &amp; [Groom&apos;s Full Name]</p>
                <p>on [Day], [Date] at [Time]</p>
                <p>[Venue Name], [Full Address]</p>
                <p>Your blessings and presence will honour this occasion.</p>
              </blockquote>
            </div>

            {/* Sample 2 */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">2. Couple-Hosted Modern Formal</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Modern</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>We are delighted to invite you to celebrate our wedding.</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                <p>[Day], [Date] · [Time]</p>
                <p>[Venue Name]</p>
                <p>[Full Address]</p>
                <p>Your presence would mean the world to us.</p>
                <p>RSVP by [Date]: [Phone / WhatsApp Number]</p>
              </blockquote>
            </div>

            {/* Sample 3 */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">3. Religious Blessing Opening (Formal)</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Hindu</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>॥ श्री गणेशाय नमः ॥</p>
                <p>With the grace of God and the blessings of our ancestors,</p>
                <p>[Father&apos;s Name] S/o [Grandfather&apos;s Name] &amp; Smt. [Mother&apos;s Name]</p>
                <p>request the honour of your presence at the</p>
                <p>auspicious wedding ceremony of their son / daughter</p>
                <p className="font-semibold not-italic text-ink">[Groom&apos;s Name] / [Bride&apos;s Name]</p>
                <p>with</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] / [Groom&apos;s Name]</p>
                <p>D/o [Father&apos;s Name] &amp; Smt. [Mother&apos;s Name]</p>
                <p>Date: [Date] · Muhurat: [Time]</p>
                <p>[Venue Name], [Address]</p>
              </blockquote>
            </div>

            {/* Sample 4 */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">4. South Indian Formal (Muhurtham)</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">South India</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>With the blessings of Sri [Family Deity],</p>
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>cordially invite you to the</p>
                <p className="font-semibold not-italic text-ink">Muhurtham — Wedding Ceremony</p>
                <p>of their daughter / son</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] with [Groom&apos;s Name]</p>
                <p>Muhurtham: [Day], [Date] at [Time]</p>
                <p>Reception: [Date] at [Time]</p>
                <p>[Kalyana Mandapam / Venue Name]</p>
                <p>[Address]</p>
                <p>Kindly grace us with your presence and blessings.</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: WhatsApp Messages */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Simple WhatsApp Wedding Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            WhatsApp messages should be short. 3–6 lines maximum. The full details go in your digital invitation link — these messages just open the conversation and set the tone.
          </p>
          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">1. Short Casual</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">3–4 lines</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>We&apos;re getting married! 🎊</p>
                <p>[Bride&apos;s Name] weds [Groom&apos;s Name]</p>
                <p>[Date] · [Venue]</p>
                <p>Your presence and blessings mean everything to us.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">2. With Digital Invite Link</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Recommended</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>We are overjoyed to share that [Bride&apos;s Name] &amp; [Groom&apos;s Name] are getting married on [Date].</p>
                <p>Click the link below for full venue details, schedule, and Google Maps:</p>
                <p>[Your ShareInvite Link]</p>
                <p>We would be honoured to have you celebrate with us.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">3. With RSVP Request</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">RSVP</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>[Bride&apos;s Name] &amp; [Groom&apos;s Name] are tying the knot on [Date] at [Venue].</p>
                <p>We would love to have you there. Please let us know if you can make it by [RSVP Date].</p>
                <p>Full invitation: [Link]</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">4. Hindi / English Mixed</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Bilingual</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>बड़े हर्ष के साथ सूचित करते हैं कि</p>
                <p>[Bride&apos;s Name] एवं [Groom&apos;s Name] का विवाह</p>
                <p>[Date] को [Venue] में सम्पन्न होगा।</p>
                <p>Kindly view the full invitation here: [Link]</p>
                <p>आपका आशीर्वाद एवं उपस्थिति हमारे लिए अत्यंत महत्वपूर्ण है।</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">5. Friends-Only Informal</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Friends</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>Guys, I&apos;m getting married!! 🥳</p>
                <p>[Date] at [Venue] — it&apos;s going to be a mad time.</p>
                <p>You are all invited. No excuses accepted.</p>
                <p>Full invite here: [Link]</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Different Scenarios */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Wedding Invitation Wording for Different Scenarios</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            Not all weddings follow the standard format. Here are word-ready samples for specific situations.
          </p>
          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg text-ink mb-3">Second Marriage / Intimate Ceremony</h3>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>[Name] and [Name] joyfully invite you to celebrate their wedding.</p>
                <p>This is an intimate ceremony, shared with close family and a few dear friends.</p>
                <p>[Date] · [Time] · [Venue]</p>
                <p>Your warm wishes and presence will make this moment complete.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg text-ink mb-3">Destination Wedding (Travel Note)</h3>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>We are getting married — and it is going to be a celebration you will remember.</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                <p>[Date] at [Destination Hotel / Resort]</p>
                <p>[City, State]</p>
                <p>Travel &amp; stay details are included in our digital invitation. We have arranged group transport from [City] — please RSVP by [Date] so we can plan your arrangements.</p>
                <p>Full details: [Link]</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg text-ink mb-3">Court Marriage / Legal Wedding Reception</h3>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>[Name] and [Name] were married on [Date] in a private ceremony.</p>
                <p>We now invite you to join us for a reception celebration in honour of the occasion.</p>
                <p>[Reception Date] · [Time]</p>
                <p>[Venue Name &amp; Address]</p>
                <p>Dinner will be served. Kindly confirm your attendance by [RSVP Date].</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg text-ink mb-3">Late-Evening Reception Only (Parents&apos; Hosting)</h3>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name] request the pleasure of your company</p>
                <p>at a reception in honour of the marriage of their son / daughter</p>
                <p className="font-semibold not-italic text-ink">[Groom&apos;s Name] with [Bride&apos;s Name]</p>
                <p>on [Day], [Date]</p>
                <p>7:00 PM onwards</p>
                <p>[Venue Name], [Address]</p>
                <p>Kindly RSVP by [Date].</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: What to Include */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">What to Include in a Wedding Invitation</h2>
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
                detail: "A WhatsApp number or RSVP button in your digital invite helps families manage catering, parking, and seating accurately.",
              },
              {
                item: "Personal Family Message",
                detail: "A single heartfelt line — 'your presence would mean the world to us' — makes the invitation feel personal, not printed.",
              },
            ].map((c) => (
              <div key={c.item} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="font-heading text-base text-ink mb-2">✓ {c.item}</h3>
                <p className="text-sm text-muted leading-7">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Common Mistakes */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Common Wedding Invitation Wording Mistakes</h2>
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
              <div key={m.n} className="rounded-2xl border border-border bg-background p-6 shadow-sm flex gap-5">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#7A3E4A]/10 text-accent-strong font-heading text-sm font-bold">{m.n}</div>
                <div>
                  <h3 className="font-heading text-base text-ink mb-1">{m.mistake}</h3>
                  <p className="text-sm text-muted leading-7">{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Wedding Invitation Wording — FAQ</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-heading text-base text-ink mb-2">{faq.name}</h3>
                <p className="text-sm text-muted leading-7">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white border-b border-border px-5 py-12">
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
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Ready to Create Your Digital Wedding Invitation?</h2>
          <p className="text-muted text-sm mb-7">Use any wording sample above. Add your details, photos, and music — and share in 5 minutes.</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Wedding Invite Free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink tracking-wide">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/engagement-invitation" className="hover:text-foreground transition-colors">Engagement</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
