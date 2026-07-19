import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timeAgo } from '../../lib/format'
import { riseItem, SPRING, SPRING_SOFT } from '../../lib/motion'
import { SPECIES_META } from '../../lib/constants'
import { GradientBars } from '../charts/MiniCharts'
import AnimatedNumber from '../ui/AnimatedNumber'
import StatusChip from '../ui/StatusChip'

function ActivityRow({ row, onSelectCase, pulsing }) {
  const meta = SPECIES_META[row.species]
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onSelectCase?.(row.caseId)
      }}
      className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg border border-edge/60 bg-void/40 hover:bg-void/70 hover:border-edge transition-colors group/row"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          pulsing ? 'bg-amber shadow-glow-amber animate-pulse-soft' : 'bg-alien/60'
        }`}
      />
      <span className="flex flex-col overflow-hidden min-w-0 flex-1">
        <span className="font-mono text-[10px] font-bold text-ink/90 truncate">
          {row.caseId}
          <span className="text-ink/40 font-normal"> · {meta ? meta.codename : 'IDENTIFYING…'}</span>
        </span>
        <span className="font-mono text-[9px] text-ink/45 truncate">{row.message}</span>
      </span>
      <StatusChip status={row.status} />
      <span className="font-mono text-[9px] text-ink/35 shrink-0 group-hover/row:text-ink/60 transition-colors">
        {timeAgo(row.ts)}
      </span>
    </button>
  )
}

function ActivitySection({ title, rows, emptyText, onSelectCase, pulsing }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-agency text-ink/40 mb-1.5">
        {title}
        {rows.length > 0 && <span className="text-ink/25"> · {rows.length}</span>}
      </div>
      {rows.length === 0 ? (
        <div className="font-mono text-[10px] text-ink/30 italic px-0.5">{emptyText}</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <ActivityRow key={row.caseId} row={row} onSelectCase={onSelectCase} pulsing={pulsing} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentCard({ agent, liveStats, activity, onSelectCase }) {
  const { Avatar, codename, role, tools, bio } = agent
  const [expanded, setExpanded] = useState(false)
  const active = activity?.active || []
  const recent = activity?.recent || []
  const last_action_at = liveStats ? liveStats.last_action_at : null

  const { chartData, chartTall } = useMemo(() => {
    const combined = [...recent, ...active]
      .slice()
      .sort((a, b) => (a.ts || '').localeCompare(b.ts || ''))
      .slice(-7)
    if (combined.length === 0) return { chartData: undefined, chartTall: -1 }
    const data = combined.map((c) => (typeof c.confidence === 'number' ? c.confidence : 0.5))
    const tall = data.indexOf(Math.max(...data))
    return { chartData: data, chartTall: tall }
  }, [active, recent])

  return (
    <motion.div
      layout
      variants={riseItem}
      whileHover={{ y: -6, transition: SPRING }}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setExpanded((v) => !v)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      className="group relative overflow-hidden rounded-2xl border border-edge bg-card bg-card-sheen p-6 shadow-card transition-shadow hover:shadow-card-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-alien/60"
    >
      {/* watermark codename */}
      <span className="pointer-events-none absolute -right-2 -top-6 font-stat font-bold text-[7rem] leading-none text-ink/[0.04] select-none">
        {codename}
      </span>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-beam-soft" />

      <motion.div layout="position" className="relative flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border border-edge bg-void flex items-center justify-center overflow-hidden shrink-0">
            <Avatar className="w-12 h-12 text-ink/75" />
          </div>
          <div className="flex-1">
            <div className="font-stat text-xl font-bold tracking-tight text-ink">
              Agent {codename}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-beam font-semibold">
              {role}
            </div>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={SPRING_SOFT}
            className="font-mono text-ink/30 text-xs shrink-0"
            aria-hidden
          >
            ▾
          </motion.span>
        </div>

        <p className="font-mono text-xs text-ink/70 italic leading-relaxed min-h-[3rem]">
          "{bio}"
        </p>

        <div className="flex items-end justify-between border-t border-edge/50 pt-4">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-agency text-ink/40">
              Active Ops
            </div>
            <div className="font-stat text-3xl font-bold text-ink leading-none mt-0.5">
              <AnimatedNumber value={active.length} />
            </div>
          </div>
          <div className="w-24">
            <GradientBars data={chartData} tall={chartTall} />
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] uppercase text-ink/40">
          <span>Last activity</span>
          <span className="text-ink/70">{timeAgo(last_action_at)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-edge/50 pt-4">
          {tools.map((t, idx) => (
            <span
              key={idx}
              className="font-mono text-[8px] uppercase tracking-wider px-2 py-1 rounded-full border border-edge bg-void/60 text-ink/55"
            >
              {t}
            </span>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="activity"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SPRING_SOFT}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 border-t border-edge/50 pt-4">
                <ActivitySection
                  title="Working now"
                  rows={active}
                  emptyText="No active ops."
                  onSelectCase={onSelectCase}
                  pulsing
                />
                <ActivitySection
                  title="Case history"
                  rows={recent}
                  emptyText="No filed cases yet."
                  onSelectCase={onSelectCase}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
