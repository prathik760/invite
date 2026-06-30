import Link from 'next/link'

interface MidPageCTAProps {
  headline: string
  body: string
  features: [string, string, string, string]
  ctaHref: string
  ctaText: string
}

export default function MidPageCTA({ headline, body, features, ctaHref, ctaText }: MidPageCTAProps) {
  return (
    <div className="my-10 rounded-2xl border border-[#E8DCCD] bg-gradient-to-br from-[#FFF7EE] to-[#FFF3E4] px-7 py-8 shadow-sm">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#7A5C1E]">
        Why stop at plain text?
      </p>
      <h3 className="font-display font-normal text-xl text-ink leading-snug mb-2">
        {headline}
      </h3>
      <p className="text-sm text-muted leading-6 mb-6">{body}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-7">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-foreground leading-5">
            <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#2F766D]/15 text-[9px] font-bold text-[#2F766D]">
              ✓
            </span>
            {f}
          </div>
        ))}
      </div>
      <Link
        href={ctaHref}
        className="gold-button inline-flex rounded-full px-7 py-3 text-sm font-semibold"
      >
        {ctaText}
      </Link>
      <p className="mt-2.5 text-[11px] text-muted">
        Free plan · Ready in 5 min · No credit card needed
      </p>
    </div>
  )
}
