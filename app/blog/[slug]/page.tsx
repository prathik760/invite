import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import StickyCTA from '@/components/seo/StickyCTA'
import TrackedLink from '@/components/ui/TrackedLink'
import { templatePrice } from '@/lib/plans'
import { priceRangeSentence } from '@/lib/priceCopy'
import SiteFooter from '@/components/landing/SiteFooter'
import { blogDrafts, categorySlug, findBlogPost, type BlogCategory } from '@/content/blog'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, SITE_NAME, slugify, templateSeoSlug } from '@/lib/seo'
import { TEMPLATES } from '@/modules/templates/data'
import { blogArticles, hasFullArticle } from '@/content/blog-articles'
import Image from 'next/image'
import PreviewButton from '@/components/catalog/PreviewButton'
import FAQAccordion from '@/components/landing/FAQAccordion'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import BlogCard, { blogArt } from '@/components/blog/BlogCard'
import CtaBand from '@/components/brand/CtaBand'
import { Breadcrumbs } from '@/components/brand/PageHero'
import { LogoMark } from '@/components/brand/Logo'
import { CheckIcon, EyeIcon } from '@/components/ui/Icons'
import { displayName, is3D } from '@/lib/catalog'
import { templateImage } from '@/lib/templateMedia'

type Props = { params: { slug: string } }

// Related cards sit three across from md up, inside the 1088px shell.
const RELATED_CARD_SIZES = '(min-width: 1088px) 340px, (min-width: 768px) 33vw, 100vw'

export function generateStaticParams() {
  return blogDrafts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = findBlogPost(params.slug)
  if (!post) return {}
  const url = absoluteUrl(`/blog/${post.slug}`)
  // Post photos in public/blog are 1200x750; the brand card is 1200x630.
  const shareImage = post.image ? absoluteUrl(post.image) : DEFAULT_OG_IMAGE
  const shareSize = post.image ? { width: 1200, height: 750 } : { width: 1200, height: 630 }

  return {
    title: { absolute: post.metaTitle ?? `${post.title} | ShareInvite Blog` },
    description: post.description,
    // Posts still running on generated filler are kept out of the index until
    // real copy exists. `follow` is retained so they keep passing equity to the
    // template and landing pages they link to.
    robots: hasFullArticle(post.slug)
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      siteName: SITE_NAME,
      url,
      images: [{ url: shareImage, ...shareSize, alt: post.title }],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [shareImage],
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
      logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/mark-512.png') },
    },
    image: post.image ? absoluteUrl(post.image) : DEFAULT_OG_IMAGE,
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
            body: `Every guest gets the same complete page — venue, ceremony timings, dress code and a tap-to-open map — and can reopen it from the chat whenever they need it. For a ${keyword}, that alone saves a great many phone calls in the days before the wedding.`,
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
          { q: 'Can guests RSVP through the digital wedding invitation?', a: 'Guests can leave a wish on the invitation page itself, and every message appears in your dashboard. There is no formal attendance tracker — for an exact headcount, ask guests to confirm on WhatsApp. The Luxury Wedding design also includes an RSVP section.' },
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
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a birthday template, fill in the celebrant\'s name, party date, venue, and schedule. Your digital birthday invitation is ready to share on WhatsApp in minutes — preview it before you pay, and guests need no app.' },
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
            body: `A digital baby shower invitation can serve as a blessings page too. Family members who cannot attend can leave messages and wishes on the invitation page, and they appear there straight away for everyone else to read. For a ${keyword} shared across a large joint family, this feature creates a beautiful record the mother can revisit long after the ceremony.`,
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
          { q: `How do I create a ${keyword}?`, a: 'Go to shareinvite.in/create, choose a baby shower or housewarming template, fill in the mother-to-be\'s name, ceremony date, venue, and schedule. Your invitation is ready to share on WhatsApp in under 5 minutes, and you can preview it before you pay.' },
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
            body: `${keyword} trends strongly toward digital formats. A well-designed invitation link shared on WhatsApp reaches all guests simultaneously, carries every detail on one page, and works on any device without an app install. Hosts save on printing, courier, and coordination costs while delivering a more useful experience.`,
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
            body: `The next evolution in ${keyword} involves more integration between the invitation and the event itself. Guest messages on the invitation page, clear directions and schedules, and a single link that works for every guest are what hosts increasingly expect.`,
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
          { q: 'How much does a digital invitation cost in India?', a: `On ShareInvite you pay once for the design you publish. ${priceRangeSentence()} You can choose a template, add all your details and preview the finished invitation before you pay, and there is no subscription.` },
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
  'Baby Shower': 'baby-shower',
  'Digital Invitations': 'elegant-wedding',
  'Anniversary': 'anniversary',
}

