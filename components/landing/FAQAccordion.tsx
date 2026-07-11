'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What is a digital invitation website?',
    answer: 'A digital invitation website is a mobile-friendly event page guests open from a link. It includes event details, photos, countdown, music, map directions, and guest wishes — all in one beautifully designed page they can save and revisit.',
  },
  {
    question: 'Can guests open the invitation on WhatsApp?',
    answer: 'Yes. ShareInvite creates a shareable link that works on WhatsApp, Instagram, email, and any mobile browser. Guests do not need to install an app — the invite opens instantly in their phone browser.',
  },
  {
    question: 'Is this designed for Indian weddings and family events?',
    answer: 'Yes. The product is built for Indian event workflows where families share invites on WhatsApp and guests need quick access to date, time, venue, maps, and ceremony details. All 10 templates are designed for Indian celebrations — weddings, engagements, birthdays, Griha Pravesh, Namakaran, and anniversaries.',
  },
  {
    question: 'Which plan should I choose?',
    answer: 'Start free with the Elegant Wedding template. If you love the design, upgrade to any paid template with a one-time payment — ₹299 for Cinematic Night, Janamdin, or Namakaran; ₹599 for Shaadi, Mangni, or Griha Pravesh; ₹999 for Saalgirah, KGF Royal Empire, Royal Deco, or Luxury Wedding.',
  },
  {
    question: 'How much does a digital invitation cost in India?',
    answer: 'The Elegant Wedding template is completely free — no credit card, no expiry. Paid templates start at ₹299 as a one-time payment. There are no monthly fees or hidden charges.',
  },
  {
    question: 'Can I add bride and groom photos to the invitation?',
    answer: 'Yes. All paid templates let you upload portrait photos for the bride, groom, or both. The photos are displayed in a beautiful frame on the invitation page.',
  },
  {
    question: 'How do I share the invitation with family and friends?',
    answer: 'After creating your invite, you get a unique link like shareinvite.in/e/your-name. Tap the WhatsApp share button on your invite to forward it to individual contacts or entire family groups in one go.',
  },
  {
    question: 'Can I use this for events other than weddings?',
    answer: 'Absolutely. ShareInvite has 10 templates covering weddings, engagements (Mangni), birthdays (Janamdin), house warmings (Griha Pravesh), naming ceremonies (Namakaran), and anniversaries. If you need a custom design for a different event, use the "Request Custom Template" section to describe your requirements.',
  },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border transition-all duration-300"
            style={{
              borderColor: isOpen ? 'rgba(184,121,36,0.35)' : '#E8DCCD',
              background: isOpen
                ? 'linear-gradient(135deg, rgba(255,248,241,0.9), #ffffff)'
                : '#ffffff',
              boxShadow: isOpen ? '0 4px 24px rgba(184,121,36,0.09)' : '0 1px 4px rgba(60,36,20,0.05)',
            }}
          >
            {/* Gold left accent bar when open */}
            {isOpen && (
              <div
                className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
                style={{ background: 'linear-gradient(180deg, #B87924, #D9A441)' }}
              />
            )}

            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-5 px-7 py-5 text-left"
              aria-expanded={isOpen}
            >
              {/* Ghost number decoration */}
              <span
                className="font-display text-4xl font-bold leading-none tabular-nums mt-0.5 w-10 shrink-0 transition-colors duration-200"
                style={{ color: isOpen ? 'rgba(184,121,36,0.35)' : 'rgba(44,32,28,0.1)' }}
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 min-w-0">
                <h3
                  className="font-heading text-[1.05rem] leading-snug transition-colors duration-200"
                  style={{ color: isOpen ? '#221B17' : '#2C201C' }}
                >
                  {faq.question}
                </h3>

                {/* Answer — animated height via max-height trick */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <p className="mt-3.5 text-sm leading-[1.85] text-muted pr-2">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Toggle icon */}
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5 transition-all duration-200"
                style={{
                  background: isOpen ? 'rgba(184,121,36,0.14)' : 'rgba(44,32,28,0.06)',
                  color: isOpen ? '#B87924' : '#7E716B',
                }}
              >
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
