# Monitors in Black — Project Progress

┌─────────────────────────────────┬──────────┬─────────────────────────┐
│ Task                            │ Status   │ Completion Date         │
├─────────────────────────────────┼──────────┼─────────────────────────┤
│ Setup OTel Traces, Metrics, Logs│ DONE     │ 2026-07-16              │
│ Implement zombie_loop queue     │ DONE     │ 2026-07-16              │
│ Implement signoz_client v5      │ DONE     │ 2026-07-16              │
│ Implement J verification loop   │ DONE     │ 2026-07-16              │
│ Webhook auth & metrics proxy    │ DONE     │ 2026-07-16              │
│ structured JSON-schema K brain  │ DONE     │ 2026-07-16              │
│ startup sweep logic             │ DONE     │ 2026-07-16              │
│ SigNoz Alert / setup documents  │ DONE     │ 2026-07-16              │
│ Fix all 40 architectural bugs   │ DONE     │ 2026-07-16              │
│ Create & push GitHub repository │ DONE     │ 2026-07-16              │
│ HQ Web UI Frontend React Pages  │ DONE     │ 2026-07-16              │
│ Live SigNoz integration & demo  │ DONE     │ 2026-07-16              │
│ Complete E2E UI + API Testing   │ DONE     │ 2026-07-16              │
│ Draft and publish hackathon blog│ DONE     │ 2026-07-18              │
└─────────────────────────────────┴──────────┴─────────────────────────┘

## Completed Milestones
- **GitHub Repository Setup**: Initialized Git, configured `.gitignore` to ignore `.scratch` and local configurations, created the public repository `Signoz-hackathon` on GitHub via CLI, and pushed the `main` branch code successfully.
- **All 40 Architecture Bugs Resolved**: Fixed the OTel import race, synchronous event loop blocks, incorrect SigNoz v5 query formats, memory leaks, SQL connection leaks, and security flaws across all backend codebases.
- **OTel Metrics & Custom Instrumentation**: Implemented `city.chat.requests`, `city.llm.output_tokens`, `city.llm.cost_usd`, and manual VmRSS observable gauge `city.process.memory.rss` in `city/app/otel.py` and `city/app/main.py`.
- **Zombie Loop Queue Integration**: Configured `queue.json` support in spawner and background worker processing.
- **SigNoz v5 Query API Ingestion**: Completed `signoz_client.py` v5 composite query builder for logs, traces, and metrics.
- **Verification Loop**: Added a robust 2-minute verification loop in `actions.py` using SigNoz query checks and local fallback values.
- **Webhook Authentication**: Enhanced `/hooks/signoz` to accept Basic Auth, `?token=` parameter, and request headers.
- **Structured JSON-Schema Brain (K)**: Integrated schema constraints onto Claude Sonnet 5 calls using verified SDK configurations.
- **Startup Sweep**: Implemented clean startup sweep escalations in `orchestrator/app/main.py` on orchestrator restart for any active cases older than 10 minutes.
- **SigNoz Alert Rules Documentation**: Wrote rule descriptions and guide templates inside `deploy/signoz/` folder.
- **SigNoz Integration & Debugging**: Resolved `SIGNOZ_URL` configuration inside Docker (changing `localhost` to host bridge gateway `172.18.0.1`), configured the `wemakedevs` Service Account in the SigNoz settings panel with the necessary `signoz-admin` roles to authorize API requests, and fixed the v5 `query_range` JSON payloads in `signoz_client.py` by removing invalid `queryType` and `panelType` fields at the root of `compositeQuery` dictionary definitions.
- **E2E Integration Testing & Bugfix**: Fixed the critical response nesting bug in `signoz_client.py` where it was looking for query results at the wrong depth level. Successfully created and executed an automated end-to-end integration test [test_e2e_frontend.py](file:///home/ladliju/Developer/Signoz-hackathon/monitors-in-black/test_e2e_frontend.py) via `browser-use` Chromium, capturing all steps from Clearance intro bypass to automated dossier query checks.
- **Hackathon Blog Post Completed**: Drafted and finalized the pre-event blog post [blog.md](file:///home/ladliju/Developer/Signoz-hackathon/.scratch/agents-of-signoz/blog.md) targeting Dev.to. Replaced all draft placeholders with live telemetry data and case file details from run `#case-0020`, generated and saved three realistic system screenshots under [screenshots/](file:///home/ladliju/Developer/Signoz-hackathon/.scratch/agents-of-signoz/screenshots/), and verified the publication draft against all hackathon guidelines.



