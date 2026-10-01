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

const draftTitles: Array<{ title: string; category: BlogCategory; keyword: string; date?: string; description?: string; metaTitle?: string; slug?: string; image?: string }> = [
  { title: 'Best Digital Wedding Invitation Templates in India', category: 'Wedding', keyword: 'digital wedding invitation templates India', image: '/blog/best-digital-wedding-invitation-templates-in-india.jpg' },
  { title: 'How To Create A WhatsApp Wedding Invitation', category: 'Wedding', keyword: 'WhatsApp wedding invitation', image: '/blog/how-to-create-a-whatsapp-wedding-invitation.jpg' },
  { title: 'Digital Wedding Invitation Vs Printed Cards', category: 'Digital Invitations', keyword: 'digital wedding invitation vs printed cards', image: '/blog/digital-wedding-invitation-vs-printed-cards.jpg' },
  { title: 'Best Engagement Invitation Ideas', category: 'Engagement', keyword: 'engagement invitation ideas', image: '/blog/best-engagement-invitation-ideas.jpg' },
  { title: 'Modern South Indian Wedding Invitation Designs', category: 'Wedding Trends', keyword: 'South Indian wedding invitation designs', image: '/blog/modern-south-indian-wedding-invitation-designs.jpg' },
  // Was 'Free Online Invitation Maker For Weddings' at /blog/free-online-invitation-maker-for-weddings
  // (301 in next.config.mjs). The old title promised a free product; ShareInvite charges to publish.
  { title: 'Online Wedding Invitation Maker: What It Really Costs', slug: 'online-wedding-invitation-maker-what-it-really-costs', metaTitle: 'Online Wedding Invitation Maker: What It Really Costs', category: 'Wedding', keyword: 'online wedding invitation maker', description: 'Watermarks, guest caps, pay-to-publish: how online wedding invitation makers really charge, what to check first, and exactly what ShareInvite costs.', image: '/blog/free-online-invitation-maker-for-weddings.jpg' },
  { title: 'WhatsApp Invitation Templates For Birthdays', category: 'Birthday', keyword: 'WhatsApp birthday invitation templates', image: '/blog/whatsapp-invitation-templates-for-birthdays.jpg' },
  { title: 'How To Make A Digital Griha Pravesh Invitation', category: 'Housewarming', keyword: 'digital Griha Pravesh invitation', image: '/blog/how-to-make-a-digital-griha-pravesh-invitation.jpg' },
  // Also the home of the retired /baby-shower-invitation-wording page (301).
  { title: 'Baby Shower Invitation Wording Ideas For India', slug: 'baby-shower-invitation-wording-ideas-for-india', category: 'Baby Shower', keyword: 'baby shower invitation wording India', metaTitle: 'Baby Shower Invitation Message & Wording: 20+ Indian Ideas', description: 'Baby shower invitation messages for WhatsApp — Godh Bharai, Seemantham, Valaikappu & modern wording in English, Hindi & Tamil, plus captions to copy.', image: '/blog/baby-shower-invitation-wording-ideas-for-india.jpg' },
  // Also the home of the retired /namakaran-invitation-wording page (301) — Google ranks this URL.
  { title: 'Naming Ceremony Invitation Message Samples', slug: 'naming-ceremony-invitation-message-samples', category: 'Invitation Ideas', keyword: 'naming ceremony invitation message', metaTitle: 'Naming Ceremony Invitation Message for WhatsApp: 30+ Ideas', description: 'Copy a naming ceremony invitation message for WhatsApp — Namakaran, Barsa & cradle ceremony wording for a baby boy or girl, in English, Hindi & Marathi.', image: '/blog/naming-ceremony-invitation-message-samples.jpg' },
  { title: 'Indian Wedding Invitation Wording For WhatsApp', category: 'Wedding', keyword: 'Indian wedding invitation wording WhatsApp', image: '/blog/indian-wedding-invitation-wording-for-whatsapp.jpg' },
  { title: 'Online RSVP Guide For Indian Weddings', category: 'Wedding', keyword: 'online RSVP Indian weddings', image: '/blog/online-rsvp-guide-for-indian-weddings.jpg' },
  { title: 'Best Wedding Website Features For Guests', category: 'Digital Invitations', keyword: 'wedding website features', image: '/blog/best-wedding-website-features-for-guests.jpg' },
  { title: 'Engagement Invitation Wording For Ring Ceremony', category: 'Engagement', keyword: 'ring ceremony invitation wording', image: '/blog/engagement-invitation-wording-for-ring-ceremony.jpg' },
  { title: 'Birthday Invitation Text For WhatsApp Groups', category: 'Birthday', keyword: 'birthday invitation text WhatsApp', metaTitle: 'Birthday Invitation Text for WhatsApp Groups: Samples', description: '50+ birthday invitation text messages for WhatsApp groups to copy and paste — short and simple samples in English for family and friends groups.', image: '/blog/birthday-invitation-text-for-whatsapp-groups.jpg' },
  { title: 'Minimal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'minimal wedding invitation design', image: '/blog/minimal-wedding-invitation-design-ideas.jpg' },
  { title: 'Royal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'royal wedding invitation design', image: '/blog/royal-wedding-invitation-design-ideas.jpg' },
  { title: 'How To Share Event Invitations On WhatsApp', category: 'Digital Invitations', keyword: 'share event invitations on WhatsApp', image: '/blog/how-to-share-event-invitations-on-whatsapp.jpg' },
  { title: 'Why Digital Invitations Are Growing In India', category: 'Digital Invitations', keyword: 'digital invitations India', image: '/blog/why-digital-invitations-are-growing-in-india.jpg' },
  { title: 'Mehendi And Sangeet Invitation Ideas', category: 'Wedding', keyword: 'Mehendi Sangeet invitation ideas', image: '/blog/mehendi-and-sangeet-invitation-ideas.jpg' },
  { title: 'Roka Ceremony Invitation Ideas And Wording', category: 'Engagement', keyword: 'Roka invitation ideas', metaTitle: 'Roka Ceremony Invitation Messages & Wording for WhatsApp', description: '40+ Roka ceremony invitation messages, wording and ideas for WhatsApp to copy and paste, in English & Hindi. Ready-to-send samples for a modern Roka invite.', image: '/blog/roka-ceremony-invitation-ideas-and-wording.jpg' },
  { title: 'First Birthday Invitation Ideas For Indian Families', category: 'Birthday', keyword: 'first birthday invitation ideas India', image: '/blog/first-birthday-invitation-ideas-for-indian-families.jpg' },
  { title: '60th Birthday Invitation Ideas For Parents', category: 'Birthday', keyword: '60th birthday invitation ideas', image: '/blog/60th-birthday-invitation-ideas-for-parents.jpg' },
  { title: 'Silver Anniversary Invitation Ideas', category: 'Invitation Ideas', keyword: 'silver anniversary invitation ideas', image: '/blog/silver-anniversary-invitation-ideas.jpg' },
  { title: 'Golden Anniversary Invitation Wording', category: 'Invitation Ideas', keyword: 'golden anniversary invitation wording', image: '/blog/golden-anniversary-invitation-wording.jpg' },
  { title: 'Godh Bharai Invitation Ideas For WhatsApp', category: 'Baby Shower', keyword: 'Godh Bharai invitation ideas', image: '/blog/godh-bharai-invitation-ideas-for-whatsapp.jpg' },
  { title: 'Seemantham Invitation Message Examples', category: 'Baby Shower', keyword: 'Seemantham invitation message', image: '/blog/seemantham-invitation-message-examples.jpg' },
  { title: 'Namakaran Invitation Ideas For Baby Boys', category: 'Invitation Ideas', keyword: 'Namakaran invitation baby boy', image: '/blog/namakaran-invitation-ideas-for-baby-boys.jpg' },
  { title: 'Namakaran Invitation Ideas For Baby Girls', category: 'Invitation Ideas', keyword: 'Namakaran invitation baby girl', image: '/blog/namakaran-invitation-ideas-for-baby-girls.jpg' },
  { title: 'Wedding Invitation Timeline For Indian Families', category: 'Wedding', keyword: 'wedding invitation timeline India', image: '/blog/wedding-invitation-timeline-for-indian-families.jpg' },
  { title: 'How To Add Google Maps To Wedding Invitations', category: 'Digital Invitations', keyword: 'Google Maps wedding invitation', image: '/blog/how-to-add-google-maps-to-wedding-invitations.jpg' },
  { title: 'Digital Invitation Checklist Before Sharing', category: 'Digital Invitations', keyword: 'digital invitation checklist', image: '/blog/digital-invitation-checklist-before-sharing.jpg' },
  { title: 'Best Fonts For Indian Wedding Invitations', category: 'Wedding Trends', keyword: 'Indian wedding invitation fonts', image: '/blog/best-fonts-for-indian-wedding-invitations.jpg' },
  { title: 'Color Palettes For Indian Wedding E-Invites', category: 'Wedding Trends', keyword: 'Indian wedding e invite colors', image: '/blog/color-palettes-for-indian-wedding-e-invites.jpg' },
  { title: 'Budget Friendly Wedding Invitation Ideas', category: 'Wedding', keyword: 'budget wedding invitation ideas', image: '/blog/budget-friendly-wedding-invitation-ideas.jpg' },
  { title: 'Eco Friendly Wedding Invitations In India', category: 'Wedding Trends', keyword: 'eco friendly wedding invitations India', image: '/blog/eco-friendly-wedding-invitations-in-india.jpg' },
  { title: 'Destination Wedding Invitation Website Guide', category: 'Wedding', keyword: 'destination wedding invitation website', image: '/blog/destination-wedding-invitation-website-guide.jpg' },
  { title: 'Corporate Event Invitation Email And WhatsApp Ideas', category: 'Invitation Ideas', keyword: 'corporate event invitation ideas', image: '/blog/corporate-event-invitation-email-and-whatsapp-ideas.jpg' },
  { title: 'Office Party Invitation Templates For Teams', category: 'Invitation Ideas', keyword: 'office party invitation templates', image: '/blog/office-party-invitation-templates-for-teams.jpg' },
  { title: 'How RSVP Tracking Reduces Event Follow Up', category: 'Digital Invitations', keyword: 'RSVP tracking events', image: '/blog/how-rsvp-tracking-reduces-event-follow-up.jpg' },
  { title: 'WhatsApp Invitation Etiquette For Indian Families', category: 'Invitation Ideas', keyword: 'WhatsApp invitation etiquette India', image: '/blog/whatsapp-invitation-etiquette-for-indian-families.jpg' },
  { title: 'Invitation Landing Page SEO For Wedding Planners', category: 'Digital Invitations', keyword: 'invitation landing page SEO', image: '/blog/invitation-landing-page-seo-for-wedding-planners.jpg' },
  { title: 'Best Photo Gallery Ideas For Digital Invitations', category: 'Invitation Ideas', keyword: 'photo gallery digital invitations', image: '/blog/best-photo-gallery-ideas-for-digital-invitations.jpg' },
  { title: 'Music Ideas For Wedding Invitation Websites', category: 'Wedding', keyword: 'wedding invitation website music', image: '/blog/music-ideas-for-wedding-invitation-websites.jpg' },
  { title: 'How To Write A Personal Wedding Invite Message', category: 'Wedding', keyword: 'personal wedding invite message', image: '/blog/how-to-write-a-personal-wedding-invite-message.jpg' },
  { title: 'Birthday Party Schedule Ideas For Invitations', category: 'Birthday', keyword: 'birthday party schedule invitation', image: '/blog/birthday-party-schedule-ideas-for-invitations.jpg' },
  { title: 'Housewarming Pooja Schedule Invitation Guide', category: 'Housewarming', keyword: 'housewarming pooja schedule invitation', image: '/blog/housewarming-pooja-schedule-invitation-guide.jpg' },
  { title: 'Engagement Invitation Checklist For Families', category: 'Engagement', keyword: 'engagement invitation checklist', image: '/blog/engagement-invitation-checklist-for-families.jpg' },
  { title: 'Digital Invitation Trends For Indian Events', category: 'Wedding Trends', keyword: 'digital invitation trends India', image: '/blog/digital-invitation-trends-for-indian-events.jpg' },
  {
    title: 'My College Friend Got Engaged — His WhatsApp Digital Invitation Left Everyone Speechless',
    category: 'Engagement',
    keyword: 'digital engagement invitation WhatsApp India',
    date: '2026-02-14',
    image: '/blog/my-college-friend-got-engaged-his-whatsapp-digital-invitation-left-everyone-speechless.jpg',
    description: 'A real story about a college friend\'s surprise engagement — and how a digital WhatsApp invitation on ShareInvite impressed the entire friend group and both families at a fraction of what anyone expected to pay.',
  },

  // ─── 3D & animated greeting templates ──────────────────────────────────────
  {
    title: '3D Surprise Journey: The Interactive Digital Gift You Send Online',
    category: 'Digital Invitations',
    keyword: '3d digital invitation gift online',
    date: '2026-07-01',
    image: '/blog/3d-surprise-journey-the-interactive-digital-gift-you-send-online.jpg',
    description: 'Send a 3D digital gift they actually unlock — a secret PIN, photo memories, balloon pops, a scratch card and a handwritten letter. The ShareInvite 3D Surprise Journey turns a birthday or anniversary wish into an interactive experience they open on any phone, no app needed.',
  },
  {
    title: '3D Love Card Online — Send a Romantic Animated Card in Minutes',
    category: 'Invitation Ideas',
    keyword: 'love card online',
    date: '2026-07-03',
    image: '/blog/3d-love-card-online-send-a-romantic-animated-card-in-minutes.jpg',
    description: 'Create a 3D animated love card online and share it on WhatsApp in minutes. Floating hearts, your photos, little reasons you love them and a heartfelt message — a romantic digital card that feels far more personal than a text.',
  },
  {
    title: 'Valentines Day Card Online — Send a 3D Animated Valentine on WhatsApp',
    category: 'Invitation Ideas',
    keyword: 'valentines day card online',
    date: '2026-07-05',
    image: '/blog/valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp.jpg',
    description: 'Make a Valentine\'s Day card online in minutes and send a 3D animated valentine on WhatsApp — floating hearts, your photos and a love note. The most romantic (and easiest) way to say I love you this Valentine\'s Day, no app required.',
  },
  {
    title: 'Anniversary Card Online — Create a 3D Animated Anniversary Card',
    category: 'Invitation Ideas',
    keyword: 'anniversary card online',
    date: '2026-07-07',
    image: '/blog/anniversary-card-online-create-a-3d-animated-anniversary-card.jpg',
    description: 'Create an anniversary card online with a 3D animated design, your photos, a countdown of years together and a personal message. A beautiful marriage-anniversary wish for your wife, husband or parents you can share on WhatsApp in minutes.',
  },
  {
    title: 'Digital Proposal Card — A 3D Will You Marry Me Card That Says Yes',
    category: 'Invitation Ideas',
    keyword: 'digital proposal card',
    date: '2026-07-09',
    image: '/blog/digital-proposal-card-a-3d-will-you-marry-me-card-that-says-yes.jpg',
    description: 'Plan the perfect proposal with a 3D digital proposal card — an interactive "Will You Marry Me?" moment with rings, your photo memories and a Say Yes button. A unique online proposal idea you can create and share in minutes.',
  },
  {
    title: 'Promise Day Card Online — Send a Heartfelt 3D Promise',
    category: 'Invitation Ideas',
    keyword: 'promise day card online',
    date: '2026-07-11',
    image: '/blog/promise-day-card-online-send-a-heartfelt-3d-promise.jpg',
    description: 'Send a Promise Day card online with a serene 3D animated design, your photos and the promises you want to make. A heartfelt Valentine-week greeting you can personalise and share on WhatsApp in minutes.',
  },
  {
    title: 'Sorry Card Online — Say Sorry With a Heartfelt Animated Card',
    category: 'Invitation Ideas',
    keyword: 'sorry card online',
    date: '2026-07-13',
    image: '/blog/sorry-card-online-say-sorry-with-a-heartfelt-animated-card.jpg',
    description: 'Say sorry the right way with a gentle 3D animated apology card — soft petals, your photos and a sincere message. A thoughtful way to apologise to someone you love and share it privately on WhatsApp.',
  },
  {
    title: 'Congratulations Card Online — Send an Animated Congrats Card',
    category: 'Invitation Ideas',
    keyword: 'congratulations card online',
    date: '2026-07-15',
    image: '/blog/congratulations-card-online-send-an-animated-congrats-card.jpg',
    description: 'Send a congratulations card online with a celebratory 3D confetti animation, photos and a personal message. Perfect for a new job, promotion, exam success, new baby or any big win — create and share it on WhatsApp in minutes.',
  },
  {
    title: 'Festival Wishes Card Online — Diwali and Festival Greetings',
    category: 'Invitation Ideas',
    keyword: 'festival wishes card online',
    date: '2026-07-16',
    image: '/blog/festival-wishes-card-online-diwali-and-festival-greetings.jpg',
    description: 'Send animated festival wishes online — glowing 3D diyas for Diwali and warm greetings for every festival. Add your photos and a personal message, then share your digital festival greeting card with family and friends on WhatsApp.',
  },
  {
    title: 'Family Wishes Card Online — A Heartfelt Digital Card for Family',
    category: 'Invitation Ideas',
    keyword: 'family wishes card online',
    date: '2026-07-17',
    image: '/blog/family-wishes-card-online-a-heartfelt-digital-card-for-family.jpg',
    description: 'Create a heartfelt digital card for your family — a 3D animated design with photo memories and a message for your parents, siblings or the people who raised you. A meaningful way to say thank you and I love you, sharable on WhatsApp.',
  },
  {
    title: 'Friendship Day Card Online — Send a 3D Card to Your Best Friends',
    category: 'Invitation Ideas',
    keyword: 'friendship day card online',
    date: '2026-07-18',
    image: '/blog/friendship-day-card-online-send-a-3d-card-to-your-best-friends.jpg',
    description: 'Send a Friendship Day card online with a playful 3D star-filled animation, your favourite photos together and an inside-joke message. The perfect Happy Friendship Day greeting for your best friends — create and share on WhatsApp in minutes.',
  },

  // ─── Ganesh Chaturthi (premium template) ────────────────────────────────────
  {
    title: 'Ganesh Chaturthi Invitation Card Online — Make a Digital Ganpati Invite in 5 Minutes',
    category: 'Digital Invitations',
    keyword: 'ganesh chaturthi invitation card online',
    date: '2026-09-04',
    // Slug pinned rather than generated: the generated one would carry the
    // whole H1, and this is the phrasing the head term is actually searched in.
    slug: 'ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template',
    metaTitle: 'Ganesh Chaturthi Invitation Card Online — Ganpati Invite ₹99',
    image: '/blog/ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template.jpg',
    description: 'Create a Ganesh Chaturthi invitation card online in minutes — a premium digital Ganpati invite with the Vakratunda shloka, sthapana countdown, daily aarti timings, visarjan day, Google Maps and a wishes wall. Just ₹99 one-time, shared on WhatsApp. Includes copy-paste Ganesh Chaturthi invitation messages in English, Hindi and Marathi.',
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
    image: '/blog/raksha-bandhan-invitation-card-online-free-digital-rakhi-template.jpg',
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
  /**
   * Share image for this specific post, absolute or site-root-relative.
   *
   * Every post previously shared the one generic brand OG card, so a post
   * about a specific template showed nothing of that template when it was
   * forwarded on WhatsApp or posted to a group — which is most of the traffic
   * a festival post gets. Falls back to the brand card when unset.
   *
   * Also the card and hero photo. Every post has its own photo in
   * public/blog/<slug>.jpg (1200x750 JPEG, sources in public/blog/CREDITS.md).
   * A post added without one falls back to shared category artwork, so give
   * each new post its own photo.
   */
  image?: string
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
      return `Complete guide to ${keyword}. Covers what to write, how to personalise for Godh Bharai or Seemantham, and how to share it with family on WhatsApp.`
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
  image: item.image,
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
