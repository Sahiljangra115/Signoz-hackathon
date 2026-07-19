import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT, SPRING_SNAPPY, revealSpring } from '../lib/motion'
import TerminalMock from '../components/landing/TerminalMock'
import FeatureRow from '../components/landing/FeatureRow'
import PipelineRail from '../components/landing/PipelineRail'
import SpeciesMarquee from '../components/landing/SpeciesMarquee'

// Barcode bar widths (decorative, mirrors the reference crate label).
const BARCODE = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2]

function WireframeCrate() {
  const stroke = {
    className: 'crate-line',
    pathLength: 1,
    vectorEffect: 'non-scaling-stroke',
  }
  return (
    <svg
      viewBox="0 0 900 640"
      className="crate-float w-full max-w-3xl max-h-[56vh] text-ink/85"
      role="img"
      aria-label="Wireframe containment crate, MIB standard unit"
    >
      {/* line-art */}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path {...stroke} d="M450 250 L656 353 L450 456 L244 353 Z" />
        <path {...stroke} d="M244 353 L450 456 L450 606 L244 503 Z" />
        <path {...stroke} d="M450 456 L656 353 L656 503 L450 606 Z" />
        {/* tape + flap seams on the lid */}
        <path {...stroke} d="M450 456 L450 250" />
        <path {...stroke} d="M244 353 L656 353" opacity="0.5" />
        {/* lid overhang on each front face */}
        <path {...stroke} d="M244 371 L450 474" opacity="0.7" />
        <path {...stroke} d="M450 474 L656 371" opacity="0.7" />
        {/* handle cutout, sheared onto the right face */}
        <g transform="matrix(0.894,-0.447,0,1,450,456)">
          <rect {...stroke} x="60" y="36" width="70" height="22" rx="11" />
        </g>
      </g>

      {/* labels, fade in after the crate draws */}
      <g className="crate-labels" fontFamily="'IBM Plex Mono', monospace">
        {/* left face */}
        <g transform="matrix(0.894,0.447,0,1,244,353)" fill="#f2f2f0">
          <text x="22" y="30" fontSize="9" letterSpacing="1.5" fillOpacity="0.55">MIB-STD-01</text>
          <line x1="22" y1="38" x2="150" y2="38" stroke="#f2f2f0" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3" />
          <text x="22" y="50" fontSize="8" letterSpacing="2" fillOpacity="0.45">DO NOT NEURALYZE</text>
          <text x="16" y="120" fontSize="23" letterSpacing="0.5" fillOpacity="0.92">monitors.black</text>
          <g transform="translate(104,88)">
            {BARCODE.reduce(
              (acc, w, i) => {
                acc.nodes.push(
                  <rect key={i} x={acc.x} y="0" width={w} height="20" fill="#f2f2f0" fillOpacity="0.75" />
                )
                acc.x += w + 1.5
                return acc
              },
              { x: 0, nodes: [] }
            ).nodes}
          </g>
        </g>

        {/* right face */}
        <g transform="matrix(0.894,-0.447,0,1,450,456)" fill="#f2f2f0">
          <rect x="20" y="112" width="14" height="14" rx="3" className="bg-beam" fill="#39ff14" fillOpacity="0.9" />
          <path d="M24 116 L30 116 L25 123 L30 123" stroke="#000" strokeWidth="1.4" fill="none" />
          <text x="42" y="124" fontSize="7.5" letterSpacing="1.5" fillOpacity="0.5">POWERED BY SIGNOZ</text>
        </g>
      </g>
    </svg>
  )
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.9, delay: 1.4, ease: EASE_OUT } },
}

function SectionHead({ eyebrow, title, sub, center = false }) {
  return (
    <motion.div
      {...revealSpring}
      className={center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}
    >
      <div className="font-mono text-[10px] uppercase tracking-agency text-alien/80 mb-3">
        {eyebrow}
      </div>
      <h2 className="font-stat text-4xl md:text-5xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 font-mono text-sm leading-relaxed text-ink/55">{sub}</p>
      )}
    </motion.div>
  )
}

