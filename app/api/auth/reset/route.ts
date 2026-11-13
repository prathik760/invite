import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { checkResetToken, readResetToken } from '@/lib/passwordReset'
import { takeQuota } from '@/lib/uploadQuota'

export const dynamic = 'force-dynamic'

const EXPIRED = 'This reset link has expired or has already been used. Ask for a new one from the sign-in page.'

/**
 * Sets a new password from a reset link (lib/passwordReset). The link must be unexpired and
 * signed for the account's current password, so it works once. Returns the account's email so
 * the page can sign the person straight in: whoever holds a valid link has the inbox anyway.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const token = body?.token
  const password = String(body?.password ?? '')

  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  if (password.length > 72) return NextResponse.json({ error: 'Password must be 72 characters or less.' }, { status: 400 })

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  if (!(await takeQuota('pwreset-try', ip, 20))) {
    return NextResponse.json({ error: 'Too many attempts from this network. Please try again in an hour.' }, { status: 429 })
  }

  const parsed = readResetToken(token)
  if (!parsed) return NextResponse.json({ error: EXPIRED, code: 'TOKEN_INVALID' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id: parsed.userId }, select: { id: true, email: true, password: true } })
  if (!user || !checkResetToken(token as string, user)) {
    return NextResponse.json({ error: EXPIRED, code: 'TOKEN_INVALID' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  // Only if the password is still the one the link was signed for (two tabs racing cannot both win).
  const updated = await prisma.user.updateMany({ where: { id: user.id, password: user.password }, data: { password: hashed } })
  if (updated.count !== 1) return NextResponse.json({ error: EXPIRED, code: 'TOKEN_INVALID' }, { status: 400 })

  return NextResponse.json({ ok: true, email: user.email })
}
