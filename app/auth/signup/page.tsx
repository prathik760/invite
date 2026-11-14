import SignupForm from '@/components/auth/SignupForm'
import { authOrigin, safeCallback, templateFromCallback } from '@/lib/authRedirect'
import { designSummary } from '@/lib/designSummary'

/**
 * Create an account. The return address and the design it opens are read here, on the server: the address
 * only if it stays on this site (lib/authRedirect), the design from the real catalogue.
 */
export default function SignupPage({ searchParams }: { searchParams: { callbackUrl?: string; from?: string } }) {
  const callbackUrl = safeCallback(searchParams.callbackUrl)
  const from = authOrigin(searchParams.from, callbackUrl)
  return <SignupForm callbackUrl={callbackUrl} from={from} design={designSummary(templateFromCallback(callbackUrl))} />
}
