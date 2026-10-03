import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createPresignedUploadUrl, isR2Configured } from '@/lib/r2'
import { takeGuestUpload } from '@/lib/uploadQuota'

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_AUDIO_TYPES = new Set(['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg'])

const MAX_IMAGE_BYTES = 5 * 1024 * 1024   // 5 MB
const MAX_AUDIO_BYTES = 15 * 1024 * 1024  // 15 MB

/*
 * Uploads no longer need an account: people add their photos while building,
 * before they decide to pay. The size and type limits below still apply (the
 * size is signed into the upload URL, so storage enforces it too), every
 * upload no published invitation uses is deleted after ORPHAN_UPLOAD_DAYS by
 * the daily cleanup, and a signed-out visitor gets a modest hourly allowance
 * (lib/uploadQuota.ts).
 */
function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'File storage not configured' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const { contentType, size, folder } = body ?? {}

  if (!contentType || typeof contentType !== 'string') {
    return NextResponse.json({ error: 'contentType is required' }, { status: 400 })
  }

  if (folder !== 'gallery' && folder !== 'music' && folder !== 'portraits') {
    return NextResponse.json({ error: 'folder must be gallery, portraits, or music' }, { status: 400 })
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(contentType)
  const isAudio = ALLOWED_AUDIO_TYPES.has(contentType)

  if (!isImage && !isAudio) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }
  if ((folder === 'gallery' || folder === 'portraits') && !isImage) {
    return NextResponse.json({ error: 'Only images allowed in gallery/portraits' }, { status: 400 })
  }
  if (folder === 'music' && !isAudio) {
    return NextResponse.json({ error: 'Only audio files allowed for music' }, { status: 400 })
  }

  if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
    return NextResponse.json({ error: 'file size is required' }, { status: 400 })
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES
  if (size > maxBytes) {
    const mb = Math.round(maxBytes / 1024 / 1024)
    return NextResponse.json({ error: `File too large — max ${mb} MB` }, { status: 413 })
  }

  // Counted only for a request that would get an upload URL.
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user && !(await takeGuestUpload(clientIp(req)))) {
    return NextResponse.json({ error: 'Too many uploads for now — please try again in a little while.' }, { status: 429 })
  }

  try {
    const result = await createPresignedUploadUrl(contentType, folder, size)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[upload] presign error', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
