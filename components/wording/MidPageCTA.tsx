import Link from 'next/link'
import { LogoMark } from '@/components/brand/Logo'
import { CheckIcon } from '@/components/ui/Icons'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { Price } from '@/components/price/Price'

interface MidPageCTAProps {
  headline: string
  body: string
  features: [string, string, string, string]
  ctaHref: string
  ctaText: string
}

/** Inline offer between wording sections: "use these words in a real design". */
export default function MidPageCTA({ headline, body, features, ctaHref, ctaText }: MidPageCTAProps) {
  return (
    <aside className="relative my-10 overflow-hidden rounded-[2rem] bg-emerald p-7 text-paper shadow-lift sm:p-9" data-reveal>
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold-soft/10 blur-2xl" />
      <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-gold-soft">Why stop at plain text?</p>
          <h3 className="t-h3 mt-2">{headline}</h3>
          <p className="mt-2 text-[0.95rem] leading-7 text-paper/75">{body}</p>
        </div>
        <LogoMark className="hidden h-12 w-12 sm:block" />
      </div>
      <ul className="relative mt-6 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[0.9rem] leading-6 text-paper/85">
            <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-gold-soft" />
            {f}
          </li>
        ))}
      </ul>
      <div className="relative mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Link href={ctaHref} className="btn-gold inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[0.95rem] font-semibold">
          {ctaText.replace(/\s*→$/, '')}
        </Link>
        <p className="text-[0.8rem] text-paper/60">Preview before you pay · Pay once, from <Price inr={LOWEST_PAID_PRICE} /></p>
      </div>
    </aside>
  )
}
