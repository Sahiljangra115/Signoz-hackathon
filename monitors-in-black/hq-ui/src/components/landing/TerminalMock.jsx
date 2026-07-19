import React from 'react'
import { motion } from 'framer-motion'
import { SPRING_SOFT, revealSpring } from '../../lib/motion'

const TONE = {
  ink: 'text-ink/85',
  dim: 'text-ink/40',
  alien: 'text-alien',
  aqua: 'text-aqua',
  amber: 'text-amber',
  danger: 'text-danger',
}

// Riced macOS terminal window, same chrome the real HQ shell uses, so the
// marketing mocks and the app read as one object.
export default function TerminalMock({ title, lines, className = '' }) {
  return (
    <motion.div
      {...revealSpring}
      className={`rounded-2xl border border-edge bg-panel/80 backdrop-blur-xl shadow-card overflow-hidden ${className}`}
    >
      <div className="h-9 flex items-center gap-2 px-4 border-b border-edge/70 bg-card/60 backdrop-blur-sm select-none">
        <span className="w-3 h-3 rounded-full bg-danger/80" />
        <span className="w-3 h-3 rounded-full bg-amber/80" />
        <span className="w-3 h-3 rounded-full bg-alien/80" />
        <span className="flex-1 text-center font-mono text-[10px] text-ink/40 truncate pr-12">
          {title}
        </span>
      </div>

      <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs leading-relaxed">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING_SOFT, delay: 0.25 + i * 0.09 }}
            className="flex items-baseline gap-2 whitespace-pre-wrap"
          >
            {l.prompt && <span className="text-alien shrink-0">❯</span>}
            <span className={`${TONE[l.tone] || TONE.ink} flex-1`}>{l.text}</span>
            {l.tail && (
              <span className={`${TONE[l.tailTone] || TONE.alien} shrink-0`}>{l.tail}</span>
            )}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + lines.length * 0.09 }}
          className="flex items-center gap-2 mt-1"
        >
          <span className="text-alien">❯</span>
          <span className="w-2 h-4 bg-alien/80 animate-blink-hard" />
        </motion.div>
      </div>
    </motion.div>
  )
}
