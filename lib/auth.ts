import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null
      try {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })
        if (!user?.password) return null
        const ok = await bcrypt.compare(credentials.password, user.password)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name ?? undefined }
      } catch {
        return null
      }
    },
  }),
]

// Google sign-in / sign-up is enabled only when credentials are configured, so
// the app keeps working (email + password) even before Google OAuth is set up.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // link Google to an existing email/password account
    }),
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    // Persist Google users in our own user table (password stays null) so the
    // rest of the app can reference a real DB user id — same store as email/password.
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase().trim()
        if (!email) return false
        try {
          await prisma.user.upsert({
            where: { email },
            update: { name: user.name ?? undefined },
            create: { email, name: user.name ?? undefined },
          })
        } catch {
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials' && user) {
        // Credentials authorize() already returns our DB id.
        token.id = user.id
      } else if (account?.provider === 'google') {
        // Map the Google login to our DB user (created/updated in signIn above).
        const email = (user?.email || token.email)?.toLowerCase().trim()
        if (email) {
          const dbUser = await prisma.user.findUnique({ where: { email } })
          if (dbUser) token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
