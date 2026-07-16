import React from 'react'

export default function StatusChip({ status }) {
  let chipClass = 'border-edge text-ink/40'
  
  if (status === 'open') {
    chipClass = 'border-amber text-amber animate-pulse-soft'
  } else if (status === 'investigating') {
    chipClass = 'border-alien text-alien animate-blink-hard'
  } else if (status === 'neuralyzed') {
    chipClass = 'border-edge text-ink/40 bg-panel/30'
  } else if (status === 'escalated') {
    chipClass = 'border-danger text-danger shadow-glow-danger bg-danger/5'
  }

  return (
    <span className={`border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${chipClass}`}>
      {status}
    </span>
  )
}
