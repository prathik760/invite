import WordingCopyCard from '@/components/wording/WordingCopyCard'
import type { TocItem } from '@/components/wording/WordingToc'

export interface WordingMessageData {
  title: string
  /** The message exactly as it is copied. Blank lines are kept. */
  text: string
}

export interface WordingSectionData {
  /** Anchor for the jump links. Keep stable — people share these URLs. */
  id: string
  /** Short label for the jump links. */
  toc: string
  title: string
  intro: string
  messages: WordingMessageData[]
}

export const tocFrom = (sections: WordingSectionData[]): TocItem[] => sections.map((s) => ({ id: s.id, label: s.toc }))

/** One guide section: heading, a line of context, then copyable messages. */
export function WordingSection({
  section,
  templateId,
  ctaHref,
  paper = false,
}: {
  section: WordingSectionData
  templateId: string
  ctaHref: string
  paper?: boolean
}) {
  return (
    <section id={section.id} className={`scroll-mt-10 border-b border-line px-5 py-16 sm:py-20 ${paper ? 'bg-paper' : ''}`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="t-h2 mb-3">{section.title}</h2>
        <p className="mb-8 text-sm leading-7 text-muted">{section.intro}</p>
        <div className="space-y-6">
          {section.messages.map((m) => (
            <div key={m.title}>
              <h3 className="mb-1 font-editorial text-[1.25rem] font-semibold leading-snug text-charcoal">{m.title}</h3>
              <WordingCopyCard templateId={templateId} ctaHref={ctaHref}>{m.text}</WordingCopyCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
