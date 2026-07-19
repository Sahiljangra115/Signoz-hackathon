import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPECIES_META, threatColor } from '../../lib/constants'
import { blipIdleVariants, blipSpawnVariants, pingVariants, SPRING } from '../../lib/motion'
import ThreatBar from '../ui/ThreatBar'

const COLORS = {
  alien: { dot: 'bg-alien shadow-glow', ring: 'border-alien' },
  amber: { dot: 'bg-amber shadow-glow-amber', ring: 'border-amber' },
  danger: { dot: 'bg-danger shadow-glow-danger', ring: 'border-danger' }
}

export default function RadarBlip({ caseObj, onClick }) {
  const { id, species } = caseObj
  const [pinging, setPinging] = useState(true)

  // §4.4 — position is a pure hash of the case id, so a blip lands in the same
  // spot across refreshes and re-renders instead of jumping around.
  const hash = [...id].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7)
  const angleRad = ((hash % 360) * Math.PI) / 180
  const radiusPct = 30 + ((hash >> 9) % 55)
  const left = 50 + radiusPct * Math.cos(angleRad) * 0.5
  const top = 50 + radiusPct * Math.sin(angleRad) * 0.5

  // Unidentified species reads amber: unknown is a warning, not a severity.
  const meta = SPECIES_META[species]
  const color = meta ? threatColor(meta.threat) : 'amber'
  const { dot, ring } = COLORS[color]

  return (
    <div
      style={{ left: `${left}%`, top: `${top}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <motion.button
        variants={blipSpawnVariants}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.25, transition: SPRING }}
        whileFocus={{ scale: 1.25, transition: SPRING }}
        onClick={onClick}
        aria-label={`Case ${id}, ${meta ? meta.codename : 'species unidentified'}`}
        className="relative group focus:outline-none"
      >
        <motion.div
          variants={blipIdleVariants}
          animate="idle"
          className={`w-3.5 h-3.5 rounded-full ${dot} cursor-pointer border border-void`}
        />

        {pinging && (
          <motion.div
            variants={pingVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={() => setPinging(false)}
            className={`absolute inset-0 rounded-full border-2 ${ring} pointer-events-none`}
          />
        )}

        <div
          className="absolute left-5 top-1/2 -translate-y-1/2 min-w-[9rem] bg-panel/90 backdrop-blur-md border border-edge shadow-card px-2.5 py-2 rounded-xl pointer-events-none z-20 origin-left opacity-0 scale-90 translate-x-[-4px] transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:scale-100 group-focus-visible:translate-x-0"
        >
          <div className="flex items-center gap-2">
            {meta && <meta.Icon className="w-6 h-6 text-ink/75 shrink-0" />}
            <div className="min-w-0">
              <div className="font-mono text-[9px] font-bold text-ink uppercase tracking-wide truncate">
                {meta ? meta.codename : 'IDENTIFYING…'}
              </div>
              <div className="font-mono text-[8px] text-ink/40 truncate">{id}</div>
            </div>
          </div>
          {meta && <ThreatBar threat={meta.threat} />}
        </div>
      </motion.button>
    </div>
  )
}
