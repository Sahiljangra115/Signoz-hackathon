import React from 'react'
import { threatColor } from '../../lib/constants'

export default function ThreatBar({ threat }) {
  const color = threatColor(threat)
  
  let fillBg = 'bg-alien'
  if (color === 'amber') fillBg = 'bg-amber shadow-[0_0_6px_rgba(255,176,0,0.4)]'
  if (color === 'danger') fillBg = 'bg-danger shadow-[0_0_6px_rgba(255,47,47,0.4)]'
  if (color === 'alien') fillBg = 'bg-alien shadow-[0_0_6px_rgba(57,255,20,0.4)]'

  return (
    <div className="flex items-center gap-1 justify-center my-2 select-none">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`h-1.5 w-6 transition-colors rounded-sm ${
            level <= threat ? fillBg : 'bg-edge'
          }`}
          title={`Threat Level ${threat}`}
        />
      ))}
    </div>
  )
}
