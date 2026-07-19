import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHQ } from '../state/HQContext'
import CaseList from '../components/cases/CaseList'
import CaseDetail from '../components/cases/CaseDetail'

export default function CaseFiles() {
  const { cases } = useHQ()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedId = searchParams.get('id')
  const speciesFilter = searchParams.get('species')

  const filteredCases = speciesFilter
    ? cases.filter((c) => c.species === speciesFilter)
    : cases

  useEffect(() => {
    if (filteredCases.length > 0 && !selectedId) {
      setSearchParams(
        (prev) => {
          prev.set('id', filteredCases[0].id)
          return prev
        },
        { replace: true }
      )
    }
  }, [filteredCases, selectedId, setSearchParams])

  const handleSelectCase = (id) => {
    setSearchParams((prev) => {
      prev.set('id', id)
      return prev
    })
  }

  const handleClearFilter = () => {
    setSearchParams((prev) => {
      prev.delete('species')
      if (cases.length > 0) {
        prev.set('id', cases[0].id)
      } else {
        prev.delete('id')
      }
      return prev
    })
  }

  const selectedCase = cases.find((c) => c.id === selectedId) || null

  return (
    <div className="flex gap-4 p-4 h-full overflow-hidden">
      <div className="w-[340px] shrink-0 h-full overflow-hidden flex flex-col gap-3">
        <div className="font-mono text-[10px] text-alien select-none">
          agent@mib-hq:~/cases$ ls -t archive/
        </div>
        <div className="flex-1 overflow-hidden">
          <CaseList
            cases={filteredCases}
            selectedId={selectedId}
            onSelect={handleSelectCase}
            filterSpecies={speciesFilter}
            onClearFilter={handleClearFilter}
          />
        </div>
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <CaseDetail caseObj={selectedCase} />
      </div>
    </div>
  )
}
