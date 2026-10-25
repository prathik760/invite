import { TEMPLATES } from '@/modules/templates/data'
import { OCCASIONS, catalogueOrder, displayName, primaryOccasion } from '@/lib/catalog'
import { formatTemplatePrice, HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'
import { OFFER_INCLUDES } from '@/lib/offer'
import { SITE_URL, templateSeoSlug } from '@/lib/seo'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY } from '@/lib/support'

export const dynamic = 'force-static'
export const revalidate = 86400

/**
 * /llms.txt (llmstxt.org): what ShareInvite is, every design with its price and
 * page, and the guides worth citing, in plain Markdown for AI assistants.
 * ChatGPT and other assistants send real buyers here, so this is built from the
 * catalogue itself and can never quote a design or price that has changed.
 */
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const link = (label: string, path: string, note?: string) => `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ''}`

/** A design's description cut to its first sentence, and to its last whole clause within `max`, so one line stays one line. */
function summary(text: string, max = 240): string {
  let line = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text
  if (line.length > max) line = line.slice(0, line.lastIndexOf(', ', max)).replace(/[,:;]$/, '')
  return /[.!?]$/.test(line) ? line : `${line}.`
}

const GUIDES: Array<[string, string, string]> = [
  ['Wedding invitation wording', '/wedding-invitation-wording', 'Hindu, South Indian, Nikah, Christian, Hindi and reception wording to copy'],
  ['Engagement invitation wording', '/engagement-invitation-wording', 'ring ceremony, roka, sagai and mangni wording'],
  ['Birthday invitation wording', '/birthday-invitation-wording', 'first birthday, 50th, 60th, surprise party and kids birthday wording'],
  ['Anniversary invitation wording', '/anniversary-invitation-wording', '25th, 50th, party and vow renewal wording'],
  ['Griha pravesh invitation wording', '/griha-pravesh-invitation-wording', 'housewarming, vastu shanti and satyanarayan pooja wording'],
  ['Diwali invitation wording', '/diwali-invitation-wording', 'Diwali party, Lakshmi puja and office wording'],
]

const PAGES: Array<[string, string, string]> = [
  ['Digital wedding invitations', '/wedding-invitation', 'every wedding design, from palace suites to Nikah and Kalyanam'],
  ['Engagement invitations', '/engagement-invitation', 'ring ceremony designs'],
  ['Birthday invitations', '/birthday-invitation', 'kids, milestone and adult party designs'],
  ['Anniversary invitations', '/anniversary-invitation', 'anniversary designs'],
  ['Griha pravesh invitations', '/griha-pravesh-invitation', 'housewarming designs'],
  ['Namakaran invitations', '/namakaran-invitation', 'naming ceremony and baby shower designs'],
  ['Save the date', '/save-the-date', 'save the date cards'],
  ['WhatsApp invitation maker', '/whatsapp-invitation-maker', 'how sharing an invitation link on WhatsApp works'],
  ['Online RSVP', '/online-rsvp', 'collecting guest replies'],
]

function body(): string {
  const groups = new Map<string, string[]>()
  for (const id of catalogueOrder(TEMPLATES.map((t) => t.id))) {
    const key = primaryOccasion(id)?.key ?? 'other'
    groups.set(key, [...(groups.get(key) ?? []), id])
  }
  const designs = [...OCCASIONS.map((o) => [o.key, o.label] as const), ['other', 'More designs'] as const]
    .filter(([key]) => groups.has(key))
    .map(([key, label]) => {
      const lines = groups.get(key)!.map((id) => {
        const t = TEMPLATES.find((item) => item.id === id)!
        const about = t.description ? `${summary(t.description)} ` : ''
        return `${link(`${displayName(t.name)} (${formatTemplatePrice(id)})`, `/templates/${templateSeoSlug(id)}`, `${about}Live demo: ${SITE_URL}/demo/${id}`)}`
      })
      return `### ${label}\n\n${lines.join('\n')}`
    })

  return `# ShareInvite

> ShareInvite (${SITE_URL}) makes animated digital invitations for weddings, engagements, birthdays, anniversaries, housewarmings, naming ceremonies and festivals. You choose a design, fill in your details, preview the finished invitation, then pay once (${inr(LOWEST_PAID_PRICE)} to ${inr(HIGHEST_PAID_PRICE)}) to publish it on its own link to share on WhatsApp, Instagram, email or text. Guests open it on any phone with no app.

## How it works

1. Pick a design at ${SITE_URL}/templates (every design has a live demo).
2. Fill in names, date, venue, photos and music in the builder at ${SITE_URL}/create. No account is needed.
3. Preview the whole invitation, then pay once with Razorpay (UPI, cards or net banking) to publish.
4. Share the link. Change the details any time until the event; the link stays the same.

## What one purchase includes

${OFFER_INCLUDES.map((line) => `- ${line}`).join('\n')}
- Preview before you pay, and a 7-day refund policy (${SITE_URL}/refund-policy)
- Each design has one price, shown in Indian rupees below
- Rather not fill it in yourself? ShareInvite's team can fill it in for you over WhatsApp

## Designs

${designs.join('\n\n')}

## Occasion pages

${PAGES.map(([label, path, note]) => link(label, path, note)).join('\n')}

## Wording guides

${GUIDES.map(([label, path, note]) => link(label, path, note)).join('\n')}
- [Blog](${SITE_URL}/blog): planning guides and invitation ideas

## Help

${link('Pricing', '/pricing', 'every design and its price')}
${link('Refund policy', '/refund-policy')}
- WhatsApp: ${SUPPORT_WHATSAPP_DISPLAY}
- Email: ${SUPPORT_EMAIL}
`
}

export function GET() {
  return new Response(body(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
