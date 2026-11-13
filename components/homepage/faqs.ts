import { ENDS_AFTER_DAYS, DELETE_AFTER_DAYS } from '@/lib/retention'
import type { T } from '@/lib/translate'

/**
 * The homepage questions. Rendered by HomeFaq AND emitted as FAQPage JSON-LD
 * from this one list (Google requires the markup to match what is visible).
 * Every answer follows the product's rules: lib/offer.ts (what a purchase
 * includes), lib/retention.ts (how long an invitation stays up), the
 * builder's edit mode, and each design's own fields for RSVP, music and photos.
 * `t` translates each question and answer into the page's language (lib/translate).
 */
export type FaqGroup = 'buy' | 'make' | 'guests'

export interface HomeFaq {
  question: string
  answer: string
  group: FaqGroup
}

/** The groups, in the order they are offered: buying worries first. Labels are translated where shown (HomeFaq). */
export const FAQ_GROUPS: { key: FaqGroup; label: string }[] = [
  { key: 'buy', label: 'Before you buy' },
  { key: 'make', label: 'Making it' },
  { key: 'guests', label: 'Your guests' },
]

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const spell = (n: number) => words[n] ?? String(n)

export function homeFaqs({ total, rsvp, music, photos }: { total: number; rsvp: number; music: number; photos: number }, t: T): HomeFaq[] {
  return [
    {
      question: t('What is a digital invitation?'),
      answer: t('A digital invitation is a designed page your guests open from a link, with no app to download. Depending on the design it holds your event details, a live countdown, photos, music, Google Maps directions and a wall where guests leave wishes.'),
      group: 'buy',
    },
    {
      question: t('Do I have to pay before I see my invitation?'),
      answer: t('No. You build the whole invitation and preview it exactly as your guests will see it, without paying. You pay once, only when you publish it.'),
      group: 'buy',
    },
    {
      question: t('Is the payment secure?'),
      answer: t('Yes. Payments go through Razorpay, by UPI, card or net banking in India. ShareInvite never sees or stores your card details.'),
      group: 'buy',
    },
    {
      question: t('Can I get a refund?'),
      answer: t('Refund requests can be raised within seven days of payment. The refund policy sets out which requests are eligible and how they are handled.'),
      group: 'buy',
    },
    {
      question: t('How do I create an invitation?'),
      answer: t('Choose a design and sign in or create a free account. Then type your names, date, venue and message, and add your photos. The preview updates as you type. When you are happy, pay once to publish and you get your own link to send. Browsing and previews need no account.'),
      group: 'make',
    },
    {
      question: t('Can I customize my invitation?'),
      answer: t('Yes. Every word, name, date and photo is yours, in any language you write in. Wedding designs take every function of the week, each with its own time, venue and dress code.'),
      group: 'make',
    },
    {
      question: t('Can I share invitations through WhatsApp?'),
      answer: t('Yes. You get one link that shows a preview card in WhatsApp, and it works just as well on Instagram, email or text. Guests tap it and the invitation opens.'),
      group: 'guests',
    },
    {
      question: t('Can guests RSVP online?'),
      answer: t("On {rsvp} of our {total} designs, yes. Guests tap Reply on the invitation and their answer opens in WhatsApp, ready to send to the number you choose. Each design's page says whether it has RSVP.", { rsvp, total }),
      group: 'guests',
    },
    {
      question: t('Can I add a Google Maps location?'),
      answer: t('Yes. Paste your venue\'s Google Maps link, or just type the venue and address, and guests get a Directions button that opens the way there.'),
      group: 'make',
    },
    {
      question: t('Can I add music and photos?'),
      answer: t("Yes, on the designs that have them: {music} play background music you add, and {photos} have a photo gallery. Every design's preview shows exactly what it includes.", { music, photos }),
      group: 'make',
    },
    {
      question: t('Do guests need to install an application?'),
      answer: t('No. The invitation is a web page, so it opens in the browser of any phone or computer, anywhere in the world. Guests need no app and no account.'),
      group: 'guests',
    },
    {
      question: t('Can I edit my invitation after purchasing?'),
      answer: t('Yes. You can change the details until your event ends, and the link stays the same, so guests always see the latest version. The design itself is the one you paid for.'),
      group: 'make',
    },
    {
      question: t('How long will my invitation remain active?'),
      answer: t('It stays live through your event and for {ends} days after it. {deleted} days after the last day, the invitation, its wishes and its uploaded photos and music are deleted.', {
        ends: spell(ENDS_AFTER_DAYS),
        deleted: cap(spell(DELETE_AFTER_DAYS)),
      }),
      group: 'buy',
    },
  ]
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
