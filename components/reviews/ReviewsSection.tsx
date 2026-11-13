import { Section, SectionHeading, type Tone } from '@/components/brand/Section'
import { approvedReviews, designNameOf, type ShownReview } from '@/lib/reviews'

const month = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })

/**
 * Reviews from hosts (lib/reviews.ts), on the home page and a design's page.
 * Renders nothing until there is a real one: the site never fills the space
 * with invented quotes. On a design's page its own reviews come first; with
 * none yet, the latest from other designs, each naming its design.
 */
export default async function ReviewsSection({
  templateId,
  tone = 'paper',
  limit = 6,
  reviews,
}: {
  templateId?: string
  tone?: Tone
  limit?: number
  /** Already loaded by the page (for its JSON-LD); loaded here otherwise. */
  reviews?: ShownReview[]
}) {
  const all = reviews ?? (await approvedReviews())
  if (!all.length) return null
  const own = templateId ? all.filter((r) => r.templateId === templateId) : []
  const basis = own.length ? own : all
  const list = basis.slice(0, limit)
  const average = basis.reduce((sum, r) => sum + r.rating, 0) / basis.length
  const title = own.length ? `What hosts say about ${designNameOf(templateId!)}` : 'What hosts say'

  return (
    <Section tone={tone} aria-label="Reviews from hosts">
      <SectionHeading
        eyebrow="Reviews from hosts"
        title={title}
        sub={`${average.toFixed(1)} out of 5 from ${basis.length} ${basis.length === 1 ? 'review' : 'reviews'}. Only a host who published an invitation can review it, after their celebration.`}
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <li key={r.id} className="card flex flex-col p-5">
            <p className="text-[1.15rem] leading-none text-burnished" aria-label={`${r.rating} out of 5`}>
              {'★'.repeat(r.rating)}
              <span className="text-charcoal/15">{'★'.repeat(5 - r.rating)}</span>
            </p>
            {r.text && <blockquote className="mt-3 flex-1 text-[0.95rem] leading-7 text-charcoal/85">&ldquo;{r.text}&rdquo;</blockquote>}
            <p className="mt-4 text-[0.88rem] font-semibold text-charcoal">
              {r.name}
              {r.city && <span className="font-normal text-muted">, {r.city}</span>}
            </p>
            <p className="mt-0.5 text-[0.8rem] text-muted">
              {designNameOf(r.templateId)} · {month(r.date)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
