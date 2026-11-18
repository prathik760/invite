'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface BuilderReview {
  id: string
  templateId: string
  name: string
  city: string | null
  rating: number
  text: string
}

const Ctx = createContext<BuilderReview[]>([])

/**
 * Approved host reviews (lib/reviews.ts) for the builder, loaded once by
 * app/create/layout.tsx, so the price step can show what hosts said without a
 * request of its own. An empty list until the first review is approved.
 */
export function BuilderReviews({ reviews, children }: { reviews: BuilderReview[]; children: ReactNode }) {
  return <Ctx.Provider value={reviews}>{children}</Ctx.Provider>
}

/** Up to `limit` reviews, this design's own first; with the average and count they come from. */
export function useBuilderReviews(templateId: string, limit = 2): { list: BuilderReview[]; average: number; count: number } {
  const all = useContext(Ctx)
  if (!all.length) return { list: [], average: 0, count: 0 }
  const own = all.filter((r) => r.templateId === templateId)
  const list = [...own, ...all.filter((r) => r.templateId !== templateId)].slice(0, limit)
  const average = all.reduce((sum, r) => sum + r.rating, 0) / all.length
  return { list, average, count: all.length }
}
