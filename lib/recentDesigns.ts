/**
 * Designs this browser has looked at (a preview opened, or the design's own
 * page visited), newest first, so the homepage can offer them again to a
 * returning visitor. Kept on the device only; never sent anywhere.
 */
const KEY = 'si-recent-designs'
const MAX = 8

export function rememberDesign(id: string) {
  try {
    const list = recentDesigns().filter((x) => x !== id)
    window.localStorage.setItem(KEY, JSON.stringify([id, ...list].slice(0, MAX)))
  } catch {
    /* private mode or storage off: nothing to remember */
  }
}

export function recentDesigns(): string[] {
  try {
    const v: unknown = JSON.parse(window.localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}
