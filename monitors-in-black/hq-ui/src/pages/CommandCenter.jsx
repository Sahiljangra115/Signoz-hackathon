import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHQ } from '../state/HQContext'
import { EASE_OUT } from '../lib/motion'
import Panel from '../components/ui/Panel'
import Radar from '../components/command/Radar'
import StatusTiles from '../components/command/StatusTiles'
import ChatterFeed from '../components/command/ChatterFeed'

export default function CommandCenter() {
  const { cases, chatter, stats, connection } = useHQ()
  const navigate = useNavigate()

  const activeCases = cases.filter((c) => c.status === 'open' || c.status === 'investigating')
  const handleBlipClick = (caseId) => navigate(`/cases?id=${caseId}`)

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 h-full overflow-y-auto">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="flex items-end justify-between"
      >
        <div>
          <div className="font-mono text-[10px] text-alien mb-1">
            agent@mib-hq:~/command$ tail -f grid
          </div>
          <h1 className="font-stat text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Command Center.
          </h1>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-agency text-ink/60">
          Live surveillance grid
        </span>
      </motion.header>

      <StatusTiles stats={stats} loading={stats === null} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[460px]">
        <div className="lg:col-span-2 h-full">
          <Panel title="Surveillance Grid" className="h-full">
            <Radar cases={activeCases} onBlipClick={handleBlipClick} />
          </Panel>
        </div>

        <div className="h-full">
          <Panel
            title="Radio Chatter"
            badge={connection === 'live' ? 'LIVE' : 'LINKING'}
            className="h-full"
          >
            <ChatterFeed lines={chatter} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
