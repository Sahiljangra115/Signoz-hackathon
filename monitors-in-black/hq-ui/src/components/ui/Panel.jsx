import React from 'react'

// Terminal pane: prompt-style header, thin chrome. Sits inside the HQ window
// like a tmux pane with gaps.
export default function Panel({ title, badge, glow, children, className = '' }) {
  const borderGlow = glow ? 'shadow-glow border-alien/40' : 'border-edge'
  return (
    <div className={`border rounded-2xl flex flex-col overflow-hidden bg-card/80 backdrop-blur-xl bg-card-sheen shadow-card ${borderGlow} ${className}`}>
      {title && (
        <div className="h-9 border-b border-edge/70 flex items-center justify-between px-3.5 bg-panel/40 backdrop-blur-sm select-none">
          <span className="font-mono text-[11px] lowercase tracking-wide text-ink/85">
            <span className="text-alien mr-2">❯</span>
            {title}
          </span>
          {badge && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-alien px-1.5 py-0.5 rounded-full border border-alien/20 bg-alien/5">
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
