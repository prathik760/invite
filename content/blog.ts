import { slugify } from '@/lib/seo'

export const blogCategories = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Housewarming',
  'Baby Shower',
  'Invitation Ideas',
  'Wedding Trends',
  'Digital Invitations',
] as const

export type BlogCategory = (typeof blogCategories)[number]

const draftTitles: Array<{ title: string; category: BlogCategory; keyword: string; date?: string; description?: string; metaTitle?: string; slug?: string }> = [
  { title: 'Best Digital Wedding Invitation Templates in India', category: 'Wedding', keyword: 'digital wedding invitation templates India' },
  { title: 'How To Create A WhatsApp Wedding Invitation', category: 'Wedding', keyword: 'WhatsApp wedding invitation' },
  { title: 'Digital Wedding Invitation Vs Printed Cards', category: 'Digital Invitations', keyword: 'digital wedding invitation vs printed cards' },
  { title: 'Best Engagement Invitation Ideas', category: 'Engagement', keyword: 'engagement invitation ideas' },
  { title: 'Modern South Indian Wedding Invitation Designs', category: 'Wedding Trends', keyword: 'South Indian wedding invitation designs' },
  { title: 'Free Online Invitation Maker For Weddings', category: 'Wedding', keyword: 'free online invitation maker for weddings' },
  { title: 'WhatsApp Invitation Templates For Birthdays', category: 'Birthday', keyword: 'WhatsApp birthday invitation templates' },
  { title: 'How To Make A Digital Griha Pravesh Invitation', category: 'Housewarming', keyword: 'digital Griha Pravesh invitation' },
  { title: 'Baby Shower Invitation Wording Ideas For India', category: 'Baby Shower', keyword: 'baby shower invitation wording India' },
  { title: 'Naming Ceremony Invitation Message Samples', category: 'Invitation Ideas', keyword: 'naming ceremony invitation message', metaTitle: '50+ Naming Ceremony Invitation Messages for WhatsApp (Copy-Paste)', description: '50+ naming ceremony (Namakaran / Cradle Ceremony) invitation messages for WhatsApp — copy & paste free, for baby boy & girl, in English & Hindi. Ready-to-send samples.' },
  { title: 'Indian Wedding Invitation Wording For WhatsApp', category: 'Wedding', keyword: 'Indian wedding invitation wording WhatsApp' },
  { title: 'Online RSVP Guide For Indian Weddings', category: 'Wedding', keyword: 'online RSVP Indian weddings' },
  { title: 'Best Wedding Website Features For Guests', category: 'Digital Invitations', keyword: 'wedding website features' },
  { title: 'Engagement Invitation Wording For Ring Ceremony', category: 'Engagement', keyword: 'ring ceremony invitation wording' },
  { title: 'Birthday Invitation Text For WhatsApp Groups', category: 'Birthday', keyword: 'birthday invitation text WhatsApp', metaTitle: 'Birthday Invitation Text for WhatsApp Groups — 50+ Samples', description: '50+ birthday invitation text messages for WhatsApp groups — copy & paste free, short and simple samples in English for family and friends groups.' },
  { title: 'Minimal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'minimal wedding invitation design' },
  { title: 'Royal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'royal wedding invitation design' },
  { title: 'How To Share Event Invitations On WhatsApp', category: 'Digital Invitations', keyword: 'share event invitations on WhatsApp' },
  { title: 'Why Digital Invitations Are Growing In India', category: 'Digital Invitations', keyword: 'digital invitations India' },
  { title: 'Mehendi And Sangeet Invitation Ideas', category: 'Wedding', keyword: 'Mehendi Sangeet invitation ideas' },
  { title: 'Roka Ceremony Invitation Ideas And Wording', category: 'Engagement', keyword: 'Roka invitation ideas', metaTitle: '40+ Roka Ceremony Invitation Messages & Wording for WhatsApp', description: '40+ Roka ceremony invitation messages, wording and ideas for WhatsApp — copy & paste free, in English & Hindi. Ready-to-send samples for a modern Roka invite.' },
  { title: 'First Birthday Invitation Ideas For Indian Families', category: 'Birthday', keyword: 'first birthday invitation ideas India' },
  { title: '60th Birthday Invitation Ideas For Parents', category: 'Birthday', keyword: '60th birthday invitation ideas' },
  { title: 'Silver Anniversary Invitation Ideas', category: 'Invitation Ideas', keyword: 'silver anniversary invitation ideas' },
  { title: 'Golden Anniversary Invitation Wording', category: 'Invitation Ideas', keyword: 'golden anniversary invitation wording' },
  { title: 'Godh Bharai Invitation Ideas For WhatsApp', category: 'Baby Shower', keyword: 'Godh Bharai invitation ideas' },
  { title: 'Seemantham Invitation Message Examples', category: 'Baby Shower', keyword: 'Seemantham invitation message' },
  { title: 'Namakaran Invitation Ideas For Baby Boys', category: 'Invitation Ideas', keyword: 'Namakaran invitation baby boy' },
  { title: 'Namakaran Invitation Ideas For Baby Girls', category: 'Invitation Ideas', keyword: 'Namakaran invitation baby girl' },
  { title: 'Wedding Invitation Timeline For Indian Families', category: 'Wedding', keyword: 'wedding invitation timeline India' },
  { title: 'How To Add Google Maps To Wedding Invitations', category: 'Digital Invitations', keyword: 'Google Maps wedding invitation' },
  { title: 'Digital Invitation Checklist Before Sharing', category: 'Digital Invitations', keyword: 'digital invitation checklist' },
  { title: 'Best Fonts For Indian Wedding Invitations', category: 'Wedding Trends', keyword: 'Indian wedding invitation fonts' },
  { title: 'Color Palettes For Indian Wedding E-Invites', category: 'Wedding Trends', keyword: 'Indian wedding e invite colors' },
  { title: 'Budget Friendly Wedding Invitation Ideas', category: 'Wedding', keyword: 'budget wedding invitation ideas' },
  { title: 'Eco Friendly Wedding Invitations In India', category: 'Wedding Trends', keyword: 'eco friendly wedding invitations India' },
  { title: 'Destination Wedding Invitation Website Guide', category: 'Wedding', keyword: 'destination wedding invitation website' },
  { title: 'Corporate Event Invitation Email And WhatsApp Ideas', category: 'Invitation Ideas', keyword: 'corporate event invitation ideas' },
  { title: 'Office Party Invitation Templates For Teams', category: 'Invitation Ideas', keyword: 'office party invitation templates' },
  { title: 'How RSVP Tracking Reduces Event Follow Up', category: 'Digital Invitations', keyword: 'RSVP tracking events' },
  { title: 'WhatsApp Invitation Etiquette For Indian Families', category: 'Invitation Ideas', keyword: 'WhatsApp invitation etiquette India' },
  { title: 'Invitation Landing Page SEO For Wedding Planners', category: 'Digital Invitations', keyword: 'invitation landing page SEO' },
  { title: 'Best Photo Gallery Ideas For Digital Invitations', category: 'Invitation Ideas', keyword: 'photo gallery digital invitations' },
  { title: 'Music Ideas For Wedding Invitation Websites', category: 'Wedding', keyword: 'wedding invitation website music' },
  { title: 'How To Write A Personal Wedding Invite Message', category: 'Wedding', keyword: 'personal wedding invite message' },
  { title: 'Birthday Party Schedule Ideas For Invitations', category: 'Birthday', keyword: 'birthday party schedule invitation' },
  { title: 'Housewarming Pooja Schedule Invitation Guide', category: 'Housewarming', keyword: 'housewarming pooja schedule invitation' },
  { title: 'Engagement Invitation Checklist For Families', category: 'Engagement', keyword: 'engagement invitation checklist' },
  { title: 'Digital Invitation Trends For Indian Events', category: 'Wedding Trends', keyword: 'digital invitation trends India' },
  {
    title: 'My College Friend Got Engaged — His WhatsApp Digital Invitation Left Everyone Speechless',
    category: 'Engagement',
    keyword: 'digital engagement invitation WhatsApp India',
    date: '2026-02-14',
    description: 'A real story about a college friend\'s surprise engagement — and how a digital WhatsApp invitation on ShareInvite impressed the entire friend group and both families at a fraction of what anyone expected to pay.',
  },

  // ─── 3D & animated greeting templates ──────────────────────────────────────
  {
    title: '3D Surprise Journey: The Interactive Digital Gift You Send Online',
    category: 'Digital Invitations',
    keyword: '3d digital invitation gift online',
    date: '2026-07-01',
    description: 'Send a 3D digital gift they actually unlock — a secret PIN, photo memories, balloon pops, a scratch card and a handwritten letter. The ShareInvite 3D Surprise Journey turns a birthday or anniversary wish into an interactive experience they open on any phone, no app needed.',
  },
  {
    title: '3D Love Card Online — Send a Romantic Animated Card in Minutes',
    category: 'Invitation Ideas',
    keyword: 'love card online',
    date: '2026-07-03',
    description: 'Create a 3D animated love card online and share it on WhatsApp in minutes. Floating hearts, your photos, little reasons you love them and a heartfelt message — a romantic digital card that feels far more personal than a text.',
  },
  {
    title: 'Valentines Day Card Online — Send a 3D Animated Valentine on WhatsApp',
    category: 'Invitation Ideas',
    keyword: 'valentines day card online',
    date: '2026-07-05',
    description: 'Make a Valentine\'s Day card online in minutes and send a 3D animated valentine on WhatsApp — floating hearts, your photos and a love note. The most romantic (and easiest) way to say I love you this Valentine\'s Day, no app required.',
  },
  {
    title: 'Anniversary Card Online — Create a 3D Animated Anniversary Card',
    category: 'Invitation Ideas',
    keyword: 'anniversary card online',
    date: '2026-07-07',
    description: 'Create an anniversary card online with a 3D animated design, your photos, a countdown of years together and a personal message. A beautiful marriage-anniversary wish for your wife, husband or parents you can share on WhatsApp in minutes.',
  },
  {
    title: 'Digital Proposal Card — A 3D Will You Marry Me Card That Says Yes',
    category: 'Invitation Ideas',
    keyword: 'digital proposal card',
    date: '2026-07-09',
    description: 'Plan the perfect proposal with a 3D digital proposal card — an interactive "Will You Marry Me?" moment with rings, your photo memories and a Say Yes button. A unique online proposal idea you can create and share in minutes.',
  },
  {
    title: 'Promise Day Card Online — Send a Heartfelt 3D Promise',
    category: 'Invitation Ideas',
    keyword: 'promise day card online',
    date: '2026-07-11',
    description: 'Send a Promise Day card online with a serene 3D animated design, your photos and the promises you want to make. A heartfelt Valentine-week greeting you can personalise and share on WhatsApp in minutes.',
  },
  {
    title: 'Sorry Card Online — Say Sorry With a Heartfelt Animated Card',
    category: 'Invitation Ideas',
    keyword: 'sorry card online',
    date: '2026-07-13',
    description: 'Say sorry the right way with a gentle 3D animated apology card — soft petals, your photos and a sincere message. A thoughtful way to apologise to someone you love and share it privately on WhatsApp.',
  },
  {
    title: 'Congratulations Card Online — Send an Animated Congrats Card',
    category: 'Invitation Ideas',
    keyword: 'congratulations card online',
    date: '2026-07-15',
    description: 'Send a congratulations card online with a celebratory 3D confetti animation, photos and a personal message. Perfect for a new job, promotion, exam success, new baby or any big win — create and share it on WhatsApp in minutes.',
  },
  {
    title: 'Festival Wishes Card Online — Diwali and Festival Greetings',
    category: 'Invitation Ideas',
    keyword: 'festival wishes card online',
    date: '2026-07-16',
    description: 'Send animated festival wishes online — glowing 3D diyas for Diwali and warm greetings for every festival. Add your photos and a personal message, then share your digital festival greeting card with family and friends on WhatsApp.',
  },
  {
    title: 'Family Wishes Card Online — A Heartfelt Digital Card for Family',
    category: 'Invitation Ideas',
    keyword: 'family wishes card online',
    date: '2026-07-17',
    description: 'Create a heartfelt digital card for your family — a 3D animated design with photo memories and a message for your parents, siblings or the people who raised you. A meaningful way to say thank you and I love you, sharable on WhatsApp.',
  },
  {
    title: 'Friendship Day Card Online — Send a 3D Card to Your Best Friends',
    category: 'Invitation Ideas',
    keyword: 'friendship day card online',
    date: '2026-07-18',
    description: 'Send a Friendship Day card online with a playful 3D star-filled animation, your favourite photos together and an inside-joke message. The perfect Happy Friendship Day greeting for your best friends — create and share on WhatsApp in minutes.',
  },

  // ─── Raksha Bandhan (premium template) ──────────────────────────────────────
  {
    title: 'Raksha Bandhan Invitation Card Online — Premium Digital Rakhi Template',
    category: 'Digital Invitations',
    keyword: 'raksha bandhan invitation card online',
    date: '2026-08-08',
    // Slug pinned to the originally-indexed URL so existing links keep working.
    slug: 'raksha-bandhan-invitation-card-online-free-digital-rakhi-template',
    metaTitle: 'Raksha Bandhan Invitation Card Online — Premium Digital Rakhi Invite (2026)',
    description: 'Create a stunning Raksha Bandhan invitation card online in minutes — a premium digital Rakhi invite and greeting with photos, a live countdown, event timeline, guest wishes, RSVP and one-tap WhatsApp sharing. Just ₹199 for the whole celebration. Perfect for brothers and sisters, including NRIs celebrating from abroad.',
  },
]

export type BlogDraft = {
  slug: string
  title: string
  category: BlogCategory
  keyword: string
  description: string
  date: string
  status: 'draft'
  metaTitle?: string
}

function buildDescription(title: string, keyword: string, category: BlogCategory): string {
  switch (category) {
    case 'Wedding':
      return `Complete guide to ${keyword} for Indian families. Covers templates, wording, WhatsApp sharing, muhurat timings, and what to include for a beautiful digital wedding invitation.`
    case 'Engagement':
      return `Practical guide to ${keyword} for Indian ceremonies. Covers what to include in a digital engagement invite, ring ceremony wording, WhatsApp sharing tips, and RSVP.`
    case 'Birthday':
      return `Everything you need to know about ${keyword}. Themes, schedule, wording ideas, WhatsApp sharing, and how to create a digital birthday invitation in under 5 minutes.`
    case 'Housewarming':
      return `Step-by-step guide to ${keyword}. Learn what to include — muhurat time, pooja schedule, Google Maps — and how to share your Griha Pravesh invite on WhatsApp.`
    case 'Baby Shower':
      return `Complete guide to ${keyword}. Covers what to write, how to personalise for Godh Bharai or Seemantham, and how to share with family on WhatsApp for free.`
    case 'Invitation Ideas':
      return `Creative and practical ideas for ${keyword}. Indian families share their best wording, design, and WhatsApp sharing tips for memorable digital invitations.`
    case 'Wedding Trends':
      return `Latest trends in ${keyword}. Explore what modern Indian couples are choosing for design, typography, music, and digital sharing in the current wedding season.`
    case 'Digital Invitations':
      return `In-depth look at ${keyword}. Covers best practices for Indian events — mobile design, WhatsApp sharing, RSVP, Google Maps, and what to include for any occasion.`
    default:
      return `A practical ShareInvite guide to ${keyword} for Indian families — covering design, wording, WhatsApp sharing, and RSVP for any occasion.`
  }
}

export const blogDrafts: BlogDraft[] = draftTitles.map((item, index) => ({
  slug: item.slug ?? slugify(item.title),
  title: item.title,
  category: item.category,
  keyword: item.keyword,
  description: item.description ?? buildDescription(item.title, item.keyword, item.category),
  date: item.date ?? `2026-05-${String((index % 28) + 1).padStart(2, '0')}`,
  status: 'draft',
  metaTitle: item.metaTitle,
}))

export function categorySlug(category: BlogCategory | string) {
  return slugify(category)
}

export function findBlogPost(slug: string) {
  return blogDrafts.find((post) => post.slug === slug)
}

export function findBlogCategory(slug: string) {
  return blogCategories.find((category) => categorySlug(category) === slug)
}

/**
 * How many posts in a category Google is actually allowed to index.
 *
 * Used by both the category route and the sitemap so the noindex decision and
 * the sitemap listing can never disagree.
 */
export function indexablePostCount(
  category: string,
  hasFullArticle: (slug: string) => boolean,
): number {
  return blogDrafts.filter((p) => p.category === category && hasFullArticle(p.slug)).length
}

/** Minimum indexable posts for a category page to be worth indexing itself. */
export const MIN_INDEXABLE_POSTS = 2
