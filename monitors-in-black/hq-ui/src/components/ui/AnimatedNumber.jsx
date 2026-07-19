import React, { useEffect, useRef } from 'react'
import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { EASE_OUT } from '../../lib/motion'

// Counts up to `value` on mount / whenever it changes. Non-numeric values
// (e.g. "BREACH") are rendered verbatim by the caller, not here.
export default function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString() }) {
  const target = Number(value) || 0
  const mv = useMotionValue(0)
  const ref = useRef(null)

  useEffect(() => {
    const controls = animate(mv, target, { duration: 0.9, ease: EASE_OUT })
    return controls.stop
  }, [target, mv])

  useMotionValueEvent(mv, 'change', (v) => {
    if (ref.current) ref.current.textContent = format(v)
  })

  return <span ref={ref}>{format(target)}</span>
}
