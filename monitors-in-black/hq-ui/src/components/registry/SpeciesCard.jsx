import React from 'react'
import { motion } from 'framer-motion'
import ThreatBar from '../ui/ThreatBar'
import { timeAgo } from '../../lib/format'
import { SPECIES_META } from '../../lib/constants'
import { cardHoverVariants, silhouetteVariants } from '../../lib/motion'

export default function SpeciesCard({ entry, onClick }) {
  const { species_id, codename, threat_level, signature, captures, last_seen } = entry
  const meta = SPECIES_META[species_id]
  const Icon = meta && meta.Icon

  return (
    <motion.button
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      className="border border-edge bg-panel rounded-sm p-4 flex flex-col items-center text-center cursor-pointer transition-shadow hover:shadow-glow hover:border-alien/60 focus-visible:border-alien focus:outline-none w-full"
    >
      <div className="font-display text-[9px] tracking-agency text-ink/40 uppercase mb-2">
        * Wanted *
      </div>

      <motion.div
        variants={silhouetteVariants}
        className="w-full h-24 flex justify-center text-ink select-none hover:[filter:drop-shadow(0_0_6px_rgba(57,255,20,0.6))]"
      >
        {/* An unknown species still gets a card; it just renders without a
            silhouette rather than falsely showing some other alien. */}
        {Icon ? <Icon className="h-24 w-auto" /> : null}
      </motion.div>

      <div className="font-display text-lg font-bold uppercase tracking-agency text-ink mt-3">
        {codename}
      </div>

      <ThreatBar threat={threat_level} />

      <div className="font-mono text-[10px] text-ink/60 h-10 flex items-center justify-center line-clamp-2 px-1">
        manifests as: {signature}
      </div>

      <div className="w-full border-t border-edge/40 mt-4 pt-3 flex justify-between font-mono text-[9px] text-ink/50 uppercase">
        <span>Captures: {captures}</span>
        <span>Last Seen: {timeAgo(last_seen)}</span>
      </div>
    </motion.button>
  )
}
