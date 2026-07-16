import React from 'react'
import { NavLink } from 'react-router-dom'
import { useHQ } from '../../state/HQContext'

export default function NavRail() {
  const { connection } = useHQ()

  const linkClass = ({ isActive }) =>
    `font-mono text-xs uppercase tracking-wider py-4 px-2 transition-colors ${
      isActive
        ? 'text-alien border-b-2 border-alien font-bold'
        : 'text-ink/50 hover:text-ink'
    }`

  return (
    <nav className="h-14 border-b border-edge bg-panel flex items-center justify-between px-4 select-none">
      <div className="flex items-center gap-8">
        <div className="font-display font-bold tracking-agency text-ink flex items-center gap-1.5">
          <span className="text-alien">▪</span> MONITORS IN BLACK
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/command" className={linkClass}>
            Command
          </NavLink>
          <NavLink to="/registry" className={linkClass}>
            Registry
          </NavLink>
          <NavLink to="/cases" className={linkClass}>
            Case Files
          </NavLink>
          <NavLink to="/agents" className={linkClass}>
            Roster
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        {connection === 'live' && (
          <span className="text-alien flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-alien inline-block" />
            UPLINK
          </span>
        )}
        {connection === 'reconnecting' && (
          <span className="text-amber animate-pulse-soft flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber inline-block" />
            RELINKING
          </span>
        )}
        {connection === 'lost' && (
          <span className="text-danger flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger inline-block" />
            UPLINK LOST
          </span>
        )}
      </div>
    </nav>
  )
}
