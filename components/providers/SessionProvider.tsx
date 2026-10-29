'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

/**
 * Who is signed in, for the builder (app/create/layout.tsx), the only page that
 * reads it with useSession. Mounted there alone: in the root layout it asked
 * /api/auth/session on every page anyone opened, a metered server call each,
 * nearly always for a visitor who had never signed in. Not re-asked when the
 * tab regains focus, for the same reason; a sign-in elsewhere is picked up on
 * the next page load. signIn and signOut work without it.
 */
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider refetchOnWindowFocus={false}>{children}</NextAuthSessionProvider>
}
