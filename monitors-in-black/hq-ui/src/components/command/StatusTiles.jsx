import React from 'react'

export default function StatusTiles({ stats, loading }) {
  const getCityStatusClass = () => {
    if (loading || !stats) return 'text-ink/40'
    return stats.city_status === 'BREACH'
      ? 'text-danger animate-pulse-soft font-bold'
      : 'text-alien font-bold'
  }

  const getVal = (val) => {
    if (loading || !stats) return '--'
    return val
  }

  return (
    <div className="grid grid-cols-4 gap-4 select-none">
      {/* City Status */}
      <div className="border border-edge bg-panel flex flex-col justify-center p-4 rounded-sm">
        <div className="text-[9px] text-ink/50 uppercase tracking-agency font-mono">
          City Status
        </div>
        <div className={`text-xl font-display uppercase tracking-widest mt-1 ${getCityStatusClass()}`}>
          {stats ? stats.city_status : (loading ? 'LOADING' : 'OFFLINE')}
        </div>
      </div>

      {/* Active Contacts */}
      <div className="border border-edge bg-panel flex flex-col justify-center p-4 rounded-sm">
        <div className="text-[9px] text-ink/50 uppercase tracking-agency font-mono">
          Active Contacts
        </div>
        <div className="text-2xl font-display font-bold mt-1 text-ink">
          {getVal(stats?.active_cases)}
        </div>
      </div>

      {/* Neutralyzed */}
      <div className="border border-edge bg-panel flex flex-col justify-center p-4 rounded-sm">
        <div className="text-[9px] text-ink/50 uppercase tracking-agency font-mono">
          Captured Anomalies
        </div>
        <div className="text-2xl font-display font-bold mt-1 text-alien">
          {getVal(stats?.neuralyzed_total)}
        </div>
      </div>

      {/* Agents on Duty */}
      <div className="border border-edge bg-panel flex flex-col justify-center p-4 rounded-sm">
        <div className="text-[9px] text-ink/50 uppercase tracking-agency font-mono">
          Agents on Duty
        </div>
        <div className="text-2xl font-display font-bold mt-1 text-ink">
          {getVal(stats?.agents_on_duty)}
        </div>
      </div>
    </div>
  )
}
