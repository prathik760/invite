import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Baby Shower & Godh Bharai Invitation Wording | ShareInvite' },
  description:
    '20+ baby shower invitation messages for India — Godh Bharai, Seemantham, modern baby shower. WhatsApp-ready wording. Free digital invite.',
  alternates: { canonical: `${APP_URL}/baby-shower-invitation-wording` },
  openGraph: {
    title: 'Baby Shower & Godh Bharai Invitation Wording India | ShareInvite',
    description: '20+ baby shower invitation messages — Godh Bharai, Seemantham, modern. WhatsApp-ready. Copy & share free.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Baby Shower Godh Bharai Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between Godh Bharai and a baby shower invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Godh Bharai is a traditional North Indian ceremony focused on blessings, shagun (auspicious gifts), and rituals — typically hosted by the maternal family. A modern baby shower is more informal and party-like, often hosted by friends and may include games and a theme. The invitation tone reflects this difference: Godh Bharai invitations are warm and ceremonial, while baby shower invitations are playful and light. Seemantham is the South Indian equivalent with its own ritual structure.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Godh Bharai women-only? How to mention this in the invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditionally, Godh Bharai is a women-only ceremony. If your event follows this tradition, state it clearly in the invitation: "This is an intimate ladies-only ceremony" or "Ladies are cordially invited." Many families today hold mixed gatherings — if men are welcome, you do not need to mention gender at all. Being clear about this avoids awkward situations where husbands show up to a women-only event.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I send a Godh Bharai invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Godh Bharai is typically held in the 7th or 8th month of pregnancy. Send invitations 10–14 days before the ceremony. For outstation family who need to travel, 3–4 weeks ahead is better. The mother-to-be\'s comfort and energy levels matter — keep the planning window manageable and avoid last-minute rushes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can men attend Seemantham? How to word the invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seemantham is traditionally a women-only ceremony in most South Indian communities. However, practices vary by family and region — some families include the father and close male relatives for the puja rituals. If your event is women-only, mention it clearly: "We request the presence of all the ladies of the family." If it is mixed, no mention is needed. When in doubt, call close male relatives personally to clarify.',
      },
    },
  ],
}


