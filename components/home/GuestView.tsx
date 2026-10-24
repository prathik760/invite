import Image from 'next/image'
import Link from 'next/link'
import { templateSeoSlug } from '@/lib/seo'

/**
 * Three real moments from one design (Haldi & Mehendi, as a guest sees it on a
 * phone), shown like prints on a table instead of icons around a mock-up.
 * The crops are screenshots of /demo/haldi-mehendi/embed in public/home/;
 * retake them if that design changes. Served as-is (pre-sized WebP), so they
 * cost no image optimisations.
 */
const PRINTS = [
  {
    src: '/home/haldi-function-card.webp',
    alt: 'The Haldi card: day, time, venue, and Add to calendar and Directions buttons',
    title: 'Every function, with directions',
    copy: 'Each function has its own card. One tap opens the venue in Google Maps, another puts it in the guest’s calendar.',
    tilt: '-rotate-[1.2deg]',
  },
  {
    src: '/home/haldi-countdown.webp',
    alt: 'A countdown reading 45 days until the Haldi',
    title: 'A countdown to the day',
    copy: 'Days, hours, minutes and seconds, ticking on every phone the link is opened on.',
    tilt: 'rotate-[0.8deg]',
  },
  {
    src: '/home/haldi-programme.webp',
    alt: 'The programme: Haldi at 10 am, lunch at 1 pm, Mehendi at 4 pm, chaat and dinner at 7:30 pm',
    title: 'The programme',
    copy: 'So nobody has to call and ask what time lunch is.',
    tilt: '-rotate-[0.6deg]',
  },
]

export default function GuestView() {
  return (
    <section id="features" aria-labelledby="guest-view-heading" className="border-b border-charcoal/10">
      {/* Phone: heading, a row of prints you swipe through, then the note on wishes.
          Laptop: heading and the note on the left, the three prints in a row on the right. */}
      <div className="shell py-10 sm:py-12 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:py-14">
        <div className="max-w-2xl lg:col-span-5 lg:row-start-1 lg:self-end">
          <h2 id="guest-view-heading" className="font-editorial text-balance text-[2.2rem] font-medium leading-[1.04] sm:text-[2.8rem]">
            What your guests actually get
          </h2>
          <p className="mt-4 text-[1rem] leading-7 text-charcoal/70">
            Not a picture of a card. A page that holds everything, so you stop forwarding the address, the timings and
            the photos as five separate messages. These are from the{' '}
            <Link href={`/templates/${templateSeoSlug('haldi-mehendi')}`} prefetch={false} className="font-semibold text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:decoration-burnished">
              Haldi &amp; Mehendi
            </Link>{' '}
            design, as it looks on a phone.
          </p>
        </div>

        <ol className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:self-center lg:overflow-visible lg:px-0 lg:pb-0">
          {PRINTS.map((p, i) => (
            <li key={p.src} className="w-[74%] shrink-0 snap-center sm:w-[46%] lg:w-auto">
              <span className={`block bg-paper p-2 shadow-[0_1px_2px_rgba(30,39,38,0.08),0_18px_34px_-22px_rgba(30,39,38,0.55)] lg:p-1.5 ${p.tilt}`}>
                <Image src={p.src} alt={p.alt} width={720} height={900} unoptimized className="block h-auto w-full" />
              </span>
              <p className="mt-4 flex gap-3 lg:gap-2.5">
                <span className="font-editorial text-[1.6rem] leading-none text-burnished lg:text-[1.4rem]">{i + 1}</span>
                <span>
                  <span className="block font-editorial text-[1.35rem] font-medium leading-tight lg:text-[1.2rem]">{p.title}</span>
                  <span className="mt-1.5 block text-[0.95rem] leading-6 text-charcoal/70 lg:text-[0.88rem] lg:leading-[1.45rem]">{p.copy}</span>
                </span>
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-2xl text-[1rem] leading-7 text-charcoal/70 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:mt-5 lg:self-start lg:border-l-2 lg:border-burnished/50 lg:pl-4">
          And on every event design, a wall where guests leave you a few words. Each one shows up for everyone who
          opens the link, and you can remove any of them from your dashboard. Features vary from design to design;
          the live preview shows exactly what each one has.
        </p>
      </div>
    </section>
  )
}
