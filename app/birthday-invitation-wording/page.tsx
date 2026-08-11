import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: '100+ Birthday Invitation Messages for WhatsApp | Copy-Paste' },
  description:
    '100+ birthday invitation messages for WhatsApp — copy & paste free. Simple, short & formal wording for son, daughter, kids, 1st & 50th birthday, plus quotes & lines in English.',
  alternates: { canonical: `${APP_URL}/birthday-invitation-wording` },
  openGraph: {
    title: '100+ Birthday Invitation Messages for WhatsApp (Copy & Paste)',
    description: 'Copy-and-paste birthday invitation messages & wording for WhatsApp — simple, short and formal samples for son, daughter, 1st & 50th birthday, plus quotes and lines in English. Free.',
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


export default function BirthdayInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=indian-birthday" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,0,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            100+ messages · WhatsApp-ready · Copy &amp; share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Birthday Invitation Messages &amp;<br />
            <span className="gradient-accent italic">Wording for WhatsApp</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            100+ ready-to-copy birthday invitation messages for WhatsApp — simple &amp; short samples,
            wording for son, daughter and kids, 1st &amp; 50th birthday, plus quotes, lines and captions in English.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=indian-birthday" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Start My Birthday Invite →
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
          <WordingCopyCard ctaHref="/birthday-invitation">
            With the blessings of our elders and the grace of God, we joyfully announce that our little one is turning ONE!{'\n\n'}
            Join us for the birthday celebration of{'\n'}
            Baby [Child&apos;s Name]{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name &amp; Address]{'\n\n'}
            Your presence and blessings will make this day truly special for our family.{'\n\n'}
            — [Father&apos;s Name] &amp; [Mother&apos;s Name]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple WhatsApp short message</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Child&apos;s Name] is turning 1! 🎂{'\n\n'}
            Join us to celebrate on [Date] at [Time].{'\n'}
            Venue: [Venue, City]{'\n\n'}
            Do come and shower [him/her] with your love and blessings!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Theme party invitation</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
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
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Formal English — both parents named</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Father&apos;s Full Name] and [Mother&apos;s Full Name]{'\n'}
            joyfully invite you to celebrate{'\n'}
            the First Birthday of their beloved child{'\n\n'}
            [Child&apos;s Full Name]{'\n\n'}
            Date: [Day], [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name], [Address], [City]{'\n\n'}
            Kindly grace the occasion with your blessings.{'\n'}
            RSVP: [Phone Number]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Bilingual — Hindi + English</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            हमारे प्यारे [बच्चे का नाम] का पहला जन्मदिन!{'\n\n'}
            आप सभी से अनुरोध है कि अपने आशीर्वाद और स्नेह के साथ हमारे घर पधारें।{'\n\n'}
            तारीख: [Date]{'\n'}
            समय: [Time]{'\n'}
            स्थान: [Venue, City]{'\n\n'}
            Our little one turns 1 — join us for the celebration!{'\n'}
            — [Father&apos;s Name] &amp; [Mother&apos;s Name]
          </WordingCopyCard>
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
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Name] is officially 18!{'\n\n'}
            Join us as we celebrate this milestone birthday{'\n'}
            on [Date] at [Time].{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come be part of the moment [Name] steps into adulthood.{'\n'}
            — The [Family Name] Family
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">21st Birthday</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            21 years of making our lives better!{'\n\n'}
            Please join us for [Name]&apos;s 21st Birthday Celebration{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time]{'\n'}
            Venue: [Venue, Address]{'\n\n'}
            Dinner and dancing to follow. RSVP by [Date] to [Phone].
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">30th Birthday</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Thirty, flirty, and thriving!{'\n\n'}
            Help us celebrate [Name]&apos;s 30th Birthday{'\n'}
            on [Date] at [Time].{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come with your best memories and your dancing shoes.{'\n'}
            RSVP: [Phone / WhatsApp Number]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">50th Birthday — children hosting for parent</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Fifty years of love, wisdom, and grace —{'\n'}
            [Parent&apos;s Name] turns 50!{'\n\n'}
            We, [Child 1&apos;s Name] and [Child 2&apos;s Name], invite you{'\n'}
            to celebrate this golden milestone with our family.{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue, Address]{'\n\n'}
            Please join us to shower [him/her] with your blessings and love.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">60th Birthday — children hosting</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            With immense gratitude and joy, we invite you to celebrate{'\n'}
            the 60th Birthday of our beloved{'\n'}
            [Parent&apos;s Full Name]{'\n\n'}
            Date: [Day], [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue Name &amp; Address]{'\n\n'}
            Your presence and blessings would be the greatest gift.{'\n\n'}
            Warmly,{'\n'}
            [Son/Daughter&apos;s Name] &amp; Family
          </WordingCopyCard>
        </div>
      </section>

      {/* Mid-page CTA 1 */}
      <section className="px-5 py-2 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Your guests deserve more than a WhatsApp text"
            body="A plain message tells them the date. A digital invite shows them the venue on a map, counts down the days, plays a song, and lets them RSVP — all from a single link you paste into any group."
            features={[
              'Live countdown to the birthday',
              'Photo gallery & background music',
              'Tap-to-open Google Maps',
              'RSVP — see who is coming',
            ]}
            ctaHref="/birthday-invitation"
            ctaText="Start My Birthday Invite →"
          />
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
          <WordingCopyCard ctaHref="/birthday-invitation">
            ⚠️ SURPRISE! Please don&apos;t tell [Name]! ⚠️{'\n\n'}
            We are throwing a surprise birthday party for [Name]!{'\n\n'}
            Date: [Date]{'\n'}
            Please arrive by: [Time — 30 min before guest of honour]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            [Name] will arrive at [Time]. Please be seated and quiet before then!{'\n'}
            RSVP: [Organiser&apos;s Name] — [Phone Number]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Surprise at a restaurant</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            🤫 Keep it a secret — we&apos;re surprising [Name]!{'\n\n'}
            We&apos;ve told [Name] it&apos;s just a casual dinner.{'\n'}
            The real plan: a full surprise birthday celebration!{'\n\n'}
            Restaurant: [Restaurant Name, Address]{'\n'}
            Please arrive by: [Time]{'\n'}
            [Name] will arrive around [Time]{'\n\n'}
            Coordinate with [Contact Name] on [Phone] for seating.{'\n'}
            Please do not post anything on social media until after the reveal!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Surprise with outstation family</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            The biggest surprise of [Name]&apos;s [Age]th birthday?{'\n'}
            The whole family is flying in!{'\n\n'}
            We are coordinating a surprise gathering — [Name] has no idea.{'\n\n'}
            Date: [Date]{'\n'}
            Time: Assembly at [Time] (guests) | [Name] arrives at [Later Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Please keep this completely secret. Coordinate travel plans with{'\n'}
            [Organiser&apos;s Name] at [Phone Number].{'\n'}
            SURPRISE! 🎉
          </WordingCopyCard>
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
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Child&apos;s Name] turns [Age] on [Date]!{'\n'}
            Birthday party at [Venue], [Time] onwards.{'\n'}
            All little ones welcome — cake, games &amp; fun!{'\n'}
            Details 👉 [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Adults casual group post</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Hey everyone! [Name]&apos;s birthday bash is happening!{'\n'}
            📅 [Date] | 🕖 [Time] | 📍 [Venue]{'\n'}
            Come hungry, come ready to party.{'\n'}
            Full details: [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Office / friends group</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Celebrating [Name]&apos;s [Age]th! 🎂{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            RSVP by [Date] — confirming helps us plan.{'\n'}
            Invite: [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Mixed family group</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Pranam 🙏 / Dear All,{'\n'}
            [Name]&apos;s birthday celebration is on [Date] at [Time].{'\n'}
            Venue: [Venue, Address].{'\n'}
            Your blessings and presence are requested.{'\n'}
            View full invite: [Digital Invite Link]
          </WordingCopyCard>
        </div>
      </section>

      {/* Mid-page CTA 2 */}
      <section className="px-5 py-2 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Those [Digital Invite Link] placeholders? Create yours in 5 minutes."
            body="Every short message above is designed to pair with a digital invite link. Paste the link and your guests get the venue on a map, a countdown, photos, and an RSVP button — all without installing anything."
            features={[
              'One link works on every phone',
              'Send reminders — same link, no rewriting',
              'No app needed for guests',
              'Free to create and share',
            ]}
            ctaHref="/birthday-invitation"
            ctaText="Get Your Birthday Invite Link →"
          />
        </div>
      </section>

      {/* Section: Simple & Short Birthday Invitation Messages */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Simple Birthday Invitation Messages for WhatsApp</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            The most-shared birthday invitations are short and simple. These copy-paste messages are ready for WhatsApp — clear date, time and venue in the first lines, so no guest is left guessing.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Simplest one-liner</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            You&apos;re invited to [Name]&apos;s birthday! 🎉{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [Venue, City]{'\n'}
            Please come and make the day special!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple &amp; warm</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            It&apos;s [Name]&apos;s birthday and you&apos;re invited! 🎂{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time] onwards{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come celebrate with us — your presence will make it perfect.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Simple in English (formal-friendly)</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            We warmly invite you to celebrate the birthday of [Name].{'\n\n'}
            Date: [Date]{'\n'}
            Time: [Time]{'\n'}
            Venue: [Venue, Address]{'\n\n'}
            Your presence will add joy to our celebration.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Short &amp; casual</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Party alert! 🥳 It&apos;s [Name]&apos;s birthday!{'\n'}
            [Date] · [Time] · [Venue]{'\n'}
            Good food, great company — just bring yourself!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Simple with RSVP</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Join us to celebrate [Name]&apos;s birthday! 🎈{'\n\n'}
            📅 [Date] · 🕖 [Time]{'\n'}
            📍 [Venue, Address]{'\n\n'}
            Kindly confirm your presence: [Phone / WhatsApp]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">6. Bilingual simple (Hindi + English)</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Name] के जन्मदिन पर आप सादर आमंत्रित हैं! 🎉{'\n'}
            दिनांक: [Date] · समय: [Time] · स्थान: [Venue]{'\n\n'}
            You&apos;re invited to [Name]&apos;s birthday — do join us!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Son Birthday */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Son Birthday Invitation Messages for WhatsApp</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Inviting family and friends to your son&apos;s birthday? These messages work for a first birthday, a kids&apos; party, or a milestone — just add his name and age.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Proud parents — warm</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Our little prince is turning [Age]! 👑{'\n\n'}
            We joyfully invite you to celebrate the birthday of our son{'\n'}
            [Son&apos;s Name]{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Your love and blessings will mean the world to him.{'\n'}
            — [Parents&apos; Names]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple in English</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            It&apos;s our son [Name]&apos;s [Age]th birthday! 🎂{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            Come shower him with love and blessings!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Theme party for son</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Our little superhero [Name] is turning [Age]! 🦸{'\n\n'}
            Join the [Theme] birthday party!{'\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Cake, games and lots of fun await — see you there!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Formal — both parents named</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Father&apos;s Name] &amp; [Mother&apos;s Name]{'\n'}
            cordially invite you to celebrate{'\n'}
            the [Age]th birthday of their beloved son{'\n\n'}
            [Son&apos;s Full Name]{'\n\n'}
            Date: [Day, Date] · Time: [Time]{'\n'}
            Venue: [Venue Name, Address]{'\n\n'}
            RSVP: [Phone Number]
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Daughter Birthday */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Daughter Birthday Invitation Messages for WhatsApp</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Celebrating your daughter&apos;s birthday? These heartfelt and simple messages are ready to copy — perfect for a princess party, a milestone, or a warm family gathering.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Proud parents — warm</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Our little princess is turning [Age]! 👑{'\n\n'}
            We joyfully invite you to celebrate the birthday of our daughter{'\n'}
            [Daughter&apos;s Name]{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come bless our little girl on her special day.{'\n'}
            — [Parents&apos; Names]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple in English</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            It&apos;s our daughter [Name]&apos;s [Age]th birthday! 🎀{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            Your love and blessings will make her day!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Princess theme party</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            A royal celebration for our little princess [Name]! 👸{'\n\n'}
            [Theme] birthday party{'\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Dress code: [Theme colours]. Come make magical memories with us!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Formal — both parents named</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Father&apos;s Name] &amp; [Mother&apos;s Name]{'\n'}
            cordially invite you to celebrate{'\n'}
            the [Age]th birthday of their beloved daughter{'\n\n'}
            [Daughter&apos;s Full Name]{'\n\n'}
            Date: [Day, Date] · Time: [Time]{'\n'}
            Venue: [Venue Name, Address]{'\n\n'}
            RSVP: [Phone Number]
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Kids Birthday */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Kids Birthday Invitation Messages</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Fun, playful messages for a children&apos;s birthday party — the kind that make both kids and parents smile. Short enough for a WhatsApp group, warm enough to feel personal.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Playful group message</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            🎉 It&apos;s party time! [Child&apos;s Name] is turning [Age]! 🎂{'\n\n'}
            Join us for cake, games and lots of fun!{'\n'}
            📅 [Date] · 🕖 [Time]{'\n'}
            📍 [Venue &amp; Address]{'\n\n'}
            All little friends welcome — come ready to play!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Short &amp; sweet</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Child&apos;s Name] turns [Age]! 🥳{'\n'}
            Birthday party on [Date] at [Time], [Venue].{'\n'}
            Cake, games &amp; goodie bags — see you there! 🎈
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Themed kids party</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            🚀 Calling all little explorers! 🚀{'\n\n'}
            [Child&apos;s Name] is turning [Age] with a [Theme] party!{'\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come dressed as your favourite [Theme] character!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. With parent RSVP note</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            You&apos;re invited to [Child&apos;s Name]&apos;s [Age]th birthday! 🎉{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [Venue]{'\n\n'}
            Parents, please RSVP by [Date] so we can plan the cake &amp; games!{'\n'}
            — [Parent&apos;s Name], [Phone]
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Friends */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Birthday Invitation Messages for Friends</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For your closest friends, keep it casual and fun. These messages match the vibe of a friends-only birthday — no formality, all good energy.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Casual &amp; fun</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Guess who&apos;s getting older? 😄 It&apos;s my birthday!{'\n\n'}
            Come celebrate with me:{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [Venue]{'\n\n'}
            Good vibes only — bring your appetite and your dance moves!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Short group message</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            It&apos;s my birthday and you&apos;re on the list! 🎉{'\n'}
            [Date] · [Time] · [Venue]{'\n'}
            No gifts, just good company. Be there! ❤️
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Inviting a friend (from host)</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Hey [Friend&apos;s Name]! It&apos;s [Name]&apos;s birthday bash 🥳{'\n'}
            [Date] at [Time], [Venue].{'\n'}
            It won&apos;t be the same without you — come through!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Night out theme</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Another year, another reason to party! 🍾{'\n\n'}
            [Name]&apos;s Birthday Night Out{'\n'}
            📅 [Date] · 🕗 [Time] · 📍 [Venue/Club]{'\n\n'}
            Dress to impress. RSVP so we can save your spot!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Family */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Birthday Invitation Messages for Family</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Family messages carry warmth and respect. These are ideal for mixed family WhatsApp groups where elders and cousins all read the same invite.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Warm family invite</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Dear Family 🙏{'\n\n'}
            With love and joy, we invite you to celebrate{'\n'}
            [Name]&apos;s [Age]th birthday.{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Your presence and blessings mean everything to us.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Respectful — for elders</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Pranam 🙏{'\n\n'}
            We humbly request the honour of your presence at the birthday{'\n'}
            celebration of [Name] on [Date] at [Time].{'\n'}
            Venue: [Venue, Address].{'\n\n'}
            Kindly grace the occasion with your blessings.{'\n'}
            — The [Family Name] Family
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Short family group message</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Dear All 🙏 [Name]&apos;s birthday celebration is on [Date] at [Time].{'\n'}
            Venue: [Venue, City].{'\n'}
            Please do join us with the whole family!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Lunch / get-together</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            We&apos;re hosting a family lunch to celebrate [Name]&apos;s birthday! 🎂{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Home / Venue Address]{'\n\n'}
            Come hungry and bring the little ones — it&apos;s a family affair!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Formal */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Formal Birthday Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For milestone celebrations, corporate birthdays, or when the occasion calls for elegance, use formal wording. Keep the language dignified and the details precise.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Classic formal invitation</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            The pleasure of your company is requested{'\n'}
            at the birthday celebration of{'\n\n'}
            [Full Name]{'\n\n'}
            [Day], the [Date]{'\n'}
            at [Time]{'\n'}
            [Venue Name], [Address], [City]{'\n\n'}
            RSVP by [Date]: [Phone Number]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Formal — hosted by family</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            [Host Family Name]{'\n'}
            cordially invite you to celebrate the [Age]th birthday of{'\n\n'}
            [Full Name]{'\n\n'}
            Date: [Day, Date] · Time: [Time] onwards{'\n'}
            Venue: [Venue Name, Full Address]{'\n\n'}
            Dinner will be served. Kindly confirm your presence by [Date].
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Elegant milestone (50th/60th)</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            With great joy, we invite you to celebrate a milestone —{'\n'}
            the [Age]th Birthday of{'\n\n'}
            [Full Name]{'\n\n'}
            [Day], [Date] · [Time]{'\n'}
            [Venue Name, Address]{'\n\n'}
            Your presence would be the greatest honour and gift.
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Cake Cutting */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Cake Cutting Invitation Messages for WhatsApp</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Hosting a short-and-sweet cake-cutting rather than a full party? These messages set the right expectation — a quick, joyful gathering.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Simple cake cutting</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Join us for [Name]&apos;s birthday cake cutting! 🎂{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue / Home Address]{'\n\n'}
            A short, sweet celebration — your presence will make it special.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Cake cutting + snacks</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            🎂 Cake cutting for [Name]&apos;s [Age]th birthday!{'\n'}
            [Date] · [Time] · [Venue]{'\n'}
            Cake, snacks and good company — drop by and celebrate with us!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Office / team cake cutting</h3>
          <WordingCopyCard ctaHref="/birthday-invitation">
            Team, join us to celebrate [Name]&apos;s birthday! 🎉{'\n'}
            Cake cutting at [Time] on [Date], [Location/Cafeteria].{'\n'}
            Let&apos;s take a break and celebrate together!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Quotes, Lines & Captions */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Birthday Invitation Quotes, Lines &amp; Captions (English)</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners to open your invitation, use as a WhatsApp caption, or pair with your digital invite link. Mix and match with any message above.
          </p>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Birthday invitation quotes</h3>
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
              <h3 className="font-heading text-base text-ink mb-3">Short invitation lines</h3>
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
              <h3 className="font-heading text-base text-ink mb-3">Captions for WhatsApp status &amp; social</h3>
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
              <h3 className="font-heading text-base text-ink mb-3">First birthday &amp; milestone lines</h3>
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
              below it — guests get the venue map, countdown and RSVP in one tap.
            </p>
          </div>
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
          <Link href="/create?template=indian-birthday" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Start My Birthday Invite →
          </Link>
        </div>
      </section>

      <StickyCTA href="/birthday-invitation" text="Start My Birthday Invite →" />

      <SiteFooter />
    </main>
  )
}
