import React from 'react'

// Roster easter egg. F. — consultant. Don't ask.
export default function Pug({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      {/* Ears: rounded triangles folding DOWN the sides of the skull. They hang
          below the eye line on purpose — angled up reads as horns, not pug. */}
      <path d="M16 18 c-5 0 -8 4 -8 10 c0 7 3 13 8 16 c3 -2 4 -6 4 -13 c0 -6 -1 -10 -4 -13 Z" />
      <path d="M48 18 c5 0 8 4 8 10 c0 7 -3 13 -8 16 c-3 -2 -4 -6 -4 -13 c0 -6 1 -10 4 -13 Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 12 a21 21 0 1 1 -0.01 0 Z
           M23 30 a3 3 0 1 0 0.01 0 Z
           M41 30 a3 3 0 1 0 0.01 0 Z
           M22 39 c6 -3 14 -3 20 0 c-6 2 -14 2 -20 0 Z
           M24 45 c5 -2.4 11 -2.4 16 0 c-5 1.8 -11 1.8 -16 0 Z
           M29.6 41.6 a1.3 1.3 0 1 0 0.01 0 Z
           M34.4 41.6 a1.3 1.3 0 1 0 0.01 0 Z"
      />
    </svg>
  )
}
