import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text, cps = 33, enabled = true) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    if (!enabled || !text) {
      setShown('')
      setDone(true)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text)
      setDone(true)
      return
    }

    setShown('')
    setDone(false)

    let start = null
    let animId = null

    const tick = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const count = Math.floor((elapsed * cps) / 1000)
      
      if (count >= textRef.current.length) {
        setShown(textRef.current)
        setDone(true)
      } else {
        setShown(textRef.current.slice(0, count))
        animId = requestAnimationFrame(tick)
      }
    }

    animId = requestAnimationFrame(tick)
    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [text, cps, enabled])

  const skip = () => {
    setShown(text)
    setDone(true)
  }

  return { shown, done, skip }
}
