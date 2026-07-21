import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { stampVariants } from '../../lib/motion'

// Module-level: the slam plays once per case per session, wherever it mounts.
const stampSeen = new Set()

const LOOK =
  'border-[3px] border-danger text-danger font-display font-bold text-3xl tracking-agency px-3 py-1 uppercase outline outline-1 outline-danger/50 outline-offset-4 bg-void/90 shadow-glow-danger'

export default function Stamp({ caseId, status }) {
  const decision = useRef({ id: null, slam: false })

  // Decided during render, not in an effect: an effect paints the static stamp
  // for one frame first, and the live open->neuralyzed slam is the demo beat.
  // Idempotent per caseId, so a StrictMode double-render still slams.
  if (status === 'neuralyzed' && decision.current.id !== caseId) {
    decision.current = { id: caseId, slam: !stampSeen.has(caseId) }
    stampSeen.add(caseId)
  }

  if (status !== 'neuralyzed') return null
  const animate = decision.current.id === caseId && decision.current.slam

  return (
    // top-32 keeps the slam clear of the species/confidence readout in the
    // header row, which it used to land on top of.
    <div className="absolute top-32 right-12 z-20 pointer-events-none select-none">
      {animate ? (
        <motion.div
          variants={stampVariants}
          initial="initial"
          animate="animate"
          className={LOOK}
        >
          Neuralyzed
        </motion.div>
      ) : (
        <div className={`opacity-90 rotate-[-12deg] ${LOOK}`}>Neuralyzed</div>
      )}
    </div>
  )
}
