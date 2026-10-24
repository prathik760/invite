import { Signature } from '@/components/home/Hand'
import { supportWhatsAppUrl } from '@/lib/support'

/**
 * A short note in the founder's own voice. Everything in it is a fact about
 * how the site works (designs made in-house, preview before paying, custom
 * designs on request, WhatsApp support); keep it that way when editing.
 */
export default function FounderNote() {
  return (
    <section aria-labelledby="founder-heading" className="border-b border-charcoal/10">
      <div className="shell grid gap-5 py-10 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:py-14">
        <div className="lg:col-span-4">
          <h2 id="founder-heading" className="font-editorial text-balance text-[1.15rem] italic text-charcoal/60">
            A note from the person who makes these
          </h2>
          <p className="mt-3 hidden lg:block">
            <Signature className="-rotate-3 text-[3.4rem] leading-none text-burnished-deep">Prathik</Signature>
            <span className="mt-2 block text-[0.88rem] text-charcoal/60">Prathik Thelkar, founder</span>
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="max-w-[44rem] space-y-4 font-editorial text-[1.35rem] leading-[1.5] text-charcoal sm:text-[1.55rem]">
            <p>
              Every design here is made for ShareInvite, one at a time: the palace doors, the haldi bowl, the diyas
              on the Diwali card. When a family asks for something we don&apos;t have, we draw it.
            </p>
            <p>
              You can build your whole invitation and look at it on your own phone before you pay anything. If
              something isn&apos;t right after you&apos;ve paid,{' '}
              <a
                href={supportWhatsAppUrl('Hi Prathik, I need help with my invitation')}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-burnished/50 underline-offset-[5px] hover:decoration-burnished"
              >
                message me on WhatsApp
              </a>{' '}
              and we&apos;ll fix it together.
            </p>
          </div>
          <p className="mt-5 flex items-end gap-4 lg:hidden">
            <Signature className="-rotate-3 text-[2.4rem] leading-none text-burnished-deep">Prathik</Signature>
            <span className="pb-1 text-[0.88rem] text-charcoal/60">Prathik Thelkar, founder</span>
          </p>
        </div>
      </div>
    </section>
  )
}
