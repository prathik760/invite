import LoginForm from '@/components/auth/LoginForm'
import { safeCallback, templateFromCallback } from '@/lib/authRedirect'
import { designSummary } from '@/lib/designSummary'

/**
 * Sign in. The return address and the design it opens are read here, on the server: the address
 * only if it stays on this site (lib/authRedirect), the design from the real catalogue.
 */
export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string; from?: string } }) {
  const callbackUrl = safeCallback(searchParams.callbackUrl)
  const from = searchParams.from === 'customize' || searchParams.from === 'create' ? searchParams.from : callbackUrl.startsWith('/create') ? 'create' : null
  return <LoginForm callbackUrl={callbackUrl} from={from} design={designSummary(templateFromCallback(callbackUrl))} />
}
