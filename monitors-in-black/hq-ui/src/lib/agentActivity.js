const ACTIVE_STATUSES = new Set(['open', 'investigating'])

// Builds each agent's real work history from case timelines: which cases
// they're on right now (open/investigating) vs cases they closed out on
// (neuralyzed/escalated). One O(N) pass over all cases + their timelines.
export function buildAgentActivity(cases) {
  const activity = {}
  const ensure = (key) => (activity[key] ||= { active: [], recent: [] })

  for (const c of cases) {
    const lastByAgent = {}
    for (const t of c.timeline || []) {
      if (t.agent) lastByAgent[t.agent] = t
    }

    const bucket = ACTIVE_STATUSES.has(c.status) ? 'active' : 'recent'
    for (const [agent, entry] of Object.entries(lastByAgent)) {
      ensure(agent)[bucket].push({
        caseId: c.id,
        species: c.species,
        status: c.status,
        message: entry.message,
        ts: entry.ts,
        confidence: c.confidence,
      })
    }
  }

  for (const key of Object.keys(activity)) {
    const byRecency = (a, b) => (b.ts || '').localeCompare(a.ts || '')
    activity[key].active.sort(byRecency)
    activity[key].recent.sort(byRecency)
    activity[key].recent = activity[key].recent.slice(0, 6)
  }

  return activity
}
