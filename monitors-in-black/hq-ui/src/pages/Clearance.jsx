import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTypewriter } from '../hooks/useTypewriter'
import { BOOT_LINES } from '../lib/constants'

export default function Clearance() {
  const navigate = useNavigate()
  const bootText = BOOT_LINES.join('\n')
  
  const { shown, done, skip } = useTypewriter(bootText, 35)

  useEffect(() => {
    if (done) {
      const id = setTimeout(() => {
        navigate('/command')
      }, 550)
      return () => clearTimeout(id)
    }
  }, [done, navigate])

  return (
    <div
      onClick={skip}
      onKeyDown={skip}
      tabIndex={0}
      className="fixed inset-0 bg-void flex items-center justify-center p-6 cursor-pointer select-none focus:outline-none z-50"
    >
      <div className="w-full max-w-lg">
        <pre className="font-mono text-alien text-xs md:text-sm leading-6 whitespace-pre-wrap">
          {shown}
          {!done && <span className="inline-block w-2 h-3.5 bg-alien animate-blink-hard align-middle ml-1" />}
        </pre>
        {!done && (
          <div className="text-ink/30 text-[9px] font-mono uppercase tracking-widest mt-8 animate-pulse-soft text-center">
            [ CLICK TO SKIP SEQUENCE ]
          </div>
        )}
      </div>
    </div>
  )
}
