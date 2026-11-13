import CustomRequestForm from '@/components/landing/CustomRequestForm'
import { serverT } from '@/lib/serverLang'

export default function CustomRequestSection() {
  const t = serverT()
  return (
    <section id="custom-template" className="hv-sec relative border-t border-hv-line bg-hv-ivory">
      <div className="hv-shell relative">
        <div className="grid gap-12 max-sm:gap-8 lg:grid-cols-2 lg:items-start lg:gap-20">

          {/* ── Left: Copy ── */}
          <div>
            <p className="hv-kicker">{t('Custom designs')}</p>

            <h2 className="hv-h2 mt-5 lg:max-w-[30rem]">{t('Celebrating something else? We’ll design it.')}</h2>

            <p className="hv-lede mt-6 max-w-md">
              {t('Baby shower, graduation, a corporate launch, a reunion: tell us your vision and our design team will craft an invitation for your event, style and language.')}
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-4 max-sm:mt-6 max-sm:space-y-3">
              {[
                { title: 'Tailored design language', desc: 'Custom colors, fonts, motifs matching your exact theme' },
                { title: 'Any occasion or occasion style', desc: 'Fusion, regional, modern, or completely original' },
                { title: 'Fast turnaround', desc: 'Your custom template ready in 2–5 working days' },
                { title: 'Delivered as a live link', desc: 'Same WhatsApp-shareable invite website as all templates' },
              ].map(item => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-hv-gold" aria-hidden />
                  <div>
                    <p className="text-[0.95rem] font-semibold text-hv-ink">{t(item.title)}</p>
                    <p className="mt-0.5 text-[0.88rem] leading-6 text-hv-muted">{t(item.desc)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* A "12+ custom templates delivered this month" line with stock
                pravatar.cc faces labelled "ShareInvite customer" used to sit here.
                Neither the count nor the people were real, so it was removed. */}
          </div>

          {/* ── Right: Form ── */}
          <div
            className="rounded-[1.5rem] border border-hv-line bg-white p-7 shadow-[0_40px_80px_-60px_rgba(12,43,34,0.6)] max-sm:p-5 sm:p-9"
            data-reveal="right"
          >
            <CustomRequestForm />
          </div>
        </div>
      </div>
    </section>
  )
}
