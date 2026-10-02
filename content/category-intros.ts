/**
 * Intro copy for taxonomy pages.
 *
 * Blog and template category pages previously rendered a generated title, a
 * generated meta description and a list of links — nothing else. All eight blog
 * categories were byte-identical apart from the category name. Google
 * discovered several of them and never spent a crawl on them
 * ("Discovered – currently not indexed"), which is the correct call for a page
 * that says nothing its children do not already say.
 *
 * Each entry below is written for that specific occasion so the page earns its
 * place. Categories with too little behind them are not given copy — they are
 * noindexed instead (see MIN_INDEXABLE_* in the category routes).
 */

export const BLOG_CATEGORY_INTRO: Record<string, string> = {
  Wedding:
    'Indian weddings are planned across months and shared across cities. These guides cover the practical side of inviting people — how to word the invitation for both families, when to send it so guests can book travel, what to include for a multi-day celebration, and how to share it on WhatsApp so nobody is left asking for the venue again.',
  Engagement:
    'A Mangni, Roka or Sagai is usually arranged at shorter notice than the wedding, and the guest list is smaller and more personal. These guides cover ring ceremony wording, what to include when both families are hosting, and how to send an engagement invitation that still feels formal on a phone screen.',
  Birthday:
    'Birthday plans change more than any other event — the venue, the time and the theme are often confirmed days before. These guides cover invitation messages you can copy, first-birthday and milestone wording, and how to send a party invitation to a WhatsApp group without it getting lost in the thread.',
  'Baby Shower':
    'Godh Bharai, Seemantham, Valaikappu or a modern baby shower — each carries different rituals and a different tone. These guides cover what to write for each, how much detail to include about the ceremony, and how to invite family who may be travelling to attend.',
  'Digital Invitations':
    'A digital invitation is a live page, not a picture of a card. These guides cover what that changes in practice: putting maps and schedules where guests can find them, collecting replies, keeping the page fast on Indian mobile networks, and sharing it so guests actually open it.',
  'Invitation Ideas':
    'Wording, etiquette and design ideas that apply across occasions — anniversaries, naming ceremonies, corporate events and family gatherings. Start here when you know what you want to say but not quite how to say it.',
}

export const TEMPLATE_CATEGORY_INTRO: Record<string, string> = {
  wedding:
    'Digital wedding invitation templates built for Indian ceremonies — multi-day schedules, both families named, muhurat timings, venue maps and a photo gallery. Every design publishes to a single link you can forward to a WhatsApp group, and you can preview every detail before you publish.',
  signature:
    'The Signature collection is for weddings that run across days and cities: complete suites with every function on its own card, both families, your story, travel and stay for out-of-town guests, the people to call, answers to their questions, a WhatsApp RSVP and a livestream link for family abroad. Each opens with its own crafted welcome.',
  babyshower:
    'Baby shower invitations for a Godh Bharai, Seemantham, Valaikappu or a modern shower — the rituals, the time, the address and a wall where family can leave blessings for the mother and the little one.',
  prewedding:
    'Invitations for the days before the wedding — the Haldi, the Mehendi and the Sangeet — with each function’s time, venue and, most importantly, what to wear.',
  pooja:
    'Calm, devotional invitations for a Satyanarayan Katha, Lakshmi Pooja, Vastu Shanti or any home pooja — the muhurat, the aarti time, prasad and directions to your door.',
  festival:
    'Festival invitations for Diwali parties, Eid gatherings, Ganesh Chaturthi darshan and Raksha Bandhan — the evening’s plan, the address and a place for everyone’s wishes.',
  retirement:
    'Retirement and farewell invitations that honour a lifetime of work — the years of service, the evening’s plan and a wall where colleagues, friends and family leave their messages.',
  savethedate:
    'Digital save the dates for couples who want the date in people’s calendars before the invitations go out — your names, the day on a little calendar, the town and a link to your wedding website, on one page you can send by text, email or WhatsApp.',
  greeting:
    'Animated 3D greeting cards for one person rather than a guest list. No venue, no RSVP — just your photos, your words and an animation that plays as they scroll. Made to be opened properly on a phone and kept, for love notes, apologies, congratulations, festivals and friendships.',
}