export default function BabyShowerInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>
      <StickyCTA href="/create" text="Create Free Baby Shower Invite →" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,0,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            20+ messages · Godh Bharai, Seemantham &amp; modern · Copy & share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Baby Shower Invitation Wording —<br />
            <span className="gradient-accent italic">Godh Bharai &amp; Seemantham Messages</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            20+ ready-to-copy baby shower invitation messages for India — Godh Bharai, Seemantham, and modern baby shower variants. WhatsApp-ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Baby Shower Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · WhatsApp-ready link</span>
          </div>
        </div>
      </section>

      {/* Section 1: Godh Bharai */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Godh Bharai Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Godh Bharai is a celebration of the mother-to-be — blessing her and filling her lap (godh) with shagun and gifts. The tone is warm, loving, and family-oriented.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Traditional North Indian formal</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`With the blessings of our family and the grace of the Almighty,
we joyfully invite you to the

Godh Bharai Ceremony
of our beloved daughter / daughter-in-law

[Mother-to-be's Name]

Date: [Date] | Time: [Time] onwards
Venue: [Venue Name, Address, City]

A ladies-only ceremony with puja, shagun, and lunch.
Your blessings for the soon-to-arrive little one are our greatest joy.

— [Host Family Names]
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple WhatsApp group message</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Godh Bharai is here!

Date: [Date] at [Time]
Venue: [Venue, City]

Come bless her and the little one on the way 💛
Ladies, please do join us!
Details & map 👉 [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Joint family hosted — both sets of parents named</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Maternal Grandmother's Name] & [Maternal Grandfather's Name]
along with
[Paternal Grandmother's Name] & [Paternal Grandfather's Name]

joyfully invite you to celebrate the Godh Bharai of

[Mother-to-be's Name]
(wife of [Father-to-be's Name])

Date: [Date] | Time: [Time]
Venue: [Address, City]

Puja | Godh Bharai ritual | Lunch
Your presence and blessings would make this day truly special.
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. With dress code note — yellow / green traditional</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`The wait is almost over — and we are celebrating!

Godh Bharai for [Mother-to-be's Name]

Date: [Date] at [Time]
Venue: [Venue, Address]

Dress code: Yellow & Green traditional attire preferred 💛
(or any festive colour you love)

Ladies only | Puja, shagun & lunch
RSVP to [Name] at [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Bilingual Hindi / English</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`गोद भराई का मंगल अवसर!

[Mother-to-be's Name] की गोद भराई पर आप सभी को सादर आमंत्रित किया जाता है।

दिनांक: [Date] | समय: [Time]
स्थान: [Venue, City]

पूजा, गोद भराई रस्म और भोजन — सभी महिलाओं का स्वागत है।

Godh Bharai celebration — ladies, please join us with your blessings!
Invite & map: [Digital Invite Link]`}</WordingCopyCard>
        </div>
      </section>

      {/* MidPage CTA 1 */}
      <div className="px-5">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Those [Digital Invite Link] placeholders? Replace them with one tap to Google Maps."
            body="Each message above has a [Digital Invite Link] slot. That's a real page on ShareInvite — with venue address, Google Maps, and RSVP built in. Create yours free."
            features={['Venue address + Google Maps pin', 'RSVP so you know headcount', 'Ceremony schedule included', 'WhatsApp-ready in 5 minutes']}
            ctaHref="/create"
            ctaText="Create Baby Shower Invite Free →"
          />
        </div>
      </div>

      {/* Section 2: Seemantham */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Seemantham Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Seemantham is a South Indian ceremony — similar to Godh Bharai in intent but with its own ritual structure. Invitations traditionally carry a respectful, ceremonial tone.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Tamil Seemantham formal</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`With the blessings of Sri [Family Deity],
[Host Family Name(s)]
cordially invite you to the

Seemantham Ceremony
of their daughter / daughter-in-law

[Mother-to-be's Name]
(wife of [Father-to-be's Name])

Date: [Date] | Muhurtam: [Time]
Venue: [Venue Name, Address, City]

Puja | Seemantham ritual | Lunch follows
We seek your blessings for the mother and child.
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Telugu Seemantham</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`Sri [Kula Devata] Thiruvadigale Saranam

[Father-in-law's Name] & [Mother-in-law's Name]
along with
[Father's Name] & [Mother's Name]

invite you to the

Seemantham
of [Mother-to-be's Name]

Muhurtam: [Time] on [Date]
Venue: [Venue, Address, City]

Satyanarayan Puja — [Time] | Seemantham — [Time] | Lunch — [Time]
Your presence and blessings are our joy.`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Simple English for non-Telugu / Tamil guests</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Baby Blessing Ceremony (Seemantham)

Date: [Date] at [Time]
Venue: [Venue, Address, City]

Seemantham is a South Indian ceremony to bless the mother-to-be and the baby.
All are welcome to join for the puja and lunch.
Ladies traditionally participate in the main ceremony.

RSVP: [Phone Number]
Details & map: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Short WhatsApp message with link</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Seemantham is on [Date]!
Time: [Time] | Venue: [Venue, City]
Puja + lunch — ladies, please join us 🙏
Full invite & map 👉 [Digital Invite Link]`}</WordingCopyCard>
        </div>
      </section>

      {/* Section 3: Modern Baby Shower */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Modern Baby Shower Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Modern baby showers in Indian cities have taken on a lighter, more informal tone — closer to a celebration party than a traditional ceremony. These messages match that energy.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. English modern — themed</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`A little one is on the way — and we're celebrating!

Baby Shower for [Mother-to-be's Name]

Date: [Date] | Time: [Time] onwards
Venue: [Venue, Address, City]

Theme: [Little Prince / Little Princess / Jungle / Stars & Moon / etc.]
Games, cake, gifts, and lots of love!

RSVP by [Date] to [Name] at [Phone Number]
Full invite: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Co-ed baby shower — both genders</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name] & [Father-to-be's Name]
are expecting — and you're invited to celebrate!

Co-ed Baby Shower
Date: [Date] at [Time]
Venue: [Venue, Address]

Everyone welcome — games, food, and baby predictions!
RSVP to [Phone Number] by [Date]
Invite: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Intimate home gathering</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`We're keeping it small and sweet — just our closest people.

A baby shower for [Mother-to-be's Name]
at [Host's Name]'s home

Date: [Date] | Time: [Time]
Address: [Full Address, City]

Limited seats — please RSVP to [Phone Number] by [Date].
Gifts optional — your presence is the present!`}</WordingCopyCard>
        </div>
      </section>

      {/* MidPage CTA 2 */}
      <div className="px-5">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Stop typing the address twice. Send a link — guests RSVP, you get the headcount."
            body="Know exactly how many people are coming before the event. No more vague confirmations with 3 yes replies and 7 no-shows. A digital invite with RSVP tracks it all."
            features={['Real RSVP with name and count', 'Automated reminder 1 day before', 'WhatsApp share in one tap', 'Free plan — no credit card']}
            ctaHref="/create"
            ctaText="Create Free Baby Shower Invite →"
          />
        </div>
      </div>

      {/* Section 4: Tone Matching */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">Godh Bharai vs Seemantham vs Baby Shower — Which Invitation Tone</h2>
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-heading text-base text-ink mb-2">Godh Bharai</h3>
              <p className="text-sm text-muted leading-7">
                Godh Bharai is a celebratory, blessing-focused ceremony — hosted by the family, often jointly by the maternal and paternal sides. It is a joint family event at its heart. The invitation tone should be warm and traditional, mentioning the shagun ritual and explicitly inviting women of the family. Formal invitations name the grandparents as hosts alongside the parents-to-be. Even WhatsApp-friendly messages keep a respectful undertone.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">Seemantham</h3>
              <p className="text-sm text-muted leading-7">
                Seemantham is ritual-heavy, with a defined puja schedule and muhurtam. South Indian families treat it with the same ceremony weight as a wedding event. Invitations for Seemantham should state the muhurtam time, include the full ceremony schedule, and carry a respectful, formal tone. For guests unfamiliar with the tradition, a brief English explanation of what Seemantham is can be helpful — especially on digital invites with non-South-Indian guest lists.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">Modern baby shower</h3>
              <p className="text-sm text-muted leading-7">
                The modern baby shower is light, fun, and celebration-first — it often comes with a theme, games, and a cake. The invitation can be playful and informal. Puns and light humour work well here. A themed invite (jungle, stars, or &ldquo;It&apos;s a girl / boy&rdquo;) adds to the excitement. The tone does not need to be ceremonial — just warm and inviting.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">Match the wording to the event type</h3>
              <p className="text-sm text-muted leading-7">
                The core rule is simple: let the type of event dictate the tone. A formal Godh Bharai with a pandit and traditional rituals needs a formal, respectful invitation. A party-style baby shower with friends from work can be casual and playful. Guests read the invitation tone and it shapes their expectations — a mismatch between tone and event leaves people confused about how to dress, whether to bring shagun, or whether it is a puja-first or party-first gathering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: What to Include */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">What to Include in a Baby Shower Invitation</h2>
          <div className="space-y-4">
            {[
              {
                title: "Mother-to-be's name (and father's if co-hosting)",
                body: "The invitation centres on the mother-to-be. State her name clearly. For co-ed showers or modern baby showers, include the father's name as well. For traditional Godh Bharai or Seemantham, the hosting family names (grandparents) often appear as the main hosts.",
              },
              {
                title: 'Event date, time, and venue',
                body: 'Date and time in the first three lines — always. For a home address, include the full address with building name, floor, and a nearby landmark. A digital invite with an embedded Google Maps pin works best for addresses guests may not know.',
              },
              {
                title: 'Whether it is women-only or mixed',
                body: 'State this clearly if it is a women-only ceremony (as is traditional for Godh Bharai and Seemantham). Writing "Ladies are warmly invited" signals this politely. If it is a mixed or co-ed event, no mention is needed — guests will understand the default is everyone is welcome.',
              },
              {
                title: 'Gift preferences — or a no-gift note',
                body: 'Many modern baby showers include a gift registry or a note about gift preferences. Some families explicitly prefer no gifts. If you have preferences (certain categories, no duplicates, registry link), include it. A polite "Your presence is our gift" works well for intimate gatherings where gifts may feel obligatory.',
              },
              {
                title: 'Dress code — especially for Godh Bharai',
                body: 'Godh Bharai traditionally involves yellow and green attire — it is a lovely touch to mention the preferred colours. For Seemantham, silk sarees or traditional attire are common. For modern baby showers, a theme colour or "festive / casual" is enough. Always make dress code optional unless it is genuinely important to the host.',
              },
              {
                title: 'RSVP note',
                body: 'For home venues with limited space, an RSVP is essential for planning food and seating. State an RSVP deadline and a contact number or WhatsApp link. Even a simple "Please confirm attendance by [Date] to [Phone]" is sufficient.',
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

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-2xl text-ink mb-6">More Baby Shower Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/digital-invitation" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create free digital invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Browse digital invitation templates →
            </Link>
            <Link href="/blog/baby-shower-invitation-wording-ideas-for-india" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Baby shower invitation wording ideas →
            </Link>
            <Link href="/blog/godh-bharai-invitation-ideas-for-whatsapp" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Godh Bharai invitation ideas for WhatsApp →
            </Link>
            <Link href="/create" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create baby shower invitation free →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Baby Shower Invitation Wording — FAQ</h2>
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
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Create Your Baby Shower Invitation</h2>
          <p className="text-muted text-sm mb-7">Free to create · Godh Bharai, Seemantham &amp; modern baby shower · WhatsApp-ready</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Baby Shower Invite Free →
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
          <Link href="/namakaran-invitation" className="hover:text-foreground transition-colors">Namakaran</Link>
          <Link href="/birthday-invitation" className="hover:text-foreground transition-colors">Birthday</Link>
          <Link href="/digital-invitation" className="hover:text-foreground transition-colors">All Events</Link>
        </div>
      </footer>
    </main>
  )
}
