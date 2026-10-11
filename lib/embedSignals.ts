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
