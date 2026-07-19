import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useHQ } from '../../state/HQContext'

const TABS = [
  { index: 0, to: '/command', label: 'command' },
  { index: 1, to: '/registry', label: 'registry' },
  { index: 2, to: '/cases', label: 'cases' },
  { index: 3, to: '/agents', label: 'roster' },
]

const CONNECTION = {
  live: { color: 'text-alien', dot: 'bg-alien', label: 'uplink' },
  reconnecting: { color: 'text-amber animate-pulse-soft', dot: 'bg-amber', label: 'relinking' },
  lost: { color: 'text-danger', dot: 'bg-danger', label: 'uplink lost' },
}

// Window titlebar + tmux-style tab strip. The red light actually closes the
// session (back to the landing page); the other two are set dressing.
export default function NavRail() {
  const { connection } = useHQ()
  const location = useLocation()
  const navigate = useNavigate()
  const conn = CONNECTION[connection] || CONNECTION.reconnecting

  const tabClass = ({ isActive }) =>
    `font-mono text-[11px] px-3 py-1 rounded-md transition-colors ${
      isActive
        ? 'bg-alien/15 text-alien ring-1 ring-alien/40 shadow-glow font-bold'
        : 'text-ink/70 hover:text-ink hover:bg-ink/5'
    }`

  return (
    <header className="border-b border-edge bg-card/60 backdrop-blur select-none sticky top-0 z-30">
      {/* titlebar */}
      <div className="h-10 flex items-center px-4 gap-2">
        <div className="flex items-center gap-2 group">
          <button
            onClick={() => navigate('/')}
            aria-label="Close session, return to landing"
            className="w-3 h-3 rounded-full bg-danger shadow-glow-danger hover:brightness-125 transition"
          />
          <span className="w-3 h-3 rounded-full bg-amber shadow-glow-amber" />
          <span className="w-3 h-3 rounded-full bg-alien shadow-glow" />
        </div>
        <div className="flex-1 text-center font-mono text-[10px] text-ink/70 truncate">
          agent@mib-hq :: tmux :: ~{location.pathname}
        </div>
        <div className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${conn.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${conn.dot}`} />
          {conn.label}
        </div>
      </div>

      {/* tab strip */}
      <div className="h-9 flex items-center justify-between px-3 border-t border-edge/60">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} className={tabClass}>
              {({ isActive }) => (
                <>
                  <span className="opacity-50 mr-1">{t.index}:</span>
                  {t.label}
                  {isActive && <span className="text-alien">*</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="font-mono text-[10px] text-ink/60 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-beam inline-block" />
          monitors in black
        </div>
      </div>
    </header>
  )
}
