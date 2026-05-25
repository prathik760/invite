import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { name, email, password } = body ?? {}

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const trimmedEmail = String(email).toLowerCase().trim()
  const trimmedName = name ? String(name).trim() : undefined

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (trimmedName && trimmedName.length > 100) {
    return NextResponse.json({ error: 'Name must be 100 characters or less.' }, { status: 400 })
  }

  if (String(password).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  if (String(password).length > 72) {
    return NextResponse.json({ error: 'Password must be 72 characters or less.' }, { status: 400 })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } })
    if (existing) {
      // Return 400 not 409 — prevents user enumeration via distinct status codes
      return NextResponse.json({ error: 'Unable to create account. Please check your details.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(String(password), 12)
    await prisma.user.create({
      data: { email: trimmedEmail, password: hashed, name: trimmedName },
    })

    // Return minimal response — never expose internal user IDs to the client
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/auth/signup]', msg)
    // Surface DB column/table errors clearly in development
    if (process.env.NODE_ENV !== 'production' && msg) {
      return NextResponse.json({ error: msg }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
  }
}
