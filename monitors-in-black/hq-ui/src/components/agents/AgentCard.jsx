import React from 'react'
import { timeAgo } from '../../lib/format'

export default function AgentCard({ agent, liveStats }) {
  const { Avatar, codename, role, tools, bio } = agent

  const count = liveStats ? liveStats.count : '--'
  const last_action_at = liveStats ? liveStats.last_action_at : null

  return (
    <div className="border border-edge bg-panel rounded-sm p-5 flex flex-col gap-4 items-center text-center select-none hover:shadow-glow hover:border-alien/40 transition-shadow">
      <div className="w-20 h-20 rounded-full border border-edge/60 bg-void flex items-center justify-center overflow-hidden relative shadow-inner">
        <Avatar className="w-16 h-16 text-ink/70" />
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="font-display text-lg font-bold uppercase tracking-agency text-ink">
          Agent {codename}
        </div>
        <div className="font-mono text-[9px] text-alien uppercase tracking-wider font-bold">
          {role}
        </div>
      </div>

      <div className="font-mono text-xs text-ink/75 px-2 italic h-12 flex items-center justify-center leading-normal">
        "{bio}"
      </div>

      <div className="w-full flex flex-col gap-1.5 border-t border-edge/30 pt-3 text-left font-mono text-[9px]">
        <div className="flex justify-between text-ink/50 uppercase">
          <span>Active Operations:</span>
          <span className="text-ink font-bold">{count}</span>
        </div>
        <div className="flex justify-between text-ink/50 uppercase">
          <span>Last Activity:</span>
          <span className="text-ink font-bold">{timeAgo(last_action_at)}</span>
        </div>
      </div>

      <div className="w-full border-t border-edge/30 pt-3 flex flex-wrap gap-1.5 justify-center">
        {tools.map((t, idx) => (
          <span
            key={idx}
            className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-edge bg-void/50 text-ink/60"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
