import ForgotForm from '@/components/auth/ForgotForm'
import { authOrigin, safeCallback } from '@/lib/authRedirect'
import { setServerLang, tFor } from '@/lib/serverLang'


export default function ForgotPage({ params, searchParams }: { params: { lang: string }; searchParams: { callbackUrl?: string; from?: string } }) {
  setServerLang(params.lang)
  const from = authOrigin(searchParams.from, safeCallback(searchParams.callbackUrl))
  return <ForgotForm callbackUrl={safeCallback(searchParams.callbackUrl)} from={from} />
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  return { title: tFor(params.lang)('Forgot password'), robots: { index: false, follow: false } }
}
