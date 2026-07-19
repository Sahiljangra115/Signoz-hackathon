import React from 'react'
import { usePoll } from '../../hooks/usePoll'
import { num, ms, clock } from '../../lib/format'

function Segment({ label, value }) {
  return (
    <div className="flex items-baseline gap-1.5 px-3 border-r border-edge/60 last:border-r-0">
      <span className="text-ink/55 text-[9px] uppercase tracking-wider">{label}</span>
      <span className="text-ink font-bold">{value}</span>
    </div>
  )
}

// tmux statusline for the HQ window.
export default function MetricsTicker() {
  const { data, error } = usePoll('/api/metrics-snapshot', 10000, null)

  const req_per_s = data ? data.req_per_s : null
  const p99_ms = data ? data.p99_ms : null
  const tokens_per_min = data ? data.tokens_per_min : null
  const error_rate_pct = data ? data.error_rate_pct : null
  const fetched_at = data ? data.fetched_at : null
  const stale = data ? data.stale : true

  const bad = stale || error

  return (
    <footer className="h-9 border-t border-edge bg-card/60 font-mono text-[11px] flex items-center justify-between select-none">
      <div className="flex items-center h-full">
        <div className="h-full flex items-center px-3 bg-alien/90 text-void font-bold text-[10px] tracking-wider">
          [mib]
        </div>
        <div className="h-full flex items-center px-3 text-ink/70 text-[10px] border-r border-edge/60">
          session: hq
        </div>
        <Segment label="req/s" value={num(req_per_s)} />
        <Segment label="p99" value={ms(p99_ms)} />
        <Segment label="tok/min" value={num(tokens_per_min)} />
        <Segment
          label="err"
          value={
            error_rate_pct !== null && error_rate_pct !== undefined
              ? `${num(error_rate_pct)}%`
              : '--%'
          }
        />
      </div>

      <div className="flex items-center h-full">
        <div className="px-3 text-ink/60 text-[10px] border-l border-edge/60">
          {fetched_at ? clock(fetched_at) : '--:--:--'}
        </div>
        <div className={`h-full flex items-center gap-1.5 px-3 border-l border-edge/60 text-[10px] font-bold tracking-wider uppercase ${bad ? 'text-amber' : 'text-alien'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${bad ? 'bg-amber animate-pulse-soft' : 'bg-alien shadow-glow'}`} />
          {bad ? 'stale' : 'live'}
        </div>
      </div>
    </footer>
  )
}
