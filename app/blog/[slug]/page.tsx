import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'
import { blogDrafts, categorySlug, findBlogPost, type BlogCategory } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'
import { blogArticles } from '@/content/blog-articles'

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
    robots: { index: true, follow: true },
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

type ContentSection = { heading: string; body: string }
type FaqItem = { q: string; a: string }

type ContentBlock = {
  intro: string
  sections: ContentSection[]
  checklist: string[]
  faq: FaqItem[]
  links: Array<{ label: string; href: string }>
}

function buildPostContent(keyword: string, category: BlogCategory): ContentBlock {
  const links: Record<BlogCategory, Array<{ label: string; href: string }>> = {
    Wedding: [
      { label: 'Digital wedding invitations', href: '/wedding-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP platform', href: '/online-rsvp' },
      { label: 'Engagement invitation cards', href: '/engagement-invitation' },
    ],
    Engagement: [
      { label: 'Engagement invitation cards', href: '/engagement-invitation' },
      { label: 'Digital wedding invitations', href: '/wedding-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Browse invitation templates', href: '/templates' },
    ],
    Birthday: [
      { label: 'Birthday invitation maker', href: '/birthday-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Online RSVP', href: '/online-rsvp' },
    ],
    Housewarming: [
      { label: 'Griha Pravesh invitations', href: '/griha-pravesh-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP platform', href: '/online-rsvp' },
      { label: 'Browse invitation templates', href: '/templates' },
    ],
    'Baby Shower': [
      { label: 'Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Griha Pravesh invitation', href: '/griha-pravesh-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Digital invitation templates', href: '/templates' },
    ],
    'Invitation Ideas': [
      { label: 'Wedding invitations', href: '/wedding-invitation' },
      { label: 'Birthday invitation maker', href: '/birthday-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP', href: '/online-rsvp' },
    ],
    'Wedding Trends': [
      { label: 'Wedding invitation templates', href: '/wedding-invitation' },
      { label: 'Browse all templates', href: '/templates' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Engagement invitations', href: '/engagement-invitation' },
    ],
    'Digital Invitations': [
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP platform', href: '/online-rsvp' },
      { label: 'Wedding invitations', href: '/wedding-invitation' },
    ],
  }

  switch (category) {
    case 'Wedding':
      return {
        intro: `Planning a wedding invitation is one of the first decisions families make after finalising the date. The format matters — it sets expectations for dress code, ceremony timing, and the overall mood of the event. This guide covers ${keyword}: from choosing the right format to sharing it effectively on WhatsApp.`,
        sections: [
          {
            heading: 'Why digital wedding invitations work better in India',
            body: `Traditional printed wedding cards are beautiful but limited. They carry a fixed amount of information, cannot be updated after printing, and require physical distribution that takes time and coordination. A digital wedding invitation solves all three problems. Guests receive one shareable link they can open on any device directly from WhatsApp — and the host can update it anytime without reprinting.`,
          },
          {
            heading: 'What to include in a complete wedding invitation',
            body: `A complete digital wedding invitation should include: bride and groom names in a clear hierarchy, wedding date and muhurat time, venue name, full address, Google Maps link, ceremony schedule from baraat to dinner, dress code, a personal message from the hosts, and optionally a photo gallery and background music. Missing any of these creates follow-up messages from guests.`,
          },
          {
            heading: 'How to share across multiple family groups',
            body: `For Indian weddings, the ceremony schedule is critical. Families share a single link across multiple WhatsApp groups — the bride's family, groom's family, friends, office colleagues, and distant relatives. Each group may attend different parts of the ceremony. A digital invitation that lists all events (Sangeet, Mehendi, Baraat, Varmala, Pheras, Reception) with timings dramatically reduces follow-up messages.`,
          },
          {
            heading: `Printed cards vs digital: what Indian families actually do`,
            body: `Most families today use both: a beautifully printed card for close family and elders, and a digital link for the broader guest list. The ShareInvite link works as the primary communication channel for venue details, timings, and RSVP — while the printed card carries emotional and ceremonial weight for the inner circle.`,
          },
          {
            heading: 'Last-minute changes are easy with a digital invite',
            body: `A host can update the invitation page anytime — a change to the venue, a shift in ceremony timing, or an update to the dress code — and the same link stays accessible to all guests without needing to be resent. For a ${keyword}, this flexibility alone saves significant stress in the days before the wedding.`,
          },
        ],
        checklist: [
          'Include bride and groom names in display typography above the fold.',
          'List the full wedding schedule with all event timings.',
          'Add a Google Maps link and the complete venue address.',
          'Include dress code and a personal family message.',
          'Test the invite link on both Android and iOS before sharing.',
          'Enable guest wishes for a more personal experience.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: `Go to shareinvite.in/create, choose a wedding template, fill in the couple's names, date, muhurat time, venue address, and ceremony schedule. Your invitation is live with a WhatsApp-ready link in under 5 minutes. No design skills needed.` },
          { q: 'How far in advance should I send a digital wedding invitation in India?', a: 'Send the digital wedding invitation 14–21 days before the wedding date, with a WhatsApp reminder 2–3 days before. For destination weddings, send 4–6 weeks in advance so guests can make travel arrangements.' },
          { q: 'Can guests RSVP through the digital wedding invitation?', a: 'Yes. ShareInvite allows guests to leave wishes and respond on the invitation page itself, so you can track attendance without sending individual follow-up messages to each guest.' },
          { q: 'Should I still send printed wedding cards if I have a digital invitation?', a: 'Most Indian families use both — a printed card for close family, grandparents, and elders as a mark of respect, and a digital link for the broader guest list, colleagues, and friends. The digital invite serves as the practical reference guests use for venue and timing details.' },
        ],
        links: links[category],
      }

    case 'Engagement':
      return {
        intro: `An engagement invitation announces the official beginning of a couple's journey together. It deserves more than a quick image on WhatsApp. This guide covers ${keyword}: what to include, how to present it, and how to share it so guests feel genuinely welcomed.`,
        sections: [
          {
            heading: 'What makes an engagement invitation different',
            body: `The ring ceremony — known as Roka, Mangni, Sagai, or Nishchayathartham depending on region — is often the first public event where both families come together formally. This makes the invitation significant not just for logistics but for tone. A well-designed digital engagement invitation communicates the formality and joy of the occasion before guests even arrive.`,
          },
          {
            heading: 'What to include in an engagement invitation',
            body: `Key elements include: the couple's names with both family references, the exact date, time, and venue, ceremony schedule, dress code for both families, and a warm personal message. For venues in busy city areas, a Google Maps link is far more useful than a text address alone — most guests will navigate from the invitation on the day.`,
          },
          {
            heading: 'How WhatsApp sharing works for engagement invites',
            body: `WhatsApp is the primary sharing channel for ${keyword} in India. The link preview — the image, title, and snippet that appear in chat — needs to look polished. ShareInvite generates correct Open Graph metadata for every invitation so the preview looks professional even before guests open it.`,
          },
          {
            heading: 'Using the invite as an RSVP hub',
            body: `A growing number of families use the engagement invitation page as a RSVP hub. Rather than following up individually with each guest, hosts share a link and let guests confirm attendance through the page. This approach works especially well for events with a mix of local and out-of-town guests who need lead time to travel.`,
          },
          {
            heading: 'Regional ceremony names across India',
            body: `The engagement ceremony has different names — Roka, Mangni, Sagai in North India; Nishchayathartham or Nischitartham in South India; Gol Dhana in Gujarat; Misri in some communities. ShareInvite lets you use the term your family recognises, making the invitation feel authentic to your tradition rather than generic.`,
          },
        ],
        checklist: [
          'Include both family references for the couple.',
          'Add ring exchange ceremony timing clearly at the top.',
          'Include dress code for both sides of the family.',
          'Add a venue map link for guests travelling from outside the city.',
          'Test the WhatsApp link preview before sharing to groups.',
          'Mention any pre-ceremony details such as welcome drinks or rituals.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose an engagement template, fill in the couple\'s names, ceremony date, venue, and schedule. Your digital engagement invitation is ready to share on WhatsApp in under 5 minutes.' },
          { q: 'What is the difference between Roka, Sagai, and Mangni invitations?', a: 'Roka is the initial family agreement ceremony common in North Indian families. Sagai and Mangni refer to the formal ring exchange event. Both deserve a proper invitation — Roka is usually more intimate (close family only), while Sagai is the broader celebration.' },
          { q: 'How early should I send an engagement invitation?', a: 'Send the engagement invitation 10–14 days before the ceremony for local guests. If family is travelling from other cities, send at least 3 weeks in advance so they can plan travel and accommodation.' },
        ],
        links: links[category],
      }

    case 'Birthday':
      return {
        intro: `Birthday celebrations in India range from intimate family gatherings to elaborate themed parties. The invitation sets the tone — it tells guests what to wear, when to arrive, and what kind of celebration to expect. This guide covers ${keyword} for Indian families, from wording to WhatsApp sharing.`,
        sections: [
          {
            heading: 'What a birthday invitation needs to communicate',
            body: `A birthday invitation does more than announce a date and venue. It creates anticipation. The right design, colour palette, and message tell guests what kind of celebration to expect. A Bollywood-themed party communicates differently than a minimal rooftop dinner, and the invitation should reflect that distinction clearly before guests even read the details.`,
          },
          {
            heading: 'What to include in a birthday invitation',
            body: `Essentials include: celebrant name and age (if appropriate), date, time, venue, theme or dress code, schedule of events, and a wishes prompt for guests. For milestone birthdays — 1st, 21st, 50th, 60th — adding a personal note or gallery makes the invitation feel commemorative rather than just logistical.`,
          },
          {
            heading: 'Why WhatsApp birthday invitations work better than images',
            body: `WhatsApp birthday invitations shared as a link work better than image files because guests can respond instantly, share within their groups, and revisit the invitation for venue details on the day of the party. A link stays accessible unlike a downloaded image that gets buried in the camera roll between then and the event.`,
          },
          {
            heading: 'Mobile-first matters for birthday party invites',
            body: `For ${keyword}, mobile-first design is essential. Birthday guests check their phones for venue details and directions right before the party starts. An invitation that loads fast, shows the address clearly, and has a one-tap Maps button reduces confusion — and last-minute calls to the host — significantly.`,
          },
          {
            heading: 'Milestone birthday invitations deserve special treatment',
            body: `A 60th birthday invitation might include a gallery of photos through the decades. A child's first birthday calls for festive, colourful design. A 21st birthday for something modern and personal. ShareInvite templates can be customised for each of these contexts through the gallery, message, theme, and music fields.`,
          },
        ],
        checklist: [
          'Include celebrant name and age if celebrating a milestone.',
          'Add party theme and dress code if applicable.',
          'Include the full schedule — arrival, cake cutting, dinner, DJ.',
          'Add a Google Maps link for easier navigation.',
          'Enable guest wishes on the invitation page.',
          'Test the invite on both WhatsApp and direct browser access.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a birthday template, fill in the celebrant\'s name, party date, venue, and schedule. Your digital birthday invitation is ready to share on WhatsApp in minutes. Free to start, no app needed for guests.' },
          { q: 'What is the best way to share a birthday invitation on WhatsApp in India?', a: 'Create a digital invitation link on ShareInvite and forward it to your guest groups on WhatsApp. The link generates a clean preview card with the invitation details. Guests open it in their phone browser — no app download required.' },
          { q: 'What should I write in a first birthday invitation?', a: 'Include: baby\'s name and "First Birthday" heading, date and time, venue with address, schedule (arrival, cake cutting, meal), a warm message from parents, and a photo of the baby. Keep the tone warm and joyful — this is as much an occasion for parents as for the child.' },
        ],
        links: links[category],
      }

    case 'Housewarming':
      return {
        intro: `Griha Pravesh is one of the most significant milestones for an Indian family — the formal entry into a new home with pooja, rituals, and a shared meal. This guide covers ${keyword}: what to include, how to word it, and how to share it so guests have everything they need.`,
        sections: [
          {
            heading: 'What a Griha Pravesh invitation must include',
            body: `A Griha Pravesh invitation needs to communicate more than most event invitations. The muhurat time is critical — guests need to arrive on schedule for the pooja. The new address must be completely clear because many guests may not know the locality. The schedule of pooja, lunch, and expected departure time helps guests plan their whole day correctly.`,
          },
          {
            heading: 'Wording and tone for a housewarming invitation',
            body: `For ${keyword}, the tone should be warm and auspicious. Traditional language — blessings, new beginnings, divine grace — fits the occasion better than casual copy. The design should reflect the celebration: bright colours, floral motifs, or earthy tones depending on the family's tradition and taste.`,
          },
          {
            heading: 'Why Google Maps matters for housewarming invitations',
            body: `A digital Griha Pravesh invitation can include a Google Maps pin for the exact apartment entrance or street-level location. For new construction areas, upcoming residential layouts, or gated communities with complex entry points, this is invaluable. Guests in cities like Bengaluru, Hyderabad, or Pune often deal with multiple towers and gates where a Maps pin is far clearer than a text address.`,
          },
          {
            heading: 'Sharing the pooja schedule with family',
            body: `Many families use the Griha Pravesh invitation to share the pooja schedule so family members who cannot attend physically can follow along. A digital page with the ceremony programme is accessible throughout the event day — guests can check the schedule without calling the host mid-ceremony.`,
          },
          {
            heading: 'When to send and how to remind guests',
            body: `Send the ${keyword} at least 10 days before the ceremony, with a reminder reshared 2 days before. A digital invitation makes reminders effortless — it is simply a re-forward of the same link. No reprinting, no new image file, no new design required. The host can also add parking or entry notes at any point before the event.`,
          },
        ],
        checklist: [
          'Include muhurat time prominently near the top of the invite.',
          'Add the full pooja schedule from Ganesh Pooja to lunch.',
          'Provide a Google Maps pin for the exact address.',
          'Include notes on parking or apartment entry if needed.',
          'Add the host family name and a personal blessing message.',
          'Share a reminder link 2 days before the ceremony.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a housewarming template, fill in the muhurat time, new address, pooja schedule, and a family message. Your Griha Pravesh invitation is ready to share on WhatsApp in under 5 minutes.' },
          { q: 'What is the difference between Griha Pravesh and Gruhapravesham?', a: 'Both refer to the same ceremony — the auspicious entry into a new home. Griha Pravesh is the North Indian / Sanskrit term. Gruhapravesham is the South Indian (Tamil/Telugu) variant. Ghar Pravesh is the common Hindi usage. ShareInvite lets you use whichever term your family tradition follows.' },
          { q: 'How far in advance should I send a Griha Pravesh invitation?', a: 'Send at least 10–14 days before the ceremony so guests can plan around the muhurat time. Share a reminder on WhatsApp 2 days before. If family is travelling from another city, send 3 weeks in advance.' },
        ],
        links: links[category],
      }

    case 'Baby Shower':
      return {
        intro: `Baby showers, Godh Bharai, and Seemantham ceremonies celebrate new life and family blessings. The invitation sets the emotional tone — warmth, joy, and anticipation. This guide covers ${keyword}: what to include, how to word it, and how to share it with family across India.`,
        sections: [
          {
            heading: 'Who typically attends a Godh Bharai or baby shower',
            body: `Godh Bharai is celebrated primarily among women in the family and close friends — the guest list is usually personal and intimate. A digital invitation makes it easy to share within these close WhatsApp groups without the effort of printed cards. For Seemantham and other regional ceremonies, the guest list often extends to extended family across multiple cities.`,
          },
          {
            heading: 'What to include in a baby shower invitation',
            body: `Include: the mother-to-be's name, date and time, venue, theme or dress code, schedule of events (rituals, blessings, lunch or tea), and a warm family message. Whether to include the baby's gender or keep it a surprise is a personal choice — reflect that decision in how you word the invitation.`,
          },
          {
            heading: 'Collecting family blessings through the invitation',
            body: `A digital baby shower invitation can serve as a blessings page too. Family members who cannot attend can leave messages and wishes on the invitation page — hosts can approve and display them. For a ${keyword} shared across a large joint family, this feature creates a beautiful record the mother can revisit long after the ceremony.`,
          },
          {
            heading: 'Including guests from other cities',
            body: `The demand for ${keyword} has grown as families look to include guests from multiple cities. A link shared on a family WhatsApp group reaches everyone simultaneously — from the nearest aunt to a cousin in another country — making the invitation feel inclusive while keeping the host's effort minimal.`,
          },
          {
            heading: 'Design and tone for a baby shower invitation',
            body: `Soft pastels, floral accents, and gentle typography signal the occasion before a guest reads a single word. The design should feel warm rather than formal. ShareInvite templates carry this visual warmth while still displaying all the practical event information guests need — venue, timings, schedule, and map.`,
          },
        ],
        checklist: [
          'Use soft, warm design tones appropriate for the ceremony.',
          'Include the mother-to-be\'s name prominently at the top.',
          'List all ceremony events with timings.',
          'Include dress code or colour theme if applicable.',
          'Enable the guest blessings feature for remote family.',
          'Add specific ritual details relevant to the ceremony tradition.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a baby shower or housewarming template, fill in the mother-to-be\'s name, ceremony date, venue, and schedule. Your invitation is ready to share on WhatsApp in under 5 minutes. Free to start.' },
          { q: 'What is the difference between Godh Bharai and Seemantham?', a: 'Godh Bharai is the Hindi-belt term for the baby shower ceremony held in the 7th or 9th month of pregnancy. Seemantham is the South Indian equivalent, particularly common in Tamil Nadu and Andhra Pradesh. Both celebrate the mother-to-be with gifts, blessings, and rituals — the core invitation details are the same.' },
          { q: 'How many days before a Godh Bharai should I send the invitation?', a: 'Send invitations 7–10 days before the ceremony. For family members travelling from another city, send 2–3 weeks in advance. A digital invitation lets you resend a reminder easily by re-forwarding the same WhatsApp link.' },
        ],
        links: links[category],
      }

    case 'Invitation Ideas':
      return {
        intro: `Every family celebration is different, and the best invitation ideas come from understanding what the event means to the hosts and guests. This guide covers ${keyword}: what to include, what to avoid, and how to make an invitation feel personal rather than formulaic.`,
        sections: [
          {
            heading: 'The most common invitation mistake Indian families make',
            body: `The most common mistake is over-complicating the design while under-delivering on content. Guests need clarity: when, where, what to wear, and how to respond. Everything else is secondary. The best invitations balance visual warmth with practical utility — giving guests exactly what they need without friction.`,
          },
          {
            heading: 'What Indian guests always look for in an invitation',
            body: `For Indian family events, there are consistent elements guests look for. The schedule matters, especially for multi-event days. The venue address and map link matter, especially in cities where guests travel from different neighbourhoods. The dress code matters when there are traditional expectations around attire. Missing any of these generates a stream of follow-up messages to the host.`,
          },
          {
            heading: 'Why digital invitations are now the default for Indian events',
            body: `${keyword} trends strongly toward digital formats. A well-designed invitation link shared on WhatsApp reaches all guests simultaneously, can be updated if details change, and works on any device without an app install. Hosts save on printing, courier, and coordination costs while delivering a more useful experience.`,
          },
          {
            heading: 'How personalisation makes the difference',
            body: `Personalisation is what separates a memorable invitation from a generic one. A short note about the occasion, a meaningful photo, a music track that fits the mood — these small additions make guests feel genuinely invited rather than administratively notified. ShareInvite supports all of these through gallery, music, and message fields.`,
          },
          {
            heading: 'When to send and when to remind',
            body: `Timing is an often-overlooked element. Too early risks being forgotten; too late creates stress for guests who need to arrange travel. For most Indian events, 10–14 days is the sweet spot, with a reminder link reshared 2 days before the event. With a digital invitation, the reminder is as simple as re-forwarding the same WhatsApp link.`,
          },
        ],
        checklist: [
          'Lead with the event name and key names in large, readable text.',
          'Include date, time, and venue clearly above the fold.',
          'Add a Google Maps link for every event with a venue.',
          'Include dress code and response instructions.',
          'Preview the invitation on a phone before sharing.',
          'Reshare the link as a reminder 2 days before the event.',
        ],
        faq: [
          { q: `What are the best ${keyword} for Indian families?`, a: 'The best digital invitation ideas for Indian families include: a live countdown to the event, a photo gallery of the hosts or celebrant, a WhatsApp-native link that opens instantly in the phone browser, a one-tap Google Maps button, background music that fits the occasion, and a guest wishes section for RSVP and messages.' },
          { q: 'What should I write in an invitation message for a family event?', a: 'Keep the message warm and personal. Name the event, mention the date and venue, include a personal line from the host, and invite the guest specifically. Avoid generic wording — the message should feel like it was written for the reader, not copied from a template.' },
          { q: 'How do I make an invitation stand out on WhatsApp?', a: 'A digital invitation link generates a WhatsApp preview card with an image, title, and description when forwarded. Use a clean, high-contrast invitation image and a specific title. Avoid forwarding image files — a link stays accessible and clickable long after the original message is buried in the chat.' },
        ],
        links: links[category],
      }

    case 'Wedding Trends':
      return {
        intro: `Wedding invitation trends in India change with each season — colours, typography, format, and content style all evolve as couples look for ways to stand out. This guide explores ${keyword} and why digital formats are increasingly the primary choice for modern Indian weddings.`,
        sections: [
          {
            heading: 'The shift from printed cards to digital experiences',
            body: `The shift toward digital wedding invitations is not just practical — it reflects a broader trend toward experiences over objects. A beautifully designed invite page with music, a live countdown, and a photo gallery offers something a printed card cannot: it creates emotion and anticipation in the days leading up to the wedding.`,
          },
          {
            heading: 'Current design trends in Indian wedding invitations',
            body: `Design trends for ${keyword} currently favour: clean typography over decorative overload, dark cinematic designs for younger couples, traditional gold and red for family-oriented ceremonies, and minimal ivory-and-gold for modern secular weddings. Templates that reflect regional culture — South Indian floral patterns, Rajasthani mirror motifs, Bengali kalka prints — are in consistent demand.`,
          },
          {
            heading: 'How WhatsApp sharing changes invitation design',
            body: `WhatsApp sharing has changed how invitations propagate. A visually strong invite gets forwarded beyond the original recipient list — guests share it to their own networks. This organic amplification rewards high-quality designs, making aesthetic choices increasingly important from a reach perspective. The WhatsApp preview card is the first impression the invitation makes.`,
          },
          {
            heading: 'What couples are personalising in 2025 and 2026',
            body: `Personalisation is the defining characteristic of the best invitation designs in current trends. Generic templates are losing ground to designs that feel curated — with couple photos, a short love story, a meaningful music track, and a custom URL. These elements together create an invitation that feels like the couple rather than a product category.`,
          },
          {
            heading: 'The future: invitation as event hub',
            body: `The next evolution in ${keyword} involves more integration between the invitation and the event itself. RSVP tracking, guest messaging, live ceremony updates, and post-event photo sharing from the same URL are features that forward-thinking hosts already expect. ShareInvite is built with this full-lifecycle view in mind.`,
          },
        ],
        checklist: [
          'Choose a template that matches the wedding aesthetic and region.',
          'Upload pre-wedding photos to the gallery section.',
          'Include a background music track that matches the mood.',
          'Use a custom short URL for a more personal feel.',
          'Share the invite link on Instagram stories as well as WhatsApp.',
          'Add a live countdown to build excitement before the wedding.',
        ],
        faq: [
          { q: `What are the current trends in ${keyword}?`, a: 'In 2025–26, Indian wedding invitation trends favour: digital-first formats shared on WhatsApp, dark cinematic designs for younger couples, traditional gold-on-ivory for family ceremonies, regional cultural motifs (South Indian, Rajasthani, Bengali), couple photo galleries, and background music tracks personalised to the couple.' },
          { q: 'Are digital wedding invitations replacing printed cards in India?', a: 'Most modern Indian families use both — a beautifully printed card for close family and elders, and a digital link for the broader guest list. The digital invitation has become the primary practical reference: guests use it for venue navigation, timings, and RSVP. The printed card carries ceremonial and emotional weight.' },
          { q: 'What makes a wedding invitation look premium and modern?', a: 'Premium digital wedding invitations combine: clean display typography, couple photos in a gallery, background music, a custom short URL (e.g. shareinvite.in/ananya-vihaan), a live countdown to the wedding, and a guest wishes section. The WhatsApp preview card — the thumbnail image and title that appears when forwarded — is the first impression and should be visually strong.' },
        ],
        links: links[category],
      }

    case 'Digital Invitations':
    default:
      return {
        intro: `Digital invitations have become the standard format for family events across India. This guide examines ${keyword}: what works, what to avoid, and what the best examples have in common for mobile sharing and guest experience.`,
        sections: [
          {
            heading: 'Why digital invitations have become the default in India',
            body: `The case for digital invitations is settled for most Indian families. Lower cost, instant delivery, easy updating, and WhatsApp-native sharing are clear advantages. What has changed is the quality bar — guests now expect digital invitations to feel as premium as the events themselves, not like a hastily sent image.`,
          },
          {
            heading: 'Principles that make a digital invitation work',
            body: `For ${keyword}, a few principles consistently produce strong results. Mobile-first design matters most — virtually all guests open invitations on phones. Fast loading prevents drop-offs before guests read anything. Clear typographic hierarchy ensures the most important details — names, date, venue — are readable without scrolling.`,
          },
          {
            heading: 'RSVP and guest management through the invitation',
            body: `RSVP features have become an expected part of digital invitations. Hosts want to know who is attending, and guests want to confirm without sending a separate WhatsApp message. ShareInvite includes guest wish collection and RSVP interaction on every invitation page, removing the need for hosts to follow up manually with each guest.`,
          },
          {
            heading: 'The 10-second test every invitation should pass',
            body: `The key metric for any digital invitation is whether a guest can find the venue in under 10 seconds after opening the link. Many invitations fail this test — venue details buried below a large hero image, or a text address with no Maps link. Designing around this test produces significantly better guest satisfaction on the day.`,
          },
          {
            heading: 'Technical quality: Open Graph and WhatsApp previews',
            body: `The technical side of ${keyword} matters for sharing quality. Open Graph metadata determines what the invitation preview looks like when forwarded on WhatsApp — the image, title, and description that appear in chat. ShareInvite generates correct, invitation-specific OG metadata for every published invite, ensuring the preview looks professional before guests even open it.`,
          },
        ],
        checklist: [
          'Test the invitation URL on both iOS and Android.',
          'Verify the WhatsApp link preview uses the correct image and title.',
          'Confirm the Google Maps button opens correctly for the venue.',
          'Enable guest wishes for a more interactive experience.',
          'Check page loading speed before sharing to large groups.',
          'Reshare the link as a reminder 2 days before the event.',
        ],
        faq: [
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a template for your event type, fill in the names, date, venue, and schedule. Your invitation is live with a WhatsApp-ready link in under 5 minutes. Guests open it in their phone browser — no app download needed.' },
          { q: 'Are digital invitations free in India?', a: 'ShareInvite is free to start. You can create a digital invitation, add all details, and share the link on WhatsApp at no cost. Premium features like custom short URLs, priority support, and advanced customisation are available on paid plans.' },
          { q: 'Can I update a digital invitation after sending it?', a: 'Yes — this is one of the biggest advantages over printed cards. You can update venue details, change a timing, correct a spelling, or add new information at any time. The same link continues to work for all guests who already received it, showing the updated information automatically.' },
        ],
        links: links['Digital Invitations'],
      }
  }
}

