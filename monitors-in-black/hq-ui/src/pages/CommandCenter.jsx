import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useHQ } from '../state/HQContext'
import Panel from '../components/ui/Panel'
import Radar from '../components/command/Radar'
import StatusTiles from '../components/command/StatusTiles'
import ChatterFeed from '../components/command/ChatterFeed'

export default function CommandCenter() {
  const { cases, chatter, stats, connection } = useHQ()
  const navigate = useNavigate()

  const activeCases = cases.filter(c => c.status === 'open' || c.status === 'investigating')

  const handleBlipClick = (caseId) => {
    navigate(`/cases?id=${caseId}`)
  }

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-6rem)] overflow-hidden">
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
        <Panel title="Surveillance Grid" className="flex-1">
          <Radar cases={activeCases} onBlipClick={handleBlipClick} />
        </Panel>
        
        <StatusTiles stats={stats} loading={stats === null} />
      </div>

      <div className="h-full overflow-hidden">
        <Panel
          title="Radio Chatter"
          badge={connection === 'live' ? 'LIVE' : 'LINKING'}
          className="h-full"
        >
          <ChatterFeed lines={chatter} />
        </Panel>
      </div>
    </div>
  )
}
