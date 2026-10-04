import nodemailer, { type Transporter } from 'nodemailer'
import { waitUntil } from '@vercel/functions'
import { SUPPORT_EMAIL } from '@/lib/support'

/**
 * Transactional email over SMTP — Gmail unless told otherwise.
 *
 * For Gmail: turn on 2-Step Verification for the account, create an App
 * Password (Google Account → Security → App passwords) and set on Vercel:
 *   SMTP_USER  the Gmail address the mail is sent from
 *   SMTP_PASS  the 16-character app password (spaces are fine)
 *   SMTP_FROM  optional, e.g. "ShareInvite <shareinvite123@gmail.com>"
 * SMTP_HOST and SMTP_PORT default to smtp.gmail.com:465, so moving to another
 * provider later is a change of settings, not of code. With no SMTP_USER or
 * SMTP_PASS nothing is sent and nothing fails.
 */

let transport: Transporter | null = null

function transporter(): Transporter | null {
  const user = process.env.SMTP_USER?.trim()
  // Google shows app passwords in groups of four: "abcd efgh ijkl mnop".
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '')
  if (!user || !pass) return null
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465)
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
  }
  return transport
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A real inbox: not a guest placeholder (lib payments) and not Razorpay's stand-in address. */
export function isDeliverable(email?: string | null): email is string {
  const e = (email || '').trim().toLowerCase()
  return EMAIL.test(e) && !e.endsWith('@guests.shareinvite.in') && !e.endsWith('@razorpay.com')
}

export interface Mail {
  to: string
  subject: string
  html: string
  text: string
}

/** Sends one email. Never throws: a mail problem must not undo a payment or a publish. */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!isDeliverable(mail.to)) return false
  const t = transporter()
  if (!t) {
    console.warn('[mail] SMTP_USER / SMTP_PASS not set; not sent:', mail.subject)
    return false
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM?.trim() || `ShareInvite <${process.env.SMTP_USER?.trim()}>`,
      replyTo: SUPPORT_EMAIL,
      ...mail,
    })
    return true
  } catch (err) {
    console.error('[mail] send failed:', mail.subject, err instanceof Error ? err.message : err)
    return false
  }
}

/**
 * Runs `work` after the response has gone, so a buyer never waits on the mail
 * server. On Vercel, waitUntil keeps the function alive until it finishes;
 * elsewhere the server is long-lived and the promise simply runs.
 */
export function sendLater(work: () => Promise<unknown>) {
  const job = work().catch((err) => console.error('[mail]', err instanceof Error ? err.message : err))
  try {
    waitUntil(job)
  } catch {
    // Not inside a Vercel request: nothing to extend.
  }
}
