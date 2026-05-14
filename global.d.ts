declare module '*.css' {
  const content: Record<string, string>
  export default content
}

import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

// ─── Razorpay ───────────────────────────────────────────────────────────────

declare global {
  interface RazorpayOptions {
    key: string
    amount: number | string
    currency: string
    name?: string
    description?: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    prefill?: { name?: string; email?: string; contact?: string }
    theme?: { color?: string }
    modal?: { ondismiss?: () => void }
  }

  interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }

  interface RazorpayInstance {
    open(): void
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
