import React from 'react'

export const TEMPLATE_VISUALS: Record<string, {
  icon: React.ReactNode
  gradient: string
  color: string
  rgb: string
  image: string
}> = {
  'elegant-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 15c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #D9A441 0%, #B87924 100%)',
    color: '#B87924', rgb: '184,121,36', image: '/1.jpg',
  },
  'cinematic-night': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="2" y="5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 5V15M14 5V15M2 8h2M2 12h2M16 8h2M16 12h2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #0E0E17 100%)',
    color: '#C9A84C', rgb: '201,168,76', image: '/2.jpg',
  },
  'indian-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2C10 2 6 5 6 8.5C6 10.4 7.8 12 10 12C12.2 12 14 10.4 14 8.5C14 5 10 2 10 2Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 17C4 14.2 6.7 12.5 10 12.5C13.3 12.5 16 14.2 16 17" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C41E3A 0%, #8B0030 100%)',
    color: '#C41E3A', rgb: '196,30,58', image: '/3.jpg',
  },
  'indian-engagement': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth={1.3} /><circle cx="10" cy="8" r="1.2" fill="currentColor" opacity="0.6" /></svg>,
    gradient: 'linear-gradient(135deg, #C2185B 0%, #880E4F 100%)',
    color: '#C2185B', rgb: '194,24,91', image: '/4.jpg',
  },
  'indian-birthday': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="3" y="10" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 10V8M10 10V7M14 10V8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #E65100 100%)',
    color: '#FF8C00', rgb: '255,140,0', image: '/5.jpg',
  },
  'griha-pravesh': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10V17H15V10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
    color: '#FF8F00', rgb: '255,143,0', image: '/6.jpg',
  },
  'namakaran': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth={1.5} /><path d="M6 16C6 13.8 7.8 12 10 12C12.2 12 14 13.8 14 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
    color: '#0288D1', rgb: '2,136,209', image: '/7.jpg',
  },
  'anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #5C0020 100%)',
    color: '#8B0030', rgb: '139,0,48', image: '/10.jpg',
  },
  'kgf-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 17C10 17 3 12.5 3 8C3 5.8 4.8 4 7 4C8.5 4 9.8 4.9 10 6C10.2 4.9 11.5 4 13 4C15.2 4 17 5.8 17 8C17 12.5 10 17 10 17Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #FF5500 0%, #D4A017 45%, #040200 100%)',
    color: '#D4A017', rgb: '212,160,23', image: '/8.jpg',
  },
  'royal-deco': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.5 4.5H16l-3.7 2.7 1.4 4.3L10 11l-3.7 2.5 1.4-4.3L4 6.5h4.5L10 2z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1540 0%, #C8902A 55%, #07050F 100%)',
    color: '#C8902A', rgb: '200,144,42', image: '/9.jpg',
  },
  'luxury-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M5 15.5c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F9F4EA 0%, #C9A44D 60%, #B07878 100%)',
    color: '#C9A44D', rgb: '201,164,77', image: '/11.jpg',
  },
  'surprise-journey': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 8h14v9H3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M2 8h16v3H2zM10 4v13" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M10 5C10 5 8 2.5 6.5 3.2 5 4 6.5 6 10 5zM10 5c0 0 2-2.5 3.5-1.8C15 4 13.5 6 10 5z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #B0324B 0%, #8E6BD1 55%, #241028 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-love': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #8E6BD1 100%)',
    color: '#E4577B', rgb: '228,87,123',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-valentine': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #B0324B 100%)',
    color: '#E4577B', rgb: '228,87,123',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #D9A441 100%)',
    color: '#D9A441', rgb: '217,164,65',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-propose': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><path d="M10 6l-1.6-2.5h3.2L10 6z" fill="currentColor" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #E8B84B 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-promise': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="7.5" cy="10" r="3.5" stroke="currentColor" strokeWidth={1.5} /><circle cx="12.5" cy="10" r="3.5" stroke="currentColor" strokeWidth={1.5} /></svg>,
    gradient: 'linear-gradient(135deg, #2F766D 0%, #8E6BD1 100%)',
    color: '#7FC9BE', rgb: '127,201,190',
    image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-sorry': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c2 2.5 4 4.8 4 7a4 4 0 11-8 0c0-2.2 2-4.5 4-7z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #7FA8C9 0%, #C9B7D9 100%)',
    color: '#5E7FA8', rgb: '94,127,168',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-congratulations': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M15.5 4.5l-2 2M6.5 13.5l-2 2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E8B84B 0%, #8E6BD1 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-festival': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0 3 3.5 3 6.5a3 3 0 01-6 0C7 6.5 10 3 10 3z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #8E6BD1 100%)',
    color: '#F2C14E', rgb: '242,193,78',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-family': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth={1.4} /><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth={1.4} /><path d="M3.5 16c0-2.2 1.6-3.5 3.5-3.5S10.5 13.8 10.5 16M9.5 16c0-2.2 1.6-3.5 3.5-3.5s3.5 1.3 3.5 3.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E8A44B 0%, #B0324B 100%)',
    color: '#F2C14E', rgb: '242,193,78',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
  },
  'greeting-friendship': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.9 5.2H17l-4.1 3 1.6 5.1L10 12.5 5.5 15.3l1.6-5.1L3 7.2h5.1L10 2z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #5AB7C9 0%, #E4577B 100%)',
    color: '#5AB7C9', rgb: '90,183,201',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
  },
}

export const DARK_TEMPLATES = new Set([
  'cinematic-night', 'indian-wedding', 'indian-engagement', 'indian-birthday',
  'griha-pravesh', 'namakaran', 'anniversary', 'kgf-wedding', 'royal-deco',
  'surprise-journey',
  'greeting-love', 'greeting-valentine', 'greeting-anniversary', 'greeting-propose',
  'greeting-promise', 'greeting-congratulations', 'greeting-festival', 'greeting-family',
  'greeting-friendship',
])

// The 3D experiences (greeting + interactive journey) are stage-based, full-viewport
// designs: in a preview they fill the phone shell exactly, so there is nothing to
// scroll — the "scroll to explore" hint is hidden for them.
export function is3DTemplate(id: string): boolean {
  return id === 'surprise-journey' || id.startsWith('greeting-')
}
