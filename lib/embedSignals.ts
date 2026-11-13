/**
 * Messages between the live preview (components/create/LiveDemoScreen) and
 * the design it frames (/demo/<id>/embed, components/templates/EmbedStage).
 *
 * READY: the framed page can paint its first screen (fonts in, visible images
 * decoded). PLAY: the preview has just made the frame visible — start the
 * design from its first frame, so the opening is seen rather than played
 * behind the loading poster.
 */
export const EMBED_READY = 'si-embed:ready'
export const EMBED_PLAY = 'si-embed:play'

/**
 * The homepage's sample invitation (/demo/<id>/sample, components/templates/
 * SampleStage) and the page around it (components/homepage/TryInvitation).
 *
 * SHOW (to the frame): scroll to a part of the invitation and outline it.
 * QUIET (to the frame): stop its music, the visitor has moved on.
 * RSVP (from the frame): a guest tapped a WhatsApp reply; its prefilled text
 * comes with it, to be shown as a sample. Nothing is sent.
 */
export const SAMPLE_SHOW = 'si-sample:show'
/** To the frame: the visitor has scrolled away; stop the sample's music. */
export const SAMPLE_QUIET = 'si-sample:quiet'
export const SAMPLE_RSVP = 'si-sample:rsvp'
export type SampleFeature = 'details' | 'music' | 'gallery' | 'map' | 'rsvp'
