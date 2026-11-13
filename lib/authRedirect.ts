/**
 * Where to send someone after they sign in, and how to read it safely.
 *
 * The builder needs an account (middleware.ts): a signed-out visitor is sent to /auth/login with
 * the builder address they asked for in `callbackUrl`, design and all, so a refresh, Back or a
 * switch to "Create an account" never loses the design. That address comes from the query
 * string, so it is only ever followed when it stays on this site.
 */

const BASE = 'https://shareinvite.invalid'
export const AFTER_AUTH_DEFAULT = '/dashboard'

/**
 * A same-site path (with its query and hash), or the fallback. Rejects absolute URLs,
 * protocol-relative ones ("//evil.com"), backslash tricks ("/\evil.com", which browsers treat as
 * "//"), control characters, and anything that resolves to another origin.
 */
export function safeCallback(raw: string | null | undefined, fallback = AFTER_AUTH_DEFAULT): string {
  if (!raw || raw.length > 2000) return fallback
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\') || /[\u0000-\u001F\u007F]/.test(raw)) return fallback
  try {
    const u = new URL(raw, BASE)
    if (u.origin !== BASE) return fallback
    return u.pathname + u.search + u.hash
  } catch {
    return fallback
  }
}

/** The builder is the place sign-in can be required for (every other page is public). */
export function isBuilderPath(path: string): boolean {
  return path === '/create' || path.startsWith('/create?') || path.startsWith('/create/') || path.startsWith('/create#')
}

/** The design a builder address opens, if any (`/create?template=signature-rajwada`). */
export function templateFromCallback(callbackUrl: string): string | null {
  try {
    const u = new URL(callbackUrl, BASE)
    return u.pathname === '/create' ? u.searchParams.get('template') : null
  } catch {
    return null
  }
}

/** The same address with one query parameter set, for marking the arrival after sign-in. */
export function withParam(path: string, key: string, value: string): string {
  try {
    const u = new URL(path, BASE)
    u.searchParams.set(key, value)
    return u.pathname + u.search + u.hash
  } catch {
    return path
  }
}

/** Login or signup with the return address (and why they are here) carried along. */
export function authHref(page: '/auth/login' | '/auth/signup', callbackUrl: string, from?: string | null): string {
  const q = new URLSearchParams()
  if (callbackUrl !== AFTER_AUTH_DEFAULT) q.set('callbackUrl', callbackUrl)
  if (from) q.set('from', from)
  const s = q.toString()
  return s ? `${page}?${s}` : page
}
