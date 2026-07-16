# Monitors in Black — Architecture

## System Diagram
```
┌────────────────┐      ┌──────────────┐      ┌─────────────────────────┐
│  chaos/spawn   │ ───> │  city:8000   │ ───> │         SigNoz          │
└────────────────┘      └──────────────┘      └─────────────────────────┘
                                                       │ (Alert Webhook)
                                                       ▼
┌────────────────┐      ┌──────────────┐      ┌─────────────────────────┐
│     hq-ui      │ <─── │ orchestrator │ <────│      orchestrator       │
│  (React, SSE)  │      │ (SSE Events) │      │  (auth & case pipeline) │
└────────────────┘      └──────────────┘      └─────────────────────────┘
```

## Description
Monitors in Black is a self-healing observability demo designed for Track 01 of the Agents of SigNoz Hackathon.
1. **The City App (`city/`)**: A FastAPI microservice instrumented with OpenTelemetry. It exposes a `/chat` endpoint calling Claude Haiku and custom counters for requests, token counts, and cost, alongside SQLite citizens metadata database queries.
2. **Chaos Spawner (`chaos/spawn.py`)**: Atomically triggers six alien species (injected anomalies/bugs) via `flags.json` and `queue.json`.
3. **SigNoz Integration**: Captures traces, metrics, logs, and triggers Alertmanager webhooks.
4. **HQ Orchestrator (`orchestrator/`)**: Receives webhook requests, runs authentication verification (token, basic auth, or query param), triggers sequential Agent Z -> K -> J -> O pipeline, executes allowlisted docker/flag remediation, and publishes real-time progress events over SSE.
5. **HQ Web UI (`hq-ui/`)**: A Vite-based UI displaying live logs, metrics, events, and cases dossier.
