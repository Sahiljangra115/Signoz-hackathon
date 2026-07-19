import React from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT, SPRING } from '../../lib/motion'
import AgentZ from '../../assets/svg/agents/AgentZ'
import AgentK from '../../assets/svg/agents/AgentK'
import AgentJ from '../../assets/svg/agents/AgentJ'
import AgentO from '../../assets/svg/agents/AgentO'

function AlertBolt({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The case pipeline is a real sequence, so the numbering is information.
const STEPS = [
  {
    id: '00',
    Icon: AlertBolt,
    name: 'Alert',
    role: 'SigNoz webhook',
    blurb: 'A threshold trips. SigNoz fires a signed webhook at the desk.',
  },
  {
    id: '01',
    Icon: AgentZ,
    name: 'Agent Z',
    role: 'Dispatch',
    blurb: 'Verifies the HMAC, opens a case, assigns the field team.',
  },
  {
    id: '02',
    Icon: AgentK,
    name: 'Agent K',
    role: 'Investigate',
    blurb: 'Pulls traces, metrics and logs in parallel. Names the species.',
  },
  {
    id: '03',
    Icon: AgentJ,
    name: 'Agent J',
    role: 'Neuralyze',
    blurb: 'Runs an allowlisted fix. The incident forgets it happened.',
  },
  {
    id: '04',
    Icon: AgentO,
    name: 'Agent O',
    role: 'File',
    blurb: 'Writes the case report. If it is not filed, it never happened.',
  },
]

export default function PipelineRail() {
  return (
    <div className="relative">
      {/* beam connector, draws on scroll (desktop only) */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-px bg-beam opacity-40 origin-left"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...SPRING_SOFT, delay: i * 0.12 }}
            className="relative flex flex-col items-start lg:items-center lg:text-center gap-3"
          >
            <motion.div
              whileHover={{ y: -4, transition: SPRING }}
              className="w-[4.5rem] h-[4.5rem] rounded-2xl border border-edge bg-card/80 backdrop-blur-xl shadow-card flex items-center justify-center relative z-10"
            >
              <s.Icon className={`w-10 h-10 ${i === 0 ? 'text-amber' : 'text-ink/80'}`} />
            </motion.div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-agency text-alien/70">
                {s.id} // {s.role}
              </div>
              <div className="font-stat text-lg font-bold text-ink mt-0.5">{s.name}</div>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-ink/50 max-w-[16rem]">
              {s.blurb}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
