'use client'

import { useState } from 'react'
import { SUPPORT_WHATSAPP_URL } from '@/lib/support'
import { FAQ_GROUPS, type HomeFaq as Faq } from './faqs'
import { tabKeys } from './tabKeys'
import { useT } from '@/components/i18n/I18nProvider'
import { rich } from '@/lib/translate'

/**
 * Questions, grouped: what people ask before they buy first, then making the
 * invitation, then their guests. Each answer is a native <details> (keyboard
 * and screen-reader friendly), opened smoothly by CSS. Every group stays in
 * the page, the others only hidden, so all answers remain readable to search
 * engines; the same list is the page's FAQPage markup (app/page.tsx).
 */
export default function HomeFaq({ faqs }: { faqs: Faq[] }) {
  const tr = useT()
  const [group, setGroup] = useState(FAQ_GROUPS[0].key)

  return (
    <section id="faq" aria-labelledby="hv-faq-title" className="hv-sec scroll-mt-20 bg-hv-linen">
      <div className="hv-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <h2 id="hv-faq-title" className="hv-h2 lg:max-w-[28rem]">
            {tr('Questions about digital invitations')}
          </h2>
          <div role="tablist" aria-label={tr('Question groups')} onKeyDown={tabKeys(FAQ_GROUPS.length, FAQ_GROUPS.findIndex((g) => g.key === group), (i) => setGroup(FAQ_GROUPS[i].key), (i) => `hv-faq-tab-${FAQ_GROUPS[i].key}`)} className="hv-rail -mx-[var(--hv-gutter)] mt-8 flex gap-2 overflow-x-auto px-[var(--hv-gutter)] lg:mx-0 lg:flex-col lg:items-start lg:gap-1 lg:px-0">
            {FAQ_GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                role="tab"
                id={`hv-faq-tab-${g.key}`}
                aria-selected={group === g.key}
                tabIndex={group === g.key ? 0 : -1}
                aria-controls={`hv-faq-${g.key}`}
                onClick={() => setGroup(g.key)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[0.98rem] font-medium transition-colors lg:rounded-none lg:border-l-2 lg:px-4 lg:py-2 ${group === g.key ? 'bg-hv-forest text-hv-ivory lg:border-hv-gold lg:bg-transparent lg:font-semibold lg:text-hv-ink' : 'border border-hv-ink/15 text-hv-ink/70 hover:text-hv-ink lg:border-0 lg:border-l-2 lg:border-transparent'}`}
              >
                {tr(g.label)}
                <span className="ml-1.5 opacity-60">{faqs.filter((f) => f.group === g.key).length}</span>
              </button>
            ))}
          </div>
          <p className="mt-8 max-w-[22rem] text-[1rem] leading-[1.7] text-hv-muted max-lg:hidden">
            {rich(tr('Didn’t find your answer? Message us on {link}. A person replies.'), {
              link: (
                <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hv-textlink">
                  WhatsApp
                </a>
              ),
            })}
          </p>
        </div>

        <div data-reveal>
          {FAQ_GROUPS.map((g) => (
            <div key={g.key} id={`hv-faq-${g.key}`} role="tabpanel" aria-labelledby={`hv-faq-tab-${g.key}`} hidden={group !== g.key} className="border-t border-hv-ink/15">
              {faqs
                .filter((f) => f.group === g.key)
                .map((f, i) => (
                  <details key={f.question} className="hv-faq border-b border-hv-ink/15" open={i === 0}>
                    <summary className="flex items-start justify-between gap-6 py-6">
                      <span className="hv-serif text-[1.4rem] font-semibold leading-snug text-hv-ink sm:text-[1.6rem]">{f.question}</span>
                      <span aria-hidden className="hv-faq-icon mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hv-ink/20 text-hv-forest">
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                          <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="hv-faq-a max-w-[42rem] pb-7 pr-12 text-[1.05rem] leading-[1.8] text-hv-muted">{f.answer}</p>
                  </details>
                ))}
            </div>
          ))}
          <p className="mt-8 text-[1rem] leading-[1.7] text-hv-muted lg:hidden">
            {rich(tr('Didn’t find your answer? Message us on {link}. A person replies.'), {
              link: (
                <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hv-textlink">
                  WhatsApp
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
