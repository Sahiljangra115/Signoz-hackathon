import React from 'react'

// §6.3.4 — slighter shoulders, negative spectacles, open dossier at the chest.
// If it isn't filed, it never happened.
//
// Everything is ONE evenodd path on purpose. A same-colour shape drawn over the
// body just unions into it and disappears; detail only survives as negative
// space. Nesting depth decides fill: body(1) -> folder(2, hole) -> pages(3, fill).
export default function AgentO({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 11 a9 9 0 1 1 -0.01 0 Z
           M32 31 c-7 0 -12.4 3 -15.4 7 c-3 4 -4.6 10.4 -4.6 18 v8 h40 v-8 c0 -7.6 -1.6 -14 -4.6 -18 c-3 -4 -8.4 -7 -15.4 -7 Z
           M28.2 19.6 a3.4 3.4 0 1 0 0.01 0 Z
           M35.8 19.6 a3.4 3.4 0 1 0 0.01 0 Z
           M30.8 19 h2.4 v1.4 h-2.4 Z
           M32 33 l-4.8 2.8 l4.8 5.6 l4.8 -5.6 Z
           M30 42 h4 l1 7 h-6 Z
           M14 50 h36 v14 h-36 Z
           M16.6 52.6 h14.2 v11.4 h-14.2 Z
           M33.2 52.6 h14.2 v11.4 h-14.2 Z"
      />
    </svg>
  )
}
