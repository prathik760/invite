import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { approveLocalWish, deleteLocalWish, shouldUseLocalStore } from '@/lib/local-store'

export const dynamic = 'force-dynamic'

async function verifyWishOwnership(wishId: string, userId: string): Promise<'ok' | 'not_found' | 'forbidden'> {
  const wish = await prisma.wish.findUnique({
    where: { id: wishId },
    select: { event: { select: { userId: true } } },
  })
  if (!wish) return 'not_found'
  if (wish.event.userId !== userId) return 'forbidden'
  return 'ok'
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const ownership = await verifyWishOwnership(params.id, session.user.id)
    if (ownership === 'not_found') return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
    if (ownership === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.wish.update({
      where: { id: params.id },
      data: { isApproved: true },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const wish = await approveLocalWish(params.id)
      if (!wish) return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
      console.warn('[PATCH /api/wishes/:id/approve] Database unreachable, approved local dev wish.')
      return NextResponse.json(wish)
    }
    console.error('[PATCH /api/wishes/:id/approve]', err)
    return NextResponse.json({ error: 'Failed to approve wish' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const ownership = await verifyWishOwnership(params.id, session.user.id)
    if (ownership === 'not_found') return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
    if (ownership === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.wish.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const deleted = await deleteLocalWish(params.id)
      if (!deleted) return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
      console.warn('[DELETE /api/wishes/:id/approve] Database unreachable, deleted local dev wish.')
      return NextResponse.json({ ok: true })
    }
    console.error('[DELETE /api/wishes/:id/approve]', err)
    return NextResponse.json({ error: 'Failed to delete wish' }, { status: 500 })
  }
}
