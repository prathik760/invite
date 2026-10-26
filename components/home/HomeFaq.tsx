import Link from '@/components/ui/Link'
import type { Faq } from '@/components/landing/FAQAccordion'
import { LOCALES, localePath } from '@/lib/i18n'
import { SUPPORT_WHATSAPP_DISPLAY, supportWhatsAppUrl } from '@/lib/support'

/**
 * Questions and answers as a plain list. Native <details>, so it needs no
 * JavaScript, and every answer is in the HTML, which the FAQPage markup on
 * the homepage needs (it must match what is on the page).
 */
export default function HomeFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-charcoal/10 bg-paper">
      <div className="shell py-10 sm:py-12 lg:py-14">
        {/* Laptop: heading, languages and the WhatsApp note in one row, questions in two columns below. */}
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="faq-heading" className="font-editorial text-balance text-[2.2rem] font-medium leading-[1.04] sm:text-[2.8rem] lg:col-span-5">
            Questions about digital invitations
          </h2>
          <p className="mt-4 max-w-xs text-[1rem] leading-7 text-charcoal/70 lg:col-span-4 lg:mt-0 lg:max-w-none lg:text-[0.95rem] lg:leading-6">
            Write your invitation in any language you like, or in two. This site can also be read in{' '}
            {LOCALES.filter((l) => l.code !== 'en').map((l, i, all) => (
              <span key={l.code}>
                <Link
                  href={localePath('/', l.code)}
                  hrefLang={l.htmlLang}
                  lang={l.htmlLang}
                  dir={l.dir}
                  prefetch={false}
                  className="text-charcoal underline decoration-charcoal/25 underline-offset-4 hover:decoration-burnished"
                >
                  {l.label}
                </Link>
                {i < all.length - 2 ? ', ' : i === all.length - 2 ? ' and ' : '.'}
              </span>
            ))}
          </p>
          <div className="mt-6 border-l-2 border-burnished/60 pl-4 lg:col-span-3 lg:mt-0">
            <p className="font-editorial text-[1.3rem] font-medium leading-tight">Didn&apos;t find your answer?</p>
            <p className="mt-1.5 text-[0.95rem] leading-6 text-charcoal/70">
              Ask us on WhatsApp at{' '}
              <a
                href={supportWhatsAppUrl('Hi, I have a question about ShareInvite')}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap font-semibold text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:decoration-burnished"
              >
                {SUPPORT_WHATSAPP_DISPLAY}
              </a>
              . A person reads every message.
            </p>
          </div>
        </div>

        <div className="mt-10 lg:mt-9 lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* The first answer starts open, so its column gets one question fewer. */}
          {[faqs.slice(0, Math.floor(faqs.length / 2)), faqs.slice(Math.floor(faqs.length / 2))].map((column, c) => (
            <div key={c} className={c === 0 ? 'border-t border-charcoal/15' : 'lg:border-t lg:border-charcoal/15'}>
              {column.map((f) => (
                <details key={f.question} open={f === faqs[0]} className="group border-b border-charcoal/15">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="font-editorial text-[1.4rem] font-medium leading-snug sm:text-[1.5rem]">{f.question}</span>
                    <span aria-hidden className="shrink-0 text-[1.4rem] leading-none text-burnished transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-[40rem] pb-5 text-[1rem] leading-7 text-charcoal/75">{f.answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
