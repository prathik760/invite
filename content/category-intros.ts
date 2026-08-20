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
    'A digital invitation is a live page, not a picture of a card. These guides cover what that changes in practice: updating details after you have already sent the link, adding maps and RSVP, keeping the page fast on Indian mobile networks, and sharing it so guests actually open it.',
  'Invitation Ideas':
    'Wording, etiquette and design ideas that apply across occasions — anniversaries, naming ceremonies, corporate events and family gatherings. Start here when you know what you want to say but not quite how to say it.',
}

export const TEMPLATE_CATEGORY_INTRO: Record<string, string> = {
  wedding:
    'Digital wedding invitation templates built for Indian ceremonies — multi-day schedules, both families named, muhurat timings, venue maps and a photo gallery. Every design publishes to a single link you can forward to a WhatsApp group, and details stay editable after you send it.',
  greeting:
    'Animated 3D greeting cards for one person rather than a guest list. No venue, no RSVP — just your photos, your words and an animation that plays as they scroll. Made to be opened properly on a phone and kept, for love notes, apologies, congratulations, festivals and friendships.',
}
