import React from 'react'
import Stamp from '../ui/Stamp'
import StatusChip from '../ui/StatusChip'
import EvidenceBlock from './EvidenceBlock'
import ReportTypewriter from './ReportTypewriter'
import { clock } from '../../lib/format'
import { SPECIES_META } from '../../lib/constants'

export default function CaseDetail({ caseObj }) {
  if (!caseObj) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-ink/30 italic text-sm select-none">
        SELECT A CASE FILE
      </div>
    )
  }

  const { id, status, opened_at, species, confidence, evidence, report_md, timeline } = caseObj
  const speciesMeta = SPECIES_META[species] || { codename: 'IDENTIFYING…' }

  return (
    <div className="relative border border-edge bg-panel rounded-sm p-5 flex flex-col gap-6 h-full overflow-y-auto">
      <Stamp caseId={id} status={status} />

      <div className="flex items-center justify-between border-b border-edge pb-4 select-none">
        <div className="flex flex-col gap-1.5">
          <div className="font-mono text-2xl font-bold tracking-wider text-ink flex items-center gap-2">
            <span className="text-alien">//</span> {id}
          </div>
          <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">
            OPENED AT {new Date(opened_at).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="text-right">
            <div className="text-ink/40 uppercase text-[10px] font-bold">Species</div>
            <div className="text-ink font-bold tracking-wide">{speciesMeta.codename}</div>
          </div>
          {confidence != null && (
            <div className="text-right">
              <span className="text-ink/40 mr-1.5 uppercase text-[10px] font-bold">Confidence</span>
              <span className="text-alien font-bold font-mono">{(confidence * 100).toFixed(0)}%</span>
            </div>
          )}
          {/* The stamp occupies this corner once a case is neuralyzed, and it
              says the same thing louder. Chip only carries the live states. */}
          {status !== 'neuralyzed' && <StatusChip status={status} />}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="font-display uppercase tracking-agency text-xs text-ink/40 mb-2 select-none font-bold">
            Dossier Summary
          </div>
          <div className="border border-edge bg-void/35 p-4 rounded-sm">
            <ReportTypewriter md={report_md} caseId={id} />
          </div>
        </div>

        <div>
          <div className="font-display uppercase tracking-agency text-xs text-ink/40 mb-2 select-none font-bold">
            OpenTelemetry Evidence
          </div>
          <EvidenceBlock evidence={evidence} />
        </div>
      </div>

      <div className="border-t border-edge/40 pt-4">
        <div className="font-display uppercase tracking-agency text-xs text-ink/40 mb-3 select-none font-bold">
          Radio Logs & Timeline
        </div>
        <div className="flex flex-col gap-1.5 font-mono text-xs max-h-52 overflow-y-auto bg-void/25 border border-edge/30 p-3 rounded-sm">
          {timeline && timeline.length > 0 ? (
            timeline.map((t, idx) => {
              let agentColor = 'text-ink'
              if (t.agent === 'K') agentColor = 'text-alien'
              if (t.agent === 'J') agentColor = 'text-amber'
              if (t.agent === 'O') agentColor = 'text-ink/70'
              return (
                <div key={idx} className="py-0.5 border-b border-edge/10 last:border-0 flex items-start">
                  <span className={`font-bold ${agentColor} mr-2`}>[{t.agent}]</span>
                  <span className="text-[9px] text-ink/30 mr-2">{clock(t.ts)}</span>
                  <span className="text-ink/80 select-text">{t.message}</span>
                </div>
              )
            })
          ) : (
            <div className="text-ink/30 italic">// NO TIMELINE ENTRIES</div>
          )}
        </div>
      </div>
    </div>
  )
}
