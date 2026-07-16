export function timeAgo(isoString) {
  if (!isoString) return '—'
  const past = new Date(isoString)
  const elapsed = Math.max(0, Date.now() - past.getTime())
  const secs = Math.floor(elapsed / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  return `${mins}m ago`
}

export function clock(isoString) {
  const d = isoString ? new Date(isoString) : new Date()
  return d.toTimeString().split(' ')[0]
}

export function num(n) {
  if (n === null || n === undefined) return '--'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  if (typeof n === 'number') {
    return n % 1 === 0 ? n.toString() : n.toFixed(2)
  }
  return n.toString()
}

export function ms(n) {
  if (n === null || n === undefined) return '--'
  return `${Math.round(n)}ms`
}
