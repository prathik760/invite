import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Namakaran Invitation Messages India | ShareInvite' },
  description:
    '20+ Namakaran invitation messages for India — baby boy, baby girl, formal, WhatsApp, bilingual. Naming ceremony & cradle ceremony wording.',
  alternates: { canonical: `${APP_URL}/namakaran-invitation-wording` },
  openGraph: {
    title: 'Namakaran Invitation Messages — Naming Ceremony | ShareInvite',
    description: '20+ Namakaran invitation messages — baby boy, baby girl, formal, WhatsApp, bilingual. Copy & share free.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Namakaran Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When should a Namakaran ceremony be held?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditionally, Namakaran is held on the 11th or 12th day after birth in North India — a day considered auspicious after the initial post-birth period. Many families also choose the 28th day or a later auspicious date selected by a pandit. South Indian families often hold the Namakarana ceremony on the 11th, 12th, or a chosen auspicious day. Increasingly, families delay to a date convenient for outstation relatives to attend, sometimes a month or two after birth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I reveal the baby\'s name in the invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This is entirely a family preference. Many families reveal the name in the invitation itself — it helps guests address the baby and adds warmth to the message. Others prefer to keep the name as a ceremonial reveal during the event. If you want it to be a surprise, write "We are naming our little one" without revealing the name, and let guests discover it at the ceremony.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write a Namakaran invitation in English?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the parents\' names and a warm opening ("With hearts full of joy..."), mention the baby\'s gender and name (or "our little one" if keeping it a surprise), state the ceremony date and time, give the venue address, and include the ceremony schedule if there is a pooja and lunch. Close with a blessing request. Keep it warm but concise — 8–10 lines works well for a printed card or WhatsApp message.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Namakaran and Cradle ceremony?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Namakaran (also spelled Naamkaran) is the Hindu naming ceremony — the formal ritual where the baby is given its name, often by a pandit with Sanskrit mantras. The Cradle ceremony is the English term most commonly used by South Indian families (Tamil, Telugu, Kannada) for what they call Namakarana. The ceremony involves placing the baby in a decorated cradle and formally announcing the name. The two terms often describe the same event but in different regional traditions.',
      },
    },
  ],
}


