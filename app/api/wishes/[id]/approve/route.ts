import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { approveLocalWish, deleteLocalWish, shouldUseLocalStore } from '@/lib/local-store'

export const dynamic = 'force-dynamic'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const wish = await prisma.wish.update({
      where: { id: params.id },
      data: { isApproved: true },
    })
    return NextResponse.json(wish)
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
  try {
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
