import { useState, useEffect, useRef } from 'react'

export function useEvents({ onChatter, onCase, onReconnect }) {
  const [connection, setConnection] = useState('lost')
  const backoffRef = useRef(1000)
  const sourceRef = useRef(null)
  const lastActiveRef = useRef(Date.now())

  useEffect(() => {
    let active = true

    const connect = () => {
      if (!active) return
      
      if (sourceRef.current) {
        sourceRef.current.close()
      }

      setConnection('reconnecting')
      const source = new EventSource('/api/events')
      sourceRef.current = source
      
      source.onopen = () => {
        if (!active) return
        setConnection('live')
        backoffRef.current = 1000
        lastActiveRef.current = Date.now()
        if (onReconnect) onReconnect()
      }

      source.addEventListener('chatter', (e) => {
        lastActiveRef.current = Date.now()
        try {
          const data = JSON.parse(e.data)
          if (onChatter) onChatter(data)
        } catch (err) {
          console.warn('Malformed chatter event:', err)
        }
      })

      source.addEventListener('case', (e) => {
        lastActiveRef.current = Date.now()
        try {
          const data = JSON.parse(e.data)
          if (onCase) onCase(data)
        } catch (err) {
          console.warn('Malformed case event:', err)
        }
      })

      source.addEventListener('ping', () => {
        lastActiveRef.current = Date.now()
      })

      source.onerror = () => {
        if (!active) return
        source.close()
        
        const delay = backoffRef.current
        backoffRef.current = Math.min(10000, backoffRef.current * 2)
        if (backoffRef.current >= 8000) {
          setConnection('lost')
        }
        
        setTimeout(() => {
          connect()
        }, delay)
      }
    }

    connect()

    const watchdog = setInterval(() => {
      if (Date.now() - lastActiveRef.current > 45000) {
        console.warn('SSE heartbeat lost, reconnecting...')
        connect()
      }
    }, 15000)

    return () => {
      active = false
      if (sourceRef.current) sourceRef.current.close()
      clearInterval(watchdog)
    }
  }, [onChatter, onCase, onReconnect])

  return connection
}
