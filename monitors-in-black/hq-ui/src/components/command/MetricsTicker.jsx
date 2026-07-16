import React from 'react'
import { usePoll } from '../../hooks/usePoll'
import { num, ms, clock } from '../../lib/format'

export default function MetricsTicker() {
  const { data, error } = usePoll('/api/metrics-snapshot', 10000, null)

  const req_per_s = data ? data.req_per_s : null
  const p99_ms = data ? data.p99_ms : null
  const tokens_per_min = data ? data.tokens_per_min : null
  const error_rate_pct = data ? data.error_rate_pct : null
  const fetched_at = data ? data.fetched_at : null
  const stale = data ? data.stale : true

  const timeStr = fetched_at ? clock(fetched_at) : '--:--:--'

  return (
    <footer className="h-10 border-t border-edge bg-panel font-mono text-xs flex items-center justify-between px-4 select-none">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-ink/40 mr-1.5 font-bold uppercase tracking-wider text-[10px]">Req/s</span>
          <span className="text-ink font-bold">{num(req_per_s)}</span>
        </div>
        <span className="text-edge font-bold select-none">·</span>
        <div>
          <span className="text-ink/40 mr-1.5 font-bold uppercase tracking-wider text-[10px]">p99</span>
          <span className="text-ink font-bold">{ms(p99_ms)}</span>
        </div>
        <span className="text-edge font-bold select-none">·</span>
        <div>
          <span className="text-ink/40 mr-1.5 font-bold uppercase tracking-wider text-[10px]">Tok/Min</span>
          <span className="text-ink font-bold">{num(tokens_per_min)}</span>
        </div>
        <span className="text-edge font-bold select-none">·</span>
        <div>
          <span className="text-ink/40 mr-1.5 font-bold uppercase tracking-wider text-[10px]">Errors</span>
          <span className="text-ink font-bold">
            {error_rate_pct !== null && error_rate_pct !== undefined
              ? `${num(error_rate_pct)}%`
              : '--%'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-ink/40 font-bold uppercase text-[9px] tracking-wider">
          UPDATED {timeStr}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              stale || error ? 'bg-amber animate-pulse-soft' : 'bg-alien shadow-glow'
            }`}
          />
          <span className={`text-[9px] font-bold tracking-wider uppercase ${stale || error ? 'text-amber' : 'text-alien'}`}>
            {stale || error ? 'STALE' : 'LIVE'}
          </span>
        </div>
      </div>
    </footer>
  )
}
