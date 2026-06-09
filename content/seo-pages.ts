import { PRIMARY_KEYWORDS } from '@/lib/seo'

export type Faq = { question: string; answer: string }
export type SeoPage = {
  slug: string
  title: string
  description: string
  h1: string
  primaryKeyword: string
  occasion: string
  audience: string
  templateLinks: string[]
  relatedLinks: Array<{ label: string; href: string }>
  faqs: Faq[]
}

const commonRelated = [
  { label: 'Wedding invitations', href: '/wedding-invitations' },
  { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
  { label: 'Online RSVP', href: '/online-rsvp' },
  { label: 'Digital invitation templates', href: '/templates' },
  { label: 'Invitation ideas blog', href: '/blog' },
]

export const landingPages: SeoPage[] = [
  {
    slug: 'wedding-invitations',
    title: 'Digital Wedding Invitations India | Online Wedding Card Maker',
    description:
      'Create premium digital wedding invitations for Indian weddings. Choose templates, add venue, gallery, music, WhatsApp sharing, RSVP tracking, and guest wishes.',
    h1: 'Digital Wedding Invitations for Indian Weddings',
    primaryKeyword: 'digital wedding invitation',
    occasion: 'wedding',
    audience: 'couples, families, wedding planners, and relatives coordinating ceremonies across India',
    templateLinks: ['elegant-wedding', 'indian-wedding', 'cinematic-night', 'kgf-wedding', 'royal-deco'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'How do I create a digital wedding invitation on ShareInvite?',
        answer:
          'Choose a wedding template, enter the couple names, date, time, venue, schedule, photos, and message, then publish the invitation. ShareInvite gives you a live URL that can be sent instantly on WhatsApp.',
      },
      {
        question: 'Can I use ShareInvite for South Indian, North Indian, and destination weddings?',
        answer:
          'Yes. The invitation pages support Indian wedding ceremony details such as muhurat, baraat, varmala, pheras, reception, sangeet, mehendi, dress code, maps, gallery, and family messages.',
      },
      {
        question: 'Is RSVP tracking included with digital wedding invitations?',
        answer:
          'ShareInvite is built as an online RSVP platform, so invitation pages can collect guest responses, wishes, and sharing actions without requiring guests to install an app.',
      },
      {
        question: 'Can I share the invitation as a WhatsApp wedding card?',
        answer:
          'Yes. Every published invitation has a WhatsApp-ready share link with preview metadata, making it simple to forward to family groups and individual guests.',
      },
    ],
  },
  {
    slug: 'engagement-invitations',
    title: 'Engagement Invitation Card Maker | Digital Mangni Invitations',
    description:
      'Create romantic engagement invitation cards online for ring ceremonies, roka, and mangni events. Share instantly on WhatsApp with RSVP and venue details.',
    h1: 'Engagement Invitation Cards for Ring Ceremonies',
    primaryKeyword: 'engagement invitation card',
    occasion: 'engagement',
    audience: 'couples announcing roka, ring ceremony, mangni, or engagement celebrations',
    templateLinks: ['indian-engagement', 'elegant-wedding', 'royal-deco'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can I create a digital engagement invitation without design skills?',
        answer:
          'Yes. Select the engagement template, fill in names, event time, venue, dress code, and message, then publish a polished invitation page in minutes.',
      },
      {
        question: 'Does the engagement invitation work on WhatsApp?',
        answer:
          'The published ShareInvite link opens in any mobile browser and includes a WhatsApp share action, so guests can view event details without downloading an app.',
      },
      {
        question: 'Can I include a ring ceremony schedule?',
        answer:
          'Yes. You can add welcome drinks, ring exchange, dinner, music, photos, and custom notes so guests know exactly what to expect.',
      },
      {
        question: 'Can families use the same page for roka and engagement?',
        answer:
          'Yes. The content fields are flexible enough for roka, mangni, ring ceremony, engagement dinner, or combined pre-wedding celebrations.',
      },
    ],
  },
  {
    slug: 'birthday-invitations',
    title: 'Digital Birthday Invitations | Online Birthday Card Maker',
    description:
      'Design and share digital birthday invitations for kids, adults, milestone parties, and family celebrations with WhatsApp sharing and RSVP features.',
    h1: 'Digital Birthday Invitations for Every Celebration',
    primaryKeyword: 'digital birthday invitation',
    occasion: 'birthday',
    audience: 'families and party hosts creating modern birthday invitation cards',
    templateLinks: ['indian-birthday'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'What should I include in a digital birthday invitation?',
        answer:
          'Include the celebrant name, age, date, time, venue, theme, schedule, map link, host note, and a clear RSVP or wishes prompt.',
      },
      {
        question: 'Can birthday invitations be shared on WhatsApp groups?',
        answer:
          'Yes. ShareInvite pages are designed for WhatsApp sharing, so guests receive one link instead of a heavy PDF or image file.',
      },
      {
        question: 'Can I use the same page for kids and adult birthdays?',
        answer:
          'Yes. The fields can be customized for kids parties, milestone birthdays, surprise parties, and family gatherings.',
      },
      {
        question: 'Does the invitation work on mobile phones?',
        answer:
          'Every ShareInvite birthday invitation is mobile-first and opens quickly on phones, tablets, and desktop browsers.',
      },
    ],
  },
  {
    slug: 'anniversary-invitations',
    title: 'Anniversary Invitation Maker | Digital Anniversary Invites',
    description:
      'Create elegant digital anniversary invitations for milestone celebrations. Add couple story, venue, photos, music, WhatsApp sharing, and RSVP tracking.',
    h1: 'Digital Anniversary Invitations for Milestone Celebrations',
    primaryKeyword: 'anniversary invitation online',
    occasion: 'anniversary',
    audience: 'couples and families planning silver, golden, and milestone anniversary events',
    templateLinks: ['anniversary', 'royal-deco'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can I make a 25th or 50th anniversary invitation?',
        answer:
          'Yes. The anniversary template supports couple names, years together, venue details, gallery, music, schedule, and family message.',
      },
      {
        question: 'Can children create an invitation for their parents?',
        answer:
          'Yes. Many families use ShareInvite to create a polished invitation page for parents or grandparents and share it with relatives on WhatsApp.',
      },
      {
        question: 'Can I add a couple photo gallery?',
        answer:
          'Yes. You can add a gallery with old and recent photos to make the invitation feel like a celebration of the couple story.',
      },
      {
        question: 'Does ShareInvite support RSVP for anniversary parties?',
        answer:
          'Yes. The platform is structured for RSVP and guest response tracking so hosts can plan attendance with less follow-up.',
      },
    ],
  },
  {
    slug: 'griha-pravesh-invitations',
    title: 'Griha Pravesh Invitation Online | Housewarming Invite Maker',
    description:
      'Create auspicious Griha Pravesh and housewarming invitations online. Add pooja muhurat, address, maps, schedule, WhatsApp sharing, and RSVP.',
    h1: 'Griha Pravesh Invitations and Housewarming E-Invites',
    primaryKeyword: 'griha pravesh invitation',
    occasion: 'griha pravesh',
    audience: 'families inviting relatives and friends to housewarming ceremonies',
    templateLinks: ['griha-pravesh'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can I add pooja and muhurat details?',
        answer:
          'Yes. The Griha Pravesh template includes fields for muhurat, pooja schedule, full address, Google Maps link, and family message.',
      },
      {
        question: 'Is this suitable for Vastu Pooja and housewarming lunch?',
        answer:
          'Yes. You can list Ganesh Pooja, Vastu Pooja, Griha Pravesh muhurat, lunch prasad, dinner, or any custom ceremony flow.',
      },
      {
        question: 'Can guests find the new home location easily?',
        answer:
          'The invitation can include a one-tap Google Maps button, full address, and optional notes for parking or apartment entry.',
      },
      {
        question: 'Can I share the Griha Pravesh invite on WhatsApp?',
        answer:
          'Yes. ShareInvite creates a mobile-friendly link that is simple to send to family groups and relatives.',
      },
    ],
  },
  {
    slug: 'baby-shower-invitations',
    title: 'Baby Shower Invitation Maker | Digital Godh Bharai Invites',
    description:
      'Create beautiful baby shower and Godh Bharai invitations online with theme, venue, schedule, WhatsApp sharing, RSVP, and guest wishes.',
    h1: 'Baby Shower Invitations for Godh Bharai and Family Celebrations',
    primaryKeyword: 'baby shower invitation',
    occasion: 'baby shower',
    audience: 'families planning baby showers, Godh Bharai, seemantham, and blessing ceremonies',
    templateLinks: ['namakaran', 'elegant-wedding'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can ShareInvite be used for Godh Bharai or Seemantham?',
        answer:
          'Yes. You can customize the event name, family message, schedule, venue, dress theme, and WhatsApp share text for traditional baby shower ceremonies.',
      },
      {
        question: 'Can guests send blessings on the invite?',
        answer:
          'Yes. Guest wishes can be submitted on the invitation page and approved by the host.',
      },
      {
        question: 'Can I add baby shower theme details?',
        answer:
          'Yes. You can add dress code, theme colors, schedule, maps, and a personal note for guests.',
      },
      {
        question: 'Does the invitation need app installation?',
        answer:
          'No. Guests open the ShareInvite URL directly from WhatsApp or any browser.',
      },
    ],
  },
  {
    slug: 'naming-ceremony-invitations',
    title: 'Naming Ceremony Invitation | Namakaran Invitation Online',
    description:
      'Create digital naming ceremony and Namakaran invitations with parent names, pooja schedule, venue, Google Maps, WhatsApp sharing, and guest wishes.',
    h1: 'Naming Ceremony Invitations and Namakaran E-Invites',
    primaryKeyword: 'naming ceremony invitation',
    occasion: 'naming ceremony',
    audience: 'parents and families inviting guests to Namakaran, cradle ceremony, or baby naming events',
    templateLinks: ['namakaran'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can I create a Namakaran invitation online?',
        answer:
          'Yes. ShareInvite has a naming ceremony template with baby name, parents names, ceremony date, venue, schedule, message, and shareable WhatsApp link.',
      },
      {
        question: 'Can the baby name be hidden if it is announced at the ceremony?',
        answer:
          'Yes. You can customize the text and use a placeholder such as Baby Kapoor or Our Little One until the name is announced.',
      },
      {
        question: 'Can I include pooja and lunch timing?',
        answer:
          'Yes. Add Satyanarayan Pooja, naming muhurat, blessing time, lunch, or any other program details.',
      },
      {
        question: 'Can relatives send blessings online?',
        answer:
          'Guests can leave wishes on the invitation page, making the invite useful for relatives who cannot attend in person.',
      },
    ],
  },
  {
    slug: 'corporate-event-invitations',
    title: 'Corporate Event Invitation Maker | Online RSVP Platform',
    description:
      'Create digital corporate event invitations for launches, team parties, conferences, and office celebrations with RSVP tracking and WhatsApp sharing.',
    h1: 'Corporate Event Invitations with Online RSVP',
    primaryKeyword: 'event invitation website',
    occasion: 'corporate event',
    audience: 'teams, founders, HR managers, agencies, and event coordinators',
    templateLinks: ['royal-deco', 'cinematic-night'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'Can ShareInvite be used for corporate events?',
        answer:
          'Yes. Corporate teams can create invitation pages for launches, offsites, annual days, team dinners, webinars, and office celebrations.',
      },
      {
        question: 'Can I track RSVPs for business guests?',
        answer:
          'ShareInvite is designed for RSVP workflows, making it easier to estimate attendance and coordinate follow-ups.',
      },
      {
        question: 'Can I include agenda and venue details?',
        answer:
          'Yes. Add agenda, speaker timing, venue, maps, dress code, event notes, and a CTA for guest response.',
      },
      {
        question: 'Can invitations be shared with clients on WhatsApp?',
        answer:
          'Yes. The invite is a professional web link that can be shared through WhatsApp, email, LinkedIn, or internal communication tools.',
      },
    ],
  },
  {
    slug: 'whatsapp-invitation-maker',
    title: 'WhatsApp Invitation Card Maker | Share Digital Invites Online',
    description:
      'Make WhatsApp invitation cards as live web pages for weddings, birthdays, engagements, Griha Pravesh, baby showers, corporate events, and RSVP tracking.',
    h1: 'WhatsApp Invitation Maker for Digital Invitation Cards',
    primaryKeyword: 'whatsapp invitation card',
    occasion: 'WhatsApp invitation',
    audience: 'hosts who want a lightweight invitation link instead of PDFs, images, or printed cards',
    templateLinks: ['elegant-wedding', 'indian-engagement', 'indian-birthday', 'griha-pravesh', 'namakaran'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'What is a WhatsApp invitation card?',
        answer:
          'A WhatsApp invitation card is a digital invite link that can be shared through WhatsApp. With ShareInvite, it opens as a mobile-friendly webpage with event details, maps, gallery, and RSVP features.',
      },
      {
        question: 'Is a web invitation better than sending an image?',
        answer:
          'Yes. A web invitation can include live countdown, maps, guest wishes, RSVP tracking, photos, music, and updated details, while an image is static.',
      },
      {
        question: 'Will guests need to download an app?',
        answer:
          'No. Guests click the link and open the invitation directly in their browser.',
      },
      {
        question: 'Can I share one invitation link with many guests?',
        answer:
          'Yes. The same ShareInvite URL can be forwarded to groups, individual guests, email lists, and family networks.',
      },
    ],
  },
  {
    slug: 'online-rsvp',
    title: 'Online RSVP Platform India | Track Event Responses',
    description:
      'Use ShareInvite as an online RSVP platform for weddings, birthdays, housewarming, naming ceremonies, and corporate events. Create invites and track responses.',
    h1: 'Online RSVP Platform for Indian Events',
    primaryKeyword: 'online RSVP',
    occasion: 'RSVP tracking',
    audience: 'hosts, wedding planners, families, and teams coordinating attendance',
    templateLinks: ['elegant-wedding', 'indian-wedding', 'indian-birthday', 'griha-pravesh'],
    relatedLinks: commonRelated,
    faqs: [
      {
        question: 'How does online RSVP help event planning?',
        answer:
          'Online RSVP reduces manual follow-up by collecting responses, wishes, and guest activity on the invitation page, helping hosts estimate attendance more accurately.',
      },
      {
        question: 'Can RSVP be used for weddings and family functions?',
        answer:
          'Yes. It works for weddings, engagements, birthdays, Griha Pravesh, naming ceremonies, baby showers, anniversaries, and corporate events.',
      },
      {
        question: 'Can guests respond from WhatsApp?',
        answer:
          'Guests open the invitation link from WhatsApp and complete response actions on the web page without installing any app.',
      },
      {
        question: 'Does ShareInvite include invitation creation too?',
        answer:
          'Yes. ShareInvite combines invitation creation, WhatsApp sharing, and RSVP-oriented guest interaction in one platform.',
      },
    ],
  },
]

