import React from 'react'
import { motion } from 'framer-motion'
import { alertBorderVariants } from '../../lib/motion'

// §4.3b — red breach border only. The companion glitch shake (§4.3a) lives on
// Shell's content wrapper, since shaking a fixed inset-0 overlay moves nothing.
export default function AlertFlash({ pulse }) {
  if (!pulse) return null
  return (
    <motion.div
      key={pulse}
      variants={alertBorderVariants}
      initial="initial"
      animate="animate"
      className="fixed inset-0 pointer-events-none z-[45] border-4 border-danger shadow-glow-danger"
    />
  )
}
