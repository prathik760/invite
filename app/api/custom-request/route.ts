import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { name, email, phone, eventType, description } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !eventType?.trim() || !description?.trim()) {
    return NextResponse.json({ error: 'Name, email, event type and description are required.' }, { status: 400 })
  }

  // Validate email format to prevent garbage data in the admin view
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Length limits to prevent DB bloat
  if (name.trim().length > 120) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  }
  if (description.trim().length > 2000) {
    return NextResponse.json({ error: 'Description must be 2000 characters or less.' }, { status: 400 })
  }

  // Store as a special Wish record on a dedicated "custom-requests" event
  // We reuse the Wish model so no schema migration is needed.
  // Format: name = "name | email | phone | eventType", message = description
  try {
    // Find or create a sentinel event for custom requests
    let sentinelEvent = await prisma.event.findFirst({ where: { slug: '__custom-requests__' } }).catch(() => null)
    if (!sentinelEvent) {
      sentinelEvent = await prisma.event.create({
        data: {
          slug: '__custom-requests__',
          templateId: 'custom-request',
          data: {},
          isPaid: false,
        },
      }).catch(() => null)
    }

    if (sentinelEvent) {
      await prisma.wish.create({
        data: {
          eventId: sentinelEvent.id,
          name: `${name.trim()} | ${email.trim()} | ${phone?.trim() || '—'} | ${eventType.trim()}`,
          message: description.trim(),
          isApproved: false,
        },
      })
    }
  } catch {
    // Silently continue — DB might not be available (local store mode)
  }

  return NextResponse.json({ success: true })
}
