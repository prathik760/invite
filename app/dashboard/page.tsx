import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata = { title: 'Dashboard — Invitely' }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/dashboard')

  return (
    <DashboardClient
      user={{ name: session.user?.name ?? null, email: session.user?.email ?? null }}
    />
  )
}
