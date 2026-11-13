import ResetForm from '@/components/auth/ResetForm'
import { safeCallback } from '@/lib/authRedirect'
import { readResetToken } from '@/lib/passwordReset'
import { setServerLang, tFor } from '@/lib/serverLang'


/** The link from the reset email. An expired link says so at once; the signature is checked on save. */
export default function ResetPage({ params, searchParams }: { params: { lang: string }; searchParams: { token?: string; callbackUrl?: string } }) {
  setServerLang(params.lang)
  const token = searchParams.token ?? ''
  const parsed = readResetToken(token)
  return <ResetForm token={token} callbackUrl={safeCallback(searchParams.callbackUrl)} expired={!parsed || parsed.exp < Date.now()} />
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  return { title: tFor(params.lang)('Choose a new password'), robots: { index: false, follow: false } }
}
