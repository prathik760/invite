import type { Metadata } from 'next'
import ResetForm from '@/components/auth/ResetForm'
import { safeCallback } from '@/lib/authRedirect'
import { readResetToken } from '@/lib/passwordReset'

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false, follow: false } }

/** The link from the reset email. An expired link says so at once; the signature is checked on save. */
export default function ResetPage({ searchParams }: { searchParams: { token?: string; callbackUrl?: string } }) {
  const token = searchParams.token ?? ''
  const parsed = readResetToken(token)
  return <ResetForm token={token} callbackUrl={safeCallback(searchParams.callbackUrl)} expired={!parsed || parsed.exp < Date.now()} />
}
