import React from 'react'

// §6.2.5 — ouroboros: the retry loop that will not die. Annulus + wedge head
// biting its own tail, dead x eye, one limp arm hanging off the bottom.
export default function ZombieLoop({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 9 a23 23 0 1 0 0.01 0 Z
           M32 17 a15 15 0 1 1 -0.01 0 Z
           M27.5 12.2 l-3.6 -3.6 l2 -2 l3.6 3.6 l3.6 -3.6 l2 2 l-3.6 3.6 l3.6 3.6 l-2 2 l-3.6 -3.6 l-3.6 3.6 l-2 -2 Z"
      />
      {/* wedge head, jaws open over the tapering tail */}
      <path d="M32 4 L42 14 L32 15 Z" />
      {/* limp arm, hanging outside the coil */}
      <path d="M27 54 c-1 4 -3 6 -6 7 l1.6 3.4 c5 -1.6 8 -4.6 9.4 -9.4 Z" />
      {/* direction arrowhead riding the top of the loop */}
      <polygon points="46,13 53,17 46,21" />
    </svg>
  )
}
