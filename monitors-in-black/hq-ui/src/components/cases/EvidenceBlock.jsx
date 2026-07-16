import React, { useState } from 'react'

export default function EvidenceBlock({ evidence }) {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedId(idx)
    setTimeout(() => setCopiedId(null), 1200)
  }

  if (!evidence || evidence.length === 0) {
    return (
      <div className="font-mono text-xs text-ink/30 italic select-none py-1">
        - (no external evidence, heuristic classification)
      </div>
    )
  }

  // Fallback SigNoz URL building (assuming port 8080 on the same host)
  const baseHostname = window.location.hostname
  const SIGNOZ_URL = `http://${baseHostname}:8080`

  return (
    <div className="flex flex-col gap-2 font-mono text-xs select-none">
      {evidence.map((item, idx) => {
        const type = item.type
        const ref = item.ref
        const excerpt = item.excerpt

        // Extract trace ID from ref if format is trace:ID
        const traceId = type === 'trace' && ref.startsWith('trace:') ? ref.split(':', 2)[1] : null
        const signozLink = traceId 
          ? `${SIGNOZ_URL}/trace/${traceId}`
          : type === 'log' 
            ? `${SIGNOZ_URL}/logs` 
            : null

        return (
          <div key={idx} className="border border-edge/60 bg-panel/30 p-2.5 rounded-sm flex flex-col gap-1.5 hover:border-edge transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase tracking-wider px-1 py-0.5 border rounded-sm font-bold ${
                  type === 'trace' 
                    ? 'border-alien/40 text-alien bg-alien/5' 
                    : type === 'log' 
                      ? 'border-amber/40 text-amber bg-amber/5' 
                      : 'border-ink/20 text-ink/60 bg-panel'
                }`}>
                  {type}
                </span>
                <code className="text-[10px] text-ink/80 bg-void px-1 py-0.5 border border-edge/30 rounded-sm font-bold">
                  {ref}
                </code>
              </div>

              <div className="flex items-center gap-2 font-mono text-[9px] font-bold">
                <button
                  onClick={() => handleCopy(excerpt, idx)}
                  className="text-alien hover:underline cursor-pointer uppercase"
                >
                  {copiedId === idx ? 'COPIED' : '[COPY]'}
                </button>
                {signozLink && (
                  <a
                    href={signozLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-alien/70 hover:text-alien hover:underline uppercase"
                  >
                    [VIEW IN SIGNOZ ↗]
                  </a>
                )}
              </div>
            </div>

            <div className="text-[11px] text-ink/70 leading-normal bg-void/40 p-2 border border-edge/20 rounded-sm select-text break-words max-h-24 overflow-y-auto font-mono">
              {excerpt}
            </div>
          </div>
        )
      })}
    </div>
  )
}
