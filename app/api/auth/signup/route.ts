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

  if (String(password).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(String(password), 12)
    const user = await prisma.user.create({
      data: { email: trimmedEmail, password: hashed, name: trimmedName },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
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
