import React from 'react'
import { Link } from 'react-router-dom'
import { clock } from '../../lib/format'
import { motion } from 'framer-motion'
import { flickerVariants } from '../../lib/motion'

export default function ChatterLine({ line, animate }) {
  const { ts, agent, message, case_id } = line

  let agentColor = 'text-ink'
  if (agent === 'K') agentColor = 'text-alien'
  if (agent === 'J') agentColor = 'text-amber'
  if (agent === 'O') agentColor = 'text-ink/70'

  const formattedTime = clock(ts)

  const content = (
    <>
      <span className={`font-bold ${agentColor} mr-2`}>[{agent}]</span>
      <span className="text-[10px] text-ink/40 mr-3">{formattedTime}</span>
      <span className="break-words select-text flex-1">{message}</span>
      {case_id && (
        <span className="text-[9px] text-alien/50 bg-alien/5 border border-alien/15 px-1 ml-2 font-mono whitespace-nowrap">
          DOSSIER
        </span>
      )}
    </>
  )

  const wrapperClass = "py-1 border-b border-edge/30 last:border-0 font-mono text-xs flex items-start w-full hover:bg-panel/40 transition-colors"

  if (animate) {
    return (
      <motion.div
        variants={flickerVariants}
        initial="hidden"
        animate="animate"
        className="w-full"
      >
        {case_id ? (
          <Link to={`/cases?id=${case_id}`} className={wrapperClass}>
            {content}
          </Link>
        ) : (
          <div className={wrapperClass}>{content}</div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      {case_id ? (
        <Link to={`/cases?id=${case_id}`} className={wrapperClass}>
          {content}
        </Link>
      ) : (
        <div className={wrapperClass}>{content}</div>
      )}
    </div>
  )
}
