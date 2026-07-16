"""Evidence collection from the SigNoz Query API.

Follows the verified v5 Query Range schema.
"""
import json
import time
import logging
import os
import re
from concurrent.futures import ThreadPoolExecutor

import httpx

log = logging.getLogger("signoz")

SIGNOZ_URL = os.getenv("SIGNOZ_URL", "http://localhost:8080")
API_KEY = os.getenv("SIGNOZ_API_KEY", "")

MAX_EVIDENCE_CHARS = 20_000

# ponytail: shared module-level client, fine for local single-process traffic; use async client pool if request volume grows
http_client = httpx.Client(timeout=15.0)


def _headers() -> dict:
    headers = {"Content-Type": "application/json"}
    if API_KEY:
        headers["SIGNOZ-API-KEY"] = API_KEY
    return headers


def sanitize_field(val: str) -> str:
    # Whitelist safe characters for metric names, service names, and basic queries
    return re.sub(r"[^a-zA-Z0-9_\-\.\:\/]", "", val)


def query_range(payload: dict) -> dict:
    if not API_KEY:
        log.warning("SIGNOZ_API_KEY empty, skipping request")
        return {}
    try:
        resp = http_client.post(
            f"{SIGNOZ_URL}/api/v5/query_range",
            headers=_headers(),
            json=payload
        )
        resp.raise_for_status()
        return resp.json().get("data", {})
    except Exception as exc:
        log.warning("SigNoz query_range failed: %s", exc)
        return {}


def query_error_logs(service: str, window_min: int = 15, limit: int = 20) -> list[dict]:
    service = sanitize_field(service)
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (window_min * 60 * 1000)
    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "raw",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "logs",
                        "filter": {
                            "expression": f"service.name = '{service}' AND severity_text = 'ERROR'"
                        },
                        "order": [{"key": {"name": "timestamp"}, "direction": "desc"}],
                        "limit": limit
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    deduped = []
    seen = set()
    if results:
        rows = results[0].get("rows", [])
        for row in rows:
            data = row.get("data", {})
            body = data.get("body") or ""
            ts = row.get("timestamp") or data.get("timestamp") or int(time.time() * 1000)
            key = f"{body}-{ts}"
            if key not in seen:
                seen.add(key)
                deduped.append({
                    "ts": ts,
                    "severity": data.get("severity_text", "ERROR"),
                    "body": body,
                    "trace_id": data.get("trace_id", "")
                })
                if len(deduped) >= limit:
                    break
    return deduped


def query_slow_traces(service: str, window_min: int = 15, limit: int = 10) -> list[dict]:
    service = sanitize_field(service)
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (window_min * 60 * 1000)
    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "raw",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "traces",
                        "filter": {
                            "expression": f"service.name = '{service}'"
                        },
                        "order": [{"key": {"name": "duration_nano"}, "direction": "desc"}],
                        "limit": limit
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    deduped = []
    seen = set()
    if results:
        rows = results[0].get("rows", [])
        for row in rows:
            data = row.get("data", {})
            span_id = data.get("span_id")
            if span_id and span_id not in seen:
                seen.add(span_id)
                dur_nano = data.get("duration_nano", 0)
                has_err = data.get("has_error", False)
                # Map has_error true to STATUS_CODE_ERROR, false to STATUS_CODE_UNSET
                status = "STATUS_CODE_ERROR" if has_err else "STATUS_CODE_UNSET"
                deduped.append({
                    "trace_id": data.get("trace_id", ""),
                    "span_id": span_id,
                    "name": data.get("name", "llm_call"),
                    "duration_ms": int(dur_nano / 1000000.0) if dur_nano else 0,
                    "status": status
                })
                if len(deduped) >= limit:
                    break
    return deduped


def recent_logs_matching(expr: str, minutes: int = 15, limit: int = 10) -> list[dict]:
    # Replace single quotes to prevent injection
    safe_expr = expr.replace("'", "\\'")
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (minutes * 60 * 1000)
    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "raw",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "logs",
                        "filter": {
                            "expression": f"service.name = 'city' AND body CONTAINS '{safe_expr}'"
                        },
                        "limit": limit
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    deduped = []
    seen = set()
    if results:
        rows = results[0].get("rows", [])
        for row in rows:
            data = row.get("data", {})
            body = data.get("body") or ""
            ts = row.get("timestamp") or data.get("timestamp") or int(time.time() * 1000)
            key = f"{body}-{ts}"
            if key not in seen:
                seen.add(key)
                deduped.append({
                    "ts": ts,
                    "severity": data.get("severity_text", "INFO"),
                    "body": body,
                    "trace_id": data.get("trace_id", "")
                })
                if len(deduped) >= limit:
                    break
    return deduped


def metric_latest(metric: str, agg: str = "sum") -> float | None:
    # Use series query over last 5 minutes to extract last non-partial value
    series = metric_series(metric, agg, minutes=5)
    if series:
        return series[-1]["value"]
    return None


def metric_series(metric: str, agg: str = "sum", minutes: int = 15) -> list[dict]:
    metric = sanitize_field(metric)
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (minutes * 60 * 1000)
    
    # Map raw aggregation name to correct v5 aggregator
    v5_agg = "latest" if agg == "latest" else "sum" if agg == "sum" else "avg" if agg == "avg" else "rate"

    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "time_series",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "metrics",
                        "stepInterval": 10,
                        "aggregations": [
                            {
                                "metricName": metric,
                                "temporality": "unspecified",
                                "timeAggregation": v5_agg,
                                "spaceAggregation": "sum"
                            }
                        ]
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    series = []
    if results:
        aggregations = results[0].get("aggregations", [])
        if aggregations:
            series_list = aggregations[0].get("series", [])
            if series_list:
                values = series_list[0].get("values", [])
                for val in values:
                    # Skip NaN/Inf and partial elements
                    if val.get("partial"):
                        continue
                    v = val.get("value")
                    ts = val.get("timestamp")
                    if v is not None and ts is not None:
                        try:
                            # NaN and Inf are strings in SigNoz v5 response JSON
                            if v in ("NaN", "Inf", "-Inf"):
                                continue
                            series.append({
                                "ts": int(ts),
                                "value": float(v)
                            })
                        except (ValueError, TypeError):
                            pass
    return series


