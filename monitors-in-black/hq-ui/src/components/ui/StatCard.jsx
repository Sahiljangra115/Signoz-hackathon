import React from 'react'
import { motion } from 'framer-motion'
import { riseItem, SPRING } from '../../lib/motion'
import AnimatedNumber from './AnimatedNumber'

// Big-number card in the img2 language: soft rounded dark panel, huge stat,
// small label, optional mini-chart footer. Numeric values count up.
export default function StatCard({ label, value, format, sub, chart, accent = false, className = '' }) {
  const isNum = typeof value === 'number' && Number.isFinite(value)

  return (
    <motion.div
      variants={riseItem}
      whileHover={{ y: -6, transition: SPRING }}
      className={`group relative overflow-hidden rounded-2xl border border-edge bg-card bg-card-sheen p-5 shadow-card transition-shadow hover:shadow-card-lift ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-beam-soft" />

      <div className="relative flex flex-col h-full">
        <div className="text-[10px] font-mono uppercase tracking-agency text-ink/60">
          {label}
        </div>

        <div
          className={`mt-1 font-stat font-bold leading-none tracking-tight text-4xl md:text-5xl ${
            accent ? 'text-beam' : 'text-ink'
          }`}
        >
          {isNum ? <AnimatedNumber value={value} format={format} /> : value}
        </div>

        {sub && (
          <div className="mt-1.5 text-[11px] font-mono text-ink/55">{sub}</div>
        )}

        {chart && <div className="mt-auto pt-4">{chart}</div>}
      </div>
    </motion.div>
  )
}
