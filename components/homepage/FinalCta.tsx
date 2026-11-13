import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { serverT } from '@/lib/serverLang'

/**
 * The last word: "Your celebration starts with an invitation." Deep forest,
 * three real invitations fanned on phones, one button into the builder and a
 * quieter way back to the designs.
 */
const FAN = [
  { src: '/landing/hero-kalyanam.webp', rot: -9, x: '0%', y: '9%', z: 1 },
  { src: '/landing/hero-royal-edit.webp', rot: 0, x: '29%', y: '0%', z: 3 },
  { src: '/landing/hero-rajwada.webp', rot: 9, x: '58%', y: '9%', z: 2 },
]

export default function FinalCta() {
  const t = serverT()
  return (
    <section aria-labelledby="hv-final-title" className="hv-on-dark relative overflow-hidden bg-hv-deep text-hv-ivory">
      <div className="hv-shell hv-sec grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <div data-reveal>
          <p className="hv-kicker">{t('Begin')}</p>
          <h2 id="hv-final-title" className="hv-display mt-6 text-hv-ivory max-sm:!text-[2.4rem] lg:max-w-[15ch]">
            {t('Your celebration starts with an invitation.')}
          </h2>
          <p className="mt-6 max-w-[30rem] text-[1.08rem] leading-[1.8] text-hv-ivory/70">
            {t('Find a design you love, make it yours and share the excitement with everyone who matters.')}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <TrackedLink href="/create" location="home_final" className="hv-btn-light">
              {t('Create your invitation')}
              <ArrowRightIcon className="h-4 w-4" />
            </TrackedLink>
            <TrackedLink href="/templates" location="home_final_designs" className="hv-textlink">
              {t('Or browse the designs first')}
            </TrackedLink>
          </div>
          <p className="mt-6 text-[0.85rem] text-hv-ivory/55">{t('Preview before you pay. You pay only when you publish.')}</p>
        </div>

        <div className="relative mx-auto aspect-[10/9] w-full max-w-[32rem]" aria-hidden data-reveal="scale">
          {FAN.map((f) => (
            <div key={f.src} className="absolute w-[42%]" style={{ left: f.x, top: f.y, zIndex: f.z, transform: `rotate(${f.rot}deg)` }}>
              <div className="hv-phone !rounded-[1.9rem] !p-1.5 after:!top-3 after:!h-3">
                <div className="hv-screen-box !rounded-[1.5rem]">
                  <Image src={f.src} alt="" width={440} height={952} unoptimized className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
