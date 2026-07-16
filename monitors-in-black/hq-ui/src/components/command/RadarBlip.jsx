import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPECIES_META, threatColor } from '../../lib/constants'
import { blipIdleVariants, blipSpawnVariants, pingVariants } from '../../lib/motion'

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

        <div className="absolute left-5 top-0 bg-panel/90 border border-edge px-1.5 py-0.5 rounded-sm pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity z-20 whitespace-nowrap font-mono text-[9px] text-ink uppercase tracking-wide">
          {id} : {meta ? meta.codename : 'IDENTIFYING…'}
        </div>
      </motion.button>
    </div>
  )
}
