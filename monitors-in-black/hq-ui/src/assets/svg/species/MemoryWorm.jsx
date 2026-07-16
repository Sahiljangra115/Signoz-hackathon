import React from 'react'

// §6.2.4 — worm coiled inward 1.5 turns, head up-right, tapering to the tail.
// Built from overlapping filled circles instead of a stroked path: keeps
// `zero stroke=` true (§6.1) and gives the taper for free. Spacing must stay
// tighter than the body radius or the coil breaks into loose dots.
export default function MemoryWorm({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <circle cx="48.3" cy="15.7" r="5.2" />
      <circle cx="51.4" cy="20.3" r="5.1" />
      <circle cx="53.2" cy="25.4" r="5.1" />
      <circle cx="53.8" cy="30.7" r="5.0" />
      <circle cx="53.1" cy="35.9" r="4.9" />
      <circle cx="51.2" cy="40.7" r="4.8" />
      <circle cx="48.3" cy="44.8" r="4.8" />
      <circle cx="44.5" cy="48.0" r="4.7" />
      <circle cx="40.2" cy="50.2" r="4.6" />
      <circle cx="35.5" cy="51.2" r="4.6" />
      <circle cx="30.8" cy="51.1" r="4.5" />
      <circle cx="26.4" cy="49.9" r="4.4" />
      <circle cx="22.5" cy="47.7" r="4.3" />
      <circle cx="19.3" cy="44.7" r="4.3" />
      <circle cx="16.9" cy="41.1" r="4.2" />
      <circle cx="15.5" cy="37.1" r="4.1" />
      <circle cx="15.2" cy="33.0" r="4.1" />
      <circle cx="15.8" cy="29.0" r="4.0" />
      <circle cx="17.3" cy="25.4" r="3.9" />
      <circle cx="19.6" cy="22.3" r="3.8" />
      <circle cx="22.6" cy="20.0" r="3.8" />
      <circle cx="25.9" cy="18.4" r="3.7" />
      <circle cx="29.4" cy="17.7" r="3.6" />
      <circle cx="32.9" cy="17.9" r="3.5" />
      <circle cx="36.1" cy="18.9" r="3.5" />
      <circle cx="38.9" cy="20.5" r="3.4" />
      <circle cx="41.2" cy="22.8" r="3.3" />
      <circle cx="42.8" cy="25.5" r="3.3" />
      <circle cx="43.7" cy="28.4" r="3.2" />
      <circle cx="43.8" cy="31.3" r="3.1" />
      <circle cx="43.3" cy="34.1" r="3.0" />
      <circle cx="42.1" cy="36.5" r="3.0" />
      <circle cx="40.4" cy="38.6" r="2.9" />
      <circle cx="38.4" cy="40.1" r="2.8" />
      <circle cx="36.1" cy="41.0" r="2.8" />
      <circle cx="33.7" cy="41.4" r="2.7" />
      <circle cx="31.4" cy="41.1" r="2.6" />
      <circle cx="29.4" cy="40.4" r="2.5" />
      <circle cx="27.7" cy="39.2" r="2.5" />
      <circle cx="26.3" cy="37.7" r="2.4" />
      {/* antennae nubs on the raised head */}
      <circle cx="50.1" cy="9.8" r="1.7" />
      <circle cx="54.2" cy="12.9" r="1.7" />
    </svg>
  )
}
