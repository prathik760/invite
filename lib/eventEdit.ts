import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isEditKey } from '@/lib/editKey'
import { isEnded, isInternalSlug } from '@/lib/retention'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'

export interface EditableEvent {
  id: string
  slug: string
  templateId: string
  data: Record<string, string>
  /** Kept in the dev-only local store (no database). */
  local: boolean
}

export type EditCheck = { ok: true; event: EditableEvent } | { ok: false; status: 401 | 403 | 404 | 410; error: string }

/**
 * Whether this request may change the published invitation `slug`: its owner,
 * signed in, or whoever holds its edit key (lib/editKey.ts). Only while the
 * invitation is live: once the celebration has ended it can no longer change,
 * so one purchase is one celebration.
 */
export async function editableEvent(slug: string, key: unknown): Promise<EditCheck> {
  if (isInternalSlug(slug)) return { ok: false, status: 404, error: 'Invitation not found.' }

  let event: (Omit<EditableEvent, 'local'> & { userId: string | null }) | null = null
  let local = false
  try {
    const row = await prisma.event.findUnique({ where: { slug }, select: { id: true, slug: true, templateId: true, data: true, userId: true } })
    event = row && { ...row, data: row.data as Record<string, string> }
  } catch (err) {
    if (!shouldUseLocalStore(err)) throw err
    const row = await getLocalEventBySlug(slug)
    event = row && { id: row.id, slug: row.slug, templateId: row.templateId, data: row.data, userId: null }
    local = true
  }
  if (!event) return { ok: false, status: 404, error: 'Invitation not found.' }

  const session = await getServerSession(authOptions).catch(() => null)
  const owner = Boolean(session?.user?.id && event.userId && session.user.id === event.userId)
  if (!owner && !isEditKey(event.id, key)) {
    return session
      ? { ok: false, status: 403, error: 'This invitation belongs to another account. Sign in with the account that published it, or use the Edit link from its email.' }
      : { ok: false, status: 401, error: 'Sign in with the account that published this invitation, or use the Edit link from its email.' }
  }
  if (isEnded(event.data)) return { ok: false, status: 410, error: 'This celebration has ended, so its invitation can no longer be changed.' }

  return { ok: true, event: { id: event.id, slug: event.slug, templateId: event.templateId, data: event.data, local } }
}
