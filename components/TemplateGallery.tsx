'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TemplateItem {
  name: string
  slug: string
  templateId: string
  theme: string
  category: string
  previewImage: string
}

interface FaqItem {
  question: string
  answer: string
}

interface TemplateGalleryProps {
  title: string
  subtitle: string
  filters: string[]
  templates: TemplateItem[]
  singularPageHref: string
  singularPageLabel: string
  faq: FaqItem[]
}

export default function TemplateGallery({
  title,
  subtitle,
  filters,
  templates,
  singularPageHref,
  singularPageLabel,
  faq,
}: TemplateGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered =
    activeFilter === 'All' ? templates : templates.filter((t) => t.category === activeFilter)

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">
            Create Invitation
          </Link>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Hero */}
        <h1 className="font-display text-4xl font-normal text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{subtitle}</p>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-[#7A3E4A] text-white'
                  : 'bg-white border border-border text-muted hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <div
              key={template.slug}
              className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="aspect-[3/4] bg-[#FCF7F1] relative">
                <img
                  src={template.previewImage}
                  alt={`${template.name} digital invitation template`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <span className="rounded-full border border-[#D9A441]/30 bg-[#FFFBF5] px-2.5 py-1 text-xs font-semibold text-accent-strong">
                  {template.theme}
                </span>
                <h3 className="mt-3 font-heading text-base text-ink">{template.name}</h3>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/templates/${template.slug}`}
                    className="flex-1 rounded-lg border border-border py-2 text-center text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/create?template=${template.templateId}`}
                    className="gold-button flex-1 rounded-lg py-2 text-center text-sm font-semibold"
                  >
                    Use This
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-link CTA */}
        <div className="mt-16 rounded-2xl border border-[#E8DCCD] bg-[#FFF9F2] px-8 py-8 text-center">
          <p className="font-heading text-lg text-ink">Ready to create your invitation?</p>
          <p className="mt-2 text-sm text-muted">
            Choose a template, fill in your details, and share on WhatsApp in under 5 minutes.
          </p>
          <Link
            href={singularPageHref}
            className="mt-5 inline-block text-sm font-semibold text-accent-strong hover:underline"
          >
            {singularPageLabel} →
          </Link>
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl text-ink">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-ink hover:bg-[#FAFAFA]"
                >
                  <span className="text-sm">{item.question}</span>
                  <span className="ml-4 shrink-0 text-accent-strong">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-7 text-muted">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
