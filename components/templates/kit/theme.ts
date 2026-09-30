/**
 * Colours and faces a template hands to shared sections (the wishes wall), so
 * they sit inside the design instead of dropping an ivory block into a dark
 * invitation.
 */
export interface InviteTheme {
  /** Section background. */
  bg: string
  /** Card / field surface. */
  surface: string
  ink: string
  muted: string
  line: string
  accent: string
  /** Text on the accent (button label). */
  onAccent: string
  heading: string
  body?: string
  /** Heading case/tracking treatment. */
  headingStyle?: React.CSSProperties
}

export const DEFAULT_THEME: InviteTheme = {
  bg: '#FBF7F1',
  surface: '#FFFFFF',
  ink: '#221B17',
  muted: 'rgba(34,27,23,0.6)',
  line: '#E8DCCD',
  accent: '#8A5A2B',
  onAccent: '#FFFFFF',
  heading: 'Georgia, serif',
}
