import React from 'react'
import { templateImage } from '@/lib/templateMedia'

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
    color: '#B87924', rgb: '184,121,36', image: templateImage('elegant-wedding'),
  },
  'cinematic-night': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="2" y="5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 5V15M14 5V15M2 8h2M2 12h2M16 8h2M16 12h2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #0E0E17 100%)',
    color: '#C9A84C', rgb: '201,168,76', image: templateImage('cinematic-night'),
  },
  'indian-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2C10 2 6 5 6 8.5C6 10.4 7.8 12 10 12C12.2 12 14 10.4 14 8.5C14 5 10 2 10 2Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M4 17C4 14.2 6.7 12.5 10 12.5C13.3 12.5 16 14.2 16 17" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C41E3A 0%, #8B0030 100%)',
    color: '#C41E3A', rgb: '196,30,58', image: templateImage('indian-wedding'),
  },
  'indian-engagement': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth={1.3} /><circle cx="10" cy="8" r="1.2" fill="currentColor" opacity="0.6" /></svg>,
    gradient: 'linear-gradient(135deg, #C2185B 0%, #880E4F 100%)',
    color: '#C2185B', rgb: '194,24,91', image: templateImage('indian-engagement'),
  },
  'indian-birthday': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="3" y="10" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth={1.5} /><path d="M6 10V8M10 10V7M14 10V8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #E65100 100%)',
    color: '#FF8C00', rgb: '255,140,0', image: templateImage('indian-birthday'),
  },
  'griha-pravesh': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10V17H15V10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
    color: '#FF8F00', rgb: '255,143,0', image: templateImage('griha-pravesh'),
  },
  'namakaran': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth={1.5} /><path d="M6 16C6 13.8 7.8 12 10 12C12.2 12 14 13.8 14 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
    color: '#0288D1', rgb: '2,136,209', image: templateImage('namakaran'),
  },
  'anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #5C0020 100%)',
    color: '#8B0030', rgb: '139,0,48', image: templateImage('anniversary'),
  },
  'kgf-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 17C10 17 3 12.5 3 8C3 5.8 4.8 4 7 4C8.5 4 9.8 4.9 10 6C10.2 4.9 11.5 4 13 4C15.2 4 17 5.8 17 8C17 12.5 10 17 10 17Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #FF5500 0%, #D4A017 45%, #040200 100%)',
    color: '#D4A017', rgb: '212,160,23', image: templateImage('kgf-wedding'),
  },
  'royal-deco': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.5 4.5H16l-3.7 2.7 1.4 4.3L10 11l-3.7 2.5 1.4-4.3L4 6.5h4.5L10 2z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1A1540 0%, #C8902A 55%, #07050F 100%)',
    color: '#C8902A', rgb: '200,144,42', image: templateImage('royal-deco'),
  },
  'luxury-wedding': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0-3 2.5-3 5.5a3 3 0 006 0C13 5.5 10 3 10 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M5 15.5c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F9F4EA 0%, #C9A44D 60%, #B07878 100%)',
    color: '#C9A44D', rgb: '201,164,77', image: templateImage('luxury-wedding'),
  },
  'surprise-journey': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 8h14v9H3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M2 8h16v3H2zM10 4v13" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /><path d="M10 5C10 5 8 2.5 6.5 3.2 5 4 6.5 6 10 5zM10 5c0 0 2-2.5 3.5-1.8C15 4 13.5 6 10 5z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #B0324B 0%, #8E6BD1 55%, #241028 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: templateImage('surprise-journey'),
  },
  'greeting-love': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #8E6BD1 100%)',
    color: '#E4577B', rgb: '228,87,123',
    image: templateImage('greeting-love'),
  },
  'greeting-valentine': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #B0324B 100%)',
    color: '#E4577B', rgb: '228,87,123',
    image: templateImage('greeting-valentine'),
  },
  'greeting-anniversary': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16C10 16 3 12 3 7.5C3 5.5 4.7 4 6.8 4C8.2 4 9.4 4.8 10 6C10.6 4.8 11.8 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12 10 16 10 16Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #8B0030 0%, #D9A441 100%)',
    color: '#D9A441', rgb: '217,164,65',
    image: templateImage('greeting-anniversary'),
  },
  'greeting-propose': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="5" stroke="currentColor" strokeWidth={1.5} /><path d="M10 6l-1.6-2.5h3.2L10 6z" fill="currentColor" /></svg>,
    gradient: 'linear-gradient(135deg, #E4577B 0%, #E8B84B 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: templateImage('greeting-propose'),
  },
  'greeting-promise': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="7.5" cy="10" r="3.5" stroke="currentColor" strokeWidth={1.5} /><circle cx="12.5" cy="10" r="3.5" stroke="currentColor" strokeWidth={1.5} /></svg>,
    gradient: 'linear-gradient(135deg, #2F766D 0%, #8E6BD1 100%)',
    color: '#7FC9BE', rgb: '127,201,190',
    image: templateImage('greeting-promise'),
  },
  'greeting-sorry': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c2 2.5 4 4.8 4 7a4 4 0 11-8 0c0-2.2 2-4.5 4-7z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #7FA8C9 0%, #C9B7D9 100%)',
    color: '#5E7FA8', rgb: '94,127,168',
    image: templateImage('greeting-sorry'),
  },
  'greeting-congratulations': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M15.5 4.5l-2 2M6.5 13.5l-2 2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E8B84B 0%, #8E6BD1 100%)',
    color: '#E8B84B', rgb: '232,184,75',
    image: templateImage('greeting-congratulations'),
  },
  'greeting-festival': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c0 0 3 3.5 3 6.5a3 3 0 01-6 0C7 6.5 10 3 10 3z" fill="currentColor" opacity="0.85" /></svg>,
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #8E6BD1 100%)',
    color: '#F2C14E', rgb: '242,193,78',
    image: templateImage('greeting-festival'),
  },
  'greeting-family': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth={1.4} /><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth={1.4} /><path d="M3.5 16c0-2.2 1.6-3.5 3.5-3.5S10.5 13.8 10.5 16M9.5 16c0-2.2 1.6-3.5 3.5-3.5s3.5 1.3 3.5 3.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E8A44B 0%, #B0324B 100%)',
    color: '#F2C14E', rgb: '242,193,78',
    image: templateImage('greeting-family'),
  },
  'greeting-friendship': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2l1.9 5.2H17l-4.1 3 1.6 5.1L10 12.5 5.5 15.3l1.6-5.1L3 7.2h5.1L10 2z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #5AB7C9 0%, #E4577B 100%)',
    color: '#5AB7C9', rgb: '90,183,201',
    image: templateImage('greeting-friendship'),
  },
  'ganesh-chaturthi': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3.2c2.2 2.7 4.6 6.2 4.6 8.6 0 2.5-2.1 4.4-4.6 4.4s-4.6-1.9-4.6-4.4c0-2.4 2.4-5.9 4.6-8.6z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /><path d="M6.2 13.4h7.6" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F0A32A 0%, #E4761B 48%, #B4232A 100%)',
    color: '#E4761B', rgb: '228,118,27',
    image: templateImage('ganesh-chaturthi'),
  },
  'rakshabandhan': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth={1.4} /><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.3 4.3l2.1 2.1M13.6 13.6l2.1 2.1M15.7 4.3l-2.1 2.1M6.4 13.6l-2.1 2.1" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E0B65A 0%, #C24E68 100%)',
    color: '#C24E68', rgb: '194,78,104',
    image: templateImage('rakshabandhan'),
  },
  'signature-rajwada': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M4 17V9a6 6 0 0112 0v8M2.5 17h15M10 3V1.8M7 17v-5a3 3 0 016 0v5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C9A45C 0%, #6B1F2A 100%)',
    color: '#8A2E35', rgb: '138,46,53',
    image: templateImage('signature-rajwada'),
  },
  'signature-kalyanam': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M5 17h10M6 17V9l4-6 4 6v8M8 12h4M8 9.5h4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #E0A93B 0%, #7C2D12 100%)',
    color: '#B45309', rgb: '180,83,9',
    image: templateImage('signature-kalyanam'),
  },
  'signature-nikah': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M12.5 3.5a6.5 6.5 0 100 13 5.2 5.2 0 110-13z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><path d="M15.5 6.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1F6F5C 0%, #C9A45C 100%)',
    color: '#1F6F5C', rgb: '31,111,92',
    image: templateImage('signature-nikah'),
  },
  'signature-garden': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 17V8M10 11c-3 0-5-2-5-5 3 0 5 2 5 5zM10 9c0-3 2-5 5-5 0 3-2 5-5 5z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #7A8B6F 0%, #D9B7A7 100%)',
    color: '#6E7B5F', rgb: '110,123,95',
    image: templateImage('signature-garden'),
  },
  'signature-aquarelle': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM10 5c1 .6 1.4 1.6 1 2.6-.4 1-1.6 1.3-2.4.7M7.6 10.8 6 17l2.2-1.2L9.4 18l.6-6.5M12.4 10.8 14 17l-2.2-1.2L10.6 18" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1B2537 0%, #86384C 58%, #E9B9BE 100%)',
    color: '#86384C', rgb: '134,56,76',
    image: templateImage('signature-aquarelle'),
  },
  'baby-shower': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M6 8a4 4 0 118 0v2a4 4 0 11-8 0zM8 17h4M10 14v3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F1BDB6 0%, #A9D6BD 100%)',
    color: '#A3405F', rgb: '163,64,95',
    image: templateImage('baby-shower'),
  },
  'first-birthday': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2.5a4.5 4.5 0 014.5 4.5c0 3-4.5 6.5-4.5 6.5S5.5 10 5.5 7A4.5 4.5 0 0110 2.5zM10 13.5V18M8.5 18h3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F2A93B 0%, #5AB7C9 100%)',
    color: '#E07A2B', rgb: '224,122,43',
    image: templateImage('first-birthday'),
  },
  'haldi-mehendi': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3c2 2.5 4 5 4 7.5a4 4 0 01-8 0C6 8 8 5.5 10 3zM10 9v5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F2C230 0%, #4E7B2C 100%)',
    color: '#C99A12', rgb: '201,154,18',
    image: templateImage('haldi-mehendi'),
  },
  'sangeet-night': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M8 15.5a2 2 0 11-4 0 2 2 0 014 0zm0 0V5l9-2v10.5M17 13.5a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C0266D 0%, #2B1A5C 100%)',
    color: '#C0266D', rgb: '192,38,109',
    image: templateImage('sangeet-night'),
  },
  'pooja-invite': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M4 13c1.5 3 10.5 3 12 0zM10 12c-1.6-1.6-1.2-3.4 0-6 1.2 2.6 1.6 4.4 0 6z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F3B34A 0%, #B3261D 100%)',
    color: '#C2410C', rgb: '194,65,12',
    image: templateImage('pooja-invite'),
  },
  'diwali-party': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3.5 12.5c1.8 3.4 11.2 3.4 13 0zM10 11.5c-1.8-1.8-1.3-3.8 0-6.5 1.3 2.7 1.8 4.7 0 6.5zM15 3.5l.5 1.5M17 6l-1.4.4M5 3.5L4.5 5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F4B63F 0%, #3B1260 100%)',
    color: '#D97706', rgb: '217,119,6',
    image: templateImage('diwali-party'),
  },
  'eid-milan': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M12.5 3a7 7 0 100 14 5.6 5.6 0 110-14z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0F5E4E 0%, #E3C27A 100%)',
    color: '#0F5E4E', rgb: '15,94,78',
    image: templateImage('eid-milan'),
  },
  'retirement': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M5 3h10v4a5 5 0 01-10 0zM10 12v3.5M7 17h6M5 5H3.5a2 2 0 002 3M15 5h1.5a2 2 0 01-2 3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #1C2A45 0%, #C9A55E 100%)',
    color: '#1C2A45', rgb: '28,42,69',
    image: templateImage('retirement'),
  },
  'save-the-date': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="3.5" y="4.5" width="13" height="12" rx="1" stroke="currentColor" strokeWidth={1.4} /><path d="M3.5 8h13M7 3v3M13 3v3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" /><path d="M9.2 10.6c2.6-.9 4.4.2 3.9 1.8-.5 1.5-3.4 1.9-4.6.8-.9-.8-.3-2 1.6-2.5" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #C7CBBA 0%, #A8472A 100%)',
    color: '#A8472A', rgb: '168,71,42',
    image: templateImage('save-the-date'),
  },
  'birthday-mirrorball': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 1.5v3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" /><circle cx="10" cy="11" r="6" stroke="currentColor" strokeWidth={1.4} /><path d="M4 11h12M10 5c-2.2 1.6-2.2 10.4 0 12M10 5c2.2 1.6 2.2 10.4 0 12M5.2 7.6h9.6M5.2 14.4h9.6" stroke="currentColor" strokeWidth={1} /></svg>,
    gradient: 'linear-gradient(135deg, #0D0A0B 0%, #FF6A3D 100%)',
    color: '#FF6A3D', rgb: '255,106,61',
    image: templateImage('birthday-mirrorball'),
  },
  'birthday-martini': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 4h14l-7 7.5zM10 11.5V17M6.5 17.5h7" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="6.5" r="1.4" stroke="currentColor" strokeWidth={1.2} /><path d="M13 5.4l2-3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #27310F 0%, #C8372D 100%)',
    color: '#6E7D2C', rgb: '110,125,44',
    image: templateImage('birthday-martini'),
  },
  'birthday-champagne': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M4.5 4.5h11c0 3.4-2.4 5.5-5.5 5.5S4.5 7.9 4.5 4.5zM10 10v6.5M6.5 17h7" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><circle cx="8.5" cy="6.6" r=".7" fill="currentColor" /><circle cx="11.4" cy="7.4" r=".6" fill="currentColor" /></svg>,
    gradient: 'linear-gradient(135deg, #F7F1E6 0%, #B08A3E 100%)',
    color: '#9E7A33', rgb: '158,122,51',
    image: templateImage('birthday-champagne'),
  },
  'birthday-long-lunch': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3.5 10.5c0-3 3-5.5 6.5-5.5s6.5 2.5 6.5 5.5-3 5.5-6.5 5.5-6.5-2.5-6.5-5.5z" stroke="currentColor" strokeWidth={1.4} /><path d="M2.5 10.5h1M16.5 10.5h1M8 2.5c1 .6 1.6 1.4 2 2.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" /></svg>,
    gradient: 'linear-gradient(135deg, #F2C230 0%, #E8602C 100%)',
    color: '#E8602C', rgb: '232,96,44',
    image: templateImage('birthday-long-lunch'),
  },
  'birthday-gala': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="2.5" y="5" width="15" height="11" rx="1.2" stroke="currentColor" strokeWidth={1.4} /><path d="M2.8 5.4 10 11l7.2-5.6" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /><circle cx="10" cy="11" r="1.8" fill="currentColor" /></svg>,
    gradient: 'linear-gradient(135deg, #0B2A23 0%, #C9A04E 100%)',
    color: '#C9A04E', rgb: '201,160,78',
    image: templateImage('birthday-gala'),
  },
  'dasara-ambari': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M3 16.5h14M4.5 16.5v-5h11v5M7.5 11.5V8.5h5v3M10 3v1.6M8 8.5c0-2.4 1-3.6 2-4 1 .4 2 1.6 2 4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="14" r=".7" fill="currentColor" /><circle cx="14" cy="14" r=".7" fill="currentColor" /></svg>,
    gradient: 'linear-gradient(135deg, #26114F 0%, #E9B949 100%)',
    color: '#E9B949', rgb: '233,185,73',
    image: templateImage('dasara-ambari'),
  },
  'christmas-evergreen': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2.5l1 2 2.2.2-1.7 1.4.6 2.1L10 7l-2.1 1.2.6-2.1L6.8 4.7 9 4.5zM10 8.5l4.5 6h-9zM10 11.5l5.5 5h-11zM10 16.5v1.5" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #0F3324 0%, #B3122E 100%)',
    color: '#B3122E', rgb: '179,18,46',
    image: templateImage('christmas-evergreen'),
  },
  'newyear-midnight': {
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="11" r="6.5" stroke="currentColor" strokeWidth={1.4} /><path d="M10 7.5V11l2.2 1.4M8.5 2.5h3M10 2.5v2" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>,
    gradient: 'linear-gradient(135deg, #07070C 0%, #D8B25A 100%)',
    color: '#D8B25A', rgb: '216,178,90',
    image: templateImage('newyear-midnight'),
  },
}

export const DARK_TEMPLATES = new Set([
  'cinematic-night', 'kgf-wedding', 'royal-deco', 'luxury-wedding', 'anniversary', 'indian-birthday',
  'surprise-journey', 'signature-nikah', 'sangeet-night', 'diwali-party', 'retirement',
  'birthday-mirrorball', 'birthday-martini', 'birthday-gala', 'dasara-ambari', 'christmas-evergreen', 'newyear-midnight',
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
