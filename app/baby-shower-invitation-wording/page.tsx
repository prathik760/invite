import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import FAQAccordion from '@/components/landing/FAQAccordion'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: '25+ Baby Shower & Godh Bharai Messages for WhatsApp (Free)' },
  description:
    '25+ baby shower & Godh Bharai invitation messages for WhatsApp — copy & paste free. Seemantham, Valaikappu & modern samples, plus quotes and captions in English & Hindi.',
  alternates: { canonical: `${APP_URL}/baby-shower-invitation-wording` },
  openGraph: {
    title: '25+ Baby Shower & Godh Bharai Messages for WhatsApp (Free)',
    description: 'Copy & paste baby shower & Godh Bharai invitation messages for WhatsApp — Seemantham, Valaikappu & modern samples, plus quotes and captions. Free.',
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
    <main className="min-h-screen bg-champagne text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />
      <StickyCTA href="/create" text="Start My Baby Shower Invite →" />

      {/* Hero */}
      <PageHero
        align="center"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Baby shower invitation wording' }]} eyebrow="25+ messages · Godh Bharai, Seemantham &amp; modern · Copy &amp; share free"
        title={<>Baby Shower Invitation Wording —<br />
            <em className="font-medium text-burnished">Godh Bharai &amp; Seemantham Messages</em></>}
        lede={<>25+ ready-to-copy baby shower invitation messages for India — Godh Bharai, Seemantham, Valaikappu and modern baby shower variants, plus quotes and captions. WhatsApp-ready.</>}
        actions={<><Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold">
              Start My Baby Shower Invite</Link></>}
        footnote={<TrustList />}
      />

      {/* Section 1: Godh Bharai */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Godh Bharai Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Godh Bharai is a celebration of the mother-to-be — blessing her and filling her lap (godh) with shagun and gifts. The tone is warm, loving, and family-oriented.
          </p>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1">1. Traditional North Indian formal</h3>
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

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">2. Simple WhatsApp group message</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Godh Bharai is here!

Date: [Date] at [Time]
Venue: [Venue, City]

Come bless her and the little one on the way 💛
Ladies, please do join us!
Details & map 👉 [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">3. Joint family hosted — both sets of parents named</h3>
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

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">4. With dress code note — yellow / green traditional</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`The wait is almost over — and we are celebrating!

Godh Bharai for [Mother-to-be's Name]

Date: [Date] at [Time]
Venue: [Venue, Address]

Dress code: Yellow & Green traditional attire preferred 💛
(or any festive colour you love)

Ladies only | Puja, shagun & lunch
RSVP to [Name] at [Phone Number]`}</WordingCopyCard>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">5. Bilingual Hindi / English</h3>
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
            body="Each message above has a [Digital Invite Link] slot. That's a real page on ShareInvite — with venue address, Google Maps and a blessings wall built in. Create yours free."
            features={['Venue address + Google Maps pin', 'Blessings from guests on the page', 'Ceremony schedule included', 'WhatsApp-ready in 5 minutes']}
            ctaHref="/create"
            ctaText="Start My Baby Shower Invite →"
          />
        </div>
      </div>

      {/* Section 2: Seemantham */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Seemantham Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Seemantham is a South Indian ceremony — similar to Godh Bharai in intent but with its own ritual structure. Invitations traditionally carry a respectful, ceremonial tone.
          </p>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1">1. Tamil Seemantham formal</h3>
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

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">2. Telugu Seemantham</h3>
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

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">3. Simple English for non-Telugu / Tamil guests</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Baby Blessing Ceremony (Seemantham)

Date: [Date] at [Time]
Venue: [Venue, Address, City]

Seemantham is a South Indian ceremony to bless the mother-to-be and the baby.
All are welcome to join for the puja and lunch.
Ladies traditionally participate in the main ceremony.

RSVP: [Phone Number]
Details & map: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">4. Short WhatsApp message with link</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name]'s Seemantham is on [Date]!
Time: [Time] | Venue: [Venue, City]
Puja + lunch — ladies, please join us 🙏
Full invite & map 👉 [Digital Invite Link]`}</WordingCopyCard>
        </div>
      </section>

      {/* Section 3: Modern Baby Shower */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Modern Baby Shower Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Modern baby showers in Indian cities have taken on a lighter, more informal tone — closer to a celebration party than a traditional ceremony. These messages match that energy.
          </p>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1">1. English modern — themed</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`A little one is on the way — and we're celebrating!

Baby Shower for [Mother-to-be's Name]

Date: [Date] | Time: [Time] onwards
Venue: [Venue, Address, City]

Theme: [Little Prince / Little Princess / Jungle / Stars & Moon / etc.]
Games, cake, gifts, and lots of love!

RSVP by [Date] to [Name] at [Phone Number]
Full invite: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">2. Co-ed baby shower — both genders</h3>
          <WordingCopyCard ctaHref="/baby-shower-invitations">{`[Mother-to-be's Name] & [Father-to-be's Name]
are expecting — and you're invited to celebrate!

Co-ed Baby Shower
Date: [Date] at [Time]
Venue: [Venue, Address]

Everyone welcome — games, food, and baby predictions!
RSVP to [Phone Number] by [Date]
Invite: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-1 mt-6">3. Intimate home gathering</h3>
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
            headline="Stop typing the address twice. Send one link with every detail."
            body="Guests get the date, time, venue map and schedule in one place, so fewer of them need to call you. Ask them to confirm on WhatsApp and you have your headcount."
            features={['Blessings wall for guests', 'Re-send the same link as a reminder', 'WhatsApp share in one tap', 'Free to build & preview']}
            ctaHref="/create"
            ctaText="Start My Baby Shower Invite →"
          />
        </div>
      </div>

      {/* Section 4: Tone Matching */}
      <section className="border-b border-line bg-paper px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">Godh Bharai vs Seemantham vs Baby Shower — Which Invitation Tone</h2>
          <div className="rounded-2xl border border-line bg-champagne p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">Godh Bharai</h3>
              <p className="text-sm text-muted leading-7">
                Godh Bharai is a celebratory, blessing-focused ceremony — hosted by the family, often jointly by the maternal and paternal sides. It is a joint family event at its heart. The invitation tone should be warm and traditional, mentioning the shagun ritual and explicitly inviting women of the family. Formal invitations name the grandparents as hosts alongside the parents-to-be. Even WhatsApp-friendly messages keep a respectful undertone.
              </p>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">Seemantham</h3>
              <p className="text-sm text-muted leading-7">
                Seemantham is ritual-heavy, with a defined puja schedule and muhurtam. South Indian families treat it with the same ceremony weight as a wedding event. Invitations for Seemantham should state the muhurtam time, include the full ceremony schedule, and carry a respectful, formal tone. For guests unfamiliar with the tradition, a brief English explanation of what Seemantham is can be helpful — especially on digital invites with non-South-Indian guest lists.
              </p>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">Modern baby shower</h3>
              <p className="text-sm text-muted leading-7">
                The modern baby shower is light, fun, and celebration-first — it often comes with a theme, games, and a cake. The invitation can be playful and informal. Puns and light humour work well here. A themed invite (jungle, stars, or &ldquo;It&apos;s a girl / boy&rdquo;) adds to the excitement. The tone does not need to be ceremonial — just warm and inviting.
              </p>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">Match the wording to the event type</h3>
              <p className="text-sm text-muted leading-7">
                The core rule is simple: let the type of event dictate the tone. A formal Godh Bharai with a pandit and traditional rituals needs a formal, respectful invitation. A party-style baby shower with friends from work can be casual and playful. Guests read the invitation tone and it shapes their expectations — a mismatch between tone and event leaves people confused about how to dress, whether to bring shagun, or whether it is a puja-first or party-first gathering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: What to Include */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-6">What to Include in a Baby Shower Invitation</h2>
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
              <div key={item.title} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-7">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes, Lines & Captions */}
      <section className="border-b border-line px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 mb-3">Baby Shower Quotes, Lines &amp; Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners to open your invitation, use as a WhatsApp caption, or pair with your digital invite link.
          </p>
          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">Baby shower quotes &amp; lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;A little one is on the way — come shower us with love!&rdquo;</li>
                <li>&ldquo;Blessings, not gifts — your presence is the present.&rdquo;</li>
                <li>Join us to bless the mom-to-be on [Date]! 🤰</li>
                <li>A tiny miracle is coming — celebrate with us! [Date]</li>
                <li>Godh Bharai blessings for [Name] — do join us. 🙏</li>
                <li>Come shower [Name] with love before baby arrives!</li>
                <li>Little feet are on the way — bless them with us. 👣</li>
                <li>Sweet blessings for a sweet beginning — [Date] · [Venue].</li>
              </ul>
            </div>
            <div>
              <h3 className="font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal mb-3">WhatsApp &amp; Instagram captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Baby loading… 🤰 Join the shower on [Date]!</li>
                <li>Oh baby! 🎀 Come celebrate the mom-to-be. [Date]</li>
                <li>Twinkle twinkle little star — a baby&apos;s on the way! ⭐</li>
                <li>Showering blessings on [Name] 💛 You&apos;re invited!</li>
                <li>From bump to baby — bless the journey! [Date]</li>
                <li>Little one, big love — join our Godh Bharai! 🙏</li>
                <li>Details 👉 [Digital Invite Link] · see you there!</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: open with any line, then paste your{' '}
              <Link href="/create" className="text-accent-strong underline-offset-2 hover:underline">digital baby shower invite link</Link>{' '}
              below it — guests get the venue map, schedule and a place to leave wishes in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h3 mb-3">More Baby Shower Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/digital-invitation" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors">
              Create free digital invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors">
              Browse digital invitation templates →
            </Link>
            <Link href="/blog/baby-shower-invitation-wording-ideas-for-india" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors">
              Baby shower invitation wording ideas →
            </Link>
            <Link href="/blog/godh-bharai-invitation-ideas-for-whatsapp" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors">
              Godh Bharai invitation ideas for WhatsApp →
            </Link>
            <Link href="/create" className="rounded-xl border border-line bg-champagne p-4 text-sm font-medium text-foreground hover:border-[#A47945]/50 transition-colors">
              Create baby shower invitation free →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="paper" id="faq" aria-label="Questions">
        <SectionHeading align="center" eyebrow="Questions" title={'Baby Shower Invitation Wording — FAQ'} />
        <div className="mt-10">
          <FAQAccordion faqs={faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))} />
        </div>
      </Section>

      {/* CTA */}
      <CtaBand
        title={'Create Your Baby Shower Invitation'}
        sub={'Free to create · Godh Bharai, Seemantham & modern baby shower · WhatsApp-ready'}
        primary={{ href: '/create', label: 'Start My Baby Shower Invite' }}
      />

      <SiteFooter />
    </main>
  )
}