/**
 * Bold spans inside an article line.
 *
 * Bodies in content/blog-articles.ts are written in a light markdown. Plain
 * string segments are returned as-is — React only needs keys on elements.
 */
function renderInline(text: string) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

/**
 * Render one article section body.
 *
 * Every body was previously dropped into a single <p> as raw text. Blank lines
 * collapsed to spaces and the markdown was printed literally, so all 33
 * hand-written articles rendered as one run-on paragraph containing visible
 * asterisks — and Google saw no paragraph or list structure to read at all.
 *
 * Blank lines separate blocks, a block of "- " lines becomes a real <ul>, and
 * single newlines inside a block stay as line breaks (the copy-paste message
 * samples rely on a bold label sitting directly above its quote).
 */
/**
 * A copy-paste sample: a bold label line, then the message in quotes (one or
 * more lines). Returns null for any other block.
 */
function parseSample(lines: string[]): { label: string; message: string } | null {
  if (lines.length < 2) return null
  const label = lines[0].match(/^\*\*(.+?)\*\*$/)
  const first = lines[1]
  const last = lines[lines.length - 1]
  if (!label || !/^["“]/.test(first) || !/["”]$/.test(last)) return null
  const message = lines.slice(1).join('\n').replace(/^["“]/, '').replace(/["”]$/, '').trim()
  return message ? { label: label[1].replace(/:$/, ''), message } : null
}

function ArticleBody({ body, templateId, createHref }: { body: string; templateId: string; createHref: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)

        // Samples get the same copy card as the wording guides, so a reader
        // who copies one is offered the words in a design, and the copy is
        // counted (wording_copy).
        const sample = parseSample(lines)
        if (sample) {
          return (
            <div key={i}>
              <p className="font-semibold text-charcoal">{sample.label}</p>
              <WordingCopyCard templateId={templateId} ctaHref={createHref}>{sample.message}</WordingCopyCard>
            </div>
          )
        }

        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {renderInline(line)}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}

// Posts whose category default is the wrong design. Unlike BLOG_TEMPLATE these
// only steer the CTA and the copy panel; they do not add the live-demo block.
const SLUG_TEMPLATE: Record<string, string> = {
  'first-birthday-invitation-ideas-for-indian-families': 'first-birthday',
  'silver-anniversary-invitation-ideas': 'anniversary',
  'golden-anniversary-invitation-wording': 'anniversary',
}

// Blog posts that showcase a specific template → enables the "View Live Demo" popup
const BLOG_TEMPLATE: Record<string, string> = {
  '3d-surprise-journey-the-interactive-digital-gift-you-send-online': 'surprise-journey',
  '3d-love-card-online-send-a-romantic-animated-card-in-minutes': 'greeting-love',
  'valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp': 'greeting-valentine',
  'anniversary-card-online-create-a-3d-animated-anniversary-card': 'greeting-anniversary',
  'digital-proposal-card-a-3d-will-you-marry-me-card-that-says-yes': 'greeting-propose',
  'promise-day-card-online-send-a-heartfelt-3d-promise': 'greeting-promise',
  'sorry-card-online-say-sorry-with-a-heartfelt-animated-card': 'greeting-sorry',
  'congratulations-card-online-send-an-animated-congrats-card': 'greeting-congratulations',
  'festival-wishes-card-online-diwali-and-festival-greetings': 'greeting-festival',
  'family-wishes-card-online-a-heartfelt-digital-card-for-family': 'greeting-family',
  'friendship-day-card-online-send-a-3d-card-to-your-best-friends': 'greeting-friendship',
  'raksha-bandhan-invitation-card-online-free-digital-rakhi-template': 'rakshabandhan',
  'ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template': 'ganesh-chaturthi',
}

