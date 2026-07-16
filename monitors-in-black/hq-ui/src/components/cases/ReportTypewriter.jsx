import React, { useState, useEffect, useRef } from 'react'

const reportSeen = new Set()

export default function ReportTypewriter({ md, caseId }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  
  const key = `report:${caseId}`
  const alreadySeen = reportSeen.has(key)

  useEffect(() => {
    if (!md) return
    if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(md)
      setDone(true)
      return
    }

    setShown('')
    setDone(false)
    reportSeen.add(key)

    const chars = md.length
    const cps = Math.max(400, Math.floor(chars / 6))
    let start = null
    let animId = null

    const tick = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const count = Math.floor((elapsed * cps) / 1000)
      
      if (count >= md.length) {
        setShown(md)
        setDone(true)
      } else {
        setShown(md.slice(0, count))
        animId = requestAnimationFrame(tick)
      }
    }
    
    animId = requestAnimationFrame(tick)
    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [md, caseId, alreadySeen])

  const skip = () => {
    setShown(md)
    setDone(true)
  }

  if (!md) {
    return (
      <div className="font-mono text-ink/40 animate-pulse-soft py-4 select-none">
        REPORT PENDING — AGENT O ON STATION
      </div>
    )
  }

  const parseBold = (str) => {
    const parts = str.split('**')
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-alien font-bold">{part}</strong>
      }
      return part
    })
  }

  const renderMarkdown = (text) => {
    const lines = text.split('\n')
    let inCodeBlock = false
    const elements = []
    
    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        return
      }
      
      if (inCodeBlock) {
        elements.push(
          <pre key={index} className="bg-void border border-edge p-2 block font-mono text-xs text-alien overflow-x-auto select-text my-1 leading-normal">
            {line}
          </pre>
        )
        return
      }
      
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="font-display uppercase tracking-agency text-lg font-bold text-ink mt-4 mb-2 select-none border-b border-edge/30 pb-1">
            {parseBold(line.slice(2))}
          </h1>
        )
        return
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="font-display uppercase tracking-agency text-sm font-bold text-ink mt-3 mb-1 select-none">
            {parseBold(line.slice(3))}
          </h2>
        )
        return
      }
      
      if (line.startsWith('- ')) {
        elements.push(
          <div key={index} className="pl-4 py-0.5 font-mono text-xs text-ink/90 flex items-start">
            <span className="text-alien mr-2 select-none">▸</span>
            <span className="select-text">{parseBold(line.slice(2))}</span>
          </div>
        )
        return
      }
      
      if (line.trim()) {
        elements.push(
          <p key={index} className="font-mono text-xs text-ink/80 my-1 select-text leading-relaxed">
            {parseBold(line)}
          </p>
        )
      } else {
        elements.push(<div key={index} className="h-1.5 select-none" />)
      }
    })
    
    return elements
  }

  return (
    <div className="relative group/typewriter">
      <div className="pr-4">{renderMarkdown(shown)}</div>
      {!done && (
        <span className="inline-block w-2.5 h-4 bg-alien animate-blink-hard select-none align-middle ml-1" />
      )}
      {!done && (
        <button
          onClick={skip}
          className="absolute top-0 right-0 bg-edge/40 hover:bg-edge text-ink/40 hover:text-ink text-[9px] font-mono tracking-wider px-1.5 py-0.5 uppercase border border-edge rounded-sm cursor-pointer select-none"
        >
          Skip [▶▶]
        </button>
      )}
    </div>
  )
}
