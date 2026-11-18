import { Section, SectionHeading } from '@/components/brand/Section'

/**
 * "Printed card, PDF, video or a link?" — the question a family settles before
 * choosing any invitation, answered fairly in one table on the wedding and
 * birthday pages. A fair table is worth more than a sales one: the printed
 * card's row "Something to keep" is a yes, and the closing line says many
 * families send both.
 *
 * Card and video prices are typical Indian market ranges (Nov 2026), worded as
 * such; the link's price comes from the catalogue.
 */
export default function InviteComparison({ noun, guests, fromPrice }: {
  /** "wedding invitation", "birthday invitation" */
  noun: string
  /** A typical guest list, for the cost of printing. */
  guests: number
  /** The occasion's lowest design price. */
  fromPrice: number
}) {
  const cardsFrom = (guests * 30).toLocaleString('en-IN')
  const rows: { label: string; card: string; pdf: string; video: string; link: string }[] = [
    {
      label: 'Cost',
      card: `₹30–₹300 a card, plus delivery: ₹${cardsFrom} or more for ${guests} guests`,
      pdf: 'Free if you make it, a few hundred rupees from a designer',
      video: 'Usually ₹300–₹2,000',
      link: `From ₹${fromPrice.toLocaleString('en-IN')}, once, for every guest`,
    },
    { label: 'Ready in', card: '1–3 weeks to print and deliver', pdf: 'An hour or two', video: 'A day or two', link: 'About 15 minutes' },
    {
      label: 'If a detail changes',
      card: 'Reprint, or call everyone',
      pdf: 'Make a new file and send it again',
      video: 'Edit the video and send it again',
      link: 'Edit it: guests see the change on the same link',
    },
    { label: 'Directions', card: 'Address printed on the card', pdf: 'Address in the picture', video: 'Address on screen', link: 'Google Maps in one tap' },
    { label: 'Replies', card: 'Guests call or message you', pdf: 'Guests call or message you', video: 'Guests call or message you', link: 'One-tap WhatsApp reply, on designs with RSVP' },
    { label: 'Photos, music, countdown', card: 'No', pdf: 'Photos only', video: 'Photos and music', link: 'Photos, music and a live countdown' },
    { label: "On a guest's phone", card: 'Not on the phone', pdf: 'A file to download and zoom into', video: 'A large file to download', link: 'Opens at once, no app' },
    { label: 'Something to keep', card: 'Yes, a card to hold', pdf: 'No', video: 'No', link: 'No' },
  ]
  // The link first: on a phone the table opens on the label and the first column, and the
  // others are a swipe away.
  const head = ['Invitation link', 'Printed card', 'PDF or image', 'Video invitation']

  return (
    <Section tone="paper" id="compare" aria-label="Printed card, PDF, video or link">
      <SectionHeading
        eyebrow="Choosing the format"
        title={`Printed card, PDF, video or link: which ${noun} is best?`}
        sub="Each has its place. Here is how they compare, side by side."
      />
      {/* Wider than a phone: the table scrolls inside its frame, never the page. */}
      <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-champagne/60" tabIndex={0} aria-label="Comparison table, scrolls sideways">
        <table className="w-full min-w-[46rem] border-collapse text-left text-[0.88rem] leading-6">
          <caption className="sr-only">Printed card, PDF, video and invitation link compared</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="sticky left-0 z-10 bg-champagne px-3 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted sm:px-4">
                <span className="sr-only">Compared on</span>
              </th>
              {head.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-4 py-3.5 font-editorial text-[1.15rem] font-semibold leading-tight ${i === 0 ? 'bg-peach text-burnished-deep' : 'text-charcoal'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="sticky left-0 z-10 w-28 bg-champagne px-3 py-3 align-top text-[0.82rem] font-semibold text-charcoal sm:w-40 sm:px-4">
                  {r.label}
                </th>
                <td className="bg-peach/70 px-4 py-3 align-top font-medium text-charcoal">{r.link}</td>
                <td className="px-4 py-3 align-top text-charcoal/75">{r.card}</td>
                <td className="px-4 py-3 align-top text-charcoal/75">{r.pdf}</td>
                <td className="px-4 py-3 align-top text-charcoal/75">{r.video}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[0.8rem] text-muted sm:hidden" aria-hidden>
        Swipe the table to compare with a card, PDF and video →
      </p>
      <p className="mt-5 max-w-3xl text-[0.95rem] leading-7 text-charcoal/80">
        Many families do both: a few printed cards for elders and close relatives, and the link for everyone else, so
        every guest gets the map, the schedule and the countdown on their phone. Card and video prices are typical
        ranges in India; features of a link vary by design.
      </p>
    </Section>
  )
}
