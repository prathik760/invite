import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { ArrowRightIcon, EyeIcon } from '@/components/ui/Icons'
import { buildCatalogItems } from '@/lib/catalogItems'

/** Placement id: the cta_location of the button and the builder's `src`. */
const LOCATION = 'wording_banner'

/**
 * One quiet offer a few messages into a wording guide (WordingSection's
 * `banner`): the guide's main design, its price and a way into the builder.
 * Most readers came for a message to paste into WhatsApp and never learn the
 * same words can be sent as an invitation; this says so once, in the page's
 * own colours, without interrupting the list. The picture opens the design's
 * live preview, so the reader can see what "animated" means before choosing.
 */
export default function InviteBanner({ templateId }: { templateId: string }) {
  const design = buildCatalogItems([templateId])[0]
  if (!design) return null
  const href = `/create?template=${encodeURIComponent(design.id)}&src=${LOCATION}`

  return (
    <aside
      aria-label="Send your message as an invitation"
      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-3xl border border-emerald-soft/25 bg-peach/60 p-3.5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5 sm:p-4 sm:pr-6"
    >
      <PreviewButton
        templateId={design.id}
        source={LOCATION}
        ariaLabel={`Live preview of the ${design.name} design`}
        className="group relative row-span-2 block aspect-[4/5] w-[4.5rem] shrink-0 cursor-zoom-in self-center overflow-hidden rounded-2xl border border-line bg-paper shadow-soft sm:row-span-1 sm:w-20"
      >
        <Image
          src={design.image}
          alt={`${design.name} ${design.occasionLabel.toLowerCase()} invitation design`}
          fill
          sizes="80px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
        <span className="pointer-events-none absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-paper/95 text-charcoal shadow-sm">
          <EyeIcon className="h-3.5 w-3.5" />
        </span>
      </PreviewButton>

      <div className="min-w-0">
        <p className="text-[0.98rem] font-semibold leading-6 text-charcoal">
          Turn your message into an animated invitation your guests open on WhatsApp
        </p>
        <p className="mt-1 text-[0.8rem] leading-5 text-muted">
          {design.name} design · Preview before you pay · <Price inr={design.price} /> once to publish
        </p>
      </div>

      <TrackedLink
        href={href}
        location={LOCATION}
        meta={{ template_id: design.id, price: design.price }}
        prefetch={false}
        className="btn-primary inline-flex items-center justify-center gap-1.5 justify-self-start whitespace-nowrap rounded-full px-5 py-2.5 text-[0.85rem] font-semibold sm:justify-self-auto"
      >
        Create my invitation
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </TrackedLink>
    </aside>
  )
}
