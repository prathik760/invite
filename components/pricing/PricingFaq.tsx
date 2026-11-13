import Link from '@/components/ui/Link'
import { withLocalPrices } from '@/components/price/localised'

export interface PricingQuestion {
  question: string
  answer: string
  /** A page the answer points to, shown as a link after it (and part of the FAQ JSON-LD text). */
  link?: { href: string; label: string }
}

/** The answer as plain text, exactly as shown, for the FAQPage JSON-LD (Google wants the two to match). */
export function answerText(q: PricingQuestion): string {
  return q.link ? `${q.answer} ${q.link.label}.` : q.answer
}

/**
 * The Pricing page's questions as native disclosure widgets: every answer is in the HTML (for
 * readers without JavaScript and for search engines), several can be open at once, and the
 * keyboard and screen readers get the platform's own behaviour. The first is open.
 */
export default function PricingFaq({ items }: { items: PricingQuestion[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {items.map((q, i) => (
        <details key={q.question} open={i === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="flex-1 font-editorial text-[1.35rem] font-semibold leading-snug text-charcoal transition-colors group-hover:text-emerald-soft sm:text-[1.5rem]">{q.question}</h3>
            <span
              aria-hidden
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-charcoal transition-all duration-300 group-open:rotate-45 group-open:border-emerald group-open:bg-emerald group-open:text-paper"
            >
              <span className="absolute h-[1.5px] w-3.5 rounded bg-current" />
              <span className="absolute h-3.5 w-[1.5px] rounded bg-current" />
            </span>
          </summary>
          <div className="max-w-2xl pb-7 pr-12 text-[0.98rem] leading-8 text-charcoal/75">
            {withLocalPrices(q.answer)}
            {q.link && (
              <>
                {' '}
                <Link href={q.link.href} className="font-semibold text-emerald-soft underline decoration-burnished/50 underline-offset-4 hover:text-emerald">
                  {q.link.label}
                </Link>
                .
              </>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
