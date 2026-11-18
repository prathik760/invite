'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface WordingDesign {
  id: string
  name: string
  price: number
  image: string
}

interface Designs {
  designs: Record<string, WordingDesign>
  companions: Record<string, string[]>
}

const Ctx = createContext<Designs | null>(null)

/**
 * Wraps a wording guide (birthday, wedding) so the panel shown after a copy can
 * offer a few matching designs (lib/wordingDesigns.ts). Given once per page:
 * passed to each of a guide's 100-plus message cards, the same list would be
 * repeated in the page's data a hundred times.
 */
export function WordingDesigns({ designs, companions, children }: Designs & { children: ReactNode }) {
  return <Ctx.Provider value={{ designs, companions }}>{children}</Ctx.Provider>
}

/** The design for these words first, then its companions. Empty outside <WordingDesigns>. */
export function useWordingDesigns(templateId: string): WordingDesign[] {
  const ctx = useContext(Ctx)
  if (!ctx) return []
  return [templateId, ...(ctx.companions[templateId] ?? [])]
    .map((id) => ctx.designs[id])
    .filter((d): d is WordingDesign => Boolean(d))
}
