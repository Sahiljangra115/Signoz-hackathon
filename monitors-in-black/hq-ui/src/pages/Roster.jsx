import React from 'react'
import { useHQ } from '../state/HQContext'
import { AGENTS } from '../lib/constants'
import AgentCard from '../components/agents/AgentCard'
import Pug from '../assets/svg/Pug'

export default function Roster() {
  const { stats } = useHQ()

  return (
    <div className="p-6 h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-6 select-none relative">
      <header className="border-b border-edge/60 pb-3 flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-agency text-ink">
          Agency Roster
        </h1>
        <div className="font-mono text-xs text-ink/50 uppercase">
          4 Agents Active
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.key}
            agent={agent}
            liveStats={stats?.agents ? stats.agents[agent.key] : null}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-6 group cursor-pointer opacity-20 hover:opacity-100 transition-opacity">
        <Pug className="w-8 h-8 text-ink/25 hover:text-alien" />
        <span className="absolute bottom-8 right-0 bg-panel border border-edge text-[9px] font-mono text-ink p-1 whitespace-nowrap rounded-sm opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
          F. — consultant. Don't ask.
        </span>
      </div>
    </div>
  )
}
