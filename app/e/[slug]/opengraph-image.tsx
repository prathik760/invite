import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'
import { INVITE_CARD_SIZE, renderInviteCard } from '@/lib/inviteCard'

export const runtime = 'nodejs'
export const size = INVITE_CARD_SIZE
export const contentType = 'image/png'

type Props = { params: { slug: string } }

// The link-preview card for a shared invitation — typeset in lib/inviteCard.
export default async function Image({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    return null
  })
  const data = (event?.data || {}) as Record<string, string>
  const templateId = (event as { templateId?: string | null } | null)?.templateId ?? ''
  return renderInviteCard(templateId, data)
}
