import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useHQ } from '../../state/HQContext'
import NavRail from './NavRail'
import AlertFlash from './AlertFlash'
import MetricsTicker from '../command/MetricsTicker'
import { pageVariants, shakeVariants } from '../../lib/motion'

export default function Shell({ children }) {
  const { alertPulse } = useHQ()
  const location = useLocation()
  const shake = useAnimationControls()

  // §4.3a — imperative start, not a key bump: re-keying the wrapper on every
  // pulse would remount the page and wipe its state mid-hunt.
  useEffect(() => {
    if (alertPulse) shake.start('shake')
  }, [alertPulse, shake])

  return (
    <div className="min-h-screen flex flex-col bg-void text-ink overflow-hidden">
      <AlertFlash pulse={alertPulse} />
      <motion.div
        variants={shakeVariants}
        initial="still"
        animate={shake}
        className="flex-1 flex flex-col"
      >
        <NavRail />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 overflow-hidden"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <MetricsTicker />
      </motion.div>
    </div>
  )
}
