import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createPresignedUploadUrl, isR2Configured } from '@/lib/r2'

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_AUDIO_TYPES = new Set(['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg'])

const MAX_IMAGE_BYTES = 5 * 1024 * 1024   // 5 MB
const MAX_AUDIO_BYTES = 15 * 1024 * 1024  // 15 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to upload files' }, { status: 401 })
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'File storage not configured' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const { contentType, size, folder } = body ?? {}

  if (!contentType || typeof contentType !== 'string') {
    return NextResponse.json({ error: 'contentType is required' }, { status: 400 })
  }

  if (folder !== 'gallery' && folder !== 'music') {
    return NextResponse.json({ error: 'folder must be gallery or music' }, { status: 400 })
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(contentType)
  const isAudio = ALLOWED_AUDIO_TYPES.has(contentType)

  if (!isImage && !isAudio) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }
  if (folder === 'gallery' && !isImage) {
    return NextResponse.json({ error: 'Only images allowed in gallery' }, { status: 400 })
  }
  if (folder === 'music' && !isAudio) {
    return NextResponse.json({ error: 'Only audio files allowed for music' }, { status: 400 })
  }

  if (typeof size !== 'number' || size <= 0) {
    return NextResponse.json({ error: 'file size is required' }, { status: 400 })
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES
  if (size > maxBytes) {
    const mb = Math.round(maxBytes / 1024 / 1024)
    return NextResponse.json({ error: `File too large — max ${mb} MB` }, { status: 413 })
  }

  try {
    const result = await createPresignedUploadUrl(contentType, folder)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[upload] presign error', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
