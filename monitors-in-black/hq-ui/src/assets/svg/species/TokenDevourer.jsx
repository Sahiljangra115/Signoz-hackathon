import React from 'react'

// §6.2.3 — round maw open to the left, eating a line of shrinking tokens.
// Wedge mouth, teeth and eye are all one evenodd path.
export default function TokenDevourer({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 32 L25.3 42.3 A18 18 0 1 0 25.3 21.7 Z
           M40 24 a2.2 2.2 0 1 0 0.01 0 Z
           M31 27.4 l3.4 -2.4 l0.6 3.4 Z
           M36.6 24.6 l3.4 -2.2 l0.6 3.4 Z
           M42.2 22.6 l3.2 -2 l0.6 3.2 Z"
      />
      {/* tokens queuing into the mouth, shrinking as they go */}
      <circle cx="15" cy="32" r="4" />
      <circle cx="7" cy="32" r="3" />
      <circle cx="1.6" cy="32" r="2" />
    </svg>
  )
}
