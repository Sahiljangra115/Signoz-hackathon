import React from 'react'
import { motion } from 'framer-motion'
import { SPRING, SPRING_SOFT } from '../../lib/motion'

// ponytail: fixed decorative sample data when no live series is passed,
// swap for real per-metric history when the API exposes it.
const DEFAULT = [0.25, 0.4, 0.55, 0.72, 0.9, 1]

// Signal-tick sparkline (replaces the old gradient dot row): thin amber ticks
// rising like a CRT gauge, hottest tick tipped in ink.
export function GradientDots({ data = DEFAULT, pill, labels }) {
  const max = Math.max(...data, 0.001)
  return (
    <div className="flex items-end gap-[5px] h-14 relative">
      {data.map((v, i) => {
        const t = v / max
        const hot = t > 0.85
        return (
          <motion.span
            key={i}
            title={labels?.[i]}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: hot ? 1 : 0.45 + t * 0.45 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            whileHover={{ scaleX: 1.6, transition: SPRING }}
            className={`w-[5px] rounded-full origin-bottom relative overflow-hidden ${
              hot ? 'bg-amber shadow-glow-amber' : 'bg-amber'
            }`}
            style={{ height: `${18 + t * 82}%` }}
          >
            <span className="absolute inset-x-0 top-0 h-1/3 bg-ink/25" />
          </motion.span>
        )
      })}
      {pill && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: data.length * 0.06 + 0.1 }}
          className="absolute -bottom-1 right-0 bg-amber text-void text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full"
        >
          {pill}
        </motion.span>
      )}
    </div>
  )
}

// Flat-top histogram bars, amber with a danger accent spike at `tall`.
export function GradientBars({ data = DEFAULT, tall = -1, labels }) {
  const max = Math.max(...data, 0.001)
  return (
    <div className="flex items-end gap-[4px] h-16 border-b border-edge/80 pb-px">
      {data.map((v, i) => {
        const h = Math.max(8, (v / max) * 100)
        const accent = i === tall
        return (
          <motion.span
            key={i}
            title={labels?.[i]}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${h}%`, opacity: accent ? 1 : 0.55 + (v / max) * 0.45 }}
            transition={{ ...SPRING_SOFT, delay: i * 0.05 }}
            whileHover={{ scaleY: 1.05, transition: SPRING }}
            className={`flex-1 rounded-t-[3px] origin-bottom relative overflow-hidden ${
              accent ? 'bg-danger shadow-glow-danger' : 'bg-amber'
            }`}
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-ink/30" />
          </motion.span>
        )
      })}
    </div>
  )
}
