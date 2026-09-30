import Image from 'next/image'
import { CalendarIcon, CheckIcon, HeartIcon } from '@/components/ui/Icons'

/**
 * The homepage visual: three real invitations, each on a phone, fanned under
 * a gilt arch — with the WhatsApp message a guest actually receives. The
 * screens are screenshots of the live designs (public/templates/phone), the
 * link preview is the real share card. Everything shown exists in the product.
 *
 * Built in percentages of one square-ish box so it composes the same way from
 * a 320px phone to a desktop column, and never spills past its column. The
 * centre screen is `priority`: it can be the LCP element.
 */

interface Screen {
  src: string
  alt: string
}

function Phone({ screen, priority, sizes }: { screen: Screen; priority?: boolean; sizes: string }) {
  return (
    <div className="rounded-[18%/8.3%] bg-[#141414] p-[4.2%] shadow-[0_40px_70px_-30px_rgba(3,25,15,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[14%/6.5%] bg-peach">
        <Image src={screen.src} alt={screen.alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
        {/* the island */}
        <span aria-hidden className="absolute left-1/2 top-[1.6%] h-[3.1%] w-[32%] -translate-x-1/2 rounded-full bg-[#141414]" />
      </div>
    </div>
  )
}

export default function PhoneFanHero({
  centre = { src: '/templates/phone/signature-rajwada.jpg', alt: 'Rajwada — a Signature wedding invitation on a phone' },
  left = { src: '/templates/phone/haldi-mehendi.jpg', alt: 'Haldi & Mehendi invitation on a phone' },
  right = { src: '/templates/phone/signature-nikah.jpg', alt: 'Nikah invitation on a phone' },
}: {
  centre?: Screen
  left?: Screen
  right?: Screen
}) {
  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[36rem]">
      {/* The gilt arch the phones stand in — two hairlines and a soft wash. */}
      <svg aria-hidden viewBox="0 0 100 102" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="pfh-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1DDBB" stopOpacity="0.9" />
            <stop offset="0.75" stopColor="#FBF3E8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pfh-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B08A4E" stopOpacity="0.55" />
            <stop offset="0.62" stopColor="#B08A4E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M9 102 V45 A41 41 0 0 1 91 45 V102 Z" fill="url(#pfh-wash)" />
        <path d="M9 80 V45 A41 41 0 0 1 91 45 V80" fill="none" stroke="url(#pfh-line)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        <path d="M13.5 80 V46 A36.5 36.5 0 0 1 86.5 46 V80" fill="none" stroke="url(#pfh-line)" strokeWidth="0.3" strokeDasharray="0.6 1.4" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Side phones, a little behind and tilted out */}
      <div className="float-slower absolute left-[3%] top-[21%] z-10 w-[31%]" style={{ ['--tilt' as string]: '-7deg' }}>
        <Phone screen={left} sizes="(max-width: 768px) 30vw, 180px" />
      </div>
      <div className="float-slower absolute right-[3%] top-[21%] z-10 w-[31%]" style={{ ['--tilt' as string]: '7deg', animationDelay: '-6s' }}>
        <Phone screen={right} sizes="(max-width: 768px) 30vw, 180px" />
      </div>

      {/* The one in front */}
      <div className="float-slow absolute left-[29.5%] top-[4%] z-20 w-[41%]">
        <Phone screen={centre} priority sizes="(max-width: 768px) 42vw, 240px" />
      </div>

      {/* How it arrives: one WhatsApp message with the invitation's own card */}
      <figure className="absolute bottom-0 left-0 z-30 w-[47%] max-w-[16rem] rounded-[1.1rem] rounded-bl-[0.35rem] bg-[#E7FFDB] p-[5px] shadow-[0_24px_48px_-22px_rgba(3,25,15,0.55)]">
        <div className="overflow-hidden rounded-[0.8rem] bg-white">
          <span className="relative block aspect-[1200/630]">
            <Image src="/templates/phone/share-rajwada.jpg" alt="The link preview guests see: Aditi & Kabir, wedding invitation" fill sizes="(max-width: 768px) 52vw, 270px" className="object-cover" />
          </span>
          <span className="block px-2.5 py-2">
            <span className="block truncate text-[0.72rem] font-semibold leading-tight text-[#111B21] sm:text-[0.78rem]">Aditi &amp; Kabir · Wedding invitation</span>
            <span className="block text-[0.64rem] text-[#667781] sm:text-[0.7rem]">shareinvite.in</span>
          </span>
        </div>
        <figcaption className="flex items-end justify-between gap-2 px-1.5 pb-0.5 pt-1.5">
          <span className="text-[0.72rem] leading-snug text-[#111B21] sm:text-[0.8rem]">You&apos;re invited — tap to open</span>
          <span className="flex shrink-0 items-center gap-0.5 text-[0.6rem] text-[#667781]">
            7:42 pm
            <CheckIcon className="h-3 w-3 text-[#53BDEB]" />
          </span>
        </figcaption>
      </figure>

      {/* Two things every guest gets, in one tap */}
      <div className="float-slow absolute right-0 top-[9%] z-30 hidden items-center gap-2.5 rounded-2xl border border-line bg-paper/95 px-3.5 py-2.5 shadow-lift sm:flex" style={{ ['--tilt' as string]: '2deg' }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-emerald-deep"><CalendarIcon className="h-4 w-4" /></span>
        <span>
          <span className="block text-[0.8rem] font-semibold">Maps &amp; calendar</span>
          <span className="block text-[0.7rem] text-muted">One tap for guests</span>
        </span>
      </div>
      <div className="absolute bottom-[5%] right-[1%] z-30 flex items-center gap-2 rounded-full bg-emerald px-3 py-1.5 text-[0.7rem] font-semibold text-paper shadow-lift sm:px-4 sm:py-2 sm:text-[0.78rem]">
        <HeartIcon className="h-3.5 w-3.5 text-gold-soft" /> Wishes appear live
      </div>
    </div>
  )
}
