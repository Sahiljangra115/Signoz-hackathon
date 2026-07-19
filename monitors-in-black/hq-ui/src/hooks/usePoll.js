import { useState, useEffect, useRef, useCallback } from 'react'
import { getJSON } from '../lib/api'

export function usePoll(path, intervalMs, defaultValue = null) {
  const [data, setData] = useState(defaultValue)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  const refetch = useRef(() => {})
  refetch.current = async () => {
    try {
      const res = await getJSON(path)
      setData(res)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch.current()

    const tick = () => {
      if (document.visibilityState === 'hidden') return
      refetch.current()
    }

    intervalRef.current = setInterval(tick, intervalMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [path, intervalMs])

  const stableRefetch = useCallback(() => refetch.current(), [])

  return { data, error, loading, refetch: stableRefetch }
}
