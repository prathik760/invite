import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAppUrl } from '@/lib/utils'
import { sendLater, sendMail } from '@/lib/mail'
import { passwordResetEmail } from '@/lib/emails'
import { createResetToken, RESET_TTL_MS } from '@/lib/passwordReset'
import { takeQuota } from '@/lib/uploadQuota'
import { safeCallback } from '@/lib/authRedirect'

export const dynamic = 'force-dynamic'

/** Requests from one network, and emails to one address, per hour. */
const PER_NETWORK = 10
const PER_EMAIL = 3

/**
 * "Forgot password": emails a reset link if the address has an account.
 *
 * The reply is the same whether or not an account exists, and the email goes out after the
 * response, so neither the answer nor its timing tells anyone which addresses are registered.
 * A network that asks too often is told to wait; an address asked about too often silently
 * gets no more emails this hour.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').toLowerCase().trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  if (!(await takeQuota('pwreset-ip', ip, PER_NETWORK))) {
    return NextResponse.json({ error: 'Too many requests from this network. Please try again in an hour.' }, { status: 429 })
  }

  // Where to continue after the new password is set (the builder with a chosen design, say).
  const callbackUrl = safeCallback(typeof body?.callbackUrl === 'string' ? body.callbackUrl : null)

  if (await takeQuota('pwreset-email', email, PER_EMAIL)) {
    sendLater(async () => {
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, password: true } })
      if (!user) return
      const q = new URLSearchParams({ token: createResetToken(user) })
      if (callbackUrl !== '/dashboard') q.set('callbackUrl', callbackUrl)
      await sendMail(passwordResetEmail({ to: user.email, name: user.name, url: `${getAppUrl().replace(/\/$/, '')}/auth/reset?${q}`, minutes: RESET_TTL_MS / 60000 }))
    })
  }

  return NextResponse.json({ ok: true })
}