export type LocationPage = {
  slug: string
  city: string
  title: string
  description: string
  faqs: Faq[]
}

const cities = ['bangalore', 'hyderabad', 'mumbai', 'delhi', 'chennai', 'pune', 'kolkata'] as const
const cityNames: Record<(typeof cities)[number], string> = {
  bangalore: 'Bangalore',
  hyderabad: 'Hyderabad',
  mumbai: 'Mumbai',
  delhi: 'Delhi',
  chennai: 'Chennai',
  pune: 'Pune',
  kolkata: 'Kolkata',
}

export const locationPages: LocationPage[] = cities.map((city) => {
  const cityName = cityNames[city]
  return {
    slug: `digital-invitations-${city}`,
    city: cityName,
    title: `Digital Invitations in ${cityName} | Wedding & Event Invite Maker`,
    description: `Create digital invitations in ${cityName} for weddings, engagements, birthdays, Griha Pravesh, baby showers, naming ceremonies, and corporate events. Share on WhatsApp with RSVP tracking.`,
    faqs: [
      {
        question: `Can I create a digital wedding invitation in ${cityName}?`,
        answer: `Yes. ShareInvite helps families in ${cityName} create mobile-first wedding invitation pages with venue, maps, schedule, gallery, WhatsApp sharing, and RSVP-ready guest interaction.`,
      },
      {
        question: `Can ${cityName} guests open the invitation on WhatsApp?`,
        answer:
          'Yes. Guests receive one shareable link and open the invitation directly in their browser without installing any app.',
      },
      {
        question: `Does ShareInvite support ${cityName} venues and Google Maps?`,
        answer:
          'Yes. Add the venue name, full address, and Google Maps link so guests can reach the event location easily.',
      },
      {
        question: `Which events can I create invitations for in ${cityName}?`,
        answer:
          'You can create invitations for weddings, engagements, birthdays, anniversaries, housewarming, baby showers, naming ceremonies, corporate events, and RSVP-led gatherings.',
      },
    ],
  }
})

export function findSeoPage(slug: string) {
  return landingPages.find((page) => page.slug === slug)
}

export function findLocationPage(slug: string) {
  return locationPages.find((page) => page.slug === slug)
}

export function pageKeywords(page: Pick<SeoPage, 'primaryKeyword' | 'occasion'>) {
  return [
    page.primaryKeyword,
    `${page.occasion} invitation`,
    `${page.occasion} invitation maker`,
    `${page.occasion} invitation India`,
    ...PRIMARY_KEYWORDS,
  ]
}
