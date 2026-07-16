import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useHQ } from '../state/HQContext'
import SpeciesCard from '../components/registry/SpeciesCard'
import LoadingBlock from '../components/ui/LoadingBlock'

export default function Registry() {
  const { registry } = useHQ()
  const navigate = useNavigate()

  const handleCardClick = (speciesId) => {
    navigate(`/cases?species=${speciesId}`)
  }

  return (
    <div className="p-6 h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-6 select-none">
      <header className="border-b border-edge/60 pb-3 flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-agency text-ink">
          Alien Registry
        </h1>
        <div className="font-mono text-xs text-ink/50 uppercase">
          {registry.length} Species on File
        </div>
      </header>

      {registry.length === 0 ? (
        <LoadingBlock message="DECRYPTING REGISTRY" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {registry.map((entry) => (
            <SpeciesCard
              key={entry.species_id || entry.species}
              entry={{
                species_id: entry.species_id || entry.species,
                codename: entry.codename,
                threat_level: entry.threat_level,
                signature: entry.signature,
                captures: entry.captures,
                last_seen: entry.last_seen
              }}
              onClick={() => handleCardClick(entry.species_id || entry.species)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
