# SigNoz Alert Rules for Monitors in Black

Configure the following alert rules inside the SigNoz Alerts console. Set the notification channel to the `mib-hq` Webhook.

## Webhook Channel Configuration
- **Type**: Webhook
- **URL**: `http://host.docker.internal:8100/hooks/signoz?token=change-me`
- **Authentication**: Basic Auth (Username: `mib`, Password: `change-me`)

---

## Alert Rules Reference

### 1. LatencyLeech
- **Type**: Trace / APM Metric
- **Query**: Filter: `serviceName = 'city' AND name = 'POST /chat'`, Metric: `p99(duration)`
- **Condition**: `> 2000ms` (2 seconds)
- **Evaluation Window**: 2 minutes
- **Evaluation Interval**: 1 minute
- **Description**: Latency Leech anomaly is slowing down /chat requests.

### 2. ErrorSwarm
- **Type**: Trace / APM Error
- **Query**: 
  - Query A: `count(traces) where has_error = true`
  - Query B: `count(traces) where serviceName = 'city'`
  - Formula: `A / B * 100`
- **Condition**: `> 20%`
- **Evaluation Window**: 1 minute
- **Description**: Error Swarm anomaly is triggering HTTP 500 exceptions on /chat.

### 3. TokenDevourer
- **Type**: Custom Metric
- **Query**: Metric: `city.llm.output_tokens`, Aggregate: `sum`, Rate: `1m`
- **Condition**: `> 50` (tokens/sec)
- **Evaluation Window**: 2 minutes
- **Description**: Token Devourer anomaly is consuming excessive LLM completion tokens.

### 4. MemoryWorm
- **Type**: Host/Process Metric
- **Query**: Metric: `city.process.memory.rss`, Aggregate: `last`
- **Condition**: `> 419430400` bytes (400MB)
- **Evaluation Window**: 3 minutes
- **Description**: Memory Worm leak is pushing City memory consumption close to the container limits.

### 5. ZombieLoop
- **Type**: Log Count
- **Query**: Filter: `serviceName = 'city' AND body CONTAINS 'worker retry'`
- **Condition**: Count `> 20`
- **Evaluation Window**: 2 minutes
- **Description**: Zombie Loop anomaly is retrying poison messages, causing log floods.

### 6. TheGhost
- **Type**: Request Rate
- **Query**: Metric: `city.chat.requests`, Aggregate: `rate`
- **Condition**: `< 0.2` (requests/sec)
- **Evaluation Window**: 3 minutes
- **Description**: The Ghost anomaly has vanished 90% of citizen chat traffic.
