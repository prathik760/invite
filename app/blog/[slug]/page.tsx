import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import { blogDrafts, categorySlug, findBlogPost, type BlogCategory } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return blogDrafts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = findBlogPost(params.slug)
  if (!post) return {}
  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    title: `${post.title} | ShareInvite Blog`,
    description: post.description,
    keywords: [post.keyword, 'digital invitation', 'online invitation maker', 'whatsapp invitation card', 'online RSVP'],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      siteName: SITE_NAME,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

function articleJsonLd(post: NonNullable<ReturnType<typeof findBlogPost>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'ShareInvite',
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'ShareInvite',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo1.png') },
    },
    image: DEFAULT_OG_IMAGE,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}

type ContentBlock = {
  intro: string
  sections: string[]
  checklist: string[]
  links: Array<{ label: string; href: string }>
}

function buildPostContent(
  keyword: string,
  category: BlogCategory,
): ContentBlock {
  const shared = {
    links: {
      Wedding: [
        { label: 'Digital wedding invitations', href: '/wedding-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Online RSVP platform', href: '/online-rsvp' },
        { label: 'Engagement invitation cards', href: '/engagement-invitations' },
      ],
      Engagement: [
        { label: 'Engagement invitation cards', href: '/engagement-invitations' },
        { label: 'Digital wedding invitations', href: '/wedding-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Browse invitation templates', href: '/templates' },
      ],
      Birthday: [
        { label: 'Birthday invitation maker', href: '/birthday-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Digital invitation templates', href: '/templates' },
        { label: 'Online RSVP', href: '/online-rsvp' },
      ],
      Housewarming: [
        { label: 'Griha Pravesh invitations', href: '/griha-pravesh-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Online RSVP platform', href: '/online-rsvp' },
        { label: 'Browse invitation templates', href: '/templates' },
      ],
      'Baby Shower': [
        { label: 'Baby shower invitations', href: '/baby-shower-invitations' },
        { label: 'Naming ceremony invitations', href: '/naming-ceremony-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Digital invitation templates', href: '/templates' },
      ],
      'Invitation Ideas': [
        { label: 'Wedding invitations', href: '/wedding-invitations' },
        { label: 'Birthday invitation maker', href: '/birthday-invitations' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Online RSVP', href: '/online-rsvp' },
      ],
      'Wedding Trends': [
        { label: 'Wedding invitation templates', href: '/wedding-invitations' },
        { label: 'Browse all templates', href: '/templates' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Engagement invitations', href: '/engagement-invitations' },
      ],
      'Digital Invitations': [
        { label: 'Digital invitation templates', href: '/templates' },
        { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
        { label: 'Online RSVP platform', href: '/online-rsvp' },
        { label: 'Wedding invitations', href: '/wedding-invitations' },
      ],
    } as Record<BlogCategory, Array<{ label: string; href: string }>>,
  }

  switch (category) {
    case 'Wedding':
      return {
        intro: `Planning a wedding invitation is one of the first things families discuss after finalising the date. The right format matters because it sets expectations for dress code, ceremony timing, venue access, and the mood of the event. This guide covers what you need to know about ${keyword} — from choosing the right format to sharing it effectively on WhatsApp.`,
        sections: [
          `Traditional printed wedding cards in India are beautiful but limited. They carry a fixed amount of information, cannot be updated after printing, and require physical distribution that takes time, money, and coordination. A digital wedding invitation solves all three problems. Guests receive one shareable link they can open on any device directly from WhatsApp.`,
          `A complete digital wedding invitation should include: bride and groom names in a clear hierarchy, the wedding date and muhurat time, venue name, full address, Google Maps link, ceremony schedule from baraat to dinner, dress code, a personal message from the hosts, and optionally a photo gallery and background music.`,
          `For Indian weddings specifically, the ceremony schedule is critical. Families share a single link across multiple groups — the bride's family, groom's family, friends, office colleagues, and distant relatives. Each group may attend different parts of the ceremony. A digital invitation that lists all events with timings (Sangeet, Mehendi, Baraat, Varmala, Pheras, Reception) dramatically reduces follow-up messages.`,
          `A key question families face when exploring ${keyword} is whether to use a printed card alongside a digital one or replace it entirely. Most families today use both: a beautifully printed card for close family and elders, and a digital link for the broader guest list. The ShareInvite link works as the primary communication channel for venue details, timings, and RSVP.`,
          `From a practical standpoint, digital wedding invitations save time at every step. There is no waiting for printing, no courier coordination, and no editing cost for late changes to venue or timing. A host can update the invitation page anytime, and the same link stays accessible to all guests without needing to be resent.`,
          `The rise of ${keyword} reflects a broader shift in how Indian families communicate around celebrations. WhatsApp has become the primary invitation channel, and a live link works far better than a PDF or an image because it loads instantly, displays all information in a readable format, and can include interactive elements like Google Maps and guest wishes.`,
        ],
        checklist: [
          'Include bride and groom names in display typography above the fold.',
          'List the full wedding schedule with event timings.',
          'Add a Google Maps link and the full venue address.',
          'Include dress code and a personal family message.',
          'Test the invite link on both Android and iOS before sharing.',
          'Enable guest wishes for a more personal experience.',
        ],
        links: shared.links[category],
      }

    case 'Engagement':
      return {
        intro: `An engagement invitation announces the official beginning of a couple's journey — and it deserves more than a quick image shared on WhatsApp. This guide covers ${keyword}: what to include, how to present it, and how to share it so guests feel genuinely excited about attending.`,
        sections: [
          `The ring ceremony, also known as roka, mangni, or engagement, is often the first public event where both families come together. This makes the invitation significant not just for logistics but for tone. A well-designed digital engagement invitation communicates the formality and joy of the occasion.`,
          `Key elements in an engagement invitation include: the couple's names with their family references, the exact date, time, and venue, a ceremony schedule, dress code for both families, and a warm personal message. For destinations or evening venues, a Google Maps link is far more useful than an address alone.`,
          `WhatsApp is the primary channel for sharing ${keyword} in India. The link preview — what appears when someone forwards the invite in a chat — needs to be clean, readable, and immediately recognisable as an invitation. ShareInvite generates proper Open Graph metadata so the invitation looks polished in WhatsApp previews even before guests open it.`,
          `A growing number of families are creating engagement invitation pages that also serve as a RSVP hub. Rather than following up with individual messages to confirm attendance, hosts publish a link and let guests indicate their response through the invitation page. This approach is especially effective for events with a mix of local and out-of-town guests.`,
          `For ${keyword} content specifically, consider including a brief story about the couple if the occasion calls for it. Not all families do this for an engagement, but for romantic ceremonies with a close guest list, a short note about how the couple met adds emotional depth to an otherwise practical event page.`,
          `Hosts who have used a digital engagement invitation consistently report that it reduces the most common friction point: guests asking for venue details in the days leading up to the event. A link they can save and revisit solves this problem without any additional effort from the host.`,
        ],
        checklist: [
          'Include both family references for the couple.',
          'Add ring exchange ceremony timing clearly.',
          'Include dress code for both sides.',
          'Add a venue map link for guests travelling from outside the city.',
          'Test the WhatsApp preview of the link before sharing.',
          'Mention any pre-ceremony details such as welcome drinks or rituals.',
        ],
        links: shared.links[category],
      }

    case 'Birthday':
      return {
        intro: `Birthday celebrations in India range from intimate family gatherings to elaborate themed parties. The invitation needs to match that energy — it sets expectations for dress code, schedule, and the overall vibe of the event. This guide covers everything you need to know about ${keyword} for Indian celebrations.`,
        sections: [
          `A birthday invitation does more than announce a date and venue. It creates anticipation. The right design, a well-chosen color palette, and a well-worded message tell guests what kind of celebration to expect. A Bollywood-themed party communicates differently than a minimal rooftop dinner, and the invitation should reflect that distinction.`,
          `The essentials of a birthday invitation include: celebrant name and age (if appropriate), date, time, venue, theme or dress code, schedule of events (if any), and a RSVP or wishes prompt for guests. For milestone birthdays — 1st, 21st, 50th, 60th — adding a personal note or gallery makes the invitation feel special and commemorative.`,
          `WhatsApp birthday invitations work particularly well because guests can respond instantly, share within their groups, and revisit the invitation when looking for the venue on the day of the party. A link stays accessible unlike a downloaded image that gets buried in the camera roll.`,
          `For ${keyword}, mobile-first design is what matters most. Birthday guests check their phones for venue details and directions right before the party starts. An invitation that loads fast, displays the address clearly, and has a one-tap map button reduces confusion at the venue significantly.`,
          `Milestone birthday invitations deserve special treatment. For a 60th birthday, the invitation might include a gallery of photos through the decades. For a child's first birthday, the design should be festive and colourful. ShareInvite templates can be customized for these different contexts using the gallery, message, and theme fields.`,
          `Hosts who add a guest wishes feature to birthday invitations find that it creates a beautiful archive of messages. Guests can leave birthday greetings on the invitation page, which the host can approve and display. For elderly relatives who cannot attend physically, this feature lets them still participate meaningfully in the celebration.`,
        ],
        checklist: [
          'Include celebrant name and age if celebrating a milestone.',
          'Add party theme and dress code if applicable.',
          'Include the full schedule for events like dinner, cake cutting, and DJ.',
          'Add a Google Maps link for easier navigation.',
          'Enable guest wishes on the invitation page.',
          'Test the invite on both WhatsApp and direct browser access.',
        ],
        links: shared.links[category],
      }

    case 'Housewarming':
      return {
        intro: `Griha Pravesh is one of the most significant milestones for an Indian family. It is the formal entry into a new home, accompanied by pooja, family rituals, and shared meals. This guide covers ${keyword} — how to create an invitation that carries the right level of dignity, detail, and practical information for guests.`,
        sections: [
          `A Griha Pravesh invitation needs to communicate more than most event invitations. The muhurat time is critical — guests need to arrive on schedule for the pooja. The new address needs to be completely clear — many guests may not know the locality. The schedule of pooja, lunch, and expected departure time helps guests plan their day properly.`,
          `For ${keyword}, the tone should be warm and auspicious. Traditional language — blessings, new beginnings, divine grace — fits the occasion better than casual copy. The design should reflect the nature of the celebration: bright colours, floral motifs, or earthy tones depending on the family's taste.`,
          `A digital Griha Pravesh invitation has a practical advantage that printed cards cannot match: it can include a Google Maps pin for the exact apartment or street entrance. For new construction areas or upcoming residential projects, this is invaluable. Guests in cities like Bangalore, Hyderabad, or Pune often deal with complex layouts where a pin is far clearer than a text address.`,
          `Many families also use the Griha Pravesh invitation to share the pooja schedule so that family members who cannot attend physically can follow along. ShareInvite pages work well for this purpose — the invitation remains accessible as a URL that can be revisited any time during the event day.`,
          `The timing for ${keyword} matters significantly. Invitations should go out at least 10 days before the ceremony, with a reminder shared 2 days before. A digital invitation makes this easy because reminders can simply be a re-forward of the same link — no reprinting or new image design needed.`,
          `Including notes for parking, apartment entry, or nearby landmarks is especially useful for urban housewarming events. A text field in the invitation for such notes means guests arrive without confusion, which reduces the last-minute calls to the host asking for directions.`,
        ],
        checklist: [
          'Include muhurat time prominently near the top of the invite.',
          'Add the full pooja schedule from Ganesh Pooja to lunch.',
          'Provide a Google Maps pin for the exact address.',
          'Include notes on parking or apartment entry if needed.',
          'Add the host family name and a personal blessing message.',
          'Share a reminder link 2 days before the ceremony.',
        ],
        links: shared.links[category],
      }

    case 'Baby Shower':
      return {
        intro: `Baby showers, Godh Bharai, and Seemantham ceremonies are celebrations of new life and family blessings. The invitation for these events carries a softness and warmth that reflects the occasion. This guide covers ${keyword} — what to include, how to design it, and how to share it effectively with family and friends.`,
        sections: [
          `Godh Bharai is celebrated primarily among women in the family and close friends, which means the invitation list is usually personal and intimate. A digital invitation makes it easy to share within these smaller, trust-based groups on WhatsApp without the effort of printed cards or multiple rounds of image editing.`,
          `For ${keyword}, the invitation should include the mother-to-be's name, the date and time, venue, theme or dress code, schedule of events (rituals, blessings, lunch or tea), and a warm family message. Whether to include the baby's gender or keep it a surprise until the ceremony is a personal choice the host can reflect in the invitation copy.`,
          `A digital baby shower invitation can also serve as a guest wishes and blessings page. Family members who cannot attend physically can still leave messages and blessings on the invitation page. Hosts can approve these messages and display them, creating a beautiful record of the occasion that the mother can revisit.`,
          `The demand for ${keyword} has grown as families look for ways to include guests from multiple cities. A link shared on a family WhatsApp group reaches everyone simultaneously — from the nearest aunt to a cousin in another country — making the invitation feel inclusive while keeping the effort minimal for the host.`,
          `Design plays a significant emotional role in baby shower invitations. Soft pastels, floral accents, and gentle typography signal the occasion before a guest reads a single word. ShareInvite templates are designed to carry this visual warmth while still displaying all the practical event information guests need.`,
          `Families hosting a Seemantham or other regional baby shower ceremony may want to include specific ritual details: which rites happen, expected timing, and whether guests should bring any specific items. These details are easy to add in the schedule field of the invitation, ensuring guests feel informed and included in the ceremony.`,
        ],
        checklist: [
          'Use soft, warm design tones appropriate for the ceremony.',
          'Include the mother-to-be\'s name prominently.',
          'List all ceremony events with timings.',
          'Include dress code or theme if applicable.',
          'Enable the guest wishes feature for blessings from remote family.',
          'Add specific ritual or ceremony details relevant to the occasion.',
        ],
        links: shared.links[category],
      }

    case 'Invitation Ideas':
      return {
        intro: `Every family celebration is different, and the best invitation ideas come from understanding what the event means to the hosts. This guide covers ${keyword} — what to include, what to avoid, and how to make an invitation feel personal rather than formulaic.`,
        sections: [
          `The most common mistake with event invitations is over-complicating the design while under-delivering on content. Guests need clarity: when, where, what to wear, and how to respond. Everything else is secondary. The best invitations balance visual beauty with practical utility, giving guests exactly what they need without unnecessary friction.`,
          `For Indian family events, there are consistent elements that guests look for. The schedule matters, especially for multi-event days. The venue address and map link matter, especially in cities where guests travel from different neighbourhoods. The dress code matters, especially when there are traditional expectations around attire.`,
          `${keyword} trends strongly toward digital formats, and for good reason. A well-designed invitation link shared on WhatsApp reaches all guests simultaneously, can be updated if venue details change, and works on any device without an app install. Hosts save on printing, courier, and coordination costs while delivering a more useful experience to guests.`,
          `Personalisation is what separates a memorable invitation from a generic one. A short note about the occasion, a meaningful photo, a music track that fits the mood — these small additions make guests feel genuinely invited rather than administratively notified. ShareInvite supports all of these through its gallery, music, and message fields.`,
          `Timing is an often-overlooked element of invitation strategy. Sharing an invitation too early risks being forgotten; too late creates stress for guests who need to make travel plans. For most Indian events, 10–14 days in advance is the sweet spot, with a reminder link reshared 2 days before the event.`,
          `Internal structure matters for digital invitations just as much as design. A guest who opens the link should find the event name and key details (date, time, venue) above the fold on mobile — within the first scroll. Supporting details like schedule, dress code, and message can follow below.`,
        ],
        checklist: [
          'Lead with the event name and key names in large, readable text.',
          'Include date, time, and venue clearly above the fold.',
          'Add a Google Maps link for every event with a venue.',
          'Include dress code and RSVP instructions.',
          'Preview the invitation on a phone before sharing.',
          'Reshare the link as a reminder 2 days before the event.',
        ],
        links: shared.links[category],
      }

    case 'Wedding Trends':
      return {
        intro: `Wedding invitation trends in India change with each season — colours, typography, format, and content style all evolve as couples look for ways to stand out. This guide explores where ${keyword} fits into the current landscape, and why digital formats are increasingly becoming the primary choice for modern Indian weddings.`,
        sections: [
          `The shift toward digital wedding invitations is not just practical. It reflects a broader trend toward experiences over objects. A beautifully designed invite page with music, a live countdown, and a photo gallery offers something a printed card cannot — it creates emotion and anticipation in the days leading up to the wedding.`,
          `Design trends for ${keyword} currently favour: clean typography over decorative overload, dark cinematic designs for younger couples, traditional gold and red for family-oriented ceremonies, and minimal ivory-and-gold for modern secular weddings. Templates that reflect regional culture — South Indian, Rajasthani, Bengali — are in consistent demand.`,
          `WhatsApp sharing has changed how invitations propagate. A visually strong invite gets forwarded beyond the original recipient list. Guests screenshot and share to their own networks. This organic amplification rewards high-quality invite designs, making aesthetic choices increasingly important from a reach perspective.`,
          `For wedding professionals — planners, photographers, venue teams — understanding ${keyword} creates new service opportunities. Recommending a digital invitation tool becomes part of the initial client conversation. ShareInvite is designed for this referral model, with a simple creation flow that clients can manage independently after being introduced to it.`,
          `Personalisation is the defining characteristic of the best invitation designs in current trends. Generic templates that feel mass-produced are losing ground to designs that feel curated — with couple photos, a short love story, a meaningful music track, and a custom URL. These elements together create an invitation that feels like the couple rather than a category.`,
          `Looking ahead, the next evolution in ${keyword} will involve more integration between the invitation and the event itself. RSVP tracking, guest messaging, and post-event photo sharing from the same URL are already features that forward-thinking hosts expect. ShareInvite is built with this full-lifecycle view in mind.`,
        ],
        checklist: [
          'Choose a template that matches the wedding aesthetic and region.',
          'Upload pre-wedding photos to the gallery section.',
          'Include a background music track that matches the mood.',
          'Use a custom URL for a more professional feel.',
          'Share the invite on Instagram story as well as WhatsApp.',
          'Add a live countdown to build excitement before the wedding.',
        ],
        links: shared.links[category],
      }

    case 'Digital Invitations':
    default:
      return {
        intro: `Digital invitations have moved from a niche alternative to the standard format for family events across India. This guide examines the practical landscape of ${keyword} — what works, what to avoid, and what the best examples have in common when it comes to mobile sharing and RSVP-ready guest experiences.`,
        sections: [
          `The argument for digital invitations is now settled for most Indian families. Lower cost, instant delivery, easy updating, and WhatsApp-native sharing are clear advantages. What has changed is the quality bar — guests now expect digital invitations to feel as premium as the events themselves.`,
          `For ${keyword}, a few principles consistently produce strong results. Mobile-first design matters most — virtually all guests open invitations on phones. Fast loading (under 2 seconds) prevents drop-offs before guests read anything. Clear typographic hierarchy ensures the most important information — names, date, venue — is immediately readable without scrolling.`,
          `RSVP features have become an expected part of digital invitations. Hosts want to know who is attending, and guests want to confirm without sending a separate message. ShareInvite includes guest wish collection and RSVP-oriented interaction on every published invitation page, removing the need for hosts to follow up manually.`,
          `From a guest experience perspective, the key metric for any digital invitation is whether a guest can find the venue in under 10 seconds after opening the link. This sounds simple but many invitations fail this test — venue details buried below a large hero image, or a text address without a Maps link. Designing around this test produces significantly better guest satisfaction.`,
          `The technical side of ${keyword} matters for sharing quality. Open Graph metadata determines what the invitation preview looks like when someone forwards it on WhatsApp — the image, title, and description that appear in the chat. ShareInvite generates correct, invitation-specific OG metadata for every published invite, ensuring the preview looks professional.`,
          `For hosts managing larger events, digital invitations provide a data advantage that printed cards cannot. Viewing the number of times a link has been opened, tracking which guests have left wishes, and monitoring RSVP responses all give hosts better visibility into their event than any traditional invitation format allows.`,
        ],
        checklist: [
          'Test the invitation URL on both iOS and Android.',
          'Verify that the WhatsApp link preview looks correct and uses the right image.',
          'Confirm the Google Maps button opens correctly for the venue.',
          'Enable guest wishes for a more interactive experience.',
          'Check page loading speed before sharing to large groups.',
          'Reshare the link as a reminder 2 days before the event.',
        ],
        links: shared.links['Digital Invitations'],
      }
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = findBlogPost(params.slug)
  if (!post) notFound()

  const content = buildPostContent(post.keyword, post.category)

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <JsonLd id="article-jsonld" data={articleJsonLd(post)} />
      <JsonLd
        id="blog-post-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
          { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
        ])}
      />
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" /></Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-14">
        <Link href={`/blog/category/${categorySlug(post.category)}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
          {post.category}
        </Link>
        <h1 className="mt-5 font-display text-4xl font-normal leading-tight text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{post.description}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted">
          <span>ShareInvite</span>
          <span>·</span>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>

        {/* Intro paragraph */}
        <p className="mt-10 text-base leading-8 text-muted">{content.intro}</p>

        {/* Body sections */}
        <div className="mt-7 space-y-7 text-base leading-8 text-muted">
          {content.sections.map((section, i) => (
            <p key={i}>{section}</p>
          ))}
        </div>

        {/* Quick checklist */}
        <div className="mt-10 rounded-lg border border-border bg-white p-6">
          <h2 className="font-heading text-xl text-ink">Quick checklist</h2>
          <ul className="mt-4 space-y-3">
            {content.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#2F766D]" style={{ background: 'rgba(47,118,109,0.1)' }}>
                  <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Related links */}
        <h2 className="mt-10 font-heading text-xl text-ink">Related guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-border bg-white p-4 text-sm font-semibold text-ink transition-colors hover:text-accent-strong"
            >
              {link.label} →
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#E8DCCD] bg-[#FFF9F2] p-7 text-center">
          <p className="font-heading text-lg text-ink">Ready to create your invitation?</p>
          <p className="mt-2 text-sm text-muted">Choose a template, fill in your details, and share on WhatsApp in under 5 minutes.</p>
          <Link href="/create" className="gold-button mt-5 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
            Create Free Invitation →
          </Link>
        </div>
      </article>
      <SiteFooter />
      <StickyCTA />
    </main>
  )
}
