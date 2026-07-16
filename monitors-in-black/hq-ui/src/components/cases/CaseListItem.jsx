import React from 'react'
import StatusChip from '../ui/StatusChip'
import { timeAgo } from '../../lib/format'
import { SPECIES_META } from '../../lib/constants'

export default function CaseListItem({ caseObj, isSelected, onClick }) {
  const { id, species, status, opened_at } = caseObj

  const speciesMeta = SPECIES_META[species] || { codename: 'IDENTIFYING…' }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border rounded-sm transition-all select-none focus:outline-none flex items-center justify-between gap-3 ${
        isSelected
          ? 'border-alien shadow-glow bg-panel/75'
          : 'border-edge bg-panel/30 hover:bg-panel/60 hover:border-edge/80'
      }`}
    >
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="font-mono text-xs font-bold text-ink">
          {id}
        </div>
        <div className="font-display text-xs text-ink/60 truncate tracking-wide uppercase">
          {speciesMeta.codename}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusChip status={status} />
        <div className="font-mono text-[9px] text-ink/40">
          {timeAgo(opened_at)}
        </div>
      </div>
    </button>
  )
}
