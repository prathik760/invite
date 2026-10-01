export interface TocItem {
  /** The `id` of the section it jumps to. Keep stable — people share these links. */
  id: string
  label: string
}

/**
 * Jump links under the hero of a wording guide. Most readers arrive from a
 * search for one kind of message ("daughter birthday message for WhatsApp"),
 * so the first screen should get them to it in one tap. Sections carry
 * `scroll-mt-10` so the sticky header does not cover their heading.
 */
export default function WordingToc({ items, label = 'Jump to the message you need' }: { items: TocItem[]; label?: string }) {
  return (
    <nav aria-label="On this page" className="border-b border-line bg-paper px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">{label}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="pill px-3.5 py-1.5 text-[0.85rem] transition-colors hover:border-burnished">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
