import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import { EyeIcon, SparklesIcon } from '@/components/ui/Icons'
import { TEMPLATES } from '@/modules/templates/data'
import { templateImage } from '@/lib/templateMedia'
import { templateSeoSlug } from '@/lib/seo'
import { displayName } from '@/lib/catalog'

/**
 * The /templates hero visual: a hand of real invitations fanned under the
 * gilt arch — the same catalogue images as the gallery below, each one a link
 * to its design's page. Occasions are mixed (wedding, haldi, birthday,
 * sangeet, nikah) so the first screen says "every celebration", and none is
 * seasonal, so it never goes out of date.
 *
 * Cards share one pivot far below the hand, so rotating them spreads them
 * like playing cards. The rotation sits on a wrapper and the hover lift on
 * the link inside, so the two transforms never fight.
 */
const HAND: { id: string; rotate: number; shift: number; z: number }[] = [
  { id: 'sangeet-night', rotate: -18, shift: -3, z: 10 },
  { id: 'signature-nikah', rotate: 18, shift: 3, z: 10 },
  { id: 'haldi-mehendi', rotate: -9, shift: 0, z: 20 },
  { id: 'indian-birthday', rotate: 9, shift: 0, z: 20 },
  { id: 'signature-rajwada', rotate: 0, shift: 0, z: 30 },
]

export default function TemplateFanHero() {
  const count = TEMPLATES.length
  return (
    <div className="relative mx-auto aspect-[1.08/1] w-full max-w-[34rem]">
      {/* The gilt arch the cards are fanned in front of. */}
      <svg aria-hidden viewBox="0 0 100 92.6" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="tfh-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1DDBB" stopOpacity="0.9" />
            <stop offset="0.8" stopColor="#FBF3E8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tfh-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B08A4E" stopOpacity="0.5" />
            <stop offset="0.7" stopColor="#B08A4E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M10 92.6 V40 A40 40 0 0 1 90 40 V92.6 Z" fill="url(#tfh-wash)" />
        <path d="M10 80 V40 A40 40 0 0 1 90 40 V80" fill="none" stroke="url(#tfh-line)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
      </svg>

      {HAND.map((card) => {
        const template = TEMPLATES.find((t) => t.id === card.id)
        if (!template) return null
        const name = displayName(template.name)
        const centre = card.rotate === 0
        return (
          <div
            key={card.id}
            className="absolute bottom-[14%] left-1/2 -ml-[21%] w-[42%]"
            style={{
              zIndex: card.z,
              transformOrigin: '50% 230%',
              transform: `translateX(${card.shift}%) rotate(${card.rotate}deg)${centre ? ' translateY(-5%) scale(1.06)' : ''}`,
            }}
          >
            <Link
              href={`/templates/${templateSeoSlug(card.id)}`}
              prefetch={false}
              aria-label={`${name} invitation design`}
              className="block rounded-[1.15rem] bg-paper p-[5px] shadow-[0_30px_50px_-24px_rgba(40,25,10,0.55)] transition-transform duration-300 ease-out hover:-translate-y-3"
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[0.85rem] bg-peach">
                <Image src={templateImage(card.id)} alt="" fill sizes="220px" className="object-cover" />
              </span>
            </Link>
          </div>
        )
      })}

      {/* What the gallery below holds, and what every design comes with. */}
      <div className="absolute left-0 top-[12%] z-40 flex items-center gap-2.5 rounded-2xl border border-line bg-paper/95 px-3.5 py-2.5 shadow-lift">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-emerald-deep"><SparklesIcon className="h-4 w-4" /></span>
        <span>
          <span className="block text-[0.8rem] font-semibold">{count} designs</span>
          <span className="block text-[0.7rem] text-muted">Every celebration</span>
        </span>
      </div>
      <div className="absolute bottom-[2%] right-[2%] z-40 flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-[0.78rem] font-semibold text-paper shadow-lift">
        <EyeIcon className="h-3.5 w-3.5 text-gold-soft" /> Live preview on every design
      </div>
    </div>
  )
}
