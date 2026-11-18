import { revalidatePath } from 'next/cache'
import { FREE_LIMIT } from '@/lib/freeOffer'
import { prisma } from '@/lib/db'

/**
 * The free option (15 Nov 2026): any design can be published free, carrying ShareInvite branding
 * (components/e/FreeBranding.tsx and FreePlanBanner); buying the design removes it, on the same link.
 *
 * Free pages are capped per account, because a free page that can carry links is what spammers
 * look for; a family planning a wedding or a birthday needs far fewer than this.
 */
export { FREE_LIMIT }
const FREE_WINDOW_DAYS = 365

/** Free invitations this account published in the last year (custom requests are not invitations). */
export function freeInvitesUsed(userId: string): Promise<number> {
  return prisma.event.count({
    where: {
      userId,
      isPaid: false,
      templateId: { not: '__custom-requests__' },
      createdAt: { gte: new Date(Date.now() - FREE_WINDOW_DAYS * 24 * 60 * 60 * 1000) },
    },
  })
}

/**
 * The design is the account's now: its free invitations with it lose the branding, at once and on
 * the same links. Called when a payment for the design is verified, and when an owner asks to
 * remove branding from an invitation published before they bought it. Never throws: the payment
 * is already recorded, and the daily rebuild of each page would catch up.
 */
export async function unbrandDesign(userId: string, templateId: string): Promise<number> {
  try {
    const free = await prisma.event.findMany({ where: { userId, templateId, isPaid: false }, select: { slug: true } })
    if (!free.length) return 0
    await prisma.event.updateMany({ where: { userId, templateId, isPaid: false }, data: { isPaid: true } })
    for (const { slug } of free) revalidatePath(`/e/${slug}`)
    return free.length
  } catch (err) {
    console.error('[unbrandDesign]', err instanceof Error ? err.message : err)
    return 0
  }
}
