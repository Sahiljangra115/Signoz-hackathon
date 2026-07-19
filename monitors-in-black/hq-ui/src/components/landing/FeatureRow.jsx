import React from 'react'
import { motion } from 'framer-motion'
import { revealSpring } from '../../lib/motion'

// Alternating marketing row: copy on one side, terminal visual on the other.
export default function FeatureRow({ eyebrow, title, body, points = [], flip = false, children }) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <motion.div
        {...revealSpring}
        className={flip ? 'lg:order-2' : ''}
      >
        <div className="font-mono text-[10px] uppercase tracking-agency text-alien/80 mb-3">
          {eyebrow}
        </div>
        <h3 className="font-stat text-3xl md:text-4xl font-bold tracking-tight text-ink">
          {title}
        </h3>
        <p className="mt-4 font-mono text-sm leading-relaxed text-ink/60 max-w-lg">
          {body}
        </p>
        {points.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3 font-mono text-xs text-ink/70">
                <span className="text-alien mt-0.5">▸</span>
                {p}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      <div className={flip ? 'lg:order-1' : ''}>{children}</div>
    </div>
  )
}
