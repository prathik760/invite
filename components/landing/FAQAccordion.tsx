'use client'

import { useState } from 'react'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'

export interface Faq {
  question: string
  answer: string
}

const defaultFaqs: Faq[] = [
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
    answer: 'Yes. The product is built for Indian event workflows where families share invites on WhatsApp and guests need quick access to date, time, venue, maps, and ceremony details. Every template is designed for Indian celebrations — weddings, engagements, birthdays, Griha Pravesh, Namakaran, and anniversaries.',
  },
  {
    question: 'Which template should I choose, and what does it cost?',
    answer: `Build and preview any design before you pay, then pay once for the one you publish. Each design shows its own price, from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')} to ₹${HIGHEST_PAID_PRICE.toLocaleString('en-IN')}.`,
  },
  {
    question: 'How much does a digital invitation cost in India?',
    answer: 'There is no payment until you publish — you can build and preview the whole invitation first, with no card needed. Publishing is a one-time payment for the design you choose, and the price is shown on the design. There are no monthly fees or hidden charges.',
  },
  {
    question: 'Can I add bride and groom photos to the invitation?',
    answer: 'Yes. Templates let you upload portrait photos for the bride, groom, or both. The photos are displayed in a beautiful frame on the invitation page.',
  },
  {
    question: 'How do I share the invitation with family and friends?',
    answer: 'After creating your invite, you get a unique link like shareinvite.in/e/your-name. Tap the WhatsApp share button on your invite to forward it to individual contacts or entire family groups in one go.',
  },
  {
    question: 'Can I use this for events other than weddings?',
    answer: 'Absolutely. ShareInvite has templates covering weddings, engagements (Mangni), birthdays (Janamdin), house warmings (Griha Pravesh), naming ceremonies (Namakaran), and anniversaries. If you need a custom design for a different event, use the "Request Custom Template" section to describe your requirements.',
  },
]

/**
 * `faqs` is a prop so a page can render exactly the questions it also emits as
 * FAQPage JSON-LD. Google requires FAQ structured data to match content that is
 * visible on the page — /pricing previously shipped five pricing questions in
 * its schema while rendering these eight generic ones.
 */
export default function FAQAccordion({ faqs = defaultFaqs }: { faqs?: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line" data-reveal>
      {faqs.map((faq, i) => {
        const isOpen = open === i
        const id = `faq-${i}`
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 py-6 text-left"
                aria-expanded={isOpen}
                aria-controls={id}
              >
                <span className="flex-1 font-editorial text-[1.35rem] font-semibold leading-snug text-charcoal transition-colors group-hover:text-emerald-soft sm:text-[1.5rem]">
                  {faq.question}
                </span>
                <span
                  aria-hidden
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen ? 'rotate-45 border-emerald bg-emerald text-paper' : 'border-line bg-paper text-charcoal group-hover:border-burnished'
                  }`}
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded bg-current" />
                  <span className="absolute h-3.5 w-[1.5px] rounded bg-current" />
                </span>
              </button>
            </h3>
            {/* grid-rows 0fr → 1fr animates to the answer's real height,
                where a max-height guess either clipped long answers or lagged. */}
            <div
              id={id}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pr-12 text-[0.98rem] leading-8 text-charcoal/75">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
