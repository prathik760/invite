import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/db'
import { isMissingReviewTable, REVIEW_LIMITS, REVIEWS_TAG, reviewForToken } from '@/lib/reviews'
import { templateSeoSlug } from '@/lib/seo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '')

/**
 * A host's review, from their private link (app/review/[token]). The token is
 * the only proof needed: it was sent to the host alone, and names their
 * invitation. Sending again replaces the review; one already on the site goes
 * back to the owner to approve again.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const rating = Number(body?.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Choose from one to five stars.' }, { status: 400 })
  }
  const name = clean(body?.name, REVIEW_LIMITS.name)
  if (!name) return NextResponse.json({ error: 'Add the name to sign your review with.' }, { status: 400 })
  const text = typeof body?.text === 'string' ? body.text.trim().slice(0, REVIEW_LIMITS.text) : ''
  const city = clean(body?.city, REVIEW_LIMITS.city)
  const publish = body?.publish === true

  try {
    const review = await reviewForToken(String(body?.token ?? ''))
    if (!review) return NextResponse.json({ error: 'This review link is not valid.' }, { status: 404 })

    const wasShown = review.status === 'approved'
    await prisma.review.update({
      where: { id: review.id },
      data: { rating, name, city: city || null, text: text || null, publish, status: 'submitted', submittedAt: new Date() },
    })
    // A review on the site leaves it until the owner approves the new words.
    if (wasShown) {
      revalidateTag(REVIEWS_TAG)
      revalidatePath('/')
      revalidatePath(`/templates/${templateSeoSlug(review.templateId)}`)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (isMissingReviewTable(err)) return NextResponse.json({ error: 'Reviews are not open yet. Please try again tomorrow.' }, { status: 503 })
    console.error('[POST /api/reviews]', err)
    return NextResponse.json({ error: 'Your review could not be saved. Please try again.' }, { status: 500 })
  }
}
