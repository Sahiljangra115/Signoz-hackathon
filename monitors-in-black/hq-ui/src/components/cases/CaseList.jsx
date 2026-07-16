import React from 'react'
import CaseListItem from './CaseListItem'

export default function CaseList({ cases, selectedId, onSelect, filterSpecies, onClearFilter }) {
  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      {filterSpecies && (
        <div className="flex items-center justify-between bg-panel border border-edge/60 px-3 py-2 rounded-sm select-none">
          <div className="font-mono text-[10px] text-ink/70">
            FILTER: <span className="text-alien font-bold uppercase">{filterSpecies.replace('_', ' ')}</span>
          </div>
          <button
            onClick={onClearFilter}
            className="text-[9px] font-mono text-danger hover:underline cursor-pointer uppercase font-bold"
          >
            Clear [X]
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
        {cases.length === 0 ? (
          <div className="font-mono text-xs text-ink/30 italic p-4 select-none">
            ARCHIVES EMPTY. THE CITY SLEEPS.
          </div>
        ) : (
          cases.map((c) => (
            <CaseListItem
              key={c.id}
              caseObj={c}
              isSelected={c.id === selectedId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
