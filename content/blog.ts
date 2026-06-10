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

const draftTitles: Array<{ title: string; category: BlogCategory; keyword: string }> = [
  { title: 'Best Digital Wedding Invitation Templates in India', category: 'Wedding', keyword: 'digital wedding invitation templates India' },
  { title: 'How To Create A WhatsApp Wedding Invitation', category: 'Wedding', keyword: 'WhatsApp wedding invitation' },
  { title: 'Digital Wedding Invitation Vs Printed Cards', category: 'Digital Invitations', keyword: 'digital wedding invitation vs printed cards' },
  { title: 'Best Engagement Invitation Ideas', category: 'Engagement', keyword: 'engagement invitation ideas' },
  { title: 'Modern South Indian Wedding Invitation Designs', category: 'Wedding Trends', keyword: 'South Indian wedding invitation designs' },
  { title: 'Free Online Invitation Maker For Weddings', category: 'Wedding', keyword: 'free online invitation maker for weddings' },
  { title: 'WhatsApp Invitation Templates For Birthdays', category: 'Birthday', keyword: 'WhatsApp birthday invitation templates' },
  { title: 'How To Make A Digital Griha Pravesh Invitation', category: 'Housewarming', keyword: 'digital Griha Pravesh invitation' },
  { title: 'Baby Shower Invitation Wording Ideas For India', category: 'Baby Shower', keyword: 'baby shower invitation wording India' },
  { title: 'Naming Ceremony Invitation Message Samples', category: 'Invitation Ideas', keyword: 'naming ceremony invitation message' },
  { title: 'Indian Wedding Invitation Wording For WhatsApp', category: 'Wedding', keyword: 'Indian wedding invitation wording WhatsApp' },
  { title: 'Online RSVP Guide For Indian Weddings', category: 'Wedding', keyword: 'online RSVP Indian weddings' },
  { title: 'Best Wedding Website Features For Guests', category: 'Digital Invitations', keyword: 'wedding website features' },
  { title: 'Engagement Invitation Wording For Ring Ceremony', category: 'Engagement', keyword: 'ring ceremony invitation wording' },
  { title: 'Birthday Invitation Text For WhatsApp Groups', category: 'Birthday', keyword: 'birthday invitation text WhatsApp' },
  { title: 'Housewarming Invitation Wording For Griha Pravesh', category: 'Housewarming', keyword: 'housewarming invitation wording' },
  { title: 'Minimal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'minimal wedding invitation design' },
  { title: 'Royal Wedding Invitation Design Ideas', category: 'Wedding Trends', keyword: 'royal wedding invitation design' },
  { title: 'How To Share Event Invitations On WhatsApp', category: 'Digital Invitations', keyword: 'share event invitations on WhatsApp' },
  { title: 'Why Digital Invitations Are Growing In India', category: 'Digital Invitations', keyword: 'digital invitations India' },
  { title: 'Mehendi And Sangeet Invitation Ideas', category: 'Wedding', keyword: 'Mehendi Sangeet invitation ideas' },
  { title: 'Roka Ceremony Invitation Ideas And Wording', category: 'Engagement', keyword: 'Roka invitation ideas' },
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
]

export type BlogDraft = {
  slug: string
  title: string
  category: BlogCategory
  keyword: string
  description: string
  date: string
  status: 'draft'
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
  ...item,
  slug: slugify(item.title),
  description: buildDescription(item.title, item.keyword, item.category),
  date: `2026-05-${String((index % 28) + 1).padStart(2, '0')}`,
  status: 'draft',
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
