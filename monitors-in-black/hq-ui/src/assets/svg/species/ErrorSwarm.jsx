import React from 'react'

// §6.2.2 — loose diagonal cloud of gnats, densest lower-left. The central gnat
// carries an evenodd "x" cutout; the old version stroked it in black, which broke
// recolouring the moment the card glowed.
export default function ErrorSwarm({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      {/* six scattered gnats */}
      <polygon points="9,44 18,39 13,52" />
      <polygon points="19,30 27,26 23,37" />
      <polygon points="14,17 21,13 17,24" />
      <polygon points="41,45 48,41 44,52" />
      <polygon points="47,20 54,16 50,27" />
      <polygon points="54,35 60,32 57,42" />

      {/* largest central gnat with negative x */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 21 L41 13 L34 39 Z
           M32 21 l-2.2 -2.2 l1.6 -1.6 l2.2 2.2 l2.2 -2.2 l1.6 1.6 l-2.2 2.2 l2.2 2.2 l-1.6 1.6 l-2.2 -2.2 l-2.2 2.2 l-1.6 -1.6 Z"
      />

      {/* motion ticks trailing top-right */}
      <rect x="45" y="8" width="8" height="1.8" transform="rotate(-28 45 8)" />
      <rect x="49" y="13" width="5" height="1.6" transform="rotate(-28 49 13)" />
    </svg>
  )
}
