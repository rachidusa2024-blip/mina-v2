'use client'

import { MinaAvatar } from './MinaAvatar'

interface MinaMessageProps {
  message: string
  showAvatar?: boolean
  size?: 'sm' | 'md'
}

export function MinaMessage({ message, showAvatar = true, size = 'md' }: MinaMessageProps) {
  return (
    <div className="flex gap-3 items-start">
      {showAvatar && <MinaAvatar size="sm" />}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div
            className="text-[9px] font-bold tracking-widest uppercase mb-1.5"
            style={{ color: 'var(--gold)' }}
          >
            MINA
          </div>
        )}
        <div
          className={`font-heading italic leading-relaxed ${size === 'md' ? 'text-base' : 'text-sm'}`}
          style={{ color: 'var(--soft)' }}
        >
          {message}
        </div>
      </div>
    </div>
  )
}
