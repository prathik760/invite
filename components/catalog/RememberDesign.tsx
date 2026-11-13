'use client'

import { useEffect } from 'react'
import { rememberDesign } from '@/lib/recentDesigns'

/** Notes, on this device only, that the visitor looked at this design (see lib/recentDesigns). */
export default function RememberDesign({ id }: { id: string }) {
  useEffect(() => rememberDesign(id), [id])
  return null
}
