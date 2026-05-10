'use client'

interface MinaAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  showPulse?: boolean
}

const sizes = {
  sm: { outer: 'w-8 h-8 text-sm', ring: '-inset-2', dot: 'w-2.5 h-2.5' },
  md: { outer: 'w-11 h-11 text-base', ring: '-inset-2.5', dot: 'w-3 h-3' },
  lg: { outer: 'w-20 h-20 text-3xl', ring: '-inset-3', dot: 'w-3.5 h-3.5' },
}

export function MinaAvatar({ size = 'md', showPulse = true }: MinaAvatarProps) {
  const s = sizes[size]

  return (
    <div className="relative flex-shrink-0">
      {/* Orb */}
      <div
        className={`${s.outer} rounded-full flex items-center justify-center font-heading font-bold italic animate-glow relative z-10`}
        style={{
          background: 'var(--gold-dim)',
          border: '1.5px solid var(--gold-b)',
          color: 'var(--gold)',
        }}
      >
        M
      </div>

      {/* Spinning ring — only on large */}
      {size === 'lg' && (
        <div
          className="absolute rounded-full animate-spin-slow"
          style={{
            inset: '-8px',
            border: '1px solid rgba(0,201,167,0.12)',
          }}
        >
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'var(--teal)',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>
      )}

      {/* Online dot */}
      {showPulse && (
        <div
          className={`${s.dot} absolute bottom-0 right-0 rounded-full animate-pulse-dot z-20`}
          style={{
            background: 'var(--teal)',
            border: '2px solid var(--bg)',
          }}
        />
      )}
    </div>
  )
}
