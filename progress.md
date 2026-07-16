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
│ HQ Web UI Frontend React Pages  │ PENDING  │ 2026-07-16              │
│ Live SigNoz integration & demo  │ PENDING  │ 2026-07-17              │
└─────────────────────────────────┴──────────┴─────────────────────────┘

## Completed Milestones
- **All 40 Architecture Bugs Resolved**: Fixed the OTel import race, synchronous event loop blocks, incorrect SigNoz v5 query formats, memory leaks, SQL connection leaks, and security flaws across all backend codebases.
- **OTel Metrics & Custom Instrumentation**: Implemented `city.chat.requests`, `city.llm.output_tokens`, `city.llm.cost_usd`, and manual VmRSS observable gauge `city.process.memory.rss` in `city/app/otel.py` and `city/app/main.py`.
- **Zombie Loop Queue Integration**: Configured `queue.json` support in spawner and background worker processing.
- **SigNoz v5 Query API Ingestion**: Completed `signoz_client.py` v5 composite query builder for logs, traces, and metrics.
- **Verification Loop**: Added a robust 2-minute verification loop in `actions.py` using SigNoz query checks and local fallback values.
- **Webhook Authentication**: Enhanced `/hooks/signoz` to accept Basic Auth, `?token=` parameter, and request headers.
- **Structured JSON-Schema Brain (K)**: Integrated schema constraints onto Claude Sonnet 5 calls using verified SDK configurations.
- **Startup Sweep**: Implemented clean startup sweep escalations in `orchestrator/app/main.py` on orchestrator restart for any active cases older than 10 minutes.
- **SigNoz Alert Rules Documentation**: Wrote rule descriptions and guide templates inside `deploy/signoz/` folder.
