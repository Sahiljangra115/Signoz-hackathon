import React from 'react'
import { motion } from 'framer-motion'
import { SPRING_SOFT } from '../../lib/motion'
import RadarBlip from './RadarBlip'

export default function Radar({ cases, onBlipClick }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_SOFT}
        className="w-[85%] aspect-square max-w-[340px] rounded-full border border-alien/20 relative overflow-hidden backdrop-blur-xl shadow-[inset_0_0_60px_rgba(0,0,0,0.65),inset_0_0_1px_rgba(57,255,20,0.25)]"
        style={{
          background: 'radial-gradient(circle at 50% 42%, rgba(57,255,20,0.05), rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)',
        }}
      >
        {/* Radar concentric rings, soft glass gradient edges */}
        <div className="absolute inset-[16.5%] rounded-full border border-alien/15 shadow-[0_0_12px_rgba(57,255,20,0.06)] pointer-events-none" />
        <div className="absolute inset-[33%] rounded-full border border-alien/10 pointer-events-none" />
        <div className="absolute inset-[49.5%] rounded-full border border-alien/[0.07] pointer-events-none" />
        <div className="absolute inset-[66%] rounded-full border border-alien/10 pointer-events-none" />
        <div className="absolute inset-[82.5%] rounded-full border border-alien/[0.07] pointer-events-none" />

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
          <div className="absolute top-0 bottom-1/2 left-1/2 w-0.5 bg-alien/50 origin-bottom -translate-x-1/2 shadow-glow" />
        </div>

        {/* Outer glass rim highlight */}
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }} />

        {/* Render Blips */}
        {cases.map((c) => (
          <RadarBlip
            key={c.id}
            caseObj={c}
            onClick={() => onBlipClick(c.id)}
          />
        ))}
      </motion.div>

      {cases.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-2 flex flex-col items-center gap-1 text-ink/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-alien/40 animate-pulse-soft" />
          <span className="text-[10px] tracking-agency uppercase font-mono">No active contacts</span>
        </motion.div>
      )}
    </div>
  )
}
