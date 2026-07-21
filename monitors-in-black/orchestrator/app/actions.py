"""Agent J's world: the ONLY operations that can ever run.

The LLM picks an action_id; it never produces commands. Unknown id = no-op + escalate.
"""
import logging
import os
import time
import json

from . import store, signoz_client

log = logging.getLogger("actions")

# action_id -> (kind, target)
ALLOWLIST = {
    "disable_flag:latency_leech": ("flag", "latency_leech"),
    "disable_flag:error_swarm": ("flag", "error_swarm"),
    "disable_flag:token_devourer": ("flag", "token_devourer"),
    "disable_flag:memory_worm": ("flag", "memory_worm"),
    "disable_flag:zombie_loop": ("flag", "zombie_loop"),
    "disable_flag:ghost": ("flag", "ghost"),
    "purge_queue": ("purge_queue", "queue"),
    "restart_city": ("docker_restart", "city"),
    "restart_trafficgen": ("docker_restart", "trafficgen"),
}


def execute(action_id: str) -> tuple[bool, str]:
    entry = ALLOWLIST.get(action_id)
    if entry is None:
        return False, f"action '{action_id}' not in allowlist"
    kind, target = entry
    if kind == "flag":
        ok = store.disable_flag(target)
        return ok, f"flag {target} disabled" if ok else f"unknown flag {target}"
    if kind == "purge_queue":
        ok = store.purge_queue()
        return ok, "queue purged and zombie_loop disabled" if ok else "failed to purge queue"
    if kind == "docker_restart":
        # Clear respective species flags before restarting the container
        if target == "city":
            store.disable_flag("latency_leech")
            store.disable_flag("memory_worm")
        elif target == "trafficgen":
            store.disable_flag("ghost")
            
        try:
            import docker

            client = docker.from_env()
            client.containers.get(target).restart(timeout=10)
            return True, f"container {target} restarted and flags cleared"
        except Exception as exc:  # docker missing or container absent: escalate, never crash
            log.warning("restart failed: %s", exc)
            return False, f"restart of {target} failed: {exc}"
    return False, "unreachable"


def verify(action_id: str, case: dict = None) -> bool:
    entry = ALLOWLIST.get(action_id)
    if not entry:
        return False
    
    kind, target = entry
    
    # 1. Quick local sanity check first
    if kind == "flag":
        if not store.flag_is_off(target):
            return False
    elif kind == "purge_queue":
        try:
            q = json.loads(store.QUEUE.read_text())
            if len(q) > 0:
                return False
        except Exception:
            return False
    elif kind == "docker_restart":
        # Ensure the respective flag is cleared first
        if target == "city":
            if not store.flag_is_off("latency_leech") or not store.flag_is_off("memory_worm"):
                return False
        elif target == "trafficgen":
            if not store.flag_is_off("ghost"):
                return False

    # 2. If no API key configured, container status or local state is our source of truth
    if not os.getenv("SIGNOZ_API_KEY"):
        if kind == "docker_restart":
            try:
                import docker
                client = docker.from_env()
                container = client.containers.get(target)
                if container.status == "running":
                    log.info("No SIGNOZ_API_KEY, verified container %s is running", target)
                    return True
                return False
            except Exception:
                return False
        if kind == "purge_queue":
            try:
                q = json.loads(store.QUEUE.read_text())
                return len(q) == 0
            except Exception:
                return False
        log.info("No SIGNOZ_API_KEY, fallback verify passed for %s", action_id)
        return True

    # 3. SigNoz verification loop (3 minutes)
    #
    # Query a 1-minute window, not 2: a trailing window still contains the slow
    # or failing spans from before the fix, so a 2-minute window can never go
    # clean inside the loop budget and every case escalates on a good action.
    log.info("Starting SigNoz verification loop for %s", action_id)
    consecutive_success = 0
    start_time = time.time()
    
    # Select target species to query based on case context to avoid signal mismatch
    species = case.get("species") if case else None
    if not species:
        species = target
        if action_id == "restart_city":
            species = "latency_leech"
        elif action_id == "restart_trafficgen":
            species = "ghost"
        elif action_id in ("purge_queue", "disable_flag:zombie_loop"):
            species = "zombie_loop"
        
    while time.time() - start_time < 180:
        success = False
        try:
            if species == "latency_leech":
                p99 = signoz_client.query_p99_latency("city", window_min=1)
                if p99 is not None and p99 < 2000.0:
                    success = True
            elif species == "error_swarm":
                rate = signoz_client.query_error_rate("city", window_min=1)
                if rate is not None and rate < 20.0:
                    success = True
            elif species == "token_devourer":
                val = signoz_client.metric_latest("city.llm.output_tokens", agg="rate")
                if val is not None and val < 50.0:
                    success = True
            elif species == "memory_worm":
                val = signoz_client.metric_latest("city.process.memory.rss", agg="latest")
                if val is not None and val < 400 * 1024 * 1024:
                    success = True
            elif species == "zombie_loop":
                logs = signoz_client.recent_logs_matching("worker retry", minutes=2, limit=5)
                if len(logs) == 0:
                    success = True
            elif species == "ghost":
                val = signoz_client.metric_latest("city.chat.requests", agg="rate")
                if val is not None and val >= 0.5:
                    success = True
            else:
                success = False
        except Exception as exc:
            log.warning("Verification poll failed: %s", exc)
            success = False
            
        if success:
            consecutive_success += 1
            log.info("Verification poll success (%d/2)", consecutive_success)
        else:
            consecutive_success = 0
            log.info("Verification poll failed/pending")
            
        if consecutive_success >= 2:
            log.info("Verification succeeded for %s", action_id)
            return True
            
        time.sleep(20)
        
    log.warning("Verification timed out after 180s for %s", action_id)
    return False
