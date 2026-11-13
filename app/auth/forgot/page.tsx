import type { Metadata } from 'next'
import ForgotForm from '@/components/auth/ForgotForm'
import { safeCallback } from '@/lib/authRedirect'

export const metadata: Metadata = { title: 'Forgot password', robots: { index: false, follow: false } }

export default function ForgotPage({ searchParams }: { searchParams: { callbackUrl?: string; from?: string } }) {
  const from = searchParams.from === 'customize' || searchParams.from === 'create' ? searchParams.from : null
  return <ForgotForm callbackUrl={safeCallback(searchParams.callbackUrl)} from={from} />
}
