import Razorpay from 'razorpay'
import crypto from 'crypto'
import { PLANS, PlanId } from './plans'

let _client: Razorpay | null = null

export function getRazorpayClient(): Razorpay {
  if (!_client) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }
    _client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return _client
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET is not configured')
  const text = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex')
  return expected === signature
}

export function getPlanPrice(planId: PlanId): number {
  const plan = PLANS.find(p => p.id === planId)
  if (!plan || plan.price === 0) throw new Error(`Invalid paid plan: ${planId}`)
  return plan.price * 100 // paise
}
