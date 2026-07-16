import React from 'react'
import RadarBlip from './RadarBlip'

export default function Radar({ cases, onBlipClick }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
      <div className="w-[85%] aspect-square max-w-[340px] rounded-full border border-alien/20 relative overflow-hidden bg-void/50 shadow-inner">
        {/* Radar concentric rings */}
        <div className="absolute inset-[16.5%] rounded-full border border-alien/15 pointer-events-none" />
        <div className="absolute inset-[33%] rounded-full border border-alien/10 pointer-events-none" />
        <div className="absolute inset-[49.5%] rounded-full border border-alien/5 pointer-events-none" />
        <div className="absolute inset-[66%] rounded-full border border-alien/10 pointer-events-none" />
        <div className="absolute inset-[82.5%] rounded-full border border-alien/5 pointer-events-none" />

        {/* Crosshair hairlines */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-alien/10 pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-alien/10 pointer-events-none" />

        {/* Radar conic sweep rotator */}
        <div
          className="absolute inset-0 rounded-full animate-radar-spin pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, rgba(57,255,20,0.30) 0deg, rgba(57,255,20,0.08) 40deg, transparent 65deg)'
          }}
        >
          {/* Sweep leading edge line */}
          <div className="absolute top-0 bottom-1/2 left-1/2 w-0.5 bg-alien/50 origin-bottom -translate-x-1/2" />
        </div>

        {/* Render Blips */}
        {cases.map((c) => (
          <RadarBlip
            key={c.id}
            caseObj={c}
            onClick={() => onBlipClick(c.id)}
          />
        ))}
      </div>

      {cases.length === 0 && (
        <div className="absolute bottom-2 text-ink/30 text-[10px] tracking-agency uppercase font-mono">
          NO ACTIVE CONTACTS
        </div>
      )}
    </div>
  )
}
