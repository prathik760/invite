import crypto from 'crypto'

/**
 * The private key that lets someone change one published invitation without
 * signing in. It goes to the device that published it and into the "your
 * invitation is live" email, as an Edit link.
 *
 * It is derived from the invitation's id and the server secret, so nothing is
 * stored: whoever holds it can edit that one invitation and nothing else (not
 * the account's other invitations, nor its guests' wishes). A signed-in owner
 * edits with their session instead. It is not the purchase pass, which names
 * an account from whatever email was typed at checkout.
 */
function secret(): string {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not configured')
  return s
}

export function editKey(eventId: string): string {
  return crypto.createHmac('sha256', secret()).update(`invitation-edit.${eventId}`).digest('base64url')
}

export function isEditKey(eventId: string, key: unknown): boolean {
  if (typeof key !== 'string' || key.length > 128) return false
  const expected = editKey(eventId)
  return key.length === expected.length && crypto.timingSafeEqual(Buffer.from(key), Buffer.from(expected))
}

/** The edit link sent in emails. The key travels after #, so it never reaches a server log or analytics. */
export function editUrl(appUrl: string, slug: string, eventId: string): string {
  return `${appUrl}/create?edit=${encodeURIComponent(slug)}#key=${editKey(eventId)}`
}
