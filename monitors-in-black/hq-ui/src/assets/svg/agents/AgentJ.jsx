import React from 'react'

// §6.3.3 — head tilted 5 degrees, right arm raised with the rod. The flash ticks
// are what sell it: J points, clicks, you saw nothing.
export default function AgentJ({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 11 a9 9 0 1 1 -0.01 0 Z
           M32 31 c-8 0 -14 3 -17 7 c-3 4 -5 10.4 -5 18 v8 h44 v-8 c0 -7.6 -2 -14 -5 -18 c-3 -4 -9 -7 -17 -7 Z
           M32 33 l-5.4 3.2 l5.4 6.4 l5.4 -6.4 Z
           M29.8 43.4 h4.4 l1.2 13.6 h-6.8 Z"
        transform="rotate(-5 32 20)"
      />
      {/* raised arm holding the rod */}
      <path d="M44 42 c3 -1.4 5.6 -4.6 6.6 -8.6 l4.4 1.2 c-1.4 5.6 -5 10 -9.4 12 Z" />
      <rect x="51.4" y="16" width="3" height="16" rx="1.5" />
      <circle cx="52.9" cy="14" r="2.6" />
      {/* flash ticks */}
      <rect x="45" y="8" width="4.4" height="1.6" transform="rotate(-35 45 8)" />
      <rect x="51.6" y="5.4" width="4.4" height="1.6" />
      <rect x="57" y="8" width="4.4" height="1.6" transform="rotate(35 57 8)" />
    </svg>
  )
}