function EnterButton({ onClick, ghost = false, children = 'Enter HQ →' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, transition: SPRING_SOFT }}
      whileTap={{ scale: 0.96, y: 0, transition: SPRING_SNAPPY }}
      className={
        ghost
          ? 'font-mono text-xs uppercase tracking-agency px-6 py-3 rounded-full border border-edge bg-card/40 backdrop-blur-md text-ink/70 hover:text-ink hover:border-ink/30 transition-colors'
          : 'font-mono text-xs font-bold uppercase tracking-agency px-6 py-3 rounded-full bg-beam text-void shadow-glow hover:shadow-glow-strong transition-shadow'
      }
    >
      {children}
    </motion.button>
  )
}

const MOCK_EVIDENCE = [
  { prompt: true, text: 'mib investigate case-0021' },
  { text: 'querying signoz v5 :: traces / metrics / logs in parallel', tone: 'dim' },
  { text: 'traces   p99 latency on /chat', tail: '4,812 ms ▲', tailTone: 'danger' },
  { text: 'metrics  container.memory.usage', tail: 'stable', tailTone: 'alien' },
  { text: 'logs     5xx burst, last 5 min', tail: '312 hits', tailTone: 'amber' },
  { text: 'evidence bundle sealed → 3 signals, 41 spans attached', tone: 'aqua' },
]

const MOCK_VERDICT = [
  { prompt: true, text: 'mib classify --evidence case-0021' },
  { text: 'species ......... LATENCY LEECH', tone: 'alien' },
  { text: 'threat .......... ▮▮▮▯▯  3 / 5', tone: 'amber' },
  { text: 'confidence ...... 0.91' },
  { text: 'cited: p99 spike on /chat spans, queue depth ×9', tone: 'dim' },
]

const MOCK_CONTAIN = [
  { prompt: true, text: 'mib neuralyze --action restart-worker --allowlisted' },
  { text: 'flash confirmed. subject saw nothing.', tone: 'dim' },
  { text: 'p99 latency on /chat', tail: '212 ms ▼', tailTone: 'alien' },
  { prompt: true, text: 'mib file case-0021' },
  { text: 'case filed by agent O :: status: NEURALYZED', tone: 'alien' },
]

const STATS = [
  { value: '6', label: 'species on file' },
  { value: '3', label: 'signals per investigation' },
  { value: '4', label: 'agents on duty' },
  { value: '0', label: 'humans woken' },
]

const STACK = ['SigNoz', 'OpenTelemetry', 'FastAPI', 'Claude', 'React']

