import type { Metadata } from 'next'
import ForgotForm from '@/components/auth/ForgotForm'
import { authOrigin, safeCallback } from '@/lib/authRedirect'

export const metadata: Metadata = { title: 'Forgot password', robots: { index: false, follow: false } }

export default function ForgotPage({ searchParams }: { searchParams: { callbackUrl?: string; from?: string } }) {
  const from = authOrigin(searchParams.from, safeCallback(searchParams.callbackUrl))
  return <ForgotForm callbackUrl={safeCallback(searchParams.callbackUrl)} from={from} />
}
