import React from 'react'

export const TEMPLATE_VISUALS: Record<string, {
  icon: React.ReactNode
  gradient: string
  color: string
  rgb: string
}> = {
  'elegant-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 15c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #D9A441 0%, #B87924 100%)',
    color: '#B87924', rgb: '184,121,36',
  },
  'cinematic-night': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="2" y="5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 5V15M14 5V15M2 8h2M2 12h2M16 8h2M16 12h2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #0E0E17 100%)',
    color: '#C9A84C', rgb: '201,168,76',
  },
  'indian-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2C10 2 6 5 6 8.5C6 10.4 7.8 12 10 12C12.2 12 14 10.4 14 8.5C14 5 10 2 10 2Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 17C4 14.2 6.7 12.5 10 12.5C13.3 12.5 16 14.2 16 17" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C41E3A 0%, #8B0030 100%)',
    color: '#C41E3A', rgb: '196,30,58',
  },
  'indian-engagement': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth={1.3} /><circle cx="10" cy="8" r="1.2" fill="currentColor" opacity="0.6" /></svg>,
    gradient: 'linear-gradient(135deg, #C2185B 0%, #880E4F 100%)',
    color: '#C2185B', rgb: '194,24,91',
  },
  'indian-birthday': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="3" y="10" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 10V8M10 10V7M14 10V8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #E65100 100%)',
    color: '#FF8C00', rgb: '255,140,0',
  },
  'griha-pravesh': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10V17H15V10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
    color: '#FF8F00', rgb: '255,143,0',
  },
  'namakaran': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth={1.5} /><path d="M6 16C6 13.8 7.8 12 10 12C12.2 12 14 13.8 14 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
    color: '#0288D1', rgb: '2,136,209',
  },
  'anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #5C0020 100%)',
    color: '#8B0030', rgb: '139,0,48',
  },
  'kgf-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 17C10 17 3 12.5 3 8C3 5.8 4.8 4 7 4C8.5 4 9.8 4.9 10 6C10.2 4.9 11.5 4 13 4C15.2 4 17 5.8 17 8C17 12.5 10 17 10 17Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #FF5500 0%, #D4A017 45%, #040200 100%)',
    color: '#D4A017', rgb: '212,160,23',
  },
  'royal-deco': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.5 4.5H16l-3.7 2.7 1.4 4.3L10 11l-3.7 2.5 1.4-4.3L4 6.5h4.5L10 2z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1540 0%, #C8902A 55%, #07050F 100%)',
    color: '#C8902A', rgb: '200,144,42',
  },
  'luxury-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M5 15.5c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F9F4EA 0%, #C9A44D 60%, #B07878 100%)',
    color: '#C9A44D', rgb: '201,164,77',
  },
}

export const DARK_TEMPLATES = new Set([
  'cinematic-night', 'indian-wedding', 'indian-engagement', 'indian-birthday',
  'griha-pravesh', 'namakaran', 'anniversary', 'kgf-wedding', 'royal-deco',
])
