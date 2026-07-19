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
    <div className="p-6 h-full overflow-y-auto flex flex-col gap-6 select-none">
      <header className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] text-alien mb-1">
            agent@mib-hq:~/registry$ ls species/
          </div>
          <h1 className="font-stat text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Alien registry.
          </h1>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-agency text-ink/60">
          {registry.length} species on file
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
