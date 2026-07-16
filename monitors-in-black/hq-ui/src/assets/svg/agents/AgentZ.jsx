import React from 'react'

// §6.3.1 — squarer head, broadest shoulders, rank chevrons on the lapel.
// Sternest outline of the four. No actor likeness, no agency insignia: original
// geometry only.
export default function AgentZ({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 20 a10 10 0 0 1 20 0 v3 a10 10 0 0 1 -20 0 Z
           M32 31 c-9 0 -15.5 3 -19 7 c-3.4 4 -6 10.4 -6 18 v8 h50 v-8 c0 -7.6 -2.6 -14 -6 -18 c-3.5 -4 -10 -7 -19 -7 Z
           M32 33 l-5.4 3.2 l5.4 6.4 l5.4 -6.4 Z
           M29.8 43.4 h4.4 l1.2 13.6 h-6.8 Z
           M15 46 l7 -3 v2.6 l-7 3 Z
           M15 51 l7 -3 v2.6 l-7 3 Z
           M15 56 l7 -3 v2.6 l-7 3 Z"
      />
    </svg>
  )
}
