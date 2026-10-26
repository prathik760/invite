import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import { Price } from '@/components/price/Price'
import { PenUnderline } from '@/components/home/Hand'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'

/**
 * The homepage's first screen. The H1 carries the search phrase ("digital
 * invitations", with "animated" and "WhatsApp", the two things people add to
 * it) and says what the product is.
 *
 * Phone: headline, one sentence, the designs and the WhatsApp message they
 * arrive in, then the button. Laptop: a clean two-column layout, text on the
 * left (headline, sentence, two buttons, three reassurances), the designs
 * upright on the right, both centred on each other.
 */
export default function HomeHero() {
  return (
    <section aria-labelledby="hero-headline" className="border-b border-charcoal/10">
      <div className="shell grid pb-10 pt-7 sm:pt-10 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:pb-16 lg:pt-14">
        <div className="min-w-0 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1
            id="hero-headline"
            className="font-editorial font-medium leading-[0.98] tracking-[-0.01em] text-charcoal lg:font-normal lg:leading-[1.02] lg:tracking-[-0.015em]"
            style={{ fontSize: 'clamp(2.45rem, 4.4vw, 4.2rem)' }}
          >
            Animated digital invitations you send{' '}
            <span className="relative inline-block whitespace-nowrap">
              on WhatsApp.
              <PenUnderline className="-bottom-2 h-3 text-burnished sm:-bottom-3 sm:h-4 lg:hidden" />
            </span>
          </h1>

          {/* What it is, in one sentence: the line a phone visitor reads first. */}
          <p className="mt-6 max-w-[34rem] text-[1.06rem] leading-[1.65] text-charcoal sm:mt-8 sm:text-[1.12rem] lg:mt-6 lg:max-w-[31rem] lg:text-charcoal/80">
            For weddings, birthdays and every celebration. Pick a design, add your details and share{' '}
            <strong className="font-semibold text-charcoal">one link</strong>; your guests tap it and the invitation
            opens on their phone, with the venue map, a countdown and a place to leave wishes.
          </p>
        </div>

        <HeroSpread />

        <div className="min-w-0 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="mt-7 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-7 lg:gap-3">
            <TrackedLink
              href="/create"
              location="home_hero"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald px-7 py-4 text-[1rem] font-semibold text-paper transition-colors hover:bg-emerald-soft sm:w-auto"
            >
              Start your invitation
              <span aria-hidden>→</span>
            </TrackedLink>
            {/* A text link on a phone; a second, outlined button on a laptop. */}
            <Link
              href="/templates"
              className="text-[1rem] font-semibold text-charcoal underline decoration-charcoal/30 underline-offset-[6px] transition-colors hover:decoration-burnished lg:inline-flex lg:items-center lg:justify-center lg:rounded-md lg:border lg:border-charcoal/25 lg:px-7 lg:py-[0.95rem] lg:no-underline lg:hover:border-charcoal/60 lg:hover:bg-paper"
            >
              Browse designs
            </Link>
          </div>

          <p className="mt-5 max-w-[33rem] text-[0.9rem] leading-6 text-charcoal/60 lg:hidden">
            Build and preview the whole thing first. Pay once when you publish, from <Price inr={LOWEST_PAID_PRICE} />.
          </p>
          <ul className="mt-7 hidden flex-wrap gap-x-6 gap-y-2 text-[0.92rem] text-charcoal/70 lg:flex">
            {[<>Preview before you pay</>, <>Pay once, from <Price inr={LOWEST_PAID_PRICE} /></>, <>No app for guests</>].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 text-emerald-soft" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3.2 3L13 4.5" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * Three real designs and, centred under them, the WhatsApp message a guest
 * receives. Phone: a fan, the sides leaning out. Laptop: upright and evenly
 * overlapped, the wedding in front. Each design links to its page.
 */
function HeroSpread() {
  const card = 'absolute block bg-paper p-[5px] shadow-[0_1px_2px_rgba(30,39,38,0.08),0_22px_40px_-22px_rgba(30,39,38,0.55)] transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:p-[7px]'
  return (
    <div className="relative mx-auto mt-7 h-[20rem] w-full max-w-[30rem] sm:mt-10 sm:h-[25rem] lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-[27rem] lg:max-w-none lg:self-center">
      <Link
        href={`/templates/${templateSeoSlug('haldi-mehendi')}`}
        prefetch={false}
        className={`${card} left-[1%] top-[11%] z-10 w-[36%] origin-bottom-right -rotate-[7deg] lg:left-0 lg:top-[10%] lg:w-[35%] lg:-rotate-[3deg]`}
      >
        <Art id="haldi-mehendi" alt="Haldi and Mehendi invitation design" />
      </Link>
      <Link
        href={`/templates/${templateSeoSlug('signature-aquarelle')}`}
        prefetch={false}
        className={`${card} right-[1%] top-[11%] z-10 w-[36%] origin-bottom-left rotate-[7deg] lg:right-0 lg:top-[10%] lg:w-[35%] lg:rotate-[3deg]`}
      >
        <Art id="signature-aquarelle" alt="Aquarelle wedding invitation, watercolour roses" />
      </Link>
      <Link
        href={`/templates/${templateSeoSlug('signature-rajwada')}`}
        prefetch={false}
        className={`${card} left-1/2 top-[2%] z-20 w-[46%] -translate-x-1/2 hover:-translate-x-1/2 lg:top-0 lg:w-[45%]`}
      >
        <Art id="signature-rajwada" alt="Rajwada wedding invitation, palace doors" priority />
      </Link>

      <WhatsAppMessage />
    </div>
  )
}

/** The message a guest receives: a WhatsApp bubble with the invitation's link preview. */
function WhatsAppMessage() {
  return (
    <span
      role="img"
      aria-label="A WhatsApp message with the invitation link: Aditi and Kabir, wedding invitation, shareinvite.in. You're invited, tap to open."
      className="absolute bottom-0 left-1/2 z-30 w-[84%] max-w-[19rem] -translate-x-1/2 rounded-[10px] rounded-tr-[2px] bg-[#D9FDD3] p-1 shadow-[0_14px_28px_-14px_rgba(30,39,38,0.6)] sm:w-[66%] lg:bottom-[9%] lg:w-[64%]"
    >
      <span className="flex items-center gap-2 rounded-[7px] bg-[#C7EFC0]/70 p-1.5">
        <span className="relative block h-11 w-9 shrink-0 overflow-hidden rounded-[3px] bg-peach">
          <Image src={templateImage('signature-rajwada')} alt="" fill sizes="40px" className="object-cover" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[0.78rem] font-semibold text-[#111B21]">Aditi &amp; Kabir · Wedding invitation</span>
          <span className="block text-[0.7rem] text-[#54656F]">shareinvite.in</span>
        </span>
      </span>
      <span className="flex items-end justify-between gap-2 px-1.5 pb-0.5 pt-1 text-[0.84rem] leading-snug text-[#111B21]">
        You&apos;re invited! Tap to open
        <span className="shrink-0 text-[0.64rem] text-[#54656F]">
          7:42 pm <span className="text-[#53BDEB]">✓✓</span>
        </span>
      </span>
    </span>
  )
}

function Art({ id, alt, priority = false }: { id: string; alt: string; priority?: boolean }) {
  return (
    <span className="relative block aspect-[4/5] overflow-hidden bg-peach">
      <Image src={templateImage(id)} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
    </span>
  )
}