export default function BlogPostPage({ params }: Props) {
  const post = findBlogPost(params.slug)
  if (!post) notFound()

  const demoTemplateId = BLOG_TEMPLATE[post.slug]
  const ctaTemplateId = demoTemplateId ?? SLUG_TEMPLATE[post.slug] ?? CATEGORY_TEMPLATE[post.category] ?? 'elegant-wedding'
  const createHref = `/create?template=${ctaTemplateId}&src=blog`
  const ctaPrice = templatePrice(ctaTemplateId)
  const ctaTemplate = TEMPLATES.find((t) => t.id === ctaTemplateId)
  const ctaTemplateHref = `/templates/${templateSeoSlug(ctaTemplateId)}`
  // "Free to start" was shown on articles whose CTA points at a paid
  // template. State the real one-time price instead — a reader who learns the
  // price here and still clicks is a far better lead than one who discovers it
  // at step 5 of the builder.
  const ctaPriceLine = `Preview before you pay · ₹${ctaPrice.toLocaleString('en-IN')} one-time to publish · No app for guests`
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

  // Honest per-design highlights for the inline offer: the 3D greetings have
  // no venue or countdown, and RSVP is not a general feature.
  const ctaFeatures = is3D(ctaTemplateId)
    ? ['3D animation', 'Your photo memories', 'A personal message', 'Background music', 'One WhatsApp link']
    : ['Photo gallery', 'Live countdown', 'Google Maps directions', 'Background music', 'Guest wishes', 'One WhatsApp link']
  const ctaName = ctaTemplate ? displayName(ctaTemplate.name) : 'your design'
  const sections = content.sections.map((section) => ({ ...section, id: slugify(section.heading) }))
  const relatedPosts = blogDrafts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)
  const wordingGuides: Record<string, { label: string; href: string }[]> = {
    Wedding: [
      { label: 'Wedding invitation wording guide', href: '/wedding-invitation-wording' },
      { label: 'Digital wedding invitations', href: '/wedding-invitation' },
    ],
    Engagement: [
      { label: 'Engagement invitation wording guide', href: '/engagement-invitation-wording' },
      { label: 'Digital engagement invitations', href: '/engagement-invitation' },
    ],
    Birthday: [
      { label: 'Birthday invitation wording guide', href: '/birthday-invitation-wording' },
      { label: 'Digital birthday invitations', href: '/birthday-invitation' },
    ],
    Housewarming: [
      { label: 'Griha Pravesh invitation wording guide', href: '/griha-pravesh-invitation-wording' },
      { label: 'Digital Griha Pravesh invitations', href: '/griha-pravesh-invitation' },
    ],
    'Baby Shower': [
      { label: 'Baby shower invitation wording guide', href: '/blog/baby-shower-invitation-wording-ideas-for-india' },
      { label: 'Godh Bharai & baby shower design', href: '/create?template=baby-shower' },
    ],
    'Invitation Ideas': [
      { label: 'Naming ceremony invitation messages', href: '/blog/naming-ceremony-invitation-message-samples' },
      { label: 'Browse invitation designs', href: '/templates' },
    ],
    'Wedding Trends': [
      { label: 'Wedding invitation wording guide', href: '/wedding-invitation-wording' },
      { label: 'Browse wedding designs', href: '/templates' },
    ],
    'Digital Invitations': [
      { label: 'Digital invitation maker', href: '/digital-invitation' },
      { label: 'Browse invitation designs', href: '/templates' },
    ],
  }
  // Never link a post to itself (the baby shower and naming posts are now the guides).
  const guides = (wordingGuides[post.category] ?? []).filter((g) => g.href !== `/blog/${post.slug}`)

  return (
    <main className="min-h-screen bg-champagne pb-28 text-charcoal">
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
      <SiteHeader createHref={createHref} />

      {/* ─── ARTICLE HEADER ─── */}
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_0%,rgba(232,200,102,0.18),transparent_70%)]" />
        <div className="shell relative pb-10 pt-8 sm:pt-10">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }, { name: post.category, href: `/blog/category/${categorySlug(post.category)}` }]} />
          <div className="mt-8 max-w-3xl">
            <Link href={`/blog/category/${categorySlug(post.category)}`} className="pill enter-0 border-transparent bg-peach text-burnished-deep">
              {post.category}
            </Link>
            <h1 className="t-h1 enter-0 mt-5">{post.title}</h1>
            <p className="t-lede enter-1 mt-5">{post.description}</p>
            <div className="enter-2 mt-6 flex items-center gap-3 text-[0.85rem] text-muted">
              <LogoMark className="h-8 w-8" />
              <span className="font-semibold text-charcoal">ShareInvite</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </div>
          <div className="enter-4 relative mt-10 aspect-[21/8] overflow-hidden rounded-[2rem] border border-line bg-peach">
            <Image src={blogArt(post)} alt="" fill priority sizes="(min-width: 1088px) 1040px, 100vw" className="object-cover" />
          </div>
        </div>
      </header>

      {/* ─── BODY + SIDEBAR ─── */}
      <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <article className="min-w-0 max-w-[46rem]">
          {/* Live demo showcase — see the actual template before reading */}
          {demoTemplateId && (
            <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-line bg-paper p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="t-h3">See this design live</p>
                <p className="mt-1 text-[0.9rem] text-charcoal/70">Open the real, interactive design — exactly what your recipient sees.</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <PreviewButton templateId={demoTemplateId} source="blog_demo" className="btn-outline inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[0.9rem] font-semibold">
                  <EyeIcon className="h-4 w-4" /> Live preview
                </PreviewButton>
                <Link href={createHref} className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-[0.9rem] font-semibold">
                  Use this design
                </Link>
              </div>
            </div>
          )}

          <div className="prose-brand">
            <p className="text-[1.1rem]">{content.intro}</p>
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id} className="scroll-mt-28">{section.heading}</h2>
                <ArticleBody body={section.body} templateId={ctaTemplateId} createHref={createHref} />
              </section>
            ))}
          </div>

          {/* Inline CTA — the bridge from "I found my wording" to "I have an
              invitation". Names what the reader gets and what it costs, so the
              click is informed rather than a surprise later in the funnel. */}
          <aside className="relative mt-12 overflow-hidden rounded-[2rem] bg-emerald p-7 text-paper shadow-lift sm:p-9" data-reveal>
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-soft/10 blur-2xl" />
            <p className="relative text-[0.75rem] font-bold uppercase tracking-[0.2em] text-gold-soft">Found the words you want?</p>
            <p className="t-h3 relative mt-2">Turn them into a live invitation with the {ctaName} design</p>
            <p className="relative mt-2 text-[0.95rem] leading-7 text-paper/75">Your message, photos and event details on one link you send to a WhatsApp group.</p>
            <ul className="relative mt-5 grid gap-x-5 gap-y-2 text-[0.9rem] text-paper/85 sm:grid-cols-2">
              {ctaFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2"><CheckIcon className="h-3.5 w-3.5 text-gold-soft" />{f}</li>
              ))}
            </ul>
            <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <TrackedLink
                href={createHref}
                location="blog_inline_cta"
                meta={{ template_id: ctaTemplateId, price: ctaPrice, page_type: 'blog_post', blog_slug: post.slug }}
                className="btn-gold inline-flex shrink-0 justify-center rounded-full px-6 py-3.5 text-[0.95rem] font-semibold"
              >
                Create my invitation
              </TrackedLink>
              <TrackedLink
                href={ctaTemplateHref}
                location="blog_inline_template_link"
                meta={{ template_id: ctaTemplateId, price: ctaPrice, page_type: 'blog_post', blog_slug: post.slug }}
                className="inline-flex shrink-0 justify-center rounded-full border border-paper/25 px-6 py-3.5 text-[0.95rem] font-semibold text-paper/90 hover:bg-paper/10"
              >
                See the design first
              </TrackedLink>
            </div>
            <p className="relative mt-3 text-[0.8rem] text-paper/60">{ctaPriceLine}</p>
          </aside>

          {/* Quick checklist */}
          <div className="card mt-12 p-6 sm:p-8" data-reveal>
            <h2 className="t-h3">Quick checklist</h2>
            <ul className="mt-5 space-y-3">
              {content.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.95rem] leading-7 text-charcoal/80">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald text-paper">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-14">
            <h2 className="t-h2 mb-6">Frequently asked questions</h2>
            <FAQAccordion faqs={content.faq.map((item) => ({ question: item.q, answer: item.a }))} />
          </div>

          {/* Related links */}
          <div className="mt-14">
            <p className="eyebrow">Related guides</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[...content.links, ...guides.filter((g) => !content.links.some((l) => l.href === g.href))].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Sticky sidebar: contents + the design this article points to. */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            {sections.length > 2 && (
              <nav aria-label="On this page" className="card-quiet p-6">
                <p className="eyebrow">On this page</p>
                <ol className="mt-4 space-y-2.5 text-[0.88rem]">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="block leading-snug text-charcoal/75 hover:text-emerald-soft">{section.heading}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-peach">
                <Image src={templateImage(ctaTemplateId)} alt="" fill sizes="320px" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-editorial text-[1.35rem] font-semibold leading-tight">{ctaName}</p>
                <p className="mt-1 text-[0.85rem] text-muted">₹{ctaPrice.toLocaleString('en-IN')} one-time · everything included</p>
                <Link href={createHref} className="btn-primary mt-4 flex items-center justify-center rounded-full py-3 text-[0.9rem] font-semibold">
                  Use this design
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="border-t border-line bg-paper" aria-label="Related articles">
          <div className="shell py-16">
            <p className="eyebrow">Keep reading</p>
            <h2 className="t-h2 mt-3">Related articles</h2>
            <div className="mt-9 grid gap-5 md:grid-cols-3" data-reveal-group>
              {relatedPosts.map((rp) => <BlogCard key={rp.slug} post={rp} sizes={RELATED_CARD_SIZES} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Ready to create your invitation?"
        sub={ctaPriceLine}
        primary={{ href: createHref, label: 'Create my invitation' }}
        secondary={{ href: ctaTemplateHref, label: 'See the design' }}
        location="blog_footer_cta"
      />
      <SiteFooter />
      <StickyCTA pageType="blog_post" />
    </main>
  )
}