export default function Clearance() {
  const navigate = useNavigate()
  const enter = useCallback(() => navigate('/command'), [navigate])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter') enter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter])

  return (
    <div className="relative bg-void text-ink select-none">
      {/* ── hero ─────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col">
        <motion.header
          variants={fade}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between px-6 md:px-10 pt-6 font-mono text-[10px] md:text-xs uppercase tracking-agency"
        >
          <span className="flex items-center gap-2 text-ink/80">
            <span className="w-2 h-2 rounded-sm bg-beam" />
            Monitors in Black
          </span>
          <span className="flex items-center gap-2 text-alien/80">
            Clearance // Granted
            <span className="w-1.5 h-1.5 rounded-full bg-alien animate-blink-hard" />
          </span>
        </motion.header>

        <div className="relative flex-1 flex items-center justify-center px-6">
          <div
            aria-hidden
            className="absolute w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.06] bg-beam"
          />
          <WireframeCrate />
        </div>

        <motion.footer
          variants={fade}
          initial="initial"
          animate="animate"
          className="px-6 md:px-10 pb-7 font-mono text-[10px] uppercase tracking-agency text-ink/40"
        >
          <div className="flex flex-col items-center gap-5 mb-6">
            <div className="flex items-center gap-3">
              <EnterButton onClick={enter} />
              <span className="text-ink/40 normal-case tracking-normal text-[10px]">
                or press Enter
              </span>
            </div>
          </div>
          <div className="h-px w-full bg-edge mb-4" />
          <div className="flex items-center justify-between">
            <span>MIB-OS // Field Terminal</span>
            <span className="text-alien font-bold [text-shadow:0_0_10px_rgba(57,255,20,0.7)]">
              Scroll for the field brief <span className="inline-block animate-bounce">↓</span>
            </span>
            <span className="hidden sm:inline">34.05°N 118.24°W</span>
          </div>
        </motion.footer>
      </section>

      {/* ── pipeline ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          center
          eyebrow="// The pipeline"
          title="One alert. Four agents. Zero humans paged."
          sub="An autonomous incident desk built on SigNoz. When the city glitches, the case moves through four hands and none of them are yours."
        />
        <div className="mt-16 md:mt-20">
          <PipelineRail />
        </div>
      </section>

      {/* ── feature rows ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 flex flex-col gap-24 md:gap-36 py-8 md:py-16">
        <FeatureRow
          eyebrow="// Evidence"
          title="Evidence, not vibes."
          body="When an alert lands, Agent K interrogates SigNoz directly: traces, metrics and logs pulled in parallel through the v5 query API. Every verdict cites the numbers that convicted it."
          points={[
            'Parallel evidence gathering across all three signals',
            'HMAC-signed webhooks, read-only queries',
            'Raw spans attached to every case file',
          ]}
        >
          <TerminalMock title="agent-k@mib-hq :: investigate" lines={MOCK_EVIDENCE} />
        </FeatureRow>

        <FeatureRow
          flip
          eyebrow="// Verdict"
          title="A verdict with receipts."
          body="Claude reads the evidence bundle and names the species: Latency Leech, Error Swarm, Token Devourer. Confidence is scored, and when the model is not sure, it says so instead of guessing."
          points={[
            'Six known species, one taxonomy',
            'Confidence thresholds gate every action',
            'Uncertain cases escalate instead of auto-firing',
          ]}
        >
          <TerminalMock title="agent-k@mib-hq :: classify" lines={MOCK_VERDICT} />
        </FeatureRow>

        <FeatureRow
          eyebrow="// Containment"
          title="Neuralyzed. Filed. Forgotten."
          body="Agent J runs remediation from a strict allowlist, nothing improvised at 3AM. Agent O writes the case file and updates the capture registry. The city never knew anything happened."
          points={[
            'Allowlisted remediation commands, no free-form shell',
            'Every action logged to the case record',
            'Registry tracks captures per species',
          ]}
        >
          <TerminalMock title="agent-j@mib-hq :: neuralyze" lines={MOCK_CONTAIN} />
        </FeatureRow>
      </section>

      {/* ── species marquee ──────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <SectionHead
            center
            eyebrow="// The registry"
            title="Known threats, on file."
            sub="Six species of production anomaly, each with a signature K can spot from across the room."
          />
        </div>
        <SpeciesMarquee />
      </section>

      {/* ── stats band ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-edge bg-edge">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING_SOFT, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: SPRING_SOFT }}
              className="relative bg-panel/70 backdrop-blur-xl p-8 text-center hover:bg-panel/90 transition-colors"
            >
              <div className="font-stat text-5xl md:text-6xl font-bold text-beam leading-none">
                {s.value}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-agency text-ink/45">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* stack strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-agency text-ink/35"
        >
          <span className="text-ink/25">Built with</span>
          {STACK.map((t) => (
            <span key={t} className="hover:text-ink/70 transition-colors">{t}</span>
          ))}
        </motion.div>
      </section>

      {/* ── final CTA + footer ───────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <SectionHead
            center
            eyebrow="// Clearance granted"
            title="The city sleeps because the desk doesn't."
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <EnterButton onClick={enter} />
            <EnterButton
              ghost
              onClick={() => window.open('https://github.com/Sahiljangra115/Signoz-hackathon', '_blank', 'noopener')}
            >
              Case files on GitHub
            </EnterButton>
          </motion.div>
        </div>
        <footer className="px-6 md:px-10 pb-7 font-mono text-[10px] uppercase tracking-agency text-ink/40">
          <div className="h-px w-full bg-edge mb-4" />
          <div className="flex items-center justify-between">
            <span>MIB-OS // Field Terminal</span>
            <span>Agents of SigNoz :: Hackathon 2026</span>
            <span className="hidden sm:inline">34.05°N 118.24°W</span>
          </div>
        </footer>
      </section>
    </div>
  )
}
