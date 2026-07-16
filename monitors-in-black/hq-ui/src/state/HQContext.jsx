import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { usePoll } from '../hooks/usePoll'
import { useEvents } from '../hooks/useEvents'

const HQContext = createContext()

export function useHQ() {
  return useContext(HQContext)
}

export function HQProvider({ children }) {
  const [cases, setCases] = useState([])
  const [chatter, setChatter] = useState([])
  const [alertPulse, setAlertPulse] = useState(0)

  // REST Polling
  const { data: casesData, refetch: refetchCases } = usePoll('/api/cases', 30000, { cases: [] })
  const { data: registryData, refetch: refetchRegistry } = usePoll('/api/registry', 15000, { species: [] })
  const { data: statsData, refetch: refetchStats } = usePoll('/api/stats', 10000, null)

  // Every case id we have already seen, from either the poll or SSE. Seeding it
  // from the poll is what stops a routine SSE update on a pre-existing open case
  // from being mistaken for a fresh alert.
  const knownIds = useRef(new Set())

  useEffect(() => {
    if (casesData && casesData.cases) {
      casesData.cases.forEach((c) => knownIds.current.add(c.id))
      setCases(casesData.cases)
    }
  }, [casesData])

  const refetchAll = useCallback(() => {
    refetchCases()
    refetchRegistry()
    refetchStats()
  }, [refetchCases, refetchRegistry, refetchStats])

  const handleChatter = useCallback((line) => {
    setChatter((prev) => {
      const next = [...prev, line]
      if (next.length > 200) next.shift()
      return next
    })
  }, [])

  const handleCase = useCallback((updatedCase) => {
    // Firing the pulse OUTSIDE the setCases updater is deliberate: updaters must
    // be pure, and StrictMode double-invokes them, which fired the alert twice.
    const isNew = !knownIds.current.has(updatedCase.id)
    knownIds.current.add(updatedCase.id)

    if (isNew && updatedCase.status === 'open') {
      setAlertPulse((p) => p + 1)
      refetchStats()
    }

    setCases((prev) =>
      prev.some((c) => c.id === updatedCase.id)
        ? prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
        : [updatedCase, ...prev]
    )
  }, [refetchStats])

  const connection = useEvents({
    onChatter: handleChatter,
    onCase: handleCase,
    onReconnect: refetchAll
  })

  const registry = registryData?.species || []
  const stats = statsData || null

  return (
    <HQContext.Provider
      value={{
        cases,
        registry,
        stats,
        chatter,
        connection,
        alertPulse,
        refetchAll
      }}
    >
      {children}
    </HQContext.Provider>
  )
}
