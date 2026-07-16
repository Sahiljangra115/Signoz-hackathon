import React from 'react'

// §6.2.1 — heavy dragging slug facing left. Sucker mouth and segment notches are
// evenodd holes, not black fills, so the whole shape recolors from one text class.
export default function LatencyLeech({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 36 C5 24 16 16 32 16 C48 16 59 24 59 36 C59 39 57 41 54 41 L10 41 C7 41 5 39 5 36 Z
           M17 32 a4 4 0 1 0 0.01 0 Z
           M31 21 h2.4 v18 h-2.4 Z
           M40 23 h2.4 v16 h-2.4 Z
           M49 26 h2.4 v13 h-2.4 Z"
      />
      {/* belly drips: one still clinging, one already detached and falling */}
      <path d="M24 41 c3.2 4 4.6 6.4 4.6 8.4 a4.6 4.6 0 1 1 -9.2 0 c0 -2 1.4 -4.4 4.6 -8.4 Z" />
      <path d="M43 50 c2.6 3.4 3.8 5.4 3.8 7 a3.8 3.8 0 1 1 -7.6 0 c0 -1.6 1.2 -3.6 3.8 -7 Z" />
    </svg>
  )
}
