import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'
import { INVITE_CARD_SIZE, renderInviteCard } from '@/lib/inviteCard'

export const runtime = 'nodejs'
export const size = INVITE_CARD_SIZE
export const contentType = 'image/png'
// Not cached by Next: revalidatePath does not clear an image route's cache, so
// a cached card would keep a name the host has since corrected. It is cached
// by Vercel's CDN instead (below), which is safe because the invitation page
// links the card with a fingerprint of its details (?v=…, cardUrl in
// ./page.tsx): an edit changes the address, so WhatsApp asks for a new card.
export const dynamic = 'force-dynamic'

/**
 * Drawing a card is the heaviest thing the server does, and every WhatsApp,
 * iMessage and Facebook preview of a shared link asks for it. Kept a week at
 * the CDN; the old ?v= of an edited invitation is simply never asked for again.
 */
const CDN_CACHE = 'max-age=604800'

type Props = { params: { slug: string } }

// The link-preview card for a shared invitation — typeset in lib/inviteCard.
export default async function Image({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    return null
  })
  const data = (event?.data || {}) as Record<string, string>
  const templateId = (event as { templateId?: string | null } | null)?.templateId ?? ''
  const card = await renderInviteCard(templateId, data)
  // A missing invitation draws a blank card; that is not kept, so a link
  // previewed a moment before its invitation is saved still gets the real one.
  if (event) card.headers.set('Vercel-CDN-Cache-Control', CDN_CACHE)
  return card
}
