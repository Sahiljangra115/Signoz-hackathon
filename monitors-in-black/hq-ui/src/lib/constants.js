import LatencyLeech from '../assets/svg/species/LatencyLeech'
import ErrorSwarm from '../assets/svg/species/ErrorSwarm'
import TokenDevourer from '../assets/svg/species/TokenDevourer'
import MemoryWorm from '../assets/svg/species/MemoryWorm'
import ZombieLoop from '../assets/svg/species/ZombieLoop'
import TheGhost from '../assets/svg/species/TheGhost'
import AgentZ from '../assets/svg/agents/AgentZ'
import AgentK from '../assets/svg/agents/AgentK'
import AgentJ from '../assets/svg/agents/AgentJ'
import AgentO from '../assets/svg/agents/AgentO'

export const BOOT_LINES = [
  "> MONITORS IN BLACK // RESTRICTED SYSTEM",
  "> ESTABLISHING SECURE UPLINK ............ OK",
  "> VERIFYING CREDENTIAL: AGENT-RECRUIT ... OK",
  "> BIOMETRIC HASH ........................ MATCH",
  "> LOADING CITY GRID ..................... OK",
  "> CLEARANCE GRANTED"
]

export const SPECIES_META = {
  latency_leech: {
    species_id: 'latency_leech',
    Icon: LatencyLeech,
    codename: 'LATENCY LEECH',
    threat: 3,
    signature: 'p99 latency spike on /chat spans',
    description: 'Sluggish anomaly that drains service throughput.'
  },
  error_swarm: {
    species_id: 'error_swarm',
    Icon: ErrorSwarm,
    codename: 'ERROR SWARM',
    threat: 4,
    signature: '5xx error-rate burst',
    description: 'Chaotic entity cluster causing random server exceptions.'
  },
  token_devourer: {
    species_id: 'token_devourer',
    Icon: TokenDevourer,
    codename: 'TOKEN DEVOURER',
    threat: 4,
    signature: 'gen_ai token usage spike',
    description: 'Insatiable entity that balloons LLM inputs with junk contexts.'
  },
  memory_worm: {
    species_id: 'memory_worm',
    Icon: MemoryWorm,
    codename: 'MEMORY WORM',
    threat: 2,
    signature: 'container memory climbing',
    description: 'Silent leak worm that steadily accumulates RAM allocation.'
  },
  zombie_loop: {
    species_id: 'zombie_loop',
    Icon: ZombieLoop,
    codename: 'ZOMBIE LOOP',
    threat: 2,
    signature: 'repeating poison-message error logs',
    description: 'Undead process queue victim retrying dead tasks indefinitely.'
  },
  ghost: {
    species_id: 'ghost',
    Icon: TheGhost,
    codename: 'THE GHOST',
    threat: 5,
    signature: 'traffic drops to near zero',
    description: 'Ethereal force that makes user traffic vanish into thin air.'
  }
}

export const threatColor = (t) => (t >= 4 ? 'danger' : t === 3 ? 'amber' : 'alien')

export const AGENTS = [
  {
    key: 'Z',
    Avatar: AgentZ,
    codename: 'Z',
    role: 'Desk Dispatcher',
    tools: ['HMAC Verifier', 'Case Allocator'],
    bio: "Runs the desk. Has never once said 'good job'."
  },
  {
    key: 'K',
    Avatar: AgentK,
    codename: 'K',
    role: 'Lead Investigator',
    tools: ['SigNoz v5 Query API', 'Claude-Sonnet Classifier'],
    bio: "Reads traces like tabloids. Believes none of them."
  },
  {
    key: 'J',
    Avatar: AgentJ,
    codename: 'J',
    role: 'Field Agent / Neuralyzer',
    tools: ['Allowlisted Remediation CLI', 'Banishment Tool'],
    bio: "Points. Clicks. You saw nothing."
  },
  {
    key: 'O',
    Avatar: AgentO,
    codename: 'O',
    role: 'Records Keeper',
    tools: ['Claude-Haiku Case Filing System', 'Capture Registry'],
    bio: "If it isn't filed, it never happened."
  }
]
