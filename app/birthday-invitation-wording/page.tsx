import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Birthday Invitation Wording & Messages India | ShareInvite',
  description:
    '25+ birthday invitation messages for WhatsApp — kids first birthday, adult milestones, surprise party. Copy-ready. Free digital invite.',
  alternates: { canonical: `${APP_URL}/birthday-invitation-wording` },
  openGraph: {
    title: 'Birthday Invitation Wording & Messages India | ShareInvite',
    description: '25+ birthday invitation messages for WhatsApp — first birthday, milestone birthdays, surprise parties. Copy-ready.',
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
      name: 'What should I write in a birthday invitation message on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A good WhatsApp birthday invitation should include: the celebrant\'s name and age (or milestone), the date and time, the venue address, and a warm personal line. Keep it under 8 lines for WhatsApp — long messages get cut off on preview. End with a line asking guests to confirm attendance or RSVP. For groups, a short 4–5 line message works best; save the details for the digital invite link.',
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

function WordingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-[#FFFBF5] p-5 my-4 relative">
      <span className="absolute top-3 right-3 rounded-full bg-[#D9A441]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7A5C1E]">
        Copy
      </span>
      <p className="text-sm text-foreground leading-7 pr-16">{children}</p>
    </div>
  )
}

export default function BirthdayInvitationWordingPage() {
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,0,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            25+ messages · WhatsApp-ready · Copy & share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Birthday Invitation Wording &amp;<br />
            <span className="gradient-accent italic">Messages for Every Age</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            25+ ready-to-copy birthday invitation messages for WhatsApp — first birthday, milestone birthdays, surprise parties, and more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Birthday Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · WhatsApp-ready link</span>
          </div>
        </div>
      </section>

      {/* Section 1: First Birthday */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">First Birthday Invitation Messages</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            The first birthday is one of the most celebrated milestones for Indian families. These messages cover every context — from a traditional family celebration to a themed party.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Traditional Indian — with family blessings</h3>
          <WordingCard>
            With the blessings of our elders and the grace of God, we joyfully announce that our little one is turning ONE!{'\n\n'}
            Join us for the birthday celebration of{'\n'}
            Baby [Child&apos;s Name]{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name &amp; Address]{'\n\n'}
            Your presence and blessings will make this day truly special for our family.{'\n\n'}
            — [Father&apos;s Name] &amp; [Mother&apos;s Name]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple WhatsApp short message</h3>
          <WordingCard>
            [Child&apos;s Name] is turning 1! 🎂{'\n\n'}
            Join us to celebrate on [Date] at [Time].{'\n'}
            Venue: [Venue, City]{'\n\n'}
            Do come and shower [him/her] with your love and blessings!
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Theme party invitation</h3>
          <WordingCard>
            Our little [Theme] star is turning ONE!{'\n\n'}
            We are celebrating the first birthday of{'\n'}
            [Child&apos;s Name]{'\n'}
            with a [Theme] theme party.{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Dress code: [Theme colours / optional]{'\n\n'}
            Come, celebrate, and make memories with us!{'\n'}
            — [Mother&apos;s Name] &amp; [Father&apos;s Name]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Formal English — both parents named</h3>
          <WordingCard>
            [Father&apos;s Full Name] and [Mother&apos;s Full Name]{'\n'}
            joyfully invite you to celebrate{'\n'}
            the First Birthday of their beloved child{'\n\n'}
            [Child&apos;s Full Name]{'\n\n'}
            Date: [Day], [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name], [Address], [City]{'\n\n'}
            Kindly grace the occasion with your blessings.{'\n'}
            RSVP: [Phone Number]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Bilingual — Hindi + English</h3>
          <WordingCard>
            हमारे प्यारे [बच्चे का नाम] का पहला जन्मदिन!{'\n\n'}
            आप सभी से अनुरोध है कि अपने आशीर्वाद और स्नेह के साथ हमारे घर पधारें।{'\n\n'}
            तारीख: [Date]{'\n'}
            समय: [Time]{'\n'}
            स्थान: [Venue, City]{'\n\n'}
            Our little one turns 1 — join us for the celebration!{'\n'}
            — [Father&apos;s Name] &amp; [Mother&apos;s Name]
          </WordingCard>
        </div>
      </section>

      {/* Section 2: Adult Milestones */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Adult Milestone Birthday Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Milestone birthdays deserve a message that matches the occasion. Use these as a starting point — adjust the tone based on how formal the celebration will be.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">18th Birthday</h3>
          <WordingCard>
            [Name] is officially 18!{'\n\n'}
            Join us as we celebrate this milestone birthday{'\n'}
            on [Date] at [Time].{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come be part of the moment [Name] steps into adulthood.{'\n'}
            — The [Family Name] Family
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">21st Birthday</h3>
          <WordingCard>
            21 years of making our lives better!{'\n\n'}
            Please join us for [Name]&apos;s 21st Birthday Celebration{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time]{'\n'}
            Venue: [Venue, Address]{'\n\n'}
            Dinner and dancing to follow. RSVP by [Date] to [Phone].
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">30th Birthday</h3>
          <WordingCard>
            Thirty, flirty, and thriving!{'\n\n'}
            Help us celebrate [Name]&apos;s 30th Birthday{'\n'}
            on [Date] at [Time].{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come with your best memories and your dancing shoes.{'\n'}
            RSVP: [Phone / WhatsApp Number]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">50th Birthday — children hosting for parent</h3>
          <WordingCard>
            Fifty years of love, wisdom, and grace —{'\n'}
            [Parent&apos;s Name] turns 50!{'\n\n'}
            We, [Child 1&apos;s Name] and [Child 2&apos;s Name], invite you{'\n'}
            to celebrate this golden milestone with our family.{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue, Address]{'\n\n'}
            Please join us to shower [him/her] with your blessings and love.
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">60th Birthday — children hosting</h3>
          <WordingCard>
            With immense gratitude and joy, we invite you to celebrate{'\n'}
            the 60th Birthday of our beloved{'\n'}
            [Parent&apos;s Full Name]{'\n\n'}
            Date: [Day], [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name &amp; Address]{'\n\n'}
            Your presence and blessings would be the greatest gift.{'\n\n'}
            Warmly,{'\n'}
            [Son/Daughter&apos;s Name] &amp; Family
          </WordingCard>
        </div>
      </section>

      {/* Section 3: Surprise Party */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Surprise Birthday Party Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            The secrecy line is the most important part of a surprise party invitation — always make it prominent so no one accidentally lets it slip.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Classic surprise party</h3>
          <WordingCard>
            ⚠️ SURPRISE! Please don&apos;t tell [Name]! ⚠️{'\n\n'}
            We are throwing a surprise birthday party for [Name]!{'\n\n'}
            Date: [Date]{'\n'}
            Please arrive by: [Time — 30 min before guest of honour]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            [Name] will arrive at [Time]. Please be seated and quiet before then!{'\n'}
            RSVP: [Organiser&apos;s Name] — [Phone Number]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Surprise at a restaurant</h3>
          <WordingCard>
            🤫 Keep it a secret — we&apos;re surprising [Name]!{'\n\n'}
            We&apos;ve told [Name] it&apos;s just a casual dinner.{'\n'}
            The real plan: a full surprise birthday celebration!{'\n\n'}
            Restaurant: [Restaurant Name, Address]{'\n'}
            Please arrive by: [Time]{'\n'}
            [Name] will arrive around [Time]{'\n\n'}
            Coordinate with [Contact Name] on [Phone] for seating.{'\n'}
            Please do not post anything on social media until after the reveal!
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Surprise with outstation family</h3>
          <WordingCard>
            The biggest surprise of [Name]&apos;s [Age]th birthday?{'\n'}
            The whole family is flying in!{'\n\n'}
            We are coordinating a surprise gathering — [Name] has no idea.{'\n\n'}
            Date: [Date]{'\n'}
            Time: Assembly at [Time] (guests) | [Name] arrives at [Later Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Please keep this completely secret. Coordinate travel plans with{'\n'}
            [Organiser&apos;s Name] at [Phone Number].{'\n'}
            SURPRISE! 🎉
          </WordingCard>
        </div>
      </section>

      {/* Section 4: Short WhatsApp Group Messages */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Simple Birthday Invitation Text for WhatsApp Groups</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For group chats, shorter is better. These messages get to the point fast — the full details live in the digital invite link you paste below them.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">Kids birthday group post</h3>
          <WordingCard>
            [Child&apos;s Name] turns [Age] on [Date]!{'\n'}
            Birthday party at [Venue], [Time] onwards.{'\n'}
            All little ones welcome — cake, games &amp; fun!{'\n'}
            Details 👉 [Digital Invite Link]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Adults casual group post</h3>
          <WordingCard>
            Hey everyone! [Name]&apos;s birthday bash is happening!{'\n'}
            📅 [Date] | 🕖 [Time] | 📍 [Venue]{'\n'}
            Come hungry, come ready to party.{'\n'}
            Full details: [Digital Invite Link]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Office / friends group</h3>
          <WordingCard>
            Celebrating [Name]&apos;s [Age]th! 🎂{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            RSVP by [Date] — confirming helps us plan.{'\n'}
            Invite: [Digital Invite Link]
          </WordingCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Mixed family group</h3>
          <WordingCard>
            Pranam 🙏 / Dear All,{'\n'}
            [Name]&apos;s birthday celebration is on [Date] at [Time].{'\n'}
            Venue: [Venue, Address].{'\n'}
            Your blessings and presence are requested.{'\n'}
            View full invite: [Digital Invite Link]
          </WordingCard>
        </div>
      </section>

      {/* Section 5: What Makes It Work */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">What Makes a Birthday Invitation Message Work</h2>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
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
      <section className="px-5 py-14 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-2xl text-ink mb-6">More Birthday Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/birthday-invitation" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create free digital birthday invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Browse birthday invitation templates →
            </Link>
            <Link href="/blog/birthday-invitation-text-for-whatsapp-groups" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Birthday invitation text for WhatsApp groups →
            </Link>
            <Link href="/blog/first-birthday-invitation-ideas-for-indian-families" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              First birthday invitation ideas →
            </Link>
            <Link href="/create" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create birthday invitation free →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Birthday Invitation Wording — FAQ</h2>
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

      {/* CTA */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Ready to Create Your Birthday Invitation?</h2>
          <p className="text-muted text-sm mb-7">Free to create · No credit card · WhatsApp-ready link in 5 minutes</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Birthday Invite Free →
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
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
