import React, { useEffect, useRef, useState } from 'react'
import ChatterLine from './ChatterLine'

export default function ChatterFeed({ lines }) {
  const containerRef = useRef(null)
  const [pinned, setPinned] = useState(true)
  const mountTimeRef = useRef(Date.now())

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight <= 24
    setPinned(isAtBottom)
  }

  useEffect(() => {
    if (pinned && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines, pinned])

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      setPinned(true)
    }
  }

  return (
    <div className="relative h-full flex flex-col select-none">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        aria-live="polite"
        role="log"
        className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1"
      >
        {lines.length === 0 ? (
          <div className="text-alien/40 text-xs italic p-4 font-mono">
            // CHANNEL QUIET. ALL UNITS STANDING BY.
          </div>
        ) : (
          lines.map((line, idx) => {
            const lineTime = new Date(line.ts).getTime()
            const animate = lineTime > mountTimeRef.current
            return (
              <ChatterLine
                key={line.ts + idx}
                line={line}
                animate={animate}
              />
            )
          })
        )}
      </div>

      {!pinned && lines.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-alien text-void hover:bg-alien/95 active:bg-alien/90 text-[10px] font-bold tracking-agency px-3 py-1 font-mono uppercase rounded-sm shadow-glow"
        >
          ▼ New Transmissions
        </button>
      )}
    </div>
  )
}
