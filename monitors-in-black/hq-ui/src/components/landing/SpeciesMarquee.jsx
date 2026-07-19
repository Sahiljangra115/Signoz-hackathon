import React from 'react'
import { motion } from 'framer-motion'
import { SPECIES_META, threatColor } from '../../lib/constants'
import { SPRING } from '../../lib/motion'

const DOT = { alien: 'bg-alien', amber: 'bg-amber', danger: 'bg-danger' }

function Chip({ meta }) {
  const color = threatColor(meta.threat)
  return (
    <motion.div
      whileHover={{ y: -3, transition: SPRING }}
      className="flex items-center gap-3 rounded-2xl border border-edge bg-card/80 backdrop-blur-xl px-4 py-3 mx-2.5 shrink-0 select-none shadow-card"
    >
      <meta.Icon className="w-8 h-8 text-ink/70" />
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
          {meta.codename}
        </div>
        <div className="font-mono text-[9px] text-ink/40">{meta.signature}</div>
      </div>
      <div className="flex gap-1 ml-2" aria-label={`threat level ${meta.threat} of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`w-1 h-3 rounded-sm ${i < meta.threat ? DOT[color] : 'bg-edge'}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Known threats, on loop. Track holds the list twice; CSS scrolls half its width.
export default function SpeciesMarquee() {
  const species = Object.values(SPECIES_META)
  return (
    <div className="marquee py-2" aria-label="Species registry preview">
      <div className="marquee-track">
        {[...species, ...species].map((meta, i) => (
          <Chip key={i} meta={meta} />
        ))}
      </div>
    </div>
  )
}
