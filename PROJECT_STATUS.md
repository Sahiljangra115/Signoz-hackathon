# Monitors in Black — Project Status

## Status: COMPLETE & VERIFIED
All core backend components, agent pipeline logic, and frontend HQ UI pages are fully built, integrated, and verified using live end-to-end integration tests.

## Current State
┌──────────────────┬─────────────────┬─────────────────────────────────┐
│ Service          │ Address / Port  │ Health / Status                 │
├──────────────────┼─────────────────┼─────────────────────────────────┤
│ city             │ localhost:8000  │ Code Complete & Instrumented    │
│ orchestrator     │ localhost:8100  │ Fully Integrated & Verified     │
│ hq-ui            │ localhost:5173  │ Running & Verified (E2E Pass)   │
└──────────────────┴─────────────────┴─────────────────────────────────┘

## GitHub Repository
- **Remote URL**: `git@github.com:Sahiljangra115/Signoz-hackathon.git`
- **Main Branch**: Tracked and pushed successfully

## Active Gaps & Next Steps

### Blocking Submission
- **Demo video (≤ 3 min)** — record a walkthrough showing alert → agent pipeline → SigNoz dashboard
- **Project submission form** — fill and submit via the hackathon portal

### Recently Completed (2026-07-21)
- All 6 SigNoz alert rules live + exported to `deploy/signoz/alert-rules.json`
- SigNoz dashboard (7 panels) built + exported to `deploy/signoz/dashboard-city-surveillance.json`
- Counter temporality bug fixed (metrics now query with correct `cumulative` temporality)
- J verification window bug fixed (1-min window inside 180s budget)
- Submission-grade root README with mermaid architecture, species table, screenshots
- Stamp overlap fix in HQ-UI case detail header
- Two live E2E runs on real alerts (case-0021 escalated, case-0022 neuralyzed)
