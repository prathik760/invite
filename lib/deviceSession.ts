/**
 * What this browser keeps for whoever is signed in, cleared when they sign
 * out, so the next person to use the device (or sign in on it) does not
 * inherit it:
 *  - 'si-host'         how many invitations the host has (the homepage's welcome-back line)
 *  - 'invitely-draft'  an unfinished invitation in the builder, with its names and details
 *
 * Left alone on purpose: 'si_my_invitations' and 'si_purchase_pass', which let
 * someone who bought without an account find and edit their invitation again
 * on this device; and the recently viewed designs, which hold design ids only.
 */
const SIGNED_IN_KEYS = ['si-host', 'invitely-draft']

export function forgetSignedInDevice() {
  try {
    for (const k of SIGNED_IN_KEYS) window.localStorage.removeItem(k)
  } catch {
    /* storage off: nothing was kept */
  }
}
