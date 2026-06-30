'use client'

import dynamic from 'next/dynamic'

const PreviewPane = dynamic(() => import('@/components/editor/PreviewPane'), { ssr: false })

interface MobilePreviewStripProps {
  templateId: string
  data: Record<string, string>
  isDark?: boolean
  color?: string
}

export default function MobilePreviewStrip({ templateId, data, isDark = false }: MobilePreviewStripProps) {
  return (
    <div
      className="flex flex-col items-center py-5 mx-4 my-4 rounded-2xl"
      style={{
        background: isDark
          ? 'rgba(6,6,14,0.6)'
          : 'rgba(184,138,68,0.05)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(184,138,68,0.15)'}`,
      }}
    >
      <p
        className="text-[9px] font-bold uppercase tracking-[.24em] mb-3"
        style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(44,32,28,0.38)' }}
      >
        Live preview — updates as you type
      </p>

      {/* Minimal phone shell */}
      <div
        style={{
          background: '#1C1C1E',
          borderRadius: '22px',
          padding: '6px',
          boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
        }}
      >
        {/* Dynamic island */}
        <div style={{ height: '18px', display: 'flex', justifyContent: 'center', marginBottom: '-14px', position: 'relative', zIndex: 2 }}>
          <div style={{ marginTop: '4px', width: '56px', height: '12px', background: '#1C1C1E', borderRadius: '6px' }} />
        </div>

        {/* Screen container — clips the scaled PreviewPane */}
        <div
          style={{
            width: '144px',
            height: '248px',
            borderRadius: '17px',
            overflow: 'hidden',
            background: '#fff',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '328px',
              transformOrigin: 'top left',
              transform: 'scale(0.4390)',
              pointerEvents: 'none',
            }}
          >
            <PreviewPane templateId={templateId} data={data} />
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5px', paddingBottom: '1px' }}>
          <div style={{ width: '44px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
        </div>
      </div>

      <p
        className="text-[9px] mt-3"
        style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(44,32,28,0.32)' }}
      >
        Scroll inside to explore
      </p>
    </div>
  )
}
