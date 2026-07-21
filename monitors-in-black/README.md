# Monitors in Black

Full documentation, architecture, screenshots, and quickstart live in the
[repository README](../README.md).

Short version, from this directory:

```bash
cp .env.example .env                                        # fill in keys
docker compose -f deploy/docker-compose.yml up -d --build   # city, trafficgen, orchestrator
cd hq-ui && npm install && npm run dev                      # HQ at http://localhost:5173
python chaos/spawn.py error_swarm                           # release an alien
python smoke.py                                             # offline end to end test
```

| Service | Port | What |
|---|---|---|
| city | 8000 | demo chatbot app, OTel instrumented |
| orchestrator | 8100 | webhook receiver, agent pipeline, HQ API and SSE |
| hq-ui | 5173 | command center UI (vite dev server) |

SigNoz assets to import once: `deploy/signoz/dashboard-city-surveillance.json` and
`deploy/signoz/alert-rules.json`. Setup notes in `deploy/signoz/README.md`.
