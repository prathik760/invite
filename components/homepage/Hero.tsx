import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { templateImage } from '@/lib/templateMedia'
import { designPlaceholder } from '@/lib/designPlaceholders'
import { serverT } from '@/lib/serverLang'
import ContinueDraft from './ContinueDraft'
import HeroPhone from './HeroPhone'
import HeroStage from './HeroStage'

/**
 * The first screen. Copy on the left; on the right the product itself: a real
 * Rajwada invitation on a phone being opened, read, answered and shared, with
 * two more real designs laid behind it like printed cards on a table. The
 * sequence is CSS only (globals.css, "Hero"), so the buttons never wait on
 * JavaScript, and its resting frame is the open invitation.
 */
const BEATS = [
  ['Opening', 'A guest taps the palace doors'],
  ['The reveal', 'Their invitation unfolds'],
  ['Replying', 'They answer from the invitation'],
  ['RSVP', 'Their reply reaches you on WhatsApp'],
  ['Sharing', 'One link for every family group'],
]

export default function Hero({ names }: { names: Record<string, string> }) {
  const t = serverT()
  // --drop: on a laptop, the text and the phone with its cards sit this much lower, together, so the
  // phone clears the navbar. The beat captions and controls stay where they were, so the hero's
  // height and its edge into the next section do not change. Phones keep their own layout (0).
  return (
    <section aria-labelledby="hv-hero-title" className="relative overflow-hidden [--drop:0px] lg:[--drop:28px]">
      <div className="hv-shell relative grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1fr_1fr] lg:gap-6 lg:pb-16 lg:pt-6">
        {/* From 1024 to 1279px the columns are narrow and the lower card leans into this one: the padding keeps
            the paragraph clear of it (the headline is already narrower, so its line breaks do not change). */}
        <div className="relative top-[var(--drop)] min-w-0 max-lg:text-center lg:pb-10 lg:max-xl:pr-[36px]">
          <p className="hv-kicker enter-0 max-lg:justify-center">{t('Your moments, beautifully invited')}</p>
          <h1 id="hv-hero-title" className="hv-display enter-1 mt-6 max-lg:mx-auto max-sm:!text-[2.5rem] lg:max-w-[15ch] lg:!text-[clamp(3.6rem,5.2vw,5.1rem)]">
            {t('Invitations worth remembering.')}
          </h1>
          <p className="hv-lede enter-2 mt-6 max-w-[34rem] max-lg:mx-auto">
            {t('Create beautiful digital invitations for weddings, birthdays and life’s special moments. Personalize every detail, share instantly and bring everyone together.')}
          </p>
          <div className="enter-3 mt-9 flex flex-col gap-3 sm:flex-row max-lg:justify-center">
            <TrackedLink href="/#designs" location="home_hero" className="hv-btn">
              {t('Explore invitations')}
              <ArrowRightIcon className="h-4 w-4" />
            </TrackedLink>
            <TrackedLink href="/#how-it-works" location="home_hero_secondary" className="hv-btn-line">
              {t('See how it works')}
            </TrackedLink>
          </div>
          <p className="enter-3 mt-6 text-[0.9rem] text-hv-muted">{t('Preview before you pay · One payment per design · Guests need no app')}</p>
          <ContinueDraft names={names} />
        </div>

        <HeroStage className="relative mx-auto h-[37rem] w-full max-w-[32rem] sm:h-[42rem] lg:h-[45rem] lg:max-w-[36rem]">
        <div
          className="absolute inset-0"
          role="img"
          aria-label={t('A {name} wedding invitation on a phone: a guest taps the palace doors open, reads the invitation, replies on WhatsApp, and the invitation link is shared to a family group.', { name: 'Rajwada' })}
        >
          {/* A plain stationery arch behind the phone: the one ornament on the first screen. */}
          <svg aria-hidden viewBox="0 0 440 620" className="absolute left-1/2 top-[calc(1%+var(--drop))] h-[86%] w-auto -translate-x-1/2" fill="none">
            <path d="M20 620V220C20 110 110 20 220 20s200 90 200 200v400Z" fill="#F1EDE3" />
            <path d="M40 620V224C40 126 121 44 220 44s180 82 180 180v396" stroke="#C7A45B" strokeOpacity=".55" strokeWidth="1" />
          </svg>

          {/* Two more real designs, laid down like printed cards. */}
          <div className="hv-hero-card absolute bottom-[calc(15%-var(--drop))] left-[-3%] w-[34%] overflow-hidden rounded-[0.6rem] shadow-[0_34px_60px_-30px_rgba(12,43,34,0.55)] sm:left-[-4%]" style={{ ['--r' as string]: '-5deg', transform: 'rotate(-5deg)' }}>
            <Image src={templateImage('signature-aquarelle')} alt="" width={240} height={300} priority sizes="(max-width: 640px) 33vw, 190px" className="block h-auto w-full" style={designPlaceholder('signature-aquarelle')} />
          </div>
          <div className="hv-hero-card absolute right-[-3%] top-[calc(9%+var(--drop))] w-[32%] overflow-hidden rounded-[0.6rem] shadow-[0_34px_60px_-30px_rgba(12,43,34,0.55)] sm:right-[-4%]" style={{ ['--r' as string]: '4deg', transform: 'rotate(4deg)' }}>
            <Image src={templateImage('signature-kalyanam')} alt="" width={240} height={300} priority sizes="(max-width: 640px) 31vw, 180px" className="block h-auto w-full" style={designPlaceholder('signature-kalyanam')} />
          </div>

          {/* Centred with `translate`, which the entrance animation (on `transform`) leaves alone. */}
          <div className="hv-hero-phone absolute left-1/2 top-[var(--drop)] w-[14.5rem] sm:w-[16.5rem] lg:w-[17.5rem]" style={{ translate: '-50% 0' }}>
            <HeroPhone />
          </div>

          {/* The beat now playing, named. */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3">
            <div className="relative h-6 w-full">
              {BEATS.map(([k, v], i) => (
                <p key={k} className={`hv-cap hv-cap-${i + 1} hv-seq-t flex items-center justify-center gap-2 whitespace-nowrap text-[0.95rem] text-hv-ink`}>
                  <span className="hv-serif text-[1.1rem] italic text-hv-gold-ink">{t(k)}</span>
                  <span className="text-hv-muted">{t(v)}</span>
                </p>
              ))}
            </div>
            <div className="flex gap-1.5">
              {BEATS.map(([k], i) => (
                <span key={k} className="relative h-[2px] w-7 overflow-hidden rounded-full bg-hv-line">
                  <span className={`hv-cap hv-cap-${i + 1} hv-seq-t bg-hv-gold`} />
                </span>
              ))}
            </div>
          </div>
        </div>
        </HeroStage>
      </div>
    </section>
  )
}
