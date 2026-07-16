# SigNoz — Feature Reference

Sources:
- https://github.com/SigNoz/signoz
- https://signoz.io/

## What it is

Open-source, OpenTelemetry-native observability platform. Unifies logs, metrics, traces, alerts, dashboards in one tool. Positioned as open-source alternative to Datadog / New Relic, and upgrade path from Prometheus / Jaeger / Elastic / Loki.

## Core Observability Pillars

- **Traces** — distributed tracing, flamegraphs, waterfall views, service topology mapping
- **Metrics** — infra + custom metrics, dashboards
- **Logs** — ingestion, search, correlation, visual query builder, configurable retention, S3 cold storage
- **Dashboards** — customizable, pre-built templates, Query Builder / PromQL / ClickHouse SQL support
- **Alerts** — multi-channel notifications, actionable alert creation
- **Error/Exception tracking** — derived from OpenTelemetry trace data
- **LLM/AI observability** — trace RAG pipelines, prompts, token usage, LLM call tracking & perf analysis

## Feature List (exhaustive)

### APM
- Service latency, error rate, throughput, DB call tracking
- Service topology mapping
- Exception tracking from trace data

### Distributed Tracing
- Request tracking across microservices
- Bottleneck identification
- Span-based debugging context
- Trace funnels — analyze request-flow drop-offs

### Logs
- Multi-scale ingestion & analysis
- Visual query builder
- Configurable retention
- Cold storage via S3

### Metrics & Dashboards
- Infra monitoring (Kubernetes clusters, nodes, pods, host-level)
- Custom metrics
- Pre-built templates
- Flexible querying: Query Builder, PromQL, ClickHouse SQL

### Signal Correlation
- Logs + metrics + traces correlated together
- Semantic-convention-based correlation
- Context-rich cross-signal debugging

### LLM/AI Observability
- LLM call tracking
- RAG pipeline tracing
- Token usage / cost monitoring
- Performance analysis for AI apps

### Agent-Native Features (new)
- SigNoz MCP (Model Context Protocol) server — lets coding agents (Claude Code, Cursor) query observability data
- "Noz" AI assistant (Cloud only) — incident investigation, dashboard building, natural language queries
- Production debugging without leaving dev environment

### Alerts
- Multiple notification channels
- Actionable alert creation

## Tech Stack

- TypeScript 54.7%, Go 35.7%, Python 5.1%, SCSS 4.2%
- Storage: ClickHouse (columnar DB), optimized for high-cardinality observability data

## Deployment Options

1. **SigNoz Cloud** — managed, 30-day free trial, usage-based pricing from $49
2. **Self-hosted** — Docker, Kubernetes, Linux, Foundry
3. **Enterprise** — custom, BYOC (Bring Your Own Cloud), managed self-hosted (on-prem by SigNoz)

Multi-region cloud: US, EU, India.

## Data Ingestion

- 50+ data sources supported
- OpenTelemetry-native ingestion engine
- Handles 10TB+ daily ingestion (proven capacity)

## Querying

- DIY Query Builder
- PromQL
- ClickHouse native SQL
- Query API keys for programmatic access

## OpenTelemetry Integration

- OTel-first docs and design
- Full semantic convention support
- Opamp-supported configurable pipelines
- Messaging queue monitoring via trace/metric data

## Security & Compliance

- SSO, SAML
- HIPAA compliant
- SOC 2 certified
- Data residency options

## Pricing Model

- Usage-based (not per-user, not per-host/container/node)
- Metrics: $0.1 per million samples
- No vendor lock-in (OTel foundation)

## Differentiators vs Competitors

| vs | SigNoz advantage |
|---|---|
| Prometheus | adds logs, traces, dashboards beyond just metrics |
| Jaeger | adds metrics, logs, analytics beyond tracing |
| Elastic | ~50% lower resource use on log ingestion (columnar arch) |
| Loki | better label handling, no stream limit errors |

## Repo / Community Stats

- ~29.7k GitHub stars, 2.3k forks
- 6,610 commits on main
- 1.2k open issues, 287 open PRs
- Latest release: v0.133.0 (268 total releases)
- 140+ contributors
- 4.5k+ community members (Slack)
- 10M+ downloads claimed
- License: open-source (Code of Conduct + security policy documented)

## Integration Ecosystem

- OpenTelemetry collectors
- Prometheus
- Kubernetes (incl. CLI integration)
- Cloud providers: AWS, GCP, Azure
- Databases, language frameworks
- Git, Jira, Cloud Provider CLIs
- LLM tooling

## Unique Selling Points

1. Open-source Datadog/New Relic alternative
2. Unified platform — kills tool fragmentation
3. Flexible deploy: cloud or self-host
4. No lock-in — built on OpenTelemetry
5. Enterprise scale — 10TB+/day ingestion
6. Strong dev/community traction
7. AI coding-agent integration for in-editor debugging
