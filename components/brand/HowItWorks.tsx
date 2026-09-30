import type { Tone } from '@/components/brand/Section'
import { EyeIcon, LinkIcon, PenIcon } from '@/components/ui/Icons'

const DEFAULT_STEPS = [
  {
    Icon: EyeIcon,
    title: 'Choose a design',
    copy: 'Browse by occasion and open any design in a live preview — exactly what your guests will see.',
  },
  {
    Icon: PenIcon,
    title: 'Make it yours',
    copy: 'Add names, date, venue, photos and music. Switch designs any time — your details come with you.',
  },
  {
    Icon: LinkIcon,
    title: 'Pay once & share',
    copy: 'Pay once for your design, then send one link on WhatsApp, Instagram, email or text.',
  },
]

/**
 * The three steps, shared by the homepage and every occasion page so the
 * promise reads the same everywhere. Pass `steps` to reword for an occasion.
 */
export default function HowItWorks({
  steps = DEFAULT_STEPS,
  tone = 'peach',
}: {
  steps?: { title: string; copy: string; Icon?: (p: { className?: string }) => JSX.Element }[]
  tone?: Tone
}) {
  const dark = tone === 'emerald' || tone === 'charcoal'
  return (
    <ol className="relative grid gap-4 md:grid-cols-3 md:gap-5" data-reveal-group>
      {steps.map((step, i) => {
        const Icon = step.Icon ?? DEFAULT_STEPS[i % 3].Icon
        return (
          <li
            key={step.title}
            className={`relative rounded-3xl border p-7 ${dark ? 'border-paper/15 bg-paper/[0.06]' : 'border-line bg-paper shadow-soft'}`}
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${dark ? 'bg-gold-soft text-emerald-deep' : 'bg-emerald text-paper'}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className={`font-editorial text-[3.2rem] font-semibold leading-none ${dark ? 'text-paper/15' : 'text-burnished/25'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="t-h3 mt-6">{step.title}</h3>
            <p className={`mt-2 text-[0.98rem] leading-7 ${dark ? 'text-paper/70' : 'text-charcoal/75'}`}>{step.copy}</p>
          </li>
        )
      })}
    </ol>
  )
}
