# MONITORS IN BLACK

> Anomalies exist. We monitor them.

Autonomous incident-response demo for the Agents of SigNoz hackathon (Track 01).
A chatbot city emits OpenTelemetry signals into self-hosted SigNoz. Chaos spawns
"aliens" (anomalies). SigNoz alerts fire a webhook. An agent pipeline investigates,
remediates from a safe allowlist, and files a case report. An HQ web UI shows the
hunt live.

## Architecture

```
[chaos/spawn.py] -> [city (FastAPI, OTel)] -> [SigNoz] -alert webhook-> [orchestrator]
                                                              Z -> K -> J -> O
                                                    [hq-ui (React)] <- SSE
```

## Run

1. Self-host SigNoz (their official compose):

```bash
git clone -b main https://github.com/SigNoz/signoz.git ~/signoz
cd ~/signoz/deploy/docker && docker compose up -d
```

2. This project:

```bash
cp .env.example .env        # fill keys
docker compose -f deploy/docker-compose.yml up -d --build
cd hq-ui && npm install && npm run dev   # HQ at http://localhost:5173
```

3. Spawn an alien:

```bash
python chaos/spawn.py error_swarm       # release it
python chaos/spawn.py --banish          # stop all chaos
```

Offline smoke test (no SigNoz needed, simulates the webhook):

```bash
python smoke.py
```

## Services

| Service | Port | What |
|---|---|---|
| city | 8000 | demo chatbot app, OTel instrumented |
| orchestrator | 8100 | webhook receiver + agent pipeline + HQ API |
| hq-ui | 5173 | command center UI (vite dev) |

## The Agents

- **Z** dispatcher: verifies webhook secret, opens + dedupes cases
- **K** investigator: pulls evidence from SigNoz Query API, classifies species (LLM, heuristic fallback)
- **J** neuralyzer: executes allowlisted remediation only, verifies recovery
- **O** records: writes the case-file report

## Security model (short)

Secrets in `.env` only. Webhook requires `x-agency-token`. The LLM never emits
commands, only an `action_id` from a fixed allowlist. Evidence sent to the LLM is
delimited untrusted data. Low confidence escalates to a human instead of acting.

See `.scratch/agents-of-signoz/PRD.md` in the parent workspace for the full spec.
