import Image from '@/components/ui/Image'
import { homeSample } from '@/lib/homeSample'
import { serverT } from '@/lib/serverLang'
import RajwadaFrame from './RajwadaFrame'

/**
 * The hero phone: Rajwada exactly as a guest gets it, played as one 16s loop
 * (globals.css, "Hero").
 *
 *   1  The closed palace gate; a tap on the doors; the two leaves swing open
 *      (the real screen, clipped to each leaf and turned on its hinge).
 *   2  The light, then the couple's names, date and venue.
 *   3  The page moves on to the reply card; a tap on Reply on WhatsApp.
 *   4  WhatsApp opens with the design's own opening line; the reply is sent
 *      and read.
 *   5  The host shares the link to a family group, preview card and all.
 *
 * Every frame of the invitation is a screenshot of the real design at
 * 390×844 (public/landing/rj-*.webp). The chats are drawn here, sized in cqw
 * so they scale with the phone. With no animation the open invitation shows.
 */

function Ticks({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 11" className={`inline-block h-[2.6cqw] w-[4.2cqw] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="m1 6 3.2 3.2L11 1.6M7.4 8.8 8.6 10 16 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChatHeader({ title, sub, initials }: { title: string; sub: string; initials: string }) {
  return (
    <div className="flex items-center gap-[2.6cqw] bg-[#008069] px-[3.4cqw] pb-[3cqw] pt-[12cqw] text-white">
      <svg viewBox="0 0 24 24" className="h-[5cqw] w-[5cqw]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#E9D9B0] text-[3.2cqw] font-semibold text-[#5B2333]">{initials}</span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[4cqw] font-semibold">{title}</span>
        <span className="block truncate text-[3cqw] opacity-80">{sub}</span>
      </span>
    </div>
  )
}

function Composer({ draft }: { draft?: string }) {
  const t = serverT()
  return (
    <div className="flex items-center gap-[2cqw] px-[2.6cqw] pb-[5cqw] pt-[2cqw]">
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-full bg-white px-[3.6cqw] py-[2.6cqw] text-[3.3cqw] text-[#8696A0]">
        {t('Message')}
        {draft && <span className="hv-seq-draft hv-seq-t absolute inset-0 truncate bg-white px-[3.6cqw] py-[2.6cqw] text-[#111B21]">{draft}</span>}
      </div>
      <span className="flex h-[10cqw] w-[10cqw] shrink-0 items-center justify-center rounded-full bg-[#00A884] text-white">
        <svg viewBox="0 0 24 24" className="h-[4.6cqw] w-[4.6cqw]" fill="currentColor" aria-hidden><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" /></svg>
      </span>
    </div>
  )
}

/** The link as every chat shows it: the preview card, then the address. */
function LinkCard({ caption, couple }: { caption: string; couple: string }) {
  const t = serverT()
  return (
    <>
      <div className="overflow-hidden rounded-[1.6cqw] bg-[#F0F2F5]">
        <Image src="/templates/phone/share-rajwada.jpg" alt="" width={600} height={315} sizes="240px" className="block h-auto w-full" />
        <p className="px-[2.4cqw] pt-[1.6cqw] text-[3.1cqw] font-semibold text-[#111B21]">{t('Wedding Invitation · {couple}', { couple })}</p>
        <p className="px-[2.4cqw] pb-[1.8cqw] text-[2.7cqw] text-[#667781]">shareinvite.in</p>
      </div>
      <p className="px-[0.8cqw] pt-[1.4cqw] text-[3.3cqw] text-[#027EB5]">{caption}</p>
    </>
  )
}

export default function HeroPhone() {
  const { couple, link } = homeSample()
  const initials = couple.split(' & ').map((n) => n[0]).join('&')
  const t = serverT()
  return (
    <div className="hv-phone">
      <div className="hv-screen-box">
        {/* The doors already open: what the turning leaves uncover. */}
        <RajwadaFrame name="open" priority="low" />
        <div className="hv-seq hv-seq-glow">
          <RajwadaFrame name="glow" priority="low" />
        </div>
        <div className="hv-seq hv-seq-names">
          <RajwadaFrame name="names" priority="low" />
        </div>
        <div className="hv-seq hv-seq-reply">
          <RajwadaFrame name="reply" priority="low" />
        </div>
        <div className="hv-seq hv-seq-door hv-door-l">
          <RajwadaFrame name="closed" priority="high" />
        </div>
        <div className="hv-seq hv-seq-door hv-door-r">
          <RajwadaFrame name="closed" priority="high" />
        </div>
        <div className="hv-seq hv-seq-closed">
          <RajwadaFrame name="closed" priority="high" />
        </div>
        <span className="hv-seq-tap hv-tap-1 hv-seq-t left-1/2 top-[46%]" />
        <span className="hv-seq-tap hv-tap-2 hv-seq-t left-1/2 top-[38%]" />

        {/* 4: the guest's reply, in WhatsApp, to the hosts. */}
        <div className="hv-seq hv-seq-chat flex flex-col bg-[#EFE7DE]">
          <ChatHeader title={couple} sub={t('online')} initials={initials} />
          <div className="flex flex-1 flex-col justify-end gap-[2.6cqw] px-[3cqw] pb-[2cqw]">
            <p className="mx-auto rounded-[1.4cqw] bg-white/85 px-[2.4cqw] py-[0.8cqw] text-[2.7cqw] font-medium text-[#54656F]">{t('TODAY')}</p>
            <div className="max-w-[80%] rounded-[2.4cqw] rounded-tl-none bg-white p-[1.4cqw] shadow-sm">
              <LinkCard caption={link} couple={couple} />
              <p className="px-[1cqw] text-right text-[2.6cqw] text-[#667781]">7:30 pm</p>
            </div>
            <div className="hv-seq-bubble hv-seq-t ml-auto max-w-[84%] rounded-[2.4cqw] rounded-tr-none bg-[#D9FDD3] px-[2.8cqw] py-[1.8cqw] text-[3.4cqw] leading-[1.4] text-[#111B21] shadow-sm">
              {/* The design's own opening line for a reply (SignatureRajwada), then the guest's answer. */}
              {t('Namaste! This is our reply to the invitation for {couple}’s wedding: joyfully attending, the two of us.', { couple })}
              <span className="mt-[0.6cqw] flex items-center justify-end gap-[1cqw] text-[2.6cqw] text-[#667781]">
                7:42 pm
                {/* Delivered, then read: the blue ticks fade in over the grey (opacity, so the compositor does it). */}
                <span className="relative inline-flex">
                  <Ticks className="text-[#8696A0]" />
                  <Ticks className="hv-seq-ticks hv-seq-t absolute inset-0 text-[#53BDEB]" />
                </span>
              </span>
            </div>
          </div>
          <Composer draft={t('Namaste! This is our reply to the invitation…')} />
        </div>

        {/* 5: the host sends the link to the family. */}
        <div className="hv-seq hv-seq-group flex flex-col bg-[#EFE7DE]">
          <ChatHeader title={t('{surname} Family', { surname: 'Rathore' })} sub={t('Mummy, Papa, {name} and {n} others', { name: 'Rohit', n: 14 })} initials="RF" />
          <div className="flex flex-1 flex-col justify-end gap-[2.6cqw] px-[3cqw] pb-[2cqw]">
            <div className="max-w-[78%] rounded-[2.4cqw] rounded-tl-none bg-white px-[2.8cqw] py-[1.8cqw] text-[3.4cqw] leading-[1.4] text-[#111B21] shadow-sm">
              <span className="block text-[2.9cqw] font-semibold text-[#C2185B]">Rohit</span>
              {t('Didi, send the invitation here too!')}
              <span className="block text-right text-[2.6cqw] text-[#667781]">8:01 pm</span>
            </div>
            <div className="hv-seq-link hv-seq-t relative ml-auto max-w-[80%] rounded-[2.4cqw] rounded-tr-none bg-[#D9FDD3] p-[1.4cqw] shadow-sm">
              <LinkCard caption={link} couple={couple} />
              <p className="flex items-center justify-end gap-[1cqw] px-[1cqw] text-[2.6cqw] text-[#667781]">
                8:02 pm <Ticks className="text-[#53BDEB]" />
              </p>
              <span className="hv-seq-react hv-seq-t absolute -bottom-[4.2cqw] left-[3cqw] rounded-full border border-white bg-[#F0F2F5] px-[1.8cqw] py-[0.4cqw] text-[3cqw] shadow-sm">
                ❤️🙏 <span className="text-[#54656F]">5</span>
              </span>
            </div>
            <span className="h-[3cqw]" />
          </div>
          <Composer />
        </div>
      </div>
    </div>
  )
}
