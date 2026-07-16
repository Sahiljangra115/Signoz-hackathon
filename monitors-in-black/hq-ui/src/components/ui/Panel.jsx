import React from 'react'

export default function Panel({ title, badge, glow, children, className = '' }) {
  const borderGlow = glow ? 'shadow-glow border-alien/40' : 'border-edge'
  return (
    <div className={`border rounded-sm flex flex-col overflow-hidden bg-panel ${borderGlow} ${className}`}>
      {title && (
        <div className="h-10 border-b border-edge flex items-center justify-between px-3 bg-panel/60 select-none">
          <span className="font-display text-xs uppercase tracking-agency text-ink/60 font-bold">
            {title}
          </span>
          {badge && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-alien px-1.5 py-0.5 border border-alien/20 bg-alien/5">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 overflow-hidden p-4 relative">
        {children}
      </div>
    </div>
  )
}
