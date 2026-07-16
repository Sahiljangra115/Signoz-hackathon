import React from 'react'

// §6.3.2 — one negative bar across the eye line (abstract shades, deliberately
// NOT two lenses) plus a magnifier over the right shoulder. The magnifier ring
// is an evenodd annulus, since a stroked circle is banned by §6.1.
export default function AgentK({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 11 a9 9 0 1 1 -0.01 0 Z
           M32 31 c-8 0 -14 3 -17 7 c-3 4 -5 10.4 -5 18 v8 h44 v-8 c0 -7.6 -2 -14 -5 -18 c-3 -4 -9 -7 -17 -7 Z
           M23 16.4 h18 a2 2 0 0 1 0 4 h-18 a2 2 0 0 1 0 -4 Z
           M32 33 l-5.4 3.2 l5.4 6.4 l5.4 -6.4 Z
           M29.8 43.4 h4.4 l1.2 13.6 h-6.8 Z
           M52 30 a7 7 0 1 0 0.01 0 Z
           M52 33 a4 4 0 1 1 -0.01 0 Z"
      />
      <rect x="55.6" y="41" width="2.4" height="8" transform="rotate(-40 55.6 41)" />
    </svg>
  )
}
