import SignupForm from '@/components/auth/SignupForm'
import { safeCallback, templateFromCallback } from '@/lib/authRedirect'
import { designSummary } from '@/lib/designSummary'
import { setServerLang, tFor } from '@/lib/serverLang'

/**
 * Create an account. The return address and the design it opens are read here, on the server: the address
 * only if it stays on this site (lib/authRedirect), the design from the real catalogue.
 */
export default function SignupPage({ params, searchParams }: { params: { lang: string }; searchParams: { callbackUrl?: string; from?: string } }) {
  setServerLang(params.lang)
  const callbackUrl = safeCallback(searchParams.callbackUrl)
  const from = searchParams.from === 'customize' || searchParams.from === 'create' ? searchParams.from : callbackUrl.startsWith('/create') ? 'create' : null
  return <SignupForm callbackUrl={callbackUrl} from={from} design={designSummary(templateFromCallback(callbackUrl))} />
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  return { title: tFor(params.lang)('Create your account'), robots: { index: false, follow: false } }
}
