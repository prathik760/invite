import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Griha Pravesh Invitation Wording & Messages | ShareInvite' },
  description:
    '20+ Griha Pravesh invitation messages — formal, WhatsApp-ready, bilingual. Muhurat time, pooja schedule, Google Maps. Copy & share free.',
  alternates: { canonical: `${APP_URL}/griha-pravesh-invitation-wording` },
  openGraph: {
    title: 'Griha Pravesh Invitation Wording & Messages | ShareInvite',
    description: '20+ Griha Pravesh invitation messages — formal, WhatsApp-ready, bilingual. Copy & share free.',
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
      name: 'When should I send the Griha Pravesh invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send the Griha Pravesh invitation 10–14 days before the ceremony. For outstation family and close relatives who need to travel, send 3–4 weeks ahead. Always send a WhatsApp reminder 2 days before with the address and muhurat time. With a digital invitation, the reminder is just re-sharing the same link — no new design needed.',
      },
    },
  ],
}


export default function GrihaPraveshInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create?template=griha-pravesh" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>
      <StickyCTA href="/create?template=griha-pravesh" text="Create Free Griha Pravesh Invite →" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            20+ messages · Muhurat-ready · Copy & share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Griha Pravesh Invitation Wording &amp;<br />
            <span className="gradient-accent italic">Housewarming Messages</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            20+ ready-to-copy Griha Pravesh invitation messages for WhatsApp — formal, short, bilingual, and regional variants for Gruhapravesham and Ghar Pravesh ceremonies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=griha-pravesh" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Griha Pravesh Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · WhatsApp-ready link</span>
          </div>
        </div>
      </section>

      {/* Section 1: Formal Messages */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Formal Griha Pravesh Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Formal invitations work best for printed cards and for sending to elders and extended family. They carry a respectful, warm tone and include all ceremony details.
          </p>

          <MidPageCTA
            headline="Those [Digital Invite Link] placeholders? Replace them with a real link guests can tap."
            body="Each message above uses [Digital Invite Link] — a shareable page that already has your muhurat time, Google Maps, and pooja schedule. Create yours free in 5 minutes."
            features={['Muhurat time clearly highlighted', 'Embedded Google Maps pin', 'Full pooja schedule', 'WhatsApp-ready link']}
            ctaHref="/create?template=griha-pravesh"
            ctaText="Create Griha Pravesh Invite Free →"
          />

          <h3 className="font-heading text-base text-ink mb-1">1. Traditional — Vastu Puja, Ganesh Puja, family blessings</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`With the blessings of our elders and the grace of the Almighty, we joyfully invite you to the Griha Pravesh ceremony of our new home.

Vastu Puja & Ganesh Puja: [Muhurat Time]
Grah Shanti: [Time]
Lunch: [Time] onwards

Date: [Date]
New Address: [Full Address, City]

We seek your blessings and heartfelt presence on this auspicious occasion.

— [Host Family Names]
Contact: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Apartment / flat move-in (urban setting)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`We are delighted to invite you to the Griha Pravesh of our new home.

[Flat/Apartment Name & Number]
[Society Name, Wing, Floor]
[Area, City — PIN]

Muhurat: [Time] on [Date]
Ganesh Puja → Lakshmi Puja → Grah Shanti → Lunch

Parking: [Parking instructions — visitor parking at Gate No. / basement level]
Entry: [Building entry instructions if applicable]

Please grace us with your blessings on this memorable day.
— [Father's Name], [Mother's Name] & Family`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. South Indian — Gruhapravesham style</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`With the blessings of Sri [Family Deity / God] and our elders,
[Father's Name] and [Mother's Name]
cordially invite you to the

Gruhapravesham
of our new residence

Muhurtam: [Time] on [Day], [Date]
Address: [Full Address, City]

Ganapathi Puja — [Time]
Gruhapravesham Muhurtam — [Time]
Lunch — [Time] onwards

Your presence and blessings would be the greatest gift.
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. North Indian — with Laxmi Puja reference</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`We request the pleasure of your company at the
Griha Pravesh & Lakshmi Puja
of our new home.

[Host Name(s)]
[New Address, City]

Shubh Muhurat: [Date] at [Time]

Ganesh Puja: [Time]
Griha Pravesh: [Time] (Muhurat)
Lakshmi Puja: [Time]
Prasad & Lunch: [Time] onwards

Kindly honour us with your presence and blessings.
Contact: [Phone Number]`}</WordingCopyCard>
        </div>
      </section>

      {/* Section 2: Short WhatsApp Messages */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Short WhatsApp Griha Pravesh Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For WhatsApp, shorter messages work better — paste the digital invite link right after so guests can tap it for the full details, map, and schedule.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Simple casual</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`We are moving into our new home and would love your blessings!

Griha Pravesh: [Date] at [Muhurat Time]
Address: [New Address, City]

Please do join us. Lunch follows the ceremony.
Details & map: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Muhurat time prominent</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`Griha Pravesh — [Date]
Shubh Muhurat: [Time] SHARP

Please arrive by [15 mins before time] so the puja begins on time.
Venue: [Address, City]
Lunch: [Time] onwards

Invite & map 👉 [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. From joint family</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`With the blessings of [Elder's Name / Dada-Dadi / Nana-Nani],
our family is stepping into our new home.

Griha Pravesh: [Date] at [Time]
New Address: [Address, City]

[Grandfather's/Head of family's name] & the entire [Family Surname] family
invite you to join us for this auspicious occasion.

Map & full schedule: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Hindi / English bilingual</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`नए घर में प्रवेश का मंगल अवसर!

[Family Name] परिवार के नए घर का गृह प्रवेश
दिनांक: [Date] | मुहूर्त: [Time]
पता: [Address, City]

आपके आशीर्वाद और उपस्थिति के बिना यह शुभ कार्य अधूरा है।

Our Griha Pravesh ceremony — do join us!
Map & details: [Digital Invite Link]`}</WordingCopyCard>
        </div>
      </section>

      {/* MidPage CTA 2 */}
      <div className="px-5">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Stop re-typing the address. Send a link guests can tap for directions."
            body="The most common complaint after a Griha Pravesh: guests couldn't find the new address. A digital invite with Google Maps pin solves this — no WhatsApp replies asking 'bhai address bhejna'."
            features={['One tap to Google Maps', 'Parking instructions included', 'RSVP so you know who is coming', 'Send reminder to all with one click']}
            ctaHref="/create?template=griha-pravesh"
            ctaText="Create Digital Invite Free →"
          />
        </div>
      </div>

      {/* Section 3: What Must Be Included */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">What Must Be in a Griha Pravesh Invitation</h2>
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
              <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="font-heading text-base text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-7">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Regional Traditions */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Griha Pravesh Invitation for Different Regional Traditions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            The ceremony name changes by region, but the invitation needs are similar. Adjust the ceremony name and deity references to match your tradition.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">Griha Pravesh — North &amp; Central India</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`[Father's Name] & [Mother's Name]
request your presence at the

Griha Pravesh
of their new home

Shubh Muhurat: [Time], [Date]
Address: [Full Address, City]

Ganesh Puja | Grah Shanti | Lakshmi Puja | Lunch
[Full schedule on digital invite]

Your blessings make our new home complete.
Contact: [Phone]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Gruhapravesham — South India (Tamil / Telugu families)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`Sri [Family Deity] Thiruvadigale Saranam

[Father's Name] & [Mother's Name]
invite you to the

Gruhapravesham
of their new residence

Muhurtam: [Day], [Date] at [Time]
[Full Address, City]

Ganapathi Homam — [Time]
Gruhapravesham — [Muhurtam Time]
Lunch — [Time]

Kindly bless us with your presence.
RSVP: [Phone]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Ghar Pravesh / Naye Ghar ki Khushi — informal Hindi</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`🏠 नए घर में आपका स्वागत है!

हम बड़ी खुशी से आपको अपने नए घर के गृह प्रवेश में आमंत्रित करते हैं।

तारीख: [Date]
मुहूर्त: [Time]
पता: [Address, City]

पूजा, प्रसाद और भोजन — सब कुछ है।
बस आपके आशीर्वाद चाहिए! 🙏

संपर्क: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Vastu Puja + Housewarming combined</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">{`[Family Name] Family
joyfully invites you to the

Vastu Puja & Griha Pravesh Ceremony
of their new home

Date: [Date]
Vastu Puja Muhurat: [Time]
Griha Pravesh: [Time]
Lunch: [Time] onwards

Address: [Full Address with Landmark]
[Google Maps: Digital Invite Link]

Your presence and blessings would make this occasion truly auspicious.`}</WordingCopyCard>
        </div>
      </section>

      {/* Section 5: Mistakes */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">Griha Pravesh Invitation Mistakes That Cause Confusion</h2>
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
              <div key={item.num} className="rounded-2xl border border-border bg-white p-6 shadow-sm flex gap-5">
                <span className="font-heading text-4xl text-accent/40 shrink-0 leading-none">{item.num}</span>
                <div>
                  <h3 className="font-heading text-base text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-7">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-2xl text-ink mb-6">More Griha Pravesh Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/griha-pravesh-invitation" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create free Griha Pravesh invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Browse digital invitation templates →
            </Link>
            <Link href="/blog/how-to-make-a-digital-griha-pravesh-invitation" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              How to make a digital Griha Pravesh invitation →
            </Link>
            <Link href="/blog/housewarming-invitation-wording-for-griha-pravesh" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Housewarming invitation wording guide →
            </Link>
            <Link href="/create" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create Griha Pravesh invitation free →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Griha Pravesh Invitation Wording — FAQ</h2>
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
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Create Your Griha Pravesh Invitation</h2>
          <p className="text-muted text-sm mb-7">Free to create · Muhurat time, map &amp; pooja schedule · WhatsApp-ready in 5 minutes</p>
          <Link href="/create?template=griha-pravesh" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Griha Pravesh Invite Free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink tracking-wide">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          <Link href="/griha-pravesh-invitation" className="hover:text-foreground transition-colors">Griha Pravesh</Link>
          <Link href="/wedding-invitation" className="hover:text-foreground transition-colors">Wedding</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
