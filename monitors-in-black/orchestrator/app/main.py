"""HQ Orchestrator: SigNoz webhook in, agent pipeline, HQ API + SSE out.

API contract: see .scratch/agents-of-signoz/plan-ui.md §5.4 (binding).
"""
import asyncio
import base64
import calendar
import hmac
import logging
import os
import time
import secrets
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse

from . import bus, pipeline, store, signoz_client

log = logging.getLogger("main")

# Fail-safe secure webhook secret if unset. Smoke tests and local dev set it explicitly.
env_secret = os.getenv("WEBHOOK_SECRET")
if env_secret:
    WEBHOOK_SECRET = env_secret
else:
    WEBHOOK_SECRET = secrets.token_hex(32)
    log.warning("WEBHOOK_SECRET unset! Generated secure fallback: %s", WEBHOOK_SECRET)

ACTIVE = ("open", "investigating")
BACKGROUND_TASKS = set()

METRICS_CACHE = {
    "data": None,
    "expires_at": 0.0
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sweep
    try:
        cases = store.load_cases()
        for case in cases:
            if case.get("status") in ACTIVE:
                opened_at_str = case.get("opened_at")
                if opened_at_str:
                    try:
                        t_struct = time.strptime(opened_at_str, "%Y-%m-%dT%H:%M:%SZ")
                        opened_at_t = calendar.timegm(t_struct)
                        utc_now = time.time()
                        if utc_now - opened_at_t > 600:
                            case["status"] = "escalated"
                            case["timeline"].append({
                                "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                "agent": "Z",
                                "message": "Z: Case lost during shift change/system restart; escalating to human."
                            })
                            store.save_case(case)
                    except Exception as e:
                        log.warning("Failed to parse opened_at for case %s: %s", case.get("id"), e)
    except Exception as e:
        log.warning("Startup sweep failed: %s", e)
    yield


app = FastAPI(title="Monitors in Black HQ", lifespan=lifespan)


def is_authorized(request: Request) -> bool:
    token = request.headers.get("x-agency-token") or request.headers.get("x-mib-token")
    if not token:
        token = request.query_params.get("token")
    if not token:
        auth_hdr = request.headers.get("authorization")
        if auth_hdr and auth_hdr.lower().startswith("basic "):
            try:
                encoded = auth_hdr.split(" ", 1)[1]
                decoded = base64.b64decode(encoded).decode("utf-8")
                if ":" in decoded:
                    _, password = decoded.split(":", 1)
                    token = password
            except Exception:
                pass
    if not token:
        return False
    # Safely compare digests using bytes to prevent type errors on non-ASCII tokens
    return hmac.compare_digest(
        token.encode("utf-8", errors="ignore"),
        WEBHOOK_SECRET.encode("utf-8", errors="ignore")
    )


@app.post("/hooks/signoz")
async def signoz_hook(request: Request):
    if not is_authorized(request):
        log.warning("Unauthenticated webhook alert request rejected")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    
    alerts = payload.get("alerts")
    if isinstance(alerts, list) and alerts:
        last_case = None
        for a in alerts:
            labels = a.get("labels", {})
            annotations = a.get("annotations", {})
            rule = (
                labels.get("alertname")
                or annotations.get("summary")
                or payload.get("ruleName")
                or "unknown"
            )
            if a.get("status") == "resolved":
                continue
                
            alert_normalized = {
                "rule": rule,
                "service": labels.get("service") or "city",
                "payload": a,
            }
            case = pipeline.dispatch(alert_normalized)
            if case:
                task = asyncio.create_task(pipeline.run_case(case))
                BACKGROUND_TASKS.add(task)
                task.add_done_callback(BACKGROUND_TASKS.discard)
                last_case = case
        if last_case:
            return {"status": "case-opened", "case_id": last_case["id"]}
        return {"status": "no-new-alert"}
    else:
        rule = (
            payload.get("ruleName")
            or payload.get("rule")
            or payload.get("alertname")
            or "unknown"
        )
        alert_normalized = {
            "rule": rule,
            "service": payload.get("service") or "city",
            "payload": payload,
        }
        case = pipeline.dispatch(alert_normalized)
        if case is None:
            return {"status": "duplicate-folded"}
        task = asyncio.create_task(pipeline.run_case(case))
        BACKGROUND_TASKS.add(task)
        task.add_done_callback(BACKGROUND_TASKS.discard)
        return {"status": "case-opened", "case_id": case["id"]}


@app.get("/api/cases")
def api_cases():
    cases = sorted(store.load_cases(), key=lambda c: c.get("opened_at") or "", reverse=True)
    return {"cases": cases}


@app.get("/api/registry")
def api_registry():
    species = [
        {
            "species_id": e.get("species"),
            "codename": (e.get("codename") or "").upper(),
            "threat_level": e.get("threat_level"),
            "signature": e.get("signature"),
            "captures": e.get("captures", 0),
            "last_seen": e.get("last_seen"),
        }
        for e in store.load_registry()
    ]
    return {"species": species}


@app.get("/api/stats")
def api_stats():
    # ponytail: scans disk cases directory every call, fine for low count demo cases; use database if scaled
    cases = store.load_cases()
    active = [c for c in cases if c.get("status") in ACTIVE]
    
    agent_last_ts = {"Z": None, "K": None, "J": None, "O": None}

    # Process timeline in a single O(N) pass to avoid disk rescans
    for c in cases:
        for t in c.get("timeline", []):
            agent = t.get("agent")
            ts = t.get("ts")
            if agent in agent_last_ts and ts:
                if not agent_last_ts[agent] or ts > agent_last_ts[agent]:
                    agent_last_ts[agent] = ts


    k_count = sum(1 for c in cases if c.get("species"))
    j_count = sum(1 for c in cases if c.get("action"))
    o_count = sum(1 for c in cases if c.get("report_md"))
    
    return {
        "city_status": "BREACH" if active else "NOMINAL",
        "active_cases": len(active),
        "neuralyzed_total": sum(1 for c in cases if c.get("status") == "neuralyzed"),
        "agents_on_duty": 4,
        "agents": {
            "Z": {"count": len(cases), "last_action_at": agent_last_ts["Z"]},
            "K": {"count": k_count, "last_action_at": agent_last_ts["K"]},
            "J": {"count": j_count, "last_action_at": agent_last_ts["J"]},
            "O": {"count": o_count, "last_action_at": agent_last_ts["O"]},
        },
    }


@app.get("/api/metrics-snapshot")
def api_metrics_snapshot():
    now = time.time()
    if METRICS_CACHE["data"] and METRICS_CACHE["expires_at"] > now:
        return METRICS_CACHE["data"]
        
    req_per_s = None
    p99_ms = None
    tokens_per_min = None
    error_rate_pct = None
    stale = False
    
    if not os.getenv("SIGNOZ_API_KEY"):
        # SigNoz not connected: return None values instead of fabricating fake data
        stale = True
    else:
        try:
            # Query actual rate from SigNoz requests metric
            req_val = signoz_client.metric_latest("city.chat.requests", agg="rate")
            req_per_s = float(req_val) if req_val is not None else 0.0
            
            # Query actual p99 latency scalar
            p99_val = signoz_client.query_p99_latency("city", window_min=2)
            p99_ms = float(p99_val) if p99_val is not None else 0.0
            
            # Query error rate scalar
            err_val = signoz_client.query_error_rate("city", window_min=2)
            error_rate_pct = float(err_val) if err_val is not None else 0.0
                
            # Query metrics rate
            tok_val = signoz_client.metric_latest("city.llm.output_tokens", agg="rate")
            # Convert rate/sec to tokens/minute
            tokens_per_min = (float(tok_val) * 60.0) if tok_val is not None else 0.0
            
        except Exception as e:
            log.warning("Failed to fetch metric snapshots: %s", e)
            stale = True

    METRICS_CACHE["data"] = {
        "req_per_s": req_per_s,
        "p99_ms": p99_ms,
        "tokens_per_min": tokens_per_min,
        "error_rate_pct": error_rate_pct,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "stale": stale
    }
    METRICS_CACHE["expires_at"] = now + 10.0
    return METRICS_CACHE["data"]


@app.get("/api/events")
async def api_events():
    # Return proxy headers to prevent Nginx buffering the event stream
    return StreamingResponse(
        bus.stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )
