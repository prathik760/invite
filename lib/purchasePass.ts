import crypto from 'crypto'

/**
 * Proof that a signed-out visitor has just paid, so they can publish without
 * an account.
 *
 * /api/payments/verify issues one after Razorpay's signature and the amount
 * have been checked and the purchase has been recorded on the payer's account
 * (found or created from the email they gave Razorpay). POST /api/events
 * accepts it in place of a session.
 *
 * It names that account but is not a session: it lets its holder publish
 * designs the account has paid for, and nothing else — it cannot read the
 * account's invitations or guest wishes. That matters because the email comes
 * from the payment form: someone paying with another person's address must not
 * be signed in to that person's account.
 */
const TTL_MS = 6 * 60 * 60 * 1000

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not configured')
  return s
}

const sign = (body: string) => crypto.createHmac('sha256', secret()).update(`purchase-pass.${body}`).digest('base64url')

export function issuePass(userId: string, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ u: userId, e: now + TTL_MS })).toString('base64url')
  return `${body}.${sign(body)}`
}

/** The account a valid, unexpired pass was issued for; null for anything else. */
export function readPass(token: unknown, now = Date.now()): string | null {
  if (typeof token !== 'string' || token.length > 512) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = sign(body)
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const { u, e } = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { u?: unknown; e?: unknown }
    return typeof u === 'string' && typeof e === 'number' && e > now ? u : null
  } catch {
    return null
  }
}
