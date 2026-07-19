import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer } from '../../lib/motion'
import StatCard from '../ui/StatCard'
import { GradientDots, GradientBars } from '../charts/MiniCharts'

export default function StatusTiles({ stats, loading }) {
  const num = (v) => (loading || v == null ? '--' : Number(v))
  const breach = stats?.city_status === 'BREACH'

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 xl:grid-cols-4 gap-4 select-none"
    >
      <StatCard
        label="City Status"
        value={
          <span className={breach ? 'text-danger animate-pulse-soft' : 'text-beam'}>
            {stats ? stats.city_status : loading ? 'LINK' : 'OFFLINE'}
          </span>
        }
        sub={breach ? 'Anomaly containment breach' : 'All sectors nominal'}
      />

      <StatCard
        label="Active Contacts"
        value={num(stats?.active_cases)}
        sub="Open + investigating"
        chart={<GradientDots />}
      />

      <StatCard
        label="Captured Anomalies"
        value={num(stats?.neuralyzed_total)}
        accent
        sub="Neuralyzed to date"
        chart={<GradientBars tall={5} />}
      />

      <StatCard
        label="Agents on Duty"
        value={num(stats?.agents_on_duty)}
        sub="Z · K · J · O"
      />
    </motion.div>
  )
}
