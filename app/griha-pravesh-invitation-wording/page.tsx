import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: '100+ Griha Pravesh Invitation Messages for WhatsApp (Free)' },
  description:
    '100+ Griha Pravesh & housewarming invitation messages for WhatsApp — copy & paste free, in English & Hindi. Formal, short & modern samples with muhurat time, pooja schedule, quotes & captions.',
  alternates: { canonical: `${APP_URL}/griha-pravesh-invitation-wording` },
  openGraph: {
    title: '100+ Griha Pravesh Invitation Messages for WhatsApp (Free)',
    description: 'Copy & paste Griha Pravesh & housewarming invitation messages for WhatsApp — formal, short, modern & bilingual samples with muhurat time, plus quotes & captions. Free.',
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

      <SiteHeader createHref="/create?template=griha-pravesh" />
      <StickyCTA href="/create?template=griha-pravesh" text="Start My Griha Pravesh Invite →" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            100+ messages · Muhurat-ready · Copy &amp; share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Griha Pravesh &amp; Housewarming<br />
            <span className="gradient-accent italic">Invitation Messages for WhatsApp</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            100+ ready-to-copy Griha Pravesh &amp; housewarming invitation messages for WhatsApp — formal, short,
            modern and bilingual samples for Gruhapravesham and Ghar Pravesh, plus quotes, lines and new-home captions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=griha-pravesh" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Start My Griha Pravesh Invite →
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
            ctaText="Start My Griha Pravesh Invite →"
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

      {/* Section: New Home / Housewarming (English) */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">New Home &amp; Housewarming Invitation Messages (English)</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Clean English wording for a housewarming or new-home celebration — perfect when guests span friends, colleagues and family. Copy, add your details and share on WhatsApp.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Warm new-home invite</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            We&apos;ve found our new home — and we&apos;d love you in it! 🏡{'\n\n'}
            Join us for our housewarming on [Date] at [Time].{'\n'}
            Venue: [New Address, City]{'\n\n'}
            Come bless our new beginning with your presence.{'\n'}
            — [Host Family Names]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple &amp; short</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            🏡 Housewarming time! Join us to celebrate our new home.{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [New Address]{'\n'}
            Your blessings mean everything to us!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Muhurat-focused (English)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            With gratitude, we invite you to the Griha Pravesh of our new home.{'\n\n'}
            🕉️ Muhurat: [Muhurat Time] on [Date]{'\n'}
            Gathering from: [Time]{'\n'}
            Address: [Full New Address + Landmark]{'\n\n'}
            Please arrive before the muhurat for the auspicious entry. Lunch to follow.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Formal — both hosts named</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            [Host 1 Name] &amp; [Host 2 Name]{'\n'}
            request the pleasure of your company at the{'\n'}
            Housewarming (Griha Pravesh) of their new home{'\n\n'}
            🕉️ Muhurat: [Muhurat Time] · [Day, Date]{'\n'}
            [New Address, City]{'\n\n'}
            Your presence and blessings are eagerly awaited.{'\n'}
            RSVP: [Phone]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Evening housewarming party</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            We&apos;re warming up the new place — come join the fun! 🏡🎉{'\n\n'}
            Housewarming get-together{'\n'}
            [Date] · [Time] onwards{'\n'}
            [New Address, City]{'\n\n'}
            Good food, good company, and a home full of love. RSVP: [Phone]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">6. With Google Maps note</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            You&apos;re invited to our housewarming! 🏡{'\n'}
            🕉️ Muhurat: [Muhurat Time] · [Date]{'\n'}
            📍 [New Address] — map &amp; full details 👉 [Digital Invite Link]{'\n\n'}
            The new place is easy to find with the map — see you there!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Modern & Casual */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Modern &amp; Casual Housewarming Messages</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For friends and a relaxed crowd, keep it light and fun. These match a casual house party more than a formal pooja.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Fun &amp; casual</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            New keys, new address, same us — and a party to prove it! 🎉🏡{'\n\n'}
            Housewarming at our place:{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [New Address]{'\n\n'}
            Bring your appetite. We&apos;ll bring the housewarming vibes!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Short group message</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            We moved! 🏡 Come see the new place on [Date] at [Time].{'\n'}
            [New Address] · details 👉 [Digital Invite Link]{'\n'}
            Can&apos;t wait to host you!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Housewarming brunch</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            Brunch + new home = the perfect combo! 🥞🏡{'\n\n'}
            Join us to warm up our new place over good food.{'\n'}
            [Date] · [Time] · [New Address]{'\n\n'}
            Come hungry, leave happy!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Blessings + party combined</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            Pooja in the morning, party in the evening — you&apos;re invited to both! 🙏🎉{'\n\n'}
            🕉️ Griha Pravesh muhurat: [Muhurat Time]{'\n'}
            🎉 Get-together: [Evening Time]{'\n'}
            📍 [New Address, City]{'\n\n'}
            Come for the blessings, stay for the fun!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Bilingual Hindi */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Griha Pravesh Invitation Messages in Hindi</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Hindi and bilingual wording for family groups and elders — warm, respectful and ready to copy.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. पारंपरिक (Traditional Hindi)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            ॥ श्री गणेशाय नमः ॥{'\n\n'}
            सहर्ष सूचित करते हैं कि हमारे नए गृह के गृह प्रवेश एवं पूजन का{'\n'}
            शुभ मुहूर्त [Muhurat Time], दिनांक [Date] को है।{'\n\n'}
            स्थान: [नया पता, शहर]{'\n\n'}
            आपकी उपस्थिति एवं आशीर्वाद हमारे लिए अनमोल होंगे। 🙏{'\n'}
            — [परिवार का नाम]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. छोटा संदेश (Short Hindi)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            🏡 हमारे नए घर के गृह प्रवेश पर आप सादर आमंत्रित हैं।{'\n'}
            मुहूर्त: [Muhurat Time] · दिनांक: [Date]{'\n'}
            पता: [नया पता]{'\n\n'}
            कृपया पधारें और आशीर्वाद दें। 🙏
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. बिलिंगुअल (Hindi + English)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            हमारे नए घर में आपका स्वागत है! 🏡{'\n'}
            गृह प्रवेश मुहूर्त: [Muhurat Time], [Date]{'\n\n'}
            Join us for our Griha Pravesh at [New Address].{'\n'}
            Map &amp; details 👉 [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. आधुनिक (Modern Hindi)</h3>
          <WordingCopyCard ctaHref="/griha-pravesh-invitation">
            नया घर, नई शुरुआत — और आपके बिना अधूरी! 🏡{'\n\n'}
            गृह प्रवेश: [Date] · मुहूर्त [Muhurat Time]{'\n'}
            [नया पता, शहर]{'\n\n'}
            आइए, हमारी खुशियों में शामिल होइए।
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Quotes, Lines & Captions */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Griha Pravesh Quotes, Lines &amp; New-Home Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners for your invitation opener, WhatsApp status, or Instagram — perfect for announcing a new home.
          </p>

          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Housewarming quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;A house is made of walls; a home is made of love and blessings.&rdquo;</li>
                <li>&ldquo;New address, same open door — come celebrate with us.&rdquo;</li>
                <li>&ldquo;May every corner of this home be filled with joy.&rdquo;</li>
                <li>&ldquo;Bless our new beginning with your presence.&rdquo;</li>
                <li>&ldquo;Home is where our story continues — and you&apos;re part of it.&rdquo;</li>
                <li>&ldquo;Four walls, one family, endless memories to come.&rdquo;</li>
                <li>&ldquo;We built a house; your blessings make it a home.&rdquo;</li>
                <li>&ldquo;May peace, prosperity and laughter live here forever.&rdquo;</li>
                <li>&ldquo;A new nest for our family — come share the warmth.&rdquo;</li>
                <li>&ldquo;May this threshold welcome only happiness.&rdquo;</li>
                <li>&ldquo;New keys, new dreams, same love — please join us.&rdquo;</li>
                <li>&ldquo;Every home needs a blessing; ours needs yours.&rdquo;</li>
                <li>&ldquo;May our doorstep always welcome friends like you.&rdquo;</li>
                <li>&ldquo;Bricks and beams become a home when loved ones visit.&rdquo;</li>
                <li>&ldquo;A prayer at the threshold, a lifetime of happiness within.&rdquo;</li>
                <li>&ldquo;May Lakshmi bless every room and every day.&rdquo;</li>
                <li>&ldquo;New home, new hopes — old friends still welcome.&rdquo;</li>
                <li>&ldquo;Where family gathers, a house becomes a home.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us for our Griha Pravesh — [Date] at [Muhurat Time]! 🏡</li>
                <li>We&apos;ve moved! Come bless our new home on [Date].</li>
                <li>Housewarming at [Address] — your presence is our blessing.</li>
                <li>New home, new beginnings — please join the celebration!</li>
                <li>Muhurat: [Time] · [Date] · [New Address]. Do come!</li>
                <li>Come warm our new home with your love and blessings. 🙏</li>
                <li>Our new address awaits you — [Date] · [Time].</li>
                <li>Bring your blessings; we&apos;ll bring the lunch! [Date]</li>
                <li>A new home is not complete without loved ones in it.</li>
                <li>Step into our new home with us — [Date] · [Muhurat Time].</li>
                <li>Grah Shanti &amp; lunch to follow — please join us!</li>
                <li>Your blessings make our house a home. See you [Date]!</li>
                <li>Padharo! Our new home awaits you on [Date]. 🏡</li>
                <li>New home unlocked 🔑 — come celebrate the milestone!</li>
                <li>Join the pooja, stay for the feast — [Date] · [Time].</li>
                <li>We&apos;d be honoured to host you at our new home.</li>
                <li>First guests, best guests — that&apos;s you! [Date]</li>
                <li>Come bless the walls we&apos;ll make memories in. 🙏</li>
                <li>Our housewarming isn&apos;t complete without you.</li>
                <li>A new doorstep, an open invitation — do come! [Date]</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">New-home captions for WhatsApp &amp; Instagram</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Home sweet (new) home 🏡✨ #GrihaPravesh</li>
                <li>New keys, new memories 🔑 Housewarming on [Date]!</li>
                <li>Officially home owners! 🏡 Come celebrate with us.</li>
                <li>Blessed to move into our new nest 🙏🏡</li>
                <li>We built it, now let&apos;s bless it — join us [Date]!</li>
                <li>New address, unchanged love ❤️ You&apos;re invited!</li>
                <li>Our forever home starts today ✨ #Housewarming</li>
                <li>Padharo — the new place is ready for you! 🏡</li>
                <li>Griha Pravesh done, hearts full 🙏 Swipe for the new home.</li>
                <li>From house to home in one blessing 🏡💛</li>
                <li>New beginnings smell like fresh paint &amp; ghee 🪔🏡</li>
                <li>Come see where the next chapter unfolds ✨ [Date]</li>
                <li>Keys in hand, hearts full 🔑❤️ #NewHome</li>
                <li>Housewarming loading… 🏡 [Date]. You&apos;re invited!</li>
                <li>Made it home 🏡 Come bless the new place!</li>
                <li>Our happy place has a new address ✨ #GrihaPravesh</li>
                <li>Diyas lit, doors open — welcome home! 🪔</li>
                <li>Small home, big love — come fill it with us! 💛</li>
                <li>New nest, same flock — join us [Date]! 🕊️🏡</li>
                <li>Here&apos;s to the address where our dreams live 🏡✨</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Hindi lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>नया घर, नई खुशियाँ — आपके आशीर्वाद के साथ। 🏡</li>
                <li>गृह प्रवेश की हार्दिक शुभकामनाएँ — पधारें! 🙏</li>
                <li>हमारे नए आशियाने में आपका हार्दिक स्वागत है।</li>
                <li>मुहूर्त [Time] · दिनांक [Date] — सादर आमंत्रण।</li>
                <li>आपकी उपस्थिति ही हमारी सबसे बड़ी खुशी है।</li>
                <li>नए घर की नई शुरुआत — साथ मनाएँ! ✨</li>
                <li>गृह प्रवेश मुहूर्त: [Time] · दिनांक: [Date] — पधारें। 🙏</li>
                <li>हमारे नए घर को आपके आशीर्वाद की प्रतीक्षा है। 🏡</li>
                <li>चार दीवारें तब घर बनती हैं जब अपने आते हैं।</li>
                <li>पधारो जी! नया घर आपके स्वागत को तैयार है। 🪔</li>
                <li>आपके आशीर्वाद से हमारा नया घर सजेगा।</li>
                <li>नई दहलीज़, वही प्यार — ज़रूर आइए! ❤️</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Regional lines (Gruhapravesham &amp; Ghar Pravesh)</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us for our Gruhapravesham on [Date] at [Muhurat Time]. 🏡</li>
                <li>Ghar Pravesh at our new home — your blessings awaited! 🙏</li>
                <li>Gruhapravesham pooja &amp; lunch — do grace the occasion.</li>
                <li>Our Ghar Pravesh muhurat is [Time], [Date]. Please come!</li>
                <li>Housewarming (Gruhapravesham) — [New Address, City].</li>
                <li>Seeking your blessings for our Ghar Pravesh. 🪔 [Date]</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/griha-pravesh-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital Griha Pravesh invite link</Link>{' '}
              below it — guests get the muhurat time, pooja schedule, map and RSVP in one tap.
            </p>
          </div>
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
            ctaText="Start My Digital Invite →"
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
            <Link href="/blog/housewarming-pooja-schedule-invitation-guide" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Housewarming pooja schedule guide →
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
            Start My Griha Pravesh Invite →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
