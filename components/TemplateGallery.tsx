'use client'

import { useState } from 'react'
import { templateImage } from '@/lib/templateMedia'
import { formatTemplatePrice, templatePrice } from '@/lib/plans'
import { is3D } from '@/lib/catalog'
import type { CatalogItem } from '@/lib/catalogItems'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import TemplateCard from '@/components/catalog/TemplateCard'
import CtaBand from '@/components/brand/CtaBand'

interface TemplateItem {
  name: string
  slug: string
  templateId: string
  theme: string
  category: string
  /** Unused. Kept optional so existing page data still type-checks; the real
   *  preview is resolved from templateId. */
  previewImage?: string
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

/** Adapts this page family's hand-written items to the shared card. */
function toCard(t: TemplateItem): CatalogItem {
  return {
    id: t.templateId,
    name: t.name,
    description: '',
    price: templatePrice(t.templateId),
    priceLabel: formatTemplatePrice(t.templateId),
    slug: t.slug,
    // Resolved from templateId. Every page in this gallery pointed at
    // /templates/*-preview.jpg, a directory that does not exist in /public.
    image: templateImage(t.templateId),
    occasions: [],
    occasionLabel: t.category,
    style: t.theme,
    is3D: is3D(t.templateId),
  }
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
    <>
      <SiteHeader />
      <main className="min-h-screen bg-champagne text-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <h1 className="t-h1 enter-0">{title}</h1>
          <p className="t-lede enter-1 mt-4 max-w-2xl">{subtitle}</p>

          <div role="group" aria-label="Filter designs" className="scrollbar-hide -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'border-emerald bg-emerald text-paper'
                    : 'border-line bg-paper text-charcoal hover:border-burnished'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
            {filtered.map((template, i) => (
              <TemplateCard key={template.slug} item={toCard(template)} source="template_gallery_card" priority={i < 2} />
            ))}
          </div>

          <section className="mt-14">
            <h2 className="t-h2" data-reveal>Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-line bg-paper">
                  <button
                    type="button"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-champagne"
                  >
                    <span className="text-[0.95rem]">{item.question}</span>
                    <span className="ml-4 shrink-0 text-burnished" aria-hidden>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-[0.92rem] leading-7 text-charcoal/75">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
        <CtaBand
          title="Ready to create your invitation?"
          sub="Choose a design, fill in your details, preview it, and share one link — you pay only when you publish."
          primary={{ href: '/create', label: 'Create your invitation' }}
          secondary={{ href: singularPageHref, label: singularPageLabel }}
          location="template_gallery_closing"
        />
      </main>
      <SiteFooter />
    </>
  )
}
