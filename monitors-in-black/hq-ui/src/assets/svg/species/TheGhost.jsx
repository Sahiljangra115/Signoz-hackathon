import React from 'react'

// §6.2.6 — traffic fading to nothing: a ghost whose right side dissolves into
// drifting dots. Eyes are evenodd holes (the old version filled them black,
// which stayed black no matter what colour the card went).
export default function TheGhost({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 52 V32 a17 17 0 0 1 34 0 v20
           c-2.8 0 -4.2 -3.4 -7 -3.4 c-2.8 0 -4.2 3.4 -7 3.4
           c-2.8 0 -4.2 -3.4 -7 -3.4 c-2.8 0 -4.2 3.4 -6 3.4 Z
           M24 26 a3 5.5 0 1 0 0.01 0 Z
           M38 26 a3 5.5 0 1 0 0.01 0 Z"
      />
      {/* the dissolve: mass breaking up and drifting right */}
      <circle cx="50" cy="30" r="3.6" />
      <circle cx="55" cy="37" r="2.8" />
      <circle cx="57" cy="24" r="2.2" />
      <circle cx="60" cy="32" r="1.6" />
      <circle cx="62" cy="42" r="1.1" />
    </svg>
  )
}