export default function NamakaranInvitationWordingPage() {
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
      <StickyCTA href="/create?template=namakaran" text="Create Free Namakaran Invite →" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,0,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            20+ messages · Baby boy &amp; girl · Copy & share free
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Namakaran Invitation Wording &amp;<br />
            <span className="gradient-accent italic">Baby Naming Ceremony Messages</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            20+ ready-to-copy Namakaran invitation messages for India — baby boy, baby girl, formal, WhatsApp-ready, bilingual, and regional cradle ceremony variants.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Create Namakaran Invite Free →
            </Link>
            <span className="text-sm text-muted">No credit card · WhatsApp-ready link</span>
          </div>
        </div>
      </section>

      {/* Section 1: Baby Boy */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Namakaran Invitation Message for Baby Boy</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            These messages work for print cards, WhatsApp groups, and digital invites. Adjust the name reveal based on whether you want it to be a surprise at the ceremony.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Traditional — Sanskrit-influenced formal</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`With the blessings of our Kula Devata and the grace of our elders,
we joyfully invite you to the

Namakaran Sanskar
of our beloved son

[Baby's Name]

Date: [Date] | Shubh Muhurat: [Time]
Venue: [Venue Name & Address, City]

Puja: [Time] | Name Announcement: [Time] | Lunch: [Time] onwards

Please bless our little one on this sacred first milestone.
— [Father's Name] & [Mother's Name]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple WhatsApp message</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`Our little prince has arrived and it's time to give him his name!

Baby Boy Naming Ceremony
Date: [Date] at [Time]
Venue: [Venue & Address]

[Baby's Name] — officially named on [Date]!
Do come with your blessings. Lunch follows the ceremony.
Details: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. With name reveal element</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`We are naming our little prince — and we want you there for the moment!

[Father's Name] & [Mother's Name]
joyfully invite you to the Namakaran ceremony of

Baby [Baby's Name]

The name reveal will happen at the ceremony — come be part of it!

Date: [Date] | Time: [Time]
Venue: [Address, City]

RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Bilingual Hindi / English</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`हमारे घर एक नन्हे राजकुमार का आगमन हुआ है!

[Baby's Name] का नामकरण संस्कार

तारीख: [Date]
मुहूर्त: [Time]
स्थान: [Address, City]

आपके आशीर्वाद के बिना यह संस्कार अधूरा है।

Our baby boy's naming ceremony — please join us!
— [Father's Name] & [Mother's Name]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. South Indian style — Namakarana / Cradle ceremony</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`With the blessings of Sri [Family Deity],
[Father's Name] & [Mother's Name]
invite you to the

Namakarana & Cradle Ceremony
of their beloved son

[Baby's Name]

Muhurtam: [Time] on [Date]
Venue: [Venue, Address, City]

Ganapathi Puja — [Time]
Cradle Ceremony & Name Announcement — [Time]
Lunch — [Time] onwards

Your presence and blessings are our greatest joy.
RSVP: [Phone Number]`}</WordingCopyCard>
        </div>
      </section>

      {/* CTA strip after baby boy messages */}
      <section className="px-5 py-12 bg-[#FFF9F2] border-b border-border">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#D9A441]/30 bg-white p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1">
            <p className="font-heading text-lg text-ink mb-1">Skip the plain WhatsApp text</p>
            <p className="text-sm text-muted leading-7">
              A digital Namakaran invitation does everything a WhatsApp message cannot — baby photos that load properly, a venue pin guests can tap to navigate, background music, and a guest wishes section where guests leave blessings directly on the invite.
            </p>
          </div>
          <Link
            href="/create?template=namakaran"
            className="gold-button shrink-0 rounded-xl px-7 py-3.5 text-sm font-semibold whitespace-nowrap"
          >
            Create Namakaran Invite Free →
          </Link>
        </div>
      </section>

      {/* Section 2: Baby Girl */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Namakaran Invitation Message for Baby Girl</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            A baby girl&apos;s naming ceremony is a joyful family milestone. These messages range from formal to casual WhatsApp-ready texts.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Formal English</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`With hearts full of joy and gratitude,
[Father's Name] and [Mother's Name]
joyfully invite you to celebrate the

Namakaran Ceremony
of their beloved daughter

[Baby's Name]

Date: [Day], [Date]
Auspicious Muhurat: [Time]
Venue: [Venue Name, Address, City]

Ceremony programme: Puja — [Time] | Name Announcement — [Time] | Lunch — [Time]

Kindly grace us with your blessings and presence.
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Modern simple</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`Our little girl is getting her name, and we want you there!

[Baby's Name]'s Naming Ceremony
Date: [Date] at [Time]
Venue: [Venue & Address]

Come shower her with your love and blessings.
Lunch after the ceremony.
Full invite: [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. With goddess / blessing reference — South Indian style</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`With the blessings of Goddess [Lakshmi / Saraswati / Family Deity],
a little goddess has arrived in our home.

[Father's Name] & [Mother's Name]
invite you to the

Namakarana Ceremony of their daughter
[Baby's Name]

Muhurtam: [Date] at [Time]
Venue: [Venue, Address, City]

Cradle ceremony, puja, and lunch follow.
Your blessings are our family's greatest treasure.`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Short WhatsApp group post</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`[Baby's Name]'s naming ceremony is on [Date]!
Time: [Time] | Venue: [Venue, City]
All blessings welcome 💛
Details & map 👉 [Digital Invite Link]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. Bilingual Hindi / English</h3>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`हमारी प्यारी बेटी का नामकरण!

[Baby's Name] — इस नाम के साथ वो हमारे घर की रोशनी बनेगी।

दिनांक: [Date] | मुहूर्त: [Time]
स्थान: [Address, City]

पूजा, नाम घोषणा और भोजन — सभी के लिए स्वागत है।

Our baby girl's naming ceremony — do join us with your blessings!
— [Father's Name] & [Mother's Name]`}</WordingCopyCard>
        </div>
      </section>

      {/* Section 3: Regional Traditions */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Naming Ceremony Invitation Wording — Regional Traditions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            The naming ceremony carries different names and customs across India. Each sample below reflects the regional tone — adjust based on your tradition.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">Namakaran — North India (day 11 or 12 after birth)</h3>
          <p className="text-sm text-muted leading-7 mb-2">Held 11 or 12 days after birth as per Hindu tradition. Family pandit performs the naming ritual with Sanskrit mantras.</p>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`[Father's Name] & [Mother's Name]
invite you to the Namakaran Sanskar of

Baby [Baby's Name]

to be celebrated on [Date] at [Time]
at [Venue, Address, City]

Puja, prasad, and blessings — your presence completes this sacred ceremony.`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Namakarana — South India (Karnataka, Tamil Nadu)</h3>
          <p className="text-sm text-muted leading-7 mb-2">Performed on the 11th or 12th day or a chosen auspicious date. Includes a cradle ceremony and often a homam.</p>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`[Father's Name] & [Mother's Name]
cordially invite you to the

Namakarana
of their child

[Baby's Name]

Muhurtam: [Date] | [Time]
Venue: [Address, City]

Homam — [Time] | Name Announcement — [Time] | Lunch — [Time]
RSVP: [Phone Number]`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Cradle Ceremony — English term for South Indian tradition</h3>
          <p className="text-sm text-muted leading-7 mb-2">Used by Tamil and Telugu families when writing English invitations. The baby is placed in a decorated cradle and the name is formally announced.</p>
          <WordingCopyCard ctaHref="/namakaran-invitation">{`[Father's Name] and [Mother's Name]
joyfully invite you to the

Cradle Ceremony & Baby Naming
of their little one

[Baby's Name]

Date: [Date] at [Time]
Venue: [Venue, Address, City]

The naming ceremony will be followed by lunch.
Your blessings are the greatest gift for our child.`}</WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">Annaprashan combined with naming — Bengali tradition</h3>
          <p className="text-sm text-muted leading-7 mb-2">Bengali families sometimes combine the Namkaran (naming) with Annaprashan (first rice-feeding ceremony) on an auspicious day.</p>

          <WordingCopyCard ctaHref="/namakaran-invitation">{`[Father's Name] & [Mother's Name]
invite you to celebrate two milestones in one joyful day:

Namkaran — The Naming Ceremony
Annaprashan — The First Rice Ceremony

of their beloved child [Baby's Name]

Date: [Date] at [Time]
Venue: [Venue, Address, City]

Puja — [Time] | Naming — [Time] | Annaprashan — [Time] | Lunch — [Time]
Please join us for these precious first blessings.`}</WordingCopyCard>
        </div>
      </section>

      {/* MidPage CTA after Regional Traditions */}
      <div className="px-5">
        <div className="mx-auto max-w-3xl">
          <MidPageCTA
            headline="Those [Digital Invite Link] placeholders? Make them real — with baby photos and a Map pin."
            body="Every message above has a [Digital Invite Link] slot. That link is a ShareInvite page with your baby's photos, Google Maps, ceremony schedule, and a blessing wall where guests leave wishes. Free to create."
            features={['Baby photo gallery on the invite', 'Google Maps tap-to-navigate', 'Guest blessing wall', 'WhatsApp-ready link']}
            ctaHref="/create?template=namakaran"
            ctaText="Create Namakaran Invite Free →"
          />
        </div>
      </div>

      {/* Section 4: What to Include */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">What to Include in a Namakaran Invitation</h2>
          <div className="space-y-4">
            {[
              {
                title: "Baby's name — reveal or keep as surprise",
                body: "Decide before writing whether you want the name in the invitation. Revealing it adds warmth and lets guests address the baby. Keeping it a secret builds anticipation. If surprising guests, write 'We are naming our little one' and skip the name.",
              },
              {
                title: "Parents' names and family names",
                body: "State both parents' full names and, in traditional invitations, include the paternal grandparents' names. This is standard for formal Namakaran invitations and shows respect for the extended family.",
              },
              {
                title: 'Ceremony time and muhurat',
                body: 'State the auspicious muhurat time clearly. Guests need to know when the puja begins — not just when to arrive. If there is a specific time when the name will be announced, mention that too so family members know when the key moment happens.',
              },
              {
                title: 'Venue with Google Maps',
                body: 'Many naming ceremonies are held at home or at a relative\'s house in an area guests may not know. Include the full address with a landmark, and if sending a digital invite, embed a Google Maps link. It prevents day-of confusion.',
              },
              {
                title: 'Ceremony programme',
                body: 'A brief schedule — Puja, Name Announcement, First Photos, Lunch — helps guests plan their day and ensures no one misses the key moments. Even a two-line programme is better than none.',
              },
              {
                title: "Baby's first photos gallery",
                body: "A digital Namakaran invitation lets you include the baby's photos — the hospital homecoming, first days at home — so guests see the little one before they arrive. This makes the invite feel warm and personal.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <h3 className="font-heading text-base text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-7">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Timing Guide */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-6 sm:text-4xl">Namakaran Invitation Timing Guide</h2>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-5">
            <div>
              <h3 className="font-heading text-base text-ink mb-2">When to hold the ceremony</h3>
              <p className="text-sm text-muted leading-7">
                The traditional date is day 11 or 12 after birth. Many families choose the 28th day, while others select an auspicious date from the Hindu calendar that works for the family — sometimes a month or two after birth. There is no single correct date; the muhurat selected by the family pandit takes precedence over the exact day number.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">Send invitations 7–10 days before</h3>
              <p className="text-sm text-muted leading-7">
                For local guests, 7–10 days is sufficient. If the ceremony is on a weekday, give 10–12 days so guests can plan around work commitments. For a ceremony held at a venue that requires booking, longer notice is appreciated.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">For outstation family — 14+ days ahead</h3>
              <p className="text-sm text-muted leading-7">
                Grandparents and close relatives who need to travel from another city should receive the invitation at least 2 weeks before so they can book travel. Call them personally in addition to sending the message — the personal call matters for close family.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-2">WhatsApp reminder 1 day before</h3>
              <p className="text-sm text-muted leading-7">
                Send a short reminder the day before: ceremony date, time, and the venue address or digital invite link. It takes 30 seconds and significantly reduces last-minute &ldquo;what time is it?&rdquo; messages. Re-sharing the digital invite link is the easiest way to do this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside a digital Namakaran invitation */}
      <section className="px-5 py-16 border-b border-border bg-[#FFF9F2]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">What a Digital Namakaran Invitation Includes</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            A WhatsApp message tells guests the date and time. A ShareInvite digital invitation tells them everything — and lets them respond with a blessing.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(217,164,65,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-base text-ink mb-2">Baby Photo Gallery</h3>
              <p className="text-sm text-muted leading-6">Upload hospital homecoming photos and first-days-at-home pictures. Guests see the baby before they arrive — the invite feels personal and warm, not just a date reminder.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(217,164,65,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
              <h3 className="font-heading text-base text-ink mb-2">Background Music</h3>
              <p className="text-sm text-muted leading-6">Add a bhajan, a lullaby, or a family favourite that plays softly when guests open the invite. Small detail, big impression — nobody expects music in an invitation link.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(217,164,65,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-base text-ink mb-2">Venue Map</h3>
              <p className="text-sm text-muted leading-6">Google Maps pinned to the exact gate or entrance. Guests tap once and navigate directly — especially useful for ceremonies at home addresses in residential areas where guests might get confused.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(217,164,65,0.4)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(217,164,65,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="font-heading text-base text-ink mb-2">Guest Wishes — The Blessing Wall</h3>
              <p className="text-sm text-muted leading-6">
                This is what makes ShareInvite different. When a guest opens the invitation, they can leave a blessing for the baby directly on the page. You see all wishes in your dashboard. Approve the ones you love, and they appear on the invitation for every other guest to see — &ldquo;Sharma Family: Wishing Baby Aryan a blessed and joyful life.&rdquo;
              </p>
              <p className="text-xs text-muted mt-2">Family members who can&apos;t attend can still be part of the celebration with a blessing that stays on the invite permanently.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/create?template=namakaran"
              className="gold-button inline-flex items-center rounded-full px-10 py-4 text-base font-semibold"
            >
              Create Your Namakaran Invitation Free →
            </Link>
            <p className="mt-3 text-xs text-muted">No credit card required · WhatsApp-ready link in minutes</p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-5 py-14 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-2xl text-ink mb-6">More Namakaran Invitation Resources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/namakaran-invitation" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create free Namakaran invitation →
            </Link>
            <Link href="/templates" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Browse digital invitation templates →
            </Link>
            <Link href="/blog/naming-ceremony-invitation-message-samples" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Naming ceremony invitation message samples →
            </Link>
            <Link href="/blog/namakaran-invitation-ideas-for-baby-boys" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Namakaran invitation ideas for baby boys →
            </Link>
            <Link href="/create?template=namakaran" className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors">
              Create Namakaran invitation free →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Namakaran Invitation Wording — FAQ</h2>
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
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Create Your Namakaran Invitation</h2>
          <p className="text-muted text-sm mb-7">Free to create · Baby photos, ceremony schedule &amp; map · WhatsApp-ready</p>
          <Link href="/create" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Create Namakaran Invite Free →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
