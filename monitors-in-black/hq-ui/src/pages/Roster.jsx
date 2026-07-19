import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useHQ } from '../state/HQContext'
import { AGENTS } from '../lib/constants'
import { staggerContainer, EASE_OUT } from '../lib/motion'
import { buildAgentActivity } from '../lib/agentActivity'
import AgentCard from '../components/agents/AgentCard'
import Pug from '../assets/svg/Pug'

export default function Roster() {
  const { stats, cases } = useHQ()
  const navigate = useNavigate()
  const activityByAgent = useMemo(() => buildAgentActivity(cases), [cases])
  const onSelectCase = useCallback((caseId) => navigate(`/cases?id=${caseId}`), [navigate])

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto flex flex-col gap-8 select-none relative">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="flex items-end justify-between"
      >
        <div>
          <div className="font-mono text-[10px] text-alien mb-1">
            agent@mib-hq:~/roster$ who
          </div>
          <h1 className="font-stat text-3xl md:text-4xl font-bold tracking-tight text-ink">
            The agents.
          </h1>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-agency text-ink/60">
          4 agents active
        </span>
      </motion.header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.key}
            agent={agent}
            liveStats={stats?.agents ? stats.agents[agent.key] : null}
            activity={activityByAgent[agent.key]}
            onSelectCase={onSelectCase}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-4 right-6 group cursor-pointer opacity-20 hover:opacity-100 transition-opacity">
        <Pug className="w-8 h-8 text-ink/25 hover:text-alien" />
        <span className="absolute bottom-8 right-0 bg-card border border-edge text-[9px] font-mono text-ink p-1 whitespace-nowrap rounded-md opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
          F. :: consultant. Don't ask.
        </span>
      </div>
    </div>
  )
}
