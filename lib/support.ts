/**
 * Single source for how a customer reaches a human.
 *
 * The WhatsApp number used to be hard-coded inside the floating button alone,
 * which meant the one place it was most needed — a failed payment — had no way
 * to reach support at all. Everything that offers help now imports from here.
 */

/** Digits only, international format, no '+' — the form wa.me expects. */
export const SUPPORT_WHATSAPP = '916361770366'

/** Display form, for when the number itself is shown to a customer. */
export const SUPPORT_WHATSAPP_DISPLAY = '+91 63617 70366'

export const SUPPORT_EMAIL = 'shareinvite123@gmail.com'

/**
 * A wa.me link with the message pre-filled.
 *
 * Pass the specific context (payment reference, template name) so the customer
 * does not have to explain their problem from scratch — for a payment failure
 * that context is the difference between a refund request and a rescued sale.
 */
export function supportWhatsAppUrl(message: string): string {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`
}

/** Default enquiry link used by the floating button. */
export const SUPPORT_WHATSAPP_URL = supportWhatsAppUrl('Hi, I want to enquire about ShareInvite')
