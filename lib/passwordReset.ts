import crypto from 'crypto'

/**
 * Password-reset links (Forgot password, 4 Nov 2026).
 *
 * A token is the account id and an expiry, signed with NEXTAUTH_SECRET together with the account's
 * current password hash. So it:
 *  - expires: 30 minutes after it is issued;
 *  - works once: setting a new password changes the hash, and every earlier link stops matching;
 *  - is never stored: nothing in the database can leak it, and no table was needed.
 * Accounts made by Google or at guest checkout have no password yet; their first reset sets one,
 * which equally retires the link.
 */
export const RESET_TTL_MS = 30 * 60 * 1000

interface Owner {
  id: string
  password: string | null
}

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not set')
  return s
}

function sign(userId: string, exp: number, passwordHash: string | null): string {
  return crypto.createHmac('sha256', secret()).update(`pwreset|${userId}|${exp}|${passwordHash ?? ''}`).digest('base64url')
}

export function createResetToken(user: Owner, now = Date.now()): string {
  const exp = now + RESET_TTL_MS
  const head = Buffer.from(JSON.stringify({ u: user.id, e: exp })).toString('base64url')
  return `${head}.${sign(user.id, exp, user.password)}`
}

/** The account and expiry a token names, without checking its signature (to look the account up). */
export function readResetToken(token: unknown): { userId: string; exp: number } | null {
  if (typeof token !== 'string' || token.length > 400) return null
  const [head, sig] = token.split('.')
  if (!head || !sig) return null
  try {
    const { u, e } = JSON.parse(Buffer.from(head, 'base64url').toString('utf8')) as { u?: unknown; e?: unknown }
    return typeof u === 'string' && typeof e === 'number' ? { userId: u, exp: e } : null
  } catch {
    return null
  }
}

/** True only for an unexpired token signed for this account as it is now. */
export function checkResetToken(token: string, user: Owner, now = Date.now()): boolean {
  const parsed = readResetToken(token)
  if (!parsed || parsed.userId !== user.id || parsed.exp < now) return false
  const expected = Buffer.from(sign(user.id, parsed.exp, user.password))
  const given = Buffer.from(token.split('.')[1] ?? '')
  return given.length === expected.length && crypto.timingSafeEqual(given, expected)
}
