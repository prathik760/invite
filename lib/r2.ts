import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export function isR2Configured() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  )
}

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/aac': 'aac',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
}

export async function createPresignedUploadUrl(contentType: string, folder: 'gallery' | 'music' | 'portraits') {
  const bucket = process.env.R2_BUCKET_NAME!
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.replace(/\/$/, '')
  const ext = EXT_MAP[contentType] ?? contentType.split('/')[1] ?? 'bin'
  const key = `${folder}/${nanoid()}.${ext}`

  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
  const publicUrl = `${publicBase}/${key}`

  return { uploadUrl, publicUrl, key }
}

// ─── Cleanup (used by the daily retention job) ────────────────────────────────

const UPLOAD_FOLDERS = ['gallery', 'music', 'portraits'] as const

/**
 * Every R2 object key referenced from an invitation's data (photos, music).
 * Matched by the key's own shape (`gallery/<id>.jpg`), whatever address it was
 * served from: if the bucket's public URL ever changed, invitations saved with
 * the old one must still count as using their photos, or the cleanup would
 * treat those photos as unused and delete them.
 */
export function r2KeysIn(value: unknown): string[] {
  const strings: string[] = []
  const walk = (v: unknown) => {
    if (typeof v === 'string') strings.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(value)
  const text = strings.join('\n')
  const re = new RegExp(`https?://[^\\s"'|]+?/((?:${UPLOAD_FOLDERS.join('|')})/[A-Za-z0-9_\\-]{6,}\\.[a-z0-9]{2,5})(?=[\\s"'|?#]|$)`, 'g')
  const keys = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) keys.add(m[1])
  return Array.from(keys)
}

/** Delete objects in batches of up to 1,000 (the S3 DeleteObjects limit). Returns how many were deleted. */
export async function deleteR2Objects(keys: string[]): Promise<number> {
  if (!keys.length) return 0
  const { DeleteObjectsCommand } = await import('@aws-sdk/client-s3')
  const client = getR2Client()
  const Bucket = process.env.R2_BUCKET_NAME!
  let deleted = 0
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000)
    const res = await client.send(new DeleteObjectsCommand({ Bucket, Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true } }))
    deleted += batch.length - (res.Errors?.length ?? 0)
  }
  return deleted
}

/** Every uploaded object older than `olderThan`, across the upload folders. */
export async function listR2UploadsOlderThan(olderThan: Date): Promise<string[]> {
  const { ListObjectsV2Command } = await import('@aws-sdk/client-s3')
  const client = getR2Client()
  const Bucket = process.env.R2_BUCKET_NAME!
  const keys: string[] = []
  for (const folder of UPLOAD_FOLDERS) {
    let ContinuationToken: string | undefined
    do {
      const res = await client.send(new ListObjectsV2Command({ Bucket, Prefix: `${folder}/`, ContinuationToken }))
      for (const o of res.Contents ?? []) if (o.Key && o.LastModified && o.LastModified < olderThan) keys.push(o.Key)
      ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
    } while (ContinuationToken)
  }
  return keys
}
