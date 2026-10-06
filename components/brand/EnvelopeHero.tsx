import Image from 'next/image'
import { LogoMark } from '@/components/brand/Logo'
import { CheckIcon, HeartIcon, MapPinIcon } from '@/components/ui/Icons'
import { templateImage } from '@/lib/templateMedia'

/**
 * The signature visual: a real design rising out of an opening envelope, with
 * two more designs and a few product facts floating around it. Pure CSS
 * animation (see "Signature: the envelope reveal" in globals.css).
 *
 * The card image is `priority` — it can be the LCP element on desktop — and its
 * animation is transform-only, so it paints on the first frame.
 */
export default function EnvelopeHero({
  card = { src: templateImage('indian-wedding'), alt: 'Shaadi wedding invitation design' },
  left = { src: templateImage('indian-birthday'), alt: 'Birthday invitation design', label: 'Birthday' },
  right = { src: templateImage('namakaran'), alt: 'Naming ceremony invitation design', label: 'Naming ceremony' },
}: {
  card?: { src: string; alt: string }
  left?: { src: string; alt: string; label: string }
  right?: { src: string; alt: string; label: string }
}) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      {/* Side designs, drifting */}
      <figure className="float-slow absolute left-1 top-[14%] z-0 w-[36%] sm:-left-8 sm:w-[40%]" style={{ ['--tilt' as string]: '-8deg' }}>
        <div className="rounded-2xl bg-paper p-1.5 shadow-[0_24px_50px_-24px_rgba(5,46,32,0.45)]">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-peach">
            <Image src={left.src} alt={left.alt} fill sizes="(max-width: 768px) 40vw, 220px" className="object-cover" />
          </div>
        </div>
        <figcaption className="mt-1.5 hidden pl-1 text-[0.75rem] sm:block font-semibold text-charcoal/65">{left.label}</figcaption>
      </figure>
      <figure className="float-slower absolute right-1 top-[44%] z-0 w-[36%] sm:-right-8 sm:w-[40%]" style={{ ['--tilt' as string]: '7deg' }}>
        <div className="rounded-2xl bg-paper p-1.5 shadow-[0_24px_50px_-24px_rgba(5,46,32,0.45)]">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-peach">
            <Image src={right.src} alt={right.alt} fill sizes="(max-width: 768px) 40vw, 220px" className="object-cover" />
          </div>
        </div>
        <figcaption className="mt-1.5 hidden pr-1 text-right text-[0.75rem] sm:block font-semibold text-charcoal/65">{right.label}</figcaption>
      </figure>

      {/* The envelope */}
      <div className="envelope relative z-10 mx-auto aspect-[1/1.12] w-[74%]">
        <div className="envelope-back" />
        <div className="envelope-flap" />
        <div className="envelope-card">
          <div className="envelope-card-inner">
            <div className="rounded-[1.1rem] bg-paper p-1.5 shadow-[0_30px_60px_-28px_rgba(3,25,15,0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.8rem] bg-peach">
                <Image src={card.src} alt={card.alt} fill priority sizes="(max-width: 768px) 45vw, 250px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="envelope-pocket" />
        <div className="envelope-seal">
          <LogoMark className="h-14 w-14 drop-shadow-[0_8px_16px_rgba(3,25,15,0.45)]" />
        </div>
      </div>

      {/* Product facts */}
      <div className="float-slow absolute bottom-[6%] left-0 z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-paper/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:flex" style={{ ['--tilt' as string]: '-2deg' }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-paper"><HeartIcon className="h-4 w-4" /></span>
        <span>
          <span className="block text-[0.8rem] font-semibold">Guest wishes</span>
          <span className="block text-[0.7rem] text-muted">Appear live</span>
        </span>
      </div>
      <div className="float-slower absolute right-0 top-[4%] z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-paper/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:flex" style={{ ['--tilt' as string]: '2deg' }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-emerald-deep"><MapPinIcon className="h-4 w-4" /></span>
        <span>
          <span className="block text-[0.8rem] font-semibold">Venue & maps</span>
          <span className="block text-[0.7rem] text-muted">One tap directions</span>
        </span>
      </div>
      <div className="absolute -bottom-3 right-[8%] z-20 hidden items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-[0.78rem] font-semibold text-paper shadow-lift sm:flex">
        <CheckIcon className="h-3.5 w-3.5 text-gold-soft" /> One link · no app for guests
      </div>
    </div>
  )
}