const CATEGORY_TEMPLATE: Record<string, string> = {
  'Wedding': 'elegant-wedding',
  'Wedding Trends': 'elegant-wedding',
  'Engagement': 'indian-engagement',
  'Birthday': 'indian-birthday',
  'Housewarming': 'griha-pravesh',
  'Namakaran': 'namakaran',
  'Invitation Ideas': 'namakaran',
  'Baby Shower': 'namakaran',
  'Digital Invitations': 'elegant-wedding',
  'Anniversary': 'anniversary',
}

export default function BlogPostPage({ params }: Props) {
  const post = findBlogPost(params.slug)
  if (!post) notFound()

  const createHref = `/create?template=${CATEGORY_TEMPLATE[post.category] ?? 'elegant-wedding'}`
  const content = blogArticles[post.slug] ?? buildPostContent(post.keyword, post.category)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <JsonLd id="article-jsonld" data={articleJsonLd(post)} />
      <JsonLd id="blog-post-faq-jsonld" data={faqJsonLd} />
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
          <Link href="/" className="flex items-center gap-2.5">
            <Image priority src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href={createHref} className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Invitation</Link>
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

        {/* Body sections with H2 headings */}
        <div className="mt-8 space-y-8">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-heading text-xl text-ink">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-muted">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Inline CTA — mid-article conversion nudge */}
        <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-[#D9A441]/35 bg-[#FFFBF5] px-6 py-5">
          <div className="min-w-0">
            <p className="font-heading text-base text-ink">Create your invitation in 5 minutes</p>
            <p className="mt-1 text-xs text-muted">Free to start · WhatsApp-ready link · No app for guests</p>
          </div>
          <Link href={createHref} className="gold-button shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold">
            Start Free →
          </Link>
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

        {/* FAQ section */}
        <div className="mt-10">
          <h2 className="font-heading text-xl text-ink">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {content.faq.map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-white p-5">
                <p className="font-heading text-sm text-ink">{item.q}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.a}</p>
              </div>
            ))}
          </div>
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

        {/* Wording guides */}
        {(() => {
          const wordingGuides: Record<string, { label: string; href: string }[]> = {
            Wedding: [
              { label: 'Wedding invitation wording guide', href: '/wedding-invitation-wording' },
              { label: 'Create free wedding invitation', href: '/wedding-invitation' },
            ],
            Engagement: [
              { label: 'Engagement invitation wording guide', href: '/engagement-invitation-wording' },
              { label: 'Create free engagement invitation', href: '/engagement-invitation' },
            ],
            Birthday: [
              { label: 'Birthday invitation wording guide', href: '/birthday-invitation-wording' },
              { label: 'Create free birthday invitation', href: '/birthday-invitation' },
            ],
            Housewarming: [
              { label: 'Griha Pravesh invitation wording guide', href: '/griha-pravesh-invitation-wording' },
              { label: 'Create free Griha Pravesh invitation', href: '/griha-pravesh-invitation' },
            ],
            'Baby Shower': [
              { label: 'Baby shower invitation wording guide', href: '/baby-shower-invitation-wording' },
              { label: 'Create free digital invitation', href: '/create' },
            ],
            'Invitation Ideas': [
              { label: 'Namakaran invitation wording guide', href: '/namakaran-invitation-wording' },
              { label: 'Browse invitation templates', href: '/templates' },
            ],
            'Wedding Trends': [
              { label: 'Wedding invitation wording guide', href: '/wedding-invitation-wording' },
              { label: 'Browse wedding templates', href: '/templates' },
            ],
            'Digital Invitations': [
              { label: 'Free digital invitation maker', href: '/digital-invitation' },
              { label: 'Browse invitation templates', href: '/templates' },
            ],
          }
          const guides = wordingGuides[post.category] ?? []
          if (guides.length === 0) return null
          return (
            <div className="mt-8 flex flex-wrap gap-3">
              {guides.map(link => (
                <Link key={link.href} href={link.href} className="rounded-full border border-[#D9A441]/40 bg-[#FFFBF5] px-4 py-2 text-sm font-semibold text-accent-strong hover:bg-[#FFF4E5] transition-colors">
                  {link.label} →
                </Link>
              ))}
            </div>
          )
        })()}

        {/* Related articles */}
        {(() => {
          const relatedPosts = blogDrafts
            .filter(p => p.category === post.category && p.slug !== post.slug)
            .slice(0, 3)
          if (relatedPosts.length === 0) return null
          return (
            <div className="mt-12 border-t border-border pt-10">
              <h2 className="font-heading text-xl text-ink mb-6">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedPosts.map(rp => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="rounded-xl border border-border bg-white p-5 hover:shadow-sm transition-shadow">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-strong mb-2">{rp.category}</p>
                    <p className="font-heading text-base text-ink leading-snug">{rp.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#E8DCCD] bg-[#FFF9F2] p-7 text-center">
          <p className="font-heading text-lg text-ink">Ready to create your invitation?</p>
          <p className="mt-2 text-sm text-muted">Choose a template, fill in your details, and share on WhatsApp in under 5 minutes.</p>
          <Link href={createHref} className="gold-button mt-5 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold">
            Create Free Invitation →
          </Link>
        </div>
      </article>
      <SiteFooter />
      <StickyCTA />
    </main>
  )
}