def query_p99_latency(service: str, window_min: int = 2) -> float | None:
    service = sanitize_field(service)
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (window_min * 60 * 1000)
    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "scalar",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "traces",
                        "filter": {
                            "expression": f"service.name = '{service}' AND name = 'POST /chat'"
                        },
                        "aggregations": [{"expression": "p99(duration_nano)"}]
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    if results:
        data_block = results[0].get("data", [])
        columns = results[0].get("columns", [])
        agg_idx = None
        for i, col in enumerate(columns):
            if col.get("columnType") == "aggregation":
                agg_idx = i
                break
        if agg_idx is not None and data_block:
            try:
                v = data_block[0][agg_idx]
                if v not in (None, "NaN", "Inf", "-Inf"):
                    return float(v) / 1000000.0  # convert ns to ms
            except (IndexError, ValueError, TypeError):
                pass
    return None


def query_error_rate(service: str, window_min: int = 2) -> float | None:
    service = sanitize_field(service)
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - (window_min * 60 * 1000)
    payload = {
        "start": start_ms,
        "end": end_ms,
        "requestType": "scalar",
        "compositeQuery": {
            "queries": [
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "A",
                        "signal": "traces",
                        "filter": {
                            "expression": f"service.name = '{service}' AND has_error = true"
                        },
                        "aggregations": [{"expression": "count()"}]
                    }
                },
                {
                    "type": "builder_query",
                    "spec": {
                        "name": "B",
                        "signal": "traces",
                        "filter": {
                            "expression": f"service.name = '{service}'"
                        },
                        "aggregations": [{"expression": "count()"}]
                    }
                },
                {
                    "type": "builder_formula",
                    "spec": {
                        "name": "F1",
                        "expression": "A/B*100"
                    }
                }
            ]
        }
    }
    resp = query_range(payload)
    results = resp.get("data", {}).get("results", [])
    for r in results:
        if r.get("queryName") == "F1":
            data_block = r.get("data", [])
            columns = r.get("columns", [])
            agg_idx = None
            for i, col in enumerate(columns):
                if col.get("columnType") == "aggregation":
                    agg_idx = i
                    break
            if agg_idx is not None and data_block:
                try:
                    v = data_block[0][agg_idx]
                    if v not in (None, "NaN", "Inf", "-Inf"):
                        return float(v)
                except (IndexError, ValueError, TypeError):
                    pass
    return None


def gather_evidence(alert: dict) -> list[dict]:
    service = sanitize_field(alert.get("service", "city"))
    rule = (alert.get("rule") or "").lower()
    evidence = []

    # Parallelize trace, log, and metric queries using a thread pool to avoid head-of-line blocking
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_traces = executor.submit(query_slow_traces, service, 15, 10)
        future_logs = executor.submit(query_error_logs, service, 15, 20)
        future_zombie = executor.submit(recent_logs_matching, "worker retry", 15, 10) if ("zombie" in rule or "log" in rule) else None
        
        # Parallel metrics gathering
        metrics_to_fetch = ["city.llm.output_tokens", "city.process.memory.rss", "city.chat.requests"]
        future_metrics = {m: executor.submit(metric_latest, m) for m in metrics_to_fetch}

        # 1. Fetch slow traces
        try:
            traces = future_traces.result()
            for t in traces:
                evidence.append({
                    "type": "trace",
                    "ref": f"trace:{t['trace_id']}",
                    "excerpt": f"Span: {t['name']}, Duration: {t['duration_ms']}ms, Status: {t['status']}"[:400]
                })
        except Exception as e:
            evidence.append({"type": "note", "ref": "trace_error", "excerpt": f"trace query failed: {e}"[:400]})

        # 2. Fetch error logs
        try:
            logs = future_logs.result()
            for l in logs:
                evidence.append({
                    "type": "log",
                    "ref": f"log:{l['ts']}",
                    "excerpt": f"[{l['severity']}] {l['body']}"[:400]
                })
        except Exception as e:
            evidence.append({"type": "note", "ref": "log_error", "excerpt": f"log query failed: {e}"[:400]})

        # 3. Fetch zombie loop retry logs
        if future_zombie:
            try:
                matched_logs = future_zombie.result()
                for l in matched_logs:
                    evidence.append({
                        "type": "log",
                        "ref": f"log:{l['ts']}",
                        "excerpt": f"[ZOMBIE LOG] {l['body']}"[:400]
                    })
            except Exception:
                pass

        # 4. Fetch metrics
        for metric_name, fut in future_metrics.items():
            try:
                val = fut.result()
                if val is not None:
                    evidence.append({
                        "type": "metric",
                        "ref": f"metric:{metric_name}",
                        "excerpt": f"Latest value for {metric_name}: {val}"[:400]
                    })
            except Exception:
                pass

    # Cap total payload before it ever reaches the model
    total = 0
    capped = []
    for item in evidence:
        total += len(item["excerpt"])
        if total > MAX_EVIDENCE_CHARS:
            break
        capped.append(item)
    return capped
